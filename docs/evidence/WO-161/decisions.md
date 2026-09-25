# WO-161 decisions

## WO-161-D001

```json
{
  "id": "WO-161-D001",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Correct generated and hand-written host-posture wording and rename the fail-open detector; preserve the existing gate-row vocabulary and historical authority bytes.",
  "evidence": [
    "docs/work-orders/WO-161-sandbox-vocabulary.md",
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md#6-sandbox-vocabulary-wo-161",
    "docs/AI-HARNESS-SECURITY.md#current-mode-choices-and-settings-locations--2026-09-17",
    "docs/evidence/WO-161/vocabulary-before.json",
    "scripts/lib/gate-sandbox.mjs (entry subject)",
    "scripts/test-runner.test.mjs: WO-140 partial-row consumer fixture",
    "packages/skeleton/src/gate-evidence.mjs: partialGateCheck"
  ],
  "rationale": "Mission and critical path: remove recurring operator rescue caused by false confinement and approval instructions while retaining reliable evidence for the source-to-deliverable loop. Policy resistance/fixes that fail: align emitted procedure with the recorded host posture; permissions remain the host's decision. Commons: one writer and one read-only audit worker, no descendants, under the 20-agent cap. Drift: require equivalent suite selection and explicit historical identity assertions. Escalation: introduce no approval step or new guard. Success to the successful: rename the useful detector rather than keep a misleading label by habit. Shifting the burden: regenerate every cold-start consumer from its two sources. Rule beating: preserve checkId/evidenceRef's legacy partial identity, needs, partial, excludedSuites and the sandbox diagnostic field; actual consumers distinguish partial evidence and historical receipts use that schema. Seeking the wrong goal: correct false claims, not every occurrence of a word. Naive Interventionism: leave discovery Seatbelt, spawned-worker confinement and all historical artifacts intact; compare a simulated confined run and this unconfined host. NoOp preserves the specific recurring false instructions reported by the operator.",
  "rejected": [
    {"option": "Change gate-row identity strings together with CLI names", "reason": "Historical records and consumers retain those identities; vocabulary repair does not authorize a schema migration."},
    {"option": "Hand-edit generated skills or historical authority records", "reason": "Generators own installed surfaces; historical evidence is immutable."},
    {"option": "Change personal host settings or remove the detector", "reason": "Outside this order; the detector remains useful on a genuinely confined host."}
  ],
  "reopenWhen": "A current consumer requires a schema migration, a supported host's observed posture changes, or equivalent-run evidence contradicts behavior preservation."
}
```

## WO-161-D002

```json
{
  "id": "WO-161-D002",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep a single batched inventory for the before/after vocabulary and historical-authority comparison; add no measurement machinery.",
  "question": "Can the required wording, cold-start byte and immutable-authority inventory share one bounded scan?",
  "alternatives": ["Run separate per-file shell searches and hash commands.", "Read the selected tracked files once in one inventory process."],
  "evidence": ["docs/evidence/WO-161/vocabulary-before.json", "docs/evidence/WO-161/sandbox-before.txt"],
  "rejected": [{"option": "Add a persistent inventory command or performance claim", "reason": "One bounded order needs a reproducible measurement, not more product machinery or unmeasured savings."}],
  "observation": "The entry inventory read all 13 installed surfaces and 129 historical authority files in one process and recorded role byte counts plus the host detector result in 0.077117 seconds. No end-to-end comparison with per-file commands was run; no saving is claimed.",
  "budget": {"wallSeconds": 120},
  "execution": "run",
  "cost": {"wallSeconds": 117.889, "tokens": null, "commands": ["One inline Node inventory with git ls-files, harness scratch and git grep child commands"], "source": "Current-session transcript timestamps 2026-09-25T16:34:56.002Z to 2026-09-25T16:36:53.891Z, including preparation and first decision recording; the inventory process alone measured 0.077117 seconds with performance.now"},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["One batched inventory per before/after observation"], "summary": "Reuse the same bounded inventory at handoff; no recurring product or workflow optimization is adopted."},
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "reopenWhen": "Inventory cost becomes material or the batch cannot reproduce the exact per-surface byte counts."
}
```

## WO-161-D003

```json
{
  "id": "WO-161-D003",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Prepare application v0.50.0 under the assigned minor classification, compiler 0.19.1 for the residue wording, and skeleton 0.43.0 for the new Contributor label. Preserve the frozen historical compilation by restoring its three original labels only in the authority evidence tool.",
  "evidence": [
    "Local latest tag v0.49.0 and README release block at entry",
    "docs/work-orders/WO-161-sandbox-vocabulary.md: minor classification",
    "scripts/authority-evidence.mjs: frozen WO-042 graph comparison",
    "scripts/lib/release-preparation.mjs",
    "docs/product/07-execution-guide.md: registered evidence-source and feedback-carry duties"
  ],
  "rationale": "The activation had no version in its heading, so release prepare could not run. Seed its existing README target and let the canonical prepare command retime under minor. Compiler patch changes emitted wording without new compiler behavior; skeleton minor distinguishes newly compiled authority identity without changing effects or limits. Only those components change; console dependency pins follow. Historical graph assertions remain strict and historical files remain immutable. Edition checks determine which deterministic outputs need a new edition; a compiler policy-hash change can require feedback carry and console re-pin, not a live episode. This applies D001's behavior-preservation and NoOp comparison.",
  "rejected": [
    {"option": "Weaken frozen graph assertions or rewrite their baseline", "reason": "The selected order explicitly preserves historical identities."},
    {"option": "Bump every package or run a new live feedback episode", "reason": "Only changed components and stale deterministic outputs are authorized and needed; feedback behavior sources are unchanged."},
    {"option": "Leave the package README's sandboxed envelope wording", "reason": "The same misleading current label is an adjacent one-line fix; queued as adjacent-0001 with git diff --check."}
  ],
  "reopenWhen": "Integration changes the latest release, a stale edition check shows a behavior change, or a historical comparison fails beyond the three restored labels."
}
```

## WO-161-D004

```json
{
  "id": "WO-161-D004",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Select new WO-161/001 authority, artifact-identity, verification and carried feedback editions after their checks demonstrated stale output; re-pin the console's current self-host fixture. Keep all prior editions untouched.",
  "evidence": [
    "node scripts/authority-evidence.mjs --check: old selected authority output stale after the three-label migration",
    "node scripts/artifact-identity-evidence.mjs --check: four old selected outputs stale",
    "node scripts/verification-evidence.mjs --check: old selected event stream stale",
    "node scripts/feedback-evidence.mjs --check: compiler release moved only the policy hash",
    "Current edition --check commands all pass after deterministic generation",
    "docs/evidence/WO-161/partial-before.json",
    "docs/evidence/WO-161/partial-after.json",
    "docs/evidence/WO-161/vocabulary-after.json",
    "docs/evidence/WO-161/cold-start.json"
  ],
  "rationale": "The order names two regeneration outputs, but its registered compiler source also stales artifact and verification outputs. Product 07's existing deterministic re-mint duty covers those necessary replacements. The carried feedback edition retains WO-159's live audit by reference; no feedback behavior or live episode changed. All 129 pre-existing authority files match their entry hashes. The simulated confined rows match byte for byte in checkId, evidenceRef suffix, needs, partial, excludedSuites and requiredSuites. The host detector remains inForce false. All bounded cold starts remain within their existing ceilings, with no budget edit.",
  "rejected": [
    {"option": "Keep stale selected editions or patch prior files", "reason": "Would fail executable checks or rewrite history."},
    {"option": "Change the suite declaration strings to make grep empty everywhere", "reason": "The retained strings are recorded contracts; the cold-start surface alone must lose the false wording."}
  ],
  "reopenWhen": "Another source change makes these editions stale, the row comparison diverges, or integration changes release identities."
}
```

Same-day corrections: the entry inventory measures 129 historical authority files,
not the planning snapshot's 124. The baseline whole-line byte measure includes
line terminators: executor 1,350 and reviewer/verifier 1,811 bytes, versus the
planning snapshot's 1,349/1,809. The original writer tests had no old Contributor
label assertion, so a new compiled-boundary assertion covers the renamed label.
Its first expected-effects list omitted the three existing outside-write grants;
source and executable output showed those grants already present, and the
assertion now preserves them. No authority was added. The economy cost was
initially recorded as the 0.077117-second inventory execution alone; the corrected
117.889-second transcript interval includes preparation and first recording,
within the announced 120-second budget. Publication locks follow the reviewed
execution-guide and release-boundary changes.

## WO-161-D005

```json
{
  "id": "WO-161-D005",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Give the authorized generated-role changes a new WO-161 default/opt-out snapshot chained to WO-158, and make the support-switch test reproduce both historical unequipped build hashes after restoring only the three old labels.",
  "evidence": [
    "First npm test -- --review: 35 suites passed, process-debt and skeleton failed; 579.30 seconds",
    "scripts/test-process-debt.mjs: current role bytes compared against wo158-role-baseline.json",
    "packages/skeleton/test/executor-supports.test.ts: current Contributor hash compared against the pre-rename WO-099 hash",
    "packages/skeleton/fixtures/wo161-role-baseline.json",
    "scripts/authority-evidence.mjs: the same historical graphs already reproduce frozen program and artifact identities"
  ],
  "rationale": "These are the assertion updates the vocabulary change requires. The process-debt fixture keeps its release oracle, predecessor SHA-256 chain, twin-root equality and economy on/off tests. The support-switch test retains the WO-042 and WO-099 expected hashes as explicit historical assertions and adds the current WO-161 identity. Restoring three labels is bounded test reconstruction, not authority widening or historical output rewriting. This applies D001's drift, rule-beating and intervention limits. The added fixture and test files are not registered evidence or feedback sources, so they need no new edition or live episode.",
  "rejected": [
    {"option": "Overwrite an old fixture or delete the historical hash assertions", "reason": "Would erase the compatibility evidence this order must preserve."},
    {"option": "Treat failures as unrelated and hand off", "reason": "Both failures directly expose missing assertion updates for this order."}
  ],
  "reopenWhen": "The unchanged predecessor chain fails, historical reconstruction needs more than the three labels, or another executable check shows changed behavior."
}
```

## WO-161-D006

```json
{
  "id": "WO-161-D006",
  "date": "2026-09-25",
  "dispatch": "resume: verify; VER-001",
  "decision": "Fail independent verification and route eight reproduced, repairable defects to resume: fix. All six acceptance criteria are met on the current subject, but the cold-start text still carries the removed Codex approval path's 'need no Git escalation' clause (F1), two hand-written surfaces still state a current sandbox/approval posture (F2), and six smaller record and naming defects remain (F3 to F8). The operator accepted failing the order to repair them during this dispatch.",
  "evidence": [
    "docs/verifications/WO-161/VER-001.md findings F1 to F8, each with its reproduction",
    "packages/skeleton/src/loadouts/contributor.ts:70 emits '`status`, `times`, `briefing`, and `next` need no Git escalation.' into .claude/.agents executor SKILL.md:32 and verifier/reviewer SKILL.md:25; docs/PLAYBOOK.md:112-114 now confines that escalation path to Codex workspace-write plus on-request",
    "packages/skeleton/README.md:820-821 'Native sandbox and approval remain in force.'; docs/PLAYBOOK.md:127-128 'current Claude asymmetry' for the retained posture",
    "docs/product/06-roadmap.md:23 collision-retiming note versus docs/product/07-execution-guide.md:1952-1957 and tag v0.49.0 at HEAD 852861d3",
    "docs/product/07-execution-guide.md:961-962 and 2055-2064 (ADR amendment mechanism) versus in-place Status and heading edits in ADR-0003:3-5,22, ADR-0004:3-6,23, ADR-0005:3-6,28",
    "Operator message during resume: verify on 2026-09-25: 'im fine failing it to fix repairable defects'"
  ],
  "rationale": "Mission and critical path: the order removes recurring operator rescue caused by false confinement and approval text; that outcome, not the grep proxy, is the goal. Policy resistance: an unscoped escalation clause keeps prompting agents to seek an approval path the host does not have, undoing the correction. Commons: four read-only verifier lenses in one batch, no descendants, under the 20-agent cap. Drift to low performance: passing with known false sentences normalizes partial truth in operator-facing text. Escalation: the repair adds no guard or refusal. Success to the successful: no competing work is displaced; the repairs are bounded. Shifting the burden: routing to repair keeps the fix at the generator and the edited files instead of leaving it for a later operator complaint. Rule beating: criterion 1's grep passes only because the remnant lacks the word 'sandbox'. Seeking the wrong goal: judged against the order's heading and Design, not the token count. Naive Interventionism: the verifier edits no implementation; the product 02 sentence and the inherited machinery failure are boarded, not added to repair scope (D007, D008). NoOp would pass an order whose heading promises the cold-start text stops describing an approval path it still describes.",
  "rejected": [
    { "option": "Pass and board every finding as a follow-up", "reason": "F1 and F2 are the order's own objective on the surfaces it edits; boarding them would ship the partial correction the operator reported." },
    { "option": "Judge criterion 1 unmet", "reason": "Its literal grep is clean and every remaining sandbox line is gone; the remnant is an objective and Design gap, recorded as F1 rather than by rewriting the criterion." },
    { "option": "Route product 02's sentence and the evidence-sources failure to this repair", "reason": "Neither is a surface or source this order names; adding them would widen scope (D007, D008)." }
  ],
  "followup": "WO-161 VER-001 repair: F1 delete or scope contributor.ts:70's 'need no Git escalation' clause to the retained Codex workspace-write plus on-request mode and regenerate, re-pinning the WO-161 role baseline, cold-start evidence and any edition the checks mark stale; F2 correct packages/skeleton/README.md:820-821 and PLAYBOOK.md:127-128; F3 replace the roadmap's collision-retiming note with an activation-completion record and correct D003; F4 confine ADR edits to the Amendments sections or record the in-place Status and heading edits as a decision noting the skipped duty; F5 record the confined-row method or regenerate partial-before/after.json from the committed fixture; F6 dispose of receipt 028's two known issues in decisions; F7 rename the stale gate-sandbox message and comments; F8 add the Config log line.",
  "reopenWhen": "A repaired subject still emits an unscoped escalation or approval-path clause into a cold-start surface, or any of F2 to F8 reproduces."
}
```

## WO-161-D007

```json
{
  "id": "WO-161-D007",
  "date": "2026-09-25",
  "dispatch": "resume: verify; VER-001",
  "decision": "Board up the inherited evidence-sources machinery failure; do not route it to WO-161's repair. scripts/test-evidence-sources.mjs:266-269 asserts that the current feedback edition is itself its live audit, which has been false since WO-158 selected the carried edition WO-158/feedback-002. WO-161's carried WO-161/feedback-001 keeps the same shape.",
  "evidence": [
    "npm run test:machinery on the current subject, 2026-09-25T17:27:14Z to 17:33:17Z: 18 passed, 1 failed; evidence-sources 'WO-154 a pins-only change keeps or carries the live audit' expected docs/evidence/WO-161/feedback-001, actual docs/evidence/WO-159/feedback-001",
    "The same test on a scratch copy of the entry subject HEAD 852861d3 fails the same assertion: expected docs/evidence/WO-158/feedback-002, actual docs/evidence/WO-159/feedback-001",
    "docs/evidence/WO-158/feedback-002/edition.json liveAudit.carried true, edition WO-159/feedback-001",
    "scripts/test-runner.mjs:213-219: evidence-sources is selected under --review only when one of its five declared sources changes; WO-161 changes none"
  ],
  "rejected": [
    { "option": "Fix the test within this verification", "reason": "The verifier edits no implementation, and the test is outside WO-161's named sources." },
    { "option": "Record it only as a report sentence", "reason": "A met defect needs a decision and a named follow-up." }
  ],
  "followup": "Planner: scripts/test-evidence-sources.mjs:266-269 fails whenever the current feedback edition is a carried edition (since WO-158 feedback-002): the WO-154 pins-only test should resolve the live audit through edition.liveAudit.edition rather than assert the current directory is live. No --review selection runs it unless its declared sources change, so the failure is otherwise invisible. Priority: medium.",
  "reopenWhen": "The test passes on a subject whose current feedback edition is carried, or a later order changes one of the suite's declared sources."
}
```

## WO-161-D008

```json
{
  "id": "WO-161-D008",
  "date": "2026-09-25",
  "dispatch": "resume: verify; VER-001",
  "decision": "Board up docs/product/02-domain-model.md:913-915, which assigns arbitrary interpreters and shell indirection to 'native sandbox/approval and operator responsibilities'. It is the same kind of claim WO-161 corrects, but it lies outside the order's named surfaces and its planning audit.",
  "evidence": [
    "docs/product/02-domain-model.md:913-915 (unchanged from HEAD)",
    "docs/work-orders/WO-161-sandbox-vocabulary.md Design and criterion 2 name the playbook, README.md, product 07 and ADRs 0003 to 0005",
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md §6 does not list the line"
  ],
  "rejected": [
    { "option": "Add it to WO-161's repair", "reason": "A product-document edit outside the order's named surfaces widens scope; a planner or a later order decides it." }
  ],
  "followup": "Planner: docs/product/02-domain-model.md:913-915 still names native sandbox/approval as the control for arbitrary interpreters and shell indirection; under the ADR-0003 2026-09-25 amendment that is host permission settings plus operator responsibility. Decide the wording in a product-document pass or a later vocabulary order. Priority: low.",
  "reopenWhen": "The sentence is corrected, or the operator's recorded host posture changes."
}
```

## WO-161-D009

```json
{
  "id": "WO-161-D009",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001",
  "decision": "Repair F1 to F8 on the order's existing surfaces: remove the generated Git-escalation remnant, correct current-posture prose, replace the false collision retiming with activation completion, retain the ADR Status and heading annotations with an explicit precedence decision, make the confined-row method executable, refresh names and add the Config log line. Preserve the historical gate-row and authority identities.",
  "evidence": [
    "docs/verifications/WO-161/VER-001.md findings F1 to F8",
    "packages/skeleton/src/loadouts/contributor.ts: unscoped 'need no Git escalation' clause on the entry subject",
    "packages/skeleton/README.md and docs/PLAYBOOK.md: stale current-posture sentences on the entry subject",
    "git tag v0.49.0 at HEAD; WO-161 activation heading had no version",
    "docs/product/07-execution-guide.md: Release assignment, ADR amendment mechanism and Precedence",
    "docs/evidence/WO-161/partial-method.mjs: executable no-build fixture projection"
  ],
  "rationale": "Mission and critical path: remove the actual false approval and confinement cues that caused operator rescue, not merely pass criterion 1's sandbox grep. Policy resistance, drift and rule beating: a regression assertion forbids the escalation remnant in every generated skill, while the saved snapshot and executable confined-row projection protect the intended behavior. Commons and escalation: one read-only audit worker and the existing tests; no new permission gate or host setting. Shifting the burden: edit the generator and regenerate its consumers, rather than leave the operator to reinterpret them. Success to the successful and Naive Interventionism: retain the useful detector, historical evidence and ADR decision bodies. The in-place ADR Status and heading annotations make the 2026-09-25 amendment visible above historical sandbox-on titles; they are the bounded WO-161 precedence exception to product 07's amendment-only duty, which is explicitly noted here. NoOp would leave F1 and F2 visible to every affected reader. The roadmap correction records the actual activation baseline and minor assignment, rather than invent a retiming event.",
  "rejected": [
    {"option": "Revert the ADR Status and heading annotations", "reason": "An unchanged Accepted label below a historical sandbox-on title would hide the current amendment from a reader arriving at the top of the ADR."},
    {"option": "Change historical gate-row strings or authority files while fixing names", "reason": "Those are recorded identities and the order explicitly preserves them."},
    {"option": "Pass on the literal sandbox grep alone", "reason": "The unscoped approval implication lacks that word and was the primary objective gap in VER-001."}
  ],
  "reopenWhen": "A regenerated role again implies approval escalation in full-access mode, an ADR annotation contradicts its amendment, or the confined-row projection diverges."
}
```

Same-day correction to D003: I misread the `v0.49.0` README release label as
WO-161's unpublished activation target and described `release prepare` as a
retiming. The activation order had no version in its heading; `v0.49.0` was
the published baseline. The intended action was to assign the next minor
`v0.50.0`. The roadmap now records activation completion, with compiler
`0.19.1` and skeleton `0.43.0`, and the version and component choices in D003
remain. No earlier decision bytes were rewritten.

## WO-161-D010

```json
{
  "id": "WO-161-D010",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F6",
  "decision": "Dispose of both Receipt 028 carry-ins without adding host-specific constants to compiled text. The role instruction tells the operator to run npm test and react to the runner's observed host-confinement result; it does not assert an observed posture at compilation. The compiler residue says host permission settings decide execution, while the dated ADR and operator docs record this instance's sandbox-off posture.",
  "evidence": [
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md: WO-161 Receipt 028 known issues",
    "packages/skeleton/src/loadouts/contributor.ts: productGate conditional runner sentence",
    "scripts/lib/host-confinement.mjs: detectHostConfinement probes the active process",
    "packages/compiler/src/harness.ts: Pre-effect envelope checks unavailable; host permission settings decide",
    "docs/decisions/0003-personal-ai-harness-security.md: 2026-09-25 amendment"
  ],
  "rationale": "The receipt asks for probe-derived confinement wording so exported instances describe their own host. This implementation chooses a narrower portable statement: compiled instructions make no host-posture claim and direct the reader to a runtime probe when a gate needs confinement information. Wiring a generation-time probe would couple a reusable artifact to its producer host and exceed this wording-only order's no-runtime-behavior boundary. The residue states the real permission boundary rather than recasting a sandbox as a host control. An exported instance therefore has a true conditional instruction; it needs its own dated posture record if it wants a positive host-specific claim.",
  "rejected": [
    {"option": "Embed this host's sandbox-off observation as a constant", "reason": "It would describe the producer host, not necessarily the exported instance's host."},
    {"option": "Wire a generator-time confinement probe", "reason": "It changes the compilation contract beyond the selected wording-only deliverable; the gate's runtime probe already answers the operational question."},
    {"option": "Keep the old residue sandbox clause", "reason": "It asserts a boundary unavailable in this Codex harness and prompted the operator's correction."}
  ],
  "reopenWhen": "A future exported instance must make a positive host-specific claim in generated text, or the gate's runtime probe cannot establish the confinement condition it reports."
}
```

## WO-161-D011

```json
{
  "id": "WO-161-D011",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F1",
  "decision": "Select immutable WO-161 authority revision 002 after regenerating the role text, while retaining revision 001 and the other three current evidence editions. Re-pin the WO-161 role snapshot and cold-start inventory to the repaired output.",
  "evidence": [
    "npm run harness -- check: 31 generated surfaces pass after F1",
    "node scripts/authority-evidence.mjs --check: revision 001 bundle-diff.json stale at the six role skill hashes",
    "node scripts/authority-evidence.mjs --write --edition WO-161 --revision 002: two files recorded",
    "node scripts/authority-evidence.mjs --check: revision 002 passes",
    "artifact-identity, verification, feedback and console checks pass on their retained revisions",
    "docs/evidence/WO-161/vocabulary-after.json and cold-start.json: repaired installed bytes"
  ],
  "rationale": "The generator change alters bundle bytes, so the current authority snapshot must name those bytes. The compiled programs and authority effects are unchanged; the authority evidence command reproduced its behavior checks and found only the saved bundle comparison stale. The edition is immutable, so revision 002 preserves revision 001 for the verifier's earlier subject. Unchanged evidence-source checks keep their own editions. The corrected cold starts remain below every configured ceiling.",
  "rejected": [
    {"option": "Overwrite authority revision 001", "reason": "It is the immutable evidence judged in VER-001."},
    {"option": "Mint all evidence editions", "reason": "Their checks pass and their behavior sources did not change in this repair."}
  ],
  "reopenWhen": "A later source edit makes any retained edition stale or integration changes the selected component versions."
}
```
