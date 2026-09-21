# WO-138 decisions

## WO-138-D001 — Pre-register one public-input matrix and score model claims deterministically

```json
{
  "id": "WO-138-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Use one tested probe build for 30 baseline episodes (T1, T2 and T3; local and codex-cli-exec; five repeats), five named one-factor prompt-support cells and three local unexpected-input cells. Validate every returned object in host code and score T1/T3 against committed labels and T2 against one held-out operator ranking.",
  "evidence": [
    "docs/work-orders/WO-138-local-model-role-qualification.md",
    "docs/verifications/WO-052/VER-001.md",
    "packages/skeleton/fixtures/wo119-discovery/repository.json",
    "scripts/fixtures/harness-probe-hook.mjs",
    "docs/discovery/local-runner-2026-09-18.json",
    "docs/evidence/WO-110/decisions.md#wo-110-d007--the-live-envelope-and-the-endpoints-unhonored-model-field"
  ],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves both the permanent-local and never-local assumptions unsupported; the selected order exists to replace that uncertainty with a bounded public-input measurement."},
    {"option": "Use the requested local model alias as artifact identity", "reason": "WO-110-D007 observed that the runner does not honor or echo that request; the probe instead requires the post-load runner inventory to expose the pinned model key or artifact file."},
    {"option": "Let a model judge its own success", "reason": "Schema validity, exact-field agreement, Spearman correlation and row accuracy are computed by host code from retained bytes."},
    {"option": "Add private inputs or qualify source writing or verification", "reason": "Explicit non-goals; the missing attributable no-egress boundary still forbids private-input qualification."},
    {"option": "Use more models or repeats", "reason": "Outside the order's bounded pilot budget and unnecessary to answer its fixed comparison question."}
  ],
  "reopenWhen": "A recorded cell differs in prompt, schema, task input or build between transports; a runner/model/quantization changes; or a later qualification needs a population reliability claim rather than this fixed-cell result."
}
```

The mission contribution is a reusable evidence interface for deciding whether
public, read-only inspection can move to the local actor kind; it reduces remote
supervision cost without weakening authority or verification. The critical-path
contribution is the measured floor consumed by the actor catalog and by any
later bounded-implementation or independent-verification qualification.

Policy resistance and drift are controlled by the pre-registered floors and
host-side oracles. Commons and escalation are bounded by 38 counted episodes,
parallelism one, one remote comparator and no recurring live gate. Success to
the successful is limited by comparing local and remote under the same prompt
without declaring either universal. Shifting the burden is limited to one
operator ranking, reported by the operator as 60 seconds; later scoring is
automatic. Rule beating is limited by retaining invalid output and typed
failures, not counting a model's completion claim as success. The wrong goal is
avoided by qualifying only the named public-input tasks, not a capability level.
Naive Interventionism keeps the existing transports unchanged and puts the
experimental code under `scripts/probes/`; the runner is loaded only for the
local cells and then cleaned up. NoOp preserves uncertainty and loses to this
small, reversible experiment.

Entry process-cost counters were unavailable at cutoff
2026-09-21T12:46:03.689Z (`source: unavailable`, `scope: dispatch`); tokens,
commands and USD cost remain unknown. The harness observed zero subagents, cap
20, with unknown unobserved remainder. The root executor is the only coding
agent and sole writer.

## WO-138-D002 — Preserve setup failures, correct the collector and do not change the experimental contract

```json
{
  "id": "WO-138-D002",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Retain three unscored setup/preflight/instrumentation attempts under docs/evidence/WO-138/attempts, correct only their collector and lifecycle defects, and start the counted matrix only after the focused double suite passes with the original prompts, schemas, oracles, floors and cell plan unchanged.",
  "evidence": [
    "Focused run 1: the discovery producer refused a /var temporary path whose physical path was /private/var",
    "Local setup 001: the installed lms parser rejected an option its help printed; after removing that unsupported negative option, server and model cleanup were observed",
    "Local setup 001: lms server status reported the stopped state on stderr with empty stdout, so the first collector failed to start the HTTP server and retained 21 fetch failures without accepted HTTP requests",
    "Local preflight 002: a product gate in the sibling WO-071 worktree was observed and the live run refused before loading the runner",
    "Local instrumentation 003: attempts 2 and 3 reached model output but validation failure records discarded the reported object; the process was interrupted before T2 and the model and server were explicitly cleaned up"
  ],
  "rejected": [
    {"option": "Delete or overwrite the failed attempts", "reason": "They are method evidence and explain why they are excluded from the registered 38 episodes."},
    {"option": "Relax T1 strings to numbers after seeing local output", "reason": "That would adapt the contract to the subject after trial evidence and make the baseline incomparable."},
    {"option": "Count requests whose reported output was not retained", "reason": "The order requires recorded envelopes or typed failures; a lossy invalid-result row cannot support independent review."},
    {"option": "Run inference beside another worktree's product gate", "reason": "The order makes host gate bands timing evidence and explicitly forbids overlap."}
  ],
  "reopenWhen": "A counted episode lacks its current reported object or typed transport failure, cleanup is not observed, or a prompt/schema/oracle byte changes after the counted matrix begins."
}
```

Same-day corrections: I first treated the temporary directory's lexical path as
canonical; the discovery producer correctly required its physical path, so the
collector now uses `realpath`. I trusted an advertised negative speculative
decoding option; the installed parser rejected it, and the load command now
omits that unsupported flag while retaining the prior observed default. I then
treated empty stdout from `lms server status` as an online server; the stopped
message was on stderr, so the collector now tests the bounded model-list HTTP
endpoint and starts the exact IPv4 loopback address and port when absent.
Finally, I recorded validation errors without the invalid model object; the
typed-failure row now retains that public-input output for audit. None of these
corrections changes a task prompt, response schema, oracle, floor or counted
cell.

## WO-138-D003 — Discard gate-overlap evidence and monitor every live cell continuously

```json
{
  "id": "WO-138-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Retain the first 38-cell collection unscored as attempts/gate-race-005, add continuous host-gate monitoring to both local HTTP and remote Codex episodes, and recollect the canonical matrix from an empty directory under the corrected single build.",
  "evidence": [
    "Point preflights refused the next cell three times when another worktree started a product gate",
    "Episode and process elapsed-time comparison showed that a gate could begin after preflight while the preceding cell was still in flight",
    "The focused slow-HTTP double starts a synthetic product gate in flight, observes gate-overlap and leaves no accepted episode",
    "During the replacement collection, real overlapping cells were aborted and their canonical episode paths remained absent until an uncontended rerun"
  ],
  "rejected": [
    {"option": "Score the first complete-looking matrix", "reason": "Its point observations cannot establish the order's no-live-inference-inside-a-product-gate constraint."},
    {"option": "Rerun only the cells nearest each refusal", "reason": "The collector change alters the harness build hash; one canonical matrix must retain one build."},
    {"option": "Treat overlap as a model typed failure", "reason": "Host contention is collector provenance, not model behavior, and must produce no scored episode."}
  ],
  "reopenWhen": "A live transport can continue after gate-overlap is observed, an interrupted cell leaves a canonical episode file, or the accepted records contain more than one harness build hash."
}
```

This repair was within the operator-authorized adjacent-repair envelope. It
changes lifecycle observation only. Task inputs, model prompts, response
schemas, deterministic oracles, decoding, thresholds and the 38-cell plan are
unchanged.

## WO-138-D004 — Qualify only T2 and keep the pilot outcome inconclusive

```json
{
  "id": "WO-138-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Add only T2's public-input discovery-candidate ranking to the local actor catalog. Record the overall pilot as inconclusive because T1 and T3 missed pre-registered floors; make no private-input, source-writing, implementation, verification or capability-level promotion.",
  "evidence": [
    "docs/evidence/WO-138/results.json",
    "docs/evidence/WO-138/decision-packet.md",
    "docs/evidence/WO-138/episodes/",
    "docs/evidence/WO-138/operator-ranking.json"
  ],
  "rejected": [
    {"option": "Declare the pilot ready", "reason": "Ready requires all three tasks; only T2 met every floor."},
    {"option": "Declare the pilot negative", "reason": "T2 met its 5/5 schema, 0.7 agreement, comparator, latency and intervention floors."},
    {"option": "Qualify T3 from its one supported factor cell", "reason": "One 1.0 factor cell is not the registered five-repeat baseline and cannot replace its 0.833333 result."},
    {"option": "Relax T1's schema after observing its output", "reason": "That would adapt the contract to the evaluated subject after evidence."}
  ],
  "reopenWhen": "T1 or T3 completes a separately pre-registered repeat set at every floor, T2's task/schema/artifact changes, or a proposed role needs private input, writes, implementation or independent verification."
}
```

T2 contributes a narrow, checked local inspection role to the mission without
granting authority the experiment did not test. T1's invalid structure and
T3's accuracy gap remain visible rather than being averaged away. The remote
comparator's failures are also retained; T2 qualifies on its absolute held-out
floor, not solely by comparison with a failed remote cell.

## WO-138-D005 — Freeze the formatted collector before the final recollection

```json
{
  "id": "WO-138-D005",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Retain the clean but byte-stale replacement set as attempts/postformat-stale-006 and recollect all 38 canonical cells after formatting the probe, so every accepted episode names the exact final source hash 29d874bd99ac741c9da31e4a8c4321a3bf7b562bb23187b7bb585a330c22b8b4.",
  "evidence": [
    "The formatter changed scripts/probes/local-model-role-qualification.mjs from recorded hash da3c8b1ab9af6aa2d4bda1f7e078e4cd0954479a9e800df0060e5fc842cdddf9 to 29d874bd99ac741c9da31e4a8c4321a3bf7b562bb23187b7bb585a330c22b8b4",
    "All 38 canonical episode records now carry the latter hash",
    "The current probe's SHA-256 equals the canonical records' sole distinct harnessBuildHash"
  ],
  "rejected": [
    {"option": "Rewrite the earlier records' hash", "reason": "That would invent provenance for bytes those episodes did not run."},
    {"option": "Treat formatting as irrelevant", "reason": "The registered build identity is byte-based and must match exactly, even when the behavioral change is believed to be none."}
  ],
  "reopenWhen": "The probe source changes again before handoff or any canonical episode carries a different harnessBuildHash."
}
```

This corrects my sequencing error: formatting belonged before live collection.
The stale set is preserved rather than rewritten, and only the final-source set
is scored. Its outcome remains `inconclusive`, with T2 the sole qualified task.

## WO-138-D006 — Repair the comparator instrument and recollect one matched build

```json
{
  "id": "WO-138-D006",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Remove T2's unsupported uniqueItems keyword while retaining host duplicate rejection; preserve bounded, sanitized remote JSONL error messages and exit status; make an unavailable comparator explicitly unmeasured rather than a passed floor. Preserve the VER-001 subject under attempts/invalid-schema-007 and recollect all 38 cells under one formatted final probe build before replacing the product decision.",
  "evidence": [
    "docs/verifications/WO-138/VER-001.md#finding-f1--the-remote-t2-comparator-arm-was-rejected-by-the-probes-own-schema-and-the-cause-was-discarded",
    "scripts/probes/local-model-role-qualification.mjs: taskSchema, validateAnswer, runCodexEpisode and evaluateRecords",
    "https://developers.openai.com/api/docs/guides/structured-outputs"
  ],
  "rejected": [
    {"option": "NoOp or retain the T2 qualification on its absolute floor alone", "reason": "The order requires a measured remote comparison too; HTTP 400 before inference cannot satisfy it."},
    {"option": "Recollect only remote T2", "reason": "D001, D003 and D005 require matched final build provenance; T2's schema also changes on both transports."},
    {"option": "Retain raw remote stdout as failure detail", "reason": "Only diagnostic error events are needed; unrelated stream items and identifiers should not enter the evidence."},
    {"option": "Change the ranking, prompts, model, floors or cell count", "reason": "Repair the instrument without tuning the experiment to observed scores."}
  ],
  "reopenWhen": "Any replacement comparator baseline lacks returned model output, any matched input/schema/prompt/build differs, or retained diagnostics cannot identify another transport refusal."
}
```

Same-day correction to D004: the original executor treated the rejected remote
T2 requests as zero-scoring comparator evidence and declared its comparison
floor met. VER-001 established that the model was never reached. The absolute
T2 score alone did not meet all registered floors, so that qualification is
withdrawn pending the replacement matrix; D004 remains historical evidence.

This repairs the catalog's evidence dependency for local inspection and reduces
recurring operator rescue. Policy resistance and drift are addressed by applying
the unchanged floors; rule beating by requiring an observed comparator; wrong
goal by making the catalog follow the result, including a negative result.
Commons and escalation costs are bounded to one 38-cell replacement, sequential
inference and no live product gate. Success to the successful is avoided by
keeping the original local and remote models; shifting the burden is reduced
by reusable deterministic diagnostics. Naive Interventionism preserves the
existing transports, host validators and all previous evidence. NoOp would
retain an unsupported product role. No delegation is needed; the executor is
the sole coding writer. Entry usage is unknown (source unavailable, scope
dispatch, cutoff 2026-09-21T14:44:36.574Z).

## WO-138-D007 — Publish T1's existing field limits before recollection

```json
{
  "id": "WO-138-D007",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Apply adjacent-0001: add maxLength 40 to the ten T1 receipt fields in the response schema, retaining summary maxLength 320 and the unchanged host validator. Run both transports against that same corrected schema in D006's replacement matrix.",
  "evidence": [
    "docs/verifications/WO-138/VER-001.md#advisory-observations",
    "scripts/probes/local-model-role-qualification.mjs: taskSchema and validateAnswer",
    "The original remote T1/T3 runs accepted maxLength 320 in their schemas"
  ],
  "rejected": [
    {"option": "NoOp and retain the schema/validator mismatch", "reason": "A model can satisfy the emitted length contract and still be rejected by the host; the same files and recollection already need repair."},
    {"option": "Relax the host field limit", "reason": "Changes acceptance after observing failures rather than publishing the existing contract."},
    {"option": "Tune counts, prompt wording or oracle values", "reason": "Unnecessary to correct the declared contract and risks fitting the experiment to its answers."}
  ],
  "reopenWhen": "Either transport rejects the corrected schema or schema-valid output remains rejected solely by an undeclared field bound."
}
```

This low-risk interface correction shares F1's paths, tests and planned
recollection. Its mission benefit is interpretable inspection evidence; the
catalog is its critical-path consumer. It reduces policy resistance between
schema and validator, prevents rule beating and preserves the performance
standard and actual qualification goal. Commons and escalation add one focused
test without additional live cells. Neither model receives preferential
treatment, and no recurring human intervention is added. Naive Interventionism
retains the host contract and archives the original schema's results. The
correction can change model output, so old and new distributions are separate.

## WO-138-D008 — Preserve release-header meaning across the planning check

```json
{
  "id": "WO-138-D008",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Apply adjacent-0002: extend the existing release-header normalization to the equivalent A/An article and sentence/colon spellings, preserving the release axis, evidence-only declaration, article identity and every following description byte. Keep the already assigned patch release and the judged order's substantive text unchanged.",
  "evidence": [
    "npm run plan -- check: planning pass needs a receipt matching the current subject: existing work-order bytes changed",
    "git diff for WO-138 shows only its assigned version and patch, evidence-only. An becoming patch. Evidence-only. An",
    "scripts/lib/plan-continuation.mjs accepts only legacy A and canonical Evidence-only: a",
    "scripts/lib/release-preparation.mjs requires the patch. release classification prefix"
  ],
  "rejected": [
    {"option": "NoOp and carry the known planning failure into review", "reason": "Leaves two existing workflow readers disagreeing about a meaning-preserving release preparation."},
    {"option": "Revert to the original comma spelling", "reason": "Release preparation then refuses its required period-delimited classification."},
    {"option": "Treat this as a new scope authorization or replace the planning receipt", "reason": "No substantive order change occurred; a new authorization or refutation would misstate the problem and add process."},
    {"option": "Normalize the entire declaration or arbitrary order prose", "reason": "Could conceal an actual scope or compatibility change from the planning gate."}
  ],
  "reopenWhen": "A changed release axis, evidence-only status, article identity, description or criterion is accepted as presentation-only, or an equivalent observed release header still fails."
}
```

This bounded tooling repair enables the same order's valid planning and release
handoff. Policy resistance is the observed conflict between its two readers;
rule beating is controlled by adversarial tests of changed scope and release
axis. Drift and wrong-goal risks favor preserving the judged contract. Commons
and escalation favor one narrow existing-normalizer fix over repeated gates or
new receipts. Success to the successful and burden shifting do not justify
favoring either parser or making the operator repair punctuation. Naive
Interventionism retains all receipt bindings and permits only the exact
presentation correspondence. The shared full product gate follows both queued
repairs; the T1 item has its own focused and complete live-matrix checks first.

## WO-138-D009 — Pin the generated task inputs once for both transports

```json
{
  "id": "WO-138-D009",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Preserve the first repair matrix unscored as attempts/unmatched-input-008. Generate and retain inputs.json once alongside a new matrix, then make both transports and evaluation consume those exact bytes. Keep the real discovery producer, original seeded checker, held-out ranking, prompts, floors and matrix unchanged; validate each record's input, prompt, schema and build against the pinned snapshot.",
  "evidence": [
    "Independent recomputation matched every numerical distribution, then failed the cross-transport T2 promptHash assertion",
    "Two fresh taskInputs calls differed only in the failing-test candidate's stderrSha256",
    "packages/skeleton/fixtures/wo119-discovery/repository.json: checks/test.cjs throws an assertion whose stack contains the fresh scratch directory",
    "The repair's canonical provenance test rejected baseline-local-T2-r1 against a freshly generated input"
  ],
  "rejected": [
    {"option": "NoOp or ignore the changed digest as semantically irrelevant", "reason": "The order requires the same input and prompt; an opaque hash can still affect a model response."},
    {"option": "Rewrite recorded hashes or discard the differing evidence field", "reason": "Would falsify provenance or change the task after observing its results."},
    {"option": "Change the seeded failing test to suppress its stack", "reason": "Pinning the generated task input once preserves the producer's actual evidence and the original fixture."},
    {"option": "Use a fresh discovery run during evaluation", "reason": "Recreates the nondeterministic input instead of checking the actual model input."}
  ],
  "reopenWhen": "Any matrix episode fails its retained input/prompt/schema/build binding or either transport can independently regenerate a different task snapshot."
}
```

Same-day correction: I called the first repair matrix matched before checking
cross-transport input hashes, and also said its remote T2 median was 0.828571.
The independent calculation found the median was 0.771429; the numerical
result still passed that floor, but its differing prompts invalidate the
comparison. Both product write-backs now withdraw that unsupported role.
The replacement cannot be called matched until the strengthened audit passes.

The mission and catalog consumer require comparable evidence. This fixes the
observed policy conflict between fresh discovery and a pinned experiment,
prevents rule beating and preserves the original performance standard and
qualification goal. Commons and escalation costs are visible: this session
already ran 17 remote episodes and another full set needs 17 more. Permission
to exceed the 20-agent session cap was requested before any additional remote
launch. A single pinned snapshot avoids repeated producer work and operator
rescue; it favors neither model. Naive Interventionism preserves all actual
observations and producer code. NoOp would leave the comparison unsupported.

Operator authorization, 2026-09-21: the operator answered "Allow this one
replacement run" to the request for 17 additional remote episodes (34 in this
repair session). This is a bounded exception for the replacement matrix only;
the persistent cap is unchanged and no coding subagents are introduced.

## WO-138-D010 — Restore only T2 from the fully matched replacement

```json
{
  "id": "WO-138-D010",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Qualify only T2 on the final 38-cell matrix, retain the overall inconclusive outcome, and supersede D004's unsupported basis with the validated common-input comparison. Keep T1/T3 and all private-input, source-writing, implementation, verification and capability-level extensions unqualified.",
  "evidence": [
    "docs/evidence/WO-138/results.json evaluated 2026-09-21T15:15:49.525Z",
    "docs/evidence/WO-138/inputs.json",
    "docs/evidence/WO-138/decision-packet.md",
    "node docs/evidence/WO-138/audit.mjs: all six distributions and matched baseline provenance pass",
    "13 focused probe tests pass with no skips; 42 planning tests and current-subject check pass"
  ],
  "rejected": [
    {"option": "NoOp and leave T2 withdrawn", "reason": "Both transports now returned 5/5 valid rankings under the same input and build, with equal 0.828571 medians; all T2 floors are measured and met."},
    {"option": "Promote T1 because its length repair produced 5/5 valid envelopes", "reason": "Agreement remains 0.1 against a 0.9 floor and remote 1.0."},
    {"option": "Promote T3 from its one supported cell", "reason": "The baseline remains 0.833333 and the single 1.0 support cell does not establish five-repeat performance."},
    {"option": "Pool the earlier matrices into a larger sample", "reason": "Their instrumentation or input provenance differs; they remain separate, unscored evidence."}
  ],
  "reopenWhen": "A changed task, schema, input boundary, runner or artifact requires requalification; or a separately registered T1/T3 repeat set meets every floor."
}
```

The measured mission benefit is one supported public inspection role, not a
general local-model claim. Rule beating, drift and wrong-goal risks are
addressed by the unchanged floors and independently checked input bindings and
scores. Policy resistance between the schema, validator, collector and evaluator
is resolved at their existing interfaces. Commons and escalation costs were
real: this repair ran 76 episodes, including 38 later excluded for input drift;
the operator authorized the additional 17 remote launches. The final matrix
uses 21 local and 17 remote episodes. Neither model gains special treatment,
and no recurring operator rescue is introduced. Naive Interventionism retains
the failed evidence, existing transports and host validators. The T1 queue
item's focused check and the main repair's mandatory full-matrix audit are
separate checks after D009; the full product gate still covers the combined
final subject before handoff.

## WO-138-D011 — Integrate main at 87393bf6 and keep the staged v0.38.1 target

<!-- integration refs/dotln/checkpoint/WO-138/10 -->

```json
{
  "id": "WO-138-D011",
  "date": "2026-09-21",
  "dispatch": "resume: final review (npm run worktree -- integrate WO-138)",
  "decision": "Integrate main at 87393bf6 (WO-071 merged as PR #108 and published v0.38.0) into the uncommitted wo-138 worktree by fast-forward, keep the staged v0.38.1 target under its existing patch classification because release preparation observed it still above the baseline, resolve the one authored conflict (the roadmap's release-boundary section) as a union of both dated paragraphs with v0.38.1 above v0.38.0, and carry every acceptance claim forward with its original evidence because no subject source, evidence, report or product write-back byte changed.",
  "evidence": [
    "refs/dotln/checkpoint/WO-138/10 (4ddc85aed0f12d98758fe2ae16ae014df8294332): the pre-integration working state including untracked paths",
    "base 97cedbe0191394a5f18d60bb592cb7e664499707",
    "upstream 87393bf6f1c7799df7c726d6b734ee3b4c766e25; origin/main equals local main",
    "named stash WO-138 integrate 2026-09-21 at 7249119e3a67dae27a3053db71ba25ce4254c63e, retained",
    "git diff --cached refs/dotln/checkpoint/WO-138/10 over scripts/probes, scripts/fixtures/wo138-local-role-qualification.json, docs/evidence/WO-138/episodes, results.json, inputs.json, decision-packet.md, docs/product/03-architecture.md, docs/verifications/WO-138 and the three adjacent source files: empty",
    "release preparation: WO-138 target v0.38.1 remains current; no files changed",
    "docs/final-reviews/WO-138/FINAL-001.md"
  ],
  "rejected": [
    {"option": "Rewrite reviewed commits or discard the integration stash", "reason": "Both histories and recovery material must remain available."},
    {"option": "Retime to a new version", "reason": "v0.38.1 is already the next patch above the published v0.38.0; the helper observed no collision."},
    {"option": "Return to independent verification because the whole-tree hash changed", "reason": "Product 07 names a new base, a text conflict and a changed tree hash as bookkeeping, not a finding; the affected checks and one product gate run on the integrated tree instead."},
    {"option": "Order the two release-boundary paragraphs by activation time", "reason": "The section lists newer versions first, so v0.38.1 stands above v0.38.0."}
  ],
  "followup": "First real use of worktree integrate (WO-079): the helper set its stage to applied after the stash apply and ran every regeneration step, printing Regenerated lines, while docs/product/06-roadmap.md still held conflict markers; the --continue pass regenerated everything again, so no conflict byte reached a projection here, but that first pass is provisional and its output can mislead. Nominate a bounded follow-up on the helper to defer regeneration, or label the first pass provisional, until authored conflicts are staged, and to trim the trailing newline of the receipt's release string, which printed a doubled period in this record's stub.",
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance (return that finding through repair and fresh independent verification), or a later integration bakes conflict bytes into a generated projection."
}
```

Integration date: 2026-09-21. Original base: `97cedbe0191394a5f18d60bb592cb7e664499707`.
Fetched main: `87393bf6f1c7799df7c726d6b734ee3b4c766e25`. Checkpoint: `refs/dotln/checkpoint/WO-138/10`.
Named stash retained: `7249119e3a67dae27a3053db71ba25ce4254c63e` (WO-138 integrate 2026-09-21).
Resolved projections: README.md, docs/control/current.md, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-138 target v0.38.1 remains current; no files changed. Tag observation: local snapshot only.
Carried-forward claims: all six acceptance criteria and both verification verdicts are carried forward with their original evidence, because the subject bytes they judged are unchanged at the integrated tree (the diff against checkpoint 10 over every subject path is empty). Re-established on the integrated tree by this review: the deterministic probe suite (13 of 13), the retained independent audit (38 records, one build, `inconclusive`, `["T2"]`), `publication:check`, `harness check`, `release check-surfaces --local`, `format:check`, `plan check`, `work-orders index --check`, both diff checks, and one product gate (`npm test -- --review`, 24 suites, 0 failed, 269.74 s, 68 fresh tasks, exit 0, recorded 2026-09-21T16:02:21.436Z at code identity 14584332e2b757d63132099f36dedcdef154df14367770ca42970b1764bbaa0d and tree 849078b8bf2f9debcb8c77a98ae37fd03871742d). Component versions are unchanged against main (compiler 0.17.0, console 0.1.7, kernel 0.6.0, skeleton 0.33.1) and `packages/`, `package.json` and `package-lock.json` have an empty diff, so no component-version collision exists. The follow-up register unioned by entry id at 491 entries, keeping this order's four revision rows of the local-model candidate section and main's WO-071 rows; the decisions index carries D001 to D012.
Authored conflicts observed: docs/product/06-roadmap.md, resolved as the union described above.

## WO-138-D012 — Board up the undeclared T1 minimum bound named by VER-002 A1′

```json
{
  "id": "WO-138-D012",
  "date": "2026-09-21",
  "dispatch": "resume: final review",
  "decision": "Record VER-002 A1′ as a defect met and not fixed: the emitted T1 schema declares the host's 40-character maximum but not its one-character minimum, and the retained cell failure-local-T1-unexpected-input was rejected on that undeclared bound after the model blocked correctly. The closed 38-cell matrix is not recollected for it; the correction is named for the next order that recollects a T1 matrix.",
  "evidence": [
    "docs/verifications/WO-138/VER-002.md#advisory-observations",
    "docs/evidence/WO-138/episodes/failure-local-T1-unexpected-input.json: status blocked, requiresHuman true, ten empty strings, failure invalid T1 criteriaMet",
    "scripts/probes/local-model-role-qualification.mjs: requireString rejects a zero-length value; taskSchema emits only maxLength"
  ],
  "rejected": [
    {"option": "Add minLength 1 to the emitted schema in this order", "reason": "A schema change alters the emitted bytes and the build hash that D005, D006 and D009 bind to one 38-cell recollection; another matrix is far above the defect's cost, and T1 is unqualified at 0.1 against 0.9 under any bound."},
    {"option": "Relax the host minimum instead", "reason": "Changes acceptance after observing failures rather than publishing the existing contract, the rule D007 set."},
    {"option": "Leave it as a sentence in the verification report", "reason": "A defect met and not fixed needs a named follow-up in the decision record, not only an advisory."}
  ],
  "reopens": {
    "decisionId": "WO-138-D007",
    "observation": "VER-002 A1′: failure-local-T1-unexpected-input returned a schema-valid blocked envelope with ten empty strings and was recorded as a typed failure (invalid T1 criteriaMet); D007 named schema-valid output rejected solely by an undeclared field bound as its reopening condition."
  },
  "followup": "In the next order that recollects a T1 matrix, declare minLength 1 on the ten T1 receipt fields in the emitted schema, keeping summary at 320, so the published contract equals the host validator; extend the boundary test to the minimum; and describe the T1 unexpected-input cell as blocked-then-out-of-contract rather than beside T3's failure to block.",
  "reopenWhen": "A T1 matrix is recollected under a schema that still omits the minimum, or a schema-valid envelope is again rejected solely by an undeclared bound."
}
```

The verifier's reasoning holds at this review and the choice is the same: the defect changes no floor, distribution, median, outcome, qualifying task or write-back, and the only fix that keeps the contract honest, declaring the minimum, would change the build hash that the closed matrix is bound to. The boy-scout bound therefore stops at recording it here with its named action. The repair report's sentence that "boundary tests prove that the emitted and host length limits agree" remains broader than the test, which asserts the maximum only; this record is the correction.
