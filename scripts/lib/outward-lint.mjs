export const outwardArtifactKinds = Object.freeze([
  "branch",
  "commit",
  "pr-title",
  "pr-body",
]);
export const subjectLengthLimit = 72;

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
const wordsWithOffsets = (text) => {
  let folded = "";
  const positions = [];
  let offset = 0;
  for (const character of text) {
    const value = normalized(character);
    folded += value;
    for (let index = 0; index < value.length; index++)
      positions.push({ start: offset, end: offset + character.length });
    offset += character.length;
  }
  return [...folded.matchAll(/[\p{L}\p{N}]+/gu)].map((match) => ({
    word: match[0],
    start: positions[match.index].start,
    end: positions[match.index + match[0].length - 1].end,
  }));
};

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
    const match =
      /^([a-z]+)(?:\(([a-z0-9][a-z0-9._/-]*)\))?(!)?: (\S(?:.*\S)?)$/u.exec(
        subject,
      );
    if (!match) add("subject.shape", 0, subject.length);
    else if (!vocabulary.types.includes(match[1]))
      add("subject.type", 0, match[1].length);
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

  const words = wordsWithOffsets(text);
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
      localTerms: {
        status: localTerms.status === "present" ? "pass" : localTerms.status,
      },
    },
    findings,
  };
}
