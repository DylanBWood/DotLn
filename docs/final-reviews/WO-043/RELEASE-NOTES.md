## Release overview

Work orders now declare typed dependency relations, and one projection drives the generated index, the selected lifecycle JSON status and activation. A closed order's historical citation no longer reads as a blocker, and activation refuses only an unmet hard dependency, an unsatisfied release or closure requirement, or a planning deferral. The same patch makes session token measurement mandatory for both harnesses, equips Process Cost and Goal Alignment across every Contributor role, and adds the first-party `scope expand:` and `conversation only:` session commands.

## Read before upgrading

`resume activate` refuses an order whose typed block has an unmet entry; the refusal names the entry and the corrective action and appends no event. Every open work order carries a marked JSON block in its leading metadata; the prose `Depends on` paragraph stays for readers. Closed and historical orders are untouched and keep a labeled conservative token view that never blocks. `status --json` gains an additive `dependencies` field, `null` without a selection; existing consumers still parse it.

The four lifecycle completion commands measure the current session's token counters before appending; a missing, stale or foreign-session measurement refuses the handoff, while the Claude Stop hook only advises. `implementation-ready` and `repair-complete` also refuse while an adjacent queue item is queued or running.

The current evidence editions are selected in `docs/evidence/current.json`; the four evidence commands and the console read that manifest instead of per-script literals, and explicit `--edition` and `--revision` options still select a historical edition. Compiler `0.9.1`, skeleton `0.15.1` and console `0.1.4`; the kernel, lifecycle event schemas and the feedback schema are unchanged; no new dependency.

## Substantive changes

**Typed dependency truth.** `scripts/lib/dependencies.mjs` parses the marked block with eight relations (`hard`, `satisfied-by-release`, `satisfied-by-close`, `historical-evidence`, `reference-only`, `waived`, `superseded`, `planning-deferral`) and refuses unknown relations, missing reasons, duplicate or self references, hard or satisfied relations on the historical WO-001 and WO-002, and malformed arrays, naming the path and the offending entry. Release entries are met by a local annotated DotLn release tag in HEAD's ancestry; closure entries require a passing final review; a planning deferral waits for its named order's closure or a dated waiver. The index renders each entry's relation and state, uses "blocked" for no closed or historical order, and `index --check` refuses a stale render. All 85 open orders were migrated from the 2026-09-08 critical-path graph with a recorded comparison, and the planning-continuation gate admits only that reviewed transcription.

**Mandatory session token measurement.** One collector serves `harness usage`, the Claude Stop hook, `meta --collect` and the completion commands. It matches the current session by hashed identity and physical worktree, counts each source's cached tokens by its own semantics, de-duplicates Claude message IDs, and records numeric totals with source, time and scope. Append-only reconciliation replaces overlapping or partial observations from their source counters, and the meter projects the replacement once.

**Shared supports and session commands.** Process Cost and Goal Alignment are compiled once and projected into all six roles in both harnesses through an additive explicit role-set adapter; removing one leaves the other, the locked floor and host measurement intact. Every generated role target carries the `scope expand:` and `conversation only:` contract. Ordinary `next` and `fix` print the equipped executor supports and the current queue at entry.

**Current-evidence selection.** `docs/evidence/current.json` selects the authority, artifact-identity, verification and feedback editions for the gate, the evidence commands and the console; historical fixtures keep their explicit pins and hashes, and a console recording command pins replacement feedback evidence explicitly.

## Progressive polish

The generated release-close wording is compacted within its existing context ceiling with no dropped duty. The locally observed Claude CLI `2.1.268` joins the restricted transport profile. Products 05, 06 and 07, the planning map, the lane rules, the playbook, the publication rows and both edition locks carry the new semantics, and the index's Sources and limits text describes the typed projection.

## Evidence and compatibility

Independent [VER-003](https://github.com/DylanBWood/DotLn/blob/main/docs/verifications/WO-043/VER-003.md) passed all seven acceptance criteria and the expanded obligations after two repairs, reproducing every recorded token figure from its source counters. [FINAL-001](https://github.com/DylanBWood/DotLn/blob/main/docs/final-reviews/WO-043/FINAL-001.md) records the review, the current evidence and the non-blocking observations. Application target `v0.17.1` (patch) above the local `v0.17.0`; compiler `0.9.1`, skeleton `0.15.1`, console `0.1.4`, kernel `0.2.1`. Known limits: Codex dispatch windows are entry-bounded while Claude windows start at the first message; the verifier meter row includes the operator-authorized live feedback audit worker's usage; VER-001 and VER-002 differ from their completion checkpoints under the operator's disclosed authorization, with unchanged verdicts.
