import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  realpathSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { spawnGit, runGit } from "./git.mjs";
import { docPath, planFirstDirectory } from "./config.mjs";
import { readFeatures } from "./features.mjs";
import { readControl } from "./control-store.mjs";
import { targetWorktreeForOrder } from "./target-worktrees.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  createTemporaryRoot,
  readTemporaryOwner,
  writeTemporaryOwner,
  readRetention,
  finishTemporaryRoot,
} from "./temporary-roots.mjs";

export const planDigest = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const inside = (root, path) => path === root || path.startsWith(root + sep);
const candidateRecord = (root, order) =>
  docPath(root, "control", "local/plan-first", `${order}.json`);
export function planFirstContext(root, state) {
  if (!/^WO-\d{3}$/.test(state?.workOrderId ?? ""))
    throw new Error("plan-first requires a selected order");
  let target;
  if (state.repositoryId) {
    target = targetWorktreeForOrder(root, state.workOrderId);
    if (
      !target ||
      realpathSync(target.launchpad) !== realpathSync(root) ||
      target.repositoryId !== state.repositoryId
    )
      throw new Error(
        "plan-first requires the order's registered target worktree",
      );
  }
  const codeRoot = target?.target ?? root;
  const directory = planFirstDirectory(root, state.workOrderId, target);
  return {
    codeRoot,
    directory,
    evidenceDirectory: docPath(root, "evidence", state.workOrderId),
    intakeDirectory: docPath(root, "intake"),
    documents: ["plan.md", "conversation.md", "proposal.md"].map((name) => ({
      name,
      path: join(directory, name),
    })),
  };
}
export function selectedPlanState(root, order) {
  return readControl(root).orders.get(order)?.state;
}
export function planFirstView(root, state) {
  if (!readFeatures(root)["plan-first"] || !state?.workOrderId)
    return undefined;
  if (state.phase !== "active") return state.planFirst;
  const context = planFirstContext(root, state);
  const recorded = state.planFirst;
  const changed = [];
  if (recorded) {
    if (runGit(context.codeRoot, ["rev-parse", "HEAD"]) !== recorded.baseCommit)
      changed.push("base commit");
    for (const doc of context.documents) {
      const expected = recorded.documents.find(
        (row) => row.path === relative(context.codeRoot, doc.path),
      );
      if (
        !expected ||
        !containedRegularFile(doc.path, context.codeRoot) ||
        planDigest(readFileSync(doc.path)) !== expected.sha256
      )
        changed.push(doc.name);
    }
  }
  return {
    ...(recorded ?? {}),
    proposedAt: recorded?.proposedAt ?? null,
    approvedAt: changed.length ? null : (recorded?.approvedAt ?? null),
    documents:
      recorded?.documents ??
      context.documents.map((doc) => ({
        path: relative(context.codeRoot, doc.path),
        sha256: null,
      })),
    changed,
  };
}
export function planFirstRefusal(root, state = undefined, order = undefined) {
  state ??= selectedPlanState(root, order);
  const view = planFirstView(root, state);
  if (state?.phase !== "active" || !view || view.approvedAt) return null;
  return `DOTLN_PLAN_FIRST_REFUSED: read ${join(planFirstContext(root, state).directory, "conversation.md")}; ${view.changed.length ? `changed since proposal: ${view.changed.join(", ")}; revise the proposal, then ` : ""}record the operator's approval with npm run resume -- plan-approved --work-order ${state.workOrderId} before implementation.`;
}
export function requirePlanApproval(root, state) {
  const refusal = planFirstRefusal(root, state);
  if (refusal) throw new Error(refusal);
}
export function readPlanCandidate(root, state) {
  const file = candidateRecord(root, state.workOrderId);
  if (!containedRegularFile(file, root))
    throw new Error(
      "plan-first candidate is missing; run scripts/plan-first.mjs draft",
    );
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  if (
    !candidate.scratch ||
    !existsSync(candidate.scratch) ||
    !existsSync(candidate.path)
  )
    throw new Error(
      "plan-first candidate is missing; retain the proposal and run draft WO-NNN --new",
    );
  const owner = readTemporaryOwner(candidate.scratch);
  const context = planFirstContext(root, state);
  if (
    owner?.class !== "session-scratch" ||
    (candidate.token && owner.token !== candidate.token) ||
    owner.owner.workOrder !== state.workOrderId ||
    realpathSync(owner.owner.repository) !== realpathSync(root) ||
    candidate.path !== join(candidate.scratch, "candidate") ||
    !inside(realpathSync(candidate.scratch), realpathSync(candidate.path)) ||
    candidate.codeRoot !== realpathSync(context.codeRoot)
  )
    throw new Error("plan-first candidate ownership differs");
  return candidate;
}
export function draftPlanCandidate(
  root,
  state,
  scratchParent = tmpdir(),
  renew = false,
) {
  if (state.phase !== "active" || !readFeatures(root)["plan-first"])
    throw new Error("plan-first draft requires an active elected order");
  const file = candidateRecord(root, state.workOrderId);
  if (existsSync(file) && !containedRegularFile(file, root))
    throw new Error(
      "plan-first candidate record must be a contained regular file",
    );
  // Renewal preserves the old reference even when its disposable directory
  // is gone. It never adopts or writes through that old reference.
  const prior = existsSync(file)
    ? renew
      ? JSON.parse(readFileSync(file, "utf8"))
      : readPlanCandidate(root, state)
    : undefined;
  if (prior && !renew) return prior;
  const { codeRoot } = planFirstContext(root, state);
  const scratch = createTemporaryRoot(join(scratchParent, "dotln-plan-"), {
    class: "session-scratch",
    repository: root,
    owner: { workOrder: state.workOrderId },
    // A plan survives the draft CLI and any number of operator turn breaks.
    // The lifecycle completion explicitly releases this retention override.
    retentionHours: null,
  });
  const path = join(scratch, "candidate");
  const clone = spawnGit(
    [
      "clone",
      "--no-hardlinks",
      "--no-checkout",
      "--quiet",
      "--",
      codeRoot,
      path,
    ],
    { encoding: "utf8" },
  );
  if (clone.status !== 0) throw new Error("plan-first candidate clone failed");
  const baseCommit = runGit(codeRoot, ["rev-parse", "HEAD"]);
  runGit(path, ["checkout", "--quiet", "--detach", baseCommit]);
  const candidate = {
    scratch,
    path,
    codeRoot: realpathSync(codeRoot),
    baseCommit,
    token: readTemporaryOwner(scratch).token,
    ...(prior
      ? {
          previous: [
            ...(prior.previous ?? []),
            {
              scratch: prior.scratch,
              path: prior.path,
              baseCommit: prior.baseCommit,
              token: prior.token,
            },
          ],
        }
      : {}),
  };
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(candidate) + "\n", {
    flag: prior ? "w" : "wx",
  });
  return candidate;
}
export function candidateDiff(root, state) {
  const candidate = readPlanCandidate(root, state);
  // The index belongs only to this disposable candidate. Staging captures new
  // files and binary content without changing the implementation worktree.
  runGit(candidate.path, ["add", "-A"]);
  const diff = runGit(
    candidate.path,
    [
      "diff",
      "--cached",
      "--binary",
      "--full-index",
      "--no-ext-diff",
      "--no-textconv",
      candidate.baseCommit,
      "--",
    ],
    { trim: false },
  );
  return { ...candidate, diff, diffDigest: planDigest(diff) };
}
export function readPlanMarker(text) {
  const match = /^<!-- dotln-plan-first\n([\s\S]*?)\n-->\n/.exec(text);
  let marker;
  try {
    marker = JSON.parse(match?.[1]);
  } catch {
    throw new Error("invalid dotln-plan-first marker");
  }
  if (
    marker.status !== "proposed" ||
    !Number.isFinite(Date.parse(marker.proposedAt)) ||
    !/^[a-f0-9]{64}$/.test(marker.conversationDigest ?? "") ||
    !Array.isArray(marker.transformations) ||
    marker.transformations.some(
      (row) =>
        !row ||
        ["at", "from", "to", "surface"].some(
          (key) => typeof row[key] !== "string" || !row[key].trim(),
        ) ||
        !Number.isFinite(Date.parse(row.at)),
    )
  )
    throw new Error("invalid dotln-plan-first marker fields");
  return marker;
}
export const planMarker = (marker) =>
  `<!-- dotln-plan-first\n${JSON.stringify(marker, null, 2)}\n-->\n`;
export const proposalPatch = (diff) => {
  const fence = "~".repeat(
    Math.max(
      3,
      ...[...diff.matchAll(/~+/g)].map((match) => match[0].length + 1),
    ),
  );
  return `<!-- dotln-plan-first-diff:start -->\n${fence}diff\n${diff}${fence}\n<!-- dotln-plan-first-diff:end -->\n`;
};
export function proposedPlan(
  root,
  state,
  candidate = candidateDiff(root, state),
) {
  const context = planFirstContext(root, state);
  if (runGit(context.codeRoot, ["rev-parse", "HEAD"]) !== candidate.baseCommit)
    throw new Error(
      "plan-first candidate base moved; draft a new candidate with scripts/plan-first.mjs draft --new",
    );
  const texts = Object.fromEntries(
    context.documents.map((doc) => {
      if (!containedRegularFile(doc.path, context.codeRoot))
        throw new Error(`missing plan-first document: ${doc.name}`);
      return [doc.name, readFileSync(doc.path, "utf8")];
    }),
  );
  const conversationDigest = planDigest(texts["conversation.md"]);
  if (
    !/^### \d{4}-\d{2}-\d{2}[^\n]* — (Operator|Agent|Agent, paraphrasing the terminal)\s*$/m.test(
      texts["conversation.md"],
    )
  )
    throw new Error("conversation.md requires dated writer headings");
  const markers = ["plan.md", "proposal.md"].map((name) =>
    readPlanMarker(texts[name]),
  );
  if (
    markers.some(
      (marker) => marker.conversationDigest !== conversationDigest,
    ) ||
    JSON.stringify(markers[0]) !== JSON.stringify(markers[1])
  )
    throw new Error("plan-first markers differ or conversation digest changed");
  const patch =
    /(?:^|\n)<!-- dotln-plan-first-diff:start -->\n(~{3,})diff\n([\s\S]*?)(?<=\n)\1\n<!-- dotln-plan-first-diff:end -->\n/.exec(
      texts["proposal.md"],
    );
  // Git diff framing uses LF; CR and Unicode separators can be payload bytes.
  const outerMarkers = texts["proposal.md"]
    .split("\n")
    .filter((line) => line === "<!-- dotln-plan-first-diff:start -->").length;
  if (!patch || patch[2] !== candidate.diff || outerMarkers !== 1)
    throw new Error("candidate diff does not match proposal.md");
  return {
    baseCommit: candidate.baseCommit,
    diffDigest: candidate.diffDigest,
    proposedAt: markers[0].proposedAt,
    documents: context.documents.map((doc) => ({
      path: relative(context.codeRoot, doc.path),
      sha256: planDigest(texts[doc.name]),
    })),
  };
}
export function applyPlanCandidate(root, state) {
  if (state?.phase !== "active" || !planFirstView(root, state)?.approvedAt)
    throw new Error(
      "DOTLN_PLAN_FIRST_REFUSED: apply requires an active approved proposal; read conversation.md and record plan-approved",
    );
  requirePlanApproval(root, state);
  const candidate = candidateDiff(root, state);
  const proposal = proposedPlan(root, state, candidate);
  if (proposal.diffDigest !== state.planFirst.diffDigest)
    throw new Error("approved candidate diff changed");
  const { codeRoot } = planFirstContext(root, state);
  if (!candidate.diff)
    return { applied: false, diffDigest: proposal.diffDigest };
  // git apply checks all touched paths before changing any. It will not
  // overwrite concurrent work or follow a patch through an existing symlink.
  for (const check of [true, false]) {
    const result = spawnGit(
      ["-C", codeRoot, "apply", ...(check ? ["--check"] : []), "--binary", "-"],
      { input: candidate.diff, encoding: "utf8" },
    );
    if (result.status !== 0)
      throw new Error(
        `plan-first application ${check ? "check " : ""}failed; implementation retained`,
      );
  }
  return { applied: true, diffDigest: proposal.diffDigest };
}

/** A completed or withdrawn order no longer needs a pinned draft. Keep its
 * normal recovery window; ordinary owned-root cleanup can retire it afterward. */
export function releasePlanCandidates(root, state) {
  const file = candidateRecord(root, state.workOrderId);
  if (!existsSync(file)) return [];
  if (!containedRegularFile(file, root))
    throw new Error(
      "plan-first candidate record must be a contained regular file",
    );
  const current = JSON.parse(readFileSync(file, "utf8"));
  const released = [];
  for (const candidate of [current, ...(current.previous ?? [])]) {
    if (!candidate.scratch || !existsSync(candidate.scratch)) continue;
    const owner = readTemporaryOwner(candidate.scratch);
    if (
      owner?.class !== "session-scratch" ||
      owner.owner.workOrder !== state.workOrderId ||
      realpathSync(owner.owner.repository) !== realpathSync(root) ||
      (candidate.token && candidate.token !== owner.token)
    )
      continue;
    delete owner.retentionOverride;
    owner.retentionHours = readRetention(root)["session-scratch"];
    writeTemporaryOwner(candidate.scratch, owner);
    finishTemporaryRoot(candidate.scratch, "passed");
    released.push(candidate.scratch);
  }
  return released;
}
