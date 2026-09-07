# WO-032 executor evidence — actor board v0

The implementation prepares application `v0.14.0` with new console component
`0.1.0`. It projects recorded actors, saved and recorded builds, compiled
mechanisms, work and blueprint evidence into `uifa-board-v1`, with terminal and
self-contained HTML renders. Kernel, compiler and skeleton runtime sources and
versions are unchanged. There is no new external dependency or framework.

Executor selection: Codex CLI `0.153.4`, `gpt-6-astra`, effort `max`, from the
operator default in product 07. The harness version is exposed; model/effort are
operator-attested selections, not effective-session readback. This receipt
records implementation evidence. The separate `resume: verify` and final-review
dispatches retain their responsibilities.

## Acceptance evidence

| Criterion                                      | Executable evidence and boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — pure versioned projection and both renders | [Manifest](../../../packages/console/fixtures/manifest.json) pins every source. Five cases cover WO-009, WO-011, control, refutations and missing sources; [expected outputs](../../../packages/console/fixtures/expected/) pin JSON, terminal and HTML. Tests freeze input, repeat projection, validate serialized shape, and check evidence/selection targets. The refutation case includes all six real manual receipts plus the later versioned receipt and has populated verdicts.       |
| 2 — actors, authority and evidence             | WO-011 fixtures separate the fixed script executor, all four physical verifier attempts, phases and authority envelopes. Only the successful verifier supplies the admitted matrix; the executor's recorded implementer relationship links to it. WO-031 supplies an operator-role row with recorded actions and unknown identity. The historical-source discrepancies below are explicit review items; the tests do not claim that missing LoadoutGraph hashes or human identity were found. |
| 3 — builds through the compiler                | Every captured saved graph is compiled through all three editable views; their hashes equal the hash inside `renderCompiledDiff`'s receipt. A fixture export adds a card without console edits, and unrelated exported functions are not invoked.                                                                                                                                                                                                                                             |
| 4 — all ten mechanisms                         | Ten compiled units retain rung, boundary, enforcement and all five maturity counts for fixture/live sources. Tests cover a genuinely unobserved unit, absent evidence and a mismatched fold. No rate is synthesized.                                                                                                                                                                                                                                                                          |
| 5 — Work, Blueprint and role service           | Pinned status, usage, constellation, release TSV, generated index, capability table variants, publication tables and roadmap headings are exercised. The [role mapping](../../../packages/console/fixtures/role-answers.json) pins exact answering cells and source records. Tests compare its questions with product 13; the independent verifier must judge whether those cells answer the questions, particularly the product lead's refutation verdict/hold evidence.                     |
| 6 — safe static HTML and terminal width        | Each HTML fixture is scanned for scripts, assets, forms, external references, inline handlers and dead/duplicate anchors. Hostile-source fixtures stay escaped and inert. Terminal fixtures fit 80 columns. CLI checks preserve recorded source bytes, refuse output overwrite and conflicting modes.                                                                                                                                                                                         |
| 7 — shared-memory write-backs                  | Product 04's plural hosts and agent projection, product 13's five Today rows and role-service contract, the roadmap's first slice, README, the console runbook, dated capability row, publication rows/locks and ledger entry. Broader console/authoring/replay claims remain planned.                                                                                                                                                                                                        |
| 8 — repository gates                           | `npm test` exited 0 with 303 runtime tests, 8 corpus tests, 21 mutation self-tests and the workflow/publication/evidence suites passing. `git diff --check` passed. An executable lockfile comparison confirms only the local console workspace and link were added; every previous entry is unchanged.                                                                                                                                                                                       |

## Historical-source reconciliation

The draft names evidence that the retained sources do not actually contain.
The implementation follows its evidence-backed-only rule and keeps these
limitations reviewable rather than silently substituting facts:

- **WO-011 hashes:** the script executor records a `feedback-v1` policy hash;
  the verifier records a `verification-v1` input hash. Neither records a
  LoadoutGraph semantic hash. They have different recorded build hashes with
  explicit kinds, and `loadoutHash` is unknown on both. The first three verifier
  attempts remain lease-expired; the fourth is completed. Both the executor and
  accepted verifier link to their recorded build, receipts and matrix.
- **WO-031 person:** the canonical log has `WorkOrderActivated`,
  `VerificationRequested` and `FinalReviewRequested`, identified as operator
  dispatches by the execution guide. It contains no attested human identity and
  no release-close event. The row reads **Operator — identity not recorded**,
  with role `operator`, kind `person role`, last action `FinalReviewRequested`,
  and evidence links. Identity and human authorship stay unknown; the grouping
  does not assert the same person made every request. No new operator
  attestation, presence observation or interaction was introduced.
- **Compiler rendering:** `renderTooltip` is not an exported function. The
  implementation uses the existing tooltip-bearing `renderCompiledDiff`
  directly, with equal compiled hashes tested against its receipt text.
- **Blockers:** status JSON records phase, legal actions, signed elapsed and
  evidence paths, but no dependency-blocker reason. Available failure references
  remain distinct from the generated index's conservative dependency evidence;
  absence is not presented as proof that an order is unblocked.
- **Activations:** the WO-011 report contains a maturity fold and selected
  present/removal pairs, not a timestamped event feed. The adapter reconstructs
  only the generator's documented `regression_<unit>` fixture episode convention
  and requires equality with the existing maturity fold. It never promotes the
  self-hosted audit into live prevention counts or claims an activation inside
  an unrelated worker episode.

These differences are also recorded in the work order for independent review.
Criterion 2's literal missing-source assumptions are not claimed as satisfied.
The implemented behavior shows every supported fact and labels the gaps.

## Fixture provenance and visual inspection

The new WO-009 recording ran the existing demo to completion with a deterministic
synthetic CLI peer in a disposable Git fixture. It is a witness of the real
demo/store path with a simulated model return. It is not a new authenticated
worker claim. The recorder and exact reproduction are in the
[console runbook](../../../packages/console/README.md#recorded-evidence-and-reproduction).
The original WO-011 audit, verifier and maturity report, WO-031 control segment,
and seven planning receipts are referenced and hash-pinned without rewriting
them. Format snapshots record the remaining command/document inputs; the
constellation snapshot explicitly replaces checkout addresses with fixture
addresses. Snapshot inputs remain dated evidence when product docs advance.

The combined fixture page was opened in native Chrome. The initial Actors view,
full-width Builds tooltips, Mechanisms counters, and Blueprint verdict/hold cards were visually inspected:
headings, columns, wrapped facts, contrast, and panel anchors rendered correctly.
The permission retry succeeded after the operator allowed Codex; no application
restart or reset of completed tests was required. Browser chrome is not included
in committed evidence. Pinned standalone HTML supplies the reviewable artifact.

## Feedback evidence edition

Adding the console workspace changes the existing declared lockfile projection,
which correctly made the WO-041 feedback check stale. No feedback runtime or
source-pinning rule was changed. The fresh [report](feedback/feedback.json),
[audit stream](feedback/selfhost-audit.jsonl), and
[verifier stream](feedback/selfhost-verification.jsonl) preserve a WO-032 edition;
the published WO-011 and WO-041 editions remain untouched. Root evidence scripts
now select WO-032. The verification capsule's historical logical report label
is unchanged.

The existing bounded executor witnessed ten passing regressions, ten assertion
failures with the corresponding mechanisms removed, and 2,393 fewer instruction
bytes in the matched projection. Its independent verifier used the existing
`codex-cli-exec` transport and `gpt-6-astra`, with effort `unknown` as required by
that observed transport profile. The audit command returned phase `complete`;
recording validated the current source, policy, report, real transport and
complete verified matrix. This is evidence for the bounded feedback audit, not
independent acceptance of the whole actor board. Its store under
`.runtime/wo032-feedback` can resume the same audit without repeating completed
work; source or selection drift refuses.

The source subject is
`sha256:08c3d95576398c31064447a32559989aa5f8cdea88ba4e21be156db427d52fd1`.
One physical verifier attempt completed; `AC-causal-fixtures` and `AC-context`
are both verified with no stale evaluation.

```sh
node scripts/feedback-evidence.mjs --write --edition WO-032
DOTLN_LIVE_WORKERS=1 node packages/skeleton/dist/src/dotln.js feedback-audit \
  --store .runtime/wo032-feedback --transport codex-cli-exec \
  --model gpt-6-astra --effort unknown
node scripts/feedback-evidence.mjs --record-selfhost .runtime/wo032-feedback --edition WO-032
npm run evidence:feedback -- --check
```

## Validation

On 2026-09-07, `npm test` exited 0. The [gate summary](checks.txt) records its
suite totals and the source/evidence checks. The [console transcript](fixtures.txt)
selects the 18 console cases from that successful full run. All five JSON,
terminal and HTML fixtures match. The current-source collector test preserves
canonical control/document bytes, leaves a missing requested store uncreated,
discovers all current saved exports and renders the new publication/capability
rows. It observes metadata only, not live worker identity or presence.

An additional mixed combining-mark/CJK probe reproduced a 41-column line at a
40-column width. Wrapping now rechecks the remaining fragment after a word
break; the hostile-text fixture includes that regression and passed in the full
runtime run. The earlier formatting stop was corrected before runtime checks;
the changed renderer and test also passed their explicit formatting check.
The normal full gate covers formatting, release and license surfaces,
lifecycle/recovery/worktree/release/index fixtures, both publication locks,
artifact identity, verification and the fresh feedback edition. All 239 product
headings are indexed. `git diff --check` is clean.

No work-order branch commit, push, PR, deployment or publication was performed.
The next lifecycle handoff is independent verification of the staged source and
the documented source reconciliation.
