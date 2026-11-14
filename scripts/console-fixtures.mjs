#!/usr/bin/env node
import { json as prettyJson } from "./lib/helpers.mjs";
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
  readFixtureManifest,
} from "../packages/console/dist/test/fixtures.js";

const [mode = "--check", ...rest] = process.argv.slice(2);
if (rest.length || !["--write", "--check"].includes(mode))
  throw new Error(
    "usage: console-fixtures.mjs [--write|--check] (build first)",
  );
const manifest = readFixtureManifest();
const writing = mode === "--write";
const directory = join(fixtureRoot, "expected");
if (writing) mkdirSync(directory, { recursive: true });
for (const name of Object.keys(manifest.cases)) {
  const board = projectBoard(loadFixture(name, manifest));
  for (const [extension, contents] of [
    ["json", prettyJson(board)],
    ["txt", renderTerminal(board)],
    ["html", renderHtml(board)],
  ]) {
    const path = join(directory, `${name}.${extension}`);
    if (writing) writeFileSync(path, contents);
    else
      assert.equal(
        readFileSync(path, "utf8"),
        contents,
        `console fixture changed: ${name}.${extension}`,
      );
  }
  process.stdout.write(
    `${name}: JSON, terminal, HTML ${writing ? "recorded" : "match"}\n`,
  );
}
