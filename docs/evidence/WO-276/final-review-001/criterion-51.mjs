// Final review of WO-276, criterion 51 (F2): can a case of the product
// skeleton suite, which is where criterion 50 (F1) puts its case, read the
// rule-by-role table the criterion places under docs/evidence/WO-276/part-f/?
// The probe runs one read of the table in a child process under the same
// observer the product gate installs, with the order's record roots as the
// gate names them, and reads what the observer recorded. It writes only to
// the scratch directory given as argv[2].
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const scratch = process.argv[2];
mkdirSync(scratch, { recursive: true });
const manifest = join(scratch, "product-read-manifest.json");
const log = join(scratch, "product-read-log.jsonl");
writeFileSync(
  manifest,
  JSON.stringify({
    root,
    excluded: [],
    directories: [],
    recordRoots: [
      "docs/evidence/WO-276",
      "docs/verifications/WO-276",
      "docs/final-reviews/WO-276",
    ],
  }),
);
writeFileSync(log, "");
const observer = pathToFileURL(
  join(root, "scripts/lib/product-read-guard.mjs"),
).href;
const read = (path) =>
  spawnSync(
    process.execPath,
    ["-e", `require("node:fs").readFileSync(${JSON.stringify(path)})`],
    {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        NODE_OPTIONS: `--import=${observer}`,
        DOTLN_PRODUCT_READ_MANIFEST: manifest,
        DOTLN_PRODUCT_READ_LOG: log,
        DOTLN_PRODUCT_READ_CASE: "final-review probe",
      },
    },
  );
const table = read("docs/evidence/WO-276/part-f/rule-table.md");
const control = read("packages/skeleton/package.json");
const events = readFileSync(log, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const result = {
  tableReadExit: table.status,
  controlReadExit: control.status,
  excludedReads: events
    .filter((event) => event.kind === "excluded-read")
    .map(({ path, method }) => ({ path, method })),
};
console.log(JSON.stringify(result, null, 2));
if (
  !result.excludedReads.some(
    ({ path }) => path === "docs/evidence/WO-276/part-f/rule-table.md",
  ) ||
  result.excludedReads.some(({ path }) => path.startsWith("packages/"))
)
  process.exit(1);
