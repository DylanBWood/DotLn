## What this merges

WO-005, the `v0.2.2` patch rung: the roadmap's first capability-progression
implementation — a reviewed, evidence-linked Markdown table at
`docs/planning/capability-table.md` plus its `docs/README.md` map line.
Documentation only: no code, dependency, or test-chain change.

- **12 capability rows** (kernel event loop, cadence, authorization guard,
  store/replay, continuations, walking-skeleton vertical, composition
  compile, transports, verification, projections, publication bootstrap,
  audit projections), each carrying current/target level, required
  dimensions, evidence links, dependencies, last-change date, next smallest
  promotable increment, blocking gate, and efficiency.
- **Levels only from admissible evidence** at the pinned revision
  `e3f8cbd`: composites are the minimum of their dimensions (no averaging),
  five rows are explicit `0 — latent` with source/outcome links, and every
  efficiency cell is `E0 — unknown` — no fabricated baselines.
- **Recorded progression policy:** breadth first / one skill point better,
  verbatim from the roadmap's policy list, with rationale; every target is
  exactly current+1; the visible-payoff pacing rule is restated as binding.

## Evidence

- 37/37 evidence links resolve at the pinned revision; all three heading
  anchors match.
- All five acceptance criteria re-established independently at final review:
  min-of-dimensions recomputed for all 12 rows, the policy verified verbatim
  at its roadmap source, every numeral in the table body classified (no
  counts used), every non-latent row's blocking gate concrete.
- Executable evidence green first-hand at review: 68/68 root release-evidence
  tests; 22/22 WO-101 corpus-harness tests (cited by three rows and confirmed
  intentionally outside the root evidence chain).
- Declared evaluable subsets match the kernel source switches exactly;
  negative claims (empty required-evidence list, untested verifier
  rejection, uncovered CLI, no transport adapter or compiler package)
  re-established against the tree.

## Verification trail

- `docs/verifications/WO-005/VER-001.md` — pass; all five acceptance
  criteria; one non-blocking finding (observation-window start date).
- `docs/final-reviews/WO-005/FINAL-001.md` — pass; applies the one bounded
  wording correction VER-001 proposed (window start 2026-08-31 → 2026-08-30,
  matching first-hand `git blame` evidence), proven one-line-contained
  against the pre-review checkpoint; records four VER-001 errata and five
  carried note-grade findings.

## Known open items

- Post-merge, the separately authorized `resume: release close` evaluates
  `v0.2.2` as the first boundary **above** the published `v0.2.1` tag — an
  eligible publish, executed only under the operator's explicit phrase. This
  PR performs no release action.
- Carried notes are enumerated in FINAL-001, the largest: the authorization
  row's expiry/resource branches are closed by an uncited kernel test file;
  the kernel's positive-interval `Every` guard has no test; kilobyte-wide
  table rows will make future cell diffs hard to review; implementer
  attribution is not recorded in any durable artifact.
