# WO-224 decisions

## WO-224-D001 — Capture the baseline before edits

```json
{
  "id": "WO-224-D001",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Retain the existing activation and sibling records, and record the launchpad-only baseline in README.md before modifying the implementation.",
  "evidence": [
    "Canonical resume status and the next dispatch select WO-224; Git HEAD is 5ad686d1.",
    "Source reads find a single launchpad freeze path and existing no-remote and refs witnesses."
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "The authorized work order identifies the missing target subject route."
    },
    {
      "option": "Replace the freeze machinery",
      "reason": "The existing confinement path already supplies the required behavior."
    }
  ],
  "reopenWhen": "The baseline cannot be reproduced from the cited source at the recorded base."
}
```

## WO-224-D002 — Resolve the registered clone and a committed subject

```json
{
  "id": "WO-224-D002",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Use running, primary, then main checkout clone maps after checking the registration. Resolve an omitted target commit at its already fetched origin base-branch ref; do not fetch or move refs. Parameterize the existing freeze and keep its scratch lane owned by the launchpad. Include the registration id in target hashes while preserving launchpad hashes.",
  "evidence": [
    "target-record-reader.mjs establishes the lookup order; target-worktrees.mjs owns the ignored map.",
    "The paired target fixture selects the fetched base by default and a different local HEAD only when named explicitly; execution results belong to handoff.md."
  ],
  "rejected": [
    {
      "option": "Default to the local branch HEAD",
      "reason": "A local ahead commit is not the fetched base the order names."
    },
    {
      "option": "Freeze an order worktree",
      "reason": "The subject is the registered clone at a recorded commit, not live work."
    }
  ],
  "reopenWhen": "A registration changes its base convention or the fetched-ref subject fails to resolve."
}
```

## WO-224-D003 — Keep source and launchpad witnesses distinct

```json
{
  "id": "WO-224-D003",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Bind the target commit tree in its recorded clone, witness target refs/status before and after, and record launchpad status separately without refusing its drift. Supply the existing compiled lenses with safe tracked file scopes condensed to existing directories, without truncating later implementation scopes from the frozen target census. Preserve questions, budgets and no-fix boundaries; an empty safe census supplies no lens briefs.",
  "evidence": [
    "The protocol accepts any string repository and compileReviewerWorkOrder accepts lensBriefs.",
    "Default lens scopes name launchpad-specific directories; new fixtures require every target scope to exist and exclude those defaults."
  ],
  "rejected": [
    {
      "option": "Reuse the default path scopes",
      "reason": "They name absent directories in the target fixture."
    },
    {
      "option": "Edit the protocol or loadout",
      "reason": "The existing extension points cover the subject and scopes without a new schema or evidence edition."
    }
  ],
  "reopenWhen": "The first live target review cites absent target paths or most survivors are declined as launchpad-shaped."
}
```

## WO-224-D004 — Refute the same repository and commit

```json
{
  "id": "WO-224-D004",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Resolve the review receipt repository and commit again, freeze it through the same path, preserve blinding, and bind the target source tree at filing. Keep clone paths only in ignored pending state; a changed clone mapping refuses filing. Retain the repository id and workstream context in the immutable refutation receipt.",
  "evidence": [
    "beginEntropyRefutation previously reset repository to dot and cloned the launchpad.",
    "New target fixtures check clone refs/status before and after both episodes, push refusal from each frozen copy, and missing-tree and changed-mapping filing refusals."
  ],
  "rejected": [
    {
      "option": "Use the current base tip for refutation",
      "reason": "That can differ from the reviewed commit."
    },
    {
      "option": "File the pair into the target",
      "reason": "The launchpad owns the existing receipt chain and dispositions."
    }
  ],
  "reopenWhen": "A target receipt cannot be refrozen or the source mapping must intentionally move during a live dispatch."
}
```

## WO-224-D005 — Name candidates and select consumption by subject

```json
{
  "id": "WO-224-D005",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Include the review id and repository@commit in target candidate headings and bold titles, retaining the collector and allocation mechanism. Selected target/workstream subject reports retain every undisposed survivor and packet; default launchpad consumption keeps its prior behavior and excludes target receipts.",
  "evidence": [
    "The follow-up collector extracts row titles from bold candidate text.",
    "The target fixture exercises plan followups --sync and --apply to a workstream member; partial dispositions remain consumable in the new selected forms."
  ],
  "rejected": [
    {
      "option": "Change the register schema",
      "reason": "Existing rows already allocate to any launchpad order."
    },
    {
      "option": "Treat the first disposition as completion of a selected target receipt",
      "reason": "That would hide remaining survivors in a workstream pass."
    }
  ],
  "reopenWhen": "An accepted target finding cannot be identified or allocated from its register row."
}
```

## WO-224-D006 — Make a workstream a resumable sequence

```json
{
  "id": "WO-224-D006",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Read only the selected workstream document through docPath(root, workstreams), validate its block and all registration ids before cloning, deduplicate in membership order, and record id, sequence and member set in each receipt. Refuse membership changes during an unfinished sequence. A finished subject reports complete; an explicit later review starts the next numbered sequence. Self uses an explicitly named launchpad HEAD, admitting launchpad receipt edits between members. CLI selection accepts one repository or workstream and at most one commit, and refuses workstream commits.",
  "evidence": [
    "The settled kit template uses members[].repositoryId and implicit self.",
    "The existing pending pointer permits one review per launchpad; receipt filing remains a separate command.",
    "The order requires two successive member dispatches and consumption in the same pass."
  ],
  "rejected": [
    {
      "option": "Composite frozen root",
      "reason": "It has no single repository commit or valid census."
    },
    {
      "option": "Reuse the full work-order index to read a subject set",
      "reason": "That imports unrelated order/index validation into a single document read."
    },
    {
      "option": "Restart automatically from subject",
      "reason": "A planning pass would never see its subject set as finished."
    }
  ],
  "reopenWhen": "Membership needs an authorized mid-sequence amendment, or two-repository survivors cannot be disposed in one pass."
}
```

## WO-224-D007 — Use real Git fixtures with synthetic workers

```json
{
  "id": "WO-224-D007",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Extend the existing entropy fixture family with isolated registered clones and workstreams, using the registration fields and local-map conventions of target-worktree-fixture. Test fetched-tip versus explicit-commit selection, witnesses, mapping precedence, confinement, filing failures, configured roots, duplicate members, self and candidate allocation under fake transport.",
  "evidence": [
    "Existing entropy fixtures drive the actual CLI main and receipt filing functions.",
    "The target-worktree fixture helper also provides local bare origins and public synthetic author identities; the new small clones avoid starting unrelated target lifecycle work."
  ],
  "rejected": [
    {
      "option": "Run live reviews to test routing",
      "reason": "The order explicitly assigns fake transport for mechanism checks and reserves the first live target review for the operator."
    },
    {
      "option": "Mock Git object selection",
      "reason": "It would not prove clone, ref, detach or push behavior."
    }
  ],
  "reopenWhen": "The fake route diverges from the shared source-selection or filing paths."
}
```

## WO-224-D008 — Exercise the exported instance

```json
{
  "id": "WO-224-D008",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Extend the existing real kit export fixture with a registered synthetic target, subject selection, fake review and receipt-chain check using the exported runtime.",
  "evidence": [
    "scripts/test-launchpad-planning.mjs already runs planning and entropy in an actual export.",
    "entropy.mjs and entropy-review.mjs are already carried kit files."
  ],
  "rejected": [
    {
      "option": "Add another export harness",
      "reason": "The established fixture covers the relevant package and command mapping."
    },
    {
      "option": "Only test core imports",
      "reason": "That would miss missing carried imports or runtime files."
    }
  ],
  "reopenWhen": "A kit export cannot resolve or review its registered target."
}
```

## WO-224-D009 — Preserve compiled source and evidence editions

```json
{
  "id": "WO-224-D009",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Leave entropy-review-protocol.ts and loadouts/entropy-reducer.ts unchanged. Record implementation decisions here and refresh the meta index; no deterministic evidence re-mint or live feedback episode is owed by these unchanged sources.",
  "evidence": [
    "The subject schema accepts registration ids; compile options already accept target lens scopes.",
    "The implementation diff changes scripts, tests and documents, not either named compiled source."
  ],
  "rejected": [
    {
      "option": "Bump the subject schema",
      "reason": "The existing shape expresses the target."
    },
    {
      "option": "Change the pinned actor",
      "reason": "The work order excludes that change."
    }
  ],
  "reopenWhen": "Implementation or independent review requires changing a registered compiled source."
}
```

## WO-224-D010 — Write the subject contract into the operator guides

```json
{
  "id": "WO-224-D010",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Update the review guide and product 07, 05 and 12 with target/workstream selection, explicit target binding, sequential filing, subject-qualified candidate titles and per-repository episode cost. Preserve the existing role text and actor pin.",
  "evidence": [
    "The active order names these exact write-backs.",
    "publication:check after the edits reports only two stale edition source locks; sync owns their regeneration."
  ],
  "rejected": [
    {
      "option": "Change planner role text",
      "reason": "The order expressly excludes it because product 07 supplies the subject token contract."
    },
    {
      "option": "Describe a whole workstream as one paid episode",
      "reason": "The mechanism dispatches one review per distinct repository."
    }
  ],
  "reopenWhen": "The guide disagrees with the shipped selector or completion behavior."
}
```

## WO-224-D011 — Prepare and validate the bounded delivery

```json
{
  "id": "WO-224-D011",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Prepare the declared minor release locally, with no package component bumps because no packages/*/src source changes. Finish two independent worker passes, format and sync, then run one complete review gate and the final document gate before implementation-ready. Do not run focused suites before a failed complete gate; the full gate covers all named Preflight suites.",
  "evidence": [
    "The executor skill and execution-plan step 11 assign the current complete-gate sequence.",
    "release.mjs componentVersionRules maps component changes to packages/*/src.",
    "docs/control/budgets.json allows 20 agents; entry usage observed zero. Two fresh read-only workers are planned, without descendants."
  ],
  "rejected": [
    {
      "option": "Run every older focused preflight before the complete gate",
      "reason": "Current role text says focused runs reproduce a named complete-gate failure and never precede it."
    },
    {
      "option": "Claim live target operation",
      "reason": "Only synthetic mechanism evidence is authorized for this order."
    }
  ],
  "reopenWhen": "A required gate fails, a reviewer finds a defect, or integration consumes the local release version."
}
```

## WO-224-D012

```json
{
  "id": "WO-224-D012",
  "date": "2026-10-24",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.97.0, the next minor above the observed release baseline v0.96.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.96.1 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-224-entropy-reducer-on-a-registered-target.md"
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

## WO-224-D013 — Repair the independent review findings

```json
{
  "id": "WO-224-D013",
  "date": "2026-10-24",
  "dispatch": "resume: next; independent worker review",
  "decision": "Report pending dispatches and consumable receipts before resolving a target clone. Require the current clone only for a fresh subject or a symbolic revision. A full recorded commit selects existing receipts directly. Preserve every safe target lens scope after condensing existing directories instead of silently truncating at 32. Skip absent receipt pairs in filedReviews, preserving the checker’s interrupted-filing route.",
  "evidence": [
    "The design worker identified early clone resolution: removing the ignored map prevented subject from reporting pending work or a consumable filed pair.",
    "The criteria worker identified a target with 32 flat documentation files whose src directory sorts after the old cap. The unchanged census remains whole-repository; the fix also preserves the lens checklist scopes.",
    "The criteria worker raised missing receipt pairs as a concern. Parent source inspection confirms checkEntropyReceipts explicitly permits a trailing filing event with no pair; the new filedReviews helper otherwise tried to read that absent file.",
    "Regression assertions cover pending and consume (including a full recorded commit) with a missing map, 32 documentation files plus implementation, excluded intake scopes, and subject after interrupted filing. Gate results are recorded in handoff.md."
  ],
  "rejected": [
    {
      "option": "Require the clone to consume a receipt",
      "reason": "Disposition is a launchpad action on an immutable receipt; it needs no target checkout."
    },
    {
      "option": "Keep an unexplained scope cap",
      "reason": "The lens compiler already accepts the condensed list; truncation needlessly drops actual implementation paths."
    },
    {
      "option": "Refuse interrupted filings from subject",
      "reason": "The existing checker treats an interrupted trailing pair as recoverable, not an unrelated-work failure."
    }
  ],
  "reopenWhen": "Recorded work still becomes inaccessible without a clone, or a large target needs an evidenced scope-budget policy."
}
```

## WO-224-D014 — Resolve lens boundary paths through the configuration owner

```json
{
  "id": "WO-224-D014",
  "date": "2026-10-24",
  "dispatch": "resume: next; complete gate repair",
  "decision": "Resolve the compiled validator's default document-base and intake paths through defaultDocRelative in targetLensBriefs. Keep the existing configuration-root guard and the target lens confinement unchanged. Restart the complete gate after formatting.",
  "evidence": [
    "The first npm test -- --review exited 1 after 13.811 seconds at code identity cc8dd2df785c1a7c4f53a4192ac77a2b31dc4abcddddb65129b8022847fe2b87. Format passed; configuration-root failed on three literal document-root regexes in entropy-review.mjs. Later suites were unrun.",
    "scripts/test-configuration-root.mjs requires all control-plane path literals to use scripts/lib/config.mjs. The lens validator excludes the default document base and default intake, so defaultDocRelative supplies the exact paths without adopting a target's unrelated configuration."
  ],
  "rejected": [
    {
      "option": "Exempt the new selector from the guard",
      "reason": "The existing configuration helper supplies the required paths; no exception is needed."
    },
    {
      "option": "Change the compiled lens validator",
      "reason": "Its established intake boundary and schema need no change."
    }
  ],
  "reopenWhen": "The compiled lens validator changes which roots it excludes."
}
```

## WO-224-D015 — Repair fixture inputs and rerun the complete gate

```json
{
  "id": "WO-224-D015",
  "date": "2026-10-24",
  "dispatch": "resume: next; complete gate repair",
  "decision": "Correct the new test inputs: supply a reopening condition for an allocated follow-up and normalize the entropy fixture parent through realpathSync before creating secondary worktrees. Preserve the existing register validation and entropy Git-root check. Reproduce the failed fixture family under the bounded wrapper, then rerun the complete gate.",
  "evidence": [
    "The second complete review gate exited 1 after 565.940 seconds at code identity e39011d6d59c46dba387d8293deb512c389f2156dd8b4ad9bc10893f1d2ce42b. The plan-refutation suite reported 104 passing tests and two failures in the new entropy fixtures; 13 suite tasks were unrun. The target-worktree aggregate is incomplete because its close and release tasks did not start, not because its executed start/publication tasks failed.",
    "planning-followups.mjs requires non-open dispositions, including allocated, to name a reopening condition; the fixture had supplied null.",
    "The existing entropy main compares the supplied root with Git's physical top level. The new secondary paths inherited the macOS temporary-directory alias while fixtureRepository already used realpathSync.",
    "node scripts/harness.mjs bounded -- node scripts/test-entropy-review.mjs --fixtures-only passed all 32 tests after the corrections (12.243 seconds host duration; 2026-10-24T21:56:22.796Z). This focused reproduction follows the named complete-run failure and does not replace the complete gate.",
    "The second complete run's launchpad-planning suite passed, including the exported target subject, review, receipt and chain checks."
  ],
  "rejected": [
    {
      "option": "Relax the register reopening contract",
      "reason": "The new fixture request was invalid; product validation is correct."
    },
    {
      "option": "Accept aliased entropy roots",
      "reason": "The existing physical-root boundary is correct; the new fixture paths must follow it."
    },
    {
      "option": "Compose passing old rows into a complete result",
      "reason": "The executor contract requires a fresh complete run after repairs."
    }
  ],
  "reopenWhen": "A corrected fixture fails again or real clone selection violates the preserved root contract."
}
```

## WO-224-D016 — Preserve historical launchpad subject semantics

```json
{
  "id": "WO-224-D016",
  "date": "2026-10-24",
  "dispatch": "resume: next; document gate repair",
  "decision": "Recognize target receipts by the separate launchpad witness introduced with them, not by a repository value different from dot. Historical absolute repository paths remain launchpad subjects for rendering, refutation, consumption and candidate text. Pending target dispatches use their recorded sourceRepository marker; historical paths never become live source locations. Preserve every committed receipt byte and add a synthetic historical-format lifecycle regression before a fresh complete review and final document gate.",
  "evidence": [
    "The first final document gate exited 1 after 164.668 seconds at code identity b91a56a74736533b66118bd83b5d3077e3bc57e2deb1f2c7a822fcd2040356e8: 26 suites passed and entropy rejected REVIEW-002.md as a changed projection. The earlier 37-suite complete review did not check the current committed receipt projections.",
    "Inspection of the failing receipt family shows older launchpad subjects stored an absolute repository path. The new non-dot condition incorrectly added target details and also misclassified those receipts during subject selection, refutation and candidate creation. The earlier claim that historical rendering was preserved was incorrect.",
    "The bounded entropy fixture family passes all 33 tests after the correction (13.851 seconds host duration, finished 2026-10-24T22:25:26.154Z), including a synthetic absolute-path receipt rendered without new details, refuted against the current fixture launchpad, consumed and accepted.",
    "The bounded node scripts/entropy.mjs check exits 0 at 2026-10-24T22:25:33.107Z: 13 current receipts, two pre-mechanism records, 35 dispositions, 12 packets and no interrupted filing. No committed receipt was edited.",
    "Both existing workers rechecked the correction. The criteria worker found one remaining response inconsistency: selected subject reported a historical pending refutation's raw absolute path. dispatchRepository now supplies both source resolution and the pendingRepository response; the historical regression asserts that pending self is dot."
  ],
  "rejected": [
    {
      "option": "Rewrite historical receipt Markdown",
      "reason": "The immutable control chain binds its original bytes; this is a reader compatibility defect."
    },
    {
      "option": "Suppress only the extra rendered line",
      "reason": "That would leave legacy refutation, consumption and candidate subjects misclassified."
    },
    {
      "option": "Use the old absolute path as the source clone",
      "reason": "It describes the historical launchpad and is not a current registered mapping."
    }
  ],
  "reopenWhen": "Another historical launchpad shape is misclassified or a newly filed target receipt lacks its separate launchpad witness."
}
```

## WO-224-D017 — Name the missing fetched base when a target subject cannot resolve

```json
{
  "id": "WO-224-D017",
  "date": "2026-10-24",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a non-blocking diagnosability follow-up. A registered clone that has no refs/remotes/origin/<baseBranch> ref, because it was never fetched or names its remote differently, refuses `entropy review --repository <id>` and `entropy subject --repository <id>` before any frozen copy is made. That refusal is correct, but its message is Git's bare `fatal: Needed a single revision`, which names neither the repository id nor the missing ref. No criterion covers an unfetched clone, and main had no target subject, so nothing regresses. The verifier leaves the implementation unchanged.",
  "evidence": [
    "Verifier probes (session scratch probe.mjs and probe2.mjs, bounded, 2026-10-24T23:01Z and 23:05Z): a registered clone with commits but no remote, mapped with recordRepositoryClone, gives both `subject --repository bare` and `review --repository bare --transport fake` the error `fatal: Needed a single revision`; the launchpad's entropy scratch lane stays absent.",
    "scripts/lib/entropy-review.mjs resolveSubject passes `refs/remotes/origin/${baseBranch}^{commit}` to `git rev-parse --verify --end-of-options` with no surrounding check naming the subject.",
    "The same probe confirms that the fetched base is used when the clone's origin/main is ahead of its local main, so only the absent-ref case is affected."
  ],
  "rejected": [
    {
      "option": "Fail a criterion",
      "reason": "Criteria 1 and 5 cover the fetched-base default and a missing clone mapping; neither names an absent fetched ref, and the refusal itself is correct."
    },
    {
      "option": "Fetch on the operator's behalf",
      "reason": "The order and the review guide say the command does not fetch; moving the clone's refs would change the witnessed subject."
    }
  ],
  "followup": "Entropy target subjects: when a registered clone lacks refs/remotes/origin/<baseBranch> and no commit is named, refuse with a message naming the repository id, the missing ref and the remedy (fetch the clone's base branch, or name a commit explicitly), before any frozen copy is allocated; add a fixture with an unfetched registered clone.",
  "reopenWhen": "An operator's target review or subject fails on an unfetched or differently named remote, or the subject resolution is next edited."
}
```

## WO-224-D018 — Target lens scopes must be ones the compiled validator accepts

```json
{
  "id": "WO-224-D018",
  "date": "2026-10-24",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a non-blocking follow-up. targetLensBriefs keeps a tracked top-level file as its own scope, so a target that tracks a file named exactly `docs` yields the scope `docs`. The unchanged compiled validator, validateLensFileScope, refuses `docs` as the intake ancestor, and the target review therefore cannot be dispatched at all. The refusal happens at compile time and leaves no frozen copy behind. No criterion names such a target, and main had no target route, so nothing regresses. The verifier leaves the implementation unchanged.",
  "evidence": [
    "Verifier probe (session scratch probe3.mjs, bounded, 2026-10-24T23:07Z): a registered clone tracking a top-level file `docs` plus `src/a.mjs` gives `review --repository bare HEAD --transport fake` the error `lens brief.files contains unsafe or intake-bearing scope docs`; the entropy scratch lane holds 0 entries afterwards.",
    "scripts/lib/entropy-review.mjs targetLensBriefs maps a one-segment path to itself; packages/skeleton/src/loadouts/entropy-reducer.ts validateLensFileScope refuses the normalized scopes `docs` and `docs/`."
  ],
  "rejected": [
    {
      "option": "Fail criterion 1",
      "reason": "Criterion 1's fixture target and its assertions hold; this concerns a rare target layout no criterion names."
    },
    {
      "option": "Change the compiled validator",
      "reason": "It is a registered source; the order keeps it unchanged, and the scope can be fitted on the host side."
    }
  ],
  "followup": "Entropy target lenses: targetLensBriefs must emit only scopes validateLensFileScope accepts, for example by omitting a top-level tracked file named `docs` (in any case) from the lens scopes while the whole-repository census still covers it; add a fixture whose target tracks such a file and dispatches.",
  "reopenWhen": "A live target review refuses with an unsafe-scope lens error, or targetLensBriefs or validateLensFileScope is next edited."
}
```

## WO-224-D019

<!-- integration refs/dotln/checkpoint/WO-224/6 -->

```json
{
  "id": "WO-224-D019",
  "date": "2026-10-24",
  "dispatch": "resume: final review; worktree integrate WO-224",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all 5ad686d170c71f432d2fafcb10225f2900630381 and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-224/6, 4212be43ce7da0f679c6237eb60c07f8dc13397c), retained its named stash fc119f28e99757179210637d734c45afe5318920, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (the meter snapshot docs/evidence/WO-224/meta.json), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks; git status before and after lists the same 19 modified tracked files and 4 untracked paths. No intake backup was named: docs/intake holds three tracked .gitkeep files and git ls-files --others --ignored --exclude-standard docs/intake lists nothing. Every acceptance claim carries forward unchanged: the code identity after integration is d79b29bb685f09198299c42bab18ca42aaf718ed78956ce1b27e13bc1dcedbee, the identity the executor handed off and VER-001 judged, so the passing complete review row at that identity (npm test with review selection, 2026-10-24T22:50:23.392Z, 103 fresh tasks over 37 required suites, none reused or unrun, identity unchanged across the run, exit 0, 1,310.057 s) stands for the integrated tree and no second complete run is owed. The three other printed affected checks pass on the integrated tree. The application version collides with nothing: the newest tag on main is v0.96.1, locally and in the complete row's shared-refs witness, and no v0.97.* tag exists locally or on origin; no component version changes because packages/ is unchanged from main. The evidence inputs are unchanged by integration: docs/evidence/current.json is not in the diff against main.",
  "evidence": [
    "refs/dotln/checkpoint/WO-224/6 (4212be43ce7da0f679c6237eb60c07f8dc13397c); docs/control/local/integration.json: preservationCommit 4212be43…, mergeCommit null, complete true, stage applied, untrackedConflicts [], resolved [], authored [], pending [], before and upstream 5ad686d1…; the helper printed Bases 5ad686d1 -> 5ad686d1, Authored conflicts: none, and nine Regenerated lines, at 2026-10-24T23:22Z",
    "git fetch origin main, then git merge-base HEAD origin/main, git rev-parse HEAD and git rev-parse origin/main before integration: each 5ad686d170c71f432d2fafcb10225f2900630381; git log --oneline origin/main..HEAD and HEAD..origin/main print nothing",
    "gateCodeIdentity from scripts/lib/gate-evidence.mjs before integration (the entry checks, before 23:21Z) and at 23:23Z after it: d79b29bb685f09198299c42bab18ca42aaf718ed78956ce1b27e13bc1dcedbee both times; the npm test row at that identity in docs/control/local/harness/checks.json: recordedAt 2026-10-24T22:50:23.392Z, gateSelection review, executionMode fresh, freshSuites 103, reusedSuites 0, unrunSuites [], identityUnchanged true, exit 0, 1,310,057 ms, 37 requiredSuites including plan-refutation, target-worktree, launchpad, launchpad-planning, skeleton and configuration-root, sharedRefs start and end both origin/main and main at 5ad686d1… with 182 tags and the newest v0.96.1",
    "Affected checks after integration under node scripts/harness.mjs bounded, 2026-10-24T23:23:03Z to 23:23:19Z, each exit 0: npm run publication:check (both editions CURRENT, 29 and 45 linked source sections match, 3 identical claim links per voice); node scripts/harness.mjs check (35 generated surfaces; local-terms list present); npm run release -- check-surfaces --local (the license surfaces and the seven publish refusals pass); npm run meta -- --check (the five standing budget breaches, 0 reopen candidates); git diff --check clean; npm run format:check: all matched files use Prettier style",
    "git describe --tags --abbrev=0 main: v0.96.1; git tag --list 'v0.97*' and git ls-remote --tags origin 'refs/tags/v0.97*' print nothing; git diff --stat main -- package.json package-lock.json packages/ .claude/ .agents/ prints nothing; git diff --stat main -- docs/evidence/current.json prints nothing",
    "find docs/intake -type f lists chats/.gitkeep, images/.gitkeep and notes/.gitkeep, each tracked; git ls-files --others --ignored --exclude-standard docs/intake prints nothing"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter snapshot and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration, and the code identity is unchanged."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "The identity, not the dispatch time, says what was tested; the passing complete row at d79b29bb… is the row final-review-result consumes, and a rerun would spend about 22 minutes of gate time to observe the same identity."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-24. Original base: `5ad686d170c71f432d2fafcb10225f2900630381`.
Fetched main: `5ad686d170c71f432d2fafcb10225f2900630381`. Checkpoint: `refs/dotln/checkpoint/WO-224/6`.
Named stash retained: `fc119f28e99757179210637d734c45afe5318920` (WO-224 integrate 2026-10-24).
Resolved projections: none.
Release preparation: WO-224 target v0.97.0 remains current. Files changed: docs/evidence/WO-224/meta.json. Meter snapshot: docs/evidence/WO-224/meta.json, 4057 bytes. Tag observation: local snapshot only.
Carried-forward claims: every acceptance claim carries forward unchanged at the unchanged code identity `d79b29bb685f09198299c42bab18ca42aaf718ed78956ce1b27e13bc1dcedbee`; the decision above records the evidence and [FINAL-001](../../final-reviews/WO-224/FINAL-001.md) the judgments.
Authored conflicts observed: none.
Affected checks: run after integration under the bounded wrapper, each exit 0 (the decision's evidence); the complete review row at the unchanged identity is reused rather than rerun.

## WO-224-D020 — Final review pass at the integrated identity; the three matched register rows stay as they are

```json
{
  "id": "WO-224-D020",
  "date": "2026-10-24",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-224 at code identity d79b29bb685f09198299c42bab18ca42aaf718ed78956ce1b27e13bc1dcedbee with all seven criteria met and no finding of its own; VER-001's two follow-ups stay boarded. The three register rows the touching query lists are left as they are: FUP-0056 is a textual match on product 05 whose seam (contributor equipment and host bindings) this order does not open; FUP-13db0bc45db31d8d (D017, the unfetched-clone refusal with Git's bare message) and FUP-53a2c609d6815549 (D018, a top-level tracked file named docs as a lens scope) are this order's own verification follow-ups, routed follow-up with reopening conditions tied to the first live target review, and a source repair here would move the code identity and owe a fresh complete run for code no verifier has judged; they stay untriaged for the next planning pass to allocate or defer. The review reuses the passing complete row at the unchanged identity rather than starting a second run, reran the entropy fixture family and the receipt-chain check at the integrated tree, and records one observation without a row: the default target subject, the clone's fetched base-branch tip, can be reachable from no local branch of the clone, and the frozen copy still holds it only because a local-path git clone copies the whole object store; a --no-local clone of the same source lacks that commit.",
  "evidence": [
    "VER-001 (sha256 217d665c7db64c99e1a9933946b030bc42ff1f809546417dd5429d1a05df2193, the hash the VerificationCompleted event records): verdict pass, seven criteria met, findings F1 and F2 routed follow-up and boarded as D017 and D018; the register rows FUP-13db0bc45db31d8d and FUP-53a2c609d6815549 exist with no disposition",
    "npm run plan -- followups --touching at register revision c719cc53…: 188 pending rows, 3 matched (FUP-0056 on docs/product/05-pattern-library.md; FUP-13db0bc45db31d8d and FUP-53a2c609d6815549 on WO-224); FUP-0056 is deferred since 2026-09-19 with reopenWhen 'host bindings and refusal evidence exist'",
    "node scripts/harness.mjs bounded -- node scripts/test-entropy-review.mjs --fixtures-only at 2026-10-24T23:23:19Z: 33 pass, 0 fail, 13,034 ms; bounded node scripts/entropy.mjs check at 23:23:32Z: status ok; bounded entropy subject --workstream WS-002: action review, sequence 1, repositories ['.'], repository '.'; entropy subject: action review, latestFiledReview REVIEW-007; entropy subject --repository self: action review, repository '.', baseCommit 5ad686d1…; git status --short unchanged by these reads",
    "Freeze-object probe (session scratch freeze-objects-probe.sh, bounded, 2026-10-24T23:21:39Z, 419 ms): in a clone whose refs/remotes/origin/main was one commit ahead of local main, git branch --contains the fetched commit listed 0 branches; git clone --no-hardlinks --no-checkout of the clone, origin removed, had the commit (git cat-file -e) and checked it out detached with the later file present; the same source cloned with --no-local lacked the commit. VER-001's probe 2 observed the same outcome through entropy review --repository itself",
    "The whole diff against main was read: scripts/entropy.mjs (the local flag parser at line 29, subjectOptions at 49, the usage block, review at 85 and subject at 147), scripts/lib/entropy-review.mjs (freezeSubject 374, receiptRepository 413, dispatchRepository 415, subjectSource 420, resolveSubject 460, subjectRecord 472, dispatchSource 498, bindReviewedTree 507, launchpadWitness 528, targetLensBriefs 543, beginEntropyReview 1282, fileEntropyReview 1470, beginEntropyRefutation 1675, fileEntropyRefutation 1860, candidateHeading 2054, appendCandidate 2061, workstreamRepositories 2270, filedReviews 2329, workstreamSequence 2337, matchesSubject 2368, unconsumedReview 2380, entropySubject 2458), the seven new cases of scripts/test-entropy-review.mjs (lines 215, 373, 403, 446, 588, 625 and 796) and the interrupted-filing assertion, the exported-instance case of scripts/test-launchpad-planning.mjs (lines 842 to 933), the four write-backs, the order's heading, the README's release line and the generated projections",
    "Clean-room screen: git diff main and the new records grepped for home paths, account names, e-mail addresses and credential shapes: no match; the fixtures use fixture@example.invalid and local bare origins; the untracked sibling receipt 2026-10-24T21-26-04-299Z.json is a blob of refs/dotln/checkpoint/WO-224/1 and git log main over its path is empty"
  ],
  "rejected": [
    {
      "option": "Repair F1 and F2 in this review",
      "reason": "Both are low-severity follow-ups outside every criterion with no behavior main had; a repair would change scripts/lib/entropy-review.mjs, move the code identity, owe a fresh complete run of about 22 minutes and ship code no verifier judged. Product 07 §Verification review and attack routes boarded follow-ups to the next repair within the Boy Scout bound."
    },
    {
      "option": "Defer or allocate the two untriaged rows here",
      "reason": "Allocation is a planning act; the rows carry their repair rules and reopening conditions from D017 and D018, and the next planning pass triages them with the register's other rows."
    },
    {
      "option": "Board the freeze-object observation as a follow-up row",
      "reason": "The behavior is correct and VER-001's probe 2 observed it through the real command; the observation names an implicit dependency for the maintainer, and a comment in freezeSubject would itself move the code identity."
    },
    {
      "option": "Start a second complete review run",
      "reason": "The code identity is unchanged by integration; the passing complete row at d79b29bb… is the row the result consumes."
    }
  ],
  "reopenWhen": "A live target review refuses at the frozen copy's checkout of a fetched base reachable from no local branch, or a registered clone is partial (a promisor remote or missing objects); a live target review or subject fails on an unfetched or differently named remote (FUP-13db0bc45db31d8d) or refuses with an unsafe-scope lens error (FUP-53a2c609d6815549) before the planning pass triages the row; or FUP-0056's host bindings and refusal evidence exist."
}
```
