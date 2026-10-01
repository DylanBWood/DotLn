# WO-178

A planning pass used to open on a record that missed much of what the operator saw. A close could stop short, or Claude's auto-mode classifier could deny the publish, without a trace. Most operator corrections went unrecorded, and long phases and repeated gate runs were counted by hand. This pull request lands WO-178. The Claude hooks now journal each host permission denial and each operator message, by digest and class and never by text. The Stop advisory names background dispatches still running, and `plan failures` and `plan start` count what the journals and control logs hold. Under Claude auto mode, the one command the lifecycle has already authorized, the exact release-close publish helper, is admitted by the permission hook instead of waiting on a classifier verdict.

- **Denials.** A new `PermissionDenied` hook writes the tool name, an input digest and byte count, the bracketed rule name, and the order, role and phase. It then prints one advisory naming the operator's two routes, the `!` prefix and `/permissions` → Recently denied, and it requests no retry.
- **Interventions.** Every Claude or Copilot prompt gets a row with its digest, byte count, control-prefix class or `unclassified`, transcript-correlated route (or `unknown`), order, role and phase. Codex records only the dispatch phrase it can see, and its rows say so.
- **Monitors.** At Stop, the advisory lists dispatches this session journaled that have not finished, beside the expected completion event.
- **Counts.** `plan failures` reports five local counts: close records with a blocker or an unpublished tag, host denials, interventions by class, order and phase, phases above twice their median, and product-gate rows at an identity already green. `plan start` prints them with the delivery/machinery/evidence split of the last eight closes, read from an optional `**Track:**` header that defaults to `unknown`.
- **Operator words.** `docs-check` gives a counted advisory for a work-order provenance field or decision that quotes the operator without a capture digest, in either header layout. Historical records are fingerprinted, and a bounded pass paraphrased 30 of them.
- **Carry-ins.** Malformed decision JSON now names its record without a parser excerpt. The shell diagnostics attribute more conservatively and stay within fixed work bounds.

**The permission hook's first `allow`.** Until now the generated permission hook only refused or deferred. It now returns `permissionDecision: allow` for one command only: `'/path/to/node' '/path/to/main/scripts/release.mjs' close WO-NNN --publish` or `--dry-run`, optionally with canonical `--material` words, byte for byte. Three lifecycle facts must also hold: the session's recorded dispatch is `release-close` for that order, the working directory is the main checkout, and canonical status lists `release-close` as legal. All five DotLn refusals and an outside-write deny still take precedence, and host deny and ask rules still apply. Whether Claude Code honors the allow in auto mode is checked at the first live close after merge.

**Integration and version.** The order was executed on `v0.60.1` (`2f525014`) and integrated over WO-103, WO-102, WO-181 and WO-105 at `54c29c12`. WO-105 had already published `v0.61.1`, so application `v0.61.2` is a patch release. The compatible patch bumps move above main's labels: `@dotln/compiler` 0.22.1, `@dotln/skeleton` 0.49.1 and harness host 0.34.1. Both orders had changed registered evidence sources, so the authority, artifact-identity and verification editions are re-minted deterministically as WO-178 revisions 004, 002 and 002. The feedback edition carries WO-181's live audit with no live episode ([D022](../../evidence/WO-178/decisions.md#wo-178-d022)).

**Validation.** `npm test -- --review` passed on the integrated tree: 43 suites, 0 failed, 810.53 s, 88 fresh tasks, at code identity `9ee66ec2faa53e1f53b0706e5f00582a0126ffac81e62ffce75214b909252afd`. `npm run test:docs` passes. [VER-001](../../verifications/WO-178/VER-001.md) passed. [FINAL-001](FINAL-001.md) failed criterion 6, because the operator-word check never read a provenance field inside a header paragraph ([D015](../../evidence/WO-178/decisions.md#wo-178-d015--final-review-finding-the-operator-word-check-never-reads-a-provenance-field-in-a-header-paragraph)). After the repair, [VER-002](../../verifications/WO-178/VER-002.md) reported 165 of 168 injected provenance fields, and the other three cite their own digest. [FINAL-002](FINAL-002.md) passed.

**After the report.** Once FINAL-002 was filed, the reviewer folded the admission into one sentence of the README's "What runs today" block, which had said every other judgment defers to host permissions. This is release prose only, so the code identity is unchanged.

**Known limits.**
- **Live behavior.** The admission and the denial journal are fixture-witnessed. The first auto-mode close after merge is their live check.
- **Retries.** No retry command that release close prints is admitted yet, because each starts with bare `node`. [D012](../../evidence/WO-178/decisions.md#wo-178-d012--verification-boards-the-unadmitted-material-retry-spelling), widened by [D023](../../evidence/WO-178/decisions.md#wo-178-d023--final-review-widens-d012-every-retry-release-close-records-prints-bare-node), routes the shared spelling.
- **Counts.** Host task notifications are counted as operator messages (D014), and a typed correction does not yet withhold the admission (D013, latent).
- **Operator-word reach.** The check is lexical and cannot see unquoted words.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T18:46:46.778Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-176 | 41,822,452 (Δ unavailable) / 6 | 4,013,405 (Δ unavailable) | 4 (Δ unavailable) / 64,961 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 3 (Δ unavailable) | 3 (Δ unavailable) |
| WO-103 | 5,080,866 (Δ -36,741,586) / 3 | 1,414,182 (Δ -2,599,223) | 6 (Δ 2) / 89,134 (Δ 24,173) | 38,256,997 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 1 (Δ -2) |
| WO-102 | 6,903,085 (Δ 1,822,219) / 3 | 1,414,302 (Δ 120) | 3 (Δ -3) / 16,084 (Δ -73,050) | 37,366,239 (Δ -890,758) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 0) | 2 (Δ 1) |
| WO-181 | 6,364,541 (Δ -538,544) / 3 | 1,788,507 (Δ 374,205) | 4 (Δ 1) / 45,954 (Δ 29,870) | 40,317,429 (Δ 2,951,190) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -1) | 1 (Δ -1) |
| WO-105 | 9,351,472 (Δ 2,986,931) / 3 | 4,580,821 (Δ 2,792,314) | 3 (Δ -1) / 19,100 (Δ -26,854) | 44,067,562 (Δ 3,750,133) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 3 (Δ 2) |
| WO-178 | 10,600,186 (Δ 1,248,714) / 5 | 2,740,715 (Δ -1,840,106) | 4 (Δ 1) / 87,371 (Δ 68,271) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -3) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-178/executor | 7,461,902 (815,496) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-178/verifier | 2,349,057 (1,666,198) | 19,951 (12,113) | 143 (88) | 23,067,064 (15,904,811) | 157 (98) | unavailable (unavailable) / unavailable |
| WO-178/reviewer | 789,227 (-1,232,980) | 118,770 (88,838) | 104 (35) | 11,760,369 (3,838,895) | 116 (37) | unavailable (unavailable) / unavailable |
| WO-178/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-178/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-178/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
