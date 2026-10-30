import { docRelative } from "./config.mjs";
import { runGit } from "./git.mjs";

export function planningDocumentPath(
  root,
  branch = runGit(root, ["branch", "--show-current"]),
) {
  const match = /^planning\/(\d{4}-\d{2}-\d{2})-([a-z][a-z0-9-]*)$/.exec(
    branch.trim(),
  );
  return match
    ? docRelative(root, "planning", `${match[2]}-${match[1]}.md`)
    : null;
}

export function planningSkeleton(slug, date) {
  return (
    `# ${slug.replaceAll("-", " ")} — ${date}\n\n` +
    [
      "Dispatch and capture",
      "Readings",
      "Orders filed and amended",
      "Register",
      "NoOps",
      "Sequence",
      "Write-backs and ceilings",
      "Process cost",
      "Validation",
    ]
      .map((heading) => `## ${heading}\n\n`)
      .join("")
  );
}
