#!/usr/bin/env node
import {
  existsSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fold, foldWorkOrders, parseControlEvents } from "./lib/control.mjs";
import { runGit, runGitPathList } from "./lib/git.mjs";
import {
  containedRegularFile,
  parseJson,
  workOrderAuthorityPath,
} from "./lib/paths.mjs";
import {
  compareVersions,
  localReleaseRecords,
  localReleaseTags,
  semver,
  strictVersionsIn,
} from "./lib/release-records.mjs";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = "docs/work-orders/README.md";
const logPath = "docs/control/resume.jsonl";
const snapshotPrefix = "<!-- dotln-work-order-tags: ";
const historicalIds = new Set(["WO-001", "WO-002"]);
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const uniqueSorted = (values) => [...new Set(values)].sort(compare);

// This is a tolerant view of existing prose, not another activation validator.
// Unknown fields are named alongside their source path in the rendered table.
export const parseHeader = (markdown, path) => {
  const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);
  const first = lines.findIndex((line) => line.trim());
  const title = /^#\s+(.+?)\s*$/.exec(
    (lines[first] ?? "").replace(/[ \t]+#+[ \t]*$/, ""),
  )?.[1];
  const boundary = lines.findIndex(
    (line, index) =>
      index > first &&
      (/^#{1,6}\s/.test(line) || /^\*\*Objective:\*\*/.test(line)),
  );
  const header = lines.slice(first + 1, boundary < 0 ? lines.length : boundary);
  const field = (label) => {
    if (!title) return undefined;
    const prefix = `**${label}:**`;
    const positions = header.flatMap((line, index) =>
      line.startsWith(prefix) ? [index] : [],
    );
    if (positions.length !== 1) return undefined;
    const start = positions[0];
    const parts = [header[start].slice(prefix.length).trim()];
    if (!parts[0]) return undefined;
    for (const line of header.slice(start + 1)) {
      if (!line.trim() || /^\*\*[^*]+:\*\*/.test(line)) break;
      parts.push(line.trim());
    }
    return parts.join(" ").replace(/\s+/g, " ");
  };
  const versions = strictVersionsIn(title ?? "");
  const version = !title
    ? "unknown"
    : versions.length === 1 && semver(versions[0])
      ? versions[0]
      : versions.length || /\bv\d/.test(title)
        ? "malformed"
        : "unassigned";
  const depends = field("Depends on");
  return {
    path,
    title: title ?? "unknown",
    version,
    model: field("Model") ?? "unknown",
    effort: field("Effort") ?? "unknown",
    dependencies:
      depends === undefined
        ? undefined
        : uniqueSorted(
            [...depends.matchAll(/\bWO-\d{3}\b/g)].map(([id]) => id),
          ),
  };
};

const readContained = (root, path) => {
  const file = join(root, path);
  if (!containedRegularFile(file, root))
    throw new Error(`${path}: expected a contained regular file`);
  return readFileSync(file, "utf8");
};

const taggedControl = (root, tag) => {
  const revision = `refs/tags/${tag}`;
  const paths = runGitPathList(root, [
    "ls-tree",
    "-r",
    "--name-only",
    "-z",
    revision,
    "--",
    logPath,
  ]);
  if (!paths.includes(logPath)) return undefined;
  const events = parseControlEvents(
    runGit(root, ["show", `${revision}:${logPath}`]),
  );
  fold(events); // Use the canonical vocabulary for tagged logs too.
  return events;
};

export const readIndex = (root, releases = localReleaseRecords(root)) => {
  if (
    !realpathSync(join(root, "docs/work-orders")).startsWith(
      `${realpathSync(root)}${sep}`,
    )
  )
    throw new Error(
      "docs/work-orders: directory must remain inside the repository",
    );
  const events = parseControlEvents(readContained(root, logPath));
  const { current, orders } = foldWorkOrders(events);
  const closed = new Set(
    [...orders]
      .filter(([, row]) => row.state.phase === "closed")
      .map(([id]) => id),
  );
  const tagLogs = new Map();
  const commitLogs = new Map();
  const prefixMatches = (prior, length = prior.length) =>
    prior
      .slice(0, length)
      .every(
        (event, index) =>
          JSON.stringify(event) === JSON.stringify(events[index]),
      );
  const closeTime = ({ closeOrdinal, closeRecordedAt }) => {
    if (closeRecordedAt) return Date.parse(closeRecordedAt);
    // Legacy close events have no append time. Their first committed prefix is
    // an explicitly weaker, second-precision observation, not a recovered event.
    const commits = runGit(root, [
      "rev-list",
      "--reverse",
      "HEAD",
      "--",
      logPath,
    ])
      .split("\n")
      .filter(Boolean);
    for (const commit of commits) {
      if (!commitLogs.has(commit))
        commitLogs.set(
          commit,
          parseControlEvents(runGit(root, ["show", `${commit}:${logPath}`])),
        );
      const prior = commitLogs.get(commit);
      if (prior.length >= closeOrdinal && prefixMatches(prior, closeOrdinal))
        return (
          Number(runGit(root, ["show", "-s", "--format=%ct", commit])) * 1000
        );
    }
    return undefined;
  };
  const beforeClose = (evidence) => {
    if (releases.length === 0) return undefined;
    const cutoff = closeTime(evidence);
    return releases
      .filter(({ name, taggedAt }) => {
        if (cutoff === undefined || taggedAt === undefined || taggedAt > cutoff)
          return false;
        if (!tagLogs.has(name)) tagLogs.set(name, taggedControl(root, name));
        const prior = tagLogs.get(name);
        return (
          prior !== undefined &&
          prior.length < evidence.closeOrdinal &&
          prefixMatches(prior)
        );
      })
      .at(-1);
  };
  const ids = new Set();
  const rows = readdirSync(join(root, "docs/work-orders"))
    .filter((name) => /^WO-.*\.md$/.test(name))
    .map((name) => {
      const id = /^(WO-\d{3})-/.exec(name)?.[1];
      const path = `docs/work-orders/${name}`;
      workOrderAuthorityPath(root, id, path);
      if (ids.has(id))
        throw new Error(`duplicate work-order id ${id}: ${path}`);
      ids.add(id);
      const header = parseHeader(readContained(root, path), path);
      const evidence = orders.get(id);
      if (evidence && evidence.state.workOrderPath !== path)
        throw new Error(`${id}: control authority path differs from ${path}`);
      const state = evidence?.state;
      const historical = !state && historicalIds.has(id);
      const active = id === current.workOrderId && current.phase !== "closed";
      const phase =
        state?.phase ?? (historical ? "historical (time-indexed)" : "draft");
      const section = active
        ? "Active"
        : phase === "closed"
          ? "Closed"
          : historical
            ? "Historical"
            : "Open";
      const blocked = header.dependencies?.filter(
        (dependency) => !closed.has(dependency),
      );
      const dependencyState =
        blocked === undefined
          ? "unknown"
          : blocked.length
            ? `blocked on ${blocked.join(", ")}`
            : "dependency-ready";
      const release = releases.find(({ workOrders }) =>
        workOrders.includes(id),
      );
      let disposition = release
        ? `${release.name} (${release.historical ? "historical record" : release.manifest.workOrder.id === id ? "manifest workOrder.id" : "manifest changedFiles"})`
        : "none recorded";
      if (phase === "closed" && !release) {
        const prior = beforeClose(evidence);
        disposition =
          prior &&
          semver(header.version) &&
          compareVersions(header.version, prior.name) < 0
            ? `no-release close (inferred: ${header.version} below ${prior.name} before close)`
            : "unreleased";
      }
      return {
        id,
        ...header,
        section,
        phase,
        dependencyState,
        closed,
        state,
        finalReviewVerdict: evidence?.finalReviewVerdict,
        disposition,
      };
    })
    .sort((left, right) => compare(left.id, right.id));
  for (const [id, { state }] of orders)
    if (!ids.has(id))
      throw new Error(
        `${id}: control authority is missing from the catalog: ${state.workOrderPath}`,
      );
  return { rows, releases };
};

const cell = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replaceAll("\\", "&#92;")
    .replaceAll("`", "&#96;")
    .replaceAll("[", "&#91;")
    .replaceAll("]", "&#93;")
    .replace(/\s+/g, " ")
    .trim();
const link = (label, path) =>
  `[${cell(label)}](${path.split("/").map(encodeURIComponent).join("/")})`;
const report = (id, verdict, path) =>
  id
    ? `${path ? link(id, `../../${path}`) : cell(id)} (${cell(verdict ?? "pending")})`
    : "none recorded";

export const renderIndex = ({ rows, releases }) => {
  const lines = [
    "# Work-order index",
    "",
    "Generated by `npm run work-orders -- index`; do not edit cells by hand.",
    "`npm run work-orders -- index --check` checks current headers/control against the recorded tag snapshot. No command fetches tags.",
    "",
    `${snapshotPrefix}${JSON.stringify(releases.map(({ name, object }) => ({ name, object })))} -->`,
    "",
    "Sources and limits:",
    "",
    "- **Header observation:** each authority's H1, sole strict application version, Model, Effort, and Depends on paragraph. Unknown or malformed metadata is attributed by the Path column; it is never guessed.",
    "- **Control evidence:** the shared fold of `docs/control/resume.jsonl`, reduced per work order in append order. Closed means a passing final review; it does not independently prove merge or publication. Report verdicts come from events, not inferred report contents.",
    "- **Local release evidence:** the earliest numeric annotated DotLn tag whose manifest names the order or a changed final-review path. The manifest-free v0.2.0 exception uses `docs/releases/v0.2.0.md`. Other tags are not release evidence. Remote publication is not checked.",
    "- **Derived dependency status:** all distinct WO-NNN tokens in Depends on are compared with the control-closed set. This conservative text view includes recommended or independent references in that paragraph; human preflight interprets their meaning. An absent field is unknown; a present field with no WO tokens has no computed blocker.",
    "- **Inferred no-release close:** only an unmatched closed order with a strict H1 version below a local release whose tagged control prefix precedes its close and whose tag time is no later than the close observation. That observation is recordedAt, or the first committed close prefix for legacy events (second precision, not recovered append time). Absent evidence stays unreleased. Release inclusion can follow a no-release close; local tags do not prove their remote publication time.",
    "- **Time-indexed history:** WO-001 and WO-002 are explicit pre-control cases, never completed merely because events are absent. They do not enter the control-closed dependency set.",
    "",
    `Local annotated release tags used: ${releases.map(({ name }) => `\`${name}\``).join(", ") || "none"}.`,
    "",
    "Tag observation is explicitly refreshed by `index`. Check requires every recorded tag object to remain available and unchanged; newer local release tags are reported as newer evidence, without invalidating this snapshot. This avoids making a committed source release fail its own tests immediately after tagging. Header/control changes still require regeneration after lifecycle transitions.",
    "",
    "See [the human planning map](../planning/work-order-map.md) for recommendation, rationale, tracks, and activation preflight. Dependency-ready does not grant activation or effect authority.",
    "",
  ];
  for (const section of ["Active", "Open", "Closed", "Historical"]) {
    lines.push(`## ${section}`, "");
    const selected = rows.filter((row) => row.section === section);
    if (selected.length === 0) {
      lines.push("None.", "");
      continue;
    }
    lines.push(
      "| ID | Title | Version | Phase / dependency status | Latest verification | Latest final review | Release disposition | Model | Effort | Hard dependency tokens / satisfaction | Path |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const row of selected) {
      const state = row.state;
      lines.push(
        `| ${[
          cell(row.id),
          cell(row.title),
          cell(row.version),
          cell(
            `${row.phase}${["Active", "Open"].includes(section) ? `; ${row.dependencyState}` : ""}`,
          ),
          report(
            state?.latestVerificationId,
            state?.latestVerdict,
            state?.latestVerificationPath,
          ),
          report(
            state?.finalReviewId,
            row.finalReviewVerdict,
            state?.finalReviewPath,
          ),
          cell(row.disposition),
          cell(row.model),
          cell(row.effort),
          cell(
            row.dependencies
              ?.map(
                (id) =>
                  `${id}: ${row.closed.has(id) ? "satisfied (closed)" : "not control-closed"}`,
              )
              .join("; ") || (row.dependencies ? "none named" : "unknown"),
          ),
          link(row.path, basename(row.path)),
        ].join(" | ")} |`,
      );
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
};

export const readTagSnapshot = (source) => {
  const records = source
    .split("\n")
    .filter((line) => line.startsWith(snapshotPrefix));
  if (records.length !== 1 || !records[0].endsWith(" -->"))
    throw new Error(
      `${indexPath}: missing or malformed tag snapshot; run npm run work-orders -- index`,
    );
  const snapshot = parseJson(
    records[0].slice(snapshotPrefix.length, -4),
    `${indexPath} tag snapshot`,
  );
  if (
    !Array.isArray(snapshot) ||
    snapshot.some(
      (tag) =>
        !tag ||
        typeof tag !== "object" ||
        !semver(tag.name) ||
        !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(tag.object) ||
        Object.keys(tag).sort().join(",") !== "name,object",
    ) ||
    new Set(snapshot.map(({ name }) => name)).size !== snapshot.length
  )
    throw new Error(`${indexPath}: invalid tag snapshot`);
  return snapshot;
};

export const checkIndex = (expected, actual) => {
  if (expected === actual) return;
  const before = actual?.split("\n") ?? [];
  const after = expected.split("\n");
  const line = after.findIndex((value, index) => value !== before[index]);
  throw new Error(
    `${indexPath} is stale at line ${line < 0 ? after.length + 1 : line + 1}; run npm run work-orders -- index`,
  );
};

export const main = (args = process.argv.slice(2)) => {
  if (
    args[0] !== "index" ||
    args.length > 2 ||
    (args.length === 2 && args[1] !== "--check")
  )
    throw new Error("usage: work-orders index [--check]");
  const destination = join(toolRoot, indexPath);
  if (existsSync(destination) && !containedRegularFile(destination, toolRoot))
    throw new Error(`${indexPath}: expected a contained regular file`);
  if (args.includes("--check")) {
    if (!existsSync(destination))
      throw new Error(
        `${indexPath} is stale at line 1; run npm run work-orders -- index`,
      );
    const actual = readFileSync(destination, "utf8");
    const releases = localReleaseRecords(toolRoot, readTagSnapshot(actual));
    checkIndex(renderIndex(readIndex(toolRoot, releases)), actual);
    const names = new Set(releases.map(({ name }) => name));
    const newer = localReleaseTags(toolRoot).filter(
      ({ name }) => !names.has(name),
    );
    if (newer.length)
      process.stdout.write(
        `NEWER local release evidence: ${newer.map(({ name }) => name).join(", ")}; additional manifests are not validated by --check; run npm run work-orders -- index to refresh the tag observation\n`,
      );
    process.stdout.write(`PASS ${indexPath} is current\n`);
  } else {
    const expected = renderIndex(readIndex(toolRoot));
    const temporary = `${destination}.tmp`;
    writeFileSync(temporary, expected, { flag: "wx" });
    renameSync(temporary, destination);
    process.stdout.write(`Generated ${indexPath}\n`);
  }
};

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  try {
    main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
