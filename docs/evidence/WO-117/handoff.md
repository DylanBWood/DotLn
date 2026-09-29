# WO-117 executor handoff

Dispatch: `resume: next`, 2026-09-29. Actor: Codex CLI 0.159.0,
`gpt-6-astra`, selected effort `ultra` (recorded xhigh plus workflows), source
`codex-session-readback`. Two read-only review agents; root was the sole writer.

**Criterion 1:** met. `packages/console/test/live.test.ts` exercises combined passive status/orders/audit refresh and recovery without receipts, read/mutation/audit/refusal parity with `console invoke`, exact ordinary events plus the two console receipts, literal arguments, serial input and signal abort. The passive audit is a bounded L0/L1 and recent-event preview with raw omissions named; `audit` invokes the full WO-116 L0/L1/L4 render through the same client. The final focused selection passed 22 tests; [corrected design](decisions.md#wo-117-d004) records the display choice.

**Criterion 2:** met. The operator reported completing the corrected walkthrough. [Witness](witness.md#operator-retry--2026-09-29) records the real resident's away/back receipts, cadence-driven script completion, compiled diff and full audit, with identifiers reduced to shapes and human attribution explicitly based on the conversation report. The first failed UI attempt and the second script's expected operator-return cancellation remain visible. [Terminal evidence](terminal-probe.json) separately proves the corrected prompt and readable result behavior.

**Criterion 3:** met. `packages/skeleton/test/runtime-status.test.ts` regressions prove missing launchpad and invalid configuration startup, stale good-binding replacement, helper cause preservation, valid restart recovery, FIFO index and binding startup, and cleanup only after lifetime ownership. Nonblocking descriptors are fstat-checked before reading; causes are allowlisted and omit paths. The focused selection passed. Carry-in FUP-4656197433cb8b3d is settled on this implementation and evidence.

**Criterion 4:** met. Product 04's host and index-source sentences changed in place, adding 216 bytes against 1,145 bytes of headroom; its total is 59,927 under 60,856. README's existing console sentence is folded; console README, the appended dated `console.live` capability row, decisions and publication locks are updated. Application v0.56.0, console 0.4.0 and skeleton 0.45.1 are prepared; four selected editions are re-minted with unchanged feedback behavior carried, and previous editions are retained.

**Criterion 5:** met. `npm test -- --review` passed 38 suites with zero failures; `npm run test:docs` passed 23 suites with zero failures after correcting the capability row's header to the existing supported format. `git diff --check` is clean. No new dependency was added.

Validation source: canonical host gate at code identity
`a4e5e0d883c36a395a337035cd6ad7c3b74f7689d599ac550f93d10e8597a26c`,
recorded 2026-09-29T15:57:07.980Z. `npm test -- --review` passed 38 suites
(82 fresh tasks), 0 failed, in 588.897 seconds. Focused tests passed 22/22 in
15.186 seconds.
The supplemental terminal probe was recorded separately before the gate; its
record does not establish an exact code identity or timestamp. The document
gate passed in 13.74 seconds; its earlier unsupported capability
header failure is corrected and recorded in D006.
The two deliberately stopped gate attempts consumed 170.4 and 10.1 seconds
and recorded no pass. The product gate's critical path was the harness and
resident suites; the additional terminal probes found usability failures the
original non-terminal fixtures missed. No measured performance saving is claimed.

Current authored changes were reviewed through full new-file reads and scoped
diffs; generated/large artifacts stand on their generator and gate checks.
Two read-only agents were reused, no descendants were requested, and root
remained the sole writer. Automatic Codex read/admission coverage is unknown;
zero observed subagent admissions does not replace that explicit count.
Final token counters remain in ignored session receipts and the response.
Verification, final review and publication are separate dispatches.

## Final-review correction — 2026-09-29

The earlier claim that the supplemental terminal probe "then passed on that
build" overstated its provenance: it was recorded before the full gate, without
an exact timestamp or code identity. VER-001 separately records a final-build
24x80 real-resident probe. The operator ran an earlier build, as the
[witness correction](witness.md#final-review-correction--2026-09-29) now states.
Payload validation has committed regression coverage; terminal clipping and
pause behavior have probe evidence, with committed terminal tests still T1.

Criterion 3's original carry-in settlement is superseded by D008:
FUP-4656197433cb8b3d remains open for the configuration-path FIFO. Product 04's
corrected addition is 331 bytes (60,042 total), replacing the executor's
216-byte measurement after the bounded review edits. The
[final-review fixture transcript](fixtures.txt) supplies the missing R1 record;
its source identity and actual execution result are printed there. Original
executor gate results above are retained as historical evidence.
