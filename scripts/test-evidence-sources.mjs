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
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { TOOL_ROOT } from "./lib/config.mjs";

const paths = (...args) =>
  execFileSync("git", ["-C", TOOL_ROOT, ...args], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);

/** A shared clone carrying the working tree's bytes, the built packages and
 * the installed dependencies, so its edition scripts check what the gate
 * checks. Sources stay real files: the feedback audit refuses a symlink. */
function editionCopy(t) {
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
  symlinkSync(join(TOOL_ROOT, "node_modules"), join(copy, "node_modules"));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !["DOTLN_LAUNCHPAD", "NODE_TEST_CONTEXT"].includes(key),
    ),
  );
  const check = () =>
    spawnSync(process.execPath, ["scripts/feedback-evidence.mjs", "--check"], {
      cwd: copy,
      encoding: "utf8",
      env,
    });
  const restore = (path) =>
    writeFileSync(join(copy, path), readFileSync(join(TOOL_ROOT, path)));
  return { copy, check, restore };
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
