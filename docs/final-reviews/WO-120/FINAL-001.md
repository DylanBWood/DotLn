# WO-120 FINAL-001 — final review

**Verdict:** pass. The subject meets all six acceptance criteria, the single
verification in the sequence is sound and I reproduced its consequential claims
rather than taking them on trust, and the order's text is byte-identical to the
activated authority except for the release assignment its own decision records.
One defect met during review is fixed here inside the order's own diff and
re-gated ([WO-120-D006](../../evidence/WO-120/decisions.md#wo-120-d006)); one is
boarded up with a named follow-up rather than repaired
([WO-120-D007](../../evidence/WO-120/decisions.md#wo-120-d007)).

**Subject:**
[`docs/work-orders/WO-120-derived-work-identity.md`](../../work-orders/WO-120-derived-work-identity.md)
on branch `wo-120`. The bases moved during this review: the branch was at
`532059e38ec3` and `origin/main` had advanced three commits to `0a23a611fa2b`,
so this review integrated before judging. The reviewed work is the staged
working tree at code identity
`8b79bbb74e595f02d49c2feb4abb0f3d5f38d0dba68d47ae6680db708b6616c1`, tree
`24b99454fd6e`, with recovery at `refs/dotln/checkpoint/WO-120/6`
(`ab762b704dea`) and the named stash `a3ac1b011589` retained.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

Human actor: the operator dispatched `resume: final review` in an attended
Claude Code session; the harness recorded `npm run resume -- final-review`
before this procedure loaded. This harness exposes no effective-effort readback,
so the model and effort are operator-attested rather than session readback; the
harness name and version come from the project harness note and the prior
attestation on this order. The order requires `reviewer any`, so no effort drift
arises. No subagent was launched: the fan-out plan stated before any spawn was
zero, and the harness reports `count` 0, `countKind` `exact-observed` against the
cap of 20, so the whole budget remains and the uncounted remainder is unknown.
Two background tasks were dispatched and both were observed to completion — the
two product gates, 515,010 ms and 513,700 ms to terminal observation.

**Process cost:** entry 179460 tokens; handoff 88881652 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage`, taken
at 2026-09-22T02:22:14.806Z and 2026-09-22T02:45:27.304Z. Reasoning-output
tokens and dollar cost are unknown because those counters are unavailable in
this harness; they are unknown, not zero. The handoff figure is dominated by
cached input across a long wait on two serial product gates, and I state the
avoidable part plainly: the second gate, 513 seconds, exists because I chose to
fix a help-text line during review rather than board it up. That tradeoff is
recorded in D006 with the alternative it declined.

## Goal-aligned judgment

The 2026-09-08 external review found that derived work had no durable identity:
a compiled `WorkOrder` and the document control plane were two different
contracts with nothing between them, and the parity story promised commands no
order owned. WO-100 (automatic derivation) and WO-115 (UI filing) are both
blocked on that bridge existing. The intervention is the size of the gap — one
allocation event, one materializer, one generated authority shape, one command,
and a configurable reserved range — and it deliberately changes no lifecycle
legality: a derived order activates through the same `resume activate`, with the
same dependency refusal, and is then indistinguishable to every downstream
consumer.

Against the traps: escalation is bounded because allocation is one event in the
existing per-order segment rather than a second journal, and the fixtures test
the whole lifecycle through to closure rather than rendering alone. Rule beating
is answered by negative fixtures — hostile Markdown in an intent draft, an
edited provenance line, a symlinked derived root, an exhausted pool, a changed
contract under a reused key. Shifting the burden is reduced because the
allocation event retains the authority bytes, so an interrupted materialization
is recoverable rather than a manual repair. Success to the successful is
answered in D001, which compares and rejects a separate journal on consumer cost
rather than familiarity. Policy resistance is bounded: handwritten identities in
the pool are skipped and their bytes preserved, and WO-113 keeps ownership of the
global section migration. Naive Interventionism is the live trap for this review
itself and it decided both of my calls — I fixed a one-line usage string inside
a file this order already changes, and I did not design a versioned section
contract to close D007's forward-compatibility risk. NoOp leaves WO-100 and
WO-115 without their admitted prerequisite. The order claims no measured time or
token saving, and D002 explicitly declines to invent one.

## Authority: the order text against the activated text

`git diff refs/dotln/checkpoint/WO-120/1 -- docs/work-orders/WO-120-derived-work-identity.md`
returns exactly one hunk: the H1's `(version assigned at activation)` became
`(v0.41.0)`. Every other byte — all six acceptance criteria, the observed gap,
the design and its declined alternatives, the deliverables, the evidence gate,
the write-back duty, the non-goals, the operator-review assumption, the typed
dependency block and the nomination provenance — is identical to the text
activated at `6a5cf365`. That single edit is the standing release assignment
recorded in WO-120-D003, and `npm run plan -- check` exits 0, admitting it as a
release-assignment continuation.

## The verification sequence

The sequence is one report:
[VER-001](../../verifications/WO-120/VER-001.md), verdict `pass`, recorded
2026-09-22T02:01:23.445Z against `refs/dotln/checkpoint/WO-120/4`. There is no
earlier failed verification, no repair event and no superseded report, so
nothing is carried forward from an older subject. The control log held five
events before this review's result: activation, implementation-ready, the
verification request, its completion, and this final-review request.

The independence here is unusually strong and worth stating, because it is a
property of this order and not of the process in general. The executor ran on
**Codex CLI 0.155.1 / gpt-6-astra at xhigh with real `codex-session-readback`**;
the verifier ran on **Claude Code 2.1.278 / claude-opus-5[1m]**. Different
harness, different model, different attestation source. VER-001 is also not a
transcript re-read: it added three probes the executor's fixtures do not cover —
a registered public repository target exercising the `repo !== "self"` renderer
branch, a pool exhausted by pre-existing authority files with no control events
at all, and `dotln status` against an empty launchpad — and it disclosed that
files under verification were also its own instruments.

I did not take VER-001 on trust either. Reading the delivered source directly, I
independently confirmed the claims a reviewer must not inherit: `validateCompiled`'s
accepted key set is exactly the thirteen fields of the compiler's `WorkOrder`
interface in `packages/compiler/src/types.ts`, so the contract cannot silently
drift from the type; `prose()` escapes ampersand, angle brackets, backslash,
asterisk, hash, square brackets and pipe into numeric entities, and
`outputContract` additionally rewrites its less-than characters as the
six-character escape `\u003c`, which is what makes the hostile-Markdown
fixture's `## Receipt`, `**Model:**` and `<!-- dotln-dependencies:end -->`
injections structurally impossible rather than merely unobserved;
`dependencyHeader` never throws, so adding `parseDerivedProvenance` to
`parseHeader` cannot break any handwritten authority that has no typed block;
`gateCodeIdentity` excludes `docs/`, `.claude/`, `.agents/` and root `*.md`, so
the reports written after a gate cannot invalidate it; and `openOrders`'s new
exclusion of phase `none` is not a regression, because before this order every
segment began with an activation and no order could sit in that phase.

One correction to VER-001's framing, which changes nothing about its verdict.
Its check table records `npm test` as "the order's named gate" passing at 24
suites in 290.63 s, and the order's evidence README records the executor's
`npm test -- --review` at 32 suites. Both rows carry code identity
`eb763419feb5b97c…`. That identity was computed while
`scripts/lib/derived-contract.mjs`, `scripts/lib/derived-orders.mjs` and
`scripts/test-derived-orders.mjs` were still untracked, and `gateCodeIdentity`
enumerates `git ls-files`, so the three files carrying this order's entire
implementation were outside both identities. The suites still executed that code
— `derived-orders` ran and passed in both — so no claim in VER-001 is falsified;
what those rows do not do is bind the new bytes to the gate. That is exactly why
the reviewer's gate is the one publication consumes: I staged the new sources
first, which moved the identity, and `reviewedProductGate` compares it against
`HEAD` at publish.

## Criterion 1 — materialize, activate, and share index, status and lifecycle

Met. In `scripts/test-derived-orders.mjs` fixture 1 a compiled fixture
materializes to `WO-900` at `docs/work-orders/derived/WO-900-derived.md`, passes
`checkGeneratedSections` and `parseDependencies` with `source: "typed"`, appears
in `readIndex` with phase `active`, `authorityLink` `derived/WO-900-derived.md`
and its provenance, survives `work-orders index --check`, and shows in
`resume status --json` with `provenance` and the ordinary legal next actions.
The caller's compiled input is asserted unmutated. The fixture then runs the
identity through implementation-ready, a failing verification, repair, a passing
verification and final-review closure in its own disposable Git repository,
which is more than the criterion asks. I checked the link arithmetic
independently rather than trusting the fixture's string: `authorityLink` is
`posix.relative(authorityRoot, path)`, so a derived root configured outside
`workOrders` yields `../derived/…`, and the reference-definition writer splits on
`/` before `encodeURIComponent`, so a relative path is not mangled into a single
escaped segment. **Pass.**

## Criterion 2 — deterministic allocation, replay, and refused exhaustion

Met. `replayAllocations` over a re-parsed `controlFromSources(control.sources)`
is deep-equal to the live fold; two real child processes with distinct keys take
`WO-900` and `WO-901` while two with the same key share `WO-902`; a two-wide
configured pool refuses with `identity range exhausted (WO-980..WO-981)`; and a
reversed range refuses at `loadConfig` naming `dotln.config.json`. VER-001's
extra probe — exhaustion driven by pre-existing authority files with no control
events at all — refuses identically and leaves zero events and both handwritten
files untouched. The durability argument holds on inspection:
`durableCreate` writes to a staging file with `openSync(…, "wx")`, `fsync`s it,
publishes by exclusive `linkSync` and `fsync`s the directory, so a crash leaves
an ignored temporary rather than a torn authority, and the allocation event is
written before the file so a crash can never let another caller reuse the
identity. **Pass.**

## Criterion 3 — `dotln intent` files a draft and does not activate it

Met. The built CLI prints `Filed draft WO-900`, the segment holds exactly
`["WorkOrderIdentityAllocated"]`, the index shows phase `draft` under `Open`,
`openOrders` excludes it, and a human edit followed by an explicit
`resume activate` is what activates it. Hostile prose is escaped into body text.
This criterion is also where the one defect I fixed lived: the CLI shipped the
command but omitted it from the usage string that `dotln` with no arguments
prints, so the most common discovery path never showed it while
07-execution-guide.md documented it. One line, no test dependency, re-gated;
D006 records the fix, its cost and the alternative it declined. **Pass.**

## Criterion 4 — a resident restart resumes the same identity

Met, and by an actual restart rather than a re-read. A real `ResidentHost`
starts, ticks and closes; a second host starts from the saved store, ticks, and
the configuration replayed out of that store recompiles to the same
`workOrderId` the materializer allocated. A retry with the same provenance
returns that identity and the fold still holds exactly one allocation. **Pass.**

## Criterion 5 — write-backs

Met. `docs/product/07-execution-guide.md` gains `### Derived work and intent`
under `## Operator resume phrases`, documenting the command, the
`materializeOrder` contract and its option defaults, the allocation event, the
recovery and refusal rules, the shared-launchpad limit, and the `derivedOrders`
range and `derivedWorkOrders` root in the configuration section; I verified the
documented invocation is real, since `package.json` defines a `dotln` script
that builds first. `docs/product/06-roadmap.md` §Work-order navigation and
identity gains the reserved pool and the derived-work paragraphs. The ledger
duty is the documented pre-2026-09-09 substitution: the decisions file now
carries D001–D007, `docs/lineage/decisions-index.md` carries all seven rows, and
the generated index states the substitution on WO-120's own entry.
`publication:check` reports 274/274 headings covered with both editions current.
**Pass.**

## Criterion 6 — gate, whitespace, no new dependency

Met. `npm test -- --review` on the reviewed, staged, integrated tree:
**33 passed, 0 failed, 513.32 s, 77 fresh tasks**, exit 0, recorded
2026-09-22T02:44:38.903Z at code identity `8b79bbb74e59…` with
`sandbox.inForce` false, so it is a full row and not a partial inside-sandbox
one. `derived-orders` is among the 33 required suites and passed in 5.71 s.
Both `git diff --check` invocations are clean. No dependency changed: the only
`package-lock.json` movement is the internal `@dotln/skeleton` 0.34.2 → 0.35.0
workspace pin and the console's exact dependency following it, and the new
modules import only `node:` builtins and existing project modules. No new
`eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `prettier-ignore` or
`biome-ignore` directive appears anywhere in the diff. **Pass.**

## Integration, retime and carried-forward claims

`origin/main` had moved three commits ahead — WO-063's outward-artifact lint and
its records — so `npm run worktree -- integrate WO-120` ran before any judgment.
The merge is a fast-forward; there is no merge commit and no rewritten history.
The helper resolved five generated projections and regenerated them through
their own producers. One authored conflict needed a human decision:
`docs/product/06-roadmap.md` §Release boundary, where upstream's WO-063
`v0.40.3` record and this order's WO-120 `v0.41.0` record both claim the top of
the section. I kept both — they are history, not a contradiction — and retimed
WO-120's baseline sentence, which had read "above locally observed `v0.40.2`",
to name the `v0.40.3` tag the integration brought in. The assignment itself does
not move: the classification is minor and the next minor above `v0.40.3` is
still `v0.41.0`, which is also what `release prepare --local` reports.

No acceptance claim is carried across the moved base. Every criterion above is
re-established on the integrated tree by this review's own gate, not inherited
from the executor's or verifier's pre-integration runs — which, as noted, did not
even bind the new source files. D005 is completed with that judgment, the four
affected checks the integrate command printed were all executed and passed
(`publication:check`, `harness check` at 31 generated surfaces,
`release check-surfaces --local`, and the product gate), and the recovery
material is retained: checkpoint `refs/dotln/checkpoint/WO-120/6` and the named
stash `a3ac1b011589`.

## Clean-room screen and the ideation receipt

The dispatch's "ideation receipt" clause resolves to this order's nomination
provenance. `docs/lineage/idea-ledger.md` records the entry **"An external
review of the revised plan is verified and applied"** (2026-09-08,
`adopted`, `operator-directed`): a second model's read-only review of the branch
at `f7dd92c`, preserved verbatim in local-only
`docs/intake/notes/2026-09-08-codex-planning-review.md` under SHA-256
`410c47d5a2901f8c632ddf96bd96350f27a79e86d94f612e4295e64ddc9d52ca`. Its fifth
finding is exactly "derived work had no durable identity", and WO-120 is one of
the seven orders filed from that pass. The capture stays ignored and only its
hash reaches a committed surface, which is the clean-room contract working as
intended. I read no intake material for this review.

Screening the whole staged diff: the committed authority and control records
contain no employer material, internal identifier, host, credential or private
path. The generated-authority renderer is the one place where caller-supplied
text becomes committed bytes, and 07 states the obligation explicitly — "committed
authority/control records must contain public material only" — while
`validateProvenance` additionally constrains `sourceId` to a single clean line.
That is a documented duty on callers, not an enforced screen, and I record it as
such rather than claiming the code prevents it. The local-terms list is
unavailable in this worktree, so the clean-room screen here is my inspection of
the diff, not a passing automated check.

WO-063 also merged an outward-artifact lint during this review. I did not run it
against this PR's text: that lint enforces conventional-commit shape and refuses
DotLn's own public vocabulary for **target** repositories under Principle 16,
whereas this repository's own PRs follow 08-publication-compiler.md §PRs and
commits, which requires a gitmoji headline. WO-063's own merged PR body uses
"launchpad" freely. Applying a target-facing lint to the projection's source side
would be the boundary read backwards.

## Limits carried forward

These are limits of the delivered contract, not failures of any criterion.
Allocation is serialized by one `WorkerStore` lock at the shared launchpad, so
two disconnected checkouts of the same repository can allocate the same
identity; this is stated in D001's reopening condition and in both product
write-backs, so it is a declared boundary rather than an undisclosed gap. The
`repo !== "self"` renderer branch is correct — VER-001 exercised it with a
registered target and a 40-hex base commit — but has no committed fixture, so a
future change to the `**Repository:**` line's format would not be caught. An
out-of-shape human edit to a filed draft fails the whole index rather than one
row, because `readIndex` runs `checkGeneratedSections` on any authority
declaring provenance; the refusal names the path and is recoverable, and every
documented edit keeps the shape. The `dotln intent` bridge resolves scripts from
the installed kit via a path relative to its own build output, so it works from
this repository and not from a skeleton package published without `scripts/`;
the packages are private and `prepublishOnly` refuses publication, so nothing is
broken today, but a future publication decision inherits the coupling. And
D007's forward-compatibility risk stands unrepaired by choice: folding the
control log re-validates every allocation event's embedded authority against a
mutable code constant, which has zero impact today because no such event exists
in this control plane, and a named follow-up asks for the versioned contract
rather than a guess written during a review.

## Reproduction

From `/Users/dylanwood/Projects/DotLn-wo120` on branch `wo-120`:

```text
git diff refs/dotln/checkpoint/WO-120/1 -- docs/work-orders/WO-120-derived-work-identity.md
npm run worktree -- integrate WO-120            # then resolve 06-roadmap.md, git add, --continue
git add -A
npm test -- --review
git diff --check && git diff --cached --check
npm run publication:check
node scripts/harness.mjs check
npm run release -- check-surfaces --local
npm run plan -- check
npm run work-orders -- index --check
npm run build && node packages/skeleton/dist/src/dotln.js   # usage now leads with: dotln intent "<prose>"
node -e "import('./packages/skeleton/src/gate-evidence.mjs').then(m=>console.log(m.gateCodeIdentity(process.cwd())))"
```
