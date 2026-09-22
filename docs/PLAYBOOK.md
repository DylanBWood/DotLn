# Operator playbook — the canonical loop

For the human running this. The models have their own doc
(`product/07-execution-guide.md`); this one is yours. Follow it mechanically
until it's muscle memory; edit it when reality disagrees.

## Who does what

| Actor                           | Effort source                                                                                                 | Use for                                                                                                         | Don't use for                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Fable 5**                     | planning assignment; the work order's `reviewer` declaration when closing                                     | Plan and refine work orders; perform the end-of-work-order blueprint/lineage check                              | Implementation or acceptance verification                                                                          |
| **Entropy Reducer** (Opus 5.5) | `npm run entropy -- review --transport claude-cli-print` passes the compiled WO-023 model (Claude Opus 5.5 since WO-100) and `xhigh` effort on the command line and records them from the invocation; any other route is labelled `substitute reviewer` in the receipt | Whole-repository entropy review, reproducible findings, and non-authoritative ProductSuggestion packet payloads | Implementing, filing, promoting, or verifying its own suggestions; changing tracked/control/remote/settings state  |
| **Opus 5** (1M)                 | the active work order's `verifier` declaration                                                                | Blinded verification of Codex-built work orders                                                                 | Implementing or repairing the work it verifies                                                                     |
| **Sonnet 5**                    | the active work order's declaration for the role it occupies                                                  | Bounded mechanical work: test scaffolds, renames, formatting, running fixtures, small fan-outs                  | Anything requiring judgment about the blueprint                                                                    |
| **Codex** (GPT-6 Sol)           | operator-selected `xhigh` default; record the actual model and effort; order declarations are recommendations   | Execute and repair work orders                                                                                  | Acceptance verification of its own work — it reads `AGENTS.md` (symlinked to CLAUDE.md), so the same rules bind it |
| **Copilot CLI** (operator-selected model) | actual CLI-selected readback or operator attestation, separately from harness identity | Executor, fixer and fresh verifier qualified on CLI 1.0.86 / Claude Sonnet 5 / xhigh | Final review and release close: **untested**; keep those on a qualified harness |

Copilot entry is bare `copilot` from the worktree root, with no required launch
arguments. Its six role skills are the same generated bodies used by the other
harnesses. The [dated control table](AI-HARNESS-SECURITY.md#copilot-control-table)
distinguishes observed hook guarantees from advisory and unsupported controls, and the
[qualification record](evidence/WO-146/qualification.md) records the actual
operator episodes. Cross-session memory can carry implementer context into a
fresh verifier; a different session identifier is not mechanical independence.
No push, pull request, tag or Release was exercised under Copilot. Its built-in
GitHub MCP server, `/delegate`, `--remote`, `--fleet` and autopilot remain
outside this loop's qualification and helper governance.

Three standing rules (WO-132, 2026-09-15):

- **Implementer ≠ verifier.** A fresh independent session verifies the work;
  the implementer repairs its findings. Model names in the table are assignments,
  not the source of independence.
- **Model and effort are recommendations and observations.** Record the actual
  harness, version, model, effort and source. Presence is required; a version,
  discovery gap, missing readback or below-recommendation effort does not refuse
  a lifecycle completion. `unknown` remains admissible.
- **Preserve the reported values.** `ultra` and `ultra code` normalize to
  `effort: xhigh`, `mode: subagents`, with the raw spelling retained. Other labels
  remain as supplied. Historical low-effort disclosures for WO-001 through
  WO-003 and the old `ultracode` records remain unchanged; they are not rewritten
  under this 2026-09-15 migration.

The human roles around this table are the five
[UIFA roles](product/13-uifa-roles.md). The operator currently wears UIFA devops
and UIFA showrunner; the planning step is the showrunner's, whichever model
assists it.

The operator's 2026-09-22 default is GPT-6 Sol with `xhigh` effort for all
Codex steps unless explicitly changed (GPT-6 Astra with `max` from 2026-09-04;
changed by the WO-100 scope expansion). Record that selection as operator-attested
when no effective-session readback exists; do not relabel a persisted selector
as readback. State any change from the recommended assignment. The
[Entropy Reducer guide](instance/entropy-reducer/README.md) supplies its
`npm run entropy` dispatch of the Opus 5.5/xhigh reviewer, the fresh blinded
refutation step and the disposition that lands accepted findings in the
follow-up register.

To distinguish accounts, set an opaque label separately in each terminal, for
example `export DOTLN_ACCOUNT_LABEL=a1` in one and
`export DOTLN_ACCOUNT_LABEL=claude-2` in another. Completion commands use that
default; `--account-label <label>` overrides it. Use 1–16 lowercase letters,
digits or hyphens, beginning with a letter. `unset DOTLN_ACCOUNT_LABEL` returns
to omission; an empty value is invalid. Store any private meaning by hand, one
line per label in ignored `docs/control/local/account-labels.md`. Control commands
do not interpret that file. Closeout copies and byte-verifies it as opaque
retained material; receipts omit its contents and content hashes. The label
itself is public, so choose no identifying content. An omitted label displays
`not-applicable`.

Run `npm run resume --silent -- usage` for elapsed-time summaries across all
orders, or add `--json` for `totals`, `byActor`, and `byWorkOrder`. Retries remain
separate completed attempts. `elapsedMs` sums known signed spans; `unknown`
counts attempts with a missing endpoint. These are wall-clock spans including
waiting and interruptions, attributed to the completion actor. Overlapping work
orders can overlap in the sums. `npm run meta` adds observed tokens and cost
per dispatch from usage envelopes and interactive counters, with declared
prompt costs beside them. Unknown observations remain unavailable; it records
no raw transcript text. Missing counters are `unknown`, never a completion
requirement. For closed orders, the meter compares promised removals with
observed rows; a shortfall is a planning input, not a gate. Unspecified token,
dollar and PR-body caps remain unset while usage is collected.

## Harness safety baseline

Before dispatching from a personal machine, verify the dated Claude Code,
Codex CLI and Copilot CLI setup in [`AI-HARNESS-SECURITY.md`](AI-HARNESS-SECURITY.md). Fable,
Opus, and Sonnet are roles or model assignments inside Claude Code, not separate
harnesses; they inherit Claude's effective settings. The same distinction
applies to model names inside Codex or Copilot.

The standing security invariant is that a discovered credential, host, open
port, connector, or capable tool is not authority to use it. Keep untrusted
execution inside the enabled shell sandbox and route boundary-crossing requests
through the host's approval mechanism. Re-check effective settings after upgrades.
DotLn hooks refuse five conditions: a second writer in one worktree; a write to
gate inputs or the success record during any live `npm test`; a repository
write outside `docs/` and root Markdown on a `planning/` branch; and an
observable subagent admission beyond `docs/control/budgets.json` `subagentCap`
(default 20; `null` disables); and a known outside-project write destination
without an active role or support grant. Descendants count at their first attributable
tool call; unresolved direct/child overlap is a reported minimum and unobserved
agents remain unknown. Claude enforces these observed boundaries; Codex carries
the same duties as role text. Copilot reuses the existing registration, with
the control table's field, identity and bare-session limits. Other judgments
advise and defer to host permissions.
A registered writer may plan, build, bootstrap and close a release on main.

At the 2026-09-01 Codex baseline, `.git` and a linked worktree's resolved Git
directory remain protected even under `workspace-write`. A Codex session must
therefore request outside-sandbox approval on the **first invocation** of every
state-changing `npm run resume -- ...` command so its recovery checkpoint can be
created. `status`, `times` and `briefing` are read-only; `next` appends no event
and creates no checkpoint but does refresh the workspace projection. `status --json` exposes
the same control fields for lifecycle scripts; both status forms are read-only
and warn without rewriting if the Markdown projection is stale. Do not run a transition
sandboxed and then retry it: the transition records even when the optional
checkpoint does not. The approval unsandboxes the whole project-controlled `npm`
process, so first inspect the exact command, `package.json` mapping, and current
`scripts/resume.mjs` diff, then request a one-invocation approval—never a
persistent allow rule. The harness guide explains the warning, current Claude
asymmetry, verification steps, and rollback. This paragraph is the rule's home;
product 07 §Operator resume phrases points here since WO-090 (2026-09-20).

## Ideation breakout

Prefix a message with `ideation:` to dispatch the full documentation pipeline:
raw capture, clean-room review, rewritten synthesis, any warranted ledger
entries, product-doc write-back, and—when committed surfaces change during a
work order—a scope-expansion receipt for verification. Use
`ideation: capture only` when you deliberately want local intake without
synthesis. You should not need to restate the pipeline after the prefix.

During an active work order, the executor finishes the breakout and continues
to ready to verify, running the checks the changed claims need. You do not need to repeat
`continue`; say so when you want a pause or capture only.
A committed expansion needs explicit authority; the
receipt names that authority, raw batch, affected ledger/product/decision/
schema surfaces, unresolved choices, and required review. Existing worktree
changes remain intact throughout.

Original intake lives in the main checkout's ignored directory. The executor
resolves that checkout before source lookup and capture; a worktree's relative
`docs/intake/` is not a copy of the corpus.

## Planning pass

Prefix a message with `planning:` (or ask for a planning session) on the clean
main checkout to run the pass described in
[07 §Operator-opened planning pass](product/07-execution-guide.md#operator-opened-planning-pass).
Run `npm run plan -- start <slug>` to create the planning branch from clean
main before writing. On a `planning/` branch, repository writes stay within
`docs/` and root Markdown; external paths remain admitted by this DotLn rule.
Plan fan-out against the session's remaining `subagentCap`, including descendants,
and report unknown coverage rather than assuming a fresh budget. The planner reads the sequence and the guide's planning
and ideation sections, then scopes candidate and source lookups. It returns
synthesized docs, the sequence and map changes, Cost-bearing order drafts and
the available process-cost observations. Commit that subject before refutation.
`planning: refute` judges goal alignment for the latest pass; `planning: refute
full` judges the whole horizon. The canonical prompt asks about critical-path
progress and NoOp cost, all eight system traps, removal versus addition, and
fallback behavior. Only observed failure or contradiction with vision text can
hold a misaligned order; hypothetical issues carry reopening observations.
There is one judgment per pass unless observed evidence changes. Use
`npm run plan -- dispose <receipt-id> <hold-id> '<reason>'` to bind a disposition
to the criterion text after repair, without another judgment. The
[receipt convention](planning/refutations/README.md) supplies the exact commands.
Finish with `npm run test:docs`, which checks current documents and their runtime projections without the product or machinery fixture suites. Planning
retains its separate publication authority and does not activate an order.
During execution, an operator-authorized change to a judged order is recorded in
its structured decisions and bound with `npm run plan -- amend-order WO-NNN
WO-NNN-DNNN "operator authorization and bounded scope"`; this appends the
existing planning-log amendment and does not discharge an independent hold.

## The loop, per work order

**1. Plan (Fable, main checkout).** Pick or refine the WO in
`docs/work-orders/`. Consult the [generated index](work-orders/README.md) for
header, control, typed dependency, and local release evidence; use the
[human map](planning/work-order-map.md) for recommendation, rationale, tracks,
and activation preflight. Never choose by the next integer. Revalidate the
selected row against its work order and the
current control state before activation. If the docs need updating first, do it
here. Main remains the control plane; one registered writer owns each worktree, including main. Work-order implementation uses its own worktree.

`npm run work-orders -- index` refreshes the evidence view. Its `--check` form
uses the recorded tag-object snapshot so a new release tag does not break that
release's own checks; it reports newer local release tags and refuses missing or
changed recorded ones. Refresh after lifecycle dispatch/result transitions and
before evidence runs, including after executor readiness and final review.
The control helpers do not update it automatically. The executor refreshes it
on dispatch as well as at its evidence/result boundaries. The README leads
with the operator's proposed sequence from `docs/planning/sequence.md`;
checkboxes follow passing final review in the control log. No separate editor
checklist is needed. Merge and release remain separately evidenced. The index
computes dependency readiness from each open authority's typed block.
`status --json` carries the same `dependencies` projection for its selected
order. Activation refuses unmet typed entries before appending an event and
names the required closure, release or dated authority edit. Unmarked legacy
prose stays a conservative token view that does not block. Human preflight
still checks authority, environment, exclusive resources and other prerequisites;
the map supplies recommendations. Typed release dependencies use current local
ancestry even when release attribution retains its recorded tag snapshot.

**Current gate contract (WO-132, 2026-09-15).** `npm test` is the product
and lifecycle gate. `npm test -- --list` names the behavior each suite protects.
The final reviewer runs `npm test -- --review` once after the last source edit;
`--review` includes machinery suites only when their declared sources changed.
`npm run test:machinery` runs that inventory on demand; document-sensitive checks
stay in `npm run test:docs`. The runner executes fresh suites against the worktree.
There are no replica executions, per-suite success reuse or 120-second fast-gate
budget in this contract.

The success row records code identity beside the exact reviewed tree. Reports,
control events, generated projections and release prose do not invalidate the
code key. The passing final-review event retains that row for PR publication and
release close. Executor and verifier checks follow the claims they need to
establish; a transition never requires the product gate. Completion runs
`git diff --check`, checks the report and actor fields, and appends the legal
event. Missing session reads, authorship, usage or planning handoff observations
are advisory. Decisions and corrections go to the order's decisions file;
the ledger stays with ideation and planning.

**2. Implement (Codex, fresh session, own worktree).**

```bash
cd ~/Projects/DotLn
npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-name.md
```

Before `start`, confirm that the authority is committed, its H1 carries the
planned version, and it has valid `Model:` and three-role `Effort:` lines.

`start` creates and activates the isolated worktree, then prints an absolute,
shell-quoted `cd` command and the rest of the handoff. Run those steps yourself:

```bash
cd '/absolute/path/printed/by/start'
codex
```

Then enter only this chat phrase:

```text
resume: next
```

In phase `active`, `next` resolves the work-order path and dispatches the
executor. Project tooling does not open or inspect Codex in this current
projection; that is a present workflow choice, not a permanent ban on later
governed worker launching. Everything the executor needs is in the repo. Don't
paste context or explain the work order again.

When planning assigns a tagging version above the latest published tag, the
work order must make updating the root README release block part of execution.
The planner pins the target; the executor makes the public source claim true;
the publisher and release close check it against tag truth.

From the operator's 2026-09-04 instruction, normal release assignment and source
updates happen by default; specify a no-release disposition to opt out. A
missing activation target is completed using the roadmap's classification and
latest published base. This saves repeated opt-in questions while preserving
the explicit final-review and release-close dispatches for external effects.

The executor also updates the current factual documentation reached by the
change: product contracts, reader entry points, examples, names, limitations,
runbook and publication references. The existing outcome or ideation receipt
names the affected surfaces and checks. Verification checks those claims;
final review closes the consistency pass. Separate publication work is for
edition assembly or broader editorial debt, not for postponing factual updates.
See [documentation ownership](product/07-execution-guide.md#documentation-freshness-and-ownership).

**3. Verify (Opus 5, fresh session, blinded).** New session — not the
implementer's, no implementer narrative. Feed it: the WO + the diff.

Open the assigned verifier in the subject worktree, then enter:

```text
resume: verify
```

The phrase allocates the immutable `VER-NNN` path and prints the authoritative
work-order path. The verifier runs the acceptance evidence, writes only that
report, and records `pass` or `fail`; it does not repair its own findings.
It runs the product gate when useful, not as a prerequisite to `verification-result`.
Its report remains immutable even when later bookkeeping changes the exact tree.

**4. Repair or final review.** Each state transition attempts to mint a local
checkpoint ref before it appends, so use the chat command instead of
hand-writing a checkpoint commit. If checkpoint creation fails, the projected
state says it is unavailable and must not advertise an older recovery ref. Those
refs do not include ignored `docs/intake` material; back raw intake up
separately. If verification is red, open a fresh Codex session in the same
worktree and enter:

```text
resume: fix
```

It prints both the authoritative work order and the specific immutable failing
report. When the repair evidence is green, it records `repair-complete`; open a
fresh verifier and use `resume: verify` again. Never update or delete an older
report.

If the operator catches an incomplete repair after `repair-complete` but before
the next verifier is allocated, use `resume: fix` again. It may reopen only the
preserved failed verification/final-review source; an ordinary initial
`ready-to-verify` state has no such permission. After correcting the subject,
record `repair-complete` again so the advertised recovery checkpoint contains
the actual verifier subject.

When verification is green, open the final-review session in the subject
worktree and enter:

```text
resume: final review
```

It reads the original work order, complete verification sequence, diff, tests,
ideation receipt, and all affected product/ledger/schema surfaces. It may make
non-substantive handoff corrections and routine integration under the
[independent-workflow contract](product/07-execution-guide.md#independent-workflows-and-integration).
An actual acceptance defect or a behavioral fix requires bounded repair and
independent evidence for the affected claims. A new base or release-only
retiming does not itself fail review or require another verification. On pass, this
phrase is explicit authority to write the immutable `FINAL-NNN`, the reviewed PR
body, and `RELEASE-NOTES.md` with the five required release-note sections,
record the pass, commit the reviewed state, push only the WO branch, and open a
mergeable PR. The notes file is written even for a no-release work order so its
reviewed prose can ride the next tag. It never merges the PR; that remains
yours.

After the last source edit, make new source files known to Git and run
`npm test -- --review` once. Keep gate inputs and the success record unchanged
while it runs. Reports and release prose may follow the run because they do not
change code identity. The passing completion records the product-gate row in
committed control history; publication checks that the reviewed code still
matches it.

Author the committed PR body and release notes as renderer-wrapped GitHub prose:
one physical source line per paragraph or list-item paragraph, with separate
lines retained for actual Markdown structure. Do not hand-wrap them to the
repository's code width; GitHub decides how the unchanged reviewed bytes wrap
inside its own page layout.

Use a concise title that identifies the change, then a summary of its effect,
reason, and relevant validation. Link detailed reports. Size the title and
body from this change, not from the previous PR; one-way drift across
consecutive entries is the defect the guide's no-ratchet-creep rule names.
Follow the
[PR and commit guidance](product/08-publication-compiler.md#prs-and-commits),
including separate commits for distinct coherent changes and a staged-diff check
for each. The final reviewer commits the reviewed series; one work order does
not require a single catch-all commit.

Choose the title's gitmoji from the full catalog to suit the actual change;
give specific, expressive choices consideration beyond the usual defaults.

After the reviewed commit exists, the final reviewer invokes the bounded PR
publisher with a committed body file inside the worktree:

```bash
npm run worktree -- publish WO-NNN --title '<reviewed title>' --body-file <contained-reviewed-body-path>
```

The publisher runs the release-surface preflight, validates the subject's
committed reviewed notes and GitHub-body profile, and only then may push. It
prints the exact release-close handoff to use after you merge.

`main` requires a PR through the repository's GitHub ruleset. A 404 from the
classic `/branches/main/protection` endpoint is not evidence that the branch is
unprotected; ruleset-aware inspection is required. Project tooling therefore has
no direct-push-to-main path.

**5. Merge and release close.** You review and merge the PR, then enter:

```text
resume: release close
```

That phrase authorizes the agent to run this command from the main checkout:

```bash
npm run release -- close WO-NNN --publish
```

Close proves network egress first, fast-forwards main, checks release surfaces
and derives the tag manifest from committed source and the reviewer's passing
`npm test` row in the final-review event. It builds missing runtime output when
needed; it runs no suite, dependency installation or CLI smoke check. The
manifest records code identity, the reviewed tree and the merge tree. Changed
code refuses publication; report and release-text edits do not demand another
gate. `--dry-run` previews the same steps and manifest without publishing.
The host must grant the required network and GitHub permissions.

Close creates and pushes the annotated tag, then creates the GitHub Release.
Only afterwards does it attempt worktree finish and derived-worktree settlement.
Cleanup blockers are reported without failing publication. Local intake and
other protected material are preserved; ignored and untracked material is
reported. Only tracked dirt blocks the release's clean-source requirement.
Unknown protected material or a subject's local harness settings can prevent
worktree removal without preventing the completed release. Do not inspect,
copy or discard private settings to clear such a blocker.

A strictly lower target is an honest no-release close; an equal target succeeds
only when the existing validated tag names the expected commit. If GitHub
Release creation fails after the tag push, preserve the tag and rerun the same
command. The retry creates the missing projection or reports a differing body
without silently editing it. Historical tags retain their original evidence
contracts. WO-132 supersedes the earlier teardown-before-publication and fresh
release-gate procedure; its old receipts remain historical evidence.

After publication, `npm run release -- notes vX.Y.Z` renders one tag's human
layer and `npm run release -- list` lists local release tags, commits,
application versions, and included work orders; neither command uses the
network. Historical GitHub Release backfill is never implicit in closeout. Run
`npm run release -- publish-notes vX.Y.Z` only as a separate explicit operator
action for a tag predating WO-024, or record the deliberate decision not to
backfill.

### Repeated code → verify → fix loops

The original `WO-00N` never becomes a verifier-owned work order. It remains the
scope authority. Each `VER-NNN` is an immutable finding artifact that can
contain a bounded repair checklist. For every additional loop:

1. Repair reads `docs/work-orders/WO-00N-*.md` plus the latest dispatched
   `docs/verifications/WO-00N/VER-NNN.md`.
2. The verifier reads the original work order, current diff, and relevant prior
   reports, then writes `VER-(NNN+1).md` without modifying older reports.
3. Final review reads the full sequence, so fixed, recurring, stale, and newly
   introduced findings remain distinguishable.

When asking Codex conversationally, use: “Repair the current work order from
`docs/verifications/WO-00N/VER-NNN.md`; read both it and the original work
order.”

## Concurrency

One writable agent per worktree, always. WO-030 adds independent control
segments for parallel implementation, while main integration stays serialized.
The control view lists the orders known in its checkout; it does not poll
unmerged sibling worktrees or infer worker liveness. Each order keeps the same
implementation → verification → final-review contract.

Use `npm run worktree -- constellation` to observe current Beacon metadata
across the worktree set without appending events; use the documented `--agent`
form when perception must be authorized and replayed. Individual v2 phase,
verdict, effort, and age are projections; they never authorize a transition.
The group count is bounded to twelve members. Each worktree writes only its
own ignored `.control-beacons/` cache, which may leave with a safely closed
worktree; the anchored `docs/intake/**` protection is unchanged. A stale or
absent Beacon is a reason to inspect canonical state, not proof of a dead worker.

The operator's 2026-09-07 correction keeps implementation and verification independent across work orders. The operator voluntarily takes one order through final review, PR, merge, and release close before bringing another into final review; this is discipline, not a transition gate. No earlier phase must wait on another order's phase. See [the integration contract](product/07-execution-guide.md#independent-workflows-and-integration).

For concurrent work:

1. Recheck the [lane rules](planning/concurrent-work-orders-plan.md#lane-rules-the-showrunner-can-apply-by-hand), dependencies, write surfaces, actor capacity, and each release target. Start each authorized order from clean main with `npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-name.md`, then use a separate session in each emitted worktree.
2. Use the ordinary resume phrases there; the `wo-NNN` branch selects the order. On main, use `npm run resume -- status` for the overview and `npm run resume --silent -- status --json --work-order WO-NNN` for a selected order. Explicit selection overrides a worktree's branch too.
3. Integrate reviewed PRs one at a time. In the order's worktree run `npm run worktree -- integrate WO-NNN`, naming `--intake-backup <archive.zip>` when ignored intake is present. The helper keeps a checkpoint and named stash, updates the base, regenerates projections and unions the follow-up register. Never union-merge, rewrite, or move control events.
4. Within its final-review window, the integrating actor resolves listed authored conflicts, stages those resolutions and runs `npm run worktree -- integrate WO-NNN --continue`. Complete the helper's dated decision stub, assess affected acceptance claims and run its printed checks. An unrelated merge, additive documentation, independent manifest fields, or release-only metadata does not automatically fail review or restart verification. Preserve the earlier report as evidence for its actual subject and record integration evidence in the current review. An actual behavior-changing resolution or acceptance defect needs bounded repair and independent evidence for the affected claims.
5. After each authorized merge, use that order's printed release-close handoff. Finish and release select the named order from committed control, so a sibling can remain open. Only an empty in-flight set means between work orders.

The [feasibility fixture](../scripts/test-concurrent-control.mjs) exercises two
independent lifecycles, serial integration and release attribution, plus a
third branch created before the first merge. The first actual pair's
integration costs are recorded in the phase-two plan; lane generation and
per-order workflow variation remain deferred. Main stays clean for the
operator and planning session.

The [integration checklist](product/07-execution-guide.md#independent-workflows-and-integration)
defines the helper's scope. It never drops the recovery stash, rewrites reviewed
commits, runs the product gate or decides acceptance. Conflicting authored
content stays for explicit resolution; generated lock lines and harness
fragments are regenerated without replacing the surrounding prose. Component
retiming and evidence-edition judgment remain with the reviewer. Available
actors and one writer per worktree bound resources; do not impose a phase-count
admission rule on independent orders.

## When things break

- **Session dies / rate-limited mid-WO:** nothing is lost — the repo + WO are
  the memory, but that memory is uncommitted working-tree state until final
  review commits. A dead session loses nothing; a reset or a clean loses
  everything not checkpointed. Start a fresh session in the same worktree and
  enter `resume: next`; the resolved work order tells the new executor to
  inspect the existing tree before continuing. (Disposable incarnations; the
  workflow remembers the worker.)
- **Out of Claude budget:** route `Model: any` work to Codex; park model-pinned
  work orders — never substitute silently.
- **Executor asks you a question it shouldn't** ("should I run the tests?"): the
  answer is in the WO's evidence gate. Say "follow the work order" and note it —
  that's a future compiled feedback unit.
- **Executor went sideways:** kill it, don't argue with it. Fix the WO or the
  doc that misled it (that's the real bug), then preserve the entire dirty tree
  with a named stash, for example
  `git stash push --include-untracked -m 'WO-NNN recovery'`; never drop that
  stash. The stash stack is shared across every worktree of this repository, so
  a concurrent session can reorder or consume entries — re-find yours by its
  `-m` tag, never by `stash@{n}` position, and restore with `git stash apply`,
  not `pop`. Check `npm run resume -- status`. If it advertises a checkpoint for
  the latest transition, a fresh agent may use that exact restore command only
  after the stash succeeds; otherwise repair from the parked diff instead of
  guessing at an older ref. Do not create a hand-written checkpoint commit on
  the work-order branch: valid transitions already mint local
  `refs/dotln/checkpoint/...` commits, while branch commits wait for final
  review. Never `git checkout .`, `git restore .`, `git reset --hard`, or
  `git clean -fd` here without a current recoverable copy — those can destroy
  the deliverable, every `VER-NNN` written so far, and
  the order's control segment. Never `git clean -fdx`/`-fdX` at all: it also
  deletes gitignored `docs/intake`, which is single-copy and in no commit. The
  stash includes untracked files, not ignored intake or `.env`; back those up
  separately.

## Weekly hygiene (until DotLn does it for you)

- `npm run backup:intake` — run this whenever you capture new intake, not only
  at `finish`. `docs/intake` is gitignored and single-copy: no commit, no
  checkpoint, and no branch contains it, so a `git clean -fdx` or a forced
  worktree removal ends it. Creates a validated, owner-only ZIP beside the
  project; move it to the trusted backup location. This is a snapshot, not a
  sync: separately reconcile any worktree-staged note into main's intake.
- `git worktree list` — remove strays.
- Skim `docs/lineage/idea-ledger.md` Session additions — anything learned this
  week that belongs there?
- Ask: does the current rung still ship a visible payoff? If not, re-cut it.

## Resume command surface

The append-only control segments replace the per-work-order copy/paste ledger. In a
fresh session, use one operator phrase:

```text
resume: status
resume: times
resume: fix
resume: verify
resume: final review
resume: release close
resume: next
```

The agent first runs `npm run resume --silent -- status --json`, adding
`--work-order WO-NNN` where the selection rules above require it, then runs the matching
transition and follows the emitted authoritative paths. The JSON and human
status forms expose the same control fields, are read-only, append nothing, and
do not rewrite `docs/control/current.md`. If that human projection disagrees
with the canonical log fold, status warns and still returns the folded state;
lifecycle scripts consume JSON and never parse the Markdown. `next` means
“execute the active order” in phase `active`; in phase `closed` it reports the
other in-flight orders, or the between-work-orders state and start syntax
when none remain. `release close` is a
guarded lifecycle command rather than a control-log transition, so successful
closeout does not dirty `main` with transient release state.

From WO-028, status also shows the latest event's `recordedAt` and `elapsed`
milliseconds for the latest completed attempt of each phase. Missing endpoints
produce `unknown`; retries replace the last completed value when they finish,
and backwards clock values remain signed. These are wall-clock spans, including
waiting, not time spent actively working. `resume: times` produces the
read-only JSON observation with `recordedAt`,
`recovered-from-local-checkpoint-ref`, and `unknown` source labels and a count
of local refs read. It refuses a needed missing or mismatched ref, never edits
history or the projection, and never publishes checkpoint refs. Recovered
committer dates have second precision and are not substituted into status.

Control-time detail moved here from product 07 §Model-specific notes (WO-090,
2026-09-20). Every transition since WO-028 (2026-09-04) records host UTC
`recordedAt` at append; it is optional under schema version `1`, and old
events are never rewritten. Timing cannot order events or grant a legal
action, and status reports the latest completed attempt per phase with no
recovered-time substitution. The dated
`docs/discovery/control-event-times-2026-09-04.json` observation preserves 120
second-precision committer times and 15 unknowns from the activation log; its
refs remain unpushed. This public profile deliberately publishes timing, while
stricter profiles can omit it or declare coarser public observations. WO-126
records tokens and cost per dispatch through a separate observation channel,
CLI usage/cost envelopes and interactive transcript counters; the collector
preserves source, scope and unavailable values, never raw transcript text or a
fabricated price, and the time field itself is unchanged.

The raw command surface remains available for debugging. In the normal loop, the
operator-owned shell steps are worktree start, the printed `cd`, and the Codex
launch; agents run the remaining commands after their chat dispatches:

```bash
npm run worktree -- start WO-00N docs/work-orders/WO-00N-name.md
npm run resume --silent -- status --json # read-only machine projection
npm run resume --silent -- times         # read-only labeled time observation
npm run resume --silent -- usage --json  # read-only actor and work-order totals
npm run resume -- implementation-ready --harness <harness> --harness-version <version> --model <model> --effort <effort> --source <source>
npm run resume -- verify                 # allocates the next immutable VER-NNN
npm run resume -- verification-result pass|fail --harness <harness> --harness-version <version> --model <model> --effort <effort> --source <source>
npm run resume -- fix                    # emits original WO + failing VER paths
npm run resume -- repair-complete --harness <harness> --harness-version <version> --model <model> --effort <effort> --source <source>
npm run resume -- final-review
npm run resume -- final-review-result pass|fail --harness <harness> --harness-version <version> --model <model> --effort <effort> --source <source>
npm run worktree -- publish WO-00N --title '<title>' --body-file <contained-reviewed-body-path>
cd <main>
npm run release -- close WO-00N --dry-run # preview publication and manifest
npm run release -- close WO-00N          # prepare and validate; no publication
npm run release -- close WO-00N --publish # explicit tag + Release authority; also retry
```

Verifiers and final reviewers write the exact allocated report path and include
one `**Actor attestation:** {<normalized actor JSON>}` line beside their prose,
then run the completion command with matching flags. The command checks the
header before append; this makes report/event agreement a postcondition without
asking an immutable report to inspect its future completion event. Repair and
final-review completion actions are recorded only after their evidence exists.
Illegal transitions refuse without appending. The JSONL log is canonical;
`status --json` is the machine interface, and `docs/control/current.md` is a
disposable human projection.

## End-of-workflow release task

The canonical operator interface is `resume: release close` after you merge the
final-review PR. It authorizes `npm run release -- close WO-NNN --publish` from
main. The command proves egress, synchronizes main, checks release surfaces,
compares the regenerated pins with built runtime bytes, rebuilds missing or
mismatched runtime output once, and validates the manifest against the committed
reviewer product-gate row. It creates the annotated tag and matching GitHub
Release, then attempts worktree finish and settlement as best effort. It runs
no suite, install or CLI smoke check. See [step 5](#the-loop-per-work-order) for
the evidence identity and cleanup rules.

Worktree finish makes the same pin comparison after its fast-forward and rebuilds
before removing the merged worktree. A failed build preserves that worktree.

Without `--publish`, close may fast-forward main, fetch the latest existing release tag
when missing before choosing a close path, and rebuild missing or mismatched runtime output;
it creates no new release tag or GitHub Release. `--dry-run` previews the steps and manifest.
A deliberately deferred eligible release needs a reviewed durable reason.
Neither form pushes a main commit or publishes a package, binary, container or
hosted artifact.

Forward manifests and layered notes live in the annotated tag message; the
checked-in `v0.2.0` files remain the immutable historical exception. If Release
creation fails after the tag push, rerun the same close: the equal-version path
validates the immutable tag byte for byte, creates a missing projection, and
refuses the first differing body line without editing an existing Release.
Conflicting or moved tags refuse.

Use `npm run release -- notes vX.Y.Z` and `npm run release -- list` for offline
inspection. Historical projection is a separate operator action:
`npm run release -- publish-notes vX.Y.Z` accepts only a DotLn tag predating
WO-024 and never moves its tag or edits an existing Release. Do not backfill
`v0.1.0` without a reconstructable reviewed commit and evidence; the operator
must either run or deliberately decline backfill for later pre-WO-024 tags.
