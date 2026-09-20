# WO-099 fourth repair — ignored work is observed without exporting private paths, and host proof survives judge agreement

**Source.** [VER-004](../../verifications/WO-099/VER-004.md) failed the third
repair on two remaining defects: repository-ignored out-of-surface work never
entered the capsule and was certified `on-mission`, while a judge repeating a
host-derived finding replaced the host's reason in the hold and correction
event. Canonical control recorded `RepairRequested` against VER-004 at
2026-09-20T21:47:26.974Z and preserved the entry state at
`refs/dotln/checkpoint/WO-099/17`. [D031](decisions.md#wo-099-d031) and
[D032](decisions.md#wo-099-d032) own the two repairs.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-5.6-sol","effort":"xhigh","source":"codex-session-readback"}

**Process cost:** entry 86,622 total tokens; pre-handoff observation 12,263,026 total tokens
(12,219,545 input, 12,054,528 cached input, 0 cache-write input, 43,481 output,
17,593 reasoning output) over 66 observed steps; source
`codex-transcript-counter`, scope `dispatch`, entry cutoff
2026-09-20T21:49:08.323Z and observation cutoff 2026-09-20T22:14:37.307Z. Dollar
cost and wrapped command count are unknown because those counters are
unavailable. No subagent was planned or launched against the cap of 20: count
0, `exact-observed`, remaining 20, with uncounted remainder unknown. Two
`npm test` rows were recorded: 257,763 ms before the privacy correction and
256,369 ms on the final salted-id identity.

## The two findings

| Finding | Repair and executable evidence |
| --- | --- |
| F1 — ignored work was invisible | At actor declaration the host records Git's `--others --ignored --exclude-standard --directory` inventory at the existing 400-entry bound. Negated-directory duplicates collapse to their leaves. The pin keeps a random 256-bit salt, salted SHA-256 path ids, hashes of bounded `lstat` kind/mode/size/mtime metadata and the inside/outside-surface classification; it never reads ignored file contents. At a pulse, an added, removed or metadata-changed entry becomes `diff.ignoredEntries`. The model prompt omits both the salt and baseline and receives only the salted evidence id and classification. Any entry prevents a pass; an outside-surface entry becomes a host-derived `contract:surfaces` drift. Existing ignored build/runtime trees remain baseline rather than causing a permanent hold. The regression plants two ignored out-of-surface files beside a pre-existing ignored dependency directory, proves the subject and prompt contain neither planted name nor contents, gets two host drifts, and compares the same two files without ignore rules as the visible-path control. |
| F2 — judge prose replaced host proof | `validateMissionCheckResult` now starts with the structural findings and appends a supplied finding only when its `(kind, reference, evidence)` key is new. Exact-key agreement consumes no additional model-finding capacity, preserves structural-first order and keeps the host reason. The direct normalization regression replaces a host reason with a claimed standing exception and observes the host reason unchanged; the resident regression carries that same hostile restatement through `MissionHold.findings` and `MissionDriftObserved.findings`, where the host sentence remains. The normalized result still readmits byte-for-byte. |

The privacy design was corrected once before handoff. The first implementation
used an unsalted path hash; that hid the spelling but allowed dictionary checks
for low-entropy names. It was replaced before completion with the host-only
per-pin salt above, the generated surfaces were refreshed, and the full product
gate was rerun on the corrected bytes. No ignored names, ignored contents or
salt cross the model prompt.

## Goal alignment and alternatives

The repair restores the mission check's promised supervision: a pass no longer
means only “everything ordinary Git status happened to show,” and a returning
human sees the host's proof rather than a model-authored exception. NoOp leaves
both executable counterexamples. Carrying every ignored leaf or its contents
would consume shared context, expose private intake and credentials, and make
routine dependency/build trees hold every pulse. Treating all current ignored
roots as new work produces the same policy resistance. Rewording the prompt
alone is rule-beatable because the host still certifies an empty list. The
selected baseline is bounded, local, reversible and consumed by the existing
capsule/hold interface; it adds no workflow or operator ritual.

All eight goal-alignment traps point the same way. The false pass is seeking the
wrong measurable goal and drift to low performance; judge replacement shifts
proof recovery back to the operator. A baseline avoids policy resistance and
escalation from permanent holds. Directory collapsing and metadata-only
fingerprints bound shared compute. Host-first deduplication does not privilege
the invested model path, and the ignored/control pair prevents rule beating.
Naive Interventionism preserves ordinary tracked/untracked diffs, the existing
hold, replay closure and private ignored material. Reopen D031 if a relevant
same-metadata or nested collapsed-directory mutation is observed, or if the
400-entry bound is reached; do not silently claim such a case is covered.

## Executed evidence

| Check | Observed result |
| --- | --- |
| `node --test --test-reporter=tap packages/skeleton/dist/test/mission-check.test.js` | 14 passed, 0 failed in 5.01 s; [filed transcript](mission-fixtures.tap), including both VER-004 regressions and all prior repairs |
| `npm test` on the final salted-id source | 21 passed, 0 failed, 65 fresh tasks in 256.37 s; gate row 256,369 ms at 2026-09-20T22:14:37.257Z |
| `npm run test:docs` | 19 passed, 0 failed, 19 fresh tasks in 18.94 s; includes publication, metadata, release surfaces, harness, authority, feedback and verification evidence |
| `node scripts/harness.mjs emit` / `check` | 31 generated surfaces refreshed and matched; local-terms list unavailable |
| `node scripts/feedback-evidence.mjs --check` | Selected edition remains current: ten passing regressions, ten removal failures, 1,192 fewer instruction bytes; no new live audit required |
| `node scripts/authority-evidence.mjs --check` | Two unchanged programs, four widening rejections, nine runtime denials and 34 bundle comparisons verified |
| `npm run release -- prepare --local` | `WO-099 target v0.37.0 remains current; no files changed` |
| `git diff --check` and `git diff --cached --check` | Clean before the report was filed |

## Limits retained

- The ignored inventory is a local supervision signal, not a hostile
  filesystem monitor. It observes a collapsed entry's `lstat` metadata; a
  same-metadata rewrite or a nested change that does not move the collapsed
  directory metadata can remain invisible. The capsule reads no ignored
  contents to close that gap.

  **Correction, 2026-09-20 (WO-099 VER-005 F1).** The sentence above and this
  repair's F1 row claimed that existing ignored build and runtime trees remain
  baseline rather than causing a permanent hold. That was not true of the code
  this repair shipped: it hashed every collapsed entry, directories included,
  with kind, mode, size and mtime, and creating or removing a direct child
  moves a directory's own mtime. One ordinary `npm run build` therefore moved
  `.runtime/` and each `dist/` off the baseline permanently. What was meant is
  what [repair-005](repair-005.md) and [D034](decisions.md#wo-099-d034) now
  implement: a collapsed directory is hashed with its kind and mode alone.
  What changed with it is the boundary — any change under a collapsed ignored
  root is now invisible, not only a same-metadata or nested one.
- The existing paid unattended row remains the order's one live model run. This
  repair uses deterministic scratch worktrees and process doubles and does not
  claim a second paid observation.
- [D027](decisions.md#wo-099-d027)'s previously deferred wording defect remains
  disposed in adjacent queue revision 2. The queue has no running or next item;
  this repair did not change its registered feedback source or reopen it.
