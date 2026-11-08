// The document gate's verbatim screen. No operator message is saved verbatim
// in committed text (the operator's rule of 2026-11-07), and the ignored
// captures under the intake root are the one place the operator's bytes exist
// outside the journals, which hold digests only. So every line a branch adds
// to a document or a source file, or joins by a deletion, is compared with the
// captures word for word,
// and a run of the window's length that both share names the file, the line
// and the capture's digest; the words themselves never leave this process.
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { addsLine, readChangedText } from "./branch-changes.mjs";
import { docPath, loadConfig } from "./config.mjs";
import { runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { localTermTokens as words } from "./terms.mjs";

/**
 * The window: a run of this many consecutive words shared with a capture is a
 * copy. Measured on 2026-11-08 over the lines the last six merges added
 * against this repository's 540 text captures: of the runs not already in the
 * repository at the base, 66 lines matched at 8 words, 27 at 10 and 15 at 12,
 * where the 12-word runs were technical passages carried from pasted blocks.
 * A run this long does not happen by chance (WO-259's decisions record the
 * reading).
 */
export const VERBATIM_WINDOW = 12;

// Images, archives and media are never words; the rest is read when it
// decodes as UTF-8.
const BINARY =
  /\.(?:png|jpe?g|gif|webp|heic|bmp|tiff?|ico|pdf|zip|gz|tgz|bz2|xz|7z|mov|mp4|m4a|mp3|wav|woff2?|ttf|otf|sqlite|db)$/iu;

/** Every file under the intake root that could hold words: links, directory
 * loops and media are left out. Reading and decoding wait until the screen
 * has something to compare, one capture at a time. An absent intake root has
 * no captures; one the screen cannot list is an error, never a pass. A
 * directory below it that cannot be listed is private material its owner
 * closed, which never fails the document check (the private roots' rule): it
 * is named in `unread`, never passed over in silence. */
export function capturePaths(root, unread = []) {
  const paths = [];
  const intake = docPath(root, "intake");
  const walk = (directory) => {
    let names;
    try {
      names = readdirSync(directory).sort();
    } catch (error) {
      const listed = `${relative(root, directory) || "."} cannot be listed (${error.code ?? "unreadable"})`;
      if (directory !== intake) {
        unread.push(
          `${listed}; the verbatim screen did not read the captures under it`,
        );
        return;
      }
      if (error.code === "ENOENT") return;
      throw new Error(`${listed}; the verbatim screen reads every capture`);
    }
    for (const name of names) {
      const path = join(directory, name);
      const stat = lstatSync(path, { throwIfNoEntry: false });
      if (stat?.isDirectory()) walk(path);
      else if (stat?.isFile() && !BINARY.test(name) && stat.size)
        paths.push(path);
    }
  };
  walk(docPath(root, "intake"));
  return paths;
}

/** One capture's digest and words, or null when it does not decode as UTF-8
 * text or holds no words. A capture that cannot be read is named, by its path
 * as `display` gives it, in `unread` when the caller keeps that list, as an
 * unlistable directory below the intake root is, and is otherwise an error. */
export function readCapture(path, display = path, unread) {
  let bytes;
  try {
    bytes = readFileSync(path);
  } catch (error) {
    const reason = `${display} cannot be read (${error.code ?? "unreadable"})`;
    if (!unread)
      throw new Error(`${reason}; the verbatim screen reads every capture`);
    unread.push(`${reason}; the verbatim screen did not read it`);
    return null;
  }
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
  const tokens = words(text);
  return tokens.length
    ? {
        digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
        words: tokens,
      }
    : null;
}

const inside = (parent, child) =>
  child === parent || child.startsWith(`${parent}${sep}`);

/** What the screen reads: Markdown under the document roots or at the
 * repository root, and source under scripts/ and packages' src/. The intake
 * root and the local lane are never committed and never screened. */
export function verbatimScope(root) {
  const roots = Object.values(loadConfig(root).roots).map((path) =>
    resolve(root, path),
  );
  const private_ = [docPath(root, "intake"), docPath(root, "control", "local")];
  return (path) => {
    const absolute = resolve(root, path);
    if (private_.some((directory) => inside(directory, absolute))) return false;
    if (path.endsWith(".md"))
      return (
        dirname(path) === "." ||
        roots.some((directory) => inside(directory, absolute))
      );
    return /^(?:scripts\/|packages\/[^/]+\/src\/)/u.test(path);
  };
}

const key = (tokens) => tokens.join(" ");

// Two 32-bit polynomial hashes of a window of word ids, folded into one
// number below 2^53, so a window is looked up without building its text.
const hashWindow = (ids, start, window) => {
  let first = 0;
  let second = 0;
  for (let at = start; at < start + window; at++) {
    first = (Math.imul(first, 0x01000193) + ids[at]) | 0;
    second = (Math.imul(second, 0x5bd1e995) + ids[at] + 1) | 0;
  }
  return (first >>> 0) * 0x100000 + ((second >>> 12) & 0xfffff);
};
const sameWindow = (left, leftStart, right, rightStart, window) => {
  for (let at = 0; at < window; at++)
    if (left[leftStart + at] !== right[rightStart + at]) return false;
  return true;
};

/** One line's words, each tagged with the captures whose requested
 * quotation spans hold it: a quotation's span (columns of its JSON string on
 * that line) is cut out and tokenized apart, so a span's edge, a quote
 * character, never splits a word. */
function lineWords(text, line, spans) {
  if (!spans.length)
    return words(text).map((word) => ({ word, line, quoted: [] }));
  const located = [];
  let at = 0;
  for (const span of [...spans].sort((a, b) => a.start - b.start)) {
    for (const word of words(text.slice(at, span.start)))
      located.push({ word, line, quoted: [] });
    for (const word of words(text.slice(span.start, span.end)))
      located.push({ word, line, quoted: [span.captureSha256] });
    at = Math.max(at, span.end);
  }
  for (const word of words(text.slice(at)))
    located.push({ word, line, quoted: [] });
  return located;
}

/** The windows of the lines a branch touches in each screened file, by the
 * hash of their word ids, and the ids of every word they hold. A window whose
 * every word lies inside one requested quotation carries that quotation's
 * capture digest. */
function branchWindows(root, changes, scope, window, quotes) {
  const ids = new Map();
  const windows = new Map();
  let screened = 0;
  for (const [path, added] of changes.files) {
    if (!scope(path)) continue;
    if (!lstatSync(join(root, path), { throwIfNoEntry: false })?.isFile())
      continue;
    const text = readChangedText(root, path);
    if (text === null) continue;
    screened++;
    const spans = quotes.get(path) ?? [];
    const located = text.split("\n").flatMap((line, index) =>
      lineWords(
        line,
        index + 1,
        spans.filter((span) => span.line === index + 1),
      ),
    );
    const sequence = Int32Array.from(located, ({ word }) => {
      if (!ids.has(word)) ids.set(word, ids.size);
      return ids.get(word);
    });
    for (let start = 0; start + window <= located.length; start++) {
      // A run counts only when it spans a line this branch adds or a
      // boundary its deletion closed; it is named by its first word on an
      // added line, else by its first word.
      const first = located[start].line;
      if (!addsLine(changes, path, first, located[start + window - 1].line))
        continue;
      let line = first;
      if (added !== null)
        for (let at = start; at < start + window; at++)
          if (added.has(located[at].line)) {
            line = located[at].line;
            break;
          }
      const hash = hashWindow(sequence, start, window);
      if (!windows.has(hash)) windows.set(hash, []);
      const quoted = located[start].quoted.filter((digest) =>
        located
          .slice(start, start + window)
          .every((word) => word.quoted.includes(digest)),
      );
      windows.get(hash).push({ sequence, start, located, path, line, quoted });
    }
  }
  return { ids, windows, screened };
}

/** The runs the repository already held at the base: a capture that quotes
 * the repository's own text (a pasted section, an error message, a command)
 * does not make that text the operator's. Only the files at the base that
 * hold each run's eight longest words together are read, smallest first and
 * a few at a time, until every run is found. */
function baseRuns(root, base, runs) {
  if (!runs.length) return new Set();
  const signatures = new Map();
  for (const run of runs) {
    const longest = [...new Set(run.split(" "))]
      .sort((a, b) => b.length - a.length || a.localeCompare(b))
      .slice(0, 8);
    signatures.set(longest.join(" "), longest);
  }
  const listed = new Set();
  for (const longest of signatures.values())
    for (const entry of runGit(
      root,
      [
        ...HOST_GIT_READ,
        "grep",
        "-l",
        "-z",
        "-I",
        "-F",
        "-i",
        "--all-match",
        ...longest.flatMap((word) => ["-e", word]),
        base,
        "--",
      ],
      { trim: false, maxBuffer: 64 * 1024 * 1024, onFailure: () => "" },
    ).split("\0"))
      // git grep names each file as <tree>:<path>.
      if (entry) listed.add(entry.slice(entry.indexOf(":") + 1));
  const found = new Set();
  if (!listed.size) return found;
  // Each wanted run by the hash of its word ids; a base file's words are
  // compared through the same ids, and the scan ends once every run is found.
  const ids = new Map();
  const targets = new Map();
  for (const run of runs) {
    const sequence = Int32Array.from(run.split(" "), (word) => {
      if (!ids.has(word)) ids.set(word, ids.size);
      return ids.get(word);
    });
    const hash = hashWindow(sequence, 0, sequence.length);
    if (!targets.has(hash)) targets.set(hash, []);
    targets.get(hash).push({ sequence, run });
  }
  const window = runs[0].split(" ").length;
  const objects = (input, check) =>
    runGit(
      root,
      [...HOST_GIT_READ, "cat-file", check ? "--batch-check" : "--batch"],
      {
        raw: true,
        input: input.join("\n") + "\n",
        maxBuffer: check ? 64 * 1024 * 1024 : 256 * 1024 * 1024,
      },
    ).stdout ?? Buffer.alloc(0);
  const names = [...listed].map((path) => `${base}:${path}`);
  const sized = objects(names, true)
    .toString("utf8")
    .split("\n")
    .map((line, index) => ({
      name: names[index],
      size: Number(line.split(" ")[2]),
    }))
    .filter((row) => row.name && Number.isSafeInteger(row.size))
    .sort((a, b) => a.size - b.size);
  const scan = (body) => {
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    } catch {
      return;
    }
    const sequence = Int32Array.from(
      words(text),
      (word) => ids.get(word) ?? -1,
    );
    let streak = 0;
    for (let position = 0; position < sequence.length; position++) {
      streak = sequence[position] >= 0 ? streak + 1 : 0;
      if (streak < window) continue;
      const start = position - window + 1;
      for (const target of targets.get(hashWindow(sequence, start, window)) ??
        [])
        if (sameWindow(target.sequence, 0, sequence, start, window))
          found.add(target.run);
    }
  };
  // Batches of about 8 MiB keep memory bounded whatever the candidates hold.
  for (let next = 0; next < sized.length && found.size < runs.length;) {
    const batch = [];
    for (
      let bytes = 0;
      next < sized.length && (!batch.length || bytes < 8 * 1024 * 1024);
      next++
    ) {
      batch.push(sized[next].name);
      bytes += sized[next].size;
    }
    const output = objects(batch, false);
    for (let at = 0; at < output.length;) {
      const end = output.indexOf(10, at);
      if (end < 0) break;
      const header = output.subarray(at, end).toString("utf8").split(" ");
      if (header[1] === "missing") {
        at = end + 1;
        continue;
      }
      const size = Number(header[2]);
      scan(output.subarray(end + 1, end + 1 + size));
      at = end + 1 + size + 1;
    }
  }
  return found;
}

/**
 * Screen the branch's change against the captures. `quotes` maps a file to
 * the typed quotations its records carry that the operator asked to save
 * (`{captureSha256, line, start, end}`, the source span of each quotation's
 * text value): a run wholly inside such a span, from that very capture, is the
 * exception and not a finding.
 * `captures` may be given as `{digest, words}` rows; by default each file
 * under the intake root is read in turn.
 *
 * Returns `{status: "no captures"}`, `{status: "no merge base", reason}` or
 * `{status: "screened", window, captures, files, findings}`, each finding a
 * file, a line and a capture digest, and each result with `unread`, the
 * entries below the intake root the screen could not read.
 */
export function verbatimScreen(
  root,
  {
    changes,
    captures,
    window = VERBATIM_WINDOW,
    scope = verbatimScope(root),
    quotes = new Map(),
  },
) {
  // Private entries the screen could not read, each named for an advisory.
  const unread = [];
  const paths = captures ? null : capturePaths(root, unread);
  if (captures ? !captures.length : !paths.length)
    return { status: "no captures", unread };
  if (!changes.base)
    return { status: "no merge base", reason: changes.reason, unread };
  const { ids, windows, screened } = branchWindows(
    root,
    changes,
    scope,
    window,
    quotes,
  );
  // Each run's text, the places it was added and the captures that hold it.
  const matched = new Map();
  let read = 0;
  const each =
    captures ??
    (function* () {
      for (const path of paths)
        yield readCapture(path, relative(root, path), unread);
    })();
  for (const capture of each) {
    if (!capture) continue;
    read++;
    // A word the branch never added breaks every run through it.
    const sequence = Int32Array.from(
      capture.words,
      (word) => ids.get(word) ?? -1,
    );
    let streak = 0;
    for (let at = 0; at < sequence.length; at++) {
      streak = sequence[at] >= 0 ? streak + 1 : 0;
      if (streak < window) continue;
      const start = at - window + 1;
      for (const entry of windows.get(hashWindow(sequence, start, window)) ??
        []) {
        if (!sameWindow(entry.sequence, entry.start, sequence, start, window))
          continue;
        const run = key(
          entry.located
            .slice(entry.start, entry.start + window)
            .map(({ word }) => word),
        );
        if (!matched.has(run))
          matched.set(run, { places: [], digests: new Set() });
        const row = matched.get(run);
        // Each occurrence keeps the captures whose requested quotation holds
        // every word of it, its exception.
        const quoted = entry.quoted.join(" ");
        if (
          !row.places.some(
            (place) =>
              place.path === entry.path &&
              place.line === entry.line &&
              place.quoted.join(" ") === quoted,
          )
        )
          row.places.push({
            path: entry.path,
            line: entry.line,
            quoted: entry.quoted,
          });
        row.digests.add(capture.digest);
      }
    }
  }
  if (!read) return { status: "no captures", unread };
  const inBase = baseRuns(root, changes.base, [...matched.keys()]);
  const findings = new Map();
  for (const [run, { places, digests }] of matched) {
    if (inBase.has(run)) continue;
    for (const { path, line, quoted } of places)
      for (const digest of digests) {
        // The exception: an occurrence wholly inside a quotation of that very
        // capture, which the operator asked to save.
        if (quoted.includes(digest)) continue;
        findings.set(`${path}\0${line}\0${digest}`, {
          file: path,
          line,
          capture: digest,
        });
      }
  }
  // Adjacent lines of one run against one capture are one finding, named by
  // the run's first line, in file and line order.
  const ordered = [...findings.values()].sort(
    (a, b) =>
      a.file.localeCompare(b.file) ||
      a.capture.localeCompare(b.capture) ||
      a.line - b.line,
  );
  const kept = [];
  let last = null;
  for (const finding of ordered) {
    if (
      last &&
      last.file === finding.file &&
      last.capture === finding.capture &&
      finding.line - last.lastLine <= 1
    ) {
      last.lastLine = finding.line;
      continue;
    }
    last = { ...finding, lastLine: finding.line };
    kept.push(last);
  }
  return {
    status: "screened",
    window,
    captures: read,
    files: screened,
    findings: kept
      .map(({ lastLine, ...finding }) => finding)
      .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line),
    unread,
  };
}
