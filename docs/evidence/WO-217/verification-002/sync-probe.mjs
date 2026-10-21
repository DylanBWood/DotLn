// VER-002 F1 repair probe. Run from the repository root under the bounded
// wrapper, on a disposable copy only:
//   node docs/evidence/WO-217/verification-002/sync-probe.mjs <disposable-root>
// Each scenario damages one generated input of the copy, runs the artifact's
// real checker, the copy's own checkArtifact and a one-artifact syncArtifacts,
// reports whether the bytes came back, then restores every byte it touched.
// The scenarios are chosen independently of the executor's fixture: a tag
// observation naming a tag that is not at its commit, VER-001's line-3 sibling
// page edit, a deleted work-order index page, a HISTORY snapshot whose JSON is
// malformed inside a well-formed marker, a corrupted sibling receipt, and the
// npm run sync CLI over a stale sibling page.
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.argv[2] ?? "");
if (!existsSync(join(root, ".git")) || root === process.cwd())
  throw new Error("pass a disposable copy, never the live checkout");
const { generatedArtifacts, checkArtifact } = await import(
  join(root, "scripts/lib/generated-artifacts.mjs")
);
const { syncArtifacts } = await import(join(root, "scripts/sync.mjs"));
const rows = Object.fromEntries(
  generatedArtifacts(root).map((row) => [row.name, row]),
);
const receiptDir = join(
  root,
  "docs/evidence/siblings/DotLn-Enterprise-Starter",
);
const receipt = join(
  "docs/evidence/siblings/DotLn-Enterprise-Starter",
  readdirSync(receiptDir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .at(-1),
);
const scenarios = [
  {
    name: "siblings tag observation names a tag not at its commit",
    artifact: "siblings",
    files: ["docs/siblings/tag-observations.json"],
    damage: (put, get) =>
      put(
        "docs/siblings/tag-observations.json",
        get("docs/siblings/tag-observations.json").replace(
          '"tag": "v0.84.0"',
          '"tag": "v0.83.0"',
        ),
      ),
    expect: "regenerated",
  },
  {
    name: "siblings page line 3 edited (VER-001 F1 reproduction)",
    artifact: "siblings",
    files: ["docs/siblings/README.md"],
    damage: (put, get) => {
      const lines = get("docs/siblings/README.md").split("\n");
      lines[2] = `${lines[2]} (probe)`;
      put("docs/siblings/README.md", lines.join("\n"));
    },
    expect: "regenerated",
  },
  {
    name: "work-order index page deleted",
    artifact: "index",
    files: ["docs/work-orders/README.md"],
    damage: () => rmSync(join(root, "docs/work-orders/README.md")),
    expect: "regenerated",
  },
  {
    name: "work-order HISTORY snapshot JSON malformed inside its marker",
    artifact: "index",
    files: ["docs/work-orders/HISTORY.md"],
    damage: (put, get) =>
      put(
        "docs/work-orders/HISTORY.md",
        get("docs/work-orders/HISTORY.md").replace(
          /^(<!-- dotln-work-order-tags:\s*)\[/m,
          "$1[{",
        ),
      ),
    expect: "refused",
  },
  {
    name: "sibling receipt corrupted",
    artifact: "siblings",
    files: [receipt],
    damage: (put) => put(receipt, "{ not json\n"),
    expect: "refused",
  },
];
const get = (file) => readFileSync(join(root, file), "utf8");
const put = (file, text) => writeFileSync(join(root, file), text);
const results = [];
for (const scenario of scenarios) {
  const saved = new Map(
    scenario.files.map((file) => [
      file,
      existsSync(join(root, file)) ? readFileSync(join(root, file)) : null,
    ]),
  );
  const row = rows[scenario.artifact];
  try {
    const before = scenario.files.map((file) =>
      existsSync(join(root, file)) ? get(file) : null,
    );
    scenario.damage(put, get);
    const after = scenario.files.map((file) =>
      existsSync(join(root, file)) ? get(file) : null,
    );
    if (JSON.stringify(before) === JSON.stringify(after))
      throw new Error("damage did not apply");
    const check = spawnSync(row.check[0], row.check.slice(1), {
      cwd: root,
      encoding: "utf8",
    });
    const checked = checkArtifact(row, root);
    const synced = await syncArtifacts(root, { artifacts: [row] });
    const last = synced.rows.at(-1);
    const restoredBytes = scenario.files.every((file) => {
      const original = saved.get(file);
      return (
        original !== null &&
        existsSync(join(root, file)) &&
        Buffer.compare(readFileSync(join(root, file)), original) === 0
      );
    });
    results.push({
      scenario: scenario.name,
      checkExit: check.status,
      checkOutput: `${check.stdout}${check.stderr}`
        .trim()
        .split("\n")
        .filter((line) => !line.startsWith("PASS "))
        .slice(0, 2)
        .join(" | ")
        .replaceAll(root, "<copy>"),
      classifiedStale: checked.stale,
      syncAction: last?.action,
      syncBeforeAfter: `${last?.before} -> ${last?.after}`,
      syncReason: (last?.reason ?? "")
        .split("\n")[0]
        .replaceAll(root, "<copy>"),
      syncExit: synced.exitCode,
      bytesRegenerated: restoredBytes,
      expected: scenario.expect,
      asExpected: last?.action === scenario.expect,
    });
  } finally {
    for (const [file, bytes] of saved)
      if (bytes !== null) writeFileSync(join(root, file), bytes);
  }
}
// The CLI route the structural phase names: npm run sync over a stale page.
{
  const file = "docs/siblings/README.md";
  const original = readFileSync(join(root, file));
  try {
    put(file, `${get(file)}\nstale probe\n`);
    const cli = spawnSync("npm", ["run", "sync", "--silent"], {
      cwd: root,
      encoding: "utf8",
    });
    results.push({
      scenario: "npm run sync over a stale siblings page",
      cliExit: cli.status,
      cliOutput: `${cli.stdout}${cli.stderr}`
        .split("\n")
        .filter((line) => /siblings/.test(line))
        .slice(0, 3)
        .join(" | ")
        .replaceAll(root, "<copy>"),
      bytesRegenerated:
        Buffer.compare(readFileSync(join(root, file)), original) === 0,
      expected: "regenerated",
      asExpected:
        cli.status === 0 &&
        Buffer.compare(readFileSync(join(root, file)), original) === 0,
    });
  } finally {
    writeFileSync(join(root, file), original);
  }
}
for (const result of results) console.log(JSON.stringify(result));
