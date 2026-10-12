#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { docPath, docRelative, findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  checkExamples,
  preview,
  profileGuidance,
  readReaderProfiles,
  readScores,
  recordCorrection,
  recordScores,
  scorePrompt,
  scoreRows,
} from "./lib/reader-profiles.mjs";

export function main(args = process.argv.slice(2), root = findLaunchpad()) {
  const [action, ...rest] = args;
  if (action === "profile" && rest.length === 1)
    return profileGuidance(rest[0], root);
  if (action === "preview" && rest.length === 1) return preview(rest[0], root);
  if (action === "score" && rest.length === 0) return scorePrompt(root);
  if (action === "score" && rest.length === 2 && rest[0] === "--record")
    return recordScores(JSON.parse(readFileSync(rest[1], "utf8")), root);
  if (
    action === "score" &&
    rest.length === 4 &&
    rest[0] === "--correction" &&
    rest[2] === "--capture-hash"
  )
    return recordCorrection(rest[1], rest[3], root);
  if (action === "check" && rest.length === 0) {
    const scores = readScores(root);
    if (
      !scores.length &&
      !existsSync(docPath(root, "control", "reader-profiles.json")) &&
      !existsSync(docPath(root, "publication", "examples"))
    )
      return {
        passed: true,
        surfaces: 0,
        examples: 0,
        illustrations: 0,
        figures: [],
        unavailable: [
          docRelative(root, "control", "reader-profiles.json"),
          docRelative(root, "publication", "examples"),
          "no score rows declared",
        ],
      };
    readReaderProfiles(root);
    checkExamples(root);
    const figures = scoreRows(scores);
    return {
      passed: true,
      surfaces: 5,
      examples: 15,
      illustrations: 15,
      figures,
    };
  }
  throw new Error(
    "usage: reader profile|preview <surface> | score [--record <file> | --correction <surface> --capture-hash sha256:<digest>] | check",
  );
}
if (isMainModule(import.meta.url)) {
  try {
    const output = main();
    console.log(
      typeof output === "string"
        ? output.trimEnd()
        : JSON.stringify(output, null, 2),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
