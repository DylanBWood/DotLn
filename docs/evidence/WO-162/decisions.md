# WO-162 decisions

## WO-162-D001

```json
{
  "id": "WO-162-D001",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Consolidate helpers within the scripts unit and compiler, preserving caller-specific arguments, return values and diagnostics. Reconstruct the adoption inventory from the activation checkout because the cited planning section contains aggregate counts rather than its promised path table.",
  "evidence": [
    "docs/work-orders/WO-162-in-unit-helper-reuse.md requires byte-identical fixture outputs, stored digests and errors and explicitly retains semantic divergences.",
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md section 8 contains aggregate counts and divergence names, without the cited file-by-file table.",
    "Entry inspection finds helper copies in WO-163-named files, including release.mjs, lib/harness-prune.mjs and authority-mutation-evidence.mjs; the operator has been asked to resolve that overlap before those files are edited.",
    "Before-edit scripts, compiler sources/tests/build output and corpus were preserved in the dispatch scratch directory for differential checks."
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves the repeated helper maintenance the operator selected this order to remove." },
    { "option": "Cross-unit utility package or broad semantic unification", "reason": "Adds coupling and changes behavior outside the selected scope." },
    { "option": "Treat the aggregate planning counts as an exact current inventory", "reason": "The cited table is absent and the activation source has additional variants and subprocess result consumers." }
  ],
  "reopenWhen": "Differential evidence reveals observable behavior drift or a helper requires more abstraction than the repeated implementation it replaces."
}
```

This maintenance reduces repeated changes in the machinery used by the
source-to-deliverable loop. Keeping each caller's semantics avoids policy
resistance; one writer, one read-only reviewer and existing checks bound commons
cost and escalation. Before/after byte comparisons protect against drift, rule
beating and optimizing copy counts instead of correctness. Existing helpers win
on demonstrated equivalence, not prior investment (success to the successful).
Imports remove recurring manual synchronization (shifting the burden). Naive
Interventionism favors a reversible in-unit diff and retains the documented
divergences. NoOp leaves the selected duplication unchanged.

## WO-162-D002

```json
{
  "id": "WO-162-D002",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the existing test workflow; decline a separate economy experiment.",
  "evidence": ["WO-162 already requires a differential regression and both existing gates."],
  "rejected": [{ "option": "Add a test-workflow experiment", "reason": "Adds an independent variable without measured duplicate work." }],
  "question": "Would a separate process-economy experiment improve this helper consolidation beyond its required differential regression?",
  "alternatives": ["Use the existing test workflow and required compatibility regression", "Experiment with a new test batching workflow"],
  "observation": "The order already requires broad compatibility evidence, including fixture bytes, stored digests and the product and document gates; a second workflow would introduce an additional variable.",
  "budget": { "wallSeconds": 60 },
  "execution": "declined",
  "reason": "The required regression supplies the useful bounded probe; no additional economy experiment is justified.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["No experiment commands run"], "source": "Actor-attested declined experiment; deliberation cost is not separately measured" },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["Existing required checks retained"], "summary": "No process improvement claimed." },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "reopenWhen": "Measured duplicate test work shows a bounded workflow change worth a later order's experiment."
}
```

## WO-162-D003

```json
{
  "id": "WO-162-D003",
  "date": "2026-09-27",
  "dispatch": "resume: next; operator scope clarification",
  "decision": "Permit helper-only edits in files also named by WO-163. Both orders may proceed in separate worktrees; final-review integration resolves their overlapping edits. Preserve all helper behavior and keep WO-163 file moves and retirements in that order.",
  "evidence": [
    "Operator answered: Continue WO-162 with limited overlap (Recommended).",
    "The activation checkout contains Git, digest and JSON helper copies in release.mjs, lib/harness-prune.mjs, authority-mutation-evidence.mjs and other WO-163-named files, contradicting the original disjoint-file premise."
  ],
  "rejected": [
    {
      "option": "Wait for WO-163 or omit its files",
      "reason": "The operator authorized continuing this order with limited overlap."
    }
  ],
  "reopenWhen": "An overlapping edit requires a semantic change or a file move, rather than the authorized helper adoption."
}
```

## WO-162-D004

```json
{
  "id": "WO-162-D004",
  "date": "2026-09-27",
  "dispatch": "resume: next; read-only divergence review checked against named callers",
  "decision": "Keep the three containment helpers separate.",
  "evidence": [
    "Line numbers are this order's working tree. packages/beacons/src/beacon-io.mjs:30-36 counts the root itself as inside. Its one call site is validateBeaconDirectory (:81). A beacon directory equal to the repository root enters the repository branch; any failure of the ignore check maps to the gitignored refusal (:102-106). In scratch the ignore check failed for the root, so the root was refused without its ignore rules being evaluated. validateBeaconDirectory is reached from the skeleton CLI's --beacons argument (cli.ts:34-61 through beacon-fs.ts:43), from worker-demo.ts and from control-beacon-fs.mjs.",
    "packages/skeleton/src/source-change-environment.ts:7-15 requires a strict descendant through path.relative; root equality is false. validateSourceChangeEnvironment uses it for the mount under worktreeParent (:45), mount and launchpad overlap (:47-48, equality at :46) and the commit message under the mount (:60). Its call sites in src are worker-transport.ts:593 and the exported sourceChangeProfile (:97), whose in-repository callers are tests.",
    "packages/skeleton/src/source-change-worktree.ts:47-48 is a string prefix with the separator appended; equality is compared separately (:126, :129). Its one caller is the SourceChangeWorktree constructor (:125-131), constructed only at source-change-host.ts:145. canonicalDirectory (:49-57) accepts a path that JavaScript realpathSync returns unchanged. launchpad and requested.repo are also compared with Git's toplevel (:87-94); parent is not.",
    "A fourth containment check, outside the three this order names, judges the same paths: worker-protocol.ts:330-331 is a string prefix used at :345-349 inside validateWriterRequest, which the SourceChangeHost constructor runs (source-change-host.ts:164). It is string-only by design (:352) and unchanged here.",
    "Read-only scratch edge table, 2026-09-27: a sibling sharing a name prefix is outside under the three named helpers, so no sibling-prefix escape was found. All three compare strings case-sensitively.",
    "Scratch observations on this host, one case-insensitive APFS volume, 2026-09-27: realpathSync returned the letter case and the volume alias it was given, and at the canonical-path check alone it also returned a decomposed Unicode spelling unchanged. realpathSync.native returned the stored letter case and returned a volume alias unchanged.",
    "A latent defect reproduces on that host with the built module against scratch fixture repositories (VER-001 F1; reproduced again during resume: fix). With parent set to a lowercase spelling of the launchpad path, the constructor accepts, create() runs git worktree add inside the launchpad checkout, verify() throws source-change worktree identity drift, and the worktree directory, its registration and the new branch remain. A case-variant parent that overlaps nothing and a volume alias of the launchpad path leave the same residue. validateSourceChangeEnvironment accepts a mount inside the launchpad when launchpadCheckout is spelled in a case variant, and validateBeaconDirectory, called directly, accepts case-variant spellings that skip its gitignore and docs/intake refusals. The defect predates this order, whose diff touches none of these files.",
    "Reachability by source trace. Source-change guard: a search for worktreeParent across scripts and packages finds no reader of the launchpad setting repositories.<id>.worktreeParent (scripts/lib/config.mjs:351-369) outside the parser and tests; a consumer that forwards the whole repository entry was not traced. SourceChangeHost is constructed by portfolio-host.ts:192 and repair-host.ts:177 from caller-supplied options, and every in-repository caller found is a test or a test script that derives the parent from a temporary directory. packages/skeleton/README.md documents direct construction with a caller-supplied worktreeParent, so a caller outside this repository can reach it; whether one passes a variant spelling is unknown. Beacon guard: reachable today from the CLI's --beacons argument; the variant spellings were not driven through the CLI. Case-sensitive filesystems, Linux and Windows are untested."
  ],
  "rejected": [
    {
      "option": "Merge the similarly named helpers",
      "reason": "Their callers depend on distinct edge behavior; this order requires preservation."
    },
    {
      "option": "Fix the variant-spelling defect in this order",
      "reason": "The order's Design and operator-review assumption 2 make a latent defect a follow-up; both source-change files are registered evidence sources outside this diff."
    }
  ],
  "reopenWhen": "A valid caller demonstrates an escaping sibling or needs different root-equality semantics, or the follow-up changes what the source-change guard accepts as a canonical path.",
  "followup": "Refuse source-change and beacon paths whose spelling differs from the filesystem's identity for that directory (letter case, volume alias, and Unicode form, which was observed only at the canonical-path check) before any containment comparison, and create no worktree before its identity is verified. In scratch on one APFS host realpathSync.native returned a volume alias unchanged, so it is not a sufficient remedy alone. Affected: source-change-worktree.ts, source-change-environment.ts, beacon-io.mjs; worker-protocol.ts:330-349 is a string-only check on the same paths, listed for awareness. Checks: variant-spelled parent, launchpad and beacon inputs refuse and leave no worktree, branch or registration; a canonical disjoint parent still succeeds. Priority: medium. The beacon guard is reachable from the skeleton CLI's --beacons argument; no in-repository production caller constructs SourceChangeHost."
}
```

## WO-162-D005

```json
{
  "id": "WO-162-D005",
  "date": "2026-09-27",
  "dispatch": "resume: next; read-only divergence review checked against named callers",
  "decision": "Keep insertion-order equality in planning continuation and canonical equality in receipts and target publication.",
  "evidence": [
    "Line numbers are this order's working tree. scripts/lib/plan-continuation.mjs:16 compares JSON.stringify output, so key order counts. Its four calls are in checkPlanContinuation. :263 compares every input row except order paths, capability rows and, conditionally, the cost-table and goal-review rows (filter at :254-261), and refuses on a difference. :274 compares four goal-review strings, where key order cannot apply. :288 runs only when the judged subject has a goal review; a cost-table difference then records a cost-observation-metadata update and does not refuse. Without a goal review the cost-table row is a fixed input compared at :263. :467 compares the capability inputs; a difference must be explained by appended dated reassessment sections or it refuses, except that the committed comparison (plan-receipts.mjs:1602-1603) falls back to capabilityHistoryRepair (:474-486), which admits a pending workspace repair.",
    "Input rows are built as name then hash by plan-subject.mjs. The cost table is parsed from cost-table.json when that file is present (plan-subject.mjs:542) and is otherwise the three-key object plan-subject.mjs builds (:481-485). scripts/meta.mjs:108-120 writes the file by spreading that object first and appending observedAt, subjectRevision, rows and traps, so its key order comes from both modules. The judged side is the latest planning receipt's stored subject.",
    "scripts/lib/plan-receipts.mjs:67 sorts keys before comparing. Every call refuses on a difference through check (:68-70). Callers: :226 the receipt subject against the subject rebuilt from committed sources; :236 the stored result against the validated result; :240 stored holds against recomputed hold addresses; :573 a carried order verdict against the prior judgment, after applyPlanDispositions for a goal-review receipt; :680 a prior hold, satisfied by any one exactly repeated hold or by an override.",
    "scripts/lib/target-publish.mjs:42 uses the compiler's canonicalStringify, which sorts keys. Every call refuses on a difference. Callers: :232 each observed event payload against the first; :247 the effect receipt's observation against the decoded event; :281-283 the dispatched artifact identity, WorkOrder and authority envelope against the writer compilation.",
    "Read-only scratch probe, 2026-09-27: objects differing only in key order compare unequal under the continuation helper and equal under the other two. The stored planning receipts read during that probe hold input rows as name then hash, so no producer causing an incorrect refusal was established. The subject builder was not run against the live repository. Three further helpers named same exist in the skeleton, outside the scripts unit and this order's list."
  ],
  "rejected": [
    {
      "option": "Merge the similarly named helpers",
      "reason": "Their callers depend on distinct edge behavior; this order requires preservation."
    }
  ],
  "reopenWhen": "A current producer emits equivalent objects in a different key order and continuation refuses them."
}
```

## WO-162-D006

```json
{
  "id": "WO-162-D006",
  "date": "2026-09-27",
  "dispatch": "resume: next; read-only divergence review checked against named callers",
  "decision": "Keep domain-specific text validators and nominate the evidenced handoff/mission contract mismatch without changing acceptance semantics in this order.",
  "evidence": [
    "Scope: validators named text in scripts, and validators named line, body or text in the five skeleton protocol files and handoff-contract.ts. Line numbers are this order's working tree. Control-character checks under other names exist and are outside this order's list, for example offRampText in scripts/lib/control.mjs, missionPath in mission-check-protocol.ts:333-341 (rejects C0, backslash and colon; accepts DEL, C1 and the Unicode separators) and checks in portfolio.ts, source-change-state.ts, work-candidate.ts and presence-signals.ts.",
    "Scripts has five validators named text: three control-character classes and one validator with none, which is the order's four. scripts/lib/meta.mjs:89 (experiment fields) checks only for non-blank text. derived-contract.mjs:25-28 rejects C0 except tab, newline and carriage return, and DEL; its compiled WorkOrder scalars and list entries accept multi-line text, while its provenance caller (:33-34) additionally rejects carriage return, newline, U+2028 and U+2029. adjacent-queue.mjs:30-34 (spec fields, reasons, statements, targets, observations, results) and planning-followups.mjs:35-39 (keys, revision and disposition fields, touching paths) reject C0 and DEL. plan-receipts.mjs:71-75 (pass heading, episode, disposition, actor and reason fields) also rejects C1, U+2028 and U+2029. No comment at these definitions states why the classes differ.",
    "The skeleton protocol files have four validators named line or body, with three classes. packages/skeleton/src/worker-protocol.ts:73-77 line (summaries, candidate fields, model, test command, branch) rejects C0, DEL, U+2028 and U+2029, accepts C1, and accepts whitespace-only text because it checks length without trimming. plan-refutation-protocol.ts:151-155 line (reasons, per-order answers, evidence, reopening observations) and mission-check-protocol.ts:272-276 line (thesis heading and title, clause text, omitted decisions, finding reason) also reject C1 and reject whitespace-only text. mission-check-protocol.ts:277-280 body (thesis, exclusion, diff and decision text) rejects C0 except tab, newline and carriage return, and DEL, and accepts empty text. entropy-review-protocol.ts defines no class. verification-protocol.ts applies the compiler's verificationLine (packages/compiler/src/verification.ts:107-111), which has the worker-protocol class, accepts whitespace-only text and fixes its limit at 2000 characters.",
    "packages/skeleton/src/handoff-contract.ts:11-15 text (WorkOrder id, question, option id and label, evidence refs) rejects only C0 and DEL, a fourth class among these skeleton validators.",
    "Read-only executable probe: plain Choose scope passes assertHandoffQuestion and missionSubject; Choose plus U+0085 or U+2028 plus scope passes handoff and fails a mission objective clause with invalid-result: pinned clause shape. No production handoff-to-mission transfer was found; this is an interface mismatch, not an observed late production failure."
  ],
  "rejected": [
    {
      "option": "Merge the similarly named helpers",
      "reason": "Their callers depend on distinct edge behavior; this order requires preservation."
    }
  ],
  "reopenWhen": "An order introduces text transfer between these surfaces or a real accepted value is refused late.",
  "followup": "Decide acceptance of C1 and Unicode separators when text crosses handoff and mission interfaces; retain map candidate 2 and its observed-late-refusal reopening condition until a real transfer exists."
}
```

## WO-162-D007

```json
{
  "id": "WO-162-D007",
  "date": "2026-09-27",
  "dispatch": "resume: next; read-only divergence review checked against named callers",
  "decision": "Keep publication and GitHub-body fence parsers separate.",
  "evidence": [
    "check-publication.mjs recognizes top-level fences with at most three leading spaces for headings. github-body.mjs additionally handles list indentation and quote depth for prose profiling.",
    "scripts/test-github-body.mjs covers nested-list fences and top-level pseudo-fences; no latent defect was established."
  ],
  "rejected": [
    {
      "option": "Merge the similarly named helpers",
      "reason": "Their callers depend on distinct edge behavior; this order requires preservation."
    }
  ],
  "reopenWhen": "The same document under the same intended parsing contract yields conflicting visible prose or headings."
}
```

## WO-162-D008

```json
{
  "id": "WO-162-D008",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Keep sha256Hex implemented in the one new shared helpers module and re-export it beside sha256 from plan-subject. Foundational digest-only consumers import helpers directly. Add only the missing library files to isolated fixture copies.",
  "evidence": [
    "Importing plan-subject runs work-orders module initialization and findLaunchpad; a read-only probe with a missing DOTLN_LAUNCHPAD fails. The same import probe for helpers succeeds.",
    "test-harness, test-configuration-root and test-outward-lint copy selected scripts; their explicit fixture lists need the newly imported helpers/git/paths modules. Whole-library fixture copies already include them."
  ],
  "rejected": [
    {
      "option": "Import every digest through plan-subject",
      "reason": "Introduces launchpad discovery side effects and breaks copied fixtures that never need planning."
    },
    {
      "option": "Add another utility module",
      "reason": "The already-required helpers module supplies an import-safe home."
    }
  ],
  "reopenWhen": "The shared helpers gain import-time launchpad behavior or a consumer needs a narrower independent module."
}
```

## WO-162-D009

```json
{
  "id": "WO-162-D009",
  "date": "2026-09-27",
  "dispatch": "resume: next; local release preparation",
  "decision": "Assign application v0.52.9 over the local v0.52.8 tag snapshot and compiler 0.19.4 over 0.19.3 as compatible helper-only patches; update compiler dependency pins without bumping consumers.",
  "evidence": [
    "git tag --list with descending version order reports v0.52.8 as latest local application release.",
    "Only compiler source changes among the versioned application packages; normalize exports the two existing functions and compile imports them.",
    "release prepare initially refused the unassigned title; the executor skill and product 07 Discipline authorize completing the missing activation target."
  ],
  "rejected": [
    {
      "option": "Leave compiler version unchanged",
      "reason": "The selected order changes registered compiler source."
    },
    {
      "option": "Bump skeleton or console implementation versions",
      "reason": "Those packages receive dependency-pin updates only."
    }
  ],
  "reopenWhen": "Final-review integration sees a newer release or compatibility impact changes."
}
```

## WO-162-D010

```json
{
  "id": "WO-162-D010",
  "date": "2026-09-27",
  "dispatch": "resume: next; dependency checks",
  "decision": "Register the new shared helper, Git and paths dependencies consumed by evidence tools. Retain raw-result and execFileSync Git adapters for callers that depend on process status, binary output or native error metadata.",
  "evidence": [
    "authority-evidence --write initially refused the newly imported git/helpers modules; scripts/lib/evidence-sources.mjs lists runtime import dependencies and requires registration or a justified exclusion.",
    "The planning assumption that scripts were unregistered was incorrect: authority-evidence.mjs, lib/harness.mjs and lib/paths.mjs are registered sources. New common imports affect deterministic evidence registration; none is a live feedback source.",
    "The differential regression preserves native exec errors, raw status/output, bytes and caller-supplied flags. Checked wrappers use runGit; one-off status observers use shared spawnGit/execGit with unchanged argv."
  ],
  "rejected": [
    {
      "option": "Exclude helper implementation from source registration",
      "reason": "The evidence tools now consume those implementations, so exclusion would hide a behavioral dependency."
    },
    {
      "option": "Force every Git caller to return trimmed text",
      "reason": "Would change process-result and binary consumers and discard required error metadata."
    }
  ],
  "reopenWhen": "An adapter no longer has a caller needing its distinct output or error semantics."
}
```

## WO-162-D011

```json
{
  "id": "WO-162-D011",
  "date": "2026-09-27",
  "dispatch": "resume: next; final differential evidence",
  "decision": "Judge helper compatibility with identical activation inputs and separately record release-derived identity and console-fixture refreshes. Do not claim every stored fixture file stayed unchanged.",
  "evidence": [
    "The strengthened test-helper-reuse regression reads immutable activation fixture bytes and compares all 31 writer declarations, including two assigned rather than const-declared writers, across 99 inputs. Modes, bytes and SHA-256 tree records agree.",
    "fixture-digests.json compares the 177 committed fixture-tree paths at the activation baseline, meaning every path with a fixtures/ directory segment plus everything under corpus/, with the working tree: 173 are byte-identical and none is missing. It also lists the working tree's tracked and untracked paths of the same set and finds none added. Four changed: packages/console/fixtures/expected/selfhost.html, expected/selfhost.json, expected/selfhost.txt and manifest.json. Console implementation source is unchanged.",
    "The cause is the required compiler label. compile.ts and normalize.ts changed under packages/compiler/src, so the release-surface check (scripts/release.mjs:552) requires a version different from the previous release's, and packages/compiler/test/artifact-identity.test.ts:295 binds COMPILER_PACKAGE_VERSION to the manifest version; the label moved from 0.19.3 to 0.19.4. The feedback policy hash includes that label (packages/compiler/src/feedback.ts:205-219), and the three expected self-host outputs record that hash. The console rejects a maturity report whose policy hash differs from the compiled one (packages/console/src/builds.ts:266-271), so record-current-selfhost selected feedback edition WO-162/feedback-001. That changed the edition labels and evidence references in the three outputs, and in manifest.json the maturity path, reference and recorded digest (manifest.json:84-87), two labels and the capture note. manifest.json records no policy hash. In a scratch copy, the current code under the 0.19.3 label matches all five baseline console cases with console-fixtures.mjs --check, so the helper refactor contributes no fixture difference.",
    "compiler-parity.json records full equality before the package bump. compiler-release-parity.json proves the final Seiri, entropy and authority results differ only at artifactIdentity.compilerPackageVersion, from 0.19.3 to 0.19.4; program and semantic hashes stay equal.",
    "Criterion 5's literal all-fixture wording does not describe the four derived refreshes. Its behavior-preservation claim is evidenced at fixed inputs; the required release and evidence refresh changes those four inputs/outputs explicitly. No waiver or unqualified all-files-unchanged claim is made.",
    "Final source scanning found missed inline serializers, two remaining scoped writer declarations, two assigned writers and two assigned Git wrappers. The first product gate was stopped with the canonical evidence command before these corrections; it recorded no passing check."
  ],
  "rejected": [
    {
      "option": "Feed current fixture bytes to both helpers and call that unchanged stored fixtures",
      "reason": "Would hide changed evidence inputs; the regression now pins baseline bytes and the separate digest inventory exposes the four changes."
    },
    {
      "option": "Suppress release identity updates to retain old self-host projections",
      "reason": "Would leave the changed compiler package and selected evidence inconsistent with release preparation."
    }
  ],
  "reopenWhen": "A fixed-input output, diagnostic, mode or semantic digest differs, or a derived fixture change cannot be accounted for by the recorded release/evidence inputs."
}
```

## WO-162-D012

```json
{
  "id": "WO-162-D012",
  "date": "2026-09-27",
  "dispatch": "resume: fix; operator chose to amend criterion 5 for VER-001 F3",
  "decision": "Amend criterion 5: four console self-host fixture files may follow the compiler label that the changed compiler source requires. The three expected outputs record the feedback policy hash, which includes that label; manifest.json records the matching feedback edition and its maturity digest. Every other fixture path and recorded digest stays byte-identical, and the criterion's sha256Hex clause is unchanged. The order's release classification, objective and Design digest bullet keep their text and are read with the same four-file exception.",
  "evidence": [
    "Operator selected Amend criterion 5 now during resume: fix on 2026-09-27, over the offered alternative of a waiver recorded at verification.",
    "VER-001 F3 judged criterion 5 unmet as written and routed it to an operator waiver or amendment, not a code repair.",
    "fixture-digests.json: 177 committed fixture-tree paths, 173 byte-identical, four changed, none missing and none added. D011 records the cause chain with its source lines.",
    "Scratch reproduction during resume: fix: the current code under the 0.19.3 label matches all five baseline console cases; under 0.19.4 the baseline self-host fixtures fail and the working-tree fixtures match."
  ],
  "rejected": [
    {
      "option": "Waive criterion 5 at verification",
      "reason": "The operator chose amendment. The order's executor cannot record a waiver."
    },
    {
      "option": "Return the compiler label to 0.19.3",
      "reason": "The release-surface check fails a changed compiler source tree that keeps its previous version."
    },
    {
      "option": "NoOp",
      "reason": "Criteria 5 and 6 cannot both hold as written, so every later verification would fail on the same line."
    }
  ],
  "reopenWhen": "A fixture path outside the four named files differs from the activation baseline, or one of the four differs in a field that the compiler label and the selected feedback edition do not determine."
}
```

The amendment states the standard the order can actually meet, so
verification judges behavior preservation rather than a line two gates make
impossible (policy resistance). It names four files and one cause, so it does
not normalize unexplained fixture drift (drift to low performance), and the
177-path comparison still has to pass for every other path (rule beating).
The remaining lenses are immaterial to a one-criterion text change. NoOp
repeats the same failure at each verification.

## WO-162-D013

```json
{
  "id": "WO-162-D013",
  "date": "2026-09-27",
  "dispatch": "resume: fix; operator directed recording the executor's halt for guidance as a failure",
  "kind": "correction",
  "decision": "Record the executor's blocking question about criterion 5, and the wait that followed it, as a process failure of this repair. A required version change and the refreshes it mechanically determines are routine release bookkeeping: the executor decides them within its authority, records the decision and keeps working.",
  "misread": "The executor read VER-001's route for F3, an operator waiver or amendment, as a reason to stop the operator with a blocking question. The four changed fixtures were a mechanical consequence of the compiler label the release gates require, and the executor already held the evidence for that. It then held every repository write from the dispatch at 01:34Z until 02:08Z while background evidence agents ran, although three of the four had reported by 01:55Z and most edits did not depend on the fourth.",
  "meant": "The operator asked what the executor needed and then directed that the question be recorded as a failure: asking whether the consequence of a version-number change is acceptable is outside what the operator considers reasonable grounds to halt for guidance. The operator also asked when the work would start. An executor is expected to do the repair, state its recommendation in the record and leave a genuine operator decision for the handoff instead of stopping the operator mid-dispatch.",
  "changed": "The operator's selected answer is recorded as D012. No further question was put to the operator in this repair; routine matters were decided and recorded by the executor. Writes began at 02:08Z from the three reported results without waiting for the fourth agent.",
  "evidence": [
    "Session record, 2026-09-28T01:38Z to 02:07Z: the blocking question, the operator's selected answer, the operator's direction to record a failure, and the operator's later question about when work would start.",
    "Workflow journal for the evidence run: three result rows written by 01:55Z; the first repository edit of this repair was made after 02:08Z.",
    "docs/verifications/WO-162/VER-001.md records the verifier's own process failure in the same order: an operator question was taken as an instruction. This is the second operator-attention failure in WO-162."
  ],
  "rejected": [
    {
      "option": "Treat the question as justified because VER-001 named an operator decision",
      "reason": "The route named who records a waiver or amendment. It did not require stopping the operator during the repair, and the recommendation could have been stated in the handoff."
    },
    {
      "option": "Record nothing beyond the chat acknowledgement",
      "reason": "The operator directed a record, and an unrecorded failure is rediscovered by the next dispatch."
    }
  ],
  "reopenWhen": "An executor or verifier in a later order stops the operator for a decision that release bookkeeping or recorded evidence already settles, or holds independent work while waiting on background agents."
}
```

This failure is shifting the burden to the intervenor: the operator had to
supply attention the machinery and the executor's own evidence already
covered. It also consumed shared operator attention without accounting for it
(tragedy of the commons).

## WO-162-D014

```json
{
  "id": "WO-162-D014",
  "date": "2026-09-27",
  "dispatch": "resume: fix; repair of VER-001 F1, F2 and the F3 documentation overclaims",
  "kind": "correction",
  "decision": "Correct D004, D005, D006 and D011 in place, name the variant-spelling containment defect as D004's follow-up, and correct the same claims in the fixture comparison, the roadmap and the implementation report. No containment, equality, text or fence definition changes in this order.",
  "misread": "D004 said source-change-worktree.ts compares canonical roots and that no reachable defect was established; its canonical check keeps the spelling it is given, and a defect reproduces. D004 also said the beacon helper lets ignore rules be enforced for a repository-root beacon; the root is refused because the ignore check fails, not because rules were evaluated. D005 said every compared value is generated in stable key order by plan-subject.mjs and omitted plan-continuation.mjs:467 and plan-receipts.mjs:226 and :573. D006 said the classes differ intentionally and named no skeleton protocol validator. D011, the fixture comparison and the roadmap described 97 paths as the whole fixture inventory and gave the evidence refresh, not the compiler label, as the cause.",
  "meant": "Criterion 7 requires one decision per divergence that names the dependent callers and names any latent defect as a follow-up. Criterion 5's evidence must describe the measured inventory and the true cause.",
  "changed": "D004 now states the three helpers' observed behavior, the reproduced defect, its reachability and its limits, and carries the follow-up. D005 names all fourteen call sites of the three equality helpers, says which comparisons refuse, and states that the cost table's key order comes from both plan-subject.mjs and scripts/meta.mjs. D006 states its scope, names the five scripts validators and the four skeleton protocol validators with their classes, and drops the unsupported claim of intent. A read-only refutation of the first corrected text reported 27 problems; each was checked against source and corrected. D011, compare-fixtures.mjs, fixture-digests.json, docs/product/06-roadmap.md and implementation.md state 177 paths, 173 unchanged, four changed, and the compiler-label cause.",
  "evidence": [
    "docs/verifications/WO-162/VER-001.md findings F1, F2 and F3.",
    "Four read-only evidence agents during resume: fix, each working in its own scratch directory: executed reproductions of the containment defect against the built module, an executed edge table for the three containment helpers, executed probes of the equality helpers and the text validators, and a scratch copy that ran the console fixture check under both compiler labels.",
    "The executor read the cited source lines for the containment helpers, their constructors, the release-surface check, the artifact-identity test, the compiler feedback policy and the console maturity check before recording them.",
    "node docs/evidence/WO-162/compare-fixtures.mjs exits 0 with 177 rows, 173 unchanged and the four named console files changed."
  ],
  "rejected": [
    {
      "option": "Append corrections and leave the original evidence text in D004 to D006 and D011",
      "reason": "VER-001 requires the decisions themselves to state accurate evidence; a false safety premise left in place is read as accepted lineage."
    },
    {
      "option": "Fix the containment defect here",
      "reason": "The order's Design makes a latent defect a follow-up, and the affected files are registered evidence sources outside this diff."
    },
    {
      "option": "Keep the 97-path comparison and describe the other 80 paths in prose",
      "reason": "The script and its record would still assert a narrower inventory than the claim; widening the script makes the record and the claim the same measurement."
    }
  ],
  "reopenWhen": "Verification finds a caller of the named helpers or validators that these decisions omit, or a cited line that does not support its sentence."
}
```

Line numbers in D004 to D006 and D011 refer to this order's working tree;
final-review integration may shift them. Correcting the record in place
resists drift to low performance (a false premise becoming the baseline) and
shifting the burden (a reproduced defect left for a later reader). Success is
judged by whether each sentence is supported by its cited source, not by the
number of callers listed (rule beating, seeking the wrong goal). The changes
are documentary and reversible; NoOp leaves D004's false premise in the
decision record.

## WO-162-D015

```json
{
  "id": "WO-162-D015",
  "date": "2026-09-27",
  "dispatch": "resume: fix; disposition of VER-001 minor findings M1 to M6",
  "decision": "Take M1 and M4 where the change is a removal or a direct passthrough with the same arguments, correct M2, M3 and M5 as descriptions in the implementation report, and leave M6 and the release-fixture file's M4 sites unchanged.",
  "evidence": [
    "M1: a scan of the 99 changed source files against their baseline bytes found four imports this order left unused: createHash in scripts/probes/local-model-role-qualification.mjs, mkdirSync and writeFileSync in scripts/test-concurrent-control.mjs, and dirname in scripts/test-harness-probe.mjs. scripts/test-checkpoint.sh kept two unused execFileSync requires. All are removed. A fifth scan hit, spawnSync in scripts/probe-codex-effort.mjs, is used through a spread call and stays.",
    "M4: scripts/refute-plan.mjs passed raw: true with cwd: undefined, which overrode the first parameter; its two calls now use spawnGit with the same argv and encoding. scripts/test-runner.test.mjs called runGit with an undefined first parameter seven times; those calls now use execGit, which the file already imports, and none of them used its return value. This repair does not change scripts/test-release-fixtures.mjs, whose eleven runGit calls with an undefined first parameter are left as they are: every Git call in that file is a fixture call without a working directory, and converting them would remove runGit from a file whose local wrapper this order replaced.",
    "M6: scripts/lib/harness.mjs is a registered evidence source (scripts/lib/evidence-sources.mjs), and the authority edition binds a revision of its registered sources. Merging the two aliases of the helpers json export would change that source and require a new authority edition for a naming change with no behavior.",
    "Focused checks after the edits: node --check on each changed file; the code-identity case in scripts/test-runner.test.mjs passed; scripts/test-harness-probe.mjs passed 11 of 11; scripts/test-checkpoint.sh passed; authority-evidence.mjs --check exited 0. scripts/test-concurrent-control.mjs needs the release suite's fixture argument and runs inside the product gate."
  ],
  "rejected": [
    {
      "option": "Leave every minor finding",
      "reason": "The unused imports and dead parameters are residue of this order's own refactor."
    },
    {
      "option": "Merge the aliases in scripts/lib/harness.mjs",
      "reason": "A registered source change re-mints evidence for no behavior change."
    },
    {
      "option": "Rewrite scripts/test-helper-reuse.mjs to compare each file's adopter",
      "reason": "VER-001's adopter-level differentials already cover that gap; an accurate description of what the regression compares is the proportionate repair."
    }
  ],
  "reopenWhen": "An order edits scripts/lib/harness.mjs or scripts/test-release-fixtures.mjs for another reason and pays their checks anyway."
}
```

The cleanup removes residue without changing behavior, inside files this
order already changed (bounded boy-scout cleanup). Declining M6 avoids
spending an evidence edition on a rename (tragedy of the commons); the other
lenses are immaterial. NoOp leaves dead imports and parameters for the next
reader.

## WO-162-D016

```json
{
  "id": "WO-162-D016",
  "date": "2026-09-27",
  "dispatch": "resume: fix; executor error in binding the criterion 5 amendment, and its recovery",
  "kind": "correction",
  "decision": "Keep one amendment row for criterion 5, the one that binds the corrected D012 and the corrected order text, and remove the executor's own superseded, uncommitted row from the planning control log. D012 and D003 are bound by amendment rows and must not change again; a later correction to either is a new decision.",
  "misread": "The executor bound D012 with plan amend-order at 02:10Z, then edited D012 when the refutation showed its wording was wrong, and bound it again at 02:26Z. It assumed the later row replaced the earlier one. The planning check validates the decision binding of every amendment row, including superseded and withdrawn ones, and the withdrawal command validates the same binding, so no text of D012 could satisfy both rows and the check failed with execution amendment decision binding differs.",
  "meant": "A decision bound by an amendment row is immutable. The correction belonged in a new decision bound by a new row, with D012 left as first written.",
  "changed": "The first D012 row was removed from docs/control/plan-refutations.jsonl by hand. It was appended by this session and never committed; the 27 committed rows are untouched and the log still extends the committed bytes. The removed row's SHA-256 is e49b0700818e47eddec10d7b14334f6c9d75af071d84faafb93a988f75f41e27; it recorded order hash sha256:e37329cf3254d3ad78cd4c00ad1cdc31e6effaa0a76e2c919623957478f5fbe1 and decision hash sha256:b0edcd8ebf09d426d24b899639b49028d74ebbf8ba129203187e3488ed0683bc. The remaining row, recorded 2026-09-28T02:26:32.706Z, binds decision hash sha256:02899c34b1554ba282d04b05a1c80a443e5fe33b3ebccd9098b02600b2f03cfa. The operator was told in the session when it was done.",
  "evidence": [
    "npm run plan -- check exited 1 with execution amendment decision binding differs while both rows were present, and exited 0 after the removal.",
    "scripts/lib/plan-receipts.mjs checkPlanGate validates every PlanExecutionAmended row and skips only the withdrawal rows themselves; withdrawPlanAmendment calls the same validation on its target.",
    "git show HEAD:docs/control/plan-refutations.jsonl has 27 rows; the working log had 30 and now has 29. Rows 28 and 29 are this order's uncommitted D003 and D012 amendments."
  ],
  "rejected": [
    {
      "option": "Withdraw the first row with plan amend-order --withdraw",
      "reason": "The withdrawal validates the row's decision binding against the current decision and refuses, and the check would still validate the withdrawn row."
    },
    {
      "option": "Restore D012 as first written and bind the correction as a new decision",
      "reason": "The second row would then fail the same binding, so a row still had to be removed; keeping the corrected D012 needs one removal and no further rows."
    },
    {
      "option": "Leave the check failing for final review",
      "reason": "The executor procedure requires repairing an encountered planning-check failure within authority instead of carrying it forward."
    }
  ],
  "reopenWhen": "The operator or a reviewer judges that an uncommitted control row may not be removed by its writer, in which case the saved row is restored and the conflict is resolved under operator override.",
  "followup": "Planner: decide how a wrong execution amendment is corrected. Today a PlanExecutionAmended row whose decision text later changes can be neither withdrawn nor superseded, because checkPlanGate and withdrawPlanAmendment both validate the row's decision hash against the current decision. Options: validate a withdrawn row against its own recorded hashes, or refuse an edit to a bound decision at the point of the edit with a message naming the binding. Paths: scripts/lib/plan-receipts.mjs. Checks: a fixture that amends, changes the decision, withdraws and re-amends. Priority: low; the workaround is to never edit a bound decision."
}
```

This was the executor's error, not a machinery failure: the binding did what
it is for. Removing a control row by hand is the kind of intervention that
can become rule beating, so it is limited to the executor's own uncommitted
row, leaves the committed log untouched, and is recorded with the removed
row's hashes. NoOp leaves the planning check red.

## WO-162-D017

<!-- integration refs/dotln/checkpoint/WO-162/10 -->

```json
{
  "id": "WO-162-D017",
  "date": "2026-09-28",
  "dispatch": "resume: final review; worktree integrate WO-162",
  "decision": "Integrated main at 5531cda9 (WO-163, published as v0.52.9) by fast-forward of the uncommitted branch from 6f949464; checkpoint and named stash retained, and no merge commit was needed. The final review resolved four authored conflicts and one import that Git carried without a conflict. scripts/lib/github-repository.mjs: WO-163 moved this file into scripts/lib, and Git carried this order's added import across the rename, where `./lib/git.mjs` no longer resolves; it now reads `./git.mjs`, the correction WO-163 D011 named for this review. scripts/authority-mutation-evidence.mjs keeps WO-163's historical check and its retired --write; this order's adoption is re-applied to what remains, runGit with the same exec options and sha256Hex. scripts/lib/release-fixtures.mjs keeps WO-163's removal of the command block and of the import only that block used, with this order's spawnGit import. scripts/test-worktree-integration.mjs keeps WO-163's two-entry copy list with this order's runGit call. docs/product/06-roadmap.md keeps both activation notes, WO-162's above WO-163's. Six other scripts that both orders edit merged without a conflict. The helper retimed the unpublished patch from v0.52.9 to v0.52.10, and @dotln/compiler 0.19.4 stays valid because WO-163 changed no package source. No resolution changed a WO-162 criterion, behavior, contract or authority.",
  "evidence": [
    "refs/dotln/checkpoint/WO-162/10",
    "base 6f9494649db9a4984911801ae320788264d84ff9",
    "upstream 5531cda9cd6f5462e21338226430bfcd34c6e19e",
    "WO-163 D011 and the WO-163 pull request (#147), which the operator pointed this review at: the import to correct and the script paths both orders edit.",
    "Final review, 2026-09-28, classification by blob hash of the 19 code paths that differ from the verified checkpoint: seven equal main's bytes (WO-163's own files), ten are merged, and the two new files scripts/lib/helpers.mjs and scripts/test-helper-reuse.mjs equal the verified bytes.",
    "Final review, `git diff 5531cda9` on each of the ten merged paths: every line that differs from main is a helper import, a call-site rewrite to runGit, spawnGit or execGit with the same arguments and options, prettyJson, sha256Hex or readJsonFile, the registration of this order's modules in scripts/test-runner.mjs, or the copy of helpers.mjs, paths.mjs and git.mjs into one isolated fixture (D008).",
    "On the integrated tree: the criterion 1 search returns only scripts/lib/git.mjs lines 13 and 14; no conflict marker remains; no module under scripts/lib imports from `./lib/`; the merged modules load and `node scripts/release-fixtures.mjs list .` prints 44 cases.",
    "`node docs/evidence/WO-162/compare-fixtures.mjs` on the integrated tree: 177 rows, 173 unchanged, the four named console files changed, none added. `git diff --name-status 6f949464 5531cda9` lists no fixture-tree path.",
    "Evidence editions: every file under docs/evidence/WO-162 equals its checkpoint bytes except this file and meta.json, which release preparation rewrote. `node scripts/authority-evidence.mjs --check` and `node scripts/authority-mutation-evidence.mjs --check` exit 0.",
    "`git tag -l v0.52.9` names the published WO-163 tag, at 5531cda9, that the retiming steps over.",
    "Reviewer error during this integration: while classifying paths the reviewer ran `git add -N .` followed by `git reset -q -- .`. The reset touched the index only. It unstaged the entries the integration had staged and changed no working-tree byte: the tree still held 129 modified and 6 untracked paths, no unmerged path and no intent-to-add entry, and the four resolutions were read again afterwards. The paths were staged again before the review gate.",
    "The final review's gate and checks on the integrated subject are recorded in docs/final-reviews/WO-162/FINAL-001.md."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Keep this order's version of scripts/authority-mutation-evidence.mjs",
      "reason": "It would restore the --write body WO-163 retired by decision, and with it a check that fails on every later edit."
    },
    {
      "option": "Return the import correction through repair and a third verification",
      "reason": "The line follows a rename and adds no behavior. Product 07 assigns a path reconciliation of reviewed upstream work to the integrating final review, and the review gate exercises the corrected module."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-28. Original base: `6f9494649db9a4984911801ae320788264d84ff9`.
Fetched main: `5531cda9cd6f5462e21338226430bfcd34c6e19e`. Checkpoint: `refs/dotln/checkpoint/WO-162/10`.
Named stash retained: `96a49820ebf2fdf7bbae0409bc5ea3ba4967b618` (WO-162 integrate 2026-09-28).
Resolved projections: docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-162: v0.52.9 → v0.52.10. Files changed: docs/work-orders/WO-162-in-unit-helper-reuse.md, README.md, docs/product/06-roadmap.md, docs/evidence/WO-162/meta.json, docs/final-reviews/WO-162/PR.md. Meter snapshot: docs/evidence/WO-162/meta.json, 4139 bytes. Tag observation: local snapshot only.
Carried-forward claims: the order, VER-001 and VER-002 keep their recorded subjects. Criteria 1 to 4, 6 and 7 are carried forward with their original evidence, because the two new helper files, the helper homes and every adopter WO-163 did not touch equal the verified bytes, and the ten merged paths add only the verified adoption to WO-163's reviewed bytes. Criteria 5 and 8 were measured again on the integrated tree: the fixture comparison, the helper regression, the authority check and the review gate. The compiler label stays 0.19.4 and the evidence editions are unchanged; only the application version moved. Final review owns its independent acceptance judgment, recorded in FINAL-001.
Authored conflicts observed: docs/product/06-roadmap.md, scripts/authority-mutation-evidence.mjs, scripts/lib/release-fixtures.mjs, scripts/test-worktree-integration.mjs.
Affected checks: the helper selected npm test -- --review, publication, harness and local release checks. Their executed results are in FINAL-001. This integration supplies no acceptance verdict.
