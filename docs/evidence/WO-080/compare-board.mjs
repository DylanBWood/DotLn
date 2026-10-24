import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "../../../scripts/lib/config.mjs";
import { runGit } from "../../../scripts/lib/git.mjs";
import {
  renderTerminal,
  renderHtml,
} from "../../../packages/console/dist/src/render.js";

const base = "873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6";
const before = (path) =>
  runGit(TOOL_ROOT, ["show", `${base}:${path}`], { trim: false });
const fixture = "packages/console/fixtures";
const previous = JSON.parse(before(`${fixture}/manifest.json`));
for (const name of ["wo009", "selfhost", "control", "refutations", "missing"]) {
  const path = `${fixture}/expected/${name}`;
  const board = JSON.parse(
    readFileSync(join(TOOL_ROOT, `${path}.json`), "utf8"),
  );
  for (const panel of board.panels)
    panel.sections = panel.sections.filter(
      (section) => section.id !== "workstreams",
    );
  assert.deepEqual(
    board,
    JSON.parse(before(`${path}.json`)),
    `${name} JSON changed beyond the new section`,
  );
  assert.equal(renderTerminal(board), before(`${path}.txt`));
  assert.equal(renderHtml(board), before(`${path}.html`));
  console.log(
    `${name}: JSON, text and HTML equal the base after removing only Workstreams`,
  );
}
for (const input of Object.values(previous.inputs))
  assert.equal(
    readFileSync(join(TOOL_ROOT, input.path), "utf8"),
    before(input.path),
    `existing input changed: ${input.path}`,
  );
const schema = "packages/console/uifa-board-v1.schema.json";
assert.equal(readFileSync(join(TOOL_ROOT, schema), "utf8"), before(schema));
console.log(
  "Every existing pinned input and the board schema are byte-identical to the activation base.",
);
