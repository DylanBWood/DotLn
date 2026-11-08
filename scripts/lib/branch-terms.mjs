// The local-terms screen over what a branch changes. The document gate's
// `terms` task and the launchpad's publish helpers read the same change: a
// private term in a line the branch adds refuses by file, line and mode, and
// the term never leaves this process. A term already in a line the branch
// left alone was screened when its own branch was, so it is not this one's.
import { lstatSync } from "node:fs";
import { join } from "node:path";
import { addsLine, branchChanges, readChangedText } from "./branch-changes.mjs";
import { localTermFindings } from "./terms.mjs";

/**
 * The branch's changed text files screened against the private list:
 * `{status, files, findings}` with the list's status (`present` or
 * `unavailable`), the count of files read and each finding's file, line
 * range, count and mode. Without a merge base the status says so and nothing
 * is read.
 */
export function branchTermFindings(
  root,
  { changes = branchChanges(root, { lastMergeOnMain: true }) } = {},
) {
  if (!changes.base)
    return {
      status: "no merge base",
      reason: changes.reason,
      files: 0,
      findings: [],
    };
  const surfaces = [];
  for (const path of changes.files.keys()) {
    if (!lstatSync(join(root, path), { throwIfNoEntry: false })?.isFile())
      continue;
    // Binary bytes carry no words to screen; a read failure is an error.
    const text = readChangedText(root, path);
    if (text !== null) surfaces.push({ name: path, text });
  }
  const result = localTermFindings(root, surfaces);
  return {
    status: result.status,
    files: surfaces.length,
    findings: (result.findings ?? []).filter((finding) =>
      addsLine(changes, finding.file, finding.line, finding.endLine),
    ),
  };
}

/** Each finding as the refusal names it: the file, the line or line range
 * and the mode, never the term. */
export const branchTermLines = (findings) =>
  findings.map(
    ({ file, line, endLine, count, mode }) =>
      `${file}:${line}${endLine !== line ? `-${endLine}` : ""}: a local term in ${mode} mode${count > 1 ? `, ${count} matches` : ""}`,
  );
