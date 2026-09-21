# WO-148 repair 001 — VER-001 F1, F2 and F3

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

The harness version is an observed value (`ancestor-executable-lsof`) and the
model is a session readback (`claude-opus-5[1m]`); Claude Code exposes no
effective effort readback, so the effort is the order's supplied value carried
forward. The single `--source` takes the weaker of those labels.

Dispatch: `resume: fix`, 2026-09-21, recorded by the harness before this
procedure loaded. The canonical selection was WO-148 in phase `repairing` with
[VER-001](../../verifications/WO-148/VER-001.md) as its failure source, worked
in the order's own `wo-148` worktree — the sibling checkout whose physical path
criterion 3 and [D011](decisions.md#wo-148-d011) keep out of every committed
surface — with one registered writer. Zero subagents were spawned against the
cap of 20; the fan-out plan was to keep one executor and one writer in this
worktree. No branch commit, push, PR, tag publication or lifecycle repair was
performed, and the work order's own text is unchanged: a repair answers the
contract, it does not edit it.

VER-001's verdict is preserved. Its three findings were independently
reproduced by the verifier, boarded as
[D012](decisions.md#wo-148-d012)–[D014](decisions.md#wo-148-d014) with the
repair each one asks for, and answered here by
[D015](decisions.md#wo-148-d015)–[D017](decisions.md#wo-148-d017). The
verifier's F4 observation on the previously boarded `claude-cli-print`
duplicate-enum defect (D009) is unchanged: it stays deferred to its own order.
One adjacent defect was met and repaired under the bound
([D018](decisions.md#wo-148-d018), queue item `adjacent-0003`), and one claim of
this repair's own was corrected ([D019](decisions.md#wo-148-d019)).

## What changed

| Finding | Change | Where |
| --- | --- | --- |
| F1 — `--check` accepted a store retargeted through unchecked mission-source fields | `checkBinding` now decodes `resident.json` with `decodeResidentConfiguration` instead of reading it as plain JSON, and `bindingMismatches` compares every field the binding record declares — `root`, `contractPath`, `decisionsPath`, `baseCommit`, `declaredSurfaces`, `decisionLimit`, `visionPath`, `thesisHeadings` — with arrays compared element by element rather than as joined text. A field the store declares and the record does not (`storyPath` is the one the protocol admits) is named the same way. A store that no longer decodes is named as a mismatch, and no launch line is printed in either case. | `scripts/resident-bind.mjs`: `DECLARED_SOURCE_FIELDS`, `sameStructure`, `bindingMismatches`, `checkBinding` |
| F2 — a successful check of a relocated retained store printed unusable paths | `checkBinding` returns the resolved directory that was checked, and every emitted line — launch, tick, presence, status, `DOTLN_RESIDENT_STORE`, the next `--check` — plus the success and stale headings now name it. When it differs from the path the store was bound at, that path is printed once as `bound as` provenance. | `scripts/resident-bind.mjs`: `samePath`, `checkBinding`, `main` |
| F3 — a configured control root could put physical paths on a Git-visible surface | Before the store directory is created, `assertIgnoredStore` asks Git (`check-ignore -q`) about the exact two files the bind is about to write and refuses by name, naming the lane to ignore, when either is visible. The question is asked for every bind, not only for a configured control root, and a Git failure refuses rather than passes. The check runs before the capsule is built, so a refusal costs nothing and leaves nothing behind. | `scripts/resident-bind.mjs`: `STORE_FILES`, `assertIgnoredStore`, `bindOrder` |

## Executed evidence

| Check | Result |
| --- | --- |
| `npm test` (full product gate, final bytes) | **Pass: 23 suites, 0 failed, 266.62 s, 67 fresh tasks**, exit 0, recorded against tree `f314c86b`, with `PASS resident-bind 5.60 s` observed inside the run. |
| `npm run test:docs` (the `--document` set the gate excludes) | **Pass: 19 suites, 0 failed, 27.39 s**, exit 0. It carries the formatter check, the publication check and the document fixtures. Rerun after these decisions and this report were written: 19 passed, 0 failed, exit 0 again. |
| `npm test` (first run, before formatting) | Pass: 23 suites, 0 failed, 279.04 s, exit 0, tree `e65e96fd`. Reported in chat at the time as though it covered every check; it did not cover formatting, which failed on both changed scripts until they were formatted. [D019](decisions.md#wo-148-d019) records the correction and this table reports both runs. |
| `npm run format:check` | Named `scripts/resident-bind.mjs` and `scripts/test-resident-bind.mjs` before the fix; reports `All matched files use Prettier code style!` after. |
| `node --test scripts/test-resident-bind.mjs` | Pass: **13 tests, 0 failed, 4.58 s** at the formatted bytes, up from the 10 VER-001 judged. |
| Defect-restored controls (three runs) | With the F1 comparison, the F2 printing and the F3 assertion each put back into the shipped file one at a time: F1 fails exactly `--check names a store retargeted through any declared source field` and the `bindingMismatches` unit case (11 pass), F2 fails exactly `a moved store keeps its binding, and a directory without one refuses` (12 pass), F3 fails exactly `a configured control lane Git can see refuses the bind that would fill it` (12 pass). No new case passes vacuously, and none of them fails for an unrelated reason. The shipped file was restored and its sha256 compared before and after each run. |
| `--check` against the four real retained WO-148 stores | All four are refused as stale on the phase the order has since moved to (`active` → `repairing`), the first also on contract bytes, with no launch line printed for any of them. Each store's 290 KB `resident.json` decoded, so decoding at check time is not a new failure mode on real stores. |
| `git diff --check` | Pass, before and after the write-backs. |
| `npm run publication:check` | Both editions were stale after the product 03 edit; their source locks were refreshed to the printed current values and the check reports 30 and 45 linked source sections CURRENT, with 273/273 product headings indexed. Exit 0 again after the adjacent edition repair. |
| `node scripts/release.mjs check-surfaces --local` | Pass. The release classification is unchanged: this repair touches `scripts/` and documents only, so no package `src` changed and no component version moves. |
| `npm run meta`, `npm run work-orders -- index` | Ran; the decisions index and the work-order index carry D015–D019 and the current phase. |
| Manifest | No dependency added or changed; the ignore query uses `git`, which the command plane already requires. |

The disposable probes and the defect-restored controls ran under the granted
DotLn session scratch and the system temporary area, and were removed. They
filed no physical path or private content.

## What the regressions now hold

- **Per-field retargeting.** One fixture retargets `decisionsPath`,
  `visionPath`, `thesisHeadings`, `decisionLimit`, `declaredSurfaces` and
  `storyPath` one at a time, leaving the worktree, phase, base and contract
  bytes exactly as bound, and asserts each is named, exits non-zero and prints
  neither a launch line nor a `DOTLN_RESIDENT_STORE` line. The declared-surface
  case is the joined-text counterexample: one surface whose text is the two
  bound surfaces joined, which the old comparison could not tell from the pair.
  A store stripped of its worker is named as no longer decodable, and the
  restored bytes check clean again, so the mutations failed rather than the
  check.
- **Relocation.** The moved-store fixture still accepts the relocation and now
  asserts that all seven printed commands name the checked directory, that the
  provenance line names the bound one, and that no printed command names the
  directory the store left.
- **The ignored lane.** Two fixtures bind a launchpad configured with
  `roots.control` set to a non-default path. Without a matching ignore rule the
  command exits 1, names the lane, leaves no lane directory behind and keeps
  `git status --porcelain --untracked-files=all` empty; with the rule present
  the same bind writes the store, Git still sees nothing, `check-ignore`
  matches both files and `--check` accepts the result.

## Write-backs

- `docs/product/03-architecture.md` §Operator-presence policy: what `--check`
  compares is now stated field by field, including that the store must still
  decode; the relocated-store behaviour is stated; and the ignored-lane
  sentence says that bind asks Git and refuses rather than trusting the
  configuration.
- `packages/skeleton/README.md` resident runbook: the same three corrections in
  the operator's short form.
- `docs/evidence/WO-148/decisions.md`: D015, D016 and D017 with evidence,
  rejected options and reopening conditions, and a repair-time goal and
  system-trap judgment beside the implementation's.
- `docs/publication/*-toc.md`: both edition source locks refreshed, and the
  software-engineer edition's chapter 13 bullet corrected from "the default-off
  economy support" to the delivered default with its per-order opt-out
  ([D018](decisions.md#wo-148-d018)).
- `docs/lineage/decisions-index.md` and the work-order index: regenerated.

## Limits and handoff

- The live row (criterion 4) was collected before this repair and is unchanged.
  Nothing in the repair alters what a bind writes into a store: the capsule,
  the binding record and the store layout are byte-identical in construction,
  and the only new bind-time behaviour is a refusal before anything is written.
  A fresh verifier judging criterion 4 is judging the same filed row.
- The repaired `--check` was exercised against real stores only in the stale
  direction, because this order's own phase has moved; the fresh direction is
  covered by the fixtures and by the four stores' decode.
- `git check-ignore` is the only authority the bind now trusts for the lane. A
  launchpad that keeps its control lane out of Git by some other means would be
  refused; D017 records that as a reopening condition rather than a guess.
- The follow-up queue is at revision 12 with nothing running and nothing next:
  `adjacent-0001` and `adjacent-0003` are completed and `adjacent-0002` stays
  deferred with its recorded disposition. `adjacent-0003` was the edition
  write-back above: queued with its cause, fix, paths and checks, announced as
  an intent, started after a check-in at a safe boundary, and completed with
  both declared checks passing.
- The Tinkerer economy support's one experiment for this order is
  [D007](decisions.md#wo-148-d007), recorded at implementation and read before
  this repair; no second experiment was started, which is what the support
  asks.
- One inherited advisory was carried into review a second time. The
  `repair-complete` transition repeated the planning-handoff advisory the
  implementation report already records: `adjacent-0002`'s deferred `target`
  names its intended order in prose rather than the public identifier
  `FUP-e2877e300cc8813a`, which now exists. The queue accepts mutation in the
  `repairing` phase, so this repair could have corrected that field in one
  command and did not — the planning check was not run until the transition
  raised it. The phase is now `ready-to-verify` and the queue refuses mutation
  outside the executor and fixer phases, so the field stands as it is; the
  follow-up itself is not lost, since D009 and the public identifier both
  record the defect. Correcting the field needs a later fix dispatch or the
  planner, and that is the operator's call, not a dispatch this session invents.
- Verification and final review remain their own dispatches. This repair claims
  a passing gate and the regressions above, not a verdict.

## Process cost

Entry counters were unavailable at dispatch (`counter-unavailable` for every
token counter, source unavailable, scope and cutoff unknown), so no entry total
was observed. The handoff figure is stated in the response that records this
repair, read from `node scripts/harness.mjs usage <session>` with source
`claude-transcript-message-usage` and scope dispatch; at the last reading before
this line it was inputTokens 202, cachedInputTokens 18,688,342,
cacheWriteInputTokens 258,325, outputTokens 86,475, totalTokens 19,033,344, with
reasoningOutputTokens and costUsd unavailable and a cutoff of
2026-09-21T19:44:34Z, so it does not include the work after that cutoff.
Subagents: 0 observed against a cap of 20, exact-observed, with no unresolved
admissions. Unavailable is not zero, and it blocked nothing.

Where the wall-clock went: two full gates at 279 s and 267 s, one document set
at 27 s, three focused suite runs at about 4.5 s each, three defect-restored
control runs, and four real-store checks. The second gate is the price of the
correction in D019; the controls cost about 20 s in total and are what
distinguishes a regression that holds from one that merely passes, since
trusting a green suite I wrote myself for the defects I was repairing costs
nothing and proves nothing.
