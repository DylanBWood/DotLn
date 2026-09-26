#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import {
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
} from "./lib/config.mjs";
import { runGit, runGitPathList } from "./lib/git.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { readDecisions } from "./lib/meta.mjs";
import { parsers } from "prettier/plugins/markdown.mjs";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const normalized = (value) => value.replace(/\s+/g, " ").trim();
const inside = (root, path) =>
  path === root || path.startsWith(`${root}${sep}`);

// The repository already pins Prettier. Its exported Markdown parser supplies
// block boundaries, decoded destinations and reference identities; no second
// Markdown grammar or new dependency is needed. The pinned parser is synchronous.
function parseMarkdown(source) {
  const ast = parsers.markdown.parse(source);
  if (ast?.type !== "root" || !Array.isArray(ast.children))
    throw new Error(
      "Unsupported Markdown parser AST; check the pinned Prettier version",
    );
  return ast;
}
function* nodes(node) {
  yield node;
  for (const child of node.children ?? []) yield* nodes(child);
}
const start = (node) => node.position.start.offset;
const end = (node) => node.position.end.offset;
function renderedText(node) {
  if (["text", "inlineCode"].includes(node.type)) return node.value;
  if (["image", "imageReference"].includes(node.type)) return node.alt ?? "";
  if (node.type === "break") return " ";
  return (node.children ?? []).map(renderedText).join("");
}
function headingRecords(ast) {
  const seen = new Set();
  return [...nodes(ast)]
    .filter((node) => node.type === "heading")
    .map((node) => {
      const base = renderedText(node)
        .replace(/\r?\n/g, " ")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\p{M}\p{Pc} -]/gu, "")
        .trim()
        .replace(/ /g, "-");
      let anchor = base,
        suffix = 1;
      while (seen.has(anchor)) anchor = `${base}-${suffix++}`;
      seen.add(anchor);
      return { node, anchor, level: node.depth, start: start(node) };
    });
}
// `file` is relative to the configured product root, never just its basename.
export function productContent(file, source) {
  const totalBytes = Buffer.byteLength(source);
  // The parser discards leading BOMs before assigning offsets. Slice the
  // same text, but keep every BOM's three bytes in the document's total.
  source = source.replace(/^\uFEFF+/, "");
  const ast = parseMarkdown(source),
    failures = [],
    ranges = [];
  const titles = headingRecords(ast);
  // No generator currently owns a marked product block. Markers alone grant
  // no exemption; a future producer needs an explicit product-path/marker
  // registration and regression coverage when it lands.
  if (file === "06-roadmap.md") {
    const boundary = titles.find(
      (row) =>
        row.level === 2 &&
        ast.children.includes(row.node) &&
        renderedText(row.node) === "Release boundary",
    );
    if (boundary) {
      const next = titles.find(
        (row) =>
          row.start > boundary.start &&
          row.level <= 2 &&
          ast.children.includes(row.node),
      );
      ranges.push([boundary.start, next?.start ?? source.length]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  const exempt = (node) =>
    merged.some(([left, right]) => start(node) >= left && start(node) < right);
  const shapes = [];
  for (const title of titles) {
    const raw = source.slice(start(title.node), end(title.node));
    const candidate =
      /^#{2,3}[ \t]+(Candidate —(?:\s|$)[\s\S]*?)(?:[ \t]+#+[ \t]*)?$/.exec(
        raw,
      );
    if (!exempt(title.node) && candidate)
      shapes.push({
        kind: "candidate",
        heading: title.anchor,
        label: normalized(candidate[1]),
      });
  }
  for (const node of nodes(ast)) {
    if (node.type !== "paragraph" || exempt(node)) continue;
    const strong = node.children[0];
    if (strong?.type !== "strong") continue;
    const raw = source.slice(start(strong), end(strong));
    if (!raw.startsWith("**")) continue;
    const label = normalized(raw.slice(2, -2));
    if (
      /\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)\s*:/.test(label) ||
      /operator direction/i.test(label)
    )
      shapes.push({
        kind: "receipt",
        heading:
          titles.findLast((row) => row.start < start(node))?.anchor ?? "",
        label,
      });
  }
  const exemptBytes = merged.reduce(
    (sum, [left, right]) => sum + Buffer.byteLength(source.slice(left, right)),
    0,
  );
  return {
    bytes: totalBytes - exemptBytes,
    exemptBytes,
    shapes,
    failures,
  };
}

export function markdownLinks(source) {
  const ast = parseMarkdown(source),
    definitions = new Map();
  for (const node of nodes(ast))
    if (node.type === "definition" && !definitions.has(node.identifier))
      definitions.set(node.identifier, node.url);
  const links = [];
  for (const node of nodes(ast)) {
    const href = ["link", "image"].includes(node.type)
      ? node.url
      : ["linkReference", "imageReference"].includes(node.type)
        ? definitions.get(node.identifier)
        : undefined;
    if (href) links.push({ href, line: node.position.start.line });
  }
  return links;
}

function anchors(source) {
  const ast = parseMarkdown(source);
  const result = new Set(headingRecords(ast).map((row) => row.anchor));
  for (const node of nodes(ast)) {
    if (node.type !== "html") continue;
    const html = node.value.replace(/<!--[\s\S]*?-->/g, "");
    for (const match of html.matchAll(
      /<[a-z][\w:-]*\b[^>]*?\s(?:id|name)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))[^>]*>/gi,
    ))
      result.add(match[1] ?? match[2] ?? match[3]);
  }
  return result;
}

export function markdownFiles(root) {
  const roots = Object.values(loadConfig(root).roots).map((path) =>
    resolve(root, path),
  );
  const privateRoots = [
    docPath(root, "intake"),
    docPath(root, "control", "local"),
  ];
  return [
    ...new Set(
      runGitPathList(root, [
        "ls-files",
        "-z",
        "--cached",
        "--others",
        "--exclude-standard",
      ]),
    ),
  ]
    .filter(
      (file) =>
        file.endsWith(".md") &&
        existsSync(join(root, file)) &&
        (dirname(file) === "." ||
          roots.some((path) => inside(path, resolve(root, file)))) &&
        !privateRoots.some((path) => inside(path, resolve(root, file))),
    )
    .sort();
}

export function linkFailures(root, files = markdownFiles(root)) {
  const failures = [],
    cache = new Map();
  const physicalRoot = realpathSync(root);
  for (const file of files) {
    const source = readFileSync(join(root, file), "utf8");
    for (const { href, line } of markdownLinks(source)) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)) continue;
      let pathname, fragment;
      try {
        const [pathQuery, ...parts] = href.split("#");
        pathname = decodeURIComponent(pathQuery.split("?")[0]);
        fragment = decodeURIComponent(parts.join("#"));
      } catch {
        failures.push({ file, href, line, reason: "invalid URL encoding" });
        continue;
      }
      // Relative navigation is judged in the repository file's context,
      // including PR body sources. Publishing does not rewrite their links.
      const target = pathname
        ? resolve(
            pathname.startsWith("/") ? root : dirname(join(root, file)),
            pathname.replace(/^\//, ""),
          )
        : join(root, file);
      const fail = (reason) => failures.push({ file, href, line, reason });
      if (!inside(root, target)) {
        fail("destination escapes the repository");
        continue;
      }
      if (!existsSync(target)) {
        fail("missing file");
        continue;
      }
      if (!inside(physicalRoot, realpathSync(target))) {
        fail("destination escapes the repository through a symlink");
        continue;
      }
      if (!fragment || !/\.md$/i.test(target)) continue;
      if (!statSync(target).isFile()) {
        fail("anchor target is not a file");
        continue;
      }
      if (
        [docPath(root, "intake"), docPath(root, "control", "local")].some(
          (path) => inside(path, target),
        )
      ) {
        fail("anchor target is private");
        continue;
      }
      if (!cache.has(target)) {
        const content = readFileSync(target, "utf8");
        cache.set(target, {
          lines: content.trimEnd().split("\n").length,
          anchors: anchors(content),
        });
      }
      const targetInfo = cache.get(target);
      const lineAnchor = /^L(\d+)(?:-L(\d+))?$/.exec(fragment);
      if (
        lineAnchor &&
        Number(lineAnchor[1]) > 0 &&
        Number(lineAnchor[2] ?? lineAnchor[1]) >= Number(lineAnchor[1]) &&
        Number(lineAnchor[2] ?? lineAnchor[1]) <= targetInfo.lines
      )
        continue;
      if (!targetInfo.anchors.has(fragment)) fail("missing anchor");
    }
  }
  return failures;
}

const shapeKey = (shape) => JSON.stringify(shape);
const dispatchKey = (row) => `${row.path}#${row.id}`;
export const dispatchFingerprint = (row) => hash(row.dispatch);
export const validDispatch = (value) => {
  if (typeof value !== "string") return false;
  const match =
    /^(?:planning|ideation|resume|scope expand|conversation only|analysis|operator override):([^\r\n\u2028\u2029]*)$/.exec(
      value,
    );
  return Boolean(
    match && [...match[1].trim()].length <= 240 && match[1].trim().length,
  );
};

function planningDecision(root, reference) {
  if (typeof reference !== "string") return false;
  const [file, anchor] = reference.split("#");
  const path = resolve(root, file);
  if (
    !anchor ||
    !file.startsWith(`${docRelative(root, "planning")}/`) ||
    !inside(docPath(root, "planning"), path) ||
    !existsSync(path) ||
    !statSync(path).isFile() ||
    !inside(realpathSync(root), realpathSync(path))
  )
    return false;
  return anchors(readFileSync(path, "utf8")).has(anchor);
}

export function checkDocs(root, { ceilings, baseline, files } = {}) {
  ceilings ??= JSON.parse(
    readFileSync(docPath(root, "control", "doc-ceilings.json"), "utf8"),
  );
  baseline ??= JSON.parse(
    readFileSync(docPath(root, "control", "doc-baseline.json"), "utf8"),
  );
  if (ceilings.schemaVersion !== 1 || baseline.schemaVersion !== 1)
    throw new Error("Unsupported document control schema");
  if (
    !ceilings.documents ||
    !baseline.products ||
    !baseline.dispatches ||
    !Array.isArray(baseline.links)
  )
    throw new Error("Invalid document control records");
  for (const entry of baseline.links) {
    if (
      ![entry.file, entry.href, entry.reason].every(
        (value) => typeof value === "string" && value.length,
      ) ||
      !Number.isSafeInteger(entry.count) ||
      entry.count < 1
    )
      throw new Error(
        "Historical link exceptions require a source, destination, reason and positive safe-integer count",
      );
  }
  let previous = null;
  const controlPath = docRelative(root, "control", "doc-ceilings.json");
  let head = null;
  try {
    head = runGit(root, ["rev-parse", "--verify", "HEAD"]);
  } catch {
    /* An unborn fixture has no prior controls. */
  }
  // A new file has no previous ceiling; malformed committed data must fail.
  if (
    head &&
    runGitPathList(root, [
      "ls-tree",
      "-r",
      "--name-only",
      "-z",
      head,
      "--",
      controlPath,
    ]).length
  )
    previous = JSON.parse(runGit(root, ["show", `${head}:${controlPath}`]));
  const failures = [],
    rows = [];
  const directory = docPath(root, "product");
  const products = readdirSync(directory, { recursive: true })
    .filter((file) => file.endsWith(".md"))
    .sort();
  for (const name of products) {
    const file = docRelative(root, "product", name);
    const measured = productContent(
      name,
      readFileSync(join(directory, name), "utf8"),
    );
    failures.push(...measured.failures);
    const entry = ceilings.documents[name];
    if (!entry)
      failures.push(
        `${file}: missing ceiling; record non-exempt bytes plus two per cent with a dated decision`,
      );
    else if (
      !Number.isSafeInteger(entry.ceiling) ||
      entry.ceiling < 0 ||
      !Number.isSafeInteger(entry.nonExemptBytesAtLanding) ||
      entry.nonExemptBytesAtLanding < 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date ?? "") ||
      !entry.decision?.trim()
    )
      failures.push(`${file}: invalid ceiling metadata`);
    else if (measured.bytes > entry.ceiling)
      failures.push(
        `${file}: ${measured.bytes - entry.ceiling} bytes over ceiling; edit in place or cite a planning decision to raise it`,
      );
    if (
      entry &&
      (entry.ceiling > Math.ceil(entry.nonExemptBytesAtLanding * 1.02) ||
        entry.ceiling > (previous?.documents?.[name]?.ceiling ?? Infinity)) &&
      !planningDecision(root, entry.decision)
    )
      failures.push(
        `${file}: raising a ceiling requires a named planning decision with a resolving anchor`,
      );
    rows.push({
      document: file,
      bytes: measured.bytes,
      exemptBytes: measured.exemptBytes,
      ceiling: entry?.ceiling ?? null,
      headroom: entry ? entry.ceiling - measured.bytes : null,
    });
    const available = new Map();
    for (const shape of baseline.products[name] ?? [])
      available.set(shapeKey(shape), (available.get(shapeKey(shape)) ?? 0) + 1);
    for (const shape of measured.shapes) {
      const key = shapeKey(shape),
        count = available.get(key) ?? 0;
      if (count) available.set(key, count - 1);
      else
        failures.push(
          `${file}#${shape.heading}: new ${shape.kind}; ${shape.kind === "receipt" ? "edit the sentence the change amends; a receipt belongs in the order's evidence README" : "candidates go to the planning map"}`,
        );
    }
  }
  for (const name of Object.keys(ceilings.documents))
    if (!products.includes(name))
      failures.push(
        `${docRelative(root, "product", name)}: ceiling names a missing product document`,
      );
  for (const row of readDecisions(root)) {
    if (baseline.dispatches[dispatchKey(row)] === dispatchFingerprint(row))
      continue;
    if (!validDispatch(row.dispatch))
      failures.push(
        `${dispatchKey(row)}: dispatch needs a control prefix and at most 240 characters of paraphrase on one line`,
      );
  }
  const exceptions = new Map();
  for (const entry of baseline.links)
    exceptions.set(
      `${entry.file}\0${entry.href}\0${entry.reason}`,
      entry.count,
    );
  let historicalLinks = 0;
  for (const failure of linkFailures(root, files)) {
    const key = `${failure.file}\0${failure.href}\0${failure.reason}`,
      count = exceptions.get(key) ?? 0;
    if (count > 0) {
      exceptions.set(key, count - 1);
      historicalLinks++;
    } else
      failures.push(
        `${failure.file}:${failure.line}: ${failure.reason}: ${failure.href}`,
      );
  }
  return { rows, failures, historicalLinks };
}

if (isMainModule(import.meta.url)) {
  try {
    if (process.argv.length > 2)
      throw new Error("usage: node scripts/docs-check.mjs");
    const result = checkDocs(findLaunchpad());
    console.log("Document | Bytes | Exempt bytes | Ceiling | Headroom");
    for (const row of result.rows)
      console.log(
        `${row.document} | ${row.bytes} | ${row.exemptBytes} | ${row.ceiling ?? "missing"} | ${row.headroom ?? "unknown"}`,
      );
    for (const failure of result.failures) console.error(`FAIL ${failure}`);
    console.log(
      `${result.failures.length ? "FAIL" : "PASS"} docs check: ${result.rows.length} product documents; ${result.historicalLinks} declared historical link occurrences; ${result.failures.length} failures`,
    );
    process.exitCode = result.failures.length ? 1 : 0;
  } catch (error) {
    console.error(`FAIL docs check: ${error.message}`);
    process.exitCode = 1;
  }
}
