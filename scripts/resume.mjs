#!/usr/bin/env node
import { isMainModule } from "./lib/paths.mjs";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { createCheckpoint } from "./lib/checkpoint.mjs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  reportHarnessRuntime,
  currentHarnessSessionReport,
  observedFactsReport,
} from "./lib/harness-runtime.mjs";
import { mainWorktree, runGit, shellQuote } from "./lib/git.mjs";
import {
  projectActor,
  renderAttestation,
  renderEffort,
  validateAccountLabel,
} from "./lib/control-actor.mjs";
import {
  controlUsageProjection,
  renderControlUsage,
} from "./lib/control-usage.mjs";
import {
  COST_LINE_REQUIRED,
  costLineBriefing,
  requireReceiptCostLine,
} from "./lib/receipt-cost.mjs";
import { requireLifecycleEvidence } from "./lib/lifecycle-evidence.mjs";
import {
  executorWriterRelease,
  refreshExecutorIndex,
} from "./lib/executor-handoff.mjs";
import { executorEntryBriefing } from "./lib/executor-readiness.mjs";
import { dependencyRefusal, readDependencies } from "./lib/dependencies.mjs";
import {
  projectControlBeacon,
  restrictedBeaconBriefing,
} from "./lib/beacons.mjs";
import {
  controlTimeProjection,
  recoverControlTimes,
  validateRecordedAt,
} from "./lib/control-time.mjs";
import {
  containedRegularFile,
  readJsonFile,
  workOrderAuthorityPath,
} from "./lib/paths.mjs";
import {
  docPath,
  docRelative,
  findLaunchpad,
  loadConfig,
} from "./lib/config.mjs";
import { parseRepositoryDeclaration } from "./lib/work-order-repository.mjs";

import {
  CONTROL_LOG_SCHEMA_VERSION,
  DEFAULT_CONTROL_PATHS,
  controlPaths,
  fold,
  parseControlEvents,
} from "./lib/control.mjs";
import {
  readControl,
  controlFromSources,
  eventsForOrder,
  branchWorkOrder,
  latestClosedOrder,
  openOrders,
  selectWorkOrder,
} from "./lib/control-store.mjs";
// Keep the WO-018 import surface stable for lifecycle peers.
export {
  CONTROL_LOG_SCHEMA_VERSION,
  fold,
  parseControlEvents,
} from "./lib/control.mjs";

const repoRoot = findLaunchpad();
const storage = controlPaths(repoRoot);
const currentPath = docPath(repoRoot, "control", "current.md");
const environmentPath = docPath(repoRoot, "discovery", "environment.json");
const effortLevels = ["low", "medium", "high", "xhigh", "max"];
const effortDeclarations = new Set([
  "any",
  ...effortLevels,
  ...effortLevels.map((level) => `${level}+`),
]);
const actorFlagUsage =
  "--harness <harness> --harness-version <version> --model <model> --effort <level> --source <source> [--account-label <label>]";
const actorHeaderPrefix = "**Actor attestation:**";
const codexDispatchRoles = {
  next: "executor",
  fix: "executor",
  verify: "verifier",
  "final-review": "reviewer",
  "release-close": "release-close",
};

const readEvents = () =>
  [...readControl(repoRoot).eventSegments.values()].flat();

const append = (event, segment) => {
  const logPath = join(repoRoot, segment);
  const record = {
    schemaVersion: CONTROL_LOG_SCHEMA_VERSION,
    recordedAt: new Date().toISOString(),
    ...event,
  };
  validateRecordedAt(record, "at append");
  mkdirSync(dirname(logPath), { recursive: true });
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
  const directory = docPath(repoRoot, "verifications", state.workOrderId);
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
  const directory = docPath(repoRoot, "finalReviews", state.workOrderId);
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

const commandFor = (action, workOrderId) => {
  const command =
    {
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
    }[action] ?? `npm run resume -- ${action}`;
  return workOrderId && !["activate", "release-close"].includes(action)
    ? `${command} --work-order ${workOrderId}`
    : command;
};

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
    return createCheckpoint(repoRoot, action, workOrderId);
  } catch (error) {
    return warn(error instanceof Error ? error.message : String(error));
  }
};
const appendTransition = (action, event) => {
  const control = readControl(repoRoot);
  const segment =
    control.locations.get(event.workOrderId) ??
    storage.segment(event.workOrderId);
  const recorded = append(
    { ...event, ...checkpoint(action, event.workOrderId) },
    segment,
  );
  try {
    const state = readControl(repoRoot).orders.get(event.workOrderId).state;
    projectControlBeacon(repoRoot, state, recorded.recordedAt);
  } catch {
    process.stderr.write(
      "warning: host beacon projection unavailable; transition recorded, do not retry the transition\n",
    );
  }
  return recorded;
};

const workOrderDeclaration = (
  workOrderPath,
  { allowLegacyMissingEffort = false, workOrderId } = {},
) => {
  const authorityPath = workOrderAuthorityPath(
    repoRoot,
    workOrderId,
    workOrderPath,
  );

  const source = readFileSync(authorityPath, "utf8").replace(/^\uFEFF/, "");
  const repository = parseRepositoryDeclaration(source, workOrderPath);
  const lines = source.split(/\r?\n/);
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
      repository,
    };
  let headerCursor = model.nextIndex;
  while (lines[headerCursor]?.trim() === "") headerCursor += 1;
  if (effortIndex !== headerCursor)
    throw new Error(
      `work order must place **Effort:** immediately after **Model:** in its header: ${workOrderPath}`,
    );
  const effort = fieldAt("Effort", effortIndex);
  const level = "(any|low\\+?|medium\\+?|high\\+?|xhigh\\+?|max\\+?)";
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
    repository,
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
  const line = /^(\d+\.\d+)\.\d+$/.exec(harnessVersion)?.[1];
  return recordedHarnessVersions(harness).includes(harnessVersion) ||
    (line &&
      evidence?.versionLines?.some(
        (row) => row.classification === "observed" && row.line === line,
      ))
    ? evidence
    : undefined;
};

const recordedVersionsMessage = (harness) => {
  const versions = recordedHarnessVersions(harness);
  const lines =
    harnessEvidence(harness)
      ?.versionLines?.filter((row) => row.classification === "observed")
      .map((row) => row.line) ?? [];
  return `recorded observed versions: ${versions.length > 0 ? versions.join(", ") : "none"}; observed lines: ${[...new Set(lines)].join(", ") || "none"}`;
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
    (readback.channel !== "CLAUDE_EFFORT" ||
      process.env.CLAUDE_EFFORT === effort) &&
    (readback.value === effort ||
      (Array.isArray(readback.values) && readback.values.includes(effort)))
  );
};

export const parseActor = (action, args, positional = "") => {
  const requiredFlags = [
    "--harness",
    "--harness-version",
    "--model",
    "--effort",
    "--source",
  ];
  const allowedFlags = new Set([...requiredFlags, "--account-label"]);
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
  if (requiredFlags.some((flag) => !values.has(flag)))
    throw new Error(actorUsage(action, positional));

  const harness = values.get("--harness");
  const harnessVersion = values.get("--harness-version");
  const model = values.get("--model");
  const suppliedEffort = values.get("--effort");
  const suppliedSource = values.get("--source");
  const source =
    suppliedSource === "operator-selected-model-effective-effort-unavailable"
      ? "operator-attested"
      : suppliedSource;
  const subagents = ["ultra", "ultra code", "ultracode"].includes(
    suppliedEffort.toLowerCase(),
  );
  if (
    !hasRecordedEffortValue(
      harness,
      harnessVersion,
      subagents ? "xhigh" : suppliedEffort,
    )
  )
    console.warn(
      `Advisory: attestation recorded as supplied; ${harness} ${harnessVersion} effort ${suppliedEffort} has no matching discovery observation.`,
    );
  const actor = {
    harness,
    harnessVersion,
    model,
    effort: subagents ? "xhigh" : suppliedEffort,
    ...(subagents ? { mode: "subagents", raw: suppliedEffort } : {}),
    source,
  };
  const accountLabel = values.has("--account-label")
    ? values.get("--account-label")
    : process.env.DOTLN_ACCOUNT_LABEL;
  validateAccountLabel(accountLabel);
  if (accountLabel !== undefined) actor.accountLabel = accountLabel;
  return actor;
};

const validateEffort = (actor, role, declaration, workOrderPath) => {
  const recommended = declaration.efforts[role].replace(/\+$/, "");
  if (
    recommended !== "any" &&
    effortLevels.indexOf(actor.effort) < effortLevels.indexOf(recommended)
  )
    console.warn(
      `Advisory: attested ${role} effort ${renderEffort(actor)} is below recommendation ${recommended} in ${workOrderPath}; recorded as given.`,
    );
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

const renderElapsed = (elapsed) =>
  Object.entries(elapsed)
    .map(
      ([phase, value]) =>
        `- Elapsed ${phase}: ${value === "unknown" ? value : `${value} ms`}\n`,
    )
    .join("");

const renderOrder = (
  state,
  timing,
) => `- Work order: ${state.workOrderId ?? "none"}
- Work-order path: ${state.workOrderPath ?? "none"}
${state.repositoryId ? `- Repository: ${state.repositoryId} @ ${state.baseCommit}\n` : ""}- Phase: ${state.phase}
- Latest verification: ${state.latestVerificationId ?? "none"}
- Verification path: ${state.latestVerificationPath ?? "none"}
- Latest verdict: ${state.latestVerdict ?? "none"}
- Final review: ${state.finalReviewId ?? "none"}
- Final-review path: ${state.finalReviewPath ?? "none"}
- Latest attestation: ${renderAttestation(state.latestAttestation)}
- Effort drift: ${renderDrift(state.effortPairs)}
- Latest recordedAt: ${timing.recordedAt ?? "unknown"}
${renderElapsed(timing.elapsed)}- Latest checkpoint: ${state.latestCheckpointRef ? `${state.latestCheckpointSha} (restore: \`git checkout ${state.latestCheckpointRef} -- .\`)` : state.checkpointUnavailable ? "unavailable for the latest transition; do not use an older checkpoint" : "none"}
- Legal next actions: ${legalActions(state).join(", ") || "none"}
`;

const projectOrder = (state, events) => {
  return {
    workOrder: state.workOrderId ?? null,
    workOrderPath: state.workOrderPath ?? null,
    ...(state.repositoryId
      ? {
          repositoryId: state.repositoryId,
          baseCommit: state.baseCommit,
        }
      : {}),
    phase: state.phase,
    latestVerification: state.latestVerificationId ?? null,
    verificationPath: state.latestVerificationPath ?? null,
    latestVerdict: state.latestVerdict ?? null,
    finalReview: state.finalReviewId ?? null,
    finalReviewPath: state.finalReviewPath ?? null,
    latestAttestation: projectActor(state.latestAttestation),
    effortDrift: state.effortPairs.map(({ effort, raw, mode }) => ({
      effort,
      ...(raw === undefined ? {} : { raw }),
      ...(mode === undefined ? {} : { mode }),
    })),
    ...controlTimeProjection(events),
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
  };
};

export const statusProjection = (input, workOrder, dependencies = null) => {
  const control = Array.isArray(input)
    ? controlFromSources(
        new Map([
          [DEFAULT_CONTROL_PATHS.legacy, input.map(JSON.stringify).join("\n")],
        ]),
      )
    : input;
  const id = selectWorkOrder(control, {
    workOrder,
    latestClosed:
      control.eventSegments.size === 1 && control.legacy.phase === "closed"
        ? control.legacy.workOrderId
        : undefined,
  });
  const state = control.orders.get(id)?.state ?? fold([]);
  return {
    ...projectOrder(state, eventsForOrder(control, id)),
    dependencies,
    orders: [...control.orders].map(([order, row]) => ({
      workOrder: order,
      ...(row.state.repositoryId
        ? {
            repositoryId: row.state.repositoryId,
            baseCommit: row.state.baseCommit,
          }
        : {}),
      phase: row.state.phase,
      latestVerdict: row.state.latestVerdict ?? null,
      ...controlTimeProjection(eventsForOrder(control, order)),
    })),
  };
};

const render = (control, latestClosed, segments = storage) => {
  const ids = [...openOrders(control), ...(latestClosed ? [latestClosed] : [])];
  const bodies = ids.length
    ? ids.map(
        (id) =>
          `## ${id}\n\n${renderOrder(control.orders.get(id).state, controlTimeProjection(eventsForOrder(control, id)))}`,
      )
    : [renderOrder(fold([]), controlTimeProjection([]))];
  return `# Current control state\n\n${bodies.join("\n")}\nGenerated from the append-only \`${segments.legacy}\` and \`${segments.segment("WO-NNN")}\` segments; do not edit this projection manually.\n`;
};

// Integration reuses the canonical projection without dispatching a role or
// changing any segment. Ordinary status remains read-only.
export function refreshControlProjection(root) {
  const control = readControl(root);
  const body = render(
    control,
    latestClosedOrder(control, root, "HEAD", branchWorkOrder(root)),
    controlPaths(root),
  );
  const path = docPath(root, "control", "current.md");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
}

const warnIfProjectionDisagrees = (rendered) => {
  let current;
  try {
    current = readFileSync(currentPath, "utf8");
  } catch {
    current = undefined;
  }
  if (current !== rendered)
    process.stderr.write(
      `warning: ${docRelative(repoRoot, "control", "current.md")} disagrees with the canonical fold of control segments; status is read-only and did not rewrite the projection\n`,
    );
};

const project = (rendered) => {
  mkdirSync(dirname(currentPath), { recursive: true });
  const temporary = `${currentPath}.tmp`;
  writeFileSync(temporary, rendered);
  renameSync(temporary, currentPath);
};

const selectionArgs = (args) => {
  const remaining = [];
  let workOrder;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== "--work-order") {
      remaining.push(args[index]);
      continue;
    }
    if (workOrder !== undefined || !/^WO-\d{3}$/.test(args[index + 1] ?? ""))
      throw new Error("usage: --work-order WO-NNN (exactly once)");
    workOrder = args[++index];
  }
  return { args: remaining, workOrder };
};

const requirePhase = (state, ...phases) => {
  if (phases.includes(state.phase)) return;
  const commands = legalActions(state).map((action) =>
    commandFor(action, state.workOrderId),
  );
  throw new Error(
    `cannot perform action in phase ${state.phase}; run: ${commands.join(" or ") || "no command is currently legal"}`,
  );
};

/**
 * The briefing each dispatch prints. `briefing` projects the recorded
 * dispatch's briefing read-only for the current phase, so a session that
 * resumes a recorded repair, verification or final review receives what the
 * recording session received, without a second transition.
 */
const executionBriefing = (state) => {
  const declaration = activeWorkOrderDeclaration(state);
  return `Execute ${state.workOrderPath}.\n${declaration.modelSource}\n${declaration.effortSource}\nRead that authority and only its cited blueprint sections; when its deliverable and evidence exist, run ${commandFor("implementation-ready", state.workOrderId)}.${executorEntryBriefing(repoRoot, state.workOrderId)}`;
};
const repairBriefing = (state) =>
  `Repair ${state.workOrderPath} using ${state.failureSourcePath}; read both artifacts.${executorEntryBriefing(repoRoot, state.workOrderId)}`;
const verificationBriefing = (state, reportPath) =>
  `Verify ${state.workOrderPath}; write the immutable report to ${reportPath}. ${costLineBriefing}`;
const finalReviewBriefing = (state, reportPath) =>
  `Final-review ${state.workOrderPath}, the complete verification sequence, and ideation receipt; write ${reportPath}. ${costLineBriefing}`;
const recordedBriefings = {
  active: executionBriefing,
  repairing: repairBriefing,
  verifying: (state) =>
    verificationBriefing(state, state.latestVerificationPath),
  "final-review": (state) => finalReviewBriefing(state, state.finalReviewPath),
};

export const main = async (argv = process.argv.slice(2)) => {
  const [action = "status", ...rawArgs] = argv;
  let releaseExecutorWriter;
  reportHarnessRuntime(repoRoot);
  const { args, workOrder } = selectionArgs(rawArgs);
  let control = readControl(repoRoot);
  const branch = action === "usage" ? undefined : branchWorkOrder(repoRoot);
  let latestClosed =
    action === "usage"
      ? undefined
      : latestClosedOrder(control, repoRoot, "HEAD", branch);
  if (action === "activate" && workOrder && args[0] !== workOrder)
    throw new Error("activation id must match --work-order");
  if (action === "activate" && branch && !workOrder && args[0] !== branch)
    throw new Error(
      `activation binds ${branch}; use --work-order ${args[0]} to override`,
    );
  const selected =
    action === "times" || action === "usage"
      ? undefined
      : selectWorkOrder(control, {
          workOrder: action === "activate" ? args[0] : workOrder,
          branch,
          latestClosed,
          allowNew: action === "activate",
          allowAmbiguous: action === "status" && !args.includes("--json"),
        });
  let state = control.orders.get(selected)?.state ?? fold([]);
  let message;

  switch (action) {
    case "usage": {
      if (
        workOrder ||
        args.length > 1 ||
        (args.length === 1 && args[0] !== "--json")
      )
        throw new Error("usage: resume usage [--json]");
      const usage = controlUsageProjection(control);
      message =
        args[0] === "--json"
          ? JSON.stringify(usage, null, 2)
          : renderControlUsage(usage);
      break;
    }
    case "status": {
      if (args.length > 1 || (args.length === 1 && args[0] !== "--json"))
        throw new Error("usage: resume status [--json]");
      const rendered = render(control, latestClosed);
      warnIfProjectionDisagrees(rendered);
      message =
        args[0] === "--json"
          ? JSON.stringify(
              statusProjection(
                control,
                selected,
                readDependencies(repoRoot, state, control),
              ),
              null,
              2,
            )
          : rendered;
      if (
        args[0] !== "--json" &&
        existsSync(docPath(repoRoot, "control", "budgets.json"))
      ) {
        const { collectMeta, metaHealth } = await import("./lib/meta.mjs");
        message += `\n${metaHealth(await collectMeta(repoRoot))}\n`;
      }
      break;
    }
    case "times":
      if (args.length || workOrder) throw new Error("usage: resume times");
      {
        const events = [];
        const locations = [];
        for (const [segment, entries] of control.eventSegments) {
          for (const [index, event] of entries.entries()) {
            events.push(event);
            locations.push(
              segment === storage.legacy
                ? undefined
                : { segment, ordinal: index + 1 },
            );
          }
        }
        message = recoverControlTimes(repoRoot, events, locations);
      }
      break;
    case "briefing": {
      if (args.length)
        throw new Error("usage: resume briefing [--work-order WO-NNN]");
      const recorded = recordedBriefings[state.phase];
      if (!recorded)
        throw new Error(
          `no dispatch is recorded in phase ${state.phase}; run: ${
            legalActions(state)
              .map((action) => commandFor(action, state.workOrderId))
              .join(" or ") || "no command is currently legal"
          }`,
        );
      message = recorded(state);
      break;
    }
    case "activate": {
      requirePhase(state, "none", "closed");
      const [workOrderId, workOrderPath] = args;
      if (!/^WO-\d{3}$/.test(workOrderId ?? "") || !workOrderPath)
        throw new Error(
          "usage: resume activate WO-NNN docs/work-orders/<file>.md",
        );
      const declaration = workOrderDeclaration(workOrderPath, { workOrderId });
      const repository = declaration.repository;
      if (
        repository &&
        !Object.hasOwn(loadConfig(repoRoot).repositories, repository.id)
      )
        throw new Error(
          `${workOrderPath}: unknown repository id ${JSON.stringify(repository.id)} in dotln.config.json`,
        );
      const dependencies = readDependencies(
        repoRoot,
        { workOrderId, workOrderPath },
        control,
      );
      if (dependencies.blocking.length)
        throw new Error(dependencyRefusal(workOrderPath, dependencies));
      appendTransition(action, {
        type: "WorkOrderActivated",
        workOrderId,
        workOrderPath,
        effortDeclarationValidated: true,
        ...(repository
          ? {
              repositoryId: repository.id,
              baseCommit: repository.baseCommit,
            }
          : {}),
      });
      message = `Activated ${workOrderId}.`;
      break;
    }
    case "implementation-ready": {
      requirePhase(state, "active");
      const actor = completionActor(action, args, state, "executor");
      releaseExecutorWriter = await executorWriterRelease(repoRoot);
      const evidence = await requireLifecycleEvidence(
        repoRoot,
        action,
        undefined,
        state.workOrderId,
      );
      appendTransition(action, {
        type: "ImplementationReady",
        ...(evidence ? { evidence } : {}),
        workOrderId: state.workOrderId,
        actor,
      });
      message = `${state.workOrderId} is ready for verification.`;
      break;
    }
    case "verify": {
      requirePhase(state, "ready-to-verify");
      const verificationId = nextVerification(state);
      const reportPath = docRelative(
        repoRoot,
        "verifications",
        `${state.workOrderId}/${verificationId}.md`,
      );
      appendTransition(action, {
        type: "VerificationRequested",
        workOrderId: state.workOrderId,
        verificationId,
        reportPath,
        costLine: COST_LINE_REQUIRED,
      });
      message = verificationBriefing(state, reportPath);
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
      const verificationRoot = docPath(
        repoRoot,
        "verifications",
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
      requireReceiptCostLine(repoRoot, state.latestVerificationPath);
      const evidence = await requireLifecycleEvidence(
        repoRoot,
        action,
        verdict,
        state.workOrderId,
      );
      appendTransition(action, {
        type: "VerificationCompleted",
        ...(evidence ? { evidence } : {}),
        workOrderId: state.workOrderId,
        verificationId: state.latestVerificationId,
        reportPath: state.latestVerificationPath,
        verdict,
        actor,
      });
      message = `Recorded ${state.latestVerificationId}: ${verdict}.`;
      break;
    }
    case "fix": {
      if (
        state.phase !== "needs-fix" &&
        !(
          state.phase === "ready-to-verify" &&
          state.failureSourceId &&
          state.failureSourcePath
        )
      )
        requirePhase(state, "needs-fix");
      message = repairBriefing(state);
      appendTransition(action, {
        type: "RepairRequested",
        workOrderId: state.workOrderId,
        sourceFindingId: state.failureSourceId,
        sourceReportPath: state.failureSourcePath,
      });
      break;
    }
    case "repair-complete": {
      requirePhase(state, "repairing");
      const actor = completionActor(action, args, state, "executor");
      releaseExecutorWriter = await executorWriterRelease(repoRoot);
      const evidence = await requireLifecycleEvidence(
        repoRoot,
        action,
        undefined,
        state.workOrderId,
      );
      appendTransition(action, {
        type: "RepairCompleted",
        ...(evidence ? { evidence } : {}),
        workOrderId: state.workOrderId,
        sourceVerificationId: state.failureSourceId,
        actor,
      });
      message = `${state.workOrderId} repair is ready for re-verification.`;
      break;
    }
    case "final-review": {
      requirePhase(state, "verified");
      const finalReviewId = nextFinalReview(state);
      const reportPath = docRelative(
        repoRoot,
        "finalReviews",
        `${state.workOrderId}/${finalReviewId}.md`,
      );
      appendTransition(action, {
        type: "FinalReviewRequested",
        workOrderId: state.workOrderId,
        throughVerificationId: state.latestVerificationId,
        finalReviewId,
        reportPath,
        costLine: COST_LINE_REQUIRED,
      });
      message = finalReviewBriefing(state, reportPath);
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
      const finalReviewRoot = docPath(
        repoRoot,
        "finalReviews",
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
      requireReceiptCostLine(repoRoot, state.finalReviewPath);
      const evidence = await requireLifecycleEvidence(
        repoRoot,
        action,
        verdict,
        state.workOrderId,
      );
      appendTransition(action, {
        type: "FinalReviewCompleted",
        ...(evidence ? { evidence } : {}),
        workOrderId: state.workOrderId,
        finalReviewId: state.finalReviewId,
        reportPath: state.finalReviewPath,
        verdict,
        actor,
      });
      message =
        verdict === "pass"
          ? `Recorded final review pass; commit the reviewed state, then run npm run worktree -- publish ${state.workOrderId} --title "<title>" --body-file <contained-reviewed-body-path>.`
          : "Recorded final review failure; return to bounded repair.";
      break;
    }
    case "next": {
      requirePhase(state, "active", "closed");
      let restricted = "";
      if (args.length) {
        if (
          state.phase !== "active" ||
          args.length !== 2 ||
          args[0] !== "--beacon-session"
        )
          throw new Error(
            "usage: resume next [--beacon-session <host-issued capability>] (active only)",
          );
        restricted = `\n${restrictedBeaconBriefing(repoRoot, state.workOrderId, args[1])}`;
      }
      message =
        state.phase === "active"
          ? `${executionBriefing(state)}${restricted}`
          : `Current work order ${state.workOrderId} is closed. ${openOrders(control).length ? `Other in-flight orders: ${openOrders(control).join(", ")}; inspect one with npm run resume -- status --work-order WO-NNN.` : "The repository is between work orders; start a valid next work order with npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-name.md."}`;
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
      // Main's copy of the helper is the reviewed one once the order is merged,
      // and it survives the removal of the subject worktree the helper performs.
      const helper = `${shellQuote(process.execPath)} ${shellQuote(join(mainPath, "scripts/release.mjs"))} close ${state.workOrderId} --publish`;
      const egress =
        "The helper needs network egress to the GitHub host for fetch, ls-remote, the tag push and the Release: run it in an authorized session with egress and host approval. --dry-run previews reachability and the publication manifest.";
      message =
        resolve(mainPath) === resolve(repoRoot)
          ? `After the operator merges the PR, run the reviewed helper from this main checkout: ${helper}. This narrowly authorizes the annotated tag and its matching GitHub Release; never push main. ${egress}`
          : `After the operator merges the PR, start a session in the main checkout and run the reviewed helper there: cd ${shellQuote(mainPath)} && ${helper}. This narrowly authorizes the annotated tag and its matching GitHub Release; never push main. ${egress}`;
      break;
    }
    default:
      throw new Error(`unknown resume action: ${action}`);
  }

  try {
    if (!["status", "times", "usage", "briefing"].includes(action)) {
      control = readControl(repoRoot);
      latestClosed = latestClosedOrder(
        control,
        repoRoot,
        "HEAD",
        branch ?? selected,
      );
      project(render(control, latestClosed));
      if (!["next", "release-close"].includes(action))
        await refreshExecutorIndex(repoRoot);
    }
    const codexDispatchRole = codexDispatchRoles[action];
    const harnessHostPath = join(
      repoRoot,
      "packages/skeleton/dist/src/harness-host.js",
    );
    if (process.env.CODEX_THREAD_ID && codexDispatchRole) {
      if (existsSync(harnessHostPath)) {
        const { beginHarnessSessionOnce } = await import(
          pathToFileURL(harnessHostPath)
        );
        beginHarnessSessionOnce(
          repoRoot,
          process.env.CODEX_THREAD_ID,
          codexDispatchRole,
        );
      } else {
        process.stderr.write(
          "DotLn advisory: Codex session entry unavailable; harness runtime is not built. Run npm run build before the next dispatch; process cost remains unknown; cause no-session.\n",
        );
      }
    }
    // Informational readback, independent of token-counter availability and phase gates.
    if (
      (process.env.CODEX_THREAD_ID || process.env.COPILOT_AGENT_SESSION_ID) &&
      [
        "status",
        "next",
        "briefing",
        "fix",
        "verify",
        "final-review",
        "implementation-ready",
        "repair-complete",
        "verification-result",
        "final-review-result",
      ].includes(action)
    ) {
      const report = await currentHarnessSessionReport(repoRoot);
      message =
        action === "status" && args.includes("--json")
          ? JSON.stringify(
              { ...JSON.parse(message), currentSession: report.session },
              null,
              2,
            )
          : `${message}\n${report.text}`;
    }
    if (!["status", "times", "usage"].includes(action)) {
      const observationState = [
        "activate",
        "fix",
        "verify",
        "final-review",
      ].includes(action)
        ? (control.orders.get(selected)?.state ?? state)
        : state;
      message += `\n${await observedFactsReport(repoRoot, observationState, message)}`;
    }
  } catch (error) {
    if (releaseExecutorWriter)
      throw new Error(
        `Completion recorded; final handoff failed: ${error.message}. Do not repeat the transition.`,
        { cause: error },
      );
    throw error;
  } finally {
    // The durable result has recorded. Release even if a later projection fails:
    // retrying that transition is illegal, and Codex has no subsequent Stop hook.
    releaseExecutorWriter?.();
  }
  process.stdout.write(`${message}\n`);
};

if (isMainModule(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
