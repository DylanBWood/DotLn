# WO-255 — Reviews find what the complete run finds: rechecks read the whole change again, consistency reports carry their traced consumers or are not recorded, planning passes keep their own review lanes, the criteria adversary answers the operator's dispatch item by item, a target's order is reviewed through the same helper, and every worker launch names one of the operator's four models

The review helper (`npm run worker -- review`) and its record command change in six ways, each asked for by the 2026-11-03 planning dispatch after rechecks that read only each repair found nothing while the complete run then failed, a second pass on one day could not run its reviews through the helper, consistency reports traced nothing and said so nowhere, and the criteria adversary never read the dispatch it was meant to check.

A recheck (round 2 of the review ladder) now first confirms or refutes the fixes of the earlier findings and then reviews the whole current change against the base again, with the earlier round's tree named so the fixes' delta is readable too; the combined last round and WO-250's admission rule are unchanged, so the ladder keeps its end.

A consistency report is recorded only with a `Traced consumers` table (changed contract, consumer, command, result) that carries a generated pages row and a fixture manifests row with the commands run, on the helper route and the record route alike; a table quoted in code, HTML or a blockquote is not a report section and does not count, and the same rule binds the capture's `Items` table.

A planning subject's review lane is named by its branch, `planning-<branch>` with every character outside letters, digits, dot, underscore and hyphen URL-escaped, so each lane decodes back to exactly one branch and two passes on one day, or a pass across midnight, each keep their own rounds; `--since <tree>` starts a fresh round-1 ladder under `since-<tree>/` inside the lane, and a fresh round 1 over the tree its lane last reviewed is named a re-roll in an advisory.

`--capture <file>` gives a planning subject's criteria review the operator's dispatch capture, appended to the brief under `## The operator's dispatch`; the report answers every item in an `## Items` table (item, location in the subject, `acted on`, `reviewed` or `missing`) or is refused, and the record keeps only the capture's SHA-256 and byte count, with every quoted passage of six or more consecutive words, or a whole short line, omitted from each string it keeps.

`--target <id> --order WO-NNN` reviews a registered target's order on the target's activation base and worktree, read with the host's safe Git options so the target's hooks and file monitor never run; the worker reads the target and writes nothing there, the launch counts one use, and the report stays in the launchpad's lane.

`--model opus|fable|sol|astra` on `npm run worker -- review` and `npm run plan -- refute` selects one of the operator's four worker options for the launch's host (Claude `claude-opus-5-5` and `claude-fable-5-1` at `xhigh`; Codex `gpt-6.1-sol` and `gpt-6-astra` at `max`), a cross-host option or any other name is refused naming the host's options, and without the flag the words `fable` or `astra` closing the session's latest `planning:` or `resume:` line select the host's non-default, journaled by both prompt hooks as a `WorkerOptionsSelected` row; the Codex profile now emits the custom agent `.codex/agents/dotln-worker-astra.toml` beside `.claude/agents/dotln-worker-fable.md`, and the direct `plan refute --model <option>` prints the launch the parent makes with the receipt's `--worker-type`.

Read before merging: `npm run worker -- record` now declares mixed text's intent with `--format prose|json`. Whole JSON, a whole fenced result and plain prose record as before, but text that mixes prose with a result-shaped object is refused until the flag names its intent: `prose` keeps every example and adopts no findings, `json` binds exactly one result and keeps its findings and report table, and under `json` a brace in the surrounding prose that opens no JSON object also refuses the record (put the result alone in the file). `record` also takes `--host`, `--model` and `--effort` for what ran and `--tree` for the tree the worker reviewed, refusing a report whose opening `Reviewed tree:` line names a tree other than the working tree unless `--tree` names it. The planning-lane rename touches ignored local state only; main's `planning-<date>` lanes are not read.

Validation: three verifications judged the order. [VER-001](../../verifications/WO-255/VER-001.md) (Codex CLI 0.166.0, gpt-6-astra) failed criteria 1 and 3 on a nested and a literal planning branch sharing one lane and on prose reports whose fenced JSON examples carried a `schemaVersion` or `findings` key; the repair escaped the lane name and read claims by their shape. [VER-002](../../verifications/WO-255/VER-002.md) (the same actor) failed criterion 3 again on a terminal valid example adopted as the review's findings and on multiline code-span examples, and reproduced a regression of a fenced result followed by prose; the repair introduced the explicit `--format` and reads report sections and fences through the shared Markdown parser. [VER-003](../../verifications/WO-255/VER-003.md) (Claude Code 2.1.318, claude-opus-5-5) passed every criterion on 31 independent probes with one follow-up, the `--format json` brace limit, which this review states in product 07 and the kit guide. The complete review row at code identity `39bd5b475ad3c259f473ca94796fb86df2ddddac8620f501dbf4a26b8c006c97` (44 suites, 0 h 47 min) stands at the integrated identity, since main did not move from the activation base; the final review re-ran the review-worker suite (27 of 27), the WO-255 harness and continuation cases, the WO-126 direct refutation case, VER-003's probes and the harness, publication and format checks under the bounded wrapper.

Every execution and repair ran its own review ladder: the execution's three rounds on Claude `dotln-worker` (26 distinct findings, then 2 and 1 admitted), repair 2's three rounds on Codex at the operator's Astra option (7, 4 and 1), and repair 3's rounds on Codex at Sol (2 blocking, 1 and none). The order's own first complete run failed on a test case that listed the generated Codex files by hand, which its ladder had not traced; [D020](../../evidence/WO-255/decisions.md#wo-255-d020--the-first-complete-run-failed-on-a-codex-inventory-the-wo-054-case-still-listed-by-hand) and [D022](../../evidence/WO-255/decisions.md#wo-255-d022--the-outcome-against-the-orders-aim-its-own-ladder-missed-what-its-first-complete-run-found) record it and board a third required table row (FUP-1fa649b8d330505b).

Limits: native Codex loading of the generated Astra agent, live `--target` and `--capture` launches (fake transport and dry runs only) and native Codex prompt-hook delivery remain untested; six role roots stay over their cold-start ceilings ([D011](../../evidence/WO-255/decisions.md#wo-255-d011), [D030](../../evidence/WO-255/decisions.md#wo-255-d030), boarded, and the meter names the cold start a reopen candidate); the whole-change recheck's cost against the old rule is measured over the next two orders (FUP-dec74be4077f5f25).

Release: minor, v0.118.0; `@dotln/compiler` 0.41.0, `@dotln/skeleton` 0.85.0 and the harness host 0.45.0, with the console's workspace pins moved; no dependency added. Evidence: [the order](../../work-orders/WO-255-reviews-find-what-the-complete-run-finds.md), [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-255/decisions.md), the executor's [handoff](../../evidence/WO-255/handoff.md) and the [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-06T01:02:06.691Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-255/executor | 8 h 9 min | 401,096,534 | unknown | 1,124 | 1,406 | 0 | 0 |
| WO-255/verifier | 0 h 54 min | 33,665,958 | unknown | 88 | 101 | 0 | 0 |
| WO-255/reviewer | 0 h 0 min | 218,321 | unknown | 128 | 129 | 0 | 0 |
| WO-255/release-close | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-255/planner | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-255/refuter | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-255/router | unknown | unknown | unknown | unknown | unknown | 0 | 0 |

Against WO-246, the previous closed order: wall clock 2 h 17 min more.

Against WO-246, the previous closed order: tokens 269,387,001 more.

Against WO-246, the previous closed order: commands 644 more.

Against WO-246, the previous closed order: steps 603 more.

Against WO-246, the previous closed order: bound stops unchanged (0 difference).

Against WO-246, the previous closed order: bound acceptances unchanged (0 difference).

<!-- dotln-process-meter:end -->
