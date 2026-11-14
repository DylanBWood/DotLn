import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
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
  readFileSync,
  readdirSync,
  realpathSync,
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
import { readFeatures } from "./lib/features.mjs";

import { isKitRoot } from "../packages/skeleton/src/runtime-inputs.mjs";
import "./test-features.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(scriptRoot, "..");
// These disposable lifecycle fixtures are not live host sessions.
const fixtureEnvironment = {
  ...process.env,
  CODEX_THREAD_ID: "",
  COPILOT_AGENT_SESSION_ID: "",
};

const temporary = (prefix, run) => {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), `dotln-${prefix}-`)),
  );
  try {
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

test("evidence registration validates declarations at a root outside docs", async () => {
  const { registrationFindings } = await import("./check-registrations.mjs");
  temporary("evidence-registration", (root) => {
    runGit(root, ["init", "-q", "-b", "main"], fixtureGitOptions);
    excludeFixtureOwnership(root);
    declared({
      root,
      body: { version: 1, roots: { evidence: "records/evidence" } },
    });
    const path = "records/evidence/WO-999/observations.jsonl";
    write(root, path, JSON.stringify({ index: 1 }) + "\n");
    assert.match(
      registrationFindings(root).findings.join("\n"),
      /unregistered JSONL/,
    );
    write(
      root,
      "records/evidence/WO-999/jsonl.json",
      JSON.stringify({
        schemaVersion: 1,
        nonEventPaths: {
          "observations.jsonl": "Fixture observations, not event envelopes.",
        },
      }),
    );
    assert.deepEqual(registrationFindings(root).findings, []);
  });
});

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
    copyFixtureFiles(
      join(scriptRoot, ".."),
      root,
      "scripts/test-control-copy-sites.fixture-inputs.json",
      "configured publication check",
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

test("desktop-control feature elections validate without granting a default", () => {
  temporary("config-features", (root) => {
    assert.deepEqual(loadConfig(root).features, {});
    assert.equal(readFeatures(root)["desktop-control"], false);
    declared({ root, body: { version: 1 } });
    assert.equal(readFeatures(root)["desktop-control"], false);
    for (const value of [
      true,
      false,
      { on: true, note: "Requested browser work" },
      { on: false },
      { on: false, note: "" },
    ]) {
      declared({
        root,
        body: { version: 1, features: { "desktop-control": value } },
      });
      assert.deepEqual(loadConfig(root).features["desktop-control"], value);
      assert.equal(
        readFeatures(root)["desktop-control"],
        value === true || value.on === true,
      );
    }
    for (const [features, message] of [
      [null, /features must be an object/],
      [[], /features must be an object/],
      [{ "desktop-controls": true }, /unknown features key "desktop-controls"/],
      [
        { "desktop-control": "true" },
        /features.desktop-control must be an object/,
      ],
      [
        { "desktop-control": null },
        /features.desktop-control must be an object/,
      ],
      [
        { "desktop-control": { note: "No election" } },
        /features.desktop-control.on must be a boolean/,
      ],
      [
        { "desktop-control": { on: "true" } },
        /features.desktop-control.on must be a boolean/,
      ],
      [
        { "desktop-control": { on: true, note: 1 } },
        /features.desktop-control.note must be a string/,
      ],
      [
        { "desktop-control": { on: true, extra: true } },
        /unknown features.desktop-control key "extra"/,
      ],
    ]) {
      declared({ root, body: { version: 1, features } });
      assert.throws(() => loadConfig(root), message);
    }
  });
});

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
          records: "target",
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
          copyFixtureFiles(
            join(scriptRoot, ".."),
            launchpad,
            "scripts/test-control-copy-sites.fixture-inputs.json",
            "configured profile activation",
          );
          cpSync(join(scriptRoot, "lib"), join(launchpad, "scripts/lib"), {
            recursive: true,
          });
          installBeaconFixture(launchpad);
          runGit(launchpad, ["init", "-q", "-b", "wo-999"], fixtureGitOptions);
          excludeFixtureOwnership(launchpad);
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
      // A declaration whose last segment is wholly a wildcard would name
      // every ignored file below it; the floor refuses it at registration,
      // and `**` is admitted only as a whole segment. So does one whose
      // literal part is only punctuation: `*` matches a leading dot, so
      // `*.*` would name `.env`, an operator note and `.runtime` itself.
      for (const entry of [
        "*",
        "**",
        "**/*",
        "libs/**",
        "libs/*/**",
        "*.*",
        "**/*.*",
        ".*",
        "*-*",
        "libs/*_*",
      ])
        refuses(
          {
            version: 1,
            repositories: {
              target: registeredRepository({ disposable: [entry] }),
            },
          },
          new RegExp(
            `repositories\\.target\\.disposable entries must end in a segment whose literal part holds a letter or digit, the floor that keeps a declaration from naming every ignored file: ${escape(entry)}$`,
          ),
        );
      for (const entry of ["libs/**dist", "**.tsbuildinfo"])
        refuses(
          {
            version: 1,
            classes: {
              "fixture-class": {
                checks: [],
                supports: [],
                disposable: [entry],
              },
            },
          },
          new RegExp(
            `classes\\.fixture-class\\.disposable entries use \\*\\* only as a whole segment matching any number of segments: ${escape(entry)}$`,
          ),
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
              disposable: [
                "node_modules/",
                "dist",
                ".angular",
                "**/node_modules/",
                "**/*.tsbuildinfo",
                "libs/*/dist",
              ],
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
        "**/*.tsbuildinfo",
        "**/node_modules",
        ".angular",
        "dist",
        "libs/*/dist",
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
      // The sandbox election a routed run gets (WO-247): host or off, default
      // host, nothing else, and no other drive key.
      refuses(
        { version: 1, drive: { sandbox: "danger-full-access" } },
        /drive\.sandbox must be "host" or "off"; found "danger-full-access"/,
      );
      refuses(
        { version: 1, drive: { sandbox: true } },
        /drive\.sandbox must be/,
      );
      refuses({ version: 1, drive: { other: "x" } }, /unknown drive key/);
      refuses({ version: 1, drive: [] }, /drive must be an object/);
      for (const [declared, expected] of [
        [{}, "host"],
        [{ drive: {} }, "host"],
        [{ drive: { sandbox: "host" } }, "host"],
        [{ drive: { sandbox: "off" } }, "off"],
      ]) {
        writeFileSync(
          join(root, CONFIG_FILENAME),
          `${JSON.stringify({ version: 1, classes: { "fixture-class": { checks: [], supports: [] } }, ...declared })}\n`,
        );
        assert.deepEqual(loadConfig(root).drive, { sandbox: expected });
      }
      // The workers section and the models file (WO-276 criterion J3). The
      // configuration names workers, each a name bound, for a provider, to
      // a model; the models file beside it holds the instance's own models
      // and prices. An unknown key, a model that is not listed, a name that
      // would mean two things, an effort a provider does not take and a
      // negative price are each refused naming the file and the key.
      const modelsPath = join(root, "dotln.models.json");
      const modelsRefuse = (declared, expected, body = { version: 1 }) => {
        writeFileSync(
          path,
          `${JSON.stringify({ classes: { "fixture-class": { checks: [], supports: [] } }, ...body })}\n`,
        );
        writeFileSync(
          modelsPath,
          typeof declared === "string"
            ? declared
            : `${JSON.stringify(declared)}\n`,
        );
        try {
          assert.throws(() => loadConfig(root), expected);
        } finally {
          rmSync(modelsPath, { force: true });
        }
      };
      refuses({ version: 1, workers: [] }, /workers must be an object/);
      refuses(
        { version: 1, workers: { night: "fable" } },
        /dotln\.config\.json#workers\.night must be an object/,
      );
      for (const name of ["Night Shift", "and", "9lives", "x".repeat(41)])
        refuses(
          { version: 1, workers: { [name]: { claude: "fable" } } },
          /dotln\.config\.json#workers\..* is no name a launch can take/,
        );
      refuses(
        { version: 1, workers: { night: { description: "Runs late." } } },
        /dotln\.config\.json#workers\.night binds no provider to a model/,
      );
      refuses(
        {
          version: 1,
          workers: { night: { claude: { model: "fable", temperature: 1 } } },
        },
        /unknown key dotln\.config\.json#workers\.night\.claude\.temperature; known keys: model, effort/,
      );
      refuses(
        { version: 1, workers: { night: { claude: "haiku" } } },
        /dotln\.config\.json#workers\.night\.claude names the model "haiku", which is not in the model list \(opus, fable, sol, astra, sonnet, luna\)/,
      );
      refuses(
        { version: 1, workers: { night: { claude: "sol" } } },
        /dotln\.config\.json#workers\.night\.claude names the model "sol", which is a codex model, not a claude one/,
      );
      refuses(
        { version: 1, workers: { fable: { claude: "opus" } } },
        /the worker "fable" \(dotln\.config\.json#workers\.fable\) has the name of a model \(the kit's model list\); a name means one thing/,
      );
      refuses(
        {
          version: 1,
          workers: { night: { claude: { model: "fable", effort: "extreme" } } },
        },
        /dotln\.config\.json#workers\.night\.claude\.effort must be one of "low", "medium", "high", "xhigh", "max", the efforts a claude launch takes; found "extreme"/,
      );
      // The models file: closed keys, a version, whole rows, and each
      // refusal names the file, which is not the configuration.
      const row = { provider: "claude", id: "model-a", effort: "high" };
      for (const [declared, expected] of [
        ["{", /dotln\.models\.json: the file must be JSON/],
        [[], /dotln\.models\.json: the file must be an object/],
        [
          { schemaVersion: 1, workers: {} },
          /dotln\.models\.json: unknown the file's key "workers"/,
        ],
        [
          { models: {} },
          /dotln\.models\.json: schemaVersion must be 1; found null/,
        ],
        [
          { schemaVersion: 1, models: [] },
          /dotln\.models\.json#models must be an object/,
        ],
        [
          { schemaVersion: 1, models: { haiku: { ...row, temperature: 1 } } },
          /unknown key dotln\.models\.json#models\.haiku\.temperature; known keys: provider, id, effort, description, family/,
        ],
        [
          { schemaVersion: 1, models: { haiku: { ...row, id: "Model A" } } },
          /dotln\.models\.json#models\.haiku\.id must be a model id of at most 100 lower-case letters, digits, dots and hyphens that begins with a letter; found "Model A"/,
        ],
        [
          { schemaVersion: 1, models: { haiku: { ...row, id: "inherit" } } },
          /dotln\.models\.json#models\.haiku\.id is a word a worker definition reads as something else; found "inherit"/,
        ],
        [
          {
            schemaVersion: 1,
            models: { haiku: { ...row, effort: "extreme" } },
          },
          /dotln\.models\.json#models\.haiku\.effort must be one of "low", "medium", "high", "xhigh", "max", the efforts a claude launch takes; found "extreme"/,
        ],
        [
          {
            schemaVersion: 1,
            models: { haiku: { id: "model-a", effort: "high" } },
          },
          /dotln\.models\.json#models\.haiku\.provider must name a provider/,
        ],
        // A family is the Claude launcher's own key; a Codex row has none.
        [
          {
            schemaVersion: 1,
            models: {
              mini: { provider: "codex", id: "m", effort: "low", family: "x" },
            },
          },
          /unknown key dotln\.models\.json#models\.mini\.family; known keys: provider, id, effort, description$/,
        ],
        // One name, one meaning; one id, one model of a provider.
        [
          { schemaVersion: 1, models: { default: row } },
          /dotln\.models\.json: the model "default" \(dotln\.models\.json#models\.default\) has the name of a worker the kit ships; a name means one thing/,
        ],
        [
          { schemaVersion: 1, models: { haiku: { ...row, id: "fable" } } },
          /dotln\.models\.json: dotln\.models\.json#models\.haiku\.id is "fable", which is also the name of a model \(the kit's\); an id and a name must differ/,
        ],
        [
          {
            schemaVersion: 1,
            models: { haiku: { ...row, id: "claude-opus-5-5" } },
          },
          /dotln\.models\.json: dotln\.models\.json#models\.haiku\.id gives "haiku" the id claude-opus-5-5, which is the claude model "opus" already; a second effort of a model is a worker, not a model/,
        ],
        // The kit's own row replaced by another provider's: the row is
        // the entry at fault, in the file it stands in.
        [
          {
            schemaVersion: 1,
            models: { opus: { provider: "codex", id: "m-1", effort: "max" } },
          },
          /dotln\.models\.json: dotln\.models\.json#models\.opus\.provider makes "opus" a codex model, and the kit's worker "default" runs it on claude/,
        ],
        // A provider the kit has no launcher for is the instance's to
        // list, with an id of the common form and an effort of one word.
        [
          {
            schemaVersion: 1,
            models: {
              gem: { provider: "gemini", id: "Gem 3!", effort: "high" },
            },
          },
          /dotln\.models\.json#models\.gem\.id must be a model id of at most 100 lower-case letters/,
        ],
        [
          {
            schemaVersion: 1,
            models: {
              gem: { provider: "gemini", id: "gem-3", effort: "any level" },
            },
          },
          /dotln\.models\.json#models\.gem\.effort must be an effort, one lower-case word; found "any level"/,
        ],
      ])
        modelsRefuse(declared, expected);
      // A model whose id is the name of a worker the instance wrote, and a
      // worker the instance named for a model of its own: each refusal
      // names the entry at fault.
      modelsRefuse(
        { schemaVersion: 1, models: { haiku: { ...row, id: "night" } } },
        /dotln\.models\.json#models\.haiku\.id is "night", which is also the name of a worker \(dotln\.config\.json#workers\.night\)/,
        { version: 1, workers: { night: { claude: "fable" } } },
      );
      modelsRefuse(
        { schemaVersion: 1, models: { haiku: row } },
        /dotln\.config\.json: the worker "haiku" \(dotln\.config\.json#workers\.haiku\) has the name of a model \(dotln\.models\.json#models\.haiku\)/,
        { version: 1, workers: { haiku: { claude: "fable" } } },
      );
      const priced = {
        uncachedInput: 3,
        cacheRead: 0.3,
        cacheWrite: 3.75,
        output: 15,
      };
      for (const [prices, expected] of [
        [
          { "model-a": { ...priced, output: -1 } },
          /dotln\.models\.json#prices\["model-a"\]\.output must be a number that is not negative, in US dollars for a million tokens; found -1/,
        ],
        [
          { constructor: priced },
          /dotln\.models\.json#prices names a model by its id; found "constructor"/,
        ],
        [
          { "model-a": { uncachedInput: 3, output: 15 } },
          /dotln\.models\.json#prices\["model-a"\]\.cacheRead must be a number/,
        ],
        [
          { "model-a": { ...priced, reasoning: 1 } },
          /unknown key dotln\.models\.json#prices\["model-a"\]\.reasoning/,
        ],
      ])
        modelsRefuse({ schemaVersion: 1, prices }, expected);
      modelsRefuse(
        `{"schemaVersion":1,"prices":{"__proto__":${JSON.stringify(priced)}}}\n`,
        /dotln\.models\.json#prices names a model by its id; found "__proto__"/,
      );
      // The configuration holds no model and no price: those keys are the
      // models file's, and a section that states them is read as naming
      // workers of those names.
      refuses(
        { version: 1, workers: { prices: { "model-a": priced } } },
        /unknown key dotln\.config\.json#workers\.prices\.model-a\.uncachedInput; known keys: model, effort/,
      );
      // What loads: nothing stated is three empty parts, with or without
      // the section and the file; what is stated is returned as judged.
      // An entry of a kit worker's name may restate its description alone,
      // and a listed model of a provider with no launcher loads.
      writeFileSync(
        path,
        `${JSON.stringify({ version: 1, classes: { "fixture-class": { checks: [], supports: [] } }, workers: { default: { description: "Ours." } } })}\n`,
      );
      writeFileSync(
        modelsPath,
        `${JSON.stringify({ schemaVersion: 1, models: { gem: { provider: "gemini", id: "gem-3", effort: "high" } } })}\n`,
      );
      assert.deepEqual(loadConfig(root).workers.named, {
        default: { description: "Ours.", bindings: {} },
      });
      assert.equal(loadConfig(root).workers.models.gem.provider, "gemini");
      rmSync(modelsPath, { force: true });
      const empty = { named: {}, models: {}, prices: {} };
      const night = {
        description: "Reviews that run overnight.",
        claude: "fable",
        codex: { model: "astra", effort: "high" },
      };
      for (const [declared, file, expected] of [
        [{}, null, empty],
        [{ workers: {} }, null, empty],
        [{}, { schemaVersion: 1 }, empty],
        [
          { workers: { night, default: { claude: "haiku" } } },
          {
            schemaVersion: 1,
            models: {
              haiku: { ...row, family: "haiku", description: "Small." },
            },
            prices: { "model-a": priced },
          },
          {
            named: {
              night: {
                description: "Reviews that run overnight.",
                bindings: {
                  claude: { model: "fable", effort: null },
                  codex: { model: "astra", effort: "high" },
                },
              },
              default: {
                description: null,
                bindings: { claude: { model: "haiku", effort: null } },
              },
            },
            models: {
              haiku: { ...row, family: "haiku", description: "Small." },
            },
            prices: { "model-a": priced },
          },
        ],
      ]) {
        writeFileSync(
          join(root, CONFIG_FILENAME),
          `${JSON.stringify({ version: 1, classes: { "fixture-class": { checks: [], supports: [] } }, ...declared })}\n`,
        );
        if (file) writeFileSync(modelsPath, `${JSON.stringify(file)}\n`);
        else rmSync(modelsPath, { force: true });
        assert.deepEqual(loadConfig(root).workers, expected);
      }
      // A change to the models file alone is a change to the answer.
      writeFileSync(
        modelsPath,
        `${JSON.stringify({ schemaVersion: 1, models: { haiku: { ...row, id: "model-b" } } })}\n`,
      );
      assert.equal(loadConfig(root).workers.models.haiku.id, "model-b");
      rmSync(modelsPath, { force: true });
      // The extensions section (WO-276 criterion K4): an object, returned
      // as written and otherwise unread; anything else is refused by the
      // section's name.
      for (const notAnObject of [[], "tools", 3, null, true])
        refuses(
          { version: 1, extensions: notAnObject },
          /extensions must be an object/,
        );
      const own = {
        report: { since: "2026-01-01", lanes: ["a", "b"] },
        "any key": [1, { nested: null }],
      };
      for (const [declared, expected] of [
        [{}, {}],
        [{ extensions: {} }, {}],
        [{ extensions: own }, own],
      ]) {
        writeFileSync(
          join(root, CONFIG_FILENAME),
          `${JSON.stringify({ version: 1, classes: { "fixture-class": { checks: [], supports: [] } }, ...declared })}\n`,
        );
        assert.deepEqual(loadConfig(root).extensions, expected);
      }
      // No document root lies under the reserved root, whose every file is
      // the instance's: the kit writes its records under its roots, and a
      // file system that ignores case holds the other spellings as that
      // one directory.
      for (const [key, value] of [
        ["docs", "extensions/docs"],
        ["docs", "extensions"],
        ["control", "Extensions/control"],
        ["evidence", "EXTENSIONS/evidence"],
        ["control", "exten\u017fions/control"],
      ])
        refuses(
          { version: 1, roots: { [key]: value } },
          new RegExp(
            `roots\\.${key} must lie outside extensions/, the instance's own root, where the kit writes nothing: ${value}`,
            "u",
          ),
        );
      writeFileSync(
        join(root, CONFIG_FILENAME),
        `${JSON.stringify({ version: 1, classes: { "fixture-class": { checks: [], supports: [] } }, roots: { evidence: "extensions-of-mine/evidence" } })}\n`,
      );
      assert.equal(
        loadConfig(root).roots.evidence,
        "extensions-of-mine/evidence",
      );
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
        createFixtureRoot(join(tmpdir(), "dotln-config-planning-")),
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
        excludeFixtureOwnership(root);
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
          [
            "-C",
            root,
            "-c",
            "maintenance.auto=false",
            "commit",
            "-q",
            "-m",
            "configured planning fixture",
          ],
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
        createFixtureRoot(join(tmpdir(), "dotln-config-writing-worker-")),
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
        excludeFixtureOwnership(target);
        runGit(
          target,
          [
            "-c",
            "user.email=fixture@example.invalid",
            "-c",
            "user.name=Fixture",
            "-c",
            "maintenance.auto=false",
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
        copyFixtureFiles(
          join(scriptRoot, ".."),
          root,
          "scripts/test-control-copy-sites.fixture-inputs.json",
          "configured target effects",
        );
        cpSync(join(scriptRoot, "lib"), join(root, "scripts/lib"), {
          recursive: true,
        });
        installBeaconFixture(root);
        runGit(root, ["init", "-q", "-b", "wo-999"], fixtureGitOptions);
        excludeFixtureOwnership(root);
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
        // FUP-a058e82c0bbd9b6d), and the Git-ignored runtime lane, where every
        // temporary root's owner record and its Spotlight marker live (WO-233).
        const outside = documents(root).filter(
          (path) =>
            !path.startsWith("records/") &&
            path !== CONFIG_FILENAME &&
            path !== ".dotln-owner.json" &&
            path !== ".gitignore" &&
            !path.startsWith("target/") &&
            !path.startsWith(".control-beacons/") &&
            !path.startsWith(".runtime/") &&
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
        assert.equal(
          spawnGit([
            "-c",
            "maintenance.auto=false",
            "clone",
            "-q",
            origin,
            main,
          ]).status,
          0,
        );
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
        write(main, ".gitignore", `${roots.control}/local/\n.runtime/\n`);
        runGit(main, ["add", "."], fixtureGitOptions);
        runGit(
          main,
          ["-c", "maintenance.auto=false", "commit", "-q", "-m", "fixture"],
          fixtureGitOptions,
        );
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
          [
            "-c",
            "maintenance.auto=false",
            "commit",
            "-q",
            "-m",
            "WO-999 closed",
          ],
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
      "*",
      "example.com:443",
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
    body.repositories.target.linkHosts = ["example.com", "example.com", "*"];
    declared({ root, body });
    assert.throws(
      () => loadConfig(root),
      /repositories.target.linkHosts\[2\].*DNS host/,
    );
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
    excludeFixtureOwnership(root);
    git([
      "-c",
      "maintenance.auto=false",
      "commit",
      "--allow-empty",
      "-qm",
      "test: base",
    ]);
    git(["update-ref", "refs/remotes/origin/main", git(["rev-parse", "HEAD"])]);
    git([
      "-c",
      "maintenance.auto=false",
      "commit",
      "--allow-empty",
      "-qm",
      "test: instance operator",
    ]);
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
      excludeFixtureOwnership(root);
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
      )
        .replace(
          'import { TOOL_ROOT, docRelative } from "../../../scripts/lib/config.mjs";',
          `import { docRelative } from ${JSON.stringify(pathToFileURL(join(scriptRoot, "lib/config.mjs")).href)}; const TOOL_ROOT = ${JSON.stringify(root)};`,
        )
        .replace(
          '"../../../scripts/lib/temporary-roots.mjs"',
          JSON.stringify(
            pathToFileURL(join(scriptRoot, "lib/temporary-roots.mjs")).href,
          ),
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

test("WO-275: a work order's metadata is read from its top-level paragraphs, so a quoted or listed example neither declares a field nor ends the header", async () => {
  const { parseRepositoryDeclaration } =
    await import("./lib/work-order-repository.mjs");
  const { parseWorkstreamDeclaration } =
    await import("./lib/work-order-workstream.mjs");
  const commit = "a".repeat(40);
  const head = "# WO-999 — metadata fixture\n\n**Model:** any.\n";
  const order = (lines) => `${head}${lines}\n\n**Objective:** fixture.\n`;
  // An example inside a quotation or a list item is not a declaration.
  for (const example of [
    `\n> **Repository:** target @ ${commit}`,
    `\n- **Repository:** target @ ${commit}`,
  ])
    assert.equal(parseRepositoryDeclaration(order(example), "p"), undefined);
  assert.equal(
    parseWorkstreamDeclaration(order("\n> **Workstream:** WS-001"), "p"),
    undefined,
  );
  // A quoted Objective does not end the header before a real declaration.
  assert.deepEqual(
    parseRepositoryDeclaration(
      order(`\n> **Objective:** early\n\n**Repository:** target @ ${commit}`),
      "p",
    ),
    { id: "target", baseCommit: commit },
  );
  // Nor does an Objective line that lazily continues a quotation or a list
  // item, with no marker of its own.
  for (const container of ["> an example", "- an example"])
    assert.deepEqual(
      parseRepositoryDeclaration(
        `${head}\n${container}\n**Objective:** quoted\n\n**Repository:** target @ ${commit}\n\n**Objective:** real.\n`,
        "p",
      ),
      { id: "target", baseCommit: commit },
      container,
    );
  // The column-one declaration is read as before.
  assert.deepEqual(
    parseRepositoryDeclaration(
      order(`**Repository:** target @ ${commit}`),
      "p",
    ),
    { id: "target", baseCommit: commit },
  );
  assert.equal(
    parseWorkstreamDeclaration(order("**Workstream:** WS-001"), "p"),
    "WS-001",
  );
  // Several fields read from one order parse it once, and a field after the
  // Objective or inside the body is no header field (WO-276 criterion B4).
  const { markdownParseCount } = await import("./lib/markdown-links.mjs");
  const { readWorkOrder, readWorkOrderHeader, headerField } =
    await import("./lib/work-order-document.mjs");
  const several = order(
    `**Repository:** target @ ${commit}\n**Workstream:** WS-002\n**Depends on:** WO-001`,
  ).concat(
    `\n## Design\n\n**Workstream:** WS-009\n\n\`\`\`text\n**Repository:** other @ ${commit}\n\`\`\`\n`,
  );
  const before = markdownParseCount();
  assert.deepEqual(parseRepositoryDeclaration(several, "p"), {
    id: "target",
    baseCommit: commit,
  });
  assert.equal(parseWorkstreamDeclaration(several, "p"), "WS-002");
  const header = readWorkOrderHeader(several);
  assert.match(
    headerField(header, "Depends on", "duplicate").lineValue,
    /WO-001/u,
  );
  assert.match(headerField(header, "Model", "duplicate").lineValue, /any/u);
  assert.equal(markdownParseCount(), before + 1, "one parse of the header");
  // The whole order is one more parse however many readers take it.
  readWorkOrder(several);
  readWorkOrder(several);
  assert.equal(markdownParseCount(), before + 2, "one parse of the document");
  // The header alone and the whole document give one header where a cut by
  // line could be read differently (WO-276, the attack on Part B): a comment
  // or another HTML block that holds a heading line or the Objective's, a
  // line under the Objective's paragraph that makes it a heading, and a
  // carriage return before each line's end.
  const repository = `**Repository:** target @ ${commit}`;
  for (const [name, written] of [
    [
      "a comment that holds a heading line",
      `# WO-1 Title\n\n<!--\n# a draft heading kept for later\n-->\n\n${repository}\n\n**Objective:** x\n`,
    ],
    [
      "an HTML block that holds a heading line",
      `# WO-1 Title\n\n<details>\n# inside the block\n</details>\n\n${repository}\n\n**Objective:** x\n`,
    ],
    [
      "a comment that holds the Objective's line",
      `# WO-1 Title\n\n<!--\n\n**Objective:** not this one\n-->\n\n${repository}\n\n**Objective:** x\n`,
    ],
    [
      "a line of hyphens under the Objective's paragraph",
      `# WO-1 Title\n\n${repository}\n**Objective:** x\n---\n\nBody.\n`,
    ],
    [
      "carriage returns",
      `# WO-1 Title\r\n\r\n${repository}\r\n**Objective:** x\r\n\r\nBody.\r\n`,
    ],
  ]) {
    const whole = readWorkOrder(written);
    assert.deepEqual(readWorkOrderHeader(written).header, whole.header, name);
    assert.deepEqual(
      parseRepositoryDeclaration(written, "p"),
      whole.header.some(({ label }) => label === "Repository")
        ? { id: "target", baseCommit: commit }
        : undefined,
      name,
    );
  }
  // The first three keep their Repository field; the hyphens make the whole
  // paragraph a heading, which holds no field.
  assert.deepEqual(
    parseRepositoryDeclaration(
      `# WO-1 Title\n\n<!--\n# a draft heading kept for later\n-->\n\n${repository}\n\n**Objective:** x\n`,
      "p",
    ),
    { id: "target", baseCommit: commit },
  );
});

test("WO-276 criterion B4: the header read from an order's lead is the header the whole document gives, whatever the line that looks like the header's end stands in; an ordinary order's body is still not parsed for it", async () => {
  const { markdownParseCount } = await import("./lib/markdown-links.mjs");
  const { readWorkOrder, readWorkOrderHeader } =
    await import("./lib/work-order-document.mjs");
  const title = "# WO-999 — Fixture\n\n";
  // What follows a lead that did not end where it seemed to: the fields the
  // header really holds, then the Objective that ends it.
  const rest =
    "\n**Track:** machinery\n\n**Objective:** real\n\nBody text.\n\n## Design\n\nMore.\n";
  const fence = "```";
  // [name, document, whether the lead alone is enough to read the header]
  const cases = [
    [
      "an ordinary order",
      `${title}**Model:** capable\n**Track:** machinery\n\n**Objective:** real\n\nBody.\n`,
      true,
    ],
    // The parser's extensions read inline and display math and a Liquid tag
    // as one span across lines, and none is CommonMark: the shared parse
    // hands the parser no opener of one, a label that opens a line inside one
    // is a label, so the header ends there and the lead alone reads it.
    [
      "inline math",
      `${title}**Model:** a $x\n**Objective:** in\ny$${rest}`,
      true,
    ],
    [
      "a Liquid tag",
      `${title}**Model:** a {{ x\n**Objective:** in\ny }}${rest}`,
      true,
    ],
    [
      "a math block",
      `${title}**Model:** a\n\n$$\nx\n\n**Objective:** in\n$$\n${rest}`,
      true,
    ],
    // A line that opens with the Objective's label inside a construct that
    // began before it and ends after it.
    [
      "a code span that holds the label, in a paragraph of its own",
      `${title}\`Example\n**Objective:** quoted inside code\nend\`\n${rest}`,
      false,
    ],
    [
      "a code span opened in a field's value",
      `${title}**Model:** capable \`example\n**Objective:** quoted inside code\nend\`${rest}`,
      false,
    ],
    [
      "a span of two backticks",
      `${title}**Model:** a \`\`x \` y\n**Objective:** in\nz\`\`${rest}`,
      false,
    ],
    [
      "emphasis",
      `${title}**Model:** a *start\n**Objective:** in\nend*${rest}`,
      false,
    ],
    [
      "a link's text",
      `${title}**Model:** a [start\n**Objective:** in\nend](https://example.invalid)${rest}`,
      false,
    ],
    [
      "inline HTML",
      `${title}**Model:** a <span title="\n**Objective:** in\n">x</span>${rest}`,
      false,
    ],
    [
      "a comment inside a paragraph",
      `${title}**Model:** a <!-- c\n**Objective:** in\n-->${rest}`,
      false,
    ],
    [
      "a quotation's lazy line",
      `${title}**Model:** a\n\n> quoted\n**Objective:** lazy\n${rest}`,
      false,
    ],
    [
      "a list item's lazy line",
      `${title}**Model:** a\n\n- item\n**Objective:** lazy\n${rest}`,
      false,
    ],
    // A block left open across a blank line.
    [
      "a fence",
      `${title}**Model:** a\n\n${fence}text\nx\n\n**Objective:** in\n${fence}\n${rest}`,
      false,
    ],
    [
      "a fence of tildes",
      `${title}**Model:** a\n\n~~~\nx\n\n**Objective:** in\n~~~\n${rest}`,
      false,
    ],
    [
      "a comment block",
      `${title}**Model:** a\n\n<!--\nx\n\n**Objective:** in\n-->\n${rest}`,
      false,
    ],
    [
      "a script block",
      `${title}**Model:** a\n\n<script>\nx\n\n**Objective:** in\n</script>\n${rest}`,
      false,
    ],
    // What only the text below the lead decides.
    [
      "front matter that holds the label",
      `---\ntitle: x\n\n**Objective:** in\n---\n\n${title}**Model:** a${rest}`,
      false,
    ],
    [
      "TOML front matter that holds a heading line",
      `+++\ntitle = 1\n\n# not a heading\n+++\n\n${title}**Model:** a${rest}`,
      false,
    ],
    [
      "a reference link whose definition stands in the body",
      `${title}**Model:** a [start\n**Objective:** in\nend][ref]${rest}\n[ref]: https://example.invalid\n`,
      false,
    ],
    [
      "a shortcut reference whose definition stands in the body",
      `${title}**Model:** a [start\n**Objective:** in\nend]${rest}\n[start\n**Objective:** in\nend]: https://example.invalid\n`,
      false,
    ],
    [
      "a footnote whose definition stands in the body",
      `${title}**Model:** a[^n]\n**Track:** t\n\n**Objective:** real\n\nBody.\n\n[^n]: note\n`,
      false,
    ],
    // Ends of the header the line scan does not see, which the parser
    // finds in the lead.
    [
      "a line of hyphens under the Objective's paragraph",
      `${title}**Model:** a\n**Objective:** x\n---\n\nBody.\n`,
      true,
    ],
    [
      "a heading written by the line under it",
      `${title}**Model:** a\n\nA heading\n---------\n\n**Track:** t\n\n**Objective:** x\n\nBody.\n`,
      true,
    ],
    [
      "an indented heading",
      `${title}**Model:** a\n\n  ## Indented\n\n**Track:** t\n\n**Objective:** x\n\nBody.\n`,
      true,
    ],
    [
      "an empty heading",
      `${title}**Model:** a\n\n#\n\n**Track:** t\n\n**Objective:** x\n\nBody.\n`,
      true,
    ],
    [
      "an indented Objective",
      `${title}**Model:** a\n\n  **Objective:** x\n\n**Track:** t\n\n**Objective:** y\n\nBody.\n`,
      true,
    ],
    // Line ends and the lead's own blocks.
    [
      "an Objective that continues the last field's paragraph",
      `${title}**Model:** a\n**Objective:** x\nmore\n\nBody.\n`,
      true,
    ],
    [
      "carriage returns",
      `${title}**Model:** a\n**Objective:** x\n\nBody.\n`.replaceAll(
        "\n",
        "\r\n",
      ),
      true,
    ],
    [
      "carriage returns around a code span",
      `${title}**Model:** a \`e\n**Objective:** in\nz\`${rest}`.replaceAll(
        "\n",
        "\r\n",
      ),
      false,
    ],
    [
      "a line of a no-break space after the Objective",
      `${title}**Model:** a\n**Objective:** x\n \n**Track:** late\n\nBody.\n`,
      true,
    ],
    [
      "a definition inside the lead",
      `${title}**Model:** a [ref]\n\n[ref]: https://example.invalid\n\n**Objective:** x\n\nBody.\n`,
      true,
    ],
    [
      "a byte-order mark before a code span",
      `﻿${title}**Model:** a \`e\n**Objective:** in\nz\`${rest}`,
      false,
    ],
  ];
  const reading = (order) => ({
    title: order.title,
    leadStart: order.leadStart,
    headerEnd: order.headerEnd,
    header: order.header,
  });
  for (const [name, written, leadAlone] of cases) {
    const before = markdownParseCount();
    const header = readWorkOrderHeader(written);
    const parses = markdownParseCount() - before;
    const whole = readWorkOrder(written);
    assert.deepEqual(reading(header), reading(whole), name);
    // The lead alone is one parse of less than the document; a lead that
    // could not be trusted is never returned.
    assert.equal(
      header.lead.source.length < whole.source.length,
      leadAlone,
      name,
    );
    if (leadAlone) assert.equal(parses, 1, name);
  }
  // The two inputs the header lost a field on: Track is a header field of
  // each, by either reader.
  for (const name of [
    "a code span that holds the label, in a paragraph of its own",
    "a code span opened in a field's value",
  ])
    assert.ok(
      readWorkOrderHeader(
        cases.find(([named]) => named === name)[1],
      ).headerFields("Track").length === 1,
      name,
    );
});

test("WO-276 F3: a label that opens a line inside a span the parser's extensions read as one node still opens its field, so a dollar figure in each of two header fields loses neither field nor the label between them", async () => {
  const { parseHeader } = await import("./work-orders.mjs");
  const { readWorkOrder, readWorkOrderHeader } =
    await import("./lib/work-order-document.mjs");
  const { criterionJudgments } = await import("./lib/off-ramps.mjs");
  const path = "docs/work-orders/WO-999-fixture.md";
  const order = (fields) =>
    `# WO-999 — Fixture (v1.0.0)\n\n**Model:** any.\n**Effort:** executor any.\n${fields}\n\n**Objective:** The objective.\n`;
  // The failed review's shape: between the two dollar signs the parser reads
  // inline math across the line break, over the Release classification label.
  const twoFigures = order(
    "**Cost:** about $5 of tokens.\n**Release classification:** minor. A run costs $6 more.\n**Track:** machinery",
  );
  const header = parseHeader(twoFigures, path);
  assert.equal(header.cost, "about $5 of tokens.");
  assert.equal(header.track, "machinery");
  for (const read of [readWorkOrder, readWorkOrderHeader])
    assert.deepEqual(
      read(twoFigures)
        .headerFields("Release classification")
        .map((field) => [field.line, field.lineValue.trim()]),
      [[6, "minor. A run costs $6 more."]],
    );
  // Shapes the review did not try: the review ladder between two figures,
  // which sizes the ladder an order runs; a Liquid tag that runs across a
  // label; and a label inside a span written with no space before its value,
  // which the reader names to its caller as it does outside a span.
  const ladder = order(
    "**Cost:** $40 a day.\n**Review ladder:** combined\n**Track:** machinery, about $3 a run",
  );
  assert.deepEqual(parseHeader(ladder, path).reviewLadderLines, [
    { value: "combined", line: 6 },
  ]);
  const liquid = order(
    "**Cost:** one session {{ the figure\n**Track:** machinery }} of tokens.",
  );
  assert.equal(parseHeader(liquid, path).cost, "one session {{ the figure");
  assert.deepEqual(
    readWorkOrder(liquid)
      .headerFields("Track")
      .map((field) => field.line),
    [6],
  );
  const unspaced = order(
    "**Cost:** about $5 of tokens.\n**Track:**machinery, $6 a run.",
  );
  assert.deepEqual(
    readWorkOrder(unspaced)
      .headerFields("Track")
      .map((field) => field.lineValue),
    ["machinery, $6 a run."],
  );
  // A handoff's or a report's judgment lines are read through the same
  // fields: a criterion judged between two lines that each hold a figure is
  // still judged.
  assert.deepEqual(
    criterionJudgments(
      "**Criterion 5:** met. The run cost $12.\n**Criterion 6:** met. The case passed.\n**Criterion 7:** met. It saved $3 a day.\n",
    ).map((judgment) => judgment.criterionId),
    ["5", "6", "7"],
  );
  // A strikethrough the parser reads between two tildes holds the lines
  // inside it as its children: a label that opens one of them still opens
  // its field, in a header and on a judgment line.
  const tildes = order(
    "**Cost:** about ~2 hours of tokens.\n**Release classification:** minor.\n**Track:** machinery, 5~6 runs.",
  );
  assert.equal(parseHeader(tildes, path).cost, "about ~2 hours of tokens.");
  assert.equal(
    readWorkOrder(tildes).headerFields("Release classification").length,
    1,
  );
  assert.deepEqual(
    criterionJudgments(
      "**Criterion 5:** met. The case took ~40 s.\n**Criterion 6:** met. The case passed.\n**Criterion 7:** met, at 5~6 s a run.\n",
    ).map((judgment) => judgment.criterionId),
    ["5", "6", "7"],
  );
  // The shared parse hands the parser no opener of a span its extensions
  // read: a link and a code span between two dollar figures are read, as a
  // reader of the text read them, and an escaped dollar sign stays escaped.
  const {
    markdownLinks,
    markdownCodeSpans,
    parseMarkdown,
    parseMarkdownWithExtensions,
  } = await import("./lib/markdown-links.mjs");
  const costs =
    "A run costs about $5 in tokens, and the [cost guide](../product/07-execution-guide.md#costs) runs `node x.mjs $HOME`; a review adds about $2 more, {{ and }} [[a page]] stay text, and \\$3 is escaped.\n";
  assert.deepEqual(
    markdownLinks(costs).map(({ href }) => href),
    ["../product/07-execution-guide.md#costs"],
  );
  assert.deepEqual(
    markdownCodeSpans(costs).map(({ value }) => value),
    ["node x.mjs $HOME"],
  );
  const kindsOf = (tree) => {
    const kinds = new Set();
    const walk = (node) => {
      kinds.add(node.type);
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
    return kinds;
  };
  const kinds = kindsOf(parseMarkdown(costs));
  for (const kind of ["inlineMath", "math", "liquidNode", "wikiLink"])
    assert.equal(kinds.has(kind), false, kind);
  assert.match(
    parseMarkdown(costs).children[0].children.at(-1).value,
    /\[\[a page\]\] stay text, and \$3 is escaped\.$/u,
  );
  // A bracket means something to CommonMark, so a wiki link is taken apart
  // only where the extension would read one, and then by its inner brackets:
  // a link or an image whose text opens with a bracketed word, or is one, is
  // read as written, and a wiki link alone stays text.
  const bracketed = [
    [
      "See [[WO-123] the fix](missing.md) here.",
      "link",
      "missing.md",
      "[WO-123] the fix",
    ],
    [
      "See [[draft]](../product/07-execution-guide.md#gone) here.",
      "link",
      "../product/07-execution-guide.md#gone",
      "[draft]",
    ],
    [
      "An image ![[fig] overview](missing.png) here.",
      "image",
      "missing.png",
      "[fig] overview",
    ],
    ["An image ![[fig]](img.png) here.", "image", "img.png", "[fig]"],
  ];
  for (const [text, type, url, label] of bracketed) {
    const node = parseMarkdown(`${text}\n`).children[0].children[1];
    assert.equal(node.type, type, text);
    assert.equal(node.url, url, text);
    assert.equal(
      type === "image"
        ? node.alt
        : node.children.map((child) => child.value).join(""),
      label,
      text,
    );
  }
  assert.deepEqual(
    markdownLinks("A wiki link [[a page]], [[x] and [[ y ]] stay text.\n"),
    [],
  );
  // The characters the copy uses are ones the source does not hold, so a
  // source that holds a private-use character is read the same way.
  assert.deepEqual(
    markdownLinks(
      "Holds \uE000 and \uE001, then $5, the [guide](g.md#z) and $2.\n",
    ).map(({ href }) => href),
    ["g.md#z"],
  );
  // A numeric character reference to a private-use character, which the
  // parser decodes into the tree, holds that character as the character
  // itself does: the tree keeps it, and the dollar figure beside it is read
  // as written.
  for (const [reference, code] of [
    ["&#xE000;", 0xe000],
    ["&#57344;", 0xe000],
    ["&#xe003;", 0xe003],
  ]) {
    const paragraph = parseMarkdown(`Price $5 and glyph ${reference} here.\n`)
      .children[0];
    assert.equal(
      paragraph.children.map((child) => child.value).join(""),
      `Price $5 and glyph ${String.fromCharCode(code)} here.`,
      reference,
    );
  }
  // A check of where the parser's own reading and another renderer's differ
  // asks for that reading, the extensions' spans included; where no opener
  // stands, it is the shared tree itself.
  const spans =
    "Inline math $x$ here, a tag {{ name }} there, and [[a page]].\n\n$$\ny\n$$\n";
  const extended = kindsOf(parseMarkdownWithExtensions(spans));
  const shared = kindsOf(parseMarkdown(spans));
  for (const kind of ["inlineMath", "math", "liquidNode", "wikiLink"]) {
    assert.equal(extended.has(kind), true, kind);
    assert.equal(shared.has(kind), false, kind);
  }
  assert.equal(
    parseMarkdownWithExtensions("No dollar figure here.\n"),
    parseMarkdown("No dollar figure here.\n"),
  );
});

test("WO-276 criterion N1: a registration with records set to instance or target loads, any other value is refused naming the key, and one without the key behaves as target", async () => {
  const { recordsStayInInstance, planFirstDirectory } =
    await import("./lib/config.mjs");
  temporary("config-records", (root) => {
    const registered = (records) => {
      declared({
        root,
        body: {
          version: 1,
          repositories: {
            target: registeredRepository(
              records === undefined ? {} : { records },
            ),
          },
        },
      });
      return loadConfig(root).repositories.target;
    };
    for (const [declaredValue, read] of [
      ["instance", "instance"],
      ["target", "target"],
      [undefined, "target"],
    ])
      assert.equal(registered(declaredValue).records, read);
    for (const refusedValue of ["Instance", "launchpad", "", null, true, []])
      assert.throws(
        () => registered(refusedValue),
        /repositories\.target\.records must be "target" or "instance"/u,
        JSON.stringify(refusedValue),
      );
    // An order's records stay in the instance where the registration says
    // so and none was filed; a committed binding keeps them in the target.
    const instance = registered("instance");
    assert.equal(recordsStayInInstance(instance, {}), true);
    assert.equal(
      recordsStayInInstance(instance, { targetRecords: { commit: "0" } }),
      false,
    );
    assert.equal(recordsStayInInstance(registered("target"), {}), false);
    assert.equal(recordsStayInInstance(undefined, {}), false);
    // Criterion N5's rule: the plan-first directory follows the value.
    const target = { repositoryId: "target", target: join(root, "checkout") };
    registered("instance");
    assert.equal(
      planFirstDirectory(root, "WO-099", target),
      planFirstDirectory(root, "WO-099"),
    );
    registered(undefined);
    assert.equal(
      planFirstDirectory(root, "WO-099", target),
      join(root, "checkout", "docs/evidence/WO-099/plan-first"),
    );
  });
});

test("WO-276 criterion M3: with contributions.authors listing two identities a commit by either passes the sign-off rule without a trailer, a third author's fails without one and passes with one, and a malformed or repeated entry is refused when the configuration loads, naming its index", async () => {
  const { contributionSignoffRules } = await import("./lib/contributions.mjs");
  const one = "Planner One <one@example.invalid>";
  const two = "Teammate Two <two@example.invalid>";
  const three = "Visitor Three <three@example.invalid>";
  temporary("contribution-authors", (root) => {
    const git = (args, author = one) => {
      const [, name, email] = /^(.*) <(.*)>$/u.exec(author);
      return runGit(root, [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "commit.gpgsign=false",
        "-c",
        `user.name=${name}`,
        "-c",
        `user.email=${email}`,
        ...args,
      ]);
    };
    const commit = (message, author) =>
      git(
        [
          "-c",
          "maintenance.auto=false",
          "commit",
          "--allow-empty",
          "-qm",
          message,
        ],
        author,
      );
    git(["init", "-q", "-b", "main"]);
    excludeFixtureOwnership(root);
    commit("test: base", one);
    git(["update-ref", "refs/remotes/origin/main", git(["rev-parse", "HEAD"])]);
    write(
      root,
      CONFIG_FILENAME,
      prettyJson({ version: 1, contributions: { authors: [one, two] } }),
    );
    assert.deepEqual(loadConfig(root).contributions, { authors: [one, two] });
    commit("test: by the first listed author", one);
    commit("test: by the second listed author", two);
    commit("test: by an author outside the list", three);
    commit(
      `test: by that author, signed off\n\nSigned-off-by: ${three}\n`,
      three,
    );
    const rules = contributionSignoffRules(root);
    assert.deepEqual(
      rules.map((rule) => rule.pass),
      [true, true, false, true],
    );
    assert.match(
      rules[0].line,
      /observed listed author; expected listed author exemption \(no sign-off required\)/u,
    );
    assert.match(rules[1].line, /observed listed author/u);
    assert.match(
      rules[2].line,
      /observed outside author without matching sign-off; expected Signed-off-by trailer matching the commit author .*the declared contributions\.operatorAuthor and contributions\.authors already exempt their identities; other authors need the matching trailer/u,
    );
    assert.match(rules[3].line, /observed matching author sign-off/u);
    // The operator's identity beside the list is its own too, and an empty
    // list exempts nobody.
    write(
      root,
      CONFIG_FILENAME,
      prettyJson({
        version: 1,
        contributions: { operatorAuthor: three, authors: [one] },
      }),
    );
    assert.deepEqual(
      contributionSignoffRules(root).map((rule) => rule.pass),
      [true, false, true, true],
    );
    write(
      root,
      CONFIG_FILENAME,
      prettyJson({ version: 1, contributions: { authors: [] } }),
    );
    assert.deepEqual(loadConfig(root).contributions, { authors: [] });
    assert.deepEqual(
      contributionSignoffRules(root).map((rule) => rule.pass),
      [false, false, false, true],
    );
    // A malformed entry, a repeated one and a value that is no list are
    // refused when the configuration loads, the entry named by its index.
    for (const [authors, refusal] of [
      [
        [one, "no identity"],
        /contributions\.authors\[1\] must be a single author identity: Name <email>/u,
      ],
      [
        [one, two, 7],
        /contributions\.authors\[2\] must be a single author identity: Name <email>/u,
      ],
      [
        [one, two, one],
        /contributions\.authors\[2\] repeats an identity the list already holds/u,
      ],
      [
        one,
        /contributions\.authors must be a list of author identities, each Name <email>/u,
      ],
    ]) {
      write(
        root,
        CONFIG_FILENAME,
        prettyJson({ version: 1, contributions: { authors } }),
      );
      assert.throws(() => loadConfig(root), refusal, JSON.stringify(authors));
    }
  });
});
