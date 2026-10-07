## Release overview

This release makes the handoff at the end of each role one ordered sequence, and the gate enforces its first step. Formatting can no longer cost a product gate, and a review gate no longer reruns work a passing row already covers. The visible changes:
- `npm test` and `npm test -- --review` run Prettier first. On a formatting failure they stop in seconds, name the files and print the repair command.
- `npm test -- --review` at a code identity whose tasks already passed reuses those results. In this order that took the review gate from 1,815 s fresh to 7 s.
- The executor, verifier and reviewer skills open with numbered steps that end in format, the document gate, the product gate, the records and the completion command.
- The executor's adversary and improver run once, before `implementation-ready`. Verification and final review spawn a worker only to reproduce a named claim.

The release is for operators and agents who run DotLn's delivery roles in a DotLn repository.

## Read before upgrading

- **Byte ceilings advise, they do not fail.** A product document over its ceiling in `docs/control/doc-ceilings.json` now prints one `ADVISORY` line that names the file and the bytes over and ends `planning resets ceilings`, and `npm run test:docs` exits 0. A missing or malformed ceiling entry still fails. The rule that a raised ceiling needs a planning anchor is removed, and an `advisoryDecision` field is no longer read.
- **Review rows can be composed.** A review row may record `executionMode: "composed"` with tasks carried from an earlier row at the same code identity. It keeps `gateSelection: "review"` and its `requiredSuites`, so `final-review-result`, `worktree publish` and release close accept it as before. Use `npm test -- --review --again` to force every task fresh. Format always runs fresh.
- **Formatting runs first in every full selection.** Format now runs alone before the build in the plain, review and document gates. A failure finishes every other task as unexecuted, each repeating Prettier's output and the repair line. `--only` and `--machinery` do not run it.
- **Passing tasks can print.** A passing task's lines that begin with `ADVISORY` or `NEWER` now reach the gate's terminal output, within the existing output tail. The recorded gate row is unchanged.
- **Role text moved.** The five-refusals paragraph is gone from every generated skill and stays in `CLAUDE.md`. A harness that loads a skill without the project instructions would no longer see it. The executor, verifier and reviewer roots shrink: 29,777 → 28,128, 26,077 → 25,380 and 27,882 → 26,831 bytes, each under its unchanged ceiling.
- **Worker duties changed.** The executor spawns two fresh `dotln-worker` agents, an adversary and an improver, before `implementation-ready` and not before `repair-complete`. The self-review advisory fires at `implementation-ready` only. The verifier no longer spawns its own adversary.
- **Component versions.** Application v0.69.0 is a minor release over v0.68.0. The compiler moves 0.25.3 → 0.25.4, the skeleton 0.54.0 → 0.55.0 and the harness host 0.34.5 → 0.35.0. The console pins the compiler and skeleton exactly. No dependency is added.

## Substantive changes

**The format preflight.** The `format` row runs `npm run format:check` alone, before the build and before any carried result, in every plain and review selection. Its failure finishes every other task unexecuted with Prettier's output and `Run npm run format, then rerun this command.`, so a gate with an unformatted file ends in under a second instead of after the full selection. Format is never carried from an earlier row, because a configured formatter can read files the code identity excludes.

**Review composition.** `npm test -- --review` composes the latest passing task results at the current code identity, the rule plain gates have followed since WO-186. A task whose latest execution at that identity failed runs fresh, so an older pass never masks a newer failure. Every composition runs through the one scheduler and row builder. `freshReason` reads `always-fresh-preflight` when format was the only fresh task, `missing-passing-tasks` when another task ran, and `requested` under `--again`.

**Numbered role procedures.** The executor, verifier and reviewer skills open with numbered steps in execution order, and every earlier rule sentence follows under `Rules:`. Three kinds of sentence change. The executor's and verifier's worker sentences, with the reviewer's new route sentence, agree with product 07 §Verification review and attack. The Tinkerer support now asks for a comparison only when the work shows two credible ways that differ on a named axis. Goal Alignment names only the traps that would change what the role does. The executor briefing projects a work order's `**Experiment:**` header in place of the former 900-second economy line.

**Spawn advisory.** A spawn tool call while a gate run is live is admitted with one advisory naming the run's id and kind, which says that probes under `node`, `npm` and `harness bounded` will be refused until it ends. With no live gate there is no advisory.

**Ceiling advisory at the gate.** `docs-check` reports an over-ceiling product document as an advisory and exits 0, and the document gate now shows that line.

## Progressive polish

The runner and docs-check fixtures run the real gate as a child process. They cover the format preflight with the repository's real Prettier setup, composition with the format row in the table, latest-failure precedence, and the ceiling advisory at default and relocated document roots. A procedure fixture asserts the numbered order of every handoff step. A new role snapshot, linked to WO-187's, keeps the historical role hashes. PLAYBOOK's gate contract names the composed review row and the handoff sequence. The authority, artifact-identity and verification evidence editions are re-minted, the console's self-hosted fixture follows them, and the harness bundle, role roots and publication locks are regenerated.

## Evidence and compatibility

Application `v0.69.0` is a minor release over `v0.68.0`, built from WO-196 on `main` at `ae782ef9`. The compiler moves 0.25.3 → 0.25.4, the skeleton 0.54.0 → 0.55.0 and the harness host 0.34.5 → 0.35.0. Kernel, beacons and browser-evidence sources are unchanged. The console's exact pins and its regenerated self-hosted fixture move. No dependency is added.

The verification sequence:
- [VER-001](../../verifications/WO-196/VER-001.md) failed criterion 8: `docs-check` printed the ceiling advisory, but the document gate dropped a passing task's output.
- [VER-002](../../verifications/WO-196/VER-002.md) passed all nine criteria, with one unused import boarded.
- [FINAL-001](FINAL-001.md) passed, removed that import and found nothing further.

A fresh `npm test -- --review` at the reviewed subject passed 38 of 38 suites with 88 fresh tasks in 1,797.84 s, and `npm run test:docs` passes 29 of 29. VER-002's composed review at the previous identity took 7.07 s, against 1,815.45 s for the executor's fresh run there.

Known limitations:
- The composed review row is keyed to the code identity alone until WO-198 records shared refs. A task that read a shared ref moved by a sibling merge could be reused.
- Whether one adversary and one improver at implementation hold the escape rate needs the final reviews of later orders.
- With the formatter absent, the preflight fails and every task prints a repair line that cannot help.
- The spawn advisory is covered by a fixture. No live spawn during a gate was made, because the procedure forbids it.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-196/decisions.md) and the [handoff](../../evidence/WO-196/handoff.md).
