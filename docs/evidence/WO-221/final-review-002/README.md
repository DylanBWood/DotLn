# WO-221 FINAL-002 probe evidence

Subject: code identity `33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d`, checkout HEAD `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`, after `npm run worktree -- integrate WO-221` merged nothing (both bases `8bbdcbff`, [D044](../decisions.md#wo-221-d044--final-review-integration-took-in-nothing-every-acceptance-claim-carried-forward-to-final-002)). The reviewer did not edit the implementation, and the code identity is unchanged after these writes.

`probes.mjs` builds each mode from the target-worktree suite's fixture helpers (local bare remotes and the mocked `gh`) in a generated copy under system temp, as the VER-002, FINAL-001 and VER-003 probes do. Each mode registers a class that declares `dist` and `node_modules` disposable. The order's target change commits a tracked `src/app.txt` and a `.gitignore` that ignores `.env` at any depth, `dist/` and `node_modules/`. The merge then lands through another checkout, so the clone's base checkout stays behind the fetched base, as in criterion 6's arrangement. Nothing reaches a real service, and every probe removes its temporary files.

Run from the repository root, one process at a time:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/final-review-002/probes.mjs <mode>
```

A probe asserts the required or safe behavior, so a mode that exits 1 is a reproduced defect, not a passing check. The table records the run of the saved file (SHA-256 `9662d955cd6d5501cf44c4d03634db2a42fa6ccae34604e364d98f7b8a693959`) on 2026-10-19 UTC; the same modes ran once before the file was formatted, at 12:46:51 to 12:48:53, with the same observations. In quoted output, `<fixture>` stands for the fixture's temporary root and `<node>` for the Node executable path.

| Mode | Started | Exit | Bounded duration | Observation |
| --- | --- | --- | --- | --- |
| `base-nested-env` | 12:52:07 | 1 | 11.4 s | A stray `src/.env` in the clone's base checkout, under the tracked `src/` that the fetched tree does not ignore. Close exits 1 with `target clone base main has undeclared ignored material; source retained: src/. Declare it disposable in the registration or remove it; …`. The refusal names the tracked source directory, not the path. The `.env`, the base and the target remain. FINAL-002 F1, a follow-up: criterion 6's fixture places its `.env` at the root, where the path is named. |
| `base-nested-env-remedy-followed` | 12:52:19 | 1 | 16.1 s | The same arrangement, then the printed remedy: the named `src` is declared disposable, committed and pushed to main, and the publishing close runs again. The rerun exits 0 with `disposable output deleted: base src (1)`. The operator's `src/.env` is deleted and the tracked `src/app.txt` remains. The base fast-forwards to the fetched commit. This is the consequence F1's misnamed path leads to. |
| `target-nested-env` | 12:52:35 | 0 | 12.1 s | The contrast: the same `src/.env` in the target worktree. Close exits 1 with `target has undeclared ignored material; source retained: src/.env. …`, naming the path, because the target side keeps main's outermost-ignored-directory listing. The `.env` remains. |
| `refused-close-claims-deletion` | 12:52:47 | 1 | 12.1 s | The target worktree holds a declared `dist/out.js` and an undeclared root `.env`. Close exits 1 on the `.env`, yet its cleanup line reads `branch wo-999: retained; disposable output deleted: dist (1).` while `dist/out.js` remains. FINAL-002 F2, a follow-up. |

The reviewer also reran twelve saved probes at this subject between 12:26:09 and 12:29:18 UTC, one process at a time under the bounded wrapper. Each exited 0:

| Saved probe | Observation |
| --- | --- |
| `final-review-001/probes.mjs base-large-ignored-tree` | 20,000 declared base files (1,340,000 path bytes) deleted and the target removed. FINAL-001 F1 stays repaired. |
| `verification-001/probes.mjs close-preignored-env` | Close refuses naming `.env` with the registration remedy; the `.env`, the target and the base remain. VER-001 F1 stays repaired. |
| `verification-002/probes.mjs release-tag-moved-forward` | A forward-moved tag refuses with `not the recorded release commit`; the restored tag yields one Release at the recorded commit. VER-001 F2 stays repaired. |
| `verification-003/probes.mjs base-large-undeclared-then-declared` | 14,800 undeclared files under `bower_components/` refuse, named once, with every file retained; renamed under the declared root they are deleted and the base fast-forwards. |
| `verification-003/probes.mjs target-large-declared` | 20,000 declared target files deleted with the other three roots; the target is removed. |
| `verification-001/admission.mjs` | The registered-target admission fixture and its variants pass. Criterion 1. |
| `verification-001/probes.mjs fallback-original` | Opted-in rules are written and removed, and stale ownership is reported and removed. Criterion 2. |
| `verification-002/probes.mjs control-dirty-main` | Without the opt-in, main stays clean and a launchpad order prints no launch lines. Criteria 2 and 3. |
| `verification-001/probes.mjs draft-ready-retry` | After a ready failure, the retry exits 0 with the remote at the reviewed head. Criterion 5. |
| `verification-001/probes.mjs draft-moved-head` | A moved draft branch is refused under the lease and the remote is unchanged; the refusal is Git's raw `(stale info)` rejection with no remedy (FINAL-002 F13). |
| `verification-002/probes.mjs base-info-exclude-env` | A `.env` hidden only by `info/exclude` refuses as not clean and is retained. Criterion 6. |
| `verification-002/harness-check-stale.mjs` | The stale-rule line prints with its removal remedy. Criterion 2. |

The saved VER-001 gate audit found the complete review row at this identity after the integration (12:22:01 UTC) and again after these writes: recorded 2026-10-19T10:58:31.828Z, 40 suites, 99 freshly executed tasks, no failed task.

Three independent read-only `dotln-worker` reviewers read the diff after the integration, dispatched at 12:25:04 UTC. The first covered the core lifecycle and gate process, the second target trust and publication, and the third the close, the releases and the starter refresh. The third named the nested-path refusal, which the probes above then reproduced. The fork's registered target clone was also read on 2026-10-19: its base checkout holds no untracked or ignored file, and its WO-004 close met only the root-level `.angular` cache, which the refusal names correctly. See [FINAL-002](../../../final-reviews/WO-221/FINAL-002.md) for the verdict and the findings, and [D045](../decisions.md#wo-221-d045--final-review-pass-final-002-at-the-integrated-subject-the-base-refusals-nested-path-naming-leads-thirteen-boarded-follow-ups) for the follow-ups' repair rules and the same-day correction of this review's first routing.
