import { copyFixtureFiles } from "./lib/fixture-inputs.mjs";
import { spawnGit, runGit } from "./lib/git.mjs";
import { write, json as prettyJson } from "./lib/helpers.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
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
import { recordGateChecks, gateTreeHash } from "./lib/gate-evidence.mjs";
import { gateCommandsHash } from "./lib/target-gate.mjs";
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
  targetDocRelative,
  validReleaseDisplayName,
} from "./lib/config.mjs";

import { isKitRoot } from "../packages/skeleton/src/runtime-inputs.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(scriptRoot, "..");
// These disposable lifecycle fixtures are not live host sessions.
const fixtureEnvironment = {
  ...process.env,
  CODEX_THREAD_ID: "",
  COPILOT_AGENT_SESSION_ID: "",
};

const temporary = (prefix, run) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), `dotln-${prefix}-`)));
  try {
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

const fixtureGitOptions = {
  maxBuffer: 1024 * 1024,
  onFailure: (result, args) =>
    assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`),
};

const declared = (config) => {
  write(
    config.root,
    CONFIG_FILENAME,
    prettyJson({
      classes: { "fixture-class": { checks: [], supports: [] } },
      ...config.body,
    }),
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
  automationLogins: [],
  linkHosts: [],
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

test("publication declarations under a configured root require both editions", () =>
  temporary("publication-declarations", (root) => {
    cpSync(join(scriptRoot, "lib"), join(root, "scripts/lib"), {
      recursive: true,
    });
    cpSync(
      join(scriptRoot, "check-publication.mjs"),
      join(root, "scripts/check-publication.mjs"),
    );
    installBeaconFixture(root);
    declared({
      root,
      body: { version: 1, roots: { publication: "records/editions" } },
    });
    const check = (...args) =>
      spawnSync(process.execPath, ["scripts/check-publication.mjs", ...args], {
        cwd: root,
        env: { ...fixtureEnvironment, DOTLN_LAUNCHPAD: "" },
        encoding: "utf8",
      });
    assert.equal(check().status, 0);
    assert.match(check().stdout, /no editions declared/);
    assert.equal(check("--expect-stale").status, 1);
    for (const name of [
      "audience-status-index.md",
      "base-outline.md",
      "dual-voice-sample.md",
      "everyday-ai-user-toc.md",
      "software-engineer-toc.md",
    ]) {
      const file = `records/editions/${name}`;
      write(root, file, "Declared publication\n");
      for (const args of [[], ["--expect-stale"]]) {
        const result = check(...args);
        assert.equal(result.status, 1, name);
        assert.match(
          result.stderr,
          /declared editions missing: records\/editions\//,
        );
        assert.doesNotMatch(result.stdout, /no editions declared/);
      }
      rmSync(join(root, file));
    }
  }));

await test("configuration root", async (t) => {
  await t.test(
    "WO-184 criterion 10: a configuration FIFO refuses promptly by path",
    () => {
      temporary("config-fifo", (root) => {
        const file = join(root, CONFIG_FILENAME);
        assert.equal(spawnSync("mkfifo", [file]).status, 0);
        const run = spawnSync(
          process.execPath,
          [
            "--input-type=module",
            "-e",
            `import {loadConfig} from ${JSON.stringify(pathToFileURL(join(scriptRoot, "lib/config.mjs")).href)}; loadConfig(process.argv[1]);`,
            root,
          ],
          { encoding: "utf8", timeout: 5000 },
        );
        assert.equal(run.status, 1, run.stderr);
        assert.ok(run.stderr.includes(file));
        assert.match(run.stderr, /expected a regular file/);
        assert.equal(run.error, undefined);
      });
    },
  );
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
        repositoryProfiles: "docs/repositories",
        siblings: "docs/siblings",
        orders: "docs/control/orders",
        derivedWorkOrders: "docs/work-orders/derived",
        refutations: "docs/planning/refutations",
      });
      assert.deepEqual(config.repositories, {});
      assert.deepEqual(config.classes, {});
      assert.deepEqual(config.kit, { applyInstanceActions: false });
      assert.deepEqual(config.build, {
        loadout: null,
        profile: null,
        overlay: null,
      });
      assert.deepEqual(config.release, {
        displayName: "DotLn",
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

  await t.test(
    "a kit section admits only applyInstanceActions as a boolean",
    () => {
      temporary("config-kit", (root) => {
        for (const kit of [
          {},
          { applyInstanceActions: false },
          { applyInstanceActions: true },
        ]) {
          declared({ root, body: { version: 1, kit } });
          assert.deepEqual(loadConfig(root).kit, {
            applyInstanceActions: kit.applyInstanceActions ?? false,
          });
        }
        for (const kit of [
          null,
          [],
          true,
          { other: true },
          { applyInstanceActions: "true" },
          { applyInstanceActions: null },
        ]) {
          declared({ root, body: { version: 1, kit } });
          assert.throws(() => loadConfig(root), /dotln\.config\.json.*kit/);
        }
      });
    },
  );

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
          documentationRoot: "docs",
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

  await t.test(
    "target gate declarations and document layouts are validated",
    () => {
      temporary("target-gate-config", (root) => {
        const gate = {
          commands: {
            test: { argv: ["node", "test.mjs"], timeoutMs: 5000 },
            lint: { argv: ["node", "lint.mjs"], timeoutMs: 1000 },
          },
          plain: ["test"],
          review: ["test", "lint"],
        };
        const body = {
          version: 1,
          repositories: { target: registeredRepository({ gate }) },
        };
        const check = () => {
          declared({ root, body });
          return loadConfig(root).repositories.target;
        };
        assert.deepEqual(check().gate, gate);
        for (const base of ["docs", "records/native"]) {
          body.repositories.target.documentationRoot = base;
          const repository = check();
          for (const [key, segment] of [
            ["product", "product"],
            ["planning", "planning"],
            ["workOrders", "work-orders"],
            ["evidence", "evidence"],
            ["verifications", "verifications"],
            ["finalReviews", "final-reviews"],
          ])
            assert.equal(
              targetDocRelative(repository, key, "file.md"),
              `${base}/${segment}/file.md`,
            );
        }
        const original = structuredClone(body);
        const refuses = (change, key) => {
          body.repositories.target = structuredClone(
            original.repositories.target,
          );
          change(body.repositories.target);
          assert.throws(
            check,
            (error) =>
              error.message.includes("dotln.config.json") &&
              error.message.includes(`repositories.target.${key}`),
          );
        };
        for (const root of [
          "/abs",
          "x/../y",
          "x/./y",
          "x//y",
          "x/",
          "x\\y",
          "../outside",
          ".",
          "",
        ])
          refuses((r) => {
            r.documentationRoot = root;
          }, "documentationRoot");
        refuses((r) => {
          r.gate.extra = true;
        }, "gate");
        refuses((r) => {
          r.gate.commands.Test = r.gate.commands.test;
        }, "gate.commands.Test");
        refuses((r) => {
          r.gate.commands.test.extra = true;
        }, "gate.commands.test");
        for (const argv of [[], [null], [""], "node"])
          refuses((r) => {
            r.gate.commands.test.argv = argv;
          }, "gate.commands.test.argv");
        for (const timeout of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, "100"])
          refuses((r) => {
            r.gate.commands.test.timeoutMs = timeout;
          }, "gate.commands.test.timeoutMs");
        for (const plain of [[], ["missing"], ["test", "test"]])
          refuses((r) => {
            r.gate.plain = plain;
          }, "gate.plain");
        refuses((r) => {
          r.gate.review = ["lint"];
        }, "gate.review");
        refuses((r) => {
          r.gate.review = ["test", "missing"];
        }, "gate.review");
      });
    },
  );

  await t.test(
    "WO-073 classes and optional registration declarations validate",
    () => {
      temporary("class-config", (root) => {
        const body = {
          version: 1,
          classes: {
            shared: { checks: ["test", "test"], supports: ["scope"] },
          },
          repositories: {
            target: registeredRepository({
              repositoryClass: "shared",
              profile: "profiles/target.md",
              automationLogins: ["review-machine"],
              linkHosts: ["reviews.example"],
            }),
          },
        };
        declared({ root, body });
        assert.deepEqual(loadConfig(root).classes.shared, {
          checks: ["test"],
          supports: ["scope"],
        });
        assert.equal(
          loadConfig(root).repositories.target.profile,
          "profiles/target.md",
        );
        const refuses = (change, pattern) => {
          const candidate = structuredClone(body);
          change(candidate);
          declared({ root, body: candidate });
          assert.throws(() => loadConfig(root), pattern);
        };
        refuses((c) => {
          c.classes = null;
        }, /classes must be an object/);
        refuses((c) => {
          c.repositories.target.linkHosts = null;
        }, /linkHosts must be an array/);
        refuses((c) => {
          c.classes = {};
        }, /repositoryClass names no declared class/);
        refuses((c) => {
          c.classes.shared.unknown = [];
        }, /unknown classes.shared key/);
        refuses((c) => {
          c.classes.shared.checks = "test";
        }, /checks must be an array/);
        refuses((c) => {
          c.classes.shared.supports = [""];
        }, /supports must be an array/);
        refuses((c) => {
          c.repositories.target.automationLogins = "bot";
        }, /automationLogins must be an array/);
        refuses((c) => {
          c.repositories.target.linkHosts = [""];
        }, /linkHosts must be an array/);
        for (const profile of [
          "/absolute.md",
          "profiles/../target.md",
          "profiles/./target.md",
          "profiles/",
          "profiles\\target.md",
        ])
          refuses((c) => {
            c.repositories.target.profile = profile;
          }, /profile must be a relative normalized POSIX path/);
      });
    },
  );

  await t.test(
    "WO-073 criterion 3: activation reads only a declared contained regular profile",
    () => {
      for (const kind of [
        "missing",
        "directory",
        "symlink",
        "escape",
        "unreadable",
        "readable",
        "undeclared",
      ]) {
        temporary(`profile-${kind}`, (root) => {
          const launchpad = join(root, "launchpad");
          mkdirSync(join(launchpad, "scripts"), { recursive: true });
          cpSync(
            join(scriptRoot, "resume.mjs"),
            join(launchpad, "scripts/resume.mjs"),
          );
          cpSync(join(scriptRoot, "lib"), join(launchpad, "scripts/lib"), {
            recursive: true,
          });
          installBeaconFixture(launchpad);
          runGit(launchpad, ["init", "-q", "-b", "wo-999"], fixtureGitOptions);
          const profile =
            kind === "escape" ? "../outside.md" : "profiles/target.md";
          const file = join(launchpad, profile);
          mkdirSync(join(launchpad, "profiles"));
          if (kind === "directory") mkdirSync(file);
          else if (kind === "symlink") {
            write(root, "outside.md", "external");
            symlinkSync(join(root, "outside.md"), file);
          } else if (!["missing", "undeclared"].includes(kind))
            writeFileSync(
              file,
              "Profile content is not parsed during activation.\n",
            );
          if (kind === "unreadable") chmodSync(file, 0);
          declared({
            root: launchpad,
            body: {
              version: 1,
              roots: { docs: "records", repositoryProfiles: "profiles" },
              repositories: {
                target: registeredRepository(
                  kind === "undeclared" ? {} : { profile },
                ),
              },
            },
          });
          const order = "records/work-orders/WO-999-profile.md";
          write(
            launchpad,
            order,
            `# WO-999 — profile fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${"a".repeat(40)}\n`,
          );
          const env = { ...process.env, DOTLN_LAUNCHPAD: launchpad };
          delete env.CODEX_THREAD_ID;
          const result = spawnSync(
            process.execPath,
            [
              join(launchpad, "scripts/resume.mjs"),
              "activate",
              "WO-999",
              order,
            ],
            { cwd: launchpad, env, encoding: "utf8" },
          );
          if (kind === "unreadable") chmodSync(file, 0o600);
          if (["readable", "undeclared"].includes(kind)) {
            assert.equal(result.status, 0, result.stderr);
            assert.match(result.stdout, /Activated WO-999/);
            assert.equal(
              (
                result.stderr.match(
                  /Advisory: repository target declares no profile/g,
                ) ?? []
              ).length,
              kind === "undeclared" ? 1 : 0,
            );
          } else {
            assert.equal(result.status, 1, `${kind}: ${result.stdout}`);
            assert.ok(result.stderr.includes(profile), result.stderr);
            assert.match(
              result.stderr,
              /profile must be a readable contained regular file/,
            );
            assert.equal(
              existsSync(
                join(launchpad, "records/control/orders/WO-999.jsonl"),
              ),
              false,
            );
          }
        });
      }
    },
  );

  await t.test("a malformed configuration refuses with its path", () => {
    temporary("config-invalid", (root) => {
      const path = join(root, CONFIG_FILENAME);
      const refuses = (body, expected) => {
        writeFileSync(
          path,
          typeof body === "string"
            ? body
            : `${JSON.stringify(Array.isArray(body) ? body : { classes: { "fixture-class": { checks: [], supports: [] } }, ...body })}\n`,
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
      // The WO-221 keys: disposable paths stay inside the checkout, a target
      // release is declared or absent, and the host-rule fallback is literal.
      refuses(
        {
          version: 1,
          classes: {
            "fixture-class": { checks: [], supports: [], disposable: ["/abs"] },
          },
        },
        /classes\.fixture-class\.disposable entries must be contained relative normalized POSIX paths: \/abs/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({ disposable: ["../out"] }),
          },
        },
        /repositories\.target\.disposable entries must be contained/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({ disposable: "dist" }),
          },
        },
        /repositories\.target\.disposable must be an array/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({ release: { policy: "always" } }),
          },
        },
        /repositories\.target\.release\.policy must be "declared"/,
      );
      refuses(
        {
          version: 1,
          repositories: {
            target: registeredRepository({ hostRules: "prose" }),
          },
        },
        /repositories\.target\.hostRules must be "literal"/,
      );
      writeFileSync(
        path,
        `${JSON.stringify({
          version: 1,
          classes: {
            "fixture-class": { checks: [], supports: [], disposable: ["dist"] },
          },
          repositories: {
            target: registeredRepository({
              disposable: ["node_modules/", "dist", ".angular"],
              release: { policy: "declared" },
              hostRules: "literal",
            }),
            plain: registeredRepository(),
          },
        })}\n`,
      );
      const declared = loadConfig(root);
      assert.deepEqual(declared.classes["fixture-class"].disposable, ["dist"]);
      assert.deepEqual(declared.repositories.target.disposable, [
        ".angular",
        "dist",
        "node_modules",
      ]);
      assert.deepEqual(declared.repositories.target.release, {
        policy: "declared",
      });
      assert.equal(declared.repositories.target.hostRules, "literal");
      assert.deepEqual(declared.repositories.plain.disposable, ["dist"]);
      assert.equal(declared.repositories.plain.release, undefined);
      assert.equal(declared.repositories.plain.hostRules, undefined);
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
      for (const displayName of [
        null,
        3,
        "",
        " padded",
        "padded ",
        "two\nlines",
        "tab\tname",
        "bad`name",
        "bad\u2028name",
        "bad\u202ename",
        "bad\ud800name",
        "bad\udfffname",
        "Project v2.0.0",
        "x".repeat(65),
      ])
        refuses(
          { version: 1, release: { displayName } },
          /release\.displayName/,
        );
      // The refusal names every class it rejects, the bound included.
      refuses(
        { version: 1, release: { displayName: "bad\u202ename" } },
        /at most 64 characters without control or format characters, backticks or release version tokens/,
      );
      writeFileSync(
        path,
        `${JSON.stringify({ classes: { "fixture-class": { checks: [], supports: [] } }, version: 1, release: { displayName: "x".repeat(64) } })}\n`,
      );
      assert.equal(loadConfig(root).release.displayName, "x".repeat(64));
      // The shape predicate also recognizes names already in tag annotations
      // and README text, which were admitted at any length; only a declared
      // name is bounded.
      assert.equal(validReleaseDisplayName("x".repeat(65)), true);
      assert.equal(validReleaseDisplayName("Example 🚀"), true);
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
      // The split launchpad tests share deliberately fixed fixture paths;
      // this moved helper remains test code, not a control-plane consumer.
      const fixtureHelper = "scripts/lib/launchpad-fixture.mjs";
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
            path !== fixtureHelper &&
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
        runGit(root, ["init", "-q", "-b", "main"], fixtureGitOptions);
        runGit(
          root,
          ["config", "user.email", "fixture@example.invalid"],
          fixtureGitOptions,
        );
        runGit(root, ["config", "user.name", "Fixture"], fixtureGitOptions);
        runGit(root, ["add", "."], fixtureGitOptions);
        // Date the introduction on the ledger heading's day, not the wall
        // clock: planningPassScope admits passes from the introduction on.
        const committed = spawnGit(
          ["-C", root, "commit", "-q", "-m", "configured planning fixture"],
          {
            encoding: "utf8",
            env: {
              ...process.env,
              GIT_COMMITTER_DATE: "2026-09-21T12:00:00+00:00",
            },
          },
        );
        assert.equal(committed.status, 0, committed.stderr);

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
        copyFixtureFiles(
          sourceRoot,
          tool,
          "scripts/test-configuration-root.fixture-inputs.json",
          "configured writing worker",
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
        const target = join(root, "target");
        mkdirSync(target);
        runGit(target, ["init", "-q", "-b", "wo-999"], fixtureGitOptions);
        runGit(
          target,
          [
            "-c",
            "user.email=fixture@example.invalid",
            "-c",
            "user.name=Fixture",
            "commit",
            "--allow-empty",
            "-qm",
            "test: base",
          ],
          fixtureGitOptions,
        );
        const baseCommit = runGit(
          target,
          ["rev-parse", "HEAD"],
          fixtureGitOptions,
        );
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
        cpSync(
          join(scriptRoot, "outward-lint.mjs"),
          join(root, "scripts/outward-lint.mjs"),
        );
        cpSync(join(scriptRoot, "lib"), join(root, "scripts/lib"), {
          recursive: true,
        });
        installBeaconFixture(root);
        runGit(root, ["init", "-q", "-b", "wo-999"], fixtureGitOptions);
        write(root, ".gitignore", "/target/\n");
        runGit(
          root,
          ["config", "user.email", "fixture@example.invalid"],
          fixtureGitOptions,
        );
        runGit(root, ["config", "user.name", "Fixture"], fixtureGitOptions);

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
            { encoding: "utf8", cwd: root, env: fixtureEnvironment },
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
        const configured = JSON.parse(
          readFileSync(join(root, CONFIG_FILENAME), "utf8"),
        );
        configured.repositories.target.gate = {
          commands: { test: { argv: ["node", "test.mjs"], timeoutMs: 1000 } },
          plain: ["test"],
          review: ["test"],
        };
        write(root, CONFIG_FILENAME, prettyJson(configured));
        write(
          root,
          `${roots.control}/local/target-worktrees.json`,
          prettyJson({
            [target]: {
              workOrderId: "WO-999",
              repositoryId: "target",
              baseCommit,
              branch: "wo-999",
              target,
              launchpad: root,
            },
          }),
        );
        recordGateChecks(root, [
          {
            checkId: "target:target",
            repositoryId: "target",
            commit: baseCommit,
            treeHash: gateTreeHash(target),
            selection: "review",
            names: ["test"],
            commandsHash: gateCommandsHash(
              configured.repositories.target.gate,
              ["test"],
            ),
            durationMs: 1,
            executed: true,
            exitCode: 0,
            evidenceRef: "fixture:target-gate",
            recordedAt: new Date().toISOString(),
          },
        ]);
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
        // kit carries this loader (WO-069-D005; deferred by WO-070-D009 to
        // FUP-a058e82c0bbd9b6d).
        const outside = documents(root).filter(
          (path) =>
            !path.startsWith("records/") &&
            path !== CONFIG_FILENAME &&
            path !== ".gitignore" &&
            !path.startsWith("target/") &&
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
          spawnGit(["init", "--bare", "-b", "main", origin]).status,
          0,
        );
        assert.equal(spawnGit(["clone", "-q", origin, main]).status, 0);
        runGit(
          main,
          ["config", "user.email", "fixture@example.invalid"],
          fixtureGitOptions,
        );
        runGit(main, ["config", "user.name", "Fixture"], fixtureGitOptions);
        runGit(main, ["switch", "-q", "-c", "main"], fixtureGitOptions);

        mkdirSync(join(main, "scripts"), { recursive: true });
        copyFixtureFiles(
          join(scriptRoot, ".."),
          main,
          "scripts/test-configuration-root.fixture-inputs.json",
          "configured control plane",
        );
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
        runGit(main, ["add", "."], fixtureGitOptions);
        runGit(main, ["commit", "-q", "-m", "fixture"], fixtureGitOptions);
        runGit(main, ["push", "-q", "-u", "origin", "main"], fixtureGitOptions);

        const worktree = (cwd, ...args) => {
          const result = spawnSync(
            process.execPath,
            [join(main, "scripts/worktree.mjs"), ...args],
            { encoding: "utf8", cwd, env: fixtureEnvironment },
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
            { encoding: "utf8", cwd: subject, env: fixtureEnvironment },
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
        runGit(subject, ["add", "."], fixtureGitOptions);
        runGit(
          subject,
          ["commit", "-q", "-m", "WO-999 closed"],
          fixtureGitOptions,
        );
        runGit(
          main,
          ["merge", "-q", "--no-ff", "-m", "merge WO-999", "wo-999"],
          fixtureGitOptions,
        );
        runGit(main, ["push", "-q", "origin", "main"], fixtureGitOptions);

        const finished = worktree(main, "finish", "WO-999");
        assert.equal(
          finished.status,
          0,
          `worktree finish: ${finished.stderr || finished.stdout}`,
        );
        assert.equal(existsSync(subject), false, "the worktree was removed");
        assert.equal(
          runGit(main, ["branch", "--list", "wo-999"], fixtureGitOptions),
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

test("registration hosts and target release names refuse invalid instance data at load", () => {
  temporary("registration-fields", (root) => {
    const body = {
      version: 1,
      classes: { "fixture-class": { checks: [], supports: [] } },
      repositories: { target: registeredRepository() },
    };
    for (const host of [
      "localhost",
      "https://example.com",
      "127.0.0.1",
      "-bad.example",
      "a..example",
      "é.example",
      "a." + "x".repeat(64),
    ]) {
      body.repositories.target.linkHosts = [host];
      declared({ root, body });
      assert.throws(
        () => loadConfig(root),
        /repositories.target.linkHosts\[0\].*DNS host/,
      );
    }
    body.repositories.target.linkHosts = ["EXAMPLE.COM", "review.example"];
    body.repositories.target.release = {
      policy: "declared",
      displayName: "A".repeat(64),
    };
    declared({ root, body });
    assert.equal(
      loadConfig(root).repositories.target.release.displayName.length,
      64,
    );
    for (const policy of ["delete", "judge-only"]) {
      body.repositories.target.baseDisposablePolicy = policy;
      declared({ root, body });
      assert.equal(
        loadConfig(root).repositories.target.baseDisposablePolicy,
        policy,
      );
    }
    for (const disposable of [[".GIT"], ["cache/.GiT/objects"]]) {
      body.repositories.target.disposable = disposable;
      declared({ root, body });
      assert.throws(() => loadConfig(root), /disposable/u);
    }
    delete body.repositories.target.disposable;
    for (const displayName of [
      "A".repeat(65),
      " Name",
      "Name\n",
      "Name v1.2.3",
      "`name`",
      "Name\u200b",
    ]) {
      body.repositories.target.release.displayName = displayName;
      declared({ root, body });
      assert.throws(
        () => loadConfig(root),
        /repositories.target.release.displayName.*at most 64/,
      );
    }
  });
});

test("instance contribution identity controls sign-off independently of Git identity", async () => {
  const { contributionSignoffRules } = await import("./lib/contributions.mjs");
  temporary("contribution-identity", (root) => {
    const git = (args) =>
      runGit(root, [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "commit.gpgsign=false",
        "-c",
        "user.name=Fixture Operator",
        "-c",
        "user.email=operator@example.invalid",
        ...args,
      ]);
    git(["init", "-q", "-b", "main"]);
    git(["commit", "--allow-empty", "-qm", "test: base"]);
    git(["update-ref", "refs/remotes/origin/main", git(["rev-parse", "HEAD"])]);
    git(["commit", "--allow-empty", "-qm", "test: instance operator"]);
    git(["config", "user.name", "Fixture Operator"]);
    git(["config", "user.email", "operator@example.invalid"]);
    assert.equal(contributionSignoffRules(root)[0].pass, false);
    write(
      root,
      CONFIG_FILENAME,
      prettyJson({
        version: 1,
        contributions: {
          operatorAuthor: "Fixture Operator <operator@example.invalid>",
        },
      }),
    );
    assert.equal(contributionSignoffRules(root)[0].pass, true);
  });
});

test("historical order configuration admits no history and rejects malformed history", () => {
  temporary("historical-orders", (root) => {
    for (const historicalWorkOrders of [undefined, [], ["WO-020", "WO-010"]]) {
      declared({ root, body: { version: 1, historicalWorkOrders } });
      assert.deepEqual(
        loadConfig(root).historicalWorkOrders,
        historicalWorkOrders?.slice().sort() ?? [],
      );
    }
    for (const historicalWorkOrders of [
      null,
      "WO-001",
      ["WO-1"],
      [1],
      ["WO-001", "WO-001"],
    ]) {
      declared({ root, body: { version: 1, historicalWorkOrders } });
      assert.throws(() => loadConfig(root), /historicalWorkOrders/);
    }
  });
});

test(
  "the public WO-111 seed emits a registration with a declared scratch class",
  { skip: isKitRoot(sourceRoot) },
  () => {
    temporary("legacy-seed", (root) => {
      runGit(root, ["init", "-q", "-b", "main"]);
      for (const name of [
        "packages/skeleton/fixtures/wo119-discovery/repository.json",
        "packages/skeleton/fixtures/wo100-portfolio.json",
      ]) {
        mkdirSync(dirname(join(root, name)), { recursive: true });
        cpSync(join(sourceRoot, name), join(root, name));
      }
      const source = readFileSync(
        join(sourceRoot, "docs/evidence/WO-111/seed.mjs"),
        "utf8",
      ).replace(
        'import { TOOL_ROOT, docRelative } from "../../../scripts/lib/config.mjs";',
        `import { docRelative } from ${JSON.stringify(pathToFileURL(join(scriptRoot, "lib/config.mjs")).href)}; const TOOL_ROOT = ${JSON.stringify(root)};`,
      );
      write(root, "seed.mjs", source);
      mkdirSync(join(root, "temporary"));
      const result = spawnSync(process.execPath, ["seed.mjs", "prepare"], {
        cwd: root,
        encoding: "utf8",
        env: { ...fixtureEnvironment, TMPDIR: join(root, "temporary") },
      });
      assert.equal(result.status, 0, result.stderr);
      const location = JSON.parse(
        readFileSync(
          join(root, "docs/control/local/wo111/location.json"),
          "utf8",
        ),
      );
      assert.equal(
        loadConfig(location.launchpad).repositories.scratch.repositoryClass,
        "scratch",
      );
      assert.deepEqual(loadConfig(location.launchpad).classes.scratch, {
        checks: [],
        supports: [],
      });
    });
  },
);
