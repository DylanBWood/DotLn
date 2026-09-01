# WO-101 final review FINAL-001

**Subject:** branch `wo-101`, working tree (uncommitted), 2026-09-01. Base,
`HEAD`, and `origin/main` all
`329820e14c55a46a987b9d788449eca14e42b6db`. Change set: 24 new files under
`corpus/` (6,859,752 bytes; the nine manifested fixtures account for
6,744,107), the operator-authorized correction to
`docs/work-orders/WO-101-program-and-hash-corpus.md`, control-plane lifecycle
state, and `docs/verifications/WO-101/VER-001.md`.
**Authority:** `docs/work-orders/WO-101-program-and-hash-corpus.md`, including
its recorded activation correction of 2026-09-01. The work order is unmodified
by this review.
**Inputs reviewed:** the work order end-to-end; the complete verification
sequence (`VER-001`, pass, the only report); every subject file; executable
evidence re-established first-hand; the kernel oracle sources and built dist;
the domain-model, ledger, and execution-guide surfaces the work order cites;
the clean-room boundary.
**Reviewer:** Fable 5, ultracode effort, fresh session dispatched by
`resume: final review`. WO-101's Model line pins Codex for the implementation
lane and explicitly permits any capable model to substitute; this review is
that sanctioned substitution and says so per §Model-specific notes.

**Verdict: WO-101 passes final review.** No blocking or major finding — the
adversarial-refutation stage was armed and ran empty because no lens raised a
candidate above note grade. Seven note-grade observations are carried below.
No corrections of any kind were applied: the subject leaves this review
byte-identical to the subject VER-001 passed, modulo only the control plane's
own lifecycle events. The branch is ready for operator review and merge.

## Subject integrity, proven bitwise

Both of VER-001's integrity anchors were re-derived in this episode, not
trusted:

- The work-order correction diff re-hashes to VER-001's exact
  `ba6d4aa4eb421acf5d65f6fc148aa525ea524d79093fe4de1e15c49d66a66a11`
  (`git diff` of the file piped to SHA-256).
- The corpus digest reproduces VER-001's exact
  `c63f5fd2bddd402c364979663509fe387c29d0c0b417214923d298c3d6996ee1`. VER-001
  did not state its recipe; it was reconstructed by trial as SHA-256 over the
  path-sorted `sha256(content)  path` lines of all 24 files (standard
  `shasum` output format), and is recorded here so the next reviewer does not
  have to rediscover it.
- Tree totals match exactly: 24 files, 6,859,752 bytes, fixtures 6,744,107.

The corpus tree and work-order correction under final review are therefore
byte-identical to what VER-001 verified. Further anchors, all first-hand:
`refs/dotln/checkpoint/WO-101/1` (`d31411b0…`) and `/2` (`63b37b7…`) exist and
match their control-log events; no ref exists for the three
`checkpointUnavailable` events, exactly as logged; `docs/control/resume.jsonl`
is a pure five-event legal append over the untouched WO-012 history; and
`docs/control/current.md` matches `resume.mjs`'s render of the folded state.
The four-lens review fan-out modified nothing — the sorted
`git status --porcelain -uall` set is identical before and after.

## Final evidence summary

All executable evidence was re-established in this episode:

- The exact work-order gate, rerun by the lead with per-step exit codes:
  `npm run build`; program `--check` exit 0; ids `--check` exit 0;
  `node --test corpus/harness/wo101-*.test.mjs` **22/22**; root `npm test`
  **68/68**. Both `--check` stdout summaries are byte-identical to the
  committed run transcript's lines, including the in-memory 85,474,032-byte
  full-artifact digest `47fc8822…`. `git diff --check` clean.
- Enumeration re-derived independently by recurrence from the constructor
  rules: layers 2 / 30 / 462 / 7290 → 7,784 ASTs × 5 contexts = 38,920
  inputs, matching the lib's actual output element-by-element, the manifest,
  the harness's hard-coded pins, and the run log. All six implemented
  constructors occur; no deferred kind appears in any enumerated AST or
  committed fixture.
- All 1,662 committed program vectors replayed through a review-written
  evaluator (own JSONL parsing, own predicate hydration from the manifest's
  declared semantics, direct dist calls): zero mismatches.
- Truth-table outcomes hand-derived from the kernel's matching semantics —
  Invoke dispatch/advance/throw/stationary = 1/3/3/162 over the exact
  2×3×4×7 Cartesian set (+1 no-event), Await advance/wait = 128/548 over
  4 pattern modes × 168 cells (+4 no-event) — and the fixture rows recomputed
  to form those products with 0 missing, 0 duplicate, 0 unexpected cells,
  from the rows themselves rather than the manifest summary. The test-side
  derivations were line-checked against `packages/kernel/src/core.ts:31-44`
  and the domain model: no kernel/spec divergence is laundered through the
  fixtures, and `corpus/manifests/findings-WO-101.md` correctly records none.
- Hash lane: reviewer-written third FNV-1a-64 implementations (BigInt,
  written fresh, independent of both the shipped BigInt version and the
  harness's pair-arithmetic reference) recomputed **every** row of both
  fixtures — all 2,054 stable-hash and all 2,048 command-id vectors agree,
  with preimages re-derived from the spec's `ep:`/`ws:` + empty-episodeId
  rule. All six published anchors verified against the live RFC 9923 §8.3
  text, including the three NUL-inclusive block values. The `ws:a:0:0` hand
  anchor re-derived per byte. 128 NFC/NFD pairs (byte-distinct, hash-distinct,
  genuinely canonical), 256 namespace pairs (preimages identical except the
  tag), and 128 fallback pairs re-checked outside the harness. The 32-bit-pair
  recurrence verified algebraically with all intermediates below 2^53; the
  lone-surrogate U+FFFD agreement proven rule-based by a dual-encoder sweep
  over all 4,102 fixture inputs.
- Fixture integrity: all nine SHA-256/byte/row values recomputed and match
  the manifest, which admits no unmanifested fixture; committed budgets are
  stated and respected; the full-enumeration artifact stays uncommitted and
  digest-pinned as the work order requires.
- Deferral pins: the single marked file asserts the exact
  `Program <kind> evaluation is deferred` error through both `stepProgram`
  and `decideProgram` for all five kinds; grep over `packages/` and `corpus/`
  finds only type/constructor definitions, the common throw at
  `packages/kernel/src/core.ts:53`, and pure counting helpers — nothing
  implements their semantics.
- Authority and dependencies: every subject path is inside the allowed set;
  `package.json`, `package-lock.json`, `tsconfig.json`, `scripts/`, and
  `packages/` show zero diff against base; every harness import is a node
  builtin or relative path; the root `test` script is untouched, so the sweep
  stays outside the declared release-evidence chain as required.
- Clean-room: category sweeps over all 24 corpus files (fixture content
  sampled), VER-001, and the work-order diff found zero hits; the only
  external reference anywhere in the subject is the sanctioned public
  rfc-editor.org URL, and byte-identical regeneration from seed itself
  precludes copied intake material.

All five acceptance criteria were independently re-established, not inherited
from VER-001.

## Verification-sequence soundness

The single-report sequence (VER-001, pass, no findings) soundly supports
closure. Every file:line citation in VER-001 was checked against the current
tree and supports the claim it is cited for. Its two caveats are honestly
scoped: the run transcript genuinely contains only the build, both `--check`
summaries, and the 22-test TAP run (the preflight-timing gap is exactly as
disclosed, and the activation correction records the deviation without
rewriting the append-only event); the checkpoint gap is real and loud in the
log. The self-referential-instrument disclosure at VER-001:156-165 is genuine
— each independent check it claims reproduced under this review's own
re-execution. One completeness observation: VER-001 names the
`VerificationRequested` checkpoint-unavailable marker but not the
`ImplementationReady` one that also predates it; the control log itself
discloses all three.

## Note-grade findings carried

None blocks; all were verified in context.

1. **Tautology boundary stated precisely:** committed fixture `expected`
   fields are shipped-kernel output at generation time
   (`program-corpus-lib.mjs:211-236`) — a legitimate regression floor that
   never claims otherwise. Genuine independence lives in the test-side
   truth-table/sequence-law/Guard derivations (verified against kernel source
   and spec), the hard-coded count pins, and the ID lane's reference
   implementation.
2. **Vacuous depth bound:** `maximumDepth: 4` can never trim anything given
   `maximumNodes: 4` (depth cannot exceed node count); the depth-overflow
   guard is unreachable at these sizes. The stated bound is still true of the
   corpus; AC1 is met.
3. **Single-seed generators:** `assertRecordedSeed` makes both generators
   refuse any seed other than the recorded one, so `--seed` functions as a
   recorded-value checkpoint rather than a parameter. AC4 as written is met;
   a future rung wanting a differently-seeded corpus edits `RECORDED_SEED`.
4. **Import-tripwire quote style:** the independence allowlist in
   `wo101-generators.test.mjs:50-52` parses only double-quoted specifiers.
   Mutation probes show every realistic drift path is caught; the only
   evasion is a deliberately adversarial two-edit indirect import. The
   current source is verified independent first-hand.
5. **Run-transcript scope (carried from VER-001):** the transcript covers
   exactly the evidence gate; the separate `npm ci`/root-test preflight and
   its historical order are not durably evidenced. Re-established green at
   the same pinned base by both the verifier and this review.
6. **Implementer attribution gap:** the work order requires stating the model
   and effort actually run in the result, but nothing in the durable subject
   records the implementer's identity/effort (VER-001 records the verifier:
   Codex, GPT-5 family, effort not surfaced; this review: Fable 5,
   ultracode). Recorded here as the closest durable result artifact; the
   operator's dispatch transcript is the only primary record.
7. **Checkpoint-disclosure completeness:** as noted above, one of the two
   pre-report `checkpointUnavailable` markers goes unnamed in VER-001's
   prose. The log is complete and honest; no recovery point was used.

## Corrections applied by this review

None. No wording, link, or metadata correction was needed; the subject is
untouched.

## Remaining deviations and open questions

- **Ledger duty waived** by the work-order authority clause — this is the
  required skipped-duty note, not an omission.
- **§Corpus policy sync** remains open: a later authorized documentation pass
  must reconcile `docs/product/03-architecture.md` §Corpus policy with the
  generated-corpus layout, as recorded at `corpus/README.md:30-32` and in the
  manifest's `layoutExtension`.
- **Release disposition pinned:** WO-101 is a `v0.2.0` internal
  tooling/evidence-only close, strictly below the published `v0.2.1` tag.
  Release close MUST record the honest no-release result and MUST NOT create
  or push a tag. Nothing in this review performs or implies any release
  action.

## Proposed PR

- **Title:** `:white_check_mark: WO-101: program stepper and hash-identity corpus`
- **Body:** `docs/final-reviews/WO-101/PR.md` (committed alongside this
  report).

## Ready to merge

Closeout from here, per the playbook: record `final-review-result pass`,
commit the reviewed state, publish with the guarded `worktree publish` step.
The operator retains merge authority. After the merge, the separately
authorized `resume: release close` runs
`npm run release -- close WO-101 --publish` from the main checkout and records
the honest no-release disposition for `v0.2.0` — no tag.

## Method

Review orchestrated as a four-lens workflow at ultracode effort (program-lane
correctness and enumeration soundness; hash-identity independence and vector
truth; manifest/fixture integrity and authority compliance;
verification-sequence soundness, control-plane legality, spec consistency,
and clean-room), with a three-mode adversarial-refuter stage armed for any
blocking/major candidate — none arose, so it ran empty by design; note-grade
observations passed through and were spot-checked by the lead. The lead
reviewer independently reconstructed both VER-001 subject digests bitwise,
reran the full evidence gate with per-step exit codes plus the root suite,
read the work order, VER-001, and the central harness files directly,
verified the checkpoint refs and control-log append-integrity first-hand, and
confirmed the fan-out left the subject untouched. No agent modified the
repository.
