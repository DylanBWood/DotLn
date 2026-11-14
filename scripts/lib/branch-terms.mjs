// The local-terms screen over what a branch changes. The document gate's
// `terms` task and the launchpad's publish helpers read the same change: a
// refuse-mode term in a line the branch adds refuses by file, line and mode,
// a context-mode term is listed by file and line for the stage to read, and
// the term never leaves this process. A term already in a line the branch
// left alone was screened when its own branch was, so it is not this one's.
import { lstatSync } from "node:fs";
import { join } from "node:path";
import {
  addsLine,
  branchChanges,
  readChangedText,
  readCommittedText,
} from "./branch-changes.mjs";
import { localTermFindings, localTermLine } from "./terms.mjs";
import { provenVendoredBytes } from "./vendored-parser.mjs";

/**
 * The branch's changed text files screened against the private list:
 * `{status, terms, refuse, context, files, findings}` with the list's status
 * (`present` or `unavailable`), its entries in all and in each class, the
 * count of files read and each finding's file, line range, count and mode.
 * Without a merge base the status says so and nothing is read. A change
 * computed over commits (a publish's) is read from HEAD, the bytes the
 * publish carries; a change that counts uncommitted work is read from the
 * working tree.
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
    if (
      !changes.committed &&
      !lstatSync(join(root, path), { throwIfNoEntry: false })?.isFile()
    )
      continue;
    // Binary bytes carry no words to screen; a read failure is an error.
    const text = changes.committed
      ? readCommittedText(root, path)
      : readChangedText(root, path);
    // The proven copy of the pinned parser is left out by its bytes, as the
    // subject holds them; a copy changed by a byte is screened as any file.
    if (
      text !== null &&
      !provenVendoredBytes(root, path, Buffer.from(text, "utf8"))
    )
      surfaces.push({ name: path, text });
  }
  const result = localTermFindings(root, surfaces);
  return {
    ...result,
    files: surfaces.length,
    findings: (result.findings ?? []).filter((finding) =>
      addsLine(changes, finding.file, finding.line, finding.endLine),
    ),
  };
}

/** Each finding as a screen names it: the file, the line or line range and
 * the mode, never the term. */
export const branchTermLines = (findings) => findings.map(localTermLine);

/** A branch screen's findings by class: what refuses, and what a stage reads. */
export const branchTermClasses = (findings) => ({
  refused: findings.filter((finding) => finding.mode === "refuse"),
  context: findings.filter((finding) => finding.mode === "context"),
});
