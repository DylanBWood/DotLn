#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { docPath, findLaunchpad } from "./lib/config.mjs";
import { containedRegularFile, isMainModule } from "./lib/paths.mjs";
import { checkLocalTerms } from "./lib/terms.mjs";
import {
  lintOutwardArtifact,
  outwardArtifactKinds,
} from "./lib/outward-lint.mjs";

// The existing checker throws redacted file/line/count diagnostics. Whitelist
// that shape; filesystem/configuration exceptions never reach outward output.
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
              Number.isInteger(row.count) &&
              row.count > 0,
          )
        )
          return {
            status: "refused",
            findings: rows.map(({ line, count }) => ({ line, count })),
          };
      } catch {
        // An unexpected diagnostic is an error, never a successful check.
      }
    }
    return { status: "error" };
  }
};

export function checkOutwardArtifact(root, { kind, text }) {
  const path = docPath(root, "control", "outward-vocabulary.json");
  if (!containedRegularFile(path, root))
    throw new Error("outward vocabulary must be a contained regular file");
  const vocabulary = JSON.parse(readFileSync(path, "utf8"));
  // Align line endings with checkLocalTerms, which recognizes LF and CRLF.
  const localTerms = observeLocalTerms(root, text.replace(/\r\n?|\n/g, "\n"));
  return lintOutwardArtifact({ kind, text, vocabulary, localTerms });
}

if (isMainModule(import.meta.url)) {
  const [kind, ...extra] = process.argv.slice(2);
  if (!outwardArtifactKinds.includes(kind) || extra.length) {
    console.error(
      `usage: node scripts/outward-lint.mjs <${outwardArtifactKinds.join("|")}> < artifact`,
    );
    process.exitCode = 3;
  } else {
    try {
      let text = readFileSync(0, "utf8");
      // A pipe's final line terminator is transport framing for one-line kinds.
      if (kind === "branch" || kind === "pr-title")
        text = text.replace(/(?:\r\n|\n|\r)$/, "");
      const result = checkOutwardArtifact(findLaunchpad(), { kind, text });
      console.log(JSON.stringify(result));
      process.exitCode = { pass: 0, refused: 1, unavailable: 2 }[result.status];
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
