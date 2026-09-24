#!/usr/bin/env node
// WO-157 item 13 (WO-151 D021): a new committed artifact or a new document
// suite owes a registration to a check that enumerates it. This document-gate
// row makes both owed registrations fail when they are missing, before the
// artifact is committed or the enumerating suite happens to be selected.
import { TOOL_ROOT, docRelative, findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { decodeLog, encodeLog } from "@dotln/kernel";
import { DOCUMENT_GATE_STUBS } from "./lib/document-gate-stubs.mjs";
import { expandSuiteTasks, suites } from "./test-runner.mjs";

const REGISTRY = "packages/kernel/test/fixtures/jsonl-protocols.json";
const STUBS = "scripts/lib/document-gate-stubs.mjs";

/** Every JSONL under docs/, tracked or untracked but not ignored, is either an
 * EventEnvelope stream that round-trips byte-identically or a protocol the
 * kernel's registry classifies; and every script a document-gate task runs
 * has a stub in the runner's CLI-selection fixture. */
export function registrationFindings(root = findLaunchpad()) {
  const registry = JSON.parse(readFileSync(join(TOOL_ROOT, REGISTRY), "utf8"));
  const segment = new RegExp(registry.controlSegmentPattern, "u");
  const files = execFileSync(
    "git",
    [
      "-C",
      root,
      "ls-files",
      "-z",
      "--cached",
      "--others",
      "--exclude-standard",
      "--",
      docRelative(root, "docs"),
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  )
    .split("\0")
    .filter((path) => path.endsWith(".jsonl") && existsSync(join(root, path)));
  const findings = [];
  let streams = 0;
  let classified = 0;
  for (const path of [...new Set(files)].sort()) {
    if (Object.hasOwn(registry.nonEventPaths, path) || segment.test(path)) {
      classified += 1;
      continue;
    }
    const text = readFileSync(join(root, path), "utf8");
    try {
      if (encodeLog(decodeLog(text)) !== text)
        throw new Error("the stream does not round-trip byte-identically");
      streams += 1;
    } catch (error) {
      findings.push(
        `unregistered JSONL: ${path} is not an EventEnvelope stream (${error instanceof Error ? error.message : String(error)}) and ${REGISTRY} does not classify it`,
      );
    }
  }
  const tasks = [
    suites.find((row) => row.build),
    ...expandSuiteTasks(
      suites.filter((row) => row.document && !row.build),
      TOOL_ROOT,
    ),
  ];
  for (const task of tasks)
    for (const part of [...task.command.slice(1), ...(task.args ?? [])])
      if (
        /^scripts\/[^*/]+$/u.test(part) &&
        !DOCUMENT_GATE_STUBS.includes(part.slice("scripts/".length))
      )
        findings.push(
          `unstubbed document suite: ${task.name} runs ${part}, which the runner's CLI-selection fixture (${STUBS}) does not stub`,
        );
  return {
    findings,
    summary: `Registrations: ${streams + classified} JSONL under docs/ (${streams} EventEnvelope streams, ${classified} classified); ${tasks.length} document-gate tasks stubbed.`,
  };
}

if (isMainModule(import.meta.url)) {
  try {
    const { findings, summary } = registrationFindings();
    if (findings.length) {
      for (const finding of findings) console.error(finding);
      process.exitCode = 1;
    } else console.log(summary);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
