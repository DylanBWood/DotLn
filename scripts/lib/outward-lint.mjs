export const outwardArtifactKinds = Object.freeze([
  "branch",
  "commit",
  "pr-title",
  "pr-body",
]);
export const subjectLengthLimit = 72;
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

const normalized = (text) => text.normalize("NFKC").toLocaleLowerCase("en-US");
const termKey = (text) =>
  (normalized(text).match(/[\p{L}\p{N}]+/gu) ?? []).join("");

export function validateOutwardVocabulary(vocabulary) {
  if (
    !vocabulary ||
    !Array.isArray(vocabulary.types) ||
    !vocabulary.types.length ||
    vocabulary.types.some(
      (type) => typeof type !== "string" || !/^[a-z]+$/.test(type),
    ) ||
    !Array.isArray(vocabulary.terms) ||
    !vocabulary.terms.length ||
    vocabulary.terms.some((term) => typeof term !== "string" || !termKey(term))
  )
    throw new Error(
      "invalid outward vocabulary: require nonempty types and terms",
    );
  return vocabulary;
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

// The scanner below is the lint's own small model of how GitHub renders a
// body (CommonMark with raw HTML), not the installed Markdown parser that
// github-body.mjs treats as the oracle for links, code and raw HTML. It is
// kept here on purpose: this module imports nothing, so every instance's
// lint can run it anywhere as a pure function, and it maps each rendered
// character back to its exact offset in the original text, so a finding's
// span lands on what was written. Where the model is unsure it shows more
// text rather than less, and it hides every asterisk and tilde run whatever
// its flanking. Over-hiding can only add refusals, never remove one, because
// the written view is matched beside the rendered view and both report.

// Named character references for the characters the runtime forms are made
// of, beside the common markup ones; any other name is read as written.
const namedReferences = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
  ["lowbar", "_"],
  ["UnderBar", "_"],
  ["num", "#"],
  ["sol", "/"],
  ["colon", ":"],
  ["nbsp", "\u00a0"],
]);
// CommonMark's raw HTML: whitespace may hold one line ending, an attribute
// value may be quoted and then holds any character but its quote.
const lineEnding = String.raw`(?:\r\n|\n|\r)`;
const htmlSpace = String.raw`[ \t]*(?:${lineEnding}[ \t]*)?`;
const htmlSomeSpace = String.raw`(?:[ \t]+(?:${lineEnding}[ \t]*)?|${lineEnding}[ \t]*)`;
const htmlAttribute = String.raw`${htmlSomeSpace}[a-z_:][a-z0-9_.:-]*(?:${htmlSpace}=${htmlSpace}(?:[^"'=<>\x60\x00-\x20]+|'[^']*'|"[^"]*"))?`;
// CommonMark's inline link: a destination, raw or in angle brackets, and an
// optional title, which may begin on the next line.
const linkDestination = String.raw`(?:<(?:[^<>\r\n\\]|\\.)*>|(?:[^\x00-\x20()\\]|\\.|\((?:[^\x00-\x20()\\]|\\.)*\))+)`;
const linkTitle = String.raw`(?:"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'|\((?:[^()\\]|\\[\s\S])*\))`;
// One character of a link label: a label may continue onto the next line but
// never across a blank one.
const linkLabelUnit = String.raw`(?:[^[\]\\\r\n]|\\.|(?:\r\n|\n|\r)(?![ \t]*(?:\r\n|\n|\r)))`;
// The opening line of a fenced code block.
const fenceOpening = /^ {0,3}(`{3,}|~{3,})([^\r\n]*)/u;
// Every pattern is sticky: it matches only at the scan position.
const markdown = Object.freeze({
  backticks: /`+/y,
  emptyComment: /<!---?>/y,
  declaration: /<![a-z]/iy,
  openTag: new RegExp(
    String.raw`<[a-z][a-z0-9-]*(?:${htmlAttribute})*${htmlSpace}\/?>`,
    "iy",
  ),
  closeTag: new RegExp(String.raw`<\/[a-z][a-z0-9-]*${htmlSpace}>`, "iy"),
  // CommonMark decodes at most six hex or seven decimal digits; a longer
  // numeric reference shows as written.
  reference: /&(?:#x([0-9a-f]{1,6})|#([0-9]{1,7})|([a-z][a-z0-9]*));/iy,
  escape: /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/y,
  inlineLink: new RegExp(
    String.raw`\(${htmlSpace}(?:${linkDestination}${htmlSpace}(?:${linkTitle}${htmlSpace})?)?\)`,
    "y",
  ),
  label: new RegExp(String.raw`\[(${linkLabelUnit}{0,999})\]`, "uy"),
  hidden: /[*~]+/y,
  underscores: /_+/y,
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
// The character a reference stands for, or undefined when it stands for none.
const referenceValue = ([, hex, decimal, name]) => {
  if (name) return namedReferences.get(name);
  const codePoint = Number.parseInt(hex ?? decimal, hex ? 16 : 10);
  return codePoint <= 0x10ffff && !(codePoint >= 0xd800 && codePoint <= 0xdfff)
    ? String.fromCodePoint(codePoint)
    : undefined;
};
// A paragraph ends where CommonMark ends it: at a blank line, or at a line
// (indented at most three spaces) that opens an ATX heading (one to six "#"
// then a space, a tab or the line end), a quote, a fence whose info string
// holds no backtick, a thematic break, a setext underline, a non-empty bullet
// item or a non-empty ordered item numbered 1. Any other line, "#1" or "2."
// among them, continues the paragraph.
const paragraphBreak =
  /(?:\r\n|\n|\r)(?:[ \t]*(?=\r\n|\n|\r|$)| {0,3}(?:#{1,6}(?=[ \t\r\n]|$)|>|`{3,}[^`\r\n]*(?=[\r\n]|$)|~{3,}|(?:\*[ \t]*){3,}(?=[\r\n]|$)|(?:_[ \t]*){3,}(?=[\r\n]|$)|(?:-[ \t]*){3,}(?=[\r\n]|$)|=+[ \t]*(?=[\r\n]|$)|-+[ \t]*(?=[\r\n]|$)|(?:[-+*]|1[.)])[ \t]+[^ \t\r\n]))/gu;
// The lines that open a raw HTML block after up to three spaces (and any list
// or quote markers before them), each with what ends the block: the line that
// holds the end text, or else the next blank line. The last kind, a complete
// tag alone on its line, cannot interrupt a paragraph.
const htmlBlockKinds = [
  [
    /^<(?:pre|script|style|textarea)(?:[ \t>]|$)/iu,
    /<\/(?:pre|script|style|textarea)>/iu,
  ],
  [/^<!--/u, /-->/u],
  [/^<\?/u, /\?>/u],
  [/^<![a-z]/iu, />/u],
  [/^<!\[CDATA\[/u, /\]\]>/u],
  [
    /^<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:[ \t>]|\/>|$)/iu,
    null,
  ],
];
const htmlBlockPrefix =
  /^(?: {0,3}(?:>|(?:[-+*]|[0-9]{1,9}[.)])(?=[ \t])))* {0,3}(?=<)/u;
const htmlBlockOpening = (line, paragraphOpen) => {
  const prefix = htmlBlockPrefix.exec(line);
  if (!prefix) return undefined;
  const rest = line.slice(prefix[0].length);
  for (const [start, end] of htmlBlockKinds)
    if (start.test(rest)) return { end };
  const tag =
    read(markdown.openTag, rest, 0) ?? read(markdown.closeTag, rest, 0);
  return !paragraphOpen &&
    tag &&
    !/^<\/?(?:pre|script|style|textarea)\b/iu.test(rest) &&
    /^[ \t]*$/u.test(rest.slice(tag[0].length))
    ? { end: null }
    : undefined;
};
// Block ranges the scan takes whole, as a map from start offset to { end,
// raw }. Fenced and indented code show their bytes. A raw HTML block shows
// what a browser shows: its tags hide and its references decode, while
// backticks, fences and indentation inside it mean nothing. Indented code is
// a run of lines indented by four columns that begins the text or follows a
// blank line while no list item or footnote is open, with the blank or
// indented lines continuing it; a list or footnote closes only at an
// unindented line after a blank line, so its indented paragraph is never
// taken for code.
const blockRanges = (text) => {
  const blocks = new Map();
  let open;
  const close = () => {
    blocks.set(open.start, { end: open.end, raw: open.raw });
    open = undefined;
  };
  let blankBefore = true;
  let paragraphOpen = false;
  let listOpen = false;
  for (const match of text.matchAll(/([^\r\n]*)(?:\r\n|\n|\r|$)/gu)) {
    if (!match[0]) break;
    const line = match[1];
    const start = match.index;
    const end = start + line.length;
    const blank = /^[ \t]*$/u.test(line);
    const indented = !blank && /^(?: {4}| {0,3}\t)/u.test(line);
    if (open?.fence) {
      open.end = end;
      if (open.fence.test(line)) close();
      blankBefore = blank;
      continue;
    }
    if (open?.closer) {
      open.end = end;
      if (open.closer.test(line)) close();
      blankBefore = blank;
      continue;
    }
    if (open?.raw) {
      if (!blank) {
        open.end = end;
        continue;
      }
      close();
    } else if (open) {
      if (blank || indented) {
        if (indented) open.end = end;
        blankBefore = blank;
        continue;
      }
      close();
    }
    if (blank) {
      blankBefore = true;
      paragraphOpen = false;
      continue;
    }
    const fence = fenceOpening.exec(line);
    const html = htmlBlockOpening(line, paragraphOpen);
    if (fence && !(fence[1][0] === "`" && fence[2].includes("`"))) {
      open = {
        start,
        end,
        raw: false,
        fence: new RegExp(
          String.raw`^ {0,3}${fence[1][0]}{${fence[1].length},}[ \t]*$`,
          "u",
        ),
      };
    } else if (html) {
      open = { start, end, raw: true, closer: html.end };
      if (html.end?.test(line)) close();
    } else if (indented && blankBefore && !listOpen) {
      open = { start, end, raw: false };
    } else {
      if (
        /^ {0,3}(?:(?:[-+*]|[0-9]{1,9}[.)])(?:[ \t]|$)|\[\^[^\]]+\]:)/u.test(
          line,
        )
      )
        listOpen = true;
      else if (blankBefore && !/^[ \t]/u.test(line)) listOpen = false;
      paragraphOpen = !/^ {0,3}#{1,6}(?:[ \t]|$)/u.test(line);
      blankBefore = false;
      continue;
    }
    blankBefore = false;
    paragraphOpen = false;
  }
  if (open) close();
  return blocks;
};
// Each "[" with the "]" that closes it in the same paragraph, ignoring
// escaped brackets.
const bracketPairs = (text) => {
  const pairs = new Map();
  const open = [];
  for (const match of text.matchAll(
    /\\[\s\S]|[[\]]|(?:\r\n|\n|\r)[ \t]*(?=\r\n|\n|\r)/gu,
  )) {
    if (match[0] === "[") open.push(match.index);
    else if (match[0] === "]") {
      if (open.length) pairs.set(open.pop(), match.index);
    } else if (match[0][0] !== "\\") open.length = 0;
  }
  return pairs;
};
// A link label as CommonMark compares it: case-folded, spaces collapsed.
const labelKey = (label) => label.trim().replace(/\s+/gu, " ").toLowerCase();
// The labels the body's link reference definitions define, outside code and
// raw HTML blocks; a definition counts inside a quote or a list item too, so
// the quote and list markers before it are skipped.
const definedLabels = (text, blocks) => {
  const ranges = [...blocks].map(([start, { end }]) => [start, end]);
  let next = 0;
  const labels = new Set();
  for (const match of text.matchAll(
    new RegExp(
      String.raw`^(?:[ \t]*(?:>|(?:[-+*]|[0-9]{1,9}[.)])(?=[ \t])))*[ \t]*\[(${linkLabelUnit}{1,999})\]:`,
      "gmu",
    ),
  )) {
    while (next < ranges.length && ranges[next][1] < match.index) next++;
    if (next < ranges.length && ranges[next][0] <= match.index) continue;
    labels.add(labelKey(match[1]));
  }
  return labels;
};
// What a reader sees of a body once GitHub renders it, unit by unit with the
// source range each came from. Character references and backslash escapes
// show the character they stand for. Raw HTML (comments, processing
// instructions, declarations, CDATA and tags), the brackets of a link and
// the destination or label after its text, and emphasis, strikethrough and
// code-span delimiters show nothing; brackets that make no link show. Code
// spans and fenced or indented code show their bytes as written, references
// and escapes included, because GitHub renders code literally. A code span or
// a raw HTML construct closes only inside its paragraph or HTML block;
// otherwise its opener shows as written. Each closer is found by a forward
// search from a position that only grows, so the scan stays bounded.
const contentUnits = (text) => {
  const units = [];
  const hide = (start, end) => units.push({ start, end, value: "" });
  const blocks = blockRanges(text);
  const pairs = bracketPairs(text);
  const labels = definedLabels(text, blocks);
  // The end of each link's closing bracket and what follows it, by offset.
  const linkCloses = new Map();
  // Where the link opened by the "[" at `at` ends, or -1 when the brackets
  // make no link: an inline link needs a valid destination and optional
  // title, a reference link a label the body defines.
  const linkEnd = (at, limit) => {
    const close = pairs.get(at);
    if (close === undefined || close >= limit) return -1;
    const inline = read(markdown.inlineLink, text, close + 1);
    if (inline && close + 1 + inline[0].length <= limit)
      return close + 1 + inline[0].length;
    const label = read(markdown.label, text, close + 1);
    const name = label?.[1] || text.slice(at + 1, close);
    const end = close + 1 + (label ? label[0].length : 0);
    return end <= limit && labels.has(labelKey(name)) ? end : -1;
  };
  const blockStarts = [...blocks.keys()];
  let nextBlock = 0;
  let paragraphEnd = 0;
  const paragraphLimit = (from) => {
    if (from >= paragraphEnd)
      paragraphEnd = read(paragraphBreak, text, from)?.index ?? text.length;
    while (blockStarts[nextBlock] <= from) nextBlock++;
    return Math.min(paragraphEnd, blockStarts[nextBlock] ?? text.length);
  };
  // The next offset of each closing text at or after the latest search.
  const closers = new Map();
  const nextIndex = (closer, from) => {
    const found = closers.get(closer);
    if (found === -1 || found >= from) return found;
    closers.set(closer, text.indexOf(closer, from));
    return closers.get(closer);
  };
  // The end of the raw HTML construct at `at` closing within `limit`, or -1.
  const rawHtmlEnd = (at, limit) => {
    if (text[at] !== "<") return -1;
    const empty = read(markdown.emptyComment, text, at);
    if (empty) return at + empty[0].length;
    const section =
      rawSections.find(([opener]) => text.startsWith(opener, at)) ??
      (read(markdown.declaration, text, at) && ["<!", ">"]);
    if (section) {
      const close = nextIndex(section[1], at + section[0].length);
      const end = close + section[1].length;
      return close !== -1 && end <= limit ? end : -1;
    }
    const tag =
      read(markdown.openTag, text, at) ?? read(markdown.closeTag, text, at);
    return tag && at + tag[0].length <= limit ? at + tag[0].length : -1;
  };
  let rawUntil = -1;
  let at = 0;
  while (at < text.length) {
    const block = blocks.get(at);
    if (block && !block.raw) {
      for (const unit of characterUnits(text, at, block.end)) units.push(unit);
      at = block.end;
      continue;
    }
    if (block) rawUntil = block.end;
    const raw = at < rawUntil;
    const limit = raw ? rawUntil : paragraphLimit(at);
    const backticks = !raw && read(markdown.backticks, text, at);
    if (backticks) {
      const length = backticks[0].length;
      const runs = /`+/gu;
      runs.lastIndex = at + length;
      let close = runs.exec(text);
      while (close && close.index < limit && close[0].length !== length)
        close = runs.exec(text);
      if (close && close.index < limit) {
        hide(at, at + length);
        for (const unit of characterUnits(text, at + length, close.index))
          units.push(unit);
        hide(close.index, close.index + length);
        at = close.index + length;
      } else {
        for (const unit of characterUnits(text, at, at + length))
          units.push(unit);
        at += length;
      }
      continue;
    }
    const markup = rawHtmlEnd(at, limit);
    if (markup !== -1) {
      hide(at, markup);
      at = markup;
      continue;
    }
    const reference = read(markdown.reference, text, at);
    const value = reference ? referenceValue(reference) : undefined;
    if (value !== undefined) {
      units.push({ start: at, end: at + reference[0].length, value });
      at += reference[0].length;
      continue;
    }
    if (!raw) {
      const escape = read(markdown.escape, text, at);
      if (escape) {
        units.push({ start: at, end: at + 2, value: escape[1] });
        at += 2;
        continue;
      }
      // A link shows only its text: its brackets, and the destination or
      // label after its closing bracket, show nothing.
      const link = text[at] === "[" ? linkEnd(at, limit) : -1;
      if (link !== -1) {
        linkCloses.set(pairs.get(at), link);
        hide(at, at + 1);
        at += 1;
        continue;
      }
      if (linkCloses.has(at)) {
        hide(at, linkCloses.get(at));
        at = linkCloses.get(at);
        continue;
      }
      const hidden = read(markdown.hidden, text, at);
      if (hidden) {
        hide(at, at + hidden[0].length);
        at += hidden[0].length;
        continue;
      }
      const underscores = read(markdown.underscores, text, at);
      if (underscores) {
        const end = at + underscores[0].length;
        units.push({ start: at, end, value: underscores[0], emphasis: true });
        at = end;
        continue;
      }
    }
    const character = String.fromCodePoint(text.codePointAt(at));
    units.push({ start: at, end: at + character.length, value: character });
    at += character.length;
  }
  // An underscore run emphasizes and shows nothing unless it stands between
  // two letters or digits, where Markdown keeps it as written.
  const word = (value) => /^[\p{L}\p{N}]$/u.test(value);
  const before = [];
  let previous = "";
  for (const unit of units) {
    before.push(previous);
    if (unit.value) previous = unit.value;
  }
  let next = "";
  for (let index = units.length - 1; index >= 0; index--) {
    const unit = units[index];
    const after = next;
    if (unit.value) next = unit.value;
    if (unit.emphasis && !(word(before[index]) && word(after))) unit.value = "";
  }
  return units;
};
// A body's lines with their block-quote markers removed, so paragraph breaks
// and inline constructs inside a quote are judged on the quote's content, as
// GitHub judges them; list markers and indentation before a marker stay. A
// line that opens a deeper quote is preceded by a blank line, which ends the
// paragraph before it; a lazy line without markers keeps the quote open.
// `origin` holds, for each UTF-16 unit of the content, its offset in the body.
const quoteContent = (text) => {
  let content = "";
  const origin = [];
  let depth = 0;
  for (const match of text.matchAll(/([^\r\n]*)(?:\r\n|\n|\r|$)/gu)) {
    if (!match[0]) break;
    const [, lead, quotes] =
      /^((?:[ \t]*(?:[-+*]|[0-9]{1,9}[.)])[ \t]+)*[ \t]*)((?:>[ \t]?(?:[ \t]{0,3}(?=>))?)*)/u.exec(
        match[1],
      );
    const level = quotes.split(">").length - 1;
    const blank = /^[ \t]*$/u.test(match[1].slice(lead.length + quotes.length));
    if (level > depth) {
      content += "\n";
      origin.push(match.index);
    }
    if (level > depth || blank) depth = level;
    const kept = [
      [match.index, lead.length],
      [
        match.index + lead.length + quotes.length,
        match[0].length - lead.length - quotes.length,
      ],
    ];
    for (const [from, length] of kept) {
      content += text.slice(from, from + length);
      for (let index = 0; index < length; index++) origin.push(from + index);
    }
  }
  return { content, origin };
};
// The rendered units of a body, with offsets in the body itself.
const renderedUnits = (text) => {
  if (!/^[ \t]*(?:(?:[-+*]|[0-9]{1,9}[.)])[ \t]+)*>/mu.test(text))
    return contentUnits(text);
  const { content, origin } = quoteContent(text);
  return contentUnits(content).map((unit) => ({
    ...unit,
    start: origin[unit.start],
    end: origin[unit.end - 1] + 1,
  }));
};
const wordsWithOffsets = ({ folded, positions }) =>
  [...folded.matchAll(/[\p{L}\p{N}]+/gu)].map((match) => ({
    word: match[0],
    start: positions[match.index].start,
    end: positions[match.index + match[0].length - 1].end,
  }));

/** Pure: no filesystem, environment, Git, clock or remote effects per call.
 * localTerms is the adapter's redacted observation, never the private list.
 * Offsets are zero-based UTF-16 [start,end); lines/columns are one-based.
 */
export function lintOutwardArtifact({
  kind,
  text,
  vocabulary,
  localTerms = { status: "unavailable" },
}) {
  if (!outwardArtifactKinds.includes(kind) || typeof text !== "string")
    throw new Error("require an outward artifact kind and string text");
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
  const findings = [];
  const add = (rule, start, end, extra = {}) =>
    findings.push({ rule, span: span(start, end), ...extra });
  const subject = lines[0];

  if (kind === "commit" || kind === "pr-title") {
    // One leading gitmoji, in its Unicode form or its `:shortcode:` form as
    // core's own titles spell it, precedes the conventional type.
    const emoji =
      /^(?:\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*|:[a-z0-9_+-]+:) /u.exec(
        subject,
      )?.[0] ?? "";
    const match =
      /^([a-z]+)(?:\(([a-z0-9][a-z0-9._/-]*)\))?(!)?: (\S(?:.*\S)?)$/u.exec(
        subject.slice(emoji.length),
      );
    if (!match) add("subject.shape", 0, subject.length);
    else if (!vocabulary.types.includes(match[1]))
      add("subject.type", emoji.length, emoji.length + match[1].length);
    if ([...subject].length > subjectLengthLimit)
      add("subject.length", 0, subject.length, { limit: subjectLengthLimit });
    if (kind === "commit" && lines.length > 1 && lines[1] !== "")
      add("commit.blank-line", starts[1], starts[1] + lines[1].length);
    if (kind === "pr-title" && lines.length > 1)
      add("title.single-line", subject.length, text.length);
  }
  if (kind === "branch") {
    const match = /^([a-z]+)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(text);
    if (!match || match[0] !== text) add("branch.shape", 0, text.length);
    else if (!vocabulary.types.includes(match[1]))
      add("branch.type", 0, match[1].length);
  }
  // Control characters must not disguise a subject or an outward body.
  for (const match of text.matchAll(
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029]/gu,
  ))
    add("text.control-character", match.index, match.index + match[0].length);
  const formatStatus = findings.length ? "refused" : "pass";

  const folded = foldedWithOffsets(characterUnits(text));
  // A body is judged as written and as GitHub renders it: markup that shows
  // nothing can split a form the reader still sees, and a form inside a
  // comment or a tag stays in the posted text. Spans are source offsets.
  const spansOf = (view) =>
    [...view.folded.matchAll(runtimeIdentifiers)].map((match) => [
      view.positions[match.index].start,
      view.positions[match.index + match[0].length - 1].end,
    ]);
  const written = spansOf(folded);
  const rendered =
    kind === "pr-body" ? spansOf(foldedWithOffsets(renderedUnits(text))) : [];
  // One form is one finding: a rendered span replaces every written span it
  // overlaps. Both lists run in source order.
  let next = 0;
  const unrendered = written.filter(([start, end]) => {
    while (next < rendered.length && rendered[next][1] <= start) next++;
    return !(next < rendered.length && rendered[next][0] < end);
  });
  for (const [start, end] of [...rendered, ...unrendered].sort(
    (left, right) => left[0] - right[0] || left[1] - right[1],
  ))
    add("identifier.runtime", start, end);
  const runtimeStatus = findings.some(
    (finding) => finding.rule === "identifier.runtime",
  )
    ? "refused"
    : "pass";
  const words = wordsWithOffsets(folded);
  const terms = new Map(vocabulary.terms.map((term) => [termKey(term), term]));
  const maxLength = Math.max(...[...terms.keys()].map((key) => key.length));
  for (let start = 0; start < words.length; start++) {
    let candidate = "";
    for (let end = start; end < words.length; end++) {
      candidate += words[end].word;
      if (candidate.length > maxLength) break;
      if (terms.has(candidate))
        add("vocabulary.launchpad", words[start].start, words[end].end, {
          term: terms.get(candidate),
        });
    }
  }
  const vocabularyStatus = findings.some(
    (finding) => finding.rule === "vocabulary.launchpad",
  )
    ? "refused"
    : "pass";

  if (
    !localTerms ||
    !["present", "unavailable", "refused", "error"].includes(localTerms.status)
  )
    throw new Error("invalid local-terms observation");
  if (localTerms.status === "refused") {
    if (!Array.isArray(localTerms.findings) || !localTerms.findings.length)
      throw new Error("invalid local-terms findings");
    for (const { line, count } of localTerms.findings) {
      if (
        !Number.isInteger(line) ||
        line < 1 ||
        line > lines.length ||
        !Number.isInteger(count) ||
        count < 1
      )
        throw new Error("invalid local-terms findings");
      findings.push({
        rule: "vocabulary.local",
        span: span(
          starts[line - 1],
          starts[line - 1] + lines[line - 1].length,
          "line",
        ),
        count,
      });
    }
  }
  if (localTerms.status === "error")
    findings.push({ rule: "local-terms.configuration", span: null });
  return {
    kind,
    status: findings.length
      ? "refused"
      : localTerms.status === "unavailable"
        ? "unavailable"
        : "pass",
    checks: {
      format: { status: formatStatus },
      launchpad: { status: vocabularyStatus },
      runtime: { status: runtimeStatus },
      localTerms: {
        status: localTerms.status === "present" ? "pass" : localTerms.status,
      },
    },
    findings,
  };
}
