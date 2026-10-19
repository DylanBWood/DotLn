# WO-221 VER-003 probe evidence

Subject: code identity `33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d`, checkout HEAD `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`. The judged tree is checkpoint `refs/dotln/checkpoint/WO-221/13`, the FINAL-001 repair's completion. A hash comparison of every tracked and untracked file finds the working tree differing from it in only two sets of files. The first is the verify dispatch's control projections: `docs/control/current.md`, the order's event log and the work-order index. The second is this verification's own writes: this directory, the VER-003 report, the evidence-index line, and decisions D041 to D043 with their generated index and register rows. The verifier did not edit the implementation, and the code identity is unchanged after these writes.

`probes.mjs` builds each mode from the target-worktree suite's fixture helpers (local bare remotes and the mocked `gh`) in a generated copy under system temp, as the VER-002 and FINAL-001 probes do. Each probe runs release close with its own child-output limit of 256 MiB, so an oversized refusal is measured rather than cut off by the fixture runner's 4 MiB cap. Nothing reaches a real service, and every probe removes its temporary files.

Most modes reproduce criterion 6's arrangement: the order's target change adds the `.gitignore` and merges through another checkout, so the clone's base checkout stays behind the fetched base and its working-copy rules predate the merged ones.

Run from the repository root, one process at a time:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-003/probes.mjs <mode>
```

A probe asserts the safe or required behavior, so the three modes that exit 1 below are reproduced defects, not passing checks. The table records the run of the saved file (SHA-256 `9ff3cf0d774fc2a89081175930341875f7b533236cc30a7476e9757ec44cfb7f`) on 2026-10-19 UTC. In quoted output, `<fixture>` stands for the fixture's temporary root and `<node>` for the Node executable path.

| Mode | Started | Exit | Bounded duration | Observation |
| --- | --- | --- | --- | --- |
| `base-large-undeclared-then-declared` | 11:57:10 | 0 | 17.814 s | 14,800 files (1,050,800 path bytes) under `bower_components/`, which only the merged tree ignores and no declaration covers. The publishing close exits 1 with `target clone base main has undeclared ignored material; source retained: bower_components/. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun …`, naming the path once. All 14,800 files remain, the base does not move and the target remains. Renamed to the declared `node_modules`, the same tree is deleted. The close exits 0, the base fast-forwards to the fetched commit, the target is removed and the receipt lists `node_modules` with 14,800 files. This is D038's reopen observation in the moving-base arrangement. |
| `base-over-ceiling` | 11:57:28 | 1 | 23.610 s | 101,500 files (17,052,000 path bytes, over 16 MiB) under a declared `node_modules` that the merged tree ignores. Close exits 1 with the source retained: all 101,500 files remain, the base does not move and the target remains. The refusal on stderr is 16,843,069 bytes, holding 100,254 NUL-separated paths between `target clone base main cannot close:` and `; source retained. Fix what Git reports, then rerun …`, and the receipt's blocker reason is 16,843,061 bytes. D041. |
| `ambient-xdg-and-template-config` | 11:57:52 | 0 | 14.498 s | With `$XDG_CONFIG_HOME/git/ignore` ignoring `ambient/` and a global `init.templateDir` whose `info/exclude` ignores `tmpl/`, both policies are live: `check-ignore` reports `ambient/keep.txt` and `git init` copies `tmpl/`. Operator files under the declared `ambient` and `tmpl` roots still refuse as `not clean (ambient/keep.txt)` and then `not clean (tmpl/keep.txt)` in both modes. The material, the refs and the target remain. This covers FINAL-001 F10's repair for the two sources its fixture does not exercise. |
| `target-unwritable-declared-dir` | 11:58:06 | 1 | 16.780 s | A declared `node_modules/locked/` at mode 0555 in the target worktree. Close exits 1 with `EACCES: permission denied, unlink '<fixture>/Targets/target-wo999/node_modules/locked/file.js'`. Before that it deleted `dist/out.js` and `node_modules/a.js`. The target, its bundle manifest and the base remain, and the base did not move. After restoring mode 0755 the retry exits 0. D042. |
| `null-advisory-masquerade` | 11:58:23 | 1 | 15.593 s | The clone's main checkout is detached from `main` while the gate runs. Both target gate rows record `baseCheckoutWrites: null` and `baseCheckoutWriteCount: null`, although the `base-write` command wrote `.angular/cache/stray.tsbuildinfo` into that checkout. Close exits 0 and deletes the declared base `.angular` (1). Its receipt records `baseCheckoutWrites: []` and its cleanup line prints no advisory. D043, reopening D040. |
| `target-large-declared` | 11:58:39 | 0 | 17.497 s | 20,000 declared files (1,340,000 path bytes) under the target worktree's `node_modules`, plus one file under each of `.nx`, `dist` and `.angular`. Close exits 0, deletes all four roots and removes the target. The receipt lists `.angular (1)`, `.nx (1)`, `dist (1)` and `node_modules (20000)`. This is criterion 6 at the size the target's output has. |

The saved earlier probes were rerun at this subject between 11:43:45 and 11:46:23 UTC, one process at a time under the bounded wrapper, plus the FINAL-001 blocker probe at 11:29:13. Each exited 0:

| Saved probe | Observation |
| --- | --- |
| `final-review-001/probes.mjs base-large-ignored-tree` | 20,000 files, 1,340,000 path bytes. Close exits 0, the base `node_modules` is deleted and the target is removed. FINAL-001 F1 repaired. |
| `verification-001/admission.mjs` | The registered-target admission fixture and its variants pass (9.5 s). Criterion 1. |
| `verification-001/probes.mjs close-preignored-env` | Close exits 1 naming `.env` with the registration remedy; `envRetained: true`, `targetRemoved: false`, `baseMoved: false`. VER-001 F1 repaired. |
| `verification-001/probes.mjs fallback-original` | Opted-in rules are written and removed, and stale ownership is reported and removed. Criterion 2. |
| `verification-001/probes.mjs fallback-optout-rewrite` | The rewrite exits 1 with `has not opted into hostRules literal; no host rules changed`, and neither file is written. VER-001 N1 repaired. |
| `verification-001/probes.mjs draft-ready-retry` | After a ready failure, the retry exits 0 with the remote at the reviewed head. Criterion 5. |
| `verification-001/probes.mjs draft-moved-head` | A moved draft branch is refused as `(stale info)` and the remote is unchanged. Criterion 5. |
| `verification-002/probes.mjs base-info-exclude-env` | A `.env` hidden only by `info/exclude` refuses as `not clean (.env)` and is retained. Criterion 6. |
| `verification-002/probes.mjs base-preignored-disposable` | A declared base `node_modules`, already ignored, is deleted, and the receipt lists it. Criterion 6. |
| `verification-002/probes.mjs release-tag-moved-forward` | A forward-moved tag refuses with `not the recorded release commit` and creates no Release; the restored tag yields one Release at the recorded commit. Criterion 9. |
| `verification-002/probes.mjs literal-dirty-main` | Still reproduces VER-002 F1 (D035, boarded): `?? .codex/rules/dotln-WO-999.rules` leaves main unclean for the next start. |
| `verification-002/probes.mjs control-dirty-main` | Without the opt-in, main stays clean and the launchpad order prints no host launch lines. Criteria 2 and 3. |
| `verification-002/harness-check-stale.mjs` | The stale-rule line prints with its removal remedy. Criterion 2. |
| `final-review-001/shared-rules-probe.mjs` | Still reproduces FINAL-001 F15 (boarded): `ghRulesAfterFirstClose: 0`. |

The same session also ran the saved VER-001 gate audit (11:23:28 UTC). It found the worktree's complete review row at this identity: recorded 2026-10-19T10:58:31.828Z, 40 suites, 99 freshly executed tasks, no failed task, 2756.610 s.

The following checks all passed:

- `npm run format:check` (11:47 UTC)
- `git diff --check`
- `node scripts/harness.mjs check` (34 generated surfaces)
- `node scripts/authority-evidence.mjs --check`
- `node scripts/feedback-evidence.mjs --check`, which reports the retained WO-216 live audit's judged behavior unchanged
- `npm run publication:check`
- `npm run meta -- --check`, which prints only the standing WO-150-D003 reopen candidate

See [VER-003](../../../verifications/WO-221/VER-003.md) for the verdict, criterion judgments and limits. [D041](../decisions.md#wo-221-d041--ver-003-follow-up-past-the-16-mib-candidate-ceiling-the-base-refusal-echoes-the-captured-path-list), [D042](../decisions.md#wo-221-d042--ver-003-follow-up-an-unwritable-declared-directory-stops-the-close-with-a-raw-error-after-part-of-the-declared-output-is-gone) and [D043](../decisions.md#wo-221-d043--ver-003-an-unavailable-gate-observation-reaches-the-close-receipt-as-an-empty-list) board the three follow-ups.
