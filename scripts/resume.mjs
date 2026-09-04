#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mainWorktree, runGit } from "./lib/git.mjs";
import {
  containedRegularFile,
  readJsonFile,
  workOrderAuthorityPath,
} from "./lib/paths.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logPath = join(repoRoot, "docs/control/resume.jsonl");
const currentPath = join(repoRoot, "docs/control/current.md");
const environmentPath = join(repoRoot, "docs/discovery/environment.json");
const effortLevels = ["low", "medium", "high", "xhigh", "max"];
const effortDeclarations = new Set([
  "any",
  ...effortLevels.map((level) => `${level}+`),
]);
const attestedEventTypes = new Set([
  "ImplementationReady",
  "VerificationCompleted",
  "RepairCompleted",
  "FinalReviewCompleted",
]);
const actorFlagUsage =
  "--harness <claude-code|codex-cli|human|other:label> --harness-version <version> --model <model> --effort <level> --source <self-reported|harness-readback|operator-attested>";
const actorHeaderPrefix = "**Actor attestation:**";
const shellQuote = (value) => `'${value.replaceAll("'", `'\\''`)}'`;

export const CONTROL_LOG_SCHEMA_VERSION = 1;

export const parseControlEvents = (source) =>
  source
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`invalid control event at line ${index + 1}`);
      }
    });

const readEvents = () =>
  existsSync(logPath) ? parseControlEvents(readFileSync(logPath, "utf8")) : [];

export const fold = (events) => {
  const state = {
    workOrderId: undefined,
    workOrderPath: undefined,
    phase: "none",
    latestVerificationId: undefined,
    latestVerificationPath: undefined,
    latestVerdict: undefined,
    finalReviewId: undefined,
    finalReviewPath: undefined,
    failureSourceId: undefined,
    failureSourcePath: undefined,
    latestCheckpointSha: undefined,
    latestCheckpointRef: undefined,
    checkpointUnavailable: false,
    latestAttestation: undefined,
    effortPairs: [],
    effortDeclarationValidated: false,
  };
  for (const [index, event] of events.entries()) {
    switch (event?.type) {
      case "WorkOrderActivated":
        Object.assign(state, {
          workOrderId: event.workOrderId,
          workOrderPath: event.workOrderPath,
          phase: "active",
          latestVerificationId: undefined,
          latestVerificationPath: undefined,
          latestVerdict: undefined,
          finalReviewId: undefined,
          finalReviewPath: undefined,
          failureSourceId: undefined,
          failureSourcePath: undefined,
          latestCheckpointSha: undefined,
          latestCheckpointRef: undefined,
          checkpointUnavailable: false,
          latestAttestation: undefined,
          effortPairs: [],
          effortDeclarationValidated: event.effortDeclarationValidated === true,
        });
        break;
      case "ImplementationReady":
        state.phase = "ready-to-verify";
        break;
      case "VerificationRequested":
        Object.assign(state, {
          phase: "verifying",
          latestVerificationId: event.verificationId,
          latestVerificationPath: event.reportPath,
          latestVerdict: undefined,
        });
        break;
      case "VerificationCompleted":
        Object.assign(state, {
          phase: event.verdict === "pass" ? "verified" : "needs-fix",
          latestVerificationId: event.verificationId,
          latestVerificationPath: event.reportPath,
          latestVerdict: event.verdict,
          failureSourceId:
            event.verdict === "fail" ? event.verificationId : undefined,
          failureSourcePath:
            event.verdict === "fail" ? event.reportPath : undefined,
        });
        break;
      case "RepairRequested":
        state.phase = "repairing";
        break;
      case "RepairCompleted":
        state.phase = "ready-to-verify";
        break;
      case "FinalReviewRequested":
        Object.assign(state, {
          phase: "final-review",
          finalReviewId: event.finalReviewId,
          finalReviewPath: event.reportPath,
        });
        break;
      case "FinalReviewCompleted":
        Object.assign(state, {
          phase: event.verdict === "pass" ? "closed" : "needs-fix",
          failureSourceId:
            event.verdict === "fail" ? event.finalReviewId : undefined,
          failureSourcePath:
            event.verdict === "fail" ? event.reportPath : undefined,
        });
        break;
      default:
        throw new Error(
          `unknown control event type at line ${index + 1}: ${event?.type ?? "missing"}`,
        );
    }
    if (
      attestedEventTypes.has(event.type) &&
      event.workOrderId === state.workOrderId &&
      event.actor &&
      typeof event.actor.harness === "string" &&
      typeof event.actor.harnessVersion === "string" &&
      typeof event.actor.model === "string" &&
      typeof event.actor.effort === "string" &&
      typeof event.actor.source === "string"
    ) {
      state.latestAttestation = event.actor;
      const pair = {
        effort: event.actor.effort,
        raw: typeof event.actor.raw === "string" ? event.actor.raw : undefined,
      };
      if (
        !state.effortPairs.some(
          (existing) =>
            existing.effort === pair.effort &&
            (existing.raw ?? null) === (pair.raw ?? null),
        )
      )
        state.effortPairs.push(pair);
    }
    if (
      typeof event.checkpointSha === "string" &&
      typeof event.checkpointRef === "string"
    ) {
      Object.assign(state, {
        latestCheckpointSha: event.checkpointSha,
        latestCheckpointRef: event.checkpointRef,
        checkpointUnavailable: false,
      });
    } else if (event.workOrderId === state.workOrderId) {
      Object.assign(state, {
        latestCheckpointSha: undefined,
        latestCheckpointRef: undefined,
        checkpointUnavailable: true,
      });
    }
  }
  return state;
};

const append = (event) => {
  mkdirSync(dirname(logPath), { recursive: true });
  const record = { schemaVersion: CONTROL_LOG_SCHEMA_VERSION, ...event };
  writeFileSync(logPath, `${JSON.stringify(record)}\n`, {
    flag: "a",
    mode: 0o644,
  });
  return record;
};

const nextVerification = (state) => {
  const events = readEvents();
  const used = events
    .filter(
      (event) =>
        event.workOrderId === state.workOrderId &&
        typeof event.verificationId === "string",
    )
    .map((event) => Number(event.verificationId.slice(4)))
    .filter(Number.isInteger);
  const directory = join(repoRoot, "docs/verifications", state.workOrderId);
  if (existsSync(directory))
    used.push(
      ...readdirSync(directory)
        .map((name) => /^VER-(\d+)\.md$/.exec(name))
        .filter(Boolean)
        .map((match) => Number(match[1])),
    );
  const number = Math.max(0, ...used) + 1;
  return `VER-${String(number).padStart(3, "0")}`;
};
const nextFinalReview = (state) => {
  const used = readEvents()
    .filter(
      (event) =>
        event.workOrderId === state.workOrderId &&
        typeof event.finalReviewId === "string",
    )
    .map((event) => Number(event.finalReviewId.slice(6)))
    .filter(Number.isInteger);
  const directory = join(repoRoot, "docs/final-reviews", state.workOrderId);
  if (existsSync(directory))
    used.push(
      ...readdirSync(directory)
        .map((name) => /^FINAL-(\d+)\.md$/.exec(name))
        .filter(Boolean)
        .map((match) => Number(match[1])),
    );
  return `FINAL-${String(Math.max(0, ...used) + 1).padStart(3, "0")}`;
};

const legalActions = (state) => {
  const actions =
    {
      none: ["activate"],
      active: ["next", "implementation-ready"],
      "ready-to-verify": ["verify"],
      verifying: ["verification-result"],
      "needs-fix": ["fix"],
      repairing: ["repair-complete"],
      verified: ["final-review"],
      "final-review": ["final-review-result"],
      closed: ["release-close", "next", "activate"],
    }[state.phase] ?? [];
  return state.phase === "ready-to-verify" &&
    state.failureSourceId &&
    state.failureSourcePath
    ? ["verify", "fix"]
    : actions;
};

const actorCommand = (action, positional = "") =>
  `npm run resume -- ${action}${positional ? ` ${positional}` : ""} ${actorFlagUsage}`;

const commandFor = (action) =>
  ({
    activate:
      "npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-name.md",
    next: "npm run resume -- next",
    "implementation-ready": actorCommand("implementation-ready"),
    verify: "npm run resume -- verify",
    "verification-result": actorCommand("verification-result", "pass|fail"),
    fix: "npm run resume -- fix",
    "repair-complete": actorCommand("repair-complete"),
    "final-review": "npm run resume -- final-review",
    "final-review-result": actorCommand("final-review-result", "pass|fail"),
    "release-close": "npm run release -- close WO-NNN --publish",
  })[action] ?? `npm run resume -- ${action}`;

const checkpoint = (action, workOrderId) => {
  const warn = (detail) => {
    process.stderr.write(
      `warning: could not create recovery checkpoint for ${action}: ${detail}; proceeding without one. Do not repeat this transition after it records. When Codex workspace-write is the cause, inspect package.json and the scripts/resume.mjs diff, then request one-invocation outside-sandbox approval before future state-changing resume commands; never persist an allow rule. See docs/AI-HARNESS-SECURITY.md\n`,
    );
    return { checkpointUnavailable: true };
  };
  if (!/^WO-\d{3}$/.test(workOrderId ?? ""))
    return warn(`work order id is unavailable (${workOrderId ?? "none"})`);
  try {
    if (runGit(repoRoot, ["rev-parse", "--is-inside-work-tree"]) !== "true")
      return warn(`${repoRoot} is not a git work tree`);
    const prefix = `refs/dotln/checkpoint/${workOrderId}/`;
    const used = runGit(repoRoot, [
      "for-each-ref",
      "--format=%(refname)",
      prefix,
    ])
      .split("\n")
      .filter(Boolean)
      .map((ref) => Number(ref.slice(prefix.length)))
      .filter(Number.isInteger);
    const checkpointRef = `${prefix}${Math.max(0, ...used) + 1}`;
    const temporaryRoot = mkdtempSync(join(tmpdir(), "dotln-checkpoint-"));
    try {
      const indexPath = join(temporaryRoot, "index");
      const checkpointEnv = { ...process.env, GIT_INDEX_FILE: indexPath };
      runGit(repoRoot, ["add", "-A"], { env: checkpointEnv });
      const tree = runGit(repoRoot, ["write-tree"], { env: checkpointEnv });
      const checkpointSha = runGit(
        repoRoot,
        [
          "commit-tree",
          tree,
          "-p",
          "HEAD",
          "-m",
          `dotln checkpoint: ${action} ${workOrderId}`,
        ],
        { env: checkpointEnv },
      );
      runGit(repoRoot, ["update-ref", checkpointRef, checkpointSha]);
      return { checkpointSha, checkpointRef };
    } finally {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  } catch (error) {
    return warn(error instanceof Error ? error.message : String(error));
  }
};
const appendTransition = (action, event) =>
  append({ ...event, ...checkpoint(action, event.workOrderId) });

const workOrderDeclaration = (
  workOrderPath,
  { allowLegacyMissingEffort = false, workOrderId } = {},
) => {
  const authorityPath = workOrderAuthorityPath(
    repoRoot,
    workOrderId,
    workOrderPath,
  );

  const lines = readFileSync(authorityPath, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/);
  const fieldIndexes = (label) => {
    const prefix = `**${label}:**`;
    const pattern = new RegExp(`^\\*\\*${label}:\\*\\*(?:\\s|$)`);
    const indexes = lines.flatMap((line, index) =>
      pattern.test(line) ? [index] : [],
    );
    if (indexes.length === 0 && label === "Effort" && allowLegacyMissingEffort)
      return undefined;
    if (indexes.length === 0)
      throw new Error(`work order is missing ${prefix} line: ${workOrderPath}`);
    if (indexes.length !== 1)
      throw new Error(
        `work order has duplicate ${prefix} lines: ${workOrderPath}`,
      );
    return indexes[0];
  };
  const fieldAt = (label, index) => {
    const prefix = `**${label}:**`;
    if (!lines[index].slice(prefix.length).trim())
      throw new Error(
        `work order has malformed ${prefix} line: ${workOrderPath}`,
      );
    const paragraphLines = [];
    for (let cursor = index; cursor < lines.length; cursor += 1) {
      if (
        cursor > index &&
        (lines[cursor].trim() === "" || /^\*\*[^*]+:\*\*/.test(lines[cursor]))
      )
        break;
      paragraphLines.push(lines[cursor]);
    }
    const paragraph = paragraphLines.join(" ").replace(/\s+/g, " ").trim();
    return {
      source: paragraphLines.join("\n"),
      paragraph,
      nextIndex: index + paragraphLines.length,
    };
  };

  const modelIndex = fieldIndexes("Model");
  const effortIndex = fieldIndexes("Effort");
  const titleIndex = lines.findIndex((line) => line.trim());
  if (titleIndex === -1 || !lines[titleIndex].startsWith("# "))
    throw new Error(`work order has malformed header: ${workOrderPath}`);
  const bodyBoundaries = lines.flatMap((line, index) =>
    index > titleIndex &&
    (/^\*\*Objective:\*\*(?:\s|$)/.test(line) || /^##(?:\s|$)/.test(line))
      ? [index]
      : [],
  );
  const headerEnd = bodyBoundaries.length
    ? Math.min(...bodyBoundaries)
    : lines.length;
  if (
    modelIndex >= headerEnd ||
    (effortIndex !== undefined && effortIndex >= headerEnd)
  )
    throw new Error(
      `work order must place **Model:** and **Effort:** in its leading metadata header: ${workOrderPath}`,
    );
  const model = fieldAt("Model", modelIndex);
  if (effortIndex === undefined)
    return {
      modelSource: model.source,
      effortSource:
        "**Effort:** unavailable for this pre-WO-019 activation; executor any; verifier any; reviewer any.",
      efforts: { executor: "any", verifier: "any", reviewer: "any" },
    };
  let headerCursor = model.nextIndex;
  while (lines[headerCursor]?.trim() === "") headerCursor += 1;
  if (effortIndex !== headerCursor)
    throw new Error(
      `work order must place **Effort:** immediately after **Model:** in its header: ${workOrderPath}`,
    );
  const effort = fieldAt("Effort", effortIndex);
  const level = "(any|low\\+|medium\\+|high\\+|xhigh\\+|max\\+)";
  const match = new RegExp(
    `^\\*\\*Effort:\\*\\*\\s+executor\\s+${level}\\s*;\\s*verifier\\s+${level}\\s*;\\s*reviewer\\s+${level}(?:\\.\\s*.*|\\.)?$`,
  ).exec(effort.paragraph);
  if (
    !match ||
    !effortDeclarations.has(match[1]) ||
    !effortDeclarations.has(match[2]) ||
    !effortDeclarations.has(match[3])
  )
    throw new Error(
      `work order has malformed **Effort:** line: ${workOrderPath}; expected executor <level+|any>; verifier <level+|any>; reviewer <level+|any>`,
    );

  return {
    modelSource: model.source,
    effortSource: effort.source,
    efforts: {
      executor: match[1],
      verifier: match[2],
      reviewer: match[3],
    },
  };
};

const actorUsage = (action, positional = "") =>
  `usage: resume ${action}${positional ? ` ${positional}` : ""} ${actorFlagUsage}`;

const harnessEvidence = (harness) => {
  if (!existsSync(environmentPath)) return undefined;
  try {
    return readJsonFile(environmentPath).effortReadbackProbe?.harnesses?.[
      harness
    ];
  } catch {
    return undefined;
  }
};

const recordedHarnessVersions = (harness) => {
  const evidence = harnessEvidence(harness);
  if (!Array.isArray(evidence?.versions)) return [];
  return evidence.versions
    .filter(
      (version) =>
        version?.classification === "observed" &&
        typeof version.value === "string",
    )
    .map((version) => version.value);
};

const effortHarnessEvidence = (harness, harnessVersion) => {
  const evidence = harnessEvidence(harness);
  return recordedHarnessVersions(harness).includes(harnessVersion)
    ? evidence
    : undefined;
};

const recordedVersionsMessage = (harness) => {
  const versions = recordedHarnessVersions(harness);
  return `recorded observed versions: ${versions.length > 0 ? versions.join(", ") : "none"}`;
};

const selectorClassifications = new Set(["observed", "documented locally"]);

const hasRecordedEffortValue = (harness, harnessVersion, effort) => {
  const evidence = effortHarnessEvidence(harness, harnessVersion);
  if (!evidence) return false;
  const sessionSelector = evidence.sessionEffortSelector;
  const persistedSelector = evidence.persistedEffortSelector;
  const effectiveReadback = evidence.effectiveEffortReadback;
  return (
    (selectorClassifications.has(sessionSelector?.classification) &&
      Array.isArray(sessionSelector.values) &&
      sessionSelector.values.includes(effort)) ||
    (selectorClassifications.has(persistedSelector?.classification) &&
      persistedSelector.value === effort) ||
    (effectiveReadback?.classification === "observed" &&
      (effectiveReadback.value === effort ||
        (Array.isArray(effectiveReadback.values) &&
          effectiveReadback.values.includes(effort))))
  );
};

const hasObservedEffortReadbackValue = (harness, harnessVersion, effort) => {
  const readback = effortHarnessEvidence(
    harness,
    harnessVersion,
  )?.effectiveEffortReadback;
  return (
    readback?.classification === "observed" &&
    (readback.value === effort ||
      (Array.isArray(readback.values) && readback.values.includes(effort)))
  );
};

const parseActor = (action, args, positional = "") => {
  const allowedFlags = new Set([
    "--harness",
    "--harness-version",
    "--model",
    "--effort",
    "--source",
  ]);
  const values = new Map();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (
      !allowedFlags.has(flag) ||
      values.has(flag) ||
      typeof value !== "string" ||
      !value.trim() ||
      value.startsWith("--") ||
      /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/u.test(value)
    )
      throw new Error(actorUsage(action, positional));
    values.set(flag, value);
  }
  if (
    args.length !== allowedFlags.size * 2 ||
    [...allowedFlags].some((flag) => !values.has(flag))
  )
    throw new Error(actorUsage(action, positional));

  const harness = values.get("--harness");
  const harnessVersion = values.get("--harness-version");
  const model = values.get("--model");
  const suppliedEffort = values.get("--effort");
  const source = values.get("--source");
  if (
    !["claude-code", "codex-cli", "human"].includes(harness) &&
    !/^other:[A-Za-z0-9][A-Za-z0-9._-]*$/.test(harness)
  )
    throw new Error(
      `invalid --harness ${harness}; ${actorUsage(action, positional)}`,
    );
  if (
    !["self-reported", "harness-readback", "operator-attested"].includes(source)
  )
    throw new Error(
      `invalid --source ${source}; ${actorUsage(action, positional)}`,
    );
  if (
    source === "harness-readback" &&
    !hasObservedEffortReadbackValue(harness, harnessVersion, suppliedEffort)
  )
    throw new Error(
      `harness-readback refused for ${harness} ${harnessVersion} effort ${suppliedEffort}: no matching observed effective-effort readback is recorded for that version and value (${recordedVersionsMessage(harness)}); use self-reported or operator-attested${sessionLabelHint(harness, suppliedEffort)}`,
    );

  const recognizedEffort = effortLevels.includes(suppliedEffort);
  const supportedEffort =
    recognizedEffort &&
    hasRecordedEffortValue(harness, harnessVersion, suppliedEffort);
  if (recognizedEffort && !supportedEffort)
    throw new Error(
      `attested effort ${suppliedEffort} refused for ${harness} ${harnessVersion}: no matching selector or effective-readback evidence records that value (${recordedVersionsMessage(harness)}); use --effort unknown or record bounded discovery evidence`,
    );
  const actor = {
    harness,
    harnessVersion,
    model,
    effort: recognizedEffort ? suppliedEffort : "unknown",
  };
  if (!recognizedEffort && suppliedEffort !== "unknown")
    actor.raw = suppliedEffort;
  actor.source = source;
  return actor;
};

const renderEffort = ({ effort, raw }) =>
  effort === "unknown" && typeof raw === "string"
    ? `unknown (raw: ${raw})`
    : effort;

const sessionLabelHint = (harness, raw) => {
  const notes = harnessEvidence(harness)?.sessionLabelNotes;
  const labelNote =
    notes && typeof notes === "object" && Object.hasOwn(notes, raw)
      ? notes[raw]
      : undefined;
  return labelNote?.classification === "operator-attested" &&
    effortLevels.includes(labelNote.reasoningEffort) &&
    labelNote.attestationSource === "operator-attested" &&
    labelNote.automaticConversion === false
    ? `; see docs/discovery/environment.json effortReadbackProbe.harnesses.${harness}.sessionLabelNotes.${raw}; resume does not convert session labels, so supply --effort ${labelNote.reasoningEffort} --source ${labelNote.attestationSource} only when that recorded attestation applies`
    : "";
};

const validateEffort = (actor, role, declaration, workOrderPath) => {
  const required = declaration.efforts[role];
  if (required === "any") return;
  const minimum = required.slice(0, -1);
  if (
    actor.effort === "unknown" ||
    effortLevels.indexOf(actor.effort) < effortLevels.indexOf(minimum)
  ) {
    const labelHint =
      actor.effort === "unknown" && typeof actor.raw === "string"
        ? sessionLabelHint(actor.harness, actor.raw)
        : "";
    throw new Error(
      `attested ${role} effort ${renderEffort(actor)} is below declared ${required} in ${workOrderPath}${labelHint}; add a dated operator amendment to that work order's **Effort:** line, then rerun`,
    );
  }
};

const activeWorkOrderDeclaration = (state) =>
  workOrderDeclaration(state.workOrderPath, {
    workOrderId: state.workOrderId,
    allowLegacyMissingEffort:
      !state.effortDeclarationValidated && state.workOrderId !== "WO-019",
  });

const completionActor = (action, args, state, role, positional = "") => {
  const actor = parseActor(action, args, positional);
  const declaration = activeWorkOrderDeclaration(state);
  validateEffort(actor, role, declaration, state.workOrderPath);
  return actor;
};

const renderAttestation = (actor) =>
  actor
    ? `harness ${actor.harness}; version ${actor.harnessVersion}; model ${actor.model}; effort ${renderEffort(actor)}; source ${actor.source}`
    : "none";

const renderDrift = (pairs) =>
  pairs.length <= 1 ? "none" : pairs.map(renderEffort).join(" -> ");

const requireReportActor = (reportPath, actor, reportKind) => {
  const lines = readFileSync(reportPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.startsWith(actorHeaderPrefix));
  const expectedHeader = `${actorHeaderPrefix} ${JSON.stringify(actor)}`;
  if (lines.length !== 1)
    throw new Error(
      `${reportKind} report must contain exactly one machine-readable actor header; expected: ${expectedHeader}`,
    );

  let reported;
  try {
    reported = JSON.parse(lines[0].slice(actorHeaderPrefix.length).trim());
  } catch {
    throw new Error(
      `${reportKind} report has malformed actor header; expected: ${expectedHeader}`,
    );
  }
  if (
    !reported ||
    typeof reported !== "object" ||
    Array.isArray(reported) ||
    lines[0] !== expectedHeader
  )
    throw new Error(
      `${reportKind} report actor header does not match the completion actor; expected: ${expectedHeader}`,
    );
};

const render = (state) => `# Current control state

- Work order: ${state.workOrderId ?? "none"}
- Work-order path: ${state.workOrderPath ?? "none"}
- Phase: ${state.phase}
- Latest verification: ${state.latestVerificationId ?? "none"}
- Verification path: ${state.latestVerificationPath ?? "none"}
- Latest verdict: ${state.latestVerdict ?? "none"}
- Final review: ${state.finalReviewId ?? "none"}
- Final-review path: ${state.finalReviewPath ?? "none"}
- Latest attestation: ${renderAttestation(state.latestAttestation)}
- Effort drift: ${renderDrift(state.effortPairs)}
- Latest checkpoint: ${state.latestCheckpointRef ? `${state.latestCheckpointSha} (restore: \`git checkout ${state.latestCheckpointRef} -- .\`)` : state.checkpointUnavailable ? "unavailable for the latest transition; do not use an older checkpoint" : "none"}
- Legal next actions: ${legalActions(state).join(", ") || "none"}

Generated from the append-only \`docs/control/resume.jsonl\`; do not edit this projection manually.
`;

export const statusProjection = (state) => ({
  workOrder: state.workOrderId ?? null,
  workOrderPath: state.workOrderPath ?? null,
  phase: state.phase,
  latestVerification: state.latestVerificationId ?? null,
  verificationPath: state.latestVerificationPath ?? null,
  latestVerdict: state.latestVerdict ?? null,
  finalReview: state.finalReviewId ?? null,
  finalReviewPath: state.finalReviewPath ?? null,
  latestAttestation: state.latestAttestation ?? null,
  effortDrift: state.effortPairs.map(({ effort, raw }) => ({
    effort,
    ...(raw === undefined ? {} : { raw }),
  })),
  latestCheckpoint: state.latestCheckpointRef
    ? {
        sha: state.latestCheckpointSha,
        ref: state.latestCheckpointRef,
        restoreCommand: `git checkout ${state.latestCheckpointRef} -- .`,
      }
    : state.checkpointUnavailable
      ? { unavailable: true }
      : null,
  legalNextActions: legalActions(state),
});

const warnIfProjectionDisagrees = (state) => {
  let current;
  try {
    current = readFileSync(currentPath, "utf8");
  } catch {
    current = undefined;
  }
  if (current !== render(state))
    process.stderr.write(
      "warning: docs/control/current.md disagrees with the canonical fold of docs/control/resume.jsonl; status is read-only and did not rewrite the projection\n",
    );
};

const project = (state) => {
  mkdirSync(dirname(currentPath), { recursive: true });
  const temporary = `${currentPath}.tmp`;
  writeFileSync(temporary, render(state));
  renameSync(temporary, currentPath);
};

const requirePhase = (state, ...phases) => {
  if (phases.includes(state.phase)) return;
  const commands = legalActions(state).map(commandFor);
  throw new Error(
    `cannot perform action in phase ${state.phase}; run: ${commands.join(" or ") || "no command is currently legal"}`,
  );
};

const main = () => {
  const [action = "status", ...args] = process.argv.slice(2);
  let state = fold(readEvents());
  let message;

  switch (action) {
    case "status": {
      if (args.length > 1 || (args.length === 1 && args[0] !== "--json"))
        throw new Error("usage: resume status [--json]");
      warnIfProjectionDisagrees(state);
      message =
        args[0] === "--json"
          ? JSON.stringify(statusProjection(state), null, 2)
          : render(state);
      break;
    }
    case "activate": {
      requirePhase(state, "none", "closed");
      const [workOrderId, workOrderPath] = args;
      if (!/^WO-\d{3}$/.test(workOrderId ?? "") || !workOrderPath)
        throw new Error(
          "usage: resume activate WO-NNN docs/work-orders/<file>.md",
        );
      workOrderDeclaration(workOrderPath, { workOrderId });
      appendTransition(action, {
        type: "WorkOrderActivated",
        workOrderId,
        workOrderPath,
        effortDeclarationValidated: true,
      });
      message = `Activated ${workOrderId}.`;
      break;
    }
    case "implementation-ready": {
      requirePhase(state, "active");
      const actor = completionActor(action, args, state, "executor");
      appendTransition(action, {
        type: "ImplementationReady",
        workOrderId: state.workOrderId,
        actor,
      });
      message = `${state.workOrderId} is ready for verification.`;
      break;
    }
    case "verify": {
      requirePhase(state, "ready-to-verify");
      const verificationId = nextVerification(state);
      const reportPath = `docs/verifications/${state.workOrderId}/${verificationId}.md`;
      appendTransition(action, {
        type: "VerificationRequested",
        workOrderId: state.workOrderId,
        verificationId,
        reportPath,
      });
      message = `Verify ${state.workOrderPath}; write the immutable report to ${reportPath}.`;
      break;
    }
    case "verification-result": {
      requirePhase(state, "verifying");
      const [verdict, ...actorArgs] = args;
      if (verdict !== "pass" && verdict !== "fail")
        throw new Error(actorUsage(action, "pass|fail"));
      const actor = completionActor(
        action,
        actorArgs,
        state,
        "verifier",
        "pass|fail",
      );
      const verificationRoot = join(
        repoRoot,
        "docs/verifications",
        state.workOrderId,
      );
      if (
        !state.latestVerificationPath ||
        !containedRegularFile(
          join(repoRoot, state.latestVerificationPath),
          verificationRoot,
        )
      )
        throw new Error(
          `verification report is not a contained regular file: ${state.latestVerificationPath}`,
        );
      requireReportActor(
        join(repoRoot, state.latestVerificationPath),
        actor,
        "verification",
      );
      appendTransition(action, {
        type: "VerificationCompleted",
        workOrderId: state.workOrderId,
        verificationId: state.latestVerificationId,
        reportPath: state.latestVerificationPath,
        verdict,
        actor,
      });
      message = `Recorded ${state.latestVerificationId}: ${verdict}.`;
      break;
    }
    case "fix":
      if (
        state.phase !== "needs-fix" &&
        !(
          state.phase === "ready-to-verify" &&
          state.failureSourceId &&
          state.failureSourcePath
        )
      )
        requirePhase(state, "needs-fix");
      appendTransition(action, {
        type: "RepairRequested",
        workOrderId: state.workOrderId,
        sourceFindingId: state.failureSourceId,
        sourceReportPath: state.failureSourcePath,
      });
      message = `Repair ${state.workOrderPath} using ${state.failureSourcePath}; read both artifacts.`;
      break;
    case "repair-complete": {
      requirePhase(state, "repairing");
      const actor = completionActor(action, args, state, "executor");
      appendTransition(action, {
        type: "RepairCompleted",
        workOrderId: state.workOrderId,
        sourceVerificationId: state.latestVerificationId,
        actor,
      });
      message = `${state.workOrderId} repair is ready for re-verification.`;
      break;
    }
    case "final-review": {
      requirePhase(state, "verified");
      const finalReviewId = nextFinalReview(state);
      const reportPath = `docs/final-reviews/${state.workOrderId}/${finalReviewId}.md`;
      appendTransition(action, {
        type: "FinalReviewRequested",
        workOrderId: state.workOrderId,
        throughVerificationId: state.latestVerificationId,
        finalReviewId,
        reportPath,
      });
      message = `Final-review ${state.workOrderPath}, the complete verification sequence, and ideation receipt; write ${reportPath}.`;
      break;
    }
    case "final-review-result": {
      requirePhase(state, "final-review");
      const [verdict, ...actorArgs] = args;
      if (verdict !== "pass" && verdict !== "fail")
        throw new Error(actorUsage(action, "pass|fail"));
      const actor = completionActor(
        action,
        actorArgs,
        state,
        "reviewer",
        "pass|fail",
      );
      const finalReviewRoot = join(
        repoRoot,
        "docs/final-reviews",
        state.workOrderId,
      );
      if (
        !state.finalReviewPath ||
        !containedRegularFile(
          join(repoRoot, state.finalReviewPath),
          finalReviewRoot,
        )
      )
        throw new Error(
          `final-review report is not a contained regular file: ${state.finalReviewPath}`,
        );
      requireReportActor(
        join(repoRoot, state.finalReviewPath),
        actor,
        "final-review",
      );
      appendTransition(action, {
        type: "FinalReviewCompleted",
        workOrderId: state.workOrderId,
        finalReviewId: state.finalReviewId,
        reportPath: state.finalReviewPath,
        verdict,
        actor,
      });
      message =
        verdict === "pass"
          ? `Recorded final review pass; commit the reviewed state, then run npm run worktree -- publish ${state.workOrderId} --title <title> --body-file <contained-reviewed-body-path>.`
          : "Recorded final review failure; return to bounded repair.";
      break;
    }
    case "next": {
      requirePhase(state, "active", "closed");
      const declaration =
        state.phase === "active"
          ? activeWorkOrderDeclaration(state)
          : undefined;
      message =
        state.phase === "active"
          ? `Execute ${state.workOrderPath}.\n${declaration.modelSource}\n${declaration.effortSource}\nRead that authority and only its cited blueprint sections; after its evidence gate passes, run ${commandFor("implementation-ready")}.`
          : `Current work order ${state.workOrderId} is closed. The repository is between work orders; start a valid next work order with npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-name.md.`;
      break;
    }
    case "release-close": {
      requirePhase(state, "closed");
      let mainPath = repoRoot;
      try {
        mainPath = mainWorktree(repoRoot);
      } catch {
        // A non-Git fixture can still exercise the command projection.
      }
      message = `After the operator merges the PR, run the reviewed helper with main as its working checkout: cd ${shellQuote(mainPath)} && ${shellQuote(process.execPath)} ${shellQuote(join(repoRoot, "scripts/release.mjs"))} close ${state.workOrderId} --publish. This narrowly authorizes the annotated tag and its matching GitHub Release; never push main.`;
      break;
    }
    default:
      throw new Error(`unknown resume action: ${action}`);
  }

  if (action !== "status") {
    state = fold(readEvents());
    project(state);
  }
  process.stdout.write(`${message}\n`);
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
