# WO-217 decisions

## WO-217-D001

```json
{
  "id": "WO-217-D001",
  "date": "2026-10-21",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.89.0, the next minor above the observed release baseline v0.88.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.88.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-217-boarded-follow-ups-the-gate.md",
    "The operator's resume: next executes WO-217, whose filed Release classification explicitly assigns classification at activation and requires minor when a fix changes a refusal. The assignment changes no criterion or scope.",
    "The first document gate after preparation refused plan-refutation-current and plan with existing work-order bytes changed. Bind this authorized activation assignment with plan amend-order before measuring the baseline."
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-217-D002

```json
{
  "id": "WO-217-D002",
  "date": "2026-10-21",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "Include the ten additional pending rows reported by followups --touching in WO-217, with the same disposition, paired-control and write-back duties as the original 39 rows. The operator authorized this bounded expansion after the scope conflict was identified.",
  "evidence": [
    "Operator instruction in this session: just do the extra work. the whole point is to not kick the can",
    "npm run plan -- followups --touching at register revision a9564365d8dd4cfcdb65f1fc0d1a15bda242c0598b19c44ad75b00a5cde4819c reports ten additional pending rows; both pages were read.",
    "FUP-fa028783f3f6b17f: Meter and closeout residue.",
    "FUP-3d6a8147368bdf1c: A gate marker with no birth observation never expires.",
    "FUP-2518166a22767f47: Gate suites inherit DOTLN_LAUNCHPAD from the invoking environment.",
    "FUP-b202062fc3cbbbd7: A copied gate record carries an absolute read-log path.",
    "FUP-d40313eade76b8af: A stale gate marker revived by a reused process id.",
    "FUP-182984d482ca59ca: Measured claims: a judge-owned instrument, a symmetric baseline, per-component movement and the cold first-call row.",
    "FUP-a8cba0428eaf01a9: A final-review packet never names an override as an option.",
    "FUP-9cfc2253779e6c92: A retained log for a failed complete run.",
    "FUP-5f948dcc52e03082: WO-223-D018: The next order that edits scripts/lib/contributions.mjs. Name the declaration route in the FAIL line only when the instance declares no contributions.operatorAuthor, as the start\u2026",
    "FUP-e2152db6dd056b4a: WO-223-D020: The next order that edits start or startTargetWorktree in scripts/worktree.mjs. Print the same one-line sign-off advisory after startTargetWorktree creates the launchpad worktree when\u2026",
    "Expand Preflight to name sync-fixtures, worktree, target-worktree and license-fixtures so each authorized row's regression runs under a declared handoff suite; add the maintained gate architecture as a read input."
  ],
  "rejected": [
    {
      "option": "Leave the matching candidate rows for a future planning pass",
      "reason": "The operator explicitly directed completion of the extra work in this order."
    }
  ],
  "reopenWhen": "New operator direction changes the authorized expansion or independent review finds a substantive row missing."
}
```

## WO-217-D003

```json
{
  "id": "WO-217-D003",
  "date": "2026-10-21",
  "dispatch": "resume: next; apply WO-217-D002",
  "decision": "Resolve FUP-a8cba0428eaf01a9 by making every reviewer operator-packet option safe within ordinary authority and requiring a safe default. Override remains operator recovery, not a review option. Create wo217-role-baseline.json linked to the unchanged wo218 oracle; preserve every historical snapshot.",
  "evidence": [
    "The expanded row names a sentence in the reviewer profile as its repair. packages/skeleton/src/loadouts/contributor.ts supplies that procedure; generated skills follow it.",
    "scripts/test-gate-followups.mjs: reviewer packets carry an ordinary-authority safe default; named bounded probe passed 2026-10-21T02:33:42Z.",
    "scripts/test-process-debt.mjs: current role oracle now follows wo217 -> wo218 -> wo221 and retains the upstream wo185 chain; repair-controls.json records the reviewer-packet control, positive exit 0 and reverted exit 1."
  ],
  "rejected": [
    {
      "option": "Leave the packet rule dependent on a second occurrence",
      "reason": "The operator authorized the extra work, and a review packet should never require suspending gates to be a viable option."
    },
    {
      "option": "Rewrite an existing role snapshot",
      "reason": "A new linked oracle preserves historical judgments and both economy support settings."
    }
  ],
  "reopenWhen": "An independently reviewed packet needs an option unavailable under ordinary authority, or the generated procedure fails to retain the safe-default instruction."
}
```

## WO-217-D060

```json
{
  "id": "WO-217-D060",
  "date": "2026-10-21",
  "dispatch": "resume: next; apply WO-217-D002",
  "decision": "Complete the four additional pending changed-file matches under the operator’s existing direction to do the extra work. The batch now contains 53 rows. Add release to Preflight for PR draft ownership, and bind the added suite declarations and architecture input. Authorize the planner clarification and refresh the new WO-217 role oracle while preserving all historical snapshots.",
  "evidence": [
    "Operator instruction: just do the extra work. the whole point is to not kick the can",
    "followups --touching at revision a9564365d8dd4cfcdb65f1fc0d1a15bda242c0598b19c44ad75b00a5cde4819c: fourteen pending matches after the additional code and product-guide write-backs.",
    "FUP-f1c7a256bec46737: WO-054-D006: Raise the executor cold-start ceiling from 20,480 to 24,576 bytes and release-close from 12,288 to 16,384 bytes; record the measured rule growth and leave efficiency redesign for the oper",
    "FUP-da505c82f2262b8e: A second sign-off-exempt author identity.",
    "FUP-ec72b2ea596bdc75: The planner's sentence on repairs after a judgment.",
    "FUP-6c4cc63ae71d02ad: WO-223-D017: The next order that edits releaseCloseAdmission in packages/skeleton/src/harness-host.ts (WO-219 edits that file at its step 19). Classify a withheld suffix after removing the canonical…"
  ],
  "rejected": [
    {
      "option": "Leave four matching rows pending because the first expansion listed only ten",
      "reason": "The operator’s instruction was to finish the extra work; all four receive the existing terminal-disposition and evidence duties, with no acceptance criterion relaxed."
    }
  ],
  "reopenWhen": "New operator direction changes scope or independent evidence identifies a missing matching row."
}
```


## WO-217-D061

```json
{
  "id": "WO-217-D061",
  "date": "2026-10-21",
  "dispatch": "resume: next; operator direction",
  "decision": "Perform a bounded role-efficiency pass that shortens repeated wording while preserving every duty, command, exception, authority limit and ceiling. Keep the single instance-declared sign-off-exempt author; decline a second exemption. Preserve historical role oracles and record a new current oracle.",
  "evidence": [
    "Operator asked why the efficiency redesign was not recommended. The explained recommended option was a bounded pass preserving every reviewed duty and all ceilings, plus keeping one sign-off-exempt author.",
    "Operator response: yea do the recommended",
    "Pre-efficiency generated executor cold start is 29,213 bytes; reviewer is 29,005 after the authorized packet sentence. The unchanged executor ceiling is 29,246; reviewer ceiling is 28,884.",
    "role-wording.json records each before/after paragraph; role-efficiency.json records generated startup UTF-8 bytes in both skill roots. Independent workers review obligation preservation; no total-token or elapsed-time gain is inferred."
  ],
  "rejected": [
    {
      "option": "Raise ceilings or remove a reviewed duty",
      "reason": "The operator chose a bounded equivalent-duty pass, not relaxed requirements."
    },
    {
      "option": "Change contribution exemptions as part of shortening role text",
      "reason": "The operator chose to retain one exempt author."
    }
  ],
  "reopenWhen": "A shortened instruction loses a duty or changes authority, a new measured ceiling breach occurs, or the operator chooses a different contribution policy."
}
```


## WO-217-D062

```json
{
  "id": "WO-217-D062",
  "date": "2026-10-21",
  "dispatch": "resume: next; operator direction",
  "decision": "Repair all four independently reproduced temporary-attack findings within the gate-evidence and observation rows. Completion and direct lookup validate own task results and explicit suite coverage; duration observation requires a whole command boundary and a nonnegative duration. Retain the documented legacy empty-claim compatibility.",
  "evidence": [
    "Operator instruction: have a subagent come up with temp attacking probes that verification and final review do and test them out",
    "The reused criteria worker ran 64 distinct cases: 21 evidence/copy cases, 13 identity/duration cases and 30 lease/capacity cases. Twelve counterexample cases represent four distinct findings; all thirty lease/capacity cases passed.",
    "Temporary gate attack: completion accepted malformed own results; both selectors accepted an explicit timeline missing declared suites. Temporary hedge attack: pnpm test and xnpm test borrowed npm test duration; a damaged negative-duration row produced -1 ms.",
    "The guarded three-case regression command passed at 2026-10-21T03:15:06.362Z: scripts/test-gate-followups.mjs gate lookup and bounded role wording; scripts/test-observed-facts.mjs longest gate identity. The independent worker replays its temporary scripts after the fixes."
  ],
  "rejected": [
    {
      "option": "Treat passing direct lookup as proof that completion also validates the row",
      "reason": "The executed attack demonstrated different outcomes from the two selectors."
    },
    {
      "option": "Discard legacy empty-claim rows while fixing explicit incomplete declarations",
      "reason": "The existing runner fixture documents that a row with no suite declaration covers only an empty claim. Named selections still require declared and witnessed suites."
    }
  ],
  "reopenWhen": "Either selector accepts a failed or malformed execution, explicit suite coverage is absent, or a distinct command/invalid duration supplies an observation."
}
```


## WO-217-D063

```json
{
  "id": "WO-217-D063",
  "date": "2026-10-21",
  "dispatch": "resume: next; apply WO-217-D002",
  "decision": "Include the final two pending matches exposed by filing the register and repair-controls evidence. The batch now has 55 rows under unchanged criteria. Apply the operator’s standing instruction to finish the extra work, and preserve all immutable evidence.",
  "evidence": [
    "Operator instruction: just do the extra work. the whole point is to not kick the can",
    "followups --touching after the first 53 dispositions at revision bc138a4d8adc465e914a2b32be39e10181ad068a6c29ac4262d03a337106d79a names FUP-4b70089b028849f0 via docs/planning/followups.json and FUP-8a4e201d861208ad via repair-controls.json, beside the already adjudicated absolute-containment packet.",
    "Read the full ER5-002 entry in REVIEW-005, work-order-map candidate 15 and both complete disposition histories from the activation export. Inspect the existing Codex session-selection source and tests."
  ],
  "rejected": [
    {
      "option": "Ignore pending-at-activation rows because only bookkeeping files matched them",
      "reason": "Criterion 4 explicitly includes the default changed-file query, and the operator directed completion of the extra work."
    }
  ],
  "reopenWhen": "Independent review finds a missing row or new operator direction changes the scope."
}
```

## WO-217-D064

```json
{
  "id": "WO-217-D064",
  "date": "2026-10-21",
  "dispatch": "resume: next; classified component preparation",
  "decision": "Bump @dotln/skeleton from 0.63.1 to 0.64.0 for changed gate/refusal behavior and @dotln/console from 0.4.3 to 0.4.4 for the compatible transport-diagnostic repair. Update the console exact workspace dependency and corresponding lockfile entries. Keep the application target v0.89.0. Shrink the comment fingerprint baseline after removal of an obsolete order-labelled comment.",
  "evidence": [
    "npm run sync reported changed component sources without a bump against v0.88.0; release prepare --local prepares the application surfaces but deliberately does not choose component versions.",
    "packages/skeleton/src/gate-evidence.mjs tightens malformed and displaced gate evidence acceptance; packages/console/src/console-client.ts prevents private error text from escaping while retaining safe diagnostic codes.",
    "The baseline-fingerprints check named one removed observed-facts.ts comment. node scripts/comment-labels.mjs --write is the supported shrink route; it grants no new historical exceptions."
  ],
  "rejected": [
    {
      "option": "Leave both component versions unchanged",
      "reason": "Changed source must have its own compatibility classification; the application version alone does not discharge this release requirement."
    },
    {
      "option": "Change unrelated components or dependencies",
      "reason": "No other component source changed and no new dependency is needed."
    }
  ],
  "reopenWhen": "A later source change changes compatibility or the release baseline moves before integration."
}
```


## WO-217-D065

```json
{
  "id": "WO-217-D065",
  "date": "2026-10-21",
  "dispatch": "resume: next; apply WO-217-D002",
  "decision": "Include FUP-ea83176e777dd32f, the pending-at-activation match exposed by regenerated skill files, under the operator’s standing instruction to finish the extra work. The batch has 56 rows with unchanged criteria. Add explicit Agent Skills format declarations and generated-frontmatter validation, and document pinned target skills as convention inputs without effect authority. Bump @dotln/compiler 0.28.0 to 0.29.0 for the new profile requirement; update its exact workspace pins.",
  "evidence": [
    "Operator instruction: just do the extra work. the whole point is to not kick the can",
    "The final changed-file query at register revision 421414a6a7414e55cf316d03e3aee7e32765b6bd7adc4a3e2bc877ac54276b59 newly matched the generated .agents and .claude skill roots. The activation export records this row deferred at source revision 1.",
    "Read the full work-order-map candidate 11 (returns from ideation on 2026-10-16), docs/repositories/README.md, product 03 Agent enablement skills, compiler harness source/tests and the official Agent Skills specification at https://agentskills.io/specification (observed 2026-10-21).",
    "scripts/test-gate-followups.mjs native Agent Skills profiles case runs under the already declared process-debt suite. It checks all profile declarations, missing/unknown formats, actual generated frontmatter, length/syntax boundaries, and pinned no-authority repository guidance."
  ],
  "rejected": [
    {
      "option": "Ignore the newly matched pending row or claim the runtime already declares the format",
      "reason": "The final query makes the row part of the operator-authorized extra work; the source had roots and availability but no format declaration or frontmatter length checks."
    },
    {
      "option": "Add an arbitrary external YAML parser, automatic target-skill installation, or skill-derived effect grants",
      "reason": "The row calls for convention inputs and conformance of generated native skills. The existing two-field emitter can validate its subset without new dependencies or authority."
    }
  ],
  "reopenWhen": "A generated skill violates the declared format, a target profile fails to pin its convention inputs, or independent evidence shows the implementation changes authority."
}
```

## WO-217-D067

```json
{
  "id": "WO-217-D067",
  "date": "2026-10-21",
  "dispatch": "resume: next; apply WO-217-D002",
  "decision": "Include the two pending-at-activation matches FUP-441469088613e52a and FUP-adf6621e7f958dd8 under the standing instruction to finish the extra work. The batch has 58 rows with unchanged criteria. Complete the authority transcript reference repair and explicitly decline the unsupported absence experiment with its reopening conditions.",
  "evidence": [
    "Operator instruction on 2026-10-21: just do the extra work. the whole point is to not kick the can",
    "The post-skill followups --touching query reported these two rows and the original allocated descendant-ownership packet. Both added rows were pending in the activation export.",
    "Full source and register history read: docs/planning/full-absence-curve-experiment-2026-09-24.md; docs/planning/entropy-reviews/REVIEW-004.md ER4-006.",
    "New implementation inputs: packages/skeleton/src/evidence-editions.mjs; scripts/authority-evidence.mjs; scripts/test-sync.mjs; current actor-catalog and ResidentHost portfolio binding."
  ],
  "rejected": [
    {
      "option": "Leave the two matched rows pending",
      "reason": "The operator explicitly directed completion of the extra work and criterion 4 covers pending-at-activation changed-file matches."
    },
    {
      "option": "Prune historical evidence or claim the absence curve is measured",
      "reason": "Immutable old evidence must remain readable, and the current source provides neither a comparative absence experiment nor evidence of its benefit."
    }
  ],
  "reopenWhen": "A later changed-file query exposes another pending-at-activation row, or an independent review finds that this bounded scope cannot satisfy the unchanged criteria."
}
```

## WO-217-D070

```json
{
  "id": "WO-217-D070",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-gate repair",
  "kind": "correction",
  "decision": "Declare the three newly imported machinery inputs that the first fresh complete review refused, preserve that failed run and require a fresh complete run after repair.",
  "misread": "The new imports were covered by their targeted fixture runs, but their suite source declarations were incomplete. The first full run did not execute the product suites.",
  "meant": "Every direct machinery import needs a declared input before structural preflight can admit the complete gate.",
  "changed": "Add scripts/lib/build-freshness.mjs to registrations, scripts/lib/fixture-inputs.mjs to harness-fixtures, and scripts/test-gate-followups.mjs to process-debt in scripts/test-runner.mjs.",
  "evidence": [
    "The first npm test -- --review --again stopped in declarations at 2026-10-21T03:49:15.379Z after 15,573 ms; four tasks executed and the remaining tasks were not admitted. Its code identity is c30348c0c259cf514569a3e574af358eaff7066df7da9f04474cadaab3c4a05e.",
    "The declarations failure named these three missing machinerySources entries. node scripts/harness.mjs bounded -- node scripts/structural-checks.mjs declarations then exited 0 at 2026-10-21T03:50:27.616Z, output SHA-256 26a495efeef683e5f3aa0c35004458dbfa6afe17fe6a1cd4def3213ec5ef31a6.",
    "The earlier planning-check mismatch was independently diagnosed: removing D002’s final added evidence item reproduces its original bound hash. The canonical amend-order command rebound D002 at 2026-10-21T03:48:34.494Z, and plan check passed at 03:48:43.007Z without changing scope or criteria."
  ],
  "rejected": [
    {
      "option": "Treat targeted fixture passes or the repaired structural check as completion",
      "reason": "The required complete review has not passed at this identity; its subsequent fresh run is the retention and coverage evidence."
    },
    {
      "option": "Remove the new imports or weaken declaration checking",
      "reason": "The imports support the requested repairs and the checker correctly identified omitted inputs."
    }
  ],
  "reopenWhen": "Structural preflight finds another undeclared import or a complete run fails after these declared inputs are present."
}
```

## WO-217-D071

```json
{
  "id": "WO-217-D071",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-gate repair",
  "kind": "correction",
  "decision": "Preserve the historical target-worker profile hash while explicitly asserting the newly authorized native skill-format field before removing that one field from the historical comparison.",
  "misread": "The historical byte comparison normalized only the runtime release label, so it also rejected the deliberately added skills.format declaration.",
  "meant": "The historical worker policy stays byte-identical after removing only independently checked, authorized metadata additions.",
  "changed": "Assert skills.format equals agent-skills for both target-worker profiles, remove that field and the existing skeletonVersion field from the comparison clone, and retain the historical expected hash unchanged. Contributor and worker counts and the remaining profile assertions remain intact.",
  "evidence": [
    "The second fresh complete review stopped at 2026-10-21T03:57:50.765Z after 369,909 ms: 25 suites passed; harness-fixtures had one actual failing case and the remaining required work was not completed. Code identity 3d662b9e17afc1edf396024c4029df13e159b13ca6f3cb4431bf03cd97313cb5.",
    "scripts/test-harness.mjs case WO-146 three contributors share unique outputs while workers remain explicitly two expected 9f41bb7cb0176f0b8e73bd9fe760ef628259e69b4ebdbb28fa0a621bd4dba6fb and observed ef6b42fe88a1705c48ed3b67cf40630aa46dd02006ac4ba0a1382aed45d76878.",
    "The repaired bounded named case passed at 2026-10-21T03:59:42.296Z; its original historical hash still matches after the two explicit normalizations. Output SHA-256 f72fc7f276be51b55f5dd28c195ace837865df1a24f2ef9025e5536a0283fa1e."
  ],
  "rejected": [
    {
      "option": "Replace the historical expected hash with the current value",
      "reason": "That would hide unrelated worker-profile drift. The narrow projection keeps the old oracle and independently asserts the added field."
    },
    {
      "option": "Remove skills.format from target workers",
      "reason": "D065 and D066 explicitly declare the native format in all supported runtime profiles; target workers continue omitting DotLn lifecycle skills."
    }
  ],
  "reopenWhen": "Another field changes the historical profile projection, the native format assertion fails, or the fresh complete gate fails."
}
```

## WO-217-D072

```json
{
  "id": "WO-217-D072",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-gate repair",
  "kind": "correction",
  "decision": "Give synthetic gate rows the task observations their declared suites require, build the copied registration fixture before judging its runtime, and recognize the feedback checker’s typed stale-edition error while retaining the live-episode refusal.",
  "misread": "The older target-claim and off-ramp fixtures treated a declared suite list without task observations as a passing row. The registration fixture copied source but held no current compiled-runtime receipt. Sync recognized only two older feedback stale messages and misclassified the typed changed-behavior refusal as an unknown check failure.",
  "meant": "A declared gate suite needs its own valid task result. A copied source checkout must build before its runtime freshness is judged. A known stale-feedback edition can take the checked carry route, which still refuses a changed judged subject and requires a fresh live episode.",
  "changed": "Add complete synthetic task results to the target document row and shared off-ramp claim-row helper; bootstrap the registration copy with scripts/build.mjs; recognize the StaleFeedbackEdition error line in the feedback-evidence stale classifier. Correct the adjacent off-ramp comment to describe consuming a document row without starting a gate.",
  "evidence": [
    "The third npm test -- --review --again failed at 2026-10-21T04:13:00.159Z after 754,046 ms, code identity e10110c6d38002d6967b6a1836c7ac02c0ecaa897e7ec11871a3d0513a07e7a6. Its 33 passing suite aggregates and 91 fresh tasks did not complete the review. The only failed executed tasks were runner-fixtures and sync-fixtures; incomplete aggregates were not additional executed failures.",
    "scripts/test-runner.test.mjs: target claims use only current target selection rows and consume the document row; WO-157 the document gate refuses an unregistered docs JSONL and an unstubbed document suite. Both passed in one bounded named-case command at 2026-10-21T04:15:34.282Z, output SHA-256 0c2ad9e79fba7879d515e147dec4ad5dc91fc3975bbf6d76bd2080fe6d7408a2. An earlier attempt copied the parent build receipt but still failed freshness; the successful fixture builds its own copy.",
    "scripts/test-sync.mjs: the real inventory checks stale artifacts, regenerates safe outputs, refuses manual changes and is byte-stable. The bounded named case passed at 2026-10-21T04:18:27.639Z, output SHA-256 e190836d5cf03e2cf4336b90453e0f4615d909adc410c5cf3cb5e948b10a6ae6. It reaches the real feedback carry refusal after changing a judged source and checks regeneration and second-run byte stability.",
    "scripts/test-off-ramps.mjs: the same synthetic-row defect was present in its plain/review helper as well as its document helper. node scripts/harness.mjs bounded -- node docs/evidence/WO-217/control-fixture.mjs scripts/test-off-ramps.mjs passed at 2026-10-21T04:19:46.270Z, output SHA-256 679bddca05440e96d63fad1340493303c236d4c47f4840b76d979769f935b5a7. The initial direct invocation omitted the required owned temporary-root argument and stopped before exercising the fixture; it is retained as a command setup error, not validation."
  ],
  "rejected": [
    {
      "option": "Accept declared suite names without executed task results or skip runtime freshness in copied fixtures",
      "reason": "That would undo the gate-evidence and stale-runtime repairs. Fixtures must satisfy the same validity conditions as their intended passing subjects."
    },
    {
      "option": "Broaden every feedback failure into permission to regenerate or weaken the real inventory assertion",
      "reason": "Only the checker’s explicit typed stale line is added. Unknown failures remain refused, and changed judged feedback still requires the authorized live episode."
    },
    {
      "option": "Treat the focused passes as the completed review",
      "reason": "The entire current subject still owes a fresh complete run and the unchanged retention threshold."
    }
  ],
  "reopenWhen": "A complete run fails these fixtures, a recognized stale feedback subject bypasses the live-episode refusal, or a synthetic passing row omits a declared task observation."
}
```

## WO-217-D073

```json
{
  "id": "WO-217-D073",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-gate repair",
  "kind": "correction",
  "decision": "Coordinate the exclusive-overlap fixture with explicit nested-entry and peer-entry signals, while deliberately delaying light admission and preserving its lease and exclusion assertions.",
  "misread": "The fixture slept for 80 ms inside the exclusive callback and 25 ms inside peer callbacks, assuming both light peers would enter while the exclusive callback was active. Asynchronous host admission does not promise that timing or callback-entry order.",
  "meant": "The test must hold its nested exclusive lease until both admitted light tasks have entered, independently of their launch delay, then assert overlap and heavy-task exclusion. A missing entry must still fail within a bounded deadline.",
  "changed": "The fixture waits for the exclusive nested lease and both light entries, with a five-second failure deadline per signal. Both light admissions are deliberately delayed by 150 ms. It retains the reserved-slot, concurrency, load-factor, nested-parent, oversized-child refusal, two-peer maximum and heavy-after-exclusive checks and prints rows/events when an assertion fails. Scheduler production code is unchanged by this repair.",
  "evidence": [
    "The fourth fresh complete review failed at 2026-10-21T04:24:28.527Z after 218,726 ms, code identity 9ebda47885afd3ef381e285b12d6a1c289d285383cd4f26eb0e784a4bf97077c. The only failed executed task was runner-fixtures. The sync suite passed in 182.89 s; other failed suite aggregates were unexecuted after the runner failure.",
    "scripts/test-runner.test.mjs case exclusive overlap uses only measured light peers and preserves its nested lease observed zero peers instead of two. The original full-run failure does not retain callback entry timestamps, so its precise host timing is unknown.",
    "A temporary copy of the unchanged case, with only a controlled 150 ms light-admission delay added through scheduleSuites acquireLanes, reproduced zero peers versus two at 2026-10-21T04:26:26.060Z, exit 1, output SHA-256 ab96ab4d72453e0e237e94bab71eb776be253885061f83637f17d5b9b3c31afd. This is a deterministic counterexample to the fixture timing assumption.",
    "The repaired primary case includes that same admission delay and passed under node scripts/harness.mjs bounded -- node --test \"--test-name-pattern=^exclusive overlap uses only\" scripts/test-runner.test.mjs at 2026-10-21T04:26:44.768Z, exit 0, output SHA-256 56ff56634ee5eda48292f9762f2628c4275cb29f57eed8988530b18a4c7b213a."
  ],
  "rejected": [
    {
      "option": "Rerun unchanged until the timing happens to overlap or lengthen the fixed sleep",
      "reason": "That preserves a scheduler-speed assumption. The delayed-entry counterexample fails the old fixture without changing scheduler policy."
    },
    {
      "option": "Remove the two-peer assertion or weaken host reservations",
      "reason": "The fixture must still prove overlap and nested capacity while excluding heavy work; the production reservation repair remains intact."
    }
  ],
  "reopenWhen": "The bounded entry signals fail, the delayed-admission fixture loses its lease or exclusion assertions, or the fresh complete review finds another failure."
}
```

## WO-217-D074

```json
{
  "id": "WO-217-D074",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-gate repair",
  "kind": "correction",
  "decision": "Update integration fixtures to the reviewer-owned PR draft contract and use the existing keep-going mode for subsequent complete diagnosis without changing acceptance or timing conditions.",
  "misread": "Two integration fixtures still assumed release preparation would manufacture a missing PR draft. A blocked ancestor of an absent draft therefore no longer fails preparation, and the continuation fixture tried to remove a draft that preparation correctly never created.",
  "meant": "An unowned absent draft is outside preparation’s writes. An existing malformed PR entry must still refuse before changing collision inputs. The saved collision must survive that refusal and be filed once on continuation.",
  "changed": "The unowned blocked-directory case now asserts successful retiming, preserved blocker bytes, no draft creation and a complete integration receipt. The saved-stub case explicitly plants its malformed PR entry after asserting that no draft was created. The existing blocked-PR-file refusal and newer-tag continuation cases remain. The renamed case keeps the same measured time bound. Production release behavior is unchanged by this fixture repair.",
  "evidence": [
    "The fifth fresh complete review failed at 2026-10-21T04:45:27.659Z after 1,078,359 ms, code identity 59d53e172f23b5d0a6e18c64c4b9200a2db62adb1c746d7cae3479a907232b8e. The only failed executed task was worktree-integration, with the two named PR collision fixtures. There were 35 passing suite aggregates and 92 fresh tasks; incomplete aggregates were not additional executed failures.",
    "scripts/release.mjs prepares a process meter only inside existsSync(PR.md). D043 leaves draft creation with the reviewer. The first fixture observed successful integration where it expected a PR-ancestor write failure; the second observed ENOENT while removing its assumed draft.",
    "node scripts/harness.mjs bounded -- node --test \"--test-name-pattern=^WO-086 (an unowned blocked PR directory|a blocked PR file|a stub blocked by a regular file)\" scripts/test-worktree-integration.mjs passed all four selected cases at 2026-10-21T04:46:41.268Z in 17.939 s; output SHA-256 6846d5b81f08aa0c7856a36f83cb773f3e1f78779ff489d3876e3a95f5e89c69.",
    "scripts/test-runner.mjs admits --keep-going and still refuses failed structural prerequisites. It retains failed task results and runs remaining independent suites. A passing complete row still requires every selected task to pass at the unchanged identity; no focused or failed row is composed into completion. Subsequent complete attempts use npm test -- --review --again --keep-going so one failure does not hide the remaining independent checks."
  ],
  "rejected": [
    {
      "option": "Restore automatic PR draft creation to satisfy the old fixtures",
      "reason": "That would undo the requested ownership repair. Fixture setup must supply the artifact whose malformed form it intends to judge."
    },
    {
      "option": "Ignore malformed existing PR entries or drop saved-collision continuation checks",
      "reason": "The existing-entry refusal and exactly-once collision record remain required; all four relevant branches were exercised."
    },
    {
      "option": "Count independently passing suites from a failed attempt as completion",
      "reason": "Keep-going changes diagnostic reach only. A new complete passing run at the final identity and the unchanged retention threshold remain required."
    }
  ],
  "reopenWhen": "Integration writes an unowned absent draft, changes collision inputs before an existing-entry refusal, duplicates or loses the saved collision, or the fresh complete run fails."
}
```

## WO-217-D075

```json
{
  "id": "WO-217-D075",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-gate repair",
  "kind": "correction",
  "decision": "Correct three fixture expectations exposed by the complete keep-going review; preserve the separate exported-instance timeout and its successful bounded reproduction without changing deadlines or claiming an established cause. Require a fresh complete review and the unchanged retention threshold.",
  "misread": "The maintenance sweep inserted Git options between hash-object -t and its commit object type. The target-gate fixture assumed the first retained output belonged to a successful command. The role-assignment fixture retained seven literal sentences from before the operator-approved wording pass.",
  "meant": "Git object types are operands, successful output is omitted from gate readback, and the independent role oracle must assert the authorized current wording exactly once across every profile and support setting.",
  "changed": "Remove the two misplaced hash-object arguments in scripts/test-target-publish.mjs. In scripts/test-target-worktree-start.mjs select the failed command explicitly, require its diagnostic and assert every passing row has no output or outputRef. Update the seven independent literals in packages/skeleton/test/executor-supports.test.ts to the reviewed D061 wording. No production behavior, timeout, scheduling rule, test selection or retention threshold changes in this repair.",
  "evidence": [
    "The sixth npm test -- --review --again --keep-going finished at 2026-10-21T05:15:45.136Z with exit 1 after 1,685,801 ms, code identity c8b6dfabee9c00cc942c21b14c7f0c0f6e902519ade6064150a158ea1fc3e68c. All 109 selected tasks ran fresh, with zero reuse and no unrun suites. Forty suite aggregates passed and four failed: target-publish, target-worktree, skeleton and launchpad-planning. The earlier runner, sync, harness and worktree-integration repairs passed. The failed run is 17,283 ms above the unchanged 1,668,518 ms threshold and cannot establish retention or completion.",
    "The actual failed target-worktree task was scripts/test-target-worktree-start.mjs. The target-publish failure printed git hash-object -t -c maintenance.auto=false commit and invalid object type -c. The target-output failure observed synthetic failure where the old assertion expected synthetic output. The skeleton failure named the old Settle routine version sentence; D061 records the authorized replacement. A multiline search across scripts, packages and corpus found no second -t followed by the inserted maintenance arguments.",
    "The launchpad-planning failure occurred in planning and release-close reads run in a fresh exported instance: its actual integrated kit review timed out in configuration-root after 30,122 ms. The same complete run\u2019s root configuration-root task passed in 6,308 ms. The retained output names the interrupted lifecycle case but does not establish the cause or the time spent in its individual child commands.",
    "node scripts/harness.mjs bounded -- node --test \"--test-name-pattern=^WO-066 AC5: a signed-header commit\" scripts/test-target-publish.mjs passed at 2026-10-21T05:17:54.536Z in 2501 ms, output SHA-256 46d628dfb82234d0ce19e0000316df268742178ae92a3900fb0964d2f1d73676.",
    "node scripts/harness.mjs bounded -- node --test \"--test-name-pattern=^target gate runs selected commands\" scripts/test-target-worktree-start.mjs passed at 2026-10-21T05:18:06.305Z in 4001 ms, output SHA-256 8023400c554a536122537dbcb2be867876281eb6654446fed776eafbbfb7aaf2.",
    "node scripts/harness.mjs bounded -- node --test \"--test-name-pattern=^WO-179 and WO-195 emitted roles\" packages/skeleton/dist/test/executor-supports.test.js passed at 2026-10-21T05:18:18.554Z in 141 ms, output SHA-256 0dc8b8701d5799e0434ccbe8e4ddfacfbad594160daa68d439513ffa07a64318.",
    "node scripts/harness.mjs bounded -- node --test \"--test-name-pattern=^planning and release-close reads run in a fresh exported instance\" scripts/test-launchpad-planning.mjs passed at 2026-10-21T05:22:14.160Z in 211193 ms, output SHA-256 8978e6530bc64d9ddf5437feb487f5829bd0dba9164fd9069c8f05f775ce464b."
  ],
  "rejected": [
    {
      "option": "Restore successful output retention, remove the signature positive control, or accept arbitrary role wording",
      "reason": "Those changes would weaken the product contracts or their independent oracles. The three repairs retain the behavior being checked."
    },
    {
      "option": "Raise the configuration-root deadline or change scheduling based only on this failed observation",
      "reason": "The exact cause is unestablished and the unchanged complete exported-instance case passes in the bounded reproduction. Retain the observation, the existing deadline and the requirement for a fresh complete run; do not claim the focused result proves a cause or a concurrency fix."
    },
    {
      "option": "Use the 40 passing aggregates or the focused reproduction as completion or relax the timing limit",
      "reason": "Only a fresh complete passing row at the final identity can satisfy the handoff, and its timing must meet the unchanged work-order threshold."
    }
  ],
  "reopenWhen": "A fresh complete review fails any named case, the exported-instance timeout recurs, passing target output is retained, role literals drift from the authorized wording, or the complete-run retention condition fails."
}
```

## WO-217-D076

```json
{
  "id": "WO-217-D076",
  "date": "2026-10-21",
  "dispatch": "resume: next; generated-artifact repair",
  "kind": "correction",
  "decision": "Regenerate the installed runtime snapshot and its authority evidence after rebuilding the corrected compiled test, through the canonical sync path. Preserve the failed structural attempt and run a fresh complete review.",
  "misread": "The direct evidence source lists do not name executor-supports.test.ts, but that was insufficient to conclude that its rebuild left the installed harness current.",
  "meant": "The harness runtime inventory includes every compiled package byte, including compiled tests. A changed compiled test changes the snapshot selection even when the directly listed evidence source files and role text are unchanged.",
  "changed": "npm run sync regenerated the installed harness and selected authority edition WO-217/005. Historical editions remain intact; artifact-identity 002, verification 002 and feedback 002 remain current. Update the edition record and final handoff selection accordingly. No deadline, scheduling or acceptance rule changed.",
  "evidence": [
    "The seventh npm test -- --review --again --keep-going stopped in generated structural preflight at 2026-10-21T05:24:59.891Z after 32,304 ms, code identity 863098b73a8d2f8f43f5faad733be9b67909d73da558956405d24fa3d84402f4. Five tasks ran; generated was the only failed executed task. The remaining selected tasks were unrun, not additional executed failures. The retained full log has SHA-256 ddc301dde5349d8cca4ce41f32337585033cdc702154f870af7496b46aee16f0.",
    "The generated checker named harness drift in .claude/hooks/commit-msg.mjs and refused harness, authority-evidence and harness-evidence. scripts/lib/harness.mjs runtimePackageInventory traverses the compiled package directory and explicitly includes compiled tests; runtimeSnapshotPath hashes that complete inventory.",
    "npm run sync exited 0 in 26.345 s; output SHA-256 aca1fd9d676dda013d6213dd81a14d8ebc7596e4f96f62d26ab55aff6484f54f. It regenerated only harness and authority-evidence; every listed after-check was current, including harness-evidence and feedback-evidence.",
    "docs/evidence/current.json selects authority 005 with artifact-identity, verification and feedback 002. The installed runtime snapshot is .runtime/harness/4ae2d5fa4c60864a. All twelve current generated role files still match the after byte counts and SHA-256 values in role-efficiency.json."
  ],
  "rejected": [
    {
      "option": "Ignore compiled tests in the runtime inventory or bypass the generated checker",
      "reason": "That would weaken the complete runtime snapshot contract the order explicitly retained. Regeneration is the prescribed remedy."
    },
    {
      "option": "Treat the direct source-list scan or successful build as proof that every generated artifact is current",
      "reason": "The installed bundle also depends on its compiled runtime inventory. The canonical sync check supplies the missing evidence."
    },
    {
      "option": "Count the structural attempt as a passing complete review",
      "reason": "The product suites were never admitted. The current subject still requires a fresh complete passing run and the unchanged retention limit."
    }
  ],
  "reopenWhen": "A compiled runtime change leaves the installed harness stale, a generated artifact check refuses, or the fresh complete review fails."
}
```


## WO-217-D077

```json
{
  "id": "WO-217-D077",
  "date": "2026-10-21",
  "dispatch": "resume: next; complete-review scheduling repair",
  "decision": "Repair the two scheduler defects exposed by the eighth complete review and the independent design review: drain before the highest-priority group/dependency-eligible exclusive, and preserve change-priority hints across explicit structural-only aborted attempts. Keep all selected tasks, failed-first priority for eligible work, full exclusive reservations, measured-light overlap and the existing retention limit.",
  "evidence": [
    "The eighth npm test -- --review --again --keep-going ended at 2026-10-21T06:00:03.895Z, code identity 863098b73a8d2f8f43f5faad733be9b67909d73da558956405d24fa3d84402f4. It ran all 109 tasks fresh with zero reuse, no unrun or stale suites and unchanged identity/build evidence. Forty-three aggregate groups passed; launchpad-planning was the only failed executed task. Its integrated-kit configuration-root task again reached the unchanged 30-second deadline. The 1,915,702 ms failed run exceeds the 1,668,518 ms limit by 247,184 ms and cannot discharge retention. Full-log SHA-256 6699f3a47ab50038d2c65f1d29309b318f78618edaaf9b0752e82d77ea61b952; retained-row SHA-256 1e5dedee941f02b24fadb47642f944a9e77ae71c951bbc2c2771b3d0c789fa1f.",
    "The independent design worker identified a group-blocked priority-3000 target-worktree row hiding the ready priority-1200 harness exclusive. Lower-priority vertical statements began at 388,840 ms while the two-wide target group was full; statements lasted until 829,424 ms and the first exclusive began at 829,431 ms. The admission scan already skipped blocked rows, but its drain guard considered only pending[0].",
    "The seventh attempt executed only five structural tasks and left 104 tasks unrun. Its timestamp nevertheless advanced changedSinceLastGate, so runner-fixtures lost the changed-since-last-run lead in the eighth attempt. Failed-task history itself remained correct. The new cutoff filter requires a nonzero recorded exit, nonempty unrun tasks and nonempty fresh executions all within structural/build tasks; legacy rows without execution detail retain their previous timestamp behavior.",
    "Three controlled priority-regression tests failed against the pre-repair production source at 2026-10-21T06:14:15.281Z: both group- and dependency-blocked cases admitted heavy work before the exclusive, and the structural-abort case advanced the cutoff. The bounded command exited 1 in 192 ms; log SHA-256 fc7cc15625a6c48bc9f4aad9d0903e4b8425c013b6fa24e007b3cef29ef0f6bb.",
    "The same three tests passed after the production changes at 2026-10-21T06:14:38.252Z; bounded duration 209 ms, log SHA-256 a1b93899a61de1a9911d153d8c28eea2f5ebe863535164e8a8280536848e6dbd. The fixture releases tasks through explicit entry/release promises and checks the newly eligible failed-first task still leads. A separate bounded selection passed nine barrier, exclusive, overlap, history and priority cases at 2026-10-21T06:14:45.992Z in 1,394 ms; log SHA-256 9186a93cb21ff07685cac3d0dbbcc9401563fa282f6ded279ff731e7273f4336.",
    "The design worker read the repairs and reported zero new findings. The local adjacent queue records this as completed adjacent-0001. The failing cutoff probe left one synthetic Git fixture before its old cleanup statement; its complete bytes were archived and verified before removal, and the fixture now registers cleanup with t.after. The remaining timeout diagnosis and a fresh complete passing review are still owed."
  ],
  "rejected": [
    {
      "option": "Leave the queue unchanged or move the same heavy tasks later by name",
      "reason": "The demonstrated defect is eligibility masking, not one particular task name. The controlled cases isolate the rule and retain all tasks."
    },
    {
      "option": "Discard all failed rows from change detection",
      "reason": "A failed row can have exercised product work. The positive control retains its timestamp, and legacy unknown rows keep their prior treatment."
    },
    {
      "option": "Relax the 1,668.518-second limit or count the failing run as a pass",
      "reason": "The work order explicitly retains that threshold and requires a complete successful run at the current subject."
    }
  ],
  "reopenWhen": "An eligible exclusive is again bypassed by lower-priority heavy work, an unexecuted structural failure erases a source-change hint, a preserved scheduling control fails, or the new complete review fails its checks or retention limit."
}
```


## WO-217-D078

```json
{
  "id": "WO-217-D078",
  "date": "2026-10-21",
  "dispatch": "resume: next; exported-instance fixture repair",
  "decision": "Scope each fake forge environment to the refresh or publication operations that need its transport mapping. Keep the original environment for local configuration and document gates. Retain every existing exported-instance assertion and the unchanged 30-second configuration deadline; require a fresh complete review before claiming that the loaded failure is resolved.",
  "evidence": [
    "Complete attempts 6 and 8 both timed out in the integrated exported instance configuration-root task near 30 seconds. The root task passed in the same reviews. Earlier standalone and eight-copy root configuration probes passed, so those observations alone did not localize the nested failure.",
    "The first exported-instance timing probe passed in 243,519 ms but captured no child timings: suiteEnvironment filtered the diagnostic variable because it lacked an admitted prefix. The corrected probe used a DOTLN_ variable and passed in 243,983 ms. Its original kit, integrated kit and later target kit each executed 96 observed child calls; summed child times were 5,628 ms, 18,147 ms and 18,049 ms. These diagnostic exports added a product-read observer; the actual launchpad-planning machinery task does not install that observer, so this is not claimed as an exact full-gate environment reproduction.",
    "Source inspection of scripts/test-launchpad-planning.mjs found installTargetPublicationFixture(refreshForge, env, ...) mutating the common PATH and Git configuration. scripts/test-target-publication-fixture.mjs places a Node Git shim on PATH to preserve canonical remote URLs while mapping synthetic remotes to local repositories. All later local gates had inherited that shim unnecessarily. The later publication setup also mutated the same common environment.",
    "One serial bounded comparison ran the unchanged root configuration suite natively and with the same forge helper installed. Both arms passed every case: native 5,652.161 ms, forge shim 15,795.185 ms. The observed difference is 10,143.024 ms for this sample, not a whole-gate speedup estimate. It establishes avoidable shim overhead but not every cause of the loaded timeout. Bounded comparison log SHA-256 e7a1a26eefaeac3fd43d3455809ab5e8577e6c136783f3d3871313649e1078a5.",
    "The new environment-isolation assertion failed against the prior fixture setup at 2026-10-21T06:19:04.857Z with forge setup preserves local gate environment; bounded duration 32,207 ms and log SHA-256 507a96d5e02f51d6978908fe16e650012a2c996533c33a7ca5f6a165e6f6293f. Assertions report only boolean equality, never environment values.",
    "The repaired complete first exported-instance case passed at 2026-10-21T06:22:17.658Z in 164,671 ms under the exact selected-case command below. Log SHA-256 c73c4ca6a3c61df74a8269f1b03856f2ea35f105804cb1a9484ecf5c4e38e0c8. The run includes starter refresh, actual integrated review, moved-record document checks, publication and close, with no raised deadline.",
    "Exact selected-case command: node scripts/harness.mjs bounded -- node --test --test-reporter=tap '--test-name-pattern=^planning and release-close reads run in a fresh exported instance' scripts/test-launchpad-planning.mjs. The independent design worker read the final scoping and reported zero new fixture findings and no omitted case or assertion. The local adjacent queue records completed adjacent-0002."
  ],
  "rejected": [
    {
      "option": "Increase the configuration deadline or rerun until the loaded failure disappears without diagnosis",
      "reason": "The serial comparison identifies unnecessary wrapper cost that can be removed without changing the bound or any criterion."
    },
    {
      "option": "Remove the fake Git transport shim from publication fixtures",
      "reason": "It preserves canonical remote URLs while redirecting authorized fixture transport to local repositories. Publication still needs it; local configuration gates do not."
    },
    {
      "option": "Keep sharing one mutable environment for every stage",
      "reason": "The negative assertion proves that unrelated local checks inherit fixture-only transport settings, and the paired comparison measures the resulting extra work."
    }
  ],
  "reopenWhen": "The full review still times out at the current subject, any synthetic remote operation loses its local mapping, a forge setup changes the base environment, or the final complete run misses the retention limit."
}
```


## WO-217-D079

```json
{
  "id": "WO-217-D079",
  "date": "2026-10-21",
  "dispatch": "resume: next; cutoff repair correction",
  "kind": "correction",
  "decision": "Exclude known structural companion rows from the product-change cutoff alongside document rows. Preserve legacy unknown rows and rows that actually executed product work.",
  "misread": "D077 tested an aborted full row but did not cover the separate same-time structural row returned by readGateChecks.",
  "meant": "The runner writes a structural companion whose unrunSuites contains only unexecuted structural tasks. It can be empty after the final structural task fails; document runs also write a successful structural companion. Neither observation exercised product work.",
  "changed": "The exact structural checkId is excluded directly. The cutoff fixture now supplies both same-time rows for a failed final structural task and for a successful document run.",
  "evidence": [
    "Source: packages/skeleton/src/gate-evidence.mjs readGateChecks returns companion rows; scripts/test-runner.mjs structuralCheck replaces its unrun list with only structural tasks. The design worker confirmed this remaining edge as one additional finding.",
    "The expanded priority-regression selection failed only its cutoff case before the correction at 2026-10-21T06:23:17.059Z, bounded duration 193 ms; log SHA-256 2df828de56c9fae54d246f2ac0f73936038e5fbdaf5dbdfe0a5af70f6456016f. Both controlled exclusive cases still passed.",
    "All three cases passed after correction at 2026-10-21T06:23:25.879Z, bounded duration 229 ms; log SHA-256 846fd92ee4a2f7d999f013a1c7b8c6a4beeea7ea8944f1f27e3f833fff83ea2a. The successful-document companion contains all passing task results; the failed companion has all structural tasks executed and no unrun structural task.",
    "Command: node scripts/harness.mjs bounded -- node --test --test-reporter=tap --test-name-pattern=priority-regression scripts/test-runner.test.mjs. The local adjacent queue records completed adjacent-0003; all three diagnosed queue items are complete. A fresh complete review at this final source is still owed."
  ],
  "rejected": [
    {
      "option": "Keep relying only on the full-row unrun filter",
      "reason": "The negative control proves that a canonical companion row restores the timestamp."
    },
    {
      "option": "Discard every unknown or failed historical row",
      "reason": "Known structural and document observations can be excluded precisely without changing legacy or actual-product history behavior."
    }
  ],
  "reopenWhen": "A structural-only or document observation again advances the product-change cutoff, legacy or actual-product timestamp controls fail, or the complete review fails."
}
```


## WO-217-D080

```json
{
  "id": "WO-217-D080",
  "date": "2026-10-21",
  "dispatch": "resume: next; retained complete-run timing repair",
  "decision": "Keep every test and the original retention limit. Reduce only the branch-only priority lead from 1000 to 100 so exclusive work precedes older shared branch changes; preserve failed3000 and changed-since-last-gate2000. Admit launchpad update before export under the same file group and slot limits. Judge the candidate on three fresh complete passing reviews at one code identity, retaining all attempts and the first observation.",
  "evidence": [
    "The ninth complete review passed all 109 fresh tasks with zero reuse, no unrun or stale tasks and unchanged identity/build evidence at 2026-10-21T06:59:55.360Z, code identity 1c2ec5eb98b9eb512fd19349ce81efc9f999926a43387cc1b43e5fd8f14a73c4. Its 2040684 ms exceeds 1668518 ms by 372166 ms. This passing row does not discharge retention. Full-log SHA-256 680a84b3f90ba307dc832b51c3144740f0a1ad998f7e90fd1c5ad4ac3daa2f6d; retained-row SHA-256 38d4d034c09ea637a54a49669b47f75fd01da20899eb19af9c3000cda5c23282.",
    "The independent design worker found no additional correctness defect. The recorded priorities intentionally placed failed launchpad-planning first, then recently changed launchpad export/update ahead of process-debt. Task host-lane waits were at most 439 ms. Most critical-path edges were lane reuse and exclusive draining, not declared task dependencies.",
    "A bounded production-scheduler replay used every task and its ninth-run measured duration unchanged. Recorded priorities modeled 2038920 ms, within 1764 ms of the actual run. Current cleared hints modeled 1792230 ms; branch-only lead100 modeled 1651667 ms; update-first alone modeled 1703519 ms; both changes modeled 1633404 ms. Comparison command: node scripts/harness.mjs bounded -- node <owned-scratch>/wo217-schedule-replay-order.mjs. The bounded command passed in 1127 ms at 2026-10-21T07:05:32.524Z; log SHA-256 43c06ea905f59f602eab61165d0b6ce6b49296d423e8091ff703d9f4e58c18c1. The replay calls current scheduleSuites and expandSuiteTasks; it neither runs test bodies nor accounts for changes in contention, so it supplies no passing gate or causal speedup claim.",
    "Goal alignment: preserving fast feedback for actual failures and newly edited source prevents a timing optimization from hiding a fresh defect. Older branch-only shared suites may wait behind exclusive work; that is the explicit policy tradeoff. NoOp preserves the measured retention failure. A broader duration-based scheduler or fixture transport rewrite adds scope without evidence that this smaller candidate is insufficient.",
    "Before candidate edits, the executor declared three fresh npm test -- --review --again --keep-going observations at one final code identity. All three passing samples, including the first with recent-change hints, enter the median. Any test failure interrupts the series for repair; its attempt remains in the execution record. The unchanged threshold is 1668518 ms. No task, deadline, overlap eligibility, reservation, dependency, group cap or host setting is relaxed. Focused relational and constrained-lane controls and the actual series remain owed at this decision cutoff.",
    "Negative priority control: node scripts/harness.mjs bounded -- node --test --test-reporter=tap --test-name-pattern=priority-regression scripts/test-runner.test.mjs at 2026-10-21T07:08:41.762Z exited 1 with the prior three cases passing and exactly the two new cases failing (branch shared work incorrectly preceded an unchanged exclusive; export began before update). Log SHA-256 ca2479401dfa5f7e1d39bcd0e834a89512fe12d5c82ffbced8e27a0481fb815e. The same command after the policy change passed all five cases in 233 ms at 2026-10-21T07:11:26.854Z; log SHA-256 d8d2dd8895ab68c2162cdb30f3b2f3f443fecad844167ce9c154f9a9790cd0a1. The controls execute the real scheduler, preserve failed/recent priority relationally, and check the full launchpad file inventory, slot and group constraints.",
    "Independent criteria review identified an unqualified failed-and-changed-first role contract as a policy trap before implementation. Clarified packages/skeleton/src/loadouts/contributor.ts, its execution roles open with an ordered handoff regression, product 07 Discipline and Scheduling, and architecture gate-execution. The source now distinguishes newly changed from older branch work. The compiled role case passed in 100 ms; log SHA-256 5597a4c94827492cb769af613c755fa6368f0f5e41e969e50324b361db0eb16c. Canonical generation follows this source change; this does not change the judged feedback behavior sources.",
    "The broader 16-case admission/deadline selection first passed 15 and exposed an existing expected launchpad file order. Updated that expected array to update/export/seeds while retaining the 34-case inventory, 900000 ms deadlines, two slots and peak-two concurrency assertions. Failed attempt SHA-256 88ce1657669589392befd518ddc77a698af33db335b104b411f75587682a90c9; the fresh positive result is recorded separately before the full series.",
    "The fresh broader control selection passed all 16 cases, including the unchanged light-sample, overlap-reservation, build-barrier, deadline and 34-case launchpad inventory controls, in 2423 ms at 2026-10-21T07:12:17.002Z. Command: node scripts/harness.mjs bounded -- node --test --test-reporter=tap --test-name-pattern=\"priority-regression|build is a barrier|exclusive suites without|a suite whose latest|a lead raises|exclusive overlap uses|an exclusive gate reserves|a light latest|deadline\" scripts/test-runner.test.mjs. Log SHA-256 e1f3d060f89732adfe4dac304645565f3a21c1ce9d920dd231ae73eaa1d402e8.",
    "The final independent readback found two documentation claims to narrow: the criteria worker required the intended tail reduction to remain an aim until the real series; the design worker required declared file order to allow seeds to run first under the preserved measured-light overlap rule. Product 07 now states both limits. These add two fixed findings: criteria 13 and design 9, 22 distinct total. Neither worker reported a new code or test issue, and neither ran probes. The earlier binding-role wording caution was preemptive advice, not another finding.",
    "The first canonical sync regenerated runtime, installed harness, authority 006 and publication, then refused the outdated current WO-217 role oracle: output SHA-256 3a44c44f1e2c783abf04574c8296e924b8d589e2da6b52eb07169d3af06bda7d. Refreshed only the new WO-217 oracle in both economy settings under D080, preserving every historical oracle and the immutable efficiency baseline. The fresh npm run sync passed all generated checks in 23.664 seconds, output SHA-256 8834ea7bea8966b38c279a8f3f159ccee8fb2bc22dd6b7e11a1aa510c8388334. Authority 006 is selected; artifact-identity, verification and feedback 002 remain current. FEEDBACK_SOURCE_PATHS does not include the role source or its literal test; no new live behavior episode is owed by this wording edit. role-efficiency.json now records executor startup 28822 bytes, 391 saved and 424 below its unchanged ceiling; verifier/reviewer still save 402 bytes and the other roles 54."
  ],
  "rejected": [
    {
      "option": "Call the ninth passing run complete, relax the limit or repeat unchanged work on hope",
      "reason": "Retention is explicitly required. The current-priority fixed-work replay still exceeds the limit by 123712 ms."
    },
    {
      "option": "Remove failed-first or recently changed-first leads",
      "reason": "A new defect must continue to lead the queue. Only the lower branch-history tier changes."
    },
    {
      "option": "Claim the modeled 1633404 ms as the observed result or discard the first candidate sample",
      "reason": "The model fixes task work and cannot predict contention. All three real passing samples at the candidate identity are retained."
    }
  ],
  "reopenWhen": "Any priority, task coverage or admission regression appears, or the three fresh complete-run median exceeds 1668518 ms. Reassess the scheduling candidate using the recorded work and waiting; do not change the acceptance criterion."
}
```

## WO-217-D081

```json
{
  "id": "WO-217-D081",
  "date": "2026-10-21",
  "dispatch": "resume: next; document-gate failure repair",
  "decision": "Bind the advisory fixture child to its own launchpad after suite environment cleanup, preserving the real document CLI and every assertion; retain the earlier gate measurements and repeat the three-sample complete protocol at the repaired code identity.",
  "evidence": [
    "The first after-document attempt recorded 2026-10-21T08:41:35.882Z at code identity 40384d64a94feb77b42668c565b7c2e3e7662af06bc0a98c0e2f764748825119 ran all 27 tasks fresh with zero reuse and failed only docs-check-fixtures. Its 163705 ms row is retained; log SHA-256 7bb95556cff81738859ea646d716416efb5e652a65c8b49ae4bff0aa4e0ce34d; row SHA-256 c7e8cc9c272e15a305319ebc56fe5140b698dee2194733ceccf2f37940429cab.",
    "scripts/test-docs-check.mjs case document gate prints each ceiling advisory once and refuses invalid metadata at default and relocated roots relied on executionEnvironment.DOTLN_LAUNCHPAD. scripts/lib/suite-evidence.mjs suiteEnvironment deliberately removes that setting under D045; scripts/lib/config.mjs findLaunchpad otherwise locates the absolute CLI source checkout. Both failing child outputs named the primary documents instead of their synthetic fixture.",
    "node scripts/harness.mjs bounded -- node --test --test-reporter=tap --test-name-pattern=\"^document gate prints each ceiling advisory\" scripts/test-docs-check.mjs: before repair, the two children and parent failed, zero of three passed, bounded duration 43407 ms, finished 2026-10-21T08:45:35.611Z, log SHA-256 ca870a944f1cc8b2bb35ce22a6612f24f770b7e114614cd549468e616fba481d. After repair, all three passed with zero skips, bounded duration 1607 ms, finished 2026-10-21T08:45:51.240Z, log SHA-256 dc0638dccab292e9d2a8e1d19c66a674bc778f3ac6b929d3b6bead0df440423f.",
    "The fixture-owned preload sets DOTLN_LAUNCHPAD to its cwd and is loaded with node --import before the actual document CLI. The ineffective row environment override is removed. Default and relocated roots still each assert both overage advisories exactly once and refusal for missing and malformed metadata. No production environment exception or assertion removal is introduced.",
    "D080 complete attempts 10, 11 and 12 all passed at the historical 40384d64a94feb77b42668c565b7c2e3e7662af06bc0a98c0e2f764748825119 identity; durations 1755450, 1597422 and 1585618 ms, median 1597422 ms, met the unchanged 1668518 ms threshold. This fixture edit changes tracked code identity, so preserve that series and collect three fresh complete passing samples at the repaired identity, including the first. All three enter the same unchanged median rule, followed by three after-document samples and the final handoff document gate.",
    "Both existing independent workers reviewed the narrow repair and validation duties read-only. Neither reported a new finding; the root diagnosed this fixture failure."
  ],
  "rejected": [
    {
      "option": "Keep the inherited launchpad override or weaken suiteEnvironment cleanup",
      "reason": "The override is removed by the intended isolation boundary; exempting it would reopen the operator-expanded D045 defect."
    },
    {
      "option": "Change production root discovery or remove the advisory and invalid-metadata assertions",
      "reason": "The issue is confined to a synthetic custom-row launch command. Fixture-owned initialization preserves the real CLI and the full contract without expanding the product API or weakening coverage."
    },
    {
      "option": "Reuse the historical passing series for the new code identity or discard its first sample",
      "reason": "The completion gate and predeclared three-sample protocol judge the current source. Historical results and the failed document attempt remain visible as evidence and execution cost."
    }
  ],
  "reopenWhen": "The document fixture child reads another launchpad after environment isolation, either root variant loses its advisory or invalid-metadata checks, or the repaired current-identity three-sample median exceeds the unchanged work-order threshold."
}
```


## WO-217-D082

```json
{
  "id": "WO-217-D082",
  "date": "2026-10-21",
  "dispatch": "resume: next; final retention and document measurements",
  "decision": "Retain the repaired overlap lease and all-samples light rule after three fresh complete reviews at one identity meet the unchanged work-order median threshold; retain exact document parsing and the existing non-inline completion gate policy with their measured costs.",
  "evidence": [
    "docs/evidence/WO-217/gate-runs.json: `npm test -- --review --again --keep-going` passed at 2026-10-21T10:08:45.941Z in 1,608.746 s, code identity `2cd81e4c8286ba58ba899a3eafc38ee59945749cfb68f20f5c8c759ef275c9f8`, with 109 fresh tasks, zero reused suites and no unrun suites. `gate-runs.json` preserves every complete attempt and the successful current subject.",
    "D080 predeclared three fresh complete passing reviews at the final identity, including the first after editing and retaining normal priority-history changes; all three enter the statistic. D081 preserves the earlier passing series at its historical identity and repeats the protocol after repairing the document fixture. The 3-sample current complete-run median is 1,589.498 s, within the order's unchanged 1,668.518 s threshold; the overlap and light-classification repairs therefore meet the retention condition. The historical baseline has three samples. This comparison supports retention at this subject and does not establish causal speedup or equal variance.",
    "docs/evidence/WO-217/document-measurements.json: The three fresh document samples before and after are in `document-measurements.json`. Gate medians are 162.763 s before and 141.659 s after; summed task-work medians are 281.003 s and 265.053 s. Critical-path work medians are 151.022 s and 141.300 s, with waiting medians 11.766 s and 0.132 s. `docs-check` work medians are 24.424 s and 22.127 s; `resume` work medians are 93.273 s and 89.376 s. Each sample executes all 27 document tasks with zero reuse. The baseline is the earlier in-order subject, not the activation checkout. The first observations are retained and OS caches were not flushed. The six passing runs and the retained failed after-document attempt are measurement overhead, followed by the separate final handoff gate. D037 retains exact parsing; D038 retains completion without an inline gate. Neither is presented as a parse-cache speedup or a reduction in this order's total run count.",
    "D070 through D081 preserve the failed complete and document attempts, diagnoses and focused repair results. The current complete and document rows cover the repaired fixtures and every required suite."
  ],
  "rejected": [
    {
      "option": "Use a focused pass or discard failed attempts from the execution record",
      "reason": "A focused row cannot discharge the complete gate. Failed attempts remain visible as execution cost and evidence; only complete passing rows at the current identity enter the retention statistic."
    },
    {
      "option": "Relax the threshold or claim a causal speedup from the observed comparison",
      "reason": "The work order keeps its stricter historical after-median limit. The bounded samples and changed inputs do not establish cause or comparable variance."
    },
    {
      "option": "Add a persistent Markdown parse cache or an inline completion gate",
      "reason": "The component and critical-path observations do not demonstrate a whole-gate cache benefit. Base evidence already proves completion consumes a current row without running a duplicate gate."
    }
  ],
  "reopenWhen": "A fresh three-sample complete-review median exceeds the work-order retention threshold, a controlled same-input cache comparison demonstrates a whole-document-gate benefit with complete invalidation, or completion starts a duplicate gate."
}
```

<!-- row-dispositions:start -->

## WO-217-D004

```json
{
  "id": "WO-217-D004",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-04ec9fa011f39d93"
  ],
  "decision": "Keep complete-first executor handoff and decline expanding the shell redirect extractor into a partial shell interpreter.",
  "evidence": [
    "docs/evidence/WO-144/decisions.md#wo-144-d010--pass-final-review-after-an-in-review-test-repair-board-the-unrun-suite-and-two-width-edges",
    "packages/skeleton/src/harness-host.ts shell redirect accessors; docs/AI-HARNESS-SECURITY.md known-destination width; current executor procedure",
    "The procedure now requires a complete review; mixed opaque redirects can still hide literal destinations from the advisory extractor. Host permissions remain the boundary. Naming only fragments while leaving expansions unobserved would suggest coverage it cannot enforce. NoOp retains the explicitly limited extractor, not a claim that the width gap is fixed."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The procedure now requires a complete review; mixed opaque redirects can still hide literal destinations from the advisory extractor. Host permissions remain the boundary. Naming only fragments while leaving expansions unobserved would suggest coverage it cannot enforce. NoOp retains the explicitly limited extractor, not a claim that the width gap is fixed."
    }
  ],
  "reopenWhen": "A concrete supported command requires narrower per-invocation extraction with an executable refusal model; never infer full shell mediation."
}
```

## WO-217-D005

```json
{
  "id": "WO-217-D005",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-079f827e1b11eb1e"
  ],
  "decision": "Keep the explicit refusal for a committed submodule; do not add a partial gitlink adapter.",
  "evidence": [
    "docs/evidence/WO-188/decisions.md#wo-188-d006--item-4-no-forced-removal-over-a-submodule-already-published-is-carried-a-dirty-derived-worktree-names-the-operator-the-record-exists-before-flags-parse",
    "packages/skeleton/src/gate-evidence.mjs gateTreeHash refuses mode 160000; gateCodeIdentity covers the pointer only; executor step 5 forbids declaring submodules",
    "A subject with a gitlink cannot obtain a gate tree hash. The executor explicitly forbids introducing submodules, and hashing only the pointer would not attest dirty nested content or unpushed nested history. NoOp preserves an honest refusal and the separate removal protection."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "A subject with a gitlink cannot obtain a gate tree hash. The executor explicitly forbids introducing submodules, and hashing only the pointer would not attest dirty nested content or unpushed nested history. NoOp preserves an honest refusal and the separate removal protection."
    }
  ],
  "reopenWhen": "An authorized repository actually requires a submodule and declares the nested-content, availability and retention semantics to judge."
}
```

## WO-217-D006

```json
{
  "id": "WO-217-D006",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-0c10689747f83675"
  ],
  "decision": "Retain the already implemented recursive read, watch, copy, blob and link observation boundaries.",
  "evidence": [
    "docs/evidence/WO-186/decisions.md#wo-186-d033--repair-the-read-guards-root-and-ancestor-walks-state-the-copy-and-shell-boundary",
    "scripts/test-runner.test.mjs recursive root/ancestor guard fixture",
    "The base regression exercises those forms. Shell children and a fixture copy deliberately outside the guarded candidate remain outside Node read interception; no broader containment claim is made.",
    "repair-controls.json base-recursive-guard: node --test --test-name-pattern=^WO-186 VER-001 product tasks reject recursive scripts/test-runner.test.mjs; already-met; positive exit 0; exact base implementation, output e68478888e0df553d16fb0bf80be4fc2c4d53e047298c9dcc1c51d39c3b9c7d1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The base regression exercises those forms. Shell children and a fixture copy deliberately outside the guarded candidate remain outside Node read interception; no broader containment claim is made."
    }
  ],
  "reopenWhen": "A supported read form bypasses the declared Node guard or the copy boundary changes."
}
```

## WO-217-D007

```json
{
  "id": "WO-217-D007",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-0e424834e4030880"
  ],
  "decision": "Keep native sandbox cases visible as outside-sandbox work and preserve the closed WO-140 text with its existing correction.",
  "evidence": [
    "docs/evidence/WO-140/decisions.md#wo-140-d001--declare-from-the-receipts-skeleton-only-the-hooks-denial-is-the-probe-not-a-suite-cause",
    "WO-140-D001 full receipt comparison; scripts/test-runner.mjs skeleton needs declaration",
    "The source decision proves the hooks denial was a command denial, not the suite failure. Silently skipping the native tests on a refused probe would turn unavailable coverage into a pass. NoOp keeps the explicit declaration; WO-140-D001 remains the correction to historical attribution."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The source decision proves the hooks denial was a command denial, not the suite failure. Silently skipping the native tests on a refused probe would turn unavailable coverage into a pass. NoOp keeps the explicit declaration; WO-140-D001 remains the correction to historical attribution."
    }
  ],
  "reopenWhen": "A supported native adapter runs those cases inside the sandbox, or a repeatable new suite-specific environmental failure supports changing the declaration."
}
```

## WO-217-D008

```json
{
  "id": "WO-217-D008",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-4475529d727a4d25"
  ],
  "decision": "Use the shared physical module-entry guard for both corpus entry points.",
  "evidence": [
    "docs/evidence/WO-142/decisions.md#wo-142-d009--board-up-two-lexical-module-entry-guards-outside-row-a13s-ten-scripts",
    "corpus/mutation/mutate.mjs; corpus/harness/generator-runtime.mjs",
    "Direct symlink invocation now executes the entry and processes invalid arguments.",
    "repair-controls.json symlink-entry: node --test --test-name-pattern=^corpus entry scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Direct symlink invocation now executes the entry and processes invalid arguments."
    }
  ],
  "reopenWhen": "A supported entry spelling fails the physical identity check."
}
```

## WO-217-D009

```json
{
  "id": "WO-217-D009",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-5094b24d6d68d2e4"
  ],
  "decision": "Normalize TAP-quoted progress, read the hot index before archive enumeration, and observe glob reads. Keep parent tests in the five slowest observations.",
  "evidence": [
    "docs/evidence/WO-186/decisions.md#wo-186-d047--final-review-pass-at-the-repaired-identity-five-low-items-boarded-with-one-follow-up",
    "scripts/lib/case-reporter.mjs retains parent and child names; scripts/test-runner.test.mjs identityUnchanged fixture comment",
    "A parent reports inclusive duration, so it remains useful even when a child is also listed; those durations are observations, never a disjoint sum. The old assertion comment is corrected to distinguish an identity-invalid row from reusable task passes. WO-186 VER-003 did not observe forwarding of TAP-comment case-ended lines at its subject; the new quoted-progress control proves the current behavior.",
    "repair-controls.json archive-rotation: node --test --test-name-pattern=^gate reader retains scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json tap-progress: node --test --test-name-pattern=^TAP-quoted scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json glob-observation: node --test --test-name-pattern=^product glob reads scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A parent reports inclusive duration, so it remains useful even when a child is also listed; those durations are observations, never a disjoint sum. The old assertion comment is corrected to distinguish an identity-invalid row from reusable task passes. WO-186 VER-003 did not observe forwarding of TAP-comment case-ended lines at its subject; the new quoted-progress control proves the current behavior."
    }
  ],
  "reopenWhen": "A glob form bypasses observation, a row disappears during eviction, or the inclusive parent list prevents identifying a demonstrated slow leaf."
}
```

## WO-217-D010

```json
{
  "id": "WO-217-D010",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-511b5a41d831fe83"
  ],
  "decision": "Retain document-sensitive routing and the current lock-matrix concurrency; do not infer a new reservation from historical correlated timings.",
  "evidence": [
    "docs/evidence/WO-186/decisions.md#wo-186-d036--record-the-document-gates-rise-the-lane-peer-growth-and-the-harness-cases-after-median",
    "WO-186-D036 full before/after and overlap evidence; WO-217 document-measurements.json",
    "Document wall time has grown. WO-186 measured an unequal-sample 66.690-second document median and a 73.577-second plain-gate reduction, and attributed lock-matrix interference only as an inference. Current before/after document observations are recorded separately. NoOp preserves coverage and avoids rescheduling on an unisolated causal claim; no net whole-order saving is claimed."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "Document wall time has grown. WO-186 measured an unequal-sample 66.690-second document median and a 73.577-second plain-gate reduction, and attributed lock-matrix interference only as an inference. Current before/after document observations are recorded separately. NoOp preserves coverage and avoids rescheduling on an unisolated causal claim; no net whole-order saving is claimed."
    }
  ],
  "reopenWhen": "A controlled same-selection comparison isolates a lock-matrix reservation change and improves end-to-end time without losing cases."
}
```

## WO-217-D011

```json
{
  "id": "WO-217-D011",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-51c310284c2fea17"
  ],
  "decision": "Match gate identity occurrences individually and retain writer ownership when append wrote its event before throwing. Keep the existing linked-root fixture.",
  "evidence": [
    "docs/evidence/WO-168/decisions.md#wo-168-d018--final-review-pass-and-board-one-hedge-edge-and-two-fixture-observations",
    "scripts/test-observed-facts.mjs; scripts/test-harness.mjs WO-139 and WO-168 root cases",
    "A separate shorter identity remains ambiguous, and an unknown longer command does not borrow its duration. A committed dispatch retains its writer even when the write reports a later error. The base root fixture already exercises a linked temporary prefix and linked ancestors. Malformed empty or non-string gate identities are filtered before occurrence enumeration; the bounded child fixture detects the previous hang.",
    "repair-controls.json hedge-occurrences: node --test --test-name-pattern=^WO-168 a hedge names the longest scripts/test-observed-facts.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json append-after-write: node --test --test-name-pattern=^WO-139 Codex executor scripts/test-harness.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json base-linked-session-root: node --test --test-name-pattern=^WO-168 a granted session root scripts/test-harness.mjs; already-met; positive exit 0; exact base implementation, output 683088a48d115f617efa4009abd1f792f913b132ebeb532a5860bf8c136e08d7",
    "repair-controls.json malformed-gate-identity: node --test --test-name-pattern=^malformed gate identities scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A separate shorter identity remains ambiguous, and an unknown longer command does not borrow its duration. A committed dispatch retains its writer even when the write reports a later error. The base root fixture already exercises a linked temporary prefix and linked ancestors. Malformed empty or non-string gate identities are filtered before occurrence enumeration; the bounded child fixture detects the previous hang."
    }
  ],
  "reopenWhen": "A separately named gate is misattributed, a recorded dispatch loses its writer, or physical root resolution changes."
}
```

## WO-217-D012

```json
{
  "id": "WO-217-D012",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-5e52eb500e395237"
  ],
  "decision": "Share the task-execution precedence policy between the runner, findGateCheck and typed product-gate correction. Retain the already complete runtime snapshot inventory.",
  "evidence": [
    "docs/evidence/WO-186/decisions.md#wo-186-d038--board-two-reuse-boundaries-the-repair-leaves-as-they-are",
    "scripts/lib/gate-reuse.mjs; packages/skeleton/src/gate-evidence.mjs; scripts/resume.mjs; base runtime inventory case",
    "Later executed failures displace an older complete pass; later repair can restore it. Reused and unexecuted observations do not invent executions. Snapshot byte, mode and inventory coverage is already implemented at the base. A candidate does not bypass its own task validation: failed, absent/negative duration, invalid finish and future finish records refuse. The operator-requested temporary attack also found completion’s own-row shortcut and explicit missing-suite acceptance. Both selectors now validate own results and declared suite coverage while preserving legacy empty-claim compatibility; D062 records the counterexamples.",
    "repair-controls.json gate-standing: node --test --test-name-pattern=^gate lookup rejects scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json correct-standing: node docs/evidence/WO-217/control-fixture.mjs scripts/test-off-ramps.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json base-runtime-inventory: node --test --test-name-pattern=^declared runtime packages preserve scripts/test-harness.mjs; already-met; positive exit 0; exact base implementation, output 5e3c33e0aa39d6adc98505fb24042310335db9c9cb813045103f71951a1028e9",
    "repair-controls.json gate-self-validity: node --test --test-name-pattern=^gate lookup rejects scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json completion-self-validity: node --test --test-name-pattern=^gate lookup rejects scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json declared-suite-coverage: node --test --test-name-pattern=^gate lookup rejects scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Later executed failures displace an older complete pass; later repair can restore it. Reused and unexecuted observations do not invent executions. Snapshot byte, mode and inventory coverage is already implemented at the base. A candidate does not bypass its own task validation: failed, absent/negative duration, invalid finish and future finish records refuse. The operator-requested temporary attack also found completion’s own-row shortcut and explicit missing-suite acceptance. Both selectors now validate own results and declared suite coverage while preserving legacy empty-claim compatibility; D062 records the counterexamples."
    }
  ],
  "reopenWhen": "A lookup disagrees with runner precedence or an undeclared runtime file escapes snapshot identity."
}
```

## WO-217-D013

```json
{
  "id": "WO-217-D013",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-6125f53234c75af3"
  ],
  "decision": "Keep strict supplemental-journal parsing, instance-declared operator identity, and the current documented path and reader-profile widths.",
  "evidence": [
    "docs/evidence/WO-213/decisions.md#wo-213-d024",
    "WO-213-D024 full seven-part remainder and zero-new-match observation; scripts/lib/control-store.mjs strict parsing; scripts/lib/contributions.mjs instance identity",
    "This grouped row includes optional public-fixture identity cleanup, a new recovery signal, lenient supplemental parsing, ANSI/escaped-solidus path boundaries, dangling-link profile declarations and nondefault Stop selection. The source found no newly matching committed path lines and no observed default-selection failure. NoOp retains strict evidence and existing compatibility; it does not claim those width edges repaired. A recovery signal cannot be inferred merely from checkout location."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "This grouped row includes optional public-fixture identity cleanup, a new recovery signal, lenient supplemental parsing, ANSI/escaped-solidus path boundaries, dangling-link profile declarations and nondefault Stop selection. The source found no newly matching committed path lines and no observed default-selection failure. NoOp retains strict evidence and existing compatibility; it does not claim those width edges repaired. A recovery signal cannot be inferred merely from checkout location."
    }
  ],
  "reopenWhen": "A concrete current record leaks a forbidden path spelling, a dangling profile is used, an explicit alternate Stop order is misjudged, or an authorized recovery signal is specified with executable evidence."
}
```

## WO-217-D014

```json
{
  "id": "WO-217-D014",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-642d7a4beaed2272"
  ],
  "decision": "Make an empty nested format result report its task timeline before the output assertion.",
  "evidence": [
    "docs/evidence/WO-188/decisions.md#wo-188-d045--observation-the-runners-format-preflight-fixture-failed-once-under-the-full-review-gate-and-passed-alone",
    "scripts/test-runner.test.mjs format preflight output helper",
    "The original intermittent loss is not reproduced or assigned a cause. A planted empty result now names the executed task and its state, making a recurrence diagnosable; normal and complete-run coverage remain required.",
    "repair-controls.json empty-format-diagnostic: node --test --test-name-pattern=^empty nested format scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The original intermittent loss is not reproduced or assigned a cause. A planted empty result now names the executed task and its state, making a recurrence diagnosable; normal and complete-run coverage remain required."
    }
  ],
  "reopenWhen": "The complete gate reproduces empty output and the new timeline identifies a concrete runtime failure."
}
```

## WO-217-D015

```json
{
  "id": "WO-217-D015",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-8bac5e3bddd12494"
  ],
  "decision": "Keep the historical runner-fixtures threshold as a warning; do not rebase it to make growth disappear.",
  "evidence": [
    "docs/evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning",
    "WO-198-D021 measured case and main-row comparisons; scripts/test-runner.test.mjs retained case inventory",
    "The old 27.192-second threshold predates suite growth; WO-198 recorded 126.537 seconds while main was already 72–94 seconds and its added cases cost 13.16 seconds alone. NoOp preserves the historical evidence and all cases. The current complete-row task measurement is descriptive, not a substitute benchmark."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The old 27.192-second threshold predates suite growth; WO-198 recorded 126.537 seconds while main was already 72–94 seconds and its added cases cost 13.16 seconds alone. NoOp preserves the historical evidence and all cases. The current complete-row task measurement is descriptive, not a substitute benchmark."
    }
  ],
  "reopenWhen": "A same-case before/after profile identifies a concrete avoidable cost, or an operator-approved new baseline records the changed selection alongside the historical one."
}
```

## WO-217-D016

```json
{
  "id": "WO-217-D016",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-92711a92e1d05874"
  ],
  "decision": "Retain the expanded launchpad and target-worktree case inventory and its bounded file scheduling.",
  "evidence": [
    "docs/evidence/WO-210/decisions.md#wo-210-d013--verification-the-target-suites-growth-recorded-for-the-planning-receipts-criterion24-condition",
    "WO-210-D013 figures; WO-222-D014 through D016; scripts/fixtures/target-worktree-cases.json preserves every old name and adds one sign-off case",
    "The cited 10-test target baseline is not equivalent to the present expanded suite. WO-222 already measured two-file concurrency and independent deadlines. NoOp preserves those witnesses; deleting cases or comparing unequal inventories would manufacture a gain."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The cited 10-test target baseline is not equivalent to the present expanded suite. WO-222 already measured two-file concurrency and independent deadlines. NoOp preserves those witnesses; deleting cases or comparing unequal inventories would manufacture a gain."
    }
  ],
  "reopenWhen": "An equivalent-case measurement identifies avoidable work and a complete-run comparison retains the gain."
}
```

## WO-217-D017

```json
{
  "id": "WO-217-D017",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-94bff00e748a26af"
  ],
  "decision": "Do not attribute a suffixed unknown command to a shorter known gate.",
  "evidence": [
    "docs/evidence/WO-168/decisions.md#wo-168-d010--item-8-the-stranded-comment-and-the-hedge-match",
    "scripts/test-observed-facts.mjs longest-gate fixture",
    "The same occurrence-based matcher fixes the contained-identity defect and the unknown partial-command duration. The unknown-suffix case covers single-dash flags as well as double-dash flags. The independent temporary attack additionally proves whole-command prefix boundaries and nonnegative duration validation through observedFacts; D062 records those repairs.",
    "repair-controls.json hedge-occurrences: node --test --test-name-pattern=^WO-168 a hedge names the longest scripts/test-observed-facts.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json malformed-gate-identity: node --test --test-name-pattern=^malformed gate identities scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json single-flag-identity: node --test --test-name-pattern=^WO-168 a hedge names the longest scripts/test-observed-facts.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json command-prefix-identity: node --test --test-name-pattern=^WO-168 a hedge names the longest scripts/test-observed-facts.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json nonnegative-gate-duration: node --test --test-name-pattern=^WO-168 a hedge names the longest scripts/test-observed-facts.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The same occurrence-based matcher fixes the contained-identity defect and the unknown partial-command duration. The unknown-suffix case covers single-dash flags as well as double-dash flags. The independent temporary attack additionally proves whole-command prefix boundaries and nonnegative duration validation through observedFacts; D062 records those repairs."
    }
  ],
  "reopenWhen": "A supported unknown suffix is assigned a shorter gate duration."
}
```

## WO-217-D018

```json
{
  "id": "WO-217-D018",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-984094128fe71900"
  ],
  "decision": "Check Prettier effective ignore behavior in both collector declarations.",
  "evidence": [
    "docs/evidence/WO-200/decisions.md#wo-200-d005--verification-pass-ver-001-board-the-declaration-tests-textual-reading-of-the-formatter-ignore-list-which-a-negation-line-defeats",
    "scripts/test-comment-labels.mjs and corpus/harness/wo107-schema.test.mjs",
    "A later negation is now detected even while the positive ignore lines remain present.",
    "repair-controls.json effective-ignore-comment: node --test --test-name-pattern=^collector ignore assertions scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json effective-ignore-corpus: node --test --test-name-pattern=^collector ignore assertions scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A later negation is now detected even while the positive ignore lines remain present."
    }
  ],
  "reopenWhen": "A formatter ignore rule admits a pinned collector without either declaration test failing."
}
```

## WO-217-D019

```json
{
  "id": "WO-217-D019",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-a566ba26ee9f909a"
  ],
  "decision": "Compute critical-path work from recorded task duration and leave lane waiting in wait time.",
  "evidence": [
    "docs/evidence/WO-191/decisions.md#wo-191-d013",
    "scripts/lib/gate-timeline.mjs; scripts/test-gate-followups.mjs held-lane critical path case",
    "The deterministic fixture holds a host lane before the format preflight and checks that its span outside execution is waiting. Historical rows lacking a duration retain their legacy span interpretation.",
    "repair-controls.json timeline-wait: node --test --test-name-pattern=^critical path separates scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The deterministic fixture holds a host lane before the format preflight and checks that its span outside execution is waiting. Historical rows lacking a duration retain their legacy span interpretation."
    }
  ],
  "reopenWhen": "A measured wait is attributed to task work, or an impossible duration is accepted."
}
```

## WO-217-D020

```json
{
  "id": "WO-217-D020",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-b28b870422a74166"
  ],
  "decision": "Keep document checks responsible for document inputs and product identity responsible for code and declared vocabulary; decline an unbounded admitted-input-list redesign.",
  "evidence": [
    "docs/evidence/WO-174/decisions.md#wo-174-d013",
    "WO-174-D013 source observation; scripts/test-runner.mjs suite document declarations; gate-evidence.mjs document path selection",
    "WO-174 observed excluded reads; docs/LEGAL.md was already independently rejected by release-surfaces in the document gate. The current runner routes document-sensitive suites and includes outward vocabulary in code identity. A copied-input product check alone is not a claim about changed documents. NoOp retains the paired complete/document completion contract and its broad Node guard."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "WO-174 observed excluded reads; docs/LEGAL.md was already independently rejected by release-surfaces in the document gate. The current runner routes document-sensitive suites and includes outward vocabulary in code identity. A copied-input product check alone is not a claim about changed documents. NoOp retains the paired complete/document completion contract and its broad Node guard."
    }
  ],
  "reopenWhen": "A current complete-plus-document handoff accepts changed named inputs without an executed check, or a measured narrower admission scheme proves equivalent coverage."
}
```

## WO-217-D021

```json
{
  "id": "WO-217-D021",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-bf51ac5cd8143d98"
  ],
  "decision": "Exclude only untracked directory entries under protected docs/intake from the candidate tree.",
  "evidence": [
    "docs/evidence/WO-176/decisions.md#wo-176-d006",
    "packages/skeleton/src/gate-evidence.mjs untracked candidate inventory",
    "Ignored nested intake stays private and unmodified. Ordinary untracked source still changes identity; tracked gitlinks still refuse. The fixture runs an actual gate and consumes its row.",
    "repair-controls.json private-intake: node --test --test-name-pattern=^protected intake repositories scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Ignored nested intake stays private and unmodified. Ordinary untracked source still changes identity; tracked gitlinks still refuse. The fixture runs an actual gate and consumes its row."
    }
  ],
  "reopenWhen": "Protected intake changes gate identity or ordinary source stops participating."
}
```

## WO-217-D022

```json
{
  "id": "WO-217-D022",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-c1a89d52cc314af9"
  ],
  "decision": "Do not hot-swap a live guard merely because another checkout has different code.",
  "evidence": [
    "docs/evidence/WO-185/decisions.md#wo-185-d014--held-descriptor-watches-and-the-recycled-identity-correction",
    "scripts/lib/host-guard-state.mjs live owner reuse; WO-185-D014 version and ownership-history evidence",
    "A reused live guard can retain older rules until it exits. Automatic replacement would lose in-memory ownership history and let concurrently used versions replace one another. NoOp keeps one live owner; an idle guard can exit through the existing idle stop route. No shared guard is forcibly stopped by this order."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "A reused live guard can retain older rules until it exits. Automatic replacement would lose in-memory ownership history and let concurrently used versions replace one another. NoOp keeps one live owner; an idle guard can exit through the existing idle stop route. No shared guard is forcibly stopped by this order."
    }
  ],
  "reopenWhen": "A versioned migration protocol preserves ownership history and defines compatible old/new clients, or an operator explicitly authorizes a coordinated idle upgrade."
}
```

## WO-217-D023

```json
{
  "id": "WO-217-D023",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-cb5c3b3e7d0b0c0d"
  ],
  "decision": "Retain the qualified colocated default export and decline claiming relocated build-free local-lane support.",
  "evidence": [
    "docs/evidence/WO-202/decisions.md#wo-202-d005",
    "WO-202-D005 default-export qualification and named unresolved readers; packages/skeleton/src/gate-evidence.mjs gateRunsDirectory",
    "The build-free gate, teardown and continuation readers still use the default local lane; separate tool and launchpad roots remain a known unsupported composition. Moving only one reader would split control state. NoOp preserves the qualified export without falsely extending it."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The build-free gate, teardown and continuation readers still use the default local lane; separate tool and launchpad roots remain a known unsupported composition. Moving only one reader would split control state. NoOp preserves the qualified export without falsely extending it."
    }
  ],
  "reopenWhen": "A declared instance requires relocated local roots and a coordinated reader/probe migration is specified and tested."
}
```

## WO-217-D024

```json
{
  "id": "WO-217-D024",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-cb922b59e013dbf1"
  ],
  "decision": "Retain full runtime-package inventory snapshots already implemented at the base.",
  "evidence": [
    "docs/evidence/WO-123/decisions.md#wo-123-d017--boarded-the-harness-runtime-snapshot-misses-unlisted-transitive-imports",
    "scripts/lib/harness.mjs runtimePackageInventory and base declared-runtime-package fixture",
    "The base fixture observes additional and changed runtime files within the declared product-read boundary. No new inventory implementation is needed.",
    "repair-controls.json base-runtime-inventory: node --test --test-name-pattern=^declared runtime packages preserve scripts/test-harness.mjs; already-met; positive exit 0; exact base implementation, output 5e3c33e0aa39d6adc98505fb24042310335db9c9cb813045103f71951a1028e9"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The base fixture observes additional and changed runtime files within the declared product-read boundary. No new inventory implementation is needed."
    }
  ],
  "reopenWhen": "A runtime import executes bytes absent from the snapshot identity."
}
```

## WO-217-D025

```json
{
  "id": "WO-217-D025",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-cde72b7860c03c18"
  ],
  "decision": "Use recorded checkpoint references rather than assuming event ordinals equal checkpoint numbers.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d021--board-an-intermittent-off-ramps-fixture-failure",
    "scripts/test-off-ramps.mjs checkpoint block and correction cases; scripts/lib/checkpoint.mjs allocates from existing refs",
    "A deterministic blocked first checkpoint leaves event two owning checkpoint one; the wrong-SHA refusal and valid correction now use actual recorded refs. The earlier attempted tree-change repair failed its paired control and was replaced. The original environmental cause remains unknown; the fragile assumption is removed.",
    "repair-controls.json checkpoint-subject: node docs/evidence/WO-217/control-fixture.mjs scripts/test-off-ramps.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A deterministic blocked first checkpoint leaves event two owning checkpoint one; the wrong-SHA refusal and valid correction now use actual recorded refs. The earlier attempted tree-change repair failed its paired control and was replaced. The original environmental cause remains unknown; the fragile assumption is removed."
    }
  ],
  "reopenWhen": "The case fails with a recorded checkpoint despite ordinal-independent selection."
}
```

## WO-217-D026

```json
{
  "id": "WO-217-D026",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-d0a9719cc2e4ec55"
  ],
  "decision": "Retain the polling and descriptor ownership guard without claiming absolute descendant containment; present the operator-owned host mechanism choice on this order’s pull request.",
  "evidence": [
    "docs/evidence/WO-185/decisions.md#wo-185-d006--recorded-survivor-guarantee-limitation",
    "WO-185-D006 native double-fork counterexample and SDK constraint; docs/product/07-execution-guide.md Discipline; handoff.md packet FUP-d0a9719cc2e4ec55",
    "A descendant that closes every inherited mark before any observed ancestry edge can escape polling. No finite poll rate proves otherwise. Installing or authorizing a privileged OS event mechanism changes host settings outside this execution authority. The packet preserves the fixture and presents ordinary-authority choices."
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A descendant that closes every inherited mark before any observed ancestry edge can escape polling. No finite poll rate proves otherwise. Installing or authorizing a privileged OS event mechanism changes host settings outside this execution authority. The packet preserves the fixture and presents ordinary-authority choices."
    }
  ],
  "reopenWhen": "WO-217 pull request review: the operator chooses continued documented observational protection or explicitly authorizes a separately scoped OS ownership mechanism.",
  "reopens": {
    "decisionId": "WO-185-D006",
    "observation": "The row is explicitly adjudicated by WO-217; its absolute ownership choice requires an operator packet rather than an invented containment guarantee."
  }
}
```

## WO-217-D027

```json
{
  "id": "WO-217-D027",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-d5605723a86254eb"
  ],
  "decision": "Disable automatic Git maintenance on fixture commit and clone entry points.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d023--guard-the-beacon-portability-fixture-against-gits-detached-repack-and-board-the-sweep",
    "Maintenance sweep inventory and scripts/test-gate-followups.mjs Git trace fixture",
    "The sweep preserves test behavior and prevents detached maintenance escaping fixture teardown; a planted-loose-object trace proves the representative fixture starts no maintenance child.",
    "repair-controls.json fixture-maintenance: node --test --test-name-pattern=^fixture commits suppress scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The sweep preserves test behavior and prevents detached maintenance escaping fixture teardown; a planted-loose-object trace proves the representative fixture starts no maintenance child."
    }
  ],
  "reopenWhen": "A fixture Git operation starts automatic maintenance or a new helper omits the setting."
}
```

## WO-217-D028

```json
{
  "id": "WO-217-D028",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-de6162b279f66709"
  ],
  "decision": "Retain completion’s already implemented consumption of document evidence without an inline gate.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d043--recording-a-verification-result-waits-on-another-worktrees-test-lanes",
    "scripts/lib/handoff-ledger.mjs and base scripts/test-verifier-gate-claims.mjs fixture",
    "The base CLI fixture makes any gate execution throw and proves completion consumes current rows. This removes the old host-lane wait at the transition itself; required explicit gates still wait normally.",
    "repair-controls.json base-completion-claims: node docs/evidence/WO-217/control-fixture.mjs scripts/test-verifier-gate-claims.mjs; already-met; positive exit 0; exact base implementation, output c4e5a41c6b5b26a5a78d096b9f33611bd71f306ca79278008546952e6a2f6195"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The base CLI fixture makes any gate execution throw and proves completion consumes current rows. This removes the old host-lane wait at the transition itself; required explicit gates still wait normally."
    }
  ],
  "reopenWhen": "A completion command starts a document gate or consumes a stale row."
}
```

## WO-217-D029

```json
{
  "id": "WO-217-D029",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-e18e6a5422109bfb"
  ],
  "decision": "Republish a missing live guard record under its held lock and retire unadopted startup children.",
  "evidence": [
    "docs/evidence/WO-118/decisions.md#wo-118-d011--repair-dispatch-run-the-witnessed-rerun-and-restore-the-host-guard",
    "scripts/host-guard.mjs; scripts/lib/host-guard-state.mjs; missing-record fixture",
    "A registration reuses the restored owner; the owner keeps observation history. The start path cleans a child that was not adopted on reuse, failure or timeout.",
    "repair-controls.json guard-record: node --test --test-name-pattern=^a live guard restores scripts/test-host-guard.test.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A registration reuses the restored owner; the owner keeps observation history. The start path cleans a child that was not adopted on reuse, failure or timeout."
    }
  ],
  "reopenWhen": "A removed guard record strands registrations, or a startup failure leaves its own waiter alive."
}
```

## WO-217-D030

```json
{
  "id": "WO-217-D030",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-e821aa2ced3aa111"
  ],
  "decision": "Retain working aliases, bounded Git batches and strict effort spelling; decline speculative parser and transport rewrites.",
  "evidence": [
    "docs/evidence/WO-142/decisions.md#wo-142-d017--retain-the-remaining-observation-improvements-with-explicit-scope",
    "WO-142-D017 full five-part remainder; scripts/lib/git.mjs bounded transport; scripts/test-runner.mjs executeSuite reporters",
    "The grouped source records presentation gaps, deprecated compatible aliases, bounded aggregate capacity and whitespace aliases, without a supported-input failure. Current Node test tasks already install TAP and case reporting. NoOp avoids changing behavior or raising limits without measured demand; the real nested diagnostic defect is repaired separately."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The grouped source records presentation gaps, deprecated compatible aliases, bounded aggregate capacity and whitespace aliases, without a supported-input failure. Current Node test tasks already install TAP and case reporting. NoOp avoids changing behavior or raising limits without measured demand; the real nested diagnostic defect is repaired separately."
    }
  ],
  "reopenWhen": "A supported input reaches the batch bound, a compatibility alias is removed, or a real workload isolates parser/progress cost."
}
```

## WO-217-D031

```json
{
  "id": "WO-217-D031",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-e86366edbc1d5289"
  ],
  "decision": "Preserve sanitized command and nested error codes for console fetch failures without private token or argument material.",
  "evidence": [
    "docs/evidence/WO-112/decisions.md#wo-112-d056--preserve-the-unlocalized-loopback-failure-and-recheck-the-same-source",
    "packages/console/src/console-client.ts sanitized nested diagnostic traversal; scripts/test-gate-followups.mjs private-material exclusion case",
    "A nested TypeError/AggregateError/ECONNREFUSED fixture proves the diagnostic path. The original intermittent loopback cause remains unknown; no retries or effect replay are introduced. The complete/document runs judge ordinary shared execution.",
    "repair-controls.json nested-fetch-cause: node --test --test-name-pattern=^console transport retains scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A nested TypeError/AggregateError/ECONNREFUSED fixture proves the diagnostic path. The original intermittent loopback cause remains unknown; no retries or effect replay are introduced. The complete/document runs judge ordinary shared execution."
    }
  ],
  "reopenWhen": "A real loopback failure recurs; use the retained sanitized cause before proposing a runtime repair."
}
```

## WO-217-D032

```json
{
  "id": "WO-217-D032",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-e8f5399db33d0b5a"
  ],
  "decision": "Retain one handled set for stopped members, preserve in-memory resource-stop classification, report cleanup signal errors and distinguish registration withdrawal. Retain validated inherited leases.",
  "evidence": [
    "docs/evidence/WO-185/decisions.md#wo-185-d028--ver-004-residual-low-severity-observations-in-the-repaired-guard-and-runner-left-with-a-follow-up",
    "scripts/host-guard.mjs; scripts/lib/process-monitor.mjs; scripts/test-runner.mjs; base nested lease fixture",
    "Each changed behavior has a deterministic control; the base nested-lease case already proves lookup is not repeated after validation. A transient first inherited-lease read receives one retry; validated leases remain cached. The new control independently removes that retry.",
    "repair-controls.json handled-members: node --test --test-name-pattern=^a stopped candidate handles scripts/test-host-guard.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json signal-in-memory: node --test --test-name-pattern=^a signal after the in-memory scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json withdrawal-kind: node --test --test-name-pattern=^registration withdrawal scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json cleanup-signals: node --test --test-name-pattern=^task cleanup records denied scripts/test-host-guard.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json base-inherited-lease: node --test --test-name-pattern=^WO-185 a nested gate keeps its validated scripts/test-host-guard.test.mjs; already-met; positive exit 0; exact base implementation, output 6420a310254fccdde64647ab32844434c8e0d7457d2debcde10ac8b435df3579",
    "repair-controls.json inherited-entry-retry: node --test --test-name-pattern=^an inherited lease retries scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Each changed behavior has a deterministic control; the base nested-lease case already proves lookup is not repeated after validation. A transient first inherited-lease read receives one retry; validated leases remain cached. The new control independently removes that retry."
    }
  ],
  "reopenWhen": "Duplicate incidents, resource stops recorded as operator stops, lost kill errors, or a nested gate waits on its parent."
}
```

## WO-217-D033

```json
{
  "id": "WO-217-D033",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-eafff4f96686f67d"
  ],
  "decision": "Keep instance plain and review gates document-kind.",
  "evidence": [
    "docs/evidence/WO-213/decisions.md#wo-213-d025",
    "WO-213-D025 and scripts/kit/README.client.md; scripts/test-runner.mjs instance classification",
    "The instance harness check must read instruction and harness surfaces the product guard excludes. NoOp preserves the refusal of active-record writes while those gates run. Narrowing the exclusion set solely to permit concurrent report writing weakens the established read boundary without an observed need."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The instance harness check must read instruction and harness surfaces the product guard excludes. NoOp preserves the refusal of active-record writes while those gates run. Narrowing the exclusion set solely to permit concurrent report writing weakens the established read boundary without an observed need."
    }
  ],
  "reopenWhen": "A declared instance selection can be guarded with an equivalently demonstrated exclusion set and a measured benefit."
}
```

## WO-217-D034

```json
{
  "id": "WO-217-D034",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-f5f10101e717d59b"
  ],
  "decision": "Choose the latest comparable shared-ref snapshot rather than the latest wrapper row.",
  "evidence": [
    "docs/evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded",
    "scripts/test-runner.mjs completeSharedRefs predecessor filter",
    "A newer host row without snapshots no longer erases the runner’s prior comparison; the actual linked-worktree fixture reports origin/main movement once. The malformed-shape and incomplete-earlier-snapshot commands also pass against the exact base implementation, preserving the original defensive behavior.",
    "repair-controls.json shared-ref-predecessor: node --test --test-name-pattern=^WO-198 origin/main created scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json base-malformed-snapshots: node --test --test-name-pattern=^WO-198 (snapshot validation rejects|incomplete earlier snapshots) scripts/test-runner.test.mjs; already-met; positive exit 0; exact base implementation, output c24adf6edf56f4bcc7b581adf1c4378f46c301cbdef345866ef38289ed17adc6"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "A newer host row without snapshots no longer erases the runner’s prior comparison; the actual linked-worktree fixture reports origin/main movement once. The malformed-shape and incomplete-earlier-snapshot commands also pass against the exact base implementation, preserving the original defensive behavior."
    }
  ],
  "reopenWhen": "A wrapper row hides a known shared-ref change or an unreadable field is invented."
}
```

## WO-217-D035

```json
{
  "id": "WO-217-D035",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-851cba3a914ab359"
  ],
  "decision": "Sanitize copied evidence at every depth, classify sync failures before writing, retain named orphan revisions, and cover completion row states and the remaining bookkeeping clauses.",
  "evidence": [
    "docs/evidence/WO-216/decisions.md#wo-216-d034--final-review-pass-final-002-at-the-integrated-subject-one-operator-packet-and-ten-follow-ups-two-corrected-in-this-review",
    "scripts/test-worktree.sh actual finish copy; scripts/test-verifier-gate-claims.mjs; scripts/test-runner.test.mjs target claims; scripts/test-sync.mjs; scripts/test-target-worktree-start.mjs local terms/clone declarations",
    "The copy boundary strips passing output and retains failed diagnostics; F2 cases cover missing/stale/failed focused rows, stopped/failed complete reviews, an intervening review request, changed documents and prose-only claims, with the target contract’s existing fixture. Stop lookup, kit predecessor and skipped base-build decisions are repaired; local-terms/clone-declaration behavior is already exercised; release preparation inputs are registered for sync; the playbook states the current sequence.",
    "repair-controls.json copy-output: node --test --test-name-pattern=^copied gate evidence drops scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json sync-classification: node --test --test-name-pattern=^sync (refuses an unclassified|names the unselected orphan) scripts/test-sync.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json kit-predecessor: node --test --test-name-pattern=^a kit formats scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json doc-base-build: node --test --test-name-pattern=^document failure classification scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json base-completion-claims: node docs/evidence/WO-217/control-fixture.mjs scripts/test-verifier-gate-claims.mjs; already-met; positive exit 0; exact base implementation, output c4e5a41c6b5b26a5a78d096b9f33611bd71f306ca79278008546952e6a2f6195",
    "repair-controls.json base-target-claims: node --test --test-name-pattern=^target claims use only current target scripts/test-runner.test.mjs; already-met; positive exit 0; exact base implementation, output d7f35777c7573979a8521b70590c879ccdcdd5ab8b80c37850c702cc6eb07801",
    "repair-controls.json base-terms-and-clone: node --test --test-name-pattern=^worktree start (carries the main|names the local-terms) scripts/test-target-worktree-start.mjs; already-met; positive exit 0; exact base implementation, output d927dbc99772843a987916985befa01cc1bd0f5ad399195a95fb34388008a0fd",
    "repair-controls.json sync-declarations: node --test --test-name-pattern=^sync selection includes scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json finish-copy-output: bash scripts/test-worktree.sh; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json stopped-lookup: node --test --test-name-pattern=^a newly stopped evidence scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "WO-217-D087 repairs VER-001 F1 with repair-controls.json sync-real-checker-reports: scripts/test-sync.mjs real stale-report coverage passes with the repaired classifier and fails with only the two diagnostic patterns reverted; the real inventory fixture also regenerates sibling indexes to their expected bytes."
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The copy boundary strips passing output and retains failed diagnostics; F2 cases cover missing/stale/failed focused rows, stopped/failed complete reviews, an intervening review request, changed documents and prose-only claims, with the target contract’s existing fixture. Stop lookup, kit predecessor and skipped base-build decisions are repaired; local-terms/clone-declaration behavior is already exercised; release preparation inputs are registered for sync; the playbook states the current sequence."
    }
  ],
  "reopenWhen": "Any source clause regresses, an unknown sync failure runs a writer, or a close copies passing output."
}
```

## WO-217-D036

```json
{
  "id": "WO-217-D036",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-9de14a69403e2b32"
  ],
  "decision": "Make every named hand-copied control entry use a checked fixture-input declaration.",
  "evidence": [
    "docs/evidence/WO-216/decisions.md#wo-216-d032--bounded-follow-ups-taken-in-this-repair-and-the-two-left-with-a-follow-up",
    "scripts/test-control-copy-sites.fixture-inputs.json; scripts/check-registrations.mjs; copy-drift fixture",
    "Six declarations cover the five historical sites and the additional configured target-effects site. Registrations check the same closures and absent imports refuse before execution. Missing and stale compiled registration runtimes now name npm run sync; both diagnostic branches have a paired control.",
    "repair-controls.json copy-closure: node --test --test-name-pattern=^each hand-copied control entry scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json registration-remedies: node --test --test-name-pattern=^registration failures name sync scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Six declarations cover the five historical sites and the additional configured target-effects site. Registrations check the same closures and absent imports refuse before execution. Missing and stale compiled registration runtimes now name npm run sync; both diagnostic branches have a paired control."
    }
  ],
  "reopenWhen": "A copied entry is edited without its declared transitive closure or a declaration supplies absent files."
}
```

## WO-217-D037

```json
{
  "id": "WO-217-D037",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-fb8cbeabbddef397"
  ],
  "decision": "Retain per-run Markdown parsing; decline a persistent parse cache without a demonstrated end-to-end saving.",
  "evidence": [
    "docs/planning/entropy-reviews/REVIEW-004.md#candidates--accepted-entropy-reducer-findings-review-review-004-recorded-2026-09-30",
    "scripts/docs-check.mjs parseMarkdown callers; document-measurements.json before/after task and critical-path data",
    "The document gate is slower than the historical thresholds, but its wall time includes resume, host waiting and other suites. Three before and three after observations retain that cost. NoOp keeps exact current-document parsing and avoids cache invalidation machinery on an unisolated bottleneck; no parse-speed improvement is claimed."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The document gate is slower than the historical thresholds, but its wall time includes resume, host waiting and other suites. Three before and three after observations retain that cost. NoOp keeps exact current-document parsing and avoids cache invalidation machinery on an unisolated bottleneck; no parse-speed improvement is claimed."
    }
  ],
  "reopenWhen": "The document gate's fresh passing three-run median exceeds 120 s after WO-217, or an instrumented same-input comparison shows parsing on the critical path and a cache with complete invalidation wins the whole document gate."
}
```

## WO-217-D038

```json
{
  "id": "WO-217-D038",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-211986cdaa9f8c4f"
  ],
  "decision": "Retain the already implemented one explicit final document check and no inline completion check.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-with-the-operators-comments-recorded-2026-10-17",
    "Base completion CLI fixture and document-measurements.json",
    "Base transition fixtures prove current rows are consumed without running a gate. The three before/after samples are measurement overhead required by this order, not a new lifecycle rule or a claimed reduction in total runs.",
    "repair-controls.json base-completion-claims: node docs/evidence/WO-217/control-fixture.mjs scripts/test-verifier-gate-claims.mjs; already-met; positive exit 0; exact base implementation, output c4e5a41c6b5b26a5a78d096b9f33611bd71f306ca79278008546952e6a2f6195"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Base transition fixtures prove current rows are consumed without running a gate. The three before/after samples are measurement overhead required by this order, not a new lifecycle rule or a claimed reduction in total runs."
    }
  ],
  "reopenWhen": "A lifecycle command starts a duplicate gate, or a closed order records more than twenty document-gate runs after WO-217."
}
```

## WO-217-D039

```json
{
  "id": "WO-217-D039",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-16ba63c02aa91dfa"
  ],
  "decision": "Hold full exclusive host capacity while lending overlap to nested light peers, state the conservative per-lane bare/session budget, and give the gate-share refusal remedy.",
  "evidence": [
    "docs/evidence/WO-222/decisions.md#wo-222-d021--final-review-pass-final-001-at-the-integrated-subject-the-cross-gate-overlap-lease-leads-three-boarded-follow-ups",
    "scripts/test-runner.test.mjs independent gate reservation; scripts/test-gate-followups.mjs host remedy; product 07 Preflight",
    "The independent-gate fixture cannot acquire the reserved gap while exclusive work runs. The budget policy treats unwrapped work as one task, not a whole parallel gate. The host refusal names the share and when host capacity makes it infeasible. Retention is conditional on the fresh complete-run threshold specified by the order. The actual guard loop on a synthetic sixteen-processor, sixteen-GiB host enforces a one-GiB bare-group budget against a two-GiB group; that behavior is demonstrated at the exact base.",
    "repair-controls.json exclusive-reservation: node --test --test-name-pattern=^an exclusive gate reserves scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json host-remedy: node --test --test-name-pattern=^host refusal supplies scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json base-bare-group-budget: node --test --test-name-pattern=^the guard applies the per-lane scripts/test-gate-followups.mjs; already-met; positive exit 0; exact base implementation, output 9f362a5a9ffa608edda0febdae64d245989d7bc29201e7f8cd0004db47306fc6"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The independent-gate fixture cannot acquire the reserved gap while exclusive work runs. The budget policy treats unwrapped work as one task, not a whole parallel gate. The host refusal names the share and when host capacity makes it infeasible. Retention is conditional on the fresh complete-run threshold specified by the order. The actual guard loop on a synthetic sixteen-processor, sixteen-GiB host enforces a one-GiB bare-group budget against a two-GiB group; that behavior is demonstrated at the exact base."
    }
  ],
  "reopenWhen": "A fresh complete run exceeds 1668.518 seconds, another gate occupies the reserved overlap, or budget guidance admits an infeasible share."
}
```

## WO-217-D040

```json
{
  "id": "WO-217-D040",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-464d273fa299e979"
  ],
  "decision": "Decline a new-client-only fair queue while fixed-four clients publish no waiting intent.",
  "evidence": [
    "docs/evidence/WO-222/decisions.md#wo-222-d009",
    "scripts/lib/host-lanes.mjs holder-only registry and retry admission; WO-222-D009 fixed-four observation; docs/architecture/gate-execution.md mixed-version boundary",
    "Cross-gate waiting remains unbounded under contention. A queue cannot order a request that the older client never registers; shipping it as mixed-client fairness would be false. NoOp preserves compatibility and uninterrupted work without killing peers. A real migration must cover every admission path and preserve nested reservations."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "Cross-gate waiting remains unbounded under contention. A queue cannot order a request that the older client never registers; shipping it as mixed-client fairness would be false. NoOp preserves compatibility and uninterrupted work without killing peers. A real migration must cover every admission path and preserve nested reservations."
    }
  ],
  "reopenWhen": "A coordinated compatible client migration or intercepting adapter is authorized and demonstrates a bounded short-gate wait while complete work continues."
}
```

## WO-217-D041

```json
{
  "id": "WO-217-D041",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-66085a13c95d0f34"
  ],
  "decision": "Report malformed or invalid host capacity by record label, observed problem and a concrete repair route.",
  "evidence": [
    "docs/evidence/WO-222/decisions.md#wo-222-d018",
    "scripts/lib/host-resources.mjs recordedHostLaneCapacity",
    "Malformed JSON and out-of-range numbers refuse with one message; missing records retain the established fallback. Private host paths are omitted. The same diagnostic is exercised through both acquireHostLanes and memoryBudgets, not only the capacity parser.",
    "repair-controls.json capacity-diagnostic: node --test --test-name-pattern=^invalid host capacity scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Malformed JSON and out-of-range numbers refuse with one message; missing records retain the established fallback. Private host paths are omitted. The same diagnostic is exercised through both acquireHostLanes and memoryBudgets, not only the capacity parser."
    }
  ],
  "reopenWhen": "An invalid record lacks the label/remedy or a valid inherited capacity is rejected."
}
```

## WO-217-D042

```json
{
  "id": "WO-217-D042",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-86d6b525c49adce8"
  ],
  "decision": "Classify a task light only when every held sample meets both bounds.",
  "evidence": [
    "docs/evidence/WO-222/decisions.md#wo-222-d019",
    "scripts/test-runner.mjs lightSuiteNames and all-sample fixture",
    "An earlier heavy observation cannot be erased by a light latest sample. The current baseline’s one-sample-per-task shape is preserved; no historical samples are silently discarded. Retention follows the complete-run threshold.",
    "repair-controls.json light-all-samples: node --test --test-name-pattern=^a light latest sample scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "An earlier heavy observation cannot be erased by a light latest sample. The current baseline’s one-sample-per-task shape is preserved; no historical samples are silently discarded. Retention follows the complete-run threshold."
    }
  ],
  "reopenWhen": "Any held heavy sample is admitted as light or the fresh complete-run threshold fails."
}
```

## WO-217-D043

```json
{
  "id": "WO-217-D043",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-fa028783f3f6b17f"
  ],
  "decision": "Leave PR draft creation with the reviewer; release preparation updates a meter only in an existing draft and retains its separate snapshot.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-09-21",
    "scripts/test-release.sh prepare_independent; scripts/release.mjs prepare and regeneratedPullRequestBody",
    "Preparation previously created a meter-only PR draft before review. The fixture now proves no draft is created, existing reviewer text survives, and publication renders a missing meter block without changing the stored draft.",
    "repair-controls.json pr-draft-owner: bash scripts/test-release.sh --case prepare_independent; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Preparation previously created a meter-only PR draft before review. The fixture now proves no draft is created, existing reviewer text survives, and publication renders a missing meter block without changing the stored draft."
    }
  ],
  "reopenWhen": "Preparation creates an unreviewed draft or loses authored text or publication metering."
}
```

## WO-217-D044

```json
{
  "id": "WO-217-D044",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-3d6a8147368bdf1c"
  ],
  "decision": "Reject a legacy active marker when the observed process was born after the marker.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-onesie-twosie-pass-recorded-2026-09-27",
    "packages/skeleton/src/gate-evidence.mjs gateOwnerAlive",
    "Unavailable birth evidence stays conservative; read-only lookup never deletes another run’s marker. The current process with an old marker is a deterministic reused-PID counterexample.",
    "repair-controls.json legacy-marker: node --test --test-name-pattern=^a legacy gate marker scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Unavailable birth evidence stays conservative; read-only lookup never deletes another run’s marker. The current process with an old marker is a deterministic reused-PID counterexample."
    }
  ],
  "reopenWhen": "A later-born process revives a stale marker or unavailable observation is treated as proof of death."
}
```

## WO-217-D045

```json
{
  "id": "WO-217-D045",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-2518166a22767f47"
  ],
  "decision": "Remove invoking DOTLN_LAUNCHPAD from fixture suite environments.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-13",
    "scripts/lib/suite-evidence.mjs suiteEnvironment",
    "Fixture scripts resolve their own launchpad; the verified inherited host lease remains intact.",
    "repair-controls.json launchpad-environment: node --test --test-name-pattern=^fixture suites do not inherit scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Fixture scripts resolve their own launchpad; the verified inherited host lease remains intact."
    }
  ],
  "reopenWhen": "A fixture uses an invoking target’s launchpad or loses its legitimate lane lease."
}
```

## WO-217-D046

```json
{
  "id": "WO-217-D046",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-b202062fc3cbbbd7"
  ],
  "decision": "Store product read logs relative to the gate repository.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-13",
    "scripts/test-runner.mjs productReadLog and guard fixture",
    "Consumers resolve the relative record locally; copied rows no longer contain a machine-specific absolute read-log location.",
    "repair-controls.json relative-read-log: node --test --test-name-pattern=^WO-174 product read guard scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Consumers resolve the relative record locally; copied rows no longer contain a machine-specific absolute read-log location."
    }
  ],
  "reopenWhen": "A new row stores an absolute read-log path or a local consumer cannot resolve it."
}
```

## WO-217-D047

```json
{
  "id": "WO-217-D047",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-d40313eade76b8af"
  ],
  "decision": "Apply the same legacy marker birth comparison to the reused-PID candidate.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-13",
    "packages/skeleton/src/gate-evidence.mjs gateOwnerAlive",
    "This is the same concrete defect as the no-birth-marker row; both rows share one discriminating control.",
    "repair-controls.json legacy-marker: node --test --test-name-pattern=^a legacy gate marker scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "This is the same concrete defect as the no-birth-marker row; both rows share one discriminating control."
    }
  ],
  "reopenWhen": "A process born after a marker makes that marker live."
}
```

## WO-217-D048

```json
{
  "id": "WO-217-D048",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-182984d482ca59ca"
  ],
  "decision": "Decline calling an unfinished five-close study complete or imposing a universal benchmark recipe from it. Retain its three observed closes and current executor cutoff.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-ideation-on-2026-10-16-recorded-2026-10-16",
    "Candidate disposition history from the three dated planning passes; product 07 Preflight retains the five-close rule",
    "The three recorded closes read complete-run/task-minute pairs 15/691, 14/684 and 13/229; their late structural/bookkeeping counts are 0, 0 and 2. Those are not five closes. WO-217 and WO-219 have not closed in this execution. NoOp retains the existing dated reopening rule in product 07 rather than inventing future measurements; this batch makes no universal gain claim."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The three recorded closes read complete-run/task-minute pairs 15/691, 14/684 and 13/229; their late structural/bookkeeping counts are 0, 0 and 2. Those are not five closes. WO-217 and WO-219 have not closed in this execution. NoOp retains the existing dated reopening rule in product 07 rather than inventing future measurements; this batch makes no universal gain claim."
    }
  ],
  "reopenWhen": "At the fifth actual close, judge the recorded three measures against 11 runs, 1.3 late failures and 545 task minutes; new observed evidence may reopen this declined candidate."
}
```

## WO-217-D049

```json
{
  "id": "WO-217-D049",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-a8cba0428eaf01a9"
  ],
  "decision": "Make all reviewer packet options viable under ordinary authority and state a safe default.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-fork-observations-pass-recorded-2026-10-18",
    "packages/skeleton/src/loadouts/contributor.ts; packages/skeleton/fixtures/wo217-role-baseline.json",
    "WO-217-D003 authorizes the profile sentence and a new linked role oracle. Historical snapshots are unchanged.",
    "repair-controls.json reviewer-packet: node --test --test-name-pattern=^reviewer packets carry scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "WO-217-D003 authorizes the profile sentence and a new linked role oracle. Historical snapshots are unchanged."
    }
  ],
  "reopenWhen": "A generated reviewer packet requires override to be viable or loses its safe default."
}
```

## WO-217-D050

```json
{
  "id": "WO-217-D050",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-9cfc2253779e6c92"
  ],
  "decision": "Retain an addressed diagnostic for failed complete runs and carry its verified content when worktree finish copies evidence.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-entropy-pass-recorded-2026-10-20",
    "scripts/test-runner.mjs failed check output; packages/skeleton/src/gate-evidence.mjs sourceRoot hydration; scripts/worktree.mjs finish",
    "Failed executed tasks and gate-level failure reasons produce the top-level log. Copying hydrates only a contained regular file whose content matches its addressed hash. Passing output is discarded.",
    "repair-controls.json complete-failure-log: node --test --test-name-pattern=^WO-198 origin/main created scripts/test-runner.test.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json copied-failure-log: node --test --test-name-pattern=^copied failed evidence scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "Failed executed tasks and gate-level failure reasons produce the top-level log. Copying hydrates only a contained regular file whose content matches its addressed hash. Passing output is discarded."
    }
  ],
  "reopenWhen": "A failed complete row lacks its diagnostic, a copied known log disappears, or an untrusted reference is followed."
}
```

## WO-217-D051

```json
{
  "id": "WO-217-D051",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-5f948dcc52e03082"
  ],
  "decision": "Offer the operatorAuthor declaration remedy only when no author is declared.",
  "evidence": [
    "docs/evidence/WO-223/decisions.md#wo-223-d018",
    "scripts/lib/contributions.mjs contributionSignoffRules; both fixture arms",
    "With an existing declaration, the failure names the already-exempt identity policy and the required sign-off instead of suggesting another exemption.",
    "repair-controls.json signoff-remedy: node --test --test-name-pattern=^contribution exemption follows scripts/test-license-surfaces.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "With an existing declaration, the failure names the already-exempt identity policy and the required sign-off instead of suggesting another exemption."
    }
  ],
  "reopenWhen": "A configured instance is told to redeclare the exemption to bypass another author’s sign-off."
}
```

## WO-217-D052

```json
{
  "id": "WO-217-D052",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-e2152db6dd056b4a"
  ],
  "decision": "Print the same conditional sign-off advisory after target start creates its launchpad worktree.",
  "evidence": [
    "docs/evidence/WO-223/decisions.md#wo-223-d020",
    "scripts/worktree.mjs startTargetWorktree and signoffAdvisory",
    "The target route and self route use one helper; the fixture runs both absent and declared operator-author cases.",
    "repair-controls.json target-signoff: node --test --test-name-pattern=^target start gives sign-off scripts/test-target-worktree-start.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The target route and self route use one helper; the fixture runs both absent and declared operator-author cases."
    }
  ],
  "reopenWhen": "Target start omits needed guidance or warns after the instance already declares its author."
}
```

## WO-217-D053

```json
{
  "id": "WO-217-D053",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-f1c7a256bec46737"
  ],
  "decision": "Shorten repeated role wording while preserving every duty, command, exception, authority limit and ceiling.",
  "evidence": [
    "docs/evidence/WO-054/decisions.md#wo-054-d006",
    "role-wording.json; role-efficiency.json; scripts/test-gate-followups.mjs bounded role wording case and its scoped fourteen-string reversal; WO-217-D061",
    "WO-217-D061 records the operator choice. Fourteen reviewed wording changes reduce the verifier and reviewer profiles by 402 UTF-8 bytes each. After D080 clarifies the scheduling priority contract, the executor saves 391 bytes, with smaller reductions in the other roles. The executor has 424 bytes of headroom and reviewer 281 under unchanged ceilings. Both independent workers found no lost obligation. This measures startup bytes only, not total tokens or elapsed time.",
    "repair-controls.json bounded-role-efficiency: node --test --test-name-pattern=^bounded role wording scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "WO-217-D061 records the operator choice. Fourteen reviewed wording changes reduce the verifier and reviewer profiles by 402 UTF-8 bytes each. After D080 clarifies the scheduling priority contract, the executor saves 391 bytes, with smaller reductions in the other roles. The executor has 424 bytes of headroom and reviewer 281 under unchanged ceilings. Both independent workers found no lost obligation. This measures startup bytes only, not total tokens or elapsed time."
    }
  ],
  "reopenWhen": "A wording change loses a duty, a profile grows beyond its measured baseline, or executor/reviewer headroom falls below 256 bytes."
}
```

## WO-217-D054

```json
{
  "id": "WO-217-D054",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-da505c82f2262b8e"
  ],
  "decision": "Keep one instance-declared sign-off-exempt author and decline adding a second identity, as the operator chose.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-cleanup-pass-recorded-2026-09-19",
    "WO-217-D061 operator response; work-order-map cleanup-pass candidate 7; scripts/lib/contributions.mjs contributionSignoffRules and its declared-author fixture",
    "GitHub Update branch commits without the required sign-off can still refuse publication. The operator explicitly selected the recommended option to retain one exempt author in WO-217-D061. Conditional guidance now explains the existing policy without expanding it. This NoOp preserves the known publication restriction."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "GitHub Update branch commits without the required sign-off can still refuse publication. The operator explicitly selected the recommended option to retain one exempt author in WO-217-D061. Conditional guidance now explains the existing policy without expanding it. This NoOp preserves the known publication restriction."
    }
  ],
  "reopenWhen": "The operator explicitly chooses a second exemption and its identity, or a refused publication supplies a concrete alternative preserving the existing sign-off policy."
}
```

## WO-217-D055

```json
{
  "id": "WO-217-D055",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-ec72b2ea596bdc75"
  ],
  "decision": "Say explicitly that judgment reuse grants no authority to edit judged planning text.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-with-5s-and-the-operators-notes-recorded-2026-10-02",
    "scripts/test-gate-followups.mjs planner judgment reuse never authorizes edits to judged text; packages/skeleton/src/loadouts/contributor.ts",
    "The procedure now requires a hold disposition or an operator-authorized amendment before edits and limits reuse to a still-valid subject. The new linked role oracle retains every historical baseline.",
    "repair-controls.json planner-repair-authority: node --test --test-name-pattern=^planner judgment reuse scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The procedure now requires a hold disposition or an operator-authorized amendment before edits and limits reuse to a still-valid subject. The new linked role oracle retains every historical baseline."
    }
  ],
  "reopenWhen": "A planner reads the sentence as permission to change judged text, or a valid hold/amendment route is lost."
}
```

## WO-217-D056

```json
{
  "id": "WO-217-D056",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-6c4cc63ae71d02ad"
  ],
  "decision": "Classify the remainder after canonical publish material arguments, identify dry-run material use, and display the host-permission boundary once.",
  "evidence": [
    "docs/evidence/WO-223/decisions.md#wo-223-d017",
    "scripts/test-harness.mjs WO-178 exact close helper admission requires the recorded dispatch, main and legal order; packages/skeleton/src/harness-host.ts",
    "All four admitted forms and existing mismatch cases remain. Added cases distinguish a valid material argument followed by an extra flag and a material argument after dry-run. Two scoped controls independently prove classification and duplicate-text repairs.",
    "repair-controls.json release-close-classification: node --test --test-name-pattern=^WO-178 exact close helper scripts/test-harness.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json release-close-single-advisory: node --test --test-name-pattern=^WO-178 exact close helper scripts/test-harness.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "All four admitted forms and existing mismatch cases remain. Added cases distinguish a valid material argument followed by an extra flag and a material argument after dry-run. Two scoped controls independently prove classification and duplicate-text repairs."
    }
  ],
  "reopenWhen": "A withheld suffix is misclassified or the same boundary phrase is displayed twice."
}
```

## WO-217-D057

```json
{
  "id": "WO-217-D057",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-4b70089b028849f0"
  ],
  "decision": "Decline a partial natural-language lifecycle-trigger parser; retain explicit re-disposition by the observer and state that unexamined conditions remain unknown.",
  "evidence": [
    "docs/planning/entropy-reviews/REVIEW-005.md#candidates--accepted-entropy-reducer-findings-review-review-005-recorded-2026-10-02",
    "docs/planning/entropy-reviews/REVIEW-005.md ER5-002; its complete disposition history; scripts/lib/planning-conditions.mjs typed condition table and scripts/lib/planning-followups.mjs textual touching boundary",
    "The accepted ER5-002 record identified three missed triggers and the 2026-10-02 pass re-disposed all three. Its proposed anchored parser covered four rows and omitted the observed live-smoke trigger and wording variants. The harm remains: arbitrary prose conditions are not automatically evaluated, so later observers can miss a fired condition. NoOp avoids presenting four-row parsing as complete coverage; this order actually re-disposes every pending changed-file match it observes."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The accepted ER5-002 record identified three missed triggers and the 2026-10-02 pass re-disposed all three. Its proposed anchored parser covered four rows and omitted the observed live-smoke trigger and wording variants. The harm remains: arbitrary prose conditions are not automatically evaluated, so later observers can miss a fired condition. NoOp avoids presenting four-row parsing as complete coverage; this order actually re-disposes every pending changed-file match it observes."
    }
  ],
  "reopenWhen": "A subsequent planning or close pass leaves a named fired lifecycle trigger unchanged; compare an explicit typed condition with the anchored prose parser on that concrete example."
}
```

## WO-217-D058

```json
{
  "id": "WO-217-D058",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-8a4e201d861208ad"
  ],
  "decision": "Retain immutable evidence and decline pruning or a new retention ceiling; retain the current explicit Codex thread-to-session readback.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-cleanup-pass-recorded-2026-09-19",
    "work-order-map cleanup-pass candidate 15 and its complete disposition history through 2026-10-20; packages/skeleton/src/usage-observation.mjs; scripts/test-codex-session.mjs explicit-thread and latest-turn fixtures; temporary-attacks.json and repair-controls.json",
    "Evidence volume remains a reading/storage cost. The latest source review distinguishes criterion-required measured runs and paired controls from disposable diagnostics and retains the earlier planning decision against pruning under operator delegation. This order keeps temporary attack scripts and raw logs outside tracked evidence, files discriminating controls required by criterion 2, and preserves every historical edition. The old session-identity clause is now examined: the current implementation joins the supplied thread through usageSessionKey, refuses another thread, and tests latest-turn selection without projecting private transcript material. No new identity mechanism or storage gain is claimed."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "Evidence volume remains a reading/storage cost. The latest source review distinguishes criterion-required measured runs and paired controls from disposable diagnostics and retains the earlier planning decision against pruning under operator delegation. This order keeps temporary attack scripts and raw logs outside tracked evidence, files discriminating controls required by criterion 2, and preserves every historical edition. The old session-identity clause is now examined: the current implementation joins the supplied thread through usageSessionKey, refuses another thread, and tests latest-turn selection without projecting private transcript material. No new identity mechanism or storage gain is claimed."
    }
  ],
  "reopenWhen": "The operator authorizes a concrete retention policy preserving immutable references; a week adds more than 10 MB of tracked evidence; two consecutive orders each commit more than 1 MB of distinct evidence blobs that no criterion required; measured reading or storage harm occurs regardless of whether criteria required the evidence; or a supplied Codex thread resolves another session."
}
```

## WO-217-D066

```json
{
  "id": "WO-217-D066",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-ea83176e777dd32f"
  ],
  "decision": "Declare the open Agent Skills format in runtime profiles, validate the generated native frontmatter, and name pinned target skills as convention inputs without effect authority.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-ideation-on-2026-10-16-recorded-2026-10-16",
    "WO-217-D065; full work-order-map 2026-10-16 candidate 11; https://agentskills.io/specification observed 2026-10-21; packages/compiler/src/harness.ts; scripts/test-gate-followups.mjs native Agent Skills profiles case; docs/repositories/README.md and product 03 Agent enablement skills.",
    "The prior profiles recorded only root and availability and accepted role names or descriptions outside the native format bounds. All Contributor and target-worker profiles now declare agent-skills; missing or unknown formats refuse. The generated two-field subset checks name syntax and length, directory agreement and description limits without a new YAML dependency. The repository-profile convention pins target skill directories and selected references and expressly denies effect authority to skill text or allowed-tools. Existing target-worker omission of DotLn lifecycle skills remains explicit.",
    "repair-controls.json skills-format: node --test --test-name-pattern=^native Agent Skills profiles scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json skills-frontmatter: node --test --test-name-pattern=^native Agent Skills profiles scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The prior profiles recorded only root and availability and accepted role names or descriptions outside the native format bounds. All Contributor and target-worker profiles now declare agent-skills; missing or unknown formats refuse. The generated two-field subset checks name syntax and length, directory agreement and description limits without a new YAML dependency. The repository-profile convention pins target skill directories and selected references and expressly denies effect authority to skill text or allowed-tools. Existing target-worker omission of DotLn lifecycle skills remains explicit."
    }
  ],
  "reopenWhen": "A generated skill fails native format constraints, an observed target skill is missing from its pinned profile inputs, or skill metadata is treated as effect authority."
}
```

## WO-217-D068

```json
{
  "id": "WO-217-D068",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-441469088613e52a"
  ],
  "decision": "Decline adding or claiming a measured absence-curve allocator from the present starter; preserve the comparative experiment and its concrete reopening conditions.",
  "evidence": [
    "docs/planning/full-absence-curve-experiment-2026-09-24.md#candidate--test-the-full-rising-and-descending-operator-absence-curve",
    "Full candidate docs/planning/full-absence-curve-experiment-2026-09-24.md and FUP register history; packages/skeleton/src/actor-catalog.ts default portfolio; packages/skeleton/src/resident-host.ts constructor; docs/evidence/WO-118/handoff.md; product 03 absence curve.",
    "The present harm is the unmeasured product ambition: no comparison establishes accepted useful work, risk, review burden or mission drift across absence lengths, so no net-benefit or positive-downswing claim is supported. The full candidate demands a common candidate pool, pre-registered separate cost axes, return interruptions, budget and unavailable-adapter evidence, and operator benefit left unknown. The current actor catalog still constructs portfolioAdapter() without execution hosts; ResidentHost supplies a bound portfolio only when options.portfolio is supplied. WO-118 proves its bounded away loop, not automatic selection across eligible orders. Synthetic stage names would not settle that experiment. The NoOp avoids unmeasured scheduling policy while retaining these unknowns; no new live host binding or automatic policy is claimed."
  ],
  "rejected": [
    {
      "option": "Implement the proposed change",
      "reason": "The present harm is the unmeasured product ambition: no comparison establishes accepted useful work, risk, review burden or mission drift across absence lengths, so no net-benefit or positive-downswing claim is supported. The full candidate demands a common candidate pool, pre-registered separate cost axes, return interruptions, budget and unavailable-adapter evidence, and operator benefit left unknown. The current actor catalog still constructs portfolioAdapter() without execution hosts; ResidentHost supplies a bound portfolio only when options.portfolio is supplied. WO-118 proves its bounded away loop, not automatic selection across eligible orders. Synthetic stage names would not settle that experiment. The NoOp avoids unmeasured scheduling policy while retaining these unknowns; no new live host binding or automatic policy is claimed."
    }
  ],
  "reopenWhen": "A resident binds its portfolio actor to execution hosts over two or more eligible orders while presence is away, a resident receipt contradicts the curve product 03 states, the operator asks for the experiment, or comparative measurements select or rule out a profile."
}
```

## WO-217-D069

```json
{
  "id": "WO-217-D069",
  "date": "2026-10-21",
  "dispatch": "resume: next; row disposition",
  "rows": [
    "FUP-adf6621e7f958dd8"
  ],
  "decision": "New authority revisions reference an unchanged canonical transcript by path, Git blob identity and byte count; checks resolve the transcript while historical full editions remain immutable.",
  "evidence": [
    "docs/planning/entropy-reviews/REVIEW-004.md#candidates--accepted-entropy-reducer-findings-review-review-004-recorded-2026-09-30",
    "Full ER4-006 source and FUP history; packages/skeleton/src/evidence-editions.mjs readAuthorityEvidence/writeAuthorityEvidence; scripts/authority-evidence.mjs; scripts/test-gate-followups.mjs authority transcript references, authority evidence CLI writes a reference, and authority evidence refuses symlinked destination ancestors cases; scripts/test-sync.mjs stale bundle fixture.",
    "The current repeated copies consume working-tree bytes; identical Git blobs already deduplicate in Git and no clone/fetch reduction is claimed. The new writer emits a small authority.ref.json for a transcript equal to the selected predecessor, flattens references, and preserves full bodies when they change. The reader checks schema, relative paths, regular-file containment and byte/blob identity, with exact Git blob fallback. Existing full records remain readable. Destination ancestors are checked before a full body or reference is written, and the sync stale-output fixture damages bundle metadata rather than a malformed reference.",
    "repair-controls.json authority-reference-encoding: node --test --test-name-pattern=^authority transcript references scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json authority-cli-reference: node --test --test-name-pattern=^authority evidence CLI writes scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1",
    "repair-controls.json authority-destination: node --test --test-name-pattern=^authority evidence refuses scripts/test-gate-followups.mjs; demonstrated; positive exit 0; reverted exit 1"
  ],
  "rejected": [
    {
      "option": "Keep the observed behavior without this disposition",
      "reason": "The current repeated copies consume working-tree bytes; identical Git blobs already deduplicate in Git and no clone/fetch reduction is claimed. The new writer emits a small authority.ref.json for a transcript equal to the selected predecessor, flattens references, and preserves full bodies when they change. The reader checks schema, relative paths, regular-file containment and byte/blob identity, with exact Git blob fallback. Existing full records remain readable. Destination ancestors are checked before a full body or reference is written, and the sync stale-output fixture damages bundle metadata rather than a malformed reference."
    }
  ],
  "reopenWhen": "A new identical authority transcript is copied rather than referenced, a historical full record no longer resolves, a reference resolves bytes with a different identity, or a destination can escape its repository through a symlink."
}
```

<!-- row-dispositions:end -->

## WO-217-D083

```json
{
  "id": "WO-217-D083",
  "date": "2026-10-21",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 at code identity 2cd81e4c8286ba58ba899a3eafc38ee59945749cfb68f20f5c8c759ef275c9f8. All seven criteria are met as written. All 70 controls of repair-controls.json reproduce in disposable copies. F1 (blocking; the change breaks behavior main had): FUP-851cba3a914ab359's F3 repair lets npm run sync run a writer only when reportedStale in scripts/lib/generated-artifacts.mjs recognizes the check's output. Three stale reports that the inventory's own checkers print are not recognized, and each names its artifact's regeneration route. (1) The siblings pattern expects 'run npm run siblings -- index', but scripts/siblings.mjs prints 'run node scripts/siblings.mjs index' (COMMAND, line 49), and package.json has no siblings script. (2) The siblings manifest-hash report ('<path>: the <id> entry records manifest hash …; run node scripts/siblings.mjs index') matches neither form. (3) The work-orders report '<path>: missing or malformed tag snapshot; run npm run work-orders -- index' does not match the index pattern. So when a launchpad export or update adds a sibling receipt, the structural phase says 'Run npm run sync; stale artifacts: siblings', and sync then refuses with 'check did not report stale; repair the check before regenerating'. Main regenerated the index.",
  "evidence": [
    "docs/evidence/WO-217/verification-001/sync-stale-probe.mjs, under node scripts/harness.mjs bounded, makes line 3 of docs/siblings/README.md stale in each disposable copy. In both, the check prints 'error: docs/siblings/README.md is stale at line 3; run node scripts/siblings.mjs index'. Subject copy (code identity 2cd81e4c…): checkArtifact returns stale false, and syncArtifacts records siblings 'unknown -> unknown refused: check did not report stale; repair the check before regenerating'. Base copy (a54f8d65): syncArtifacts records siblings 'stale -> current regenerated', and the README returns to its original bytes. Both copies were restored.",
    "docs/evidence/WO-217/verification-001/stale-classification-probe.mjs feeds real checker messages to the subject's checkArtifact through its injectable runner. Not stale: both siblings forms, and the work-orders missing or malformed tag snapshot report. Stale: the work-orders 'is stale at line', meta, lineage and harness drift reports.",
    "scripts/sync.mjs lines 154 to 164 hold the new refusal. Main's loop ran the writer on any nonzero check that did not time out. scripts/structural-checks.mjs line 110 tells every gate to run npm run sync for each stale artifact.",
    "The sync-classification control (scripts/test-sync.mjs) passes. It drives planted checks that print DOTLN_ARTIFACT_STALE, not the inventory's real checker messages."
  ],
  "rejected": [
    {
      "option": "Route F1 as a follow-up",
      "reason": "Product 07 §Verification review and attack makes a change that breaks behavior main had, shown by a probe, blocking. Main regenerated a stale siblings index through npm run sync, and the subject refuses it."
    },
    {
      "option": "Mark a criterion unmet",
      "reason": "Criterion 2's case for this row exists and discriminates, and npm test passes. The defect is a real stale report that no case drives."
    },
    {
      "option": "Repair the pattern in this verification",
      "reason": "A verifier never edits the implementation it judges."
    }
  ],
  "followup": "WO-217's repair, inside its declared surfaces (step 12: scripts/sync.mjs and its classifier in scripts/lib/generated-artifacts.mjs). Rule a repair must hold: every stale report that a regenerable inventory artifact's own checker prints is classified stale, so sync runs that artifact's writer, as main did. That includes both siblings forms and the work-orders missing or malformed tag snapshot report. A crash, timeout, unreadable input or unrelated failure still refuses its writer, as FUP-851cba3a914ab359's rule requires. A case under a Preflight suite drives each regenerable artifact's real checker, or each of its real stale messages, through the classifier, and fails without the fix. For siblings, syncArtifacts regenerates the index to its expected bytes. Classification the checker owns, such as printing DOTLN_ARTIFACT_STALE <name> with its report, would keep a reworded remedy from disabling regeneration. Re-record the sync-classification control with the new case.",
  "reopenWhen": "A repair makes every listed report classify stale and adds the discriminating case, or a regenerable artifact's real stale report is again refused by sync."
}
```

## WO-217-D084

```json
{
  "id": "WO-217-D084",
  "date": "2026-10-21",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F2 (follow-up; the control record's accuracy; breaks no criterion). Eleven controls in repair-controls.json name a suite that does not run their file. Two literal reversions no longer apply to the subject, because npm run format reformatted the replaced text after the controls ran. Every file does run under a suite the Preflight line names, and both controls reproduce with the formatted text, so criterion 2 holds.",
  "evidence": [
    "Recorded process-debt; the file runs in harness-fixtures: hedge-occurrences, single-flag-identity, command-prefix-identity and nonnegative-gate-duration (scripts/test-observed-facts.mjs). scripts/test-harness.mjs line 17 imports that file, and scripts/test-process-debt.mjs does not.",
    "Recorded process-debt; the file runs in runner-fixtures: guard-record, handled-members, cleanup-signals and base-inherited-lease (scripts/test-host-guard.test.mjs). scripts/test-runner.mjs expands runner-fixtures with it, and the complete row's runner-fixtures task lists its cases.",
    "Recorded runner-fixtures; the file runs in sync-fixtures: sync-classification (scripts/test-sync.mjs; scripts/test-runner.mjs line 1310).",
    "Recorded configuration-root: signoff-remedy runs in license-fixtures (scripts/test-license-surfaces.mjs; line 990), and target-signoff runs in target-worktree (scripts/test-target-worktree-start.mjs; line 962).",
    "checkpoint-subject (scripts/test-off-ramps.mjs) and release-close-classification (packages/skeleton/src/harness-host.ts): the recorded old text matches 0 times. After prettier it matches exactly once (verification-001/formatted-reversions.json), and both controls then reproduce."
  ],
  "rejected": [
    {
      "option": "Fail criterion 2 on the suite labels",
      "reason": "The criterion requires each case to run under a suite the Preflight line names. All eleven do, and each record names its exact command and file."
    },
    {
      "option": "Correct repair-controls.json in this verification",
      "reason": "The control record is the executor's evidence. A verifier writes only its own report and evidence."
    }
  ],
  "followup": "WO-217's repair, which re-records controls under D083 in any case; low priority. Rule a repair must hold: each control's suite names the runner suite that executes its command's file, as the suite table in scripts/test-runner.mjs resolves it. Each literal reversion applies to the subject it is filed against, or the record names the later formatting step and carries the formatted text. Reproduce with docs/evidence/WO-217/verification-001/control-replay.mjs.",
  "reopenWhen": "A paired-control record names a suite that does not run the control's file, or a filed literal reversion matches its subject zero times."
}
```

## WO-217-D085

```json
{
  "id": "WO-217-D085",
  "date": "2026-10-21",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F3 (follow-up; register reopening conditions; breaks no criterion). D037 declines FUP-fb8cbeabbddef397 with a reopening condition that drops the clause its allocation set: 'the document gate's median exceeds 120 s after it'. That clause holds now: this order's own after-median is 141.659 s. D038 settles FUP-211986cdaa9f8c4f as already met, and replaces its allocation's 'a closed order records more than twenty document-gate runs' with an unquantified 'run-count improvement is absent'. After WO-217, no register row watches the document gate's median.",
  "evidence": [
    "npm run plan -- followups --show FUP-fb8cbeabbddef397. The allocation at 2026-10-18T16:14:45.516Z reads 'WO-217 closes without a measured disposition, or the document gate's median exceeds 120 s after it.' The decline at 2026-10-21T03:18:25.661Z reads 'An instrumented same-input comparison shows parsing on the critical path and a cache with complete invalidation wins the whole document gate.'",
    "npm run plan -- followups --show FUP-211986cdaa9f8c4f. The allocation at 2026-10-18T16:14:45.602Z reads '…or a closed order records more than twenty document-gate runs after it.' The settlement reads 'A lifecycle command starts a duplicate gate or future measured close windows show the intended run-count improvement is absent.'",
    "document-measurements.json and README §Final measurements: the document gate medians are 162.763 s before and 141.659 s after. This worktree's gate index holds 10 test:docs rows since activation, 7 of them passing; the median of the 10 is 152.0 s.",
    "Both dispositions are otherwise sound. D037 records harm, evidence and a reversal condition. The run count of D038's row is under its twenty-run arm, and the base completion fixture shows document rows reused across transitions."
  ],
  "rejected": [
    {
      "option": "Fail criterion 2 or 3 on these rows",
      "reason": "D038's row asks about run count, which the base meets: completion consumes document rows, and this order recorded 10 runs. D037 carries a reversal condition, as criterion 3 asks. The defect is that the register lost a measured trigger, not a missing disposition element."
    }
  ],
  "followup": "The next planning pass, or WO-217's repair; low priority. Rule a repair must hold: one pending or declined register row keeps a measured trigger on the document gate's median. It is either the allocation's 120 s figure, or a recalibrated figure with its reason recorded, on FUP-fb8cbeabbddef397 or a named successor. FUP-211986cdaa9f8c4f keeps a numeric run-count trigger: the allocation's twenty runs per closed order, or a recalibrated count with its reason.",
  "reopenWhen": "A planning pass re-disposes either row with a measured trigger, or the document gate's fresh passing median is observed under 120 s at a closed order."
}
```

## WO-217-D086

```json
{
  "id": "WO-217-D086",
  "date": "2026-10-21",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F4 (follow-up; process-meter accuracy; breaks no criterion). The 58 row-disposition decisions D004 to D058, D066, D068 and D069 carry the dispatch label 'resume: next; operator-expanded WO-217'. scripts/lib/meta.mjs operatorDirections counts each of them as an operator scope expansion. WO-217's recorded operator directions therefore read 65 (npm run meta -- --check), and its PR.md meter row reads 60. The decisions themselves record three operator instructions: D002, D061 and D062. D003, D060, D063, D065 and D067 apply D002's standing instruction.",
  "evidence": [
    "node with operatorDirections from scripts/lib/meta.mjs. [{dispatch: 'resume: next; operator-expanded WO-217'}] counts 1 resumeScopeExpansion, and 'resume: next; complete-gate repair' counts 0.",
    "grep of docs/evidence/WO-217/decisions.md: 58 dispatches read 'resume: next; operator-expanded WO-217', 5 read 'resume: next; operator scope expansion', and one each read 'operator expansion WO-217-D002', 'explicit operator policy direction' and 'operator-requested temporary adversarial probes'.",
    "npm run meta -- --check prints 'operatorDirections 65 (Δ 65)'. docs/final-reviews/WO-217/PR.md's meter row reads Directions 60 (Δ 60).",
    "Planning receipt 2026-10-20-planning-4da1c641b31de35c-051 judges WO-217 by 'recorded operator corrections plus directions exceed WO-218's three'."
  ],
  "rejected": [
    {
      "option": "Correct the 58 dispatch labels in this verification",
      "reason": "The decisions are the executor's record. A verifier writes only its own report and evidence."
    },
    {
      "option": "Change the meta counter",
      "reason": "meta.mjs is outside this order's surfaces. The counter reads the label it was given, so the label is what to fix."
    }
  ],
  "followup": "WO-217's repair; low priority. Rule a repair must hold: a decision's dispatch names the dispatch that recorded it. An operator label appears only where the decision records an operator instruction. npm run meta then counts WO-217's operator steps from D002, D003, D060 to D063, D065 and D067, not from the 58 row dispositions. Correct the labels under the decisions file's same-day correction rule, then run npm run meta.",
  "reopenWhen": "An order's operatorDirections exceeds the number of its decisions that record an operator's words, or a planning receipt's direction-count condition is judged on such a count."
}
```

## WO-217-D087

```json
{
  "id": "WO-217-D087",
  "date": "2026-10-21",
  "dispatch": "resume: fix; VER-001 repair",
  "decision": "Repair stale-report classification in scripts/lib/generated-artifacts.mjs without widening the nonzero-exit admission rule. Recognize the real siblings index command, manifest-hash and generated tag-observation reports, and the work-order missing/malformed tag-snapshot report. Test every regenerable inventory checker message and actual sibling/index regeneration.",
  "evidence": [
    "VER-001 F1 and WO-217-D083 reproduce the lost main behavior. The repair reads scripts/siblings.mjs checkRegistry, readTagObservations, validateRecordedTags and writeRegistry, plus scripts/work-orders.mjs readTagSnapshot/checkIndex and every other regenerable checker message.",
    "scripts/test-sync.mjs: sync classifies real stale reports for every regenerable artifact and refuses unrelated failures. The inventory-coverage assertion includes every writer, evidence mint, publication writer and console regenerator; runtime uses its structured inspection. Non-1 exits, timeout/unavailability and unrelated failure cases retain refusal.",
    "scripts/test-sync.mjs: the real inventory checks stale artifacts, regenerates safe outputs, refuses manual changes and is byte-stable. Its added cases cover sibling page drift, manifest hash, absent/invalid/mismatched tag observations, and a missing work-order tag snapshot. The first bounded run passed those additions but exposed my incorrect authority-evidence assertion after intentional harness damage; the fixture now checks authority evidence before damaging its harness dependency. This is a test-order correction, not broader writer authorization.",
    "The repair adds no dependency, package-source edit, scheduler change or new command. scripts/lib/evidence-sources.mjs and FEEDBACK_SOURCE_PATHS do not register either edited code file; existing edition and live-feedback evidence remain subject to the generated checks. Product 07 Preflight states the stale-only writer boundary.",
    "repair-controls.json sync-real-checker-reports: the bounded control driver executed at 2026-10-21T13:25:43.552Z; positive exit 0, negative exit 1 with only the two diagnostic patterns reverted. Both arms executed exactly one test; the negative fails on the real missing/malformed tag-snapshot report.",
    "The same bounded driver compared current diagnostic compatibility with the existing explicit-marker mechanism: both arms accepted all 26 stale messages. Axis: required producer changes, not runtime speed. Keep the compatibility repair in one classifier; a required-marker migration would change the producer CLIs as well.",
    "The real inventory fixture passed at 2026-10-21T13:23:34.952Z, 217.863 s under the bounded wrapper. The subsequent test-only economy edit avoids six repeated whole-copy format checks inside its per-message index probes; both enclosing complete sync calls still use the real formatter. The complete review run judges that final fixture."
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "The independent real-checker probe shows sync refusing a stale sibling page that main regenerated."
    },
    {
      "option": "Run every writer after any failed check",
      "reason": "That would reopen the original unknown-failure defect, including unreadable inputs and crashed checks."
    },
    {
      "option": "Migrate every checker to a new required machine marker in this repair",
      "reason": "The existing marker remains accepted, but changing all producer CLIs would widen the repair. Current diagnostic compatibility is retained and the real-checker fixture guards the repaired producer/consumer boundary."
    }
  ],
  "reopenWhen": "A real regenerable checker report is refused, an unrelated failure authorizes a writer, or diagnostic evolution makes a producer-owned marker migration smaller than maintaining the existing compatibility reports."
}
```

## WO-217-D088

```json
{
  "id": "WO-217-D088",
  "date": "2026-10-21",
  "dispatch": "resume: fix; evidence correction",
  "decision": "Correct VER-001 F2 in repair-controls.json: eleven suite labels now name the suites that run their files, and the two literal reversions carry their formatted subject text. Keep historical run results and hashes as historical observations.",
  "evidence": [
    "WO-217-D084 and verification-001/formatted-reversions.json; each formatted old string was checked to occur exactly once in the current source before writing the correction. VER-001 replayed both formatted controls with positive exit 0 and negative exit 1.",
    "scripts/test-runner.mjs declares sync-fixtures, license-fixtures and target-worktree; its runner-fixtures expansion executes test-host-guard.test.mjs. scripts/test-harness.mjs imports test-observed-facts.mjs for harness-fixtures. Every corrected suite is already on the work-order Preflight line.",
    "Same-day correction: the original records confused a source-associated suite with the suite executing the test file, and retained pre-format literal text. The correction changes metadata only and does not pretend the historical hashes were measured again.",
    "A file-backed bounded audit at 2026-10-21T13:30:09.009Z read all 71 controls, found all 64 literal reversions matching their declared counts, and confirmed every named suite exists. It also read operatorDirections as 3. An earlier stdin invocation emitted no audit output and is not evidence of execution."
  ],
  "rejected": [
    {
      "option": "Leave the metadata because VER-001 reproduced the cases",
      "reason": "A later reviewer should be able to run the recorded command and apply its literal reversion directly."
    },
    {
      "option": "Rerun every unchanged control",
      "reason": "VER-001 independently replayed all seventy. The repair changes the sync path; that path gets new discriminating evidence, while untouched controls retain their observed results."
    }
  ],
  "reopenWhen": "A control command is not executed by its named suite or a literal reversion fails to match its recorded current subject."
}
```

## WO-217-D089

```json
{
  "id": "WO-217-D089",
  "date": "2026-10-21",
  "dispatch": "resume: fix; measured-trigger correction",
  "decision": "Restore the original measured reopening triggers without pretending that WO-217 improved parsing or eliminated gate cost. D037 and FUP-fb8cbeabbddef397 retain the fresh passing three-run document-gate median above 120 s; D038 and FUP-211986cdaa9f8c4f retain more than twenty document-gate runs per closed order.",
  "evidence": [
    "VER-001 F3, WO-217-D085 and both register allocation histories name the lost numeric triggers. document-measurements.json reports before/after gate medians 162.763/141.659 s, docs-check work 24.424/22.127 s and resume work 93.273/89.376 s.",
    "The 120 s trigger already holds in WO-217 and prompts this reconsideration. Retain D037’s measured NoOp: the whole gate, rather than a demonstrated parsing bottleneck, exceeds the threshold. A persistent parse cache still lacks a same-input whole-gate benefit and complete invalidation proof. The trigger remains visible for the next planning/closed-order observation; it is not recalibrated upward.",
    "Same-day correction: D037 and D038 narrowed numeric allocation conditions into nonnumeric prose. Their decision conditions and canonical register dispositions now retain the original numbers. Completion still consumes an existing current row and starts no inline gate."
  ],
  "rejected": [
    {
      "option": "Raise the median threshold to the observed 141.659 s",
      "reason": "No new service target or performance evidence justifies normalizing the slower result."
    },
    {
      "option": "Implement a parse cache as part of the trigger correction",
      "reason": "The measured component breakdown does not establish a net-benefit design; the report asks to preserve the trigger, not to invent that evidence."
    }
  ],
  "reopenWhen": "A measured document median above 120 s or more than twenty document-gate runs at a closed order is recorded, or a same-input complete-invalidation parsing experiment establishes a whole-gate benefit."
}
```

## WO-217-D090

```json
{
  "id": "WO-217-D090",
  "date": "2026-10-21",
  "dispatch": "resume: fix; dispatch-label correction",
  "decision": "Correct VER-001 F4 by labeling the 58 row dispositions as resume: next; row disposition and the five applications of standing authorization as resume: next; apply WO-217-D002. Only D002, D061 and D062 label actual operator instructions; normalize the latter two to operator direction. Preserve all instruction evidence and substantive decisions.",
  "evidence": [
    "WO-217-D086, the current operatorDirections implementation in scripts/lib/meta.mjs, and D002/D061/D062: these three records capture the operator’s scope instruction, policy answer and temporary-attack request. D003/D060/D063/D065/D067 apply D002 rather than capture five new instructions.",
    "Same-day correction: operator-expanded on each row described its inherited authority but was read by the meter as a fresh operator action. The dispatch field now identifies the action recorded; the decision and evidence fields retain the standing authority and its applications.",
    "The immutable VER-001 and its four finding decisions stay as filed. Canonical meta and release preparation regenerate their current projections; no historical measurement is silently rewritten. Any planning binding affected solely by corrected decision metadata is refreshed with amend-order against the unchanged authorized work-order bytes.",
    "npm run meta completed at observation cutoff 2026-10-21T13:22:42.013Z and reports operatorDirections 3 (previous filed verification: 65). The three normalized instruction records match the three operator instructions preserved in this order.",
    "The final followups --touching readback still has 148 pending, but FUP-d0a9719cc2e4ec55 became needs-review at source revision 4. scripts/lib/planning-followups.mjs hashes reopeningObservations into the source, and D026 is an observer of WO-185-D006. Correcting D026’s dispatch label therefore changes that aggregate source even though its containment evidence and operator packet are unchanged. Re-dispose the same operator deferral at revision 4, preserving D026 and the pull-request reopening condition."
  ],
  "rejected": [
    {
      "option": "Change the meter to ignore scope-expansion labels",
      "reason": "The counter correctly reads the labels it was given; changing it would affect unrelated orders."
    },
    {
      "option": "Delete operator instructions or collapse their substantive evidence",
      "reason": "The three actual instructions and their five applications explain the authorized work and must remain reviewable."
    }
  ],
  "reopenWhen": "The live operator-direction count differs from the decisions that actually record operator instructions, or correction of metadata changes a substantive authorization."
}
```

## WO-217-D091

```json
{
  "id": "WO-217-D091",
  "date": "2026-10-21",
  "dispatch": "resume: fix; current-identity retention correction",
  "decision": "Preserve the first passing repair review as sample 1 and complete the existing three-sample retention protocol at the repaired code identity. Keep the earlier series as historical evidence. Retention remains pending until all three fresh passing samples establish a median at or below 1668518 ms.",
  "evidence": [
    "The first repair command, npm test -- --review, passed at 2026-10-21T14:08:15.778Z, code identity f423dc2859a39989d4bfb219a4fa2d74d3771f49dfeefa8a2155a79272f9098e: 1827650 ms, 109 fresh tasks across 44 suites, zero reused, unrun or stale suites, unchanged identity and build output. Both the command and its renewed canonical waiter exited 0; the first waiter merely reached its documented 1200-second limit while the same gate continued.",
    "Same-day correction: I initially treated the earlier 1589498 ms median as sufficient because this repair changes no scheduler source. D081 explicitly rejects substituting an older identity's passing series after a fixture edit, and D039 reopens on a fresh complete run above 1668518 ms. The first repair run exceeds that value by 159132 ms, so the earlier carry-forward assumption is unsupported.",
    "D080 and D081 retain the first observation, preserve normal priority history, require three fresh complete passing reviews at one identity, and leave the 1668518 ms threshold unchanged. Samples 2 and 3 will run npm test -- --review --again --keep-going without source changes or priority-history resets. A failed test interrupts the series for repair; all attempts remain recorded.",
    "The first repair row's critical path is 1825969 ms: 1825550 ms task work and 419 ms waiting. It places sync-fixtures before the exclusive suites. These are observations, not a cause claim or a replacement for the remaining complete measurements. gate-runs.json records the first repair sample and preserves both earlier series."
  ],
  "rejected": [
    {
      "option": "Complete the repair using the older identity's median",
      "reason": "The predeclared protocol judges the current source, including fixture changes, and the new single-run reopening condition has fired."
    },
    {
      "option": "Discard the first repair run or raise the threshold",
      "reason": "Both would change the established measurement rule after observing the result."
    },
    {
      "option": "Change the scheduler immediately after one slow sample",
      "reason": "The three-sample median has not been measured. A source change now would confound that protocol without establishing its failure."
    }
  ],
  "reopenWhen": "The repaired current-identity three-sample median exceeds 1668518 ms, any sample omits required work, or a test failure requires another source repair."
}
```

## WO-217-D092

```json
{
  "id": "WO-217-D092",
  "date": "2026-10-21",
  "dispatch": "resume: fix; bounded fixture economy",
  "decision": "Reject the first repair timing candidate by its two-sample lower bound, preserve both passing correctness runs, and remove repeated checker and formatter work from the real sync fixture. Keep every case, actual artifact checker and writer, the three full inventory formatting checks, deadlines, scheduling policy and the 1668518 ms median limit. Judge the revised source on three fresh complete passing reviews, including the first.",
  "evidence": [
    "The first repair review passed 109 fresh tasks in 1827650 ms at 2026-10-21T14:08:15.778Z. The second passed the same 109 tasks in 1672341 ms at 2026-10-21T14:42:26.924Z. Both have code identity f423dc2859a39989d4bfb219a4fa2d74d3771f49dfeefa8a2155a79272f9098e, zero reuse, no unrun or stale suites, and unchanged source/build identities. With two observations above 1668518 ms, any third observation would give a median of at least 1672341 ms, 3823 ms above the limit. No third observation or three-sample median is claimed; gate-runs.json preserves this rejected partial series and its mathematical lower bound.",
    "The bounded historical-row comparison at 2026-10-21T14:55:25.144Z read all three implementation rows and repair sample 2. Several unchanged suites grew: harness-fixtures by 21442 ms, vertical statements by 15303 ms and launchpad update by 14438 ms over their prior medians; sync-fixtures grew by 25138 ms. Current total task work is 6178615 ms versus earlier totals 5898036, 5880175 and 5955341 ms. These observations do not establish a single cause or attribute the whole increase to the sync repair.",
    "A serial bounded comparison completed at 2026-10-21T14:54:23.556Z. Both arms executed and passed the complete real-inventory case, without changing the worktree. The baseline took 174839 ms and the pre-check-only candidate 173191 ms. Their six-damage phases took 13498 and 11538 ms and executed 24 and 18 actual index commands. Output hashes are a1ab754f01ab7d9e1f8844ccc86bbf4a08e54c99e77d4efe18ea4b9b6ba6106a and 5e11b0ed298d5517dc4d04fc66ed8a948865368d44b3718024360580f6c5c6d2. This one pair supports removing duplicate work, not a whole-gate speedup claim.",
    "scripts/sync.mjs already checks an artifact before writing and after a successful writer. The six real damage cases now assert the returned stale-to-current state, successful sync, regeneration action and exact restored bytes instead of launching an extra identical pre-check. The shared syncOne helper also isolates the three manual-refusal cases from unrelated whole-copy format checks; their real artifact checks and every refusal and byte-preservation assertion remain. Full sync before damage, after restoration and for byte stability still uses the actual formatter.",
    "The revised test changes code identity to c6c25ab842afcca0ea7950a40298df607c11cb81205149c0db6c1a244485212d. Adjacent item adjacent-0007 records the bounded scope, announcement and actor-attested steering boundary. Formatting and git diff --check pass. No task, timeout, admission rule, priority history or host setting is relaxed.",
    "The selected current-source command, node scripts/harness.mjs bounded -- node --test --test-reporter=tap '--test-name-pattern=^the real inventory checks stale artifacts' scripts/test-sync.mjs, passed at 2026-10-21T15:08:48.649Z: one test passed, none skipped, case duration 150194.184 ms and bounded duration 150289 ms. Log SHA-256 23cd5300090290ff46e832e16f312a9335d9fa8ff0a900f74e1776b27788d617. This validates the preserved assertions; the required current-source three-review median is still unmeasured at this cutoff.",
    "The revised c6c25ab842afcca0ea7950a40298df607c11cb81205149c0db6c1a244485212d series passed all 109 fresh tasks in each of three complete reviews, with zero reuse, no unrun or stale suites and unchanged source/build identities. Exact durations are 1819602, 1658259 and 1750028 ms; the median is 29 min 10 s when rounded, above the unchanged 1668518 ms limit. Both each command and its canonical waiter exited 0. gate-runs.json retains attempts 18 through 20 and records retention pass false. The fixture reduction is validated for correctness but does not discharge the complete-run retention obligation. No repair completion is recorded."
  ],
  "rejected": [
    {
      "option": "Run a third observation on the rejected candidate or repeat unchanged work hoping for a favorable result",
      "reason": "No possible third observation can make its median pass. The unfavorable observations are retained; no measured three-sample result is invented."
    },
    {
      "option": "Retain the pre-check-only reduction as sufficient timing proof",
      "reason": "Its measured local saving is small and the complete gate has not judged that source. The full fixture and the required complete series must judge the selected candidate."
    },
    {
      "option": "Change the scheduler, relax the threshold or remove fixture cases",
      "reason": "The measured duplication admits a narrower fixture repair. All cases, full inventory checks, priority rules and the original limit remain reviewable."
    }
  ],
  "reopenWhen": "The isolated cases cease to execute their real artifact checks, any preserved assertion fails, or the revised current-identity three-sample complete median exceeds 1668518 ms."
}
```

## WO-217-D093

```json
{
  "id": "WO-217-D093",
  "date": "2026-10-21",
  "dispatch": "resume: fix; retention diagnosis",
  "decision": "Preserve the failed current three-review retention result and leave the production scheduler unchanged after the bounded models fail to establish a sufficient candidate. Continue bounded fixture-cost diagnosis before selecting another source change. NoOp preserves passing correctness but leaves the explicit retention obligation unmet; neither another unchanged run nor a raised threshold is a remedy.",
  "evidence": [
    "The current three-run median is 1750028 ms versus the unchanged 1668518 ms limit. All three complete reviews pass correctness at c6c25ab842afcca0ea7950a40298df607c11cb81205149c0db6c1a244485212d. D092 and gate-runs.json retain these observations, the earlier rejected two-run candidate and both historical implementation series.",
    "A bounded comparison at 2026-10-21T16:43:45.644Z found total task work of 6187000, 6109882 and 6432468 ms. Sample 3 adds 322586 ms of task work over sample 2 across many unchanged suites. The largest increases are target close 43209 ms, judgment 28055 ms and statements 23860 ms. This does not establish a cause for the broad increase.",
    "The bounded host-wait readback reports maximum waits of 109, 111 and 9125 ms and summed task host-lane waits of 1306, 1340 and 13104 ms. The last run records a competing gate during early structural checks, but these observed waits do not explain the whole 91769 ms complete-run increase. Every task reports the same eight-slot capacity. No host setting or other process is changed.",
    "The bounded production-scheduler replay at 2026-10-21T16:51:03.791Z keeps all 109 measured durations, tasks, dependencies, file commands, slots, group limits and deadlines. The unchanged models are 1817656, 1656278 and 1736632 ms. Moving target close before start yields 1817656, 1622840 and 1726833 ms; prioritizing vertical and target groups at 70 and 60 makes no improvement alone, and combining these changes worsens the first and third modeled runs. The real median remains a failure; no model is gate evidence.",
    "A second bounded replay at 2026-10-21T16:54:09.512Z uses an isolated source copy whose only scheduler change holds free slots for the highest eligible multi-slot shared task. That change alone leaves all three modeled durations identical. Combined with the group priorities it worsens them to 1975820, 1777166 and 1876744 ms. The scratch prototype never replaces repository source. No proposed file order, priority or reservation change is selected.",
    "The fixed-work models omit host waits and process overhead and hold task durations constant under changed overlap; they cannot prove real throughput. D078 already records a measured fixture Git-wrapper cost. The next diagnosis reads the current publication fixture and its callers to identify a concrete bounded comparison; no unmeasured fixture rewrite is selected at this cutoff."
  ],
  "rejected": [
    {
      "option": "Accept the current passing correctness rows as complete retention evidence",
      "reason": "Their measured median exceeds the unchanged work-order limit."
    },
    {
      "option": "Apply the file-order, group-priority or slot-reservation prototypes",
      "reason": "The bounded comparisons do not recover the required time, and several combinations worsen modeled completion."
    },
    {
      "option": "Attribute the slowdown to another process or change host settings",
      "reason": "Only limited early host-lane waiting is observed; the broad task-work increase has no established cause."
    }
  ],
  "reopenWhen": "A bounded alternative demonstrates a credible same-work cost reduction; any selected source still owes discriminating tests and the predeclared three fresh complete reviews, retaining the first sample and normal priority history."
}
```

## WO-217-D094

```json
{
  "id": "WO-217-D094",
  "date": "2026-10-21",
  "dispatch": "resume: fix; bounded fixture transport economy",
  "decision": "Use a native shell dispatcher for ordinary Git calls in the shared publication fixture, preserving the existing Node remote-URL adapter and all forge and lifecycle behavior. Retain the failed D092 series and judge this source with three fresh complete passing reviews, including the first, under the unchanged 1668518 ms median limit and normal priority history.",
  "evidence": [
    "D093 rejected the scheduling prototypes. Reading scripts/test-target-publication-fixture.mjs and its target-worktree and exported-instance callers found an extra Node process on every ordinary local Git operation. Publication still needs the canonical remote-URL adapter and local transport mapping; removing those would invalidate the fixture.",
    "The bounded serial comparison completed at 2026-10-21T17:01:35.791Z. The existing real target-close ignore-policy case passed both arms: 38108 ms with the original wrapper and 17712 ms with the dispatcher. The scratch arm changes only the shared fixture transport helper; every original test assertion remains. forge-dispatch-economy.json records both output hashes and source hashes. This one pair establishes avoidable wrapper cost, not a complete-gate speedup or the cause of the entire earlier regression.",
    "The bounded parity comparison at 2026-10-21T17:03:25.224Z checks 15 commands in each arm. Exit statuses and stdout/stderr match after normalizing only independent fixture paths and a Git object name. Cases include apostrophes and spaces in paths, quoted and multiline argument values, repeated -c options, canonical fetch and push URLs, push-URL fallback, native remote behavior without the intercepted -C form, missing configuration and invalid-command failures, and an actual push plus ls-remote redirected to local repositories. All checks pass.",
    "The selected repository helper has exactly the candidate source hash. The original Node handler is unchanged and moves to git-remote-url.mjs. A POSIX shell function recognizes its existing -C root followed by -c options and remote get-url form; only that form starts Node. Every other call execs the discovered real Git executable with the original argument vector. The fake gh implementation and global URL mappings are unchanged. Adjacent item adjacent-0008 records the scope, announcement and actor-attested steering boundary.",
    "The selected current-source target-close case passes at 2026-10-21T17:04:07.244Z in 15 seconds when rounded (bounded duration 15248 ms), with one test passed and none skipped. Its exact command and log hash are in forge-dispatch-economy.json. evidenceSources lists this fixture in no evidence edition, and FEEDBACK_SOURCE_PATHS omits it; this fixture-only edit owes neither a deterministic edition re-mint nor another live feedback self-host episode. The final complete review remains required.",
    "Goal-alignment traps: preserve canonical remote identity and local-only transport by retaining their handler; preserve cases and deadlines rather than fitting the test to the timing limit; preserve all unsuccessful timing observations rather than resetting the result; and distinguish a paired-case saving from complete-run retention. NoOp preserves passing correctness but retains measured redundant process work and the unmet retention obligation. The scheduler, slot caps, host settings and original threshold are unchanged.",
    "The first complete review at 2026-10-21T17:37:53.421Z executed all 109 fresh tasks but failed the target-worktree publication and release files. Their existing fault cases rewrote JavaScript text in forge-bin/git, which had become the shell dispatcher, so both injections matched nothing. The observed assertions received status 0 when they required failure. This is a fixture compatibility defect in the selected change. The 15-command parity check did not cover those source-rewriting consumers. Attempt 21 and both failures remain in gate-runs.json; no retention sample or completion is claimed. D095 records the repair."
  ],
  "rejected": [
    {
      "option": "Remove the fake Git transport or route all remote observations directly to native Git",
      "reason": "The canonical public remote URL must remain observable while fixture transport resolves locally."
    },
    {
      "option": "Rewrite the remote-URL adapter in shell too",
      "reason": "The existing Node branch can remain byte-for-byte intact; the measured saving comes from avoiding it for unrelated commands."
    },
    {
      "option": "Repeat unchanged complete runs or discard the failed D092 series",
      "reason": "That does not remedy the measured overhead and would violate the predeclared retention protocol."
    }
  ],
  "reopenWhen": "Argument or transport parity fails, an existing fixture assertion fails, or the fresh current-identity three-review median exceeds 1668518 ms. No complete-run improvement is claimed before that series finishes."
}
```

## WO-217-D095

```json
{
  "id": "WO-217-D095",
  "date": "2026-10-21",
  "dispatch": "resume: fix; publication fixture injection repair",
  "decision": "Expose the retained Node adapter to the two existing fault cases, assert each injection changes its source, and preserve the native dispatcher for ordinary Git work. Retain failed complete attempt 21 and restart the three fresh complete reviews at the repaired identity, including the first and normal priority history, under the unchanged 1668518 ms median limit.",
  "evidence": [
    "Same-day correction: I treated the generated Git executable as having no source-rewriting consumers after checking ordinary command parity. The full review and scripts/test-target-worktree-publish.mjs near its wrongForge assertion, plus scripts/test-target-worktree-release.mjs near its disconnected assertion, show two consumers. Both replace Node text in forge.bin/git; after D094 that file is shell, so the replacement is unchanged and no fault reaches the product. The checked result is two failing fixture assertions, not a newly observed production refusal defect.",
    "Complete attempt 21 at 2026-10-21T17:37:53.421Z took 1811320 ms, ran all 109 tasks fresh, and failed those two tasks. The command and canonical waiter both exited 1. The source and build identities were unchanged; gate-runs.json retains its exact row/log hashes and task failures. No partial passing work is reused as a complete result.",
    "The helper now returns gitAdapter. The publication test mutates that file to report the wrong canonical remote URL. The release test reads the same unchanged Node adapter, adds its original accepted-then-disconnected fault, installs it at git for that one operation and restores the native dispatcher immediately afterwards. Each test asserts the mutation differs from the input. All original failure status, message, remote-ref, retained-tag, cleanup, release and retry assertions remain.",
    "The bounded current-source publication case passed at 2026-10-21T17:39:12.461Z in 34 seconds when rounded; the release case passed at 2026-10-21T17:39:37.775Z in 25 seconds when rounded. Each runs one complete existing test with zero skips. forge-dispatch-economy.json retains the exact commands, durations and output hashes.",
    "The repeated 15-command comparison at 2026-10-21T17:40:29.346Z compares the repaired helper with the hash-verified original Node helper from HEAD. All statuses and outputs remain equal after the same fixture-path and object-name normalization. The actual push and ls-remote still resolve only to local fixture repositories. A scripts/*.mjs search for forge-bin, gitWrapper and gitOriginal finds no other shared-wrapper mutation site beyond the two repaired consumers; the separate target-publish mock is not this helper.",
    "Adjacent-0008 revision 2 records the narrow three-file scope and the prior operator-facing announcement. Every edited source is absent from the registered evidence-edition arrays and FEEDBACK_SOURCE_PATHS, so this fixture compatibility repair owes no additional edition re-mint or live feedback episode. The complete reviews remain required.",
    "Goal-alignment traps: a successful command without its intended injected fault must not be mistaken for evidence of a refusal; the assertions now verify that the mutation applies. A focused pass cannot establish complete retention; the unchanged three-sample protocol follows. NoOp keeps two known fixture failures. The measured ordinary-Git improvement remains, while all unsuccessful observations, cases, deadlines, host settings and scheduling rules are preserved.",
    "Complete attempts 22 and 23 both pass all 109 fresh tasks across 44 required suites at code identity 0184557ece4a14b702f6f93e98338fdd2bea6660714502768b777ab4c1906884, with unchanged source/build identities, zero reuse and no stale or unrun suites. Their exact durations are 1904218 and 1674694 ms (31 min 44 s and 27 min 55 s when rounded). Both exceed the unchanged 1668518 ms limit, so even an arbitrarily fast third sample could not yield a passing three-sample median. The series is rejected after two samples; all observations and normal priority history remain. Correctness of the bounded fixture repair passes; overall repair completion remains outstanding."
  ],
  "rejected": [
    {
      "option": "Keep rewriting the shell dispatcher with Node-specific replacement text",
      "reason": "The two failing cases and exact replacement inputs demonstrate that this installs no fault."
    },
    {
      "option": "Remove the measured native-dispatch change entirely",
      "reason": "The failures have a bounded compatibility repair at the two source-rewriting consumers; ordinary-command parity and the existing close suite already pass."
    }
  ],
  "reopenWhen": "Either fault mutation stops applying, any preserved refusal or recovery assertion fails, or the current-identity complete-review median exceeds 1668518 ms."
}
```

## WO-217-D096

```json
{
  "id": "WO-217-D096",
  "date": "2026-10-21",
  "dispatch": "resume: fix; measured retention diagnosis",
  "decision": "Reject the D095 timing series by its two-sample lower bound and reject all tested higher-priority long-suite variants. Preserve the passing fixture compatibility repair and seek a measured same-work reduction before another full series.",
  "evidence": [
    "Complete attempts 22 and 23 both pass all 109 fresh tasks across 44 required suites at code identity 0184557ece4a14b702f6f93e98338fdd2bea6660714502768b777ab4c1906884, with unchanged source/build identities, zero reuse and no stale or unrun suites. Their exact durations are 1904218 and 1674694 ms (31 min 44 s and 27 min 55 s when rounded). Both exceed the unchanged 1668518 ms limit, so even an arbitrarily fast third sample could not yield a passing three-sample median. The series is rejected after two samples; all observations and normal priority history remain. Correctness of the bounded fixture repair passes; overall repair completion remains outstanding.",
    "The bounded production-scheduler replay at 2026-10-21T18:48:29.871Z compares unchanged scheduling with five priority-only alternatives over the three D092 rows and both D095 rows. Every arm preserves all 109 task durations, commands, dependencies, slots, groups, deadlines and priority leads. All 25 candidate results are slower than their same-observation control, by 7090 to 329141 ms. long-priority-comparison.json retains every result. No model is gate evidence, and no scheduler change is selected.",
    "The second D095 row places launchpad update on its computed critical path. Its starter-refresh case takes 135258 ms when rounded to integer milliseconds. Reading scripts/test-launchpad-update.mjs finds another fixture-only Node Git wrapper, installed for cleanup-fault cases but forwarding every ordinary Git operation through Node as well. A bounded serial original/candidate comparison will decide whether native forwarding provides a useful saving while retaining the exact fault handler and all existing assertions.",
    "Goal-alignment traps: a six-second miss is still a miss; do not raise the limit or discard the first sample. Fixed-duration simulations do not establish actual speed; reject unhelpful models. NoOp preserves correctness and the unmet retention condition. No host settings, thresholds, admission rules or task coverage change."
  ],
  "rejected": [
    {
      "option": "Run a third unchanged D095 sample",
      "reason": "Both existing durations exceed the limit, making a passing three-sample median mathematically impossible."
    },
    {
      "option": "Apply the tested higher base priorities",
      "reason": "Every modeled candidate is slower at every recorded observation."
    },
    {
      "option": "Attribute the failure to host contention",
      "reason": "The gate row and models establish costs and ordering, not a cause for changes in task duration."
    }
  ],
  "reopenWhen": "A bounded comparison shows a credible reduction without weakening fixture semantics; any selected source still owes current correctness and three fresh complete reviews retaining the first observation and fixed median limit."
}
```

## WO-217-D097

```json
{
  "id": "WO-217-D097",
  "date": "2026-10-21",
  "dispatch": "resume: fix; vertical fixture transport economy",
  "decision": "Use a native dispatcher for unchanged local Git calls in the shared vertical fixture, preserving the existing Node handler for pushes and changed, custom, missing or nested configurations. Retain all failed validation series and require three fresh complete passing reviews, including the first, under the unchanged median limit and normal priority history.",
  "evidence": [
    "D096 rejects the D095 series after its two correctness-passing durations both exceed the fixed limit, and rejects every tested higher-priority scheduling model. The launchpad cleanup-wrapper comparison subsequently passes both corrected arms in 1 min 45 s and 1 min 42 s, a small saving that does not justify another source change. vertical-dispatch-economy.json retains the exact observations and the corrected scratch-driver failure. That candidate is not applied.",
    "Reading scripts/fixtures/vertical/fixture.mjs, git.mjs and the vertical test consumers shows that every ordinary Git call starts Node and parses the same fixture configuration. The bounded serial comparison at 2026-10-21T19:55:24.509Z preserves the exact existing healthy-wording case and its assertions. It passes in 12 s with the original wrapper and 7 s with native dispatch when rounded; exact durations are 12239 and 7231 ms. The first scratch driver failed on import-only package resolution before running either arm; the corrected driver resolves the project manifests and changes no test body.",
    "The bounded actual-fixture parity comparison at 2026-10-21T19:57:27.285Z passes all 17 checks. These include ordinary Git operations, quoted and multiline arguments, repeated -c options, a literal push argument, invalid commands, actual push mapping to a local remote and remote-ref observation, custom Git from initial and changed configuration, self-recursion refusal, malformed or missing configuration, an absent configuration environment variable, and nested fixtures. Push-call logs match. Stable error classes are compared for configuration failures because adapter stack paths differ; ordinary output and status match after only synthetic path and object-name normalization. Every created fixture root is removed.",
    "The selected source exactly matches the measured candidate. It saves the initial configuration bytes and execs the discovered real Git only while the active fixture path and those bytes remain unchanged and the configured Git is the real executable. Every argument vector containing push and every failed guard goes through the unchanged git.mjs handler, with process.argv[1] restored to the original wrapper for its recursion check. Existing fixture cases, their assertions, deadlines, host policies and scheduling rules remain unchanged.",
    "A scripts/test-vertical*.mjs and scripts/fixtures/vertical/*.mjs search checks generated-Git and fixture-configuration consumers. The separate judgment init-fault wrapper delegates to the fixture executable; no consumer rewrites this generated Node source. Configuration mutation consumers retain the original adapter path. The actual evidenceSources arrays and FEEDBACK_SOURCE_PATHS omit scripts/fixtures/vertical/fixture.mjs, so this fixture-only edit owes neither another deterministic edition nor another live feedback episode.",
    "Adjacent-0009 records the one-file scope, announcement and actor-attested steering boundary. Goal-alignment traps: preserve push logging, URL mapping and dynamic fixture configuration through the guarded fallback; compare failures as well as success; do not treat one paired case as a complete-gate result; preserve the first observation and every rejected candidate. NoOp retains measured redundant process work and the unmet timing requirement. No threshold, host setting, suite, task, case or deadline is removed or loosened.",
    "The three fresh complete repair reviews at code identity 8d059c13c38513e0a55b4d3e931b086a13e76ef465f05389750af8d82623604a passed in 25 min 19 s, 25 min 3 s, 25 min 5 s; their median is 25 min 5 s, satisfying the unchanged limit recorded in gate-runs.json. Prose durations are rounded to whole seconds; that record retains the exact milliseconds. Each executed all 109 tasks across 44 required suites, with zero reuse, no unrun or stale suites, and unchanged source/build identities. Both the commands and canonical waiters exited 0. The last row is recorded at 2026-10-21T21:18:01.618Z. gate-runs.json retains every attempt, the first observation, normal priority history, all prior validation series, including the failed correctness and timing candidates. This establishes retention at the current subject, not a causal speedup or equal variance."
  ],
  "rejected": [
    {
      "option": "Apply the cleanup-wrapper candidate too",
      "reason": "Its single corrected pair saves only 3 s, while adding another independent fixture source change. The wider vertical-fixture candidate has a larger observed same-case saving."
    },
    {
      "option": "Forward every Git command directly",
      "reason": "Pushes log transport effects, and changed, malformed, custom and nested configurations must continue through their existing handler."
    },
    {
      "option": "Repeat the rejected D095 series unchanged or raise its limit",
      "reason": "Both observed durations already make a passing three-sample median impossible under the retained requirement."
    }
  ],
  "reopenWhen": "Any existing fixture assertion, argument or configuration parity fails, or the fresh current-identity three-review median exceeds 1668518 ms. The complete result, not the paired case, decides retention."
}
```

## WO-217-D098

<!-- integration refs/dotln/checkpoint/WO-217/10 -->

```json
{
  "id": "WO-217-D098",
  "date": "2026-10-21",
  "dispatch": "resume: final review; worktree integrate WO-217",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all a54f8d6520ed54d05e5209455c67541562716404 and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-217/10, 3066419c90e0f0863180e5980cc5fbcc2e23c0a7), retained its named stash d2b66056f9515acca2da40d62bb84458542d0ac1, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR meter block), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: docs/intake holds three tracked .gitkeep files and git status --ignored lists nothing else there. Every acceptance claim carries forward unchanged: the code identity after integration is 8d059c13c38513e0a55b4d3e931b086a13e76ef465f05389750af8d82623604a, the identity the repair handed off and VER-002 judged, so the three passing complete review rows at that identity (npm test with review selection, recorded 2026-10-21T20:26:59.854Z, 20:52:33.597Z and 21:18:01.618Z, each 109 fresh tasks over 44 required suites, exit 0) stand for the integrated tree and no second complete run is owed; the newest is the row final-review-result consumes. The three other printed affected checks pass on the integrated tree. The component-version bumps collide with nothing: main's compiler, skeleton and console at a54f8d65 are 0.28.0, 0.63.1 and 0.4.3, the subject stages 0.29.0, 0.64.0 and 0.4.4 with the workspace pins following, the integration fetched origin's tags, and the release-surface check reads v0.89.0 against the latest local tag v0.88.0, so no v0.89.* tag exists locally or on origin. The evidence inputs are unchanged by integration: docs/evidence/current.json selects WO-217 authority/006, artifact-identity/002, verification/002 and feedback/002, as at the verified subject.",
  "evidence": [
    "refs/dotln/checkpoint/WO-217/10 (3066419c90e0f0863180e5980cc5fbcc2e23c0a7); docs/control/local/integration.json: preservationCommit 3066419c…, mergeCommit null, complete true, stage applied, untrackedConflicts [], resolved [], authored [], pending [], before and upstream a54f8d65…; the helper printed Bases a54f8d65 -> a54f8d65, Authored conflicts: none, and the eleven regenerated projections, finishing at 2026-10-21T21:59Z",
    "git rev-parse origin/main main HEAD after integration: each a54f8d6520ed54d05e5209455c67541562716404; git log --oneline main..HEAD and HEAD..main print nothing; the helper's own fetch resolved upstream to the same commit",
    "A scratch probe calling gateCodeIdentity and readGateChecks from packages/skeleton/src/gate-evidence.mjs before integration (2026-10-21T21:54Z), after it (22:00Z) and after the sync-fixtures reproduction (22:05Z): codeIdentity 8d059c13c38513e0a55b4d3e931b086a13e76ef465f05389750af8d82623604a each time, with the three npm test review rows at that identity (1,519,444 ms, 1,502,977 ms and 1,504,559 ms, 109 tasks and 44 required suites each, exit 0) and their structural rows; the working tree hash moved only with records and projections (dd488d4f, then 0e5e06cc)",
    "Affected checks after integration at 2026-10-21T22:00Z, each exit 0: npm run publication:check (255 of 255 product headings indexed; both editions CURRENT, 29 and 45 sections); node scripts/harness.mjs check (34 generated surfaces; local-terms list present); npm run release -- check-surfaces --local (57 PASS lines: the release block v0.89.0 against the latest local tag v0.88.0, the component versions and exact workspace pins, the license surfaces); npm run meta -- --check (no observed budget breach, 0 reopen candidates, WO-217 operator directions 3); git diff --check clean; npm run format:check all files formatted",
    "git diff main -- package-lock.json changes twelve lines, the compiler, skeleton and console versions and their workspace pins, and adds no node_modules entry; git diff main -- docs/evidence/current.json moves authority to WO-217/006, artifact-identity to WO-217/002, verification to WO-217/002 and feedback to WO-217/002, the executor's selection; integration changed none of them",
    "find docs/intake -type f lists chats/.gitkeep, images/.gitkeep and notes/.gitkeep, each tracked; git status --short --ignored -- docs/intake prints only those three"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR meter block and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration, and the code identity is unchanged."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "The identity, not the dispatch time, says what was tested: the three passing complete rows at 8d059c13… ran every required suite fresh at these bytes, and a fourth run of the same bytes adds no coverage for about 25 minutes of gate time."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-21. Original base: `a54f8d6520ed54d05e5209455c67541562716404`.
Fetched main: `a54f8d6520ed54d05e5209455c67541562716404`. Checkpoint: `refs/dotln/checkpoint/WO-217/10` (`3066419c90e0f0863180e5980cc5fbcc2e23c0a7`).
Named stash retained: `d2b66056f9515acca2da40d62bb84458542d0ac1` (WO-217 integrate 2026-10-21).
Intake backup: none named; `docs/intake` holds three tracked `.gitkeep` files and no ignored file, so the helper's intake check required no archive.
Resolved projections: none.
Release preparation: WO-217 target v0.89.0 remains current. Files changed: docs/evidence/WO-217/meta.json, docs/final-reviews/WO-217/PR.md. Meter snapshot: docs/evidence/WO-217/meta.json, 4206 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's seven criterion judgments and the repair's handoff at code identity `8d059c13…`, which the integrated tree keeps; VER-001's F1 as repaired (D087) and its F2, F3 and F4 as corrected (D088, D089, D090); D001's minor classification and the v0.89.0 target; D026's operator packet (FUP-d0a9719cc2e4ec55), presented at this order's pull request. No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the complete run pass on the integrated tree at 22:00 UTC (evidence above); the complete run is the standing complete review row at the integrated identity, reused and recorded in FINAL-001.
