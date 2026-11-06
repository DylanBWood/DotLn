# WO-257 VER-001 evidence

Independent verification, 2026-11-06, for the operator's `resume: verify` and
`be extra thorough` instructions. The verdict is in
[VER-001](../../../verifications/WO-257/VER-001.md); the routing decisions are
[D038–D040](../decisions.md#wo-257-d038--verification-finds-two-supported-input-failures-in-the-batch-merger).

## Subject and existing gate

`gateCodeIdentity` reads the delivered implementation as
`874d70964c3372b4f8a0697648e99001285f9809ee0076d285376d4025eea6a4`. The
executor's `npm test -- --review` row has that same code identity, exit code 0,
`executed: true`, `identityUnchanged: true`, and `buildOutputUnchanged: true`.
It was recorded at 2026-11-06T16:20:35.042Z against tree
`26fa8f7eb8843b17d2bc91ca40083e3d9c7d5ea5`, with 46 required suites, taking
0 h 45 min. The row covers the structural and declared product Preflight
checks. No new complete product run was needed. The final document gate is
consumed separately by the verification completion, after the report and these
records are written.

The mechanism under review also produces the gate rows, usage counters and
handoff projections. The independent reproductions below directly inspect its
returned reports and the existing protocol validator; the complete row is not
treated as proof that every accepted combination works.

## Reproduce the findings

From the repository root, with the current built packages:

```sh
node scripts/harness.mjs bounded -- node --test docs/evidence/WO-257/ver-001/probes.mjs
```

The run at 2026-11-06T16:42:12.068Z exited 1, with four passing tests and two
failing tests. The two failures assert the intended behavior, so they are
expected evidence of the defects on this subject. All fixtures contain
synthetic text, use local Git repositories and the fake worker transport, and
are removed through the temporary-root helper. No live worker is launched.

Selected output, without temporary paths or stack traces:

```text
F1 {"batches":2,"report":null,"failure":"the `## Items` table's disposition is one of acted on, reviewed, missing; 1 row names another"}
F2 {"ids":["b1.F1","b1.F1"],"validation":"invalid-result: change review finding shape","recheck":"profile-refused: change review prior findings"}
F3 the brief's preamble, captures and document index alone are 401566 characters against the ceiling of 400000; shorten the captures before launching
tests 6
pass 4
fail 2
```

F1 first establishes that each batch passes `itemsTable` on its own and that the
fixture has two batches. The sole variation is the accepted header vocabulary:
`Location in the subject`/`Disposition` versus `Where`/`Status`. The second
batch's row is emptied by exact-name alignment. The required merged report is
then refused.

F2 first validates two distinct worker finding IDs against
`validateChangeReviewResult`: 52 `L` characters and `F1`. After the merge, both
are `b1.F1`. The resulting report fails that same validator and a real
`runChangeReview` dry run of round 2 with the written report as `--recheck`
fails with `change review prior findings`. This establishes both record
corruption and the subsequent user-visible failure.

F3 is a passing observation of a known limit, not a failing assertion counted
against criterion 12. Each capture is 198,980 bytes, below the existing
200,000-byte per-capture limit. Together with the mandatory shared text, they
leave no document room. D039 records the bounded follow-up.

The other passing probes vary line endings and host wrappers while comparing
the emitted Codex reader to the compiler reader; retain different executor
ordinals across met/waived/defective criterion judgments; and exercise one
shared renderer plus an unrelated helper in release notices.

## Additional executed checks

Each probe ran under `node scripts/harness.mjs bounded --`, with one probe
process at a time. Full logs remain in the session scratch; this record keeps
the verdict-relevant results instead of nested gate output.

| Check | Observed result |
| --- | --- |
| `npm run format:check` on entry | Exit 0; every matched file used Prettier style. |
| Selected WO-257 fixtures in review-worker, entropy-review, plan-refutation, release-preparation, docs-check, target-release and compiled harness tests | 18 passing assertions; one separate fixture-process setup failure, corrected below. Included ordinary batching, missing reports, part binding, pointers, `--since`, retained original/hash handling and four classification-header forms. |
| Selected subject-meter, hook dispatch, settings, update-finish, target-record and exported-instance planning fixtures | Runner reported 11 passes, 0 failures; exit 0 at 2026-11-06T16:41:00.653Z. The exported-instance fixture includes its own document checks and the absent/removed product-00 cases. |
| Fresh-clone bootstrap and retained standing-rule journal fixtures | Both passed. The same run's ad hoc index driver failed before its selected assertion; it is not counted as product evidence. |
| `bash scripts/test-work-orders.sh` through the repository's original wrapper | 36 passes, 0 failures; exit 0 at 2026-11-06T16:42:09.266Z, including the WO-257 criterion-8 index case. |
| Current `documentReport` binding inspection | All six paths below were bound; no missing entry points or forbidden record entry-point links. |
| `npm run plan -- documents` | Exit 0; 338 standing documents, 325 unread rows and no red-tag count. The first page returned 64 rows and a continuation cursor; the binding inspection above covers the six required paths directly. |
| `npm run publication:check` | Exit 0; 256/256 product headings indexed, both audience outlines current and publication bootstrap checks passed. |
| Lockfile and source diff inspection | No added or removed packages, no new dependency names, and no added lint/type suppression directives. Only compiler/skeleton workspace versions and their internal pins changed in the lockfile. |

The six bound paths are `docs/README.md`, `docs/evidence/README.md`,
`docs/final-reviews/README.md`, `docs/retired/README.md`,
`docs/lineage/remining/README.md`, and `docs/work-orders/TEMPLATE.md`. The first
is bound through README's `front-page` entry; the other five are linked from
that documentation index.

The resume drift/refresh assertions are carried from the executor's passing
complete row and the reviewed source in `scripts/resume.mjs` and
`scripts/test-resume.sh`; no new full resume-suite run is claimed.

## Corrections and limits

The first direct invocation of `scripts/test-work-orders.mjs` omitted the
owned-root argument required by that fixture's file-level setup. A subsequent
ad hoc import driver also failed during test dispatch with
`ERR_INVALID_ARG_TYPE`. The canonical shell wrapper above then passed all 36
tests. These are verifier setup errors, not subject failures. The first Items
probe also expected `undefined` instead of the reader's documented `null`
success value; after correcting the assertion, the independently valid batches
still failed at the merge. [D040](../decisions.md#wo-257-d040--verification-probe-corrections-and-unavailable-review-evidence)
records these corrections and their disposition.

Every available execution review was read: rounds 1 and 2 for criteria,
design and consistency, the three `since-48cc35695eb3` round-1 reports, and the
round-3 combined report. The executor also cites a
`repair-1/round-4-combined.md` report, but neither that file nor its JSON was
present in the selected or primary checkout's `reviews/WO-257` or
`retained/WO-257` lanes. Its contents are unknown. The affected later code was
reviewed directly, including renderer classification, classification-value
compatibility, part digest binding and committed optional-document handling.

Live model batching, real remote publication and operator desktop behavior were
not exercised. The reported failures require none of them. No implementation
fix, branch commit, push or role advance beyond this verification was performed.
