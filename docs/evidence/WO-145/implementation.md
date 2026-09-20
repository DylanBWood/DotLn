# WO-145 implementation evidence

Implemented one optional `tinkerer-economy` executor support through the existing support switches, default off. The existing decisions generator now validates experiment question, alternatives, observation, a budget of at most 900 s, measured cost, command-backed effects, outcome and reopening condition. It preserves unknown token/per-order observations as null and permits negative savings for regressions. No dependency, compiler/schema, gate behavior or hook behavior changes.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

**Process cost:** entry 44861 tokens; handoff 3306091 tokens; source codex-transcript-counter (dispatch scope; measurement cutoff 2026-09-20T06:33:29.611Z, before final validation; USD unavailable)

## Acceptance evidence

1. The WO-145 process-debt fixture checks SHA-256 hashes of all 12 generated role files against release v0.33.2 with default/off equipment. With equipment on, only executor instructions change and the manifest names the support. The existing whole-loadout Origin hash changes in every role file; this metadata distinction is explicit in [D003](decisions.md#wo-145-d003). The skeleton fixture confirms unchanged authority, work order, other roles and non-procedure facets.
2. The new decision fixture accepts all three outcomes and a reasoned decline, and rejects missing/unmeasured cost, missing effect commands, invalid budget, unsupported unknown values and missing reopening conditions. It exercises index generation/readback as well as decoding.
3. [D002](decisions.md#wo-145-d002) is the first trial. The measured pre-registration-to-recording window was 163.546 s, within 900 s. The unchanged full file passed 79 tests in 59.010 s; the two focused tests passed in all three samples (0.265–0.268 s). The method was adopted for local iteration; full integration coverage stays required. Saving per future order and token effect remain unknown. This bootstrap trial enacted the support instructions manually before the support existed; it does not establish spontaneous behavior from equipment alone.
4. Product 05 records economy first, all thirteen sourced aspects and the still-open adaptive modifier. [D001](decisions.md#wo-145-d001) records the operator-selected later trials WO-110 and WO-099, their decisions paths, equipment method, last-adoption history and the pre-registered reading after trial three. WO-145 itself covers scripts and packages. The next planning pass owns the register disposition. Publication editions carry the new support and refreshed source locks.
5. [Cold-start measurement](cold-start.json): 23,347 bytes with equipment on, 22,174 off, ceiling 24,576, in both harnesses; 1,173 added bytes. `harness check` passed for 31 surfaces. Targeted decision/support tests, publication checks, planning checks, local release surface checks and `git diff --check` passed before the full gate. The full gate `npm test -- --review` passed: 28 suites, 0 failed, 72 fresh tasks in 484.34 s.

## Release and evidence

Application v0.34.0 is staged under the declared minor classification; skeleton 0.30.0 adds the optional support. The console dependency pin follows it; compiler, kernel and console versions stay unchanged. `npm run release -- prepare --local` succeeded against local v0.33.2. Publication remains a later dispatch.

The default-off bundle was regenerated. New immutable authority and feedback editions are selected in `docs/evidence/current.json`; the artifact-identity and verification editions still pass unchanged. The first full-gate attempt stopped at feedback preflight because the newly selected edition lacked its live selfhost audit. This was incomplete evidence preparation, not a product-suite pass or an experiment regression. The documented read-only CLI verifier completed successfully at 2026-09-20T06:34:34.665Z, with both feedback criteria passing. Its immutable audit and verification streams are filed in `feedback/`; `feedback-evidence --check` passed. One product evidence verifier was launched with Codex/gpt-6-astra/xhigh, no collaboration agents or descendants requested; the session budget was 20 with zero observed admissions before that run.

## Outcome and limits

The order supplies a reversible experimental instruction and comparable records. It does not yet show that the support pays for itself, remove operator selection of trials, enable adaptive pressure or measure another quality aspect. The first observation shows cheaper development feedback under retained integration checks. Two later trials and the third-trial reading remain intentionally future work under their selected orders.

Final publication reading corrected the inherited live-verification status in README and the everyday reader outline ([D004](decisions.md#wo-145-d004), adjacent-0001). Publication and local release checks and the clean diff check passed afterward. This changed only documentation after the passing code-identity gate; no product source changed.
