# Copilot CLI as a third operator-launched harness — what the installed CLI already does, what is untested, and one order to make it supported (2026-09-20)

Planning pass opened on `main` at `78d23335` on branch
`planning/2026-09-20-copilot-cli-integration`. Document-only. The operator's
dispatch is captured verbatim in ignored intake
(`docs/intake/notes/2026-09-20-copilot-cli-integration-planning.md`, SHA-256
`22fc3f0a1167631df6f41c2b99709ea676a323c00bb11848a43adb04b56ac60e`). The pass
files one order, [WO-146](../work-orders/WO-146-copilot-cli-harness.md),
places it, and records one candidate it met on the way. It does not reopen the
roadmap, implement anything or change a setting.

Labels in this document follow the Codex runtime map: **observed** (a command
or file on this machine showed it), **documented locally** (the CLI's bundled
changelog, help, schema, type declarations or binary strings say it),
**untested** (nothing has exercised it) and **blocked**.

## 1. What was asked, and the cut

The operator installed GitHub Copilot CLI and wants it supported for ordinary,
operator-launched implementation, fixing and verification: the same compiled
roles and skills, the CLI's behavior verified rather than assumed, each
control labeled by what it actually guarantees, the harness recorded apart
from its model, sandbox-off and minimal approvals kept optional, personal
settings proposed and never applied, a bounded live qualification, and no
duplicated hooks, weakened gates or new mandatory full-gate runs.
Resident-launched and autonomous use are outside the milestone.

The cut: one order that probes first and lets the record choose how much
enforcement it can honestly claim. If the probe is unfavorable, the same order
still ends in a supported harness at Codex's width.

## 2. Existing Copilot work: none

Checked on 2026-09-20: `git worktree list` shows only `main`; no local or
remote branch, stash, checkpoint or integration ref, or commit message names
Copilot; the tree's one hit is unrelated ledger prose about index cards;
ignored intake mentions the product only in passing. Three earlier Copilot
sessions on this machine ran in a since-removed WO-144 worktree; their
shutdown records show zero requests and no code changes. There is nothing to
reuse or amend, and nothing to duplicate.

## 3. What the installed CLI does

CLI 1.0.86, a standalone binary whose unpacked package carries a changelog,
help topics, a session-event schema and SDK type declarations.

| Surface                              | Finding                                                                                                                                                                                                                                                                  | Label                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| Repository instructions              | `copilot instruction list` reports `AGENTS.md + CLAUDE.md` for this repository. `AGENTS.md` is a symlink to `CLAUDE.md`; the changelog says identical instruction files are sent once (1.0.26)                                                                            | observed; once-only untested |
| Project skills                       | `copilot skill list` reports the six `dotln-*` skills. Help names `.github/skills/`, `.agents/skills/` and `.claude/skills/` as project roots. Which root it resolved is not shown; the two are byte-identical                                                             | observed                    |
| Hooks in `.claude/settings.json`     | Changelog: the file is a repository configuration source (1.0.12); hooks may be defined in settings files (1.0.8); nested Claude-style groups are handled (1.0.66). The native runtime contains `${CLAUDE_PROJECT_DIR}`, `hook_event_name`, `tool_input`, `hookSpecificOutput` | documented locally; untested |
| Hooks in `.github/hooks/`            | Changelog: repository hooks load there, only in a trusted folder (1.0.8), and in `-p` when the folder is trusted or an opt-in variable is set (1.0.40, 1.0.49)                                                                                                             | documented locally; untested |
| Denial                               | Changelog: a pre-tool hook error denies the call (1.0.57); exit code 2 denies (1.0.70); a hook time-out lets the call continue (1.0.67). SDK types: pre-tool output `permissionDecision` of `allow`, `deny` or `ask`                                                       | documented locally; untested |
| Sub-agents                           | Changelog: pre-tool, post-tool and subagent hooks fire for sub-agent tool calls (1.0.49). Schema: `subagent.started` carries the parent tool call id and a parent task id                                                                                                 | documented locally; untested |
| Stop                                 | SDK types: an agent-stop hook may return `decision: "block"`; the CLI ends the turn after eight consecutive blocks and passes `stop_hook_active` (1.0.72)                                                                                                                   | documented locally; untested |
| Session identity                     | `~/.copilot/session-state/<id>/` holds `workspace.yaml` (id, cwd, Git root, branch) and `events.jsonl`; `session.start` records the CLI version, cwd, Git root, branch and head commit                                                                                    | observed                    |
| Model and effort                     | `session.model_change` records the model, reasoning effort and the source of the change. Observed rows: a named model with `xhigh`; a picker change; and `auto` with a null effort                                                                                       | observed                    |
| Session id for shell commands        | The bundle reads `COPILOT_AGENT_SESSION_ID`; whether a shell tool command sees it is unknown                                                                                                                                                                              | untested                    |
| Sandbox                              | Command sandboxing is experimental and off by default; with it off, shell commands run with the user's full access (`copilot help sandbox`)                                                                                                                                | documented locally          |
| Approvals                            | Default permission mode prompts for writes and commands; `--allow-all-tools` and `--allow-all` remove the prompts; whether a hook denial still holds under them is unknown                                                                                                | documented locally; untested |
| Attribution                          | `includeCoAuthoredBy` defaults to `true`; the operator's setting is `false`                                                                                                                                                                                               | observed                    |
| Memory                               | Cross-session memory defaults to on in interactive sessions and off in `-p`                                                                                                                                                                                               | documented locally          |
| Outward channels                     | A built-in GitHub MCP server is on by default (`--disable-builtin-mcps` turns it off); `/delegate`, `--remote`, `--fleet` and autopilot exist                                                                                                                              | documented locally          |

The consequence that matters most: DotLn's thirteen hook commands all begin
`node "$CLAUDE_PROJECT_DIR/.claude/hooks/`. If the CLI runs them and sets that
variable, DotLn's hooks may already work under Copilot. If it runs them and
does not, each pre-tool hook errors, and an erroring pre-tool hook denies the
call. If it does not run them, Copilot is where Codex is. Nobody has observed
which, so today the state of a Copilot session in a DotLn worktree is unknown,
and adding a second registration before knowing would risk running every
handler twice.

## 4. Where DotLn adds a harness

One authoritative source, verified in this pass: the profile table
`contributorProfiles` in `packages/skeleton/src/loadouts/contributor.ts`,
lowered by `lowerToHarness` in `packages/compiler/src/harness.ts` and installed
by `npm run harness -- emit`; `harness check` re-derives every generated byte.
The skill body is built from role, support and grant data and never from the
harness id, which is why both roots are identical. The per-harness difference
lives in the profile's declared availability, the residue lines generated from
it, and whether hook files are emitted.

Adding `copilot-cli` therefore means one table entry plus the places that
today admit exactly two ids: `HarnessProfile.harness`, `assertHarnessProfile`
(id list, skills-root and instruction-path rules, and the rule that any
available event requires `claude-code` and the one named refusal protocol),
`scripts/discover.mjs` and `docs/discovery/environment.json`, and the
planning-receipt actor list. `npm run resume` already accepts any harness
string. `targetWorkerProfiles` is derived from the contributor table with
Claude-or-else branches, so the new entry must be excluded there or it becomes
a third target-worker profile treated as Codex.

## 5. The controls, as they stand for Copilot today

From the source, every refusal rides one channel: a pre-tool hook returning
`hookSpecificOutput.permissionDecision: "deny"`. Prompt-submit never rejects a
prompt, post-tool cannot refuse, and stop only advises. The completion gate
that actually throws is the plain `npm run resume` command
(`requireLifecycleEvidence`), which is harness-independent.

| Control                                  | Claude                                         | Codex                                   | Copilot today | What the probe must show for "enforced"                                      |
| ---------------------------------------- | ---------------------------------------------- | --------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| Session and worktree identity            | `sha256(session_id)`, cwd equals Git root      | `CODEX_THREAD_ID`, explicit entry       | untested      | `session_id` and `cwd` on the payload, or a session-id variable (H3, H9)    |
| Writer reservation                       | pre-tool reserve and deny; release at stop     | role text; release at handoff           | untested      | pre-tool with write and shell arguments, a denial, an owner process (H5, H11) |
| Presence heartbeat                       | four hooks; inert without a resident store     | none                                    | untested      | any of the four events with `session_id`; origin stays `actor`              |
| Gate-input protection                    | pre-tool deny; `evidence --stop` plain command | stop command only                       | untested      | pre-tool with tool arguments and a denial                                   |
| Planning-branch write boundary           | pre-tool deny                                  | role text                               | untested      | the same                                                                    |
| Subagent cap and descendants             | pre-tool admit; post-tool join by `agentId`    | role text and a manual count            | untested      | spawn tool name, `tool_use_id`, a child identity on child hooks (H4, H8)    |
| Outside-write grant                      | pre-tool deny, judged even off-root            | role text; `harness scratch`            | untested      | pre-tool with the session's real cwd and a denial                           |
| Write observation and authorship         | pre-tool and post-tool pairing                 | `harness begin`, `observe`              | untested      | both events for edit, create and shell                                      |
| Read observation                         | post-tool with file content and range          | `harness read-output`, `delivered`      | untested      | a read response carrying content and line range; else the plain commands    |
| Observed-facts block                     | prompt-submit `additionalContext`              | appended to `resume` output             | untested      | H6, or H9 for the command path                                              |
| Usage counters                           | transcript at stop or by command               | transcript by command                   | unsupported   | a counter source in the event log (H12); the collector knows two roots      |
| Model and effort readback                | not available; operator-attested               | session readback                        | unsupported   | none needed: the event log is observed; a reader is missing                 |
| Stop judgment                            | advisory                                       | none                                    | untested      | advisory in every harness by design                                         |
| Lifecycle-evidence command               | enforced                                       | enforced                                | enforced      | plain `node` and `git`; nothing harness-specific                            |
| Writer release at handoff                | stop hook                                      | command, keyed on the thread id         | untested      | a stop event, or H9                                                         |
| Compaction continuation                  | not applicable                                 | adapter on four native events           | unsupported   | outside this order                                                          |
| `analysis:` and `operator override:`     | inlined in every hook; plain command too       | plain command                           | untested      | the plain command works anywhere; the hook path needs H1                    |
| Verifier independence                    | a fresh session; not judged in code            | the same                                | the same      | not mechanical in any harness                                               |
| Reviewer publish and release close       | plain `git` and `gh` helpers                   | the same                                | untested      | not qualified by WO-146                                                     |

"Untested" is the honest label for most rows. WO-146 replaces each with one of
the other three and an anchor.

## 6. Decisions of this pass

- **D1. One order, probe first, branch by record.** Source: §3's unknown and
  the profile model in §4. The branches are reuse of the existing hooks, one
  native registration pointing at the same handlers, or advisory parity with
  Codex. Reopen: the probe shows a fourth case the branch rule does not cover.
- **D2. No new skill root, instruction file, agent or plugin.** Source: the
  CLI already lists the instructions and the six skills (observed), and the
  operator's direction against a drifting copy. Reopen: a CLI version stops
  reading `.agents/skills` or `.claude/skills`.
- **D3. `copilot-cli` is the harness id, never inferred from the model.**
  Source: the CLI routes Claude, GPT and other models (`copilot help config`
  lists them); the control log already holds 251 attestations keyed by harness
  with the model beside it. Reopen: none foreseen.
- **D4. Readback source `copilot-session-readback`, from the CLI's own event
  log; everything else `operator-attested` or `unknown`.** Source: the control
  log's existing convention (`codex-session-readback` on 29 events,
  `operator-attested` on 99) and the observed `session.model_change` rows,
  including `auto` with a null effort. It is the selected value, not an
  effective-effort claim. Reopen: the CLI exposes an effective value.
- **D5. "Enforced" needs a live denial and a fixture, and says whether it
  holds under `--allow-all-tools`.** Source: the operator's direction, and
  product 03's record that a sandbox flag or a documented feature did not
  establish containment. Reopen: none.
- **D6. No repository file sets a Copilot permission, trust, sandbox, memory
  or attribution value; proposals are a list the operator applies.** Source:
  the operator's direction and the platform lens (no private setting as the
  source of a guarantee). Reopen: a DotLn control is shown to depend on one.
- **D7. Qualification runs in a scratch repository with the emitted bundle,
  operator-launched, four episodes, bounded credits.** Source: WO-056's
  precedent that the operator runs live episodes; the existing live suite and
  probe as the reuse point. Using Copilot to verify WO-146 itself was weighed
  and declined: the order would be judged by the harness it qualifies.
  Reopen: the operator wants a shadow verification as extra evidence.
- **D8. Target workers stay two; resident-launched Copilot is a non-goal.**
  Source: the dispatch; WO-122's rule that a CLI worker needs its own observed
  launch row. Reopen: an order that needs a Copilot worker.
- **D9. Final review and release close are labeled untested under Copilot.**
  Source: their helpers are plain `git` and `gh`, so nothing is known to
  block them, and nothing has exercised them; the CLI's built-in GitHub MCP
  server and `/delegate` are outward channels the helpers do not govern.
  Reopen: a later qualification order.
- **D10. Placement: own slot after WO-140 and WO-056, before WO-145 and
  WO-090.** Source: §7. Reopen: WO-140 is deferred, in which case WO-146 may
  go first and WO-140 integrates main.

## 7. One order, and where it goes

Two orders, a probe and then an integration, were weighed because the probe
decides how much there is to build. One order wins: Branch C is a complete
outcome that needs no second order, Branches A and B are bounded to the
decoder, the tool table and at most one emitted registration, and a probe-only
order would close without giving the operator a supported harness. The
uncertainty is real but it is inside one delivery boundary.

Surfaces: `packages/compiler/src/harness.ts`,
`packages/skeleton/src/loadouts/contributor.ts`,
`packages/skeleton/src/harness-host.ts`, `harness-command.ts`,
`usage-observation.mjs`, `scripts/harness-probe.mjs`, `scripts/lib/harness.mjs`,
`scripts/discover.mjs`, `scripts/lib/plan-receipts.mjs`, the regenerated
bundle, products 03 and 07, the security document and the playbook.

- WO-140 edits the briefing and usage readback in the same host file. Not a
  pair.
- WO-056 edits `docs/evidence/WO-056/` and one receipt fixture. Disjoint, and
  on the critical path; WO-146 does not delay it.
- WO-145 edits the loadouts and regenerates the bundle. Not a pair.
- WO-090 restructures product 07 and the security document, which WO-146
  writes. WO-146 goes first so WO-090 compacts the result once.

So WO-146 takes its own one-entry slot after the WO-140 and WO-056 pair. It is
not on the critical path: it blocks no runtime order and no order depends on
it. Its contribution is operator flow, a third harness for the two roles that
consume most sessions, and one removed unknown. No existing pair is recut.

## 8. The operator workflow afterward

Exact where this pass observed the flag or command; the two places the probe
decides are marked.

```text
# once per worktree: accept the folder-trust prompt at first launch
cd <worktree root>                      # cwd must equal the Git root
copilot --model <id> --reasoning-effort <level> --disable-builtin-mcps \
        [--allow-all-tools] [--no-auto-update]

> resume: next                          # executor; or: resume: fix
```

A fresh `copilot` session, started the same way, takes `resume: verify`.

1. The CLI loads `AGENTS.md + CLAUDE.md`, which map the phrase to the
   `dotln-executor` or `dotln-verifier` skill. Probe-decided: under Branch A
   the prompt-submit hook resolves the role and injects the briefing as it
   does in Claude; otherwise the model runs `npm run resume -- next`, `-- fix`
   or `-- verify` itself as it does in Codex, after
   `node scripts/harness.mjs begin <session> <role>`.
2. The role works under whichever controls the table marks enforced; the rest
   are duties in the role text.
3. `npm test`, then completion with the actor flags:

```text
npm run resume -- implementation-ready \
  --harness copilot-cli --harness-version <cli version> \
  --model <id> --effort <level> --source copilot-session-readback
```

Probe-decided: `--source copilot-session-readback` when the values came from
the readback line in the briefing; `--source operator-attested` when the
operator supplied them; `unknown` for a value nobody supplied.
`repair-complete` and `verification-result pass|fail` take the same flags.

4. `resume: final review` and `resume: release close` stay on Claude or Codex.

`--allow-all-tools` and sandbox-off are the operator's choice. With them, the
only pre-effect controls are the rows the table marks enforced and says hold
under `--allow-all-tools`; shell effects are unconfined, as they are in the
trusted-unconfined mode product 03 already describes for the other two.

## 9. Proposed operator settings (none applied by this pass)

| File and key                                        | Observed            | Proposed        | Reason                                                                                                   | Undo                         |
| --------------------------------------------------- | ------------------- | --------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `~/.copilot/settings.json` `includeCoAuthoredBy`    | `false`             | keep `false`    | the no-attribution rule; publication rejects an AI trailer regardless, so this is convenience, not the guarantee | set `true`                   |
| `~/.copilot/settings.json` `memory`                 | unset (default on)  | `false`         | cross-session recall can carry implementer context into a verifier session                               | remove the key, or `/memory on` |
| folder trust, per DotLn worktree                    | main is listed      | accept at launch for a new worktree | repository hooks and skills load only in a trusted folder; the changelog says trust carries across Git worktrees (1.0.60). Main being trusted means any hook the CLI reads here loads today | remove the folder from `trustedFolders` |
| `~/.copilot/settings.json` `defaultPermissionMode`  | unset (`manual`)    | operator's choice | `allow-all` gives minimal approvals in interactive sessions; it removes prompts, not confinement         | remove the key               |
| sandbox                                             | off (default)       | leave off, or the operator's choice | optional in both directions; DotLn requires neither                                     | `/sandbox enable` or disable |

The executor of WO-146 re-reads these at its date, adds any the probe
surfaces, and writes nothing under `~/.copilot`.

## 10. Declined alternatives — the NoOp register of this pass

- **Do nothing; attest as `other:copilot-cli`.** What happens: Copilot already
  loads the instructions and skills, so sessions would mostly work by role
  text. Cost of inaction: the deny-all unknown stays, no control is labeled,
  discovery rejects the id, and the first surprise lands mid-order. Declined.
  Reverse if the probe shows Branch C and the operator judges the labels not
  worth the order.
- **A Copilot plugin carrying skills and hooks.** A second distribution of one
  policy, and the operator asked for no drifting copy. Reopen with the starter
  export, which has a real distribution need.
- **A `.github/` tree** (`copilot-instructions.md`, `skills`, `agents`,
  `hooks`). The CLI already reads the existing surfaces; a second tree is a
  copy at best and a double hook registration at worst. Reopen if D2 reopens.
- **Custom agents per role.** A biography per harness. Declined on the
  operator's direction.
- **Register `.github/hooks` now and see.** The intervention most likely to
  double-fire every handler. Declined until H1 is observed.
- **A probe-only order, then an integration order.** §7.
- **Copilot verifies WO-146.** D7.
- **Resident-launched Copilot.** The dispatch keeps it out; WO-122's launch-row
  rule says why it is separate work.
- **Mechanical verifier independence.** No harness has it; out of scope.

## 11. Goal alignment

Mission and critical path: not on the critical path to the always-on runtime.
It serves operator flow directly, by making a third harness usable for the
roles that consume the most sessions, and it removes supervision: today the
operator would have to translate the procedure and discover each failure by
hand. It blocks nothing and nothing waits on it; §7 keeps it from delaying
WO-056.

The eight traps: _policy resistance_ is the live one, since two hook
registrations would fight, which is why the order probes before it registers
and why criterion 3 exists. _Commons_: the order spends AI credits and
cold-start bytes, both bounded and reported, and adds no suite. _Drift to low
performance_: labels are held to a live denial plus a fixture, so a third
harness cannot lower the bar by being called supported. _Escalation_: no new
gate, receipt type or mandatory run. _Success to the successful_: the two
incumbent harnesses keep no privilege in the profile model beyond observed
rows; the invariant that hard-codes `claude-code` for any available event is
widened to a named protocol. _Shifting the burden_: the operator's hand
translation is what is removed; folder trust and the four episodes are the
operator work that remains and is stated. _Rule beating_: "supported" could be
passed by documentation alone, so the evidence gate requires the probe record,
the fixtures and the four live episodes. _Wrong goal_: the goal is sessions
the operator can actually run, so the workflow in §8 is the deliverable, not
the profile entry.

Naive Interventionism: the existing system's useful function is two harnesses
whose generated bytes are gated; criterion 4 holds them byte-stable. Affected
consumers: every Claude and Codex session, through the shared boundary
sentence and the manifest. Second-order harm: a decoder change that alters
Claude's field handling, caught by the existing fixtures. Reversible: the
profile entry and the generated rows remove cleanly by `harness emit`.
Smallest useful probe: the phase-zero `copilot` mode, which is step one.

Platform lens: the capability arrives as a profile and a manifest row other
code consumes, not a session habit; its inputs are declared and no private
setting is a source of a guarantee (D6); this repository consumes it first;
and the control table is written for a reader who was not in the session.

## 12. Candidate — a pasted dispatch does not resolve a role

Observed in this pass, in Claude Code: the operator's dispatch arrived as
pasted content, stored as `<pasted_content …>` followed by the text. The
prompt-submit hook resolves a role only when the trimmed prompt equals a known
intent or starts with `planning:` or `ideation:`
(`packages/skeleton/src/harness-host.ts`, the session branch of
`evaluateExistingHarnessHook`). This session's state file has no role, intent,
start time or usage key, the hook's "resolved role" context never arrived, and
`harness usage` refused with "requires an active role and dispatch start". The
visible symptom was every usage counter reading unknown; the collector itself
is healthy, with 50 Claude transcript rows for the previous day's planner
session. The less visible consequence is that the role's outside-write grants
do not apply, so a write to a granted temporary root is judged for role
"unknown". One link is inferred: the journal does not store prompt text, so
the string the hook received was not observed, only the stored prompt and the
missing role.

Not repaired here and not folded into WO-146. The open question is the
operator's: pasted text may carry instructions the operator did not write, so
whether a paste may dispatch a role is a judgment, not a bug fix. Options for
a later pass: leave it and document "type the phrase"; resolve on a paste only
when the paste is the whole message; or print one advisory when a known
phrase appears after a paste wrapper. Reopen: the next pass, or a second
session that loses its role this way.

## 13. Evidence and cost of this pass

Read-only inspection of `main` at `78d23335`; `copilot --help`, `help config`,
`help environment`, `help sandbox`, `instruction list` and `skill list`; the
unpacked 1.0.86 package (changelog, session-event schema, SDK types, native
strings); the shapes, not the contents, of three session-state directories;
two read-only survey agents over DotLn's generation and enforcement source,
spot-checked against the files they cite. No model call was made to Copilot,
no Copilot setting was read beyond key names and the values §9 reports, and
nothing was written outside the repository except by the refusal described in
§12. Subagents: two surveys and one refuter against a cap of twenty. Usage
counters for this session are unknown for the reason in §12.

## 14. Reversal conditions for this plan

- The probe shows hooks firing and working unchanged: the order shrinks to the
  profile, the labels and the reader; nothing here changes.
- The probe shows a CLI behavior no branch covers: stop, record it, and return
  to planning rather than widen the order.
- The CLI's next version changes instruction, skill or hook loading: the
  profile's version warning fires and the operator decides on a re-probe.
- The operator wants Copilot for final review or release close: a separate
  qualification order.
