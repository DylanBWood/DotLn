# WO-218 decisions

## WO-218-D001

```json
{
  "id": "WO-218-D001",
  "date": "2026-10-20",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.87.0, the next minor above the observed release baseline v0.86.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.86.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-218-boarded-follow-ups-the-instance-and-publication.md"
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

## WO-218-D002

```json
{
  "id": "WO-218-D002",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-06de60fa5d19fe5a: Read the operator contribution exemption from instance configuration. Core declares its existing public identity; fresh kits declare none. Mutable Git identity never creates an exemption.",
  "evidence": [
    "Source read in full: docs/evidence/WO-074/decisions.md#wo-074-d010--write-backs-carry-ins-and-the-kits-instance-identity",
    "VER-001 repair control r01-identity (docs/evidence/WO-218/repair-controls.md#r01-identity): node --test --test-name-pattern 'instance contribution identity' scripts/test-configuration-root.mjs; Preflight configuration-root; current exit 0, isolated-reversion exit 1. Only the instance-declared contribution author receives the exemption. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Keeping a source-code constant exports core identity into every instance; dropping the exemption would change the existing core DCO policy."
    }
  ],
  "reopenWhen": "An instance needs multiple declared operator identities or the contribution policy changes."
}
```

## WO-218-D003

```json
{
  "id": "WO-218-D003",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-0804477ea9d640a7: Inspect every session-root ancestor below its trusted temporary prefix, refusing symlinks and non-directories before granting writes.",
  "evidence": [
    "Source read in full: docs/evidence/WO-168/decisions.md#wo-168-d004--item-2-a-granted-session-root-is-a-real-directory",
    "VER-001 repair control r02-ancestors (docs/evidence/WO-218/repair-controls.md#r02-ancestors): node --test --test-name-pattern 'every scratchpad component' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Inspect every scratchpad component below the trusted temporary prefix. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Inspecting only the leaf allows an ancestor to redirect a grant outside the admitted root."
    }
  ],
  "reopenWhen": "The host changes the granted directory layout or ownership model."
}
```

## WO-218-D004

```json
{
  "id": "WO-218-D004",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-09a2fb517f0ffbc4: Decline a ninth phase in the current beacon codebook. Withdrawal is canonical in status but leaves the previous beacon unchanged; its previous phase can remain marked fresh until its existing timestamp is 20 minutes old, then becomes stale.",
  "evidence": [
    "Source read in full: docs/evidence/WO-158/decisions.md#wo-158-d006",
    "packages/beacons/src/control-codebook.mjs: the current phase alphabet has eight values; docs/evidence/WO-158/decisions.md WO-158-D006 records the stale-beacon observation.",
    "scripts/resume.mjs appendTransition skips projectControlBeacon for withdrawn; packages/beacons/src/control-codebook.mjs declares eight phases and BEACON_STALE_AFTER_MS = 20 * 60 * 1000. This corrects the earlier claim that withdrawal immediately made the beacon stale."
  ],
  "rejected": [
    {
      "option": "Implement the nominated change now",
      "reason": "Current harm is a misleading fresh previous phase for the remainder of the 20-minute freshness window, followed by a stale decoration. Canonical status records withdrawal. Extending the fixed radix changes the wire contract and requires a versioned codebook decision; this order declines that protocol expansion while retaining the stated beacon limitation."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D006",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "A versioned beacon revision is authorized or an observed consumer relies on the misleading fresh previous phase or cannot handle the later stale result."
}
```

## WO-218-D005

```json
{
  "id": "WO-218-D005",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-3a0c4ea52f8d6d08: Decline automatic publication and teardown for withdrawn orders. Preserve their branch, intake and recovery material under the current canonical recovery routes.",
  "evidence": [
    "Source read in full: docs/evidence/WO-158/decisions.md#wo-158-d005",
    "docs/evidence/WO-158/decisions.md WO-158-D005; scripts/worktree.mjs closed-order publication and finish preconditions; scripts/test-off-ramps.mjs withdrawal behavior."
  ],
  "rejected": [
    {
      "option": "Implement the nominated change now",
      "reason": "Current harm is manual recovery for withdrawn worktrees. Withdrawal supplies neither a passing review nor a release/publication contract; treating it as closure would grant publication or deletion without those facts."
    }
  ],
  "reopens": {
    "decisionId": "WO-158-D005",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "The operator authorizes a withdrawal disposition with an explicit publication and preservation contract."
}
```

## WO-218-D006

```json
{
  "id": "WO-218-D006",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-406744f5e9966250: Keep the existing delayed collision-stub write, and add an explicit --continue --stash-applied recovery attestation after failed or interrupted stash application, preserving stash and checkpoint refs. The delayed integration-stub defect was already met in the baseline implementation; am-delayed-stub records that observation. The explicit stash continuation is the change proved here.",
  "evidence": [
    "Source read in full: docs/evidence/WO-169/decisions.md#wo-169-d006--generation-waits-for-authored-conflicts-the-record-holds-the-release-message-as-one-line",
    "VER-001 repair control r05-stash-continuation (docs/evidence/WO-218/repair-controls.md#r05-stash-continuation): node --test --test-name-pattern 'interrupted stash application has an explicit' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, isolated-reversion exit 1. An inspected and staged interrupted stash application can continue without applying it twice. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control am-delayed-stub (docs/evidence/WO-218/repair-controls.md#am-delayed-stub): node --test --test-name-pattern 'WO-086 a retime that lands on a continuation is recorded once' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, baseline-module exit 0. The integration stub already waited until release preparation succeeded. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Blindly reapplying a partially applied stash can overwrite an operator resolution. The explicit continuation checks conflicts and retained untracked contents before moving on."
    }
  ],
  "reopenWhen": "A stopped application can advance without preserved data or the collision stub loses the successful retime."
}
```

## WO-218-D007

```json
{
  "id": "WO-218-D007",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-44639ec9a751d8d1: Emit the five role navigation directives from the compiled Contributor instruction block and migrate only their exact known historical floor lines.",
  "evidence": [
    "Source read in full: docs/evidence/WO-075/decisions.md#wo-075-d008--cold-start-bytes-inside-the-export",
    "VER-001 repair control r06-navigation (docs/evidence/WO-218/repair-controls.md#r06-navigation): node --test --test-name-pattern 'disabled harness keeps core and kit' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Disabled harnesses retain their floor and remove obsolete role navigation. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Leaving generated role pointers in handwritten floors makes disabled builds point to removed skills. Arbitrary floor rewriting would discard operator instructions."
    }
  ],
  "reopenWhen": "A new role or a different historical spelling needs an explicit migration."
}
```

## WO-218-D008

```json
{
  "id": "WO-218-D008",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-5c2082d9fc28dbbf: Ignore Git replacement objects for export provenance and batch object reads, including pinned build and emit inputs.",
  "evidence": [
    "Source read in full: docs/evidence/WO-075/decisions.md#wo-075-d017--verification-ver-002-provenance-reads-honor-git-replace-refs",
    "VER-001 repair control r07-original-objects (docs/evidence/WO-218/repair-controls.md#r07-original-objects): node --test --test-name-pattern 'export refuses a replaced blob hidden' scripts/test-launchpad-export.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. Export provenance reads original Git objects despite replacement refs. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Ordinary rev-parse, ls-tree and cat-file can describe substituted objects rather than the named release commit."
    }
  ],
  "reopenWhen": "Another provenance read can be redirected by replacement refs."
}
```

## WO-218-D009

```json
{
  "id": "WO-218-D009",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-620f25409f65f4aa: Refuse harness marker text anywhere in an overlay string before composition or writes, naming the overlay and field.",
  "evidence": [
    "Source read in full: docs/evidence/WO-076/decisions.md#wo-076-d009",
    "VER-001 repair control r08-markers (docs/evidence/WO-218/repair-controls.md#r08-markers): node --test --test-name-pattern 'overlay marker text' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Overlay strings and nested property names cannot inject harness markers. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Escaping or silently stripping the marker would conceal a malformed declaration; post-write refusal can leave an unreadable installed contract."
    }
  ],
  "reopenWhen": "A new overlay field reaches emitted text without the marker screen."
}
```

## WO-218-D010

```json
{
  "id": "WO-218-D010",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-785f679912b2f36c: Keep the public seed executable and declare its scratch class explicitly.",
  "evidence": [
    "Source read in full: docs/evidence/WO-073/decisions.md#wo-073-d011",
    "VER-001 repair control r09-seed-class (docs/evidence/WO-218/repair-controls.md#r09-seed-class): node --test --test-name-pattern 'public WO-111 seed emits' scripts/test-configuration-root.mjs; Preflight configuration-root; current exit 0, isolated-reversion exit 1. The retained public seed declares a class that the instance validator accepts. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Retiring the seed discards useful reproducible evidence; an undeclared class violates the current configuration contract."
    }
  ],
  "reopenWhen": "The seed no longer represents a supported fixture setup."
}
```

## WO-218-D011

```json
{
  "id": "WO-218-D011",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-815e8662408881f1: Apply the source-bundle hostname shape to registration linkHosts during configuration loading.",
  "evidence": [
    "Source read in full: docs/evidence/WO-073/decisions.md#wo-073-d010",
    "VER-001 repair control r10-link-hosts (docs/evidence/WO-218/repair-controls.md#r10-link-hosts): node --test --test-name-pattern 'registration hosts and target release names' scripts/test-configuration-root.mjs; Preflight configuration-root; current exit 0, isolated-reversion exit 1. Registration link hosts use the source-bundle DNS screen. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A later observer-only refusal delays a deterministic configuration error and creates inconsistent readers."
    }
  ],
  "reopenWhen": "The observer host grammar changes."
}
```

## WO-218-D012

```json
{
  "id": "WO-218-D012",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-847826d3542ff249: Preserve current ampersand redirect and equals-word fixes; refuse network input pseudo-files and configured Git programs in live-gate metadata reads, and parse the silent npm resume spelling.",
  "evidence": [
    "Source read in full: docs/evidence/WO-168/decisions.md#wo-168-d006--item-4-four-argument-forms-one-spelling-two-git-conditions",
    "VER-001 repair control r11-configured-git (docs/evidence/WO-218/repair-controls.md#r11-configured-git): node --test --test-name-pattern 'WO-168 a live gate admits four' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. A live gate does not treat Git with executable configuration as a harmless listed read. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A metadata label cannot make a command read-only when its redirects or Git configuration execute effects."
    }
  ],
  "reopenWhen": "A new shell spelling bypasses the parsed effect or destination checks."
}
```

## WO-218-D013

```json
{
  "id": "WO-218-D013",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-8cfd3ff52146a016: Record the real writer-directory publication and retry protocol as already met. The current fixture exercises that retained protocol with the baseline release module; no new writer protocol fix is claimed. The later-main retry is separately repaired and proved under D024.",
  "evidence": [
    "Source read in full: docs/evidence/WO-166/decisions.md#wo-166-d008",
    "VER-001 repair control am-real-writer (docs/evidence/WO-218/repair-controls.md#am-real-writer): bash scripts/test-release.sh --case close_real_writer; Preflight release; current exit 0, baseline-module exit 0. The real writer-directory publication and retry protocol already works at the base. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A fixture that plants only the legacy writer.json does not exercise the runtime reservation that real sessions use."
    }
  ],
  "reopenWhen": "The writer storage protocol or close ownership contract changes."
}
```

## WO-218-D014

```json
{
  "id": "WO-218-D014",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-94f789b2dcdd30e7: Settle the twelve starter integration findings: correct product and role text, redact paths, use the runner adapter, recognize landed pushes and modes, recover cleanup across temporary roots, prove carried receipt ownership, preserve self-start retry, skip empty undeclared receipt lanes, and collapse identical manifest receipts.",
  "evidence": [
    "Source read in full: docs/evidence/WO-215/decisions.md#wo-215-d020--final-review-pass-final-001-at-the-integrated-subject-two-register-rows-settled-the-orders-follow-ups-left-for-planning",
    "VER-001 repair control r13-carried-receipt (docs/evidence/WO-218/repair-controls.md#r13-carried-receipt): node --test --test-name-pattern 'captured pending receipts survive' scripts/test-siblings.mjs; Preflight siblings-fixtures; current exit 0, isolated-reversion exit 1. A captured receipt already preserved by another registered worktree remains recoverable without a duplicate. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Restating only the first live refresh would leave the documented retry and evidence defects. Historical role baselines remain immutable; this order adds a new baseline."
    }
  ],
  "reopenWhen": "Any of the twelve source findings recurs under the current starter contract."
}
```

## WO-218-D015

```json
{
  "id": "WO-218-D015",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-9d397b57910ae6ed: Treat a manifest explicitly declaring build none as intentionally disabled, without runtime-unavailable warnings; malformed empty profiles still refuse.",
  "evidence": [
    "Source read in full: docs/evidence/WO-076/decisions.md#wo-076-d011",
    "VER-001 repair control r14-build-none (docs/evidence/WO-218/repair-controls.md#r14-build-none): node --test --test-name-pattern 'disabled harness keeps core and kit' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. An intentionally disabled harness does not report an unavailable runtime. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "An empty profile list alone cannot distinguish disabled operation from a damaged installation."
    }
  ],
  "reopenWhen": "Another runtime consumer treats an explicit disabled build as a missing runtime."
}
```

## WO-218-D016

```json
{
  "id": "WO-218-D016",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-a859aa6cad8f9c6c: Decode escaped publication paths once before containment and encode each resulting path segment once, preserving query strings and fragments.",
  "evidence": [
    "Source read in full: docs/evidence/WO-188/decisions.md#wo-188-d044--repair-of-ver-003-f2-a-link-is-rewritten-only-where-the-parser-renders-one-at-the-destination-the-parser-renders",
    "VER-001 repair control r15-encoded-links (docs/evidence/WO-218/repair-controls.md#r15-encoded-links): node --test --test-name-pattern 'target publication normalizes nested links' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Encoded paths are decoded once before containment and query strings retain their meaning. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Double encoding changes the target filename; decoding after containment lets escaped parent segments bypass the boundary."
    }
  ],
  "reopenWhen": "A destination grammar or renderer exposes another escaped-path ambiguity."
}
```

## WO-218-D017

```json
{
  "id": "WO-218-D017",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-aa129ef63aeef2b1: Decline a speculative retired-path allowlist until a release actually removes a carried kit path and supplies its authoritative retirement record.",
  "evidence": [
    "Source read in full: docs/evidence/WO-210/decisions.md#wo-210-d025--take-this-release-in-an-older-instance-through-the-incoming-launchpad-and-an-update-pull-request",
    "docs/evidence/WO-210/decisions.md WO-210-D025; scripts/launchpad.mjs kitPath and historical manifest admission; scripts/kit/README.client.md incoming-reader update procedure."
  ],
  "rejected": [
    {
      "option": "Implement the nominated change now",
      "reason": "Current harm is a future older-manifest rejection if the kit removes a path. No removed carried path or authoritative retirement set is identified at this subject. Broad historical acceptance would weaken the owned-path boundary."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D025",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "A planned kit removal identifies the old path, owning releases and migration semantics."
}
```

## WO-218-D018

```json
{
  "id": "WO-218-D018",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-acdc329e47638889: Distinguish wholly undeclared publication from a partially declared publication missing its editions; --expect-stale never passes on an undeclared corpus.",
  "evidence": [
    "Source read in full: docs/evidence/WO-202/decisions.md#wo-202-d011--verification-board-publicationchecks-absence-rule-which-does-not-distinguish-an-undeclared-instance-from-a-core-checkout-missing-its-editions",
    "VER-001 repair control r17-publication-declaration (docs/evidence/WO-218/repair-controls.md#r17-publication-declaration): node --test --test-name-pattern 'publication declarations under a configured root' scripts/test-configuration-root.mjs; Preflight configuration-root; current exit 0, isolated-reversion exit 1. A publication declaration under the configured root requires both edition inputs. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Treating every absent pair of edition files as an undeclared instance hides a damaged declared corpus."
    }
  ],
  "reopenWhen": "A new publication declaration surface is added."
}
```

## WO-218-D019

```json
{
  "id": "WO-218-D019",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-c9dc1abccd1f1a9d: Resolve moved decisions through immutable repository/commit/path/hash bindings; lint target commits before final review; isolate target-close fetches from clone configuration; restrict planning publication to intended document forms. Decline automated records-phase and planning-publication recovery redesigns, preserving pending receipts and absent-target bundle ownership for explicit recovery.",
  "evidence": [
    "Source read in full: docs/evidence/WO-210/decisions.md#wo-210-d029--repair-the-final-review-regressions-and-bounded-findings-retain-six-planning-follow-ups",
    "WO-210-D029 F23 selects the target-close fetch lane. scripts/lib/target-planning.mjs still fetches origin inside its clone; no planning-fetch isolation is claimed.",
    "VER-001 repair control r18-moved-decisions (docs/evidence/WO-218/repair-controls.md#r18-moved-decisions): node --test --test-name-pattern 'moved decisions and reports resolve' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Moved decisions are read from the bound immutable target record. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r18-commit-lint (docs/evidence/WO-218/repair-controls.md#r18-commit-lint): node --test --test-name-pattern 'target final review refuses a nonconventional commit' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Target final review refuses nonconventional commits before binding its subject. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r18-planning-body (docs/evidence/WO-218/repair-controls.md#r18-planning-body): node --test --test-name-pattern 'target planning publishes only product and planning documents' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Planning publication accepts only planning and product documentation. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "F11 and F15 include changed pending records/planning inputs and absent target directories or bundles with ownership still recorded. Current harm is a blocked preserved operation requiring diagnosis; recreating a target or emitting its bundle can still fail the retained ownership check. Automatically adopting changed inputs or clearing that ownership would weaken the recorded subject or detach preserved work. Keep those refusals until an explicit preserve/abandon protocol proves retained bytes; repair the other four findings."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D029",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "An authorized preserve/abandon design binds interrupted records and planning operations to their original subjects and proves recovery of absent target directories or bundles before changing retained ownership."
}
```

## WO-218-D020

```json
{
  "id": "WO-218-D020",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-cc27c2c1a82fed2c: Restrict disposable retry words to disposable material, case-fold reserved planning lane names, name linked-worktree preservation remedies, emit scratch advice before tree hashing, shell-quote subjects, share safe nested Git and gitlink parsing, and retain nested repositories during whitespace evidence. The nested-repository whitespace exclusion already existed; am-nested-whitespace runs that baseline logic while the nested repository remains present. The other six items have isolated negative controls.",
  "evidence": [
    "Source read in full: docs/evidence/WO-188/decisions.md#wo-188-d049--final-review-seven-low-findings-of-the-release-and-lifecycle-review-worker-boarded",
    "VER-001 repair control r19-protected-retry (docs/evidence/WO-218/repair-controls.md#r19-protected-retry): bash scripts/test-release.sh --case material; Preflight release; current exit 0, isolated-reversion exit 1. Disposable retry commands exclude protected intake, submodule and linked-worktree rows. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r19-reserved-case (docs/evidence/WO-218/repair-controls.md#r19-reserved-case): node --test --test-name-pattern 'follow-up exports refuse reserved' scripts/test-launchpad-seeds.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. Reserved local export names are compared without ASCII case. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r19-linked-remedy (docs/evidence/WO-218/repair-controls.md#r19-linked-remedy): node --test --test-name-pattern 'nested material keeps linked-worktree' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, isolated-reversion exit 1. Nested linked worktrees retain their preserving move remedy through inventory. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r19-advisory-first (docs/evidence/WO-218/repair-controls.md#r19-advisory-first): node --test --test-name-pattern 'completion names unignored scratch' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, isolated-reversion exit 1. The scratch repository advisory is emitted before candidate-tree hashing can refuse. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r19-submodule-quote (docs/evidence/WO-218/repair-controls.md#r19-submodule-quote): bash scripts/test-release.sh --case submodule_force; Preflight release; current exit 0, isolated-reversion exit 1. A submodule refusal shell-quotes the closing worktree path. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r19-shared-git-primitives (docs/evidence/WO-218/repair-controls.md#r19-shared-git-primitives): node --test --test-name-pattern 'nested material keeps linked-worktree' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, isolated-reversion exit 1. All nested repository readers share the safe Git argument and gitlink parsers. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control am-nested-whitespace (docs/evidence/WO-218/repair-controls.md#am-nested-whitespace): node --test --test-name-pattern 'completion names unignored scratch' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, baseline-module exit 0. The original whitespace check already keeps nested repositories present while excluding their contents. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Broad retry commands can ask an operator to dispose protected material; duplicate Git/path parsers drift and eager fixture removal masks the production whitespace path."
    }
  ],
  "reopenWhen": "A protected path appears in a disposable remedy, linked worktree identity is lost, or lifecycle evidence skips a nested repository."
}
```

## WO-218-D021

```json
{
  "id": "WO-218-D021",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-cf950d70e66c50bf: Share dependency-free harness marker parsing, floor migration and composition between runtime emit and starter seed preflight.",
  "evidence": [
    "Source read in full: docs/evidence/WO-210/decisions.md#wo-210-d030--keep-seed-preflight-independent-of-the-compiled-harness-defer-shared-composition",
    "VER-001 repair control r20-shared-composition (docs/evidence/WO-218/repair-controls.md#r20-shared-composition): node --test --test-name-pattern 'seed preflight and runtime emit share' scripts/test-launchpad-seeds.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. Seed preflight and runtime emission import one dependency-free composition implementation. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Importing the full harness from prebuild seed validation requires a compiled runtime; duplicate composition rules drift on edge cases."
    }
  ],
  "reopenWhen": "Shared composition gains a compiled dependency or no longer recognizes historical seed provenance."
}
```

## WO-218-D022

```json
{
  "id": "WO-218-D022",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-d5d0ef5cf034102e: Refuse an overlay narrowing that would be undone by a Contributor outside-write grant, naming both declarations.",
  "evidence": [
    "Source read in full: docs/evidence/WO-076/decisions.md#wo-076-d008",
    "VER-001 repair control r21-narrowing-grants (docs/evidence/WO-218/repair-controls.md#r21-narrowing-grants): node --test --test-name-pattern 'overlay marker text' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Narrowing cannot be silently restored by a later authority grant. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Silently re-widening a declared envelope misrepresents the operator setting; silently removing the grant changes the equipped support contract."
    }
  ],
  "reopenWhen": "A new grant effect can undo narrowing without a pre-write refusal."
}
```

## WO-218-D023

```json
{
  "id": "WO-218-D023",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-d72bf62d3c82ca3f: For build none, remove compiled navigation and owned generated surfaces while preserving the handwritten floor and an explicit disabled-build disclosure.",
  "evidence": [
    "Source read in full: docs/evidence/WO-076/decisions.md#wo-076-d007",
    "VER-001 repair control r06-navigation (docs/evidence/WO-218/repair-controls.md#r06-navigation): node --test --test-name-pattern 'disabled harness keeps core and kit' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Disabled harnesses retain their floor and remove obsolete role navigation. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Keeping stale Read directives promises skills that have been removed; discarding the whole floor would destroy operator authority."
    }
  ],
  "reopenWhen": "A disabled contract retains a removed compiled role pointer."
}
```

## WO-218-D024

```json
{
  "id": "WO-218-D024",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-da471832071118c7: Bind cleanup retry to the original published tag even when main advances, serialize close attempts, and keep eight inline attempts plus hash-verified archived recovery history.",
  "evidence": [
    "Source read in full: docs/evidence/WO-176/decisions.md#wo-176-d029--deferred-release-retry-and-history-contract",
    "VER-001 repair control r23-moved-main (docs/evidence/WO-218/repair-controls.md#r23-moved-main): bash scripts/test-release.sh --case close_real_writer; Preflight release; current exit 0, isolated-reversion exit 1. An earlier release is retried at its recorded commit after main advances. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r23-foreign-tag (docs/evidence/WO-218/repair-controls.md#r23-foreign-tag): bash scripts/test-release.sh --case close_foreign_tag; Preflight release; current exit 0, isolated-reversion exit 1. An existing tag cannot be adopted by a different order. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r23-serialized-close (docs/evidence/WO-218/repair-controls.md#r23-serialized-close): bash scripts/test-release.sh --case close_overlap; Preflight release; current exit 0, isolated-reversion exit 1. A close records its attempt only after the previous close has released the order lock. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Equating a published tag with today's main blocks legitimate cleanup; truncating without reading archives discards publication authority. Unlimited inline growth adds repeated receipt cost."
    }
  ],
  "reopenWhen": "A retry loses its original publication identity or an archive cannot be verified."
}
```

## WO-218-D025

```json
{
  "id": "WO-218-D025",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-dc79b4b1065bf66e: Decline prebuild rejection based on an invented generated-path inventory. Keep the current post-build staged validation before any destination update.",
  "evidence": [
    "Source read in full: docs/evidence/WO-203/decisions.md#wo-203-d004--carry-in-dispositions-and-the-remaining-pre-build-bound",
    "docs/evidence/WO-203/decisions.md WO-203-D004; scripts/launchpad.mjs atomicBuild and update staged validation."
  ],
  "rejected": [
    {
      "option": "Implement the nominated change now",
      "reason": "Current harm is wasted build time before an absent carried generated path is refused. The incoming compiler still supplies no authoritative prebuild generated inventory; inferring one can falsely authorize deletion. Destination writes remain withheld."
    }
  ],
  "reopens": {
    "decisionId": "WO-203-D004",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "The compiler exposes an authoritative incoming generated-path inventory before atomicBuild."
}
```

## WO-218-D026

```json
{
  "id": "WO-218-D026",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-e62c63344f52405f: Publish complete stash-drop recovery snapshots atomically, retain whole proofs when reflogs change, and name exact stale-lock recovery after an interrupted owner.",
  "evidence": [
    "Source read in full: docs/evidence/WO-171/decisions.md#wo-171-d007--what-a-stopped-apply-resumes-from-one-repair-and-what-stays-boarded",
    "VER-001 repair control r25-stash-proof (docs/evidence/WO-218/repair-controls.md#r25-stash-proof): node --test --test-name-pattern 'stash drop stopped at partial-snapshot' scripts/test-worktree-integration.mjs; Preflight worktree-integration; current exit 0, isolated-reversion exit 1. A stopped stash prune publishes only a complete recovery snapshot. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Silently deleting locks or overwriting a prior proof risks losing a live owner or the only recovery copy; a partial snapshot must never masquerade as complete."
    }
  ],
  "reopenWhen": "An interruption point lacks a whole retained proof or a truthful explicit remedy."
}
```

## WO-218-D027

```json
{
  "id": "WO-218-D027",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-f2d7c420e0778cbe: Normalize innermost rendered links repeatedly until exposed outer links are resolved, preserving nested rendered image structure and line endings.",
  "evidence": [
    "Source read in full: docs/evidence/WO-188/decisions.md#wo-188-d046--verification-follow-up-rewriting-a-nested-destination-can-expose-another-rendered-link",
    "VER-001 repair control r26-nested-links (docs/evidence/WO-218/repair-controls.md#r26-nested-links): node --test --test-name-pattern 'target publication normalizes nested links' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Rewriting an inner link reparses newly exposed outer links until stable. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "One pass can expose a previously hidden outer relative link; flattening all brackets destroys rendered image/link structure."
    }
  ],
  "reopenWhen": "A renderer-visible nested destination remains unresolved or normalization ceases to be idempotent."
}
```

## WO-218-D028

```json
{
  "id": "WO-218-D028",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-f82660a8edb23a4d: Name the owning launchpad when a target registration resolves there but no order is selected from the current launchpad.",
  "evidence": [
    "Source read in full: docs/evidence/WO-072/decisions.md#wo-072-d008--verification-pass-ver-001-f1-and-f2-repaired-the-targets-no-selection-message-is-a-follow-up",
    "VER-001 repair control r27-other-launchpad (docs/evidence/WO-218/repair-controls.md#r27-other-launchpad): node --test --test-name-pattern 'a target registered to another launchpad' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Status names the owning launchpad when the current launchpad cannot select a target. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Selecting another launchpad silently changes authority; a generic no-selection message hides the actionable registration evidence."
    }
  ],
  "reopenWhen": "Cross-launchpad selection semantics change."
}
```

## WO-218-D029

```json
{
  "id": "WO-218-D029",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-fb2a080cc9b597d0: Decline a new recursive discovery contract for bare or unreadable repository-like directories. Keep Git-framed discovery of ordinary ignored and unignored nested repositories, explicitly retaining the metadata-only removal-record gap.",
  "evidence": [
    "Source read in full: docs/evidence/WO-188/decisions.md#wo-188-d003--item-1-a-nested-repository-outside-intake-is-scratch-unless-the-tracked-tree-declares-it-the-close-removes-it-and-records-its-head",
    "docs/evidence/WO-188/decisions.md WO-188-D003; scripts/lib/paths.mjs inspectNestedRepository; scripts/lib/worktree-material.mjs inventoryMaterial; scripts/test-process-debt.mjs nested repository classification cases."
  ],
  "rejected": [
    {
      "option": "Implement the nominated change now",
      "reason": "Current harm is a missing per-repository removal record: a bare or unreadable metadata-only directory outside the preserved lanes can leave with its enclosing worktree unrecorded. The cited source records that limitation, and inventoryMaterial still derives candidates from Git directory entries while inspectNestedRepository requires readable .git metadata. NoOp retains this known discovery boundary. A general recursive walk must first define how to distinguish bare repositories from loose Git-object archives and handle unreadable or symlinked boundaries; inferring ownership or a HEAD from those shapes would add unsupported deletion records."
    }
  ],
  "reopens": {
    "decisionId": "WO-188-D003",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "A bounded discovery and ownership contract identifies bare or unreadable material, defines permission and symlink boundaries, and supplies a truthful removal-record or preservation rule."
}
```

## WO-218-D030

```json
{
  "id": "WO-218-D030",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-0674090dc3c1e64d: Retain synchronized stale-holder closure and preserve Git’s refusal to move an unchecked-out base during its rebase. Name the affected role and recovery for a stale writer lock, mask file-URL and colon-prefixed local paths, retain the merge-and-retry remedy for an unmerged target, and render large fenced bodies without spreading their units into an argument list.",
  "evidence": [
    "Source read in full: docs/evidence/WO-210/decisions.md#wo-210-d042--final-review-pass-final-003-six-low-follow-ups-boarded-none-breaks-a-behavior-main-had",
    "VER-001 repair control r29-rebase-guard (docs/evidence/WO-218/repair-controls.md#r29-rebase-guard): node --test --test-name-pattern 'target close keeps Git'\"'\"'s guard' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Moving an unchecked-out base preserves Git’s rebase guard. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r29-stale-lock (docs/evidence/WO-218/repair-controls.md#r29-stale-lock): node --test --test-name-pattern 'target close names a stale writer transition' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Writer transition lock failures name the checkout role and a recovery route. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r29-local-paths (docs/evidence/WO-218/repair-controls.md#r29-local-paths): node --test --test-name-pattern 'refusal masking names passed paths' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. File URLs and colon-prefixed local paths are masked while HTTPS remains readable. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r29-large-fence (docs/evidence/WO-218/repair-controls.md#r29-large-fence): node --test --test-name-pattern 'a large fenced body' scripts/test-outward-lint.mjs; Preflight outward-lint; current exit 0, isolated-reversion exit 1. A large fenced block does not spread one argument per code point. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control am-stale-holder (docs/evidence/WO-218/repair-controls.md#am-stale-holder): node --test --test-name-pattern 'worktree is deleted and a synced local base closes' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, baseline-module exit 0. A stale base holder already permits close when its local base is synchronized. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r29-unmerged-remedy (docs/evidence/WO-218/repair-controls.md#r29-unmerged-remedy): node --test --test-name-pattern 'WO-072 criterion 4' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. An unmerged target branch keeps its protection and names the merge-and-retry remedy. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Silently accepting an unavailable base loses its judgment; restoring it through unisolated clone configuration can execute commands or fetch another repository."
    }
  ],
  "reopenWhen": "Any close-state recovery changes authority or deletes before both checkouts are judged."
}
```

## WO-218-D031

```json
{
  "id": "WO-218-D031",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-d8297b92b32c8304: Contain the starter refresh fixture's temporary worktrees under its own root. Decline automatic disposal of cleanup ownership after a mapped checkout moves or disappears.",
  "evidence": [
    "Source read in full: docs/evidence/WO-215/decisions.md#wo-215-d018--verification-pass-ver-001s-findings-are-repaired-and-two-follow-ups-are-boarded",
    "WO-215-D018 FU1 moved the actual checkout away; only moving it back allowed recovery, and failed retries retained the close blocker and writer. scripts/lib/starter-refresh.mjs removeOwnedCleanup validates both the clone map and the physical checkout.",
    "VER-001 repair control r30-temp-containment (docs/evidence/WO-218/repair-controls.md#r30-temp-containment): node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. The refresh fixture contains its temporary worktrees beneath its own root. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "FU1 can block every close preview and retry after the original checkout moves or disappears. Restoring the clone mapping alone is insufficient: physicalDirectory(checkout) still requires that actual checkout. Recovery requires restoring the physical checkout at its recorded path or explicit manual ownership recovery. A moved checkout can still own the worktree registry, so absence does not prove ownership ended; automatic disposal risks unrelated Git state. FU2 is repaired by contained fixture cleanup."
    }
  ],
  "reopens": {
    "decisionId": "WO-215-D018",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "The operator supplies a replacement ownership proof for a moved or deleted physical checkout, or the cleanup receipt can verifiably follow its Git common directory without discarding retained work."
}
```

## WO-218-D032

```json
{
  "id": "WO-218-D032",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-eee6c2fa1ef76215: Keep current pending-preview, cleanup-remapping and receipt-provenance behavior; cover changed temporary roots and public-path redaction with the real refresh driver.",
  "evidence": [
    "Source read in full: docs/evidence/WO-215/decisions.md#wo-215-d013--repair-pending-previews-preserve-cleanup-ownership-and-name-receipt-provenance",
    "VER-001 repair control r31-temporary-retry (docs/evidence/WO-218/repair-controls.md#r31-temporary-retry): node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. Cleanup recovery remains bound to its recorded temporary root after TMPDIR changes. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r31-cleanup-privacy (docs/evidence/WO-218/repair-controls.md#r31-cleanup-privacy): node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. The existing cleanup redaction guard withholds recorded private paths in preview and applied recovery. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "The source question is already met for remapping refusal; weakening it to adopt a different clone would cross the stored cleanup binding."
    }
  ],
  "reopenWhen": "A preview mutates cleanup or an applied retry loses receipt provenance."
}
```

## WO-218-D033

```json
{
  "id": "WO-218-D033",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-fd6bb22a13e561e4: Move the README's status instruction after restoring the captured first-order records in the recovered worktree.",
  "evidence": [
    "Source read in full: docs/evidence/WO-210/decisions.md#wo-210-d040--verification-board-the-pre-restoration-status-instruction",
    "VER-001 repair control r32-recovery-instructions (docs/evidence/WO-218/repair-controls.md#r32-recovery-instructions): node --test --test-name-pattern 'an instance exported at v0.81.0 takes this release' scripts/test-launchpad-planning.mjs; Preflight launchpad-planning; current exit 0, isolated-reversion exit 1. The upgrade instructions check phase after restoring the saved records. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A status check before restoring activation records reports the wrong phase and misleads the next action."
    }
  ],
  "reopenWhen": "The recovery sequence changes which step restores the control log."
}
```

## WO-218-D034

```json
{
  "id": "WO-218-D034",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-3a4c476e4e8099bd: Dispose every FINAL-001 finding as the accompanying twenty-row table records: repair admission, target publication/release, literal-rule ownership and starter sequencing; retain the earlier base-ignore, unreadable-output and deadline repairs. For F16, decline inference of a sole identical operator rule removed and re-added between observations; preserve explicit duplicates across interrupted removal and validate recorded ownership artifacts. FINAL-001 F1, F10, F11, F19 and F20 are already-met behaviors, with explicit passing baseline-module commands. Other fixes have individual isolated controls; the unobservable F16 boundary remains declined.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d038--final-review-fail-final-001-at-the-integrated-subject-the-base-ignore-judgment-dies-on-a-populated-ignored-tree-and-nineteen-follow-ups-are-boarded",
    "docs/evidence/WO-218/README.md: FINAL-001 F1 through F20",
    "VER-001 repair control am-close-refusals (docs/evidence/WO-218/repair-controls.md#am-close-refusals): node --test --test-name-pattern 'target close isolates fetched ignore rules' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, baseline-module exit 0. The earlier ignore isolation, unreadable-directory and malformed advisory repairs already hold at the order base. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control am-large-ignore (docs/evidence/WO-218/repair-controls.md#am-large-ignore): node --test --test-name-pattern 'target close judges large NUL-framed base path lists' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, baseline-module exit 0. Large ignored path streams were already handled at the order base. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control am-complete-bound (docs/evidence/WO-218/repair-controls.md#am-complete-bound): node --test --test-name-pattern 'probe wrapper gives a complete test selection' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, baseline-module exit 0. The complete-selection wrapper already applies the documented six-hour ceiling. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-02-origin (docs/evidence/WO-218/repair-controls.md#f1-02-origin): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Admission requires a recorded origin, not merely a parseable current origin. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-03-package-closure (docs/evidence/WO-218/repair-controls.md#f1-03-package-closure): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Helper admission binds package source as well as scripts. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-04-profile (docs/evidence/WO-218/repair-controls.md#f1-04-profile): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Admission honors registered authority expiry, denies and revocation. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control raw-git (docs/evidence/WO-218/repair-controls.md#raw-git): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Raw git receives no helper admission; its mutable configuration remains outside the bound lane. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control raw-npm (docs/evidence/WO-218/repair-controls.md#raw-npm): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Raw npm receives no helper admission; its mutable configuration remains outside the bound lane. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-06-next-version (docs/evidence/WO-218/repair-controls.md#f1-06-next-version): node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A tag already at the merged tip remains a prior release, not this order’s new tag. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-07-ambiguous-push (docs/evidence/WO-218/repair-controls.md#f1-07-ambiguous-push): node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A transport error after tag acceptance still retains the attempted publication binding. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-08-recorded-origin (docs/evidence/WO-218/repair-controls.md#f1-08-recorded-origin): node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A post-cleanup retry stays bound to the recorded target release origin. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-09-draft-commit (docs/evidence/WO-218/repair-controls.md#f1-09-draft-commit): node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A failed draft publication reuses its already prepared commit. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-12-body (docs/evidence/WO-218/repair-controls.md#f1-12-body): node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Draft body input excludes intake and ignored files before publication. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-13-literal-rules (docs/evidence/WO-218/repair-controls.md#f1-13-literal-rules): node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Literal host rules expose only the absolute order-specific node helper. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-15-order-rules (docs/evidence/WO-218/repair-controls.md#f1-15-order-rules): node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Removing one order’s literal rules preserves every rule the other order needs. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-14-rewrite-origin (docs/evidence/WO-218/repair-controls.md#f1-14-rewrite-origin): node --test --test-name-pattern 'host-rule rewrite requires a committed opt-in' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Rewriting host rules checks the origin recorded at start. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-16-sidecar-path (docs/evidence/WO-218/repair-controls.md#f1-16-sidecar-path): node --test --test-name-pattern 'host-rule rewrite requires a committed opt-in' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A sidecar cannot redirect ownership to a different Codex rule path. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-16-removal-journal (docs/evidence/WO-218/repair-controls.md#f1-16-removal-journal): node --test --test-name-pattern 'host-rule rewrite requires a committed opt-in' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Interrupted host-rule removal retains an identical operator rule on retry. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-17-receipt (docs/evidence/WO-218/repair-controls.md#f1-17-receipt): node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A failed target Release records partial publication and its blocker. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-18-gh-preflight (docs/evidence/WO-218/repair-controls.md#f1-18-gh-preflight): node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. Starter refresh verifies forge authentication before pushing a new refresh commit. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f1-18-preview (docs/evidence/WO-218/repair-controls.md#f1-18-preview): node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. Starter preview names both the intended tag and Release. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A text-only host settings file cannot distinguish an unchanged owned occurrence from a sole byte-identical remove-and-readd. No automatic inference is claimed for that case. Sidecar path/hash validation and removal journaling cover the named observable edits and interruptions; explicit duplicates survive retry."
    }
  ],
  "reopens": {
    "decisionId": "WO-221-D038",
    "observation": "WO-218 explicitly triaged the recorded trigger and records the final decline or partial decline here; no unrecorded repair is implied."
  },
  "reopenWhen": "Host settings expose stable rule identities or an observable ownership case bypasses validation."
}
```

## WO-218-D035

```json
{
  "id": "WO-218-D035",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-f64c4d8ab41f49d4: Dispose every FINAL-002 finding with full relative paths, bounded streamed tree reads, pre-push sibling tag checks, safe disposable roots, main-bound helper admission, repository-bound draft reuse, partial-row gate composition and moved-head diagnostics. FINAL-002 F12 changes fixture adequacy: both runtime guards already existed, and separate removals now cause the intended negative cases to fail.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d045--final-review-pass-final-002-at-the-integrated-subject-the-base-refusals-nested-path-naming-leads-thirteen-boarded-follow-ups",
    "docs/evidence/WO-218/README.md: FINAL-002 F1 through F13",
    "npm test -- --review executes the product and changed-machinery cases; npm run test:docs executes the resume claim matrix. Their recorded outcomes and cutoffs are in handoff.md. Cases above are authored; no unrun case is claimed passed.",
    "Coverage correction on 2026-10-20: the earlier README overstated review-only coverage. scripts/test-runner.mjs marks resume document:true and selects it through the document gate; scripts/test-resume.sh invokes test-verifier-gate-claims.mjs. The README and this evidence now require both runs, including a document pass before terminal disposition.",
    "VER-001 repair control raw-gh (docs/evidence/WO-218/repair-controls.md#raw-gh): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Raw gh receives no helper admission; its mutable configuration remains outside the bound lane. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-08-gh-prefix (docs/evidence/WO-218/repair-controls.md#f2-08-gh-prefix): node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A literal gh prefix cannot authorize a later overriding repository argument. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-01-path-names (docs/evidence/WO-218/repair-controls.md#f2-01-path-names): node --test --test-name-pattern 'target close keeps the base judgment and applies delete' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Undeclared ignored output is named by its full relative path. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-02-planned (docs/evidence/WO-218/repair-controls.md#f2-02-planned): node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A refused close reports planned deletion while the output still exists. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-03-streaming (docs/evidence/WO-218/repair-controls.md#f2-03-streaming): node --test --test-name-pattern 'path-list overflow is bounded' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. The tree selector streams all paths while retaining only selected names. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-04-tag-preflight (docs/evidence/WO-218/repair-controls.md#f2-04-tag-preflight): node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs; Preflight launchpad; current exit 0, isolated-reversion exit 1. A conflicting sibling tag refuses before the refresh commit is pushed. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-05-symlink (docs/evidence/WO-218/repair-controls.md#f2-05-symlink): node --test --test-name-pattern 'disposable directory write access before deleting' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Declared output roots cannot traverse symlinked components. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-05-git-case (docs/evidence/WO-218/repair-controls.md#f2-05-git-case): node --test --test-name-pattern 'registration hosts and target release names' scripts/test-configuration-root.mjs; Preflight configuration-root; current exit 0, isolated-reversion exit 1. Git metadata spellings are excluded from disposable roots regardless of case. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-06-registry (docs/evidence/WO-218/repair-controls.md#f2-06-registry): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Target admission binds the worktree registry to main’s recorded registry. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-09-control-root (docs/evidence/WO-218/repair-controls.md#f2-09-control-root): node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs; Preflight harness-fixtures; current exit 0, isolated-reversion exit 1. Admission resolves records through the configured control root. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-10-draft-origin (docs/evidence/WO-218/repair-controls.md#f2-10-draft-origin): node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Draft retry and reuse validate the recorded draft’s repository identity. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-11-partial-row (docs/evidence/WO-218/repair-controls.md#f2-11-partial-row): bash -c 'set -euo pipefail\nunset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID\nsource scripts/test-temp-root.sh\nfixture_base=\"$(resolve_test_tmp_base \"$TMPDIR\")\"\ncreate_test_temp_root \"$fixture_base\" dotln-repair-test\nfixture_root=\"$test_temp_root_result\"\ninstall_test_temp_root_traps \"$fixture_base\" \"$fixture_root\" dotln-repair-test\nnode scripts/test-verifier-gate-claims.mjs \"$fixture_root\"'; Preflight resume; current exit 0, isolated-reversion exit 1. A passing partial row neither replaces nor revokes an earlier complete structural pass. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-12-selection (docs/evidence/WO-218/repair-controls.md#f2-12-selection): bash -c 'set -euo pipefail\nunset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID\nsource scripts/test-temp-root.sh\nfixture_base=\"$(resolve_test_tmp_base \"$TMPDIR\")\"\ncreate_test_temp_root \"$fixture_base\" dotln-repair-test\nfixture_root=\"$test_temp_root_result\"\ninstall_test_temp_root_traps \"$fixture_base\" \"$fixture_root\" dotln-repair-test\nnode scripts/test-verifier-gate-claims.mjs \"$fixture_root\"'; Preflight resume; current exit 0, isolated-reversion exit 1. Same-suite negative review cases exercise the selection requirement itself. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-12-executed (docs/evidence/WO-218/repair-controls.md#f2-12-executed): bash -c 'set -euo pipefail\nunset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID\nsource scripts/test-temp-root.sh\nfixture_base=\"$(resolve_test_tmp_base \"$TMPDIR\")\"\ncreate_test_temp_root \"$fixture_base\" dotln-repair-test\nfixture_root=\"$test_temp_root_result\"\ninstall_test_temp_root_traps \"$fixture_base\" \"$fixture_root\" dotln-repair-test\nnode scripts/test-verifier-gate-claims.mjs \"$fixture_root\"'; Preflight resume; current exit 0, isolated-reversion exit 1. Same-suite negative review cases exercise the executed requirement itself. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-13-moved-head (docs/evidence/WO-218/repair-controls.md#f2-13-moved-head): node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A moved draft head names preservation and review before any rebind. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Top-level-only remedies and success-sounding refusal receipts mislead operators. Raw host prefix rules cannot constrain trailing options; helper-only rows preserve the declared grant boundary."
    }
  ],
  "reopenWhen": "Any of the thirteen source findings recurs."
}
```

## WO-218-D036

```json
{
  "id": "WO-218-D036",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-309c72a92ff260ce: Validate literal host-rule settings and ownership before start creates a worktree or close deletes one; malformed input retains the existing checkouts.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d036--ver-002-follow-up-a-malformed-operator-settings-file-strands-start-and-close-after-their-irreversible-steps",
    "VER-001 repair control r35-settings-preflight (docs/evidence/WO-218/repair-controls.md#r35-settings-preflight): node --test --test-name-pattern 'malformed literal settings refuse target start' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Malformed literal settings refuse before creating either worktree. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Discovering malformed settings after an irreversible step strands a partially created or removed pair."
    }
  ],
  "reopenWhen": "A host-rule precondition first executes after worktree creation or deletion."
}
```

## WO-218-D037

```json
{
  "id": "WO-218-D037",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-fb62261f3877a5cb: Keep generated per-order literal rules and ownership sidecars in the common Git ignore/exclude contract so a second start sees a clean main.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d035--ver-002-follow-up-a-literal-fallback-order-leaves-main-unclean-for-the-next-start",
    "VER-001 repair control r36-rules-cleanliness (docs/evidence/WO-218/repair-controls.md#r36-rules-cleanliness): node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Owned per-order Codex rules do not make main dirty. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Generated local permission state is not product content and must not dirty the shared launchpad for the next order."
    }
  ],
  "reopenWhen": "A generated host-rule path appears as untracked product input at a subsequent start."
}
```

## WO-218-D038

```json
{
  "id": "WO-218-D038",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-cb738250f386b071: Bound path-list overflow diagnostics and stream the fetched tree to retain only relevant paths instead of capturing the whole tree under the candidate ceiling.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d041--ver-003-follow-up-past-the-16-mib-candidate-ceiling-the-base-refusal-echoes-the-captured-path-list",
    "VER-001 repair control r37-path-overflow (docs/evidence/WO-218/repair-controls.md#r37-path-overflow): node --test --test-name-pattern 'path-list overflow is bounded' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A path-list overflow emits a bounded limit and remedy without echoing captured paths. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Echoing a multi-megabyte list is not an actionable refusal, and using a candidate limit on the entire tracked tree rejects otherwise bounded judgments."
    }
  ],
  "reopenWhen": "A large tracked tree or candidate list is emitted in full or bypasses the bounded refusal."
}
```

## WO-218-D039

```json
{
  "id": "WO-218-D039",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-4c9a576536de99ff: Preflight write/search access and every intermediate component of declared disposable roots in both checkouts before deleting either one.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d042--ver-003-follow-up-an-unwritable-declared-directory-stops-the-close-with-a-raw-error-after-part-of-the-declared-output-is-gone",
    "VER-001 repair control r38-write-access (docs/evidence/WO-218/repair-controls.md#r38-write-access): node --test --test-name-pattern 'disposable directory write access before deleting' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Both disposable trees are writable before either deletion starts. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control f2-05-git-case (docs/evidence/WO-218/repair-controls.md#f2-05-git-case): node --test --test-name-pattern 'registration hosts and target release names' scripts/test-configuration-root.mjs; Preflight configuration-root; current exit 0, isolated-reversion exit 1. Git metadata spellings are excluded from disposable roots regardless of case. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A raw permission error after partial deletion cannot preserve the refused close. Case-insensitive .git spellings and symlinked ancestors must never become disposable roots."
    }
  ],
  "reopenWhen": "Filesystem permission or symlink state can cause partial cleanup before refusal."
}
```

## WO-218-D040

```json
{
  "id": "WO-218-D040",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-f32886b04703d3db: Aggregate known gate advisories while preserving null for unavailable observations; retain the already-current fetched-ignore and six-hour deadline behavior.",
  "evidence": [
    "Source read in full: docs/evidence/WO-221/decisions.md#wo-221-d040--bounded-close-safeguards-and-truthful-deadline-text-remaining-review-findings-stay-boarded",
    "VER-001 repair control r39-null-observation (docs/evidence/WO-218/repair-controls.md#r39-null-observation): node --test --test-name-pattern 'preserves unavailable gate-write observations in mixed valid rows' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Any matching null gate-write observation keeps the aggregate unknown. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "An unreadable row cannot prove zero writes. An unavailable observation makes the aggregate unavailable while the actual checkout judgment remains independent."
    }
  ],
  "reopenWhen": "Advisory aggregation turns unavailable evidence into a known empty count."
}
```

## WO-218-D041

```json
{
  "id": "WO-218-D041",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-3c5f5a2bdbe06c07: Resolve moved verification/final-review paths through their recorded immutable target binding in JSON status and the current Markdown projection.",
  "evidence": [
    "Source read in full: docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19",
    "VER-001 repair control r40-moved-status (docs/evidence/WO-218/repair-controls.md#r40-moved-status): node --test --test-name-pattern 'moved decisions and reports resolve' scripts/test-target-worktree-publish.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Status projects moved reports through their immutable target bindings. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Local-only path lookup reports missing evidence after successful relocation; current registration edits cannot retarget historical bindings."
    }
  ],
  "reopenWhen": "A moved report stops resolving or a replacement ref/current registration changes historical bytes."
}
```

## WO-218-D042

```json
{
  "id": "WO-218-D042",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-47eb4d9bdf4cbfa1: Read historical dependency IDs from this instance's historicalWorkOrders configuration; core explicitly declares its two pre-control cases and fresh exports default to none.",
  "evidence": [
    "Source read in full: docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19",
    "VER-001 repair control r41-instance-history (docs/evidence/WO-218/repair-controls.md#r41-instance-history): bash scripts/test-work-orders.sh; Preflight work-orders-fixtures; current exit 0, isolated-reversion exit 1. Historical dependency exemptions belong to the instance configuration. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "A hard-coded core set misclassifies new instances. Mining core's v0.2.0 manifest was rejected after sync showed it names WO-003, not the two pre-control cases; explicit instance data is authoritative."
    }
  ],
  "reopenWhen": "An instance needs a richer historical-evidence schema than a list of order IDs."
}
```

## WO-218-D043

```json
{
  "id": "WO-218-D043",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-98aeb43c543dfbaf: Admit an optional gitmoji prefix before the existing conventional commit type, preserving all existing type and subject refusals.",
  "evidence": [
    "Source read in full: docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19",
    "VER-001 repair control r42-gitmoji (docs/evidence/WO-218/repair-controls.md#r42-gitmoji): node --test --test-name-pattern gitmoji scripts/test-outward-lint.mjs; Preflight outward-lint; current exit 0, isolated-reversion exit 1. One leading gitmoji does not bypass or invalidate the conventional title grammar. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Core itself uses gitmoji subjects; stripping the conventional type requirement would broaden the rule beyond the reported mismatch."
    }
  ],
  "reopenWhen": "Conventional subject grammar or supported gitmoji notation changes."
}
```

## WO-218-D044

```json
{
  "id": "WO-218-D044",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-806a8fccc51377b7: Admit registration release.displayName using the launchpad's shape and 64-character limit, default to the registration ID, and print the title in preview, tag annotation and receipt without renaming old Releases.",
  "evidence": [
    "Source read in full: docs/planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass",
    "VER-001 repair control r43-release-display (docs/evidence/WO-218/repair-controls.md#r43-release-display): node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. A target release uses its configured display name in the title. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Using the order title or mutating older published Releases would change history rather than name this registration's future releases."
    }
  ],
  "reopenWhen": "A new naming requirement affects tag identity or a previously published Release."
}
```

## WO-218-D045

```json
{
  "id": "WO-218-D045",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-a9fdacb0bbcdb97a: Exclude annotated Starter tags carrying Core commit provenance from instance local release baselines; retain reachable ordinary tags, and teach no-tags upstream fetch plus named non-tag preview refs. Local preparation excludes ordinary tags outside the subject’s ancestry as well as starter tags. Worktrees share tags; an unintegrated sibling release is not this subject’s baseline. This matches local surface checking; publication continues to observe origin. The separate r44-ancestral-local control proves the ordinary-tag boundary.",
  "evidence": [
    "Source read in full: docs/planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass",
    "VER-001 repair control r44-starter-baseline (docs/evidence/WO-218/repair-controls.md#r44-starter-baseline): node --test --test-name-pattern 'planning and release-close reads run in a fresh exported instance' scripts/test-launchpad-planning.mjs; Preflight launchpad-planning; current exit 0, isolated-reversion exit 1. Starter provenance tags do not set an instance local release baseline. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json.",
    "VER-001 repair control r44-ancestral-local (docs/evidence/WO-218/repair-controls.md#r44-ancestral-local): bash scripts/test-release.sh --case prepare_independent; Preflight release; current exit 0, isolated-reversion exit 1. Local preparation excludes ordinary tags on unintegrated histories while counting reachable releases. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Deleting tags by hand is temporary: another fetch restores them. Blanket ignoring high tags would hide legitimate instance releases."
    }
  ],
  "reopenWhen": "Starter tag provenance changes or an ordinary release is wrongly excluded."
}
```

## WO-218-D046

```json
{
  "id": "WO-218-D046",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "FUP-4c243998cedd4597: Add baseDisposablePolicy judge-only while keeping delete as the default. Both policies judge all base material; only target output is deleted in judge-only, and tracked incoming collisions with retained ignored files refuse before either checkout changes.",
  "evidence": [
    "Source read in full: docs/planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass",
    "VER-001 repair control r45-base-policy (docs/evidence/WO-218/repair-controls.md#r45-base-policy): node --test --test-name-pattern 'target close keeps the base judgment and applies judge-only' scripts/test-target-worktree-close.mjs; Preflight target-worktree; current exit 0, isolated-reversion exit 1. Judge-only retains base output after the same refusal checks. Exact scope, source and output hashes: docs/evidence/WO-218/repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Keep the prior behavior or broaden the change beyond the named contract",
      "reason": "Skipping base judgment would weaken the close envelope; retaining ignored output without merge collision protection can still overwrite it."
    }
  ],
  "reopenWhen": "Another update step can modify judge-only retained base output."
}
```

## WO-218-D047

```json
{
  "id": "WO-218-D047",
  "date": "2026-10-20",
  "dispatch": "resume: next",
  "decision": "Prepare application v0.87.0 as a minor. Bump compiler 0.27.1 to 0.28.0 for compiled navigation, skeleton 0.62.0 to 0.63.0 for the new refusal and recovery contracts, and console 0.4.2 to 0.4.3 for its changed workspace pins. Preserve dependency inventory. Remint deterministic authority, artifact and verification evidence, regenerate the installed harness, use a new role baseline, and carry the existing live feedback audit into a new edition because only its normalized release labels changed.",
  "evidence": [
    "npm run release -- prepare --local selected v0.87.0 over local v0.86.0; WO-218-D001 records that selection.",
    "npm run build passed before and after component changes. npm run sync completed successfully with every artifact current after D051. docs/evidence/current.json selects WO-218 authority/002, artifact-identity/001, verification/001 and feedback-001; prior editions remain intact.",
    "FEEDBACK_SOURCE_PATHS in packages/skeleton/src/feedback-audit.ts names neither harness-host.ts nor Contributor. Its changed files here are package-lock.json, packages/skeleton/package.json and the COMPILER_PACKAGE_VERSION literal in packages/compiler/src/artifact-identity.ts. feedbackSourceFile projects manifest labels and local workspace pins; evidenceSourceContent additionally normalizes the compiler release literal. The compiler bump moved the policy hash, so sync carried the WO-222/feedback-001 live audit into WO-218/feedback-001. The new edition records identical judged behavior, changed pins and its carriedFrom reference; no new live episode is owed.",
    "The role baseline packages/skeleton/fixtures/wo218-role-baseline.json follows the historical WO-221 baseline without rewriting it. Generated role text, runtime snapshot and evidence-source checks remain required by the complete gate.",
    "The comment-label baseline only shrank: node scripts/harness.mjs bounded -- node scripts/comment-labels.mjs --write removed two absent fingerprints, admitted none.",
    "The two read-only review workers reported 29 findings across their group and whole-diff passes; self-review.md records them. The operator then explicitly requested a third worker for different executable probes.",
    "The supplemental NoOp review added four findings after the first 29 review findings and the three probe findings. self-review.md records all 36 addressed findings, including corrections to retained-limit descriptions."
  ],
  "rejected": [
    {
      "option": "Skip generated evidence or rewrite a historical baseline to match",
      "reason": "That would discard the source identity the checks are intended to preserve."
    },
    {
      "option": "Run a new feedback model episode merely because workspace version strings changed",
      "reason": "The checked behavior projection excludes those labels. The deterministic carry preserves the live audit and updates the compiled policy binding; a new model episode would judge unchanged behavior."
    },
    {
      "option": "Keep duplicate prebuild and runtime floor parsers",
      "reason": "The shared dependency-free module retains one rule. The seed fixture compares 400 floor combinations against emit; its execution outcome belongs to the complete gate."
    }
  ],
  "reopenWhen": "A judged feedback behavior file changes, a deterministic evidence check stales, or the release baseline changes before publication."
}
```

## WO-218-D048

```json
{
  "id": "WO-218-D048",
  "date": "2026-10-20",
  "dispatch": "resume: next; operator instruction: use one additional subagent whose sole job is different probes and ad hoc scripts to try to break the code",
  "decision": "Run a third isolated adversarial worker and repair its three executable counterexamples: admit omitted and empty historical-order configuration, verify a recorded draft remote head even on a same-tree retry, and require the immutable record reference repository to equal its lifecycle binding. Also screen overlay parameter property names for marker text after the worker observed that values alone were screened.",
  "evidence": [
    "Third worker launched gpt-6.1-sol/max without inherited history; actual effective model readback unavailable. It wrote only synthetic fixtures and scripts under its assigned system-temporary scratch directory.",
    "target-boundaries.mjs: moved same-tree draft retry returned success before the repair; a foreign record.repositoryId returned the bound blob before the repair. The complete probe report is recorded in self-review.md.",
    "config-overlay-stash.mjs: original optional-history configuration failed because distinctList rejects empty arrays; a dedicated validator now admits omitted, [] and valid distinct IDs. The worker independently reran all three valid forms successfully.",
    "scripts/test-configuration-root.mjs: historical order configuration admits no history and rejects malformed history; scripts/test-target-worktree-publish.mjs: draft lifecycle case now refuses moved and absent remote branches without changing local HEAD/index, and moved-record case refuses a foreign repository ID.",
    "scripts/test-harness.mjs: overlay marker text and narrowing undone by grants refuse before writing now includes a marker in a nested parameter key. Generated-output impact of the observed key gap was not established; the decoder repair follows the existing no-marker schema contract.",
    "Other probe cases passed: push then gh edit failure retry kept one PR; valid immutable binding read; invalid hash refused; undeclared nested bare repository preserved target output; cleanup succeeded after its blocker was removed. The stash experiment was inconclusive due to fixture setup, and no new stash defect is claimed."
  ],
  "rejected": [
    {
      "option": "Treat a matching local tree as proof of remote publication",
      "reason": "The remote branch can move or disappear without changing that tree; the existing isolated remote-head observation must precede the success message."
    },
    {
      "option": "Ignore an inconsistent repository field because current callers construct it correctly",
      "reason": "The exported immutable reader promises a complete binding and can reject the inconsistent argument cheaply at its boundary."
    }
  ],
  "reopenWhen": "The same-tree retry bypasses remote observation, any immutable binding component is ignored, or the optional history schema rejects an empty instance."
}
```

## WO-218-D049

```json
{
  "id": "WO-218-D049",
  "date": "2026-10-20",
  "dispatch": "resume: next; complete review repairs",
  "decision": "Repair the complete review counterexamples without relaxing the contracts: keep pre-review commit lint independent of the compiled publication runtime, put target publication authorization in a pure helper, preserve historical seed provenance across navigation whitespace migration, avoid moving an already synchronized base held by a stale worktree entry, retain the original close retry mode through preflight, and report a landed starter push even when only cleanup fails. Update fixtures to declare instance identity/history, use valid commit subjects, and exercise their intended failure boundary.",
  "evidence": [
    "The first complete review failed configuration-root because importing target publication lint also loaded @dotln/compiler in a source-only fixture. scripts/lib/target-commit-lint.mjs now shares commit reads without that runtime; the focused configuration-root run passed 22 tests.",
    "The fourth complete review, npm test -- --review --keep-going, completed 106 fresh tasks in 1605.43 seconds: 30 suites passed and 13 failed. Failures and complete output remain in the session gate evidence; no failure is represented as a pass.",
    "packages/skeleton/test/scenario.test.ts: one typed reactor and its pure helpers own kernel decisions. target-publication-policy.ts takes an explicit time and profile; harness-host.ts now performs only host observations and uses that pure result.",
    "scripts/test-launchpad-seeds.mjs: historical starter floors retain provenance through navigation migration. Only whitespace immediately before the generated block is normalized for seed comparison; text after the block remains part of the comparison.",
    "scripts/test-target-worktree-close.mjs: synchronized and behind stale-holder matrices; exact original-mode retry assertions; judge-only tracked-path collision; both checkout permission and symlink cases.",
    "scripts/test-launchpad-update.mjs: starter refresh publishes one verified commit and preserves every refusal boundary, including successful publication followed by cleanup failure.",
    "scripts/fixtures/launchpad-cases.json and target-worktree-cases.json retain every prior case and add two launchpad names and twelve target names (nine new declarations plus expanded variants). Their census is 31 launchpad declarations, 48 target declarations and 72 target names.",
    "Focused repair results and the final fresh complete review outcome are recorded in handoff.md; authored repairs do not themselves claim those checks passed."
  ],
  "rejected": [
    {
      "option": "Permit direct host authorization or skip the architecture assertion",
      "reason": "The existing architecture contract keeps kernel decisions in pure functions; extraction preserves that contract and the admission behavior."
    },
    {
      "option": "Use implicit core contribution/history defaults to make old fixtures pass",
      "reason": "That would reintroduce the instance leaks this order removes. Synthetic repositories now declare their own identity and historical IDs."
    },
    {
      "option": "Update a stale-holder base even when its object ID already equals the fetched base",
      "reason": "Git rejects the unnecessary update and strands an otherwise safe close. A behind holder still refuses with its preservation remedy."
    }
  ],
  "reopenWhen": "A repaired case regresses, pure policy imports host effects, seed comparison ignores customized text, or a close retry changes the recorded operation."
}
```

## WO-218-D050

```json
{
  "id": "WO-218-D050",
  "date": "2026-10-20",
  "dispatch": "resume: next; supplemental NoOp review and focused repair",
  "decision": "Correct three inaccurate retained-limit descriptions and repair interrupted host-rule removal with a before/after journal and atomic settings replacement. Limit starter executable-mode planning to managed paths that applyKitUpdate actually writes, preserving customized seed modes.",
  "evidence": [
    "The reused criteria adversary reported four findings over D004, D019, D031 and D034. D004 now names the fresh previous-phase beacon window; D019 names close fetch isolation and absent-target ownership recovery; D031 requires the physical checkout, not just its mapping.",
    "scripts/lib/target-worktrees.mjs formerly replaced settings before deleting its ownership sidecar; a stopped removal could delete a surviving duplicate on retry. The host-rule lifecycle fixture now stops before and after settings replacement and checks both recovery and intervening operator edits.",
    "The focused starter-refresh repair run at 2026-10-20T03:58:12.673Z failed with planned but not staged: .gitignore. Source inspection found mode planning iterated all prepared export writes, including a kept instance seed that applyKitUpdate never writes. Mode planning now uses only add/replace entries and their candidates.",
    "scripts/test-launchpad-update.mjs retains the kept .gitignore executable-mode and customized CLAUDE cases; a managed script mode-only update now must refresh successfully. Final focused and complete execution outcomes belong to handoff.md.",
    "Focused repair execution: the host-rule interruption case passed under harness bounded in 10,703 ms at 2026-10-20T04:03:18.396Z; the complete starter-refresh scenario passed in 97,431 ms at 2026-10-20T04:05:06.301Z, including preserved seed modes and the managed mode-only refresh."
  ],
  "rejected": [
    {
      "option": "Treat an interrupted duplicate removal as the unobservable sole-rule limitation",
      "reason": "The surviving journal and changed allow list are observable; skipping a journal would leave avoidable operator-rule deletion."
    },
    {
      "option": "Normalize modes on kept starter seeds",
      "reason": "Those seeds belong to the instance and the existing update plan preserves them. Only managed add/replace entries are scheduled for writes."
    }
  ],
  "reopenWhen": "A removal retry deletes more than its owned occurrence, an intervening settings edit is silently adopted, or mode planning includes an unwritten seed."
}
```

## WO-218-D051

```json
{
  "id": "WO-218-D051",
  "date": "2026-10-20",
  "dispatch": "resume: next; Adjacent Repair adjacent-0001",
  "decision": "Use the existing evidenceArgs selector in the artifact-identity and verification evidence generators, admitting the explicit edition/revision arguments that sync already supplies. Preserve immutable writes and the current manifest until sync validates the newly generated edition.",
  "evidence": [
    "npm run sync failed after the compiler release changed: artifact-evidence and verification-evidence rejected --edition/--revision with their single-mode usage messages; both scripts read process.argv.slice(2) directly while sync passes those selectors.",
    "scripts/test-evidence-sources.mjs: synthetic evidence generators select immutable editions explicitly. The bounded focused run passed in 8,134 ms at 2026-10-20T04:08:22.313Z; both commands write/check a named edition, keep the current manifest and historical bytes unchanged, and refuse to overwrite changed edition bytes.",
    "npm run sync subsequently exited 0 with all artifact rows current, selecting WO-218/artifact-identity/001 and WO-218/verification/001. The queue records the diagnosed scope, intent announcement, actor-attested steering check and passing results."
  ],
  "rejected": [
    {
      "option": "Temporarily repoint current.json or rewrite an older edition to work around the CLI mismatch",
      "reason": "That bypasses the canonical validate-before-selection path and risks replacing historical evidence. The shared parser already expresses the intended command contract."
    }
  ],
  "reopenWhen": "A generator rejects sync selectors, changes the default selection during an explicit write, or overwrites an existing edition."
}
```

## WO-218-D052

```json
{
  "id": "WO-218-D052",
  "date": "2026-10-20",
  "dispatch": "resume: next; Adjacent Repair adjacent-0002",
  "decision": "Send SIGKILL to an authority-probe process group only until a send succeeds. Preserve the first-send errors and retries after ESRCH. Correct the exported planning fixture to retain the Starter tag it deliberately created while continuing to require no target tags.",
  "evidence": [
    "The sixth complete npm test -- --review --keep-going run finished at 2026-10-20T04:42:06.604Z: 41 suites passed, 2 failed, 106 fresh tasks, 1,717,198 ms. Code identity and build output stayed unchanged throughout. The failures were launchpad-planning and harness-probe; none is represented as a pass.",
    "scripts/test-launchpad-planning.mjs: planning and release-close reads run in a fresh exported instance reached its final empty-tag assertion after creating annotated Starter v99.0.0 for the release-baseline check. The source fixture removes only its ordinary v100.0.0 tag. The final assertions now require kitMain v99.0.0 and no target tags; the next complete run judges this correction.",
    "scripts/test-authority-probe.mjs: owned process group and descendants stop on SIGTERM failed with kill EPERM in runAuthorityProcess finally. The function unconditionally signaled the detached group after an earlier successful interruption send. The exact operating-system reason for the original EPERM is unknown.",
    "A bounded counterfactual added an EPERM fault only on a second SIGKILL to the observed fixture group. Before the implementation change, the SIGTERM case failed at the final kill in 716 ms at 2026-10-20T04:42:41.278Z. After the successful-send guard, all four existing owned process group and descendants stop cases (timeout, SIGINT, SIGTERM and abort) passed under harness bounded in 5,802 ms at 2026-10-20T04:42:59.678Z. Each still checks descendant death, a stopped heartbeat and restored signal listeners.",
    "Current Node.js documentation was fetched through ctx7: https://github.com/nodejs/node/blob/main/doc/api/process.md and https://github.com/nodejs/node/blob/main/doc/api/child_process.md describe signal delivery, errors and PID reuse. Those docs support avoiding an unnecessary later signal; they do not establish the OS cause observed in this run.",
    "scripts/lib/authority-probe.mjs and its test are declared harness-probe machinery inputs, outside evidenceSources and FEEDBACK_SOURCE_PATHS. The final complete review remains required; no new feedback episode is triggered by this repair."
  ],
  "rejected": [
    {
      "option": "Keep the unconditional final group signal or swallow every EPERM",
      "reason": "NoOp retains a redundant signal after a successful send and the reproduced cleanup failure. Swallowing EPERM would hide a first-send refusal. Recording successful delivery avoids the duplicate while preserving actual signaling errors."
    },
    {
      "option": "Delete the fixture Starter tag to recover the old empty-tag assertion",
      "reason": "The fixture deliberately retains that tag to prove it is excluded from the instance release baseline. The teardown expectation should preserve that evidence."
    }
  ],
  "reopenWhen": "A cleanup callback sends another group signal after a successful send, descendants survive the single send, or the fixture ceases to preserve its Starter-tag baseline case."
}
```

## WO-218-D053

```json
{
  "id": "WO-218-D053",
  "date": "2026-10-20",
  "dispatch": "resume: next; release classification assignment delegated by the reviewed order",
  "decision": "Bind the already assigned minor release classification through the canonical execution-amendment route. This records the authorized activation choice and keeps every objective, criterion, dependency and non-goal unchanged.",
  "evidence": [
    "Operator dispatch: resume: next. The reviewed WO-218 Release classification paragraph explicitly assigns classification at activation from the fixes: patch unless a command, flag, schema or refusal changes, then minor. This is the existing authorization; no new scope or operator instruction is inferred.",
    "The work-order diff consists of its assigned v0.87.0 title and the explicit minor classification with its rationale. The new stash continuation flag, instance contribution identity, release displayName, baseDisposablePolicy and refusal contracts meet the reviewed minor condition. D001 and D047 record the release and component selections.",
    "The document gate at 2026-10-20T05:16:37.607Z passed 24 suites and failed three. plan and plan-refutation-current both reported existing work-order bytes changed. scripts/lib/plan-continuation.mjs normalizes an assigned release title but does not normalize the classification paragraph; scripts/lib/release-preparation.mjs requires an explicit patch, minor or major header.",
    "docs/product/07-execution-guide.md Retained planning follow-ups and scripts/lib/plan-receipts.mjs amendPlanOrder provide the existing text-bound execution-amendment route. Binding this decision records the already delegated assignment and supplies neither a planning verdict nor a hold disposition."
  ],
  "rejected": [
    {
      "option": "Return the classification to its unassigned placeholder or describe the delivered behavior as patch",
      "reason": "The order delegates an actual classification at activation, the delivered contracts meet its minor condition, and release preparation requires the explicit result. Reverting that choice would hide the reason the minor was selected."
    },
    {
      "option": "Invent a new operator authorization or planning verdict",
      "reason": "The original reviewed classification rule and resume: next already authorize this bounded assignment. The canonical amendment binds that evidence without granting new scope."
    }
  ],
  "reopenWhen": "The classification condition, assigned behavior, or any accepted non-bookkeeping order text changes."
}
```

## WO-218-D054

```json
{
  "id": "WO-218-D054",
  "date": "2026-10-20",
  "dispatch": "resume: next; Adjacent Repair adjacent-0003; document-gate repair",
  "decision": "Give only composeRepairDouble an explicit clock one minute before its historical authority expires. Preserve the historical loadout and filed reports; the production authorization still judges its supplied clock. Consume the existing passing complete-review row because its code identity remains current, and rerun the document gate after the fixture and classification-binding repairs.",
  "evidence": [
    "The pre-disposition document gate finished at 2026-10-20T05:16:37.607Z in 165,721 ms: 24 suites passed, three failed, none unrun. The resume suite, including the edited verifier-gate-claims matrix, passed in 85.14 seconds. The failing suites were plan, plan-refutation-current and skeleton-docs.",
    "The skeleton failure was [document] WO-181 AC3: only blocking review findings enter real bounded repair and fresh re-verification, with profile-refused: source-change local command authority. docs/evidence/WO-056/worker-loadout.json expiresAt is 1792454400000, which evaluates to 2026-10-20T00:00:00.000Z. composeRepairDouble omitted RepairHost now, so it used the later wall clock.",
    "docs/evidence/WO-181/fixture.mjs now supplies now as the original authority expiry minus 60,000 ms only to the process double. The existing case passed under harness bounded in 2,583 ms at 2026-10-20T05:19:56.693Z, exercising real bounded repair and fresh re-verification. The historical loadout bytes were not changed.",
    "npm run plan -- amend-order WO-218 WO-218-D053 recorded PlanExecutionAmended at 2026-10-20T05:19:20.423Z. The bounded npm run plan -- check then passed in 4,977 ms at 2026-10-20T05:20:29.274Z and reported the authorized-execution-amendment. D053 is its unchanged text-bound authority decision.",
    "gateCodeIdentity after these repairs equals the complete review row recorded at 2026-10-20T05:12:38.263Z. The changed fixture is a document-gate input under docs/evidence, outside product code identity and the registered evidence and feedback inventories. A fresh document gate is required at the changed tree; no product pass is inferred from the focused check."
  ],
  "rejected": [
    {
      "option": "Extend the historical grant expiry or ignore an expired profile in the runtime",
      "reason": "That would change the recorded authority or weaken its enforcement. The process-double scenario needs a deterministic time within the grant it deliberately replays."
    },
    {
      "option": "Treat the failed document row as a passing handoff or erase the classification assignment",
      "reason": "The missing amendment and expired fixture must be repaired at their actual boundaries, then the document gate must execute again."
    }
  ],
  "reopenWhen": "A process double depends on the wall clock for its historical authority, or the document fixture exercises a different authority-time contract."
}
```

## WO-218-D055 — VER-001: fail; criterion 2 is unmet because five settled rows name no case that fails without their fix under a Preflight suite

```json
{
  "id": "WO-218-D055",
  "date": "2026-10-20",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 at code identity 6ff9b8345d5f47059d28d30a9ae07ca93150b5bc234c0a9935f29e24251cb890. Criteria 1 and 3 to 7 are met; criterion 2 is unmet. F1 (blocking, criterion 2): five settled rows name no case that fails without their fix under a suite the Preflight line names. FUP-f32886b04703d3db (D040): the null-row aggregation is implemented in closeTargetWorktree, but no fixture records a gate row whose baseCheckoutWrites is null, and the named case 'target close isolates fetched ignore rules, retains unreadable output and tolerates unavailable gate advisories' is unchanged from the base and passes there; its malformed and [null] index checks are WO-221-D040's earlier repair. FUP-cf950d70e66c50bf (D021): both named seed cases pass at the base, although scripts/lib/starter-seeds.mjs now composes through scripts/lib/harness-instruction.mjs. FUP-cc27c2c1a82fed2c (D020): the named release cases material (unchanged) and close_retry_paths (only its planted record gains schemaVersion and workOrderId) pass at the base, and the third named case, the process-debt nested-repository case, passes at the base and runs outside the Preflight suites. FUP-f64c4d8ab41f49d4 (D035): FINAL-002 F2's repair, scripts/release.mjs line 285 printing planned for deletion unless the cleanup outcome is removed, has no case, and the README names the same unchanged isolates case for it; the order's Design settles a WO-221 review row only when each finding has its case or its recorded decline. FUP-acdc329e47638889 (D018): its one case, the undeclared-corpus and missing-edition block of scripts/test-publication.sh, fails at the base as claimed but runs only under publication-fixtures, while the Preflight line names publication, which --only matches exactly and which runs node scripts/check-publication.mjs on the real corpus. The other 35 settled rows each name at least one case that fails at the base on a behavioral assertion. Follow-ups F2 to F4 are boarded here; D056 records receipt 049's occurred conditions (F5).",
  "evidence": [
    "Base runs: a scratch clone of main at a66981acfcb4c451f9ef0417c2625ef809e4dc72 (the order's base) with only the subject's scripts/test-* files, scripts/lib/target-worktree-fixture.mjs, scripts/fixtures/*.json and packages/skeleton/fixtures/wo218-role-baseline.json overlaid, built with npm run build, its push URL blocked; each case ran under node scripts/harness.mjs bounded, one at a time, on 2026-10-20 between 12:05Z and 12:27Z.",
    "Passing at the base: scripts/test-target-worktree-close.mjs 'target close isolates fetched ignore rules, retains unreadable output and tolerates unavailable gate advisories' (ok); scripts/test-launchpad-seeds.mjs 'starter seed floor rule agrees with the harness emit's composition' and 'historical starter floors retain provenance through navigation migration' (2 of 2 ok, exit 0); bash scripts/test-release.sh --case material, --case close_retry_paths, --case close_completion and --case close_leftover (each exit 0, 'release tests passed'); scripts/test-process-debt.mjs 'closeout classifies nested repositories: outside intake they are scratch, removed with a record, and every blocker names its lane and remedy' (ok).",
    "bash scripts/test-publication.sh at the base exits 1 with 'undeclared publication claimed stale'. scripts/test-runner.mjs declares node('publication', 'scripts/check-publication.mjs', ...) and shell('publication-fixtures', 'scripts/test-publication.sh'); --only selects the row whose name equals its argument; node scripts/test-runner.mjs --only publication --list prints the six structural tasks and publication, and --only publication-fixtures prints publication-fixtures.",
    "git diff HEAD -- scripts/test-target-worktree-close.mjs has no hunk inside the isolates case (subject lines 472 to 634). baseCheckoutWrites appears in the tests only at scripts/test-target-worktree-close.mjs:588 and scripts/test-target-worktree-release.mjs:141, 142 and 413, none recording a null gate row; no test contains 'planned for deletion'. Main printed deleted for every non-preview close (git show HEAD:scripts/release.mjs line 266).",
    "WO-221-D043 reopens WO-221-D040 with a repair rule that ends 'add the fixture'; WO-221-D045's followup asks each FINAL-002 follow-up for 'a fixture that fails without the fix'; WO-210-D030's followup for FUP-cf950d70e66c50bf is a refactor into a shared module.",
    "Unnamed cases that do fail at the base and can carry evidence: bash scripts/test-release.sh --case submodule_force (exit 1, the shell-quoted subject, one of D020's seven items); 'target close keeps the base judgment and applies ${policy} only to base output', which asserts nested/.env naming at scripts/test-target-worktree-close.mjs:1076 to 1079 (FINAL-002 F1); bash scripts/test-release.sh --case close_real_writer (exit 1: 'v0.2.1 already exists remotely for a different or non-annotated object', D024's moved-main retry); 'a large fenced body retains its rendered units without an argument limit' (RangeError at the base, WO-210-D042 B1).",
    "Named cases failing at the base on behavioral assertions (read in each output): configuration-root 4 of 4; harness-fixtures 6 of 6, one only as 'grantedSessionRoot is not a function' while its WO-168 sibling fails on behavior; worktree-integration 6 of 8 once the fixture's copy of the new root dotln.config.json is dropped; target-worktree start 4 of 5, publish 4 of 4 with the new scripts/lib/target-record-reader.mjs copied in so the file imports, release 2 of 2, close 9 of 17; outward-lint gitmoji 3 of 4 (the fourth is a guard); launchpad replaced-blob, starter refresh and both planning cases; siblings 2 of 2; work-orders historical ids; the verifier gate-claims script at its new partial-row assertion (line 344, with main's 'run npm run sync' remedy)."
  ],
  "rejected": [
    {
      "option": "Pass on the executor's mapping and the complete review",
      "reason": "The complete review shows the named cases pass with the fixes; criterion 2 asks for a case that fails without the fix, and these pass at the base. Receipt 049's criterion:2 known issue names exactly this check."
    },
    {
      "option": "Count publication-fixtures as Preflight coverage because the complete review ran it",
      "reason": "Criterion 2 names the suites of the Preflight line; npm test -- --only publication does not run scripts/test-publication.sh."
    },
    {
      "option": "Correct the records or add the cases in this verification",
      "reason": "A verifier never edits the implementation or the executor's records it judges; the repair holds the rule below."
    }
  ],
  "followup": "WO-218's repair, inside its declared surfaces. F1 (blocking): give FUP-f32886b04703d3db a fixture whose matching gate rows record baseCheckoutWrites null (WO-221-D043's null-advisory-masquerade arrangement) and that asserts the receipt's null and the unavailable advisory; give FINAL-002 F2 a case in which a refused publishing close reports its declared output as planned, never deleted, with the files present; give FUP-cf950d70e66c50bf a case that fails without the shared composition, such as an import-closure assertion that the seed preflight and emit compose through scripts/lib/harness-instruction.mjs, or re-dispose it; give FUP-cc27c2c1a82fed2c a case per item that fails at the base (submodule_force already covers the shell-quoted subject), or re-dispose the uncovered items; put FUP-acdc329e47638889's case in a suite the Preflight line names, or obtain an operator-authorized Preflight amendment. For every settled row and WO-221 finding, record the named case's run with that fix reverted (command, revert scope, result) beside its passing run. A row whose named case passes at the base is re-disposed as already met with the command and its output, or declined within the one-third cap with harm, evidence and reversal, never relabelled; every existing refusal stays at least as strong (WO-042). F2 (follow-up): correct the README and decisions where a named case passes at the base: D024 names close_real_writer and gains the foreign-tag refusal case and the concurrent-close case WO-176-D029 asks for (no test expects 'belongs to another order or commit'); D030's A2, A3 and A4 have no case, and A5 and B1 have unnamed ones (the WO-072 criterion 4 case and the large-fence case); D006 records WO-169-D006's first defect as already met with the command and output; D014 and D007 name their failing cases. F3 (follow-up): CONTRIBUTING.md line 17 still says the operator identity is pinned in scripts/lib/contributions.mjs; it is now dotln.config.json contributions.operatorAuthor. F4 (follow-up): release prepare --local now reads ancestralLocalTags (scripts/release.mjs line 3599), which drops ordinary local tags HEAD does not reach as well as starter tags; record that change and its reason in D045 and product 07, whose text says ordinary tags still count, or limit it to the starter exclusion.",
  "reopenWhen": "A repair names, for each settled row and WO-221 finding, a Preflight-suite case recorded failing with its fix reverted and passing with it, or re-disposes the row; or a named case is shown passing with its fix reverted."
}
```

## WO-218-D056 — VER-001: planning receipt 049's criterion:2 and criterion:5 reopening conditions for WO-218 have occurred

```json
{
  "id": "WO-218-D056",
  "date": "2026-10-20",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Record that two reopening conditions of planning receipt 2026-10-19-planning-638b4f9f2a2e3afb-049's known issues for WO-218 have occurred, independently of the verdict. criterion:2's condition, a verification of WO-218 running a settled row's named case at the order's base with the fix reverted and seeing it pass: the cases D020, D021 and D040 name pass at a66981ac (D055). criterion:5's condition, the objective's pending-count sentence still unamended when the before-and-after counts show no fall: the README records global pending 158 at entry and 158 after application, and the objective still says the register's pending count falls by the number of rows settled and declined. The README makes no claim of a fall. Route: planning.",
  "evidence": [
    "The verify briefing's receipt 049 known issues for criterion:2 and criterion:5, with their Reopen when text.",
    "docs/evidence/WO-218/README.md After: global pending 158 at entry, 166 before application and 158 after, and 'These are the observed counters, not a claim that global pending fell by 45.'; npm run plan -- followups --touching at revision 7b5099124610320012bea26b0bf046f0e39c69e1100247f5be8721e858703e9e reports pending 158.",
    "docs/work-orders/WO-218-boarded-follow-ups-the-instance-and-publication.md Objective (lines 66 to 72), unchanged by D053's classification amendment; D055's base runs."
  ],
  "rejected": [
    {
      "option": "Fail criterion 5 on it",
      "reason": "Criterion 5 asks for the tables and the counts, which the README holds; the stale sentence is the objective's, which only an operator-authorized amendment changes."
    },
    {
      "option": "Leave it in the report only",
      "reason": "A reopening condition the record shows as occurred is recorded as a decision with a named follow-up for the planning pass, as WO-216-D025 did."
    }
  ],
  "followup": "Next planning pass: reopen receipt 049's criterion:2 and criterion:5 known issues for WO-218. Decide whether a batch order's settled rows must record their named case run with the fix reverted (D055 shows three rows whose named cases pass at the base), and amend or annotate the objective's pending-count sentence, whose rows were allocated, and so outside the pending count, at activation (158 before and after).",
  "reopenWhen": "A planning pass disposes the reopened known issues, or another batch order's objective promises a pending-count fall for rows allocated at activation."
}
```

## WO-218-D057 — Repair VER-001's evidence class and bounded follow-ups

```json
{
  "id": "WO-218-D057",
  "date": "2026-10-20",
  "dispatch": "resume: fix; VER-001; adjacent-0004",
  "decision": "Repair F1's evidence class and the bounded F2 to F4 follow-ups. Every claimed fixed behavior needs a named Preflight case with an isolated negative control, or an explicit already-met observation. Add valid null advisory rows (including mixed observations and foreign rows), refused-close summary assertions with retained files, shared dependency-free composition assertions, a configured-root publication declaration matrix, protected-material retry checks, nested-worktree and whitespace cases, and the missing retry, lock and rebase cases. Correct CONTRIBUTING's instance-identity location. Retain preparation's ancestral ordinary-tag baseline and state it in product 07: worktrees share tags, so an unintegrated sibling's tag is not this subject's baseline. F5 remains D056's planning nomination; no order text or immutable verification report changes.",
  "evidence": [
    "docs/verifications/WO-218/VER-001.md and WO-218-D055: the original fixture names did not establish criterion 2; a whole-base failure did not isolate each fix.",
    "scripts/release.mjs ancestralLocalTags and prepare; scripts/test-release.sh surfaces_local_snapshot already checks the surface-check ancestry boundary, and prepare_independent now plants an unreachable ordinary v9.0.0 before its preparation assertion.",
    "The new and corrected cases are in the named Preflight suites. docs/evidence/WO-218/repair-controls.json and repair-controls.md record 91 paired controls for all 40 settled rows and all 33 WO-221 findings: 84 isolated reversions fail their relevant assertion and seven baseline-module arms pass. Exact commands, equal-arm fixture setup, source replacements, hashes, exits and observed output are retained. The complete review and document gates are still required at the final subject; their result belongs in handoff.md."
  ],
  "rejected": [
    {
      "option": "Count an unrelated assertion's base failure as proof for each finding",
      "reason": "That repeats the evidence error VER-001 identified; the negative control must remove the behavior being claimed."
    },
    {
      "option": "Amend the work order's Preflight list",
      "reason": "The publication behavior can be covered under the declared configuration-root suite, including a relocated publication root; no authority expansion is needed."
    },
    {
      "option": "Restore all local tags as the preparation baseline",
      "reason": "The local surface check already excludes unrelated sibling histories. Preparation should use the same observation; publishing continues to judge origin."
    },
    {
      "option": "NoOp on documentation and fixture coverage",
      "reason": "It leaves criterion 2 unmet and two operator-facing statements inaccurate."
    }
  ],
  "goalAlignment": "Avoid rule beating by demonstrating each changed behavior instead of relabelling generic cases. Avoid scope drift by retaining the existing refusal and ancestry contracts and leaving D056 to planning. NoOp does not satisfy the observed evidence gap.",
  "reopenWhen": "A named negative control passes after its isolated fix is removed, a protected refusal weakens, or local preparation and surface checks observe different release baselines."
}
```

## WO-218-D058

```json
{
  "id": "WO-218-D058",
  "date": "2026-10-20",
  "dispatch": "resume: fix; VER-001; adjacent-0004",
  "decision": "Correct the reported evidence in place and re-dispose the settled rows against actual isolated controls. Distinguish new behavior from already-met runtime behavior and from improved fixture adequacy. Preserve the five whole-row and four partial declines, D056’s planning nomination, and the filed verification. The repair changes fixture coverage and documentation; it does not weaken a refusal or amend the order to pass.",
  "evidence": [
    "New repair inputs: docs/verifications/WO-218/VER-001.md and its D055/D056 findings; docs/evidence/WO-221/decisions.md WO-221-D043 supplies the valid null-advisory arrangement. The selected source decisions and their implementation/test boundaries were read.",
    "The first complete repair review failed its fixture census and a new rebase setup that pushed a divergent history. The counts were corrected and the rebase fixture now keeps the target branch based on the fetched base. The second complete repair review failed a new summary assertion that assumed base output was listed first; the actual summary lists target roots before the base root. The corrected assertion still requires planned, never deleted, output and retained files. Those failed runs are not passing evidence.",
    "The overlay fixture had supplied an invalid partial identity and a string revocation version, so a schema refusal could mask a missing policy guard. It now uses a valid identity and numeric version. The allowed-effects narrowing case runs before the separate denied-effect contradiction, and isolated removals show the prohibited input being accepted. The reserved-name export fixture now installs the existing dependencies before invoking the planning CLI.",
    "The starter baseline’s old assertion excluded only v99.0.1 and could miss a wrong minor retime. It now requires the exact v0.1.0 heading. The initial reversion failed only formatting and was rejected. With the isolated mutant formatted, removing the Starter exclusion produces v99.1.0 and fails that direct assertion; the current implementation passes. Other formatting, import or setup failures are not counted as behavioral proof.",
    "The starter scenario initially still passed after its early GitHub authentication check was removed. It now injects an authentication refusal before first export and requires all remote refs and the checkout head to remain unchanged. A second new arrangement plants a conflicting release tag before a pending refresh and checks the same pre-push boundary; the older stray-tag case only judged an already-current starter.",
    "The final-review negatives now share the complete suite list and a valid document row. Removing either the review-selection guard or executed-task guard therefore reaches a false acceptance, rather than a later unrelated document refusal. The moved-draft scenario previously checked refusal but omitted the remedy; it now requires both heads and the preserve, integrate, review and explicit-rebind instruction for a moved or absent remote branch and for closed-phase publication.",
    "The first refresh-privacy control removed the separate file-URL/colon mask, which the recorded-checkout privacy matrix does not exercise; its passing mutant was rejected. The corrected r31-cleanup-privacy control removes only the existing cleanup redactor and must fail on disclosure of the synthetic recorded path. It proves guard coverage, not a new privacy implementation; r31-temporary-retry separately proves the changed temporary-root recovery.",
    "docs/evidence/WO-218/repair-controls.json: 91 paired controls, 40 settled rows and 33 WO-221 findings. TypeScript mutants were rebuilt. Every control held other fixes present, restored source/build bytes afterward, and ran under the bounded probe wrapper in an isolated copy. Positive reuse is only the same command, test input and setup. Seven passing baseline-module arms document existing behavior; two separate negative controls demonstrate adequacy of already-existing final-review guards.",
    "The baseline-module comparisons of old close behavior accept either printed retry mode equally in both arms because the current preflight passes a separate original-mode argument that the old module did not consume. Their ignore, large-stream, unreadable-output and advisory assertions remain active. The current repository cases still enforce the actual requested retry mode. The large-stream comparison also omits the separately controlled newer full-path naming assertion.",
    "CONTRIBUTING.md now locates contributions.operatorAuthor in dotln.config.json. docs/product/07-execution-guide.md and D045 explain that local preparation and local surface checking count only reachable ordinary tags and exclude annotated Starter provenance tags. The additional ordinary-tag control plants an unintegrated v9.0.0; the reachable release continues to determine preparation.",
    "Current complete-review and document evidence, canonical follow-up readbacks, final touching pagination and actual counters are recorded in handoff.md, README.md and repair-execution.json after those commands complete. Historical execution evidence and the original 36-finding review record remain available.",
    "The first document gate refused two retained excerpt lines containing a synthetic temporary-path literal. Those excerpts now use a labeled fixture placeholder in both the Markdown and JSON records. The raw-output hashes and executed control results are unchanged; the document gate is rerun at the corrected tree.",
    "Canonical preparation found FUP-c9dc1abccd1f1a9d, FUP-d8297b92b32c8304 and FUP-3a4c476e4e8099bd at needs-review after the source refresh. Their current and previously disposed revisions differed only in the recorded hash; the source text was unchanged. The canonical batch re-disposed all 40 settled rows at current revisions and settled D055’s repair follow-up. All 45 selected show readbacks are current: 40 settled, five declined, zero unresolved. Global pending was 163 before this application and 159 afterward; complete touching pagination returned 11 other pending rows over two pages. D056 remains untriaged for planning."
  ],
  "rejected": [
    {
      "option": "Count any failed run after a reversion as proof of the named fix",
      "reason": "A formatting or fixture failure, or a different removed behavior, does not establish the relevant assertion. The failed control must identify the contract being judged."
    },
    {
      "option": "Describe existing writer, ignore, whitespace or review-guard behavior as a new runtime fix",
      "reason": "The checked baseline modules already provide those behaviors. The repair records the passing commands and the actual fixture improvements instead."
    }
  ],
  "reopenWhen": "A recorded control passes when its relevant behavior is removed, a claimed baseline observation cannot be reproduced under its recorded setup, or a final canonical readback no longer matches the stated disposition."
}
```

## WO-218-D059 — VER-002: pass; the repair holds, and the historical-id dependency refusal no longer reaches the index or the planning readers

```json
{
  "id": "WO-218-D059",
  "date": "2026-10-20",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002 at code identity 6b809fff4a6b533c8fe347d184f0a155f6557e4375af712666206ed5da1ee7b0; all seven criteria are met. VER-001's blocking F1 is repaired: all 91 paired controls of docs/evidence/WO-218/repair-controls.json reproduce in a disposable copy of the subject. In 84 the named case fails on its recorded assertion with only that fix reverted; in seven, main's module passes the current case, as recorded for an already-met item. VER-001's F2 to F4 are repaired. F1 (follow-up, refusal reach, breaks no criterion): D042 moved the historical-id check ('historical id cannot be a hard or satisfied dependency') out of parseDependencies into readDependencies. Main refused a typed entry that makes a declared historical id a hard, satisfied-by-release or satisfied-by-close dependency in every reader. The subject still refuses it at activation and in status reads (readDependencies). But parseDependencies and parseHeader now admit it, and parseHeader is the reader behind the work-orders index and the planning subject, receipt and failure readers; so do the planning dependency migration and derived contracts. No decision records the narrowing.",
  "evidence": [
    "docs/evidence/WO-218/verification-002/README.md and replay-results.json: control-replay.mjs replays each control's recorded reversion in a local clone of a66981ac overlaid with the subject's modified and untracked files, whose gateCodeIdentity (6b809fff…) and gateTreeHash (019854f0…) equal the subject's. 91 of 91 controls reproduce; the 22 positive arms run there exit 0; the base-function and regular-expression reversions reconstruct the recorded intermediate and after hashes.",
    "docs/evidence/WO-218/verification-002/dependency-probe.mjs under node scripts/harness.mjs bounded, at this checkout and at an archive of a66981ac: the subject's parseDependencies and parseHeader admit [{\"workOrderId\":\"WO-001\",\"relation\":\"hard\",\"reason\":\"probe\"}] with historical ids [\"WO-001\",\"WO-002\"], and its readDependencies refuses it; main refuses it in all three.",
    "scripts/lib/dependencies.mjs lines 253 to 263 hold the refusal inside readDependencies, which only scripts/resume.mjs calls (status --json, status --all --json and activation). parseDependencies is also called by scripts/work-orders.mjs parseHeader (line 108), which readIndex (line 327), scripts/lib/plan-subject.mjs and scripts/lib/plan-failures.mjs use, by scripts/lib/plan-dependency-migration.mjs and by scripts/lib/derived-contract.mjs. git grep at a66981ac finds the refusal at scripts/lib/dependencies.mjs line 142, inside parseDependencies. No test names the refusal at either commit.",
    "WO-218-D042 and its r41-instance-history control cover the configured historical set and the index's Historical class, not where the refusal fires."
  ],
  "rejected": [
    {
      "option": "Fail the verification on F1",
      "reason": "No criterion names the refusal, and no lifecycle effect proceeds on such an edge: activation and status still refuse it with the same message. The narrowing moves an early refusal later; product 07 routes a defect that breaks no criterion as a follow-up."
    },
    {
      "option": "Leave F1 in the report only",
      "reason": "A defect met and not fixed is recorded as a decision with a named follow-up."
    },
    {
      "option": "Restore the refusal in this verification",
      "reason": "A verifier never edits the implementation it judges."
    }
  ],
  "followup": "The next order that edits scripts/lib/dependencies.mjs or scripts/work-orders.mjs, or a WO-218 repair if one happens; low priority. Rule a repair must hold: every reader main's parser refused in keeps refusing a hard, satisfied-by-release or satisfied-by-close dependency on an id the instance declares in historicalWorkOrders. That covers parseDependencies' callers: parseHeader, and with it the work-orders index and the planning subject, receipt and failure readers, the planning dependency migration and derived contracts. The set is read from that instance's configuration, and an instance declaring none refuses none. A case asserts the refusal through parseHeader as well as at activation and fails without the fix. Reproduction: node scripts/harness.mjs bounded -- node docs/evidence/WO-218/verification-002/dependency-probe.mjs . subject.",
  "reopenWhen": "A repair restores the refusal in parseDependencies' callers with a case that fails without it; a decision records the narrowing as intended, with its reason; or the work-orders index or a planning pass admits an order whose typed block makes a declared historical id a hard or satisfied dependency."
}
```

## WO-218-D060 — Final review: integration took in nothing; every acceptance claim carried forward to FINAL-001

<!-- integration refs/dotln/checkpoint/WO-218/10 -->

```json
{
  "id": "WO-218-D060",
  "date": "2026-10-20",
  "dispatch": "resume: final review; worktree integrate WO-218",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all a66981acfcb4c451f9ef0417c2625ef809e4dc72 and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-218/10, c1bdfd8ba06016ffff555a433177d78d4d52e144), retained its named stash 7e031109e68d37531bf9662857a4fccb477e4127, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR meter block), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: docs/intake holds .gitkeep files only and git ls-files --others --ignored --exclude-standard lists nothing there. Every acceptance claim carries forward unchanged: gateCodeIdentity after integration is 6b809fff4a6b533c8fe347d184f0a155f6557e4375af712666206ed5da1ee7b0, the identity the executor's repair handed off and VER-002 judged, so the passing complete review row at that identity (npm test with review selection, 2026-10-20T15:02:05.054Z, 108 fresh tasks over 43 required suites, exit 0) stands for the integrated tree and no second complete run is owed. The three other printed affected checks pass on the integrated tree. The component-version bumps collide with nothing: main's workspace versions at a66981ac are compiler 0.27.1, skeleton 0.62.0 and console 0.4.2, no v0.87.* tag exists locally or on origin, and check-surfaces --local reads v0.87.0 against the latest local tag v0.86.0. The evidence inputs are unchanged by integration: docs/evidence/current.json selects WO-218 authority/002, artifact-identity/001, verification/001 and feedback-001, as at the verified subject.",
  "evidence": [
    "refs/dotln/checkpoint/WO-218/10 (c1bdfd8ba06016ffff555a433177d78d4d52e144); docs/control/local/integration.json: preservationCommit c1bdfd8b…, mergeCommit null, complete true, stage applied, untrackedConflicts [], before and upstream a66981ac…; the helper printed Bases a66981ac -> a66981ac, Authored conflicts: none, and the regenerated list above, at 2026-10-20T16:25Z",
    "git rev-parse main, HEAD and origin/main after git fetch origin main: each a66981acfcb4c451f9ef0417c2625ef809e4dc72; git log --oneline wo-218..main and main..wo-218 print nothing",
    "gateCodeIdentity(root) from scripts/lib/gate-evidence.mjs, read at 2026-10-20T16:21Z before integration and 16:26Z after it: 6b809fff4a6b533c8fe347d184f0a155f6557e4375af712666206ed5da1ee7b0 both times; node scripts/harness.mjs evidence: the npm test review row at that identity recorded 2026-10-20T15:02:05.054Z, executionMode fresh, 108 fresh and 0 reused tasks, 43 required suites, no unrun or stale suite, exit 0, duration 1,748,416 ms; no active gate run",
    "Affected checks after integration under node scripts/harness.mjs bounded, 2026-10-20T16:27Z, each exit 0: npm run publication:check (255 of 255 product headings indexed; both editions CURRENT, 29 and 45 sections); node scripts/harness.mjs check (34 generated surfaces; local-terms list present); npm run release -- check-surfaces --local (57 PASS: release block v0.87.0 against the latest local tag v0.86.0; compiler src changed, 0.28.0 against 0.27.1; skeleton src changed, 0.63.0 against 0.62.0; console src unchanged at 0.4.3; beacons, browser-evidence and kernel unchanged; workspace pins exact; the PR body's github-body profile; one advisory that the untracked component source packages/skeleton/src/target-publication-policy.ts is not compared until it is staged). npm run meta -- --check, git diff --check and npm run format:check at 16:31Z: exit 0, clean, all files formatted",
    "git tag -l 'v0.87.*' and git ls-remote --tags origin 'v0.87.*' print nothing; git diff main -- package-lock.json adds no node_modules entry (14 changed lines, workspace versions and pins only)",
    "git diff main -- docs/evidence/current.json: the four editions move from WO-222/001, WO-213/003, WO-213/003 and WO-222/001 to WO-218 authority/002, artifact-identity/001, verification/001 and feedback/001, the selection VER-002 judged; integration changed none of them",
    "git ls-files --others --ignored --exclude-standard -- docs/intake/ prints nothing; docs/intake/chats, images and notes each hold a .gitkeep only"
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
      "reason": "The identity, not the dispatch time, says what was tested (WO-221 D017): the passing complete row at 6b809fff… ran every required suite fresh at these bytes, and a second run of the same bytes adds no coverage for about 29 minutes of gate time."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-20. Original base: `a66981acfcb4c451f9ef0417c2625ef809e4dc72`.
Fetched main: `a66981acfcb4c451f9ef0417c2625ef809e4dc72`. Checkpoint: `refs/dotln/checkpoint/WO-218/10` (`c1bdfd8ba06016ffff555a433177d78d4d52e144`).
Named stash retained: `7e031109e68d37531bf9662857a4fccb477e4127` (WO-218 integrate 2026-10-20).
Intake backup: none named; `docs/intake` holds no ignored file, so the helper's intake check required no archive.
Resolved projections: none.
Release preparation: WO-218 target v0.87.0 remains current. Files changed: docs/evidence/WO-218/meta.json, docs/final-reviews/WO-218/PR.md. Meter snapshot: docs/evidence/WO-218/meta.json, 4175 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's seven criterion judgments and the repair's completion at code identity `6b809fff…`, which the integrated tree keeps; VER-001's F1 repaired and F2 to F4 repaired as VER-002 records; VER-002's F1 as boarded (D059); D053's minor classification as bound in the planning log. No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the complete run pass on the integrated tree at 16:27 UTC (evidence above); the complete run is the standing complete review row at the integrated identity, reused and recorded in FINAL-001.

## WO-218-D061

```json
{
  "id": "WO-218-D061",
  "date": "2026-10-20",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass the final review of WO-218 at the integrated subject. All seven criteria hold at the reviewed tree after this review's bounded Adjacent Repairs and records corrections, each inside the order's declared surfaces and within the Boy Scout bound, none weakening a refusal: F1 product 07's configuration passage now lists historicalWorkOrders and contributions and states what core ships, so criterion 6 holds (it did not at the verified subject); F2 grantedSessionRoot compares the resolved root with the resolved temporary prefix and withholds a root outside its prefix instead of throwing, so an unnormalized TMPDIR no longer disables the outside-write guard (a behavior main had, broken in the verified subject); F3 the hook's --body-file ignore check judges each path by its own check-ignore status and withholds a path Git cannot judge; F4 composeHarnessInstruction inserts the generated block through a function replacement; F5 describeTag runs with --no-replace-objects; F6 the outward lint admits the :shortcode: gitmoji form core's own titles use; F7 a target Release is admitted under the configured or the default title only; F8 starter-refresh redaction labels each private path by an explicit pair; F9 check-publication names a missing index, outline or dual-voice sample; F10 latestExecution guards a passing partial row that has no result; F11 the kit README states the narrowing rule D022 enforces. Records: F12 row 31 (FUP-eee6c2fa1ef76215) is re-disposed to declined, because its reopening (WO-215-D018 FU1) is declined in D031 while D032 settled it on another row's fix, so the whole-row declines are six and the settled rows 39, both under the cap; F16's README row for FINAL-001 F18 now says the already-current tag placement is boarded; the overstated evidence claims F23 names are corrected here. The gate: every code repair carries a case that fails without it except F7 (the existing display-name case covers the admitted path) and F10 (reached only through a malformed local index), and the complete review ran fresh at the new code identity; FINAL-001 records the row. Twelve follow-ups are boarded in D062, D063 and D064 with their reproductions and repair rules; none breaks a criterion or a behavior main had.",
  "evidence": [
    "F1: docs/product/07-execution-guide.md lines 674 to 678 at the verified subject listed the sections without historicalWorkOrders and contributions and said this repository ships no such file; git show main:dotln.config.json fails with 'exists on disk, but not in main' while the subject ships it with both keys (worker D's read, reproduced). After the write-back npm run sync regenerated the software-engineer source lock and npm run publication:check passes (255 of 255 headings, both editions CURRENT).",
    "F2: worker C's hook probe (an appended case of scripts/test-harness.mjs run under node scripts/harness.mjs bounded in a disposable clone): a Write to ~/dotln-probe-absent-dir/new.txt with TMPDIR=./reltmp was allowed by the subject with the 'outside-write guard unavailable' advisory and denied by main; with <tmp>//x a user-owned session scratch was withheld as 'ancestor /private/tmp: another user owns it'. Cause read at packages/skeleton/src/harness-host.ts grantedSessionRoot: the walk compared join-normalized components with the raw prefix and threw 'session root outside temporary prefix' at the root, which outsideWriteResponse reports as unavailable and admits. The repair resolves both forms and returns the cause for a root outside its prefix; the case 'every scratchpad component below the temporary prefix is inspected' now asserts a doubled slash, relative spellings and an outside root.",
    "F3: worker B's probe PROBE-B5 in the WO-221 admission case: a link outside both checkouts to an ignored body was allowed by the hook, because one git check-ignore call carried the physical and the lexical path and exited 128 for the lexical path outside the checkout, which read as not ignored; the draft helper still refused it. The repair runs check-ignore --quiet per path and withholds on any status other than 1; the admission case adds that link and expects withheld.",
    "F4: worker C's end-to-end run with identity.name 'Acme $& Corp': decode accepted, emit 1 and check 1 passed, emit 2 corrupted CLAUDE.md (8 markers) and every later check refused 'one ordered marker pair'. scripts/lib/harness-instruction.mjs line 62 used floor.replace(prior, block.trimEnd()); the repair passes a function; the new case composes a block holding $&, $`, $' , $$ and $1 twice and asserts one marker pair.",
    "F5: worker C's probe: with git replace in force, git describe reported the later tag and describeTag returned it as nearest; scripts/lib/git.mjs describeTag ran tag --points-at and describe without --no-replace-objects, which D008's reopening names. The repair adds the flag to both reads; the new export case 'describeTag names original objects' plants a replacement and asserts nearest v1.0.0 (plain git describe no longer reports it).",
    "F6: node --input-type=module probe over scripts/outward-lint.mjs at this tree: ':memo: docs: add the guide' refused with subject.shape while '📝 docs: add the guide' passed (workers B and D reproduced the same). Core's merged titles use the shortcode form (git log main: ':memo: Fork requests 2026-10-19 …', ':zap: Complete runs …'). The repair admits one leading :[a-z0-9_+-]+: before the type; three outward-lint rows cover the admitted forms and a shortcode without a type.",
    "F7: scripts/release.mjs passed { matchTitle: false } to ensureRelease for the target Release where main passed no option, so any title with a matching body was admitted; the order's limit asks only that a Release published before the key keeps its title. The repair admits the configured title and the default '<registration id> <tag>' through a new admittedTitles option in scripts/lib/github-repository.mjs; the display-name case of scripts/test-target-worktree-release.mjs passes at the repaired tree (bounded run, 2026-10-20T17:1xZ). No case exercises a foreign title; the next order that edits ensureRelease adds one.",
    "F8: worker A's run of a verbatim copy of redact with the real redactPaths and finishCleanup's six-path list printed 'directory is unreadable: <temporary base>' for the recorded checkout and 'undefined' for the recorded scratch and worktree. The repair passes explicit [path, label] pairs at all three call sites; the starter-refresh case asserts the cleanup refusal never reads 'undefined'.",
    "F9: worker A's run of DOTLN_LAUNCHPAD=<tmp> node scripts/check-publication.mjs with both editions and no index exited 1 with a raw ENOENT stack from checkCoverage. The repair refuses 'publication: declared publication missing: <paths>'; scripts/test-publication.sh moves the index away and expects that refusal (publication fixtures pass at this tree).",
    "F10: worker C's gate-probe.mjs: a passing partial row repeating a task name with no result made latestExecution throw 'Cannot read properties of undefined (reading exitCode)' where main returned the row; the handoff lookup catch turned that into an admission. The repair guards the skip with result &&. No fixture reaches a malformed index; the next order that edits scripts/lib/gate-reuse.mjs adds one.",
    "F11: scripts/kit/README.client.md lines 55 to 61 described narrow as freely replacing the allow list; packages/skeleton/src/loadouts/contributor.ts overlayContributor now refuses a narrowing a grant restores, naming the kit-owned contributor.outside-temporary grant (worker C verified on three overlays). The README now states the rule and that an empty allowedEffects refuses.",
    "F12: docs/planning/followups.json: FUP-eee6c2fa1ef76215 is the row of WO-215-D013 as reopened by WO-215-D018 (its reopens observation names the moved-checkout recovery, FU1); WO-218-D031 declines that recovery and WO-218-D032 settled the row on r31-temporary-retry (WO-215-D020 F8, row 13 and row 30 material) and the adequacy control r31-cleanup-privacy (worker D's read, reproduced). Re-disposed with npm run plan -- followups --apply docs/control/local/final-review-followups-WO-218.json at 2026-10-20T16:55:38.923Z, page revision ea1b90be…, to declined with the harm, the evidence read and D031's reversal condition; followups --show reads declined.",
    "F23 corrections, read against docs/evidence/WO-218/repair-controls.json: modes are 80 isolated-reversion, 7 already-met-at-base, 3 adequacy-control-of-existing-guard and 1 fixture-containment-control, so D057's '84 isolated reversions' is 80 plus four other controls, and repair-controls.md, D031, D032, D035 and the register reasons label f2-12-selection, f2-12-executed, r31-cleanup-privacy and r30-temp-containment as isolated reversions; no control names /dev/tcp, /dev/udp or --silent (D012's items), clone-urlrewrite (D019's F23 case, present in scripts/test-target-worktree-close.mjs) or D026's non-partial-snapshot stops, so D057's 'every claimed fixed behavior' is per row, not per item; D059's evidence line 'No test names the refusal at either commit' is wrong: main's scripts/test-work-orders.mjs lines 1320 to 1324 asserted /historical id/ and the subject replaced those assertions with an admission (worker C's read, reproduced by git show main:scripts/test-work-orders.mjs); WO-166-D008's note that the pre-WO-166 hook reclaims a thread-owned reservation until main is rebuilt and WO-168-D015's open question of which shell each host runs tool commands through are recorded in neither D013 nor D012.",
    "Workers: four read-only dotln-worker agents (release and starter; target lifecycle and admission; harness, kit and worktree; records), each briefed with the frozen diff and its group and reporting with commands and outputs; their reports stay in session scratch and the claims this record rests on were reproduced here where stated. Subagents observed: 4 of 20."
  ],
  "rejected": [
    {
      "option": "Fail the review on F1 and F2 and route them to a repair dispatch",
      "reason": "Both are repairable inside the declared surfaces within the Boy Scout bound (one paragraph and one function), the repairs carry cases, and the complete review reran at the repaired identity; a repair dispatch would cost a fix, a third verification and a second review for the same bytes."
    },
    {
      "option": "Repair every boarded follow-up here",
      "reason": "The admission's loaded-code binding (F13), the draft lease (F14), the deletion failure handling (F15), the already-current tag placement (F16), the close-history archives (F17), the stash-applied content check (F21) and the build-none floor (F22) each change a contract or cross into undeclared readers; they are boarded with their reproductions and rules, as product 07 routes a defect that breaks no criterion."
    },
    {
      "option": "Leave row 31 settled and note the accounting in prose",
      "reason": "The register is the canonical record planning reads; a row whose reopening is declined reads declined, and the count stays under the cap."
    }
  ],
  "goalAlignment": "The outcome matched the intent: the subject was judged by reading the whole production diff and by unanchored workers, the regressions found were repaired with cases rather than boarded, the records were corrected rather than restated, and the complete review ran at the repaired bytes. NoOp (pass on the standing evidence) would have published a guard that an unnormalized TMPDIR disables and a product document that contradicts the shipped configuration.",
  "reopenWhen": "A repaired case passes with its fix reverted, a refusal this review tightened is found weaker than main's, or a boarded follow-up's reproduction fails to reproduce at its source."
}
```

## WO-218-D062

```json
{
  "id": "WO-218-D062",
  "date": "2026-10-20",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Board four follow-ups in the target-order lifecycle, each reproduced by worker B in a disposable clone under the bounded wrapper and none breaking a criterion or a behavior main had. F13: the registered-target admission binds the helper's committed scripts, packages and lockfile but not the modules the helper loads: @dotln/compiler and @dotln/kernel resolve through ignored node_modules and the publish helper imports packages/skeleton/dist, ignored in core and committed in instances; and the closure is judged against refs/heads/main, a ref the session can move with git update-ref from a linked worktree, where the configuration and grants are compared with main's checkout bytes. F14: a draft retry with a corrected title and an unchanged tree, after a failed gh pr edit, refuses as a moved head naming the helper's own pushed commit, and the remedy's 'explicitly rebind publication' names no command. F15: an immutable file under a declared disposable root is met after the access preflight passed, so the close deletes part of the output and stops with Node's raw EPERM carrying the absolute path (WO-221-D042's reopening); the target-side 16 MiB overflow refusals at the two target listings and the judge-only collision scan name no checkout role and no rerun command, and the base wrapper appends 'Fix what Git reports' to a limit Git never reported. F20: FINAL-002 F11's fix covers latestExecution only; preflightRows still compares the covering row with the latest structural row, partial rows included, so after a focused run the implementation-ready Preflight route refuses with 'latest row failed or no longer stands'.",
  "evidence": [
    "F13: PROBE-B1 inside the WO-221 admission case: a planted scripts/lib/node_modules/@dotln/kernel was evaluated by importing scripts/lib/target-publish.mjs and the helper was admitted; a modified packages/kernel/dist was admitted. PROBE-B2: after git update-ref refs/heads/main from a linked worktree to a commit carrying a modified closure file, the helper was admitted where the same edit had been withheld before the move. packages/skeleton/src/harness-host.ts registeredTargetAdmission hashes git ls-tree -r refs/heads/main over scripts/, packages/, package.json, package-lock.json and .npmrc; scripts/lib/target-publish.mjs imports ../../packages/skeleton/dist/src/worker-store.js, source-change-state.js, verification.js and repair.js and @dotln/* through node_modules; packages/*/dist is gitignored (.gitignore line 10).",
    "F14: scripts/lib/target-publish.mjs publishTargetDraft, the already-published branch: pushObservedCommit(…, { lease: previous.headSha }) refuses when the remote head is the retained draft commit of the attempt whose gh pr edit failed; the refusal text names 'explicitly rebind publication', and no command rebinds.",
    "F15: worker B's run with chflags uchg on a file under a declared root: a-first.txt deleted, then 'EPERM … unlink <absolute target path>'. scripts/lib/target-worktree-close.mjs: inspectDisposable checks directory access only; the target listings at the lines around 697 and 721 and the judge-only selectGitPaths call run outside the base wrapper; the overflow case calls runGitPathList directly and reaches neither.",
    "F20: worker C's preflight-probe.mjs: the subject reports structural missing with displaced [] while main reports six displaced tasks; scripts/lib/gate-reuse.mjs preflightRows (line 471 at the verified subject) and scripts/lib/handoff-ledger.mjs lines 392 to 399; the control f2-11-partial-row covers final-review-result only."
  ],
  "rejected": [
    {
      "option": "Repair them in this review",
      "reason": "Binding the loaded modules is a design choice (hash dist and node_modules, or run the helper from main's checkout), the lease rule changes the draft contract, the deletion rollback needs its own cases across both checkouts, and the preflight route's fixture is the handoff ledger's; each is beyond a bounded adjacent cleanup."
    }
  ],
  "followup": "WO-219, which edits packages/skeleton/src/harness-host.ts next, or the next order that edits registeredTargetAdmission, scripts/lib/target-publish.mjs, scripts/lib/target-worktree-close.mjs or scripts/lib/gate-reuse.mjs. Rules a repair must hold: (F13) every module the admitted helper process loads is bound to main's committed bytes, dist and node_modules included, or the helper runs from main's checkout, and the closure is judged under the same committed-bytes rule as the configuration and grants rather than against a movable ref; one withheld case per vector (a planted node_modules package, a modified dist, a moved ref). (F14) any head this order's publication store recorded is a valid lease for a same-tree retry, and the refusal prints a runnable remedy; a case retries with a corrected title after a failed edit. (F15) deleteDisposable catches a deletion failure and refuses naming the checkout role, the relative directory, the remedy and the rerun command, deleting nothing further; the target listings and the judge-only scan refuse the 16 MiB limit with the role and the rerun command and without 'Fix what Git reports'; cases plant an immutable file and an oversized target listing. (F20) a passing partial structural row neither replaces nor revokes in preflightRows, the implementation-ready Preflight route passes after a focused run, and a case fails without the fix. Reproduction: the probes named in the evidence, rerun in a disposable clone under node scripts/harness.mjs bounded.",
  "reopenWhen": "A repair restores each rule with its cases, or a planning pass re-disposes the row; an operator meets a stuck draft retry, a partial deletion or a refused Preflight handoff before then."
}
```

## WO-218-D063

```json
{
  "id": "WO-218-D063",
  "date": "2026-10-20",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Board four follow-ups in release close and the starter, each reproduced by worker A in a disposable clone under the bounded wrapper and none breaking a criterion or a behavior main had. F16: in the already-current branch of scripts/lib/starter-refresh.mjs refreshOne the sibling tag lands on the starter's tip (commit: remote), so an operator commit above the refresh commit is tagged; FINAL-001 F18's second defect is neither fixed nor declined and the README's F18 row said fixed, which this review corrects to boarded. F17: the close-history archives of scripts/release.mjs main(): when the attempts directory cannot be written, a readable prior record is recorded as [{unreadableRecord}] with no advisory, so archivedAttempts and the target release binding and recovery history are lost; when an archive is missing or altered, every retry refuses with a raw ENOENT carrying an absolute path, the remedy cannot be followed once the archive is gone, and each refusal nests the prior record so the retained record and its archive double per retry (D024's reopening). F18: a registration with a declared release policy refused by the first judgment pass, which now runs before prepareTargetRelease, prints 'no-release; no tag or GitHub Release is due', files the blocker as completion and records no publication.target; main printed the same. F19 (low): isStarterTag spawns one git cat-file per reachable annotated tag, about one second per check-surfaces --local in core against 27 ms for the existing releaseAnnotations batch reader; release prepare still passes the 'local tags' observation explicitly so the recorded observation misdescribes the ancestral, starter-excluded baseline; the linkHosts refusal reports the index in the deduplicated list and the committed case lacks the '*' and host:port inputs WO-073-D010 names.",
  "evidence": [
    "F16: worker A's probe inserted after the 'b current' step of scripts/test-launchpad-update.mjs: the tag deleted, an operator commit with the same tree added above the refresh commit, refresh(tag, head) printed outcome current, siblingTag published, taggedCommit the operator commit, tagOnRefreshCommit false; scripts/lib/starter-refresh.mjs line 636 at the verified subject passes commit: remote, unchanged from main line 627.",
    "F17: worker A's shell cases wa_history (chmod 500 attempts/ then a dry run: previousAttempts [[unreadableRecord]], archivedAttempts null, recordAdvisories [], historyFailure null) and wa_history2 (rm -rf attempts/ then twelve retries: each exits 1 with 'Close history cannot be read safely: ENOENT … attempts/<hash>.json', record sizes 5,485 to 1,463,250 bytes); scripts/release.mjs main() lines 3381 to 3442 at the verified subject wrap the archive write and the parse in one try whose catch records unreadableRecord.",
    "F18: worker A's print after the refusedBase step of scripts/test-target-worktree-release.mjs: 'WO-999: no-release; no tag or GitHub Release is due.', 'Cleanup/publication blocker (completion): target clone base main has undeclared ignored material', record.publication without target; scripts/release.mjs close() runs closeTargetWorktree(dry) before prepareTargetRelease sets publication.target.",
    "F19: worker A's timing in the clone: the starter scan over core's 171 tags 1,048 ms against releaseAnnotations 27 ms; /usr/bin/time -p node scripts/release.mjs check-surfaces --local 2.77 to 2.96 s against 1.80 to 1.89 s with the filter removed; scripts/release.mjs line 3608 passes 'local tags' where scripts/lib/release-preparation.mjs changed only the default; scripts/lib/config.mjs validateLinkHosts indexes the deduplicated set."
  ],
  "rejected": [
    {
      "option": "Repair them in this review",
      "reason": "The tag placement needs the manifest-proof walk priorReleaseRefresh uses and a launchpad case, the archive handling is a restructure of the close's history, the pre-preparation receipt changes the close's record order, and the batch reader is an optimization; each is beyond a bounded adjacent cleanup, and none weakens a refusal main had."
    }
  ],
  "followup": "The next order that edits scripts/lib/starter-refresh.mjs or scripts/release.mjs. Rules a repair must hold: (F16) in the already-current branch the tag lands on the starter commit that refreshed to head, the earliest ancestor of the tip whose committed KIT-MANIFEST.json names head and tag, never on a later non-refresh commit; a case with a non-refresh commit above the refresh commit fails without the fix. (F17) a readable prior record is never recorded as unreadable: an archive write failure is a visible refusal or advisory that keeps the parsed history; a history failure keeps previousAttempts as parsed and never nests the prior bytes; the refusal names the archive by its relative path and prints a completable route to re-anchor the history from the retained record once the archive is proven unrecoverable; cases cover an unwritable attempts directory and a missing archive retried several times with the record size bounded. (F18) a close of a declared-release registration records publication.target before any judgment can refuse, the summary never prints the no-release line for it, and a refusal before any tag push is filed as publication; a case refuses at the base judgment and asserts the first line, the blocker action and the receipt. (F19) read the tag annotations once (releaseAnnotations or for-each-ref) with the same exclusion and r44-starter-baseline still failing without it; release prepare passes the ancestral observation; the linkHosts refusal reports the declared index and the case adds '*' and host:port.",
  "reopenWhen": "A repair restores each rule with its cases, or a planning pass re-disposes the row; a starter tag lands on an operator commit or a close retry loses its publication binding before then."
}
```

## WO-218-D064

```json
{
  "id": "WO-218-D064",
  "date": "2026-10-20",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Board two follow-ups in worktree integration and the harness floor, each reproduced by worker C in a disposable clone under the bounded wrapper and none breaking a criterion or a behavior main had, and correct D059's record. F21: --continue --stash-applied checks conflicts, unrestored untracked files and upstream ancestry but never the stash's tracked content against the tree, so an interrupted integration whose work was reverted to HEAD completes with the receipt at stage applied, and an upstream-added collision left unresolved completes with the tree holding upstream bytes and no collision printed; 'finish its application' names no command. F22: a build: none emit keeps the kit floor's hooks block ('The hooks import an ignored snapshot …') and both floors' @skills mapping and skill-selection text beside the appended disclosure, so WO-076-D007's rule ('names no generated surface it removed') is only partly met, and the drift message for a missing disclosure, 'requires the hand-written floor alone', misleads an instance that selected build: none before this release. D059's record: its evidence line 'No test names the refusal at either commit' is wrong; main's scripts/test-work-orders.mjs lines 1320 to 1324 asserted /historical id/ for a hard dependency on WO-001 through the index reader, and the subject replaced those assertions with an admission at lines 1349 to 1353, so the repair rule also restores an assertion of the refusal through parseHeader and adds an activation case.",
  "evidence": [
    "F21: worker C's PROBE-A: the work reverted to HEAD, then --continue --stash-applied gave complete:true, trackedWorkInTree:false, trackedWorkInStash:true; PROBE-B: an upstream-added collision left unresolved gave complete:true with the tree holding upstream bytes and collisionPrinted:false; scripts/lib/worktree-integration.mjs lines 691 to 718 at the verified subject.",
    "F22: worker C's emit over copies of both floors with build: none, then grep: the dotln-kit block and the @skills mapping remain above the disclosure; scripts/lib/harness.mjs checkHarness line 889 at the verified subject reports 'harness drift: build none requires the hand-written floor alone' when the disclosure is absent.",
    "D059: git show main:scripts/test-work-orders.mjs lines 1320 to 1324 (assert.throws … /historical id/) against the subject's lines 1349 to 1353; docs/evidence/WO-218/self-review.md calls the change 'correct parser regression expectations'; the subject has no test of the activation refusal readDependencies keeps."
  ],
  "rejected": [
    {
      "option": "Repair them in this review",
      "reason": "Comparing stash content with the tree and recording collisions for acknowledgement changes the continuation's contract and needs refusal-arm cases in the exclusive worktree-integration suite; the build-none floor rule touches both hand-written floors and the kit template; each is beyond a bounded adjacent cleanup."
    }
  ],
  "reopens": {
    "decisionId": "WO-218-D059",
    "observation": "D059's evidence line that no test named the refusal at either commit is wrong: main's test-work-orders.mjs asserted /historical id/ through the index reader and the subject replaced it with an admission assertion, so the narrowing removed a tested refusal; the repair rule gains the restored assertion and an activation case."
  },
  "followup": "The next order that edits scripts/lib/worktree-integration.mjs or scripts/lib/harness.mjs. Rules a repair must hold: (F21) --stash-applied lists or refuses stash paths with no trace in the tree and records each collision for explicit acknowledgement, with a refusal-arm case for a reverted tree and one for an unresolved collision, and its messages name the commands to run. (F22) a build: none emit leaves a floor that names no generated surface it removed, in core's floor and the kit template alike, and the drift message for a missing disclosure names the disclosure to add; a case emits both floors. (D059) the historical-id refusal is asserted through parseHeader as main's test asserted it, and an activation case covers readDependencies.",
  "reopenWhen": "A repair restores each rule with its cases, or a planning pass re-disposes the row; an interrupted integration completes without its work before then."
}
```
