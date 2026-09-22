// WO-064 live smoke, operator-run against an existing, empty scratch GitHub
// repository the operator owns. It creates a synthetic target, runs one real
// source-change episode with the deterministic double writer (no model), and
// publishes it through publishTargetOrder: the same function `worktree publish
// --target` calls. Only shapes are recorded; the pull request stays open for
// WO-065's smoke. Usage, from this worktree after `npm run build`:
//   node docs/evidence/WO-064/smoke.mjs --repo <owner>/<empty-scratch-repo>
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compileLoadout } from "@dotln/compiler";
import { decodeLog } from "@dotln/kernel";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import {
  createSourceFixture,
  fixtureGit,
  sourceFixtureOptions,
} from "../../../packages/skeleton/dist/test/source-change-fixture.js";
import { mainWorktree } from "../../../scripts/lib/git.mjs";
import {
  publishTargetOrder,
  writerLoadout,
} from "../../../scripts/lib/target-publish.mjs";

const launchpad = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
// A local rehearsal over stubs writes elsewhere; the live record is write-once.
const record =
  process.env.DOTLN_WO064_SMOKE_RECORD ??
  fileURLToPath(new URL("./smoke.json", import.meta.url));
const BRANCH = "fix/fixture-text";
const MESSAGE = "fix: record the synthetic worker line\n";

const [flag, repository, ...extra] = process.argv.slice(2);
if (
  flag !== "--repo" ||
  extra.length ||
  !/^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/u.test(repository ?? "")
)
  throw new Error(
    "usage: node docs/evidence/WO-064/smoke.mjs --repo <owner>/<empty-scratch-repo>",
  );
if (realpathSync(process.cwd()) !== launchpad)
  throw new Error("run from the WO-064 worktree root");
const gh = (...args) =>
  execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const scratch = JSON.parse(
  gh("repo", "view", repository, "--json", "isEmpty,nameWithOwner"),
);
if (scratch.isEmpty !== true)
  throw new Error(
    "the scratch repository must be empty; refusing to publish into it",
  );
const protocol =
  gh("config", "get", "git_protocol") === "ssh" ? "ssh" : "https";
const remote =
  protocol === "ssh"
    ? `git@github.com:${scratch.nameWithOwner}.git`
    : `https://github.com/${scratch.nameWithOwner}.git`;

// The synthetic target: one baseline file and its focused test, pushed as main.
const root = createSourceFixture();
const target = join(root, "target");
const baseCommit = readFileSync(join(root, "base.txt"), "utf8");
fixtureGit(target, "remote", "add", "origin", remote);
fixtureGit(target, "push", "--quiet", "origin", "main");

// The operator grant for this scratch path is explicit host input here; the
// committed registry stays empty (WO-064-D004).
const source = JSON.parse(
  readFileSync(
    join(launchpad, "scripts/fixtures/target-publish/loadout.json"),
    "utf8",
  ),
);
const grant = { ...source.authorityGrants[0], repo: target };
source.authorityGrants = [grant];
const environment = {
  environmentId: "wo064.live-smoke",
  version: 1,
  capabilities: [],
  repo: target,
  baseCommit,
};
const writer = compileLoadout(writerLoadout(source), environment);
if (!writer.ok) throw new Error(JSON.stringify(writer.diagnostics));
const host = new SourceChangeHost({
  ...sourceFixtureOptions(root, Date.now, "commit", "codex"),
  workOrder: writer.program.workOrder,
  authorityEnvelope: writer.program.authorityEnvelope,
  authorityEvidence: [],
  artifactIdentity: writer.artifactIdentity,
  branch: BRANCH,
  surfaces: ["fixture.txt"],
  commitMessage: MESSAGE,
});
const episode = await host.run();
if (episode.status !== "observed") throw new Error(JSON.stringify(episode));
host.finish();
const loadoutPath = join(root, "loadout.json");
writeFileSync(loadoutPath, JSON.stringify(source));

// Lint against the main checkout: it holds the instance's local-terms list.
const opened = publishTargetOrder({
  launchpad: mainWorktree(launchpad),
  workOrderId: "WO-064",
  request: {
    loadout: loadoutPath,
    environment,
    store: join(root, "store"),
    baseBranch: "main",
    verificationStore: null,
  },
  registry: [grant],
});
const events = decodeLog(
  readFileSync(join(root, "store/publication/events.jsonl"), "utf8"),
);
const view = JSON.parse(
  gh(
    "pr",
    "view",
    String(opened.number),
    "--repo",
    opened.repositoryId,
    "--json",
    "number,state,headRefName,headRefOid,baseRefName,title,body",
  ),
);
const remoteHead = spawnSync(
  "git",
  ["-C", target, "ls-remote", "origin", `refs/heads/${BRANCH}`],
  { encoding: "utf8" },
).stdout.split("\t")[0];
const generated = readFileSync(
  join(launchpad, "scripts/fixtures/target-publish/body.md"),
  "utf8",
)
  .replaceAll("<base>", baseCommit)
  .replaceAll("<head>", episode.observation.commit);
const sha = (value) =>
  /^[0-9a-f]{40}$/u.test(value) ? "sha1-hex-40" : "unexpected";

writeFileSync(
  record,
  JSON.stringify(
    {
      schemaVersion: 1,
      recordedAt: new Date().toISOString(),
      runner: "operator terminal",
      node: process.version,
      gh: gh("--version")
        .split("\n")[0]
        .replace(/^gh version (\S+).*$/u, "$1"),
      gitProtocol: protocol,
      writer: "deterministic source-change double; no model invocation",
      target: {
        repository: "github.com/<owner>/<scratch-repository>",
        emptyBeforeSmoke: true,
      },
      pushedBranch: {
        name: BRANCH,
        headSha: sha(episode.observation.commit),
        remoteHeadEqualsObservedCommit:
          remoteHead === episode.observation.commit,
        baseSha: sha(baseCommit),
      },
      pullRequest: {
        number:
          Number.isSafeInteger(view.number) && view.number > 0
            ? "positive-integer"
            : "unexpected",
        numberEqualsEvent: view.number === opened.number,
        state: view.state,
        baseRefName: view.baseRefName,
        headRefNameEqualsBranch: view.headRefName === BRANCH,
        headRefOidEqualsPushed: view.headRefOid === episode.observation.commit,
        titleEqualsCommitSubject: view.title === MESSAGE.trim(),
        bodyEqualsPinnedFixture: view.body.trimEnd() === generated.trimEnd(),
      },
      event: {
        count: events.length,
        type: events[0]?.type ?? null,
        actorId: events[0]?.actorId ?? null,
        payloadKeys: Object.keys(events[0]?.payload ?? {}).sort(),
        repositoryIdShape: /^github\.com\/[^/]+\/[^/]+$/u.test(
          opened.repositoryId,
        )
          ? "github.com/<owner>/<repository>"
          : "unexpected",
        headShaEqualsPushed: opened.headSha === episode.observation.commit,
      },
    },
    null,
    2,
  ) + "\n",
  { flag: "wx" },
);
process.stdout.write(
  `Recorded ${record}. Local episode kept for inspection at ${root}; the pull request stays open for WO-065.\n`,
);
