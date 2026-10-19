# WO-221 decisions

## WO-221-D028 — Operator-approved host-format acceptance corrections

```json
{
  "id": "WO-221-D028",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "The operator answered 'Approve both acceptance corrections' to the concrete proposal replacing criterion 2's in-settings markers with the ignored per-order ownership sidecar, preserving pre-existing operator rules on removal, and replacing criterion 3's per-repository config.toml entries with per-order .codex/rules/dotln-WO-NNN.rules under hostRules literal, removed at close. Registration, opt-in, cleanup and launch-line checks remain required. The operator separately answered 'Include both repairs' for the host-rule rewrite opt-in and starter ancestor-tag follow-ups. Amend the order through plan amend-order; this corrects acceptance text, grants no publication or host-settings change in this session, and does not alter VER-001.",
  "evidence": [
    "Operator responses in this repair dispatch on 2026-10-19: 'Approve both acceptance corrections'; 'Include both repairs'.",
    "https://code.claude.com/docs/en/settings, read 2026-10-19: settings are strict JSON; comments are syntax errors. No supported ownership-marker field was established by the documentation lookup.",
    "https://learn.chatgpt.com/docs/agent-configuration/rules, read 2026-10-19: Codex loads Starlark .rules files next to active config layers, with project rules subject to project trust.",
    "Context7 CLI library and docs lookups for Claude Code and OpenAI Codex; scripts/lib/target-worktrees.mjs writeOrderHostRules and removeOrderHostRules; VER-001 V1-F3 and V1-F4; D003 and D010."
  ],
  "rejected": [
    {
      "option": "Treat the original criteria as already met without amendment",
      "reason": "VER-001 correctly distinguishes the original artifact requirements from the implementation; the operator has now authorized the specific corrections."
    },
    {
      "option": "Insert comment markers in Claude JSON or prefix_rule calls in Codex TOML",
      "reason": "Those files would not use the hosts' documented configuration syntax."
    },
    {
      "option": "Leave the requirements and both adjacent defects unchanged",
      "reason": "The operator approved the supported formats and explicitly included both repairs."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D024",
    "observation": "Captured operator approval resolves the sidecar acceptance mismatch; the same approval resolves D025's Codex artifact and scope mismatch."
  },
  "reopenWhen": "A host documents a different supported ownership or command-rule format, or regression evidence shows the approved per-order ownership and cleanup behavior is not preserved."
}
```

## WO-221-D001 — The second admission reads main's committed registration and grant, never the session's branch

```json
{
  "id": "WO-221-D001",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "registeredTargetAdmission in harness-host.ts admits a registered repository's push, gh pr create/ready/edit/view and worktree-publish helper forms for the dispatched order's recorded target worktree only when main's committed dotln.config.json registers the repository, main's committed grants.json carries an operator grant with repo.push and pr.open for it, the worktree is the registered clone's checkout on its order branch with one GitHub push URL, the branch is wo-NNN or the recorded draft branch, a force is only --force-with-lease against the recorded draft head, and canonical status makes the form legal (verified for the draft form, closed with a passing verdict for the publish). It admits under Claude Code and Copilot, records a journal row, withholds with an advisory and falls through to the ordinary judgment otherwise, and never admits a command an emitted permissions.deny rule matches.",
  "evidence": [
    "Design A of docs/work-orders/WO-221-target-order-without-an-operator-step.md; releaseCloseAdmission as the model (harness-host.ts).",
    "scripts/lib/target-publish.mjs committedRegistration: session publication reads main's committed bytes, so the admission binds to the same authority (refs/heads/main through git show).",
    "scripts/test-harness.mjs WO-221 case: allow at verified and closed, no admission for an unregistered path, another remote, another branch, a bare --force, shell operators, phase active, a failed verdict, a missing grant and a deny match."
  ],
  "rejected": [
    {
      "option": "Read the registration from the session's own checkout",
      "reason": "The publishing branch could then authorize itself; WO-178 and the publish helper both bind to main's committed bytes."
    },
    {
      "option": "Widen the first admission to any git push",
      "reason": "It admits unregistered remotes (Design A, axis scope)."
    },
    {
      "option": "Short-circuit with an advisory when a clause fails, as the first admission does",
      "reason": "A command that merely looks like a target push would skip the compiled-authority judgment; falling through keeps every other refusal."
    }
  ],
  "reopenWhen": "The qualification shows a host ignoring the hook's allow, or a registered repository needs a publication form outside push, gh pr and the helper."
}
```

## WO-221-D002 — Codex rules are Starlark prefix rules in .codex/rules, written per order under the literal fallback

```json
{
  "id": "WO-221-D002",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "The Codex rows are written as prefix_rule entries in .codex/rules/dotln-WO-NNN.rules at worktree start under hostRules: \"literal\" and removed at release close, beside the Claude Code rules; the emitted .codex/config.toml is unchanged. A per-registered-repository rule at emit time is not expressible: the public Codex rules page describes prefix rules as Starlark in .rules files under a trusted layer's rules/ directory whose patterns are literal argv prefixes, config.toml carries no such table, and the committed registration names neither the order's worktree path nor the forge selector that a rule for git -C <path> push or gh pr --repo <selector> needs; the clone map that holds the selector is ignored and machine-local, so an emitted kit file generated from it would drift between checkouts and fail harness check.",
  "evidence": [
    "learn.chatgpt.com/docs/agent-configuration/rules read 2026-10-18 through the public page: prefix_rule(pattern = [...], decision = \"allow\", justification = ...) in <repo>/.codex/rules/*.rules, loaded when the project .codex/ layer is trusted; requirements.toml is the only TOML surface and it is restrictive.",
    "scripts/lib/config.mjs REPOSITORY_KEYS: no forge selector in the registration; scripts/lib/target-worktrees.mjs cloneMapPath is under the ignored control local root.",
    "scripts/lib/harness.mjs checkHarness compares emitted bytes with a recomputation; a local-map input would make the two differ across machines."
  ],
  "rejected": [
    {
      "option": "Emit per-repository rules into .codex/config.toml as the criterion's text says",
      "reason": "Codex reads no prefix rule from config.toml; Starlark in a TOML file breaks the file."
    },
    {
      "option": "A per-repository rule for a relative helper spelling such as node scripts/worktree.mjs publish",
      "reason": "It is not per repository and admits any order's publish, WO-195's reason for declining a project allow rule."
    }
  ],
  "reopenWhen": "The registration gains a committed forge identity, or Codex documents a config.toml rule form; then the per-repository emit becomes expressible and criterion 3's wording can be met as written."
}
```

## WO-221-D003 — The literal rules live in main's local settings with an ignored sidecar as the marker

```json
{
  "id": "WO-221-D003",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "Under hostRules: \"literal\", worktree start writes exactly the order's rules (the target worktree's push of wo-NNN, gh pr create/view/ready/edit bound to the registered selector, and the two helper spellings) into permissions.allow of the main checkout's untracked .claude/settings.local.json, writes the Codex counterpart, and records the exact strings in the ignored docs/control/local/host-rules/WO-NNN.json sidecar. Release close removes exactly those strings and the files; harness check lists a sidecar whose order has no registered target worktree, or whose rules were edited by hand, with the worktree host-rules --remove or --rewrite remedy. The declared branch is not written: the kit's own publish forms carry it and a hand push of it is not a route the kit names.",
  "evidence": [
    "Design A (the fallback) and criterion 2; the Claude Code documentation read in the planning document section 3: the untracked local settings file at the main checkout needs no trust and is resolved through worktrees.",
    "JSON carries no comment markers, so the sidecar is the DotLn-owned marker; the Codex rules file carries # dotln:WO-NNN:start and end lines.",
    "scripts/test-target-worktree.mjs WO-221 fallback case: rules written at start, removed at close, a stale sidecar named and removed."
  ],
  "rejected": [
    {
      "option": "Rules in the project .claude/settings.json",
      "reason": "Applies only after the trust dialog and admits any order at any phase (WO-195)."
    },
    {
      "option": "Any entry in user settings",
      "reason": "Outside the repository and the operator's (Design A, axis ownership)."
    },
    {
      "option": "A wildcard push rule for the registered remote",
      "reason": "It would admit any branch; the rules name wo-NNN and the kit's helper forms only."
    }
  ],
  "reopenWhen": "The qualification shows the hook's allow suffices on every host, in which case the fallback can stay off and be removed in a later order."
}
```

## WO-221-D004 — The draft form commits the working tree through a temporary index and a refs/dotln ref

```json
{
  "id": "WO-221-D004",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "publishTargetDraft stages the target worktree's working copy into a temporary index (GIT_INDEX_FILE), writes that tree, creates the commit object with commit-tree on top of HEAD, points refs/dotln/draft/WO-NNN at it so the isolated lane can fetch a ref, pushes it to the declared branch, opens the draft pull request and records PullRequestOpened with draft, branch and headSha. HEAD, the real index and git status are asserted unchanged after the push. The draft body is the body file's working bytes plus the change section; the lint, body profile and attribution checks of the final publish apply. The closed-phase publish reuses the record: a lease against the draft head, gh pr edit, gh pr ready, and a PullRequestOpened carrying reusedDraft.",
  "evidence": [
    "Design B; the executor rule No branch commits before final review; the gate's HEAD binding (scripts/lib/target-gate.mjs).",
    "scripts/lib/github-repository.mjs pushObservedCommit gained sourceRef and lease options so the lane stays the only push path.",
    "scripts/test-target-worktree.mjs WO-221 draft case: HEAD and status unchanged, the fixture gh records --draft, the reuse edits and readies pull request 7, another --branch refuses."
  ],
  "rejected": [
    {
      "option": "A WIP commit on wo-NNN",
      "reason": "The fork's hand route; it moves HEAD under the gate's binding and against the executor rule."
    },
    {
      "option": "A second pull request at closed",
      "reason": "One pull request per order (Design B)."
    }
  ],
  "reopenWhen": "A target needs the draft to carry ignored or untracked-but-excluded files, which add -A does not stage."
}
```

## WO-221-D005 — An undeclared ignored file in the base checkout refuses with the registration remedy

```json
{
  "id": "WO-221-D005",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "The base checkout's untracked files are judged by the fetched base commit's .gitignore blobs laid out in a scratch repository and run through git check-ignore --no-index, before any ref moves. A file the fetched tree ignores under a declared disposable path is deleted at a publishing close; one it ignores outside every declaration refuses naming the path and the remedy (declare it disposable or remove it); one it does not ignore keeps the not-clean refusal. Criterion 6's rule that a stray .env in either place refuses wins over Design C's sentence that an undeclared ignored base file is listed and left alone: both texts agree on the declared case and on the target, and refusing keeps operator material untouched while naming the one remedy.",
  "evidence": [
    "Criterion 6 and Design C of the order; the fork's base checkout case (.angular/cache under a .gitignore the merged tree adds).",
    "scripts/test-target-worktree.mjs WO-221 close case: the stray cache in the base is deleted under the declaration, a .env in either place refuses once with the remedy, nothing is deleted on refusal."
  ],
  "rejected": [
    {
      "option": "List undeclared ignored base files in the receipt and fast-forward anyway",
      "reason": "Criterion 6 asks for a refusal; the two order texts conflict and the acceptance text decides."
    },
    {
      "option": "Judge the base after the fast-forward",
      "reason": "Moving a branch under unjudged files is the harm the check prevents (Design C, axis ordering)."
    }
  ],
  "reopenWhen": "An operator's base checkout routinely holds ignored personal files outside declarations and the refusal costs more than the listing would; then Design C's listing form can replace this refusal in a reviewed change."
}
```

## WO-221-D006 — The target Release body is the order's title and objective; the starter Release names core's Release

```json
{
  "id": "WO-221-D006",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "A declared target release tags the merged base with the next v* tag above the target's remote tags (v0.1.0 when none) and creates the Release titled <repository id> <tag> with the order's title, its objective paragraph and the closing order and commit as the body. The starter refresh pushes core's tag name onto the refresh commit and creates the sibling's Release titled <display name> <tag> with a one-line body naming core's Release and commit. Both go through the isolated lane for the tag and the shared ensureRelease helper for the Release; an existing Release with the same title and body reports current and a differing one refuses.",
  "evidence": [
    "Design D; the order's rejection of copying core's Release body onto the sibling (axis scope).",
    "scripts/release.mjs publishTargetRelease; scripts/lib/starter-refresh.mjs ensureSiblingRelease; scripts/lib/github-repository.mjs ensureRelease, pushAnnotatedTag, remoteTagTarget."
  ],
  "rejected": [
    {
      "option": "The final review's RELEASE-NOTES edition as the target body",
      "reason": "A target order has no release-notes edition; its reviewed artifacts are the pull request body and the records commit."
    },
    {
      "option": "A target release on every close",
      "reason": "The operator: not automatic (Design D, axis opt-in)."
    }
  ],
  "reopenWhen": "An instance wants the target Release to carry its pull request body or a notes file; then the order header can name the body source."
}
```

## WO-221-D007 — The example configuration is unchanged; the keys are documented

```json
{
  "id": "WO-221-D007",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "scripts/kit/dotln.config.example.json keeps declaring only the docs base and an empty repositories object; the disposable, release and hostRules keys are documented in the kit README and docs/repositories/README.md and validated by scripts/lib/config.mjs with cases in the configuration-root suite.",
  "evidence": [
    "scripts/kit/README.client.md step 5: the example declares only the docs base on purpose; an instance copies it only when it moves a root.",
    "scripts/test-configuration-root.mjs: refusals for an absolute or climbing disposable entry, a non-array, a release policy other than declared and a hostRules other than literal; an acceptance composing class and registration entries."
  ],
  "rejected": [
    {
      "option": "Add a sample class with disposable paths to the example",
      "reason": "The example would then ship a registration an exporting instance does not have."
    }
  ],
  "reopenWhen": "The example grows a documented registration block."
}
```

## WO-221-D008 — The three host episodes are recorded blocked with their launch commands

```json
{
  "id": "WO-221-D008",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "docs/evidence/WO-221/host-qualification.md records the Claude Code, Codex and Copilot rows as blocked with the operator's launch commands, as the order's fallback for an episode not run by handoff prescribes; the fallback setting stays off (no registration carries hostRules) until an episode shows a host's classifier still running after the hook's admission.",
  "evidence": [
    "Criterion 4 and operator-review assumption 1: the operator launches the episodes as WO-146's were launched.",
    "Observed in this executor session: the Claude Code auto-mode classifier denied this executor's edits and build of the hook host as self-modification, a different judgment from the target push the episode tests; the operator exited auto mode for the rest of the work."
  ],
  "rejected": [
    {
      "option": "Launch the episodes from the executor session",
      "reason": "They spend the operator's credits and need the operator's host sessions; the order names the operator as the launcher."
    }
  ],
  "reopenWhen": "The operator runs an episode; its row is rewritten from the observations and, on a denial, the registration's hostRules is set and the literal rule that carried the command is recorded."
}
```

## WO-221-D009 — Criterion 5's cases run in the target-worktree suite beside the session fixture

```json
{
  "id": "WO-221-D009",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "The draft and reuse cases of criterion 5, the close and release cases of criteria 6 and 9, the gate advisory of criterion 8 and the literal fallback of criterion 2 are filed in scripts/test-target-worktree.mjs, whose fixture already builds the session route (a launchpad with a registered clone, a target worktree, the fixture gh and the lifecycle commands); scripts/test-target-publish.mjs keeps the episode route's cases and gains none. The fixture gh in scripts/test-target-publication-fixture.mjs records draft creation, edits, readiness and Releases for both suites.",
  "evidence": [
    "scripts/test-target-worktree.mjs publicationSetup, closeOrder and withFixture; scripts/test-target-publish.mjs scenario builds the WO-064 episode route without a target worktree.",
    "The order's Preflight names both suites for the handoff."
  ],
  "rejected": [
    {
      "option": "Duplicate the session fixture inside scripts/test-target-publish.mjs",
      "reason": "Two copies of a 300-line fixture for one case set."
    }
  ],
  "reopenWhen": "The session fixture moves to a shared module."
}
```

## WO-221-D010 — The qualification's criterion 3 clause about config.toml is judged on the public documentation

```json
{
  "id": "WO-221-D010",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "Criterion 3's first clause (the emitted .codex/config.toml carries one generated prefix rule per registered repository) is judged unmet as worded, with D002's evidence; the printed --add-dir and --allow-tool lines of its second clause are met. The generated Codex rules exist per order under the literal fallback. The verifier and the operator decide whether to waive the clause or reword it.",
  "evidence": [
    "WO-221-D002 and the public Codex rules page it cites.",
    "scripts/test-target-worktree.mjs WO-221 fallback case: the printed lines and the generated rules file."
  ],
  "rejected": [
    {
      "option": "Judge the clause met on the rules file",
      "reason": "The criterion names config.toml and per-repository emit; neither is what was built, and a wording change does not meet a criterion."
    }
  ],
  "reopenWhen": "D002's reopening condition."
}
```

## WO-221-D011 — Mint the WO-221 role oracle for the release-close deletion sentence

```json
{
  "id": "WO-221-D011",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "Mint wo221-role-baseline.json for both economy-support settings, link wo216-role-baseline.json by its exact SHA-256 and retain the WO-185 upstream chain. The role changes are the release-close profile's sentence that preservation is for operator material, evidence and intake, that regenerable output under a declared disposable path is deleted and never moved to scratch or offered back, and that an undeclared ignored path is declared disposable or removed; and, under the operator's second scope expansion (D017), the shared completion sentence and the reviewer's steps that reuse the passing complete review row at an unchanged code identity and start a complete run only when none exists, never under the bounded probe wrapper; every other role text is unchanged in both settings. The order's step 11 and D017 authorize this role-oracle change; sync deliberately cannot mint it.",
  "evidence": [
    "WO-221 step 11 and criterion 7; packages/skeleton/src/loadouts/contributor.ts disposableOutput in both the contributor and the target release-close procedures.",
    "The mint compared the new hashes with wo216-role-baseline.json: only .agents/skills/dotln-release-close/SKILL.md and .claude/skills/dotln-release-close/SKILL.md differ, in both settings.",
    "docs/control/budgets.json: the release-close cold-start ceiling is 21,266 bytes against WO-179's measured 17,170 plus this sentence."
  ],
  "rejected": [
    {
      "option": "Rewrite wo216-role-baseline.json",
      "reason": "Historical snapshots stay byte-exact."
    }
  ],
  "reopenWhen": "A later authorized role edit changes the generated instructions; preserve this snapshot and mint the next linked oracle."
}
```

## WO-221-D012

```json
{
  "id": "WO-221-D012",
  "date": "2026-10-18",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.85.0, the next minor above the observed release baseline v0.84.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.84.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-221-target-order-without-an-operator-step.md"
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

## WO-221-D013 — Operator check-in observation: a mid-turn message waited behind a chain of probes

```json
{
  "id": "WO-221-D013",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "Actor-attested check-in observation. The operator's mid-turn message (switching the host to manual mode and approving) was delivered by Claude Code alongside a later tool result after about thirty minutes, because the executor kept one turn running through consecutive probes and reached no turn boundary; the Operator Check-In support's safe boundary was therefore never offered during that span. The executor processed the message when it arrived, kept the remaining steps shorter, and records the limitation here rather than claiming an inbox readback the host does not provide.",
  "evidence": [
    "The operator's two messages of 2026-10-18 during this dispatch, surfaced with tool results, the second stating the queue time and the conclusion.",
    "The executor role's Operator Check-In text: steering is offered through available asynchronous input or a turn boundary; Claude Code surfaces a queued message only with a tool result inside a turn."
  ],
  "rejected": [
    {
      "option": "End the turn after every probe to poll for messages",
      "reason": "Each turn end stops the dispatch and needs the operator to resume; the role text asks for a boundary before the next queued item, not after every command."
    }
  ],
  "reopenWhen": "A planning pass gives the check-in a host-level mechanism (a hook that surfaces queued operator text between tool calls) or a cadence rule for long single-turn executions."
}
```

## WO-221-D014 — Self-review fixes: the two workers' findings and what each changed

```json
{
  "id": "WO-221-D014",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "Two fresh read-only workers reviewed the order and the diff. The criteria adversary reported thirteen findings and the design improver thirteen; all but three are fixed in this handoff. Fixed: the admission binds the target's origin to the forge identity recorded at worktree start, admits the helper only as the bare node or the hook's executable with the launchpad's scripts equal to main's committed scripts, judges deny rules on the raw and the quote-free spelling, never admits a push to the base branch, admits a lease only at closed, and admits gh pr ready and edit only for the pull request the draft record names with the registered base and a body inside the checkouts. The close moves and cleans the base checkout only after the target worktree is judged, deletes a nested repository under a declared root whole, deletes declared output before removing the bundle, removes the draft ref, and names undeclared base paths by top-level directory with a cap. The target release is authorized through the operator grant and the kernel's judgment of the profile, requires exactly one classification header, reuses the tag an earlier attempt of the same close published, and reads tags through the lane; the shared Release helper refuses a draft, a prerelease or assets, and the sibling's Release compares its body only. One argv table renders the Claude Code, Codex and Copilot rules, the helper rule is spelled through npm from the launchpad root, and removal deletes only the rules the write added. The gate records null, never an invented empty list, when no base checkout exists, and caps its list with a count. The validators read an absent and an empty disposable declaration the same, and the texts say the class and registration entries compose into one sorted set. Recorded, not fixed: the Claude Code and Copilot rule languages are prefix-only, so a prefix rule admits any later flag (the hook admission judges those flags; the literal fallback stays off until a qualification needs it); the hook trusts the ignored local target-worktree registry for where the worktree is, as the first admission trusts its local dispatch record; a stale tag on an ancestor of a sibling refresh commit is kept as that release's tag (D006).",
  "evidence": [
    "The adversary's report (probe copies under the host scratchpad, no repository change) and the improver's report, both received 2026-10-18 during this dispatch.",
    "scripts/test-harness.mjs WO-221 case: the origin mismatch, the foreign node, the base branch, the lease at verified, the wrong pull-request number, --base develop, a body outside the checkouts and the quoted deny spelling admit nothing.",
    "scripts/test-target-worktree.mjs WO-221 close case: a refused target close leaves the base checkout, its output and its branch where they were; the nested repository and the draft ref go at the publishing close; the lane root is empty afterwards.",
    "scripts/test-launchpad-update.mjs: the retry reports the sibling tag and Release current, and a tag on a commit main does not reach refuses by name."
  ],
  "rejected": [
    {
      "option": "Judge the target before any base mutation by moving the fetch too",
      "reason": "The fetch changes no ref the close judges; only the local base move and the base cleanup needed to follow the target's judgment."
    },
    {
      "option": "Emit per-order Codex rules into the tracked config.toml",
      "reason": "D002: the file would drift between checkouts and Codex reads no prefix rule from it."
    }
  ],
  "reopenWhen": "A host rule language gains argument-level matching, or the registry's trust is moved under a committed record."
}
```

## WO-221-D015 — The adversary worker's probe copy overwrote a repository test file; the committed bytes were written back

```json
{
  "id": "WO-221-D015",
  "date": "2026-10-18",
  "dispatch": "resume: next",
  "decision": "The criteria adversary reported running its probe from a copy under the host scratchpad with no repository file changed; the document gate's declarations task then named scripts/test-harness-probe.mjs as the harness-probe suite's import of the whole harness test, and git showed that file modified by 14,186 lines against HEAD. The executor wrote the committed bytes of that file back (git show HEAD:scripts/test-harness-probe.mjs), since no change of this order touches it, and reran the gate. The worker's findings stand on their own evidence; its claim of no repository change was wrong.",
  "evidence": [
    "git status and git diff --stat HEAD -- scripts/test-harness-probe.mjs during this dispatch: 14,186 insertions, 1,307 deletions, from the worker's run window.",
    "The declarations task's missing list named exactly the harness test's import closure under harness-probe."
  ],
  "rejected": [
    {
      "option": "Keep the worker's file and declare its imports",
      "reason": "The file was a probe copy, not a change of this order; declaring a test that imports the whole harness suite would widen the probe suite for nothing."
    }
  ],
  "reopenWhen": "A worker brief gains a host-level write refusal for read-only reviewers, so a copy cannot land in the repository."
}
```

## WO-221-D016 — A complete gate wrapped in the probe wrapper was ended at its deadline; the wrapper now applies no deadline of its own to a complete selection (operator scope expansion)

```json
{
  "id": "WO-221-D016",
  "date": "2026-10-18",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "The executor started this order's complete review run as `node scripts/harness.mjs bounded -- npm test -- --review`, reading the Preflight line's \"each under node scripts/harness.mjs bounded --\" as covering the complete run. The wrapper's default 900-second deadline (scripts/lib/bounded-command.mjs, timeoutMs 900_000) ended the gate by SIGTERM after 898.4 seconds: 88 suites had passed, three were interrupted mid-run and reported as failed, and the recorded row is a stopped row that supplies no pass. The run was relaunched directly in the background. The operator then expanded the order's scope, directing the fix now rather than in a later order, after the executor described the guard: the probe wrapper (scripts/lib/bounded-command.mjs completeTestSelection) now applies no deadline of its own to a complete test selection (`npm test` with no `--only`, `--document` or `--list`; `npm run test:full`; `node scripts/test-runner.mjs --review` or with no selection) and says so on its start line, so the runner's task deadlines alone bound the run; focused, document and listing selections keep the 900-second probe deadline. A refusal was the first form and was withdrawn in the same handoff: the launchpad export fixtures wrap an exported instance's own short complete run, which a refusal broke. The order's deliverables name the guard under this decision and the planning amendment binds the approved bytes.",
  "evidence": [
    "The stopped row host-gate:18342ec5665fe0bc6597896b911df53ea3c57a8c09ca5e09d2601f2f2ac7df1d:stopped:2026-10-18T21:03:40.767Z (898,230 ms) and the review log's lines: Gate stopped by SIGTERM after 898.4 s; Suite target-worktree stopped by gate request after 150432 ms; the same for launchpad-planning and evidence-sources.",
    "scripts/lib/bounded-command.mjs line 12: timeoutMs = 900_000.",
    "The operator's scope expansion during this dispatch, given after the executor described the refusal in scripts/harness.mjs and its cases; paraphrased, no capture.",
    "scripts/test-harness.mjs case: five complete spellings are recognized, six focused, document, listing and non-test commands are not, and `npm test -- --list` runs under the probe deadline."
  ],
  "rejected": [
    {
      "option": "Refuse a complete selection under the wrapper",
      "reason": "An exported instance's complete run is short and its fixtures wrap it on purpose; the harm was the deadline, not the spelling."
    },
    {
      "option": "Queue the guard for the next order",
      "reason": "The operator expanded this order's scope to land it now and accepted the complete run the code change costs."
    }
  ],
  "reopenWhen": "The runner gains a selection the wrapper should refuse or admit that this rule does not name."
}
```

## WO-221-D017 — Every phase reuses the passing complete review row at an unchanged code identity (operator scope expansion)

```json
{
  "id": "WO-221-D017",
  "date": "2026-10-18",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "The operator expanded the order's scope a second time, directing that any phase reuse a complete gate when the code has not changed and that a complete run be owed only when the code changed, an integration that moved main being such a change. The final-review claim check (scripts/lib/handoff-ledger.mjs requireFinalReviewGate) now accepts the newest passing complete review row at the integrated code identity, whichever role recorded it and whether or not the runner reused passing suites at that identity, and refuses only when that identity has none or a newer run there failed; the executor's and verifier's claims already accepted a passing complete row. The reviewer's role text, the shared completion sentence and product 07's three passages say the same, and they name the direct launch form for the complete run, never under the bounded probe wrapper. The WO-216 rule bound the final-review row to a time after the review's dispatch with no reused suites; under the operator's serial practice that forced a second complete run of the same bytes, and the identity already settles what a time guard was for.",
  "evidence": [
    "The operator's second scope expansion during this dispatch, paraphrased, no capture; it followed the executor's account of the two complete runs the WO-216 rule costs a serial order.",
    "docs/product/07-execution-guide.md §Preflight before the full gate and §Discipline, before and after this change; packages/skeleton/src/loadouts/contributor.ts sentences 104, 108, 175 and 615 by their former text.",
    "scripts/lib/handoff-ledger.mjs requireFinalReviewGate: the since argument is no longer read; the covering lookup still displaces an older pass by a newer failed run at the same identity."
  ],
  "rejected": [
    {
      "option": "Keep the dispatch-time binding and let the operator waive the second run case by case",
      "reason": "A waiver per order is the hand step the order set out to remove; the identity carries the guarantee the time guard stood for."
    }
  ],
  "reopenWhen": "A gate's result comes to depend on something the code identity does not cover, such as a host or dependency change the structural phase does not judge."
}
```

## WO-221-D018 — The complete run leads with changed and failed suites; the focused-before-complete refusal is removed (operator scope expansion)

```json
{
  "id": "WO-221-D018",
  "date": "2026-10-19",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "The operator expanded the order's scope a third time, directing that the double gate run at executor handoff be removed permanently and by the build rather than by a rule. The executor had added a refusal (preflightBeforeComplete in scripts/lib/handoff-ledger.mjs, called from scripts/test-runner.mjs) that made a complete run wait for a passing row of every Preflight suite. That refusal rested on an unchecked claim, written into its own comment, that a complete run reuses focused rows at the same identity and executes only the rest. The checked evidence refutes it: gate-reuse.mjs supplies a pass only from rows of the claim's own check, a row recorded under another check can displace a pass but never supply one, and the complete run started at 00:16:52 after fourteen passing focused rows re-executed harness-fixtures for 290 seconds. The refusal therefore made every order execute each suite twice: 40.7 minutes of focused runs, fifteen structural phases of about 27 seconds among them, followed by a complete run that took 35.9 minutes the last time it ran to its end. It is removed. In its place the complete run orders its queue so that a stale assertion fails within minutes: suites whose latest recorded execution did not pass lead (lastFailedSuites), then suites whose inputs changed after the newest gate row by file modification time (changedSinceLastGate; inputs are declared sources plus the suite's own script or package path, since product suites declare no sources), then suites this branch changed (changedMachinery), then exclusive suites and the rest by their declared priorities. The lead is added to each task's own priority, so release preparation still precedes its cases. The executor's and verifier's role text and product 07 now say that the executor starts one complete run and that a focused run reproduces one failure and never precedes the complete run. A fixture in scripts/test-verifier-gate-claims.mjs asserts that a complete run composes nothing from focused rows, so the claim this executor assumed is an executable statement rather than a comment.",
  "evidence": [
    "The operator's third scope expansion during this dispatch, paraphrased, no capture: the double run is unacceptable, a rule the executor does not follow is no fix, and the fix is to be permanent.",
    "docs/control/local/harness/checks.json rows of 2026-10-18: three complete runs recorded at 21:46:21 (1250 s), 22:15:32 (1498 s) and 23:05:43 (2153 s), each exit 1; the last failed at second 1932 on launchpad:file:test-launchpad-export.mjs, a suite whose sources the order had changed; its scheduler idle time was 328 ms of 2152 s, its three exclusive suites ran alone for 526 s, and its other work was about 5700 lane-seconds on four lanes.",
    "The focused sequence of 23:36:10 to 00:16:52, logged in the session scratch directory: fourteen --only rows and the document row passed in 40.7 minutes; the complete run started at 00:16:52 re-executed harness-fixtures, which had passed at 23:42:07, and was stopped at 00:31:02.",
    "scripts/lib/gate-reuse.mjs identityRows and latestExecution: rows of another check are other; an other row sets elsewhere and can only displace a pass.",
    "scripts/test-runner.test.mjs, three cases: inputs changed since the newest gate row; latest execution did not pass; a lead raises a suite's tasks while their order holds. scripts/test-verifier-gate-claims.mjs: coveringTaskResults for npm test composes nothing from the alpha and beta focused rows.",
    "Probe on this worktree after the edits: changedSinceLastGate named eleven suites for six edited files, skeleton and skeleton-docs among them through the package path; lastFailedSuites named none, the focused rows having superseded the earlier failures."
  ],
  "rejected": [
    {
      "option": "Keep the refusal and make a complete run compose from focused rows",
      "reason": "It changes the reuse semantics WO-213 failed three verifications on, and even then the forced sequence costs 40.7 minutes of serial focused runs against 35.9 for one complete run."
    },
    {
      "option": "Remove the refusal and leave the order of operations to role text",
      "reason": "The operator rejected a rule as the mechanism; this executor wrapped a complete run in the probe deadline against the rule earlier in this dispatch."
    },
    {
      "option": "Raise the four-lane cap or let light suites overlap the exclusive suites",
      "reason": "Each heavy suite's deadline was measured running alone, and a flaky deadline costs a full rerun; D019 carries the measurement to planning."
    }
  ],
  "reopenWhen": "A complete run fails after more than ten minutes on a suite the order changed, or the lead ordering lengthens a run by more than the exclusive convoy it displaces."
}
```

## WO-221-D019 — The gate's cost is measured; its capacity levers go to planning

```json
{
  "id": "WO-221-D019",
  "date": "2026-10-19",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "The complete run recorded at 23:05:43 on 2026-10-18 is the measurement for a gate-cost order: 27 s of structural phase and build; 526 s in which worktree-integration (155 s), harness-fixtures (275 s) and process-debt (95 s) ran alone on the four-lane scheduler; 514 s of mixed work bounded by target-worktree at 564 s; 866 s in which the four vertical files, each holding two lanes, ran two at a time (435, 282, 429 and 340 s); then launchpad's two files. About 5700 lane-seconds in all under a cap of four lanes, on a machine reporting sixteen logical processors and 48 GB of memory; the scheduler was idle for 328 ms. Three levers, in the order of their expected gain, are deferred to a planned order with a refuter rather than taken here: the four-lane cap (the lesser of four and half the parallelism, a shared host-lane contract with its own fixtures), overlap of light suites with the three exclusive suites, and the vertical suite's share. None is taken in this order because each heavy suite's deadline was measured alone and a flaky deadline costs a full rerun.",
  "evidence": [
    "The per-task timeline of the 23:05:43 row, read from docs/control/local/harness/checks.json with scripts/lib/gate-timeline.mjs gateCriticalPath: workMs 2152219, waitMs 328, durationMs 2152547.",
    "scripts/test-runner.mjs scheduleSuites: concurrency defaults to the lesser of four and half of availableParallelism and refuses more than four; scripts/lib/host-lanes.mjs acquireHostLanes refuses a capacity other than four.",
    "node -p availableParallelism() on this machine: 16; the bounded wrapper's start line: physicalBytes 51539607552."
  ],
  "rejected": [
    {
      "option": "Raise the cap in this order",
      "reason": "The host-lane contract and its fixtures, the per-suite deadlines measured alone and the memory budget per lane each need their own evidence; this order's subject is the target worktree."
    }
  ],
  "followup": "Plan a gate-cost order from the 2026-10-18 measurement: judge raising the host-lane capacity from four toward half the machine's parallelism with a memory budget per lane, letting light suites overlap the three exclusive suites after re-measuring their deadlines under load, and splitting or trimming the vertical suite's 1486 lane-seconds; accept only with before-and-after timelines from scripts/measure-gates.mjs.",
  "reopenWhen": "The planned order lands, or a run on other hardware supersedes the measurement."
}
```

## WO-221-D020 — Completion consumes validation and runs no gate; review rejects known-bad candidates first; a selection compiles once and a focused one judges only its build phase (operator recovery contract)

```json
{
  "id": "WO-221-D020",
  "date": "2026-10-19",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "The operator issued a recovery contract for the validation and completion loop, authorizing direct changes to the process requirements that cause it and to their generated instructions and tests, while preserving the order's work and criteria, functional assertions, hang protection, independent review and publication permissions. Four requirements replace the conflicting clauses. First, completion consumes validation and never executes it: scripts/lib/handoff-ledger.mjs requireGateClaims ran npm run test:docs inside every completion whose product claim a complete row covered, and whenever a criterion named the document gate; it now consumes the newest standing passing document row this worktree recorded at the current code identity for the working tree as it stands (the row's existing tree hash), so a document edited after its document run is refused by name, while the recording itself, which changes nothing the row judged, leaves it standing. The existing validity checks stay: matching code identity, required suite coverage, attested build output and no displacing failure; no new cache or dependency analysis is added. Second, the reviewer rejects a known-bad candidate before the expensive validation: each blocking claim of the verification sequence is reproduced with a focused selection or the bounded probe route, and a reproduced blocker goes straight to a truthful failing review and repair without a complete run; the complete run follows review and substantive fixes, when approval is otherwise possible. Third, ordinary testing is usable after an ordinary edit: a selection compiles a stale runtime with the build before capturing its subject (the compiled output lies outside the code identity), instead of refusing until npm run sync has run, while a stale installed harness is reported and never installed by a gate, and a focused selection's generated check judges only those two build-phase artifacts, since publication and bookkeeping artifacts are inputs of the complete and document selections rather than of one suite; the complete and document selections keep the full check. Fourth, writing finishes before documents are validated: each role writes its report after the complete run passes (a review gate admits no record writes while it runs, and a judgment is written with its evidence), runs npm run test:docs once after the last document edit, and records; the recording itself changes nothing the document row judged. The executor, verifier and reviewer steps, the shared completion sentence and product 07 say so, and the three tests that pinned the completion's own document run now pin the consuming behavior.",
  "evidence": [
    "The operator's recovery contract during this dispatch, paraphrased, no capture; it names scripts/lib/handoff-ledger.mjs and packages/skeleton/src/loadouts/contributor.ts and authorizes replacing conflicting process clauses with its own.",
    "scripts/lib/handoff-ledger.mjs before this change: the branch guarded by a document claim without focused rows spawned the runner with --document inside completion; scripts/test-verifier-gate-claims.mjs asserted two such runs and scripts/test-off-ramps.mjs stubbed the runner's --document output to drive refusals.",
    "The 23:05:43 complete run's timeline: the generated structural check took 14.46 s judging fourteen artifacts; scripts/structural-checks.mjs ran checkGenerated(root) for every selection, so a focused run failed on a stale publication or bookkeeping artifact unrelated to its suite, and on a stale runtime or harness the gate's own build would have refreshed.",
    "scripts/lib/generated-artifacts.mjs: the runtime artifact's writer is scripts/build.mjs and the harness artifact's writer is scripts/harness.mjs emit; packages/skeleton/src/gate-evidence.mjs excludes the installed harness surfaces from the code identity and the build output is ignored.",
    "This dispatch's own sequence: the operator-directed changes of D016 to D019 each cost a complete run, and the gate rows of 2026-10-18 show three failed complete runs, one stopped and one focused sequence of forty minutes before any of them."
  ],
  "rejected": [
    {
      "option": "Keep completion's own document run and only shorten it",
      "reason": "The contract names the hidden execution as the loop's cause; a gate the completion runs cannot be consumed, reused or stopped like a recorded row."
    },
    {
      "option": "Skip the generated check entirely in focused selections",
      "reason": "A stale runtime or installed harness is an input of the harness suites; the build-phase artifacts stay judged, and are regenerated first."
    },
    {
      "option": "Key the document row by a new document identity",
      "reason": "A second identity system; the row's existing tree hash already says which tree it judged, and the contract keeps the existing validity checks and forbids another cache."
    }
  ],
  "reopenWhen": "A completion is recorded against a document row that predates a substantive document edit at the same code identity, or a focused selection passes while a build-phase artifact it depends on is stale."
}
```

## WO-221-D021 — Second self-review pass over the gate-process changes: eleven findings, ten fixed, one recorded

```json
{
  "id": "WO-221-D021",
  "date": "2026-10-19",
  "dispatch": "resume: next; operator scope expansion",
  "decision": "A fresh read-only adversary reviewed the D016 to D020 changes against the operator's recovery contract and WO-213's failed verifications and found eleven items; ten are fixed in this dispatch and one is recorded. Blocking, fixed: the final-review consumer matched expanded task names (release:, launchpad:file:, vertical:file:) by exact suite name and would have refused every real complete row, so it now matches a suite's tasks by name or name prefix and requires every one of them to have passed, with an expanded suite in the fixture; the document-row consumer read the plain newest row and could fall back to main's, so completion now takes the newest standing passing document row this worktree recorded whose tree hash is the working tree's, through the shared displacing lookup, and final-review-result consumes it too; the focused selection's --build-phase-only flag was applied before the structural rows existed and never took effect, so it is applied after they are assembled and the focused run's structural companion row is marked partial, never standing in for a complete or document selection's structural pass. Should-fix, fixed: a gate compiles only the stale runtime, before the reuse lookup, and never installs the harness (live hooks change only through npm run sync); the probe wrapper keeps its 900-second deadline for machinery and confined-partial selections and gives a complete selection a six-hour outer bound rather than none, a correction of D016's wording; an exclusive suite at the head of the queue waits for the lanes to drain instead of being passed by lower rows; the executor and reviewer write their reports after the complete run passes, so a judgment is written with its evidence; product 07's Discipline and write-once passages and the Preflight spelling follow the code. Notes, fixed: stale inline-run wording in resume.mjs, lifecycle-evidence.mjs and generated-artifacts.mjs, a dangling runner comment, the inaccurate 'code identity of the document machinery' phrase; the absent-runner path refuses again when documents changed without a claim; the change-since mark ignores document runs and the scheduled-first line names only selected suites. Recorded: D017 lets final review run nothing of its own at an unchanged identity, which its reviewer reads in the role text. The adversary could not run code; the resume, runner and harness-wrapper cases exercise the fixes, and the complete run judges the rest. The complete runs that followed surfaced four more items within minutes each, fixed the same way: the focused flag reached a fixture's stub generated row, so it now applies only when the real structural check is the row; the new runner test spawned Git directly against the helper-reuse rule; the reviewer's awaited-command sentence that a briefing case matches was restored; and the skeleton test that pinned the old step order (document run right after formatting, no complete run for the executor) now pins the new one.",
  "evidence": [
    "The adversary's report in this session, read-only, 91 tool uses; its first three findings reproduced by reading scripts/lib/handoff-ledger.mjs executedPass against expandSuiteTasks's task names, gateCandidates against coveringGateCheck and identityRows' main fallback, and the --only mapping's position before the structural assembly.",
    "scripts/test-verifier-gate-claims.mjs: the review rows now carry gamma as two prefixed tasks and a document row recorded after the FINAL report; scripts/test-off-ramps.mjs and scripts/test-runner.test.mjs pin the document-row refusal and consumption; scripts/test-harness.mjs pins the wrapper's selections.",
    "docs/verifications/WO-213/VER-004.md V4-F1 and VER-006.md V6-F2: a recorded failure must not be masked by an older claim, and coordination records must not invalidate unchanged product evidence; the tree-hash rule and the displacing lookup hold both for the document row."
  ],
  "rejected": [
    {
      "option": "Delete executedPass and rely on the standing-row lookup alone",
      "reason": "D017 records the executed-task check; matching the expanded names keeps it and is one line."
    },
    {
      "option": "Keep installing the harness inside a gate",
      "reason": "It rewrites the live hooks and settings from a test run without the explicit step the operator reads; the contract names the runner's build, not the installed harness."
    }
  ],
  "reopenWhen": "A completion is recorded against a document row whose tree hash is not the working tree's, or a complete row is refused at final review for a suite whose tasks all passed."
}
```

## WO-221-D022 — VER-001: judge every base untracked path before close

```json
{
  "id": "WO-221-D022",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 V1-F1 fails criterion 6. A base checkout whose already-committed .gitignore ignores .env is allowed to close with that undeclared .env still present: the close moves the base, removes the target and creates the fixture Release. The verifier preserves the implementation and records the defect for repair.",
  "evidence": [
    "docs/verifications/WO-221/VER-001.md V1-F1; docs/evidence/WO-221/verification-001/README.md.",
    "The close-preignored-env probe exits 1 because close exits 0; envRetained, targetRemoved and baseMoved are all true.",
    "scripts/lib/target-worktree-close.mjs:358-373 filters candidates through ls-files --others --exclude-standard before applying fetched-tree ignore rules."
  ],
  "rejected": [
    {
      "option": "Keep the scan restricted to currently visible untracked files",
      "reason": "It excludes already-ignored operator material before the fetched-tree judgment can see it."
    }
  ],
  "followup": "WO-221 repair V1-F1: include already-ignored and newly-ignored base files in the fetched-tree judgment; refuse undeclared .env before base mutation, target removal or publication, and retain declared disposable deletion. Add the preignored-base case.",
  "reopenWhen": "The bounded preignored-base case refuses without changing the base or publishing, and the existing disposable-close cases still pass."
}
```

## WO-221-D023 — VER-001: bind a target release retry to its recorded commit

```json
{
  "id": "WO-221-D023",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 V1-F2 fails criterion 9. After the tag push succeeds but Release creation fails, moving the remote tag to another commit and retrying is accepted as current tag state; the retry creates a Release and finishes cleanup. The earlier attempt must bind both tag name and commit.",
  "evidence": [
    "docs/verifications/WO-221/VER-001.md V1-F2; docs/evidence/WO-221/verification-001/README.md.",
    "The close-moved-release-tag probe observes firstExit 1, retryExit 0, tagStillExpected false and releaseCreated true.",
    "scripts/release.mjs:2534-2553 adopts existing as tagged whenever earlier.tag exists, so the following comparison cannot reject a moved existing tag."
  ],
  "rejected": [
    {
      "option": "Accept the remote tag target as the retry subject",
      "reason": "It turns an external ref change into publication of an unreviewed commit under the order's release name."
    }
  ],
  "followup": "WO-221 repair V1-F2: bind retry publication to the earlier recorded target commit and refuse a differing remote tag before Release creation or cleanup. Preserve equal-tag retries and legitimate base advancement.",
  "reopenWhen": "The moved-tag retry refuses and leaves publication and cleanup pending, while an unchanged tag resumes the same release."
}
```

## WO-221-D024 — VER-001: the literal fallback does not satisfy the settings-marker clause

```json
{
  "id": "WO-221-D024",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 V1-F3 judges criterion 2 unmet as written. D003 deliberately substitutes an ignored ownership sidecar for markers in .claude/settings.local.json. The sidecar provides ownership bookkeeping, but no captured operator waiver or amendment changes the original requirement. This is an acceptance mismatch, not a claim that JSON comments should be emitted.",
  "evidence": [
    "docs/verifications/WO-221/VER-001.md V1-F3; WO-221 criterion 2; WO-221-D003.",
    "The fallback-original probe passes write/remove behavior; fallback-markers observes no markers in Claude settings and markers in the Codex rules file.",
    "Canonical status at verification has no waived criteria."
  ],
  "rejected": [
    {
      "option": "Count the sidecar as satisfying the unchanged in-file-marker wording",
      "reason": "That silently rewrites an acceptance criterion during verification."
    }
  ],
  "followup": "WO-221 repair V1-F3: resolve the settings-marker requirement through a supported implementation or an operator-authorized amendment or waiver that explicitly accepts the sidecar. Keep ownership and removal checks.",
  "reopenWhen": "A checked implementation satisfies the original clause, or captured operator authority changes or waives that clause."
}
```

## WO-221-D025 — VER-001: retain criterion 3 as unmet without inventing a Codex configuration

```json
{
  "id": "WO-221-D025",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 V1-F4 confirms D010: the emitted .codex/config.toml has no generated per-repository prefix rules. The implementation instead writes per-order .rules files only under hostRules literal. Verification judges the original clause unmet and does not change host settings or infer an operator waiver.",
  "evidence": [
    "docs/verifications/WO-221/VER-001.md V1-F4; WO-221 criterion 3; WO-221-D002 and WO-221-D010.",
    ".codex/config.toml contains one project-layer comment; scripts/lib/target-worktrees.mjs emits prefix_rule into per-order .rules files.",
    "The fallback fixture asserts the target launch lines; those lines do not satisfy the missing config.toml clause."
  ],
  "rejected": [
    {
      "option": "Declare the alternative file location and opt-in scope equivalent in the verdict",
      "reason": "The original criterion specifies both a different artifact and per-registration scope."
    }
  ],
  "followup": "WO-221 repair V1-F4: resolve criterion 3 through documented supported behavior and an operator-authorized amendment or waiver if retaining per-order .rules output; do not manufacture an unsupported config.toml format to turn verification green.",
  "reopenWhen": "A checked implementation satisfies the original criterion, or captured operator authority records the intended supported artifact and scope."
}
```

## WO-221-D026 — VER-001 follow-up: host-rule rewrite bypasses the registration opt-in

```json
{
  "id": "WO-221-D026",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 V1-N1 is a nonblocking follow-up: worktree start writes no rules without hostRules, but worktree host-rules --rewrite writes both Claude and Codex rules for that same registered order despite the absent opt-in. Criterion 2 names start and close, so this separate maintenance path is not an additional blocking claim.",
  "evidence": [
    "docs/verifications/WO-221/VER-001.md V1-N1; docs/evidence/WO-221/verification-001/README.md.",
    "fallback-optout-rewrite confirms no settings at start, then rewrite exits 0 and creates both settings and rules.",
    "scripts/worktree.mjs host-rules rewrite branch calls writeOrderHostRules after resolving the entry and origin, without checking hostRules literal."
  ],
  "rejected": [
    {
      "option": "Treat an explicit rewrite command as evidence that committed registration opted in",
      "reason": "The command can be reached as a drift remedy and creates permissions absent from the declared opt-in."
    }
  ],
  "followup": "Host-rule rewrite follow-up V1-N1: require the committed registration opt-in and the same registration and origin boundary as start before creating rules; refuse an opted-out registration and preserve removal as a recovery route.",
  "reopenWhen": "A focused rewrite probe refuses an opted-out registration without creating settings, while a genuine opted-in rewrite still repairs its owned rules."
}
```

## WO-221-D027 — VER-001 follow-up: distinguish a prior starter refresh tag from an arbitrary ancestor

```json
{
  "id": "WO-221-D027",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 V1-N2 retains the first adversary's ancestor-tag concern as a nonblocking follow-up. The current starter-refresh guard permits any existing tag target that is an ancestor of the refresh commit. That is broader than preserving the first refresh of the same release. Criterion 10's fresh-publication, retry and preview fixtures pass; this report does not claim an independently executed ancestor-conflict reproduction.",
  "evidence": [
    "docs/verifications/WO-221/VER-001.md V1-N2; the first adversary report and WO-221-D014.",
    "scripts/lib/starter-refresh.mjs:96-109 accepts an existing unequal commit when ancestor(checkout, existing, commit) is true.",
    "WO-221 Design D says a sibling tag at another commit refuses; D014 records the ancestor exception."
  ],
  "rejected": [
    {
      "option": "Use ancestry alone as proof of a prior refresh for this core release",
      "reason": "An arbitrary old ancestor also satisfies that test and need not contain the released refresh."
    }
  ],
  "followup": "Starter-tag follow-up V1-N2: bind a retained ancestor tag to the recorded first refresh of the same core release; add a fixture with a pre-existing arbitrary ancestor tag and require refusal without weakening seed-only refresh retries.",
  "reopenWhen": "The ancestor case is distinguished by release provenance or the operator explicitly chooses and documents the broader ancestor rule."
}
```

## WO-221-D029 — The approved Codex artifact replaces the original config-table clause

```json
{
  "id": "WO-221-D029",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Use the per-order Starlark rules file under the committed hostRules literal opt-in, removed at close, as criterion 3 now requires under the operator approval in D028. Preserve the printed target launch lines and the absence of launchpad-order lines. No user or active host setting was changed in this repair.",
  "evidence": [
    "WO-221-D028 and the recorded PlanExecutionAmended event of this repair.",
    "scripts/lib/target-worktrees.mjs codexRulesText; the existing target-worktree fallback fixture."
  ],
  "rejected": [
    {
      "option": "Emit a per-repository config.toml prefix rule",
      "reason": "The fetched official documentation establishes .rules files; the committed registration lacks the machine-local order path."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D025",
    "observation": "The operator approved the exact artifact and scope correction, replacing the previously unmet config.toml clause."
  },
  "reopenWhen": "Codex documents another supported rule surface or the per-order fixture fails."
}
```

## WO-221-D030 — Close judges all base untracked files against the fetched tree

```json
{
  "id": "WO-221-D030",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Collect every untracked base path without applying local ignore rules, then use that same candidate list for both the fetched-tree ignore judgment and the ordinary clean-checkout refusal. Retain undeclared material before any base move, target removal or publication. Declared ignored output is still deleted.",
  "evidence": [
    "VER-001 V1-F1 and D022; scripts/lib/target-worktree-close.mjs closeClean and base candidate scan.",
    "The bounded close-preignored-env probe passed on 2026-10-19 at 07:07:05Z: close refused, envRetained true, targetRemoved false, baseMoved false. The expanded fixture also covered newly ignored new.env and retained-cache/note.txt no longer ignored by the fetched tree."
  ],
  "rejected": [
    {
      "option": "Broaden only the ignored-material scan",
      "reason": "A file the fetched tree stops ignoring would still be hidden from the ordinary clean check."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D022",
    "observation": "The repair removes the current-ignore filter from both base judgments and adds the opposite ignore-rule change, which the report did not quote."
  },
  "reopenWhen": "Any preignored or newly unignored base file escapes refusal, or declared disposable cleanup regresses."
}
```

## WO-221-D031 — A target release retry keeps the recorded tag commit

```json
{
  "id": "WO-221-D031",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Bind both the tag name and expected commit to the earlier successful tag-publication attempt. Refuse a differing remote target before Release creation and launchpad cleanup. If the tag disappeared, recreate it from the recorded commit, never the later base. A missing or malformed recorded commit refuses.",
  "evidence": [
    "VER-001 V1-F2 and D023; scripts/release.mjs publishTargetRelease.",
    "The expanded close fixture, run by the passing bounded close-preignored-env probe at 07:07:05Z, simulates a failed Release creation, rejects a moved tag without creating a Release, then advances the base and removes the tag; recovery publishes the original commit and an unchanged-tag retry reports current.",
    "One preparatory probe failed in the new fixture fetch. Separating the object fetch (--no-tags --refmap=) from the tracking-ref update made the same expanded probe pass; this was fixture setup, not evidence of a remaining product failure."
  ],
  "rejected": [
    {
      "option": "Use the remote tag target or current base as the retry subject",
      "reason": "Either adopts a different commit under the order release name."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D023",
    "observation": "The expected commit now comes from the earlier receipt; moved-tag and base-advanced missing-tag cases exercise the repaired class."
  },
  "reopenWhen": "A retry changes the recorded subject or cannot recover an unchanged tag."
}
```

## WO-221-D032 — Host-rule rewrite validates before touching existing rules

```json
{
  "id": "WO-221-D032",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Require main configuration bytes to match their committed regular file, the registration to retain hostRules literal, and the recorded target to match the current clone, worktree plan and checked-out branch. Resolve its GitHub origin before removing old rules. Leave explicit removal available after opt-out. The operator included this adjacent repair; adjacent-0001 records the announcement and check-in.",
  "evidence": [
    "VER-001 V1-N1 and D026; operator response Include both repairs; scripts/worktree.mjs host-rules branch.",
    "The saved bounded fallback-optout-rewrite probe passed at 07:10:50Z: exit 1 with no Claude or Codex rule file created.",
    "Added regression coverage for uncommitted opt-in, valid rewrite, hand-edited rules, changed target branch, opt-out, removal and preservation of pre-existing operator rules; the complete gate judges those cases."
  ],
  "rejected": [
    {
      "option": "Trust the rewrite command itself as the opt-in",
      "reason": "It is also printed as a maintenance remedy and cannot grant permissions absent from the registration."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D026",
    "observation": "The rewrite now validates committed opt-in and target binding before removing or writing rules."
  },
  "reopenWhen": "A rewrite creates rules without the committed opt-in, changes rules before refusal, or removal deletes operator-owned rules."
}
```

## WO-221-D033 — A retained starter tag must carry the same release provenance

```json
{
  "id": "WO-221-D033",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Retain an unequal ancestor tag only when its committed regular KIT-MANIFEST.json names the exact core commit and release tag being refreshed. This preserves seed-only refreshes while rejecting arbitrary old ancestors and previous releases. The operator included this adjacent repair in adjacent-0001.",
  "evidence": [
    "VER-001 V1-N2 and D027; scripts/lib/starter-refresh.mjs priorReleaseRefresh and ensureSiblingRelease.",
    "Added cases in scripts/test-launchpad-update.mjs for an initial ancestor without a manifest and an ancestor from the previous core release, asserting no ref or Release mutation. Existing seed-only and unchanged-release cases remain; the complete gate judges them."
  ],
  "rejected": [
    {
      "option": "Accept any ancestor or reject every unequal ancestor",
      "reason": "The first accepts unrelated tags; the second breaks the supported seed-only refresh of an already tagged release."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D027",
    "observation": "Ancestry is no longer sufficient; the committed manifest must bind the tag to the same core release."
  },
  "reopenWhen": "An unrelated ancestor is accepted, or a proven same-release seed-only refresh stops working."
}
```

## WO-221-D034 — Correct the handoff's live-host and criterion 4 claims

```json
{
  "id": "WO-221-D034",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "The earlier executor handoff incorrectly asserted operation under every host's default restrictive mode without an operator step, although no live episode had run. It also marked criterion 4 unmet despite that criterion's express blocked-row fallback. Replace the unsupported live claim with the observed fixture behavior and judge criterion 4 met solely through the three blocked rows and launch commands. This does not qualify any live host. The repaired handoff also uses the current Codex actor readback and the operator-approved criteria 2 and 3.",
  "evidence": [
    "VER-001 criterion 4 explicitly corrects the earlier unmet judgment; WO-221 criterion 4's final sentence permits a blocked row naming the launch command when the operator has not run the episode.",
    "docs/evidence/WO-221/host-qualification.md still records all three episodes blocked and unrun; the repair launched no live host episode.",
    "The complete review run passed at 2026-10-19T07:55:04.693Z: 40 suites, 99 fresh tasks, zero failures, 2238.277 seconds, code identity 104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b. Its target-worktree and launchpad update fixtures cover the repairs in D030 through D033."
  ],
  "rejected": [
    {
      "option": "Keep the earlier live-host claim or its unmet criterion 4 judgment",
      "reason": "The first exceeds the executable evidence; the second contradicts the criterion's literal fallback."
    },
    {
      "option": "Treat synthetic admission or literal-rule output as a live qualification",
      "reason": "Fixture behavior does not observe a host's default classifier or approval behavior."
    }
  ],
  "reopenWhen": "The operator runs a host episode, or the qualification requirement changes through explicit authority."
}
```

## WO-221-D035 — VER-002 follow-up: a literal-fallback order leaves main unclean for the next start

```json
{
  "id": "WO-221-D035",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-002 F1 is a nonblocking follow-up. Under hostRules literal, worktree start writes .codex/rules/dotln-WO-NNN.rules into the main checkout, and neither core's .gitignore nor the kit's gitignore.template ignores that path. Main therefore shows the file as untracked, and the next worktree start of any order refuses with 'working tree is not clean' until the literal-fallback order closes. Release close tolerates untracked files, and criteria 2 and 3 judge the order's own start and close, which pass. The defect is reachable only under the new opt-in, so it breaks no criterion and no behavior main had. The verifier records it and changes no implementation.",
  "evidence": [
    "docs/verifications/WO-221/VER-002.md F1; docs/evidence/WO-221/verification-002/README.md.",
    "probes.mjs literal-dirty-main: main status is '?? .codex/rules/dotln-WO-999.rules' and a second worktree start exits 1 naming that path. control-dirty-main (no opt-in): main is clean and the second start exits 0. literal-ignored-rules-main: with /.codex/rules/dotln-WO-*.rules ignored, main stays clean, the rules file remains and the second start exits 0.",
    "scripts/worktree.mjs start calls ensureClean(mainPath), which runs git status --porcelain --untracked-files=all; scripts/lib/target-worktrees.mjs codexRulesPath writes under main's .codex/rules; scripts/kit/gitignore.template and .gitignore ignore /.claude/settings.local.json and /docs/control/local/ but no .codex/rules path."
  ],
  "rejected": [
    {
      "option": "Fail criterion 2 or 3 on this observation",
      "reason": "The order's own start and close clauses hold; a second concurrent start is outside both criteria, and main had no literal opt-in."
    },
    {
      "option": "Leave the observation only in the report",
      "reason": "A reproduced defect that is not fixed needs a named follow-up in the order's decisions."
    }
  ],
  "followup": "Literal-fallback follow-up VER-002 F1: a per-order Codex rules file must not make main unclean for worktree start. Ignore or excuse only DotLn-owned per-order rules files, for example through a machine-local exclude written with the sidecar or a cleanliness check that excuses files a registered sidecar owns, without requiring a hand edit of an instance's seeded .gitignore. Add a fixture that starts a second order while a literal-fallback order is in flight.",
  "reopenWhen": "A fixture starts a second order while a literal-fallback target order is in flight and main stays clean, or the literal fallback is retired."
}
```

## WO-221-D036 — VER-002 follow-up: a malformed operator settings file strands start and close after their irreversible steps

```json
{
  "id": "WO-221-D036",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-002 F2 is a nonblocking follow-up. The literal-rule writer and remover parse the operator's .claude/settings.local.json only after irreversible lifecycle steps. With a malformed file, release close reports a bare JSON parse error after it has removed the target worktree, deleted the order branch and forgotten the registry entry. After the file is repaired, the retry refuses with 'target worktree registry entry is missing', so the close cannot finish, and the order's rules, Codex rules file and sidecar outlive it. worktree start with a malformed file fails after the worktrees and registry entry exist. Its printed retry then refuses with 'target already exists', although host-rules --rewrite recovers. Criterion 2's removal and preservation clauses hold for a well-formed file. Main never read this file, and the path needs the new opt-in, so the defect breaks no criterion and no behavior main had.",
  "evidence": [
    "docs/verifications/WO-221/VER-002.md F2; docs/evidence/WO-221/verification-002/README.md.",
    "probes.mjs literal-malformed-settings-close: the first close exits 1 with the parse error after the target worktree, registry entry and order branch are gone, while the rules file and sidecar remain; the retry after repair exits 1 with 'target worktree registry entry is missing'. literal-malformed-settings-start: start exits 1 with the parse error after the target worktree, clone branch and registry entry exist; the printed retry exits 1 with 'repository target: target already exists'; host-rules --rewrite exits 0.",
    "scripts/lib/target-worktree-close.mjs calls removeOrderHostRules after forgetTargetWorktree and before row.outcome becomes removed; at base 8bbdcbff, forgetTargetWorktree was followed directly by row.outcome = removed. scripts/worktree.mjs hostLaunchLines writes the rules after forgetTargetStart."
  ],
  "rejected": [
    {
      "option": "Fail criterion 2 on a malformed operator file",
      "reason": "The criterion's removal and preservation clauses presume parseable settings and hold for them; refusing corrupt input is correct, and the unrecoverable retry is a sequencing defect outside the clause."
    },
    {
      "option": "Leave the observation only in the report",
      "reason": "A reproduced defect that is not fixed needs a named follow-up in the order's decisions."
    }
  ],
  "followup": "Literal-fallback follow-up VER-002 F2: validate .claude/settings.local.json and the order's sidecar before the first irreversible step of worktree start and release close, name the file and the remedy in the refusal, and make the close's host-rule removal resumable after the registry entry is forgotten. Add malformed and non-regular settings fixtures for start and close.",
  "reopenWhen": "Fixtures show a malformed or non-regular settings file refusing before any irreversible start or close step with a named remedy, and the same command finishing once the file is repaired."
}
```

## WO-221-D037 — Final review: integration took in nothing; every acceptance claim carried forward to FINAL-001

<!-- integration refs/dotln/checkpoint/WO-221/10 -->

```json
{
  "id": "WO-221-D037",
  "date": "2026-10-19",
  "dispatch": "resume: final review; worktree integrate WO-221",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all 8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb, the merge base is that commit and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-221/10, f06f418036a6c3940a474b0cc2fe0bf05191b8b4), retained its named stash 7ab8943c2c91ea1f2aa86d01b58f16be36dedcf4, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR meter block), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: git ls-files --others --ignored --exclude-standard under docs/intake lists no file, the three intake directories are empty, and the helper's intake check requires an archive only when an ignored intake file exists. Every acceptance claim is carried forward unchanged to FINAL-001: VER-002's twelve criterion judgments at code identity 104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b, the identity its VerificationCompleted event of 2026-10-19T08:35:58.528Z records with the complete review row of 07:55:04.693Z (host-gate:104d1bf2…:npm test, 40 suites, 99 fresh tasks, zero failures, 2238.277 s) and the document row of 08:35:13.026Z; the repair's RepairCompleted event of 08:02:23.894Z at the same identity with its document row of 08:02:04.415Z; VER-001's F1 and F2 as repaired (D030, D031) and reproduced by VER-002 and by this review's reruns of the saved probes, F3 and F4 as resolved by the operator-approved amendment (D028, D029), N1 and N2 as repaired (D032, D033); VER-002's F1 and F2 as boarded (D035, D036); the scope expansions D016 and D017 and the acceptance corrections D028 as bound in the planning log by the PlanExecutionAmended events of 2026-10-18T21:14:15.485Z, 21:15:55.969Z, 23:09:09.195Z and 2026-10-19T07:08:49.998Z against receipt 047, the last recomputed from the current order bytes under the amendment's normalization as 40,538 characters and sha256:02c3c96eeb6ba3714d99ef644847e813ace7bdf5f310e58544c148abd37bbe2e; the executor's self-review at implementation (adversary thirteen and improver thirteen, all but three fixed, D014; the second pass over the gate-process changes, eleven found and ten fixed, D021) and the repair's separate pass as handoff.md records. Before integration the tree differed from the dispatch checkpoint 9 only in docs/control/current.md, docs/control/orders/WO-221.jsonl and docs/work-orders/README.md, none code, so VER-002's identity is the pre-integration identity; the saved gate audit found the complete review row at 104d1bf2… before integration (08:42:26Z) and after it (08:53Z and 09:03:04Z). Against checkpoint 10 the tracked tree differs in docs/lineage/decisions-index.md (this record's row); the other paths git diff lists against that snapshot are the untracked files the snapshot holds and the index does not. Release preparation keeps application v0.85.0 under the order's minor classification: local tags end at v0.84.0, and check-surfaces --local passes 57 checks with the release block v0.85.0, @dotln/skeleton the only component whose source changed (0.60.0 to 0.61.0, the console pin and lockfile following; harness host 0.36.0 to 0.37.0) and no bump required for the other five; no dependency is added and no version collides with main or a sibling. Authority edition WO-221/011, artifact-identity WO-213/003, verification WO-213/003 and feedback WO-216/001 stay selected; the authority and feedback checks pass and every generated surface is current after integration, so integration owes no re-mint and no live episode. The product gate criterion 12 requires is the standing complete review row at the integrated identity, reused under D017; no second run of the same bytes is owed, and FINAL-001 records it.",
  "evidence": [
    "refs/dotln/checkpoint/WO-221/10 (f06f418036a6c3940a474b0cc2fe0bf05191b8b4); docs/control/local/integration.json: preservationCommit f06f4180…, mergeCommit null; the helper printed Bases 8bbdcbff -> 8bbdcbff, Authored conflicts: none, and the regenerated list above",
    "git log --oneline main..HEAD empty; git merge-base HEAD main 8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb; git diff --stat refs/dotln/checkpoint/WO-221/9 refs/dotln/checkpoint/WO-221/10 lists docs/control/current.md, docs/control/orders/WO-221.jsonl and docs/work-orders/README.md only",
    "release preparation: WO-221 target v0.85.0 remains current. Files changed: docs/evidence/WO-221/meta.json, docs/final-reviews/WO-221/PR.md. Meter snapshot: docs/evidence/WO-221/meta.json, 4558 bytes. Tag observation: local snapshot only.",
    "Affected checks after integration, 2026-10-19T08:53Z to 08:54Z, each exit 0: npm run publication:check (255/255 product headings indexed; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces; local-terms list present; no stale host rule), npm run release -- check-surfaces --local (57 PASS: release block v0.85.0 against latest local tag v0.84.0; skeleton src changed, observed 0.61.0 against 0.60.0; the other five components unchanged; workspace pins exact; license surfaces pass), npm run meta -- --check (the standing WO-150-D003 reopen candidate only). node scripts/authority-evidence.mjs --check and node scripts/feedback-evidence.mjs --check passed at 08:48Z (the retained WO-216 live audit's judged behavior unchanged).",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/gate-audit.mjs: codeIdentity 104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b, location worktree, row host-gate:104d1bf2…:npm test recorded 2026-10-19T07:55:04.693Z, exit 0, review, 40 suites, 99 fresh tasks, no failed task; run at 08:42:26Z before integration and at 08:53Z and 09:03:04Z after it",
    "VER-001 and VER-002 SHA-256 equal the reportHash their completion events recorded (sha256:9e2fd7de639203efceda120e50efd30ee6ae8f1d8ea985cd59d6b1c86169eb97, sha256:cea41747a0ef38740ef11bb1c939ccac00f602f1d86f25a377943380bff127d9); the order's working bytes normalized as scripts/lib/plan-continuation.mjs executionAmendmentSource does hash to the D028 amendment's recorded orderHash over its recorded orderLength",
    "git ls-files --others --ignored --exclude-standard -- docs/intake/ prints nothing; docs/intake holds the empty directories chats, images and notes"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR meter block and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "D017: the identity, not the dispatch time, says what was tested; the standing row covers every required suite with executed passing tasks, and a second run of the same bytes adds no coverage for 37 minutes of gate time."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-19. Original base: `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`.
Fetched main: `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`. Checkpoint: `refs/dotln/checkpoint/WO-221/10` (`f06f418036a6c3940a474b0cc2fe0bf05191b8b4`).
Named stash retained: `7ab8943c2c91ea1f2aa86d01b58f16be36dedcf4` (WO-221 integrate 2026-10-19).
Intake backup: none named; `docs/intake` holds three empty directories and no ignored file, so the helper's intake check required no archive.
Resolved projections: none.
Release preparation: WO-221 target v0.85.0 remains current. Files changed: docs/evidence/WO-221/meta.json, docs/final-reviews/WO-221/PR.md. Meter snapshot: docs/evidence/WO-221/meta.json, 4558 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's twelve criterion judgments and the repair's completion at code identity `104d1bf2…`, which the integrated tree keeps; VER-001's F1 and F2 as repaired (D030, D031), F3 and F4 as resolved by the operator-approved amendment (D028, D029), N1 and N2 as repaired (D032, D033); VER-002's F1 and F2 as boarded (D035, D036); D016, D017 and D028 as bound in the planning log against receipt 047; the executor's self-review and the repair's separate pass as recorded. No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the complete run pass on the integrated tree at 08:53 UTC (evidence above); the complete run is the standing complete review row at the integrated identity, reused under D017 and recorded in FINAL-001.

## WO-221-D038 — Final review: fail FINAL-001 at the integrated subject; the base ignore judgment dies on a populated ignored tree, and nineteen follow-ups are boarded

```json
{
  "id": "WO-221-D038",
  "date": "2026-10-19",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 fails WO-221 at the integrated subject, code identity 104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b, which integration left unchanged (D037). One finding blocks: the close's new base ignore judgment (scripts/lib/target-worktree-close.mjs ignoredByTree) runs git check-ignore --no-index --stdin through spawnSync with no maxBuffer, so Node's 1 MiB default applies to its output, while the candidate list it judges now comes from ls-files --others without --exclude-standard and is capped at 16 MiB; once the clone's base checkout holds a populated ignored tree, every installed node_modules among them, the child is killed, the judgment throws, and release close --publish refuses with 'target clone base main cannot close: base ignore judgment unavailable; source retained. Fix what Git reports', whether or not the tree is declared disposable. The reviewer's probe (docs/evidence/WO-221/final-review-001/probes.mjs base-large-ignored-tree, 09:22:49Z, 13.6 s) writes 20,000 files, 1,340,000 bytes of paths, under a base node_modules the fetched tree ignores and the class declares disposable: the close exits 1 with that message, the tree remains, the base does not move and the target worktree remains. Design C and criterion 6 say that close completes and deletes the tree, and main's closeClean listed the base with --exclude-standard, so main's close completed this state without touching it; the change therefore breaks behavior main had and a probe shows it, criterion 6 is unmet for a declared tree of realistic size, and no registration restores the completing close. The repair rule: give the judgment's spawn the 16 MiB buffer the candidate list has, or stream the judgment in batches; add a fixture whose ignored base tree exceeds one mebibyte of paths, declared and undeclared; keep a judgment failure's refusal naming what failed and the remedy. All twelve criteria other than 6 hold, criteria 2 and 3 on the operator-amended text (D028); the standing complete review row of 07:55:04.693Z at the integrated identity and the saved probes rerun at this subject are the evidence, and no complete run was started for a failing review. The review also boards nineteen follow-ups, each a defect in the declared surfaces that breaks no criterion and no behavior main had, found by this reviewer's reading and probe or by one of two independent read-only dotln-worker reviewers and checked at the named lines: in the registered-target admission, an entry that records no origin (written before this kit, or one whose clone URL the forge parser rejects while the hook's identity parser accepts) is admitted against any GitHub origin; the helper spelling is bound to main's scripts/ alone while its import closure under packages/skeleton/src, npm's pre- and post-scripts and script-shell lie outside the binding; the raw grant row is judged and not the registered authority profile's expiry, denied effects and revocation that the publish helper judges; and an admitted raw push or gh runs under the target clone's own configuration (URL rewriting, push refspecs, hooks path, ssh command), which the kit's lane neutralizes. In the target release: a tag already on the merged tip is adopted as this close's tag and a dry run's outcome counts as an earlier attempt, so two orders of one registration merged before either closes leave the second unable to close, and the release's preconditions run after the irreversible target cleanup; a push that updates the remote tag but exits non-zero records no binding, so a retry after the shared base advanced can mint a second tag; and the forge comes from the clone's current push URL after the registry entry with its recorded origin is forgotten. In the draft route: a retry after a failure that follows the push cannot succeed, because each run mints a new commit object and the record is appended only after gh succeeds; and the hook's --body-file containment is lexical and, with the draft helper, admits ignored files including intake. In the close: the scratch judgment applies the operator's global excludes file and init template, not the fetched tree alone; an unreadable directory in the base is never judged, and one under a declared target root is admitted and then stops the deletion with a raw error after part of the output is gone; and readGateChecks is read unguarded for the advisory. In the literal fallback: two in-flight orders of one repository share the five gh pr rules so the first close removes them from the second (this reviewer's probe); the Codex rules file writes the exact push rows as prefix rules and the npm helper rule binds no working directory; host-rules --rewrite re-derives the selector from the clone's current origin; and the writer saves settings before the sidecar, removal deletes an identical rule the operator added later, the Codex path is trusted from the sidecar, and a malformed sidecar silences harness check. In the records and text: the receipt reports a target release whose Release creation failed as no-release and files the blocker as completion; the starter refresh pushes its tag before the gh preflight, tags the tip in the already-current branch and previews neither in a dry run; and product 07 and the order's deliverable sentence say the probe wrapper applies no deadline of its own to a complete selection while the code applies a six-hour outer bound (D021). The repair takes the blocking finding and, within the boy-scout bound and the declared surfaces, the follow-ups it reaches, each with a fixture that fails without the fix; the rest stay boarded on the row this decision mints. The register's eight matched rows are left as they are. Receipt 047's composition-cost condition occurred at VER-001; the observation is for planning. PR.md and RELEASE-NOTES.md are left beside the report as drafts whose validation paragraphs state this failure, for the next review to complete.",
  "evidence": [
    "docs/final-reviews/WO-221/FINAL-001.md: the blocking finding, the criterion judgments, the findings block, the register and the executed checks; docs/evidence/WO-221/final-review-001/README.md and probes.mjs: the reproduction and the reruns",
    "Bounded probe base-large-ignored-tree at 2026-10-19T09:22:49Z: files 20000, ignoredPathBytes 1340000, ignoredBefore true, exit 1, stderr 'target clone base main cannot close: base ignore judgment unavailable; source retained. Fix what Git reports, then rerun …', baseNodeModulesRemains true, baseMoved false, targetExists true",
    "scripts/lib/git.mjs: spawnGit passes its options to spawnSync unchanged and runGitPathList sets maxBuffer 16 MiB; scripts/lib/target-worktree-close.mjs ignoredByTree calls spawnGit with input and encoding only; git show main:scripts/lib/target-worktree-close.mjs lines 65 to 86: closeClean lists the base with ls-files --others --exclude-standard, so an ignored tree was never listed and never refused",
    "The standing complete review row host-gate:104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b:npm test, recorded 2026-10-19T07:55:04.693Z, 40 suites, 99 fresh tasks, zero failures, 2238.277 s, found by the saved gate audit at 08:42:26Z, 08:53Z and 09:03:04Z; its target-worktree fixture holds one file per declared root, under the buffer",
    "Bounded reruns at this subject, 2026-10-19 UTC, each exit 0: admission.mjs 08:46:19; close-preignored-env 08:46:30; fallback-optout-rewrite 08:47:03; release-tag-moved-forward 08:47:07; base-info-exclude-env 08:47:26; literal-dirty-main 08:47:38; harness-check-stale 08:47:43; draft-ready-retry 09:07:11; draft-moved-head 09:07:33; shared-rules-probe 08:57:46 (rulesBefore 11, ghRulesBefore 5, secondSidecarRules 3, secondSidecarHoldsGhRules false, ghRulesAfterFirstClose 0)",
    "packages/skeleton/src/harness-host.ts registeredTargetAdmission: the origin clause `if (entry.origin && identity !== entry.origin)`; the helper clause `git diff --quiet refs/heads/main -- scripts/`; the grant clause reading grantedBy, repo, effects and operations only; the push URL read with `git config --get-all remote.origin.pushurl|url`; within() built on resolve. scripts/lib/gate-evidence.mjs line 1 re-exports packages/skeleton/src/gate-evidence.mjs; scripts/lib/github-repository.mjs parseGitHubTarget refuses a credentialed https URL that gitHubIdentity accepts; HOST_GIT_READ neutralizes hooks, fsmonitor and signing but not core.excludesFile, and the bare lane keeps the clone's configuration out of the kit's own pushes",
    "scripts/release.mjs publishTargetRelease: the tag selection `latest && tags.get(latest).target === merged ? latest : …`, the earlier-attempt lookup accepting outcome current, the policy, header and grant checks after closeTargetWorktree in close(), the forge from pushUrl(clone), and target.outcome initialized to no-release; releaseCloseSummary's launchpad line. scripts/lib/starter-refresh.mjs ensureSiblingRelease: pushAnnotatedTag before ensureGhFor, commit: remote in the current branch",
    "scripts/lib/target-worktree-close.mjs: the base judgment ignores skippedIgnoredDirectories, the target filter excludes a declared skipped directory from the refusal and prune then reads it, readGateChecks is called unguarded. scripts/lib/target-publish.mjs publishTargetDraft: commit-tree per run, the record appended after gh succeeds, the rerun's push without a lease when no record exists; worktree.mjs reads the draft body through containedRegularFile, which checks containment and a regular file, not ignore status",
    "scripts/lib/target-worktrees.mjs: codexRulesText writes every row as prefix_rule; hostRuleTable's npm helper row binds no cwd; writeOrderHostRules saves settings before the Codex file and the sidecar and records only the rules its write added; removeOrderHostRules filters every equal string and trusts record.codex; scripts/harness.mjs swallows a staleOrderHostRules failure; scripts/worktree.mjs host-rules --rewrite derives the selector from the clone's current origin and never compares entry.origin",
    "docs/product/07-execution-guide.md §Preflight before the full gate and the order's Deliverables paragraph: 'applies no deadline of its own to a complete selection'; scripts/lib/bounded-command.mjs COMPLETE_SELECTION_DEADLINE_MS = 6 h (D021's correction reached the decision record only)",
    "Two dotln-worker reviewers (read-only, launched 2026-10-19T08:55:00Z after the integration): A over the trust and publication paths, 210,636 subagent tokens over 69 tool uses in 1,098 s, twelve follow-ups and no blocking defect; B over the close, the releases, the starter refresh and the gate process, 288,192 subagent tokens over 85 tool uses in 1,439 s, ten findings of which the first is the blocking one after this reviewer's reproduction",
    "npm run plan -- followups --touching at entry: 10 matched of 159 pending at c8b6b40e…; the eight distinct rows and their dispositions are in FINAL-001 §Register; the authority copies measure 11,686,813 of 206,002,152 bytes under docs/evidence (5.67%)"
  ],
  "rejected": [
    {
      "option": "Route the base ignore judgment's failure as a follow-up because criterion 6's fixture passes",
      "reason": "Product 07 fails the verdict when the change breaks behavior main had and a probe shows it; the probe shows a close main completed now refusing with no registration remedy, and the criterion's own promise fails for a declared tree of realistic size."
    },
    {
      "option": "Repair the spawn's buffer in this review and pass",
      "reason": "A reviewer never writes a behavioral fix and certifies it; a code edit changes the code identity and owes a complete run and fresh independent verification."
    },
    {
      "option": "Route the admission's follow-ups as blocking or as an operator packet",
      "reason": "Every criterion other than 6 holds and main had no admission to regress; each is a repairable defect inside the declared surfaces with a nameable repair rule, which the repair takes within the boy-scout bound."
    },
    {
      "option": "Start a complete review run before failing",
      "reason": "A reproduced blocker goes straight to a truthful failing review; the standing row already judges these bytes and a run would add nothing to the repair."
    }
  ],
  "followup": "FINAL-001 follow-ups for the WO-221 repair within the boy-scout bound, else for the next order that edits the named surface, each with a fixture that fails without the fix: withhold the registered-target admission when the registry entry records no origin, and make worktree start refuse to record null for a GitHub origin; bind the helper admission to the helper's whole closure (scripts/, packages/skeleton/src, package.json scripts, .npmrc) or admit only the node spelling; judge the registered authority profile (expiry, denied effects, revocation) in the hook as the publish helper does; judge the effective push URL and withhold or neutralize a raw push under the clone's own URL rewriting, push refspecs, hooks path and ssh command, or admit only the lane-based helper; never adopt a tag on the merged tip that no earlier attempt of this close published, never count a dry run as an earlier attempt, and check the release's policy, header and grant before the irreversible cleanup; record the tag binding before the push's exit code is read, and bind the target release's forge to the recorded origin; make the draft commit deterministic or record the pushed head before gh so a retry after a post-push failure succeeds; realpath the hook's --body-file and refuse ignored and intake paths in the hook and the draft helper; neutralize core.excludesFile and the init template in the scratch ignore judgment; judge unreadable base directories and refuse an unreadable directory under a declared target root before deleting anything; guard readGateChecks in the close; record the shared gh pr rules per order or keep them while another order of the repository holds them; make the Codex push rows exact or document the prefix gap, and bind the npm helper rule to the launchpad root; compare the recorded origin in host-rules --rewrite; write the sidecar first, remove only rules the sidecar owns that the operator did not re-add, verify the Codex path, and report a malformed sidecar instead of swallowing it; report a target release whose Release creation failed truthfully and file the blocker as publication; run the gh preflight before the starter tag, tag the refresh commit in the already-current branch, and preview the tag in a dry run; correct product 07's and the order's deliverable sentence to the six-hour outer bound.",
  "reopenWhen": "The repair's VER report reproduces the large-tree close completing with the declared tree deleted and the undeclared one refused with the remedy, or a listed follow-up is shown producing an admission, a push, a deletion or a publication outside the registration, the order's worktree or the reviewed commit."
}
```

## WO-221-D039 — A large supported path list keeps its complete ignore judgment

```json
{
  "id": "WO-221-D039",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Repair FINAL-001 F1 by giving the fetched-tree ignore judgment the same 16 MiB output ceiling as runGitPathList, its candidate reader. A supported candidate list must remain a complete NUL-framed judgment before deletion policy is applied. A failed spawn retains the source and names its error code or Git failure under the existing role-redacted remedy. NoOp leaves the reproduced close regression. The new fixture covers an undeclared large tree, the same tree renamed to a declared root, a nonignored file beside it, dry-run preservation and publishing cleanup; its 8192 multibyte/newline paths exceed 1 MiB.",
  "evidence": [
    "FINAL-001 F1 and D038; scripts/lib/target-worktree-close.mjs ignoredByTree; scripts/lib/git.mjs runGitPathList.",
    "Saved final-review-001/probes.mjs base-large-ignored-tree under the bounded wrapper: 2026-10-19T09:43:00.947Z, exit 1 after 14.058 s, 20000 files and 1340000 path bytes; base output and target retained. The same probe after the buffer repair at 09:44:49.734Z exited 0 after 17.496 s, baseNodeModulesRemains false and targetExists false.",
    "repair-final001/ignore-comparison.mjs under the bounded wrapper at 09:44:34.407Z: both arms preserved all 80000 multibyte/newline paths, 13428890 bytes. A single 16 MiB buffer took 133 ms and one Git process; batches below 256 KiB took 474 ms and 67 processes. One sample, not a general benchmark.",
    "scripts/test-target-worktree.mjs: target close judges large NUL-framed base path lists before deleting declared output. The complete review gate will execute the new case; no passing claim is made before its result."
  ],
  "rejected": [
    {
      "option": "Batch the ignore input",
      "reason": "The bounded comparison showed equal judgment with 67 subprocesses versus one and 474 ms versus 133 ms; matching the existing reader ceiling is smaller and keeps one policy judgment."
    },
    {
      "option": "Remove ignored paths from the candidate scan again",
      "reason": "That would reopen VER-001 F1 by hiding already-ignored operator material and files the fetched tree stops ignoring."
    },
    {
      "option": "Raise every Git read limit or scan directories instead of paths",
      "reason": "Neither is needed to support every path list the existing candidate reader admits; directory collapsing can hide nested negation rules."
    }
  ],
  "reopenWhen": "A supported candidate list is truncated or the candidate reader ceiling changes; a larger-than-16-MiB tree requires a separately evidenced streaming change."
}
```

## WO-221-D040 — Bounded close safeguards and truthful deadline text; remaining review findings stay boarded

```json
{
  "id": "WO-221-D040",
  "date": "2026-10-19",
  "dispatch": "resume: fix",
  "decision": "Take FINAL-001 F10, F11, F19 and F20 as the single bounded adjacent-0002 item. The scratch ignore repository disables init templates and global excludes, so only fetched .gitignore blobs can authorize base deletion. Skipped unreadable base directories and skipped declared target directories refuse before deletion; undeclared target material keeps its existing remedy. An unreadable or malformed gate advisory yields baseCheckoutWrites null and an explicit unavailable summary, while checkout judgments still run. Correct product 07 and the stale source comment to the implemented six-hour complete-selection outer bound, and add the named-tag starter preview example the review noted. The order deliverable bound to D016 is read with D021 and this correction as exempt from the 900-second probe deadline, not unlimited; its acceptance text and the immutable FINAL-001 report remain unchanged.",
  "evidence": [
    "FINAL-001 F10, F11, F19 and F20, D038; scripts/lib/target-worktree-close.mjs ignoredByTree, skippedIgnoredDirectories and readGateChecks; scripts/lib/target-gate.mjs already uses null for unavailable base-write observations; scripts/lib/bounded-command.mjs COMPLETE_SELECTION_DEADLINE_MS is six hours.",
    "One read-only Codex worker, launch selection gpt-6.1-sol/max, confirmed the 16 MiB ceiling and the three close repairs; it identified the existing test that intentionally let an unreadable ignored base close. That expectation is replaced by explicit refusal/preservation coverage. No worker wrote files or ran probes.",
    "scripts/test-target-worktree.mjs: target close isolates fetched ignore rules, retains unreadable output and tolerates unavailable gate advisories. Cases inject global excludes and an init-template info/exclude, deny read/search access on both checkouts, and corrupt the advisory as malformed JSON and [null]. The worker identified one test qualification: a malformed index can still block the later launchpad evidence-preservation step. The test now asserts successful target cleanup, blocked launchpad cleanup with its damaged index retained, and complete cleanup after the fixture restores its original index. This repair never bypasses evidence preservation. These cases are authored for the complete review run, whose final result belongs in handoff.md.",
    "The adjacent queue records the diagnosed cause, named paths and complete-gate check, actual scope announcement, and actor-attested message-boundary check-in before starting adjacent-0002."
  ],
  "rejected": [
    {
      "option": "Delete unreadable declared output without inspecting it",
      "reason": "The existing candidate scan may have missed files and partial deletion would precede an access error; refusal preserves both checkouts until access is restored."
    },
    {
      "option": "Represent an unreadable advisory as an empty list",
      "reason": "An empty list is an observation of no recorded writes, which a failed read does not establish."
    },
    {
      "option": "Repair every FINAL-001 follow-up in this dispatch",
      "reason": "F2-F9, F12-F18 and the earlier VER-002 follow-ups involve authority, publication retries, target release state or shared rule ownership beyond this bounded close repair. Retain their concrete repair rules on FUP-3a4c476e4e8099bd and the existing D035/D036 rows for planning; no claim of resolving those defects."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D038",
    "observation": "This repair takes F1 and the adjacent F10, F11, F19 and F20. F2-F9 and F12-F18 remain on FUP-3a4c476e4e8099bd for the next order editing their surfaces; D035 and D036 remain boarded separately. handoff.md and the new gate row determine the completed repair evidence."
  },
  "reopenWhen": "A fetched-tree judgment admits ambient ignore policy, an unreadable directory permits partial cleanup, a failed advisory blocks or masquerades as a known observation, or the wrapper deadline changes."
}
```

## WO-221-D041 — VER-003 follow-up: past the 16 MiB candidate ceiling the base refusal echoes the captured path list

```json
{
  "id": "WO-221-D041",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-003 boards a follow-up for the refusal a release close gives when the clone's base checkout holds more than the 16 MiB of untracked paths the candidate scan reads. The close refuses with the source retained, within D039's bound: the base does not move, and the target worktree and every file remain. Its text, however, is the truncated ls-files output. runGitPathList's spawn ends with ENOBUFS and no stderr, failureOf then quotes the captured stdout, and quoteGitFailure passes it on. The refusal on stderr is 16,843,069 bytes holding 100,254 NUL-separated paths before 'Fix what Git reports', and the receipt's blocker reason holds 16,843,061 bytes. It names neither the limit nor a remedy, against D038's rule that a judgment failure's refusal names what failed and the remedy. The ceiling itself is not the defect. FINAL-001's repair rule offered it, D039 records it with its reopen condition, and product 07 states it. Main's own target-side read of ignored files (ls-files --others --ignored --exclude-standard) has the same 16 MiB ceiling and the same echo. It breaks no criterion: criterion 6 holds at its fixture and at the sizes FINAL-001 and VER-003 probed. One inference from the code, not run: a base whose own committed rules already ignore such a tree closed on main, because main's closeClean listed the base with --exclude-standard. That base now refuses, which is the documented D039 limit, not a new one.",
  "evidence": [
    "docs/evidence/WO-221/verification-003/probes.mjs base-over-ceiling under the bounded wrapper, 2026-10-19T11:57:28Z, exit 1 (the reproduced defect): 101,500 files and 17,052,000 path bytes under a declared node_modules the merged tree ignores; close exit 1; stderrBytes 16843069, stderrHasNul true, stderrPathEchoes 100254, receiptBlockerBytes 16843061; retainedFiles 101500, baseMoved false, targetExists true.",
    "scripts/lib/git.mjs runGitPathList (16 MiB maxBuffer) and failureOf (stderr, then stdout, then the error message); scripts/lib/target-worktree-close.mjs base candidate scan and its catch through quoteGitFailure; git show main:scripts/lib/target-worktree-close.mjs, the closeClean --exclude-standard listing and the target's --ignored listing.",
    "docs/product/07-execution-guide.md target close paragraph: 'The ignore judgment supports the same 16 MiB path list as its candidate scan.'; D038's repair rule and D039's rejected options and reopen condition."
  ],
  "rejected": [
    {
      "option": "Route the over-ceiling refusal as blocking",
      "reason": "The refusal retains the source, and the 16 MiB ceiling is the one FINAL-001's repair rule offered and D039 and product 07 record. The defect is the refusal's text, which breaks no criterion; the target side on main carries the same ceiling and the same echo."
    },
    {
      "option": "Correct the message in this verification",
      "reason": "A verifier never edits the implementation it judges; the defect is boarded with its reproduction."
    }
  ],
  "followup": "Next order editing scripts/lib/target-worktree-close.mjs or scripts/lib/git.mjs: when a path-list read overflows its buffer, refuse with a bounded message naming the checkout by role, the 16 MiB limit and the remedy (remove or reduce the tree, then rerun), never the captured stdout; add fixtures past the ceiling for the base candidate scan and the target's ignored listing that assert a bounded refusal with the source retained. A higher ceiling needs D039's separately evidenced streaming change.",
  "reopenWhen": "An instance reports a base or target checkout over the ceiling, or the candidate reader's limit or failure text changes."
}
```

## WO-221-D042 — VER-003 follow-up: an unwritable declared directory stops the close with a raw error after part of the declared output is gone

```json
{
  "id": "WO-221-D042",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-003 boards a follow-up for a sibling of FINAL-001 F11 that D040's repair does not name. In the target worktree, a declared disposable directory that can be listed and searched but not written (mode 0555 under node_modules) passes the readability guard. deleteDisposable then removes dist/out.js and node_modules/a.js, and stops at unlinkSync of the file inside that directory with Node's raw 'EACCES: permission denied, unlink' message. The message quotes the target's absolute path and names neither a remedy nor the rerun command. The target worktree, its bundle manifest and the base remain, and the base does not move. After write access is restored the retry completes. Only declared regenerable output was deleted, and main refused this target outright as ignored material, so no behavior main had is lost and no criterion breaks. The defect is the unguarded failure after a partial deletion, against the close's rule that a refusal names the tree by its role and ends with the command to rerun.",
  "evidence": [
    "docs/evidence/WO-221/verification-003/probes.mjs target-unwritable-declared-dir under the bounded wrapper, 2026-10-19T11:58:06Z, exit 1 (the reproduced defect): first close exit 1 with 'EACCES: permission denied, unlink <target>/node_modules/locked/file.js', namesFixturePath true, distOutRemains false, nodeModulesARemains false, lockedFileRemains true, bundleManifestRemains true, targetExists true, baseMoved false; after chmod 0755 the retry exits 0 and removes the target.",
    "scripts/lib/target-worktree-close.mjs deleteDisposable (unlinkSync per listed file) and the unreadableDisposable guard, which checks read and search access only; scripts/lib/finder-metadata.mjs assertFinderMetadataTypes."
  ],
  "rejected": [
    {
      "option": "Route as blocking",
      "reason": "Only declared regenerable output is deleted and the retry completes once access is restored; main refused this target as ignored material, and no criterion names an unwritable directory."
    },
    {
      "option": "Fold it into D040",
      "reason": "D040's reopen condition names an unreadable directory; this one is readable, and the guard it needs differs."
    }
  ],
  "followup": "Next order editing scripts/lib/target-worktree-close.mjs: before deleting declared output in either checkout, check write and search access on every directory that holds a listed file, or catch the deletion failure before any further step, and refuse naming the directory relatively, the access remedy and the rerun command, with nothing deleted; add a fixture with an unwritable directory under a declared root in each checkout.",
  "reopenWhen": "A close deletes part of a declared root and then fails, or a close refusal quotes an absolute checkout path."
}
```

## WO-221-D043 — VER-003: an unavailable gate observation reaches the close receipt as an empty list

```json
{
  "id": "WO-221-D043",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-003 observes D040's reopen condition that a failed advisory masquerades as a known observation. When the gate cannot observe the clone's base checkout (here, that checkout was detached from the base branch while the gate ran), every target gate row records baseCheckoutWrites null and baseCheckoutWriteCount null, which is correct. The base-write command still wrote .angular/cache/stray.tsbuildinfo into that checkout. The close keeps only rows whose baseCheckoutWrites is an array, so it records baseCheckoutWrites [] in the receipt and prints no advisory. An unavailable observation is reported as no writes, contrary to the handoff's statement that an unavailable observation is never reported as no writes. D040's repair covers an unreadable or malformed index; a readable index whose rows carry null is the gap. The close completed and deleted the declared stray file, so nothing was lost. Criterion 8 judges the gate rows, which are right, and main had no advisory, so this is a follow-up.",
  "evidence": [
    "docs/evidence/WO-221/verification-003/probes.mjs null-advisory-masquerade under the bounded wrapper, 2026-10-19T11:58:23Z, exit 1 (the reproduced defect): gate rows target:target:test and target:target:base-write each with baseCheckoutWrites null and count null; strayWritten true; close exit 0; receipt targetCleanup.baseCheckoutWrites []; the cleanup line names the deleted base .angular (1) and no advisory.",
    "scripts/lib/target-worktree-close.mjs closeTargetWorktree's filter on Array.isArray(gateRow.baseCheckoutWrites); scripts/lib/target-gate.mjs observeBaseCheckoutWrites returning null without a base checkout; scripts/release.mjs releaseCloseSummary printing the unavailable advisory only for a null receipt value."
  ],
  "rejected": [
    {
      "option": "Fail criterion 8",
      "reason": "The criterion judges the gate rows, which record null for an unavailable observation; the close's repetition is Design C text, and main had no advisory."
    },
    {
      "option": "Treat a null row as no writes",
      "reason": "A null row records a failed observation, which establishes nothing about writes (D040's own rejected option)."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D040",
    "observation": "VER-003 null-advisory-masquerade: gate rows whose base-checkout observation is null aggregate to an empty baseCheckoutWrites list with no advisory at close. Repair rule for the next order editing scripts/lib/target-worktree-close.mjs: when any matching gate row records null, record the receipt's baseCheckoutWrites as null, or as the observed writes plus an explicit count of unavailable rows, and print the unavailable advisory; add the fixture."
  },
  "reopenWhen": "A close receipt reports an empty baseCheckoutWrites list while a matching gate row records null."
}
```

## WO-221-D044 — Final review: integration took in nothing; every acceptance claim carried forward to FINAL-002

<!-- integration refs/dotln/checkpoint/WO-221/17 -->

```json
{
  "id": "WO-221-D044",
  "date": "2026-10-19",
  "dispatch": "resume: final review; worktree integrate WO-221",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all 8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb, the merge base is that commit and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-221/17, 2ab7df292a962b1c10e7938ff3ecf4be82b0bdcf), retained its named stash acb2eb1273a2c4a7cfe4493cf298b96a3747b0b0, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR meter block), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: git ls-files --others --ignored --exclude-standard under docs/intake lists no file, and the three intake directories hold only their .gitkeep files. Every acceptance claim is carried forward unchanged to FINAL-002: VER-003's twelve criterion judgments at code identity 33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d, the identity its VerificationCompleted event of 2026-10-19T12:13:35.236Z records with the complete review row of 10:58:31.828Z (host-gate:33c9b710…:npm test, 40 suites, 99 fresh tasks, zero failures, 2756.610 s) and the document row of 12:13:08.043Z; the second repair's RepairCompleted event of 11:03:15.859Z at the same identity with its document row of 11:02:48.211Z; FINAL-001's blocking F1 as repaired (D039) and reproduced by VER-003 and by this review's rerun of the saved probe; FINAL-001 F10, F11, F19 and F20 as repaired (D040), and F2 to F9 and F12 to F18 as boarded on FUP-3a4c476e4e8099bd; VER-003's three follow-ups as boarded (D041 to D043); and every claim D037 carried forward to FINAL-001: VER-001's F1 and F2 as repaired (D030, D031), F3 and F4 as resolved by the operator-approved amendment (D028, D029), N1 and N2 as repaired (D032, D033), VER-002's F1 and F2 as boarded (D035, D036), and the scope expansions D016 and D017 and the acceptance corrections D028 as bound in the planning log by the PlanExecutionAmended events against receipt 047, the last of which (2026-10-19T07:08:49.998Z) recomputes from the current order bytes under the amendment's normalization as 40,538 characters and sha256:02c3c96eeb6ba3714d99ef644847e813ace7bdf5f310e58544c148abd37bbe2e. The order's bytes are unchanged since checkpoint 7. Before integration the tree differed from the dispatch checkpoint 16 only in docs/control/current.md, docs/control/orders/WO-221.jsonl and docs/work-orders/README.md, none code; after it the tracked tree differs from checkpoint 17 only in docs/lineage/decisions-index.md (this record's row), and the untracked files that changed are this record, docs/evidence/WO-221/meta.json and the PR.md meter block. The saved gate audit found the complete review row at 33c9b710… after integration (12:22:01Z), so the integrated identity is the one VER-003 judged. Release preparation keeps application v0.85.0 under the order's minor classification: local tags end at v0.84.0, and check-surfaces --local passes 57 checks with the release block v0.85.0, @dotln/skeleton the only component whose source changed (0.60.0 to 0.61.0, the console pin and lockfile following; harness host 0.36.0 to 0.37.0) and no bump required for the other five; no dependency is added. Authority edition WO-221/011, artifact-identity WO-213/003, verification WO-213/003 and feedback WO-216/001 stay selected; the authority and feedback checks pass and every generated surface is current after integration, so integration owes no re-mint and no live episode. The product gate criterion 12 requires is the standing complete review row at the integrated identity, reused under D017; no second run of the same bytes is owed, and FINAL-002 records it.",
  "evidence": [
    "refs/dotln/checkpoint/WO-221/17 (2ab7df292a962b1c10e7938ff3ecf4be82b0bdcf); docs/control/local/integration.json: preservationCommit 2ab7df29…, mergeCommit null, complete true, stage applied, untrackedConflicts []; the helper printed Bases 8bbdcbff -> 8bbdcbff, Authored conflicts: none, and the regenerated list above",
    "git rev-parse main origin/main: both 8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb; git diff --stat refs/dotln/checkpoint/WO-221/16 refs/dotln/checkpoint/WO-221/17 lists docs/control/current.md, docs/control/orders/WO-221.jsonl and docs/work-orders/README.md only; git diff --quiet refs/dotln/checkpoint/WO-221/7 on the order file exits 0",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-001/gate-audit.mjs at 2026-10-19T12:22:01Z after integration: codeIdentity 33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d, location worktree, row host-gate:33c9b710…:npm test recorded 2026-10-19T10:58:31.828Z, exit 0, review, 40 suites, 99 fresh tasks, no failed task",
    "Affected checks after integration, 2026-10-19T12:25:34Z to 12:25:41Z, each exit 0: npm run publication:check (both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces; local-terms list present; no stale host rule), npm run release -- check-surfaces --local (57 PASS: release block v0.85.0 against latest local tag v0.84.0; skeleton src changed, observed 0.61.0 against 0.60.0; the other five components unchanged; workspace pins exact; the github-body profile of PR.md and RELEASE-NOTES.md), npm run meta -- --check (the standing WO-150-D003 reopen candidate only), node scripts/authority-evidence.mjs --check (37 bundle comparisons), node scripts/feedback-evidence.mjs --check (the retained WO-216 live audit's judged behavior unchanged); git diff --check exit 0",
    "VER-001, VER-002, VER-003 and FINAL-001 SHA-256 equal the reportHash their completion events recorded (sha256:9e2fd7de…, sha256:cea41747…, sha256:e38a43bc…, sha256:4de794e9…); the order's working bytes normalized as scripts/lib/plan-continuation.mjs executionAmendmentSource hash to the D028 amendment's recorded orderHash over its recorded orderLength",
    "git ls-files --others --ignored --exclude-standard -- docs/intake/ prints nothing; docs/intake holds chats, images and notes, each with only .gitkeep"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR meter block and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "D017: the identity, not the dispatch time, says what was tested; the standing row covers every required suite with executed passing tasks, and a second run of the same bytes adds no coverage for about 46 minutes of gate time."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-19. Original base: `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`.
Fetched main: `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`. Checkpoint: `refs/dotln/checkpoint/WO-221/17` (`2ab7df292a962b1c10e7938ff3ecf4be82b0bdcf`).
Named stash retained: `acb2eb1273a2c4a7cfe4493cf298b96a3747b0b0` (WO-221 integrate 2026-10-19).
Intake backup: none named; `docs/intake` holds three directories with only their `.gitkeep` files and no ignored file, so the helper's intake check required no archive.
Resolved projections: none.
Release preparation: WO-221 target v0.85.0 remains current. Files changed: docs/evidence/WO-221/meta.json, docs/final-reviews/WO-221/PR.md. Meter snapshot: docs/evidence/WO-221/meta.json, 4633 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-003's twelve criterion judgments and the second repair's completion at code identity `33c9b710…`, which the integrated tree keeps; FINAL-001 F1 as repaired (D039), F10, F11, F19 and F20 as repaired (D040), and its other follow-ups as boarded on FUP-3a4c476e4e8099bd; VER-003's F1 to F3 as boarded (D041 to D043); every claim D037 carried forward to FINAL-001; D016, D017 and D028 as bound in the planning log against receipt 047. No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the complete run pass on the integrated tree at 12:25 UTC (evidence above); the complete run is the standing complete review row at the integrated identity, reused under D017 and recorded in FINAL-002.

## WO-221-D045 — Final review: pass FINAL-002 at the integrated subject; the base refusal's nested-path naming leads thirteen boarded follow-ups

```json
{
  "id": "WO-221-D045",
  "date": "2026-10-19",
  "dispatch": "resume: final review",
  "decision": "FINAL-002 passes WO-221 at the integrated subject, code identity 33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d, which integration left unchanged (D044). All twelve criteria hold, criteria 2 and 3 on the operator-amended text (D028) and criterion 4 solely under its express blocked-row fallback. Criterion 12's product gate is the standing complete review row at that identity, npm test -- --review recorded 2026-10-19T10:58:31.828Z with 40 suites, 99 freshly executed tasks, zero failures and 2756.610 s, reused under D017; its document gate is the npm run test:docs row this review records after its last document edit. The blocking claims of the verification sequence stay repaired: twelve saved probes rerun at this subject between 12:26:09Z and 12:29:18Z each exit 0, among them FINAL-001's 20,000-file declared base tree, VER-001's already-ignored base .env and VER-002's forward-moved release tag. The review boards thirteen follow-ups, each a defect in the declared surfaces that breaks no criterion and no behavior main had, found by three independent read-only dotln-worker reviewers or by this reviewer and checked at the named lines. First, in the close: the base judgment names each undeclared ignored base path by its top-level directory (scripts/lib/target-worktree-close.mjs, the undeclared list's map to file.slice(0, file.indexOf('/'))), so a stray .env nested under a source directory the fetched tree tracks and does not ignore is reported as that directory; the reviewer's probe base-nested-env (12:52:07Z, exit 1 as the reproduced defect) shows 'source retained: src/. Declare it disposable in the registration or remove it' with the .env, the base and the target retained, the contrast target-nested-env names the same file in the target worktree as src/.env, and base-nested-env-remedy-followed shows that declaring the named src as the remedy says makes the next publishing close delete the operator's src/.env ('disposable output deleted: base src (1)'). The refusal itself is safe, nothing is deleted or moved until a person declares the named directory, and main never judged these files; the fork's registered target clone, read on 2026-10-19, holds no untracked or ignored file in its base checkout and collected only the root-level .angular cache in its WO-004 close, which the refusal names correctly. Then: a refused publishing close reports the declared output as deleted (refused-close-claims-deletion: 'retained; disposable output deleted: dist (1).' with dist/out.js present); the base judgment lists the fetched commit's whole tree through the 16 MiB reader to find its .gitignore blobs, so past about 16 MiB of tracked paths a close whose base holds any untracked file refuses, echoing the tracked path list, where main completed; prune follows a symlinked intermediate component of a declared root and the validator rejects only an exact .git segment. In the starter refresh, a same-name sibling tag at another commit is found only after the refresh commit is pushed, so every retry refuses until the tag is moved by hand. In the registered-target admission, the target's identity comes from records the session itself can write or move (the root's ignored registry, entry.clone unbound to the clone map, the self-recorded origin, and main's configuration and grants read from refs/heads/main without the helper's committed-bytes check), so a forged entry would admit a push and a draft pull request for a repository the registration does not name (code reading, recipe recorded and not run, extending FINAL-001's trust-model observation and F2); a gh form without --repo is admitted at the target's working directory, where gh resolves its base repository from gh-resolved, an upstream remote or GH_REPO; and the hook reads the registry and the publication records at fixed docs/control paths, so under a configured control root every admission withholds. In the literal fallback, the gh rows are prefix rules a later --repo can pass after the hook withholds (inference from gh's flag parsing). In the draft route, the reuse applies the recorded pull-request number to the current origin's selector without comparing the recorded repository, and a closed-phase publish against a moved draft head refuses with Git's raw '(stale info)' rejection and no named remedy, which meets receipt 047's sixth reopening condition for that path. In the gate process, a focused product selection's partial structural row displaces an earlier full structural pass, so the Preflight-route completion main admitted after --only format and --only <suite> now refuses until a full structural row is recorded last, naming an unneeded npm run sync (the complete-run route the role text ships is unaffected), and three negative final-review cases refuse only on a missing suite, so the new executed-pass and review-selection clauses have no failing case. Observations, not findings: Claude Code's hooks reference states that an allow skips the permission prompt except for actions no mode auto-approves and that deny and ask rules are still evaluated regardless of what the hook returns, so the hook's own deny matcher is defense in depth under Claude Code while Copilot's precedence stays with criterion 4; every plain git push or gh pr in a launchpad session now spawns a status read; the draft tree adds every non-ignored untracked target file; the Codex rules file lives only in main's .codex/rules; the scratch judgment reads a symlinked .gitignore entry, parses pathspec magic in --stdin names and takes core.ignorecase from the temporary filesystem; target-side deletion under a declared root still follows Git's ambient excludes; and release close compares an order's version with the latest v* tag on the instance's origin, so a fork that pushes the starter's core-named tags to its own origin would see its lower-numbered orders close as no-release (the fork's origin holds v0.1.0 and v0.2.0 on 2026-10-19; inference, for planning). Receipt 047: issue 5's condition occurred only in the remedy-followed probe, after a person declares the misnamed directory; issue 6 occurred for the moved draft head; issue 7's composition cost recurs in this review's follow-ups, nine of thirteen in the close and the admission; issue 4 is widened in substance by the admission-identity reading but not shown by fixture or episode; issues 1 to 3 did not occur. The register's eight matched rows are left as they are. Same-day correction: this review first routed the nested-path naming as blocking, reading criterion 6's 'a stray .env in either place refuses once naming the path' beyond its fixture by analogy to FINAL-001 F1, without F1's second ground that a close main completed now failed, and assuming without a check that a nested .env is a realistic shape for a target clone's base checkout. Meant: the verdict is bound to the criteria as written and a repair loop ends when they hold (product 07 §Verification review and attack, the WO-112 lesson); the criterion's fixture holds, main's behavior is not broken, and the fork's actual base checkout does not produce the case. Changed: the finding is the first follow-up below with its repair rule, and the release surfaces tell operators to inspect a named directory before declaring it.",
  "evidence": [
    "docs/final-reviews/WO-221/FINAL-002.md: the verdict, the criterion judgments, the findings block, the register and the executed checks; docs/evidence/WO-221/final-review-002/README.md and probes.mjs (SHA-256 9662d955cd6d5501cf44c4d03634db2a42fa6ccae34604e364d98f7b8a693959)",
    "Bounded probes at 2026-10-19 UTC: base-nested-env 12:52:07 exit 1 (stderr 'source retained: src/. Declare it disposable in the registration or remove it', envRetained true, baseMoved false, targetExists true); base-nested-env-remedy-followed 12:52:19 exit 1 (named 'src/', rerunExit 0, 'disposable output deleted: base src (1)', envRetained false, trackedSourceRetained true); target-nested-env 12:52:35 exit 0 (stderr 'source retained: src/.env'); refused-close-claims-deletion 12:52:47 exit 1 ('branch wo-999: retained; disposable output deleted: dist (1).', distRemains true); the same four modes ran at 12:46:51 to 12:48:53 before the file was formatted, with the same observations",
    "Twelve saved probes rerun at this subject, 12:26:09 to 12:29:18 UTC, each exit 0: final-review-001 base-large-ignored-tree, verification-001 close-preignored-env, verification-002 release-tag-moved-forward, verification-003 base-large-undeclared-then-declared and target-large-declared, verification-001 admission.mjs, fallback-original, draft-ready-retry and draft-moved-head, verification-002 control-dirty-main, base-info-exclude-env and harness-check-stale.mjs",
    "The complete review row host-gate:33c9b7104531cedcddf470ae10c94d6215c88665c371d46f02834407c8fd678d:npm test, recorded 2026-10-19T10:58:31.828Z, 40 suites, 99 fresh tasks, zero failures, 2756.610 s, found by the saved gate audit at 12:22:01Z and again after this review's evidence writes",
    "The fork's registered target clone, read-only on 2026-10-19: its instance's clone map points dotln-angular at it, the instance records no target worktree, git ls-files --others in its base checkout lists no file with or without --ignored, and its committed .gitignore ignores .env, .env.*, test-output/, playwright-report/, test-results/ and unanchored dist and node_modules under tracked top-level apps, docs, tools, .github and .vscode; the instance's origin lists tags v0.1.0 and v0.2.0, and scripts/release.mjs compares an order's version with latestVersion(remoteTags(root)), the origin's tags",
    "Three dotln-worker reviewers (read-only, dispatched 2026-10-19T12:25:04Z after the integration): the core lifecycle and gate process (247,047 subagent tokens, 97 tool uses, 962.5 s), target trust and publication (248,521 tokens, 76 tool uses, 962.7 s) and the close, the releases and the starter refresh (267,672 tokens, 77 tool uses, 1,141.5 s); none reported a blocking defect but the third, whose contestable one is the first follow-up below; the first two each ran one node -e that printed .claude/settings.json's permissions block and wrote nothing",
    "Claude Code hooks reference (code.claude.com/docs/en/hooks, PreToolUse decision control, read 2026-10-19): allow skips the permission prompt, except for actions no mode auto-approves and reads from network paths; deny and ask rules are still evaluated regardless of what the hook returns",
    "npm run plan -- followups --touching at revision ac4e454a…: 14 matched of 163 pending, 8 distinct rows; dispositions in FINAL-002 §Register"
  ],
  "rejected": [
    {
      "option": "Fail the review on the nested-path naming as criterion 6 unmet",
      "reason": "Criterion 6 states its fixture, and its root-level stray .env refuses in either place naming the path with the registration remedy; the nested case breaks no behavior main had, since main never judged those files and the new refusal retains them, and the fork's base checkout does not produce it. Product 07 binds the verdict to the criteria and ends a repair loop when they hold."
    },
    {
      "option": "Correct the naming in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it (product 07 §Independent workflows and integration); a code edit changes the code identity and owes a complete run and fresh independent verification."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "D017: the identity, not the dispatch time, says what was tested; the standing row covers every required suite with executed passing tasks."
    },
    {
      "option": "Route the admission's session-writable identity as blocking",
      "reason": "Criterion 1's clauses hold against the recorded state its fixture names, main had no admission to regress, and the trust model that reads the session's own records is D014's and FINAL-001's recorded observation."
    }
  ],
  "followup": "FINAL-002 follow-ups for the next order that edits the named surface, each with a fixture that fails without the fix: name each undeclared ignored base path by its full path, or by its outermost ancestor the fetched tree itself ignores, never by a tracked or non-ignored ancestor, keeping the cap of twenty names and the count, with fixtures for a nested .env under a tracked directory and a nested undeclared ignored directory in the base checkout; record a publishing close's disposable rows as planned until deletion completes and print deleted only when the outcome is removed; select only the fetched tree's .gitignore entries (a pathspec or a streaming reader) so the tracked tree's size never meets the 16 MiB buffer, and document any remaining ceiling; require each declared root's realpath to stay inside the checkout with no symlinked component and reject .git in any case; judge an existing sibling tag against the commit to be published, with D033's ancestor-and-manifest proof, before the refresh push; read the admitted entry from main's registry and require the root copy to equal it, bind entry.clone to the clone map for the repositoryId, and judge main's committed configuration and grants with the publish helper's committed-bytes rule; require --repo on every admitted gh form; resolve the hook's registry and publication paths through the configured control root; make the literal fallback's gh rows exact or drop them; refuse the draft reuse when the recorded repository differs from the current origin's selector or the recorded origin; refuse a moved draft head naming the branch, the recorded draft head and the pull request with the remedy (take the extra commits through a repair, or restore the branch to the recorded head and rerun); keep a passing partial structural row from displacing a full row's pass and name the real remedy; build the negative final-review rows from the same suite list as the passing one so each refusal depends on the property it names.",
  "reopenWhen": "A target close is shown refusing with a tracked or non-ignored directory named for undeclared material in a real instance, a listed follow-up is shown producing an admission, a push, a deletion or a publication outside the registration, the order's worktree or the reviewed commit, or an instance order closes as no-release because a starter tag above its version reached the instance's origin."
}
```
