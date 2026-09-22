# WO-151 FINAL-001 — final review

**Verdict:** pass. All nine acceptance criteria are met on the integrated,
staged subject. The two-report verification sequence is sound, and I reproduced
its consequential claims from the receipt bytes and the source rather than
taking them on trust. Two product-gate failures met during this review are
fixed here, inside shared test registries, and re-gated
([WO-151-D021](../../evidence/WO-151/decisions.md#wo-151-d021)); one defect is
boarded up with a named follow-up rather than repaired
([WO-151-D020](../../evidence/WO-151/decisions.md#wo-151-d020)). The order text
differs from the judged authority by exactly its release assignment and the
operator-authorized scope expansion, and nothing else.

**Subject:**
[`docs/work-orders/WO-151-entropy-reducer-dispatch.md`](../../work-orders/WO-151-entropy-reducer-dispatch.md)
on branch `wo-151`. The bases moved during this review: the branch carried no
commits of its own at `5b4b99cab19e` while `origin/main` had advanced five
commits to `48322e9a2f9a` (WO-152 merged, `v0.41.1` staged with skeleton
`0.35.1`), so this review integrated before judging anything. The reviewed work
is the staged working tree at code identity
`d9dfedf5301cb8ad131702e6d7cc9e9547562f8e3de2c68163578a146bcb9818`, tree
`edf76d76de7e337d1a8611f0d36f9b3e925d4961`, with recovery at
`refs/dotln/checkpoint/WO-151/10` (`c67624d5f88f`) and the named stash
`851ca543a4bf` (`WO-151 integrate 2026-09-22`) retained.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"unknown","source":"operator-attested"}

Human actor: the operator dispatched `resume: final review` in an attended
Claude Code session; the harness recorded `npm run resume -- final-review`
before this procedure loaded. The harness version is CLI readback from
`claude --version`; the model is the session's own declaration. The effort is
`unknown` because this harness exposes no effective-effort readback and nobody
supplied a value for this dispatch — it is not silently carried over from the
executor's attestation. The order requires `reviewer any`, so no effort drift
arises. Fan-out plan, stated before any spawn: zero subagents, against a
`subagentCap` of 20. The harness reports `count` 0, `countKind`
`exact-observed`, 20 remaining, 0 unresolved admissions and 0 unlinked
children; the uncounted remainder is unknown. Two background tasks were
dispatched: the first product gate, observed to completion at 455,155 ms, and a
duplicate gate invocation I stopped at 2026-09-22T16:10 before it recorded
anything.

**Process cost:** entry 83993 tokens; handoff 22455944 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from
`node scripts/harness.mjs usage fac4814f-b1d7-4228-893e-6ff193d58fa4`, taken at
2026-09-22T15:24:22.408Z and 2026-09-22T16:14:38.179Z. Reasoning-output tokens
and dollar cost are unknown in this harness — unknown, not zero. The handoff
figure is dominated by cached input across two serial product gates, and the
avoidable part is mine to state: I issued the second `npm test -- --review` in
the same command as the first, then stopped it after 455 s of the first had
already produced the recorded row, so roughly four minutes of wall clock bought
nothing. The 455 s gate itself was not avoidable: criterion 9 requires it, the
28 s document gate and the 2 s focused fixture are cheaper but check different
things, and the two failures this review found were only visible to the
`--review` selection.

## Goal-aligned judgment

The mission contribution is legible and the NoOp is expensive. Since 2026-09-04
the Entropy Reducer has been a compiled loadout with five typed APIs and no
caller: `compileReviewerWorkOrder`, `validateReviewerOutput`,
`prepareReportEmit`, `selectFindingsForRefutation` and `buildRefutationReport`
appear nowhere outside `entropy-reducer.ts` and its two tests, and 121 orders
closed without a single review, because the operator guide asked a session to
perform five steps by hand. NoOp keeps that. This order gives the loadout one
dispatch host, and the host is the smallest thing that discharges the gap: it
freezes a subject, carries the compiled plan to one fresh worker, binds the
return with the loadout's own validators, numbers immutable receipts and stops
at the operator's disposition. The loadout, its residue, actor pin, authority
envelope and Program are inputs, not edits, and `Program.All` stays deferred.

Against the eight traps. **Escalation** is bounded to a command family and a
control log; the order's declined alternatives refused a role, a role skill, a
scheduler, a cadence and a `lifecycle.run` classification, and the one
expansion that did land — the `planning: entropy reducer` phrase — is a clause
of the existing planner role, authorized in writing and recorded in the
planning log. **Tragedy of the commons** and **drift to low performance** are
checked by consume-before-produce: `entropy subject` names a filed, refuted,
undisposed review rather than buying a USD 9.50 episode, which is the
difference between a capability and a standing bill. **Policy resistance** is
checked by binding the generated authority bundle after the bytes settled, and
by refusing a dirty tree rather than admitting a bypass flag. **Rule beating**
is checked in the one place it would show: the receipt records what it observed
and labels what it did not, and D010 corrected a cost line that wrote `unknown`
beside a dollar figure the same object carried. **Shifting the burden** is
reduced by the single-pointer guard, which keeps a paid episode reachable
instead of leaving the operator to find an orphaned scratch copy.
**Success-to-the-successful** is checked by retaining both transports, the
background route and the five manual steps as a recorded fallback. **Seeking
the wrong goal** is the live risk: receipt count is not the goal, disposed
findings are, and this order deliberately files two live receipts and disposes
nothing, leaving that act to the pass the phrase opens.

Against **Naive Interventionism**, the two fixes I made here are the smallest
that close a red gate — one JSON row and one string in a fixture's stub list —
and the defect I did not fix is one whose smallest honest repair is a design
choice about what the subject is, which belongs to a planning pass and not to a
reviewer's cleanup allowance.

## Authority: the order text against the judged text

The judged planning subject's order bytes are recoverable and I compared them
directly. `refs/dotln/checkpoint/WO-151/1` holds
`sha256:578aea3f541b4f5dc61cc98984da0330318915c013524165814a96f943e035ad`,
which is exactly the `judgedSourceHash` `npm run plan -- check` reports for
WO-151. Diffed against the current file, the whole delta is two things: the
release assignment in the title (`version assigned at activation` → `v0.42.0`)
and the operator scope expansion — the non-goal clause `a new dispatch phrase,
role or role skill` narrowed to `a new role or role skill`, plus the paragraph
that states the expansion, its bounds and its authorization. No objective,
criterion, design bullet or non-goal moved otherwise.

That expansion is bound where it should be. `docs/control/plan-refutations.jsonl`
carries a `PlanExecutionAmended` row recorded 2026-09-22T13:10:52.591Z against
receipt `2026-09-22-planning-9244f56be13bcb2f-024`, citing decision
`WO-151-D007` and its reason. The row bound 23,017 order bytes; the file has
been 23,010 bytes and byte-identical since `refs/dotln/checkpoint/WO-151/2` at
13:44:48Z, through checkpoint 10. What those seven bytes were is **unknown**: no
retained ref holds the 23,017-byte version, and I will not guess at it. The
edit is inside the same dispatch and `npm run plan -- check` exits 0, reporting
the difference as an `authorized-execution-amendment` workspace update — the
same channel in which it reports WO-120's and WO-063's ordinary release
assignments. The authorization is recorded, its bounds are stated, and the
delivered surfaces match those bounds: one procedure line in
`contributor.ts`, one paragraph in product 07, the amended non-goal, and D007.

## The verification sequence

Two reports, and the sequence is coherent rather than a rubber stamp.
[VER-001](../../verifications/WO-151/VER-001.md) failed with three major
findings, each with a reproduction; the repair closed all three and
[VER-002](../../verifications/WO-151/VER-002.md) passed on the repaired
subject. Both ran on Codex CLI 0.155.1 / `gpt-5.6-sol` at `xhigh` with real
session readback — a different harness and model from the
Claude Code executor, and different again from this reviewer.

I re-derived the three closures from the artifacts, not from the report:

- **Finding 1, orphaned pending dispatch.** `requireNoPending()` is called
  before `freezeSubject()` on both the review and the refutation route
  (`scripts/lib/entropy-review.mjs`), and it refuses on the presence of any
  open dispatch of that kind rather than on subject-hash equality, which was
  the hole. The refusal names the episode, subject prefix, frozen copy and both
  recovery commands.
- **Finding 2, stale authority edition.** `docs/evidence/current.json` selects
  WO-151 revision 002 and `node scripts/authority-evidence.mjs --check` exits 0
  over 34 bundle comparisons — after this review's integration, not only
  before it.
- **Finding 3, missing refutation after-state.** `REFUTATION-003.json` carries
  `trackedStatusBeforeSha256` and `trackedStatusAfterSha256` both
  `349dc6df08f13eed…` with `trackedStatusByteIdentical: true`, a frozen-copy
  inventory of 2,971 paths before and 3,811 after, `permissionDenials` 0 with
  an empty `deniedTools` list, and four independently attempted survivors.

VER-002's one substantive limit is honest and I share it: the live worker
episodes are evidence inputs, not certification of the host that launched them.
Its criterion 9 claim is the one place the sequence did not bind what ships,
and that is the subject of the next section — not because the verifier was
careless, but because the two suites that fail were not in the set its run
selected and one of the failing inputs was still untracked.

## Defects met in this review

**Two red suites on the staged, integrated tree — fixed here and re-gated.**
With every intended file staged, `npm test -- --review` reported **32 passed,
2 failed, 460.01 s, 78 fresh tasks**:

- `kernel` test 89, `WO-045 committed EventEnvelope streams decode and
  round-trip byte-identically`. `git ls-files` now lists
  `docs/control/entropy-reducer.jsonl`, whose `EntropyReviewFiled` events are
  not `EventEnvelope`s and which no registry classified. Every earlier gate
  missed it for a stated reason: the control log was untracked, so `ls-files`
  did not see it.
- `runner-fixtures` test 25, `only and document CLI selection execute their
  declared checks with the projection build`, failing `1 !== 0` at
  `scripts/test-runner.test.mjs:663`. That fixture writes a stub for every
  document-suite script into a temporary launchpad and had none for
  `scripts/entropy.mjs`, so its nested document gate reported 19 passed, 1
  failed with an entropy module-resolution crash. `runner-fixtures` is not
  selected by the source set the executor's and verifier's runs changed.

Both are the registration a new committed artifact and a new document suite owe
to checks that enumerate them, and both fixes are one line in a named shared
path: `docs/control/entropy-reducer.jsonl` classified as `Entropy Reducer
receipt control` beside the planning refutation log it mirrors, and
`entropy.mjs` added to the fixture's stub list. Neither touches the dispatch
host, the loadout, a receipt or any acceptance behaviour. The before-and-after
is directly observed: both tests failed on the recorded run above and pass
individually after the change, and the re-gate is green. The reasoning,
including the four alternatives declined — among them failing the review and
routing two registry rows through a repair cycle — is
[D021](../../evidence/WO-151/decisions.md#wo-151-d021).

**One defect boarded up, not repaired.** The episode confinement witness is
coarser than the receipt's own wording.
`trackedStatus()` runs `git status --porcelain --untracked-files=no`, so a
shell command that creates a new untracked file in the source repository leaves
`trackedStatusByteIdentical` true; and `scratchDelta.deltaCount` is
`Math.abs(after.count - before.count)`, a net path count, so a frozen copy that
gains and loses the same number of paths reads as a zero delta, and an in-place
edit of equal length moves neither count nor the path-and-size inventory hash.
The receipt says the episode was "checked by the tracked-status hash on either
side", and the security document says the same; both claim a little more than
the check performs. Nothing in this order's acceptance depends on the finer
witness, both status hashes and both inventory hashes are in every receipt, and
the two live episodes are unaffected as evidence. I did not repair it because
the honest repairs are not small: widening the status witness to untracked
paths would make the default clean-`HEAD` route refuse its own receipts
whenever the dispatching session writes an untracked evidence file during an
episode — this order's own executor did — and replacing the net count with
changed-path sets changes the receipt shape after three pairs are already bound
by SHA-256, which D016 showed needs a second conditional field and its own
fixture. That trade is a decision about what the subject is.
[D020](../../evidence/WO-151/decisions.md#wo-151-d020) records it with a named
follow-up and its reopening condition.

## Criterion 1 — freeze, compile and retain one recoverable dispatch. Met.

The default route resolves `HEAD`, refuses a dirty tree by path with the count
of differing tracked paths and the two ways forward, freezes a copy — a clone
plus a `node_modules` copy, never a link or a shared worktree — under the
launchpad-keyed system-temp lane, records the tracked-status hash and a
path-and-size inventory, and compiles the reviewer for that repository and base
with a fresh episode id and a finite 24-hour window. The canonical prompt
carries the residue reference, the four lens briefs, the operator's optional
concern, the frozen subject path and the closed schema, and the pending
dispatch is retained either way. The repaired `requireNoPending()` guard sits
before the clone on both routes, so a refusal costs no 250 MB copy.

## Criterion 2 — attestation as a fact. Met.

`buildAttestation` grants `entropy-reducer@1` only when a launched
`claude-cli-print` route recorded
`command-line-readback-and-invocation` and the harness, model and effort all
match the compiled requirement; every other shape is `substitute reviewer` with
its reason, and `effectiveModel`/`effectiveEffort` are `unknown` on all of
them, which is the truth no harness contradicts. Both live receipts read
`entropy-reducer@1` on claude-code 2.1.278 at `claude-fable-5-1`/`max`. The
focused fixture covers pinned, substitute, background and operator-attested
shapes.

## Criterion 3 — validation and immutable filing. Met, with the recorded route adaptation.

The host validates through the loadout's `validateReviewerOutput` against the
pending work order and episode, retains a rejected return with its statement
under the local control lane, files the next unused number as an immutable
JSON/Markdown pair, and binds both hashes in the control log. On the default
route a moved tracked status refuses the receipt. On the explicit-commit route
the subject is the named commit, bound by requiring the same tree object in
both repositories, with working-tree drift recorded as
`trackedStatusByteIdentical: false` rather than hidden. I agree with VER-001
and VER-002 that this is the criterion's functional intent rather than a
weakening: D002 and D009 record why the strict guard makes the live row
unobtainable for an executor that may not commit before final review, and
REVIEW-002 states the drift instead of laundering it.

## Criterion 4 — blinded refutation and bound report. Met.

`REFUTATION-003`'s `blinding` block records four measured subjects, zero
inspection subjects, and the five things withheld; the report carries a
measured denominator of 4, a `not-applicable` by-inspection denominator, four
attempts, and empty refuted, blocked and unselected sets, all preserved rather
than collapsed into a pass. The zero-denominator branch was exercised live, not
only in fixture.

## Criterion 5 — disposition and the planning handoff. Met.

`accept` on a finding requires `survived`; `unrefuted`, `refuted`, `blocked`,
`unselected` and unknown identifiers are each refused with their own message.
An acceptance appends a formal candidate heading and item to
`docs/planning/entropy-reviews/REVIEW-NNN.md`, which the follow-up collector
harvests and `npm run meta` lists as a register row; a packet acceptance files
`docs/proposals/<suggestionId>/packet.json` with a traversal-safe identifier
check and a `wx` write that never overwrites. The fixture walks all of it. No
live disposition was fabricated, which is correct: criterion 7 makes
dispositions a reopening observation and D007 places them inside the pass the
phrase opens.

## Criterion 6 — immutability check and executable fixture. Met.

`entropy check` recomputes each receipt hash, re-renders each Markdown
projection and compares it, checks both against the hashes its control event
bound, enforces the receipt chain's `previousReceiptHash`, refuses a filed pair
with no event, refuses a committed fixture receipt, and reports a trailing
event whose pair never landed as `interrupted-filing` rather than reddening the
shared gate for unrelated orders. Against this repository it returns `status:
ok` with REVIEW-002, REFUTATION-002 and REFUTATION-003 bound and the two
2026-09-04 pairs reported as pre-mechanism — classified by their own
`schemaVersion` rather than by number, which D005 shows was a real hole in a
fresh launchpad. The row runs in `npm run test:docs` (20 passed, 0 failed, with
`PASS entropy`), and after this review's fix it also runs inside the runner's
own CLI-selection fixture.

## Criterion 7 — the live pinned row. Met.

`REVIEW-002` is a live pinned review of the activation commit: 993.4 s, 64
turns, USD 9.4975 list, four findings all `measured`, zero denied tool calls.
`REFUTATION-003` is the live pinned refutation at the repaired receipt shape:
458 s, 21 turns, USD 2.8989 list, byte-identical tracked status, an 840-path
inventoried scratch delta, zero denials. The Cost line's expected benefit is
therefore measured and not merely expected: 0 denials against REVIEW-001's 7,
and 4 of 4 findings measured against 1 of 7. The operator's authorization of
the external CLI launch is recorded, `REFUTATION-002` keeps its bytes as the
first live refutation, and the repeat is justified because its frozen copy was
removed at filing and the after-state cannot be computed retroactively.

## Criterion 8 — write-backs and current editions. Met.

The operator guide describes the command path and retains the five manual steps
verbatim as the recorded fallback; product 03 and 05 name the dispatch and the
substitute rule; the PLAYBOOK row's actor cell names the command and the
substitute label; the security document records the launch line and, unusually
and correctly, states plainly that Claude does not path-confine a shell command
and that half the boundary is instructed rather than enforced; product 07 gains
the `planning: entropy reducer` paragraph. Authority revision 002 and feedback
revision 001 both check clean after integration, both publication editions are
CURRENT at 30 and 45 linked sections with 274/274 headings indexed, and the
document gate reports the new row against 20 fresh tasks.

## Criterion 9 — gate, whitespace, dependencies and identity. Met.

- `npm test -- --review`: **34 passed, 0 failed, 455.15 s, 78 fresh tasks,
  exit 0**, tree `edf76d76de7e337d1a8611f0d36f9b3e925d4961`, code identity
  `d9dfedf5301cb8ad131702e6d7cc9e9547562f8e3de2c68163578a146bcb9818`, recorded
  2026-09-22T16:07:12.470Z with the sandbox not in force.
- `npm run test:docs`: 20 passed, 0 failed, 28.16 s.
- `git diff --check` and `git diff --cached --check`: clean.
- `packages/skeleton/src/loadouts/entropy-reducer.ts`, `RESIDUE.md` and
  `REFUTATION-PLAN.md`: byte-identical to `main`.
- `node scripts/artifact-identity-evidence.mjs --check`: passes, reporting the
  versioned Entropy Reducer matching its current recorded fixture, so the
  semantic hash is unmoved.
- No external dependency added: the diff against `main` adds no dependency
  entry, and the lockfile moves only the internal skeleton and console versions
  and the console's exact workspace pin.
- No lint, type, formatter or coverage suppression directive appears anywhere
  in the added source.

## Integration, retime and carried-forward claims

`main` advanced five commits during this order, so the branch was integrated as
a fast-forward before anything was judged and **no acceptance claim is
inherited across the moved base**: every gate and check reported above ran
after the integration. Four authored collisions, all version collisions: WO-152
staged `v0.41.1` with skeleton `0.35.1` for its mission-check schema change,
and this order stages `v0.42.0` with skeleton `0.36.0` for two new request
kinds. I kept `0.36.0` in both manifests and both lockfile locations with the
console's pin following it, because it is the higher version and contains the
upstream change; taking `0.35.1` would publish two new request kinds under a
patch. The fourth collision is `docs/evidence/current.json`, where WO-152
re-minted both editions at its own identity: I kept this order's selection
because both checks pass against the *integrated* bundle, which makes it a fact
rather than a preference, and declined to mint a revision 003 that would record
no new observation. WO-152's editions keep their bytes.

Changed evidence inputs assessed: `mission-check-protocol.ts`, its fixture and
test, and the console self-host fixtures. None is an input to this order's
protocol, host, receipts or loadout, and the suites that consume them are in
the green gate above. The release assignment does not move — the next minor
above `v0.41.1` is still `v0.42.0` — and the roadmap's release record was
retimed to name the `v0.41.1` tag this review integrated, under the existing
minor classification. [D019](../../evidence/WO-151/decisions.md#wo-151-d019)
carries the completed record.

## Clean-room screen and the ideation receipt

The ideation receipt is
[`2026-09-22-planning-9244f56be13bcb2f-024`](../../planning/refutations/2026-09-22-planning-9244f56be13bcb2f-024.md),
verdict `aligned-with-findings` with no holds, judged at committed revision
`7dc14bd38191` by a direct harness session whose model and effort are recorded
as unknown and whose independence is session-attested — a limit the receipt
states itself rather than one I discovered. Its five known issues against
WO-151 are each addressed on the delivered surfaces, and I checked them one by
one rather than accepting the executor's account:

1. *No gated outcome named.* The decisions preamble now names the outcome the
   accepted findings serve — the next planning pass reading
   `docs/planning/entropy-reviews/` rows — and says plainly that it is not a
   shipping gate.
2. *The measured-evidence benefit is checked by no criterion.* The receipt's
   reopening condition asked for the restricted flag, the denial count and the
   measured-versus-inspection split compared with REVIEW-001's 1 of 7. All
   three are recorded, and the comparison is made.
3. *A substitute reviewer could satisfy the live row.* Not triggered: both live
   receipts read `entropy-reducer@1`.
4. *Filing and its control event are not atomic.* D004 inverted the order and
   made the only reachable inconsistency a trailing event, reported as
   `interrupted-filing` instead of failing the shared gate — which is exactly
   what the receipt asked for.
5. *One more step on a rising gate series.* Reported, as criterion 8 requires;
   `npm run meta` lists `gateStepCount 69` with insufficient worsening
   evidence and no reopen candidate.

Clean-room screen: the diff imports no employer code, configuration,
identifier, internal service, credential or secret; `docs/intake/` is untouched
and still ignored; the ledger holds no lifecycle append, and the order's
inherited ledger duty is discharged by its decisions file and index row. One
observation, stated rather than fixed: the three committed receipts record
`subject.repository` and `subject.scratchRepository` as literal absolute paths,
including the machine's per-user system-temp token. That is not employer
material and it matches ten other committed documents in this repository that
already carry `/var/folders/…` paths, but these are the first *generated*
surfaces to carry one, and every future receipt will. It is the operator's call
whether receipts should name their grant rather than its value; I have not
manufactured a follow-up for a practice the repository has already settled.

## Limits carried forward

- The confinement witness is coarser than the receipt's wording
  ([D020](../../evidence/WO-151/decisions.md#wo-151-d020)), with a named
  follow-up.
- Both live refuters returned their typed attempts payload as the public
  session statement rather than prose, so that field adds nothing the bound
  report does not already carry
  ([D017](../../evidence/WO-151/decisions.md#wo-151-d017)).
- `entropy-review-protocol.ts` changes the compiled behaviour of registered
  evidence sources without being registered itself, as
  `mission-check-protocol.ts` already does
  ([D001](../../evidence/WO-151/decisions.md#wo-151-d001)).
- `REVIEW-002`'s rendered cost line says `unknown` where its own JSON records
  USD 9.4975; the receipt is immutable and later receipts carry the corrected
  form ([D010](../../evidence/WO-151/decisions.md#wo-151-d010)).
- The host supports one pending dispatch per kind, not a concurrent addressable
  set ([D015](../../evidence/WO-151/decisions.md#wo-151-d015)).
- The phrase is the only thing that invokes the reviewer, so it still depends
  on the operator typing it
  ([D007](../../evidence/WO-151/decisions.md#wo-151-d007)).
- Effective worker model and effort remain `unknown` on every route; a launch
  selection is not a readback.

This report authorizes committing the reviewed state, pushing the `wo-151`
branch and opening its pull request. It authorizes no merge, no release, no tag
and no operator disposition.

## Reproduction

From `/Users/dylanwood/Projects/DotLn-wo151` on branch `wo-151`:

```text
npm run build --silent
npm test -- --review
npm run test:docs
npm run entropy -- check
npm run entropy -- subject
node scripts/authority-evidence.mjs --check
node scripts/feedback-evidence.mjs --check
node scripts/artifact-identity-evidence.mjs --check
node scripts/harness.mjs check
npm run publication:check
npm run release -- check-surfaces --local
npm run work-orders -- index --check
npm run plan -- check
npm run format:check
git diff --check && git diff --cached --check
```
