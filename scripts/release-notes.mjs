import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { sep } from "node:path";

export const releaseNoteHeadings = Object.freeze([
  "Release overview",
  "Read before upgrading",
  "Substantive changes",
  "Progressive polish",
  "Evidence and compatibility",
]);

export const releaseNotesPathFor = (workOrderId) =>
  `docs/final-reviews/${workOrderId}/RELEASE-NOTES.md`;

const quotedContent = (line) => {
  let content = line;
  let depth = 0;
  while (true) {
    const marker = /^ {0,3}>[ \t]?/.exec(content);
    if (!marker) return depth === 0 ? undefined : { content, depth };
    content = content.slice(marker[0].length);
    depth += 1;
  }
};

const levelTwoHeadings = (markdown, displayPath) => {
  const lines = markdown.split("\n");
  const headings = [];
  let fence;

  lines.forEach((line, index) => {
    const withoutCarriageReturn = line.replace(/\r$/, "");
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(withoutCarriageReturn);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) {
        const info = withoutCarriageReturn.slice(fenceMatch[0].length);
        if (marker[0] !== "`" || !info.includes("`")) {
          fence = { character: marker[0], length: marker.length };
          return;
        }
      } else if (
        marker[0] === fence.character &&
        marker.length >= fence.length &&
        new RegExp(`^ {0,3}${fence.character}{${fence.length},}[ \\t]*$`).test(
          withoutCarriageReturn,
        )
      ) {
        fence = undefined;
        return;
      }
    }
    if (fence) return;
    if (
      withoutCarriageReturn.includes("<!--") ||
      withoutCarriageReturn.includes("-->")
    )
      throw new Error(
        `${displayPath}: HTML comments are not allowed in reviewed notes (line ${index + 1})`,
      );
    if (
      /<\/?[A-Za-z][A-Za-z0-9-]*(?=[ \t/>]|$)/.test(withoutCarriageReturn) ||
      /<!(?!----)|<\?/.test(withoutCarriageReturn)
    )
      throw new Error(
        `${displayPath}: raw HTML is not allowed in reviewed notes (line ${index + 1})`,
      );
    if (
      index > 0 &&
      /^[ \t]*-+[ \t]*$/.test(withoutCarriageReturn) &&
      /\S/.test(lines[index - 1].replace(/\r$/, ""))
    )
      throw new Error(
        `${displayPath}: setext level-two headings are not allowed (line ${index + 1}); use only the five exact required headings`,
      );
    const quoted = quotedContent(withoutCarriageReturn);
    const previousQuoted =
      index > 0
        ? quotedContent(lines[index - 1].replace(/\r$/, ""))
        : undefined;
    if (
      quoted &&
      /^ {0,3}-+[ \t]*$/.test(quoted.content) &&
      previousQuoted?.depth === quoted.depth &&
      /\S/.test(previousQuoted.content)
    )
      throw new Error(
        `${displayPath}: setext level-two headings are not allowed (line ${index + 1}); use only the five exact required headings`,
      );
    const match = /^##[ \t]+(.+?)[ \t]*$/.exec(withoutCarriageReturn);
    if (match) {
      headings.push({ name: match[1], line: index + 1, index });
      return;
    }
    if (
      /^(?:##[ \t]*$|[ \t]+##(?:[ \t]+|$)| {0,3}(?:(?:>[ \t]?)|(?:(?:[-+*]|\d{1,9}[.)])[ \t]+))+ {0,3}##(?:[ \t]+|$))/.test(
        withoutCarriageReturn,
      )
    )
      throw new Error(
        `${displayPath}: level-two heading markers are allowed only as exact column-one section headings (line ${index + 1})`,
      );
  });

  return { headings, lines };
};

const sectionBody = (lines, start, end) => {
  const body = lines.slice(start, end);
  while (body.length > 0 && /^\s*$/.test(body[0])) body.shift();
  while (body.length > 0 && /^\s*$/.test(body.at(-1))) body.pop();
  return body.join("\n");
};

export const parseReleaseNotes = (markdown, displayPath) => {
  const reserved = /^(DOTLN-MANIFEST-(?:BEGIN|END))\r?$/m.exec(markdown);
  if (reserved)
    throw new Error(
      `${displayPath}: reserved tag marker line "${reserved[1]}" is not allowed in reviewed notes`,
    );
  const { headings, lines } = levelTwoHeadings(markdown, displayPath);
  const observed = headings.map(({ name }) => name);

  for (const required of releaseNoteHeadings) {
    const duplicates = headings.filter(({ name }) => name === required);
    if (duplicates.length > 1)
      throw new Error(
        `${displayPath}: duplicated required heading "## ${required}" at line ${duplicates[1].line}`,
      );
  }

  const extra = headings.find(
    ({ name }) => !releaseNoteHeadings.includes(name),
  );
  if (extra)
    throw new Error(
      `${displayPath}: extra level-two heading "## ${extra.name}" at line ${extra.line}`,
    );

  for (const required of releaseNoteHeadings) {
    if (!observed.includes(required))
      throw new Error(
        `${displayPath}: missing required heading "## ${required}"`,
      );
  }

  if (observed.some((heading, index) => heading !== releaseNoteHeadings[index]))
    throw new Error(
      `${displayPath}: required headings are misordered; expected ${releaseNoteHeadings.map((heading) => `"## ${heading}"`).join(", ")}`,
    );

  const preamble = sectionBody(lines, 0, headings[0].index);
  if (preamble !== "")
    throw new Error(
      `${displayPath}: content appears before the first required heading`,
    );

  const sections = {};
  headings.forEach((heading, index) => {
    const next = headings[index + 1];
    const body = sectionBody(
      lines,
      heading.index + 1,
      next?.index ?? lines.length,
    );
    if (body === "")
      throw new Error(
        `${displayPath}: empty required section "## ${heading.name}"; use the literal line "None." when there is nothing to say`,
      );
    sections[heading.name] = body;
  });

  return { sections };
};

export const readReleaseNotesFile = (
  filePath,
  { displayPath = filePath, containmentRoot } = {},
) => {
  if (!existsSync(filePath))
    throw new Error(`${displayPath}: release-notes file is missing`);
  if (!lstatSync(filePath).isFile())
    throw new Error(`${displayPath}: release-notes path is not a regular file`);
  if (
    containmentRoot &&
    !realpathSync(filePath).startsWith(`${realpathSync(containmentRoot)}${sep}`)
  )
    throw new Error(
      `${displayPath}: release-notes file escapes its repository`,
    );
  return parseReleaseNotes(readFileSync(filePath, "utf8"), displayPath);
};
