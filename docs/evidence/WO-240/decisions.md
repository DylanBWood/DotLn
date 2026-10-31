# WO-240 decisions

## WO-240-D001

```json
{
  "id": "WO-240-D001",
  "date": "2026-10-31",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.105.0, the next minor above the observed release baseline v0.104.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.104.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-240-node-24-beside-node-26.md"
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

## WO-240-D002 — Declare both Node lines and read the range without a dependency

```json
{
  "id": "WO-240-D002",
  "date": "2026-10-31",
  "dispatch": "resume: next; steps 1 and 2",
  "decision": "engines.node reads ^24.15.0 || ^26.0.0 in the root package.json and all six packages/*/package.json, and npm install --package-lock-only regenerates the lockfile's seven workspace entries. scripts/lib/node-engines.mjs judges a version against that field with no new dependency. It reads only ^major.minor.patch alternatives joined by ||, treats every prerelease as outside, refuses a version, a range or a package file it cannot read by naming what it read, treats an absent or null field as no constraint, as npm does, and treats an absent file as declaring nothing, where npm itself stops. The prerelease rule is stricter than npm: its engine check admits 24.16.0-rc.1, and this field names lines a gate has passed on. judgeRunningNode judges the running Node against the package file of the checkout whose scripts are running.",
  "evidence": [
    "git diff -U0 package-lock.json: seven lines removed and seven added, all engines.node; no version, resolved or integrity line changed.",
    "The reader's fixture in runner-fixtures admits 24.15.0, 24.22.2, 26.0.0, 26.9.0 and v26.9.0; refuses 22.2.0, 24.14.9, 25.9.0, 26.0.0-rc.1, 27.0.0 and v24.15.0-rc.1; refuses not-a-version, the empty string, 24.15, 24.15.0.1 and 24.015.0 by name; places a floor by its minor and patch with ^24.15.3; refuses the ranges >=26.0.0 <27, ^0.2.3, ^024.15.0, ^24.015.0, ^24.15.00, ^24.15, 24.15.0, a dangling ||, the empty string and 7 by name; gives a malformed file, a literal null document and a directory at package.json their own could-not-be-read refusal; and reads a field that is null as no constraint, as npm does.",
    "npm's engine check uses includePrerelease: under the range it admits 24.16.0-rc.1 and 26.10.0-nightly20261001abc and refuses 24.15.0-rc.1 with EBADENGINE."
  ],
  "rejected": [
    { "option": ">=24.15.0 <27", "reason": "It admits Node 25, which no gate runs under; the order rejects it on that axis." },
    { "option": "A semver dependency", "reason": "The order admits no new dependency, and the kit declares one form." },
    { "option": "Admitting a range the reader cannot read", "reason": "A host check that silently judges nothing is worse than a refusal naming the line to change." }
  ],
  "reopenWhen": "An instance that kept an edited package.json reports its older range refused, or the kit needs a range form this reader does not read. The kit README names that refusal and its remedy."
}
```

## WO-240-D003 — Outside the range the host task leads, because it is otherwise never reached

```json
{
  "id": "WO-240-D003",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 2",
  "decision": "checkHost refuses a Node outside the root range. Outside the range the host task also leads the structural phase, so it is the gate's first and only task and the stale-runtime build does not run. Inside the range the six tasks keep product 07's order. The runner passes scheduleSuites a structuralOrder; the judgment itself lives in one reader that checkHost, the runner and the harness share. A failure during gate startup on such a Node names the range too, because no task can.",
  "evidence": [
    "Unchanged code under the real Node 22.2.0 installed on this host: PASS format, configuration-root and registrations, then FAIL declarations with require() of ES Module node_modules/typescript/dist/ast/index.js not supported, then SKIP generated and SKIP host. A comparison placed only in checkHost is never reached on this machine, though the objective says the gate refuses at its first task.",
    "The same command after the change: FAIL host first, naming v22.2.0 and the range; SKIP every other task; exit 1.",
    "hostAdmitted in scripts/lib/dispatch-bound.mjs counts a complete run only when the host task exits 0, so a runtime refusal consumes no dispatch run.",
    "runner-fixtures: a Node outside the range makes the host task the gate's first and only task, running the real structural-checks host command under a stubbed process.version. The same fixture carries a stale runtime, which compiles inside the range and does not compile outside it.",
    "The real Node 21.4.0 on this host: FAIL host first, then SKIP the rest; harness check refuses.",
    "The real Node 20.10.0 on this host: import.meta.dirname is undefined below 20.11, so the runner's native launcher throws before any task can start and only the path error printed. The runner's entry now prints the same refusal above the raw error, confirmed on that real Node, and a fixture pins it through a listing that opens no gate on this checkout. An in-range failure prints exactly what it did."
  ],
  "rejected": [
    { "option": "Leaving host sixth", "reason": "The observed run never reaches it; the refusal would pass every fixture and never appear." },
    { "option": "Moving host first for every run", "reason": "It changes product 07's stated order, and a later format failure would become an admitted run that consumes a complete run." },
    { "option": "A separate refusal at the runner's entry with no row", "reason": "It records no host refusal and duplicates the check." }
  ],
  "reopenWhen": "A supported runtime change makes the structural order matter inside the range. Boundary: a Node too old to parse the runner's modules fails in its own loader, which no check here can precede; no such Node is on this host, so that case is unobserved."
}
```

## WO-240-D004 — Add the comparison harness check was said to make

```json
{
  "id": "WO-240-D004",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 6",
  "decision": "node scripts/harness.mjs check and harness evidence refuse a Node outside the range as their first step, and emit, evidence --stop and evidence --wait stay open on any Node. Through npm run harness the entry prepares the runtime before that step, so a direct node invocation is the form that refuses before anything runs. Step 6 orders the sentence that harness check and every gate refuse another runtime, while the Cost line names only checkHost, and at the base harness check compared nothing. The comparison is added rather than the sentence narrowed, because the recipe ends at that command. harness evidence is added because it can report a pass from a cached row without starting a host task. Both read the range of the checkout whose scripts run, never the working directory's, so a target repository's own engines field is not judged. The target gate runs the target's own declared checks and does not judge Node, and the sentence says so in place of every gate.",
  "evidence": [
    "scripts/harness.mjs at the base has no version comparison in its emit, check or remove path.",
    "Under the real Node 22.2.0, node scripts/harness.mjs check prints the refusal naming v22.2.0 and the range and exits 1.",
    "runner-fixtures: harness check refuses under a stubbed v22.2.0 while emit to a scratch directory exits 0, which is what keeps bootstrap unaffected.",
    "runner-fixtures: from a repository whose package.json reads >=18, harness check --target names no engines field; harness evidence under a stubbed v22.2.0 refuses naming this checkout's range; evidence --stop exits 0."
  ],
  "rejected": [
    { "option": "Narrowing the README sentence to gates", "reason": "On Node 22 the recipe's last command would pass with only npm's warning, which is the surprise the objective excludes." },
    { "option": "Refusing emit as well", "reason": "Bootstrap runs emit, and the order keeps bootstrap unaffected." }
  ],
  "reopenWhen": "The kit README stops naming harness check as a refusing command."
}
```

## WO-240-D005 — Put the selected runtime first on every gate child's PATH

```json
{
  "id": "WO-240-D005",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 2, the children criterion",
  "decision": "suiteEnvironment puts dirname(process.execPath) first on every gate child's PATH, which is the convention drive-worker, source-change-worktree, verification-worktree and discovery already use. A suite, shell script, shebang or npm script that finds node or npm by name then gets the running runtime. harness-entry's build child starts from process.execPath instead of npm. The search found no bare node spawn in production sources, so the literal change there is empty; the real exposure is name lookup, which one line closes for every gate child.",
  "evidence": [
    "Search of scripts/ and packages/ for the quoted token node across .mjs, .ts, .js, .cjs, .json and .sh: no production spawn. The hits are scripts/lib/drive-diagnostics.mjs (a program inventory), packages/skeleton/src/console-commands.ts (text the permission classifier judges, used only as tool_input by console-loopback.ts), the harness classifiers, and tests and fixtures that declare a target repository's argv or pass command text to a classifier. packages/skeleton/src/feedback-audit.ts and scripts/release.mjs build display text, and the live probes write hook commands a host runs.",
    "Shell suites hold over 100 bare node lines (scripts/test-resume.sh, test-worktree.sh, test-checkpoint.sh, test-release.sh and others). They run as gate children, so PATH decides them.",
    "npm children of the gate: the format task, license-surfaces and the launchpad fixture. npm finds its own interpreter and its lifecycle node by name, so PATH decides them too.",
    "scripts/build.mjs starts tsc from process.execPath; generated-artifacts runs its checks and the runtime build from process.execPath; bootstrap's emit and browser steps already use it.",
    "The native helper preparation in scripts/lib/host-resources.mjs spawns /usr/bin/xcrun and clang or cc only; it starts no Node.",
    "runner-fixtures: a gate child that finds node or npm by name runs on the selected runtime, with a decoy node and npm first on the inherited PATH, through a shell lookup and through /usr/bin/env.",
    "The recorded runs in WO-240-D010 carry a PATH holding exactly one node."
  ],
  "rejected": [
    { "option": "Rewriting every bare node line in the shell suites to a variable", "reason": "Over 100 test lines change and a new line can regress; the environment fixes them all and a fixture pins it." },
    { "option": "Converting every npm spawn to a direct script", "reason": "npm ci has no direct form, and a stubbed npm is what several release fixtures observe." }
  ],
  "reopenWhen": "A gate child starts with a PATH that does not derive from suiteEnvironment, or a route outside the gate needs the same guarantee. Bootstrap, sync, worktree finish, worktree integrate, measure-gates and harness evidence's own npm test find npm by name and inherit the caller's PATH, so an absolute-path interpreter with another Node first on PATH can split them from their children; the gate those routes reach still judges its own runtime at its host task. Bootstrap's behavior is this order's non-goal."
}
```

## WO-240-D006 — The fixture home is runner-fixtures, not declarations or generated

```json
{
  "id": "WO-240-D006",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 2",
  "decision": "The host fixtures live in scripts/test-runner.test.mjs, the suite runner-fixtures. The order's parenthetical names declarations or generated, and its Preflight says to write the choice in at activation, which did not happen. Those two are structural tasks that run scripts/structural-checks.mjs itself and hold no fixtures. machinerySources declares scripts/structural-checks.mjs under runner-fixtures and sync-fixtures, and the existing host fixtures are already in runner-fixtures, so the Preflight suite for step 2 is npm test -- --only runner-fixtures.",
  "evidence": [
    "machinerySources read at runtime: sync-fixtures and runner-fixtures name scripts/structural-checks.mjs.",
    "scripts/test-runner.mjs declares declarations and generated as node tasks over scripts/structural-checks.mjs."
  ],
  "rejected": [
    { "option": "Amending the order's text", "reason": "This is a naming correction with no change of scope or criterion; the criterion says the suite that declares the file, and this is that suite." }
  ],
  "reopenWhen": "The host fixtures move to another suite."
}
```

## WO-240-D007 — The founding-lesson sentence is already gone, so step 5's second edit is a NoOp

```json
{
  "id": "WO-240-D007",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 5",
  "decision": "README.md changes its Node line only. Step 5 restates the sentence at line 86 that named an earlier system, observed at 4090d70d. That sentence no longer exists: commit ed225f7e removed it when WO-192 rewrote Why this exists on the operator's direction, keeping the opening bigger-prompt sentences on purpose. Criterion 5 asks that the founding lesson no longer names an earlier system, which holds. The order's proposed replacement sentence is not added.",
  "evidence": [
    "git diff 4090d70d HEAD -- README.md removes the sentence; grep for predecessor, collapsed, 140 and stash in README.md finds nothing.",
    "WO-192-D073 records the operator's direction to rewrite the named passage and to keep the opening.",
    "docs/control/front-page.json's What runs today markers and line budget are untouched."
  ],
  "rejected": [
    { "option": "Adding the order's restated sentence", "reason": "It would put back prose the operator directed out of the page after this order was filed." }
  ],
  "reopenWhen": "The operator asks for the mechanism sentence on the front page."
}
```

## WO-240-D008 — Run the owed live feedback episode, against the order's Cost line

```json
{
  "id": "WO-240-D008",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 7",
  "decision": "Select immutable feedback revision WO-240/001 after one live self-host audit of the current source. The order's Cost line says the feedback edition carries with no live episode because package.json is not in FEEDBACK_SOURCE_PATHS. That is true of the root manifest, but package-lock.json and packages/skeleton/package.json are judged, and criterion 1 changes the engines line in both, so sync refuses the carry and the document and complete gates cannot pass. Product 07 says an order changing a judged file beyond a component release label owes one episode, and that an owed episode runs in the executor's session with no operator authorization and its cost accepted.",
  "operatorAuthorization": "Product 07 §Operator-opened planning pass authorizes a live feedback episode an order owes without further operator direction, on Claude Code claude-opus-5-5 at xhigh; WO-192-D096 applied it to the same refusal.",
  "evidence": [
    "npm run sync: judged behavior changed since docs/evidence/WO-192/feedback-003 (.feedback-source/package-lock.json, .feedback-source/packages/skeleton/package.json).",
    "Of the 61 judged paths only those two changed, and only by engines lines.",
    "The bounded feedback-audit on claude-cli-print at claude-opus-5-5 and xhigh exited 0 in 1 min 22 s: phase complete, ten fixtures, 1192 saved instruction bytes. One verifier worker ran; descendants beyond it are unobserved.",
    "feedback-evidence --write and --record-selfhost filed docs/evidence/WO-240/feedback-001, and --check reported that its live audit judged the current source, with ten passing regressions and ten removal failures.",
    "The first two launches refused with feedback verifier mount alias because the store path ran through /var, a symlink to /private/var. The check is deliberate; the store was given its physical path and the check is unchanged."
  ],
  "rejected": [
    { "option": "Carrying the earlier audit", "reason": "It would claim a verdict for a different subject, and the carry refuses." },
    { "option": "Normalizing engines out of the judged identity", "reason": "The stored behavior identity binds the live audit; changing the normalizer breaks that binding on an immutable edition, and the fix itself reaches judged code." },
    { "option": "Keeping the old range in packages/skeleton/package.json", "reason": "Criterion 1 requires the range in every package." }
  ],
  "reopenWhen": "Another change alters a judged feedback source or the regenerated feedback report before handoff."
}
```

## WO-240-D009 — Remove the stale off-ramps registration

```json
{
  "id": "WO-240-D009",
  "date": "2026-10-31",
  "dispatch": "resume: next; the carry-in from WO-235-D065 (FUP-4c704bb1ea210f14)",
  "decision": "Remove scripts/lib/off-ramps.mjs from commonSources in scripts/lib/evidence-sources.mjs. The direction ledger's removal left it registered with no registered source importing it.",
  "evidence": [
    "Computed from evidenceSources(root): the authority, artifact-identity, verification, feedback and harness inventories each registered the file and none of their 155 to 181 sources imported it; off-ramps' importers (resume.mjs, planning-followups.mjs, handoff-ledger.mjs, target-publish.mjs) are not registered sources.",
    "npm test -- --only evidence-sources passed; npm run evidence:artifact -- --check passed."
  ],
  "rejected": [
    { "option": "Leaving the entry until another re-mint", "reason": "This order re-mints anyway, and the order names the removal." }
  ],
  "reopenWhen": "A registered source imports scripts/lib/off-ramps.mjs again."
}
```

## WO-240-D010 — A recorded run forces every task fresh and can reach one Node only

```json
{
  "id": "WO-240-D010",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 4",
  "decision": "Each recorded complete run passes --again and starts with a PATH holding exactly one node. The order's command omits --again, but coveringTaskResults composes passes by code identity alone and rows carry no runtime, so a plain npm test -- --review at an identity already passed under the other line runs only the structural tasks under the second line and still reports a pass. The order's non-goal excludes a per-row runtime field, so the guard is the invocation, and the row's reusedSuites 0 shows it held. fnm exec prepends the selected runtime but leaves 26.9.0 and 22.2.0 reachable behind it, so the PATH also drops the fnm shell directory and the nvm directories; no step can borrow what it cannot find.",
  "evidence": [
    "scripts/test-runner.mjs: plain and review selections compose coveringTaskResults unless --again, --only, --document, --machinery or --confined-partial is given, and an instance selection never reuses.",
    "which -a node under fnm exec --using 24.15.0 printed three entries; under the recorded PATH it prints one.",
    "Each recorded run's log begins with its RUNTIME and NODES_ON_PATH lines.",
    "FUP-03c675456fa8e484 defers a Node version on every gate row on the ground that one supported pair of lines does not need it; that weighed recording and not reuse, so this hazard is a new fact for the row."
  ],
  "rejected": [
    { "option": "Running the order's command as written", "reason": "Run second at one identity it executes nothing under the second runtime, so its pass would be a proxy for the evidence the criterion asks for." },
    { "option": "Putting the Node version in the code identity", "reason": "Criterion 3 compares identities across the two lines, and the order excludes a runtime field." }
  ],
  "followup": "Gate reuse crosses Node lines: a core npm test under one line can carry passes executed under the other, because rows record no runtime. Judge a runtime field or a reuse key when a second supported line is routinely gated in core.",
  "reopenWhen": "A release breaks on one line after passing on the other, or the gate index gains a runtime field."
}
```

## WO-240-D011 — What the first Node 24 run found

```json
{
  "id": "WO-240-D011",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 4",
  "decision": "The first complete run under 24.15.0 failed four of 43 suites, and every failure is repaired in the source that fails and passed again on both lines. Two suites failed on this order's own change and two on four real runtime differences. launchpad: scripts/harness.mjs now imports node-engines.mjs, so EMIT_CLOSURE names it. process-debt: harness-entry now builds through scripts/build.mjs, so the fixture stubs that file, as the harness-fixtures entry mode does. target-publish: Node 24's fs.cpSync applies the umask to what it creates where Node 26 keeps each mode, so the seed snapshot's digest differed; the fixture restores modes after copying. runner-fixtures: a recursive readdirSync of a byte path throws ERR_INVALID_ARG_TYPE on Node 24 after the guard observed it, which ended the spellings script at its first line, so each spelling is now attempted independently; test events carry no testId on Node 24, so the case reporter falls back to the source position; and the test tracing channels do not exist at 24.15, which WO-240-D012 records. No failure showed a guard or gate verdict going wrong on Node 24.",
  "evidence": [
    "First complete run: code identity 97d6ae94, 2249001 ms (0 h 37 min), --keep-going, 112 fresh tasks, 0 reused, 39 passed and 4 failed.",
    "Probes on both lines: fs.cpSync with recursive, preserveTimestamps and verbatimSymlinks copied a 700 directory as 755, a 555 directory as 755 and a 664 file as 644 under 24.15.0, and copied all three exactly under 26.9.0. readdirSync(Uint8Array, recursive) and readdirSync(Buffer, recursive) throw under 24.15.0 and succeed under 26.9.0. test:dequeue and test:complete carry testId, entryFile, parentId and tags under 26.9.0 and none of them under 24.15.0. A preload subscribed to tracing:node.test:start and end receives events under 26.9.0 and none under 24.15.0.",
    "Production cpSync audit: copyTemporaryMaterial has only test and fixture consumers; the one runtime copy, scripts/lib/harness.mjs's snapshot, copies single files and records only the execute bit, which survives on both lines; scripts/build.mjs and the remaining sites copy ordinary trees or belong to probes. No production path depends on a directory mode through cpSync.",
    "testId has no consumer outside the reporter and its fixture.",
    "After the repairs: target-publish, process-debt, runner-fixtures and launchpad each pass under 24.15.0 and under 26.9.0, each with no not ok line."
  ],
  "rejected": [
    { "option": "Weakening scenarioTreeDigest to ignore modes", "reason": "The digest proves a seed restored exactly, and private directories must come back private." },
    { "option": "A shared mode-preserving copy helper for every cpSync", "reason": "No production path needs it; the audit is the evidence, and a helper would change about 35 sites for one fixture." }
  ],
  "reopenWhen": "A production copy starts depending on a directory mode, or a later Node 24 release changes any of these behaviors."
}
```

## WO-240-D012 — The heartbeat names running cases on Node 26 only

```json
{
  "id": "WO-240-D012",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 4",
  "decision": "Keep case naming as a capability of the runtimes that publish tracing:node.test:start and end. At 24.15 the preload loads and marks nothing, and the heartbeat prints no case marker from <task> yet with the last report, which is true. The fixture asserts naming on Node 26 and that fallback when no case was named.",
  "evidence": [
    "scripts/lib/case-marker.mjs reads only those channels, and its own comments state that a missing marker leaves the heartbeat without a name while results stand.",
    "The runner's verdicts, durations and slowestCases come from reporter events and TAP, which work on both lines; the heartbeat fixture's duration assertions pass under 24.15.0.",
    "An instance's selections run in seconds and core development defaults to 26.9.0."
  ],
  "rejected": [
    { "option": "A global beforeEach preload or a wrapped node:test on Node 24", "reason": "It changes how every test on that line runs, and its timing, for a diagnostic: the recorded Node 24 run would no longer run tests the way Node 26 does." }
  ],
  "followup": "On Node 24 the gate heartbeat cannot name a running test case, because Node publishes no test tracing channel at 24.15. Add a fallback if an instance on Node 24 needs to diagnose a hung suite, or drop the limit when the 24 line gains the channels.",
  "reopenWhen": "A Node 24 host needs a hung case named, or a later 24.x publishes the channels."
}
```

## WO-240-D013 — The recipe is written as rehearsed on Node 24.15.0

```json
{
  "id": "WO-240-D013",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 6",
  "decision": "The kit README carries the operator's recipe in order, with cd <name> added because the following git remote lines cannot run from the parent directory. The order's rehearsal ran under Node 26.9.0 and says so, so the recipe was rehearsed again under 24.15.0 alone, against an export of this tree, and the passage states what that run observed.",
  "evidence": [
    "Rehearsal with one node on PATH, a bare mirror standing in for the starter and an empty bare repository for the private origin: export carries ^24.15.0 || ^26.0.0; no tag after clone or after a plain git fetch upstream; tagOpt --no-tags; main tracks origin/main; bootstrap exits 0 with no warning and no EBADENGINE; harness check exits 0 and reports local-terms list: unavailable, then present after step 4; npm run meta exits 0; a plain instance npm test passes seven tasks.",
    "gh repo create is the one step not exercised: it needs a real account, and the empty bare repository stands in for what it leaves."
  ],
  "rejected": [
    { "option": "Omitting cd <name> to match the operator's list exactly", "reason": "The recipe would not run as written." },
    { "option": "Relying on the launchpad suite alone", "reason": "It exports and checks but never runs the clone, rename and push." }
  ],
  "reopenWhen": "The starter's default branch or the kit's bootstrap steps change."
}
```

## WO-240-D014 — The host check's cost

```json
{
  "id": "WO-240-D014",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 7",
  "decision": "The comparison adds no measurable cost to the host task.",
  "evidence": [
    "Before, on this checkout at code identity 8aead389: 95, 98 and 111 ms in the host task rows of three focused runs, median 98 ms.",
    "After, at code identity b8f4c52a, in the host task rows of four focused runs each: 94, 91, 92 and 93 ms under 26.9.0, and 96, 90, 88 and 91 ms under 24.15.0. The complete run at 97d6ae94 records 113 ms under 24.15.0. At the handoff identity 9acc6fd2 the complete rows record 91 ms under 24.15.0 and 96 ms under 26.9.0, and the document and machinery rows under 24.15.0 record 92 and 88 ms."
  ],
  "rejected": [
    { "option": "A gate-row runtime field", "reason": "The order's non-goal; the task duration needs none." }
  ],
  "reopenWhen": "The host task's duration grows by more than sampling noise."
}
```

## WO-240-D015 — Editions and the release

```json
{
  "id": "WO-240-D015",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 7",
  "decision": "Editions follow their own checks: authority is re-minted deterministically under WO-240 each time harness sources moved, and docs/evidence/current.json names the current revision; feedback is the live WO-240 revision 001 of WO-240-D008; artifact-identity and verification stay at WO-192 revision 002 because their checks pass on the current source. No component version changes, because no packages/*/src file changed; release prepare assigned v0.105.0 under the minor classification.",
  "evidence": [
    "npm run sync regenerates authority-evidence and refuses only feedback, and a second sync changes nothing.",
    "npm run evidence:artifact -- --check verified the current edition.",
    "scripts/release.mjs requires a component bump only when the component's src changed; git diff --name-only names no packages/*/src path."
  ],
  "rejected": [
    { "option": "Re-minting every edition for symmetry", "reason": "An edition is re-minted when its check says so." }
  ],
  "reopenWhen": "A check stales another edition before publication, or a change reaches packages/*/src."
}
```

## WO-240-D016 — Core's document gate failed on Node 24 where the complete run cannot see it

```json
{
  "id": "WO-240-D016",
  "date": "2026-10-31",
  "dispatch": "resume: next; the consistency review",
  "decision": "Repair the fixture and record the limit, and add npm run test:docs and npm run test:machinery under 24.15.0 to the recorded evidence. The kernel-docs round-trip case re-encodes every committed event stream, and on Node 24 JSON.stringify overflows the stack on the synthetic deep-nesting.jsonl, so core's document gate was red on a runtime the range admits. The review selection never runs that suite, so a green recorded run alone would have hidden it. Criterion 3 names only npm test -- --review, but the objective says a launchpad runs on this line. The case now tolerates that one stack overflow on that one stream below Node 26, where it still decodes, and reports it apart from the byte-identical streams. encodeLog is unchanged.",
  "evidence": [
    "Measured with arrays nested in a loop: JSON.stringify overflows near 6,154 levels under 24.15.0 and shows no limit at 2,000,000 under 26.9.0. JSON.parse handles 200,000 levels on both.",
    "The fixture nests about 12,000 levels in 24,139 bytes. A probe re-encoded all 569 committed streams under 24.15.0 and only this one failed.",
    "corpus/harness/wo105-store.test.mjs already excludes deep-nesting from its round-trip law and asserts its decoding separately.",
    "The failure is a RangeError raised before any write, so an event nested past the limit cannot be appended on Node 24 and nothing is corrupted. No committed stream outside the fixture reaches it.",
    "An instance's document selection does not carry kernel-docs, so an export never met this failure."
  ],
  "rejected": [
    { "option": "Making encodeLog iterative", "reason": "It changes a kernel source and a registered evidence source to serve a depth no real event reaches, and the stored streams' bytes must not move." },
    { "option": "Skipping the fixture on every runtime", "reason": "It would stop the byte round-trip where it holds." },
    { "option": "Running only the order's named command", "reason": "That is the proxy this review exposed: the named run is green while the launchpad's document gate is red." }
  ],
  "reopenWhen": "A real event nears the depth limit, or a host reports a RangeError from an append on Node 24."
}
```

## WO-240-D017 — Resolve the three independent reviews

```json
{
  "id": "WO-240-D017",
  "date": "2026-10-31",
  "dispatch": "resume: next; the three independent reviews of the first full implementation",
  "decision": "Resolve all 21 findings, 19 distinct, before any further complete run: 18 are fixed, and A3 is fixed for harness evidence's cached pass and recorded for its npm child. Design: D1 and the criteria adversary's A1 read the range from the working directory, so harness check judged a target's package.json; every caller now judges the running checkout. D2 removes the runner's test-only nodeVersion option, and the fixture declares a range in its own package.json. D3 and A5 replace the unused enginesRange with packageRoot, so a fixture proves the range comes from the file. D4 and A8 stop an unreadable package file reading as no constraint. D5 corrects a false statement about npm in a comment and in WO-240-D002, which said this reader treats a prerelease as npm does; npm admits 24.16.0-rc.1. D6 to D9 correct comments. Criteria: A2 adds a stale runtime to the first-task fixture, A3 adds harness evidence to the refusal and records its other half in WO-240-D005, A4 removes the build npm script from both fixtures so a revert of harness-entry fails, A6 adds floors with a patch, a null range and a leading zero, and A7 reads every exported workspace manifest and lock entry. Consistency: F1 is WO-240-D016. F2 corrects CONTRIBUTING, which said --review runs every task fresh. F3 appends an amendment to ADR-0002. F4 replaces every gate with what is true of target gates. The consistency reviewer's further note, which it did not count as a finding, about an edited package.json is answered in WO-240-D002 and the kit README.",
  "evidence": [
    "Design reviewer: found 9. Criteria adversary: found 8. Consistency reviewer: found 4. D1 equals A1 and D4 equals A8.",
    "The design reviewer and the criteria adversary each reproduced the target false refusal independently; this session confirmed F1 by measurement.",
    "Recorded rather than fixed: A3's second half, the npm test by name inside harness evidence and measure-gates, in WO-240-D005."
  ],
  "rejected": [
    { "option": "Keeping enginesRange because A5 wanted it pinned", "reason": "D3 is right that it had no caller; packageRoot answers A5 with a real file." },
    { "option": "Reading findLaunchpad for the range, A1's fix", "reason": "A DOTLN_LAUNCHPAD override would name another checkout's range; the range governs the scripts that are running." },
    { "option": "Extending the range grammar to the old comparator form", "reason": "The order scopes the reader to caret alternatives, and the refusal names the one-line remedy." }
  ],
  "reopenWhen": "A recheck of the repaired code reports a new finding."
}
```

## WO-240-D018 — Resolve the reviewers' recheck of those repairs

```json
{
  "id": "WO-240-D018",
  "date": "2026-10-31",
  "dispatch": "resume: next; the three reviewers' recheck of WO-240-D017",
  "decision": "All 21 earlier findings are confirmed resolved, A3 and D002's note as recorded. Fix all nine recheck findings, seven distinct, before any complete run. All three reviewers reported the deep-nesting tolerance from different sides: it applied on every Node, for any RangeError, and counted the stream as byte-identical, which contradicted the rationale in WO-240-D016. It now holds only below Node 26, for the stack overflow, on that stream, and the stream is reported as decoded only. An unreadable package.json now has its own refusal instead of reading as a null range, and a leading byte-order mark is skipped as npm skips it. New pins cover a range's minor and patch leading zeros, a directory at package.json, DOTLN_LAUNCHPAD in the foreign-directory case, and every package and lock entry including browser-evidence. feature-configuration and product 07 name the harness evidence refusal. D017's tally and D004's wording are corrected. The narrow recheck of those repairs reported two more, both from them: a readable package.json with a null field read as unreadable, now fixed by reading the field as no constraint, and D002's evidence list, now current.",
  "evidence": [
    "Design recheck: found 1. Criteria recheck: found 5. Consistency recheck: found 3. The deep-nesting tolerance is one distinct item across all three.",
    "Narrow recheck: design found 1, criteria found 0, consistency found 2; the null field is one item across two reviewers.",
    "One-line recheck: criteria found 0, consistency found 0, and design found 1, a doc-comment clause and the same clause here that said npm reads a missing file as no constraint; npm stops with ENOENT. Both are corrected, in the reviewer's words for the comment.",
    "The design reviewer disclosed one probe outside its rules: npm ci in an empty temporary directory, which exited 1 with EUSAGE, installed nothing and touched nothing in the repository. Its findings do not rest on it.",
    "Criteria recheck: real Node 22.2.0, 21.4.0 and 20.10.0 each refuse harness evidence, and nothing it found produces a false pass on an outside runtime.",
    "Consistency recheck: all 37 rows the review selection skips ran directly under 24.15.0 and exited 0, without the gate's preload and temporary-root ledger."
  ],
  "rejected": [
    { "option": "Reading the range through a conditional with no try", "reason": "It stops asserting the error and would skip the stream on a later 24.x that no longer overflows." }
  ],
  "reopenWhen": "A further recheck reports a new finding."
}
```

## WO-240-D019 — Both recorded runs pass at the handoff identity

```json
{
  "id": "WO-240-D019",
  "date": "2026-10-31",
  "dispatch": "resume: next; steps 4 and 8",
  "decision": "After every review closed, one complete run passed under each line at code identity 9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419, so the Node 24 record is the handoff identity and no repeat is owed. Each ran fresh with one node on PATH. The document and machinery gates also passed under 24.15.0. The outcome matches the order's purpose: a launchpad and an export run on both lines and refuse any other, with four runtime differences found by running rather than reading.",
  "evidence": [
    "Under 24.15.0: host-gate:9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419:npm test, recorded 2026-10-31T21:13:50.497Z, 2167204 ms (36 min 7 s), exit 0, 43 passed, 112 fresh, 0 reused. npm run test:docs 27 passed; npm run test:machinery 19 passed. docs/evidence/WO-240/node24-gate.json holds the rows.",
    "Under 26.9.0: the same reference, recorded 2026-10-31T22:03:50.953Z, 2024968 ms (33 min 45 s), exit 0, 43 passed, 112 fresh, 0 reused.",
    "WO-239 VER-001's complete run for comparison: 2000806 ms (33 min 21 s), 113 fresh tasks. The Node 24 run took 36 min 7 s.",
    "Each run's log opens with its RUNTIME and NODES_ON_PATH lines: one node on PATH each time.",
    "npm ci and the build ran under 24.15.0 before its gates and under 26.9.0 before its gate, so the checkout's node_modules is the development line's."
  ],
  "rejected": [
    { "option": "Treating the first Node 24 run as the record", "reason": "It failed, and its identity is not the handoff's." }
  ],
  "reopenWhen": "A runtime source changes before final review."
}
```

## WO-240-D020 — Verify the unchanged subject with independent attacks and the recorded complete runs

```json
{
  "id": "WO-240-D020",
  "date": "2026-10-31",
  "dispatch": "resume: verify",
  "decision": "Judge VER-001 at the executor's unchanged code identity, consume its two forced-fresh complete review rows, and run independent probes rather than another complete gate. The traps are stale identity, reuse across runtimes, a range read from the wrong directory, and a child finding another Node on PATH. Compare the identity and both full task timelines, exercise real Node 24.15.0 and Node 26.9.0, vary the declared range and working directory, and plant a PATH decoy. No implementation change is made by this read-only phase. No new blocking defect was reproduced; retain D010's reuse follow-up, D012's heartbeat follow-up and D005's stated boundary for convenience routes outside the gate. The outcome matches the order's purpose at the recorded subject; it does not establish future runtime compatibility.",
  "evidence": [
    "docs/evidence/WO-240/verification-001.json: current code identity 9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419; both complete review rows have 112 executed passing tasks, zero reuse and no unrun suite.",
    "Independent manifest and lock comparison, thirteen named host-version cases and 135 additional versions, custom and malformed ranges, real host checks from a foreign directory on both Node lines, and a decoy executable lookup passed.",
    "Nine focused runner tests passed independently on each Node line. The export's offline npm ci case passed on Node 24.15.0 and checked every exported manifest and lock entry. The Node 24 history test passed with 568 byte-identical streams and the one synthetic deep stream counted only as decoded.",
    "npm run format:check, npm run publication:check, npm run evidence:artifact -- --check and all sixteen generated-artifact checks passed. The final exact-tree document gate follows the completed verification records; completion consumes its passing row. VER-001 states this measurement cutoff."
  ],
  "rejected": [
    {
      "option": "NoOp: rely only on the handoff's met lines",
      "reason": "It would not independently attack the runtime and export claims."
    },
    {
      "option": "Repeat both complete gates at the unchanged identity",
      "reason": "The role explicitly consumes current passing rows. Both recorded timelines are forced fresh with no reuse; focused independent probes test the identified traps without repeating those complete runs."
    },
    {
      "option": "Repair or widen convenience routes during verification",
      "reason": "The verifier is read-only on implementation, no criterion or existing behavior was shown broken, and D005 already states that boundary."
    }
  ],
  "reopenWhen": "A runtime source changes, a recorded complete row fails its identity or execution checks, the post-write document gate fails, or a supported runtime reproduces a behavior failure."
}
```

## WO-240-D021 — Correct verification reads and probe sequencing

```json
{
  "id": "WO-240-D021",
  "date": "2026-10-31",
  "dispatch": "resume: verify",
  "kind": "correction",
  "decision": "Preserve the subject and record the verifier's process errors. Initial unfiltered status and generated-diff reads truncated, and unquoted wildcard scans were rejected by zsh. Replace those reads with selected fields, explicit paths and a full diff retained in session scratch. A kernel-history probe was also launched after a wait yielded while the generated-artifact check was still running; discard that first history probe from the relied-on evidence and repeat it alone after the generated check completed. Both checks passed, and no implementation was changed.",
  "misread": "A yielded process wait was treated as completion, and broad reads and shell wildcards were treated as bounded evidence reads.",
  "meant": "Inspect completion before starting the next probe; select verdict-relevant fields before emission and pass patterns to the program rather than zsh.",
  "changed": "The relied-on history probe ran sequentially and passed. Complete task timelines and generated hook/manifest changes were checked programmatically, full results stayed in scratch, and subsequent reads used explicit paths and selected output.",
  "evidence": [
    "Bounded generated-artifact check: exit 0, finished 2026-10-31T22:18:29.646Z; all sixteen artifacts current.",
    "Replacement bounded Node 24 history probe: exit 0, started 2026-10-31T22:18:40.845Z and finished 2026-10-31T22:18:41.543Z; one test passed, 568 streams byte-identical and one decoded only.",
    "Independent audit: all sixteen changed generated hooks differ only by the selected snapshot; the manifest's 51 changed leaves are snapshot or hash fields. Both complete rows' 112-task timelines passed the execution and zero-reuse assertions."
  ],
  "rejected": [
    {
      "option": "Rely on the first history probe or the omitted portions of a truncated read",
      "reason": "Neither is the required independent, sequential evidence read."
    }
  ],
  "reopenWhen": "Another yielded task, omitted output or rejected shell expansion leaves a relied-on claim unchecked."
}
```

## WO-240-D022 — Accept the unchanged subject on its standing complete rows

```json
{
  "id": "WO-240-D022",
  "date": "2026-10-31",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-240 at the unchanged code identity 9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419: all seven criteria are met and no finding is listed. Nothing is integrated, because main, origin/main and HEAD read 984f7ca4 and the integrate helper returned before any checkpoint or stash. The reviewer changes no source, so no complete run is owed: completion consumes the newest passing complete review row at this identity, the Node 26.9.0 run recorded 2026-10-31T22:03:50.953Z with 112 fresh tasks and none reused, beside the Node 24.15.0 row of 21:13:50.497Z that node24-gate.json records, and the document row recorded after this review's last document edit. Focused reproductions under the bounded wrapper on both installed lines stand beside those rows rather than in place of them. The known issues of planning receipts 059 and 061 are judged at the subject: both complete rows show zero reuse and 0 h 36 min and 0 h 34 min durations, so neither run stood on the other line's rows; the fixture pins 24.14.0, 24.14.9 and the prereleases; the Node 24 run is at the handoff identity; the refusal is the recorded design, with bootstrap unaffected and the remedy named in every message; and the decay of the Node 24 claim over later changes is the standing limit FUP-3457a1c859fb51d8 and FUP-23eb1282f814be14 carry with their reopening conditions. Of the ten register rows the change matches, FUP-4c704bb1ea210f14 is done by D009, the two rows minted by D010 and D012 are this order's and stay pending, FUP-03c675456fa8e484 stays deferred because its reason names one supported pair of lines as the state that needs no row field and its reopening names a runtime beyond that pair, and the other six only match a path.",
  "evidence": [
    "git rev-parse main origin/main and git merge-base main HEAD all read 984f7ca45fbd5d182662b758ea01c22b7415b807; npm run worktree -- integrate WO-240 printed that it took in nothing; git stash list is empty; no nested repository is in the worktree.",
    "gateCodeIdentity read at this review: 9acc6fd280ba357f29217218918d45b57160e56da41611a72ddaf4c1f778e419, equal to the handoff and VER-001 identity. Rows at it with checkId npm test, selection review, forced fresh, exit 0: recorded 2026-10-31T21:13:50.497Z (2,167,204 ms, 112 tasks, none failed, host 91 ms) and 2026-10-31T22:03:50.953Z (2,024,968 ms, 112 tasks, none failed, host 96 ms).",
    "Bounded probes in this review, each exit 0: the nine runtime fixtures of scripts/test-runner.test.mjs under 26.9.0 and under 24.15.0; the export's offline npm ci case under both lines; the kernel history case under 24.15.0 (568 streams byte-identical, one decoded only) and under 26.9.0 (569 byte-identical); node scripts/structural-checks.mjs generated (every artifact current); node scripts/lineage.mjs index --check; npm run format:check; npm run publication:check (256 of 256 headings indexed); npm run evidence:artifact -- --check; node scripts/harness.mjs check under 26.9.0 and under 24.15.0 (42 generated surfaces, local-terms list present); npm run release -- check-surfaces --local (60 PASS lines, no FAIL; target v0.105.0 above the latest local tag v0.104.0).",
    "Real Node 22.2.0: node scripts/harness.mjs check exits 1 printing Node runtime v22.2.0 is outside package.json engines.node ^24.15.0 || ^26.0.0, with the remedy and bootstrap named.",
    "README.md differs from main by the Node line and the generated release line only; a search for predecessor, collapsed, 140 rules and stash finds nothing, so the founding lesson names no earlier system (D007). git diff --check is clean.",
    "scripts/test-runner.mjs: a failed structural task finishes every pending task unexecuted and returns, so a refused runtime runs nothing else even under --keep-going; scripts/lib/target-gate.mjs never enters runGateChecks, so a target's own engines field reaches neither the host task nor the structural order."
  ],
  "rejected": [
    { "option": "NoOp: pass on VER-001 and the handoff's met lines without reading the subject or reproducing", "reason": "The reviewer owns the acceptance, the integration and the release surfaces." },
    { "option": "Repeat a complete run under either line", "reason": "The identity is unchanged, both rows executed every task fresh, and the rule reuses the passing row at the integrated identity; a rerun spends about 0 h 35 min and shows nothing the rows do not." },
    { "option": "Spawn reviewers", "reason": "Three independent reviews over five rounds and one verification already attacked this subject; final review reads it whole and reproduces what the verdict rests on." },
    { "option": "Dispose FUP-03c675456fa8e484 as a row whose condition occurred", "reason": "Its reason names one supported pair of lines as the state that needs no per-row runtime field; the reopening names a runtime beyond that pair, which this order does not add. D010 recorded the reuse hazard as FUP-3457a1c859fb51d8 instead." }
  ],
  "reopenWhen": "A runtime source changes before publication, a supported runtime reproduces a behavior the rows did not see, or the operator asks for the mechanism sentence step 5 proposed for the front page."
}
```
