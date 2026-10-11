# WO-078 decisions

## WO-078-D010 — Repair: expected versions come from a separate captured input

```json
{
  "id": "WO-078-D010",
  "date": "2026-10-11",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 by capturing the generator's Git tag observations in tag-observations.json under the configured siblings root. The file holds schemaVersion 1 and the known receipt commits' tag/nearest observations. index writes that input and the page in the same invocation, including when export or update calls it; --check reads the independent file, validates its shape and commit coverage, and derives every expected version from it. The page's embedded record is now output only. A later tag is still reported as newer evidence without changing either file; an explicit generation refreshes both from Git. Missing, malformed or incomplete observations refuse instead of falling back to the page. Both output temporaries are prepared before either replacement, and an interrupted pair refuses its check until ordinary generation repairs it. The receipt retains exactly its five fields, no command or package dependency is added, and the observation file is registered as generated and regenerated with the page at worktree integration. This corrects D002's assumption that a tag observation embedded in the judged page was sufficient evidence: the independent probe showed that both copies could be forged together. The new rule is that page bytes never determine expected versions. The separate observation file is an input record, not a cryptographic attestation against coordinated edits to all inputs.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-probe.mjs at 2026-10-11T15:03:02.988Z reproduced F1: compound edit check exit 0 although expected 1; the untouched later-tag case also exited 0",
    "scripts/siblings.mjs readTagObservations, tagRecord and writeRegistry; scripts/lib/siblings.mjs tagObservationsPath; .gitattributes and scripts/lib/worktree-integration.mjs",
    "node scripts/harness.mjs bounded -- node --test scripts/test-siblings.mjs: 13 tests passed, 0 failed at 2026-10-11T15:06:12.441Z; the invented version and substitution of an existing later tag both refuse; the unchanged later-tag page passes; malformed/missing/incomplete inputs and interrupted temporaries refuse without a write; relocated roots pass",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='WO-078 criterion 1' scripts/test-launchpad.mjs: 1 passed, 0 failed at 2026-10-11T15:07:30.881Z; export automatically writes the observation file, the exact five-field receipt and the page, and update still appends its receipt",
    "docs/evidence/WO-078/repair-001.md records the repair's evidence and review; npm run release -- prepare --local retained v0.74.2 with no component change"
  ],
  "goalAlignment": {
    "traps": "Rule beating: moving an invented value between two places in the judged page still leaves one self-authored expectation; never read the page for expected versions. Policy resistance: today's Git tags alone would break the legitimate later-tag case; keep the independent captured observation. Shifting the burden: a new operator capture command would add bookkeeping; use the existing generator invocation inside export/update.",
    "noOp": "Leaving D002's page-supplied expectation unchanged preserves the reproduced acceptance of a hand-edited entry."
  },
  "reopens": {
    "decisionId": "WO-078-D008",
    "observation": "The repair closes the page-supplied expectation class using an independent generated input; its regression also rejects replacing the original version with a real newer tag, a case VER-001 did not quote."
  },
  "rejected": [
    {
      "option": "Validate only that the page's recorded tag exists in Git",
      "reason": "An operator can add a legitimate second tag to the same commit; substituting that real tag into the page would still defeat the required hand-edit refusal. The extra regression covers this case."
    },
    {
      "option": "Derive every check from today's tags",
      "reason": "The required unchanged-page later-tag case must keep passing with its original version."
    },
    {
      "option": "Add kit-version fields to the receipt or a separate capture command",
      "reason": "The repair must retain the exact five-field receipt and automatic export/update flow."
    }
  ],
  "reopenWhen": "A page-only edit can still affect the expected version, an unedited page fails solely because a later tag was added, or the registry needs authentication against coordinated edits to its independent source records."
}
```

## WO-078-D001 — A receipt is the last byte of the manifest step, keyed by the destination's name

```json
{
  "id": "WO-078-D001",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "launchpad export and export --update each write one receipt immediately after their manifest, through scripts/lib/siblings.mjs resolveReceipt before the build and writeReceipt after the manifest: a JSON file under the launchpad's evidence root at <evidence>/siblings/<sibling>/<date>.json holding exactly sibling, coreCommit, manifestHash, buildHash and date. The sibling is resolved from the destination: the repository name its origin remote names when it has one (an update into a clone or a worktree named with an order suffix still records its receipt under the declared sibling), else its directory name, compared without case as repository names are, against docs/siblings/siblings.json (ids are public repository names, operator-review assumption 1); any other destination writes no receipt and the command prints one line saying why, so a scratch export or a fork exporting from itself leaves no file in core's evidence tree. Right after the receipt the command regenerates docs/siblings/README.md through the generator's own write path and prints whether the page changed, so no DotLn command or hand step follows an export, as the Cost line requires; a failure in that regeneration names the complete export and the receipt already written. manifestHash is sha256 of the manifest bytes just written (the retained manifest for an update); buildHash is the content hash of the compiled runtime the kit carries, the harness runtime snapshot WO-075's export prints as `snapshot .runtime/harness/<hash>` and installs at that path, recorded as fnv1a64:<hash>; coreCommit is the manifest's commit; date is the ISO timestamp the file is named by. The destination is resolved against the declaration before the build and before any write, so a malformed declaration refuses there; the receipt itself is written after the manifest, beside its final name and linked into place, so a receipt failure names a complete export or update and a second receipt of the same date is refused rather than overwritten. The receipt is the launchpad's evidence and never the export's content: the fixture asserts the export holds no docs/evidence/siblings and the manifest lists no evidence path.",
  "evidence": [
    "scripts/launchpad.mjs exportKit and updateKit: resolveReceipt before prepareKit, destinationNames for the update, closeWithReceipt after each manifest write, and the command line's `sibling receipt:` line",
    "scripts/lib/siblings.mjs resolveReceipt, writeReceipt, buildHashOf and the receipt decoder; scripts/lib/harness.mjs line 152 computes the runtime snapshot as fnv1a64 over the compiled runtime files",
    "scripts/test-launchpad.mjs 'WO-078 criterion 1: an export to a declared sibling writes its receipt inside the manifest step...': the receipt's five fields, its manifest hash against KIT-MANIFEST.json's bytes, its build hash against the printed snapshot, the file name against its date, no receipt for an undeclared destination, and the update's second receipt",
    "docs/work-orders/WO-078-sibling-registry.md, Design: one JSON file per receipt because scripts/check-registrations.mjs classifies only .jsonl, and readDecisions and the follow-up collector skip evidence directories not named WO-NNN"
  ],
  "goalAlignment": {
    "traps": "Rule beating: a receipt written on every export would make the fixtures' and an operator's scratch exports litter core's evidence tree and block the document gate until someone deleted them, so the destination must be a declared sibling. Seeking the wrong goal: a `--sibling` flag would record whatever name the operator typed and add a hand step the criterion forbids; the destination's own name is the public repository name by assumption 1. Shifting the burden: writing the receipt before the manifest would turn a receipt failure into a partial export the operator must remove; the manifest lands first.",
    "noOp": "No receipt: each update, planning pass or receipt that names a sibling keeps opening that sibling's checkout to read its manifest commit and snapshot, and the recorded version stays memory (refutation receipt 009's hold)."
  },
  "rejected": [
    {
      "option": "Write a receipt for every export and let the generator refuse or list receipts for undeclared destinations",
      "reason": "Fixture and scratch exports would write into core's committed evidence tree; a refusal would hold the document gate hostage to a probe, and a listing would track every fork, which the order declines."
    },
    {
      "option": "A `--sibling <id>` option on export and update",
      "reason": "Criterion 1 admits no hand edit or command beyond the export itself, and the destination directory already carries the sibling's public name."
    },
    {
      "option": "A JSONL receipt stream per sibling",
      "reason": "scripts/check-registrations.mjs classifies only exact JSONL paths through the kernel registry; one JSON file per receipt needs no registration and no event protocol."
    },
    {
      "option": "Record the kit tag or version in the receipt",
      "reason": "The criterion fixes five fields; the generator derives the version from this repository's tags at the recorded commit, which stays correct when a tag is added after the export."
    }
  ],
  "reopenWhen": "A sibling is exported under a directory whose name is not its repository name, or one sibling needs receipts from more than one destination; a receipt must carry a field the five do not supply; or a tag at a receipt's commit must change the page without a regeneration."
}
```

## WO-078-D002 — The generator derives the entry from the declaration, the receipts and this repository's Git

```json
{
  "id": "WO-078-D002",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "scripts/siblings.mjs index renders docs/siblings/README.md with one entry per declared sibling: purpose and upstream relation from the declaration (an export's origin commit is the declared coreCommit, else the earliest receipt's commit, else not evidenced; a consumer names its contract version); kit version, core commit, manifest hash, build hash and last receipt from the latest receipt; the orders in core that advanced it as the orders whose committed control segment reads closed at a receipt's commit and not at the previous receipt's (the declared origin commit serves as the first receipt's predecessor when the declaration names one); the declared capability-row ids verbatim, never read from the capability table's prose; and a receipts table with one row per receipt. The kit version is the tag at the receipt's commit, else the nearest tag below it, read with the lookup the kit manifest's own tag uses (scripts/lib/git.mjs describeTag); the page records the tag observation it was rendered against, and the check judges against that record and prints a tag added since as newer evidence, so a release close that tags an exported commit never turns the document gate red in every worktree. A commit this repository does not hold reads not evidenced for the Git-derived fields instead of refusing. One departure from criterion 1's wording: the generator reads no kit manifest, because core holds none; the manifest enters through the receipt's manifest hash and commit, and the version through the tags at that commit. Every field no receipt supplies reads not evidenced. The check regenerates and compares: an entry whose recorded manifest hash is not its latest receipt's is named with the receipt's path; any other difference, a hand edit included, is named by its first differing line; a receipt that does not parse, lacks or misshapes a field, names another sibling, cannot be read, or sits under an undeclared sibling's directory refuses by path before anything is written, and a malformed declaration refuses by field. The declaration admits coreCommit null for an export sibling until its first receipt names a commit, which is the starter's state today: no export of it has run, and WO-083 runs the first.",
  "evidence": [
    "scripts/siblings.mjs renderRegistry, checkRegistry, readTagRecord, commitFacts (git cat-file -e, describeTag and readControl at the commit), writeRegistry and main; scripts/lib/siblings.mjs readDeclaration and readReceipts",
    "scripts/test-siblings.mjs, 10 of 10 passing under node scripts/harness.mjs bounded: the not-evidenced entries, the two-receipt entry with the synthetic WO-901 closed between the commits and v1.0.0 nearest below, the declared origin anchoring the first receipt, unknown commits in three arrangements, the sibling resolved from a repository or directory name without case, the hand edit named by line, the stale hash named by receipt, six undecodable, misnamed or misplaced receipts and an unreadable one, seven malformed declarations and an absent one, and a tag added after generation reported as newer evidence",
    "docs/siblings/README.md in this checkout: both entries read not evidenced in every receipt-supplied field, the starter's capability row is launchpad.starter and the consumer's contract version is uifa-board-v1 (packages/console/src/types.ts VIEW_MODEL_VERSION; product 04 §Console)",
    "A commit-pinned control fold of this repository takes about 44 ms (measured 2026-10-11 with readControls at b7741e38); the generator here runs in under 200 ms"
  ],
  "rejected": [
    {
      "option": "List every order closed before the first receipt as the orders that advanced the sibling",
      "reason": "That is the whole closed history (164 orders at this commit), which says nothing about what changed between the sibling's exports; the first receipt reads first receipt, or is compared with the declared origin commit."
    },
    {
      "option": "Refuse a receipt whose commit this repository lacks",
      "reason": "A receipt recorded from a worktree commit later rewritten would then hold the document gate until the receipt is deleted; the entry says the commit is not here and keeps the receipt's own five fields."
    },
    {
      "option": "Read a sibling's capability rows from docs/planning/capability-table.md",
      "reason": "The order's prose-parsing screen: rows are a typed id list in the declaration; reopen when a sibling's rows must come from its own manifest."
    },
    {
      "option": "Require the declaration to name the starter's export commit now",
      "reason": "No export of the starter has run and the order says WO-078 writes both declarations; an invented commit would be a guess, and the first receipt supplies it."
    }
  ],
  "reopenWhen": "A sibling's capability rows must come from its own manifest; a sibling exports from itself and its receipts must enter this registry; or the registry must read a sibling's checkout rather than core's receipts."
}
```

## WO-078-D003 — Fixture placement and the removed lookup

```json
{
  "id": "WO-078-D003",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "The export fixture that proves the receipt and the regenerated entry lives in scripts/test-launchpad.mjs, which already commits a bounded copy of the work tree, builds its runtime once and exports from it; scripts/test-siblings.mjs holds the generator's cases over a synthetic launchpad with its own Git history and runs in about four seconds without a build. The execution plan's step 6 named the export case in test-siblings.mjs; a second committed copy and build there would repeat the launchpad suite's setup in every gate, so the case moved beside the other export cases and the criterion is judged on both files. The work the registry removes is the manual lookup of a sibling's kit manifest version and build hash in that sibling's own checkout before every update, planning pass or receipt that names it: one checkout read per sibling per occasion, as the order's Cost line counts it, with the recorded version living in memory between reads. Its wall-clock was never measured and no number is claimed; the registry replaces each such read with one generated page and makes the recorded version a committed receipt. Nothing recurring is added: the declaration is written once per sibling, the receipt is written by the command the operator already runs, and the generator runs inside the document gate.",
  "evidence": [
    "scripts/test-launchpad.mjs module setup (lines 150 to 280 at the base): the committed copy, linkInstall and the default export every case reads",
    "scripts/test-siblings.mjs: ten cases under one parent test, 7,658 ms in total under node scripts/harness.mjs bounded on 2026-10-11",
    "docs/work-orders/WO-078-sibling-registry.md Cost line: 'one checkout read per sibling per occasion' and 'the risk that the recorded version is memory'",
    "docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-009.md: the hold on criterion 1 for recurring bookkeeping with no named removal"
  ],
  "rejected": [
    {
      "option": "A second committed copy and build inside scripts/test-siblings.mjs",
      "reason": "It repeats the launchpad suite's most expensive step in every product gate for one case the existing copy already serves."
    },
    {
      "option": "A number for the removed lookup's wall-clock",
      "reason": "It was never measured; the order's own unit is the count of checkout reads, which this decision records."
    }
  ],
  "reopenWhen": "The launchpad suite's setup is extracted into a shared fixture module, or the export case must run without the full kit copy."
}
```

## WO-078-D004 — Boy Scout bound: the three update defects are fixed, the author-identity row is left

```json
{
  "id": "WO-078-D004",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "FUP-eaad73517ca2a395 (WO-077 D007's three update defects) is fixed inside this order's edit of scripts/launchpad.mjs. F1: planInstanceActions refuses a declared rename whose source or destination is kit-owned by the same predicate the manifest uses (kitPath), not only a listed kit file, before any write. F2: planUpdate treats a kit file whose current bytes equal the incoming kit's as converged, whether a fork applied core's change by hand or an earlier update wrote it: it is replaced in place, never refused, and the manifest records the incoming hash; a new kit path already holding the incoming bytes is added the same way instead of being refused as an instance-owned collision. F3: the update journals the manifest it planned as KIT-MANIFEST.pending.json beside the current one before its first kit write and removes it after its last, so a retry knows which bytes the interrupted run wrote: a file whose bytes equal the incoming kit's, the prior manifest's or the journaled plan's is kept, a dropped prior path that is already absent counts as removed, a path the interrupted run dropped that a later kit carries again is added, and a rename that landed while the configuration write did not is adopted without moving anything; the retry therefore completes at the same commit or a later one and after the second of two renames failed, which the self-review showed the first version did not. The pre-build preflight reads only prior files that exist; a prior path the incoming kit still carries and that is absent, with no journal saying the interrupted run dropped it, stays an input failure. FUP-06de60fa5d19fe5a (WO-074 D010: a fork's publish check reads its operator author identity from instance data rather than scripts/lib/contributions.mjs's constant) is left: it needs a configuration field in scripts/lib/config.mjs with its validation, product 07 text and the publish check's fixtures, none of which this order's surfaces or criteria cover; the identity is public and the check only exempts it from the sign-off rule. FUP-e624167a7f6555f6 (WO-074 D011: whether scripts/fixtures data derived from this repository's records may travel in the kit) is left: it is a planning judgment about fixture data outside this order's deliverables. The twelve other rows the register lists as touching this order's seams were read; each matched on text alone and none was taken. Three self-review findings are recorded here rather than fixed: an absent prior kit file the incoming kit still carries now refuses after the runtime build rather than before it, an input failure that costs a build and no write (checking it earlier needs the kit's file list, which readKitSources can supply without a build); the command's summary lines are not printed when the receipt or the regeneration fails after a complete export, only the error that names the completion; and scripts/lib/siblings.mjs keeps small private copies of the configuration loader's object, text and known-key validators rather than exporting them from scripts/lib/config.mjs, and scripts/siblings.mjs its own first-differing-line computation rather than sharing scripts/work-orders.mjs checkIndex.",
  "evidence": [
    "scripts/launchpad.mjs instancePath (kitPath added), planUpdate (kept, absent and journaled cases), readPendingManifest, planInstanceActions (the adopted rename) and updateKit (the preflight, the journal's write and removal, the absent removal)",
    "scripts/test-launchpad.mjs 'export update' cases: the hand-converged changed file is not refused and the counts read 2 refused; a converged new path and an absent dropped path update with 0 refused and the manifest at revision B; a declared rename to scripts/evidence refuses before any write; an opted-in update whose rename fails with EACCES leaves the journal and the prior manifest, and its retry at a later commit ends there with no refusal, every manifest hash equal to its file and the journal removed; an update whose second rename fails is completed by its retry, which adopts the first",
    "npm run plan -- followups --touching scripts/launchpad.mjs scripts/lib/config.mjs scripts/test-runner.mjs docs/README.md docs/product/07-execution-guide.md WO-078: 15 matched rows on 2026-10-11, read in full",
    "docs/evidence/WO-077/decisions.md D007 followup and docs/evidence/WO-074/decisions.md D010 followup"
  ],
  "rejected": [
    {
      "option": "Preflight that every rename's parent is writable instead of completing the retry",
      "reason": "A writability check narrows the window and proves nothing about a disk failure; completing the retry recovers the state D007 named as unreachable."
    },
    {
      "option": "Take the author-identity row here",
      "reason": "A configuration field and the publish check's fixtures are new scope for an order whose surfaces are the registry, the receipt and the update's manifest step."
    }
  ],
  "reopenWhen": "A fork's publish exempts core's operator identity instead of its own, or an exported kit must carry no personal identifier (FUP-06de60fa5d19fe5a); a kit author declares an action the refusal predicate does not cover; an operator reports the post-build refusal of an absent kit file as a cost worth the earlier check; or a second generated index needs the shared stale-line helper."
}
```

## WO-078-D005 — Write-backs in place

```json
{
  "id": "WO-078-D005",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "scripts/lib/config.mjs declares the siblings root (default docs/siblings) and scripts/test-configuration-root.mjs expects it; product 07 §Where the control plane finds its documents names `siblings` in its root list in place, 12 bytes against the order's 150-byte bound and no dated paragraph; docs/README.md §Map gains the docs/siblings/ line and names the receipts under docs/evidence/; scripts/lib/document-gate-stubs.mjs stubs siblings.mjs; scripts/test-runner.mjs runs `siblings index --check` as a preflight document row beside the work-order index and the fixtures as a product row without a build. Receipts need no new root: they sit under the configured evidence root.",
  "evidence": [
    "node --test scripts/test-configuration-root.mjs under node scripts/harness.mjs bounded: 17 of 17 on 2026-10-11, including the literal-root scan over scripts/siblings.mjs and scripts/lib/siblings.mjs",
    "node scripts/check-registrations.mjs: 33 document-gate tasks stubbed",
    "docs/product/07-execution-guide.md: 186,621 to 186,633 bytes against the 205,284 ceiling",
    "docs/README.md §Map lines for docs/siblings/ and docs/evidence/"
  ],
  "rejected": [
    {
      "option": "A separate root key for the receipts",
      "reason": "The order places receipts under the configured evidence root, and scripts/test-configuration-root.mjs needs no new key for a path under an existing root."
    }
  ],
  "reopenWhen": "The receipts must move with a root other than evidence, or a fork's seeded evidence README must describe them."
}
```

## WO-078-D006 — Bounded comparison: where the export receipt case lives

```json
{
  "id": "WO-078-D006",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Two credible placements for the fixture that proves the receipt differed on one axis, the product gate's wall-clock, so both arms were measured on this host under node scripts/harness.mjs bounded. Arm A, chosen: the case runs inside scripts/test-launchpad.mjs after the suite's existing committed copy and default export; in its final form (an export to an undeclared destination, an export to the declared sibling with its regeneration, the generator's rebuild, a kit commit, an update through a worktree-named copy with its regeneration, and the stale check) the case took 10,019 ms, and the generator inside it 104 ms for a 2,564-byte registry; its first form, before the self-review, took 8,937 ms. Arm B, declined: scripts/test-siblings.mjs commits its own copy and exports once before its cases; the launchpad suite's setup alone, run with no case selected, took 4,247 ms (4,165 ms inside node), which arm B would add to every product gate on top of the same case. The generator fixtures stay in scripts/test-siblings.mjs over a synthetic launchpad (7,658 ms for ten cases under one parent test in their final form). The execution plan's step 6 placed the export case in test-siblings.mjs; D004 records the move and the criterion is judged on both files.",
  "evidence": [
    "docs/evidence/WO-078/fixtures.md: the receipt case's 10,019 ms and its diagnostic line; the setup-only run's 4,247 ms wrapper duration",
    "scripts/test-launchpad.mjs module setup (the committed copy, linkInstall and the default export) and the new case placed before the update case",
    "scripts/test-siblings.mjs: ten cases under one parent test in 7,658 ms with no build"
  ],
  "rejected": [
    {
      "option": "Arm B, a second committed copy and export inside scripts/test-siblings.mjs",
      "reason": "It repeats a measured 4.2 s of setup in every product gate to prove what the existing copy proves in place; the saving is small today and grows with every export case added later."
    }
  ],
  "reopenWhen": "The launchpad suite's setup is shared through a fixture module, or the export case must run in a gate selection that excludes the launchpad suite."
}
```

## WO-078-D007

```json
{
  "id": "WO-078-D007",
  "date": "2026-10-11",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.74.2, the next patch above the observed release baseline v0.74.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.74.1 (local tags)",
    "patch classification declared in docs/work-orders/WO-078-sibling-registry.md"
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

## WO-078-D008 — Verification: a forged tag observation defeats the required hand-edit refusal

```json
{
  "id": "WO-078-D008",
  "date": "2026-10-11",
  "dispatch": "resume: verify",
  "decision": "VER-001 routes a blocking criterion 1 finding to repair. With a valid receipt at a commit tagged v1.0.0, changing only the registry page's displayed kit versions and embedded dotln-sibling-tags record to v9.8.7-forged makes siblings index --check exit 0, print PASS and retain the forged page. Git, the declaration and the receipt remain unchanged. A visible version edit alone exits 1. readTagRecord consumes the judged page as a source of the expected version, commitFacts trusts it, and writeRegistry prints disagreement with live tags as NEWER evidence rather than refusing. The repair must reject the compound hand edit using version evidence independent of the judged page while preserving the valid later-tag behavior and the receipt's five-field contract. The verifier changes no implementation.",
  "evidence": [
    "docs/evidence/WO-078/verification-probe.mjs: visible version hand edit only and visible version and embedded tag record hand edit",
    "docs/evidence/WO-078/verification-001.md: independent probe at 2026-10-11T14:09:22.772Z; forged check exit 0 versus required exit 1; unchanged receipt and declaration; Git still reports v1.0.0",
    "scripts/siblings.mjs readTagRecord, commitFacts and writeRegistry; docs/work-orders/WO-078-sibling-registry.md criterion 1",
    "docs/evidence/WO-078/self-review.md adversary 1 and improver 5; D002's frozen tag-observation choice"
  ],
  "goalAlignment": {
    "traps": "Rule beating: the expected output must not accept an invented tag just because the same invented tag is present in the output's observation record. Policy resistance: requiring today's tags verbatim would reintroduce the release-close failure the executor fixed. Seeking the wrong goal: recorded green gates do not discharge the failed refusal claim.",
    "noOp": "Passing the current subject would leave a required refusal bypassable without any input evidence changing. An independent version observation can preserve the later-tag tolerance and reject forged page edits."
  },
  "reopens": {
    "decisionId": "WO-078-D002",
    "observation": "The page's unauthenticated recorded tag observation admits a hand-edited kit version while the declaration, receipt and Git tag are unchanged."
  },
  "followup": "Repair VER-001 F1 in scripts/siblings.mjs: bind the recorded kit-version observation to a source outside the page being checked, reject the combined displayed-version and tag-record edit, and retain the valid later-tag case and the fixed five receipt fields. Add a regression probe for the compound hand edit.",
  "rejected": [
    {
      "option": "Pass because the existing hand-edited-purpose fixture and full product gate are green",
      "reason": "Criterion 1 requires refusal of a hand-edited entry; the executable compound version edit is in that declared set and the check accepts it."
    },
    {
      "option": "Make the verifier edit the generator to obtain a pass",
      "reason": "The read-only verification role must judge the recorded subject and route its finding to the repair phase."
    },
    {
      "option": "Always compare against today's tags and lose the frozen observation",
      "reason": "The independent later-tag case passes without a page edit and preserves the previous version; the repair must retain that behavior."
    }
  ],
  "reopenWhen": "A repaired subject rejects the compound hand edit using independent evidence and continues to pass the valid later-tag case."
}
```

## WO-078-D009 — Preserve the worker dispositions as structured follow-ups

```json
{
  "id": "WO-078-D009",
  "date": "2026-10-11",
  "dispatch": "resume: verify",
  "decision": "The three recorded worker findings in D004 remain nonblocking: an absent prior kit file still carried upstream refuses after a build, post-manifest receipt or regeneration errors omit the normal success summary, and the new modules duplicate small private validators and the first-differing-line calculation. Source review confirms those dispositions. The passing update fixtures show the absent-file case refuses before destination writes; these rows break no required criterion and are preserved here with an actionable followup instead of becoming additional reasons to fail. The existing author-identity and fixture-data planning follow-ups stay at their original records; verification grants no new scope to fix them.",
  "evidence": [
    "docs/evidence/WO-078/self-review.md: adversary 3 and 10; improver 8 and 10; executor recorded three",
    "docs/evidence/WO-078/decisions.md WO-078-D004: the three recorded worker findings and the original carry-in dispositions",
    "scripts/launchpad.mjs updateKit: prepareKit precedes planUpdate; closeWithReceipt errors before CLI summary output",
    "scripts/lib/siblings.mjs requireKnownKeys, isObject and isText; scripts/siblings.mjs checkRegistry",
    "docs/evidence/WO-078/verification-001.md: targeted export update tests passed; missing/malformed manifests and unreadable kit inputs refuse before any write"
  ],
  "reopens": {
    "decisionId": "WO-078-D004",
    "observation": "The worker dispositions remain present on source review and need a structured follow-up route; they do not change the criterion-bound verdict."
  },
  "followup": "When adjacent launchpad or generator work justifies the Boy Scout bound, preflight absent still-carried kit inputs before the build, include the completed destination and receipt state with post-manifest failure summaries, and share the small validators and stale-line helper if a second consumer warrants the extraction. Keep existing refusal, atomic-write and CLI behavior under the shared checks.",
  "rejected": [
    {
      "option": "Fail verification on the three recorded maintainability and diagnostic rows",
      "reason": "The work order's declared behaviors still hold for these rows; verification routes noncriterion defects to follow-up."
    },
    {
      "option": "Rewrite the implementation during verification",
      "reason": "The verifier is read-only; repair can take adjacent low-risk cleanup within the order's bound."
    }
  ],
  "reopenWhen": "The next authorized adjacent change can address one of these rows within its declared surfaces and shared checks, or executable evidence shows a criterion or preexisting behavior is broken."
}
```

## WO-078-D011 — Verification: a coordinated edit of both generated sibling files still admits an invented kit version

```json
{
  "id": "WO-078-D011",
  "date": "2026-10-11",
  "dispatch": "resume: verify",
  "decision": "VER-002 routes a blocking criterion 1 finding to repair. D010 moved the check's expected kit version from the page's embedded record to tag-observations.json, a second file the same generator writes, which .gitattributes marks dotln-generated and worktree integration regenerates as a pure projection. With a valid receipt at a commit tagged v1.0.0, replacing v1.0.0 with v9.8.7-forged in both the page and tag-observations.json makes siblings index --check exit 0. It prints NEWER tag evidence naming the true v1.0.0, then PASS, and keeps the forged page. Git holds no v9.8.7-forged tag, the receipt and declaration are byte-identical, and the ordinary generator rewrites both files from Git at once. VER-001's page-only edit and an observation-only edit now refuse, so the repair closed the filed form, not the class: a generated output still supplies the expected version. The check already reads describeTag for every recorded commit, but treats any disagreement as advisory. The repair must refuse, without a write, a recorded observation naming a tag this repository does not hold at the receipt's commit (tag) or at an ancestor of it (nearest). It must keep the unedited later-tag case passing with its original version, keep the receipt's five fields, and add no operator command. The verifier changes no implementation.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-002-probe.mjs at 2026-10-11T17:03:35.040Z: case C check exit 0 versus required exit 1; Kit version line reads v9.8.7-forged; git rev-parse refs/tags/v9.8.7-forged fails; tags at the commit read v1.0.0; receipt and declaration unchanged; cases A and B exit 1; case E (later tag, no edit) exits 0",
    "docs/evidence/WO-078/verification-002.md: the full probe transcript, the subject's gates and the source path",
    "scripts/siblings.mjs readTagObservations, commitFacts and writeRegistry: recorded observations supply expected tags; the live describeTag comparison only prints NEWER tag evidence",
    ".gitattributes and scripts/lib/worktree-integration.mjs pureProjection and regenerate: tag-observations.json is a generated projection, not a source record",
    "docs/work-orders/WO-078-sibling-registry.md criterion 1; docs/verifications/WO-078/VER-001.md F1 and its repair rule; WO-078-D010"
  ],
  "goalAlignment": {
    "traps": "Rule beating: moving the expected version from the page to a sibling generated file makes the filed reproduction refuse, while the same false version written into both files still passes. Judge the class: a false version accepted while Git, the receipts and the declaration are unchanged. Policy resistance: requiring today's tags verbatim would break the later-tag case; bind recorded tags to Git, not to today's describeTag output. Anti-oscillation: the category stays VER-001's; observations naming real tags at or below the commit (cases D and F) are recorded as limits, not added to the repair.",
    "noOp": "Passing the subject would leave the required hand-edit refusal bypassable by a two-file edit whose false version the check itself prints as disagreeing with Git."
  },
  "reopens": {
    "decisionId": "WO-078-D010",
    "observation": "A coordinated edit of the page and tag-observations.json to a tag Git does not hold passes the check; D010's observation file is itself generated output, not independent evidence."
  },
  "followup": "Repair VER-002 F1 in scripts/siblings.mjs: refuse, without a write, any recorded observation whose tag does not point at its receipt commit or whose nearest is not a tag at or below that commit; keep the unedited later-tag case passing with its original version, the five-field receipt and the existing commands; add a regression for the coordinated page and observation edit to an invented tag.",
  "rejected": [
    {
      "option": "Pass because the filed page-only edit now refuses",
      "reason": "The observed failure VER-001 described (exit 0, NEWER tag evidence naming the true tag, PASS, forged page kept, independent inputs unchanged) recurs through the second generated file."
    },
    {
      "option": "Treat the coordinated edit as an input change outside criterion 1's declared set",
      "reason": "Criterion 1 names the receipts, kit manifests and declaration as the registry's inputs; tag-observations.json is registered as generated output and the generator overwrites it, so editing it with the page is a hand-edited entry."
    },
    {
      "option": "Require a cryptographic attestation or compare against today's tags",
      "reason": "Neither is needed: the check already reads Git at each recorded commit, and Git can reject a tag it does not hold there while the later-tag case keeps passing."
    }
  ],
  "reopenWhen": "A repaired subject refuses the coordinated invented-tag edit using this repository's Git, and the unedited later-tag case still passes with its original version."
}
```

## WO-078-D012 — Repair: captured versions must be Git tags at or below the receipt commit

```json
{
  "id": "WO-078-D012",
  "date": "2026-10-11",
  "dispatch": "resume: fix",
  "decision": "Repair VER-002 F1 by validating every non-null captured tag against Git before commitFacts uses it. An exact tag must be in git tag --points-at the receipt commit; a nearest tag must be in git tag --merged that commit, including tags at it. Literal membership in Git's returned names also excludes revision expressions that resolve to a commit but are not tag refs. Validation refuses by the configured observation path without changing either generated output. Captured observations remain useful for preserving the original version after another tag is added, but are generated outputs whose values require Git evidence, not independent source records. This corrects D010 and the prior handoff's specific error: separating the recorded version from the page did not make it independent of coordinated edits to both generated files. The reproduced case C accepted an invented version while Git, the declaration and the receipt stayed unchanged; it now refuses. The generator and the generated page describe the corrected evidence boundary. Receipts retain exactly five fields, export/update retain their automatic generation, and the classified application target stays v0.74.2 with no changed component or dependency.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-002-probe.mjs before repair at 2026-10-11T17:12:52.671Z: reproducedF1 true, case C check exit 0 and unchanged declaration/receipt, while Git held only v1.0.0 at the commit",
    "The same probe after repair at 2026-10-11T17:15:53.205Z: reproducedF1 false, case C check exit 1 with no stdout, case E unedited later-tag check exit 0 with unchanged page, and ordinary generation restores both outputs",
    "node scripts/harness.mjs bounded -- node --test scripts/test-siblings.mjs at 2026-10-11T17:15:40.699Z: 15 passed, 0 failed; coordinated invented version, real exact tag at a different commit, future or invented nearest tag, revision expression, removed tag, page-only edit, later-tag preservation, recovery and relocated roots",
    "scripts/siblings.mjs validateRecordedTags and commitFacts; scripts/test-siblings.mjs coordinated-edit and tag-relationship regressions; docs/evidence/WO-078/repair-002.md",
    "npm run release -- prepare --local: WO-078 target v0.74.2 remains current; package.json, package-lock.json and packages/ are unchanged"
  ],
  "goalAlignment": {
    "traps": "Rule beating: accepting agreement between two generated files repeats the failed repair, so validate literal tag names against Git before rendering. Policy resistance: comparing to today's preferred tag would stale a legitimate older observation after a later tag, so check exact-commit or ancestor membership instead. Shifting the burden: a new capture command or receipt field would add bookkeeping, so validation runs inside the existing check. Anti-oscillation: stay in the reported class; null observations and coordinated substitution of real tags at the same commit remain the verifier's recorded limits.",
    "noOp": "Keep the existing shape-only observation validation, which the reproduced case C showed accepts an invented version when both generated files are edited together."
  },
  "reopens": {
    "decisionId": "WO-078-D011",
    "observation": "The same independent probe now refuses its coordinated invented-tag case using Git and preserves its unedited later-tag case. The regression also rejects a real tag at a different commit and a future tag used as nearest, closing the reported relationship class beyond the quoted invention."
  },
  "rejected": [
    {
      "option": "Drop captured observations and compare the page with today's describeTag result",
      "reason": "A later tag would change the expected version and fail the required unedited later-tag case."
    },
    {
      "option": "Authenticate the observation file or add a new operator capture command",
      "reason": "Git already supplies the independent tag relationship evidence; neither additional mechanism is needed for the reported class."
    },
    {
      "option": "Resolve a recorded string as a Git revision and compare only its commit",
      "reason": "Revision expressions can resolve without naming a literal tag ref; comparing returned tag names keeps the recorded version in the declared category."
    }
  ],
  "reopenWhen": "A captured non-null version passes without a literal Git tag at the required commit relationship, or an unedited captured version becomes stale solely because another tag was added."
}
```

## WO-078-D013 — Integration: main fast-forwarded under the work with no conflict, v0.74.2 retimed to v0.74.3

<!-- integration refs/dotln/checkpoint/WO-078/14 -->

```json
{
  "id": "WO-078-D013",
  "date": "2026-10-11",
  "dispatch": "resume: final review; worktree integrate WO-078",
  "decision": "Integrate main at cd1dce608f4739c4a61c3d2659ef197503f05b83 (WO-191 merged as #205 and published as v0.74.2) into the uncommitted branch over its base b7741e38d68ac659921db757ac19054f84743495. The branch held no commit, so the helper checkpointed the work (preservation commit 713de661b8503e55b0639a8037480a406563f59e, refs/dotln/checkpoint/WO-078/14), fast-forwarded HEAD to main with no merge commit, re-applied the named stash 26a402c91bca3877d4a38693420c9aeddb6ecde6 and regenerated the projections. It reported no authored conflict and resolved four generated projections: docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md and docs/work-orders/README.md. Every claim VER-003 judged at code identity 08345dada9b32b66aea18810ab01be4c591fc200e234d231d6acc2e06c4f4faa carries to the integrated tree. The subject's own bytes are unchanged: scripts/siblings.mjs, scripts/lib/siblings.mjs, scripts/test-siblings.mjs, docs/siblings/README.md, siblings.json and tag-observations.json, VER-003 and the handoff are byte-identical to checkpoint 14, and the tracked subject files differ from it only by main's own additions to scripts/test-runner.mjs (two reader rows and three machinery sources) and scripts/lib/document-gate-stubs.mjs (two reader stubs), in hunks apart from this order's. Main's three commits are WO-191's: scripts/lib/reader-profiles.mjs, scripts/reader.mjs and their fixtures, writing guidance printed by scripts/release.mjs and scripts/worktree.mjs, publication examples and reader scores, WO-191's records, and the console and skeleton package versions; none is a file this order's criteria read. The code identity changes because main's code did, so the one product gate reruns at the integrated tree instead of composing from VER-003's row; FINAL-001 records its row. Version collision, bookkeeping: WO-191 published v0.74.2, the target D007 assigned, so release preparation retimed this order to v0.74.3, the next patch above the observed baseline v0.74.2, in the heading and the README claim; the local tag snapshot and origin's tags both end at v0.74.2. Component check: this order changes no package.json, package-lock.json, packages/ file or docs/evidence/current.json; main's console and skeleton version bumps are WO-191's, consumed as published, so no component version or evidence edition is re-minted. Affected checks at the integrated tree on 2026-10-11 at 18:23:55Z, each exit 0: npm run publication:check (254 of 254 product headings indexed, both editions CURRENT), node scripts/harness.mjs check (34 generated surfaces) and npm run release -- check-surfaces --local (six packages refuse publish as expected). npm test -- --review is FINAL-001's gate.",
  "evidence": [
    "refs/dotln/checkpoint/WO-078/14",
    "base b7741e38d68ac659921db757ac19054f84743495",
    "upstream cd1dce608f4739c4a61c3d2659ef197503f05b83",
    "release preparation: Retimed WO-078: v0.74.2 → v0.74.3 above the observed release baseline v0.74.2. Files changed: docs/work-orders/WO-078-sibling-registry.md, README.md, docs/evidence/WO-078/meta.json, docs/final-reviews/WO-078/PR.md. Meter snapshot: docs/evidence/WO-078/meta.json, 4429 bytes. Tag observation: local snapshot only.",
    "docs/control/local/integration.json: preservationCommit 713de661b8503e55b0639a8037480a406563f59e, mergeCommit null, stage applied, authored [], resolved the four projections named above",
    "git show refs/dotln/checkpoint/WO-078/14:<file> | cmp - <file> for the eight subject files named above: identical; git diff --stat refs/dotln/checkpoint/WO-078/14 over the tracked subject files: scripts/lib/document-gate-stubs.mjs +2 and scripts/test-runner.mjs +15, both main's",
    "git diff --stat b7741e38 main: 85 files, WO-191 and its records; git ls-remote --tags origin and git tag -l 'v0.74.*': v0.74.2 at cd1dce60 on both",
    "npm run publication:check, node scripts/harness.mjs check and npm run release -- check-surfaces --local at 2026-10-11T18:23:55Z: each exit 0"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Compose the product gate from VER-003's row at the integrated tree",
      "reason": "Main's code changed the identity, and the review gate reuses passing tasks only at an unchanged identity; the gate runs fresh where its sources moved."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-11. Original base: `b7741e38d68ac659921db757ac19054f84743495`.
Fetched main: `cd1dce608f4739c4a61c3d2659ef197503f05b83`. Checkpoint: `refs/dotln/checkpoint/WO-078/14`.
Named stash retained: `26a402c91bca3877d4a38693420c9aeddb6ecde6` (WO-078 integrate 2026-10-11).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-078: v0.74.2 → v0.74.3 above the observed release baseline v0.74.2. Files changed: docs/work-orders/WO-078-sibling-registry.md, README.md, docs/evidence/WO-078/meta.json, docs/final-reviews/WO-078/PR.md. Meter snapshot: docs/evidence/WO-078/meta.json, 4429 bytes. Tag observation: local snapshot only.
Carried-forward claims: all four criterion judgments of VER-003, as the decision above states; the product gate reruns at the integrated identity and FINAL-001 records its row.
Authored conflicts observed: none.
Affected checks: run at the integrated tree on 2026-10-11 at 18:23:55Z, each passing; the decision's evidence lists them. The review gate is FINAL-001's.

## WO-078-D014 — Final review: pass at the integrated subject, two allocated register rows disposed

```json
{
  "id": "WO-078-D014",
  "date": "2026-10-11",
  "dispatch": "resume: final review",
  "decision": "Pass at the integrated subject. All four criteria are met on branch wo-078 over main at cd1dce608f4739c4a61c3d2659ef197503f05b83, judged from VER-003's evidence carried under D013, this review's reruns of VER-003's unchanged probe at the integrated tree (exit 0, failures 0: H1 to H13 refuse without a write, H13' and H14 pass), the current bytes of docs/siblings/README.md and the write-backs, and the review and document gates FINAL-001 records under Executed checks. No finding: the findings block is empty. The version collision with WO-191's v0.74.2 is bookkeeping recorded in D013, not a finding. The recorded limit cases stay recorded and unjudged, inside D011's anti-oscillation category: coordinated edits of both generated files that name only tags Git holds at or below the receipt commit (VER-002 D and F, VER-003 L1 and L2), a minified observation file with unchanged values (L3), and a captured tag deleted after generation refusing the siblings row until regeneration (H13); no criterion names them, and raising them would move the verifier's boundary without new evidence. Register dispositions at close: FUP-eaad73517ca2a395 (WO-077 D007) settled on D004, whose fix the update fixtures in the passing review rows prove; FUP-06de60fa5d19fe5a (WO-074 D010) deferred back to the register with D004's recorded reason and its reopening condition unchanged; this order's own rows for D004, D009 and D010 (FUP-c6da24aea75994e6, FUP-584d6021928bdfdb, FUP-995f9b2aacc209d2) left untriaged for planning; FUP-e624167a7f6555f6 left as D004 names it; every other textual match left as it is. The reviewed state is committed as coherent changes and published as the WO-078 branch and its pull request; nothing is merged, tagged or released here.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-003-probe.mjs at 2026-10-11T18:19:27Z and 18:21:30.729Z, both exit 0 with failures 0; the second run's output is in the session scratch directory",
    "docs/siblings/README.md at current bytes after integration: both entries present, six receipt-supplied fields read not evidenced in each, the consumer names uifa-board-v1; docs/evidence/siblings/ absent; tag-observations.json records no commit",
    "git diff HEAD over docs/README.md and docs/product/07-execution-guide.md: the siblings map lines and the one-line root-list edit; npm run publication:check at 18:23:55Z: 254 of 254 headings, both editions CURRENT",
    "docs/control/local/final-001-followups-WO-078.json applied at 18:27Z: FUP-eaad73517ca2a395 settled, FUP-06de60fa5d19fe5a deferred; register revision 6bb4da7553653b6fe5b739f92d764bf2ec7061e02f2c008f4bed7d2232712ee6",
    "npm test -- --review at the integrated code identity da2101f0dfdcf2ee87a68a410ab8f266749b21c2b3957e0e438f17b1b11601a0: 38 suites passed, 0 failed, 90 fresh tasks, 1,371,160 ms, exit 0, identity and build outputs unchanged, recorded 2026-10-11T19:00:01.876Z; npm run test:docs at the same identity: 35 passed, 0 failed, 102,136 ms, recorded 2026-10-11T18:36:52.054Z; git diff --check clean; docs/control/local/harness/checks.json holds the rows, and docs/final-reviews/WO-078/FINAL-001.md Executed checks lists them",
    "docs/verifications/WO-078/VER-001.md, VER-002.md and VER-003.md: each file's SHA-256 equals its recorded reportHash in docs/control/orders/WO-078.jsonl"
  ],
  "goalAlignment": {
    "traps": "Sycophancy: a third passing verification is not acceptance; the probe and the gates were rerun at the integrated tree. Oscillation: the limit cases the verifier recorded are judged inside D011's category, not reopened. Rule beating: a new base, a version collision and regenerated projections are bookkeeping by product 07 and never findings. Shifting the burden: editing the judged generator at review would need a live repair and fresh verification, so no code was edited.",
    "noOp": "Leaving the order unreviewed keeps WO-083's first export without a receipt and the starter's version in memory, the cost receipt 009 held the order on."
  },
  "rejected": [
    {
      "option": "Fail or board the recorded limit cases (VER-002 D and F, VER-003 L1 to L3, H13) as findings",
      "reason": "They are inside the category the verifier recorded under D011, no criterion names them, and the refusals and newer-evidence lines surface each on stdout or stderr."
    },
    {
      "option": "Compose the product gate from VER-003's row at the integrated tree",
      "reason": "Main's code changed the identity; product 07's integration list requires the one product gate on the integrated tree, and the review gate reuses passing tasks only at an unchanged identity."
    },
    {
      "option": "Leave FUP-eaad73517ca2a395 allocated for planning to settle",
      "reason": "The change opened its seam and fixed it; product 07 has the final review dispose such a row."
    }
  ],
  "reopenWhen": "A receipt-bearing export needs a field the five do not supply; a captured non-null version passes without the required Git relationship; an unedited captured version becomes stale solely because a tag was added; or the operator counts committing a receipt as bookkeeping (operator-review assumption 2), which reopens refutation receipt 009's concern."
}
```
