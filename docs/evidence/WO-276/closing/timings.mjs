// Step Z1: the timings that steps A14, B1, B10, C5, G4 and L2 recorded, taken
// again on the final candidate, because later parts changed the checks they
// time. Written beside this file as timings.json.
//
//   node docs/evidence/WO-276/closing/timings.mjs
//
// The document check and the index check are timed here, three runs each,
// one at a time, and the Markdown screen in this process. Steps G4 and L2
// timed with scripts of their own, which write into their parts'
// directories: each directory is copied aside, the script is run, its new
// figures are read, and the directory is put back as it was, so a part's
// record keeps the figures its decision cites.
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const timed = (command, args) => {
  const seconds = [];
  let exitCode = 0;
  for (let run = 0; run < 3; run++) {
    const started = performance.now();
    const result = spawnSync(command, args, { cwd: root, stdio: "ignore" });
    seconds.push(Math.round((performance.now() - started) / 10) / 100);
    exitCode = result.status;
  }
  return {
    seconds,
    exitCode,
    method: "wall seconds of three runs, one at a time",
  };
};
const again = (part, script, read) => {
  const directory = join(root, "docs/evidence/WO-276", part);
  const aside = mkdtempSync(join(tmpdir(), `dotln-z1-${part}-`));
  cpSync(directory, join(aside, part), { recursive: true });
  let value;
  let exitCode;
  try {
    const run = spawnSync(
      process.execPath,
      ["--test", join(directory, script)],
      { cwd: root, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
    );
    exitCode = run.status;
    value = read(
      JSON.parse(readFileSync(join(directory, "results.json"), "utf8")),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    cpSync(join(aside, part), directory, { recursive: true });
    rmSync(aside, { recursive: true, force: true });
  }
  return { exitCode, ...value };
};

const documentCheck = timed(process.execPath, ["scripts/docs-check.mjs"]);
const indexCheck = timed("npm", [
  "run",
  "work-orders",
  "--silent",
  "--",
  "index",
  "--check",
]);
const { markdownScreen, screenedSources } = await import(
  pathToFileURL(join(root, "scripts/lib/markdown-screen.mjs")).href
);
const screenStarted = performance.now();
const sources = screenedSources(root);
const findings = markdownScreen(root, sources);
const screen = {
  sources: sources.length,
  findings: findings.length,
  seconds: Math.round((performance.now() - screenStarted) / 10) / 100,
  method:
    "markdownScreen over every screened source, one batch, in this process",
};
const partG = again("part-g", "exported.mjs", (results) => ({
  generatedCheck: results.generatedCheck,
}));
const partL = again("part-l", "evidence.mjs", (results) => ({
  briefing: results.after.briefing,
  docsCheck: results.after.docsCheck,
}));
writeFileSync(
  join(here, "timings.json"),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      what: "Step Z1: the timings of steps A14, B1, B10, C5, G4 and L2, taken again on the final candidate. The parts' own files keep the figures their decisions cite.",
      tree: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
        encoding: "utf8",
      }).trim(),
      treeNote:
        "the working tree of the order at step Z1, uncommitted on this commit",
      "node scripts/docs-check.mjs (steps A14, B1, C5, L2)": documentCheck,
      "npm run work-orders -- index --check (step B1)": indexCheck,
      "the Markdown screen (step B10)": screen,
      "the operator page's generated check (step G4)": partG,
      "a target order's briefing and the document check (step L2)": partL,
    },
    null,
    2,
  )}\n`,
);
console.log("timings written");
