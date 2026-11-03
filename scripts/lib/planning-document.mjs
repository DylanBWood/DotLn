import { docRelative } from "./config.mjs";
import { renderRedTagBlock } from "./document-kinds.mjs";
import { runGit } from "./git.mjs";

/** A pass document is a record of one planning pass: it lives in the
 * planning root's passes directory, named by the branch's slug and date. */
export function planningDocumentPath(
  root,
  branch = runGit(root, ["branch", "--show-current"]),
) {
  const match = /^planning\/(\d{4}-\d{2}-\d{2})-([a-z][a-z0-9-]*)$/.exec(
    branch.trim(),
  );
  return match
    ? docRelative(root, "planning", "passes", `${match[2]}-${match[1]}.md`)
    : null;
}

/** The skeleton `plan start` writes. Its red-tag block names the pass it
 * follows and carries every open tag and this pass's new ones; the pass
 * fills each disposition: removed, or folded into a named standing document,
 * with why. */
export function planningSkeleton(
  slug,
  date,
  { redTags = { after: null, tags: [] } } = {},
) {
  return (
    `# ${slug.replaceAll("-", " ")} — ${date}\n\n` +
    [
      "Dispatch and capture",
      "Readings",
      "Orders filed and amended",
      "Register",
      "Red tags",
      "NoOps",
      "Sequence",
      "Write-backs",
      "Process cost",
      "Validation",
    ]
      .map(
        (heading) =>
          `## ${heading}\n\n${heading === "Red tags" ? `${renderRedTagBlock(redTags)}\n` : ""}`,
      )
      .join("")
  );
}
