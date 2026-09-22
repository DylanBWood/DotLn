# WO-151 — Entropy Reducer dispatch: one command freezes a subject, compiles the reviewer, hands the review and its blinded refutation to fresh workers through the existing transports, files numbered immutable receipts, and records operator dispositions that land accepted findings in the follow-up register; the loadout, its actor pin and its authority are unchanged (version assigned at activation)

**Model:** any for the implementation. The live episodes use the loadout's
pinned actor, Claude Fable 5.1 at `max` through the print transport with model
and effort read back from the invocation, or an attested substitute recorded
as one. State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new command family and control log, a
document check, numbered receipts, a rewritten operator guide and product
write-backs. No kernel, loadout, residue, actor pin, authority, hook or gate
change; the skeleton component moves only if a request kind is added to the
worker protocol (design, first bullet). Assigned at activation under the
standing opt-out default.
**Cost:** adds one command family (`npm run entropy -- review | receipt |
refute | refutation-receipt | dispose | check`), one append-only control log,
one document check in `npm run test:docs` (reported against the gate step
count the meter already flags: 76 at WO-149), one generated planning document
per disposed review, and, per run, the reviewer's and refuter's episodes,
whose cost the command does not change: at the pinned actor the only observed
run took 98 turns, 1,019.6 s and USD 10.52 (list) for the review and 54 turns,
745.9 s and USD 6.22 for the refutation, about 29 minutes and USD 17 per full
cycle (`runs/REVIEW-001.json`, `runs/REFUTATION-001.json`). Because it edits
the root `package.json`, a registered evidence source, it carries one edition
re-mint and one live feedback self-host episode (WO-147 D010; that episode
ran 320.6 s under WO-147). Removes the five host steps the operator guide asks
a session to perform by hand with APIs no script calls (observed 2026-09-22:
`compileReviewerWorkOrder`, `validateReviewerOutput`, `prepareReportEmit`,
`selectFindingsForRefutation` and `buildRefutationReport` have no caller
outside `entropy-reducer.ts` and its two tests), the operator-authored
dispatch prompt, and hand-written receipts. Expected, not measured: the loss
of measured evidence when the reviewer cannot run commands (REVIEW-001 ran
restricted, recorded seven denied shell calls including the census, the build
and the test suites, and measured one of its seven findings), by running the
worker inside the scratch copy with execution admitted there. Wall-clock,
tokens and context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's dispatch `planning: entropy reducer`
(2026-09-22, captured verbatim in ignored intake; SHA-256 in the ledger
section); the operator guide's own list of future capabilities ("a dedicated
launcher"); the 2026-09-04 ledger entry that the shipped reviewer needs an
honest operator entry point, of which the manual guide was the first step; the
platform lens in product 07 §Goal-aligned decisions (a capability arrives as
an interface something else consumes, and a receipt that needs
reverse-engineering is an accessibility failure). Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: no stop condition (no path
outside the repository enters a committed surface; scratch roots are named by
their grant, not their value).
**Depends on:** WO-023 merged (the compiled loadout, its validators, the
refutation plan and the first receipts; closed, v0.5.0); WO-041 merged (the
one-shot refutation host, the print and Codex transports with model and
effort on the command line, and the immutable receipt helper this order
mirrors; closed, v0.13.3); WO-142 merged (Shape-First v2 and the regenerated
residue the prompt cites; closed, v0.32.0); WO-144 merged (the system-temp
outside-write grant the scratch copy uses; closed, v0.33.0).
**Recommended placement:** paired with WO-152 directly after the WO-120
and WO-063 pair and before WO-100 and WO-064. It adds `scripts/entropy.mjs`
and `scripts/lib/entropy-review.mjs`, a test beside
`scripts/test-plan-refutation.mjs`, the `entropy` script in the root
`package.json`, `docs/control/entropy-reducer.jsonl`, receipts under
`docs/instance/entropy-reducer/runs/`, and rewrites
`docs/instance/entropy-reducer/README.md`; WO-152 edits the mission-check
protocol, its test and the skeleton package. The two share no file and
neither depends on the other; both re-mint the evidence editions, and the
second final review re-mints them again on integration, as WO-147's did. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-023",
    "relation": "satisfied-by-close",
    "reason": "the compiled loadout, its typed validators, the refutation plan and the first receipts"
  },
  {
    "workOrderId": "WO-041",
    "relation": "satisfied-by-close",
    "reason": "the one-shot refutation host, the transports with model and effort on the command line, and the receipt helper this order mirrors"
  },
  {
    "workOrderId": "WO-142",
    "relation": "satisfied-by-close",
    "reason": "Shape-First v2 and the regenerated residue the canonical prompt cites"
  },
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the system-temp outside-write grant the frozen scratch copy relies on"
  },
  {
    "workOrderId": "WO-119",
    "relation": "reference-only",
    "reason": "the executable discovery producer; the reviewer is not a producer and WO-100 consumes only WO-119"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/instance/entropy-reducer/README.md`
(the five manual host steps and the frozen-subject requirements),
`REFUTATION-PLAN.md` (blinding, deterministic selection, disposition) and
`RESIDUE.md` (the generated projection; never hand-edited);
`docs/instance/entropy-reducer/runs/REVIEW-001.json` (`subject`,
`actorAttestation`, `compilation`, `harnessResult.permissionDenials`,
`confinement`, `disposition`) and `REFUTATION-001.json` (`blinding`,
`selection`, `report`); `packages/skeleton/src/loadouts/entropy-reducer.ts`
(`compileReviewerWorkOrder`, `validateReviewerOutput`, `prepareReportEmit`,
`selectFindingsForRefutation`, `buildRefutationReport`,
`reviewerOutputContract`, `entropyReducerReviewerRequirement`,
`entropyReducerExecutionBoundary`, `entropyReducerLensBriefs`);
`packages/skeleton/src/plan-refutation-host.ts` (`runPlanRefutation`: the
empty scratch cwd, the retention lane, the attestation fields);
`packages/skeleton/src/worker-transport.ts` (the `--model` and `--effort`
arguments of `claude-cli-print` and `codex-cli-exec`, and the profile that
names a worker's tools); `scripts/refute-plan.mjs` and
`scripts/lib/plan-direct.mjs` (`beginDirectRefutation`: the pending dispatch
file, the printed prompt and schema, the worker instruction) and
`scripts/lib/plan-receipts.mjs` (`writePlanReceipt`: numbering, the immutable
pair, the control-log event); `scripts/lib/planning-followups.mjs`
(`markdownFiles`: `docs/planning/` subdirectories other than `archive` and
`refutations` are harvested; the formal candidate heading patterns);
`scripts/lib/evidence-sources.mjs` (the registered sources) and
`docs/evidence/WO-147/decisions.md` §WO-147-D010 (the edition duty);
`packages/skeleton/src/harness-command.ts` (the five `lifecycle.run` scripts;
every other `npm run` is `shell.run`); 03-architecture.md §Agent-originated
product suggestions and §First live Entropy Reducer use;
05-pattern-library.md §5S (the Entropy Reducer paragraphs);
07-execution-guide.md §Operator-opened planning pass (a pass may consume the
reviewer's surviving findings) and §Goal-aligned decisions (the platform
lens); `docs/planning/refutations/README.md` (external CLI launches need an
explicit operator request; the `fake` transport cannot satisfy a gate);
`docs/AI-HARNESS-SECURITY.md` §Harness version, model and effort readback.

**Objective:** From a clean checkout, `npm run entropy -- review` copies
`HEAD` into a fresh scratch root under the granted system-temp lane, records
the tracked-status hash and a scratch inventory, compiles the reviewer's
WorkOrder, authority envelope, program, lens briefs and residue reference for
that repository and base with a fresh episode id and a finite episode end, and
prints the canonical prompt and the typed output schema for one fresh worker,
retaining the pending dispatch; `entropy receipt` validates the returned
payload with the loadout's own validators against that exact WorkOrder and
episode, refuses a subject whose tracked status changed, and files the next
numbered immutable `REVIEW-NNN` pair with its attestation; `entropy refute`
prints only the blinded subjects the compiled selection rule chooses for a
second fresh worker, and `entropy refutation-receipt` binds the attempts into
the next numbered immutable `REFUTATION-NNN` pair; `entropy dispose` records
the operator's accept, defer or dismiss per surviving finding and per proposal
packet, lands accepted findings as a formal candidate section in a generated
planning document the follow-up collector already harvests, and files accepted
packets under `docs/proposals/<suggestionId>/`; `entropy check` proves the
receipt chain and the immutability of every filed pair. The pinned route
(`--transport claude-cli-print`) records model and effort from the invocation;
the background route records a session-attested worker whose effort is
unknown unless the operator attests it, and the receipt names a reviewer that
does not match the pin by readback as a substitute. The loadout, its residue,
actor pin, authority envelope and program are not edited, and `Program.All`
stays deferred: the host drives the compiled manual plan as the refutation
host drives its one-shot order.

**Observed gap (dated 2026-09-22, `main` at `4d52b540`):**

- The operator guide says there is no `npm run entropy-reducer` or
  `resume: entropy` command and lists five host steps a separate session must
  perform by hand: compile the reviewer WorkOrder with retained inputs,
  follow the manual program, validate the output with `validateReviewerOutput`
  or `prepareReportEmit`, dispatch a fresh blinded episode from
  `selectFindingsForRefutation` and bind it with `buildRefutationReport`,
  then stop at disposition. None of those five functions has a caller outside
  `packages/skeleton/src/loadouts/entropy-reducer.ts` and its two tests
  (`grep -rn` over `packages/*/src`, `scripts` and `corpus`). The guide names
  a dedicated launcher as a future capability.
- `docs/instance/entropy-reducer/runs/` holds one review and one refutation,
  both of 2026-09-04 against the pre-repair WO-023 subject at base
  `e3e639fe`. Every order from WO-028 through WO-149 has closed since with no
  further review; the follow-up register's nominations come from verifiers
  and reviewers inside orders, and a planning pass "may" consume the
  reviewer's surviving findings but has had none to consume.
- REVIEW-001 ran with `restricted: true` and `safeMode: true`; its harness
  result records seven denied shell calls (the census, the whitespace check,
  the build and test suites, the formatter and two probes); one of its seven
  findings is `measured`, six are `by inspection`, although the compiled
  envelope permits `probe.run:scratch*` and the mutation-drill support asks
  for perturbations in a scratch copy.
- The reviewer's one proposal packet was never filed: `docs/proposals/` does
  not exist and product 03 records that neither episode had filing
  authority. Nothing routes an accepted finding into the follow-up register;
  the collector harvests formal candidate headings in product and planning
  documents and decision records, and a review receipt is neither.
- The planning refuter, compiled from the same identity (WO-041), has the
  shape this order needs: `beginDirectRefutation` prints a canonical prompt
  and closed schema for one fresh background worker and retains the pending
  dispatch; `runPlanRefutation` runs the print or Codex transport with
  `--model` and `--effort` on the command line and records both as
  `host-launch` selections with effective readback `unknown`; `writePlanReceipt`
  files an immutable numbered pair and appends to a control log. The
  reviewer's substitution policy is `different-reviewer-and-must-be-attested`.

**Design (scope discipline):**

- One seam, the reviewer's dispatch host: `scripts/entropy.mjs` and
  `scripts/lib/entropy-review.mjs`, mirroring `refute-plan.mjs` and
  `plan-direct.mjs` and reusing their helpers where they are not
  plan-specific. The pinned route reuses `ClaudeCliPrintWorkOrderTransport`
  and `CodexCliExecWorkOrderTransport` with a review profile that admits
  reading and running inside the scratch copy and nothing outside it; if that
  profile needs a new request kind in `worker-protocol.ts`, the executor
  records the decision, bumps the skeleton component and carries the edition
  duty, as WO-147 D010 requires for every registered source. The background
  route prints the prompt and schema for a worker the session spawns, as
  `plan refute --direct` does; the parent remains the sole repository writer.
- The subject is `HEAD` of a clean tree, copied (not linked) into a fresh
  directory under the system-temp grant; a dirty tree is refused by path.
  The receipt binds the commit, the tracked-status hash before and after, the
  scratch inventory before and after, the compile inputs and semantic hash,
  and the attestation. The scratch copy is retained under the local control
  lane only when a result is rejected, as the refutation host retains
  rejected output.
- Attestation is a fact, not a claim: the pinned route records the model and
  effort passed to the CLI (`command-line-readback-and-invocation`), the
  background route records `session-attested` with effort `unknown` unless
  `--source operator-attested` supplies the operator's value, and the
  receipt's identity line reads `entropy-reducer@1` only when model and
  effort match `entropyReducerReviewerRequirement` by readback; otherwise it
  reads `substitute reviewer` with the recorded values. No default silently
  selects another model.
- Receipts are numbered from the next unused `NNN`, never overwrite, and are
  bound by SHA-256 in `docs/control/entropy-reducer.jsonl`
  (`EntropyReviewFiled`, `EntropyRefutationFiled`, `EntropyFindingDisposed`,
  `EntropyPacketFiled`); the rendered `.md` is a projection of the `.json`.
  `REVIEW-001*` and `REFUTATION-001*` keep their bytes and are recorded as
  pre-mechanism evidence, never re-bound.
- Disposition is the operator's act and stops there: `accept` on a surviving
  finding appends a list item under a formal `## Candidates — accepted
  Entropy Reducer findings, review NNN (recorded <date>)` heading in
  `docs/planning/entropy-reviews/REVIEW-NNN.md`, which `npm run meta` syncs
  into the register as candidate rows; `accept` on a packet writes
  `docs/proposals/<suggestionId>/packet.json`; a refuted, blocked or
  unselected finding cannot be accepted; promotion to a work order stays a
  planning act.
- Cost is recorded in the receipt from the transport's harness result where
  it exposes counters, and the receipt's cost line uses the WO-140 cause codes
  when it cannot; no meter dispatch column is added.
- **Declined alternatives, recorded:** a new dispatch phrase, role or role
  skill (a bundle change with cold-start cost for a command any session can
  run); implementing `Program.All` (FUP-0006's NoOp stands; nothing here
  needs concurrency inside one program); a Sustain cadence or automatic
  dispatch during operator absence (a candidate in the map dated 2026-09-22;
  reopens after WO-111's hour); classifying the command as `lifecycle.run`
  (edits `harness-command.ts`, a registered source, for a refusal nobody has
  observed); snapshotting a dirty tree with an inventory (the guide admits
  it; refusal is smaller and the operator can commit); recording the
  reviewer's cost under the refuter's meter role (untrue); running the review
  inside `npm test` (a model call in a gate).

**Deliverables:** the command family and its library; the control log; the
document check; the test in the `plan-refutation` suite; the rewritten
operator guide; REVIEW-002 and REFUTATION-002; the write-backs in criterion 8.

**Acceptance criteria (all required)**

1. Freeze and compile: on a clean tree `entropy review` creates the scratch
   copy under the system-temp grant, records the tracked-status hash and
   scratch inventory, compiles `compileReviewerWorkOrder()` for that
   repository and base with a fresh episode id, dispatch time and finite
   episode end, and prints the canonical prompt (the residue reference, the
   four lens briefs, the operator's optional concern as a hypothesis, the
   frozen subject path, the output schema) while retaining the pending
   dispatch; a dirty tree, and a second `review` while a dispatch is pending
   for the same subject, are refused by path with the reason.
2. Attestation: the pinned route passes `--model claude-fable-5-1` and
   `--effort max` by default and records both from the invocation; the
   background route records `session-attested` and effort `unknown` unless
   the operator attests; a reviewer that does not match the pin by readback
   is labeled `substitute reviewer` in the receipt and its rendering; the
   fixture proves all three.
3. Receipt: `entropy receipt <result.json> --statement <statement.txt>`
   validates through the loadout's validators against the exact WorkOrder
   and episode, refuses a result whose tracked status after the episode
   differs from before, files `REVIEW-NNN.json` and `.md` at the next unused
   number with the attestation, cost, confinement and a summary under 200
   words, and appends `EntropyReviewFiled` with both hashes; a rejected
   result is retained in the local control lane with its statement.
4. Refutation: `entropy refute REVIEW-NNN` prints only
   `{ findingId, command }` and `{ findingId, steps }` subjects chosen by
   `selectFindingsForRefutation()` for a second fresh worker;
   `entropy refutation-receipt` binds the attempts with
   `buildRefutationReport()` and files `REFUTATION-NNN` at the next unused
   number; zero findings yield `not-applicable` denominators; refuted,
   blocked and unselected findings remain visible.
5. Disposition: `entropy dispose REVIEW-NNN <id> accept|defer|dismiss
   '<reason>'` appends the event; `accept` on a surviving finding writes the
   generated planning document's candidate item and `npm run meta` then
   lists it as a register row; `accept` on a packet files it under
   `docs/proposals/`; accepting a refuted, blocked, unselected or unknown id
   is refused.
6. Immutability and fixture: `entropy check` fails on a hand-edited receipt
   or a missing control event and runs in `npm run test:docs`; the `fake`
   transport drives review, receipt, refute, refutation-receipt and dispose
   end to end in the `plan-refutation` suite, including every refusal named
   above, and cannot produce a live receipt.
7. Live row: one review of the activation commit and one refutation through
   the pinned route, with the operator's authorization of the external CLI
   launch recorded in the decisions, filed as REVIEW-002 and REFUTATION-002
   with attestation from the invocation, tracked status byte-identical before
   and after each episode, the scratch delta inventoried, and the recorded
   cost. A failed or blocked run files its receipt with the failure and does
   not close the order. The operator's dispositions are the reopening
   observation, not a criterion.
8. Write-backs and editions: the operator guide describes the command path
   and keeps the manual steps as the recorded fallback; product 03 §First
   live Entropy Reducer use and product 05's paragraph name the dispatch and
   the substitute rule; the PLAYBOOK row's "how it is chosen" cell names the
   command; the security document records the launch line; the root
   `package.json` edit re-mints the authority and feedback editions with one
   live self-host episode; the document check's gate step is reported against
   the count the meter flags.
9. `npm test` green; `git diff --check` clean; no new dependency;
   `packages/skeleton/src/loadouts/entropy-reducer.ts` unchanged and the
   artifact-identity evidence reporting the reviewer's semantic hash
   unchanged.

**Evidence gate:** the fixture transcripts; the two live receipts and their
control events; the edition re-mint and self-host record; `npm test` once at
final review. The next planning pass reading `docs/planning/entropy-reviews/`
rows from REVIEW-002's dispositions is the first consumption.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** a Sustain cadence, automatic dispatch during absence or any
scheduler; `Program.All` in the kernel; a new dispatch phrase, role or role
skill; a meter dispatch column for the reviewer; `lifecycle.run`
classification; editing the loadout, residue, actor pin, authority or
program; promoting proposals or findings to work orders; running the reviewer
inside `npm test`; a review of a dirty tree.

**Operator-review assumptions**

1. A full cycle at the pinned actor costs about USD 17 and 30 minutes by the
   one observed run; the dollar ceiling in `docs/control/budgets.json` stays
   unset and no cap is invented.
2. Activating this order authorizes the live row's external CLI launch of the
   pinned reviewer and refuter; the decisions record that authorization.
3. The background route produces a substitute reviewer unless the operator
   attests the effort; the pinned route is the one that satisfies the
   loadout by readback.
4. Accepted findings enter the follow-up register as candidates and nothing
   is activated by the command.
