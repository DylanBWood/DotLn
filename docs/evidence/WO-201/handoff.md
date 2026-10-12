# WO-201 repair handoff

VER-001 F1 and F2 are repaired, including the operator-confirmed adjacent
`--only` fix. `publication-fixtures` now runs in exported product and review
gates. Explicit requests for declared unavailable suites fail with their name
and reason before a task or gate result is recorded. D014 corrects the earlier
exclusion judgment; D015 records the selection rule. VER-001 remains unchanged
as the independent judgment of its earlier subject.

**Criterion 1:** met — `gate-in-kit.json` records all three gate selections passing in one committed, source-free export under the bounded wrapper. Each starts with `kit-verify`, no build runs, and compiled-test drift refuses by path. The focused case takes 74,490 ms; the complete launchpad suite also passes in the full review gate.

**Criterion 2:** met — the current inventory has 27 carried rows and 45 exclusions. `publication-fixtures` executes fresh in the clean export and is included in review. `suite-inventory.json` preserves the contaminated observation as history and cites clean validation for all remaining exclusions: 41 from VER-001 and four from the clean second batch, with the report's stated limits. The fixture still compares printed exclusions, lists, executed selections and their union; it additionally requires publication-fixtures and beacon-portability independently of the declaration table. The runner rejects unavailable explicit selections without recording a result.

**Criterion 3:** met — the rebuild fixture passes byte-for-byte comparisons of manifest-listed `dist/src` and `dist/test`, and checks that package source is absent. D001, D004 and D006 retain the fixture/support inventory. D016 records 863 files / 15,971,669 listed-file bytes, +6,178,095 bytes over the pre-order baseline; net file-set growth is 6,146,821 bytes.

**Criterion 4:** met — the direct verification fixture passes on a fresh export, refuses compiled runtime and test drift by path, and reports script drift in one advisory without refusing. Explicit-root and current-directory checks pass. The gate fixture confirms advisory delivery and verification before other tasks.

**Criterion 5:** met — the README's product and review lists now include publication-fixtures, and its exclusion table contains the 45 supported declarations. Exact observed-list and reason comparisons pass in the export fixture. Instance-owned orders, reports and planning, and the true-fork update contract remain documented with WO-202 and WO-203's pending capabilities qualified. The template remains manifest-listed. Explicit unavailable --only requests, including list requests, are documented as failures with no gate result.

**Criterion 6:** met — product 03 and the legal write-back remain in place, the capability reassessment uses the corrected inventory and passing export evidence, D004 retains the WO-138 oracle exclusion, and D014–D017 record the repair and measurements. Publication checks pass with 254 headings and current source locks; the lineage index check passes with 170 sections.

**Criterion 7:** met — `npm run test:docs` passes 35 suites in 113,629 ms; `npm test -- --review` passes 32 suites / 84 fresh tasks in 1,206,139 ms at code identity `77dc3935cfebec2380d7464234649c0e639778f286ce4ade9af02b6fe501df9d`. `core-gates.json` records the passing rows. `git diff --check` is clean. Dependency and component manifests are unchanged.

self-review: found 0; fixed 0; recorded 0

The repair's separate criteria and design passes found no additional issue;
`self-review.md` records their scope. VER-001 supplied two findings and both
are fixed. The original implementation's two fresh workers found one issue,
fixed then; their historical reports and counts remain in that file. No
worker was spawned during this repair.

The outcome matches the repair goal: every remaining exclusion has clean
missing-input evidence, portable publication fixtures run, and an unavailable
explicit request cannot leave a passing suite row. The first combined export
probe hit a monitor startup failure before its command ran; its unchanged
rerun and the complete review gate pass. D016 records that observation and its
unknown host-census cause without weakening a check.

D017 records launchpad at 328,008 ms, including the three-selection case
at 191,260 ms and the existing update case at 74,466 ms. The original
cost watches remain for final review/planning; all three selections remain.
The repaired findings in FUP-8ea5ac7538fe92d8 are ready for independent judgment;
final review owns its disposition and the allocated follow-up dispositions.
The prepared application target remains v0.77.0.

All probes and gates completed and both log monitors were stopped. The material
inventory found no nested repository. Only canonical lifecycle checkpoints
are used; no branch commit or publication was performed.

Actual repair attestation: `codex-cli` 0.162.1, `gpt-6-astra`, selected effort
`max`, source `codex-session-readback`. Usage belongs in the ignored session
receipt and operator response. The lifecycle receipt controls the phase;
independent re-verification and final review remain separate dispatches.
