import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { containedRegularFile } from "./paths.mjs";

const tokens = (text) =>
  text
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .match(/[\p{L}\p{N}]+/gu) ?? [];

// The local list and matches never leave this process, including as hashes.
export function checkLocalTerms(root, surfaces) {
  const path = join(root, "docs/control/local/terms.txt");
  if (!existsSync(path)) return { status: "unavailable" };
  if (!containedRegularFile(path, root))
    throw new Error("local-terms list is not a contained regular file");
  const terms = readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => tokens(line).join(""));
  if (!terms.length || terms.some((term) => !term))
    throw new Error("local-terms list is present but empty or malformed");
  const denied = new Set(terms);
  const maxLength = terms.reduce(
    (longest, term) => Math.max(longest, term.length),
    0,
  );
  const findings = [];
  for (const { name, text } of surfaces) {
    const words = text
      .split(/\r?\n/)
      .flatMap((line, index) =>
        tokens(line).map((word) => ({ word, line: index + 1 })),
      );
    const counts = new Map();
    // Bound spans by normalized character length, not a fixed token count:
    // separators may split even a single listed word, including across lines.
    for (let start = 0; start < words.length; start++) {
      let candidate = "";
      for (let end = start; end < words.length; end++) {
        candidate += words[end].word;
        if (candidate.length > maxLength) break;
        if (denied.has(candidate)) {
          const line = words[start].line;
          counts.set(line, (counts.get(line) ?? 0) + 1);
        }
      }
    }
    for (const [line, count] of counts)
      findings.push({ file: name, line, count });
  }
  if (findings.length)
    throw new Error(
      `local-terms list present; refused ${JSON.stringify(findings)}`,
    );
  return { status: "present" };
}
