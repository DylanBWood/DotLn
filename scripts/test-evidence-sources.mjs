// WO-157 item 12 (WO-151 D001): the recorded evidence inventories follow the
// import graph. A copy of this repository, with the working tree overlaid,
// shows a moved request protocol staling the feedback edition, an excluded
// import admitted with its reason, and an unregistered import refused by name.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT } from "./lib/config.mjs";
import { currentEvidence } from "../packages/skeleton/src/evidence-editions.mjs";

const paths = (...args) =>
  execFileSync("git", ["-C", TOOL_ROOT, ...args], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);

/** A shared clone carrying the working tree's bytes, the built packages and
 * the installed dependencies, so its edition scripts check what the gate
 * checks. Sources stay real files: the feedback audit refuses a symlink.
 * With `workspace`, @dotln resolves to the copy's own packages, so a build
 * in the copy is the compiler every replay loads (WO-154 VER-001). */
function editionCopy(t, { workspace = false } = {}) {
  const parent = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-evidence-sources-")),
  );
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const copy = join(parent, "repository");
  execFileSync("git", ["clone", "--quiet", "--shared", TOOL_ROOT, copy]);
  for (const path of [
    ...paths("diff", "-z", "--name-only", "HEAD"),
    ...paths("ls-files", "-z", "--others", "--exclude-standard"),
  ]) {
    const target = join(copy, path);
    if (existsSync(join(TOOL_ROOT, path))) {
      mkdirSync(dirname(target), { recursive: true });
      cpSync(join(TOOL_ROOT, path), target);
    } else rmSync(target, { force: true });
  }
  for (const name of ["kernel", "compiler", "skeleton", "console"])
    cpSync(
      join(TOOL_ROOT, "packages", name, "dist"),
      join(copy, "packages", name, "dist"),
      { recursive: true },
    );
  if (workspace) {
    mkdirSync(join(copy, "node_modules/@dotln"), { recursive: true });
    for (const name of readdirSync(join(TOOL_ROOT, "node_modules")))
      if (name !== "@dotln")
        symlinkSync(
          join(TOOL_ROOT, "node_modules", name),
          join(copy, "node_modules", name),
        );
    for (const name of readdirSync(join(TOOL_ROOT, "node_modules/@dotln")))
      symlinkSync(
        join(copy, "packages", name),
        join(copy, "node_modules/@dotln", name),
      );
  } else
    symlinkSync(join(TOOL_ROOT, "node_modules"), join(copy, "node_modules"));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !["DOTLN_LAUNCHPAD", "NODE_TEST_CONTEXT"].includes(key),
    ),
  );
  const run = (...args) =>
    spawnSync(process.execPath, ["scripts/feedback-evidence.mjs", ...args], {
      cwd: copy,
      encoding: "utf8",
      env,
    });
  const check = () => run("--check");
  const restore = (path) =>
    writeFileSync(join(copy, path), readFileSync(join(TOOL_ROOT, path)));
  return { copy, env, check, run, restore };
}

test("WO-157 a moved entropy review protocol stales the feedback edition; an excluded import does not", (t) => {
  const { copy, check, restore } = editionCopy(t);
  const base = check();
  assert.equal(
    base.status,
    0,
    `the feedback edition must be current before the fixture moves anything\n${base.stdout}${base.stderr}`,
  );
  const protocol = "packages/skeleton/src/entropy-review-protocol.ts";
  appendFileSync(
    join(copy, protocol),
    "\n// WO-157 item 12 fixture: a moved protocol\n",
  );
  const moved = check();
  assert.notEqual(
    moved.status,
    0,
    "an edition check passed over a changed entropy review protocol (WO-151 D001)",
  );
  assert.match(moved.stderr, /feedback evidence is stale/u);
  restore(protocol);

  // An import on the reasoned exclusion list (local-model-actor.ts) is admitted.
  const importer = "packages/skeleton/src/verification.ts";
  appendFileSync(join(copy, importer), '\nimport "./local-model-actor.js";\n');
  const admitted = check();
  assert.equal(admitted.status, 0, admitted.stdout + admitted.stderr);
  restore(importer);

  // Any other sibling a registered source imports must be registered.
  writeFileSync(
    join(copy, "packages/skeleton/src/wo157-unregistered.ts"),
    "export const probe = 1;\n",
  );
  appendFileSync(join(copy, importer), '\nimport "./wo157-unregistered.js";\n');
  const refused = check();
  assert.notEqual(refused.status, 0);
  assert.match(
    refused.stderr,
    /unregistered feedback evidence import: packages\/skeleton\/src\/verification\.ts imports packages\/skeleton\/src\/wo157-unregistered\.ts/u,
  );
  restore(importer);

  // VER-001 F4: the two legal forms the first parser missed are refused too.
  for (const form of [
    "\nvoid import('./wo157-unregistered.js').then(() => {});\n",
    "\nimport './wo157-unregistered.js'\n",
  ]) {
    appendFileSync(join(copy, importer), form);
    const bypass = check();
    assert.notEqual(bypass.status, 0, `admitted ${JSON.stringify(form)}`);
    assert.match(
      bypass.stderr,
      /unregistered feedback evidence import: packages\/skeleton\/src\/verification\.ts imports packages\/skeleton\/src\/wo157-unregistered\.ts/u,
    );
    restore(importer);
  }
});

test("WO-157 relative imports resolve compiled and type-only forms as the check reads them", async (t) => {
  const { relativeImports } = await import("./lib/evidence-sources.mjs");
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-imports-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  put("packages/p/src/a.ts", "export const a = 1;\n");
  put("packages/p/src/b.mjs", "export const b = 1;\n");
  put("packages/p/src/c.mjs", "export const c = 1;\n");
  put("packages/p/src/d.mjs", "export const d = 1;\n");
  put("packages/p/src/data.json", "{}\n");
  put("packages/p/src/types.ts", "export type T = 1;\n");
  put("packages/kernel/src/index.ts", "export const k = 1;\n");
  put(
    "packages/p/src/entry.ts",
    [
      'import { a } from "./a.js";',
      'import type { T } from "./types.js";',
      'export { b } from "./b.mjs";',
      'const later = await import("./a.js");',
      'const lazy = () => import("./c.mjs");',
      "if (true) {",
      '  import("./d.mjs");',
      "}",
      'import data from "./data.json" with { type: "json" };',
      'import { k } from "@dotln/kernel";',
      'import { readFileSync } from "node:fs";',
      '/** @param {import("./types.js").T} value */',
      'const asset = new URL("./fixture.json", import.meta.url);',
      "",
    ].join("\n"),
  );
  put("scripts/tool.mjs", 'import { a } from "../packages/p/dist/src/a.js";\n');
  assert.deepEqual(relativeImports(root, "packages/p/src/entry.ts"), [
    "packages/kernel/src/index.ts",
    "packages/p/src/a.ts",
    "packages/p/src/b.mjs",
    "packages/p/src/c.mjs",
    "packages/p/src/d.mjs",
    "packages/p/src/data.json",
  ]);
  assert.deepEqual(relativeImports(root, "scripts/tool.mjs"), [
    "packages/p/src/a.ts",
  ]);
});

test("WO-157 VER-001 F4: every legal runtime import form is read, and only type imports are skipped", async (t) => {
  const { relativeImports } = await import("./lib/evidence-sources.mjs");
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-imports-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, text) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  const runtime = [..."efghijklmqrsvwxyz", "aa", "u$"];
  for (const name of [...runtime, "n", "o", "o2", "o3", "re", "tt"])
    put(`packages/p/src/${name}.mjs`, "export const value = 1;\n");
  for (const name of ["types", "types2", "types3", "types4", "types5"])
    put(`packages/p/src/${name}.ts`, "export type T = 1;\n");
  put(
    "packages/p/src/entry.ts",
    [
      // A byte-order mark before the first import.
      "\ufeffimport s from './s.mjs';",
      // The verifier's two reproductions (VER-001 F4).
      "void import('./e.mjs').then(() => {});",
      "import './f.mjs'",
      // Other legal runtime forms.
      'import g from "./g.mjs"',
      'import h from"./h.mjs";',
      "import('./i.mjs').catch(() => {});",
      'const j = await import("./j.mjs", { with: { type: "json" } });',
      'export * from "./k.mjs"',
      "import {",
      '  l, // don\'t; (a quote, a semicolon, parentheses) "q"',
      '} from "./l.mjs"',
      "const m = await import(`./m.mjs`);",
      'import { "q-name" as q } from "./q.mjs";',
      'export * as "ns" from "./r.mjs";',
      'await import("./u$.mjs");',
      'import v from "./v.mjs"; import w from "./w.mjs";',
      '/* c */ import x from "./x.mjs";',
      'await import(/* lazy */ "./y.mjs");',
      'import z = require("./z.mjs");',
      "const here = import.meta.url",
      'import aa from "./aa.mjs"',
      // Type-only forms, and code that only mentions an import.
      'import type { T } from "./types.js"',
      'export type { T as U } from "./types2.js"',
      '/** @type {import("./types3.js").T} */',
      'type X = import("./types4.js").T;',
      "const dir = import.meta.dirname",
      'import type { T2 } from "./types5.js"',
      "export const n = \"from './n.mjs'\";",
      "const o = \"import './o.mjs'\";",
      'const o2 = { import: "./o2.mjs" }; o2.import("./o3.mjs");',
      'const re = /import "\\.\\/re\\.mjs"/u;',
      "const tt = `${\"import './tt.mjs'\"}`;",
      "",
    ].join("\n"),
  );
  assert.deepEqual(
    relativeImports(root, "packages/p/src/entry.ts"),
    runtime.map((name) => `packages/p/src/${name}.mjs`).sort(),
  );
});

// WO-154: a schema 2 feedback edition keys staleness on the judged behavior
// and names each unresolvable reference; a pins-only change keeps its live
// audit or carries it into a deterministic edition without a live episode.
test("WO-154 a pins-only change keeps or carries the live audit; a judged change and an unresolvable reference are stale by path", (t) => {
  const { copy, check, run, restore } = editionCopy(t);
  const live = currentEvidence(copy, "feedback").directory;
  const edition = JSON.parse(
    readFileSync(join(copy, live, "edition.json"), "utf8"),
  );
  assert.equal(edition.schemaVersion, 2);
  assert.equal(edition.liveAudit.edition, live);
  const base = check();
  assert.equal(base.status, 0, base.stdout + base.stderr);
  assert.match(
    base.stdout,
    /Live feedback audit .* judged the current source/u,
  );

  // Every judged file that carries a release label keeps its raw bytes in
  // the pins snapshot under its blob identity (WO-154 D007).
  const judged = JSON.parse(
    readFileSync(join(copy, live, "selfhost-verification.jsonl"), "utf8")
      .split("\n")
      .find((line) => line.includes('"type":"VerificationOpened"')),
  ).payload.subject.files;
  const expected = [
    ...judged
      .filter((file) => file.derivedFrom)
      .map((file) => file.derivedFrom.blobHash),
    judged.find(
      (file) => file.path === "packages/compiler/src/artifact-identity.ts",
    ).blobHash,
  ].sort();
  const pinned = readdirSync(join(copy, live, "pins")).sort();
  assert.deepEqual(pinned, expected);
  for (const name of pinned)
    assert.equal(
      execFileSync("git", ["hash-object", join(live, "pins", name)], {
        cwd: copy,
        encoding: "utf8",
      }).trim(),
      name,
    );
  const again = run("--pins");
  assert.equal(again.status, 0, again.stdout + again.stderr);

  // The skeleton and console release labels move, as a routine bump does;
  // they leave the compiled policy alone, so the live audit is kept with no
  // action. A compiler release is built, and is the next test's case.
  const edit = (path, change) =>
    writeFileSync(
      join(copy, path),
      change(readFileSync(join(copy, path), "utf8")),
    );
  const json = (change) => (text) => {
    const value = JSON.parse(text);
    change(value);
    return `${JSON.stringify(value, null, 2)}\n`;
  };
  const labelled = [
    "package-lock.json",
    "packages/skeleton/package.json",
    "packages/console/package.json",
  ];
  edit(
    "package-lock.json",
    json(({ packages }) => {
      packages["packages/skeleton"].version = "99.0.0";
      packages["packages/console"].dependencies["@dotln/skeleton"] = "99.0.0";
    }),
  );
  edit(
    "packages/skeleton/package.json",
    json((value) => {
      value.version = "99.0.0";
    }),
  );
  edit(
    "packages/console/package.json",
    json((value) => {
      value.dependencies["@dotln/skeleton"] = "99.0.0";
    }),
  );
  const pins = check();
  assert.equal(pins.status, 0, pins.stdout + pins.stderr);
  assert.match(
    pins.stdout,
    /Retained live feedback audit .*: component release labels moved since it was recorded/u,
  );

  // A deterministic re-mint names the live audit it carries.
  const carried = "docs/evidence/WO-999/feedback-001";
  const carry = run(
    "--carry",
    live,
    "--edition",
    "WO-999",
    "--revision",
    "001",
  );
  assert.equal(carry.status, 0, carry.stdout + carry.stderr);
  assert.match(carry.stdout, /no live episode/u);
  assert.deepEqual(readdirSync(join(copy, carried)).sort(), [
    "edition.json",
    "feedback.json",
  ]);
  const record = JSON.parse(
    readFileSync(join(copy, carried, "edition.json"), "utf8"),
  );
  assert.equal(record.liveAudit.carried, true);
  assert.equal(record.liveAudit.edition, live);
  assert.equal(record.liveAudit.carriedFrom.path, `${live}/edition.json`);
  assert.equal(record.behavior.identity, edition.behavior.identity);
  assert.notEqual(record.pins.identity, edition.pins.identity);
  const named = run("--check", "--edition", "WO-999", "--revision", "001");
  assert.equal(named.status, 0, named.stdout + named.stderr);
  assert.match(
    named.stdout,
    /Carried live feedback audit .*, named by docs\/evidence\/WO-999\/feedback-001/u,
  );

  // A judged change is behavior: neither the live nor the carried edition
  // admits it, and it cannot be carried (WO-147 D010).
  const store = "packages/skeleton/src/worker-store.ts";
  appendFileSync(join(copy, store), "\n// WO-154 fixture: a judged change\n");
  const behavior =
    /feedback evidence is stale: judged behavior changed since .* \(packages\/skeleton\/src\/worker-store\.ts\)/u;
  for (const refused of [
    check(),
    run("--check", "--edition", "WO-999", "--revision", "001"),
    run("--carry", live, "--edition", "WO-998", "--revision", "001"),
  ]) {
    assert.notEqual(refused.status, 0, refused.stdout);
    assert.match(refused.stderr, behavior);
  }
  restore(store);
  for (const path of labelled) restore(path);

  // A reference nothing can rebuild is stale by its path.
  const stream = join(copy, live, "selfhost-verification.jsonl");
  const blob = execFileSync("git", ["hash-object", store], {
    cwd: copy,
    encoding: "utf8",
  }).trim();
  const forged = readFileSync(stream, "utf8").replaceAll(blob, "0".repeat(40));
  assert.notEqual(forged, readFileSync(stream, "utf8"));
  writeFileSync(stream, forged);
  edit(
    `${live}/edition.json`,
    json((value) => {
      value.liveAudit.verification.blobHash = execFileSync(
        "git",
        ["hash-object", stream],
        { encoding: "utf8" },
      ).trim();
      value.liveAudit.verification.bytes = Buffer.byteLength(forged);
    }),
  );
  const unresolvable = check();
  assert.notEqual(unresolvable.status, 0, unresolvable.stdout);
  assert.match(
    unresolvable.stderr,
    /feedback evidence is stale: unresolvable edition reference: packages\/skeleton\/src\/worker-store\.ts/u,
  );
});

// WO-154 VER-001-F1: a compiler release is compiled into the program and its
// policy hash, so the case is only real once it is built. The recorded
// streams replay under the rebuilt compiler, the console's policy binding
// asks for the deterministic carry, and a judged change is still refused.
test("WO-154 a rebuilt compiler release needs only the deterministic carry; the recorded streams replay and a judged change is refused", (t) => {
  const { copy, env, check, run } = editionCopy(t, { workspace: true });
  const live = currentEvidence(copy, "feedback").directory;
  const base = check();
  assert.equal(base.status, 0, base.stdout + base.stderr);

  const edit = (path, change) =>
    writeFileSync(
      join(copy, path),
      change(readFileSync(join(copy, path), "utf8")),
    );
  const json = (change) => (text) => {
    const value = JSON.parse(text);
    change(value);
    return `${JSON.stringify(value, null, 2)}\n`;
  };
  const recorded = JSON.parse(
    readFileSync(join(copy, "packages/compiler/package.json"), "utf8"),
  ).version;
  const release = recorded.replace(/\d+$/u, (patch) => String(+patch + 1));
  const pin = (dependencies) => {
    if (dependencies?.["@dotln/compiler"])
      dependencies["@dotln/compiler"] = release;
  };
  edit("packages/compiler/src/artifact-identity.ts", (text) =>
    text.replace(
      /COMPILER_PACKAGE_VERSION = "[^"]+"/u,
      `COMPILER_PACKAGE_VERSION = "${release}"`,
    ),
  );
  edit(
    "packages/compiler/package.json",
    json((value) => {
      value.version = release;
    }),
  );
  for (const name of ["skeleton", "console"])
    edit(
      `packages/${name}/package.json`,
      json((value) => pin(value.dependencies)),
    );
  edit(
    "package-lock.json",
    json(({ packages }) => {
      packages["packages/compiler"].version = release;
      for (const entry of Object.values(packages)) pin(entry.dependencies);
    }),
  );
  const built = spawnSync(process.execPath, ["scripts/build.mjs"], {
    cwd: copy,
    encoding: "utf8",
    env,
  });
  assert.equal(built.status, 0, built.stdout + built.stderr);
  const loaded = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'const { COMPILER_PACKAGE_VERSION } = await import("@dotln/compiler"); console.log(COMPILER_PACKAGE_VERSION);',
    ],
    { cwd: join(copy, "packages/skeleton"), encoding: "utf8", env },
  );
  assert.equal(loaded.stdout.trim(), release, loaded.stderr);

  // The live audit replays; only the policy hash the console binds moved.
  const moved = check();
  assert.notEqual(moved.status, 0, moved.stdout);
  assert.match(
    moved.stderr,
    /feedback evidence is stale: a compiler release moved the policy hash since .*; carry its live audit into a new edition .*\(no live episode\)/u,
  );
  const carry = run(
    "--carry",
    live,
    "--edition",
    "WO-999",
    "--revision",
    "001",
  );
  assert.equal(carry.status, 0, carry.stdout + carry.stderr);
  assert.match(carry.stdout, /no live episode/u);
  edit(
    "docs/evidence/current.json",
    json(({ editions }) => {
      editions.feedback = { workOrder: "WO-999", revision: "001" };
    }),
  );
  const carried = check();
  assert.equal(carried.status, 0, carried.stdout + carried.stderr);
  assert.match(
    carried.stdout,
    /Carried live feedback audit .*, named by docs\/evidence\/WO-999\/feedback-001/u,
  );

  // The gate's stored-stream replay, under the rebuilt compiler: the carried
  // feedback streams and the verification edition.
  const replay = spawnSync(
    process.execPath,
    [
      "--test",
      "--test-name-pattern=WO-047 complete Decision",
      "packages/skeleton/dist/test/scenario.test.js",
    ],
    { cwd: copy, encoding: "utf8", env },
  );
  assert.equal(replay.status, 0, replay.stdout + replay.stderr);
  assert.match(replay.stdout, /ℹ pass 7\n/u);

  // A judged change after the rebuild is behavior: never kept or carried.
  appendFileSync(
    join(copy, "packages/skeleton/src/worker-store.ts"),
    "\n// WO-154 fixture: a judged change\n",
  );
  for (const refused of [
    check(),
    run("--carry", live, "--edition", "WO-998", "--revision", "001"),
  ]) {
    assert.notEqual(refused.status, 0, refused.stdout);
    assert.match(
      refused.stderr,
      /judged behavior changed since .* \(packages\/skeleton\/src\/worker-store\.ts\)/u,
    );
  }
});
