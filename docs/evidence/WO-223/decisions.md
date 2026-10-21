# WO-223 decisions

## WO-223-D001

```json
{
  "id": "WO-223-D001",
  "date": "2026-10-20",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.88.0, the next minor above the observed release baseline v0.87.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.87.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-223-an-instance-takes-a-starter-update.md"
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

## WO-223-D002

```json
{
  "id": "WO-223-D002",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Record all five base observations before fixes.",
  "evidence": [
    "README.md records the bounded synthetic probe, base commit, completion time and per-observation outcomes.",
    "The cited WO-218-D042 is about historicalWorkOrders; the sign-off policy is established here from scripts/lib/contributions.mjs and its existing instance-data test."
  ],
  "rejected": [
    {
      "option": "Skip baseline reproduction because the order describes the gaps.",
      "reason": "A described failure is not executable evidence of this checkout."
    }
  ],
  "reopenWhen": "The baseline or the fixture arrangement is challenged."
}
```

## WO-223-D003

```json
{
  "id": "WO-223-D003",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Read moved document sections from readDecisions.recordSource, which was already checked by readTargetRecord against the immutable repository/commit/path/hash binding; preserve local readListed behavior and name the binding when the immutable read fails.",
  "evidence": [
    "scripts/lib/meta.mjs already exposes non-enumerable recordSource and targetRecord metadata.",
    "The moved-decisions fixture compares that source with a direct immutable read and checks operator-attribution advisories, so skipping moved records cannot pass.",
    "The isolated moved-document control passes the repair and fails the baseline read with the former local decisions path (repair-controls.json)."
  ],
  "rejected": [
    {
      "option": "Reread the same target blob inside docs-check, or skip moved rows.",
      "reason": "The extra read repeats an established verification and adds Git work; skipping drops document checks. The byte comparison covers the reuse choice without claiming a measured speedup."
    }
  ],
  "reopenWhen": "Decision rows stop carrying the verified source or their validation contract changes."
}
```

## WO-223-D004

```json
{
  "id": "WO-223-D004",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Look up moved-record clone mappings in the running checkout, primary checkout, then the checkout on main; identify the primary by its Git directory equaling the common Git directory. Refuse with all three locations named when no mapping is available.",
  "evidence": [
    "The primary-mapping control switches the primary checkout to a planning branch and successfully reads from its secondary worktree, including the meta writer and check used by sync.",
    "The fixture asserts current-over-primary and primary-over-main precedence with an unreadable lower-priority map, the main fallback, and the missing-map refusal."
  ],
  "rejected": [
    {
      "option": "Keep the main-only lookup or move ignored clone maps into the common Git directory.",
      "reason": "The first reproduces the instance failure and the second changes local-lane ownership. The former target registry fallback is removed so absence of all three clone maps gives the requested refusal; lifecycle target registration remains unchanged."
    }
  ],
  "reopenWhen": "A supported layout has no primary checkout and cannot keep the mapping in its running or main checkout."
}
```

## WO-223-D005

```json
{
  "id": "WO-223-D005",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Correct the kit session publish form to node scripts/worktree.mjs publish and name the npm form as withheld; document the three clone-map locations beside the starter update route.",
  "evidence": [
    "scripts/kit/README.client.md now names the spelling registeredTargetAdmission already admits and the lookup order the reader implements."
  ],
  "rejected": [
    {
      "option": "Widen the hook admission to npm or duplicate these instructions in role text.",
      "reason": "The order changes guidance, not admitted effects or cold-start roles."
    }
  ],
  "reopenWhen": "The publish helper spelling or mapping ownership contract changes."
}
```

## WO-223-D006

```json
{
  "id": "WO-223-D006",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "At launchpad worktree creation, print one sign-off advisory only when the new checkout has no contributions.operatorAuthor declaration; name both trailer and reviewed declaration routes in the publish refusal.",
  "evidence": [
    "worktree start loads the new checkout after creation; registered-target starts retain their existing branch.",
    "The exported-instance fixture checks the undeclared advisory; test-worktree.sh checks silence for a declared author; test-license-surfaces.mjs checks both routes in the FAIL line."
  ],
  "rejected": [
    {
      "option": "Add an update action with an invented author identity or create another exempt identity.",
      "reason": "The kit cannot know an instance identity, and the author exemption policy is unchanged."
    }
  ],
  "reopenWhen": "An operator meets an unsigned launchpad branch without either route being named."
}
```

## WO-223-D007

```json
{
  "id": "WO-223-D007",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Keep the exact release-close admission grammar and add expected publish/dry-run spellings plus a suffix mismatch class to its advisory.",
  "evidence": [
    "scripts/test-harness.mjs retains the four base admitted forms, including repeated material arguments and apostrophe escaping.",
    "New assertions cover redirects, pipes, extra flags and non-canonical material quoting, including a quoted literal redirect character."
  ],
  "rejected": [
    {
      "option": "Admit redirects, pipes or alternate material spellings.",
      "reason": "They change the byte-exact helper contract and are outside this order."
    }
  ],
  "reopenWhen": "A rejected suffix is misclassified or an existing admitted helper stops being admitted."
}
```

## WO-223-D008

```json
{
  "id": "WO-223-D008",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Use one outwardFindingText formatter for pre-review and publication refusals; subject.length prints the measured character count and subjectLengthLimit from the lint module.",
  "evidence": [
    "The lint already counts Unicode code points; the formatter uses the same count and first-line handling.",
    "Cases cover a 90-character conventional subject at pre-review and publication, and an emoji subject with CRLF and a separate body."
  ],
  "rejected": [
    {
      "option": "Hard-code 72 in each refusal or add the limit to role text.",
      "reason": "One shared constant prevents drift and the refusal is the point at which the number is actionable."
    }
  ],
  "reopenWhen": "The lint changes its character-count convention or limit."
}
```

## WO-223-D009

```json
{
  "id": "WO-223-D009",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Record the two required isolated repair controls with their suite, exact command, reverted paths, source fingerprints, exit codes and log hashes; retain the immutable fixture behavior in ordinary regression cases.",
  "evidence": [
    "repair-controls.json records positive and negative arms run serially under harness bounded.",
    "The baseline document arm names the former local path; the baseline mapping arm fails with no main-branch control-plane worktree found."
  ],
  "rejected": [
    {
      "option": "Treat an unrelated failing negative arm or only a happy-path test as repair evidence.",
      "reason": "A control must fail for the specific behavior being repaired."
    }
  ],
  "reopenWhen": "A changed implementation makes either control non-discriminating."
}
```

## WO-223-D010

```json
{
  "id": "WO-223-D010",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Write the lookup order into product 07 at the document-root contract and the diagnostic behavior at the exact-helper paragraph; keep the existing target admission and publication authority text.",
  "evidence": [
    "docs/product/07-execution-guide.md contains both in-place write-backs.",
    "publication:check after the edit retained 255/255 heading coverage and named only the expected stale software-engineer source lock; sync owns its regeneration."
  ],
  "rejected": [
    {
      "option": "Add another guide or leave the rule only in this report.",
      "reason": "The maintained operator guide and exported README are the points of use."
    }
  ],
  "reopenWhen": "A guide sentence no longer matches the reader or hook."
}
```

## WO-223-D011

```json
{
  "id": "WO-223-D011",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Stage application v0.88.0 under the order's minor classification and bump only skeleton from 0.63.0 to 0.63.1 for a compatible advisory change; update its workspace dependency pins without bumping unchanged components.",
  "evidence": [
    "npm run release -- prepare --local assigned v0.88.0 above local ancestral v0.87.0 and recorded D001.",
    "Only packages/skeleton/src/harness-host.ts changes package source; the other repairs are launchpad scripts.",
    "Public helper admissions and package interfaces are unchanged; private and prepublishOnly controls are retained."
  ],
  "rejected": [
    {
      "option": "Bump every component or publish this implementation directly.",
      "reason": "Unchanged component sources need no bump; verification and final review remain separate dispatches."
    }
  ],
  "reopenWhen": "Integration consumes either version or an interface compatibility change is discovered."
}
```

## WO-223-D012

```json
{
  "id": "WO-223-D012",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Regenerate authority evidence and the installed harness, and carry the existing live feedback audit into this order's deterministic feedback edition. Historical harness live smokes remain immutable; the current harness is judged by its generated-surface check and fixtures, not a fabricated new live episode.",
  "evidence": [
    "npm run sync regenerated authority/001 and the installed harness and publication lock, then authority/002 after the worker-review repair. scripts/harness-evidence.mjs checks current generated surfaces while retaining WO-042 live smokes; it has no edition writer.",
    "node scripts/feedback-evidence.mjs --carry docs/evidence/WO-218/feedback-001 --edition WO-223 --revision 001, then --check with the same edition/revision, both exited 0. It carries the WO-222 live audit and verifies ten passing regressions and ten removal failures.",
    "No changed path belongs to FEEDBACK_SOURCE_PATHS; the component release label changed and the judged behavior did not."
  ],
  "rejected": [
    {
      "option": "Invent a current live harness or feedback episode.",
      "reason": "The order owes no model episode and existing live evidence must retain its recorded subject."
    }
  ],
  "reopenWhen": "A changed judged feedback source or failed current harness fixture requires new evidence."
}
```

## WO-223-D013

```json
{
  "id": "WO-223-D013",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "I assumed the selected feedback directory used feedback/001.",
  "meant": "currentEvidence names docs/evidence/WO-218/feedback-001.",
  "changed": "Read the canonical selection, used that existing directory for the successful carry, and selected the checked new edition. The failed carry wrote no edition.",
  "decision": "Resolve edition directories from currentEvidence before using them.",
  "evidence": [
    "The initial carry refused because feedback/001 contains no schema-2 edition.",
    "The canonical selection returned directory docs/evidence/WO-218/feedback-001; the corrected carry and check exited 0."
  ],
  "rejected": [
    {
      "option": "Create the assumed source directory or alter historical edition bytes.",
      "reason": "The canonical source already exists and identifies the retained live audit."
    }
  ],
  "reopenWhen": "An evidence command reports a missing canonical edition."
}
```

## WO-223-D014

```json
{
  "id": "WO-223-D014",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Fix the one unique diagnostic issue found independently by both required workers: strip backslash-escaped characters when classifying a refused helper suffix, and assert escaped literal redirect/pipe characters receive the material-quoting diagnosis.",
  "evidence": [
    "self-review.md records both fresh read-only reviews, each with one P3 finding and no further actionable issue.",
    "The original classifier removed quoted strings but retained the backslash and > or |, so its unquoted-operator regex misclassified a literal path character.",
    "scripts/test-harness.mjs adds both escaped cases; admission parsing is untouched."
  ],
  "rejected": [
    {
      "option": "Leave the incorrect class because the helper remains withheld.",
      "reason": "Criterion 4 requires useful mismatch diagnosis; the fix is bounded to the new diagnostic."
    }
  ],
  "reopenWhen": "A refused suffix is misclassified by the diagnostic or a baseline admission changes."
}
```

## WO-223-D015

```json
{
  "id": "WO-223-D015",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "kind": "correction",
  "misread": "The new close-helper fixture assumed every invocation returns systemMessage.",
  "meant": "The generated hook displays an identical advisory once per session and journals each occurrence; earlier cases had already displayed the same mismatch class.",
  "changed": "Assert the newest journaled advisory for each rejected helper, preserving the hook's existing deduplication and the base admission assertions.",
  "decision": "Correct the fixture's observation point rather than changing advisory delivery.",
  "evidence": [
    "The first complete npm test -- --review exited 1 after 348.748 seconds; harness-fixtures had one failure, a TypeError reading systemMessage.includes in the new assertion. Remaining scheduled tasks were skipped, not claimed passing.",
    "runHarnessHook records the advisory before showHarnessAdvisory can delete the repeated systemMessage; the established delegation fixtures assert that same journal contract.",
    "After the correction, node scripts/harness.mjs bounded -- node --test --test-name-pattern 'WO-178 exact close helper admission' scripts/test-harness.mjs exited 0, one test passed, on 2026-10-20 at 22:50:29 UTC."
  ],
  "rejected": [
    {
      "option": "Disable advisory deduplication or weaken the mismatch assertions.",
      "reason": "The observed failure was a fixture error; the diagnostic and delivery contract are both retained."
    }
  ],
  "reopenWhen": "The hook changes its advisory journal or delivery contract."
}
```

## WO-223-D016

```json
{
  "id": "WO-223-D016",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Add the two new target-worktree cases to the runner's declared and expanded case inventory, retaining its exact inventory and deadline checks.",
  "evidence": [
    "The second complete npm test -- --review exited 1 after 705.399 seconds; runner-fixtures found 54 declarations where its inventory assertion still expected 52.",
    "New inputs read: scripts/test-runner.test.mjs at its target-worktree inventory case and scripts/fixtures/target-worktree-cases.json. The added mapping and 90-character-subject cases each have one declaration and one registered name, increasing 52/76 to 54/78.",
    "The bounded focused target-worktree inventory case passed after adding precisely those two names and updating the counts; every existing declaration, expanded name and deadline assertion remains.",
    "The second run also passed harness-fixtures and launchpad-planning; the latter executes the exported-instance moved-record document gate and asserts that docs-check, entropy, reader-profiles, plan and plan-refutation-current all pass. The overall run remains failed because of the inventory mismatch."
  ],
  "rejected": [
    {
      "option": "Remove the exact counts or derive the expected inventory from the current implementation.",
      "reason": "The independent inventory detects lost cases; updating it to include the two intentional additions preserves that check."
    }
  ],
  "reopenWhen": "The target-worktree suite intentionally adds, removes or renames a case."
}
```

## WO-223-D017

```json
{
  "id": "WO-223-D017",
  "date": "2026-10-20",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up for the release-close advisory's mismatch class. When a withheld suffix holds a --material word and no unquoted shell operator, the classifier names 'non-canonical material flag quoting or value', whatever else differs. Two withheld helpers are misclassified. In '--publish --material '<path>=preserve' --force' the material word is canonical and the mismatch is the extra word. In '--dry-run --material '<path>=preserve'' the material word is canonical; the hook admits material words only after --publish. No criterion breaks. Every withheld helper still prints both expected spellings and the material form, and the three kinds criterion 4 names (a redirect, a pipe, a non-canonical material word) are classified correctly; main printed no class. D007's reopening condition, a rejected suffix misclassified, has occurred. The displayed text also ends 'host permissions decide.; host permissions decide.'. protocolAdvisory appends the phrase to an advisory that already ends with it, and the base displays the same doubled phrase.",
  "evidence": [
    "docs/evidence/WO-223/verification-001/hook-probe.fragment.mjs, appended to a scratch snapshot's scripts/test-harness.mjs and run under the bounded wrapper at 2026-10-21T00:20:08Z, exit 0. Each of 21 withheld spellings journals its advisory on every invocation, naming both expected spellings. 19 receive the class their suffix shows; the two above receive the material class. The four base admitted forms are still admitted.",
    "packages/skeleton/src/harness-host.ts releaseCloseAdmission tests /(?:^|\\s)--material(?:\\s|$)/u against the whole suffix after the unquoted-operator test. protocolAdvisory appends '; host permissions decide.' to the missing() text, which ends with the same phrase, as at base 6df0ec37."
  ],
  "rejected": [
    {
      "option": "Route the class as blocking",
      "reason": "Criterion 4's named kinds hold and every withheld helper prints the expected spellings. The defect is the hint for a mixed suffix, and main printed none."
    },
    {
      "option": "Correct the classifier in this verification",
      "reason": "A verifier never edits the implementation it judges; the defect is boarded with its reproduction."
    }
  ],
  "followup": "The next order that edits releaseCloseAdmission in packages/skeleton/src/harness-host.ts (WO-219 edits that file at its step 19). Classify a withheld suffix after removing the canonical material words that follow --publish. Name material quoting or value only for a remaining --material word or its value. Name extra words when canonical material words are followed by other words. Name a --material word after --dry-run as admitted only with --publish. Display 'host permissions decide.' once. Add cases for '--publish --material '<path>=preserve' --force' and '--dry-run --material '<path>=preserve'', and keep the existing mismatch cases and the four admitted forms.",
  "reopenWhen": "A repair restores the rule with its cases, or a session follows a misclassified class instead of the printed spelling."
}
```

## WO-223-D018

```json
{
  "id": "WO-223-D018",
  "date": "2026-10-20",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up for the contribution sign-off FAIL line. The line now offers two routes for an unsigned commit: the Signed-off-by trailer, or 'declare that identity as contributions.operatorAuthor in dotln.config.json through a reviewed change'. It offers the second route even when the instance already declares a different operatorAuthor. The key holds a single identity, so following that route there replaces the operator's own exemption. For an outside contributor, or the GitHub identity FUP-da505c82f2262b8e defers, the trailer is the route. The worktree start advisory prints only when no operatorAuthor is declared, so the two texts disagree about when declaring is the remedy. No criterion breaks: criterion 3 asks the FAIL line to name the key, which it does, and the rule decides the same commits as main. Main named only the trailer route.",
  "evidence": [
    "docs/evidence/WO-223/verification-001/probes.mjs signoff under the bounded wrapper, exit 0, with synthetic identities. With operatorAuthor 'Fixture Operator <operator@example.invalid>' declared, an unsigned 'Outside Author' commit fails with the same line as with no declaration, and both lines name the declaration route.",
    "scripts/lib/contributions.mjs contributionSignoffRules builds the expected text without reading whether operatorAuthor is declared. scripts/lib/config.mjs validateContributions admits one 'Name <email>' identity. scripts/worktree.mjs start prints its advisory only when loadConfig(target).contributions?.operatorAuthor is absent."
  ],
  "rejected": [
    {
      "option": "Route the text as blocking",
      "reason": "Criterion 3 holds and the rule decides the same commits as main. The defect is the remedy text in an instance that already declares its operator."
    },
    {
      "option": "Widen the exemption to a second identity",
      "reason": "FUP-da505c82f2262b8e defers that choice, and this order's non-goals exclude it."
    }
  ],
  "followup": "The next order that edits scripts/lib/contributions.mjs. Name the declaration route in the FAIL line only when the instance declares no contributions.operatorAuthor, as the start advisory does. When one is declared, name the trailer route and say that the declared contributions.operatorAuthor already exempts its single identity. Add a case per arm in scripts/test-license-surfaces.mjs.",
  "reopenWhen": "A repair restores the rule with its cases, an instance replaces its operatorAuthor to pass a publish, or FUP-da505c82f2262b8e is decided."
}
```

## WO-223-D019

<!-- integration refs/dotln/checkpoint/WO-223/6 -->

```json
{
  "id": "WO-223-D019",
  "date": "2026-10-21",
  "dispatch": "resume: final review; worktree integrate WO-223",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all 6df0ec37cc21143871217bade638e5ec28bc5959 and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-223/6, e35dc7bb06bf0221ae95e6135063f25d8ab54556), retained its named stash c58affaabf61075726c127f9c8531557c04cb06c, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR meter block), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: docs/intake holds three tracked .gitkeep files and git ls-files --others --ignored --exclude-standard lists nothing there. Every acceptance claim carries forward unchanged: the code identity after integration is 917ceeff861b3902ca6cd533717dd4d98b1a12e9d9691a5b63345bb2c2a36d1b, the identity the executor handed off and VER-001 judged, so the passing complete review row at that identity (npm test with review selection, 2026-10-20T23:38:50.498Z, 104 fresh tasks over 39 required suites, exit 0) stands for the integrated tree and no second complete run is owed. The three other printed affected checks pass on the integrated tree. The component-version bump collides with nothing: main's skeleton at 6df0ec37 is 0.63.0 and the subject stages 0.63.1 with the console pin following; the integration fetched origin's tags and the release-surface check reads v0.88.0 against the latest local tag v0.87.0, so no v0.88.* tag exists locally or on origin. The evidence inputs are unchanged by integration: docs/evidence/current.json selects WO-223 authority/002 and feedback/001 and keeps WO-218 artifact-identity/001 and verification/001, as at the verified subject.",
  "evidence": [
    "refs/dotln/checkpoint/WO-223/6 (e35dc7bb06bf0221ae95e6135063f25d8ab54556); docs/control/local/integration.json: preservationCommit e35dc7bb…, mergeCommit null, complete true, stage applied, untrackedConflicts [], resolved [], authored [], pending [], before and upstream 6df0ec37…; the helper printed Bases 6df0ec37 -> 6df0ec37, Authored conflicts: none, and the ten regenerated projections, at 2026-10-21T01:15Z",
    "git rev-parse origin/main main HEAD before integration: each 6df0ec37cc21143871217bade638e5ec28bc5959; git log --oneline main..HEAD and HEAD..main print nothing; the helper's own fetch resolved upstream to the same commit",
    "node docs/evidence/WO-223/verification-001/probes.mjs identity under the bounded wrapper at 2026-10-21T01:08:16Z before integration and again after it: codeIdentity 917ceeff861b3902ca6cd533717dd4d98b1a12e9d9691a5b63345bb2c2a36d1b both times, with the npm test review row at that identity recorded 2026-10-20T23:38:50.498Z, exit 0, 1,942,858 ms, 104 fresh and 0 reused tasks, no unrun suite",
    "Affected checks after integration under node scripts/harness.mjs bounded, 2026-10-21T01:16Z to 01:17Z, each exit 0: npm run publication:check (255 of 255 product headings indexed; both editions CURRENT, 29 and 45 sections); node scripts/harness.mjs check (34 generated surfaces; local-terms list present); npm run release -- check-surfaces --local (release block v0.88.0 against the latest local tag v0.87.0; skeleton src changed, 0.63.1 against 0.63.0; beacons, browser-evidence, compiler, console and kernel src unchanged; workspace pins exact; the license surfaces). npm run meta -- --check (no observed budget breach, 0 reopen candidates), git diff --check and npm run format:check at 01:17Z: exit 0, clean, all files formatted",
    "git diff main -- package-lock.json changes four lines, the skeleton version and the console pin, and adds no node_modules entry; git diff main -- docs/evidence/current.json moves authority from WO-218/003 to WO-223/002 and feedback from WO-218/001 to WO-223/001 and leaves artifact-identity and verification at WO-218/001, the executor's selection; integration changed none of them",
    "find docs/intake -type f lists chats/.gitkeep, images/.gitkeep and notes/.gitkeep, each tracked; git ls-files --others --ignored --exclude-standard docs/intake prints nothing"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR meter block and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration, and the code identity is unchanged."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "The identity, not the dispatch time, says what was tested: the passing complete row at 917ceeff… ran every required suite fresh at these bytes, and a second run of the same bytes adds no coverage for about 32 minutes of gate time."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-21. Original base: `6df0ec37cc21143871217bade638e5ec28bc5959`.
Fetched main: `6df0ec37cc21143871217bade638e5ec28bc5959`. Checkpoint: `refs/dotln/checkpoint/WO-223/6` (`e35dc7bb06bf0221ae95e6135063f25d8ab54556`).
Named stash retained: `c58affaabf61075726c127f9c8531557c04cb06c` (WO-223 integrate 2026-10-21).
Intake backup: none named; `docs/intake` holds three tracked `.gitkeep` files and no ignored file, so the helper's intake check required no archive.
Resolved projections: none.
Release preparation: WO-223 target v0.88.0 remains current. Files changed: docs/evidence/WO-223/meta.json, docs/final-reviews/WO-223/PR.md. Meter snapshot: docs/evidence/WO-223/meta.json, 4105 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-001's seven criterion judgments and the executor's handoff at code identity `917ceeff…`, which the integrated tree keeps; VER-001's F1 and F2 as boarded (D017, D018); D001's minor classification and the v0.88.0 target. No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the complete run pass on the integrated tree at 01:16 to 01:17 UTC (evidence above); the complete run is the standing complete review row at the integrated identity, reused and recorded in FINAL-001.

## WO-223-D020

```json
{
  "id": "WO-223-D020",
  "date": "2026-10-21",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 boards a follow-up for the sign-off advisory's reach. worktree start prints the advisory only on the launchpad-order path, after its own worktree add. startTargetWorktree, which creates a target order's launchpad worktree and branch through ensureWorktree, prints none. Every launchpad publish, a target order's records publish included, runs contributionSignoffRules over origin/main..HEAD, so an instance whose first order is a target order still meets the sign-off rule at its records publish without an earlier advisory. No criterion breaks: criterion 3 names a launchpad order, and the exported-instance case asserts exactly one advisory there. main printed no advisory on either path, so no behavior main had is broken.",
  "evidence": [
    "grep -rn 'Signed-off-by' scripts packages/skeleton/src at 2026-10-21T01:20Z: the advisory text at scripts/worktree.mjs line 1024, inside the launchpad-order branch of start after the targetPlan branch returns at line 1019, and the rule's trailer regex and FAIL line at scripts/lib/contributions.mjs lines 32 and 44; no other site.",
    "scripts/worktree.mjs read at the same time: startTargetWorktree (line 551) creates the clone and launchpad worktrees through ensureWorktree (lines 562 to 592, git worktree add at lines 591 and 592) and prints no advisory; the publish path calls contributionSignoffRules(subject) at line 1235 for every launchpad publish, after the repositoryId branch that handles a target order's records."
  ],
  "rejected": [
    {
      "option": "Route the gap as blocking",
      "reason": "Criterion 3 names a launchpad order and holds; the rule decides the same commits as main, and main printed no advisory on either path."
    },
    {
      "option": "Add the advisory to startTargetWorktree in this review",
      "reason": "scripts/worktree.mjs is a declared machinery source, so the edit moves the code identity and owes a fresh complete review of about 32 minutes for one advisory line; the follow-up names the site and its cases."
    }
  ],
  "followup": "The next order that edits start or startTargetWorktree in scripts/worktree.mjs. Print the same one-line sign-off advisory after startTargetWorktree creates the launchpad worktree when the loaded configuration declares no contributions.operatorAuthor, and nothing when it does; add a case per arm in scripts/test-target-worktree-start.mjs and keep the launchpad-order case in scripts/test-launchpad-planning.mjs.",
  "reopenWhen": "A repair restores the advisory on the target path with its cases, or an instance's first records publish for a target order is refused on the sign-off rule without an earlier advisory."
}
```
