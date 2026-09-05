import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import {
  compileEditableView,
  renderCompiledDiff,
  renderViewHashes,
  seiriCodeDslView,
  seiriEnvironment,
  seiriFunctionTableView,
  seiriStatechartJsonView,
  type EditableView,
} from "@dotln/compiler";
import {
  createBeaconWriter,
  renderConstellation,
  sweepBeacons,
} from "./beacon-fs.js";
import { renderAuditProjections } from "./audit.js";
import { runScenario, type FixtureTree } from "./scenario.js";

const fixturePath = fileURLToPath(
  new URL("../../fixtures/repo-tree.json", import.meta.url),
);
const packagePath = fileURLToPath(
  new URL("../../package.json", import.meta.url),
);
const packageManifest = JSON.parse(await readFile(packagePath, "utf8")) as {
  version?: unknown;
};
if (typeof packageManifest.version !== "string")
  throw new Error(`skeleton package version is missing: ${packagePath}`);
const fixture = JSON.parse(await readFile(fixturePath, "utf8")) as FixtureTree;
const beaconFlags = process.argv.slice(2).filter((arg) => arg === "--beacons");
const beaconIndex = process.argv.indexOf("--beacons");
const beaconDirectory =
  beaconIndex === -1 ? undefined : process.argv[beaconIndex + 1];
if (
  beaconFlags.length > 1 ||
  (beaconIndex !== -1 && (!beaconDirectory || beaconDirectory.startsWith("--")))
)
  throw new Error("usage: --beacons <directory> (exactly once)");
const writer =
  beaconDirectory === undefined
    ? undefined
    : createBeaconWriter(
        beaconDirectory,
        fileURLToPath(new URL("../../../../", import.meta.url)),
      );
const result = runScenario(
  fixture,
  writer === undefined
    ? {}
    : {
        onEvents: writer.project,
        onExecutorClaim: writer.claim,
      },
);
console.log(
  `@dotln/skeleton v${packageManifest.version} — Repo Gardener + Seiri`,
);
console.log(result.timeline.join("\n"));
console.log("\n" + result.glyphScene);
if (process.argv.includes("--audit"))
  console.log("\n" + renderAuditProjections(decodeLog(result.log)));
if (process.argv.includes("--compiled-diff")) {
  const views: readonly Readonly<{
    name: string;
    source: EditableView;
  }>[] = [
    { name: "code-dsl", source: seiriCodeDslView },
    { name: "function-table", source: seiriFunctionTableView },
    { name: "statechart-json", source: seiriStatechartJsonView },
  ];
  const compilations = views.map(({ name, source }) => {
    const compilation = compileEditableView(source, seiriEnvironment());
    if (!compilation.ok)
      throw new Error(
        `${name}: ${compilation.diagnostics.map((entry) => entry.message).join("; ")}`,
      );
    return { name, compilation };
  });
  console.log(
    "\n" +
      renderViewHashes(
        compilations.map(({ name, compilation }) => ({
          view: name,
          semanticHash: compilation.semanticHash,
        })),
      ),
  );
  console.log(
    "\n" + renderCompiledDiff(undefined, compilations[0]!.compilation.program),
  );
}
if (writer !== undefined)
  console.log("\n" + renderConstellation(sweepBeacons(writer.directory)));
console.log(
  `\nverified=${result.verified} candidates=${result.candidates.length}`,
);
