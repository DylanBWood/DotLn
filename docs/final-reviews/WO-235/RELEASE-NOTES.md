## Release overview

Every document a DotLn session writes now starts from its contract and its reader instead of the previous instance of its kind, and usefulness is judged by what that reader can understand, answer, decide, do, verify or recover from it, never by size. Writing guidance opens with the contract, a planning pass starts from a skeleton of product 07's headings, document evidence binds the exact set of records it judged, and operators have a `quality pass:` command with a named target for bounded document maintenance in the current session. This matters to operators and forks that have watched pull-request bodies, planning documents and orders drift toward whatever the last one looked like.

## Read before upgrading

- `npm run plan -- start` now creates the pass's planning document under `docs/planning/`, named by the slug and date, with nine section headings and refuses to start when that file already exists; move or remove a stale document of that name first.
- `npm run reader -- profile`, `worktree publish` and `release prepare` no longer print a `Nearest example:` line. Anything that read it must read the new `Contract:` and `Document kind` lines instead; the examples under `docs/publication/examples/` remain illustrations, not templates.
- `docs/control/budgets.json` now allows the executor 20 complete runs per phase instead of 3 and accepts raised cold-start ceilings for the executor, verifier and release-close roots; forks that carry their own budgets keep their own values.
- A document-gate row is consumed only for the exact candidate tree. Editing any report, decision or generated index after `npm run test:docs` requires a fresh run before completion; the role text and product 07 say so.
- Skeleton `0.73.0` and harness host `0.39.0` regenerate the installed hooks, manifest, runtime pins and both role trees; a fork re-emits its harness after taking the release.

## Substantive changes

**Writing guidance and publication.** Guidance for the PR title, PR body, commit subject, release notes and Release page opens with the product sections that state the surface's rules and the functions that judge or render a draft, then names the document kind and reader, then asks for useful, complete information. It selects no example and ranks nothing by length; a malformed optional example appends a diagnostic rather than erasing the guidance, while the explicit `profile` and `preview` commands stay strict. The examples guide and product 08 describe the contract line.

**Planning.** `plan start` writes the pass's planning document from the nine headings product 07 lists, prepared before the branch switch and removed only when that invocation's branch creation fails. The planned byte-minimum comparison and its shorten advisories were never shipped: the operator rejected size as a quality goal.

**Lifecycle evidence.** Completion consumes a passing `npm run test:docs` row only when its tree hash equals the candidate's, reports, decisions and generated indexes included; a changed, relocated or newly introduced record refuses the old row, an ignored local file does not. Product identity keeps its existing boundary, and configured record roots cannot exempt source from it.

**Session commands.** `quality pass:` with a target asks the current session to improve a file, a file list, a folder, a described set or a passage: it resolves and announces the scope, asks only about material ambiguity, preserves useful information, settled structure and sound passages, corrects generated documents through their sources, runs the existing checks, reports what changed or needed no change, and continues the original task. The guidance is in every generated role; in Claude Code the prompt hook also supplies it when the prompt's own first content line opens with the command, so a prose mention, a task notification or another agent's report never invokes it, and an active `analysis:` control takes precedence. The command adds no lifecycle event, gate or refusal; decision dispatches may carry the prefix and the meter counts it as a direction.

**Observed facts.** The hedged-quantity scanner no longer reads a dotted version number such as 2.1.312 as a quantity; a decimal such as 2.5 minutes is still reported.

**Generated roles.** Every role carries the artifact-shape rule (derive shape from the contract and the judging check; a previous instance is evidence, never the pattern), the usefulness rule, the standing-document rule (integrate each change into a coherent passage, no sentence-count target) and the expected-data provenance rule. The verifier, executor and reviewer steps state the exact-tree document row.

**Withdrawn.** The order's operator-message design, a direction ledger with refusals at completion, planning receipt and Stop, later a private reply reminder with a prompt router, was removed at the operator's direction after four failed verifications. `main`'s prompt router, journal sources, intervention count, completions, planning receipt and Stop ship unchanged; the router's known Claude Code 2.1.312 attribution gap for a queue entry without a command mode returns to planning.

## Progressive polish

- Three fixtures were stabilized without changing what they prove: the exported-instance recovery case resolves the README conflict its stash application can meet, the target-worktree close fixture lets its fake Git drain piped output before the size is judged, and the target-briefing comparator normalizes volatile write counters.
- The verifier, executor and reviewer role steps and the handoff briefing say "the document row for the exact candidate tree" in one wording.

## Evidence and compatibility

The complete `npm test -- --review` row at code identity `3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362` passed at 2026-10-30T05:00:11.640Z after 0 h 31 min with all 45 selected checks; the final `npm run test:docs` row for the reviewed tree is consumed at completion. VER-005 judged all eleven criteria met with eight independent probe groups after VER-001 to VER-004 failed on the withdrawn design, and FINAL-001 reran the probe, the role oracle, base-parity and removal checks, the publication, format, harness and surface checks. Versions: `v0.103.0` (minor), skeleton `0.73.0`, harness host `0.39.0`, compiler unchanged at `0.33.0`; no external dependency changes; the authority evidence edition is re-minted at revision 017, and seven chained role oracles record each root's bytes before and after every change. Known limitations: structural evidence proves delivery and non-interference of the quality-pass guidance, not the quality of an edit it produces; the router's attribution gap is unchanged; role roots remain above their original ceilings under dated acceptances recorded in `docs/control/budgets.json`; one follow-up is boarded, a stale evidence-source declaration of `scripts/lib/off-ramps.mjs` that the withdrawn ledger needed (WO-235-D065).
