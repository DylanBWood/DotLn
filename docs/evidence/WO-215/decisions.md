# WO-215 decisions

## WO-215-D001

```json
{
  "id": "WO-215-D001",
  "date": "2026-10-13",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.81.0, the next minor above the observed release baseline v0.80.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.80.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-215-release-close-refreshes-the-starter.md"
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

## WO-215-D002 — Publish only the verified starter commit through the declared binding

```json
{
  "id": "WO-215-D002",
  "date": "2026-10-13",
  "dispatch": "resume: next",
  "decision": "Implement the release-close effect after publication and cleanup, bound to core origin host and owner and each declared export sibling name. Use a disposable detached worktree; first-export from the initial commit when no kit manifest exists; otherwise use the existing update plan. Leave seeds and instance actions under their existing ownership rules.",
  "evidence": [
    "WO-215 design and criteria 1–6; operator dispatch resume: next",
    "The read-only base probe found one empty initial commit and no KIT-MANIFEST.json; README records the public observation.",
    "The local bare-remote fixture passes first export, update, current, behind, dirty, ahead, diverged, misbound, absent, later-release and failed-verification cases."
  ],
  "rejected": [
    {
      "option": "NoOp: retain manual starter updates",
      "reason": "The authorized outcome is that each core release reaches the starter without a hand-run step."
    },
    {
      "option": "Update and commit in the recorded checkout",
      "reason": "A failed verification would leave source edits needing cleanup; the disposable worktree confines them."
    },
    {
      "option": "Treat the initial starter as an ordinary update",
      "reason": "There is no manifest to update; first export must preserve unrelated initial paths and refuse type collisions."
    }
  ],
  "reopenWhen": "The sibling declaration, release effect or kit ownership contract changes; an instance needing actions still takes its own planning pass."
}
```

## WO-215-D003 — Keep verification and Git transport tied to the released sources

```json
{
  "id": "WO-215-D003",
  "date": "2026-10-13",
  "dispatch": "resume: next",
  "decision": "Verify by the exported tree’s own emit, exact predicted surfaces (the contract by its marked block), harness check and launchpad verify, then compare staged paths, raw blobs and modes with the verified tree and constrain the commit parent. Reuse one prepared bundle for first-export verification. Move the existing push helpers unchanged into github-repository.mjs and re-export them from target-publish.mjs so early refresh refusals do not import launchpad preparation. Fetch the bound URL through a host-owned bare lane too, importing its objects offline by bundle so checkout-local transport configuration is never re-admitted. Commits disable hooks and use the host identity and signing policy; no attribution is added.",
  "evidence": [
    "scripts/launchpad.mjs verifyExportTree; scripts/lib/starter-refresh.mjs",
    "The bounded transport comparison uses the same bound GitHub URL: a longer checkout-local rewrite sends the direct arm to a missing local remote (exit 128); the host-owned lane succeeds through only the fixture-global local mapping.",
    "The focused fixture passed with three kit preparations; first-export and update timing splits are in README.",
    "npm test -- --only target-publish passed after the unchanged push-helper move."
  ],
  "rejected": [
    {
      "option": "Fetch using checkout-local transport configuration",
      "reason": "The bounded comparison shows that configuration can redirect the URL despite a correct raw origin binding."
    },
    {
      "option": "Run npm ci or the kit’s test gate during release close",
      "reason": "Core review already exports these sources and exercises all three kit gate selections; the order specifies self-verification without an install or suite."
    },
    {
      "option": "Override signing to guarantee an unattended commit",
      "reason": "Host signing policy is retained; a failure becomes a retryable refresh blocker."
    }
  ],
  "reopenWhen": "Verification, transport binding or kit preparation changes; compare the affected lane again before adopting a different implementation."
}
```

## WO-215-D004 — Carry receipts with the next reviewed order and bind recovery to exact bytes

```json
{
  "id": "WO-215-D004",
  "date": "2026-10-13",
  "dispatch": "resume: next",
  "decision": "Write the unchanged five-field receipt to main’s ignored pending lane after publication. A current row repairs a missing receipt only when neither lane records its manifest hash. Worktree start validates before creating a branch, freezes paths and byte hashes after fetching, copies into the new launchpad worktree, regenerates its registry, and consumes sources last. Self recovery binds main, worktree, branch, base and authority; target recovery reuses its existing pending-start record. A captured source already consumed elsewhere is accepted only from the identical destination, and regeneration still runs. Newer pending receipts remain for the next start.",
  "evidence": [
    "WO-215 criterion 7 and the WO-078 receipt shape",
    "scripts/lib/siblings.mjs; scripts/siblings.mjs carryPendingReceipts; scripts/worktree.mjs completeSelfStart",
    "Passing siblings-fixtures, worktree and target-worktree probes cover malformed preflight, registry failure, the printed self-start retry, target carry, collisions, symlink parents, missing sources and a newer pending receipt.",
    "Read-only research review identified the cohort binding and destination-race checks before the implementation was applied."
  ],
  "rejected": [
    {
      "option": "Commit the receipt directly to core main",
      "reason": "The release-close authority forbids that push and the operator merges reviewed work."
    },
    {
      "option": "Open a second core pull request only for receipts",
      "reason": "This adds an unrequested publication and lifecycle."
    },
    {
      "option": "Leave the registry stale",
      "reason": "The next work order can carry the receipt in its ordinary reviewed change."
    },
    {
      "option": "Create another self-start journal or CLI flag",
      "reason": "A concrete programmatic retry shares the same completion helper and preserves the existing command surface."
    }
  ],
  "reopenWhen": "Receipt ownership or worktree-start recovery changes; retain exact-copy, registry-before-consume and collision refusal properties."
}
```

## WO-215-D005 — Treat refresh refusal as a close blocker without changing publication

```json
{
  "id": "WO-215-D005",
  "date": "2026-10-13",
  "dispatch": "resume: next",
  "decision": "Record one starterRefresh row and summary line per declared export sibling. A refusal adds a starter-refresh blocker with the existing retry command, returns nonzero and keeps the writer. Current and skipped rows do not block. The refresh contains its own failures and leaves publication and cleanup outcomes intact. Dry-run performs the bound fetch and checks but creates no refresh worktree, changes no checkout work-tree file, writes no receipt and pushes nothing. No declaration, target orders, lower versions and non-publishing closes attempt no refresh.",
  "evidence": [
    "scripts/release.mjs refreshPublishedStarters and releaseCloseSummary",
    "Passing release fixtures prove tag/Release success followed by missing-checkout or misbound refusal, current recovery, writer retention/release, dry-run and excluded close paths.",
    "Passing target-worktree close fixture declares an export sibling yet records no refresh row."
  ],
  "rejected": [
    {
      "option": "Report a successful close after a refused refresh",
      "reason": "The requested starter has not received the release; the session must retain the blocker."
    },
    {
      "option": "Reclassify the published release as failed",
      "reason": "The immutable tag and Release already exist and remain valid."
    }
  ],
  "reopenWhen": "The release publication contract changes; retries must still distinguish publication facts from unfinished refresh work."
}
```

## WO-215-D006 — Repair the shared floor check discovered by the refresh refusal fixture

```json
{
  "id": "WO-215-D006",
  "date": "2026-10-13",
  "dispatch": "resume: next",
  "decision": "Correct the assumption that ordinary harness emit already refuses a generated-block-only contract: composeHarnessInstruction checked only that the whole string was nonempty. Add the outside-block floor check there, before any writes, matching build:none. Remove the temporary refresh-only duplicate and extend the existing build:none fixture to exercise ordinary emit too. This is adjacent-0001, completed after the announced bounded repair and actor-attested steering check-in.",
  "evidence": [
    "scripts/lib/harness.mjs composeHarnessInstruction and emitHarness; scripts/test-harness.mjs existing build:none case",
    "The bounded focused ordinary/build-none regression passed with installed bytes unchanged on each refusal.",
    "npm test -- --only harness passed; the focused starter refresh still refuses the missing-floor case and pushes nothing."
  ],
  "rejected": [
    {
      "option": "Keep only the refresh-local guard and defer ordinary emit",
      "reason": "The same small check belongs at the shared composition boundary and is within bounded adjacent repair."
    }
  ],
  "reopenWhen": "The operating-contract representation changes; any replacement must still require a hand-written floor outside generated markers."
}
```

## WO-215-D007 — Stage the minor release and preserve edition history

```json
{
  "id": "WO-215-D007",
  "date": "2026-10-13",
  "dispatch": "resume: next",
  "decision": "Keep application target v0.81.0 and bump only the changed skeleton component from 0.58.1 to 0.59.0 for the added contributor release-close effect. Update its console dependency and lockfile pins without bumping unchanged components. Regenerate the 34 harness surfaces. The authority check reports stale bundle-diff bytes, so mint authority revision 001 under WO-215 and select it. The feedback check passes with its carried live audit and reports moved component labels; retain that edition. The harness check passes its historical live edition plus current generated surfaces, with no new live episode owed.",
  "evidence": [
    "WO-215 release classification; npm run release -- prepare --local; D001",
    "npm run build; npm run harness -- emit; npm run harness -- check",
    "node scripts/authority-evidence.mjs --check named stale WO-076 revision 001 bundle-diff.json; --write --edition WO-215 --revision 001 succeeded.",
    "node scripts/feedback-evidence.mjs --check passed ten regressions and ten removal failures; node scripts/harness-evidence.mjs passed four historical role and two historical writer smokes with 34 current generated surfaces."
  ],
  "rejected": [
    {
      "option": "Rewrite a filed historical edition",
      "reason": "Evidence editions are immutable; the changed authority output gets a new selection."
    },
    {
      "option": "Mint feedback evidence or run a new live episode despite a passing check",
      "reason": "Its executed check accepts the existing audit with component-label movement; no behavior change requires a new episode."
    }
  ],
  "reopenWhen": "A later source change stales an edition, or integration changes the release baseline; run the current checks and record the resulting edition or version choice."
}
```

## WO-215-D008 — Resolve publication and cleanup boundaries found by independent review

```json
{
  "id": "WO-215-D008",
  "date": "2026-10-13",
  "dispatch": "resume: next; independent self-review",
  "decision": "Fix all four unique findings from the two fresh, pinned read-only workers, including the follow-up recovery gap both identified. Compare raw blob hashes and modes for every allowed path, including unchanged index entries, with verified filesystem bytes and hash the committed manifest. Replace the checkout-local fetch with offline unbundle and tracking-ref update. Retain ignored cleanup ownership until every disposable resource is removed, and recover it before current or skipped can finish a later close. Journal the expected tree and parent before committing so cleanup can recognize a successful commit whose following record write failed. Bind scratch device/inode, physical parent, detached worktree and branch commit; delete the branch ref with its expected value. Keep dry-run read-only.",
  "evidence": [
    "Adversary found two issues: clean filters could change staged bytes after verification; cleanup failure after publication had no durable retry identity. Improver found one: the second fetch admitted checkout-local URL rewrites again.",
    "Final focused starter refresh and staged-tree fixtures passed on 2026-10-13T21:24:31Z: two tests, 21,589 ms Node process, three kit preparations total.",
    "The existing update injects removal failures before and after Git unregisters its worktree. The fixture also reconstructs the exact pre-commit journal after a successful commit. A dry-run preserves the record; the real retry returns current with no preparation, no new remote ref and no residual worktree, scratch directory, branch or record.",
    "The transport fixture includes a checkout-local rewrite of the temporary-directory prefix; the staged-tree fixture configures a transforming clean filter and observes refusal."
  ],
  "rejected": [
    {
      "option": "Trust the verified working tree after git add",
      "reason": "Clean filters and line-ending conversion can change index content; verification must name the published bytes."
    },
    {
      "option": "Assume current means cleanup finished",
      "reason": "The published manifest does not prove removal of a prior operation's disposable objects."
    },
    {
      "option": "Add a production fault flag or another kit preparation",
      "reason": "A fixture-only Git wrapper covers both cleanup failure stages in the existing update."
    }
  ],
  "reopenWhen": "Git staging, transport or cleanup ownership changes; preserve the exercised failure boundaries and refuse changed ownership instead of deleting it."
}
```

## WO-215-D009 — Judge the current launchpad performance watch from both fresh gates

```json
{
  "id": "WO-215-D009",
  "date": "2026-10-13",
  "dispatch": "resume: next; fresh review-gate measurements",
  "decision": "Retain the existing deferred FUP-b531e850b70f6d4e performance watch: none of its current reopening conditions occurred in either fresh review gate. Keep all three kit preparations and the three in-kit gate selections required by the order. Preserve the failing first run and the passing second run; D010 corrects the first run's role-oracle mismatch.",
  "evidence": [
    "docs/evidence/WO-215/gate-cost.json: fresh review recorded 2026-10-13T21:54:48.929Z; 96 fresh tasks, no reuse; 39 suites passed and process-debt failed its current role snapshot.",
    "Launchpad took 387576 ms, compared with 350967 ms at entry. Task span was 1626391 ms against 6160869 slot-weighted ms / 4 lanes = 1540217.25 ms, a 5.595% excess, below the watch's 10% condition.",
    "Launchpad was 6.291% of slot-weighted work, below 15%; it was not on the recorded critical path and its 387576 ms was below the longest vertical member, statements at 446176 ms.",
    "The watch's current disposition is dated 2026-10-13T16:53:33.872Z in docs/planning/followups.json; it supersedes the earlier twice-median condition.",
    "The passing review recorded 2026-10-13T22:27:09.680Z: 40 suites passed, zero failed, 96 fresh tasks, no reuse, 1611724 ms. Launchpad took 383163 ms (6.285% of slot-weighted work), was not on the critical path and was shorter than the longest vertical member at 441926 ms. Span 1611411 ms over the 1524018 ms slot-weighted bound differs by 5.734%, below 10%. All three reopening conditions remain false."
  ],
  "rejected": [
    {
      "option": "Reopen the fixture-cost work merely because this task reading increased",
      "reason": "The current watch concerns gate span, work share and the longest vertical member; none of those conditions occurred. These concurrent runs do not isolate a causal runtime increase."
    },
    {
      "option": "Remove required export verification or add another preparation to isolate a case",
      "reason": "The order requires three gate selections and caps added preparations at three; the focused case timings already separate the refresh phases."
    }
  ],
  "reopenWhen": "A fresh review gate's span exceeds its slot-weighted task time over its lanes by more than 10% with launchpad on its recorded critical path, launchpad exceeds 15% of that work, or the launchpad task exceeds the longest vertical member."
}
```

## WO-215-D010 — Preserve historical role snapshots while selecting the new release-close instructions

```json
{
  "id": "WO-215-D010",
  "date": "2026-10-13",
  "dispatch": "resume: next; review-gate correction",
  "decision": "Mint wo215-role-baseline.json as the current role snapshot in both economy-support settings, linking the unchanged wo191 snapshot by its exact byte hash and preserving its upstream chain. Select the new snapshot in test-process-debt. Generation refuses if any role other than release-close changed; historical files remain byte-exact. This completes the deterministic role-oracle update required by the authorized contributor instruction change.",
  "evidence": [
    "The first npm test -- --review failed the optional-economy historical-snapshot case in scripts/test-process-debt.mjs: it compared the new release-close instructions with the wo191-role-baseline.json current hash.",
    "The existing fixture documents the separate-oracle route for authorized role changes, verifies the historical hash chain and checks both support settings.",
    "The new snapshot preserves every non-release-close role hash. The release-close semantic diff is the declared export-sibling refresh, publication limits and refusal handling already reviewed for this order. The focused oracle check and the whole process-debt preflight passed; the latter completed at 2026-10-13T21:57:40Z.",
    "The corrected current snapshot also passed the complete npm test -- --review at 2026-10-13T22:27:09.680Z: 40 suites, zero failures, 96 fresh tasks."
  ],
  "rejected": [
    {
      "option": "Rewrite the wo191 snapshot or suppress its assertion",
      "reason": "That destroys the independent historical reference or stops checking current instructions."
    },
    {
      "option": "Restore the old release-close instructions",
      "reason": "The order requires the new publication effect and refusal contract in both role forms."
    }
  ],
  "reopenWhen": "A subsequent authorized role edit changes these bytes; preserve this snapshot and mint a new linked current oracle."
}
```

## WO-215-D011 — Verification: fail; criteria 6 and 11 are unmet because the dry-run preview misreports and the release-close row omits the refresh

```json
{
  "id": "WO-215-D011",
  "date": "2026-10-13",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001. At code identity 52824a36ba06b8d817012f2b3d5326347b2b8134b2929264ffd4eb7b3ba5cf3a, criteria 1 to 5, 7 to 10 and 12 are met and criteria 6 and 11 are unmet. F1 (blocking, criterion 11): product 07's `resume: release close` row in §Operator resume phrases — how you get dispatched is byte-identical to the base, so it does not say that the helper refreshes each declared export sibling with a recorded checkout, as step 13 and criterion 11 require. F2 (blocking, criterion 6): a release-close dry run taken before main is fast-forwarded, which is the state right after the operator merges the PR, prints 'Starter refresh <id>: skipped; main has moved past the published tag; the next release refreshes the starter.' It runs none of the refresh checks and no fetch, and its reason is false, because main is behind origin/main, not past the tag. F3 to F5 are boarded follow-ups. F3: a preview row reports outcome current for work that is still pending. F4: once the starter checkout is recorded at another path, a retained cleanup ownership record refuses every retry. F5: the generated sibling registry page still says receipts come only from launchpad export and --update.",
  "evidence": [
    "F1: line 273 of docs/product/07-execution-guide.md, the `resume: release close` row, is identical in git show HEAD and in the subject. Its last cell still reads 'update main, consume reviewer gate, publish validated tag and Release, attempt cleanup, and write docs/control/local/retained/WO-NNN/release-close.json; rerun from updated main if Release creation fails'. git diff HEAD -- docs/product/07-execution-guide.md has two hunks, at lines 1518 and 1538, and both are in §Workflow closeout and releases. Product 07 measures 194,742 bytes against its 212,313-byte ceiling in docs/control/doc-ceilings.json, so the write-back fits.",
    "F2 end to end: a session-scratch copy of scripts/test-release.sh with one added case ran under harness bounded at 2026-10-13T22:44Z. An export sibling is declared, and its starter checkout is recorded, clean and bound to a local bare remote. An integrator clone pushes the WO-099 candidate, so origin/main advances while main does not, as after a PR merge. `release close WO-099 --publish --dry-run` printed 'Starter refresh starter-fixture: skipped; main has moved past the published tag; the next release refreshes the starter.' After main was fast-forwarded by hand, the same dry run printed 'Starter refresh starter-fixture: current; would refresh <initial commit> to <merged head>.'",
    "F2 cause: in a dry-run close, head is origin/main's commit (scripts/release.mjs:2328 and 2406), and main is only checked for a possible fast-forward, not moved. refreshOne first compares main's HEAD with head (scripts/lib/starter-refresh.mjs:367-375) and returns skipped before it reads the clone map, checks the checkout or fetches. In a real close, updateMain makes HEAD equal head, and ensureExistingRelease requires the tag to target head (scripts/release.mjs:1676-1684). The skip can therefore fire only in a dry run, where it is wrong. The executor's dry-run cases run with main already at head: the release starter_refresh case runs its dry run after two closes, and the launchpad preview case runs it at futureHead.",
    "F2 module level, in session scratch under harness bounded: with main's HEAD at head^, refreshStarters with dryRun returns skipped with the same reason. With main at head and an untracked file in the checkout, the dry run returns refused, so the checks run only once main is at head.",
    "F3: dry-run rows record outcome current for pending work. These are 'current; would refresh <before> to <head>' (scripts/lib/starter-refresh.mjs:434-441) and 'current; would finish pending disposable refresh cleanup; preview writes nothing' (scripts/lib/starter-refresh.mjs:360-366). In the F4 probe, that preview says current while the real retry refuses.",
    "F4, in session scratch under harness bounded: after a first export, an update has its disposable worktree removal failed by the executor's own git-wrapper technique. The push lands, the row is refused and the ignored cleanup record is kept. A second clone of the starter is then recorded at a new path with worktree clone. Two retries refuse with 'refresh cleanup ownership does not match the recorded checkout', the dry run says 'current; would finish pending disposable refresh cleanup', and the record stays. A retry finishes cleanup and reports current only after the old mapping is restored. finishCleanup compares the record's checkout with the clone map (scripts/lib/starter-refresh.mjs:262-279). Neither the refusal reason nor product 07's Starter refresh paragraph names a recovery.",
    "F5: scripts/siblings.mjs:169 renders the preamble of docs/siblings/README.md as 'from the receipts `launchpad export` and `--update` write under docs/evidence/siblings/'. docs/README.md's evidence line now names the starter-refresh receipts that the next worktree start carries; the generated registry page does not.",
    "Reproduced without finding, all in session scratch under harness bounded, with the subject's own scripts: (1) A first export onto an empty-tree initial commit, the shape the executor's base observation records for the real starter, published one fast-forward commit whose tree equals a direct export of the same commit (944 entries each, same modes and blobs). kept and replaced were empty, AGENTS.md was a link, the message was the fixed template with no trailer, and a fresh clone passed launchpad verify, harness emit and harness check. The pending receipt named the committed manifest's hash. (2) Initial-commit collisions at README.md (a directory), AGENTS.md (a regular file) and scripts (a file) refused through firstTree, with nothing pushed, the checkout unchanged and no receipt or cleanup record. (3) A starter .gitignore that stops ignoring node_modules refused at the staged-set check, and a locally modified scripts/launchpad.mjs refused as a plan row, both with nothing pushed. (4) An update succeeded with the prior head as parent, and a fresh clone passed. (5) These refused with nothing pushed: a detached HEAD, a pushurl naming another owner, a symlinked or relative mapped path, core main itself, a malformed clone map, a manifest commit that is unrelated, unknown or missing, a malformed manifest, and a remote without main. Ignored-only files did not refuse, and a committed receipt suppressed a new pending receipt. No row named a local path. The executor's two focused starter tests, the release starter_refresh case, scripts/test-worktree.sh, the three clone and carry tests in scripts/test-target-worktree.mjs and the two pending-receipt tests in scripts/test-siblings.mjs pass in my runs."
  ],
  "rejected": [
    {
      "option": "Judge criterion 11 met because §Workflow closeout and releases carries the full Starter refresh paragraph",
      "reason": "Criterion 11 names the release-close row separately from §Workflow closeout and releases. Step 13 says the row's last cell adds the refresh. That row is the dispatch table a role reads first, and today it still lists only the tag, the Release, cleanup and the record."
    },
    {
      "option": "Route F2 as a follow-up because the dry run writes nothing and attempts no refresh",
      "reason": "Criterion 6 also requires the dry run to print the preview, and step 5 defines that preview as the checks with the fetch and `would refresh <before> to <head>`. Release close's dry run is meant for the state before main is fast-forwarded, as its own 'would fast-forward main' line says. In that state the preview prints a false skip and checks nothing, so an unrecorded, dirty or misbound checkout surfaces only after publication."
    },
    {
      "option": "Fail VER-001 on F3, F4 or F5",
      "reason": "None of them breaks a criterion or a behavior main had. F3's reason text is correct, F4 needs a cleanup failure followed by re-recording the checkout, and F5 is a stale sentence in a generated page."
    },
    {
      "option": "Spawn a worker to reproduce F2",
      "reason": "Every probe ran in this session. Product 07 §Verification review and attack admits a worker only for a named claim the verifier cannot run itself."
    }
  ],
  "reopens": {
    "decisionId": "WO-215-D005",
    "observation": "D005 says the dry run performs the bound fetch and checks. When main has not yet been fast-forwarded to the merged head, the dry run returns skipped at its main-HEAD comparison, before it reads the clone map, runs the checkout checks or fetches."
  },
  "followup": "WO-215 resume: fix. (F1) In product 07 §Operator resume phrases — how you get dispatched, add to the last cell of the `resume: release close` row, in place and with no date, that where the launchpad declares an export sibling with a recorded checkout, the helper then refreshes it with one fast-forward commit to that sibling's main. Keep product 07 under its ceiling, refresh the publication locks if a locked section changed, and run npm run publication:check. (F2) Judge a dry run's refresh preview against the head release close would fast-forward main to, not main's current HEAD. When main can fast-forward to that head (close already proves this), the preview never reports main as past the tag. It runs the recorded-checkout, branch, cleanliness, binding, fetch, ancestry and manifest checks, and returns the would-refresh preview or the current, skipped or refused outcome a real close would reach at that head. The real close keeps its main-HEAD and tag checks. Add a release fixture case whose dry run runs with main behind origin/main (an integrator push, as release_case_surfaceclose does) and asserts the would-refresh preview. Check: npm test -- --only release, npm test -- --only launchpad, npm test -- --review and npm run test:docs. (F3, boarded) Preview rows for pending work, a would-refresh row or a pending cleanup, should not record outcome current; fix this within the Boy Scout bound if F2's repair touches those lines. (F4, boarded) When a retained cleanup record no longer matches the recorded checkout, name the recovery in the refusal and in product 07's Starter refresh paragraph, or bind cleanup to the record's own checkout, so that a retry is not blocked indefinitely. (F5, boarded) The registry preamble in scripts/siblings.mjs names the starter-refresh receipts that the next worktree start carries from release close; regenerate docs/siblings/README.md.",
  "reopenWhen": "A repair changes the dry-run preview, product 07's release-close row or the cleanup ownership record; a dry run taken before main's fast-forward again reports a starter row that a real close at that head would not; or product 07's release-close row again omits an external effect that release close performs."
}
```

## WO-215-D012 — Repair the dispatch row and preview the proposed merged head

```json
{
  "id": "WO-215-D012",
  "date": "2026-10-13",
  "dispatch": "resume: fix; VER-001 F1 and F2",
  "decision": "Correct the implementation handoff's unsupported criterion 6 and 11 judgments. Product 07's release-close dispatch row now names the starter refresh's fast-forward push. A dry run accepts a proposed head that local main can fast-forward to, runs the existing starter admission and bound fetch against that head, and leaves the real close's HEAD and immutable-tag comparisons intact. Both release preview paths attempt starter checks only with --publish, preserving criterion 6's non-publishing exclusion.",
  "evidence": [
    "VER-001 F1: the dispatch row omitted the effect despite the separate Starter refresh paragraph. F2: refreshOne returned before checkout checks when local main had not moved to origin/main.",
    "scripts/release.mjs close fetches origin/main and proves HEAD can fast-forward before passing that proposed head; scripts/lib/starter-refresh.mjs now admits that ancestor only in dryRun.",
    "The extended release starter_refresh fixture passed under harness bounded at 2026-10-13T23:18:13.523Z, 23480 ms: an integrator advances origin/main, local main stays behind, a missing checkout refuses, a bound empty-tree starter prints would-refresh, and no checkout file, remote ref, receipt or candidate tag/Release changes. A non-publishing preview with no recorded checkout produces no starter row.",
    "The first new fixture assertion incorrectly expected the gh-state directory to be absent; make_repo creates it. The traced run identified that assertion after the correct preview and unchanged-state checks. It now tests absence of the candidate Release body, matching existing fixtures. The passing replay above includes that correction.",
    "Reading the preview wiring exposed the non-publishing gap: both dryRun branches called refreshPublishedStarters unconditionally. They are now guarded by publish; the existing publishing-preview case names --publish explicitly."
  ],
  "rejected": [
    {"option": "NoOp: keep the failed subject", "reason": "VER-001 establishes two unmet required criteria, and resume: fix authorizes their repair."},
    {"option": "Move main during a dry run", "reason": "The preview must judge the proposed revision without changing main."},
    {"option": "Remove the real close's head/tag guard", "reason": "Only the preview runs before main's fast-forward; publication still requires the released head."},
    {"option": "Treat the separate Starter refresh paragraph as the dispatch-row write-back", "reason": "The work order explicitly requires both reader surfaces."}
  ],
  "reopenWhen": "A preview before main's fast-forward skips admitted starter checks, a non-publishing close checks a starter, or the dispatch row again omits a release-close external effect."
}
```

## WO-215-D013 — Repair pending previews, preserve cleanup ownership and name receipt provenance

```json
{
  "id": "WO-215-D013",
  "date": "2026-10-13",
  "dispatch": "resume: fix; VER-001 F3–F5; adjacent-0002",
  "decision": "Complete the bounded follow-up class in the touched refresh and registry surfaces. Pending would-refresh and cleanup rows use preview; genuinely current rows retain current. Dry-run cleanup validates the same ownership, scratch, worktree and branch identities as a real retry without deleting anything, so a mismatch refuses rather than promising cleanup. A remapped checkout refusal names the ignored ownership record and the restoration route: restore its checkout with worktree clone, retry close, then record the replacement. Product 07 carries that recovery. The registry generator now names pending starter-refresh receipts carried by the next worktree start, and its page is regenerated.",
  "evidence": [
    "VER-001 F3–F5 and D011 name these follow-ups; the pinned read-only worker confirmed the affected lines and the bounded recovery option.",
    "scripts/lib/starter-refresh.mjs finishCleanup validates before its dryRun return; the mapping check still refuses a different checkout and prints only the repository-relative ignored record location.",
    "The existing update fixture now remaps to a second clone, checks informative real and preview refusals with records, worktrees and remote refs unchanged, restores the mapping and reuses the same published update for cleanup recovery. A changed scratch inode is also refused in preview. No kit preparation was added.",
    "adjacent-0002 was queued with cause, paths and checks, announced in chat at a safe F1/F2 boundary, and started after an actor-attested steering check-in and queue reread. One read-only worker was used in this repair session; root remains the sole writer.",
    "node scripts/siblings.mjs index regenerated docs/siblings/README.md. The authorized product edit staled only the engineering edition lock; check-publication --print-locks supplied its replacement. npm run release -- prepare --local retained the existing v0.81.0 minor target and unchanged component assignment.",
    "All 19 declared individual preflights passed at code identity db7aa935f90f475c31c43788b7d2502c909638deb58d7a3066f8f529e396f92d from 2026-10-13T23:22:08.706Z to 23:51:38.139Z; repair-checks.json records them. The reused worker found no new implementation bug and recommended one additional existing-release non-publishing preview assertion, which was added before the passing release suite."
  ],
  "rejected": [
    {"option": "NoOp: leave the related follow-ups as report prose", "reason": "They have small concrete fixes within the same named paths and checks, admitted by Adjacent Repair and D011."},
    {"option": "Delete cleanup objects through the newly mapped clone", "reason": "The ignored record owns objects in the original checkout; remapping must not transfer deletion authority."},
    {"option": "Silently ignore the old cleanup record", "reason": "A published starter manifest does not prove disposable resources are gone."},
    {"option": "Say release close writes receipts directly into tracked evidence", "reason": "Release close holds them pending; the next worktree start carries and regenerates them."}
  ],
  "reopenWhen": "Preview claims a pending or unsafe operation is current, a cleanup binding changes without an actionable recovery, or receipt producers/carry behavior change."
}
```

## WO-215-D014 — Keep retained cleanup paths and malformed input private

```json
{
  "id": "WO-215-D014",
  "date": "2026-10-14",
  "dispatch": "resume: fix; adjacent-0003",
  "decision": "Close the cleanup-refusal privacy class in the existing subject paths. Load retained cleanup state once, preserve all identity checks in an owned-cleanup helper, and sanitize its failures with the string-valued paths from that exact record. Give cleanup-record and clone-map parsing fixed diagnostics without source excerpts; reject present non-object cleanup records. Keep preview read-only and retain failed ownership records and resources.",
  "evidence": [
    "The bounded probe at 2026-10-14T00:07:18.387Z returned refused in both preview and retry but leaked the retained missing checkout path. physicalDirectory prints that path, while refreshOne had not yet assigned its outer checkout.",
    "The expanded bounded probe at 2026-10-14T00:11:40.371Z also observed native malformed cleanup-record and clone-map diagnostics exposing a synthetic path prefix in both modes. Only disclosure booleans were printed; no machine-local path is filed.",
    "The canonical evidence --stop at 2026-10-14T00:07:28.210Z stopped the active scripts/test-runner.mjs review run and reported active [] and no check recorded. Its process exited 1 with Gate stopped by request after 659.3 s. This stopped run is not completion evidence; the corrected source requires new preflights and one full review gate.",
    "The same expanded probe passed after the change at 2026-10-14T00:12:29.178Z: six preview/retry cases, no full-path or source-prefix disclosure, bounded duration 152 ms. The final expanded starter fixture passed both focused tests at 2026-10-14T00:20:40.767Z, including invalid checkout fields and missing custom temporary base in both modes; bounded duration 29931 ms.",
    "The first missing-temporary-base assertion expected a realpath diagnostic; checked output instead named lstat with the path already redacted. The unfiled assertion was corrected to the observed redacted ENOENT diagnostic, preserving the privacy and non-mutation checks.",
    "The existing update fixture adds these refusal cases plus null, false, zero, string and array records, checking record/map bytes, owned worktrees and remote refs remain intact. The applied-code reviewer found that non-string checkout fields could reach a scalar-valued unreadable-directory diagnostic; the structural guard now refuses them before that read, with null, false, numeric, array and object field cases in both modes. The wrapper also captures the raw temporary-base spelling so a missing custom TMPDIR cannot escape through realpath's native error; both modes test this without creating that path. Its existing restoration and recovery path still supplies the end of the test without another kit preparation.",
    "The pinned read-only worker recommended this one-read wrapper and identified the two parser boundaries. It ran no tests or writes; this session still uses one reused worker and one writer."
  ],
  "rejected": [
    {
      "option": "NoOp: keep the known disclosure after the review gate",
      "reason": "Criterion 5 forbids checkout paths in refresh rows, and the bounded probe establishes the failure in both modes."
    },
    {
      "option": "Reread the record from the outer catch or rely only on common home/temp prefixes",
      "reason": "Redaction needs the paths from the exact retained state that failed, including arbitrary physical roots and whitespace."
    },
    {
      "option": "Return raw parse errors or preserve them as cause",
      "reason": "Native diagnostics can echo ignored input bytes; fixed diagnostics identify the failed boundary without copying it."
    },
    {
      "option": "Weaken cleanup ownership or delete corrupt state",
      "reason": "A refusal must preserve the record and disposable resources until their identity is established."
    }
  ],
  "reopenWhen": "A cleanup refusal reveals any owned path or malformed ignored input excerpt, a present corrupt record is treated as absent, or cleanup adopts unproved objects."
}
```

## WO-215-D015 — Restore only captured fixture beacons before cancellation cleanup

```json
{
  "id": "WO-215-D015",
  "date": "2026-10-14",
  "dispatch": "resume: fix; adjacent-0003 revision 3",
  "decision": "Repair the release fixture's cancellation cleanup within its named shell surface. Capture the owned root and each fixture-created restricted beacon before restriction. At EXIT, INT or TERM, validate the root's physical identity and owner marker, then every surviving beacon's physical identity and ownership before restoring any permissions. Skip absent captured objects, refuse substitutions without removing the root, and retain the shared temporary-root cleanup checks unchanged. Group this related repair before revalidation rather than invalidate a second complete gate cycle.",
  "evidence": [
    "The canonically stopped review run's release:case:close_leftover emitted a failed fixture-root removal. Source sets its disposable beacon directory to 0111; restoration was reached only through local error recovery or the normal case end, so cancellation could reach rm before restoration.",
    "The bounded inspection at 2026-10-14T00:15:41.898Z proved the exact stopped-owned root was physical, current-uid-owned and contained only the known ancestor chain plus one unreadable 0111 beacon. Its marker had already been removed by the partial rm.",
    "The bounded removal at 2026-10-14T00:16:04.022Z matched the observed root device/inode and every physical owned ancestor, restored only that beacon, verified its sole signal file held the synthetic disposable-beacon bytes and removed the exact residue. No other temporary root was selected.",
    "The existing signal driver now waits until a captured beacon is restricted before interrupting the suite. INT and TERM must retain their expected 130 and 143 statuses and remove the owned root. A substituted-beacon TERM case must refuse with exit 1, retain the marker, leave the replacement and original contents and permissions intact, then the driver removes only its own verified synthetic fixture.",
    "Queue revision 19 records the expanded item scope, actual chat announcement and actor-attested message-boundary check-in before the grouped action. The same pinned worker is reused; the root remains the only writer.",
    "The applied-code reviewer identified a readiness race in the new JSON-bearing marker: existence could precede complete bytes. The driver now writes a complete sibling file and atomically links it into the ready name without overwrite, then removes the staging name.",
    "The reviewer also found that an assertion or timeout in the regression driver could orphan or forcibly kill the child before its restoring trap. The driver catches failures, sends TERM and reaps the child; a one-second fallback kills a stuck group and restores only captured physical root/beacon identities with exact ownership bytes. Synthetic driver-failure and stopped-child cases exercise graceful and forced paths. Polling stops reading fixture paths once the signal has been sent, avoiding a race with normal removal. The final bounded temporary-root suite passed at 2026-10-14T00:24:23.203Z in 2609 ms, including all five signal scenarios."
  ],
  "rejected": [
    {
      "option": "NoOp: leave a known cancellation residue and recover it manually after each stopped run",
      "reason": "The observed cancellation loses its root marker during partial removal; the named release fixture can prevent this failure before removal."
    },
    {
      "option": "Recursively repair permissions throughout the shared temporary tree",
      "reason": "Only explicitly captured fixture objects have proved identities; a broad permission change would weaken the cleanup boundary and expand shared machinery."
    },
    {
      "option": "Restore by a path or owner marker alone, or continue removing the root after identity refusal",
      "reason": "Root or beacon substitution must preserve objects rather than grant destructive cleanup. Physical device/inode, current uid and exact marker bytes are checked before any restoration."
    }
  ],
  "reopenWhen": "A signal after beacon restriction leaves owned residue, restoration reaches a substituted object, or an identity refusal removes the root or its marker."
}
```

## WO-215-D016 — Make clean-filter restaging deterministic without weakening the guard

```json
{
  "id": "WO-215-D016",
  "date": "2026-10-14",
  "dispatch": "resume: fix; adjacent-0003 revision 4",
  "decision": "Correct only the staged-tree fixture's stat-cache assumption. Give its initial worktree file an old timestamp so the cached case is deterministic, then explicitly renormalize the already tracked file after removing the clean-filter attributes. Preserve the initial transformed-blob refusal and the later filter-restores-HEAD/no-staged-diff refusal. Keep assertStagedTree's raw verified-byte and mode comparison unchanged.",
  "evidence": [
    "The second repair preflight attempt passed siblings-fixtures and target-worktree at d07713b7c01ccfde49135094bb4d37c20651e6b660bb658eaceb48774771159d, then launchpad failed at 2026-10-14T00:33:45.665Z. Its three in-kit gate selections and starter refresh fixture passed; the staged-tree positive assertion received the correct staged-tree-differs refusal after ordinary git add retained the prior filtered blob. The runner stopped before subsequent suites.",
    "The bounded probe at 2026-10-14T00:35:09.273Z reproduced the unchanged-stat-cache condition with a 2000-01-01 file timestamp. Ordinary add left changed bytes staged while verified bytes remained on disk. Renormalization and remove/re-add both restored the verified index bytes without changing the worktree.",
    "The same probe compared the two corrective arms: renormalization used one command and reported 19 ms; removing and re-adding used two commands and reported 23 ms. Command count is the decision axis; this tiny uncontrolled timing comparison establishes no causal runtime advantage.",
    "The fixture correction adds no kit preparation and changes no production publication behavior. Queue revision 23 records its bounded same-path scope, actual intent announcement, actor-attested steering opportunity and start. The focused staged-tree test passed at 2026-10-14T00:36:57.519Z in 4368 bounded ms with both filter refusals intact.",
    "Context7's official /git/htmldocs lookup confirms --renormalize reapplies clean processing to tracked files and forces their restaging: https://github.com/git/htmldocs/blob/gh-pages/git-add.adoc. The executable probe separately establishes the unchanged-stat-cache failure.",
    "All 19 required preflights passed at b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc from 2026-10-14T00:40:51.676Z to 2026-10-14T01:09:46.002Z; repair-checks.json preserves current rows and both prior attempts without machine-local diagnostics."
  ],
  "rejected": [
    {
      "option": "NoOp: retry until the file happens to fall inside Git's racy-timestamp window",
      "reason": "The isolated probe establishes a reproducible stale index; an occasional implicit rehash cannot support a deterministic positive assertion."
    },
    {
      "option": "Remove and re-add the index entry",
      "reason": "Both arms restore the verified bytes, while explicit renormalization requires one command and retains the tracked-entry setup."
    },
    {
      "option": "Relax the staged-tree comparison or remove either rejection assertion",
      "reason": "The production guard correctly prevented publishing transformed bytes; both filter classes remain required regression evidence."
    }
  ],
  "reopenWhen": "The restaging fixture depends on stat-cache timing again, or either clean-filter class reaches publication despite differing verified bytes."
}
```

## WO-215-D017 — Judge the repaired source's fresh review cost

```json
{
  "id": "WO-215-D017",
  "date": "2026-10-14",
  "dispatch": "resume: fix; current fresh review-gate measurement",
  "decision": "Retain the existing deferred launchpad performance watch after the repaired source passes the fresh review gate: none of its current reopening conditions occurred. Keep the required preparations and verification.",
  "evidence": [
    "repair-checks.json and gate-cost.json: review recorded 2026-10-14T01:56:35.799Z, code identity b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc, 41 required suites, 97 fresh tasks, 0 reused tasks, exit 0, 2171365 ms.",
    "Launchpad took 512605 ms, 6.133% of 8357526 slot-weighted ms; the longest vertical member was vertical:file:test-vertical.mjs:statements at 561841 ms. Launchpad on recorded critical path: false.",
    "Task span 2170897 ms over 8357526 slot-weighted ms / 4 lanes = 2089381.5 ms gives 3.901% excess. Conditions: span false, share false, vertical false.",
    "The current FUP-b531e850b70f6d4e disposition at 2026-10-13T16:53:33.872Z defines these conditions. This concurrent run measures them; it does not isolate a causal change from the privacy or fixture repair."
  ],
  "rejected": [
    {
      "option": "Reopen merely because an isolated launchpad task reading increased",
      "reason": "The existing watch concerns span with critical-path membership, work share and the longest vertical member; none occurred."
    },
    {
      "option": "Shorten this order by removing an in-kit gate or weakening fixture assertions",
      "reason": "The order requires three gate selections, caps added kit preparations at three and retains each exercised failure boundary."
    }
  ],
  "reopenWhen": "A fresh review gate meets any current performance-watch condition, or planning obtains a bounded comparison that can attribute and reduce the gate cost without weakening verification."
}
```

## WO-215-D018 — Verification: pass; VER-001's findings are repaired, and two follow-ups are boarded

```json
{
  "id": "WO-215-D018",
  "date": "2026-10-14",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002. At code identity b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc, criteria 1 to 12 are met. VER-001's two blocking findings are repaired. F1: product 07's `resume: release close` row now names the starter refresh. F2: a publishing dry run taken before main's fast-forward now judges the merged head and runs the checkout, branch, cleanliness, binding, fetch, ancestry and manifest checks. The real close keeps its main-HEAD and tag guards. The F3 to F5 follow-ups are resolved. Two new follow-ups are boarded; neither breaks a criterion or a behavior main had. FU1: the cleanup recovery D013 names cannot be followed once the retained record's original checkout has been moved or deleted, so every preview and retry refuses until someone removes the ignored record and its scratch directory by hand. FU2: the starter refresh fixture leaves the module's retained disposable scratch directory in the system temporary directory when it fails between its faulted update and its recovery step.",
  "evidence": [
    "F1: line 273 of docs/product/07-execution-guide.md, the `resume: release close` row, now adds that the helper refreshes each declared export sibling through its recorded checkout with one fast-forward commit to that sibling's main, and that a refused starter refresh is rerun from updated main. npm run publication:check passes, and product 07 measures 195,419 bytes against its 212,313-byte ceiling.",
    "F2 end to end: a session-scratch copy of scripts/test-release.sh with two added cases ran under harness bounded at 2026-10-14T02:42Z (37.5 s) and 02:57Z (4.5 s). Main was two commits behind origin/main: an unrelated merged commit, then the WO-099 candidate. Every `release close WO-099 --publish --dry-run` printed 'would fast-forward main', and the starter rows were as follows. A clean, bound first-export checkout: preview, 'would refresh <initial> to <merged head>'. A tracked edit, an untracked file, a local commit ahead, a pushurl naming another owner, a starter manifest naming an unrelated commit, and a detached HEAD: each refused, with exit 1 and one starter-refresh blocker. With the misbound pushurl the bare remote's refs were unchanged. A checkout behind its remote: preview from the remote head, and the checkout kept its commit and work tree. A manifest naming the intermediate commit that exists only on origin/main: preview. A manifest naming the merged head: current. A manifest naming a later side-branch commit: skipped, with exit 0 and no blocker. Throughout, main stayed at its commit, and no candidate tag, Release body, pending receipt or extra worktree appeared. Neither the summary nor the record named the checkout path. A dry run without --publish recorded no row.",
    "Declaration variation: two export siblings and one consumer produced two independent rows, preview and 'refused; no recorded checkout', with no consumer row, one blocker and exit 1. worktree clone refused the consumer id as unknown and admitted the second export id.",
    "Module level: the prelude of scripts/test-launchpad.mjs, unchanged except that its imports point at the subject, ran under harness bounded at 2026-10-14T02:44Z (21.7 s). The first export was refreshed, keeping nothing and replacing README.md. Core main was then reset behind the tag and the checkout left behind a peer push. The preview read 'would refresh <peer head> to <head>' without moving the checkout. A local commit ahead and a pushurl naming another owner refused, and a real refresh with main behind was skipped. An update with an injected cleanup failure published one commit whose parent is the peer head and whose manifest names the released commit. A replacement recorded through the worktree clone CLI made the preview and the retry refuse with D013's recovery route. Restoring the original with worktree clone and retrying returned current. That retry removed the record, the scratch directory, the refresh branch and the disposable worktree, and left the remote refs and the two pending receipts unchanged. Recording the replacement afterwards returned current. A current starter previewed as current with main behind and at head. No row named the fixture root or the temporary directory.",
    "FU1 reproduction, in the same module probe: the cleanup record was retained and the original checkout renamed away. worktree clone of the original path failed with 'directory is unreadable'. While the replacement was recorded, every retry refused with the guidance to restore the original. While the clone map named the missing original, both the preview and the retry refused with 'directory is unreadable: <checkout>' and named no route. Only moving the checkout back allowed recovery. Each such refusal keeps a starter-refresh blocker and the dispatch's writer, as criterion 5 requires, so later release closes stay blocked.",
    "FU2: a dotln-starter-refresh-* directory created at 2026-10-14T00:16Z remains in the system temporary directory. Its disposable worktree's .git file points into the starter-refresh-fixture checkout of a removed launchpad fixture root, and the directory holds that fixture's keep.txt. refreshOne creates its scratch directory under tmpdir(). The fixture keeps the inherited TMPDIR, which scripts/test-runner.mjs does not set per task, and test.after removes only the fixture's own scratch root. Inference from these observations: a run that failed between the faulted update and the recovery step left this directory. The failing run itself was not observed, and the directory was left in place.",
    "Reproduced at the subject under harness bounded, as follows. The executor's two starter tests passed in 31.0 s. Only first export j (4,408 ms), update a (5,528 ms) and failed verification g (2,535 ms) prepared a kit; every other measured case took 569 ms or less. The release starter_refresh case passed (26.1 s), scripts/test-fixture-temp-root.sh passed its five signal scenarios (2.7 s), and scripts/test-worktree.sh passed (222.2 s). In the worktree fixture, a malformed pending receipt refused start with no worktree and no branch, and a valid one was carried with siblings index --check passing in the subject. npm run format:check, npm run harness -- check (34 surfaces), siblings index --check, the authority, feedback and harness edition checks, and git diff --check also passed. npm run test:docs passed 35 of 35 in 135.69 s.",
    "The executor's npm test -- --review row was consumed, not rerun. Its code identity equals the subject's, it was recorded at 2026-10-14T01:56:35.799Z with exit 0 and 41 required suites with none failed, it ran 97 fresh tasks and reused none, and its identity and build output were unchanged during the run."
  ],
  "rejected": [
    {
      "option": "Fail VER-002 on FU1",
      "reason": "No criterion breaks: the refusal is recorded and blocks with the same retry command, keeping the writer as criterion 5 requires. It needs a cleanup failure and then a removed checkout, and main had no starter refresh."
    },
    {
      "option": "Fail VER-002 on FU2",
      "reason": "Leftover test files after a failing run break no criterion and no behavior main had."
    },
    {
      "option": "Remove the leftover scratch directory",
      "reason": "This verifier did not create it and writes only its own evidence. It is reported for the operator."
    },
    {
      "option": "Spawn a worker to reproduce a claim",
      "reason": "Every probe ran in this session. Product 07 §Verification review and attack admits a verifier's worker only for a named claim the verifier cannot run itself."
    },
    {
      "option": "Rerun npm test -- --review",
      "reason": "The executor's passing review row has the subject's code identity. Consuming it limits only reruns of the product gate, and the affected suites were reproduced on their own."
    }
  ],
  "reopens": {
    "decisionId": "WO-215-D013",
    "observation": "D013's recovery for a remapped checkout assumes the original checkout still exists. After a cleanup failure, with that checkout moved away, worktree clone of its path fails. Every preview and retry then refuses: with the guidance to restore it while a replacement is recorded, or with 'directory is unreadable: <checkout>' and no route while the clone map names the missing path."
  },
  "followup": "WO-215 next repair, or the planning pass that disposes of these rows. (FU1, reopening D013) When a retained starter-refresh cleanup record names a checkout that no longer exists or is no longer a Git top level, name a route an operator can complete without restoring that checkout, in both the refusal and product 07's Starter refresh paragraph. One example is an identity-checked discard of the ignored record and its scratch directory once no checkout can still register the disposable worktree. Cleanup must still never adopt a replacement checkout's objects. Add the moved-checkout case to the existing update fixture without another kit preparation. (FU2) Keep every directory that the starter refresh fixtures cause the module to create inside the fixture's own removable root, for example by giving the refresh driver a TMPDIR there, so that a failing run leaves no dotln-starter-* directory in the system temporary directory.",
  "reopenWhen": "A repair changes cleanup-ownership recovery or the fixture's temporary base; a release close records a starter-refresh blocker whose retained checkout no longer exists; or another dotln-starter-* directory is found in the system temporary directory after a fixture run."
}
```

## WO-215-D019 — Final review: integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-215/10 -->

```json
{
  "id": "WO-215-D019",
  "date": "2026-10-14",
  "dispatch": "resume: final review; worktree integrate WO-215",
  "decision": "Integration took in nothing: the base and the fetched main are both 68a91cb560f132171c121f10856b11ab3315b451, origin/main names the same commit, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-215/10), retained its named stash 871548e1b93a5d7bf03b6d179a8fefe106333635, took the intake backup from a fresh npm run backup:intake of the three ignored intake files into the session scratch, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (byte-identical to the executor's, which the order changes against main for the release-close role text), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. Every acceptance claim is carried forward unchanged: VER-002's twelve criterion judgments at code identity b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc; the executor's passing npm test -- --review row at that identity (2026-10-14T01:56:35.799Z, 41 suites, 97 fresh tasks, exit 0, 2,171,365 ms) and its document rows; VER-001's F1 and F2 as repaired (D012) and F3 to F5 as resolved (D013), reproduced in VER-002's Earlier findings; VER-002's FU1 and FU2 as boarded (D018); the executor's self-review (two workers at implementation: found 4, fixed 4; one reused worker across the repair: found 6, fixed 6). gateCodeIdentity returned the same identity before and after integration, and git diff --stat against the integration checkpoint shows no tracked file changed by the regeneration except the decisions index row this stub added. Release preparation keeps application v0.81.0 under the order's minor classification: local tags end at v0.80.0, v0.81.0 is unassigned, and check-surfaces --local reports the release block v0.81.0 over v0.80.0 with skeleton the only component whose source changed (0.58.1 to 0.59.0, the console pin and lockfile following) and no bump required for the other five; no dependency is added. Authority revision 001 under WO-215 stays the selected edition and its check passes with the feedback and harness checks, so integration owes no re-mint and no live episode. Of the four printed affected checks, three pass on the integrated tree under the bounded wrapper and npm test -- --review runs in the handoff sequence and is recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-215/10",
    "base 68a91cb560f132171c121f10856b11ab3315b451",
    "upstream 68a91cb560f132171c121f10856b11ab3315b451",
    "git log main..HEAD empty before integration; git worktree list shows main at 68a91cb5; the helper's fetch found no newer origin/main",
    "release preparation: WO-215 target v0.81.0 remains current. Files changed: docs/evidence/WO-215/meta.json, docs/final-reviews/WO-215/PR.md. Meter snapshot: docs/evidence/WO-215/meta.json, 4116 bytes. Tag observation: local snapshot only.",
    "Affected checks and preflights under node scripts/harness.mjs bounded, one at a time, 2026-10-14T04:00:44Z to 04:01:08Z, each exit 0: npm run publication:check (255/255 headings; both editions CURRENT, 29 and 45 sections), npm run harness -- check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.81.0 against latest local tag v0.80.0; skeleton src changed, observed 0.59.0 against 0.58.1; five components unchanged; github-body-profile passes on PR.md), node scripts/lineage.mjs index --check (172 sections), node scripts/check-publication.mjs --print-locks (both locks equal the committed values), npm run format:check, node scripts/siblings.mjs index --check, node scripts/authority-evidence.mjs --check, node scripts/feedback-evidence.mjs --check, node scripts/harness-evidence.mjs, node scripts/work-orders.mjs index --check; git diff --check clean. npm test -- --review is run in the handoff sequence and recorded in FINAL-001.",
    "gateCodeIdentity before and after integration: b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc; git diff --stat refs/dotln/checkpoint/WO-215/10 -- . lists docs/lineage/decisions-index.md (+1) as the only tracked change the regeneration made",
    "Independent reproductions on the integrated tree under the bounded wrapper: the two starter tests of scripts/test-launchpad.mjs (2 pass, 23,654 ms; cases j 3,728 ms, a 4,439 ms and g 1,830 ms are the three kit preparations) and bash scripts/test-release.sh --case starter_refresh (pass, 16,693 ms)"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-14. Original base: `68a91cb560f132171c121f10856b11ab3315b451`.
Fetched main: `68a91cb560f132171c121f10856b11ab3315b451`. Checkpoint: `refs/dotln/checkpoint/WO-215/10`.
Named stash retained: `871548e1b93a5d7bf03b6d179a8fefe106333635` (WO-215 integrate 2026-10-14).
Intake backup: `DotLn-wo215-intake-20261014T035721Z.zip` in the session scratch (3 files), verified by the helper against the current intake.
Resolved projections: none.
Release preparation: WO-215 target v0.81.0 remains current. Files changed: docs/evidence/WO-215/meta.json, docs/final-reviews/WO-215/PR.md. Meter snapshot: docs/evidence/WO-215/meta.json, 4116 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's twelve criterion judgments and the executor's passing review and document rows at code identity `b9a1a58a…`, which the integrated tree keeps; VER-001's F1 and F2 as repaired and F3 to F5 as resolved (D012, D013); VER-002's FU1 and FU2 as boarded (D018); the executor's self-review and repair passes (found 4, fixed 4; found 6, fixed 6). No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: three of the four printed checks pass on the integrated tree (evidence above); the review gate is in FINAL-001.

## WO-215-D020 — Final review: pass FINAL-001 at the integrated subject; two register rows settled, the order's follow-ups left for planning

```json
{
  "id": "WO-215-D020",
  "date": "2026-10-14",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass the final review of WO-215 at the integrated subject, code identity b9a1a58aaaf7ca03929669bc490d1d3f7a4f63ce019797e2e9b6b15b1a592ddc, the identity VER-002 judged; integration changed no judged byte (D019). All twelve criteria hold: after a published release the helper refreshes each declared export sibling through its recorded checkout in a disposable worktree, by the export update or the first export over the initial commit, verified by the export's own emit, predicted-surface comparison, harness check and launchpad verify with the staged set exactly the plan's rows and every staged blob and mode compared with the verified bytes, committed once with hooks off and pushed as one fast-forward of the starter's main through the hookless bare lane bound to core's origin owner and the sibling's name; every listed refusal holds before any write and the first-export path shares them; a rerun is current and a current row writes a pending receipt only when neither lane records the manifest hash; every row is recorded and summarized without the checkout's path, a refused row is a starter-refresh blocker with the same retry that keeps the writer, and publication is unchanged by any refresh outcome; no refresh runs for a target, lower-version, non-publishing or undeclared close, and a publishing dry run previews the checks against the head main would fast-forward to; the pending receipt is carried by the next worktree start on both routes with the registry regenerated and the lane emptied, and a malformed one refuses the start before any worktree; worktree clone admits a declared export sibling; every fixture reaches only local bare remotes with three kit preparations and the measurements recorded; both role forms name the refresh, forbid every other push and make a refusal a reported blocker; the write-backs land in place with the locks current and product 07 under its ceiling; and the gates are green with no dependency change. This review found twelve follow-ups and no blocking finding: none breaks a criterion or a behavior main had. Three are document sentences in the order's declared surfaces and were corrected in this review within the Boy Scout bound, judged by the shared checks (product 07's phrase-authority paragraph, which still limited release close to the tag and Release and forbade pushing main; product 12's refresh clause, which named the hand-run command and a receipt for every run; the playbook's receipt clause, which attached a receipt to a refused refresh), with the engineering edition lock refreshed and the document gate rerun. The rest are boarded in this decision's followup with their repair rules: the role's done condition and the blocker label (F2), the redaction placeholders (F3), the runner's process-debt sources (F4), product 04's authority clause (F1's remainder), a refusal after a landed push (F6), a mode-only kit change refusing every later update (F7), the cleanup record bound to the retrying process's temporary base (F8, which reopens D018's recovery class with a second trigger), a target start's saved receipt cohort blocking its own retry (F9), the printed self-start retry's silence (F10), an empty pending directory refusing starts after a declaration change (F11) and a duplicate pending receipt after a rerun that follows a carry (F12). VER-002's FU1 and FU2 stay boarded (D018). Known issues: planning receipt 045's criterion 5 condition (a live close holds the writer on a starter-side cause when the next order is due) and criterion 7 condition (a carried receipt lost with a withdrawn carrier) have not occurred, because no release close has run this code; FUP-b531e850b70f6d4e's three conditions did not occur in any fresh review gate (D009, D017). Register: FUP-efcc590126413a41 is settled, implemented by this order's release-close half with WO-207 carrying the fork's opt-in; FUP-e6f9cf6f37934a4f (D011's repair instruction) and FUP-1168a9810a0063c8 (D005, reopened by D011) are settled, repaired by D012 and D013 and verified by VER-002; FUP-eee6c2fa1ef76215 and FUP-d8297b92b32c8304 stay untriaged for planning as the order's own boarded follow-ups; FUP-b531e850b70f6d4e stays deferred with this order's readings; the other 30 textually matched rows are left as they are because this change opened none of their seams and none of their conditions occurred. Product gate: this review's npm test -- --review row at b9a1a58a… is composed from the executor's fresh passing row of 2026-10-14T01:56:35.799Z at the same identity, as product 07 §Discipline provides for a review gate at an identity whose tasks already passed; FINAL-001's Executed checks record it.",
  "evidence": [
    "docs/final-reviews/WO-215/FINAL-001.md: criterion judgments, Executed checks and the findings block",
    "D019 (integration took in nothing)",
    "VER-002 (pass; D018) at code identity b9a1a58a…, report hash sha256:385ff0b2… equal to the recorded VerificationCompleted reportHash; VER-001 (fail; D011) report hash sha256:3f872c35… equal to its recorded reportHash",
    "The executor's fresh npm test -- --review row at b9a1a58a… recorded 2026-10-14T01:56:35.799Z: 41 suites, 97 fresh tasks, exit 0, 2,171,365 ms; launchpad 512,605 ms, off the critical path, 6.1% of slot-weighted work, below the longest vertical member (D017)",
    "Bounded reproductions on the integrated tree at 04:01:58Z to 04:02:38Z: the two starter tests of scripts/test-launchpad.mjs (2 pass, 23,654 ms; three kit preparations) and bash scripts/test-release.sh --case starter_refresh (pass, 16,693 ms); the affected checks and preflights at 04:00:44Z to 04:01:08Z (D019)",
    "Three read-only dotln-worker reviewers over the three surface groups and one refuter over their nineteen reported items; every surviving finding was verified by this reviewer against the named lines: product 07 line 447 and product 04 line 816 (F1), contributor.ts releaseCloseRemedy and release.mjs's blocker label (F2), starter-refresh.mjs redact (F3), scripts/test-runner.mjs process-debt sources (F4), product 12 line 129 and the playbook's release task (F5), the post-push steps and releaseCloseSummary (F6), launchpad.mjs planUpdate's byte-only unchanged flag and applyKitUpdate's mode-carrying write against the refresh's required/allowed sets (F7, traced in code, not executed), removeOwnedCleanup's tmpdir comparison at line 280 (F8), the target route's saved cohort and carryPendingReceipts's missing-source refusal (F9), the printed retry program discarding completeSelfStart's output (F10), the carry removing files only and readReceiptLane refusing an undeclared directory before reading it (F11), receiptRecorded reading main's lanes only (F12)",
    "Document corrections: docs/product/07-execution-guide.md §Operator resume phrases phrase-authority paragraph (+205 bytes; 195,625 against the 212,313 ceiling), docs/product/12-workstream-application.md (+117 bytes; 23,390 against 25,550), docs/PLAYBOOK.md (+19 bytes); the software-engineer edition lock refreshed from check-publication --print-locks to sha256:b7657c57…; npm run publication:check passes with both editions CURRENT",
    "npm run plan -- followups --touching: 34 matched of 252 pending at register revision aaaf7c7e…, read over five pages before integration; the batch of three dispositions applied after D020 is recorded in FINAL-001's Register"
  ],
  "rejected": [
    {
      "option": "Fail the review on any of the twelve follow-ups",
      "reason": "None breaks a criterion or a behavior main had: the refresh, the carry and the clone admission are new, every criterion's fixture and probe holds, and product 07 routes a defect outside the criteria that breaks no behavior main had as a follow-up by rule."
    },
    {
      "option": "Fix the code follow-ups (F2, F3, F4, F6 to F12) in this review within the Boy Scout bound",
      "reason": "Each changes a machinery source or the role text, which moves the code identity and needs a fresh product gate and, for F7 to F9 and F11, fresh independent verification; a reviewer never writes a behavioral fix and certifies it. Each is boarded with its repair rule."
    },
    {
      "option": "Board the three document sentences instead of correcting them",
      "reason": "Each is one sentence in a surface the order declares, makes the document contradict the shipped behavior that the next release close reads first, and is judged by the publication check, the lock and the document gate; correcting them keeps the diff legible and widens nothing."
    },
    {
      "option": "Rerun a fresh product gate instead of the composed row",
      "reason": "The code identity is unchanged from the executor's fresh passing row, and the runner composes a review gate from tasks that already passed at that identity by design; a fresh 36-minute rerun would add no evidence about the subject."
    }
  ],
  "reopens": {
    "decisionId": "WO-215-D018",
    "observation": "D018's recovery route for a retained cleanup record assumes the retrying process shares the original temporary base. removeOwnedCleanup requires the record's scratch directory to sit directly under realpathSync(tmpdir()) of the retrying process (scripts/lib/starter-refresh.mjs line 280), so a cleanup failure under one TMPDIR, such as a sandboxed session's own base, followed by a retry under another refuses every preview and retry with 'refresh cleanup ownership does not match the recorded checkout' while the checkout is unmoved; the fixture pins only a missing base."
  },
  "followup": "Planning, or the next order that edits these surfaces; none blocks the first live refresh, which is this order's own release close. (F1, remainder) docs/product/04-interfaces.md's release-close sentence says the phrase also pushes one verified fast-forward commit to each declared export sibling's main. (F2) packages/skeleton/src/loadouts/contributor.ts releaseCloseRemedy: the done condition in both role forms adds 'and no starter-refresh blocker remains'; scripts/release.mjs labels a starter-refresh blocker as such rather than 'Cleanup/publication blocker'; re-mint the bundle and the role oracle. (F3) scripts/lib/starter-refresh.mjs redact: distinct placeholders for core main, the recorded checkout, the scratch directory and the temporary base, and non-string candidate paths filtered out so an array-valued clone-map entry cannot garble the reason. (F4) scripts/test-runner.mjs: declare packages/skeleton/fixtures/wo215-role-baseline.json under the process-debt machinery sources, as the earlier oracles are. (F6) a refusal raised after the push landed is summarized with its before and after commits or a sentence that the push landed; product 07 says a refusal may follow a landed push. (F7) a plan row whose bytes are unchanged but whose mode differs counts as changed: record the mode in the plan or admit mode-only rows to the refresh's required and allowed sets, and name the offending path in the staged-set refusal; fixture: a mode-only kit change through release close. (F8, see reopens) bind the cleanup record to its own recorded base rather than the retrying process's tmpdir(), or admit a record whose scratch directory exists at its recorded path under any base, and name the route in the refusal and product 07; fixture: a retry under a different TMPDIR. (F9) scripts/siblings.mjs carryPendingReceipts and the target route: when a captured source is gone and the destination never received it, treat the row as carried by another start and say so, or re-capture the cohort on the target route; name the route in the refusal and product 07; fixture in scripts/test-target-worktree.mjs. (F10) scripts/worktree.mjs: the printed self-start retry prints completeSelfStart's returned activation output and the next steps, and one retry route is printed when the bootstrap fails. (F11) remove a sibling's empty pending directory after consuming its last receipt, or skip an empty undeclared directory in readReceiptLane; fixture. (F12) receiptRecorded cannot see a receipt consumed into an unmerged worktree, so a release-close rerun after a start writes a second pending receipt for the same manifest hash and siblings index accepts duplicates: decide whether the registry refuses or collapses them. Notes for the same pass: scripts/lib/target-publish.mjs keeps mkdtempSync, rmSync and tmpdir imports nothing uses and the moved helpers' 'target publish refused' prefix reaches starter rows; harness check tests the floor only for build none while emit now refuses a block-only contract for every build; the committed fixture asserts no clean update's refreshed row and never reaches firstTree's own collision preflight (both verifications probed them); scripts/siblings.mjs's header comment predates the carry and sits below a new import.",
  "reopenWhen": "A criterion judged met is shown unmet at this identity, the first live refresh refuses on a cause boarded here, or a register disposition above is shown wrong."
}
```
