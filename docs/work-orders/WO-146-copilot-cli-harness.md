# WO-146 — Copilot CLI as an operator-launched harness: one compiled profile from the existing loadout, the one generated hook set reused without a second registration, every DotLn control labeled enforced, advisory, unsupported or untested from a dated probe, and an executor, a fixer and an independent verifier qualified live in a scratch repository (v0.35.0)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The compiled contributor loadout gains a
third harness profile, the profile invariants admit it, the manifest and the
generated `CLAUDE.md` block gain its rows, and discovery and session readback
learn one more CLI. No kernel change. The Claude and Codex generated surfaces
change only where criterion 4 lists them. Assigned at activation under the
standing opt-out default.
**Cost:** adds one entry to the existing profile table and widens the
invariants that today admit two harness ids; one `copilot` mode in the
existing phase-zero probe and one retained discovery record; one reader for
the CLI's own session event log beside the Codex reader; fixtures inside four
existing suites and no new suite, so no new gate and no new mandatory
full-gate run. Adds role text only through the two shared constants that
already carry the Codex clauses (the boundary sentence and the adapter
sentences), counted against the cold-start ceilings; the executor reports the
new totals. Adds generated residue lines to `CLAUDE.md` in proportion to what
the probe finds unavailable: none if every event is observed, up to the eight
Codex carries today if none is. The live probe and the qualification spend the
operator's AI credits; the amount is unknown until run and each scripted probe launch carries a credit limit. Removes the operator's hand translation of the role
procedure into a third CLI, and removes an unknown that exists today: the
installed CLI reads `.claude/settings.json` as a repository configuration
source and denies a tool call when a pre-tool hook errors (its bundled
changelog, 1.0.12 and 1.0.57), so whether DotLn's hooks already fire, fire
twice or deny every tool call in a Copilot session here has never been
observed. Wall-clock, tokens and context bytes of the order itself are unknown
until run.
**Nomination provenance:** the operator's planning dispatch of 2026-09-20,
captured verbatim in ignored intake
(`docs/intake/notes/2026-09-20-copilot-cli-integration-planning.md`, SHA-256
`22fc3f0a1167631df6f41c2b99709ea676a323c00bb11848a43adb04b56ac60e`): Copilot
CLI is installed and wanted for ordinary operator-launched implementation,
fixing and verification; reuse the compiled roles, supports and skill sources;
verify the CLI's actual behavior; label each control by what it guarantees;
record the harness apart from its model; keep sandbox-off and minimal approval
optional without claiming enforcement; propose personal settings, never apply
them; bounded live qualification and deterministic tests; no duplicated hooks,
weakened gates or new mandatory full-gate runs; resident-launched and broader
autonomous use stay outside. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: no stop condition; the CLI is a public product
the operator installed personally, and no account identifier is recorded.
**Depends on:** none open. WO-144 (the outside-write grant rows every profile
carries; closed), WO-139 (the subagent cap whose accounting the probe reads
against; closed) and WO-049 (the target-worker derivation this order must not
widen; closed).
**Recommended placement:** its own slot directly after the WO-140 and WO-056
pair and before the WO-145 and WO-090 pair. WO-140 edits the briefing and the
usage readback in `packages/skeleton/src/harness-host.ts`, which this order
also edits; WO-145 edits `packages/skeleton/src/loadouts/` and regenerates the
bundle, as this order does; WO-090 restructures product 07 and the security
document, which this order writes first. It may run in the second lane beside
WO-056, whose surfaces are `docs/evidence/WO-056/` and one receipt fixture,
once WO-140 has closed. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "outside-write grant rows are part of every compiled profile and its manifest"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the subagent cap and its accounting fields are what the probe reads Copilot against"
  },
  {
    "workOrderId": "WO-049",
    "relation": "satisfied-by-close",
    "reason": "target-worker profiles derive from the contributor table and must stay at two"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
[the planning document](../planning/copilot-cli-integration-2026-09-20.md)
(the observations, the control table and the declined alternatives);
03-architecture.md §Runtime primitive catalogs and §Candidate — DotLn-owned
authority with minimal native harness restrictions;
07-execution-guide.md §Model-specific notes and §Discipline;
`docs/AI-HARNESS-SECURITY.md` §Adding another harness (the seven-item
checklist this order completes) and §DotLn hook boundary;
`packages/skeleton/src/loadouts/contributor.ts` (`contributorProfiles`,
`targetWorkerProfiles`, the shared adapter sentences);
`packages/compiler/src/harness.ts` (`HarnessProfile`, `assertHarnessProfile`,
`HARNESS_BOUNDARIES`, `mergeHarnessFragments`);
`packages/skeleton/src/harness-host.ts` (`HarnessInput`,
`decodeHarnessRecord`, `protocolRefusal`, `harnessHostProcess`);
`packages/skeleton/src/harness-command.ts` (`harnessToolEffects`);
`packages/skeleton/src/usage-observation.mjs` (`currentCodexSession`,
`sessionTranscript`); `scripts/harness-probe.mjs` (`phaseZero`);
`scripts/lib/harness.mjs` (`allowed`, `walkOwned`); `scripts/discover.mjs`;
`docs/discovery/harness-smoke-2026-09-07.md` (the record shape to follow).

**Objective:** An operator enters `copilot` with no arguments at a DotLn worktree root, as `claude` and `codex` are entered today, types `resume: next`, `resume: fix` or `resume: verify`, and gets the same
compiled role, the same skill text and the same plain-command lifecycle as in
Claude and Codex. The record names `copilot-cli` as the harness separately
from whichever model was selected, says which model and effort values were
read back from the CLI and which the operator attested, and a published table
says for each DotLn control whether it is enforced, advisory, unsupported or
untested under the probed CLI version. Nothing is claimed as enforced that a
live denial and a deterministic fixture did not both show.

**Observed gap (dated 2026-09-20, `main` at `78d23335`):**

- No Copilot work exists: no branch, worktree, stash, preserved ref or tracked
  file; the repository's one mention of the name is unrelated ledger prose.
  Three earlier Copilot sessions on this machine ran in a since-removed
  worktree and made no model call (their shutdown records show zero requests).
- Observed without a model call, CLI 1.0.86: `copilot instruction list`
  reports `AGENTS.md + CLAUDE.md` as the repository instructions;
  `copilot skill list` reports all six `dotln-*` skills as project skills,
  and its help names `.github/skills/`, `.agents/skills/` and
  `.claude/skills/` as project roots. The two generated roots are
  byte-identical (`diff -rq`), so no third root is needed.
- Documented locally, not observed: the bundled changelog says the CLI reads
  `.claude/settings.json` and `.claude/settings.local.json` as repository
  configuration (1.0.12), accepts hooks defined in settings files (1.0.8) and
  nested Claude-style hook groups (1.0.66), loads repository hooks only in a
  trusted folder (1.0.8), denies the tool call when a pre-tool hook errors
  (1.0.57) or exits 2 (1.0.70), and fires pre-tool, post-tool and subagent
  hooks for sub-agent tool calls (1.0.49). Its native runtime contains the
  strings `${CLAUDE_PROJECT_DIR}`, `${COPILOT_PROJECT_DIR}`,
  `hook_event_name`, `tool_input`, `transcript_path`, `stop_hook_active` and
  `hookSpecificOutput`. DotLn's thirteen hook commands all begin
  `node "$CLAUDE_PROJECT_DIR/.claude/hooks/`. Whether they run, with which
  payload keys and tool names, is untested.
- The CLI's session event log
  (`~/.copilot/session-state/<id>/events.jsonl`, schema bundled with the CLI)
  records the session id, CLI version, cwd, Git root and branch at start, and
  each model change with model, reasoning effort and the source of the change.
  One observed session recorded model `auto` with a null effort.
- DotLn admits two harness ids where it compiles and discovers:
  `HarnessProfile.harness`, `assertHarnessProfile` (which also requires
  `claude-code` and the one named refusal protocol before any event may be
  available), `scripts/discover.mjs` and the planning-receipt actor list.
  `npm run resume` accepts any harness string, so attestation is not the
  blocker. `targetWorkerProfiles` is derived by mapping the contributor table
  with Claude-or-else branches, so a third contributor profile would today
  become a third target-worker profile treated as Codex.
- Personal settings observed, unchanged by this pass:
  `includeCoAuthoredBy` is `false` and `effortLevel` is `xhigh` in
  `~/.copilot/settings.json`; the main checkout is a trusted folder, so any
  hook the CLI reads here loads today; command sandboxing is experimental and off by
  default in this version (`copilot help sandbox`); cross-session memory
  defaults to on in interactive sessions (`copilot help config`).

**Design (scope discipline):**

- **Probe before profile.** The existing phase-zero probe gains a `copilot`
  mode behind `DOTLN_LIVE_HARNESS=1`, in a system-temporary scratch
  repository, never in DotLn. The fixture hook is registered twice with
  distinct markers, once in Claude form in `.claude/settings.json` and once in
  the CLI's own form, so one record shows which registration fired, how many
  times per event, and with which payload key names. The record keeps shapes,
  never values, paths, prompts or identifiers. It answers, each as observed,
  not observed or blocked, with the CLI version and date:
  - H1 which registration fires for session start, prompt submit, pre-tool,
    post-tool and stop, in an interactive session and in `-p`, in a trusted
    and an untrusted folder;
  - H2 whether `CLAUDE_PROJECT_DIR` is set for the hook command, and its cwd;
  - H3 which of `session_id`, `cwd`, `hook_event_name`, `tool_name`,
    `tool_input`, `tool_use_id`, `tool_response`, `agent_id`,
    `transcript_path`, `prompt` and `stop_hook_active` arrive;
  - H4 the tool names delivered for shell, read, edit, create, skill and
    sub-agent spawn;
  - H5 whether `hookSpecificOutput.permissionDecision: "deny"` stops the call,
    whether a hook error stops it, and whether either still holds with allow-all permissions on;
  - H6 whether prompt-submit `additionalContext` reaches the model;
  - H7 whether a stop-hook `systemMessage` surfaces;
  - H8 whether a sub-agent's tool calls fire hooks, and with what child
    identity;
  - H9 whether a shell tool command sees a session-id environment variable;
  - H10 that the symlinked instruction pair loads once and a project skill
    resolves by name;
  - H11 which process `harnessHostProcess` resolves as owner, and its
    liveness;
  - H12 what the event log records for a named model, for `auto`, and after a
    mid-session model change.
- **Entry is bare `copilot`.** The operator enters the CLI with no arguments, as with the other two. Nothing DotLn needs may depend on a launch argument: what the CLI must know comes from the repository surfaces it already reads, from an in-session command, or from a personal setting on the proposed list. Launch flags appear only where a script launches the CLI, in the probe's `-p` rows. The changelog says `-p` loads repository hooks under different conditions than an interactive session, so the rows that decide the operator's workflow (H1, H5 and H12) are also observed in a bare interactive session.
- **Reuse the one hook set; the branch is decided by the record.**
  - Branch A, reuse: a control whose Claude-form registration fires with the
    fields it needs rides the existing generated hooks. No second registration
    is emitted. Payload and tool-name differences are absorbed in one place,
    the host's decoder and the shared `harnessToolEffects` table, and the host
    takes the harness id from the channel the probe observed.
  - Branch B, native registration: only if the Claude-form registration does
    not fire at all. The compiler emits one registration in the CLI's form
    that invokes the same generated handler files; no handler is copied; the
    double-registration row must show one invocation per event.
  - Branch C, advisory parity with Codex: if no denial is observed, or a
    control would need more than the decoder and the tool table, the profile
    declares those events unavailable with the probe's reason, the role text
    carries the duty as it does for Codex, and the explicit adapter commands
    (`harness begin`, `observe`, `delivered`, `read-output`, `usage`) are the
    supported path. Enforcement becomes a named candidate, not more of this
    order.
  - If H1 and H2 show the existing registration firing and erroring, every
    Copilot tool call in a DotLn worktree is being denied today. That is
    repaired at the generation source when the repair is a command-string
    change the Claude fixtures prove neutral; otherwise the order documents
    the operator-side remedy and proposes it without applying it.
- **One source, no biography.** The profile is one entry in
  `contributorProfiles` citing probe anchors. The skill bodies stay
  harness-neutral and identical across roots. Copilot clauses join the two
  shared constants that carry the Codex clauses today. No
  `.github/copilot-instructions.md`, `.github/skills`, `.github/agents`,
  custom agent or plugin is created.
- **Harness is not model.** `copilot-cli` is the harness id everywhere an id
  is enumerated. Nothing derives the harness from a model id or a model from
  the harness; the CLI routes Claude, GPT and other models and the record must
  survive any of them.
- **Readback is what the CLI wrote down, nothing more.** A reader beside
  `currentCodexSession` reports model, reasoning effort and CLI version for
  the current session from the CLI's event log, as source
  `copilot-session-readback`, in the briefing and status as Codex's is. It is
  the CLI's selected value, not an effective-effort claim. A missing log, an
  unidentifiable session, a foreign worktree, `auto` without a resolved model
  or a null effort each read `unknown` with a cause; a value the operator
  supplied stays `operator-attested`. The session is identified only by a
  channel H9 observed, or by an id the operator or model passes and the reader
  verifies against the worktree.
- **Sandbox and approvals stay the operator's.** No repository file sets a
  Copilot permission, trust, sandbox, memory or attribution value, because a
  private setting is not the source of a guarantee. The documents say what sandbox-off and allow-all permissions remove (confinement of shell effects; approval prompts), however the operator turned them on (the in-session toggle or a personal setting), and which rows of the control table still hold under them, from H5. Proposed personal settings are a list the operator applies.
- **Target workers stay two.** The target-worker derivation excludes the new
  profile explicitly; resident-launched Copilot is a non-goal.
- **Declined alternatives, recorded:** a Copilot plugin bundling skills and
  hooks (a second distribution of the same policy); a `.github/` instruction
  and skill tree (a drifting copy of surfaces the CLI already reads); a second
  hook registration added before knowing the first does not fire (the
  duplicate this order exists to avoid); custom agents per role (a biography
  per harness); attesting as `other:copilot-cli` and changing nothing (leaves
  the deny-all unknown and the labels unwritten); two orders, probe then
  integrate (the branch rule bounds the second half, and Branch C is a
  complete, smaller outcome if the probe is unfavorable).

**Deliverables:** the probe mode, its stub test and the retained record; the
profile entry and the widened invariants; the decoder and tool-table changes
the chosen branch needs; discovery for the third CLI; the session-log reader;
the regenerated bundle and manifest; the control table and the write-backs;
the qualification record.

**Acceptance criteria (all required)**

1. `node scripts/harness-probe.mjs copilot` refuses without
   `DOTLN_LIVE_HARNESS=1`, runs only in a system-temporary scratch repository,
   sets a credit limit on every scripted launch, makes at most twelve scripted launches,
   and writes one retained dated record under `docs/discovery/` answering H1
   to H12 with anchors, shapes only. H1, H5 and H12 each also carry a row the operator observed in an interactive session entered as bare `copilot`. The `claude`, `claude-bare` and `codex`
   modes and their retained records are byte-unchanged.
   `scripts/test-harness-probe.mjs` drives the new mode through a stub
   executable and asserts the shape reduction keeps key names and drops
   values.
2. `contributorProfiles` has exactly one new entry, `harness: "copilot-cli"`,
   `profileId` carrying the observed version. Every availability it declares
   cites a probe anchor; none is `true` without an observed row; its refusal
   protocol is named only if H5 observed a denial and is otherwise
   `"unavailable"`. Its skills root is one of the two existing roots. No new
   `SKILL.md`, instruction file, agent definition or plugin is tracked, and
   the six skill bodies remain identical across roots.
3. No hook runs twice. A deterministic fixture per CLI form and the probe's
   live row show each DotLn handler invoked at most once per event. Under
   Branch B the emitted registration names the existing handler files, and
   `.gitattributes`, `allowed()`, the ownership walk and `harness check` cover
   the new generated path so drift and an unowned file are refused.
4. Existing behavior is intact. For the `claude-code` and `codex-cli`
   profiles, `.claude/settings.json`, `.claude/hooks/**`, `.codex/**` and both
   skill roots are byte-identical before and after, except changes the
   executor lists by path with the reason and the existing fixture that proves
   Claude or Codex behavior unchanged. Expected changes: the generated
   `CLAUDE.md` block and `.claude/harness-manifest.json` gain the third
   profile's rows, and the shared boundary sentence gains its clause.
   `targetWorkerProfiles` still has exactly two entries with unchanged bytes,
   except `runtime.skeletonVersion` follows the changed skeleton's release
   version. The operator authorized only this metadata exception on
   2026-09-20 (WO-146-D009); every other worker-profile byte stays unchanged.
5. The control table is published in `docs/AI-HARNESS-SECURITY.md` with one
   row each for: session and worktree identity; writer reservation (reserve,
   refuse, owner source, liveness, release); presence heartbeat and its origin
   class; gate-input protection during a live gate, and `evidence --stop`;
   the planning-branch write boundary; subagent admission and descendant
   accounting; the outside-write grant; write observation and authorship; read
   observation for read-your-own-output; the observed-facts block; usage
   counters; model and effort readback; completion and handoff (the advisory
   stop judgment, the lifecycle-evidence command, writer release at handoff);
   compaction continuation; `analysis:` and `operator override:`. Each row
   says enforced, advisory, unsupported or untested, names its probe anchor or
   fixture, and says whether it holds with allow-all permissions on. A row says
   enforced only with both a live denial and a fixture. `HARNESS_BOUNDARIES`
   states Copilot's observed position once, in the sentence form used for
   Codex.
6. Fixture: two completions with `--harness copilot-cli` and different models,
   one Claude model id and one GPT model id, both project
   `harness copilot-cli` in status; `npm run discover -- harness copilot-cli`
   records the CLI's version line in `docs/discovery/environment.json`; the
   planning-receipt actor list admits `copilot-cli`; no code path maps a model
   id to a harness or a harness to a model.
7. Fixtures for the session-log reader: a named model with an effort; `auto`
   with a null effort reads `unknown` with a cause; a mid-session change
   reports the latest; a missing log reads `unknown`; a session whose cwd is
   another worktree is refused; an operator-supplied value is kept as
   `operator-attested`. `harness usage` for a Copilot session never throws or
   blocks: it reports counters from the event log if H12 recorded a counter
   source, and otherwise `unknown` with a cause code.
8. `docs/AI-HARNESS-SECURITY.md` completes its seven-item checklist for the
   CLI (settings locations and precedence, worktree inheritance of trust, read
   and write boundaries, approval behavior and pre-approved exceptions,
   network and the built-in GitHub MCP server, fail-open or fail-closed when
   sandboxing is unavailable, enable, verify and undo steps, tested date and
   version). It states that sandboxing is optional and off by default in the
   probed version, what is unconfined with it off, and that DotLn requires
   neither setting. A block titled "Proposed operator settings" lists each
   personal setting with file, key, observed value, proposed value, reason and
   undo. No tracked file and no command in this order writes under
   `~/.copilot`.
9. Live qualification, operator-launched, in a scratch repository carrying the
   emitted bundle and a fixture order, never in DotLn's control log: an
   executor session takes `resume: next` to `implementation-ready`; a fresh
   session takes `resume: verify` against a planted defect and files a failing
   report; a session takes `resume: fix` to `repair-complete`; a fresh session
   verifies to a pass. Every episode is entered as bare `copilot`; the model, effort and permission mode are whatever the operator's settings and in-session choices make them, and are recorded. At most four episodes and two retries; a credit limit, if the operator wants one, is set in-session. The record gives, per episode: harness id, CLI version,
   model, effort and their source; hook invocations by event; every denial and
   its cause; approval prompts, or `unknown` if not observable; AI credits and
   wall-clock. It extends `scripts/harness-live-suite.mjs` or the probe rather
   than adding a runner. An episode that does not complete is a finding, not a
   retry beyond the bound.
10. All new tests run inside the existing `compiler`, `harness-fixtures`,
    `harness-probe` and `process-debt` suites. `scripts/test-runner.mjs` gains
    no suite and no lane change; no gate invokes a live CLI; the executor
    reports the wall-clock delta of `npm test` and of `npm run test:machinery`.
11. The documents state what is not qualified: final review and release close
    load the same skills and their helpers are plain `git` and `gh`, but no
    push, pull request, tag or Release was exercised under Copilot, so both
    roles read `untested` in `docs/PLAYBOOK.md` and the operator keeps them on
    a qualified harness. The CLI's built-in GitHub MCP server, `/delegate`,
    `--remote`, `--fleet` and autopilot are outward or autonomous channels
    DotLn's helpers do not govern; all are named in the documents as outside this order, none is handled by a launch argument, and a persisted way to turn the built-in server off, if the CLI has one, goes on the proposed-settings list.
    Verifier independence remains a fresh session the operator starts, as in
    both existing harnesses; the CLI's cross-session memory is named as the
    one channel that can carry implementer context into a verifier.
12. Write-backs: product 03 (the third runtime target and what was observed),
    product 07 §Model-specific notes (the readback source and the attestation
    line) and the five-refusals paragraph through the generator;
    `docs/PLAYBOOK.md` role table; the capability table's dated reassessment
    if a level changes. `npm run publication:check` and `harness check` pass;
    `npm test` green; `git diff --check` clean; no new dependency; cold-start
    totals per role recorded, and a ceiling met is handled by the one route
    product 07 names.

**Evidence gate:** the probe record; the fixture transcripts; the
qualification record; `npm test` once at final review. A Copilot session in a
DotLn worktree that is denied every tool call, a DotLn handler observed twice
for one event, or a control the table calls enforced admitting what it
refuses, is the reopening observation. A CLI version outside the recorded line
warns at session entry as it does for the other two and re-probes on the
operator's direction.

**Write-back duty:** sources and reopening conditions in the order's
decisions file, including the branch chosen per control and the probe rows
that chose it; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** resident-launched or unattended Copilot (`CliTransport`,
`DETACHED_LAUNCH_ROWS`, `worker-transport.ts`, a `--transport` for planning
refutation); fleet, autopilot, remote control, delegation to the cloud agent
and the Agent Client Protocol server; a plugin or marketplace package; custom
agents; a bring-your-own-key or local provider behind the CLI (WO-110 and
WO-138 own local models); authoring a sandbox policy; mechanical verifier
independence; qualifying final review or release close; re-probing Claude or
Codex; repairing role resolution for a pasted dispatch (recorded as a
candidate by this pass); any change to personal settings.

**Operator-review assumptions**

1. `copilot-cli` is the harness id, beside `claude-code` and `codex-cli`.
2. The operator enters `copilot` with no arguments, always; model, effort, permission mode and any credit limit come from personal settings or in-session commands, never from a documented launch line.
3. The probe and the qualification spend the operator's AI credits; scripted probe launches are credit-limited and the operator's episodes are bounded by count; the operator runs the interactive rows and the four episodes.
4. Folder trust for a DotLn worktree is a personal setting the operator
   accepts at first launch; repository hooks do not load without it.
5. The CLI updates itself; the profile records the probed version, and a later
   version warns rather than refuses.
6. If the probe lands on Branch C, Copilot is supported at Codex's width,
   duties as role text and plain commands, and that is an acceptable first
   milestone.
7. Final review and release close stay on Claude or Codex until a later
   qualification.
