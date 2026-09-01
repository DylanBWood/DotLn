# WO-012 final review FINAL-001

**Subject:** branch `wo-012`, working tree (uncommitted), 2026-09-01. Base
`49a3841` (= `origin/main`). Change set: 10 tracked files, 204 insertions /
37 deletions at review time (191 insertions / 29 deletions across 8 files
excluding the control plane), plus the new untracked
`docs/verifications/WO-012/VER-001.md`.
**Authority:** `docs/work-orders/WO-012-release-gate-path-quoting.md`,
including its ideation breakout receipt of 2026-09-01. The work order is
unmodified by this review.
**Inputs reviewed:** the work order end-to-end; the complete verification
sequence (`VER-001`, pass, the only report); the full diff; executable
evidence re-established first-hand; the ledger, roadmap, and execution-guide
surfaces the receipt names; the clean-room boundary.
**Reviewer:** Fable 5, ultracode effort, fresh session dispatched by
`resume: final review`. WO-012 permits any capable model.

**Verdict: WO-012 passes final review.** No blocking finding. One
major-grade candidate was adversarially refuted at that grade and is recorded
below as a carried non-blocking finding with the follow-up path the work
order itself prescribes. No corrections of any kind were applied — the
subject leaves this review byte-identical to the subject VER-001 passed,
modulo only the control-plane's own lifecycle events. The branch is ready
for operator review and merge.

## Subject integrity, proven bitwise

VER-001 recorded the subject diff hash
`7a8adae99db0f2210b9f0653c8b62415ca773ef79d952ff03d1ddd75320073cb`. That
exact hash was re-derived in this episode, not trusted: the verification-time
tree was reconstructed in a scratch worktree at base `49a3841` (current
contents of the eight non-control files; `resume.jsonl` truncated by the two
post-verification events; `current.md` re-rendered for the `verifying` state
from `resume.mjs`'s own `render` function), and `git diff --binary |
shasum -a 256` over that reconstruction reproduced `7a8adae9…` exactly. The
tree under final review therefore differs from the tree VER-001 passed by
precisely the two legitimate control events (`VerificationCompleted` pass,
`FinalReviewRequested`) and their regenerated projection — nothing else, to
the byte. This also resolves the review's own concern that VER-001's
integrity anchor might not survive phase transitions: it does, by
reconstruction.

Further anchors, all verified first-hand:

- Dispatch checkpoint `refs/dotln/checkpoint/WO-012/2` (`215d4dd3…`, minted
  by the `final-review` transition before this review touched anything)
  differs from the working tree only by that transition's own event append
  and projection; `VER-001.md` on disk is byte-identical to the checkpoint's
  snapshot of it.
- Current subject hashes: full diff `4b8cdaf4…`, diff excluding
  `docs/control` `57330485…` — identical before and after the review
  fan-out, as is the SHA-256 of
  `git status --porcelain=v1 --untracked-files=all` (`1ce04b37…`). The
  8-agent review modified nothing.
- `docs/control/resume.jsonl` is a pure five-event append against base
  (activate → implementation-ready → verify → pass → final-review), the
  sequence is legal, and `current.md` matches `resume.mjs`'s `render` of the
  folded log exactly. Checkpoints WO-012/1 and WO-012/2 exist and match
  their control-log lines.

## Final evidence summary

All executable evidence was re-established in this episode, not inherited:

- `npm test` from the repository root, twice: `backup-intake`, `resume`,
  `checkpoint`, `worktree`, and `release` suites all pass, then **68/68 node
  tests, exit 0**.
- Static checks: `node --check` on both changed scripts, `bash -n` on both
  changed suites, `git diff --check` — all clean.
- The required before/after classification capture was reproduced
  independently in a scratch repo with `core.quotePath=true`: the
  line-delimited reading yields
  `before_candidate="docs/intake/images/Screenshot 2026-08-30 at
  10.01.24\342\200\257PM.jpg"` / `before_allowed=false`; the NUL-delimited
  reading yields the literal path, `after_allowed=true`, hex suffix
  `3234e280af504d2e6a7067` — matching VER-001's capture value for value,
  with U+202F confirmed as bytes `e2 80 af`.
- Mutation sensitivity, re-established and deepened: the current suites run
  against the base-`49a3841` scripts exit 1 (release suite first fails at
  the exact-match refusal `test-release.sh:143`, worktree suite at
  `test-worktree.sh:111`); additionally, single-arm mutants reverting only
  the `changedFiles` diff arm or only the `ls-tree` arm are each caught by a
  distinct manifest assertion (`test-release.sh:281` and `:320`), so both
  arms are independently load-bearing, not vacuously covered.

## Verification-sequence soundness

The single-report sequence (VER-001, pass, no findings) soundly supports
closure. Every line citation in VER-001 was checked against the current
files and is accurate; its acceptance-criteria table maps to real, currently
present assertions; its evidence-gate claims reproduce. One disclosed
irregularity was weighed: the verifier briefly edited the subject
mid-verification (paraphrasing the deliberate operator quotation
"fix in place"), then fully restored it after operator clarification. The
restoration is not taken on trust — the bitwise hash reconstruction above
proves the subject returned to the exact verified state — and the episode is
disclosed honestly in VER-001, so it does not contaminate closure.

## The refuted major, recorded

The documentation lens raised as major: with the guide correction applied,
three untouched surfaces still assert the old "reviewed merged commit"
release semantics — `docs/product/06-roadmap.md:77-78` ("the tag names the
reviewed merged commit"), `docs/product/10-ir-compatibility.md:50`
("Release manifests are created from the reviewed merged commit"), and the
historical ledger entry at `docs/lineage/idea-ledger.md:389` — while
`07-execution-guide.md:162-166` now accurately states the command tags
synchronized `origin/main` HEAD, including later contained commits.
Adversarial verification split 1–2 and the major grade is refuted: all three
residual lines are byte-identical to base (`10-ir-compatibility.md` has no
diff in this subject at all), so the doc-vs-code inaccuracy pre-dates WO-012
and this subject strictly reduced it on the one surface its authority named;
the work order deliberately bounded the correction to that one guide
sentence and itself prescribes the remedy for anything beyond it ("open it
as a separate defect", WO-012:75); and harmonizing
`10-ir-compatibility.md` — compatibility-contract text — inside a final
review would be a substantive change the final-review gate forbids.

**Carried as a non-blocking finding:** the live spec surfaces
`06-roadmap.md:77-78` and `10-ir-compatibility.md:50` should be harmonized
with the corrected guide semantics in a scoped follow-up defect, after
deciding whether reviewed-merge-commit pinning is the intended contract (a
decision WO-012 defers; its non-goals forbid changing which commit is
tagged). The append-only ledger entry stays as history. In the ordinary
lifecycle — close immediately after merge, including the expected WO-012
close itself — the residual sentences remain true; they are imprecise only
in the intervening-PR case that WO-012's own episode exemplifies.

## Corrections applied by this review

None. No wording, link, or metadata correction was needed; the subject is
untouched.

## Remaining deviations and open questions

Note-grade observations from the review fan-out, each verified in context;
none requires a change to the subject:

- **maxBuffer asymmetry:** `worktree.mjs`'s `runPathList` inherits Node's
  1 MB `spawnSync` default while `release.mjs`'s helper runs under
  `execute`'s 16 MB; a pathological ignored listing could spuriously block
  `worktree finish`. Not a regression — the pre-change `run()` had the same
  default — and the live worktree's full ignored listing measures ~12 KB.
- **`ensureClean` diagnostic:** its refusal message still embeds the
  C-quoted porcelain line for a non-ASCII dirty path. Its empty/non-empty
  decision is encoding-independent — the work order's "audit it, record
  that it is unaffected, and leave it alone" is honored; the unquoted-path
  requirement was scoped to the three converted sites.
- **UTF-8 decode fidelity:** both new readers decode with `encoding:
  "utf8"`, so a hypothetical invalid-UTF-8 filename would surface as U+FFFD
  in messages and manifests; NUL delimiters and ASCII predicates survive
  decoding, so classification stays correct. Everything macOS/APFS can
  create is valid UTF-8; outside acceptance scope.
- **No newline-in-filename fixture:** the work order's stated reason for
  `-z` over `core.quotePath=false` (newline survival) is not pinned by any
  fixture; a future reader rewrite could regress it silently while both
  suites stay green. AC5 requires only byte-sequence assertions and U+202F,
  both satisfied. Follow-on coverage candidate.
- **Checkpoint gap:** `ImplementationReady`, `VerificationRequested`, and
  `VerificationCompleted` all carry `checkpointUnavailable: true` (sandboxed
  verifier could not write `.git`), so no restore point protected the
  uncommitted subject between activation and final-review dispatch. Honest,
  loud, by design; the WO-004 FINAL-001 O-a retention/recovery follow-on
  remains the named home for the root cause.
- **Operator note discharged:** `origin/revert-6-wo-004` is no longer
  present on the remote — already deleted. `origin/main` still equals base
  `49a3841`; the latest published tag remains `v0.2.0`, consistent with the
  recorded deferral.
- **Clean-room: pass, no violations.** Category sweep over the full diff
  plus VER-001 (tracker/ALM product names, predecessor names,
  managed-host/gateway and employer terms, internal hostnames, URLs,
  identifiers): zero real hits; fixture identities are RFC-reserved;
  `docs/intake/` remains gitignored and is cited by path only; the sole
  verbatim intake carry-over is the sanctioned two-word operator phrase
  "fix in place".
- **Release:** tagging `v0.2.1` is a separately authorized post-merge
  action via `resume: release close`; nothing in this review performs or
  implies it.

## Proposed PR

- **Title:** `:bug: WO-012: release-gate path quoting fix`
- **Body:** `docs/final-reviews/WO-012/PR.md` (committed alongside this
  report).

## Ready to merge

Closeout from here, per the playbook: record `final-review-result pass`
(mints checkpoint 3), commit the reviewed state, publish with the guarded
`worktree publish` step (quoted title). The operator retains merge
authority. After the merge, the separately authorized `resume: release
close` runs `npm run release -- close WO-012 --publish` from the main
checkout — the ordinary form this time, since merged main carries the
`release` script — and cuts annotated `v0.2.1` carrying WO-004's content
plus this fix.

## Method

Review orchestrated as an 8-agent workflow at ultracode effort: five
independent lenses (implementation correctness, test-suite soundness,
work-order compliance and verification-sequence integrity, documentation
consistency and the ideation receipt, clean-room), and three adversarial
refuters on distinct modes (reproduce / contract-text / independent skeptic)
for the one major-grade candidate; note-grade observations passed through
unverified by design and were spot-checked by the lead. The lead reviewer
independently reconstructed VER-001's subject hash bitwise, re-ran the full
evidence gate twice, reproduced the before/after capture and both pre-fix
mutation runs, read the release-close tagging path against the corrected
guide prose, and verified the checkpoint refs and control-log
append-integrity first-hand. No agent modified the repository (status and
diff hashes identical before and after).
