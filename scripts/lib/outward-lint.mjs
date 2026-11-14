import { decodeCharacterReferences, parseMarkdown } from "./markdown-links.mjs";

export const outwardArtifactKinds = Object.freeze([
  "branch",
  "commit",
  "pr-title",
  "pr-body",
  "release-body",
]);
export const subjectLengthLimit = 72;
// The conventional commit types, for a repository with no vocabulary file.
export const conventionalTypes = Object.freeze([
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
]);
// One finding as a refusal or review line names it: the subject's measured
// length, the launchpad identifier as written, the listed review word, or the
// private term's mode (never the term).
export const outwardFindingText = (finding, text) => {
  if (finding.rule === "subject.length")
    return `${finding.rule}: ${[...text.split(/\r\n|\n|\r/u)[0]].length} of ${subjectLengthLimit} characters`;
  if (finding.rule === "identifier.launchpad")
    return `${finding.rule}: ${text.slice(finding.span.start, finding.span.end)}`;
  if (finding.rule === "vocabulary.review")
    return `${finding.rule}: ${finding.term}`;
  if (finding.rule === "vocabulary.local")
    return `${finding.rule}: ${finding.mode}`;
  // A malformed or unreadable list: the terms check names the list's line.
  if (finding.rule === "local-terms.configuration")
    return `${finding.rule}: the local-terms list could not be read; npm run terms -- check <path> names the line`;
  return finding.rule;
};
export const runtimeIdentifierForms = Object.freeze([
  "source-event:",
  "baseline-event:",
  "review-event:",
  "verification:",
  "contract:",
  "delivery-preparation#",
  "evt_<digits>",
]);
const runtimeIdentifiers =
  /(?<![\p{L}\p{N}_-])(?:(?:source-event:|baseline-event:|review-event:|verification:|contract:)(?=[\p{L}\p{N}_-])|delivery-preparation#|evt_[0-9]+(?![\p{L}\p{N}_-]))/gu;
// The launchpad's own identifiers, refused in a target's outward artifacts:
// whole tokens on the folded view. A letter, digit or underscore on
// either side makes another word; a hyphen or a path separator does not, so
// `notes/wo-006-notes.md` and `fix/handle-wo-006` carry the identifier.
export const launchpadIdentifierForms = Object.freeze([
  "WO-NNN",
  "WO-NNN-DNNN",
  "FUP-<16 hex>",
  "VER-NNN",
  "FINAL-NNN",
  "REVIEW-NNN",
  "WS-NNN",
]);
const launchpadIdentifiers =
  /(?<![\p{L}\p{N}_])(?:wo-[0-9]{3}(?:-d[0-9]{3})?|fup-[0-9a-f]{16}|ver-[0-9]{3}|final-[0-9]{3}|review-[0-9]{3}|ws-[0-9]{3})(?![\p{L}\p{N}_])/gu;

const normalized = (text) => text.normalize("NFKC").toLocaleLowerCase("en-US");
const termKey = (text) =>
  (normalized(text).match(/[\p{L}\p{N}]+/gu) ?? []).join("");

const validTerms = (terms) =>
  Array.isArray(terms) &&
  terms.every((term) => typeof term === "string" && termKey(term));
/** The vocabulary file's shape: nonempty conventional types and the review
 * word list, `reviewTerms`, which may be empty. `terms`, the key WO-063
 * wrote, is read as the same list for one kit release, because an instance
 * cannot migrate a JSON key through a kit action; a file carrying both keys
 * refuses. Returns the normalized vocabulary with its advisories. */
export function validateOutwardVocabulary(vocabulary) {
  if (
    vocabulary === null ||
    typeof vocabulary !== "object" ||
    Array.isArray(vocabulary) ||
    !Array.isArray(vocabulary.types) ||
    !vocabulary.types.length ||
    vocabulary.types.some(
      (type) => typeof type !== "string" || !/^[a-z]+$/.test(type),
    )
  )
    throw new Error("invalid outward vocabulary: require nonempty types");
  const legacy = Object.hasOwn(vocabulary, "terms");
  const current = Object.hasOwn(vocabulary, "reviewTerms");
  if (legacy && current)
    throw new Error(
      "invalid outward vocabulary: terms and reviewTerms are both present; keep reviewTerms",
    );
  if (!legacy && !current)
    throw new Error(
      "invalid outward vocabulary: require reviewTerms, an array of words that may be empty",
    );
  const reviewTerms = current ? vocabulary.reviewTerms : vocabulary.terms;
  if (!validTerms(reviewTerms))
    throw new Error(
      `invalid outward vocabulary: ${current ? "reviewTerms" : "terms"} must be an array of words`,
    );
  return {
    types: vocabulary.types,
    reviewTerms,
    advisories: legacy
      ? [
          "outward-vocabulary: terms is read as reviewTerms for this kit release; rename the key",
        ]
      : [],
  };
}

// NFKC expansions retain offsets in the original UTF-16 string. The matcher
// joins whole tokens, including across separators/lines, never substrings.
const foldedWithOffsets = (units) => {
  let folded = "";
  const positions = [];
  for (const { start, end, value } of units) {
    const normal = normalized(value);
    folded += normal;
    for (let index = 0; index < normal.length; index++)
      positions.push({ start, end });
  }
  return { folded, positions };
};
// Each code point of text[from, to) as a unit that shows itself.
const characterUnits = (text, from = 0, to = text.length) =>
  [...text.slice(from, to).matchAll(/[\s\S]/gu)].map((match) => ({
    start: from + match.index,
    end: from + match.index + match[0].length,
    value: match[0],
  }));

// What a reader sees of a body once GitHub renders it, read from the
// repository's Markdown parser, unit by unit with the source range each came
// from, so a finding's span lands on what was written. Text shows the
// characters the parser decodes: a character reference or a backslash escape
// shows the character it stands for. Code spans and fenced or indented code
// show their bytes as written, references and escapes included, because
// GitHub renders code literally. A raw HTML block shows what a browser shows:
// its tags, comments, processing instructions, declarations and CDATA show
// nothing and its character references decode, while Markdown means nothing
// inside it. Inline raw HTML, a link's brackets and its destination or label,
// emphasis, strikethrough and code-span delimiters, images and link
// reference definitions show nothing. The markers and line endings between
// blocks show as written, so they still part the words on either side.

// HTML inside a raw HTML block, each construct read where it starts. A tag's
// whitespace may hold one line ending; an attribute value may be quoted and
// then holds any character but its quote.
const lineEnding = String.raw`(?:\r\n|\n|\r)`;
const htmlSpace = String.raw`[ \t]*(?:${lineEnding}[ \t]*)?`;
const htmlSomeSpace = String.raw`(?:[ \t]+(?:${lineEnding}[ \t]*)?|${lineEnding}[ \t]*)`;
const htmlAttribute = String.raw`${htmlSomeSpace}[a-z_:][a-z0-9_.:-]*(?:${htmlSpace}=${htmlSpace}(?:[^"'=<>\x60\x00-\x20]+|'[^']*'|"[^"]*"))?`;
// Every pattern is sticky: it matches only at the scan position.
const html = Object.freeze({
  emptyComment: /<!---?>/y,
  declaration: /<![a-z]/iy,
  openTag: new RegExp(
    String.raw`<[a-z][a-z0-9-]*(?:${htmlAttribute})*${htmlSpace}\/?>`,
    "iy",
  ),
  closeTag: new RegExp(String.raw`<\/[a-z][a-z0-9-]*${htmlSpace}>`, "iy"),
  // At most six hex or seven decimal digits; a longer numeric reference
  // shows as written.
  reference: /&(?:#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]*);/iy,
});
// Raw HTML sections and the text that closes each.
const rawSections = [
  ["<!--", "-->"],
  ["<?", "?>"],
  ["<![CDATA[", "]]>"],
];
const read = (pattern, text, at) => {
  pattern.lastIndex = at;
  return pattern.exec(text);
};
// The character reference at `at`, with what it stands for, or undefined.
const referenceAt = (text, at) => {
  const reference = read(html.reference, text, at);
  if (!reference) return undefined;
  const value = decodeCharacterReferences(reference[0]);
  return value === reference[0]
    ? undefined
    : { end: at + reference[0].length, value };
};
// The units of text[from, to) inside a raw HTML block: each construct closes
// within the block or shows as written. Each closer is found by a forward
// search from a position that only grows, so the scan stays bounded.
const htmlBlockUnits = (text, from, to) => {
  const units = [];
  const closers = new Map();
  const nextIndex = (closer, at) => {
    const found = closers.get(closer);
    if (found === -1 || found >= at) return found;
    closers.set(closer, text.indexOf(closer, at));
    return closers.get(closer);
  };
  const markupEnd = (at) => {
    if (text[at] !== "<") return -1;
    const empty = read(html.emptyComment, text, at);
    if (empty) return at + empty[0].length;
    const section =
      rawSections.find(([opener]) => text.startsWith(opener, at)) ??
      (read(html.declaration, text, at) && ["<!", ">"]);
    if (section) {
      const close = nextIndex(section[1], at + section[0].length);
      const end = close + section[1].length;
      return close !== -1 && end <= to ? end : -1;
    }
    const tag = read(html.openTag, text, at) ?? read(html.closeTag, text, at);
    return tag && at + tag[0].length <= to ? at + tag[0].length : -1;
  };
  for (let at = from; at < to;) {
    const markup = markupEnd(at);
    if (markup !== -1) {
      at = markup;
      continue;
    }
    const reference = referenceAt(text, at);
    if (reference && reference.end <= to) {
      units.push({ start: at, end: reference.end, value: reference.value });
      at = reference.end;
      continue;
    }
    const character = String.fromCodePoint(text.codePointAt(at));
    units.push({ start: at, end: at + character.length, value: character });
    at += character.length;
  }
  return units;
};
// The units of a node whose value the parser derived from text[from, to):
// a character the value keeps maps to itself, a backslash escape or a
// character reference (where `decoded`) to the character it stands for, and
// the container markers, indentation and delimiters the value leaves out show
// nothing. A table cell's escaped pipe is a pipe even in code. Should the
// value ever part from its source, the rest of the source shows as written.
const ESCAPABLE = /^[!-/:-@[-`{-~]$/u;
const OMITTED = new Set([" ", "\t", "\r", "\n", ">", "`"]);
const alignedUnits = (text, from, to, value, decoded) => {
  const units = [];
  let at = from;
  for (let index = 0; index < value.length;) {
    const character = String.fromCodePoint(value.codePointAt(index));
    if (
      text[at] === "\\" &&
      text[at + 1] === character &&
      (character === "|" || (decoded && ESCAPABLE.test(character)))
    ) {
      units.push({ start: at, end: at + 2, value: character });
      at += 2;
      index += 1;
      continue;
    }
    const reference = decoded && text[at] === "&" && referenceAt(text, at);
    if (
      reference &&
      reference.end <= to &&
      value.startsWith(reference.value, index)
    ) {
      units.push({ start: at, end: reference.end, value: reference.value });
      at = reference.end;
      index += reference.value.length;
      continue;
    }
    if (text.startsWith(character, at) && at < to) {
      units.push({ start: at, end: at + character.length, value: character });
      at += character.length;
      index += character.length;
      continue;
    }
    if (at < to && OMITTED.has(text[at])) {
      at += 1;
      continue;
    }
    return [...units, ...characterUnits(text, at, to)];
  }
  return units;
};
// Inline nodes whose own delimiters, destination or label show nothing.
const INLINE_WRAPPERS = new Set([
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference",
]);
// Nodes whose children are inline, where raw HTML is inline HTML.
const INLINE_PARENTS = new Set([
  "paragraph",
  "heading",
  "tableCell",
  ...INLINE_WRAPPERS,
]);
const HIDDEN = new Set(["definition", "image", "imageReference"]);
// The rendered units of a body, with offsets in the body itself.
const renderedUnits = (text) => {
  // The parser's offsets count from after a leading byte-order mark, which
  // shows as written.
  const bom = text.startsWith("﻿") ? 1 : 0;
  const units = characterUnits(text, 0, bom);
  const add = (more) => {
    for (const unit of more) units.push(unit);
  };
  const visit = (node, parent) => {
    const from = bom + node.position.start.offset;
    const to = bom + node.position.end.offset;
    if (HIDDEN.has(node.type)) return;
    if (node.type === "text" || node.type === "inlineCode")
      return add(
        alignedUnits(text, from, to, node.value, node.type === "text"),
      );
    if (node.type === "html")
      return INLINE_PARENTS.has(parent?.type)
        ? undefined
        : add(htmlBlockUnits(text, from, to));
    // Between a block's children stand its markers and line endings; an
    // inline wrapper shows its children alone, so a link with no text shows
    // nothing.
    const between = !INLINE_WRAPPERS.has(node.type);
    if (node.type === "code" || (between && !node.children?.length))
      return add(characterUnits(text, from, to));
    let at = from;
    for (const child of node.children) {
      if (between)
        add(characterUnits(text, at, bom + child.position.start.offset));
      visit(child, node);
      at = bom + child.position.end.offset;
    }
    if (between) add(characterUnits(text, at, to));
  };
  visit(parseMarkdown(text.slice(bom)), null);
  return units;
};
const wordsWithOffsets = ({ folded, positions }) =>
  [...folded.matchAll(/[\p{L}\p{N}]+/gu)].map((match) => ({
    word: match[0],
    start: positions[match.index].start,
    end: positions[match.index + match[0].length - 1].end,
  }));

// Listed words as whole-token joins over the folded words: a term may be
// split by separators or lines, never matched inside a longer word.
const termMatches = (words, listed) => {
  const terms = new Map(listed.map((term) => [termKey(term), term]));
  const maxLength = Math.max(0, ...[...terms.keys()].map((key) => key.length));
  const matches = [];
  for (let start = 0; start < words.length && maxLength; start++) {
    let candidate = "";
    for (let end = start; end < words.length; end++) {
      candidate += words[end].word;
      if (candidate.length > maxLength) break;
      if (terms.has(candidate))
        matches.push({
          term: terms.get(candidate),
          start: words[start].start,
          end: words[end].end,
        });
    }
  }
  return matches;
};
const patternSpans = (view, pattern) =>
  [...view.folded.matchAll(pattern)].map((match) => [
    view.positions[match.index].start,
    view.positions[match.index + match[0].length - 1].end,
  ]);
/** The listed review words in `text` as written, each with its source span;
 * planning reads a target order's named paths through this matcher. */
export const matchReviewTerms = (text, reviewTerms) =>
  termMatches(
    wordsWithOffsets(foldedWithOffsets(characterUnits(text))),
    reviewTerms,
  );
/** The launchpad identifiers in `text` as written, each with its span. */
export const matchLaunchpadIdentifiers = (text) =>
  patternSpans(
    foldedWithOffsets(characterUnits(text)),
    launchpadIdentifiers,
  ).map(([start, end]) => ({ identifier: text.slice(start, end), start, end }));

const formatRules = /^(?:subject|commit|title|branch|text)\./u;
const localStatuses = ["present", "unavailable", "refused", "review", "error"];
// The private list's modes, as terms.mjs defines them; this module does not
// import terms.mjs, so the evidence import closure that holds terms.mjs stays
// free of the lint.
const localTermModes = Object.freeze(["refuse", "context"]);
/** A review item is read by the reviewer and never refuses by itself: a
 * listed review word, or a match of a context-mode private term. */
export const isReviewFinding = (finding) =>
  finding.rule === "vocabulary.review" ||
  (finding.rule === "vocabulary.local" && finding.mode === "context");

/** Pure: no filesystem, environment, Git, clock or remote effects per call.
 * localTerms is the adapter's redacted observation, never the private list.
 * Each private finding carries its inclusive line/endLine range; an unknown
 * endpoint refuses instead of being treated as a single-line match.
 * Offsets are zero-based UTF-16 [start,end); lines/columns are one-based.
 * `target` judges the artifact as a target publication's, where launchpad
 * identifiers are refused; `sections` label each finding with the composed
 * body's part it starts in and may exempt a rule for a finding lying wholly
 * in parts the kit itself writes; `exempt` spans drop review-word findings
 * they contain, which is how a registered display name reads as a name. */
export function lintOutwardArtifact({
  kind,
  text,
  vocabulary,
  localTerms = { status: "unavailable" },
  target = false,
  sections,
  exempt = [],
}) {
  if (!outwardArtifactKinds.includes(kind) || typeof text !== "string")
    throw new Error("require an outward artifact kind and string text");
  const { types, reviewTerms, advisories } =
    validateOutwardVocabulary(vocabulary);
  const lines = text.split(/\r\n|\n|\r/);
  const starts = [0];
  for (const match of text.matchAll(/\r\n|\n|\r/g))
    starts.push(match.index + match[0].length);
  const span = (start, end, precision = "exact") => {
    const line = starts.findLastIndex((offset) => offset <= start);
    return {
      start,
      end,
      line: line + 1,
      column: start - starts[line] + 1,
      precision,
    };
  };
  const collected = [];
  const add = (rule, start, end, extra = {}) =>
    collected.push({ rule, span: span(start, end), ...extra });
  const subject = lines[0];

  if (kind === "commit" || kind === "pr-title") {
    // One leading gitmoji, in its Unicode form or its `:shortcode:` form as
    // core's own titles spell it, precedes the conventional type. A
    // pull-request title may stop at the gitmoji and a subject, the form
    // core's own titles take; a commit always keeps its type.
    const emoji =
      /^(?:\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*|:[a-z0-9_+-]+:) /u.exec(
        subject,
      )?.[0] ?? "";
    const rest = subject.slice(emoji.length);
    if (!(kind === "pr-title" && emoji && /^\S(?:.*\S)?$/u.test(rest))) {
      const match =
        /^([a-z]+)(?:\(([a-z0-9][a-z0-9._/-]*)\))?(!)?: (\S(?:.*\S)?)$/u.exec(
          rest,
        );
      if (!match) add("subject.shape", 0, subject.length);
      else if (!types.includes(match[1]))
        add("subject.type", emoji.length, emoji.length + match[1].length);
    }
    // The limit is a commit subject's. A title is sized by its content, so
    // the titles core merges, well past this limit, pass as written.
    if (kind === "commit" && [...subject].length > subjectLengthLimit)
      add("subject.length", 0, subject.length, { limit: subjectLengthLimit });
    if (kind === "commit" && lines.length > 1 && lines[1] !== "")
      add("commit.blank-line", starts[1], starts[1] + lines[1].length);
    if (kind === "pr-title" && lines.length > 1)
      add("title.single-line", subject.length, text.length);
  }
  if (kind === "branch") {
    const match = /^([a-z]+)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(text);
    if (!match || match[0] !== text) add("branch.shape", 0, text.length);
    else if (!types.includes(match[1])) add("branch.type", 0, match[1].length);
  }
  // Control characters must not disguise a subject or an outward body.
  for (const match of text.matchAll(
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029]/gu,
  ))
    add("text.control-character", match.index, match.index + match[0].length);

  const folded = foldedWithOffsets(characterUnits(text));
  // A body is judged as written and as GitHub renders it: markup that shows
  // nothing can split a form the reader still sees, and a form inside a
  // comment or a tag stays in the posted text. Spans are source offsets.
  const rendered =
    kind === "pr-body" || kind === "release-body"
      ? foldedWithOffsets(renderedUnits(text))
      : null;
  // One form is one finding: a rendered span replaces every written span it
  // overlaps. Both lists run in source order.
  const formSpans = (pattern) => {
    const written = patternSpans(folded, pattern);
    const shown = rendered ? patternSpans(rendered, pattern) : [];
    let next = 0;
    const unrendered = written.filter(([start, end]) => {
      while (next < shown.length && shown[next][1] <= start) next++;
      return !(next < shown.length && shown[next][0] < end);
    });
    return [...shown, ...unrendered].sort(
      (left, right) => left[0] - right[0] || left[1] - right[1],
    );
  };
  for (const [start, end] of formSpans(runtimeIdentifiers))
    add("identifier.runtime", start, end);
  if (target)
    for (const [start, end] of formSpans(launchpadIdentifiers))
      add("identifier.launchpad", start, end);
  for (const { term, start, end } of termMatches(
    wordsWithOffsets(folded),
    reviewTerms,
  ))
    add("vocabulary.review", start, end, { term });

  if (!localTerms || !localStatuses.includes(localTerms.status))
    throw new Error("invalid local-terms observation");
  if (localTerms.status === "refused" || localTerms.status === "review") {
    const rows = localTerms.findings;
    if (!Array.isArray(rows) || !rows.length)
      throw new Error("invalid local-terms findings");
    for (const row of rows) {
      const { line, endLine, count, mode = "refuse" } = row;
      if (
        !Number.isInteger(line) ||
        line < 1 ||
        line > lines.length ||
        !Number.isInteger(endLine) ||
        endLine < line ||
        endLine > lines.length ||
        !Number.isInteger(count) ||
        count < 1 ||
        !localTermModes.includes(mode)
      )
        throw new Error("invalid local-terms findings");
      collected.push({
        rule: "vocabulary.local",
        span: span(
          starts[line - 1],
          starts[endLine - 1] + lines[endLine - 1].length,
          "line",
        ),
        count,
        mode,
      });
    }
    const modes = collected
      .filter((finding) => finding.rule === "vocabulary.local")
      .map((finding) => finding.mode);
    if (
      localTerms.status === "review"
        ? modes.some((mode) => mode !== "context")
        : !modes.includes("refuse")
    )
      throw new Error("invalid local-terms findings");
  }
  if (localTerms.status === "error")
    collected.push({ rule: "local-terms.configuration", span: null });

  // The narrowest part holding an offset, so a part nested in another (a
  // record link inside the reviewed notes) wins whatever order the caller
  // listed them in. A finding is labelled with the part holding its start.
  const sectionAt = (offset) =>
    sections
      ?.filter((section) => section.start <= offset && offset < section.end)
      .sort(
        (left, right) => left.end - left.start - (right.end - right.start),
      )[0];
  // A part lifts a rule only over its own bytes: the finding is dropped when
  // every byte of its span sits in a part exempting its rule, so a match that
  // runs from a kit-written part into authored text is still reported. The
  // part holding a byte changes only at a part's edge, so the span's start
  // and each edge inside it are the bytes to check.
  const exempted = ({ rule, span: { start, end } }) =>
    [
      start,
      ...sections
        .flatMap((section) => [section.start, section.end])
        .filter((offset) => start < offset && offset < end),
    ].every((offset) => sectionAt(offset)?.exempt?.includes(rule));
  const findings = [];
  for (const finding of collected) {
    const section = finding.span ? sectionAt(finding.span.start) : undefined;
    if (section && exempted(finding)) continue;
    if (
      finding.rule === "vocabulary.review" &&
      exempt.some(
        (range) =>
          range.start <= finding.span.start && finding.span.end <= range.end,
      )
    )
      continue;
    findings.push(section ? { ...finding, section: section.name } : finding);
  }
  const statusOf = (rule) =>
    findings.some((finding) => finding.rule === rule) ? "refused" : "pass";
  const reviews = findings.filter(isReviewFinding).length;
  const refusing = findings.some((finding) => !isReviewFinding(finding));
  return {
    kind,
    target,
    status: refusing
      ? "refused"
      : localTerms.status === "unavailable"
        ? "unavailable"
        : reviews
          ? "review"
          : "pass",
    checks: {
      format: {
        status: findings.some((finding) => formatRules.test(finding.rule))
          ? "refused"
          : "pass",
      },
      runtime: { status: statusOf("identifier.runtime") },
      launchpadIdentifiers: {
        status: target ? statusOf("identifier.launchpad") : "not-applicable",
      },
      review: { status: reviews ? "review" : "pass", matches: reviews },
      localTerms: {
        status: localTerms.status === "present" ? "pass" : localTerms.status,
        ...(Number.isInteger(localTerms.terms)
          ? { terms: localTerms.terms }
          : {}),
      },
    },
    findings,
    advisories,
  };
}
