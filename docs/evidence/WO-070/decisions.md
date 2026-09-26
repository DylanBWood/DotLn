# WO-070 decisions

Dispatch: `resume: next`, 2026-09-25. Executor readback: codex-cli 0.157.0,
gpt-6-sol, ultra effort (normalized xhigh). The root session is the sole
writer; two read-only inspection agents, no descendants, were planned against
the cap of 20.

Goal alignment: a control Beacon emitted from an exported control plane
without the skeleton source is a prerequisite for the independently verified
source-to-deliverable loop. Keep the existing codebooks and permissions while
moving their home (policy resistance); use the existing fixtures and two
bounded inspections to limit shared compute and attention (commons and
escalation). Byte equality, an actual isolated transition, and the full gate
guard against drift, rule beating, and pursuing an import-count proxy instead
of portability. The new home is chosen by the import and build evidence, not
by prior investment (success to the successful); the transition removes a
recurring operator packaging rescue (shifting the burden). Naive
Interventionism preserves the typed reactor and Beacon storage behavior and
uses a temporary repository for the smallest end-to-end probe. NoOp leaves
the observed skeleton-source import in the lifecycle path, so it cannot meet
the selected order; reopen on contrary executable evidence.

## WO-070-D001

```json
{
  "id": "WO-070-D001",
  "kind": "experiment",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Use the required portability fixture as the deciding observation; decline a separate throwaway module-resolution experiment.",
  "question": "Would a separate package-resolution probe reduce implementation cost beyond the required isolated lifecycle fixture?",
  "alternatives": [
    "Run a standalone throwaway Node package-resolution probe before implementation",
    "Use the required isolated lifecycle fixture and staged TypeScript build"
  ],
  "evidence": [
    "docs/work-orders/WO-070-beacon-portability.md acceptance criteria 2 and 3",
    "scripts/build.mjs stages only packages with tsconfig.json",
    "scripts/test-beacon-fixture.mjs already supplies the shared temporary repository installer"
  ],
  "observation": "The required fixture and build already exercise the resolution behavior; an extra probe would repeat setup without establishing another outcome.",
  "budget": { "wallSeconds": 600 },
  "execution": "declined",
  "reason": "The required acceptance checks directly observe package resolution and Beacon emission, so a separate trial duplicates them.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": ["none; separate experiment declined"],
    "source": "No separate experiment was run; prerequisite source inspection is implementation work and is not attributed as trial cost."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["none; separate experiment declined"],
    "summary": "No recurring saving is claimed; the required checks decide the module home."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "rejected": [
    {
      "option": "Separate throwaway probe",
      "reason": "It would repeat the fixture and staged-build setup without stronger evidence."
    }
  ],
  "reopenWhen": "The required fixture or staged build cannot isolate a package-resolution failure."
}
```

## WO-070-D002

```json
{
  "id": "WO-070-D002",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-070 module home and fixture",
  "decision": "Move all seven build-free Beacon leaves into the private @dotln/beacons workspace. Bootstrap scripts import its source directly; the skeleton imports it by package name. Stage the package during TypeScript builds without producing a dist copy.",
  "evidence": [
    "The seven original source SHA-256 values were captured before the move; only JSDoc type references changed inside those leaves",
    "npm run build passed after package-owned type declarations and build staging",
    "node --test scripts/test-beacon-portability.mjs passed: source/dist scan and isolated activation with decoded public/verifier Beacons",
    "packages/skeleton/src and scripts/lib had distinct source/dist Beacon import paths before the move"
  ],
  "rejected": [
    {
      "option": "Copy the leaves into scripts while retaining skeleton copies",
      "reason": "Two physical module identities would survive."
    },
    {
      "option": "Build the skeleton inside the export",
      "reason": "The launchpad export carries compiled output and WO-070 requires bootstrap emission without skeleton source."
    },
    {
      "option": "Keep the seven leaves in skeleton source",
      "reason": "The control plane would still depend on that package for Beacon emission."
    }
  ],
  "reopenWhen": "A consumer resolves the workspace name to a different physical module, the isolated transition fails on a supported host, or a Beacon fixture changes bytes."
}
```

This is an internal workspace relationship, with no new third-party package.
The codebook and filesystem algorithms are unchanged; only their JSDoc type
imports now resolve in the package-owned declarations. The shared fixture
installer and evidence-source inventories follow the moved paths. The
pre-2026-09-09 ledger-entry duty is discharged by this decision file and the
generated decisions index under the executor skill; the idea ledger remains
the operator ideation and planning surface.

The standing release assignment sets the patch target to `v0.51.1` above the
observed local `v0.51.0` tag. The new workspace starts at `0.1.0`; the compatible
skeleton import change advances `@dotln/skeleton` to `0.43.2`, with the console's
exact pin following. Reopen this assignment if the release baseline changes
before final review.

## WO-070-D003

```json
{
  "id": "WO-070-D003",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-070 isolated lifecycle fixture",
  "decision": "Separate pure release tag reading into scripts/lib/release-tags.mjs and have dependency checks import it directly, preserving release-records.mjs exports for existing consumers.",
  "evidence": [
    "The first isolated activation failed to load scripts/lib/gate-evidence.mjs because release-records.mjs imported it at module load from packages/skeleton/src",
    "scripts/lib/dependencies.mjs requires only localReleaseTags and semver for activation",
    "The isolated activation and Beacon decode passed after the split"
  ],
  "rejected": [
    {
      "option": "Copy skeleton gate-evidence.mjs into the portability fixture",
      "reason": "Would make the fixture pass while violating its no-skeleton-source premise."
    },
    {
      "option": "Duplicate release tag parsing in dependencies.mjs",
      "reason": "Would create a second release-history interpretation."
    }
  ],
  "reopenWhen": "Release history consumers disagree after the split or a future activation requires the reviewer gate from release-records.mjs."
}
```

## Takeover, 2026-09-25

The Codex session above stopped during a provider outage. In the same
`resume: next` dispatch the operator wrote: "codex started this session but
open ai is down. need you to take over from where it left off". Claude
continued the order from 22:57Z: Claude Code (`claude --version` 2.1.283), model
`claude-opus-5-5` (the operator's `/model` selection, stated by the session),
effort `xhigh` (`CLAUDE_EFFORT`, claude-session-readback; the operator selected
`ultracode`, recorded as xhigh with workflow orchestration). One read-only
review workflow ran three reviewers and one batched adversarial verifier, four
subagents against the cap of 20; no subagent wrote.

Goal alignment for the takeover and the repairs below: the order is a
prerequisite for exporting a control plane that emits Beacons without the
skeleton, on the path to an independently verified source-to-deliverable loop.
Policy resistance: every guard stays (immutable snapshots, fail-closed target
hooks, byte-identical Beacon fixtures); the repairs make installed roots carry
the new workspace instead of relaxing a check. Commons: four read-only agents
and serial gate runs; the one paid live episode needed operator authorization
(D010). Drift to low performance: the standard is the full product and
machinery gate, not the product subset Codex's own run would have shown.
Escalation: no new gate or approval; existing queue, decision and amendment
surfaces carry it. Success to the successful: Codex's home choice (D002) was
re-derived from the order and WO-033 rather than kept for its sunk work; its
evidence claims were reproduced before being relied on. Shifting the burden:
without the snapshot repair, every launchpad and Copilot qualification root
would have needed an operator rescue. Rule beating: each new regression test
was shown to fail on the defect it guards. Seeking the wrong goal: the outcome
is a portable control plane and an unbroken harness, not a passing
beacon-portability suite alone. Naive Interventionism: the move's consumers
(hooks, launchpads, fixtures, evidence editions) were enumerated from failing
suites and a static trace before editing; each repair is reversible and
local. NoOp: leaving Codex's tree as it was fails 8 product tests in two suites
and 13 machinery tests in five, and breaks installed hook runtimes outside this
checkout.

## WO-070-D004

```json
{
  "id": "WO-070-D004",
  "date": "2026-09-25",
  "dispatch": "resume: next (Claude takeover of the Codex-started dispatch)",
  "decision": "Continue from the Codex working tree without discarding or restarting it: keep its module move, write-backs and D001-D003, independently reproduce each evidence claim before relying on it, run the full product and machinery gates Codex had not run, and repair what they expose within this order.",
  "evidence": [
    "Canonical status at takeover: phase active, one WorkOrderActivated event (22:22:37Z), checkpoint refs/dotln/checkpoint/WO-070/1; no implementation-ready, gate row or usage from the Codex segment",
    "Writer reservation: this Claude session (harness writer --show, reservedAt 22:57:03Z)",
    "Working tree: 45 tracked files changed plus packages/beacons, scripts/lib/release-tags.mjs and scripts/test-beacon-portability.mjs untracked; docs/final-reviews/WO-070/PR.md is the npm run meta process-meter projection, not an authored PR",
    "D002's leaf-integrity claim reproduced from HEAD blobs: beacon-io.mjs and beacon-provenance.mjs byte-identical; the other five change only JSDoc type-reference paths plus one Prettier reflow of a type cast in control-beacon-fs.mjs (implementation.md)"
  ],
  "rejected": [
    { "option": "Restore checkpoint 1 and restart the order", "reason": "Discards reviewable, largely correct work; the skill forbids discarding work and the defects found are repairable in place." },
    { "option": "Record implementation-ready on Codex's claims", "reason": "No gate had run; the first full gate failed 8 tests in two product suites, and the machinery suites failed 13 more tests across five suites." }
  ],
  "reopenWhen": "Codex's segment is found to have written outside this worktree or to have run commands this record does not account for."
}
```

## WO-070-D005

```json
{
  "id": "WO-070-D005",
  "date": "2026-09-25",
  "dispatch": "resume: next; adjacent-0001 (revision 2)",
  "decision": "Every root that assembles DotLn packages carries the build-free @dotln/beacons workspace. scripts/lib/harness.mjs exports runtimeModuleDirectory (a built package ships dist; a build-free workspace, package.json without tsconfig.json, ships src), used by preserveHarnessRuntime, the authority-probe launchpad and the target-harness fixture; builders that list packages by name (copilot-qualification, harness-live-smoke, and the test-harness, process-debt and worktree-integration fixtures) copy and link packages/beacons; the beacon-portability runner row states what it protects.",
  "evidence": [
    "A copy of the immutable runtime snapshot moved outside the checkout failed: ERR_MODULE_NOT_FOUND, Cannot find package '@dotln/beacons' imported from snap/packages/skeleton/dist/src/reactor.js; preserveHarnessRuntime copied only packages with dist",
    "First runs: npm test failed worktree-integration (7 of 9); --only runs failed harness-fixtures (1), process-debt (6), runner-fixtures (1) and harness-probe (2), including DOTLN_TARGET_RUNTIME_REFUSED in a target launchpad and TS2307 for @dotln/beacons in a staged build",
    "The new scripts/test-harness.mjs test 'WO-070 runtime snapshots own the build-free Beacon workspace they import' fails on HEAD's harness.mjs and passes with the fix",
    "After the repair: runner-fixtures, worktree-integration, harness-probe, process-debt and harness-fixtures PASS (--only, 23:21Z to 23:28Z); adjacent-0001 completed with those results"
  ],
  "rejected": [
    { "option": "Let the snapshot resolve @dotln/beacons through the checkout's node_modules", "reason": "It breaks snapshot immutability and fails in any launchpad or qualification root without that link, as reproduced." },
    { "option": "Compile or copy the leaves into skeleton dist", "reason": "Recreates the second module identity this order removes (D002)." },
    { "option": "Pin packages/beacons/src files in the harness runtime file list", "reason": "Changes the pinned-path contract and generated hooks. Before WO-070 the dist codebook copies were also unpinned, so parity holds; recorded as a limit rather than widened here." }
  ],
  "reopenWhen": "A Beacon-leaf-only change must force a fresh harness snapshot (the snapshot id hashes only the pinned dist files), or a new package layout is neither built nor build-free."
}
```

## WO-070-D006

```json
{
  "id": "WO-070-D006",
  "date": "2026-09-25",
  "dispatch": "resume: next; acceptance criterion 2",
  "decision": "Read criterion 2 and the title's 'no file imported from both source and dist/' as scoped to the seven Beacon leaves. Rename the grep test to say so, and have its runner row build first so the absent skeleton dist copies are judged against a fresh build.",
  "evidence": [
    "WO-033's Beacon portability item: 'Either the seven build-free .mjs leaves move ... One module identity results: no file is imported both from source and from dist/'",
    "WO-070 Objective: 'Give the seven build-free leaves one home ... so that no file is imported both from source and from dist/'",
    "Remaining cross-file pairs outside the leaves: usage-observation.mjs (dist: scripts/harness.mjs:4; source: scripts/lib/harness-runtime.mjs:78 and :128, scripts/lib/meta.mjs:14 and others) and gate-evidence.mjs (dist: scripts/harness.mjs:15, scripts/lib/authority-probe.mjs:25; source: scripts/lib/gate-evidence.mjs:1)",
    "Neither module declares mutable module-level state (no top-level let or var and no module-level Map, Set or WeakMap), so the pairs are a structural smell without an observed failure"
  ],
  "rejected": [
    { "option": "Generalize the scan to every package module and move the other build-free modules", "reason": "Those modules are harness-pinned runtime files and belong to the plane/kit boundary the operator deferred (D009)." },
    { "option": "Leave the test named 'no source/dist import pair'", "reason": "It would claim more than it proves." }
  ],
  "reopenWhen": "Either module gains module-level mutable state, a verifier or reviewer reads criterion 2 as covering every module, or the plane/kit follow-up from D009 is scheduled."
}
```

## WO-070-D007

```json
{
  "id": "WO-070-D007",
  "date": "2026-09-25",
  "dispatch": "resume: next; review finding release-docs F3",
  "decision": "Register beacons as a release component wherever evidence compares release labels: evidenceSourceContent's component list (packages/skeleton/src/evidence-editions.mjs, used by the evidence editions and by feedback's judgedBehavior) and the pins record's component labels (scripts/feedback-evidence.mjs).",
  "evidence": [
    "Without it, a later @dotln/beacons version bump changes packages/beacons/package.json, the skeleton's @dotln/beacons pin and the lockfile's packages/beacons entry as behavior, forcing a paid live feedback episode where a deterministic carry suffices",
    "New skeleton test 'WO-070 the build-free Beacon workspace is a component whose release labels compare by content' passes with the change and fails with beacons removed from the list"
  ],
  "rejected": [
    { "option": "Leave the list at four components", "reason": "It turns every future Beacon release into a live-episode obligation." },
    { "option": "Add beacons to scripts/test-evidence-sources.mjs:53", "reason": "That loop copies dist, which a build-free workspace does not have." }
  ],
  "reopenWhen": "Another workspace joins packages/, or component labels change shape."
}
```

## WO-070-D008

```json
{
  "id": "WO-070-D008",
  "date": "2026-09-25",
  "dispatch": "resume: next; review findings criteria F4, F5, F8, release-docs F2, F7, consumers F4, F5",
  "decision": "Apply the verified review repairs: packages/beacons/src/types.d.mts derives its codebook-backed unions from CONTROL_CODEBOOK and BEACON_CODEBOOK, states truthfully that the skeleton keeps its own declarations, and renames its label union BeaconProvenanceLabel; release-records.mjs re-exports exactly its twelve former release-tag names instead of export *; the 02 Beacon codebook v1 text names @dotln/beacons; ADR 0002 gains a dated WO-070 amendment; 03's layer row reads 'Beacon metadata I/O' and its prose separates the effect edge, the pure codebooks and the direct post-append projection; the roadmap entry states the compatibility impact.",
  "evidence": [
    "HEAD leaves referenced skeleton TypeScript types, one declaration; Codex's types.d.mts added a hand-copied second one",
    "Mutation probe: setting ControlBeaconState.phase to number in types.d.mts fails npm run build with four TS errors in the leaves, so the build checks the derived declarations",
    "release-records.mjs exports after the change equal HEAD's fifteen names; no importer uses manifestFromAnnotation, releaseAnnotations or releaseTagsFrom",
    "npm run publication:check passes after the edition locks were refreshed"
  ],
  "rejected": [
    { "option": "Replace the skeleton's declarations with re-exports from @dotln/beacons/types", "reason": "The skeleton's forms derive from the codebooks and AuditActionClass; re-exporting the hand-written file would weaken them." },
    { "option": "Keep export * and restate D003", "reason": "Widens the module's public surface for no consumer." }
  ],
  "reopenWhen": "The skeleton's Beacon type declarations change without the matching types.d.mts change, or a consumer needs a release-tag helper from release-records.mjs."
}
```

## WO-070-D009

```json
{
  "id": "WO-070-D009",
  "date": "2026-09-25",
  "dispatch": "resume: next; carry-ins on the WO-070 row of docs/planning/work-order-map.md",
  "decision": "At the operator's direction, dispose the four follow-ups allocated to WO-070 without code change. WO-069-D005 (FUP-a7175a13eca745f2), D016 (FUP-ec23fc47b2aabafe) and D017 (FUP-99ec03a092896aa7) are deferred together to the plane/kit root-resolution follow-up below; WO-158-D006 (FUP-09a2fb517f0ffbc4) stays deferred to the next Beacon codebook revision, which WO-070 is not.",
  "evidence": [
    "Operator answer in this dispatch, 2026-09-25: 'Defer, as recommended (Recommended)' to the question naming all four carry-ins and the recommended disposition",
    "D005, D016 and D017 each reopen when 'WO-070 settles the kit/plane module identity'; WO-070 settles it only for the seven Beacon leaves (D006), while gate-evidence, usage-observation, writer-teardown and codex-continuation keep source and dist identities and are harness-pinned runtime files",
    "All three are priority low with the default layout unaffected (WO-069 D016 and D017 text)",
    "WO-070's non-goal is Beacon semantics and criterion 1 requires byte-identical Beacon fixtures, so it cannot add WO-158-D006's withdrawn phase"
  ],
  "rejected": [
    { "option": "Implement D016 and D017 here", "reason": "Operator chose deferral; both change fixture and measurement semantics under a hypothetical non-default layout." },
    { "option": "Implement D005 here", "reason": "Edits harness-pinned runtime modules outside this order's leaves and would widen the re-mint surface." }
  ],
  "followup": "Plane/kit root resolution, carried from WO-069 D005, D016 and D017 (FUP-a7175a13eca745f2, FUP-ec23fc47b2aabafe, FUP-99ec03a092896aa7): settle one module identity for the remaining build-free package modules (gate-evidence, usage-observation, writer-teardown, codex-continuation) and let the packages' ignored local lane follow the launchpad configuration; give harness-context, harness-probe, probe-codex-effort and harness-live-smoke an explicit tool root for kit inputs while outputs keep the launchpad; compute copilot-qualification and harness-live-smoke fixture names against the fixture root. Natural home: the export-kit orders (WO-074, WO-075). Check under a DOTLN_LAUNCHPAD that is not the scripts' checkout and a dotln.config.json with non-default roots. Priority: low; the default layout is unaffected.",
  "reopenWhen": "A launchpad separate from the scripts' checkout, or one declaring non-default roots, must run these paths before the follow-up lands."
}
```

## WO-070-D010

```json
{
  "id": "WO-070-D010",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator scope expansion for acceptance criterion 5",
  "decision": "Operator authorization: run one live feedback self-host episode (claude-cli-print, claude-sonnet-5, xhigh) and deterministically re-mint each selected edition this order stales, as WO-070 revision 001, once after the last registered-source edit; the order text gains the section 'Operator scope expansion — 2026-09-25', bound by plan amend-order.",
  "evidence": [
    "Operator answer in this dispatch, 2026-09-25: 'Authorize one (Recommended)' to the question stating the three judged files, product 07's Cost-line rule, the transport and WO-157's recorded cost (659,304 tokens, USD 1.56, 172 s; a failed first attempt USD 1.90)",
    "npm test (23:08:56Z, exit 1): skeleton feedback-edition test 113 'feedback evidence is stale: judged behavior changed since docs/evidence/WO-159/feedback-001 (.feedback-source/package-lock.json, .feedback-source/packages/skeleton/package.json, packages/skeleton/src/reactor.ts); a behavioral change needs a fresh live self-host episode'",
    "npm run test:machinery (23:12Z): authority-evidence 'stale WO-160 revision 002 evidence: bundle-diff.json'; artifact-evidence and verification-evidence passed",
    "docs/product/07-execution-guide.md, the planning-output list: an order that changes a FEEDBACK_SOURCE_PATHS file beyond a release label names the feedback re-mint and one live episode in its Cost line"
  ],
  "rejected": [
    { "option": "Normalize the import rewrite and workspace pin out of the feedback projection", "reason": "Loosens the judged-behavior contract to pass a gate: rule beating." },
    { "option": "Wait for the Codex transport", "reason": "Offered; the operator chose to run now." }
  ],
  "reopenWhen": "The episode is refused or fails (operator decides on another), or a registered source changes after the mint."
}
```

## WO-070-D011

```json
{
  "id": "WO-070-D011",
  "date": "2026-09-25",
  "dispatch": "resume: next; evidence-sources suite",
  "decision": "Board up, not fix here: scripts/test-evidence-sources.mjs test 'WO-154 a pins-only change keeps or carries the live audit' assumes the selected feedback edition is its own live audit, so it fails whenever the selection is a carried edition.",
  "evidence": [
    "Failure: expected 'docs/evidence/WO-161/feedback-001', actual 'docs/evidence/WO-159/feedback-001' at test-evidence-sources.mjs:269",
    "docs/evidence/current.json at HEAD selects feedback WO-161 revision 001, whose edition.json liveAudit names docs/evidence/WO-159/feedback-001; WO-070 did not change either file, so the failure is pre-existing on main (inference from unchanged inputs)",
    "The test reads pins and the self-host stream from the selected directory and carries from it (lines 280-360), so accepting a carried selection means redesigning the test",
    "After this order's live re-mint the selection is live again and the test passes"
  ],
  "rejected": [
    { "option": "Rewrite the WO-154 test here", "reason": "Not bounded: it redesigns another order's evidence test around carry semantics this order does not change." }
  ],
  "followup": "WO-154 evidence test: make scripts/test-evidence-sources.mjs 'a pins-only change keeps or carries the live audit' start from the live audit an edition names (edition.liveAudit.edition) rather than assuming the selected feedback edition is live, so it passes after any deterministic carry (as on main at af401170, where the selection WO-161 carries WO-159). Check with a carried selection in the edition copy. Priority: medium; it hides machinery regressions whenever the current edition is carried.",
  "reopenWhen": "The next deterministic carry selects a carried feedback edition before the follow-up lands."
}
```
