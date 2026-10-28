# WO-236 — The executor edits the registered target worktree: the kit declares one more outside-write grant for the executor role, the active order's registered target worktree, resolved from the launchpad's registry at every judged write, and `worktree start` prints the Claude Code launch line beside the Codex and Copilot ones (v0.101.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. One grant kind in the compiler's closed
contract, its resolution in the hook, one authority grant and one role
declaration in the contributor loadout, one printed launch line; no new
operator phrase, no new command. Assigned at activation under the standing
opt-out default.
**Cost:** adds the `target-worktree` grant kind to
`packages/compiler/src/harness.ts` (`OutsideWriteGrant`, the validation
list, `outsideWriteEffect`, the generated grant line), its resolution in
`packages/skeleton/src/harness-host.ts` (`outsideWriteResponse`), the
executor role's declaration and the `contributor.target-worktree` authority
grant in `packages/skeleton/src/loadouts/contributor.ts`, the Claude Code
line in `scripts/worktree.mjs` (`hostLaunchLines`), cases in
`scripts/test-harness.mjs`, `packages/skeleton/test/source-change-host.test.ts`
and `scripts/test-target-worktree-start.mjs`, the re-emitted manifest and
role roots, the role oracle fixture, and sentences in product 03, product
07, the security document and the kit README. Removes: the Codex-only route
for implementing a target order (every implementation and repair of the
fork's six closed target orders ran under Codex with its sandbox off; the
fork's control logs) and `operator override:` as the only Claude Code
route. Wall-clock: one registry read and one realpath per judged
outside-project write (milliseconds); nothing else. Context bytes: this
file; the executor root's grant line grows by one kind name (about 17
bytes), measured and recorded before and after. Commands: none new;
`worktree start` prints one more line. Tokens: unknown until run. Steps: 9.
Re-mints: `harness-host.ts`, `contributor.ts` and the compiler's
`harness.ts` are registered evidence sources, so the editions they stale are
re-minted deterministically; none is a file the feedback verifier judges, so
no live feedback episode; the compiler's `harness.ts` and `worktree.mjs` are
declared sources of the `launchpad-planning` machinery suite, so `npm test
-- --review` runs before handoff; the role oracle is re-minted for the grant
line.
**Nomination provenance:** the operator's dispatch of 2026-10-28 carrying
the DotLn-Enterprise-Starter fork's blocker block of the same day (the
pass's capture in ignored intake, SHA-256 recorded in the planning
document's first section; the operator's authorization in that block: the
executor may edit the registered target worktree of the order it is
executing), and the fork's journal row of 2026-10-28T13:12:32Z refusing an
executor Edit under its registered target worktree. Filed by the
[2026-10-28 pass](../planning/target-write-grant-and-fork-block-2026-10-28.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition; the fork is the operator's own instance and only its
generic record is cited.
**Depends on:** WO-144 (closed: the fifth refusal, its grant kinds and the
authority binding this order extends by one kind), WO-221 (closed: the
target registry the hook already reads for the publish admission and the
host launch lines this order extends), WO-233 (closed, v0.100.0: an active
order behind `main` integrates by the main checkout's current code, which
this order or WO-234 uses, whichever closes second). WO-234 is
reference-only: active in its worktree with hunks in `harness-host.ts`,
`contributor.ts`, the compiler's `harness.ts` and the role oracle that
overlap this order's; this order does not wait on it.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the fifth refusal, its grant kinds and the authority binding this order extends by one kind"
  },
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "the target registry the hook already reads for the publish admission and the host launch lines this order extends"
  },
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "an active order behind main integrates by the main checkout's current code, which this order or WO-234 uses, whichever closes second"
  },
  {
    "workOrderId": "WO-234",
    "relation": "reference-only",
    "reason": "active in its worktree with overlapping hunks in harness-host.ts, contributor.ts, the compiler's harness.ts and the role oracle; this order does not wait on it"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 03 §Candidate — DotLn-owned
authority with minimal native harness restrictions (the operator's answers
of 2026-09-19 and the "Implemented 2026-09-19 — WO-144" paragraph, 876 to
905: the kinds a role may declare); product 07 §Workflow closeout and
releases (the registered-target paragraph, about 2136 to 2160: the hook's
admission of the publish helper and the printed Codex and Copilot lines) and
§Operator recovery controls (`operator override:`, what it suspends);
`docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144, 2026-09-19 (278
to 290 and 335 to 365: the fifth refusal, the available declaration kinds,
the Copilot reuse of the Claude registration);
`packages/skeleton/src/harness-host.ts` (`outsideWriteResponse` 4859 to
5030 and its kind switch 4936 to 4967; `RegisteredTargetEntry` 1409 to 1418;
the publish admission's registry read 1878 to 1930; `harnessControl` 593 to
612; the session binding at 905 to 919; `knownWriteDestinations` and
`withinRoot` as the judgment's inputs); `packages/compiler/src/harness.ts`
(`OutsideWriteGrant` 213 to 219; the validation list 345 to 360;
`outsideWriteEffect` 365; the provenance admission 395 to 407; the generated
grant line 1079 to 1086); `packages/skeleton/src/loadouts/contributor.ts`
(`contributorOutsideAuthority` 31 to 45; the per-role grants 245 to 259;
`targetWorkerProfiles`); `scripts/worktree.mjs` (`hostLaunchLines` 553 to
578; the `Next (run manually)` lines at 705 and 1096);
`scripts/lib/target-worktrees.mjs` (`targetWorktreeForOrder`,
`registeredOrder`); `scripts/test-harness.mjs` (`withOutsideAuthority` 166;
the WO-144 cases at 9410, 9628 and 9755); `packages/skeleton/test/source-change-host.test.ts`
(the operator-root case at 1505); `docs/work-orders/WO-221-target-order-without-an-operator-step.md`
(the host notes, 210 to 245 and 330 to 345); `scripts/kit/README.client.md`
(the host lines, 178 to 190).

**Objective:** A Claude Code executor dispatched on a target order edits
the order's registered target worktree without an override and without
changing any other refusal. The kit declares a sixth outside-write grant
kind, `target-worktree`, for the executor role only; the hook resolves it at
every judged write from the session's dispatched order, the launchpad's
registry row for that order and the row's target path, and grants nothing
when any of those is missing, doubled or bound to another launchpad; the
writer, gate-input, planning-branch and subagent refusals and the other
five grant kinds are untouched; `worktree start` prints the Claude Code
launch line beside the Codex and Copilot ones; and every instance receives
the grant through the kit update and its own `harness emit`, because the
grant is a role declaration compiled from the instance's own registry, not
a path written into a manifest by hand.

**Observed gap (dated 2026-10-28 at `main` `2b872abc`; the fork's launchpad and target worktrees read 13:12Z to 13:45Z):**

- The fork's launchpad worktree for WO-019 journaled, at 2026-10-28T13:12:32Z,
  `{"event":"PreToolUse","tool":"Edit","outsideWrite":{"role":"executor","destination":"<home>/Projects/DotLn-Angular-wo019/libs/…/study-explanation.html","status":"refused"}}`
  (its `docs/control/local/harness/<session digest>.jsonl`). Its manifest
  grants the executor `system-temp`, `session-scratch` and
  `host-scratchpad` under `contributor.outside-temporary` and nothing else;
  its registry `docs/control/local/target-worktrees.json` binds WO-019 to
  that target, its clone, branch `wo-019`, base `1c3a4ff2`, launchpad
  `<home>/Projects/DotLn-Instance-wo019` and runtime root
  `<home>/Projects/DotLn-Instance`.
- `outsideWriteResponse` (`harness-host.ts` 4859 to 5030) judges every
  known write destination outside the root against the session role's
  grants; the switch at 4936 to 4967 resolves five kinds (`system-temp`,
  `session-scratch`, `host-scratchpad`, `operator-root` from `grant.root`,
  `main-intake` from the main checkout) and nothing resolves a registered
  target. The compiler closes the set: `OutsideWriteGrant` (213 to 219) and
  the validation list (345 to 360) admit those five and refuse any other
  kind, and `operator-root` is admitted only through a provenance-bearing
  authority grant in the compiled loadout (395 to 407;
  `withOutsideAuthority` in `test-harness.mjs` 166 is how a fixture
  supplies one). `grants.json` is publication authority
  (`TARGET_PUBLICATION_EFFECTS`, the publish admission at 1920 to 1930) and
  feeds no outside-write grant, so the fork's first route, an operator grant
  beside its publication grant, is not a route the kit has.
- The hook already reads the registry: the publish admission (1878 to 1930)
  locates `docs/control/local/target-worktrees.json` in main and in the
  worktree, requires one row for the dispatched order and compares the two;
  `RegisteredTargetEntry` (1409) types the row. The session's dispatched
  order is bound at the observed lifecycle dispatch (`session.workOrder`,
  905 to 919) and is otherwise read from the canonical status
  (`harnessControl`, 593 to 612, as the publish admission does).
- `contributor.ts` maps every role to the same three kinds (245 to 259) and
  carries one authority grant (`contributor.outside-temporary`, 31 to 45).
  Product 03 (876 to 888) records the operator's answer of 2026-09-19 that
  work-stream-facing roles of the enterprise starter will by nature write
  outside a project and declare that themselves; the declaration route for
  a target worktree was never built.
- `hostLaunchLines` (`worktree.mjs` 553 to 578) prints, for a target order,
  a Codex workspace-write session with `--add-dir <target>`, Copilot
  `--allow-tool` lines for the publish commands, and for Claude Code only
  that the hook admits the registered commands at verified and closed. The
  Codex line is the only route that reaches an edit in the target; the
  `Next (run manually)` lines at 705 and 1096 name `cd <target>` and
  `codex`.
- WO-221's record (its order, 215 to 222) shows the operator's instance ran
  its first target order on 2026-10-18 under Claude Code auto mode for the
  push only and under Codex with `approval_policy = "never"` and
  `sandbox_mode = "danger-full-access"` for the work; the fork's control
  logs attest every `ImplementationReady` and `RepairCompleted` of WO-004,
  WO-005, WO-006, WO-007, WO-013 and WO-014 to `codex-cli`, with
  `claude-code` on verifications, final reviews and records. WO-019's
  `resume: next` of 2026-10-26 is the first Claude Code executor dispatch
  on a target order, and the refusal fired at its first Edit.
- No gate case covers it: the WO-144 cases (`test-harness.mjs` 9410, 9628,
  9755) grant and refuse temporary roots, scratch, an operator root and
  main's intake; the WO-221 cases (2374 onward) admit the publish helper;
  `test-target-worktree-start.mjs` asserts no Claude Code line. A Claude
  session started inside the target meets the target-worker bundle
  (`contributor.ts` `targetWorkerProfiles`; `scripts/lib/harness.mjs`
  1233), a PreToolUse-only profile with skills omitted by design and the
  same three grants rooted at the target, so the launchpad's records would
  be refused from there the same way: neither root grants the other.
- Product 03 (889 to 905), the security document (335 to 345) and the kit
  README (178 to 190) list the available kinds and the printed host lines
  as built; none names a route for a Claude Code executor on a target.

**Design (scope discipline):**

- **One kind, resolved from the instance's own registry.** The compiler
  admits `{ kind: "target-worktree" }` with no `root` field, renders
  `outside.write:target-worktree` and the kind name in the generated grant
  line; the executor role declares it with source `WO-236-D001: the active
  order's registered target worktree`; the authority grant
  `contributor.target-worktree` (granted by the operator, repo `project`,
  reason naming the operator's authorization of 2026-10-28 and the pass's
  capture digest) carries the effect. The hook resolves the root at each
  judged write: the order is `session.workOrder`, else the canonical
  status's selected order; the row is the single entry of the launchpad's
  `docs/control/local/target-worktrees.json` (the control root as the
  publish admission resolves it) whose `workOrderId` is that order and whose
  `launchpad` is this root's physical directory; the order's phase, read
  from the same status, is `active` or `repairing`; the root is
  `prospectiveRealpath(entry.target)`. Any other case grants nothing and
  pushes the cause into the `ungranted` rows so the refusal names it in
  WO-168's form (`Granted root … grants nothing: <cause>`). The journal row
  records kind, `originId`, source and `authorityGrantId` as for the other
  kinds. Rejected: an operator-root grant written by hand per order (axis:
  the path would be baked into a compiled manifest for one order, stale at
  the next, and needs a loadout change plus an emit per order; the
  compiler admits it only through a provenance-bearing authority grant in
  the loadout, 395 to 407). Rejected: `operator override:` as the standing
  route (axis: it suspends all five refusals for the session; the fork
  asked for the narrowest route and this is the narrowest). Rejected:
  granting the launchpad from the target bundle and running the executor
  inside the target (axis: the lifecycle, the records and the role skills
  live in the launchpad, and the target profile omits skills and lifecycle
  hooks by design). Rejected: granting the verifier and reviewer too (axis:
  they read the target and run its declared gate, whose program effects
  the hook does not judge; the fork asked for the executor only, and a
  refused verifier write is this order's reopening condition, not its
  scope).
- **The other refusals and kinds do not move.** The writer, gate-input,
  planning-branch and subagent refusals are untouched; the five existing
  kinds keep their resolution; an in-project write never consults the
  table (WO-144). Under Copilot, which reuses the Claude registration, the
  same judgment admits the executor's write; under Codex nothing changes
  (`--add-dir` remains the route, and Codex tool calls are unhooked).
- **The launch line.** `worktree start` prints, for Claude Code, the
  launchpad as the session directory, `resume: next` as the phrase, and the
  target as the root the executor's grant admits for this order, with host
  deny and ask rules still applying. The `Next (run manually)` lines name
  the directory each host's session starts in consistently with the host
  lines; the executor confirms the Codex directory against WO-221's host
  evidence (210 to 245) and the registry's `launchpad` field, and records
  which it is.
- **Live-run surfaces at the base.** The refusal and its journal row:
  exist (the fork's row above). The registry and its two-checkout
  comparison: exist (1878 to 1930). The session's bound order: exists (905
  to 919); the canonical-status fallback: exists (593). The operator-root
  resolution the new kind sits beside: exists (4950). A Claude Code launch
  line: absent. A grant kind resolved from a registry: absent.

**Execution plan (the executor follows these steps in order; observed at `2b872abc`, 2026-10-28):**

1. `packages/compiler/src/harness.ts`: `OutsideWriteGrant` (213 to 219)
   gains `{ readonly kind: "target-worktree" }` with no `root`; the
   validation list (345 to 360) admits it and refuses a `root` on it;
   `outsideWriteEffect` (365) renders `outside.write:target-worktree`; the
   generated grant line (1079 to 1086) renders the kind name. Check: `npm
   run build`; `npm test -- --only harness`.
2. `packages/skeleton/src/loadouts/contributor.ts`:
   `contributorOutsideAuthority` (31 to 45) gains
   `contributor.target-worktree` (version 1, `grantedBy: "operator"`, the
   effect, repo `project`, the reason of the Design); the executor's
   `outsideWriteGrants` (the map at 245 to 259, for `contributor.executor`
   only) gains `{ kind: "target-worktree", source: "WO-236-D001: the active
   order's registered target worktree" }`; the other five roles keep three
   kinds. Then `npm run build && node scripts/harness.mjs emit && node
   scripts/harness.mjs check`. Check: `npm test -- --only harness`; `npm
   test -- --only launchpad` (the exported manifest).
3. `packages/skeleton/src/harness-host.ts` `outsideWriteResponse` (4859):
   the switch (4936 to 4967) gains `case "target-worktree"` resolved as the
   Design says, reusing the control-root and registry reads of the publish
   admission (1878 to 1884) and `harnessControl` (593) when
   `session.workOrder` is unset; every failed condition (no session order,
   no row, two rows, a row bound to another launchpad, a phase that is not
   `active` or `repairing`, an unreadable registry) pushes its cause into
   `ungranted` and grants nothing. Check: `npm test -- --only harness`
   (the cases of criteria 2 to 4); `npm test -- --only harness-fixtures`.
4. `packages/skeleton/test/source-change-host.test.ts`: the hook-level case
   beside the operator-root case at 1505 (granted under the registry row;
   refused beside it). Check: `npm test -- --only skeleton`.
5. `scripts/worktree.mjs` `hostLaunchLines` (553 to 578): the Claude Code
   line of the Design; the `Next (run manually)` lines (705 and 1096) made
   consistent with the host lines, the Codex directory confirmed against
   WO-221's evidence and recorded in the decisions;
   `scripts/test-target-worktree-start.mjs` asserts the printed lines.
   Check: `npm test -- --only target-worktree`.
6. The role oracle fixture `packages/skeleton/fixtures/wo236-role-baseline.json`
   from the latest one with the chain intact; the decisions record each
   root's cold-start bytes before and after (the executor's grant line is
   the only growth). Check: `npm run harness -- check`; `npm test --
   --only process-debt`.
7. `docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144, 2026-09-19:
   the sixth kind, its binding (the executor role, the dispatched order,
   the registry row, the phase) and the Copilot row. Check: `npm run
   publication:check`.
8. Write-backs: product 03 §Candidate — DotLn-owned authority with minimal
   native harness restrictions (the "Implemented 2026-09-19 — WO-144"
   paragraph: the kind list and its resolution); product 07 §Workflow
   closeout and releases (the registered-target paragraph: the Claude Code
   launch line and the grant beside the Codex and Copilot lines);
   `scripts/kit/README.client.md` (the host lines paragraph, 178 to 190);
   `docs/evidence/WO-236/decisions.md`; `npm run meta`; `node
   scripts/lineage.mjs index --check`; `node scripts/check-publication.mjs
   --print-locks`; `npm run publication:check`.
9. Handoff: integrate `main` first when it has moved (WO-233's rule, by the
   main checkout's current code); finish source edits; `npm run format` and
   `npm run sync`; the three fresh independent reviewers the executor root
   requires; start one `npm test -- --review` in the background, never
   under the bounded wrapper, and await it with `node scripts/harness.mjs
   evidence --wait`; after it passes, complete `docs/evidence/WO-236/handoff.md`;
   `npm run test:docs` once after the last document edit; then `npm run
   resume -- implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the sixth grant kind in the compiler contract; its
resolution in the hook; the executor's declaration and the authority grant;
the re-emitted manifest and role roots with the re-minted oracle; the Claude
Code launch line and consistent `Next` lines; the cases and the paired
control; the write-backs.

**Acceptance criteria (all required)**

1. The compiler admits `{ kind: "target-worktree" }` under the closed-set
   validation, refuses it with a `root`, renders its effect and its kind
   name in the generated grant line; `node scripts/harness.mjs emit` writes
   the executor's declaration and `contributor.target-worktree` to the
   manifest and `node scripts/harness.mjs check` is green.
2. In a launchpad worktree whose registry binds the dispatched order to a
   target worktree, an executor session's `Edit`, `Write` and literal shell
   redirect to a path under that target are admitted and journaled
   `granted` with kind `target-worktree`, `originId`
   `contributor.executor`, the source and `authorityGrantId`; the paired
   control at the base refuses the same write; both arms' exit codes and
   journal rows are recorded in `docs/evidence/WO-236/controls.json`.
3. A write beside the target (its parent, a sibling worktree, the clone), a
   write by a verifier, reviewer or release-close session into the target,
   and an executor write when the registry has no row or two rows for the
   order, when the row's `launchpad` is another root, or when the order's
   phase is neither `active` nor `repairing`, are refused with the WO-144
   message naming the withheld cause in WO-168's form; each is a case.
4. The writer, gate-input, planning-branch and subagent refusals and the
   five existing kinds are unchanged: the WO-144, WO-158 and WO-168 cases
   pass unmodified.
5. `worktree start` prints the Claude Code line naming the launchpad as
   the session directory, `resume: next` and the target as the granted
   root for this order, keeps the Codex and Copilot lines, and prints
   `Next (run manually)` lines consistent with them;
   `scripts/test-target-worktree-start.mjs` asserts the lines, and the
   decisions record the Codex directory and its evidence.
6. The security document states the sixth kind, its binding and the
   Copilot row (the same hook under the reused Claude registration); a
   harness fixture under the Copilot profile covers the admission where the
   fixtures cover that profile, else the decisions record it as role text.
7. The re-emitted roots are pinned by `wo236-role-baseline.json` with its
   chain intact; the decisions record each root's cold-start bytes before
   and after, within the ceilings of `docs/control/budgets.json`.
8. Product 03 lists the kind and its resolution; product 07 and the kit
   README state the Claude Code launch line beside the Codex and Copilot
   lines; `npm run publication:check` is green.
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only harness` for steps 1 to 3; `npm test --
--only harness-fixtures` for step 3; `npm test -- --only skeleton` for step
4; `npm test -- --only target-worktree` for step 5; `npm test -- --only
process-debt` for step 6; `npm test -- --only launchpad` for steps 2 and 8;
`npm test -- --only configuration-root` for every script step; `npm run
test:docs` when a document changes; each under `node scripts/harness.mjs
bounded --`; then one `npm test -- --review` (07-execution-guide.md
§Preflight before the full gate).

**Evidence gate:** the cases and controls of criteria 1 to 8; the
deterministic re-mints of the editions `harness-host.ts`, `contributor.ts`
and the compiler's `harness.ts` stale; the re-minted role oracle; `npm test
-- --review` before `implementation-ready`, final review reusing the passing
complete row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 8 and criteria 6 and 8.

**Known issues and carry-ins:**
- WO-234 is active in its sibling worktree (activated 2026-10-28T12:53Z;
  its implementation begun) and edits `harness-host.ts`, `contributor.ts`,
  the compiler's `harness.ts` and the role oracle; whichever of the two
  closes second integrates `main` by the main checkout's current code
  (WO-233's rule) and re-mints the oracle once more; the executor records
  the integration and its conflicts (reopen: an integrate leaves the two
  orders' hook changes disagreeing on a refusal or a grant).
- The fork's live WO-019 session has two routes until it takes the
  release: a Codex session with `--add-dir`, as WO-004 to WO-014 ran, or
  `operator override:` in its Claude session, which suspends all five
  refusals for that session and records its use at `operator override:
  off`; neither is this order's and the choice is the operator's (reopen:
  the fork reports a third route, or an override session edits outside the
  target).
- The `Next (run manually)` lines name `cd <target>` and `codex` while the
  Codex host line adds the target to a session elsewhere; step 5 makes them
  consistent and records the evidence (reopen: a host page names a
  different directory for a workspace-write session than the recorded
  one).
- The target-worker bundle's own hook, met by a Claude session started
  inside the target, grants the target's root and nothing in the launchpad;
  a session there is a worker, not the executor (reopen: an instance runs
  its executor inside the target and is refused writing the launchpad's
  records).
- The verifier's target gate and probes run as programs whose effects the
  hook does not judge, so verification needs no grant (reopen: a verifier's
  `Write` or `Edit` into the target is refused and the verification needed
  it).

**Non-goals:** grants for the verifier, reviewer, release-close, planner or
refuter roles; an operator-root grant per order; any change to `operator
override:`; the target-worker bundle and its profile; Codex sandbox or
Copilot permission configuration; the fork's own orders, worktrees or
records; retention of journals (WO-237).

**Operator-review assumptions:** the operator authorized on 2026-10-28, in
the fork's block, that the executor may edit the registered target worktree
of the order it is executing; this order reads that authorization as the
kit's rule for every instance's executor, because the registry row the
grant resolves from is the instance's own registration written by its
operator's `worktree start`, and no instance is granted a path it did not
register.
