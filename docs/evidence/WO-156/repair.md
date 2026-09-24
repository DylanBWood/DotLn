# WO-156 repair — planning check latency

Dispatch: `resume: fix`, with the operator's Git-launch, normalization-cache and
adjacent-repair scope expansions of 2026-09-24. Actor: Codex CLI 0.156.1,
`gpt-6-astra`, effort `xhigh`, source `codex-session-readback`.

[VER-001 F1](../../verifications/WO-156/VER-001.md) required the unchanged under-2-second
bound. D005 and D006 bind the operator's amendments in the planning control log;
D007 records continuing adjacent-repair authority. [D008](decisions.md#wo-156-d008)
records the resulting measurements and reversal conditions.

The receipt reader batches committed receipt bytes and prefetches subject sources
across revisions using the existing 32-object batches, 64-tree cache and 2,048-blob
cache. Hints never substitute for rebuilding and comparing the canonical subject.
Only previously resolved commit IDs reuse the tree cache without a Git resolution
launch; mutable refs and unseen IDs still resolve normally. A regression caught an
intermediate raw annotated-tag shortcut, which was removed. The existing shared
byte-framed Git reader replaces the duplicate Latin-1 round trip.

Pure receipt normalization retains the existing NFKC, whitespace and missing-value
semantics. Its exact-string cache admits at most 512 entries and 1 MiB of combined
input/output UTF-16 string storage, evicts oldest-used entries, and bypasses oversized
strings. Map/object overhead is not part of that string-storage bound.

| Same-tree measurement | Pre-repair sources | Repaired sources |
| --- | ---: | ---: |
| `plan check` wall seconds, three fresh processes | 3.177 / 3.121 / 3.158 | 1.799 / 1.823 / 1.795 |
| `plan subject` wall seconds | 0.131 / 0.124 / 0.122 | 0.118 / 0.118 / 0.117 |
| Git launches for `plan check` | 242 | 98 |
| Repeated immutable-reader fixture launches | 12 | 0 |
| Four committed receipts fixture launches | 15 | 4 |
| Repeated normalization calls | 12 | 1 |

All timing runs exit 0. The prior module bytes were loaded through a scratch Node
load hook on the same worktree. The repeated stdout files compare exactly. SHA-256:

- `plan subject`: `2eccf9e2858f85b24c658ed3d826eca29716b8b893e3ce1baf9978868051a9ed`, 227,825 bytes.
- `plan check`: `ca8fe28afd1bf3ad434b595351ea493c49cf8daed9d010af033d84ad0d5995a2`, 3,407 bytes.

The check hash includes the amended workspace subject, so it differs from D001's
pre-amendment hash. The subject hash equals D001 and VER-001. The initial unhoisted
baseline remains 17.86 s; the intermediate hoist-only result was 2.85 s. Timings
observe one host and its current background load, not a cross-host guarantee.

The four focused WO-156 cases pass. The three new cases first failed against the
old behavior; the original stat-count case still passes with 10 calls and its
pinned byte-identity hash. They cover cache eviction by entries and bytes,
oversized inputs, missing/empty values, Unicode normalization, moved branches and
tags, raw annotated tags, cross-root isolation, non-commit objects and committed
receipt tampering. Existing fixture cases remain unchanged. The repair adds three
cases and zero runner tasks; final gate results follow below.

Local release preparation retains application v0.46.1; component versions and
dependencies are unchanged. No publication action is part of this repair.

The complete fixture suite passed 65/65 (37.27 s). `npm run test:docs` passed
21 tasks with 0 failures in 23.66 s; `plan` took 1.88 s and
`plan-refutation-current` 1.78 s, versus the initial 25.27/25.20 s. Publication
source locks are current and `git diff --check` is clean.

Writer observation: Codex dispatch created the harness session but did not reserve
a writer automatically. No other writer was registered. The root explicitly ran
the existing writer guard for the product-gate command before continuing. This is
a manual guard invocation, not a claim of automatic Codex hook coverage.

`npm test` passed 27 suites, 0 failures, 71 fresh tasks in 292.10 s. The two
earlier follow-ups (`FUP-3dc0266d6b87b939`, `FUP-5827640154a48b7b`) are settled
with explicit reopening conditions in the structured register. No diagnosed
adjacent item remains queued. Independent re-verification is the next phase.

Additional inputs consulted: `scripts/lib/git.mjs` (shared byte-framed reads),
`scripts/lib/plan-receipts.mjs` (receipt validation and normalization),
`scripts/lib/planning-followups.mjs` (disposition contract), and the existing
writer guard/host implementation for manual reservation. No support or harness
implementation changed. The refreshed reservation reports liveness unknown,
and completion will release this session's reservation.

## Follow-up repair after VER-002

The preceding section records the first repair handoff. [VER-002](../../verifications/WO-156/VER-002.md) independently found two accepted-input regressions despite its 65 passing fixtures. [D009](decisions.md#wo-156-d009) files both as FUP-ab1746dc9c595d95; [D010](decisions.md#wo-156-d010) records their correction and measured result. The continuing operator authorization covers them, and existing amended order text already requires preserved validation.

Prefetch now omits the unused legacy-map path, conditions cost hints on the recorded cost table, and skips malformed, missing, nonregular or unreadable hints. Canonical reads still reject required bad sources. Failed multi-blob reads split into smaller batches; singleton failures still propagate. Shared Git helpers and their 16 MiB buffer remain unchanged.

Three added boundary fixtures fail before repair and pass after: unused legacy symlink; six valid receipts with a 3 MiB thesis; two revisions with distinct 9 MiB blobs plus unusable optional hints. The last case also proves required symlinks and oversized singleton reads remain refused. The complete suite passes 68/68 in 26.717 s. Seven total WO-156 cases add no runner task. The initial symlink test mistakenly passed a subject to a result-function helper; that test error was corrected before recording the valid red result.

Same-tree check before 2.824 / 2.815 / 2.792 s; after 1.667 / 1.659 / 1.657 s. Subject before 0.112 / 0.111 / 0.114 s; after 0.106 / 0.108 / 0.108 s. All exit 0; repeated stdout bytes match exactly. Subject hash remains the one above; check hash is now `03c0b8527e84a303420df276ecfab6f62f08c0337ee95524638eee652a71af35` (3407 bytes), reflecting the local release-preparation retiming to v0.46.2 on the paired tree. The existing patch classification and component versions remain unchanged. No commit or publication occurred.

Final check uses 104 Git launches (25 cat-file, 36 rev-parse, 29 ls-tree, 14 other), versus 242 before the Git/cache repair. Six extra historical fallback reads versus D008 preserve optional-path behavior. `test:docs` passes 21/21 in 23.06 s, with plan 1.90 s and plan-refutation-current 1.81 s. Publication locks are current. The fresh full product gate passed 27 suites / 71 fresh tasks, 0 failures, in 288.77 s. FUP-ab1746dc9c595d95 is settled with its reopening condition and adjacent-0001 is complete. Independent re-verification follows the canonical repair handoff.

Local reproduction logs: ignored `docs/control/local/wo156-symlink-red.log`, `wo156-boundary-red.log`, `wo156-boundary-green.log`, `wo156-fixtures-final.log`, and `wo156-docs-final.log`. Paired outputs and launch counts are retained in the original repair scratch as `followup-*`.
