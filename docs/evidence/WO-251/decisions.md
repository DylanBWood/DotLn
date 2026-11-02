# WO-251 decisions

## WO-251-D001

Desktop control is an instance opt-in with a separate session request. The
configuration's one feature accepts a boolean or an object with a boolean
`on` and optional string `note`. A missing election is off; an unreadable or
invalid election cannot establish an opt-in. The hook reads it at judgment
time, so turning it off takes effect even before settings are regenerated.
The emitter carries the resolved value into the existing instance overlay;
the compiler itself reads no configuration. Direct emit/check callers also
resolve the root's election, including evidence preparation and drive checks.

One inventory supplies tool prefixes to the hook and deny patterns to the
compiler. Skill selection is judged through the input's `skill` field.
Every generated role, including the router, carries the browser-verification
rule. The refusal sentence is rendered from class rows with derived count
and provenance, preserving the six existing classes and adding desktop
control. The feature inventory is an additional write-back input because its
current-state table must distinguish this implemented election from WO-241's
planned registry and generated page.

```json
{
  "id": "WO-251-D001",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Implement the declared desktop-control boundary with one default-off election, live hook judgment, matching emitted host denials and shared role guidance; preserve a separate explicit operator request in the session.",
  "evidence": [
    "docs/work-orders/WO-251-desktop-control-is-opt-in.md: objective, design and criteria 1-5",
    "docs/work-orders/WO-241-the-features-file.md: Design value shape and optional reason",
    "The cited ignored nomination capture is absent in this worktree; its single main-checkout copy was read at activation, item 10. No raw intake was copied.",
    "packages/skeleton/src/harness-host.ts: unclassified MCP tools previously reached the classification advisory; scripts/lib/config.mjs had no features section",
    "docs/product/feature-configuration.md: the instance-election inventory"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Would leave the reported desktop-control gap and the absent browser-verification instruction unchanged." },
    { "option": "Treat an enabled feature as authorization to act", "reason": "The operator's request in the current session remains required." },
    { "option": "Independent hook and settings inventories", "reason": "Would permit the two enforcement paths to drift." },
    { "option": "Build the general feature registry now", "reason": "WO-241 owns it; this order supplies only its compatible first id." }
  ],
  "reopenWhen": "The operator changes the boundary, a host exposes desktop control under another name, or WO-241 needs to absorb the one-id validation."
}
```

## WO-251-D002

The official [permission documentation](https://code.claude.com/docs/en/permissions)
was checked at activation through Context7 and directly. It documents
server-qualified MCP patterns and tool-name globs for deny rules. The
[skill documentation](https://code.claude.com/docs/en/skills) distinguishes
exact skill names and names with arguments; both forms are emitted. The
[computer-use documentation](https://code.claude.com/docs/en/computer-use)
names the built-in `computer-use` server, the
[Chrome documentation](https://code.claude.com/docs/en/chrome) names
`claude-in-chrome`, and the [MCP documentation](https://code.claude.com/docs/en/mcp)
names the built-in browser server. The remote-device and enable-tool prefixes
are the order's supplied inventory: the inspected official pages did not
publish those full names. Synthetic hook inputs test them; no live desktop
or operator-browser action is needed or authorized for this order.

```json
{
  "id": "WO-251-D002",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Emit full-name deny globs for each named tool prefix and exact plus argument-bearing Skill rules; qualify the public-document and synthetic-evidence boundaries without claiming live desktop qualification.",
  "evidence": [
    "Context7 library lookup selected /websites/code_claude, the official Claude Code documentation; permission/Skill lookup and server-name lookup completed on 2026-11-02",
    "https://code.claude.com/docs/en/permissions: MCP and Tool name wildcards",
    "https://code.claude.com/docs/en/skills: Skill(name) and Skill(name *)",
    "https://code.claude.com/docs/en/computer-use: Enable computer use",
    "https://code.claude.com/docs/en/mcp: Configuration warnings",
    "docs/work-orders/WO-251-desktop-control-is-opt-in.md: exact tool and skill inventory"
  ],
  "rejected": [
    { "option": "Deny every MCP tool", "reason": "Would block the project's Playwright route and unrelated services." },
    { "option": "Enable desktop tools to test against the operator's machine", "reason": "Synthetic tool judgments establish these criteria without a takeover; this dispatch requests implementation, not desktop interaction." }
  ],
  "reopenWhen": "Published host syntax or names change, or a named desktop tool bypasses either the host denial or the hook."
}
```

## WO-251-D003

The first build exposed an event-type mismatch: hook configuration uses
`HostHookEvent`, which also includes `PermissionDenied`; the response helper
now accepts that existing type. The configuration probe first assumed a
dotted unknown-key message, while the existing validator names the section
and quoted key separately; the assertions now check that actual contract.
The CLI emission probe first compared a parent-emitted full runtime against
the fixture CLI's smaller copied runtime. It now emits through the same
copied CLI before checking, preserving the snapshot check rather than
weakening it. These are corrections to this implementation and its new
fixtures, not changes to historical evidence.

```json
{
  "id": "WO-251-D003",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Correct the helper's hook-event type and the new tests' assumptions about existing configuration diagnostics and fixture runtime ownership; retain the existing contracts.",
  "evidence": [
    "npm run build: TS2345 at desktopControlResponse; the corrected build passed",
    "bounded configuration election test: actual unknown features key diagnostic; corrected test passed",
    "bounded CLI emission test: pinned snapshot missing or changed at its initial check; fixture() emits using the parent's inventory while the copied CLI owns another inventory"
  ],
  "rejected": [
    { "option": "Weaken snapshot or unknown-key validation to satisfy the new fixtures", "reason": "The failures came from new fixture assumptions; the existing checks were correct." }
  ],
  "reopenWhen": "The corrected fixtures expose a product behavior failure instead of a setup or assertion mismatch."
}
```

## WO-251-D004

```json
{
  "id": "WO-251-D004",
  "date": "2026-11-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.108.0, the next minor above the observed release baseline v0.107.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.107.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-251-desktop-control-is-opt-in.md"
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

## WO-251-D005

The compiler gains the optional desktop-control target input, host deny rules and derived refusal rows; the skeleton gains the tool classification, hook refusal and role guidance. Both receive minor component bumps. The console keeps its component version because its source is unchanged; only its internal dependency pins follow the new versions. External dependency names and versions are unchanged.

```json
{
  "id": "WO-251-D005",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Bump @dotln/compiler from 0.35.0 to 0.36.0, @dotln/skeleton from 0.76.0 to 0.77.0 and the harness-host compatibility pin from 0.40.0 to 0.41.0; update internal dependency pins and package-lock entries only.",
  "evidence": [
    "The order declares minor release classification; release prepare assigned v0.108.0 above v0.107.0",
    "git diff -- packages/compiler/src packages/skeleton/src: new emitted and runtime refusal behavior",
    "git diff -- package-lock.json packages/console/package.json: internal pins only; no new external dependency"
  ],
  "rejected": [
    {
      "option": "Bump every workspace component",
      "reason": "Only compiler and skeleton source changed."
    },
    {
      "option": "Use patch versions",
      "reason": "The new default refusal and configuration input change the exposed behavior."
    }
  ],
  "reopenWhen": "Integration consumes the staged version or a source change affects another component."
}
```

## WO-251-D006

The comparison tested direct prefix checks and a compiled regular expression on the same positive and near-miss inputs. Both agreed. The regular expression was faster in this isolated microbenchmark; the direct list remains easier to audit and changes no escaping rules. Its observed cost is small relative to a hook process, but this experiment did not measure an aggregate session saving. The before/after classification measurements exclude process startup, configuration I/O, runtime pin checks and journaling; they establish only the named function cost. Raw results are in [desktop-cost.json](desktop-cost.json). The two measurement scripts preserve the scratch probes' algorithms with repository-relative imports and stdout output for reproduction.

```json
{
  "id": "WO-251-D006",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep direct prefix matching for the shared desktop inventory after the bounded equivalent-input comparison; record the faster regex arm without claiming an unmeasured end-to-end benefit.",
  "question": "Does compiled regular-expression matching justify replacing the direct audited prefix list?",
  "alternatives": [
    "Direct prefix array using startsWith",
    "One compiled regular expression generated from the same list"
  ],
  "observation": "All 36 positive and near-miss names agreed. Median per-call times: direct 72.37375 ns, regex 16.72333 ns. The production before/after function measurements are separately scoped in desktop-cost.json.",
  "execution": "run",
  "outcome": "kept-current",
  "budget": {
    "wallSeconds": 900
  },
  "cost": {
    "wallSeconds": 0.196,
    "tokens": null,
    "commands": [
      "node scripts/harness.mjs bounded -- node docs/evidence/WO-251/prefix-comparison.mjs"
    ],
    "source": "The original session-scratch probe used the identical algorithm and inventory; bounded-result durationMs 196 at 2026-11-02T01:56:35.267Z."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node scripts/harness.mjs bounded -- node docs/evidence/WO-251/desktop-cost.mjs"
    ],
    "summary": "Function-level cost only; unknown per-order change. The desktop tool now returns desktop.control instead of throwing as unclassified; Playwright stays unclassified."
  },
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/evidence/WO-251/desktop-cost.json",
    "scripts/lib/config.mjs and packages/skeleton/src/harness-command.ts: current election and prefix implementations"
  ],
  "rejected": [
    {
      "option": "Replace the direct matcher with a regular expression",
      "reason": "An isolated speed advantage does not establish a material session benefit, and the direct list avoids generated regex escaping."
    }
  ],
  "reopenWhen": "Measured hook or session cost makes prefix matching material, or the inventory becomes too large for a direct list."
}
```

## WO-251-D007

The shared role instruction and generated refusal row add 909 bytes to every installed root. Each measure is CLAUDE.md plus that role's SKILL.md, with identical Claude and Codex copies. Projected totals are executor 39,309; verifier 34,142; reviewer 36,912; release-close 24,414; planner 25,222; refuter 24,036; router 16,327 bytes. Only planner exceeds its effective ceiling, by 646 bytes. Product 07's current route preserves the guidance and boards optimization with equivalent usefulness; it forbids raising the ceiling or recording another acceptance. All ceilings remain unchanged. A new oracle links to the unchanged WO-247 oracle and pins both default and economy-opt-out role bytes; its consumers select the new oracle and retain the whole history.

```json
{
  "id": "WO-251-D007",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Preserve all role duties, mint a linked WO-251 role oracle and record the planner's 646-byte cold-start breach as an optimization follow-up with equivalent usefulness, keeping every ceiling unchanged.",
  "evidence": [
    "docs/product/07-execution-guide.md: Discipline, current cold-start route under the operator's 2026-10-05 direction; the 2026-09-17 acceptance route is retired",
    "scripts/lib/process-budget.mjs measureColdStarts: installed activation roots",
    "harnessInstallation plus composeHarnessInstruction: projected current roots",
    "scripts/test-process-debt.mjs role oracle walk and scripts/test-gate-followups.mjs startup-cost chain define the oracle contract",
    "docs/work-orders/WO-251-desktop-control-is-opt-in.md: every role must carry the new rule"
  ],
  "rejected": [
    {
      "option": "Trim existing duties to remain under the planner byte ceiling",
      "reason": "The current route preserves needed rules and boards optimization for equivalent usefulness."
    },
    {
      "option": "Raise the ceiling or record a new acceptance",
      "reason": "Product 07 explicitly forbids both under the current route."
    },
    {
      "option": "Rewrite the WO-247 oracle",
      "reason": "Historical role hashes and parent links are immutable evidence."
    }
  ],
  "followup": "Optimize the planner's installed cold start with equivalent usefulness: WO-251 measures 25222 bytes against the unchanged 24576-byte ceiling, a 646-byte breach. Inspect shared guidance in packages/skeleton/src/loadouts/contributor.ts and packages/compiler/src/harness.ts with installed CLAUDE.md and both planner skills; preserve the browser-verification and explicit desktop-election duties. Validate with scripts/test-process-debt.mjs, scripts/test-gate-followups.mjs and the existing harness-context measurement; broader role restructuring belongs to a future planning allocation.",
  "reopenWhen": "An optimization preserving equivalent usefulness is allocated, another reviewed rule changes a role root, or integration changes its preceding oracle or measured ceiling."
}
```

## WO-251-D008

`npm run sync` re-minted authority, artifact-identity and verification editions
and carried the existing feedback judgments into WO-251 revision 001, then
selected them in `docs/evidence/current.json`. The registered runtime and
version inputs changed; no feedback-judged behavior required a live episode.
The console self-host manifest and expected views were regenerated from their
current source. The new role oracle passed its existing history check.
[role-context.json](role-context.json) records installed before/after bytes and
budget verdicts, confirming D007's projected totals.

Sync refused the comment baseline because the replaced refusal-count comment
no longer matched one grandfathered fingerprint. The existing shrink-only
`node scripts/comment-labels.mjs --write` removed exactly that entry; its
subsequent check passed. No new comment was grandfathered. The initial sync
was launched before the format process's completion had been observed; that
was a sequencing error. Formatting completed successfully and sync reported
its formatting check current, but the ordered format/sync sequence is repeated
before reviews rather than relying on that overlap.

```json
{
  "id": "WO-251-D008",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Regenerate derived evidence and console expectations from their registered current inputs, retain historical editions, remove only the obsolete comment fingerprint and repeat the ordered format/sync sequence after the sequencing error.",
  "evidence": [
    "npm run sync: runtime, meta, harness, authority-evidence, artifact-evidence, verification-evidence, feedback-evidence, console-fixtures and publication regenerated; role-oracle current",
    "npm run sync: baseline-fingerprints refused because packages/compiler/src/harness.ts no longer held one baselined comment",
    "node scripts/comment-labels.mjs --write and node scripts/comment-labels.mjs: one removed fingerprint, 74 remaining baselined lines, zero failures",
    "docs/evidence/current.json: all four evidence kinds select WO-251/001",
    "docs/evidence/WO-251/role-context.json: installed measurements match the projected 909-byte addition in both roots"
  ],
  "rejected": [
    { "option": "Rewrite prior evidence or add a new comment-baseline exemption", "reason": "New editions preserve provenance; the source comment was fixed, so its obsolete exemption must leave." },
    { "option": "Treat overlapping formatting and sync as the required final sequence", "reason": "Dependent mutations must run in order; repeat them after all writes settle." }
  ],
  "reopenWhen": "A source or fixture change invalidates the selected evidence, a consumer still selects the old role oracle, or a generation check fails on the current tree."
}
```

## WO-251-D009
I initially misread the historical 2026-09-17 budget route as current and
added a planner acceptance. Reading product 07's full Discipline passage
showed that the 2026-10-05 direction had retired that route: preserve the
needed rule, keep the ceiling and board optimization. The unfiled acceptance
was removed, D007 corrected in place and the current role measurement
regenerated. The measured planner breach remains visible as a follow-up;
no historical acceptance or oracle was edited.

```json
{
  "id": "WO-251-D009",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Correct the mistaken new budget acceptance before review and apply the current cold-start follow-up route.",
  "evidence": [
    "docs/product/07-execution-guide.md: Discipline explicitly retires the 2026-09-17 route and forbids new acceptances",
    "git diff -- docs/control/budgets.json: no remaining change",
    "docs/evidence/WO-251/role-context.json: current planner verdict is breach; D007 records the follow-up"
  ],
  "rejected": [
    { "option": "Keep the new acceptance because earlier orders used it", "reason": "Historical mistakes do not override the current operator direction." }
  ],
  "reopenWhen": "The operator changes the cold-start policy or an allocated optimization discharges the recorded breach."
}
```

## WO-251-D010

The criteria review found three control-flow defects in the first implementation:
changing cwd bypassed the instance election, an optional journal append failure
could erase an off-election denial, and an enabled election returned before
existing descendant and router refusals. The desktop decision is now computed
once after runtime/input validation. An off election refuses before cwd or
session-state handling; an enabled response remains behind the existing
permission guards. Its optional observation records the election, not a claim
that every guard admitted the tool, and cannot change the verdict. The design
review also found that the configuration catch discarded the validator's useful
diagnostic; the denial now retains a bounded, sanitized cause.

```json
{
  "id": "WO-251-D010",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Make the instance's off-election refusal independent of moved cwd and optional journaling, preserve existing admission guards when elected, and retain bounded configuration diagnostics.",
  "evidence": [
    "Independent criteria review: moved-cwd stand-down precedes evaluateExistingHarnessHook; record failure reaches the outer advisory catch; the original enabled return precedes descendant and router admission",
    "Independent design review: readFeatures errors already name the invalid field but the original catch discarded their reason",
    "Bounded single tests passed: desktop control live refusal survives moved cwd and unavailable observation; elected desktop control preserves descendant and router refusals; desktop control refuses by default and reads the live election with one advisory",
    "npm run build passed after the control-flow repair"
  ],
  "rejected": [
    { "option": "Return both off and on judgments before the existing guards", "reason": "Would preserve the descendant-cap and router-latch bypass." },
    { "option": "Make optional observation a condition of refusal", "reason": "A journal failure must not grant desktop access." },
    { "option": "Discard the configuration diagnostic", "reason": "Would leave a conservative refusal unnecessarily difficult to diagnose." }
  ],
  "reopenWhen": "A new entry path bypasses the instance election, or an unrelated admission guard is skipped by an enabled desktop response."
}
```

## WO-251-D011

The consistency review reproduced a stale test contract: the startup-cost
consumer still required every current role to fit a configured or accepted
ceiling. The current product policy instead requires a recorded optimization
for a measured breach. The new planner oracle now names its minted follow-up;
the consumer verifies that the register contains its current disposition and
links it to the growth decision. Historical byte, hash, ceiling and acceptance
checks remain intact. The product test reads the planning register rather than
an active order's evidence record. The consistency recheck then identified the
new register read as a missing dependency in the process-debt suite's source
inventory. That path is now declared so a register-only change selects its
consumer. The operator paused before the full gate, then resumed. All three
existing reviewers rechecked the final inventory change and cleared it before
complete validation.

```json
{
  "id": "WO-251-D011",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Correct the startup-cost consumer to enforce the current breach-to-follow-up policy and add the planner's follow-up identity to the new, unfiled role oracle.",
  "evidence": [
    "Consistency review's bounded single-test failure at scripts/test-gate-followups.mjs: planner current bytes fit the configured or accepted ceiling; actual verdict breach",
    "docs/product/07-execution-guide.md: Discipline current cold-start policy",
    "packages/skeleton/fixtures/wo251-role-baseline.json: startupCost.profiles.planner.followup is FUP-ac86ee429dee2947",
    "The same bounded single test passed after the consumer correction; historical oracle files and budget ceilings are unchanged",
    "Consistency recheck: test-gate-followups reads docs/planning/followups.json; scripts/test-runner.mjs machinerySources.process-debt now declares it"
  ],
  "rejected": [
    { "option": "Restore the removed budget acceptance to satisfy the test", "reason": "The assertion encoded a retired policy; the current operator direction governs the expectation." },
    { "option": "Allow every breach without a record", "reason": "Would lose the required optimization disposition and its reopening condition." }
  ],
  "reopenWhen": "The current role oracle or follow-up disposition changes, or the operator changes the cold-start policy."
}
```

## WO-251-D012

The reviews also traced the separate target-worker adapter. Its compiler branch
and runtime are stricter than the contributor profile cited by this order:
`runTargetHarnessHook` requires compiled target authority for `desktop.control`
and denies classification, observation and runtime failures. That adapter grants
no desktop effect and therefore remains refused even if the launchpad elects
it. The new configurable host-denial and advisory path applies to the ordinary
contributor profiles; this order does not broaden target authority or change
the worker transport's disabled features. This is an observed boundary, not an
unfixed default-off escape.

```json
{
  "id": "WO-251-D012",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Preserve the separate target-worker adapter's stricter compiled authority and record the inspected boundary without adding desktop authority to it.",
  "evidence": [
    "packages/compiler/src/harness.ts: lowerTargetWorker uses the target-worker-v1 branch and dedicated runtime",
    "packages/skeleton/src/harness-host.ts: runTargetHarnessHook classifies desktop.control, requires compiled authority and denies exception paths",
    "scripts/lib/harness.mjs: emitTargetUnlocked constructs the bounded target-worker program",
    "Independent criteria reviewer confirmed no concrete default-off escape in the target adapter; the order cites contributor settings emission and excludes changing worker transport restrictions"
  ],
  "rejected": [
    { "option": "Let the instance election add desktop authority to the target adapter", "reason": "Would broaden the separately bounded worker's effect authority beyond this order's cited implementation path." }
  ],
  "reopenWhen": "An order explicitly authorizes desktop interaction in target workers or an observed target path escapes its compiled denial."
}
```

## WO-251-D013

The first complete review run failed in the historical worker-profile byte
check. Both target profiles inherit the shared tool inventory, so the eight
new desktop entries changed the serialized bytes even though the target
adapter's authority remained unchanged. The check now separately asserts the
exact eight entries and their desktop classification, then removes only those
asserted additions before applying the original historical hash. This preserves
the earlier contract pin and catches a missing, extra or misclassified desktop
entry. No historical oracle or product behavior changed in this repair.

```json
{
  "id": "WO-251-D013",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Repair the historical worker-profile consumer by separately asserting the new desktop inventory and retaining its original remaining-byte hash.",
  "evidence": [
    "npm test -- --review: failed harness-fixtures at 2026-11-02T04:06:42.184Z; WO-146 three contributors share unique outputs while workers remain explicitly two reported the worker-byte hash mismatch; later tasks were skipped",
    "packages/skeleton/src/harness-command.ts: eight desktop wildcard entries join harnessToolEffects; packages/skeleton/src/loadouts/contributor.ts carries that shared inventory into targetWorkerProfiles",
    "scripts/test-harness.mjs: exact desktop-entry assertion precedes the unchanged 9f41bb7cb0176f0b8e73bd9fe760ef628259e69b4ebdbb28fa0a621bd4dba6fb pin",
    "Bounded single-test rerun of that named case passed after the correction"
  ],
  "rejected": [
    { "option": "Replace the historical hash with the new value", "reason": "Would obscure which intentional change explains the new bytes and weaken the preserved contract." },
    { "option": "Delete every desktop-classified entry without asserting it", "reason": "Would conceal missing, extra or misclassified inventory entries." }
  ],
  "reopenWhen": "Another intentional inventory change affects these profiles, or the retained hash fails after separately asserted additions are removed."
}
```

## WO-251-D014

While recovering the failed gate's result, I incorrectly invoked
`node scripts/harness.mjs evidence` as a status read. The command starts an
evidence run; the read/wait route is `evidence --wait`. I stopped the extra run
with `evidence --stop` before repairing the test. The stop output confirmed
all three nested run markers stopped with none active, and the command exited
with no check recorded. This run supplies no passing evidence. The failed
complete review row remains the recorded failure source.

```json
{
  "id": "WO-251-D014",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Stop the accidentally started evidence run and continue from the retained complete-review failure using the documented wait route.",
  "evidence": [
    "scripts/harness.mjs: bare evidence calls beginGateRun and runHarnessEvidence; evidence --wait observes completion",
    "node scripts/harness.mjs evidence --stop at 2026-11-02T04:07:59.804Z: requested three run markers, stopped all three, active empty",
    "The extra command exited 1 with Gate stopped by request during npm test; no check recorded"
  ],
  "rejected": [
    { "option": "Let the accidental run stand in for the prescribed repaired review gate", "reason": "It began before the repair and required rechecks and could supply no valid completion evidence." }
  ],
  "reopenWhen": "A later command is ambiguous about whether it observes or starts a gate; inspect its dispatch before invoking it."
}
```

## WO-251-D015

The document gate exposed an export regression after the product review
passed: the exported instruction measured 7,972 bytes against core's 7,620.
The new 459-byte browser/desktop paragraph exceeded the template's remaining
space under the existing export-versus-core contract. The comparison was
correct and remains unchanged.

The template now states its ownership, generated-block provenance, navigation,
document roots and runtime bootstrap instructions more directly, retaining all
their operational information. Its browser paragraph still states the full
perception order, project-test alternative, default-off election, operator
browser boundary and explicit session request. The clean-room and secrets
sections are unchanged. The exact-text consumer that removes compiled guidance
for a disabled harness retains all old forms and also recognizes the revised
forms; otherwise an exported disabled instance would keep stale navigation.
This additional input is `scripts/lib/harness-instruction.mjs`.

```json
{
  "id": "WO-251-D015",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Repair the exported instruction's context regression by integrating its prose without removing duties, retain the original byte comparison, and update the disabled-harness exact-text consumer while preserving legacy forms.",
  "evidence": [
    "npm run test:docs at 2026-11-02T04:52:03.665Z: launchpad-docs failed inside.instruction.bytes <= core.instruction.bytes; entropy was not started",
    "scripts/test-launchpad-export.mjs: document-only comparison measures installed CLAUDE.md plus each identical role skill; WO-075 criterion 4 declares export bytes no larger than core",
    "Measured retained warm export CLAUDE.md 7972 bytes, core CLAUDE.md 7620 bytes, added browser paragraph 459 bytes",
    "scripts/kit/CLAUDE.template.md and scripts/lib/harness-instruction.mjs: revised paragraphs and their exact removal selectors; prior selectors remain",
    "Bounded single-test rerun of the WO-075 document comparison passed on the repaired template",
    "Bounded single test disabled harness keeps core and kit floors while removing built navigation and runtime warnings passed; ordered format and sync then reported all artifacts current"
  ],
  "rejected": [
    { "option": "Relax the comparison or exclude the new paragraph from its measured subject", "reason": "Would hide the actual exported cold-start regression and weaken the existing contract." },
    { "option": "Enlarge core's instruction with duplicated text", "reason": "Would raise every core cold start without adding a needed duty." },
    { "option": "Remove browser, election, provenance or bootstrap information", "reason": "The instructions must remain useful and complete; fitting the byte comparison alone would not establish that." }
  ],
  "reopenWhen": "Template or generated instruction growth breaks the comparison, a needed duty is lost, or another exact-text consumer still expects only the earlier paragraphs."
}
```

## WO-251-D016

The consistency review traced the revised template to a selector omission.
The disabled-harness regression reads the template and reaches the removal
helper through `harness.mjs`, but its machinery source inventory declared
neither input. Both paths now select `harness-fixtures`; the consumer is
covered even when only the template or helper changes. The export manifest
and fixture copies already carry both files. No new runtime dependency or
test expectation is introduced.

```json
{
  "id": "WO-251-D016",
  "date": "2026-11-02",
  "dispatch": "resume: next",
  "decision": "Declare the template and disabled-harness removal helper as source inputs of the harness-fixtures suite.",
  "evidence": [
    "Consistency review: scripts/test-harness.mjs disabled-harness-floor case reads scripts/kit/CLAUDE.template.md and imports scripts/lib/harness.mjs, which uses scripts/lib/harness-instruction.mjs",
    "scripts/test-runner.mjs: changedMachinery selects declared sources; the coverage check explicitly does not infer transitive imports",
    "The same review traced CLAUDE.template through KIT_TEMPLATE_FILES, harness-instruction through EMIT_CLOSURE, and fixture copies of scripts/lib or scripts; no export/copy omission remains"
  ],
  "rejected": [
    { "option": "Rely on the complete review run or structural coverage to select this regression", "reason": "Would leave future isolated template or helper changes without their consuming suite in ordinary selection." }
  ],
  "reopenWhen": "The regression gains another undeclared input or the suite selection contract changes."
}
```

## WO-251-D017

Verification found a gap between how the two layers name a desktop skill.
Both the hook and the emitted host rules refuse the four declared `Skill`
selections, with or without arguments, and every probed tool name under the
eight declared prefixes. But the hook compares `input.skill` exactly, and the
host rules use only `Skill(<name>)` and `Skill(<name> *)`. The host's
documentation records other names for a skill:

- a synced `anthropic-skills:<name>` skill can arrive in a session under its
  plugin form when Claude Desktop delivers it as a plugin;
- a skill can be invoked by an alias or a display name, and only the
  parameter form `Skill(skill:<name>)` denies a skill under all of them.

In the verification probe the hook admitted `Skill` with `computer-use` or
`chrome-browser` without an advisory. Those spellings are outside the
criterion's declared list, and it is not known whether the host would resolve
them to the listed skills. Even so, the desktop and operator-browser tools
stay refused by both layers, so loading a skill's instructions alone reaches
no desktop. The order's planning receipt already names this class: desktop
control reached under another name. This decision boards the host's
documented parameter form, plus matching hook classification, as its concrete
repair. It is not a blocking finding
([VER-001](../../verifications/WO-251/VER-001.md)).

```json
{
  "id": "WO-251-D017",
  "date": "2026-11-02",
  "dispatch": "resume: verify",
  "decision": "Board the difference in skill names between the hook and the host rules as a follow-up. Both layers refuse the declared skill selections; alias, display-name and plugin-form invocations fall outside criterion 1's list.",
  "evidence": [
    "docs/verifications/WO-251/VER-001.md: hook probe of Skill selections inside and outside the declared list under an absent configuration, a configuration without features and a false election",
    "https://code.claude.com/docs/en/skills, Restrict Claude's skill access, read through Context7 on 2026-11-02: Skill(anthropic-skills:<name>) also blocks that skill when Claude Desktop delivers it as a plugin; Skill(skill:<name>) blocks the skill under any of its names, including its alias and display name",
    "https://code.claude.com/docs/en/permissions, Match by input parameter: a Skill(skill:<name>) deny rule matches the skill under any of its names",
    "packages/skeleton/src/harness-command.ts isDesktopControlTool compares input.skill exactly; packages/compiler/src/harness.ts desktopControlDenyRules emits Skill(<name>) and Skill(<name> *) only"
  ],
  "rejected": [
    {
      "option": "Fail criterion 1 on the alias spellings",
      "reason": "The criterion names four skill selections, and both layers refuse them. The other spellings are outside its declared list and their host resolution is unobserved, so they are a follow-up under product 07 §Verification review and attack."
    },
    {
      "option": "Record the gap only in the verification report",
      "reason": "A defect that verification meets and does not fix is recorded with a named follow-up."
    }
  ],
  "followup": "Make the hook and the host deny the same names for each listed desktop skill. Emit Skill(skill:<name>) beside the exact and argument rules. Have isDesktopControlTool classify every name the host documents for the same skill, so the refusal still names features.desktop-control and the Playwright route: the plugin form Claude Desktop uses for a synced anthropic-skills:<name> skill, and any alias or display name the host publishes. Add a hook fixture and a compiler deny assertion for each form, and keep unrelated skills unclassified. Surfaces: packages/compiler/src/harness.ts, packages/skeleton/src/harness-command.ts, scripts/test-harness.mjs and packages/compiler/test/harness.test.ts.",
  "reopenWhen": "A session journal records a listed desktop skill admitted under another name, the host changes its skill-name or permission-rule semantics, or a planning pass allocates this follow-up."
}
```

## WO-251-D018

<!-- integration refs/dotln/checkpoint/WO-251/6 -->

Final review integrated `main` at `1464dc1a` (WO-245, #264, tagged `v0.108.0`)
over the activation base `a6665a24`. The branch had no commit, so the helper
checkpointed, stashed the candidate, fast-forwarded and re-applied it. One
authored conflict: WO-245 rewrote `scripts/kit/README.client.md` from the kit
guide into a 553-byte front-page seed whose digest its `launchpad-docs` case
pins, and this order had added two paragraphs to the guide's §What runs here,
and what does not in the old file. The seed took main's bytes exactly and the
two paragraphs, unchanged in wording, now open that section of `docs/KIT.md`,
which the order's step 5 names as the guide's home once WO-245 merges. The
resolution moves documentation; no behavioral code, contract or authority
changed, so no claim returns through repair. Release preparation retimed the
target from `v0.108.0` to `v0.109.0` above the observed baseline, under D004's
reopening condition and the unchanged minor classification. WO-245 changed no
package version, so compiler 0.36.0, skeleton 0.77.0 and harness-host 0.41.0
stand, and every evidence edition reads current after the ordered format and
sync.

Carried-forward claims: criteria 1 to 4 and 6 carry on their original
evidence, since WO-245's merged scripts (the launchpad export, the starter
seeds, release preparation and the close) touch none of this order's surfaces;
criterion 5's kit-guide claim is re-derived against `docs/KIT.md`. The merged
scripts are code, so the integrated code identity, `c49898e9…`, differs from
the executor's passing row at `9d18a80d…`, and the final review ran the
complete review gate once at the integrated identity; the affected checks the
helper printed (`harness check`, `publication:check`, `check-surfaces --local`)
passed on the integrated tree, as did `git diff --check` and `format:check`.

```json
{
  "id": "WO-251-D018",
  "date": "2026-11-02",
  "dispatch": "resume: final review; worktree integrate WO-251",
  "decision": "Integrate main at 1464dc1a over the activation base a6665a24, keep WO-245's front-page seed byte for byte and move this order's two kit-guide paragraphs into docs/KIT.md, retime the release to v0.109.0, carry every verified claim forward on its evidence with criterion 5's guide claim re-derived, and run the complete review gate once at the integrated code identity.",
  "evidence": [
    "refs/dotln/checkpoint/WO-251/6 (preservation commit a1558634); base a6665a2449eaa3631e6e7f701b8fdeffc6c9a2f6; upstream 1464dc1a2a74118c3bd9a9cd280feae3dfda451e; no merge commit; stash 1930e1bc (WO-251 integrate 2026-11-02) dropped after application; intake backup in the session scratch",
    "git diff --stat a6665a24 main: 40 files, scripts/kit/README.client.md rewritten (+1 022 deletions) and docs/KIT.md added; scripts/test-launchpad-export.mjs pins the seed's SHA-256 0f96422ceaf8e572acb8ad3a1a52d431b248460e0c10d17116817be6d54766c3, which the resolved file prints",
    "docs/work-orders/WO-251-desktop-control-is-opt-in.md step 5: the kit guide is docs/KIT.md once WO-245 merges, otherwise scripts/kit/README.client.md",
    "release preparation: Retimed WO-251: v0.108.0 → v0.109.0 above the observed release baseline v0.108.0; git ls-remote --tags origin names v0.108.0 at 1464dc1a",
    "scripts/lib/gate-evidence.mjs gateCodeIdentity after integration, format and sync: c49898e9a7f9d7247023a2dae6e91f7e472353549de1b4ef0b4009a03f649628; the newest passing complete row before this review was at 9d18a80de7224e8f32d50f699c91e11ca63e1db0a1f34cef33c6c55d4781fa05",
    "node scripts/harness.mjs check: 42 generated surfaces, exit 0; npm run publication:check: 256/256 headings, both editions current; npm run release -- check-surfaces --local: 57 PASS lines, exit 0; git diff --check and npm run format:check clean; npm run sync: every artifact current",
    "npm test -- --review at c49898e9…: started 2026-11-02T13:47:52.130Z and recorded 2026-11-02T14:25:20.476Z, selection review, 43 required suites, 113 fresh tasks, none reused, unrun or stale, exit 0, 2,248,346 ms (0 h 37 min), tree bb9a49b7, identity and build output unchanged across the run, shared refs unchanged (main and origin/main at 1464dc1a, newest tag v0.108.0); cleanup removed 2,348 owned roots with one retained and no blocker"
  ],
  "rejected": [
    {
      "option": "Keep the order's paragraphs in scripts/kit/README.client.md beside the seed",
      "reason": "The seed is pinned by digest and seeds an instance's front page, not the guide; the paragraphs belong to the guide, which WO-245 moved to docs/KIT.md."
    },
    {
      "option": "Reuse the executor's complete row at 9d18a80d…",
      "reason": "The integrated identity differs because WO-245's merged scripts are code; the row's identity, not the dispatch time, says what was tested."
    },
    {
      "option": "Rewrite reviewed commits or drop a stash before application completes",
      "reason": "Both histories and unfinished recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification. A later collision on v0.109.0 is recorded as its own decision."
}
```

Integration date: 2026-11-02. Original base: `a6665a2449eaa3631e6e7f701b8fdeffc6c9a2f6`.
Fetched main: `1464dc1a2a74118c3bd9a9cd280feae3dfda451e`. Checkpoint: `refs/dotln/checkpoint/WO-251/6`.
Named stash dropped after completed application: `1930e1bcf12dd65bc37bc8995357c97c5eb9d804` (WO-251 integrate 2026-11-02).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-251: v0.108.0 → v0.109.0 above the observed release baseline v0.108.0. Files changed: docs/work-orders/WO-251-desktop-control-is-opt-in.md, README.md, docs/evidence/WO-251/meta.json. Meter snapshot: docs/evidence/WO-251/meta.json, 4879 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 4 and 6 on their original evidence with the complete row re-established at the integrated identity; criterion 5 re-derived against `docs/KIT.md`.
Authored conflicts observed: scripts/kit/README.client.md, resolved as recorded above.
Affected checks: run on the integrated tree and passing, as the evidence lists.

## WO-251-D019

```json
{
  "id": "WO-251-D019",
  "date": "2026-11-02",
  "dispatch": "resume: final review",
  "rows": [
    "FUP-957602bc42e32e1d",
    "FUP-e08668268dea62b1",
    "FUP-eed385be08e5bdd9"
  ],
  "decision": "Re-defer the three register rows whose conditions this order met, with the figures refreshed at the reviewed tree, leave the other sixteen matched rows as they are, list no finding, write no source, and leave VER-001's skill-name follow-up boarded in D017. FUP-957602bc42e32e1d (WO-217-D053) and FUP-e08668268dea62b1 (WO-219-D009): their condition occurred, because the shared browser-verification sentence and the derived refusal row grew every installed role root by 909 bytes: the executor reads 39,309 against the nominal 29,246 and within the accepted 40,194; the verifier 34,142 against 29,831 and within 35,221; the reviewer 36,912 against 28,884 and within 39,600; release-close 24,414 against 21,266 and within 26,410; the planner 25,222 against 24,576, a breach of 646 that D007 boards as FUP-ac86ee429dee2947; the router 16,327 within 16,384; the refuter 24,036 with no ceiling. No ceiling moved, no duty was cut, and the optimization stays with the next planning pass that evaluates instruction-byte optimization. FUP-eed385be08e5bdd9 (WO-226-D022): its condition occurred, because this order touches scripts/test-gate-followups.mjs, where D011 replaced the current-role headroom assertion with the breach-to-follow-up rule, and re-mints the role oracle as packages/skeleton/fixtures/wo251-role-baseline.json over wo247; the test keeps its chain walk, its effective-ceiling and acceptance checks and the historical 256-byte inequality on the earliest chained baseline, and whether that inequality still carries meaning is not decided here, because the final review changes no test. FUP-770baf2f452c669e (the planner root's entropy selector) is left as it is: the shared sentence changed the planner root, but the row's seam is the planner's own entropy sentence in contributor.ts, which this order did not edit, and carrying it would be a source change the reviewer would then certify, against a planner root already in breach. The other matched rows name a path or this order in their text only; FINAL-001's register table records each reading.",
  "evidence": [
    "docs/evidence/WO-251/role-context.json after: the installed measurements per role, both skills roots identical; packages/skeleton/fixtures/wo251-role-baseline.json startupCost: beforeBytes to bytes per role, decision WO-251-D007, planner followup FUP-ac86ee429dee2947",
    "scripts/test-gate-followups.mjs: the chain opens with wo251-role-baseline.json; the breach branch requires a recorded optimization follow-up with a current disposition linked to the growth decision; line 295 still asserts the 256-byte inequality on the earliest chained baseline",
    "npm run plan -- followups --touching at this review: register revision 970ff2b5…, 237 pending rows, 19 matched over three pages; the dispositions of WO-247-D016 on the same three rows are the precedent this review follows",
    "docs/verifications/WO-251/VER-001.md and D017: the skill-name gap is a follow-up outside criterion 1's declared list; its repair changes the hook's classification and the emitted deny rules"
  ],
  "rejected": [
    {
      "option": "Repairing the skill-name gap in this review",
      "reason": "A behavioral change to the hook and the emitted rules that the reviewer would then certify; it moves the code identity and owes another complete run, and the register already carries the repair rule."
    },
    {
      "option": "Carrying the planner's entropy selector inside this review",
      "reason": "A source change the final reviewer would then certify; the row's condition names an order whose scope edits the planner's sentence."
    },
    {
      "option": "Leaving the three rows as matched",
      "reason": "Their reopening conditions name exactly what this order did, and every earlier order that grew the roots or touched the suite re-disposed them with its figures."
    }
  ],
  "reopenWhen": "The next planning pass evaluates instruction-byte optimization, another reviewed rule changes the measured roots, or the next order touches scripts/test-gate-followups.mjs or re-mints the role oracle."
}
```
