// The meta critic of an executor's conduct, as WO-276 ran it from its
// thirtieth launch on: one Codex worker, read-only, given the worker's
// standing rules and the fixed charter beside this file. The executor writes
// nothing about its own work into the prompt; the critic reads the session
// transcripts and the repository itself. Between launches only the launch
// number changes.
//
//   node docs/evidence/WO-276/critic/launch.mjs <order> <n>
//        [--worker <name>] [--since <YYYY-MM-DD>] [--interval <minutes>]
//        [--transcripts <directory>] [--repository <root>] [--print]
//
// <order> is the work order being executed (WO-NNN) and <n> the launch's
// number. --worker is a name of the instance's worker table (default astra,
// the one WO-276 used); --since and --interval say when the cadence began
// and how often a critic goes out (defaults: today, 75). --transcripts names
// the directory of the host's session transcripts for the checkout where the
// default below does not find it. --print writes the charter as it would be
// sent and launches nothing.
//
// The report is saved as docs/control/local/reviews/<order>/critic-<n>.md,
// in the ignored reviews lane. Run it in the background: it takes about
// fifteen to twenty minutes.
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { closeLeftoverCodexServers } from "../../../../scripts/lib/codex-background.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  if (at < 0) return fallback;
  const [, value] = args.splice(at, 2);
  if (value === undefined) throw new Error(`--${name} takes a value`);
  return value;
};
const print = args.includes("--print");
if (print) args.splice(args.indexOf("--print"), 1);
const repository = resolve(option("repository", resolve(here, "../../../..")));
const workerName = option("worker", "astra");
const since = option("since", new Date().toISOString().slice(0, 10));
const interval = option("interval", "75");
// Claude Code keeps a checkout's transcripts under the user's home, in a
// directory named by the checkout's path with each separator a hyphen
// (observed for this order's worktree; another host or layout names it).
const transcripts = resolve(
  option(
    "transcripts",
    join(homedir(), ".claude", "projects", repository.replaceAll("/", "-")),
  ),
);
const [order, number] = args;
if (!/^WO-\d{3}$/u.test(order ?? "") || !/^\d+$/u.test(number ?? ""))
  throw new Error(
    "usage: node launch.mjs <order> <n> [--worker <name>] [--since <YYYY-MM-DD>] [--interval <minutes>] [--transcripts <directory>] [--repository <root>] [--print]",
  );
if (!existsSync(transcripts))
  throw new Error(
    `no transcripts directory at the default place for ${repository}; name it with --transcripts`,
  );
const orders = join(repository, "docs/work-orders");
const orderFile = readdirSync(orders).find(
  (name) => name.startsWith(`${order}-`) && name.endsWith(".md"),
);
if (!orderFile) throw new Error(`no file of ${order} under docs/work-orders`);

// The charter is the same at every launch but for what names the launch.
const fields = {
  ORDER: order,
  REPOSITORY: repository,
  TRANSCRIPTS: transcripts,
  ORDER_PATH: `docs/work-orders/${orderFile}`,
  INTERVAL: interval,
  SINCE: since,
  NUMBER: number,
};
const brief = readFileSync(join(here, "charter.md"), "utf8").replace(
  /@([A-Z_]+)@/gu,
  (whole, name) => fields[name] ?? whole,
);
if (print) {
  process.stdout.write(brief);
  process.exit(0);
}

// The worker and its standing rules, as the instance's table resolves them.
const shown = spawnSync(
  "npm",
  [
    "run",
    "worker",
    "--silent",
    "--",
    "show",
    workerName,
    "--provider",
    "codex",
  ],
  {
    cwd: repository,
    encoding: "utf8",
    env: { ...process.env, CODEX_THREAD_ID: "critic" },
  },
);
if (shown.status !== 0) throw new Error(shown.stderr || "show failed");
const worker = JSON.parse(shown.stdout);
const preamble = worker.session?.preamble;
if (!preamble) throw new Error("the worker's standing rules were not printed");

const capture = mkdtempSync(join(tmpdir(), "dotln-critic-"));
const last = join(capture, "last-message.txt");
// The flags the review helper's own Codex launch carried when this was
// written (scripts/lib/review-worker.mjs): no approvals, no network, no
// project instructions, no memory, a read-only sandbox.
const disabled = [
  "apps",
  "browser_use",
  "computer_use",
  "image_generation",
  "in_app_browser",
  "in_app_chat",
  "in_app_local_automation",
  "multi_agent",
  "multi_agent_v2",
  "plugins",
  "remote_plugin",
  "hooks",
  "memories",
  "context_management",
  "skill_search",
  "skill_mcp_dependency_install",
  "tool_suggest",
  "workspace_dependencies",
  "shell_snapshot",
  "view_image",
];
const started = Date.now();
const run = spawnSync(
  "codex",
  [
    "-a",
    "never",
    "exec",
    "--ephemeral",
    "--ignore-user-config",
    "--sandbox",
    "read-only",
    "--strict-config",
    "--model",
    worker.model.id,
    "--cd",
    repository,
    "--output-last-message",
    last,
    "-c",
    'approval_policy="never"',
    "-c",
    'web_search="disabled"',
    "-c",
    "project_doc_max_bytes=0",
    "-c",
    "mcp_servers={}",
    "-c",
    "memories.use_memories=false",
    "-c",
    "memories.generate_memories=false",
    "-c",
    'shell_environment_policy.inherit="core"',
    ...disabled.flatMap((feature) => ["--disable", feature]),
    "-c",
    `model_reasoning_effort="${worker.effort}"`,
    "-",
  ],
  {
    cwd: repository,
    input: `${preamble}\n\n${brief}`,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    timeout: 30 * 60 * 1000,
  },
);
// Codex leaves its own background server running when the run ends. This
// launch closes it, when no other Codex process is alive, and says so.
const closed = closeLeftoverCodexServers({ repository });
if (closed) console.log(closed);
let report = "";
try {
  report = readFileSync(last, "utf8");
} catch {
  // No last message: the launch failed before the worker answered.
}
if (!report.trim()) {
  console.error((run.stderr || "").split("\n").slice(-15).join("\n"));
  throw new Error(`the critic returned nothing (exit ${run.status})`);
}
const lane = join(repository, "docs/control/local/reviews", order);
mkdirSync(lane, { recursive: true });
const path = join(lane, `critic-${number}.md`);
writeFileSync(path, report.endsWith("\n") ? report : `${report}\n`);
console.log(
  `critic ${number}: ${worker.model.id} at ${worker.effort}; ${Math.round((Date.now() - started) / 60000)} min; ${path}`,
);
