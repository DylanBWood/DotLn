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
  markdownCodeBlocks,
  markdownComments,
  markdownHeadings,
} from "./markdown-links.mjs";
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
  // The checkout that holds the three documents: the code's own, except for
  // a target order whose registration keeps records in the instance, whose
  // documents are born under the launchpad's evidence root.
  const inInstance = directory === planFirstDirectory(root, state.workOrderId);
  const documentRoot = inInstance ? root : codeRoot;
  return {
    codeRoot,
    documentRoot,
    directory,
    // For a target order, where the documents would be under the
    // registration's other value: a refusal names it when the value changed
    // under a proposed plan.
    ...(target
      ? {
          elsewhere: planFirstDirectory(
            root,
            state.workOrderId,
            target,
            inInstance ? "target" : "instance",
          ),
        }
      : {}),
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
        (row) => row.path === relative(context.documentRoot, doc.path),
      );
      if (
        !expected ||
        !containedRegularFile(doc.path, context.documentRoot) ||
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
        path: relative(context.documentRoot, doc.path),
        sha256: null,
      })),
    changed,
  };
}
export function planFirstRefusal(root, state = undefined, order = undefined) {
  state ??= selectedPlanState(root, order);
  const view = planFirstView(root, state);
  if (state?.phase !== "active" || !view || view.approvedAt) return null;
  const context = planFirstContext(root, state);
  // The registration's records value changed while the order was active:
  // the documents are where they were born, and are read from the other
  // place now.
  const moved =
    context.elsewhere &&
    !existsSync(join(context.directory, "conversation.md")) &&
    existsSync(join(context.elsewhere, "conversation.md"));
  return `DOTLN_PLAN_FIRST_REFUSED: ${moved ? `the registration's records value changed while this order was active: its plan-first documents are in ${context.elsewhere} and are now read from ${context.directory}; move the three documents there, or restore the value, then propose again` : `read ${join(context.directory, "conversation.md")}`}; ${view.changed.length ? `changed since proposal: ${view.changed.join(", ")}; revise the proposal, then ` : ""}record the operator's approval with npm run resume -- plan-approved --work-order ${state.workOrderId} before implementation.`;
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
  // The marker is the document's first bytes: one comment, on lines of its
  // own, whose text opens with the marker's name.
  const [first] = markdownComments(text);
  const named = "dotln-plan-first\n";
  let marker;
  try {
    marker = JSON.parse(
      first?.start === 0 &&
        text[first.end] === "\n" &&
        first.text.startsWith(named)
        ? first.text.slice(named.length)
        : undefined,
    );
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
const DIFF_START = "<!-- dotln-plan-first-diff:start -->";
const DIFF_END = "<!-- dotln-plan-first-diff:end -->";
export const proposalPatch = (diff) => {
  const fence = "~".repeat(
    Math.max(
      3,
      ...[...diff.matchAll(/~+/g)].map((match) => match[0].length + 1),
    ),
  );
  return `${DIFF_START}\n${fence}diff\n${diff}${fence}\n${DIFF_END}\n`;
};
/** The diff a proposal carries: the bytes of the tilde-fenced diff block
 * that sits between the two markers, each on the line next to it, closed by
 * a fence as long as its opening one; null when there is none. The fence is
 * longer than any tilde run in the diff, so no payload line can close it. */
const proposalDiff = (proposal) => {
  const block = markdownCodeBlocks(proposal).find(
    (row) =>
      row.fence[0] === "~" &&
      row.info === "diff" &&
      proposal.slice(row.start - DIFF_START.length - 1, row.start) ===
        `${DIFF_START}\n` &&
      (row.start === DIFF_START.length + 1 ||
        proposal[row.start - DIFF_START.length - 2] === "\n") &&
      proposal.startsWith(`\n${DIFF_END}\n`, row.end) &&
      proposal.slice(proposal.lastIndexOf("\n", row.end - 1) + 1, row.end) ===
        row.fence,
  );
  if (!block) return null;
  const text = proposal.slice(block.start, block.end);
  return text.slice(text.indexOf("\n") + 1, text.lastIndexOf("\n") + 1);
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
      if (!containedRegularFile(doc.path, context.documentRoot))
        throw new Error(`missing plan-first document: ${doc.name}`);
      return [doc.name, readFileSync(doc.path, "utf8")];
    }),
  );
  const conversationDigest = planDigest(texts["conversation.md"]);
  // Each turn of the conversation is a level-3 heading naming its date and
  // its writer.
  if (
    !markdownHeadings(texts["conversation.md"]).some(
      (heading) =>
        heading.depth === 3 &&
        /^\d{4}-\d{2}-\d{2}.* — (?:Operator|Agent|Agent, paraphrasing the terminal)$/u.test(
          heading.title,
        ),
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
  // Git diff framing uses LF; CR and Unicode separators can be payload bytes.
  const outerMarkers = texts["proposal.md"]
    .split("\n")
    .filter((line) => line === DIFF_START).length;
  if (
    proposalDiff(texts["proposal.md"]) !== candidate.diff ||
    outerMarkers !== 1
  )
    throw new Error("candidate diff does not match proposal.md");
  return {
    baseCommit: candidate.baseCommit,
    diffDigest: candidate.diffDigest,
    proposedAt: markers[0].proposedAt,
    documents: context.documents.map((doc) => ({
      path: relative(context.documentRoot, doc.path),
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
