import { readFileSync } from "node:fs";
import { join } from "node:path";
import { dependencyHeader } from "./dependencies.mjs";
import { workOrderAuthorityFiles } from "./paths.mjs";

// An order that may change the front page outside its generated blocks says
// so in its leading header, on one line: `**Front page:** README.md`. The
// document check reads this field and nothing in the criteria's prose. The
// value is one or more repository-relative paths separated by commas or
// spaces; absence means the order does not touch the page.
const LABEL = "**Front page:**";
export function frontPageDeclaration(markdown, path) {
  const { lines, first, end } = dependencyHeader(markdown);
  const header = lines.slice(first + 1, end);
  const fields = header.filter((line) => line.startsWith(LABEL));
  if (!fields.length) return null;
  if (fields.length !== 1)
    throw new Error(`work order has duplicate ${LABEL} lines: ${path}`);
  const files = fields[0]
    .slice(LABEL.length)
    .split(/[\s,]+/u)
    .filter(Boolean);
  if (
    !files.length ||
    files.some((file) => !/^[A-Za-z0-9][A-Za-z0-9._/-]*\.md$/u.test(file))
  )
    throw new Error(
      `work order has a malformed ${LABEL} line: ${path}; expected ${LABEL} README.md`,
    );
  return files;
}

// What the current branch's order declares as its front page. `files` is the
// declared list or null, and `reason` is a clause for a refusal that says why
// nothing admits a change: the branch names no order, the order has no single
// authority file, the header carries no field, or the field names other files.
// `read` supplies the authority's text; the document check passes a reader of
// the merge base, so a field added on the branch itself declares nothing.
export function branchFrontPage(
  root,
  branch,
  read = (file) => readFileSync(join(root, file), "utf8"),
) {
  const match = /^wo-(\d{3})$/u.exec(branch ?? "");
  if (!match)
    return {
      workOrderId: null,
      file: null,
      files: null,
      reason: `on branch ${branch || "(detached)"}, which names no work order`,
    };
  const workOrderId = `WO-${match[1]}`;
  const matches = workOrderAuthorityFiles(root).filter((file) =>
    file.split("/").at(-1).startsWith(`${workOrderId}-`),
  );
  if (matches.length !== 1)
    return {
      workOrderId,
      file: null,
      files: null,
      reason: `while ${workOrderId} has ${matches.length ? `${matches.length} authority files` : "no authority file"} in the work-order roots`,
    };
  const [file] = matches;
  const source = read(file);
  if (source === null)
    return {
      workOrderId,
      file,
      files: null,
      reason: `while ${workOrderId}'s authority file is not at the merge base, where the declaration is read`,
    };
  let files;
  try {
    files = frontPageDeclaration(source, file);
  } catch (error) {
    return {
      workOrderId,
      file,
      files: null,
      reason: `while ${workOrderId}'s \`${LABEL}\` field cannot be read: ${error.message}`,
    };
  }
  return {
    workOrderId,
    file,
    files,
    reason:
      files === null
        ? `while ${workOrderId}'s leading header at the merge base declares no \`${LABEL}\` field; the header is read on main, so adding or fixing it on this branch changes nothing, and planning files it there`
        : `while ${workOrderId} declares \`${LABEL} ${files.join(", ")}\``,
  };
}
