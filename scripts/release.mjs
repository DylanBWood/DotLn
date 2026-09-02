#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { release as osRelease, tmpdir } from "node:os";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  parseReleaseNotes,
  releaseNoteHeadings,
  releaseNotesPathFor,
} from "./release-notes.mjs";
import {
  environmentWithoutGhRepo,
  resolveGitHubPushTarget,
} from "./github-repository.mjs";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const evidenceCommands = [
  "npm ci",
  "npm test",
  "node packages/skeleton/dist/src/cli.js",
  "git status --porcelain",
];
const templateShape = {
  schemaVersion: 1,
  release: {
    application: null,
    commit: null,
    subject: null,
    committedAt: null,
    previousRelease: null,
    distribution: null,
  },
  workOrder: { id: null, path: null },
  versions: { root: null, components: {} },
  schemas: {
    eventEnvelope: null,
    controlLog: null,
    ir: null,
    artifactConfiguration: null,
    transformationSet: null,
  },
  cadence: { evaluable: [], deferred: [] },
  toolchain: { node: null, npm: null, typescript: null, platform: null },
  evidence: [],
  notes: {
    visiblePayoff: null,
    critical: [],
    operatorActions: [],
    changes: [],
    changedFiles: [],
    reviewArtifacts: [],
    knownLimitations: [],
  },
};
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const execute = (command, args, options = {}) =>
  spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
const outputOf = (result) => `${result.stdout ?? ""}${result.stderr ?? ""}`;
const failureOf = (result, fallback) =>
  (result.stderr || result.stdout || result.error?.message || fallback).trim();
const runGit = (cwd, args, options = {}) => {
  const result = execute("git", ["-C", cwd, ...args], options);
  if (result.status !== 0)
    throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  return result.stdout.trim();
};
const runGitPathList = (cwd, args, options = {}) => {
  const result = execute("git", ["-C", cwd, ...args], options);
  if (result.status !== 0)
    throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  if (result.stdout === "") return [];
  if (!result.stdout.endsWith("\0"))
    throw new Error(
      `git ${args.join(" ")} returned a non-NUL-terminated path list`,
    );
  return result.stdout.slice(0, -1).split("\0");
};
const optionalGitFile = (root, revision, path) => {
  const result = execute("git", ["-C", root, "show", `${revision}:${path}`]);
  if (result.status !== 0) return undefined;
  return result.stdout;
};
const controlEventsAt = (root, revision) => {
  if (!revision) return [];
  const source = optionalGitFile(root, revision, "docs/control/resume.jsonl");
  if (source === undefined || source.trim() === "") return [];
  return source
    .trimEnd()
    .split("\n")
    .map((line, index) => {
      try {
        return { raw: line, event: JSON.parse(line) };
      } catch {
        throw new Error(
          `invalid control event at ${revision}:docs/control/resume.jsonl:${index + 1}`,
        );
      }
    });
};
const addedControlEvents = (root, parent, commit) => {
  const before = controlEventsAt(root, parent);
  const after = controlEventsAt(root, commit);
  if (
    before.length > after.length ||
    before.some(({ raw }, index) => after[index]?.raw !== raw)
  )
    throw new Error(
      `control log is not append-only between ${parent ?? "the empty history"} and ${commit}`,
    );
  return after.slice(before.length).map(({ event }) => event);
};
const ensureClean = (path) => {
  const dirty = runGit(path, [
    "status",
    "--porcelain",
    "--untracked-files=all",
  ]);
  if (dirty !== "")
    throw new Error(
      `working tree is not clean: ${path} (${dirty.split("\n")[0]})`,
    );
};
const ensureNoIgnoredInfluence = (path) => {
  const allowed = (candidate) =>
    candidate.startsWith("docs/intake/") ||
    candidate
      .split("/")
      .some((segment) => segment === "node_modules" || segment === "dist") ||
    basename(candidate) === ".DS_Store" ||
    candidate.endsWith(".tsbuildinfo");
  const ignored = runGitPathList(path, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
  ]).filter((candidate) => !allowed(candidate));
  if (ignored.length > 0)
    throw new Error(
      `main checkout contains ignored material that can contaminate release evidence: ${ignored[0]}`,
    );
};
const containedRegularFile = (path, root) =>
  existsSync(path) &&
  lstatSync(path).isFile() &&
  realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);
const parseWorktrees = (root) =>
  runGit(root, ["worktree", "list", "--porcelain"])
    .split("\n\n")
    .filter(Boolean)
    .map((record) =>
      Object.fromEntries(
        record.split("\n").map((line) => {
          const at = line.indexOf(" ");
          return at < 0
            ? [line, true]
            : [line.slice(0, at), line.slice(at + 1)];
        }),
      ),
    );
const mainWorktree = () => {
  const main = parseWorktrees(toolRoot).find(
    (item) => item.branch === "refs/heads/main",
  );
  if (!main?.worktree)
    throw new Error("no main-branch control-plane worktree found");
  return resolve(main.worktree);
};
const semver = (value) => {
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
  const parts = match?.slice(1).map(Number);
  return parts?.every(Number.isSafeInteger) ? parts : undefined;
};
const compareVersions = (left, right) => {
  const a = semver(left);
  const b = semver(right);
  if (!a || !b)
    throw new Error(
      `cannot compare malformed release versions: ${left}, ${right}`,
    );
  for (let index = 0; index < 3; index += 1)
    if (a[index] !== b[index]) return a[index] - b[index];
  return 0;
};
const localTags = (root) => {
  const rows = runGit(root, [
    "for-each-ref",
    "--format=%(refname:strip=2)%00%(objecttype)%00%(objectname)%00%(*objectname)",
    "refs/tags",
  ]);
  return new Map(
    rows
      .split("\n")
      .filter(Boolean)
      .map((row) => {
        const [name, objectType, object, peeled] = row.split("\0");
        return [name, { name, objectType, object, target: peeled || object }];
      }),
  );
};
const remoteTags = (root) => {
  const rows = runGit(root, ["ls-remote", "--tags", "origin"]);
  const tags = new Map();
  for (const row of rows.split("\n").filter(Boolean)) {
    const [object, ref] = row.split(/\s+/);
    const peeled = /\^\{\}$/.test(ref);
    const name = ref.replace(/^refs\/tags\//, "").replace(/\^\{\}$/, "");
    const prior = tags.get(name) ?? { name };
    tags.set(
      name,
      peeled
        ? { ...prior, target: object, annotated: true }
        : { ...prior, object, target: prior.target ?? object },
    );
  }
  return tags;
};
const latestVersion = (...maps) => {
  const versions = [
    ...new Set(
      maps.flatMap((map) => [...map.keys()]).filter((name) => semver(name)),
    ),
  ];
  return versions.sort(compareVersions).at(-1);
};
const nestedTagConflict = (tag, ...maps) =>
  maps
    .flatMap((map) => [...map.keys()])
    .find((name) => name.startsWith(`${tag}/`));
const assertShape = (actual, expected, path = "$") => {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual))
      throw new Error(`release manifest template has wrong shape at ${path}`);
    return;
  }
  if (expected !== null && typeof expected === "object") {
    if (actual === null || typeof actual !== "object" || Array.isArray(actual))
      throw new Error(`release manifest template has wrong shape at ${path}`);
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    if (
      expectedKeys.length !== actualKeys.length ||
      expectedKeys.some((key, index) => key !== actualKeys[index])
    )
      throw new Error(`release manifest template has wrong fields at ${path}`);
    for (const key of expectedKeys)
      assertShape(actual[key], expected[key], `${path}.${key}`);
  }
};
const parseControlState = (root) => {
  const result = execute(
    process.execPath,
    [join(root, "scripts/resume.mjs"), "status"],
    { cwd: root },
  );
  if (result.status !== 0)
    throw new Error(
      `cannot read control state: ${failureOf(result, "resume status failed")}`,
    );
  const read = (label) =>
    new RegExp(`^- ${label}: (.+)$`, "m").exec(result.stdout)?.[1];
  return {
    workOrderId: read("Work order"),
    workOrderPath: read("Work-order path"),
    phase: read("Phase"),
  };
};
const paragraph = (markdown, label) => {
  const match = new RegExp(
    `\\*\\*${label}:\\*\\*\\s+([^\\n]+(?:\\n(?!\\n|\\*\\*|#)[^\\n]+)*)`,
  ).exec(markdown);
  return match?.[1].replace(/\s+/g, " ").trim();
};
const workOrderAuthority = (root, state) => {
  if (!/^WO-\d{3}$/.test(state.workOrderId ?? "") || state.phase !== "closed")
    throw new Error(
      `release close requires a closed work order; observed ${state.workOrderId ?? "none"} in phase ${state.phase ?? "unknown"}`,
    );
  const authorityRoot = join(root, "docs/work-orders");
  const path = resolve(root, state.workOrderPath ?? "");
  if (
    !path.startsWith(`${authorityRoot}${sep}`) ||
    !containedRegularFile(path, authorityRoot) ||
    !basename(path).startsWith(`${state.workOrderId}-`)
  )
    throw new Error(
      `invalid closed work-order authority path: ${state.workOrderPath ?? "none"}`,
    );
  const markdown = readFileSync(path, "utf8");
  const heading = markdown.split("\n", 1)[0];
  const versions = [...heading.matchAll(/\bv\d+(?:\.\d+){2}\b/g)].map(
    (match) => match[0],
  );
  if (versions.length !== 1 || !semver(versions[0]))
    throw new Error(
      `work-order heading must contain exactly one strict vX.Y.Z version: ${heading}`,
    );
  return {
    id: state.workOrderId,
    path: state.workOrderPath,
    version: versions[0],
    title: heading.replace(/^#\s*/, ""),
    objective:
      paragraph(markdown, "Objective") ??
      "No objective paragraph was found in the work-order authority.",
    nonGoals:
      paragraph(markdown, "Non-goals") ??
      "No non-goals paragraph was found in the work-order authority.",
  };
};
const packageVersions = (root) => {
  const packageRoot = join(root, "packages");
  const components = {};
  for (const directory of readdirSync(packageRoot, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort()) {
    const path = join(packageRoot, directory, "package.json");
    if (!existsSync(path)) continue;
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    if (
      typeof manifest.name !== "string" ||
      typeof manifest.version !== "string"
    )
      throw new Error(`component package lacks name/version: ${path}`);
    components[manifest.name] = manifest.version;
  }
  const rootPackage = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  );
  return {
    root: typeof rootPackage.version === "string" ? rootPackage.version : null,
    components,
  };
};
const exactSchemaVersion = (source, pattern, name) => {
  const match = pattern.exec(source);
  if (!match)
    throw new Error(`cannot derive ${name} schema version from source`);
  return Number(match[1]);
};
const compatibility = (root) => {
  const types = readFileSync(
    join(root, "packages/kernel/src/types.ts"),
    "utf8",
  );
  const control = readFileSync(join(root, "scripts/resume.mjs"), "utf8");
  const core = readFileSync(join(root, "packages/kernel/src/core.ts"), "utf8");
  const eventEnvelope = exactSchemaVersion(
    types,
    /export interface EventEnvelope[^\{]*\{\s*readonly schemaVersion:\s*(\d+)/s,
    "event-envelope",
  );
  const controlLog = exactSchemaVersion(
    control,
    /const record = \{ schemaVersion:\s*(\d+), \.\.\.event \}/,
    "control-log",
  );
  const cadenceUnion =
    /export namespace Cadence\s*\{\s*export type T\s*=\s*([^;]+);/s.exec(
      types,
    )?.[1];
  if (!cadenceUnion) throw new Error("cannot derive cadence kinds from source");
  const allKinds = cadenceUnion
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean);
  const allKindSet = new Set(allKinds);
  if (
    allKinds.length === 0 ||
    allKindSet.size !== allKinds.length ||
    allKinds.some((kind) => !/^[A-Za-z_$][\w$]*$/.test(kind))
  )
    throw new Error("cannot derive cadence kinds from source");
  const cadenceEvaluator =
    /^export function evaluateCadence\b[\s\S]+?^}\n(?=\nexport )/m.exec(
      core,
    )?.[0];
  const cadenceSwitchMatch =
    cadenceEvaluator === undefined
      ? undefined
      : /^([ \t]*)switch \(cadence\.kind\) \{([\s\S]+?)^\1  default:/m.exec(
          cadenceEvaluator,
        );
  const cadenceSwitch = cadenceSwitchMatch?.[2];
  if (!cadenceSwitch)
    throw new Error("cannot derive cadence evaluator cases from source");
  const caseIndent = `${cadenceSwitchMatch[1]}  `;
  const caseCount = [
    ...cadenceSwitch.matchAll(new RegExp(`^${caseIndent}case\\b`, "gm")),
  ].length;
  const evaluable = [
    ...cadenceSwitch.matchAll(
      new RegExp(`^${caseIndent}case "([^"]+)":`, "gm"),
    ),
  ].map((match) => match[1]);
  const evaluableSet = new Set(evaluable);
  if (
    evaluable.length === 0 ||
    evaluable.length !== caseCount ||
    evaluableSet.size !== evaluable.length ||
    evaluable.some((kind) => !allKindSet.has(kind))
  )
    throw new Error("cannot derive cadence evaluator cases from source");
  return {
    schemas: {
      eventEnvelope: { min: eventEnvelope, max: eventEnvelope },
      controlLog: { min: controlLog, max: controlLog },
      ir: null,
      artifactConfiguration: null,
      transformationSet: null,
    },
    cadence: {
      evaluable,
      deferred: allKinds.filter((kind) => !evaluableSet.has(kind)),
    },
  };
};
const versionOutput = (command, args, cwd, label) => {
  const result = execute(command, args, { cwd });
  if (result.status !== 0)
    throw new Error(
      `cannot derive ${label}: ${failureOf(result, `${command} failed`)}`,
    );
  return result.stdout.trim();
};
const toolchain = (root) => {
  const typescript = versionOutput(
    join(root, "node_modules/.bin/tsc"),
    ["--version"],
    root,
    "TypeScript version",
  ).replace(/^Version\s+/, "");
  const lock = JSON.parse(
    readFileSync(join(root, "package-lock.json"), "utf8"),
  );
  const lockedTypescript =
    lock.packages?.["node_modules/typescript"]?.version ??
    lock.packages?.[""]?.devDependencies?.typescript;
  if (typescript !== lockedTypescript)
    throw new Error(
      `installed TypeScript ${typescript} does not match lockfile ${lockedTypescript ?? "missing"}`,
    );
  return {
    node: process.version,
    npm: versionOutput("npm", ["--version"], root, "npm version"),
    typescript,
    platform: `${process.platform} ${osRelease()}`,
  };
};
const gitIdentity = (root) => ({
  commit: runGit(root, ["rev-parse", "HEAD"]),
  subject: runGit(root, ["log", "-1", "--format=%s"]),
  committedAt: runGit(root, ["log", "-1", "--format=%cI"]),
});
const changedSubjects = (root, previousRelease) => {
  const range = previousRelease ? `${previousRelease}..HEAD` : "HEAD";
  return runGit(root, ["log", "--reverse", "--format=%s", range])
    .split("\n")
    .filter(Boolean);
};
const changedFiles = (root, previousRelease) => {
  const args = previousRelease
    ? ["diff", "--no-renames", "--name-only", "-z", `${previousRelease}..HEAD`]
    : ["ls-tree", "-r", "--name-only", "-z", "HEAD"];
  return runGitPathList(root, args).sort();
};
const reviewArtifacts = (root, workOrderId) =>
  ["docs/verifications", "docs/final-reviews"].flatMap((parent) =>
    runGitPathList(root, [
      "ls-tree",
      "-r",
      "--name-only",
      "-z",
      "HEAD",
      "--",
      `${parent}/${workOrderId}`,
    ]).filter((path) => path.endsWith(".md")),
  );
const firstParentCommits = (root, previousRelease, release = "HEAD") => {
  const range = previousRelease ? `${previousRelease}..${release}` : release;
  const output = runGit(root, [
    "rev-list",
    "--first-parent",
    "--reverse",
    range,
  ]);
  return output === "" ? [] : output.split("\n");
};
const firstParentOf = (root, commit) => {
  const result = execute("git", ["-C", root, "rev-parse", `${commit}^1`]);
  return result.status === 0 ? result.stdout.trim() : undefined;
};
const changedReleaseNotesAt = (root, parent, commit) => {
  const paths = parent
    ? runGitPathList(root, [
        "diff",
        "--no-renames",
        "--name-only",
        "-z",
        parent,
        commit,
        "--",
        "docs/final-reviews",
      ])
    : runGitPathList(root, [
        "diff-tree",
        "--no-renames",
        "--root",
        "--no-commit-id",
        "--name-only",
        "-z",
        "-r",
        commit,
        "--",
        "docs/final-reviews",
      ]);
  return paths
    .map((path) =>
      /^docs\/final-reviews\/(WO-\d{3})\/RELEASE-NOTES\.md$/.exec(path),
    )
    .filter(Boolean)
    .map((match) => ({ id: match[1], path: match[0] }))
    .sort((left, right) =>
      left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
    );
};
const passedFinalReview = (event) =>
  event?.type === "FinalReviewCompleted" &&
  event.verdict === "pass" &&
  /^WO-\d{3}$/.test(event.workOrderId ?? "");
const notesContractWasActive = (root, revision) =>
  controlEventsAt(root, revision).some(
    ({ event }) => passedFinalReview(event) && event.workOrderId === "WO-024",
  );
const workOrderTitleAtHead = (root, workOrderId) => {
  const activation = controlEventsAt(root, "HEAD")
    .map(({ event }) => event)
    .filter(
      (event) =>
        event.type === "WorkOrderActivated" &&
        event.workOrderId === workOrderId,
    )
    .at(-1);
  const authorityRoot = join(root, "docs/work-orders");
  const authorityPath = activation?.workOrderPath ?? "";
  const resolvedAuthorityPath = resolve(root, authorityPath);
  if (
    !activation ||
    !resolvedAuthorityPath.startsWith(`${authorityRoot}${sep}`) ||
    !basename(authorityPath).startsWith(`${workOrderId}-`)
  )
    throw new Error(
      `cannot resolve work-order authority for release notes: ${workOrderId}`,
    );
  const source = optionalGitFile(root, "HEAD", authorityPath);
  if (source === undefined)
    throw new Error(
      `cannot read work-order authority from HEAD for release notes: ${workOrderId}`,
    );
  const heading = source.split("\n", 1)[0];
  const match = new RegExp(`^#\\s+${workOrderId}\\s+—\\s+(.+)$`).exec(heading);
  if (!match)
    throw new Error(`invalid work-order heading for release notes: ${heading}`);
  return match[1];
};
const legacyReleaseNotes = (workOrderId, subjects) => ({
  sections: {
    "Release overview":
      "Reviewed release-overview prose is unavailable for this work order.",
    "Read before upgrading": "None.",
    "Substantive changes": `**Fallback: no reviewed notes for ${workOrderId} (predates WO-024); commit subjects:**\n\n${
      subjects.length > 0
        ? subjects.map((subject) => `- ${subject}`).join("\n")
        : "- No first-parent commit subject was found."
    }`,
    "Progressive polish": "None.",
    "Evidence and compatibility":
      "Reviewed evidence prose is unavailable because this work order predates the release-notes artifact contract.",
  },
});
const releaseNoteEntries = (root, previousRelease) => {
  const commits = firstParentCommits(root, previousRelease);
  const records = commits.map((commit) => {
    const parent = firstParentOf(root, commit);
    const events = addedControlEvents(root, parent, commit);
    return {
      commit,
      events,
      completed: events
        .filter(passedFinalReview)
        .map((event) => event.workOrderId),
      changedNotes: changedReleaseNotesAt(root, parent, commit),
      subject: runGit(root, ["show", "-s", "--format=%s", commit]),
    };
  });
  const entries = [];
  const byId = new Map();
  let contractActive = notesContractWasActive(root, previousRelease);

  records.forEach((record, recordIndex) => {
    const { changedNotes, completed } = record;
    const orderedIds = [
      ...completed,
      ...changedNotes
        .map(({ id }) => id)
        .filter((id) => !completed.includes(id)),
    ];

    for (const id of orderedIds) {
      const activatesContract = id === "WO-024" && completed.includes(id);
      if (activatesContract) contractActive = true;
      let entry = byId.get(id);
      if (!entry) {
        entry = {
          id,
          title: workOrderTitleAtHead(root, id),
          legacy: !contractActive,
          notesChanged: false,
          lastRelevantIndex: recordIndex,
        };
        byId.set(id, entry);
        entries.push(entry);
      }
      if (activatesContract) entry.legacy = false;
      if (completed.includes(id)) entry.completionIndex = recordIndex;
      if (changedNotes.some((notes) => notes.id === id))
        entry.notesChanged = true;
      entry.lastRelevantIndex = recordIndex;
    }
  });

  return entries.map((entry) => {
    const path = releaseNotesPathFor(entry.id);
    const activationIndex = records.findIndex(
      ({ events }, index) =>
        index <= entry.lastRelevantIndex &&
        events.some(
          (event) =>
            event.type === "WorkOrderActivated" &&
            event.workOrderId === entry.id,
        ),
    );
    const start = activationIndex >= 0 ? activationIndex : 0;
    const end = Math.max(
      entry.completionIndex ?? entry.lastRelevantIndex,
      entry.lastRelevantIndex,
    );
    const subjects = records
      .slice(start, end + 1)
      .map(({ subject }) => subject);
    let parsed;
    if (entry.notesChanged || !entry.legacy) {
      const source = optionalGitFile(root, "HEAD", path);
      if (source === undefined)
        throw new Error(`${path}: release-notes file is missing from HEAD`);
      parsed = parseReleaseNotes(source, path);
    } else {
      parsed = legacyReleaseNotes(entry.id, subjects);
    }
    return {
      id: entry.id,
      title: entry.title,
      legacy: entry.legacy,
      path: entry.notesChanged ? path : undefined,
      ...parsed,
    };
  });
};
const criticalNotes = (files) => {
  const notes = [
    "Source-only release: no package, binary, container, or hosted artifact is published.",
  ];
  if (files.some((path) => /^packages\/[^/]+\/package\.json$/.test(path)))
    notes.push(
      "Component version metadata changed; inspect the manifest's separate version axes.",
    );
  if (
    files.some(
      (path) =>
        path === "packages/kernel/src/types.ts" ||
        /schema|compatibility/i.test(path),
    )
  )
    notes.push(
      "Schema or compatibility surfaces changed; inspect the manifest ranges and complete changed-file list.",
    );
  if (
    files.some((path) =>
      /^scripts\/(resume|worktree|release|release-notes|github-repository)\./.test(
        path,
      ),
    )
  )
    notes.push(
      "Workflow authority, recovery, or publication tooling changed; inspect the operator guide and release evidence.",
    );
  if (files.includes("package-lock.json"))
    notes.push(
      "The locked dependency graph changed; release evidence was run after a fresh npm ci.",
    );
  return notes;
};
const baseManifest = (
  root,
  authority,
  previousRelease,
  evidence,
  recordedToolchain,
) => {
  const templatePath = join(root, "docs/releases/tag-manifest.template.json");
  const template = JSON.parse(readFileSync(templatePath, "utf8"));
  if (template.schemaVersion !== 1)
    throw new Error(`unsupported release manifest template: ${templatePath}`);
  assertShape(template, templateShape);
  const identity = gitIdentity(root);
  const compatible = compatibility(root);
  const files = changedFiles(root, previousRelease);
  const editionEntries = releaseNoteEntries(root, previousRelease);
  const editionWorkOrders =
    editionEntries.length > 0
      ? editionEntries.map(({ id }) => id)
      : [authority.id];
  return {
    ...template,
    release: {
      ...template.release,
      application: authority.version,
      commit: identity.commit,
      subject: identity.subject,
      committedAt: identity.committedAt,
      previousRelease: previousRelease ?? null,
      distribution: "source-only",
    },
    workOrder: {
      ...template.workOrder,
      id: authority.id,
      path: authority.path,
    },
    versions: { ...template.versions, ...packageVersions(root) },
    ...compatible,
    toolchain: {
      ...template.toolchain,
      ...(recordedToolchain ?? toolchain(root)),
    },
    evidence,
    notes: {
      visiblePayoff: authority.objective,
      critical: criticalNotes(files),
      operatorActions: [
        "Read the compatibility fields and known limitations before consuming this source release.",
      ],
      changes: changedSubjects(root, previousRelease),
      changedFiles: files,
      reviewArtifacts: editionWorkOrders.flatMap((workOrderId) =>
        reviewArtifacts(root, workOrderId),
      ),
      knownLimitations: [authority.nonGoals],
    },
  };
};
const firstDifference = (expected, actual, path = "$") => {
  if (Object.is(expected, actual)) return undefined;
  if (
    typeof expected !== "object" ||
    expected === null ||
    typeof actual !== "object" ||
    actual === null
  )
    return path;
  if (Array.isArray(expected) !== Array.isArray(actual)) return path;
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (
    expectedKeys.length !== actualKeys.length ||
    expectedKeys.some((key, index) => key !== actualKeys[index])
  )
    return `${path}<keys>`;
  for (const key of expectedKeys) {
    const difference = firstDifference(
      expected[key],
      actual[key],
      `${path}${Array.isArray(expected) ? `[${key}]` : `.${key}`}`,
    );
    if (difference) return difference;
  }
  return undefined;
};
const validateEvidence = (evidence) => {
  if (!Array.isArray(evidence) || evidence.length !== evidenceCommands.length)
    throw new Error(
      "manifest evidence rows do not match the declared release gate",
    );
  evidence.forEach((row, index) => {
    if (
      row.command !== evidenceCommands[index] ||
      row.exitCode !== 0 ||
      !/^[a-f0-9]{64}$/.test(row.outputSha256 ?? "")
    )
      throw new Error(
        `invalid evidence row ${index + 1}: ${evidenceCommands[index]}`,
      );
  });
};
const validateManifest = (root, manifest) => {
  validateEvidence(manifest.evidence);
  const state = parseControlState(root);
  const authority = workOrderAuthority(root, state);
  const expected = baseManifest(
    root,
    authority,
    manifest.release?.previousRelease ?? undefined,
    manifest.evidence,
  );
  const difference = firstDifference(expected, manifest);
  if (difference)
    throw new Error(
      `release manifest differs from repository truth at ${difference}`,
    );
  return manifest;
};
const validatePublishedManifest = (root, manifest) => {
  validateEvidence(manifest.evidence);
  const recorded = manifest.toolchain;
  const lock = JSON.parse(
    readFileSync(join(root, "package-lock.json"), "utf8"),
  );
  const lockedTypescript =
    lock.packages?.["node_modules/typescript"]?.version ??
    lock.packages?.[""]?.devDependencies?.typescript;
  if (
    !recorded ||
    !/^v\d+/.test(recorded.node ?? "") ||
    !/^\d+\.\d+\.\d+/.test(recorded.npm ?? "") ||
    recorded.typescript !== lockedTypescript ||
    typeof recorded.platform !== "string" ||
    recorded.platform.length === 0
  )
    throw new Error(
      "published manifest contains an invalid recorded toolchain",
    );
  const state = parseControlState(root);
  const authority = workOrderAuthority(root, state);
  const expected = baseManifest(
    root,
    authority,
    manifest.release?.previousRelease ?? undefined,
    manifest.evidence,
    recorded,
  );
  const difference = firstDifference(expected, manifest);
  if (difference)
    throw new Error(
      `published manifest differs from tagged source truth at ${difference}`,
    );
  return manifest;
};
const evidenceRow = (root, command, executable, args) => {
  process.stdout.write(`Running ${command}...\n`);
  const result = execute(executable, args, { cwd: root });
  const output = outputOf(result);
  if (result.status !== 0) {
    const tail = output.trim().slice(-1600);
    throw new Error(
      `${command} failed (exit ${result.status ?? "spawn"})${tail ? `:\n${tail}` : ""}`,
    );
  }
  return { command, exitCode: 0, outputSha256: sha256(output) };
};
const runEvidence = (root) => {
  const evidence = [];
  evidence.push(evidenceRow(root, evidenceCommands[0], "npm", ["ci"]));
  ensureClean(root);
  evidence.push(evidenceRow(root, evidenceCommands[1], "npm", ["test"]));
  ensureClean(root);
  evidence.push(
    evidenceRow(root, evidenceCommands[2], process.execPath, [
      join(root, "packages/skeleton/dist/src/cli.js"),
    ]),
  );
  ensureClean(root);
  const cleanOutput = runGit(root, ["status", "--porcelain"]);
  evidence.push({
    command: evidenceCommands[3],
    exitCode: 0,
    outputSha256: sha256(cleanOutput),
  });
  return evidence;
};
const displayValue = (value) =>
  value === null || value === undefined ? "none" : String(value);
const schemaRange = (range) => {
  if (range === null || range === undefined) return "none";
  if (typeof range !== "object") return String(range);
  return range.min === range.max
    ? String(range.min)
    : `${displayValue(range.min)}–${displayValue(range.max)}`;
};
const machineEvidence = (manifest) => {
  const components = Object.entries(manifest.versions.components).sort();
  const schemas = Object.entries(manifest.schemas);
  const reviews = manifest.notes.reviewArtifacts;
  return [
    `- Source: \`${manifest.release.application}\` at \`${manifest.release.commit}\``,
    `- Previous release: ${manifest.release.previousRelease ? `\`${manifest.release.previousRelease}\`` : "none"}`,
    `- Application version: \`${manifest.release.application}\``,
    `- Root workspace version: ${manifest.versions.root ? `\`${manifest.versions.root}\`` : "unversioned"}`,
    "- Component versions:",
    ...(components.length > 0
      ? components.map(([name, version]) => `  - \`${name}\`: \`${version}\``)
      : ["  - None."]),
    "- Schema ranges:",
    ...schemas.map(([name, range]) => `  - \`${name}\`: ${schemaRange(range)}`),
    "- Cadence kinds:",
    `  - Evaluable: ${manifest.cadence.evaluable.length > 0 ? manifest.cadence.evaluable.map((kind) => `\`${kind}\``).join(", ") : "none"}`,
    `  - Deferred: ${manifest.cadence.deferred.length > 0 ? manifest.cadence.deferred.map((kind) => `\`${kind}\``).join(", ") : "none"}`,
    "- Release evidence:",
    ...manifest.evidence.map(
      (row) =>
        `  - \`${row.command}\`: exit ${row.exitCode}; output SHA-256 \`${row.outputSha256}\``,
    ),
    "- Review lineage:",
    ...(reviews.length > 0
      ? reviews.map((path) => `  - \`${path}\``)
      : ["  - None recorded."]),
    `- Changed files: ${manifest.notes.changedFiles.length} (complete list in the canonical manifest embedded in the annotated tag)`,
    `- Distribution: ${manifest.release.distribution}`,
  ].join("\n");
};
const releaseEdition = (root, manifest) => {
  const entries = releaseNoteEntries(
    root,
    manifest.release.previousRelease ?? undefined,
  );
  if (entries.length === 0)
    throw new Error("release range contains no reviewed work order");
  const lines = [`DotLn ${manifest.release.application}`];
  for (const heading of releaseNoteHeadings) {
    lines.push("", `## ${heading}`);
    for (const entry of entries) {
      lines.push(
        "",
        `### ${entry.id} — ${entry.title}`,
        "",
        entry.sections[heading],
      );
    }
    if (heading === "Read before upgrading") {
      lines.push(
        "",
        "### Derived from the diff",
        "",
        "These notices are machine-classified from the release diff and follow the reviewer-authored items above.",
        "",
        ...manifest.notes.critical.map((item) => `- ${item}`),
      );
    }
    if (heading === "Evidence and compatibility") {
      lines.push(
        "",
        "### Machine-derived release evidence",
        "",
        machineEvidence(manifest),
      );
    }
  }
  return lines.join("\n");
};
const tagMessage = (root, manifest) =>
  `${releaseEdition(root, manifest)}\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest, null, 2)}\nDOTLN-MANIFEST-END\n`;
const tagContents = (root, tag) => {
  const result = execute("git", ["-C", root, "cat-file", "-p", tag]);
  if (result.status !== 0)
    throw new Error(failureOf(result, `cannot read tag ${tag}`));
  return result.stdout;
};
const tagAnnotation = (root, tag) => {
  const object = tagContents(root, tag);
  const boundary = object.indexOf("\n\n");
  if (boundary < 0) throw new Error(`${tag} is not an annotated tag object`);
  return object.slice(boundary + 2);
};
const humanLayerFromTag = (root, tag) => {
  const annotation = tagAnnotation(root, tag);
  const marker = annotation.lastIndexOf("\n\nDOTLN-MANIFEST-BEGIN\n");
  if (marker >= 0 && /\nDOTLN-MANIFEST-END\n?$/.test(annotation.slice(marker)))
    return annotation.slice(0, marker);
  return annotation.endsWith("\n") ? annotation.slice(0, -1) : annotation;
};
const isDotLnRelease = (humanLayer, tag) => {
  const firstLine = humanLayer.split("\n", 1)[0];
  return (
    firstLine === `DotLn ${tag}` || firstLine.startsWith(`DotLn ${tag} — `)
  );
};
const manifestFromTag = (root, tag) => {
  const annotation = tagAnnotation(root, tag);
  const beginMarker = "DOTLN-MANIFEST-BEGIN\n";
  const endMarker = "\nDOTLN-MANIFEST-END";
  const begin = annotation.lastIndexOf(beginMarker);
  const end = annotation.endsWith(`${endMarker}\n`)
    ? annotation.length - `${endMarker}\n`.length
    : annotation.endsWith(endMarker)
      ? annotation.length - endMarker.length
      : -1;
  if (begin < 0 || end < begin + beginMarker.length)
    throw new Error(`${tag} does not contain a DotLn release manifest`);
  try {
    return JSON.parse(annotation.slice(begin + beginMarker.length, end));
  } catch {
    throw new Error(`${tag} contains invalid manifest JSON`);
  }
};
const ensureExistingRelease = (root, tag, head, local, remote) => {
  const localTag = local.get(tag);
  const remoteTag = remote.get(tag);
  if (!remoteTag)
    throw new Error(
      `${tag} exists only locally; inspect it and publish or remove it manually`,
    );
  if (!remoteTag.annotated || remoteTag.target !== head)
    throw new Error(
      `${tag} already exists remotely for a different or non-annotated object`,
    );
  if (
    localTag &&
    (localTag.objectType !== "tag" ||
      localTag.target !== head ||
      localTag.object !== remoteTag.object)
  )
    throw new Error(`${tag} differs between local and origin`);
  if (!localTag)
    runGit(root, ["fetch", "origin", `refs/tags/${tag}:refs/tags/${tag}`]);
  const manifest = validatePublishedManifest(root, manifestFromTag(root, tag));
  const expected = tagMessage(root, manifest);
  const actual = tagAnnotation(root, tag);
  if (actual !== expected)
    throw new Error(
      `${tag} annotation differs from its generated manifest and notes`,
    );
  return { manifest, humanLayer: releaseEdition(root, manifest) };
};
const publishedTag = (name, local, remote) => {
  const remoteTag = remote.get(name);
  const localTag = local.get(name);
  if (!remoteTag?.annotated)
    throw new Error(
      `latest published version ${name} is absent or is not an annotated origin tag`,
    );
  if (
    localTag &&
    (localTag.objectType !== "tag" ||
      localTag.object !== remoteTag.object ||
      localTag.target !== remoteTag.target)
  )
    throw new Error(`${name} differs between local and origin`);
  return remoteTag;
};
const updateMainAndFinish = (root, workOrderId) => {
  ensureClean(root);
  ensureNoIgnoredInfluence(root);
  if (runGit(root, ["symbolic-ref", "--short", "HEAD"]) !== "main")
    throw new Error("release close must run from the main branch checkout");
  const branch = `wo-${workOrderId.slice(3)}`;
  const subject = parseWorktrees(root).find(
    (item) => item.branch === `refs/heads/${branch}`,
  );
  if (subject?.worktree) {
    const finished = execute(
      process.execPath,
      [join(root, "scripts/worktree.mjs"), "finish", workOrderId],
      { cwd: root },
    );
    if (finished.status !== 0)
      throw new Error(
        `cannot finish merged worktree: ${failureOf(finished, "worktree finish failed")}`,
      );
    process.stdout.write(finished.stdout);
  } else {
    runGit(root, ["fetch", "origin", "main"]);
    runGit(root, ["merge", "--ff-only", "origin/main"]);
    const localBranch = runGit(root, ["branch", "--list", branch]);
    if (localBranch) {
      const merged = execute("git", [
        "-C",
        root,
        "merge-base",
        "--is-ancestor",
        branch,
        "origin/main",
      ]);
      if (merged.status !== 0)
        throw new Error(
          `${branch} exists locally but is not merged into origin/main`,
        );
      const upstream = execute("git", [
        "-C",
        root,
        "rev-parse",
        "--verify",
        `${branch}@{upstream}`,
      ]);
      if (upstream.status === 0)
        runGit(root, ["branch", "--unset-upstream", branch]);
      runGit(root, ["branch", "-d", branch]);
    }
  }
  ensureClean(root);
  const head = runGit(root, ["rev-parse", "HEAD"]);
  const originMain = runGit(root, ["rev-parse", "origin/main"]);
  if (head !== originMain)
    throw new Error(
      `main is not synchronized with origin/main (${head} != ${originMain})`,
    );
};
const executeGh = (root, args) => {
  return execute("gh", args, {
    cwd: root,
    env: environmentWithoutGhRepo(),
  });
};
const ensureGhPreflight = (
  root,
  repository = resolveGitHubPushTarget(root),
) => {
  const available = executeGh(root, ["--version"]);
  if (available.status !== 0)
    throw new Error(
      "gh is required before tag creation; install GitHub CLI and retry",
    );
  const authenticated = executeGh(root, [
    "auth",
    "status",
    "--hostname",
    repository.host,
  ]);
  if (authenticated.status !== 0)
    throw new Error(
      "gh authentication is required before tag creation; run gh auth login and retry",
    );
  return repository;
};
const firstDifferingLine = (expected, actual) => {
  const expectedLines = expected.split("\n");
  const actualLines = actual.split("\n");
  const count = Math.max(expectedLines.length, actualLines.length);
  for (let index = 0; index < count; index += 1) {
    if (expectedLines[index] !== actualLines[index])
      return {
        number: index + 1,
        expected: expectedLines[index],
        actual: actualLines[index],
      };
  }
  return undefined;
};
const withTemporaryBody = (body, operation) => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-release-body-"));
  const path = join(directory, "RELEASE.md");
  try {
    writeFileSync(path, body, "utf8");
    return operation(path);
  } finally {
    try {
      rmSync(directory, { recursive: true, force: true });
    } catch {
      // A cleanup failure must not mask whether the remote operation ran.
    }
  }
};
const viewedGitHubRelease = (root, repository, tag) => {
  const viewed = executeGh(root, [
    "release",
    "view",
    tag,
    "--repo",
    repository.selector,
    "--json",
    "body,name,isDraft,isPrerelease,assets",
  ]);
  if (viewed.status !== 0) {
    const reason = failureOf(viewed, "GitHub Release lookup failed");
    if (/\brelease not found\b/i.test(reason)) return undefined;
    throw new Error(
      `tag published; GitHub Release state not verified and no create was attempted; rerun the same command: ${reason}`,
    );
  }
  try {
    const release = JSON.parse(viewed.stdout);
    if (
      typeof release.body !== "string" ||
      typeof release.name !== "string" ||
      typeof release.isDraft !== "boolean" ||
      typeof release.isPrerelease !== "boolean" ||
      !Array.isArray(release.assets)
    )
      throw new Error("release metadata has the wrong shape");
    return release;
  } catch (error) {
    throw new Error(
      `tag published; GitHub Release state not verified and no create was attempted; rerun the same command: ${tag} returned invalid metadata (${error instanceof Error ? error.message : String(error)})`,
    );
  }
};
const ensureGitHubRelease = (root, repository, tag, expectedBody) => {
  const existing = viewedGitHubRelease(root, repository, tag);
  if (existing !== undefined) {
    if (
      existing.name !== `DotLn ${tag}` ||
      existing.isDraft ||
      existing.isPrerelease ||
      existing.assets.length > 0
    )
      throw new Error(
        `${tag} GitHub Release metadata differs: expected title ${JSON.stringify(`DotLn ${tag}`)}, not draft, not prerelease, and no assets`,
      );
    const difference = firstDifferingLine(expectedBody, existing.body);
    if (difference)
      throw new Error(
        `${tag} GitHub Release body differs at line ${difference.number}: expected ${JSON.stringify(difference.expected ?? "<missing>")}; observed ${JSON.stringify(difference.actual ?? "<missing>")}`,
      );
    return "existing";
  }
  let created;
  try {
    created = withTemporaryBody(expectedBody, (bodyPath) =>
      executeGh(root, [
        "release",
        "create",
        tag,
        "--repo",
        repository.selector,
        "--verify-tag",
        "--title",
        `DotLn ${tag}`,
        "--notes-file",
        bodyPath,
      ]),
    );
  } catch (error) {
    throw new Error(
      `tag published; GitHub Release not created; rerun the same command: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (created.status !== 0)
    throw new Error(
      `tag published; GitHub Release not created; rerun the same command: ${failureOf(created, "gh release create failed")}`,
    );
  return "created";
};
const projectedReleaseBody = (tag, humanLayer) =>
  `${humanLayer}\n\nRender these notes locally with \`npm run release -- notes ${tag}\`; inspect the canonical manifest with \`npm run release -- manifest-from-tag ${tag}\`.\n`;
const backfillReleaseBody = (tag, humanLayer) => {
  const historicalLinks =
    tag === "v0.2.0"
      ? "\n\nHistorical records: [manifest](../../blob/main/docs/releases/v0.2.0.md) and [notes](../../blob/main/docs/releases/v0.2.0-notes.md)."
      : "";
  return `**Notes as generated at close; predates WO-024's release-note edition.**\n\n${humanLayer}${historicalLinks}\n`;
};
const publishTag = (root, tag, commit, message, tagger) => {
  const body = `object ${commit}\ntype commit\ntag ${tag}\ntagger ${tagger}\n\n${message}`;
  const made = execute("git", ["-C", root, "mktag"], { input: body });
  if (made.status !== 0)
    throw new Error(
      `cannot create annotated tag object: ${failureOf(made, "git mktag failed")}`,
    );
  const object = made.stdout.trim();
  const pushed = execute("git", [
    "-C",
    root,
    "push",
    "--no-follow-tags",
    "origin",
    `${object}:refs/tags/${tag}`,
  ]);
  if (pushed.status !== 0)
    throw new Error(
      `tag push failed; no local tag ref was created: ${failureOf(pushed, "git push failed")}`,
    );
  try {
    runGit(root, ["update-ref", `refs/tags/${tag}`, object, ""]);
  } catch (error) {
    throw new Error(
      `tag published; GitHub Release not created; rerun the same command: cannot record the local tag ref (${error instanceof Error ? error.message : String(error)})`,
    );
  }
  return object;
};
const close = (workOrderId, args) => {
  if (
    !/^WO-\d{3}$/.test(workOrderId ?? "") ||
    args.some((arg) => arg !== "--publish") ||
    args.filter((arg) => arg === "--publish").length > 1
  )
    throw new Error("usage: release close WO-NNN [--publish]");
  const publish = args.includes("--publish");
  const root = mainWorktree();
  if (resolve(process.cwd()) !== root)
    throw new Error(
      `release close must run from the main control-plane checkout: ${root}`,
    );
  updateMainAndFinish(root, workOrderId);
  const state = parseControlState(root);
  if (state.workOrderId !== workOrderId)
    throw new Error(
      `merged control state is for ${state.workOrderId ?? "none"}, not ${workOrderId}`,
    );
  const authority = workOrderAuthority(root, state);
  let local = localTags(root);
  const remote = remoteTags(root);
  const latest = latestVersion(remote);
  const head = runGit(root, ["rev-parse", "HEAD"]);
  let previous = latest ? publishedTag(latest, local, remote) : undefined;
  if (latest && compareVersions(authority.version, latest) < 0) {
    process.stdout.write(
      `${workOrderId} closes ${authority.version}, below latest release ${latest}; no release tag is due. Main is clean and between work orders.\n`,
    );
    return;
  }
  const blockingTag = nestedTagConflict(authority.version, local, remote);
  if (blockingTag)
    throw new Error(
      `release tag ${authority.version} is blocked by nested tag ${blockingTag}`,
    );
  if (latest && compareVersions(authority.version, latest) === 0) {
    const repository = publish ? ensureGhPreflight(root) : undefined;
    const existing = ensureExistingRelease(
      root,
      authority.version,
      head,
      local,
      remote,
    );
    const projection = publish
      ? ensureGitHubRelease(
          root,
          repository,
          authority.version,
          projectedReleaseBody(authority.version, existing.humanLayer),
        )
      : undefined;
    process.stdout.write(
      `${authority.version} is already published from ${head}${projection ? `; GitHub Release ${projection}` : ""}. Main is clean and between work orders.\n`,
    );
    return;
  }
  if (latest) {
    if (!local.has(latest)) {
      runGit(root, [
        "fetch",
        "origin",
        `refs/tags/${latest}:refs/tags/${latest}`,
      ]);
      local = localTags(root);
      previous = publishedTag(latest, local, remote);
    }
    const ancestor = execute("git", [
      "-C",
      root,
      "merge-base",
      "--is-ancestor",
      previous.target,
      head,
    ]);
    if (ancestor.status !== 0)
      throw new Error(`latest release ${latest} is not an ancestor of ${head}`);
  }
  if (local.has(authority.version) || remote.has(authority.version))
    throw new Error(`release tag already exists: ${authority.version}`);
  const repository = publish ? ensureGhPreflight(root) : undefined;
  const tagger = publish
    ? runGit(root, ["var", "GIT_COMMITTER_IDENT"])
    : undefined;
  const evidence = runEvidence(root);
  const manifest = validateManifest(
    root,
    baseManifest(root, authority, latest, evidence),
  );
  const humanLayer = releaseEdition(root, manifest);
  const message = tagMessage(root, manifest);
  if (!publish) {
    process.stdout.write(
      `Prepared and validated ${authority.version} for ${head}. To create and push only the annotated tag and create its matching GitHub Release, run:\n  npm run release -- close ${workOrderId} --publish\n`,
    );
    return;
  }
  const tagObject = publishTag(root, authority.version, head, message, tagger);
  const projection = ensureGitHubRelease(
    root,
    repository,
    authority.version,
    projectedReleaseBody(authority.version, humanLayer),
  );
  ensureClean(root);
  process.stdout.write(
    `Published annotated ${authority.version} (${tagObject}) for ${head}; GitHub Release ${projection}. Main is clean and between work orders.\n`,
  );
};

const requireLocalAnnotatedRelease = (root, tag) => {
  if (!semver(tag)) throw new Error(`invalid release tag: ${tag ?? "missing"}`);
  const local = localTags(root).get(tag);
  if (!local || local.objectType !== "tag")
    throw new Error(`local annotated release tag is unavailable: ${tag}`);
  return local;
};
const renderPublishedNotes = (tag) => {
  requireLocalAnnotatedRelease(toolRoot, tag);
  const humanLayer = humanLayerFromTag(toolRoot, tag);
  if (!isDotLnRelease(humanLayer, tag))
    throw new Error(`${tag} is not a DotLn release tag`);
  process.stdout.write(`${humanLayer}\n`);
};
const historicalWorkOrders = (root, tag) => {
  if (tag !== "v0.2.0") return [];
  const path = join(root, "docs/releases/v0.2.0.md");
  if (!existsSync(path)) return [];
  return [
    ...new Set(
      [...readFileSync(path, "utf8").matchAll(/\bWO-\d{3}\b/g)].map(
        (match) => match[0],
      ),
    ),
  ];
};
const releaseWorkOrdersBetween = (root, previousRelease, release) => {
  const workOrders = [];
  for (const commit of firstParentCommits(root, previousRelease, release)) {
    const parent = firstParentOf(root, commit);
    const completed = addedControlEvents(root, parent, commit)
      .filter(passedFinalReview)
      .map((event) => event.workOrderId);
    const changedNotes = changedReleaseNotesAt(root, parent, commit).map(
      ({ id }) => id,
    );
    for (const id of [...completed, ...changedNotes])
      if (!workOrders.includes(id)) workOrders.push(id);
  }
  return workOrders;
};
const listPublishedReleases = () => {
  const releases = [...localTags(toolRoot).values()]
    .filter(({ name, objectType }) => semver(name) && objectType === "tag")
    .sort((left, right) => compareVersions(left.name, right.name))
    .filter((item) =>
      isDotLnRelease(humanLayerFromTag(toolRoot, item.name), item.name),
    );
  const rows = releases.map((item, index) => {
    let manifest;
    try {
      manifest = manifestFromTag(toolRoot, item.name);
    } catch {
      manifest = undefined;
    }
    const workOrders = releaseWorkOrdersBetween(
      toolRoot,
      manifest?.release?.previousRelease ?? releases[index - 1]?.name,
      item.name,
    );
    if (workOrders.length === 0 && /^WO-\d{3}$/.test(manifest?.workOrder?.id))
      workOrders.push(manifest.workOrder.id);
    if (workOrders.length === 0)
      workOrders.push(...historicalWorkOrders(toolRoot, item.name));
    return {
      tag: item.name,
      commit: item.target,
      application: manifest?.release?.application ?? item.name,
      workOrders,
    };
  });
  process.stdout.write("TAG\tCOMMIT\tAPPLICATION\tWORK ORDERS\n");
  for (const row of rows)
    process.stdout.write(
      `${row.tag}\t${row.commit}\t${row.application}\t${row.workOrders.join(",") || "none recorded"}\n`,
    );
};
const publishHistoricalNotes = (tag) => {
  if (!semver(tag)) throw new Error(`invalid release tag: ${tag ?? "missing"}`);
  const root = mainWorktree();
  if (resolve(process.cwd()) !== root)
    throw new Error(
      `release publish-notes must run from the main control-plane checkout: ${root}`,
    );
  let local = localTags(root);
  const repository = resolveGitHubPushTarget(root);
  const remote = remoteTags(root);
  publishedTag(tag, local, remote);
  if (!local.has(tag)) {
    runGit(root, ["fetch", "origin", `refs/tags/${tag}:refs/tags/${tag}`]);
    local = localTags(root);
  }
  const localTag = local.get(tag);
  const remoteTag = remote.get(tag);
  if (
    localTag?.objectType !== "tag" ||
    localTag.object !== remoteTag?.object ||
    localTag.target !== remoteTag?.target
  )
    throw new Error(`${tag} differs between local and origin`);
  const humanLayer = humanLayerFromTag(root, tag);
  if (!isDotLnRelease(humanLayer, tag))
    throw new Error(`${tag} is not a DotLn release tag`);
  if (notesContractWasActive(root, tag))
    throw new Error(
      `${tag} is at or after WO-024's release-note contract and cannot be published as historical notes; recover its GitHub Release by rerunning the matching release close with --publish`,
    );
  ensureGhPreflight(root, repository);
  const projection = ensureGitHubRelease(
    root,
    repository,
    tag,
    backfillReleaseBody(tag, humanLayer),
  );
  process.stdout.write(
    `GitHub Release ${projection} for historical annotated ${tag}.\n`,
  );
};

const main = () => {
  const [action, ...args] = process.argv.slice(2);
  if (action === "close") return close(args[0], args.slice(1));
  if (action === "validate") {
    const [path] = args;
    if (!path || args.length !== 1)
      throw new Error("usage: release validate <manifest.json>");
    validateManifest(
      toolRoot,
      JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8")),
    );
    process.stdout.write(`Validated ${path}.\n`);
    return;
  }
  if (action === "manifest-from-tag") {
    const [tag] = args;
    if (!tag || args.length !== 1)
      throw new Error("usage: release manifest-from-tag vX.Y.Z");
    process.stdout.write(
      `${JSON.stringify(manifestFromTag(toolRoot, tag), null, 2)}\n`,
    );
    return;
  }
  if (action === "notes") {
    const [tag] = args;
    if (!tag || args.length !== 1)
      throw new Error("usage: release notes vX.Y.Z");
    return renderPublishedNotes(tag);
  }
  if (action === "list") {
    if (args.length !== 0) throw new Error("usage: release list");
    return listPublishedReleases();
  }
  if (action === "publish-notes") {
    const [tag] = args;
    if (!tag || args.length !== 1)
      throw new Error("usage: release publish-notes vX.Y.Z");
    return publishHistoricalNotes(tag);
  }
  throw new Error(
    "usage: release close WO-NNN [--publish] | release validate <manifest.json> | release manifest-from-tag vX.Y.Z | release notes vX.Y.Z | release list | release publish-notes vX.Y.Z",
  );
};

try {
  main();
} catch (error) {
  process.stderr.write(
    `error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}
