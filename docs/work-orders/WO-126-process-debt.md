# WO-126 — Process debt: the lifecycle machinery costs more than the code it guards; one order demotes the theater, automates the closeout, and installs the meter (version assigned at activation)

**Model:** Claude Fable 5.1 at max, or Codex gpt-6-astra at max, for every
role; the measured gate runs on the operator's machine. State the model and
effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor max+; verifier xhigh+; reviewer any.
**Release classification:** minor. The feedback units change version and
enforcement rung, the tag manifest's evidence contract changes, the compiled
Contributor bundle and both profiles' skills regenerate, and two lifecycle
commands are added. No kernel or verification-contract change. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the operator's 2026-09-09 emergency planning
dispatch after the `v0.16.0` close, enumerating eleven failures of the
process machinery observed during WO-042's final review and release close,
and directing one order at the front of the line irrespective of the
one-seam rule. Planner-synthesized draft; the dispatch and its two mid-turn
messages are preserved verbatim in the pass's ignored capture. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-042 merged (the harness bundle this order edits; satisfied
at `v0.16.0`).
**Recommended placement:** first, alone, before any order in the 2026-09-08
horizon activates; the operator's explicit direction. It edits the compiler
feedback units, the skeleton harness host, the lifecycle scripts, the
closeout helpers, the discovery record, the planning map's structure, and the
four product documents named below. A recommendation, not a dependency token.

**Operator exemption (2026-09-09):** this order holds more than one
capability boundary and will exceed the four-hour implementation span. The
operator exempted it from the one-seam and split rules of the critical-path
plan for a stated reason: the debt is one system, the cost model of the
lifecycle machinery, and each additional order would pay that cost model
several more times before the fix landed. The exemption is this order's own;
it sets no precedent and the rules stand for every other order.

**Cites (read these sections):** 07-execution-guide.md §Discipline (no
ratchet creep; a question is not a waiver; process budget), §Workflow
closeout and releases, §Operator-opened planning pass; 02-domain-model.md
§Feedback compiler v1; 03-architecture.md §Corpus policy;
08-publication-compiler.md §PRs and commits; `docs/planning/refutations/README.md`;
`docs/evidence/WO-039/repair.md` (item 3, satisfiable output review);
`docs/evidence/WO-039/README.md` (the session-entry base sentence);
`docs/work-orders/WO-036-evidence-runner.md` (the 2026-09-06 chain timing);
`docs/final-reviews/WO-042/FINAL-001.md` (the attestation paragraph);
`packages/compiler/src/feedback.ts` (the predicates); `packages/compiler/src/harness.ts`
(`hookFor`, the residue branch, the skill-line emitter);
`packages/skeleton/src/harness-host.ts` (`harnessOutputs`, `runHarnessEvidence`,
`metadataCommand`, `managedReleaseCommand`, the Stop re-entry branch);
`packages/skeleton/src/loadouts/feedback.ts` (the ten units);
`scripts/resume.mjs` (the effort gate); `scripts/lib/paths.mjs`
(`classifyIgnoredMaterial`); `scripts/worktree.mjs` (`finish`);
`scripts/release.mjs` (`evidenceCommands`, `ensureNoIgnoredInfluence`,
`runEvidence`); `scripts/lib/control-usage.mjs`; `scripts/harness-context.mjs`;
`scripts/work-orders.mjs`; `scripts/refute-plan.mjs`; `docs/discovery/environment.json`;
`.gitignore`; `package.json`.

**Objective:** Make every gate cheaper than the failure it prevents, and prove
it with the repository's own records. Hard enforcement lives in the lifecycle
commands, which already check evidence; Stop-time hooks advise and never
block. A read obligation covers what the session wrote or regenerated, not
what it inherited, and a generated artifact is a check obligation, not a byte
read. A full gate runs once per tree hash and its evidence is reused by hash
at every later step, including the tag. Closeout needs no hand-written
script. Attestation does not degrade because a CLI patch version bumped. The
anti-oscillation unit says what the operator means. And a meter reads the
control log, the context measurements, the manifest and the sizes every
order, prints the delta into every PR body and the status line, and fails the
fast gate on a budget breach that carries no dated operator acceptance.

**Observed gap (dated 2026-09-09, `main` at `0d09ee3`):**

- **Wall-clock.** From the per-order control segments: WO-042 ran 4h05m
  implementation, 9h36m for a failing first verification, 38m repair, 44m
  second verification, 59m final review, 16h37m from activation to the
  final-review pass; WO-039 ran 21h32m with five verifications and five
  repairs; WO-041 ran 15h22m. The critical-path plan named four to twelve
  hours per order as the problem and answered with a split rule. The cost
  is in the machinery, not the code.
- **Output obligation.** `harnessOutputs` (`harness-host.ts:801-821`) makes
  every added or modified file since the session's starting revision, plus
  every untracked file, a byte-read obligation, with no authorship filter,
  no generated-artifact exclusion and no size cap. Under the
  no-commits-before-final-review rule the reviewer's starting revision
  predates the whole order, so WO-042's reviewer owed 135 files and
  5,305,410 bytes after it had already reviewed the diff; two
  `selfhost-verification.jsonl` editions were 1.46 MB of mostly identical
  embedded snapshots (`docs/evidence/WO-042/feedback-002/` alone is
  733,302 bytes). WO-039's first repair receipt recorded that session-only
  authorship was considered and not adopted; the operator supersedes that
  decision in this dispatch.
- **Stop-time gates.** `verify-app-before-done` requires `npm test` and
  `git diff --check` recorded at the current subject hash at every turn end
  (`harness-host.ts:1136-1147`); `no-partial-completion` requires the
  lifecycle event to be appended before the turn may end; `finish` re-runs
  all three. A session cannot end a turn to ask the operator a question
  without first running the whole suite and recording a transition. The
  re-entry branch (`:1454-1461`) allows the second attempt, so the gate
  produced status noise rather than evidence: the WO-042 reviewer
  re-announced the same three facts for several turns.
- **The suite.** `package.json` `test` is a 37-step serial `&&` chain
  (23 steps and 6 to 10 minutes when WO-036 measured it on 2026-09-06),
  wrapped by the harness evidence runner in a 900 s `spawnSync` ceiling
  (`harness-host.ts:958`) that records `executed:false` on timeout with no
  suite named. `checks.json` records no durations. WO-036, the order meant
  to fix this, floats in a free lane with no numeric target.
- **The gate locks out its own session.** `npm test` runs
  `rm -rf packages/*/dist && tsc -b --force`, and every installed hook
  imports `packages/skeleton/dist/src/harness-host.js` and verifies pinned
  bytes on each invocation, so for the whole rebuild every Bash, Edit and
  Write call is refused with "host facts or pinned runtime unavailable"
  (observed 2026-09-09 by this pass while its own suite ran in the
  background).
- **Tag-time evidence.** `release.mjs:70-75` pins the literal
  `["npm ci","npm test", …]` into every manifest and `validateEvidence`
  refuses anything else, so every step any order appends to `npm test`,
  including `test-plan-refutation.mjs` and the mutation self-test, runs
  again on `main` at tag time although the fast-forwarded tree already
  passed it at final review. Nothing keys evidence by tree hash.
- **Closeout.** `classifyIgnoredMaterial` (`scripts/lib/paths.mjs:58-71`)
  knows intake, build outputs, `.control-beacons/`, `.DS_Store`,
  `.tsbuildinfo` and `.claude/settings.local.json`. It does not know
  `docs/control/local/`, which `.gitignore:16` still describes as never read
  by scripts while `harness-host.ts:152` writes every session's state there
  and `scripts/lib/terms.mjs:13` reads the operator's private
  `docs/control/local/terms.txt` from it. The harness therefore
  manufactures the material that makes `worktree finish` and `release close`
  refuse, `npm run backup:intake` only zips the caller's checkout, intake
  reconciliation into main has no helper (07 §Operator-opened ideation mode
  admits it), and the WO-042 close hand-wrote `preserve.mjs` to move
  records, back up intake, publish and restore the terms file. The skill
  orders "preserve any other non-disposable ignored material" with no
  tooling behind the order.
- **Attestation.** `resume.mjs:371-388` accepts `--effort` only for a
  harness version listed as observed in `docs/discovery/environment.json`
  (`2.1.259`, `2.1.260`, `2.1.261`, `2.1.263`); no script appends a row; the
  WO-042 reviewer on `2.1.265` recorded `effort unknown` and
  `Effort drift: max -> unknown` although its environment exposed
  `CLAUDE_EFFORT=max`, and the hook journal records `input.effort.level` on
  every event (`harness-host.ts:242-264`) without feeding it to `parseActor`.
  A `reviewer max+` line would have made the review unrecordable.
- **Attribution.** The harness's session guidance proposes a
  `Claude-Session:` trailer; `hasAiAttribution` (`feedback.ts:313-325`)
  matches coauthor trailers and generated-with footers, not session links;
  the unit declares an invocation-settings half
  (`loadouts/feedback.ts:157-160`) that `.claude/settings.json` does not
  contain; `worktree publish` does not screen the PR body for it.
- **Anti-oscillation.** Prose-only (`hookFor` has no `decision-lineage`
  entry, `harness.ts:139-147`), its regression fixture is a name with no
  test found, and its text describes decision lineage rather than the
  operator's meaning: a correction points at a category, and the two
  failure modes are sweeping generalization beyond it and over-literal
  shrinking below it. The four prose-only
  units and the clean-room line appear as seventeen `unavailable facts.*`
  residue lines (1,432 bytes) in the locked floor every session reads, and
  no session acts on them.
- **Context.** The planner's only whole-file required read is the map at
  184,668 bytes; the generated index is 132,989 bytes and enters cost through
  the output obligation; the ledger is 614,845 bytes; the executor skill grew
  from 5,073 to 7,254 bytes between the WO-039 and WO-042 editions (+43 %)
  while `harness-context --check` compared each edition only to its frozen
  2026-09-08 base and reported `lower: true`.
- **Ledger.** All three lifecycle loadouts direct "append changed ideas
  to the ledger", 123 of 124 order files name a ledger entry as write-back,
  and repairs record adopted and rejected alternatives there because the
  anti-oscillation unit names the ledger as its source; 95 of the ledger's
  122 sections are work-order tagged and the file is 614,845 bytes that
  nothing reads except a search. The operator's ideation is a minority of
  its own ledger.
- **Meta-awareness.** `resume usage` folds timing per actor and order and
  deliberately collects nothing else; no mechanism compares phase durations,
  read bytes, gate seconds, sizes, unit or hook counts across orders; the
  map records the artifact-growth assessment as an unallocated candidate
  with no number. Merged PR subject lengths in characters, oldest first:
  71, 38, 77, 50, 56, 67, 90, 79, 100, 135, 139, 108, 155, 150, 197, 240,
  129, 202, 233, 250, 252, 259, 173, 351, 349, 406, 687, 113, 127, 157,
  136, 137, 191, 163, 167, 210, 89, 178, 86, 184. Four ramps, four operator
  resets, a written rule after the second, and no check.
- **Planning branch.** The planning-pass contract requires a planning branch
  before the first write and the writer guard's metadata allowlist
  (`harness-host.ts:976-999`) has no branch-creation command, so this pass
  could not create its branch through the Bash tool and used the Monitor
  tool, which the guard does not classify (the 2026-09-08 nomination "fail
  closed on unclassified effectful tools"). The permission classifier also
  refuses read-only commands whose text contains a remote-effect or
  environment-file token inside a heredoc or search pattern (the 2026-09-08
  nomination "matches commands, not substrings").

**Design (scope discipline):**

- **Three rules, each with a mechanism.** (1) Hard enforcement lives in
  `resume -- implementation-ready | repair-complete | verification-result |
  final-review-result`, `worktree publish` and `release close`; hooks that
  prevent irreversible damage stay hard at PreToolUse (writer isolation,
  attribution at commit, the permissions envelope); every Stop-time unit
  becomes advisory. (2) A gate runs once per tree hash; evidence carries the
  tree hash and duration and is reused by hash. (3) Growth needs a decision:
  `docs/control/budgets.json` holds the operator's numbers and dated
  acceptances; the meter compares each order to the previous one and to the
  budget; a breach without an acceptance fails the fast gate.
- **Read obligations are authorship-observed.** The PostToolUse observer
  snapshots the tree's changed-path set before and after each `Edit`,
  `Write` and `Bash` call for this session and accumulates the paths whose
  bytes changed; that set, minus paths carrying the `dotln-generated`
  gitattribute and minus files above `budgets.json`'s read cap, is the
  output obligation. A generated or oversized output owes a check: its
  generator's `--check` (or the recorded evidence run) green at the current
  bytes. Inherited uncommitted changes owe nothing. The witness remains
  delivery, not comprehension.
- **Two gates.** `npm test` is the fast gate: format check, one build,
  the package `node:test` suites, `harness check`, the index and
  publication golden checks. `npm run test:full` is the fast gate plus the
  shell lifecycle suites, the plan-refutation suite, the evidence `--check`s
  and the mutation self-test, run through WO-036's runner concurrently under
  a CPU-derived bound with per-suite timing and a summary. The lifecycle
  transitions require `test:full` green at the tree hash; iteration and
  turn ends use the fast gate; `release close` reuses the final review's
  recorded `test:full` evidence when `HEAD`'s tree hash equals the reviewed
  tree hash and records the reuse in the manifest, otherwise runs it.
- **Closeout owns its own material.** `classifyIgnoredMaterial` learns
  `docs/control/local/`: `docs/control/local/harness/**` is disposable
  session state at subject teardown and release-evidence-allowed in main;
  every other file under `docs/control/local/` is non-disposable and
  release-evidence-allowed in main. `release close` reconciles the subject's
  `docs/intake/**` into main's intake before teardown: same relative path,
  byte-verified copy, a collision with different bytes keeps both with a
  `.from-WO-NNN` suffix, nothing deleted, a printed receipt, `--dry-run`
  prints the plan. The skill says: if the helper refuses, report the
  refusal; never write a closeout script.
- **Attestation by version line.** The discovery record gains, per harness,
  an observed version line with the newest observed patch; `resume` accepts
  the declared effort selector for any patch on an observed line, records
  the actual version, and warns at session start when the running version
  leaves the line. `npm run discover -- harness` runs the bounded probe for
  the running harness and appends the observed row, including whether the
  `CLAUDE_EFFORT` readback channel exists, so `--source harness-readback`
  becomes possible when the variable matches the launch claim. WO-042's
  `unknown` row is immutable.
- **Units say what they enforce.** Prose-only units carry mechanism kind
  `prose` at version 2 and emit no residue line; the anti-oscillation prose
  is rewritten to the operator's definition; the Stop units carry
  enforcement `advisory` at version 2; every version-1 definition is
  retained for replay per its retirement condition. `CLAUDE.md`'s residue
  block becomes one line naming the manifest.
- **The planner reads a sequence, not a history.** The marked sequence
  block and a preamble of at most forty lines move to
  `docs/planning/sequence.md`, the planner's required read; the map's dated
  rationale older than the two newest revisions moves byte-identical to
  `docs/planning/archive/work-order-map-2026-09-09.md` with links; the index
  generator and the refutation subject reader take the sequence from the
  new file.
- **Declined alternatives, recorded:** removing the harness and returning to
  the prose rules (the compiled build measurably cut the executor cold start
  from 71,165 to 10,960 bytes and its pre-effect guards caught real defects;
  reversal condition in the map's NoOp record); a third-party test
  orchestrator (WO-036's own rejection stands); leaving tokens and cost
  unrecorded (the playbook's "no token, cost, or attention data is
  collected" was a prior session's note, not an operator decision; the
  operator requires them recorded per dispatch); a nomination
  for anything this order observed (the operator's 2026-09-09 direction:
  no known issue stays a nomination).

**Deliverables:** the compiler and skeleton changes; the two new lifecycle
commands (`plan start`, `discover harness`); the runner and the two gates;
the closeout classifier and reconciliation helper; the budgets file, the
meter and its baseline; the gitattributes manifest; the sequence file and
the archive; the regenerated bundle and both profiles' skills; fixtures for
every criterion; the write-backs below.

**Acceptance criteria (all required)**

1. **Attribution.** `hasAiAttribution` matches a `Claude-Session:` trailer,
   any `<Agent>-Session:` trailer and a session URL line in commit messages
   and PR bodies, with fixtures; `worktree publish` refuses a PR body or
   title containing one; the emitter installs the unit's declared
   `attribution` settings block into `.claude/settings.json` and `harness
   check` detects its absence; the unit's prose names harness-suggested
   session trailers. The decision is written back to 08 §PRs and commits.
2. **Attestation.** With `environment.json` carrying an observed line
   `2.1` through `2.1.263`, `resume -- final-review-result --harness-version
   2.1.265 --effort max --source self-reported` records `effort max` and
   the actual version; a version off the line records `unknown` with the
   line named; `npm run discover -- harness` appends an observed row for
   the running harness from a probe, never from a session's own claim
   alone, and the session hook prints one warning line when the running
   version leaves the line; fixtures cover all three. WO-042's segment is
   byte-identical.
3. **Read obligation.** With process doubles, a session that edits two
   files, regenerates the index and inherits ten uncommitted changes owes
   two byte reads and one check and no more; a file above the read cap owes
   a check; a path with the `dotln-generated` attribute owes a check; the
   obligation is enforced at the four lifecycle transitions and reported,
   not enforced, at Stop. `.gitattributes` marks the generated index, every
   evidence JSON and JSONL, the console fixtures and `packages/*/dist`.
4. **Advisory Stop.** Every Stop hook exits without blocking, prints at most
   one line naming the unmet obligation, and `finish` still releases the
   writer reservation and records its receipt; a fixture ends a turn with an
   unrecorded transition and observes the line and no refusal; the four
   transition commands refuse the same conditions with the same evidence.
5. **Evidence by tree hash.** `checks.json` rows carry `treeHash` and
   `durationMs`; a required check is satisfied by any recorded green run at
   the current tree hash from any session or role; the harness evidence
   runner's timeout records a failure naming the suite and its elapsed time,
   never `executed:false`; a fixture proves reuse across two sessions and
   invalidation after one byte changes.
6. **Two gates with numbers.** `npm test` completes in at most 120 s wall on
   the operator's machine and `npm run test:full` runs every command the
   2026-09-09 chain ran (table compared against the previous `package.json`
   entry in a test), builds once before any suite that needs it, runs
   independent suites concurrently and serialization groups never
   overlapping, prints per-suite status and duration and names every suite
   over 30 s as a split candidate, prints a negative fixture's expected
   refusal under its suite rather than as a top-level FAIL line (on
   2026-09-09 the license-surfaces fixtures printed three such lines in a
   passing run), and a measured before/after receipt on
   the same host and commit shows both gates. `--only <suite>` and
   `--serial` work. The three transitions require `test:full`; the
   evidence runner and Stop use `npm test`. WO-036's remaining `node:test`
   conversions land here with case counts before and after. Neither gate
   deletes the runtime the installed hooks import: the build writes to a
   temporary directory and replaces `dist` atomically, and a fixture proves
   a hook invocation succeeds at every point during a gate run. A
   document-only dispatch (`planning:`, `ideation:`) runs the document
   gate only: the plan check, the index check, the publication check and
   the format check; it never runs the code suites, and 07 §Operator-opened
   planning pass lists that gate as the pass's artifact (operator decision,
   2026-09-09).
7. **Closeout.** With the WO-042 closeout shapes reproduced as fixtures
   (harness state in the subject and in main, `terms.txt` in main, an intake
   note in the subject with and without a collision), `release close
   --publish` completes without a hand-written script, prints the
   reconciliation receipt, leaves `terms.txt` and every intake byte in
   place, and `--dry-run` changes nothing; `.gitignore` and `docs/README.md`
   state that scripts read and write `docs/control/local/`; the release-close
   skill forbids closeout scripts.
8. **Planning branch and the guard.** `npm run plan -- start <slug>` creates
   `planning/<date>-<slug>` from clean `main` and is allowlisted as a
   lifecycle command; the harness profile enumerates every tool the harness
   exposes with its effect class and the host refuses an unclassified
   effectful tool (Monitor, notebook edits, spawned agents' shells); the
   permission classifier classifies the command's own invocation, so a
   heredoc or search pattern containing `push`, `publish` or `.env` is not
   refused as that effect; fixtures cover each.
9. **Units.** The anti-oscillation unit at version 2 states the operator's
   rule for applying a correction. Undesired: "Do not answer a correction
   with a sweeping generalization that extrapolates beyond the category the
   operator named into adjacent rules or file changes they never asked for,
   nor with an over-literal reading that strips the rule to its exact words
   and excludes obvious members of the same category." Desired: "Identify
   the category the operator is pointing at; stay inside it, neither
   widening nor shrinking it; when the boundary is genuinely unclear, ask
   one focused question instead of guessing in either direction; and pause
   to ask before any file action that goes beyond the literal correction."
   Its incident record carries the operator's worked example (a correction
   about committing opaque identifiers: hashes belong to that category,
   hostnames do not) and cites the ledger's 2026-09-09 planning-pass
   section, which logs the ten corrections of that pass, as its source;
   its mechanism kind is `prose`, it claims no host
   facts, and its fixture is that every role skill carries the rule and the
   example. Decision lineage leaves this unit; 07 §Discipline "Settled is
   settled" keeps that rule unchanged. The three other prose-only units
   carry kind `prose`; the three Stop units carry enforcement `advisory`;
   every version-1 definition is retained; the compiled `CLAUDE.md` residue
   block is one line and the file is smaller than at `v0.16.0`.
10. **Budget.** `docs/control/budgets.json` holds tokens and cost per
    dispatch kind, per-role cold-start bytes
    (executor 16 KB, verifier 12 KB, reviewer 14 KB, release close 6 KB,
    planner 24 KB, `CLAUDE.md` included), fast-gate seconds (120), the read
    cap (64 KB), the sequence file size (8 KB) and the PR body size, each
    with an optional dated acceptance entry; `harness-context --check`
    compares the current edition to the previous edition and the budget and
    fails on a breach without an acceptance; the planner skill directs
    `docs/planning/sequence.md` and the two guide sections only, and the
    measured planner cold start is under budget. The check measures the
    installed floor and skills only; an edit to a product document never
    fails it, and no evidence edition is regenerated to admit a
    documentation write-back (on 2026-09-09 this pass's guide edits failed
    `harness-context --check` with "context measurement drift").
11. **Meter.** `npm run meta` prints, for the last five closed orders and
    the active one, phase durations and attempts from the control fold,
    gate seconds and read-obligation counts and bytes from the evidence
    records, tokens and cost per dispatch observed from the harness (the
    CLI transports' usage and cost envelopes, the interactive session's
    transcript usage reachable through the hook input's transcript path,
    and Codex's equivalent) beside the compiled declared `promptTokens`,
    so declared and observed cost sit in one row and the playbook's "no
    token, cost, or attention data is collected" sentence is retired,
    per-role cold-start bytes from the context editions, unit, hook
    and support counts from the manifest, the sizes of the sequence file,
    the map, the index, the ledger, `CLAUDE.md` and the skills, PR body
    bytes, and the count of operator corrections recorded for the order,
    each with its previous-order delta and a verdict against the budget; `resume status` prints one health line; `release prepare`
    writes the table into `PR.md`; `npm test` fails on a breach without an
    acceptance; the first run is committed as
    `docs/evidence/WO-126/meta-baseline.json`.
12. **Headline titles.** The reviewer skill's title step reads: write the
    PR title as a headline, one clause that says what changed for the reader
    and why it matters, the lede first, sized by its content and never by
    the previous title, with no implementation inventory, version list or
    repeated work-order prose. `worktree publish` prints the last five
    merged subjects with their lengths beside the proposed title before it
    pushes, and the meter reports the subject-length series. No numeric
    rule refuses any length (operator decision, 2026-09-09). The rule is
    written back to 08 §PRs and commits.
13. **Ledger scope.** `docs/lineage/idea-ledger.md` records operator
    ideation and planning-pass synthesis only. Per-order decisions, the
    adopted and rejected alternatives a repair or review records, live in
    that order's evidence directory as `docs/evidence/WO-NNN/decisions.md`,
    and `npm run meta` generates `docs/lineage/decisions-index.md` over
    them so a repair or a planning pass finds every recorded rejection
    without reading the ledger. The executor, verifier
    and reviewer loadouts no longer direct a ledger append; the work-order
    template's write-back duty names the decisions file instead; existing
    ledger sections are never rewritten or moved. An operator correction
    during any dispatch is recorded the same day in that dispatch's
    committed record (the order's decisions file, or the pass's ledger
    section) as what was misread, what was meant, and what changed; a
    session's private capture is not that record. Transition for inherited
    duties: an order filed before 2026-09-09 whose acceptance text names a
    ledger entry (WO-043 criterion 6, WO-045 criterion 5, WO-052 criterion
    5 and WO-089 criterion 2 among them) discharges that text with its
    decisions file and its row in the generated decisions index; its
    executor writes no ledger section, its verifier checks the decisions
    file, and the work-order index marks the substitution on the order's
    row, so no executor decides this alone. WO-084 is the one permitted
    historical migration: its section moves, tag normalization and header
    note apply to material filed before 2026-09-09 and preserve every
    entry's prose byte for byte, as its own criterion 2 requires; the
    never-rewritten rule above binds lifecycle sessions, not that
    migration. A fixture proves a repair receipt lands in the decisions
    file and the index, that an inherited ledger-entry criterion is
    satisfied by the decisions file, and that the ledger is byte-identical
    after a lifecycle run.
14. **Write-backs land:** 02 §Feedback compiler v1 (advisory rung,
    authorship-observed outputs, kind `prose`); 03 §Corpus policy (the
    planning archive; `docs/control/local/` is read and written by scripts);
    07 §Read order (planner reads the sequence file), §Operator-opened
    planning pass (`plan start`), §Workflow closeout and releases (the
    reconciliation helper and the reuse-by-hash rule), §Discipline (process
    budget); 08 §PRs and commits (attribution decision); `docs/PLAYBOOK.md`;
    `docs/planning/refutations/README.md` (the sequence file); the
    decisions file and index; both profiles' regenerated skills.
15. **Refutation is one phrase, inside the harness.** `planning: refute`
    resolves in both profiles, beside the bare `planning:` prefix that
    opens a pass, and makes the receiving session the refuter of the latest
    dated planning pass: the direct-session form with no CLI launch and no
    operator step. `npm run plan -- refute --direct` prints the canonical
    subject prompt into the session (the same text a transport would send)
    after confirming the committed subject equals the workspace; the
    session judges it and saves the closed result; and
    `npm run plan -- receipt <result.json> --statement <statement.txt>
    [--dispositions <file>]` validates the result against the committed
    subject, screens it against the local terms list, files the immutable
    pair with a direct-session episode, commits it with a plain subject, and
    runs the plan check. The role skill carries these steps, so the session
    writes no ad hoc code. `npm run plan -- refute --transport <name>`
    remains the separate command for an external refuter and is not what
    the phrase means; the receipts README and 07 §Operator-opened planning
    pass describe the phrase. The refuter dispatch directs no read but the
    canonical prompt: it loads no map, guide section or earlier receipt (on
    2026-09-09 the planner role's directed reads exposed the map narrative
    and earlier receipts before the judgment, and receipt 005 had to
    disclose it). Two scopes, the operator's choice, both kept:
    `planning: refute` judges the orders the latest planning pass created
    or changed, plus the sequence, and carries every other order's latest
    verdict forward by hash in the new receipt; `planning: refute full`
    judges the whole horizon. The receipt records which scope ran and its
    wall-clock from dispatch to file, and `budgets.json` holds 120 s for
    the pass-scoped form (on 2026-09-09 each run judged 76 orders from a
    194 KB prompt, and the first also ran the code suite, over thirty
    minutes in all).
    Fixtures cover the direct route end to end, including a rejected stale
    subject, a rejected malformed result, and a carried-forward verdict. The
    external command's transport failure reports the CLI's exit code and
    stderr (on 2026-09-09, from a sandboxed session, the Codex transport
    reported only `transport-failed: exit-1`; the cause was the sandbox
    refusing the CLI's app-server socket, and the nested Claude CLI had no
    login).
16. **The four questions are asked by the repository, not the operator.**
    The operator's standing questions for every process, recorded
    2026-09-09: how do we make this quicker; how do we make this take less
    context; how do we make this consume fewer resources; how do we make a
    six-step process four steps and perform as well or better. The
    mechanism: for every dispatch kind (executor, verifier, reviewer,
    release close, planning, refutation) the meter records wall-clock,
    bytes read into context, commands run and step count, and prints the
    previous-order delta; every order's design section states, in those
    units, the cost its process changes add and remove; the refuter's rules
    hold an order that adds process cost without a stated removal or a
    dated budget acceptance (the existing `machinery` verdict gains that
    check); every role skill carries one line, before adding a step, read,
    check or artifact, state what it costs and what it removes and take the
    fewer-step path that performs as well; and `resume status` prints the
    health line so the trend reaches the operator unasked. The standard is
    the operator's: a new user must never find the simplest action the
    most expensive in time, resources or context.
17. `npm run test:full` green; `git diff --check` clean; no new dependency;
    the regenerated bundle pins; a fresh feedback evidence edition because
    runtime source changed; the receipt records this order's own phase
    durations, the reviewer's read-obligation count and bytes against
    WO-042's 135 and 5,305,410, and the fast-gate seconds.

**Evidence gate:** `npm run test:full`; the two-gate timing receipt; the
meter baseline; the closeout fixture transcripts; the per-role cold-start
table before and after; the feedback evidence edition.

**Write-back duty:** as listed in criterion 14, in the same pull request.

**Non-goals:** attention or presence telemetry; the kernel,
`verification-v1` and event-schema contracts; removing the writer guard, the
attribution guard or the permissions envelope; the rule migration batches;
any target-repository order; the refutation gate's judgment rules beyond
the cost check of criterion 16 (its subject reader changes path only).

**Operator-review assumptions**

1. The one-seam and four-hour exemption above is the operator's, recorded
   here, and sets no precedent.
2. The operator decided on 2026-09-09 that no numeric title rule applies:
   a title is a headline sized by its content. Criterion 12 is that rule
   plus visibility of the series. The earlier rejection of an invented
   length limit stands and is not reopened.
3. Superseding WO-039's first repair receipt item 3 (session-only authorship
   not adopted) is the operator's explicit 2026-09-09 decision; the ledger
   records the reason.
4. WO-036 is superseded whole by criterion 6; its 2026-09-06 measurements
   are the baseline that criterion cites.
5. The executor lands criterion 2 before recording `implementation-ready` on
   a Claude Code version outside the observed line; otherwise the `max+`
   declaration refuses the transition on the order that fixes it.
