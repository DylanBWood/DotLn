## Release overview

A work order that adds a capability row no longer needs a planning rescue after its final review. The planning gate now treats an appended dated capability addition or reassessment for a sequenced order as an execution update, new ids included, and leaves the level claim to verification, final review and the next planning receipt. The same patch makes both public gates read the typed dependency blocks against the committed sequence, refusing a reversed hard edge or a lane pair that cannot run independently, and gives DotLn a third hook refusal: on a `planning/` branch the generated Claude hooks refuse a classified tool write to a repository path outside `docs/` and root Markdown.

The audience is the operator running two lanes and the planner filing orders: the two purpose-built planning passes paid on 2026-09-16 and 2026-09-17 were the cost this removes, and the two dependency reversals a receipt had judged aligned are the class the topology check now catches at check time instead of at close time.

## Read before upgrading

Application patch `v0.29.4` stages compiler `0.13.1` and skeleton `0.25.3`. Kernel and console versions, event schemas, public contracts, receipt subjects and dependency sets are unchanged; `package-lock.json` moves only the three workspace version strings. The order first staged `v0.29.3` and skeleton `0.25.2`; the sibling WO-053 published both, so final review retimed under the same patch classification.

DotLn's hooks now refuse three conditions instead of two. The new one applies only on a branch whose name starts with `planning/`, which `plan start` creates: a `Write`, `Edit` or `NotebookEdit` to a repository path outside `docs/` and root Markdown, or a shell redirect, `touch`, `mkdir`, `tee` or `rm` whose classified target resolves there, is refused with the path and the `operator override:` route named. A path outside the repository root stays admitted, as do `docs/`, root Markdown and any opaque program the classifier cannot read. This is a classified-effect boundary, not an operating-system sandbox; Codex carries the same rule as role text without a hook. `operator override:` admits authorized recovery for the session and `operator override: off` restores the refusal.

`npm run plan -- check` and `npm run work-orders -- index --check` now fail on a sequence in which an order precedes an order it depends on through an unmet `hard`, `satisfied-by-close`, `satisfied-by-release` or `planning-deferral` edge, or in which a two-entry pair contains such an edge, naming the orders and the edge. A sequence that was accepted before this release may be refused after it; the committed sequence passes.

The compiled instruction sentence in `CLAUDE.md`, `AGENTS.md` and every role skill changes to name three refusals; `harness check` reports the regenerated surfaces current. No account setting, launch default, permission rule or remote effect changes. The personal SSH/SCP/SFTP command rules the security runbook now describes were installed by the operator outside the repository during this order and are not repository artifacts.

Known condition on `main` at this release: the document gate's `plan` limb is red because WO-053's merged order file changed a criterion no planning receipt judged. The final review isolates it to that sibling's bytes on a clean clone of `main`, names the enforcing line, and records that it blocks neither publication nor close; clearing it is a planning decision.

## Substantive changes

- Planning gate, capability write-backs: `reassessments` admits `## WO-NNN dated addition (date)` beside the existing reassessment heading for any order in the judged sequence, classifies a row with an unknown id as `dated-capability-addition`, and keeps every other rule on the appended region unchanged. The exact legacy release-header spelling `patch, evidence-only. A` is admitted as a `release-classification-format` update without rewriting the receipt.
- Planning gate and work-order index, sequence topology: `parseSequenceGroups` keeps the blank-separated lane groups, and `checkSequenceTopology` runs first inside both public gates over the typed blocking projection the index already derives; groups of three or more entries are checked for order only.
- Harness host, planning-branch refusal: `planningWriteRefusal` classifies known tool destinations on `planning/` branches through the physical path resolver; `shellWriteTargets` carries per-path follow semantics so `rm` and `touch -h` act on the directory entry while writes follow the final link.
- Compiled instruction and role text: the three-refusal sentence with the override route is compiled into both harnesses' instruction surfaces and all twelve role skills.

## Progressive polish

Product 07 gains the admission, topology and planning-branch sentences and the release-header paragraph; §Discipline and the README describe three refusals; the security runbook's hook-boundary section is retitled for WO-132 and WO-135, and the runbook's current-mode section, settings table and sandboxed references are rewritten under the operator's expanded scope with historical measurements preserved. The planning map carries execution dispositions under candidate 1 and register item 10; the decisions record carries D001–D007 with the decisions index and follow-up register refreshed; the regenerated bundle pins, console fixtures and fresh WO-135 authority and feedback editions follow the merged runtime.

## Evidence and compatibility

Source: branch `wo-135` integrated onto `main` at `f7ec9f3e`, the commit that carries the published `v0.29.3` tag; the pre-merge state VER-001 judged is preserved at `refs/dotln/integration/WO-135/pre-merge`, and the reviewed commit series is on the pull request. Component versions: application `v0.29.4`, compiler `0.13.1`, skeleton `0.25.3`, kernel and console unchanged. No migration is required.

Verification: [VER-001](../../verifications/WO-135/VER-001.md) passed all six acceptance criteria on the pre-merge tree with its own `npm test` 19 of 19 and `npm run test:docs` 17 of 17, reproducing criteria 1 to 3 by direct probes against the real receipts and sequence revisions and criterion 4 by a full 49-of-49 harness suite run; [FINAL-001](FINAL-001.md) re-derived the topology, receipt-integrity, lockfile, hook-diff, suppression and clean-room claims on the integrated tree, re-recorded the two invalidated evidence editions, and re-ran the review gate — 29 suites passed, 0 failed, 1063.57 s, exit 0, recorded `2026-09-18T01:31:45.851Z` for tree `e1df1a9a` at code identity `34cc85aa`. The document gate on the integrated tree passes 15 of 17 limbs, with `plan` and `plan-refutation-current` red on the sibling's condition above.

Known limitations: the planning-branch rule classifies known tool destinations and is keyed on the branch prefix, so an opaque program, an interpreter, or a detached HEAD during a planning pass is outside it; the topology check reads the committed sequence and the typed blocks, not a scheduler; the fresh feedback edition's verifier actor is a launch claim with unknown effective readback, and the audit was launched by the reviewing session rather than the operator, which the final review discloses with its reopening condition; the `execpolicy` observations in the runbook are the executor's recorded checks, not reproduced at review.

Deeper notes: [WO-135 evidence README](../../evidence/WO-135/README.md), [decisions](../../evidence/WO-135/decisions.md), [the order](../../work-orders/WO-135-capability-id-admission.md).
