# WO-243 decisions

## WO-243-D001

```json
{
  "id": "WO-243-D001",
  "date": "2026-11-07",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.120.1, the next patch above the observed release baseline v0.120.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.120.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-243-closeout-checks-follow-the-repositories-an-order-changed.md"
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

## WO-243-D002 — The earlier paused attempt is evidence, not adopted work

```json
{
  "id": "WO-243-D002",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Build this execution on the activated tree at main e4fe2dae and read the earlier, paused WO-243 attempt only as evidence; adopt none of its files. That attempt, a Codex session of 2026-11-03 that paused before its complete run on the operator's words, survives in refs/dotln/checkpoint/WO-243/1 to /3 (the last, a1f53c96, holds 67 changed files over its base 1b41dab1). Those refs are kept unchanged.",
  "evidence": [
    "docs/planning/sequence.md and docs/planning/work-order-map.md (2026-11-03 pass, item 7): the operator's staged work in ../DotLn-wo243 is adopted or discarded at activation on the operator's word.",
    "This session's operator message is resume: next and names neither; the worktree directory was created at 2026-11-07T06:12:39Z and the activation recorded at 06:12:44Z on a clean tree, whose checkpoint refs/dotln/checkpoint/WO-243/4 holds only sibling observation files.",
    "git log --first-parent 1b41dab1..e4fe2dae: main took ten pull requests since that base (#271 to #280), which moved the role-oracle chain (wo257-role-baseline.json heads it), packages/skeleton/src/loadouts/contributor.ts and the evidence editions the attempt had re-minted."
  ],
  "rejected": [
    {
      "option": "Restore the checkpoint's files into this tree",
      "reason": "A checkout of the checkpoint would revert main's later changes in every file it holds, and a three-way replay conflicts in the role-oracle chain, the generated harness and the evidence editions; adoption is also the operator's word, which this session has not received."
    },
    {
      "option": "Stop and ask the operator before starting",
      "reason": "The role records the safe default for an operator-only choice without demanding a response; nothing is destroyed, so the operator can still direct adoption."
    }
  ],
  "reopenWhen": "The operator directs adopting the staged attempt or any part of it."
}
```

## WO-243-D003 — One closeout selection, three readers

```json
{
  "id": "WO-243-D003",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "closeoutScope(root, order) in scripts/lib/closeout-scope.mjs, imported and re-exported by scripts/lib/executor-readiness.mjs, is the one selection three readers print: the executor and reviewer briefings (resume next, fix, final-review and the read-only resume briefing) end with its closeout block; worktree integrate prints it as owed by this order; implementation-ready and repair-complete record it as one advisory. Every order owes the launchpad document gate. A launchpad order also owes the complete launchpad run, its own repository's gate. A target order owes its registered target gate, with --review when a criterion names a review form, and the complete launchpad run only where launchpad machinery changed, a machinery conflict was resolved at integration, a criterion names npm test, or an input cannot be read or classified. The selection runs no gate, supplies no row and adds no refusal. The role text's closeout steps (the executor's step 8 and 9, the reviewer's step 5 and 6, its integration sentence and the target clause the execution roles share) read the selection.",
  "evidence": [
    "Before: contributor.ts's executor step began Start one complete run, npm test -- --review for every execution, and worktree integrate listed a complete run as an affected check after any merge; the target clause said to replace the self-order npm test checks, so the readers disagreed (WO-019-D031 in the target's records, read in the local DotLn-Angular checkout).",
    "scripts/lib/handoff-ledger.mjs requireGateClaims consumes rows only for the gates the met criteria name, and requireFinalReviewGate returns before any core row for a target order: no completion consumed the run the readers asked for.",
    "scripts/test-target-worktree-start.mjs closeout matrix: for eight target cases and the launchpad order, the briefing, the helper's owed list and the recorded completion advisory name the same checks and the same reason."
  ],
  "rejected": [
    {
      "option": "Remove the complete run for every target order",
      "reason": "An order that edits launchpad machinery beside its target change, or resolves a machinery conflict at integration, loses the evidence the complete run gives."
    },
    {
      "option": "Read the criteria's prose alone",
      "reason": "It misses machinery actually changed: the changed paths are the fact, the criteria the claim."
    },
    {
      "option": "Drop the complete run for a launchpad order that changed only documents",
      "reason": "A launchpad order's repository is the launchpad and its gate is the complete run, as a target order's is its target gate; this order changes target-order closeout and keeps launchpad orders' existing closeout."
    },
    {
      "option": "Record the advisory inside requireGateClaims",
      "reason": "The verifier's completion shares that function and the runner's claim tests pin its advisories empty; the two executor completions are the readers the order names."
    },
    {
      "option": "Add a command that prints the selection",
      "reason": "The order adds no command: npm run resume -- briefing already re-projects the briefing read-only, and worktree integrate runs at the closeout point."
    }
  ],
  "reopenWhen": "A target-only order with readable inputs is told to run the complete launchpad run, an order with launchpad machinery changes is not, or one reader names checks the other two do not."
}
```

## WO-243-D004 — What counts as the order's launchpad change, and how a path is classified

```json
{
  "id": "WO-243-D004",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "The order's launchpad changes are the paths that differ from the comparison base in the working tree, plus untracked files, plus every conflict an integration of the order resolved. The comparison base is the commit the activation checkpoint was taken on (its first parent) until an integration completes, then the main commit that integration took in; each new integration receipt carries the earlier receipts' resolved conflicts as priorAuthored. Each path is classified in this order: a record the gates read as input (the control root's budgets.json, doc-ceilings.json and outward-vocabulary.json, the evidence root's current.json and minted edition directories) is machinery; so are a kit file KIT-MANIFEST.json lists, launchpad source (scripts/, packages/, corpus/, .claude/, .agents/, .codex/), launchpad configuration (package and lock files, dotln.config.json, KIT-MANIFEST.json, tsconfig files, .gitignore, .gitattributes, .node-version, .nvmrc, .npmrc, the prettier files, CLAUDE.md, AGENTS.md) and any declared source of a suite the complete run executes and the document gate does not, read from the runner's own table without core-only suites in a kit instance. The order's own evidence, verification and final-review lanes, and any document or record file under a configured record root or Markdown at the repository root, are documents and records. Anything else is unclassifiable and keeps the complete run.",
  "evidence": [
    "Work-order map row WO-243, receipt 060's second known issue: records under docs/ that are gate inputs (docs/control/budgets.json, the minted evidence editions, docs/control/doc-ceilings.json) are machinery inputs, never documents.",
    "scripts/test-runner.mjs classifySuite and the review selection: structural, document and generated suites also run in the document gate, and the structural registrations suite declares docs/ as a source, so only product suites and non-generated machinery suites read inputs the document gate does not; in core their record sources are docs/KIT.md, docs/control/budgets.json, docs/planning/followups.json and CLAUDE.md, all core-only.",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity excludes docs/, .claude/, .agents/, root Markdown and attributed paths from the product identity; the selection also honours configured record roots, which scripts/test-target-worktree-start.mjs's fixture keeps under records/, and lets no root exempt source.",
    "docs/KIT.md §What runs here: an instance's npm test -- --review is the instance selection (structural checks and kit-verify), so a kit file is what that run judges.",
    "The closeout matrix's last two cases: a machinery conflict resolved to main's bytes leaves git diff HEAD empty yet selects the complete run through the receipt, and a later integration keeps it."
  ],
  "rejected": [
    {
      "option": "Compare against the activation base throughout",
      "reason": "Paths main's merge brought in would count as the order's change, which is the redundant run this order removes."
    },
    {
      "option": "Compare against HEAD alone",
      "reason": "A branch commit made before final review would hide the order's change; the activation base and the integrated main commit bound what the branch took in."
    },
    {
      "option": "Classify by the product code identity's exclusion rule alone",
      "reason": "It treats a configured record root outside docs/ as code and a gate-input record under docs/ as a document."
    },
    {
      "option": "Treat every file under a record root as a document",
      "reason": "A script placed under a record root would hide source from the selection; only document and record file types, and the order's own record lanes, count."
    }
  ],
  "reopenWhen": "The selection classifies a gate-input record as a document, an ordinary record as machinery, or loses a resolved conflict across integrations."
}
```

## WO-243-D005 — A criterion's words take precedence over the changed paths

```json
{
  "id": "WO-243-D005",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "When a target order's criterion names npm test in any form (npm test, npm test -- --review, npm test -- --only <suite>), the selection keeps the complete launchpad run and names that criterion. The target gate's selection is review when a criterion names a review form (npm test -- --review or target-gate with --review) and plain otherwise.",
  "evidence": [
    "Work-order map row WO-243: receipt 060's first known issue and receipt 061's known issue say the checks a criterion names take precedence over the path rule, so a target-only order whose criterion names npm test -- --review keeps the complete run; the order's Known issues say the same.",
    "scripts/lib/handoff-ledger.mjs requireGateClaims answers a target order's npm test claim from the target gate's row (targetGateEvidence), never a launchpad complete row: the precedence keeps the run for the criterion's literal claim, not because completion consumes it.",
    "Product 07 §Preflight before the full gate: a target order whose criteria name only its target gate and the launchpad document gate owes no launchpad complete run."
  ],
  "rejected": [
    {
      "option": "Read npm test on a target order as the target gate, as completion does",
      "reason": "The refutation receipts and the order chose the literal reading; reversing it is the reopening condition the order names, not the executor's choice."
    }
  ],
  "reopenWhen": "An order's criteria name a check its changed paths do not justify and the operator or a verifier says which wins, or a target-only fixture order gets a selection its verifier contradicts."
}
```

## WO-243-D006 — Every reader of the comparison bases

```json
{
  "id": "WO-243-D006",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Census every reader of the activation base, the integration helper's bases and the branch's merge base with main across scripts/ and packages/; each is kept, except integrationTestCommand, which moves from before-to-working-tree to before-to-upstream so its list reports only what main's merge touched. The selection is the one new reader; the table below records each disposition.",
  "evidence": [
    "rg over scripts/*.mjs, scripts/lib/*.mjs and packages/{skeleton,compiler,console}/src for checkpointSha, latestCheckpointSha, checkpointRef, local/integration.json, receiptFile(, changedMachinery(, integrationTestCommand(, changedSinceLastGate( and merge-base, tests and generated dist excluded (2026-11-07).",
    "Target-side bases (state.baseCommit) are read by target-base.mjs, target-publish.mjs, target-commit-lint.mjs, github-body.mjs, target-worktrees.mjs, target-worktree-close.mjs, target-gate.mjs and drive-route.mjs; they bind a target subject to its activated base, not the launchpad closeout."
  ],
  "rejected": [
    {
      "option": "Move changedMachinery's default base for every caller",
      "reason": "The review selection and the scheduler's branch leads ask what the branch changed against main, dirt included; only the helper's list asks what main's merge brought."
    }
  ],
  "reopenWhen": "A new reader of these bases appears, or one listed here starts to answer the order's closeout scope."
}
```

Search boundary: runtime source in `scripts/` and `packages/`; tests,
fixtures and generated `dist/` were read only where a row names them.

| Reader | Base it reads | Disposition |
| --- | --- | --- |
| `scripts/lib/closeout-scope.mjs` `closeoutChanges` | the latest `WorkOrderActivated` event's `checkpointSha^1`; a complete integration receipt's `upstream`, `authored` and `priorAuthored` | New: the selection's comparison base and resolved conflicts (D004). |
| `scripts/lib/worktree-integration.mjs` `integrationTestCommand`, now `mergedMachinery` | `before` to the working tree, through `changedMachinery` | Moved: `before` to `upstream` with the new `head` option, and it names the machinery suites main's merge touched instead of a run, so the affected line is main's merge alone (D007). |
| `scripts/lib/worktree-integration.mjs` `integrateOwnedWorktree` | `before` (HEAD), `upstream` (main), `merge-base before upstream`, ancestor checks, `before..upstream` and `before..checkpoint` for the console selection | Kept: preservation, fast-forward or merge, the no-op check and recovery; the new receipt also carries `priorAuthored`. |
| `scripts/lib/worktree-integration.mjs` `decisionStub` | the receipt's `before`, `upstream` and `checkpointRef` | Kept: the draft decision names both bases; its last line now names both printed lists. |
| `scripts/lib/release-preparation.mjs` `integrationPreparationRefusal`; `scripts/release.mjs` `prepare --integration` | the pending receipt's `checkpointRef`, `workOrder` and `complete` | Kept: release preparation's collision record. |
| `scripts/lib/harness-prune.mjs` | each worktree's pending receipt | Kept: protects a pending integration's stash. |
| `scripts/refute-plan.mjs` | `integration.json` as an ignored local record name | Kept: the planning branch's local-record list. |
| `scripts/lib/checkpoint.mjs` `createCheckpoint` | HEAD as each checkpoint's parent | Kept: the activation base the selection reads is this parent. |
| `scripts/lib/control.mjs`; `scripts/lib/control-time.mjs` | each event's `checkpointSha` and `checkpointRef` | Kept: the latest-checkpoint projection and recovered times. |
| `scripts/resume.mjs` status, `correct` and checkpoint warnings | `latestCheckpointSha`, a correction's `checkpointSha` | Kept: restore commands and the identity a correction judges. |
| `scripts/test-runner.mjs` `changedMachinery` default callers (review selection, branch scheduling leads) | `merge-base HEAD origin/main` (or `main`) to the working tree, untracked files included | Kept: what the branch changed; gained only the optional `head`. |
| `scripts/test-runner.mjs` `changedSinceLastGate` | the newest gate row's identity | Kept: not a merge base. |
| `scripts/lib/handoff-ledger.mjs` `changedDocuments` | `git diff HEAD` and untracked files | Kept: whether completion needs a document row. |
| `scripts/lib/review-worker.mjs` change base | a target order's activation base (`resolved.target.baseCommit`); otherwise `merge-base HEAD main` | Kept: the base a change review reads its diff against, which the selection does not read. |
| `scripts/lib/document-failures.mjs` | `merge-base HEAD main`, or `--against` | Kept: where the document-failure comparison replays the documents. |
| `scripts/docs-check.mjs` `frontPageFindings` | `merge-base HEAD main` (`FRONT_PAGE_BASE`) | Kept: the front page's amendment base. |
| `scripts/lib/release-records.mjs` `reviewedLaunchpadIdentity`, called by `worktree publish` for a target order's records | `merge-base <revision> origin/main` and the product code identity at both | Kept: a changed launchpad code identity requires the reviewed product gate. With record roots under `docs/`, as in core and the instance, it changes only with paths the selection calls machinery or cannot classify. A target order's final review records no product gate row, so such a publish refuses before and after this order; that limit is outside this order. |

## WO-243-D007 — The integrate helper's two lists

```json
{
  "id": "WO-243-D007",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "After a completed generation, worktree integrate prints two lists. Affected by main's merge (what it touched; gated on main, owed by no order here) names the launchpad machinery suites whose declared sources main's change touched, from the old head to the main commit taken in, and nothing to run. Owed by this order (its closeout selection; not run) is the selection, spelled for the target worktree of a target order. Its no-op path prints the owed list after took in nothing, so an executor reads it at the closeout point whether or not main moved. A pass that holds generation for an authored conflict prints neither, as before, and says the completing pass prints both. changedMachinery takes an optional head revision for the commit-to-commit comparison; its default callers keep the merge base to the working tree. mergedMachinery replaces integrationTestCommand, whose working-tree mode had no runtime caller left.",
  "evidence": [
    "Before: integrationTestCommand(root, before) compared before with the working tree, so the order's uncommitted work and main's merge fed one Affected checks list, which always named a complete run (npm test -- --review or npm test) beside three preflight commands.",
    "scripts/lib/generated-artifacts.mjs: every gate's structural generated phase runs harness check, release check-surfaces --local and check-publication, so the document gate every selection names covers the three integration preflights; listing them as runnable commands beside the owed list invited reading them as a duty (round-1 design review F9).",
    "scripts/test-worktree-integration.mjs: the merged-machinery case shows a working-tree machinery edit selects no suite between two equal commits while the committed edit selects one; the no-op case prints the owed list; the first-invocation case prints the launchpad order's owed list and the suites main touched; scripts/test-target-worktree-start.mjs: an adopted kit change shows under the affected line while the owed list names the target gate and the document gate."
  ],
  "rejected": [
    {
      "option": "Drop the affected list",
      "reason": "The reviewer still reads what main's merge touched when it judges the carried-forward claims and changed evidence inputs (product 07 §Independent workflows and integration)."
    },
    {
      "option": "Keep the launchpad run and the three preflights as the affected list's lines",
      "reason": "Runnable commands under a heading that says no order owes them are the two-way reading this order removes; the suites name what main touched without inviting a run."
    },
    {
      "option": "Print the owed list in launchpad-relative form for every order",
      "reason": "A target session runs it from the target worktree, where npm reads the target's own package.json."
    }
  ],
  "reopenWhen": "An executor or reviewer runs a check because the affected line names it, or the owed list names checks the briefing does not."
}
```

## WO-243-D008

Release surfaces: the component version, the re-minted authority edition, the role-oracle baseline and the cold-start readings. The role oracle wo243-role-baseline.json points here by the bare anchor, as the register's revision does.

```json
{
  "id": "WO-243-D008",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "npm run release -- prepare --local assigned v0.120.1 (WO-243-D001). @dotln/skeleton moves from 0.87.0 to 0.87.1 for the role text in loadouts/contributor.ts, a compatible instruction fix; the console's pin and package-lock.json follow; no other component's source changed, and HARNESS_HOST_VERSION stays 0.46.0 because harness-host.ts is unchanged. Each npm run sync after a change to contributor.ts or the skeleton's version re-minted the authority edition (contributor.ts is an authority source): revision 001 after the first role text, 002 after the version bump and 003 after the round-1 review fixes; docs/evidence/current.json selects 003, and sync retains the earlier revisions as it retains every unselected one. The artifact-identity, verification and feedback editions stayed current, so no live feedback episode runs. The role oracle's chain gains packages/skeleton/fixtures/wo243-role-baseline.json over wo257-role-baseline.json, recording each root's role and opt-out hashes and startup cost; scripts/test-process-debt.mjs and scripts/test-gate-followups.mjs read the new head. Cold starts: executor 44,358 to 44,563 bytes (+205) against its 29,246-byte ceiling, reviewer 41,061 to 41,289 (+228) against 28,884, verifier 38,638 to 38,715 (+77) against 29,831; planner 30,780, release-close 28,638 and router 17,124 are unchanged and over their ceilings, and the refuter's 27,560 has no ceiling.",
  "evidence": [
    "Cold-start bytes computed as scripts/test-gate-followups.mjs computes them (the installed CLAUDE.md plus each root's SKILL.md), before and after npm run build on 2026-11-07; the round-1 review fixes moved the executor from +202 to +205 and the reviewer from +155 to +228 (the reviewer's two complete-run rules now name the selection, and its step 4 no longer names affected checks).",
    "docs/control/budgets.json limits.coldStartBytes: executor 29246, verifier 29831, reviewer 28884, release-close 21266, planner 24576, router 16384, refuter null.",
    "npm run sync on 2026-11-07: harness and authority-evidence regenerated; release-surfaces waited for the release version and role-oracle for this oracle.",
    "The closeout sentences were tightened from a first draft that grew the executor by 331 bytes, the reviewer by 240 and the verifier by 117."
  ],
  "rejected": [
    {
      "option": "Trim other duties to fit the ceilings",
      "reason": "Product 07 keeps reviewed rules whole and boards optimization with equivalent usefulness."
    },
    {
      "option": "Bump the console",
      "reason": "Its source is unchanged; only its skeleton pin moved."
    }
  ],
  "followup": "Optimize the role roots' cold-start bytes with equivalent usefulness: WO-243's closeout-selection sentences added 205 bytes to the executor (44,563 against its 29,246-byte ceiling), 228 to the reviewer (41,289 against 28,884) and 77 to the verifier (38,715 against 29,831); the planner, release-close and router stay over their ceilings at the bytes WO-257-D007 recorded, and the refuter has no ceiling.",
  "reopenWhen": "The release-surfaces check names a component this record does not, or a role root's cold start moves by more than the closeout sentences account for."
}
```

## WO-243-D009 — The closeout's measured cost, before and after

```json
{
  "id": "WO-243-D009",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Record the closeout's measured cost for one target-only and one mixed fixture order (docs/evidence/WO-243/controls.json). The selection is one read of the order, its changed paths and its criteria inside the briefing: the fixture's briefing read took 80 and 76 ms at the base and 127 and 127 ms with the selection in the run controls.json records on the final tree (earlier runs on the same fixtures: 99 to 101 against 165 to 167 ms, 107 and 108 against 180 and 160 ms, and 80 and 77 against 129 and 128 ms), about 50 to 75 ms per read. The target-only order's closeout loses one complete launchpad run; the mixed order's closeout is unchanged. That run's cost is the launchpad's: in core the last fifteen passing complete review runs' median is 45 min 9 s (2,708,506 ms) and the document gate's 2 min 5 s (125,355 ms); in the personal instance the one recorded review run took 22 s (the instance selection's seven suites) and its document gate's median is 46 s.",
  "evidence": [
    "docs/evidence/WO-243/closeout-control.mjs, run in both arms (controls.json records its command lines and readings).",
    "Medians from readGateChecks over docs/control/local/harness/checks.json in the main checkout and in the personal instance's checkout: passing, executed, unstopped rows; complete review rows with more than twenty required suites, rows recorded 2026-11-03T21:16Z to 2026-11-07T02:57Z, document rows 2026-11-05T19:34Z to 2026-11-07T05:27Z.",
    "The order's observed gap: the fork's WO-019 started a complete run at 22:28:21Z on 2026-10-28 and stopped it at 22:30:54Z with no pass."
  ],
  "rejected": [
    {
      "option": "Run a complete launchpad run inside the fixture to time it",
      "reason": "The fixture launchpad carries a partial runner whose complete selection cannot run there; the real launchpads' recorded rows measure that run."
    }
  ],
  "reopenWhen": "The selection's read cost grows past a second per read, or a launchpad's complete-run median changes by more than half."
}
```

## WO-243-D010 — The paired control with the selection reverted

```json
{
  "id": "WO-243-D010",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "The paired control runs one target-only and one mixed fixture order, each integrated over a main change to launchpad machinery, through the readers of two arms: the base (main at e4fe2dae, extracted with git archive into session scratch and built there, where no selection exists) and the candidate tree. The base arm exits 1: the executor's step 8 (Start one complete run, npm test -- --review) and the helper's only list name the complete run for both orders. The candidate arm exits 0: the target-only order's briefing and owed list name the target gate with --review and the document gate, and the mixed order's add the complete run. Both arms' exit codes and checks are in docs/evidence/WO-243/controls.json.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-243/closeout-control.mjs <arm-root> <arm-label>, once per arm on 2026-11-07.",
    "The base arm's skill text is the archive's .claude/skills/dotln-executor/SKILL.md at e4fe2dae; the candidate's is this tree's regenerated one."
  ],
  "rejected": [
    {
      "option": "Revert single files inside the candidate tree",
      "reason": "The readers and their runtime travel together; the base revision is the selection reverted, whole."
    }
  ],
  "reopenWhen": "A rerun of either arm changes its exit code or the checks it names."
}
```

## WO-243-D011 — Write-backs: product 07 and the kit guide state the built selection

```json
{
  "id": "WO-243-D011",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Product 07 §Preflight before the full gate states the built mechanism in place of the 2026-10-30 contract sentence: the selection, its three readers, what each kind of order owes, how the order's changes are read, and the unknown case. Its execution paragraph says the executor runs what the selection names, the complete run for a launchpad order. §Independent workflows and integration states the helper's two lists, its no-op print and that the reviewer and the integrating final review run the owed checks. The kit guide's §What runs here, and what does not states the selection for an instance and the working route for a target order already active when the instance takes this release. The contract sentence's dated parenthetical, which named the role sentence as following in WO-242, is replaced by links to this order's decisions: WO-242 became plan-first mode, and the sentence follows here.",
  "evidence": [
    "git show e4fe2dae:docs/product/07-execution-guide.md: the contract sentence ended (the fork's WO-019-D031, 2026-10-28; the executor role's closeout sentence follows in WO-242); WO-242's order file is plan-first mode.",
    "docs/KIT.md exists on main (WO-245 merged), so it is the kit guide the order's step 6 names in place of scripts/kit/README.client.md."
  ],
  "rejected": [
    {
      "option": "Append a dated account under the standing headings",
      "reason": "A standing document holds the current state; the dated account is this record."
    }
  ],
  "reopenWhen": "A reader of product 07 or the kit guide runs a check the selection does not name, or misses one it does."
}
```

## WO-243-D012 — The runner's declarations load only for a target order

```json
{
  "id": "WO-243-D012",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "The readers load the runner's suite declarations through closeoutRunnerFor, which imports scripts/test-runner.mjs only when the order is a target order, the only kind whose launchpad paths the selection classifies; a launchpad order's selection returns before it reads them. resume loads them once, after it selects the order, for next, fix, verify, briefing, final-review, implementation-ready and repair-complete; the integrate helper loads them for its owed list. A failed import still makes a target order's selection uncertain, which keeps the complete run.",
  "evidence": [
    "The first probe of bash scripts/test-resume.sh --fixtures-only failed in scripts/test-off-ramps.mjs at line 1806: that fixture plants a stub scripts/test-runner.mjs whose top level exits 2 on unexpected arguments, and resume imported the runner for every briefing and completion action, so implementation-ready ended with the stub's message instead of its refusal.",
    "After the change both groups of the resume fixtures pass (5 and 12 cases, none failed), the target matrix and briefing cases pass, and the integration fixture's launchpad order prints its owed list."
  ],
  "rejected": [
    {
      "option": "Import the runner in a child process for every order",
      "reason": "It isolates any runner's side effects at the cost of a process per read, for declarations only a target order's selection needs."
    },
    {
      "option": "Replace the runner's declarations with a fixed list of record paths",
      "reason": "The list would drift from the suites the complete run executes; the runner's own table names them."
    }
  ],
  "reopenWhen": "A target order's launchpad carries a runner whose import has side effects, or a launchpad order's selection starts to read the runner's declarations."
}
```

## WO-243-D013 — Review round 1: every finding fixed or recorded

```json
{
  "id": "WO-243-D013",
  "date": "2026-11-07",
  "dispatch": "resume: next; review round 1 (criteria, design, consistency) over tree e124dd38",
  "decision": "Of 23 findings (18 distinct after the three reports' overlaps), 17 are fixed and one is recorded. Fixed: the case inventory lists the matrix test (consistency F1, blocking, fixed in the tree before the report arrived); the decisions index regenerated (consistency F2); D008 names the selected authority revision (consistency F3, criteria F5); D006 lists review-worker.mjs, document-failures.mjs, docs-check.mjs and reviewedLaunchpadIdentity (consistency F4, criteria F1); the reviewer's step 4, its two complete-run rules and the helper's conflict-hold message no longer name affected checks as a duty, and the rules name the selection (design F3, consistency F5 and F6, criteria F2); the verifier's briefing prints the selection its target clause points to (consistency F7); executor steps 6 and 7 and the ladder sentence say the selected runs (consistency F8); an unreadable order keeps a target order's target gate (design F1); closeoutScope guards itself so every reader shares one failure meaning, and the helper's hand-copied fallback is gone (design F2); a reason says whether the runner was not loaded or failed, and the headings live beside the formatter (design F4); an explicit owe step decides the complete run, an unclassifiable conflict is named as such, and a failed Repository parse no longer adds a second reason (design F5); a test pins the registration's commands (design F6); one receipt path serves the helper and the selection (design F7); the affected line names the machinery suites main touched instead of a run and three preflights (design F9), and mergedMachinery replaces integrationTestCommand and its unused mode (design F10); tests read a launchpad order's completion advisory, the repair-complete advisory, an unregistered repository and a registry entry bound to another base (criteria F3 and F4). Recorded, not fixed: the hand-kept list of records the gates read as input (design F8).",
  "evidence": [
    "docs/control/local/reviews/WO-243/round-1-criteria.md, round-1-design.md and round-1-consistency.md.",
    "The design report's F8: product suites declare no sources, so the classifier names the gate-input records the refutation receipt listed; drift there would classify a new gate-input record as a document."
  ],
  "rejected": [
    {
      "option": "Derive the gate-input records from the runner now",
      "reason": "Product suites declare no sources (test-runner.mjs detectionSources), so a single source of truth needs every product suite to declare the records it reads, a change to the runner's whole table beyond this order; D004's reopening condition names the drift."
    }
  ],
  "followup": "Give the closeout classifier one source for the records the gates read as input: have the product suites that read records declare them as sources (or export one list from scripts/test-runner.mjs), so the selection, changedMachinery and the code identity read the same data instead of the selection's hand-kept list.",
  "reopenWhen": "A product suite starts to read a record under a record root that the classifier does not list, or round 2 finds a fix here incomplete."
}
```

## WO-243-D014 — Review round 2: the admitted finding fixed, the notes boarded

```json
{
  "id": "WO-243-D014",
  "date": "2026-11-07",
  "dispatch": "resume: next; review round 2 rechecks over tree 9551026b",
  "decision": "Every round-1 fix the rechecks named holds, apart from design F8, which D013 recorded and now boards as a follow-up. Round 2 raised eight new findings, and each was disposed on a named basis. Admitted on criterion 2 and fixed with a regression case: a runner that imports without a suite table makes the selection uncertain again, as round 1's guard did (design F1; criteria F1 read the same lines as a note). Admitted as a regression of the briefing main had and fixed: round 1's verifier fix printed the selection in every verifier briefing, although its finding concerned the target clause, and for a launchpad order the printed complete run contradicted the handoff evidence line beside it, which tells the verifier to consume the executor's rows; the verifier's briefing now prints the selection for a target order only (design F2, consistency F1). Fixed as corrections to this order's own write-backs and records, which the rule's record-not-fix limit does not reach: product 07, the kit guide and D012 now name the verifier's briefing and the verify action (criteria F2, consistency F1); the draft-decision sentence and the helper comment, both in lines this order changed, now name what the helper prints (consistency F2); D013 gains the follow-up the boarded-defect rule asks for (consistency F3). Recorded, not fixed: on a Git failure inside changedMachinery the informational affected line would name every machinery suite rather than say unknown (design F3); this round's residual notes (the target lost when the state itself throws, the hand-kept action list that loads the runner, the unused re-export through executor-readiness, the receipt union written in both modules) change no selection.",
  "evidence": [
    "docs/control/local/reviews/WO-243/round-2-criteria.md, round-2-design.md and round-2-consistency.md.",
    "scripts/resume.mjs preflightBriefing: a launchpad order's verifier briefing names the structural and Preflight rows to consume; the closeout block printed after it named npm test -- --review as owed."
  ],
  "rejected": [
    {
      "option": "Fix the affected line's Git-failure fallback now",
      "reason": "The line is informational and names nothing to run; a new finding that breaks no criterion and no behavior main had is recorded under the admission rule, not fixed."
    },
    {
      "option": "Keep the selection in every verifier briefing",
      "reason": "It contradicts a launchpad order's handoff evidence line and invites the complete run the verifier consumes instead of runs."
    }
  ],
  "followup": "Make the integrate helper's affected line say unknown when changedMachinery cannot compare the old head with the main commit taken in, instead of naming every machinery suite through changedMachinery's fallback.",
  "reopenWhen": "A verifier of a launchpad order starts a complete run on the briefing's words, or an affected line names suites main's merge did not touch."
}
```

## WO-243-D015 — Verification returns the incomplete comparison-base census to repair

```json
{
  "id": "WO-243-D015",
  "date": "2026-11-07",
  "dispatch": "resume: verify",
  "decision": "Judge criterion 3 unmet because D006 omits scripts/lib/planning-followups.mjs::changedAgainstMain. This existing runtime consumer reads this branch's merge base with main and origin/main, then tracked differences and untracked paths, for the executor completion's touching-followups advisory and the plan followups --touching query. The independent probe on the recorded subject returns the same e4fe2dae comparison base as merge-base HEAD main and confirms the consumer has no D006 row. Return this bounded documentation defect to repair: complete the census, state each omitted reader's kept or moved semantics and reason, regenerate the decisions index and validate the corrected records. The verifier changes no implementation or original census row. Behavioral selection probes pass; the unmet census duty is not evidence of a wrong closeout selection.",
  "evidence": [
    "docs/evidence/WO-243/verification-census.mjs and verification-census.json: current-worktree reproduction exits 1; sameBase true, listedInD006 false; callers are scripts/lib/lifecycle-evidence.mjs and scripts/refute-plan.mjs.",
    "scripts/lib/planning-followups.mjs:787 changedAgainstMain; scripts/lib/lifecycle-evidence.mjs:161; scripts/refute-plan.mjs:288.",
    "The order's criterion 3 explicitly requires every reader of the comparison base and its kept or moved semantics; D006 states that its scope includes this branch's merge base with main.",
    "verification-probes.json: nineteen independent fixture checks pass, and requireGateClaims consumes the executor's passing complete review row at the unchanged current code identity."
  ],
  "rejected": [
    {
      "option": "Accept D006 unchanged as a harmless omission",
      "reason": "That NoOp leaves an explicit acceptance duty unmet. Earlier reviews also treated omitted comparison-base readers as criterion 3 defects."
    },
    {
      "option": "Expand the finding to every use of Git ancestry or change the selector",
      "reason": "Unrelated ancestry checks and different subjects do not establish a missing reader of this comparison base; the reproduced defect requires a census correction, not behavioral code."
    },
    {
      "option": "Rewrite D006 from the verifier or waive criterion 3",
      "reason": "The verifier judges the recorded candidate and writes its report and evidence; no operator words authorize a waiver."
    }
  ],
  "reopenWhen": "A repair records this consumer and any other supported omission with its semantics and reason, or evidence demonstrates that this runtime reader is already covered by a named D006 row."
}
```

## WO-243-D016 — Correct verifier output budgeting and baseline bootstrap

```json
{
  "id": "WO-243-D016",
  "date": "2026-11-07",
  "dispatch": "resume: verify",
  "decision": "Record and correct two verifier process errors without attributing either to the subject. Initial status and several large source batches exceeded the tool display budget. Subsequent status reads select fields, reports are read separately, and the relevant source and decisions are read in bounded sections; the verdict relies on those readable bytes and the independent reproductions. The first baseline-build attempt invoked the extracted archive's harness before its dist runtime existed, so it stopped with ERR_MODULE_NOT_FOUND for dispatch-journal.mjs before any build. The correction runs the selected worktree's existing bounded wrapper around the baseline archive's own build.mjs; that build exits 0 and the independently rerun base control then exits the expected 1. The candidate control exits 0. No implementation fix or passing gate row is invented from the failed attempt.",
  "evidence": [
    "Session tool results explicitly report truncated batches; the later separate reads of all seven worker reports and the complete selector, relevant diffs and decision sections are readable.",
    "Ignored session scratch base-build.log: ERR_MODULE_NOT_FOUND; base-build-corrected.log: Built browser-evidence, compiler, console, kernel, skeleton and bounded exitCode 0.",
    "docs/evidence/WO-243/verification-controls.json preserves the rerun base and candidate outcomes separately from the executor's immutable controls.json."
  ],
  "rejected": [
    {
      "option": "Treat truncated material or the first archive bootstrap as verification evidence",
      "reason": "Omitted bytes were not observed, and an unbuilt harness establishes nothing about the candidate's behavior."
    }
  ],
  "reopenWhen": "A later claim depends on a truncated section not subsequently read, or a control result cannot be tied to its built arm."
}
```

## WO-243-D017 — The comparison-base census, completed under a stated rule

```json
{
  "id": "WO-243-D017",
  "date": "2026-11-07",
  "dispatch": "resume: fix",
  "decision": "Complete D006's census, which VER-001 F1 returned to repair (D015), under a stated inclusion rule that a check holds. A reader is a runtime function in scripts/ or packages/ (tests, fixtures, generated dist/ and installed dependencies excluded) that reads a base the closeout selection compares against: the activation checkpoint (checkpointSha, checkpointRef, latestCheckpointSha), the integrate helper's receipt (control/local/integration.json), or the branch's fork point from main (a git merge-base that returns a base, a range such as origin/main...HEAD or origin/main..HEAD, or an exported function that returns one). Each runtime caller of the eleven exported functions census-check.mjs follows (the readers the two tables name, and changedSinceLastGate, which reads the newest gate row and which D006 lists as no merge base) is listed with it, and the selection's own callers are listed because they are the readers this order added (D003). Two exported functions are not followed: createCheckpoint, whose callers in resume.mjs's transitions and the integrate helper's preservation record the checkpoint it makes rather than compare against it, and integrateWorktree, the entry of worktree integrate, whose base reads are integrateOwnedWorktree's; D006's rows cover both. The classes of site outside the census are stated below the table. Misread: D006 searched for merge-base among its terms but recorded a judgment of which hits were readers without stating a rule, so readers away from the integration and gate paths, and a reader behind a helper in a file it already named for another reason, went unlisted. Meant: every reader of these bases across scripts/ and packages/. Changed: the eight rows below complete the table. Seven keep their semantics; the eighth names the selection's callers, which are new with it, and closeoutChanges stays the one new reader of the bases. D006 stays as written, so its table and this one are the census together.",
  "evidence": [
    "docs/evidence/WO-243/census-check.mjs scans each runtime file the rule covers for merge-base, ranges against HEAD, the checkpoint fields, the receipt and calls of the eleven exported readers. Every function-level key needs a disposition that names its census row or excluded class; a merge-base whose own argument list holds --is-ancestor is classified as an ancestry predicate. The census tables must name every disposition's reader and hold no row without a site. Sites are keyed by file, top-level function and pattern, so the check fails on a new or vanished key but not on a further read inside a function it already keys; census-check.json lists each key's lines for that reading.",
    "docs/evidence/WO-243/census-check.json records both arms on this candidate: with --census D006 the check exits 1 and names the keys D006's table omits and the two classes it leaves unstated; with D006 and this decision it exits 0.",
    "VER-001 F1 and D015: changedAgainstMain in scripts/lib/planning-followups.mjs reads merge-base HEAD main origin/main, and scripts/lib/lifecycle-evidence.mjs and scripts/refute-plan.mjs call it; on the verified candidate its base equals merge-base HEAD main (verification-census.json).",
    "Product 07 §Operator-opened planning pass, item 7: an order's decisions are records, dated and immutable, one per event."
  ],
  "rejected": [
    {
      "option": "Add the quoted reader's row alone",
      "reason": "The finding's class is an incomplete census: the same sweep finds further readers the report did not quote, and a census with no stated rule can miss readers again in the same way."
    },
    {
      "option": "Rewrite D006's table in place",
      "reason": "D006 records the census as the execution judged it; the repair's completion is its own record."
    },
    {
      "option": "Link D006 through a reopens object",
      "reason": "A reopening observation turns D006 into a follow-up feed candidate (scripts/lib/planning-followups.mjs), which a same-order completion is not."
    },
    {
      "option": "Count every Git ancestry check, or every read of main's tip, as a reader",
      "reason": "An ancestry predicate returns whether one commit contains another and no base, and main's tip is not where a branch left main; D015 rejected the same widening."
    },
    {
      "option": "Run the census check as a gate suite",
      "reason": "The census is this order's record; a suite that read one order's decisions would bind the gate to that record, and the check reruns from the evidence lane."
    }
  ],
  "reopenWhen": "census-check.mjs exits 1 on a later tree of this order, a function it already keys gains a further read of these bases, or a verifier names a reader of these bases that neither table lists."
}
```

Search boundary: the files and patterns `census-check.mjs` states, run on
this candidate; D006's rows stand as written.

| Reader | Base it reads | Disposition |
| --- | --- | --- |
| `scripts/lib/planning-followups.mjs` `changedAgainstMain`, called by `scripts/lib/lifecycle-evidence.mjs` (the executor completion's touching-follow-ups advisory) and `scripts/refute-plan.mjs` (`plan followups --touching` without a term) | `merge-base HEAD main origin/main` (the nearer of the two) to the working tree, untracked files included | Kept: which pending follow-up rows name a file this change touches. By inference its base is the selection's base, the activation base until an integration and then the main commit that integration took in, because the branch takes in main only there; the verifier observed both at `e4fe2dae` (`verification-census.json`). It adds no resolved conflicts, which a textual follow-up match does not need, and the selection reads none of it. |
| `scripts/lib/closeout-scope.mjs` `closeoutScope`, called by `scripts/lib/executor-readiness.mjs` `closeoutBriefing` and `closeoutCompletionAdvisory` and by `scripts/lib/worktree-integration.mjs` `owedChecks` | `closeoutChanges`' base and conflicts, through the selection | New: the selection's three readers (D003). They read the selection and no base of their own, so `closeoutChanges` stays the one new reader of the bases. |
| `scripts/lib/worktree-integration.mjs` `regenerate` | the receipt's `checkpointRef`, as the draft decision's marker | Kept: whether the integration's draft decision is already written, so a rerun writes it once; the decision's text names the bases (D006's `decisionStub` row). |
| `scripts/lib/document-failures.mjs` `classifyDocumentFailures`, called by `scripts/test-runner.mjs` `runGateChecks` | `merge-base HEAD main`, or `--against` (D006's row) | Kept: names the caller D006's row left out. A document gate reruns its failed checks at that base to say whether each failure is already there, which never turns a check green; the selection reads none of it. |
| `scripts/resident-bind.mjs` `resolveBase`, called by `readBindingInputs` (`resident-bind WO-NNN`) and `observeBinding` (`--check`) | `merge-base <branch> origin/main`, else `main`; an operator's `--base` replaces it | Kept: the base a resident's mission source records, recomputed by `--check` to report drift; it binds a resident to the order's worktree, not the closeout. |
| `scripts/launchpad.mjs` `publishUpdate` (`launchpad update --publish`) | `merge-base main HEAD` on an instance's update branch | Kept: whether the update branch names a kit commit other than the one it named where it left main and the one main names; an update branch is not an order's branch. |
| `scripts/worktree.mjs` `worktree publish`, its `origin/main...HEAD` diff of added records | the files the branch added since its merge base with `origin/main` | Kept: refuses a records branch that adds target records the order moved to its target; it reads committed additions at publication, after the closeout. |
| `scripts/lib/contributions.mjs` `contributionSignoffRules`, called by `scripts/worktree.mjs` `worktree publish` | `origin/main..HEAD`, the commits the branch adds over `origin/main` | Kept: each published commit's sign-off rule; it reads commits at publication, not the order's changed paths. |

Outside the census, by class:

- **Ancestry predicates.** A `git merge-base --is-ancestor <older> <newer>`
  answers whether one commit contains another and returns no base;
  `census-check.json` lists each site by file and line.
- **Target repository bases.** `scripts/lib/target-base.mjs` `targetBase`
  takes a target subject's merge base with its base branch. It and the target
  modules D006's evidence names bind a target subject to its activated base,
  which the launchpad closeout does not compare against.
- **Command allowlists.** `packages/skeleton/src/change-review-protocol.ts`
  `CHANGE_REVIEW_SHELL` names `git merge-base` among the commands a review
  worker may run, and runs none.
- **The start's own base.** `worktree start` records `launchpadBase` for a
  target order and checks the self start's `base` against `HEAD`. Both create
  or guard the commit the activation checkpoint is then taken on, and the
  activation base is read from that checkpoint (D006's `createCheckpoint`
  row). The self start's check matches no pattern of the check; the pending
  start's guard on `launchpadBase` (`scripts/worktree.mjs` line 1005) is an
  ancestry predicate and is counted with that class.
- **Reads of `HEAD` by name.** A read of the branch's own head, such as
  `git diff HEAD` or a commit recorded from `rev-parse HEAD`, compares with
  the branch's current commit, which equals the selection's base only while
  nothing is committed on the branch. D006 lists one,
  `scripts/lib/handoff-ledger.mjs` `changedDocuments`, for whether completion
  needs a document row. Others, such as the plan-first candidate in
  `scripts/lib/plan-first.mjs`, which diffs against the `HEAD` it recorded,
  stay outside the census, and no pattern of the check matches them.

## WO-243-D018 — The repair's review: round three alone, its notes disposed

```json
{
  "id": "WO-243-D018",
  "date": "2026-11-07",
  "dispatch": "resume: fix; the repair's review ladder",
  "decision": "Take the repair through the ladder at round three alone. It changes no product source, which is under the fifty changed source lines at which a repair starts at round three, so one combined dotln-worker carrying the three briefs reviewed the repair's delta: tree 7ab95fab against 8370344c, the tree the fix dispatch's checkpoint recorded. It admitted no finding and raised five notes. Four were corrections to this repair's own record and are fixed in D017: the caller rule now names the eleven functions the check follows and the two exported functions it does not, with why (F2); the start's own base no longer says that no pattern matches it, and the decision text no longer counts the classes (F3); reads of HEAD by name are stated as a class outside the census, with D006's changedDocuments row as one of them (F4); and the publishUpdate row and the count of kept rows now match the code (F5). The fifth is recorded: the check keys sites by file, function and pattern, so a further read inside a function it already keys passes it (F1). D017 states that limit and names it in its reopening condition.",
  "evidence": [
    "docs/control/local/reviews/WO-243/repair-1/round-3-combined.md: reviewed tree 7ab95fab against 8370344c, 0 h 12 min, 74 tool calls, five notes and no admitted finding. The worker found no reader of the activation base, the receipt's bases or the branch's merge base with main that D006 and D017 together omit; it reran both census arms with the recorded results and read each of the 30 sites classified as ancestry predicates.",
    "git diff --stat 8370344c 7ab95fab -- packages scripts is empty: the repair changes 0 product source lines. Its delta is census-check.mjs (475 lines in this order's evidence lane, which the product code identity excludes) and its record, D017, and the regenerated decisions index, work-order index and control projection.",
    "The checks behind the notes: scripts/lib/checkpoint.mjs exports createCheckpoint, called at scripts/resume.mjs:465 and scripts/lib/worktree-integration.mjs:935; scripts/lib/worktree-integration.mjs exports integrateWorktree, called at scripts/worktree.mjs:1151; scripts/launchpad.mjs publishUpdate refuses when the branch names the kit commit it named where it left main or the one main names; scripts/lib/plan-first.mjs records rev-parse HEAD as a candidate's base."
  ],
  "rejected": [
    {
      "option": "Skip the ladder as a documentation repair",
      "reason": "census-check.mjs is executable evidence for criterion 3, so the repair touches more than documentation; one independent reading guards against a second census escape."
    },
    {
      "option": "Start at round one with three reviewers",
      "reason": "The repair changes no product source, and product 07 starts a repair under fifty changed source lines at round three."
    },
    {
      "option": "Key the check's sites by line, or pin each key's site count, now",
      "reason": "A code change after the last round would stand unreviewed, and the check is this order's record, whose current census the worker confirmed independently; stating the limit keeps the reopening condition accurate."
    }
  ],
  "reopenWhen": "A verifier finds a reader the census omits inside a function the check already keys, or judges that a repair diff of this kind needs round one."
}
```

## WO-243-D019 — Re-verification judges the completed census and preserves the standing product evidence

```json
{
  "id": "WO-243-D019",
  "date": "2026-11-07",
  "dispatch": "resume: verify",
  "decision": "Judge VER-001 F1 against D006 and its repair completion D017 together. The independent reproduction confirms that D017 names changedAgainstMain, both runtime callers and its kept semantics; D006 and VER-001 remain byte-identical to checkpoint /7. The repair's check passes with D006+D017 and fails with D006 alone, as expected. The wider independent source sweep and row-to-source review found no omitted comparison-base reader. Record a passing VER-002 after the final document gate succeeds. Preserve the passing complete review row at the unchanged product identity rather than start another complete run.",
  "evidence": [
    "docs/evidence/WO-243/reverification-census.mjs and reverification-census.json: independent reproduction, eight repair rows, immutable records, equal current bases and a wider sweep of 404 runtime files with 135 matching lines.",
    "docs/evidence/WO-243/reverification-checks.json: D006+D017 has 57 reader keys, 100 sites and no failure; D006 alone has 20 expected failures; nineteen behavior probes and the matrix, briefing and affected-list tests pass.",
    "Checkpoint /7 to /9 changes no scripts/, packages/, package.json or package-lock.json; the original controls, product 07 and kit guide are unchanged. requireGateClaims consumes the existing passing complete review row at code identity 67d6258cb8e3d0a9b99a1c18882f88edc576d8a449c7d2289949ea33c465ddbc without advisories.",
    "Formatting, the 43 generated harness surfaces, authority evidence, role oracle, publication checks and git diff --check pass. The final document gate and verification-result transition bind the completed report to its candidate."
  ],
  "rejected": [
    {
      "option": "Treat the old D006-only reproduction's continued failure as an unresolved finding",
      "reason": "D006 is an immutable dated record; D017 supplies the missing census entries without rewriting it. The subject to judge is their completed census."
    },
    {
      "option": "Repeat the complete product gate for a repair that changes no product source",
      "reason": "The same product identity already has its passing complete review row, consumed without advisories; focused reproductions independently check the claims."
    },
    {
      "option": "NoOp: leave the order verifying without recording a verdict",
      "reason": "The operator requested verification, and the evidence now permits its completed judgment."
    }
  ],
  "reopenWhen": "A supported input reproduces an omitted comparison-base reader or incorrect disposition, product source changes identity, or the completed candidate lacks a passing document row."
}
```

## WO-243-D020 — Correct re-verification output capture without treating process errors as subject evidence

```json
{
  "id": "WO-243-D020",
  "date": "2026-11-07",
  "dispatch": "resume: verify",
  "decision": "Correct the verifier's output-capture errors within this dispatch. Several initial source/status reads exceeded their output budget; required content was subsequently read in smaller sections or selected from full captured data. The first census-log decoder also rejected the bounded wrapper's prefix; the corrected decoder selects the schemaVersion object separately from wrapper metadata. Preserve the original logs in session scratch, record the corrections in reverification-checks.json, and use neither error as evidence against the subject. No required reading or failed subject check is left unresolved.",
  "evidence": [
    "This dispatch's tool results report truncated oversized reads and the JSONDecodeError before the corrected capture.",
    "docs/evidence/WO-243/reverification-checks.json processCorrections and its twelve bounded results: original exit codes preserved and droppedOutputBytes is zero for every probe."
  ],
  "rejected": [
    {
      "option": "Infer a verdict from truncated output or discard the expected failing control",
      "reason": "Neither establishes the subject's behavior; complete captured results and their original exit codes are available."
    }
  ],
  "reopenWhen": "A required result cannot be decoded completely, a bounded probe drops output, or a verdict relies on a truncated read."
}
```

## WO-243-D021 — Correct the unfiled actor header to match the actual completion flags

```json
{
  "id": "WO-243-D021",
  "date": "2026-11-07",
  "dispatch": "resume: verify",
  "decision": "Correct the unfiled VER-002 actor header by removing accountLabel, which no completion flag or environment value supplied. Misread: the account label shown in a projected attestation was treated as part of the stored actor. Meant: the report must exactly match parseActor's output from the actual supplied flags. Checked evidence: verification-result refused the extra field before recording a result; scripts/lib/control-actor.mjs projectActor alone supplies the not-applicable display default, while scripts/resume.mjs parseActor includes accountLabel only when supplied. Keep the same actual harness, version, model, effort and source; validate the corrected header, regenerate the decisions index and rerun the document gate at the corrected candidate before recording the verdict. The acceptance judgments and product evidence are unchanged.",
  "evidence": [
    "The first npm run resume -- verification-result pass exited 1 with verification report actor header does not match the completion actor; its expected JSON has the five supplied fields and no accountLabel. Canonical status remained verifying with VER-002 and no verdict.",
    "scripts/resume.mjs parseActor at lines 791 to 795 and requireReportActor at line 832; scripts/lib/control-actor.mjs projectActor at lines 13 to 16.",
    "docs/evidence/WO-243/reverification-checks.json preserves the first passing document row, the refused completion's disposition, the exact corrected actor and the later document row."
  ],
  "rejected": [
    {
      "option": "Add an account-label completion flag only to fit the report",
      "reason": "That would attest a value not supplied by this session instead of correcting the mistaken projection field."
    },
    {
      "option": "NoOp: repeat completion with the same header",
      "reason": "The checked equality contract would refuse it again, leaving the operator's verification unfinished."
    }
  ],
  "reopenWhen": "The corrected header differs from the actual completion actor, or the corrected candidate has no passing document row."
}
```

## WO-243-D022 — Final review: the judgment and no source change

```json
{
  "id": "WO-243-D022",
  "date": "2026-11-07",
  "dispatch": "resume: final review; the judgment of WO-243 through VER-001 and VER-002, allocated FINAL-001",
  "decision": "Pass WO-243 at code identity 67d6258cb8e3d0a9b99a1c18882f88edc576d8a449c7d2289949ea33c465ddbc, the identity of the complete review row recorded 2026-11-07T09:04:58.237Z (review selection, 44 required suites, exit 0, 0 h 40 min) and of both verifications' subject, recomputed here before this review's edits. Main and the worktree's merge base stand at the activation base e4fe2dae25a76b5be3d60a95f987e4726845d3cd and the branch carries no commit, so npm run worktree -- integrate WO-243 took in nothing and printed the owed list, npm test -- --review and npm run test:docs, the same two checks the final-review briefing printed and the RepairCompleted advisory recorded, which is criterion 1 observed on this launchpad order itself. Every criterion holds on evidence run again in this session under the bounded wrapper, outside any gate: the closeout matrix case and the target-briefing case of scripts/test-target-worktree-start.mjs, the affected-line, first-invocation and generator-failure cases of scripts/test-worktree-integration.mjs, the census check with D006 and D017 (exit 0) and with D006 alone (exit 1), VER-002's census reproduction (exit 0), the paired control's candidate arm on this tree (exit 0: the target-only order names the target gate with --review and the document gate, the mixed order adds the complete run, briefing reads 177 and 179 ms), harness check (43 generated surfaces), the publication check (256 of 256 headings), the lineage index (193 sections), the meta check (exit 0, the executor's 44,563 bytes accepted under WO-242-D009's 51,226-byte acceptance and the five standing breaches unchanged), the work-orders index check, the harness-context check, release check-surfaces --local, the format check and git diff --check. The base arm of the paired control was not rebuilt a third time: controls.json and VER-001's independent rerun in verification-controls.json both record base exit 1 and candidate exit 0, and the base revision has not moved. The changed standing documents pass: product 07's Preflight, integration and ladder passages are replacements integrated into their paragraphs, each linking this order's decisions, and the kit guide's closeout paragraph is a standing statement; no dated account was added under a standing heading. No source changed in this review, so the complete row stands and no complete run was started; the result consumes that row and the document row of the gate run after the last edit. This review admits no finding of its own: the three executor follow-ups (FUP-d91a2e2780a65b70, the role roots' cold start; FUP-0560f7b8644b36f2, the classifier's hand-kept gate-input list; FUP-dcaad50cf7affa85, the affected line's Git-failure fallback) stay boarded with their conditions, and VER-001's F1 is resolved by D017 as VER-002 judged. The traps named before the material choices: re-running every Preflight suite against a standing complete row (rejected; the cases the verdict rests on were run as focused reproductions), rebuilding the base arm a third time for a record two actors already produced, editing source in review to take a boarded follow-up, shaping the report from the previous instance, and counting the verifier's resolved finding again in this report's block. The NoOp, recording the pass on VER-002 alone, was rejected because the reviewer owns the identity check, the integration, the acceptance judgment, the standing-document judgment, the register rows and the release surfaces. The outcome matched the review's aim.",
  "evidence": [
    "gateCodeIdentity(root) read in session scratch: 67d6258cb8e3d0a9b99a1c18882f88edc576d8a449c7d2289949ea33c465ddbc; docs/control/local/harness/checks.json holds the npm test review row of 2026-11-07T09:04:58.237Z at that identity (exit 0, 44 required suites, durationMs 2410617) and the structural and document rows beside it.",
    "git rev-parse main HEAD and git merge-base HEAD main: all e4fe2dae25a76b5be3d60a95f987e4726845d3cd; npm run worktree -- integrate WO-243 printed Integration took in nothing and the owed list; git stash list empty; no nested repository outside .git.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern 'closeout checks follow the repositories' scripts/test-target-worktree-start.mjs: exit 0 in 17 s; the target-briefing case: exit 0 in 13 s; the three worktree-integration cases: exit 0 in 10 s; census-check.mjs: exit 0, with --census D006 exit 1; reverification-census.mjs: exit 0; closeout-control.mjs <this tree> candidate: exit 0 in 9 s.",
    "harness check: 43 generated surfaces; publication:check: PASS 256/256 headings, PASS publication bootstrap checks; lineage index --check: PASS 193 sections; meta --check: exit 0, 10 budget breaches, executor accepted; work-orders index --check: both pages current; harness-context --check: exit 0; release check-surfaces --local: every license surface refuses publish; format:check and git diff --check: clean.",
    "docs/evidence/WO-243/controls.json and verification-controls.json: base exit 1 and candidate exit 0 in both; VER-001 and VER-002 as filed; docs/control/orders/WO-243.jsonl: VerificationCompleted 14:38:51Z (fail), RepairRequested 15:58:13Z, RepairCompleted 16:42:52Z with the closeout advisory, VerificationCompleted 17:15:27Z (pass), FinalReviewRequested 17:27:04Z at checkpoint refs/dotln/checkpoint/WO-243/12.",
    "git diff HEAD -- docs/product/07-execution-guide.md docs/KIT.md: the Preflight, integration and ladder passages and the kit guide's paragraph read as standing text linking WO-243-D003, D004, D005 and D007."
  ],
  "rejected": [
    {
      "option": "Take FUP-dcaad50cf7affa85's affected-line fallback or FUP-0560f7b8644b36f2's shared gate-input source as a source change in this review",
      "reason": "A source edit moves the code identity, owes a complete run of about 0 h 40 min and its own review ladder, and reaches the merge without independent verification; both are boarded with their reopening conditions for the order that takes them."
    },
    {
      "option": "Rebuild the base arm of the paired control a third time",
      "reason": "The executor and the verifier each built it from the unchanged base revision and recorded exit 1; a third build would spend minutes to reproduce a recorded result, while the candidate arm was run here on the final tree."
    },
    {
      "option": "Return the order to repair for a finding of this review",
      "reason": "This review reproduced no defect: every criterion holds, the standing documents hold the current state, and the implementation review found no behavior main had that the change breaks."
    }
  ],
  "reopenWhen": "A target-only order with readable inputs is told to run the complete launchpad run, a reader of the sections written here runs a check the selection does not name or misses one it does, or the next planning pass reads the three boarded rows as needing allocation."
}
```

## WO-243-D023 — Final review: the matched follow-up rows, six deferred again with their met condition

```json
{
  "id": "WO-243-D023",
  "date": "2026-11-07",
  "dispatch": "resume: final review; the follow-up register's rows touching this change",
  "decision": "npm run plan -- followups --touching --work-order WO-243 at register revision 6c63c34e29c5b096cfffb325501138f59c5d69a765fdccc571b343efb959450a listed 279 pending rows with 25 matched over four pages, all read. Six are deferred again with their met condition named, in one --apply batch (revision da42706c94c679739f8bcf6b768c0d0ed365ae9d052c6ddc75f5635ca8e5b09b after the write): the cold-start rows FUP-89b7b9f657765e83 (WO-253-D013), FUP-8dd0eb609946b9d1 (WO-249-D025), FUP-916e24773df0b734 (WO-238-D042), FUP-957602bc42e32e1d (WO-217-D053) and FUP-c61f76f60798e1b2 (WO-257-D007), because this order's closeout-selection sentences change the measured overrun and the reviewed rules again (D008 and the oracle: the executor 44,563 bytes against 29,246, accepted under WO-242-D009's 51,226; the reviewer 41,289 against 28,884; the verifier 38,715 against 29,831; the planner 30,780, release-close 28,638 and the router 17,124 unchanged); and FUP-eed385be08e5bdd9 (WO-226-D022), because this order re-mints the role oracle as wo243-role-baseline.json and edits scripts/test-gate-followups.mjs. The nineteen others are left as they are: this order's own three rows (FUP-d91a2e2780a65b70 from D008, FUP-0560f7b8644b36f2 from D013 and FUP-dcaad50cf7affa85 from D014), deferred by the executor on this tree with their conditions; rows whose condition names a surface this order did not edit (FUP-770baf2f452c669e, the planner root's entropy sentence; FUP-2fe2709d9b33c9e7, FUP-378c5638bf515e52 and FUP-e4fa2bbf7c3968ec, the target commit lint and target base; FUP-be6721fbdd4b6285, the hook's outside-write path; FUP-ac86ee429dee2947, whose condition is a planning allocation alone and whose planner bytes are unchanged); and rows whose condition is an event that did not occur (FUP-048618f9ee2eb349 and FUP-9a4929e4a041875f wait for a target-lifecycle order; FUP-17ea51254e5a7256 for a second gate failing on a sleep; FUP-912adb42a652b75f, whose guide edits here are judged by the document gate while the complete row's identity keys code; FUP-941fd291e0fd1033; FUP-b1397fa85cbeba51; FUP-c53447a63c6b1031; FUP-d0a9719cc2e4ec55; FUP-dfde4050da06d43b, whose sequence did not recur because the execution's one complete run started after its ladder had ended and the repair started none; FUP-fb8cbeabbddef397).",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-243: revision 6c63c34e29c5b096cfffb325501138f59c5d69a765fdccc571b343efb959450a, pending 279, matched 25, four pages read in full.",
    "npm run plan -- followups --apply docs/control/local/followup-request.json: six requests applied, all deferred, revision da42706c94c679739f8bcf6b768c0d0ed365ae9d052c6ddc75f5635ca8e5b09b; a first batch was refused whole on FUP-c61f76f60798e1b2's source revision (3, not 1) and wrote nothing.",
    "WO-243-D008 and packages/skeleton/fixtures/wo243-role-baseline.json: the cold-start bytes named above; scripts/test-gate-followups.mjs: the chain list now heads at wo243-role-baseline.json.",
    "docs/evidence/WO-243/handoff.md and docs/control/orders/WO-243.jsonl: the execution's complete run of 09:04:58Z followed its three review rounds, and the repair ran no complete run."
  ],
  "rejected": [
    {
      "option": "Settle any of the six rows here",
      "reason": "Each asks for a planning allocation or the next order on its surface; a final review records the met condition and cannot allocate."
    },
    {
      "option": "Dispose the nineteen textual matches",
      "reason": "A textual match is a pointer for judgment, not a condition; none of their conditions occurred on this order."
    }
  ],
  "reopenWhen": "A planning pass allocates the cold-start optimization or the oracle-pin check, or a later pass reads one of the nineteen left rows' conditions as met by this order."
}
```
