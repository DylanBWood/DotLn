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
const result = runScenario(fixture);
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
console.log(
  `\nverified=${result.verified} candidates=${result.candidates.length}`,
);
