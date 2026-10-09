#!/usr/bin/env node
import { sha256Hex as hash } from "./lib/helpers.mjs";

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
import { runGitPathList } from "./lib/git.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { readDecisions } from "./lib/meta.mjs";
import {
  RELEASE_HISTORY,
  checkReleaseHistory,
  historyCommand,
  historyEnd,
  historyStart,
  markerLine,
} from "./lib/release-history.mjs";
import { parsers } from "prettier/plugins/markdown.mjs";

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
  // One generated block is registered, by product path and marker name: the
  // roadmap's release history (WO-086), whose rows the check below compares
  // with their recorded tags. Any other marker pair, and this one anywhere
  // else or malformed, exempts nothing; no heading exempts anything.
  if (file === RELEASE_HISTORY.product) {
    const mentions = source.split("\n").filter(markerLine).length;
    const markers = ast.children.filter(
      (node) =>
        node.type === "html" &&
        [historyStart, historyEnd].includes(node.value.trim()),
    );
    if (
      mentions === 2 &&
      markers.length === 2 &&
      markers[0].value.trim() === historyStart &&
      markers[1].value.trim() === historyEnd
    )
      ranges.push([start(markers[0]), end(markers[1])]);
    else if (mentions)
      failures.push(
        `the registered ${RELEASE_HISTORY.marker} block needs exactly one ordered pair of top-level marker lines; until then it exempts nothing`,
      );
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

// A prospective advisory with content fingerprints for historical records.
// The output names records and never repeats the attributed words. A field an
// operator-named key attributes needs no quotation to count; a paraphrase
// marked as one does not count.
const PARAPHRASED = /^Paraphrase:/u;
const OPERATOR_FIELD = /^operator[A-Z]/u;
const CAPTURE_DIGEST = /^sha256:[0-9a-f]{64}$/u;
const attributedWords = (text) =>
  /\boperator\b[^.!?]*(?:["“]|(?:\s|:)['‘])/iu.test(normalized(text));
const quotedDispatch = (text) => /["“]|(?:^|[\s:])['‘]/u.test(text);
const captureCitation = (text) =>
  /(?:SHA-256[\s:()=-]*(?:sha256:)?|--capture-hash[\s=]+(?:sha256:)?)[a-f0-9]{64}\b/iu.test(
    text,
  );
function* provenanceRecords(paragraph, source) {
  // Several header fields can share a paragraph. Only a bold label at a
  // line boundary starts a field; inline bold prose stays in its record.
  const fields = paragraph.children
    .map((child, index) => ({ child, index, label: renderedText(child) }))
    .filter(
      ({ child, label }) =>
        child.type === "strong" &&
        /^[^:\r\n]+:$/u.test(label) &&
        /(?:^|\n)[\t ]*$/u.test(source.slice(start(paragraph), start(child))),
    );
  const textBetween = (from, to) =>
    paragraph.children.slice(from, to).map(renderedText).join("").trimEnd();
  // Preserve the original plain-label standalone paragraph form too.
  const leading = textBetween(0, fields[0]?.index);
  if (/^(?:Nomination )?Provenance:/iu.test(leading)) yield leading;
  for (let index = 0; index < fields.length; index++)
    if (/^(?:Nomination )?Provenance:$/iu.test(fields[index].label))
      yield textBetween(fields[index].index, fields[index + 1]?.index);
}
export function operatorWordFindings(root, files) {
  const findings = [];
  const push = (file, record, text, dispatch = "", line) =>
    findings.push({
      file,
      record,
      fingerprint: hash(normalized(JSON.stringify([text, dispatch]))),
      ...(line ? { line } : {}),
    });
  const check = (file, record, text, dispatch = "", captureText = text) => {
    if (
      (!attributedWords(text) && !quotedDispatch(dispatch)) ||
      captureCitation(captureText)
    )
      return;
    push(file, record, text, dispatch);
  };
  const orders = docPath(root, "workOrders");
  if (existsSync(orders))
    for (const name of readdirSync(orders)
      .filter((name) => /^WO-\d{3}.*\.md$/u.test(name))
      .sort()) {
      const file = docRelative(root, "workOrders", name),
        source = readFileSync(join(orders, name), "utf8");
      // Every provenance field counts in document order, whether or not it
      // attributes words, so a record's key never depends on an earlier one.
      let ordinal = 0;
      for (const node of nodes(parseMarkdown(source))) {
        if (node.type !== "paragraph") continue;
        for (const text of provenanceRecords(node, source))
          check(
            file,
            ++ordinal === 1 ? "provenance" : `provenance-${ordinal}`,
            text,
          );
      }
    }
  // A decisions file is read and split once for all of its records.
  const sections = new Map();
  for (const row of readDecisions(root)) {
    if (!sections.has(row.path))
      sections.set(
        row.path,
        readFileSync(join(root, row.path), "utf8").split(/(?=^##\s)/mu),
      );
    const section =
      sections
        .get(row.path)
        .find((part) => new RegExp(`^##\\s+${row.id}\\b`, "u").test(part)) ??
      "";
    // A JSON block is removed whole from its fence line, so a backquote run
    // inside one of its strings cannot open a fence that swallows the rest.
    const prose = section
      .replace(/^```json\n[\s\S]*?^```[^\n]*/gmu, "")
      .replace(/```[\s\S]*?```/gu, "");
    const captureText = JSON.stringify(row) + prose;
    check(
      row.path,
      row.id,
      `${row.decision}\n${prose}`,
      row.dispatch,
      captureText,
    );
    // The fields that quote words are read too, each under its own record.
    const fields = [
      ...(Array.isArray(row.evidence) ? row.evidence : []).map(
        (text, index) => [`evidence-${index + 1}`, text],
      ),
      ...(Array.isArray(row.rejected) ? row.rejected : []).map(
        (entry, index) => [`rejected-${index + 1}.reason`, entry?.reason],
      ),
      ...["reason", "misread", "meant"].map((key) => [key, row[key]]),
    ];
    for (const [key, text] of fields)
      if (typeof text === "string")
        check(row.path, `${row.id}/${key}`, text, "", captureText);
    // An operator-named field attributes its value by its key alone.
    for (const key of Object.keys(row)) {
      if (!OPERATOR_FIELD.test(key) || key === "operatorQuote") continue;
      const values = [row[key]].flat();
      values.forEach((value, index) => {
        if (
          typeof value !== "string" ||
          PARAPHRASED.test(value) ||
          captureCitation(captureText)
        )
          return;
        push(
          row.path,
          `${row.id}/${key}${values.length > 1 ? `-${index + 1}` : ""}`,
          value,
        );
      });
    }
  }
  // Reports and planning documents: each paragraph that attributes words is a
  // record keyed by its own content, so an insertion above it keeps its key.
  const documentRoots = ["verifications", "finalReviews", "planning"].map(
    (key) => docPath(root, key),
  );
  for (const file of files ?? markdownFiles(root)) {
    const absolute = resolve(root, file);
    if (!documentRoots.some((path) => inside(path, absolute))) continue;
    const source = readFileSync(absolute, "utf8");
    if (!/operator/iu.test(source)) continue;
    const seen = new Map();
    for (const node of nodes(parseMarkdown(source))) {
      if (node.type !== "paragraph") continue;
      const text = renderedText(node);
      if (!attributedWords(text) || captureCitation(text)) continue;
      const base = `paragraph-${hash(normalized(text)).slice(0, 12)}`;
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      push(
        file,
        count === 1 ? base : `${base}-${count}`,
        text,
        "",
        node.position?.start?.line,
      );
    }
  }
  return findings;
}

/** A typed operator quotation must carry the capture digest of the words it
 * quotes; one that lacks it is a failure, never an advisory. */
export function operatorQuoteFailures(rows) {
  const failures = [];
  for (const row of rows) {
    if (row.operatorQuote === undefined) continue;
    [row.operatorQuote].flat().forEach((quote, index) => {
      if (!(
        quote &&
        typeof quote === "object" &&
        typeof quote.text === "string" &&
        quote.text.trim() &&
        CAPTURE_DIGEST.test(quote.captureSha256 ?? "")
      ))
        failures.push(
          `${row.path}#${row.id}: operatorQuote ${index + 1} needs text and captureSha256 (sha256:<digest> of the captured words in ignored intake); paraphrase instead of quoting`,
        );
    });
  }
  return failures;
}

// A private absolute path: a home directory or a private temporary directory.
// Placeholders such as /Users/... and relative tails such as .runtime/tmp/ are
// not paths; a bare /tmp/ mention names no file.
const HOME_PATH =
  /(?<![\w.~-])\/(?:(?:Users|home)\/[A-Za-z0-9_][\w.-]*|(?:private\/)?(?:var\/folders|tmp)\/[A-Za-z0-9_])/u;
export function homePathFindings(root, files = markdownFiles(root)) {
  const findings = [];
  for (const file of files)
    readFileSync(join(root, file), "utf8")
      .split("\n")
      .forEach((text, index) => {
        if (HOME_PATH.test(text))
          findings.push({
            file,
            line: index + 1,
            fingerprint: hash(normalized(text)),
          });
      });
  return findings;
}

export function operatorWordAdvisories(root, baseline = {}, files) {
  const findings = operatorWordFindings(root, files);
  const current = findings.filter(
    (row) => baseline[`${row.file}#${row.record}`] !== row.fingerprint,
  );
  return {
    current: current.length,
    historical: findings.length - current.length,
    rows: current,
  };
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
  const homePaths = baseline.homePaths ?? {};
  if (
    homePaths === null ||
    typeof homePaths !== "object" ||
    Array.isArray(homePaths) ||
    Object.values(homePaths).some(
      (list) =>
        !Array.isArray(list) ||
        list.some((fingerprint) => !/^[0-9a-f]{64}$/u.test(fingerprint)),
    )
  )
    throw new Error(
      "Historical home-path exceptions require a file and SHA-256 line fingerprints",
    );
  files ??= markdownFiles(root);
  const failures = [],
    rows = [];
  const directory = docPath(root, "product");
  const products = readdirSync(directory, { recursive: true })
    .filter((file) => file.endsWith(".md"))
    .sort();
  const notices = [];
  for (const name of products) {
    const file = docRelative(root, "product", name);
    const source = readFileSync(join(directory, name), "utf8");
    const measured = productContent(name, source);
    failures.push(...measured.failures.map((failure) => `${file}: ${failure}`));
    if (name === RELEASE_HISTORY.product) {
      // The exemption stands on this comparison: the index's rule for tags.
      const history = checkReleaseHistory(root, source, file);
      failures.push(...history.failures);
      if (history.newer.length)
        notices.push(
          `NEWER local release tags not in ${file}: ${history.newer.join(", ")}; the table stays valid for its recorded tags; run ${historyCommand} to add them`,
        );
    }
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
      typeof entry.decision !== "string" ||
      !entry.decision.trim()
    )
      failures.push(`${file}: invalid ceiling metadata`);
    else if (measured.bytes > entry.ceiling)
      notices.push(
        `ADVISORY ${file}: ${measured.bytes - entry.ceiling} bytes over ceiling; planning resets ceilings`,
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
  const decisions = readDecisions(root);
  for (const row of decisions) {
    if (baseline.dispatches[dispatchKey(row)] === dispatchFingerprint(row))
      continue;
    if (!validDispatch(row.dispatch))
      failures.push(
        `${dispatchKey(row)}: dispatch needs a control prefix and at most 240 characters of paraphrase on one line`,
      );
  }
  failures.push(...operatorQuoteFailures(decisions));
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
  // A line that holds a private path today passes by its fingerprint; a new
  // or edited one fails. The failure never prints the path.
  const remainingHomePaths = new Map(
    Object.entries(homePaths).map(([file, list]) => [file, [...list]]),
  );
  let historicalHomePaths = 0;
  for (const row of homePathFindings(root, files)) {
    const list = remainingHomePaths.get(row.file) ?? [];
    const at = list.indexOf(row.fingerprint);
    if (at >= 0) {
      list.splice(at, 1);
      historicalHomePaths++;
    } else
      failures.push(
        `${row.file}:${row.line}: absolute home or private temporary path; write a repository-relative path or a placeholder such as <worktree>/ or <tmp>/`,
      );
  }
  const operatorWords = operatorWordAdvisories(
    root,
    baseline.operatorWords,
    files,
  );
  return {
    rows,
    failures,
    historicalLinks,
    historicalHomePaths,
    notices,
    operatorWords,
  };
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
    for (const notice of result.notices) console.log(notice);
    for (const row of result.operatorWords.rows)
      console.log(
        `ADVISORY ${row.file}#${row.record}: operator-attributed words need a capture digest (SHA-256 or --capture-hash), or a paraphrase`,
      );
    console.log(
      `Operator-word advisories: ${result.operatorWords.current}; historical baseline: ${result.operatorWords.historical}.`,
    );
    for (const failure of result.failures) console.error(`FAIL ${failure}`);
    console.log(
      `${result.failures.length ? "FAIL" : "PASS"} docs check: ${result.rows.length} product documents; ${result.historicalLinks} declared historical link occurrences; ${result.historicalHomePaths} declared historical home-path lines; ${result.failures.length} failures`,
    );
    process.exitCode = result.failures.length ? 1 : 0;
  } catch (error) {
    console.error(`FAIL docs check: ${error.message}`);
    process.exitCode = 1;
  }
}
