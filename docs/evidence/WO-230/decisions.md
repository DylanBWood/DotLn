# WO-230 decisions

## WO-230-D001 — keep the activation evidence and describe the fetched merge base

```json
{
  "id": "WO-230-D001",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Use the merge base of the subject and the base branch fetched through fetchRemoteBranch's isolated lane for both session publication forms, only when the activation base is its ancestor. Use the fetched commit returned by the existing helper directly, without updating a remote-tracking ref. Keep the activation base in every lifecycle, registry and verification record and add it to the Change section's closing sentence only when different. Preserve the existing final-publish refusal for a reviewed commit equal to its activation base, and also refuse records whose tree equals the described base. The draft prepares and records its commit before the fetch, preserving retry identity if the fetch fails. A fetch error names origin, the base branch and the public forge selector without relaying transport output that could contain host paths.",
  "evidence": [
    "README.md baseline: the original implementation's fast-forwarded fixture publishes two rows, later.txt and reviewed.txt; later.txt is not the order's own change.",
    "scripts/lib/github-repository.mjs fetchRemoteBranch returns the fetched commit and imports its objects without moving any branch or tracking ref.",
    "scripts/lib/target-publish.mjs previously computed both session forms from state.baseCommit or subject.baseCommit; observeTarget binds its separate episode diff to the request base.",
    "The fork's cited WO-013 D008, D009 and FINAL-001 F1 were read in its launchpad worktree: they identify the same stale-table cause and preserve its prepared draft.",
    "The paired draft controls in the second complete run passed: the unchanged activation-base arm lists two files (later.txt and reviewed.txt); the integrated later-base arm lists one (reviewed.txt), versus the original implementation's two rows on that integrated history. The complete run itself failed in a separate new final-publish fixture; final gate outcomes are in controls.json and handoff.md.",
    "The corrected final-publish fixture passed its bounded failure reproduction on 2026-10-24: comparing the records commit with its merge base yields six files, including both reviewed target files and four moved records. Comparing with its parent yields only the four records and loses the reviewed target change."
  ],
  "rejected": [
    {"option": "NoOp", "reason": "The bounded baseline reproduced the stale Change table that blocks publication in the cited fork."},
    {"option": "Use the subject's parent", "reason": "The final records commit's parent is the reviewed commit; that comparison drops the reviewed product change and includes only records."},
    {"option": "Trust refs/remotes/origin/main", "reason": "The local tracking ref can be stale. The existing lane already returns the exact fetched object."},
    {"option": "Rebind baseCommit through an event or correction", "reason": "The baseline witness and verification refer to the activation base; a publication correction does not authorize rewriting them."},
    {"option": "Weaken the outward identifier lint", "reason": "Correcting the described change removes unrelated rows while preserving the lint's existing target-path and kit-record rules."}
  ],
  "reopenWhen": "A subject's activation base must itself be rebound with a fresh baseline walk, an instance needs the index's stale mark cleared independently of publication, or a fetched merge base does not reproduce the forge's change."
}
```

## WO-230-D002 — keep episode publication and planning-time admission unchanged

```json
{
  "id": "WO-230-D002",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Retain the episode form's request-bound base and diff hash as this order's known issue. Retain planning-time activation and the existing stale-base index signal. Limit the plan advisory filter to the open target order's own evidence, verification and final-review roots resolved through docRelative; other orders' paths and target-side identifier or review-word paths still receive the existing advisory.",
  "evidence": [
    "WO-230 Design and Known issues explicitly exclude rebinding an episode base and adding a worktree-start admission rule.",
    "observeTarget hashes the binary diff against episode.request.baseCommit; changing only its table would break the receipt's meaning.",
    "targetOrderPathAdvisories previously inspected every backticked Execution-plan path without resolving the order's record roots.",
    "The added plan fixtures cover the default roots and independently configured record roots; the existing gem-board review-word advisory remains unchanged."
  ],
  "rejected": [
    {"option": "Change every publication form together", "reason": "Episode publication owns a separately bound effect receipt and is outside the order's authorized correction."},
    {"option": "Skip every path under docs", "reason": "A target-side docs/WO-006-notes.md must still produce an identifier advisory."},
    {"option": "Require a fresh planning base before worktree start", "reason": "The existing stale index signal is the scoped design; publication now handles an integrated later base."}
  ],
  "reopenWhen": "A resident episode integrates a later base-branch commit before publication and its table misstates the change, or an instance activates a second order on a stale base after this correction ships."
}
```

## WO-230-D003 — repair the release-heading input within the existing patch classification

```json
{
  "id": "WO-230-D003",
  "date": "2026-10-24",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "Append the standard activation placeholder to the filed order's otherwise unversioned heading, then use release prepare --local to assign its declared patch target. This is release bookkeeping, with no acceptance, scope, event-schema or admission-rule change. Package components remain at their existing versions because no packages/*/src file changes; release.mjs componentVersionRules maps each component to that source directory.",
  "evidence": [
    "npm run release -- prepare --local initially exited 1: release prepare requires exactly one strict version in the work-order heading, or the (version assigned at activation) placeholder.",
    "The filed WO-230 heading contains neither; its Release classification is already patch.",
    "scripts/lib/release-preparation.mjs accepts the standard placeholder and writes the version, README claim and a structured release decision.",
    "The adjacent queue records the diagnosis, announcement and actor-attested message-boundary check-in before the heading repair."
  ],
  "rejected": [
    {"option": "Weaken release preparation's heading validation", "reason": "The defect is one malformed input, and its supported placeholder already supplies the correct route."},
    {"option": "Choose a version by hand", "reason": "The existing command derives the patch from the local release baseline and records it."},
    {"option": "Pause the order for routine version authority", "reason": "The executor skill explicitly assigns routine release preparation and adjacent repair within the existing scope."}
  ],
  "reopenWhen": "Release preparation still refuses after the standard input is restored, or integration consumes the assigned version."
}
```

## WO-230-D004

```json
{
  "id": "WO-230-D004",
  "date": "2026-10-24",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.96.1, the next patch above the observed release baseline v0.96.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.96.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-230-target-publish-against-the-base-branch.md"
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

## WO-230-D005 — refresh a published draft when its merge base can advance

```json
{
  "id": "WO-230-D005",
  "date": "2026-10-24",
  "dispatch": "resume: next; independent executor reviews",
  "decision": "Fix the same-tree retry defect found independently by both workers. Reuse the published draft commit and recompose, lint and edit its body when its history can contain an intermediate base-branch ancestor. Retain the existing no-edit shortcut only for a draft whose single parent is the activation base: after the no-change check, that history has no intermediate ancestor that could change its table. Longer histories refresh the body on each same-tree retry without adding a state field or another prepared commit. This pays one pull-request edit on such a retry, including when the base has not changed, to avoid recording a new publication-base field or reading and parsing forge body text. The existing publication lane retains the remote-head lease check and skips an unchanged push.",
  "evidence": [
    "The criteria adversary and design improver each reported one P2 finding against the initial diff: publishTargetDraft computed a new base in its same-tree shortcut but returned the old body.",
    "The added regression first publishes a draft with later.txt and reviewed.txt against the activation base, advances remote main to the already-integrated later commit, then retries the identical tree and asserts one remaining row, the activation clause, one DraftPrepared event and an unchanged draft head.",
    "The existing direct-child same-tree fixture asserts no additional pull-request call; the existing pushObservedCommit returns before git push when the remote branch already names the requested commit.",
    "Additional implementation inputs: scripts/test-runner.test.mjs and scripts/fixtures/target-worktree-cases.json enumerate every target-worktree test declaration and expanded name; their inventory was extended to 67 declarations and 95 names for these regressions."
  ],
  "rejected": [
    {"option": "Keep the same-tree shortcut for every ancestry", "reason": "It leaves a stale table after the fetched merge base advances."},
    {"option": "Persist a new described-base field", "reason": "The order excludes new state fields and an existing commit can be reused without one."},
    {"option": "Always query the forge body to detect a change", "reason": "It adds another remote read and body comparison to preserve an optimization; the direct-child case remains provably unchanged without it."}
  ],
  "reopenWhen": "Repeated body edits become a measured cost, or the publication contract adds a persisted composed-body identity that allows a simpler unchanged-body check."
}
```

## WO-230-D006 — keep generated-document parity in the document suite

```json
{
  "id": "WO-230-D006",
  "date": "2026-10-24",
  "dispatch": "resume: next; adjacent-0002",
  "decision": "Repair the encountered work-orders-fixtures product-read failure by moving only the byte-for-byte comparison with packages/console/fixtures/inputs/workOrderIndex-workstreams.md into scripts/test-docs-check.mjs, an existing document suite. Keep membership, repository/base, stale-state, path-privacy, card-count, index and duplicate-edge assertions in the product suite. The moved assertion uses the same deterministic temporary real-Git fixture and cleans it afterward. No read guard, generated attribute or product assertion is weakened.",
  "evidence": [
    "The first complete npm test -- --review row ended 2026-10-24T19:19:11.265Z with exit 1 after 443666 ms; work-orders-fixtures passed all 32 test cases but recorded one excluded-input observation for its WO-080 workstream membership case.",
    "scripts/test-work-orders.mjs reads the generated console Markdown input in the middle of a product behavior case; .gitattributes marks packages/console/fixtures/** dotln-generated, excluding it from the product identity.",
    "scripts/test-runner.mjs declares docs-check-fixtures as document: true and kit: core-only: core product roadmap. The destination never runs in exported kits, so the product test's KIT-MANIFEST guard is unnecessary there. scripts/test-workstream-index-fixture.mjs exposes the same deterministic fixture.",
    "The same-tree publication fix and all other source files were unchanged throughout the failed gate. The complete row left target publication, plan refutation and other suites unrun, so it provides no passing claim for them."
  ],
  "rejected": [
    {"option": "Remove the equality assertion", "reason": "The generated console input must continue matching the current index renderer."},
    {"option": "Disable the read guard or unmark the generated fixture", "reason": "That would hide the dependency between a product result and bytes its identity excludes."},
    {"option": "Move the whole work-order suite into document checks", "reason": "It would misclassify the independent product behavior assertions and increase document-gate work unnecessarily."},
    {"option": "Only add a document label to the shell suite's test name", "reason": "The read guard does not exempt names; this shell suite has no document-case split, so a label alone would preserve the failure."}
  ],
  "reopenWhen": "The document comparison ceases to run, the product suite reads another excluded source, or the fixture ceases to be deterministic."
}
```

## WO-230-D007 — supply the final-publish fixture's required decision record

```json
{
  "id": "WO-230-D007",
  "date": "2026-10-24",
  "dispatch": "resume: next; complete gate failure repair",
  "decision": "Correct the new final-publish fixture by writing its required decisions.md before target-records, using the existing final-publish fixture's setup. Count all four moved records: the merge-base comparison has six paths and the parent comparison four. Product code and the target-records containment requirement stay unchanged.",
  "evidence": [
    "The second complete npm test -- --review row ended 2026-10-24T19:43:57.598Z with exit 1 after 1194962 ms. Its only executed failing task was test-target-worktree-publish.mjs, whose new final-publish case stopped at target-records: records/evidence/WO-999/decisions.md: source is not a contained regular file. Five remaining tasks were unrun, not failed executions.",
    "The fixture omitted the mandatory decision record. The initial five-versus-three expected path counts were consequently incomplete, not measured outcomes.",
    "After supplying the record and correcting those expectations, node scripts/harness.mjs bounded -- node --test --test-name-pattern='target final publish excludes' scripts/test-target-worktree-publish.mjs passed its one selected case, exit 0, in 7983 ms, ending 2026-10-24T19:46:27.456Z. This is a failure reproduction, not a substitute for the next complete gate."
  ],
  "rejected": [
    {"option": "Relax target-records' mandatory source check", "reason": "The missing input belongs to the new fixture; production correctly refuses an incomplete record set."},
    {"option": "Treat the focused pass as the handoff gate", "reason": "The executor procedure requires a fresh complete run after the repair."}
  ],
  "reopenWhen": "The complete run finds a final-publication failure after the corrected fixture reaches publication."
}
```

## WO-230-D008

<!-- integration refs/dotln/checkpoint/WO-230/6 -->

```json
{
  "id": "WO-230-D008",
  "date": "2026-10-24",
  "dispatch": "resume: final review; worktree integrate WO-230",
  "decision": "Integration took in nothing: local main, the main the helper fetched and the branch base are all 7e16d0d5b039ec5149a9fa32876626a3bcf52e5b, the branch carries no commit of its own, no authored conflict arose and no projection was resolved by hand. Carried-forward claims, judged in FINAL-001: the executor's complete review row at code identity 201d143894c00d9beaa6b4c24297b4e79d8110d0baba3d89a77ccaa594c10aaf (npm test -- --review recorded 2026-10-24T20:14:11.199Z, 39 required suites, 105 fresh tasks, none unrun or reused, exit 0, 1,558.394 s), which VER-001 consumed and judged, stands for the integrated tree, because the identity probe read the same value at entry, after the merge and after the affected checks and the focused case runs, and this review changes no code. Application target v0.96.1 remains current over the v0.96.0 baseline with no component-version collision: no package manifest, lockfile or packages source differs from main, the newest tag locally and at origin is v0.96.0, and of the tracked tree only the order's heading, the README's release line and the generated work-order index name v0.96.1. The selected evidence editions are unchanged inputs: no path any edition registers changed, and the authority, harness, feedback, artifact-identity and verification evidence checks each exit 0 at the reviewed tree, so no re-mint is owed. The sibling registry's v0.96.0 row and the untracked receipt of 2026-10-24T17:31:16.874Z are release-close bookkeeping carried in at activation, present in refs/dotln/checkpoint/WO-230/1 and in no commit of main. The integration's own regeneration changed only this record, its index row and the order's meter snapshot; every other tracked and untracked file matches the checkpoint's blob. The affected checks the helper printed pass at the reviewed tree, and the complete review row is reused rather than rerun.",
  "evidence": [
    "refs/dotln/checkpoint/WO-230/6",
    "base 7e16d0d5b039ec5149a9fa32876626a3bcf52e5b",
    "upstream 7e16d0d5b039ec5149a9fa32876626a3bcf52e5b",
    "release preparation: WO-230 target v0.96.1 remains current. Files changed: docs/evidence/WO-230/meta.json. Meter snapshot: docs/evidence/WO-230/meta.json, 4089 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity from scripts/lib/gate-evidence.mjs at entry (20:53Z), after the merge (21:00Z) and after the affected checks and the focused case runs: 201d143894c00d9beaa6b4c24297b4e79d8110d0baba3d89a77ccaa594c10aaf each time, the identity of the executor's passing npm test -- --review row (2026-10-24T20:14:11.199Z) and of VER-001's subject.",
    "git ls-remote origin refs/heads/main and git rev-parse origin/main main HEAD: 7e16d0d5b039ec5149a9fa32876626a3bcf52e5b each; git ls-remote --tags origin and git tag -l: newest v0.96.0 in both; grep -rl v0.96.1 over docs/work-orders, README.md and docs/siblings names the order, the generated index and README.md only.",
    "git diff --stat main over package.json, package-lock.json, packages, .claude and .agents is empty and git ls-files --others there lists nothing: no dependency, component version or role text changed.",
    "A temporary-index write-tree of the working tree compared with refs/dotln/checkpoint/WO-230/6: 7,325 entries; only docs/evidence/WO-230/decisions.md (this record), docs/evidence/WO-230/meta.json (the meter snapshot) and docs/lineage/decisions-index.md (this record's row) differ; nothing added or missing.",
    "The sibling receipt docs/evidence/siblings/DotLn-Enterprise-Starter/2026-10-24T17-31-16-874Z.json is a blob of refs/dotln/checkpoint/WO-230/1, the docs/siblings changes are in that checkpoint, and git log main over the receipt's path is empty.",
    "Affected checks at the reviewed tree, each exit 0 under node scripts/harness.mjs bounded: npm run publication:check (255 of 255 product headings indexed, 3 identical claim links per voice, 29 and 45 linked source sections match, both editions current); node scripts/harness.mjs check (35 generated surfaces; local-terms list present); npm run release -- check-surfaces --local (license surfaces and the seven package publish refusals as expected); npm run meta -- --check (the boarded cold-start and sequence advisories, 0 reopen candidates); git diff --check; npm run format:check; node scripts/authority-evidence.mjs --check; node scripts/harness-evidence.mjs --check; node scripts/feedback-evidence.mjs --check; node scripts/artifact-identity-evidence.mjs --check; node scripts/verification-evidence.mjs --check.",
    "The ignored intake (3 files) was archived before the merge with bash scripts/backup-intake.sh into the session scratch directory as DotLn-wo230-intake-20261024T205803Z.zip, and the helper verified the archive against the current intake."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-24. Original base: `7e16d0d5b039ec5149a9fa32876626a3bcf52e5b`.
Fetched main: `7e16d0d5b039ec5149a9fa32876626a3bcf52e5b`. Checkpoint: `refs/dotln/checkpoint/WO-230/6`.
Named stash retained: `35a67fe3ad288771e57859652b323dd7c9aaf411` (WO-230 integrate 2026-10-24).
Resolved projections: none.
Release preparation: WO-230 target v0.96.1 remains current. Files changed: docs/evidence/WO-230/meta.json. Meter snapshot: docs/evidence/WO-230/meta.json, 4089 bytes. Tag observation: local snapshot only.
Carried-forward claims: judged in [FINAL-001](../../final-reviews/WO-230/FINAL-001.md); the executor's complete review row at code identity `201d143894c00d9beaa6b4c24297b4e79d8110d0baba3d89a77ccaa594c10aaf` stands for the integrated tree, v0.96.1 remains current with no component-version collision, and the selected editions and the sibling registry row are unchanged evidence inputs. Acceptance: FINAL-001's verdict, recorded by `final-review-result`.
Authored conflicts observed: none.
Affected checks: run at the reviewed tree by the final review, each exit 0 (publication check with both editions current, harness check 35 surfaces, release surfaces, meta check with the boarded advisories, whitespace, formatting and the five edition checks); the complete review row at the unchanged identity is reused.

## WO-230-D009 — Final review: pass at the integrated identity; the three matched register rows stay as they are

```json
{
  "id": "WO-230-D009",
  "date": "2026-10-24",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes all seven criteria at code identity 201d143894c00d9beaa6b4c24297b4e79d8110d0baba3d89a77ccaa594c10aaf, the identity the executor handed off, VER-001 judged and integration kept, and lists no finding of its own. The three pending register rows the touching query matches keep their dispositions. FUP-1b94e79e02e54e70 (WO-227-D026: the publish refusal for a malformed private list names no line) names scripts/lib/target-publish.mjs in its reopening clause and this order edits that file, but the edit is the described-base helper and its three call sites; lintArtifacts, the local-terms read and the local-terms.configuration refusal are untouched, so the seam the row waits on was not opened, no operator met the refusal, and a repair at final review would move the code identity and owe a fresh complete run and re-verification for a change the order never cited and whose rules are a non-goal (WO-227); the row stays deferred for the next order that edits the outward lint's refusal path. FUP-0654a636ac6dfd12 (a worktree start advisory on a declared base behind the base branch) and FUP-f12aae31bceb9b69 (the episode form's described base) are this order's own known issues, deferred by the filing pass with reopening conditions that have not occurred: no instance has activated a second order on a stale base after this order, and no resident episode has integrated a later base-branch commit before publication. Receipt 054's five known issues are judged: criterion 1's condition did not occur (VER-001's probe A advanced the base branch past the subject's merge base, and the table came from the merge base with the fetched head's file named nowhere; the source reads git merge-base of the subject and the fetched commit, never the fetched commit itself); criterion 5's condition did not occur for an unrelated fetched base (probe B kept the activation base under today's text, the source's fallback whenever the single merge base is not a descendant of it), and the criss-cross case, several commits from merge-base --all, stays unprobed and is recorded as untested; criterion 4's condition cannot have occurred because no live publish ran, by the order's evidence gate; criterion 6's divergence between the advisory and the publish-time lint under non-default roots was not observed, the relocated-roots case asserting the advisory alone while the lint's moved-record exemption is unchanged; criterion 7's condition did not occur, the harness evidence check printing the standing cold-start advisories at the same 29,484 and 29,584 bytes with delta 0 and the harness check passing. VER-001's observation that an unchanged tree now prepares a draft commit and records one DraftPrepared row before the fetch and the no-change refusal is accepted as an observation and not a finding: criterion 4 requires the prepared work to exist before the fetch, criterion 3 requires the no-change check to compare against the described base that only the fetch supplies, an early check against the activation base would wrongly refuse a subject that reverts later base-branch content, nothing is pushed, the ref is overwritten by the next preparation and the latest row governs the retry; the refusal text is main's. The sibling registry's v0.96.0 row and receipt land with this order's records, as earlier orders' did.",
  "evidence": [
    "docs/control/orders/WO-230.jsonl: WorkOrderActivated 2026-10-24T18:56:51.768Z, ImplementationReady 20:18:56.786Z (codex-cli 0.164.0, gpt-6-astra, max), VerificationCompleted 20:50:04.095Z (claude-code 2.1.310, claude-opus-5-5, xhigh, verdict pass), FinalReviewRequested 20:51:08.680Z; canonical status at entry: phase final-review, VER-001 pass, FINAL-001 allocated, no waiver, correction, withdrawal or override record; WO-227 and WO-221 met by close, WO-080 reference-only.",
    "docs/evidence/WO-230/gate-runs.json: two failed complete attempts (19:19:11.265Z, work-orders-fixtures; 19:43:57.598Z, the new final-publish case) and the passing review row at code identity 201d143894c00d9beaa6b4c24297b4e79d8110d0baba3d89a77ccaa594c10aaf recorded 20:14:11.199Z (39 required suites, 105 fresh tasks, none unrun or reused, exit 0, 1,558.394 s); gateCodeIdentity at the reviewed tree reads the same identity at entry, after the integration and after every check this review ran.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern=<the six WO-230 case names> scripts/test-target-worktree-publish.mjs at the integrated tree: 6 tests, 6 pass, 0 fail, 31.1 s; -- node --test --test-name-pattern='described base adds activation context' scripts/test-github-body.mjs: 1 pass; -- node scripts/test-plan-refutation.mjs --fixtures-only: exit 0 in 52.4 s with both record-roots arms (relocated=false and relocated=true) passing and the index and history pages current.",
    "scripts/lib/target-publish.mjs at the integrated tree: describedTargetBase at lines 833 to 861 (the descent refusal 836 to 841, the fetch 843 to 849, git merge-base 850, the ancestor fallback 853 to 859); its call sites at 1101 (the same-tree draft, with the direct-child shortcut to 1128), 1193 (the prepared draft, after the DraftPrepared row at 1168 to 1191) and 1411 (the final publish, with the described-base refusal and the three reads to 1468); git diff main -- scripts/lib/target-publish.mjs touches no hunk in lintArtifacts or the local-terms path.",
    "npm run plan -- followups --touching at the reviewed tree: register revision 220ba0a2d241b77361433b2334a75d779a1ffa9f9a590f35a0d985293cddfb6e, 31 paths, 186 pending, 3 matched: FUP-0654a636ac6dfd12 deferred, FUP-1b94e79e02e54e70 deferred, FUP-f12aae31bceb9b69 deferred.",
    "docs/planning/refutations/2026-10-24-planning-b4ff901f3d0907a0-054.json: WO-230 aligned-with-findings with known issues on criteria 1, 4, 5, 6 and 7; docs/evidence/WO-230/verification-001-evidence.json: probe A (merge base behind the fetched head: one row, no beyond.txt, activation clause), probe B (unrelated fetched base: activation base, no clause, no refusal), probe D (unchanged tree offline then online: the fetch refusal, one DraftPrepared row, then the no-change refusal, 0 forge calls).",
    "node scripts/harness-evidence.mjs --check at the reviewed tree: the advisory coldStartBytes.executor=29484 > 29246 and coldStartBytes.reviewer=29584 > 28884, unchanged from main; node scripts/harness.mjs check: 35 generated surfaces, exit 0; npm run meta -- --check: 5 budget breaches (the standing advisories), 0 reopen candidates.",
    "git ls-tree refs/dotln/checkpoint/WO-230/1 -- docs/evidence/siblings/DotLn-Enterprise-Starter/2026-10-24T17-31-16-874Z.json names the blob; git diff --stat main refs/dotln/checkpoint/WO-230/1 -- docs/siblings docs/evidence/siblings lists the three files; git log main over the receipt path is empty.",
    "git diff main --name-only and git ls-files --others --exclude-standard screened for home paths, account names, e-mail addresses and credential shapes: no match; the fixtures' remotes are the synthetic dotln-fixture forge."
  ],
  "rejected": [
    {
      "option": "Settle or take FUP-1b94e79e02e54e70 in this review",
      "reason": "The row's seam, the local-terms refusal wording in lintArtifacts, is untouched by the diff and its rules are the order's non-goal; a repair here would move the code identity and owe a fresh complete run and re-verification for an uncited change."
    },
    {
      "option": "List VER-001's fetch-first observation as a finding",
      "reason": "It breaks no criterion and no behavior main had beyond the residue of a prepared commit and one event under a refusal whose order the criteria themselves fix; a prepared draft before the fetch is what criterion 4 requires."
    },
    {
      "option": "Probe the criss-cross merge-base case here",
      "reason": "No criterion names it, the implementation's fallback (the activation base whenever the single merge base does not descend from it) is read in the source, and the receipt's reopening condition is a fixture or live publish that has not occurred; recorded as untested."
    },
    {
      "option": "Treat the sibling registry's new row and receipt as a finding",
      "reason": "Release-close bookkeeping carried in at activation, in checkpoint 1 and in no commit of main; it lands with the records as WO-227's and WO-080's did."
    }
  ],
  "reopenWhen": "A publish or fixture meets one of receipt 054's reopening conditions (a table computed from the fetched head rather than the merge base; a non-descending or multiple merge base that refuses with new text or describes a base other than the activation base; a fetch refused while a push to the same remote succeeds; the advisory and the publish-time lint disagreeing under non-default record roots); an operator meets local-terms.configuration on a publish and cannot locate the line; an instance activates a second order on a stale base; or a resident episode integrates a later base-branch commit before publication."
}
```
