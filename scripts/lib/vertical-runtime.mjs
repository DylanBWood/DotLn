/** Kit-owned bridge for the operator and resident entries. No issue text grants
 * authority: target, phase, profile, inference inputs and actors are host input. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import {
  compileLoadout,
  decodeSnapshotIndex,
  repositoryPath,
  normalizeAuthorityGrants,
} from "@dotln/compiler";
import { findLaunchpad, loadConfig } from "./config.mjs";
import { readControl } from "./control-store.mjs";
import {
  fileIntent,
  materializeOrder,
  replayAllocations,
} from "./derived-orders.mjs";
import {
  readAuthorityGrantRegistry,
  registeredProfileMismatches,
} from "./authority-grants.mjs";
import { parseGitHubTarget } from "./github-repository.mjs";
import { runGit } from "./git.mjs";
import {
  fetchIssueBundle,
  IssueSourceRefusal,
  requireCompleteIssueBundle,
} from "../../packages/skeleton/dist/src/github-issue-source.js";
import {
  admitIntent,
  IntentPreparationRefusal,
  verticalEqual,
  intentBudgetUsed,
  verticalProgram,
} from "../../packages/skeleton/dist/src/vertical.js";
import { VerticalHost } from "../../packages/skeleton/dist/src/vertical-host.js";
import { verticalResident } from "../../packages/skeleton/dist/src/vertical-resident.js";
import {
  residentVerticalScheduling,
  verticalAuthorityObserver,
} from "../../packages/skeleton/dist/src/vertical-scheduling.js";
import {
  decodeResidentConfiguration,
  intentAdmissionReady,
} from "../../packages/skeleton/dist/src/resident-state.js";
import { ResidentStore } from "../../packages/skeleton/dist/src/resident-store.js";
import { createVerticalPrimitives } from "./vertical-primitives.mjs";

const read = (file) => JSON.parse(readFileSync(file, "utf8"));
const need = (ok, why) => {
  if (!ok) throw new Error(`vertical configuration: ${why}`);
};
const prepareNeed = (ok, step, reason, transient = false) => {
  if (!ok) throw new IntentPreparationRefusal(step, reason, transient);
};
/** The issue's decode and completeness are the intent's own inputs, so their
 * refusal is a decision. The forge, a concurrent edit and the local bundle
 * store are conditions of the read; the draft stays undecided for a retry. */
const ISSUE_SOURCE_REFUSALS = {
  input: ["issue source cannot be decoded", false],
  incomplete: ["issue source is incomplete", false],
  gh: ["issue source is unavailable", true],
  changed: ["issue changed during the read", true],
  storage: ["issue bundle store is unavailable", true],
};
/** An unreadable target is the host's condition, never the draft's input. */
const readTarget = (target, args, options) => {
  try {
    return runGit(target, args, options);
  } catch {
    throw new IntentPreparationRefusal(
      "surfaces",
      "target repository could not be read",
      true,
    );
  }
};
// realpath keeps a volume alias unchanged (WO-162 D004); the physical working
// directory is the identity the source-change guards compare (D003).
const directoryIdentity = (path) => {
  try {
    return execFileSync("/bin/pwd", ["-P"], {
      cwd: path,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5_000,
    }).replace(/\n$/u, "");
  } catch {
    return undefined;
  }
};
const targetReadable = (target) => {
  try {
    runGit(target, ["rev-parse", "--show-toplevel"]);
    return true;
  } catch {
    return false;
  }
};
/** The target origin's forge selector, or undefined when it has none. */
const targetForge = (target) => {
  try {
    return parseGitHubTarget(
      runGit(target, ["remote", "get-url", "origin"]),
    ).selector.toLowerCase();
  } catch {
    return undefined;
  }
};
function referencesIssue(draft, repositoryId, number) {
  const expected = `https://${repositoryId}/issues/${number}`;
  return (draft.objective.match(/https:\/\/[^\s<>"`]+/gu) ?? []).some(
    (token) => token.replace(/[),.;\]]+$/u, "") === expected,
  );
}
export function readVerticalConfiguration(directory, root = findLaunchpad()) {
  const value = read(join(directory, "vertical.json"));
  const keys = [
    "schemaVersion",
    "target",
    "repositoryId",
    "worktreeParent",
    "phaseId",
    "profile",
    "issues",
    "workers",
    "conventionsPath",
    "browserScenario",
    "checkTests",
    "judgments",
  ];
  need(
    value &&
      value.schemaVersion === 1 &&
      Object.keys(value).every((k) => keys.includes(k)),
    "unknown or missing schema fields",
  );
  for (const name of ["target", "worktreeParent"]) {
    need(
      typeof value[name] === "string" &&
        resolve(value[name]) === value[name] &&
        realpathSync.native(value[name]) === value[name] &&
        directoryIdentity(value[name]) === value[name],
      `${name} must be a canonical directory`,
    );
  }
  const selector = parseGitHubTarget(`https://${value.repositoryId}`);
  need(
    selector.selector === value.repositoryId,
    "repositoryId must be HOST/OWNER/REPO",
  );
  need(
    typeof value.phaseId === "string" &&
      Array.isArray(value.issues) &&
      value.issues.length > 0,
    "phase and issue bindings required",
  );
  need(
    value.issues.every(
      (i) =>
        i &&
        Object.keys(i).every((k) =>
          [
            "number",
            "draftId",
            "inferences",
            "revisionId",
            "baselineAssessment",
          ].includes(k),
        ) &&
        Number.isSafeInteger(i.number) &&
        i.number > 0 &&
        (i.draftId === undefined || /^WO-\d+$/u.test(i.draftId)) &&
        Array.isArray(i.inferences) &&
        typeof i.revisionId === "string",
    ),
    "issue classifications must name an issue and exact source revision",
  );
  need(
    new Set(value.issues.map((i) => i.number)).size === value.issues.length,
    "duplicate issue binding",
  );
  need(
    value.workers &&
      Object.keys(value.workers).sort().join(",") ===
        "effort,model,transport" &&
      ["codex-cli-exec", "claude-cli-print"].includes(
        value.workers.transport,
      ) &&
      typeof value.workers.model === "string" &&
      typeof value.workers.effort === "string",
    "explicit worker transport, model and effort required",
  );
  const resident = decodeResidentConfiguration(
    read(join(directory, "resident.json")),
  );
  try {
    const config = loadConfig(root);
    const portfolio = resident.portfolio?.definition;
    need(
      portfolio?.class === "intent" &&
        config.portfolios[portfolio.portfolioId] &&
        verticalEqual(config.portfolios[portfolio.portfolioId], portfolio),
      "resident intent portfolio differs from the registered portfolio",
    );
    need(
      portfolio.repo !== "self" &&
        config.repositories[portfolio.repo]?.authorityProfile,
      "intent target must be a registered repository with an authority profile",
    );
    // A readable target with another or no origin is the entry's own input and
    // holds; a target that cannot be read is a transient condition (D024).
    if (targetReadable(value.target))
      need(
        targetForge(value.target) === value.repositoryId.toLowerCase(),
        "target origin differs from the configured forge",
      );
    const grants = readAuthorityGrantRegistry(root);
    const admittedGrants = normalizeAuthorityGrants(
      resident.environment.authorityGrantRegistry ?? [],
    );
    need(
      admittedGrants.every((g) => grants.some((a) => verticalEqual(a, g))),
      "resident grants differ from the host registry",
    );
    const compiled = compileLoadout(resident.graph, resident.environment);
    need(
      compiled.ok &&
        registeredProfileMismatches({
          program: compiled.program,
          environment: resident.environment,
          repository: {
            ...config.repositories[portfolio.repo],
            id: value.target,
          },
          registry: grants,
        }).length === 0,
      "resident floor departs from the registered target profile",
    );
    need(
      resolve(root, config.repositories[portfolio.repo].worktreeParent) ===
        value.worktreeParent,
      "worktree parent differs from the registered target",
    );
    return {
      ...value,
      root,
      resident,
      portfolio,
      grants: admittedGrants,
      baseBranch: config.repositories[portfolio.repo].baseBranch,
    };
  } catch {
    return {
      ...value,
      root,
      resident,
      portfolio: { unreadable: true },
      grants: [],
      admissionFailure:
        "registered intent portfolio or grants could not be decoded or bound",
    };
  }
}

/** Bounded read of committed files supplies the existing pure index contract.
 * The later WO-054 preparation seals exactly this base before any worker. */
function targetIndex(target, baseCommit) {
  prepareNeed(
    readTarget(target, ["rev-parse", "--show-toplevel"]) === target &&
      readTarget(target, ["status", "--porcelain", "--untracked-files=all"]) ===
        "",
    "surfaces",
    "target must be a clean Git root",
    true,
  );
  const entries = readTarget(target, ["ls-tree", "-r", "-z", baseCommit], {
    trim: false,
  })
    .split("\0")
    .filter(Boolean);
  prepareNeed(
    entries.length > 0 && entries.length <= 100,
    "surfaces",
    "target exceeds the snapshot file bound",
  );
  return decodeSnapshotIndex(
    entries.map((entry) => {
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/u.exec(entry);
      prepareNeed(
        match && repositoryPath(match[3]),
        "surfaces",
        "target has an unsupported file mode or path",
      );
      const contents = readTarget(target, ["cat-file", "blob", match[2]], {
        trim: false,
      });
      const bytes = Buffer.from(contents);
      prepareNeed(
        bytes.length <= 100000 &&
          !bytes.includes(0) &&
          bytes.toString("utf8") === contents,
        "surfaces",
        "target exceeds the snapshot text bound",
      );
      return {
        path: match[3],
        size: bytes.length,
        hash: createHash("sha256").update(bytes).digest("hex"),
      };
    }),
  );
}
export function createVerticalEntry({
  directory,
  configuration,
  now = Date.now,
  external = {},
}) {
  const cfg = configuration;
  const runs = join(directory, "vertical");
  mkdirSync(runs, { recursive: true });
  const issueFor = (draft) => {
    const identified = cfg.issues.filter(
      (i) => i.draftId === draft.workOrderId,
    );
    const candidates = identified.length
      ? identified
      : cfg.issues.filter(
          (i) =>
            !i.draftId && referencesIssue(draft, cfg.repositoryId, i.number),
        );
    prepareNeed(
      candidates.length === 1,
      "admission",
      "draft has no unique configured issue binding",
    );
    return candidates[0];
  };
  // A binding without a draft identity selects its draft by reference, as
  // issueFor does: a draft another binding names is never its candidate. In
  // either entry it must be the only filed draft that binding can select.
  const draftsFor = (drafts, issue) =>
    drafts.filter((d) =>
      issue.draftId
        ? issue.draftId === d.workOrderId
        : !cfg.issues.some((i) => i.draftId === d.workOrderId) &&
          referencesIssue(d, cfg.repositoryId, issue.number),
    );
  const ports = {
    portfolio: () => cfg.portfolio,
    async drafts() {
      if (cfg.admissionFailure)
        return cfg.issues.map((i) => ({
          workOrderId: i.draftId ?? `unreadable-issue-${i.number}`,
        }));
      const control = readControl(cfg.root);
      return [...replayAllocations(control).values()]
        .filter(
          (e) =>
            e.provenance.kind === "intent" &&
            control.orders.get(e.workOrderId)?.state.phase === "none",
        )
        .map((e) => e.compiled);
    },
    grants: () => cfg.grants,
    async prepare(draft, phase, spent) {
      if (cfg.admissionFailure)
        throw new IntentPreparationRefusal("admission", cfg.admissionFailure);
      const issue = issueFor(draft);
      // Only another selectable draft is a conflict; a draft that has left
      // the filed set since this tick's listing is not one.
      prepareNeed(
        draftsFor(await ports.drafts(), issue).every(
          (d) => d.workOrderId === draft.workOrderId,
        ),
        "admission",
        "issue matches more than one filed draft",
      );
      // The resident reads its configuration once; read the origin again.
      readTarget(cfg.target, ["rev-parse", "--show-toplevel"]);
      prepareNeed(
        targetForge(cfg.target) === cfg.repositoryId.toLowerCase(),
        "admission",
        "target origin differs from the configured forge",
      );
      let result;
      try {
        result = await (external.fetchIssueBundle ?? fetchIssueBundle)(
          `https://${cfg.repositoryId}`,
          issue.number,
          { directory: join(directory, "issue-bundles"), cwd: cfg.root },
        );
        if (result.receipt.refused.length) {
          const item = result.receipt.refused[0];
          throw new IntentPreparationRefusal(
            "bundle",
            `source screen refused item ${item.id} (${item.shape})`,
          );
        }
        requireCompleteIssueBundle(result);
      } catch (error) {
        // The source's own message can carry a field path; record its code only.
        const named =
          error instanceof IssueSourceRefusal &&
          ISSUE_SOURCE_REFUSALS[error.code];
        if (!named) throw error;
        throw new IntentPreparationRefusal("bundle", ...named);
      }
      prepareNeed(
        result.bundle.revisionId === issue.revisionId,
        "contract",
        "issue revision changed; supplied classification requires review",
      );
      const baseCommit = readTarget(cfg.target, ["rev-parse", "HEAD"]);
      return {
        draft,
        bundle: result.bundle,
        forgeHost: cfg.repositoryId.split("/")[0],
        inferences: issue.inferences,
        baselineAssessment: issue.baselineAssessment,
        profile: cfg.profile,
        snapshot: targetIndex(cfg.target, baseCommit),
        target: cfg.target,
        baseCommit,
        phase,
        at: now(),
        spent,
        evidence: cfg.resident.evidence,
      };
    },
    execution(binding) {
      const runDirectory = join(runs, binding.key);
      return {
        materialize: (accepted) =>
          materializeOrder(
            accepted.workOrder,
            { kind: "runtime", sourceId: `vertical:${accepted.key}` },
            {
              root: cfg.root,
              surfaces: accepted.derivation.surfaces.map((s) => s.path),
              activate: true,
            },
          ),
        async execute(command, state, active) {
          try {
            return await createVerticalPrimitives({
              configuration: cfg,
              directory: runDirectory,
              now,
              external,
              active,
            }).execute(command, state);
          } catch (error) {
            external.onError?.(command.step, error);
            throw error;
          }
        },
      };
    },
  };
  return {
    ports,
    runs,
    draftsFor,
    resident: verticalResident(ports, runs, { steps: 1 }),
  };
}

/** The operator chooses an issue, then converges at the very same admitted
 * binding and VerticalOpened record the resident uses. */
export async function runVerticalIssue({
  directory,
  issue,
  configuration = readVerticalConfiguration(directory),
  now = Date.now,
  external = {},
  steps,
  afterStep,
}) {
  need(
    Number.isSafeInteger(issue) && issue > 0,
    "issue must be a positive number",
  );
  const cfg = configuration;
  if (cfg.admissionFailure)
    return {
      kind: "NeedsHuman",
      step: "admission",
      reason: cfg.admissionFailure,
    };
  // A transient read files nothing and records nothing; the next call retries.
  if (!targetReadable(cfg.target))
    return {
      kind: "NeedsHuman",
      step: "surfaces",
      reason: "target repository could not be read",
    };
  need(
    cfg.issues.some((i) => i.number === issue),
    "issue lacks a host-owned classification binding",
  );
  const entry = createVerticalEntry({
    directory,
    configuration: cfg,
    now,
    external,
  });
  const url = `https://${cfg.repositoryId}/issues/${issue}`;
  const selected = cfg.issues.find((i) => i.number === issue);
  const matches = entry.draftsFor(await entry.ports.drafts(), selected);
  need(matches.length <= 1, "issue matches more than one filed draft");
  let draft = matches[0];
  if (!draft)
    draft = (
      await fileIntent(`Implement ${url}`, {
        root: cfg.root,
        sourceId: `vertical-issue:${cfg.repositoryId}:${issue}`,
      })
    ).workOrder;
  // Both entries reserve budget in one append-locked, replay-validated ledger.
  // The operator provenance only changes presence/due scheduling predicates.
  const ledger = new ResidentStore(directory);
  const context = await ledger.transaction((tx) => {
    if (!tx.resident?.configuration)
      tx.append("ResidentConfigured", { configuration: cfg.resident });
    need(
      verticalEqual(tx.resident.configuration, cfg.resident),
      "resident configuration changed; use a fresh store",
    );
    tx.sample(now());
    return {
      existing: tx.resident.intents?.[draft.workOrderId],
      phase: tx.resident.policy.phases.find((p) => p.phaseId === cfg.phaseId),
      spent: intentBudgetUsed(tx.resident.intents ?? {}, tx.resident.at),
      ready: intentAdmissionReady(
        tx.resident,
        tx.resident.policy.phases.find((p) => p.phaseId === cfg.phaseId),
        true,
        tx.predicates,
      ),
    };
  });
  let decision = context.existing;
  if (!decision) {
    need(context.phase, "operator phase not found");
    const busy = {
      kind: "NeedsHuman",
      step: "admission",
      reason:
        "operator admission is held by current resident authority or work",
    };
    if (!context.ready) return busy;
    let input;
    try {
      input = await entry.ports.prepare(draft, context.phase, context.spent);
      decision = admitIntent(input, cfg.portfolio, cfg.grants);
    } catch (error) {
      decision = {
        kind: "NeedsHuman",
        step: error instanceof IntentPreparationRefusal ? error.step : "bundle",
        reason:
          error instanceof IntentPreparationRefusal
            ? error.message
            : "issue input could not be decoded or read",
      };
      if (!(error instanceof IntentPreparationRefusal) || error.transient)
        return decision;
    }
    decision = await ledger.transaction((tx) => {
      tx.sample(now());
      const state = tx.resident;
      if (state.intents?.[draft.workOrderId])
        return state.intents[draft.workOrderId];
      if (!intentAdmissionReady(state, context.phase, true, tx.predicates))
        return busy;
      if (input) {
        input = {
          ...input,
          at: state.at,
          spent: intentBudgetUsed(state.intents ?? {}, state.at),
        };
        decision = admitIntent(input, cfg.portfolio, cfg.grants);
      }
      if (decision.kind === "admitted")
        tx.append(
          "IntentAdmitted",
          {
            draftId: draft.workOrderId,
            entry: "operator",
            input,
            grants: cfg.grants,
            binding: decision.binding,
            continuation: verticalProgram(decision.binding.key),
          },
          state.at,
          "operator",
        );
      else
        tx.append(
          "IntentHeld",
          {
            draftId: draft.workOrderId,
            entry: "operator",
            step: decision.step,
            reason: decision.reason,
          },
          state.at,
          "operator",
        );
      return decision;
    });
  }
  if (decision.kind !== "admitted") return decision;
  const binding = decision.binding;
  need(
    binding.target === cfg.target &&
      verticalEqual(binding.portfolio, cfg.portfolio) &&
      verticalEqual(binding.grants, cfg.grants),
    "operator restart binding drift",
  );
  const active = verticalAuthorityObserver(ledger, binding, now, (state) => {
    return (
      !state.dispatchHeld &&
      !state.revokedBy.length &&
      !state.machine.current &&
      state.at < binding.authority.expiresAt
    );
  });
  const host = new VerticalHost({
    directory: join(entry.runs, binding.key),
    binding,
    ports: entry.ports.execution(binding),
    now,
    permitted: active,
    active,
    settled: residentVerticalScheduling(
      ledger,
      binding,
      now,
      () => cfg.resident.environment.capabilities,
    ).settled,
    ...(afterStep ? { afterStep } : {}),
  });
  try {
    return await host.run({ ...(steps === undefined ? {} : { steps }) });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !/worker store already has a live host/u.test(error.message)
    )
      throw error;
    return {
      kind: "NeedsHuman",
      step: "admission",
      reason: "vertical continuation is already running",
    };
  }
}
