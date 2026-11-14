// Area notes: what a session learned about one part of a registered
// repository, kept beside that repository's profile. A note is a Markdown
// file under the directory that has the profile's name without `.md`, and it
// opens with one marked block of JSON naming the target paths it covers and
// the target commit it was written at. The block is the only part a program
// reads: the document check judges its shape and a target order's briefing
// prints it with how far the target has moved since.

import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join, sep } from "node:path";
import { spawnGitLimited } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { markdownMarkerBlocks } from "./markdown-links.mjs";

/** The two marker lines an area note's block stands between. */
export const AREA_NOTE_OPENS = "dotln-area-note:start";
export const AREA_NOTE_CLOSES = "dotln-area-note:end";

const COMMIT = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u;
const UNPRINTABLE = /[\p{Cc}\p{Cf}\u2028\u2029]/u;
/** A path inside the target as a note names it: relative, with forward
 * slashes, no empty, `.` or `..` segment (a directory may end in one slash),
 * nothing Git would read as pathspec magic and no control or format
 * character, since a briefing prints it. */
const targetPath = (value) =>
  typeof value === "string" &&
  value !== "" &&
  !value.startsWith("/") &&
  !value.startsWith(":") &&
  !value.includes("\\") &&
  !UNPRINTABLE.test(value) &&
  (value.endsWith("/") ? value.slice(0, -1) : value)
    .split("/")
    .every((segment) => segment !== "" && segment !== "." && segment !== "..");

/** The two fields of an area note's block and what each holds. */
export const AREA_NOTE_FIELDS = Object.freeze({
  paths: {
    admits: (value) =>
      Array.isArray(value) && value.length > 0 && value.every(targetPath),
    set: "a non-empty list of the target paths the note covers, each relative with forward slashes, no . or .. segment and no control character",
  },
  commit: {
    admits: (value) => typeof value === "string" && COMMIT.test(value),
    set: "the target commit the note was written at, as its full hexadecimal id",
  },
});

/** The directory that holds a profile's area notes: the profile's path
 * without its `.md`, so the directory `<id>/` beside the profile `<id>.md`,
 * wherever the registration places it. A profile of another name, or one whose path
 * leaves the launchpad, has none. */
export const areaNoteDirectory = (profile) =>
  typeof profile === "string" &&
  profile.endsWith(".md") &&
  profile.length > 3 &&
  !profile.split("/").includes("..")
    ? profile.slice(0, -3)
    : null;

/** What a note's text gives: its block's two fields where the block is sound,
 * and otherwise each failure with the line of the block and what is wrong,
 * the field named. Only the block is read; the prose is the reader's. */
export function readAreaNote(text) {
  const names = Object.keys(AREA_NOTE_FIELDS).join(", ");
  // A byte order mark at the file's start is no part of the note.
  while (text.startsWith("\uFEFF")) text = text.slice(1);
  const blocks = markdownMarkerBlocks(text, AREA_NOTE_OPENS, AREA_NOTE_CLOSES);
  const failed = (failures) => ({ paths: null, commit: null, failures });
  if (blocks.length === 0 && !blocks.unbalanced)
    return failed([
      {
        line: 1,
        reason: `no ${AREA_NOTE_OPENS} block, so each field (${names}) is missing`,
      },
    ]);
  if (blocks.length !== 1 || blocks.unbalanced)
    return failed([
      {
        line: blocks[0]?.line ?? 1,
        reason: `expected one block between a ${AREA_NOTE_OPENS} and a ${AREA_NOTE_CLOSES} comment line, so no field (${names}) is read`,
      },
    ]);
  const [block] = blocks;
  let fields;
  try {
    fields = JSON.parse(block.inner);
  } catch {
    // The parser's message may quote the note's text, so it is not printed.
    return failed([
      {
        line: block.line,
        reason: `its block is not JSON, so no field (${names}) is read`,
      },
    ]);
  }
  if (fields === null || typeof fields !== "object" || Array.isArray(fields))
    return failed([
      {
        line: block.line,
        reason: `its block holds no object of ${names}`,
      },
    ]);
  const failures = [];
  for (const name of Object.keys(fields))
    if (!Object.hasOwn(AREA_NOTE_FIELDS, name))
      failures.push({
        line: block.line,
        reason: `field ${name} is not one of ${names}`,
      });
  for (const [name, rule] of Object.entries(AREA_NOTE_FIELDS))
    if (!Object.hasOwn(fields, name))
      failures.push({
        line: block.line,
        reason: `field ${name} is missing; it holds ${rule.set}`,
      });
    else if (!rule.admits(fields[name]))
      failures.push({
        line: block.line,
        reason: `field ${name} is outside its set (${rule.set})`,
      });
  return failures.length
    ? failed(failures)
    : { paths: fields.paths, commit: fields.commit, failures };
}

/** The area notes of a profile as the launchpad at `root` holds them: every
 * regular Markdown file under the directory beside the profile, by path,
 * with what its block gives. A profile without the directory has none, a
 * link in place of a file or of a directory is not followed, and a directory
 * under it that cannot be listed is a failure of its own. The directory is
 * the one of exactly that name, so a volume that folds case lists what a
 * volume that does not would. */
export function areaNotes(root, profile) {
  const directory = areaNoteDirectory(profile);
  if (directory === null) return [];
  const files = [];
  const unlisted = [];
  const visit = (relative) => {
    let entries;
    try {
      if (!lstatSync(join(root, relative)).isDirectory()) return;
    } catch {
      return;
    }
    try {
      entries = readdirSync(join(root, relative), { withFileTypes: true });
    } catch {
      unlisted.push(relative);
      return;
    }
    for (const entry of entries) {
      const path = `${relative}/${entry.name}`;
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
        files.push(path);
    }
  };
  try {
    // A directory reached through a link above it lies outside the
    // launchpad and holds no note of this instance's.
    if (
      !realpathSync(join(root, directory)).startsWith(
        `${realpathSync(root)}${sep}`,
      )
    )
      return [];
    if (
      !readdirSync(join(root, dirname(directory))).includes(basename(directory))
    )
      return [];
  } catch {
    return [];
  }
  visit(directory);
  const unread = (file, reason) => ({
    file,
    paths: null,
    commit: null,
    failures: [{ line: 1, reason }],
  });
  return [
    ...files.map((file) => {
      try {
        return {
          file,
          ...readAreaNote(readFileSync(join(root, file), "utf8")),
        };
      } catch {
        return unread(file, "the note cannot be read");
      }
    }),
    ...unlisted.map((file) =>
      unread(file, "the directory cannot be listed, so its notes are not read"),
    ),
  ].sort((left, right) =>
    left.file < right.file ? -1 : left.file > right.file ? 1 : 0,
  );
}

/** Each failure of the area notes beside a profile, by file, the block's
 * line and the field, as the document check prints it. */
export const areaNoteFailures = (root, profile) =>
  areaNotes(root, profile).flatMap((note) =>
    note.failures.map(
      ({ line, reason }) => `${note.file}:${line}: area note: ${reason}`,
    ),
  );

const isDigit = (character) => character >= "0" && character <= "9";
const read = (clone, args, timeout) =>
  spawnGitLimited(
    ["-C", clone, ...HOST_GIT_READ, "--no-replace-objects", ...args],
    { encoding: "utf8", timeout },
  );

/** The clone, where its own history can answer how many commits touched a
 * path: null for no clone, for a shallow clone, whose history stops short,
 * and for a partial clone, where the answer would fetch from its remote. A
 * briefing counts from what the clone holds and starts no transfer. */
export function countableClone(clone) {
  if (!clone) return null;
  try {
    const shallow = read(
      clone,
      ["rev-parse", "--is-shallow-repository"],
      5_000,
    );
    if (shallow.status !== 0 || shallow.stdout.trim() !== "false") return null;
    // Exit 1 is Git's answer that no such key is set.
    const partial = read(
      clone,
      [
        "config",
        "--get-regexp",
        "^(extensions\\.partialclone|remote\\..*\\.promisor)$",
      ],
      5_000,
    );
    return partial.status === 1 ? clone : null;
  } catch {
    return null;
  }
}

/** How many commits of `revision` in the clone touched a note's paths and
 * are not in the history of the commit the note was written at: what its
 * author had not seen. `unknown` where no clone can answer
 * (`countableClone`), the clone holds no commit of that id (a tree's or a
 * blob's id is none) or lacks the revision, Git does not answer, or the time
 * given is spent. The paths are read literally, so a note's path is never a
 * pattern, and a call that passes its limit is ended with its helpers. */
export function commitsSince(
  clone,
  revision,
  note,
  { timeoutMs = 10_000 } = {},
) {
  if (!clone || !note.commit || !note.paths?.length || timeoutMs <= 0)
    return "unknown";
  let result;
  try {
    result = read(
      clone,
      [
        "--literal-pathspecs",
        "rev-list",
        "--count",
        `${note.commit}^{commit}..${revision}`,
        "--",
        ...note.paths,
      ],
      timeoutMs,
    );
  } catch {
    return "unknown";
  }
  const count = result.stdout?.trim() ?? "";
  return result.status === 0 && count !== "" && [...count].every(isDigit)
    ? Number(count)
    : "unknown";
}
