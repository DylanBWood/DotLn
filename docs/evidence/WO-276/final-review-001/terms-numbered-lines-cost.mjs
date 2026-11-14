// Final review of WO-276: what the local-terms screen costs on lines that
// open with a number, at the base and now. The list holds one invented entry
// (a host and port); the screened text is a column of decimals, as a data or
// evidence file holds them. The entry is marked on its own line, the one
// form the base and the candidate both read. argv[2] is a scratch root for the invented list,
// argv[3] the directory that holds HEAD's scripts (git archive).
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const [scratch, base] = process.argv.slice(2);
const load = (from) =>
  import(pathToFileURL(join(from, "scripts/lib/terms.mjs")).href);
const readers = {
  base: await load(base),
  candidate: await load(process.cwd()),
};
const root = join(scratch, "root");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "docs/control/local"), { recursive: true });
const column = (lines) =>
  Array.from({ length: lines }, (_, i) => `${i % 3}.${(i * 37) % 10}`).join(
    "\n",
  ) + "\n";
const rows = [];
for (const [entry, lines] of [
  ["build.lantern.example", 100],
  ["build.lantern.example:8443", 100],
]) {
  writeFileSync(
    join(root, "docs/control/local/terms.txt"),
    `refuse: ${entry}\n`,
  );
  const letters = entry.replace(/[^\p{L}\p{N}]/gu, "").length;
  for (const [name, reader] of Object.entries(readers)) {
    const started = performance.now();
    const result = reader.localTermFindings(root, [
      { name: "figures.txt", text: column(lines) },
    ]);
    rows.push({
      reader: name,
      entryLettersAndDigits: letters,
      lines,
      milliseconds: Math.round(performance.now() - started),
      findings: result.findings.length,
    });
  }
}
rmSync(root, { recursive: true, force: true });
console.log(JSON.stringify(rows, null, 2));
