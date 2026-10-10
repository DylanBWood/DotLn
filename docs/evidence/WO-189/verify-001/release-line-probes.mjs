import {
  realpathSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import {
  planReleasePreparation,
  applyReleasePreparation,
} from "../../../../scripts/lib/release-preparation.mjs";
const page = readFileSync(
  join(resolve(import.meta.dirname, "../../../.."), "README.md"),
  "utf8",
);
const version = "v0.73.2";
const claim = `This source prepares DotLn \`${version}\`.`;
const mask = (text) =>
  text.replace(
    /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/g,
    "<!-- DOTLN-RELEASE-BEGIN -->\n<!-- DOTLN-RELEASE-END -->",
  );
const cases = [];
for (const [name, block, latest] of [
  ["canonical line with version collision", claim, version],
  [
    "legacy line with version collision",
    `This source prepares \`${version}\`.`,
    version,
  ],
  [
    "legacy line with available target",
    `This source prepares \`${version}\`.`,
    "v0.73.1",
  ],
  ["second non-empty line", claim + "\nAn appended claim.", version],
  ["second sentence beside claim", claim + " An appended claim.", version],
  ["blank lines around canonical claim", "\n" + claim + "\n", version],
]) {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-wo189-release-")),
  );
  const git = (...args) => {
    const result = spawnSync("git", ["-C", root, ...args], {
      encoding: "utf8",
    });
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout.trim();
  };
  const write = (file, text) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  };
  try {
    git("init", "-q", "-b", "wo-999");
    if (git("rev-parse", "--show-toplevel") !== root)
      throw new Error("root mismatch");
    const authority = "docs/work-orders/WO-999-probe.md";
    write(
      authority,
      "# WO-999 — Probe (v0.73.2)\n\n**Release classification:** patch. Probe.\n\n**Objective:** Keep this text.\n",
    );
    const before = page.replace(
      /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/,
      "<!-- DOTLN-RELEASE-BEGIN -->\n" + block + "\n<!-- DOTLN-RELEASE-END -->",
    );
    write("README.md", before);
    const state = {
      workOrderId: "WO-999",
      workOrderPath: authority,
      phase: "verifying",
    };
    try {
      const plan = planReleasePreparation(root, state, latest, "2026-10-10");
      applyReleasePreparation(plan);
      const after = readFileSync(join(root, "README.md"), "utf8");
      const content =
        /<!-- DOTLN-RELEASE-BEGIN -->\n([\s\S]*?)\n<!-- DOTLN-RELEASE-END -->/.exec(
          after,
        )[1];
      cases.push({
        name,
        target: plan.target,
        edits: plan.edits.length,
        content,
        outsideUnchanged: mask(before) === mask(after),
        exactGeneratedLine:
          content === `This source prepares DotLn \`${plan.target}\`.`,
      });
    } catch (error) {
      cases.push({
        name,
        refused: error.message,
        readmeUnchanged:
          readFileSync(join(root, "README.md"), "utf8") === before,
      });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
console.log(
  JSON.stringify(
    {
      subject: "current WO-189 README; synthetic wo-999 with patch target",
      cases,
    },
    null,
    2,
  ),
);
