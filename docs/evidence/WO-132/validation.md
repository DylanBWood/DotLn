# WO-132 execution validation

## Result and scope

The implementation is prepared for independent verification. The final source
passed three consecutive fresh product runs at code identity
`e2a8b9c7620bae5313ee0ae3eb0d27ebf06917a758403015cb37a3057834d646`.
The actor is `codex-cli` version `0.154.0`, model `gpt-6-astra`, effort `max`,
source `operator-attested`. Effective model/effort readback was not exposed.
The operator removed the eight-hour cutoff during `resume: next`.

## Executed checks

| Command or observation | Result |
| --- | --- |
| `npm test` — three consecutive final-source runs | 254.908 s, 250.500 s, 246.160 s; 19 suites / 62 fresh tasks each; no reuse |
| `npm run test:machinery` — final source | 16 passed, zero failed; 547.16 s |
| `npm run test:docs` — final source | 17 passed, zero failed; 70.69 s |
| `npm run build` | Passed; also freshly executed inside each gate |
| `npm run format:check` | Passed on final source |
| `node scripts/harness.mjs check` | Passed all 24 generated surfaces; also included in machinery and docs |
| `node scripts/check-publication.mjs` | 263 headings indexed; both edition source locks current |
| `node --test scripts/test-release-fixtures.mjs` | 3 passed; existing cases plus the new one-gate lifecycle retained |
| Focused compiler purity test | 2 passed; emitted text is data, executable I/O remains rejected |
| Focused WO-132 hook tests | 8 passed; full final harness suite also passed all 25 |
| Focused worker selection tests | 9 passed; full worker tests also ran in each product gate |
| Focused meta task-count/cost tests | 2 passed; full process-debt suite also passed on final source |
| `bash scripts/test-checkpoint.sh` | Passed canonical recovery and missing-Git observation cases |
| `bash scripts/test-release.sh --case cached_evidence` | Passed truthful current notes and both historical note formats |
| `bash scripts/test-release.sh --case composed_evidence` | Passed exactly one executed product gate through the entire lifecycle; close 6.144 s with local transport doubles |
| Live Codex feedback audit | Complete: 10 fixtures, 1,192 saved instruction bytes; current edition checks passed |
| Historical evidence comparison | No modified WO-126–WO-131 evidence; 13 historical planning receipts retain their identities |

The first product attempt failed four integration checks in 243.151 seconds;
the first machinery attempt failed two stale fixture expectations. Both failures
and their corrections remain described in [decisions.md](decisions.md).
Only executed successful final-source rows count toward the three-run claim.
[product-gates.json](product-gates.json) contains both exact-tree and code
identities, UTC times, the initial failure and complete task timelines.

## Behavioral evidence

- Completion fixtures execute inline `git diff --check` and admit missing gate/session/read/usage evidence as advisory. Reports, actor fields and legal phase order remain required. Unknown labels and `ultra` retain their supplied meaning and provenance.
- The runner's separate Bash-process test proves code-identity lookup across processes. Tracked source and dependency changes invalidate it; document/generated changes retain it. The three final measurements share one code identity and execute every declared task. A further separate Bash lookup after report/index/meta edits resolves the passing row at a different exact tree; the observation is filed in `product-gates.json`.
- Generated hook fixtures retain exactly the second-writer and live-gate write refusals, reserve writers on main, reclaim dead owners and journal other judgments as advisory. Host launch probes use isolated fixture transports; host permission settings are not changed.
- The release fixture executes activate, implementation-ready, verify, pass, final review, one `npm test`, later report edits, final-review pass, publish, merge and close. Main has no gate row. Release notes reconstruct both old evidence formats byte for byte and describe the new reviewer row without claiming an unexecuted install.
- The final planning suite includes 32 synthetic cases: supported-evidence holds, hypothetical known issues, one judgment per pass, legacy criterion dispositions, exact changed/added/removed Cost declarations, overrides and unrelated-edit refusal. Current planning checks and historical receipt readers also pass.
- Artifact identity, authority, verification and feedback have new WO-132 editions. The authority migration bounds the new goal-review work-order fields; historical artifacts are not overwritten. The live feedback run is preserved in the current edition, including its real verifier result.

## Selected fixture transcript excerpts

```text
PROGRESS release case composed_evidence started
publish → merge → close: exactly one executed product gate; distinct reviewed/merge trees; no main gate required
one-gate lifecycle close: 6144 ms excluding network (local transport fixture)
PROGRESS release case composed_evidence passed
release tests passed

PROGRESS release case cached_evidence started
reviewer evidence notes are truthful; both historical note formats reconstruct byte-for-byte
PROGRESS release case cached_evidence passed
release tests passed

{"workOrderId":"WO-011-feedback-audit","phase":"complete","fixtures":10,"savedInstructionBytes":1192,"verifier":"codex-cli-exec"}
```

## Limits and handoff

Fresh means every task executed without suite-success reuse; installed
dependencies and ordinary operating-system caches were retained. The baseline
is the dated planning observation, not a rerun of the old source. The local
release fixture establishes behavior and timing without live publication.
Independent verification, final review and actual publication require their
separate dispatches. The next real order's single-gate control history remains
a named future observation, as recorded in the order's execution appendix.
Usage counters remain in ignored receipts and the final response; unavailable
cost or effective-session observations are not represented as zero.
