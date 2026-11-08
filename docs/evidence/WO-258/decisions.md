# WO-258 decisions

## WO-258-D001

```json
{
  "id": "WO-258-D001",
  "date": "2026-11-07",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.121.0, the next minor above the observed release baseline v0.120.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.120.1 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-258-an-instances-first-cycle-meets-the-kit.md"
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

## WO-258-D002

```json
{
  "id": "WO-258-D002",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Run this execution's review ladder on Codex astra workers (gpt-6-astra, max) through npm run worker -- review --host codex --model astra, on the operator's mid-dispatch message asking for GPT astra reviewers, in place of the default Claude dotln-worker.",
  "evidence": [
    "the operator's message during resume: next on 2026-11-07, read as a request for the astra worker option for this ladder's reviewers",
    "the executor skill: npm run worker -- review --kind criteria|design|consistency|combined --host codex|claude [--model opus|fable|sol|astra] renders the canonical brief and writes the report to the order's reviews lane"
  ],
  "rejected": [
    {
      "option": "Keep the default Claude dotln-worker",
      "reason": "The operator named the reviewer option in this session; the default stays for every other dispatch."
    },
    {
      "option": "Launch dotln-worker-astra through the Agent tool",
      "reason": "From a Claude session the other host's reviewer runs through the worker helper, which renders the brief and records the report."
    }
  ],
  "reopenWhen": "The worker helper refuses --model astra or the Codex host cannot be reached; the ladder then runs on the default worker and the refusal is recorded here."
}
```

## WO-258-D003

```json
{
  "id": "WO-258-D003",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Make host support an election with inference (steps 1 to 4): features.host-codex and features.host-copilot (off by default) and features.auto-update-upstream join the registry; an undeclared host row is on when the committed control log (the legacy resume.jsonl and every order segment under orders/, the two locations the control store reads) holds an attestation whose actor.harness names the host or the discovery record's effortReadbackProbe.harnesses.<harness>.versions holds an observed version; harnessInstallation emits Claude's profile always and another host's only when its row is on; a fresh export predicts its kit bundle with every other host off and an update predicts with the destination's own host rows (readHostFeatures), so the manifest-listed surfaces are exactly what each destination's own emit writes.",
  "evidence": [
    "scripts/lib/feature-registry.mjs, scripts/lib/features.mjs (hostRecord, readFeatures, readHostFeatures, freshHostFeatures, readFeatureInventory), scripts/lib/harness.mjs (hostSelected), scripts/launchpad.mjs (expectedHarnessBundle, prepareKit hosts, planKitUpdate)",
    "this repository: docs/control/resume.jsonl holds 12 codex-cli attestations and docs/control/orders/ 414; docs/discovery/environment.json observes codex-cli and copilot-cli; the inventory prints host-codex inferred from both logs and the discovery record and host-copilot inferred from the discovery record, and the emitted manifest names the same three profiles as at the base",
    "a Claude-only selection emits 31 files and nothing under .codex/ or .agents/ (probe over harnessInstallation); the 42-file bundle with Codex is unchanged from the base",
    "scripts/test-features.mjs host case; scripts/test-launchpad-export.mjs WO-258 criterion 1 case"
  ],
  "rejected": [
    {
      "option": "Read only docs/control/resume.jsonl, as the order's example source string spells it",
      "reason": "An instance's lifecycle writes one segment per order under orders/ and no legacy log, so a log-only reading would leave the private instance's Codex off; the order's axis is the committed record, which is both files."
    },
    {
      "option": "Print the attestation count in the generated FEATURES.md",
      "reason": "The page is a generated artifact the gate checks; a count would stale it at every Codex-run lifecycle event and fail the next phase's generated check. The source names the record's rows; npm run features -- list --json carries the counts in each host row's record field."
    },
    {
      "option": "Read the record eagerly in readFeatures",
      "reason": "The module's rule is that hot-path elections read no history; an undeclared host row is a lazy getter, so the desktop-control and plan-first readers never scan the log."
    },
    {
      "option": "A build overlay per host",
      "reason": "Rejected by the order: an overlay is the instance's equipment choice; a host is a feature row the inventory prints with its source."
    },
    {
      "option": "Add the host rows to dotln.config.example.json",
      "reason": "An instance that copies the example would elect false explicitly and turn off a host its record shows."
    }
  ],
  "reopenWhen": "An instance whose hosts are known only from unjournaled sessions reports a host its record does not show, or a host's surfaces change file locations (the hostSelected filter keys on the profile's harness name)."
}
```

## WO-258-D004

```json
{
  "id": "WO-258-D004",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Let emit remove a turned-off host's surfaces: the paths the previous manifest installed and the current selection does not are unlinked as before, and each .codex/ or .agents/ directory that removal emptied is removed up to the host's top directory; a directory holding other files (an operator's own Codex rules or personal skills) stays. A starter whose record shows no other host becomes Claude-only at its next refresh, and an instance whose record shows Codex restores its Codex surfaces with the re-emit its update already runs after the merge.",
  "evidence": [
    "scripts/lib/harness.mjs emitHarness (the obsolete loop and the emptied-directory removal)",
    "scripts/test-launchpad-export.mjs WO-258 criterion 1 case: electing false after true leaves neither .codex nor .agents and harness check passes",
    "../DotLn-Enterprise-Starter carries no docs/control/resume.jsonl and no docs/discovery/environment.json, so its own host rows read off"
  ],
  "rejected": [
    {
      "option": "Keep shipping every host's surfaces in the starter and remove them in a clone's emit",
      "reason": "A fresh clone would then hold files its own check calls unexpected until a commit removed them; the order's objective is a Claude-only bundle out of the box."
    }
  ],
  "reopenWhen": "A Codex-using instance's update merge conflicts in a generated surface its re-emit cannot repair, or an operator file under .codex/ is removed."
}
```

## WO-258-D005

```json
{
  "id": "WO-258-D005",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Admit an update under a journaled planning or entropy dispatch without --operator-request when features.auto-update-upstream is on; the admission row in the session journal names the election (election: features.auto-update-upstream) and the command prints it; no operator request is returned, so no receipt carries one; without the election the refusal is unchanged byte for byte.",
  "evidence": [
    "scripts/launchpad.mjs admitUpdate",
    "scripts/test-launchpad-update.mjs: the WO-257 finish fixture's elected arm and its unchanged refusal",
    "FUP-f191f04206f7ec8a (WO-257-D029)"
  ],
  "rejected": [
    {
      "option": "Name the election in the refusal's remedy",
      "reason": "Criterion 2 requires the refusal without the election to be unchanged; the kit guide names the election instead."
    }
  ],
  "reopenWhen": "An instance's pass takes an update the operator did not intend, or the election needs a narrower scope (one command form)."
}
```

## WO-258-D006

```json
{
  "id": "WO-258-D006",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Read the plan-first election in the hook through the lifecycle's own reader (readFeatures over loadConfig): a value the lifecycle refuses (\"on\", \"true\", 1) throws the lifecycle's message, and the write hook refuses with it as DOTLN_PLAN_FIRST_REFUSED: the plan-first election cannot be read: <message>; true and { on: true } elect; an absent configuration loads no reader.",
  "evidence": [
    "packages/skeleton/src/plan-first-boundary.ts planFirstElected; packages/skeleton/src/harness-host.ts planFirstWriteResponse",
    "scripts/test-harness.mjs WO-258 plan-first reader case",
    "FUP-2975f260666e8b04 (WO-242-D032)"
  ],
  "rejected": [
    {
      "option": "Keep the hook's own JSON reading",
      "reason": "It read a malformed value as off, so the hook and the lifecycle disagreed; one reader removes the disagreement."
    }
  ],
  "reopenWhen": "The hook's per-write cost rises measurably on an elected instance (the reader now loads the configuration module)."
}
```

## WO-258-D007

```json
{
  "id": "WO-258-D007",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Journal a resume: release close phrase typed in main while the checkout's status does not list release-close as pending (recorded: false, pending: records-not-in-checkout) with the release-close role resolved, and brief the session to update main or run the close; the first admission admits the exact helper under the pending dispatch; the close's prerequisites read the pending row from the session's own state (build-free, scripts/lib/dispatch-bound.mjs), fast-forward main even in a dry run, and after the fast-forward record the dispatch through the lifecycle's resume release-close --work-order WO-NNN, writing the session's releaseCloseDispatch that keys later admissions; a refused recording leaves the row pending. The lifecycle's and the publish helper's post-merge texts and the operator reference say to update main first.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts recordDispatch and releaseCloseAdmission; scripts/lib/dispatch-bound.mjs pendingReleaseClose and recordPendingReleaseClose; scripts/release.mjs closePrerequisites; scripts/resume.mjs and scripts/worktree.mjs handoff texts; docs/product/operator-reference.md",
    "scripts/test-harness.mjs WO-258 pending release-close case; scripts/test-release.sh release_case_pending_dispatch (bare origin holding the merged order, main checkout behind it)",
    "the private instance's item 1 as the 2026-11-07 pass records it (the instance is not readable here; the fixtures are the reproduction)"
  ],
  "rejected": [
    {
      "option": "Fetch origin in the prompt hook to judge legality",
      "reason": "Rejected by the order: a prompt hook reads and never reaches the network."
    },
    {
      "option": "Leave the dry run without a fast-forward",
      "reason": "The dry run could then never record the dispatch, since main lacks the records until it moves; with a pending dispatch the operator asked for the close, and the fast-forward is the update the operator texts ask for first."
    },
    {
      "option": "Admit the pending helper only after the canonical legality check",
      "reason": "The checkout cannot show legality before the fast-forward; the helper itself judges the order at origin's main before any effect."
    }
  ],
  "reopenWhen": "A pending row is recorded for a different order than the one the operator meant, or a dry run's fast-forward is unwanted in some instance."
}
```

## WO-258-D008

```json
{
  "id": "WO-258-D008",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Within the Boy Scout bound (FUP-589642d0e0c714c8, WO-226-D021): a hidden spelling (pipe, redirect or prefix) of the dispatched order's release-close helper is told Release-close admission withheld: byte-exact helper spelling missing (<class>) with both exact spellings, <helper> --publish OR <helper> --dry-run; the registered-target near-miss text stays for every other hidden helper.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts registeredTargetNearMiss",
    "scripts/test-harness.mjs WO-258 pending release-close case (pipe and redirect rows) and the unchanged WO-226 near-miss case"
  ],
  "rejected": [
    {
      "option": "Run releaseCloseAdmission before the near-miss branch",
      "reason": "A prefixed spelling does not start with the helper's quoted prefix, so the admission would not see it; the near-miss already parses all three forms."
    }
  ],
  "reopenWhen": "A session told both spellings still runs another, or the near-miss order in the permission hook changes."
}
```

## WO-258-D009

```json
{
  "id": "WO-258-D009",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Declare the Git floor once as package.json engines.git >=2.40.0 and judge it where Node is: the host task, harness check and harness evidence refuse a Git below it naming the floor and the version read; bootstrap and emit are unaffected. The floor is Git's own: the v2.40 release notes say git check-attr learned to take an optional tree-ish (the --source form the gate's classification runs) and the 2.32 notes introduce GIT_CONFIG_GLOBAL, which the publication fixtures use.",
  "evidence": [
    "https://raw.githubusercontent.com/git/git/master/Documentation/RelNotes/2.40.0.adoc and 2.32.0.adoc, read 2026-11-07",
    "scripts/lib/node-engines.mjs declaredGitFloor, readGitVersion, judgeGitRuntime, judgeRunningGit; scripts/structural-checks.mjs checkHost; scripts/harness.mjs requireDeclaredNode",
    "measured on this host (Git 2.55.0, Node v26.9.0): the host task's checkHost in process, five samples, 51/46.5/45.7/44.8/44.4 ms (median 45.7) before and 55.2/50.5/51.2/49.3/49.7 ms (median 50.5) after; one git --version spawn, ten samples, median 6.4 ms; node scripts/structural-checks.mjs host under the bounded wrapper 391 to 402 ms before and 382 to 394 ms after",
    "scripts/test-runner.test.mjs Git floor case; criterion 5's shim runs in docs/evidence/WO-258/criterion-5-git-floor.txt"
  ],
  "rejected": [
    {
      "option": "Emulate check-attr --source on old Git with a temporary checkout",
      "reason": "Rejected by the order: one refusal naming the floor is cheaper than three emulations."
    }
  ],
  "reopenWhen": "A supported host ships a Git below 2.40.0 that the operator needs, or a script begins to use a Git feature newer than the floor."
}
```

## WO-258-D010

```json
{
  "id": "WO-258-D010",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Name git's exit code and stderr in the classification failure (Generated source classification unavailable: git check-attr exited <code>: <stderr>) and class the close's stop by that cause in a new close-blocker class, host-runtime; the close's recorded reason adds the Git floor judgment, naming the floor and the version read.",
  "evidence": [
    "packages/skeleton/src/gate-evidence.mjs; scripts/lib/release-steps.mjs CLOSE_BLOCKER_CLASSES; scripts/release.mjs close catch",
    "scripts/test-release.sh release_case_git_floor: a shim Git that refuses --source and reads 2.31.0 stops the dry run with class host-runtime, exit 129 and git's words"
  ],
  "rejected": [
    {
      "option": "Class the stop as other",
      "reason": "The class list exists so a stopped close names its cause; an old Git is the host's runtime, not the close's fault."
    }
  ],
  "reopenWhen": "Another host tool (Node, gh) needs its own class, or check-attr fails for a reason other than the host's Git."
}
```

## WO-258-D011

```json
{
  "id": "WO-258-D011",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Correct the first-order template (step 10): criterion 3 records the printed status and a match, where one occurred, fixed before filing; checklist item 4 says an empty list is present with no terms and refuses nothing and checks the three files the order writes; the timebox sentence is replaced by the order running the review ladder every order runs.",
  "evidence": [
    "scripts/kit/first-order.template.md; scripts/lib/terms.mjs checkLocalTerms returns present with zero terms for an empty list",
    "scripts/test-launchpad-seeds.mjs WO-258 criterion 6 seed case"
  ],
  "rejected": [
    {
      "option": "Keep the 45-minute timebox",
      "reason": "Every order runs the review ladder and the complete gate; a timebox the process cannot keep invites skipping them."
    }
  ],
  "reopenWhen": "An instance's WO-001 finds a fourth wrong instruction in the template."
}
```

## WO-258-D012

```json
{
  "id": "WO-258-D012",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Let the starter refresh add what the export writes and remove what the kit retired (step 11): exportSeedPaths in scripts/launchpad.mjs is the one seed list (prepareKit refuses an export whose seeds differ; UPSTREAM.md lists it); planSeedChanges adds every export seed the starter lacks other than the eight template seeds (whose own rules keep or refuse a missing copy), at the export's bytes, with the lineage index rendered from the starter's own ledger by the kit's generator, never overwriting a present one; it removes docs/control/doc-ceilings.json when its bytes equal the one rendering the kit wrote (json({ schemaVersion: 1, documents: {} }), seeded from cbd0b4b6 until 4a09509b) and keeps a customized one with its reason in keptSeeds; the summary line names seeds added: and seeds removed:; closeout-scope no longer names the ceilings file.",
  "evidence": [
    "scripts/lib/starter-seeds.mjs (RETIRED_SEEDS, TEMPLATE_SEED_PATHS, planSeedChanges); scripts/lib/starter-refresh.mjs; scripts/release.mjs summary line; scripts/lib/closeout-scope.mjs gateInputs",
    "../DotLn-Enterprise-Starter at v0.120.1 tracks neither dotln.config.json nor docs/lineage/README.md and carries docs/control/doc-ceilings.json at that rendering",
    "scripts/test-launchpad-seeds.mjs WO-258 refresh planning case"
  ],
  "rejected": [
    {
      "option": "A kit action that deletes a file",
      "reason": "Rejected by the order: actions are opt-in and run by the instance; a retired seed is the refresh's to remove when unmodified."
    },
    {
      "option": "Add the absent template seeds too",
      "reason": "The template seeds' missing-copy rule is the operator's documented choice (a missing README is kept); this order adds only the seeds that had no rule."
    }
  ],
  "reopenWhen": "A refresh adds a seed an instance had removed on purpose, or the kit retires another seed (add its renderings to RETIRED_SEEDS)."
}
```

## WO-258-D013

```json
{
  "id": "WO-258-D013",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Raise limits.coldStartBytes.router here and in the kit's budgets template to the generated router root's measured 17,124 bytes (CLAUDE.md 7,380 plus the router skill 9,744) plus one 4,096-byte step, 21,220, under product 07's standing route of 2026-09-17, and record dated acceptances for the router and for the verifier (38,715 to 42,811), reviewer (41,289 to 45,385), release-close (28,638 to 32,734) and planner (30,780 to 34,876) roots that FUP-c61f76f60798e1b2 names, so this repository and a fresh export print no cold-start breach; the byte-reduction row stays deferred with that follow-up.",
  "evidence": [
    "measureColdStarts over this checkout on 2026-11-07 before the change: router 17,124 against 16,384, verifier 38,715, reviewer 41,289, release-close 28,638, planner 30,780 against their effective acceptances",
    "docs/control/budgets.json acceptances; scripts/kit/budgets.template.json"
  ],
  "rejected": [
    {
      "option": "Trim the router skill or the floor",
      "reason": "The standing route forbids trimming reviewed rules around a ceiling."
    },
    {
      "option": "Leave the breaches advisory",
      "reason": "The standing route forbids leaving a breach advisory across orders."
    }
  ],
  "reopenWhen": "Another reviewed rule raises a root past its acceptance, or a byte-reduction order lands (then lower the ceilings it frees)."
}
```

## WO-258-D014

```json
{
  "id": "WO-258-D014",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Bind the seeded documents a fresh instance's first pass red-tagged (step 12): the front page links docs/README.md as its map, and the map links the kit guide and the README of every root the export seeds; the work-order index (generated at activation) and ignored intake stay named in code spans because no README exists there yet. The starter's own docs/README.md, written by an older export, is a present seed the refresh never overwrites, so its root READMEs stay unbound until the instance rewrites it; that gap is boarded.",
  "evidence": [
    "scripts/kit/README.client.md; scripts/launchpad.mjs docs/README.md writer (mapLink)",
    "scripts/test-launchpad-export.mjs: the map links every seeded root README and each link resolves; ../DotLn-Enterprise-Starter/docs/README.md is the pre-v0.82 rendering with code spans"
  ],
  "rejected": [
    {
      "option": "Rewrite a present docs/README.md in the refresh",
      "reason": "The order's step 11 says the refresh never overwrites a present seed; proving an older inline rendering unmodified needs a rule of its own."
    }
  ],
  "reopenWhen": "The next order that edits the starter refresh's seed rules, or an instance reports the unbound root READMEs from a refreshed starter.",
  "followup": "The next order that edits the starter refresh's seed rules: rewrite a starter's docs/README.md that is still a rendering an older export wrote (prove it against the starter's first-export commit), so a clone's first pass binds the root READMEs too."
}
```

## WO-258-D015

```json
{
  "id": "WO-258-D015",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Admit a sequence with no order (step 14): buildPlanSubject accepts 0 to 100 orders; plan check, the plan cost subject and the receipt path run over an empty order list, and the direct refutation's prompt adds emptySequence naming the empty sequence as its subject; the goal-review protocol already validates an empty orders array, so no feedback source changes.",
  "evidence": [
    "scripts/lib/plan-subject.mjs; scripts/lib/plan-direct.mjs beginDirectRefutation",
    "scripts/test-plan-refutation.mjs WO-258 criterion 8 case: a pass lets the only closed order leave, files the empty receipt and plan check passes with two passes",
    "packages/skeleton/src/plan-refutation-protocol.ts validateGoalReview checks one result per subject order and holds against subject orders only (unchanged)"
  ],
  "rejected": [
    {
      "option": "Keep the last closed order in the sequence until another is filed",
      "reason": "Rejected by the order: a closed order is not proposed work, and the generated index keeps it."
    }
  ],
  "reopenWhen": "A pass over an empty horizon needs a judgment the goal review cannot give (then the protocol, a feedback source, changes under its own order)."
}
```

## WO-258-D016

```json
{
  "id": "WO-258-D016",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Build the current subject the continuation compares under the judged receipt's rule (step 15): plan check builds it with separateTrack only when the latest planning receipt carries the key, as the receipt rebuild already does, so a separate-track member filed after a sequence-only receipt waits for the next receipt; a receipt that judged the members still refuses a member added after it.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs checkPlanGate (the rule passed to both subject builds)",
    "scripts/test-plan-refutation.mjs WO-258 step 15 case (both arms)",
    "scripts/test-instance-history.mjs separateTrackCase over the committed instance-with-history bundle, whose receipt carries no separateTrack key; docs/evidence/WO-258/criterion-9-controls.json holds the base arm (plan-receipts.mjs at d9798e38) and the fixed arm with both exit codes",
    "the fork's item 2.2 as the 2026-11-07 pass records it"
  ],
  "rejected": [
    {
      "option": "Admit the members' order inputs as absent from the judged set",
      "reason": "Rejected by the order: a member filed after the receipt is judged by the next receipt, not admitted into the old one."
    },
    {
      "option": "Rebuild the current subject inside checkPlanContinuation",
      "reason": "The caller already builds it; building it once under the judged rule avoids a second subject build per check."
    }
  ],
  "reopenWhen": "A receipt filed with separateTrack and a later rule change need a third rule, or a separate-track member must be judged before the next receipt."
}
```

## WO-258-D017

```json
{
  "id": "WO-258-D017",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Let siblings index and index --check exit 0 without a declaration, printing no sibling declaration at docs/siblings/siblings.json; nothing to index (the check prefixed PASS); a registry page left without its declaration still refuses the check, naming both paths.",
  "evidence": [
    "scripts/siblings.mjs writeRegistry",
    "scripts/test-siblings.mjs absent-declaration rows",
    "the fork's item 2.3"
  ],
  "rejected": [
    {
      "option": "Refuse the generation as before",
      "reason": "The release's Read before upgrading names the command for every instance, and an instance declares no siblings."
    }
  ],
  "reopenWhen": "An instance needs a registry page without a declaration."
}
```

## WO-258-D018

```json
{
  "id": "WO-258-D018",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Add plan check --timing (FUP-fb8cbeabbddef397): checkPlanGate measures its steps when asked and the CLI adds the follow-up sync; no optimization is claimed. This repository's reading on 2026-11-07: followups 1,003 ms, documents 195 ms, receipts 5,708 ms (reading and rebuilding every receipt's subject), subject builds 75 ms, continuation 1 ms.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs checkPlanGate timing option; scripts/refute-plan.mjs check --timing",
    "npm run plan -- check --timing at this worktree on 2026-11-07"
  ],
  "rejected": [
    {
      "option": "Optimize the receipt rebuild here",
      "reason": "The carry-in asks only for the measurement; the reading names where the next pass should look."
    }
  ],
  "reopenWhen": "The next planning pass reads the timings and files a reduction, or the plan-check median falls back under its condition."
}
```

## WO-258-D019

```json
{
  "id": "WO-258-D019",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Within the Boy Scout bound (FUP-c4c7ba9f126d2e4a, WO-232-D017): add the permanent plan-refutation case that refuses each of the three guards' inputs of withoutAddedWorkstream (a filed order that declared a field, two added fields, a field after the leading header), named so WO-232's reproduction selects it; verification-004-guards.mjs now exits 0, each mutant failing one case.",
  "evidence": [
    "scripts/test-plan-refutation.mjs case: a field-only Workstream amendment admits only a field the filed order lacked, one field, in the leading header",
    "node docs/evidence/WO-232/verification-004-guards.mjs on 2026-11-07: subject 10 pass; each mutant 9 pass, 1 fail; unprotected []"
  ],
  "rejected": [
    {
      "option": "Leave it boarded because step 15 did not edit plan-continuation.mjs",
      "reason": "The pass allocated it here; the case costs one test and closes the follow-up's reopen condition."
    }
  ],
  "reopenWhen": "A guard is changed or removed, or the reproduction finds a mutant no case refuses."
}
```

## WO-258-D020

```json
{
  "id": "WO-258-D020",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Update the expected data this order's behavior changes, each from the requirement: the export test's residue-profile assertion now compares the block's profiles with the manifest's (Claude only in a fresh export) and no longer lists .agents or .codex surfaces as kit files; the front-page test asserts the map link and the seeded map's links; the siblings test asserts the absent-declaration exit 0; the update test's instance-owned list drops the ceilings file; test-sync's synthetic siblings error row uses the message the check still prints.",
  "evidence": [
    "scripts/test-launchpad-export.mjs, scripts/test-siblings.mjs, scripts/test-launchpad-update.mjs, scripts/test-sync.mjs",
    "the causes: D003, D014, D017 and D012 of this record"
  ],
  "rejected": [
    {
      "option": "Keep the old pins",
      "reason": "They pinned the behavior this order changes on purpose."
    }
  ],
  "reopenWhen": "A pin removed here proves to have guarded a behavior the order did not mean to change."
}
```

## WO-258-D021

```json
{
  "id": "WO-258-D021",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Take the private instance's items 1, 2, 7 and 8 and the fork's items 2.2 and 2.3 as reported: the instance is not readable from this repository, so each fixture of this order is its reproduction; criterion 5's Git 2.31 behavior is reproduced by a shim Git that refuses check-attr --source and reads 2.31.0, not by an installed Git 2.31.",
  "evidence": [
    "docs/planning/passes/first-cycle-returns-and-host-elections-2026-11-07.md §Readings",
    "this host's Git is 2.55.0"
  ],
  "rejected": [
    {
      "option": "Install Git 2.31 for the reproduction",
      "reason": "Outside the order's authority (no package installation) and not needed: the shim produces the refusal the classification meets."
    }
  ],
  "reopenWhen": "The instance reports a behavior a fixture here does not reproduce."
}
```

## WO-258-D022

```json
{
  "id": "WO-258-D022",
  "date": "2026-11-07",
  "dispatch": "resume: next; release prepare",
  "decision": "Bump @dotln/skeleton from 0.87.1 to 0.88.0 (minor: the hook gains the pending release-close dispatch and reads the plan-first election through the lifecycle's reader, and the gate's classification failure names its cause) with console's exact pin and the lockfile's two entries; keep the Git floor out of package-lock.json's root engines, since the lockfile is a feedback evidence source and an engines line there is not a release label the feedback edition can carry; no other component's source changed.",
  "evidence": [
    "npm run sync on 2026-11-07: release-surfaces FAIL component-version @dotln/skeleton: src changed; observed 0.87.1; and feedback-evidence refused while the lockfile root carried engines.git (judged behavior changed since docs/evidence/WO-242/feedback-002 (.feedback-source/package-lock.json))",
    "after the bump and the lockfile restored: every artifact current, feedback-evidence current (only component release labels moved, as WO-243's 0.87.0 to 0.87.1 did)",
    "scripts/launchpad.mjs kitLockfile copies the kit package's engines, so an exported lockfile names the floor"
  ],
  "rejected": [
    {
      "option": "Declare engines.git in the lockfile root too",
      "reason": "It would owe a live feedback episode for no behavior; npm reads engines from package.json."
    },
    {
      "option": "A patch bump",
      "reason": "The hook's and the gate's observable behavior grows; the compatibility impact is a minor one."
    }
  ],
  "reopenWhen": "The release surfaces judge another component changed, or a lockfile engines mismatch matters to an install."
}
```

## WO-258-D023

```json
{
  "id": "WO-258-D023",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Derive a Read before upgrading notice when a feature election's row or reader changes (scripts/lib/feature-registry.mjs or scripts/lib/features.mjs): after the update, render the features page with npm run features -- render, re-emit with node scripts/harness.mjs emit and start a new session, since an election can change the surfaces the emit writes and the host reads when a session starts (criterion 11). This release's diff changes both files, and the emitted settings file does not change, so the settings notice alone would name neither the re-emit nor the session.",
  "evidence": [
    "scripts/release.mjs criticalNotes; scripts/test-release-preparation.mjs WO-257 derived-notices case extended",
    "git diff of .claude/: hooks and the harness manifest change, .claude/settings.json does not"
  ],
  "rejected": [
    {
      "option": "Leave the lines to the reviewer-authored release notes",
      "reason": "The derived section is the part every instance's update reads mechanically; a registry change always owes these steps."
    }
  ],
  "reopenWhen": "An election row changes that cannot change an emit (then narrow the trigger to the rows read by scripts/lib/harness.mjs)."
}
```

## WO-258-D024

```json
{
  "id": "WO-258-D024",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Adjacent repair found by the focused launchpad gate: harness-context's installed-read resolver checks the Codex and Copilot skills root only where it is installed. A Claude-only export's floor reads @skills, which resolves under .claude/skills; the .agents/skills root exists only for an elected or inferred host, and a generated file missing there is the harness check's drift.",
  "evidence": [
    "npm test -- --only launchpad on 2026-11-07: the export's harness-context --check reported Unresolved required file: .agents/skills/dotln-<role>/SKILL.md for five roles",
    "scripts/harness-context.mjs unresolvedInstalledReads"
  ],
  "rejected": [
    {
      "option": "Keep emitting the .agents skills for Claude-only instances",
      "reason": "That would undo the host election for the files a Claude session never reads."
    }
  ],
  "reopenWhen": "A host other than Codex or Copilot reads its own skills root."
}
```

## WO-258-D025

```json
{
  "id": "WO-258-D025",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Lead the gate with the host task for a Git below package.json engines.git, as for a Node outside engines.node, so the old-Git refusal names the floor first and no other task runs on that Git (one more git --version spawn per gate start).",
  "evidence": [
    "criterion 5's shim run on 2026-11-07: before the change the generated preflight failed first through harness check and host was skipped; after it, FAIL host names Git 2.31.0 and the floor and every other task is skipped naming it (docs/evidence/WO-258/criterion-5-git-floor.txt)",
    "scripts/test-runner.mjs outsideRange"
  ],
  "rejected": [
    {
      "option": "Leave the generated preflight to name the floor",
      "reason": "The kit guide's rule is that the host task runs first and nothing else runs on an unsupported runtime; Git is part of that runtime now."
    }
  ],
  "reopenWhen": "The gate's start cost matters enough to share one runtime probe between Node and Git."
}
```

## WO-258-D026

```json
{
  "id": "WO-258-D026",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Round-1 review repairs that change behavior or expected data, each from the requirement: the export's seed list moves to scripts/lib/starter-seeds.mjs (exportSeedPaths, exportConfiguration), which the release fixture carries, and launchpad.mjs re-exports it and still refuses a divergent export; a refresh that adds dotln.config.json names the README it rewrites as that configuration does, so the next refresh is current; added seed destinations are judged before any write (each existing ancestor a real directory, the leaf absent, files created exclusively); a pending dispatch the lifecycle refuses stops the close and keeps the pending row; recording rebinds the dispatch-bound anchor to the merged order from its original start. Expected data: the front-page seed's SHA-256 pin is the new seed's (its change rewrites each unedited starter README once, which this order's release notes name); the launchpad and release case inventories add the three and two new cases; the update suite's identity case now expects an absent configuration to be added with the export's bytes; the release fixture's current starter carries every export seed so its refresh stays current; the role-oracle follow-up test accepts a router ceiling raised since its newest oracle when a dated acceptance records the measured bytes plus 4,096; the hook and process-debt fixtures' records observe Codex and Copilot so their emit installs the complete bundle their cases read.",
  "evidence": [
    "docs/control/local/reviews/WO-258/round-1-design.md F1, F2; round-1-criteria.md F1 to F4; round-1-consistency.md F1 to F7",
    "the focused launchpad, harness and release runs of 2026-11-07"
  ],
  "rejected": [
    {
      "option": "Import launchpad.mjs only on the refresh's write path",
      "reason": "The dry run needs the seed list too, to name the seeds it would add."
    },
    {
      "option": "Keep the starter's default name when adding its configuration",
      "reason": "The README and the configuration would disagree until the next refresh rewrote the README."
    }
  ],
  "reopenWhen": "A later review finds a consumer of these contracts the traced inventory missed."
}
```

## WO-258-D027

```json
{
  "id": "WO-258-D027",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Round 2's criteria F1 (criterion 4): a resume: release close typed in main whose status still selects an earlier closed order records that order's dispatch, as before, and also keeps the phrase pending (reason records-may-not-be-in-checkout), with the briefing saying to update main first or run the merged order's helper. The first admission admits the exact helper of another order under that pending phrase, and the close records the merged order's dispatch after its fast-forward only when the session's recorded dispatch names another order (an up-to-date main's dry run stays a fetch). The rebound dispatch-bound anchor and the external-sentinel refusal named in round 2's rechecks are covered by cases.",
  "evidence": [
    "docs/control/local/reviews/WO-258/round-2-criteria.md F1 and its F3/F4 recheck notes",
    "scripts/test-harness.mjs WO-258 earlier-closed-order case; scripts/test-release.sh release_case_pending_dispatch with the state the hook writes in that situation; scripts/test-launchpad-update.mjs intake-link refusal with its sentinel unchanged"
  ],
  "rejected": [
    {
      "option": "Judge in the hook whether the selected closed order was already released",
      "reason": "The hook reads and never reaches the network; a local release record is not the merged order's."
    },
    {
      "option": "Record nothing when the selected order is closed",
      "reason": "Main up to date with its own closed order is the ordinary route and keeps its recorded dispatch."
    }
  ],
  "reopenWhen": "A pending phrase admits a helper the operator did not mean, or main selects an order whose close is still owed while another merged after it."
}
```

## WO-258-D028

```json
{
  "id": "WO-258-D028",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "Round 3's combined F1 and the WO-178 regression it names: a recorded release-close dispatch keeps the hook's first admission to its own order, as WO-178 requires; a pending phrase grants first admission only while no dispatch is recorded. Beside a recorded dispatch, another order's exact helper goes to host permissions with an advisory saying that, if it is the order the operator merged, its close records that dispatch from the pending phrase after its fast-forward. This supersedes D027's admission clause and keeps its recording. The publishing close of the order the recorded dispatch names consumes the phrase kept pending beside it when the close completes (consumePendingReleaseClose; a PendingReleaseCloseConsumed journal row; dispatch.pending.consumed in the close record), and a dry run leaves it, so no later helper in the session records another order's dispatch without a new phrase. Round 3's F2 (criterion 11): the document check refuses a record named in the kit-first-steps entry point ('an entry point names standing documents only, so cite the record from a standing section a reader reaches by link'), so each First steps write-back links by anchor to the standing section that cites its decision: the Git floor to What runs here (D009), step 1's lineage sentence to Kit files and instance files (D012), and step 4's WO-001 sentence to that section's pre-drafted WO-001 sentence, which now cites D011. Expected-data update: the WO-178 case's pipe and redirect rows now expect the dispatched order's 'shell operator or redirect' class and both spellings. Cause: D008's near-miss carry-in. Provenance: WO-226-D021 names that text as the base's. The rows were masked while the case's earlier WO-998 assertion failed first.",
  "evidence": [
    "docs/control/local/reviews/WO-258/round-3-combined.md F1 and F2",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern 'WO-178|WO-226 helper shell syntax|WO-258' scripts/test-harness.mjs: pass 11, fail 0",
    "node scripts/harness.mjs bounded -- bash scripts/test-release.sh --case pending_dispatch: passed, the matching dry run keeping the pending phrase and the matching --publish consuming it",
    "node scripts/docs-check.mjs: PASS, 0 failures"
  ],
  "rejected": [
    {
      "option": "Keep admitting another order's helper under the pending phrase beside a recorded dispatch",
      "reason": "The hook cannot tell the merged order from another without the network, so it would admit any order's helper; WO-178's case requires a recorded dispatch to withhold a different order's."
    },
    {
      "option": "Consume the pending phrase when a matching close starts, dry runs included",
      "reason": "A dry run of the recorded order would then drop the phrase that lets the merged order's helper record its dispatch if the operator ran the wrong order first."
    },
    {
      "option": "Name the decision records inside First steps",
      "reason": "The document check refuses a record in an entry point; the anchors reach the standing sections that cite them."
    }
  ],
  "reopenWhen": "The operator's first helper after a release-close phrase in a main behind origin is repeatedly put to host permissions, or a local fact (a fetched origin/main) can show which order merged; or the entry-point rule admits decision links."
}
```

## WO-258-D029

```json
{
  "id": "WO-258-D029",
  "date": "2026-11-07",
  "dispatch": "resume: next",
  "decision": "The first complete npm test -- --review (2026-11-07T23:10:22Z, 28 passed, 17 failed) failed on one timeout: sync-fixtures' case 'the real inventory checks stale artifacts, regenerates safe outputs, refuses manual changes and is byte-stable' hit its 240 s timeout (testTimeoutFailure; no assertion failed), and the sixteen suites queued behind it (36 task rows) did not start. Diagnosis: the case's work outgrew its bound, and this order did not cause it. Alone on this branch it measured 271 s and 286 s; the phases are three full syncs of 42, 62 and 42 s, the structural check twice (28 s and 29 s), nine single-artifact syncs (65 s together) and the damaged-artifact checks (15 s), with no step anomalous. A full sync pass of a fresh edition copy took 41,581 ms at the base d9798e38a and 39,919 ms on this branch; each command's base and branch times differ by at most 10.7 percent (work-orders index, 3,800 against 3,433 ms), except check-surfaces, whose base run exited early on component versions (4,427 against 5,666 ms). The timer fires only at the case's few asynchronous gaps (the structural gate run and the authority mint), which fall before 240 s on an idle exclusive schedule (alone, the case passed at 271 s). In the gate the suite started as the operator's game launched on the host (ps: started between 23:01 and 23:02 UTC): the suite's small cases ran 3.05 to 3.60 times slower than when timed alone, and the gap fell after 240 s. Repair: raise the case's timeout to 600 s, 2.1 times the 286 s alone measurement; each artifact command keeps its own deadline and the suite stays exclusive. The repair is one changed source line, so it takes round three alone; that combined round reads the change since round 3's tree, which also carries D028's resolution of round 3's findings.",
  "evidence": [
    "scratchpad gate log: FAIL sync-fixtures 0 h 7 min; not ok 10 ... failureType testTimeoutFailure, error 'test timed out after 240000ms'; npm test: 28 passed; 17 failed",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern 'the real inventory checks stale artifacts' scripts/test-sync.mjs: ok, duration_ms 270596",
    "instrumented replay of the case's work: total 286204 ms (before sync 42582, single syncs 56519, damage checks 15270, checkGenerated 27970, runGate 28995, regenerated sync 62251, second sync 41706)",
    "per-command sync profile of an edition copy: base clone at d9798e38a pass 41581 ms; this branch pass 39919 ms",
    "small sync cases alone: 653, 8807 and 3298 ms against 2151, 31675 and 10066 ms in the gate; ps at 18:16 local (UTC-5) showed the game process 14 min 45 s old",
    "docs/control/local/reviews/WO-258/repair-1/round-4-combined.md: found 0; combined.3.F1 and combined.3.F2 held",
    "scripts/lib/gate-scheduling-baseline.json records the whole sync-fixtures suite at 161760 ms"
  ],
  "rejected": [
    {
      "option": "Rerun the complete gate unchanged",
      "reason": "The case passes only while its asynchronous gaps fall before 240 s; alone, the authority mint's gap fell at 233 s (computed from the replay's command durations), so a rerun would depend on host load rather than on the change."
    },
    {
      "option": "Stub formatting in the case's full syncs or split the case",
      "reason": "The case states that the complete inventory runs validate formatting; restructuring it is a planning matter, not this order's repair."
    }
  ],
  "reopenWhen": "The case measures above 400 s alone, or a timeout recurs under the exclusive schedule; then split the case or reduce its repeated full syncs."
}
```

## WO-258-D030

```json
{
  "id": "WO-258-D030",
  "date": "2026-11-08",
  "dispatch": "resume: next",
  "decision": "The second complete npm test -- --review (2026-11-08T00:12:08Z, 29 passed, 16 failed) passed sync-fixtures in 0 h 5 min under D029's bound and failed process-debt on three cases this order caused; the first run had hidden them because process-debt never started there. First, scripts/test-helper-reuse.mjs refused scripts/lib/node-engines.mjs, which spawned git --version directly: readGitVersion now runs it through spawnGit from scripts/lib/git.mjs, the library every Git spawn uses. Second, two WO-131 prompt-submission receipts gained 'DotLn: harness 2.1.319 leaves observed lines none; run npm run discover -- harness.' The discovery record this order added to the shared process-debt fixture, so its emit installs every host's surfaces, names no Claude Code line, and the hook advises on a session line its record does not show. The record now lives in a recordEveryHost helper that only the one case reading emitted .agents surfaces calls (evidence preparation). Run without the record, the file failed that case alone (ENOENT .agents/skills/dotln-executor/SKILL.md), and the shared fixture is again main's. The repair changes two source lines, so it takes round three alone, reading the change since round 4's tree.",
  "evidence": [
    "scratchpad gate log 2: FAIL process-debt 0 h 2 min; not ok 9 (test-helper-reuse: node-engines.mjs spawns git directly), not ok 159 and 160 (WO-131 receipts with the version advisory); PASS sync-fixtures 0 h 5 min; npm test: 29 passed; 16 failed",
    "WO258_NO_HOST_RECORD=1 replay of scripts/test-process-debt.mjs without the record: pass 182, fail 1 (evidence preparation, ENOENT .agents/skills/dotln-executor/SKILL.md)",
    "node scripts/harness.mjs bounded -- node --test scripts/test-process-debt.mjs after the repair: pass 183, fail 0; the helper-reuse case passes; node scripts/structural-checks.mjs declarations exits 0; the Git floor cases in scripts/test-runner.test.mjs and scripts/test-release.sh git_floor pass"
  ],
  "rejected": [
    {
      "option": "Elect the hosts in the shared fixture's dotln.config.json",
      "reason": "A present configuration makes the hook's plan-first reader require the fixture's own scripts/lib/features.mjs, which the shared fixture does not carry."
    },
    {
      "option": "Add the running Claude Code line to the shared record",
      "reason": "The line comes from the host's installed Claude Code, so the receipts would depend on the machine; the record belongs only where a case needs the surfaces."
    }
  ],
  "reopenWhen": "Another process-debt case needs every host's surfaces (it calls recordEveryHost), or a receipt case starts writing a discovery record."
}
```

## WO-258-D031

```json
{
  "id": "WO-258-D031",
  "date": "2026-11-08",
  "dispatch": "resume: next",
  "decision": "The third complete npm test -- --review (2026-11-08T01:15:14Z, 38 passed, 7 failed) failed instance-history, launchpad-planning and skeleton, and the suites queued behind them did not start. Each failure traces to this order. (1) instance-history: after the kit update into an instance whose record shows no other host, docs-check read the tracked .agents/skills/*/SKILL.md that the role-read-lines entry point's glob matched although the update had removed them. entryPointFiles now applies to glob matches the existence check its literal branch and documentFiles apply. harness-context then judged .agents/skills because the update left the emptied host directories behind, so applyKitUpdate now removes each directory a removed host file leaves empty, as emitHarness does and the kit guide's Features section states. (2) skeleton: a registered target's synthetic launchpad carries dotln.config.json but no lifecycle, and D006's reader required its scripts/lib/features.mjs, refusing the target write. planFirstElected keeps the direct read the hook made before for a root without the lifecycle's feature reader. (3) launchpad-planning: a Codex session's granted scratch roots come from the Codex profile, which a fresh export no longer installs (D003), so the fixture elects host-codex and re-emits. The v0.81.0 case pinned step 1's old sentence and a refreshed starter's fork lacking the lineage index, which the refresh now adds (D012). That is an expected-data update to the new sentence and the indexed fork, with no empty setup commit. The same case's clone of the fork's bare origin failed once in three runs with 'trying to write ref refs/remotes/origin/main with nonexistent object'. The inference is a detached gc --auto, started by a push into a bare origin holding the export's thousands of loose objects, racing the clone; the evidence is that the ref then resolved to a present commit with no alternates. The two bare origins now run no automatic gc. A complete run stops at its first failed suites, so each run found the next failure, and before this run I had run only the suites whose tests I had changed. Before the next complete run, every suite the three runs had not reached ran on its own and passed. The repair changes 52 lines in three source files (44 added, 8 removed), 39 of them code once comments are excluded, as product 07's ladder treats comment-only fixes. That is under fifty, so it takes round three alone, reading the change since round 5's tree, and the next complete run uses --keep-going so any failure is found in one pass.",
  "evidence": [
    "scratchpad gate log 3: FAIL instance-history (docs-check: .agents/skills/dotln-executor/SKILL.md ENOENT), FAIL launchpad-planning (followups apply in a Codex session; the first step's sentence), FAIL skeleton #336 (DOTLN_PLAN_FIRST_REFUSED: Cannot find module .../scripts/lib/features.mjs); npm test: 38 passed; 7 failed",
    "after the repair, node scripts/harness.mjs bounded -- node --test on each file: test-instance-history.mjs pass 1; test-launchpad-planning.mjs pass 5; test-docs-check.mjs pass 76; test-harness.mjs plan-first cases pass 11; source-change-host.test.js pass 105; test-launchpad-update.mjs pass 19; test-launchpad-export.mjs pass 33; test-target-worktree-close.mjs pass 59; test-target-worktree-release.mjs pass 10; test-vertical-judgment.mjs pass 43; test-vertical.recovery.mjs pass 18; test-vertical.mjs pass 165; browser-evidence scenario.test.mjs pass 20",
    "v0.81.0 case diagnostic: the fork origin's main resolved to a present commit and neither bare origin had objects/info/alternates; the case passed in two of three runs before the gc settings"
  ],
  "rejected": [
    {
      "option": "Copy the lifecycle's feature reader into the synthetic launchpad fixtures",
      "reason": "A root without the lifecycle runs no plan-first lifecycle, so there is no lifecycle message to agree with; the direct read is the hook's behavior before this order for that root."
    },
    {
      "option": "Judge .agents/skills in harness-context by host selection instead of presence",
      "reason": "The update now leaves no emptied host directory, which the failure needed; host selection would also change cases that write skills by hand."
    }
  ],
  "reopenWhen": "An operator's own files under .agents/skills make harness-context judge an unselected host's reads, or the bare-origin clone fails again with gc disabled."
}
```

## WO-258-D032

```json
{
  "id": "WO-258-D032",
  "date": "2026-11-08",
  "dispatch": "resume: verify",
  "decision": "Independently judge the twelve original criteria in VER-001, consume the executor's complete review row only if it stands at the current code identity, and run focused probes and variations without changing the implementation. No worker is needed for the claims available locally. The session's supplied readback is Codex CLI 0.167.0, gpt-6-astra, max; record that actual selection rather than claiming the recommended xhigh or changing settings. The transport supplies no hard dollar cap. Correct two verification-process errors here: the initial status and several aggregate source reads exceeded the output budget and were truncated, so unread portions are reread in bounded selections before judgment; the initial briefing reported usage unavailable, but the subsequent entry usage command reports 49,077 tokens, so the report uses that available counter.",
  "evidence": [
    "npm run resume -- verify allocated docs/verifications/WO-258/VER-001.md and reported the current session selection",
    "node scripts/harness.mjs usage 01a1b962-d6c3-75b3-8926-9f46afb646dc: 49,077 total tokens, codex-transcript-counter, dispatch scope, cutoff 2026-11-08T04:20:59.650Z",
    "The verification session's tool results explicitly marked the over-budget reads truncated; no verdict relies on those omitted bytes."
  ],
  "rejected": [
    {
      "option": "Accept the executor's green handoff without independent probes",
      "reason": "The verifier must vary the inputs and judge the change independently."
    },
    {
      "option": "Rerun the complete gate without a changed identity or failure",
      "reason": "The existing complete row can establish the same gate coverage while focused probes test the consequential claims."
    }
  ],
  "reopenWhen": "A focused probe fails, the code identity changes, the executor's row does not stand, or a required claim cannot be reproduced locally."
}
```

## WO-258-D033

```json
{
  "id": "WO-258-D033",
  "date": "2026-11-08",
  "dispatch": "resume: verify",
  "decision": "Choose pass for the twelve original criteria, with filing conditional on the required document gate for VER-001. Independent probes passed, including the historical receipt's control and fixed arms, the update election's refusal and admission, host transitions preserving personal files, old-Git refusal with bootstrap open, and pending release-close recording and consumption. No new blocking defect or follow-up was found. Retain D014's existing follow-up: a refreshed starter preserves its present older documentation map, so root documents may lack reader bindings; this is not a broken-link finding. Keep the actual starter refresh and its close-time measurement with release close, as the evidence gate specifies. The outcome matches independent verification; implementation, criteria, waivers and publication are unchanged. Correct two process diagnostics: the complete review row is stored under npm test with gateSelection review, not a separate npm test -- --review key or the order's alias spellings; the corrected lookup finds all 45 suites at the current identity. Over-budget reads recurred after compaction on status and broad searches; select the needed fields or exact sections before emission, and infer nothing from omitted output. The chat's earlier phrase unbound links meant root documents without reader bindings, as D014 states.",
  "evidence": [
    "docs/evidence/WO-258/verification-001-results.json records each completed probe's exact command, exit code, counts where available, bounded execution receipt and log digest",
    "docs/evidence/WO-258/verification-001-continuation.mjs and verification-001-continuation.json: base reader control exits 1 with the expected inventory refusal; current reader exits 0; all fixed instance checks exit 0",
    "coveringGateCheck(root, npm test, []) finds the passing complete review row at code identity 262eca5df193f405e156adcabb08f539bfe74e089ab285c8a0a2acd1c50af575, recorded 2026-11-08T03:27:06.521Z; scripts/lib/handoff-ledger.mjs consumes that key and the review selection",
    "npm run format:check exits 0: All matched files use Prettier code style; D009 retains the executor's host timing samples; D014 records the older-map follow-up",
    "docs/verifications/WO-258/VER-001.md records the independent judgments, instruments under test and limits; the result transition must consume a passing document row before filing"
  ],
  "rejected": [
    {
      "option": "Fail the fresh-export criterion on a present older map that refresh must preserve",
      "reason": "That would change the criterion's subject and conflict with its present-seed protection; D014 already boards the separate refresh rule."
    },
    {
      "option": "Repeat the complete gate despite the current passing review row",
      "reason": "The same coverage is available at the unchanged code identity; eight focused runs vary the consequential inputs without another complete run."
    },
    {
      "option": "Make no judgment or leave the verification unfinished",
      "reason": "All locally reproducible claims now have evidence; the remaining report and document-gate steps are authorized verification work."
    }
  ],
  "reopenWhen": "The final document gate fails, the code identity or standing gate evidence changes, a supported input reproduces a criterion failure or regression, or final-review integration changes the judged behavior. D014's own reopening condition remains in force."
}
```

## WO-258-D034

```json
{
  "id": "WO-258-D034",
  "date": "2026-11-08",
  "dispatch": "resume: final review; the judgment of WO-258 through VER-001, allocated FINAL-001",
  "decision": "Pass WO-258 at code identity 262eca5df193f405e156adcabb08f539bfe74e089ab285c8a0a2acd1c50af575, the identity of the complete review row recorded 2026-11-08T03:27:06.521Z (45 required suites, exit 0, 0 h 50 min, gate selection review) and of VER-001's subject, recomputed here before this review's edits; the report records the recomputation after them. Main, origin/main and the worktree's HEAD all stand at the activation base d9798e38ab4aed1c73d6f8837a21d5fe0c1732d3, and npm run worktree -- integrate WO-258 fetched origin and took in nothing, so that row is the row at the integrated identity and no complete run is started here. Every criterion holds on evidence run again in this session under the bounded wrapper, outside any gate: VER-001's four probes, the WO-258 cases of the features and harness suites with the WO-178 and WO-226 helper cases (7), the WO-258, WO-075 criterion 4, kit guide and WO-238 cases of the export and seeds suites (6), the WO-258 and guard cases of the plan-refutation suite (3), the release fixture's pending_dispatch and git_floor cases, the Git floor and engines reader cases of the runner suite (2), the derived-notice case of release preparation (1), the release case inventory (3), the whole instance-history suite with its separate-track case (1, 1 min 20 s) and the update finish and starter refresh cases of the update suite (2); harness check (43 surfaces), features render and check (the inventory unchanged), siblings and work-orders index checks, format:check, release check-surfaces --local, publication:check, plan check --timing and git diff --check all pass. This review changes no source: it writes the report, PR.md and RELEASE-NOTES.md, this decision, D035 (one follow-up finding with its reproduction) and D036 (the register dispositions), and refreshes the decisions index, the features inventory and the order's meter through their commands. Each changed standing document (the kit guide's First steps, Features, Planning in this instance, Kit files and instance files and Taking upstream updates, product 07's planning, release and model-specific notes, the operator reference's release-close row and the README's release line) replaces the sentence now wrong with the standing rule and links its decision; no dated account was added under a standing heading, and First steps links its three write-backs by anchor to the standing sections that cite D009, D011 and D012. The ideation receipt 065's ten known issues on WO-258 were read against the implementation: Copilot inference has a fixture arm in VER-001's probes (an order-segment attestation infers it on); the real starter's tree carries no docs/control/resume.jsonl, docs/discovery/environment.json or docs/control/orders, so a clone starts Claude-only as D003 and D004 state; a newcomer whose first session runs under Codex or Copilot elects the host by hand, the assumption the order records and the kit guide's Features section states; the template's router value equals the raised ceiling and the export measures no breach, while the other roles stay unset in the template; the release-close role text did not change, so the re-mint clause did not fire, and D013 records that root's acceptance anyway; a separate-track member filed after a sequence-only receipt waits for the next receipt (D016), the cost of an empty-sequence refutation is one worker told to return an empty judgment (D015), the refresh's removal of its own retired seed is distinguished from a kit action by the order's Design (D012), a vendor suffix on the Git version line is read past (the runner case admits the Windows form and refuses an Apple-suffixed 2.39.3 by its number), and a malformed plan-first value refuses the executor's writes in the write hook, not the prompt, so the recovery prompts stay available (VER-001's third probe).",
  "evidence": [
    "node --input-type=module -e 'import { gateCodeIdentity } …': 262eca5df193f405e156adcabb08f539bfe74e089ab285c8a0a2acd1c50af575 at 2026-11-08T12:33Z, before any edit of this review; docs/control/local/harness/checks.json: the npm test row of 2026-11-08T03:27:06.521Z at that identity, gateSelection review, exitCode 0, 45 requiredSuites, durationMs 3001483",
    "git rev-parse HEAD main origin/main: d9798e38ab4aed1c73d6f8837a21d5fe0c1732d3 each; npm run worktree -- integrate WO-258: Integration took in nothing: the worktree is not behind main",
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-258/verification-001-probes.mjs: pass 4; … --test-name-pattern 'WO-258|host rows are elections|WO-178 exact close helper|WO-226 helper shell syntax' scripts/test-features.mjs scripts/test-harness.mjs: pass 7; … 'WO-258|WO-075 criterion 4|the kit owns its complete guide|WO-238 criteria 1 and 9' scripts/test-launchpad-export.mjs scripts/test-launchpad-seeds.mjs: pass 6; … 'WO-258|field-only Workstream amendment admits only' scripts/test-plan-refutation.mjs: pass 3; bash scripts/test-release.sh --case pending_dispatch and --case git_floor: release tests passed; … 'Git floor|engines reader' scripts/test-runner.test.mjs: pass 2; … 'WO-257 the derived Read before upgrading' scripts/test-release-preparation.mjs: pass 1; node --test scripts/test-release-fixtures.mjs: pass 3; node --test scripts/test-instance-history.mjs: pass 1 (79,845 ms); … 'WO-226 update finish|starter refresh publishes' scripts/test-launchpad-update.mjs: pass 2",
    "node scripts/harness.mjs check: 43 generated surfaces; npm run features -- render left docs/control/FEATURES.md byte-identical and features -- check prints Features current; node scripts/siblings.mjs index --check and npm run work-orders -- index --check: PASS; npm run format:check: clean; npm run release -- check-surfaces --local: release block v0.121.0 and @dotln/skeleton 0.88.0 pass; npm run publication:check: 29 and 45 linked sections current; npm run plan -- check --timing: passes (followups 1,011 ms, documents 185 ms, receipts 5,543 ms, subject 69 ms, continuation 15 ms); git diff --check: clean",
    "git -C ../DotLn-Enterprise-Starter ls-tree HEAD docs/control/resume.jsonl docs/discovery/environment.json docs/control/orders: none present at d5b2e0b (v0.120.1); dotln.config.json and docs/lineage/README.md absent, docs/control/doc-ceilings.json present as a regular file",
    "docs/planning/refutations/2026-11-07-planning-ef4a1d095e4cd775-065.json: WO-258 aligned-with-findings, no hold, ten known issues",
    "git diff over d9798e38: 82 files, 3,214 insertions, 407 deletions, with the order's control segment, its evidence and verification directories and the starter's v0.120.1 refresh receipt untracked; the kit guide, product 07, the operator reference and the README diffs read whole"
  ],
  "rejected": [
    {
      "option": "Start another complete run",
      "reason": "The identity, not the dispatch time, says what was tested: the complete review row stands at the integrated identity and this review changes no source."
    },
    {
      "option": "Fail on the uncounted kit-launch spelling (D035)",
      "reason": "It is outside the criteria and breaks no behavior main had, so it is a follow-up by rule; the reviewer boards it with its reproduction."
    },
    {
      "option": "Rerun the verifier's historical two-arm replay",
      "reason": "docs/evidence/WO-258/verification-001-continuation.mjs rewrites the verifier's filed evidence JSON; its fixed arm is the instance-history suite run here, and the control arm stands on VER-001's run and criterion-9-controls.json."
    }
  ],
  "reopenWhen": "A supported input reproduces a criterion failure or a regression against main after the merge, the complete row at this identity is found not to stand, or an instance's first cycle on v0.121.0 meets one of the nine edges the order names."
}
```

## WO-258-D035

```json
{
  "id": "WO-258-D035",
  "date": "2026-11-08",
  "dispatch": "resume: final review",
  "decision": "Record as a follow-up, not a blocking finding, that kitWorkerLaunch in packages/skeleton/src/harness-host.ts does not recognize a kit launch whose npm flag follows the script name: npm run worker --silent -- review … returns null, so such a launch is neither counted against subagentCap nor refused at it, while npm run worker -- review, npm run --silent worker -- review and node scripts/worker.mjs review each count one use. WO-258's executor session shows the effect: the worker helper's journal holds ten WorkerLaunched rows and ten reports are on disk, while the hook's readback counts seven launches; the executor's handoff inferred the --silent spelling for rounds 4 to 6, and the journal keeps no command text to confirm which rows went uncounted. Class new-scope: the recognizer is outside this order's diff and the defect was present on main before it; it breaks no criterion and no behavior main had. The defensive repair is for npmScriptArgs to skip npm's own flags between the script name and the -- separator, or for the recognizer to read the helper's WorkerLaunched row, with a case per spelling so the cap's count agrees with the helper's journal.",
  "evidence": [
    "docs/evidence/WO-258/final-001-kit-launch-count.mjs, run under node scripts/harness.mjs bounded on 2026-11-08: the plain, flag-first and node spellings return { uses: 1, host: codex } and the --silent spelling returns null; docs/evidence/WO-258/final-001-kit-launch-count.json records the four readings and the session counts",
    "docs/control/local/harness/f4f31b410a7d8950b60a59d332286b8567063df11fcd729538351c92cd5ffb0f.jsonl (the executor session's journal): ten WorkerLaunched rows, rounds 1 to 6; node scripts/harness.mjs usage fb74ee9b-0caf-49f2-8ba5-0464930525ca: workers launched 7 (claude 0, codex 7)",
    "docs/evidence/WO-258/handoff.md, Attestation and usage: the readback counts 7 worker launches against 10 review workers, with the --silent spelling named as the likely cause",
    "packages/skeleton/src/harness-host.ts kitWorkerLaunch and npmScriptArgs, unchanged by this order"
  ],
  "rejected": [
    {
      "option": "Repair the recognizer in this review",
      "reason": "A reviewer writes no behavioral fix and certifies it; the edit would move the code identity and owe a fresh complete run for a defect outside the order's criteria."
    },
    {
      "option": "Route it as blocking",
      "reason": "No criterion names the launch count, and main's recognizer behaves the same; a finding outside the criteria that breaks no behavior main had is a follow-up by rule."
    }
  ],
  "reopenWhen": "A session passes subagentCap on uncounted launches, or the next order editing kitWorkerLaunch or npmScriptArgs activates.",
  "followup": "The next order that edits kitWorkerLaunch or npmScriptArgs in packages/skeleton/src/harness-host.ts, or the planning pass that allocates it: count a kit launch whose npm flag follows the script name (npm run worker --silent -- review) as the plain spelling is counted, with a case per spelling, so the cap's count agrees with the helper's WorkerLaunched rows."
}
```

## WO-258-D036

```json
{
  "id": "WO-258-D036",
  "date": "2026-11-08",
  "dispatch": "resume: final review; npm run plan -- followups --touching --work-order WO-258 (41 pending rows name a file this change touches or the order; 42 after this review's own nomination synced)",
  "decision": "Dispose the rows whose condition this change met, in one --apply batch against register revision 88c0087029c8b389bf524d225f5e4c87c439995e32d3e953842cc6daf22e8582 (18000bac843ba4be5b0223a44931b6489d750d58e02dcb84a9ee3fe6d3b6544c after the write), and leave the rows it only matched as they are. Deferred again with the met condition named: FUP-23aca17371cf7b86 (WO-234-D028), because WO-258-D007 edits scripts/lib/dispatch-bound.mjs without touching the gate-row standing read it names and the planning pass did not allocate it here; FUP-eed385be08e5bdd9 (WO-226-D022), because WO-258-D026 edits scripts/test-gate-followups.mjs and re-mints no oracle; FUP-c61f76f60798e1b2 (WO-257-D007), because WO-258-D013 settles the router's half and records the four other roots' acceptances while the byte-reduction row stays deferred. Left as matched: the 38 other rows, whose conditions did not occur (among them the cold-start optimization rows, whose roots this order neither grew nor shrank, the complete-run admission row, whose sequence failure did not recur, and the hand-written-inventory row, since the three complete-run failures of D029 to D031 were a host-load timeout, a helper-reuse rule, two fixture receipts and three behaviors this order changed, none an untraced inventory), and the two open nominations of this order, WO-258-D014's (FUP-7de23c426e329c34, deferred by the executor to its home) and WO-258-D035's (FUP-973464a1fa408976), which the next planning pass triages.",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-258 at register revision 7219954b5e4f706c751e4671dba6a9f6e47bca458bc9a53a87bbef3da5e92100: 272 pending rows, 41 matched over six pages, read in full; after npm run plan -- followups --sync minted FUP-973464a1fa408976 from D035, revision 88c0087029c8b389bf524d225f5e4c87c439995e32d3e953842cc6daf22e8582 with 42 matched",
    "npm run plan -- followups --apply docs/control/local/followup-request.json: three requests applied, each deferred, revision 18000bac843ba4be5b0223a44931b6489d750d58e02dcb84a9ee3fe6d3b6544c",
    "docs/evidence/WO-258/decisions.md D007, D013 and D026: the edits that met the three rows' conditions"
  ],
  "rejected": [
    {
      "option": "Triage this order's two open nominations here",
      "reason": "Triage is the planning pass's; the final review disposes only what this order delivered or whose condition its change met."
    },
    {
      "option": "Re-defer every matched cold-start row with this order named",
      "reason": "Their condition is a reduction below the ceilings or a change of a role's reviewed rules; this order did neither, and a textual match is a pointer for judgment, never a verdict."
    }
  ],
  "reopenWhen": "A later pass reads one of the 38 left rows' conditions as met by this order, or a re-deferred row's condition occurs again."
}
```
