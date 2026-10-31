# WO-247 — A driven Codex order finishes: the declined close's reason is retained and diagnosed, the drive either closes on Codex or stops with a next step the operator can take, a live receipt names the code identity it ran on, the ten criterion-17 items WO-192 left are repaired, the publication fixture cannot reach a real host, the sandbox policy of a routed run is the instance's declared election, and both hosts requalify on the final code (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. Receipt fields, one configuration
section, one stop with a next step and one admitted host change, fixture
changes and repairs; no new operator phrase. Assigned at activation under
the standing opt-out default.
**Cost:** adds, in `scripts/lib/drive-worker.mjs` (`launchRole` 49 to 220;
the Codex argv at 86 to 110 with `--approve-for-me`) and
`scripts/lib/drive-transport.mjs`, retention of a declined phase's Codex
event stream and the declined item (the command shape, the status, the
host's reason as it printed it, the enumerated signals of WO-192-D040; no
worker narrative, path or query) in the attempt receipt before the live
fixture's cleanup (`scripts/fixtures/drive-live.mjs` 100 to 110, 660 to
672); in `scripts/lib/drive-session.mjs` (`runDrive` 890; the host rule at
779) an `awaiting-close` stop naming the attended close command and the one
admitted re-entry, `--host claude` for release close only, recorded as
`hostChange`; `docs/evidence/WO-247/codex-close-refusal.md` (new): the
diagnosis with the retained reason, the decider the host names and the
repair the reason admits without bypassing the host; in
`scripts/lib/drive-evidence.mjs` and the attempt receipt a `codeIdentity`
per attempt: the authoring checkout's gate code identity (`gateCodeIdentity`,
`packages/skeleton/src/gate-evidence.mjs` 914, which binds tracked source
bytes and excludes reports and generated projections) at the export the
fixture ran, beside the fixture trees' own hashes as provenance, and a
`drivenStart` figure per launched role (the installed root's bytes plus the
launch text of `scripts/lib/drive-prompts.mjs`, recorded and not bounded:
WO-192-D095), with the completion check (`requireGateClaims` in
`scripts/lib/handoff-ledger.mjs` 306, called from `scripts/resume.mjs` 1612
and 1699) comparing a live receipt's source identity to the handoff
identity; a `drive` section in
`scripts/lib/config.mjs` (`sandbox: "host" | "off"`, default `host`)
resolved per host through one adapter in `drive-worker.mjs` where
`DOTLN_LIVE_SANDBOX` is read today (`drive-live.mjs` 61 and 86;
`drive-worker.mjs` 142, 192, 206: Codex's selected policy is hard-coded
`workspace-write`), with the selected election and the observed policy
recorded separately in the receipt's `qualificationSandbox`; the ten criterion-17 items of WO-192's handoff (a
hung remote's transport child survives the fetch limit, D098; a reactivated
order inherits an earlier release or close receipt and routes as released,
D099; `routeFacts` with no events skips the pass check and reads as merged,
D099; the lane error prefix, the router's weaker merge sentence and the
order's superseded step 8, D099; the floor's grant sentence, D094; an
operator's own Codex router having no session, D101 and D102; the worker
note's "each helper's normal arguments" and a direct test of `harness
begin`'s refusal path, D102), each with a regression; in
`scripts/lib/target-worktree-fixture.mjs` (`publicationSetup` 356 to 390)
and its bare Git helper an origin that cannot reach a real host: a
GitHub-shaped URL on a host that cannot resolve (`https://github.invalid/…`,
which `parseGitHubTarget` accepts as any GitHub remote, `scripts/lib/github-repository.mjs`
49 to 97, so the production preflight runs unchanged), the fixture
environment's URL rewrite to a local bare repository carried by every Git
call including the bare helper (D099's cause), and an assertion that no
fixture remote names a resolvable host; cases in `scripts/test-drive.mjs`, `scripts/test-harness.mjs`,
`scripts/test-target-worktree-publish.mjs`, `scripts/test-target-worktree-close.mjs`,
the configuration suite and `scripts/test-process-debt.mjs` (the
driven-start figure beside the meter); one live lifecycle per host on the
final code with the receipts under `docs/evidence/WO-247/`; product 07 (the
drive's finish on each host, the election, receipts carrying code identity),
`docs/PLAYBOOK.md` and the kit guide. Removes: the state where a Codex drive
ends at `dispatch-refused` with no reason retained and no next step
(attempts 49 and 50), where no live receipt names the code it ran on ("on
the final code" judged by file times), where the drive's qualification
fixtures push to a real GitHub URL when a probe forgets the redirect (two
reviewer probes on 2026-10-31, refused by GitHub, nothing published), and
where the sandbox a routed run gets is a fixture environment variable
instead of the instance's election (the operator's direction of 2026-10-26:
the intended environments are unsandboxed). Wall-clock: two live lifecycles
on the final code (Claude attempt 48: 84 minutes and $36.97; Codex: unknown,
attempt 49 reached final review) plus close-only reruns during diagnosis
(attempt 51: 3 minutes and $1.15) and the diagnosis itself; the receipt
fields add milliseconds; the election adds one configuration read per
launch. Context bytes: this file, about 20,000; WO-192's handoff, its
decisions D094 to D104 and its process-recovery note, about 120 KB for the
executor. Commands: none new for the operator; `--host claude` on re-entry
for release close. Tokens: unknown until run; the live runs' dollars are
recorded per attempt as WO-192's were. Steps: 11. Re-mints:
`packages/skeleton/src/worker-transport.ts` is a runtime source registered in
`scripts/lib/evidence-sources.mjs` (108, 306), re-minted deterministically
where staled; `scripts/lib/config.mjs` is a reasoned exclusion; the drive
libraries, `drive-live.mjs`, `worker-transport.ts` and the target-worktree
fixture's consumers are declared machinery sources (`scripts/test-runner.mjs`
306 to 318, 340, 423), so `npm test -- --review` runs before handoff; no
feedback-judged file changes, so no live feedback episode.
**Nomination provenance:** the operator's waiver of WO-192's criterion 17 on
2026-10-31 (ignored capture
`docs/intake/WO-192-criterion-17-waiver-2026-10-31.txt`, SHA-256
`2aee1c8dd856039ee1865d27b4578d5bb146fa8ab767049c3fadd3f5bca81966`: waive
it, and note that it needs an immediate follow-up because it seems a
solvable issue), recorded by WO-192-D104 as the immediate follow-up
FUP-5b7b2e27a0e6b01a; WO-192-D102 (the declined close and the three ways to
finish; FUP-0d7e98297efa0b60); WO-192-D057 (the operator's sandbox direction
of 2026-10-26, unsandboxed environments, with a planned durable policy;
FUP-ec3d1b98b15afd49, and the 2026-10-26 pass's FUP-18a44de758813fea, whose
condition "WO-192 closes" occurred at v0.104.0); WO-192-D099 (the fixture's
real origin; FUP-b5211779c719d804); WO-192-D095 (the driven-start figure;
FUP-dd1ac63cf4883d5f); the process-recovery note's candidates 3 and 8
(`docs/evidence/WO-192/process-recovery-2026-10-30.md`). Filed by the
[2026-10-31 pass](../planning/kit-guide-home-fork-block-and-drive-returns-2026-10-31.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-192 (closed, v0.104.0: the router, the driver, the live
fixture and the receipts this order extends); WO-234 (closed: the dispatch
bounds a drive records); WO-049 (closed: the target bundle phase workers run
under); WO-233 (closed: the owner records of the fixture roots the live
fixture creates).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-192",
    "relation": "satisfied-by-close",
    "reason": "the router, the driver, the live fixture and the attempt receipts this order extends"
  },
  {
    "workOrderId": "WO-234",
    "relation": "satisfied-by-close",
    "reason": "the dispatch bounds a drive records on every phase"
  },
  {
    "workOrderId": "WO-049",
    "relation": "satisfied-by-close",
    "reason": "the target bundle a registered target's phase workers run under"
  },
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "the owner records and retention classes of the fixture roots the live fixture creates and removes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/drive-worker.mjs` (`launchRole`
49; the Codex argv 86 to 110: `--approve-for-me`,
`sandbox_workspace_write.network_access=true`, `model_reasoning_effort`; the
sandbox lines 142, 192 and 206); `scripts/lib/drive-session.mjs` (`runDrive`
890; `requestDriveStop` 881; "Drive re-entry must keep its recorded host"
779; `awaitingMergeStop` 752); `scripts/lib/drive-route.mjs`
(`lifecycleRoutes` 14; `routeOrder` 39; `routeFacts` 205;
`fetchMergedBases` 345); `scripts/lib/drive-evidence.mjs`
(`drivenObservation`, `drivenCompletions`, `requireDrivenGates`);
`scripts/fixtures/drive-live.mjs` (61 and 86: `DOTLN_LIVE_SANDBOX`; 105: the
scratch root; 660 to 672: the removal); `packages/skeleton/src/worker-transport.ts`
(`codexExecArgv` 364; the shared exec flags 345; the isolated Codex home 523
to 600); `scripts/release.mjs` (the close treats `--publish` as what
completes a close even under no-release: WO-192-D102);
`scripts/lib/target-worktree-fixture.mjs` (`publicationSetup` 356);
`scripts/lib/github-repository.mjs` (`parseGitHubTarget` 49 to 97: the
host and path forms the preflight accepts); `scripts/lib/handoff-ledger.mjs`
(`requireGateClaims` 306) and `scripts/resume.mjs` (1612, 1699: where
completion consumes gate claims); `packages/skeleton/src/gate-evidence.mjs`
(`gateCodeIdentity` 914);
`docs/evidence/WO-192/live-drive-attempt-49.json` and `-50.json` (the
declined close: `stop.reason: dispatch-refused`), `-48.json` and `-51.json`
(Claude); `docs/evidence/WO-192/handoff.md` §Criterion 17, §What the unmet
clause means in use and §Independent review (the ten items);
`docs/evidence/WO-192/decisions.md` D040, D042, D057, D094, D095, D098,
D099, D101, D102 and D104; `docs/evidence/WO-192/process-recovery-2026-10-30.md`
§What to build (items 3 and 8); `docs/evidence/WO-192/native-qualification.md`;
product 07 §Operator resume phrases (`drive:`) and §Model-specific notes.

**Objective:** The drive the operator types once finishes on both hosts, or
stops saying why and what to type next. On Codex the declined close's reason
is retained with the receipt and read, the repair the reason admits is made
without bypassing the host, and the stop that remains names the attended
command or the one admitted host change. Every live receipt names the code
it ran on, so "on the final code" is a comparison and not a sentence. The
ten items WO-192 left are repaired with regressions, a qualification fixture
cannot reach a real host, the sandbox a routed run gets is the instance's
declared election, and both hosts run the lifecycle on the final bytes with
the receipts to show it.

**Observed gap (dated 2026-10-31 at `main` `c27abd53`):**

- Attempts 49 and 50 (Codex CLI 0.166.0) ended at `stop.reason:
  dispatch-refused` ("The native host denied a phase command; stop without
  another attempt until the host admission condition is resolved") after
  router, executor, verifier and final review passed; a third run with a
  temporary capture showed the declined command as `release.mjs close
  WO-999 --publish`, status declined, empty output, no reason; the capture
  was removed and nothing retained names the decider (D102). The live
  fixture removes its temporary home with the Codex session log at cleanup
  (`drive-live.mjs` 660 to 672), so the reason is gone before anyone reads
  it.
- Re-entry refuses a host change (`drive-session.mjs` 779), so an order
  Codex drove to merge cannot be finished by switching to Claude, and the
  stop names no step; the hand route, the phrase in an attended session, was
  not exercised (the handoff's §What the unmet clause means in use).
- Attempt 45 closed on CLI 0.164.0 on older code; the CLI version, the role
  text, the worker notes and the driver have all changed since, and which
  matters is unknown (D102).
- No receipt carries a code identity; attempt 48 predates D101 and attempt
  49 predates a diagnostic-label change, judged by file times (D102; the
  handoff).
- The ten criterion-17 items the executor left (the handoff §Independent
  review): three reproduced defects (D098, D099) and seven wording, record
  and test items; the handoff says none needs planning and that leaving them
  was a cost reason D089 ruled out.
- Two reviewer probes each ran a real `git push` through a fixture clone
  whose origin `publicationSetup` had set to
  `https://github.com/dotln-fixture/target.git`; GitHub answered "Repository
  not found" and nothing was published; only `f.env` holds the redirect and
  the fixture's bare Git helper does not carry it (D099).
- The sandbox a routed Claude run gets is `DOTLN_LIVE_SANDBOX=off` on the
  fixture (`drive-live.mjs` 61), written into disposable settings (D057);
  the operator's intended environments are unsandboxed and no instance
  election exists; Claude ran with the sandbox off under fixture settings
  and Codex in its workspace-write sandbox under automatic review (D102), so
  the two hosts' records are not alike.
- Launch text (`drive-prompts.mjs`) sits outside the cold-start meter: the
  driven start measured 40,646 bytes on Claude and 41,527 on Codex for the
  executor against the 40,194 acceptance, with the installed roots within
  their ceilings (D095).

**Design (scope discipline):**

- **Retain before cleanup, enumerate before retaining.** A declined phase's
  Codex event stream and the declined item are copied into the attempt
  receipt's retained observations before the fixture's removal, under the
  router's information boundary (D040's enumerated signals; the host's
  reason text as printed; no worker narrative, paths or queries). Rejected:
  keeping the whole temporary home (axis: one to two gigabytes per run; the
  reason is kilobytes).
- **Diagnose, then the admitted repair.** With the reason in hand the
  executor does what the reason admits: a host-supported approval the
  operator grants explicitly per run, a change in how the close is launched
  that the host's documented policy admits, or the finding that automatic
  review declines the close on this CLI line; a repair never routes around a
  denial (D042's rule). Rejected: retrying the close until it passes (axis: a
  denied launcher is not retried). Rejected: dropping `--publish` from the
  driven close (axis: `release.mjs` treats it as what completes a close even
  under no-release, D102).
- **A stop with a next step; one admitted host change.** When the close
  stays declined, the drive stops at `awaiting-close` naming the attended
  command (`resume: release close` in the launchpad, with the order) and the
  one admitted re-entry, `--host claude` for release close only, recorded in
  the receipt as `hostChange`; every phase before the close keeps the
  recorded host. Rejected: a silent host switch (axis: the recorded host is a
  fact of the receipt, and a change is the operator's step).
- **Identity on the receipt, compared at completion.** The phase workers
  run in fixture trees (`drive-live.mjs` 214 to 243 installs an exported kit
  and rewrites its synthetic configuration), so a fixture tree's hash never
  equals the authoring checkout's; each attempt records the authoring
  checkout's gate code identity at the export it ran (`gateCodeIdentity`,
  which the complete run already binds), beside the fixture trees' hashes as
  provenance, and `requireGateClaims` compares that source identity with
  the handoff identity when a criterion names a live run, reporting a
  mismatch as a failed claim naming both. Rejected: file times (axis: what
  WO-192 had to use). Rejected: whole-tree equality (axis: no fixture tree
  equals the source tree; the identity to compare is the source's).
- **The election lives in the configuration, resolved per host.**
  `drive.sandbox` in `dotln.config.json` (schema 1 gains the section;
  unknown keys still refuse), default `host` (the host's own setting); one
  adapter maps the election per host: on Claude `off` writes
  `sandbox.enabled false` into the disposable settings as D057's exception
  does today; on Codex `off` passes the unsandboxed mode Codex's page
  documents (today its receipt hard-codes `workspace-write`, `drive-worker.mjs`
  192, and the shared launcher passes `--ignore-user-config`,
  `worker-transport.ts` 351); a host without a supported form refuses before
  launch naming the election; the receipt records the selected election and
  the observed policy separately, for the router and every phase worker
  alike (D057's consistency ask). Rejected: a Support (axis: a
  Support compiles authority into the bundle, while this is a host launch
  setting the operator owns per instance; WO-241's registry lists the key
  when it lands).
- **The fixture cannot publish.** The production preflight parses the
  origin as a GitHub remote (`parseGitHubTarget` refuses a local path or a
  `file:` URL), so the fixture keeps a GitHub-shaped identity and makes it
  unreachable: a host under the reserved `.invalid` domain, which no
  resolver answers, with the fixture environment's URL rewrite to the local
  bare repository carried by every Git call the fixture makes, the bare
  helper included, and an assertion that no fixture remote names a
  resolvable host. A probe that drops the environment then fails at
  resolution instead of reaching GitHub. Rejected: a local path or `file:`
  origin (axis: the parser refuses it, so the preflight the fixture must
  exercise would never run). Rejected: a URL on a real host that refuses
  credentials (axis: still a network call, and the two probes of 2026-10-31
  made exactly that call).
- **Live-run surfaces at the base.** The driver, the live fixture, the
  receipts, the Codex argv and the route table: exist. The retained reason,
  the stop's next step, the host change for close, the identity, the
  election and the local origin: absent.

**Execution plan (the executor follows these steps in order; observed at `c27abd53`, 2026-10-31):**

1. `scripts/lib/drive-transport.mjs` and `scripts/lib/drive-worker.mjs` (86
   to 110): on a declined or failed phase command the event stream and the
   declined item are retained in the attempt record (`driverObservations`,
   enumerated; `rawTranscriptsRetained` true for the declined phase) before
   `drive-live.mjs` (660 to 672) removes the home. Check: `npm test -- --only
   harness-fixtures` (the drive cases).
2. Diagnosis: one close-only Codex run on the live fixture with step 1's
   retention; `docs/evidence/WO-247/codex-close-refusal.md` records the
   command, the status, the reason as the host printed it or that it printed
   none, the decider the host names, the CLI version and the documented
   policy it corresponds to (read at execution, dated), with the retained
   observation's path. Check: the record exists and names a reason or its
   absence.
3. The repair the reason admits, in `scripts/lib/drive-worker.mjs` (the Codex
   argv) or in the launch policy the host documents, never a bypass; a
   regression in `scripts/test-drive.mjs` for the launch shape;
   `docs/evidence/WO-247/decisions.md` records what was found and chosen,
   with the operator's words when the choice is theirs (an explicit per-run
   approval). Check: `npm test -- --only harness-fixtures`.
4. `scripts/lib/drive-session.mjs` (`runDrive` 890; 779): the
   `awaiting-close` stop with its next step; `--host claude` admitted on
   re-entry for release close only and recorded as `hostChange`;
   `scripts/lib/drive-route.mjs`: the stop's row. Check: `npm test -- --only
   harness-fixtures`.
5. `scripts/lib/drive-evidence.mjs` and the receipt writer: `codeIdentity {
   source, fixtureTrees }` per attempt (the source is `gateCodeIdentity` of
   the authoring checkout at the export) and `drivenStart { role, bytes }`
   per launched role; `requireGateClaims` (`scripts/lib/handoff-ledger.mjs`
   306, reached from `scripts/resume.mjs` 1612 at `implementation-ready`
   and 1699) compares a live receipt's source identity with the handoff
   identity when a criterion names a live run and fails a mismatch naming
   both, with a CLI regression that rejects a mismatched receipt and admits
   a matching one; `scripts/test-process-debt.mjs` reads the driven-start
   figure beside the meter. Check: `npm test -- --only harness-fixtures`;
   `npm test -- --only process-debt`; `npm test -- --only resume`.
6. `scripts/lib/config.mjs`: the `drive` section with `sandbox`; one
   adapter in `scripts/lib/drive-worker.mjs` (142, 192, 206) maps the
   election per host (Claude: the disposable setting; Codex: the unsandboxed
   mode its page documents, read at execution; an unsupported host refuses
   before launch) and records selected and observed policy separately;
   `scripts/fixtures/drive-live.mjs` (61, 86) reads the election in place of
   `DOTLN_LIVE_SANDBOX`, which stays as the fixture's override and is named
   in the receipt when set; `dotln.config.example.json` names the key. Check:
   `npm test -- --only configuration-root`; `npm test -- --only
   harness-fixtures`.
7. The ten items: `scripts/lib/drive-transport.mjs` (a hung remote's
   transport child ends with the fetch limit); `scripts/lib/drive-route.mjs`
   (`routeFacts` without events reads no merge; a reactivated order's
   earlier release or close receipt does not route it as released); the
   lane error prefix; the router's merge sentence; WO-192's superseded step
   8 noted in `docs/evidence/WO-247/decisions.md` (the order file is a closed
   record); the floor's grant sentence; an operator's own Codex router
   without a session, stated as a limit in product 07; the worker note's
   argument sentence; a direct test of    `harness begin`'s refusal path in
   `scripts/test-harness.mjs`; each with its regression, and for the three
   reproduced defects a replayable control: the case run with only that
   defect's fix reverted, both arms' exit codes recorded in
   `docs/evidence/WO-247/controls.json` (product 07's rule of the
   2026-10-20 pass). Check: `npm test -- --only harness-fixtures`; `npm test
   -- --only harness`.
8. `scripts/lib/target-worktree-fixture.mjs` (`publicationSetup` 356 to 390)
   and its bare Git helper: the GitHub-shaped origin on an unresolvable
   host, the environment's rewrite carried by every Git call including the
   bare helper, the assertion that no fixture remote names a resolvable
   host, and a case showing a push with the environment reaches the local
   bare repository and one without it fails at resolution;
   `scripts/test-target-worktree-publish.mjs` and
   `scripts/test-target-worktree-close.mjs` pass against it with the
   production preflight unchanged. Check: `npm test -- --only
   target-publish`; `npm test -- --only target-worktree`.
9. Requalification: one live lifecycle on each host on the final code with
   `codeIdentity` recorded (`scripts/fixtures/drive-live.mjs`; Claude under
   the election; Codex under the chosen finish), the receipts under
   `docs/evidence/WO-247/`, `native-qualification.md` updated there; a
   failure is fixed in the source that fails and both runs repeat on the
   final bytes. Check: the receipts' identities equal the handoff identity.
10. Write-backs: product 07 §Operator resume phrases (`drive:`: how a drive
    finishes on each host, the stop's next step, the admitted host change,
    receipts carrying code identity, the `drive.sandbox` election) and
    §Model-specific notes (the Codex close as observed); `docs/PLAYBOOK.md`;
    the kit guide (the election); `docs/evidence/WO-247/decisions.md`;
    re-mint any edition the runtime sources stale; `npm run meta`; `node
    scripts/lineage.mjs index --check`; `npm run publication:check`.
11. Handoff: integrate `main` first when it has moved (WO-233's rule);
    finish source edits; `npm run format` and `npm run sync`; the three
    fresh independent reviewers the executor root requires; one `npm test
    -- --review` in the background awaited with `node scripts/harness.mjs
    evidence --wait`; `docs/evidence/WO-247/handoff.md`; `npm run test:docs`
    once after the last document edit; `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the retained reason and the diagnosis record; the admitted
repair or the recorded finding; the stop with its next step and the host
change for close; `codeIdentity` and `drivenStart` on receipts with the
completion comparison; the `drive.sandbox` election; the ten repairs with
regressions; the local-origin fixture; the two live lifecycles; the
write-backs.

**Acceptance criteria (all required)**

1. A fixture drive whose Codex close is declined retains the event stream
   and the declined item in the attempt receipt before the fixture home is
   removed, under the enumerated vocabulary, with no worker narrative, path
   or query text.
2. `docs/evidence/WO-247/codex-close-refusal.md` names the declined command,
   the host's reason as printed or that none was printed, the decider the
   host names, the CLI version and the documented policy it corresponds to,
   with the retained observation's path; the decisions record the repair
   chosen and why it is not a bypass.
3. A fixture drive stopped at a declined close reports `awaiting-close` with
   the attended command and the admitted re-entry; re-entry with `--host
   claude` for release close completes the close and records `hostChange`;
   re-entry with another host for any other phase is refused as today.
4. Every attempt receipt carries `codeIdentity` (the source identity and
   the fixture trees) and `drivenStart` per role; `requireGateClaims`
   fails a completion whose live receipt's source identity differs from
   the handoff identity, naming both, and admits a matching one (the CLI
   regression through `resume.mjs`); the process-debt suite reads the
   driven-start figure beside the cold-start metric without a ceiling.
5. `dotln.config.json` admits `drive.sandbox` as `host` or `off` (default
   `host`; another value refuses naming the key); a routed Claude run under
   `off` writes the disposable setting D057 describes, a routed Codex run
   under `off` launches in the unsandboxed mode Codex's page documents, a
   host without a supported form refuses before launch naming the election,
   and every receipt records the selected election and the observed policy
   separately for the router and each phase worker; the example
   configuration and the kit guide name the key.
6. The ten items are repaired with regressions: the three reproduced
   defects (the transport child ends with the fetch limit; `routeFacts`
   without events reads no merge; a reactivated order with an earlier close
   receipt routes as active), each with its replayable fixed-and-reverted
   control and both exit codes in `docs/evidence/WO-247/controls.json`; the
   six wording and record items stated where named (the lane error prefix,
   the router's merge sentence, WO-192's superseded step 8, the floor's
   grant sentence, an operator's own Codex router without a session, the
   worker note's argument sentence); and a direct test of `harness begin`'s
   refusal path.
7. Every fixture origin under `scripts/test-target-worktree-publish.mjs`,
   `scripts/test-target-worktree-close.mjs` and `scripts/test-drive.mjs` is
   a GitHub-shaped URL on an unresolvable host that `parseGitHubTarget`
   accepts; the bare Git helper carries the fixture environment; a push with
   the environment reaches the local bare repository only and a push
   without it fails at resolution; the production preflight is unchanged.
8. One live lifecycle per host on the final code, with receipts whose
   `codeIdentity` equals the handoff identity, under `docs/evidence/WO-247/`;
   Codex either closes or stops at `awaiting-close` with the recorded
   reason and the next step; `native-qualification.md` states both hosts.
9. Product 07, the playbook and the kit guide state the finish, the election
   and the identity; `npm run publication:check` is green.
10. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
    clean; no new dependency.

**Preflight:** `npm test -- --only harness-fixtures` for steps 1, 3, 4, 5,
6, 7 and 9; `npm test -- --only harness` for step 7; `npm test -- --only
process-debt` and `npm test -- --only resume` for step 5; `npm test -- --only configuration-root` for step
6; `npm test -- --only target-publish` and `npm test -- --only
target-worktree` for step 8; `npm run test:docs` when a document changes;
each under `node scripts/harness.mjs bounded --`; then one `npm test --
--review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the cases of criteria 1 and 3 to 7, the diagnosis record
of criterion 2 and the receipts of criterion 8; the deterministic re-mints of
any edition the runtime sources stale; `npm test -- --review` before
`implementation-ready`, final review reusing the passing complete row at the
integrated code identity when one exists.

**Write-back duty:** as listed in step 10 and criterion 9.

**Known issues and carry-ins:**

- The reason may be one the host does not print (attempt 49's capture showed
  an empty output); then criterion 2 records that, and the finish is the
  stop with the attended command, one of the three D102 named for the
  operator (reopen: a Codex version prints the reason or admits the close).
- Carry-in WO-192-D095 item 3 (FUP-dd1ac63cf4883d5f): the driven-start
  figure is recorded and not bounded; the ceiling's definition stays
  planning's (reopen: a driven start exceeds its installed ceiling by more
  than its launch text).
- Carry-in WO-192-D057 and FUP-18a44de758813fea: the election is the durable
  policy; whether a Support should express it is declined here (reopen: a
  second instance needs a policy per role, or a host exposes a per-run
  approval the election should name).
- The live runs cost dollars as WO-192's did; the executor records each
  attempt's cost and the order's total in the decisions (reopen: the total
  exceeds WO-192's two final attempts, $38.12, by more than half).
- The unsandboxed Codex form is read from Codex's page at execution; a
  version that documents none is the refusing case of criterion 5, recorded
  with the page and date (reopen: a Codex release changes the form).
- The meta-watcher (WO-192-D023, FUP-02446577ce028d06) is not this order's:
  the stop with a next step is a route row, not a supervisor (reopen: the
  map's candidate).
- WO-192's order file is a closed record; its superseded step 8 is noted
  here, not edited (reopen: a reader of WO-192 is misled by step 8 without
  the note).

**Non-goals:** a supervisor over routed runs; changing the dispatch bounds;
a third host; retrying a denied launcher; changing the release close's
`--publish` contract; the fork's own drives; a per-role sandbox policy.

**Operator-review assumptions:** that an explicit per-run approval, where
the host offers one, is the operator's to grant and this order records the
words; that a drive that cannot close on Codex ends at `awaiting-close` with
the attended command rather than switching hosts on its own; that
`drive.sandbox` defaults to the host's setting and the operator elects
`off` where their environments are unsandboxed. Reopen on the operator's
word.
