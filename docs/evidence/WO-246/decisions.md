# WO-246 decisions

## WO-246-D001

```json
{
  "id": "WO-246-D001",
  "date": "2026-11-05",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.117.0, the next minor above the observed release baseline v0.116.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.116.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-246-the-launchpads-own-pull-requests.md"
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

## WO-246-D002 — A pull-request title may be a gitmoji and a subject, at any length

```json
{
  "id": "WO-246-D002",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 1",
  "decision": "The pr-title kind admits a leading gitmoji followed by any subject, and the 72-character limit stays on the commit kind alone. The length half is an adjacent repair the order does not spell: its objective is that a title in the form core uses passes the lint everywhere, and it names #257 and #258 as those titles, which run far past 72 characters, so the gitmoji admission alone would still refuse both on subject.length. A word and a colon behind a gitmoji is the subject's own text, so a typed title with an unknown type behind a gitmoji passes while the same title with no gitmoji still refuses subject.type. The commit kind is unchanged: its type, its limit and its refusal of a gitmoji with no type.",
  "evidence": [
    "git log main subjects at the base: #275 262 characters, #274 230; #258 and #257 quoted whole as regression cases in scripts/test-outward-lint.mjs.",
    "docs/product/08-publication-compiler.md §PRs and commits: a PR title has no fixed word count, and the 2026-09-07 operator correction there names drift, not a count, as the defect.",
    "git log -S subjectLengthLimit: the limit dates from WO-063's lint of 2026-09-21; no document states it for a title, and every test that pins subject.length uses the commit kind (scripts/test-outward-lint.mjs, test-target-publish.mjs, test-target-worktree-start.mjs).",
    "npm test -- --only outward-lint cases at this tree, under the bounded probe: 59 passed."
  ],
  "rejected": [
    {
      "option": "Keep the limit on titles and exempt only the launchpad's own helper",
      "reason": "A title in core's form would still be refused on a target, the workflow the fork wrote to retitle; the objective says everywhere."
    },
    {
      "option": "Ask planners to write titles of 72 characters or fewer",
      "reason": "Nobody asked for a cap; product 08 sizes a title by its content, and the operator merged #275 at 262 characters."
    }
  ],
  "reopenWhen": "A registered target's convention needs a title limit, or a squash merge's copied subject breaks a target's own commit check."
}
```

## WO-246-D003 — A draft head carries the title as its subject

```json
{
  "id": "WO-246-D003",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 1",
  "decision": "The target publish's draft form lints its title as pr-title only, as the order directs, and keeps writing that title as the draft commit's message, so a draft in core's form has a head whose subject carries a gitmoji and no type. The order's reason, that the branch's commit subjects are linted by the reviewed-commit lint, holds for the branch but not for this commit: the draft commit is made by commit-tree on no branch, and the lint walks the branch. It stands until the reviewed publish replaces the head under its lease, so it never reaches the merged history through a merge commit. Recorded rather than changed: the order fixes the lint, and giving the draft head a second subject would be a new field nobody asked for.",
  "evidence": [
    "scripts/lib/target-publish.mjs publishTargetDraft: commit-tree ... -m title; scripts/lib/target-commit-lint.mjs walks targetCommits over the worktree branch.",
    "scripts/test-target-worktree-publish.mjs 'WO-221 the draft form at verified': the draft title is now :memo: Preserve reviewed behavior and the reviewed publish's :sparkles: Preserve reviewed behavior, end to end."
  ],
  "rejected": [
    {
      "option": "Keep linting the draft title as a commit",
      "reason": "It refuses the form this order admits, the refusal the order exists to remove."
    },
    {
      "option": "Derive a typed subject for the draft commit",
      "reason": "A conventional type cannot be derived from a title that has none, and an invented one would misdescribe the change."
    }
  ],
  "reopenWhen": "A target's commit check rejects a draft head on its subject."
}
```

## WO-246-D004 — One helper with two doors, linted as the launchpad's own text

```json
{
  "id": "WO-246-D004",
  "date": "2026-11-05",
  "dispatch": "resume: next; steps 2 to 4",
  "decision": "scripts/lib/launchpad-publish.mjs is the one helper; plan publish and update --publish are its doors, each loaded on demand. It lints through checkOutwardArtifact as the launchpad's own text, not a target's: launchpad identifiers and the public review words pass, because a launchpad's own pull request is about them, and any private term refuses in either mode, because this route has no --confirm-terms step for a review-mode match to wait for. An absent local-terms list refuses with its remedy, as the kit guide says of publication. A missing outward-vocabulary.json falls back to the conventional types, since the kit carries none and the guide requires it only for a target publication. The update door's proof is that UPSTREAM.md and KIT-MANIFEST.json name one commit, that main's UPSTREAM.md names another, and that harness check and lineage index --check pass in the checkout; together with the helper's clean-tree refusal that is the merge, the emit and the index committed. A fast-forward has no merge commit, so none is required. The order's 'update role text' does not exist: no role carries the update route, whose home is the kit guide, so the guide names the node spelling.",
  "evidence": [
    "docs/KIT.md §First steps: an absent list is unavailable and refuses publication; target publication needs the instance's own outward-vocabulary.json; the kit carries none. ls of a starter's docs/control on 2026-11-05 shows no vocabulary file.",
    "docs/product/07-execution-guide.md, Outward artifacts: launchpad identifiers and review words are a target's concern.",
    "grep for the update route in packages/skeleton/src/loadouts/contributor.ts: no match.",
    "scripts/launchpad.mjs must load without an install, so the helper, whose body profile needs the Markdown parser, is imported on demand.",
    "Cases: scripts/test-plan-refutation.mjs and scripts/test-launchpad-update.mjs 'WO-246', against an unresolvable GitHub-shaped origin rewritten to a local bare repository that counts its pushes, with a gh double."
  ],
  "rejected": [
    {
      "option": "Reuse lintArtifacts from the target publish",
      "reason": "It judges target text, so WO numbers refuse and every use of the word launchpad waits for a confirmation."
    },
    {
      "option": "Record the previewed revision and compare it at publish",
      "reason": "A preview writes nothing by contract; recording one would add a write and a new failure mode, and the provenance files carry the same fact."
    },
    {
      "option": "Refuse a missing vocabulary file",
      "reason": "A fresh instance could not publish its first planning pass until it registered a target."
    },
    {
      "option": "One generic publish for any branch",
      "reason": "The order rejects it: an order's branch has its own publish with its lifecycle preconditions."
    }
  ],
  "reopenWhen": "An instance needs a review step on its own pull requests, or a kit update stops moving UPSTREAM.md and the manifest together."
}
```

## WO-246-D005 — The lane borrows the checkout's objects, and the import stops where the checkout's refs do

```json
{
  "id": "WO-246-D005",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 5",
  "decision": "fetchRemoteBranch takes alternates: the lane lists the checkout's object store, reads the remote's commit first under the same bound, fetches nothing when the checkout holds that commit whole, and otherwise downloads what the checkout lacks. A plain bundle from a borrowing lane would re-pack the whole history into the checkout, so the bundle stops at --not --alternate-refs, and a held commit skips the bundle, which Git would refuse as empty. Held means whole: rev-list --objects over the commit down to the refs, because a commit an interrupted import left can lack its history. The read-first lives in fetchRemoteBranch, one place for the three callers rather than three copies; the drive route keeps its own and passes no alternates. timeoutMs refuses by name, carrying boundMs. The default is REMOTE_FETCH_TIMEOUT_MS, ten minutes, as the order sets it. --fetch-timeout belongs to update --finish, which alone has a by-hand finish to print; the target close and target publish refuse naming the bound and git fetch origin <base> in the clone, after which their read finds the commit held. Comparison run per Tinkerer Economy, on this repository at the base, 30,733 objects: a plain lane's fetch took 2,453 ms and held 49 MB, the borrowing lane's 57 ms and held none. A plain bundle from the borrowing lane still took 1,720 ms and wrote 49.8 MB; --not --alternate-refs on a held commit answered 'Refusing to create empty bundle'; the held check took 21 ms. The publish lane's 2.4 s copy stays as it is.",
  "evidence": [
    "scratch comparison lane-arms.mjs under the bounded probe, 2026-11-05, output quoted in the decision.",
    "scripts/test-drive.mjs 'a borrowing lane fetches only what the checkout lacks': three objects for a one-commit gap, none when held, a commit with only its own object treated as not held and left whole, refs unmoved, boundMs on a stall.",
    "scripts/test-launchpad-update.mjs 'WO-226 update finish': GIT_TRACE shows ls-remote and neither a fetch of main nor a bundle when held, count-objects unchanged; --fetch-timeout 2 against a stalled read and a stalled fetch refuses naming the bound and printing the by-hand finish, treeSnapshot unchanged."
  ],
  "rejected": [
    {
      "option": "A plain git fetch origin main into the checkout",
      "reason": "The order rejects it: the clone's transport configuration and refs stay out of the kit's reach (WO-205, WO-206)."
    },
    {
      "option": "A bound alone",
      "reason": "It stops the stall and keeps the whole download on every finish."
    },
    {
      "option": "--fetch-timeout on worktree publish and release close too",
      "reason": "Two more flags on commands whose remedy, a by-hand fetch the next read finds held, needs none; reopen on a target whose honest fetch passes ten minutes."
    },
    {
      "option": "Fall back to a plain lane when a borrowed object is damaged",
      "reason": "The order's known issue keeps the refusal and its reopening condition."
    }
  ],
  "reopenWhen": "A finish fails on a borrowed object and succeeds with alternates off, or a recorded honest fetch passes ten minutes."
}
```

## WO-246-D006 — The refusal reads the clone and the command as written

```json
{
  "id": "WO-246-D006",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 6",
  "decision": "The permission hook refuses a gh pr or gh issue command that names no repository in a clone whose origin and upstream name different repositories and whose gh default is unset, naming -R <origin>, -R <upstream> for a deliberate read of the parent, and gh repo set-default origin. It runs only in the permission hook, so one judged command costs one read. WO-244's parsed command facts have not landed, so the judgment extends the existing gh parse through one ghCommand both read, and takes its words from the shell reader the diagnostics already use, which reads every form rather than refusing control syntax and substitutions: a session's commonest spellings are a cd prefix, a pipe, a substitution and a loop. Beyond the order's admitted forms: a pull-request or issue URL as the selector names its repository, and help or a bare group reaches none; an empty GH_REPO is not a repository; a URL given as a flag's value is no selector. A literal cd moves the clone judged, any other cd leaves it unknown and admits. A remote that names no GitHub repository leaves gh nothing to choose and admits quietly; only a failed read advises. The default is read as remote.<name>.gh-resolved with a value on any remote.",
  "evidence": [
    "https://cli.github.com/manual/gh_repo_set-default, read 2026-11-05 through a web-fetch worker: the command 'sets the default remote repository to use when querying the GitHub API for the locally cloned repository', used for viewing and creating pull requests and issues; --view and --unset as the order quotes; the page names no storage key.",
    "gh 2.98.0, scratch probes under the bounded wrapper, 2026-11-05, on two public repositories: with origin and upstream and no default, gh repo set-default --view reports none and gh pr list reached upstream; gh repo set-default <repo> and gh repo set-default upstream each wrote remote.<name>.gh-resolved base; a hand-set value on either remote is what --view reports and what gh pr list reaches, including an owner/repo value; -R, -Rvalue, --repo=value, -R before the verb, a host-qualified selector and a URL selector all reached the named repository; GH_REPO overrides and an empty GH_REPO does not; with one remote gh reaches origin. gh repo set-default --unset refused non-interactively, 'repository required when not running interactively', so the guide names only the setting form.",
    "scripts/test-harness.mjs 'WO-246 a fork's clone refuses': 19 refused spellings, 27 admitted forms, the default on either remote, cd into and out of a one-remote clone, an unreadable clone's advisory, and one repository under two remotes."
  ],
  "rejected": [
    {
      "option": "Run gh repo view or gh repo set-default --view in the hook",
      "reason": "The order rejects a network call per judged command; --view also starts gh, which a hook's budget should not."
    },
    {
      "option": "Judge only the plain form through plainShellWords",
      "reason": "cd x && gh pr list is admitted and reaches the parent, the case the order exists for."
    },
    {
      "option": "Admit any word that looks like a URL",
      "reason": "gh pr comment 1 --body <url> names no repository and would reach the parent."
    },
    {
      "option": "Refuse when the remotes cannot be read",
      "reason": "The order's known issue admits with one advisory, today's behavior."
    }
  ],
  "reopenWhen": "A pull request lands on a parent repository from a session under the hook; a Codex session opens one; a fork session reaches the parent after the advisory; or a gh release stores the default elsewhere and the admitted case fails."
}
```

## WO-246-D007 — The refusal costs one Git configuration read

```json
{
  "id": "WO-246-D007",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 6",
  "decision": "The judgment adds about 6 ms to a gh command that names no repository, the one read, and nothing measurable to any other call. Before is the pinned base snapshot this session's hooks still ran, after is the re-emitted snapshot, each the emitted permissions hook started once per call as the host starts it, on this one-remote checkout, median of 21: gh pr list 104.3 ms before, 110.6 after; gh pr list -R o/r 103.5, 103.1; ls 102.4, 102.5.",
  "evidence": [
    "scratch hook-cost.mjs under the bounded probe, 2026-11-05: labels before and after, snapshots 3733225e5754bb10 (no writtenCommands in its harness-host.js) and cab2fab4e875de4b."
  ],
  "rejected": [
    {
      "option": "Measure the function in process",
      "reason": "A hook's cost is what the host waits for, and the 100 ms process start is the context that makes 6 ms small."
    }
  ],
  "reopenWhen": "The judgment gains a second read, or a hook's budget tightens."
}
```

## WO-246-D008 — The allow rule waits for the operator's word

```json
{
  "id": "WO-246-D008",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 8",
  "decision": "Step 8's permission change is not made in this tree: the emitted .claude/settings.json carries no permissions.allow entry, the compiler's guard against allow entries stands, and the Claude profile still declares allow: false. Host evidence: the Claude Code auto-mode classifier denied the one command that bundled those edits, naming Self-Modification, and said to finish the rest and leave the decision to the operator. Those edits are the one part of this order that widens what agents under the kit may run without being asked, including a push and a pull request, so the denial is taken at its word: the same change is not attempted through another tool. The planner root does name the node spelling, which is text and grants nothing. Criterion 6 stands unmet on its first clause until the operator decides, and everything else in the order proceeds. The page as read today also differs from the order's account of it: it says narrow Bash allow rules such as Bash(npm test) are resolved before the classifier and that only broad rules that grant arbitrary code execution, such as Bash(*) or wildcarded interpreters, are suspended; it says nothing of package-manager run commands, and no sentence decides whether a rule naming one script after node counts as narrow. Inference, labeled as one: Bash(node scripts/refute-plan.mjs publish *) is narrow, since the permissions page says the words before the first * are what limit a rule. No live probe of an allow rule has run, as docs/discovery/harness-smoke-2026-09-07.md#C6 also records.",
  "evidence": [
    "The denied Bash call of this session, 2026-11-05: 'Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Self-Modification]'. git diff afterwards showed none of its edits applied.",
    "https://code.claude.com/docs/en/auto-mode-config, read 2026-11-05 through a web-fetch worker: 'By default, narrow Bash and PowerShell allow rules such as Bash(npm test) stay in effect in auto mode. Claude Code resolves them before the classifier runs'; 'suspends only the broad rules that grant arbitrary code execution, such as Bash(*) or wildcarded interpreters'; autoMode.classifyAllShell suspends every Bash allow rule.",
    "https://code.claude.com/docs/en/permissions, read 2026-11-05: 'Claude Code matches everything before the first * as written, so those words are what limit the rule'; every subcommand of a compound must be allowed.",
    "packages/compiler/src/harness.ts assertHarnessProfile: 'allow entries have no observed local contract'.",
    "The user's global instruction: do not alter account or tool settings without explicit authorization."
  ],
  "rejected": [
    {
      "option": "Make the same edits through the Edit tool",
      "reason": "The classifier judged the change, not the tool; another route would be working around the denial."
    },
    {
      "option": "Emit the rules under another name or from another file",
      "reason": "The same widening by another spelling."
    },
    {
      "option": "Hold every other step until the operator answers",
      "reason": "The denial itself says to finish the rest, and the rest is independent of this one change."
    }
  ],
  "reopenWhen": "The operator authorizes the allow rule in this session, or declines it, in which case criterion 6 is recorded on the operator's word."
}
```

## WO-246-D009

```json
{
  "id": "WO-246-D009",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 7",
  "decision": "This decision authorizes the role change. The planner root names the publish helper in both spellings in its existing sentence on the planning pull request (188 bytes), and the harness contract's refusals sentence, carried by every root's instruction, gains the gh refusal's row (140 bytes). Every root grows by 140 bytes and the planner's by 328: executor 43,604 to 43,744, verifier 38,233 to 38,373, reviewer 40,656 to 40,796, release-close 28,233 to 28,373, planner 29,284 to 29,612, refuter 27,155 to 27,295 and router 16,984 to 17,124 (installed CLAUDE.md plus the skill, both roots identical). Only the planner's skill bytes change, pinned at both economy settings in a new linked role oracle, packages/skeleton/fixtures/wo246-role-baseline.json, whose parent is the unchanged wo254-role-baseline.json. Under product 07 §Discipline's one cold-start route each reviewed rule stays whole and each root over its ceiling is boarded for optimization: no ceiling is raised and no acceptance recorded.",
  "evidence": [
    "node scripts/harness-context.mjs on the synced tree, 2026-11-05: the bytes above; instruction 7,380 from 7,240; verdict breach for every role but the refuter, which has no ceiling.",
    "docs/control/budgets.json limits.coldStartBytes: planner 24,576; router 16,384.",
    "npm run sync refused the role oracle ('Record the authorizing role-change decision and mint a new linked role oracle') until this oracle was minted; the planner skill's hash was the first difference test-process-debt.mjs reported."
  ],
  "rejected": [
    {
      "option": "Shorten other sentences to fit the ceilings",
      "reason": "Product 07 §Discipline: no needed rule is cut to fit; the optimization is boarded with equivalent usefulness."
    },
    {
      "option": "Raise the ceilings or record acceptances",
      "reason": "The 2026-09-17 route is retired (product 07 §Discipline, WO-192-D095)."
    },
    {
      "option": "Leave the gh refusal out of the refusals sentence",
      "reason": "The order's known issue: once WO-251 renders the sentence from a list, this order adds its row, and the emitted sentence may not omit a refusal the hook emits."
    }
  ],
  "followup": "Optimize the role roots' cold-start bytes with equivalent usefulness: WO-246 added the gh refusal's row to every root (140 bytes) and the publish helper's two spellings to the planner's (188 more), and the executor, verifier, reviewer, release-close, planner and router roots exceed their cold-start ceilings in docs/control/budgets.json.",
  "reopenWhen": "A planning pass allocates the optimization, or a role's reviewed rules change again."
}
```

## WO-246-D010 — The operator authorizes the two allow rules

```json
{
  "id": "WO-246-D010",
  "date": "2026-11-05",
  "dispatch": "resume: next; the operator's word in this session, step 8",
  "decision": "Make step 8's permission change on the operator's word, which answers D008. After being told what the rules do, that they let the helpers run without the classifier or a prompt in every instance, and that the classifier had denied the edit as self-modification, the operator chose them, preferring a rule limited to these two scripts over one for gh. The emitted .claude/settings.json carries permissions.allow with Bash(node scripts/launchpad.mjs update --publish *) and Bash(node scripts/refute-plan.mjs publish *), no rule names git or gh, and the deny list is unchanged. The compiler's guard now admits allow entries only in Claude Code's contributor profile, whose declaration moves to allow: true; the target worker profiles declare false and their lowering emits none; Copilot's shared settings file carries the same bytes under its own allow: false, as it carries the deny rules it declares false. The same edit, retried once after this authorization, was not denied. The rules reach an instance through its update's re-emit: .claude/settings.json is a manifest-listed kit file that harness check compares byte for byte, so nobody adds them by hand.",
  "evidence": [
    "D008's three host pages, read 2026-11-05: narrow Bash allow rules are resolved before the classifier; wildcarded interpreters are suspended; autoMode.classifyAllShell suspends every Bash allow rule; the words before the first * limit a rule. D008 labels the inference that a rule naming one script after node is narrow.",
    "git diff -- .claude/settings.json on the synced tree: four added lines, the allow list and its two rules, and no other change.",
    "scripts/test-harness.mjs 'WO-246 the emitted settings allow the two publish helpers': the file on disk equals the installation, the two entries, no rule naming git or gh, and the deny list equal to its four Bash rules plus desktopControlDenyRules.",
    "packages/compiler/test/harness.test.ts: allow true passes on the Claude contributor fixture and refuses on a Copilot one.",
    "../DotLn-Instance/KIT-MANIFEST.json lists .claude/settings.json; its current file has a deny list and no allow list."
  ],
  "rejected": [
    {
      "option": "A rule for git push or for gh",
      "reason": "The operator's stated preference and the order's: a raw push rule admits every push, and the hook admits one form so the host learns one."
    },
    {
      "option": "A rule for npm run plan or Bash(node *)",
      "reason": "The npm spelling runs lifecycle scripts and the kit's own admissions withhold it; a bare node rule is the wildcarded interpreter the host suspends."
    },
    {
      "option": "Asking the operator to add the rule by hand in each instance",
      "reason": "The order rejects it, and a hand edit is harness drift."
    }
  ],
  "reopenWhen": "The helper's own node spelling is refused by a host classifier with the rule emitted, a live observation contradicts the labeled inference, or the host changes how it treats narrow rules."
}
```

## WO-246-D011 — The planner's sentence leads with the spelling the rule admits

```json
{
  "id": "WO-246-D011",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 8",
  "decision": "With the rule emitted, the planner's sentence names the node spelling first and says npm run plan -- publish takes the same flags and has no rule, so a planner in auto mode reaches for the form the host admits. Both spellings stay named, as criteria 4 and 6 each ask. This revises D009's numbers for the planner only: its root measures 29,643 bytes, 359 over WO-254's 29,284, and every other root's 140 stands. D009 stays the growth decision its follow-up names; no ceiling is raised and no acceptance recorded. Two expected-data updates, each caused by this order: the target close's pinned bad-origin text reads git ls-remote where it read git fetch, because the read now comes first, and the wording around it, which names the failed fetch, is still true of the operation; and the role oracle chain gains its new head in test-process-debt.mjs and test-gate-followups.mjs.",
  "evidence": [
    "node scripts/harness-context.mjs on the synced tree, 2026-11-05: planner 29,643, delta 359; the others delta 140.",
    "scripts/test-target-worktree-close.mjs 'target close refuses an unreadable, dirty or broken base' at the preflight of 2026-11-05 reported the new text, and only that word differed.",
    "node scripts/check-role-oracle.mjs: only the planner's two skill pins differ from wo254-role-baseline.json."
  ],
  "rejected": [
    {
      "option": "Keep the npm spelling first, as the order's step 7 words it",
      "reason": "Step 8 says the planner names the node spelling because the host's rule covers only it; leading with the other would send a planner to the form the classifier judges."
    }
  ],
  "reopenWhen": "A role's reviewed rules change again in this order."
}
```

## WO-246-D012 — Correction: the refusal reads the clone the command runs in and remotes as gh reads them

```json
{
  "id": "WO-246-D012",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 1",
  "decision": "Round 1's criteria findings C1, C2 and C11 are fixed. The judgment needs only the command and its clone, so it moved above the stand-down that a moved session directory takes, keeping its one read per judged command and its advisory on an unreadable clone. A remote is read as gh reads it, with two selectors the same when they are equal or one is the hostless form of the other. A remote that is a local path still names no repository and admits quietly. A fork whose parent remote is not named upstream stays admitted, the order's literal scope.",
  "evidence": [
    "Criteria report C1 and C2 executed the emitted hook and gh 2.98.0 offline: moved directories were admitted with no judgment; gh sent gh pr list to the parent for a trailing slash, a user, a token, git:// and GIT@.",
    "scripts/test-harness.mjs 'WO-246 a fork's clone refuses': eight origin spellings each refused naming the right selector, no token echoed, an alias of the parent's own name admitted, an upstream with a trailing slash refused, a moved directory inside the clone refused, a moved directory in another fork refused naming that fork, and a moved directory in a one-remote clone admitted."
  ],
  "rejected": [
    {
      "option": "Advise instead of refusing on an unparsed remote",
      "reason": "The spellings are ordinary and gh reaches the parent through them; an advisory would leave the silent case the order exists to remove."
    }
  ],
  "reopenWhen": "gh reads a remote spelling this does not, or a refusal names a repository the session did not mean.",
  "kind": "correction",
  "misread": "D006 said a remote the publish binding cannot parse names no GitHub repository and leaves gh nothing to choose, and it placed the judgment among the root-bound checks.",
  "meant": "The refusal exists for what gh does. gh reads a trailing slash, a user or token, git:// and http:// as the same repository, and a session's persisted cd moves the clone gh reads, not the need to judge it.",
  "changed": "The judgment runs in evaluateHarnessHook ahead of the moved branch, from input.cwd; remoteRepository reads remotes as gh does, normalizes *.github.com to github.com and names an SSH alias by owner and repository, and no refusal echoes what a URL carries beside the repository."
}
```

## WO-246-D013 — Correction: a branch with nothing past main carries no update

```json
{
  "id": "WO-246-D013",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 1",
  "decision": "Round 1's criteria finding C3 is fixed for the stale branch and recorded for the hand edit. The operator reviews every update pull request before merging it, so a hand-edited provenance reaches a reader, not main.",
  "evidence": [
    "Criteria report C3 executed both inputs on an exported instance.",
    "scripts/test-launchpad-update.mjs 'WO-246 update --publish': chore/stale at main~1, with main's provenance moved, refuses naming no commits past main, before any push."
  ],
  "rejected": [
    {
      "option": "Record the previewed revision and compare it",
      "reason": "D004: a preview writes nothing by contract, and this would add a write and a failure mode to catch an edit only a deliberate author makes."
    }
  ],
  "reopenWhen": "A hand-edited provenance is published by mistake rather than on purpose.",
  "kind": "correction",
  "misread": "D004 said the provenance comparison, the checks and a clean tree together are the merge committed.",
  "meant": "They prove the branch's committed files agree and differ from main's; a branch behind main names an older commit, which differs too. And two hand-edited provenance lines naming an invented commit pass, as the order's own fixture does to simulate a merge.",
  "changed": "update --publish also refuses a branch with no commits past main. The hand edit stays admitted and the fixture's stands for a merge: provenance is the instance's own committed text, and telling it from a real merge needs the previewed-revision record D004 rejects."
}
```

## WO-246-D014 — Correction: the allow flag decides the bytes and names where its contract was read

```json
{
  "id": "WO-246-D014",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 1",
  "decision": "Round 1's design findings D3 and D4 and consistency finding K5 are fixed.",
  "evidence": [
    "packages/compiler/test/harness.test.ts 'WO-039 profile observations': allow without evidence refuses, with evidence emits exactly the two rules, allow false emits none, and a Codex profile refuses.",
    "scripts/lib/harness.mjs: 'Harness profiles disagree on shared output' on a shared file that differs.",
    ".claude/harness-manifest.json on the synced tree carries allowEvidence beside allow: true on the two profiles."
  ],
  "rejected": [
    {
      "option": "A list of rules per profile",
      "reason": "Two profiles must name identical lists to pass the disagreement refusal, so the list adds a place to diverge and no choice."
    }
  ],
  "reopenWhen": "A profile needs different allow rules from Claude's, or Copilot's handling of them is observed.",
  "kind": "correction",
  "misread": "D010 kept profile.settings.allow as a declaration no code read beyond a guard, with Copilot's shared file under its own allow: false, and its comment repeated the order's 'the hook admits one form so the host learns one', which is not what the hook does: it judges no launchpad git push, as the order's non-goals say.",
  "meant": "A field that looks like a switch must be one, and a comment must state what is known: the page's sentence and the labeled inference, not a claim about a hook that does not exist.",
  "changed": "The emitter writes the rules only under settings.allow, so withdrawing them is one edit in each profile that shares the file, and the installation's disagreement refusal catches one edit alone. settings.allowEvidence names the decision that read the host's page, since the settings evidence row C6 still says no allow was probed. Claude's and Copilot's contributor profiles declare allow: true, Copilot's comment saying no contract was read under Copilot itself. The guard refuses allow without that evidence and on any other profile; target workers declare false."
}
```

## WO-246-D015 — A checkout's fetch is one call, and the drive route keeps its own for now

```json
{
  "id": "WO-246-D015",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 1",
  "decision": "Round 1's criteria findings C4 and C5 and design findings D7, D9 and D10 are fixed, D1, D2 and D5 with them, and D8 and D11 are recorded. fetchIntoCheckout is the one call update --finish, the target close and the target publish make, so they cannot drift apart on the borrowing or the bound, and a test holds all three to it and to no direct fetchRemoteBranch. The default bound lives only there; beforeImport receives the bound in effect, which is how a test sees ten minutes without waiting them. The partial import is now pinned by the checkout's own object count. Not pinned: the two target refusal texts for a stall, because reaching them takes a ten-minute bound with no override on those commands; they are read, not run. REMOTE_READ_TIMEOUT_MS is the one 60-second read bound the helper and the drive share. publishRefusal carries its bare reason, so the helper no longer strips another module's prefix. D8 is deferred: the drive route's merged-base fetch keeps its plain lane and its cat-file read-first, because the order names three callers and a drive stop is a harder place to learn something new; the weaker held test is older than this order. D11 stays: the refusal prints the bound in hours and minutes, as the standing rule for operator-facing durations asks, beside the flag's raw value.",
  "evidence": [
    "Criteria report C4 and C5: load-time mutants of the import, the target callers and the default bound all passed the cases as they stood.",
    "scripts/test-drive.mjs 'a borrowing lane': a one-commit gap adds three to six objects to the checkout where a whole-history bundle would add twelve; fetchIntoCheckout reports 600,000 ms by default and 1,234 when asked; the three callers' sources name it and not fetchRemoteBranch.",
    "docs/evidence/WO-246/decisions.md#wo-246-d005: the comparison and its numbers."
  ],
  "rejected": [
    {
      "option": "An environment variable to shorten the bound in a test",
      "reason": "A hidden switch on a guard, to test a message."
    },
    {
      "option": "Move the drive route onto the borrowing fetch now",
      "reason": "A one-line change with its own read-first to reconcile in a route the order does not name; boarded instead."
    }
  ],
  "followup": "Move the drive route's merged-base fetch in scripts/lib/drive-route.mjs onto the borrowing lane: its plain lane downloads whole history under a five-minute bound and its read-first accepts a commit object whose history is not all present, where fetchRemoteBranch's own read-first requires it whole. With that caller moved, fetchRemoteBranch's alternates option has no caller that leaves it off and can go.",
  "reopenWhen": "A planning pass allocates the drive route's move, a drive stop names a stalled history fetch, or a stall's target refusal text is found wrong in use."
}
```

## WO-246-D016 — Round 1's other findings, recorded and not fixed

```json
{
  "id": "WO-246-D016",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 1",
  "decision": "Each stays as it is, with its reason. C7: a URL selector behind a boolean flag, such as gh pr view --web <url>, is refused; the rule that a URL after a flag is that flag's value also keeps gh pr comment 1 --body <url> from reaching the parent, and telling the two apart needs gh's flag table, so the false refusal, whose remedy works, is the cheaper error. C8: a flag value that looks like a repository flag, such as --body -R, admits; nobody writes it by accident, and the same flag table would be needed. C9: a cd or export in a subshell, or an unset, is not tracked; the reader has no scope for these and the forms are rare. GH_REPO=o/r bash -c 'gh pr list' and GH_REPO=o/r; export GH_REPO are refused with a remedy that works. C10 and the order's known issue: a function body, coproc, find -exec, sudo, gtimeout and the bounded wrapper are programs calling gh, unobserved. C12: copyright-style pictographs and unknown shortcodes pass as a gitmoji; the regular expression is WO-218's and the kit carries no gitmoji catalog. C13 and D12: plan target-publish keeps its docs: type by its documented contract, since its title is the commit's subject on a real target commit, and product 07 now says so; this differs from the draft route (D003), whose commit a reviewed one replaces. C14: commit messages on these branches are not linted, matching the order's 'title and body'; the kit's own commit-msg hook judges attribution as they are made. D6: a substitution between an assignment and its program loses the assignment, refusing GH_REPO=o/r A=$(x) gh pr list with a remedy that works. K6(b): the kit-guide procedure test keeps its raw push and gh pr create, because the order's non-goals leave that route to a session not using the helper and test-launchpad-update.mjs covers the helper. K7: the register rows this change touches are the final review's to dispose (product 07, followups --touching). Fixed beside these: K1, K2, K3, K4, K6(a) and K6(c), which D017 lists as expected data and write-backs.",
  "evidence": [
    "docs/control/local/reviews/WO-246/round-1-criteria.md, round-1-design.md and round-1-consistency.md."
  ],
  "rejected": [
    {
      "option": "Carry gh's flag table in the hook",
      "reason": "A table that drifts with every gh release, to refine two rare spellings."
    }
  ],
  "reopenWhen": "A session reaches a parent through one of these forms, or the false refusal costs a session more than its remedy."
}
```

## WO-246-D017 — Round 1's write-backs and expected-data updates

```json
{
  "id": "WO-246-D017",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 1",
  "decision": "The guide's sentence goes back to the words the kit-guide procedure test pins, 'reviews and merges with a merge commit, so main keeps the starter's history'; the pin is a contract and was the thing to preserve. docs/AI-HARNESS-SECURITY.md says nine refusals and names the gh clause, its auto-mode row names the two allow rules beside the release-close admission and links the labeled inference, and its settings row names them. ADR-0005 takes a dated amendment, since its WO-039 amendment says the emitter writes no allow grants. Product 07's finish sentence and the title bullet's exception are corrected. Expected-data update: scripts/test-plan-refutation.mjs's refusal text gains gh's own message, caused by D015's error text, and this order's own draft test's titles move to core's form, caused by D002.",
  "evidence": [
    "Consistency report K1, reproduced: the procedure test failed on that sentence and passes now under the bounded probe.",
    "git grep for the old count across the tree outside records finds no other surface."
  ],
  "rejected": [
    {
      "option": "Loosen the pin to the words after the comma",
      "reason": "Nothing about the guide needed the word it added; the sentence reads as well without it."
    }
  ],
  "reopenWhen": "A standing document that describes these routes is found to disagree."
}
```

## WO-246-D018 — Round 2's rechecks and what they changed

```json
{
  "id": "WO-246-D018",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 2",
  "decision": "Round 2's rechecks: of the 22 fixes rechecked, 19 held. Fixed here: C15 and C3's remainder (update --publish judges the provenance where the branch left main, and a checkout with no main is refused by name), C11, C16 and C17 (a github.com-work alias is github.com, and a remote on another forge offers gh no choice), and D9 (the two bounds' comments say what is true of the drive route). A refusal now needs both remotes on one host, or an alias that may be it, which narrows criterion 3's literal 'different repositories' to the order's own 'would silently reach the parent'; with origin on GitLab and upstream on GitHub the command is then admitted, since no fork is involved and gh can reach only the one forge. Recorded and not fixed, not admitted by the ladder's rule: scripts/test-drive.mjs's guard on the three callers reads them as text and the harness-fixtures row does not declare them, so an edit to only those files would not select it under changed-machinery selection, though a complete run does; and Copilot's allowEvidence names the decision that read Claude's pages, its caveat living in a source comment the manifest does not carry. D015 called the two target stall texts unrun; the round 2 criteria worker ran both with the bound set to 1 ms at load time, and each names the bound and the by-hand fetch, though no committed case does. A correction to D013, which said a branch with no commits past main is what carries no update: an unrelated commit on a stale branch passed that check.",
  "evidence": [
    "docs/control/local/reviews/WO-246/round-2-criteria.md, round-2-design.md and round-2-consistency.md. The consistency worker reviewed tree 36eadd62; its record's reviewedTree is later, because these fixes began before it was written.",
    "gh 2.98.0 offline, in the criteria worker's probes: origin on GitHub with upstream on GitLab reached origin; origin on GitLab with upstream on GitHub reached upstream; a dotted alias of the parent's name reached the parent.",
    "scripts/test-launchpad-update.mjs 'WO-246 update --publish': a stale branch refuses with and without a commit of its own, and an update cut before main moved publishes.",
    "scripts/test-harness.mjs 'WO-246 a fork's clone refuses': both alias forms name the right selector and are admitted when they name the parent, and an upstream on another forge is admitted."
  ],
  "rejected": [
    {
      "option": "Ask ssh -G what an alias resolves to",
      "reason": "A process per judged command, in a hook the order bounds to one read of the clone's configuration."
    },
    {
      "option": "Keep refusing across forges, as the criterion's words allow",
      "reason": "It refuses a correct read with a false reason; the refusal's purpose is the silent reach of a parent."
    }
  ],
  "reopenWhen": "A dotted alias that is not github.com-shaped reaches a parent, or a fork across forges appears."
}
```

## WO-246-D019 — Correction: the refusal fails closed on a host it cannot place

```json
{
  "id": "WO-246-D019",
  "date": "2026-11-05",
  "dispatch": "resume: next; review round 3 and the executor's judgment of its delta",
  "decision": "Round 3's admitted finding R1 is fixed by changing the rule rather than widening the alias pattern alone, because R1's cases are one instance of what the worker's note (f) showed more broadly: GitHub Enterprise with github.com, signed in to both, reached upstream while admitted. update --publish also refuses a branch whose kit commit main already names, which restores what round 2's tree did and closes the squash case the worker noted; and it refuses by name with no local main. Recorded and not fixed, past the ladder's end: a self-hosted GitLab or Gitea upstream is refused with a reason that overstates, 'gh would reach upstream', while gh would reach origin, and -R <origin> passes it, as the guide says; with origin on GitLab.com and upstream on GitHub the command is admitted and gh reaches upstream, the one direction the forge list leaves open, with no fork involved; x.acme.ghe.com, ftp:// and git@github.com:22/me/fork.git are spellings the hook does not read as a repository, and so admit; criss-cross history reports one merge base, and provenance moved back to an older commit passes, the hand edit D013 records; and the refusal text asks a branch main already merged to merge, which is true enough to act on. No reviewer ran on this delta, as the ladder ends at round 3; the executor judged it, with committed cases for each change and the bounded probes.",
  "evidence": [
    "docs/control/local/reviews/WO-246/round-3-combined.md: gh 2.98.0 offline reached the parent for github.com.work, github.com_work and github.com. origins, for gh.work with a stand-in ssh, and for GHES with github.com in both directions when signed in to both, each admitted at that tree.",
    "scripts/test-harness.mjs 'WO-246 a fork's clone refuses': every alias spelling names the github.com selector; gh.work and a dotted server refuse; the same owner and name under an alias admits; GitLab.com on either side admits; github.com-work as upstream refuses.",
    "scripts/test-launchpad-update.mjs 'WO-246 update --publish': a branch main already names refuses, and a checkout with no local main refuses by name, before any push."
  ],
  "rejected": [
    {
      "option": "Widen the alias pattern and keep the same-host rule",
      "reason": "It fixes R1's rows and leaves every other unrecognized host failing open, GitHub Enterprise among them."
    },
    {
      "option": "Read gh's hosts.yml to learn which servers it is signed in to",
      "reason": "A second read and a YAML parse per judged command, against a file whose format gh does not promise, to refine a false refusal whose remedy works."
    },
    {
      "option": "Refuse across every forge, as the criterion's words allow",
      "reason": "A public forge gh cannot address is known, and refusing there names a reach that cannot happen."
    }
  ],
  "reopenWhen": "A false refusal on a self-hosted forge costs a session more than its remedy, or gh gains a way to address one of the listed forges.",
  "kind": "correction",
  "misread": "D018 narrowed the refusal to remotes on one host, reasoning that a fork lives on its parent's host and that gh considers only the hosts it knows.",
  "meant": "A hook cannot read an SSH alias or which servers gh is signed in to, so a host it does not recognize says nothing about what gh will reach, and the two errors are not equal: a false refusal names a working remedy, while a silent reach of the parent is what this order exists to stop.",
  "changed": "The refusal fires whenever the two remotes' owner and name differ, unless a remote is on GitLab.com, Bitbucket or Codeberg, which gh cannot address. Every alias spelled from github.com is github.com, and any other alias or server with the same owner and name as its other remote is one repository. This restores criterion 3's literal 'different repositories', which D018 had narrowed."
}
```

## WO-246-D020 — The refusal's cost on the final tree

```json
{
  "id": "WO-246-D020",
  "date": "2026-11-05",
  "dispatch": "resume: next; step 10, after the passing complete run",
  "decision": "D007's measurement is repeated on the final tree, because the judgment moved and changed after it. The cost stands at one Git configuration read, about 6 ms: the emitted permissions hook, one process per call, median of 21, gh pr list 93.9 ms, gh pr list -R o/r 88.2, ls 88.1. These are read within this run. The host was quieter than for D007's before and after, whose 102 to 110 ms cannot be compared with these directly; D007 stands as the before.",
  "evidence": [
    "scratch hook-cost.mjs under the bounded probe, 2026-11-05, label final, at the tree of the passing complete run."
  ],
  "rejected": [
    {
      "option": "Rewrite D007's numbers",
      "reason": "A decision is a dated record; a later measurement is its own."
    }
  ],
  "reopenWhen": "The judgment gains a second read, or a hook's budget tightens."
}
```

## WO-246-D021 — Verification scope, evidence reuse and process corrections

```json
{
  "id": "WO-246-D021",
  "date": "2026-11-05",
  "dispatch": "resume: verify",
  "decision": "Independently judge the eight original criteria and every execution review round, preserve the implementation, and write VER-001. Consume the executor's complete review row only after checking its current code identity, review selection and empty unrun list; vary the fixtures with an independent commit-lint comparison, relocated document roots, nested working directories, paths containing spaces, linked worktrees and distinct repository hosts. No workers were needed or launched. The running Codex session reports gpt-6-astra at max, CLI 0.166.0, and that actual selection is attested without changing settings; it differs from the verifier's xhigh recommendation. This transport exposes no hard dollar-cap control, so a USD 5 cap is unenforced. Several initial status and source reads exceeded their output budgets, including a nested planning log; the canonical selected status, relevant source sections and verdict fields were reread in bounded selections, and full probe output stays in session scratch. No truncated output establishes a pass.",
  "evidence": [
    "npm run resume --silent -- status --json selected WO-246 in ready-to-verify; npm run resume -- verify allocated docs/verifications/WO-246/VER-001.md exactly once.",
    "scripts/lib/gate-reuse.mjs coveringGateCheck found the current passing review-selection npm test row recorded 2026-11-05T06:44:40.452Z: executed, identity and build output unchanged, 44 required suites, no unrun suite.",
    "docs/evidence/WO-246/verification-001-probes.mjs and verification-001.json contain the independent probes and bounded command results.",
    "All seven review records under docs/control/local/reviews/WO-246 were read for findings and rechecks; their dispositions are D012 through D019.",
    "The cited fork pass's two addenda and WO-218-D043 were read; docs/KIT.md is the guide selected after WO-245. The official gh set-default, Claude auto-mode and permissions pages were read on 2026-11-05."
  ],
  "rejected": [
    {
      "option": "NoOp: accept the executor's green handoff without independent probes",
      "reason": "A passing fixture does not establish behavior for supported variations; the host-identity probe exposed a criterion 3 miss."
    },
    {
      "option": "Rerun the complete review gate",
      "reason": "Its recorded row already matches this implementation. Focused reproductions and independent probes provide new evidence without repeating the complete run."
    },
    {
      "option": "Turn every recorded limitation into a blocking finding",
      "reason": "Blocking requires an unmet criterion or reproduced regression. The report retains the recorded boundaries and names the exact supported input for its one new blocker."
    }
  ],
  "reopenWhen": "Implementation bytes change, a gate row no longer covers them, or a supported input contradicts a carried criterion judgment."
}
```

## WO-246-D022 — Distinct repository hosts must remain part of identity

```json
{
  "id": "WO-246-D022",
  "date": "2026-11-05",
  "dispatch": "resume: verify",
  "decision": "Fail criterion 3 in VER-001 and route F1 to in-scope repair. ghChoosesUpstream compares only the last two selector components, so two HTTPS repositories on distinct hosts with the same owner and name are treated as one. The real permission evaluator, using the emitted permission configuration and pinned runtime files in a temporary clone, admits all four commands criterion 3 requires it to refuse. This is a repository-identity defect in the declared surface, not a request for broader shell parsing. No remote command was executed by that probe. D019's statement that any server with the same owner and name is one repository is not supported: owner and name do not establish host equivalence.",
  "evidence": [
    "docs/evidence/WO-246/verification-001-probes.mjs: repository identity keeps its host when owner and name coincide; docs/evidence/WO-246/verification-001.json records the four admissions and passing controls.",
    "Fixture origin https://github.enterprise.invalid/verification/project.git; upstream https://github.com/verification/project.git; no gh default and no selector in the judged command. These are synthetic public-format inputs, not an employer hostname or a real private repository.",
    "packages/skeleton/src/harness-host.ts ghChoosesUpstream: path(selector) takes only the final owner/name components. The ordinary different-repository control refuses, and same-repository and explicit-selector controls admit."
  ],
  "rejected": [
    {
      "option": "Pass because the existing same-owner alias fixture admits",
      "reason": "That fixture assumes equivalence for an arbitrary host. It cannot establish that two explicit HTTPS hosts name one repository, and criterion 3 names different repositories."
    },
    {
      "option": "Change the implementation during verification",
      "reason": "The verifier records evidence and the repair rule; it does not edit the implementation it judges."
    }
  ],
  "followup": "VER-001 F1, criterion 3: preserve canonical host as part of repository identity. Admit equivalent aliases only when the existing normalization establishes equivalence; otherwise require an explicit repository or gh default. Add end-to-end permission cases for the same owner/name on distinct HTTPS hosts, retain the ordinary same-repository and explicit-selector controls, and reconcile D019's identity assertion through a new correction record.",
  "reopenWhen": "A repaired permission evaluator refuses the four recorded commands for distinct hosts while preserving the supported equivalent-host, explicit-selector and default-repository admissions."
}
```

## WO-246-D023 — Verification collection failures and their disposition

```json
{
  "id": "WO-246-D023",
  "date": "2026-11-05",
  "dispatch": "resume: verify",
  "decision": "Record two collection failures without changing the product verdict. npm run meta succeeded, but its broad metrics output exceeded the tool output budget; the generated decisions index and follow-up rows, not that truncated display, establish the refresh. Subsequent metadata output is redirected to session scratch and only relevant results are read. The first small usage-display command had an extra closing brace and failed to parse after the usage command had already written its JSON receipt; the corrected read of that same receipt succeeded. The report uses the saved counter's explicit cutoff, not an invented current total.",
  "evidence": [
    "npm run meta exited 0 at the 2026-11-05T07:05:06.458Z observation cutoff; docs/lineage/decisions-index.md includes D021 and D022 and docs/planning/followups.json includes D022's repair rule.",
    "The failed display reported SyntaxError: Unexpected token '}'. The corrected read reports 4,784,255 total tokens, source codex-transcript-counter, dispatch scope, cutoff 2026-11-05T07:05:03.235Z."
  ],
  "rejected": [
    {
      "option": "Treat truncated metadata output or a failed display as verification evidence",
      "reason": "Neither establishes a product result; generated records and the saved structured counter are the checked sources."
    }
  ],
  "reopenWhen": "The generated records are stale or a later counter supersedes the report-preparation cutoff; final counters belong in the ignored receipt and response."
}
```

## WO-246-D024 — Correction: a repository is its host, its owner and its name

```json
{
  "id": "WO-246-D024",
  "date": "2026-11-05",
  "dispatch": "resume: fix; VER-001 F1",
  "decision": "F1 is repaired as the class it names, not as its one pair. The rule the repaired code holds: two remotes are one repository only when their canonical host, owner and name all match, case aside. A host's canonical form comes only from what its spelling establishes: apart from case, a trailing dot and a leading www., a name under github.com is github.com and a name under a ghe.com tenant is that tenant, as gh's own rules read them, and over SSH alone an alias spelled from github.com with a hyphen or underscore, which public DNS cannot serve, is github.com. Every other host counts as its own server, because the hook reads neither an SSH configuration nor which servers gh is signed in to. gh ranks upstream first among the remotes on hosts it knows and drops a remote it cannot read as a repository, so the refusal fires whenever upstream is another repository gh can address, wherever origin is and whatever it names; an upstream on GitLab.com, Bitbucket or Codeberg, or one gh cannot read as a repository, is admitted, since gh cannot reach it. Beyond the report's pair and its reverse this closes two servers neither of which is github.com, two ghe.com tenants, a dotless HTTPS host, HTTPS lookalikes the old fold pressed into github.com, every SSH name the hook cannot place, two different dotless aliases, and two cases D019 recorded and left open, which gh reaches silently: an origin on one of those forges with a GitHub upstream, which is the same owner and name on distinct HTTPS hosts, and an origin gh cannot read as a repository, such as a GitLab subgroup, an Azure DevOps path, a local path, a file or ftp URL or git@github.com:22/me/fork.git. No spelling can establish that either is upstream's repository. A clone with only an upstream remote stays admitted, as criterion 3 says of one remote. The refusal now names each remote by host in its reason, and its -R remedy says where gh takes an owner and name alone, because a remedy that drops the host can reach the parent it was meant to avoid. Where gh cannot address origin the refusal names only what works, -R <upstream>, because there -R <origin> and gh repo set-default origin both fail. Criterion 3's fixture names an origin gh can address, and there the refusal still names -R <origin>. The judgment still costs one Git configuration read. Expected-data updates in scripts/test-harness.mjs, each caused by this correction of a rule the old expectation encoded: git@github.com.work names itself rather than github.com in the refusal, since a dotted name can be a real server; git@github-work and git@gh.work with the parent's own owner and name move from admitted to refused, since no spelling tells either from an alias of another server; and a GitLab.com origin with a GitHub upstream moves from admitted to refused. Recorded and not fixed: a remote is read as written, before url.<base>.insteadOf, so a rewritten remote can refuse falsely, while identical raw URLs rewrite identically; an alias spelled from github.com that is in fact another server is read as github.com, the one equivalence taken on the name; a name under github.localhost, a development host, counts as its own server; and with origin on a server gh is not signed in to, gh refuses set-default origin the same way while -R <origin> still reaches that server. D019's other recorded limits stand.",
  "evidence": [
    "docs/evidence/WO-246/verification-001-probes.mjs under the bounded wrapper: exit 1 with all four commands admitted before this repair, exit 0 after it with all four refused, its same-repository and explicit-selector controls and its other three groups passing.",
    "gh 2.98.0 offline, scratch gh-identity-probe.mjs under the bounded wrapper, 2026-11-05: a refused proxy, invented tokens for eight hosts, a temporary home and a stand-in ssh, reading where gh pr list sent its request. The report's pair reached api.github.com, its reverse github.enterprise.invalid and two enterprise servers ghes-b.invalid, each the upstream; origins at https://ghes/, https://github.com.evil.invalid/ and https://github.com-work/ each reached the upstream on api.github.com; a GitLab.com origin with a GitHub upstream reached GitHub under one name and under two; a GitHub origin with a GitLab.com upstream reached origin; a port on one server reached that server.",
    "gh 2.98.0 offline, scratch gh-remedy-probe.mjs, the same way: -R github.enterprise.invalid/verification/project posted to that server and -R github.com/verification/project to api.github.com; -R with an owner and name alone posted to api.github.com even with the stand-in ssh mapping origin's alias to another server; gh repo set-default origin was refused with 'given arg is not a valid repo or git remote' for an origin on GitLab.com and on a server gh was not signed in to, and was accepted as a form for a signed-in server and for an alias, then made its first request to api.github.com. Whether it succeeds across two servers is unobserved.",
    "Public source read 2026-11-05 through a web-fetch worker, trunk with no commit on the pages: cli/cli context/remote.go ranks upstream 3, github 2, origin 1 and FilterByHosts keeps remotes on known hosts; context/context.go BaseRepo takes the first remote when it cannot prompt; pkg/cmd/factory/remote_resolver.go always adds github.com to the known hosts; internal/ghrepo/repo.go lowercases a host and strips a leading www., and FromURL reads Hostname(), without its port; git/url.go reads scp-like syntax as ssh; cli/go-gh pkg/auth/auth.go NormalizeHostname folds a name under github.com to github.com and a.b.ghe.com to b.ghe.com. None handles a trailing dot; that fold is DNS's reading of an absolute name, and R1's case.",
    "gh 2.98.0 offline, scratch gh-unreadable-probe.mjs, the same way: a GitLab subgroup, an Azure DevOps path, a local path, a file URL, git@github.com:22/me/fork.git and an ftp URL as origin each reached the upstream on api.github.com; a GitLab subgroup and a local path as upstream each reached origin; an upstream with no origin remote reached that upstream.",
    "scripts/test-harness.mjs 'WO-246 a fork's clone refuses': the report's pair refuses its four commands naming both hosts and admits -R, --repo, GH_REPO=, a URL selector and a set default; 14 pairs on distinct servers refuse naming their selectors; 8 pairs whose origin gh cannot address refuse naming -R <upstream> alone, with no token echoed; 12 equivalent spellings and 6 upstreams gh cannot reach admit. Scratch old-rule-sensitivity.mjs: the replaced comparison admitted all 22 of those refused pairs, so each case fails against it.",
    "Scratch hook-cost.mjs under the bounded wrapper, this checkout's emitted hook, one process per call, median of 21, judging temporary clones by the payload's cwd: ls 117.6 ms and gh pr list -R o/r 117.6 ms with no read; gh pr list read and admitted 124.6 ms with one remote and 125.2 ms with two remotes naming one repository; refused 93.7 ms, since a refusal stops early. One read, about 7 ms, as D007 and D020 found."
  ],
  "rejected": [
    {
      "option": "Compare the host only when both remotes spell one, keeping the hostless fold of a dotless alias",
      "reason": "git@ghes:o/n with git@github.com:o/n stays admitted and gh reaches upstream: the same class over SSH, which a repair of the HTTPS pair alone would leave open."
    },
    {
      "option": "Keep the fold of every name beginning github.com",
      "reason": "It reads https://github.com.evil.invalid and https://github.com-work as github.com. An HTTPS host cannot be an SSH alias, and a dotted name can be a server."
    },
    {
      "option": "Keep git@github-work with the parent's name admitted as a supported alias",
      "reason": "No spelling tells it from an alias of another server, and gh, which does read the alias, reaches upstream if it is one. The admission rested on the assumption F1 disproves; a false refusal has -R as its remedy."
    },
    {
      "option": "Run ssh -G or read gh's hosts.yml to place the host",
      "reason": "D018 and D019 rejected each as a cost per judged command, and neither has changed; the refusal's remedy stays cheaper than either."
    },
    {
      "option": "Leave a GitLab.com origin with a GitHub upstream admitted, as D018 and D019 did",
      "reason": "Their own probes and this one show gh reaching upstream there. 'No fork is involved' does not stop a pull request opening on the parent, and the pair is the same owner and name on distinct HTTPS hosts."
    },
    {
      "option": "Apply url.<base>.insteadOf in the judged read",
      "reason": "Identical raw URLs rewrite identically, so the plain case admits nothing wrongly, and a false refusal has its remedy; the rewrite parse would serve a spelling nobody has reported."
    },
    {
      "option": "Leave an origin gh cannot read admitted, as naming no repository (D006, D012)",
      "reason": "gh drops it and reaches upstream in all six spellings probed. A GitLab subgroup is a different repository on any plain reading, and it would be admitted beside the flat GitLab path this repair refuses."
    },
    {
      "option": "Keep naming -R <origin> where gh cannot address origin, as criterion 3's words do",
      "reason": "That remedy cannot work: gh refused set-default origin there with 'given arg is not a valid repo or git remote' and sent -R gitlab.com/... to gitlab.com's API. A subgroup or a local path has no selector to name at all."
    }
  ],
  "reopenWhen": "A false refusal on an SSH alias or an unreadable origin costs a session more than naming the repository; a session reaches a parent through a host this reads as one, such as a github.com-work that is another server; or gh changes its remote ranking or hostname rules.",
  "kind": "correction",
  "misread": "D019 said any other alias or server with the same owner and name as its other remote is one repository, and its code compared only the last two parts of each selector. D012 had read a hostless selector as the same repository as any hosted one. D006 and D012 said a remote that names no GitHub repository leaves gh nothing to choose, which is true of an upstream and false of an origin: gh drops it and reaches upstream. D018 and D019 also left a GitLab.com origin's reach of a GitHub upstream admitted because no fork was involved.",
  "meant": "Owner and name do not establish a host. Equivalence comes only from what a host's spelling establishes, and an origin gh cannot read establishes nothing, and D019's own reasoning applies to identity too: a false refusal names a working remedy, while a silent reach of the parent is what this order exists to stop. VER-001 F1 and WO-246-D022 hold the finding and its repair rule.",
  "changed": "remoteHost canonicalizes a host and folds an alias only over SSH; remoteRepository returns a qualified name, which is the identity, beside the selector -R can name; ghChoosesUpstream compares the qualified names, counts an origin gh cannot read as another repository and exempts an upstream gh cannot reach; ghForkRefusal names each remote by host, says where an owner and name alone reach and offers only what works where gh cannot address origin. docs/KIT.md §Hooks states the rule."
}
```

## WO-246-D025 — Correction: repair review round 1, and what it changed

```json
{
  "id": "WO-246-D025",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair review round 1",
  "decision": "Round 1 of the repair found 19, 2 of them blocking; 12 are fixed and 7 recorded. Fixed. C1, blocking, a regression this order introduced: the pull-request title lint admits a shortcode gitmoji while hasAiAttribution read only a Unicode prefix, so ':robot: Generated with Claude Code' published; the predicate now judges each line past any leading gitmoji in either form, and every door gains it, because it is one predicate. W1, blocking: remoteHost's alias fold had no end anchor, so github.com-work.evil.invalid folded to github.com; it now takes no further dot, which is what D024's reason, 'which public DNS cannot serve', always required. C2: an empty -R or --repo names nothing, and gh reached the parent; it is now refused, as an empty GH_REPO was. C3: gh repo set-default origin fails when the remotes are on two servers, so the refusal offers it only on one. D1: an owner and name alone reach gh's default host whatever server an alias is, so on the parent's own name -R could reach the parent while the session meant origin; the remedy now says what to do then, and selectors differing only in case count as one. C5: the bound applied to the read and the fetch separately, so a fetch could run to about twice it, twenty minutes at the default against the nineteen-minute stall that set it; they now share one deadline, and a refusal names the bound as asked. D2: the guard keeping the three callers on fetchIntoCheckout sat in a machinery suite whose declared sources exclude them, so an edit to one of them alone would not run it under npm test -- --review; it moved to the launchpad suite, which that gate always runs. D6's smallest part: ghCanAddress names the one idea tested twice. D7: the guide's bullet states what is refused, what admits it and the host rule in a sentence, leaving the spellings to the code. W2 and C7: product 07 names the -R <upstream> exception and links D024. W3: the guide spells gh repo set-default origin, since the bare form fails with no terminal. W4 is the handoff this repair writes at its step 9. C1's fix edits packages/compiler/src/attribution.mjs, a judged feedback source, which the order's Cost said it would not, so the repair owes and ran one live feedback episode, as product 07 says a repair that edits a judged source does: docs/evidence/WO-246/feedback-002. Recorded and not fixed: D3, in a moved session directory with an unreadable clone the session receives the generic runtime advisory rather than the gh one, still one advisory and still admitted; D4, the helper hand-writes a comparison pushUrl can make, a tidier message and no behavior; D5, create-then-adopt exists in the helper and the target publish, which this order's non-goals keep apart; D6's module split, 240 lines that would test in process, an ordinary later refactor; D8, small simplifications in update --finish; and a reviewer's observation that plan publish accepts an empty body file, which no criterion names and the operator reads before merging. Also recorded, from round 2: C8, admitted as a change to a behavior main had, a gitmoji before a key such as user-session: now refuses where main admitted it; the same line without the gitmoji is already refused on main, so this is the fix's own rule that a gitmoji changes nothing about what a line says, and a sweep of 3,604 commit messages found none affected. C4 is D026 and C6 is D027. Two reviewers ran git write-tree against the brief, which may have added an unreferenced tree object that moves no ref, and one tried a test-runner listing that the hook refused; none changed the checkout, and git gc prunes the object.",
  "evidence": [
    "docs/control/local/reviews/WO-246/repair-1/round-1-criteria.md, round-1-design.md and round-1-consistency.md, all at reviewed tree 5e927aaa.",
    "gh 2.98.0 offline in those reports: --repo=, -R '' and --repo '' each sent the request to the parent; gh repo set-default origin across two servers exited 1, 'does not correspond to any git remotes', with a local stand-in on gh's plain-HTTP development host, one direction only since the stand-in serves only that side, and a control on one server exited 0.",
    "scripts/test-harness.mjs 'WO-246 a fork's clone refuses': 15 pairs on distinct servers refuse naming their selectors without set-default; 8 origins gh cannot address refuse naming -R <upstream> alone; the empty flags refuse; the dotted alias spellings refuse in both the same-name and differing-name forms; the alias remedy says what to do on another server. scripts/test-plan-refutation.mjs 'WO-246 plan publish': shortcode attribution in a title and in a body footer refuses before any push. scripts/test-launchpad-update.mjs 'WO-246 update --publish': the shortcode footer refuses the same way, through the same helper. packages/compiler/test/feedback.test.ts 'WO-011 exact attribution predicate': gitmoji in either form and any number hide no attribution, and ordinary subjects and human coauthors still pass.",
    "scripts/test-launchpad-update.mjs 'WO-226 update finish': with a four-second read and a stalled fetch under --fetch-timeout 6 the refusal arrives inside nine seconds and the checkout is unchanged. Scratch old-bound-check.mjs, the two shapes side by side: 6,003 ms with the shared deadline and 10,018 ms with a bound on each call.",
    "scripts/test-runner.mjs machinerySources['harness-fixtures'] 288 onward lists neither launchpad.mjs, target-publish.mjs nor target-worktree-close.mjs, and node scripts/test-runner.mjs --review --list --selected lists harness-fixtures among the machinery this tree's own changes selected; the launchpad row is a product suite, which --review always selects.",
    "The live feedback episode: DOTLN_LIVE_WORKERS=1 node scripts/harness.mjs bounded -- node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo246-r002 --transport claude-cli-print --model claude-opus-5-5 --effort xhigh, 2026-11-05 11:46:12Z to 11:46:46Z, exit 0, ten fixtures; recorded with --record-selfhost into docs/evidence/WO-246/feedback-002 and its --check green. Product 07 §Discipline: 'a repair that edits a judged source again runs another the same way'."
  ],
  "rejected": [
    {
      "option": "Wrap the predicate at each door to avoid a live episode",
      "reason": "Seven call sites would each need the wrapper and the commit-msg hook would keep the gap, to save an episode that takes about a minute. WO-254-D022 recorded 34 seconds, and this one took 34."
    },
    {
      "option": "Stand on the ladder's 'a false refusal has a working remedy' for gh repo set-default origin",
      "reason": "A remedy that fails is not a working one; -R works in every case the refusal fires for, so the message loses nothing."
    },
    {
      "option": "Make the alias's selector host-qualified, so -R cannot reach the parent",
      "reason": "gh cannot address an alias, so the first remedy would fail for the common case of an alias of github.com; the note keeps it working there and says what to do otherwise."
    }
  ],
  "reopenWhen": "A commit-msg or publication refusal fires on ordinary text after a gitmoji; or the two target stall texts or the shared deadline refuse a fetch that a separate bound would have finished, with evidence that the bound is the cause.",
  "kind": "correction",
  "misread": "D024 justified its fold by what public DNS cannot serve while the code took any name beginning github.com- or github.com_. D018 said a complete run runs the callers' guard; the guard's row is machinery, so neither npm test nor npm test -- --review selected it unless one of the row's declared sources changed, and only --machinery or --only always ran it. The order's Cost said no judged feedback source changes; C1's fix is one. REMOTE_FETCH_TIMEOUT_MS's comment said the read was included while each call took a fresh bound.",
  "meant": "The fold rests on the name being unservable, so a further dot ends it. The guard belongs in a suite the gate always selects. The bound is one budget over the read and the fetch.",
  "changed": "packages/compiler/src/attribution.mjs, packages/skeleton/src/harness-host.ts, scripts/lib/github-repository.mjs, scripts/test-launchpad-update.mjs, scripts/test-drive.mjs, scripts/test-harness.mjs, scripts/test-plan-refutation.mjs, packages/compiler/test/feedback.test.ts, docs/KIT.md, docs/product/07-execution-guide.md and docs/evidence/WO-246/feedback-002."
}
```

## WO-246-D026 — A remote named github or a differently cased upstream stays outside the refusal

```json
{
  "id": "WO-246-D026",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair review round 1, C4",
  "decision": "Recorded and boarded, not fixed. gh ranks remotes upstream, then github, then origin, matching the name case-insensitively, so origin with a remote named github, or with one named Upstream, reaches that remote silently, while the hook reads only origin and upstream exactly. Criterion 3 and D012 keep the refusal to those two names, so this meets no criterion; it is the silent reach the order's objective names, on a spelling the fork has not reported.",
  "evidence": [
    "docs/control/local/reviews/WO-246/repair-1/round-1-criteria.md C4: origin https://github.com/me/fork.git with a remote named github at https://github.com/par/parent.git, no upstream, no default: the hook admits gh pr list and gh 2.98.0 offline requests par/parent.",
    "cli/cli context/remote.go remoteNameSortScore, read 2026-11-05 through a web-fetch worker: upstream 3, github 2, origin 1, otherwise 0, on strings.ToLower(name)."
  ],
  "rejected": [
    {
      "option": "Widen the judgment to every remote in this repair",
      "reason": "It changes which clones refuse, past the order's words and D012's recorded scope, for a case no fork has met, and would need its own criteria and its own review."
    }
  ],
  "followup": "Extend the gh repository judgment to the remote gh ranks first, so a remote named github or a differently cased upstream is refused as upstream is. Paths: packages/skeleton/src/harness-host.ts ghUnsetFork, scripts/test-harness.mjs. Checks: a clone with origin and a remote named github refuses and names both; origin with an unranked remote stays admitted.",
  "reopenWhen": "A session reaches a parent through a remote named github, or a fork reports such a remote."
}
```

## WO-246-D027 — A fork on an SSH alias cannot use the publish helper

```json
{
  "id": "WO-246-D027",
  "date": "2026-11-05",
  "dispatch": "resume: fix; repair review round 1, C6",
  "decision": "Recorded and boarded, not fixed. The hook reads git@github.com-work:me/fork.git as github.com, while parseGitHubTarget, the binding the publish helper shares with the target publish, reads github.com-work as the host, so ensureGh asks gh about a server it has no login for and plan publish and update --publish refuse before any push with an authentication message the session cannot satisfy. The refusal is loud and pushes nothing. The order's fixtures use a plain GitHub-shaped origin, and criterion 2 is met on them. The target publish has the same binding, so a fix belongs in the shared parse and needs that route's review.",
  "evidence": [
    "docs/control/local/reviews/WO-246/repair-1/round-1-criteria.md C6: parseGitHubTarget returns host github.com-work and selector github.com-work/me/fork; gh auth status --hostname github.com-work exits 1 with 'You are not logged into any accounts on github.com-work'. That report's end-to-end run does not separate the case, because its control refused the same way on an invented token."
  ],
  "rejected": [
    {
      "option": "Fold the alias in parseGitHubTarget in this repair",
      "reason": "It changes what a registered target's publish binds to and proves, which this order's non-goals keep out, and a wrong fold there would push to the wrong repository."
    }
  ],
  "followup": "Let the publish binding read an SSH alias of github.com as github.com, so a fork on github.com-work can use plan publish and update --publish, and name the alias in the refusal until then. Paths: scripts/lib/github-repository.mjs parseGitHubTarget and ensureGh, scripts/lib/target-publish.mjs. Checks: a fixture origin on an alias publishes against the rewritten bare repository; a registered target's binding stays exact.",
  "reopenWhen": "A fork on an SSH alias reports the helper's refusal, or the target publish's binding changes."
}
```

## WO-246-D028 — Re-verification judges the repaired identity and its adjacent changes

```json
{
  "id": "WO-246-D028",
  "date": "2026-11-05",
  "dispatch": "resume: verify; VER-002",
  "decision": "Re-derive criteria 2, 3 and 5 because the repair changes attribution, repository identity and the shared read/fetch deadline; reproduce VER-001 F1 and carry untouched claims only with their original evidence and the current complete review row. All independently executed probes pass. The current source identity matches the executor's passing review row, so consume that row and run the document gate after the final report edit. No implementation or host setting is changed. No worker is needed for a claim this verifier cannot run. The traps are accepting old evidence for changed code, mistaking a recorded non-criterion limitation for a blocker, and repeating an expensive complete run without an identity change; the selected probes and identity check address each. NoOp, accepting the repair without independent probes, would leave the dispatch's verification duty undone.",
  "evidence": [
    "docs/evidence/WO-246/verification-002.json: current code identity 45cb66bd2092a9b7732c244e148c09f6f8e68006fef6d298df3dddb0178973c2 matches the executed, passing complete review row of 2026-11-05T12:37:20.449Z; 44 successful cases, no unrun suite, identity and build output unchanged.",
    "VER-001's committed reproduction now exits 0: four cross-host refusals and all controls pass, as do its 1920 commit-lint comparisons, nested planning publication and linked-worktree fetch variations.",
    "Seven focused tests pass, including both publish doors, the fork judgment, emitted settings, exact attribution predicate, borrowing lane and update finish.",
    "docs/evidence/WO-246/verification-002-probes.mjs exits 0: 84 judgments over 12 repository pairs, 162 attribution comparisons, five emitted commit-message-hook cases, and a shared deadline preserving checkout refs, HEAD, objects and working bytes.",
    "harness check reports 42 generated surfaces; format:check passes; the planner roots each measure 29643 bytes against 24576, the existing D009/D011 follow-up; feedback-evidence --check binds feedback-002 to current source; publication:check passes.",
    "Both execution and repair review ladders were read with their dispositions. D024/D025 correct the failed identity rule and the repair's two blocking findings. D026/D027 retain the alternate-remote and publication-alias follow-ups. C8's prefixed session keys are already prohibited without their prefix by the pre-order predicate: normalization deliberately carries that rule through a gitmoji, while ordinary subjects and human coauthors pass the independent controls. No separate contract admitting a decorated session key was found in the cited no-attribution rule.",
    "Process collection failures and corrections are recorded in verification-002.json: overlarge status/file reads and a gate-row spread produced truncated output; verdict-relevant fields and sections were reread, full gate output retained in scratch, and an explicit field allowlist replaced the spread. Searches for two absent gate modules were corrected by following the actual imports. A failed targeted web lookup supplies no new host claim. These failures are not test evidence."
  ],
  "rejected": [
    {
      "option": "Run another complete review gate",
      "reason": "The current identity already has a passing complete review row. Independent changed-path probes establish the repair without repeating its 0 h 38 min gate."
    },
    {
      "option": "Change implementation or widen the refusal to every gh remote during verification",
      "reason": "This is a read-only product judgment. D026 and D027 already board those limitations, and the original criteria do not require those new behaviors."
    }
  ],
  "reopenWhen": "A supported input reproduces a criterion failure or a regression beyond the deliberate enforcement change; the product identity changes; a recorded limitation occurs in ordinary use; or a live host contradicts the still-unobserved helper-rule inference."
}
```

## WO-246-D029 — Final review accepts the repaired subject on its own reproductions and the standing complete row

```json
{
  "id": "WO-246-D029",
  "date": "2026-11-05",
  "dispatch": "resume: final review",
  "decision": "Accept the repaired subject and start no complete run. Integration took in nothing, so the code under review is the code VER-002 judged, and its passing complete review row stands at the current code identity. The reviewer did not take the two verifications on their word: it reproduced VER-001's blocker with the committed probe, ran VER-002's probe and the seven focused cases, read the whole source diff and every changed standing document, and ran the checks criteria 4, 7 and 8 name. Three traps were named before choosing. First, passing on the reports alone: answered by the reproductions and the read. Second, a source edit after the passing run, which would move the code identity and owe a fresh complete run of about 0 h 38 min and, in the attribution predicate, a third live feedback episode: so the one defect the read found is boarded in D030, not fixed. Third, reopening review with fresh workers after the run the ladders ended before: no worker was launched, because the reviewer could read the diff and run every claim itself. The NoOp, recording the pass with no reproduction, would leave the acceptance duty undone. The reviewed change is committed as three coherent parts: the starter's v0.116.0 refresh receipt the worktree carried from main, the implementation with its tests, standing documents and generated surfaces, and the order's records. The implementation is one commit because its emitted hooks, manifest, role oracle and evidence editions are generated from the combined source, so a commit holding only one of its parts would fail harness check, and the doors and the fetch bound share files that whole-file staging cannot divide.",
  "evidence": [
    "npm run worktree -- integrate WO-246 on 2026-11-05: 'Integration took in nothing: the worktree is not behind main.' After git fetch origin main, origin/main, main, HEAD and their merge base all read bdf3084946978cd9cc9e3e9b17d36c499ffab6aa.",
    "scripts/lib/gate-reuse.mjs coveringGateCheck(root, 'npm test', []) read through a scratch script with a field allowlist: code identity 45cb66bd2092a9b7732c244e148c09f6f8e68006fef6d298df3dddb0178973c2, the worktree's row recorded 2026-11-05T12:37:20.449Z, review selection, exit 0, executed, 44 required suites, none unrun, 44 cases with no failure, identity and build output unchanged, no displaced task.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-246/verification-001-probes.mjs: exit 0, five observations pass, the cross-host matrix refusing gh pr list, gh pr create --title x, gh issue list and gh pr view 1 with its three controls holding. The same wrapper over verification-002-probes.mjs: exit 0, three observations pass.",
    "node scripts/harness.mjs bounded -- node --test --test-concurrency=1 --test-name-pattern='WO-246|WO-226 update finish|a borrowing lane|WO-011 exact attribution' over scripts/test-harness.mjs, test-plan-refutation.mjs, test-launchpad-update.mjs, test-drive.mjs and the compiled feedback test: 7 tests, 7 pass, 0 h 1 min.",
    "node scripts/harness.mjs check: 42 generated surfaces. node scripts/harness-context.mjs: the planner root measures 29,643 bytes against 24,576 on both skill roots, delta 359. npm run publication:check: every check passes. git diff --check: clean. git diff over the four package.json files and package-lock.json: only @dotln/compiler 0.39.0 to 0.40.0 and @dotln/skeleton 0.83.0 to 0.84.0 and their pins.",
    ".claude/hooks/permissions.mjs: an open operator override returns its message before the evaluator is imported, so the new refusal's closing 'Use operator override: for authorized recovery' is true of it.",
    "git diff HEAD over docs/KIT.md, docs/product/07-execution-guide.md, docs/product/03-architecture.md, docs/AI-HARNESS-SECURITY.md and docs/PLAYBOOK.md: each change replaces or extends the passage that states the rule; none adds a dated account under a standing heading. ADR-0005's dated line sits in its Amendments section, the record that section exists for."
  ],
  "rejected": [
    {
      "option": "Run npm test -- --review again for the final review",
      "reason": "The current code identity already holds a passing complete review row, and the rule is to reuse it; a second run would add 0 h 38 min and test nothing new."
    },
    {
      "option": "Launch review workers over the whole diff",
      "reason": "The execution and repair ladders ran their rounds over this diff and two verifications probed it; what remained was acceptance, which the reviewer's own read and reproductions discharge at a fraction of the cost."
    },
    {
      "option": "Split the implementation into a commit per part",
      "reason": "The generated surfaces bind the combined source and the parts share files, so the intermediate commits would not pass their own checks; the pull request's body and the decisions describe the parts instead."
    }
  ],
  "reopenWhen": "The code identity changes before publication, the complete row is displaced, or a supported input reproduces a criterion failure."
}
```

## WO-246-D030 — Final review F1: the attribution pattern holds invisible characters

```json
{
  "id": "WO-246-D030",
  "date": "2026-11-05",
  "dispatch": "resume: final review; reading the repair's source diff",
  "decision": "Recorded and boarded, not fixed. LEADING_GITMOJI in packages/compiler/src/attribution.mjs, which the repair added, holds a literal U+FE0F twice and a literal U+200D once, where scripts/lib/outward-lint.mjs spells the same gitmoji pattern with \\uFE0F and \\u200D escapes. The characters cannot be seen in an editor or a diff, so a later edit or a tool that normalizes text can drop or double one with nothing to show for it, and the two spellings of one pattern can drift apart unseen. The behavior is correct today: the cases with a variation selector and with a joined sequence refuse. It fails no criterion and breaks no behavior main had, so by rule it is a follow-up; it was in the verified subject and inside verification's review of the repair diff, so its class is escape. Fixing it here would edit a judged feedback source after the passing complete run: a new code identity, a fresh complete run of about 0 h 38 min and a third live feedback episode, to change no behavior.",
  "evidence": [
    "A scratch read of the LEADING_GITMOJI line's characters above U+007E, 2026-11-05: U+FE0F, U+200D, U+FE0F. The same read of the file at the merge base bdf30849: ASCII only.",
    "scripts/lib/outward-lint.mjs, the pr-title and commit branch: the pattern there is written with \\uFE0F and \\u200D.",
    "packages/compiler/test/feedback.test.ts 'WO-011 exact attribution predicate': a line opening with a recycling symbol and its variation selector and one opening with a joined technologist emoji both refuse, in the reviewer's focused run of 7 passing tests (D029)."
  ],
  "rejected": [
    {
      "option": "Replace the three characters with escapes in this review",
      "reason": "A source edit to a judged feedback source after the passing complete run costs a complete run and a live episode for no change in behavior; the next edit of the file owes that episode anyway."
    }
  ],
  "followup": "Spell the variation selector and the zero-width joiner in LEADING_GITMOJI (packages/compiler/src/attribution.mjs) as \\uFE0F and \\u200D escapes, as scripts/lib/outward-lint.mjs does, or share one gitmoji pattern between the two; the next order that edits attribution.mjs takes it with the live feedback episode that edit already owes. Checks: the file holds no character above U+007E, and packages/compiler/test/feedback.test.ts 'WO-011 exact attribution predicate' passes unchanged.",
  "reopenWhen": "The next order editing packages/compiler/src/attribution.mjs, or an attribution case with a variation selector or a joined emoji stops refusing."
}
```

## WO-246-D031 — Final review: the matched follow-up rows whose conditions this order met

```json
{
  "id": "WO-246-D031",
  "date": "2026-11-05",
  "dispatch": "resume: final review; npm run plan -- followups --touching --work-order WO-246",
  "decision": "Dispose the listed rows whose reopening condition this change met and leave the rows it only matched as they are. Settled: FUP-97b67590057d75b4, VER-001's repair rule from D022, which D024 and D025 carried out, VER-002 judged repaired and this review reproduced. Deferred again with the condition named: FUP-1b94e79e02e54e70, because this order edits scripts/lib/outward-lint.mjs and scripts/lib/target-publish.mjs and leaves the malformed private list's refusal unlocated, a refusal the new publish helper now shares; FUP-eed385be08e5bdd9, because the role oracle is re-minted as wo246-role-baseline.json and the chain in scripts/test-gate-followups.mjs grows, with the retained inequality's meaning left to the next order that touches it; and FUP-957602bc42e32e1d, FUP-89b7b9f657765e83, FUP-8dd0eb609946b9d1, FUP-916e24773df0b734 and FUP-e08668268dea62b1, because D009 and D011's reviewed rules changed the measured overrun again, 140 bytes on every root and 359 on the planner's, and the optimization for every role is boarded under this order's FUP-8b1f9bcc240a1483. Left as matched: the other 25 rows. Among them FUP-ac86ee429dee2947 waits for a planning allocation alone; FUP-770baf2f452c669e and FUP-848fd8e2ac941bc3 name the planner root's entropy sentence and harnessPromptLine, which this order does not edit; FUP-589642d0e0c714c8 and the three WO-236 rows name functions this order does not touch; and the order's own FUP-8b1f9bcc240a1483 and FUP-9b6d69455e1ca796 keep their executor deferrals while FUP-b946c5a767a65862, FUP-1b6dd806a8985632 and the row D030 mints wait for the next planning pass to triage.",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-246 on 2026-11-05, read through every page before these decisions were recorded: pending 256, matched 33; --show for FUP-1b94e79e02e54e70, FUP-eed385be08e5bdd9, FUP-89b7b9f657765e83, FUP-97b67590057d75b4 and FUP-941fd291e0fd1033. The applied dispositions carry this decision's anchor and the register's revision at the batch.",
    "scripts/lib/outward-lint.mjs: the local-terms.configuration finding carries a null span, and scripts/lib/launchpad-publish.mjs prints each finding with its line only when a span exists, so the helper's refusal for a malformed list names no line either.",
    "git diff HEAD over packages/compiler/src/harness.ts and packages/skeleton/src/harness-host.ts names none of harnessPromptLine, releaseCloseAdmission and registeredTargetWriteRoot; the edit beside registeredTargetNearMiss is the new ghCommand and registeredTargetCommand's read of it, and the gh judgment runs before outsideWriteResponse without changing it.",
    "Product 07 §Retained planning follow-ups: the final review disposes a listed row whose seam the change opened or whose condition occurred and leaves a row it only matched as it is."
  ],
  "rejected": [
    {
      "option": "Name the list line in the publish helper's refusal here",
      "reason": "A source change outside the order's criteria after the passing complete run; the row's own order takes it with the outward adapter, where the fix serves the target publish too."
    },
    {
      "option": "Mark the older cold-start rows duplicates of FUP-8b1f9bcc240a1483",
      "reason": "Consolidating the family is a planning judgment; the final review's duty is to record that each row's condition was met."
    }
  ],
  "reopenWhen": "A planning pass consolidates or allocates the cold-start rows, or a publish refuses on a malformed private list and the session cannot locate the line."
}
```
