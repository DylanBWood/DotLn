#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  projectBoard,
  renderHtml,
  renderTerminal,
} from "../packages/console/dist/src/index.js";
import {
  fixtureRoot,
  loadFixture,
  manifest,
} from "../packages/console/dist/test/fixtures.js";

const [mode = "--check", ...rest] = process.argv.slice(2);
if (rest.length || !["--write", "--check"].includes(mode))
  throw new Error(
    "usage: console-fixtures.mjs [--write|--check] (build first)",
  );
const directory = join(fixtureRoot, "expected");
if (mode === "--write") mkdirSync(directory, { recursive: true });
for (const name of Object.keys(manifest.cases)) {
  const board = projectBoard(loadFixture(name));
  for (const [extension, contents] of [
    ["json", JSON.stringify(board, null, 2) + "\n"],
    ["txt", renderTerminal(board)],
    ["html", renderHtml(board)],
  ]) {
    const path = join(directory, `${name}.${extension}`);
    if (mode === "--write") writeFileSync(path, contents);
    else
      assert.equal(
        readFileSync(path, "utf8"),
        contents,
        `console fixture changed: ${name}.${extension}`,
      );
  }
  process.stdout.write(
    `${name}: JSON, terminal, HTML ${mode === "--write" ? "recorded" : "match"}\n`,
  );
}
