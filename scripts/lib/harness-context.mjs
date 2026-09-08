import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const HARNESS_CONTEXT_BASE = "8b55eca3b3427146e98d34c68f67f679dc59bea5";
const lineParts = (text) => text.match(/[^\n]*\n|[^\n]+$/g) ?? [];
const normalized = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const safePath = (path) =>
  /^(?:[.a-zA-Z0-9_-]+\/)*[.a-zA-Z0-9_-]+$/.test(path) &&
  !path.split("/").some((part) => part === "..") &&
  !path.startsWith("docs/intake/");

export function sectionRange(text, anchor) {
  const lines = lineParts(text);
  if (!anchor) return { startLine: 1, endLine: lines.length };
  const headings = lines.flatMap((line, index) => {
    const match = /^(#{1,6})\s+(.+?)\s*\n?$/.exec(line);
    return match
      ? [{ index, level: match[1].length, title: normalized(match[2]) }]
      : [];
  });
  const target = normalized(
    anchor.replace(/\([^)]*\)/g, "").replace(/[,;.]\s*$/, ""),
  );
  const exact = headings.filter((heading) => heading.title === target);
  const matches = exact.length
    ? exact
    : headings.filter((heading) => heading.title.startsWith(target + " "));
  if (matches.length !== 1)
    throw new Error(`Unresolved required section: ${anchor}`);
  const start = matches[0];
  return {
    startLine: start.index + 1,
    endLine:
      headings.find(
        (heading) =>
          heading.index > start.index && heading.level <= start.level,
      )?.index ?? lines.length,
  };
}

/** A Read directive anywhere in a procedure is binding, including its last line. */
export function readDirectives(text, role) {
  const found = [];
  let fenced = false;
  for (const [index, line] of text.split("\n").entries()) {
    if (line.startsWith("```")) {
      fenced = !fenced;
      continue;
    }
    if (fenced || line.startsWith("<!--")) continue;
    const explicit = /^Read(?:\[([a-z-]+)\])?:\s*(.*)/.exec(line);
    if (explicit?.[1] && explicit[1] !== role) continue;
    if (!explicit && !/\b(?:read|load|consult|inspect)\b/i.test(line)) continue;
    const source = explicit ? explicit[2] : line;
    for (const match of source.matchAll(/`([^`]+)`/g)) {
      const value = match[1];
      if (
        value.startsWith("@") ||
        /^[.\w/-]+\.(?:md|ts|mjs|json)(?:#.+)?$/.test(value)
      )
        found.push({ selector: value, line: index + 1 });
    }
    if (explicit && !found.some((entry) => entry.line === index + 1))
      throw new Error(`Malformed required Read directive at line ${index + 1}`);
  }
  return found;
}

/** Resolve the work order's own Cites block, with strict heading resolution. */
export function citedSelectors(text, paths, read) {
  const block = /\*\*Cites[^\n]*?\*\*([\s\S]*?)(?=\n\*\*Objective:)/.exec(
    text,
  )?.[1];
  if (block === undefined)
    throw new Error("Work order has no resolvable Cites block");
  const flat = block.replace(/\s+/g, " ");
  const refs = [
    ...flat.matchAll(/(?:[.\w-]+\/)*[.\w-]+\.(?:md|ts|mjs|json)|ADR-\d{4}/g),
  ];
  const result = [];
  let sourceDirectory = "";
  for (const [index, match] of refs.entries()) {
    let path = match[0];
    if (/^ADR-/.test(path))
      path =
        paths.find((candidate) =>
          candidate.startsWith(`docs/decisions/${path.slice(4)}-`),
        ) ?? "";
    else if (/^\d\d-.*\.md$/.test(path)) path = `docs/product/${path}`;
    else if (
      !paths.includes(path) &&
      sourceDirectory &&
      paths.includes(`${sourceDirectory}/${path}`)
    )
      path = `${sourceDirectory}/${path}`;
    else if (!paths.includes(path)) {
      const matches = paths.filter((candidate) =>
        candidate.endsWith(`/${path}`),
      );
      if (matches.length === 1) path = matches[0];
    }
    if (!safePath(path) || !paths.includes(path))
      throw new Error(`Unresolved cited file: ${match[0]}`);
    if (path.startsWith("packages/") && !match[0].includes("loadouts/"))
      sourceDirectory = dirname(path);
    const tail = flat
      .slice(
        match.index + match[0].length,
        refs[index + 1]?.index ?? flat.length,
      )
      .replace(/`/g, "")
      .replace(/\([^)]*\)/g, "");
    const anchors = [
      ...tail.matchAll(/§([^§;]+?)(?=,?\s+(?:and\s+)?§|;|$)/g),
    ].map((anchor) =>
      anchor[1]
        .replace(/\([^)]*\)/g, "")
        .replace(/,?\s+and\s*$/, "")
        .trim(),
    );
    if (!anchors.length) result.push(path);
    else
      for (const anchor of anchors) {
        sectionRange(read(path), anchor);
        result.push(`${path}#${anchor}`);
      }
  }
  return [...new Set(result)];
}

export function directedReads({
  instruction,
  skill,
  role,
  skillsRoot,
  selectors,
  read,
}) {
  const requested = [{ selector: "CLAUDE.md", source: "instruction-autoload" }];
  for (const [source, text] of [
    ["instruction", instruction],
    ["skill", skill],
  ])
    for (const directive of readDirectives(text, role))
      requested.push({ ...directive, source });
  const expanded = [];
  const expand = (selector, source) => {
    if (selector.startsWith("@skills/"))
      selector = selector.replace("@skills", skillsRoot);
    else if (selector.startsWith("@")) {
      if (!Object.hasOwn(selectors, selector))
        throw new Error(`Unresolved required selector: ${selector}`);
      for (const selected of selectors[selector])
        expand(selected, `${source}:${selector}`);
      return;
    }
    const [path, ...anchor] = selector.split("#");
    if (!safePath(path)) throw new Error(`Unsafe required path: ${path}`);
    const text =
      path === "CLAUDE.md"
        ? instruction
        : path === `${skillsRoot}/dotln-${role}/SKILL.md`
          ? skill
          : read(path);
    expanded.push({ path, ...sectionRange(text, anchor.join("#")), source });
  };
  for (const row of requested) expand(row.selector, row.source);
  return mergeReads(expanded);
}

export function mergeReads(reads) {
  const merged = [];
  for (const row of [...reads].sort(
    (a, b) => a.path.localeCompare(b.path) || a.startLine - b.startLine,
  )) {
    const previous = merged.at(-1);
    if (previous?.path === row.path && row.startLine <= previous.endLine + 1) {
      previous.endLine = Math.max(previous.endLine, row.endLine);
      previous.sources = [
        ...new Set([...previous.sources, row.source ?? "declared-input"]),
      ];
    } else
      merged.push({
        path: row.path,
        startLine: row.startLine,
        endLine: row.endLine,
        sources: [row.source ?? "declared-input"],
      });
  }
  return merged;
}

export function countReads(reads, read) {
  const files = reads.map((row) => {
    const parts = lineParts(read(row.path)).slice(
      row.startLine - 1,
      row.endLine,
    );
    return {
      ...row,
      bytes: Buffer.byteLength(parts.join("")),
      lines: parts.length,
    };
  });
  return {
    bytes: files.reduce((sum, file) => sum + file.bytes, 0),
    lines: files.reduce((sum, file) => sum + file.lines, 0),
    files,
  };
}

export function compareObservedReads(directed, observed) {
  return observed.filter(
    (read) =>
      !directed.some(
        (entry) =>
          entry.path === read.path &&
          entry.startLine <= read.startLine &&
          entry.endLine >= read.endLine,
      ),
  );
}

export function scopeReadEvidence(directed, observations) {
  const refused = observations.filter((row) => row.readScopeRefusal);
  return {
    refusalCounts: {
      Read: refused.filter((row) => row.tool === "Read").length,
      Bash: refused.filter((row) => row.tool === "Bash").length,
      Skill: refused.filter((row) => row.tool === "Skill").length,
      other: refused.filter(
        (row) => !["Read", "Bash", "Skill"].includes(row.tool),
      ).length,
    },
    unlocatedReadRefusals: refused.filter(
      (row) => row.tool === "Read" && !row.attemptedRead,
    ).length,
    refusedReads: refused.flatMap((row) =>
      row.attemptedRead ? [row.attemptedRead] : [],
    ),
    attemptedOutsideDirectedSet: compareObservedReads(
      directed,
      observations.flatMap((row) =>
        row.attemptedRead ? [row.attemptedRead] : [],
      ),
    ),
  };
}

export function snapshotReader(root, revision = HARNESS_CONTEXT_BASE) {
  const paths = execFileSync(
    "git",
    ["ls-tree", "-r", "--name-only", revision],
    { cwd: root, encoding: "utf8" },
  )
    .trim()
    .split("\n");
  const cache = new Map();
  return {
    paths,
    read(path) {
      if (!safePath(path)) throw new Error("Unsafe snapshot path");
      if (!cache.has(path))
        cache.set(
          path,
          execFileSync("git", ["show", `${revision}:${path}`], {
            cwd: root,
            encoding: "utf8",
            maxBuffer: 16 * 1024 * 1024,
          }),
        );
      return cache.get(path);
    },
  };
}

/** Legacy syntax is audited against the frozen activation source, never inferred from the new skill. */
export function legacyDirectedReads(instruction, guide, role, selectors, read) {
  const floor = /Cold-start read order:([\s\S]*?)Settled questions/.exec(
    instruction,
  )?.[1];
  if (
    !floor ||
    !floor.includes("docs/product/07-execution-guide.md") ||
    !floor.includes("your work order") ||
    !floor.includes("sections it cites")
  )
    throw new Error("Unrecognized activation read order");
  const selected = [
    "CLAUDE.md",
    "docs/product/07-execution-guide.md",
    ...selectors["@work-order"],
    ...selectors["@citations"],
  ];
  if (!guide.includes("Read your own diff before reporting"))
    throw new Error("Unrecognized legacy output review");
  selected.push(...selectors["@subject-files"]);
  if (
    ["verifier", "reviewer"].includes(role) &&
    /verifier reads[\s\S]*?prior reports/.test(guide)
  )
    selected.push(...selectors["@verification-reports"]);
  if (role === "executor" && /repair episode reads both/.test(guide))
    selected.push(...selectors["@failure-report"]);
  if (role === "reviewer" && guide.includes("PR body file"))
    selected.push(...selectors["@final-review"]);
  if (role === "release-close" && guide.includes("RELEASE-NOTES.md"))
    selected.push(...selectors["@final-review"]);
  if (role !== "release-close" && guide.includes("in\n   `package.json`"))
    selected.push("package.json");
  return mergeReads(
    selected.map((selector) => {
      const [path, ...anchor] = selector.split("#");
      return {
        path,
        ...sectionRange(
          path === "CLAUDE.md" ? instruction : read(path),
          anchor.join("#"),
        ),
        source: "activation-read-order-and-role-procedure",
      };
    }),
  );
}

export const currentReader = (root) => (path) =>
  readFileSync(join(root, path), "utf8");
