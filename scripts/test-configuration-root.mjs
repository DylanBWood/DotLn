import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";
import { main as lineageMain, statuses } from "./lineage.mjs";
import { latestPlanningPass } from "./lib/plan-direct.mjs";
import { planningPassScope } from "./lib/plan-receipts.mjs";
import { syncFollowups } from "./lib/planning-followups.mjs";
import {
  CONFIG_FILENAME,
  CONFIG_SCHEMA_VERSION,
  ROOT_KEYS,
  defaultRoots,
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
  rootPattern,
} from "./lib/config.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(scriptRoot, "..");

const temporary = (prefix, run) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), `dotln-${prefix}-`)));
  try {
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

const write = (root, path, bytes) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
};

const git = (root, ...args) => {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
};

const declared = (config) => {
  write(
    config.root,
    CONFIG_FILENAME,
    `${JSON.stringify(config.body, null, 2)}\n`,
  );
  return config.root;
};

const authorityProfile = (overrides = {}) => ({
  authorityEnvelopeId: "fixture.registered",
  allowedEffects: ["repo.read"],
  deniedEffects: ["repo.delete"],
  resourceLimits: {},
  requiredEvidence: ["registered-target"],
  expiresAt: Number.MAX_SAFE_INTEGER,
  revocationEventTypes: [],
  ...overrides,
});

const registeredRepository = (overrides = {}) => ({
  baseBranch: "main",
  worktreeParent: "../target-worktrees",
  repositoryClass: "fixture-class",
  authorityProfile: authorityProfile(),
  ...overrides,
});

// Every file in the launchpad that is not repository plumbing or kit source.
const documents = (root, directory = "") => {
  const here = join(root, directory);
  return readdirSync(here, { withFileTypes: true }).flatMap((entry) => {
    const path = directory ? `${directory}/${entry.name}` : entry.name;
    if ([".git", "node_modules", "scripts", "packages"].includes(path))
      return [];
    return entry.isDirectory() ? documents(root, path) : [path];
  });
};

await test("configuration root", async (t) => {
  await t.test("an absent configuration means today's layout", () => {
    temporary("config-absent", (root) => {
      const config = loadConfig(root);
      assert.equal(config.present, false);
      assert.equal(config.path, null);
      assert.equal(config.version, CONFIG_SCHEMA_VERSION);
      assert.deepEqual(config.roots, defaultRoots());
      assert.deepEqual(config.roots, {
        docs: "docs",
        control: "docs/control",
        workOrders: "docs/work-orders",
        verifications: "docs/verifications",
        finalReviews: "docs/final-reviews",
        evidence: "docs/evidence",
        releases: "docs/releases",
        planning: "docs/planning",
        publication: "docs/publication",
        intake: "docs/intake",
        workstreams: "docs/workstreams",
        lineage: "docs/lineage",
        product: "docs/product",
        discovery: "docs/discovery",
        observations: "docs/observations",
        decisions: "docs/decisions",
        orders: "docs/control/orders",
        refutations: "docs/planning/refutations",
      });
      assert.deepEqual(config.repositories, {});
      assert.deepEqual(config.build, {
        loadout: null,
        profile: null,
        overlay: null,
      });
      assert.deepEqual(config.release, {
        readmeBlock: true,
        componentVersions: true,
        corpus: true,
        publicationCheck: true,
      });
      assert.equal(
        docPath(root, "control", "current.md"),
        join(root, "docs/control/current.md"),
      );
      assert.equal(rootPattern(root, "orders"), "docs/control/orders");
    });
  });

  await t.test("a declared root moves its documents and its children", () => {
    temporary("config-roots", (root) => {
      declared({
        root,
        body: {
          version: 1,
          roots: { docs: "records", control: "records/state" },
        },
      });
      const config = loadConfig(root);
      assert.equal(config.present, true);
      assert.equal(config.path, join(root, CONFIG_FILENAME));
      assert.equal(config.roots.control, "records/state");
      // A nested root follows its parent unless the launchpad moves it too.
      assert.equal(config.roots.orders, "records/state/orders");
      assert.equal(config.roots.workOrders, "records/work-orders");
      assert.equal(
        docRelative(root, "orders", "WO-999.jsonl"),
        "records/state/orders/WO-999.jsonl",
      );
      declared({
        root,
        body: {
          version: 1,
          roots: { control: "state", orders: "segments" },
        },
      });
      assert.equal(loadConfig(root).roots.orders, "segments");
      assert.equal(loadConfig(root).roots.workOrders, "docs/work-orders");
    });
  });

  await t.test(
    "registered repositories expose a validated public profile",
    () => {
      temporary("config-repositories", (root) => {
        declared({
          root,
          body: {
            version: 1,
            repositories: { target: registeredRepository() },
          },
        });
        assert.deepEqual(loadConfig(root).repositories.target, {
          id: "target",
          ...registeredRepository(),
        });
        assert.equal(
          Object.values(loadConfig(root).repositories.target).some(
            (value) => typeof value === "string" && value.startsWith("/Users/"),
          ),
          false,
          "registration carries no absolute local path",
        );
      });
    },
  );

  await t.test("a malformed configuration refuses with its path", () => {
    temporary("config-invalid", (root) => {
      const path = join(root, CONFIG_FILENAME);
      const refuses = (body, expected) => {
        writeFileSync(
          path,
          typeof body === "string" ? body : `${JSON.stringify(body)}\n`,
        );
        assert.throws(
          () => loadConfig(root),
          (error) => {
            assert.match(error.message, new RegExp(escape(path)));
            assert.match(error.message, expected);
            return true;
          },
          `expected a refusal for ${JSON.stringify(body)}`,
        );
      };
      const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      refuses("{", /Unexpected|JSON/);
      refuses([], /must be an object/);
      refuses({ version: 2 }, /version must be 1/);
      refuses({}, /version must be 1/);
      refuses({ version: 1, unknown: {} }, /unknown configuration key/);
      refuses({ version: 1, roots: [] }, /roots must be an object/);
      refuses(
        { version: 1, roots: { nowhere: "x" } },
        /unknown roots key "nowhere"/,
      );
      refuses(
        { version: 1, roots: { control: "/absolute" } },
        /roots\.control must be relative/,
      );
      refuses(
        { version: 1, roots: { control: "../escape" } },
        /roots\.control must name a contained relative path/,
      );
      refuses({ version: 1, roots: { control: "" } }, /non-empty string/);
      refuses({ version: 1, repositories: [] }, /repositories must be/);
      refuses(
        { version: 1, repositories: { target: 1 } },
        /repositories\.target must be an object/,
      );
      refuses(
        { version: 1, repositories: { self: registeredRepository() } },
        /repositories\.self is implicit/,
      );
      refuses(
        { version: 1, repositories: { target: {} } },
        /baseBranch must be a non-empty valid string/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({ worktreeParent: "/private/path" }),
          },
        },
        /worktreeParent must be a relative normalized POSIX path/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({
              worktreeParent: "targets/../worktrees",
            }),
          },
        },
        /worktreeParent must be a relative normalized POSIX path/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({
              authorityProfile: authorityProfile({ allowedEffects: ["*"] }),
            }),
          },
        },
        /allowedEffects must be an array of exact ids/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({
              authorityProfile: authorityProfile({ expiresAt: "later" }),
            }),
          },
        },
        /expiresAt must be a non-negative safe integer/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({ unknown: true }),
          },
        },
        /unknown repositories\.target key/,
      );
      refuses({ version: 1, build: { loadout: 1 } }, /build\.loadout/);
      refuses({ version: 1, build: { other: "x" } }, /unknown build key/);
      refuses({ version: 1, release: { corpus: "yes" } }, /release\.corpus/);
      refuses({ version: 1, release: { other: true } }, /unknown release key/);
    });
  });

  await t.test("the launchpad is discovered, and the override wins", () => {
    temporary("config-discovery", (root) => {
      const kit = join(root, "vendor/dotln");
      const instance = join(root, "instance");
      mkdirSync(join(kit, "scripts/lib"), { recursive: true });
      mkdirSync(instance, { recursive: true });
      // No marker above the kit: the launchpad is the kit's own checkout.
      assert.equal(findLaunchpad({ toolRoot: kit, cwd: root, env: {} }), kit);
      // A declared configuration above the kit claims it.
      writeFileSync(join(root, CONFIG_FILENAME), '{"version":1}\n');
      assert.equal(findLaunchpad({ toolRoot: kit, cwd: root, env: {} }), root);
      rmSync(join(root, CONFIG_FILENAME));
      // A Git top level stops the ascent just as a configuration does.
      mkdirSync(join(root, ".git"), { recursive: true });
      assert.equal(findLaunchpad({ toolRoot: kit, cwd: root, env: {} }), root);
      // The kit's own configuration is nearer than the enclosing repository.
      writeFileSync(join(kit, CONFIG_FILENAME), '{"version":1}\n');
      assert.equal(findLaunchpad({ toolRoot: kit, cwd: root, env: {} }), kit);
      // The override selects a launchpad the session runs outside of.
      assert.equal(
        findLaunchpad({
          toolRoot: kit,
          cwd: root,
          env: { DOTLN_LAUNCHPAD: instance },
        }),
        instance,
      );
      assert.equal(
        findLaunchpad({
          toolRoot: kit,
          cwd: root,
          env: { DOTLN_LAUNCHPAD: "instance" },
        }),
        instance,
      );
      assert.throws(
        () =>
          findLaunchpad({
            toolRoot: kit,
            cwd: root,
            env: { DOTLN_LAUNCHPAD: join(root, "absent") },
          }),
        /DOTLN_LAUNCHPAD names a missing directory/,
      );
    });
  });

  await t.test(
    "no control-plane script keeps a literal document root or a second root derivation",
    () => {
      const owner = join("scripts", "lib", "config.mjs");
      const sources = [];
      const collect = (directory) => {
        for (const entry of readdirSync(join(sourceRoot, directory), {
          withFileTypes: true,
        })) {
          const path = `${directory}/${entry.name}`;
          if (entry.isDirectory()) collect(path);
          else if (
            entry.name.endsWith(".mjs") &&
            !/(^|\/)test-|\.test\.mjs$/.test(path) &&
            path !== owner.split(sep).join("/")
          )
            sources.push(path);
        }
      };
      collect("scripts");
      assert.ok(sources.length > 40, "expected the control plane's sources");

      // A document root is a path-shaped literal: prose that mentions a root
      // in a sentence is documentation, and a bare "docs" is a root key here.
      const literal = /(["'`])(docs\/[^"'`\n]*)\1/g;
      const inRegExp = /docs\\\//g;
      const derivations = [
        /newURL\("(?:\.\.\/)+",import\.meta\.url\)/,
        /fileURLToPath\(import\.meta\.url\)\),?"\.\.(?:\/\.\.)*"/,
        /import\.meta\.dirname,"\.\.(?:\/\.\.)*"/,
        /fileURLToPath\(newURL\(["']\.\/["'],import\.meta\.url\)\)/,
      ];
      const missedTwoStep =
        'const here = fileURLToPath(new URL("./", import.meta.url));\nconst repositoryRoot = resolve(here, "../..");';
      assert.ok(
        derivations.some((pattern) =>
          pattern.test(missedTwoStep.replace(/\s+/g, "")),
        ),
        "the guard recognizes a module-directory variable used for a second root derivation",
      );
      const offences = [];
      for (const path of sources) {
        const source = readFileSync(join(sourceRoot, path), "utf8");
        for (const match of source.matchAll(literal))
          if (!/\s/.test(match[2])) offences.push(`${path}: ${match[0]}`);
        for (const match of source.matchAll(inRegExp))
          offences.push(`${path}: ${match[0]}`);
        const compact = source.replace(/\s+/g, "");
        for (const pattern of derivations) {
          const found = pattern.exec(compact);
          if (found) offences.push(`${path}: ${found[0]}`);
        }
      }
      assert.deepEqual(
        offences,
        [],
        `resolve these through scripts/lib/config.mjs:\n${offences.join("\n")}`,
      );
    },
  );

  await t.test(
    "configured lineage and planning consumers use the launchpad ledger",
    async () => {
      const root = realpathSync(
        mkdtempSync(join(tmpdir(), "dotln-config-planning-")),
      );
      try {
        declared({ root, body: { version: 1, roots: { docs: "records" } } });
        const declaration = statuses.map((status) => `\`${status}\``).join(" ");
        write(
          root,
          "records/lineage/idea-ledger.md",
          `# Fixture ledger\n\nStatuses: ${declaration}\n\n## 2026-09-21 planning pass — configured roots\n\n- **Configured roots** \`candidate\`\n`,
        );
        write(root, "scripts/refute-plan.mjs", "// fixture introduction\n");
        git(root, "init", "-q", "-b", "main");
        git(root, "config", "user.email", "fixture@example.invalid");
        git(root, "config", "user.name", "Fixture");
        git(root, "add", ".");
        git(root, "commit", "-q", "-m", "configured planning fixture");

        lineageMain(["index"], root);
        assert.ok(existsSync(join(root, "records/lineage/README.md")));
        assert.equal(existsSync(join(root, "docs/lineage/README.md")), false);

        const scope = planningPassScope(root);
        assert.equal(scope.passes.length, 1);
        assert.match(scope.passes[0].heading, /configured roots/);
        assert.deepEqual(await latestPlanningPass(root, []), {
          id: scope.passes[0].id,
          kind: "planning",
          heading: scope.passes[0].heading,
        });

        const direct = readFileSync(
          join(sourceRoot, "scripts/lib/plan-direct.mjs"),
          "utf8",
        );
        const receipts = readFileSync(
          join(sourceRoot, "scripts/lib/plan-receipts.mjs"),
          "utf8",
        );
        assert.doesNotMatch(direct, /\bPLAN_LEDGER\b|\bRECEIPTS\b/);
        assert.doesNotMatch(receipts, /\bPLAN_LEDGER\b/);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  await t.test(
    "configured follow-up references validate against their roots",
    () => {
      temporary("config-followups", (root) => {
        declared({ root, body: { version: 1, roots: { docs: "records" } } });
        write(
          root,
          "records/product/00-fixture.md",
          "# Fixture\n\n## Candidate — configured-root follow-up\n\nPortable candidate.\n",
        );
        mkdirSync(join(root, "records/evidence"), { recursive: true });
        const state = syncFollowups(root);
        assert.equal(state.entries.length, 1);
        assert.match(
          state.entries[0].revisions[0].ref,
          /^records\/product\/00-fixture\.md#/,
        );
        assert.ok(existsSync(join(root, "records/planning/followups.json")));
        assert.equal(
          existsSync(join(root, "docs/planning/followups.json")),
          false,
        );
      });
    },
  );

  await t.test(
    "writing-worker defaults separate tool inputs from configured outputs",
    async () => {
      const root = realpathSync(
        mkdtempSync(join(tmpdir(), "dotln-config-writing-worker-")),
      );
      const tool = join(root, "tool");
      const launchpad = join(root, "launchpad");
      try {
        mkdirSync(join(tool, "scripts/lib"), { recursive: true });
        cpSync(
          join(sourceRoot, "scripts/lib/config.mjs"),
          join(tool, "scripts/lib/config.mjs"),
        );
        cpSync(
          join(sourceRoot, "scripts/lib/writing-worker-probe.mjs"),
          join(tool, "scripts/lib/writing-worker-probe.mjs"),
        );
        mkdirSync(join(launchpad, "records/discovery"), { recursive: true });
        declared({
          root: launchpad,
          body: { version: 1, roots: { docs: "records" } },
        });
        const prior = process.env.DOTLN_LAUNCHPAD;
        process.env.DOTLN_LAUNCHPAD = launchpad;
        try {
          const { renderReport } = await import(
            `${pathToFileURL(join(tool, "scripts/lib/writing-worker-probe.mjs")).href}?fixture=${Date.now()}`
          );
          renderReport({ date: "2099-01-01" });
        } finally {
          if (prior === undefined) delete process.env.DOTLN_LAUNCHPAD;
          else process.env.DOTLN_LAUNCHPAD = prior;
        }
        assert.ok(
          existsSync(
            join(
              launchpad,
              "records/discovery/writing-worker-smoke-2099-01-01.md",
            ),
          ),
        );
        assert.equal(
          existsSync(
            join(tool, "docs/discovery/writing-worker-smoke-2099-01-01.md"),
          ),
          false,
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  await t.test(
    "a fixture launchpad with non-default roots drives the lifecycle",
    () => {
      temporary("config-lifecycle", (root) => {
        const roots = {
          docs: "records",
          control: "records/state",
          orders: "records/state/segments",
          workOrders: "records/orders",
          verifications: "records/checks",
          finalReviews: "records/reviews",
          evidence: "records/proof",
        };
        const baseCommit = "a".repeat(40);
        declared({
          root,
          body: {
            version: 1,
            roots,
            repositories: { target: registeredRepository() },
          },
        });
        mkdirSync(join(root, "scripts"), { recursive: true });
        cpSync(
          join(scriptRoot, "resume.mjs"),
          join(root, "scripts/resume.mjs"),
        );
        cpSync(join(scriptRoot, "lib"), join(root, "scripts/lib"), {
          recursive: true,
        });
        installBeaconFixture(root);
        git(root, "init", "-q", "-b", "wo-999");
        git(root, "config", "user.email", "fixture@example.invalid");
        git(root, "config", "user.name", "Fixture");

        const order = `${roots.workOrders}/WO-999-fixture.md`;
        write(
          root,
          order,
          `# WO-999 — configuration-root fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${baseCommit}\n`,
        );
        const actor = [
          "--harness",
          "human",
          "--harness-version",
          "not-applicable",
          "--model",
          "human",
          "--effort",
          "unknown",
          "--source",
          "operator-attested",
        ];
        const attestation = {
          harness: "human",
          harnessVersion: "not-applicable",
          model: "human",
          effort: "unknown",
          source: "operator-attested",
        };
        const call = (...args) =>
          spawnSync(
            process.execPath,
            [join(root, "scripts/resume.mjs"), ...args],
            { encoding: "utf8", cwd: root },
          );
        const run = (...args) => {
          const result = call(...args);
          assert.equal(
            result.status,
            0,
            `resume ${args[0]}: ${result.stderr || result.stdout}`,
          );
          return result.stdout;
        };

        write(
          root,
          order,
          "# WO-999 — configuration-root fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @\n",
        );
        assert.match(
          call("activate", "WO-999", order).stderr,
          /malformed \*\*Repository:\*\* line/,
        );
        write(
          root,
          order,
          `# WO-999 — configuration-root fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** unknown @ ${baseCommit}\n`,
        );
        assert.match(
          call("activate", "WO-999", order).stderr,
          /unknown repository id "unknown"/,
        );
        declared({
          root,
          body: {
            version: 1,
            roots,
            repositories: {
              target: registeredRepository({
                authorityProfile: authorityProfile({ allowedEffects: ["*"] }),
              }),
            },
          },
        });
        write(
          root,
          order,
          `# WO-999 — configuration-root fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${baseCommit}\n`,
        );
        assert.match(
          call("activate", "WO-999", order).stderr,
          /dotln\.config\.json: repositories\.target\.authorityProfile\.allowedEffects/,
        );
        declared({
          root,
          body: {
            version: 1,
            roots,
            repositories: { target: registeredRepository() },
          },
        });
        run("activate", "WO-999", order, ...actor);
        assert.ok(
          existsSync(join(root, `${roots.orders}/WO-999.jsonl`)),
          "the activation segment lands under the configured orders root",
        );
        run("implementation-ready", ...actor);
        const verify = run("verify");
        const verification = `${roots.verifications}/WO-999/VER-001.md`;
        assert.match(verify, new RegExp(verification.replace(/\//g, "\\/")));
        write(
          root,
          verification,
          `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(attestation)}\n\n**Process cost:** unknown; cause no-session\n`,
        );
        run("verification-result", "pass", ...actor);
        const review = run("final-review");
        const finalReview = `${roots.finalReviews}/WO-999/FINAL-001.md`;
        assert.match(review, new RegExp(finalReview.replace(/\//g, "\\/")));
        write(
          root,
          finalReview,
          `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(attestation)}\n\n**Process cost:** unknown; cause no-session\n`,
        );
        run("final-review-result", "pass", ...actor);

        const status = JSON.parse(run("status", "--json"));
        assert.equal(status.phase, "closed");
        assert.equal(status.workOrderPath, order);
        assert.equal(status.repositoryId, "target");
        assert.equal(status.baseCommit, baseCommit);
        assert.equal(status.orders[0].repositoryId, "target");
        assert.equal(status.orders[0].baseCommit, baseCommit);
        assert.equal(status.verificationPath, verification);
        assert.equal(status.finalReviewPath, finalReview);
        const activation = JSON.parse(
          readFileSync(join(root, `${roots.orders}/WO-999.jsonl`), "utf8")
            .trim()
            .split("\n")[0],
        );
        assert.equal(activation.repositoryId, "target");
        assert.equal(activation.baseCommit, baseCommit);
        assert.equal(
          JSON.stringify(activation).includes("target-worktrees"),
          false,
          "the activation event carries no worktree path",
        );
        const current = readFileSync(
          join(root, `${roots.control}/current.md`),
          "utf8",
        );
        assert.match(current, new RegExp(`Repository: target @ ${baseCommit}`));
        assert.doesNotMatch(current, /target-worktrees/);
        assert.ok(
          current.includes(`${roots.control}/resume.jsonl`),
          "the projection cites its own configured storage",
        );

        // Every lifecycle document follows the configuration. The only
        // default-rooted writes left are the Git-ignored local harness lane
        // owned by packages/skeleton, which resolves its own paths until the
        // kit carries this loader (WO-069-D005; WO-070 owns that dependency).
        const outside = documents(root).filter(
          (path) =>
            !path.startsWith("records/") &&
            path !== CONFIG_FILENAME &&
            !path.startsWith(".control-beacons/") &&
            !path.startsWith("docs/control/local/"),
        );
        assert.deepEqual(
          outside,
          [],
          `unexpected documents outside the configured roots: ${outside.join(", ")}`,
        );
        assert.equal(
          existsSync(join(root, "docs/work-orders")),
          false,
          "no lifecycle document falls back to a default root",
        );
        for (const key of [
          "control",
          "orders",
          "verifications",
          "finalReviews",
        ])
          assert.ok(
            existsSync(docPath(root, key)),
            `${key} is written under its configured root`,
          );
      });
    },
  );

  await t.test(
    "worktree start and finish use the configured roots",
    { timeout: 300_000 },
    () => {
      temporary("config-worktree", (root) => {
        const roots = {
          docs: "records",
          control: "records/state",
          workOrders: "records/orders",
          verifications: "records/checks",
          finalReviews: "records/reviews",
        };
        const origin = join(root, "origin.git");
        const main = join(root, "project");
        assert.equal(
          spawnSync("git", ["init", "--bare", "-b", "main", origin]).status,
          0,
        );
        assert.equal(spawnSync("git", ["clone", "-q", origin, main]).status, 0);
        git(main, "config", "user.email", "fixture@example.invalid");
        git(main, "config", "user.name", "Fixture");
        git(main, "switch", "-q", "-c", "main");

        mkdirSync(join(main, "scripts"), { recursive: true });
        for (const name of [
          "worktree.mjs",
          "resume.mjs",
          "release.mjs",
          "release-notes.mjs",
          "github-repository.mjs",
          "github-body.mjs",
        ])
          cpSync(join(scriptRoot, name), join(main, "scripts", name));
        // The fixture has no dependency tree to install; worktree start still
        // prepares the checkout through this entry point.
        write(
          main,
          "scripts/bootstrap.mjs",
          'import { mkdirSync, writeFileSync } from "node:fs";\nmkdirSync(".runtime", { recursive: true });\nwriteFileSync(".runtime/bootstrap-ready", "prepared");\n',
        );
        cpSync(join(scriptRoot, "lib"), join(main, "scripts/lib"), {
          recursive: true,
        });
        installBeaconFixture(main);
        declared({ root: main, body: { version: 1, roots } });
        const order = `${roots.workOrders}/WO-999-fixture.md`;
        write(
          main,
          order,
          "# WO-999 — configuration-root worktree fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
        );
        write(main, "package.json", '{"private":true}\n');
        write(main, ".gitignore", `${roots.control}/local/\n`);
        git(main, "add", ".");
        git(main, "commit", "-q", "-m", "fixture");
        git(main, "push", "-q", "-u", "origin", "main");

        const worktree = (cwd, ...args) => {
          const result = spawnSync(
            process.execPath,
            [join(main, "scripts/worktree.mjs"), ...args],
            { encoding: "utf8", cwd },
          );
          return result;
        };
        const started = worktree(main, "start", "WO-999", order);
        assert.equal(
          started.status,
          0,
          `worktree start: ${started.stderr || started.stdout}`,
        );
        const subject = join(root, "project-wo999");
        assert.ok(existsSync(subject), "the worktree was created");
        assert.ok(
          existsSync(join(subject, `${roots.control}/orders/WO-999.jsonl`)),
          "activation recorded under the configured control root",
        );
        assert.equal(existsSync(join(subject, "docs/work-orders")), false);

        const actor = [
          "--harness",
          "human",
          "--harness-version",
          "not-applicable",
          "--model",
          "human",
          "--effort",
          "unknown",
          "--source",
          "operator-attested",
        ];
        const attestation = {
          harness: "human",
          harnessVersion: "not-applicable",
          model: "human",
          effort: "unknown",
          source: "operator-attested",
        };
        const resume = (...args) => {
          const result = spawnSync(
            process.execPath,
            [join(subject, "scripts/resume.mjs"), ...args],
            { encoding: "utf8", cwd: subject },
          );
          assert.equal(
            result.status,
            0,
            `resume ${args[0]}: ${result.stderr || result.stdout}`,
          );
          return result.stdout;
        };
        resume("implementation-ready", ...actor);
        resume("verify");
        write(
          subject,
          `${roots.verifications}/WO-999/VER-001.md`,
          `# Verification fixture\n\n**Actor attestation:** ${JSON.stringify(attestation)}\n\n**Process cost:** unknown; cause no-session\n`,
        );
        resume("verification-result", "pass", ...actor);
        resume("final-review");
        write(
          subject,
          `${roots.finalReviews}/WO-999/FINAL-001.md`,
          `# Final fixture\n\n**Actor attestation:** ${JSON.stringify(attestation)}\n\n**Process cost:** unknown; cause no-session\n`,
        );
        resume("final-review-result", "pass", ...actor);
        git(subject, "add", ".");
        git(subject, "commit", "-q", "-m", "WO-999 closed");
        git(main, "merge", "-q", "--no-ff", "-m", "merge WO-999", "wo-999");
        git(main, "push", "-q", "origin", "main");

        const finished = worktree(main, "finish", "WO-999");
        assert.equal(
          finished.status,
          0,
          `worktree finish: ${finished.stderr || finished.stdout}`,
        );
        assert.equal(existsSync(subject), false, "the worktree was removed");
        assert.equal(
          git(main, "branch", "--list", "wo-999"),
          "",
          "the merged branch was removed",
        );
        assert.equal(existsSync(join(main, "docs/work-orders")), false);
        assert.ok(
          existsSync(join(main, `${roots.finalReviews}/WO-999/FINAL-001.md`)),
          "the merged review is present under its configured root",
        );
      });
    },
  );

  await t.test("every declared root key is reachable", () => {
    temporary("config-keys", (root) => {
      for (const key of ROOT_KEYS)
        assert.equal(
          relative(root, docPath(root, key)).startsWith(".."),
          false,
          `${key} must resolve inside the launchpad`,
        );
      assert.throws(
        () => docRelative(root, "nowhere"),
        /unknown document root/,
      );
    });
  });
});
