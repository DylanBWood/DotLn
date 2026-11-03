# WO-241 — The features file: `dotln.config.json` gains a `features` section an operator reads and edits by feature name, a registry in the kit says what each feature is, whose it is (core, instance or both), its default and where it is read, a generated `FEATURES.md` renders the instance's elections as a table, and the first two elections are wired through it (v0.114.0)

Until now an instance's elections were scattered: four `release.*` toggles that no script reads, `kit.applyInstanceActions` read by the update, `null` switches in the budgets file, the Tinkerer economy equipped by a compiled default with its opt-out in a build overlay, and `features.desktop-control` as the one accepted feature id. Nothing listed what an instance could turn off, by whom, whether anything read it, or that the refusals, the writer reservation and the clean-room floor are not switches.

This change gives `dotln.config.json` a `features` section an operator edits by name: `"tinkerer-economy": false` or `"private-destination": { "on": true, "note": "<the operator's reason>" }`. An absent section is today's behavior byte for byte. A misspelled id refuses naming the id, the known ids and `npm run features -- list`; a non-boolean `on` or a non-string `note` refuses naming the key; and an id whose election lives elsewhere (`kit.applyInstanceActions`, a `release.*` or `build.*` key, `drive.sandbox`, a budgets key) refuses naming that key, so no election loads as a silent no-op. A renamed id would load with an advisory naming its successor for one kit release before it refuses; no id has been renamed yet.

The registry in `scripts/lib/features.mjs` declares each feature once: id, scope (`core`, `instance` or `both`), default, one sentence, the key that carries the election and the module that reads it, or `unread`, or the queued order that will. `npm run features -- list|render|check` prints the inventory, writes `docs/control/FEATURES.md` under the configured control root and refuses a stale page; `npm run meta` renders it and the document gate checks it. The page shows every row's effective value and source and ends with what the file cannot change: the refusal classes counted from the installed contract (8), the single-writer reservation and the clean-room floor.

Two elections are wired through the registry and two existing ones are absorbed. `tinkerer-economy` (instance, default on) is read at emit, so an instance that sets it `false` emits an executor root without the support; the old overlay `equip`/`unequip` route still works this kit release with a migration advisory, and a conflict between the two refuses. `private-destination` (instance, default off) rewrites only the exported instance's known §Secrets paragraph to admit the owner's ordinary project links and identifiers inside that instance, keeps credentials excluded, leaves the outward private-terms screen refusing, restores the template paragraph when turned off, and refuses to rewrite a customized paragraph. `desktop-control` keeps WO-251's election with its reader named, and `plan-first` is declared for WO-242 with no effect until it lands; when a queued consumer closes without a registry update, `features -- check`, `npm run meta` and `npm run plan -- start` print a planning advisory and refuse nothing.

The inventory tells the truth about what exists. The four `release.*` surfaces and the saved `build.loadout` and `build.profile` selections are marked `unread` because the real CLI ignores them, proved by emitting with them configured. Budget rows name `docs/control/budgets.json` as their source, and the subagent-cap row says that its runtime reader uses the default budget path even when the control root is relocated, which it does. The kit's example configuration declares the four instance elections at their defaults with one in the `{ on, note }` form; the kit guide gains §Features; product 07 and the standing feature-configuration page describe the section, the forms, the registry, the page and the refresh order. `npm run sync` now refreshes the installed harness before metadata, because the page reads the refusal count from the installed contract.

Validation: the execution's review ladder found four findings in round one (build selections credited with readers, the subagent cap's path, a Secrets substring match and a second overlay loader), all fixed and confirmed in round two; five complete runs failed on consumers the consistency review missed (copied fixture inputs, a core-archive assumption in the qualification runtime, the planning-start key inventory, generated-artifact ordering and the target-worktree copy), each repaired with its own combined review and recorded in [D008 to D012](../../evidence/WO-241/decisions.md#wo-241-d008); the sixth `npm test -- --review` passed at code identity `3fd4e3a3…` and the document gate at the candidate tree. [VER-001](../../verifications/WO-241/VER-001.md) passed every criterion on independent probes against the base's code and boarded five follow-ups. The final review found `main` unmoved, reused the passing complete row at the unchanged identity, re-ran the verifier's probes and read the whole diff; the report is [FINAL-001](FINAL-001.md), the decisions are in [decisions.md](../../evidence/WO-241/decisions.md) and the release notes are [RELEASE-NOTES.md](RELEASE-NOTES.md).

Limits a reviewer should know: the five follow-ups are on the register with their repair rules (during a rename's advisory release the page would show the successor at its default while the loader applies the old id, and the one-release window is keyed on the skeleton package version; two drive-session reader proofs observe the budgets parser rather than the drive record; the legacy overlay route has no retirement, the kit guide's overlay example still uses it and each emit prints its advisory twice; `config.mjs`, `features.mjs` and `build-overlay.mjs` form an import cycle that holds while no module reads another's export at load). The spawn-cap runtime still reads the default budget path ([D003](../../evidence/WO-241/decisions.md#wo-241-d003)); the Agent review recorder labels Codex workers with Claude defaults ([D004](../../evidence/WO-241/decisions.md#wo-241-d004)). Electing private-destination adds 315 bytes to every role's cold start in that instance, which leaves the kit's router at 16,343 of its 16,384-byte ceiling; core's own executor, verifier, planner and release-close roots exceed their ceilings before and after this change, as already boarded.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-03T22:33:01.155Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-241/executor | 5 h 22 min | 86,542,587 | unknown | unknown | 580 | 0 | 0 |
| WO-241/verifier | 0 h 35 min | 39,830,047 | unknown | 147 | 173 | 0 | 0 |
| WO-241/reviewer | 0 h 1 min | 220,447 | unknown | 81 | 82 | 0 | 0 |
| WO-241/release-close | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-241/planner | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-241/refuter | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-241/router | unknown | unknown | unknown | unknown | unknown | 0 | 0 |

Against WO-238, the previous closed order: wall clock 4 h 29 min less.

Against WO-238, the previous closed order: tokens 474,872,397 fewer.

Against WO-238, the previous closed order: commands 1,012 fewer.

Against WO-238, the previous closed order: steps 1,160 fewer.

Against WO-238, the previous closed order: bound stops unchanged (0 difference).

Against WO-238, the previous closed order: bound acceptances unchanged (0 difference).

<!-- dotln-process-meter:end -->
