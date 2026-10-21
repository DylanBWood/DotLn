# WO-223

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-21T01:15:04.761Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-213 | 134,447,701 / 17 | 22,402,170 | 5 / 112,588 | 668,089,623 /  | 768 | 10 | 20 |
| WO-216 | 32,367,283 (Δ -102,080,418) / 8 | 2,369,456 (Δ -20,032,714) | 4 (Δ -1) / 101,998 (Δ -10,590) | 230,013,207 (Δ -438,076,416) /  | 768 (Δ 0) | 4 (Δ -6) | 2 (Δ -18) |
| WO-221 | 53,003,892 (Δ 20,636,609) / 8 | 15,148,361 (Δ 12,778,905) | 9 (Δ 5) / 111,080 (Δ 9,082) | 317,775,244 (Δ 87,762,037) /  | 768 (Δ 0) | 18 (Δ 14) | 6 (Δ 4) |
| WO-222 | 23,844,006 (Δ -29,159,886) / 3 | 11,838,991 (Δ -3,309,370) | 6 (Δ -3) / 99,580 (Δ -11,500) | 104,345,945 (Δ -213,429,299) /  | 768 (Δ 0) | 1 (Δ -17) | 2 (Δ -4) |
| WO-218 | 37,732,376 (Δ 13,888,370) / 5 | 8,763,906 (Δ -3,075,085) | 6 (Δ 0) / 53,926 (Δ -45,654) | 315,728,937 (Δ 211,382,992) /  | 768 (Δ 0) | 2 (Δ 1) | 1 (Δ -1) |
| WO-223 | 7,709,818 (Δ -30,022,558) / 2 | 2,997,005 (Δ -5,766,901) | 8 (Δ 2) / 77,673 (Δ 23,747) | 63,814,496 (Δ -251,914,441) /  | 768 (Δ 0) | 0 (Δ -2) | 0 (Δ -1) |

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-223/executor | 4,929,842 (Δ -20,050,859) |  |  | 21,352,570 (Δ -166,495,977) | 174 (Δ -1,067) |  / 768 |
| WO-223/verifier | 2,779,976 (Δ -2,992,658) | 132,031 (Δ -241,031) | 163 (Δ -218) | 42,364,041 (Δ -85,312,422) | 196 (Δ -222) |  /  |
| WO-223/reviewer | 10,077 (Δ -6,968,964) |  | 67 (Δ 18) | 97,885 (Δ -106,042) | 68 (Δ 18) |  /  |

43 unavailable observations omitted as blank cells or rows; unavailable is not zero; unset ceilings are not approvals of a future limit.

<!-- dotln-process-meter:end -->

An exported instance that has moved an order's records into its registered target can now take a starter release and run its gates, its launchpad publish and its target publish without a step the kit did not name. The operator's instance held starter v0.87.0 as a draft update pull request because the kit's document gate failed on its moved decisions records with `document is not a readable regular file`; `docs-check` now reads a moved row through the immutable binding `readDecisions` already verified, so the gate and the checks after it run. The moved-record readers find the ignored clone mapping in the running checkout, then the primary checkout whatever branch it holds, then a worktree on `main`, so an update branch in a secondary worktree runs `npm run sync` and its gates while the primary checkout is on a planning branch; with no mapping in those three places the reader refuses naming them, where it used to read the target-registry entry. `worktree start` of a launchpad order prints one advisory when the instance declares no `contributions.operatorAuthor`, and the sign-off FAIL line names the declaration beside the trailer. The release-close advisory for a withheld helper prints the expected `--publish` and `--dry-run` spellings for the dispatched order and the mismatch class, with the admitted forms unchanged. The kit README's target publish form is the node spelling the hook admits, with the npm form named as withheld. The commit-lint refusals before a final-review pass and at publication print the subject length beside the limit, as `subject.length: 90 of 72 characters` for a 90-character subject.

Validation: [VER-001](../../verifications/WO-223/VER-001.md) judged all seven criteria met at code identity `917ceeff…`, reproduced both repair controls of criteria 1 and 2 in isolated snapshots (the repaired arm exits 0, the arm with only the fix reverted exits 1 on the recorded failure), ran a real exported instance's document gate from a secondary worktree with no worktree on `main` and saw all fourteen tasks pass, drove 21 withheld and 4 admitted helper spellings through the emitted hook, and boarded two follow-ups. [FINAL-001](FINAL-001.md) integrated `main` (nothing to take in), read the whole diff, reran the five new or changed cases and a library probe at the integrated tree, found one more follow-up in the declared surfaces and passed; the complete review row `npm test -- --review` at that identity (recorded 2026-10-20T23:38:50.498Z, 104 fresh tasks over 39 suites, exit 0, 1,942.858 s) is the row the result consumes.

Limits a reviewer should weigh: the reader no longer falls back to the order's target-registry entry, so keep the ignored clone mapping in the running checkout, the primary checkout or a worktree on `main` ([D004](../../evidence/WO-223/decisions.md#wo-223-d004)); the target publish and the pre-review commit lint still need a worktree on `main`, a limit planning receipt 051 carries with its reopening condition; the release-close advisory names the material class for a suffix that mixes a canonical material word with another mismatch, and its displayed text still ends with the host-permissions phrase twice ([D017](../../evidence/WO-223/decisions.md#wo-223-d017)); the sign-off FAIL line offers the declaration route even when an operator identity is already declared ([D018](../../evidence/WO-223/decisions.md#wo-223-d018)); a target order's start prints no sign-off advisory although its records publish meets the rule ([D020](../../evidence/WO-223/decisions.md#wo-223-d020)); and the start advisory prints at every launchpad start in an instance that declares no exemption.

Application v0.88.0 is a minor release over v0.87.0: skeleton 0.63.1, the console pin and the lockfile following, no new dependency. The full story is in [the order](../../work-orders/WO-223-an-instance-takes-a-starter-update.md), [the decisions](../../evidence/WO-223/decisions.md), [the base observations and controls](../../evidence/WO-223/README.md) and [the release notes](RELEASE-NOTES.md).
