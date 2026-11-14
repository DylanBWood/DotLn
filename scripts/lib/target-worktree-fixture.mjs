import {
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./temporary-roots.mjs";
import { copyFixtureFiles } from "./fixture-inputs.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT, docPath, docRelative } from "./config.mjs";
import { runGit } from "./git.mjs";
import { write } from "./helpers.mjs";
import {
  applyPlanCandidate,
  candidateDiff,
  draftPlanCandidate,
  planDigest,
  planFirstContext,
  planFirstView,
  planMarker,
  proposalPatch,
  selectedPlanState,
} from "./plan-first.mjs";
import { runtimeModuleDirectory } from "./harness.mjs";
import { installBeaconFixture } from "../test-beacon-fixture.mjs";
import {
  installTargetPublicationFixture,
  publicationVocabulary,
  publicationGrant,
} from "../test-target-publication-fixture.mjs";
import { createHash } from "node:crypto";

// Every fixture's Git call carries that fixture's environment, so the URL
// rewrite publicationSetup installs there reaches a direct push as it reaches
// the kit's commands: a probe that calls git on a fixture checkout cannot leave
// the machine (WO-192-D099). A checkout is matched to its fixture by base.
const fixtureEnvironments = new Map();
const fixtureEnvironmentOf = (root) => {
  for (const [base, env] of fixtureEnvironments)
    if (root === base || root.startsWith(`${base}/`)) return env;
  return undefined;
};
const git = (root, ...args) => {
  const env = fixtureEnvironmentOf(root);
  return runGit(root, args, env ? { env } : {});
};
// The fixture's GitHub-shaped origin: a host under the reserved .invalid
// domain, which no resolver answers, so the production preflight parses it as
// a GitHub remote while nothing can reach it (WO-247).
const FIXTURE_FORGE_HOST = "github.invalid";
const fixtureForgeUrl = (repository = "target") =>
  `https://${FIXTURE_FORGE_HOST}/dotln-fixture/${repository}.git`;
// No fixture remote may name a host a resolver could answer; only the
// reserved domain and local paths under the fixture base are admitted.
const assertNoResolvableFixtureRemote = (f) => {
  for (const root of [f.main, f.clone, f.target, f.orderRoot])
    if (existsSync(join(root, ".git"))) {
      const urls = runGit(root, ["remote", "get-url", "--all", "origin"], {
        env: f.env,
        onFailure: () => "",
      });
      for (const url of urls.split("\n").filter(Boolean)) {
        let host = null;
        try {
          host = new URL(url).hostname;
        } catch {
          assert.ok(
            url.startsWith(f.base),
            `fixture remote ${url} is neither a local path under the fixture base nor a URL`,
          );
          continue;
        }
        assert.ok(
          host.endsWith(".invalid"),
          `fixture remote ${url} names a resolvable host`,
        );
      }
    }
};
// Restore only settings still byte-for-byte owned by the fixture coordinator.
export function restoreFixturePolicies(policies) {
  for (const { file, applied } of policies) {
    let current;
    try {
      if (lstatSync(file).isFile()) current = readFileSync(file, "utf8");
    } catch {
      /* Retain unreadable ownership. */
    }
    if (current !== applied) {
      const error = new Error(
        "Fixture settings changed after installation; retain the fixture for inspection.",
      );
      error.code = "FIXTURE_POLICY_CHANGED";
      throw error;
    }
  }
  for (const { file, previous } of policies) {
    if (previous === null) rmSync(file);
    else writeFileSync(file, previous);
  }
}
const recordTreeSnapshot = (root) => {
  const rows = [];
  const visit = (prefix = "") => {
    for (const name of readdirSync(join(root, prefix)).sort()) {
      if (!prefix && name === ".git") continue;
      const path = prefix ? `${prefix}/${name}` : name;
      const file = join(root, path),
        stat = lstatSync(file);
      if (stat.isDirectory()) {
        rows.push({ path, mode: stat.mode, directory: true });
        visit(path);
      } else
        rows.push({
          path,
          mode: stat.mode,
          sha256: createHash("sha256")
            .update(
              stat.isSymbolicLink() ? readlinkSync(file) : readFileSync(file),
            )
            .digest("hex"),
        });
    }
  };
  visit();
  return rows;
};
const runtimePackages = Object.keys(
  JSON.parse(readFileSync(join(TOOL_ROOT, "package-lock.json"), "utf8"))
    .packages,
)
  .filter((name) => /^packages\/[^/]+$/.test(name))
  .map((name) => name.slice("packages/".length));
const actor = {
  harness: "human",
  harnessVersion: "not-applicable",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const actorArgs = [
  "--harness",
  actor.harness,
  "--harness-version",
  actor.harnessVersion,
  "--model",
  actor.model,
  "--effort",
  actor.effort,
  "--source",
  actor.source,
];
const profile = {
  authorityEnvelopeId: "fixture.target",
  allowedEffects: ["repo.read", "repo.write", "repo.test"],
  deniedEffects: ["repo.push"],
  resourceLimits: {},
  requiredEvidence: [],
  expiresAt: Number.MAX_SAFE_INTEGER,
  revocationEventTypes: [],
};
const fixture = (
  base,
  {
    baseIgnore,
    baseFiles = {},
    roots = { docs: "records", control: "records/state" },
  } = {},
) => {
  symlinkSync(join(TOOL_ROOT, "node_modules"), join(base, "node_modules"));
  const env = { ...process.env, DOTLN_FIXTURE_RUNTIME: TOOL_ROOT };
  for (const key of [
    "CODEX_THREAD_ID",
    "COPILOT_AGENT_SESSION_ID",
    "CLAUDE_EFFORT",
    "DOTLN_LAUNCHPAD",
    "DOTLN_ACCOUNT_LABEL",
  ])
    delete env[key];
  const repository = (name) => {
    const origin = join(base, `${name}.git`);
    const root = join(base, name);
    mkdirSync(origin);
    git(origin, "init", "--bare", "-q", "-b", "main");
    git(base, "-c", "maintenance.auto=false", "clone", "-q", origin, root);
    git(root, "config", "user.email", "fixture@example.invalid");
    git(root, "config", "user.name", "Fixture");
    return root;
  };
  fixtureEnvironments.set(base, env);
  const clone = repository("target");
  write(clone, "source.txt", "declared base\n");
  if (baseIgnore) write(clone, ".gitignore", baseIgnore);
  for (const [path, bytes] of Object.entries(baseFiles))
    write(clone, path, bytes);
  git(clone, "add", "-A");
  git(clone, "-c", "maintenance.auto=false", "commit", "-qm", "Target base");
  const baseCommit = git(clone, "rev-parse", "HEAD");
  write(clone, "later.txt", "not in declared base\n");
  git(clone, "add", "-A");
  git(
    clone,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: later base change",
  );
  git(clone, "push", "-qu", "origin", "main");
  const main = repository("launchpad");
  const parent = join(base, "Targets");
  mkdirSync(parent);
  const orderRoot = join(base, "launchpad-wo999");
  const target = join(parent, "target-wo999");
  const order = `${roots.docs}/work-orders/WO-999-fixture.md`;
  const config = {
    version: 1,
    roots,
    classes: { fixture: { checks: [], supports: [] } },
    repositories: {
      target: {
        baseBranch: "main",
        worktreeParent: "../Targets",
        repositoryClass: "fixture",
        authorityProfile: profile,
        gate: {
          commands: {
            test: {
              argv: [
                process.execPath,
                "-e",
                "if (!require('node:fs').existsSync('source.txt')) process.exit(2)",
              ],
              timeoutMs: 5000,
            },
          },
          plain: ["test"],
          review: ["test"],
        },
      },
    },
  };
  write(main, "dotln.config.json", JSON.stringify(config));
  write(
    main,
    `${roots.control}/outward-vocabulary.json`,
    JSON.stringify(publicationVocabulary),
  );
  write(
    main,
    order,
    `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${baseCommit}\n`,
  );
  write(
    main,
    ".gitignore",
    `/${roots.control}/local/\n/docs/control/local/\n.control-beacons/\ndist/\nnode_modules/\n.runtime/\n`,
  );
  write(main, "package.json", '{"private":true}\n');
  mkdirSync(join(main, "scripts"));
  copyFixtureFiles(
    TOOL_ROOT,
    main,
    "scripts/test-target-worktree.fixture-inputs.json",
  );
  cpSync(join(TOOL_ROOT, "scripts/lib"), join(main, "scripts/lib"), {
    recursive: true,
  });
  installBeaconFixture(main);
  // The build-free modules the copied scripts import from the package's
  // sources: the evidence editions and the two readers.
  for (const name of [
    "evidence-editions.mjs",
    "shell-reading.mjs",
    "source-reading.mjs",
  ])
    cpSync(
      join(TOOL_ROOT, "packages/skeleton/src", name),
      join(main, "packages/skeleton/src", name),
    );
  // The fixture's bootstrap provides the installed build without a dependency
  // install; both launchpad worktrees still run the real lifecycle commands.
  write(
    main,
    "scripts/bootstrap.mjs",
    `import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
if (process.env.DOTLN_FIXTURE_BOOTSTRAP_FAIL) process.exit(7);
// A planted host denial, reported on standard error as a sandbox reports it.
if (process.env.DOTLN_FIXTURE_BOOTSTRAP_DENY) {
  const line = "EACCES: permission denied, mkdir 'packages/compiler'\\n";
  if (process.env.DOTLN_FIXTURE_BOOTSTRAP_DENY === "stdout") process.stdout.write(line);
  else process.stderr.write(line);
  process.exit(1);
}
for (const name of ${JSON.stringify(runtimePackages)}) {
  const source = join(process.env.DOTLN_FIXTURE_RUNTIME, "packages", name);
  const dest = join(process.cwd(), "packages", name);
  mkdirSync(dest, { recursive: true });
  cpSync(join(source, "package.json"), join(dest, "package.json"));
  if (existsSync(join(source, "dist")) && !existsSync(join(dest, "dist"))) cpSync(join(source, "dist"), join(dest, "dist"), { recursive: true });
}\n`,
  );
  for (const name of runtimePackages) {
    const source = join(TOOL_ROOT, "packages", name);
    mkdirSync(join(main, "packages", name), { recursive: true });
    cpSync(
      join(source, "package.json"),
      join(main, "packages", name, "package.json"),
    );
    const modules = runtimeModuleDirectory(source);
    if (modules && !existsSync(join(main, "packages", name, modules)))
      cpSync(join(source, modules), join(main, "packages", name, modules), {
        recursive: true,
      });
  }
  git(main, "add", "-A");
  git(
    main,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Launchpad fixture",
  );
  git(main, "push", "-qu", "origin", "main");
  const call = (root, scriptRoot, script, args, override = {}) =>
    spawnSync(
      process.execPath,
      [join(scriptRoot, "scripts", `${script}.mjs`), ...args],
      {
        cwd: root,
        env: { ...env, ...override },
        encoding: "utf8",
        maxBuffer: 4 * 1024 * 1024,
      },
    );
  const ok = (result) => {
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return result.stdout;
  };
  const worktree = (...args) => call(main, main, "worktree", args);
  const start = () => ok(worktree("start", "WO-999", order));
  const mapClone = () => ok(worktree("clone", "target", clone));
  const resume = (args, override = {}, cwd = target, scriptRoot = orderRoot) =>
    call(cwd, scriptRoot, "resume", args, override);
  const close = (...args) =>
    call(main, main, "release", ["close", "WO-999", ...args]);
  return {
    base,
    env,
    main,
    clone,
    parent,
    target,
    orderRoot,
    order,
    config,
    baseCommit,
    call,
    ok,
    worktree,
    start,
    mapClone,
    resume,
    close,
  };
};

const withFixture = (run, options) => {
  const base = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-target-worktree-")),
  );
  try {
    return run(fixture(base, options));
  } finally {
    fixtureEnvironments.delete(base);
    rmSync(base, { recursive: true, force: true });
  }
};
const prepareFinalReview = (f, override = {}, verificationSuffix = "") => {
  f.ok(
    f.call(
      f.orderRoot,
      f.orderRoot,
      "target-gate",
      ["WO-999", "--review"],
      override,
    ),
  );
  f.ok(f.resume(["implementation-ready", ...actorArgs], override));
  f.ok(f.resume(["verify"], override));
  const verification = docPath(
    f.orderRoot,
    "verifications",
    "WO-999/VER-001.md",
  );
  write(
    f.orderRoot,
    "records/verifications/WO-999/VER-001.md",
    `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n${verificationSuffix}`,
  );
  f.ok(f.resume(["verification-result", "pass", ...actorArgs], override));
  f.ok(f.resume(["final-review"], override));
  const finalReview = docPath(
    f.orderRoot,
    "finalReviews",
    "WO-999/FINAL-001.md",
  );
  write(
    f.orderRoot,
    "records/final-reviews/WO-999/FINAL-001.md",
    `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
  );
  return { verification, finalReview };
};
const closeOrder = (f, override = {}, verificationSuffix = "") => {
  const reports = prepareFinalReview(f, override, verificationSuffix);
  f.ok(f.resume(["final-review-result", "pass", ...actorArgs], override));
  return reports;
};

// The reviewer's records commit: the order's records and evidence, committed
// on the order branch after the passing review and before target-records
// files them, so the commit its footer names holds every record (WO-259).
const commitInstanceRecords = (f, message = "docs: the instance records") => {
  if (git(f.orderRoot, "status", "--porcelain")) {
    git(f.orderRoot, "add", "-A");
    git(f.orderRoot, "-c", "maintenance.auto=false", "commit", "-qm", message);
  }
  return git(f.orderRoot, "rev-parse", "HEAD");
};

/** The fixture's publication authority and its forge. With
 * `launchpadForge` the launchpad's own origin is a forge address too, so
 * that an order's records branch can be published. */
const publicationSetup = (f, { launchpadForge = false } = {}) => {
  f.config.repositories.target.authorityProfile = {
    ...profile,
    allowedEffects: [...profile.allowedEffects, "repo.push", "pr.open"],
    deniedEffects: [],
  };
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  write(
    f.main,
    `${f.config.roots.control}/outward-vocabulary.json`,
    JSON.stringify(publicationVocabulary),
  );
  write(
    f.main,
    `${f.config.roots.control}/local/terms.txt`,
    "refuse: Private Fixture Term\n",
  );
  write(
    f.main,
    "packages/skeleton/loadouts/grants.json",
    JSON.stringify([publicationGrant]),
  );
  git(f.main, "add", "-A");
  git(
    f.main,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "test: declare publication policy",
  );
  git(f.main, "push", "-q", "origin", "main");
  const url = fixtureForgeUrl();
  const launchpadUrl = fixtureForgeUrl("launchpad");
  const forge = installTargetPublicationFixture(f.base, f.env, [
    { url, origin: join(f.base, "target.git") },
    ...(launchpadForge
      ? [{ url: launchpadUrl, origin: join(f.base, "launchpad.git") }]
      : []),
  ]);
  git(f.clone, "remote", "set-url", "origin", url);
  if (launchpadForge) git(f.main, "remote", "set-url", "origin", launchpadUrl);
  assertNoResolvableFixtureRemote(f);
  return forge;
};

// The launchpad commands a target order's text tells its session to run. A
// session works in the target worktree, where a bare npm run form reads the
// target's own package.json, so each is printed in the start handoff's form:
// DOTLN_LAUNCHPAD naming the order launchpad and node running that
// launchpad's own script. `run` executes one there as printed, with its
// placeholders filled.
const launchpadCommands = (f, text) => {
  assert.doesNotMatch(text, /npm run (?:resume|worktree|plan|adjacent) --/u);
  const unquote = (value) => value.slice(1, -1).replaceAll("'\\''", "'");
  return [
    // The actor placeholder holds a space; read it as one token.
    ...text
      .replaceAll("<actor flags>", "<actor-flags>")
      .matchAll(
        /DOTLN_LAUNCHPAD=('[^']*') node ('[^']*') ([a-z-]+)((?: (?:[-<"[0-9]|WO-|sha256:)(?:[^\s,)]*[^\s,.)])?)*)/gu,
      ),
  ].map(([printed, launchpad, script, action, args]) => {
    assert.equal(unquote(launchpad), f.orderRoot, printed);
    assert.ok(existsSync(unquote(script)), printed);
    const filled = args
      .replace(
        /--harness <harness> .*\[--account-label <label>\]/u,
        actorArgs.join(" "),
      )
      .replaceAll("<actor-flags>", actorArgs.join(" "))
      .replaceAll("<type>/<slug>", "fix/printed")
      .replace(/"?<title>"?/gu, "printed")
      .replaceAll("<text>", "printed")
      .replaceAll("<class>", "printed")
      .replaceAll("sha256:<digest>", `sha256:${"0".repeat(64)}`)
      .replace(/<[a-z-]*path>/gu, "reviewed-body.md")
      .replaceAll("<request.json>", join(f.base, "queue-request.json"));
    assert.doesNotMatch(filled, /[<>]/u, printed);
    return {
      command: `${unquote(script).slice(f.orderRoot.length + 1)} ${action}`,
      run: () =>
        spawnSync(
          "/bin/sh",
          [
            "-c",
            `DOTLN_LAUNCHPAD=${launchpad} node ${script} ${action}${filled}`,
          ],
          { cwd: f.target, env: f.env, encoding: "utf8" },
        ),
    };
  });
};

// The release surfaces an order's own publish checks at its committed
// head, which the lifecycle fixture's launchpad does not carry, written to
// main before the order starts so that the order branch changes no launchpad
// code and its publish needs no launchpad gate row: the license
// files and the legal record as this repository holds them, the root
// manifest's publication guards and a README release block.
const releaseSurfaces = (f, { documentationMark = true } = {}) => {
  const kit = (file) => readFileSync(join(TOOL_ROOT, file));
  for (const file of ["LICENSE", "LICENSE-docs", "NOTICE"])
    writeFileSync(join(f.main, file), kit(file));
  // The legal record's three pins, written here from the files just copied:
  // the repository's own record is a document, which no product case reads.
  const legal = docPath(f.main, "docs", "LEGAL.md");
  mkdirSync(dirname(legal), { recursive: true });
  writeFileSync(
    legal,
    `# Legal\n\n${["LICENSE", "LICENSE-docs", "NOTICE"]
      .map(
        (file) =>
          `- \`${file}\` — \`sha256:${createHash("sha256").update(kit(file)).digest("hex")}\``,
      )
      .join("\n")}\n`,
  );
  const own = JSON.parse(kit("package.json").toString());
  const manifest = JSON.parse(
    readFileSync(join(f.main, "package.json"), "utf8"),
  );
  write(
    f.main,
    "package.json",
    JSON.stringify({
      ...manifest,
      workspaces: own.workspaces,
      license: own.license,
      scripts: {
        ...manifest.scripts,
        prepublishOnly: own.scripts.prepublishOnly,
      },
    }),
  );
  // The fixture keeps its documents under records/: marked as documentation,
  // an order's records are no change of launchpad code. A case leaves the
  // mark out to hold what an instance with a moved root and no mark meets.
  if (documentationMark)
    write(f.main, ".gitattributes", "records/** dotln-documentation\n");
  write(
    f.main,
    "README.md",
    "# Fixture instance\n\n<!-- DOTLN-RELEASE-BEGIN -->\nThis source prepares DotLn `v0.1.0`.\n<!-- DOTLN-RELEASE-END -->\n",
  );
};
const reviewedRecordsOrder = (
  f,
  records,
  {
    reviewedFiles = { "reviewed.txt": "Reviewed change.\n" },
    // Paths of the target's base that the reviewed change deletes.
    removedFiles = [],
    documentationMark = true,
  } = {},
) => {
  if (records) f.config.repositories.target.records = records;
  // The fixture's one author is the instance's own.
  f.config.contributions = {
    operatorAuthor: "Fixture <fixture@example.invalid>",
  };
  releaseSurfaces(f, { documentationMark });
  const forge = publicationSetup(f, { launchpadForge: true });
  f.mapClone();
  f.start();
  for (const [path, bytes] of Object.entries(reviewedFiles))
    write(f.target, path, bytes);
  for (const path of removedFiles) rmSync(join(f.target, path));
  git(f.target, "add", "-A");
  git(
    f.target,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "fix: preserve reviewed text",
  );
  const reviewed = git(f.target, "rev-parse", "HEAD");
  // Where plan-first would keep this order's plan, proposal and
  // conversation (criterion N5): the directory its commands and its view
  // read, whether or not the instance elects the feature.
  const planFirst = planFirstContext(f.orderRoot, {
    workOrderId: "WO-999",
    repositoryId: "target",
  }).directory;
  prepareFinalReview(f);
  const passed = f.ok(f.resume(["final-review-result", "pass", ...actorArgs]));
  write(
    f.orderRoot,
    "records/evidence/WO-999/decisions.md",
    "# Decisions\n\nThe fixture keeps the reviewed behavior.\n",
  );
  write(
    f.orderRoot,
    "reviewed-body.md",
    "## Result\n\nPreserve reviewed text and its validation.\n",
  );
  write(
    f.orderRoot,
    "records-body.md",
    "# WO-999\n\nThe order and its records: its text, its decisions and its two reports.\n",
  );
  commitInstanceRecords(f);
  return { forge, reviewed, passed, planFirst };
};

const publishRecordsTarget = (f) =>
  f.worktree(
    "publish",
    "WO-999",
    "--target-worktree",
    "--branch",
    "fix/preserve-reviewed-text",
    "--title",
    "fix: preserve reviewed text",
    "--body-file",
    "reviewed-body.md",
  );
const publishRecordsOrder = (f) =>
  f.worktree(
    "publish",
    "WO-999",
    "--title",
    "docs: the order's records",
    "--body-file",
    "records-body.md",
  );

/**
 * The fixture's order carried from its start to a passing final review with
 * plan-first elected: a plan proposed, approved and applied under the
 * registration value `before`, main's value then set to `after`, which the
 * order branch does not take in, and the lifecycle run as it runs for a plan:
 * the executor's gate and completion on the applied working tree, the
 * reviewed commit after them. Returns where the plan's documents are, whether
 * the approval stood across the change, the reviewed commit and the pass's
 * message.
 */
const plannedRecordsOrder = (f, { before, after }) => {
  const date = "2026-11-06T00:00:00.000Z";
  f.config.features = { "plan-first": true };
  f.config.contributions = {
    operatorAuthor: "Fixture <fixture@example.invalid>",
  };
  if (before) f.config.repositories.target.records = before;
  releaseSurfaces(f);
  // The approval's capture is an ignored file of the intake lane.
  const ignore = join(f.main, ".gitignore");
  writeFileSync(
    ignore,
    `${existsSync(ignore) ? readFileSync(ignore, "utf8") : ""}${docRelative(f.main, "intake")}/\n`,
  );
  publicationSetup(f, { launchpadForge: true });
  f.mapClone();
  // With plan-first elected the first start of a target order stops at
  // activation and the retry it prints succeeds (WO-276-D091 records it).
  try {
    f.start();
  } catch {
    f.start();
  }
  const state = () => selectedPlanState(f.orderRoot, "WO-999");
  const candidate = draftPlanCandidate(f.orderRoot, state(), f.base);
  const { directory } = planFirstContext(f.orderRoot, state());
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, "conversation.md"),
    `### ${date} — Operator\n\nPlease add the reviewed text.\n`,
  );
  writeFileSync(join(candidate.path, "reviewed.txt"), "Reviewed change.\n");
  const marker = planMarker({
    status: "proposed",
    proposedAt: date,
    conversationDigest: planDigest(
      readFileSync(join(directory, "conversation.md")),
    ),
    transformations: [],
  });
  writeFileSync(
    join(directory, "plan.md"),
    `${marker}# Plan\n\nAdd reviewed.txt with the reviewed text. The file is new. Keep the wording or change it. No unresolved questions.\n`,
  );
  writeFileSync(
    join(directory, "proposal.md"),
    `${marker}# Proposal\n\nreviewed.txt: the reviewed text.\n\n${proposalPatch(candidateDiff(f.orderRoot, state()).diff)}`,
  );
  f.ok(f.resume(["plan-proposed", "WO-999", ...actorArgs]));
  const approval = "Go ahead with this proposal.\n";
  const capture = `${docRelative(f.orderRoot, "intake")}/approval.txt`;
  write(f.orderRoot, capture, approval);
  f.ok(
    f.resume([
      "plan-approved",
      "WO-999",
      "--capture",
      capture,
      "--capture-hash",
      `sha256:${planDigest(approval)}`,
      ...actorArgs,
    ]),
  );
  applyPlanCandidate(f.orderRoot, state());
  if (after !== before) {
    if (after) f.config.repositories.target.records = after;
    else delete f.config.repositories.target.records;
    write(f.main, "dotln.config.json", JSON.stringify(f.config));
    git(f.main, "add", "-A");
    git(
      f.main,
      "-c",
      "maintenance.auto=false",
      "commit",
      "-qm",
      "test: the registration's records value changes",
    );
    git(f.main, "push", "-q", "origin", "main");
  }
  const view = planFirstView(f.orderRoot, state());
  const approvalStood = Boolean(view.approvedAt) && view.changed.length === 0;
  f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999"]));
  f.ok(f.resume(["implementation-ready", ...actorArgs]));
  git(f.target, "add", "-A");
  git(
    f.target,
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "fix: preserve reviewed text",
  );
  const reviewed = git(f.target, "rev-parse", "HEAD");
  f.ok(f.call(f.orderRoot, f.orderRoot, "target-gate", ["WO-999", "--review"]));
  f.ok(f.resume(["verify"]));
  write(
    f.orderRoot,
    docRelative(f.orderRoot, "verifications", "WO-999/VER-001.md"),
    `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
  );
  f.ok(f.resume(["verification-result", "pass", ...actorArgs]));
  f.ok(f.resume(["final-review"]));
  write(
    f.orderRoot,
    docRelative(f.orderRoot, "finalReviews", "WO-999/FINAL-001.md"),
    `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n`,
  );
  const passed = f.ok(f.resume(["final-review-result", "pass", ...actorArgs]));
  write(
    f.orderRoot,
    `${docRelative(f.orderRoot, "evidence")}/WO-999/decisions.md`,
    "# Decisions\n\nThe fixture keeps the reviewed behavior.\n",
  );
  write(
    f.orderRoot,
    "reviewed-body.md",
    "## Result\n\nPreserve reviewed text and its validation.\n",
  );
  write(
    f.orderRoot,
    "records-body.md",
    "# WO-999\n\nThe order and its records: its text, its decisions and its two reports.\n",
  );
  commitInstanceRecords(f);
  return { directory, approvalStood, reviewed, passed };
};

export {
  plannedRecordsOrder,
  releaseSurfaces,
  reviewedRecordsOrder,
  publishRecordsTarget,
  publishRecordsOrder,
  git,
  FIXTURE_FORGE_HOST,
  fixtureForgeUrl,
  assertNoResolvableFixtureRemote,
  recordTreeSnapshot,
  actor,
  actorArgs,
  profile,
  fixture,
  withFixture,
  prepareFinalReview,
  closeOrder,
  commitInstanceRecords,
  publicationSetup,
  launchpadCommands,
};
