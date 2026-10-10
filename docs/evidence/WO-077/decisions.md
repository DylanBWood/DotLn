# WO-077 decisions

## WO-077-D001

```json
{
  "id": "WO-077-D001",
  "date": "2026-10-10",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.74.0, the next minor above the observed release baseline v0.73.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.73.1 (local tags)",
    "minor classification declared in docs/work-orders/WO-077-launchpad-export-update.md"
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

## WO-077-D002 — Preserve kit ownership across repeated updates

```json
{
  "id": "WO-077-D002",
  "date": "2026-10-10",
  "dispatch": "resume: next",
  "decision": "Keep manifest schema 1. Update requires a well-formed prior manifest and readable regular prior kit files before destination writes. Plan each sorted path as replace, add, remove or refuse. A locally edited file, including a dropped file, retains its prior hash; an occupied newly introduced path stays instance-owned and outside the manifest. The manifest records the new source commit, while the dated command output names every refusal; UPSTREAM.md explains that retained files are exceptions to that commit. UPSTREAM.md itself follows the kit-file rule. Individual replacements use temporary sibling files and rename, preserving file modes and avoiding writes through hard links. Preserve the prior export's license posture. No instance seed or build overlay participates in the kit plan, and no control event is introduced.",
  "evidence": [
    "WO-077 execution steps 2 and 5 and the 2026-10-07 retained-hash decision",
    "scripts/launchpad.mjs readPriorManifest, planUpdate, updateKit; scripts/lib/control.mjs closed control-event set and scripts/check-registrations.mjs JSONL registration rule",
    "docs/evidence/WO-077/fixtures.md: replacement, addition, removal, local edits, dropped local edits, instance and overlay byte equality, repeated updates, new-path collisions, missing/malformed manifest and unreadable kit cases"
  ],
  "goalAlignment": {
    "traps": "A new hash for a refused edit would make the next update forget the baseline; retain the old hash. Treating a new path as owned because it appears in the incoming manifest would overwrite instance data; refuse the collision without claiming it. Re-emitting into the destination during update would alter its contract or overlay output implicitly; print the operator's re-emit instruction instead. Input failures discovered after writes would leave an avoidable partial update; preflight all kit files and opted-in actions first.",
    "noOp": "Existing exports take core improvements only by manual file refresh, leaving the core-to-starter update path incomplete."
  },
  "rejected": [
    { "option": "Merge local changes or overwrite them", "reason": "The order requires reviewable refusal and preservation." },
    { "option": "Remove refused dropped entries from the manifest", "reason": "That would lose the retained baseline and could later reclassify them as new additions." },
    { "option": "Apply the harness emit during update", "reason": "CLAUDE.md and the instance build overlay belong to the instance; re-emission remains an explicit printed next step." }
  ],
  "reopenWhen": "The manifest schema or kit namespaces change, or a separately scoped requirement demands whole-update rollback after a disk/write failure. This implementation preflights readable inputs; it does not promise a crash-atomic multi-file transaction."
}
```

## WO-077-D003 — Opt-in and typed mechanical actions

```json
{
  "id": "WO-077-D003",
  "date": "2026-10-10",
  "dispatch": "resume: next",
  "decision": "Add the closed kit section with boolean applyInstanceActions, default false. Both that destination configuration value and --apply are needed. The committed, manifest-listed scripts/kit/KIT-ACTIONS.json declares schemaVersion 1 and initially no actions. Each action has a distinct id, a calendar date and exactly one closed kind: rename-root with root/from/to, add-config-field with dotted field/value, or change-phrase with literal from/to in CLAUDE.md. Preflight and execution are separate so a later invalid action changes neither the kit nor an earlier instance target. Root moves preserve their bytes and update explicitly declared contained root references as well as the named root; protected or kit paths and symlinks refuse. Existing configuration values survive default additions; the complete result passes the existing configuration validator. Phrase application handles replacements containing their old phrase without duplicating the replacement on repetition. Applied or preserved actions are printed, not filed as control events.",
  "evidence": [
    "WO-077 execution steps 1, 3, 4 and 6; ADR-0006 Decision 7; product 03 Platform and instance boundary",
    "npm test -- --only configuration-root: 2 tasks passed, 7.35 s",
    "docs/evidence/WO-077/fixtures.md: absence of opt-in, configured opt-in without --apply, three applied kinds, unknown kind before writes, invalid later phrase before writes, repeated actions, declared child-root move and existing false configuration value",
    "scripts/kit/README.client.md update/opt-in sections; product 07 Where the control plane finds its documents grew by 156 bytes (184,398 to 184,554, measured against HEAD); npm run publication:check passed after refreshing its source locks"
  ],
  "rejected": [
    { "option": "Interpret executable actions from the printed note", "reason": "The order requires typed kit declarations; prose is display only." },
    { "option": "Let --apply itself grant consent, or let configuration alone apply actions", "reason": "The instance must opt in and the operator must request the action mode." },
    { "option": "A generic shell or arbitrary-file phrase action", "reason": "Only the three declared mechanical kinds are in scope; the phrase target is the instance contract the order names." }
  ],
  "reopenWhen": "A fork needs a fourth action kind, another phrase target, or an action dependency that the current disjoint root moves do not admit."
}
```

## WO-077-D004 — One shared preparation path, measured against staging

```json
{
  "id": "WO-077-D004",
  "date": "2026-10-10",
  "dispatch": "resume: next",
  "decision": "Extract prepareKit from the existing exporter and use its checked in-memory candidates for update. Fresh export keeps its destination write, repository initialization and own harness emit/check. Update uses the same committed inputs, toolchain pins, build, predicted bundle and local-term screening, then writes only its planned kit paths. Compared two credible ways to obtain the same next-kit bytes: prepareKit versus a complete temporary export followed by reading its manifest-listed files. The bounded fixture observed 596 identical files and 9,193,048 bytes: shared preparation 1,543 ms; staged export plus read 1,869 ms. Choose shared preparation to avoid an extra repository, seed writes and rereads. This is one local sample, not a general performance guarantee.",
  "evidence": [
    "scripts/launchpad.mjs prepareKit and exportKit diff",
    "docs/evidence/WO-077/fixtures.md bounded comparison, passing byte equality for every candidate",
    "The first focused launchpad run passed the existing export, runtime-build and harness checks; the final review gate will rejudge the complete final subject."
  ],
  "rejected": [
    { "option": "Stage an entire fresh export for every update", "reason": "It produced identical candidates but wrote instance seeds, initialized a temporary Git repository and reread the kit; shared preparation avoids those effects." },
    { "option": "Copy whatever compiled runtime the worktree currently contains", "reason": "That loses the existing export's committed-input and pinned-toolchain evidence." }
  ],
  "reopenWhen": "Export preparation requires destination-dependent kit bytes, or measurements show the shared path no longer reduces work for the same result."
}
```

## WO-077-D005 — Resident fixture corrections and preserved continuity

```json
{
  "id": "WO-077-D005",
  "date": "2026-10-10",
  "dispatch": "resume: next",
  "decision": "Run the resident from the export's packages/skeleton/dist/src/resident-host.js and derive its identity with the exported materializeOrder. The first fixture incorrectly expected an unarmed cadence to fire: its output was 0 dispatched instead of 1. packages/skeleton/test/resident.test.ts records the away signal and supplies adapter.fixture before advancing the clock. Correct the new fixture to do both, assert due(10) equals 10 before update, keep its host open during the opted-in update and compare its log byte-for-byte, then restart in a fresh process using the updated exported runtime. The derived WO-900 identity is unchanged and exactly one dispatch fires at dueAt 10. A subsequent test edit changed the phrase action to include the old phrase but left its expected output at the previous heading; correct that stale assertion to the declared replacement. These were fixture errors, not evidence of a resident-runtime defect.",
  "evidence": [
    "npm test -- --only launchpad first run: resident subtest failed 0 !== 1; other update subtests and the existing export cases passed",
    "packages/skeleton/test/resident.test.ts resident start/recordPresence/tick case; packages/skeleton/src/resident-host.ts requiredCapabilities check",
    "The next bounded run passed resident continuity but failed the stale phrase expectation; docs/evidence/WO-077/fixtures.md records the corrected 9/9 passing run."
  ],
  "rejected": [
    { "option": "Weaken the cadence assertion or change the resident runtime", "reason": "The existing source explains the fixture setup error; the requirement is an actually armed cadence firing after restart." }
  ],
  "reopenWhen": "A final-subject fixture loses the log, changes the derived identity, fails to arm the cadence, or cannot load resident-host.js from the export."
}
```

## WO-077-D006 — Independent review and contract consistency

```json
{
  "id": "WO-077-D006",
  "date": "2026-10-10",
  "dispatch": "resume: next",
  "decision": "Both required independent workers identified the same manifest scalar-coercion defect. Require string commit and SHA-256 fields before regex validation; extend the input-refusal fixture with one-element arrays and unchanged-destination assertions. Also align the exported contract template with the order's explicit opted-in change-phrase exception, removing its obsolete unconditional promise that upstream updates never rewrite that contract. The template is a newly read supporting input to the same update contract, not an additional action kind or broader migration authority.",
  "evidence": [
    "docs/evidence/WO-077/self-review.md: criteria adversary 1 finding; design improver 1 finding; one distinct defect, both dispositions fixed",
    "scripts/launchpad.mjs readPriorManifest string guards; scripts/test-launchpad.mjs array-commit and array-hash refusal cases",
    "scripts/kit/CLAUDE.template.md opening ownership paragraph; WO-077 execution step 4 permits a change-phrase action in the exported CLAUDE.md only under opt-in",
    "The first final test:docs run refused a self-review link to handoff.md before that file existed. Remove that premature link; write the handoff after the passing gates, then let implementation-ready run its inline documentation check."
  ],
  "rejected": [
    { "option": "Accept values that stringify to a hash", "reason": "The declared manifest fields are strings; malformed input must refuse before any write." },
    { "option": "Keep the template's unconditional no-rewrite promise", "reason": "It contradicts the declared opt-in behavior and the updated client README." }
  ],
  "reopenWhen": "The manifest field types or the instance-action ownership contract changes."
}
```

## WO-077-D007 — Verification VER-001: pass; three update follow-ups boarded

```json
{
  "id": "WO-077-D007",
  "date": "2026-10-10",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Pass VER-001. All five criteria are met at code identity 43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09. The executor's passing npm test -- --review row is at that identity, and I consumed it. Three defects in the declared surface scripts/launchpad.mjs break no criterion and no behavior main had, because main had no update mode. Product 07 section Verification review and attack routes each one to a follow-up, so none blocks. F1: a declared rename-root admits a destination inside a kit tree. F2: a kit file whose bytes already equal the incoming kit's bytes is refused as locally modified and keeps its prior hash, so every later update refuses it. F3: a write that fails after the kit writes leaves an export the command cannot update again; restoring the export from Git is the only way back.",
  "evidence": [
    "Subject: the uncommitted wo-077 worktree. HEAD and main are both c6769090. The checkpoint is refs/dotln/checkpoint/WO-077/3 (e9e4c5e8), and its tracked files equal the working tree's. gateCodeIdentity of the working tree is 43d2cf9c..., which equals the executor's npm test review row (2026-10-10T04:53:33.024Z, exit 0) and document rows.",
    "Criteria 1 and 2. The scratch probe probe.mjs ran under harness bounded in 17.5 s: 62 checks, 61 passed. It builds its own source repository from the subject's work tree with the real 596-file kit, exports revision A, then commits B, which changes one kit file, drops one and adds one. S1: an export with one upstream-changed kit file edited, one upstream-unchanged kit file (docs/PLAYBOOK.md) edited, an edited CLAUDE.md, README.md, a work order and an overlay file updates with exit 0. Every non-kit file, the AGENTS.md link and both edits keep their bytes. The refused list is exactly the two edits, and both keep their prior manifest hashes. Every other manifest hash equals the file's bytes, and every kit file under scripts/ and docs/ equals source B. The dropped file is removed and the new one is added. The manifest commit and UPSTREAM.md name B and not A. The output prints update without opt-in and the re-emit line, and leaves no temporary file. After the update, harness emit and harness check pass. A second update refuses only the two edits and changes no byte. S2: a missing, {}, schema 2, empty-files, extra-key, duplicate-path, short-hash, symlinked or directory KIT-MANIFEST.json each exits 1, names the manifest path and changes no entry, directories included. With --apply and no configuration, false, the string true or an unknown kit key, the update exits 1 naming dotln.config.json and changes nothing. Four malformed command lines print usage. S3: dated declared actions print without opt-in and leave every instance file unchanged. With kit.applyInstanceActions true and --apply, the update prints opted-in update and one applied line per action, moves docs/evidence to records/evidence, records roots.evidence and release.corpus false, and replaces the phrase once. A run-shell kind refuses before any write with and without --apply. An unknown configuration field and an extra action field refuse before any write. An empty action list under opt-in prints No instance actions declared.",
    "Executor fixture reproduction: node --test --test-name-pattern='export update' scripts/test-launchpad.mjs under harness bounded passed 9 of 9 in 34.3 s. That includes the running exported resident case, which loads resident-host.js from the export's packages/skeleton/dist/src.",
    "F1. In S3, KIT-ACTIONS.json declared rename-root evidence from docs/evidence to scripts/evidence. With opt-in and --apply, the update exited 0, moved the evidence root into the scripts/ kit tree and recorded roots.evidence scripts/evidence. instancePath (scripts/launchpad.mjs:1344-1358) compares the destination only with listed kit files through overlaps (:1080), but kitPath (:1092) treats every path under the kit trees (:146, scripts and packages/beacons) as kit-owned. D003 says kit paths refuse; the client README says overlaps with kit files refuse. Inference from planUpdate (:1214): a later kit file added under scripts/evidence/ would be refused as an instance-owned collision.",
    "F2. probe2.mjs R1 wrote source B's bytes into the export's scripts/ver-changed.txt, as a fork that took core's change by hand would. The update exited 0 and listed the file as refused (locally modified; prior hash retained). The manifest kept A's hash, and a second update refused the file again. planUpdate decides by comparing the current bytes with the prior hash alone (:1225). This is a narrower case of planning receipt 2026-10-07-planning-c351cfc3b65e74e5-041's criterion:1 known issue. Here no merge is needed, because the bytes already are upstream's.",
    "F3. probe2.mjs R2: an opted-in instance has a read-only records/ directory and a declared rename of docs/evidence to records/evidence. Preflight passes. The kit writes and the removal of the dropped file happen (:1510-1516), then renameSync fails with EACCES (:1518-1521). The manifest stays at A while scripts/ver-changed.txt already holds B. After the permission is restored, the retry exits 1 with cannot read regular file .../scripts/ver-dropped.txt, because the update requires every prior kit file to be readable (:1468). Without a dropped file, F2's classification would instead refuse every file the failed run had replaced. D002 records that the update promises no crash-atomic transaction. This probe shows the state is reachable through an unwritable instance directory as well as a disk failure, and that retrying does not recover it.",
    "Gates and checks: npm run format:check reports every matched file formatted. npm run publication:check passes. git diff --check is clean. package.json, package-lock.json and packages/ are unchanged from main. Product 07 grew from 184,398 to 184,554 bytes (156 bytes, within the order's 200-byte cost)."
  ],
  "rejected": [
    {
      "option": "Fail the verdict on F1, F2 or F3",
      "reason": "Each breaks no acceptance criterion: criterion 1 refuses a modified kit file, and F2's file is modified relative to the prior manifest. Criterion 2 is judged against the declared set. None breaks a behavior main had. Product 07 routes them to follow-up."
    },
    {
      "option": "Rerun npm test -- --review",
      "reason": "The executor's review row at this code identity passed. I consumed it, and reproduced the update fixture and my own probes outside the gate."
    },
    {
      "option": "Spawn a worker",
      "reason": "I reproduced every claim the verdict rests on in this session, so no claim needed a worker."
    }
  ],
  "followup": "In the next repair, or the next order that edits scripts/launchpad.mjs. (1) F1: rename-root refuses a from or to that is, or lies under, a kit-owned prefix. Use the same ownership predicate kitPath uses for the manifest, not only the listed kit files. Fixture: a declared rename to scripts/evidence refuses before any write. (2) F2: planUpdate treats a prior kit file whose current bytes equal the incoming candidate as converged. It records the incoming hash and does not refuse the file. Fixture: a hand-converged file is not listed as refused, and the manifest records B's hash. (3) F3: a retry after a run that failed after its kit writes completes. A dropped prior path that is already absent counts as removed, and rule (2) covers the files already replaced. Alternatively, perform instance renames before any kit write, or preflight that their parents are writable. Fixture: an opted-in update whose rename fails with EACCES, retried after the permission is restored, ends with the manifest at the new commit and no refusal. Checks: npm test -- --only launchpad and npm test -- --review. Priority: low. F1 needs a kit author to declare such a rename, F2 needs a hand-applied core change, and F3 needs a write failure after preflight.",
  "reopenWhen": "A committed KIT-ACTIONS.json declares a rename-root into a kit tree; an update in an operator's starter or fork refuses a kit file whose bytes equal the incoming kit's; or an update fails after its kit writes in an operator's starter."
}
```

## WO-077-D008

<!-- integration refs/dotln/checkpoint/WO-077/6 -->

```json
{
  "id": "WO-077-D008",
  "date": "2026-10-10",
  "dispatch": "resume: final review; worktree integrate WO-077",
  "decision": "Integrate main at final review with the canonical helper. The fetched main equals the order's base, HEAD and origin/main at c676909066d278c92cacd94d998a42a8fb5d4a9a, so the branch fast-forwarded nothing, merged nothing and resolved no conflict; the uncommitted work was preserved through checkpoint 6 and the named stash and re-applied byte for byte. Carry every acceptance claim forward unchanged on VER-001's evidence at code identity 43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09, read before and after integration. Retain application v0.74.0, the next minor above the observed v0.73.1 baseline (origin's newest tag, at c6769090). No component version changes: packages/, package.json, package-lock.json and docs/evidence/current.json are byte-identical to main, so there is no collision, no dependency and no evidence edition to re-mint. The regenerated projections changed only the meter snapshot and the meter block of PR.md.",
  "evidence": [
    "refs/dotln/checkpoint/WO-077/6",
    "base c676909066d278c92cacd94d998a42a8fb5d4a9a",
    "upstream c676909066d278c92cacd94d998a42a8fb5d4a9a",
    "release preparation: WO-077 target v0.74.0 remains current. Files changed: docs/evidence/WO-077/meta.json, docs/final-reviews/WO-077/PR.md. Meter snapshot: docs/evidence/WO-077/meta.json, 4021 bytes. Tag observation: local snapshot only.",
    "git ls-remote before the helper ran: origin's main is c6769090 and its newest tag is v0.73.1 at that same commit, so no sibling published while this order was in verification and v0.74.0 is the next minor above the observed baseline.",
    "npm run worktree -- integrate WO-077 --intake-backup <session-scratch archive of the 3 intake files>: bases c6769090 -> c6769090, authored conflicts none, stash f048fc653a75250d284626a97375de10707d3ebd retained, eight regeneration steps (runtime; harness bundle and manifest; control projection; release preparation; this stub; decisions index, follow-up register and meta; work-order index; publication locks). gateCodeIdentity read 43d2cf9c… before and after.",
    "Affected checks on the integrated tree, each exit 0: npm run publication:check (254/254 headings, both outlines CURRENT); node scripts/harness.mjs check (34 generated surfaces); npm run release -- check-surfaces --local (every license and publish-refusal row passes); node scripts/docs-check.mjs (15 documents, 0 failures, product 07 at 184,554 bytes); npm run work-orders -- index --check (both pages current); npm run format:check; git diff --check and git diff HEAD --check clean; node scripts/harness-context.mjs --check (six roles unchanged in both skill roots, five within their ceilings, refuter unset). The review gate is recorded in D009.",
    "Component versions: git diff main --stat over packages/, package.json, package-lock.json and docs/evidence/current.json is empty. The order declares re-mints none and adds no dependency; the new code imports only node: built-ins and local modules."
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

Integration date: 2026-10-10. Original base: `c676909066d278c92cacd94d998a42a8fb5d4a9a`.
Fetched main: `c676909066d278c92cacd94d998a42a8fb5d4a9a`. Checkpoint: `refs/dotln/checkpoint/WO-077/6`.
Named stash retained: `f048fc653a75250d284626a97375de10707d3ebd` (WO-077 integrate 2026-10-10).
Resolved projections: none.
Release preparation: WO-077 target v0.74.0 remains current. Files changed: docs/evidence/WO-077/meta.json, docs/final-reviews/WO-077/PR.md. Meter snapshot: docs/evidence/WO-077/meta.json, 4021 bytes. Tag observation: local snapshot only.
Carried-forward claims: all five acceptance criteria and VER-001's three follow-up findings (F1 to F3, boarded on FUP-eaad73517ca2a395) are carried on VER-001's evidence, because the judged bytes are the integrated bytes: the code identity is 43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09 before and after integration, no authored path was resolved, and the regenerated projections changed only the meter snapshot and the PR body's meter block. The reviewer's own checks on the integrated tree and the acceptance judgment are in D009 and FINAL-001.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-077-D009 — Final review: pass at the integrated subject; the three boards and the receipt's known issue carried

```json
{
  "id": "WO-077-D009",
  "date": "2026-10-10",
  "dispatch": "resume: final review",
  "decision": "Pass FINAL-001. All five criteria are met at the integrated subject, code identity 43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09, byte-identical to VER-001's subject. No new defect: the findings block is empty, VER-001's F1 to F3 stay boarded on D007 and FUP-eaad73517ca2a395 for the next repair or the next order that edits scripts/launchpad.mjs, no touching follow-up row's seam was opened, and the planning receipt's criterion-1 known issue (refused edits with no merge path) is the order's recorded Design and is carried unchanged. Commit the reviewed state as coherent commits and publish the wo-077 branch with the PR body in docs/final-reviews/WO-077/PR.md.",
  "evidence": [
    "Integration (D008): bases c6769090 -> c6769090, no authored conflict, identity 43d2cf9c… read before and after; affected checks publication:check, harness check, check-surfaces --local, docs-check, index --check, format:check, harness-context --check and git diff --check all exit 0.",
    "Fixture reproduction under node scripts/harness.mjs bounded: node --test --test-name-pattern='export update' scripts/test-launchpad.mjs passed 9 of 9 in 39.7 s; the ownership case printed kit files: 594 replaced; 1 added; 1 removed; 2 refused and two refused lines; the resident case printed logPreserved true, identity WO-900, nextCadenceDueAt 10, dispatched 1; the comparison case found 596 candidates byte-equal to a staged export.",
    "Hot index read directly: this review's document row at 2026-10-10T13:48:57.390Z (32 fresh suites, 116,303 ms, exit 0) and composed review row at 2026-10-10T13:49:21.185Z (80 reused suites from the executor's row at 04:53:33.024Z plus the fresh format preflight, 7,304 ms, exit 0), both with identityUnchanged and buildOutputUnchanged true at identity 43d2cf9c….",
    "By source at the integrated bytes: F1 is the gap between kitPath (kit trees) and instancePath (listed kit paths); F2 is planUpdate comparing current bytes with the prior hash alone; F3 is the kit writes and removals running before the instance renames with the retry requiring every prior kit file readable. The shipped KIT-ACTIONS.json declares no action, so no export can meet F1 at this release.",
    "Follow-up register: 15 touching rows read over two pages; none disposed. WO-074 D010 (FUP-06de60fa5d19fe5a) names this order as a possible home for the publish check's author identity; the order's criteria and surfaces do not include it, so it stays untriaged for WO-078 or planning. Cold start unchanged in both roots (executor 28,112 of 29,246; reviewer 26,884 of 28,884). Product 07 at 184,554 of 196,693 bytes, 156 over main.",
    "Process cost: entry 91698 tokens at 2026-10-10T13:36:48.285Z, handoff 4768141 tokens at 2026-10-10T13:56:48.327Z, source claude-transcript-message-usage, scope dispatch; subagents 0 of 20; reasoning tokens and dollar cost unavailable."
  ],
  "rationale": "Rule beating: carrying VER-001's pass across integration is sound only because the identity was read on both sides and the regenerated projections changed no judged byte; each criterion was re-run from the fixture under the bounded runner or re-read from the source rather than from the handoff's lines. Adjacent Repair: F1 to F3 are repairable defects in the declared surface, but a reviewer writes no behavioral fix and certifies it, and each breaks no criterion and no behavior main had, so they stay boarded with their rules. Known issue: the receipt's refusal-without-merge issue is the Design's declined three-way merge, its reopening condition is written against an operator fork that does not exist, and F2's rule is the bounded first step. Economy: the composed review row at the unchanged identity costs 7.30 s against the executor's 1,094.4 s fresh run and is the row the order's evidence line names. Scope: WO-074 D010's suggestion is new scope for this order and is left to its other named home. NoOp leaves every export frozen at its first commit and WO-078 blocked.",
  "rejected": [
    {"option": "Rerun the review gate fresh at the unchanged identity", "reason": "WO-196's composition rule carries passing tasks at the current code identity; the executor's fresh row at this identity exists, and a repeat supplies no new evidence."},
    {"option": "Repair F1, F2 or F3 in review", "reason": "A reviewer writes no behavioral or test change and certifies it; product 07 routes them to the next repair or the next order that edits the surface, which the placement makes WO-078."},
    {"option": "Fail or reopen on the receipt's criterion-1 known issue", "reason": "It is the order's recorded Design (refusal as the reviewable path; a three-way merge declined), its condition has not occurred, and F2 is already boarded for the case that needs no merge."},
    {"option": "Take on WO-074 D010's author-identity item here", "reason": "It is outside this order's criteria and surfaces; widening an order in review is new scope, and WO-078 is its other named home."}
  ],
  "reopenWhen": "A committed KIT-ACTIONS.json declares an action before F1's rule lands; an update in an operator's starter or fork refuses a kit file whose bytes equal the incoming kit's; an update fails after its kit writes in an operator's starter; or a fork's publish exempts core's operator identity instead of its own."
}
```
