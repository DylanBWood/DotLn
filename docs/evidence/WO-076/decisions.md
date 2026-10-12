# WO-076 decisions

## WO-076-D001

```json
{
  "id": "WO-076-D001",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Consume configuration build.overlay as a contained regular instance-owned JSON file with a closed version-1 schema. Compose identity, known support switches, additive envelope restrictions and explicit operator/host-policy grants before compiling the Contributor build. Keep configuration schema 1 and its registration/class homes unchanged: WO-069-D001 does not reopen because the existing overlay path is sufficient. The default path is a convention, never implicitly loaded. The actual file bytes are SHA-256 hashed in the installation manifest; the overlay itself never becomes a kit file.",
  "evidence": [
    "docs/work-orders/WO-076-instance-build-overlay.md",
    "scripts/lib/config.mjs validateBuild and findLaunchpad",
    "scripts/lib/harness.mjs decodeBuildOverlay/readBuildOverlay/harnessInstallation",
    "packages/skeleton/src/loadouts/contributor.ts",
    "Base measurements: scripts/harness.mjs 337 lines; scripts/lib/harness.mjs 858; packages/compiler/src/harness.ts 1389"
  ],
  "rejected": [
    {
      "option": "Add repository/class declarations to the overlay",
      "reason": "They already have one typed home in configuration; duplicating it violates this order."
    },
    {
      "option": "Trust a replaced active envelope as the compiler ceiling",
      "reason": "Authority diagnostics compare against that submitted active envelope; a prior check against the immutable kit ceiling is necessary."
    },
    {
      "option": "Change compiler loadout contracts for overlay composition",
      "reason": "Instance composition belongs beside the saved Contributor build, not in the common loadout compiler."
    }
  ],
  "reopenWhen": "An instance needs a unit beyond the existing support switches, a configuration value this shape cannot express, or a different registration per build."
}
```

## WO-076-D002

```json
{
  "id": "WO-076-D002",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Keep identity text visible through an overlay-only prompt facet; the common compiler otherwise retains only identity ID/version. Narrow inherited presence and exact inspection restriction notes with the build. Grants apply after pre-grant narrowing, including the existing kit temporary-write grant; effects and operations remain separate. Filter static deny matchers against the compiled envelope and admit an empty matcher list in the existing permission facet, preserving the generic envelope hook when every static deny has an explicit grant. This small common harness change requires all four evidence editions to move and the feedback carry/console projection anticipated by the Cost line. build:none removes all previously owned generated surfaces, including Claude settings, and retains an empty manifest plus the hand-written floor.",
  "evidence": [
    "packages/compiler/src/compile.ts identity phenotype and grant application",
    "packages/compiler/src/harness.ts permission-facet validation and generic envelope hook",
    "packages/compiler/src/authority.ts inspectionAuthorityDiagnostics",
    "scripts/test-harness.mjs six WO-076 cases passed under node scripts/harness.mjs bounded -- node --test --test-name-pattern=WO-076 scripts/test-harness.mjs on 2026-10-12"
  ],
  "rejected": [
    {
      "option": "Drop the permission facet when no static matcher remains",
      "reason": "That also drops the generic envelope hook, silently weakening the remaining envelope."
    },
    {
      "option": "Keep an obsolete static deny after an explicit grant",
      "reason": "The installed policy would contradict its compiled authority and provenance."
    },
    {
      "option": "Discard identity fields that do not enter the phenotype",
      "reason": "A name/disposition-only replacement would be invisible to the emitted instructions and target hash."
    }
  ],
  "reopenWhen": "Another lowering target needs an envelope hook without static matchers, or final-envelope narrowing rather than the documented pre-grant semantics is required."
}
```

## WO-076-D003

```json
{
  "id": "WO-076-D003",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Leave the carried Start here directive relocation on its existing follow-up FUP-44639ec9a751d8d1. Moving the directives from both hand-written floors into the generated block changes the no-overlay instruction bytes, unlike the required overlay-only behavior. The current order permits recording this carry-in as left; retain both floors and the existing export drift check. A separate change can judge that migration and its floor-only behavior explicitly.",
  "evidence": [
    "docs/evidence/WO-075/decisions.md#wo-075-d008",
    "docs/work-orders/WO-076-instance-build-overlay.md Known issues and carry-ins and criterion 4",
    "CLAUDE.md Start here",
    "scripts/kit/CLAUDE.template.md Start here",
    "packages/compiler/src/harness.ts mergeHarnessFragments"
  ],
  "reopens": {
    "decisionId": "WO-075-D008",
    "observation": "WO-076 inspected the allocated carry-in and leaves it: the directive migration intentionally changes default instruction bytes, so it requires its own compatibility judgment rather than being folded into the overlay regression."
  },
  "rejected": [
    {
      "option": "Move both floors now as adjacent cleanup",
      "reason": "This deliberately changes the no-overlay generated instruction contract the order requires preserving."
    },
    {
      "option": "Remove the directives only for build:none",
      "reason": "They are instance-owned hand-written text; removing it would violate preservation of that floor."
    }
  ],
  "reopenWhen": "A later harness/floor migration explicitly owns the default-byte change, or the existing launchpad-docs comparison detects drift."
}
```

## WO-076-D004

```json
{
  "id": "WO-076-D004",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Prepare a minor application release with compiler 0.27.0 for the additive empty-static-matcher permission facet and skeleton 0.58.0 for the optional Contributor overlay API. Keep all other component source versions and publication controls unchanged; update exact workspace dependency pins and the lockfile. The common compiler source change intentionally changes runtime snapshot pins and release metadata even without an overlay; no-overlay compatibility means the same released runtime still emits the original Contributor content and repeated no-overlay emission is byte-identical. The fixture records declaration effects separately from those release-only identities.",
  "evidence": [
    "packages/compiler/package.json",
    "packages/compiler/src/artifact-identity.ts",
    "packages/skeleton/package.json",
    "packages/console/package.json",
    "scripts/test-harness.mjs WO-076 no overlay fixture",
    "docs/work-orders/WO-076-instance-build-overlay.md Cost line"
  ],
  "rejected": [
    {
      "option": "Bump unchanged kernel, console, Beacon or browser-evidence source versions",
      "reason": "Only compiler and skeleton source behavior changed."
    },
    {
      "option": "Suppress snapshot refresh to preserve old generated hash strings",
      "reason": "The installed runtime would not match the source being released."
    }
  ],
  "reopenWhen": "Integration encounters a published version collision or review finds a breaking contract change."
}
```

Goal alignment: the overlay lets an instance choose its build without editing kit files. The material traps were widening a replaced compiler baseline, dropping enforcement with a static matcher, and losing identity text; the checks and projections above address each. NoOp leaves build.overlay unconsumed. The required fixture checks judge behavior, not an overlay-file count.

Review disposition: the two independent workers found three actionable gaps;
all three are fixed and their follow-up inspections found no remaining gaps.
The six overlay fixtures passed after the fixes. See [self-review](self-review.md)
for the floor-preservation, byte-provenance and exhaustive-diff judgments.

## WO-076-D005

```json
{
  "id": "WO-076-D005",
  "date": "2026-10-12",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.76.0, the next minor above the observed release baseline v0.75.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.75.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-076-instance-build-overlay.md"
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

## WO-076-D006

```json
{
  "id": "WO-076-D006",
  "date": "2026-10-12",
  "dispatch": "resume: next; adjacent repair",
  "decision": "Repair the integration fixture's revision split by copying current compiler and skeleton package sources alongside current scripts/lib, Beacon and console sources. Continue excluding dist, dependency links and the console's edition-bound fixtures. The real-generator fixture previously rebuilt the committed Contributor module while importing the current harness library, which now needs contributorSupportIds. This is a fixture source-coherence repair; it changes no integration behavior or acceptance expectation.",
  "evidence": [
    "npm test -- --review at 2026-10-12T00:50:43.308Z: 40 suites passed, worktree-integration failed; 1772467 ms",
    "worktree-integration diagnostic: Contributor module does not provide an export named contributorSupportIds",
    "scripts/test-worktree-integration.mjs overlayImplementation",
    "node scripts/harness.mjs bounded -- node --test '--test-name-pattern=real Git' scripts/test-worktree-integration.mjs: two real Git cases passed at 2026-10-12T00:51:43.990Z in 28649 ms",
    "evidenceSources: scripts/test-worktree-integration.mjs belongs to none of the five edition inventories"
  ],
  "rejected": [
    {
      "option": "Remove the new import or weaken the integration assertions",
      "reason": "The running product has the export; only the fixture combines incompatible source revisions."
    },
    {
      "option": "Copy built output into the fixture",
      "reason": "The integration must rebuild from its own coherent source snapshot."
    }
  ],
  "reopenWhen": "A generator's dependency closure adds another package that the fixture leaves at the committed revision."
}
```

## WO-076-D007

```json
{
  "id": "WO-076-D007",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board VER-001 F1 as a follow-up. On the real core floor, a build: none emit leaves CLAUDE.md as the hand-written floor alone and harness check passes, as criterion 2 requires. That floor still carries the five Start here Read[role] directives to @skills/dotln-executor, dotln-verifier, dotln-reviewer, dotln-release-close and dotln-planner, and the same emit removes all five skills. It has no sentence saying that no compiled refusal, hook or verification governs the instance. Planning receipt 2026-10-11-planning-fb68306765535a9d-044 recorded the second point as a criterion-2 known issue whose reopening condition is exactly this observation, and product 00 says a profile that omits verification says so instead. No criterion is broken: criterion 2 asks for the floor alone with check passing, and main had no build: none. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-076/verification-001/transcript.txt buildNone: emit 0, check 0, check 0 without .runtime; remaining files .claude/harness-manifest.json and CLAUDE.md (3346 bytes); skillRefs and missingRefs both list the five role skills; statesNoCompiled false",
    "scripts/kit/CLAUDE.template.md lines 37-41 hold the same five Read[role] directives, so an exported instance reaches the same state",
    "docs/planning/refutations/2026-10-11-planning-fb68306765535a9d-044.md WO-076 criterion:2 known issue and its reopenWhen",
    "docs/product/00-vision.md line 418: A profile that omits verification says so instead",
    "WO-076-D003 left FUP-44639ec9a751d8d1, the move of the Read[role] directives into the compiled bundle, for its no-overlay byte effect; its rejected option kept the directives under build: none as instance-owned floor text"
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet",
      "reason": "The criterion asks for the floor alone with harness check passing, and both hold on the real corpus. The planning receipt recorded the disclosure as a known issue outside the criterion."
    },
    {
      "option": "Strip the directives or append a disclosure during verification",
      "reason": "The verifier does not edit the subject it judges, and the directives are instance-owned floor text whose placement FUP-44639ec9a751d8d1 already owns."
    }
  ],
  "followup": "Planning, with FUP-44639ec9a751d8d1: the next order that edits harness emit or either hand-written floor. Rule a repair must hold: a build: none emit leaves an operating contract that names no generated surface it removed and states that no compiled refusal, hook or verification governs the instance; a no-overlay emit keeps its bytes and harness check still judges the result. Check: the WO-076 build-none fixture run against core's CLAUDE.md and the kit's CLAUDE.template.md asserts no @skills reference remains unresolved and the disclosure is present. Priority: medium, because an instance that selects build: none is told to read five files that no longer exist.",
  "reopenWhen": "An instance selects build: none, or FUP-44639ec9a751d8d1 is taken up by an order."
}
```

## WO-076-D008

```json
{
  "id": "WO-076-D008",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board VER-001 F2 as a follow-up. An overlay whose narrow.deniedEffects names an effect that the kit's contributor.outside-temporary grant adds (outside.write:system-temp, session-scratch or host-scratchpad) is accepted. The emit and check pass, but the enforced envelope still allows the effect and does not deny it, and the role skills still advertise the grant. The only change is the semantic hash. The same holds for narrow.allowedEffects, which cannot remove a kit-granted effect. WO-076-D002 chose pre-grant narrowing, and the client README says a granted effect removes its exact denial, so the semantics are recorded. The defect is that the decoder accepts a declared narrowing it will not apply and gives no diagnostic. No criterion is broken: criterion 1's narrowing holds on the executor's fixture and on this verifier's variation, and main had no overlay.",
  "evidence": [
    "docs/evidence/WO-076/verification-001/transcript.txt F2 and denyKitGranted: emit 0, check 0; permissions.mjs envelope allows outside.write:system-temp true, denied false; diff to the base is only the Origin semantic hash",
    "docs/evidence/WO-076/verification-001/probe-results.json grants.allowWithGrant: narrow.allowedEffects [repo.read, network.request] still yields the three outside.write effects",
    "packages/compiler/src/authority.ts applyAuthorityGrants removes every granted effect from the denied list",
    "packages/skeleton/src/loadouts/contributor.ts overlayContributor appends narrow.deniedEffects before the compiler applies contributorOutsideAuthority"
  ],
  "rejected": [
    {
      "option": "Judge criterion 1 or 3 unmet",
      "reason": "Criterion 1 requires that a narrowing fixture differ only where the overlay says; this case differs less, not elsewhere. Criterion 3 concerns widening, which refuses on every route tried."
    },
    {
      "option": "Treat it as a blocking authority defect",
      "reason": "The emitted authority never exceeds the kit's own, so nothing widens. The instance's narrowing is lost, and that is recorded semantics (WO-076-D002) with a README sentence."
    }
  ],
  "followup": "The next WO-076 repair, or the next order that edits scripts/lib/harness.mjs decodeBuildOverlay or contributor.ts overlayContributor. Rule a repair must hold: an overlay narrowing that a kit or overlay grant would re-admit either refuses before any write, naming the effect and the grant, or is applied to the final envelope by an explicit decision that reopens WO-076-D002; it is never accepted silently. Check: a fixture overlay denying outside.write:system-temp either refuses by path and effect or emits an envelope that denies it. Priority: medium.",
  "reopenWhen": "An instance overlay narrows an effect that a grant adds, or WO-076-D002's pre-grant narrowing semantics reopen."
}
```

## WO-076-D009

```json
{
  "id": "WO-076-D009",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board VER-001 F3 as a follow-up. The decoder admits identity strings that contain the generated-block markers. With identity.name 'X <!-- dotln-harness:end -->', emit succeeds and writes the instance identity fragment into the CLAUDE.md block, so the file holds five marker occurrences. harness check then refuses with 'harness instruction requires one ordered marker pair'. Every later emit refuses the same way, even after the overlay is corrected to {\"version\":1}, until CLAUDE.md is repaired by hand. The case is outside criterion 4's declared set (not JSON, unknown key, unreadable), and main had no overlay.",
  "evidence": [
    "docs/evidence/WO-076/verification-001/transcript.txt F3: marker lines 2 before, emit 0, 5 after; check exit 1; corrected overlay emit exit 1 with the same message",
    "scripts/lib/harness.mjs decodeBuildOverlay string() rejects only empty and control-character values",
    "packages/skeleton/src/loadouts/contributor.ts contributorProgram writes the instance.identity prompt fragment from the raw identity strings"
  ],
  "rejected": [
    {
      "option": "Judge criterion 4 unmet",
      "reason": "Criterion 4 is judged against its declared set and names a case outside it as a follow-up."
    }
  ],
  "followup": "The next WO-076 repair, or the next order that edits scripts/lib/harness.mjs decodeBuildOverlay. Rule a repair must hold: overlay text that would reach a generated surface is refused before any write, by path and key, when it holds a harness block marker or other text the emitted file cannot round-trip through harness check; an accepted overlay never produces output its own check rejects. Check: extend the closed-schema fixture with identity.name holding the end marker. Priority: low.",
  "reopenWhen": "An overlay is reported to leave CLAUDE.md with more than one marker pair, or another overlay string field reaches a generated surface."
}
```

## WO-076-D010

<!-- integration refs/dotln/checkpoint/WO-076/6 -->

```json
{
  "id": "WO-076-D010",
  "date": "2026-10-12",
  "dispatch": "resume: final review; worktree integrate WO-076",
  "decision": "Integration took in nothing: the base and the fetched main are both ffff74e12a4075592192b77818d629ad549f49f8, origin/main names the same commit, and the branch carries no commit of its own. The helper checkpointed the work, retained its named stash, re-applied it without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged; harness check passes with 34 surfaces), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. Every acceptance claim is carried forward unchanged: VER-001's six criterion judgments and its three boarded follow-ups (D007 to D009) at code identity d43b5afa42bb68116270fdf7f9a4366f0df823da6e7474341e93bc0a23a54321, the executor's three self-review fixes, and the executor's passing npm test -- --review row at that identity. gateCandidates returns the same identity after integration. Release preparation keeps application v0.76.0 under the order's minor classification; local tags end at v0.75.0 and origin lists v0.75.0 and no v0.76.0; compiler 0.27.0 and skeleton 0.58.0 are private workspace versions with no published counterpart to collide with. The four evidence editions already point at WO-076 revision 001, so integration owes no re-mint.",
  "evidence": [
    "refs/dotln/checkpoint/WO-076/6 (4deba811ed1b92dbd7a797313a88ea69617fb61b); named stash 50ae7bf5b2343a60564a4abb1bf4c84746996c2c (WO-076 integrate 2026-10-12) retained, never popped or dropped",
    "base ffff74e12a4075592192b77818d629ad549f49f8; upstream ffff74e12a4075592192b77818d629ad549f49f8; git ls-remote origin refs/heads/main names the same commit; origin lists no wo-076 branch",
    "gateCandidates for npm test and npm run test:docs after integration: identity d43b5afa42bb68116270fdf7f9a4366f0df823da6e7474341e93bc0a23a54321, equal to VER-001's and the executor's; one passing review npm test row recorded 2026-10-12T01:20:31.460Z (41 suites, 93 fresh tasks, 1535.0 s, exit 0)",
    "release preparation: WO-076 target v0.76.0 remains current; git tag --list v0.75.* v0.76.* names only v0.75.0; git ls-remote --tags origin lists v0.75.0 and no v0.76.0; package.json pins move only to compiler 0.27.0 and skeleton 0.58.0 (D004), and package-lock.json changes only those five version lines",
    "docs/evidence/current.json names WO-076 revision 001 for authority, artifact-identity, verification and feedback; the executor minted them (criterion 6) and integration changed no registered source",
    "affected checks on the integrated tree, after the integration meter cutoff 2026-10-12T02:14:46.627Z and before the register apply at 02:23:27.943Z: npm run publication:check pass (both editions CURRENT, 29 and 45 linked sections); node scripts/harness.mjs check, 34 generated surfaces; npm run release -- check-surfaces --local exit 0 with 57 passing lines; npm test -- --review runs in the handoff sequence and FINAL-001 records it"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, index, lock and console fixture bytes as a new subject",
      "reason": "Reports, indexes and release text change no code identity; product 07 §Independent workflows and integration makes integration bookkeeping no finding."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-12. Original base: `ffff74e12a4075592192b77818d629ad549f49f8`.
Fetched main: `ffff74e12a4075592192b77818d629ad549f49f8`. Checkpoint: `refs/dotln/checkpoint/WO-076/6`.
Named stash retained: `50ae7bf5b2343a60564a4abb1bf4c84746996c2c` (WO-076 integrate 2026-10-12).
Resolved projections: none.
Release preparation: WO-076 target v0.76.0 remains current. Files changed: docs/evidence/WO-076/meta.json, docs/final-reviews/WO-076/PR.md. Meter snapshot: docs/evidence/WO-076/meta.json, 4095 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-001's six criterion judgments and its three boarded follow-ups (D007 to D009), the executor's three self-review fixes and the executor's passing review row, all at code identity `d43b5afa…`, which the integrated tree keeps.
Authored conflicts observed: none.
Affected checks executed on the integrated tree: `npm run publication:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local`, each passing between the integration meter cutoff (02:14:46Z) and the register apply (02:23:27Z); `npm test -- --review` ran in the handoff sequence, and FINAL-001's Executed checks table records its row.

## WO-076-D011

```json
{
  "id": "WO-076-D011",
  "date": "2026-10-12",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass final review of WO-076 at code identity d43b5afa42bb68116270fdf7f9a4366f0df823da6e7474341e93bc0a23a54321 with no source change. All six criteria hold at the integrated subject, which keeps every judged byte of VER-001's subject; the verification sequence is the one passing verification; the executor's self-review found and fixed three gaps; VER-001's three follow-ups (D007 to D009) stay boarded. Board one new follow-up that breaks no criterion and no behavior main had: the build none manifest, whose profiles list is empty by design, reads as runtime-unavailable to scripts/lib/harness-runtime.mjs harnessRuntimeCause, which predates this order and does not read the manifest's build key. In a scratch copy of the subject with {\"version\":1,\"build\":\"none\"} selected, emit and check pass, and then every resume and plan command prints 'DotLn advisory: runtime-unavailable; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide.'; refreshHarnessRuntime, which worktree finish and settle call on the main checkout, runs the build and throws 'Built runtime still runtime-unavailable; checkout preserved; run node scripts/bootstrap.mjs'; release.mjs ensureReleaseRuntime, which release prepare and the non-dry-run close call, follows the same reader and by its code refuses after its build (not run in the copy, which holds no release record). The same copy with no overlay reads null and prints no advisory, as the worktree does. Criterion 2 asks for the floor alone with harness check passing, and both hold; main had no build none.",
  "evidence": [
    "Probe under node scripts/harness.mjs bounded, 2026-10-12T02:14:04Z to 02:14:05Z, in a scratch copy made by docs/evidence/WO-076/verification-001/mkcopy.sh: with build/overlay.json {\"version\":1,\"build\":\"none\"} selected, harness emit exit 0 (2 generated surfaces), harness check exit 0; only .claude/harness-manifest.json remains under .claude, .agents and .codex, with build none, profiles [], installed [] and the overlay path and SHA-256; harnessRuntimeCause(copy) returns runtime-unavailable; refreshHarnessRuntime(copy, build) runs the build callback once and throws 'Built runtime still runtime-unavailable; checkout preserved; run node scripts/bootstrap.mjs'; node scripts/resume.mjs status exits 0 and prints the runtime-unavailable advisory on stderr; the same copy re-emitted without an overlay reads null and prints no advisory; the worktree reads null",
    "scripts/lib/harness-runtime.mjs harnessRuntimeCause: a manifest whose profiles is not a non-empty array returns runtime-unavailable; the function reads no build key",
    "Consumers: scripts/resume.mjs line 1166 and scripts/refute-plan.mjs line 348 (reportHarnessRuntime, advisory on every command); scripts/worktree.mjs line 944 (refreshHarnessRuntime at finish and settle, throws); scripts/release.mjs lines 1466 to 1490 (ensureReleaseRuntime, called at 2370, 2392 and 2449, throws after npm run build)",
    "Class escape: VER-001 judged the same code identity; product 07 §Verification review and attack instructs the real corpus instead of a fixture for every criterion and VER-001 chose the operator-flow lens; its buildNone probe (docs/evidence/WO-076/verification-001/transcript.txt) ran emit and check and no lifecycle, worktree or release command"
  ],
  "rejected": [
    {
      "option": "Fail the review and route the reader to repair",
      "reason": "Criterion 2 holds on the fixture and the real floor, main had no build none, and product 07 routes a finding outside the criteria that breaks no behavior main had as a follow-up by rule."
    },
    {
      "option": "Teach harnessRuntimeCause about build none in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it (product 07 §Independent workflows and integration); the edit would also change the code identity and lose the passing product gate."
    },
    {
      "option": "Class the finding new-scope because harness-runtime.mjs is outside the declared surfaces",
      "reason": "The class follows verification's instructed scope, not the surface list: the manifest shape is the subject's, and running the instance after a build none emit is criterion 2's real-corpus attack under the operator-flow lens the verifier named."
    }
  ],
  "followup": "The next WO-076 repair, or the next order that edits scripts/lib/harness-runtime.mjs or the build none manifest in scripts/lib/harness.mjs harnessInstallation. Rule a repair must hold: a manifest that declares build none has no runtime to pin, so harnessRuntimeCause returns null for it and no command advises a bootstrap, rebuilds or refuses on its account; a manifest with no build key and an empty profiles list keeps reading runtime-unavailable; worktree finish, settle and release prepare proceed in a build none instance without a runtime pin check. Check: a case asserting harnessRuntimeCause null for the WO-076 build-none fixture manifest and runtime-unavailable for an empty-profiles manifest without a build key, and the build-none fixture running node scripts/resume.mjs status with nothing on stderr. Priority: medium, because an instance that selects build none is told to bootstrap on every command and cannot finish a worktree or prepare a release.",
  "reopenWhen": "An instance selects build none and runs a lifecycle, worktree or release command, or harnessRuntimeCause gains another consumer."
}
```

Register row whose reopening condition this order met by its letter, re-deferred by
name in FINAL-001's register section: FUP-e835d826e9af5417 (WO-187-D042), because
the order edits `packages/skeleton/src/loadouts/contributor.ts`, though only the
overlay composition and the identity facet and not the verifier role text the
row's remaining sentence would join; that sentence is role text the reviewer may
not write at final review. The register moved from `39b1dec8…` to `ca15d4ec…`.

Handoff gates at the report: `npm run format`, then `npm run test:docs`, passed
35 of 35 with 35 fresh tasks in 134.04 s (recorded 2026-10-12T02:29:57.139Z);
`npm test -- --review` at code identity `d43b5afa…` reused 92 passing tasks from
the executor's 01:20:31.460Z row, ran `format` fresh and passed 41 of 41 in
8.39 s (recorded 02:30:16.460Z). A confirming document gate at the filed bytes
precedes the result transition; its paragraph follows the transition.

Confirming document gate at the filed report: `npm run format`, then
`npm run test:docs`, passed 35 of 35 with 35 fresh tasks in 122.08 s (recorded
2026-10-12T02:34:05.107Z) with every report, body and note at its filed bytes;
`git diff --check` was clean. The result transition recorded the pass at
02:34:32.980Z with finding counts escape 1, integration 0, new-scope 0 and
unclassed 0, carrying the review gate row of 02:30:16.460Z at code identity
`d43b5afa…`; the order is closed and awaits its PR, merge and release close.
