# WO-260 decisions

Decisions of the WO-260 execution, dispatched with `resume: next` on
2026-11-08 in the `wo-260` worktree over `main` at `9adc11723`. Each entry
names its evidence, the options it rejected and the condition that reopens
it.

## WO-260-D001 — The outcome is the operator's test cycles on a Git 2.31.0 host

```json
{
  "id": "WO-260-D001",
  "date": "2026-11-08",
  "dispatch": "resume: next; WO-260 objective and design",
  "decision": "Deliver the order as written: replace the six Git forms newer than 2.31.0 at their call sites with forms Git 2.31.0 has, with no version switch; lower engines.git to >=2.31.0; isolate each fixture's Git by a home inside the fixture; and add the core-only recorded Git surface check that stops the next newer form at the gate. The outcome the order serves is the operator's test cycles on the work laptop, whose Git is 2.31.0 and which every gate refuses at v0.122.0; the record carries only that public Git version and nothing else from that host (the order's carry-in and receipt 066's items 5 and 6).",
  "goalAlignment": {
    "criticalPath": "The work laptop is refused by harness check, harness evidence and every npm test selection today, so the operator cannot run a test cycle there; this order removes that refusal for Git 2.31.0 and makes each call site work there.",
    "traps": {
      "shiftingTheBurden": "A version switch at each call site would make the laptop run code no gate here executes; the forms are replaced in place, so the code every gate runs is the code the laptop runs.",
      "ruleBeating": "A shim that models six forms proves only those six; the surface record is read from the whole tree, so a seventh form found statically is repaired or scoped (D012), and the real-binary evidence stays a host condition (D013).",
      "driftToLowPerformance": "Lowering the floor without a check would let the next newer form land unnoticed, as the six did in six weeks; the core-only check makes each new form one reviewed line."
    },
    "noOp": "Without this order the laptop stays refused at every gate and the operator's test cycles there cannot start; WO-258-D009's own reopening condition (a supported host below 2.40.0 that the operator needs) is met."
  },
  "evidence": [
    "docs/work-orders/WO-260-the-kit-runs-on-git-2-31.md: Objective, Observed gap, Design and Execution plan, read at dispatch",
    "docs/planning/work-order-map.md WO-260 row: receipt 066's known issues 1 to 6 and the dated reading of rev-parse --show-ref-format (Git 2.44) and fsck --[no-]references (Git 2.50)",
    "git grep at 9adc11723: the six forms at the call sites the Observed gap names; ls-tree --format at scripts/worktree.mjs, scripts/lib/target-records.mjs, scripts/lib/target-record-reader.mjs and scripts/lib/target-planning.mjs"
  ],
  "rejected": [
    {
      "option": "Branch on git --version at each call site",
      "reason": "Rejected by the order: a branch taken only on an old Git is a branch no gate here executes."
    }
  ],
  "reopenWhen": "The laptop instance reports a failure on Git 2.31.0 after this order's release, which is a defect of this order's objective for the next order that takes it."
}
```

## WO-260-D002 — The review ladder runs on GPT-6 Astra workers

```json
{
  "id": "WO-260-D002",
  "date": "2026-11-08",
  "dispatch": "resume: next; the operator's message during dispatch asking for GPT-6 Astra reviewers",
  "decision": "Run every round of this execution's review ladder as a Codex review worker at gpt-6-astra, through npm run worker -- review --host codex --model astra --order WO-260, instead of the default Claude dotln-worker. The operator asked for Astra reviewers in a chat message after the dispatch line, not in it; the kit guide's worker option admits --model astra for the Codex host, so the request is honored by that flag rather than by the dispatch line's closing word.",
  "evidence": [
    "The operator's message during this dispatch, asking for GPT-6 Astra reviewers: capture SHA-256 97c22b0e1b64b0b1de1421d16c825b5aab4587820adea9adbab47a4cb9c125bb, captured at docs/intake/operator/wo260-review-workers-2026-11-08.txt (ignored)",
    "docs/KIT.md §What runs here, and what does not: npm run worker -- review ... --model opus|fable|sol|astra picks one of the operator's four worker options for that host"
  ],
  "rejected": [
    {
      "option": "Keep the Claude dotln-worker default because the dispatch line named no worker",
      "reason": "The operator's own words in this session ask for Astra; the dispatch-line rule names how a default is chosen, not a bar on the operator's explicit request."
    }
  ],
  "reopenWhen": "The operator names another worker for this order's reviews, or the Codex Astra launch is unavailable on this host."
}
```

## WO-260-D003 — The below-floor shim and its cases, and what they prove

```json
{
  "id": "WO-260-D003",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 1, the below-floor Git and scripts/test-git-floor.mjs",
  "decision": "scripts/fixtures/git-below-floor/git reports git version 2.31.0, refuses check-attr --source, ls-tree --format, worktree list -z and fsck --[no-]references with exit 129 and Git's unknown-option words, prints rev-parse --show-ref-format back, and removes GIT_CONFIG_GLOBAL and GIT_CONFIG_SYSTEM before it runs the host's Git, which it finds as the next git on PATH after its own directory. scripts/test-git-floor.mjs runs in the runner-fixtures task beside the runner's other files (expandSuiteTasks), its sources declared on that suite: its first case proves the six behaviors, and each later case runs one call site under the floor Git. Every case was also run with its call site reverted to the base's form: each of the ten arms failed with the failure the Observed gap predicted, so no case passes at the base.",
  "evidence": [
    "First lookup rule (the next git on PATH that is not this file) looped forever behind the publication fixture's own git wrapper, which resolves the real Git with command -v git and so calls the shim by its path; found while planning step 8, before any review, and corrected to 'the next git after this file's directory', with a direct test of the three layouts (behind a wrapper, first on PATH, called by path)",
    "node --test scripts/test-git-floor.mjs under the bounded wrapper: 10 passing cases, recorded in docs/evidence/WO-260/below-floor-cases.txt",
    "Reverted arms (docs/evidence/WO-260/reverted-arms.json): readTrackedTextAtHead 'notes.md: file is not tracked as a regular file'; validateTargetRecordsCommit, readTargetRecord and the planning base check 'unknown option `format=...'; gateCodeIdentity 'git check-attr exited 129: error: unknown option `source=...'; dropInventoriedStash 'stash prune retains unsupported Git ref backend'; the probe's Git and the payload's push each fail the planted-home case; mainCheckoutIntake 'Git host observation unavailable'; verify 'source-change private object store failed strict integrity check'"
  ],
  "rejected": [
    {
      "option": "Name the host Git in an environment variable the cases set",
      "reason": "A fixture's own child processes would need the variable passed through every layer; the PATH order alone is what each layer already carries."
    },
    {
      "option": "Run the readers' existing suites under the shim as the only evidence",
      "reason": "Criterion 1 names each reader's behavior; a case per reader shows it directly and fails at the base, which a suite pass alone does not show."
    }
  ],
  "reopenWhen": "A real Git 2.31.0 disagrees with a behavior the shim models, or a call site's case passes with its fix reverted."
}
```

## WO-260-D004 — One tree-entry reader for the four ls-tree --format callers

```json
{
  "id": "WO-260-D004",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 2",
  "decision": "scripts/lib/git.mjs exports gitTreeEntry(root, revision, path, gitArgs): one entry's mode, type and object from ls-tree -z's default output, null when the path is absent, and Git's own words when Git fails. readTrackedTextAtHead (now exported for its case), validateTargetRecordsCommit, readTargetRecord and publishTargetPlanning's base check read through it and keep the refusal each printed; the base check moved into assertPlanningBasePath so its case can call it, with the same refusal text.",
  "evidence": [
    "git ls-tree's default -z output, <mode> SP <type> SP <object> TAB <path> NUL, is the form Git 2.31.0's git-ls-tree.txt documents; ls-tree --format arrived in Git 2.36",
    "scripts/test-git-floor.mjs: readTrackedTextAtHead reads committed bytes over a changed working copy and an executable file, and refuses an untracked path, a symbolic link and an absent path; validateTargetRecordsCommit and readTargetRecord accept a regular committed blob and refuse a 100755 record; assertPlanningBasePath admits a regular file and an absent path and refuses an executable file and a file used as a directory"
  ],
  "rejected": [
    {
      "option": "Parse each caller's output in place",
      "reason": "Four copies of the same parser; one reader keeps one shape check."
    }
  ],
  "reopenWhen": "A caller needs an entry Git prints differently, such as a path ls-tree quotes without -z."
}
```

## WO-260-D005 — The classification at a revision reads a temporary index

```json
{
  "id": "WO-260-D005",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 3 and receipt 066 item 3",
  "decision": "gateCodeIdentity's classification moved into codeAttributes(root, revision, paths): at a committed revision it populates a temporary index from the revision (GIT_INDEX_FILE in an owned session-scratch root, read-tree, then check-attr --cached) and removes the root in every exit; the working-tree branch is unchanged. A failing Git keeps WO-258-D010's message, now naming the command (git read-tree or git check-attr) with its exit code and words, and the host-runtime blocker class. The identity is unchanged and the reading is faster.",
  "evidence": [
    "Identities at five revisions, computed with check-attr --source before the change and with the temporary index after it, on Git 2.55.0, are equal: HEAD 9adc11723 1a504cda…, HEAD~3 d9798e38 67d6258c…, HEAD~25 e66730ee 9acc6fd2…, v0.121.0 b28c443f 262eca5d…, v0.110.0 6df96b11 69c28099…",
    "gateCodeIdentity(root, 'HEAD') on this repository's tree, five samples each on Git 2.55.0: before 379, 361, 360, 358 and 360 ms (median 360 ms); after 181, 156, 152, 157 and 158 ms (median 157 ms); the working-tree branch, unchanged, read 146 to 176 ms",
    "scripts/test-git-floor.mjs: the identity at a revision under the floor Git equals the host Git's and the clean tree's while the working tree's attributes differ; codeAttributes' output equals check-attr --source's for a fixture with nested attributes and for this repository's HEAD (8,856 paths) on the host Git; a read-tree failure carries host-runtime",
    "bash scripts/test-release.sh --case git_floor: a release close's dry run under a Git that refuses check-attr --source writes the manifest with the reviewed code identity, and a Git that fails check-attr for another reason stops the close with class host-runtime and 'git check-attr exited 128'"
  ],
  "rejected": [
    {
      "option": "A temporary checkout of the revision",
      "reason": "Rejected by the order: a checkout writes every file, an index writes one."
    },
    {
      "option": "A parser of .gitattributes of the kit's own",
      "reason": "Rejected by the order: Git's own matcher answers."
    }
  ],
  "reopenWhen": "An identity at a revision differs from the identity check-attr --source gives for it on a Git that has both, or a host's Git cannot populate an index from a revision."
}
```

## WO-260-D006 — The main checkout is read without -z, and only a whole first line counts

```json
{
  "id": "WO-260-D006",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 4",
  "decision": "The main-intake grant reads the main checkout from git worktree list --porcelain without -z, through the exported mainCheckoutIntake. Git's manual says -z exists for a worktree path holding a newline, and without it such a path spans lines, so the first line is taken as the main checkout only when the record's HEAD or bare line follows it; any other first line leaves the grant unresolved with its present cause, as a path that is not plain and absolute does.",
  "evidence": [
    "git help worktree (Git 2.55.0): -z makes it possible to parse the output when a worktree path contains a newline character; quoting applies to the lock reason only",
    "scripts/test-git-floor.mjs: under the floor Git, a linked worktree resolves the main checkout's ignored intake, and a main checkout that no longer ignores its intake leaves the grant unresolved"
  ],
  "rejected": [
    {
      "option": "Take the first line as the path whatever follows",
      "reason": "A main checkout path holding a newline would resolve to a shorter, different path."
    }
  ],
  "reopenWhen": "An operator's main checkout path holds a newline, which this reading leaves unresolved."
}
```

## WO-260-D007 — The reference backend is read from extensions.refStorage

```json
{
  "id": "WO-260-D007",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 5",
  "decision": "scripts/lib/git.mjs exports refStorageBackend(root): the repository's own extensions.refStorage, an absent key (Git config's exit 1) meaning the files backend; another Git failure throws with Git's words. dropInventoriedStash and the prune's stash judgment read it, as source-change-worktree.ts already did, instead of rev-parse --show-ref-format, which an older rev-parse prints back and exits 0 on.",
  "evidence": [
    "scripts/test-git-floor.mjs: under the floor Git, dropInventoriedStash reads a files backend, drops the inventoried entry and leaves the older one",
    "receipt 066's dated reading: rev-parse --show-ref-format is of Git 2.44"
  ],
  "rejected": [
    {
      "option": "Treat rev-parse's echoed flag as the files backend",
      "reason": "It would read any unknown answer as files; the configuration key is what Git itself consults."
    }
  ],
  "reopenWhen": "A Git stores the backend somewhere other than extensions.refStorage."
}
```

## WO-260-D008 — fsck runs once without --no-references on a Git that lacks it, and the edit owes a live feedback episode

```json
{
  "id": "WO-260-D008",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 6",
  "decision": "verify runs fsck with --no-references and, when Git exits 129, once without it, since a Git without the option checks no reference database; the option stays a literal in the Git call so the surface reading sees it. source-change-worktree.ts is a judged feedback source, so this edit changes the edition's judged behavior and owes the feedback re-mint and one live self-host episode (WO-154 D001), run after the review ladder settles the judged sources.",
  "evidence": [
    "Before the edit, node scripts/harness.mjs bounded -- npm run evidence:feedback -- --check: 'Carried live feedback audit docs/evidence/WO-242/feedback-002, named by docs/evidence/WO-259/feedback-001', ten passing regressions and ten removal failures",
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS names packages/skeleton/src/source-change-worktree.ts",
    "scripts/test-git-floor.mjs: under the floor Git, create() and verify() admit a sound candidate committed in the private object store"
  ],
  "rejected": [
    {
      "option": "Drop --no-references",
      "reason": "On a Git that has it, fsck would check the shared reference database the head-only check exists to exclude."
    }
  ],
  "reopenWhen": "A Git exits 129 on another of the fsck options, or the feedback check reports the edition unchanged after this edit."
}
```

## WO-260-D009 — A fixture's Git is isolated by a home inside the fixture

```json
{
  "id": "WO-260-D009",
  "date": "2026-11-08",
  "dispatch": "resume: next; steps 7 and 8",
  "decision": "scripts/lib/git.mjs exports isolatedGitEnvironment(root): HOME and XDG_CONFIG_HOME inside the fixture root, GIT_CONFIG_NOSYSTEM, and GIT_CONFIG_GLOBAL naming the home's .gitconfig, so a fixture's global settings reach every Git from the floor up and the developer's do not. The authority probe's own Git and its payload's push use it (the host writes the variables into probe-config.json, since the payload runs from the fixture's copy); the publication fixture, the target-publish scenarios, the close fixture's ambient arm, the publish fixture's unreached arm, the launchpad update fixture, the harness hook fixture and the release starter cases use it. One child kept the developer's home: the authority probe's harness launch (Claude Code or Codex), whose sign-in and Codex episode home read it; its Git children stay isolated only on a Git that reads GIT_CONFIG_GLOBAL. scripts/test-target-worktree-release.mjs reads and writes the fixture's GIT_CONFIG_GLOBAL file, which is now the isolated home's, and needed no change.",
  "evidence": [
    "scripts/test-git-floor.mjs: under the floor Git with a home whose .gitconfig sets init.templateDir, a plain git init applies the template while the probe's source and remote repositories hold none, and the payload's push reaches the fixture's remote although that home rewrites the remote's address",
    "Under the shim on PATH: bash scripts/test-release.sh --case stale_compiler, --case starter_refresh and --case git_floor pass; node --test --test-name-pattern 'WO-246 plan publish' scripts/test-plan-refutation.mjs passes (docs/evidence/WO-260/below-floor-suites.txt)"
  ],
  "rejected": [
    {
      "option": "GIT_CONFIG_COUNT pairs alone",
      "reason": "Rejected by the order: pairs add settings and do not stop a Git from reading the developer's own file."
    },
    {
      "option": "Redirect the harness launch's home too",
      "reason": "The Claude Code and Codex sign-ins and the Codex episode home are read from the developer's home; the probe would stop working."
    }
  ],
  "reopenWhen": "A fixture child other than Git needs the developer's home and receives the fixture's, or a Git reads a global file this environment does not name."
}
```

## WO-260-D010 — The Git floor is Git 2.31.0, and WO-258-D009 is superseded

```json
{
  "id": "WO-260-D010",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 9 and the write-backs of step 12",
  "decision": "package.json engines.git reads >=2.31.0. The floor stays a named refusal at the version the gate has evidence for; it rests on rev-parse --path-format and the environment's configuration pairs, both of Git 2.31.0, which below it fail with words that name neither. This supersedes WO-258-D009's floor of 2.40.0 and keeps WO-258-D010's message and host-runtime class. The kit guide's §First steps states the floor, what it rests on and that an instance on an older Git lowers engines.git in its own package.json and reports what failed; §What runs here, and what does not links this decision. Product 07 §Workflow closeout and releases states no Git requirement of the classification, so it needed no change.",
  "evidence": [
    "scripts/test-runner.test.mjs: judgeGitRuntime admits git version 2.31.0, 2.31.0.windows.1, 2.39.3 (Apple Git-146), 2.55.0 and 3.0.0 and refuses 2.30.9 and 1.99.9 naming >=2.31.0 and the version read; checkHost refuses 2.30.9",
    "Git 2.31.0's Documentation/git-rev-parse.txt names --path-format and git-config.txt names GIT_CONFIG_COUNT, GIT_CONFIG_KEY_<n> and GIT_CONFIG_VALUE_<n>; grep of product 07 §Workflow closeout and releases finds no check-attr, --source or Git version"
  ],
  "rejected": [
    {
      "option": "Remove the floor judgment",
      "reason": "Rejected by the order: below 2.31.0 the failure would name neither the floor nor the version."
    }
  ],
  "reopenWhen": "A host the operator needs runs a Git below 2.31.0, or a script needs a form newer than the floor that cannot be scoped with a fallback."
}
```

## WO-260-D011 — The recorded Git surface and its core-only check

```json
{
  "id": "WO-260-D011",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 10 and receipt 066 item 2",
  "decision": "scripts/lib/git-surface.mjs reads every subcommand, subcommand and option pair, global option and GIT_* name the tracked and untracked files under scripts/ and packages/ name, with each file and line, and scripts/lib/git-surface.json records them with the floor they were confirmed against. node scripts/structural-checks.mjs git-surface fails naming each form the record lacks with its files and lines, and a record whose floor differs from engines.git naming both; --record rewrites the forms from the tree, keeping the floor, the scoped forms and their reasons. The git-surface task is marked core-only and runs in core's structural phase before host, which stays last so a structural failure is never charged to the dispatch bound; an exported kit runs its six. The reading uses the kit's existing source tokenizer (scriptTokens), not a new scanner: a list is Git's arguments when its context says so (a callee that takes Git's arguments one by one, an array passed to a call whose callee names Git or after a git program word, or a list splicing in a Git-named one), shell command lines are read word by word, and command text in a string counts where a git word starts it and a Git list elsewhere confirms its subcommand. Outside the reading: arguments assembled at run time, lists without a Git context (a local helper's arguments, DotLn's own command words), format atoms and placeholders, and configuration keys.",
  "evidence": [
    "First record: 477 forms from the tree; 450 named by Git 2.31.0's manual as the reader matched them (git-2.31.0.tar.xz from mirrors.edge.kernel.org, SHA-256 e8f162cbdb3283e13cd7388d864ed23485f1b046a19e969f12ed2685fb789a40, equal to the project's sha256sums.asc, Documentation/ with include directives resolved); 14 confirmed by hand against that release: commit -amfix (-a and -m with its value, git-commit.txt lines 66 and 148), diff --no-abbrev (revision.c line 2421), GIT_CONFIG_KEY_<n> and GIT_CONFIG_VALUE_<n> (git-config.txt lines 349 to 352), GIT_GRAFT_FILE (cache.h line 471), pack-refs --prune (builtin/pack-refs.c line 17), push --no-follow-tags (builtin/push.c line 579, a negatable boolean), reflog show --format (git-reflog.txt line 66), stash list --format (git-stash.txt line 83), update-index --no-<flag> (git-update-index.txt lines 17, 18 and 88); 13 scoped to the files that name them, each with its reason",
    "node scripts/structural-checks.mjs git-surface on this tree: exit 0 in 1.05, 1.06, 1.06, 1.08 and 1.08 s for the whole process; the reading alone about 1.0 s in process",
    "scripts/test-git-floor.mjs: in a fixture tree the check exits 0, exits 1 naming 'ls-tree --format (scripts/tool.mjs:3)' once the script gains that form, and exits 1 naming '>=2.40.0' and '>=2.31.0' when the record's floor is apart; scripts/test-launchpad-export.mjs asserts the export's lists never name git-surface",
    "The task's host slots are 1, an estimate for one Node process reading source on one core, not a measure-lanes reading"
  ],
  "rejected": [
    {
      "option": "Ship the option list of Git 2.31.0's manual and decide automatically",
      "reason": "Rejected by the order on provenance; the record holds only the forms the kit names."
    },
    {
      "option": "Count every list whose first word a Git list elsewhere confirms",
      "reason": "Tried on the tree: it read DotLn's own command words (worktree start, status --json, apply --file) as Git forms; a list now needs its own Git context."
    },
    {
      "option": "Run the check in an instance",
      "reason": "Rejected by the order: the kit's scripts are authored and proven in core."
    }
  ],
  "reopenWhen": "A form newer than the floor reaches a host through a list or text outside the reading, or measure-lanes reads the task's demand above one slot."
}
```

## WO-260-D012 — Two more forms newer than the floor, found by the reading

```json
{
  "id": "WO-260-D012",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 10's first record (Adjacent Repair)",
  "decision": "The surface reading found two forms the planning reading did not: git symbolic-ref --no-recurse in packages/skeleton/test/source-change-integrity.test.ts and git maintenance is-needed --auto in scripts/test-runner.test.mjs. The first is repaired: the case reads the alias's one-level target from the loose ref Git locates with rev-parse --path-format=absolute --git-path, since a symbolic ref is never packed and a recursive read cannot name a dangling or cyclic target. The second is scoped to its file: the case already admits the exit 129 a Git without the subcommand returns.",
  "evidence": [
    "Git 2.55.0's installed release notes: 2.39.0 'The command learned the \"--no-recurse\" option'; 2.53.0 '\"git maintenance\" command learned \"is-needed\" subcommand'; Git 2.31.0's builtin/symbolic-ref.c names no recurse option",
    "node --test --test-name-pattern 'preserves independent commits, tags, deleted refs and symbolic retargets' packages/skeleton/dist/test/source-change-integrity.test.js: pass on Git 2.55.0 and with the below-floor Git first on PATH"
  ],
  "rejected": [
    {
      "option": "Scope symbolic-ref --no-recurse to its test",
      "reason": "Its case would fail on a Git at the floor; the loose ref answers the same question on every Git."
    }
  ],
  "reopenWhen": "The fixture's repositories move to a reference backend without loose refs."
}
```

## WO-260-D013 — No real Git 2.31.0 ran here; criterion 5's fallback applies

```json
{
  "id": "WO-260-D013",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 11 and the core.fsmonitor carry-in",
  "decision": "This host holds no Git 2.31.0. The source was fetched and its digest compared, and the build with the order's recipe was denied by the host, so criterion 5's host-behavior fallback applies: criterion 1's shim evidence stands, and the laptop instance's report after the release is the real-binary evidence. The core.fsmonitor=false spelling is unchanged: Git 2.31.0's source reads core.fsmonitor as a hook path and runs it through the shell, the false command fails, and the refresh falls back to a full scan, so no command fails and the cost is one process per refresh; this is a reading of the source, not a run.",
  "evidence": [
    "curl of git-2.31.0.tar.xz and sha256sums.asc from mirrors.edge.kernel.org into session scratch: SHA-256 e8f162cbdb3283e13cd7388d864ed23485f1b046a19e969f12ed2685fb789a40 for both",
    "make -j8 prefix=<session scratch>/prefix NO_GETTEXT=1 NO_TCLTK=1 NO_PERL=1 NO_PYTHON=1 all install, 2026-11-09 about 02:21 UTC: 'Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Code from External]'",
    "Git 2.31.0's config.c lines 2516 to 2524 (git_config_get_fsmonitor reads a pathname) and fsmonitor.c lines 151 to 173 (query_fsmonitor runs the hook through the shell and records a failure) and 235 to 305 (a failed query is no success)"
  ],
  "rejected": [
    {
      "option": "Work around the denial with another build route",
      "reason": "Building another project's source is the host's permission to give, and the order names the fallback for its denial."
    }
  ],
  "reopenWhen": "The operator admits the build or a host here holds a Git 2.31.0, or the laptop instance reports a command that fails on Git 2.31.0."
}
```

## WO-260-D014

```json
{
  "id": "WO-260-D014",
  "date": "2026-11-09",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.122.1, the next patch above the observed release baseline v0.122.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.122.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-260-the-kit-runs-on-git-2-31.md"
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

## WO-260-D015 — The feedback edition is re-minted from one live self-host episode

```json
{
  "id": "WO-260-D015",
  "date": "2026-11-09",
  "dispatch": "resume: next; step 6's feedback re-mint, before the focused machinery gates",
  "decision": "Run the live feedback self-host episode D008 owed before the review ladder rather than after it: a focused run of a machinery suite judges every generated artifact, and the stale feedback edition stopped harness-fixtures at the generated structural check before any suite ran. The episode ran on Claude Code at claude-opus-5-5 and xhigh, was recorded as docs/evidence/WO-260/feedback-001, and docs/evidence/current.json names it by hand, since sync cannot select a live edition. A later edit of a judged feedback source in this execution owes another episode the same way.",
  "evidence": [
    "PATH=<below-floor Git>:$PATH npm test -- --only harness-fixtures, 2026-11-09 02:35 to 02:36 UTC: FAIL generated with 'feedback evidence is stale: judged behavior changed since docs/evidence/WO-242/feedback-002 (packages/skeleton/src/source-change-worktree.ts)', then build, git-surface, host and harness-fixtures unrun",
    "DOTLN_LIVE_WORKERS=1 node scripts/harness.mjs bounded -- node packages/skeleton/dist/src/dotln.js feedback-audit --store .runtime/feedback-audit-wo260-r001 --transport claude-cli-print --model claude-opus-5-5 --effort xhigh, 2026-11-09 02:37:35 to 02:38:08 UTC: exit 0, phase complete, ten fixtures, 1,192 saved instruction bytes",
    "node scripts/feedback-evidence.mjs --write and --record-selfhost .runtime/feedback-audit-wo260-r001 --edition WO-260 --revision 001: ten passing regressions, ten removal failures; the verifier stream recorded by reference, 74,338 of 3,052,279 bytes",
    "npm run evidence:feedback -- --check: 'Live feedback audit docs/evidence/WO-260/feedback-001 judged the current source.'"
  ],
  "rejected": [
    {
      "option": "Hold the episode until the review ladder ends",
      "reason": "The step 8 suites under the below-floor Git are machinery gates that refuse a stale edition; a ladder fix that touches a judged source pays one more short episode."
    }
  ],
  "reopenWhen": "A later edit in this execution touches a FEEDBACK_SOURCE_PATHS entry, or npm run sync reports feedback-evidence stale."
}
```

## WO-260-D016 — Step 8's runs under the below-floor Git found two defects and one load-sensitive bound

```json
{
  "id": "WO-260-D016",
  "date": "2026-11-09",
  "dispatch": "resume: next; step 8's check, and the operator's objection during it that the focused runs took longer than a complete run (ignored capture SHA-256 4059ce759c8dc51cd2d04e1110a01d154d2e029d25864d2f2a607269ab9e25ad)",
  "decision": "Repair the two defects the runs found and stop the queued runs. The shim's host lookup looped when a fixture narrows PATH to its own wrapper, which calls the shim by its path: with its directory off PATH, the shim now takes the first Git binary on PATH, judged by shell builtins alone, or else one on the standard utilities path (command -p getconf PATH). scripts/test-target-worktree-release.mjs's no-release case wrote the operator's local settings into a launchpad that ignored them only through the developer's own global ignore file; with the fixture's Git isolated, the case opts into the ignore line as the start case does. The harness case that failed is a duration bound that passes alone on both Gits. The eight serial focused gates took longer than one complete run, so the queue was stopped: three of its runs repeat what the complete run covers, and launchpad's check became its one case that reads the moved redirects.",
  "evidence": [
    "The operator's objection: docs/intake/operator/wo260-gate-time-2026-11-08.txt (ignored), SHA-256 4059ce759c8dc51cd2d04e1110a01d154d2e029d25864d2f2a607269ab9e25ad",
    "Serial focused gates under the below-floor Git, 2026-11-09: harness-fixtures 02:39:58 to 02:53:39 (8 passed, 1 failed), target-worktree to 03:09:47 (8 passed, 1 failed), target-publish to 03:13:25 (9 passed), release to 03:29:10 (8 passed, 1 failed); launchpad was stopped at about 03:38 with runner-fixtures, skeleton and worktree unrun; the planning record's seven fresh complete runs have a median of 45.8 minutes",
    "release:case:missinggh timed out after 15 minutes under the shim with PATH narrowed to $fixture/no-gh-bin; after the repair bash scripts/test-release.sh --case missinggh passes under the shim in 7.1 s, and a narrowed-PATH wrapper, the shim first on PATH and the shim called by its path each resolve the host Git and refuse check-attr --source within 258 ms",
    "'working tree is not clean: .../launchpad (?? .claude/settings.local.json)' on Git 2.55.0 as well; the developer's ~/.config/git/ignore holds a settings.local.json line, which core.excludesFile's default reads whatever GIT_CONFIG_GLOBAL names; the repaired case passes on Git 2.55.0",
    "'WO-125 F3 runner refuses generated-hook writes throughout the gate and releases on exit' ('runner matrix stays within twice its measured duration') passes alone in 16.6 s on Git 2.55.0 and 21.0 s under the shim",
    "'starter refresh publishes one verified commit and preserves every refusal boundary' (scripts/test-launchpad-update.mjs) passes under the shim in 225.5 s"
  ],
  "rejected": [
    {
      "option": "Ignore .claude/settings.local.json in the shared target fixture",
      "reason": "The start case opts into that line on purpose; other cases judge a launchpad that does not ignore the file."
    },
    {
      "option": "Finish the queued focused runs",
      "reason": "Their wall time already exceeded a complete run, which runs runner-fixtures, skeleton and worktree in parallel lanes after the review ladder."
    }
  ],
  "reopenWhen": "The complete run or a real Git 2.31.0 fails a case these runs passed, or the duration bound fails again without the shim."
}
```

## WO-260-D017 — Round 1's eleven findings, judged before they were fixed

```json
{
  "id": "WO-260-D017",
  "date": "2026-11-09",
  "dispatch": "resume: next; review ladder round 1 (three GPT-6 Astra workers over tree eae50ab5 against 9adc1172)",
  "decision": "Fix all eleven findings; each names an input a writer the kit has produces and a failure that admits a wrong pass or gives wrong advice. Criteria F1 (writer: the developer's own global Git file; open: the launched harness's git add and commit read it on a Git below 2.32): the fixture gives the launched harness a git wrapper first on PATH that runs the host's Git in the fixture's home, and a case launches a stand-in harness through runAuthorityProcess (D018 corrects D009). Criteria F2 (writer: an author's local helper; open: a newer form passed through readTarget-style helpers was admitted): the surface reading follows this source's helpers that pass a parameter as a Git call's argument list, whole or spread, file-wide when every declaration of the name forwards, else within the forwarding declaration's block, and an imported name counts as another meaning. Criteria F3 (writer: the kit's recovery messages; closed for the operator, who meets an unknown option on Git 2.31): git stash show --include-untracked is of Git 2.32, so the four messages now say git stash show --patch and, for the untracked files, git show --patch <stash>^3, and every nested-subcommand option in the record was reread against its own subcommand's synopsis in Git 2.31.0's manual. Design F1 (writer: --record; open: a scoped form named in a new file joined the forms): --record never moves a scoped form into the forms and names each outside file for review, and the check refuses a form both recorded and scoped. Design F2 (writer: fixture authors; open: a Git form in a shell script written as a string escaped unless another file confirmed it): a string or template whose text opens with a shell shebang is read as a shell file. Consistency F1 (writer: the runner's structural rows; open in principle: a handoff's structural row needed only six tasks): gate-reuse's structuralSuites(root) requires git-surface in core and the six in a kit, and handoff-ledger names structural tasks by it. Consistency F2: runner-fixtures declares scripts/fixtures/authority-effect.mjs. Consistency F3: below-floor-cases.txt, reverted-arms.json and below-floor-suites.txt are filed. Consistency F4: the two operator messages D002 and D016 cite are captured in ignored intake with their SHA-256. Consistency F5: measure-lanes measures core's seven structural tasks and the export's six. Consistency F6: product 07's structural paragraph names core's git-surface and the Git floor's place in leading host.",
  "evidence": [
    "docs/control/local/reviews/WO-260/round-1-criteria.md (3 findings, 2 marked blocking), round-1-design.md (2), round-1-consistency.md (6, its Traced consumers table present)",
    "Git 2.32.0's release notes (installed with Git 2.55.0) name stash show's untracked contents as new; Git 2.31.0's git-stash.txt names -u and --include-untracked for push and save only; on a throwaway repository git stash show --patch <stash> printed the tracked change and git show --patch <stash>^3 the untracked file",
    "The reread of nested forms against their synopses found no other misread; worktree add -q, submodule add -q, reflog expire --all and commit-graph write --reachable and --stdin-commits are in Git 2.31.0's manual or source; the record now holds 473 forms and 13 scoped, after adding bundle create --alternate-refs and --not (rev-list-options.txt lines 138 and 189), cat-file --batch-check, diff --numstat, for-each-ref --contains, merge --no-overwrite-ignore (git-merge.txt line 91), push --force-with-lease, remote rename, show --patch and upload-pack, and dropping stash show --include-untracked",
    "A first helper rule (any parameter passed anywhere) read DotLn's own words (run, verify, target, receipt) as Git forms through drive-route's fetch, test-work-orders' commit and a test-scoped run; the narrowed rule reads only the nine real forms above",
    "scripts/test-git-floor.mjs: 12 cases pass; with each fix reverted, 11 arms fail (docs/evidence/WO-260/reverted-arms.json), the launched-harness arm reading the planted setting; 'Preflight keeps a complete structural pass after a passing partial and refuses a failing partial' passes with a six-task row now refused in core; the interrupted stash collision case passes on the new wording"
  ],
  "rejected": [
    {
      "option": "Record the forwarding-helper and string-script boundary instead of reading them",
      "reason": "Both are inputs authors write today (readTarget, inLane, the transport script), and the order's check exists to stop a newer form there."
    },
    {
      "option": "Scope stash show --include-untracked to the recovery messages",
      "reason": "The messages are instructions an operator runs on the laptop's Git; a 2.31 form answers the same question."
    }
  ],
  "reopenWhen": "A round-2 recheck finds a fix incomplete, or a form newer than the floor reaches a host through a helper or string this reading still misses."
}
```

## WO-260-D018 — Correction: the launched harness's Git children are isolated on every Git

```json
{
  "id": "WO-260-D018",
  "date": "2026-11-09",
  "kind": "correction",
  "dispatch": "resume: next; review ladder round 1, criteria F1",
  "decision": "D009 recorded the authority probe's harness launch as a child that kept the developer's home, with its Git children isolated only on a Git that reads GIT_CONFIG_GLOBAL. The launch keeps the developer's home, and its Git children now run through a fixture wrapper first on PATH that gives them the fixture's home on every Git from the floor up.",
  "misread": "That keeping the harness's home for its sign-in meant its Git children had to keep it too; step 8 already named the route, passing the redirected home to the Git children only.",
  "meant": "The harness keeps the developer's home; every Git its children run reads only the fixture's configuration.",
  "changed": "scripts/lib/authority-probe.mjs installs <fixture>/git-bin/git (the host's Git run with isolatedGitEnvironment's variables) and launchEnvironment puts it first on PATH; scripts/test-git-floor.mjs launches a stand-in harness through runAuthorityProcess under the below-floor Git and finds the real home kept and the planted setting unread.",
  "evidence": [
    "docs/control/local/reviews/WO-260/round-1-criteria.md F1",
    "docs/evidence/WO-260/reverted-arms.json: the arm without the PATH entry reads 'real-home'"
  ],
  "rejected": [
    {
      "option": "Redirect the harness's own home",
      "reason": "Its sign-in and the Codex episode home are read from the developer's home."
    }
  ],
  "reopenWhen": "A live probe run shows the harness's sandbox refusing to run the fixture's Git wrapper."
}
```

## WO-260-D019 — Round 2's three admitted findings, judged before they were fixed

```json
{
  "id": "WO-260-D019",
  "date": "2026-11-09",
  "dispatch": "resume: next; review ladder round 2 (three GPT-6 Astra rechecks over tree dea3bd4f)",
  "decision": "Every round-1 fix held in all three rechecks. Fix the three new findings, each admitted because it breaks a criterion: criteria R2 F1 (writer: an author whose Git call carries an argument named git, such as a path; open: the reader took that word for the program and dropped the whole call, so a newer form passed): a git program word starts the arguments only where a list begins with it or with env and its assignments. Criteria R2 F2 (writer: shell authors; open: a continued line's options escaped): shell files and scripts written as strings are read as logical lines, a backslash joining the next line, each at its first line's number. Consistency R2 F1 (writer: the kit guide; closed but certain: scripts/test-launchpad-export.mjs requires a guide row for every core-only suite, so the complete run would fail on 'Kit guide omission: git-surface'): the guide's core-only table gains the git-surface row in the words of its kit declaration. Two readings changed in the same pass, since the first fix let prose credit one command's options to another: the next git word ends the previous command's arguments, and a word's trailing punctuation is dropped, which removed the misread forms worktree and worktree list --list and added add -u (Git 2.31.0's git-add.txt lines 112 and 113). The continued-line case plants ls-tree --format in a shell script it writes as a string, so that form is scoped to scripts/test-git-floor.mjs with its reason.",
  "evidence": [
    "docs/control/local/reviews/WO-260/round-2-criteria.md (2 findings), round-2-design.md (0), round-2-consistency.md (1); every round-1 recheck reads held",
    "scripts/test-git-floor.mjs: 13 cases pass, among them a call whose last path is git and a continued shell line, each named at its file and line (docs/evidence/WO-260/below-floor-cases.txt)",
    "node scripts/structural-checks.mjs git-surface: exit 0; the record holds 474 forms and 14 scoped; the stricter reread against Git 2.31.0's option entries and synopses leaves only the forms D011 and D017 confirm by hand"
  ],
  "rejected": [
    {
      "option": "Take the last git word in a list as the program",
      "reason": "A path named git can come last too; only the list's start or an env prefix marks the program."
    }
  ],
  "reopenWhen": "Round 3 finds a fix incomplete, or a shell construct beyond continued lines hides a form."
}
```

## WO-260-D020 — Round 3's two findings, judged and fixed; the executor judges the last delta

```json
{
  "id": "WO-260-D020",
  "date": "2026-11-09",
  "dispatch": "resume: next; review ladder round 3 (one combined GPT-6 Astra worker over the delta since round 2's tree), the ladder's last round",
  "decision": "Round 3 held two of round 2's three fixes and found the third incomplete. Fix both findings it admitted under criterion 4. F1 (writer: shell authors; open: the round-2 rule that a git word ends a command cut a shell command at an argument such as refs/heads/git and dropped the options after it): that rule and the trailing-punctuation rule now apply to prose only, the text of messages and hook cases, while in a shell file or a script written as a string only a separator ends a command. F2 (writer: shell authors; open: the continued-line join inserted a space, so '--\\' followed by 'format=' read as -- and a positional word): continued pieces join with nothing between them, as a shell reads them. No reviewer runs after round 3; the executor judged the delta: the record is unchanged by the fixes, a prose message still yields its two commands, and the three shell texts each name ls-tree --format at their second line both as a shell file and as a script a fixture writes.",
  "evidence": [
    "docs/control/local/reviews/WO-260/round-3-combined.md: 2 findings; criteria R2 F1 and consistency R2 F1 held, criteria R2 F2 not held",
    "node scripts/structural-checks.mjs git-surface --record after the fixes: 0 added, 0 removed; the check exits 0",
    "scripts/test-git-floor.mjs: 13 cases pass, the continued-line case now covering a continuation inside an option's word and an option after refs/heads/git, each in a shell file and in a template a fixture writes"
  ],
  "rejected": [
    {
      "option": "Keep the git-word boundary in shell text and special-case ref names",
      "reason": "Only a separator ends a shell command; a list of argument shapes would always miss one."
    }
  ],
  "reopenWhen": "The complete run or a later order shows a shell or prose construct that hides a form newer than the floor."
}
```

## WO-260-D021 — The first complete run failed on a fixture that pinned six structural tasks; repaired

```json
{
  "id": "WO-260-D021",
  "date": "2026-11-09",
  "dispatch": "resume: next; the closeout's complete run, npm test -- --review, and its repair",
  "decision": "Repair scripts/test-verifier-gate-claims.mjs, whose core-checkout fixture recorded structural rows of the six tasks every kit runs and expected a focused handoff to consume them. Round 1's consistency fix made the handoff require core's own structural phase, git-surface included, so the fixture's rows no longer stood. This is an expected-data update caused by this order's contract change: the fixture now takes its list from structuralSuites(root), read from its own copied gate-reuse.mjs, and prints the same list from its stub runner. No other fixture builds handoff rows from a hand-written list; the two that build runner tables from STRUCTURAL_TASKS (test-harness.mjs's live-gate holder and test-gate-deadlines.mjs's document table) consume no handoff. The repair takes the ladder over its own diff, under fifty changed source lines, so it starts at round 3; the fresh complete run passes --keep-going so that any other failure surfaces in the same run.",
  "evidence": [
    "npm test -- --review, 2026-11-09 05:00 to 05:02 UTC: 'npm test: 8 passed; 38 failed; 0 h 3 min'; resume failed at scripts/test-verifier-gate-claims.mjs refuseFocused with 'Handoff rows missing or failed: structural (latest row failed or no longer stands)', and every later suite was 'Not started after resume failed'",
    "grep of scripts/ and packages/ for a hand-written structural list: test-verifier-gate-claims.mjs only, beside the two definitions",
    "The fixture alone, run as scripts/test-resume.sh runs it in an owned test root: exit 0 in 26.8 s"
  ],
  "rejected": [
    {
      "option": "Keep the handoff's six-task requirement in core",
      "reason": "Round 1's consistency finding stands: core's structural row must hold the check core runs."
    }
  ],
  "reopenWhen": "Another consumer of structural rows meets core's seven tasks in the fresh complete run."
}
```

## WO-260-D022 — The repair's review found one more continuation case; the executor judges the last delta

```json
{
  "id": "WO-260-D022",
  "date": "2026-11-09",
  "dispatch": "resume: next; the repair's ladder, starting at round 3 under fifty changed source lines",
  "decision": "Fix the one finding the repair's combined review admitted under criterion 4 (writer: shell authors; open: a line ending in an escaped backslash was joined to the next, which hid that line's git command): a line continues only when it ends in an odd run of backslashes. No reviewer runs after this round; the executor judged the delta, one parity test and its fixture case, and the record is unchanged by it.",
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-1/round-3-combined.md: 1 finding",
    "scripts/test-git-floor.mjs: the continued-line case names ls-tree --format at scripts/tool.sh:3 after a printf line ending in two backslashes; node scripts/structural-checks.mjs git-surface --record: 0 added, 0 removed"
  ],
  "rejected": [
    {
      "option": "Join every line that ends in a backslash",
      "reason": "A shell reads an even run as escaped backslashes, so the next line is its own command."
    }
  ],
  "reopenWhen": "The fresh complete run fails on this reading."
}
```

## WO-260-D023 — The second complete run failed on the floor test's own helper use; repaired

```json
{
  "id": "WO-260-D023",
  "date": "2026-11-09",
  "dispatch": "resume: next; the closeout's complete run, npm test -- --review --keep-going, and its repair",
  "decision": "Repair scripts/test-git-floor.mjs, which defined its own bare-hex sha256 and spawned git directly, against the repository's rule that a digest comes from sha256Hex and a Git spawn from scripts/lib/git.mjs: it imports sha256Hex and calls spawnGit, which spawns git by the same PATH lookup, so each case still finds the floor Git first. One call stays direct, inside the program text of the stand-in harness the launched-harness case runs with node -e, which asks the Git its own PATH finds outside the library; scripts/test-helper-reuse.mjs admits it by name with that reason, beside its other quoted-call entries. The repair takes the ladder over its own diff from round 3.",
  "evidence": [
    "npm test -- --review --keep-going, 2026-11-09 05:16 to 06:06 UTC (3,023,972 ms): 'npm test: 45 passed; 1 failed; 0 h 50 min'; process-debt's 'no script defines a bare-hex sha256 or spawns Git outside the library' named scripts/test-git-floor.mjs twice",
    "After the repair: that case passes; scripts/test-git-floor.mjs's 13 cases pass; node scripts/structural-checks.mjs git-surface --record adds and removes nothing"
  ],
  "rejected": [
    {
      "option": "Rename the stand-in's spawn so the rule's pattern no longer sees it",
      "reason": "The call still spawns Git outside the library; a named entry with its reason says so."
    }
  ],
  "reopenWhen": "The next complete run fails on this file."
}
```

## WO-260-D024 — The status after implementation-ready is read and reported, not filed

```json
{
  "id": "WO-260-D024",
  "date": "2026-11-09",
  "dispatch": "resume: next; the handoff",
  "decision": "The order's evidence gate lists npm run resume -- status --json after implementation-ready under docs/evidence/WO-260/. The executor reads that status once implementation-ready is recorded and reports it in the completion response; it files no status file there. The executor's procedure makes the completion record its last write and then reads the resulting projections without another write, and the transition itself stands in the canonical control log, which the verifier's dispatch reads.",
  "evidence": [
    ".claude/skills/dotln-executor/SKILL.md, step 11: record npm run resume -- implementation-ready, then read the resulting projections without another write",
    "WO-258's evidence gate listed the same reading; docs/evidence/WO-258/ holds no status file, and neither docs/verifications/WO-258/VER-001.md nor docs/final-reviews/WO-258/FINAL-001.md mentions it"
  ],
  "rejected": [
    {
      "option": "Write the status JSON into docs/evidence/WO-260/ after implementation-ready",
      "reason": "It is a write after the completion record, which the executor's procedure excludes; the document row would still stand, since it also binds the tree without this order's evidence, but the phase would not end on its record."
    },
    {
      "option": "File a status reading taken before implementation-ready",
      "reason": "It would show the order active, not the handoff the item asks about."
    }
  ],
  "reopenWhen": "A verifier or final reviewer judges the evidence gate unmet without the filed reading, or the executor's procedure admits a write after completion."
}
```

## WO-260-D025 — The nine review workers went uncounted by the subagent cap; the allocated follow-up already holds the repair

```json
{
  "id": "WO-260-D025",
  "date": "2026-11-09",
  "dispatch": "resume: next; the handoff's usage reading",
  "decision": "Record that this session's nine review workers went uncounted by the subagent cap, the defect WO-258-D035 records, and add neither a new follow-up nor a reopening observation: FUP-973464a1fa408976 is allocated to WO-261 step 6, and neither of its reopening conditions holds. The nine launches were written npm run worker --silent -- review, and kitWorkerLaunch reads the npm flag after the script name as the helper's first argument, so the hook's counter holds no kit row and node scripts/harness.mjs usage reads 'workers: launched 0 (claude 0, codex 0), re-tasked 0, cap 20, remaining 20'. By the role's rule the session used nine of its twenty uses, below the cap. Writing npm run worker -- review avoids the miss until WO-261 lands.",
  "evidence": [
    "This session's nine launch commands, 2026-11-09 03:49 to 06:09 UTC, each npm run worker --silent -- review --kind <kind> --host codex --model astra --order WO-260 with its round; nine reports in the order's reviews lane (round 1 three, round 2 three, round 3 one, repair-1 one, repair-2 one)",
    "The dispatch's subagent counter under docs/control/local/harness/ holds no direct, child or kit row",
    "kitWorkerLaunch from packages/skeleton/dist/src/harness-host.js, under node scripts/harness.mjs bounded: npm run worker -- review, npm run --silent worker -- review and npm --silent run worker -- review each return one use on codex; npm run worker --silent -- review returns null",
    "docs/planning/followups.json, FUP-973464a1fa408976 (decision WO-258-D035): allocated to WO-261 step 6; it reopens when WO-261 is withdrawn or a session passes subagentCap on uncounted launches before WO-261 closes"
  ],
  "rejected": [
    {
      "option": "Repair kitWorkerLaunch in this order",
      "reason": "It is outside WO-260's scope and allocated to WO-261; an edit after the passing complete run changes the code identity and owes a new review ladder and complete run."
    },
    {
      "option": "Add a reopening observation to WO-258-D035",
      "reason": "Neither reopening condition holds, and a new revision would return an allocated follow-up to needs-review."
    },
    {
      "option": "Name a new follow-up",
      "reason": "It would duplicate an allocated one."
    }
  ],
  "reopenWhen": "WO-261 is withdrawn before it closes, or a session passes subagentCap on launches the counter does not see."
}
```

## WO-260-D026 — Verification returns the quoted-path surface omission to repair

```json
{
  "id": "WO-260-D026",
  "date": "2026-11-09",
  "dispatch": "resume: verify; WO-260, VER-001",
  "decision": "Fail criterion 4 on the reproduced omission in shellLines: a hash character inside a quoted literal filename is treated as the start of a comment, so a following ls-tree --format disappears and the Git surface check returns success. Route F1 to the order's repair without changing the implementation during verification. The repair must distinguish actual shell comments from quoted or escaped literal hash characters, retain later arguments and their source location, and cover the supported shell-file and embedded-script paths with regression cases.",
  "goalAlignment": {
    "criticalPath": "The recorded Git surface must catch a newly introduced form above the declared floor before it reaches a Git 2.31 host.",
    "traps": {
      "ruleBeating": "The existing thirteen cases and the complete gate pass, so independent literal-input variations are needed; the reproducer executes the actual shell command and demonstrates the shim's exit 129 before judging the extractor's false success.",
      "scopeDrift": "The verifier owns the verdict and evidence, not an implementation repair. The next executor changes the declared surface and its regression cases."
    },
    "noOp": "Accepting only the existing green cases would leave criterion 4 unmet on an ordinary quoted filename; no-op on the implementation is appropriate for this read-only role, with a failed report and a concrete repair rule."
  },
  "evidence": [
    "docs/evidence/WO-260/verification-001-surface.mjs: baseline check 0, ordinary-path unsupported option check 1, quoted hash-path unsupported option check 0, host shell/Git 0, below-floor shim 129; expected unsupported-form diagnostic at scripts/tool.sh:2",
    "docs/evidence/WO-260/verification-001.json: independent observations, current-identity complete review row and verifier apparatus corrections",
    "scripts/lib/git-surface.mjs:155 removes a whitespace-prefixed hash and all later text before shellCommands reads quoting",
    "All nine execution review reports were read; the seventeen recorded fixes hold under their current cases, but no prior case varies a quoted literal hash character."
  ],
  "rejected": [
    {
      "option": "Pass because the existing criterion-4 fixture and complete review gate pass",
      "reason": "The supported literal shell command is executable and uses the same named ls-tree --format form, but the check misses it. This is an unmet criterion, not a request to support runtime-built arguments."
    },
    {
      "option": "Add the newer form to the recorded surface or exclude the new filename shape",
      "reason": "That would hide the omission instead of restoring the declared-floor check."
    },
    {
      "option": "Repair the extractor during verification or ask the operator to authorize this in-scope fix",
      "reason": "The verifier is read-only for the implementation, and the existing order already authorizes its repair."
    },
    {
      "option": "Rerun the complete product gate at unchanged code identity",
      "reason": "The intact 46-suite, 122-task review row already covers the declared Preflight. Fresh focused probes find the missing behavior; another unchanged complete run would not add that coverage."
    }
  ],
  "reopenWhen": "A repair makes the saved reproducer pass, preserves the existing surface and compatibility cases, and supplies current gate evidence for the changed code identity."
}
```

## WO-260-D027 — A hash starts a shell comment only where it begins a word; the reading stays regular expressions, with its other limits stated

```json
{
  "id": "WO-260-D027",
  "date": "2026-11-09",
  "dispatch": "resume: fix; repair of VER-001 F1 under criterion 4",
  "decision": "Repair shellLines in scripts/lib/git-surface.mjs so a comment starts only at a # that begins a word, read with one word pattern: a word runs through plain characters, backslash escapes and whole single- or double-quoted pieces, and an operator character stands alone. The rule the repaired code holds: a # that is quoted, escaped or inside a word keeps the arguments after it, and a # after a blank or an operator still removes the rest of the line. The repair serves shell files and scripts written as strings alike, since both read their lines through shellLines, and it keeps the line numbers and continuation cases unchanged. A probe of the reader before the repair found five more shell shapes that hide a literal option from it: a git command inside a double-quoted command or backtick substitution, an option after a quoted word that spans lines, an option after a redirection, an option after a script template's interpolation, and an option whose value is an expansion. Each is outside F1's class, the place a comment starts, and reading them needs a shell parser. During this repair the operator directed that it not turn into another hand-written parser, so the module header now states them as outside the reading beside run-time arguments, and the follow-up below decides them.",
  "operatorDirection": {
    "capture": "docs/intake/operator/wo260-repair-no-parser-2026-11-09.txt",
    "sha256": "fc46659ae160edc766ce43bfdefa0f0f24e3f1d19c08b7650dc10d961b6bdfe6"
  },
  "goalAlignment": {
    "criticalPath": "Criterion 4: the surface check must name a newer form a script gains, including after a quoted or escaped hash.",
    "traps": {
      "ruleBeating": "Fixing only the reproducer's single-quoted filename. The new case also covers a double-quoted hash, an escaped blank before a hash, an escaped hash, a hash inside a quoted piece mid-word and a quoted hash before a continued line, and asks the shell for each expected answer.",
      "scopeDrift": "Turning the repair into a shell lexer. The operator ruled it out; the repair widens the one word pattern the reader already used."
    },
    "noOp": "Not available: criterion 4 is unmet on the reproducer until the reader changes."
  },
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-001-surface.mjs after the repair: exit 0, the check exiting 1 with 'Git form not in scripts/lib/git-surface.json: ls-tree --format (scripts/tool.sh:2)'",
    "scripts/test-git-floor.mjs, new case 'the Git surface check keeps a quoted or escaped hash inside its word, as the shell does, and still drops a comment': eight texts, each as a shell file and as a string a fixture writes; sh with a stand-in git that prints its arguments decides whether each passes the option; the four surface cases pass; with the pre-repair reader restored the new case fails on its first text (actual 0, expected 1)",
    "sh, bash and zsh on this host, given a stand-in git, pass --format to git for 'a\\ #b', '\\#b', 'x#y', '\"$(git ls-tree --format=x HEAD)\"', a backtick substitution in double quotes, a single-quoted word spanning two lines, a redirection before the option and $'a\\'#b', and drop it after ';#'",
    "The reader over this repository before and after the repair: 10,212 findings and 488 forms each; the only difference is the five forms of git-surface.mjs's own ls-files call, moved down by the added lines",
    "node scripts/structural-checks.mjs git-surface: exit 0; node scripts/test-helper-reuse.mjs: pass"
  ],
  "rejected": [
    {
      "option": "A hand-written shell lexer that follows quoting across lines, substitutions, redirections and here-documents",
      "reason": "The operator ruled out another hand-written parser during this repair, and the order already rejects hand-written readers of another tool's syntax."
    },
    {
      "option": "Let a shell read the text (bash -n, or a function body printed back by declare -f)",
      "reason": "It prints no words, or it runs repository text and answers differently by shell and version."
    },
    {
      "option": "Change the word pattern shellCommands splits arguments with as well",
      "reason": "A whole double-quoted word would then hide the git command in x=\"$(git ...)\", which the reader finds today."
    }
  ],
  "followup": "The next order that edits scripts/lib/git-surface.mjs, or the planning pass that allocates this: decide whether the Git surface reading should cover a git command inside a double-quoted command or backtick substitution, an option after a quoted word that spans lines, after a redirection or after a script template's interpolation, and an option whose value is an expansion, through an existing maintained shell parser or narrower readings, never a hand-written parser; until then the module header states them as outside the reading.",
  "reopenWhen": "A form newer than the floor reaches a Git 2.31 host through one of the stated shapes, or the operator admits a shell parser dependency."
}
```

## WO-260-D028 — A fix answers a verification failure in proportion; the rule is carried to WO-262

```json
{
  "id": "WO-260-D028",
  "date": "2026-11-09",
  "dispatch": "resume: fix; operator direction during the repair of VER-001 F1",
  "decision": "Record the operator's direction as a follow-up for WO-262: a fix dispatch answers a verification failure in proportion to it. It repairs the failing case and the class the report names, and it re-engineers the solution only where evidence shows the larger change is the better solution, never because one case failed. This repair is the worked example. The executor's first design after VER-001 was a hand-written shell lexer that would also have covered five shapes the verifier never raised; after the operator's direction (D027) the class closed with one widened word pattern, the verifier's reproducer passed, a case judged by the shell itself passed and failed with the fix reverted, and the tree's reading was unchanged. Allocating the follow-up into WO-262's text is a planning act; this decision names that order.",
  "operatorDirection": {
    "capture": "docs/intake/operator/wo260-fix-overreaction-followup-2026-11-09.txt",
    "sha256": "c33a18b3f3cc7154628baf02065aa82b2a90b419f5295bfd7a363975348b519c"
  },
  "evidence": [
    "WO-260-D027: the lexer the executor designed first, the operator's direction and the one-pattern repair; node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-001-surface.mjs exits 0 after it",
    "docs/work-orders/WO-262-review-findings-are-judged-before-they-are-fixed.md: the order that has a review finding judged before it is fixed, the nearest home for the same judgment of a verification failure"
  ],
  "rejected": [
    {
      "option": "Amend WO-262's text from this order",
      "reason": "Another order's text changes through planning with the operator's authorization (npm run plan -- amend-order), not through this order's repair."
    },
    {
      "option": "Add the rule to the executor's role text here",
      "reason": "The role text is WO-262's deliverable; this order's scope is the Git floor."
    }
  ],
  "followup": "WO-262 (review findings are judged before they are fixed), or the planning pass that allocates this: extend its judgment rule to a verification failure, so a fix dispatch repairs the failing case and the class the report names in proportion, and re-engineers the solution only where evidence shows the larger change is the better solution; WO-260-D027 and D028 hold the worked example.",
  "reopenWhen": "WO-262 is withdrawn, or closes without taking this up."
}
```

## WO-260-D029 — The repair's round 1: eleven findings judged before any was fixed

```json
{
  "id": "WO-260-D029",
  "date": "2026-11-09",
  "dispatch": "resume: fix; the repair's review ladder, round 1 (three dotln-worker reviewers over the whole change)",
  "decision": "Judge round 1's eleven findings before fixing any. Criteria F1 and consistency F1 (blocking, criterion 4) are one failure, transferred to the criteria report: shellCommands cut a word at a blank or an operator character inside a quoted piece that does not begin the word, so --format='%(refname) %(objectname)' or -c core.pager='less -R' hid every later option. Writer: an author's ordinary text, which this repository already writes; open; one pattern. Fixed: shell files and scripts written as strings split their arguments with a word pattern that keeps single-quoted pieces and backslash escapes inside a word, and a double-quoted option value after = when it holds no expansion; prose keeps its own pattern, since an apostrophe in a sentence would open a false quote. A double-quoted piece elsewhere inside a word (HEAD:\"dir (old)\") stays outside the reading: keeping it whole paired quotes wrongly on \"$(git -C \"$dir\" ...)\" lines and lost real readings. Criteria F2 (note): a # that begins a line continued from the previous one is inside a word to the shell; writer: nobody in practice; open; three lines in shellLines, so fixed by finding the comment over the joined line. A # directly after a substitution ($(echo HEAD)#x) stays outside, with the substitutions. Design F1 (should-fix): the header said a double-quoted substitution was outside the reading, while x=\"$(git ...)\" is read; fixed by stating the rule the reading follows, a comment at each pattern saying why it differs, and a case pinning the assignment form. Design F2 (should-fix): fixed by the same header, which states the rule rather than a list, and by the reopening observation below, which widens the follow-up. Design F3 (note): failing the check on a recorded form the reading no longer finds would change the check's contract, so that removing a form's last use needs --record; not fixed here, carried in the follow-up. Design F4 (note): the four surface cases repeat their fixture setup; maintenance only, no failure; recorded, not fixed. Design F5 (note): fixed; the gate-reuse comment names the import that must stay lazy. Consistency F2 (should-fix): fixed; the kit guide and product 07 say the check refuses the forms its static reading finds, and link this decision. Consistency F3 (should-fix): fixed; below-floor-cases.txt is retaken after the last change to scripts/test-git-floor.mjs, and its earlier 13-case text stays in checkpoint refs/dotln/checkpoint/WO-260/5. Consistency F4 (note), a correction to D027's evidence recorded the same day: its 10,212 findings were counted before the new case was added; with that case the tree read 10,223 findings and 488 forms.",
  "reopens": {
    "decisionId": "WO-260-D027",
    "observation": "Round 1 found more outside the regular-expression reading than D027's five shapes: JavaScript a shell file carries in a here-document is not read for Git argument lists; a double-quoted piece inside a word other than an option's = value; a # directly after a command substitution; and the JavaScript side of the reader is itself hand-written over scriptTokens. Whoever decides the follow-up also weighs failing the check on a recorded form the reading no longer finds, so a narrower reading shows as named failures."
  },
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-3/round-1-criteria.md (2 findings, 1 blocking), round-1-design.md (5, none blocking), round-1-consistency.md (4, 1 blocking), all over tree 152606711087d672fea29d45353c31f77d1362f7",
    "On a scratch copy of the reader with the argument pattern and the continued-line comment: the tree reads 10,224 findings and 488 forms against 10,223 and 488, the one addition commit -m at scripts/test-worktree.sh:433, a recorded form; nothing lost",
    "The same copy against 23 shell texts judged by sh with a stand-in git: 22 agree in a shell file and in a string a fixture writes, including both reviewers' inputs (-c core.pager='less -R', HEAD:'dir (old)', dir\\ \\(old\\), --format='%(refname) %(objectname)' --exclude, --format=\"%(refname)\", --grep=\"fix(core)\", a # opening a continued line, x=\"$(git ...)\"); the one that disagrees is HEAD:\"dir (old)\", the stated limit",
    "A variant keeping every double-quoted piece without expansions whole anywhere in a word lost readings at scripts/test-release.sh lines 1256, 1308, 1625, 1641, 1759, 1945 and 2088"
  ],
  "rejected": [
    {
      "option": "State the quoted-operator shape as a sixth limit (consistency F1's cheapest route)",
      "reason": "This repository writes the shape, any option after a format atom would escape, and the fix is one pattern with no parsing state."
    },
    {
      "option": "Keep every double-quoted piece without expansions whole anywhere in a word",
      "reason": "It lost real readings in scripts/test-release.sh."
    },
    {
      "option": "Split arguments with the comment pattern",
      "reason": "A whole double-quoted word would hide the git command in x=\"$(git ...)\"."
    },
    {
      "option": "Make the check fail on recorded forms the reading no longer finds now (design F3)",
      "reason": "It changes the check's contract beyond this repair; the follow-up carries it."
    }
  ],
  "reopenWhen": "Round 2 finds a fix not held, or a form newer than the floor reaches a Git 2.31 host through a stated limit."
}
```

## WO-260-D030 — The repair's round 2: every fix held; two regressions of round 1's pattern judged and fixed

```json
{
  "id": "WO-260-D030",
  "date": "2026-11-09",
  "dispatch": "resume: fix; the repair's review ladder, round 2 (the three reviewers recheck their findings and the whole change)",
  "decision": "Every round-1 fix held in all three rechecks. Judge the round's three new findings before fixing any, under the round-2 rule that admits only a finding that breaks an acceptance criterion or a behavior main had. Criteria F1 (blocking, criterion 4) is admitted: round 1's argument pattern kept a single-quoted piece inside a word but not a double-quoted one, so an apostrophe inside a double-quoted value (msg=\"it's\"; git ls-tree HEAD --format=...) paired with the next single quote on the line and hid the later git command, which the round-1 reader read. Writer: an author's ordinary text, a contraction or possessive in a double-quoted string; open; introduced by round 1's fix; one character class. Fixed: a single-quoted piece inside a word stops at a double quote. Design F1 (note) is admitted on the same ground: the same pattern read bash's $'...' quoting as a single-quoted piece, so an escaped quote inside it ($'a\\'#b') paired with the next quote and hid a later option the round-1 reader read; that is a criterion-4 miss with a supported input, introduced by round 1's fix, though no line here writes it. Fixed with one alternative that reads $'...' with its escapes. Design F2 (note), building the three patterns from named fragments and replacing an unreachable clamp in shellLines with a stated invariant, is maintenance with no failure: not admitted, recorded in the handoff. The consistency recheck found nothing new; its three notes (D027 names the case by its earlier title, the runner's one-line protection text keeps its unqualified summary, a program named by a defaulted expansion is a run-time argument) are recorded in the handoff. The fixes change code, so round 3 runs: one combined worker over the delta since round 2's tree.",
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-3/round-2-criteria.md (rechecks held; 1 finding, blocking), round-2-design.md (rechecks held; 2 notes), round-2-consistency.md (rechecks held; no findings), all over tree d687d373734d0d9de217eb75e3b8091c226b8c11",
    "The criteria reviewer's scratch trial of the character class and the design reviewer's of the $'...' alternative each left this tree's reading at 10,232 findings and 488 forms"
  ],
  "rejected": [
    {
      "option": "State the apostrophe and $'...' shapes as limits",
      "reason": "Both are regressions of round 1's own change against inputs the reader read before it, and each fix is one alternative in the same pattern."
    },
    {
      "option": "Rebuild the patterns from named fragments now (design F2)",
      "reason": "Maintenance with no failure, outside the round-2 admission rule."
    }
  ],
  "reopenWhen": "Round 3 finds a fix not held or a new criterion-4 miss introduced by these fixes."
}
```

## WO-260-D031 — The repair's round 3, the last: one more pairing fix, the comment reader reads $'...', and the executor judges the final delta

```json
{
  "id": "WO-260-D031",
  "date": "2026-11-09",
  "dispatch": "resume: fix; the repair's review ladder, round 3 (one combined dotln-worker over the delta since round 2's tree), the ladder's last round",
  "decision": "Both round-2 fixes held. Judge the round's two findings before fixing either. F1 (blocking, criterion 4) is admitted, since D030's reopening condition is met: round 2's class kept a single-quoted piece inside a word only while it held no double quote, so --format='\"%s\"', the CSV idiom --pretty=format:'\"%h\",\"%s\"' or -c user.name='A \"B\" C' lost its opening quote, and its closing quote paired with the next single quote on the line and hid the git command between, inputs round 2's reader read. Writer: an author's ordinary text; open; introduced by round 2's fix; one alternative. Fixed with the reviewer's tried alternative: a single-quoted piece is also kept whole when its closing quote ends the word. F2 (note, criterion 4, not introduced by round 2) is admitted as a criterion-4 miss with a supported bash input: the comment reader did not read $'...', so an escaped quote and a later ' #' inside it began a false comment, while the argument reader's comment already said $'...' is read. Writer: bash authors, none here; one alternative. Fixed with the same $'...' alternative in the comment reader. Three rounds have each moved where a mid-word quote pairs wrongly; that is the limit of a regular-expression reading the operator chose over a hand-written parser (D027), so the shapes this pairing still misses are stated in the module header, and FUP-d7ca8a89d9313a2b decides whether an existing parser should replace it. No reviewer runs after round 3: the executor judges the final delta by the surface cases, every shell text of the three rounds against sh or bash, the verifier's reproducer, and this tree's reading against round 3's, and records that judgment in the handoff.",
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-3/round-3-combined.md over tree 88bd90c6312bfc7858eeb572b3c5a4e29373a404: criteria.2.F1 and design.2.F1 held, design.2.F2 stands as recorded; 2 findings, 1 blocking",
    "The reviewer's scratch trial of the word-ending single-quoted alternative read all five of its texts, kept the suite's texts and the round-2 inputs at their results, and left this tree's reading at 10,235 findings and 488 forms; its trial of the $'...' alternative in the comment reader left the reading the same"
  ],
  "rejected": [
    {
      "option": "State F1's shape as a limit",
      "reason": "It is a regression of round 2's own change against inputs the reader read before it, as D030's were, and the fix is one alternative."
    },
    {
      "option": "Run another review round",
      "reason": "Round 3 is the ladder's last; the executor judges the remaining delta, which keeps the ladder from opening new fronts."
    }
  ],
  "reopenWhen": "The complete run fails on the reader, or a verifier finds a criterion-4 miss outside the stated limits."
}
```

## WO-260-D032 — Verification finds a remaining pairing across separate quoted assignments

```json
{
  "id": "WO-260-D032",
  "date": "2026-11-09",
  "dispatch": "resume: verify; WO-260, VER-002",
  "decision": "Close VER-001 F1 on its reproduced passing repair, but fail criterion 4 on one remaining quote-pairing miss. Two ordinary double-quoted assignments containing apostrophes can cause SHELL_ARGUMENT to consume the separate literal Git command between them as part of one word. The CLI admits ls-tree --format=plain in both a shell file and an embedded script, while the previous reader rejects it. Preserve separate command boundaries for this supported class and cover both carriers; the verifier changes only evidence and its allocated report. The existing no-hand-written-parser direction and the broader parser follow-up remain in force.",
  "goalAlignment": {
    "criticalPath": "The declared-floor check must reject a new literal Git form in the supported shell reading before that form reaches a Git 2.31 host.",
    "traps": {
      "ruleBeating": "The fourteen existing cases and complete gate pass. Reproduce the review worker's residual independently with a plain literal option, then compare the CLI, real shell/Git, the floor shim, the previous reader and five controls.",
      "scopeDrift": "Do not turn a concrete quote-pairing failure into a shell-language expansion or a hand-written parser. Keep repair to the supported class already pinned by D030 and the current test; the broader limitations stay on their existing follow-up."
    },
    "noOp": "No implementation edit is appropriate in verification. Passing the verdict would leave criterion 4 unmet; record one blocker and route the next repair through the existing order."
  },
  "evidence": [
    "docs/evidence/WO-260/verification-002-pairing.mjs: for msg=\"it's\"; git ls-tree HEAD --format=plain; note=\"dogs' toys\", host shell/Git exits 0, the floor shim exits 129, the checkpoint-5 reader returns 1, and the current CLI returns 0 with no missing-form diagnostic in both carriers; five control texts behave as expected.",
    "docs/evidence/WO-260/verification-002.json: the original F1 reproducer passes, 14 floor cases pass, 53 additional shell texts agree in 106 readings, the current corpus loses no reading outside the two changed source files, and the exact-identity complete review row passes 46 suites and 122 tasks.",
    "docs/control/local/reviews/WO-260/repair-3/round-3-combined.md: the F1 trial notes a residual with two apostrophes around an unquoted option. This verification reproduced the simpler --format=plain form through the CLI.",
    "WO-260-D030 explicitly admits an apostrophe inside a double-quoted assignment before a separate Git command as a supported criterion-4 input; the test at scripts/test-git-floor.mjs retains that input. Adding a second independent literal assignment is the discriminating variation.",
    "scripts/lib/git-surface.mjs:141-142: the word-ending single-quoted alternative pairs apostrophes from different double-quoted words across the command separator."
  ],
  "rejected": [
    {
      "option": "Pass from the fourteen existing cases and complete review run alone",
      "reason": "The independent supported fixture gains ls-tree --format and is admitted, contrary to criterion 4."
    },
    {
      "option": "Treat this as the already deferred shell-language expansion",
      "reason": "The script uses no substitution, multiline quote, redirection, template interpolation or expansion-valued option. The separate command after the quoted assignment is the D030 class the repair already claims and tests."
    },
    {
      "option": "Rewrite the reader during verification or demand a parser redesign",
      "reason": "The verifier does not edit the implementation. D027 and D028 require a proportionate repair and preserve the existing broader follow-up."
    },
    {
      "option": "Repeat the complete product gate",
      "reason": "Its current 46-suite review row is intact. Another identical run would not exercise the missing variation."
    }
  ],
  "followup": "WO-260's next resume: fix repairs VER-002 F1: preserve the literal Git command between separate quoted assignments, cover both carriers and retain the existing cases and corpus reading; broader shell parsing remains with FUP-d7ca8a89d9313a2b.",
  "reopenWhen": "The saved expected-refusal reproducer passes on a repaired candidate, the existing cases remain green, and current gate evidence covers the changed identity."
}
```

## WO-260-D033 — A quoted literal assignment ends at a shell separator

```json
{
  "id": "WO-260-D033",
  "date": "2026-11-09",
  "dispatch": "resume: fix; repair of VER-002 F1 under criterion 4",
  "operatorDirection": {
    "capture": "docs/intake/operator/wo260-ver002-repair-dispatch.txt",
    "sha256": "33f7e58017cd33a68cd48749ddd037083511a59cf7e63635fb1720dc9905323c"
  },
  "decision": "Repair the existing SHELL_ARGUMENT pattern's boundary after a literal double-quoted value following =: a blank, shell separator or end of line ends that value. Previously only a blank or end of line did, so a value immediately followed by a semicolon fell through to the single-quote alternatives and paired its apostrophe with another assignment's apostrophe across a separate Git command. The rule is that separate commands around these literal quoted assignments stay visible, regardless of blanks before the separator. This is one boundary change, with no new parser, dependency or expansion support. The existing shell-oracle case now covers the report's plain option and additional semicolon, &&, pipe and closing-parenthesis boundaries in both carriers, plus absence and real-comment controls. The original twenty texts stay in the case. The broader shell-reading limits remain on FUP-d7ca8a89d9313a2b. Release preparation retains v0.122.1; this repair changes scripts, their test and documentation, and no package component.",
  "goalAlignment": {
    "criticalPath": "Criterion 4 must refuse a new literal Git form between ordinary quoted assignments.",
    "traps": {
      "ruleBeating": "Only reproducing the report's semicolon would leave the same boundary error at other shell separators. The regression uses the shell's argument output for seven added texts in both carriers.",
      "scopeDrift": "Do not replace the reader or expand its shell-language contract during a bounded pairing repair; D027 and D028 preserve the operator's no-hand-written-parser direction."
    },
    "noOp": "The original verifier reproducer exits 1 with two unexpected admissions, so leaving the reader unchanged leaves criterion 4 unmet."
  },
  "evidence": [
    "docs/evidence/WO-260/repair-002.json: verification-002-pairing.mjs fails before the change and passes afterward in all twelve carrier/control readings; the host Git and below-floor shim retain the expected opposite results on the newer option.",
    "The bounded single test named keeps a quoted or escaped hash passes: twenty-seven shell texts, each checked in a shell file and an embedded script; twenty-three pass the option to the stand-in Git and four omit it. The shell, not the extractor, supplies the expected answer.",
    "The unchanged verification-002-surface.mjs passes all 106 readings of its 53 shell texts and the floor-mismatch check.",
    "The preserved VER-002 reader and repaired reader over the same current corpus each find 488 forms. Outside scripts/lib/git-surface.mjs and scripts/test-git-floor.mjs, both return the same 10,110 readings, with none added or removed. checkGitSurface returns exit 0.",
    "npm run release -- prepare --local: WO-260 target v0.122.1 remains current; local tag snapshot only. main and HEAD both read 9adc11723fdf9a5f2e3d52d3ee37d342b6fdddaa before the reviews."
  ],
  "rejected": [
    {
      "option": "Change every double-quoted piece inside a word to an indivisible word or replace the reader",
      "reason": "D029 records lost real-corpus readings from the broader pattern; the failing boundary can be corrected in the existing literal-value alternative without changing expansion handling."
    },
    {
      "option": "Change only the quoted option in the fixture or record the newer form as permitted",
      "reason": "That would hide the observed admission without fixing the supported input class or protecting the Git floor."
    }
  ],
  "reopenWhen": "A supported literal assignment followed by a separate command still hides its Git option, the existing shell cases regress, or the full gate fails on this changed identity."
}
```

## WO-260-D034 — Round one admits one literal-dollar finding and keeps the option name

```json
{
  "id": "WO-260-D034",
  "date": "2026-11-09",
  "dispatch": "resume: fix; repair of VER-002; independent review round one",
  "decision": "Judge all three round-one reports before fixing their one finding. Criteria F1 is admitted under criterion 4: a shell author's quoted or escaped literal dollar in a long option's value makes shellCommands discard the whole argument, admitting ls-tree --format although its name is literal. This is an open failure on a supported input, distinct from the repaired assignment pairing; the reviewer found the same classifier at checkpoint 9 by source inspection, not a prior execution. The design and consistency reviewers returned no findings. The bounded fix keeps a statically written long option name before = even when its value contains a dollar, without interpreting that value. This also reads the same literal name when its value expands; an option name or whole argument assembled at runtime remains unknown. The cost is one predicate alongside the existing dollar check, regression texts in the same shell-oracle case, and an accurate header/product write-back. Queue item adjacent-0002 records this repair within the order's existing Git-surface paths and shared checks. No package version or surface-record form changes. The original pairing repair remains intact.",
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-4/round-1-criteria.md: one blocking finding at reviewed tree 80d63058f5f4a17d005f33e0cf5b30cdb1023e4b; design and consistency reports at that tree have zero findings, and consistency includes its Traced consumers table.",
    "docs/evidence/WO-260/repair-002-dollar.json: four literal-dollar spellings in both carriers are admitted; real shell/Git prints the literal value and exits 0, the floor shim exits 129, and the plain option control is rejected. The reviewer ran one bounded expected-refusal test and it failed.",
    "A bounded comparison over eight texts in both carriers tried two fixes on scratch copies: remove protected quote/escape spans before classifying a dollar, or retain the long option name before =. Both fix all four reported literal forms. The second also records the literal name with a runtime value and continues to ignore runtime option names and whole arguments. Both retain 488 forms and a passing surface check; on the same corpus the first yields 10,251 readings and the second 10,276. No new form requires recording."
  ],
  "reopens": {
    "decisionId": "WO-260-D027",
    "observation": "The static name of a long option before = no longer needs its value to be literal. That part of the broader follow-up is discharged by name-only reading; the remaining substitution, redirection, multiline, interpolation and runtime-name limits stay with FUP-d7ca8a89d9313a2b. No value expansion is evaluated."
  },
  "rejected": [
    {
      "option": "Classify dollars by stripping single-quoted pieces and backslash escapes",
      "reason": "The comparison shows this fixes the examples, but it adds another interpretation of shell quoting just to recover an option name already written before =. Keeping the name avoids interpreting the value and follows the JavaScript reader's existing literal-option-head approach."
    },
    {
      "option": "Treat every dollar-bearing value as the existing expansion limitation",
      "reason": "The reported values are literal, explicitly supported by the current quoting rule, and the CLI admits a newer Git form. That does not satisfy criterion 4."
    }
  ],
  "reopenWhen": "The criteria recheck finds the literal name missing or a runtime option name mistaken for a known form, or a current gate exposes a consumer change."
}
```

## WO-260-D035 — Round two keeps dollar-bearing assignment values together

```json
{
  "id": "WO-260-D035",
  "date": "2026-11-09",
  "dispatch": "resume: fix; repair of VER-002; independent review round two",
  "decision": "Admit the criteria recheck's one new finding under criterion 4 before changing the code. The first-round option-name fix holds in all ten readings, but a literal dollar immediately before an assignment's closing double quote restores the cross-assignment pairing miss. The reported shell text is still the supported literal-assignment class of D033; the author can write it directly, the failure is open, and it does not require the broader parsing follow-up. Keep double-quoted values after = whole except where an unescaped $( or backtick needs to expose a command substitution. A dollar that does not begin $( is part of the value regardless of whether the shell treats it as literal text or a parameter; the reader need not interpret it. This adds one alternative to the existing word pattern, retains the boundary fix and the literal-option-name predicate, and adds both-carrier shell-oracle cases in the existing test. No new parser or dependency is authorized. The round-two code fix requires the ladder's final combined review; the executor judges any delta after that round.",
  "goalAlignment": {
    "criticalPath": "The supported quoted-assignment class must not hide a separate literal Git command.",
    "traps": {
      "ruleBeating": "Cover more than a terminal dollar: literal punctuation, escaped dollars, parameter values, both assignments, command substitutions, and absence/comment controls. Retain the existing shell-oracle texts and compare the current corpus.",
      "scopeDrift": "Distinguishing every shell parameter prefix would build another shell grammar. Preserve values without interpreting them and retain the existing substitution visibility and stated limits."
    },
    "noOp": "The round-two reviewer observed two unexpected CLI admissions while host Git succeeds and the floor shim refuses. Leaving the code unchanged leaves criterion 4 unmet."
  },
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-4/round-2-criteria.md: first-round F1 held fixed; one new blocking finding at tree 64668e22ddd701652a04ce6927f948a2f0eaae93.",
    "docs/evidence/WO-260/repair-002-assignment-dollar.json preserves the six before-fix readings: the literal-dollar assignment is admitted in both carriers, while the plain and escaped-dollar controls reject. Host Git exits 0 and the floor shim exits 129 for each text.",
    "scripts/lib/git-surface.mjs excludes every unescaped dollar from the quoted-value alternative, although only command-substitution openings need to remain exposed by that alternative."
  ],
  "rejected": [
    {
      "option": "Special-case only a dollar immediately before the closing quote",
      "reason": "The same quoted literal can contain a dollar before punctuation or a blank. The rule must preserve the value as a whole, not recognize one reproducer."
    },
    {
      "option": "Classify all shell parameter prefixes to retain only literal dollars",
      "reason": "The separate command is independent of the value's expansion, so interpreting shell parameter syntax adds cost without answering a necessary question."
    },
    {
      "option": "Keep every quoted value whole including command substitutions",
      "reason": "That would hide x=\"$(git ...)\" invocations the current reader and tests already expose."
    }
  ],
  "reopenWhen": "The final review or complete gate finds a supported command hidden, a runtime option name promoted, or an existing corpus reading lost."
}
```

Execution evidence for D035: [repair-002-assignment-dollar-after.json](repair-002-assignment-dollar-after.json)
records the six repaired CLI readings, all rejecting the missing option;
host Git still exits 0 and the floor shim 129. The bounded shell-oracle test
passes all 45 texts in both carriers: 39 pass the option to Git, six omit
it, and the check refuses the 37 with a statically written name while the
two runtime-name controls remain unknown. The ten additions cover literal
and escaped dollars, parameter values, both assignments, both substitution
spellings, and absence/comment controls. Comparing the round-two reader and
this reader on the current corpus retains 488 forms, with no added or lost
readings outside the two edited source files; the candidate surface check
exits 0. These focused results precede the final review and complete gate.

## WO-260-D036 — The final review and complete gate close this repair

```json
{
  "id": "WO-260-D036",
  "date": "2026-11-09",
  "dispatch": "resume: fix; repair of VER-002; closeout after the final review and complete gate",
  "decision": "The bounded assignment repair and its two admitted review findings are ready for independent re-verification. Round three found nothing new and held both fixes. The reviewed tree and complete-gate candidate are identical; no source changed after that review. The current review gate passes all 46 required suites and 122 fresh tasks, covering every Preflight suite and the plain selection. Settle D032's concrete repair follow-up FUP-3cc8812a22cb1395 on these results. The broader parser follow-up and the planning duty for WO-262 remain open. Complete the executor-owned handoff and final document gate before recording RepairCompleted; no verifier or final-review role is advanced here. The outcome matches the requested proportionate repair: the existing word pattern and option-name predicate close the supported failures without introducing a parser or dependency.",
  "evidence": [
    "docs/control/local/reviews/WO-260/repair-4/: round 1 criteria found one blocker, design and consistency found none; round 2 held that fix and found one new criterion-4 blocker; round 3 combined found none and held both fixes. The final report includes the Traced consumers table and its untested boundaries.",
    "docs/evidence/WO-260/repair-002-gates.json: npm test -- --review, recorded 2026-11-09T19:40:41.414Z, exit 0, 46 required suites, 122 fresh tasks, code identity 00cad38aa337787a27655fd20543fb4fe7eb4692ff1b0db51987e8027cf647c9 and reviewed tree 970f9fd71ec5549187835f7004f5e5720ea3b29b. A current coveringGateCheck consumes that row; the run took 3124489 ms.",
    "docs/evidence/WO-260/repair-002-assignment-dollar-after.json: both carriers reject the new finding, all 45 shell-oracle texts pass, the recorded forms remain 488 and no corpus reading outside the two edited files is lost.",
    "Main and HEAD were both 9adc11723fdf9a5f2e3d52d3ee37d342b6fdddaa before the complete run, so no integration was owed. The final review tree and complete candidate tree match."
  ],
  "rejected": [
    {
      "option": "Reuse the complete row from before VER-002's repair",
      "reason": "The reader and regression inputs changed. The repair needed and received a fresh complete row at its own identity."
    },
    {
      "option": "Add another review after the final combined round or the passing gate",
      "reason": "The required ladder is complete, with no new finding and no subsequent code delta; post-pass handoff write-backs are executor-owned."
    }
  ],
  "reopenWhen": "Independent verification reproduces another supported Git-surface miss, an accepted fix regresses, or the recorded complete/document coverage no longer matches the candidate."
}
```

Process corrections in this repair: the first final-review recording named only
round two, but the returned report rechecked findings from rounds one and two.
The recorder correctly refused the unmatched recheck; naming both prior reports
recorded the unchanged result. Read-only path guesses and an unmatched shell
glob were replaced by paths discovered from imports. A direct tree-to-worktree
diff again represented the two untracked source files as deletions; the canonical
working-tree snapshot instead confirmed exact equality with the reviewed tree.
One malformed tool call for a temporary continuation record had no effect and
was replaced by a shorter command. These were execution-apparatus corrections,
not product failures or changes to the reported review findings.

Document-gate correction, 2026-11-09: the first final `npm run test:docs`
failed `docs-check` because D033-D036's dispatch fields omitted the required
control prefix. Their same-session, unfiled dispatch labels now begin with
`resume: fix;`; the decisions and their evidence are unchanged. The index
is regenerated from those corrected fields. The later document tasks were
unrun dependents, not seventeen independent defects. This document-only
correction leaves the passing complete run's code identity unchanged.

## WO-260-D037 — VER-003 passes; a shorthand environment-name property is boarded as a follow-up

```json
{
  "id": "WO-260-D037",
  "date": "2026-11-09",
  "dispatch": "resume: verify; WO-260, VER-003 after the repair of VER-002",
  "decision": "Pass VER-003. VER-001 F1, VER-002 F1 and the repair's two admitted review findings stay repaired, and all seven criteria hold on independent probes at code identity 00cad38a with the executor's intact complete review row. One latent defect met in the attack is boarded as a follow-up, not a block: the JavaScript reading names a GIT_* identifier only after a member dot or before a colon in an object literal, so a shorthand property ({ ...process.env, GIT_CONFIG_GLOBAL }) hands a scoped GIT_* name to a child Git without the check naming it, although the module's own rule names an object key. Criterion 4's clauses name the ls-tree --format pair, the floor mismatch and the export list, and each holds; the tree holds no such shorthand, so the candidate's check is unaffected; no behavior main had changes. The shell shapes the module header leaves out behaved as documented and stay with FUP-d7ca8a89d9313a2b.",
  "goalAlignment": {
    "criticalPath": "Core's gate must refuse a new Git form above the floor before it reaches a Git 2.31.0 host.",
    "traps": {
      "ruleBeating": "The executor's 45 texts, VER-002's 53 and the complete row all pass, so a pass needs inputs they held constant: four carriers, program spellings and positions, quoting around a separate command, continued lines and the other newer forms, with the shell as the oracle.",
      "scopeDrift": "A documented limit or a constructed spelling is not a criterion failure. Widening the reading is FUP-d7ca8a89d9313a2b's question under the no-hand-written-parser direction, and the shorthand gap is one bounded follow-up."
    },
    "noOp": "No implementation edit: the verifier writes evidence, this decision and its report. Failing on a documented limit or on a latent gap no criterion names would reopen a repair loop the criteria have closed."
  },
  "evidence": [
    "docs/evidence/WO-260/verification-003-surface.mjs and verification-003.json: 84 cases and 299 readings. All 255 in-reading readings whose shell passes the option name the form at its file and line, across a .sh file, an extensionless shell file, a string in a .mjs file and a .ts template literal, with no shell error, false name or miss; the CLI names three samples with exit 1. The 44 limit and observation readings behave as the module header and shellCommands' outer-quote rule state, and the shorthand observation is unnamed.",
    "docs/evidence/WO-260/verification-003-corpus.mjs: over the current tree, the checkpoint-9 reader and the current one each find 488 forms; no reading outside the two changed files is lost; the 25 added readings are git --git-dir, already recorded; the current check exits 0.",
    "docs/evidence/WO-260/verification-003-floor.mjs: harness check and the host task's own command admit 2.31.0, 2.31.0.windows.1 and Apple 2.39.3, and refuse 2.30.9 naming >=2.31.0 and 2.30.9.",
    "docs/evidence/WO-260/verification-003-gates.mjs: the npm test review row of 2026-11-09T19:40:41.414Z at the exact code identity passes 46 suites and 122 fresh tasks and covers every Preflight suite.",
    "Independent bounded runs: scripts/test-git-floor.mjs passes 14 of 14; VER-001's and VER-002's reproducers exit 0; bash scripts/test-release.sh --case git_floor passes; npm run format:check passes; the standalone git-surface check exits 0 from the root and from two subdirectories.",
    "A search of scripts/ and packages/ finds no GIT_* name written as a shorthand property."
  ],
  "rejected": [
    {
      "option": "Fail criterion 4 on the GIT_* shorthand property",
      "reason": "Criterion 4's clauses name the ls-tree --format pair, the floor mismatch and the export list, and each holds. The shorthand concerns a GIT_* name the tree does not use, and product 07 routes a defect that breaks no criterion and no behavior main had to follow-up."
    },
    {
      "option": "Fail on the substitution-bearing assignment, the defaulted program or quotes inside an option's name",
      "reason": "The module header lists an option after a substitution and a double-quoted piece inside a word as outside the reading, D030 records the defaulted program as a run-time argument, and shellCommands removes only outer quotes. These shapes belong to FUP-d7ca8a89d9313a2b."
    },
    {
      "option": "Rerun the complete product gate",
      "reason": "The review row at the exact code identity is intact, ran every task fresh and covers every Preflight suite; another identical run exercises none of the varied inputs."
    }
  ],
  "followup": "The next order that edits scripts/lib/git-surface.mjs, or the planning pass that allocates this: name a GIT_* identifier written as a shorthand property in an object literal ({ GIT_CONFIG_GLOBAL }) as the reading names one before a colon, with a fixture case, so a scoped GIT_* name handed to a child Git outside its admitted files fails the check.",
  "reopenWhen": "A GIT_* name appears as a shorthand property in scripts/ or packages/, an in-reading literal Git form is shown hidden from the check, or the consumed complete or document row no longer matches the candidate."
}
```

## WO-260-D038 — Final review passes at the complete row's identity

```json
{
  "id": "WO-260-D038",
  "date": "2026-11-09",
  "dispatch": "resume: final review; the judgment of WO-260 through VER-003, allocated FINAL-001",
  "decision": "Pass WO-260 at code identity 00cad38aa337787a27655fd20543fb4fe7eb4692ff1b0db51987e8027cf647c9, the identity of the complete review row recorded 2026-11-09T19:40:41.414Z (46 required suites, 122 tasks all executed, exit 0, 0 h 52 min) and of VER-003's subject, computed here before this review wrote anything; the report records the recomputation after its writes. HEAD, main and origin/main all stand at the activation base 9adc11723fdf9a5f2e3d52d3ee37d342b6fdddaa after the integration's fetch, and npm run worktree -- integrate WO-260 took in nothing, so that row is the row at the integrated identity and no complete run is started here. VER-001's and VER-002's blockers reproduce as repaired, and every criterion holds on runs made again in this session under the bounded wrapper, outside any gate: the fourteen below-floor cases; harness check and the host task's own command under four version lines; the release fixture's git_floor case; the surface check on the candidate; the export case that asserts the kit's list omits the core-only task; and the gate-row probe. Criterion 5 stands on its fallback: a bounded inventory here finds Git 2.55.0, 2.54.0 and 2.50.1 and no 2.31.0, and D013 names the denied build. This review changes no source and no standing document. It writes the report, PR.md and RELEASE-NOTES.md, one probe with its observation record, and D038 to D041, and it refreshes the generated indexes through their commands. The kit guide, product 07, the README and the playbook are byte-identical to the tree the complete run judged (970f9fd71ec5549187835f7004f5e5720ea3b29b), so no guide byte rests on a product pass that did not read it. Two defects met in the review break no criterion and no behavior main had; D039 and D040 board them. The authority edition's carry under this order (docs/evidence/WO-260/authority/001, WO-259's transcript by reference) had no decision of its own: its cause is the one the order's Cost line states, two registered evidence sources changed, and the complete run's generated task judged it current. The order's evidence gate lists a status reading filed after implementation-ready; D024's reading stands, since the transition is in the control log this review read and no criterion names the file.",
  "goalAlignment": {
    "criticalPath": "The operator's test cycles on a Git 2.31.0 host start only after this release, so a truthful pass at the tested identity is the shortest route to them.",
    "traps": {
      "ruleBeating": "A pass resting on the standing row and three reports would repeat their coverage. Each criterion's entry point ran again here, and the review read what the verifications held constant: which directories the check lists, and the premise behind the fsck fallback.",
      "shiftingTheBurden": "Fixing either boarded defect here edits a judged source for a gap no supported input reaches today, moves the identity and owes another complete run of about 52 minutes, and for source-change-worktree.ts another live feedback episode. Both go to the next order that edits those files.",
      "driftToLowPerformance": "Scoping the kit guide's surface sentence by hand after the complete run would let a guide-only edit claim a cached product pass, the condition FUP-912adb42a652b75f names. The guide stays as judged and D039 names the sentence."
    },
    "noOp": "Holding or failing the order keeps every gate refusing the Git 2.31.0 host, for two defects that leave the candidate's own Git forms at or below the floor."
  },
  "evidence": [
    "docs/evidence/WO-260/final-review-001.json: the subject, the consumed row, the reproductions with their exit codes, the record compared with the tree (10,306 readings, 488 forms, 474 recorded and 14 scoped, none stale, none missing), the installed-harness diff reduced to digest substitutions, the Git inventory and the clean-room scan",
    "npm run worktree -- integrate WO-260, 2026-11-09 about 20:57 UTC: 'Integration took in nothing: the worktree is not behind main.'; git rev-parse HEAD origin/main: 9adc11723fdf9a5f2e3d52d3ee37d342b6fdddaa each",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-260/verification-003-gates.mjs: the npm test review row of 2026-11-09T19:40:41.414Z at the current identity, every task executed and passed, no Preflight suite missing; no failed npm test row at that identity after it",
    "git rev-parse 970f9fd71ec5549187835f7004f5e5720ea3b29b:<path> against git hash-object <path> for docs/KIT.md, docs/product/07-execution-guide.md, docs/product/08-publication-compiler.md, docs/PLAYBOOK.md and README.md: equal for each; the seven tracked documents that differ from that tree are control records, this order's decisions and handoff, and three generated indexes",
    "git diff refs/dotln/checkpoint/WO-260/2 over scripts/lib/node-engines.mjs, scripts/structural-checks.mjs, scripts/harness.mjs, scripts/test-runner.mjs and package.json: empty, so the floor's judgment and its three callers are unchanged since implementation-ready, where docs/evidence/WO-260/criterion-2-floor.txt recorded the exact npm test -- --only host runs",
    "The whole diff over 9adc1172 read: 69 changed files (1,175 insertions, 634 deletions) and 44 added ones; docs/KIT.md's and product 07's diffs replace the sentences the floor made wrong and add no dated account"
  ],
  "rejected": [
    {
      "option": "Start another complete run",
      "reason": "The identity, not the dispatch time, says what was tested: the complete review row stands at the integrated identity and this review changes no source."
    },
    {
      "option": "Repair D039's or D040's defect in this review",
      "reason": "Each needs a source edit that moves the identity for a defect outside the criteria that breaks no behavior main had; product 07 routes such a finding to follow-up."
    },
    {
      "option": "Scope the kit guide's sentence about the recorded forms here",
      "reason": "Product rows are reused by code identity, which leaves documents out, so a guide edit after the complete run would be judged by no product suite that reads the guide."
    },
    {
      "option": "Run npm test -- --only host under a Git that reports 2.30.9",
      "reason": "A refused selection records a failing host row at this identity, which would displace the complete row's. The host task's own command and harness check were run instead, and the executor's exact-command record stands over unchanged sources."
    }
  ],
  "reopenWhen": "A supported input reproduces a criterion failure or a regression against main after the merge, the complete row at this identity is found not to stand, or the laptop instance reports a Git 2.31.0 failure at a call site this order changed."
}
```

## WO-260-D039 — The surface check does not read the kit's corpus scripts; boarded

```json
{
  "id": "WO-260-D039",
  "date": "2026-11-09",
  "dispatch": "resume: final review; FINAL-001 finding F1",
  "decision": "Board, not fix. The Git surface check lists the files under scripts/ and packages/ (readGitSurface), and the kit also carries six script files under corpus/ as test support (TEST_SUPPORT_FILES in scripts/launchpad.mjs). Two of them call Git: corpus/mutation/mutate.mjs and corpus/mutation/wo108-selftest.test.mjs. Read with the check's own reader, the six name thirteen forms. Twelve are recorded; apply --unidiff-zero is not, and Git 2.31.0's git-apply.txt documents it. So the candidate names no form above the floor in those files, and criterion 4's clauses hold: the candidate's exit 0, the fixture's ls-tree --format with its file and line, the floor set apart, and the export's list. Main had no such check, so no behavior main had changes. What stays open is the gate: a newer form added to a kit-carried file outside the two directories passes core's check and reaches an instance, and the kit guide's sentence that each Git form the kit's scripts and tests name is recorded overstates the record by that one form. Class escape: the two directories were in the verified subject and inside the verifications' scope, and D011 states them. Reading the carried files is a change to the reader, its record and its cases, not a cleanup inside the Boy Scout bound.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-260/final-review-001-corpus.mjs: exit 0; six carried script files outside scripts/ and packages/; the check reads no file outside its two directories; over copies placed under scripts/ of a scratch tree holding the real record it exits 1 with 'Git form not in scripts/lib/git-surface.json: apply --unidiff-zero (scripts/corpus/mutation/wo108-selftest.test.mjs:331)'; over this repository it exits 0",
    "Git 2.31.0's Documentation/git-apply.txt line 135 names --unidiff-zero (the manual text an earlier session fetched into its scratch)",
    "git grep over the tracked files outside scripts/, packages/ and docs/ for GIT_CONFIG_GLOBAL, GIT_CONFIG_SYSTEM, --show-ref-format, --no-references, check-attr --source, ls-tree --format, --no-recurse, worktree list -z, is-needed and stash show --include-untracked: no match",
    "docs/KIT.md §First steps: 'Each Git form the kit's scripts and tests name is recorded as confirmed against Git 2.31.0's manual'; WO-260-D011: the reading covers the tracked and untracked files under scripts/ and packages/"
  ],
  "rejected": [
    {
      "option": "Fail criterion 4",
      "reason": "Its four clauses hold, and the carried files name nothing above the floor; a wider reading is a design improvement the criterion does not name."
    },
    {
      "option": "Add corpus/ to the reading and record the form in this review",
      "reason": "It edits the reader and its record after the complete run, needs a fixture case and a reading of every corpus file the new directory brings in, and moves the identity for a gap no form reaches today."
    },
    {
      "option": "Record apply --unidiff-zero alone",
      "reason": "A form the reading does not find is a stale entry that --record would drop."
    }
  ],
  "followup": "The next order that edits scripts/lib/git-surface.mjs, or the planning pass that allocates this: have the Git surface reading list every script file the kit carries, including the test support files outside scripts/ and packages/ that scripts/launchpad.mjs names, taken from the kit's own file lists rather than a third hand-written directory; record apply --unidiff-zero once it is confirmed against the floor's manual; and add a fixture case whose carried file outside the two directories gains a newer form. Until then the kit guide's sentence about the recorded forms is true of scripts/ and packages/ only.",
  "reopenWhen": "A kit-carried file outside scripts/ and packages/ names a Git form above the floor, or the kit's support list gains another file that calls Git."
}
```

## WO-260-D040 — The fsck fallback's premise is wider than Git's record; boarded

```json
{
  "id": "WO-260-D040",
  "date": "2026-11-09",
  "dispatch": "resume: final review; FINAL-001 finding F2",
  "decision": "Board, not fix. SourceChangeWorktree.verify is right to run fsck once without --no-references when Git exits 129 on it, and the case under the below-floor Git admits a sound candidate. Its stated premise is wider than Git's own record. The comment over the call, the note of the scoped fsck --no-references entry in scripts/lib/git-surface.json and D008 each say that a Git lacking the option checks no reference database. Git 2.48.0's release notes say git fsck learned to warn on curiously formatted ref contents, and Git 2.50.0's that it became more careful when checking the refs, while the planning record dates --[no-]references to Git 2.50 from the manual at tags v2.49.0 and v2.50.0. So on Git 2.48 and 2.49 at least, fsck checks references and has no option to skip that. There the fallback also runs the reference check the option exists to exclude, and a candidate whose shared reference database fails it is refused: a closed failure on a sound candidate. On main those Gits exit 129 on the option and refuse every candidate, so no behavior main had breaks, and no criterion names those versions; the floor's own Git 2.31.0, given an explicit head as verify gives one, takes no reference as a head, as the premise says. Class escape: the statement was in the verified subject and inside the verifications' scope. The comment is in a judged feedback source and the note in the recorded surface file; correcting either moves the code identity and owes a complete run, and the comment a live feedback episode as well, so both wait for the next order that edits those files. D008 is a dated record and stays as written.",
  "evidence": [
    "packages/skeleton/src/source-change-worktree.ts, the comment over verify's fsck: 'A Git before 2.50 lacks that option and exits 129 on it; such a Git checks no reference database'; scripts/lib/git-surface.json, scoped entry fsck --no-references: 'since a Git without the option checks no reference database'",
    "Git's release notes as installed with Git 2.55.0: RelNotes/2.48.0.adoc line 118, '\"git fsck\" learned to issue warnings on \"curiously formatted\" ref contents'; RelNotes/2.50.0.adoc line 102, '\"git fsck\" becomes more careful when checking the refs'",
    "docs/planning/work-order-map.md, the WO-260 row's dated reading: fsck --[no-]references is of Git 2.50 (Git's manual at tags v2.49.0 and v2.50.0); git fsck -h on Git 2.55.0 lists --[no-]references, 'check reference database consistency'",
    "Git 2.31.0's Documentation/git-fsck.txt names --[no-]dangling, --no-reflogs, --full and --strict and no reference option, and says references are heads only when no object is given",
    "scripts/test-git-floor.mjs, 'the source-change admission under the floor Git admits a sound candidate': pass in this review's bounded run of the fourteen cases"
  ],
  "rejected": [
    {
      "option": "Correct the comment and the note in this review",
      "reason": "Both are code-identity inputs and the comment is in a FEEDBACK_SOURCE_PATHS file; a wording correction would cost a complete run and a live episode."
    },
    {
      "option": "Change the fallback for Git 2.48 and 2.49",
      "reason": "A version switch at a call site is the order's non-goal, and those Gits have no way to skip the reference check; the stricter check there fails closed."
    },
    {
      "option": "Fail a criterion on it",
      "reason": "Criterion 1's clause, that verify admits a sound candidate under the floor Git, holds, and main refused every candidate on the affected Gits."
    }
  ],
  "followup": "The next order that edits packages/skeleton/src/source-change-worktree.ts or scripts/lib/git-surface.json: correct the comment over verify's fsck and the note of the scoped fsck --no-references entry to say that Git 2.48 and 2.49 check references in fsck and have no option to skip it, so the fallback there also checks the shared reference database and can refuse on it; and decide whether such a refusal should name that cause.",
  "reopenWhen": "A source-change candidate is refused on a Git from 2.47 to 2.49 for a shared reference that fsck reports, or Git's own records show that fsck checked no references before 2.50."
}
```

## WO-260-D041 — One register row is deferred again with its condition named

```json
{
  "id": "WO-260-D041",
  "date": "2026-11-09",
  "dispatch": "resume: final review; npm run plan -- followups --touching (30 pending rows name a file this change touches or the order)",
  "decision": "Dispose one row and leave the others as matched. FUP-1fa649b8d330505b (WO-255-D022, a third required Traced consumers row for tests and fixtures that list things by hand) is deferred again because its condition occurred a fourth time: this order's first complete run failed in scripts/test-verifier-gate-claims.mjs on that fixture's hand-written list of the six structural tasks, after round 1's consistency fix made a core handoff require the seventh, and neither that round's consistency review nor its recheck traced the fixture (D021). The row still waits for a planning pass, since the third row changes the emitted brief and the helper's report check. Left as matched, their conditions not having occurred: 26 deferred rows, among them FUP-23aca17371cf7b86 (this order edits gateCodeIdentity's classification in packages/skeleton/src/gate-evidence.mjs and leaves the gate-row reader alone), FUP-be6721fbdd4b6285 and FUP-911dc28a35dc4c44 (the main-intake case moved out of outsideWriteResponse unchanged; the target-worktree resolution is untouched and the row's present condition is a measured cost), FUP-f7d10bd1d1d72b42 and FUP-6606e739a1ae8678 (the prune's one edited line reads the reference backend), FUP-dfde4050da06d43b (each complete run started after its ladder finished, and none was paid on changing code), FUP-c61f76f60798e1b2 and FUP-d91a2e2780a65b70 (no role root changed), FUP-912adb42a652b75f (no guide byte changed after the complete run; D038), and five rows matched only through the base name of scripts/fixtures/git-below-floor/git, which is the word git. The order's own three untriaged nominations (FUP-d7ca8a89d9313a2b, FUP-c052a580e9f69291 and FUP-0122789e67993b48) and the two this review adds (D039, D040) are the planning pass's to triage.",
  "evidence": [
    "npm run plan -- followups --touching at register revision d7bf18f6cc17726601f39cb8bb5151462122117227df85c25d1ed16f7107345b: 275 pending rows, 30 matched over five pages (27 deferred, 3 untriaged), each read with its reason and reopening condition, and five in full with --show",
    "docs/evidence/WO-260/decisions.md D021: npm test -- --review of 2026-11-09 05:00 to 05:02 UTC, 8 passed and 38 failed, resume failing at scripts/test-verifier-gate-claims.mjs with 'Handoff rows missing or failed: structural'; the grep that found the hand-written structural list in that file only",
    "git status in the wo-260 worktree: no path under .claude/skills, .agents/skills or packages/skeleton/src/loadouts is changed",
    "npm run meta registered D039's and D040's follow-ups as FUP-0c05d0b507dcd53f and FUP-7fe71f232887391b (277 pending rows, 32 matched, revision 8933276c36dade370db6c63c67bade4fa43e8a74e599a0b24959d71a4c944469); npm run plan -- followups --apply docs/control/local/followup-request.json then applied the one request against that revision: FUP-1fa649b8d330505b deferred, revision 7dbdadcbb216383c803aede1b956e3c0e19424e8c86e2860d07e44d0b8f51d5c after the write"
  ],
  "rejected": [
    {
      "option": "Triage the order's own nominations here",
      "reason": "Triage is the planning pass's; the final review disposes only a row whose seam the change opened or whose condition occurred."
    },
    {
      "option": "Defer FUP-23aca17371cf7b86 again as WO-258's review did",
      "reason": "WO-258 edited the file the row names; this order edits another function of the module that holds the gate-row reader and does not open the reader's seam."
    },
    {
      "option": "Leave FUP-1fa649b8d330505b as matched because structural tasks are not among its named kinds",
      "reason": "The failure is the one the row describes, a consistency fix whose hand-listed consumer was not traced; reading the kinds narrowly would hide a fourth occurrence from the pass that allocates it."
    }
  ],
  "reopenWhen": "A later pass reads one of the left rows' conditions as met by this order, or the re-deferred row's condition occurs again."
}
```
