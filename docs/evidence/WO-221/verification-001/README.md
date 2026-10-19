# WO-221 VER-001 probe evidence

Subject: code identity `cf32f5c67881960695f718f5dc99982b731fbbe9e61f0fb8ce977aa0ada2cd1f`, checkout HEAD `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`. The implementation was not edited by the verifier. These probes use the current fixture helpers, local bare Git remotes and a mocked `gh`; they publish nothing to a real service. The generated copies and fixture repositories live in system temp and are removed by the probes.

Run from the repository root, one process at a time:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/admission.mjs
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs close-preignored-env
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs close-moved-release-tag
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs fallback-markers
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs fallback-optout-rewrite
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs fallback-original
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs draft-ready-retry
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/probes.mjs draft-moved-head
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/gate-audit.mjs
```

The four negative probes assert the required safer behavior; their exit 1 below is the reproduced defect, not a passing test. `fallback-markers` checks the ownership marker spelling the implementation uses in its Codex output; inspection of the full Claude settings object also confirms it has only `permissions.allow`, with no alternative ownership marker.

| Probe | Observed result on 2026-10-19 UTC | Bounded duration | Meaning |
| --- | --- | --- | --- |
| `admission.mjs` | 05:01:10.951, exit 0 | 9.278 s | Original registered-target clauses pass, plus a valid grant written but not committed to main remains withheld, quoted and tool-cwd-bound pushes admit, and an extra push argument is withheld. |
| `close-preignored-env` | 04:59:19.811, exit 1 | 16.128 s | Close exits 0; `.env` retained; target removed; base moved; fixture Release created. V1-F1. |
| `close-moved-release-tag` | 05:00:18.483, exit 1 | 23.981 s | First close exits 1 after tag publication; moved tag retry exits 0, tag is not the recorded commit, fixture Release created. V1-F2. |
| `fallback-markers` | 04:59:29.719, exit 1 | 4.017 s | Claude settings markers absent; Codex markers present. V1-F3. |
| `fallback-optout-rewrite` | 05:02:29.704, exit 1 | 4.065 s | No settings after opted-out start; rewrite exits 0 and creates Claude and Codex files. V1-N1. |
| `fallback-original` | 05:02:11.609, exit 0 | 14.552 s | Opted-in rules write and remove correctly; stale ownership is identified and removed; absent release policy reports no-release. |
| `draft-ready-retry` | 04:50 UTC, exit 0 | 22.039 s | A simulated ready failure resumes with one PR, the reviewed remote head and the original draft-reuse record. Run from the scratch copy whose injection is retained in `probes.mjs`. |
| `draft-moved-head` | 04:57:22.634, exit 0 | 19.538 s | Moving the remote draft branch causes stale-lease refusal and leaves the moved remote unchanged. Run from the same scratch generator before filing it here. |
| `gate-audit.mjs` | 05:02:50.662, exit 0 | 0.800 s | Finds the worktree's standing complete review row at the subject identity: 03:15:23.923 UTC, 40 suites, 99 freshly executed tasks, zero failures, 2538.373 s. Executes no gate. |
| `npm run format:check` | 05:03:03.020, exit 0 | 6.495 s | All matched files, including the saved probes, satisfy the code formatter. |
| `git diff --check` | 05:02 UTC, exit 0 | not measured | No whitespace errors in the tracked diff. |

Probe preparation failures are not product findings: the first scratch audit passed no script through stdin to the bounded wrapper, one audit used an incorrectly shaped candidate row, the ready-retry variation initially retained an inapplicable original call-count assertion, and admission extraction needed its fixture URL and helper prefix preserved. The original extra-grant variation was replaced by the final valid uncommitted-grant check. Corrected runs above establish the reported results. No implementation edit was used to obtain a pass.

The original criteria adversary, design improver and later gate-process adversary reports were read along with their D014 and D021 dispositions. The changed admission, target publication, close, release, starter refresh, configuration, gate reuse, runner, completion, generated-artifact and role paths and their tests were reviewed. Synthetic host admission does not qualify a live host; the three live rows remain blocked under criterion 4's explicit fallback.

See [VER-001](../../../verifications/WO-221/VER-001.md) for the independent verdict, criterion judgments and limitations. D022–D027 in [decisions.md](../decisions.md) board every reported unresolved item. The post-write document gate and completion receipt provide the final record-validation row; this evidence does not predict its result.
