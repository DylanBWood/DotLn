# WO-213 decisions

## WO-213-D011

```json
{
  "id": "WO-213-D011",
  "date": "2026-10-15",
  "dispatch": "scope expand: use all twenty workers before this phase's final full gate",
  "decision": "Use the complete twenty-agent session budget before the final full gate, keeping every worker read-only and the executor as sole writer. Eleven workers have examined criteria, design, instance selection, lane evidence, release identity, session binding, recovery metering and seed amendment. Allocate the remaining nine to seven focused implementation reviews and a fresh final criteria/design pair; resolve or explicitly record their findings before the gate.",
  "evidence": [
    "The operator explicitly requests all twenty workers and delegates their timing and allocation. The observed session dispatch inventory lists eleven distinct workers at this decision.",
    "Codex has no spawn enforcement hook; the executor keeps an explicit count. Reused worker turns do not count as new workers, and no worker may spawn descendants or write in this worktree."
  ],
  "rejected": [
    { "option": "Run the full gate before spending the remaining review budget", "reason": "It contradicts the operator's requested ordering and would leave known review capacity unused." },
    { "option": "Let workers edit the shared worktree", "reason": "One writer owns this worktree; parallel reviews can examine independent boundaries without concurrent mutation." }
  ],
  "reopenWhen": "The operator changes the budget or a worker cannot complete its assigned review."
}
```

## WO-213-D012

```json
{
  "id": "WO-213-D012",
  "date": "2026-10-15",
  "dispatch": "scope expand: use DotLn-Enterprise-Starter or an instance-configured release name",
  "decision": "Add an instance-owned release.displayName setting, defaulting to DotLn for core and historical configurations. Seed fresh exports with DotLn-Enterprise-Starter. Derive each release's name from configuration at its recorded release commit, so later configuration changes cannot rename historical tags or published Releases. Preserve existing instance configuration on refresh and make no changes in the operator's completed personal fork.",
  "evidence": [
    "The operator identified the incorrect instance release prefix and asked where it should be controlled. Core currently hard-codes the name in preparation, annotations, release recognition and publication titles.",
    "Two independent reviewers found that the immutable release commit can supply historical configuration without changing the strict manifest schema; legacy annotation subtitles must retain their existing plain publication title."
  ],
  "rejected": [
    { "option": "Read the current display name while regenerating an old release", "reason": "It would change immutable release identity and break idempotent publication." },
    { "option": "Refresh instance config as an upstream-owned seed", "reason": "The config belongs to the instance and older exports lack an established refresh baseline." }
  ],
  "reopenWhen": "A historical configuration cannot be interpreted, or another release surface requires a distinct identity contract."
}
```

## WO-213-D009

```json
{
  "id": "WO-213-D009",
  "date": "2026-10-15",
  "dispatch": "scope expand: correct ordinary instance validation; operator clarification that the instance's work is in sibling repositories",
  "decision": "Keep three evidence subjects distinct: ordinary instance plain/review checks validate the installed kit and active harness; test:docs validates current coordination records; the registered target gate executes the sibling repository's declared checks. Do not promote every current-document validator into plain/review. Core regression remains unchanged and carried fixture diagnostics remain explicit.",
  "evidence": [
    "The executor initially proposed all seventeen current-state checks as the ordinary instance default. The operator corrected the purpose: work occurs in sibling repositories. That proposal overstated the relevance of local document validation and was corrected before implementation.",
    "scripts/lib/target-gate.mjs runs registered argv with cwd set to the target worktree and binds evidence to its bytes and command definitions; scripts/lib/handoff-ledger.mjs selects those rows for target claims before considering starter npm-test evidence.",
    "The two additional workers independently revised their initial recommendation to kit-verify followed by harness for plain/review. The harness check validates the ignored installed snapshot as well as generated surfaces; kit verification covers the manifest-listed compiled distribution."
  ],
  "rejected": [
    { "option": "Run all current-record checks on every ordinary instance product selection", "reason": "Those checks do not validate sibling implementation and duplicate the separately declared document gate." },
    { "option": "Treat a passing instance npm test as sibling product evidence", "reason": "It neither executes the sibling commands nor binds to the sibling tree." },
    { "option": "Verify only manifest-listed runtime files", "reason": "The active harness also uses an ignored pinned snapshot whose integrity needs its own check." }
  ],
  "reopenWhen": "A documented instance assurance cannot be established by its selected check, or target work can be accepted using only starter evidence."
}
```

## WO-213-D010

```json
{
  "id": "WO-213-D010",
  "date": "2026-10-15",
  "dispatch": "scope expand: address the relevant instance's observed issues",
  "decision": "Add diagnosis and bounded repair of the operator-relayed WO-001 instance issues without replacing either the private-path deliverable or the instance-validation correction. Investigate integration regeneration, resume dispatch/session binding, absent reader-profile defaults, the host-lane wait, moved-session meter lookup and seeded-order amendment. Preserve the other worktree's sole writer and make the fixes in this core worktree.",
  "evidence": [
    "The operator relayed the instance final review's integration report (FUP-4f19a91d71d95bc9, D013), dispatch report (FUP-a36dae4a6766b9ef, D014), reader-profile report (FUP-2a5dc809710f399e, D015), and four further observations.",
    "The 444-second target-worktree fixture in a 448-second carried gate corroborates the consumer-default problem; it is not a sibling product test.",
    "The 830458 ms hostLaneWaitMs observation has no reproduced cause at intake. The executor will distinguish scheduler waiting from task execution and will not infer an unseen gate."
  ],
  "rejected": [
    { "option": "Replace the active scope expansion with the report's issue list", "reason": "The operator explicitly preserves the existing scope and separately expands it to relevant observed issues." },
    { "option": "Claim all reported causes verified on receipt", "reason": "The report is input evidence; source inspection and executable reproduction must establish each repair claim." }
  ],
  "reopenWhen": "A diagnosis identifies an effect outside the authorized instance-consumption and reported-command paths."
}
```

## WO-213-D008

```json
{
  "id": "WO-213-D008",
  "date": "2026-10-15",
  "dispatch": "scope expand: fix the platform regression default for an instance consuming an already tested DotLn release; use two more agents for improvement, validation and adversarial review",
  "decision": "Expand this active order to make ordinary instance gates validate the installed runtime and the instance's current work without rerunning platform regression fixtures. Preserve core platform-development checks, runtime integrity, current instance-record validation, per-order evidence and registered-target gates. Add two fresh read-only workers; the executor remains the only writer.",
  "evidence": [
    "The operator's explicit scope-expansion dispatch on 2026-10-15 authorizes this correction and the following dispatch requests two additional agents.",
    "scripts/kit/first-order.template.md and the active instance WO-001 both exclude running core's suites; the instance's first order is bounded environment inspection.",
    "scripts/test-runner.mjs currently filters only suites explicitly marked core-only in a kit; shipped platform suites remain in ordinary selections. The observed instance gate ran target-worktree platform fixtures.",
    "The executor stopped its own in-flight full review through harness evidence --stop before changing the subject; no passing gate was recorded for that stopped run."
  ],
  "rejected": [
    {
      "option": "Leave the default selection unchanged",
      "reason": "NoOp charges ordinary instance work for platform regression and contradicts the starter's first-order non-goal."
    },
    {
      "option": "Remove all instance validation",
      "reason": "The consumed runtime still needs integrity checks, and the instance's own records and work still need relevant evidence."
    },
    {
      "option": "Reduce the platform-development gate along with the instance default",
      "reason": "Changing DotLn itself still requires platform regression coverage; consuming it is a different validation subject."
    }
  ],
  "reopenWhen": "An ordinary instance gate still selects a platform fixture, a current instance defect loses its relevant check, or runtime-integrity enforcement is weakened."
}
```

## WO-213-D001

```json
{
  "id": "WO-213-D001",
  "date": "2026-10-15",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.83.0, the next minor above the observed release baseline v0.82.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.82.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-213-private-paths-in-every-record.md"
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

## WO-213-D002

```json
{
  "id": "WO-213-D002",
  "date": "2026-10-15",
  "dispatch": "resume: next; WO-213 implementation",
  "decision": "Move the existing full pattern unchanged into private-paths.mjs; keep its home and private-temporary classes for Markdown, and use only its home-directory alternative for JSON, JSONL, log and text records under configured document roots. Intake, control/local, root-level records and other extensions remain outside the record listing.",
  "evidence": [
    "scripts/lib/private-paths.mjs and scripts/docs-check.mjs; the bounded docs-check-fixtures gate passed both configured-root layouts, tracked/untracked records, unchanged Markdown cases, record temporary-path acceptance and safe diagnostics.",
    "scripts/lib/entropy-review.mjs entropyScratchLane and subjectRecord retain a frozen copy in a system-temporary directory and include that location in JSON; a full-pattern record rule would refuse this existing filing contract.",
    "Before and after docs-check measurements are in README.md, before.json and after.json; no timing threshold applies."
  ],
  "rejected": [
    {
      "option": "Apply the full Markdown pattern to every record",
      "reason": "It would reject the Entropy Reducer frozen-copy temporary location. The record fixtures contrast temporary-path acceptance with the unchanged Markdown rejection."
    },
    {
      "option": "Leave the screen Markdown-only",
      "reason": "The base observation found 292 home-prefix lines in 38 committed records, so NoOp leaves the documented forward-only gap open."
    },
    {
      "option": "Match only the running host home directory",
      "reason": "Coverage must be host-independent; the register fixture changes HOME and obtains identical projected bytes."
    }
  ],
  "reopenWhen": "A separately authorized policy expands record classes, extensions or configured-root reach; a new private-path encoding requires evidence and an explicit pattern change."
}
```

## WO-213-D003

```json
{
  "id": "WO-213-D003",
  "date": "2026-10-15",
  "dispatch": "resume: next; WO-213 implementation",
  "decision": "Preserve filed historical records and add exactly 291 record-line fingerprints in 37 files proven identical to base 7b66f8b303a316ff4560b4827d6dc728cd7f504a. Preserve all 128 existing baseline entries and their 219 lines. These additions do not fire FUP-af65972e5491da22: every added line predates this order base in a type the old screen did not read; no newly written or edited line is admitted.",
  "evidence": [
    "record-baseline.mjs consumes identical raw base lines as a multiset and prints only proposed fingerprints, counts, repository-relative filenames and first commits; baseline-proof.json records the result and existing-map digest.",
    "baseline-probe.json: new, edited and duplicated matching records all refuse without writing. The corrected register contributes no fingerprint; no matching WO-210 record was found.",
    "docs/evidence/WO-189/repair-002/markdown-fixtures-before.txt, first committed 1154daa779bfb82deded4d77d65147beb71f3bcf, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-189/repair-003/class-probes-after.json, first committed 1154daa779bfb82deded4d77d65147beb71f3bcf, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-198/repair4-before-transcript.txt, first committed 5b5ae9459257409c4312f98338cfe9b8a07ee324, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-200/review-gate.json, first committed a37a1bb33e6075b33765a8b929abd6930b0c8ef5, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-200/schema-before.log, first committed a37a1bb33e6075b33765a8b929abd6930b0c8ef5, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-200/schema-restored.log, first committed a37a1bb33e6075b33765a8b929abd6930b0c8ef5, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-203/action-value-before.log, first committed 1c915c1ce1cee5a2b07345947cf66fbc29634593, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-203/copied-fixtures.log, first committed 1c915c1ce1cee5a2b07345947cf66fbc29634593, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-203/launchpad-targeted-final.log, first committed 1c915c1ce1cee5a2b07345947cf66fbc29634593, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base.",
    "docs/evidence/WO-203/repair-review-failed.json, first committed 1c915c1ce1cee5a2b07345947cf66fbc29634593, is one of the ten post-1aea2dea breaches of WO-188 assumption 7; it predates this order base."
  ],
  "rejected": [
    {
      "option": "Rewrite historical report and receipt bytes",
      "reason": "It would change filed evidence and its hash-bound provenance; the authorized screen is forward-only."
    },
    {
      "option": "Baseline all current findings without comparing the base",
      "reason": "It would admit a newly introduced or edited private-path line and violate the reopening condition."
    }
  ],
  "reopenWhen": "A later change proposes a baseline line absent from its pre-change committed subject, or the retained proof no longer reproduces these additions."
}
```

## WO-213-D004

```json
{
  "id": "WO-213-D004",
  "date": "2026-10-15",
  "dispatch": "resume: next; WO-213 implementation",
  "decision": "Correct follow-up display projections by substituting <home> in titles and summaries at collection, sync and union; allow retained history to match only its original bytes or that exact projection. Sync rewrites the one stored summary in place while retaining its hash, ref, title, missing flag, revision count, dispositions and deferred status.",
  "evidence": [
    "register-correction.json: FUP-de6162b279f66709 revision 1 summary changes from 700 to 680 characters, with before/after SHA-256 and no source text; all 1,115 entries retain their revision counts and dispositions.",
    "Bounded process-debt and worktree-integration gates pass: check-mode stale before sync and current after; changed protected history refuses; raw/rewritten union agrees in either order and does not mutate its inputs."
  ],
  "rejected": [
    {
      "option": "Append a source revision or reset the disposition",
      "reason": "The source identity has not changed. A display correction must not reopen the deferred finding."
    },
    {
      "option": "Hand-edit the stored summary or permit arbitrary historical rewrites",
      "reason": "The sync and exact normalization exception provide a reproducible, narrowly checked correction."
    }
  ],
  "reopenWhen": "Source identity actually changes, or a projected field requires a different transformation; all other historical revision and disposition checks remain in force."
}
```

## WO-213-D005

```json
{
  "id": "WO-213-D005",
  "date": "2026-10-15",
  "dispatch": "resume: next; WO-213 implementation",
  "decision": "Refuse unsafe planning receipts before writing their exact pretty JSON or rendered Markdown; apply the home-only JSONL rule before each override, disposition, amendment and withdrawal event append. Keep legacy readers and validation semantics unchanged, and do not redact attested or hash-bound text.",
  "evidence": [
    "Bounded plan-refutation and plan gates pass. Fixtures cover home paths in statements and JSON-only copied criteria, a private temporary path in Markdown, each event writer, unchanged receipt/history bytes on refusal, and placeholder filing.",
    "scripts/lib/entropy-review.mjs filing remains unchanged: its JSON frozen-copy temporary path is allowed by the record rule, and its historical home lines are covered by the committed-base proof.",
    "packages/skeleton/src/plan-refutation-host.ts catch/finally retain output rejected inside the worker episode and remove scratch after a successful return. A later CLI filing refusal is not retained by that host, matching the existing local-terms refusal boundary.",
    "The amendment and withdrawal changes add only a pre-append content screen. Binding and withdrawal semantics are unchanged, so FUP-9625ca888d7d08f5 is not reopened by this implementation."
  ],
  "rejected": [
    {
      "option": "Silently redact a statement or copied receipt subject",
      "reason": "It would alter attested content and the bytes used for hashes; the caller must supply an appropriate relative path or placeholder."
    },
    {
      "option": "Apply the new rule in historical receipt validators or expand Entropy Reducer filing here",
      "reason": "Legacy filed records must stay readable. The order excludes entropy filing, and its temporary-path contract fits the selected record rule."
    }
  ],
  "reopenWhen": "An Entropy Reducer filing writes a new home-directory line, amendment binding or withdrawal semantics change, or the operator authorizes preserving a CLI result refused after the episode returns."
}
```

## WO-213-D006

```json
{
  "id": "WO-213-D006",
  "date": "2026-10-15",
  "dispatch": "resume: next; WO-213 implementation",
  "decision": "Screen each exact record byte sequence in both WO-210 target write paths before writing or committing: target-records uses the target-relative destination and target-publish screens its collected planning/product files before any remote operation. Keep existing target history unchanged.",
  "evidence": [
    "scripts/lib/target-records.mjs and scripts/lib/target-planning.mjs apply the shared per-type rule after local terms and before operation records, target writes or commits.",
    "The target-worktree fixtures cover a home-bearing decisions file, an already hash-bound private-temporary verification report, home and temporary Markdown, home-bearing JSON, safe placeholders and allowed temporary JSON. Refusals compare target content, refs, origin refs and the records order control segment; planning refusals also compare worktree registration and confirm no forge call."
  ],
  "rejected": [
    {
      "option": "Rely on a later launchpad document gate",
      "reason": "The target workflow could commit or publish a private record before that gate; the content must be refused at the write boundary."
    },
    {
      "option": "Rewrite reports while copying them or repair target history",
      "reason": "Reports are hash-bound and the authorized change is a pre-write refusal, not a historical rewrite."
    }
  ],
  "reopenWhen": "Another workflow writes records into a target root, or a target documentation root is found to hold an absolute home path from an earlier publication."
}
```

## WO-213-D007

```json
{
  "id": "WO-213-D007",
  "date": "2026-10-15",
  "dispatch": "resume: next; WO-213 implementation",
  "decision": "Keep the change at the classified v0.83.0 application minor; no package component, dependency, schema, command or flag changes. Correct the initial hash-bound-report fixture by supplying its required decisions file, then rerun the focused case and complete target-worktree suite.",
  "evidence": [
    "release prepare --local assigned v0.83.0 from the local v0.82.0 baseline. The initial document preflight identified the unassigned release heading, which the required release preparation resolved.",
    "The first target-worktree run passed 51 of 52 cases and refused the new fixture before its intended screen because the required decisions.md was missing. After supplying that fixture input, the focused hash-bound verification case passed.",
    "Test-runner task records still include productReadLog as an absolute path; changing that runner contract is an explicit non-goal. A future copied record must use a placeholder to pass the new document rule."
  ],
  "rejected": [
    {
      "option": "Change target product behavior to admit the incomplete fixture",
      "reason": "The existing required-file refusal was correct; the fixture needed the mandatory input."
    },
    {
      "option": "Bump unchanged package components",
      "reason": "Only application machinery and documentation changed."
    }
  ],
  "reopenWhen": "Publication observes a release collision or a changed component gains compatibility impact; a future order changes the runner record contract."
}
```

## WO-213-D013

```json
{
  "id": "WO-213-D013",
  "date": "2026-10-15",
  "dispatch": "resume: next; operator scope expansions recorded in D008, D010 and D012",
  "decision": "Retain application target v0.83.0 and bump only the changed compiler and skeleton components to 0.27.1 and 0.59.1. Advance the harness host identity to 0.35.2 and update exact dependent workspace pins. These compatible repairs add no dependency or required manifest field.",
  "evidence": [
    "The scope expansions change compiler prompt recognition and skeleton dispatch/runtime evidence implementation; the earlier no-component-change conclusion no longer describes this diff.",
    "The bounded build succeeds with the new exact pins; harness emit regenerates the installed bundle from those compiled bytes."
  ],
  "reopens": {
    "decisionId": "WO-213-D007",
    "observation": "The authorized instance repairs changed compiler and skeleton source, meeting the changed-component reopening condition."
  },
  "rejected": [
    {
      "option": "Keep the old component identities",
      "reason": "The consumed compiled runtime changed and needs its own patch identity."
    },
    {
      "option": "Bump kernel, console or Beacon versions",
      "reason": "Their implementation did not change; console only updates exact dependency pins."
    }
  ],
  "reopenWhen": "A public compatibility break or another changed component is demonstrated before final review."
}
```

## WO-213-D014

```json
{
  "id": "WO-213-D014",
  "date": "2026-10-15",
  "dispatch": "scope expand: fix ordinary instance validation; operator clarification that product work occurs in sibling repositories",
  "decision": "Select kit-verify and harness for ordinary instance plain/review gates, and seventeen current coordination validators for test:docs. Preserve explicit carried diagnostics and all core regression selections. Run ordinary instance checks fresh and bind npm-test claims and live publication to the installed runtime digest as well as committed code identity; historical release readers retain their recorded subject.",
  "evidence": [
    "The suite table marks runtime and document instance checks explicitly; newly carried platform fixtures do not enter a default selection.",
    "The registered target gate still executes target commands in the sibling worktree and binds target bytes and command definitions. Starter evidence cannot answer those claims.",
    "Focused regressions pass for exact selection, ignored-runtime drift, current-document drift, handoff and lifecycle digest retention, live publication refusal after drift and historical reader compatibility.",
    "Digest selection validates every existing path component before reading the manifest or package inventory, rejects external aliases including missing descendants under aliased parents, binds canonical internal workspace links without following them, and frames arbitrary file content with its length."
  ],
  "rejected": [
    {
      "option": "Rerun carried platform fixtures for every instance order",
      "reason": "They test platform development and do not establish sibling product behavior."
    },
    {
      "option": "Reuse a pass at committed code identity alone",
      "reason": "The active installed harness includes ignored runtime bytes; the same committed identity can have a different installation."
    }
  ],
  "reopenWhen": "A consumer default selects a fixture, a current installation change can consume an old pass, or target claims accept starter evidence."
}
```

## WO-213-D015

```json
{
  "id": "WO-213-D015",
  "date": "2026-10-15",
  "dispatch": "scope expand: address the relevant instance observed integration, reader-profile and seed amendment issues",
  "decision": "During integration, verify a compiled kit and re-emit its harness instead of building absent package sources. Skip publication locks only when both editions are undeclared; partially declared editions remain strict. A compiled console update selects no absent core console fixtures; a declared fixture directory remains strict. Supply balanced advisory reader guidance when no reader registry exists. Explain that a never-judged seed has no planning receipt to amend: record its actual operator authorization in structured decisions and follow normal planning, document and lifecycle requirements without inventing a planning verdict.",
  "evidence": [
    "worktree-integration.mjs tests distinguish kit runtime verification, core builds, absent editions and partial declarations; a real exported-instance lifecycle fixture also runs worktree integrate.",
    "Reader profile fixtures pass all five guidance surfaces with the balanced default and no writes, while malformed declared registry or example content still refuses.",
    "plan-receipts.mjs checks for the latest planning receipt before looking up the order. It does not scan older receipts, waive holds, change source bindings or file a synthetic successful seed amendment. The exported-instance fixture asserts the actionable refusal leaves planning history unchanged."
  ],
  "rejected": [
    {
      "option": "Add root and package compiler configs to every starter",
      "reason": "A consumer already holds compiled runtime and has no platform sources to rebuild."
    },
    {
      "option": "Treat every missing publication or reader file as optional",
      "reason": "A declared but malformed or incomplete contract remains an error."
    },
    {
      "option": "Manufacture a planning receipt for the seed",
      "reason": "No independent planning judgment exists to support it."
    }
  ],
  "reopenWhen": "A kit gains declared package sources, an edition or reader registry is explicitly declared, or an order actually requires a missing planning judgment."
}
```

## WO-213-D016

```json
{
  "id": "WO-213-D016",
  "date": "2026-10-15",
  "dispatch": "scope expand: address the instance resume dispatch and missing role issue",
  "decision": "Recognize a leading canonical resume phrase followed by a newline or semicolon while preserving the complete operator prompt. Bind a roleless Claude hook session after an observed whole foreground CLI dispatch succeeds at its expected canonical lifecycle boundary; keep its earlier read receipts, authored paths and usage identity. Never infer a session from a process id or replay the lifecycle command.",
  "evidence": [
    "The compiler helper is shared by ordinary prompt dispatch and stale-main release-close recovery. Quoted, embedded and word-continued phrases do not dispatch.",
    "The CLI observer joins native session_id and tool_use_id across PreToolUse and PostToolUse, checks the unchanged event prefix and the exact expected request event where applicable, and verifies eventless next/release-close phase conditions.",
    "The real CLI lifecycle fixture with synthetic native hook events passes next, verify, fix, repeated verification, final review and closed-main release close. Failed, interrupted, backgrounded, wrapped, stale and mismatched tool results do not bind. An unrelated interleaved tool leaves the pending dispatch intact.",
    "The current official Claude hooks contract (https://code.claude.com/docs/en/hooks#posttooluse) describes PostToolUse as following a successful tool call. This regression exercises that documented payload boundary; it is not a claim of a new interactive Claude host qualification."
  ],
  "rejected": [
    {
      "option": "Guess a Claude session from environment variables or the latest local file",
      "reason": "Those values do not establish the actual hook session."
    },
    {
      "option": "Re-run next to create missing role observations",
      "reason": "A successful dispatch already happened; observation repair must not append a second lifecycle transition."
    },
    {
      "option": "Let binding context overwrite queued shell guidance",
      "reason": "The diagnostic would be marked answered without being delivered; the contexts are combined."
    }
  ],
  "reopenWhen": "The native hook contract changes or an observed supported foreground command cannot establish the required session and lifecycle evidence."
}
```

## WO-213-D017

```json
{
  "id": "WO-213-D017",
  "date": "2026-10-15",
  "dispatch": "scope expand: investigate the reported 830-second wait and recovery meter omissions",
  "decision": "Keep host scheduling admission and reclamation unchanged. Correct elapsed wait accounting to include the initial and final lock wait, and record bounded path-free lock/capacity observations with periodic holder summaries. For open recovered orders, combine observations from the registered main checkout and the current checkout, deduplicate only the raw shared journal prefix and superseded usage identities, and write the snapshot only in the current checkout. Closed-order snapshots remain immutable.",
  "evidence": [
    "host-wait-diagnosis.json records the historical timing comparison. The root core review was running: launchpad and then worktree-integration held exclusive four-slot reservations during the reported interval. The instance acquired about 142 ms after integration ended. This is a timing-supported contention inference, not a recovered historical lease identity.",
    "The reported 830458 ms is scheduler wait, separate from about fifteen seconds of validator execution. The accounting defect reproduced with initially free capacity behind a held kernel lock; it undercounted such waits and is not offered as the cause of the historical 830-second value.",
    "Host-lane fixtures cover lock waiting, unchanged-holder heartbeats, retained parent reservations with live nested tasks and path-free observations. Carried task evidence drops historical wait observations along with wait duration.",
    "Recovered-order regressions pass copied prefixes, divergent suffixes, cross-order divergence, repeated timings, usage supersession, current lifecycle authority, malformed supplemental records, symlink refusal and closed snapshot retention."
  ],
  "rejected": [
    {
      "option": "Attribute the delay to an unseen gate",
      "reason": "The root review command and task timing were observed; the exact historical lease ownership was not retained, so the attribution is explicitly an inference."
    },
    {
      "option": "Read arbitrary nearby checkouts or rewrite a closed meter snapshot",
      "reason": "Only the registered same-repository main can supplement an open order, and closed observations are frozen evidence."
    }
  ],
  "reopenWhen": "A recurring wait lacks a useful holder observation, or a recovered open order cannot discover an admitted original journal without weakening repository identity or containment."
}
```

## WO-213-D018

```json
{
  "id": "WO-213-D018",
  "date": "2026-10-15",
  "dispatch": "scope expand: use the starter or a configured instance name for instance releases",
  "decision": "Use release.displayName for preparation and release human titles, default DotLn for existing configurations and DotLn-Enterprise-Starter for fresh exports. Resolve historical names at each manifest release commit. Recognize custom annotated releases through the canonical manifest marker and then apply strict parsing. Refresh generated README claims from the destination configuration while preserving its exact configuration bytes or absence and proving any replaced seed against its prior exported template.",
  "evidence": [
    "The custom-identity fixture creates a custom-named annotated tag and GitHub Release through the local forge stub, retries without a new tag or Release, commits a later rename and regenerates the old release text byte-for-byte.",
    "Reader scoring admits a custom-named published tag. Strict history fixtures reject malformed JSON, a missing manifest footer and malformed attribution for custom titles instead of silently omitting them.",
    "The configuration validator rejects null, nonstrings, multiline/control-containing names, backticks and embedded strict release-version tokens. The canonical manifest schema and legacy subtitle title handling remain unchanged.",
    "Starter refresh has explicit regressions for a legacy absent configuration and a custom configured name, alongside fresh-export default checks."
  ],
  "rejected": [
    {
      "option": "Read current configuration when regenerating an old tag",
      "reason": "A later rename must not change historical release text or publication reconciliation."
    },
    {
      "option": "Treat dotln.config.json as an upstream-owned refresh seed",
      "reason": "It is instance-owned; refresh must preserve an existing choice and cannot invent a baseline for legacy absence."
    }
  ],
  "reopenWhen": "A release surface disagrees about the recorded name or refresh cannot preserve an instance-owned configuration without altering unrelated seed content."
}
```

## WO-213-D019

```json
{
  "id": "WO-213-D019",
  "date": "2026-10-15",
  "dispatch": "resume: next; authorized instance repairs; required final worker review",
  "decision": "Bind consumer evidence to actual generated harness surfaces and the complete selected runtime. Name, preserve and validate snapshots using one canonical inventory of every copied package manifest and runtime file, directory, executable bit and canonical workspace link. Prepare a missing carried runtime before release publication validation, and use the prepared source-revision installation for a preview. Allow an unbound status/times auxiliary hook session to receive the same validated foreground CLI dispatch binding as a roleless session.",
  "evidence": [
    "The fresh criteria worker found two defects: generated hooks were outside the instance digest, and auxiliary status/times sessions held an executor role without an order or expected event, causing the CLI observer to skip them. The fresh design worker found two related defects: live release validation preceded runtime preparation and used the older main installation during preview; snapshot naming omitted some copied packages that the gate digest covered.",
    "Focused executable regressions pass generated-hook modification/deletion and alias refusal, stale gate lookup and live publication refusal, actual status/times-to-CLI transitions, unpinned kernel and build-free Beacon changes, package metadata and executable-bit changes, altered/extra snapshot entries, exact missing-snapshot restoration and manifest serialization round-trip.",
    "The real exported-instance workflow passes an upstream console update and integration, records a passing runtime reviewer gate, previews release close from an older main without advancing it, prepares the reviewed release without package source or publication, and refuses an altered installed snapshot. Separate exported gates pass the two runtime, seventeen document and two review selections, including drift refusals.",
    "Both final workers rechecked the corrected order/diff and reported zero remaining findings and zero new findings. The executor ran the tests. The preview regression exposed JSON property-order differences between source pins and the canonical manifest; canonical serialization fixes the identity rather than relaxing validation."
  ],
  "rejected": [
    {
      "option": "Keep only the original small pin list as the snapshot identity",
      "reason": "Preservation copies other imported packages too, so a rebuilt missing snapshot could disagree with a reviewed installed tree after a console-only update."
    },
    {
      "option": "Skip live instance validation during release preview or rebuild consumer source",
      "reason": "The preview must prove the reviewed installation, and the consumer intentionally carries compiled packages without the core source build."
    },
    {
      "option": "Rebind every already-role-bound session",
      "reason": "Only the unbound auxiliary status/times case needs promotion; active order and expected-event bindings must remain intact."
    },
    {
      "option": "Leave the review findings unchanged",
      "reason": "An old passing gate could be consumed after generated-hook drift, and a valid reviewed instance release could refuse solely because main had an older installation."
    }
  ],
  "reopenWhen": "A copied runtime input is omitted from the shared inventory, a supported generated surface can change without invalidating evidence, or a reproducible preview cannot reconstruct the reviewed carried installation."
}
```

## WO-213-D020

```json
{
  "id": "WO-213-D020",
  "date": "2026-10-15",
  "dispatch": "resume: next; final document validation after the authorized component repairs",
  "decision": "Correct four decision dispatch prefixes without changing their meaning, and canonically rebind D012 through amend-order. Select new WO-213 revision 001 authority, artifact-identity, verification and feedback editions. Generate the deterministic editions and carry the existing live feedback audit by reference, then re-pin the console selfhost projection. Preserve every historical edition and the existing baseline.",
  "evidence": [
    "The first final document gate rejected D011, D012, D013 and D018 dispatch syntax. D012 was already hash-bound; a new PlanExecutionAmended event rebinds the corrected decision while retaining the identical approved order hash. The planning checker explicitly supports this correction path.",
    "The same gate reported stale authority, artifact, verification and feedback evidence after compiler 0.27.1 and the registered-source changes. The current-evidence selector names replacements; it does not alter the old records.",
    "The authority generator completed its unchanged-program, migration, rejection, denial, grant and 37 bundle comparisons. The artifact generator preserved the frozen oracle and Seiri hash, and the verification generator passed planted-defect, repair, staleness and replay assertions.",
    "The canonical feedback carry confirmed that only component release labels moved in the judged feedback behavior. It preserved the live audit rooted at WO-199/feedback-004 through the previous WO-076 edition; no new live episode ran. The console re-pin regenerated only the selfhost projection."
  ],
  "rejected": [
    {
      "option": "Rewrite the selected historical evidence in place",
      "reason": "Filed observations remain immutable; the generators provide new edition paths."
    },
    {
      "option": "Restore old component labels or weaken stale-evidence checks",
      "reason": "The compatible runtime repairs require their actual new identity and current executable evidence."
    }
  ],
  "reopenWhen": "A generated edition fails its check, feedback judged behavior changes beyond the admitted release-label normalization, or the corrected receipt changes the approved scope."
}
```

## WO-213-D021

```json
{
  "id": "WO-213-D021",
  "date": "2026-10-15",
  "dispatch": "resume: next; operator correction to trace affected tests before another full review",
  "decision": "Select runtime package roots from the declared workspace entries in a valid regular package-lock.json, then retain the complete manifest, runtime-byte, directory, mode and alias checks. Minimal runtime trees and snapshots without a root lockfile retain directory discovery; a malformed or aliased lockfile refuses. Snapshot copying uses the same inventory. Keep printer-admission fixtures on the real pinned harness installation, now using the declared runtime inventory. Compile Codex continuation fixtures directly through the real contributor compiler, and keep the installed-format assertion in the existing harness machinery suite. Declare the runner import used by the guarded inventory regression and list the added custom-release scenario in the release case inventory. Run affected groups through the guarded runner before completing the full review.",
  "evidence": [
    "The third final expanded review passed launchpad, worktree integration, harness fixtures and process-debt. Worktree and release-close assertions passed, but the product-read guard rejected the newly introduced packages directory enumeration. The executor stopped the incomplete run; it supplies no passing gate.",
    "The dependency trace reached the close-admission helper from worktree and release material/close cases, and the Codex generated-entry fixtures directly. Real target installation also reaches the inventory through target-publish, skeleton source-change/repair/verification, vertical and portfolio workflows. These consumers retain real runtime validation.",
    "The declared-inventory regression passes under the runner's product-read guard while its broad-directory negative control still refuses. The same regression covers changed runtime bytes, undeclared adjacent package exclusion, malformed lockfiles and aliases. The complete snapshot and moved installed-format regressions also pass; the installed harness check reports all 34 generated surfaces current.",
    "The export lockfile already names its KIT_WORKSPACES and the export predictor inventories those planned package files. The copy loop derives package roots from the inventory itself. No product-read exception or synthetic installation success is introduced.",
    "The changed registered authority source requires a new authority revision. Revision 002 is generated and selected under WO-213; revision 001 and all historical editions remain intact.",
    "The complete twelve-group diagnostic batch passed target-publish, skeleton, vertical, portfolio, target-worktree, launchpad-planning, harness-fixtures, launchpad and worktree-integration. Worktree and release caught a printer-fixture trial that omitted runtime pins required by the real compiler; the correction retains the full installation instead. Runner fixtures passed 176 tests and identified exactly two missing declarations: custom_identity in the release case inventory and scripts/test-runner.mjs in the harness-fixtures source inventory.",
    "A bounded trace of the remaining starter_refresh failure identified the refusal starter seed differs from prior export: README.md. That legacy fixture has no instance configuration, but copied the new starter display name. Its README now uses the legacy DotLn default; the production customization refusal remains unchanged. The complete real-export and starter-refresh suite had passed in the same diagnostic batch.",
    "The executor incorrectly said single-suite rows could supply passes to the full review. gate-reuse.mjs admits them only as observations that can invalidate a pass; the claim was corrected explicitly. These diagnostic rows do not replace the required complete review. A separate accidental bare harness evidence invocation was stopped after its behavior was identified; the stop response recorded no check."
  ],
  "rejected": [
    {
      "option": "Keep restarting the full review after each isolated fixture correction",
      "reason": "It repeatedly pays for earlier passing groups before exposing another indirect consumer. The guarded affected groups can record their own current-identity executions first."
    },
    {
      "option": "Relax the product-read guard or replace real runtime checks with synthetic hook compilation",
      "reason": "That would weaken the input boundary or target-installation claim. Codex continuation behavior can use its real contributor profile directly; the printer-admission profile requires actual runtime pins and retains the full installation."
    },
    {
      "option": "Copy a separate whole runtime into every affected workflow fixture",
      "reason": "Declared workspace selection fixes the shared unnecessary input dependency while preserving the existing real workflows and complete copied-byte checks."
    },
    {
      "option": "Leave package discovery unchanged",
      "reason": "Ordinary product workflows would continue reading an excluded ancestor directory despite needing only declared runtime packages."
    }
  ],
  "reopenWhen": "An installed runtime has a supported package outside the declared workspace set, an export prediction differs from its lockfile-selected inventory, or a guarded affected group exposes another dependency."
}
```

## WO-213-D022

<!-- integration refs/dotln/checkpoint/WO-213/6 -->

```json
{
  "id": "WO-213-D022",
  "date": "2026-10-15",
  "dispatch": "resume: final review; worktree integrate WO-213",
  "decision": "The integration took in nothing: main and origin/main stood at the order's base 7b66f8b3, so the merge was a no-op, no authored conflict arose, no projection was resolved by hand and no component version collides. Every acceptance claim VER-001 judged carries forward unchanged at the same code identity e9c386f3; the regenerated runtime, hook bundle, manifest, control projection, release preparation, decisions index, register, work-order index, sibling registry, publication locks and console fixtures are projections of the same subject, and the executor's passing npm test review row at that identity remains the product-gate evidence. No registered evidence source changed in the integration, so no edition is re-minted and no live episode is owed.",
  "evidence": [
    "refs/dotln/checkpoint/WO-213/6",
    "base 7b66f8b303a316ff4560b4827d6dc728cd7f504a",
    "upstream 7b66f8b303a316ff4560b4827d6dc728cd7f504a",
    "release preparation: WO-213 target v0.83.0 remains current. Files changed: docs/evidence/WO-213/meta.json, docs/final-reviews/WO-213/PR.md. Meter snapshot: docs/evidence/WO-213/meta.json, 4082 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity reads e9c386f3d3952fa2918659b4b108be83c0f1202d907d13ddc611da0a5e4a8e62 before and after the integration; the executor's npm test review row at that identity (45 suite results, 102 fresh tasks, exit 0, 2263.0 s, recorded 2026-10-15T19:35:06.947Z) and the verifier's document gate at it stand.",
    "Affected checks run bounded on the integrated tree at 20:17:50 to 20:18:07 UTC, each exit 0: npm run publication:check (both editions current, 29 and 45 linked sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (v0.83.0 over v0.82.0, every surface PASS), lineage, work-order and sibling index checks, publication locks, format:check, plan check and meta --check; git diff --check clean. The review gate on the integrated tree is recorded in FINAL-001.",
    "Local tags end at v0.82.0 (the base's tag); the release block v0.83.0 collides with nothing, and compiler 0.27.1, skeleton 0.59.1 and harness host 0.35.2 are the executor's declared patches (D013), unchanged by the integration."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-15. Original base: `7b66f8b303a316ff4560b4827d6dc728cd7f504a`.
Fetched main: `7b66f8b303a316ff4560b4827d6dc728cd7f504a`. Checkpoint: `refs/dotln/checkpoint/WO-213/6`.
Named stash retained: `96f1940bbd747e7e4e22ab2ff4b9480ed8251418` (WO-213 integrate 2026-10-15).
Resolved projections: none.
Release preparation: WO-213 target v0.83.0 remains current. Files changed: docs/evidence/WO-213/meta.json, docs/final-reviews/WO-213/PR.md. Meter snapshot: docs/evidence/WO-213/meta.json, 4082 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim VER-001 judged, criteria 1 to 14, carries forward unchanged; the integration changed no judged byte, and code identity `e9c386f3…` is the same before and after.
Authored conflicts observed: none.
Affected checks: publication, harness, release surfaces, lineage, work-order and sibling indexes, publication locks, format, plan and meta checks ran bounded on the integrated tree and passed; the review gate is recorded in FINAL-001's Executed checks.

## WO-213-D023

```json
{
  "id": "WO-213-D023",
  "date": "2026-10-15",
  "dispatch": "resume: final review; FINAL-001; three read-only reviewers",
  "kind": "finding",
  "decision": "Fail the final review of WO-213 at the integrated subject, code identity e9c386f3d3952fa2918659b4b108be83c0f1202d907d13ddc611da0a5e4a8e62, the identity VER-001 judged; integration changed no judged byte (D022). The verdict rests on two blocking findings inside the subject's declared surfaces. F1: packages/skeleton/src/harness-host.ts observeCliDispatch sets session.releaseCloseDispatch after it observes a model-run npm run resume -- release-close in a roleless session, and releaseCloseAdmission keys WO-178's first admission (permissionDecision allow for the byte-exact release.mjs close WO-NNN --publish helper, which bypasses the host's permission prompt) on that field alone; at main the only setter was recordDispatch after the harness itself ran the dispatch for the operator's resume: release close phrase, so the operator's phrase was the publication's key and a model's own command now supplies it. Criterion 12 requires existing authority bindings preserved, so it is unmet. F2: scripts/lib/private-paths.mjs withoutHomeDirectories is not idempotent when a second home prefix follows the first match's account name directly (the fixture path home, fixture-user, home, other): the global replacement evaluates its look-behind against the original text, so the second segment stays, and its leading angle-bracket placeholder no longer blocks it on the next pass; planning-followups.mjs projects every stored revision through the same function on every sync, so a decision whose followup text holds such a path appends a revision at every sync, check mode stays stale (every planning command refuses), the union refuses as divergent, and the projected register line fails the record screen that this order adds; main's register converged for the same text. Criterion 3's projection property is unmet for that input. Both repairs are a few lines with a fixture each. Sixteen follow-ups are boarded with their repair rules for the same repair's Adjacent Repair bound, seven of them from the instance gate and runtime surfaces; the draft PR body and release notes stay beside the report with the fail stated, and nothing is published.",
  "evidence": [
    "docs/final-reviews/WO-213/FINAL-001.md: criterion judgments, the findings block and Executed checks",
    "D022 (integration took in nothing); VER-001 (pass) at code identity e9c386f3; the executor's fresh npm test -- --review row at that identity (2026-10-15T19:35:06.947Z, 45 suite results, 102 fresh tasks, exit 0, 2,263,020 ms)",
    "F1, code at the subject: observeCliDispatch (harness-host.ts lines 689 to 888) sets session.releaseCloseDispatch for a release-close action at line 870; releaseCloseAdmission (lines 1197 to 1278) reads the field at line 1202 and returns permissionDecision allow at line 1268 when the helper spelling, the main checkout and the legal action hold; git show HEAD of the same file sets the field only at line 746 inside recordDispatch, after the harness ran the dispatch for the operator's phrase. The dispatch-binding reviewer reproduced it end to end in a scratch fixture built from the harness fixture helper and the worktree's compiled host: a roleless session, a fake closed status on main, PreToolUse and PostToolUse for npm run resume -- release-close with an empty successful tool response and the command itself never run, then the permission hook on the publish helper answered permissionDecision allow with the first-admission reason; another roleless session kept the empty judgment. WO-178's order text keys the admission on the session's recorded dispatch, which at main only the operator's phrase recorded.",
    "F2, unit reproduction by this reviewer: withoutHomeDirectories on the fixture text returns a string that HOME_DIRECTORY still matches, and a second application changes it again; a path whose second home prefix is not adjacent is a fixed point. The record-screen reviewer reproduced the register effect with the real syncFollowups on a scratch repository: the first sync stored the residue, every later check-mode sync reported the register stale, the second, third and fourth syncs stored two, three and four revisions, unionFollowups refused as divergent, and docs-check failed on the register's two lines after the first sync while it had passed before; a decision written with JSON-escaped solidi reaches the route because decisions.md passes the Markdown rule and the source body is parsed before projection.",
    "F3 to F9, F11 and F12 to F18: each read at the named lines by this reviewer against the reviewers' probes (the record-screen reviewer's fx.mjs and probe scripts, the dispatch reviewer's fixture, the instance reviewer's synthetic kit roots, umask and mode probes, stray-snapshot probe and meter-root reading) and the fixtures they name; F10 by git log -S on scripts/test-release.sh (added 2026-09-15 at 16ecf2cc, unchanged by this order).",
    "F12 probe by the instance reviewer: a synthetic kit whose harness row records the live gate run's kind reads product for a plain run on HEAD and document on the subject; harness-host.ts admits the active order's record writes only while every live run is a product run, and the generated instruction block still promises that admission during a product gate. F13 probes: files written with mode 755 under umask 022 predict the same snapshot as their inventory and under umask 077 a different one; a core copy's dotln.js at modes 644, 755 and 700 yields three snapshot names; npm install --offline in a scratch workspace set the executable bit on a workspace bin target, which on HEAD left the snapshot name unchanged. F15 probe: a stray file written into a preserved snapshot makes preserveHarnessRuntime refuse with the complete-inventory message and no remedy, and bootstrap re-validates the same snapshot. F16 reading: observationRoots returns the registered main checkout for every open order in a linked worktree, and the strict journal parser fails meta on one malformed line there; main holds 200 journals of about 49 MB against this worktree's 3.",
    "Register and baseline at this subject: the retained script reproduces the 291 fingerprints, the register is a fixed point today (0 revisions change on re-projection) and holds no home-directory match, and no current decision text holds an adjacent chained home path, so F2 wedges nothing committed today.",
    "Three read-only dotln-worker reviewers (claude-opus-5-5, xhigh by definition) batched over the record screen and register, the instance gate and runtime evidence, and the dispatch binding and release naming; this reviewer reproduced the items the verdict rests on and reduced the set to the findings FINAL-001 lists."
  ],
  "rejected": [
    {
      "option": "Pass and board F1 as a follow-up because the model must still choose to run the command",
      "reason": "The admission's purpose is that only the operator's phrase keys a publication; a session the operator never dispatched can now run the dispatch itself and have the hook allow the publish helper without a host prompt. Criterion 12 names existing authority bindings as preserved, and the operator's standing rule refuses publication without explicit authorization."
    },
    {
      "option": "Pass and board F2 as a follow-up because adjacent chained home paths are rare",
      "reason": "Product 07 routes a change that breaks a behavior main had, shown by a probe, as blocking; the consequence is a register every planning command refuses until a source is found and rewritten, and the register line the projection produces fails the very screen the order adds. The fix is a fixed-point loop and two fixture cases."
    },
    {
      "option": "Judge the basename-.md gap (F3) blocking as well",
      "reason": "No document under the roots is named with a bare .md basename and no supported route produces one; the fix is one token in the same module and belongs to the repair's Adjacent Repair bound."
    },
    {
      "option": "Fix F1 and F2 in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; both changes alter the code identity and return through resume: fix and fresh verification."
    },
    {
      "option": "Remove the draft PR body and release notes",
      "reason": "Both are accurate drafts at this identity whose validation paragraphs state this fail; keeping them saves the passing review a rewrite, and nothing publishes them before a passing result."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D016",
    "observation": "Binding a roleless session after an observed CLI release-close also sets the field that keys WO-178's publish admission, so the admission is no longer tied to the dispatch the harness recorded from the operator's phrase."
  },
  "followup": "WO-213 resume: fix. (F1) packages/skeleton/src/harness-host.ts: bind the role, intent, order and expected event on an observed CLI dispatch without setting releaseCloseDispatch, so the publish admission stays keyed to the dispatch the harness recorded from the operator's phrase; scripts/test-harness.mjs asserts that after a CLI-observed release-close the permission hook withholds the admission with its named fact while the WO-178 phrase case still allows. (F2) scripts/lib/private-paths.mjs: make withoutHomeDirectories reach a fixed point (replace until no match, or match a leading placeholder as a boundary) and pin idempotence in scripts/test-docs-check.mjs; scripts/test-process-debt.mjs syncs a decision whose followup text holds an adjacent chained home path and asserts one revision, a current check-mode sync afterwards and a register the record screen passes. Boarded for the same repair's Adjacent Repair bound, all in the declared surfaces unless noted: (F3) privatePathRule selects the Markdown rule by endsWith('.md') as markdownFiles lists, with a case for a bare .md basename. (F4) scripts/lib/target-planning.mjs screens the commit message, the pull-request title and the body under the Markdown rule before the commit and the forge call, and scripts/test-target-worktree.mjs refuses a title naming a fixture home path with no commit and no forge call. (F5) scripts/docs-check.mjs refuses an unreadable record file or a symbolic link to a directory under a root by relative path with a named remedy, never the absolute path, where it now throws EACCES or EISDIR naming the path. (F6) For record files, treat a JSON escape sequence before a slash as a non-word boundary so a home path written directly after an escaped newline or tab fails the record rule, with cases for .json and .jsonl; this is the order's escaped-forms limit narrowed for records, where captured output makes the shape ordinary. (F7) observeCliDispatch treats tool_response.success === false as a failure, as observeAuthorship does, and the fixture adds that response beside the exit-code case. (F8) The dispatch command regex admits WO-NNN exactly as resume's selection does, and a status failure inside the observer skips the binding and keeps the call's ordinary observation instead of degrading the whole hook to a runtime-unavailable advisory that names bootstrap. (F9) The correct refusal and the gate-reuse comparison name a row that records no installed-runtime digest as such, with the current instance gate as the remedy, instead of asserting the runtime changed. (F10, new scope) scripts/test-release.sh sets the fixture Git user.email to an address under .invalid instead of an address carrying the operator's account name (added 2026-09-15). (F11) validReleaseDisplayName bounds the name's length and its refusal names format characters beside control characters. (F12) scripts/test-runner.mjs runs an instance's plain selection as a product-kind gate run, so the order's own evidence, verification and final-review writes stay admitted as the generated instruction block promises, or the stricter refusal is recorded in D014 and stated in the client README; the runner fixture asserts the chosen kind. (F13) scripts/lib/harness.mjs binds the executable bit as one boolean in the runtime inventory and its snapshot name, so the umask of the host that wrote the files and npm's bin chmod do not rename the snapshot, with a fixture under a restrictive umask and a core check after a workspace install. (F14) packages/skeleton/src/gate-evidence.mjs computes the instance input digest only where isKitRoot holds (a kit manifest and no package sources), as the release, license and integration code already decide. (F15) preserveHarnessRuntime and harness check name the remedy for a snapshot that differs from its inventory (remove the named snapshot directory and run the build bootstrap) or let bootstrap replace it, never a bare refusal; the release notes' claim of a refresh remedy is corrected at the next review. (F16) scripts/lib/meta.mjs supplements an open order from the registered main checkout only when the order's control fold shows a recovery into this checkout, parses supplemental journals leniently by skipping a malformed line with one advisory, and D017 and the notes say linked-worktree open orders where they say recovered ones. (F17, low) runtimePackageNames refuses a declared workspace missing on disk by relative path with a named remedy instead of a raw ENOENT naming the absolute path. (F18, low) profileGuidance treats a dangling symbolic link at the reader-profile path as a malformed declaration rather than an absent one. Low, outside the bound unless met: the Stop complete-scope check reads the default selection while a --work-order binding may name another order.",
  "reopenWhen": "The repair changes a judged surface (fresh verification re-derives it), or an operator decision keys the publish admission to anything other than the dispatch the harness records from the operator's phrase."
}
```

## WO-213-D024

```json
{
  "id": "WO-213-D024",
  "date": "2026-10-15",
  "dispatch": "resume: fix; FINAL-001 findings F1 and F2 with sixteen boarded follow-ups",
  "decision": "Repair the two blocking findings and close fourteen of the sixteen boarded follow-ups inside the Adjacent Repair bound; defer two to planning. F1: an observed CLI dispatch binds the session's role, intent, order and expected event and never sets releaseCloseDispatch, so WO-178's publish admission is keyed only to the dispatch the harness records from the operator's resume: release close phrase, and the binding's message says the admission stays withheld. F2: withoutHomeDirectories repeats the replacement until the home-directory rule finds nothing, so its result holds no match of the record rule and a later projection returns it unchanged; each pass shortens the text, so the loop ends. Repaired follow-ups: F3 (the Markdown rule follows the .md suffix the listing uses), F4 (the planning publication screens the title, commit message and body under the Markdown rule before any write, commit or forge call), F5 (an unreadable document or record, a link to a directory included, refuses by repository-relative path with a remedy), F6 (the record rule also matches after a JSON escape sequence, the shape of captured output; the committed records gain no newly matching line and Markdown keeps its plain boundary), F7 (a tool response reporting success false does not bind), F8 (the dispatch pattern admits WO-NNN exactly and an unreadable canonical status skips the binding with one advisory), F9 (correct and the live publication reader name a row that records no installed-runtime digest as such), F11 (a declared release display name is bounded at 64 characters at configuration intake and the refusal names format characters; the shape predicate that also recognizes names in existing tag annotations and README text keeps admitting any length, as main did), F12 (an instance's plain gate stays a document-kind run and the client README states that the order's record writes are refused while it runs; D025 records why), F13 (the runtime inventory binds the executable bit as one boolean and the build marks declared bin targets executable, as the export already does), F14 (the instance input digest exists only where the kit manifest exists and no package holds a tsconfig.json), F15 (snapshot refusals name the directory and the remedy), F17 (a lockfile-declared workspace missing on disk refuses by its relative path), F18 (a dangling link at the reader-profile path is a declaration the malformed route reports). Deferred to planning: F10 (the fixture address is the committed public author identity the sign-off exemption keys on) and F16 (no control event marks a recovery into a checkout, and strict parsing of supplemental journals is a recorded choice with a regression).",
  "evidence": [
    "F2 before the repair: the single-pass result for a path whose second home prefix follows the account name directly still matched the rule and changed again on a second pass. After it, every probed input is stable on a second application and holds no match: the docs-check fixture pins a two-prefix chain, a three-prefix chain, both prefix orders, a non-adjacent second prefix and the residue an earlier single pass stored; the process-debt fixture syncs a decision holding such a path and finds one revision, a current check-mode sync afterwards, a register the record rule passes, and a committed single-pass residue rewritten in place with no appended revision.",
    "F1: the harness fixture binds a roleless session after an observed release-close, finds no releaseCloseDispatch in its state and receives 'recorded release-close dispatch missing' from the permission hook for the byte-exact close helper, while the WO-178 phrase case still allows; at the subject the observer set that field at its binding and the admission read nothing else.",
    "Economy comparison for F2: a pattern that consumes consecutive home prefixes in one pass projects a chained path to one placeholder, and the repeat-until-stable loop projects it to one placeholder per prefix; both results are fixed points the record rule passes. The loop was kept because its convergence holds for every input by construction rather than for the shapes enumerated.",
    "Adjacent queue (docs/control/local/adjacent-work.jsonl, revision 74): sixteen items queued with cause, fix, paths, checks and priority; fourteen completed with their named checks passing (docs-check-fixtures, process-debt, target-worktree, harness-fixtures, runner-fixtures, configuration-root, reader-fixtures, and a build wherever the compiled runtime changed) and two deferred onto this decision's follow-up; each start followed an intent announcement and an actor-attested check-in that found no operator message at the boundary.",
    "F6 reach: a counted search of the committed record files under the roots for a home prefix written after a JSON escape finds no line, and node scripts/docs-check.mjs on the real tree passes with the same 510 declared historical home-path lines and 0 failures under the widened rule, so the baseline gains nothing and FUP-af65972e5491da22's reopening condition is not met.",
    "F13: after the build, the skeleton's declared bin target is executable; the harness fixture computes the same inventory and snapshot path for 644/755 and for 600/700 modes and a different one once the bit is removed, and the earlier case that toggles the bit still renames the snapshot. scripts/launchpad.mjs already writes bin targets executable for an exported instance. harness emit and check pass at the rebuilt runtime, whose snapshot is 9a2e59b340e7e0e7.",
    "F12: the first pass of this repair made the instance's plain gate a product-kind run and recorded here that core's plain gate ran the same suites under the product read guard; both review workers showed that claim false (the harness row is a document suite the guard never covers), so D025 keeps the document kind and states the refusal in the client README.",
    "F5 end to end: the link check and the operator-word reader read every listed Markdown file before the private-path screen, so all three readers share one reader that refuses by repository-relative path; the fixture covers a record link, a document link and, except when run as root, an unreadable record and document, whose permission error otherwise names the absolute path.",
    "Review workers: two read-only dotln-worker agents (a criteria adversary and a design improver) judged the repair diff; the adversary's probes found withoutHomeDirectories stable and match-free on 300,000 generated strings and on every stored register revision, F1's field set only by the phrase route in source, dist and the active snapshot, and zero newly matching committed record or Markdown lines; their findings are folded in: the kind correction (D025), the display-name bound moved to intake, the shared readers, the digest comparison shared by correct and the publication reader (gate reuse filters digest-less rows silently and has no message), the journal assertions for the dispatch pattern, the build's bin-target mode pinned after the real build, the staging remedy naming the final snapshot, and the observer absorbing only the lifecycle's own refusal.",
    "scripts/test-runner.mjs declares scripts/lib/private-paths.mjs among process-debt's machinery sources because the register fixture imports it directly; the machinery coverage check reports nothing uncovered.",
    "F10: scripts/lib/contributions.mjs exports the same address as operatorAuthor, the public author identity the contribution sign-off exemption keys on; scripts/test-worktree.sh and scripts/test-license-surfaces.mjs set it too, so one fixture cannot change without an exemption decision.",
    "F16: scripts/lib/control-store.mjs defines no recovery event, and D017's evidence records strict parsing of malformed supplemental records as a passing regression, so narrowing the route and relaxing its parser are planning decisions."
  ],
  "rejected": [
    {
      "option": "Keep one replacement pass and add the placeholder as a boundary in the substitution's look-behind",
      "reason": "The residue after one pass still matches the unchanged record rule, so the projected register line would fail the screen this order adds."
    },
    {
      "option": "Stop binding a session after an observed release-close altogether",
      "reason": "The binding supplies role, intent and order to a session the operator started; only the admission must stay with the operator's phrase."
    },
    {
      "option": "Apply the JSON-escape boundary to the Markdown rule as well",
      "reason": "The order keeps the Markdown pattern unchanged by design and records its escaped-forms limit; records are where captured output makes the shape ordinary."
    },
    {
      "option": "Drop the executable bit from the runtime inventory",
      "reason": "D019 binds it deliberately; one boolean and an executable bin target at build remove the umask and install variance without weakening the identity."
    },
    {
      "option": "Repair F10 and F16 inside this bound",
      "reason": "Each needs a decision outside a repair: a fixture exemption in the contribution rules, and a definition of recovery together with a reversal of the strict parsing D017 records."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D017",
    "observation": "The meter's main-checkout supplement applies to every open order in a linked worktree, not only a recovered one; D017 and the handoff notes say recovered where they mean linked-worktree open orders."
  },
  "followup": "Planning: decide whether the release, worktree and license fixtures may configure the committed public author identity scripts/lib/contributions.mjs exports as operatorAuthor or must use a fixture identity with an exemption in the contribution sign-off rules; define the control signal for a recovery into a checkout, narrow the meter's main-checkout supplement to it, and decide whether supplemental journals parse leniently with one advisory, which reverses the strict parsing D017 records. Also for planning: the record rule still passes a home path written directly after an ANSI control sequence in captured output and after an escaped solidus, and the Markdown rule could take the JSON-escape boundary at no baseline cost (zero committed lines would newly match) if the order's pinned Markdown pattern is reopened; the other two reader-profile declaration sites (scoreSelection and scripts/reader.mjs) still read a dangling link as absent. Low and outside this bound: the Stop complete-scope check reads the default selection while a --work-order binding may name another order.",
  "reopenWhen": "Fresh verification re-derives any repaired claim, a projected register line fails the record rule, or an observed command is found to key the publish admission."
}
```

## WO-213-D025

```json
{
  "id": "WO-213-D025",
  "date": "2026-10-15",
  "dispatch": "resume: fix; worker review of the repair diff",
  "decision": "Keep an instance's plain and review gates document-kind runs, as the implementation chose, instead of the product-kind plain gate the first pass of this repair made. The product read guard excludes every tracked file under docs/, .claude/ and .agents/ and every top-level Markdown file, and the instance's harness row reads the harness surfaces and the root instruction file by design, so no product run of that selection can be observed; a product kind would grant the order's record-write admission on a premise nothing enforces. The client README states the consequence: while an instance's npm test or review runs, writes to the active order's evidence, verification and final-review directories are refused, and the executor writes them before or after the gate. The generated instruction block's admission sentence stays true: it describes product gates, which an instance's default selections do not run.",
  "evidence": [
    "scripts/lib/product-read-guard.mjs excludes tracked paths under docs/, .claude/ and .agents/, top-level Markdown and files carrying the documentation attribute; scripts/lib/harness.mjs checkHarness reads the root instruction file, the .claude surfaces, the manifest and the runtime snapshot; scripts/test-runner.mjs classifies harness as a document suite and attaches the read guard only to product rows that are neither document nor build rows, so core's plain gate never ran the instance's rows under it.",
    "Both review workers reproduced this: the adversary's probe found the harness row product false and document true and absent from core's plain selection, and the design reviewer found the first pass's kind expression byte-identical to main's. The first pass recorded the opposite in D024's evidence; that sentence is corrected there.",
    "The kit gate fixture in scripts/test-runner.test.mjs observes document for every instance selection again, with the reason in its comment, and scripts/kit/README.client.md states the write refusal in its section on what runs in an instance."
  ],
  "rejected": [
    {
      "option": "Run the instance's plain gate as a product run without a read guard",
      "reason": "The admission's premise is that product tasks fail on observed reads of the admitted record paths; the instance's rows carry no guard, so a pass could depend on bytes written during the gate."
    },
    {
      "option": "Attach the product read guard to the instance's runtime rows",
      "reason": "The guard excludes the harness surfaces the harness check must read, so every instance gate would fail; a narrower exclusion set is a design decision for planning."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D014",
    "observation": "The ordinary instance gates are document-kind runs whose refusal of the order's record writes D014 did not record; the client README now states it."
  },
  "followup": "Planning: decide whether an instance's runtime rows should take a product read guard whose exclusion set is narrowed to the active order's record roots, so an instance's plain gate can be a product run with the record-write admission the hook grants core.",
  "reopenWhen": "An instance's default selection gains a row the read guard can observe, or the guard's exclusion set is narrowed by decision."
}
```

## WO-213-D026

```json
{
  "id": "WO-213-D026",
  "date": "2026-10-15",
  "dispatch": "resume: fix; document gate after the repair",
  "decision": "Select and generate new WO-213 evidence editions after the repair changed registered sources: authority revision 003, artifact-identity revision 002, verification revision 002 and feedback revision 002, the last carrying the existing live audit by reference as D020 did; re-pin the console selfhost projection to the new feedback edition. Every earlier edition keeps its bytes.",
  "evidence": [
    "The document gate reported the revision 002 authority edition stale after the repair's rebuilt runtime and re-emitted bundle. scripts/lib/evidence-sources.mjs registers scripts/lib/harness.mjs, packages/skeleton/src/harness-host.ts, packages/skeleton/src/gate-evidence.mjs and scripts/build.mjs, which the repair changed, among the common, authority, feedback and harness sources, so each selected edition's registered inputs differ from those it recorded.",
    "The deterministic generators ran after the build and the emit; the feedback carry re-used the live audit the revision 001 edition carries, with no new live episode, since only registered-source bytes moved and no judged feedback behavior changed; the console projection was regenerated to follow feedback revision 002."
  ],
  "rejected": [
    {
      "option": "Overwrite the revision 002 authority edition in place",
      "reason": "Filed editions are immutable; the generators refuse to rewrite a selected edition and provide new revision paths."
    },
    {
      "option": "Run a new live feedback episode",
      "reason": "The carry rule admits a reference when only registered-source bytes change; the audited behavior is unchanged by the repair."
    }
  ],
  "reopenWhen": "A generated edition fails its check or the feedback carry finds judged behavior changed."
}
```

## WO-213-D027

```json
{
  "id": "WO-213-D027",
  "date": "2026-10-16",
  "dispatch": "resume: verify; independent re-verification of the repaired WO-213",
  "kind": "finding",
  "decision": "Board a low-severity inherited diagnostic gap in the product-document measurement reader as a follow-up, without failing a criterion. The repaired listing readers report unreadable Markdown and records by repository-relative path, but checkDocs reads each product document directly with readFileSync before those readers run. An unreadable product document therefore throws EACCES with the absolute checkout path in its message. The same bounded probe reproduces the result in the base docs-check source and the current subject. This narrows the reach of FINAL-001 F5's completed repair; it does not undo the repaired evidence-document and record cases, break an acceptance criterion or regress behavior the base had.",
  "evidence": [
    "scripts/docs-check.mjs checkDocs product loop, current line 1526: readFileSync(join(directory, name), utf8) remains unchanged from HEAD. The helper readListed covers linkFailures, operatorWordFindings and homePathFindings, which are later readers.",
    "The verifier's bounded ver002-product-read.mjs created a disposable Git fixture with docs/product/00-fixture.md and supplied minimal ceilings/baseline records. Both base and subject checks first passed; after chmod to mode zero, both threw EACCES and error.message.includes(fixtureRoot) was true. Permissions were restored and the fixture removed. The probe retained booleans and error codes, never the absolute path text.",
    "The base module came from git show HEAD:scripts/docs-check.mjs with only import locations redirected to current helpers for scratch execution. The direct product-file read is byte-identical. This probe ran as a non-root user and completed with exit zero on 2026-10-16T00:16:59.633Z.",
    "The verifier's focused regression batch passed 21 cases, including the repaired unreadable evidence document and record cases, both original blocking findings, target write refusals and installed-runtime evidence checks. VER-002 records the criterion judgments."
  ],
  "rejected": [
    {
      "option": "Fail the verification on this inherited product-file error",
      "reason": "The original criteria remain satisfied, the base has the same behavior, and product 07 routes a defect that breaks neither to a follow-up."
    },
    {
      "option": "Change the reader during verification",
      "reason": "The verifier judges the implementation read-only; a behavioral repair belongs to an executor."
    }
  ],
  "followup": "Planning: route the product-document measurement read in scripts/docs-check.mjs checkDocs through the same relative-path diagnostic boundary as listed documents. Add a non-root unreadable product-document fixture and a product-directory symlink case; assert a useful repository-relative refusal with no absolute checkout path and preserve product-byte measurements and the existing record/Markdown rules.",
  "reopenWhen": "An executor next changes docs-check's product reader or the unreadable-input refusal; do not copy its current raw system diagnostic into public evidence."
}
```

## WO-213-D028

<!-- integration refs/dotln/checkpoint/WO-213/13 -->

```json
{
  "id": "WO-213-D028",
  "date": "2026-10-16",
  "dispatch": "resume: final review; worktree integrate WO-213",
  "decision": "The integration took in nothing: main and origin/main stood at the order's base 7b66f8b3, so the merge was a no-op, no authored conflict arose, no projection was resolved by hand and no component version collides. Every acceptance claim VER-002 judged carries forward unchanged at the same code identity c2028281; the regenerated runtime, hook bundle, manifest, control projection, release preparation, decisions index, register, work-order index, sibling registry, publication locks and console fixtures are projections of the same subject, and the executor's passing npm test review row at that identity remains the product-gate evidence. No registered evidence source changed in the integration, so no edition is re-minted and no live episode is owed.",
  "evidence": [
    "refs/dotln/checkpoint/WO-213/13",
    "base 7b66f8b303a316ff4560b4827d6dc728cd7f504a",
    "upstream 7b66f8b303a316ff4560b4827d6dc728cd7f504a",
    "release preparation: WO-213 target v0.83.0 remains current. Files changed: docs/evidence/WO-213/meta.json, docs/final-reviews/WO-213/PR.md. Meter snapshot: docs/evidence/WO-213/meta.json, 4541 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity reads c2028281766bb74c4ec899f06d0d0db9507737dcd76b41176383d64d4807755d before and after the integration; the executor's npm test review row at that identity (46 suite results, 103 fresh tasks, exit 0, 2,202.7 s, recorded 2026-10-16T00:01:26.994Z) and the verifier's document gate at it (35 of 35, recorded 2026-10-16T00:21:16.092Z) stand.",
    "Affected checks run bounded on the integrated tree at 00:54:18 to 00:54:39 UTC, each exit 0: npm run publication:check (both editions current), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (v0.83.0 over v0.82.0, every surface PASS), lineage (172 sections), work-order and sibling index checks, publication locks, format:check, plan check and meta --check; git diff --check clean. The review gate on the integrated tree is recorded in FINAL-002.",
    "Local tags end at v0.82.0 (the base's tag) and origin holds no v0.83.0; the release block v0.83.0 collides with nothing, and compiler 0.27.1, skeleton 0.59.1 and harness host 0.35.2 are the executor's declared patches (D013), unchanged by the integration."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-16. Original base: `7b66f8b303a316ff4560b4827d6dc728cd7f504a`.
Fetched main: `7b66f8b303a316ff4560b4827d6dc728cd7f504a`. Checkpoint: `refs/dotln/checkpoint/WO-213/13`.
Named stash retained: `d195d39bd82df9f84d4f2d603119e813ff2419f2` (WO-213 integrate 2026-10-16).
Resolved projections: none.
Release preparation: WO-213 target v0.83.0 remains current. Files changed: docs/evidence/WO-213/meta.json, docs/final-reviews/WO-213/PR.md. Meter snapshot: docs/evidence/WO-213/meta.json, 4541 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim VER-002 judged, criteria 1 to 14, carries forward unchanged; the integration changed no judged byte, and code identity `c2028281…` is the same before and after.
Authored conflicts observed: none.
Affected checks: publication, harness, release surfaces, lineage, work-order and sibling indexes, publication locks, format, plan and meta checks ran bounded on the integrated tree and passed; the review gate is recorded in FINAL-002's Executed checks.

## WO-213-D029

```json
{
  "id": "WO-213-D029",
  "kind": "correction",
  "date": "2026-10-16",
  "dispatch": "resume: final review; FINAL-002; register pass over every page of the touching listing",
  "decision": "Record that FINAL-001's register section reported the first page of the touching listing as the matched set, and that this review read every page and re-disposed the rows whose reopening condition this order fired. The filed report keeps its bytes; the correction lives here and in FINAL-002.",
  "misread": "FINAL-001 wrote that npm run plan -- followups --touching --work-order WO-213 matched 7 pending rows and judged those seven. The listing pages seven rows at a time; its matched count and next cursor name the rest, and the completion advisories at implementation-ready and repair-complete named 65 and 69 matching rows.",
  "meant": "The register pass judges every matched row's full reopening condition, re-disposes a row whose condition occurred or whose seam the change opened, and leaves a row it only matched as it is, as ER5-002 (FUP-4b70089b028849f0) records.",
  "changed": "This review read all ten pages, 70 rows at register revision 404b9630c23e2b58fa9b4116fa84f97848cb360385e6e2af7648694e3e1329aa, read the full condition of each row the listing's excerpt cut with followups --show, and applied one batch of nine re-deferrals (FUP-0c10689747f83675, FUP-b28b870422a74166, FUP-d40313eade76b8af, FUP-cb5c3b3e7d0b0c0d, FUP-fa028783f3f6b17f, FUP-b202062fc3cbbbd7, FUP-1315c82ef74fb832, FUP-9d397b57910ae6ed, FUP-cb922b59e013dbf1) that moved the register to 653c9d90ec0a87af340a6afd632abd026177d95cb1ad0f5cb91b2b5aee5272e1 with 267 pending; the other matched rows are judged in FINAL-002's Register section.",
  "evidence": [
    "docs/final-reviews/WO-213/FINAL-001.md, Register: 'matched 7 pending rows' with seven ids, the first page of the listing.",
    "docs/control/orders/WO-213.jsonl: the ImplementationReady advisory names 65 pending rows and the RepairCompleted advisory 69 that name a file this change touches or WO-213.",
    "npm run plan -- followups --touching --work-order WO-213 on 2026-10-16 reports matched 70 of 267 pending with a next cursor on each of the first nine pages.",
    "docs/control/local/followups-batch-final-002.json (ignored lane) is the applied batch; each request binds expectedRevision 404b9630… and the row's source revision, and the apply command reported nine dispositions and revision 653c9d90…."
  ],
  "rejected": [
    {
      "option": "Treat FINAL-001's seven rows as the matched set",
      "reason": "The listing's matched count and cursor show the set is larger, and ER5-002 names leaving a fired trigger unchanged as the hazard."
    },
    {
      "option": "Edit FINAL-001's register section",
      "reason": "A filed report is never edited; the correction is recorded here and in FINAL-002."
    }
  ],
  "reopenWhen": "A later review finds a matched row this pass left whose condition this order fired."
}
```

## WO-213-D030

```json
{
  "id": "WO-213-D030",
  "date": "2026-10-16",
  "dispatch": "resume: final review; FINAL-002; three read-only reviewers",
  "kind": "finding",
  "decision": "Fail the final review of WO-213 at the integrated subject, code identity c2028281766bb74c4ec899f06d0d0db9507737dcd76b41176383d64d4807755d, the identity VER-002 judged; integration changed no judged byte (D028). The verdict rests on one blocking finding inside the subject's declared surfaces. F1: in an exported instance the new runtime inventory and instance input digest walk every directory entry under packages/, so a stray regular file directly under packages/ (a Finder .DS_Store, which the kit's own ignore file anticipates) makes gateInstanceInputDigest throw ENOTDIR with the absolute checkout path in its message before any gate task runs, and the same throw reaches findGateCheck, identityRows, resume correct, the live publication reader and the kit release runtime, where the base returned a row or nothing; and a stray ignored file inside a package's dist enters runtimePackageInventory, renames the snapshot, makes harness check report drift naming an unrelated pinned file, makes the kit release runtime refuse the selected snapshot as not reproducible, and, after the printed remedy re-emits, wedges the check once the file is removed; the base keyed the snapshot on the pinned files alone and tolerated both. Criterion 10 (ordinary instance gates validate installed-runtime and harness integrity) and criterion 12 (existing evidence bindings preserved) are unmet. Nine follow-ups are boarded with their repair rules for the same repair's Adjacent Repair bound; the draft PR body and release notes stay beside the report with the fail stated, and nothing is published.",
  "evidence": [
    "docs/final-reviews/WO-213/FINAL-002.md: criterion judgments, the findings block and Executed checks.",
    "D028 (integration took in nothing); VER-002 (pass) at code identity c2028281; the executor's fresh npm test -- --review row at that identity (2026-10-16T00:01:26.994Z, 46 suite results, 103 fresh tasks, exit 0, 2,202,691 ms).",
    "F1, reproduced by this reviewer at the function level on a synthetic kit root (a kit manifest, a harness manifest with no installed surfaces, one package with a dist and an executable bin target): gateInstanceInputDigest returns a digest on the clean root; with a regular file added directly under packages/ it throws ENOTDIR and its message contains the absolute root, and findGateCheck throws; removing the file restores the clean digest. runtimePackageInventory lists a stray file added inside the package's dist (6 to 7 entries) and runtimeSnapshotPath changes. gate-evidence.mjs gateInstalledInputRoots maps every entry of packages/ to packages/<entry>/dist (lines 52 to 58), containedInput suppresses only ENOENT (line 100), and the digest call in findGateCheck is this order's addition; scripts/lib/harness.mjs runtimePackageInventory visits every entry of the module directory (lines 660 to 705).",
    "F1, the instance-gate reviewer's end-to-end probe on exported kits built from the worktree and from git archive HEAD: packages/skeleton/dist/.DS_Store makes the repaired kit's harness check fail with 'harness drift: pinned snapshot missing or changed (packages/compiler/dist/src/artifact-identity.js)' while the base kit passes; harness emit then rewrites 16 tracked files to a snapshot holding the junk and the check fails again once the junk is removed; scripts/lib/release-kit-runtime.mjs refuses 'Selected harness snapshot cannot be reproduced from the carried runtime'; packages/.DS_Store makes gateInstanceInputDigest throw ENOTDIR naming the absolute path, with every kit runGateChecks, the Stop hook's evidence lookup, resume correct and the live publication reader as callers; in core a stray file under packages/beacons/src renames the computed snapshot where the base's stays.",
    "F2 (the digest hashes raw execute bits): reproduced at the function level, the digest differs between a bin target at mode 755 and 700 while runtimePackageInventory is equal; the reviewer's clones under umask 022 and 077 gave different digests and the same snapshot name, so a release checkout created under another umask refuses with 'reviewed installed runtime differs'.",
    "F3 to F5 (the instance-gate reviewer): packages/*/dist/tsconfig.tsbuildinfo enters the core inventory and embeds the real path of node_modules, so a linked install computes another snapshot where the base computed the same; the digest's kit test and the runner's kit test disagree for a linked package holding tsconfig.json and for a tsconfig.json that is a link or a directory; a throwing onWait in the lock-phase heartbeat produces uncaught exceptions where the base rejected the acquisition.",
    "F6 and F7 (the dispatch-binding reviewer): beginHarnessSession admits a prior roleless state, so a prompted Claude session with no role can run node scripts/harness.mjs begin <id> <role> and take any role on any phase, where the base refused any existing state; the probe shows the outside-write refusal for the uniform scratch roots lifted, the role carried into off-ramp events and lifecycle evidence selection, and the publish helper still withheld; a control-store read failing between the observer's two reads degrades the hook to the runtime-unavailable advisory because only the status failure message is absorbed.",
    "F8 to F10 (the record-screen reviewer): readDecisions in scripts/lib/meta.mjs, the anchor-target read in linkFailures and the product loop's dangling link and unreadable subdirectory cases throw naming the absolute root, on both trees; the link-failure message prints the link text, which may be a home path, on both trees; a bare .json or .jsonl basename and a case-variant record extension are neither listed nor screened under the roots and in the target publication, consistently and as the base's Markdown listing treats .MD.",
    "The reviewers also found sound: one setter of releaseCloseDispatch and one allow decision keyed on it, every reader of role, intent, order and expected event traced, every observer guard holding, the prompt helper on 32 prompts, the substitution stable on 200,000 generated strings, the Markdown listing and findings byte-identical to the base on the real tree, the retained baseline script admitting only base-identical lines, the receipt, event and target screens ordered before every write, the instance selections and kinds, the inventory prediction equal to the disk inventory under both umasks, and the release recognition identical on 167 local tags."
  ],
  "rejected": [
    {
      "option": "Pass and board F1 as a follow-up because a stray file is a host artifact",
      "reason": "Product 07 routes a change that breaks a behavior the base had, shown by a probe, as blocking; the kit's ignore file anticipates the artifact, the instance runs on the host that creates it, and the consequence is an instance whose ordinary gate, evidence lookups, correction, publication and release close all throw or falsely refuse, naming the absolute path."
    },
    {
      "option": "Judge F6 blocking as well",
      "reason": "The only DotLn refusal it lifts is the outside-write deny for the uniform scratch roots every role holds, the host still decides the command, and the publish admission stays keyed to the operator's phrase; no criterion names the explicit entry route, so it is a follow-up with its rule."
    },
    {
      "option": "Fix F1 in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; the change alters the code identity and returns through resume: fix and fresh verification."
    },
    {
      "option": "Remove the draft PR body and release notes",
      "reason": "Both are accurate drafts at this identity whose validation paragraphs state this fail; nothing publishes them before a passing result."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D027",
    "observation": "The reader gap D027 boards reaches further than its text: readDecisions in scripts/lib/meta.mjs, the anchor-target read in linkFailures and the product loop's dangling-link and unreadable-subdirectory cases also throw naming the absolute checkout root, as at the base."
  },
  "followup": "WO-213 resume: fix. (F1) packages/skeleton/src/gate-evidence.mjs and scripts/lib/harness.mjs: the installed-input roots, the instance input digest, the runtime inventory, the snapshot copy and the snapshot check consider only regular directories under packages/ and skip entries Git ignores or that begin with a dot, so a stray file under packages/ or inside a package's dist neither throws nor renames the snapshot, and every refusal names a repository-relative path; the runner fixture and the harness fixture add a stray regular file under packages/ and under packages/<name>/dist in a kit and assert an unchanged digest, an unchanged snapshot name, a passing harness check and a working release runtime, and a core copy's snapshot unchanged by a stray file under packages/beacons/src. Boarded for the same repair's Adjacent Repair bound, all in the declared surfaces unless noted: (F2) gateInstanceInputDigest hashes the executable bit as one boolean as the inventory does, with a fixture at modes 755 and 700. (F3) runtimePackageInventory excludes .tsbuildinfo files as the export does, with a fixture whose node_modules is a link. (F4) the digest's kit test and the runner's isKitRoot share one predicate for linked packages and a tsconfig.json that is a link or a directory, or the difference is recorded in D014 with a fixture. (F5) acquireHostLanes catches an onWait error from the heartbeat and rejects the acquisition as the base did. (F6) beginHarnessSession admits a prior roleless state only for the lifecycle's own automatic entry under Codex or Copilot, or after the canonical boundary check the observer makes; the manual harness begin for a session whose state exists refuses as the base did, and the harness fixture asserts that a prompted roleless Claude session's begin refuses while the Codex entry with roleless observer state still upgrades. (F7) the observer absorbs a control-store read failure between its two reads as it absorbs the status failure, skipping the binding with one advisory. (F8, new scope) D027's planning follow-up also routes readDecisions, the anchor-target read and the product loop's dangling-link and unreadable-subdirectory cases through the relative-path reader. (F9, new scope) the link-failure message writes the link text through the home-placeholder substitution or omits it for a private absolute path. (F10, low) the listing and the rule lower-case the extension before testing it and name a bare .json or .jsonl basename, or the limit is recorded beside D002.",
  "reopenWhen": "The repair changes a judged surface (fresh verification re-derives it), or an operator decision keys the instance digest or the snapshot name on something other than the regular package entries under version control."
}
```

## WO-213-D031

```json
{
  "id": "WO-213-D031",
  "kind": "correction",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator correction and independent review-escape classification",
  "decision": "Judge this second repair against the failure classes and existing authority, using four distinct read-only workers and executor-run regressions. Do not treat the original implementation's twenty workers as a new repair quota. Keep the prior verification and final-review reports immutable.",
  "misread": "The executor initially read the dated implementation scope expansion as requiring twenty new repair reviewers and announced that plan.",
  "meant": "The operator corrected that the twenty workers belonged to the earlier implementation session, while retaining useful independent review, and later explicitly requested one worker to classify what final review alone was finding.",
  "changed": "Retained three already-started surface audits, reused those workers, and added the one requested classification worker. All four used the prescribed Codex launch settings, gpt-6.1-sol at max with no conversation fork, no writes, no probes and no descendants. The executor remains the sole writer and runs the executable evidence.",
  "evidence": [
    "The operator's repair-session messages asked for principal-engineer judgment, closure of classes rather than quoted cases, corrected the twenty-worker interpretation and requested the classification worker.",
    "The classification worker compared FINAL-001 and FINAL-002 with VER-001, VER-002, prior handoffs, tests and D022/D028. Both failed final reviews judged the same code identities as the preceding passing verification; both integrations were no-ops. Integration drift therefore does not explain these escapes.",
    "The escapes cluster around authority-field composition, failure to establish a projection fixed point, overbroad runtime input selection, duplicate representations, incomplete filesystem/asynchronous error boundaries, and a test oracle that positively expected an unsafe manual upgrade. Existing happy-path or helper-only tests did not establish these invariants across their consumers.",
    "D024's unsupported product-guard claim was independently challenged and corrected in D025. The inspected record supplies no evidence of fabricated attestation or violation of independent-verification blinding; a passing test or static opinion simply did not cover the failed property."
  ],
  "rejected": [
    {"option": "Repeat twenty independent static reviews", "reason": "The operator corrected that interpretation, and the observed gaps require executable invariants and consumer coverage rather than a worker-count target."},
    {"option": "Blame integration or weaken the final-review standard", "reason": "The recorded identities and no-op integrations contradict the first explanation; the regressions found by review remain real obligations."}
  ],
  "reopenWhen": "New evidence identifies an escape outside these classes or shows that a repaired invariant is not exercised by its real consumer."
}
```

## WO-213-D032

```json
{
  "id": "WO-213-D032",
  "date": "2026-10-16",
  "dispatch": "resume: fix; FINAL-002 F1-F4 and adjacent runtime audits",
  "decision": "Use one shared runtime-input policy for source classification, instance digest, inventory, export prediction, snapshot copy and snapshot checking. Select declared regular workspaces and their package metadata plus dist or build-free src; represent execute permission as one boolean. Exclude dot-prefixed runtime entries and tsbuildinfo metadata, while retaining other ignored runtime bytes. This refines D030's proposed Git-ignore exclusion: ignored does not mean irrelevant to execution. Keep the helper at the runtime consumers instead of making the generic path library import package code.",
  "evidence": [
    "The pre-repair bounded runner and harness cases failed on packages/.DS_Store and malformed source declarations. Repaired cases pass for metadata files/directories, regular non-package files, mode 755 versus 700, missing/malformed package metadata, symlink and directory tsconfig declarations, build-free source changes and genuine runtime additions.",
    "The bounded instance.runtime.identity comparison passed on 2026-10-16T02:37:03.640Z: Git check-ignore excludes packages/free/src/local/added.mjs, but the shared runtime policy changes the digest for that real module while dot metadata leaves it unchanged. Blanket Git-ignore selection would omit the very built and installed roots whose freshness the digest must bind.",
    "The source-free beacon-portability fixture first failed because a re-export from scripts/lib/paths.mjs introduced a new skeleton dependency into every path consumer. Direct imports at the actual runtime consumers removed that coupling; the unchanged portability contract then passed both cases on 2026-10-16T02:22:02Z.",
    "The harness regression compares disk inventory with export prediction, copies exactly that inventory, tolerates incidental metadata in installed snapshots and rejects actual added runtime payload. The exported-instance regression extends the same invariants through ordinary gates, evidence lookup and release-runtime restoration; its executed result is recorded in the handoff."
  ],
  "rejected": [
    {"option": "Skip every Git-ignored path", "reason": "The bounded comparison shows that this loses real runtime modules; compiled and installed runtime roots are themselves ignored."},
    {"option": "Hash only pinned entrypoints", "reason": "An unpinned imported module or added payload would escape complete runtime freshness. The inventory remains the complete selected runtime, and copying follows it exactly."},
    {"option": "Store another persistent runtime manifest", "reason": "The existing planned writes and deterministic inventory already supply prediction and checking; another stored authority would require reconciliation without removing the completeness walk."},
    {"option": "Keep source discovery on the generic path library", "reason": "The bounded source-free fixture demonstrated an unnecessary package dependency for callers that only need path and document operations."}
  ],
  "reopens": {"decisionId": "WO-213-D030", "observation": "F1-F4 are repaired as one semantic-input boundary; the proposed blanket Git-ignore exclusion would weaken that boundary and is replaced with explicit metadata exclusions."},
  "reopenWhen": "A package intentionally ships hidden runtime payload, needs a different module-root policy, or a consumer disagrees with inventory/digest selection."
}
```

## WO-213-D033

```json
{
  "id": "WO-213-D033",
  "date": "2026-10-16",
  "dispatch": "resume: fix; FINAL-002 F5-F10 and boundary audits",
  "decision": "Close the asynchronous, session-entry and document-reader classes. A heartbeat observer failure cancels and drains acquisition before rejection. Manual session entry refuses any existing state path; only lifecycle-owned automatic entry upgrades valid roleless state. A canonical read failure at either observer read skips binding with one advisory while ordinary observation continues. Document readers validate contained regular inputs using nonblocking descriptor reads and render relative, content-free errors. Record suffix classification is case-insensitive and includes bare suffix names; Markdown selection and its pattern stay pinned.",
  "evidence": [
    "Bounded lane tests passed lock-heartbeat exception, caller cancellation and capacity callback failure without a residual lease; the test asserts rejection before its rescue unlock and no later callbacks. Foreground-dispatch fixtures cover manual roleless and null-state refusal with unchanged bytes, lifecycle-owned upgrade preserving observations, and independently failed PreToolUse/PostToolUse second reads with one advisory and retained PostToolUse observation fields.",
    "The docs-check fixture suite passed 65 cases with one retired skip on 2026-10-16T02:22:56Z. It covers unreadable product/decision/anchor inputs, dangling entries, directory aliases, inaccessible subdirectories, tracked FIFO refusal with a bounded child timeout, raw and encoded private links, parser-content omission, invalid decision values and excluded-root filtering before inspection.",
    "Reader-profile fixtures cover dangling declarations, alias loops, inaccessible/non-directory parents and private invalid values. Declared malformed examples refuse; genuinely absent optional inputs retain their default behavior. Integration fixtures cover absent, partial and dangling declared publication, sibling and console-fixture inputs.",
    "The repaired diagnostic path leaves raw link text in baseline identity and does not alter existing Markdown matches or historical record allowances. Target publication uses the same broadened record suffix predicate."
  ],
  "rejected": [
    {"option": "Race a notification error against acquisition without cancelling the helper", "reason": "A rejected caller could leave a live lock waiter or later reservation. Cancellation is awaited through helper exit before the original error is rethrown."},
    {"option": "Permit manual roleless upgrades when a host session variable exists", "reason": "The manual route could inherit that variable; authorization belongs to the lifecycle-owned call path and cannot be inferred from ambient identity."},
    {"option": "Catch every observer error as canonical status unavailable", "reason": "Only canonical state read failures have the skip contract; module-loading and programming faults retain their distinct diagnostics."},
    {"option": "Sanitize native error text after a raw read", "reason": "A FIFO can block before error rendering. Typed nonblocking reads establish the input boundary before reading and avoid parser/source excerpts."}
  ],
  "reopens": {"decisionId": "WO-213-D027", "observation": "The inherited product-reader gap and the additional readers named by FINAL-002 now use the same safe diagnostic boundary."},
  "reopenWhen": "A new document reader bypasses this boundary, a callback failure leaves an acquisition alive, or an entry route derives authority from observation alone."
}
```

## WO-213-D034

```json
{
  "id": "WO-213-D034",
  "date": "2026-10-16",
  "dispatch": "resume: fix; adjacent meter, optional-declaration and release-identity findings",
  "decision": "Preserve current-copy attribution for identical journal prefixes when the main copy lacks or misstates its sidecar, without overriding explicit row attribution or deduplicating later divergent observations. Treat an optional declaration as absent only when it is absent, not when its link is dangling or its parent unreadable. Preserve committed configuration on the first starter export and render its README with that identity; refuse an ignored local configuration before publication. Reject lone Unicode surrogates at release-name intake so serialization and regeneration agree, while preserving valid astral names and historical recognition.",
  "evidence": [
    "The two bounded copied-journal fixtures passed on 2026-10-16T02:13:35Z, covering absent/stale main sidecars, unattributed timing/command rows, explicit foreign attribution, a distinct main suffix and identical observations after divergence. The broader recovery-signal policy remains deferred by D024; this repair changes only attribution when merging the same prefix.",
    "All 18 release-preparation tests passed on 2026-10-16T02:26:35Z, including current-target normalization, a same-version rename, collision retiming, repeat preparation without edits and a valid astral release name. All 18 configuration-root tests passed on 2026-10-16T02:32:28.944Z, including lone-surrogate refusal. Disposable lifecycle commands explicitly clear inherited host session identities; their initial direct invocation exposed this fixture isolation gap.",
    "The real starter-refresh fixture passed on 2026-10-16T02:34:49.117Z: initial committed configuration survives byte-for-byte, first and subsequent README seeds use its name, ignored local configuration refuses in preview and apply without changing remote refs or local bytes, and existing publication/refusal/cleanup cases remain passing. All remote effects in this fixture use disposable local remotes.",
    "The first added local-configuration guard used a helper that appended a Git option after the path separator and falsely treated the committed configuration as untracked. The failing first-export test caught it; the guard now uses the direct tracked-path query, and the complete fixture passes."
  ],
  "rejected": [
    {"option": "Treat the first export as ownership of every incoming path", "reason": "Configuration already belongs to the destination before a kit manifest exists; overwriting it violates the declared release-identity contract."},
    {"option": "Publish an ignored local configuration implicitly", "reason": "An uncommitted file is not remote publication authority. Refusal preserves its bytes and makes the required declaration explicit before publication."},
    {"option": "Replace malformed Unicode while serializing", "reason": "Replacement would silently change the selected identity and make later regeneration disagree with the original JavaScript string."}
  ],
  "reopenWhen": "Copied journal attribution loses current observations, a declared optional input is silently skipped, or release naming changes configuration ownership or historical recognition."
}
```

## WO-213-D035

```json
{
  "id": "WO-213-D035",
  "date": "2026-10-16",
  "dispatch": "resume: fix; complete touching-register pass after the second repair",
  "decision": "Reconcile the repaired findings and reassess the broader seams without treating a textual match as a new implementation obligation. Settle four repaired or qualified WO-213 rows and re-defer twelve grouped planning items at their current source revisions; keep the other matched dispositions unchanged because their recorded trigger did not occur in this repair.",
  "evidence": [
    "The canonical touching listing at revision a53d0d54bbe9441d3f120fb38ae1464703f12905560e785e866b1c968c5d3636 had 72 matched pending rows across ten pages. The executor traversed every continuation and read all 72 full recorded source/disposition reopening conditions; relevant grouped follow-ups were read without the feed's title clipping. This does not certify every unlisted register row.",
    "Settled FUP-0356227c9f854fb7 (D027 reader gap), FUP-999942a433723fb9 (D030 findings), FUP-5b80d605db95d263 (D014 selection qualification) and FUP-eca730fcb4198f14 (D017 observation qualification). D025's product-read policy and D024's recovery-definition questions remain on their distinct pending rows.",
    "Re-deferred FUP-0c10689747f83675, FUP-369525016cc270e1, FUP-b28b870422a74166, FUP-cb5c3b3e7d0b0c0d, FUP-cb922b59e013dbf1, FUP-d40313eade76b8af, FUP-fa028783f3f6b17f, FUP-e8f5399db33d0b5a, FUP-e821aa2ced3aa111, FUP-6125f53234c75af3, FUP-94f789b2dcdd30e7 and FUP-c9dc1abccd1f1a9d. Each disposition identifies the changed seam, what remains unchanged and its reopening condition; none claims a grouped historical list is wholly still unfixed.",
    "The atomic batch first refused the settled rows' nonempty targets and wrote nothing. The corrected batch uses the register's required empty target lists for settled/deferred dispositions and records sixteen judgments."
  ],
  "rejected": [
    {"option": "Read only the first touching page", "reason": "D029 records that this missed most of the matched set in the first final review."},
    {"option": "Implement every matched candidate as part of this repair", "reason": "Several grouped rows require independent policy or authority decisions. Matching a shared file is a prompt to judge the condition, not authorization to change all its behavior."},
    {"option": "NoOp: leave the repaired findings and fired surface conditions undisposed", "reason": "The register would continue to represent completed repairs as pending and conceal the current judgment of adjacent seams."}
  ],
  "reopenWhen": "A later review identifies an occurred condition this pass left unchanged, or a stated repaired invariant fails its independent verification."
}
```

## WO-213-D036

```json
{
  "id": "WO-213-D036",
  "date": "2026-10-16",
  "dispatch": "resume: fix; evidence preparation after the second repair",
  "decision": "Prepare the same compatible local release target v0.83.0 and select new immutable evidence editions after the changed registered sources and rebuilt harness: authority 004, artifact-identity 003, verification 003 and feedback 003. Carry the existing live feedback audit by reference and re-pin the console projection; preserve every earlier edition and all publication controls.",
  "evidence": [
    "npm run release -- prepare --local reported v0.83.0 remains current on 2026-10-16T02:45:13.737Z and refreshed only the meter and draft PR projection. The declared compiler 0.27.1, skeleton 0.59.1 and harness host 0.35.2 patches already cover this order's compatible behavior repairs; no publication was performed.",
    "The shared runtime-input helper, runtime digest/inventory and session host are registered evidence sources. The rebuilt runtime and 34-surface emitted bundle therefore require fresh selected editions, as D026 did for the preceding repair. The generator and check outcomes for these editions are recorded in the handoff."
  ],
  "rejected": [
    {"option": "Overwrite a selected historical edition or keep its stale check", "reason": "Filed evidence is immutable and its input binding must match the judged subject."},
    {"option": "Run a new live feedback episode for these registered-source changes", "reason": "The existing carry mechanism admits the unchanged judged behavior by reference and checks the binding; this repair changes no feedback decision or live interaction."}
  ],
  "reopenWhen": "A selected edition fails its deterministic check, the carry rejects changed judged behavior, or release preparation observes a version collision."
}
```

## WO-213-D037

```json
{
  "id": "WO-213-D037",
  "date": "2026-10-16",
  "dispatch": "resume: fix; integration preflight and recovery boundary",
  "decision": "Keep the integration fixture's entry scripts and shared libraries on one dependency cohort. Preserve the stricter early refusal when release metering cannot inspect an evidence ancestor, and create the saved-outcome fixture's obstruction only after real preparation succeeds. Include optional-input selection in each regeneration step's failure boundary so a blocked or looping parent becomes a recorded pending step and continuation can recover.",
  "evidence": [
    "The first complete integration preflight failed because current scripts/lib/paths.mjs no longer exports source discovery while three baseline entry scripts still imported it. Copying current bootstrap, launchpad and license-surfaces entrypoints with the current shared libraries removed those module failures; the fixture asserts the copied bytes.",
    "The next preflight passed 25 of 27 cases. Its remaining cases expected release preparation to ignore a regular file in place of the evidence directory. The typed meter instead refused ENOTDIR before changing the release target, honoring the command's read-before-write contract. A new regression proves unchanged order/README bytes and successful continuation after removing the obstruction.",
    "The two saved-release fixtures now inject their obstruction after the real integration preparation succeeds. Both retain their original saved-outcome, newer-tag, exactly-once record and continuation assertions; all three focused release/recovery cases passed on 2026-10-16T03:02:46.217Z.",
    "Source inspection found optional declaration presence checks outside regenerate's pending-step catch. Selection now runs inside that boundary. The new blocked-parent and alias-loop fixtures passed on 2026-10-16T03:05:52.293Z, recording relative ENOTDIR/ELOOP pending steps and then completing after repair. Their first setup mistakenly continued a completed integration and was corrected to begin with a partial publication declaration; that failed setup is not evidence of the production defect. The complete integration preflight result is recorded in the handoff."
  ],
  "rejected": [
    {"option": "Restore the generic path library's package dependency", "reason": "The source-free portability fixture established why that dependency was removed; the integration fixture must carry coherent entrypoints instead."},
    {"option": "Treat ENOTDIR as an absent evidence record", "reason": "That would weaken the typed reader and allow release edits before unreadable evidence is judged."},
    {"option": "Drop the saved-collision tests or accept an unrecorded selection exception", "reason": "The original recovery guarantees remain required, and optional declaration errors must leave a usable pending receipt."}
  ],
  "reopenWhen": "A copied integration fixture mixes source revisions, or a selection/read failure escapes its named pending step and prevents continuation."
}
```

## WO-213-D038

```json
{
  "id": "WO-213-D038",
  "date": "2026-10-16",
  "dispatch": "resume: fix; first full-review attempt and copied CLI fixture",
  "decision": "Complete the control-beacon CLI fixture dependency set with runtime-inputs.mjs, retain its existing executable contract, and select authority revision 005 after rebuilding and re-emitting the snapshot. Keep artifact-identity 003, verification 003 and feedback 003 because their current checks still pass. Preserve every earlier edition.",
  "evidence": [
    "The first full-review attempt passed launchpad, integration, harness and process-debt before the skeleton CLI fixture reported a failure. The canonical evidence --stop command stopped the run on 2026-10-16T03:41:50.135Z; it recorded no passing full-gate row. Tasks interrupted by that request are not judged as independent defects or passes.",
    "The isolated existing control-beacon CLI case reproduced ERR_MODULE_NOT_FOUND for runtime-inputs.mjs imported by the fixture copy of gate-evidence.mjs on 2026-10-16T03:42:30.095Z. Its explicit source-leaf list had not been updated with the new dependency. The audit of literal gate-evidence/gate-deadlines references and copy lists across scripts and package tests found the remaining omission in this list; other copied leaves already include the helper or carry their containing directory.",
    "The rebuilt complete control-beacon CLI test file passed on 2026-10-16T03:43:36.865Z: permission refusal, exactly one authorized metadata observation, replay and unchanged lifecycle bytes. The production behavior and assertions are unchanged.",
    "The compiled test participates in the complete runtime inventory, so rebuilding changes the selected snapshot and emitted hook bytes. The authority-004 check then refused the changed bundle-diff. The artifact, verification and feedback checks passed at their existing revisions on 2026-10-16T03:44:21.050Z, 03:44:22.395Z and 03:44:25.268Z respectively. Authority-005 was generated at 03:45:23.363Z and the console selfhost selection re-pinned at 03:45:29.019Z.",
    "Adjacent item 0028 completed at queue revision 141. The final document and full-review gates are recorded in the handoff; the stopped attempt supplies neither claim."
  ],
  "rejected": [
    {
      "option": "Weaken the permission assertion or restore the generic path-library dependency",
      "reason": "The failure is an incomplete disposable fixture. The production source-free boundary and original behavioral assertions remain required."
    },
    {
      "option": "Copy every source package into the minimal CLI fixture",
      "reason": "That would conceal which build-free leaves its copied scripts require and weaken the fixture contract."
    },
    {
      "option": "Re-mint all evidence editions without checking them",
      "reason": "The three passing edition checks establish that only the authority bundle evidence needs a new revision."
    }
  ],
  "reopenWhen": "A new dependency is added to a copied source leaf without updating its consumer fixture, or the current evidence checks no longer bind the rebuilt installation."
}
```

## WO-213-D039

```json
{
  "id": "WO-213-D039",
  "date": "2026-10-16",
  "dispatch": "scope expand: permanent testing-system repair and removal of duplicate preflight/full-gate execution",
  "decision": "Extend the active repair to remove the structural causes of repeated dependency and fixture failures for future work orders, and replace the mandatory separate preflight/full-gate sequence with one validation flow. Derive dependency information where the source already declares it, admit cheap structural checks before expensive execution, and allow individually executed passing tasks to contribute to a complete current gate under checked evidence bindings. Preserve every existing criterion, independent verification, publication authority and conservative refusal of incomplete or stale evidence.",
  "authorization": "The operator explicitly expanded scope on 2026-10-16 to fix the recurring testing-system failures permanently for future orders, then required elimination of effectively running the full gate twice through preflights and invited a better third design. This authorizes changes to the runner, dependency and fixture construction, evidence composition, their tests and the standing validation guidance. It does not authorize remote publication or a claim that every future program is defect-free.",
  "evidence": [
    "The second full-review attempt reached a runner-fixtures failure after the earlier export, integration, harness, process-debt and skeleton groups passed. The canonical stop at 2026-10-16T04:17:42.836Z ended it without a full-gate row after 1420.4 seconds.",
    "The isolated machinery-coverage test reproduced exactly one omission at 2026-10-16T04:18:01.156Z: harness-fixtures did not declare scripts/lib/control-store.mjs, a literal input of the new canonical-read-failure regression. This is separate from D038's copied-module omission.",
    "scripts/lib/machinery-coverage.mjs already discovers direct imports and literal script inputs, but only a test inside runner-fixtures checks their parallel declarations. scripts/lib/gate-reuse.mjs explicitly treats passing single-suite results as unable to supply a full-gate task. Product 07 separately requires the preflight suite runs before the full gate. These mechanisms explain the late discovery and duplicate execution observed here."
  ],
  "traps": [
    "Another manual checklist would retain synchronized dependency bookkeeping; prefer deriving the same facts once.",
    "Reusing a passing task must not promote a partial selection to a complete gate or hide a later failure, changed subject, changed execution contract or unattested build.",
    "A claimed universal guarantee cannot be established by tests; specify and falsify the enforced invariants and keep unestablished inputs fresh."
  ],
  "rejected": [
    {"option": "NoOp: add only the missing control-store declaration and repeat the same sequence", "reason": "It repairs the current assertion while retaining the two manual synchronization failures and the operator-rejected duplicate execution cost."},
    {"option": "Require every affected full suite once as preflight and again in the full gate", "reason": "The operator explicitly rejected this repeated work; a complete claim should compose eligible executions rather than require a second execution solely because the command name differs."}
  ],
  "reopenWhen": "A future order needs a parallel dependency-list edit for an automatically discoverable dependency, an unchanged eligible passing task is executed again solely to complete the gate, or stale/incomplete evidence can satisfy the full claim."
}
```

## WO-213-D040

```json
{
  "id": "WO-213-D040",
  "date": "2026-10-16",
  "dispatch": "resume: fix; implement the operator-authorized validation scope expansion in D039",
  "decision": "Use the existing runtime-import parser for source-derived machinery selection and copied module closures, and extend the existing gate composition rather than add another cache. Remove redundant source declarations while retaining semantic prefixes, data, computed inputs, reasoned exclusions and pinned evidence inputs. D041 records the retained comparison against the complete historical manual row set. Validate the expanded task graph, including scheduler barriers, before building or creating expensive fixtures. Admit bound individual-suite executions into complete selections at the same code and installed-input identity, with task and prerequisite contracts checked and the existing integrity, build-output and recency rules retained. Replace mandatory separate preflight execution for existing and future orders with optional diagnostics whose eligible executions contribute to the complete gate.",
  "evidence": [
    "The dependency and structural regressions passed on 2026-10-16T04:46:57.003Z. A manual two-file fixture fails with ERR_MODULE_NOT_FOUND when the middle module imports a new leaf; deriving from the same entry list copies the transitive leaf and executes successfully. Missing dependencies refuse before any fixture file is copied. Missing and cyclic task dependencies refuse before build, suite or runner diagnostic output is created.",
    "The task-composition counter and invalidation regressions passed on 2026-10-16T04:53:59.817Z. Targeted alpha then full validation executes build, alpha and beta once. The comparison arm explicitly reruns the complete selection and executes build and alpha twice. Changed alpha arguments rerun alpha; a changed build command reruns the build and both declared consumers. One suite alone creates no full-gate claim.",
    "The same regression group refuses unbound historical task rows, stopped, timed-out, partial, excluded, ambiguous, memory-failed, identity-changed, build-changed and unattested observations. A new source file invalidates the prior executions. Existing recency coverage passed on 2026-10-16T04:48:08.431Z: a later failed single-suite task displaces an old pass, and its bound repair can supply the next complete selection.",
    "The real foreground CLI fixture passed with the derived harness module closure on 2026-10-16T04:50:54.763Z. Minimal beacon and compiled CLI fixtures retain their separate required checks; the integration overlay now copies the current scripts directory as one dependency cohort while preserving the fixture's historical records and rebuilding its own packages.",
    "The complete real machinery inventory, automatic selection after a transitive leaf edit, release-shell selection and release-only normalization regressions passed on 2026-10-16T04:57:28.469Z. Task expansion participates in discovery, so runner subfiles also supply their imports. The source-only consumer path does not invoke the TypeScript parser; ordinary instance selections remain fresh.",
    "The first complete runner-fixtures check of the expanded repair failed on 2026-10-16T05:02:22.747Z. Early inventory validation incorrectly required a real build before document-only selections could add their synthetic barrier; it now allows that established path and validates the final expanded graph. Early task expansion also preceded inherited-host-lease capture, allowing the fault-injection getter to invalidate the parent token before it was retained; capture now precedes discovery and expansion. The historical local/main evidence matrix now explicitly binds its fabricated executions and expects eligible single-suite passes to compose under the authorized policy. All twenty focused cases passed on 2026-10-16T05:04:01.331Z. The original document and lease assertions remain; the historical composition expectations intentionally changed.",
    "After rebuilding the compiled CLI fixture and emitting its changed snapshot, authority-005 refused the changed bundle-diff. Artifact-identity 003, verification 003 and feedback 003 passed at 2026-10-16T04:59:54.604Z, 04:59:55.733Z and 04:59:58.325Z. Authority-006 was generated at 05:00:13.981Z and the console selection was re-pinned at 05:00:14.450Z. Local release preparation kept v0.83.0 at 05:00:16.523Z; no publication was performed. Publication checks and the authorized planning amendment check passed.",
    "Product 07 now explicitly supersedes the former mandatory preflight sequence for existing and future orders, including repair. Its standing rule directs WO-192's later role-text work to carry the current policy. No historical report or another work order's acceptance record was rewritten. Final complete-suite, document and review results are recorded in the handoff."
  ],
  "rejected": [
    {"option": "Add an earlier manual dependency audit while keeping the parallel lists", "reason": "It shortens feedback but preserves the bookkeeping failure. Source-derived inputs remove the repeated edits and the late declaration failure."},
    {"option": "Build a separate fine-grained source cache for each task", "reason": "Computed inputs and semantic relationships remain partly explicit. The existing whole-code identity is the conservative boundary; a second cache adds a new invalidation mechanism without being required to remove duplicate execution at one subject."},
    {"option": "Reuse a task by name or let an individual suite satisfy the full-gate claim", "reason": "Names do not bind commands, explicit environments or prerequisites. A complete selection must still establish every required task under the current subject and retain each executed source pointer."},
    {"option": "Promise that no future work order can contain a test defect", "reason": "The executable invariants close the observed failure classes; they cannot establish a universal claim about future code or computed dependencies."}
  ],
  "reopenWhen": "An automatically discoverable import again requires a parallel fixture or suite list edit, a complete request repeats eligible individual work solely because of its check name, or a changed execution contract or unestablished subject is admitted as reusable evidence."
}
```

## WO-213-D041

```json
{
  "id": "WO-213-D041",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator-requested independent Opus 5.5 review of the expanded validation repair",
  "decision": "Apply all four required findings from the independent worker and seven of its nine design recommendations. Bind reusable tasks to the actual filtered child environment, active record-guard subject and resource limits; reject an execution-context change during the run. Bind carried build consumers to the build bytes their source execution used, let targeted diagnostics share an attested build, and keep document-reading tasks fresh. Replace the self-confirming source audit with concrete dependency assertions and an independent historical comparison. Reject later ambiguous executions and unexecuted prerequisites. Record actual invocation digests alongside the documented canonical release-case contract. Keep the reviewed parser pin and the already-boarded escaped-path policy boundaries for the reasons below.",
  "evidence": [
    "The fifth worker in this repair session was the native Claude dotln-worker, with startup and result readback claude-opus-5-5, Claude CLI 2.1.301, requested effort xhigh and no effective-effort readback. It received the order, captured implementation diff and current source, excluding previous review reports and evidence narratives. Its only observed tools were Read, Glob and Grep. It ran no probes, made no edits and spawned no descendants. The executor remained the sole writer. The retained worker record disposes four required findings and nine separate design recommendations; this is not a new aggregate count for the earlier four overlapping audits.",
    "M1: executor probes reproduced reuse after an effective environment change. The contract now binds the same environment snapshot execution receives, including executable search precedence, while omitting scheduler-owned values. Active-order and resource changes between gates force fresh tasks; a context change during a gate refuses its passing row. Environment and declaration values are represented only by digests in evidence. The context and performance-history group passed four cases at 2026-10-16T06:03:29.399Z.",
    "M2: the old real-inventory check re-derived an already-derived table and could not expose lost coverage. It is removed. Direct assertions now pin harness-probe's worker transport, harness-fixtures' intake reconciliation and worktree material, plan-refutation's meta dependency and runner-fixtures' release shell. source-declaration-comparison.json binds the historical Git commit and independently checks all 307 literal manual declarations: none are missing and no exclusions are needed; the same row set now has 52 explicit declarations. Expressions that select pinned evidence inputs are outside this count and remain separately owned. This corrects D040's unqualified 269-declaration claim.",
    "M3: executor probes reproduced an old pass surviving a later ambiguous single-suite row and an unexecuted build satisfying a consumer. Ambiguous rows now displace prior evidence regardless of check name; prerequisites require an executed passing result. Regression coverage includes both single-suite and complete ambiguous rows, incomplete prerequisites and rejection of the former complete claim.",
    "M4: release cases deliberately normalize a fresh disposable template and equivalent standalone construction to one canonical case contract. The actual invocation has a separately recorded digest. A regression proves the two actual invocation digests differ, their canonical case contract agrees and the next complete request reuses the resulting case. Product 07 states this normalization instead of claiming literal argument equality.",
    "Design recommendations 1 and 2: a carried consumer names its source build-output digest and is admitted only after the current build's digest agrees. If a fresh build produces different bytes, its prior consumers execute again. A targeted diagnostic always executes its requested task but may share an attested build. The real npm CLI comparison in cli-task-composition.json passed at 2026-10-16T05:55:25.012Z: separate alpha and beta diagnostics followed by a complete request execute exactly build, alpha and beta once; the full request records three reused tasks. D040 retains the forced-fresh comparison arm.",
    "Design recommendations 3 through 5: targeted source discovery is confined to the requested suite, document discovery to document rows and complete discovery to the complete inventory. Graph checks precede reuse lookup and the confinement probe. Explicit module declarations also traverse their imports; global helper exclusions omit their own file while retaining their children, and suite-specific exclusions deliberately prune their branch. Literal corpus scripts participate. Internal selection uses the already-derived table, task expansion is shared and the unused inventory audit is removed. Reuse and performance reporting share the row-integrity predicates.",
    "Design recommendations 6 and 7: document-reading tasks remain fresh because document bytes are outside code identity. Per-task performance history accepts fresh executions from intact, bound single-suite rows; complete-gate duration history still measures fresh complete npm test rows and never substitutes a diagnostic's duration. Positive, partial, unbound and ambiguous metric cases passed.",
    "Design recommendation 8 is retained deliberately: the existing TypeScript grammar pin is the reviewed scanner contract. scripts/launchpad.mjs kitPackage copies the core's exact devDependencies, including the current parser version, into exported instances. A parser upgrade must update its reviewed contract. No scan cache is added without a measured cost and a sound invalidation boundary.",
    "Design recommendation 9 repeats the ANSI and escaped-solidus record shapes already named by D024 and reassessed by D035 on FUP-6125f53234c75af3. That recorded planning disposition remains current; this validation repair does not change the original pinned Markdown pattern or claim those shapes are detected.",
    "An additional executor counterexample showed literal CommonJS requires missing from fixture closure. The shared scanner now resolves file, extensionless JSON and directory requires, including directory package metadata, while rejecting aliases and ignoring non-runtime import-assignment syntax. The first regression exposed a canonical temporary-root alias in the mapping; normalizing the root fixed it. The 25-case dependency, reuse and boundary group passed at 2026-10-16T05:50:22.980Z; all five evidence-source import checks passed at 06:03:29.788Z.",
    "The evidence selection had been reported as authority-006, but inspection found current.json still selected 005. The selected check refused stale bundle-diff bytes while an explicit check of existing 006 passed 37 comparisons. current.json now selects 006. Artifact-identity 003, verification 003 and feedback 003 all passed their checks, so no replacement editions were minted. Build and emission completed at 2026-10-16T06:05:17Z, all five console-fixture formats passed at 06:06:43.060Z, and local release preparation kept v0.83.0 at 06:06:44.389Z. The complete current gates are recorded separately in the handoff.",
    "The complete runner check at 2026-10-16T06:16:01.549Z passed 196 cases and failed six older cases. Early table copying had flattened the late-aggregation and parent-lease fault-injection accessors; binding execution context at task expansion preserves their original injection boundaries. Confinement's remaining-work comparison counted the synthetic build, so it now compares the original selection. A bounded comparison found only DOTLN_SESSION_ID changed across the fixture's shells. That unused agent label is now omitted from offline child execution as well as identity, preserving cross-session reuse without ignoring an effective input. All six original assertions remain and pass. A new regression checks that the child never receives the label; its first counter assertion incorrectly expected an undeclared build, then was corrected to declare the build dependency. The ten-case correction group passed at 2026-10-16T06:19:29.840Z."
  ],
  "rejected": [
    {"option": "NoOp: rely on the earlier focused passes and the independent review's generally sound assessment", "reason": "The executor reproduced stale reuse and unexecuted-prerequisite counterexamples. A passing opinion cannot replace the missing boundaries or the current complete gate."},
    {"option": "Exclude PATH or all inherited environment from task identity", "reason": "Executable precedence and effective locale/runtime settings can change what executes. Only values the scheduler replaces are omitted, and raw environment values are not persisted."},
    {"option": "Reuse consumers after any passing rebuild at the same code identity", "reason": "A changed or nondeterministic build could produce different executable bytes. Consumers must have observed the digest actually used by the composed request."},
    {"option": "Expand the escaped-path policy or replace the reviewed parser during this validation repair", "reason": "The escaped shapes already have a named planning disposition, and the parser pin is shipped as an exact dependency. Neither requires another policy change or speculative cache to close the authorized validation invariants."}
  ],
  "reopenWhen": "A context or build change can borrow a stale task, a discoverable dependency disappears from selection or copied fixtures, the canonical release setup ceases to be equivalent, or measured discovery cost justifies a separately invalidated cache."
}
```

## WO-213-D042

```json
{
  "id": "WO-213-D042",
  "date": "2026-10-16",
  "dispatch": "resume: fix; adjacent testing-reliability repair after the complete review attempt",
  "decision": "Make the watchdog logic fixtures independent of ambient machine pressure by controlling only their sysctl health sample inside the test process. Retain actual child processes, measured RSS, process-group cleanup, the bystander assertion and sampled receipt checks. Add warning/critical pre-launch refusal and rising-pressure stop cases. Keep all four pinned collector files and the real CLI's native health checks byte-identical. This closes an encountered fixture dependency within D039's authorized testing-reliability scope without weakening the collector's admission rule.",
  "evidence": [
    "The complete review attempt recorded at 2026-10-16T07:02:59.247Z finished in 2286656 ms at unchanged code identity af4c0cf09ff9cf9d0e59b1b01466d05ee8a9bf2883d3b9042581387ca55545d7 with unchanged build output. It passed 46 suites and failed only wo107-schema; 102 tasks executed fresh and two were reused from the targeted runner pass. The two failing cases were the tiny-child kill/bystander test and the normal-completion receipt test. Both refused before spawning because the native health sample reported memoryPressure 2 while admission requires 1. All original application groups, including integration, harness, release, target worktree and the full vertical matrices, passed in this attempt; it is not a full-gate pass.",
    "A bounded read of the real health function still reported pressure 2 after the attempt ended at 2026-10-16T07:03:22.794Z. Source inspection located the refusal before spawn in wo107-bounded.mjs and the two tests' uncontrolled call to that real host sampler. There is no evidence identifying which other host workload caused the warning, and none is attributed or stopped.",
    "The fixture uses the existing repository pattern of node:test mock.method on the builtin default export, followed by syncBuiltinESMExports for its named imports and again after explicit restoration. Current Node documentation for MockTracker reset and builtin ESM synchronization was retrieved through Context7; scripts/test-target-publish.mjs already uses the same restoration pattern. Only the exact native health-query argument list is replaced; process inventory and child creation remain real.",
    "The new refusal cases supply warning and critical pressure, assert zero child-spawn calls and no start receipt, and retain the original refusal text. The rising-pressure case admits under normal pressure, then observes a real child terminated with SIGKILL and a host-memory-pressure stop receipt. Each fixture restores the live builtin binding. Existing cleanup, bystander, normal completion and measured-headroom assertions remain.",
    "The complete targeted wo107-schema selection passed at 2026-10-16T07:08:54.138Z (bounded completion 07:08:54.213Z). A separate real health read still reported pressure 2 at 07:10:37.878Z, so the test result no longer depends on that ambient warning clearing. Git diff of profile.mjs, wo107-records.mjs, wo107-scenarios.mjs and wo107-bounded.mjs was empty. No collector edition, production guard, dependency or tool setting changed. The test edit changes code identity, so its final complete review is fresh and recorded separately in the handoff."
  ],
  "rejected": [
    {"option": "NoOp: retry until the machine happens to report normal pressure", "reason": "The warning persisted after the parallel gate ended. An ambient condition would continue deciding two logic fixtures and leave the recurring reliability problem in place."},
    {"option": "Skip the watchdog tests under warning pressure or relax the collector's admission threshold", "reason": "Skipping would leave the required cleanup behavior untested, and changing the real threshold would weaken a separate safety contract. Deterministic health samples permit both success-path and adverse-pressure evidence with the real process behavior intact."},
    {"option": "Modify the pinned collector to inject a health provider", "reason": "The established builtin mocking pattern supplies the test seam without changing historical collector bytes or its public invocation."},
    {"option": "Reuse earlier whole-code evidence after this test edit", "reason": "The test is part of code identity. The conservative whole-code boundary remains; a passing targeted check may contribute only at the final unchanged subject."}
  ],
  "reopenWhen": "A watchdog fixture again depends on unrelated host health, a test mock escapes its case or changes actual process cleanup, or the real collector's native pressure refusal is no longer preserved."
}
```

## WO-213-D043

```json
{
  "id": "WO-213-D043",
  "date": "2026-10-16",
  "dispatch": "resume: verify; independent re-verification of the second WO-213 repair (VER-003)",
  "kind": "finding",
  "decision": "Fail the verification of the second WO-213 repair at code identity 8e90b44d420d898c85ff61870c6d4bc4405658dff2f5d318dd64531501d5acc8 on one blocking finding inside the declared validation surfaces, with the other sixteen criteria met and FINAL-002's blocker reproduced closed. A task's execution contract binds inputs that are not inputs to an offline suite, and a later passing execution under a different contract displaces the standing complete row. The task environment in scripts/lib/suite-evidence.mjs keeps CLAUDE_PID, CLAUDE_CODE_EXECPATH and CLAUDE_EFFORT by name and admits LC_TERMINAL and LC_TERMINAL_VERSION through the LC_ prefix, while it omits DOTLN_SESSION_ID for exactly the reason D041 records; every Claude Code process carries its own CLAUDE_PID and a Codex session carries none of these names, so no task composes across sessions. Within one session the runner's complete review runs and its targeted runs computed different contracts for every task, so a bound diagnostic never composed into a complete run here either; the differing input was not isolated. coveringGateCheck in scripts/lib/gate-reuse.mjs then treats a later passing bound execution under a different contract as displacing a complete row's own passing execution, so a passing targeted diagnostic after a green complete row leaves the lifecycle claim without a standing row until a full review gate runs again; at the base a later passing single-suite run neither supplied a task nor displaced a complete row. Criterion 17 is unmet: a targeted command neither contributes eligible evidence to the complete run nor remains available for diagnosis without cost to the standing claim, and the runner prints no cause when it declines to carry a task.",
  "evidence": [
    "Correction. The verifier first recorded this decision as a follow-up with the judgment that lifecycle claims were unaffected because findGateCheck reads no task contract. The checked evidence is the result transition's refusal, which judges the claim through coveringGateCheck, and the displacement rule read at its lines and at HEAD. The decision is corrected in place before filing and VER-003 states the correction.",
    "Cross-session contracts: the verifier's probe expanded the current suite table through expandSuiteTasks with this session's taskContext and compared each task's taskContract with the executor's complete review row recorded 2026-10-16T07:55:15.433Z at the same code identity: 0 of 104 tasks agree. The environment snapshot in this session admits, by name only, CLAUDE_CODE_EXECPATH, CLAUDE_EFFORT, CLAUDE_PID, DOTLN_GATE_CHILD, GIT_EDITOR, HOME, LANG, LC_TERMINAL, LC_TERMINAL_VERSION, PATH, SHELL and TMPDIR, plus the npm_config_ names under npm; the executor ran under Codex CLI 0.163.0, where the three CLAUDE_ names do not exist.",
    "Targeted runs in this session: npm test -- --only wo107-schema recorded suite:wo107-schema at 10:09:55.786Z (two fresh tasks, the build executed again with the executor's output digest although the executor's rows hold a passing build at this identity, no REUSE line, no cause), at 10:09:58.396Z (REUSE build from the first), at 11:02:07.423Z (two fresh tasks again) and at 11:02:10.110Z (REUSE build from the third). Every targeted run, plain or under the bounded wrapper, records build contract 0e377815 and wo107-schema contract 0e6b525b, and a run-script child replicating the runner's review-path expansion reproduces both exactly.",
    "Complete runs in this session: npm test -- --review recorded a passing row at 10:56:30.813Z (104 fresh tasks, 2248341 ms) and again at 11:05:42.125Z (12 fresh tasks, 92 reused from the first, 13653 ms). The two complete runs agree on all 104 contracts (build fda4154e), and every one of them differs from the targeted runs' and from the replication's; the second complete run executed the build fresh although three passing builds stood at the identity, because the later targeted execution under the other contract had become the deciding execution. Search boundary: the input that differs inside the runner's complete-run process was not isolated. It is not the filtered environment of a probe process (hashed identical across foreground, background and the bounded wrapper, and across shell calls), not the execution context (activeOrder and memoryLimits identical under every mode and over time), and not a selection-dependent declaration (the replication expands the review selection to the targeted contracts); the runner process's own environment at expansion was not instrumented, and no module on its entry path writes an admitted environment name.",
    "Lifecycle consequence: before the targeted runs the verifier's coverage probe found the executor's row standing with nothing displaced. After them, npm run resume -- verification-result pass with the session attestation refused: criterion 9 recorded met names npm test -- --review, and no passing complete npm test row stands at the current code identity; the latest complete row names build and wo107-schema, whose latest execution there can no longer be carried. After the verifier's first complete run, two further passing targeted runs displaced that row in turn (coverage probe: no candidate; displaced build and wo107-schema), and only a second complete run restored a standing claim.",
    "Source and base: gate-reuse.mjs displacedTasks returns own !== row && (!pass || (expected !== undefined && pass.result.taskContract !== expected)), and latestExecution lets a bound single-suite row become the deciding execution; at HEAD, displacedTasks was own !== row && !pass and a single-suite row reached only the non-supplying branch, returned solely when it had not passed, so a later passing single-suite run left the complete row standing. suite-evidence.mjs taskEnvironment deletes only the scheduler-owned names; suiteEnvironment keeps the fixed name set and the LC_, NODE_, npm_config_, NPM_CONFIG_, DOTLN_, GIT_ and XDG_ prefixes and deletes DOTLN_SESSION_ID with the comment that the surrounding agent's session label is not an input to offline suites. The runner's row records freshReason missing-passing-tasks and its summary line prints the fresh-task count without naming why a task was not carried."
  ],
  "rejected": [
    {
      "option": "Pass with the finding boarded as a follow-up",
      "reason": "Product 07 routes a change that breaks a behavior the base had, shown by a probe, as blocking; the probe is the lifecycle's own refusal of a green identity after a passing diagnostic, and the defect sits in the validation flow criterion 17 names."
    },
    {
      "option": "Restore the claim by editing the local gate index or removing the probe rows",
      "reason": "A stale or displaced row is answered by running the gate at the current identity, never by restoring bytes to match it."
    },
    {
      "option": "Judge criterion 9 unmet",
      "reason": "The review gate was green at this identity in the executor's row and twice in the verifier's own runs; the claim's standing, not the gate, was disturbed."
    },
    {
      "option": "Exclude PATH or the whole inherited environment from the contract",
      "reason": "D041's rejection stands: executable precedence and effective runtime settings can change what executes. The defect is binding values that do not change what executes, and displacing a standing row on a later pass."
    }
  ],
  "followup": "WO-213 resume: fix. (1) scripts/lib/suite-evidence.mjs: treat names that identify the agent process or the terminal rather than an input to an offline suite (CLAUDE_PID, CLAUDE_CODE_EXECPATH, LC_TERMINAL, LC_TERMINAL_VERSION and any other host-session label the harness recognizes) as invocation metadata the way DOTLN_SESSION_ID is treated: omit them from the contract and, where no suite reads them, from execution; keep CLAUDE_EFFORT bound only where a suite is shown to read it. (2) Isolate and remove the input that made this session's complete runs and targeted runs disagree on every contract: instrument the runner at expansion, name the differing contract component in a fixture, and bind what the executed command resolves rather than a string that carries it. (3) scripts/lib/gate-reuse.mjs: a later passing execution under a different task contract neither supplies a pass to the new selection nor displaces a complete row's own passing execution; only a later failure, an ambiguous row or an unreadable row displaces, as at the base. (4) scripts/test-runner.mjs: name the cause beside the fresh-task count when a task is not carried (which environment names differ, a changed declaration or an unexecuted prerequisite), naming no value. Fixtures in scripts/test-runner.test.mjs: a bound single-suite pass recorded under a different CLAUDE_PID and LC_TERMINAL_VERSION leaves the complete row standing for coveringGateCheck and the lifecycle claim and composes into the next complete selection; a targeted run and a complete run from the same shell compose in both orders; a changed PATH still executes the task again and leaves the complete row standing; a later failing single-suite run still displaces; the cause line names the differing environment name without its value.",
  "reopenWhen": "The repair changes a judged surface (fresh verification re-derives it), or a complete selection at an unchanged code identity reports every task fresh, or a standing claim is lost, after a bound passing diagnostic in another session or shell."
}
```

## WO-213-D044

```json
{
  "id": "WO-213-D044",
  "date": "2026-10-16",
  "dispatch": "resume: fix; third repair of WO-213 against VER-003 V3-F1 (D043)",
  "decision": "Close the class D043 names with one rule: a task contract binds exactly the environment its child receives, and that environment carries nothing that identifies the agent host's process or session selection, DotLn's session or resident episode, the terminal, the shell instance or how the outer npm command was spelled. CLAUDE_PID, CLAUDE_CODE_EXECPATH and CLAUDE_EFFORT leave the fixed name list, as Codex's and Copilot's session names already had; DOTLN_SESSION_ID, DOTLN_RESIDENT_EPISODE_ID and DOTLN_RESIDENT_STORE are deleted although the DOTLN_ prefix admits them; only the POSIX and glibc locale categories pass instead of the LC_ prefix, so LC_TERMINAL and LC_TERMINAL_VERSION are withheld; npm's output-only settings (loglevel, which --silent, --quiet and --verbose set, color, progress, unicode, heading) are withheld while every other npm setting stays bound; and each existing absolute PATH directory is bound, and given to the child, by its resolved location, so a version manager's per-shell link to one installation is one directory in every shell while spelled precedence, relative and missing entries are kept. Restore the base displacement rule, so a later pass under another contract never displaces a standing complete row, and add one bound: such a pass cannot answer a later failure under the contract the row recorded, which displaces until a pass under that contract follows. A passing partial run supplies nothing and so displaces nothing, as at the base. Each task of a gate that can supply records its contract parts (runtime, declaration, execution context and per-variable digests, all keyed by a random host key with a fingerprint), and the runner prints and records in the row, as notCarried, why each task it could have carried runs, naming a changed variable but never its value; tasks that run by design are not listed.",
  "evidence": [
    "Isolation of the input VER-003 bounded but did not isolate: a probe loaded into the runner process only, through a module hook that logged per-task contract components as digests, reproduced this session's real targeted row exactly (build 51aef4f2, wo107-schema 4e540936 against the real suite:wo107-schema row recorded 2026-10-16T14:06:16.932Z). In-process expansion of the targeted and the review selection then agreed on every component, foreground and background. Through npm, `npm test --silent -- --review` and `npm test -- --review` differed in exactly one admitted variable, npm_config_loglevel, for both tasks; a direct `node scripts/test-runner.mjs --review` differed further in PATH and every npm_config_ name. The verifier's session transcript records its targeted runs as `npm test --silent -- --only wo107-schema` and its complete runs as `npm test -- --review`, which is VER-003's pattern exactly; the Codex executor's targeted, complete and document rows agreed (build 3f20d23c in all three).",
    "Cross-session labels: this Claude Code session's filtered environment admitted CLAUDE_CODE_EXECPATH, CLAUDE_EFFORT, CLAUDE_PID, LC_TERMINAL and LC_TERMINAL_VERSION, matching D043. Non-test sources read CLAUDE_EFFORT (resume attestation validation and status), CLAUDE_CODE_EXECPATH and CLAUDE_PID (discovery); the fixtures that test those readers set the variables themselves, and the executor's complete review row at the earlier identity passed all 104 tasks under Codex, where none of the three exists. The independent adversary found no suite or check whose outcome depends on an ambient value. console-commands.ts already strips the two resident-episode names with the host-session names for the same reason.",
    "Shell instance: PATH's first entry in this session is a version manager's per-shell directory that resolves to the shared Node installation; a fresh login shell received a different per-shell directory resolving to the same installation, while process.execPath and npm's prefix were already resolved. Without resolution every new session would still split every contract, the case D043's reopening condition names. TMPDIR here equals the system per-user temporary directory.",
    "Fail before, pass after: the runner fixture, run against this dispatch's checkpoint sources copied to the session scratch directory, failed at its first complete run because a withheld label reached the task; without that label check it failed where a targeted run under other session labels must share the complete run's build; with labels held constant it failed at the missing cause line; without that assertion it failed where a passing targeted run under another PATH must leave the complete row standing (no row, the lifecycle refusal VER-003 reproduced). The partial-diagnostic case failed on the checkpoint sources (no standing row). A scratch copy of the final sources with only the contract-scoped failure check removed failed where a pass under another PATH must not answer a failure under the row's contract. Against the final sources the unit case, the two new runner cases and 66 neighbouring composition, binding, displacement and WO-186 reuse cases pass (68 of 68).",
    "Not quoted by the report and now covered: the npm spelling composes in both orders; a per-shell link and its target bind one PATH entry while relative and missing entries keep their spelling; locale categories and npm configuration such as cache, registry and foreground_scripts stay bound; resident-episode labels are withheld; the host key is created once under concurrent callers with mode 0600 and a malformed key refuses; parts recorded under another key are reported as such; a carried consumer rerun against a different fresh build is listed; the gate index never holds the PATH value.",
    "Independent review: two read-only dotln-worker agents (claude-opus-5-5, xhigh) received the order, VER-003 and the first diff. The design worker made 23 recommendations, 11 should-change; all 11 were applied, the host-key placement inside suite-evidence.mjs instead of host-resources.mjs because the latter is a registered evidence source and feedback-judged file; of 12 consider items, 9 were applied in full or part and per-row deduplication of environment digests and a table-driven merge of the label tests were not; 2 keep-as-is items were retained. The adversary found no blocking item, 4 should-fix and 4 notes; it confirmed five defects of the first diff already fixed on disk; the masking, resident-label, test-alignment, partial-displacement, PATH-fixture and key-advisory items were fixed, and the cross-host comparison and the npm key-name note are recorded below as limits."
  ],
  "rejected": [
    {"option": "Keep the three CLAUDE_ names in execution and omit them from the contract only", "reason": "The contract would no longer bind what the child receives, and a suite reading an ambient value could pass under one host and be carried into another. Withholding them makes every host run the suite as Codex and CI already do."},
    {"option": "Withhold every npm_config_ name, PATH or the whole inherited environment", "reason": "D041's rejection stands: executable precedence and npm settings such as cache, prefix, registry, log files and foreground scripts can change what a nested command does. Only output-only settings are spelling, and a resolved search directory is the directory a command is found in."},
    {"option": "Let only the latest execution decide displacement, as at the base", "reason": "A pass under another contract would erase a later failure under the row's contract, which criterion 16 lists among results that must not supply a pass. The contract-scoped bound keeps the repair's guarantee without that masking."},
    {"option": "Record variable names only, or unkeyed per-part digests", "reason": "Names alone cannot say which value changed. An unkeyed digest of a part that holds a home-directory path (a PATH entry or the Node executable inside a declaration) would let a copied row confirm a guess; committed copies of gate rows exist. The random host key keeps the explanation without that exposure, and its loss is reported, not misattributed."},
    {"option": "Place the host key beside the other host-state writers in host-resources.mjs", "reason": "That file is a registered evidence source and a feedback-judged file; changing it would re-mint evidence editions and require a live feedback audit for a function suite-evidence.mjs can hold, reusing ensureHostRoot by import."}
  ],
  "limits": [
    "Cross-harness composition is unverified: PATH, GIT_EDITOR, LANG, TMPDIR, SHELL and CODEX_HOME remain bound by design, no Codex environment was available in this session, and a harness that prepends its own helper directory still yields another contract; the not-carried line and row now name such a variable for the next verifier.",
    "Whether sandboxed and unsandboxed commands in one Claude Code session receive different TMPDIR values was not observed.",
    "Rows from one host share the key fingerprint and environment digests, so they can be correlated with each other; an unscoped custom npm setting name would appear as a variable name. No value is recorded."
  ],
  "reopenWhen": "Fresh verification finds a contract split between sessions, shells or npm spellings at an unchanged code identity on one host, a passing diagnostic removes a standing complete row, a later failure under a row's contract is masked, a suite's outcome depends on a withheld name, or a recorded digest or printed cause exposes a value."
}
```

## WO-213-D045

```json
{
  "id": "WO-213-D045",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator direction during the third repair that targeted-first validation is required, not optional",
  "kind": "correction",
  "misread": "This executor, like the guidance it followed, read the single validation flow (D039, D040; product 07 §Preflight before the full gate) as making targeted diagnostics optional: product 07 said a Preflight line 'does not require every suite to execute separately' and to run `--only` 'when a targeted diagnosis is useful', and executor step 9 said only to run the full gate. This repair ran two targeted diagnostics and then a complete review gate that executed 101 of 104 tasks fresh in 3062825 ms (recorded 2026-10-16T15:59:12.370Z, exit 0), which would have been the first detector of a failure in any of the 44 other suites.",
  "meant": "Targeted runs cost nothing extra on success, because their passes are carried into the full gate, and they find a failure in minutes, so they come first and are required for the suites a change touches.",
  "changed": "The generated executor step (packages/skeleton/src/loadouts/contributor.ts, emitted to the Claude and Codex executor skills) and product 07 §Preflight before the full gate now require the targeted-first sequence; this decision records the correction the same day.",
  "decision": "Make the validation flow targeted-first and required for every executor. Before the full gate the executor runs, one at a time as `npm test -- --only <suite>` under the bounded wrapper, each suite the order's Preflight line names and each machinery suite `npm test -- --review --list` adds to `npm test -- --list`, fixing each failure before the next run; the full gate then carries those passes and is never the first run of a suite the change touches. The rule is stated in the generated executor role text (packages/skeleton/src/loadouts/contributor.ts, emitted to both harnesses' executor skill) and in product 07 §Preflight before the full gate. Reuse across a code change, keyed by each task's own declared inputs instead of the whole-code identity, is a separate follow-up.",
  "authorization": "On 2026-10-16, while the third repair's complete review gate ran, the operator directed that the single validation flow exists so failures surface early through carried targeted runs, objected that the guidance left those runs optional, and asked that no executor need to be told again. Offered the choice, the operator selected targeted-first guidance now with per-task reuse across fixes as a follow-up order. The order's validation-reliability expansion authorizes changes to the standing validation guidance and supersedes the role-text non-goal for it.",
  "evidence": [
    "Mechanism already present: the runner derives each machinery suite's sources from its import closure and literal inputs, and `--review` adds the machinery suites whose sources the branch changes; that listing is the affected set the new step names. Carriage of the targeted passes into the complete gate is shown in this repair: the complete gate printed REUSE for build, wo107-schema and runner-fixtures from rows a separate login shell recorded with `--silent`.",
    "Limit of the current design: every carried pass is keyed to the whole-code identity, so a fix invalidates every task and the sequence restarts after formatting. The targeted-first order bounds the cost of a failure; it does not make a rerun after a fix skip untouched tasks."
  ],
  "rejected": [
    {"option": "Keep targeted diagnostics optional", "reason": "The full gate then becomes the first detector of a failure, which the operator identified as the defect the single flow was meant to remove."},
    {"option": "Key each task by its own derived input closure in this repair", "reason": "The operator chose the guidance now. Product suites have no derived source closure, and many suites read inputs no import graph sees (fixture Git repositories, built output, documents, the working tree), so a closure missing one input would carry a false pass; it needs declared inputs per suite and its own design and refutation, as D040 recorded."},
    {"option": "Restate the rule only in this order's evidence", "reason": "Every executor reads the generated role text and product 07; a rule kept in one order's records would have to be repeated to each executor."}
  ],
  "followup": "Plan an order that keys reusable task results by each task's declared inputs, in the manner of a build system's per-target input hash, instead of the whole-code identity: declare inputs per suite (source globs, built outputs, fixture and document roots) beside the derived import closure, fall back to the whole tree for a suite with no declaration, and prove with adverse fixtures that a change outside a task's inputs carries its pass after a failed complete gate and a fix, while a change to any declared or derived input, an undeclared read and every D040-D044 refusal still run the task.",
  "reopenWhen": "An executor's complete gate is again the first run of a suite its change touches, or the follow-up order lands and the targeted-first step can be relaxed for suites keyed by their own inputs."
}
```

## WO-213-D046

```json
{
  "id": "WO-213-D046",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator objection to the wall-clock cost of the serial targeted-first sequence",
  "decision": "Keep the required targeted-first sequence of D045 for this repair and record its measured cost. Board the change that makes it fast: a targeted selection of several named suites, scheduled across the gate's lanes and carried like a single bound suite, so the touched set costs about its slowest suite rather than the sum of all.",
  "evidence": [
    "Serial targeted sequence at code identity 5c0a6468cf0c5f15de2cc4660a7d573e8f2e4767e4ca12b027f09cc57ee609b0 after the role-text change: process-debt (141.3 s) and then 20 suites one at a time from 16:39:46Z to 17:16:25Z, 36.6 minutes, all passing; target-worktree 605.1 s, harness-fixtures 362.6 s, skeleton 287.6 s, launchpad-planning 265.8 s and worktree-integration 220.8 s account for 29 of those minutes.",
    "The complete review gate that followed carried the build and 12 suites from those rows and executed 91 tasks fresh: 47 suites passed, 0 failed, 1689060 ms, recorded 2026-10-16T17:45:03.309Z. Total validation for this identity was therefore about 67 minutes, against 3062825 ms for the fully fresh complete gate earlier today at the previous identity.",
    "The sequence found a real failure early: before the oracle fixture was added, process-debt failed on the role-text baseline about ten minutes into the earlier targeted sequence instead of at the end of a full gate."
  ],
  "rejected": [
    {"option": "Return to a single fresh complete gate as the only run", "reason": "D045 records why the full gate must not be where a touched suite first fails."},
    {"option": "Add the multi-suite targeted selection inside this repair", "reason": "It changes which rows may supply tasks and needs its own fixtures, gate and independent verification; the operator was told it would not start in this repair without direction."}
  ],
  "followup": "Plan an order that lets `npm test -- --only` name several suites, schedules them across the gate's host lanes with the complete gate's ordering, prints each failure as it occurs, and records a row whose tasks supply a later complete selection under the same binding as one bound suite; prove with counters that the touched set runs once in parallel, that a failure is reported before the slower tasks finish, and that no multi-suite row supplies a complete-gate claim.",
  "reopenWhen": "Targeted diagnostics run in parallel and carried, or per-task input keys (the D045 follow-up) remove the need to rerun the touched set after a fix."
}
```

## WO-213-D047

```json
{
  "id": "WO-213-D047",
  "date": "2026-10-16",
  "dispatch": "resume: verify; independent verification of the third WO-213 repair (VER-004)",
  "kind": "finding",
  "decision": "Fail criterion 16 on V4-F1: a confined partial pass under the contract of an earlier failing task can erase that failure from the contract-scoped check once a later bound passing diagnostic under another contract becomes the deciding execution. coveringGateCheck then revives the original complete row and requireGateClaims accepts its product-gate claim. The repaired session-label and npm-spelling composition works, and a later passing diagnostic alone preserves the standing complete row, closing VER-003 V3-F1; this separate interaction still violates the criterion that confined or partial execution cannot silently supply a pass.",
  "evidence": [
    "Run node scripts/harness.mjs bounded -- node docs/evidence/WO-213/ver004-failure-mask.mjs from the repository root. The retained script uses a disposable Git repository, actual child commands in separate zsh login shells and real runGate evidence rows; it does not rewrite the gate index or the implementation. Its zero exit establishes reproduction of the defect, not a green product gate. ver004-failure-mask.json records the six executions and outcomes.",
    "Targeted alpha under npm --silent, followed in another shell with different synthetic session labels by a complete ordinary npm request, executes build, alpha and beta once: the complete result carries build and alpha and freshly executes beta. A later passing beta diagnostic keeps the complete row standing. This directly reproduces the repaired V3-F1 boundary.",
    "At the same fixture code identity, a failing beta diagnostic under contract A removes the standing complete row and requireGateClaims refuses. A succeeding beta diagnostic with --confined-partial under A still leaves no standing row. A subsequent ordinary beta diagnostic with LC_TIME=C, under contract B, incorrectly restores the original complete row; requireGateClaims then accepts a met product-gate claim. No eligible bound pass under A has followed its failure. expectedStandingRow is false while afterPartialThenOtherContractHasStandingRow and lifecycleClaimIncorrectlyAccepted are true.",
    "Source: scripts/lib/gate-reuse.mjs latestUnderContract includes partial rows, and coveringGateCheck treats intactExecutionRow(under.row) with passingResult(under.result) as answering the old-contract failure. intactExecutionRow does not reject partial rows. latestExecution separately rejects a partial single-suite pass as a supplying execution; the two classifications disagree. Existing tests cover partial-after-green and failure-then-other-contract-pass separately, but not the reproduced combined sequence.",
    "The current real-worktree code identity is 5c0a6468cf0c5f15de2cc4660a7d573e8f2e4767e4ca12b027f09cc57ee609b0. Its executor review row of 2026-10-16T17:45:03.309Z covers all 47 currently selected suites, has 104 task results (91 fresh and 13 carried), and remains standing after this verifier passes npm test --silent -- --only wo107-schema. That real diagnostic correctly reports GIT_EDITOR removed, GIT_PAGER added, LC_ALL added, LC_CTYPE added and PATH changed by name only. The defect sequence runs solely in the disposable fixture."
  ],
  "rejected": [
    {
      "option": "Accept the original complete row because the confined task itself passed",
      "reason": "Criterion 16 and the standing validation contract explicitly exclude confined or partial execution from supplying a pass. The acceptance depends on that non-supplying row; the later bound pass uses a different contract."
    },
    {
      "option": "Edit the implementation during verification",
      "reason": "The verifier records the defect and repair rule; the next executor owns implementation repair and fresh verification."
    }
  ],
  "followup": "WO-213 resume: fix, V4-F1. Make contract-scoped failure resolution honor the same execution-eligibility boundary as task reuse: a passing partial or confined row cannot clear a failure that still blocks a complete claim, including when a later pass under another contract becomes latest. Preserve passing-diagnostic non-displacement, valid same-contract recovery, chronological ordering and the existing machinery semantics. Add an executable combined-sequence regression through coveringGateCheck and requireGateClaims, including a real --confined-partial row and a genuinely changed contract; confirm an eligible same-contract pass restores the claim. Rerun affected targeted checks and establish the repaired complete gate before fresh verification.",
  "reopenWhen": "The repair changes the eligibility or contract-scoped resolution path, or any combination of non-supplying observations and changed-contract passes revives a complete claim while its recorded-contract failure remains unresolved."
}
```

## WO-213-D048

```json
{
  "id": "WO-213-D048",
  "date": "2026-10-16",
  "dispatch": "resume: verify; current document-gate observation during VER-004",
  "kind": "finding",
  "decision": "Board the execution guide byte-ceiling overrun as nonblocking V4-F2. The current document gate passes and reports docs/product/07-execution-guide.md 407 bytes over its recorded ceiling. Product 07 asks that overruns be boarded for optimization with equivalent usefulness. Criterion 8 assigns no byte figure to the write-backs, so the advisory does not fail a criterion; the verifier does not rewrite guidance or raise a planning-owned ceiling.",
  "evidence": [
    "npm run test:docs passed 35 suites at 2026-10-16T18:27:49.706Z, duration 110765 ms, code identity 5c0a6468cf0c5f15de2cc4660a7d573e8f2e4767e4ca12b027f09cc57ee609b0. Its docs-check task printed: ADVISORY docs/product/07-execution-guide.md: 407 bytes over ceiling; planning resets ceilings.",
    "Product 07, Verification review and attack, requires measured byte overruns to be boarded while preserving useful duties. The affected guide is already within this order's validation-guidance surface."
  ],
  "rejected": [
    {
      "option": "Fail verification on the byte advisory",
      "reason": "The gate passes and criterion 8 explicitly binds no byte figure; this is an optimization follow-up."
    },
    {
      "option": "Raise the ceiling during verification",
      "reason": "Ceilings require a planning decision and increasing one does not reduce operating cost."
    }
  ],
  "followup": "Planner: consolidate the execution guide validation and reuse guidance to recover at least the currently observed 407 bytes of headroom while preserving the required targeted-first sequence, task eligibility, failure resolution and instance/target boundaries. Measure at the then-current subject and run publication and document checks; do not enlarge the ceiling merely to admit the overrun.",
  "reopenWhen": "The guide is next edited, or the overrun grows; close when measured headroom is restored with equivalent duties."
}
```

## WO-213-D049

```json
{
  "id": "WO-213-D049",
  "date": "2026-10-16",
  "dispatch": "resume: fix; repair VER-004 V4-F1",
  "decision": "Ignore an intact passing partial execution in both the latest-execution and contract-scoped histories. Such an execution supplies no pass, displaces no existing pass and resolves no preceding failure. Failed, stopped, ambiguous or otherwise damaged partial observations remain consequential. An eligible same-contract diagnostic still resolves the failure, and an ordinary machinery pass retains its existing recovery semantics. The repair changes gate-reuse.mjs and its runner regression; the earlier privacy, instance and release requirements remain required.",
  "evidence": [
    "VER-004 and D047 identify latestUnderContract accepting a partial pass as the answer to a prior same-contract failure after a different-contract pass becomes latest. Source inspection also finds latestExecution can overwrite a failed non-supplying machinery or partial observation with the succeeding partial pass, hiding that failure from task reuse.",
    "Before the implementation edit, node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern='a partial pass never resolves' scripts/test-runner.test.mjs exited 1: all three new scenarios reproduced an incorrectly restored complete row. The single-suite scenario required the later changed-contract diagnostic; the partial and machinery failure scenarios restored the row immediately after the partial success. No production gate index was rewritten.",
    "After the edit, the bounded focused command selecting 'a partial pass never resolves|a passing partial diagnostic|failed single-suite, machinery and partial|a pass under other session labels' passed 7 tests with zero failures in 10981 ms. Each new scenario uses actual runGate child executions, a real --confined-partial row, a checked LC_TIME contract change, coveringGateCheck and requireGateClaims, task-reuse refusal after the partial success, and successful same-contract recovery. Existing machinery-check recovery and passing-diagnostic non-displacement also pass."
  ],
  "rejected": [
    {
      "option": "Only reject the latest partial row in the final complete-claim predicate",
      "reason": "A partial pass after a green result must not displace it, and a partial success after a failed non-supplying observation must not hide that failure from task reuse. Both histories need the same eligibility rule."
    },
    {
      "option": "Ignore every partial row, including failed or damaged executions",
      "reason": "Failures and integrity defects still displace the affected task. Only intact passing partial observations are inert."
    },
    {
      "option": "Require a fresh complete gate after every diagnostic",
      "reason": "The order requires eligible task composition and passing-diagnostic non-displacement. A bound same-contract diagnostic is sufficient recovery evidence."
    }
  ],
  "alignment": "The traps are fixing only the quoted contract lookup, suppressing partial failures, and changing ordinary machinery recovery. One shared predicate and three real-execution sequences address those traps. The NoOp keeps the verifier-reproduced false lifecycle admission. No new architecture or optimization fork was needed.",
  "reopenWhen": "Any partial or confined success hides an unresolved failure in task reuse or complete claims, including after another-contract success, or the repair displaces an existing green row or prevents eligible same-contract or machinery recovery."
}
```

## WO-213-D050

```json
{
  "id": "WO-213-D050",
  "date": "2026-10-16",
  "dispatch": "resume: fix; bounded documentation follow-up V4-F2 and current-output refresh",
  "decision": "Consolidate only product 07's Preflight before the full gate section, preserving the required serial targeted-first selection, repair restart, complete-gate composition, execution eligibility, fresh document gate and registered-target boundaries. State explicitly that a partial pass cannot resolve a failure. The guide falls from 212720 to 212285 UTF-8 bytes, a 435-byte reduction and 28 bytes of headroom against its unchanged 212313-byte ceiling. Refresh the software-engineer publication lock and correct this order's evidence README to name the authority revision current.json actually selects, 007.",
  "evidence": [
    "VER-004 V4-F2 and D048 record the 407-byte overrun. wc -c before the consolidation returned 212720; after it returned 212285. The only product-document edit is the existing validation section, whose before/after diff preserves the duties and removes repeated explanatory prose. docs/control/doc-ceilings.json is unchanged.",
    "npm run publication:check first refused the changed section's old source lock. node scripts/check-publication.mjs --print-locks supplied the new software-engineer lock, and npm run publication:check then passed both current editions: 29 everyday-reader and 45 software-engineer linked sections.",
    "The canonical adjacent queue records the announced guide-only cleanup as adjacent-0031, with a message-boundary actor-attested check-in after the 111198 ms passing initial document gate and no intervening operator steering. The README correction is the executor's existing current-output write-back duty: current.json selects authority 007, while the prior README paragraph still named 006. No filed verification or final-review report is edited."
  ],
  "rejected": [
    {
      "option": "Raise the byte ceiling",
      "reason": "The ceiling is planning-owned and consolidation restores headroom while retaining useful duties."
    },
    {
      "option": "Remove validation duties or rewrite unrelated guide sections",
      "reason": "The existing validation paragraph alone supplies the required reduction; the operator's targeted-first requirement and the evidence boundaries remain required."
    }
  ],
  "alignment": "The relevant trap is trimming a required duty to meet a size goal. Compare each before/after duty, measure UTF-8 bytes and refresh publication locks. The NoOp retains the advisory the verifier boarded.",
  "reopenWhen": "The guide again exceeds its ceiling, consolidation loses a required validation duty, or the evidence README disagrees with the selected editions."
}
```

## WO-213-D051

```json
{
  "id": "WO-213-D051",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator direction to parallelize targeted preflights and account for their timing",
  "authorization": "Paraphrase of this session's 2026-10-16 direction: preflight suites should remove their repeated execution from the full gate, and preflights must use the full gate's parallel scheduling rather than pay for serial execution. Implement that change in this repair. The operator reports no competing work orders or other apps for this timing observation; that is operator-attested, not an operating-system census.",
  "decision": "Add one multi-suite --only selection to the existing runner, using its existing task expansion, dependency graph, scheduler, resource limits, build attestation and task-evidence bindings. Keep single-suite diagnosis, retain targeted-first validation, and replace the serial sequence with one combined targeted request before the complete gate. A targeted row may supply eligible task results but never a complete-gate claim. Update the standing executor guidance and prove parallel execution, early failure reporting, single execution across targeted/full requests, and conservative refusal of invalid or partial rows. This direction supersedes D046's deferral of multi-suite selection and D045's one-at-a-time wording; per-task reuse across code changes remains the separate D045 follow-up.",
  "correction": "The executor overemphasized the three document-only exceptions when explaining why preflights were slow, then cited whole-code invalidation in the wrong interval. Checked selections show 20 of 23 targeted suites also selected by the 47-suite full review. Whole-code invalidation explains rejection of older identities before these preflights; it cannot explain repeating eligible current preflights in the subsequent full gate. Execution saved and elapsed time must be accounted from actual rows and scheduling, not assumed.",
  "evidence": [
    "npm test -- --review --list compared with the serial request's recorded required set: 23 targeted suites, 47 complete-review suites, 20 shared. Only docs-check-fixtures, docs-check and plan are absent from that complete selection. runGateChecks and coveringTaskResults admit bound single-suite passes into the full run at the unchanged identity; document readers always run fresh.",
    "The serial attempt completed nine suites: gate durations 120764, 5658, 19643, 111052, 180218, 3993, 21523, 55536 and 3552 ms. Its external receipt and logs are preserved. node scripts/harness.mjs evidence --stop safely stopped target-worktree at the next active gate on 2026-10-16T19:43:48.693Z, with no check recorded for the stopped run. The sequential wrapper then exited 1 and started no further suite. This is a directed stop, not a reproduced product failure or a passing targeted selection.",
    "Source before this change admits one --only name, invokes the shared scheduler for that one suite, and permits only a bound single-suite row to supply diagnostic passes. The executor role explicitly loops suites one at a time; D046 already identifies combined selection as the bounded remedy."
  ],
  "rejected": [
    {
      "option": "Launch several independent runner commands concurrently",
      "reason": "One combined request shares the build, dependency graph, evidence subject and existing resource policy; separate live gates add contention and cannot preserve that single scheduling contract."
    },
    {
      "option": "Remove targeted-first checks or implement per-task input caching now",
      "reason": "The operator's correction selects parallel targeted execution. Preserve early validation and the current subject-binding boundary; redesigning cache inputs is separate scope."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D046",
    "observation": "The operator now directs the previously deferred parallel targeted selection to be implemented in this repair."
  },
  "alignment": "The traps are defending serial overhead, confusing task execution with wall time, and introducing a second scheduler or a weaker full-gate claim. Reuse the existing scheduler and bind each carried task to its executed source. The NoOp retains the measured serial cost.",
  "reopenWhen": "Parallel targeted work violates dependency/resource ordering, repeats eligible tasks in the following complete gate, hides a failure, or its subset row is accepted as a complete claim."
}
```

## WO-213-D052

```json
{
  "id": "WO-213-D052",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator defines the complete affected-input validation flow",
  "authorization": "Paraphrase of the operator's subsequent direction in this session: determine the targeted suites affected by the executor's changes, run their preflights efficiently with the full gate's mechanisms, surface failures early, retain completed passing work whose inputs survive a fix, then run the full gate using as many valid preflight results as possible. Keep the full gate as final coverage and a sanity check, since targeted checks need not cover every affected area.",
  "decision": "Include per-task input-bound reuse across fixes in this repair as well as D051's combined scheduling. Bind runtime-import closures and explicit semantic inputs, preserve the existing execution-contract and build-output checks, and retain a whole-code fallback where independence has not been established. An unrelated fix must preserve a declared task's pass; changed, missing or ambiguous inputs and a later relevant failure require execution. The complete claim remains bound to the current whole subject even when its individual tasks come from earlier identities with matching task inputs. Document readers remain fresh. This direction supersedes D051's deferral of input-scoped reuse and allocates D045's input-key follow-up to this repair.",
  "evidence": [
    "The current identityRows implementation filters all reusable executions by one whole-code identity before comparing task contracts. D045 explicitly documents that limit; the operator now requests the input-key change in the active repair.",
    "machinery-coverage.mjs derives transitive runtime imports and literal first-party script inputs and retains explicit semantic inputs. Its selection exclusions intentionally omit shared helpers for test selection; those omissions are not proof of input independence and must not weaken a reusable task's byte binding.",
    "The operator explicitly retains the full gate for uncovered areas and final sanity. This repair must not replace it with a subset claim or silently reduce required coverage."
  ],
  "rejected": [
    {
      "option": "Implement parallelism but keep invalidating every task after any fix",
      "reason": "The operator's clarified flow explicitly retains completed work that the fix does not affect."
    },
    {
      "option": "Treat a selection-only dependency list as a complete input declaration",
      "reason": "Selection may deliberately exclude shared helpers or miss computed data reads. Reuse needs an established input binding and conservative fallback, not an inferred absence of dependencies."
    },
    {
      "option": "Accept targeted results as the final gate",
      "reason": "The operator retains complete coverage and a final sanity check."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D045",
    "observation": "The operator now includes the previously deferred input-key work in this repair's required flow."
  },
  "alignment": "The traps are speculative independence, discarding valid passes after a fix, and weakening the final complete claim. Bind known inputs, report conservative fallback, test both unaffected reuse and affected invalidation, and keep complete selection. The NoOp preserves unnecessary reruns after every code edit.",
  "reopenWhen": "A task is reused after a relevant input or execution-contract change, an unrelated edit invalidates an established independent task without cause, a relevant failure is hidden across identities, or the full gate omits uncovered work."
}
```

## WO-213-D053

```json
{
  "id": "WO-213-D053",
  "date": "2026-10-16",
  "dispatch": "resume: fix; implement the D051/D052 flow and the operator correction about automatic dependency analysis",
  "authorization": "The operator asks that dependency analysis drive affected work automatically and specifically requires coverage of helpers wrapping read/write operations. This refines criterion 19 within the already authorized input-bound validation flow.",
  "decision": "Use one multi-suite --only request through the complete gate scheduler. Bind each task to its unexcluded transitive runtime-import graph, runner implementation and locked toolchain, plus compiler-derived file inputs or explicit semantic declarations. The TypeScript compiler resolves identifiers to declarations; a fixed-point call graph propagates actual arguments through imported, nested, callback, reexported and default-exported wrappers. Literal file reads, directory listings, file metadata and encoded file URLs participate in input identity. Unsupported computed access, escaped capabilities, subprocess/runtime boundaries and shell inputs name the responsible source location and retain the whole-code boundary. Explicit declarations cover the atomic build, compiler fixtures and the audited adjacent-queue and continuation fixtures. Complete claims remain at the current whole-code identity, recompute task bindings, and validate original source executions rather than trusting carried rows.",
  "evidence": [
    "The initial parallel scheduling comparison ran the same independent child commands serially and through the existing shared scheduler: 856 ms serial, 511 ms parallel, overlap only in the parallel arm, and zero fresh tasks in each following complete gate. These are bounded fixture timings, not a claimed speedup of the real work order.",
    "The failed-attempt/fix regression retains the passing build and alpha task across a beta source fix, executes beta alone, then supplies a complete gate with zero fresh tasks. Transitive edits, added and deleted semantic files, ignored declared data, changed directory listings, metadata and URL-decoded data invalidate their affected tasks and standing claims.",
    "The operator wrapper concern led to a failing executable probe: a reader parameter named input was confused with an outer constant by a name-based prototype, leaving a complete claim standing after the real ignored data file changed. The compiler-symbol implementation fixes that exact case and adds imported wrappers, multiple call arguments, reader callbacks, reexports and default exports. The bounded wrapper-focused run passed six tests in 7364 ms at 2026-10-16T20:21:29.418Z.",
    "The complete runner regression previously found two compatibility issues: a legacy bare-row fixture retained new stale input metadata, and a code change during confinement preflight needed bindings refreshed after reuse was discarded. The corrected focused regressions passed nine tests in 17839 ms at 2026-10-16T19:59:17.779Z. The final complete runner and real gate validation follow after generation and independent review.",
    "The prior WO-213 role oracle remains byte-exact; the new input-flow oracle chains to it. Generated executor guidance runs the required targeted set together, retains forced single-suite diagnosis and fresh selection, restarts at formatting after a fix, and requires the final complete gate for remaining coverage."
  ],
  "rejected": [
    {
      "option": "Keep a blanket undeclared-task fallback as the normal input model",
      "reason": "The existing import graph and compiler symbol bindings can establish ordinary dependencies automatically; an unsupported access must be named concretely."
    },
    {
      "option": "Resolve wrapper arguments by identifier spelling",
      "reason": "Lexical shadowing produced an executable false claim. Compiler declarations and incoming call arguments provide the required identity."
    },
    {
      "option": "Trust selection exclusions as cache exclusions",
      "reason": "Selection deliberately omits some shared helpers. Reusable input keys derive the graph without those omissions."
    },
    {
      "option": "Run independent gate processes for each preflight",
      "reason": "One shared scheduler preserves dependencies, build sharing, resource policy and one evidence subject."
    }
  ],
  "alignment": "The traps are repeating valid work, asserting independence from an incomplete graph, hiding wrapper reads and weakening the complete claim. Prove reuse and invalidation with real child counters, use compiler bindings, retain conservative named boundaries and validate source executions at claim time. The NoOp retains serial repetition and whole-code invalidation after unrelated fixes.",
  "reopenWhen": "A wrapper or relevant input change is missed; an invalid, partial or stopped row supplies a pass; source execution cannot be revalidated; or task and wall timings reveal unexplained repeat work."
}
```

## WO-213-D054

```json
{
  "id": "WO-213-D054",
  "date": "2026-10-16",
  "dispatch": "resume: fix; operator requests four independent end-of-implementation workers",
  "authorization": "The operator directs the adversarial and design/improvement reviews plus two additional independent workers to devise targeted scratch probes for edge cases and attempts to break the implementation. Wrapping and aliasing of read/write operations are explicitly among the cases to cover.",
  "decision": "Use four fresh read-only Codex workers at the end of implementation: one criteria adversary, one design improver and two independent scratch-probe designers. Give them the order and implementation diff. Reserve no repository writer for a worker and permit no descendants. The root executes proposed scratch probes sequentially under the bounded wrapper, resolves or records findings, then runs the required combined targeted selection and complete review gate with no workers active.",
  "evidence": [
    "This root session has spawned no workers before this plan. The configured subagent cap is 20; the explicit plan uses four admissions and no descendants. Inspect canonical usage immediately before the first admission and record actual worker results at handoff."
  ],
  "rejected": [
    {
      "option": "Skip the extra probes because repair completion does not ordinarily require fresh reviewers",
      "reason": "The operator explicitly requests all four workers for this implementation."
    },
    {
      "option": "Let several workers mutate or probe the same worktree concurrently",
      "reason": "One writer owns the worktree, probes run one at a time, and gate evidence needs an unchanged subject."
    }
  ],
  "alignment": "The trap is counting review as proof without executing the proposed attacks. Keep workers independent, run concrete probes and preserve their outcomes. The NoOp omits the operator-requested independent challenge.",
  "reopenWhen": "A worker needs additional scope or descendants, the cap cannot admit the planned four, or a proposed probe would cross the existing authority boundary."
}
```

## WO-213-D055

```json
{
  "id": "WO-213-D055",
  "date": "2026-10-16",
  "dispatch": "resume: fix; execute the operator-requested independent reviews and scratch probes",
  "authorization": "The operator requests a criteria adversary and design improver plus two additional independent scratch-probe designers at the end of implementation, and explicitly calls for coverage of wrappers around filesystem operations.",
  "decision": "Retain one scheduler and the input/source-execution model, and close the reproduced input-analysis gaps. Resolve exported constants through the same declaration graph as callable exports. Reject ambiguous declarations, rest-path coercions and asynchronous or generator return coercions. Track destructuring, loop and var redeclaration writes; unmodeled active object mutations, escaped or unsupported native/runtime capabilities, mutable option aliases, inherited options and filesystem move/write preconditions execute fresh. Unknown automatic bindings retain whole-code identity with reusable:false; an explicit whole-code declaration keeps same-subject reuse. Recursive listings bind descendant membership and observable enumeration order, and special/symbolic entries refuse a narrower binding. Observed metadata results execute fresh; discarded synchronous probes bind stable metadata at nanosecond precision. Absolute URL references and foreign path semantics cannot masquerade as local inputs. Keep source executions and contract-specific failure history authoritative, reject unattested complete builds and impossible task timestamps, and qualify document edits by all current task bindings.",
  "evidence": [
    "Four independent read-only workers were admitted, with no descendants, against the initial order/diff bundle; the explicit plan uses four of the configured twenty admissions. The two reviewers were reused to check corrections. The root alone executed every proposed scratch probe sequentially under the bounded wrapper.",
    "The first root probe ran nine real child-before/after scenarios in 1618 ms, ending 2026-10-16T20:29:18.558Z. All nine exposed a static key omitting a changed runtime input. The first probe worker supplied four scenarios; all four reproduced before the corrections and passed afterward. The second supplied six; the root executed all six through genuine gates and verified each fresh failing child or corrupt chronology case.",
    "The second worker run exposed same-code reuse of an unresolved exclusive writer and a future-finish row masking a later genuine failure. Its final six-scenario run passed in 4650 ms at 2026-10-16T20:35:44.179Z: changed inputs executed and failed, unattested builds supplied no claim, and the future finish neither kept a claim nor supplied reuse.",
    "Correction reviews led to a seven-scenario child probe: six unsafe keys before, zero afterward (1042 ms, 2026-10-16T20:42:41.773Z). A further eight-scenario probe covered shared parameter/var bindings, shorthand and exported option objects, inherited recursive/exclusive options, prototype mutation and global eval callbacks: seven unsafe keys before, zero afterward (1185 ms, 2026-10-16T20:48:28.255Z). The retained regression matrix also checks stable immutable options remain automatically bound.",
    "The machinery chronology hypothesis reproduced in all three failure variants: a non-supplying machinery pass under contract B must not hide an earlier failure under A from runner reuse. Required-contract history now vetoes it in both runner and claim decisions. A genuine missing-output build also reproduced a complete-claim hole; completePassingRow now rejects buildOutputAttested:false.",
    "The suspected overbroad engine closure was disproved by a source-seeded derive: 32 runtime-import sources, without scripts/test-process-debt.mjs. Literal script expansion applies to command entry files, not a source-only seed. The engine key was retained.",
    "The design worker withdrew the optional shared-history-scanner recommendation after the common eligibility predicates and required-contract check were reviewed. The histories retain their different supply and recovery policies. Product 07 now states that document/evidence edits preserve a standing row only while code identity and every task input binding remain current.",
    "The full runner regression reached 175/177 after the first corrections. Its only two failures were older synthetic fixtures expecting undeclared inline and shell commands to be reusable; their intended bounded inputs are now explicit. The corrected focused run passed 13 tests in 10327 ms at 2026-10-16T20:43:39.511Z. Final candidate validation is recorded in the handoff and retained probe summary, rather than treating these intermediate results as the final gate."
  ],
  "rejected": [
    {
      "option": "Reuse an unresolved automatic binding whenever whole-code identity matches",
      "reason": "A genuine exclusive-write probe passed once, left an ignored lock, then was incorrectly carried while a fresh child failed. Unresolved effects must execute on each request."
    },
    {
      "option": "Treat const spelling or imported names as an immutability/export proof",
      "reason": "Aliased exports, shared var bindings, shorthand storage, exported objects and inherited options all produced executable counterexamples."
    },
    {
      "option": "Broaden the engine key or add another history scanner",
      "reason": "The engine hypothesis was disproved; the proposed normalization did not address a remaining concrete defect and was withdrawn."
    }
  ],
  "alignment": "The traps are asserting independence from incomplete effects, accepting a cached result despite changed ignored inputs, and counting hypotheses as executable proof. Execute independent recipes, retain fail-before evidence, reject unsupported reuse and keep known unaffected passes. The NoOp leaves reproduced false reuse and false complete claims. Conservative fresh execution costs time where the input boundary remains unresolved; the measured final flow must report that cost.",
  "reopenWhen": "A supported wrapper, mutation, filesystem observation or runtime capability can omit a relevant input, an unsupported automatic binding is reused, a known unaffected input-bound task unnecessarily reruns, or an invalid source execution supplies a claim."
}
```

## WO-213-D056

```json
{
  "id": "WO-213-D056",
  "date": "2026-10-16",
  "dispatch": "resume: fix; validate generated runtime inputs in the expanded input-bound flow",
  "decision": "Bind a fresh task at its actual execution boundary after prerequisites. Preserve that executed binding in the task result, check those bindings at gate end, and revalidate carried consumers after the build even when its output bytes match. A changed task input reruns that consumer with the recorded cause; build-output attestation and canonical execution contracts remain separate.",
  "evidence": [
    "A cold-build probe created an ignored runtime input and queried its metadata. Binding before the build made all child-passing attempts fail identityUnchanged: the captured input was missing or had the previous build metadata. The bounded fail-before result ended 2026-10-16T20:52:53.181Z (1274 ms).",
    "The first correction was still overwritten by the scheduler canonical binding; that failed in 1461 ms at 2026-10-16T20:53:42.129Z. The scheduler now retains the actual executed binding instead of overwriting it.",
    "The corrected three-arm probe passed in 1348 ms at 2026-10-16T20:55:10.733Z: cold run exit 0; unchanged next run zero fresh tasks; changed build source input reran build and the metadata consumer with the same output digest and cause its task inputs changed after the build.",
    "The retained generated-input and compiled-import-meta regressions passed two tests in 2367 ms at 2026-10-16T20:59:34.235Z. The former also carries an independent beta task across the rebuild, and the latter binds the data beside the actual compiled module."
  ],
  "rejected": [
    {
      "option": "Keep only the initial pre-build snapshot",
      "reason": "A cold build legitimately creates its consumers inputs. The initial snapshot is for reuse selection, not the later execution subject."
    },
    {
      "option": "Judge carried consumers only by equal build-output bytes",
      "reason": "The same bytes can have different metadata, which is a separate declared task input."
    }
  ],
  "alignment": "The traps are mistaking generated inputs for mid-gate source drift and carrying stale metadata when output bytes happen to match. Bind at execution, revalidate after prerequisites and preserve named causes. The NoOp can make a cold build fail repeatedly despite passing children.",
  "reopenWhen": "A generated input is bound before its producer, a scheduler overwrites an executed binding, a carried consumer survives relevant post-build input drift, or a current complete claim does not revalidate its original bindings."
}
```

## WO-213-D057

```json
{
  "id": "WO-213-D057",
  "date": "2026-10-16",
  "dispatch": "resume: fix; finish the requested independent correction checks",
  "decision": "Keep carried non-build tasks pending until all declared prerequisites pass, then recompute their input bindings immediately before deciding reuse. A fresh producer can change ignored data after the build; a consumer whose binding changed executes in the same selection with a named cause. Recognize global capabilities only when the compiler reports no symbol, rather than conflating an ambiguous local declaration with an absent global binding.",
  "evidence": [
    "The final design review identified a changed non-build prep task writing an ignored input consumed by alpha. The root reproduced gate exit 1 with only prep fresh in 1304 ms, ending 2026-10-16T21:05:10.876Z: the final input check caught stale alpha instead of scheduling it.",
    "After deferring the reuse decision, the same genuine-gate probe passed in 2108 ms at 2026-10-16T21:05:32.073Z: prep and alpha executed; independent beta stayed carried. A retained regression also requires the next unchanged request to execute no fresh tasks.",
    "The focused runner regression passed all 13 tests in 20455 ms at 2026-10-16T21:06:04.554Z, including cold generated inputs, same-byte rebuild metadata, non-build prerequisites, compiled import-meta data, options, mutations, wrappers and metadata claims.",
    "The criteria worker final bare-var/process hypothesis was already reusable:false before this correction because the capability-escape check vetoed it. The root observed that result, and the worker withdrew its blocking classification. The absent-symbol guard makes the distinction explicit and retains a regression; this is not counted as a reproduced unsafe reuse.",
    "Both original reviewers completed focused checks of the final correction with no outstanding finding. The criteria worker reports nine reproduced actionable observations addressed; the design worker reports six confirmed should-fix observations resolved, one optional guidance improvement applied, one disproved suspicion and one withdrawn optional suggestion. Counts are per worker and may overlap."
  ],
  "rejected": [
    {
      "option": "Revalidate all carried consumers once immediately after the build",
      "reason": "A later non-build prerequisite can change their relevant ignored inputs, producing an avoidable failed gate despite passing children."
    },
    {
      "option": "Reuse a shared binder snapshot across prerequisite execution",
      "reason": "Its file hashes could predate a producer mutation; each readiness check needs current bytes."
    }
  ],
  "alignment": "The trap is proving only that stale reuse is detected, while leaving the requested fix-and-rerun flow unable to finish in one selection. Revalidate at dependency readiness and test the complete counter sequence. The NoOp repeats a correct consumer after an avoidable failed gate.",
  "reopenWhen": "A fresh declared prerequisite changes a relevant consumer input but the consumer is carried or the gate fails instead of executing it; an ambiguous local symbol is treated as an absent global."
}
```

## WO-213-D058

```json
{
  "id": "WO-213-D058",
  "date": "2026-10-16",
  "dispatch": "resume: fix; qualify early failure visibility through the required bounded wrapper",
  "decision": "Forward compact PASS, FAIL and REUSE task status lines from a bounded gate while its child is running, independently of ordinary case progress. Keep the retained transcript and memory/output limits; give status forwarding a separate finite 256-line allowance, with the existing 200-character message bound. Test the actual child runner through boundedCommand, after ordinary progress is throttled, instead of inferring operator visibility from an internal console call.",
  "evidence": [
    "The combined 24-suite attempt exposed that the outer bounded wrapper forwarded PROGRESS lines but buffered the runner status transcript until executeSuite returned. Source inspection of bounded-command.mjs and the capture parser confirmed the boundary. The original early-failure regression intercepted console.log in runGate; it did not test this wrapper.",
    "The executor stopped that attempt with node scripts/harness.mjs evidence --stop at 2026-10-16T21:19:55.591Z, run 62a6fcfb-2c75-43b5-a380-a3f7e90f0c2d. The canonical result states no check was recorded; the stopped transcript and external receipt are preserved. Its bounded duration was 368639 ms; it supplies no passing evidence.",
    "The real wrapped regression emits 90 preliminary progress lines, then runs a fast failing beta beside a slower alpha. Before correction it failed because no live FAIL beta reached the wrapper report, in 1762 ms at 2026-10-16T21:20:24.990Z.",
    "After the correction the wrapped failure report precedes alpha.finishedAt. The focused selection passed all ten tests in 21596 ms at 2026-10-16T21:20:55.556Z, including bounded cwd/deadline, internal and wrapped early reporting, parallel composition, generated/prerequisite input bindings and all three partial-failure history variants."
  ],
  "rejected": [
    {
      "option": "Treat the runner internal log timing as proof of visibility through every mandated wrapper",
      "reason": "The actual wrapper buffered that output; the intercepted console test proved a narrower boundary."
    },
    {
      "option": "Stream every byte or bypass output throttling without a bound",
      "reason": "Compact task statuses establish early visibility while retaining the existing bounded transcript and case-progress policies."
    },
    {
      "option": "Finish the old validation attempt before correcting this known criterion gap",
      "reason": "That candidate could not establish the required wrapped behavior. The canonical stop avoids further validation of the incomplete candidate and preserves the attempt without inventing a passing row."
    }
  ],
  "alignment": "The traps are claiming user-visible behavior from an internal callback and losing a late failure behind the ordinary progress allowance. Exercise the actual wrapper after throttling and preserve finite output limits. The NoOp delays the failure until unrelated work finishes.",
  "reopenWhen": "A real targeted failure is hidden until another task finishes through the required bounded wrapper, or status forwarding defeats the output/memory bounds."
}
```

## WO-213-D059

```json
{
  "id": "WO-213-D059",
  "date": "2026-10-16",
  "dispatch": "resume: fix; correct the combined preflight structural failure",
  "decision": "Keep the repository Git-adapter rule intact. The static subprocess refusal fixture uses a generic child command because it tests the unmodeled spawn boundary, not Git behavior; it is never executed. Reuse sha256Hex from helpers.mjs for the two new modules instead of duplicating its digest operation. Preserve the interrupted combined attempt and run the structural and binding checks before restarting candidate validation.",
  "evidence": [
    "The combined preflight process-debt child completed 137 tests with 136 passing and one failure: no script defines a bare-hex sha256 or spawns Git outside the library. A focused 119 ms reproduction at 2026-10-16T21:37:38.654Z identified only scripts/test-runner.test.mjs: the static source string cp.spawnSync with a Git command matched the direct-Git screen.",
    "The initial chat description attributed this to hashing before isolating the assertion. That attribution was incorrect; the focused output and source identify the quoted Git call. The executor corrected the description and did not add an allowance or change the structural test.",
    "The canonical stop at 2026-10-16T21:37:32.140Z records no gate check for run b07a7552-d544-4116-894b-13d74a9ac56c. Its external transcript and receipt are preserved; its 772606 ms bounded duration is process cost, not passing evidence. Worktree integration and harness fixtures passed within that interrupted attempt, but the stopped selection supplies no reusable row.",
    "After correction all five helper-reuse tests passed in 3112 ms at 2026-10-16T21:38:13.661Z. Twelve focused input-binding, options, wrapped-status, prerequisite and partial-history tests passed in 15050 ms at 2026-10-16T21:38:28.820Z."
  ],
  "rejected": [
    {
      "option": "Allow the runner test through the Git-source screen",
      "reason": "The Git command was incidental to a static subprocess test; a generic command proves the same refusal without weakening the existing rule."
    },
    {
      "option": "Treat the interrupted selection or its completed children as a passing gate",
      "reason": "The canonical stop records no check and stopped evidence remains ineligible."
    }
  ],
  "alignment": "The traps are reading a compound test title as the isolated cause and weakening a repository rule to admit an unnecessary fixture spelling. Inspect the actual findings, correct the fixture, and keep the rule. The NoOp leaves a real preflight failure.",
  "reopenWhen": "The fixture bypasses a library rule, digest bytes change when using the shared helper, or a stopped attempt supplies a passing claim."
}
```

## WO-213-D060

```json
{
  "id": "WO-213-D060",
  "date": "2026-10-16",
  "dispatch": "resume: fix; bound the authorized combined preflight command by its existing task clocks",
  "decision": "Keep the 900000 ms per-task deadline and derive the outer deadline for the project's canonical multi-suite test command from the same expanded tasks the scheduler executes, plus one admission allowance. Ordinary probes, single-suite selections, malformed selectors, unknown suite names, unavailable inventories and document/base-comparison commands retain the ordinary cap. Explicit caller deadlines still take precedence. Recognize only the exact project test-script mapping at the actual execution directory; keep a finite safe-integer upper bound. The helper does not replace canonical runner argument validation: an unsupported extra flag can receive the derived deadline but is rejected by the child before tasks.",
  "evidence": [
    "Source inspection found the outer bounded probe's 900000 ms default would cap the whole authorized multi-task flow, while the runner already grants each task that deadline. Earlier measured components included roughly 234 s worktree integration, 342 s harness fixtures, 99 s process debt and 224 s runner regression; the aggregate cap could therefore interrupt a valid selection. This is a source-supported budget defect, not a claimed reproduced 15-minute timeout.",
    "The executor canonically stopped the obsolete attempt at 2026-10-16T21:44:23.598Z, run eaa9193f-8200-41f2-9ce6-faabefd1dc10. No check was recorded. The 138498 ms bounded duration and its external log/receipt remain preserved as process cost.",
    "The new budget-policy regression initially failed in 100 ms at 2026-10-16T21:46:20.658Z because the derivation helper did not exist. Five focused tests passed in 5602 ms at 2026-10-16T21:46:54.388Z: canonical npm/direct-node forms, shared release-leaf expansion, ordinary and unrelated commands, document/base-comparison exclusion, explicit 500 ms deadline and live failure visibility. All five helper-reuse checks also passed after the change.",
    "Both original reviewers checked the bounded clock correction read-only. The design review identified the separate document/base-comparison phase, which now keeps its existing policy. The criteria review confirmed canonical calculation and explicit override, and identified the unsupported-flag qualification recorded above. No worker admission was added."
  ],
  "rejected": [
    {
      "option": "Raise every probe or child task deadline",
      "reason": "Only a combined command owns multiple existing task clocks; unrelated probes and each task retain their current bound."
    },
    {
      "option": "Use a fixed guessed aggregate or create a second task selector",
      "reason": "The shared expansion already accounts for build and split release cases. Multiplying its task count gives a finite conservative budget without changing scheduling."
    },
    {
      "option": "Duplicate the runner's full argument parser in the wrapper",
      "reason": "Canonical validation already rejects unsupported flags before execution. The wrapper's claim is restricted to supported command recognition and task-budget derivation."
    }
  ],
  "alignment": "The traps are retaining a single-task clock around a multi-task scheduler and relaxing unrelated limits to compensate. Derive only the outer aggregate from existing task clocks. The NoOp risks spending a long valid selection before an unrelated outer deadline stops it.",
  "reopenWhen": "A canonical multi-suite task expansion receives too little aggregate time, a task or unrelated probe receives a larger deadline, or an explicit caller deadline is ignored."
}
```

## WO-213-D061

```json
{
  "id": "WO-213-D061",
  "date": "2026-10-16",
  "dispatch": "resume: fix; audit the practical reuse boundary of the expensive preflight fixtures",
  "decision": "Keep worktree-integration, harness-fixtures and process-debt fresh while their automatic input coverage remains unresolved. Do not label a broad tracked-prefix declaration complete when these fixtures also consume moving Git state, ignored build outputs, linked installed tools or live control records. Retain this cost in the actual timing report and defer typed support for those observations through the canonical follow-up register.",
  "evidence": [
    "A reused read-only design worker audited the three fixtures and recommended fresh execution for all three. The root checked the cited source boundaries: integration archives/clones Git state and copies ignored dist while linking installed dependencies; harness fixtures consume generated root surfaces, historical evidence and linked TypeScript/Prettier; process debt reads budgets, role files and actual root resume state through its imported session tests, and enumerates linked node_modules.",
    "The current explicit prefix binder enumerates tracked and nonignored inventory files. A node_modules/ prefix therefore cannot attest the ignored linked dependency contents. No evidence establishes a complete narrower declaration for these three tasks.",
    "Criterion 19 expressly permits conservative unknown-coverage execution. The retained genuine-gate regressions establish unaffected known-input reuse across a source fix, generated-input rebuilds and changed non-build prerequisites. They do not establish independence for these external observation kinds."
  ],
  "rejected": [
    {
      "option": "Declare the three fixture tasks independent from a broad source prefix alone",
      "reason": "That would omit actual Git, installed-tool or live-record inputs and could carry a stale pass."
    },
    {
      "option": "Claim their repeated duration as unavoidable or already saved",
      "reason": "The boundary is a current implementation limit. Only the final measured executions and carries establish this run's cost; no equivalent fresh control was measured."
    }
  ],
  "followup": "Add typed Git-state, installed-runtime/link-target and live-record input observations to scripts/lib/task-inputs.mjs and task-input-analysis.mjs, then audit declarations for worktree-integration, harness-fixtures and process-debt. Require genuine-gate counterexamples for HEAD/ref movement, ignored dist drift, linked dependency changes and current control-record changes, plus unchanged-input carry and cross-fix recovery proofs. Preserve unknown-coverage fresh execution until every consumed observation is bound.",
  "alignment": "The traps are turning the desired timing outcome into an unsupported independence claim and hiding conservative reruns in a summary. Keep the actual boundaries explicit and report their measured cost. The NoOp is the existing safe fresh policy; extending observation kinds needs a separate bounded implementation and counterexample set.",
  "reopenWhen": "A planning order authorizes typed support for the observed Git, installed-runtime and live-record inputs, or a complete narrower dependency proof is available for one of these fixtures."
}
```

## WO-213-D062

```json
{
  "id": "WO-213-D062",
  "date": "2026-10-16",
  "dispatch": "resume: fix; correct the completed combined selection's three failing tasks",
  "decision": "Use config.mjs's TOOL_ROOT and configured intake root in task bindings; include the intake root in the compiler-analysis cache key. Keep the existing configuration-root guard intact. Align the skeleton role assertion with the current complete-gate wording while retaining its no-write/no-agent duty. Reserve two host slots for runner-fixtures and serialize its four test files, so its nested concurrency proofs fit the parent reservation. The fixture overlap expectation also respects an intentionally serial parent, and early-failure tables place beta first even when the scheduler correctly retains table order at one lane.",
  "evidence": [
    "The combined 24-suite selection completed at code identity b68f7af7316d6e2c1e9c27f8d854b1ee2efa243c6244deb5bf9612358ade7889, recorded 2026-10-16T22:13:47.693Z: 22 tasks passed and three failed, 25 fresh tasks, identityUnchanged:true, gate duration 1220886 ms and command wall 1271070 ms. Its failed row, external log and receipt are preserved; it is not a passing gate. The wrapper reported each failing task before the slower target-worktree suite finished.",
    "configuration-root identified four literal intake-root spellings and a second repository-root derivation in the new modules. skeleton identified one stale role-duty phrase. runner-fixtures had three failures: overlap and two early-report assertions. The retained runner task timeline establishes hostLaneSlots:1 and reservedSlots:1; source inspection shows nested runGate honors that lease and priority sorting applies only above one lane. These are observed fixture/admission issues, not an invented contention cause.",
    "The first focused correction run exposed the new intake test expecting a specific caught exception message; the binder intentionally returns its generic whole-code reason. Both reused reviewers independently identified that incidental assertion and that beta priority alone did not reorder a serial fixture. Both corrections are now applied and both reviewers report zero outstanding observations, without new admissions or probe execution.",
    "The corrected focused command passed all 24 tests in 15039 ms, ending 2026-10-16T22:17:47.533Z. It includes configuration-root, the role-duty assertion, configured-intake/cache reuse, package/runner bounds, scheduler composition and internal/wrapped early failure reporting.",
    "A separate real parent-gate probe passed both policies in 16001 ms, ending 2026-10-16T22:18:12.588Z. The parallel parent recorded reservedSlots:2 and hostLaneSlots:2, exit 0 in 7485 ms; the serial parent recorded one slot, exit 0 in 7745 ms. Both execute the actual selected runner tests. The temporary repositories were removed in finally blocks."
  ],
  "rejected": [
    {
      "option": "Weaken the root-centralization screen or the gate's inherited resource bound",
      "reason": "The new code and fixture assumptions violated existing policies; the policies themselves correctly exposed them."
    },
    {
      "option": "Assume standalone parallel proof also establishes operation under a one-lane parent",
      "reason": "The completed combined run reproduced the missing context. The final probe exercises both real reservations instead of replacing the lease with an unbounded test context."
    },
    {
      "option": "Stop the failed selection before its other tasks finish",
      "reason": "A completed failed row can retain eligible executed passes for the next request. This attempt was allowed to close with intact source/input subjects and full diagnostics."
    }
  ],
  "alignment": "The traps are weakening an existing invariant to fit new code and claiming a nested parallel test owns resources its parent never reserved. Centralize roots, request the actual two-child budget, preserve deliberate serial execution and test both. The NoOp leaves three real preflight failures.",
  "reopenWhen": "Configured intake can enter a reusable key, analysis caching ignores its configured boundary, role tests lose the no-write/no-agent duty, or the runner's concurrency proofs exceed or incorrectly assume their parent reservation."
}
```

## WO-213-D063

```json
{
  "id": "WO-213-D063",
  "date": "2026-10-16",
  "dispatch": "resume: fix; regenerate the installed harness after the final package-test build",
  "decision": "Emit and check a new complete harness snapshot after rebuilding the changed skeleton test. Preserve the old immutable snapshot and authority editions; mint authority revision 009 and select it for the regenerated bundle comparison. Keep the role oracle and the other evidence editions because their current checks do not require replacement.",
  "evidence": [
    "The fresh document gate failed its authority/harness admission in 44.05 s: checkHarness reported a missing or changed pinned runtime file. The expected snapshot changed after rebuilding the skeleton test because runtimeInventory binds the complete carried package inventory, including compiled tests. The compiler artifact named in the diagnostic itself remains present; the missing subject was the newly derived snapshot, not an invented compiler-source regression.",
    "node scripts/harness.mjs emit and check succeeded for 34 generated surfaces and installed the new snapshot. The role-oracle comparison found zero mismatches for all default and opt-out role files; neither the current input-flow oracle nor its historical chain was rewritten.",
    "The explicit authority check then refused stale WO-213 revision 008 bundle-diff.json. The canonical write recorded revision 009 in 944 ms, ending 2026-10-16T22:21:13.232Z, and current.json now selects that edition. Revision 008 and every earlier edition remain intact. Artifact-identity, verification and feedback checks passed in the failed document run; no replacement for them was inferred from the authority failure."
  ],
  "rejected": [
    {
      "option": "Modify the old pinned snapshot or authority revision 008",
      "reason": "Both record their prior subjects and are immutable. Emission and a new evidence revision preserve that history."
    },
    {
      "option": "Weaken complete runtime inventory or rewrite the role oracle",
      "reason": "The inventory correctly detects the rebuilt test byte, while the role-oracle comparison establishes the role text is unchanged."
    }
  ],
  "alignment": "The trap is treating a rebuilt package-test byte as invisible to a snapshot whose policy explicitly binds all runtime bytes. Regenerate before candidate validation and preserve historical evidence. The NoOp leaves the document preflight refused.",
  "reopenWhen": "A rebuilt carried runtime byte is not installed before validation, a historical snapshot or edition is changed, or an unchanged role oracle is rewritten merely to clear an unrelated bundle comparison."
}
```

## WO-213-D064

```json
{
  "id": "WO-213-D064",
  "date": "2026-10-16",
  "dispatch": "resume: fix; diagnose and bound complete-gate admission before rerunning the required validation",
  "decision": "Keep shell path discovery out of the JavaScript scanner and collect its literal first-party path words conservatively. Reuse the existing import reader's lexer for JavaScript string discovery, refusing unknown or nonadvancing tokens before accumulation. Automatic shell bindings remain explicitly nonreusable unless their inputs have a declared boundary. Separately bound compiler input analysis by four MiB of source and 100000 deterministic work steps, checking candidate products before allocation; exhaustion discards partial analysis and returns a named nonreusable whole-code fallback. Preserve the stopped attempt and rerun validation at the corrected identity.",
  "evidence": [
    "The prior combined 24-suite selection passed all 25 executed tasks at identity 7eae6cda82366bcfff15b3e4b704bb5609168f538e7772a33da831305eb469d6, recorded 2026-10-16T22:50:37.056Z, duration 1473478 ms and command wall 1546203 ms. The subsequent complete review started at 22:50:45.700Z and produced no task output while consuming one CPU. A canonical stop was requested at 22:57:04.652Z; after it remained busy, the executor verified and terminated its owned process. It exited 1 with no current gate row, after 428439 ms command wall. This is a stopped attempt, never passing evidence.",
    "A bounded full-selection binding profile stopped at checkpoint. A separate stage profile isolated deriveMachinerySources, then an instrumented copy isolated scriptLiterals on scripts/test-checkpoint.sh. Thirteen minimization trials in 9316 ms reduced the scanner stall to one shell comment. The pinned TypeScript 7.0.2 scanner returns a PrivateIdentifier without advancing for a hash followed by a space. Installed scanner declarations and implementation establish getTokenEnd as the cursor evidence. Context7 resolved the pinned TypeScript documentation, but its returned private-identifier baselines did not themselves establish this scanner API; the installed package did.",
    "The first shell-only correction did not close malformed JavaScript: the shared import lexer also accumulated tokens without progress, and the malformed-source probe exhausted the V8 heap and aborted. The final correction guards that shared lexer and removes the duplicate JavaScript literal scanner. It is incorrect to attribute the checkpoint stall to compiler graph exploration or to call the shell-only patch complete.",
    "The separate 24-level branching-wrapper probe exceeded its 30-second bound before the deterministic analysis budget. After the budget, it returned a nonreusable named fallback in about 278 ms while the three-level resolved wrapper retained a declared input binding. Eleven focused wrapper, input and partial-history tests passed in 17752 ms, ending 2026-10-16T23:01:13.696Z. This was a separate complexity defect; its correction alone did not fix the checkpoint scanner stall.",
    "Four focused source-discovery and input-analysis cases passed in 777 ms, ending 2026-10-16T23:09:08.373Z. The shell and invalid-JavaScript refusal case took 96.9 ms and the branching case 340.6 ms. The actual complete selection's 47 task bindings then all completed in 7020 ms, ending 23:09:23.623Z, versus the earlier bounded profile's 30-second timeout at checkpoint. These are admission and focused-test measurements, not a passing complete gate.",
    "Both original reviewers independently checked the deterministic budget and then the shared-lexer correction without new worker admissions, probes or mutations. Both found zero additional concrete parser, coverage or refusal regressions. Their cumulative finding counts remain eleven and nine, twenty addressed per-worker observations with overlap."
  ],
  "rejected": [
    {
      "option": "Increase the outer deadline or attribute the stall to general compiler cost",
      "reason": "The bounded stage and minimized-source probes identify a nonadvancing shell scanner. A longer deadline cannot make that cursor advance."
    },
    {
      "option": "Keep a second JavaScript scanner or silently drop malformed source",
      "reason": "A shared guarded lexer removes duplicate lexical behavior. A controlled refusal preserves structural failure rather than omitting dependency coverage."
    },
    {
      "option": "Use elapsed host time to choose reusable analysis results",
      "reason": "Equivalent graphs must not receive different keys under different host load. Source size and deterministic operation counts provide a stable conservative boundary."
    }
  ],
  "alignment": "The traps are confusing two independently reproduced defects, promoting a failed probe into success, and changing deadlines before identifying where admission stalls. Isolate stages, retain the failed shell-only and branching attempts, and validate the actual full selection before the final gates. The NoOp leaves a complete request unable to reach task execution.",
  "reopenWhen": "Literal discovery can feed a different language into the JavaScript lexer, malformed input can accumulate without cursor progress, bounded exploration returns partial reusable facts, or the actual complete selection cannot finish admission within its ordinary bound."
}
```

## WO-213-D065

```json
{
  "id": "WO-213-D065",
  "date": "2026-10-16",
  "dispatch": "resume: fix; the operator redirects the fourth repair after the previous session's input-analysis work",
  "authorization": "Paraphrase of the operator's direction in this session: the previous session's compiler-based input analyzer is to be fixed, because the aim was to stop executors wasting time on gates that fail late over bookkeeping drift and to let preflight suite passes be reused by the full gate. Asked, with the measurements below, whether to remove the analyzer, keep it as it was or keep extending it, the operator chose removal.",
  "decision": "Remove scripts/lib/task-input-analysis.mjs and the thirteen synthetic regressions that exercised it. A suite that declares inputs is bound by them, by the runtime-import closure of its entry files and by the runner's own sources, and its pass is carried across a fix elsewhere; an undeclared suite is bound by the whole code identity and carried at that identity, as it was before this order's fourth repair began. Declared bindings are version 2, so no analyzer-era binding compares equal to a current one. The import reader's lexer guard and the shell-literal discovery of D064 stay, because they correct the import reader itself. This withdraws D053's automatic analysis as the mechanism together with D064's analysis budget and its rule that an undeclared shell suite is never reusable, reverses D055's rule that an undeclared binding is never reusable, and reopens D061: worktree-integration, harness-fixtures and process-debt are carried at an unchanged code identity as every suite was before this repair, and the outside-identity inputs D061 lists remain the standing limit of whole-code identity that the typed-input follow-up FUP-8be05f7be074c356 would bind. A declaration that cannot be bound runs on every request until it is fixed, and the runner's own sources bound into every declared binding include the case marker, the case reporter and the two C launcher sources it loads at run time. The first-party script pattern that source discovery and the binder share is exported once from scripts/lib/machinery-coverage.mjs. With the analyzer go D056's compiled import-meta regression, D062's intake root in the analysis cache key and D064's analysis budget with its branching regression; D056's binding at execution and D057's recheck after prerequisites remain, and the regressions D055 and D056 cite for the analyzer were removed with it. The removed module was never committed, so no ref keeps it; input-binding-coverage.json records what it bound. A declared suite's command is read however it spells a repository path (a leading ./, an absolute path under the root, the value of a --flag=path word, the first word of a shell command), a repository file or directory the command names outside the bindable roots refuses the declaration until it is declared, scripts a helper in the closure names literally are bound with the closure, and a differently spelled path that reaches the intake root on a volume that ignores case is refused like the plain spelling.",
  "evidence": [
    "Binding every task of the complete selection at code identity 1b96a999a9d69148458e7c38a02dab65b523513157b3070112352a8ba3d01d6f (node scripts/harness.mjs bounded -- node docs/evidence/WO-213/input-binding-coverage.mjs, 2026-10-16T23:27:00.856Z, 6076 ms): 96 tasks; 4 declared, all four by hand-written declarations (build, compiler, adjacent-queue, codex-continuation) and none by static analysis; 92 whole-code, of which 27 exhausted the analyzer's deterministic work limit, 1 its source-size limit, 62 met a shell or subprocess boundary and 2 had no statically resolved entry. input-binding-coverage.json records the counts.",
    "Immediately after the passing suite:runner-fixtures row recorded 2026-10-16T23:26:16.342Z at that identity, coveringTaskResults for the complete selection carried nothing (node scripts/harness.mjs bounded -- node docs/evidence/WO-213/input-binding-carry.mjs): runner-fixtures itself was declined with the analyzer's shell-boundary reason, because D055 marked every undeclared binding reusable:false. Under that policy a targeted preflight's passes could never reach the complete gate, against criteria 16 and 17 and the reuse VER-003 and VER-004 verified.",
    "The gate index holds no row in which any real task was bound by static analysis (grep -c over docs/control/local/harness/checks.json: 0 results with the static-analysis method, 16 with the declaration method, all from the four declared suites across four rows). The analyzer stalled a complete review once (D064), and the reviewers of D055 and D057 reported twenty observations in three hours, with overlap.",
    "After the change, the focused runner regressions ran under the bounded wrapper (2026-10-16T23:45:54.923Z to 23:46:36.337Z): seventeen of twenty-one passed, covering declared-input reuse across a fix, same-identity reuse of an undeclared task, shell discovery, intake exclusion, generated inputs after a cold build, prerequisite revalidation, targeted composition, partial-pass resolution and the impossible-finish veto; the four failures were the new first-failure regression's fixture, corrected in D066.",
    "A verifier rehearsal with real child executions (a read-only dotln-worker writing throwaway probes in disposable fixtures) reproduced four gaps and they are closed: a declared entry spelled ./scripts/x.mjs, as an absolute path or as the first word of a shell command, or an input named as --input=file or as a bare directory, was left unbound and a stale pass could be carried; a script named only by an imported helper was not bound; a case variant of the intake path bound on a volume that ignores case; and the engine digest omitted the host guard. The same rehearsal confirmed that the retained VER-004 probe now exits refusing the claim, that version-1 bindings are never carried or cited, and that undeclared suites are carried at the same identity and rerun after any code change including an untracked file.",
    "Two read-only dotln-worker reviewers, one for design and one adversary of the criteria, read the change. The adversary found the engine digest missing four files the runner loads at run time, declared patterns that could bind nothing or bind a prefix as a missing file, and a command naming a repository file outside the bindable roots; the design reviewer found the leftover method field, the silent reusable fallback for an unbindable declaration and the absence of any check over the shipped declarations. Each is corrected, and a regression now binds every shipped declaration against the real inventory.",
    "After the corrections the focused runner regressions pass under the bounded wrapper: 26 tests, 2026-10-17T00:27:02.434Z to 00:27:50.144Z."
  ],
  "rejected": [
    {
      "option": "Keep the analyzer as implemented",
      "reason": "It binds no real suite in this repository: every real suite imports modules that spawn children or exceeds the analyzer's deterministic budget, so it costs binding time on every gate and can stall, while carrying false-green risk."
    },
    {
      "option": "Extend the analyzer until it binds real suites",
      "reason": "A sound analyzer must still fall back wherever a child process reads files, which is every integration suite here; the operator declined this open-ended path."
    },
    {
      "option": "Keep undeclared suites non-reusable",
      "reason": "That policy made the preflight useless: no undeclared pass could reach the complete gate even at the same code identity."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D061",
    "observation": "The operator's removal of the analyzer restores same-identity carrying for the three suites D061 kept fresh; their outside-identity inputs remain the typed-input follow-up's subject."
  },
  "followup": "Plan an order that removes the class of late bookkeeping failures this order's history shows: one command that regenerates every derived artifact that is safe to regenerate (the decisions and work-order indexes, the harness snapshot, publication locks and role oracles) and names the ones policy keeps manual (doc-baseline fingerprints and evidence editions), and a structural phase that runs the repository's policy screens (root literals, direct Git and digest use, role-text assertions) in seconds before any suite starts, so an executor learns of drift before the first expensive task.",
  "alignment": "The traps are reversing an operator-authorized mechanism on taste, and keeping it because it was expensive to build. Measure what it binds on the real selection, show the carry it blocks, and let the operator choose with the numbers. The NoOp ships an analyzer that binds nothing and a preflight whose passes never carry.",
  "reopenWhen": "A planning order authorizes sandboxed or traced input discovery, a declared binding carries a pass whose actual inputs changed, or an undeclared pass is carried across a code change."
}
```

## WO-213-D066

```json
{
  "id": "WO-213-D066",
  "date": "2026-10-16",
  "dispatch": "resume: fix; the operator chooses that the multi-suite preflight stops at its first failure",
  "authorization": "Paraphrase of the operator's choice in this session: the targeted preflight should stop launching suites after the first failure while the suites in flight finish and keep their passes; the complete gate keeps running everything.",
  "decision": "A targeted selection of several suites launches no further task once an executed task has failed. The tasks in flight finish and keep their results; a carried task whose prerequisites passed is still carried, the rest are recorded as not started with one fixed message, and the row records as an ordinary failed run whose finished passes stay eligible for the rerun at the same code identity, or across a fix for suites that declare their inputs, and for the complete gate. A task already admitted and still waiting for host lanes when the failure arrives is recorded as never started as well: the failure aborts the wait. --keep-going runs every selected suite and is refused for a single suite, for an npm run test:docs selection, which never stops, and --review is refused with --only. Plain, review, machinery, single-suite and npm run test:docs runs do not stop; the SKIP label, the gate-end input-check exemption and the live forwarding of never-started results apply to every selection. Dependents of the failed task are skipped for that reason to a fixed point before the stop, carried tasks are carried to a fixed point so a carried dependent of a carried task stays carried, the summary counts failures and never-started tasks separately, and the stop notice says to edit only after the run ends, because a change while tasks finish changes the code identity and discards their passes.",
  "evidence": [
    "The new regression first failed only because its fixture tasks did not declare needsBuild, so the selection ran behind a document barrier instead of the build (run of 2026-10-16T23:45:54.923Z). With needsBuild declared, its four tests pass under the bounded wrapper in 4803 ms (2026-10-16T23:49:02.044Z to 23:49:06.990Z).",
    "Serial arm: build and alpha pass, beta fails, gamma is recorded not started with the fixed message and never writes its marker. After the fix to beta changes the code identity, the rerun executes only beta and gamma, carries alpha's pass from the failed row because alpha declares its inputs, and the complete gate runs zero fresh tasks; every task executed once except beta.",
    "--keep-going arm: all four tasks execute and gamma writes its marker; --keep-going with a single suite is refused.",
    "Parallel arm under four lanes: alpha was in flight when beta failed, finished afterwards and kept its pass, and gamma, waiting on alpha, never started with the fixed message (PROOF first-failure stop {\"slots\":4,\"alphaExecuted\":true}). The arm lists beta first because the scheduler keeps table order under one lane, where alpha then never starts; the two existing reporting-order regressions pass --keep-going for the same reason.",
    "The criteria adversary found that the stop would have broken the two existing one-lane reporting-order tests and the new arm's one-lane branch, that a carried task still pending at the failure was written off with a false build-output cause, that the gate-end input check judged a never-started declared task by its pre-build binding and could discard the finished passes, and that a dependent of the failed task received the first-failure message instead of its dependency cause. The design reviewer found the summary mixing suite and task counts, never-started tasks printed as failures, and document selections stopping too. Each is corrected: the dependency skip runs before the stop, a carried task whose prerequisites passed is still carried, never-started tasks are skipped by the gate-end input check and the build-output cause and print as SKIP, the summary counts tasks, and only product selections stop.",
    "After the corrections the regression's four arms pass under the bounded wrapper within the 26-test focused run of 2026-10-17T00:27:02.434Z to 00:27:50.144Z: the serial stop with carry across the fix, carried tasks pending at the failure staying carried and composing the complete gate, --keep-going, and the parallel arm with its in-flight witness.",
    "A verifier rehearsal with real child executions then reproduced seven more gaps, all closed: tasks already waiting for host lanes still launched after the failure (now the failure aborts the wait, and a direct scheduler regression holds three of four lanes to prove it); the summary counted never-started suites as failed; a carried dependent of a carried task was written off by the drain's order; a transitive dependent of the failed task received the first-failure message; the bounded wrapper did not forward SKIP lines or the stop notice live; editing while tasks finished discarded their passes without any guidance; and the stop keyed on the --document flag while its comment spoke of document rows. The final-review rehearsal added that D066's first wording overstated what stays eligible for undeclared suites after a fix and called other runs unchanged although the SKIP label and the input-check exemption reach them; both are corrected above.",
    "After those corrections the focused set of 29 regressions passed under the bounded wrapper except the new lane-wait test's own fixture teardown, corrected next (2026-10-17T01:12:47.030Z to 01:13:42.709Z)."
  ],
  "followup": "Plan a field on a targeted selection's gate record that says it stopped at its first failure and names the tasks it never started, so readers need not infer the stop from each case's recorded output; weigh it against the record's consumers before changing the schema.",
  "rejected": [
    {
      "option": "Stop the complete gate at its first failure too",
      "reason": "The complete gate is the final coverage; the operator chose the preflight only, and a complete run that stops early would hide unrelated failures until the next run."
    },
    {
      "option": "Abort the tasks in flight as evidence --stop does",
      "reason": "A stopped run records no row and loses every pass; finishing the tasks in flight keeps eligible evidence and ends within one task's duration."
    },
    {
      "option": "Mark the tasks not started as stopped",
      "reason": "A stopped row supplies nothing by policy; the finished passes of a first-failure row are intact executions the rules already admit from a failed attempt."
    }
  ],
  "alignment": "The trap is trading the operator's waiting time for hidden failures without saying so. Default the preflight to stopping, keep an explicit opt-out and record the suites not started, so the rerun's cost is visible. The NoOp leaves a cheap failure costing the whole selection's wall time or every pass.",
  "reopenWhen": "A task not started is counted as executed or displaces a pass, a finished pass from a first-failure row is not carried, or the complete gate stops early."
}
```

## WO-213-D067

```json
{
  "id": "WO-213-D067",
  "date": "2026-10-16",
  "dispatch": "resume: verify; independent VER-005 command-path attack",
  "kind": "finding",
  "decision": "Record blocking V5-F1 against criteria 16, 17 and 19: a declared task whose command uses a valid interior dot segment or repeated separator can omit its entry file from the binding, carry a stale pass across a change to that file and supply an accepted complete lifecycle claim. This also breaks criterion 17's requirement that invalidated work actually executes. The verifier leaves implementation unchanged and routes the repair inside this order's declared runner/input-binding surfaces.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-213/ver005-path-alias.mjs runs real tasks in a disposable Git fixture. The first complete gate passes. Changing scripts/alpha.mjs from exit 0 to exit 13 changes the whole-code identity, and direct execution through scripts/../scripts/alpha.mjs exits 13. The subsequent complete gate exits 0 with alpha reused from the earlier identity; coveringGateCheck and requireGateClaims both accept its complete claim. The probe exits 0 only when this false admission is reproduced; it changes no source-worktree gate row.",
    "The binding remains coverage declared with an empty spec.entries list and an unchanged digest. scripts/lib/task-inputs.mjs repositoryPath returns undefined for the spelling because safe rejects dot segments, and the subsequent filter removes it before the existing-file refusal or entry discovery. The ordinary scripts/alpha.mjs spelling changes its binding digest correctly. Additional direct-command and binding controls reproduce the omission for scripts/./alpha.mjs, scripts//alpha.mjs and ./scripts/../scripts/alpha.mjs.",
    "The focused runner batch passed 28 tests in 43473 ms, including the existing declared-entry spelling cases, the three partial-failure recovery scenarios, multi-suite scheduling, first-failure stopping and input-bound reuse. The separate eleven-process probe passes the ordinary cross-fix composition, ignored semantic-input invalidation and multi-suite partial/other-contract failure-resolution cases. Those passing cases do not cover interior path aliases.",
    "The current real review row remains intact at code identity f8dabe48a503112ec3aed9eadcb7c50838d68816fa19b7869dd8acb43cf4e7e1: 47 suites, 104 tasks, twelve carried results with independently checked source executions. This finding establishes an uncovered accepted command form, not that the recorded core suite inventory used that form."
  ],
  "reopens": {
    "decisionId": "WO-213-D065",
    "observation": "A declared binding carries a pass although its actual entry-file bytes changed; this is D065's explicit reopening condition."
  },
  "followup": "WO-213 repair V5-F1: normalize and validate repository-contained command paths before discovering their entry/import closure, or mark unresolved spellings unbindable and non-reusable. Never silently drop a command's actual repository input and still issue a declared binding. Cover interior dot segments and repeated separators with real child executions, a changed failing entry and both task-reuse and lifecycle-claim assertions; keep the ordinary-spelling positive control, intake and symbolic-link refusals, and outside-root containment. Preserve the operator's declaration-based design and same-identity fallback for undeclared tasks.",
  "rejected": [
    {
      "option": "Pass on the current full gate and existing spelling regressions",
      "reason": "The independent child execution exits 13 while the composed complete claim passes; the criteria require affected work to execute and current inputs to bind the claim."
    },
    {
      "option": "Reintroduce the withdrawn automatic input analyzer",
      "reason": "The operator accepted the declaration-based design. This defect is the command-path admission within that design, and a bounded conservative repair is sufficient."
    }
  ],
  "alignment": "The traps are trusting the runner's green fixtures while judging the runner itself, treating a parser omission as a harmless unsupported spelling, and reopening the operator's settled architecture choice. Use an actual failing child and the lifecycle consumer, vary equivalent spellings, and route only the reproduced binding defect. The NoOp would accept a complete gate that never executes its changed failing task.",
  "reopenWhen": "The repair is ready for independent verification, or another accepted command spelling omits an actual input from a declared task binding."
}
```

## WO-213-D068

```json
{
  "id": "WO-213-D068",
  "date": "2026-10-17",
  "dispatch": "resume: fix; repair VER-005 V5-F1 (D067)",
  "decision": "A declared task is bound only from what the binder can read exactly; anything else is bound by the whole code identity and runs on every request. The command is read by shape. Node may carry an allowlist of options that read no file and module options naming an existing first-party module (--import, --loader and --experimental-loader as URLs, --require as a path), then a main entry and its program arguments or, with --test, test files and the runner's own <directory>/*.test.js pattern, which the binder expands as the runner does, binding each file and requiring the directory's declaration. A shell may run a .sh first-party script, and a first-party script may run directly under no interpreter line or a plain shell or env node line. The task environment is read too: NODE_OPTIONS passes the same option allowlist, its modules are bound and the runner's own preload is skipped as one of the runner's sources, while NODE_PATH, BASH_ENV and ENV refuse. Every path a command spells is resolved as the operating system reaches it, so dot segments, repeated separators, absolute spellings and climbs out of and back into the root bind under the repository path. A symbolic link or differently cased name, the root or a directory above it, a file node would find by its own rules (an absent or extensionless entry, a package or bare module, a directory or a pattern node matches, no test file at all), program text other than an empty -e or -p program, which loads nothing, and any other program or option refuse; a path under the intake root refuses even inside a declared directory. The closure follows .mts and .cts modules; binds the JavaScript file beside a TypeScript source the import reader substitutes, every ancestor package.json present or absent, and every file in Git's inventory that a module names by a literal or by a word of a literal holding a command (module-relative, nested beside it, ./ relative to the working directory, absolute or file:). It refuses, unless that package's directory is declared, a package imports map, an import of a package by its own or a repository-linked name, a nested node_modules, and an @dotln/ package whose resolution of an imported subpath differs from the reader's src/ reading and is not dist/ build output (an exported type declaration file counts as code, and main falls back to index.js). Ignored files stay outside the binding as they are outside the code identity: installed packages are bound by the lockfile, build output is attested, and an ignored runtime input is declared explicitly. A path a program computes, a directory it lists and a data file it reads by a literal without ./ remain the declaration's duty under D065. The binding version stays 2.",
  "evidence": [
    "The verifier's reproduction no longer reproduces: node scripts/harness.mjs bounded -- node docs/evidence/WO-213/ver005-path-alias.mjs exits 1 at its lifecycle-claim step, which reports no passing complete npm test row at the current code identity, because the changed alpha ran fresh and failed instead of being carried (run of 2026-10-17T03:27:47.024Z to 03:27:48.537Z, bounded-result exitCode 1).",
    "Four regressions in scripts/test-runner.test.mjs cover the class and pass with the two existing binding regressions under the bounded wrapper. The command test binds sixteen spellings to the one entry and refuses twenty-nine shapes, and a thirtieth case alias on a volume that ignores case, as this one does, with no fixture path in any reason; it also binds a NODE_OPTIONS module, skips the runner's read-guard preload, refuses another NODE_OPTIONS option and NODE_PATH, BASH_ENV and ENV, and names a tracked parent for an ignored build directory. The end-to-end test runs real children through runGate, coveringGateCheck and requireGateClaims: a changed entry spelled with .. runs again and blocks the complete claim, an unchanged sibling spelled with // and ./ stays carried, and an extensionless entry node resolves itself is never carried. The closure test proves a changed file moves the digest for .mts and .cts chains, a JavaScript file beside its TypeScript source, an ancestor package.json, a ./ spawn literal, a command held in a literal for exec or a shell, a worker URL with and without ./, a renamed require, a loader hook and an absolute file: URL, and that the package-metadata routes refuse until declared. The shipped-declaration regression binds build, compiler, adjacent-queue and codex-continuation as declared.",
    "Three read-only dotln-worker adversaries attacked successive versions with real gate runs in disposable fixtures. The first, against path normalization alone, proved that node resolves words by its own rules (an extensionless main entry, a percent-encoded or query-suffixed --import value, node's own --test patterns, node --test .., an .mts closure, an intake word inside a declared directory, program text). The second, against the shape-based reader, proved a TypeScript source hashed while node ran the JavaScript beside it, a nested package.json flipping a module's type, files read by extension instead of by their interpreter, an ignored link the runner expands, an outside entry, a nested node_modules, unmatched @dotln/ exports, literal loads and a malformed option word reaching a refusal reason. The third proved a command held in a literal, an @dotln/ self-name import without a link, a nested module-relative URL without ./, NODE_OPTIONS in the task environment, main's index.js fallback and an executable type-declaration export. Every retained probe of all three, rerun against this version, refuses or binds correctly: all twenty-six gate-path stale-claim scenarios and both gate-path controls end with the second gate failing, nothing reused and both the coverage reader and the lifecycle claim refusing, and all thirty-four binding scenarios and their two controls move their digest or refuse.",
    "A read-only dotln-worker design reviewer found eleven items in the first version: a symbolic-link message naming the wrong file, comments and messages that misdescribed the code, an unmatched claim rejection in the regression and resolver code that belonged at binder scope. Nine were applied; two were notes needing no change.",
    "Following literals first pulled the ignored installed runtime under .runtime/harness into the build declaration's closure through the tracked hook files it names, and its nested node_modules refused the declaration; literal targets and package checks now read Git's inventory only, and the shipped-declaration regression binds all four again.",
    "No adversary found an existing exposure: no shipped declaration used an affected spelling, the repository holds no .js and .ts sibling pairs, one nested package.json outside every task closure and nested node_modules only under the ignored runtime copies. Deriving the sources of all twenty machinery suites before and after this repair finds no difference: suite selection keeps reading a string literal whole, so a script merely mentioned in text is not a selection dependency, while the binder reads a literal's words. npm test -- --list names 29 suites and npm test -- --review --list 47.",
    "The first targeted run of the twenty selected suites (recorded 2026-10-17T05:03:48.489Z, 996.53 s) passed nineteen and failed runner-fixtures on two cases: selection had begun deriving a script named only inside a string literal, which its selection regression forbids, and the binder refused that fixture's placeholder node -e with an empty program as program text. Selection's whole-literal reading was restored, the binder kept its word reading, empty program text was admitted, and both cases passed with the binding regressions under the bounded wrapper.",
    "The shipped-declaration regression binds the four declared suites in 3.2 to 4.3 seconds across this repair's runs, about its time before the closure changes."
  ],
  "rejected": [
    {
      "option": "Normalize path spellings only, as the first version did",
      "reason": "Node, the shells and the runner resolve a word by rules beyond its text (extension probing, URL decoding, their own patterns, interpreter lines, environment options); a reader that drops what it does not recognise keeps omitting inputs, so the reader admits only shapes it reads and refuses the rest."
    },
    {
      "option": "Reintroduce automatic input analysis or tracing",
      "reason": "D065 records the operator's choice of hand-written declarations; this repair corrects how a declaration is read within that design."
    },
    {
      "option": "Make the shared import reader resolve as node does",
      "reason": "scripts/lib/evidence-sources.mjs is a registered evidence source, so a change re-mints editions, and its src/ reading of @dotln/ imports and its TypeScript substitution serve suite selection. The binder verifies those conventions and over-binds or refuses where they differ."
    },
    {
      "option": "Raise the binding version",
      "reason": "A binding produced by an omission differs in its recorded entries or file digests from the repaired binding of the same command, so no stale result compares equal; a new version would only rerun every carried task."
    },
    {
      "option": "Refuse any closure that names a workspace package by a literal, or follow literals into ignored files",
      "reason": "adjacent-queue's closure holds the bare literal @dotln/skeleton, which node cannot resolve to a file, and the build's closure names hooks that import the ignored installed runtime; refusing either would stop the shipped declarations carrying while binding nothing the code identity holds."
    }
  ],
  "alignment": "The traps are closing only the quoted spellings, keeping a denylist that each new resolution rule defeats, refusing the shipped declarations so the preflight carries nothing, and reopening the operator's declaration design or the registered reader. Read commands by admitted shape, prove each closed member with real child exits and the lifecycle consumers, keep the shipped declarations binding and leave computed paths to the declaration. The NoOp keeps a complete gate that carries a changed failing task. One unexplained failure of the input-bound reuse regression was seen by the first adversary in one of seven runs before a later edit, without captured output; the targeted and complete gates run it again.",
  "reopenWhen": "A declared, reusable binding keeps its digest while a file in Git's inventory that its command spells or its closure names statically changes, an admitted node option is found to read a file, a shipped declaration is refused by these rules, or the input-bound reuse regression fails again."
}
```

## WO-213-D069

```json
{
  "id": "WO-213-D069",
  "date": "2026-10-17",
  "dispatch": "resume: verify; VER-006 independent runtime-import attack",
  "kind": "finding",
  "decision": "Record blocking V6-F1 against criteria 16, 17 and 19. A declared reusable binding omits a statically named module reached by an extensionless createRequire alias or a percent-encoded module-relative URL. After that module changes to exit 13, the complete runner carries its old pass and both coverage and lifecycle consumers accept the claim. The verifier changes no implementation and routes the class within the existing binder and runner surfaces.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-213/ver006-import-routes.mjs: four disposable real-Git scenarios, 3209 ms, exit 0 means the two false admissions and two correct controls were reproduced; ver006-probes.json records only derived results.",
    "The extensionless route uses createRequire(import.meta.url) assigned to load, then load(\"./leaf\"), resolving scripts/leaf.js. The URL route imports new URL(\"./%6ceaf.mjs\", import.meta.url), resolving scripts/leaf.mjs. Each edited leaf exits 13 directly, changes whole-code identity, leaves the declared digest unchanged, is reused by a second complete gate exiting 0, and is accepted by coveringGateCheck and requireGateClaims.",
    "The repaired scripts/../scripts/alpha.mjs command changes its binding and executes its new exit 13, refusing both consumers. Explicitly declaring scripts/leaf.js also invalidates the pass and refuses the claim. These positive controls retain D065 and D068's declaration design.",
    "scripts/lib/task-inputs.mjs namedFiles checks literal spellings against inventory without CommonJS extension resolution or decoding a module-relative URL; relativeImports recognizes a direct require call but not the alias. The new command parser closes equivalent command forms, but these closure routes still omit their loaded file. The focused runner batch passed all 20 selected tests in 27252 ms, including the shipped declaration, changed-entry and new closure tests; those tests do not cover these variants."
  ],
  "reopens": {
    "decisionId": "WO-213-D068",
    "observation": "Its explicit reopening condition occurs: a declared reusable binding keeps its digest while an inventory file named statically by its closure changes."
  },
  "followup": "WO-213 repair V6-F1: bind the resolved file for supported statically named runtime loads, or refuse reuse when the loader spelling cannot be established. Regress extensionless CommonJS alias loads and encoded module-relative URLs through actual failing children, the composed full gate and both claim consumers. Preserve correct aliases, explicit semantic declarations, intake and link containment, conservative unsupported forms, and same-identity fallback for undeclared suites; do not reintroduce the withdrawn automatic analyzer.",
  "rejected": [
    {
      "option": "Pass on the existing closure tests or treat every unresolved static load as computed input",
      "reason": "The actual child proves the statically specified runtime dependency changed, while the declared reusable result and accepted complete claim did not."
    }
  ],
  "alignment": "The traps are checking only the command spelling repaired in VER-005, trusting a digest-only fixture, or reopening the operator's accepted declaration architecture. Use actual child exits and both consumers, with the fixed alias and explicit input as controls. The NoOp would certify another stale passing claim.",
  "reopenWhen": "A repair is ready for independent verification, or another accepted static runtime-load spelling omits its executed module."
}
```

## WO-213-D070

```json
{
  "id": "WO-213-D070",
  "date": "2026-10-17",
  "dispatch": "resume: verify; VER-006 investigation of the displaced complete review row",
  "kind": "finding",
  "decision": "Record blocking V6-F2 against criterion 17 and the existing handoff behavior. The expanded literal closure binds docs/control/current.md into every shipped declared task through scripts/test-codex-session.mjs, including tasks that do not run that status fixture. A normal lifecycle projection change therefore displaces the complete passing gate at unchanged code identity and unchanged build output. The verifier does not restore projections to match the row.",
  "evidence": [
    "At entry, code identity matches the executor's 2026-10-17T06:04:10.935Z review row, which passed 47 suites and 104 tasks. Native coveringGateCheck refuses it and names build, adjacent-queue, compiler and codex-continuation as displaced. Native binder.current returns false for all four; their declared specs are unchanged. Build output still matches its attestation.",
    "ver006-projection-diagnosis.mjs runs a scratch copy of the binder with a read-only single-file hash override. Substituting only the docs/control/current.md hash saved at checkpoint 28 reconstructs each of the four exact recorded task digests; all other source bytes remain current. The final retained diagnostic passed in 13382 ms. The source origin is scripts/test-codex-session.mjs. Checkpoint 28 contains the repairing projection before repair-complete; checkpoint 29 contains ready-to-verify, and the current projection is verifying. No repository byte is changed and this diagnostic supplies no gate claim.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-213/ver006-projection-reuse.mjs: a disposable fresh complete row passes. Changing only the phase text in docs/control/current.md leaves code identity and the actual passing task unchanged, but current coverage and lifecycle claims refuse it. The main gate-reuse module accepts the row before and after the edit. This comparison redirects only that base module's Git and gate-evidence imports to current helpers; it is not a complete base checkout. The probe passed in 684 ms.",
    "The core implementation sources changed since VER-005 are only task-inputs.mjs, machinery-coverage.mjs and test-runner.test.mjs. The recorded row's twelve carried tasks resolve to unique intact passing executions; the row is displaced by the new document dependency, not by a failed task or changed implementation."
  ],
  "followup": "WO-213 repair V6-F2: keep unrelated lifecycle projections out of product-task input bindings while preserving genuine declared semantic inputs and fresh coordination-document validation. Regress a real complete pass through repair-complete and the next verify dispatch, then require coverage and lifecycle reuse at unchanged code/build inputs. Do not restore historical projection bytes, drop genuine semantic inputs indiscriminately, or repeatedly rerun the complete gate to hide the coupling.",
  "reopens": {
    "decisionId": "WO-213-D068",
    "observation": "The new literal-closure reach imports a changing control projection through an unrelated fixture and makes the just-filed passing gate stale across the required lifecycle transitions."
  },
  "rejected": [
    {
      "option": "Restore the earlier projection or accept the displaced row as current",
      "reason": "The canonical current projection is correct, and the claim reader explicitly refuses the recorded inputs. A fresh gate is the only authorized way to establish a new current row."
    },
    {
      "option": "Treat repeated full gates after every lifecycle transition as the intended validation flow",
      "reason": "The operator's criterion 17 removes repeated validation of unchanged product work, and the base coverage boundary preserves the passing row under the same document-only edit."
    }
  ],
  "alignment": "The traps are blaming code drift without checking identity, calling every conservative input expansion harmless, or making a stale row pass by restoring old bytes. Compare native coverage, unchanged build output and exact single-input hashes, then reproduce the boundary in an isolated fixture. The NoOp forces repeated validation for lifecycle bookkeeping.",
  "reopenWhen": "The repaired complete gate remains valid through ordinary lifecycle projection updates, while actual declared input edits still invalidate it."
}
```

## WO-213-D071

```json
{
  "id": "WO-213-D071",
  "date": "2026-10-17",
  "dispatch": "resume: verify; operator challenges the repeated full gate because the code has not changed",
  "kind": "finding",
  "decision": "Record blocking V6-F3 against criterion 17: ordinary executor-to-verifier environment differences invalidate unchanged product work instead of reusing it. The operator explicitly clarified that these invalidation causes are failures of the required reuse behavior. The verifier's initial follow-up classification and blanket rerun were errors. The code identity matches the earlier passing review. Four declared bindings were displaced by the lifecycle projection (D070); the new invocation separately rejected ninety execution contracts because inherited Git, locale and PATH values differed. After the operator challenged the rerun, the verifier stopped its own gate and preserved the earlier execution and all evidence. No implementation is changed and no stopped execution is claimed as a pass.",
  "evidence": [
    "The review runner reported: GIT_EDITOR removed, GIT_PAGER added, LC_ALL added, LC_CTYPE added, PATH changed, for ninety tasks. It separately named build, compiler, adjacent-queue and codex-continuation as changed declared bindings. No Node runtime, task declaration or active-order/resource-context change appeared in that contract explanation.",
    "scripts/lib/suite-evidence.mjs taskEnvironment and suiteEnvironment retain and bind the filtered inherited environment for every task. The filter keeps all GIT_ names, the named locale categories and the resolved search path; it does not establish which retained variables a particular task reads. Its evidence stores hashes, not historical raw environment values.",
    "node scripts/harness.mjs evidence --stop exited 0 and reported the owned test-runner stopped with active: []; the runner exited 1 after 1506.0 seconds with no check recorded. Its interrupted and skipped tasks establish no new complete result. The stop was the verifier's corrective action after the operator's objection, not a claim that the operator requested cancellation of verification.",
    "After stopping, gateCodeIdentity still equals the prior passing review's identity. The latest npm test row remains the 2026-10-17T06:04:10.935Z pass: 47 suites, 104 tasks, 92 fresh and 12 carried, 1395697 ms. The fresh document row remains the 2026-10-17T11:39:39.323Z pass: 35 fresh tasks, 173451 ms.",
    "The operator then explicitly directed that the invalidation causes themselves mean failure. The verifier corrected the environment finding from follow-up to blocking in the unfiled report and this decision; no additional product gate was launched."
  ],
  "followup": "WO-213 reuse repair: establish a stable execution environment for ordinary cross-session validation, or bind the environment inputs a task actually depends on. Prove executor-to-verifier reuse for unchanged code and genuine semantic inputs across the ordinary Claude/Codex shell differences. Preserve invalidation when a changed executable, Node option, Git behavior or locale actually changes a task's meaning; do not simply discard all environment checks. Explain invalidation before starting expensive replacement work.",
  "rejected": [
    {
      "option": "Continue the entire rerun merely because the current reader refuses reuse",
      "reason": "That refusal is itself under verification, the code identity is unchanged, and the verifier had not established the semantic relevance of the five environment differences."
    },
    {
      "option": "Declare every environment difference harmless or restore historical values to force a claim",
      "reason": "The available evidence does not establish harmlessness for every task, and the historical raw values are not in the stored contract. The original execution is retained without inventing an equivalent environment or overriding a claim."
    }
  ],
  "alignment": "The trap was treating a conservative reader's refusal as sufficient reason to repeat all product work while that reader was the subject of verification. Diagnose the invalidated parts first, distinguish observed code changes from contract changes, stop unjustified replacement work, and report the unavailable current claim honestly. The NoOp would continue the repeated gate the operator had challenged.",
  "reopenWhen": "A repair establishes cross-session reuse under a controlled equivalent task environment, or a bounded execution proves one of these particular environment differences changes a required task's behavior."
}
```

## WO-213-D072

```json
{
  "id": "WO-213-D072",
  "date": "2026-10-17",
  "dispatch": "resume: fix; the operator directs undoing the validation-system scope expansion (criteria 15 to 19)",
  "authorization": "Paraphrase of the operator's directions during this repair: undo every change related to the order's new gate and testing criteria. Asked whether that meant criteria 15 to 19 only, criteria 10 and 11 as well, or a rollback to checkpoint 15, the operator chose criteria 15 to 19 only. The operator then asked for at least ten and up to twenty independent workers to check that the undo is correct and that the original order and its fixes are in place, and for every idea and attempt to be documented so that a planning pass can understand them and design something better.",
  "decision": "Withdraw the 2026-10-16 validation-system expansion from this order: criteria 15 to 19, the two scope-expansion sections (validation reliability; parallel targeted validation) and the rewritten Preflight paragraph leave the order, which returns to its text before that expansion. Every code file changed after the expansion returns to its bytes at the last gate rows recorded before it, and scripts/lib/task-inputs.mjs, scripts/lib/module-fixtures.mjs and the two wo213 role-baseline fixtures are removed; product 07's validation and preflight text, the executor's generated guidance and the authority edition selection (revision 005) return with them. Then the declaration D039 rejected as its NoOp is applied: harness-fixtures declares scripts/lib/control-store.mjs, which its journal-read failure case rewrites. Criteria 1 to 14, the instance-validation expansion and every repair made before the validation expansion stay. Three changes made under D039's authority that also correct older behaviour are withdrawn with the rest and routed to planning: D042's control of the host health sample inside the wo107-schema fixture, D064's guard against an import-reader lexer token that does not advance (with its shell-literal handling in machinery coverage), and D055's rule that a task execution with an impossible future finish cannot outrank a later failure. The generated console fixtures and harness surfaces are regenerated from the restored sources. Filed records stay as written: D039 to D071, VER-003 to VER-006 and their evidence describe mechanisms the subject no longer contains, and docs/evidence/WO-213/validation-expansion-history.md gives planning one account of every idea, attempt, measurement and failure. The complete gate is again one fresh npm test -- --review after the order's Preflight suites, with no task carried across a code change.",
  "evidence": [
    "Checkpoint refs/dotln/checkpoint/WO-213/31, recorded by this fix dispatch at 2026-10-17T12:13:35.448Z, holds the complete worktree before the undo; until the undo began, the only later differences were the dispatch's own three projection files.",
    "No checkpoint separates the second repair's earlier work (D031 to D038) from the expansion: checkpoint 15 precedes both and checkpoint 16 follows both. The pre-expansion state was therefore rebuilt in a scratch copy from checkpoint 15's tree by replaying, in order, the second repair session's recorded patch calls (one, refused by that session's own tool, skipped), its inline text substitutions on scripts and its formatting runs, all made before the operator's expansion request at 2026-10-16T04:20:58Z; patches were read from the session transcript as data. The session made no code edit between its last gate rows and that request.",
    "The rebuilt tree object is a69240cca9f81959ee365c83766f6e51cbc1f2df. Its code identity is e5d529961f02e7fc6bc8287b202969fd4a30bb0029b69276096cb685f441ce88, equal to the suite:skeleton row (2026-10-16T03:51:55.868Z) and the npm run test:docs row (2026-10-16T03:53:53.848Z), the last gate rows before the expansion. After those bytes were written into this worktree, its own code identity was the same value; with the declaration below it is b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3, and the same worktree with only scripts/test-runner.mjs taken from the rebuilt tree computes e5d529961f02e7fc6bc8287b202969fd4a30bb0029b69276096cb685f441ce88 again.",
    "Compared with the worktree before the undo, the rebuilt tree differs in 20 code files (5,578 lines the expansion added and 793 it removed), all of the runner, gate reuse, suite evidence, input binding, the bounded wrapper, machinery coverage, planning performance conditions over targeted rows, the guidance loadout, the wo107-schema fixture and their tests; in four documents: the order's criteria 15 to 19 with their sections and Preflight text, product 07's validation text, the selected authority revision and the publication lock that follows product 07; and in generated outputs the replay did not regenerate. Those, the four console fixture files and the harness surfaces, keep D038's pre-expansion re-pin to feedback-003 and re-emit against runtime snapshot f1d23b083e021b53, regenerated here from the restored sources.",
    "At the restored code the isolated machinery coverage case reproduced exactly the failure D039 recorded (harness-fixtures: uncovered scripts/lib/control-store.mjs) and passed after the declaration. node scripts/harness.mjs check reports 34 generated surfaces after the rebuild and emit, and the authority, artifact-identity, verification and feedback edition checks pass with authority revision 005 selected.",
    "Seventeen read-only dotln-worker agents ran: thirteen verifiers, one per batch (expansion code and guidance remnants; criteria 1 to 4, 5 to 9, 10 and 11, 12 to 14; the findings of VER-001, VER-002, FINAL-001 and FINAL-002; the classification of D040 to D071 and VER-003 to VER-006; provenance; records; gate risk; hunk-level precision), and four researchers of the expansion's history. No verifier found criteria 1 to 14 behaviour, a pre-expansion repair or an instance-validation fix lost. They found the generated-output count corrected above, the three withdrawn fixes of older behaviour now named in the decision, stale current-state records (the evidence README, the register rows of D043 to D071 and the handoff) and the verbatim quotation this authorization now paraphrases; each is corrected.",
    "At code identity b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3 the order's Preflight suites plus runner-fixtures, launchpad and launchpad-planning passed one at a time under the bounded wrapper (2026-10-17T12:36:26Z to 13:17:07Z), and npm test -- --review passed fresh: 46 suites, 103 tasks, 0 failed, 2976.26 s, recorded 2026-10-17T14:06:48.986Z. Release preparation then reported the v0.83.0 target current without changing that identity."
  ],
  "rejected": [
    {
      "option": "Roll back to checkpoint 15",
      "reason": "It also discards the repairs of the second final review's findings (D031 to D038), which the operator kept by choosing criteria 15 to 19 only."
    },
    {
      "option": "Also withdraw criteria 10 and 11, the instance gate boundary",
      "reason": "The operator declined that option."
    },
    {
      "option": "Reverse the expansion by editing the current code by hand",
      "reason": "5,578 added and 793 removed lines across 20 code files have no exact hand-made target: a hand reversal could leave expansion behaviour or remove earlier repairs, and nothing would check its completeness. The rebuilt state is checked against a recorded code identity."
    },
    {
      "option": "Keep the expansion-era fixes of older behaviour (D042, D064's lexer guard, D055's future-finish rule) as adjacent repairs",
      "reason": "Each was made within D039's authority while building or validating the expansion, and the operator's direction withdraws the changes related to the new gate and testing criteria; keeping them would rest on the executor's judgment instead of that direction, so each is routed to planning in the follow-up below."
    }
  ],
  "reopens": {
    "decisionId": "WO-213-D039",
    "observation": "The operator withdrew the expansion D039 authorized, with D040 to D071's mechanisms; the declaration D039 rejected as its NoOp is applied instead."
  },
  "followup": "Planning: read docs/evidence/WO-213/validation-expansion-history.md, the account of every idea, attempt, measurement and failure of the withdrawn validation expansion, and decide whether and how to meet its goals (no late bookkeeping failures, no paying twice for preflight and complete runs, fast failure feedback) with a design that avoids the failure classes it records. Decide too the three withdrawn fixes of older behaviour: wo107-schema's two watchdog cases refuse before spawning under host memory pressure 2 (D042); the import reader's lexer can stop advancing on shell text or malformed JavaScript (D064), latent while the only machinery shell entry has no comment; a task execution with a future finish can outrank a later failure in gate reuse (D055).",
  "alignment": "The traps were widening the undo into earlier repairs and narrowing it by keeping pieces of the expansion judged useful; the operator chose criteria 15 to 19, so every change made under that expansion's authority goes and nothing older does. A second trap was approximating the earlier state; the restored code is checked against a recorded code identity. The NoOp leaves the expansion and VER-006's three open failures in place against the operator's direction.",
  "reopenWhen": "The operator or a planning pass re-authorizes task-level reuse, derived dependency discovery or combined targeted validation, or the restored state fails a check that passed at its code identity before the expansion."
}
```

## WO-213-D073

<!-- integration refs/dotln/checkpoint/WO-213/36 -->

```json
{
  "id": "WO-213-D073",
  "date": "2026-10-17",
  "dispatch": "resume: final review; worktree integrate WO-213",
  "decision": "The integration took in main's two commits since the base, 941db60c and 68f58127, the 2026-10-16 ideation's fourteen register rows with its lineage, map and history projections: the uncommitted branch fast-forwarded to 68f58127 with no merge commit, no authored conflict arose, the follow-up register was the one projection resolved by union (main's fourteen new rows and the branch's rows both present, the one rewritten revision kept), and no component version collides. Every acceptance claim VER-007 judged carries forward unchanged at the same code identity b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3: main's commits touch documents only, the regenerated runtime, hook bundle and manifest (snapshot f1d23b083e021b53 unchanged), control projection, release preparation, decisions index, register, work-order index, sibling registry, publication locks and console fixtures are projections of the same subject, and the executor's passing npm test review row at that identity remains the product-gate evidence. No registered evidence source changed in the integration, so no edition is re-minted and no live episode is owed.",
  "evidence": [
    "refs/dotln/checkpoint/WO-213/36",
    "base 7b66f8b303a316ff4560b4827d6dc728cd7f504a",
    "upstream 68f58127d4c954c96199518ee2dcf362734be5ef",
    "release preparation: WO-213 target v0.83.0 remains current. Files changed: docs/evidence/WO-213/meta.json, docs/final-reviews/WO-213/PR.md. Meter snapshot: docs/evidence/WO-213/meta.json, 4680 bytes. Tag observation: local snapshot only.",
    "git diff --stat 7b66f8b3..68f58127 names five document paths (docs/lineage/README.md, docs/lineage/idea-ledger.md, docs/planning/followups.json, docs/planning/work-order-map.md, docs/work-orders/HISTORY.md) and no code, so no registered evidence source and no code-identity input changed; gateCodeIdentity reads b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3 before and after, and the harness manifest selects runtime snapshot f1d23b083e021b53 before and after.",
    "The executor's npm test review row at that identity (46 suite results, 103 fresh tasks, exit 0, 2,976.3 s, recorded 2026-10-17T14:06:48.986Z, evidence host-gate:b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3:npm test) is the one covering candidate for the current 46-suite review selection with nothing missing or displaced, read through coveringGateCheck after the integration; the verifier's document gate (35 of 35, recorded 2026-10-17T14:27:17.060Z) stands for the pre-integration tree and this review runs its own at the integrated tree, recorded in FINAL-003.",
    "Register union compared as JSON: main holds 1,129 entries (14 added since the base) and the integrated register 1,154; every main entry is present, 1,114 byte-identical, 14 with dispositions this order's reviews appended, and FUP-de6162b279f66709 differs only in revision 1's summary (700 to 680 characters, the digests register-correction.json records); the register holds no home-directory match.",
    "Affected checks run bounded on the integrated tree at 17:04:54 to 17:05:16 UTC, each exit 0: npm run publication:check (both editions current), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (v0.83.0 over v0.82.0, every surface PASS), lineage (173 sections), work-order and sibling index checks, publication locks, format:check, plan check and meta --check; git diff --check and git diff --cached --check clean. The review gate on the integrated tree is recorded in FINAL-003.",
    "Local tags end at v0.82.0 and git ls-remote --tags origin lists no v0.83 tag, so the release block v0.83.0 collides with nothing; compiler 0.27.1, skeleton 0.59.1 and harness host 0.35.2 are the executor's declared patches (D013), unchanged by the integration."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-17. Original base: `7b66f8b303a316ff4560b4827d6dc728cd7f504a`.
Fetched main: `68f58127d4c954c96199518ee2dcf362734be5ef`. Checkpoint: `refs/dotln/checkpoint/WO-213/36`.
Named stash retained: `ed7dba61173f4fe47679f2821a7d52daea430757` (WO-213 integrate 2026-10-17).
Resolved projections: docs/planning/followups.json.
Release preparation: WO-213 target v0.83.0 remains current. Files changed: docs/evidence/WO-213/meta.json, docs/final-reviews/WO-213/PR.md. Meter snapshot: docs/evidence/WO-213/meta.json, 4680 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim VER-007 judged, criteria 1 to 14, carries forward unchanged; the integration changed no judged byte, and code identity `b4079082…` is the same before and after.
Authored conflicts observed: none.
Affected checks: publication, harness, release surfaces, lineage, work-order and sibling indexes, publication locks, format, plan and meta checks ran bounded on the integrated tree and passed; the review gate is recorded in FINAL-003's Executed checks.

## WO-213-D074

```json
{
  "id": "WO-213-D074",
  "date": "2026-10-17",
  "dispatch": "resume: final review; FINAL-003; three read-only reviewers; operator direction during the review to board a theoretical issue rather than fail on it",
  "kind": "finding",
  "decision": "Pass the final review of WO-213 at the integrated subject, code identity b407908294cb66bc8010ab8dea5f66095dde8971cecb2b1e2d6236640b9efcf3, the identity VER-007 judged; integration took in main's two document-only commits and changed no judged byte (D073). All fourteen criteria are met. No finding blocks: the one candidate the reviewers raised as possibly blocking, the document listing refusing a dangling or unreachable Markdown or record entry by repository-relative path where main skipped it silently, is the refusal D033 records and the docs-check fixture pins, which VER-003 and VER-007 judged under criterion 1; its consequence is one clean document-gate refusal with a remedy, and the only route to it this review found is an editor lock link no repository rule anticipates, so it is boarded with its rule. Six follow-ups are boarded with their repair rules, four present in the verified subject and two outside the order's surfaces; three record statements that still presented withdrawn or superseded work as current are corrected in place by this review and listed in FINAL-003; the PR body and release notes are rewritten for the reviewed subject.",
  "evidence": [
    "docs/final-reviews/WO-213/FINAL-003.md: criterion judgments, the findings block, the register pass and Executed checks.",
    "D073 (integration fast-forwarded to 68f58127 with no conflict; the register unioned; identity unchanged); VER-007 (pass) at code identity b4079082; the executor's fresh npm test -- --review row at that identity (2026-10-17T14:06:48.986Z, 46 suite results, 103 fresh tasks, exit 0, 2,976,262 ms), read through coveringGateCheck after the integration as the one covering candidate for the current 46-suite selection with nothing displaced.",
    "F1, reproduced by this reviewer on a scratch copy of the subject with an untracked dangling link named like an editor lock file under docs/evidence/WO-213: the subject's node scripts/docs-check.mjs exits 1 with 'docs/evidence/WO-213/<lock file>: document is not a readable regular file (ENOENT); replace the link or restore read permission, or move it out of the document roots' and prints no absolute path, while main's checkDocs (git archive HEAD, run on the same copy) reports only the six link failures the drafts' not-yet-written anchors cause; the record-screen reviewer's fixture probe found the same for a Markdown link to a file outside the repository (OUTSIDE_ROOT), a tracked document whose parent became a file (ENOTDIR, with no remedy text, from documentEntry in scripts/lib/paths.mjs lines 24 to 33) and a tracked document in a directory without search permission (EACCES), each skipped silently by main. D033 records dangling entries as refused and scripts/test-docs-check.mjs asserts the refusal for a dangling decision, product document and record; VER-003 and VER-007 judged those fixtures under criterion 1. The repository's ignore files name no editor lock pattern.",
    "F2 (the instance-gate reviewer, confirmed by this reviewer's reading): scripts/test-runner.mjs line 703 calls buildSuite(root) at module load and buildSuite calls isKitRoot, which throws from packages/skeleton/src/runtime-inputs.mjs for a package tsconfig.json that is a link or a directory and for a KIT-MANIFEST.json that is a link; in an exported kit every runner invocation, --list and --only included, then exits 1 with an uncaught stack whose frames carry absolute paths, where main selected (core's rows for the directory case, the kit's for the link case); scripts/lib/worktree-integration.mjs line 385 and scripts/release.mjs lines 1547 and 1589 test the kit with existsSync and hasPackageSources instead, the integration's outside the run() boundary D037 established.",
    "F3 (the instance-gate reviewer; VER-003 recorded the same route as an observation): a non-metadata file added inside a carried package's dist makes node scripts/harness.mjs check fail naming an unrelated pinned file, the printed remedy's emit rewrites the tracked surfaces to a snapshot holding the stray file, and scripts/lib/release-kit-runtime.mjs refuses 'Selected harness snapshot cannot be reproduced from the carried runtime' naming no path; D032's rule that ignored runtime bytes count is deliberate, the defect is the diagnosis.",
    "F4 (the instance-gate reviewer): in an exported kit, replacing node_modules/@dotln/kernel with a link to an altered copy of the package leaves harness check, launchpad verify and gateInstanceInputDigest passing with the digest unchanged, because gateInstalledInputRoots lists node_modules while the digest visits only the .runtime roots and the packages; main had the same gap.",
    "F5 (the dispatch reviewer): packages/skeleton/src/harness-host.ts reads the whole session state at hook start (line 4343) and writes it back whole (lines 4626 and 4659) without a lock; with an injected concurrent PreToolUse for another call 90 to 140 ms after the dispatch's PostToolUse, 2 of 12 trials returned the binding's message while the persisted role stayed null; main had the same unlocked read-modify-write and no binding to lose. Whether the host runs a parallel call's PreToolUse concurrently with this PostToolUse was not observed.",
    "F6 (the record-screen reviewer): scripts/lib/target-publish.mjs, which publishes a target order's code commits, pull-request title and generated body, references no private-path rule and is unchanged by this order; criterion 6 names only the two WO-210 writers and the order's Design scopes the target screens to them.",
    "Earlier findings reproduced closed on the current bytes by the three reviewers and this reviewer: FINAL-001 F1 (one setter of releaseCloseDispatch in source line 988 inside recordDispatch, compiled line 601, the active snapshot f1d23b083e021b53 byte-identical to dist; a CLI release-close binding leaves the publish helper refused), F2 (200,000 generated strings and this reviewer's 15 adversarial inputs stable, match-free and never longer), F3 to F9, F11 to F15, F17 and F18; FINAL-002 F1 to F5, F7 to F10; VER-002 V2-F1 (D027). FINAL-001 F10 and F16 stay deferred on FUP-6125f53234c75af3, and the Stop complete-scope limit D023 and D024 recorded stays there (the dispatch reviewer reproduced it with a --work-order binding).",
    "The undo (D072), checked by the dispatch reviewer and this reviewer: git diff --stat against the rebuilt tree a69240cca9f81959ee365c83766f6e51cbc1f2df on code paths lists the control-store declaration, the four re-pinned console fixtures and the three untracked modules byte-identical to the tree's copies; the expansion's modules and role-baseline fixtures are absent; suite-evidence.mjs, machinery-coverage.mjs, bounded-command.mjs, contributor.ts, wo107-schema.test.mjs and test-runner.test.mjs equal main or the tree; the order's criteria end at 14 and product 07 carries no expansion text; each of the three withdrawn fixes addresses a defect main has (the live health sampler in the watchdog fixture, the lexer with no progress guard, the unbounded finish clock in gate reuse), so their absence regresses nothing main had.",
    "Record corrections made by this review and listed in FINAL-003: docs/evidence/WO-213/README.md names the second repair's decisions as D031 to D038 with D039 to D042 assigned to the withdrawn expansion, points two superseded 'in the handoff' references at D038, D042 and VER-003, and says linked-worktree metering where it said recovered metering (D024's reopening of D017); docs/evidence/WO-213/self-review.md opens its validation-redesign section with a withdrawn note naming D072. No filed report, decision or behavioral source was edited.",
    "Reviewers: three read-only dotln-worker agents (claude-opus-5-5, xhigh by definition; no effective-effort readback), batched over the record screen and planning writers, the instance gates, runtime and release names, and the dispatch binding with the undo's integrity; each ran its probes in its own temporary directory, wrote nothing under the worktree, ran no gate and spawned nothing; the usage readback observed 3 admissions of 20 (exact-observed)."
  ],
  "rejected": [
    {
      "option": "Fail the review on F1 because a probe shows a behavior main had changed",
      "reason": "Product 07 routes a change that breaks a behavior main had as blocking when it is a regression a probe shows; this change is the refusal the order's own D033 records and pins by fixture, judged under criterion 1 by two verifications, with a clean relative-path refusal and a remedy as its only consequence, and the one route to it is an editor artifact no repository rule anticipates. Precedent in this order routes a deliberate recorded narrowing (D032, VER-003) and a behavior change no supported route reaches (FINAL-001 F3 and F5) as follow-ups. The operator directed during this review that a theoretical issue be boarded rather than failed on; the judgment rests on the evidence above and agrees with that direction."
    },
    {
      "option": "Fix F1 or F2 in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; both change the code identity and belong to a later order or repair."
    },
    {
      "option": "Leave the stale record statements for planning",
      "reason": "They misdescribe the reviewed subject in the order's own evidence directory, the correction is a few lines of documentation that changes no judged byte, and the corrected lines are listed in the report so no reviewer self-fix goes unlisted."
    }
  ],
  "followup": "Planning, or the next order that edits these surfaces. (F1) scripts/docs-check.mjs documentFiles and scripts/lib/paths.mjs documentEntry: decide whether an untracked dangling symbolic link under a document root is skipped as holding nothing to screen or refused as a declared entry, record the choice beside D033 with the editor lock-file case, give documentEntry's ENOTDIR and EACCES refusal the same remedy text as readDocumentInput, keep refusing a tracked entry the screen cannot read and a target outside the repository, and add a fixture for the lock-file link; consider ignoring editor lock patterns in the repository's and the kit's ignore files. (F2) scripts/test-runner.mjs: compute the build row after module load, or catch the kit predicate's refusal at the runner's entry and print its relative message alone, so a malformed kit declaration refuses by relative path in --list and --only too; use isKitRoot at scripts/lib/worktree-integration.mjs line 385 and scripts/release.mjs lines 1547 and 1589, the integration's inside its run() boundary, with a fixture for a package tsconfig.json that is a directory and a KIT-MANIFEST.json link. (F3) scripts/lib/harness.mjs checkHarness and preserveHarnessRuntime: compare the manifest's selected snapshot name with the recomputed one before the pinned-file loop and name the extra or missing inventory paths in the refusal, so an added file in a carried dist is named and the remedy does not bake it into the next snapshot; scripts/lib/release-kit-runtime.mjs names the differing paths. (F4, new scope) packages/skeleton/src/gate-evidence.mjs: bind the targets of the root node_modules/@dotln workspace links in the instance input digest, or record the limit beside D014 with the fixture that redirects a link to an altered package. (F5) packages/skeleton/src/harness-host.ts: write a CLI dispatch binding under the session file's lock or re-read the state immediately before writing it, with a fixture that interleaves another hook event between the observer's read and write. (F6, new scope) scripts/lib/target-publish.mjs: decide whether the episode route's commit messages, title and generated body take the Markdown private-path rule before the push and the forge call, as the planning publication now does.",
  "reopenWhen": "A planning pass allocates these items, an operator decision keys the document listing's treatment of dangling entries, or a later gate meets one of the six routes above."
}
```
