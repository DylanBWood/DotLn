import { dependencyHeader } from "./dependencies.mjs";

const ID = "[A-Za-z0-9][A-Za-z0-9._-]{0,63}";
const COMMIT = "(?:[0-9a-f]{40}|[0-9a-f]{64})";

/** Parse the optional registered-target field from leading work-order metadata.
 * Absence is the byte-compatible implicit `self` case. */
export const parseRepositoryDeclaration = (markdown, path) => {
  const { lines, first, end } = dependencyHeader(markdown);
  const header = lines.slice(first + 1, end);
  const positions = header.flatMap((line, index) =>
    /^\*\*Repository:\*\*/u.test(line) ? [index] : [],
  );
  if (!positions.length) return undefined;
  if (positions.length !== 1)
    throw new Error(`work order has duplicate **Repository:** lines: ${path}`);
  const line = header[positions[0]];
  const match = new RegExp(
    `^\\*\\*Repository:\\*\\*\\s+(${ID})\\s+@\\s+(${COMMIT})\\s*$`,
    "u",
  ).exec(line);
  if (!match)
    throw new Error(
      `work order has malformed **Repository:** line: ${path}; expected **Repository:** <id> @ <40-or-64-hex-base-commit>`,
    );
  return { id: match[1], baseCommit: match[2] };
};
