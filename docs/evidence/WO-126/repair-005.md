# WO-126 repair of VER-005

The operator's `resume: fix` selects [VER-005](../../verifications/WO-126/VER-005.md).
F24–F28 are repaired within criteria 6, 8 and 17. The
[measurements](repair-005-results.json) distinguish reproduction, focused tests
and the fresh fast gate. Final full/diff evidence belongs to the
`RepairCompleted` transition after these authored bytes, as D022 requires.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

The version is the bounded local CLI observation; model and effort use the
repository's operator-selected default, without effective-session readback.

| Finding  | Repair and executed evidence                                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F24, F26 | Package execution wrappers classify their child; assignments and inline Git configuration retain the literal screen; executable names are case-folded. Tests cover denied routes and ordinary data controls, including installed hooks.                     |
| F25      | The existing timing row records one refusal class per deny/block. An installed-hook fixture observes three refusals, one admitted command and an advisory Stop; the meter counts exactly three guard refusals and zero Stop refusals, without command text. |
| F27      | Failed split cases retain an addressed diagnostic log through aggregation and evidence storage. The fixture reads the original failure back through its case `outputRef`; passing stdout is absent.                                                         |
| F28      | Package suites start after the build while fixtures keep preflight dependencies. Fixtures exercise both successful and failed preflights. Live, skeleton started at 21:04:31.651Z, before index began at 21:04:36.649Z and finished at 21:05:03.254Z.       |

Six new regressions failed before the repair (1.394 s) and passed after it
(1.790 s). Expanded classifier/hook coverage passed 13 tests in 7.975 s; runner,
cache and release-fixture coverage passed 26 in 28.285 s. An initial build
exposed a missing JSDoc parameter type in the new diagnostic helper; the corrected
build passed before the successful source tests.

`npm test -- --fresh` passed all 12 suites in **110.264 s**, with no reuse and
9.736 s below the unchanged ceiling. Skeleton took 105.398 s, console 63.982 s
and index 26.605 s. This is one host measurement, not a guarantee under other
load. No other test or probe ran beside it; progress-log reads were incidental.
The comparison baseline remains VER-005's 110.029 s; the observed improvement is
the removed dependency, not a claimed wall-time speedup across differing runs.

The npm wrapper follows its documented option boundary: npm can parse flags
after positional arguments until `--`, unlike npx. Unsupported forms refuse
with a classification reason. [npm exec documentation](https://github.com/npm/cli/blob/latest/docs/lib/content/commands/npm-exec.md).
The adapter still does not decode arbitrary scripts, transformations or ambient
configuration. Denied effect examples were classified, never executed.

Cost: the repair adds bounded parsing, a small field on an existing journal
write, and diagnostic storage only for failures. It adds no hook, dependency,
recurring command or completion step. Focused regressions plus one fresh fast
measurement precede the existing single full/diff completion command; they
replace ad hoc reproductions and establish the reported failure boundaries.
Context, tokens and whole-session resource costs are unavailable; no new cap is
inferred. The repairs remove the lost refusal signal, lost diagnostics and
unnecessary package-test wait. Decisions [D023–D026](decisions.md#wo-126-d023)
retain alternatives and reopening conditions.

The generated harness bundle was refreshed. The feedback audit's declared
source set is unchanged, so immutable `feedback-002` remains the checked edition.
The existing minor release target and component version bumps remain applicable;
local release preparation retains all publication controls. Independent
verification and final review remain separate dispatches.
