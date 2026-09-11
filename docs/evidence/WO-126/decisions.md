# WO-126 decisions

Entries name the dispatch that supplied authority and the evidence for the
choice. Reopening appends a new entry; it preserves the original reasoning.

## WO-126-D001

```json
{
  "id": "WO-126-D001",
  "date": "2026-09-09",
  "dispatch": "Operator answers during resume: next for WO-126 on 2026-09-09: leave token, dollar and PR-body ceilings unset and collect token usage before caps.",
  "decision": "Record observed usage and its source; keep those ceilings null until the operator selects values supported by observations.",
  "evidence": [
    "docs/evidence/WO-126/ideation.md",
    "docs/work-orders/WO-126-process-debt.md#execution-record"
  ],
  "rejected": [
    {
      "option": "Invent initial numeric limits",
      "reason": "No measured basis or operator-selected values; explicitly declined by the operator."
    }
  ],
  "reopenWhen": "Usage observations support a proposed limit and the operator selects it.",
  "kind": "decision"
}
```

## WO-126-D002

```json
{
  "id": "WO-126-D002",
  "date": "2026-09-09",
  "dispatch": "Operator's resume: next for WO-126 and explicit same-session authorization of the exact floor replacement on 2026-09-09.",
  "decision": "The floor preserves decisions with sources and reopening conditions. Evidence or operator steering may reopen a decision through a new sourced record.",
  "evidence": ["docs/work-orders/WO-126-process-debt.md", "CLAUDE.md"],
  "rejected": [
    {
      "option": "Treat every prior scope exclusion as an immutable product decision",
      "reason": "The no-telemetry prohibition was traced to an older work order's non-goal, without operator authority."
    }
  ],
  "reopenWhen": "New evidence or operator direction changes the decision-record contract.",
  "kind": "decision"
}
```

## WO-126-D003

```json
{
  "id": "WO-126-D003",
  "date": "2026-09-09",
  "dispatch": "Operator steering during resume: next for WO-126 on 2026-09-09: absent Intent to Act and Follow-up Queue behavior is a workflow defect. The operator confirmed the proposed activation diagnosis was correct, identified the interpretation of deliberate chat intent as a separate meta failure, required durable behavior across sessions and compaction, and permitted deferring this broader repair because WO-126 is already large.",
  "kind": "correction",
  "misread": "The first response reduced absent equipped behavior to communication discipline; a later response incorrectly treated the accepted activation diagnosis itself as another misunderstanding.",
  "meant": "The first workflow diagnosis and proposed repair were correct. Recognizing the purpose of operator chat is a separate issue that need not be solved in WO-126. Aggregated prompt fragments may recreate the rule and context burden DotLn exists to remove. Any eventual fix must be durable.",
  "changed": "Preserved the diagnosed item and exploratory projection, deferred the queue item with operator-sourced scope, and removed the unvalidated additions to support prose and dispatch. Checked the existing migration orders and recorded the remaining behavioral gap for planning. No semantic-operation claim is made from equipped instructions or emitted text.",
  "decision": "Continue the original WO-126 deliverable; leave the broader support-behavior and deliberate-chat-intent repair for planning against observed operation and context reduction.",
  "evidence": [
    "packages/skeleton/src/loadouts/executor-supports.ts",
    "docs/work-orders/WO-096-migration-ledger.md",
    "docs/work-orders/WO-097-rule-migration-batch-1a.md",
    "docs/work-orders/WO-098-rule-migration-batch-1b.md"
  ],
  "rejected": [
    {
      "option": "Only promise session-local compliance",
      "reason": "The requested process must survive new sessions and compaction."
    },
    {
      "option": "Add more support prose and call the behavior fixed",
      "reason": "The operator identified that as a recurrence of the original context burden."
    }
  ],
  "reopenWhen": "The next operator-opened planning pass compares the existing rule-migration coverage with this observed support failure and chooses a durable executable or bounded-context remedy."
}
```

## WO-126-D004

```json
{
  "id": "WO-126-D004",
  "date": "2026-09-09",
  "dispatch": "Operator resume: next for WO-126, criteria 10, 13 and 16: historical evidence is preserved, every order gains a cost header, and documentation write-back must not require a new live evidence edition.",
  "kind": "decision",
  "decision": "Preserve historical receipt inputs and live harness evidence at their committed versions. Permit only the exact legacy-unavailable Cost header as the one-time WO-126 contract adoption; any substantive authority change still needs refutation. Validate current harness behavior with executable fixtures and generate a fresh feedback edition for changed runtime source.",
  "evidence": [
    "scripts/lib/legacy-cost.mjs",
    "scripts/lib/plan-continuation.mjs",
    "scripts/harness-evidence.mjs"
  ],
  "rejected": [
    {
      "option": "Invent historical cost measurements or rewrite past receipts",
      "reason": "No observed data supports those claims."
    },
    {
      "option": "Treat any new header as an accepted authority change",
      "reason": "It would allow a changed plan to bypass refutation."
    }
  ],
  "reopenWhen": "The migration admits any change beyond the exact unavailable declaration and the independently allowed lifecycle appendix, or current behavior depends on an untested historical claim."
}
```

## WO-126-D005

```json
{
  "id": "WO-126-D005",
  "date": "2026-09-09",
  "dispatch": "Operator resume: next for WO-126, and same-session direction to use judgment on a sufficient bounded solution while documenting proposed later work.",
  "kind": "decision",
  "decision": "Finish the specified file-level authored-output contract and record its remaining migration cost. Nominate change-range review with an exact unchanged-byte proof for a later planning comparison; do not silently classify hand-written work orders as generated artifacts.",
  "evidence": [
    "docs/evidence/WO-126/README.md#measured-scope-and-limits",
    "scripts/lib/legacy-cost.mjs",
    "packages/skeleton/src/harness-host.ts"
  ],
  "rejected": [
    {
      "option": "Exempt the entire legacy work-order files as generated output",
      "reason": "Only their cost headers were generated; the files remain hand-written authorities whose future substantive edits require review."
    },
    {
      "option": "Add general change-range provenance and review in this order",
      "reason": "It changes the explicitly selected file-level witness contract and needs its own stale-byte and coverage evidence. The current observation proves the residual cost, not the replacement's adequacy."
    }
  ],
  "reopenWhen": "The next operator-opened planning pass can compare context bytes, commands and wall-clock for exact change-range coverage against whole-file delivery while preserving current-source and substantive-edit refusal."
}
```

## WO-126-D006

```json
{
  "id": "WO-126-D006",
  "date": "2026-09-09",
  "dispatch": "During WO-126 the operator explicitly expanded its scope to close critical gaps in surfacing future work, emphasizing that scattered suggestions must not disappear. Subsequent steering permits later work on excessive planner context and notes that the new feed may already resolve some of it.",
  "kind": "decision",
  "decision": "Retain formal public candidates and decisions in one register, surface bounded pages at planning entry, retain explicit sourced dispositions and require local deferrals to link to a public item. Measure the feed and preserve only the remaining planner-startup context problem for later assessment.",
  "evidence": [
    "scripts/lib/planning-followups.mjs",
    "scripts/test-process-debt.mjs",
    "docs/product/07-execution-guide.md#retained-planning-follow-ups",
    "docs/product/07-execution-guide.md#candidate--planner-startup-context"
  ],
  "rejected": [
    {
      "option": "Only add another link or promise that future sessions will search the repository",
      "reason": "The observed gap is between stored records and planning entry; another prose suggestion leaves that gap intact."
    },
    {
      "option": "Infer allocation, rejection or duplication from all existing candidate prose",
      "reason": "Historical lists contain partial allocations and overlapping sources. Untriaged records preserve that uncertainty until a sourced disposition resolves it."
    },
    {
      "option": "Require the planner to preload every source document or resolve every pending item on each pass",
      "reason": "That would add to the operator's observed context burden. Bounded navigation and retained unresolved state allow scoped choices."
    }
  ],
  "reopenWhen": "A formal follow-up is omitted, history can be erased, a local deferral lacks a durable public handoff, or measured planning entry still needs broad source loading."
}
```

## WO-126-D007

```json
{
  "id": "WO-126-D007",
  "date": "2026-09-09",
  "dispatch": "During resume: fix for WO-126, the operator selected the Node-only approach after an explanation of the differing guarantees, then explicitly requested statistics for reconsideration if Python is needed or already a dependency in future.",
  "kind": "decision",
  "decision": "Compile to staging, atomically replace each complete dist file using Node, and complete the build barrier before dependent commands. Installed hooks retain an immutable pinned snapshot. Amend criterion 6's directory exchange requirement to this boundary and retain criterion 18's no-new-dependency requirement. Preserve five paired publication samples and an optional historical Python comparator.",
  "evidence": [
    "docs/evidence/WO-126/build-comparison.json",
    "docs/evidence/WO-126/repair-001.md",
    "docs/work-orders/WO-126-process-debt.md#execution-record",
    "scripts/benchmark-build-publication.mjs",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Keep Python/libc directory exchange as a build prerequisite",
      "reason": "The operator chose the existing Node toolchain. On the observed host publication medians were 28.24 ms for Node files and 346.46 ms for four Python processes; these do not measure whole-build time or identical guarantees."
    },
    {
      "option": "Claim whole-directory atomicity for per-file replacement",
      "reason": "Ordinary dist can contain mixed generations until the barrier completes; only pinned immutable hook snapshots remain a stable complete view throughout."
    }
  ],
  "reopenWhen": "A consumer must read ordinary dist concurrently with publication as one consistent directory, Python becomes an accepted dependency, or measurements on relevant hosts materially change the tradeoff."
}
```

## WO-126-D008

```json
{
  "id": "WO-126-D008",
  "date": "2026-09-09",
  "dispatch": "Operator resume: fix for VER-001 findings F6, F8 and F9; preserve original evidence and account for the actual recurring machinery cost.",
  "kind": "correction",
  "misread": "The original cost estimate omitted twice-per-tool authorship snapshots; the evidence cache retained successful stdout indefinitely in its hot file; every generated output implicitly needed the whole full gate even for a failing verdict.",
  "meant": "Account for observer work, preserve decision-useful timings with a bounded hot lookup, and validate generated outputs through their declared generator while retaining full evidence for successful code handoffs.",
  "changed": "Record snapshot duration, bytes, files and subprocesses in the existing journal and meter, append the missing execution cost, cap hot metadata at 256 rows with tree-addressed history, omit successful stdout and retain separate failing logs, and accept declared generated-output checks at the exact current tree.",
  "decision": "Retain the file-level authorship witness, historical timing evidence and exact-tree full gate for successful handoffs; remove incidental stdout and redundant generated-output full-gate requirements.",
  "evidence": [
    "docs/verifications/WO-126/VER-001.md",
    "docs/product/02-domain-model.md#feedback-compiler-v1",
    "docs/work-orders/WO-126-process-debt.md#execution-record",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Prune all historical timings to bound total disk use",
      "reason": "Historical observations inform process decisions and exact-tree reuse; a bounded hot index with archived metadata removes lookup cost without erasing that evidence."
    },
    {
      "option": "Skip output validation on a failing verification",
      "reason": "The generated index still needs its own current-tree validation even when application code is correctly reported failing."
    }
  ],
  "reopenWhen": "Measured observer overhead warrants a cheaper equally reliable witness, archived metadata itself becomes costly, or a declared generator fails to validate its artifact."
}
```

## WO-126-D009

```json
{
  "id": "WO-126-D009",
  "date": "2026-09-09",
  "dispatch": "After the executor explained the measured gate bottlenecks and four efficiency improvements, the operator explicitly authorized full scope expansion to implement those improvements within WO-126 repair.",
  "kind": "decision",
  "decision": "Use reviewed suite-input evidence reuse, bounded scheduling of 40 independent release cases, sealed fixture setup with independent writable copies and retained real npm boundary coverage, and named live progress. Keep the exact-tree handoff aggregate, original execution provenance and explicit fresh/reused distinction. The 37-suite full gate passed at 278.991 seconds cold and 114.977 seconds warm against the 522.052-second baseline; fast cold passed at 70.332 seconds under the unchanged 120-second budget. These single-host combined-change observations do not isolate individual causes.",
  "evidence": [
    "docs/evidence/WO-126/optimization-baseline.json",
    "docs/evidence/WO-126/optimization.md",
    "docs/evidence/WO-126/optimization-results.json",
    "docs/work-orders/WO-126-process-debt.md#execution-record",
    "scripts/test-runner.mjs",
    "scripts/test-release.sh"
  ],
  "rejected": [
    {
      "option": "Treat every Markdown change as irrelevant to code checks",
      "reason": "Some documents are generator inputs and lifecycle contracts; reuse needs each suite's actual declared inputs, with conservative handling of unsupported scopes."
    },
    {
      "option": "Raise the fast-gate limit or increase all test concurrency indiscriminately",
      "reason": "The 120-second budget stands, and nested process contention has already increased elapsed time; divide independent work under one bounded scheduler."
    },
    {
      "option": "Reuse mutable fixture repositories across independent cases",
      "reason": "Shared mutation would undermine isolation; reusable setup must produce independent writable fixtures."
    }
  ],
  "reopenWhen": "An invalidation counterexample, lost consequential case, fixture interference or measured fingerprint/maintenance overhead outweighs the saved validation time."
}
```

## WO-126-D010

```json
{
  "id": "WO-126-D010",
  "date": "2026-09-10",
  "dispatch": "The original resume: fix fast-gate obligation and the operator's explicit four-part efficiency expansion remain active; the required final harness check exposed a different invocation environment before repair-complete.",
  "kind": "correction",
  "misread": "The direct Node cold and warm observations were treated as sufficient timing proof for the npm gate and compared with an npm baseline without checking invocation equivalence.",
  "meant": "Preserve those executed observations with their actual commands, measure through the canonical npm entry points, and require the harness wrapper to pass separately under the unchanged limits.",
  "changed": "Retain the 150010 ms wrapper timeout and controlled nested-npm lookup probe; remove exact duplicate PATH entries only in gate children while preserving first-match order and all unique entries; add an executable resolution regression and canonical npm measurements.",
  "decision": "Use first-occurrence PATH deduplication in the observed gate child environment. The controlled lookup median fell from 60.73 ms to 39.76 ms and returned to 60.47 ms when the inherited value was restored. This probe supports the bounded change but is not itself a passing gate result.",
  "evidence": [
    "docs/evidence/WO-126/invocation-probe.json",
    "docs/evidence/WO-126/optimization.md#invocation-correction",
    "scripts/lib/suite-evidence.mjs",
    "scripts/test-suite-evidence.mjs",
    "docs/product/07-execution-guide.md#discipline"
  ],
  "rejected": [
    {
      "option": "Use the direct runner success to ignore the npm wrapper timeout",
      "reason": "It would leave the original required entry point unproven and conceal an invocation confound in the comparison."
    },
    {
      "option": "Remove currently nonexistent PATH directories or reorder tool directories",
      "reason": "Those changes can alter later executable discovery or which tool is selected; exact deduplication preserves every unique entry and its precedence."
    },
    {
      "option": "Rewrite every runtime Git call to use a cached absolute executable",
      "reason": "The probe shows potential savings, but that broader runtime change is unnecessary if the bounded child-environment correction meets the existing gate obligation. It would need its own dynamic resolution and compatibility evidence."
    }
  ],
  "reopenWhen": "An executable-resolution counterexample appears, canonical npm or harness cold execution still exceeds its limit, or further measured lookup cost justifies a separately reviewed runtime change."
}
```

## WO-126-D011

```json
{
  "id": "WO-126-D011",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-002; findings F10, F11 and F12 continue WO-126 criterion 8 and its existing permissions envelope.",
  "kind": "decision",
  "decision": "Normalize supported command wrappers and command groups before matching effects, retain quoting and expansion provenance, and use those same parsed invocations to extract commit messages. Unknown wrappers with a denied invocation and dynamic effect operands refuse with a classification reason. Literal examples remain data.",
  "evidence": [
    "docs/verifications/WO-126/VER-002.md",
    "packages/skeleton/src/harness-command.ts",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-002.md"
  ],
  "rejected": [
    {
      "option": "Restore whole-command substring matching",
      "reason": "It would restore the observed false refusals for quoted examples and searches."
    },
    {
      "option": "Assume an unreadable wrapper or dynamic subcommand has only local shell effects",
      "reason": "VER-002 demonstrates denied effects hidden behind that assumption."
    }
  ],
  "reopenWhen": "A supported shell form hides an effect, a data-only invocation is incorrectly refused, or a needed unsupported form warrants its own explicit adapter."
}
```

## WO-126-D012

```json
{
  "id": "WO-126-D012",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-002 F13, F15 and F16, under the previously authorized gate-efficiency expansion and unchanged 120-second fast-gate limit.",
  "kind": "decision",
  "decision": "Run hook-heavy fixtures exclusively within the shared scheduler and allow the independent console suite to overlap skeleton. Project the same reviewed inherited environment into execution and input fingerprints, omitting proxy variables and undeclared invocation metadata. Record selected variable names and hook process timings without values, extra hook subprocesses or per-hook session-file reads.",
  "evidence": [
    "docs/verifications/WO-126/VER-002.md",
    "scripts/test-runner.test.mjs",
    "scripts/test-suite-evidence.mjs",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-002.md"
  ],
  "rejected": [
    {
      "option": "Omit variables from the hash while still forwarding them to the tests",
      "reason": "Tests could observe a changed unrecorded input and reuse an unsound success."
    },
    {
      "option": "Increase fixture timeouts or the fast-gate budget",
      "reason": "The failure is resource contention and the operator's budget remains in force; isolation addresses the demonstrated cause."
    },
    {
      "option": "Serialize every suite",
      "reason": "Independent console and code fixtures own separate temporary roots; retaining bounded overlap avoids unnecessary wall-clock cost."
    }
  ],
  "reopenWhen": "Cold execution loses its budget margin, hook latency remains unreliable, a suite needs an omitted environment variable, or measured isolation and observation costs outweigh their benefit."
}
```

## WO-126-D013

```json
{
  "id": "WO-126-D013",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-002 F14; preserve criterion 2's distinction between the running harness and an installed PATH binary.",
  "kind": "decision",
  "decision": "When explicit input and running-executable environment channels are absent, inspect the hook's ancestor process chain. Use a matching versioned Claude executable's version, or probe a matching absolute unversioned executable. Fall back to PATH only without those observations, and persist only the version and channel.",
  "evidence": [
    "docs/verifications/WO-126/VER-002.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Assume the Bash tool's environment is also present in the hook",
      "reason": "The verifier observed that the installed hook lacked the exposed running-executable variable."
    },
    {
      "option": "Record process paths or arguments in public evidence",
      "reason": "The version and observation channel suffice; local process details add no required evidence."
    }
  ],
  "reopenWhen": "The harness changes its executable layout, the process table is unavailable on a required host, or the observed parent source no longer identifies the running version."
}
```

## WO-126-D014

```json
{
  "id": "WO-126-D014",
  "date": "2026-09-10",
  "dispatch": "Operator correction during resume: verify for WO-126 on 2026-09-10, after the verifier wrote VER-003, ran the composed gate, edited the report twice and re-ran the evidence gate, then re-read the whole report for its receipt.",
  "kind": "correction",
  "misread": "The verifier treated the report as editable after its measurements and the evidence gate as repeatable, so one factual correction and one cosmetic line wrap each cost another gate run and another whole-file receipt read.",
  "meant": "Write the report once, after every measurement it cites is in hand and every claim in it has been checked; run the evidence gate once, at the final tree; never edit for cosmetics after the gate; and a document-only edit must not cost a code gate.",
  "changed": "Stopped editing; recorded the rule in 07 §Discipline as 'Write once, run once'; kept an incidental observation in the handoff message instead of another report cycle; and named the mechanism half for the executor: the harness wrapper's fast gate re-executed all twelve suites fresh at a document-only tree change (103.54 s) while the composed full gate reused 46 tasks at the same kind of change.",
  "decision": "A role writes its report or receipt once and runs the evidence gate once; an unchecked claim and a cosmetic edit are not written.",
  "evidence": [
    "docs/verifications/WO-126/VER-003.md",
    "docs/control/orders/WO-126.jsonl",
    "docs/product/07-execution-guide.md#discipline"
  ],
  "rejected": [
    {
      "option": "Re-run the evidence gate after each report edit",
      "reason": "It is the loop the operator corrected: minutes of code gates paid for bytes of prose."
    },
    {
      "option": "Skip the receipt read or the evidence run after an edit",
      "reason": "Both contracts bind the final bytes; skipping them records a claim without its witness."
    }
  ],
  "reopenWhen": "A reviewed mechanism makes a document-only edit free of code gates at every entry point, the wrapper's fast gate included, or an operator dispatch changes the evidence contract."
}
```

## WO-126-D015

```json
{
  "id": "WO-126-D015",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-003 F17 and F18, within criterion 8 and the existing permissions envelope.",
  "kind": "decision",
  "decision": "Retain pipeline inputs and distinguish interpreter programs from data arguments. An opaque interpreter route containing a literal denied invocation requires an explicit adapter. Refuse inline Git alias configuration; classify send-pack, mutating GitHub API methods, field-implied POST requests and the supported comment, review and issue write verbs as remote.unapproved. Preserve read methods and data-program controls.",
  "evidence": [
    "docs/verifications/WO-126/VER-003.md",
    "packages/skeleton/src/harness-command.ts",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Scan every quoted argument as executable text",
      "reason": "That restores the search and example false refusals this order removes."
    },
    {
      "option": "Parse every interpreter language or execute configuration-defined aliases to discover their effects",
      "reason": "The bounded adapter cannot establish arbitrary program behavior safely; a named conservative refusal covers the reported literal routes without executing them."
    }
  ],
  "reopenWhen": "A supported route hides a denied effect, an inspection invocation is falsely classified, or a necessary opaque route gains a separately reviewed adapter."
}
```

## WO-126-D016

```json
{
  "id": "WO-126-D016",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-003 F19, the concurrent hook-state parse failure.",
  "kind": "decision",
  "decision": "Publish each complete host JSON record through a private temporary file and atomic rename. Retry an unparsable read once for compatibility with a legacy writer; persistent session damage refuses with a session-state diagnosis. The regression runs 400 observer and feedback evaluations across four concurrent processes, then checks the installed hook's corruption refusal.",
  "evidence": [
    "docs/verifications/WO-126/VER-003.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Retry reads without changing publication",
      "reason": "Truncating the shared destination would continue exposing incomplete records."
    },
    {
      "option": "Serialize every hook behind a new shared lock",
      "reason": "Atomic publication supplies the required complete-read guarantee without making readers wait for unrelated guards."
    }
  ],
  "reopenWhen": "A concurrent invocation still observes a partial record, overlapping updates lose required facts, or measured publication cost warrants a different state protocol."
}
```

## WO-126-D017

```json
{
  "id": "WO-126-D017",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-003 F20, reopening D013 with the observed macOS process-table shape.",
  "kind": "decision",
  "decision": "Accept a bare semantic-version executable basename only when its PID equals CLAUDE_PID and is verified in the hook's ancestor chain. Preserve explicit-input and running-executable precedence, the PATH fallback, and the persisted version/channel pair. The installed-hook fixture now uses the observed basename shape with a different version on PATH.",
  "evidence": [
    "docs/verifications/WO-126/VER-003.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-process-debt.mjs"
  ],
  "rejected": [
    {
      "option": "Trust any numeric process name or an unverified declared PID",
      "reason": "Neither observation identifies the running Claude ancestor."
    },
    {
      "option": "Add another process probe or read transcript contents for this case",
      "reason": "The existing verified process-table observation already contains the necessary version, with no additional subprocess or context delivery."
    }
  ],
  "reopenWhen": "The verified executable basename no longer identifies the running version, or a required host cannot expose the ancestor observation."
}
```

## WO-126-D018

```json
{
  "id": "WO-126-D018",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-003 and the executor mechanism duty recorded in D014; queued and announced as adjacent-0005 under the existing evidence-reuse authority.",
  "kind": "decision",
  "decision": "The harness wrapper and Stop evidence consumer accept a successful full-gate record at the exact current tree for the fast-gate obligation. Return the original full-gate identity, timing and reference; do not create a fictitious fast-run record. Stale, failed and unexecuted records retain normal execution. A controlled three-entry-point experiment found no projected-environment difference, so environment handling is unchanged.",
  "evidence": [
    "docs/evidence/WO-126/decisions.md#wo-126-d014",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-003.md"
  ],
  "rejected": [
    {
      "option": "Label a reused full run as a freshly executed npm test",
      "reason": "That would misstate the command and its duration."
    },
    {
      "option": "Broaden suite input exclusions to force cache hits",
      "reason": "The demonstrated duplicate is at the aggregate boundary; weakening input coverage is unnecessary and could hide relevant changes."
    }
  ],
  "reopenWhen": "The full gate ceases to include all fast checks, the wrapper repeats a current covered check, or a measured entry-point mismatch requires another bounded repair."
}
```

## WO-126-D019

```json
{
  "id": "WO-126-D019",
  "date": "2026-09-10",
  "dispatch": "Operator correction during resume: fix after asking for a conversation-only explanation of these repairs in the larger program, then stating that implementation had not been asked to pause.",
  "kind": "correction",
  "misread": "The executor interpreted conversation only as permission to pause the active repair and ended its turn after the explanation.",
  "meant": "Explain the work conversationally while continuing the authorized implementation; a question does not suspend the task.",
  "changed": "Resumed implementation immediately and clarified the existing question-is-not-a-waiver rule in product 07. The repair scope and evidence obligations continue.",
  "decision": "Treat requests for explanation as steering within the active task; pause only on an explicit pause or stop instruction.",
  "evidence": [
    "docs/product/07-execution-guide.md#discipline",
    "docs/evidence/WO-126/repair-003.md"
  ],
  "rejected": [
    {
      "option": "Infer suspension from the request's conversational framing",
      "reason": "The operator explicitly rejected that interpretation."
    }
  ],
  "reopenWhen": "The operator explicitly changes the active task, requests a pause, or asks to stop."
}
```

## WO-126-D020

```json
{
  "id": "WO-126-D020",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-004 F21 and F22, within criterion 8 and the existing permissions envelope; reopen D015 on the reported counterexamples.",
  "kind": "decision",
  "decision": "Apply the literal denied-invocation floor to every opaque program's arguments and input, independent of interpreter names and flags. Preserve data-program controls and operand-classified effect programs. Retain all producers in a piped group and parse descriptor-duplication operators before command separators; redirected groups and process substitution require an explicit adapter. Classify gh api input bodies and the report's additional write verbs as remote.unapproved. Explicit REST read methods remain reads; GraphQL is conservatively remote because this adapter does not inspect query semantics, not because the CLI invariably selects POST.",
  "evidence": [
    "docs/verifications/WO-126/VER-004.md",
    "packages/skeleton/src/harness-command.ts",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-004.md"
  ],
  "rejected": [
    {
      "option": "Continue enumerating interpreter names, flags and opaque wrappers",
      "reason": "F1, F10, F17 and F21 show that equivalent literal invocations repeatedly escape the list."
    },
    {
      "option": "Screen all quoted data as executable text",
      "reason": "That would restore the ordinary search and example refusals criterion 8 removes."
    },
    {
      "option": "Decode arbitrary languages, scripts and GraphQL operations",
      "reason": "The current bounded adapter cannot establish their general effects; named conservative refusal is reviewable without executing them."
    }
  ],
  "reopenWhen": "A supported route hides a literal denied invocation, a data-program control is refused, or a necessary opaque route gains a separately reviewed effect adapter."
}
```

## WO-126-D021

```json
{
  "id": "WO-126-D021",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-004 F23; reopen D017 because the live process name did not identify the executable version.",
  "kind": "decision",
  "decision": "For a verified Claude ancestor whose name does not expose a version, query only its text mappings with lsof, bounded to one second and one MiB per probe. Accept one unambiguous versioned Claude executable path and retain only the version/channel pair. Preserve explicit-input and executable precedence, fallback on unavailable evidence, and reuse a successful observation on subsequent session prompts. A controlled macOS process named claude resolved its versioned executable in 79.055 ms while PATH named a different version; this is an OS-process surrogate, not a live Claude attestation.",
  "evidence": [
    "docs/verifications/WO-126/VER-004.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-004-results.json"
  ],
  "rejected": [
    {
      "option": "Guess another process-name spelling or keep treating PATH as the running executable",
      "reason": "The repeated findings show that process names and installed PATH versions are insufficient evidence."
    },
    {
      "option": "Persist process paths or read transcript contents to identify the executable",
      "reason": "A bounded mapping observation supplies the version without retaining either source."
    }
  ],
  "reopenWhen": "A live Claude session still selects the wrong version despite an available mapping, the bounded probe is unavailable on a required host, or its measured cost warrants another observation channel."
}
```

## WO-126-D022

```json
{
  "id": "WO-126-D022",
  "date": "2026-09-10",
  "dispatch": "Operator correction during the VER-004 repair: repeated gate narration and validation contradicted this work order, and calling it an execution mistake would leave every future session repeating the same procedure. The operator requested a durable fix.",
  "kind": "correction",
  "misread": "The executor treated following overlapping role instructions and rerunning broad gates as sufficient, even though the work order exists to remove that cost.",
  "meant": "Change the shared instructions and executable path so later sessions inherit fewer required steps and retries retain the work already done.",
  "changed": "The work order no longer requires a gate at each turn end. The shared executor, verifier and reviewer procedure uses only harness evidence for completion; that wrapper supplies the full gate and diff check and preserves existing executable provenance. Generated-file checks precede expensive suites and stop them on failure. Declared source checks without a narrower document scope can reuse their complete candidate inputs, environment and runtime. Build, fixture preparation and live local-state guards still execute. Failed reviews and verifications require reproduction and diff evidence rather than a green application gate.",
  "decision": "Repair the recurring process in its canonical source and runner instead of adding another reminder, receipt format or validation command.",
  "evidence": [
    "scripts/test-runner.mjs",
    "scripts/lib/suite-evidence.mjs",
    "scripts/test-runner.test.mjs",
    "scripts/test-suite-evidence.mjs",
    "packages/skeleton/src/loadouts/contributor.ts",
    "packages/skeleton/src/harness-host.ts",
    "docs/product/07-execution-guide.md#discipline"
  ],
  "measurement": "The preceding full runs and isolated retry cost 485.34 + 240.92 + 53.98 + 225.84 = 1006.08 seconds. The revised runner's 21 regression tests passed in 30.080 seconds. Its small failure fixture reuses both passing source checks on retry and executes the failed check and live guard; a later document edit invalidates the complete-input entries. The generated-evidence failure fixture starts no expensive fixture. The completion-wrapper regression passed in 6.036 seconds and retains the full check identity without invoking the fast gate. Final aggregate evidence follows these authored bytes in the lifecycle record.",
  "rejected": [
    {
      "option": "Leave the procedure unchanged and apologize or add a session reminder",
      "reason": "Future sessions would still inherit the same instructions and runner behavior."
    },
    {
      "option": "Skip failed checks or reuse live local-state guards and preparation effects",
      "reason": "A retry must still execute the failure, observe current local enforcement, and create the fixtures it needs."
    }
  ],
  "reopenWhen": "A later session repeats a passing source check at identical inputs, discovers generated drift only after expensive fixtures, or the single completion entry point still demands a second application gate."
}
```

## WO-126-D023

```json
{
  "id": "WO-126-D023",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-005 F24 and F26; D020 reopens on the reported literal-invocation escapes.",
  "kind": "decision",
  "decision": "Classify package execution wrappers through their child command, including npm exec/x option parsing and its explicit -- boundary. Screen leading assignment values and Git configuration values before discarding their keys. Normalize executable basenames and the opaque literal screen for case-insensitive hosts, while retaining data operands. This closes the named invocation routes without executing them or inspecting ambient configuration.",
  "evidence": [
    "docs/verifications/WO-126/VER-005.md",
    "packages/skeleton/src/harness-command.ts",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-005.md"
  ],
  "rejected": [
    {
      "option": "Screen only opaque executables or enumerate only Git command-valued keys",
      "reason": "Assignments and the effect programs' own wrappers bypass that distinction; screening all explicit configuration values preserves the literal floor."
    },
    {
      "option": "Treat every argument as executable text",
      "reason": "Commit messages, searches and wrapper child echo arguments are required data controls."
    }
  ],
  "reopenWhen": "A supported wrapper, assignment or inline configuration route hides a literal denied invocation, or a required data control is refused."
}
```

## WO-126-D024

```json
{
  "id": "WO-126-D024",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-005 F25, the missing criterion-17 refusal observation.",
  "kind": "decision",
  "decision": "Attach one bounded refusal class to the existing hook timing row when the emitted outcome denies or blocks. Preserve event and tool, count the row through the existing meter, and exclude advisory Stop outcomes. Classification exceptions and evaluated policy denials both participate; unavailable journal writes cannot change the guard result.",
  "evidence": [
    "docs/verifications/WO-126/VER-005.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/meta.mjs",
    "docs/evidence/WO-126/repair-005-results.json"
  ],
  "rejected": [
    {
      "option": "Store command bytes or add another hook and journal append",
      "reason": "The outcome, tool and reason class supply the signal without raw content or another recurring operation."
    },
    {
      "option": "Backfill historical zeros from inferred failures",
      "reason": "Past unobserved refusals cannot be reconstructed as measured events."
    }
  ],
  "reopenWhen": "An installed-hook denial with an available journal is not counted exactly once, an advisory outcome is counted, or observation changes the permission decision."
}
```

## WO-126-D025

```json
{
  "id": "WO-126-D025",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-005 F27, lost release-case diagnostics.",
  "kind": "decision",
  "decision": "Keep failing case output through suite aggregation and let the existing evidence writer store it in an addressed log. Each failed case retains its outputRef; successful output is still omitted. Suite and case diagnostics share the same storage path and deduplication.",
  "evidence": [
    "docs/verifications/WO-126/VER-005.md",
    "scripts/test-runner.mjs",
    "packages/skeleton/src/gate-evidence.mjs",
    "scripts/test-runner.test.mjs"
  ],
  "rejected": [
    {
      "option": "Embed stdout in hot evidence metadata or rerun the failing suite for its output",
      "reason": "Addressed diagnostics preserve the evidence without inflating routine cache reads or paying for another gate."
    }
  ],
  "reopenWhen": "A failed split case loses its available diagnostic output or retained output makes routine metadata lookup grow materially."
}
```

## WO-126-D026

```json
{
  "id": "WO-126-D026",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-005 F28 within the existing 120-second fast-gate criterion and D022 preflight requirement.",
  "kind": "decision",
  "decision": "Declare package tests separately from fixture tasks and let them start at the existing build barrier. Fixture tasks still wait for generated preflights; any failed preflight still fails the aggregate. Keep the concurrency cap, package serialization group, exclusive fixtures and evidence reuse rules.",
  "evidence": [
    "docs/verifications/WO-126/VER-005.md",
    "scripts/test-runner.mjs",
    "scripts/test-runner.test.mjs",
    "docs/evidence/WO-126/repair-005-results.json"
  ],
  "rejected": [
    {
      "option": "Raise the fast-gate ceiling or remove preflight barriers altogether",
      "reason": "Neither is needed: the fresh gate passes in 110.264 seconds while the 26.605-second index overlaps package tests, and expensive fixtures retain early refusal."
    }
  ],
  "reopenWhen": "Package suites again wait unnecessarily for preflights, a fixture starts after a failed preflight, or a fresh fast gate breaches the unchanged 120-second limit."
}
```

## WO-126-D027

```json
{
  "id": "WO-126-D027",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-006 F29 within criterion 8; reopens D020 and D023 on their recorded conditions.",
  "kind": "decision",
  "decision": "Apply the literal denial floor to recognized effect programs as well as opaque executables. Remove only known Git message/file and search-pattern operands; unknown subcommands, options and their operands keep the floor. Structured classification retains precise denied effects and can add coverage. The prior repair misread recognized programs as making all remaining arguments data; VER-006 demonstrates that several are commands.",
  "evidence": [
    "docs/verifications/WO-126/VER-006.md",
    "packages/skeleton/src/harness-command.ts",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-006.md"
  ],
  "rejected": [
    {
      "option": "Add one adapter for each newly reported execution route",
      "reason": "That repeats the program-wide exemption responsible for successive failures; an unknown subcommand must retain the existing floor."
    },
    {
      "option": "Screen message and search-pattern values as commands",
      "reason": "Those operands are data by construction and their admitted controls are required by criterion 8."
    }
  ],
  "reopenWhen": "An unclassified executable operand bypasses the literal denial floor, or a supported message/search control is refused."
}
```

## WO-126-D028

```json
{
  "id": "WO-126-D028",
  "date": "2026-09-10",
  "dispatch": "Operator resume: fix selecting VER-006 F30 within criterion 17; reopens D024 because one invocation was counted once per denying hook.",
  "kind": "decision",
  "decision": "Keep every hook outcome on its existing timing row and correlate identity-bearing refusals with a digest of session, event, tool and tool-use identity. The meter counts distinct keys, including across repeated deliveries, while separate uses and sessions remain distinct. Raw identities and command bytes are absent. Historical or identity-free rows retain their individual outcome counts and their possible overcount; missing correlation is not invented.",
  "evidence": [
    "docs/verifications/WO-126/VER-006.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/meta.mjs",
    "scripts/test-process-debt.mjs",
    "docs/evidence/WO-126/repair-006.md"
  ],
  "rejected": [
    {
      "option": "Journal refusals only from the permission hook",
      "reason": "Attribution and writer-isolation denials can arise independently and must remain observable."
    },
    {
      "option": "Pair identity-free historical outcomes by timestamp or command text",
      "reason": "Hooks finish at different times and commands can repeat; that would infer evidence or retain unnecessary raw content."
    }
  ],
  "reopenWhen": "An identity-bearing tool refusal is counted more than once, separate uses or sessions collapse, an advisory result is counted, or observation changes the guard outcome."
}
```

## WO-126-D029

```json
{
  "id": "WO-126-D029",
  "date": "2026-09-10",
  "dispatch": "Operator resume: final review for WO-126 on 2026-09-10; the reviewer records the disposition of VER-007's three open findings under that dispatch.",
  "kind": "decision",
  "decision": "Pass WO-126 with VER-007's F31, F32 and F33 carried forward as sourced follow-ups rather than repaired in review. F31: several supported commit-message and search spellings are refused conservatively and no denied route opens. F32: sed and less stay data programs, so a command-valued operand the v0.16.0 regexes refused is admitted; it does not execute on the observed macOS host and would on a host with GNU sed or an interactive less. F33: the full gate under its own concurrency can fail an intermittent suite on this host and a composed retry absorbs it at a recurring cost.",
  "evidence": [
    "docs/verifications/WO-126/VER-007.md",
    "docs/final-reviews/WO-126/FINAL-001.md"
  ],
  "rejected": [
    {
      "option": "Repair the three findings inside final review",
      "reason": "A final reviewer never implements an acceptance-relevant fix and approves it; a repair returns through a fresh numbered verification."
    },
    {
      "option": "Fail the review on F31 to F33",
      "reason": "VER-007 judged every criterion met at the floor on this host and rated the findings minor or moderate; an eighth verification cycle would pay the machinery cost this order exists to remove without changing the merge decision."
    },
    {
      "option": "Leave the findings only in the verification report",
      "reason": "Verification reports are not collected into the planning follow-up register, so the findings would not reach planning entry."
    }
  ],
  "reopenWhen": "A supported message or search spelling is refused in ordinary use (F31); a host with GNU sed or an interactive less runs a command-valued sed or less operand through the installed hooks (F32); or a composed full-gate retry fails a second time on the same contention shape (F33)."
}
```
