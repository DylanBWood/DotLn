# WO-246 handoff

The executor's ledger for WO-246 (v0.117.0, minor), as it stands after the repair of [VER-001](../../verifications/WO-246/VER-001.md): each acceptance criterion judged on its own line with its evidence, then the review ladders, the complete run, the measurements the order asks for, what was recorded and not fixed, what stays untested, the follow-ups, the actor attestation and the process cost. Decisions are in [decisions.md](decisions.md): D001 from release preparation, D002 to D009 from the execution, D010 and D011 from the operator's authorization of the allow rules, D012 to D017 from review round 1, D018 from round 2, D019 from round 3, D020 from the final measurement, D021 to D023 from the verification, and D024 to D027 from this repair.

**Criterion 1:** met. `scripts/test-outward-lint.mjs` admits `✨ Handle input` and `:memo: Plan the pass` as `pr-title` and refuses both as `commit`, keeps `fix: handle input` and `:sparkles: feat: handle input` for both, refuses `Handle input` for both, and passes core's own titles of #257 and #258 whole, which needed the 72-character limit moved to the `commit` kind alone (D002). `scripts/lib/target-publish.mjs` lints the draft's title as `pr-title` only; `scripts/test-target-publish.mjs` passes a long title in core's form and refuses the same words as a commit, `scripts/test-target-worktree-publish.mjs` "WO-221 the draft form at verified" runs the draft and the reviewed publish end to end with titles in core's form, and `scripts/test-target-worktree-start.mjs` still refuses a branch commit without a type at final review. The draft head carries its title as its subject until the reviewed commit replaces it (D003).

**Criterion 2:** met. `scripts/test-plan-refutation.mjs` "WO-246 plan publish" and `scripts/test-launchpad-update.mjs` "WO-246 update --publish" run against an origin on `github.invalid`, rewritten by the fixture environment to a local bare repository that counts the pushes it receives, with a gh double and the repository preflight unchanged. Each pushes once to the bare repository, calls `gh pr create --repo <origin selector> --head <branch> --base main` and prints the URL; after a failed create each adopts the pull request whose state, head, branch and base match and repeats no push. Each refuses before any push on `main`, on a branch of another shape, with a refused term in the body and with AI attribution, which since this repair includes attribution behind a gitmoji in the shortcode form the title lint admits (D025); `update --publish` also refuses before the merge is committed, on a stale branch with or without a commit of its own, on one `main` already names and with no local `main` (D013, D018, D019). The fixture's merge is an edit of the two provenance files, and a hand edit like it passes in use too; the operator reads every update pull request before merging it (D013).

**Criterion 3:** met, repaired from VER-001 F1. Two remotes are now one repository only when their canonical host, owner and name all match, and a host is folded only where its spelling establishes the server (D024, D025). VER-001's own reproduction, `docs/evidence/WO-246/verification-001-probes.mjs`, exited 1 before the repair with all four commands admitted and exits 0 after it with all four refused, its same-repository and explicit-selector controls and its other groups passing. `scripts/test-harness.mjs` "WO-246 a fork's clone refuses" refuses `gh pr list`, `gh pr create --title x`, `gh issue list` and `gh pr view 1` in a two-remote clone naming `-R <origin>`, and the same four on the report's pair naming both hosts. It adds the class beyond that pair: 14 more pairs on distinct servers, including the reverse direction, two enterprise servers, two tenants, a dotless HTTPS host, HTTPS lookalikes, unplaced SSH names and two aliases, all of which the replaced comparison admitted; 8 origins gh cannot address, which refuse naming `-R <upstream>` alone; empty repository flags, which gh ignores; and 15 further spellings: compound, piped, substituted, in a script handed to a shell, behind a wrapper and by a path. It admits the same commands with a value for `-R` or `--repo`, with `GH_REPO=` and a value in the command, with a default set and in a clone with one remote, admits `gh repo set-default`, and admits 12 spellings that establish one server and 6 upstreams gh cannot reach. The default is read as `remote.<name>.gh-resolved`, which gh 2.98.0 wrote and `--view` reported in the probes of D006, and the case sets that key. It also refuses after a moved session directory (D012). The target publish's `gh pr` judgments keep their regressions in harness-fixtures. The duration is recorded in D007, D020, D024 and §Measurements below: about 5 to 7 ms, one Git configuration read.

**Criterion 4:** met. `.claude/skills/dotln-planner/SKILL.md` names `npm run plan -- publish`, and `node scripts/harness.mjs check` passes with 42 generated surfaces. The planner root measures 29,643 bytes against its 24,576 ceiling, 359 over WO-254's 29,284; it is boarded under product 07's one cold-start route as FUP-8b1f9bcc240a1483, no ceiling raised and no acceptance recorded (D009, D011). The repair leaves every root's bytes unchanged.

**Criterion 5:** met. `scripts/test-launchpad-update.mjs` "WO-226 update finish": on a checkout that already holds origin's `main`, `GIT_TRACE` shows `ls-remote` and neither a fetch of `main` nor a bundle, and the object count is unchanged; `--fetch-timeout 2` against a stalled read and a stalled fetch refuses naming the bound and printing the by-hand finish, with a whole-tree snapshot including refs and `HEAD` unchanged; bad values are usage errors. Since this repair the read and the fetch share one deadline, so a four-second read and a stalled fetch under `--fetch-timeout 6` refuse inside nine seconds, where a bound on each call took ten (D025). The same case holds the guard that the target close and target publish make the one `fetchIntoCheckout` call, moved there from a suite `npm test -- --review` did not always select (D025). `scripts/test-drive.mjs` "a borrowing lane": the lane's `objects/info/alternates` names the checkout's store, it holds no objects when the commit is held and three for a one-commit gap, the import stops at the checkout's refs, a commit whose objects are not all there is not held, and `fetchIntoCheckout` reports 600,000 ms by default and honors an override. The callers' existing cases pass in the complete run. The two target stall refusal texts have no committed case, because reaching them takes a ten-minute bound with no override on those commands; a round 2 worker ran both with the bound set to 1 ms at load time (D015, D018).

**Criterion 6:** met. `scripts/test-harness.mjs` "WO-246 the emitted settings": the file on disk equals the installation, `permissions.allow` is exactly `Bash(node scripts/launchpad.mjs update --publish *)` and `Bash(node scripts/refute-plan.mjs publish *)`, no rule names `git` or `gh`, and the deny list is its four Bash rules plus the desktop-control rules, with `git diff` showing four added lines and none removed. The planner root names the node spelling. D008 and D010 cite the host's auto-mode and permissions pages, read 2026-11-05. The host classifier first denied this edit as self-modification; it was parked until the operator authorized it in this session (D008, D010). That the rules count as narrow is a labeled inference, not probed live.

**Criterion 7:** met. `docs/KIT.md` §Planning in this instance, §Taking upstream updates and §Hooks, and product 07 §Operator-opened planning pass, state the helpers and the rule, and `npm run publication:check` passes. The repair corrected §Hooks to the repaired rule, §Taking upstream updates to the spelling that works without a terminal, and product 07's summary of the refusal (D025). Also corrected in the execution: `docs/AI-HARNESS-SECURITY.md`, `docs/PLAYBOOK.md`, `docs/product/03-architecture.md` and a dated amendment to ADR-0005, which said the emitter writes no allow grants (D017).

**Criterion 8:** met. `npm test -- --review` passed at code identity `45cb66bd2092a9b7732c244e148c09f6f8e68006fef6d298df3dddb0178973c2`, tree `843e4cee`, recorded 2026-11-05T12:37:20Z: 44 passed, 0 failed, 118 fresh tasks, 0 h 38 min, no suite unrun. `npm run test:docs` runs after this file is written and its row binds that claim. `git diff --check` is clean. `package-lock.json` changes component versions only, so there is no new dependency.

## Review ladders

self-review: found 20; fixed 12; recorded 8; rounds 2; unreviewed 14 lines (the corrections after round 2, in comments and documents only; round 3 skipped under the ladder's rule, because no code changed after it)

That line is this repair's. Every worker was a Claude `dotln-worker` launched through the Agent tool with no model override, and the reports are in the ignored lane `docs/control/local/reviews/WO-246/repair-1/`.

- **Round 1**, tree `5e927aaa` against the merge base `bdf30849`: `round-1-criteria.md` (7), `round-1-design.md` (8) and `round-1-consistency.md` (4). Two were blocking, C1 and W1, and both were real: this order's own title lint had opened a way past the attribution check, and my repair's alias fold had no end anchor. Fixed 12; recorded 7 (D025 to D027).
- **Round 2**, rechecks over tree `282f8ad5` since `5e927aaa`: `round-2-criteria.md`, `round-2-design.md` and `round-2-consistency.md`. All 12 rechecks held. One new finding was admitted, C8, a change to a behavior `main` had, and is recorded in D025.
- **Round 3** did not run. What changed after round 2's tree is a test comment, one sentence of the guide and D025's wording, all from the reviewers' own observations, 14 lines I judged myself.

The execution's ladder, before VER-001, found 37, fixed 25 and recorded 12 over 3 rounds, with 119 lines past its end; its reports are in `docs/control/local/reviews/WO-246/`.

## Complete run

One run, 2026-11-05T11:59Z to 12:37Z, at the code identity and tree above: 44 passed, 0 failed, 118 fresh tasks, 0 h 38 min, with its identity and build output unchanged across the run. The gate's end removed 2,281 roots, retained 1 and reported no blockers. `main` stayed at the merge base `bdf30849`, locally and at origin, so no integration was due.

## Measurements

- **The refusal's cost.** The emitted permissions hook, one process per call, median of 21, judging temporary clones by the payload's `cwd`, on the final tree: `gh pr list` read and admitted 113.5 ms with two remotes naming one repository and 113.6 ms with one remote; `gh pr list -R o/r` 108.7 ms and `ls` 107.2 ms with no read; refused 85.2 ms, since a refusal stops early. One Git configuration read costs about 5 to 7 ms, as at the base and the first re-emit (D007) and at the execution's final tree (D020). The repaired comparison adds nothing measurable.
- **The live feedback episode.** C1's fix edits a judged feedback source, which the order's Cost said it would not, so the repair ran one: 34 seconds, ten fixtures, recorded as `docs/evidence/WO-246/feedback-002` (D025).
- **The borrowing lane.** On this repository at the base, 30,733 objects: a plain lane's fetch took 2,453 ms and held 49 MB; the borrowing lane's took 57 ms and held none. A plain bundle from the borrowing lane still wrote 49.8 MB, which is why the import stops at the checkout's refs (D005).
- **Startup bytes.** Every role's cold start grows by 140 bytes, the refusal's row in the instruction every root carries, and the planner's by 359: executor 43,744, verifier 38,373, reviewer 40,796, release-close 28,373, planner 29,643, refuter 27,295, router 17,124 (D009, D011). The repair moved none of them.

## Recorded, not fixed

- A URL selector behind a boolean flag, such as `gh pr view --web <url>`, is refused with a remedy that works, and a flag value that looks like a repository flag, such as `--body -R`, admits; telling them apart needs gh's flag table (D016). The same table would be needed for repeated flags: `gh pr list -R me/fork -R ""` is admitted, and gh takes the last value and reaches the parent. `-R $''` is read as an expansion and admitted.
- Shell scope is not tracked: a `cd` or `export` in a subshell, an `unset`, and `GH_REPO=x bash -c 'gh pr list'` can be misjudged. A function body, `coproc`, `find -exec`, `sudo` and the bounded wrapper are programs calling gh, unobserved (D016).
- A self-hosted forge cannot be told from a GitHub server, so an upstream on one is refused with a reason that overstates, and `-R <origin>` passes it (D019).
- A remote is read as written, before `url.<base>.insteadOf`, so a rewritten remote can refuse falsely. An alias spelled from `github.com` that is in fact another server is read as `github.com`, the one equivalence taken on the name, and a name under `github.localhost` counts as its own server. With origin on a server gh is not signed in to, gh refuses `set-default origin` while `-R <origin>` still reaches it (D024).
- A trailing-dot origin reads as one server with its upstream, so the refusal offers `gh repo set-default origin`, which gh refuses because it keeps the dot; `-R` is still named. An alias that does resolve to upstream's server is not offered it, a safe omission, since the hook cannot know. `gh pr -R "" list` is refused correctly but labeled `gh pr -R` in the reason.
- C8: a gitmoji before a key such as `user-session:` now refuses where `main` admitted it. The same line without the gitmoji is already refused on `main`, and a reviewer's sweep of 3,604 commit messages found none affected (D025).
- In a moved session directory with an unreadable clone the session receives the generic runtime advisory rather than the gh one: still one advisory, still admitted (D3 in D025).
- Maintainability, each an ordinary later change: the helper hand-writes a comparison `pushUrl` can make (D4); create-then-adopt exists in the helper and the target publish, which this order's non-goals keep apart (D5); the 240-line judgment could be its own module and test in process (D6); small simplifications in `update --finish` (D8).
- `plan publish` accepts an empty body file; no criterion names it, and the operator reads every pull request before merging.
- The new timing assertion leaves about three seconds for process start and teardown under a six-second bound. It passed in this complete run; if it flakes, its limit cannot go far above nine seconds, since the old shape took ten.
- Commit messages on these branches are not linted, matching the order's "title and body"; the kit's commit-msg hook judges attribution as they are made (D016).
- Any pictograph or shortcode shape passes as a gitmoji; the kit carries no catalog (D016).
- `plan target-publish` keeps its `docs:` type, because its title is a real commit's subject; product 07 says so (D016).
- The kit-guide procedure test keeps its raw push and `gh pr create`, the route the order's non-goals leave to a session not using the helper (D016).
- Copilot's `allowEvidence` names the decision that read Claude's pages (D018).
- The register rows this change touches are the final review's to dispose (product 07, `followups --touching`).

## Corrections

- In the execution: my first preflight ran no suite. A structural failure, an undeclared test import, refused all nine, and my wrapper's exit 0 hid it. The gate rows' 21-second durations gave it away, and I rewrote the wrapper to report each suite's own exit.
- In the execution: D004 said the provenance checks together are the merge committed, and D006 that an unparsed remote names no repository; both were false, and round 1 disproved them (D012, D013). My fix for the first was itself incomplete (D018), and D018's same-host rule traded a false refusal for a silent miss (D019), whose owner-and-name comparison is what VER-001 failed (D024).
- In this repair: D024 justified its alias fold by what public DNS cannot serve while my code folded any name beginning `github.com-` or `github.com_`, including ones DNS can serve. A reviewer reproduced it (W1), and D025 corrects it.
- In this repair: my first cost measurement measured nothing. In a bare copy the hook could not load its adapter and admitted everything; a `denied false` on the row that had to refuse gave it away, and I measured the emitted hook in this checkout instead.
- In this repair: before filing, I corrected three things I had written in D024 and D025 that the evidence did not support: "the operator's clone", where the clone belonged to nobody in particular; that D018's claim held for a plain `npm test`, which selects product suites only; and that D024 made the Cost's feedback claim, which only the order did.

## Untested

- The rules against the host: no allow rule has been probed live, and whether a running Claude Code session picks up a settings change is unknown. A fresh session after the merge is the safe assumption, and a fork's first update under this release may still meet the classifier.
- `plan publish` and `update --publish` against a real forge: the fixtures use a gh double, and no real pull request was opened. gh's own behavior was read on public repositories and offline.
- `gh repo set-default origin` across two real servers: its failure was observed once, in one direction, against a local stand-in on gh's plain-HTTP development host (D025). github.com and `ghe.com` tenants were not exercised that way.
- A real SSH configuration mapping an alias to another server: the probes used a stand-in `ssh`.
- The commit-msg hook end to end on a shortcode line; the predicate it calls is covered directly.
- gh with a terminal, where it may prompt rather than take the first sorted remote: every observation is non-interactive.
- Codex and Copilot: their tool calls are unhooked or unjudged here, so under them the rule is role text.
- Linux hosts.

## Follow-ups

- FUP-8b1f9bcc240a1483 (D009, D011): optimize the role roots' cold-start bytes with equivalent usefulness (deferred).
- FUP-9b6d69455e1ca796 (D015): move the drive route's merged-base fetch onto the borrowing lane (deferred).
- FUP-b946c5a767a65862 (D026): extend the judgment to the remote gh ranks first, such as one named `github` (new).
- FUP-1b6dd806a8985632 (D027): let the publish binding read an SSH alias of `github.com`, so a fork on one can use the helper (new).
- FUP-97b67590057d75b4 (D022) is VER-001's repair rule, which D024 and D025 carry out. I left it pending for the final review to dispose, since the verifier has not yet judged the repair.
- The adjacent-work queue is empty, at revision 0.

## Goal alignment

The outcome matches the order's objective on what can be observed here, and the repair matches VER-001's rule. The traps I named before the repair held up: fixing only the quoted pair would have left 21 of the 22 pairs the old rule admitted, and folding lookalikes was a live defect in the code I inherited. Review then found what I had not named: my own fold was still too wide, and this order's lint had opened a way past the attribution check. Both were caught before the complete run. The operator's own incident, a pull request opened on the starter from a fork, is the case the refusal and the helper's `--repo` each close. Until that fork takes this release its clone is still exposed; the earlier handoff told the operator so, with `gh repo set-default origin` as the one line that closes it.

## Attestation

- **Harness:** claude-code 2.1.318.
- **Model:** claude-opus-5-5.
- **Effort:** max, read back from the host's `CLAUDE_EFFORT=max`; the source is `claude-session-readback`, which reports the selected effort, not the effective one.
- **Workers in this repair:** by the hook's count, 4 launches (all Claude) and 5 re-tasks: 9 of the subagent cap's 20. They were one web-fetch worker with two re-tasks, and three review workers with one recheck each. The kit's live feedback episode ran over `claude-cli-print` at `claude-opus-5-5` and `xhigh`. Two review workers ran `git write-tree` against their brief, which may have added an unreferenced tree object and moved no ref; one tried a test-runner listing, which the hook refused.

## Process cost

`node scripts/harness.mjs usage cafea5a2-3865-405c-ac82-08832b12bb46` at 2026-11-05T12:30:06Z, from Claude transcript message usage, scope dispatch:

| Counter | Value |
| --- | --- |
| Input tokens | 172 |
| Cached input tokens | 29,548,833 |
| Cache-write input tokens | 512,559 |
| Output tokens | 273,853 |
| Total tokens | 30,335,417 |
| Reasoning tokens | unknown |
| Cost | unknown |

Dispatch standing near that reading: 2 h 1 min of 8 h 0 min, complete runs 1 of 20, within. Worker tokens are outside these counters: the Agent tool reported 1,783,452 across the three reviewers' two rounds, which may count a re-tasked worker's earlier context twice. Later counters stay in the ignored receipt and the response. The execution before VER-001 used 89,841,054 by the same counter.
