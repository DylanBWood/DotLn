// The files a branch adds or changes and the lines it touches in each: what
// the document gate's forward-only screens and the publish helpers read. Each
// compares the branch with its merge base with main, so a record written
// before the branch keeps its bytes and is never judged again, and a line a
// branch only moved or left alone is not the branch's.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";

const git = (root, args, options) =>
  runGit(root, [...HOST_GIT_READ, ...args], options);
const nothing = () => "";

// Git still C-quotes a path holding a control character, a backslash or a
// double quote with core.quotePath off; octal escapes are UTF-8 bytes.
const unquote = (value) => {
  if (!value.startsWith('"')) return value;
  const bytes = [];
  const escapes = { n: 10, t: 9, r: 13, b: 8, f: 12, v: 11, a: 7 };
  for (let at = 1; at < value.length - 1; at++) {
    const character = value[at];
    if (character !== "\\") {
      bytes.push(...Buffer.from(character, "utf8"));
      continue;
    }
    const next = value[++at];
    if (/[0-7]/u.test(next)) {
      bytes.push(parseInt(value.slice(at, at + 3), 8));
      at += 2;
    } else bytes.push(escapes[next] ?? next.charCodeAt(0));
  }
  return Buffer.from(bytes).toString("utf8");
};

/**
 * The branch's change: `{ base, files, joins }`, where `files` maps each
 * added or changed path to the set of line numbers the branch adds there, or
 * to null when the whole file is the branch's (an untracked file), and
 * `joins` maps a path to the boundaries its deletions closed: a join `j` sits
 * between lines `j` and `j + 1`, which a deletion made neighbours, so any
 * range spanning it, blank or punctuation-only lines included, is the
 * branch's. Binary files and deleted files are left out; a symlink or a
 * submodule the branch turned into a file (a type change) counts as changed.
 *
 * The base is the merge base of HEAD with `main`, and the working tree is
 * compared with it, so an order's uncommitted work counts; `committed`
 * compares HEAD instead, as a publish carries only commits. On `main` itself
 * the merge base is HEAD, so only uncommitted work counts, unless
 * `lastMergeOnMain` is set: then the base is the first parent of the last
 * merge, so what the last merge brought in counts. Without a commit or a
 * merge base the base is null with the reason, and nothing is judged.
 */
export function branchChanges(
  root,
  { main = "main", lastMergeOnMain = false, committed = false } = {},
) {
  const empty = (reason) => ({ base: null, reason, files: new Map() });
  if (
    !git(root, ["rev-parse", "--verify", "--quiet", "HEAD^{commit}"], {
      onFailure: nothing,
    })
  )
    return empty("no commit yet");
  const branch = git(root, ["symbolic-ref", "--quiet", "--short", "HEAD"], {
    onFailure: nothing,
  });
  let base;
  if (lastMergeOnMain && branch === main) {
    const merge = git(
      root,
      ["rev-list", "--first-parent", "--merges", "-n", "1", "HEAD"],
      { onFailure: nothing },
    );
    base = merge
      ? git(root, ["rev-parse", `${merge}^1`], { onFailure: nothing })
      : git(root, ["rev-parse", "HEAD"]);
  } else base = git(root, ["merge-base", "HEAD", main], { onFailure: nothing });
  if (!base) return empty(`no merge base with ${main}`);
  const files = new Map();
  const joins = new Map();
  const diff = git(
    root,
    [
      "-c",
      "core.quotePath=false",
      "diff",
      "--no-ext-diff",
      "--no-textconv",
      "--no-color",
      "--unified=0",
      "--find-renames",
      "--diff-filter=AMRT",
      "--src-prefix=a/",
      "--dst-prefix=b/",
      base,
      ...(committed ? ["HEAD"] : []),
      "--",
    ],
    { trim: false, maxBuffer: 256 * 1024 * 1024 },
  );
  // A file's header runs from its `diff --git` line to its first hunk; a
  // content line that itself begins with `++ ` is never read as one.
  let path = null;
  let header = false;
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      path = null;
      header = true;
      continue;
    }
    if (header && line.startsWith("+++ ")) {
      // Git ends a header path that holds a space with one tab.
      const name = unquote(line.slice(4).replace(/\t$/u, ""));
      path = name.startsWith("b/") ? name.slice(2) : null;
      if (path && !files.has(path)) files.set(path, new Set());
      continue;
    }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/u.exec(line);
    if (hunk) header = false;
    if (!hunk || !path) continue;
    const start = Number(hunk[1]);
    const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
    // A deletion's hunk names the line before it, which now meets the line
    // after it: a run or a term that boundary joins is the branch's, though
    // no line was added.
    if (!count) {
      if (!joins.has(path)) joins.set(path, new Set());
      joins.get(path).add(start);
    }
    for (let at = start; at < start + count; at++) files.get(path).add(at);
  }
  if (!committed) {
    const untracked = git(
      root,
      ["ls-files", "--others", "--exclude-standard", "-z"],
      { trim: false },
    );
    for (const name of untracked.split("\0")) if (name) files.set(name, null);
  }
  // A changed file with no hunk (a mode change alone) touches nothing.
  for (const [name, lines] of files)
    if (lines !== null && !lines.size && !joins.has(name)) files.delete(name);
  return { base, files, joins };
}

/**
 * A changed file's text, or null when its bytes are not UTF-8 text (an image,
 * an archive), which the screens leave out. A file that cannot be read is an
 * error naming its repository path and the system's code, so no screen
 * passes a file it could not open.
 */
export function readChangedText(root, path) {
  let bytes;
  try {
    bytes = readFileSync(join(root, path));
  } catch (error) {
    throw new Error(
      `${path} cannot be read (${error.code ?? "unreadable"}); the screens read every file a branch changes`,
    );
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Whether lines `start` to `end` of `path` hold a line the branch adds or
 * span a boundary one of its deletions closed. */
export function addsLine(changes, path, start, end = start) {
  const lines = changes.files.get(path);
  if (lines === undefined) return false;
  if (lines === null) return true;
  for (let line = start; line <= end; line++) if (lines.has(line)) return true;
  for (const join of changes.joins?.get(path) ?? [])
    if (start <= join && join < end) return true;
  return false;
}
