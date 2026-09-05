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
import { LEGACY_CONTROL_PATH } from "./lib/control.mjs";
import { readControl } from "./lib/control-store.mjs";
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
const planningPath = "docs/planning/work-order-map.md";
const snapshotPrefix = "<!-- dotln-work-order-tags: ";
const historicalIds = new Set(["WO-001", "WO-002"]);
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const uniqueSorted = (values) => [...new Set(values)].sort(compare);

// This is a tolerant view of existing prose, not another activation validator.
// Unknown fields are named alongside their source path in the rendered details.
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

// Only this explicit operator-authored block selects the proposed order.
// References elsewhere in the map or a Depends on paragraph cannot select it.
export const parseSequence = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const positions = (marker) =>
    lines.flatMap((line, index) => (line.trim() === marker ? [index] : []));
  const starts = positions("<!-- dotln-work-order-sequence:start -->");
  const ends = positions("<!-- dotln-work-order-sequence:end -->");
  if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0])
    throw new Error(`${planningPath}: expected one marked proposed sequence`);
  const seen = new Set();
  return lines
    .slice(starts[0] + 1, ends[0])
    .filter((line) => line.trim())
    .map((line) => {
      const match = /^- (WO-\d{3}) — (\S(?:.*\S)?)$/u.exec(line);
      if (!match)
        throw new Error(`${planningPath}: expected '- WO-NNN — short label'`);
      const [, id, label] = match;
      if (seen.has(id))
        throw new Error(`${planningPath}: duplicate proposed order ${id}`);
      seen.add(id);
      return { id, label };
    });
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
  const control = readControl(root);
  const { orders, locations } = control;
  const tagLogs = new Map(
    releases.map(({ name }) => [name, readControl(root, `refs/tags/${name}`)]),
  );
  releases = releases.map((release) => {
    const controlSegments = [...tagLogs.get(release.name).sources.keys()];
    if (
      release.controlSegments !== undefined &&
      JSON.stringify(release.controlSegments) !==
        JSON.stringify(controlSegments)
    )
      throw new Error(
        `${release.name}: recorded control segment snapshot differs from tagged source`,
      );
    return { ...release, controlSegments };
  });
  const closed = new Set(
    [...orders]
      .filter(([, row]) => row.state.phase === "closed")
      .map(([id]) => id),
  );
  const commitLogs = new Map();
  const prefixMatches = (prior) =>
    [...prior.sources].every(([path, source]) =>
      control.sources.get(path)?.startsWith(source),
    );
  const closeTime = ({ closeOrdinal, closeRecordedAt }, segment) => {
    if (closeRecordedAt) return Date.parse(closeRecordedAt);
    // Legacy close times remain weaker first-commit observations. Ordinals
    // index their own segment; sibling merges cannot shift them.
    const commits = runGit(root, [
      "rev-list",
      "--reverse",
      "HEAD",
      "--",
      segment,
    ])
      .split("\n")
      .filter(Boolean);
    for (const commit of commits) {
      if (!commitLogs.has(commit))
        commitLogs.set(commit, readControl(root, commit));
      const prior = commitLogs.get(commit);
      const events = prior.eventSegments.get(segment) ?? [];
      const prefix = prior.sources
        .get(segment)
        ?.split("\n")
        .slice(0, closeOrdinal)
        .join("\n");
      if (
        events.length >= closeOrdinal &&
        control.sources.get(segment)?.startsWith(prefix)
      )
        return (
          Number(runGit(root, ["show", "-s", "--format=%ct", commit])) * 1000
        );
    }
    return undefined;
  };
  const beforeClose = (evidence, id) => {
    if (releases.length === 0) return undefined;
    const segment = locations.get(id);
    const cutoff = closeTime(evidence, segment);
    return releases
      .filter(({ name, taggedAt }) => {
        if (cutoff === undefined || taggedAt === undefined || taggedAt > cutoff)
          return false;
        const prior = tagLogs.get(name);
        return (
          (segment !== LEGACY_CONTROL_PATH || prior.sources.has(segment)) &&
          (prior.eventSegments.get(segment)?.length ?? 0) <
            evidence.closeOrdinal &&
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
      const active = state && state.phase !== "closed";
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
        const prior = beforeClose(evidence, id);
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
  const sequence = parseSequence(readContained(root, planningPath));
  for (const { id } of sequence)
    if (!ids.has(id))
      throw new Error(`${planningPath}: unknown proposed order ${id}`);
  return { rows, releases, sequence };
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

export const renderIndex = ({ rows, releases, sequence }) => {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const active = rows.filter((row) => row.section === "Active");
  const lines = [
    "# Work orders",
    "",
    active.length
      ? `**Now:** ${active.map((row) => `[${row.id}] — ${cell(row.phase)}`).join("; ")}.`
      : "**Now:** between work orders.",
    "",
    "## Proposed order",
    "",
  ];
  for (const { id, label } of sequence) {
    const row = byId.get(id);
    const done = row.section === "Closed";
    const status = done
      ? "final-reviewed"
      : row.section === "Active"
        ? row.phase
        : row.section === "Historical"
          ? "historical"
          : "queued";
    lines.push(
      `- [${done ? "x" : " "}] [${id}] — ${cell(label)} · **${cell(status)}**`,
    );
  }
  if (sequence.length === 0) lines.push("No proposed sequence recorded.");
  lines.push(
    "",
    "Order and short labels come from [the planning map](../planning/work-order-map.md#recommendation-and-rationale).",
    "Checks mean passing final review; release evidence and its limits are below.",
    "The sequence is a recommendation. For the selected order's legal action, use `npm run resume -- status`.",
    "",
    "This file is generated by `npm run work-orders -- index`; actors refresh it at dispatch and outcome.",
    "Edit the map's marked sequence to change the plan; do not cross off entries here.",
    "`npm run work-orders -- index --check` detects changed headers, control state, or proposed sequence.",
    "",
    "## Other open work",
    "",
  );
  const recommended = new Set(sequence.map(({ id }) => id));
  const other = rows.filter(
    (row) => row.section === "Open" && !recommended.has(row.id),
  );
  for (const row of other)
    lines.push(
      `- [${row.id}] — ${cell(row.title.replace(/^WO-\d{3}\s+[—-]\s*/, ""))}`,
    );
  if (other.length === 0) lines.push("None.");
  lines.push("", "Full evidence follows, grouped by lifecycle state.", "");
  for (const section of ["Active", "Open", "Closed", "Historical"]) {
    lines.push(`## ${section}`, "");
    const selected = rows.filter((row) => row.section === section);
    if (selected.length === 0) {
      lines.push("None.", "");
      continue;
    }
    for (const row of selected) {
      const state = row.state;
      lines.push(
        `### ${row.id}`,
        "",
        link(row.title, basename(row.path)),
        "",
        `- State: ${cell(row.phase)}.`,
        `- Application target: ${cell(row.version)}.`,
        `- Dependency reference check (conservative): ${cell(row.dependencyState)}.`,
        `- References: ${cell(row.dependencies?.map((id) => `${id}: ${row.closed.has(id) ? "satisfied (closed)" : "not control-closed"}`).join("; ") || (row.dependencies ? "none named" : "unknown"))}.`,
        `- Verification: ${report(state?.latestVerificationId, state?.latestVerdict, state?.latestVerificationPath)}.`,
        `- Final review: ${report(state?.finalReviewId, row.finalReviewVerdict, state?.finalReviewPath)}.`,
        `- Release: ${cell(row.disposition)}.`,
        `- Model: ${cell(row.model)}`,
        `- Effort: ${cell(row.effort)}`,
        `- Authority: ${link(row.path, basename(row.path))}`,
        "",
      );
    }
  }
  lines.push(...renderSources(releases));
  for (const row of rows)
    lines.push(`[${row.id}]: ${encodeURIComponent(basename(row.path))}`);
  return `${lines.join("\n").trimEnd()}\n`;
};

const renderSources = (releases) => {
  const lines = [
    "## Sources and limits",
    "",
    "- **Header observation:** each authority's H1, sole strict application version, Model, Effort, and Depends on paragraph. Unknown or malformed metadata is attributed by the Authority link; it is never guessed.",
    "- **Proposed sequence:** the marked block in the human planning map, in operator-selected order. Missing/malformed blocks, duplicate IDs, and IDs without an authority refuse. This is not a scheduler or proof of dependency eligibility.",
    "- **Control evidence:** the shared fold of legacy `docs/control/resume.jsonl` plus `docs/control/orders/WO-NNN.jsonl`, reduced independently per work order in segment append order. Closed means a passing final review; it does not independently prove merge or publication. Report verdicts come from events, not inferred report contents.",
    "- **Local release evidence:** the earliest numeric annotated DotLn tag whose manifest names the order or a changed final-review path. The manifest-free v0.2.0 exception uses `docs/releases/v0.2.0.md`. Other tags are not release evidence. Remote publication is not checked.",
    "- **Derived dependency status:** all distinct WO-NNN tokens in Depends on are compared with the control-closed set. This conservative text view includes recommended or independent references in that paragraph; human preflight interprets their meaning. An absent field is unknown; a present field with no WO tokens has no computed blocker.",
    "- **Inferred no-release close:** only an unmatched closed order with a strict H1 version below a local release whose per-segment tagged control prefix precedes its close and whose tag time is no later than the close observation. That observation is recordedAt, or the first committed close prefix for legacy events (second precision, not recovered append time). Absent evidence stays unreleased. Release inclusion can follow a no-release close; local tags do not prove their remote publication time.",
    "- **Time-indexed history:** WO-001 and WO-002 are explicit pre-control cases, never completed merely because events are absent. They do not enter the control-closed dependency set.",
    "",
    `Local annotated release tags used: ${releases.map(({ name }) => `\`${name}\``).join(", ") || "none"}.`,
    "",
    "Tag observation is explicitly refreshed by `index`. Check requires every recorded tag object to remain available and unchanged; newer local release tags are reported as newer evidence, without invalidating this snapshot. This avoids making a committed source release fail its own tests immediately after tagging. Header/control changes still require regeneration after lifecycle transitions.",
    "",
    "See [the human planning map](../planning/work-order-map.md) for recommendation, rationale, tracks, and activation preflight. Dependency-ready does not grant activation or effect authority.",
    "",
  ];
  lines.push(
    `${snapshotPrefix}${JSON.stringify(releases.map(({ name, object, controlSegments }) => ({ name, object, controlSegments })))} -->`,
    "",
  );
  return lines;
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
        !["name,object", "controlSegments,name,object"].includes(
          Object.keys(tag).sort().join(","),
        ) ||
        (tag.controlSegments !== undefined &&
          (!Array.isArray(tag.controlSegments) ||
            tag.controlSegments.some(
              (path) =>
                path !== LEGACY_CONTROL_PATH &&
                !/^docs\/control\/orders\/WO-\d{3}\.jsonl$/.test(path),
            ) ||
            new Set(tag.controlSegments).size !== tag.controlSegments.length)),
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
