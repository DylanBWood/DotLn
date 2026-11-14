import { headerField, readWorkOrderHeader } from "./work-order-document.mjs";

const ID = "[A-Za-z0-9][A-Za-z0-9._-]{0,63}";
const COMMIT = "(?:[0-9a-f]{40}|[0-9a-f]{64})";
// What the field's own line holds after its label: a space, the registered
// target's id, `@` and the full base commit, and nothing else.
const DECLARATION = new RegExp(`^\\s+(${ID})\\s+@\\s+(${COMMIT})\\s*$`, "u");

/** Parse the optional registered-target field from leading work-order metadata.
 * Absence is the byte-compatible implicit `self` case. */
export const parseRepositoryDeclaration = (markdown, path) => {
  const field = headerField(
    readWorkOrderHeader(markdown),
    "Repository",
    `work order has duplicate **Repository:** lines: ${path}`,
  );
  if (!field) return undefined;
  const match = DECLARATION.exec(field.lineValue);
  if (!match)
    throw new Error(
      `work order has malformed **Repository:** line: ${path}; expected **Repository:** <id> @ <40-or-64-hex-base-commit>`,
    );
  return { id: match[1], baseCommit: match[2] };
};
