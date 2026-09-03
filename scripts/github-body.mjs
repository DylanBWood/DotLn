const quoteContent = (line) => {
  let content = line;
  let depth = 0;
  while (true) {
    const marker = /^ {0,3}>[ \t]?/.exec(content);
    if (!marker) return { content, depth };
    content = content.slice(marker[0].length);
    depth += 1;
  }
};

const fenceMarker = (line, allowListIndent = false) => {
  const match = (
    allowListIndent ? /^ *(`{3,}|~{3,})(.*)$/ : /^ {0,3}(`{3,}|~{3,})(.*)$/
  ).exec(line);
  if (!match || (match[1][0] === "`" && match[2].includes("`")))
    return undefined;
  return {
    allowListIndent,
    character: match[1][0],
    length: match[1].length,
  };
};

const closesFence = (line, fence) =>
  new RegExp(
    `^ ${fence.allowListIndent ? "*" : "{0,3}"}${fence.character}{${fence.length},}[ \\t]*$`,
  ).test(line);

const isStructuralLine = (line) =>
  /^ {0,3}#{1,6}(?:[ \t]+|$)/.test(line) ||
  /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/.test(line) ||
  /^ {0,3}(?:=+|-+)[ \t]*$/.test(line) ||
  /^ {0,3}\[[^\]]+\]:/.test(line) ||
  /^ {0,3}\[\^[^\]]+\]:/.test(line) ||
  /^ {0,3}<\/?[A-Za-z][A-Za-z0-9-]*(?:[ \t][^>]*)?\/?>[ \t]*$/.test(line);

const listItem = (line) =>
  /^ {0,}(?:(?:[-+*])|(?:\d{1,9}[.)]))[ \t]+(.*)$/.exec(line);

const explicitHardBreak = (line) => {
  if (/ {2,}$/.test(line)) return true;
  const backslashes = /\\+$/.exec(line)?.[0].length ?? 0;
  return backslashes % 2 === 1;
};

const tableCells = (line) => {
  const trimmed = line.trim();
  const cells = [];
  let cell = "";
  let separators = 0;
  for (let index = 0; index < trimmed.length; index += 1) {
    const character = trimmed[index];
    let backslashes = 0;
    for (let at = index - 1; at >= 0 && trimmed[at] === "\\"; at -= 1)
      backslashes += 1;
    if (character === "|" && backslashes % 2 === 0) {
      cells.push(cell.trim());
      cell = "";
      separators += 1;
    } else {
      cell += character;
    }
  }
  if (separators === 0) return undefined;
  cells.push(cell.trim());
  if (cells[0] === "") cells.shift();
  if (cells.at(-1) === "") cells.pop();
  return cells.length >= 2 ? cells : undefined;
};

const tableLines = (lines) => {
  const indexes = new Set();
  for (let index = 1; index < lines.length; index += 1) {
    const delimiter = tableCells(lines[index].content);
    const header = tableCells(lines[index - 1].content);
    if (
      !delimiter ||
      !header ||
      delimiter.length !== header.length ||
      lines[index].depth !== lines[index - 1].depth ||
      delimiter.some((cell) => !/^:?-{3,}:?$/.test(cell))
    )
      continue;
    indexes.add(index - 1);
    indexes.add(index);
    for (let row = index + 1; row < lines.length; row += 1) {
      if (
        lines[row].depth !== lines[index].depth ||
        !tableCells(lines[row].content)
      )
        break;
      indexes.add(row);
    }
  }
  return indexes;
};

export const githubBodyProfileFailures = (markdown) => {
  const failures = [];
  const lines = markdown.split("\n");
  const quotedLines = lines.map((rawLine) =>
    quoteContent(rawLine.replace(/\r$/, "")),
  );
  const tableLineIndexes = tableLines(quotedLines);
  let fence;
  let previousProse;

  lines.forEach((_, index) => {
    const lineNumber = index + 1;
    const quoted = quotedLines[index];

    if (fence) {
      if (
        quoted.depth === fence.quoteDepth &&
        closesFence(quoted.content, fence)
      )
        fence = undefined;
      previousProse = undefined;
      return;
    }

    const openingFence = fenceMarker(
      quoted.content,
      previousProse?.listItem === true,
    );
    if (openingFence) {
      fence = { ...openingFence, quoteDepth: quoted.depth };
      previousProse = undefined;
      return;
    }

    if (/^[ \t]*$/.test(quoted.content)) {
      previousProse = undefined;
      return;
    }

    if (tableLineIndexes.has(index)) {
      previousProse = undefined;
      return;
    }

    if (/^(?: {4}|\t)/.test(quoted.content) && !previousProse) {
      previousProse = undefined;
      return;
    }

    const item = listItem(quoted.content);
    if (item) {
      previousProse = item[1].trim()
        ? {
            hardBreak: explicitHardBreak(quoted.content),
            line: lineNumber,
            listItem: true,
            quoteDepth: quoted.depth,
          }
        : undefined;
      return;
    }

    if (isStructuralLine(quoted.content)) {
      previousProse = undefined;
      return;
    }

    if (
      previousProse &&
      (previousProse.quoteDepth === quoted.depth ||
        (previousProse.quoteDepth > 0 && quoted.depth === 0)) &&
      !previousProse.hardBreak
    ) {
      failures.push({
        line: lineNumber,
        previousLine: previousProse.line,
      });
    }

    previousProse = {
      hardBreak: explicitHardBreak(quoted.content),
      line: lineNumber,
      listItem: false,
      quoteDepth: quoted.depth,
    };
  });

  return failures;
};

export const assertGitHubBodyProfile = (markdown, displayPath) => {
  const failures = githubBodyProfileFailures(markdown);
  if (failures.length === 0) return;
  const first = failures[0];
  throw new Error(
    `${displayPath}: accidental GitHub prose soft wrap between lines ${first.previousLine} and ${first.line}; keep each prose paragraph or list-item paragraph on one physical line and use blank lines or explicit Markdown hard breaks only for intentional rendered breaks`,
  );
};
