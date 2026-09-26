# WO-085 implementation and repair evidence

Dispatches: `resume: next`, then `resume: fix` on 2026-09-26; during repair,
`scope expand:` authorized integrating main first. Repair executor: codex-cli
0.157.1, gpt-6-astra, ultra effort (normalized xhigh); source
codex-session-readback. Two read-only helpers, no descendants; one writer.

`node scripts/docs-check.mjs`, consumed by `npm run test:docs`, checks all 15
product documents against the [ceilings](../../control/doc-ceilings.json) and
[landing baseline](../../control/doc-baseline.json). Each initial ceiling is
`ceil(nonExemptBytesAtLanding * 1.02)`. Roadmap §Release boundary is the only
current byte/shape exemption, until WO-086 retires its manual release notes.
There is no registered product marker generator; arbitrary marker pairs grant
no exemption. Each leading BOM remains three counted UTF-8 bytes while parser
slices use the normalized text (fixtures cover consecutive BOMs). A ceiling
increase after landing requires a resolving planning-document decision; lowering
one is admitted.

The baseline contains 87 receipt/candidate shapes and 743 historical dispatch
fingerprints. Shapes are counted by product, nearest heading and normalized
label; extra copies fail. Dispatch fingerprints bind exact file/id/value bytes.
New records need a supported control prefix and at most 240 paraphrase
characters on one line. This is lexical validation; review still judges whether
wording quotes the operator. No new dependency was added.

The installed, pinned Prettier Markdown AST supplies block boundaries,
reference identities and decoded destinations. The link scan covers public
root/configured-document Markdown, including generated indexes. Relative links
resolve from the source file, including stored PR and release bodies; it does
not establish navigation on GitHub's published PR page. Code examples, comments,
package fixtures and private intake/local lanes are excluded. Remote URLs are
not fetched. The 412 historical broken-link occurrences in 368 exact pairs
remain declared exceptions: 40 previously inventoried anchor occurrences,
347 stored PR link occurrences and 25 imported WO-115 release-note occurrences.
Every added exception was checked against identical committed source owned by
a closed order; no closed report was rewritten. An extra occurrence still fails.

Generated work-order indexes show pending verification and final-review IDs as
plain text until their verdict is recorded. Completed reports remain linked,
so deleting a completed report still fails the link check. Integration decision
stubs now use the actual recorded repair/final-review phase to produce a valid
control-prefix dispatch instead of reintroducing an invalid record.

Write-backs: products 07 and 08 name the check and edit-in-place rule;
[docs entry point](../../README.md) explains the controls and corrected link
context. The [decisions](decisions.md) substitute for this pre-2026-09-09 order's
ledger duty and appear through `npm run meta`. Follow-up `FUP-87ed701db7d7209e`
points to `FUP-71fc2efc208f597a`, retaining the historical operator-chat sweep
and role-text question for planning. VER-001's non-blocking observations remain
boarded in D009; this repair does not widen the specified receipt/candidate
shapes or scan scope.

## Main integration and repair

The canonical integration completed before behavior changes: original base
`f73b7e184b38de9cab97b4e86c718b6006f6b19d`, integrated main
`6a5c323df4e2db298ec3ec0b16be61c6374b9cb8`. Checkpoint
`refs/dotln/checkpoint/WO-085/6` and named stash `WO-085 integrate 2026-09-26`
remain available. The one authored roadmap conflict was resolved by retaining
both additive note groups. Projections and publication locks were regenerated.
The unpublished patch was retimed from v0.51.2 to **v0.52.2** above observed
local v0.52.1. Package sources and component versions are unchanged from
integrated main; there is no implementation branch commit or publication.

The controls have not yet landed. D012 reconciles their initial landing
measurements with main: product 04 is 59,662 non-exempt bytes (ceiling 60,856),
product 07 is 184,704 (ceiling 188,399); other measurements and all shapes are
unchanged. Two imported invalid dispatches receive historical fingerprints;
this repair's generated D010 was corrected rather than baselined.

[VER-001](../../verifications/WO-085/VER-001.md) remains the immutable failed
judgment of its original subject. D011 records the same-day correction to
D003's unsupported claim that no missing files were found. F1/F5 are repaired
by source-relative resolution and factual write-backs; F2 by removing the
unregistered marker exemption; F3 by pending report rendering; F4 by BOM
normalization with original byte accounting. D013 and adjacent-0002 cover the
integration dispatch producer. D014 and adjacent-0003 repair the configured-root
path literal imported from WO-165 in the authority-evidence generator. Its
post-edit check reproduces both existing snapshots exactly, without the retained
source fallback; no evidence edition is re-minted. The existing D001 economy decision was read;
no second experiment or recurring saving is claimed.

## Validation

Original implementation transcripts [fixtures.txt](fixtures.txt) (21 tests)
and [docs-check.txt](docs-check.txt) (40 historical occurrences) describe the
pre-verification subject. They are retained, not presented as repair evidence.
The implementation's gates passed then; VER-001 records its own runs and the
five findings. Fresh repair checks judge the integrated subject:

| Check | Repair result |
| --- | --- |
| `node --test scripts/test-docs-check.mjs` | 24 passed, zero failed |
| `bash scripts/test-work-orders.sh` | 23 passed, zero failed; includes actual lifecycle fold, index rendering and link resolution |
| `node scripts/docs-check.mjs` | 15 products, 412 historical occurrences, zero failures |
| `node --test scripts/test-worktree-integration.mjs` | 9 passed, zero failed; real Git fixtures cover both phases |
| `npm test -- --review` before the imported path repair | 32 passed, 1 failed (configuration-root); 77 fresh tasks, 607.04 s. All selected machinery passed. |
| `node --test scripts/test-configuration-root.mjs` after the path repair | 13 passed, zero failed |
| `node scripts/authority-evidence.mjs --check` after the path repair | Passed directly; no retained-evidence fallback and no remint |
| `npm test` on final code | 28 passed, zero failed; 72 fresh tasks, 314.26 s |
| `npm run test:docs` | 23 passed, zero failed; 23 fresh tasks, 31.23 s |
| Publication, planning, harness and release checks | Passed; 276 product headings, current edition locks, 31 generated harness surfaces, v0.52.2 patch and unchanged components |
| `git diff --check` | Clean; staged diff also checked |

Final gate observations, read receipts and token counters remain in ignored
session records with their source and cutoff. Independent re-verification and
final review remain separate dispatches.

Repair outcome: F1–F5 have passing regressions on the integrated subject; both
encountered producer defects are repaired, the adjacent queue is complete, and
the required product/document gates pass. The changes preserve closed evidence,
publication controls and recovery material. They remove the reproduced check
bypasses and the need to create a report early merely to run the document gate.
No runtime-feature progress or recurring resource saving is claimed.
