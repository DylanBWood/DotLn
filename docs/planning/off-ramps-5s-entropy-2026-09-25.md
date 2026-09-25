# Off ramps, 5S, the Entropy Reducer and the machinery WO-111 exposed — the 2026-09-25 planning pass (WO-158 to WO-165; REVIEW-003 consumed)

Dates in this document are UTC; the pass ran on the evening of 2026-09-24
local, as did WO-111's second repair and final review. Every figure is
observed unless it says otherwise, with the file, line or command that
produced it; five read-only research reports (ignored session scratch)
gathered most of them, and the figures the orders depend on were
re-checked in this session.

## 1. What was asked, and the subject

The operator's dispatch (captured verbatim in ignored intake,
`docs/intake/notes/2026-09-25-off-ramps-5s-entropy-planning.md`, SHA-256
`c89fe7ace14a2008561acd744e7d854864a0349cea7621db1d004d293a38861a`)
asked for a standard planning pass, 5S repo management and the Entropy
Reducer; to fix what went wrong in WO-111 "with your machinery"; to come
up with off ramps or designated nonstandard work-order state pathways,
because "these ad hoc decisions are becoming routine", researched beyond
WO-111; to explain the sandbox vocabulary when nothing runs in a sandbox in
Claude Code, Copilot CLI or Codex CLI; and to remove standard pure helper
functions that files within a unit each redefine, without a new
shared-utility dependency, "DRY for the sake of improving the codebase, not
for the sake of DRY". A second message: a pushed branch and a PR when done.

Subject: `main` at `fa9957f1` (WO-111 merged and released as v0.47.1 at
01:02 UTC, before this session opened). Between work orders; the
`docs/control/current.md` projection lists WO-111 closed. Branch
`planning/2026-09-25-off-ramps-5s-entropy` from `npm run plan -- start`.

## 2. WO-111 reconstructed (observed)

Sources: the order, `docs/evidence/WO-111/*`, `VER-001` to `VER-003`,
`FINAL-001`, `docs/control/orders/WO-111.jsonl`, the fifteen checkpoint
refs and the commits `08939ce3..fa9957f1`.

Fourteen failures were classified; four were DotLn machinery, one was
machinery by design, the rest were order code or role procedure.

- **The one blocking failure was the transport (machinery).** Every live
  Codex worker or verifier launch wrote `trust_level = "trusted"` entries
  for the scratch targets into the operator's user-level Codex
  configuration (VER-001 B1, carried to VER-003), because
  `packages/skeleton/src/worker-transport.ts` lines 88–106 spawn with
  `process.env` and lines 512–552 pass no isolated `CODEX_HOME`. The
  order's criterion 6 forbade runtime changes, so the lifecycle had no
  legal route to a pass. D011 boarded it (FUP-3c34a8ffbf61376f, high,
  undisposed); D016's caller-side isolated home was declined because an
  empty home is unauthenticated; the census
  (`codex-trust-diagnosis.md` lines 9–17) attributes 36 of 43 trusted
  entries to DotLn scratch and probe families.
- **The "nonsense" was the absence of a route.** Repair 2 amended
  criterion 2 through `npm run plan -- amend-order` and generated v3
  receipts (D017); the operator rejected it as rule beating (D019); the
  order text was restored by hand, the v3 files moved to an ignored lane,
  and `docs/control/plan-refutations.jsonl` line 22 now binds an
  `orderHash` (6,128 bytes) that exists in no checkpoint or commit.
  `plan check` passes only because `scripts/lib/plan-continuation.mjs`
  lines 248–253 fail to match the row and treat the order as unchanged
  (verified: the normalized current order hash equals the row's
  `sourceOrderHash`). D020 then recorded the operator's acceptance of the
  deviation, VER-003 passed "on that basis", and the v2 receipts still
  read `criterion2: "unmet; no operator exception recorded"` (VER-002
  line 9, FINAL-001 line 17). D019 asked for "an explicit terminal
  disposition that does not claim success"; `scripts/lib/control.mjs`
  lines 57–160 fold nine event types into eight phases and have none.
- **Other machinery.** `scripts/check-registrations.mjs` classifies every
  JSONL under `docs/` as a protocol stream, so two evidence streams
  forced an edit to `packages/kernel/test/fixtures/jsonl-protocols.json`
  inside a no-package-change order (F3b); `npm test` excludes the document
  suites, so the executor's green criterion reached verification with
  `test:docs` red (F3c); `scripts/release.mjs` lines 2016–2052 print "no
  files changed" while rewriting the PR meter block (F10); harness hooks
  refused the verifier's read-only shell calls during its own gate (F9,
  by design, WO-139); the "outputs not read at current bytes" advisory
  fired on every completion event for the file the actor had just
  written (control events 4, 8, 12, 14).
- **Improvised decisions (twelve).** The material ones: VER-002 edited in
  place after its `VerificationCompleted` event at the operator's
  direction (D016); D013 withholding `repair-complete` on an invented
  cross-order dependency (corrected, D014); the D017 amendment and its
  hand reversal; D020 with no lifecycle artifact; the v0.46.3 → v0.47.1
  retiming performed in repair 2 rather than at final review (the tool
  refused a stale target); the operator running the verifier's instrument
  with `!` after the host classifier denied it (VER-002 lines 59–66).
- **Not a defect.** The three "stash commits" in `git log --all` are Git's
  stash objects from `npm run worktree -- integrate WO-111`
  (`worktree-integration.mjs` lines 474–521: push with untracked, apply,
  never drop); the branch was wholly uncommitted at final review, as the
  floor requires. `git stash list` holds eighteen entries, ten of them
  integration stashes for published orders.
- **Unknown.** The amended criterion-2 wording (preserved nowhere); which
  shell calls the gate refused; the operator's verbatim words behind
  D014, D016, D017, D019 and D020 (paraphrased in decisions); whether the
  operator's "historical file" ruling covers repair 1's edits to
  `docs/planning/critical-path-2026-09-08.md` in `f6ef3463`.

## 3. The catalog: improvised decisions across 101 orders (observed)

Sources: every `docs/evidence/WO-*/decisions.md`, every verification and
final-review report, `docs/control/orders/*.jsonl`, product 07 and the
playbook. Baseline: 101 orders; 57 straight through; 41 with at least one
failed verification; 7 failed final reviews; about 120 decision records
with a non-standard dispatch string.

| Category (orders)                                                         | Pathway today                                                          |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| A. Sibling published or `main` moved; integrate and retime (17)           | command since WO-079 (2026-09-20); hand checklist before               |
| B. Integration in a repair phase (3: WO-045, WO-099, WO-142)              | none                                                                   |
| C. Integrate helper stranded; hookless `--no-verify` commits (6, 5 orders) | partial (WO-157 fixed intent-to-add; the commits are typed by hand)   |
| D. Gate red for an outside cause, "not a finding" (7)                     | `amend-order` for order drift; "red on `main` regardless" by hand      |
| E. Flaky gate, rerun, pass on the second (4)                              | `evidence --stop` only; reruns unrecorded                              |
| F. Stale evidence edition after completion (11)                           | commands exist; routing contested (WO-147 D008 vs D010)                |
| G. Verdict, attestation or record corrected after append (7, 6 orders)   | none                                                                   |
| H. `operator override:` used inside a phase (7 uses, 5 orders)            | the mode is a command; what was done has no event                      |
| I. Scope expanded mid-order (24 orders, about 45 expansions)              | prefix and `amend-order`; two later reversed                           |
| J. Stale writer reservation (3)                                           | shipped WO-139; WO-142's reclaim may be the candidate's second case    |
| K. Read-only command refused during a live gate (8 orders, this session) | none                                                                   |
| L. Live episode refused, timed out or paid repeatedly (7)                 | WO-157 typed reasons; no retry rule                                    |
| M. Deferred item with no public target at review (2)                      | fixed (WO-157 `retarget`)                                              |
| N. Operator-owned step outstanding, "or explicitly waived" (4)            | none                                                                   |
| O. Gate must run outside a host sandbox (2)                               | WO-140 declaration; moot on this host (§6)                             |
| P. Source fix committed straight to `main` (2 commits)                    | closed for planning branches (WO-135); open for a main-checkout session |
| Q. Refutation hold overridden or disposed (3 overrides, 1 revert)         | commands                                                               |

Not documented anywhere as a pathway: a terminal failed or withdrawn
order; a correction to a recorded verdict or attestation; an operator
waiver; a recorded gate rerun; integration inside a repair phase; a
sanctioned hookless integration commit. No existing product-07 candidate
or register row proposes any of these; the candidate "immediate
working-state recovery" leaves the override event shape open.

## 4. The off-ramps (WO-158)

The design principle is the platform lens: each route is a command that
appends a typed event the fold projects, never a sentence a role is asked
to remember. Four events, four `resume` dispatches, one terminal phase,
one read-only admission:

- `CriterionWaived` (categories G, N; WO-111 D020): the operator's act,
  with the captured words; a judged criterion reads `unmet, waived by
  <ordinal>`; the executor cannot record one.
- `WorkOrderWithdrawn` with `failed | superseded | abandoned` (D019's
  terminal disposition; FUP-0108's reopen condition): terminal phase
  `withdrawn`, which leaves the sequence like a closed entry and fails a
  typed dependency.
- `RecordCorrected` (category G): attestation fields, a report path or a
  checkpoint reference; never a verdict, never report bytes. A wrong
  verdict keeps its routes (a later `VER-NNN`, a failing final review).
- `OperatorOverrideRecorded` (category H): appended by the session hook at
  `operator override: off` when the runtime can run `resume`, printed as
  an advisory command when it cannot; never a precondition.
- Read-only admission during a live gate (category K): a fixed list
  without redirect operands.

Category B, C and D routes are machinery of the integrate helper and the
runner, so they are WO-160 (§5). Category E is a report convention over
existing gate rows (both rows cited, the flake follow-up named); it needs
no event and this pass records that as a NoOp (§12). Category L keeps
WO-157's typed reasons; a retry rule waits for a second measured series.

## 5. The machinery follow-ups (WO-160) and the Codex launcher (WO-159)

The operator's "fix whatever nonsense occurred in wo-111 with your
machinery nonsense" is read as the category "every DotLn machinery defect
WO-111 exposed" and, as WO-157's authorization did on 2026-09-22, sets
aside the one-seam convention for one order. WO-160's nine items: the
amendment-row withdrawal and the reported unmatched row; `entropy subject`
skipping pre-mechanism receipts (met by this pass, §9); the truthful
`release prepare` message; evidence JSONL declared beside its evidence;
the integrate helper making its own hookless commits, admitted in a repair
phase, adopting its stash on a clean tree; `test:docs -- --against` with an
`introduced | inherited` label; integration stashes in `harness prune`;
the own-write-counts-as-read rule; the `test:docs` advisory at
`implementation-ready`. No package source changes and no edition re-mint.

WO-159 is the runtime defect itself. REVIEW-003's ER3-001 (§9) widened the
observation to seven Codex argv builders, six of them copies outside the
transport; the order builds one launcher with a per-episode home seeded
for authentication only, records before/after digests of the user-level
configuration and its trust table as protected receipt surfaces, and
adopts the launcher at the six sites. The transport is a feedback source,
so the order pays one live feedback self-host episode after its edits
settle. It must close before WO-066, WO-112 and WO-118.

## 6. Sandbox vocabulary (WO-161)

Observed: 3,853 tracked lines in 850 files contain `sandbox`; about 2,900
are immutable historical records and stay. Six senses. The host posture,
verified in this session: Claude Code's Bash sandbox is off in this
checkout (the ignored project-local settings override the user-level
default); Codex runs `approval_policy = "never"` and
`sandbox_mode = "danger-full-access"`; Copilot's configuration has no
sandbox key and the security note records it off by default.
`docs/AI-HARNESS-SECURITY.md` lines 50–52 already state this; no ADR does,
and ADR-0003, ADR-0004 and ADR-0005 still say to keep the sandbox on.

What is wrong and reaches a cold start every session: the residue clause
"native sandbox and approval remain host controls" (`CLAUDE.md` line 70,
generator `packages/compiler/src/harness.ts` line 745); the loadout
sentences "one-invocation outside-sandbox approval in Codex" and "run the
product gate outside the harness sandbox from the start"
(`packages/skeleton/src/loadouts/contributor.ts` lines 69 and 81; six
`SKILL.md` files; 1,809 bytes of sandbox lines in a reviewer or verifier
cold start); the playbook's "Keep untrusted execution inside the enabled
shell sandbox" (lines 93–95). What is misleading by name: the "gate
sandbox" (`scripts/lib/gate-sandbox.mjs`) is a fail-open detector of a
host OS sandbox that returns `inForce: false` here; it is dormant and
correct. What is accurate and stays: DotLn's discovery Seatbelt
(`sandbox-exec`, a real mechanism), and `--sandbox workspace-write` passed
to spawned Codex workers (`worker-transport.ts` lines 436 and 522). No
hook prints the word at runtime.

WO-161 rewrites the generators and regenerates; corrects the playbook, the
README, product 07 and the docs index; records the posture in an ADR
amendment; renames the detector; and touches no historical record.

## 7. 5S inventory (WO-163) and the operator's own actions

Vocabulary from product 05 §5S / 6S: Sort never deletes at first
authority; Sustain is a stated non-goal today. Measured on 2026-09-25:

| S             | Finding                                                                                                          | Disposition                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Sort          | 95 top-level scripts, 0 unreferenced; 46 test scripts, 0 unwired; 56/56 lib, 20/20 fixtures, 10/10 probes referenced; 78 evidence directories, 0 orphan | nothing to sort by reference |
| Sort          | 3 planning JSON files no receipt, check or document reads (one-shot `plan receipt --dispositions` inputs)         | WO-163 retires them through a decision                 |
| Sort          | 7 scripts referenced only from docs; 5 already retained by WO-142 row A7; WO-142 D008 and WO-099 D007 undisposed | WO-163 disposes the two                                |
| Sort          | tracked 202,792 KB; `docs/evidence` 148,788 KB (73%); since WO-154 a new self-host log is about 72 KB            | NoOp on a ceiling (map candidate 5)                    |
| Sort          | local residue: `.runtime` 158 MB, `docs/control/local` 136 MB; `harness prune` preview 207 candidates, 146.9 MB  | the operator runs `--apply` after reading the listing  |
| Set in order  | 3 import-only top-level scripts (6 importers); a command block in `scripts/lib/release-fixtures.mjs` line 150   | WO-163                                                 |
| Set in order  | `docs/README.md` map missing 5 entries                                                                           | added by this pass                                     |
| Set in order  | 6 non-`node:test` files in the `test-*` namespace                                                                | 4 renames folded into WO-162's file set; 2 are runners |
| Shine         | 0 real TODO/FIXME/HACK; `followups.json` (1.28 MB) machine-written but not marked generated                      | WO-163 adds the attribute row                          |
| Standardize   | 5 root-discovery patterns over 140 files; 4 or more argument-parsing patterns over 47 entrypoints; 6 test-naming families | recorded; not an order (map candidate 6)        |
| Sustain       | no check for orphan scripts, the index map, evidence growth or planning retirement                                | NoOp with reopening conditions (map candidates 4 to 6) |

## 8. Reduce, reuse, recycle (WO-162)

Per unit, never across units. Kernel and console are clean. Compiler: one
cheap real duplicate (`compile.ts` lines 38 and 41 re-declare
`compareText` and `orderedUnique` from a module it imports); the inlined
hook-source helpers are justified by build-free recovery. Scripts (one
unit, `scripts/*.mjs` plus `scripts/lib`, 139 files): seventeen files
define a local Git wrapper and none imports `scripts/lib/git.mjs`
`runGit` (about 286 call sites; seven are the exact shape); twenty files
define the same mkdir-then-write fixture helper (about 635 call sites,
fourteen byte-identical); nine identical pretty-JSON definers plus 44
inline sites; `entropy-review.mjs` clones six helpers from
`plan-receipts.mjs` (with one name collision, `validReceiptId`, that must
stay separate); five named JSON readers duplicate `paths.mjs`; eight
bare-hex digest copies sit beside an exported `sha256` that returns a
prefixed string. Skeleton: `object`, `exact` and `check` are byte-identical
across five protocol files, every one a feedback source, so the
consolidation would spend a live episode for a refactor and is a map
candidate instead.

Divergences found, decided not merged: three `inside` containment
helpers with different semantics; a key-order-sensitive `same` in
`plan-continuation.mjs` beside two canonical ones; four control-character
classes across the scripts `text` validators and three across the
skeleton protocols; two `closesFence` rules. WO-162 records one decision
per divergence and names any latent defect as a follow-up.

## 9. REVIEW-003: the review, its refutation, dispositions and routes

`npm run entropy -- subject` returned `action: consume` naming REVIEW-001
(2026-09-04) with `receiptPath` and `refutationPath` both
`docs/instance/entropy-reducer/runs/undefined.md`: the pre-mechanism
receipt has no `receiptId`, the disposed set in `unconsumedReview` is
keyed by that field, and the WO-151 record calls the pair pre-mechanism.
REFUTATION-001's table records each of its seven findings repaired inside
WO-023. The pass therefore read the subject as "no filed review is both
refuted and undisposed" and paid for a fresh episode, against the explicit
HEAD commit so that planning edits could proceed while it ran (the
explicit route records working-tree drift instead of refusing it). The
defect is WO-160 item 2.

- REVIEW-003: `claude-cli-print`, claude-opus-5-5 at xhigh, Claude Code
  2.1.282, 1,089 s, 139 turns, USD 6.99, zero permission denials, tracked
  status byte-identical; three measured findings, no inspection findings,
  three proposal packets.
- REFUTATION-004: 178 s, 20 turns, USD 0.80; all three selected, all
  three survived, none refuted, blocked or unselected.
- Dispositions, all in this pass: ER3-001 accepted → WO-159; ER3-002
  accepted → WO-164 (FUP-7f9a27e6ed6c44b3's reopening observation, a
  console collection above ten seconds, has occurred: 18.4 to 19.1 s);
  ER3-003 accepted → WO-165; the three packets accepted and filed under
  `docs/proposals/` as the orders' design records. The generated rows are
  [`entropy-reviews/REVIEW-003.md`](entropy-reviews/REVIEW-003.md); the
  map's REVIEW-003 section carries the routes and reopening observations.

## 10. The sequence

Seven closed entries leave (WO-157, WO-153 to WO-156, WO-111, WO-114).
Eight orders are filed:

| Slot                         | Pair                                                   | Why here                                                                                     |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| head                         | WO-158 off-ramps; WO-159 Codex launcher                | every later order pays their absence; WO-159 gates any Codex worker on an operator repository |
| second                       | WO-160 WO-111 machinery; WO-161 sandbox vocabulary     | the same reason; disjoint from the head pair's files except sequentially                     |
| third (unchanged)            | WO-070; WO-115                                         | the critical path keeps its next slot                                                        |
| fourth                       | WO-164 console collection; WO-165 reducer route        | REVIEW-003's remaining findings; the gate's critical path                                    |
| fifth                        | WO-162 helper reuse; WO-163 5S                         | maintenance after delivery; cheaper before more copies accrue than after                     |

Inside each pair the two orders name disjoint files and share no hard edge.
Both orders of the head pair re-mint editions; the second integration
re-mints once more, deterministically (WO-154). WO-161 must not run beside
WO-158 (same generators); WO-162 and WO-165 run after WO-160 (shared
files); WO-164 after WO-158 and WO-160. The sequence is 49 queued entries
and 8,853 bytes, within the 2026-09-22 acceptance of 12,369.

## 11. The register

Rows this pass disposes (each with its reason and reopening condition in
`followups.json`): FUP-3c34a8ffbf61376f allocated to WO-159;
FUP-f3281eb085ad87a7 and FUP-dcadda81305b4fb7 duplicates of it (D016's
route was tried and declined; D017 is superseded and its row withdrawal is
WO-160 item 1); FUP-e468ee64ac00c70a allocated to WO-158 and WO-160 (the
terminal disposition and the amendment withdrawal); FUP-7dbf4e832a8fb124
settled (D018 records the enumeration correction; the second-window
snapshot list stays a disclosed defect until a rerun warrants an edition);
FUP-eba6a79fc106bd28 allocated to WO-158; FUP-fd5f7c2b91095343 allocated
to WO-160; FUP-7f9a27e6ed6c44b3 allocated to WO-164 on its reopening
observation; FUP-4050fe828a686c1e (WO-142 D008) allocated to WO-163.
Rows WO-111's scope expansion returned to review (FUP-0083, FUP-0108,
FUP-0110) and the cold-gate row (FUP-b8a329d9970b8206) are re-settled or
re-allocated at their current revision with the WO-111, WO-114 and WO-156
write-backs named. Untouched rows persist.

## 12. Declined alternatives — the NoOp register of this pass

- **A generic exception event** instead of four. NoOp reason: legality and
  projection differ per route; one event would carry a discriminator and
  the same four rules. Reopen: a fifth route with the same legality as an
  existing one.
- **A recorded gate-rerun event** (category E). NoOp: the gate rows exist
  in the local lane and the report convention can cite both; an event
  adds a mechanism with no removal. Reopen: a rerun whose rows a reviewer
  cannot find.
- **A live-episode retry rule** (category L). NoOp: seven observations
  across four causes; WO-157's typed reasons are the first measurement.
  Reopen: a second series with one typed cause dominating.
- **Folding `test:docs` into `npm test`.** NoOp: the product gate is the
  reviewer's cost; an advisory at completion and the criterion convention
  cover the executor. Reopen: a second order reaches verification with a
  red document gate after WO-160 closes.
- **Deleting `REVIEW-001*`.** NoOp: pre-mechanism evidence keeps its bytes
  (WO-151). Reopen: never.
- **Putting the DRY and 5S pair at the head.** NoOp: neither enables a
  critical-path outcome; the copies cost little per day; the delivery pair
  has waited since 2026-09-16 behind machinery. Reopen: the operator says
  so, or an order in the third pair meets a helper divergence as a defect.
- **The skeleton validator kit in WO-162.** NoOp: a live feedback episode
  for a refactor. Reopen: map candidate 1.
- **Renaming the gate-sandbox check-row identity strings.** Deferred to
  the executor's decision inside WO-161: consumers of `needs`/`partial`
  values are recorded rows. Reopen: WO-161's decision.
- **Archiving consumed planning passes; an evidence byte ceiling; new
  sustaining checks; a UTC/local date rule; the host classifier
  denial.** Map candidates 4 to 8 with their reopening observations.
- **A WO-111 rerun.** Not this pass's to order; WO-159 unblocks it and the
  operator decides. Reopen: WO-159 closes.

## 13. Goal alignment

Mission and critical path: the resident's unattended hour is proven
(WO-111); the next outcomes are the console truth (WO-070, WO-115) and
the first Codex worker on a repository the operator owns (WO-066,
WO-112, WO-118). WO-159 is a precondition the last of these cannot skip.
WO-158 and WO-160 remove recurring operator rescue from every order after
them; the catalog shows the rescue is routine, which is the operator's
complaint.

Traps, where material: **shifting the burden** is the pass's subject
(every improvisation was an operator rescue); the routes remove it.
**Escalation**: four events and one list are the smallest set that covers
the catalog; the NoOps above decline three more mechanisms. **Rule
beating**: `CriterionWaived` records an unmet criterion as unmet and
names the operator's words; it cannot be recorded by the executor; a
verdict is never corrected, only superseded. **Drift to low performance**:
the same pattern (machinery inserted ahead of delivery) recurs in every
pass since 2026-09-16 and is named in §10 and §12; the delivery pair keeps
its slot behind two pairs, not five. **Policy resistance**: the read-only
admission during a live gate loosens a WO-139 refusal for a fixed list
only; writes keep their refusal. **Tragedy of the commons**: this pass
spent five research agents (about 1.04 million subagent tokens), one
review episode (USD 6.99) and one refutation (USD 0.80); the removals in
each order's Cost line are measured. **Success to the successful** and
**seeking the wrong goal**: immaterial here; the orders reduce ceremony
rather than add it, and each names its measured removal.

Naive Interventionism: the existing fold, `amend-order`, the integrate
helper and the gate detector keep their functions; every change is
additive or a rename with historical bytes preserved; the smallest probes
are the fixtures each order names. NoOp is §12.

Platform lens: each route is an event something else consumes (the fold,
the status projection, the index, the sequence check); the launcher is
one interface the transport and six scripts consume; the labels are
externalizable (no private setting is a source of a guarantee); every
result is readable by a stranger through `resume status`.

## 14. Evidence and cost of this pass

- Research: five read-only agents against the subject, 227,783 + 253,075
  + 175,453 + 198,332 + 183,134 subagent tokens (harness readback), 652
  to 1,141 s each, reports in ignored session scratch; six of twenty
  subagent admissions planned, six used including the planning refuter.
- Entropy: REVIEW-003 1,089 s, USD 6.99; REFUTATION-004 178 s, USD 0.80
  (result envelopes; tokens unknown, cause harness-no-readback).
- Session usage at the last hook readback before drafting: 1,435,056
  total tokens (1,272,942 cached input) at 01:15 UTC, source
  claude-transcript-message-usage, scope dispatch; the handoff figure is
  in the response.
- Documents: eight orders; the sequence; the map (two sections); the
  ledger section; product 07 (three paragraphs); the docs index; this
  document; the register dispositions; the generated index, cost table and
  review rows.

## 15. Reversal conditions for this plan

- A session records a situation the four routes cannot express (§4).
- An isolated Codex launch still changes the user-level configuration
  (WO-159's stop condition).
- The document gate's critical path moves elsewhere before WO-164 runs.
- The operator enables a host sandbox in any CLI (WO-161's premise).
- A helper consolidation changes a stored digest or a fixture output
  (WO-162's byte-identity criterion).
- The operator moves the delivery pair above the head pairs.

## 16. Independent review

Filled by the pass after the refutation receipt is filed.
