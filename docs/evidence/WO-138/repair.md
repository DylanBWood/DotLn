# WO-138 repair of VER-001

The repaired 38-cell collection and independent audit establish T2's matched
comparator floor. The pilot is `inconclusive`, qualifying only T2; the earlier
two matrices remain excluded. The full product gate passed: 22 suites, zero
failures, 66 fresh tasks, 262.12 seconds.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

## Corrections

VER-001 F1 identified an unsupported T2 response-schema keyword and lost remote
error diagnostics. The keyword is removed while the host still rejects
duplicate and incomplete rankings. The remote decoder retains bounded,
sanitized `error` and `turn.failed` messages with an exit/incomplete-turn
fallback; it does not retain unrelated stream items. Focused tests cover
nonzero exits, zero-exit failed turns, empty stderr, credential redaction and
successful decoding. The current official documentation describes the
[supported schema subset](https://developers.openai.com/api/docs/guides/structured-outputs);
the observed endpoint rejection in VER-001 establishes the specific defect.

A2 is resolved in the evaluator: a missing comparator is explicitly unavailable,
the comparison floor and score difference are null, and that task cannot
qualify. Five returned model outputs establish availability; an observed
invalid model answer remains a scored failure. This distinguishes model
performance from requests rejected before inference.

A1 is addressed by exposing the host's existing 40-character T1 field limits
in the response schema, preserving the 320-character summary limit. Boundary
tests prove that the emitted and host length limits agree. No prompt, oracle,
ranking or floor was tuned to model output.

The first replacement passed numerical recomputation but failed a stronger
provenance check. T2's producer ran separately for each arm; its failing-test
stderr digest changed with the random scratch path. The collector now retains
one `inputs.json` snapshot and both transports consume it. Evaluation checks
every record's input, prompt, schema and final build binding against those
actual inputs. A regression test explicitly rejects changed hashes and a
changed failing-test digest.

## Preserved evidence and scope

`attempts/invalid-schema-007` holds the unchanged VER-001 subject, including
its original packet and implementation report. `attempts/unmatched-input-008`
holds all 38 first-repair episodes, manifests and historical computed results;
its distributions are not qualification evidence. Earlier attempts remain.
The operator's held-out ranking and reported 60 seconds are unchanged.

The adjacent planning repair is recorded as WO-138-D008: permit the
equivalent release-header article/punctuation spelling while retaining the
existing receipt bindings and rejection of substantive changes. The release
classification stays patch, with no package or dependency change.

## Executed verification

`node docs/evidence/WO-138/audit.mjs` independently
recomputed all six baseline distributions and confirmed matched baseline
provenance for all 38 records. The probe's `evaluate` path separately validated
every input/prompt/schema/build binding. `node --test
scripts/probes/local-model-role-qualification.test.mjs` passed 13 tests with
no skips in 2.568 s. `node scripts/test-plan-refutation.mjs` passed 42 tests
and the current-subject planning check in 40.287 s, including changed-axis,
changed-description and changed-article refusals. `git diff --check` passed.
`npm run release -- prepare --local` retained v0.38.1 with no package changes.
`npm run format:check` passed after formatting the independent audit script.
`npm run publication:check` passed all 273 source checks with both publication
locks current. The combined final subject passed `npm test`: 22 suites,
zero failures, 66 fresh tasks, 262.12 seconds. No live inference overlapped
that gate. Independent verification remains a separate `resume: verify`
dispatch.

The operator authorized one replacement run beyond the session cap: 17 more
remote episodes, 34 total. This changes no persistent setting. All live inputs
are public repository fixtures; no private-input, no-egress, source-writing,
implementation, independent-verification or capability-level claim is made.
