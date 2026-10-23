#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { docPath, findLaunchpad } from "./lib/config.mjs";
import { containedRegularFile, isMainModule } from "./lib/paths.mjs";
import { checkLocalTerms, localTermModes } from "./lib/terms.mjs";
import {
  lintOutwardArtifact,
  outwardArtifactKinds,
} from "./lib/outward-lint.mjs";

// The checker throws redacted file/line-range/count/mode diagnostics.
// Whitelist that shape; filesystem/configuration exceptions never reach
// outward output. Matches of review-mode terms are the publication's review
// items; one refuse-mode match refuses.
const observeLocalTerms = (root, text) => {
  try {
    return checkLocalTerms(root, [{ name: "artifact", text }]);
  } catch (error) {
    const prefix = "local-terms list present; refused ";
    if (error.message?.startsWith(prefix)) {
      try {
        const rows = JSON.parse(error.message.slice(prefix.length));
        if (
          Array.isArray(rows) &&
          rows.length &&
          rows.every(
            (row) =>
              row.file === "artifact" &&
              Number.isInteger(row.line) &&
              row.line > 0 &&
              Number.isInteger(row.endLine) &&
              row.endLine >= row.line &&
              Number.isInteger(row.count) &&
              row.count > 0 &&
              localTermModes.includes(row.mode),
          )
        )
          return {
            status: rows.every((row) => row.mode === "review")
              ? "review"
              : "refused",
            findings: rows.map(({ line, endLine, count, mode }) => ({
              line,
              endLine,
              count,
              mode,
            })),
          };
      } catch {
        // An unexpected diagnostic is an error, never a successful check.
      }
    }
    return { status: "error" };
  }
};

// Every occurrence of each exempt string as a span of the text: the lint
// drops the public review words it contains, so a registered display name is
// read as a name. The private list is never masked, because a private term
// that merely contains the name would slip through the blank.
const exemptSpans = (text, exemptText) => {
  const spans = [];
  for (const needle of exemptText) {
    if (!needle) continue;
    for (
      let at = text.indexOf(needle);
      at >= 0;
      at = text.indexOf(needle, at + needle.length)
    )
      spans.push({ start: at, end: at + needle.length });
  }
  return spans.sort((left, right) => left.start - right.start);
};

/** The launchpad's committed vocabulary file, as written. */
export function readOutwardVocabulary(root) {
  const path = docPath(root, "control", "outward-vocabulary.json");
  if (!containedRegularFile(path, root))
    throw new Error("outward vocabulary must be a contained regular file");
  return JSON.parse(readFileSync(path, "utf8"));
}

export function checkOutwardArtifact(
  root,
  { kind, text, target = false, sections, exemptText = [] },
) {
  const vocabulary = readOutwardVocabulary(root);
  const exempt = exemptSpans(text, exemptText);
  // Align line endings with checkLocalTerms, which recognizes LF and CRLF.
  const localTerms = observeLocalTerms(root, text.replace(/\r\n?|\n/g, "\n"));
  return lintOutwardArtifact({
    kind,
    text,
    vocabulary,
    localTerms,
    target,
    sections,
    exempt,
  });
}

if (isMainModule(import.meta.url)) {
  const [kind, ...extra] = process.argv.slice(2);
  const target = extra[0] === "--target";
  if (!outwardArtifactKinds.includes(kind) || extra.length > (target ? 1 : 0)) {
    console.error(
      `usage: node scripts/outward-lint.mjs <${outwardArtifactKinds.join("|")}> [--target] < artifact`,
    );
    process.exitCode = 3;
  } else {
    try {
      let text = readFileSync(0, "utf8");
      // A pipe's final line terminator is transport framing for one-line kinds.
      if (kind === "branch" || kind === "pr-title")
        text = text.replace(/(?:\r\n|\n|\r)$/, "");
      const result = checkOutwardArtifact(findLaunchpad(), {
        kind,
        text,
        target,
      });
      console.log(JSON.stringify(result));
      process.exitCode = { pass: 0, refused: 1, unavailable: 2, review: 4 }[
        result.status
      ];
    } catch {
      console.error(
        JSON.stringify({
          status: "error",
          rule: "outward.configuration-or-input",
        }),
      );
      process.exitCode = 3;
    }
  }
}
