// The two reviewers the operator added to WO-281's first round: one reads
// the rewritten pages as instructions a person follows, the other for
// machine-made filler. Each is one Codex worker, read-only, given the
// worker's standing rules and the brief beside this file, and nothing of
// the executor's account of its work. The launch copies the meta critic's
// (docs/evidence/WO-276/critic/launch.mjs), since the review helper's kinds
// take no brief of the caller's.
//
//   node docs/evidence/WO-281/reviewers/launch.mjs <usability|filler> <round>
//        [--recheck <its earlier report>] [--worker <name>] [--base <revision>]
//        [--print]
//
// The report is saved as
// docs/control/local/reviews/WO-281/round-<round>-<kind>.md in the ignored
// reviews lane, never over an existing report. --recheck gives the reviewer
// its own earlier report and asks it to confirm the changes made in answer
// and to read the pages whole again. --print writes the brief as it would
// be sent and launches nothing. Run it in the background.
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { closeLeftoverCodexServers } from "../../../../scripts/lib/codex-background.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repository = resolve(here, "../../../..");
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
const workerName = option("worker", "astra");
const recheck = option("recheck");
const base = execFileSync(
  "git",
  ["rev-parse", "--verify", `${option("base", "main")}^{commit}`],
  { cwd: repository, encoding: "utf8" },
).trim();
const [kind, round] = args;
if (!["usability", "filler"].includes(kind) || !/^[1-9]\d*$/u.test(round ?? ""))
  throw new Error(
    "usage: node launch.mjs <usability|filler> <round> [--recheck <report>] [--worker <name>] [--base <revision>] [--print]",
  );

const fields = { REPOSITORY: repository, BASE: base, ROUND: round };
let brief = readFileSync(join(here, `${kind}.brief.md`), "utf8").replace(
  /@([A-Z_]+)@/gu,
  (whole, name) => fields[name] ?? whole,
);
if (recheck)
  brief += [
    "",
    "This round is a recheck. Your own report of the earlier round follows this paragraph. The pages have been changed in answer to it. First, for each of your findings, say whether the page as it now stands answers it, in a section `## Rechecked` that comes before the three above, one line a finding. Then read both pages whole again against the standard. In `## Findings` list a new finding only where a reader following the passage does the wrong thing or cannot finish the task; list any other new one in a last section, `## Recorded`.",
    "",
    "Your earlier report:",
    "",
    readFileSync(resolve(recheck), "utf8"),
  ].join("\n");
if (print) {
  process.stdout.write(brief);
  process.exit(0);
}

const lane = join(repository, "docs/control/local/reviews/WO-281");
const path = join(lane, `round-${round}-${kind}.md`);
if (existsSync(path)) throw new Error(`a report is already at ${path}`);

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
    env: { ...process.env, CODEX_THREAD_ID: "reviewer" },
  },
);
if (shown.status !== 0) throw new Error(shown.stderr || "show failed");
const worker = JSON.parse(shown.stdout);
const preamble = worker.session?.preamble;
if (!preamble) throw new Error("the worker's standing rules were not printed");

const capture = mkdtempSync(join(tmpdir(), "dotln-reviewer-"));
const last = join(capture, "last-message.txt");
// The flags of the meta critic's launch, which were the review helper's own
// when that launcher was written: no approvals, no network, no project
// instructions, no memory, a read-only sandbox.
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
    timeout: 40 * 60 * 1000,
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
  throw new Error(`the ${kind} reviewer returned nothing (exit ${run.status})`);
}
mkdirSync(lane, { recursive: true });
writeFileSync(path, report.endsWith("\n") ? report : `${report}\n`);
// What the host itself said of the session it ran (its model among them)
// is the head of its own output; kept beside the report, so that a record
// of what ran can cite the host and not this launcher's request.
writeFileSync(
  path.replace(/\.md$/u, ".host.txt"),
  `${(run.stderr || "").split("\n").slice(0, 40).join("\n")}\n`,
);
console.log(
  `${kind} reviewer, round ${round}: ${worker.model.id} at ${worker.effort}; base ${base.slice(0, 9)}; ${Math.round((Date.now() - started) / 60000)} min; ${path}`,
);
