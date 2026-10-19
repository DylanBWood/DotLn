# WO-221 repair handoff

This repair resolves the blocking large-tree close defect in [FINAL-001](../../final-reviews/WO-221/FINAL-001.md), plus its bounded adjacent findings F10, F11, F19 and F20. [D039](decisions.md#wo-221-d039--a-large-supported-path-list-keeps-its-complete-ignore-judgment) records the buffer repair and comparison; [D040](decisions.md#wo-221-d040--bounded-close-safeguards-and-truthful-deadline-text-remaining-review-findings-stay-boarded) records the safeguards, text correction and remaining follow-ups. The earlier VER-001 repairs and D028's operator-approved host-format amendments remain covered by the fresh complete gate. Filed verification and final-review reports are unchanged.

The executable evidence establishes fixture behavior. All three live host episodes remain unrun and blocked in [host-qualification.md](host-qualification.md). The earlier handoff's claim of default-mode operation without an operator step was unsupported; its unmet criterion 4 judgment also overlooked the express blocked-row fallback. [D034](decisions.md#wo-221-d034--correct-the-handoffs-live-host-and-criterion-4-claims) records both corrections.

## Criterion judgments

**Criterion 1:** met — The passing `harness-fixtures` suite covers registered-target admission for the declared push, draft PR and helper forms at `verified`, and publication at `closed` with a passing review. Negative cases cover unregistered paths, wrong origins and branches, force, shell operators, phase, missing grant and deny matches. This observes hook output, not a live host classifier.

**Criterion 2:** met — Under the operator-approved sidecar requirement, the passing `target-worktree` fallback case writes the order's literal Claude rules, records only its additions in the ignored ownership sidecar, and removes those additions at close while preserving pre-existing operator rules, including an overlapping rule. Absent opt-in writes nothing; stale ownership is detected and removable. The additional rewrite case validates committed opt-in and target binding before touching existing files.

**Criterion 3:** met — The same fallback case writes `.codex/rules/dotln-WO-999.rules` under `hostRules: "literal"`, binds it to the registered order, and removes it at close. Start validates registration before writing; absent opt-in writes no rules. The approved requirement keeps `.codex/config.toml` free of prefix-rule tables. Target start's Codex `--add-dir` and Copilot `--allow-tool` launch lines, and their absence for launchpad orders, are covered by the target-worktree and configuration-root suites. D028 and D029 replace the original artifact/scope mismatch through operator authority, not a waiver.

**Criterion 4:** met — Solely under the criterion's express fallback: host-qualification.md records all three hosts blocked, with their launch commands, because the operator has not run the episodes. Live host versions, default-mode admission and approval behavior remain unobserved. No live qualification is claimed.

**Criterion 5:** met — The passing target-worktree draft case checks unchanged HEAD and status, the declared branch push, draft creation and its lifecycle event, refusal at the wrong phases, duplicate-draft handling, and closed-phase reuse with the recorded-head lease, updated body and ready transition. The target-publish suite also passes.

**Criterion 6:** met — The complete target-worktree suite passed, including the existing disposable cleanup and operator-material refusal cases. The new large-list case judges 8,192 multibyte/newline paths exceeding 1 MiB: an undeclared tree gets the registration remedy, a nonignored neighboring file still refuses, dry run preserves both checkouts, and publish deletes the declared tree and records its file count. The saved review probe also changed from failure to successful cleanup for 20,000 files and 1,340,000 path bytes. The adjacent case rejects ambient global/template ignore policy and retains unreadable base or declared target output before deleting anything. D030's complete base-file judgment remains intact; D039 matches its 16 MiB candidate-reader ceiling.

**Criterion 7:** met — The release-close profile and generated skills require deletion of regenerable output and prohibit moving/restoring it. The close refusal carries that remedy. The complete gate's generated-artifact and harness checks pass, including the current role oracle.

**Criterion 8:** met — The passing close fixture still records `.angular/cache/stray.tsbuildinfo` for the writing gate command and an empty list for the non-writing command. The new case records `null` and an explicit unavailable advisory for malformed records. Target cleanup can proceed, while the separate launchpad evidence-preservation check retains its damaged index; restoring that fixture index allows the retry to complete. An unavailable observation is never reported as no writes.

**Criterion 9:** met — The passing target-worktree cases cover declared `v0.1.0` publication, no-release without a policy, initial tag collision and current retry. The expanded case fails Release creation after tagging, rejects a moved tag before Release creation or launchpad cleanup, then advances the base and deletes the tag: retry recreates the tag at the earlier recorded commit and creates one Release. A further unchanged retry reports current. D031 binds both name and commit to the earlier attempt.

**Criterion 10:** met — The passing launchpad update suite covers an annotated starter tag on the refresh commit, the sibling Release, current retry, same-release seed-only refresh and preview by tag from a fresh instance. New cases reject an initial ancestor without a manifest and an ancestor from the previous core release, leaving refs and Releases unchanged. D033 requires the retained ancestor's regular committed manifest to identify the exact core commit and tag.

**Criterion 11:** met — The kit README, repository registration README and product 07 document registration-derived trust, opt-in draft/actor, disposable/release keys, starter tags and delete-on-merge. This repair adds the named-tag preview example and documents fetched-tree-only ignore policy, its 16 MiB limit, unreadable-directory refusal and unavailable advisories. Product 07 and the source comment now state the existing six-hour complete-selection wrapper bound. `npm run publication:check` passed after sync refreshed the publication source lock; the complete gate's generated-artifact checks also passed.

**Criterion 12:** met — The fresh `npm test -- --review` run passed at 2026-10-19T10:58:31.828Z: 40 suites, 99 fresh tasks, zero failures, 2756.610 seconds. Evidence reference: `host-gate:33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d:npm test`. `git diff --check` passed. The lockfile retains only the staged skeleton version and workspace-pin changes; no dependency was added. Deterministic authority/harness generation and the retained feedback evidence projection pass in that run. The final post-write `npm run test:docs` row is required and consumed by `repair-complete`; RepairCompleted records the exact complete and document evidence it consumes.

## Repair evidence and scope

| Item | Repair and executed evidence |
| --- | --- |
| FINAL-001 F1 / D039 | `git check-ignore` now has the candidate reader's 16 MiB output ceiling. The immutable review probe failed before and passed after the repair; the permanent large-list regression passed in the complete gate. Spawn failures retain the source and name the error code or Git diagnostic under the existing remedy. |
| FINAL-001 F10 / D040 | The scratch ignore repository disables init templates and global excludes. The complete-gate case proves ambient policies cannot authorize deletion. |
| FINAL-001 F11 / D040 | Unreadable base directories and unreadable declared target output refuse before deletion. The complete-gate case preserves readable and unreadable output, target worktree and refs in both modes. |
| FINAL-001 F19 / D040 | Malformed advisory records produce an unavailable observation. The complete-gate case distinguishes successful target cleanup from retained launchpad evidence and completes after that index is restored. |
| FINAL-001 F20 / D040 | Product 07 and the stale source comment state the implemented six-hour outer bound. The amended order's deliverable is read with D021 as exempt from the 900-second probe deadline; its acceptance text remains unchanged. The kit README also gains the named-tag preview example noted by the reviewer. |

The [repair evidence](repair-final001/README.md) records the before/after probe and one bounded comparison: the single-buffer and batched arms both preserved 80,000 paths and 13,428,890 bytes; one process took 133 ms versus 67 processes and 474 ms. This is one sample, not a general benchmark. Lists beyond the existing 16 MiB reader limit remain outside this repair.

The first complete run failed after 1052.930 s because the new test replaced the fixture's Git config and lost its local forge transport. The corrected test preserves that config before adding global excludes; its bounded reproduction passed in 32.173 s, followed by the fresh complete run above. The earlier chat assertion that those cases passed mistook progress for results; the evidence README records the specific error and correction. No failed or focused row was composed into the complete pass.

`adjacent-0002` is completed against the passing complete row. FINAL-001 F2–F9 and F12–F18 remain deferred on `FUP-3a4c476e4e8099bd` for planning or the next edit to their named surfaces, as D040 records. D035 and D036's earlier follow-ups remain separately boarded. No claim is made that this bounded repair resolves them.

## Review, release and limits

self-review: found 2; fixed 2; recorded 0 — two test deficiencies in this repair: the read-only worker identified the need to distinguish target cleanup from blocked launchpad evidence preservation, and the complete gate caught the missing fixture transport configuration, which the reused worker confirmed. Both are corrected and exercised. One worker was reused for diagnosis and review, with launch selection `gpt-6.1-sol` / `max`; effective effort is unobserved. It wrote no files and ran no tests. The original implementation's historical 37/33/4 counts remain in D014 and D021. Independent re-verification and final review remain separate dispatches.

`release prepare --local` retained application v0.85.0, skeleton 0.61.0 and harness contract 0.37.0; no extra version bump was added. The earlier D016–D020 gate-process scope and D019's planning follow-up remain recorded. No user setting, branch publication or real forge release was changed in this repair. Nested-repository inventory was empty. The complete-gate runner and final evidence waiter exited successfully. The earlier waiter reached its default 1200-second wait limit and was replaced by a 3600-second waiter without restarting the gate; no repair-owned monitor remains.

The outcome matches the authorized repair scope. The material traps were removing ignored files from the candidate scan again, letting ambient policy authorize deletion, deleting before an unreadable directory is judged, presenting an unavailable advisory as an empty observation, and mistaking fixture admission for live host qualification. The retained scan, isolated judgment, refusal tests, explicit unavailable value and blocked qualification rows address them. NoOp would have retained the reproduced close regression. The bounded comparison favored matching the existing reader ceiling over subprocess batching.

## Repair actor and process cost

```json
{
  "harness": "codex-cli",
  "harnessVersion": "0.163.0",
  "model": "gpt-6-astra",
  "effort": "ultra",
  "source": "codex-session-readback"
}
```

The lifecycle records the supplied `ultra` spelling with normalized `xhigh` effort and subagent mode. Entry usage: 37,517 reported tokens at 2026-10-19T09:41:41.253Z. Handoff usage: 14,756,280 reported tokens at 2026-10-19T10:58:31.949Z (14,712,949 input, including 14,445,184 cached input; 43,331 output). Source: `codex-transcript-counter`; scope: `dispatch`. Totals include repeated/cached input and are not unique context; monetary cost is unknown. The explicit session count is one worker with no descendants; the harness observed zero, so its remaining-count readback does not describe all admissions. Final counters stay in ignored receipts and the response; this document is not edited after its final validation.
