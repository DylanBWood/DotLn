# Entropy Reducer review — REVIEW-002

Subject: commit `5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e`; subject hash `cf4db2192813b44582feeef466489d5125d70c5aa655d4ad3c8d3737c6960dc6`; frozen copy inventoried at 2971 path(s).

Reviewer: **entropy-reducer@1** — `claude-fable-5-1` at effort `max` on `claude-code` 2.1.278; route `launched`; transport `claude-cli-print`; source `command-line-readback-and-invocation`. Effective model and effort: unknown.

This reviewer satisfies the compiled actor requirement by invocation readback. Substitution policy: different-reviewer-and-must-be-attested.

Episode `ep_entropy_cf4db2192813b445` ran 2026-09-22T13:08:02.188Z to 2026-09-22T13:24:35.552Z. Compiled semantic hash `fnv1a64:a2886b8681ad13e3`; work order `wo_entropy_review_1`; authority `auth_entropy_reducer`. Execution boundary: operator-mediated-manual, deferred Program kind All.

Findings: 4 — 4 measured, 0 by inspection; 0 blocking, 2 major, 2 minor. Proposal packets: 3.

Subject binding: an explicitly named commit; bound by its tree object, with the working tree's own drift recorded rather than refused. Tracked status byte-identical across the episode: **false**. Scratch delta: 844 path(s). Installed dependencies: copied. Command execution: file tools confined to the frozen copy by --restricted; shell commands instructed to stay inside it and checked by the tracked-status hash on either side of the episode. Denied tool calls: 0.

**Process cost:** unknown; cause harness-no-readback (episode wall clock 993 s, 64 turns)

## Result envelope summary

Frozen subject 5b4b99ca reviewed in place: 2,971 tracked paths censused, docs/intake never read, tracked tree clean after every probe. Concern disposition: the control fold is cheap (status --json 0.06 s over 810 events) and handoff gaps are 19% of order wall-clock (median 3 min per gap, 40 orders since 2026-09-16), so neither is the constraint; committed projections churn only 40 to 300 lines per merge. The evidenced constraint is evidence volume: 80 self-host logs hold 100.9 MB (56% of 179.8 MB tracked), 97% of it registered source bodies copied by value, and 83.2 MB was added in seven days because a version-only bump re-mints editions and spends a ~320 s live episode to record a hash change. Cold-start context more than doubled since v0.16.0 with six ceiling acceptances in four days and one 1,666-byte paragraph loaded twice per role. plan check makes 3.9 million statSync calls and 212 git spawns (20.5 s). Four measured findings, three packets. Zero of four lens delegates used (no delegate tool in this session); lens questions were worked in the main reviewer. One probe log was written to the system temp directory; nothing else outside the copy.

## Worker statement

{"schemaVersion":1,"findings":[{"findingId":"ER2-001","criterion":"Retained evidence links canonical, content-addressed inputs instead of copying them (docs/product/03-architecture.md §Corpus policy, lines 2196-2200: prefer updating an existing authority and linking it from a view over creating another copy; docs/product/07-execution-guide.md §Documentation freshness and ownership: retaining required evidence does not require repeating it).","severity":"major","evidenceLabel":"measured","observed":"80 tracked docs/evidence/**/feedback*/selfhost-verification.jsonl files total 100,882,272 bytes, 56% of the 179,844,991 tracked bytes. 96.8% of those bytes sit in two record types per log: VerificationOpened (63.4%) and CommandPersisted (33.4%), whose payload embeds the full text of the registered source files twice, as payload.subject.files (49 entries, 596,698 bytes in WO-149/feedback-002) and payload.baseline.files (46 entries, 563,515 bytes), each entry being {path, contents}. Heartbeats are 90% of records but 2.8% of bytes. Consecutive editions (WO-149/feedback-002 vs WO-150/feedback-001) share zero identical lines. 59 such logs (34 orders) totalling 83,201,033 bytes were added between 2026-09-15 and the base commit. The planning refutation receipts show the same by-value shape: 24 JSON receipts total 11,451,460 bytes, growing monotonically from 273,588 bytes (receipt 002) to 814,036 bytes (receipt 024), whose subject field (447,370 bytes) embeds the objective, cost, criteria and non-goals text of all 100 sequenced orders beside a subject hash and sequence hash that already identify them.","expected":"An edition or receipt records its inputs by commit and blob identity (the subject hash it already carries) and keeps only the audited decision, verdicts and counters by value, so per-edition growth is near the 3 MB the non-copy records occupy across all 80 logs (about 40 KB each) rather than 1.26 MB each, and repository size stops growing by tens of megabytes per week from evidence that restates committed source.","reproduction":{"kind":"command","command":"cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 cat | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const b={},n={};for(const l of s.split(\"\\n\")){if(!l)continue;const m=/\"type\":\"([A-Za-z]+)\"/.exec(l);const t=m?m[1]:\"?\";b[t]=(b[t]||0)+l.length+1;n[t]=(n[t]||0)+1}const tot=Object.values(b).reduce((a,c)=>a+c,0);for(const [t,v] of Object.entries(b).sort((x,y)=>y[1]-x[1]))console.log(t,\"records\",n[t],\"bytes\",v,\"(\"+(100*v/tot).toFixed(1)+\"%)\")})'"},"evidenceRefs":["docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl (line 2: VerificationOpened, 1,165,721 bytes; payload.subject.files and payload.baseline.files entries carry {path, contents})","packages/skeleton/src/feedback-selfhost.ts:101-133 (baselineFiles built from source.files) and :214-254 (files array copied into the VerificationSubject)","command: git ls-files -z | xargs -0 wc -c | tail -1 → 179,844,991 total; git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 wc -c | tail -1 → 100,882,272","command: comm -12 <(sort docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl) <(sort docs/evidence/WO-150/feedback-001/selfhost-verification.jsonl) | wc -l → 0","command: git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | tr '\\n' '\\0' | xargs -0 wc -c | tail -1 → 83,201,033","docs/planning/refutations/2026-09-22-planning-9244f56be13bcb2f-024.json (subject 447,370 bytes; subject.orders length 100; result.orders 246,939 bytes)","command: git ls-files docs/planning/refutations | grep '\\.json$' | xargs wc -c | tail -1 → 11,451,460","docs/product/03-architecture.md:2196-2200","docs/product/07-execution-guide.md:1561-1565"],"surface":"docs/evidence/**/feedback*/selfhost-verification.jsonl; packages/skeleton/s

## Validated reviewer output

```json
{
  "schemaVersion": 1,
  "findings": [
    {
      "findingId": "ER2-001",
      "criterion": "Retained evidence links canonical, content-addressed inputs instead of copying them (docs/product/03-architecture.md §Corpus policy, lines 2196-2200: prefer updating an existing authority and linking it from a view over creating another copy; docs/product/07-execution-guide.md §Documentation freshness and ownership: retaining required evidence does not require repeating it).",
      "severity": "major",
      "observed": "80 tracked docs/evidence/**/feedback*/selfhost-verification.jsonl files total 100,882,272 bytes, 56% of the 179,844,991 tracked bytes. 96.8% of those bytes sit in two record types per log: VerificationOpened (63.4%) and CommandPersisted (33.4%), whose payload embeds the full text of the registered source files twice, as payload.subject.files (49 entries, 596,698 bytes in WO-149/feedback-002) and payload.baseline.files (46 entries, 563,515 bytes), each entry being {path, contents}. Heartbeats are 90% of records but 2.8% of bytes. Consecutive editions (WO-149/feedback-002 vs WO-150/feedback-001) share zero identical lines. 59 such logs (34 orders) totalling 83,201,033 bytes were added between 2026-09-15 and the base commit. The planning refutation receipts show the same by-value shape: 24 JSON receipts total 11,451,460 bytes, growing monotonically from 273,588 bytes (receipt 002) to 814,036 bytes (receipt 024), whose subject field (447,370 bytes) embeds the objective, cost, criteria and non-goals text of all 100 sequenced orders beside a subject hash and sequence hash that already identify them.",
      "expected": "An edition or receipt records its inputs by commit and blob identity (the subject hash it already carries) and keeps only the audited decision, verdicts and counters by value, so per-edition growth is near the 3 MB the non-copy records occupy across all 80 logs (about 40 KB each) rather than 1.26 MB each, and repository size stops growing by tens of megabytes per week from evidence that restates committed source.",
      "evidenceRefs": [
        "docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl (line 2: VerificationOpened, 1,165,721 bytes; payload.subject.files and payload.baseline.files entries carry {path, contents})",
        "packages/skeleton/src/feedback-selfhost.ts:101-133 (baselineFiles built from source.files) and :214-254 (files array copied into the VerificationSubject)",
        "command: git ls-files -z | xargs -0 wc -c | tail -1 → 179,844,991 total; git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 wc -c | tail -1 → 100,882,272",
        "command: comm -12 <(sort docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl) <(sort docs/evidence/WO-150/feedback-001/selfhost-verification.jsonl) | wc -l → 0",
        "command: git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | tr '\\n' '\\0' | xargs -0 wc -c | tail -1 → 83,201,033",
        "docs/planning/refutations/2026-09-22-planning-9244f56be13bcb2f-024.json (subject 447,370 bytes; subject.orders length 100; result.orders 246,939 bytes)",
        "command: git ls-files docs/planning/refutations | grep '\\.json$' | xargs wc -c | tail -1 → 11,451,460",
        "docs/product/03-architecture.md:2196-2200",
        "docs/product/07-execution-guide.md:1561-1565"
      ],
      "surface": "docs/evidence/**/feedback*/selfhost-verification.jsonl; packages/skeleton/src/feedback-selfhost.ts; scripts/feedback-evidence.mjs; docs/planning/refutations/*.json; scripts/lib/plan-receipts.mjs",
      "altitude": 6,
      "standardization": {
        "kind": "recurring",
        "rung": "script",
        "rationale": "Every re-mint and every planning receipt repeats the copy, so the standard belongs in the recorder: the self-host recorder and the receipt writer project inputs as {path, blob or subject hash} and their --check forms resolve bytes from Git; the existing feedback-evidence --check and plan check then guard the new shape without a new gate."
      },
      "evidenceLabel": "measured",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && git ls-files -z docs/evidence | grep -z 'selfhost-verification.jsonl$' | xargs -0 cat | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const b={},n={};for(const l of s.split(\"\\n\")){if(!l)continue;const m=/\"type\":\"([A-Za-z]+)\"/.exec(l);const t=m?m[1]:\"?\";b[t]=(b[t]||0)+l.length+1;n[t]=(n[t]||0)+1}const tot=Object.values(b).reduce((a,c)=>a+c,0);for(const [t,v] of Object.entries(b).sort((x,y)=>y[1]-x[1]))console.log(t,\"records\",n[t],\"bytes\",v,\"(\"+(100*v/tot).toFixed(1)+\"%)\")})'"
      }
    },
    {
      "findingId": "ER2-002",
      "criterion": "A mechanism is added only with the removal it pays for, and process activity is not progress by itself (docs/product/07-execution-guide.md §Goal-aligned decisions lines 61-63 and §Discipline, Machinery stand-down, lines 1920-1973).",
      "severity": "major",
      "observed": "scripts/lib/evidence-sources.mjs registers package.json, package-lock.json and every workspace package.json among commonSources (lines 6-8, 28, 31), so any component-version bump makes the authority and feedback editions stale. Release assignment is opt-out by default (docs/PLAYBOOK.md:256-260) and nearly every order bumps a component (the merges for WO-120, WO-063 and WO-149 each change packages/skeleton/package.json and package-lock.json). WO-147-D010 (docs/evidence/WO-147/decisions.md:364-398) records a re-mint whose new feedback edition 'differs from WO-150 revision 001 in exactly one field, subject' at the cost of one live claude-cli-print self-host episode of 320.6 s with unknown token cost, and its followup instructs the planner to price this into every order that edits a registered source. Between 2026-09-15 and the base commit, 59 feedback edition logs were minted for 34 orders while 49 final reviews completed; several orders minted two or three (WO-142 three, WO-099 five in total).",
      "expected": "Edition staleness is keyed on the inputs that change the audited behavior (the policy hash, the ten fixtures, the audited source modules), with version pins recorded as metadata, so a version-only bump neither re-mints an edition nor spends a live model episode, and a re-mint that changes only the subject hash cannot occur.",
      "evidenceRefs": [
        "scripts/lib/evidence-sources.mjs:5-8,28,31 (commonSources registers package.json, package-lock.json, packages/*/package.json)",
        "docs/evidence/WO-147/decisions.md:364-398 (WO-147-D010: feedback edition differs in exactly one field; live episode 320.6 s; followup pricing the episode into every registered-source order)",
        "docs/PLAYBOOK.md:256-260 (release assignment and source updates happen by default; opt out explicitly)",
        "command: git diff --name-only 5b4b99ca^1 5b4b99ca → includes package-lock.json, packages/console/package.json, packages/skeleton/package.json (same for 0a23a611 and 4d52b540)",
        "command: git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | cut -d/ -f3 | sort -u → 34 orders",
        "command: grep -h '\"type\":\"FinalReviewCompleted\"' docs/control/orders/*.jsonl | grep -c -E '\"recordedAt\":\"2026-09-(1[5-9]|2[0-9])' → 49",
        "docs/evidence/current.json (feedback edition WO-149 revision 002)"
      ],
      "surface": "scripts/lib/evidence-sources.mjs; packages/skeleton/src/feedback-selfhost.ts (validateSelfhost subject comparison, lines 172-189, 212); scripts/feedback-evidence.mjs; docs/evidence/current.json",
      "altitude": 5,
      "standardization": {
        "kind": "recurring",
        "rung": "test",
        "rationale": "The rule fires on every order that bumps a version, so the cheapest executable standard is a regression in the feedback-evidence suite asserting that a version-only change to package.json and package-lock.json leaves feedback-evidence --check current while a policy or fixture change still stales it."
      },
      "evidenceLabel": "measured",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && git log --since=2026-09-15 --diff-filter=A --name-only --format= -- 'docs/evidence/*/feedback*/selfhost-verification.jsonl' | sort -u | wc -l"
      }
    },
    {
      "findingId": "ER2-003",
      "criterion": "Cold-start ceilings in docs/control/budgets.json bound installed CLAUDE.md plus the role skill per role (docs/product/07-execution-guide.md §Discipline, Process budget, lines 1858-1868), and a session gets a build, not a biography (README.md:64-66).",
      "severity": "minor",
      "observed": "node scripts/harness-context.mjs --check reports, against comparison edition v0.16.0 (tagged 2026-09-09): executor 24,412 bytes of a 24,576 ceiling (164 bytes of headroom) from 10,847; verifier 21,365 of 25,151 from 8,232; reviewer 22,543 of 24,576 from 8,665; planner 15,033 from 5,455; release-close 13,967 from 6,107, that is +125% to +176% in thirteen days. docs/control/budgets.json holds six coldStartBytes acceptances dated 2026-09-17 to 2026-09-20, each raising a ceiling by one 4 KB step under the standing route that never trims, so the check has never bound and each breach costs an acceptance record plus a decision entry. The 1,666-byte paragraph beginning 'DotLn has five refusals' at CLAUDE.md:62 is repeated verbatim in all six generated skills (for example .claude/skills/dotln-executor/SKILL.md:48), so every role loads it twice; for the executor that is 6.8% of its measured cold start.",
      "expected": "Shared floor text is emitted once per session (in the floor, referenced by the skill), and the cold-start metric is a per-edition delta the meter reports without an acceptance ritual, or a ceiling that can actually refuse; the operator's decision that needed rules outrank caps is preserved either way.",
      "evidenceRefs": [
        "command output: executor 24412 of 24576 prev 10847; verifier 21365 of 25151 prev 8232; reviewer 22543 of 24576 prev 8665; release-close 13967 of 16384 prev 6107; planner 15033 of 24576 prev 5455",
        "docs/control/budgets.json (limits.coldStartBytes; acceptances dated 2026-09-17, 2026-09-17, 2026-09-18, 2026-09-18, 2026-09-19, 2026-09-20 for coldStartBytes.*)",
        "CLAUDE.md:62 (1,666-byte five-refusals paragraph) and .claude/skills/dotln-executor/SKILL.md:48 (identical paragraph); grep -c -F count is 1 in each of the six skills",
        "command: git tag -l --format='%(taggerdate:short) %(refname:short)' v0.16.0 → 2026-09-09",
        "docs/product/07-execution-guide.md:1858-1874 (the raise-by-4-KB route and WO-054-D006)",
        "README.md:64-66"
      ],
      "surface": "docs/control/budgets.json; packages/skeleton/src/loadouts/contributor.ts (generator of CLAUDE.md harness block and skills); .claude/skills/*/SKILL.md; .agents/skills/*/SKILL.md; scripts/lib/harness-context.mjs",
      "altitude": 6,
      "standardization": {
        "kind": "recurring",
        "rung": "script",
        "rationale": "Both the duplication and the acceptance ritual recur with every bundle regeneration, so the fix belongs in the generator and the measuring script: emit the shared paragraph once and have harness-context report the delta since the previous edition as the metric npm run meta already prints."
      },
      "evidenceLabel": "measured",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && node scripts/build.mjs >/dev/null && node scripts/harness-context.mjs --check | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{for(const r of JSON.parse(s).profiles)if(r.skillsRoot===\".claude/skills\")console.log(r.role,r.bytes,\"of\",r.ceiling,\"prev\",r.previousBytes)})' && grep -c -F \"$(grep -m1 '^DotLn has five refusals' CLAUDE.md)\" .claude/skills/*/SKILL.md"
      }
    },
    {
      "findingId": "ER2-004",
      "criterion": "Recurring procedure is automated so it costs less than the failure it prevents, and a document check's cost is part of the gate it joins (docs/product/07-execution-guide.md §Discipline, Automate recurring procedure, lines 1616-1624; WO-151 Cost line reporting the gate step count, docs/work-orders/WO-151-entropy-reducer-dispatch.md:15-18).",
      "severity": "minor",
      "observed": "node scripts/refute-plan.mjs check takes 20.54 s real on the frozen subject, against 0.88 s for work-orders index --check, 0.55 s for meta --check and 0.14 s for check-publication. During that run fs.statSync is called 3,879,656 times and spawnSync 212 times; the CPU profile puts 56.5% of self time in statSync/stat, 9.1% in path normalization and 6.9% in loadConfig at scripts/lib/config.mjs:440, consistent with the launchpad configuration being resolved per path rather than once per process. npm run test:docs runs this work as two tasks of about 25 s each (plan 24.90 s, plan-refutation-current 24.83 s) inside a 30.66 s gate that every planning pass and final review executes.",
      "expected": "One configuration resolution per process and batched Git reads bring plan check into the same sub-second band as the other document checks, shortening every test:docs run by roughly the two 25 s tasks.",
      "evidenceRefs": [
        "command output: statSync calls: 3879656",
        "command: NODE_DEBUG=child_process node scripts/refute-plan.mjs check 2>&1 >/dev/null | grep -c -E 'CHILD_PROCESS.*spawn' → 212",
        "command: /usr/bin/time -p sh -c 'node scripts/refute-plan.mjs check' → real 20.54 (index --check 0.88, meta --check 0.55, check-publication 0.14)",
        "CPU profile (node --cpu-prof, profile directory removed afterwards): statSync node:fs 37.6%, stat 18.9%, normalizeString node:path 9.1%, loadConfig scripts/lib/config.mjs:440 6.9%, spawnSync 6.9%, anonymous scripts/lib/plan-subject.mjs:308 3.6%",
        "test:docs run: PASS plan 24.90 s; PASS plan-refutation-current 24.83 s; npm run test:docs: 19 passed; 0 failed; 30.66 s",
        "scripts/lib/config.mjs:440; scripts/lib/plan-subject.mjs:308"
      ],
      "surface": "scripts/refute-plan.mjs; scripts/lib/plan-subject.mjs; scripts/lib/config.mjs (loadConfig); scripts/test-runner.mjs document selection",
      "altitude": 9,
      "standardization": {
        "kind": "recurring",
        "rung": "script",
        "rationale": "The cost is paid on every planning pass and every final review through test:docs, so the standard is in the script itself: memoize loadConfig per process and read the subject's Git state in one batched call, then let the existing test:docs timing rows show the reduction."
      },
      "evidenceLabel": "measured",
      "reproduction": {
        "kind": "command",
        "command": "cd <frozenSubjectPath> && node --input-type=module -e 'import fs from \"node:fs\";import {syncBuiltinESMExports} from \"node:module\";let n=0;const o=fs.statSync;fs.statSync=function(...a){n++;return o.apply(this,a)};syncBuiltinESMExports();process.argv=[process.argv[0],\"scripts/refute-plan.mjs\",\"check\"];process.on(\"exit\",()=>console.error(\"statSync calls:\",n));await import(\"./scripts/refute-plan.mjs\")' 2>&1 >/dev/null | tail -1"
      }
    }
  ],
  "proposalPackets": [
    {
      "schemaVersion": 1,
      "kind": "ProductSuggestionPacket",
      "proposedPath": "docs/proposals/content-addressed-evidence-inputs/",
      "sourceEpisodeId": "ep_entropy_cf4db2192813b445",
      "provenance": [
        "Entropy Reducer review of frozen subject 5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e (subjectHash cf4db2192813b44582feeef466489d5125d70c5aa655d4ad3c8d3737c6960dc6), finding ER2-001",
        "Measured in the frozen copy with the ER2-001 reproduction command and the byte census commands listed in its evidenceRefs",
        "Reviewer: entropy-reducer@1 as claude-fable-5-1 at max effort in Claude Code; no delegate lens used"
      ],
      "corroboratingEvidenceRefs": [
        "docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl line 2 (payload.subject.files and payload.baseline.files carry {path, contents})",
        "packages/skeleton/src/feedback-selfhost.ts:214-254",
        "docs/planning/refutations/2026-09-22-planning-9244f56be13bcb2f-024.json (subject 447,370 bytes embedding 100 orders' text beside subject.hash and sequenceHash)",
        "docs/product/03-architecture.md:2196-2200 (artifact growth: intervene when a problem is evidenced; link an authority rather than copy)",
        "git ls-files byte census: 100,882,272 of 179,844,991 tracked bytes in 80 self-host logs; 83,201,033 bytes added since 2026-09-15"
      ],
      "dissentingEvidenceRefs": [
        "docs/evidence/WO-147/decisions.md:388-390 (WO-147-D010 rejected copying an older self-host log because the old log records a different subject hash; a by-reference edition must still bind its own subject)",
        "docs/planning/refutations/README.md (receipts are filed as an immutable pair with a plain subject so a reader needs no other file; by-reference receipts trade that self-containment for size)",
        "docs/product/03-architecture.md:2131-2142 (verbatim-with-scrubbing is the author's personal-profile default for retained transcripts)"
      ],
      "suggestion": {
        "suggestionId": "content-addressed-evidence-inputs",
        "submittedBy": "entropy-reducer@1 (claude-fable-5-1, max, claude-code) — non-authoritative",
        "problemOrOpportunity": "Feedback self-host editions and planning refutation receipts copy committed inputs by value. The 80 self-host logs are 56% of all tracked bytes and 97% of their content is the full text of registered source files stored twice per edition; the 24 refutation receipts embed every sequenced order's text and grow linearly with the sequence. The repository gained 83 MB of such copies in the seven days before the base commit, which every clone, fetch, integrating final review and stranger to the session pays for while the same bytes already exist in Git under a hash the edition records.",
        "scope": "The recorder in packages/skeleton/src/feedback-selfhost.ts and scripts/feedback-evidence.mjs projects subject and baseline files as {path, blobHash} resolved from the committed tree, and validateSelfhost and feedback-evidence --check resolve bodies from Git when they need them; scripts/lib/plan-receipts.mjs stores the subject by revision and hash with the order text resolvable from the committed subject at that revision. Existing editions and receipts stay byte-identical; only new ones change shape, with the edition schema version bumped.",
        "evidenceRefs": [
          "ER2-001 reproduction command and observed output",
          "docs/evidence/WO-149/feedback-002/selfhost-verification.jsonl",
          "packages/skeleton/src/feedback-selfhost.ts:101-133,214-254",
          "docs/planning/refutations/2026-09-22-planning-9244f56be13bcb2f-024.json",
          "git ls-files byte census commands in ER2-001 evidenceRefs"
        ],
        "affectedUsers": [
          "the operator (clone, fetch and worktree creation time; PR diff size at integrating final reviews)",
          "final reviewers and verifiers reading evidence diffs",
          "planning refuters reading receipts",
          "strangers to the session who fork or clone the repository"
        ],
        "affectedSystems": [
          "docs/evidence/**/feedback*/",
          "docs/planning/refutations/",
          "packages/skeleton/src/feedback-selfhost.ts",
          "scripts/feedback-evidence.mjs",
          "scripts/lib/plan-receipts.mjs",
          "npm run test:docs (feedback-evidence and plan checks)"
        ],
        "expectedValue": "About 1.2 MB less per feedback edition and about 0.4 MB less per refutation receipt, which at the observed rate (59 editions and 3 receipts per week) stops roughly 80 MB of weekly repository growth while preserving every existing immutable record and the subject hashes that bind them.",
        "altitude": 6,
        "uncertainty": "Whether any consumer of validateSelfhost or of a receipt needs the file bodies without a Git checkout (for example a rendered receipt read on GitHub) is not measured; the current recorder's reason for copying baseline and subject is inferred from the code, not from a decision record.",
        "risks": [
          "A by-reference edition is not self-contained outside the repository; a reader without the Git objects cannot reconstruct the audited bytes",
          "A future history rewrite would strand references, which the repository's immutability rules already forbid",
          "The edition schema change re-mints the current editions once and needs the usual evidence-source edition duty"
        ],
        "alternatives": [
          "Keep the shape and move the two copy-carrying record types to Git LFS or a release asset",
          "Compress the embedded contents in place (roughly 5 to 10 times smaller, still by value)",
          "Retain only the latest edition per family and archive older ones outside the tracked tree",
          "Accept the growth and record the decision with a size budget in docs/control/budgets.json"
        ],
        "duplicationHints": [
          "docs/product/07-execution-guide.md §Candidate — local lane retention (ignored lanes, not tracked evidence)",
          "docs/product/03-architecture.md §Corpus policy artifact-growth discussion (2026-09-06)",
          "REVIEW-001 packet reference-and-status-integrity-lint (different subject: cross-reference integrity)"
        ],
        "urgencyRationale": "Growth is 83 MB per week at the current order cadence and the evidence class already exceeds half of the tracked bytes; each further order re-mints at least once, so the cost compounds with every close until the recorder changes."
      }
    },
    {
      "schemaVersion": 1,
      "kind": "ProductSuggestionPacket",
      "proposedPath": "docs/proposals/behavioral-staleness-key-for-evidence-editions/",
      "sourceEpisodeId": "ep_entropy_cf4db2192813b445",
      "provenance": [
        "Entropy Reducer review of frozen subject 5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e, finding ER2-002",
        "Measured with git log over docs/evidence feedback editions and the control segments' FinalReviewCompleted events in the frozen copy",
        "Reviewer: entropy-reducer@1 as claude-fable-5-1 at max effort in Claude Code"
      ],
      "corroboratingEvidenceRefs": [
        "scripts/lib/evidence-sources.mjs:5-8,28,31 (package.json, package-lock.json and workspace package.json files are registered sources of every edition family)",
        "docs/evidence/WO-147/decisions.md:364-398 (WO-147-D010: the re-minted feedback edition differs in exactly one field, the subject hash; live episode 320.6 s; followup prices the episode into every registered-source order)",
        "docs/PLAYBOOK.md:256-260 (release assignment is opt-out, so nearly every order bumps a component)",
        "git log --since=2026-09-15 --diff-filter=A: 59 feedback editions for 34 orders against 49 final reviews"
      ],
      "dissentingEvidenceRefs": [
        "docs/evidence/WO-147/decisions.md:388-390 (WO-147-D010 rejected relaxing or bypassing the staleness check because it stops a source change from inheriting an older live audit)",
        "docs/evidence/WO-147/decisions.md:396 (D010 followup treats the live episode as a cost to declare, not a defect to remove)",
        "docs/product/07-execution-guide.md:2017-2028 (write once, run once: new source bytes require a new product gate; the same instinct argues for re-auditing on any source change)"
      ],
      "suggestion": {
        "suggestionId": "behavioral-staleness-key-for-evidence-editions",
        "submittedBy": "entropy-reducer@1 (claude-fable-5-1, max, claude-code) — non-authoritative",
        "problemOrOpportunity": "The edition re-mint rule fires on any byte change to any registered source, and the registered list includes package.json, package-lock.json and every workspace package.json. Because release assignment is opt-out, nearly every order bumps a version and therefore re-mints the authority and feedback editions and spends one live model episode of about 320 s to record an edition that differs from its predecessor only in the subject hash, as WO-147-D010 documents. In the seven days before the base commit that produced 59 feedback editions for 34 orders.",
        "scope": "Split the edition subject into a behavioral key (policy hash, fixtures, the audited compiler and skeleton modules) and a pins record (versions, lock file). Staleness and the live self-host requirement follow the behavioral key; a pins-only change updates the pins record deterministically without a live episode. WO-147-D010's rejection of bypassing the check is preserved: a behavioral change still cannot inherit an older live audit.",
        "evidenceRefs": [
          "ER2-002 reproduction command and observed count 59",
          "scripts/lib/evidence-sources.mjs:5-8,28,31",
          "docs/evidence/WO-147/decisions.md:364-398",
          "docs/PLAYBOOK.md:256-260"
        ],
        "affectedUsers": [
          "executors and final reviewers who currently re-mint editions and run the live self-host episode",
          "the operator paying model spend and wall-clock for hash-only editions",
          "planners who must price the episode into every registered-source order (D010 followup)"
        ],
        "affectedSystems": [
          "scripts/lib/evidence-sources.mjs",
          "packages/skeleton/src/feedback-selfhost.ts (validateSelfhost subject comparison)",
          "scripts/feedback-evidence.mjs and scripts/authority-evidence.mjs",
          "docs/evidence/current.json",
          "npm run test:docs feedback-evidence and authority-evidence checks"
        ],
        "expectedValue": "Removes one live model episode (about 320 s and its unknown token cost) and about 1.3 MB of evidence from most orders, leaving re-mints only where the audited behavior changed; combined with content-addressed inputs it removes the dominant per-order evidence cost.",
        "altitude": 5,
        "uncertainty": "Which registered sources actually bear on the feedback audit's outcome is inferred from D010's field-by-field comparison and the recorder's code, not from a documented input model; the authority edition is deterministic and may already be cheap enough to leave keyed as it is.",
        "risks": [
          "A behavioral key that omits a real input would let a behavior change inherit a stale live audit, the exact failure D010 guards against",
          "The split adds a second identity to reason about in receipts and reviews",
          "Historical Cost lines that priced the episode into orders become non-comparable with later ones"
        ],
        "alternatives": [
          "Keep the rule and only remove package-lock.json and the workspace package.json files from commonSources",
          "Keep the rule and make the live episode optional when the newly generated feedback.json differs from the previous edition only in the subject field (a mechanical comparison D010 already performed by hand)",
          "Accept the cost and continue pricing it into every order as D010's followup directs"
        ],
        "duplicationHints": [
          "docs/evidence/WO-147/decisions.md WO-147-D010 followup (planner prices the episode; does not change the trigger)",
          "docs/evidence/WO-143/decisions.md WO-143-D002 and docs/evidence/WO-150/decisions.md WO-150-D006 (executor-side re-mints of the same class)",
          "docs/planning/followups.json rows harvested from those decisions"
        ],
        "urgencyRationale": "The rule fires on most orders at the current cadence, so each close adds a live episode and a megabyte of evidence; the cost is recurring and grows with the sequence, not with any single order."
      }
    },
    {
      "schemaVersion": 1,
      "kind": "ProductSuggestionPacket",
      "proposedPath": "docs/proposals/cold-start-trend-and-single-source-floor/",
      "sourceEpisodeId": "ep_entropy_cf4db2192813b445",
      "provenance": [
        "Entropy Reducer review of frozen subject 5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e, finding ER2-003",
        "Measured with node scripts/harness-context.mjs --check after node scripts/build.mjs in the frozen copy, and grep -c -F of the CLAUDE.md paragraph across .claude/skills/*/SKILL.md",
        "Reviewer: entropy-reducer@1 as claude-fable-5-1 at max effort in Claude Code"
      ],
      "corroboratingEvidenceRefs": [
        "harness-context --check output: executor 24,412 of 24,576 (previous 10,847); verifier 21,365 of 25,151 (8,232); reviewer 22,543 of 24,576 (8,665); planner 15,033 (5,455); release-close 13,967 (6,107); comparison edition v0.16.0 tagged 2026-09-09",
        "docs/control/budgets.json acceptances dated 2026-09-17 (reviewer, release-close), 2026-09-18 (executor, release-close, verifier), 2026-09-19 (reviewer), 2026-09-20 (verifier)",
        "CLAUDE.md:62 and .claude/skills/dotln-executor/SKILL.md:48 (identical 1,666-byte paragraph; present once in each of the six skills)",
        "README.md:64-66 (a build, not a biography)"
      ],
      "dissentingEvidenceRefs": [
        "docs/control/budgets.json source field and docs/product/07-execution-guide.md:1858-1868 (operator direction 2026-09-17: a breached ceiling is raised by one 4 KB step with the rule named, never trimmed around; WO-044 decision that caps yield to needed rules)",
        "docs/evidence/WO-054/decisions.md WO-054-D006 (operator directed incrementing budgets now and reviewing efficiency later)",
        "docs/product/07-execution-guide.md:8-9 and 60-73 of CLAUDE.md (the harness block is generated residue so both harnesses read the refusals in the floor; skills may repeat it so a skill read alone is complete)"
      ],
      "suggestion": {
        "suggestionId": "cold-start-trend-and-single-source-floor",
        "submittedBy": "entropy-reducer@1 (claude-fable-5-1, max, claude-code) — non-authoritative",
        "problemOrOpportunity": "Cold-start bytes per role have grown between 125% and 176% since v0.16.0 (thirteen days), the executor sits 164 bytes under its ceiling, and the ceiling route has produced six acceptance records in four days without ever refusing anything, so it now costs a record per breach while reporting no trend. One 1,666-byte paragraph of the floor is repeated verbatim in each of the six generated skills, so every role loads it twice.",
        "scope": "In the contributor bundle generator, emit the shared refusal paragraph once in the floor and have each skill reference it by name; in scripts/lib/harness-context.mjs and npm run meta, report the per-role delta since the previous edition and the fraction of the skill that is shared floor text as the cold-start metric, and retire the ceiling-plus-acceptance route for that metric under the operator's existing decision that needed rules outrank caps. The reviewed rules themselves are not trimmed.",
        "evidenceRefs": [
          "ER2-003 reproduction command and its output",
          "docs/control/budgets.json",
          "CLAUDE.md:62; .claude/skills/dotln-executor/SKILL.md:48",
          "docs/product/07-execution-guide.md:1858-1874"
        ],
        "affectedUsers": [
          "every model session that cold-starts a role (executor, verifier, reviewer, release-close, planner, refuter)",
          "the operator who records acceptances and reads npm run meta",
          "the planner who reads the meter's drift signals"
        ],
        "affectedSystems": [
          "packages/skeleton/src/loadouts/contributor.ts (bundle generator)",
          "CLAUDE.md harness block and AGENTS.md symlink",
          ".claude/skills/*/SKILL.md and .agents/skills/*/SKILL.md",
          "scripts/lib/harness-context.mjs and docs/control/budgets.json",
          "npm run meta drift-to-low-performance row"
        ],
        "expectedValue": "About 1.7 KB less per role per cold start immediately (6.8% for the executor), no further acceptance records for a metric that cannot bind, and a trend the meter can actually flag; the Codex profile benefits identically because it loads the same generated bodies.",
        "altitude": 6,
        "uncertainty": "Whether a skill must remain complete when read without the floor (for example by a harness that loads only the skill) is not established; if it must, the dedup is not available and only the metric change applies. Token cost is not measured; bytes are the recorded metric.",
        "risks": [
          "A skill that references the floor instead of restating it depends on the floor being loaded first in every supported harness",
          "Retiring the ceiling removes a documented, if never-binding, refusal surface that some receipts cite"
        ],
        "alternatives": [
          "Keep the ceiling but raise it once to a value with real margin and stop recording per-breach acceptances",
          "Trim reviewed rules, which the operator's 2026-09-17 direction forbids",
          "Leave as is and accept one acceptance record per breach"
        ],
        "duplicationHints": [
          "docs/product/07-execution-guide.md §Candidate — planner startup context (planner reads, not floor bytes)",
          "docs/evidence/WO-054/decisions.md WO-054-D006 (efficiency review deferred to a later pass)",
          "docs/evidence/WO-146/decisions.md WO-146-D008 and WO-140-D005 (prior acceptances)"
        ],
        "urgencyRationale": "The executor is 164 bytes from its ceiling, so the next reviewed rule that touches the shared floor triggers another acceptance record; the trend is monotonic and the mechanism produces cost without information."
      }
    }
  ],
  "resultEnvelope": {
    "workOrderId": "wo_entropy_review_1",
    "episodeId": "ep_entropy_cf4db2192813b445",
    "status": "completed",
    "resultId": "res_entropy_cf4db2192813b445_r2",
    "summary": "Frozen subject 5b4b99ca reviewed in place: 2,971 tracked paths censused, docs/intake never read, tracked tree clean after every probe. Concern disposition: the control fold is cheap (status --json 0.06 s over 810 events) and handoff gaps are 19% of order wall-clock (median 3 min per gap, 40 orders since 2026-09-16), so neither is the constraint; committed projections churn only 40 to 300 lines per merge. The evidenced constraint is evidence volume: 80 self-host logs hold 100.9 MB (56% of 179.8 MB tracked), 97% of it registered source bodies copied by value, and 83.2 MB was added in seven days because a version-only bump re-mints editions and spends a ~320 s live episode to record a hash change. Cold-start context more than doubled since v0.16.0 with six ceiling acceptances in four days and one 1,666-byte paragraph loaded twice per role. plan check makes 3.9 million statSync calls and 212 git spawns (20.5 s). Four measured findings, three packets. Zero of four lens delegates used (no delegate tool in this session); lens questions were worked in the main reviewer. One probe log was written to the system temp directory; nothing else outside the copy.",
    "requiresHuman": true
  },
  "cleanRoom": {
    "status": "passed",
    "stopConditionsFound": false,
    "evidenceRefs": [
      "Census limited to git ls-files output at 5b4b99cab19eacaeb3d09775480c7ad2fa6dff5e (2,971 paths); docs/intake/** was never opened, listed or searched; docs/control/local/** and other ignored lanes were not read",
      "Every command ran inside the frozen copy at subject.frozenSubjectPath; git status --porcelain was empty after the build, after the document checks, after npm run test:docs and at the end; the only writes were ignored build output under packages/*/dist, a temporary CPU-profile directory under node_modules that was removed, and one probe log at /tmp/dotln-entropy-testdocs.log in the system temp directory (disclosed; no repository, control-plane, remote or settings write)",
      "No credentials, employer identifiers, internal service details or private identifiers were encountered in any read surface; account labels and private mappings live only in ignored files that were not read; the reviewer's own session identity was not written into any repository surface",
      "Every finding carries a reproduction command that was actually executed in this episode with the recorded output; no finding is labeled measured on the basis of an unexecuted command",
      "Settled decisions (WO-020 protino pointer file, WO-147-D010, the 2026-09-17 ceiling route, FUP-0006 Program.All, the 100-order sequence limit) were treated as constraints and are cited as dissenting evidence where a packet touches them, not relitigated"
    ]
  }
}
```

## Disposition

```json
{
  "findingCount": 4,
  "proposalPacketCount": 3,
  "proposalFiling": "awaiting operator disposition; not filed",
  "nextStep": "Fresh blinded refutation before any disposition."
}
```

Findings never authorize a fix. Proposal filing and promotion to a work order remain separate operator acts, and this receipt stops at disposition. The JSON and this rendering are immutable; a later attempt files the next number.

Local-terms list: **unavailable**. Receipt hash: `sha256:fe823e4b4bd762a93b9b848de32b96f3991de7f716bbd379a30c467cccb1d40d`.
