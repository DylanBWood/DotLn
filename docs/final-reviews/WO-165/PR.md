# WO-165

The Entropy Reducer's compiled review authority did not match the routes that run it. The loadout granted `delegate.readonly` with a four-delegate limit, refused to compile without that resource, and its residue and receipts described a fan-out, while the `claude-cli-print` route passes only Bash, Read, Glob and Grep and the Codex route disables `multi_agent`. Every review and refutation since REVIEW-002 therefore carried, and described, a fan-out it could not perform, and worked the four lens briefs serially in the main reviewer (REVIEW-003 ER3-003, minor, measured, survived REFUTATION-004).

This pull request lands WO-165. The loadout now compiles every admitted route as serial lenses: the envelope carries no delegate grant or delegate limit, the four lens briefs are rendered as the reviewer's own checklist inside the residue, the receipt states the compiled execution rule and the worker's result, and an unknown route is refused rather than granted anything.

- **One route-aware compile.** `compileReviewerWorkOrder` takes a `route` (`claude-cli-print` by default; `codex-cli-exec`, `background` and `fake` admitted; any other name throws `unsupported entropy review route`) and records it in the compile inputs and the compiled identity. The `fan-out-lens` support becomes `lens-checklist`; Seisō moves to v3 and the review role to v2; the lens Program is a `Sequence` of `repo.read.lens` invocations with no resource; `resourceLimits` is `{probes: 32}`; `deferredProgramKind` is `null`.
- **The checklist is in the prompt.** The residue gains `## Reviewer lens checklist` with one item per brief and its files, questions, output shape, word budget and no-fix line. Custom brief text is escaped onto one line so embedded newlines cannot manufacture items, and sparse or non-array brief lists are refused. The dispatch protocol and the transports are unchanged and still refuse a request without lens briefs.
- **The receipt says what ran.** New review receipts render the compiled review confinement as an execution rule (lenses worked serially by the reviewer; no delegate grant or delegate resource limit), state that checklist completion is not independently observed, show the worker's result (completed, failed or blocked), and no longer describe a deferred `All` Program. Refutation dispatches record their compile inputs too. Historical receipts render byte-identically.
- **Identity change recorded.** `docs/evidence/WO-165/route-identities.json` records the before hash `79151d7baebc5262` and the after hash per route; the historical REVIEW-001 compile inputs recompute to `ecb0eca5675332f7`. The plan-refuter and mission-check loadouts pin their own metadata so their compiled identities are unchanged, reproduced from entry source.
- **A fixture per route.** `scripts/test-entropy-review.mjs` compiles both pinned routes and asserts the envelope, the residue, the serial Program, the prompt checklist, the missing-brief refusal, the actual Claude `--tools` and `--allowedTools` arguments and the Codex `--disable multi_agent` arguments, and the receipt rendering, and runs the fake transport end to end.

**What a reviewer should know.**

- **Compatibility.** The private skeleton exports change shape: `fanOutLens` becomes `lensChecklist` and `deferredProgramKind` becomes `null`; no in-repo consumer used the old name. The current compiled review identity changes; existing immutable reviews and refutations keep their recorded subjects and rendering.
- **The background route's tool surface is unobserved.** Its worker is spawned by the session and its tools are attested, not observed; the loadout compiles it serial by rule and says so. A delegating route is a separate decision ([D001](docs/evidence/WO-165/decisions.md#wo-165-d001)'s reopening condition).
- **The receipt sentence is keyed on the route's presence, not the envelope** (VER-001 N2). Every admitted route compiles serial today; a future delegating route must make the renderer read the envelope.
- **No live episode.** No feedback behavior source changed: the protocol and the transport are byte-identical to `main`, and the skeleton label and console pin are excluded from the feedback behavior identity, so the retained WO-070 live audit stands ([D003](docs/evidence/WO-165/decisions.md#wo-165-d003)).
- **Two minor defects from VER-001 are corrected at final review** within the boy-scout bound: the route comment now states that the background surface is unobserved (M1), and the fixture's residue negative control rejects delegate wording generally (M2). Neither changes a compiled byte ([D006](docs/evidence/WO-165/decisions.md#wo-165-d006), [D008](docs/evidence/WO-165/decisions.md#wo-165-d008)).

**How the review went.** A Codex session implemented the order with three adversarial read-only agents (D001 to D005). [VER-001](docs/verifications/WO-165/VER-001.md) passed all five criteria with four read-only agents, independent compiles from `dist`, a rebuild of the before hash and direct receipt rendering, and boarded M1, M2 and twelve notes in D006. [FINAL-001](docs/final-reviews/WO-165/FINAL-001.md) reproduced the per-route envelope, residue, hashes and refusals from the built skeleton, re-ran every check, integrated `main`, corrected M1 and M2, and ran the review gate.

**Integration.** `main` had published `v0.52.0` (WO-115) with skeleton `0.44.0` and console `0.3.0`. The branch fast-forwarded under the helper's named stash; the application target is retimed from `v0.51.2` to `v0.52.1` under the patch classification, the skeleton bump from `0.43.3` to `0.44.1` with the console pin and lockfile following, and the authority edition is re-minted as `WO-165/002` on the integrated source (artifact identity `WO-165/002`; verification and feedback unchanged). `main` touched none of this order's source surfaces ([D007](docs/evidence/WO-165/decisions.md#wo-165-d007)).

**Validation.** The reviewer's `npm test -- --review` on the integrated subject passed **37 passed, 0 failed, 528.81 s, 81 fresh tasks, exit 0** at code identity `683e8b374bb52897150c0ef103fe88b4d12867eb8d22bd7d3a84a79220e8f79f`, and that row binds the released bytes. `harness check` (31 surfaces), the cold-start check, `publication:check`, `plan check`, `entropy check`, `release check-surfaces --local` (51 PASS) and the four edition checks pass; the route fixture suite passes 21 of 21 and the skeleton loadout tests 24 of 24. `git diff --check` is clean and the diff adds no suppression.

This prepares application `v0.52.1` as a patch release over `v0.52.0` (`d3768d2d`), the classification the order declared. `@dotln/skeleton` moves `0.44.0` → `0.44.1`; compiler, kernel, beacons and console versions are unchanged.

Full evidence: [decisions D001 to D008](docs/evidence/WO-165/decisions.md), the [implementation record](docs/evidence/WO-165/implementation.md), the [verification report](docs/verifications/WO-165/VER-001.md), the [final review](docs/final-reviews/WO-165/FINAL-001.md) and [the order](docs/work-orders/WO-165-entropy-review-route-agreement.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-26T18:32:09.608Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-158 | 16,502,905 (Δ unavailable) / 8 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-161 | 7,818,816 (Δ -8,684,089) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-160 | 13,450,485 (Δ 5,631,669) / 7 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-070 | 8,380,589 (Δ -5,069,896) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-115 | 22,293,818 (Δ 13,913,229) / 15 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-165 | 5,016,026 (Δ -17,277,792) / 2 | 1,122,688 (Δ unavailable) | 4 (Δ unavailable) / 37,217 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-165/executor | 2,569,702 (-12,727,935) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-165/verifier | 2,446,324 (-1,575,436) | 20,701 (unavailable) | 407 (unavailable) | 12,855,951 (unavailable) | 424 (unavailable) | unavailable (unavailable) / unavailable |
| WO-165/reviewer | 10,824 (-2,963,597) | unavailable (unavailable) | 57 (unavailable) | 85,561 (unavailable) | 58 (unavailable) | unavailable (unavailable) / unavailable |
| WO-165/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-165/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-165/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
