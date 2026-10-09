# WO-073

A registered repository's class is now a real layer of policy instead of an opaque name: `dotln.config.json` gains a `classes` section, each class declares the checks every member order's compiled `requiredEvidence` must carry and the supports every member equips, and the host adapter applies the class before the repository's own authority profile, so two repositories in one class run with the same shared equipment and evidence. A registration may also declare one profile document that activation checks for containment and readability and the executor reads on demand for the order's `Repository:` id, never at cold start, and it may declare the machine logins and link hosts of its review bots, so a bot that runs as a user account is classed as automated review and a bot comment that links to a declared host is stored instead of refused. Before this change `repositoryClass` was validated and read by nothing, a repository had no place to say how it is built and reviewed, and the loop WO-066 runs stopped on the first refused bot item (WO-065 D015).

**The class layer.** `applyRepositoryClass` in `scripts/lib/authority-grants.mjs` unions the class's checks into the active mechanic's `requiredEvidence`, links each support not already linked into the one participating link group, and refuses by layer, naming the class with `CLASS LAYER:`, when a check is not declared by the launchpad's WorkOrder, envelope or support definitions, when a support is not declared by the loadout, or when a class support would widen authority. Layers compose launchpad → class → repository and only union: a repository profile adds its own evidence to the WorkOrder and narrows, and the exact registered-repository grant stays the only widening route ([D008](../../evidence/WO-073/decisions.md#wo-073-d008)). `registeredProfileMismatches` names a class check or support the compiled program omits, and the resident binder and the vertical runtime pass the class table through it.

**The profile and the two declarations.** The loader validates an optional `profile` as a relative normalized POSIX path and validates `automationLogins` and `linkHosts` as string sets that default to empty; `repositoryProfiles` joins the document roots, defaulting to `docs/repositories`, whose [README](../../repositories/README.md) states the convention, its sections and the place for WO-119's `dotln-discovery` block. Activation refuses an order against a repository whose declared profile is absent, not a contained regular file or unreadable, naming the path, and prints one advisory for a repository that declares none. The target request carries the registration's logins and hosts to every observer route (the direct `observe-pr`, which gains `--request`, the review loop and the vertical), where a declared login is lowercased and matched as automation and the declared hosts extend only an automation comment body's allowlist; inline paths, thread ids and check names keep the original screen, and classification never changes triage or verification.

**Read before merging.** Every registration must now name a class the `classes` section declares; a registration made before this change adds an empty declaration for its class name and keeps its behavior, and this repository ships no configuration file. A `linkHosts` value the observer's allowlist would refuse (a wildcard, a URL, a single-label host or a host with a port) loads and then refuses the first automation observation whole with a generic message; it is boarded as [D010](../../evidence/WO-073/decisions.md#wo-073-d010) with its rule. The closed WO-111 seed generator still writes a registration without a `classes` section and would refuse to load if run again, boarded as [D011](../../evidence/WO-073/decisions.md#wo-073-d011); a tree-wide search found no other writer of that shape. The executor's generated skill gains one sentence, 230 bytes, and stays within its cold-start ceiling.

**Validation.** [VER-001](../../verifications/WO-073/VER-001.md) passed every criterion with fresh probes that varied membership, layer order, symlinked components, a FIFO, login case and host shapes, and recorded the two follow-ups above. This review found `main` at the order's base, so integration changed no byte of the judged subject; it re-ran the three criterion suites and the role oracle (31 of 31 under the bounded runner), measured the executor's cold start at 28,112 of 29,246 bytes in both skill roots with the other five roles unchanged, and ran the harness, publication, release-surface, document-ceiling, comment and index checks. At the unchanged code identity `acc59de0…` the executor's `npm test -- --review` row passes 37 suites and 89 fresh tasks in 1,534.5 s and is the gate this review reuses; `npm run test:docs` passes 32 of 32 suites in 131.5 s. Details are in [FINAL-001](FINAL-001.md).

Application v0.73.0, a minor release over v0.72.0. Skeleton advances to 0.57.0 for the regenerated executor skill, with the console pin and lockfile updated; no dependency is added.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-09T20:27:40.057Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-199 | 29,582,201 / 8 | 5,878,530 | 6 / 46,146 | 158,505,935 /  | 768 | 3 | 0 |
| WO-074 | 9,334,169 (Δ -20,248,032) / 3 | 1,043,999 (Δ -4,834,531) | 29 (Δ 23) / 304,340 (Δ 258,194) | 34,680,535 (Δ -123,825,400) /  | 768 (Δ 0) | 2 (Δ -1) | 0 (Δ 0) |
| WO-188 | 45,120,571 (Δ 35,786,402) / 9 | 7,770,554 (Δ 6,726,555) | 13 (Δ -16) / 219,325 (Δ -85,015) | 201,144,864 (Δ 166,464,329) /  | 768 (Δ 0) | 4 (Δ 2) | 0 (Δ 0) |
| WO-190 | 16,674,127 (Δ -28,446,444) / 3 | 1,411,200 (Δ -6,359,354) | 34 (Δ 21) / 707,339 (Δ 488,014) | 51,538,743 (Δ -149,606,121) /  | 768 (Δ 0) | 1 (Δ -3) | 0 (Δ 0) |
| WO-075 | 22,435,591 (Δ 5,761,464) / 5 | 4,235,031 (Δ 2,823,831) | 22 (Δ -12) / 365,275 (Δ -342,064) | 99,012,820 (Δ 47,474,077) /  | 768 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-073 | 6,610,828 (Δ -15,824,763) / 2 | 1,534,475 (Δ -2,700,556) | 4 (Δ -18) / 37,979 (Δ -327,296) | 32,659,563 (Δ -66,353,257) /  | 768 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-073/executor | 4,277,632 (Δ -12,515,375) |  |  | 15,880,594 (Δ -69,154,348) | 125 (Δ -519) |  / 768 |
| WO-073/verifier | 2,333,196 (Δ 85,538) | 66,338 | 83 (Δ 31) | 16,635,019 (Δ 2,850,403) | 102 (Δ 47) |  /  |
| WO-073/reviewer | 14,410 (Δ -3,380,516) |  | 43 (Δ -16) | 143,950 (Δ -49,312) | 44 (Δ -16) |  /  |

44 unavailable observations omitted as blank cells or rows; unavailable is not zero; unset ceilings are not approvals of a future limit.

<!-- dotln-process-meter:end -->
