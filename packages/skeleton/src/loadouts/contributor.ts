import {
  compileLoadout,
  requireCompiled,
  outsideWriteEffect,
  type AuthorityGrant,
  type AuthorityEnvelope,
  type CompiledProgram,
  type HarnessFacet,
  type HarnessProfile,
  type HarnessProgram,
  type HarnessRole,
  type LoadoutGraph,
  type PresencePolicy,
  type PresenceNarrowing,
  PRESENCE_AXES,
} from "@dotln/compiler";
import { personalFeedbackUnits } from "./feedback.js";
import { harnessToolEffects } from "../harness-command.js";
import { qualityPassGuidance } from "../document-quality.js";
import {
  defaultExecutorSupportIds,
  executorSupportIds,
  executorSupports,
  type ExecutorSupportSwitches,
} from "./executor-supports.js";
import { processCost } from "./process-cost.js";
import { goalAlignment } from "./goal-alignment.js";
import { HARNESS_HOST_VERSION } from "../version.js";

const sharedSupports = [processCost, goalAlignment];
export const contributorWorkerPins = {
  claude: { model: "claude-opus-5-5", effort: "xhigh" },
  codex: { model: "gpt-6.1-sol", effort: "max" },
} as const;
/** Independent verification runs at this effort on every host (product 07). */
export const contributorVerifierEffort = "xhigh";
/** Operator-authorized policy input; never inferred from a submitted support. */
export const contributorOutsideAuthority: readonly AuthorityGrant[] = [
  {
    grantId: "contributor.outside-temporary",
    version: 1,
    grantedBy: "operator",
    effects: [
      outsideWriteEffect({ kind: "system-temp", source: "WO-144-D001" }),
      outsideWriteEffect({ kind: "session-scratch", source: "WO-144-D001" }),
      outsideWriteEffect({ kind: "host-scratchpad", source: "WO-158-D010" }),
      outsideWriteEffect({ kind: "order-worktree", source: "WO-192-D001" }),
    ],
    repo: "project",
    reason:
      "WO-144-D001: temporary work and operator-selected DotLn session scratch; WO-158-D010: the session's host-printed scratchpad",
  },
  {
    grantId: "contributor.target-worktree",
    version: 1,
    grantedBy: "operator",
    effects: [
      outsideWriteEffect({ kind: "target-worktree", source: "WO-236-D001" }),
    ],
    repo: "project",
    reason:
      "WO-236-D001: operator authorization of 2026-10-28 for the executor to edit its active order's registered target worktree; planning capture sha256:a7f2260e8e0377a737e2141692f1f4cda28c71c052b0fd0dd1fc79c5cd16a5e1",
  },
];
const sharedIds = sharedSupports.map((support) => support.supportFacetId);
const contributorSupports = [...executorSupports, ...sharedSupports];
export const contributorSupportIds = contributorSupports.map(
  ({ supportFacetId }) => supportFacetId,
);
export const defaultContributorSupportIds = [
  ...defaultExecutorSupportIds,
  ...sharedIds,
];
export type ContributorSupportSwitches = ExecutorSupportSwitches &
  Readonly<{ "process-cost"?: boolean; "goal-alignment"?: boolean }>;

const handlers = personalFeedbackUnits.map((unit) => unit.trigger);
const operatorControls =
  "Operator controls precede workflow: `analysis:` pauses for diagnosis/direction; `operator override:` suspends DotLn gates for authorized recovery, regardless of harness/repo state. Preserve pending work; invent no dispatch or passing check. Exit with either prefix plus `off`. Codex: `node scripts/operator-control.mjs analysis|override|off|status` needs no build or Git. Host permissions apply. Read product 07 §Operator recovery controls for the broader recovery candidate.";
const sessionBoundaries =
  "Under Codex, lifecycle dispatch reserves the writer and completion releases it; inspect with `node scripts/harness.mjs writer --show`, never a hand-built hook payload. Await a gate or background task through `node scripts/harness.mjs evidence --wait [--timeout <seconds>]` in the background or the host's completion signal, then do bounded listed work or stay quiet; never poll or narrate the wait.";
const sharedCorrections = [
  "Launch all adversaries, reviewers, refuters and research workers as Claude `dotln-worker` (claude-opus-5-5, xhigh) without a model override, or Codex spawn_agent with fork_turns none, model gpt-6.1-sol and reasoning_effort max. Only when the operator's planning: or resume: dispatch line names fable or fable 5.1, use Claude `dotln-worker-fable` (claude-fable-5-1, xhigh); record the actual worker type in the response and direct refutation receipt via --worker-type (Codex: codex-spawn-agent). The default and Codex pin stay unchanged; product 07 §Model-specific notes records the pins and readback limits.",
  "Run probes outside gates, one process at a time, under `node scripts/harness.mjs bounded -- <command>`; the host guard also watches attributable session descendants.",
  "Resolve routine version, waiver-route, live-episode, regeneration and reinstall questions within existing authority. Every phase owns decisions, including no-op or deferred outcomes and blockers: record evidence, tradeoffs and reopening conditions in the ADR or decision record; do not ask the operator to arbitrate implementation or change criteria. Preserve scope and authority, and record the safe default for any expressly permitted operator-only packet without demanding a response.",
  "Before acting on an operator message, state its aim in one line and act on the evidence-backed reading; record any consequential assumption and its reopening condition.",
  "Claims of cause, blockers, unreachable services or completion name their supporting command and output; partial searches name their boundary.",
  "Request needed authority here through the host permission flow; give the operator a command to run in your place only when the order or role names that fallback.",
  "Operator commands must be copy-paste runnable with real paths and no placeholders; questions plainly state what they decide and why.",
  "For stale gate rows, run the gate at the current identity; never restore bytes to match a row or remove a reviewed fix to pass a check.",
  "Stop the background monitors you started before recording your result.",
  "After two consecutive provider safeguard refusals, stop retrying, record a decision naming the stop, phase and model, and resume in a fresh session.",
];
const defensiveReview =
  "Judge confinement and security-boundary findings against the recorded rule and recommend defensive repairs; do not work out circumvention paths. After one provider safeguard refusal, change approach instead of retrying the refused line of work.";
const releaseCloseRemedy =
  "Run the printed --publish helper command once, exactly as printed, with no redirect, prefix, cd or pipe; use --dry-run only when a prerequisite such as egress or a foreign tag is in doubt. The close is done when the tag and Release exist, git worktree list shows no worktree for the order, its directory is gone, git branch --list wo-NNN is empty and no starter-refresh blocker remains. Diagnose and finish a cleanup blocker in this session; retry by re-running the same command, which re-checks an existing Release and never publishes twice. A retry validates the original immutable tag even after main advances; a foreign tag remains a blocker. Retry a host denial of the exact command once through the host permission flow before handing the operator the printed command for !. The close removes any scratch repository still present and records its path, head commit and whether a remote held it; intake and declared submodules stay, and an operator word through --material preserves a scratch repository; never force teardown.";
// Preservation at a target close is for operator material, evidence and
// intake; build output is regenerable (operator direction, 2026-10-18, WO-221).
const disposableOutput =
  "At a target close, preservation is for operator material, evidence and intake. Regenerable output under a path the class or registration declares disposable is deleted by the close, never moved to scratch or offered back; the registration may select baseDisposablePolicy judge-only to retain all base-checkout output after the same judgment, with delete as the default; the target worktree output is still deleted; an undeclared ignored path is declared disposable in the registration or removed, and a stray `.env` or operator note is neither.";
// Every role in both harnesses carries this line (operator direction,
// 2026-09-14, WO-044): a guess presented as a finding is a defect.
const noGuessing =
  "Never guess: an unobserved value is `unknown`, `untested` or `blocked`; name the readable source tried before writing `unknown`, and correct an unfiled report in place instead of appending a correction.";
const common = [
  "Before file changes or Git commands, resolve physical cwd and Git root. Stay in the selected worktree with one writable coding agent.",
  "Run `npm run resume --silent -- status --json`; use its canonical selected order, phase, report paths, and legal actions. A stale Markdown projection is repaired only by the next legal transition.",
  "Status may name artifacts for other roles. Load a report only when this role's Read directives or the active order's citations select it; a path in status is metadata, not a read directive.",
  "Skills supply procedure, never authority or phase state. Preserve the operator's intent; work-order model and effort are recommendations, and attestations record actual supplied values. Never invent effective-session readback.",
  noGuessing,
  "Read: `@work-order`",
  "Read: `@citations`",
  "Before changes, read relevant source and existing tests within `@subject-files`; name unresolved paths as required inputs.",
  "Host permissions decide execution; inspect the exact command, package mapping and lifecycle-script diff before any state-changing resume command. Before this procedure loads, Claude Code's session hook records the operator phrase's dispatch (`next`, `fix`, `verify`, `final-review`) and delivers its briefing. It passes an already-recorded phrase with the same briefing and receipt projected read-only by `npm run resume -- briefing`; resumed Codex runs that command itself. It reports an illegal dispatch without rejecting the prompt. Prompt submission stays open: setup, runtime and state failures are advisory, never grounds to deny access to Claude or Codex. Dispatch admission matches the ordinary command: a live evidence gate or another session's writer reservation refuses it before any lifecycle change. The terminal prints one receipt line naming the recorded dispatch and equipped supports. Never rerun a harness-recorded dispatch or repeat a recorded transition to repair a checkpoint warning.",
  "No branch commits before final review. Never reset, restore, clean, drop a stash, or discard intake. Preserve work through the canonical checkpoint and named recovery procedure if rollback is needed.",
  "Read: `@subject-files`",
  "Read: `package.json`",
  "Run `npm run work-orders -- index` after dispatch. Executor completion refreshes the index automatically; other roles refresh it after recording a result. The canonical evidence command refreshes owned projections before checking.",
  "Write durable product decisions to the cited product docs and `docs/evidence/WO-NNN/decisions.md`, naming the operator dispatch, evidence, alternatives and reopening condition. Run `npm run meta` to refresh the decisions index. The ledger is for operator ideation and planning synthesis only. For an order filed before 2026-09-09, a ledger-entry duty is discharged by its decisions file and index row; the work-order index marks this substitution. Record a correction the same day: what was misread, what was meant and what changed. Decided means sourced, not frozen; an order's non-goal fences that order alone.",
];
const actor =
  "Completion flags: `--harness <harness> --harness-version <version> --model <model> --effort <level> --source <source>`. Supply each field; unknown is admitted. Versions, models and effort are logged, never refused, except for the Claude Code rule below. `ultra` and `ultra code` record xhigh, mode subagents and raw spelling. Never invent effective-session readback. Use available Codex briefing readback of current-session model, effort and CLI version from the active thread. Claude Code exports the root's selected effort as `CLAUDE_EFFORT`: when readable, the root must read and record it with `--effort <that value> --source claude-session-readback` in a claude-code attestation; that source is refused elsewhere. This is selected, not effective, effort; subagent shells carry the root's value, so the root records lifecycle completions. Copilot readback reports CLI-selected values, not effective effort; retain supplied operator attestations and never derive the harness from the model.";
const evidence = [
  "Run checks establishing the work order's claims. Completion runs git diff --check inline, validates report/attestation presence, and reads one judgment per declared criterion. Unmet criteria are recorded and shown at the next dispatch. A met npm test claim at executor/verifier handoff consumes the passing structural and declared Preflight rows at the current code identity, or a complete row covering them; a document change also needs a document row for the exact candidate tree. Final-review-result pass for a launchpad order's met npm test claim consumes the newest passing complete review row at the integrated code identity, whichever role recorded it; a complete run is owed only if that identity has none. A met npm run test:docs claim consumes the newest passing document row for the exact candidate tree, including current authored records. Completion runs no gate. Target orders keep their target gate.",
  "Output reads, usage and planning handoffs advise. Read and review current authored outputs; use generation/check evidence for generated or oversized outputs. Record evidence with source and cutoff. Reports, indexes and release text may be completed after a passing gate without invalidating code identity. One registered writer owns a worktree on any branch. During its product gate, a role may write the active order's own evidence, verification and final-review directories at the default document roots; product tasks reject observed reads there. Every other gate input and the success record stay protected; document and mixed review gates admit no record writes. Stop your own gate with `node scripts/harness.mjs evidence --stop` when necessary. Other permission judgments delegate to the host. Codex lifecycle dispatches automatically begin the harness session before usage is read. Codex and Copilot may use explicit observe/delivered and `node scripts/harness.mjs read-output <path> --offset 0 --length 8192`, without claiming automatic read receipts. Copilot: inspect canonical status; run `npm run resume -- briefing` after an already-recorded dispatch, otherwise run the legal dispatch once; prompt-context delivery is unobserved. Completion releases its writer; explicit `scripts/operator-control.mjs` recovery remains available. Record available usage, otherwise unknown; it never blocks handoff.",
];
const productGate =
  "After integration, the last source edit and `npm run format`, reuse the passing complete review row at the integrated code identity when one exists (the identity, not the dispatch time, says what was tested); only when none exists start `npm test -- --review` in the background, never under the bounded probe wrapper, and await it with `node scripts/harness.mjs evidence --wait`; read the subject meanwhile, write no gate input and start no agent. A confined or partial run never supplies the complete review row; use the printed outside command under host permissions and existing authority.";
const costLine =
  "Put exactly one physical `**Process cost:**` line in the report: `entry <total> tokens; handoff <total> tokens; source <source>`, or `unknown; cause <code>` with exactly one of `hooks-fallback`, `no-session`, `harness-no-readback`. The briefing prints the session id and the exact usage command. The result transition and `npm run test:docs` refuse a bare unknown in a receipt allocated under this rule.";
const boardedDefect =
  "A defect met and not fixed must be recorded in docs/evidence/WO-NNN/decisions.md with a named follow-up in its structured decision JSON `followup` string (or a `reopens` object for an existing decision), and cited by the report; fix it within the boy-scout bound or board it up there, never leave it only as a report sentence.";
export const contributorRoles: readonly HarnessRole[] = [
  {
    facetId: "contributor.router",
    name: "router",
    description:
      "Drive one DotLn order through fresh phase sessions on drive: WO-NNN, stopping for the operator merge or a recorded limit.",
    intents: ["drive:"],
    feedbackHandlers: handlers,
    procedure: [
      "Resolve the physical cwd and Git root in main. The entire operator phrase must be drive: WO-NNN. It carries the authority of the lifecycle phrases it dispatches, including final review publication and, on re-entry after the operator merge, release close; never merge.",
      operatorControls,
      noGuessing,
      "Read only canonical status through `node scripts/drive.mjs status WO-NNN`. The helper selects the order's registered worktree, so the status is that worktree's fold. Read no order, diff, report or worker transcript and edit no project file. A router holds no writer reservation.",
      "Run `node scripts/drive.mjs WO-NNN` once. Its status route chooses at most one action, launches the generated phase worker with only the lifecycle phrase, waits, rereads status and repeats. Report each transition in one line; never relay worker output or judgments into the next worker. Every phase is a fresh actor with no inherited conversation.",
      "For that single literal driver command, request the host's normal one-invocation outside-sandbox approval: in Claude use Bash dangerouslyDisableSandbox: true; in Codex use its normal tool approval request. This lets native phases initialize their own sandboxes and request their own command permissions. Add no cd, redirect or compound wrapper. Do not edit sandbox settings or persist an allow rule. If the host denies the request, stop; do not retry or choose another launcher. Each native phase keeps its sandbox and approval policy; this request grants no authority to override a host restriction.",
      "The driver uses separate native CLI sessions in the order's worktree (the target worktree for a registered target), with preloaded role skills. Keep the selected host; --host claude|codex is an explicit selection, otherwise the native session selects it. Claude pins Opus 5.5 at xhigh with project and local hooks; Codex pins gpt-6.1-sol at max, and xhigh for an independent verifier, with its sandbox and role-text duties. Never substitute a host or claim Codex hook parity.",
      "The router spawn boundary refuses any Agent prompt except an exact lifecycle phrase given to the agent type that phrase names, with DOTLN_ROUTER_SPAWN_REFUSED, and DOTLN_ROUTER_WRITE_REFUSED refuses any router edit and any shell command beyond the live gate's read list, its driver and its usage command. An order identifier belongs to the recorded working directory, never to the worker prompt. The check is only on the router's own spawns; a phase worker's spawns use its ordinary policy.",
      "Stop for awaiting-merge, operator-finding, off-ramp, typed-correction, analysis, operator-override, dispatch-refused, three verification failures, two final-review failures, two incomplete endings in the same phase, or budget-exhausted. Report the route's next step. A dead writer requires the operator's `operator override:` phrase; never release a foreign reservation yourself.",
      "Re-entry reads current status and gives an interrupted phase's same briefing to a fresh worker. Release close runs in main only after the launchpad and, for a target, its registered target base both contain the order branch. Status reads local refs; a drive of a closed order fetches both bases first, because a hosted merge reaches neither clone by itself. Finish only on a validated local release attribution or recorded no-release close.",
      "Plan phase workers against subagentCap (default 20, null disables) and all attributable descendants against drivenSessionCeiling (default four times the cap). Each phase attempt is limited by its role's dispatch wall clock and the optional drivenPhaseTimeoutMs, whichever is shorter. Task and qualification deadlines still apply. The helper reports minimum observed counts and unknown remainder, worker usage and router usage separately. First driven orders are attended; unset token or dollar limits are not enforced limits. Budget exhaustion stops before another launch.",
    ],
  },
  {
    facetId: "contributor.executor",
    name: "executor",
    description:
      "Execute the selected DotLn work order for resume: next or repair it for resume: fix; report read-only resume: status and resume: times.",
    intents: ["resume: next", "resume: fix", "resume: status", "resume: times"],
    feedbackHandlers: handlers,
    procedure: [
      ...common,
      "For status or times, run the matching read-only command and report its observation; stop without a transition. For next, follow the emitted path in the delivered briefing (Codex runs `npm run resume -- next` itself). If closed, report other in-flight orders; only when none remain, give the exact printed worktree-start handoff.",
      "For fix, the dispatch is recorded and its briefing delivered with the phrase (Codex runs `npm run resume -- fix` first); read the original order and its named failure source. Repair only those obligations. A premature repair may reopen only while the unresolved failure source remains.",
      "Read: `@failure-report`",
      "For a target order, read on demand the profile declared for its `Repository:` id in the launchpad configuration as repo-native authority, with repository conventions prevailing over its class while preserving the authority floor.",
      ...evidence,
      boardedDefect,
      "A comment says what the code does or why, in words a reader who has not seen the order understands; an order, report, finding or decision identifier never leads or replaces that explanation, and a report-local label (a verification or final-review finding label, a bare decision number) never appears in code; fix the comments in the lines you change.",
      "Every execution and fix requires three fresh independent `dotln-worker` agents before the complete validation run. Launch or restart them only after implementation or repair and its write-backs are complete, never as early scouts. Give each the current order and diff, with nonoverlapping briefs. The criteria adversary seeks concrete counterexamples, failed acceptance criteria and missing regression tests; exclude design cleanup. The design improver seeks simpler structure, coupling, error handling and six-month maintainability; exclude criterion verdicts and adversarial test design.",
      "The consistency reviewer solely verifies write-backs, dependencies and versions: product and operational docs, decisions, indexes, cross-references, package and lockfile versions, release metadata, generated artifacts and installed guidance, test dependencies, fixture inputs/manifests/pins, generated test baselines and evidence-source declarations. Give that reviewer the corresponding source and generated surfaces. Trace each changed document, emitted output and helper to every consuming test by path, symbol, old/new text and byte/count pins; follow transitive imports and fixture copy/export manifests. Check oracle selectors, command/field inventories, runtime setup, gate environment and timing assumptions. Use relevant retained gate failures to search for the same failure shapes. Preserve intentional contract pins; update expectations from requirements, replacing incidental prose coupling with semantic assertions. Report concrete producer/consumer pairs, their disposition and unsearched boundaries.",
      "Transfer findings to the responsible reviewer instead of duplicating work. Fix or record every finding and return material changes to the relevant reviewer before the complete run. After any new set of code changes, restart all three existing reviewers on the current diff and finish their rechecks before the next complete run. This includes repairs after a failed gate; reuse the same workers within the execution or repair. All three reviewers must finish before that run starts and must not be restarted after it passes. The executor or an earlier run's reviewers cannot substitute. Add handoff.md line `self-review: found N; fixed N; recorded N` with all three reviewers' counts and reports.",
      actor,
      "Completion refreshes the final index and releases the Codex session's writer reservation after recording the result; Claude releases at Stop. A repair is unfinished until repair-complete records. Report evidence, attestation and limits; leave verification and final review to their separate dispatches. Never leave the writer reserved at handoff or ask the operator to release it.",
    ],
  },
  {
    facetId: "contributor.verifier",
    name: "verifier",
    description:
      "Independently verify the selected DotLn work order on resume: verify and file the allocated immutable VER report.",
    intents: ["resume: verify"],
    feedbackHandlers: handlers,
    procedure: [
      ...common,
      "The `verify` dispatch delivers the exact new VER path (Codex runs `npm run resume -- verify`); write only it. Judge the original criteria and earlier findings with your own probes and the executor's three worker reports: attack the change and review the whole implementation, as product 07 §Verification review and attack directs. Spawn a worker only to reproduce one named claim you cannot run yourself; never delegate the verdict. A finding that breaks no criterion and no behavior `main` had is a follow-up, never blocking.",
      "Read: `docs/product/07-execution-guide.md#Verification review and attack`",
      "Route a blocking design defect in the declared surfaces with its repair rule, without asking the operator to authorize it; blocking still requires an unmet criterion or a reproduced regression. A choice outside the criteria and declared surfaces takes the operator route with its recorded safe default, not an authorization request for an in-scope repair.",
      defensiveReview,
      "Before emitting audit or repository output, select verdict-relevant fields and budget the aggregate read across the batch. Keep full results in scratch; check for nested gate logs and truncated batches before emission. When acknowledging a process failure, name its durable record and disposition in the same response.",
      "Read: `@verification-reports`",
      "Independent verifiers use `xhigh`, not `max`. A verifier launch may cap provider spend at USD 5 when its transport exposes a hard dollar-cap control; otherwise report the limit as unenforced rather than claiming a cap.",
      ...evidence,
      "Consume the executor's structural and Preflight rows at the subject's code identity, and its document row for the exact candidate tree. Reproduce findings with `npm test -- --only <suite>`; rerun an affected Preflight suite when its identity differs, stating which. This limits repeated gates, never independent probes.",
      costLine,
      boardedDefect,
      actor,
      "Put exactly one `**Actor attestation:** {<normalized actor JSON>}` line beside the human actor prose in the allocated report; its bytes must agree with the completion flags. Report criterion, observed/expected, reproduction, evidence, severity and limits. Judge each criterion on a `**Criterion <id>:** met` or `unmet` line; a waived one reads `unmet, waived by <ordinal>`, and a pass over an unwaived unmet line is refused. Disclose any instrument under verification that also recorded this work.",
      "Record `npm run resume -- verification-result pass|fail <actor-flags>` only after the report and evidence exist; refresh the index and reread updated outputs in `@subject-files`. Never replace an older VER or edit implementation to turn your own verdict green.",
    ],
  },
  {
    facetId: "contributor.reviewer",
    name: "reviewer",
    description:
      "Perform DotLn final review for resume: final review; prepare and publish only the reviewed work-order branch on pass.",
    intents: ["resume: final review"],
    feedbackHandlers: handlers,
    procedure: [
      ...common,
      "The `final-review` dispatch is recorded with the phrase and delivers the allocated FINAL path (Codex runs `npm run resume -- final-review` itself); use that path. Review the full subject diff and complete numbered verification sequence against the original order. Handle authorized integration with `npm run worktree -- integrate WO-NNN` (name an intake backup when present); resolve authored conflicts and use `--continue`, complete its draft decision's carried-forward claims, then run the printed affected checks.",
      "Read: `@verification-reports`",
      "Read: `docs/product/08-publication-compiler.md#PRs and commits`",
      "Read: `docs/product/07-execution-guide.md#Verification review and attack`",
      defensiveReview,
      "A finding outside the criteria that breaks no behavior `main` had is a follow-up by rule, never blocking.",
      "Every option in an operator packet must be safe within ordinary authority, without operator override. Record the safe default; override is an operator recovery control, never a proposed way to pass review.",
      ...evidence,
      productGate,
      costLine,
      boardedDefect,
      'List every finding once, in one block: a `<!-- dotln-findings:start -->` line, a JSON array of `{"id": "F1", "route": "blocking|follow-up|operator", "class": "escape|integration|new-scope", "summary": "<one line>"}` entries (`[]` for none) and a `<!-- dotln-findings:end -->` line; product 07 §Verification review and attack defines classes. Only that block is counted, so write its marker lines nowhere else. A block that cannot be read, or a class outside the three, advises and never blocks recording.',
      "After integration, the last source edit, intended new source files are staged and `npm run format`, reuse the passing complete review row at the integrated code identity when one exists; only when none exists start `npm test -- --review` in the background, never under the bounded probe wrapper, and await it with `node scripts/harness.mjs evidence --wait`; read the subject meanwhile. The passing npm test row is keyed by tracked and non-ignored untracked non-generated code and the shared outward vocabulary; final-review-result carries it in the control event, worktree publish cites it in the PR, and release close consumes it without running a suite. Source changes require affected checks and a complete row at the new identity; report/control/generated-document changes do not.",
      actor,
      "Prepare the contained PR.md and five-section RELEASE-NOTES.md beside the report, using the current publication contract; use one physical line per prose paragraph. Write the PR title as a headline: one clause saying what changed for the reader and why it matters, the lede first, sized by its content and never by the previous title, with no implementation inventory, version list or repeated work-order prose. A relevant gitmoji shortcode belongs in the PR title; commit subjects stay plain and contain no AI attribution.",
      "Read `npm run reader -- profile <surface>` for each publication surface you write, preserving facts, limits, required sections and the attribution rule.",
      "Criterion lines take the verifier's form (`unmet, waived by <ordinal>`). Use exactly one `**Actor attestation:** {<normalized actor JSON>}` header matching the flags, then record `npm run resume -- final-review-result pass|fail <actor-flags>`, refresh the index and reread updated outputs in `@subject-files`. On failure, stop with findings. On pass, inspect each staged diff and commit coherent reviewed changes, then run `npm run worktree -- publish <id> --title <reviewed-title> --body-file <contained-committed-PR.md>`.",
      "The operator's final-review phrase authorizes only committing reviewed state, pushing its WO branch, and opening its PR. Never merge, push main, publish a release, change account settings, or publish packages. Return the helper's exact post-merge release-close handoff.",
    ],
  },
  {
    facetId: "contributor.release-close",
    name: "release-close",
    description:
      "Close a merged DotLn worktree and publish its validated source tag and matching Release, and refresh declared export siblings only on resume: release close.",
    intents: ["resume: release close"],
    feedbackHandlers: handlers,
    procedure: [
      "Only resume: release close authorizes this. In main, verify cwd/Git root; run `npm run resume --silent -- status --json`.",
      noGuessing,
      "Read: `@work-order`",
      "Read: `@citations`",
      "Read: `@final-review`",
      "Run the exact `npm run resume -- release-close` or worktree-publish handoff in main; after removal use main's helper. Use it for partial-publication retries too. It proves network egress to the GitHub host first. Use the host permission flow for required egress; the authorized session finishes the command. `--dry-run` is optional when a prerequisite is in doubt.",
      `The helper fast-forwards main, checks release surfaces, builds missing dist, consumes the committed reviewer npm test row by code identity, and publishes the annotated tag and Release. Where the launchpad declares an export sibling, it then refreshes its recorded checkout through a disposable worktree and pushes one fast-forward commit to that sibling’s main. It runs no suite, npm ci or CLI smoke. ${releaseCloseRemedy}`,
      "Publish only the validated tag/Release, the helper’s declared starter refresh with its sibling tag and Release, and a target release the registration declares; report no-release or remaining work. Never edit Releases, push core’s main or any other branch or repository, force-push, merge PRs, publish packages/binaries or change settings.",
      "A starter-refresh refusal is a blocker: report it, ask one focused question when its checkout is unrecorded or dirty, and never clean, reset or commit in the starter checkout.",
      disposableOutput,
    ],
  },
  {
    facetId: "contributor.planner",
    name: "planner",
    description:
      "Run the document-only DotLn planning or ideation pipeline; preserve capture, synthesis and independent-refutation duties.",
    intents: ["planning:", "planning: entropy reducer", "ideation:"],
    feedbackHandlers: handlers,
    procedure: [
      "Resolve cwd and Git root. A planning: prefix selects the document-only planning pass. An ideation: prefix selects capture, clean-room synthesis, ledger and product-doc write-back unless it explicitly says capture-only. Preserve any ongoing work-order obligation. The skill supplies no activation or external-effect authority.",
      "`planning: entropy reducer` makes this pass's subject an Entropy Reducer review instead of the register's existing rows. Start with `npm run entropy -- subject`: it names the review to consume, a pending dispatch to finish, or a fresh review to run. Consume before producing — a filed review that carries a refutation and no disposition is this pass's subject, and a new episode is paid for only when there is none. To produce one, run `npm run entropy -- review --transport claude-cli-print`, file its receipt, then `refute` and `refutation-receipt` for the blinded second worker. Either way, dispose every surviving finding and proposal packet in this same pass with `npm run entropy -- dispose`. Accepted findings are this pass's candidates: weigh, sequence or decline them here, in the map, sequence and orders, with their NoOp records. The generated `docs/planning/entropy-reviews/REVIEW-NNN.md` rows and the register are the durable record of what this pass decided, never a queue handed to a later pass. The external CLI launch is the operator request this phrase carries.",
      noGuessing,
      "Read: `docs/product/07-execution-guide.md#Operator-opened planning pass`",
      "Read: `docs/product/07-execution-guide.md#Operator-opened ideation mode`",
      "Read: `docs/planning/sequence.md`",
      "Open a planning branch with `npm run plan -- start <slug>` from clean main. Follow the selected section's source/capture instructions and source each decision with its reopening condition. Planning satisfies independent refutation; ideation follows its pipeline or explicit capture-only boundary. Run `npm run test:docs` (plan, index, publication and format only). Leave implementation, activation and releases to their authorized dispatches.",
      "Use `npm run reader -- score` with one fresh pinned reader outside the repository and record its result only when plan start reports a changed profile with three unscored releases or the operator asks; record surface corrections only through `score --correction <surface> --capture-hash sha256:<digest>`.",
      "After committing the planning subject locally, load dotln-refuter for one independent goal review per pass. Before editing judged text, resolve its refutation hold or record the operator-authorized amendment; judgment reuse never authorizes a repair. Reuse the judgment only while its observed evidence and judged subject remain valid; for a new judgment dispatch one fresh background refuter with no inherited conversation. Use the canonical direct prompt and receipt helper; keep the parent as the sole repository writer. Do not launch an external refutation CLI unless the operator explicitly requests that transport.",
      "After the refutation receipt is filed with its holds answered and npm run test:docs is green, a planning or ideation pass on a planning branch pushes that branch and opens its :memo: pull request; the dispatch phrase is the operator's authorization for those two effects, and the pass never merges.",
    ],
  },
  {
    facetId: "contributor.refuter",
    name: "refuter",
    description:
      "Run an independent background-worker judgment of the latest planning pass on planning: refute; planning: refute full judges the whole horizon.",
    intents: ["planning: refute", "planning: refute full"],
    feedbackHandlers: handlers,
    procedure: [
      "Resolve cwd and Git root. The parent coordinates one fresh background refuter without inherited conversation (Codex: spawn_agent with fork_turns none; Claude: a fresh background agent). Give it only the canonical prompt, its result schema and the shared goal card; no planner narrative, prior receipts or other subject preread. The parent remains the sole repository writer. A worker already given that prompt judges it directly; it does not spawn another refuter.",
      noGuessing,
      "Run `npm run plan -- refute` for planning: refute, or add `--scope full` for planning: refute full; --direct remains an alias. The helper verifies committed/workspace equality and prints the canonical prompt and closed JSON schema. Pass scope judges changed orders and sequence; other verdicts carry by hash. The worker returns its frozen JSON and a truthful single-line statement of at most 4000 characters to the parent, using scratch files if needed, with no repository or Git writes. While it runs, complete independent closeout work without changing the frozen subject.",
      "The parent saves the worker's result and statement in ignored local files and runs `npm run plan -- receipt <result.json> --statement <statement.txt> [--dispositions <file>]`. The helper validates, screens, files and commits the immutable pair and runs the plan check. Preserve aligned, aligned-with-findings or observed-evidence misaligned verdicts. Hypotheticals are known issues with reopening observations. Record criterion-bound dispositions using `npm run plan -- dispose <receipt-id> <hold-id> <reason>`; they discharge holds without another judgment. Apply only operator-authorized overrides. No third-hold or duration refusal applies. Repair formatting with the same worker without rerolling the judgment. Report scope, elapsed time and actual result. Use no ad hoc receipt script. External `refute --transport <name>` requires an explicit operator request; do not fall back to it after a worker failure. If background workers are unavailable, report that limitation and preserve the pending review.",
    ],
  },
].map((role) => ({
  ...role,
  // A router writes nothing, so it holds no grant to write anywhere.
  outsideWriteGrants:
    role.name === "router"
      ? []
      : [
          {
            kind: "order-worktree" as const,
            source: "WO-192-D001: the active order's registered worktree roots",
          },
          {
            kind: "system-temp" as const,
            source: "WO-144-D001: contributor temporary work",
          },
          {
            kind: "session-scratch" as const,
            source: "WO-144-D001: operator-selected DotLn session scratch",
          },
          {
            kind: "host-scratchpad" as const,
            source:
              "WO-158-D010: the scratchpad Claude Code prints for this session",
          },
          ...(role.facetId === "contributor.executor"
            ? [
                {
                  kind: "target-worktree" as const,
                  source:
                    "WO-236-D001: the active order's registered target worktree",
                },
              ]
            : []),
        ],
  procedure:
    role.name === "router"
      ? role.procedure
      : [
          operatorControls,
          sessionBoundaries,
          ...sharedCorrections,
          ...role.procedure,
        ],
}));

export const contributorEnvelope: AuthorityEnvelope = {
  authorityEnvelopeId: "contributor.bounded",
  allowedEffects: [
    "repo.read",
    "repo.write",
    "shell.run",
    "git.local",
    "lifecycle.run",
  ],
  deniedEffects: [
    "credentials.access",
    "transport.ssh",
    "settings.user",
    "sandbox.disable",
    "remote.unapproved",
    "package.publish",
  ],
  resourceLimits: { writers: 1 },
  requiredEvidence: ["resolved-worktree"],
  expiresAt: Number.MAX_SAFE_INTEGER,
  revocationEventTypes: [],
};
const permissions: HarnessFacet = {
  facetId: "contributor.permissions",
  kind: "permission-guard",
  matchers: [
    { effect: "transport.ssh", deny: "Bash(ssh *)" },
    { effect: "transport.ssh", deny: "Bash(scp *)" },
    { effect: "transport.ssh", deny: "Bash(sftp *)" },
    { effect: "package.publish", deny: "Bash(npm publish *)" },
  ],
};
/** The Contributor build's absence policy is one read-only pulse: while the
 * operator is away, ask whether the running work is still inside its contract
 * and on the vision's theses. It changes nothing; a drift holds the rest.
 * The surface and both ceilings are zero because the judge only reads. */
export const CONTRIBUTOR_MISSION_POLICY = "contributor.mission-check";
export const CONTRIBUTOR_MISSION_PHASE = "mission-check";
export const CONTRIBUTOR_MISSION_SURFACE = "contributor.mission";
export const contributorPresence: readonly PresencePolicy[] = [
  {
    policyId: CONTRIBUTOR_MISSION_POLICY,
    version: 1,
    axes: [...PRESENCE_AXES],
    curve: "progressive",
    returnRule: "cancel-on-return",
    // No policy activity for an hour expires the phase; a recorded return and
    // a fresh absence rearm it. Repeated absence cannot replenish it.
    decay: { idleMs: 3_600_000, expires: "phase" },
    phases: [
      {
        phaseId: CONTRIBUTOR_MISSION_PHASE,
        entry: { cadence: { kind: "Every", intervalMs: 900_000 } },
        attentionPriority: 1,
        scope: {
          surfaces: [CONTRIBUTOR_MISSION_SURFACE],
          changeSize: { files: 0, lines: 0 },
          budget: {},
        },
        envelope: {
          allowedEffects: ["repo.read"],
          resourceLimits: { writers: 0 },
        },
        requiredCapabilities: ["actor.cli-worker"],
        discretionary: true,
        inFlightOnReturn: "kill",
      },
    ],
  },
];

export const contributorLoadout: LoadoutGraph = {
  schemaVersion: 1,
  loadoutId: "contributor",
  identity: {
    identityId: "contributor",
    version: 1,
    name: "Contributor",
    dispositions: ["Original work, complete scope, observable evidence"],
    invariants: [
      "Employer separation and secret exclusion are the locked Clean Room floor",
    ],
    updateLaws: ["Propose reviewed immutable build versions"],
    lineage: ["docs/work-orders/WO-039-harness-lowering.md"],
  },
  role: {
    roleId: "contributor.dispatch",
    version: 1,
    name: "Contributor role dispatcher",
    obligations: [
      "Resolve the exact resume phrase through canonical lifecycle state",
    ],
    permissions: [],
    objectives: ["A task-scoped build, not accumulated startup prose"],
    policyDeltas: contributorRoles.map((role) => ({
      key: role.facetId,
      value: { intents: [...role.intents], procedure: [...role.procedure] },
    })),
  },
  containers: [
    {
      containerId: "contributor.worktree",
      version: 1,
      name: "Contributor worktree",
      kind: "workspace",
      socketBudget: 1,
      activeMechanicIds: ["clean-room"],
      supportFacetIds: ["contributor.permissions"],
    },
  ],
  activeMechanics: [
    {
      activeMechanicId: "clean-room",
      version: 1,
      name: "Clean Room",
      tags: ["plan", "mutate", "verify"],
      requiredCapabilities: [],
      semantics: [
        "Employer separation and secret exclusion cannot be weakened",
        "Ordinary raw intake is synthesized; explicitly ready public drafts retain recorded direct-filing provenance",
      ],
      authorityEnvelope: contributorEnvelope,
      workOrder: {
        workOrderId: "contributor.session",
        objective:
          "Complete the canonical selected work-order phase within its reviewed authority",
        acceptanceCriteria: [
          "Work-order evidence exists and the legal completion transition records",
        ],
        knownFacts: ["The lifecycle log is ground truth"],
        decisions: ["Four resume-phase roles plus a separate planner skill"],
        constraints: [
          "Locked Clean Room floor",
          "DotLn refusals and host permission settings define the boundary",
        ],
        nonGoals: ["User-scope installation", "Lifecycle legality changes"],
        allowedOperations: [...contributorEnvelope.allowedEffects],
        prohibitedOperations: [...contributorEnvelope.deniedEffects],
        requiredEvidence: [
          "required-checks",
          "required-obligations",
          "current-output-reads",
        ],
        outputContract: {
          type: "contributor-phase-result-v1",
          required: ["evidence", "attestation", "limits"],
        },
      },
      inspection: {
        originalTerm: "Clean Room",
        translation: "Original personal work",
        kanji: "",
        rpgTitle: "Contributor",
        grants: [],
        restrictions: [...contributorEnvelope.deniedEffects],
        obligations: ["Complete the selected role's evidence gate"],
        passive: [],
        pulse: [],
        interrupt: [],
      },
    },
  ],
  supportFacets: [
    {
      supportFacetId: "contributor.permissions",
      version: 1,
      name: "Bounded contributor authority",
      supportedTags: ["mutate"],
      requiredCapabilities: [],
      semanticsAdded: ["Keep ADR-0003 through ADR-0005 posture"],
      semanticsModified: [],
      authorityChanges: [],
      evidenceRequirements: [],
      resourceMultiplier: 1,
      conflictsWith: [],
      preservesDeterminism: true,
      commutativity: "commutative",
      emissions: [
        {
          kind: "permission-guard",
          emissionId: "contributor.permissions",
          allowedOperations: [],
          prohibitedOperations: [...contributorEnvelope.deniedEffects],
          allowedEffects: [],
          deniedEffects: [...contributorEnvelope.deniedEffects],
        },
      ],
      claims: [],
      cost: {
        mechanismType: "permission-guard",
        promptTokens: 0,
        runtimeCost: { quantity: 1, unit: "pre-effect-check" },
        extraEpisodes: 0,
      },
      inspection: { restrictions: [...contributorEnvelope.deniedEffects] },
    },
  ],
  links: [
    {
      linkId: "contributor.permissions",
      linkGroupId: "contributor.boundaries",
      activeMechanicId: "clean-room",
      supportFacetId: "contributor.permissions",
    },
  ],
  linkGroups: [
    {
      linkGroupId: "contributor.boundaries",
      containerId: "contributor.worktree",
      linkIds: ["contributor.permissions"],
    },
  ],
  explicitPipelines: [],
  ambientEffects: [],
  resourceModel: {
    resourceModelId: "contributor.resources",
    version: 1,
    capacities: { writers: 1 },
    reservations: [],
  },
  polarAxes: [],
  presence: contributorPresence,
};
/** The current Contributor graph without WO-099's mission-check cadence.
 * The authority evidence tool restores historical vocabulary before comparing
 * the frozen WO-042 identity; filed receipts are never edited to match a later
 * build. Both graphs compile in that one evidence run. */
export const contributorLoadoutBeforeMissionCheck: LoadoutGraph = (() => {
  const graph: { presence?: readonly PresencePolicy[] } = {
    ...contributorLoadout,
  };
  delete graph.presence;
  return graph as LoadoutGraph;
})();
/** Keep the original saved build intact; equipment creates a new build. */
export function contributorWithSupports(
  supportIds: readonly string[] = defaultContributorSupportIds,
): LoadoutGraph {
  if (
    new Set(supportIds).size !== supportIds.length ||
    supportIds.some(
      (id) =>
        !contributorSupports.some((support) => support.supportFacetId === id),
    )
  )
    throw new Error("unknown or duplicate Contributor support");
  const equipped = contributorSupports.filter(({ supportFacetId }) =>
    supportIds.includes(supportFacetId),
  );
  if (!equipped.length) return contributorLoadout;
  const links = equipped.map(({ supportFacetId }) => ({
    linkId: supportFacetId,
    linkGroupId: "contributor.boundaries",
    activeMechanicId: "clean-room",
    supportFacetId,
  }));
  return {
    ...contributorLoadout,
    containers: contributorLoadout.containers.map((container) => ({
      ...container,
      socketBudget: container.socketBudget + equipped.length,
      supportFacetIds: [
        ...container.supportFacetIds,
        ...equipped.map(({ supportFacetId }) => supportFacetId),
      ],
    })),
    supportFacets: [...contributorLoadout.supportFacets, ...equipped],
    links: [...contributorLoadout.links, ...links],
    linkGroups: contributorLoadout.linkGroups.map((group) => ({
      ...group,
      linkIds: [...group.linkIds, ...links.map(({ linkId }) => linkId)],
    })),
  };
}

/** Consume the compiled equipment, rather than independently authoring skill text. */
// Mandatory session instructions belong to the separately hashed harness target.
// Keep the saved loadout-v1 policy deltas intact when adapting that target.
const sessionCommands =
  "`scope expand:` adds scope and receipt; `conversation only:` answers without pausing work. Keep effect limits; only explicit pause/stop interrupts. Neither appends an event.";
// WO-158: the designated routes replace the improvised handling its catalog
// found; every role in both harnesses names them.
const offRamps =
  "Off-ramps (WO-158): an operator-accepted unmet criterion is `npm run resume -- waive <criterion>` (never by the order's own executor) and a terminal failed, superseded or abandoned order is `withdraw`, both naming the operator's captured words; a wrong attestation, report path or checkpoint is `correct`, never a verdict or report bytes; override use is `override-record`, appended by Claude's hook at `operator override: off` and run from the printed command in Codex. Never edit a filed report, amend a criterion to pass or waive in prose.";
const targetRoles: readonly HarnessRole[] = contributorRoles.map((role) => {
  if (role.name === "router")
    return {
      ...role,
      procedure: [
        role.procedure[0]!,
        sessionCommands,
        ...role.procedure.slice(1),
      ],
    };
  const procedure =
    role.name === "release-close"
      ? [
          "Verify main's cwd/Git root; run `npm run resume --silent -- status --json`.",
          sessionBoundaries,
          ...sharedCorrections,
          noGuessing,
          "Read: `@work-order`",
          "Read: `@citations`",
          "Read: `@final-review`",
          "Use main's exact release-close/worktree-publish handoff; use its helper after removal or partial publication. It proves network egress to the GitHub host first. Use the host permission flow for required egress; the authorized session finishes the command. `--dry-run` is optional when a prerequisite is in doubt.",
          `Helper checks release prerequisites, reconciles intake and retains state/collisions in ignored retained/WO-NNN. Keep terms.txt and gate-evidence handoff. Where the launchpad declares an export sibling, the helper then refreshes its recorded checkout through a disposable worktree and pushes one fast-forward commit to that sibling’s main. \`--dry-run\` previews. ${releaseCloseRemedy}`,
          "Publish only that tag/Release, the helper’s declared starter refresh with its sibling tag and Release, and a target release the registration declares; report no-release/remaining work. No Release edits, pushes to core’s main or any other branch or repository, force-pushes, PR merges, package/binary publication or settings changes.",
          "A starter-refresh refusal is a blocker: report it, ask one focused question when its checkout is unrecorded or dirty, and never clean, reset or commit in the starter checkout.",
          disposableOutput,
        ]
      : role.procedure;
  return {
    ...role,
    ...(role.name === "release-close"
      ? {
          description:
            "Only resume: release close: close the merged worktree, publish its validated tag/Release and refresh declared export siblings.",
        }
      : {}),
    procedure: [
      procedure[0]!,
      sessionCommands,
      qualityPassGuidance,
      "Derive every artifact's shape from its contract and the check that judges it; a previous instance is evidence of what happened, never the pattern. If the contract is silent, say so and choose the structure that serves the reader's task. Preserve required content and judge usefulness by what the intended reader can understand, answer, decide, do, verify or recover from it. Retain context, evidence, examples and alternatives that serve those needs. Byte counts and structural passes do not establish usefulness or justify removing useful context.",
      "A standing document holds the current state for its reader; dated accounts belong in the order's decisions or the pass document. Integrate each change into the affected paragraph or section and link the decision record. Read the resulting passage as a whole; a one-line edit is sufficient when it remains coherent. Rewrite or split accumulated prose when needed, preserving useful information and established structure. Broader restructuring needs a concrete defect or changed reader need and must stay within authorized scope. No sentence count or size target governs this judgment.",
      "An expected-data update names its cause and provenance in the decisions. The consistency review traces each changed contract through its consumers with file-level source and generated evidence, including adjacent fixture, manifest, dependency, oracle and installed-guidance inputs; a green generator alone is not that review.",
      "Present every operator-facing duration in hours and minutes; keep raw numeric units in machine-readable records.",
      "Dispatch bounds live in docs/control/budgets.json. Resolve local-median from each consumer's own completed phase history as max(4 times its median, 8 hours), using 8 hours without history; never export this repository's measured durations as consumer defaults. Read standing with `node scripts/harness.mjs usage <session>`. Infer authorization to proceed from the operator's ordinary language and context; require no exact phrase or command. Capture the actual words and context, record the needed extension yourself with `npm run resume -- accept-overrun` and your actual actor attestation, keep the writer and continue here. When the operator authorizes a run for as long as needed, record --ceiling unlimited for both wallClockMs and completeRuns before work begins, or at any later point; it lasts until this phase completes. Never require a session exit or manual operator script; diagnose and repair recovery-command failures here. Without authorization, admit diagnosis and focused reproductions but start no further complete gate, bounded probe or worker past an exhausted bound.",
      offRamps,
      "When an explicit operator scope expansion changes a judged order's text, record its authorization in that order's structured decisions and run `npm run plan -- amend-order WO-NNN WO-NNN-DNNN \"operator authorization and bounded scope\"`. This binds the approved bytes in the existing planning log; it neither grants scope nor discharges a refutation hold. Run the planning check and repair encountered failures within authority instead of repeatedly carrying an inherited failure into review.",
      "Plan fan-out against the spawning worker's remaining `docs/control/budgets.json` `subagentCap` budget (default 20; null disables), and in a driven session against its root-wide `drivenSessionCeiling` (default four times the cap) before the first spawn and state that plan in the response. Count a spawn against the worker making it and include all descendants in the driven total. Separate phase sessions retain their own counters; `harness usage <session>` reports the available local and driven counts. Count descendants in the same plan. Batch review and refutation over groups of items: one agent judges several items, never one agent per item per pass. Check `harness usage <session>` for observed counts and unknown remainder; Codex has no spawn hook, so keep an explicit session count and apply this rule as role text. Reuse agents before spawning more; unknown coverage is not a fresh budget.",
      "Without a session readback, keep the operator-selected model and effort with `--source operator-attested`; Claude Code roles read `CLAUDE_EFFORT` first. Use `unknown` only for a value nobody supplied. Codex briefings automatically report the active thread model, effort and CLI version, independently of token-counter availability. Never replace a supplied value with unknown or invent effective readback.",
      "After an authorized product-document edit, run `npm run publication:check`; this grants no editing authority to a read-only role.",
      ...procedure.slice(1),
    ],
  };
});

// Keep the execution sequence visible before the complete shared rules.
const targetOrderProcedure =
  "For a target order, read its declared documentation root in the target worktree as repo-native authority beside its profile, and make the order's product-document write-backs there. Translate launchpad commands to the qualified commands in the briefing, one per line: in a target worktree the guard refuses compound lines and what it cannot judge, including harness bounded and node -e, and session scratch is the one outside write beyond the order's worktrees. Record what that leaves untested. Run release prepare as the briefing says: it assigns no launchpad version and changes no file. Replace the self-order npm test checks above with `node scripts/target-gate.mjs WO-NNN` (add `--review` when the final criterion names the review gate); the target's gate rows, never a launchpad npm test row, support its claims. Run the launchpad's npm run test:docs beside the target gate. These target clauses take precedence over self-order paths and checks; self orders keep the sequence above.";
const roleSteps: Readonly<Record<string, readonly string[]>> = {
  executor: [
    "Resolve cwd/Git root and canonical status; honor operator controls. For status/times, report the read-only command and stop; otherwise dispatch next/fix once.",
    "Read the order, citations, subject source/tests, package mapping and named failure; refresh the work-order index.",
    "Implement the bounded deliverable and write-backs.",
    "Prepare the classified release with `npm run release -- prepare --local`, bumping only changed components with their compatibility impact and retaining all publication controls.",
    "Remove scratch repositories, nested repositories outside intake that the tracked tree does not declare as submodules; never declare one. The close removes any left and records its head commit.",
    "Finish implementation or repair, decisions, indexes and other authored outputs before launching or restarting all three independent worker reviews; never use early scouting reviews. Resolve their findings and finish all three reviews before starting the complete run; do not restart them after it passes.",
    "Integrate main only at the lifecycle points named in product 07 §Independent workflows and integration, never during a live gate or on your own initiative inside a handoff. Before the complete run, integrate if main moved: run main's current `scripts/worktree.mjs integrate WO-NNN` against the registered worktree; active is admitted, a worktree not behind main takes in nothing. Resolve authored conflicts and use --continue. Then run `npm run format` and `npm run sync`; a gate compiles a stale runtime itself.",
    "Start one complete run, `npm test -- --review`, in the background, never under the bounded probe wrapper. Synthetic lifecycle fixtures are a product preflight; their failure blocks later product suites. Historical record comparisons stay in the separate document gate. Await it with `node scripts/harness.mjs evidence --wait`. The runner schedules failed and newly changed suites first; older branch changes may follow exclusive work. A complete run composes nothing from `--only` rows, so a focused run reproduces one failure and never precedes it. While it runs, write nothing under the repository and start no agent; on failure finish the named repair and its write-backs, format, then restart all three existing reviewers on the changed code, resolve their findings and wait for all three to finish before starting a fresh complete run.",
    "After the complete run passes, complete the active order's handoff.md (criterion judgments with their evidence, review counts, attestation, usage) and read current outputs. Post-pass handoff write-backs are executor-owned; the three reviews are already complete.",
    "Run `npm run test:docs` once after the last document edit, until green; its row binds the exact candidate tree, including current authored records.",
    "Record `npm run resume -- implementation-ready <actor-flags>` or, for a repair, `npm run resume -- repair-complete <actor-flags>`; completion consumes the complete and document rows and runs no gate; read resulting projections without another write.",
  ],
  verifier: [
    "Resolve cwd/Git root and canonical status; honor operator controls and dispatch verify once.",
    "Read the order, citations, subject and earlier reports; attack each criterion with your own probes, review the implementation and apply the worker rule below.",
    "Complete probes before the handoff sequence. As a read-only verifier, never edit the implementation to turn your verdict green.",
    "Run `npm run format:check` on the implementation and report a formatting failure; any report formatting must target only its allocated path.",
    "Consume the executor's passing complete row at the current subject identity, or the structural and Preflight rows there, and probe with `npm test -- --only <suite>` as needed. While a gate runs, write nothing under the repository and start no agent; record a subject failure in the verdict.",
    "Complete the allocated VER report and evidence, criterion judgments, attestation and usage; read current outputs.",
    "Run `npm run test:docs` once after the last document edit, until green within your authority; record a subject failure in the verdict. The completion consumes that row and the product rows and runs no gate itself.",
    "Record `npm run resume -- verification-result pass|fail <actor-flags>`; refresh the index and reread projections.",
  ],
  reviewer: [
    "Resolve cwd/Git root and canonical status; honor operator controls and dispatch final-review once.",
    "Read the order, full diff, numbered verification sequence and publication contract; integrate main with `npm run worktree -- integrate WO-NNN` and resolve authorized conflicts.",
    "Reject a known-bad candidate before the expensive validation: reproduce each blocking claim of the verification sequence with `npm test -- --only <suite>` or the bounded probe route. A reproduced blocker goes straight to a truthful failing review: complete the FINAL report naming it and record `npm run resume -- final-review-result fail <actor-flags>` without a complete run; the repair follows under its own dispatch.",
    "Otherwise finish affected checks and substantive fixes; remove any scratch repository still in the worktree; prepare release surfaces and run `npm run format`.",
    "After integration and the last source edit, reuse the passing complete review row at the integrated code identity when one exists; only when none exists start `npm test -- --review` in the background, never under the bounded probe wrapper. Await it with `node scripts/harness.mjs evidence --wait`; while it runs, write nothing under the repository and start no agent. If it fails, fix, format and start a fresh complete run.",
    "After the complete run passes, complete the allocated FINAL report, PR.md and RELEASE-NOTES.md, criterion judgments with their evidence, attestation and usage, and read final outputs; a review gate admits no record writes while it runs.",
    "Run `npm run test:docs` once after the last document edit, until green; completion consumes that row only while the candidate tree matches the one it judged.",
    "Record `npm run resume -- final-review-result pass <actor-flags>`; the completion consumes the complete row at the integrated code identity and the document row for the exact candidate tree, and runs no gate itself; on pass follow the reviewed branch publication rule below.",
  ],
};
const orderedRole = (role: HarnessRole): HarnessRole => {
  const steps = roleSteps[role.name];
  return steps
    ? {
        ...role,
        procedure: [
          ...steps.map((step, index) => `${index + 1}. ${step}`),
          "Rules:",
          targetOrderProcedure,
          ...(role.name === "reviewer"
            ? [
                "For a target order, commit the reviewed target change before recording final-review-result pass. Then run npm run resume -- target-records with the actor flags, commit the instance records, and run both the target-worktree publication and the records branch publication from the briefing. Never merge either pull request.",
              ]
            : []),
          ...role.procedure,
        ],
      }
    : role;
};

export function contributorRolesFor(
  program: CompiledProgram,
): readonly HarnessRole[] {
  const equipped = contributorSupports.filter(({ supportFacetId }) =>
    program.componentManifest.some(
      (entry) =>
        entry.componentKind === "support-facet" &&
        entry.componentId === supportFacetId,
    ),
  );
  const emissions = equipped.map((support) => {
    const manifest = program.componentManifest.find(
      (entry) => entry.componentId === support.supportFacetId,
    )!;
    const emitted = support.emissions.flatMap((emission) =>
      emission.kind === "prompt-fragment" ? [emission.text] : [],
    );
    if (
      manifest.version !== support.version ||
      emitted.some((fragment) => !program.promptFragments.includes(fragment))
    )
      throw new Error(
        `Contributor support projection drift: ${support.supportFacetId}`,
      );
    return { support, emitted };
  });
  if (!emissions.length) return targetRoles.map(orderedRole);
  const modifiers = equipped.flatMap((support) => support.semanticsModified);
  return targetRoles.map((role) => {
    const shared = emissions
      .filter(({ support }) => sharedIds.includes(support.supportFacetId))
      .flatMap(({ emitted }) => emitted);
    const fragments =
      role.name === "executor"
        ? emissions
            .filter(
              ({ support }) => !sharedIds.includes(support.supportFacetId),
            )
            .flatMap(({ emitted }) => emitted)
        : [];
    if (!shared.length && !fragments.length) return orderedRole(role);
    const procedure = role.procedure.flatMap((line) => {
      const projected = (role.name === "executor" ? modifiers : []).reduce(
        (text, { from, to }) => text.replace(from, to),
        line,
      );
      return line.startsWith("Run `npm run resume --silent -- status --json`")
        ? [projected, ...fragments]
        : [projected];
    });
    return orderedRole({
      ...role,
      procedure:
        role.name === "executor"
          ? [procedure[0]!, ...shared, ...procedure.slice(1)]
          : [...shared, ...procedure],
    });
  });
}

export interface ContributorBuildOverlay {
  readonly identity?: LoadoutGraph["identity"];
  readonly narrow?: PresenceNarrowing;
  readonly grants?: readonly AuthorityGrant[];
}

/** Narrow the saved base before compilation; only the compiler applies grants.
 * The ceiling is the kit's immutable envelope, never the submitted replacement. */
const overlayContributor = (
  graph: LoadoutGraph,
  overlay: ContributorBuildOverlay,
): LoadoutGraph => {
  const narrow = overlay.narrow ?? {};
  const grants = [...contributorOutsideAuthority, ...(overlay.grants ?? [])];
  const additions = grants.flatMap((grant) => grant.effects);
  const matches = (pattern: string, effect: string) =>
    pattern === effect ||
    (pattern.endsWith("*") && effect.startsWith(pattern.slice(0, -1)));
  // Compilation applies these grants after narrowing. Refuse a contradictory
  // overlay rather than silently restoring an effect the instance excluded.
  for (const grant of grants)
    for (const effect of grant.effects)
      if (
        (narrow.allowedEffects !== undefined &&
          !narrow.allowedEffects.some((pattern) => matches(pattern, effect))) ||
        narrow.deniedEffects?.some((pattern) => matches(pattern, effect))
      )
        throw new Error(
          `build overlay narrowing excludes ${effect}, restored by grant ${grant.grantId}; remove the conflicting narrowing or grant`,
        );
  const widening = (field: string): never => {
    throw new Error(`AUTHORITY WIDENING: build overlay narrow.${field}`);
  };
  for (const effect of narrow.allowedEffects ?? [])
    if (
      (!contributorEnvelope.allowedEffects.includes(effect) ||
        contributorEnvelope.deniedEffects.includes(effect)) &&
      !additions.includes(effect)
    )
      widening(`allowedEffects allows ${effect} without a grant`);
  for (const [resource, quantity] of Object.entries(
    narrow.resourceLimits ?? {},
  ))
    if (
      quantity >
      (Object.hasOwn(contributorEnvelope.resourceLimits, resource)
        ? contributorEnvelope.resourceLimits[resource]!
        : 0)
    )
      widening(`resourceLimits.${resource} exceeds the kit ceiling`);
  if (
    narrow.expiresAt !== undefined &&
    narrow.expiresAt > contributorEnvelope.expiresAt
  )
    widening("expiresAt extends the kit ceiling");
  const append = (base: readonly string[], extra: readonly string[] = []) => [
    ...new Set([...base, ...extra]),
  ];
  return {
    ...graph,
    identity: overlay.identity ?? graph.identity,
    authorityGrants: grants,
    supportFacets: graph.supportFacets.map((support) => ({
      ...support,
      inspection: {
        ...support.inspection,
        ...(support.inspection.restrictions === undefined
          ? {}
          : {
              restrictions: support.inspection.restrictions.filter(
                (effect) => !additions.includes(effect),
              ),
            }),
      },
    })),
    presence: (graph.presence ?? []).map((policy) => ({
      ...policy,
      phases: policy.phases.map((phase) => ({
        ...phase,
        envelope: {
          ...phase.envelope,
          ...(phase.envelope.allowedEffects === undefined
            ? {}
            : {
                allowedEffects: phase.envelope.allowedEffects.filter(
                  (effect) =>
                    additions.includes(effect) ||
                    ((
                      narrow.allowedEffects ??
                      contributorEnvelope.allowedEffects
                    ).includes(effect) &&
                      !(narrow.deniedEffects ?? []).some(
                        (pattern) =>
                          pattern === effect ||
                          (pattern.endsWith("*") &&
                            effect.startsWith(pattern.slice(0, -1))),
                      )),
                ),
              }),
        },
      })),
    })),
    activeMechanics: graph.activeMechanics.map((active) => {
      const base = active.authorityEnvelope;
      const allowedEffects =
        narrow.allowedEffects === undefined
          ? base.allowedEffects
          : narrow.allowedEffects.filter((effect) =>
              base.allowedEffects.includes(effect),
            );
      const deniedEffects = append(base.deniedEffects, narrow.deniedEffects);
      return {
        ...active,
        inspection: {
          ...active.inspection,
          restrictions: active.inspection.restrictions.filter(
            (effect) => !additions.includes(effect),
          ),
        },
        authorityEnvelope: {
          ...base,
          allowedEffects,
          deniedEffects,
          resourceLimits: { ...base.resourceLimits, ...narrow.resourceLimits },
          requiredEvidence: append(
            base.requiredEvidence,
            narrow.requiredEvidence,
          ),
          expiresAt: narrow.expiresAt ?? base.expiresAt,
          revocationEventTypes: append(
            base.revocationEventTypes,
            narrow.revocationEventTypes,
          ),
          ...(narrow.revocationConditions === undefined
            ? {}
            : {
                revocationConditions: [
                  ...(base.revocationConditions ?? []),
                  ...narrow.revocationConditions,
                ],
              }),
        },
        workOrder: {
          ...active.workOrder,
          allowedOperations: active.workOrder.allowedOperations.filter(
            (effect) => allowedEffects.includes(effect),
          ),
          prohibitedOperations: append(
            active.workOrder.prohibitedOperations,
            narrow.deniedEffects,
          ),
          requiredEvidence: append(
            active.workOrder.requiredEvidence,
            narrow.requiredEvidence,
          ),
        },
      };
    }),
  };
};

export const contributorProgram = (
  supportIds: readonly string[] = defaultContributorSupportIds,
  overlay?: ContributorBuildOverlay,
): HarnessProgram => {
  const graph = contributorWithSupports(supportIds);
  const composed = overlay
    ? overlayContributor(graph, overlay)
    : {
        ...graph,
        authorityGrants: contributorOutsideAuthority,
      };
  const loadout = requireCompiled(
    compileLoadout(composed, {
      environmentId: "contributor.project",
      version: 1,
      capabilities: [],
      repo: "project",
      baseCommit: "0".repeat(40),
      authorityGrantRegistry:
        composed.authorityGrants ?? contributorOutsideAuthority,
    }),
  );
  return {
    contractVersion: "harness-v1",
    loadout,
    workers: [
      ...["executor", "verifier", "reviewer", "release-close"].map((role) => ({
        name: `dotln-${role}`,
        ...contributorWorkerPins.claude,
        description: `Run the DotLn ${role} lifecycle phase from its exact resume phrase.`,
        skills: [`dotln-${role}`],
        body: "The entire input is the lifecycle phrase. In a target worktree, run printenv DOTLN_LAUNCHPAD to read the paired launchpad, then invoke node with that absolute launchpad scripts/resume.mjs path for status --json and the dispatch or briefing. Use git --no-pager for Git reads. The runtime checkout printed by a target hook is not the paired launchpad. Resolve the order from this worker's working directory and run its own dispatch, or the same briefing if already dispatched. Use the preloaded role skill; read its authorized inputs yourself. Keep your own writer and budget; record your own completion and actual host model/effort readback. Do not inherit another phase's conversation or forward judgments to a later phase.",
      })),
      { name: "dotln-worker", ...contributorWorkerPins.claude },
      {
        name: "dotln-worker-fable",
        model: "claude-fable-5-1",
        effort: "xhigh",
        optIn: true,
      },
    ],
    roles: contributorRolesFor(loadout),
    facets: [
      ...((): HarnessFacet[] => {
        if (!overlay || permissions.kind !== "permission-guard")
          return [permissions];
        const matchers = permissions.matchers.filter(({ effect }) =>
          loadout.authorityEnvelope.deniedEffects.includes(effect),
        );
        return [{ ...permissions, matchers }];
      })(),
      ...(overlay?.identity
        ? [
            {
              facetId: "instance.identity",
              kind: "prompt-fragment" as const,
              text: `Instance identity: ${overlay.identity.name} (${overlay.identity.identityId}, version ${overlay.identity.version}). ${[
                ["Dispositions", overlay.identity.dispositions],
                ["Invariants", overlay.identity.invariants],
                ["Update laws", overlay.identity.updateLaws],
                ["Lineage", overlay.identity.lineage],
              ]
                .map(
                  ([label, values]) =>
                    `${label}: ${(values as readonly string[]).join("; ")}`,
                )
                .join(". ")}`,
            },
          ]
        : []),
      ...contributorSupports.flatMap((support): HarnessFacet[] =>
        supportIds.includes(support.supportFacetId)
          ? support.emissions.flatMap((emission) =>
              emission.kind === "prompt-fragment"
                ? [
                    {
                      facetId: support.supportFacetId,
                      kind: "role-procedure" as const,
                      ...(sharedIds.includes(support.supportFacetId)
                        ? {
                            roleNames: contributorRoles.map(
                              (role) => role.name,
                            ),
                          }
                        : { roleName: "executor" }),
                      text: emission.text,
                    },
                  ]
                : [],
            )
          : [],
      ),
      {
        facetId: "clean-room",
        kind: "prompt-fragment",
        text: "Source provenance needs operator judgment; the hand-written Clean Room floor stays locked.",
      },
    ],
    correctionToken: null,
  };
};
export const contributorConfiguredProgram = (
  switches: ContributorSupportSwitches = {},
  overlay?: ContributorBuildOverlay,
): HarnessProgram => {
  const {
    "process-cost": cost = true,
    "goal-alignment": goal = true,
    ...executor
  } = switches;
  if (typeof cost !== "boolean" || typeof goal !== "boolean")
    throw new Error("shared support switches require ON/OFF booleans");
  return contributorProgram(
    [
      ...executorSupportIds(executor),
      ...(cost ? [processCost.supportFacetId] : []),
      ...(goal ? [goalAlignment.supportFacetId] : []),
    ],
    overlay,
  );
};

const record = "docs/discovery/harness-smoke-2026-09-07.md";
const copilotRecord = "docs/discovery/copilot-cli-2026-09-20.md";
export const contributorProfiles: readonly HarnessProfile[] = [
  {
    profileId: "claude-code-2.1.263",
    harness: "claude-code",
    observedVersion: "2.1.263",
    tools: harnessToolEffects,
    events: {
      PreToolUse: { available: true, evidence: `${record}#C1` },
      PostToolUse: { available: true, evidence: `${record}#C2` },
      Stop: { available: true, evidence: `${record}#C3` },
      UserPromptSubmit: { available: true, evidence: `${record}#C4` },
    },
    skills: {
      format: "agent-skills",
      available: true,
      evidence: `${record}#C5`,
      root: ".claude/skills",
    },
    settings: {
      available: true,
      evidence: `${record}#C6`,
      path: ".claude/settings.json",
      deny: true,
      allow: false,
    },
    instruction: {
      available: true,
      evidence: `${record}#C7`,
      path: "CLAUDE.md",
    },
    refusal: "claude-command-json-v1",
    runtime: {
      skeletonVersion: HARNESS_HOST_VERSION,
      boundaryContract: "feedback-v1",
    },
  },
  {
    profileId: "codex-cli-0.153.4",
    harness: "codex-cli",
    observedVersion: "0.153.4",
    codexContinuation: {
      available: true,
      observedVersion: "0.155.0",
      evidence: "docs/evidence/WO-054/codex-continuation.md#native-probe",
    },
    tools: harnessToolEffects,
    events: Object.fromEntries(
      ["PreToolUse", "PostToolUse", "Stop", "UserPromptSubmit"].map((event) => [
        event,
        {
          available: false,
          evidence: `${record}#X2`,
          reason: "No project hook fired in the bounded Codex probe",
        },
      ]),
    ) as HarnessProfile["events"],
    skills: {
      format: "agent-skills",
      available: true,
      evidence: `${record}#X1`,
      root: ".agents/skills",
    },
    settings: {
      available: false,
      evidence: `${record}#X2`,
      reason: "Settings permission lowering was not observed",
      path: ".claude/settings.json",
      deny: false,
      allow: false,
    },
    instruction: {
      available: true,
      evidence: `${record}#X3`,
      path: "AGENTS.md",
    },
    refusal: "unavailable",
    runtime: {
      skeletonVersion: HARNESS_HOST_VERSION,
      boundaryContract: "feedback-v1",
    },
  },
  {
    profileId: "copilot-cli-1.0.86",
    harness: "copilot-cli",
    observedVersion: "1.0.86",
    tools: harnessToolEffects,
    events: {
      PreToolUse: { available: true, evidence: `${copilotRecord}#H5` },
      PostToolUse: { available: true, evidence: `${copilotRecord}#H3` },
      Stop: {
        available: true,
        evidence: `${copilotRecord}#H1`,
        reason: "H7 observed the callback, not systemMessage visibility",
      },
      UserPromptSubmit: {
        available: true,
        evidence: `${copilotRecord}#H1`,
        reason: "H6 did not observe additionalContext delivery",
      },
    },
    skills: {
      format: "agent-skills",
      available: true,
      evidence: `${copilotRecord}#H10`,
      root: ".agents/skills",
    },
    settings: {
      available: true,
      evidence: `${copilotRecord}#H1`,
      path: ".claude/settings.json",
      deny: false,
      allow: false,
    },
    instruction: {
      available: true,
      evidence: `${copilotRecord}#H10`,
      path: "AGENTS.md",
    },
    refusal: "claude-command-json-v1",
    runtime: {
      skeletonVersion: HARNESS_HOST_VERSION,
      boundaryContract: "feedback-v1",
    },
  },
];

/** Bounded writing-worker observations; no Contributor lifecycle or skills. */
export const targetWorkerProfiles: readonly HarnessProfile[] =
  contributorProfiles
    .filter((profile) => profile.harness !== "copilot-cli")
    .map((profile) => {
      const { codexContinuation: _continuation, ...workerProfile } = profile;
      const evidence = "docs/discovery/writing-worker-smoke-2026-09-14.md";
      const unavailable = {
        available: false,
        evidence: `${evidence}#X-W4`,
        reason: "No Codex hook event was observed in the bounded exec probe",
      };
      const lifecycle =
        profile.harness === "claude-code"
          ? {
              available: false,
              evidence: `${evidence}#C-W4`,
              reason:
                "Observed in Claude print mode; deliberately omitted by the PreToolUse-only target profile",
            }
          : unavailable;
      const skills = {
        available: false,
        evidence: "docs/work-orders/WO-049-target-worktree-bundle.md",
        reason:
          "Skills deliberately omitted by target profile scope; no unavailability observation claimed",
      };
      return {
        ...workerProfile,
        kind: "target-worker-v1",
        profileId:
          profile.harness === "claude-code"
            ? "target-worker-claude"
            : "target-worker-codex",
        observedVersion:
          profile.harness === "claude-code" ? "2.1.270" : "0.154.0",
        events: {
          PreToolUse:
            profile.harness === "claude-code"
              ? { available: true, evidence: `${evidence}#C-W4` }
              : { ...unavailable, evidence: `${evidence}#X-W3` },
          PostToolUse: lifecycle,
          Stop: lifecycle,
          UserPromptSubmit:
            profile.harness === "claude-code"
              ? lifecycle
              : { ...unavailable, evidence: `${evidence}#X-W10` },
        },
        skills: {
          ...skills,
          root: profile.skills.root,
          format: profile.skills.format,
        },
        settings: {
          ...profile.settings,
          evidence: `${evidence}#${profile.harness === "claude-code" ? "C-W3" : "X-W3"}`,
        },
        instruction: {
          available: true,
          path: "CLAUDE.local.md",
          evidence: `${evidence}#${profile.harness === "claude-code" ? "C-W7" : "X-W7"}`,
        },
      };
    });
