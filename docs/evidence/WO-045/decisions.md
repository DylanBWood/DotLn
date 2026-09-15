# WO-045 decisions

## WO-045-D005

Immutable evidence revisions during repair (2026-09-15)

```json
{
  "id": "WO-045-D005",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Allow numbered artifact-identity and verification editions within the same work order, using the existing revision selector and immutable writer.",
  "evidence": [
    "packages/skeleton/src/evidence-editions.mjs",
    "scripts/artifact-identity-evidence.mjs",
    "scripts/verification-evidence.mjs",
    "docs/verifications/WO-045/VER-001.md"
  ],
  "rejected": [
    {
      "option": "Overwrite original evidence",
      "reason": "Would erase the subject observed by VER-001 and violate immutable evidence."
    },
    {
      "option": "Invent another work-order identity",
      "reason": "The evidence belongs to this repair; an unrelated identity would misstate provenance."
    },
    {
      "option": "NoOp",
      "reason": "The current selector has no same-order destination for refreshed compiler-dependent evidence."
    }
  ],
  "reopenWhen": "A consuming tool assumes only unnumbered paths or evidence revision selection permits replacement of historical bytes."
}
```

Adjacent item 0001 repairs the missing same-order revision destination. The
existing artifact and verification checks now reproduce stale evidence after
integration; original editions remain immutable. Keep only the selector change
and its regression test. The optional generator CLI extensions were removed.
The operator corrections, including the unauthorized instruction-file edit
and its removal, are recorded in `repair.md`. Routine version history is kept
out of product design documents.

## WO-045-D004

Repair the published sibling collision (2026-09-15)

```json
{
  "id": "WO-045-D004",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Integrate published v0.19.0, retime WO-045 to v0.20.0 under its existing minor classification, and advance the compiler patch to 0.11.1.",
  "evidence": [
    "docs/verifications/WO-045/VER-001.md",
    "docs/product/07-execution-guide.md",
    "docs/product/10-ir-compatibility.md"
  ],
  "rejected": [
    {
      "option": "NoOp or retain v0.19.0 / compiler 0.10.1",
      "reason": "The tag is already published and integration would downgrade the compiler."
    },
    {
      "option": "Reimplement the accepted decoders",
      "reason": "VER-001 found their required behavior correct; F1 concerns integration and release evidence."
    }
  ],
  "reopenWhen": "Integration exposes a behavioral conflict, acceptance regression, or another published release consumes the selected version."
}
```

Routine integration supersedes D003's staged versions: application v0.20.0,
compiler 0.11.1, kernel 0.3.0 and skeleton 0.17.0. AC4 compares against the
integrated v0.19.0 base; original observations and VER-001 remain historical.
Current work was preserved in checkpoint 5 and a retained named stash before
fast-forwarding to the published sibling release. No WO-045 branch commit was
created. Product 07 already permits this SOP; the collision alone was not a
behavioral defect or a reason for an extra approval cycle. The operator's
correction removes the unnecessary product-10 migration paragraph.

## WO-045-D001

Positive boundary decoding (2026-09-15)

```json
{
  "id": "WO-045-D001",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Implement positive schema-1 event and declared hook-field decoders, keeping JSON payload semantics and historical framing.",
  "evidence": [
    "packages/kernel/src/store.ts",
    "packages/skeleton/src/harness-host.ts",
    "docs/product/02-domain-model.md"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves malformed input to downstream casts and failures."
    },
    {
      "option": "Schema library",
      "reason": "Adds a runtime dependency against ADR-0002."
    },
    {
      "option": "Validate payload semantics",
      "reason": "Those belong to reactors."
    }
  ],
  "reopenWhen": "Valid persisted streams or native hook metadata regress, or measured decoder cost is material."
}
```

Dispatch: operator `resume: next`; executor implementation, with read-only advisory workers. Sources: WO-045; product 02 Events and decisions / Memory and observation; product 10 Separate version axes / Invariants; ADR-0002 Amendments; current store, host and existing acceptance fixtures.

The mission contribution is to keep malformed persisted state from reaching replay/folds, and malformed supplied hook input from reaching ordinary host effects. This supports the always-on runtime critical path with a single boundary check. The observed store only checked object/framing before casting. The host likewise cast parsed input. NoOp leaves those gaps and downstream untyped errors, so a small handwritten decoder wins over a new schema dependency or dispersed consumer checks.

Preserve schema 1, `evt_<n>` append assignment, all JSON payload values (including scalars, null and arrays), optional string IDs, CRLF framing, and existing error-message prefixes. Traverse payloads iteratively to reject numeric overflow without stack exhaustion. Payload interpretation stays with reactors. The throwing API delegates to a typed nonthrowing result; append uses the same existing-log validation. No historical log is rewritten. A read-only inventory found 62 committed EventEnvelope streams / 3,857 events already conforming; executable compatibility checks will validate this count and distinguish other JSONL protocols.

System traps: policy resistance/fixes that fail is addressed by retaining schema and protocol meanings; drift to low performance by explicit malformed-path and unchanged-history assertions; rule beating by executing public APIs and generated hooks before checking state effects. Commons and escalation costs are bounded by two decoders and shared tests, without a new dependency/process. Success to the successful is addressed by comparing a library and per-consumer validation on their compatibility and maintenance cost. Shifting the burden is reduced by early actionable paths instead of operator diagnosis. Seeking the wrong goal is checked against preventing downstream evaluation, not maximizing validation rules. Naive Interventionism: valid replay and recovery are useful existing functions; stricter rejection affects callers with malformed logs. Small corpus probes precede the full gate, the change is reversible, and no automatic repair/migration is introduced.

Reopen if committed event logs fail, native valid hook metadata is rejected, measured decoding costs become material, or a consumer needs payload semantics at this boundary. Unknown hook metadata remains available for host protocol evolution; declared fields are validated. The work-order phrase grouping tool_name with objects is read against the existing HarnessInput contract: tool_name is a string, tool_input/tool_response are objects.

## WO-045-D002

Generated hook entry conflict (2026-09-15; operator-authorized scope expansion)

```json
{
  "id": "WO-045-D002",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Apply the operator-authorized generated-entry fix and amend AC4 while preserving valid recovery before runtime imports.",
  "evidence": [
    "packages/compiler/src/harness.ts",
    "packages/compiler/src/operator-control.mjs",
    "docs/work-orders/WO-045-store-and-hook-input-decoders.md"
  ],
  "rejected": [
    {
      "option": "Runtime-only decoding",
      "reason": "The generated prelude can bypass it for malformed session/prompt or raw JSON."
    },
    {
      "option": "Load runtime before recovery",
      "reason": "Would make recovery depend on repository/runtime health."
    }
  ],
  "reopenWhen": "Valid analysis/override becomes unreachable or malformed ordinary input reaches host state."
}
```

The current compiler-generated entry parses stdin and executes the independent recovery prelude before loading runHarnessHook. That prelude can handle or fail on malformed input before the decoder, while AC4 permits only runtime hashes and manifest changes. The operator was offered a bounded entry repair with AC4 amended, or retention with an explicit limitation. Kernel work continued independently while compiler entry edits waited for direction; the operator then authorized the bounded repair below. Recovery controls must remain reachable when repository/runtime health is broken.

## Execution cost

Entry measurement at 2026-09-15T18:32:21.882Z: total tokens unknown, source unavailable, scope dispatch. No command/token savings are claimed. Final measurements stay in ignored usage receipts and the handoff.

The operator explicitly chose “Allow the bounded entry fix and update AC4.” The generated prelude now screens only the fields needed for recovery, preserves valid recovery before runtime imports, and passes the original text into the host for typed JSON/input validation. This adds a compiler implementation patch and runtime pins, with no compiler contract/hash-preimage change. Wrong-typed prompts and malformed ordinary input reach the decoder; explicit recovery prompts without usable session identity retain stateless recovery. Valid recovery remains independent of runtime health. NoOp was rejected because it would leave observed bypasses at the boundary. Existing recovery and native pipe tests plus malformed generated hooks are the smallest useful probes. Reopen if recovery becomes unavailable or valid host payloads regress.

## WO-045-D003

Local release and write-backs (2026-09-15)

```json
{
  "id": "WO-045-D003",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Stage v0.19.0 with kernel 0.3.0, skeleton 0.17.0 and compiler 0.10.1; retain L2 capability and immutable historical evidence.",
  "evidence": [
    "package-lock.json",
    "docs/product/06-roadmap.md",
    "docs/planning/capability-table.md"
  ],
  "rejected": [
    {
      "option": "Patch application",
      "reason": "The new strict codec and host decoder match the selected minor classification."
    },
    {
      "option": "Raise store capability level",
      "reason": "No durable adapter or real-worker recovery proof is added."
    }
  ],
  "reopenWhen": "Independent review identifies different compatibility impact or a preserved evidence edition fails current checks."
}
```

Local tag observation: latest v0.18.0. Stage application v0.19.0 under the selected minor classification; kernel 0.3.0 (stricter public decode behavior), skeleton 0.17.0 (new host decoder), compiler 0.10.1 (bounded entry repair). Console is unchanged. No new dependency, event schema, compiler contract or hash-preimage change. The activation left the heading unassigned; fill the target and README before the canonical local release preparation. Historical evidence remains immutable and replacement editions are selected only after generation/checks. Publication is left to later authorized roles.

The capability remains L2 / E0: schema validation improves the existing pure store boundary, but does not prove a durable adapter/real-worker recovery. No level increase is claimed. The pre-2026-09-09 order's ledger duty is discharged here and by the generated decisions index, per executor skill; no ideation ledger duplication. No product headings change, so publication anchors remain stable.

Same-day correction: the initial decision write-back used prose only; the existing index requires JSON decision records. Added the documented records above, preserving the rationale. Release preparation failed before completing its process-meter projection; rerunning it follows the idempotent local preparation path, not a lifecycle transition.

### Boundary review outcome

Read-only review found and executor repaired inherited/accessor supplied-object fields, the generated-entry fixture parser, and stateless recovery without session identity. Supplied hook objects must be plain records; declared properties are data fields, with typed failure for unreadable properties. Explicit undefined is not absence at this JSON boundary. Native JSON metadata stays forward-compatible. Recovery prompts with no usable session are passed to the existing stateless recovery path; no recovery state or lifecycle record is invented. Focused generated-pipe and recovery fixtures passed after those changes.

Artifact, verification and authority checks identified stale current editions after the compiler package/pin change. Create WO-045 replacements and select them; do not rewrite earlier evidence. The required live feedback audit covers its explicitly declared feedback source projection, while the new decoder and generated-entry behavior are established by their own executable tests. A live feedback audit is not claimed as a live native hook invocation.

### Handoff outcome

The promised boundary benefit is established by the 22-case malformed envelope corpus, generated ordinary-hook refusals without host-state effects, unchanged historical stream round trips, and retained recovery behavior. Full harness fixtures passed 26 tests; `npm test` passed 19 suites / 62 fresh tasks with zero failures. The fresh live feedback verifier completed and its accepted matrix is recorded. No new code correction was required after the final gate. The capability remains L2; no end-to-end durable recovery or total-cost saving is inferred.

Final read-through corrected the decision heading anchors used by the generated index and clarified stateless recovery for an unusable session ID. These are report corrections only. All queued adjacent work is absent at revision 0. Independent work-order verification and final review remain the next separate dispatches.
