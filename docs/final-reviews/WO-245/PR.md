# WO-245 — The kit's guide is a kit file and the front page is the instance's (v0.108.0)

Until now every instance's front page was the kit's 60 KB guide, seeded as `README.md` and refreshed at each release whose template changed: the starter's page was rewritten at v0.103.0 and v0.103.1 and a fork's merge carried it both times, an instance that edited the page forked it from every later update or met a merge conflict, and a launchpad's `release prepare` refused a front page without the release block.

The guide is now `docs/KIT.md`, a manifest-listed kit file beside `docs/PLAYBOOK.md` that every update carries and that core's suites read for the kit's suite inventory, build advice and update procedure. The front page the kit seeds is a 553-byte page: the release display name, one paragraph saying what the repository is and where the guide is, the release block with its `v0.1.0` claim, and one sentence inviting the owner to replace everything. The seed's SHA-256 is pinned in the `launchpad-docs` case, so changing it is a deliberate act whose order names the one rewrite that unedited starter copies will see.

The starter refresh rewrites a starter's `README.md` only while it still equals a proven prior rendering, and reports a customized, missing or non-regular copy as kept, with its reason in a new `keptSeeds` field on the close row, while it publishes the kit files; the refusal for a customized seed now lists the other seeds only, and `CLAUDE.md` and `.gitignore` keep theirs. In a kit root whose page carries no release markers, `release prepare` writes no claim and records `not carried` in its decision, and the close's release-block check passes as `not carried`; any marker present keeps every existing refusal, and core's own page keeps its requirement.

What a reviewer should know: the release close that carries this order migrates DotLn-Enterprise-Starter's unedited page once, and a fork that edited `README.md` before taking that release meets one merge conflict, resolved by keeping its own page, which the guide, product 03 and the release notes state. `scripts/kit/README.client.md` keeps its file name although it is now the seed. Two follow-ups from verification stay boarded ([D010](../../evidence/WO-245/decisions.md#wo-245-d010): `release prepare` with no observed tag still tells a markerless kit root to assign a README claim by hand; [D011](../../evidence/WO-245/decisions.md#wo-245-d011): the close summary prints published seeds and not kept ones), and the final review boards a third ([D013](../../evidence/WO-245/decisions.md#wo-245-d013): product 07's records-branch sentence still states the claim as required).

Validation: the complete `npm test -- --review` run at code identity `9a976315…` passed on 2026-11-02 (42 suites, 112 fresh tasks, 0 h 43 min, exit 0); [VER-001](../../verifications/WO-245/VER-001.md) passed on independent probes, including the seed planner against the real starter's history, and boarded two follow-ups; [FINAL-001](FINAL-001.md) accepted the unchanged subject at that identity after integration took in nothing, replayed the kit-root release-preparation cases and boarded one documentation finding. Decisions are in [decisions.md](../../evidence/WO-245/decisions.md); the executor's account is the [handoff](../../evidence/WO-245/handoff.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-02T05:20:10.378Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase / attempts | Gate | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-239 | 18 h 46 min / 3 | 1 h 21 min | 16 / 470,970 | 245,011,339 /  | 768 | 3 | 6 | 0 | 3 |
| WO-192 | 131 h 30 min (Δ 112 h 44 min) / 3 | 7 h 14 min (Δ 5 h 54 min) | 65 (Δ 49) / 1,292,784 (Δ 821,814) | 606,266,085 (Δ 361,254,746) /  | 768 (Δ 0) | 29 (Δ 26) | 20 (Δ 14) | 0 | 1 |
| WO-240 | 5 h 48 min (Δ -125 h 42 min) / 3 | 1 h 47 min (Δ -5 h 27 min) | 34 (Δ -31) / 347,854 (Δ -944,930) | 83,676,928 (Δ -522,589,157) /  | 768 (Δ 0) | 2 (Δ -27) | 0 (Δ -20) | 0 | 0 |
| WO-247 | 10 h 14 min (Δ 4 h 26 min) / 3 | 1 h 26 min (Δ -0 h 21 min) | 50 (Δ 16) / 1,050,653 (Δ 702,799) | 233,956,844 (Δ 150,279,916) /  | 768 (Δ 0) | 3 (Δ 1) | 0 (Δ 0) | 0 | 1 |
| WO-237 | 6 h 22 min (Δ -3 h 52 min) / 3 | 1 h 45 min (Δ 0 h 19 min) | 32 (Δ -18) / 726,450 (Δ -324,203) | 361,419,625 (Δ 127,462,781) /  | 768 (Δ 0) | 2 (Δ -1) | 3 (Δ 3) | 0 | 0 |
| WO-245 | 2 h 49 min (Δ -3 h 33 min) / 2 | 1 h 20 min (Δ -0 h 25 min) | 4 (Δ -28) / 53,115 (Δ -673,335) | 83,847,285 (Δ -277,572,340) /  | 768 (Δ 0) | 1 (Δ -1) | 0 (Δ -3) | 0 | 0 |

| Dispatch | Wall (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-245/executor | 1 h 42 min (Δ -3 h 50 min) |  |  | 45,668,261 (Δ -302,309,934) | 279 (Δ -574) |  / 768 | 0 | 0 |
| WO-245/verifier | 1 h 7 min (Δ 0 h 51 min) | 55,678 | 151 | 35,554,750 (Δ 22,330,448) | 163 (Δ 94) |  /  | 0 | 0 |
| WO-245/reviewer | 0 h 16 min (Δ -0 h 18 min) |  | 96 (Δ 7) | 2,624,274 (Δ 2,407,146) | 97 (Δ 7) |  /  | 0 | 0 |

50 unavailable observations omitted as blank cells or rows; unavailable is not zero; unset ceilings are not approvals of a future limit.

<!-- dotln-process-meter:end -->
