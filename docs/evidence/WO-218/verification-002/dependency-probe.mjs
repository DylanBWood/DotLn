// VER-002 probe: where does the historical-id dependency refusal fire? One
// order whose typed block makes WO-001 a hard dependency is read through the
// parser, the work-orders header reader (the index and planning reader) and
// the activation and status reader. Run from the repository root:
//   node docs/evidence/WO-218/verification-002/dependency-probe.mjs <root> <label>
// <root> is this checkout or an extracted archive of another commit's scripts
// and packages. Nothing under <root> is written.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? ".");
const label = process.argv[3] ?? "subject";
const load = (path) => import(pathToFileURL(join(root, path)).href);
const dependencies = await load("scripts/lib/dependencies.mjs");
const orders = await load("scripts/work-orders.mjs");
const path = "docs/work-orders/WO-990-probe.md";
const markdown = [
  "# WO-990 — probe (v9.9.9)",
  "",
  "**Model:** any.",
  "",
  "<!-- dotln-dependencies:start -->",
  JSON.stringify(
    [{ workOrderId: "WO-001", relation: "hard", reason: "probe" }],
    null,
    2,
  ),
  "<!-- dotln-dependencies:end -->",
  "",
  "**Objective:** probe.",
  "",
].join("\n");
const attempt = (name, run) => {
  try {
    console.log(`${label} ${name}: admitted ${JSON.stringify(run())}`);
  } catch (error) {
    console.log(`${label} ${name}: refused ${error.message}`);
  }
};

attempt(
  "parseDependencies",
  () => dependencies.parseDependencies(markdown, path, "WO-990").entries,
);
attempt(
  "parseHeader (index and planning reader)",
  () => orders.parseHeader(markdown, path).dependencies.entries,
);
const historical =
  typeof dependencies.historicalDependencyIds === "function"
    ? dependencies.historicalDependencyIds(root)
    : dependencies.historicalDependencyIds;
console.log(`${label} historical ids: ${JSON.stringify([...historical])}`);

// The activation and status reader needs the order file under a root; a
// scratch root carries the same configuration as <root>.
const scratch = mkdtempSync(join(tmpdir(), "dotln-dependency-probe-"));
try {
  mkdirSync(join(scratch, "docs/work-orders"), { recursive: true });
  writeFileSync(join(scratch, path), markdown);
  const config = join(root, "dotln.config.json");
  if (existsSync(config))
    writeFileSync(join(scratch, "dotln.config.json"), readFileSync(config));
  attempt(
    "readDependencies (activation and status reader)",
    () =>
      dependencies.readDependencies(
        scratch,
        { workOrderId: "WO-990", workOrderPath: path },
        { orders: new Map(), locations: new Map() },
        () => new Set(),
      )?.entries,
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
