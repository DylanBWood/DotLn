# WO-075 decisions

## WO-075-D001

```json
{
  "id": "WO-075-D001",
  "date": "2026-10-09",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.71.0, the next minor above the observed release baseline v0.70.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.70.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-075-kit-runtime-and-bundle.md"
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

## WO-075-D002 — The runtime is the commit's build, copied from a clean tree, hook closure only

```json
{
  "id": "WO-075-D002",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "exportKit builds the runtime at export time and copies it: after refusing a work tree whose pinned inputs differ from HEAD (packages/, tsconfig.json, package.json, package-lock.json and scripts/build.mjs, tracked or untracked; ignored files under a compiled package's src or test, which tsc would compile unseen; and the emit closure, D003), and after refusing an installed TypeScript that is not the commit lockfile's pin, it runs atomicBuild(root) and copies every regular file under packages/{kernel,compiler,skeleton}/dist/src (RUNTIME_PACKAGES, RUNTIME_OUTPUT) into the export as manifest-listed kit files with SHA-256; packages/<name>/package.json travel as Git blobs at the commit; dist/test and *.tsbuildinfo never travel. The three packages are the hook closure the generated hooks and the kit's resume and harness commands import (the smoke's scratch builds its runtime from the same three); console and browser-evidence stay out. A checkout without package sources (no packages/<name>/tsconfig.json, atomicBuild's own criterion, as a kit is) refuses by name; an export must run from the checkout that holds the running scripts (TOOL_ROOT), because the prediction of the bundle loads that checkout's compiled packages.",
  "evidence": [
    "scripts/launchpad.mjs: RUNTIME_PACKAGES, RUNTIME_OUTPUT, BUILD_INPUTS, dirtyPinnedInputs, readRuntime, exportKit",
    "scripts/build.mjs atomicBuild: tsc -b --force over a staged copy of the package sources, published by rename; a full build of the five packages took about 0.6 s wall clock on this host (TypeScript 7.0.2 native)",
    "scripts/test-launchpad.mjs 'WO-075 criterion 1': every manifest-listed packages/*/dist/src file equals the same path in a clone of the committed copy at the named commit, rebuilt with the clone's own scripts/build.mjs, and the rebuilt dist/src sets equal the manifest's; no packages/*/src/**/*.ts, dist/test or tsbuildinfo in the export; the forty pinned runtime files are among the listed paths",
    "scripts/test-launchpad.mjs 'WO-075 design: a package source that differs from HEAD', 'the emit closure ... is pinned to HEAD' (a dirty scripts/lib/terms.mjs and an ignored packages/kernel/src/stray.ignored.ts each refuse before any write) and 'a host Git configuration ...' (an export from a kit refuses: no package sources)",
    "docs/evidence/WO-075/export-run.md: the evidence export from the committed copy of this work tree, its rebuild comparison (270 runtime files byte-identical, sets equal) and the kit manifest's launchpad.mjs hash equal to the work tree's",
    "scripts/harness-live-smoke.mjs lines 86 to 101 at the base: the scratch runtime is compiler, skeleton and kernel dist/src with their package.json"
  ],
  "goalAlignment": {
    "traps": "Rule beating: copying whatever dist the work tree holds would pass the fixture while the tree is clean and ship a stale or local build otherwise, so the export builds from pinned inputs it has verified equal to the commit and refuses anything else. Seeking the wrong goal: carrying console and browser-evidence too would make the kit heavier and bind it to Playwright for nothing the criteria judge. Shifting the burden: letting a fork rebuild at first use would make the kit's governance depend on TypeScript sources the kit does not carry.",
    "noOp": "No runtime in the export: the kit's hooks and the resume dispatches that reserve a writer stay unusable in a fork (WO-074's recorded limit), and WO-076, WO-077, WO-078, WO-082 and WO-118 stay blocked."
  },
  "rejected": [
    { "option": "Copy packages/*/dist as found in the work tree, without building", "reason": "Nothing would tie the copy to the commit; a stale dist would travel under the commit's name." },
    { "option": "Read the compiled files as Git blobs", "reason": "dist is ignored; the commit holds sources, not output. The build from verified-clean sources is the commit's build, and the fixture's rebuild proves it byte for byte." },
    { "option": "Carry all five packages", "reason": "The criteria judge the hook closure and the resume and harness commands; console and browser-evidence add Playwright and a browser the kit never runs (D010 names the two scripts that reach them)." },
    { "option": "A kit/runtime/ location, minified output or npm publication", "reason": "Declined by the order: the scripts import packages/<name>/dist/ and the compiler admits no other snapshot location; reviewable compiled output is the point; the workspaces stay private." }
  ],
  "reopenWhen": "A kit command fails on a package the kit omits (D010), a compiled package joins the hook closure, the runtime must be read from an artifact rather than built, or a fork must re-export (then the kit needs a committed-dist source for exportKit)."
}
```

## WO-075-D003 — The export is its own repository and emits its own bundle, predicted and screened before the first write

```json
{
  "id": "WO-075-D003",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "After the kit files and seeds are written, exportKit runs git init -q -b main in the destination (with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR and GIT_PREFIX removed from the environment, and asserts the export's own .git exists), seeds the node_modules/@dotln/<name> links that npm ci will recreate for the four workspaces, and spawns the export's own node scripts/harness.mjs emit with cwd = the export and DOTLN_LAUNCHPAD unset, then its own node scripts/harness.mjs check. The harness CLI resolves its root as the physical Git top level, so the export must be a repository before its emit; the ascent in scripts/lib/config.mjs stops at that .git, so the export is its own launchpad from then on and WO-074's enclosing-work-tree advisory is retired (an export made inside another repository's work tree is an embedded repository there). The bundle is predicted in-process before any write: harnessInstallation({ runtimeRoot }) over the fresh build with the operating contract composed as emitHarness composes it (template floor, two newlines, the marked block), plus the harness manifest; the local-terms screen covers the predicted surfaces with the kit files and seeds, the kit manifest lists every surface but CLAUDE.md at the predicted bytes, and after the spawned emit every predicted surface must equal its file byte for byte, or the export refuses naming the path. The work tree's copies of the emit closure (scripts/harness.mjs, scripts/lib/harness.mjs and its static imports config, git, helpers, paths and terms) must equal HEAD, because the prediction runs the work tree's copies while the export runs the commit's. Right after git init, git check-ignore over every manifest-listed path refuses an export whose Git (the seeded .gitignore or the host's excludes) would drop a kit file from the fork's first commit, naming the remedy. The refusals after the first write (an ignored kit file, an emit whose bytes differ from the prediction, a failing check) leave the written destination in place for inspection and say so; the absent KIT-MANIFEST.json marks a partial export, and a second export into it is refused as a non-empty destination until it is removed. The bin targets of the runtime packages are written executable, so the fork's own npm ci, which makes them executable, leaves a committed tree clean (README order: commit, then install). KIT_WORKSPACES gains the three compiled packages, so the pruned lockfile carries their entries and links (skeleton pins typescript 7.0.2, which the root development dependency satisfies).",
  "evidence": [
    "packages/skeleton/src/harness-host.ts harnessRoot: 'Harness requires the verified worktree root' unless realpath(cwd) equals git rev-parse --show-toplevel",
    "scripts/lib/harness.mjs emitHarness line 261 at the base: a floor without harness markers gets floor.trimEnd() + '\\n\\n' + block; the kit template holds no harness marker",
    "scripts/launchpad.mjs: EMIT_CLOSURE, GIT_ENVIRONMENT, exportEnvironment, expectedHarnessBundle, harnessInExport, ignoredKitPaths, exportKit",
    "The probe export in this session: the spawned emit's 33 surfaces equalled the prediction byte for byte, harness check passed before and after npm ci --offline (9 packages, 0.3 s), a one-byte drift in .claude/hooks/no-attribution.mjs was refused by name, a second emit changed no listed byte, and no hook holds an absolute import specifier (the hooks import ../../.runtime/harness/acf4f99ae6bf54ba/packages/skeleton/dist/src/...)",
    "scripts/test-launchpad.mjs 'WO-075 criterion 2', 'WO-074 criterion 1: ... manifest lists every kit file and no seed' (every installed surface but CLAUDE.md listed; the export is a repository on main with no commit), 'a destination inside a Git work tree becomes its own repository', 'a host Git configuration that would ignore a kit file refuses the export by name' (GIT_CONFIG_* naming a core.excludesFile with dist/), 'WO-074 criterion 3: ... refuses' (a term present only in a predicted surface refuses before any write)",
    "Grants are compiled into the Contributor program (packages/skeleton/src/loadouts/contributor.ts contributorOutsideAuthority); packages/skeleton/loadouts/grants.json is [] in core and the seed, so the predicted and the emitted bundle share every input but the floor",
    "docs/evidence/WO-074/decisions.md D002 reopenWhen: 'WO-075 adds files after the write ... which needs a manifest and terms step after those additions'; D003 reopenWhen: 'WO-075 step 4 lists CLAUDE.md as an emitted surface in the manifest'"
  ],
  "rejected": [
    { "option": "Emit in-process from core and never run the export's own emit", "reason": "It would prove nothing about the export's self-sufficiency and would bake core's instance data into a fork if the two ever diverge; the spawned emit runs the export's scripts, its copied runtime and its own registry, and the prediction judges it." },
    { "option": "Run the terms screen over the emitted surfaces after the emit and delete the destination on a match", "reason": "WO-074-D006's 'a refused export writes nothing' would become 'writes and removes'; predicting the bytes keeps the single pre-write screen and the post-write equality proves the prediction." },
    { "option": "Require the operator to git init before the export, or emit only at first use", "reason": "The order wants the bundle present and manifest-listed at export time; the harness CLI needs the repository, and git init of an empty directory is the smaller change. The fork's first commit stays its own." },
    { "option": "List CLAUDE.md in KIT-MANIFEST.json", "reason": "A listed file is replaced by every kit update (WO-077) and a fork edits its floor; the generated block is governed by harness check through the listed .claude/harness-manifest.json, whose marked-block hash covers it." },
    { "option": "Keep WO-074's fixture prefix .claude/ as an instance path", "reason": "The generated settings, hooks, skills and agent definition are kit files a re-emit rewrites; only .claude/settings.local.json is operator-owned, and the kit .gitignore, the README and the fixture now say so." },
    { "option": "Remove the destination when a post-write refusal fires, so 'a refused export writes nothing' stays literally true", "reason": "Deleting a tree the operator may want to inspect hides the cause; the message names the partial export and its marker instead (WO-074-D006's property holds for every pre-write refusal, which is where the local-terms screen and the pinned-input refusals sit)." }
  ],
  "reopenWhen": "WO-077's update must re-emit rather than copy the listed surfaces (the entries are verification hashes of derived output, and a copied bundle would import a snapshot the fork never installed); a fork emits a profile subset and the manifest lists surfaces that no longer exist; a kit input other than the floor differs between core and a fork; or GIT_* must be honoured for an export."
}
```

## WO-075-D004 — Kit templates, the client README, product 08 and the Codex dispatch inside an export

```json
{
  "id": "WO-075-D004",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "scripts/kit/CLAUDE.template.md gains core's Start here section (the @skills mapping and the five Read[role] directives), because the directives live in core's hand-written floor, not in the generated block, and without them a session's directed-read set never holds the role skill the resume phrase selects, so no smoke record could pass; the template intro names both generated blocks and their generators, and the kit block says what the export carries, what harness check verifies (the pinned snapshot and every generated surface; KIT-MANIFEST.json hashes the runtime) and that a fresh clone emits once. README.client.md: the export is a repository with no commit, npm ci replaces the seeded links, harness check and the fresh-clone emit (or bootstrap), the lifecycle dispatches run including the Codex ones that reserve a writer, npm run build, npm test and npm run harness still need the omitted TypeScript source (FUP-8fb7ae17dd0fad5b), the kit-file list with the runtime and the bundle, the generated settings and hooks as kit files, and the compiled runtime under the same terms. first-order.template.md item 3 records the check as observed and names the live smoke as the instance's choice. docs/product/08-publication-compiler.md joins KIT_FILES.documents because the emitted reviewer skill directs a read of its 'PRs and commits' section; node scripts/harness-context.mjs --check inside an export resolves every installed Read directive and now passes. With the runtime present, a Codex-session dispatch in the export reserves its writer and records the request instead of refusing, which WO-074's fixture asserted; the fixture now asserts the reservation (phase verifying, owner source thread).",
  "evidence": [
    "CLAUDE.md lines 49 to 68 at the base: the Start here section with the Read[role] directives sits before the dotln-harness marker (line 69)",
    "scripts/lib/harness-context.mjs directedReads and readDirectives: the directed set is CLAUDE.md plus the Read directives of the floor and the skill; packages/skeleton/src/harness-host.ts records a Skill invocation as a read of the skill path",
    ".claude/skills/dotln-reviewer/SKILL.md line 55: Read: docs/product/08-publication-compiler.md#PRs and commits; node scripts/harness-context.mjs --check in the probe export exited 1 naming that unresolved file before 08 was carried and 0 after",
    "The probe export in this session: a Codex-session verify (CODEX_THREAD_ID set) after activate and implementation-ready exited 0, printed the session briefing, moved the phase to verifying and left the writer reserved with owner source thread; scripts/resume.mjs line 1116 at the base refuses only when packages/skeleton/dist/src/harness-host.js is absent",
    "scripts/test-launchpad.mjs 'WO-074 criterion 1: ...' (the five Read[role] directives in the export's CLAUDE.md, the harness block after the kit block), 'WO-075 criterion 2' (harness-context --check inside the export), 'WO-074 criteria 1, 2 and 5' (the Codex dispatch reserves its writer)",
    "docs/evidence/WO-075/cold-start.json: the export's CLAUDE.md is 6,832 bytes against core's 6,873 after the template grew to 3,326 bytes (core's floor is 3,368)"
  ],
  "rejected": [
    { "option": "Leave the directives to the generated block", "reason": "The compiler emits the block from the loadout; the directives are the instance floor's in core, and moving them is a compiler change outside this order." },
    { "option": "Keep 08 out and make the smoke's copy of it conditional", "reason": "Every reviewer session in a fork would be directed to a file the kit lacks; the conditional copy would hide it behind a passing executor smoke." },
    { "option": "Keep WO-074's Codex refusal assertion", "reason": "It asserted the absence of the runtime this order carries; the positive case is the evidence the README's claim needs." }
  ],
  "reopenWhen": "A role skill cites a document the kit lacks (harness-context --check inside the export names it), the generated block starts carrying the Read directives, or a fork reports a resume dispatch that fails on the carried runtime."
}
```

## WO-075-D005 — The live smoke: bounded repairs, the committed-copy export it ran in, and the copied record

```json
{
  "id": "WO-075-D005",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "scripts/harness-live-smoke.mjs could not run in an export or on this host: it asserted claude --version equal to the compiled profile's 2.1.263 while the installed CLI is 2.1.295, its scratch lacked the files the role skill directs a session to read (the executor skill cites scripts/operator-control.mjs, the verifier product 07, the reviewer product 08), and it copied product 08 unconditionally from the launchpad. Repairs, bounded to that script: the version assertion compares the observed major.minor line with the Claude profile's observedVersion line (selected by harness, not by position) and the record keeps both versions; every file a role's Read directives name is copied from the launchpad into the scratch and a missing one is reported by name; the record gains launchpadHarnessCheck (the launchpad's own harness check output) and bundleMatchesLaunchpad (the scratch's harness manifest equals the launchpad's), both required for passed, so a stale or unemitted launchpad bundle cannot hide behind a passing smoke. The model and effort pins (claude-fable-5, xhigh) stay WO-177's; the record says what ran. The smoke ran as the order's step 7 in the export of a committed bounded copy of this work tree (WO-074-D005's shape: this worktree's HEAD lacks the order's kit files, so an export from it would carry the unrepaired smoke), exported with DOTLN_LAUNCHPAD naming the main checkout that holds the operator's local-terms list, committed, installed offline and checked; it ran from the export's own node scripts/harness.mjs bounded with the parent session's CLAUDE* variables removed (a nested headless launch works with them scrubbed: probe result ok, USD 0.087). Two smokes ran, because the plain role run no longer witnesses a hook refusal: since WO-133 a feedback judgment such as the attribution unit's is answered by a delegated advisory ('host permissions decide') unless a foreign writer holds the worktree, and the smoke's requiredDeniedEffectRefused counts the judgment row. The record therefore also carries requiredDeniedEffectResponse ('refusal' or 'advisory', derived from whether a delegated advisory followed the judgment). The plain run (executor-001) shows the role skill resolved by the phrase and the attribution judgment recorded and delegated, response advisory; the writer-isolation scenario (DOTLN_LIVE_WRITER=foreign-live, writer-foreign-live-001) shows a generated hook refusing the session's write dispatches outright, naming the seeded holder, response refusal, with the role skill resolved as well. Criterion 3's refusal rests on the second record and its role resolution on both. Both records are copied to docs/evidence/WO-075/harness-live/ with identifiers reduced to shapes: process ids to <pid>, process start times to <process-start>, the export's path to <export>, the temporary root to <tmp>; session keys were already hashed.",
  "evidence": [
    "scripts/harness-live-smoke.mjs lines 274 to 281 at the base (the 2.1.263 assertion), 125 to 126 (the unconditional 08 copy), 79 to 110 (the scratch contents); docs/evidence/WO-042/harness-live/*.json observedAt 2026-09-09 on 2.1.263, the last records before this one",
    "docs/AI-HARNESS-SECURITY.md §Version-line attestation (WO-126): the running CLI's major.minor line is the recorded line; this comparison against the compiled profile is the executor's analogy to it, truthful because the record keeps the observed version beside the profile's",
    "docs/evidence/WO-075/harness-live/executor-001.json: passed, roleSkillResolved, requiredDeniedEffect attribution with response advisory (the judgment row allowed: false, then the delegated advisory 'no-attribution: AI attribution footer or trailer; host permissions decide'), observerFinished, no read outside the directed set, writer acquired and released, launchpadHarnessCheck exit 0, bundleMatchesLaunchpad true, harnessVersion 2.1.295 (Claude Code), profileVersion 2.1.263",
    "docs/evidence/WO-075/harness-live/writer-foreign-live-001.json: passed, roleSkillResolved, requiredDeniedEffect writer-isolation with response refusal (2 refused write dispatches, the holder named in the refusal, the seeded foreign reservation intact at the end), observerFinished, no read outside the directed set, launchpadHarnessCheck exit 0, bundleMatchesLaunchpad true",
    "packages/skeleton/src/harness-host.ts: a FeedbackRefused returns protocolAdvisory(reason) unless a foreign writer holds the worktree (then protocolRefusal 'DOTLN_HARNESS_REFUSED'); the installed CLAUDE.md block: 'Other tool and completion judgments are advisory and host permissions decide'",
    "docs/evidence/WO-075/export-run.md: the copy commit, the export commit, the manifest's launchpad.mjs hash against the work tree's, the terms status against the operator's list, the bounded wrapper's result line",
    "The scrubbed-environment probe in this session: claude -p --model claude-fable-5 --effort xhigh --max-turns 1 under node scripts/harness.mjs bounded returned 'ok' (canonicalModel claude-fable-5, USD 0.086695)"
  ],
  "rejected": [
    { "option": "Pin the smoke to 2.1.295", "reason": "The next CLI patch breaks it again; the profile's line is what the compiled bundle was observed on." },
    { "option": "Change the smoke's model pin to claude-opus-5-5", "reason": "WO-177 owns the probe pins; the attestation records what ran, and the installed CLI accepted the pin." },
    { "option": "Run the smoke from this worktree", "reason": "The scratch would be built from HEAD's kit copies, which lack the repairs, and the record would not be a session in an export." },
    { "option": "Run the smoke unbounded", "reason": "The role text asks for probes under the bounded wrapper; the export's own wrapper runs at the export root, which the smoke requires." },
    { "option": "Read the attribution judgment as the refusal criterion 3 names", "reason": "The record shows the hook delegating to host permissions; a judgment is not a refusal, and the record now says which it got." },
    { "option": "Make the plain run's passed require a refusal", "reason": "It would fail every plain role smoke under WO-133's advisory design; that is a product decision, not this order's, so the record reports the response kind instead." }
  ],
  "reopenWhen": "The CLI leaves the 2.1 line (then the compiled profile needs a new observation), a role skill directs a read the launchpad cannot supply, or the record's launchpad check or bundle comparison fails in core's live suite."
}
```

## WO-075-D006 — FUP-a058e82c0bbd9b6d deferred

```json
{
  "id": "WO-075-D006",
  "date": "2026-10-09",
  "dispatch": "resume: next; criterion 5",
  "decision": "The plane/kit root-resolution carry-in (one module identity for gate-evidence, usage-observation, writer-teardown and codex-continuation, an explicit tool root for kit inputs in harness-context, harness-probe, probe-codex-effort and harness-live-smoke, fixture names computed against the fixture root) is deferred, not taken up, and the register row is disposed deferred with this reason. The export carries both identities of the four modules exactly as core does: the src copies the hooks import by path and the dist copies the harness CLI imports, so the question is unchanged in shape by this order and no kit command fails on it. Taking it up edits four harness-pinned runtime modules, re-mints every edition they stale and owes a live feedback episode for usage-observation.mjs, against a benefit the default layout never sees. The carry-in's check condition, a DOTLN_LAUNCHPAD that is not the scripts' checkout, is not what an export exercises: inside the export findLaunchpad() resolves the export itself (the ascent stops at its .git) and resolves the named directory when DOTLN_LAUNCHPAD is set, both executed in this session. No usage-observation.mjs edit, so no live feedback episode is owed.",
  "evidence": [
    "docs/evidence/WO-070/decisions.md D009 and docs/planning/followups.json row FUP-a058e82c0bbd9b6d (allocated to WO-075, priority low, reopenWhen 'WO-075 closes without disposing the carry-in')",
    "cmp of packages/skeleton/src/gate-evidence.mjs with packages/skeleton/dist/src/gate-evidence.mjs and the other three pairs: the bytes differ (the dist copies are tsc's), and .claude/hooks/*.mjs import packages/skeleton/src/{gate-evidence,writer-teardown}.mjs while scripts/harness.mjs imports the dist copies; the export carries both (the src copies are kit files, the dist copies the runtime)",
    "Executed in the probe export: node -e findLaunchpad() with DOTLN_LAUNCHPAD unset printed the export's own path (equal to TOOL_ROOT); with DOTLN_LAUNCHPAD=<main-checkout> it printed that path",
    "docs/work-orders/WO-075-kit-runtime-and-bundle.md Cost line and criterion 5: an edit of usage-observation.mjs owes one live feedback episode; the map's receipt 041 known issue warns that taking it up ties five unrelated sources to the order WO-118 waits on"
  ],
  "rejected": [
    { "option": "Take the carry-in up here", "reason": "A wider re-mint surface and a paid live episode for a default-layout no-op; the fixture already pins the export's layout to core's." },
    { "option": "Close the row as settled because the export runs", "reason": "The export does not exercise the row's condition; settled would overstate it." }
  ],
  "reopenWhen": "A launchpad separate from the scripts' checkout, or one declaring non-default roots, must run these paths; or a kit command fails on the two module identities."
}
```

## WO-075-D007 — bootstrap has no build step in a kit

```json
{
  "id": "WO-075-D007",
  "date": "2026-10-09",
  "dispatch": "resume: next; adjacent repair",
  "decision": "scripts/bootstrap.mjs runs npm run build --silent only when the root holds package sources (a packages/<name>/tsconfig.json, atomicBuild's own criterion, through hasPackageSources in scripts/lib/paths.mjs, which exportKit uses too). A kit export carries the compiled runtime and no TypeScript source, so bootstrap in a fresh clone of an export runs npm ci when tsc is absent and then node scripts/harness.mjs emit, which installs the snapshot the hooks import; that makes the compiled hook advisory ('run node scripts/bootstrap.mjs to prepare this worktree') true in a fork. The two process-debt fixtures that model a core worktree gain a packages/kernel/tsconfig.json.",
  "evidence": [
    "scripts/bootstrap.mjs; scripts/test-process-debt.mjs 'WO-131 bootstrap ...' and 'WO-181 bootstrap prepares ...' (write packages/kernel/tsconfig.json; both pass); the bootstrap name pattern of that suite passes 5 of 5",
    "The probe export (HEAD's bootstrap.mjs): node scripts/bootstrap.mjs failed at npm run build --silent with ENOENT tsconfig.json after installing 9 packages",
    "scripts/test-launchpad.mjs 'WO-075 design: a fresh clone ...': node scripts/bootstrap.mjs in the installed clone prints 'Worktree ready for Claude or Codex (1 preparation steps).', never names npm run build, and harness check passes after it",
    "packages/compiler/src/harness.ts line 731 at the base: the fallback advisory names node scripts/bootstrap.mjs"
  ],
  "rejected": [
    { "option": "Leave bootstrap to core and document npm ci plus emit", "reason": "The compiled advisory every fork's hook prints would send a stranger to a command that fails." }
  ],
  "reopenWhen": "A kit gains a build step, or the advisory text changes."
}
```

## WO-075-D008 — Cold-start bytes inside the export

```json
{
  "id": "WO-075-D008",
  "date": "2026-10-09",
  "dispatch": "resume: next; criterion 4",
  "decision": "measureColdStarts (scripts/lib/process-budget.mjs) was run inside the evidence export and in this worktree at the committed copy's bytes; docs/evidence/WO-075/cold-start.json records both and the per-role difference. The export's CLAUDE.md is the kit template floor (3,326 bytes with its kit block) plus the generated block; core's is its hand-written floor (3,368 bytes) plus the same block, and the role skills are byte-identical, so every role is 41 bytes smaller in the export in both skill roots. The fixture asserts the inequality for every installed role against the running checkout, in the document gate (the launchpad-docs row), since reading this checkout's floor and skills is a document read. The margin is small by design: the template carries the same Start here directives core's floor carries (D004), and a later template edit that outgrows core's floor fails the fixture; so does a trim of core's hand-written floor by more than the margin, since the fixture compares against the running checkout's CLAUDE.md. The record was regenerated from the final evidence export after every kit edit, so it names the export the smoke ran in.",
  "evidence": [
    "docs/evidence/WO-075/cold-start.json (noRoleLarger true; export CLAUDE.md 6,832, core 6,873; twelve rows at delta -41 with skillBytesEqual true)",
    "scripts/test-launchpad.mjs 'WO-075 criterion 4' (compared 12, export <= core, skills equal)",
    "docs/control/budgets.json coldStartBytes ceilings apply to core; the export has no budgets.json, so its verdicts read unset"
  ],
  "rejected": [
    { "option": "Compare against the fixture's source copy", "reason": "The copy carries neither CLAUDE.md nor skills; the comparison would pass with no rows." },
    { "option": "Move the Read[role] directives into the generated harness block so one source serves both floors", "reason": "A compiler change outside this order; recorded as the follow-up below." }
  ],
  "followup": "Emit the Start here Read[role] directives from the compiled Contributor bundle instead of hand-writing them in core's CLAUDE.md floor and the kit's CLAUDE.template.md, so the two floors cannot drift and the export's cold-start margin stops depending on a hand-copied section. Natural home: the next order that changes the harness block (WO-076's overlay or WO-077). Priority: low; the fixture catches a drift that outgrows core's floor.",
  "reopenWhen": "A role grows in the export beyond core's bytes, a core floor edit shrinks it below the kit template's bytes (the fixture fails), or planning sets ceilings for exported instances."
}
```

## WO-075-D009 — The fixture: a committed copy with package sources, a real install directory, a rebuild by clone

```json
{
  "id": "WO-075-D009",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "scripts/test-launchpad.mjs keeps WO-074's shape (a committed bounded copy of the work tree exported from its own scripts) and adds what the runtime needs: tsconfig.json and every workspace's package.json, tsconfig.json, src and test, so the copy's root project graph builds; a real node_modules directory created after the commit, with one link per third-party entry of the running install and relative links to the copy's own workspaces (as atomicBuild stages them), so a package-name import inside the copy resolves to the copy's packages and never to this checkout's, and nothing of the install is a blob at the exported commit (a node_modules symlink is not matched by the node_modules/ ignore pattern and would have been committed with an absolute target). The rebuild case clones the copy at the named commit, links its install the same way, builds with the clone's own scripts/build.mjs and compares every manifest-listed dist file byte for byte with set equality; it does not run npm ci --offline in the clone as the order's step 5 words it, because the copy's lockfile is core's whole lockfile (Playwright included) and an offline install of it depends on the host cache holding that closure, while the comparison judges compiled bytes, not dependency installation, and the kit's own offline install is exercised separately. The WO-074 TypeScript plant moves from packages/skeleton/src/planted.ts to planted.d.ts: a declaration file is TypeScript source under packages/*/src that tsc compiles without emitting, so the plant can travel only as source (the old marker text was not valid TypeScript and would have failed the build; a valid module would have carried the marker into dist). The runner's protects text for the launchpad suite is updated; it still needs no core build. The cold-start comparison reads this checkout's installed CLAUDE.md, skills and budgets, which the runner's product read guard counts as excluded inputs for a product task (the first product gate failed the suite on 28 such observations), so that case is tagged [document] and runs in a launchpad-docs document row while the product row skips it; the module setup enumerates the workspaces from tsconfig.json's references rather than a listing of the packages tree, which the guard counts the same way.",
  "evidence": [
    "scripts/test-launchpad.mjs (setup, linkInstall, 'WO-075 criterion 1'); 18 cases pass in about 27 s (docs/evidence/WO-075/launchpad-fixture.txt)",
    "A scratch check in this session: a .gitignore with node_modules/ and a node_modules symlink leaves git status showing ?? node_modules; the first run of the suite failed its own assertion 'the install link stays out of the commit' until the link moved after the commit",
    "scripts/build.mjs lines 75 to 108: staging links every node_modules entry but @dotln and .bin and links the copy's workspaces",
    "tsc on the old plant text: TS1351 (an identifier cannot follow a numeric literal), reported by the design refuter from a scratch compile",
    "scripts/test-runner.mjs launchpad row"
  ],
  "rejected": [
    { "option": "Link the whole node_modules directory", "reason": "Its @dotln links are relative and resolve to this checkout's packages; the copy would predict its bundle with a mix of its own and the checkout's modules." },
    { "option": "npm ci --offline in the rebuild clone", "reason": "Core's full lockfile closure in the cache is a host condition the gate should not depend on; the deviation and its reason are recorded here." },
    { "option": "Reduce the root tsconfig to the three runtime packages", "reason": "The copy would no longer be a copy of core's project graph." }
  ],
  "reopenWhen": "The rebuild must install from the lockfile rather than share the running install (exportKit refuses an installed root development dependency whose version is not the commit lockfile's, but a transitive dependency that shapes the emitted declarations is not compared), or a committed TypeScript module under a runtime package's sources must be kept out of the export by something other than the local-terms screen (the fixture shows that screen refusing a compiled plant by its dist path, since a module that compiles carries its text into the runtime and the declaration-file plant covers only the source form)."
}
```

## WO-075-D010 — Kit scripts and the packages the kit omits

```json
{
  "id": "WO-075-D010",
  "date": "2026-10-09",
  "dispatch": "resume: next; execution plan step 1",
  "decision": "No kit script is left out of KIT_FILES: the scripts tree travels whole, as WO-074 criterion 1 fixes and its fixture asserts blob by blob. The scripts whose import closure reaches a package the kit omits are named here instead. scripts/console-fixtures.mjs imports packages/console/dist/src/index.js and dist/test/fixtures.js statically and fails at import inside an export; scripts/lib/planning-conditions.mjs reaches packages/console/dist/src/collect.js only inside a spawned expression string (line 373) and scripts/lib/vertical-primitives.mjs reaches packages/browser-evidence/dist/src/index.js only by a dynamic import on the browser-evidence path (line 596), so their importers (scripts/refute-plan.mjs, scripts/worktree.mjs, the vertical suites) load and fail only when those paths run. No kit command fails on a missing package: evidence:console and test:console first run npm run build, which fails on the absent TypeScript source (the limit WO-074 recorded as FUP-8fb7ae17dd0fad5b); npm run plan -- conditions has no build step and reaches packages/console/dist/src/collect.js through its collect-sources row, whose measurement error is caught and reported as unavailable, so the command runs and that one row degrades silently in a kit. The order's reopen condition ('a kit command fails on a missing package') is therefore not met by this base; the client README names the scripts and the degraded row.",
  "evidence": [
    "grep over scripts/**/*.mjs for static imports of packages/console, packages/browser-evidence, @dotln/console and @dotln/browser-evidence: scripts/console-fixtures.mjs lines 12 and 18 only; dynamic: scripts/lib/planning-conditions.mjs line 373 and scripts/lib/vertical-primitives.mjs line 596",
    "docs/work-orders/WO-074-launchpad-export-kit.md criterion 1 and scripts/test-launchpad.mjs 'WO-074 criterion 1: the scripts are byte-identical ...' (every scripts/** blob at the commit is exported, and only those)",
    "package.json scripts: evidence:console and test:console run npm run build --silent first, plan runs node scripts/refute-plan.mjs with no build; scripts/lib/planning-conditions.mjs collect-sources row (line 373) and its unavailable fallback; docs/evidence/WO-074/decisions.md D007"
  ],
  "rejected": [
    { "option": "Exclude console-fixtures.mjs and the transitive importers from the kit", "reason": "The scripts tree would stop being the commit's, every suite that lists the excluded files by path would break in a fork, and the kit commands fail earlier on the build regardless." }
  ],
  "reopenWhen": "A kit command reaches console or browser-evidence before its build step and fails on the missing package, or a kit gains a build-free test command (FUP-8fb7ae17dd0fad5b)."
}
```

## WO-075-D011 — Write-backs, locks, re-mints and the capability row

```json
{
  "id": "WO-075-D011",
  "date": "2026-10-09",
  "dispatch": "resume: next; criteria 6 and 7",
  "decision": "docs/product/03-architecture.md §Platform and instance boundary: the kit-slice paragraph is rewritten in place with no dated paragraph (the runtime built at export time from the commit's sources, the bundle the export's own emit writes and the prediction judges, the repository the export initializes, harness check, the Codex dispatch, the fresh clone's snapshot-missing advisory; the clause 'never its work tree' is replaced, since the build reads the work tree after verifying it equal to the commit); 179,317 bytes against the 194,488 ceiling the 2026-10-07 pass set, which supersedes the Cost line's older 300-byte bound as WO-074-D010 recorded for its own (the paragraph grew by 1,030 bytes: the runtime, the prediction, the repository, the snapshot and the clone's bootstrap each needed a clause, and fixture outcomes stay in the capability row). docs/LEGAL.md §Current state gains 'Kit runtime — 2026-10-09 (WO-075)': the build travels under the decided Apache-2.0 terms with NOTICE, the copied output is the project's own, no third-party file is bundled, no THIRD_PARTY_NOTICES file is written and the duty becomes due at the first export that copies a third-party file (operator-review assumption 2). docs/planning/capability-table.md gains 'WO-075 dated addition (2026-10-09)' with a launchpad.starter row at 1 — demonstrable (target 2 — dependable, efficiency E0). The two publication source locks (docs/publication/everyday-ai-user-toc.md and software-engineer-toc.md, where the locks live; the order's step 9 names the status index) were refreshed from node scripts/check-publication.mjs --print-locks and npm run publication:check reports both outlines current. Re-mints: none; no registered behavioral source changed (the edits are scripts, kit templates and documents; packages/*, package.json and package-lock.json are unchanged), docs/evidence/current.json keeps WO-074 revision 001 for the four kinds, and docs/evidence/WO-075/edition-checks.json records the four current-edition checks at exit 0.",
  "evidence": [
    "docs/product/03-architecture.md §Platform and instance boundary; node scripts/docs-check.mjs: 03-architecture.md 179317 | 0 | 194488 | 15171",
    "docs/LEGAL.md §Current state; a grep of packages/*/dist/src for third-party copyright, SPDX or helper text found none (reported by the design refuter)",
    "docs/planning/capability-table.md §WO-075 dated addition (2026-10-09)",
    "npm run publication:check after the lock refresh: CURRENT everyday-ai-user-toc.md (29 sections) and software-engineer-toc.md (45 sections)",
    "docs/evidence/WO-075/edition-checks.json; packages/skeleton/src/evidence-editions.mjs registers package sources, not scripts"
  ],
  "rejected": [
    { "option": "A dated paragraph in product 03", "reason": "Criterion 6 asks for the change in place; ceilings are planning's." },
    { "option": "Write a THIRD_PARTY_NOTICES file now", "reason": "Nothing third-party is bundled; the duty is recorded with its trigger." }
  ],
  "reopenWhen": "An export copies a third-party file, a registered source changes after this record, or the capability row's remaining gate (a fork's own gate on the carried runtime) is closed by WO-118 or WO-082."
}
```

## WO-075-D012 — Adjacent: status warns about the projection in an instance with no control events

```json
{
  "id": "WO-075-D012",
  "date": "2026-10-09",
  "dispatch": "resume: next; adjacent observation",
  "decision": "In a fresh export (and in a WO-074 export made from the main checkout's scripts, so not this order's regression) node scripts/resume.mjs status --json prints 'warning: docs/control/current.md disagrees with the canonical fold of control segments; status is read-only and did not rewrite the projection' before the first lifecycle transition, because warnIfProjectionDisagrees compares an absent projection with the rendered empty fold. The warning is cosmetic and stops at activate, which writes the projection. scripts/resume.mjs is outside this order's declared surfaces and criteria, so the defect is boarded as a follow-up rather than fixed here.",
  "evidence": [
    "scripts/resume.mjs warnIfProjectionDisagrees (the readFileSync of current.md yields undefined when absent, and undefined !== rendered)",
    "This session: status --json in the evidence export before activation printed the warning; a probe export made with <main-checkout>/scripts/launchpad.mjs (WO-074's kit) printed the same warning after git init",
    "scripts/test-launchpad.mjs 'WO-074 criteria 1, 2 and 5': status after activate carries no such assertion because the projection then exists"
  ],
  "rejected": [
    { "option": "Fix it in scripts/resume.mjs here", "reason": "Outside the order's surfaces and criteria; a lifecycle script change belongs to an order that owns it." }
  ],
  "followup": "resume status should not warn that docs/control/current.md disagrees with the fold when the projection is absent and no control event exists (a fresh launchpad before its first activate): treat an absent projection over an empty fold as agreement, and add the fixture case in scripts/test-launchpad.mjs (status in a fresh export prints no warning). Natural home: WO-077 (update) or WO-118 (the exported instance's first run). Priority: low; the warning disappears at activate.",
  "reopenWhen": "A fork reports the warning as a failure, or the projection comparison is tightened."
}
```

## WO-075-D013 — Self-review findings before implementation-ready

```json
{
  "id": "WO-075-D013",
  "date": "2026-10-09",
  "dispatch": "resume: next; self-review",
  "decision": "Two fresh dotln-workers reviewed the order and the diff before implementation-ready, an adversary of the criteria (13 findings) and an improver of design, simplicity and maintainability (28 findings; docs/evidence/WO-075/adversary.md and improver.md hold both reports with each finding's disposition). Fixed: the executor smoke's attribution judgment is a delegated advisory, not a refusal, so a second smoke runs the writer-isolation scenario in which a generated hook refuses the dispatch outright and the record now says which response a judgment got (F1, F2); README, first-order and product 03 name bootstrap for a fresh clone and say what harness check covers (F3, R2, R14); runtime bin targets are written executable so the fork's first commit stays clean after npm ci (F4); cold-start.json is regenerated from the final export (F5); the Cost-line overrun is recorded (F6, R26); the plan-conditions row that degrades in a kit is named (F7); paths in the decisions are shapes (F8); a compiled plant shows the local-terms screen judging the runtime (F9); the capability row's wording (F10); post-write refusals name the partial export and the ignore check runs first (F11, R9); every root development dependency's installed version must be the commit's pin (F12); the no-source scanner covers every TypeScript source form (F13); the bundle-screen fixture uses a term that lives in the emitted skills and asserts a bundle path (R1); one composition rule for the operating contract (R3); a counts-only summary line (R4); UPSTREAM groups that match their labels (R5); the seeded product README (R6); directive files inside the smoke's fixture commit (R7); the Claude profile by harness (R8); one combined dirty-input refusal with its remedy (R10); compilable extensions only in the ignored scan (R11); independent fixture cases (R12); a derived cold-start comparison with <= (R13); docstrings, imports, a private helper, a reworded closure comment, exportKit(destination), runGit for check-ignore, hasPackageSources, assertion wording, a boolean bundle comparison, the environment scrub inside the smoke, the floor screened once, the docstring's write boundary, LEGAL's repeated sentence and the README's register reference (R15 to R25, R27, R28). Recorded, not fixed: the rebuild shares the running install and compares only the root development dependencies with the lockfile (F12's residual, D009 reopenWhen); the Read[role] directives are hand-written in both floors (R13's structural suggestion, the follow-up D008 names). The design was also refuted before implementation by two fresh workers (31 findings, R1 to R14 and F01 to F17 in the session's design record), whose findings D002 to D012 cite where they shaped a decision.",
  "evidence": [
    "docs/evidence/WO-075/adversary.md and docs/evidence/WO-075/improver.md",
    "docs/evidence/WO-075/launchpad-fixture.txt after the fixes (18 cases)",
    "docs/evidence/WO-075/harness-live/executor-001.json (requiredDeniedEffectResponse advisory) and writer-foreign-live-001.json (requiredDeniedEffectResponse refusal), both from the final evidence export named in export-run.md",
    "The pre-implementation refutation ran as a two-agent workflow and the self-review as another; four dotln-worker agents in all against the 20-agent budget"
  ],
  "rejected": [
    { "option": "Treat the attribution judgment as the refusal criterion 3 names", "reason": "The record shows the hook delegating to host permissions; the writer-isolation scenario is where a generated hook refuses, and the record now distinguishes the two." }
  ],
  "reopenWhen": "The verifier reproduces a finding the dispositions call fixed, or the recorded residuals are reached by a fork."
}
```

## WO-075-D014 — Verification F1: the build-input check misses source bytes

```json
{
  "id": "WO-075-D014",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "decision": "Record VER-001-F1 as a blocking major defect against criterion 1 and return WO-075 to repair. dirtyPinnedInputs treats git status as proof that the bytes atomicBuild copies equal HEAD. An ignored source directory is returned as one directory by --ignored=matching and discarded by the extension filter; an edited tracked source marked assume-unchanged is absent from status. Both independent scratch probes exported successfully under the unchanged commit's name while carrying compiled bytes that a clean clone's rebuild does not have. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-075/verify-001-probes.json: ignored-source-directory (status '!! packages/kernel/src/verifier-ignored/'; export exit 0; plant.js manifest-listed; 272 runtime files against the clean rebuild's 270)",
    "docs/evidence/WO-075/verify-001-probes.json: status-hidden-tracked-source (git update-index --assume-unchanged packages/kernel/src/index.ts, then a synthetic export added; status empty; export exit 0; index.js differs from the clean rebuild)",
    "scripts/launchpad.mjs dirtyPinnedInputs and exportKit; scripts/build.mjs atomicBuild copies src/test from the work tree",
    "The independent clean export matched all 270 runtime files from a clone installed with npm ci --offline; an individually ignored .ts file was correctly refused before any destination write."
  ],
  "goalAlignment": {
    "traps": "Rule beating: a passing clean fixture or matching gate row cannot prove commit provenance for status-hidden inputs, so use independent ignored-directory and tracked-byte variations. Shifting the burden: do not ask the operator to remove legitimate Git metadata to make the runtime's stated provenance hold.",
    "noOp": "Accepting the current export preserves a successful command that can label local compiled bytes as the commit's runtime; criterion 1 remains unmet."
  },
  "rejected": [
    {
      "option": "Repair scripts/launchpad.mjs in this verifier session",
      "reason": "The verifier judges the subject read-only; the executor repairs and a fresh verification judges the repair."
    },
    {
      "option": "Treat the absent local-terms list in the synthetic probes as the cause",
      "reason": "The criterion is byte identity to the named commit. A list check screens terms but cannot establish source provenance; the individually ignored source file already refuses without a list."
    }
  ],
  "followup": "WO-075 repair of VER-001-F1: make the build consume only inputs whose actual bytes and paths are proven equal to the named commit, independent of Git status flags; add regression cases for an ignored directory containing compilable source and for an edited tracked source hidden by assume-unchanged. Keep harmless ignored files such as .DS_Store admitted and preserve the existing clean export and hook checks.",
  "reopenWhen": "A repaired subject refuses both mismatching-input cases before any destination write, or builds from the named commit's bytes so both exports equal the clean rebuild byte for byte and by path set."
}
```

## WO-075-D015 — Repair F1 by checking committed blobs and actual package paths

```json
{
  "id": "WO-075-D015",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-001-F1",
  "decision": "Repair dirtyPinnedInputs without changing atomicBuild or the runtime layout. Read BUILD_INPUTS and EMIT_CLOSURE from the named commit with ls-tree and cat-file batch; compare each tracked file's actual regular-file type, executable bit and bytes with that blob. Walk packages on disk without Git's ignore traversal, excluding the package-level generated dist and node_modules trees; refuse additional compilable module/configuration files and nonregular entries. Keep status only as an additional diagnostic for ordinary untracked paths. A mismatch refuses before atomicBuild and before any destination write, names the input and does not alter the operator's index flags. Product 03 states the actual comparison rule in place. The earlier D002 and handoff claimed the status-based check proved equality; VER-001 demonstrated that specific claim was false. This repair supplies the missing byte and path checks rather than changing the criterion or the filed report.",
  "evidence": [
    "docs/verifications/WO-075/VER-001.md F1 and docs/evidence/WO-075/verify-001-probes.json: ignored-directory and assume-unchanged reproductions",
    "scripts/build.mjs atomicBuild stages package source/test trees and build-free workspaces from disk; scripts/launchpad.mjs dirtyPinnedInputs now compares committed blobs and walks package paths before atomicBuild",
    "Bounded node --test --test-name-pattern='VER-001-F1|a package source that differs|the emit closure' scripts/test-launchpad.mjs: 6 tests passed, 0 failed, 6.717 s, 2026-10-09T14:21:27.424Z. Regressions cover a synthetic compiled source export, root configuration and emit script hidden by both assume-unchanged and skip-worktree; a missing source hidden by skip-worktree; nested source and test files in ignored directories with spaces; a same-byte symlink under assume-unchanged. Every mismatch refuses before destination creation. The existing individual ignored-source refusal and harmless ignored .DS_Store export still pass.",
    "One bounded committed-input access comparison at e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc: direct ls-tree/cat-file blob comparison read 392 inputs in 38.403 ms; git archive plus extraction and comparison read the same 392 inputs in 97.878 ms and materialized 7,731,200 archive bytes. Both named the same two already-authored emit-input mismatches. This measures input access only, not a full build or the package-path walk."
  ],
  "goalAlignment": {
    "traps": "Rule beating: clean exports and manifest hashes cannot prove source provenance, so regression cases change actual paths and bytes while Git status remains empty. Shifting the burden: requiring the operator to clear legitimate index flags or ignore rules would hide the bug, so the guard reads actual inputs and leaves those settings alone.",
    "noOp": "Leaving the guard unchanged permits local compiled bytes to travel under the unchanged commit's label and leaves criterion 1 unmet."
  },
  "rejected": [
    {
      "option": "Only change --ignored=matching or force Git to refresh its status cache",
      "reason": "An ignored-directory fix alone misses status-hidden tracked bytes; index flags must not decide provenance."
    },
    {
      "option": "Materialize the commit into another tree and build only that copy",
      "reason": "This is a valid provenance strategy but introduces another build/staging location and requires aligning the loaded emit closure with it. The bounded comparison found equivalent tracked-input mismatch judgments with more materialization; direct blob checks preserve the existing build and refusal flow."
    },
    {
      "option": "Refuse every ignored package file",
      "reason": "Harmless metadata such as .DS_Store is not a compilable input; its existing admission fixture must continue to pass."
    }
  ],
  "reopens": {
    "decisionId": "WO-075-D014",
    "observation": "The repair's bounded regressions refuse both named failure classes before destination creation, and also judge skip-worktree, missing tracked source and same-byte symlink cases that VER-001 did not quote."
  },
  "reopenWhen": "A build begins consuming an input outside BUILD_INPUTS/EMIT_CLOSURE or a new source form outside the path walk's module/configuration extensions; then extend the guard and add a mismatch case before claiming commit provenance."
}
```

## WO-075-D016 — Adjacent fixture: Codex writer owner modes

```json
{
  "id": "WO-075-D016",
  "date": "2026-10-09",
  "dispatch": "resume: fix; adjacent-0002",
  "decision": "Repair the launchpad lifecycle fixture's owner-mode assumption within its already-declared test surface. Its carried-runtime dispatch must reserve the fixture thread's writer; under an actual Codex ancestor the runtime records codex-host, while thread is the fallback when ancestry is unreadable. Accept exactly those two sources, assert the dispatch thread's SHA-256 actor identity, and require the corresponding liveness/process shape. The runtime behavior is correct; no runtime source or writer policy change is needed. This scope was announced and queued after stopping the failing review gate.",
  "evidence": [
    "The first repair npm test -- --review reported FAIL launchpad: 20 of 21 cases passed, including all F1 regressions. The carried-runtime lifecycle case failed its thread-only assertion. node scripts/harness.mjs evidence --stop stopped the gate at 654.6 s and recorded no passing check.",
    "Bounded isolated node --test --test-name-pattern='without package source' scripts/test-launchpad.mjs: exit 1, assertion actual codex-host versus expected thread at line 958, 5.398 s. This is an independently reproduced assertion mismatch, not an inferred application defect.",
    "packages/skeleton/src/harness-host.ts codexHostProcess verifies an ancestor's command and returns pid, startedAt, source codex-host; otherwise it returns source thread. reserveCodexDispatchWriter binds sessionKey to the supplied thread and calls codexHostProcess.",
    "scripts/test-harness.mjs existing Codex dispatch cases accept exactly codex-host or thread, then verify live host ownership or unknown fallback liveness.",
    "After the assertion repair, the bounded isolated carried-runtime lifecycle case passed: 1 test, 0 failures, 5.496 s, finished 2026-10-09T14:38:57.600Z. It retains reserved true, proves the fixture thread's actor identity and judges the observed owner mode's liveness.",
    "The complete non-document export fixture suite then passed under the bounded wrapper: node --test --test-skip-pattern='\\[document\\]' scripts/test-launchpad.mjs, 21 tests, 0 failures, 30.484 s, finished 2026-10-09T14:39:44.796Z. It includes the clean named-commit rebuild, emitted-surface drift refusal, all F1 regressions, ignored .DS_Store admission and the repaired lifecycle case."
  ],
  "rejected": [
    {
      "option": "Force thread ownership or change runtime ancestry detection",
      "reason": "That would weaken a correct live-owner observation to satisfy an environment-specific test assumption."
    },
    {
      "option": "Remove the owner assertion or accept any owner source",
      "reason": "The fixture should still prove that the carried runtime reserves the intended Codex thread's writer and records one of its defined ownership modes."
    },
    {
      "option": "Defer the failure and carry the previous passing product row",
      "reason": "The changed subject owes a green review gate, and this small assertion repair is within the named test surface."
    }
  ],
  "reopenWhen": "The runtime adds or changes a Codex owner mode, or the launchpad fixture's actor/liveness checks no longer establish ownership of its dispatch."
}
```

## WO-075-D017 — Verification VER-002: provenance reads honor Git replace refs

```json
{
  "id": "WO-075-D017",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-002",
  "decision": "Record a minor, non-blocking hardening follow-up found while attacking the VER-001-F1 repair. dirtyPinnedInputs reads the named commit with git ls-tree and git cat-file --batch, and both honor refs/replace. A blob replacement whose content equals an edited work-tree input, combined with assume-unchanged so status is empty, passes the guard; the export exits 0 and names the unchanged commit while kernel dist/src/index.js and index.d.ts differ from a clean clone's rebuild. It is not blocking: Git presents the replacement as the commit's content to every ordinary command in that repository (checkout, archive and the kit-file reader main already had since WO-074 read the same view), and it needs a deliberately written replacement object; no accidental local edit, index flag or ignore rule reaches it alone, and both VER-001 classes now refuse. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-075/verify-002-probes.json: replace-blob-assume-unchanged (git status empty; export exit 0; manifest names the fixture commit; differing packages/kernel/dist/src/index.d.ts and index.js against the clean rebuild; git --no-replace-objects cat-file shows the commit's original blob without the edit)",
    "scripts/launchpad.mjs dirtyPinnedInputs: ls-tree and readGitObjects (scripts/lib/git.mjs cat-file --batch) run without --no-replace-objects; no script under scripts/ sets GIT_NO_REPLACE_OBJECTS",
    "git show HEAD:scripts/launchpad.mjs: readKitSources already read kit-file blobs through ls-tree and readGitObjects with replace refs honored"
  ],
  "goalAlignment": {
    "traps": "Rule beating: a passing guard regression suite cannot show that the comparison target is the commit's original objects, so the probe replaced the object rather than the work tree. Severity inflation: a deliberately configured object database is not the accidental divergence F1 named, so it is recorded with its rule rather than failing the order.",
    "noOp": "Leaving it unrecorded would let product 03's commit-provenance statement stand without its replace-ref condition."
  },
  "rejected": [
    {
      "option": "Fail criterion 1 on this probe",
      "reason": "The criterion's divergence class (local edits hidden by index flags or ignore rules) refuses; this case needs the operator to redefine the commit's objects, which Git applies to the whole export, kit files included, as it did on main."
    },
    {
      "option": "Repair scripts/launchpad.mjs in this verifier session",
      "reason": "The verifier judges the subject read-only."
    }
  ],
  "followup": "Launchpad export provenance reads ignore replace refs: run the export's commit reads (rev-parse, ls-tree, cat-file for kit sources and pinned build/emit inputs) with git --no-replace-objects or GIT_NO_REPLACE_OBJECTS=1, or refuse when refs/replace exists, and add a regression in which a replaced blob equal to an assume-unchanged edit refuses before destination creation.",
  "reopenWhen": "An export is recorded from a repository with refs/replace objects, or a forge or operator workflow that creates blob replacements is adopted for core."
}
```

## WO-075-D018

<!-- integration refs/dotln/checkpoint/WO-075/10 -->

```json
{
  "id": "WO-075-D018",
  "date": "2026-10-09",
  "dispatch": "resume: final review; worktree integrate WO-075",
  "decision": "Integrate main at e8fd3e4c, seven commits past this order's base e3b38663, into the WO-075 worktree at final review: WO-188's twenty-four machinery fixes (compiler 0.26.0, skeleton 0.56.0, console 0.4.1, released as v0.71.0) and WO-190's work-order index split with its comment-labels document check (console 0.4.2, v0.71.1). One authored conflict, the header comment of scripts/launchpad.mjs, is resolved by keeping main's wording and appending this order's sentence with the order identifier after the explanation, which is what main's new check requires; one comment in scripts/test-launchpad.mjs that led with an order identifier is reworded for the same check, and node scripts/comment-labels.mjs passes. The application target is retimed from v0.71.0 to v0.72.0 above the observed baseline v0.71.1 (the collision D001 anticipated; bookkeeping, not a finding). The evidence editions advanced to WO-188's by upstream (authority 003, the other three 001); this order changes no registered source, package.json, package-lock.json or tsconfig.json, so it owes no re-mint and edition-checks.json's WO-074 revision 001 reading is superseded by the integrated tree's own four checks in the document gate. Carried-forward claims: criteria 1, 2 and 4 are re-derived on the integrated tree by the fixture suite (22 of 22) and by an export probe from a committed copy against the main checkout's local-terms list (270 runtime files byte-identical to a rebuild of the copy's commit, set equal; harness check at 34 surfaces passing and refusing a one-byte drift; 16 hooks with 212 import specifiers and no absolute one; every role 41 bytes smaller than core). Criterion 3's refusal and role resolution are re-established at the integrated bytes by one writer-isolation live smoke inside that export (compiler 0.26.0, 34 surfaces including main's failure-observer hook), because the executor's records were taken on compiler 0.25.5 with 33 surfaces; the executor's records remain the order's live rows and the plain-run attribution advisory is unchanged in mechanism. Criteria 5, 6 and 7 are carried with their checks rerun on the integrated tree (publication locks, product 03 at 179,463 bytes under its 194,488 ceiling, check-surfaces, the document gate and a fresh review gate).",
  "evidence": [
    "refs/dotln/checkpoint/WO-075/10",
    "base e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc",
    "upstream e8fd3e4c095ccfd44e6e45e756669b002d9b6297",
    "release preparation: Retimed WO-075: v0.71.0 → v0.72.0 above the observed release baseline v0.71.1. Files changed: docs/work-orders/WO-075-kit-runtime-and-bundle.md, README.md, docs/evidence/WO-075/meta.json, docs/final-reviews/WO-075/PR.md. Meter snapshot: docs/evidence/WO-075/meta.json, 4408 bytes. Tag observation: local snapshot only.",
    "docs/control/local/integration.json (ignored): preservation commit aa22bfcd05a9ad19c1f3620ad6c42bedf3fd008e, named stash 63259b8b3dd4113d096ad72c52459936523b0a62, intake backup in the session scratch, six resolved projections, one authored conflict",
    "git diff e3b38663 main -- packages: compiler 0.25.5 → 0.26.0, skeleton 0.55.1 → 0.56.0, console 0.4.0 → 0.4.2; .claude/harness-manifest.json gains .claude/hooks/failure-observer.mjs (34 surfaces); docs/evidence/current.json names WO-188 editions",
    "node scripts/comment-labels.mjs after the two comment rewordings: PASS comment labels: 541 code files; 81 baselined lines; 0 failures",
    "docs/evidence/WO-075/final-001-observations.json: the bounded fixture suite (22 passed, 0 failed, 37.7 s), the bounded export probe (copy commit 28fb923a, export commit 24eb0ecf, 592 kit files, 270 runtime files, 34 surfaces emitted and 33 manifest-listed, local-terms present with 615 texts checked, rebuild set equal with no differing file, cold start 41 bytes smaller in all twelve rows) and the live smoke",
    "docs/evidence/WO-075/harness-live/writer-foreign-live-final-001.json: passed, roleSkillResolved, requiredDeniedEffect writer-isolation refused with response refusal (2 refused write dispatches, holder named, final reservation foreign), observerFinished, no read outside the directed set, launchpadHarnessCheck exit 0 at 34 surfaces, bundleMatchesLaunchpad, compilerPackageVersion 0.26.0, harness 2.1.295 against profile 2.1.263, launch selector claude-fable-5 at xhigh with xhigh observed; observed 2026-10-09T17:30:09.578Z"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Carry criterion 3 forward on the executor's records alone",
      "reason": "Upstream changed the compiler and skeleton the export carries and added a hook to the bundle; one writer-isolation smoke in the integrated export costs a few minutes and re-establishes the refusal and the role resolution at the bytes being published."
    },
    {
      "option": "Re-run the executor's plain smoke as well",
      "reason": "Both clauses of criterion 3 rest on the writer-isolation record; the plain run's attribution judgment is a delegated advisory whose mechanism WO-133 fixed and this integration did not touch, so a second paid session adds no claim."
    },
    {
      "option": "Return the comment rewordings through repair",
      "reason": "Two comment lines changed to satisfy a check main introduced after the subject was verified; no behavior, contract, authority or acceptance changed, which is the integration work product 07 admits, and the fresh review gate runs on the result."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-09. Original base: `e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc`.
Fetched main: `e8fd3e4c095ccfd44e6e45e756669b002d9b6297`. Checkpoint: `refs/dotln/checkpoint/WO-075/10`.
Named stash retained: `63259b8b3dd4113d096ad72c52459936523b0a62` (WO-075 integrate 2026-10-09).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-075: v0.71.0 → v0.72.0 above the observed release baseline v0.71.1. Files changed: docs/work-orders/WO-075-kit-runtime-and-bundle.md, README.md, docs/evidence/WO-075/meta.json, docs/final-reviews/WO-075/PR.md. Meter snapshot: docs/evidence/WO-075/meta.json, 4408 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1, 2 and 4 re-derived on the integrated tree (fixture suite and export probe); criterion 3 re-established by one writer-isolation live smoke in the integrated export; criteria 5, 6 and 7 carried with their checks rerun. Release retimed to v0.72.0; evidence editions advanced to WO-188's by upstream with no re-mint owed. Completed by FINAL-001.
Authored conflicts observed: scripts/launchpad.mjs.
Affected checks are printed by the command; results remain untested until executed.
