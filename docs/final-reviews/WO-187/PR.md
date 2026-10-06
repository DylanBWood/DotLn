# WO-187

Verification is now the implementation review and the attack, and what final review still finds is counted. A verifier dispatched by `resume: verify` attacks the change by varying what the executor's fixtures held constant, reviews the whole diff as a pull-request reviewer, and has one fresh adversary read only the order and the diff. An executor runs the same fresh adversary before each completion. Final review keeps its duties and classes each finding, so the record shows how many defects verification let through. The reason is in the record: fourteen of the eighteen blocking findings behind the thirteen failed final reviews were already in the subject the last passing verification judged.

**What a verifier is told.** The verifier's one duty sentence is replaced by one that names the three duties and a read directive for product 07 §Verification review and attack, which holds the variation axes, the review's questions, the three routes for a finding, the re-verification rule and a six-row lens catalog. The verify briefing prints the order's `Known issues and carry-ins` sections as written, with the line that ended each one, and the latest planning receipt's known issues for the order. The gate sentence is completed: consuming the executor's passing gate row limits product-gate reruns, never probes.

**Self-review before handoff.** Before `implementation-ready` and `repair-complete`, one fresh worker reads the order and the diff as an adversary and improver, and `handoff.md` carries a line that starts `self-review: found N; fixed N; recorded N`. A missing line prints one advisory and never refuses the completion.

**Counted findings.** A final-review report lists every finding once in a `dotln-findings` JSON block, each with an id, a route, a class and a one-line summary. `final-review-result` records the counts of `escape`, `integration`, `new-scope` and `unclassed` findings on the event. A block that cannot give a complete count records none, with one advisory naming the cause, and the result records in every case. `npm run plan -- failures` shows the counts per order, and `npm run plan -- start` shows escapes per final review over the ten most recently reviewed orders.

**Pinned workers.** The harness bundle emits `.claude/agents/dotln-worker.md` with `model: claude-opus-5-5` and `effort: xhigh`, and every role's text says to launch adversaries, reviewers, refuters and research workers by that type; under Codex the same pin goes to the spawn call. `npm run harness -- check` fails when the file's model or effort is edited by hand.

**Read before merging.** Every role root grows by the worker-pin sentence, and the executor root is 531 bytes over its cold-start ceiling; product 07 now boards such an overrun as a follow-up in place of a raise or an acceptance. Product 07 itself is 7,798 bytes over its document ceiling after integrating `main` and reports as an advisory through a new `advisoryDecision` field in `docs/control/doc-ceilings.json`, which holds only while its follow-up is open or deferred. The self-review line and a finding's class are statements by their author and prove no review. Final-review events recorded before this change hold no counts, so `plan start` shows the rate as unknown until the ten most recently reviewed orders are all measured. The `plan start` block drops `opensAt` to stay inside its 1 KB bound. The sub-agent duties ship as the order filed them, one dual-role worker at executor completion and the verifier's adversary; the operator described a separate principal-engineer improver as well, and that difference is boarded for planning. The compiler moves to 0.25.3, the skeleton to 0.53.1 (retimed above `main`'s 0.53.0 at integration) and the harness host to 0.34.5, and no dependency is added.

**Validation.** A fresh `npm test -- --review` on the tree integrated with `main` at `602f7e83` passed 39 of 39 suites with 89 fresh tasks in 1,349 s, and `npm run test:docs` passes. Four verifications failed criteria 2 and 4, each on a reader that inferred records from free-form Markdown, and each repair opened a new silent loss until the fourth replaced the inference with exact formats; VER-005 then passed. This final review found nothing blocking and boards seven low items: three that were in the verified subject and four that are new scope. It is the first review to record its finding counts. Details: [FINAL-001](FINAL-001.md), [VER-005](../../verifications/WO-187/VER-005.md), [decisions](../../evidence/WO-187/decisions.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-06T14:43:49.711Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-184 | 54,181,702 (Δ unavailable) / 5 | 2,212,088 (Δ unavailable) | 4 (Δ unavailable) / 94,960 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-185 | 70,773,751 (Δ 16,592,049) / 10 | 8,545,143 (Δ 6,333,055) | 3 (Δ -1) / 30,932 (Δ -64,028) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 4 (Δ 3) | 2 (Δ 2) |
| WO-195 | 20,414,389 (Δ -50,359,362) / 5 | 4,507,949 (Δ -4,037,194) | 4 (Δ 1) / 65,846 (Δ 34,914) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -3) | 5 (Δ 3) |
| WO-186 | 55,250,955 (Δ 34,836,566) / 8 | 20,388,505 (Δ 15,880,556) | 13 (Δ 9) / 163,932 (Δ 98,086) | 331,235,803 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 8 (Δ 7) | 3 (Δ -2) |
| WO-123 | 48,979,236 (Δ -6,271,719) / 11 | 4,558,664 (Δ -15,829,841) | 2 (Δ -11) / 13,988 (Δ -149,944) | 233,314,215 (Δ -97,921,588) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -6) | 1 (Δ -2) |
| WO-187 | 30,397,257 (Δ -18,581,979) / 10 | 7,377,103 (Δ 2,818,439) | 16 (Δ 14) / 179,356 (Δ 165,368) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 4) | 5 (Δ 4) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-187/executor | 21,686,317 (-10,546,526) | 344,239 (-37,967) | 282 (160) | unavailable (unavailable) | 370 (210) | unavailable (unavailable) / 1,019 |
| WO-187/verifier | 8,710,940 (-640,617) | 195,354 (-1,446,371) | 366 (-991) | 72,699,685 (21,357,717) | 417 (-1,092) | unavailable (unavailable) / unavailable |
| WO-187/reviewer | 3,440,257 (-3,954,579) | 331,581 (151,853) | 227 (208) | 45,189,426 (45,103,578) | 306 (279) | unavailable (unavailable) / unavailable |
| WO-187/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-187/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-187/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
