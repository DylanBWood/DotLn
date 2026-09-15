# WO-044 decisions

## WO-044-D001

```json
{
  "id": "WO-044-D001",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand during execution (2026-09-14): fix the defects that surfaced during the WO-131 release close (A through J). The operator clarified that the analysis pasted after defect J is another model's output supplied as context, not instruction.",
  "decision": "Fold the release-close repairs into this worktree under the operator's scope expansion. Track each diagnosed repair as a follow-up queue item with its cause, paths, checks and priority; record material choices here; amend WO-044 with a dated operator amendment that admits the named runtime, script and generated-surface changes beside the unchanged probe deliverable. Treat the pasted analysis as hypotheses to verify against evidence, not as findings.",
  "evidence": [
    "The operator's typed scope expand: prefix in this session; the executor procedure defines it as adding scope and a receipt.",
    "Main's retained record docs/control/local/retained/WO-131/release-close-failure.json (ignored, read-only) names the failing suite release:case:cached_evidence and lists the five related defects.",
    "npm run adjacent -- list: revision 0, no items, before the repairs were queued.",
    "docs/work-orders/WO-131-remaining-suites-under-replica.md#Repair amendments — 2026-09-14: the precedent for recording operator direction received during execution as a dated amendment with execution authority."
  ],
  "rejected": [
    "Open a separate repair order and leave WO-044 document-only, as the pasted analysis proposed: the operator rejected further round trips, the follow-up queue exists for diagnosed adjacent repairs, and the same close would fail again meanwhile.",
    "NoOp: v0.17.6 stays unpublishable, every later close repeats the six-step recovery, and the reuse fixture keeps failing on main.",
    "Treat the pasted hypotheses as established causes: two of them (a regenerated file and a harness-only variable) were refuted by observation before any change was made."
  ],
  "reopenWhen": "The verifier finds the combined scope unverifiable in one order, a repair needs a path outside those named in the queue items, or the operator vetoes an item through the queue."
}
```

The mission contribution is direct: the release close is the last step of the
independently verified source-to-deliverable loop, and it consumed an operator
hour without publishing. NoOp leaves that loop unable to finish. Shifting the
burden to the intervenor and policy resistance are the live traps: every guard
refused correctly, but each refusal named a wrong or partial remedy and
surfaced one stage at a time. Rule beating is checked by keeping every guard;
no path deletes ignored material automatically. Escalation is bounded by
using the existing queue and receipt surfaces instead of a new ritual. Commons
cost counts the operator's six round trips and this session's reads. Drift to
low performance, success to the successful and seeking the wrong goal favor
repairing what the helpers report and see over documenting the manual steps.
Naive Interventionism: each repair is reversible, fixture-backed and confined
to the helper it corrects.

## WO-044-D002

```json
{
  "id": "WO-044-D002",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand (defect E: the release-close reuse fixture failed twice on main under Claude Code and the full gate reused nothing).",
  "decision": "Key regular files in the suite input snapshot by content and Git's executable bit only (0644 or 0755), and directories by name alone. Add a regression to the release-close reuse fixture that gives main's copy of a tracked file mode 0600 before the close. Record the refuted hypotheses beside the observed cause.",
  "evidence": [
    "scripts/lib/suite-evidence.mjs file(): a regular file contributed [stat.mode & 0o777, hash]; a directory contributed its full mode.",
    "Main's checkout: scripts/lib/harness-context.mjs has mode 0600 while Git tracks 100644 and the bytes equal the tracked blob; git status is clean because Git preserves only the executable bit. A fresh worktree checkout has 0644.",
    "The release fixture copies scripts/lib from the running checkout with cp -R, so the fixture's main inherited 0600 while its reviewed worktree had 0644; the reviewed successes were keyed at 0644 and every suite declaring scripts/ went fresh at close.",
    "bash scripts/test-release.sh --case cached_evidence passed in this sandboxed Claude Code session (17 fresh / 62 reused) with CLAUDE_PID present, so the harness-only-variable hypothesis does not hold; the fixture sets CLAUDE_PID in both phases on every harness.",
    "harness emit writes only .claude/hooks, .claude/skills, .agents/skills, CLAUDE.md and the manifest; it never writes scripts/lib, so the regenerated-file hypothesis does not hold.",
    "npm run build in this worktree reproduced all 268 files under packages/*/dist byte for byte, so the rebuild that bootstrap performs does not fork installed inputs on this machine.",
    "With chmod 600 on main's helper copy inside the fixture, release:case:cached_evidence failed exactly as the retained record describes (76 fresh, every invalidated suite citing scripts/lib/harness-context.mjs) and passed after the key change (17 fresh / 62 reused)."
  ],
  "rejected": [
    "Change only the main checkout's file mode: repairs one machine and leaves the key sensitive to bits Git never records.",
    "Drop modes from the key entirely: the executable bit changes what a suite can run and Git tracks it.",
    "Exclude harness-only variables from the key: the declared-environment projection already excludes undeclared variables, and the fixture's variables vary identically under both harnesses."
  ],
  "reopenWhen": "A suite's behavior is shown to depend on a non-executable permission bit, or cross-checkout reuse fails again with identical bytes and executable bits."
}
```

This restores criterion 10 of WO-131 on the operator's actual main checkout
and removes a cold gate from every close whose main carries umask residue.
NoOp keeps the close gate cold and the fixture red. Rule beating is checked
because the executable bit and every byte still invalidate. Policy resistance
between Git's model and the key's model is the defect itself. The remaining
lenses are immaterial for a keying correction with a regression fixture.

## WO-044-D003

```json
{
  "id": "WO-044-D003",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand (defects B and C: the removal guard refused on an opaque nested repository, reported one entry with an inapplicable remedy, and treated an empty fixture repository as evidence).",
  "decision": "Classify every ignored entry by lane (intake, control, settings, other) and kind. A nested repository, which git ls-files reports as one trailing-slash entry, is inspected: only .git and no commit is disposable scaffolding outside the intake lane; content under docs/control/local or docs/intake is preserved as a directory unit with the same byte proofs and symlink refusals as any other preserved material, and its now-empty parents are not archived; content elsewhere refuses with its own remedy. A refusal lists every blocker with its classification and lane remedy, never a content hash. The feedback verifier removes its empty mount repository after each run.",
  "evidence": [
    "A scratch repository confirmed that git ls-files --others --ignored --exclude-standard lists a nested repository as one entry with a trailing slash, at the root and under a scoped pathspec, and that git status shows nothing for it.",
    "scripts/lib/intake-reconciliation.mjs entries() preserved only files present in that list, so the nested repository was never planned and ensureNoIgnoredMaterial in scripts/worktree.mjs refused on it while naming ignored[0] and npm run backup:intake.",
    "packages/skeleton/src/feedback-selfhost.ts creates the verifier mount with git init under the feedback lane and never removed it; main's retained record names that mount as the sole blocker of the WO-131 close.",
    "bash scripts/test-worktree.sh: the two-entry refusal names .env and a nested repository under vendor/node_modules with lane remedies, omits the empty mount, and the later finish archives a control-lane nested repository with its .git contents while leaving no feedback directory behind.",
    "node --test scripts/test-process-debt.mjs: the WO-044 closeout classification test covers dispositions, rendering, byte-verified preservation and every lane remedy."
  ],
  "rejected": [
    "Make the whole feedback lane disposable: its sibling records (events, command results) are real evidence that the close must preserve.",
    "Refuse every nested repository with a clearer message: a repository with content under the control lane is evidence and the helper can preserve it without operator work.",
    "Copy an empty repository into the retained lane: eighty kilobytes of plumbing with no commit is not evidence and would recur on every close."
  ],
  "reopenWhen": "A nested repository under the control lane must keep semantics a byte copy loses (hooks, locks, a running process), or a lane appears whose remedy is not one of the four."
}
```

This removes three of the six operator round trips the WO-131 close cost and
keeps every guard: no path deletes ignored bytes, intake protection still
outranks scaffolding detection, and a nested repository with content outside
the preserved lanes still refuses. NoOp repeats the round trips on every
close. Rule beating is checked because the archived unit is byte-verified and
the empty test is exact (only `.git`, no commit). Shifting the burden to the
intervenor is the defect being removed. The remaining lenses add nothing for
a reporting and classification repair with shell and unit fixtures.

## WO-044-D004

```json
{
  "id": "WO-044-D004",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand (defect D: release close needs network egress and discovers it after every local prerequisite; nothing states the requirement).",
  "decision": "Prove origin reachability first: release close runs git ls-remote against origin before any local prerequisite in both the --dry-run and publish paths, names the GitHub host and the exact failure, and tells the operator to run the publish from a terminal with egress. The resume and worktree-publish handoffs, the release-close role text in both harnesses and the guide state the requirement. Every existing guard keeps its place after the precheck.",
  "evidence": [
    "scripts/release.mjs close: the first network call was git fetch inside worktree finish, after the clean-tree, ignored-material and closed-state gates; --dry-run never touched the remote.",
    "Main's retained WO-131 record: the publish failed on CONNECT tunnel 403 to github.com after four unrelated blockers were cleared by hand.",
    "bash scripts/test-release.sh --case unreachable: the dry run prints the reachable host, an unreachable origin fails the dry run and the publish with the egress message, and a dirty tree is not reported before egress.",
    "bash scripts/test-resume.sh and bash scripts/test-worktree.sh: both printed handoffs carry the egress sentence; the process-debt admission fixture still extracts the handoff command."
  ],
  "rejected": [
    "Only document the requirement: the operator would still clear local blockers before learning the run cannot complete.",
    "Check gh authentication in the dry run too: gh auth status may answer from cache, and the git probe already proves the network path the tag push needs.",
    "Detect a sandbox and refuse: a sandbox is inferred, reachability is observed; the observed probe covers every cause."
  ],
  "reopenWhen": "A hosting target other than GitHub is admitted, or the tag push proves to need a path the ls-remote probe does not exercise."
}
```

Shifting the burden to the intervenor is the defect: the operator learned the
run could not complete only after doing the machine's work. NoOp keeps that
ordering. Rule beating is excluded because the probe is a real network call to
the same remote the publish uses. Escalation is bounded: one read-only call,
no new step. The remaining lenses are immaterial for an ordering and
reporting change with fixtures.

## WO-044-D005

```json
{
  "id": "WO-044-D005",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand (defect F: four measurement worktrees and a temporary host subject derived from WO-131 stayed registered and on disk after its release close).",
  "decision": "When a merged order's worktree is removed, settle the order's derived worktrees in the same run: prune a registration whose directory is gone; for a detached derivative that names the order and is clean and idle, preserve its non-disposable control and intake material into the same retained lane with the subject's byte proofs and then remove it; report every other derivative with its blocker and the exact removal command. The dry run previews the same dispositions.",
  "evidence": [
    "git worktree list in this checkout registered four DotLn-wo131-measure-NNN siblings and one temporary wo131-host subject, all detached, after WO-131's close; no repository script creates or removes them.",
    "scripts/worktree.mjs finish removed only the branch worktree it was given.",
    "bash scripts/test-worktree.sh: a clean derivative is removed, a derivative with only control-lane material is preserved into retained/WO-099 and removed, a derivative with uncommitted changes is kept and reported with the removal command, and a missing directory is pruned; the dry run previews each."
  ],
  "rejected": [
    "Remove every derived worktree unconditionally: an in-flight measurement or unsaved notes would be destroyed, and ignored evidence would be deleted without preservation.",
    "Only list derived worktrees: the operator asked why nothing cleans up, and the safe cases need no judgment.",
    "A separate cleanup command: it adds an operator step to the stage that already owns teardown."
  ],
  "reopenWhen": "A derived worktree naming convention appears that the order-suffix match cannot see, or preservation of a derivative's material must differ from the subject's."
}
```

The removal reuses the subject's preservation and refusal machinery, so
rule beating and destructive drift are excluded by the same byte proofs and
lane classification. NoOp leaves the operator's projects directory growing
by several checkouts per order. Shifting the burden to the intervenor is the
defect. The remaining lenses add nothing for a bounded teardown extension.

## WO-044-D006

```json
{
  "id": "WO-044-D006",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand (defect A: the generated adapter-unavailable denial names no escape hatch, and exact-string matching defeats any compound command).",
  "decision": "The generated PreToolUse fallback states in its denial reason, in the same words as the advisory an admitted call receives, that Read, Glob and Grep and five exact checkout commands remain admitted while the built adapter is unavailable. A compound command joined by && or ; is admitted only when every segment is one of those commands; a pipe, a redirect or any other segment still refuses. The hook files regenerate through node scripts/harness.mjs emit from an operator terminal, because this Claude Code sandbox denies writes under .claude/hooks and .claude/skills.",
  "evidence": [
    "packages/compiler/src/harness.ts emitted the deny reason DOTLN_HARNESS_REFUSED: built adapter unavailable with no hatch, and matched the shell command as one exact string.",
    "Main's retained WO-131 record: the recovering session handed node scripts/bootstrap.mjs back to the operator although it was admissible throughout.",
    "A write probe in this session: EPERM under .claude/hooks and .claude/skills, while .agents/skills is writable, so emit cannot complete here without a half-written state.",
    "node --test scripts/test-process-debt.mjs: every generated PreToolUse hook's denial and advisory name the read tools, the exact commands and the compound rule; pwd && git status --short and node scripts/bootstrap.mjs; git rev-parse --show-toplevel are admitted; pwd && ls, pwd | cat and a trailing empty segment refuse."
  ],
  "rejected": [
    "Widen the hatch to prefixes or wildcards: the hatch exists precisely because the adapter that classifies commands is unavailable, so only exact spellings are safe.",
    "Admit a compound command when only its leading segment is allowlisted: the later segments would run unclassified.",
    "Regenerate the hook files from this session by another tool: the sandbox boundary is the operator's setting, and a partial emit would leave the checked-in hooks and manifest inconsistent."
  ],
  "reopenWhen": "The classifying adapter becomes available before the hooks load, or an admitted command needs an argument the exact list cannot express."
}
```

Shifting the burden to the intervenor and policy resistance are the traps
in play: the guard refused correctly while its message sent the operator to
do the machine's work. Rule beating is excluded because the compound rule
admits nothing the exact list does not. NoOp repeats the bootstrap handback
on every recovery. The remaining lenses add nothing for a message and
matching change with fixtures.

## WO-044-D007

```json
{
  "id": "WO-044-D007",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator question during execution: why the WO-131 measurement worktrees still exist and nothing cleans them up.",
  "decision": "Settle a closed order's derived worktrees on every close path, not only while the merged subject worktree still exists: a worktree settle action runs the same prune, preserve-and-remove or report-with-blocker dispositions from main, and release close calls it when the subject is already gone, in the dry run and in the close. The worktree helper's gate-evidence import becomes dynamic again because the static import broke the beacon constellation CLI in a fixture that copies only part of the skeleton.",
  "evidence": [
    "scripts/release.mjs updateMainAndFinish: the subject-removed branch fast-forwarded main and dropped the merged local branch only, so the WO-131 rerun that publishes v0.17.6 would have left DotLn-wo131-measure-002 through 005 and the temporary host subject registered.",
    "bash scripts/test-release.sh --case derived: a close with no subject worktree previews and then removes a clean derived sibling, keeps a dirty one with its blocker and the removal command, and still reports the no-release outcome.",
    "node --test packages/skeleton/dist/test/control-beacon-cli.test.js failed with empty output after item 4 introduced a static import of scripts/lib/gate-evidence.mjs into scripts/worktree.mjs; it passes again with the import made dynamic inside finish and settle."
  ],
  "rejected": [
    "Tell the operator to remove the folders by hand: the stage that owns teardown should do its own cleanup, and the same gap would recur on every rerun.",
    "Settle inside release close only: the worktree helper owns worktree registrations and its fixtures, and a standalone settle action is usable after any partial recovery."
  ],
  "reopenWhen": "A close path appears that reaches neither finish nor the subject-removed branch, or a derived worktree must survive a close by design."
}
```

Shifting the burden to the intervenor is again the trap: the operator was
left to notice and remove the machine's own scratch checkouts. NoOp keeps
four stale checkouts per measured order. Rule beating is excluded because
the standalone action reuses the exact preservation and blocker rules of
item 4 and reports what it keeps. The remaining lenses add nothing for a
teardown extension with fixtures.

## WO-044-D008

```json
{
  "id": "WO-044-D008",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator scope expand (defects I and J: guessing must be refused in every stage under every harness), followed by the operator's directions that artificial caps yield to needed rules and that accuracy comes before efficiency.",
  "decision": "Add one shared line to every role procedure in the contributor loadout, so the executor, verifier, reviewer, planner, refuter and both release-close projections in both harnesses say: never guess; an unobserved value is unknown, untested or blocked; each claim names its source or what is missing. Raise the cold-start byte ceilings that line touches in docs/control/budgets.json with real margin (executor 20480, verifier 16384, reviewer 16384, release-close 8192) and record the operator's direction as the source, instead of trimming the rule to fit the old ceilings.",
  "evidence": [
    "packages/skeleton/src/loadouts/feedback.ts: the shared support text is pinned by the feedback self-host audit edition, which requires a live worker run to re-record, so the rule lives in the role procedures instead.",
    "The compiled installation carries the line in all six role skills for both harnesses (for example the executor skill grows from 11369 to 11488 bytes).",
    "docs/control/budgets.json before this change: the Codex release-close skill measured 6128 bytes against a 6144 ceiling and the verifier 12090 against 12288; the retained WO-131 record presented an unverified hypothesis as the discriminating input.",
    "node scripts/harness-context.mjs --check: every role within its ceiling and every directed read set still strictly lower than the activation baseline."
  ],
  "rejected": [
    "Trim other procedure text to fit the old ceilings: optimizing the proxy at the expense of the rule, which the operator named as seeking the wrong goal.",
    "A per-instance dated acceptance for release-close alone: the verifier would have broken on the next real change for the same reason.",
    "Change the feedback support text: it would demand a new live self-host audit edition for a one-line rule."
  ],
  "reopenWhen": "The operator resets the budget contract, or a role's cold-start bytes approach the raised ceiling again."
}
```

Seeking the wrong goal and drift to low performance were the live traps: a
byte ceiling was about to decide what a role may be told. NoOp leaves a
recovering session free to present an inference as a finding. Rule beating
is checked because the line is generated from one source into both
harnesses and the context check still runs. Tragedy of the commons is the
cost the ceilings guard: the raised values add at most a few hundred bytes
per cold start, recorded here rather than hidden.

## WO-044-D009

```json
{
  "id": "WO-044-D009",
  "date": "2026-09-14",
  "dispatch": "operator override: during resume: next (2026-09-14), with the operator's directions that any step handed to a terminal outside the sandbox is a defect and that a session must request additional authority through the harness rather than hand steps back.",
  "decision": "Regenerated hook and skill surfaces are applied through the harness's file tool when the shell sandbox denies the emit command, and the result is verified byte for byte against the emitted set by the harness check. The user-level Claude Code setting sandbox.allowUnsandboxedCommands becomes true so a session can ask to run one command outside the sandbox, reviewed by the permission mode, which is the request-and-approve shape Codex already offers; the sandbox itself stays on. The security posture document records the change and its undo.",
  "evidence": [
    "This Claude Code sandbox returned EPERM for shell writes under .claude/hooks and .claude/skills and refused the unsandboxed launch request because allowUnsandboxedCommands was false in ~/.claude/settings.json; a child claude launch answered Not logged in inside the sandbox.",
    "node scripts/harness.mjs emit --out <scratch> produced the 24 surfaces; after the file-tool edits, diff against that set is empty and node scripts/harness.mjs check reports 24 generated surfaces.",
    "One edit re-pointed a pre-tool hook at the new runtime snapshot before its hash line, which made that hook refuse every tool call except the hatch until the operator's override suspended hook gates; the sequence is recorded here as the bypassed requirement.",
    "docs/AI-HARNESS-SECURITY.md previously pinned the unsandboxed fallback as disabled; the operator directed the change during this session.",
    "The session's own edit of ~/.claude/settings.json was denied by the Claude Code auto-mode classifier as self-modification, so the operator applies that one-line change; the posture document and this receipt record it as directed."
  ],
  "rejected": [
    "Hand the emit and the live launches to an operator terminal: the operator defined that as a defect.",
    "Relocate generated surfaces outside the host's protected paths: a design change for planning, and it still needs one protected write to land.",
    "Disable the sandbox entirely: removes a defense the posture keeps; the request-and-approve path is enough."
  ],
  "reopenWhen": "The host offers a first-class way to regenerate protected project files, or the operator restores the refuse-all posture."
}
```

Shifting the burden to the intervenor and seeking the wrong goal were the
traps: a control meant to protect the operator was making the operator do the
machine's work, and the session was about to optimize around it instead of
asking. NoOp keeps every generated-surface change and every live probe outside
the sandbox. Rule beating is checked because the applied bytes are verified
against the emitted set and every unsandboxed ask remains reviewable. The
remaining lenses add nothing for a settings and procedure change.

## WO-044-D010

```json
{
  "id": "WO-044-D010",
  "date": "2026-09-14",
  "dispatch": "resume: next; standing release assignment default (patch at activation) with the operator's scope expansion, which changed the compiler and skeleton sources.",
  "decision": "Assign application v0.17.7 to WO-044: v0.17.5 is the latest local annotated tag and v0.17.6 is already assigned to the merged but unpublished WO-131, so the next free patch avoids a two-way collision. Bump @dotln/compiler to 0.9.3 and @dotln/skeleton to 0.15.12 (package manifests, lockfile entries and the pinned version literals) because both sources changed in this order; console and kernel stay unchanged. Prepare the release locally.",
  "evidence": [
    "npm run release -- prepare --local: WO-044 target v0.17.7 remains current; no files changed.",
    "npm run release -- check-surfaces --local: release block v0.17.7 observed and expected; compiler and skeleton sources changed against v0.17.5.",
    "scripts/release.mjs releaseBlockRule expects the README to carry the greater of an order's target and the latest tag, so WO-131's later close from a main that carries v0.17.7 passes its surface check and reports the honest no-release outcome, and a WO-131 close before this order's merge publishes v0.17.6 without touching this order's target."
  ],
  "rejected": [
    "Reuse v0.17.6: whichever of WO-131 and WO-044 closed second would refuse on the tag or the README block.",
    "Leave component versions at WO-131's unpublished bumps: the branch baseline is main at b38c069, where those versions already stand, and this order changes both sources again."
  ],
  "reopenWhen": "A sibling release consumes v0.17.7 before integration, or the operator retimes WO-131 above it."
}
```

Policy resistance between two unpublished targets is the trap this avoids;
the rest is the standing assignment rule applied.

## WO-044-D011

```json
{
  "id": "WO-044-D011",
  "date": "2026-09-14",
  "dispatch": "resume: next; operator correction during the fourth full gate: a session that cannot stop its own running gate without an operator step is a bug, fixed in this order rather than deferred.",
  "decision": "Give the session its own route out of a running gate, identical in Claude and Codex: `node scripts/harness.mjs evidence --stop` (and the package form, which then neither builds nor marks a run) is admitted by the live-gate guard at the worktree root, writes one ignored stop request per live run under the active-gate markers and waits a bounded time. Every gate process publishes its run id and its ancestors' run ids to its children through DOTLN_GATE_RUNS, and each polls the request at the boundaries it owns: the evidence command after preparation and around each check, the runner before every suite and every 500 ms while suites run, ending running suites through their abort signal (SIGTERM, then SIGKILL after one second) and throwing without recording a check. The harness task-stop tools (TaskStop, KillShell) are classified as the session's own process control, admitted by the guard and mapped to shell.run; the live-gate refusal names the stop route.",
  "evidence": [
    "Gate run 4 of this session refused TaskStop as an unclassified effectful tool and refused every shell form, including pgrep, with the live-gate reason; the only routes were the operator's override or waiting.",
    "scripts/test-runner.test.mjs WO-044 stop tests: lineage propagation to a child process, sweep of a stale request, a polling gate ended within the stop command's wait with no marker or request left, the runner ending a resident suite in under four seconds and recording no check, and an aborted signal ending a suite that ignores SIGTERM.",
    "scripts/test-process-debt.mjs: during a live gate the permissions hook admits TaskStop, KillShell and both exact stop command spellings, still refuses the gate command, a compound stop, an extra flag and a stop under a sub-directory cwd, and its refusal text names the route; permissionEffect classifies both stop tools as shell.run.",
    "Live in this session: a background full gate with four live processes was ended by the exact stop command issued through the regenerated hooks; the runner ended harness-fixtures 27.3 s into the suite, both gate layers reported the stop with no check recorded, and no marker, request or check row remained at tree db694cbdf9126f9cb81700f94baaa151d19a053b."
  ],
  "rejected": [
    "Signal the marker pids from the stop command: a sandbox that refuses ps cannot verify that a pid still belongs to the gate, so a stale marker could kill an unrelated process of the same user; the cooperative request needs no identity claim.",
    "Admit every shell command during a gate: the guard exists because unclassified writes invalidate the run; the stop command is the one write the gate itself consumes.",
    "Leave the stop to the harness's task-stop tool alone: Codex has no equivalent, and a partial kill leaves orphaned gate children holding live markers.",
    "Defer to a later order: the operator directed the fix now, and the defect blocks every session that must end a gate."
  ],
  "reopenWhen": "A harness exposes a task-stop tool under a new name, a gate phase runs longer than its next poll boundary without a signal path, or a stop request is observed to leave a marker behind."
}
```

The cooperative request is the accurate mechanism: it acts only on processes
that read it, so no identity is guessed. Naive Interventionism would signal the
recorded pids; NoOp leaves the operator's override as the only exit, which the
operator has named a bug. Rule beating is checked because the exact command
list is closed and the gate command itself stays refused while a gate runs.

## WO-044-D012

```json
{
  "id": "WO-044-D012",
  "date": "2026-09-14",
  "dispatch": "resume: fix; VER-001 findings F1–F8",
  "decision": "Repair all eight counterexamples in the existing deliverable. Prove disposable repository scaffolding using refs, index and object storage, preserving unreadable or unknown state; serialize derived teardown through the existing writer reservation; cancel owned suite process groups with a bounded pipe fallback; retain operation-specific sanitized probe evidence and classify missing causation as ambiguous; derive launch selectors from executed arguments; remove owned detached spools on every exit; use Git's owner-executable bit; and record bounded detached resident kill/recovery attempts separately from native background-session availability.",
  "evidence": [
    "docs/verifications/WO-044/VER-001.md: deterministic counterexamples F1–F8 and affected acceptance criteria.",
    "scripts/lib/paths.mjs and feedback-selfhost.ts equate an unresolved HEAD with empty scaffolding; worktree.mjs checks gates but omits the writer protocol.",
    "test-runner.mjs waits for close after killing only the immediate child; writing-worker-probe.mjs attributes absence and aggregate refusals to specific policy and records outer selectors rather than per-launch arguments."
  ],
  "rejected": [
    "NoOp or weakening acceptance: preserves the demonstrated data-loss risks and turns missing observations into facts.",
    "Replace cleanup or worker transports: the observed defects have bounded fixes in their existing owners and the transport non-goals remain.",
    "Repeat every live launch: deterministic counterexamples establish most recorder failures; rerun only rows needing new operation or resident-lifecycle evidence."
  ],
  "reopenWhen": "A counterexample survives its regression, a live row lacks the required evidence after the bounded attempt, or a corrected helper no longer preserves its existing supported behavior."
}
```

The mission and critical-path contribution is dependable preservation and
truthful inputs for the source-change and resident-host orders. Policy
resistance and shifting the burden favor using the writer protocol and owned
cancellation instead of operator rescue. Rule beating and drift are addressed
by counterexamples with observable outcomes, rather than row counts. Commons
cost and escalation favor targeted fixtures and bounded live reruns before one
final gate. Success to the successful cannot privilege the existing assumptions
over VER-001; seeking the wrong goal would optimize passing labels instead of
recoverable work and accurate observations. Naive Interventionism keeps the
existing transport and authority boundaries, preserves uncertain data and
limits signals to processes launched by the suite. The same-day correction is
that missing HEAD, absent effects, aggregate refusals and an unconfirmed session
token were misread as positive evidence; each now requires its own observation.

The repair gate exposed a further same-day correction: serializing the entire
writer registration attempt prevented owner refresh and concurrent dead-owner
recovery in two existing WO-039 regressions. Registration now publishes a shared
lease before checking the teardown lock; teardown publishes its exclusive lock
before checking the leases. The conditional writer-instance protocol still
selects the admitted writer. Both race regressions and the preservation/teardown
regressions pass with this change. Retaining the broad lock would shift the
burden to operator recovery; locking only final placement would leave earlier
reservation mutations exposed to removal. NoOp would preserve both demonstrated
regressions. This bounded correction serves the same preservation mission and
does not change the other trap comparisons or reopening conditions above.

## WO-044-D013

```json
{
  "id": "WO-044-D013",
  "date": "2026-09-14",
  "dispatch": "resume: fix; VER-002 findings F1 (charged) and F2.",
  "decision": "Complete D010's already-declared compiler pin bump where it was missed — packages/skeleton/package.json:17 and package-lock.json:100 move from 0.9.2 to 0.9.3 to agree with the built compiler (F1). Make the process-debt repo() git-fixture teardown tolerate git's detached auto-gc by giving the owned rmSync bounded maxRetries/retryDelay, leaving git's default background maintenance in force so the suite result is decided by its assertions and not by whether a gc lands mid-teardown (F2).",
  "evidence": [
    "npm ls exited ELSPROBLEMS with '@dotln/compiler@0.9.3 deduped invalid: 0.9.2 from packages/skeleton' before the change and exits 0 clean after; D010 already claimed the bump for 'package manifests, lockfile entries and the pinned version literals'.",
    "VER-002 F2: scripts/test-process-debt.mjs:162 rmSync threw ENOTEMPTY on .git/info/refs and .git/objects/info/packs recreated by a detached gc; the verifier's controls (gc.auto=0, gc.autoDetach=false) established the mechanism.",
    "It is the only git-fixture teardown in that suite that can race gc; the other t.after blocks restore env vars or remove a plain temp dir, and the lock removals are not git repositories.",
    "Targeted run green: 'failed verification and review ... without requiring green code', 'harness evidence --fail ...', and 'harness evidence reuses the current full gate ...' all pass (node --test-name-pattern)."
  ],
  "rejected": [
    "Leave the skeleton pin at 0.9.2: a false component declaration the gate cannot see would enter the v0.17.7 release manifest.",
    "Disable gc.auto in the fixture's own config: it passes but not 'with git's default background maintenance in force', which is F2's stated reopening condition, and it removes the ability to observe the tolerated race."
  ],
  "reopenWhen": "F1 — the pin or lockfile disagrees with the built compiler or npm ls is unclean; F2 — process-debt fails with git's default background maintenance in force at corrected bytes."
}
```

The charged defect is a two-line manifest correction the gate structurally cannot
see; NoOp would tag a false declaration permanently. F2 is a reliability
correction to the amendments' own gate contract, so leaving it as a coin flip
would defeat criterion 9's reuse and D011's self-stop. Naive Interventionism is
bounded: the retry tolerates a race the fixture does not own rather than
signalling any process.

## WO-044-D014

```json
{
  "id": "WO-044-D014",
  "date": "2026-09-14",
  "dispatch": "resume: fix; operator scope expand (2026-09-14): the final gate runs 'over and over' and reuse never triggers in verify — fix the gate loop.",
  "decision": "Align the harness evidence runner with the lifecycle contract it already carries. Extract one shared lifecycleRequiredChecks(verdict) in gate-evidence.mjs; the lifecycle gate (lifecycle-evidence.mjs) and the runner (harness-host.ts) both read it so they cannot drift. runHarnessEvidence takes an optional pendingVerdict, and `harness evidence` accepts a strict `--fail` selector, so a failing verdict records only `git diff --check` instead of dragging ~10 minutes of test:full to reach a 126 ms check its own contract does not require. An absent verdict runs the full set byte-for-byte unchanged, and the pass path still requires test:full. The shared role evidence procedure documents `--fail`.",
  "evidence": [
    "scripts/lib/lifecycle-evidence.mjs:38-41 requires only git diff --check on a fail; packages/skeleton/src/harness-host.ts:1599-1611 hardcoded and ran both checks unconditionally; scripts/harness.mjs:118 refused all overrides.",
    "The pending verdict is only the resume CLI argument (resume.mjs verification-result/final-review-result); control.latestVerdict is the prior cycle's verdict and the phase admits both outcomes, so state cannot supply it — hence the explicit selector.",
    "test-process-debt.mjs new 'harness evidence --fail' test: fail records only git diff --check, never spawns test:full, and cannot satisfy a pass gate; the reuse test and the lifecycle fail-path test still pass unchanged.",
    "The 'over and over' loop itself is a convention violation, not code: the freeze-at-cutoff/cite-completion-event convention is documented in the executor and verifier skills and printed at harness.mjs:137, and gate counters live in git-ignored docs/control/local/; the prior verifier looped by pasting gate numbers into the tracked report body."
  ],
  "rejected": [
    "Derive the verdict from control-store state: unreliable (prior verdict; phase admits pass and fail).",
    "Leave the runner unconditional: a failing verdict keeps paying the full suite cost for a check it does not need.",
    "Edit harness-host.ts alone without the shared helper: the runner and the lifecycle gate would drift on the next contract change.",
    "Treat the loop as a code defect: no code writes counters into tracked reports; the fix is the already-documented freeze convention, which --fail additionally cheapens when violated."
  ],
  "reopenWhen": "A role needs a verdict the two-value set cannot express, or the pass path is shown to skip test:full."
}
```

Shifting the burden and process cost are the traps: a session was paying a
ten-minute suite gate to record a whitespace check its own contract does not ask
for on failure. The shared helper prevents rule-beating drift between the two
modules. NoOp keeps every failed verdict and every corrected fail report paying
the full gate. The convention finding is kept as a finding, not a code change,
because inventing machinery for a documented convention would be seeking the
wrong goal.

## WO-044-D015

```json
{
  "id": "WO-044-D015",
  "date": "2026-09-14",
  "dispatch": "operator override: during resume: fix (2026-09-14): 'use workflows and make edits to make workflows available'.",
  "decision": "Classify the Workflow tool as `spawn` in harnessToolEffects (packages/skeleton/src/harness-command.ts), the same class as Agent and Task, so the generated permission guard admits it as repo.read and treats each subagent's own tool calls as passing the same guards. The re-emit carries the tools-map change into the installed permissions hook. This is the durable analog of D011's TaskStop/KillShell classification; without it the tool is refused as 'Unclassified effectful tool: Workflow' in normal mode.",
  "evidence": [
    "The installed permissions hook refused the Workflow tool ('DOTLN_HARNESS_REFUSED: command classification: Unclassified effectful tool: Workflow') in normal mode; permissionEffect (harness-host.ts:2179-2192) throws for any tool absent from the map and maps a spawn to repo.read, refusing only isolation:remote.",
    "The emitted permissions.mjs now carries \"Workflow\": \"spawn\" beside Agent and Task; a regression asserts permissionEffect(Workflow) === repo.read.",
    "Bypassed requirement recorded truthfully: the diagnosis workflow ran under the override's suspended hook enforcement before this classification was applied; the operator's override authorizes the edit."
  ],
  "rejected": [
    "Rely on the override alone: workflows would be refused again in normal mode.",
    "Add a remote-isolation carve-out: the spawn handler already refuses isolation:remote; a workflow's remote agents are a script-level concern outside this classification.",
    "Leave Workflow unclassified: the operator directed durable availability."
  ],
  "reopenWhen": "The host renames or replaces the orchestration tool, or a workflow's subagents are shown to escape the per-effect guards."
}
```

Shifting the burden was the trap: a capable orchestration tool was refused as
unclassified while the operator needed it. Rule-beating is excluded because a
spawn changes no repository byte itself and every subagent effect still passes
the guards. NoOp keeps workflows unavailable outside an override.

## WO-044-D016

```json
{
  "id": "WO-044-D016",
  "date": "2026-09-14",
  "dispatch": "resume: fix; operator scope expand (2026-09-14): 'nothing was reused'; the operator chose 'Plan it; ship bounded now' on the reuse fork.",
  "decision": "Route the gate reuse defect to a planning pass rather than repair it here. It is a reuse-KEY CONTRACT change, not a bounded bug: the application-level test:full check is keyed to the whole tree hash including docs (gate-evidence.mjs gateTreeHash), so a verifier's report or control edit invalidates the executor's green gate; and fixture suites declare the whole scripts/ directory as an input (suite-evidence.mjs fixturePaths), so any script edit re-keys ~60+ tasks. Both change what the gate certifies and can only be verified by the full cold gates the operator is objecting to. Extend the existing README planning note to the three coupled items (doc-insensitive test:full key; per-suite input narrowing; content-keyed evidence editions) and ship only the bounded fail-path fix (D014) now, which already removes the cold gate on the fail path.",
  "evidence": [
    "Diagnosis workflow: the suite-input over-declaration is confirmed (suite-evidence.mjs:131 'scripts/', ~60+ tasks) and verdicted needs-planning; narrowing is fail-safe against stale reuse but is a contract change whose verification needs full replica gate runs.",
    "App-level keying read directly: gate-evidence.mjs:440-467 hashes all staged+untracked paths with no docs exclusion, while per-suite keys already exclude docs (suite-evidence.mjs digests.source), so the aggregate check is the doc-sensitive outlier.",
    "docs/evidence/WO-044/README.md:88,94-98 already filed reuse-narrowing as a planning input, one of three coupled items.",
    "The operator's AskUserQuestion selection: 'Plan it; ship bounded now.'"
  ],
  "rejected": [
    "Attempt the app-level key change now: a gate-certification contract change, unverifiable here without a cold gate, with soundness risk — the operator declined it.",
    "Attempt the full reuse rework now (app-level key + narrow every suite): largest and riskiest, multiple cold gates, and it leaves the third coupled item open.",
    "NoOp: leaves verify and the fail path uneconomical, which is the operator's complaint."
  ],
  "reopenWhen": "A planning pass takes up the reuse-key contract, or the operator directs an in-repair attempt accepting the cold-gate verification cost."
}
```

Correctness over sycophancy governs this one: the operator asked for the reuse
fix, but an unverifiable gate-certification change could reuse a stale success,
so the honest disposition is a planning route with the bounded fail-path fix
shipped now. Anti-oscillation keeps the repair inside the category the operator
pointed at without widening it into a contract rework. The operator's own choice
is the authority; NoOp and the eager rework are both recorded as rejected.

## WO-044-D017

```json
{
  "id": "WO-044-D017",
  "date": "2026-09-15",
  "dispatch": "resume: fix; VER-003 F1",
  "decision": "Move the paired emit/check option parser into that action branch so evidence reaches its existing strict --fail selector. Exercise the real package mapping, entry wrapper, CLI parser and preparation in the existing failure-gate regression, with bounded build and suite payloads. Preserve the default full gate and the lifecycle refusal of a fail-only receipt for a passing verdict.",
  "evidence": [
    "VER-003 F1 and this repair's baseline: npm run harness -- evidence --fail builds, prints usage and exits 1 before recording checks.",
    "scripts/harness.mjs parses every non-stop evidence argument as an emit/check option before evaluating failOnly; scripts/harness-entry.mjs already forwards the arguments correctly.",
    "The earlier regression called runHarnessEvidence directly and therefore did not establish the public command's behavior."
  ],
  "rejected": [
    "NoOp or another internal-function-only test: the promised operator command would remain broken or untested.",
    "Teach the generic paired parser a boolean special case: it mixes unrelated command grammars and is larger than keeping each parser with its owning action.",
    "Rework the evidence or reuse architecture: F1 requires no contract change, and D016 retains the operator's planning disposition."
  ],
  "reopenWhen": "The exact package command rejects --fail, records a suite check on that path, or the default/pass path can complete without its full gate."
}
```

The goal is dependable operator flow while completing the discovery prerequisite
for WO-049/051/068. Policy resistance and shifting the burden are directly
addressed by removing the parser conflict that forced operator rescue. Rule
beating and drift are addressed by testing the public command and keeping the
pass requirement. Commons cost and escalation favor one existing regression
with bounded payloads and one final full gate. Success to the successful does
not privilege the earlier green internal test; seeking the wrong goal would
expand this concrete repair into speculative support work. Naive Interventionism
keeps the runner, preparation and stop behavior intact; this parser move is
reversible. The correction to D014 is explicit: its internal behavior was proven,
but its claim that the public command accepted the flag was not. This receipt
records that correction on the repair's UTC date; the historical decision and
immutable VER-003 remain unchanged.

The first full gate exposed a defect in the new regression fixture: its
`scripts/lib` symlink passed ordinary execution but changed relative module
resolution under the replica's intentional `--preserve-symlinks`. The fixture
now copies the actual library, work-order index entry and three imported
skeleton source modules locally. The targeted failure/default and lifecycle
tests pass with that same Node option. This corrects the earlier fixture
assumption without changing the replica policy or the parser repair.

That run also reported an EINVAL while cleaning a release-preflight replica
(the case body passed; the cleanup cause remains unestablished) and EPERM
writing the shared Git success cache after suite execution. The identical
cache error exists in earlier WO-044 logs. WO-129 moved this cache outside the
worktree on September 13; this Codex sandbox cannot write it. The executor
should have checked that known requirement before the costly run. An initial
outside-sandbox retry was stopped as soon as the fixture failure was diagnosed.
The corrected tree requires another canonical gate with approved cache access;
no failed or stopped attempt supplies passing evidence. This extra work is a
cost of the fixture mistake and the missed host prerequisite, not a benefit of
the repair. The original decision's scope and trap comparisons still apply.
## WO-044-D018

```json
{
  "id": "WO-044-D018",
  "date": "2026-09-15",
  "dispatch": "resume: fix; VER-004 F1",
  "decision": "Correct the prepared root README release block to name compiler 0.9.3 and skeleton 0.15.12, matching the shipped manifests. Keep this repair to the two component declarations and its evidence write-backs.",
  "evidence": [
    "VER-004 F1 and the executor's executable baseline comparison found README compiler 0.9.2 versus package 0.9.3, and README skeleton 0.15.11 versus package 0.15.12. Console 0.1.5 already matches.",
    "The compiler identity constant and both generated harness profiles agree with the package versions, as independently checked by a read-only audit agent.",
    "Product 07 requires the prepared README block to match release truth. Existing release surface validation checks the application target and package manifests, not the bare component versions in prose."
  ],
  "rejected": [
    "NoOp or a prose justification for the old pair: the prepared release would continue describing components from the preceding release without evidence for that divergence.",
    "Expand the release checker or change its generation contract: the charged defect is a two-value documentation correction; an executable comparison supplies bounded evidence without adding runtime behavior.",
    "Update all historical version references: frozen evidence and historical release descriptions remain accurate for their own cutoffs."
  ],
  "reopenWhen": "The shipped component manifests change, or a subsequent prepared release repeats this prose drift and warrants a separate generation or validation change."
}
```

The goal is an accurate source-to-deliverable handoff while preserving the
discovery prerequisite for WO-049, WO-051 and WO-068. Rule beating and drift to
low performance favor directly comparing the public claim with package truth,
since a green release checker alone cannot establish this claim. Commons cost
and escalation favor a reversible sentence correction and the existing required
gate. Shifting the burden is avoided by correcting it before reviewer handoff.
Policy resistance, success to the successful and seeking the wrong goal add no
new mechanism: the release target, component identities and existing authority
remain the inputs. Naive Interventionism favors the smallest useful correction;
NoOp preserves a known false statement. The earlier executor changed only the
application target while overlooking the accompanying component pair; this
same-day repair corrects that omission, not the immutable verification report.

The audit also found stale current-version headings in the compiler and skeleton
package READMEs, with a stale compiler identity-version example. Those paths are
outside VER-004 F1 and the order's named repair paths. The adjacent queue records
their cause, intended fix and checks for a later documentation planning pass;
pre-existing origin alone is not the reason for deferral. A separate scope
decision can admit those paths without widening this literal correction.
