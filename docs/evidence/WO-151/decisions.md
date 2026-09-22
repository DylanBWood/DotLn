# WO-151 decisions — Entropy Reducer dispatch

Dispatch: `resume: next` on 2026-09-22, Claude Code executor, model
`claude-opus-5[1m]`, effort `xhigh` (operator-attested; the harness exposes no
effective effort readback). Authority:
`docs/work-orders/WO-151-entropy-reducer-dispatch.md`. Supports equipped at
dispatch: Adjacent Repair, Intent to Act, Decision Receipts, Operator Check-In,
Tinkerer — Economy, Follow-up Queue (revision 0, empty).

Goal and critical path: the order names no critical-path gate, and the planning
map's Receipt 024 asks the executor to say which gated order or outcome its
accepted findings serve. They serve the follow-up register that opens every
planning pass: product 07 §Operator-opened planning pass says a pass *may*
consume the reviewer's surviving findings, and in 121 closed orders it never
has, because nothing routed one there. The outcome this order serves is the
next planning pass reading `docs/planning/entropy-reviews/` rows, and REVIEW-002's
dispositions are read against that outcome, not against a shipping gate. Against
NoOp: the five compiled APIs stay callerless and the reviewer stays unused, which
is the observed status quo since 2026-09-04. Against Naive Interventionism: no
scheduler, phrase, role or cadence is added, and the manual steps are retained.

## WO-151-D001

```json
{
  "id": "WO-151-D001",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-151 design first bullet and criterion 2",
  "decision": "Add two request kinds, entropy-review and entropy-refutation, in a new packages/skeleton/src/entropy-review-protocol.ts, wire them into the existing TransportRequest union in verification-protocol.ts and give them their own argv branch in worker-transport.ts. Bump the skeleton component to 0.36.0 and the console's exact pin to match. Do not register the new protocol file in scripts/lib/evidence-sources.mjs.",
  "evidence": [
    "packages/skeleton/src/verification-protocol.ts: validateTransportRequest, transportResultSchema, parseTransportResult and transportPrompt all dispatch on request kind; an unknown kind falls through to validateRequest(request) for a WorkerRequest and is refused, so no existing kind could carry the reviewer's prompt or the loadout's output contract",
    "packages/skeleton/src/worker-transport.ts canonicalWorkerArgs: the existing claude-cli-print inspection branch passes --tools \"\" and --safe-mode, which is the exact shape that produced REVIEW-001's seven denied shell calls",
    "packages/skeleton/src/mission-check-protocol.ts is the most recent precedent for a new request kind in its own protocol file (WO-148), and it is absent from scripts/lib/evidence-sources.mjs; plan-refutation-protocol.ts, worker-protocol.ts and verification-protocol.ts are registered in commonSources",
    "Executed 2026-09-22: npm run build --silent succeeds; node scripts/test-plan-refutation.mjs --fixtures-only reports 54 tests, 54 pass, 0 fail (42 planning, 12 entropy)"
  ],
  "rejected": [
    {
      "option": "Reuse EvidenceWorkerRequest or PlanRefutationRequest",
      "reason": "Both carry a pinned capsule or plan subject as the whole evidence source and grant no tools. The reviewer's evidence source is a working copy it reads and runs commands in, and its closed result contract is the loadout's own reviewerOutputContract."
    },
    {
      "option": "Put the two kinds directly into worker-protocol.ts or verification-protocol.ts",
      "reason": "Both are registered evidence sources of four editions; a new protocol carries its own file, as the plan refuter and the mission check each do."
    },
    {
      "option": "Register entropy-review-protocol.ts in evidence-sources.mjs alongside plan-refutation-protocol.ts",
      "reason": "The most recent comparable file, mission-check-protocol.ts, is unregistered, and widening the recorded source inventory is a change the order did not ask for. The consequence is recorded in the reopening condition below rather than decided silently."
    }
  ],
  "followup": "Planner: entropy-review-protocol.ts and mission-check-protocol.ts change the compiled behaviour of registered sources (verification-protocol.ts, worker-transport.ts) without being registered themselves, so an edition can stay green while a protocol moves. Decide whether the registered inventory should follow the import graph rather than an explicit list. Priority: low.",
  "reopenWhen": "An edition check passes over a changed entropy or mission-check protocol, or a third unregistered protocol file is added."
}
```

## WO-151-D002

```json
{
  "id": "WO-151-D002",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-151 criterion 1 and criterion 7",
  "decision": "entropy review with no argument reviews HEAD and refuses a dirty tree, exactly as criterion 1 requires. entropy review <commit> names a committed subject explicitly, is admitted while the working tree holds unrelated changes, and records workingTreeDirtyAtDispatch and the tracked-status hash in the receipt. The live row of criterion 7 uses the explicit form.",
  "evidence": [
    "docs/work-orders/WO-151-entropy-reducer-dispatch.md criterion 1: 'a dirty tree ... refused by path with the reason'; criterion 7: 'one review of the activation commit ... filed as REVIEW-002', which this order's executor must produce",
    "CLAUDE.md shared memory: 'No branch commits before final review.' The executor's tree therefore holds the whole implementation uncommitted for the entire dispatch, so the two criteria cannot both hold on the default path",
    "Declined alternatives in the order: 'snapshotting a dirty tree with an inventory (the guide admits it; refusal is smaller and the operator can commit)' — the refusal exists so nobody reviews workspace bytes, not so a named commit becomes unreviewable",
    "The subject is identified by commit, tracked-status hash and scratch inventory hash (scripts/lib/entropy-review.mjs subjectRecord), so an explicitly named commit is fully identified whatever the working tree holds",
    "Executed 2026-09-22: the fixture 'a dirty tree and a second pending dispatch are refused by path' asserts both the refusal on HEAD and the admission of a named commit"
  ],
  "rejected": [
    {
      "option": "Refuse unconditionally and leave criterion 7 unmet",
      "reason": "It delivers no live row at all, and the live row is the order's evidence gate. The scope decision is the operator's, so the reasoning is recorded here and reported rather than buried."
    },
    {
      "option": "Commit the implementation so the tree is clean",
      "reason": "Forbidden before final review."
    },
    {
      "option": "Run the live row from a second worktree or the main checkout",
      "reason": "DotLn reserves one writer per worktree; a second reservation from the same session is refused, and the receipt must land in this worktree."
    },
    {
      "option": "A --force or --allow-dirty flag on the default path",
      "reason": "A bypass flag on the refusal is exactly what the refusal is for. Naming the commit is not a bypass: it changes what the subject is, and the receipt says so."
    }
  ],
  "reopenWhen": "The operator directs that the refusal be absolute, or a future order lets an executor produce a live row from a clean tree."
}
```

## WO-151-D003

```json
{
  "id": "WO-151-D003",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-151 design second bullet and the Cost line's expected benefit",
  "decision": "Admit command execution to the review and refutation workers inside the frozen copy: Claude with --safe-mode --restricted --tools Bash,Read,Glob,Grep --allowedTools (the same list) --permission-prompts none, Codex with --sandbox workspace-write rooted at the copy and network disabled. Record in every receipt which confinement applied, and prove the subject did not move with the tracked-status hash on either side rather than claiming enforcement Claude does not provide.",
  "evidence": [
    "docs/instance/entropy-reducer/runs/REVIEW-001.json: actorAttestation.restricted true, safeMode true, harnessResult.permissionDenials length 7 (census, whitespace check, build, test suites, formatter and two probes), and one of seven findings labelled measured",
    "claude --help on 2.1.278: --restricted 'removes the built-in tools that run commands or code ... unless --tools names them ... Also confines the file tools to the working directories ... refuses bypassPermissions'; --permission-prompts none 'anything that would prompt is denied automatically'. No flag path-confines a shell command",
    "packages/skeleton/src/worker-transport.ts sourceChangeArgs: Codex's --sandbox workspace-write is the repository's existing enforced-containment shape, already used for the writing worker",
    "packages/skeleton/src/loadouts/entropy-reducer.ts: the compiled envelope permits probe.run:scratch* and the mutation-drill support asks for perturbations in a scratch copy, so execution inside the copy is the compiled intent, not an extension of it",
    "docs/instance/entropy-reducer/RESIDUE.md: 'The dispatch host must separately confine scratch probes and ignored intake capture to authorized roots; the compiled envelope names effect families and resource budgets, not filesystem roots'"
  ],
  "rejected": [
    {
      "option": "Keep --tools \"\" and accept inspection-only findings",
      "reason": "It reproduces the one observed failure this order exists to fix, and the Cost line names the loss of measured evidence as the expected benefit."
    },
    {
      "option": "Wrap the Claude CLI in a Seatbelt profile so shell commands are enforced-confined",
      "reason": "New platform-locked sandbox machinery beyond this order's seam, and the repository already records that nested sandbox-exec is refused inside the gate sandbox (WO-068 FINAL-001 O4). The detection mechanism the order specifies — refuse a return whose tracked status moved — is what criterion 3 asks for."
    },
    {
      "option": "Describe the Claude route as confined in the receipt",
      "reason": "It would be false. The receipt says 'instructed ... and checked by the tracked-status hash on either side of the episode' for Claude and 'host-enforced workspace sandbox' for Codex."
    }
  ],
  "reopenWhen": "A Claude CLI release path-confines shell commands, or a live review is observed writing outside the frozen copy."
}
```

## WO-151-D004

```json
{
  "id": "WO-151-D004",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-151 criterion 6 and the planning map's Receipt 024 fourth known issue",
  "decision": "File the control event first and the immutable pair second, both under the runs directory's writer lock. entropy check fails on a hand-edited receipt, on a rendering that is not its JSON's projection, on a filed pair with no control event and on a committed fixture receipt; it reports a trailing event whose pair never landed as status interrupted-filing instead of failing.",
  "evidence": [
    "docs/planning/work-order-map.md WO-151 row, Receipt 024: 'filing a receipt pair and appending its control event must be one atomic step, or entropy check must tolerate a filed pair without its event, so a crash between the two never fails the shared document gate for unrelated orders'",
    "Three files cannot be written atomically without a journal; ordering the event first makes the only reachable inconsistency a trailing event with no pair, which names itself and is completable",
    "scripts/lib/plan-receipts.mjs writePlanReceipt: the planning precedent takes the writer lock and writes the pair with flag wx; its control log carries only overrides, so it never faced this ordering",
    "Executed 2026-09-22: the fixtures 'check fails on a hand-edited receipt, a missing control event and a fixture receipt' and 'an interrupted filing is reported, never a shared-gate failure' both pass"
  ],
  "rejected": [
    {
      "option": "Write the pair first and the event second",
      "reason": "The reachable inconsistency becomes a filed pair with no event, which criterion 6 requires check to fail on — so a crash would redden the shared document gate for every unrelated order."
    },
    {
      "option": "Tolerate any filed pair without its event",
      "reason": "It removes the binding criterion 6 asks for: an unbound receipt could then be added to the runs directory by hand."
    },
    {
      "option": "Have check repair the missing event itself",
      "reason": "A check that writes is not a check, and the shared document gate must not mutate evidence."
    }
  ],
  "reopenWhen": "An interrupted filing is observed in practice and completing it turns out to need more than re-running entropy receipt."
}
```

## WO-151-D005

```json
{
  "id": "WO-151-D005",
  "date": "2026-09-22",
  "dispatch": "resume: next; adjacent defect met while building criterion 6",
  "decision": "Identify pre-mechanism run evidence by the receipt file's own schemaVersion, not by its number. A run whose schemaVersion is not entropy-review-receipt-v1 carries the 2026-09-04 hand-written shape and is never re-bound; every receipt this mechanism files is bound whatever its number.",
  "evidence": [
    "The first implementation exempted the literal ids REVIEW-001 and REFUTATION-001 from the control-event requirement. In a fresh launchpad the first filed receipt is also REVIEW-001, so the exemption silently admitted an unbound receipt there",
    "Executed 2026-09-22 before the fix: the fixture 'check fails on a hand-edited receipt, a missing control event and a fixture receipt' emptied the control log and check still returned status ok",
    "docs/instance/entropy-reducer/runs/REVIEW-001.json carries schemaVersion 1 and kind EntropyReducerReviewRun; this mechanism's receipts carry schemaVersion entropy-review-receipt-v1",
    "Executed 2026-09-22 after the fix: the same fixture reports 'filed with no control event' and the suite is 54 pass, 0 fail; npm run entropy -- check against this repository reports preMechanism [REFUTATION-001, REVIEW-001], status ok"
  ],
  "rejected": [
    {
      "option": "Keep the id exemption and accept that it only matters in fixtures",
      "reason": "It is a real hole in the immutability check wherever this command is used on another launchpad, and the fixture tree is exactly where it was observed."
    }
  ],
  "reopenWhen": "A pre-mechanism receipt is found carrying this schema, or a third receipt shape is introduced."
}
```

## WO-151-D006

```json
{
  "id": "WO-151-D006",
  "kind": "experiment",
  "date": "2026-09-22",
  "dispatch": "resume: next; Tinkerer — Economy, one experiment for this order",
  "decision": "Preflight the compiled reviewerOutputContract through the real Claude CLI before building the transport path, then keep the current method: pass the loadout's contract straight through with no schema-adaptation layer.",
  "evidence": [
    "docs/instance/entropy-reducer/runs/REVIEW-001.json transportPreflight: outcome refused-before-model, stderr '--json-schema is not a valid JSON Schema: strict mode: unknown keyword: \"maxWordCountExclusive\"', corrected by hand during that run",
    "packages/skeleton/src/loadouts/entropy-reducer.ts reviewerOutputContract: the offending keyword is gone; the summary and proposedPath constraints now travel as $comment, which is a standard keyword",
    "Executed 2026-09-22 on claude-code 2.1.278: the probe launch returned in 1 s with api_error_status 404, terminal_reason api_error, total_cost_usd 0 and all usage counters 0 — the schema was accepted and only the model was refused"
  ],
  "rejected": [
    {
      "option": "Launch the live row directly and adapt on failure",
      "reason": "A refusal there would waste the review episode the one observed run measured at 1,019.6 s and USD 10.52, and would arrive with the whole transport path already built around an unvalidated assumption."
    },
    {
      "option": "Pre-emptively strip non-standard keywords from the contract",
      "reason": "It edits packages/skeleton/src/loadouts/entropy-reducer.ts, which criterion 9 requires to stay unchanged, on no evidence that anything is rejected."
    }
  ],
  "question": "Does the compiled reviewerOutputContract pass the Claude CLI's strict --json-schema validation as it stands? REVIEW-001 recorded a transport preflight refused before the model on an unknown keyword and needed a hand adaptation; if that class of refusal still exists, meeting it at criterion 7's live row wastes a review episode that the one observed run measured at 1,019.6 s and USD 10.52.",
  "alternatives": [
    "Preflight the contract through the real CLI before building the transport path, and add a schema-adaptation step only if it refuses",
    "Launch the live row directly and adapt on failure",
    "Pre-emptively strip non-standard keywords with no evidence they are rejected"
  ],
  "observation": "One CLI launch carrying the current contract as --json-schema with a deliberately unavailable model, so a valid schema stops at model resolution and spends no tokens; a schema refusal would instead be reported before the model, as REVIEW-001's preflight was.",
  "budget": { "wallSeconds": 900 },
  "execution": "run",
  "cost": {
    "wallSeconds": 150,
    "tokens": 0,
    "commands": [
      "node -e (emit reviewerOutputContract from packages/skeleton/dist to the session scratch lane)",
      "claude --print --model dotln-probe-nonexistent-model --effort max --output-format json --json-schema \"$(cat contract.json)\" --no-session-persistence --tools \"\" --disable-slash-commands --safe-mode --strict-mcp-config --mcp-config '{\"mcpServers\":{}}' --no-chrome --max-budget-usd 0.01"
    ],
    "source": "wall clock measured with date(1) around the launch; token and dollar counters read from the CLI's own terminal result"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["claude --version"],
    "summary": "The launch returned in 1 s with api_error_status 404, terminal_reason api_error, subtype success, total_cost_usd 0 and every usage counter 0, on claude-code 2.1.278: the CLI accepted the contract as --json-schema and refused only the model. The contract already carries $comment where WO-023's preflight had carried maxWordCountExclusive, so the refusal class is closed. No adaptation layer was added and the loadout's contract is passed through unchanged. The saving is a risk removed, not a recurring per-order cost: nothing about the steady-state cost of an order changed, so both effect metrics are null."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": "2026-09-21", "experimentsSinceAdoption": 1 },
  "reopenWhen": "A CLI release changes strict --json-schema validation, or the loadout's output contract gains a keyword outside JSON Schema."
}
```

## WO-151-D007

```json
{
  "id": "WO-151-D007",
  "date": "2026-09-22",
  "dispatch": "scope expand: during resume: next — the operator directed that `planning: entropy reducer` change that planning pass to be one based on the Entropy Reducer's results, with follow-ups decided from the current pass and explicitly not a second planning pass",
  "decision": "Add the `planning: entropy reducer` phrase as a clause of the existing planner role: the pass runs the review and its blinded refutation, disposes every surviving finding and packet in that same pass, and weighs, sequences or declines the accepted ones there, in the map, sequence and orders. The generated review rows and the follow-up register become the record of what the pass decided rather than a queue for a later pass. Bounded to one procedure line in the planner role text, one paragraph in product 07 §Operator-opened planning pass, the amended non-goal, and this record.",
  "evidence": [
    "Operator message during resume: next on 2026-09-22: the workflow should be that `planning: entropy reducer` changes that planning pass to be one based off the Entropy Reducer's results, and those follow-ups get decided from the current planning pass, not a second one",
    "docs/work-orders/WO-151-entropy-reducer-dispatch.md non-goals before this expansion: 'a new dispatch phrase, role or role skill'; declined alternatives: 'a new dispatch phrase, role or role skill (a bundle change with cold-start cost for a command any session can run)'",
    "docs/product/07-execution-guide.md before this expansion: 'A planning pass may consume an Entropy Reducer's surviving findings as input' — permissive, with no phrase that makes a pass consume them and nothing that forbids deferring them to a later pass",
    "The declined alternative's premise is contradicted by the order's own observed gap: the reviewer's five compiled APIs have had no caller and no review has run since 2026-09-04, across every order from WO-028 to WO-149, precisely because 'any session can run it' left nothing that invokes it",
    "Measured 2026-09-22 after regenerating the bundle: node scripts/harness-context.mjs --check reports the planner root at 15,799 bytes in both generated roots against the 24,576 ceiling, verdict within; no other role's text changed",
    "packages/skeleton/src/loadouts/contributor.ts: the planner facet already declares the `planning:` intent, so the phrase routes to the existing planner role and adds no role, skill or bundle"
  ],
  "rejected": [
    {
      "option": "Keep the non-goal and leave the phrase out",
      "reason": "The operator authorized the expansion explicitly and repeated the reason: a review whose findings wait for a second pass is two passes for one subject. Declining would preserve the exact failure the order was written to fix."
    },
    {
      "option": "Add a dedicated role and role skill for the entropy pass, as the refuter has",
      "reason": "That is the bundle change the original alternative rightly declined, and it costs a sixth cold-start root. The planner already owns planning passes; this is one clause about what the pass's subject is."
    },
    {
      "option": "Have the phrase also run a review automatically on a cadence, or when the register is thin",
      "reason": "A Sustain cadence and automatic dispatch during absence remain non-goals the operator did not expand. Nothing runs unless the operator types the phrase."
    },
    {
      "option": "Stop writing the generated docs/planning/entropy-reviews/REVIEW-NNN.md rows now that the pass consumes findings directly",
      "reason": "The rows are the durable record of what was accepted and why, and the follow-up collector and register rows are what make an undecided item visible later. Removing them would leave the disposition only in a control event."
    }
  ],
  "followup": "Planner: the phrase is the only thing that invokes the reviewer, so it still depends on the operator remembering it. If reviews stay rare after this order, the next candidate is a register-thinness or elapsed-orders prompt at planning-pass entry — an observation that suggests a review, never a scheduler that runs one. Priority: medium.",
  "reopenWhen": "Two planning passes open with `planning: entropy reducer` and a review's findings are still carried to a later pass undecided, or the phrase goes unused for ten closed orders after this one merges."
}
```

## WO-151-D008

```json
{
  "id": "WO-151-D008",
  "date": "2026-09-22",
  "dispatch": "resume: next; Adjacent Repair on a defect this order introduced",
  "decision": "Give each launchpad its own frozen-copy lane under system-temp, keyed by a hash of the resolved repository path, and have the executable fixture sweep its launchpads' lanes in its outer finally. A dispatch abandoned mid-flight can then be swept without touching another checkout's live copy.",
  "evidence": [
    "Observed 2026-09-22 while the live review ran: 13 directories under the single shared lane os.tmpdir()/dotln-entropy, 12 of them fixture leftovers at 188 KB each and one the live copy at 257 MB, total 260 MB",
    "Cause: freezeSubject used one flat lane for every launchpad, and the fixture tests that deliberately end with a dispatch pending (the dirty-tree refusal, the moved-subject refusal, the rejected-return case) never reached discard or receipt, which are the only paths that remove a copy",
    "A frozen copy of this repository measures 257 MB (du -sh on the live dispatch's scratch parent), so a leaked dispatch is not a rounding error",
    "Executed 2026-09-22 after the fix: node scripts/test-entropy-review.mjs --fixtures-only reports 12 tests, 12 pass, 0 fail, and no new directory appears at the lane root; the 12 pre-fix leftovers were removed by hand and only the live dispatch's copy remains"
  ],
  "rejected": [
    {
      "option": "Sweep every review-* directory in the shared lane at the end of a fixture run",
      "reason": "It would delete a concurrent real dispatch's frozen copy, including the live row that was running while this was diagnosed."
    },
    {
      "option": "Leave it: the fixture copies are only 188 KB each",
      "reason": "The size is a property of the fixture repository, not of the mechanism. The same abandoned dispatch in a real checkout leaks 257 MB, and nothing bounded the count."
    },
    {
      "option": "Remove the copy whenever a dispatch is superseded",
      "reason": "A pending dispatch's copy is its retained evidence; the order requires it to survive until its receipt is filed or the operator discards it. The leak is the absence of a sweep, not the retention."
    }
  ],
  "reopenWhen": "A frozen copy is found outside a launchpad-keyed lane, or an abandoned dispatch's copy survives a fixture run."
}
```

## WO-151-D009

```json
{
  "id": "WO-151-D009",
  "date": "2026-09-22",
  "dispatch": "resume: next; criterion 3 met against the live row of criterion 7",
  "decision": "Make the subject guard route-conditional, following D002. On the default HEAD route the tree was clean at dispatch, so any tracked change refuses the receipt, exactly as criterion 3 states. On the explicit-commit route the subject is the named commit, which the working tree cannot move; the binding there is that the commit still resolves in both the repository and the frozen copy to the tree the review was performed against, and the working tree's own drift is recorded as trackedStatusByteIdentical false rather than refused.",
  "evidence": [
    "Observed 2026-09-22 at receipt time: the tracked-status hash moved from 358375d5 to e12b94d5 during the 993 s live episode, because this dispatch kept building the order while the reviewer ran. The reviewed subject, commit 5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e, did not move",
    "Under the strict guard the live row of criterion 7 is unobtainable by construction: the executor cannot hold its working tree still for a 993 s episode and also produce the order, and no DotLn rule lets it commit first",
    "The replacement binding is not weaker for what it guards: git rev-parse <baseCommit>^{tree} must resolve identically in the repository and in the frozen copy, which is what proves the receipt names the bytes the reviewer read",
    "Executed 2026-09-22: the fixture 'the explicit route binds the named commit, not the working tree' files a receipt across unrelated working-tree movement, records trackedStatusByteIdentical false, and still refuses when the commit can no longer be resolved from the frozen copy; suite 14 tests, 14 pass, 0 fail",
    "docs/instance/entropy-reducer/runs/REVIEW-002.json confinement: subjectBinding names the explicit route, trackedStatusBeforeSha256 and trackedStatusAfterSha256 are both recorded and differ, and trackedStatusByteIdentical is false"
  ],
  "rejected": [
    {
      "option": "Keep the strict guard and re-run the live row while holding the tree still",
      "reason": "It costs a second paid episode of about 993 s and USD 9.50 to produce the same finding set, and the session's own hooks write control-plane files during a dispatch, so the tree cannot be reliably held still anyway."
    },
    {
      "option": "Record trackedStatusByteIdentical as true because the subject did not move",
      "reason": "It would be false. The field means what it says; the receipt records the drift and names the binding that actually holds."
    },
    {
      "option": "Drop the tracked-status hashes from the explicit route entirely",
      "reason": "They are the evidence that says whether the working tree moved. Recording them is what makes the weaker guard honest rather than hidden."
    }
  ],
  "followup": "Verifier and reviewer: criterion 3's literal text — 'refuses a result whose tracked status after the episode differs from before' — is met on the default route and adapted on the explicit route this order introduced under D002. Judge the adaptation, not only the text. Priority: high.",
  "reopenWhen": "A receipt is filed whose reviewed commit cannot be resolved from its frozen copy, or the operator rules that the explicit route must also freeze the working tree."
}
```

## WO-151-D010

```json
{
  "id": "WO-151-D010",
  "date": "2026-09-22",
  "dispatch": "resume: next; accuracy defect observed in REVIEW-002's own cost line",
  "decision": "Never write `unknown` on a cost line beside a counter that was observed. The WO-140 cause code now names only what the harness did not expose, and every counter it did expose — wall clock, turns, dollars — is stated on the same line. REVIEW-002 keeps the line it was filed with, because a filed receipt and its rendering are immutable.",
  "evidence": [
    "docs/instance/entropy-reducer/runs/REVIEW-002.json cost: line reads 'unknown; cause harness-no-readback (episode wall clock 993 s, 64 turns)' while the same object records costUsd 9.497524499999999, turns 64 and source claude-result-envelope",
    "The transport's usage observation exposed a dollar total and turn count but no token total, so the cause code is correct for tokens and wrong as a description of the whole line",
    "CLAUDE.md: 'Never guess: an unobserved value is unknown' — and its converse, which this line broke",
    "Executed 2026-09-22 after the fix: suite 14 tests, 14 pass, 0 fail; npm run entropy -- check reports REVIEW-002 admitted with status ok, so the immutable pair still matches its projection"
  ],
  "rejected": [
    {
      "option": "Re-render REVIEW-002 with the corrected line",
      "reason": "The rendering is a projection of the JSON and both are bound by SHA-256 in the control log; rewriting either is exactly what the immutability check exists to catch."
    },
    {
      "option": "Discard REVIEW-002 and re-file it",
      "reason": "It burns a receipt number and a second paid episode to restate a figure the JSON already carries."
    },
    {
      "option": "Leave the line as filed and change nothing",
      "reason": "The next receipt would repeat the same misstatement."
    }
  ],
  "followup": "Verifier: REVIEW-002's rendered cost line says unknown where its JSON records USD 9.4975; the figure is in the receipt, the decisions and the executor's report. REFUTATION-002 and every later receipt carry the corrected form. Priority: low.",
  "reopenWhen": "A cost line names a cause code beside a counter the same object records."
}
```

## WO-151-D011

```json
{
  "id": "WO-151-D011",
  "date": "2026-09-22",
  "dispatch": "operator question during resume: next — whether REVIEW-002's findings enter the register or are regenerated by a planning: entropy reducer pass",
  "decision": "Add the read-only `npm run entropy -- subject` and make `planning: entropy reducer` open with it, so the pass consumes before it produces. A review already filed with a bound refutation and no disposition is the pass's subject; a fresh episode is paid for only when no such review exists. A pending dispatch is reported as work to finish rather than a reason to start another.",
  "evidence": [
    "The phrase as first written under D007 began unconditionally with `npm run entropy -- review`, so opening a pass would have paid for a second episode while REVIEW-002 sat filed, refuted and undisposed",
    "Measured on this order's own live row: an episode is 993.4 s and USD 9.4975 at the pinned actor, so an unnecessary one is not a rounding error",
    "REVIEW-002's four findings concern evidence volume and plan-check cost, neither of which merging this order changes, so a regenerated review would rediscover substantially the same findings under new identifiers and discard the refutation already bound to them",
    "The operator's D007 direction was explicitly against paying twice for one subject; consuming an existing review is the same principle applied to the review itself",
    "Executed 2026-09-22: the fixture 'a pass consumes an undisposed review before paying for another' walks all four states — nothing filed, dispatch pending, review without refutation, review with refutation — and asserts the action each returns; suite 15 tests, 15 pass, 0 fail",
    "Measured after regenerating the bundle: the planner root is 16,115 bytes in both generated roots against the 24,576 ceiling, verdict within"
  ],
  "rejected": [
    {
      "option": "Leave the phrase producing unconditionally and rely on the operator to notice",
      "reason": "It makes the expensive path the default and the cheap path the one that requires vigilance, which is how the reviewer went unused for 121 orders in the first place."
    },
    {
      "option": "Dispose REVIEW-002's findings in this dispatch so the register is populated",
      "reason": "Disposition is the operator's act; criterion 7 records it as a reopening observation and not a criterion, and under D007 it belongs inside a planning pass."
    },
    {
      "option": "Have `subject` launch the review itself when none is consumable",
      "reason": "A read-only command that spends USD 9.50 is a trap. It names the command; the pass runs it."
    },
    {
      "option": "Treat a partly disposed review as still consumable",
      "reason": "A pass that has begun disposing a review is that review's pass; re-offering it would reopen decisions the operator already recorded."
    }
  ],
  "reopenWhen": "A planning pass pays for a review while a refuted, undisposed one is filed, or `subject` names a review whose dispositions have begun."
}
```

## WO-151-D012

```json
{
  "id": "WO-151-D012",
  "date": "2026-09-22",
  "dispatch": "resume: verify; independent VER-001 finding against criterion 1",
  "decision": "Route the explicit-commit pending-dispatch overwrite to repair. A review already pending for a commit must remain reachable until receipt or discard; a later tracked-status hash for the same commit must not replace the sole current-review pointer. The verifier records the defect and does not edit implementation to turn its own verdict green.",
  "evidence": [
    "docs/work-orders/WO-151-entropy-reducer-dispatch.md criterion 1 requires a second review while a dispatch is pending for the same subject to be refused by path with the reason",
    "scripts/lib/entropy-review.mjs:255-285 implements one current-review pointer, while lines 886-890 refuse only when the open subjectHash equals the newly computed hash; subjectHash includes the tracked-status hash even on the explicit-commit route",
    "Independent 2026-09-22 reproduction in a physical system-temp Git fixture: dispatch review <HEAD commit> with src/a.mjs dirty; dirty src/b.mjs after the first dispatch; dispatch review <same HEAD commit> again. The second call returned normally with a different subjectHash and episode id, currentDispatch named the second episode, and the first scratch parent still existed",
    "scripts/test-entropy-review.mjs:359-380 retries the same commit without changing tracked status, so both calls have the same subjectHash and the fixture does not exercise the overwrite branch",
    "The first pending result can no longer be filed or discarded through the command family because receipt and discard both resolve only currentDispatch; its scratch copy is retained without a current pointer"
  ],
  "rejected": [
    {
      "option": "Treat the changed tracked-status hash as a different subject and pass criterion 1",
      "reason": "Both frozen copies contain the same named commit, and the host exposes only one current pointer. Even if the records are called different subjects, overwriting the only pointer loses the first retained dispatch, contradicting the command's recovery contract."
    },
    {
      "option": "Repair the pending-state implementation during verification",
      "reason": "A verifier must judge the current subject and never edit implementation to make its own verdict pass."
    },
    {
      "option": "NoOp",
      "reason": "A repeated command can strand a paid review result and its scratch copy. Refusing while any review is pending is smaller and safer than preserving multiple writable current pointers unless repair supplies a tested multi-dispatch design."
    }
  ],
  "followup": "Executor: make review dispatch admission preserve the existing pending result—prefer refusing any new review while current-review exists, or implement an explicitly addressable multi-dispatch set—and add a regression that changes tracked status between two explicit reviews of the same commit, asserting the first pointer and scratch remain recoverable. Priority: high.",
  "reopenWhen": "A regression demonstrates that a changed working-tree status cannot replace or orphan an existing review dispatch for the same named commit."
}
```

## WO-151-D013

```json
{
  "id": "WO-151-D013",
  "date": "2026-09-22",
  "dispatch": "resume: verify; independent VER-001 finding against criteria 6 and 8",
  "decision": "Route the stale WO-151 authority edition to repair. Revision 001 was minted before the final planner procedure and generated bundle bytes settled, so it does not describe the current subject and the document gate is red. Feedback evidence and artifact identity remain separately passing; this finding is limited to authority evidence and the suites blocked behind its preflight.",
  "evidence": [
    "node scripts/authority-evidence.mjs --check fails: stale WO-151 revision 001 evidence: bundle-diff.json",
    "The recorded planner-skill hash for both generated roots is sha256:02cfeccf158a34a8822f60610473539c40173bec338cf89c0a0c50324aba01f3, while the current generated files hash to sha256:e1bcbdb7af03e28ba60c549a32da2c01f9599c000f53cd0dfcf16f567082af79 after D011's consume-before-produce procedure; the current harness manifest also differs from the recorded edition",
    "npm run test:docs on 2026-09-22 reports 13 passed and 7 failed: authority-evidence fails and entropy, plan, plan-refutation-current, console-docs, skeleton-docs and lineage-fixtures are blocked by that preflight",
    "node scripts/feedback-evidence.mjs --check passes, node scripts/artifact-identity-evidence.mjs --check passes, node scripts/harness.mjs check passes all 31 generated surfaces, and npm run publication:check passes 274/274 headings; these checks bound the finding rather than masking it",
    "docs/work-orders/WO-151-entropy-reducer-dispatch.md criterion 8 requires the root package.json edit to re-mint the authority and feedback editions; criterion 6 requires entropy check to run in npm run test:docs"
  ],
  "rejected": [
    {
      "option": "Rely on the passing no-flag npm test",
      "reason": "That gate excludes the document-only authority preflight. The order separately requires current editions and the entropy document row, and the dedicated document gate reproduces the failure."
    },
    {
      "option": "Treat identity-only staleness as harmless",
      "reason": "The planner procedure and manifest are the shipped authority surface. A stale edition would let the criterion claim current generated bytes without binding them."
    },
    {
      "option": "Re-mint the edition during verification",
      "reason": "The current failure coexists with implementation findings and is not verifier-owned bookkeeping after a passing subject; repair must produce and verify the current edition."
    }
  ],
  "followup": "Executor: after all repair and planner-procedure bytes settle, mint the next immutable WO-151 authority revision, repoint the current selector if required, and run authority-evidence plus npm run test:docs to a fully passing result. Re-run the feedback check and live self-host only if its registered subject changes. Priority: high.",
  "reopenWhen": "The current generated authority bundle is bound by a new immutable WO-151 revision and npm run test:docs runs the entropy row with no preflight failure."
}
```

## WO-151-D014

```json
{
  "id": "WO-151-D014",
  "date": "2026-09-22",
  "dispatch": "resume: verify; independent VER-001 finding against criterion 7",
  "decision": "Route the live refutation's missing post-episode confinement evidence to repair. The explicit-commit adaptation in D009 gives REVIEW-002 an equivalent commit-tree binding despite tracked working-tree drift, but REFUTATION-002 records neither a post-episode tracked-status observation nor an after-inventory or scratch delta, so criterion 7's evidence for each episode is absent rather than adapted.",
  "evidence": [
    "docs/work-orders/WO-151-entropy-reducer-dispatch.md criterion 7 requires tracked status before and after each episode and the scratch delta inventoried",
    "docs/instance/entropy-reducer/runs/REFUTATION-002.json confinement contains only dependencies, commandExecution and permissionDenials; its subject carries the initial tracked-status and inventory values but there is no after value or delta",
    "scripts/lib/entropy-review.mjs:1365-1455 validates and files the refutation without calling trackedStatus or scratchInventory after the episode; lines 1428-1437 emit only the three confinement fields seen in the receipt",
    "The Claude refutation profile admits Bash and its prose explicitly says shell commands are instructed, not path-confined, so a post-episode inventory is material evidence rather than decorative metadata",
    "REVIEW-002 records trackedStatusByteIdentical false under D009's named-commit adaptation and records both scratch inventories with an 844-path delta; no corresponding evidence exists for REFUTATION-002"
  ],
  "rejected": [
    {
      "option": "Treat the initial subject inventory in REFUTATION-002 as both before and after",
      "reason": "It was captured before worker execution and establishes no post-episode state."
    },
    {
      "option": "Rely on zero permission denials",
      "reason": "A denied-tool count says whether requests were rejected, not which bytes changed inside the scratch copy or whether the original repository's tracked status moved."
    },
    {
      "option": "NoOp",
      "reason": "The refuter is intentionally allowed to execute commands, while Claude does not path-confine Bash. Omitting the after-observation defeats the live row's stated confinement witness."
    }
  ],
  "followup": "Executor: capture and bind post-refutation tracked status and scratch inventory/delta, render them in the immutable receipt, add a fixture that mutates the refutation scratch copy and proves the delta is recorded, and file a new live refutation receipt if the acceptance criterion still requires live evidence at the repaired shape. Priority: high.",
  "reopenWhen": "A refutation receipt produced by the repaired host records before/after subject binding and scratch inventory evidence, with an executable fixture covering the post-episode observation."
}
```

## WO-151-D015

```json
{
  "id": "WO-151-D015",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-001 finding 1; adjacent-0001",
  "decision": "Refuse a new review or refutation dispatch while any dispatch of that kind is pending, whatever subject it names, and run the check before the frozen copy is made. The refusal names the open episode, its subject prefix, its frozen copy and both recovery commands. The same guard covers the refutation route, which had no pending check at all.",
  "evidence": [
    "docs/verifications/WO-151/VER-001.md finding 1: a second explicit-commit review is admitted once the tracked-status hash moves, and writePending replaces the single current pointer, so the first paid episode and its frozen copy become unreachable through receipt or discard",
    "scripts/lib/entropy-review.mjs before the repair: the review admission compared open.subjectHash with the new subject hash, and beginEntropyRefutation performed no pending check before writePending at all; the refutation defect is adjacent to the reported one and was repaired in the same bounded change",
    "Executed 2026-09-22: node scripts/test-entropy-review.mjs --fixtures-only reports 15 tests, 15 pass, 0 fail with the new regression, which dirties a second tracked path between two reviews of one commit and asserts the first pointer, its frozen copy and its single pending record survive, that discard then releases that copy, and that the refused call made no second copy in the lane",
    "Negative control executed the same day: with the pre-repair admission restored in place the suite reports 14 pass, 1 fail on exactly that test, and the file was restored byte-identical afterwards",
    "The guard sits before freezeSubject, so a refusal no longer clones the about 250 MB frozen copy it would immediately abandon (WO-151-D008 measured that copy at 257 MB)"
  ],
  "rejected": [
    {
      "option": "Keep hash equality and make the pointer a set of addressable dispatches",
      "reason": "It is a larger design — addressing, selection, expiry and a second recovery command — for a state the operator has never needed. VER-001 named refusal as the smaller repair, and one pending dispatch at a time also keeps the paid-episode cost visible."
    },
    {
      "option": "Refuse only when the named commit matches, so a different commit may still be dispatched",
      "reason": "The pointer is single per kind regardless of subject, so a second dispatch for a different commit strands the first one exactly as a matching commit does."
    },
    {
      "option": "Leave the refutation route unguarded because VER-001 reported only the review",
      "reason": "It is the same single pointer and the same stranding, and the refutation route had no check at all. Adjacent Repair prefers the bounded fix over carrying a known defect into review."
    }
  ],
  "reopens": {
    "decisionId": "WO-151-D012",
    "observation": "The repair the follow-up named is implemented and its regression, with a negative control, is executed: a changed working-tree status can no longer replace or orphan an existing dispatch for the same named commit."
  },
  "reopenWhen": "A dispatch pointer is replaced while an episode is pending, or an operator reports that a single pending dispatch per kind blocks legitimate concurrent review work."
}
```

## WO-151-D016

```json
{
  "id": "WO-151-D016",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-001 finding 3; adjacent-0002",
  "decision": "Give the refutation receipt the review receipt's confinement shape: the source repository's tracked status captured at dispatch and recomputed at filing with its byte-identity, the frozen copy's inventory before and after, the delta, the excluded manifest paths and the denied-tool list, rendered in the Markdown projection and returned by the command. Drift is recorded rather than refused, because a refutation's subject is always the named commit the challenged receipt carries, which the working tree cannot move.",
  "evidence": [
    "docs/verifications/WO-151/VER-001.md finding 3: REFUTATION-002 confinement carries only dependencies, commandExecution and permissionDenials, and the filing code never called trackedStatus or scratchInventory after the episode",
    "docs/work-orders/WO-151-entropy-reducer-dispatch.md criterion 7 requires tracked status before and after each episode and the scratch delta inventoried; the refuter is the episode that is admitted to run commands, and Claude does not path-confine a shell command",
    "Executed 2026-09-22: node scripts/test-entropy-review.mjs --fixtures-only reports 16 tests, 16 pass, 0 fail, including a fixture that writes a file into the frozen copy between dispatch and filing and asserts a one-path delta, a recomputed after-inventory whose hash differs, byte-identical tracked status on an untouched repository, and a second filing whose source repository moved and is recorded as not byte-identical",
    "Negative control executed the same day: with the after-inventory suppressed the suite reports 15 pass, 1 fail on that fixture, and the file was restored byte-identical afterwards",
    "The rendering asserts equality with renderReceipt, so the new after-state travels in the immutable projection and not only in the JSON",
    "Observed and repaired inside this item: the first rendering change read the new confinement fields unconditionally, so npm run entropy -- check crashed on REFUTATION-002, which was filed before they existed. The line is now emitted only for a receipt that carries the observation, the check returns status ok with both live pairs bound and both 2026-09-04 pairs reported as pre-mechanism, and a fixture strips the new fields from a filed receipt and asserts the projection is still itself"
  ],
  "rejected": [
    {
      "option": "Treat the dispatch-time inventory as both before and after",
      "reason": "It was captured before the worker ran and establishes nothing about the episode. VER-001 rejected the same reading."
    },
    {
      "option": "Refuse a refutation whose tracked status moved",
      "reason": "The subject is the commit the review receipt names, and D009 already settled that a committed subject is bound by its tree rather than by a still working tree. A refusal there would make the live row unobtainable for the same reason D009 recorded, and it is a new behavior the finding did not ask for."
    },
    {
      "option": "Render the after-state unconditionally and re-render the earlier pair",
      "reason": "A filed pair's bytes are immutable and the check re-renders every receipt, so an unconditional line makes the gate fail on evidence that is correct for its date. The condition is one field test."
    },
    {
      "option": "Record a derived boolean for the inventory hash change",
      "reason": "Both inventory hashes are now in the receipt, so a reader compares them directly; a derived field would add a second thing to keep true."
    }
  ],
  "reopens": {
    "decisionId": "WO-151-D014",
    "observation": "The receipt shape the follow-up named is implemented and covered by an executable fixture; the live evidence at that shape is recorded separately in WO-151-D017."
  },
  "reopenWhen": "A refutation receipt is filed without an after-state observation, or the scratch delta is claimed for a frozen copy that no longer exists."
}
```

## WO-151-D017

```json
{
  "id": "WO-151-D017",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-001 finding 3, live half; adjacent-0003",
  "decision": "Run one more pinned-route refutation of the already filed REVIEW-002 and file it as REFUTATION-003, so the acceptance criterion's live confinement evidence exists at the repaired receipt shape. REFUTATION-002 keeps its bytes and stays the first live refutation; REFUTATION-003 is the one a planning pass reads, because the disposition path resolves the latest refutation for a review. No new review episode was bought: the subject is the review already filed.",
  "evidence": [
    "REFUTATION-002 is immutable and its frozen copy was removed at filing, so the missing after-state cannot be computed for it at any later time",
    "Executed 2026-09-22 through npm run entropy -- refute REVIEW-002 --transport claude-cli-print on claude-code 2.1.278: identity entropy-reducer@1, claude-fable-5-1 at max recorded as command-line-readback-and-invocation with effective values unknown, 458 s over 21 turns at USD 2.8989 (list), against REFUTATION-002's 627 s, 30 turns and USD 3.9675",
    "REFUTATION-003 confinement: trackedStatusBefore and trackedStatusAfter are both 349dc6df08f13eed and trackedStatusByteIdentical is true; the frozen copy was inventoried at 2,971 paths before and 3,811 after for a delta of 840, all of it build output; permissionDenials 0 with an empty denied-tool list",
    "The report records four measured subjects, a not-applicable by-inspection denominator, and four independently attempted survivors with reproductions and reasons; nothing was refuted, blocked or unselected, so the survivor set the next planning pass reads is unchanged",
    "npm run entropy -- check exits 0 with REVIEW-002, REFUTATION-002 and REFUTATION-003 bound, the two 2026-09-04 pairs reported as pre-mechanism and no interrupted filing; npm run entropy -- subject still returns consume for REVIEW-002 and now names REFUTATION-003",
    "The dispatch and the filing observed the same tracked-status hash the review receipt recorded as its after-value, so this episode's byte-identity is a fact about a still tree and not an artifact of the order's own edits"
  ],
  "rejected": [
    {
      "option": "Leave REFUTATION-002 as the live row and prove the repaired shape only by fixture",
      "reason": "The acceptance criterion asks for the tracked status before and after each live episode and an inventoried delta. A fixture proves the code records it; it does not produce the evidence for the episode that actually ran."
    },
    {
      "option": "Discard or re-render REFUTATION-002",
      "reason": "A filed pair and its projection are immutable and bound in the control log; rewriting either is what the immutability check exists to catch. The receipt number is cheap, the honesty is not."
    },
    {
      "option": "Re-run the whole cycle, review included",
      "reason": "The review receipt already carries its before-and-after evidence, and D011 settled that a filed, undisposed review is a subject rather than a reason to pay for another episode. That would have spent about USD 9.50 and 993 s to restate findings that did not change."
    }
  ],
  "correction": {
    "misread": "WO-151-D009's evidence line quotes the review episode's tracked-status hash as moving from 358375d5 to e12b94d5.",
    "meant": "REVIEW-002 records 358375d5 before and 349dc6df after. The value e12b94d5 is the same status hashed with the trailing newline git prints, which the host's own helper trims before hashing.",
    "changed": "Nothing in the filed receipt or in D009, which keeps its recorded bytes; this record states the receipt's values, and every hash quoted here is the host-computed one. The observation does not change D009's decision or its route-conditional guard."
  },
  "followup": "Met and not fixed: both live refuters returned their attempts payload as the public session statement rather than prose naming what they read and ran, so the statement adds no evidence the report does not already carry. The worker instruction asks for prose; the host records what is returned and truncates the rendering at 4,000 characters. A future order may either tighten that instruction or drop the separate statement for the refutation route, where the typed report already carries reasons and evidence references. Priority: low.",
  "reopenWhen": "A live refutation is filed whose confinement lacks the after-state, or a planning pass consumes a refutation that is not the latest one bound to its review."
}
```

## WO-151-D018

```json
{
  "id": "WO-151-D018",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-001 finding 2; adjacent-0004",
  "decision": "Mint WO-151 authority revision 002 after every other repair byte settled and repoint the current-evidence selector at it. Revision 001 keeps its bytes as the record of what was minted before the planner procedure and the generated bundle settled; it is superseded, not corrected. The same pass relocks the two publication editions whose linked source subtrees this repair edited and refreshes the decisions index.",
  "evidence": [
    "docs/verifications/WO-151/VER-001.md finding 2: the recorded planner-skill hash in revision 001 is sha256:02cfeccf while both current generated skills hash to sha256:e1bcbdb7, and npm run test:docs reported 13 passed and 7 failed with six rows blocked behind the authority preflight",
    "Executed 2026-09-22 in this order: node scripts/authority-evidence.mjs --write --edition WO-151 --revision 002 recorded 34 bundle comparisons, and --check against the repointed selector exits 0",
    "The registered authority sources are the compiler, kernel and skeleton sources and the root package manifests; this repair edited scripts/ and docs/ only, so the mint captures the same behavior source and settles the generated-surface hashes the earlier revision missed",
    "npm run test:docs now reports 20 passed, 0 failed, 20 fresh tasks with PASS entropy among them; before the mint the same command reported 12 passed and 8 failed, with publication and meta surfacing once the authority preflight stopped failing first",
    "The two publication editions went stale because this repair edited a linked product subtree; node scripts/check-publication.mjs --print-locks supplied the current bytes, both editions now report CURRENT with 30 and 45 linked source sections matching, and the index coverage stays 274/274",
    "npm run meta refreshed the decisions index after this repair's records; the process-health line reports no observed budget breach and no reopen candidate"
  ],
  "rejected": [
    {
      "option": "Rewrite revision 001 in place",
      "reason": "An evidence edition is immutable by construction: the writer only creates missing files, and the check compares recorded bytes. Overwriting it would erase the record of what the order bound before its role text settled."
    },
    {
      "option": "Mint the revision before the live refutation and the receipt repair",
      "reason": "The follow-up is explicit that the edition must be minted after the repair bytes settle, and a second mid-repair mint would repeat exactly the staleness this finding reports."
    },
    {
      "option": "Update the publication locks without rereading what changed",
      "reason": "The lock is the freshness authority for the linked subtrees. The edited sentence was checked first: it states the same confinement the repair implements, now naming both episodes and the inventory rather than only the review's tracked-status hash."
    }
  ],
  "reopens": {
    "decisionId": "WO-151-D013",
    "observation": "The current generated authority bundle is bound by an immutable WO-151 revision 002, and the document gate runs the entropy row with no preflight failure: 20 passed, 0 failed."
  },
  "reopenWhen": "An authority check reports stale evidence for the selected edition, or a document row is blocked behind a preflight failure at handoff."
}
```

## Recorded limits and known issues

- **Effective readback stays unknown.** No harness reports the model or effort a
  session actually ran. Every receipt records `effectiveModel` and
  `effectiveEffort` as `unknown` and labels the recorded values by their source:
  `command-line-readback-and-invocation` for a launched route, `session-attested`
  for a background worker, `operator-attested` when the operator supplies an
  effort. An operator attestation on the background route records the effort but
  does not make the reviewer pinned, because criterion 2 and the order's design
  both bind the pinned identity to readback.
- **The live row against REVIEW-001 (planning map Receipt 024, second known
  issue).** `REVIEW-002` ran the pinned route at `claude-fable-5-1`/`max` on
  claude-code 2.1.278 and its identity line reads `entropy-reducer@1`, so the
  live row is the pinned route and not a substitute. Its
  `confinement.commandExecution` names the `--restricted` profile that stood in
  for REVIEW-001's `restricted: true` flag, `confinement.permissionDenials` is
  **0** with an empty `deniedTools` list against REVIEW-001's **7** denied shell
  calls, and `findingSummary` records **4 findings, 4 measured, 0 by
  inspection** against REVIEW-001's **1 measured of 7**. The Cost line's
  expected benefit — a reviewer that can run commands in the scratch copy — is
  therefore measured, not expected. The episode ran 993.4 s over 64 turns at
  USD 9.4975 (list), against REVIEW-001's 1,019.6 s, 98 turns and USD 10.52.
  Token totals are unknown with cause `harness-no-readback`. The scratch delta
  was 844 paths, all build output, and the by-inspection denominator was
  `not-applicable`, which is the zero-denominator branch exercised live.

- **The blinded refutation of the live row.** `REFUTATION-002` ran the pinned
  route and its identity line also reads `entropy-reducer@1`. The episode ran
  626.9 s over 30 turns at USD 3.9675 (list), against REFUTATION-001's 745.9 s,
  54 turns and USD 6.22; the full live cycle cost 1,620.3 s and USD 13.4650
  against the order's estimate of about 29 minutes and USD 17 from the one
  prior observation. The measured denominator was 4 and
  `selected`; the by-inspection denominator was 0 and `not-applicable`, so the
  zero-denominator branch was exercised live rather than only in the fixture.
  All four findings survived; none was refuted, blocked or unselected. The
  refuter received only the four typed `{ findingId, command }` subjects.
  `npm run entropy -- check` admits both live pairs, reports `REVIEW-001` and
  `REFUTATION-001` as pre-mechanism, and returns `status: "ok"` with no
  interrupted filing. `npm run entropy -- subject` returns `consume` naming
  `REVIEW-002`, which is what the next `planning: entropy reducer` pass reads.

- **Dispositions are not this dispatch's to make.** Criterion 7 records the
  operator's dispositions as the reopening observation and not a criterion, and
  D007 puts them inside a planning pass. This order files both live receipts
  and disposes nothing: `dispositions` and `packets` are both 0 in the check,
  and the four surviving findings and three proposal packets
  (`content-addressed-evidence-inputs`,
  `behavioral-staleness-key-for-evidence-editions` and
  `cold-start-trend-and-single-source-floor`) wait as a subject, not a queue.

- **A third live receipt, filed during repair.** `REFUTATION-003` re-runs the
  blinded refutation of `REVIEW-002` through the pinned route at the repaired
  receipt shape, because `REFUTATION-002`'s bytes are immutable and its missing
  after-state cannot be added to it (D017). It ran 458 s over 21 turns at
  USD 2.8989, recorded identity `entropy-reducer@1`, tracked status
  byte-identical on either side, an 840-path scratch delta and zero denied tool
  calls, and all four findings survived again. `npm run entropy -- subject`
  still returns `consume` for `REVIEW-002` and now names `REFUTATION-003`,
  which is the refutation a `planning: entropy reducer` pass reads. The full
  live evidence for this order is therefore one review and two refutations,
  costing 2,078.7 s and USD 16.3639 in total.

- **The gate step count.** The suite table grew by exactly one row, the `entropy`
  document check; the executable fixture runs inside the existing
  `plan-refutation` suite and adds no step. The next measured `gateStepCount`
  should therefore read one above the comparable prior run — 77 against WO-149's
  76, in a drift signal reading 68, 72, 68, 72, 76 across the last five rows
  (`docs/planning/cost-table.json`). The five manual host steps in the operator
  guide are retained as the recorded fallback and are counted as retained, not
  removed.

## WO-151-D019

<!-- integration refs/dotln/checkpoint/WO-151/10 -->

```json
{
  "id": "WO-151-D019",
  "date": "2026-09-22",
  "dispatch": "resume: final review; worktree integrate WO-151",
  "decision": "Integrate main at 48322e9a (WO-152 merged and v0.41.1 staged) as a fast-forward before judging anything, and resolve the four authored collisions in favour of this order's higher component version: skeleton 0.36.0 over the upstream 0.35.1 in both package manifests and both lockfile locations, the console's exact pin following it, and the current-evidence selector staying on WO-151 authority revision 002 and feedback revision 001. Retime the roadmap's release record to name the v0.41.1 tag this review integrated; the v0.42.0 assignment does not move, because the next minor above v0.41.1 is still v0.42.0. No acceptance claim is carried across the moved base: every gate and check reported in FINAL-001 was executed after the integration.",
  "evidence": [
    "refs/dotln/checkpoint/WO-151/10; retained stash 851ca543a4bf934cb04ff5b2c3e76c10b932f790 (WO-151 integrate 2026-09-22); base 5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e; upstream 48322e9a2f9a566f158b2b185baca37d3741be59",
    "The four authored collisions are version collisions only: WO-152 staged v0.41.1 with skeleton 0.35.1 for a mission-check schema change, and this order stages v0.42.0 with skeleton 0.36.0 for two new request kinds. 0.36.0 is the higher version and already carries the upstream change, so no upstream behaviour is dropped and no version is invented",
    "The two edition selectors collide because WO-152 re-minted both editions at its own identity. Executed after the integration: node scripts/authority-evidence.mjs --check exits 0 over 34 bundle comparisons against WO-151 revision 002, and node scripts/feedback-evidence.mjs --check exits 0 over ten passing regressions and ten removal failures. Neither edition is stale against the integrated bundle, so keeping this order's selection is a fact rather than a preference; WO-152's editions keep their bytes and remain readable",
    "Changed evidence inputs assessed: main moved packages/skeleton/src/mission-check-protocol.ts, its fixture and test, and the console self-host fixtures. None is an input to this order's entropy protocol, dispatch host, receipts or loadout; the two suites that consume them are selected and green in the recorded product gate",
    "docs/product/06-roadmap.md before this review named the staged v0.41.0 as the baseline. git tag --sort=-v:refname now reports v0.41.1 as the newest local tag, so the sentence was retimed to it under the existing minor classification"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Take the upstream skeleton 0.35.1 and renumber this order's bump",
      "reason": "It would publish two new request kinds under a patch version and contradict the order's recorded minor classification. 0.36.0 is above 0.35.1 and contains it."
    },
    {
      "option": "Keep WO-152's edition selection because it is the newer merge",
      "reason": "The selector names the edition that describes the current bundle, not the most recent merge. This order's revision 002 checks clean against the integrated bundle; leaving WO-152 selected would claim a bundle description that was minted before these bytes existed."
    },
    {
      "option": "Re-mint a WO-151 authority revision 003 for the integrated bytes",
      "reason": "Revision 002 checks clean against the integrated bundle, so a third revision would record no new observation. D018 already settled that an edition is minted after bytes settle, not on a schedule."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-22. Original base: `5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e`.
Fetched main: `48322e9a2f9a566f158b2b185baca37d3741be59`. Checkpoint: `refs/dotln/checkpoint/WO-151/10`.
Named stash retained: `851ca543a4bf934cb04ff5b2c3e76c10b932f790` (WO-151 integrate 2026-09-22).
Resolved projections: README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/work-orders/README.md.
Release preparation: WO-151 target v0.42.0 remains current; no files changed.
Tag observation: local snapshot only..
Carried-forward claims: completed by this review. No verification verdict is inherited across the moved base; VER-002's criteria were re-judged against the integrated tree and every gate and check named in FINAL-001 ran after the integration.
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks executed after the integration: `npm test -- --review`, `npm run publication:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local`; results are recorded in FINAL-001.

## WO-151-D020

```json
{
  "id": "WO-151-D020",
  "date": "2026-09-22",
  "dispatch": "resume: final review; defect met and not fixed",
  "decision": "Record, and do not repair here, that the episode confinement witness is coarser than the receipt's own wording. `trackedStatus()` runs `git status --porcelain --untracked-files=no`, so a shell command that creates a new untracked file in the source repository, or edits an ignored one, leaves `trackedStatusByteIdentical` true; and `scratchDelta.deltaCount` is `Math.abs(after.count - before.count)`, a net path count, so a frozen copy that gains and loses the same number of paths reads as a zero delta. Both inventory hashes and both status hashes are in the receipt, so the evidence a reader needs is recorded; it is the summary line that overstates what was checked. The follow-up names the repair; nothing in this order's acceptance criteria depends on the finer witness.",
  "evidence": [
    "scripts/lib/entropy-review.mjs:145 — trackedStatus passes --untracked-files=no; the receipt's confinement.commandExecution string reads 'shell commands instructed to stay inside it and checked by the tracked-status hash on either side of the episode'",
    "scripts/lib/entropy-review.mjs:1160-1172 and 1477-1489 — scratchDelta.deltaCount is Math.abs(after.count - before.count) for both the review and the refutation receipt; scratchInventory hashes path and size only, never content",
    "docs/AI-HARNESS-SECURITY.md §Entropy Reducer launch line states the same witness in the same terms: 'the host records the subject's tracked-status hash and the frozen copy's inventory before and after each episode'",
    "The recorded live episodes are unaffected as evidence: REVIEW-002 and REFUTATION-003 each record both inventory hashes and both status hashes, and REFUTATION-003's before and after tracked-status hashes are byte-identical at 349dc6df08f13eed with a monotonic 2,971 to 3,811 path inventory whose growth is build output"
  ],
  "rejected": [
    {
      "option": "Widen trackedStatus to include untracked paths in this review",
      "reason": "The default clean-HEAD route refuses a receipt whose tracked status moved. A dispatching session writes untracked, non-ignored evidence files throughout an episode — this order's own executor did — so widening the witness would make the default route refuse its own receipts. The trade belongs to a decision about what the subject is, not to a reviewer's bounded cleanup."
    },
    {
      "option": "Replace deltaCount with a changed-path set now",
      "reason": "Three receipts are already filed at this shape and their renderings are bound by SHA-256. D016 recorded that an unconditional new field makes `entropy check` fail on receipts that are correct for their date, so the change needs a second conditional field and its own fixture — beyond the boy-scout bound at final review, and with no acceptance criterion depending on it."
    },
    {
      "option": "Soften the receipt's wording instead of the witness",
      "reason": "It would edit the immutable projection of three filed receipts. The wording is generated from the filing code, so correcting it is the same change as correcting the witness."
    }
  ],
  "followup": "Executor: make the confinement witness match what the receipt claims. Either narrow the claim — say the witness observes tracked-path status and the frozen copy's path-and-size inventory — or widen it: add an untracked-path observation to the source-repository witness with a subject rule that survives a dispatching session's own writes, and record the scratch delta as added/removed path sets rather than a net count, behind the same conditional-rendering rule D016 established. Priority: low.",
  "reopenWhen": "A receipt reports a zero scratch delta for a frozen copy whose inventory hash moved, or an episode is observed writing into the source repository without moving its tracked status."
}
```

## WO-151-D021

```json
{
  "id": "WO-151-D021",
  "date": "2026-09-22",
  "dispatch": "resume: final review; two product-gate failures met on the integrated, staged subject; Adjacent Repair",
  "decision": "Register this order's two new shared-check inputs and re-gate, rather than routing two one-line registry additions through a repair cycle. `docs/control/entropy-reducer.jsonl` is declared in the kernel's committed-JSONL protocol registry as `Entropy Reducer receipt control`, beside the planning refutation control log it mirrors; and `entropy.mjs` joins the stub script list the runner's own CLI-selection fixture writes before it runs the document gate in a temporary launchpad. Neither touches the dispatch host, the loadout, a receipt or any acceptance behaviour; both are the registration a new committed artifact and a new document suite owe to checks that enumerate them.",
  "evidence": [
    "Executed 2026-09-22 after integration with every intended file staged: npm test -- --review reported 32 passed, 2 failed, 460.01 s, 78 fresh tasks. kernel test 89 'WO-045 committed EventEnvelope streams decode and round-trip byte-identically' failed because git ls-files now lists docs/control/entropy-reducer.jsonl, whose EntropyReviewFiled events are not EventEnvelopes and which no registry classified; runner-fixtures test 25 failed 1 !== 0 at scripts/test-runner.test.mjs:663 because its fixture launchpad writes a stub for every document-suite script and had none for scripts/entropy.mjs, so the nested gate reported 19 passed, 1 failed with an entropy module-resolution crash",
    "Both failures were invisible to every earlier gate for a stated reason, not by luck: the control log was untracked during the executor's and verifier's runs, so git ls-files did not list it, and runner-fixtures is not selected by the source set those runs changed. VER-002's criterion 9 evidence (npm test, 25 passed) is therefore true of what it ran and does not bind these two suites",
    "packages/kernel/test/fixtures/jsonl-protocols.json already carries docs/control/resume.jsonl and docs/control/plan-refutations.jsonl as non-event protocols and a controlSegmentPattern for docs/control/orders/WO-NNN.jsonl; the new row is the same classification for the same kind of file",
    "Executed 2026-09-22 after the registrations: node --test packages/kernel/dist/test/store-history.test.js passes 1/1, and node --test --test-name-pattern 'only and document CLI selection' scripts/test-runner.test.mjs passes with its nested document gate at 20 passed, 0 failed",
    "Direct checks on this repository are unchanged by the registrations: npm run entropy -- check returns status ok with REVIEW-002, REFUTATION-002 and REFUTATION-003 bound and the two 2026-09-04 pairs pre-mechanism, and npm run test:docs reports 20 passed, 0 failed with PASS entropy"
  ],
  "rejected": [
    {
      "option": "Fail the review and route both to repair",
      "reason": "The defects are two registry rows in shared checks, inside the bounded adjacent-repair allowance, with a directly observed before-and-after. A repair cycle and a fresh verification would spend two dispatches to add one JSON row and one string, and the reviewer's own re-gate is the same evidence a verifier would produce."
    },
    {
      "option": "Exempt the entropy control log from the kernel registry by widening controlSegmentPattern",
      "reason": "The pattern names per-order control segments. Widening it to admit any docs/control/*.jsonl would stop the check noticing the next unclassified committed stream, which is the whole point of the registry."
    },
    {
      "option": "Drop the entropy row from the document gate so the runner fixture needs no stub",
      "reason": "Criterion 6 requires entropy check to run in npm run test:docs. The fixture, not the suite, is what was out of date."
    },
    {
      "option": "Record them as met-and-not-fixed with a follow-up",
      "reason": "Criterion 9 requires a green npm test. A red product gate is not a boarded-up observation; it is the gate."
    }
  ],
  "followup": "Planner: both defects are the same shape — a new committed artifact or a new suite owes a registration to a check that enumerates them, and nothing fails until the artifact is tracked or the enumerating suite is selected. A cheap guard would be a document-gate row asserting that every committed .jsonl under docs/ is either an EventEnvelope stream or a classified protocol, and that every suite with a script has a stub in the runner fixture. Priority: low.",
  "reopenWhen": "A committed JSONL stream appears that no registry classifies, or a document suite is added whose script the runner's CLI-selection fixture does not stub."
}
```
