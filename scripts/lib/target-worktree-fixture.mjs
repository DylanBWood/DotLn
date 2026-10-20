import { copyFixtureFiles } from "./fixture-inputs.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT, docPath } from "./config.mjs";
import { runGit } from "./git.mjs";
import { write } from "./helpers.mjs";
import { runtimeModuleDirectory } from "./harness.mjs";
import { installBeaconFixture } from "../test-beacon-fixture.mjs";
import {
  installTargetPublicationFixture,
  publicationVocabulary,
  publicationGrant,
} from "../test-target-publication-fixture.mjs";
import { createHash } from "node:crypto";

const git = (root, ...args) => runGit(root, args);
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
const fixture = (base, { baseIgnore } = {}) => {
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
    git(base, "clone", "-q", origin, root);
    git(root, "config", "user.email", "fixture@example.invalid");
    git(root, "config", "user.name", "Fixture");
    return root;
  };
  const clone = repository("target");
  write(clone, "source.txt", "declared base\n");
  if (baseIgnore) write(clone, ".gitignore", baseIgnore);
  git(clone, "add", "-A");
  git(clone, "commit", "-qm", "Target base");
  const baseCommit = git(clone, "rev-parse", "HEAD");
  write(clone, "later.txt", "not in declared base\n");
  git(clone, "add", "-A");
  git(clone, "commit", "-qm", "test: later base change");
  git(clone, "push", "-qu", "origin", "main");
  const main = repository("launchpad");
  const parent = join(base, "Targets");
  mkdirSync(parent);
  const orderRoot = join(base, "launchpad-wo999");
  const target = join(parent, "target-wo999");
  const order = "records/work-orders/WO-999-fixture.md";
  const config = {
    version: 1,
    roots: { docs: "records", control: "records/state" },
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
    "records/state/outward-vocabulary.json",
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
    "/records/state/local/\n/docs/control/local/\n.control-beacons/\ndist/\nnode_modules/\n.runtime/\n",
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
  cpSync(
    join(TOOL_ROOT, "packages/skeleton/src/evidence-editions.mjs"),
    join(main, "packages/skeleton/src/evidence-editions.mjs"),
  );
  // The fixture's bootstrap provides the installed build without a dependency
  // install; both launchpad worktrees still run the real lifecycle commands.
  write(
    main,
    "scripts/bootstrap.mjs",
    `import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
if (process.env.DOTLN_FIXTURE_BOOTSTRAP_FAIL) process.exit(7);
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
  git(main, "commit", "-qm", "Launchpad fixture");
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
    mkdtempSync(join(tmpdir(), "dotln-target-worktree-")),
  );
  try {
    return run(fixture(base, options));
  } finally {
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

const publicationSetup = (f) => {
  f.config.repositories.target.authorityProfile = {
    ...profile,
    allowedEffects: [...profile.allowedEffects, "repo.push", "pr.open"],
    deniedEffects: [],
  };
  write(f.main, "dotln.config.json", JSON.stringify(f.config));
  write(
    f.main,
    "records/state/outward-vocabulary.json",
    JSON.stringify(publicationVocabulary),
  );
  write(f.main, "records/state/local/terms.txt", "Private Fixture Term\n");
  write(
    f.main,
    "packages/skeleton/loadouts/grants.json",
    JSON.stringify([publicationGrant]),
  );
  git(f.main, "add", "-A");
  git(f.main, "commit", "-qm", "test: declare publication policy");
  git(f.main, "push", "-q", "origin", "main");
  const url = "https://github.com/dotln-fixture/target.git";
  const forge = installTargetPublicationFixture(f.base, f.env, [
    { url, origin: join(f.base, "target.git") },
  ]);
  git(f.clone, "remote", "set-url", "origin", url);
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

export {
  git,
  recordTreeSnapshot,
  actor,
  actorArgs,
  profile,
  fixture,
  withFixture,
  prepareFinalReview,
  closeOrder,
  publicationSetup,
  launchpadCommands,
};
