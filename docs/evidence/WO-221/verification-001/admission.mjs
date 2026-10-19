// VER-001 extends the current admission fixture without editing its source.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const source = readFileSync(join(root, "scripts/test-harness.mjs"), "utf8");
const selected = 'test("WO-221 registered-target admission';
const start = source.indexOf(selected);
if (start < 0) throw new Error("Admission fixture missing");
const end = source.indexOf("\ntest(", start + 1);
const invoke = source.indexOf("const stopUnits = new Set(");
const invokeEnd = source.indexOf("\ntest(", invoke);
let probe =
  source.slice(0, source.indexOf("\ntest(")) +
  source.slice(invoke, invokeEnd) +
  source.slice(start, end);
probe = probe
  .replace(/^import "\.\/test-[^"]+";\n/gm, "")
  .replace(
    /from "(\.[^"]+)"/g,
    (_, file) =>
      `from ${JSON.stringify(pathToFileURL(resolve(root, "scripts", file)).href)}`,
  )
  .replace(
    'const sourceRoot = fileURLToPath(new URL("../", import.meta.url));',
    `const sourceRoot = ${JSON.stringify(root)};`,
  )
  .replace(
    /new URL\("(\.[^"]+)", import.meta.url\)/g,
    (_, file) =>
      `new URL(${JSON.stringify(pathToFileURL(resolve(root, "scripts", file)).href)})`,
  );
const grantCommit =
  'commitAll(mainCheckout, "Grant repo.push and pr.open for the target");';
if (!probe.includes(grantCommit))
  throw new Error("Grant fixture marker missing");
probe = probe.replace(
  grantCommit,
  "withheld(push); // The valid grant exists only in the uncommitted main checkout.\n" +
    grantCommit,
);
const allowedPush = "allowed(push);";
if (!probe.includes(allowedPush))
  throw new Error("Push fixture marker missing");
probe = probe.replace(
  allowedPush,
  allowedPush +
    `
    allowed(\`git -C "\${target}" push -u origin wo-999\`);
    allowed('git push -u origin wo-999', {tool_input:{command:'git push -u origin wo-999',cwd:target}});
    withheld(\`git -C \${target} push -u origin wo-999 extra\`);`,
);
const scratch = mkdtempSync(join(tmpdir(), "dotln-wo221-admission-"));
try {
  const file = join(scratch, "admission.mjs");
  writeFileSync(file, probe);
  await import(pathToFileURL(file).href);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
