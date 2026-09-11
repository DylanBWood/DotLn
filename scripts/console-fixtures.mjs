#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { currentEvidence } from "../packages/skeleton/src/evidence-editions.mjs";
import {
  projectBoard,
  renderHtml,
  renderTerminal,
} from "../packages/console/dist/src/index.js";
import {
  fixtureRoot,
  loadFixture,
  manifest,
  root,
} from "../packages/console/dist/test/fixtures.js";

const [mode = "--check", ...rest] = process.argv.slice(2);
if (
  rest.length ||
  !["--write", "--check", "--record-current-selfhost"].includes(mode)
)
  throw new Error(
    "usage: console-fixtures.mjs [--write|--check|--record-current-selfhost] (build first)",
  );
if (mode === "--record-current-selfhost") {
  const selected = currentEvidence(root, "feedback");
  for (const [key, name] of [
    ["selfhostAudit", "selfhost-audit.jsonl"],
    ["selfhostVerifier", "selfhost-verification.jsonl"],
    ["maturity", "feedback.json"],
  ]) {
    const path = `${selected.directory}/${name}`;
    manifest.inputs[key] = {
      ...manifest.inputs[key],
      path,
      ref: path,
      sha256: createHash("sha256")
        .update(readFileSync(join(root, path)))
        .digest("hex"),
    };
  }
  for (const store of manifest.cases.selfhost.stores)
    store.label = `${selected.workOrder} self-hosted ${store.id === "selfhost-audit" ? "executor" : "verifier"}`;
  const capture = `Current selfhost recording follows ${selected.directory}; previous source editions retain their bytes.`;
  if (!manifest.capture.includes(capture)) manifest.capture += ` ${capture}`;
  // Check every newly pinned input before replacing the fixture manifest.
  loadFixture("selfhost");
  writeFileSync(
    join(fixtureRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
}
const writing = mode !== "--check";
const directory = join(fixtureRoot, "expected");
if (writing) mkdirSync(directory, { recursive: true });
for (const name of mode === "--record-current-selfhost"
  ? ["selfhost"]
  : Object.keys(manifest.cases)) {
  const board = projectBoard(loadFixture(name));
  for (const [extension, contents] of [
    ["json", JSON.stringify(board, null, 2) + "\n"],
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
