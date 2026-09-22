// WO-064: target publication over real source-change episodes, a local bare
// origin behind a GitHub URL and the gh stub. No network or vendor CLI.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import { SourceChangeHost } from "../packages/skeleton/dist/src/source-change-host.js";
import {
  runVerificationDemo,
  verificationFixtureCriteria,
} from "../packages/skeleton/dist/src/verification-demo.js";
import { FakeVerificationTransport } from "../packages/skeleton/dist/src/verification-fake.js";
import {
  createSourceFixture,
  fixtureGit,
  sourceFixtureOptions,
} from "../packages/skeleton/dist/test/source-change-fixture.js";
import { compileLoadout } from "@dotln/compiler";
import { compileRegisteredLoadout } from "./lib/authority-grants.mjs";
import { writerLoadout } from "./lib/target-publish.mjs";
import { lintOutwardArtifact } from "./lib/outward-lint.mjs";

const repoRoot = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
const cli = join(repoRoot, "scripts/worktree.mjs");
const pinned = join(repoRoot, "scripts/fixtures/target-publish");
const loadout = JSON.parse(readFileSync(join(pinned, "loadout.json"), "utf8"));
const vocabulary = JSON.parse(
  readFileSync(join(repoRoot, "docs/control/outward-vocabulary.json"), "utf8"),
);
const BRANCH = "fix/fixture-text";
const MESSAGE = "fix: record the synthetic worker line\n";
const GITHUB = "https://github.com/dotln-fixture/target.git";

const shared = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-target-publish-")),
);
// The shared stubs outlive every awaited test; a root after() hook runs early.
process.on("exit", () => rmSync(shared, { recursive: true, force: true }));
const bin = join(shared, "bin");
mkdirSync(bin);
const realGit = execFileSync("sh", ["-c", "command -v git"], {
  encoding: "utf8",
}).trim();
// Report configured origin URLs without insteadOf expansion, as the worktree
// shell fixture does, so the push reaches the bare origin behind a GitHub URL.
writeFileSync(
  join(bin, "git"),
  `#!/bin/bash
set -euo pipefail
real_git='${realGit}'
if [[ "$#" -eq 6 && "$1" == "-C" && "$3 $4 $5 $6" == "remote get-url --all origin" ]]; then
  exec "$real_git" -C "$2" config --get-all remote.origin.url
fi
if [[ "$#" -eq 7 && "$1" == "-C" && "$3 $4 $5 $6 $7" == "remote get-url --push --all origin" ]]; then
  urls="$("$real_git" -C "$2" config --get-all remote.origin.pushurl || true)"
  if [[ -z "$urls" ]]; then urls="$("$real_git" -C "$2" config --get-all remote.origin.url)"; fi
  printf "%s\\n" "$urls"
  exit 0
fi
exec "$real_git" "$@"
`,
);
writeFileSync(
  join(bin, "gh"),
  `#!/usr/bin/env bash
set -euo pipefail
printf "%s\\n" "$*" >>"$DOTLN_GH_LOG"
if [[ -n "\${GH_REPO:-}" || -n "\${GH_HOST:-}" ]]; then printf "ambient GH target leaked\\n" >&2; exit 65; fi
if [[ "$*" == "--version" ]]; then printf "gh version fixture\\n"; exit 0; fi
if [[ "\${1:-} \${2:-}" == "auth status" ]]; then printf "authenticated fixture\\n"; exit 0; fi
if [[ "\${1:-} \${2:-}" == "pr create" ]]; then
  body_file=""
  while (( "$#" )); do if [[ "$1" == "--body-file" ]]; then body_file="$2"; shift 2; else shift; fi; done
  cp "$body_file" "$DOTLN_GH_BODY"
  printf "https://github.com/dotln-fixture/target/pull/7\\n"
  exit 0
fi
printf "unexpected gh invocation: %s\\n" "$*" >&2
exit 64
`,
);
chmodSync(join(bin, "git"), 0o755);
chmodSync(join(bin, "gh"), 0o755);

const write = (path, text) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};
const grantFor = (repo, grantedBy) => ({
  ...loadout.authorityGrants[0],
  grantId: `${grantedBy}.target-publish`,
  grantedBy,
  repo,
});

/** One launchpad root and one real source-change episode per scenario, so the
 * episode's compiled identity binds the same host registry publish reads. */
async function scenario(t, { grantedBy = "operator" } = {}) {
  const root = createSourceFixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const target = join(root, "target");
  const origin = join(root, "origin.git");
  const baseCommit = readFileSync(join(root, "base.txt"), "utf8");
  execFileSync("git", ["init", "--quiet", "--bare", origin]);
  fixtureGit(target, "remote", "add", "origin", GITHUB);
  fixtureGit(target, "config", `url.${origin}.insteadOf`, GITHUB);
  fixtureGit(target, "push", "--quiet", "origin", "main");

  const launchpad = join(root, "launchpad");
  mkdirSync(launchpad);
  fixtureGit(launchpad, "init", "--quiet", "--initial-branch=main");
  fixtureGit(launchpad, "commit", "--quiet", "--allow-empty", "-m", "fixture");
  write(
    join(launchpad, "docs/control/outward-vocabulary.json"),
    JSON.stringify(vocabulary),
  );
  const terms = (text) =>
    text === null
      ? rmSync(join(launchpad, "docs/control/local/terms.txt"), { force: true })
      : write(join(launchpad, "docs/control/local/terms.txt"), text);
  terms("zephyrcanary\n");
  const grant = grantedBy ? grantFor(target, grantedBy) : null;
  write(
    join(launchpad, "packages/skeleton/loadouts/grants.json"),
    JSON.stringify(grantedBy === "operator" ? [grant] : []),
  );
  if (grantedBy === "host-policy")
    write(
      join(launchpad, "docs/control/local/authority-grants.json"),
      JSON.stringify([grant]),
    );

  const source = { ...loadout, authorityGrants: grant ? [grant] : [] };
  const environment = {
    environmentId: "wo064.fixture",
    version: 1,
    capabilities: [],
    repo: target,
    baseCommit,
  };
  // The order's program carries the grant; the writer never does.
  const compiled = compileRegisteredLoadout(source, environment, launchpad);
  assert.equal(compiled.ok, true, JSON.stringify(compiled.diagnostics));
  const writer = compileLoadout(writerLoadout(source), environment);
  assert.equal(writer.ok, true, JSON.stringify(writer.diagnostics));
  assert.equal(
    writer.program.authorityEnvelope.allowedEffects.includes("repo.push"),
    false,
  );
  const host = new SourceChangeHost({
    ...sourceFixtureOptions(root, () => 10, "commit", "codex"),
    workOrder: writer.program.workOrder,
    authorityEnvelope: writer.program.authorityEnvelope,
    authorityEvidence: [],
    artifactIdentity: writer.artifactIdentity,
    branch: BRANCH,
    surfaces: ["fixture.txt"],
    commitMessage: MESSAGE,
  });
  const result = await host.run();
  assert.equal(result.status, "observed", JSON.stringify(result));
  host.finish();
  write(join(root, "loadout.json"), JSON.stringify(source));
  const request = {
    schemaVersion: 1,
    loadout: "loadout.json",
    environment,
    store: "store",
    baseBranch: "main",
  };
  const requestPath = join(root, "request.json");
  write(requestPath, JSON.stringify(request));
  const ghLog = join(root, "gh.log");
  const body = join(root, "published-body.md");
  const publish = () =>
    spawnSync(
      process.execPath,
      [cli, "publish", "WO-064", "--target", requestPath],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          DOTLN_LAUNCHPAD: launchpad,
          DOTLN_GH_LOG: ghLog,
          DOTLN_GH_BODY: body,
          GH_REPO: "wrong/target",
          GH_HOST: "wrong.example",
        },
      },
    );
  const remoteBranch = () =>
    spawnSync(
      "git",
      [
        "--git-dir",
        origin,
        "rev-parse",
        "--verify",
        "--quiet",
        `refs/heads/${BRANCH}`,
      ],
      { encoding: "utf8" },
    ).stdout.trim();
  const ghCalls = () =>
    existsSync(ghLog) ? readFileSync(ghLog, "utf8").trim().split("\n") : [];
  return {
    root,
    target,
    baseCommit,
    observation: result.observation,
    request,
    requestPath,
    terms,
    publish,
    remoteBranch,
    ghCalls,
    body,
    publication: join(root, "store/publication"),
  };
}

const refusedBeforeRemote = (subject, run, pattern) => {
  assert.equal(run.status, 1, run.stdout);
  assert.match(run.stderr, pattern);
  assert.doesNotMatch(run.stderr, /\n\s+at /u, "no stack trace");
  assert.deepEqual(subject.ghCalls(), []);
  assert.equal(subject.remoteBranch(), "");
  assert.equal(existsSync(subject.publication), false);
};

await test("WO-064 AC1: publish refuses without an operator grant before any remote call", async (t) => {
  const subject = await scenario(t, { grantedBy: null });
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: repo\.push is not granted in effects and operations by an authority grant with operator provenance/u,
  );
  // A changed loadout cannot supply authority for the earlier change.
  const loadoutPath = join(subject.root, "loadout.json");
  const edited = JSON.parse(readFileSync(loadoutPath, "utf8"));
  edited.activeMechanics[0].workOrder.nonGoals = ["Everything else"];
  writeFileSync(loadoutPath, JSON.stringify(edited));
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: the episode was not dispatched from this loadout's writer compilation/u,
  );
});

await test("WO-064 AC1: a host-policy grant is not operator provenance", async (t) => {
  const subject = await scenario(t, { grantedBy: "host-policy" });
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: repo\.push is not granted .* with operator provenance/u,
  );
});

await test("WO-064 AC1/AC2: lint and target refusals name their rule; the granted publish pushes and opens the pull request with the pinned body", async (t) => {
  const subject = await scenario(t);
  const { target, observation, baseCommit } = subject;

  subject.terms("baseline\n");
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: outward lint: pr-body refused: vocabulary\.local \(line 3\)$/mu,
  );
  subject.terms(null);
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /outward lint: branch unavailable: local-terms list absent; commit unavailable: local-terms list absent; pr-title unavailable: local-terms list absent; pr-body unavailable: local-terms list absent/u,
  );
  subject.terms("zephyrcanary\n");

  fixtureGit(target, "update-ref", `refs/heads/${BRANCH}`, baseCommit);
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: branch fix\/fixture-text no longer names the observed commit/u,
  );
  fixtureGit(target, "update-ref", `refs/heads/${BRANCH}`, observation.commit);

  // A current, replayable matrix for another revision is not this head's.
  const verification = join(subject.root, "verification");
  const other = await runVerificationDemo({
    directory: verification,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
  });
  assert.notEqual(other.matrix.subjectRevision, observation.commit);
  writeFileSync(
    subject.requestPath,
    JSON.stringify({ ...subject.request, verificationStore: "verification" }),
  );
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: the verification store has no single acceptance matrix for the published head/u,
  );
  writeFileSync(subject.requestPath, JSON.stringify(subject.request));

  const configBefore = readFileSync(join(target, ".git/config"), "utf8");
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  assert.equal(
    published.stdout,
    `Pushed ${BRANCH} at ${observation.commit} and opened pull request #7 on github.com/dotln-fixture/target.\n`,
  );
  const calls = subject.ghCalls();
  assert.deepEqual(calls.slice(0, 2), [
    "--version",
    "auth status --hostname github.com",
  ]);
  assert.match(
    calls[2],
    /^pr create --repo github\.com\/dotln-fixture\/target --head fix\/fixture-text --base main --title fix: record the synthetic worker line --body-file \S+\/PR\.md$/u,
  );
  assert.equal(calls.length, 3);
  assert.equal(subject.remoteBranch(), observation.commit);
  assert.equal(
    execFileSync(
      "git",
      ["--git-dir", join(subject.root, "origin.git"), "tag", "--list"],
      {
        encoding: "utf8",
      },
    ),
    "",
  );
  assert.equal(readFileSync(join(target, ".git/config"), "utf8"), configBefore);

  const body = readFileSync(subject.body, "utf8");
  assert.equal(
    body,
    readFileSync(join(pinned, "body.md"), "utf8")
      .replaceAll("<base>", baseCommit)
      .replaceAll("<head>", observation.commit),
  );
  // AC2: no launchpad vocabulary, no DotLn or store path, no worker narrative.
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: body,
      vocabulary,
      localTerms: { status: "present" },
    }).status,
    "pass",
  );
  for (const forbidden of [
    /dotln/iu,
    /launchpad/iu,
    /\b(?:docs|scripts|packages)\//u,
    /\.dotln|\.claude/u,
    new RegExp(subject.root.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"),
    /node fixture-test\.mjs/u,
    /Synthetic source change\./u,
    /The synthetic change is complete\./u,
  ])
    assert.doesNotMatch(body, forbidden);

  const events = decodeLog(
    readFileSync(join(subject.publication, "events.jsonl"), "utf8"),
  );
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "PullRequestOpened");
  assert.equal(events[0].actorId, "target-publish-host");
  assert.deepEqual(events[0].payload, {
    repositoryId: "github.com/dotln-fixture/target",
    number: 7,
    headSha: observation.commit,
  });

  const again = subject.publish();
  assert.equal(again.status, 0, again.stderr);
  assert.match(
    again.stdout,
    /^Already published fix\/fixture-text at [0-9a-f]{40}: pull request #7 on github\.com\/dotln-fixture\/target; nothing pushed\.$/mu,
  );
  assert.equal(subject.ghCalls().length, 3);
  assert.equal(
    decodeLog(readFileSync(join(subject.publication, "events.jsonl"), "utf8"))
      .length,
    1,
  );
  process.stdout.write(
    `target publish gh stub transcript (temporary path normalized):\n${calls
      .map((line) =>
        line.replace(
          /--body-file \S+\/PR\.md$/u,
          "--body-file <generated-PR-body>",
        ),
      )
      .join("\n")}\n`,
  );
});

await test("WO-064 AC1 (VER-001 F1): a same-head acceptance matrix must verify this WorkOrder's criteria", async (t) => {
  const subject = await scenario(t);
  const { commit } = subject.observation;
  const demo = join(subject.root, "demo");
  await runVerificationDemo({
    directory: demo,
    transport: new FakeVerificationTransport(),
    model: "synthetic",
    effort: "unknown",
  });
  // The real host's opening event, moved to the published head. An opened
  // workstream replays with incomplete rows; rewriting any later event fails
  // replay as compilation drift, so no fixture verdict is forged.
  const lines = readFileSync(join(demo, "events.jsonl"), "utf8")
    .split("\n")
    .filter(Boolean);
  const end = lines.findIndex(
    (line) => JSON.parse(line).type === "VerificationOpened",
  );
  const opened = lines
    .slice(0, end + 1)
    .join("\n")
    .replaceAll(JSON.parse(lines[end]).payload.subject.revision, commit);
  const store = (name, renamed = []) => {
    let log = opened;
    renamed.forEach((description, index) => {
      log = log.replaceAll(
        JSON.stringify(verificationFixtureCriteria[index].description),
        JSON.stringify(description),
      );
    });
    write(join(subject.root, name, "events.jsonl"), `${log}\n`);
    writeFileSync(
      subject.requestPath,
      JSON.stringify({ ...subject.request, verificationStore: name }),
    );
  };

  store("unrelated");
  refusedBeforeRemote(
    subject,
    subject.publish(),
    /target publish refused: the acceptance matrix for the published head does not verify this WorkOrder's acceptance criteria/u,
  );

  // The same criteria in another order publish in the contract's order.
  const criteria = loadout.activeMechanics[0].workOrder.acceptanceCriteria;
  store("matching", [criteria[2], criteria[0], criteria[1]]);
  const published = subject.publish();
  assert.equal(published.status, 0, published.stderr);
  const body = readFileSync(subject.body, "utf8");
  assert.ok(
    body.includes(
      `| Criterion | Status |
| --- | --- |
| Only fixture.txt changes | incomplete |
| The focused fixture test passes after the change | incomplete |
| Exactly one commit above the base | incomplete |

Independent verification: acceptance matrix for ${commit}: 0 verified, 0 failed, 0 stale, 3 incomplete.
`,
    ),
    body,
  );
  assert.equal(
    lintOutwardArtifact({
      kind: "pr-body",
      text: body,
      vocabulary,
      localTerms: { status: "present" },
    }).status,
    "pass",
  );
  assert.equal(subject.remoteBranch(), commit);
});

await test("WO-064: the CLI names its usage for a malformed target request", () => {
  const run = spawnSync(
    process.execPath,
    [cli, "publish", "WO-064", "--target"],
    {
      encoding: "utf8",
    },
  );
  assert.equal(run.status, 1);
  assert.match(
    run.stderr,
    /usage: worktree publish WO-NNN --target <target-publish-request\.json>/u,
  );
});
