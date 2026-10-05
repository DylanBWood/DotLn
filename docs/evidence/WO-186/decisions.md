# WO-186 decisions

## WO-186-D001 — Execute the measured gate-time repair

```json
{
  "id": "WO-186-D001",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Measure the unchanged runner and three slow cases before implementation; repair causes without dropping assertions, compose passing task results at the existing code identity, and retain fresh final-review gates.",
  "evidence": [
    "Canonical resume status selects WO-186, phase active, with all four dependencies met; resume next reserves this worktree's writer.",
    "scripts/test-runner.mjs runGateChecks currently reuses only complete passing rows; executeSuite guards package tests only.",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity currently inventories tracked files only.",
    "The work order requires five before/after measurements and defect controls; no duration improvement is claimed before those measurements."
  ],
  "rationale": "Mission and critical path: remove recurring gate waits that delay reliable source-to-deliverable work. Policy resistance: preserve the document gate and existing authority while narrowing only the active order's product-gate record paths. Commons: run measurements sequentially with one writer and no subagents during the baseline; the operator requested two read-only reviews after implementation. Drift and rule beating: retain every assertion, negative controls and full fresh review. Escalation: reuse one identity, without a new input memo or dependency. Success to the successful: compare repair with the order's declined graph/cache alternatives rather than preserving the runner by investment. Shifting the burden: expose case durations and planning conditions instead of recurring operator diagnosis. Seeking the wrong goal: judge saved wall time with equivalent coverage, not reused-task counts. Naive Interventionism: preserve scheduling, deadlines, recovery records and publication locks; change only measured causes. NoOp leaves the documented false reuse and repeated gate work.",
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves the selected order's measured cost and correctness defects unresolved."
    },
    {
      "option": "Add a per-task input key or external cache",
      "reason": "The order excludes these approaches and its replay found little median-order benefit."
    },
    {
      "option": "Drop assertions or shorten an assertion-bearing deadline",
      "reason": "The order requires unchanged failure detection."
    }
  ],
  "reopenWhen": "Profiling changes the diagnosed cause, an assertion fails to detect its planted defect, or reuse reports a pass that a fresh review cannot reproduce."
}
```

## WO-186-D002 — Decline an extra economy experiment

```json
{
  "id": "WO-186-D002",
  "kind": "experiment",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Keep the required profiling and benchmark method; decline an additional optional experiment because the order already requires comprehensive equivalent-outcome measurements.",
  "question": "Would another profiling-method experiment improve this order beyond its mandated cause profiles and five-run comparisons?",
  "alternatives": [
    "Run an additional instrumentation comparison",
    "Use the mandated profiles and benchmark series"
  ],
  "observation": "The acceptance criteria already require cause measurements, preserved assertion inventories, planted defects and five before/after gates of each kind; another experiment duplicates preparation without an established saving.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": [
      "none — optional experiment declined"
    ],
    "source": "No experiment executed; preparation is part of the executor's entry reading, separately measured by the session counter."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "none — no experimental method adopted"
    ],
    "summary": "No optional experiment and no claimed recurring improvement; required measurements remain unchanged."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/work-orders/WO-186-gate-time-follows-the-change.md acceptance criteria 1 and 9"
  ],
  "reopenWhen": "A concrete measurement-method saving becomes available within the current authority; do not run a second experiment in this order.",
  "reason": "Required profiling, preserved assertion inventories, negative controls and five-run comparisons already answer this order; an additional experiment duplicates preparation without an established saving.",
  "rejected": [
    {
      "option": "Run an additional instrumentation-method experiment",
      "reason": "Required profiling, preserved assertion inventories, negative controls and five-run comparisons already answer this order; an additional experiment duplicates preparation without an established saving."
    }
  ]
}
```

## WO-186-D003 — Keep unrelated release history out of integration fixtures

```json
{
  "id": "WO-186-D003",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Clone the tested HEAD with --no-tags --single-branch; keep every real Git integration, authored conflict, generated result and fixture-owned tag assertion.",
  "evidence": [
    "Before integration standalone walls: 261.769, 252.391, 266.399, 260.512 and 257.738 s; median 260.512 s.",
    "The first profile records 524 synchronous commands in the parent test worker, 244.422 s; 42 integration commands consume 190.058 s. Nested generator measurements overlap that total: 24 meta calls consume 41.418 s and 24 work-order-index calls 39.578 s.",
    "Repeated Git ls-tree calls inspect unrelated source release tags and their control snapshots. The fixture creates the branches and tags its assertions use."
  ],
  "rationale": "D001's mission/trap comparison still applies. Repair measured fixture setup rather than weakening the production generators. The working assumption is that removing unrelated tags removes historical scans; the after profile must confirm it.",
  "rejected": [
    {
      "option": "Stub the real generators",
      "reason": "Would remove assertion-bearing production execution."
    },
    {
      "option": "Narrow all script copies",
      "reason": "A separate declined alternative and outside this order."
    },
    {
      "option": "NoOp",
      "reason": "Preserves the measured unrelated-history work."
    }
  ],
  "reopenWhen": "An assertion or the production-defect control fails, or the after profile does not attribute the remaining work as expected."
}
```

## WO-186-D004 — Run all lock cells on separate roots

```json
{
  "id": "WO-186-D004",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Run all eight existing lock-matrix cells at concurrency four, each on a private cell root. Keep 120000-ms cell deadlines and every deterministic kill boundary and restart assertion.",
  "evidence": [
    "Before skeleton standalone walls: 309.459, 305.423, 312.175, 311.874 and 307.621 s; median 309.459 s.",
    "First standalone case durations: lock matrix 191.256 s; presence polling 38.161 s; thirty-round coexistence 36.127 s. The original matrix awaits each cell serially."
  ],
  "rationale": "D001's comparisons still apply. Concurrency is the work order's named repair and removes serialization while preserving independent mutable stores. Remaining assertion work is profiled if the target is missed.",
  "rejected": [
    {
      "option": "Remove cells or shorten real deadlines",
      "reason": "Drops the failure detection the order requires."
    },
    {
      "option": "Split the whole suite into new runner tasks",
      "reason": "Adds scheduling structure before trying the specified bounded concurrency repair."
    },
    {
      "option": "NoOp",
      "reason": "Keeps eight independent cells serialized."
    }
  ],
  "reopenWhen": "Concurrency changes a boundary assertion, produces a surviving child or exceeds a real cell deadline under the declared gate load."
}
```

## WO-186-D005 — Correct the harness duration inference

```json
{
  "id": "WO-186-D005",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Keep the operator-release race assertions and production algorithm. Add an explicit measured case report and an initial event-loop yield; distinguish case work from delayed result delivery.",
  "evidence": [
    "Five original standalone walls are 1.856, 1.950, 1.948, 1.924 and 1.912 s; median 1.924 s, already below ten seconds.",
    "The order inferred about 180 s from a gap before a printed result, not from a measured case duration. That inference is not used as a saving.",
    "The full original harness profile and execution-ordered reporter are collected before applying the drafts to locate result-delivery gaps.",
    "The full original harness diagnostic passed in 399.868 s while another session tested; its parent profile attributes 52.874 s of synchronous subprocess work to WO-132 live-gate refusal assertions, 22.472 s to WO-125 entry assertions and 17.910 s to WO-158 read-list assertions. See before-harness-profile-summary.json; this is diagnostic attribution, not an alone-host median."
  ],
  "rationale": "Evidence changes D001's harness intervention: NoOp on the production race is appropriate. Repair observability, keep all judgments and require the same planted production defect to fail. No historical 180-s reduction is claimed.",
  "rejected": [
    {
      "option": "Optimize or weaken the release race to remove 180 s",
      "reason": "The standalone evidence does not establish that cost."
    },
    {
      "option": "Report the wall gap as a case duration",
      "reason": "Confuses observed delivery with execution."
    }
  ],
  "reopenWhen": "A named runtime case duration actually exceeds ten seconds, or the planted liveness-refusal defect stops being detected."
}
```

## WO-186-D006 — Compose task results at the existing identity

```json
{
  "id": "WO-186-D006",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Reuse passing task results at one code identity, including good tasks from an unchanged-code failed attempt; record a complete local composed row with source dates, identities and locations. Force every selected task fresh for --again, --fresh and --review.",
  "evidence": [
    "Existing gate-reuse, suite-evidence and runner source; WO-173 D004; stand-down rule 10.",
    "New fixtures exercise actual commands, a later Bash process with distinct session environment, the completion claim checker and a second linked worktree. Their executed result is pending until the drafts are applied.",
    "A passed disposable release template is not retained. A missing release case uses its existing standalone setup path, preserving the passing prepare task; no new persistent cache is introduced."
  ],
  "rationale": "D001's comparisons still apply. Keep one trusted identity and durable task pointers; avoid an input graph. Missing build artifacts are not reconstructed by claiming to run only a missing task: environment remains the known receipt-038 limitation, and explicit fresh review is the backstop.",
  "rejected": [
    {
      "option": "Repeat passed preparation or build tasks automatically",
      "reason": "Violates the order's run-only-missing-task objective."
    },
    {
      "option": "Retain and key a writable release template",
      "reason": "Adds a persistent cache and another trust mechanism."
    },
    {
      "option": "Reuse failed, stopped, timed-out or partial task results",
      "reason": "Does not establish coverage."
    }
  ],
  "reopenWhen": "A fresh review fails a reused result at identical code, or source pointers cannot identify the passing observation."
}
```

## WO-186-D007 — Cover every input inventory entry

```json
{
  "id": "WO-186-D007",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Include non-ignored untracked code by path and bytes, independently of staging. Hash docs/control/outward-vocabulary.json even if marked generated. Move the five document-dependent suites to the fresh document gate.",
  "evidence": [
    "WO-174 D013 actually names eight runner suites, despite the order saying seven. All eight are covered.",
    "Document route: license-surfaces — docs/LEGAL.md; resume — control/resume.jsonl and WO-030 legacy-fold/legacy-times; resident-bind — control order segments; local-runner-double — WO-138 episode files; artifact-corpus — corpus/manifests/WO-101.json.",
    "Product identity route: github-body, outward-lint and target-publish — docs/control/outward-vocabulary.json.",
    "The document CLI fixture and its stub inventory retain every moved executable."
  ],
  "rationale": "D001's comparisons still apply. Correct stale-green reuse at its inputs, preserving every check. Routing report/control consumers to the document gate preserves the product record-writing invariant; document cost is measured separately rather than hidden.",
  "rejected": [
    {
      "option": "Leave the eighth named suite out",
      "reason": "The cited inventory authorizes all of its inputs."
    },
    {
      "option": "Put all control and report bytes in the product identity",
      "reason": "Reintroduces invalidation for ordinary records and conflicts with concurrent own-record writes."
    },
    {
      "option": "Exclude new source until staging",
      "reason": "Leaves the recorded untracked-source defect."
    }
  ],
  "reopenWhen": "A product task reads an excluded input, an untracked edit reuses a green row, or staging alone changes the code identity."
}
```

## WO-186-D008 — Admit only active product records

```json
{
  "id": "WO-186-D008",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Mark gate selections. Admit the selected open order's evidence, verification and final-review paths at the default document roots only during a plain product gate. Preserve full refusal for relocated record roots until their identity and read boundaries agree, and for document, machinery and mixed review selections, including --only document tasks and overlapping gates.",
  "evidence": [
    "Product gates now guard observed record content, existence, metadata and enumeration, including untracked paths. Callback, synchronous and promise Node forms retain their inherited observation context.",
    "Admission checks lexical and physical containment, rejects substituted record-root symlinks and multiply linked files, and retains code, other-order, control and success-record protection.",
    "Canonical closed/withdrawn or unknown authority grants no record admission. New generated-hook fixtures cover all three roots, aliases and overlapping/document/review gates. Executable results are pending."
  ],
  "rationale": "D001's policy-resistance and commons comparisons still apply. Mixed review includes document-reading machinery, so permitting simultaneous record edits there would contradict the admission invariant. Native reads and children that omit the observer remain outside the existing observation boundary; no universal read-sandbox claim is made.",
  "rejected": [
    {
      "option": "Admit all docs or closed-order records",
      "reason": "Exceeds the selected active order and risks live input changes."
    },
    {
      "option": "Permit records in a mixed review gate",
      "reason": "Its document readers do not satisfy the product-only invariant."
    },
    {
      "option": "Observe only file contents",
      "reason": "Report presence and metadata can also influence a product result."
    }
  ],
  "reopenWhen": "An admitted record edit can affect a product pass, or a protected path passes the generated refusal."
}
```

## WO-186-D009 — Make case and growth evidence visible

```json
{
  "id": "WO-186-D009",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Keep up to five measured slowest cases for each task, execution-ordered case starts for heartbeats, and explicit per-case integration completion reports. List the five longest latest fresh tasks against earlier thirty-day medians and a fresh plain-gate median against 360 seconds.",
  "evidence": [
    "Node.js official test-runner reporter documentation retrieved through Context7; actual runtime fixture checks the event protocol and duration selection.",
    "A CLI or shell invocation without subcase events has one explicitly task-granularity case; no internal durations are invented.",
    "Reused zero-duration observations do not enter performance medians. Even medians use both middle values. Legacy product-only selections are inferred from required suites because old rows did not record invocation flags."
  ],
  "rationale": "D001's shifting-burden and wrong-goal comparisons still apply. Use the existing row rather than another telemetry store or adaptive schedule. The earlier median excludes the latest observation so a new regression cannot dilute its own reference.",
  "rejected": [
    {
      "option": "Use declaration-ordered starts for a heartbeat",
      "reason": "May name a queued case rather than an executing case."
    },
    {
      "option": "Include reused zero timings",
      "reason": "Would falsely improve the growth baseline."
    },
    {
      "option": "Fabricate five shell subcase timings",
      "reason": "No measurement supports them."
    }
  ],
  "reopenWhen": "The Node runtime protocol changes, a heartbeat names a finished case, or a reused observation enters a growth comparison."
}
```

## WO-186-D010 — Retain honest benchmark boundaries

```json
{
  "id": "WO-186-D010",
  "correction": "The initial unfiled D010 typed 483.508 s without checking the retained wall field. before-series.json excludedRuns records 483779.759334 ms; the corrected rounded wall is 483.780 s.",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Run the mandatory five before and after standalone, plain and review observations serially; retain task selections and compare the Cost line item by item. Keep the replay script and last-thirty-order output as evidence, without installing the declined input-selection alternative.",
  "evidence": [
    "The first enclosing before probe incorrectly gave the entire series a 900-s bound. It was stopped at a retained boundary; incomplete logs remain. Subsequent standalone commands each own their 900-s bound, and gates own their monitors.",
    "Before plain selects 29 suites; before review selects those plus registrations. After review will select this order's changed machinery, so raw review differences cannot be attributed only to the three repairs.",
    "First standalone observations are instrumented; all five are included in each median. No other gate or probe from this session runs concurrently; other host activity remains unknown.",
    "New named input: WO-185's handoff was read only to check the established at-close retarget handling; no verdict or timing is inherited.",
    "The original fifth review passed in 891.395 s but overlapped a foreign gate; its 483.780-s replacement also overlapped a newly started foreign gate. Both observations remain excludedRuns in ignored before-series.json, with the second run's two-second process observations; neither enters the alone-run comparison.",
    "Rather than hold all implementation behind host contention, preserve the original working public files and compiled dist in the declared disposable docs/control/local/harness/wo186-before-snapshot. Its original code identity 8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46 and review selection match; full release tags and the original merge-base ref are retained. before-snapshot.json records the checked boundary. The remaining timing run is still pending."
  ],
  "rationale": "D001's commons and escalation comparisons still apply. Equivalent assertion outcomes matter more than optimistic headline savings. Preserve interrupted observations and report the selection and document-route tradeoffs.",
  "rejected": [
    {
      "option": "Choose only favorable observations",
      "reason": "Would not satisfy the five-run comparison."
    },
    {
      "option": "Claim equal review selections without reading them",
      "reason": "Would confound source coverage with performance."
    },
    {
      "option": "Add per-task input reuse",
      "reason": "The retained replay is a reopening test, not authority to build another key."
    }
  ],
  "reopenWhen": "The replay's median affected share reaches 60 percent or below, or the final profiles reveal an unasserted recurring wait.",
  "misread": "The initial unfiled decision typed 483.508 s without reading the preserved replacement wall field.",
  "meant": "before-series.json excludedRuns records 483779.759334 ms, or 483.780 s rounded.",
  "changed": "Corrected the unfiled evidence value; both overlapping passing observations remain excluded, with no claimed solo median."
}
```

## WO-186-D011

```json
{
  "id": "WO-186-D011",
  "date": "2026-10-05",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.66.3, the next patch above the observed release baseline v0.66.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.66.2 (local tags)",
    "patch classification declared in docs/work-orders/WO-186-gate-time-follows-the-change.md"
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

## WO-186-D012 — Refresh derived evidence without another live episode

```json
{
  "id": "WO-186-D012",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Refresh generated role roots and three registered source editions; carry the existing feedback audit into a new immutable edition because the compiler release label moved its policy hash. Preserve old editions, refresh publication locks in place and retain private package publication controls.",
  "evidence": [
    "All 55 runner fixtures passed; separately retained cross-process proofs and both live-record permission/reservation cases passed. The compiler harness tests passed. See initial-checks.json and cross-process-proofs.json.",
    "The assertion-inventory draft incorrectly assumed the legacy TypeScript API. Installed package exports and current version-specific official docs require the native sync API and unstable AST module. The corrected virtual-source AST comparison passes and lists all compared assertions in assertions.json. Optional trailing commas are formatting, so they do not change assertion arguments.",
    "Local release prepare assigned v0.66.3 above observed v0.66.2 and recorded D011. Compiler 0.25.2, skeleton 0.52.3 and harness CLI 0.34.4 are patch labels; existing console dependency labels follow the changed workspaces. No dependency was added. Existing CLI invocation forms remain; internal gate rows and helper functions extend to support reuse and reporting.",
    "harness emit generated 32 surfaces; authority write compared 35 bundle paths. Authority, artifact-identity and verification now select immutable WO-186 revision 001 editions. Artifact write retained the frozen Seiri semantic hash and oracle; synthetic verification write passed its defect, repair, staleness and replay assertions.",
    "feedback --check explicitly refused the old edition because the compiler label moved policyHash from fnv1a64:60b010063737f0af to fnv1a64:80b9125eb79b6fbe. feedback --carry checked unchanged judged behavior and carried the existing WO-184/feedback-003 live audit through the selected WO-195 edition into WO-186/feedback-001; no live episode. The current selection is updated only after that successful carry.",
    "publication --print-locks and publication:check passed with both current source locks, 253/253 headings, and unchanged publication source-base provenance.",
    "New implementation/evidence inputs: scripts/lib/case-reporter.mjs and this order's replay-affected.mjs, assertion-inventory.mjs, defect-controls.mjs and profile-cases.mjs. Documentation lookup used the official TypeScript v7.0.2 package tests via Context7 and checked installed .d.ts exports."
  ],
  "rationale": "D001's mission and eight-trap comparison still applies. Generated constraints and evidence must describe the same code, without widening authority, duplicating live audit work or discarding historical evidence. NoOp would leave stale role text and source pins; editing old editions would erase their recorded subjects.",
  "rejected": [
    {
      "option": "Overwrite old source editions",
      "reason": "Immutable evidence preserves earlier subjects and audit provenance."
    },
    {
      "option": "Launch another live feedback episode",
      "reason": "The executable carry check established unchanged judged behavior; only component release labels moved."
    },
    {
      "option": "Add a parser dependency",
      "reason": "The installed pinned TypeScript API supplies actual ASTs; the initial legacy-API assumption needed correction."
    }
  ],
  "reopenWhen": "A source change moves any selected edition, the deterministic carry check detects changed judged behavior, or publication links/locks fail."
}
```

## WO-186-D013 — Align fixtures with the changed identity and evidence edition

```json
{
  "id": "WO-186-D013",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Preserve the lifecycle fixture's selection-coverage assertions, first prove that creating untracked runner code invalidates its old passing row, and then record the replacement row at the new identity. Refresh the existing console self-host fixture through its canonical recorder.",
  "evidence": [
    "The formatted document gate passed 27 tasks and failed resume and console-docs. The lifecycle fixture created untracked code after its passing row; the new identity correctly refused that row. Console fixtures still selected the previous evidence/compiler edition.",
    "New named inputs: scripts/test-off-ramps.mjs, scripts/console-fixtures.mjs, packages/console/fixtures/manifest.json and the three selfhost expected outputs.",
    "The bounded console-fixtures --record-current-selfhost command passed on 2026-10-05T04:08:28Z. The lifecycle fixture adds an old-row rejection assertion before retaining its missing-machinery and inline-document-gate assertions.",
    "The next recheck exposed two more old-key assumptions: WO-103 planted untracked runner code after its row, and the later absent-runner fallback expected the original identity despite retaining another untracked source. Planting now precedes the row; removing the runner explicitly changes the identity, and the unavailable-selection cases get a distinct current-identity row. The canonical bash scripts/test-resume.sh passed in 48.924 s ending 2026-10-05T04:55:11.699Z, after D018's host isolation. Full document gate remains pending.",
    "A direct test-off-ramps.mjs invocation omitted its required canonical owned temporary root; that was an invocation error, corrected by its checked test-resume.sh caller. An attempted adjacent.mjs path was also wrong; package.json names scripts/adjacent-work.mjs, used for D018's canonical queue. Failed logs are retained; neither failure is represented as a passing check."
  ],
  "rationale": "D001's mission and eight-trap comparison remains applicable. Fixtures must judge the new identity contract and the current selected evidence while keeping the existing failure assertions. NoOp leaves two known failures; restoring old identity behavior would undo criterion 4.",
  "rejected": [
    {
      "option": "Remove the failing selection-coverage assertion",
      "reason": "It still guards a distinct requirement after the row is recorded at the proper identity."
    },
    {
      "option": "Hand-edit the console golden output",
      "reason": "The existing canonical recorder derives it from the selected self-host subject."
    }
  ],
  "reopenWhen": "The executable recheck exposes a fixture failure or a current evidence-selection change."
}
```

## WO-186-D014 — Two independent read-only implementation critiques

```json
{
  "id": "WO-186-D014",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator-requested implementation reviews",
  "decision": "At the end of the initial implementation, admit exactly two read-only agents: one adversarial critic and one principal software engineer improver. Each judges the complete bounded change; neither edits, runs probes/builds/tests, dispatches a lifecycle role, or spawns descendants. Reuse those agents for any follow-up confirmation; the parent remains the sole writer.",
  "evidence": [
    "The operator explicitly requested an adversarial subagent and one principal software engineer improver subagent at the end of implementation.",
    "Before admission, collaboration list_agents showed only the root. harness usage for session 01a1098f-2652-7333-8c29-6c06ce2b8ea1 at 2026-10-05T04:12:34.384Z observed zero agents against cap 20; uncounted remainder remains unknown. Explicit session count before admission is zero, planned count is two, and planned descendants are zero.",
    "Implementation and initial unit/permission checks exist; final document recheck, defect controls and before/after timing acceptance are still outstanding and are disclosed to both critics."
  ],
  "rationale": "Independent scrutiny contributes to correctness within the operator's requested scope. Batching the whole implementation into two read-only reviews avoids duplicate writers and test contention. NoOp would omit the requested critiques; additional fan-out has no identified benefit.",
  "rejected": [
    {
      "option": "Give each critic a writable copy of this worktree",
      "reason": "One writer owns the selected worktree."
    },
    {
      "option": "Spawn one agent per acceptance criterion",
      "reason": "The requested two agents can each judge the complete change without multiplying admissions."
    }
  ],
  "reopenWhen": "Either review identifies a material correctness gap; repair in the parent and request confirmation from the same agents."
}
```

## WO-186-D015 — Repair the independent critiques before final evidence

```json
{
  "id": "WO-186-D015",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator-requested implementation reviews",
  "decision": "Bind composed source passes to the captured gate identity; clear lookup results after an intervening code change. Close descriptor metadata and physical/prospective alias read gaps. Retain the full write refusal for relocated record roots. Refuse symbolic source aliases rather than trusting only their link text. Use immediate case completion events and retain fresh passing-task timings from failed whole gates.",
  "evidence": [
    "Both requested read-only critics independently found the partial-lookup I to startup J composition race, write-only descriptor metadata gap, and configured admission/observation mismatch. The adversarial critic also identified symlink-before-parent and missing-final-path read escapes, passing-task growth hidden by another task's failure, and inherited symbolic-source target omission. The principal critic identified buffered completion and runtime skip/todo heartbeat residue. Neither ran probes, edited, dispatched a role or spawned descendants.",
    "The document recheck was canonically stopped while still waiting for another worktree's four host lanes at 2026-10-05T04:17:01.512Z; no check was recorded. Its log is retained. This enabled the source repairs before further gates.",
    "After fixing a strict TypeScript tuple-index error, the bounded build passed. The full runner file passed 57 of 58; the sole failure was a test regex expecting 'via fstat' where the real guard renders '(fstat)'. Its correction exposed an extra readFileSync-internal openSync observation; the alias fixture now checks both required paths/methods without assuming one event per read. All thirteen WO-186 cases then passed in the bounded run ending 2026-10-05T04:29:39.360Z.",
    "New deterministic fixtures change source in the actual host-confinement preflight between lookup and startup, reject mixed source identities, refuse untracked/staged/committed symbolic source aliases, inspect write-only sync/callback descriptors and promise handles, read through a symlink followed by '..', probe a missing aliased report, and verify concurrent duplicate-name and runtime skip/todo completion cleanup. Growth fixtures preserve a slowed passing task in a failed whole row while excluding that row from the plain-pass median.",
    "Node.js reporter lookup used Context7 /nodejs/node and the official v26.7.0 event-order table, checked against installed @types/node 26.6.2 and actual Node 26.9.0 fixtures. test:complete is immediate; test:pass/test:fail are declaration ordered. entryFile and testId correlate concurrent instances. The v26.9.0 documentation URL was unavailable through the browser tool; no inference from that failure is made.",
    "Three registered source editions and generated role roots now need another deterministic refresh before document checks; final review, timings, replay and planted-defect controls remain pending."
  ],
  "rationale": "D001's eight-trap comparison still applies. These counterexamples violate the order's one-key and concurrent-record invariants or hide the timing regressions it is meant to expose. Scoped fail-conservative handling avoids a new physical dependency key or portable-root architecture. NoOp leaves concrete false-green paths; restoring passing bytes would hide them.",
  "rejected": [
    {
      "option": "Keep reused source identities merely nonempty",
      "reason": "A complete composed row must judge one captured identity."
    },
    {
      "option": "Admit relocated records without changing their code-identity boundary",
      "reason": "The key currently excludes the default document tree, and configured admission cannot safely outrun that boundary."
    },
    {
      "option": "Hash only symbolic source link text",
      "reason": "Its ignored target can change without changing the key; unsupported aliases now refuse instead of producing a false green."
    },
    {
      "option": "Treat buffered TAP result order as current execution",
      "reason": "A completed concurrent case may remain buffered while another runs."
    }
  ],
  "reopenWhen": "Either critic's follow-up finds a remaining counterexample, a final fresh gate fails, or a real relocated-root use needs a shared identity/read/admission design."
}
```

## WO-186-D016 — Preserve the reviewed rule within the standing context route

```json
{
  "id": "WO-186-D016",
  "date": "2026-10-05",
  "dispatch": "resume: next",
  "decision": "Raise only the installed verifier cold-start ceiling from 25,151 to the measured 25,735 plus one 4,096-byte step, 29,831, under product 07's standing 2026-09-17 operator direction. Preserve all generated record-write/read and review-refusal rules; retain the other ceilings.",
  "evidence": [
    "The retained context-before-step.log measures the unchanged verifier at 24,955 bytes in each root, below 25,151. The final reviewed generated roots measure 25,735, an increase of 780 (CLAUDE.md 6,873 plus skill 18,862), and harness-context --check reported both root breaches. These are new breaches, not inherited ones.",
    "Executor measures 29,237 against 29,246; reviewer 27,077 against 28,884; release-close 18,186 against 21,266; planner 20,004 against 24,576; refuter 19,283 with no ceiling. Deltas versus the before snapshot are 780, 840, 526, 526 and 526 respectively. Both skill roots agree.",
    "The budget file carries the measured bytes, named rule and this decision. It is a registered harness source. The initial unfiled decision confused harnessSources with authoritySources; the checked authority source list does not include budgets.json. The extra successful authority revision 003 is preserved, without attributing its need to this budget field."
  ],
  "rationale": "D001's drift, policy-resistance and wrong-goal comparisons apply. The operator's standing route preserves a reviewed rule rather than trimming it to satisfy a byte count or leaving a new breach advisory. NoOp would leave the new verifier breach; an unrelated ceiling increase has no evidence.",
  "rejected": [
    { "option": "Trim reviewed rules", "reason": "The standing operator direction expressly preserves them." },
    { "option": "Raise every role's ceiling", "reason": "Only the verifier has a measured breach." }
  ],
  "reopenWhen": "Another reviewed rule breaches a measured role ceiling; repeat the standing measured-bytes-plus-one-step route.",
  "misread": "Mistook the budgets.json entry in harnessSources for an authoritySources entry.",
  "meant": "The file is a registered harness source; the authoritySources list does not include it.",
  "changed": "Corrected the unfiled source-registry claim and retained the already generated successful authority revision 003."
}
```

## WO-186-D017 — Close the reviewers' remaining record-read counterexamples

```json
{
  "id": "WO-186-D017",
  "date": "2026-10-05",
  "dispatch": "resume: next; same two implementation critics",
  "decision": "Observe own-record readlink metadata in synchronous, callback and promise forms, register a promised FileHandle's descriptor for fstat calls, and remove descriptor registrations only when the closing generation still owns them. Guard native copy source reads too, keeping the existing excluded-tracked-input content boundary.",
  "evidence": [
    "The same adversarial critic confirmed the prior repairs and identified own-directory symlink text reads. The same principal critic confirmed the reporter repair and identified fstatSync(handle.fd) after a write-only promised open. No additional agent was admitted.",
    "The descriptor fixture now uses both fstatSync and callback fstat on the promised handle, as well as handle.stat. Record-link fixtures exercise all three readlink forms. Copy fixtures exercise sync/callback/promise copyFile and cp source reads, which otherwise use native code without readable-open interception. The bounded final-read-guard log records the executable result.",
    "The principal critic then found that earlier same-path fstat observations could mask promise registration in the regression fixture. Promised descriptors now use a distinct promised.md path and require both per-method diagnostics plus exactly five observations. The bounded case passed in 1.324 s ending 2026-10-05T04:42:55.686Z. The same principal critic confirmed that without registration only three observations remain and both promised-path assertions fail; handle.stat cannot mask it. The adversarial critic confirmed all three readlink forms. Both confirmations are source-only, with no agent tests or probes.",
    "Native code and children that omit the observer remain outside the inherited observation boundary; these fixes do not claim universal read containment."
  ],
  "rationale": "These are concrete ways an admitted record edit can affect an observed Node task, within criterion 7. D001's one-key, commons and wrong-goal comparison still applies. NoOp would preserve two known false-green paths; classifying every write-only open as a read would unnecessarily reject writes without a dependency.",
  "rejected": [
    { "option": "Observe only FileHandle.stat", "reason": "Its public descriptor also works with fs.fstat methods." },
    { "option": "Delete asynchronous close registrations unconditionally", "reason": "A recycled descriptor may already belong to a later open." }
  ],
  "reopenWhen": "A reported record read remains unobserved inside the supported Node forms, or final executable checks fail."
}
```

## WO-186-D018 — Isolate the existing lifecycle fixture's host identity

```json
{
  "id": "WO-186-D018",
  "date": "2026-10-05",
  "dispatch": "resume: next; bounded adjacent repair",
  "decision": "Unset inherited CODEX_THREAD_ID and COPILOT_AGENT_SESSION_ID at the shell fixture's entry, alongside its existing effort isolation. Preserve exact status assertions and every explicit host-readback probe.",
  "evidence": [
    "After the off-ramp and verifier-claim fixtures passed, bash scripts/test-resume.sh failed because its host-neutral status object inherited currentSession from this live Codex host. scripts/resume.mjs adds that field when a host identity selector is supplied; the shell fixture did not clear those selectors.",
    "New named input: scripts/test-resume.sh. The repair was queued as adjacent-0001 at revision 1, announced in chat and recorded, checked at a safe message boundary, started at queue revision 4 and completed at revision 5. This check-in is actor-attested, not a host inbox observation.",
    "The exact canonical suite passed in 48.924 s ending 2026-10-05T04:55:11.699Z; the full output is retained in ignored session scratch as resume-canonical-3.log. No status assertion was relaxed and no product behavior was changed."
  ],
  "rationale": "Criterion 11 requires the document gate. D001's mission and eight-trap comparison remains applicable: isolate a concrete fixture dependency within the existing low-risk authority. NoOp leaves a reproducible host-dependent failure; accepting an arbitrary extra field would weaken the exact status contract.",
  "rejected": [
    { "option": "Allow extra status fields without asserting them", "reason": "The fixture intentionally checks an exact host-neutral lifecycle object." },
    { "option": "Change production session readback", "reason": "The observed field is correct when an actual host identity is supplied." }
  ],
  "reopenWhen": "Another host selector leaks into this fixture, or an explicit host-readback test requires a separately declared selector."
}
```

## WO-186-D019 — Qualify the timing comparison without inventing host isolation

```json
{
  "id": "WO-186-D019",
  "date": "2026-10-05",
  "dispatch": "resume: next; required measurement evidence",
  "decision": "Retain the original before series and its two explicitly contaminated review attempts. Obtain the required isolated comparison from the declared exact before snapshot and the final implementation, with one command at a time, ten seconds of observed quiet before each run and process observations every two seconds. Preserve failed or contaminated attempts outside the passing medians.",
  "evidence": [
    "The original before-series record says other sessions were unobserved. Two later fifth-review attempts have observed foreign test activity and are excluded. No absence of unobserved activity is asserted.",
    "before-snapshot.json records matching original and snapshot code identities and review selections, with the full original release history and compiled sources retained. The root implementation need not be reverted to repeat a baseline.",
    "The parent completed all 58 runner checks, the canonical resume suite and the full document gate: 29 tasks passed, zero failed, 67.54 s. The timing driver samples process identity and kind without exposing foreign command arguments. Standalone commands retain their own 900-second bound; gates retain their supervision.",
    "The scope of isolation is observable concurrent Node/npm tests, builds and bounded probes; normal host background work and activity between samples are not proven absent. A sampled concurrent command excludes that observation. Final medians and their cost reconciliation remain pending."
  ],
  "rationale": "Criteria 1 and 9 require five alone-host observations. D001's mission and eight-trap comparison still applies. Repeating unqualified evidence costs time but avoids turning an unknown into a speedup claim; the original measurements remain useful diagnostic evidence. This is completion of the required measurement, not a second economy experiment.",
  "rejected": [
    { "option": "Call the original unobserved intervals isolated", "reason": "The records do not establish that claim." },
    { "option": "Restore the root implementation to its old bytes", "reason": "The declared snapshot preserves the exact before subject without risking current work." }
  ],
  "reopenWhen": "The snapshot identity or review selection changes, an after-source change invalidates the series, or host activity prevents an isolated observation."
}
```

## WO-186-D020 — Judge the operator's normal parallel workflow

```json
{
  "id": "WO-186-D020",
  "date": "2026-10-05",
  "dispatch": "resume: next; operator correction of the measurement target",
  "decision": "Supersede D019's isolation requirement. Amend the objective and criteria 1 and 9 to measure ordinary host use with parallel work orders allowed, retaining observed contention and unknowns. Keep five observations per command, the thresholds or assertion-bearing profiles, all correctness requirements and the full fresh review. Do not repeat a passing run merely to obtain a quiet host.",
  "evidence": [
    "In this session the operator challenged the absence of demonstrated overall benefit, then explained that work orders always run in parallel and that isolated-host results do not answer their use case. This decision synthesizes that direction; it does not reproduce raw intake.",
    "The original before series has 24 retained passing runs and a first passing fifth-review run that D019 excluded for concurrency. Preserve and use that original observation, including its observed overlap, rather than selecting a faster retry. Later repetitions remain supplemental evidence.",
    "The first after harness and integration observations passed in 1.673 s and 184.501 s. The skeleton observation passed in 286.043 s and overlapped other probes; that passing run remains part of the ordinary-host-use comparison. Its former exclusion and process observations are retained as provenance.",
    "The first after review attempt failed its metadata preflight because D019 had been added after refreshing the decisions index. That failed attempt remains excluded from passing medians; refresh the index before retrying. Passing assertions and generated documents are implementation evidence, not a demonstrated overall speedup."
  ],
  "rationale": "The mission is less operator waiting in the real parallel workflow. D001's commons and wrong-goal comparisons now require keeping contention in the observed cost rather than spending more operator time eliminating it. Drift and rule beating: preserve failed attempts, sample counts, assertions and limits on causal attribution. NoOp would continue measuring a workflow the operator does not use.",
  "rejected": [
    { "option": "Repeat the full baseline solely to establish host isolation", "reason": "The operator explicitly rejected that measurement target; it adds delay without answering their normal workflow." },
    { "option": "Discard every concurrent passing observation", "reason": "That removes representative workload conditions from the evidence." },
    { "option": "Claim a causal net speedup from differently loaded runs", "reason": "Observed wall times can be compared, but unknown or unequal load limits attribution." }
  ],
  "reopenWhen": "The operator requests an isolated diagnostic or controlled-load comparison, or ordinary-use evidence exposes a regression needing a bounded cause profile.",
  "misread": "Treated host isolation as the acceptance target despite the operator's normal parallel-work-order workflow.",
  "meant": "The useful outcome is less elapsed work with normal concurrency and preserved correctness.",
  "changed": "Retain concurrent passing observations, stop quiet-host retries, and bind the operator-directed method to the amended work order."
}
```

## WO-186-D021 — Repair the full review's integration failures

```json
{
  "id": "WO-186-D021",
  "date": "2026-10-05",
  "dispatch": "resume: next; full fresh review findings",
  "decision": "Use the canonical default document-root helper for the keyed vocabulary path; add a separate WO-186 generated-role oracle preserving every historical snapshot; and update the compiler's exact assertion for the authorized default-root qualification. Keep all existing assertions and register both new and integrated oracle inputs in the machinery selection.",
  "evidence": [
    "The ordinary full-review attempt starting 2026-10-05T05:22:24.751Z failed process-debt at its current-role hash assertion, configuration-root at its literal-document-root assertion, and compiler at the exact generated record-admission paragraph. The generated paragraph itself already included the required default-root restriction.",
    "Named inputs: scripts/test-process-debt.mjs, packages/skeleton/fixtures/wo195-integrated-role-baseline.json, packages/skeleton/fixtures/wo186-role-baseline.json, scripts/test-configuration-root.mjs and packages/compiler/test/harness.test.ts. The existing historical oracle test explicitly requires a new oracle for authorized role changes; earlier snapshots remain byte-exact.",
    "That attempt was stopped at 900.119 s by the executor's redundant outer bounded wrapper before integration finished. It is failed, incomplete evidence, not a passing gate. The canonical evidence stop command later reported no active gate, and both reported descendant PIDs were absent. Future complete gates use their existing supervision without that extra wrapper; standalone probes remain bounded.",
    "The principal reviewer found per-operation physical path resolution in all inherited Node children, including TypeScript builds in integration fixtures. This proves added work, not its share of the observed slowdown; a same-case guarded profile is pending. Normal concurrent host activity remains allowed.",
    "Focused checks now pass: all seven compiler harness cases, the historical economy-oracle case, and all fourteen configuration-root checks. The first direct configuration-root invocation inherited the live Codex identity and failed its private launchpad lifecycle; rerunning with CODEX_THREAD_ID and COPILOT_AGENT_SESSION_ID omitted, as the canonical suite environment already does, passed in 3.159 s. The canonical full review remains the acceptance check."
  ],
  "rationale": "D001's mission and eight-trap comparisons apply: criterion 11 requires a real passing review, and criterion 7's safety rule must survive optimization. These are direct integration defects in the authorized changes. NoOp leaves known failures; rewriting historical golden bytes or weakening exact assertions would hide them.",
  "rejected": [
    {
      "option": "Rewrite the earlier role oracle",
      "reason": "It is an immutable historical snapshot whose byte-exact chain is asserted."
    },
    {
      "option": "Relax document-root or generated-rule assertions",
      "reason": "The canonical helper and exact authorized rule satisfy the existing contracts."
    },
    {
      "option": "Attribute the integration slowdown to parallel work without a cause profile",
      "reason": "The source exposes observer overhead that needs measurement before attribution."
    }
  ],
  "reopenWhen": "A focused check or fresh full review still fails, or the guarded real-generator profile identifies removable observer overhead.",
  "misread": "Wrapped a self-supervised full gate in a second 900-second probe deadline.",
  "meant": "Only standalone probes need the extra bounded wrapper; a complete gate retains its own deadlines and supervision.",
  "changed": "Preserve the timed-out attempt as failed evidence and remove the redundant outer deadline from subsequent full gates."
}
```

## WO-186-D022 — Remove redundant observer work while preserving path checks

```json
{
  "id": "WO-186-D022",
  "date": "2026-10-05",
  "dispatch": "resume: next; measured guarded integration regression",
  "decision": "Install the observer once per captured manifest/log pair even when a clone imports another module copy. For an actually absent leaf only, resolve its unnormalized parent natively and append the leaf; retain full prospective traversal for existing dangling links, missing parents and other failures. Keep all outside-root alias resolution and avoid topology caching.",
  "evidence": [
    "The same first real-generator integration case passed through executeSuite with product:true and activeOrder WO-186 in 69.297 s, ending 2026-10-05T05:48:58.940Z. Earlier standalone timing was 10.023 s. These ordinary-host observations do not control equal contention; they establish a guarded regression needing investigation, not a causal allocation.",
    "The principal reviewer found the clone imports a second observer alongside the preload, and same-PID identical child-command events occur twice. The source also walks path components after every failed native realpath. A dangling final symlink is the counterexample to blindly appending a missing basename, so the shortcut first requires raw lstat to report absence.",
    "The focused own-record fixture passed in 1.294 s at 2026-10-05T05:50:53.206Z. Added assertions require unchanged filesystem and child-process function identities after duplicate module import, exactly one child event, exactly one report observation, and observation of a dangling final link whose missing target is an own record. All previous descriptor, metadata, readlink, copy and parent-alias assertions remain.",
    "The first diagnostic attempted to pass WO186_PROFILE through suiteEnvironment, whose explicit allowlist omits that name; no command profile was emitted. Its measured case result remains valid. The scratch profiler now uses DOTLN_WO186_PROFILE, which the existing suite environment carries. No production environment rule was broadened.",
    "The initial inference that TypeScript candidate resolution was instrumented was wrong: this installation's Node launcher execs the native compiler. The path work is in observed Node fixture/build/generator code; native compiler reads remain outside that boundary. After timing and command profiling are pending.",
    "After the repair, the identical guarded generator case passed in 12.496 s (bounded wrapper 12.547 s), ending 2026-10-05T05:51:50.855Z. The command profile contains 216 observations: the two integration commands took 3.554 and 4.144 s, with the continuation's build 0.848 s and metadata generator 1.262 s. Nested durations overlap and are not additive. The 69.297-to-12.496 comparison is a single-case ordinary-host diagnostic, not the five-run full-gate result.",
    "The adversarial reviewer identified trailing-slash traversal of a dangling directory link. The added existsSync('dangling-dir/') assertion reproduced the missing observation on this Darwin host (bounded red 0.608 s). Bypassing the shortcut for trailing separators made the complete own-record fixture pass (bounded green 1.265 s at 2026-10-05T05:56:50.771Z). The newly started full review was canonically stopped after 11.715 s before changing source; it recorded no check and remains failed/incomplete evidence. The reviewer's public specification input was Linux path_resolution(7); the parent then supplied actual Darwin evidence."
  ],
  "rationale": "D001's mission and eight-trap comparisons apply. Criterion 7 needs one effective observer, not repeated wrappers or repeated root walks for a simple absent leaf. Preserve failure detection and normal parallel work; do not buy speed by skipping aliases, reads or assertions. NoOp leaves the measured guarded cost and source-proven duplication.",
  "rejected": [
    {
      "option": "Skip lexical paths outside the worktree",
      "reason": "An outside symlink can name an admitted record inside the worktree."
    },
    {
      "option": "Cache physical path results",
      "reason": "Mutable symlinks or parent topology can invalidate the result during a task."
    },
    {
      "option": "Append a basename whenever full realpath fails",
      "reason": "A dangling leaf link may target an own record and must still be followed."
    }
  ],
  "reopenWhen": "The after profile remains slow, a duplicate installation still changes functions, or an alias regression fixture fails.",
  "misread": "Attributed the candidate-lookup cost to a JavaScript TypeScript compiler before checking its installed launcher.",
  "meant": "The installed compiler is native; only the Node orchestration and generators are subject to these wrappers.",
  "changed": "Corrected the causal claim in chat, retained the direct case timing and added a command profile without weakening the observer."
}
```

## WO-186-D023 — Reuse the required gate executions as suite observations

```json
{
  "id": "WO-186-D023",
  "date": "2026-10-05",
  "dispatch": "resume: next; D020 ordinary-workflow measurement",
  "decision": "Supersede D010's executor-chosen duplicate standalone-suite protocol. Use the five executed skeleton and integration task durationMs observations in each phase's mandatory forced-fresh plain gates for criterion 1, alongside the five standalone harness-subcase observations. Keep all five before/after plain gates and full reviews for criterion 9. Preserve original standalone and preliminary after passes as named supplemental comparisons, including the overlapping skeleton pass; no passing observation is discarded for concurrency.",
  "evidence": [
    "The canonical amended criterion 1 requires five runs per target during ordinary host use and does not require standalone commands. Criterion 9 already requires five complete plain gates per phase. The same principal reviewer independently checked these clauses and the actual before rows; no waiver is needed and no assertion/profile, defect-control, replay or Cost duty is removed.",
    "The five before plain gates are fresh, passing, share the baseline identity and contain actual successful non-reused skeleton and worktree-integration rows. Skeleton durationMs values are 355779, 352629, 375008, 351792 and 359417; median 355.779 s. Integration values are 302750, 307349, 293161, 312605 and 308672; median 307.349 s. The rows record shared load classes and lane peers.",
    "The original standalone before medians remain 309.459 s for skeleton and 260.512 s for integration. The preliminary after observations remain 286.043 s (observed foreign probes) and 184.501 s. They are preserved as supplemental comparisons at their recorded source identities, rather than mixed into the five plain-gate task samples.",
    "After task observations use exactly durationMs from successful freshly executed rows. The artifact retains selected suites, current guard coverage, moved document assertions, observed external contention and unknown intervals. Tasks overlap, so changes in suite durations are never summed into purported gate savings. Raw full-review comparisons retain their different machinery selections.",
    "The parent announced this method in chat. The same principal critic performed read-only source and evidence inspection, no probes, edits or additional delegation."
  ],
  "rationale": "D001's mission and eight-trap comparisons apply, especially commons, shifting the burden and seeking the wrong goal. D020 directs the operator's real parallel workflow. Reusing observations from already-required executions measures ordinary lane sharing and avoids redundant long suite runs while preserving sample counts, final correctness and explicit comparison limits. NoOp would spend more operator time repeating assertions without increasing the required observation count.",
  "rejected": [
    {
      "option": "Run five additional standalone executions of each long suite",
      "reason": "The mandatory plain gates already execute both suites five times under the requested ordinary workflow."
    },
    {
      "option": "Mix standalone and in-gate timings into one median",
      "reason": "They are different sampling units with different internal lane sharing."
    },
    {
      "option": "Drop an overlapping preliminary pass",
      "reason": "D020 expressly preserves normal concurrent observations; the pass remains supplemental evidence."
    }
  ],
  "reopenWhen": "A required plain-gate task is reused, failed, absent or lacks measured duration, or a comparison needs a separate controlled diagnostic."
}
```

## WO-186-D024 — Remove the lock matrix's remaining synchronous serialization

```json
{
  "id": "WO-186-D024",
  "date": "2026-10-05",
  "dispatch": "resume: next; measured remaining target-case cost",
  "decision": "Use an asynchronous subprocess counterpart only for the eight lock-matrix cells' discovery and two restart calls. Preserve exact arguments, inherited environment, ten-second subprocess bounds, 120-second cell deadlines, every within-cell ordering and assertion, and private roots. Own, cancel and reap each matrix child before cell/root teardown, including paused kill-boundary children.",
  "evidence": [
    "The complete review passed all 86 tasks at code identity 4c3632f07980fcf1f094e0c20a338d5d20c2786daa3af7d7c26f33f54ee0c2ac: gate 844.374 s, driver wall 845.491 s, with no sampled foreign intervals. Its 36 suites add eleven machinery suites and move five document-dependent suites out relative to the baseline review's thirty. This is not a raw overall review speedup.",
    "That review's skeleton task took 327.342 s; the lock matrix itself took 190.885 s. The preliminary standalone matrix had taken 162.564 s. Its retained profile contains exactly 696 synchronous resident-lock-process launches for matrix roots, totaling 149.103 s. The source confirms discovery and both restart calls use spawnSync on the one event loop shared by four concurrent cells.",
    "The same principal reviewer independently confirmed this serialization and required cancellation/child reaping before root removal. Existing delayed-promise deadline fixtures alone do not establish live-child cleanup; a paused actual fixture child supplies the focused cancellation check. deadPid remains a synchronous assertion-bearing launch and is not claimed removed.",
    "The planted production-defect controls passed their detection checks in 33.929 s ending 2026-10-05T06:14:36.496Z. The harness live-owner mutation fails its unforced-release assertion. The integration mutation adds a second full stop and fails both real-generator release-line assertions plus the releaseLine case. The matrix truncation mutation is rejected by the real event-log order decoder or its child-status assertion in all eight cells. These initial controls and the successful intermediate review remain preserved; the final matrix variant must be checked again.",
    "Current Node.js subprocess cancellation documentation was read through find-docs and Context7 (/nodejs/node, official doc/api/child_process.md and lib/internal/child_process.js): AbortSignal reports AbortError, and close follows termination plus stream closure. The installed Node 26.9.0 build validates the actual API. No new dependency or production runtime feature is added.",
    "The first bounded async matrix check passed all eleven selected tests, ending 2026-10-05T06:23:58.428Z: all eight cells, the matrix parent, the real-child cancellation fixture and the existing synthetic deadline fixture. The matrix took 81.616 s against the earlier standalone 162.564 s; this one-case diagnostic is neither a five-run median nor an overall gate speedup.",
    "The principal reviewer found that killLockProcess could mistake cancellation or an output-bound failure for the intended SIGKILL after closure. The helper now rechecks the signal and recorded failure before accepting that kill, and checks failure while polling. The reviewer confirmed the source correction. The actual-child cancellation fixture proves reaping but does not directly exercise that wrapper's post-close rejection branch; final gate execution remains required.",
    "After the post-close helper correction, the build passed. The new declared lock-matrix-async defect repository retained the production log-truncation mutation; all eight cells rejected it with the real decoder's EVENT_ORDER diagnostic in 1.699 s, recorded 2026-10-05T06:29:28.877Z. defect-controls-async.json records that test source hash. The refreshed AST assertion inventory remains identical: harness 15, integration 215 and matrix 12 assertion expressions; unchanged assertDeadPid helper checks still execute in every matrix cell.",
    "The first async-source plain gate at f181c507d17f2b88388a8912ffb654d2749343acf4563ef7759caab6c7ae15f5 passed: driver 416.267 s, gate 415.605 s, no sampled foreign intervals. Skeleton took 228.841 s and integration 222.028 s; the matrix took 92.003 s inside the shared gate. The critical path was build, release preparation/cases, then integration. This is one observation, not the final median.",
    "The adversarial critic then identified a second stderr collector in owned killLockProcess: it accumulated beyond the owner's output threshold until closure, although the failure was correctly enforced. At the completed gate boundary the parent restricted the legacy collector to unowned children and used the bounded owned diagnostic for matrix errors. Build/formatting passed and the critic confirmed P3 closed. Preserve the f181 plain pass as supplemental and collect the final five plain and five review observations at the corrected source; this extra run was for a source repair, never for host isolation. defect-controls-async-diagnostic.json preserves another actual all-eight-cell production-defect rejection at the final helper's source hash."
  ],
  "rationale": "D001's mission and eight-trap comparisons apply. The first concurrency change left 696 synchronous waits on one event loop, a measured cause inside the declared target case. Async child completion permits the already-authorized private cells to overlap without relaxing assertions or deadlines. NoOp leaves that measured serial cost; increasing timeouts or accepting missing traces would defeat the order's correctness requirement.",
  "rejected": [
    { "option": "Treat concurrency four alone as a demonstrated repair", "reason": "The actual profile still spends 149.103 s in synchronous matrix child calls." },
    { "option": "Reject on cancellation without waiting for child closure", "reason": "A timed-out cell could remove its root while a child still writes." },
    { "option": "Change the production resident protocol or other test cases", "reason": "The measured serialization is in this matrix's orchestration; the bounded repair needs no broader change." }
  ],
  "reopenWhen": "The focused matrix run is not materially faster, a preserved assertion fails, the planted mutation is not caught, or cancellation leaves a live child."
}
```

## WO-186-D025 — Repair the browser fixture's concurrent readiness read

```json
{
  "id": "WO-186-D025",
  "date": "2026-10-05",
  "dispatch": "resume: next; fourth plain measurement failure",
  "decision": "Repair only the browser recovery fixture's readiness poll: a missing or incomplete progress document is not ready, and is retried within the unchanged ten-second deadline. Preserve every live-owner refusal, SIGKILL, browser/descendant cleanup and unrelated-process survival assertion. Add a deterministic partial-write readiness fixture and run the browser suite before resuming measurements.",
  "evidence": [
    "At code identity 6bcefed0fcdfc9bd83f47403d016b2ef58f1a5b2b763af117e604bf02f0e46ef, three final plain observations passed. The fourth took 420.269 s and failed only browser-evidence: scenario.test.mjs:648 threw SyntaxError, Unexpected end of JSON input, while parsing progress.json. The failed gate and all earlier passes remain retained; no observation is removed for host contention.",
    "New bounded input paths: packages/browser-evidence/test/scenario.test.mjs:624-721, src/index.ts:458-462, src/processes.ts:57-61, and fixtures/driver.mjs. The producer truncates then writes progress.json for every step; existence therefore precedes a complete readable document. Its ownership record processes.json already uses write-then-rename. The failing test conflates diagnostic-file existence with completed readiness.",
    "Adjacent queue revision 6 allocates adjacent-0002 with the diagnosed cause, this one test file, the concrete poll repair and the complete browser-suite check. The parent announced the scope and retains the existing production behavior, deadlines and process cleanup."
  ],
  "rationale": "D001's mission and eight-trap comparisons apply. A passing gate must judge recovery, not race a diagnostic write. Retry only the transient readiness observation while preserving the original finite deadline and outcome assertions. NoOp leaves an observed spurious failure; broad production artifact changes add scope without repairing a required product contract.",
  "rejected": [
    { "option": "Rerun until the existing poll happens to pass", "reason": "The stack and producer source identify a real partial-write window." },
    { "option": "Increase the readiness deadline or remove the recovery check", "reason": "The failure occurs while parsing a transient snapshot, not because the existing deadline is too short." },
    { "option": "Change production browser progress publication", "reason": "This fixture needs to wait for complete readiness; its test-only repair preserves the artifact and recovery contracts." }
  ],
  "reopenWhen": "The complete browser suite fails, persistent malformed progress can satisfy readiness, unrelated I/O errors are swallowed, or the process ownership assertions change."
}
```

## WO-186-D026 — Retain a qualified after-phase comparison across the independent test repair

```json
{
  "id": "WO-186-D026",
  "date": "2026-10-05",
  "dispatch": "resume: next; preserve chronological observations across the bounded browser readiness repair",
  "decision": "Amend only the executor measurement aggregation: retain the first three chronological successful plain observations at 6bcefed0fcdf, then take the next two successful forced-fresh plain observations after D025. Keep all five existing harness observations, whose source is unchanged. Collect all five review gates fresh at the corrected source. Do not backfill supplemental passes, replace slow passes, mix identities in a gate claim, or alter reuse/replay identity checks.",
  "evidence": [
    "D025 is implemented solely in packages/browser-evidence/test/scenario.test.mjs. readProgressAction returns unreadiness only for ENOENT or SyntaxError; other filesystem errors propagate. The deterministic fixture exercises missing, empty and incomplete JSON on repeated polls, navigate and wait actions, and EISDIR. The recovery loop retains its ten-second deadline, 25-ms interval, process-record parsing and all ownership/recovery assertions. browser-readiness-repair-check.log: 2026-10-05T07:18:31.232Z to 07:18:47.684Z, bounded 16.452 s, 20 passing tests, no failure/cancellation/skip/todo. Adjacent item adjacent-0002 is complete.",
    "The same principal reviewer independently confirmed AC1/9 require five ordinary-use observations, not identical after hashes. This is a qualified after-phase median, not a five-run median of final source; the earlier three observations can determine the pooled median. Two final-source plain passes cannot establish the final-source median or prove the readiness patch cost negligible. The added deterministic fixture changes the browser suite workload. The reviewer subsequently confirmed the implemented source and found no remaining issue in this bounded repair, without running probes.",
    "Before subsequent gate timings, after-phase-method.json binds the exact earlier identity, repaired identity and chronological ordinals. Preserve the failed fourth plain observation (420.269 s), its partial-write SyntaxError and the bounded repair-check cost. A passing-only median excludes a real workflow failure and retry cost; report those separately.",
    "The five after harness observations at the earlier identity remain valid measurements of that unchanged subcase but are not relabeled final-source executions. Target assertion inventories, performance implementation, gate selection, scheduler, and five-before observations are unchanged. Same-identity requirements remain intact for all product gate claims, reuse and replay current-key filtering.",
    "The parent announced the method qualification, remaining five reviews and successful browser check in chat. Normal concurrent work remains allowed with sampled overlap retained and unknown activity unknown."
  ],
  "rationale": "D001 supplies the mission and all eight trap comparisons. Commons and shifting the burden favor preserving already-run representative observations instead of buying an identical-hash label with three duplicate seven-minute gates. Rule beating and drift are constrained by chronological selection, retained failures and an explicit weaker claim. Naive Interventionism favors a test-only readiness repair. NoOp leaves an observed spurious recovery failure; restarting the entire after series measures more work without a criterion requiring it.",
  "rejected": [
    {
      "option": "Silently call the pooled result a final-source median",
      "reason": "Three of five plain observations precede the browser test repair, and its added test changes the workload."
    },
    {
      "option": "Restart all five plain and harness observations",
      "reason": "An identical-hash after cohort was executor-chosen, not an acceptance requirement; the independent reviewer accepts a clearly qualified phase comparison."
    },
    {
      "option": "Substitute an older faster supplemental pass or omit the failed fourth",
      "reason": "That would obscure chronological selection and real workflow cost."
    }
  ],
  "reopenWhen": "The repair changes production/performance source, target assertions, scheduler or selection; another source change occurs; or a required observation is missing, reused, incomplete or failed."
}
```

## WO-186-D027 — Validate measurement provenance and retain actual profile limits

```json
{
  "id": "WO-186-D027",
  "date": "2026-10-05",
  "dispatch": "resume: next; measurement artifact adversarial review",
  "decision": "Validate every selected after observation against its actual gate identity, complete fresh coverage and selection before publishing the pooled comparison. Report passing wall, failed attempt, browser repair check and successful retry separately without double counting. Capture the remaining full case profile from the first required current-source review, retaining the fifth plain pass whose attempted logger produced no event file.",
  "evidence": [
    "All five chronological after-phase plain passes are now retained: 422.027, 419.784, 417.997, 424.980 and 425.207 s. Their pooled median is 422.027 s versus 495.605 s before, 14.8% lower. Skeleton task median is 229.754 s versus 355.779 s; integration is 226.064 s versus 307.349 s. D026 source/workload qualifications remain; these are not an overall measured work-order saving.",
    "The adversarial critic found no actual false timing row, but found the aggregator trusted each series file identity without independently checking every row. validateAfterRun now rejects stale identities, incomplete or partial gates, composed modes, wrong plain/review selection, reused/failed tasks and missing coverage. The bounded artifact check passed seven mutated-row rejections and all ten retained harness/plain observations in 0.170 s, ending 2026-10-05T07:40:44.505Z; measurement-artifact-check.log retains it.",
    "The fourth original plain attempt failed in 420.269 s. The full browser repair check cost 16.452 s. The successful post-repair retry cost 424.980 s and is already one of the five passing plain observations, not a second additive overhead charge. Other failed/intermediate runs remain named evidence; analysis, documentation and unmeasured waiting are not invented totals.",
    "The measurement-only reporter-stdout preload in plain ordinal 5 produced no case-event file, so it establishes no profile. Preserve that attempted source in capture-final-cases-stdout-attempt.mjs and the passing gate at its actual timing. The revised capture-final-cases.mjs attaches to spawned child stdout only in the top-level gate runner, removes its own inherited preload and leaves stdout forwarding unchanged. The bounded check captured one split real-child event with identical stdout and no inherited observer. Actual capture in the required review remains to be checked.",
    "New public implementation inputs: Node.js official doc/api/esm.md, doc/api/child_process.md and doc/api/cli.md, retrieved through Context7 after library resolution. syncBuiltinESMExports updates the named spawn export after the preload installs its wrapper. No production source, dependency, command, scheduler, assertion or timeout changes.",
    "The full profile will name its current-source review row, task durations, assertion-bearing cases and concurrent tasks. Review selection is larger than plain selection, so its case profile is not relabeled as a plain-gate profile. No extra plain or standalone long-suite run is introduced for this diagnostic."
  ],
  "rationale": "D001 mission and trap comparisons apply. Commons favors collecting the profile during an already-required execution. Drift and rule beating require row-level provenance checks and honest failed-attempt costs rather than relying on a passing wrapper or selected target tasks. Shifting the burden is addressed by a reproducible capture artifact and explicit limits. NoOp leaves a concrete adversarial validation gap and a missing current profile.",
  "rejected": [
    {
      "option": "Rerun the passing fifth plain gate for instrumentation alone",
      "reason": "Its timing is valid; the five required reviews can supply current-source assertion profiles with their workload difference disclosed."
    },
    {
      "option": "Treat absent capture output as a successful profile",
      "reason": "No event file was produced, regardless of the gate pass."
    },
    {
      "option": "Add the successful retry twice to total cost",
      "reason": "It is already included in the passing comparison wall."
    }
  ],
  "reopenWhen": "A row fails strict aggregation, the required review does not capture all target cases, current-source profiles cannot explain threshold overruns, or review/whole-workflow costs invalidate a proposed benefit claim."
}
```

## WO-186-D028 — Make the detached-child fixture establish its actual readiness

```json
{
  "id": "WO-186-D028",
  "date": "2026-10-05",
  "dispatch": "resume: next; third review measurement failure",
  "decision": "Repair only the detached-descendant fixture in scripts/test-host-guard.test.mjs: register a dedicated idle owner, observe that owner alone, then let it spawn exactly the intermediate and grandchild. Require that three-process tree before detaching the grandchild. Preserve the duplicate retirement, ownership transfer, memory incident and finite stopping assertions; retain failure diagnostics. No production host guard, scheduling or memory budget changes.",
  "evidence": [
    "At af229ba815ff, the first two required reviews passed in 831.249 and 826.616 s. The third failed after 815.174 s (gate 813.955 s), only in runner-fixtures: test-host-guard.test.mjs:676, transferred ownership stops the detached descendant. The batch stopped and every observation remains retained. The failing fixture removed its diagnostic files during cleanup, so the exact historical cause is unknown.",
    "New bounded inputs: scripts/test-host-guard.test.mjs:589-694 and its guardMetrics helper; scripts/host-guard.mjs transfer/history and metric collection; scripts/lib/host-resources.mjs ownership, registration and census; scripts/lib/host-guard-state.mjs private guard startup. trackedProcesses sums ownership-history sizes; it does not identify the target grandchild. Registering the test worker lets its unrelated census helpers satisfy the count. Source review found no demonstrated defect in the production transfer, which copies PID/birth history and both unique-ID sets before retirement.",
    "A scratch diagnostic of the unchanged case passed in 0.869 s, ending 2026-10-05T08:29:22.758Z. That success does not clear the failed review. A controlled scratch reproduction starts unrelated children, pauses only its disposable private guard before creating the target, allows the original scalar readiness to accept the earlier count, and resumes before pruning. It failed the same final ownership assertion in 3.605 s, ending 2026-10-05T08:31:16.985Z: the target remained alive, no incident was recorded, and metrics still reported three processes. This proves a readiness hole, not that this was the earlier failure's cause. A native census already in flight at the pause is a control limitation, so no universal deterministic scheduling claim is made.",
    "The existing principal critic independently confirmed the aggregate-readiness hole and recommended observing a dedicated idle owner alone before it creates exactly the two intended descendants. Seeding ownership records or increasing the stop timeout would avoid establishing the precondition the test claims. Adjacent queue revision 14 starts adjacent-0003 after the announced bounded scope and actor-attested check-in; normal parallel work remains allowed."
  ],
  "rationale": "D001's mission and eight-trap comparisons apply. Drift and rule beating require proving the test's stated precondition without weakening the ownership assertion. Commons favors a bounded fixture repair over repeated full review retries. Shifting the burden is addressed by preserving diagnostics on failure. Naive Interventionism confines the repair to test setup; NoOp leaves a reproduced readiness hole and an unexplained failed acceptance gate. Production ownership or timeout changes are unsupported by the observed evidence.",
  "rejected": [
    { "option": "Repeat the full review until it passes", "reason": "The controlled reproduction establishes an actual readiness hole." },
    { "option": "Increase the stopping deadline or seed the grandchild as already owned", "reason": "Neither establishes that the guard observed the descendant before reparenting, as this test requires." },
    { "option": "Change production ownership transfer", "reason": "Source inspection shows its history transfer intact; the available evidence does not demonstrate a production defect." }
  ],
  "reopenWhen": "The corrected full host-guard suite fails, the three-process readiness can be satisfied by unrelated work, the memory/ownership assertions weaken, or a further review fails this case with diagnostics identifying a production defect."
}
```

## WO-186-D029 — Preserve qualified phase comparisons after the host-fixture repair

```json
{
  "id": "WO-186-D029",
  "date": "2026-10-05",
  "dispatch": "resume: next; preserve chronological measurements across independent fixture repair",
  "decision": "Retain the two chronological successful reviews at af229ba815ff and take the next three successful forced-fresh reviews at the corrected host-fixture source. Keep all five existing plain and harness observations. Report qualified after-phase medians, actual per-gate identities and failed/check/retry costs. Do not restart passing cohorts solely for source-hash labeling or weaken any claim/reuse/replay identity check.",
  "evidence": [
    "D028 now registers an idle dedicated owner and observes one process before it creates exactly the intermediate and grandchild. A newer exact-three census establishes readiness. Atomic fixture PID/exit publication avoids partial snapshots. The same owner anchors the survivor; allocation, budget, reparenting, retirement, stopping and incident assertions remain.",
    "The two requested critics found bounded cleanup issues in the first repair. Owned cleanup now runs through f.cleanups before root removal, captures the attached tree and recorded detached identities, kills only those owned members, and awaits owner closure. Identities are captured before readiness assertions. The new owner fallback is thirty seconds to cover allowed setup; original child fallbacks and the asserted stopping loop are unchanged.",
    "host-readiness-checks.json records the final full suite: all 34 tests passed in 61.894 s, ending 2026-10-05T08:43:30.052Z. The final production transfer-suppression control fails at the intended ownership assertion in 3.727 s. The forced-readiness-failure control confirms all three captured processes stopped and the owner closed while the fixture root still exists, in 0.711 s. All earlier diagnostics/checks and the failed 815.174-second review remain retained.",
    "host-readiness-source-delta.json proves the current whole code identity differs from the profiled af229 identity only by scripts/test-host-guard.test.mjs: substituting that one old file read in a disposable process reproduces the old identity exactly. No repository bytes or gate record are restored or changed by that check. Performance, target assertions, reporter, scheduler and selection remain unchanged.",
    "Both critics independently accept a qualified two-plus-three after-phase review median. Its first two observations precede added fixture work; no negligible-cost claim is made. The original method is preserved as after-phase-method-d026.json, and the superseding method is fixed before subsequent review timings. The earlier case profile keeps its actual old whole-code key and the source-delta proof; it is not relabeled final-source. Replay weights use only complete fresh rows at the current key, with the three required current-source reviews supplying the sample, never old-key rows.",
    "Adjacent item adjacent-0003 is complete at queue revision 15. Normal parallel work remains permitted; no passing observation is discarded for overlap, no quiet-host requirement is introduced, and unknown host activity remains unknown."
  ],
  "rationale": "D001 mission and all eight trap comparisons apply. Commons and shifting the burden favor keeping already-run observations instead of repeating two fourteen-minute reviews and five seven-minute plain gates solely for an identical-hash label. Drift and rule beating require explicit weaker phase comparisons, retained failures, source-delta proof and unchanged exact-identity gate judgments. Naive Interventionism confines the correction to a reproduced fixture-readiness hole. NoOp leaves that hole; pretending a pooled median is a final-source measurement would misstate the evidence.",
  "rejected": [
    {
      "option": "Restart all plain, harness and review series",
      "reason": "The acceptance requirement is five ordinary-use before/after observations; the repaired review-only fixture does not change the target performance source. The qualified method preserves chronology and exposes differing source work."
    },
    {
      "option": "Claim all five reviews or the case profile used final source",
      "reason": "Two successful reviews and the required profile precede this independent fixture repair."
    },
    {
      "option": "Use the old-key reviews in current-key reuse or replay weights",
      "reason": "Pooling a descriptive phase comparison grants no cross-identity gate or reuse authority."
    }
  ],
  "reopenWhen": "Another source repair changes performance, target assertions, scheduler or selection; a required current-source review fails; the source delta no longer matches; or strict row aggregation detects incomplete, reused or mismatched evidence."
}
```

## WO-186-D030 — Record the measured outcome and remaining cost questions

```json
{
  "id": "WO-186-D030",
  "date": "2026-10-05",
  "dispatch": "resume: next; measured outcome and implementation handoff",
  "decision": "Hand off the bounded implementation with the measured phase comparisons, preserved failure detection, explicit cost overruns and no claim of total work-order savings. Keep unresolved cold-gate and actual harness-suite cost questions open at close, while settling the implemented correctness/reuse input repairs through the named register dispositions.",
  "evidence": [
    "Five before/after ordinary-host observations give plain medians 495.605 -> 422.027 s and review medians 506.452 -> 814.813 s. D026/D029 qualify both after-phase comparisons across independent fixture repairs. All passing observations remain chronological, and all three final-source review rows are complete and forced fresh. Different review selections and unknown host work limit causal attribution.",
    "costs.md reconciles every Cost-line item. The harness subcase was already 1.924 s, disproving a 180-second saving. Skeleton/integration remain above 200/150 s; the retained case profile supplies assertion-bearing matrix, polling, repeated recovery and all 21 integration cases. host-readiness-source-delta.json proves the profiled target source is unchanged despite its older whole-code key. Overlapping case/task times are not summed into a benefit.",
    "The passing benchmark observations total 5389.651 s before and 6207.764 s after, with unequal review selections. After-phase failed gates add 1235.443 s; browser and host-fixture diagnosis/control/repair checks are separate. Intermediate passes, the outer timeout and the stopped invocation remain retained. Real implementation, documentation and waiting are not offset by hypothetical future reuse.",
    "replay-affected.mjs and replay.json retain 30 closed orders, 30 attributable boundaries and a median affected task-time share of 100.00%. Weights use 3 complete passing rows at the final identity, with current-source fresh review executions supplying medians. The current graph, unnormalized version literals, dynamic/native-read limits and possible sibling changes make this incomparable with the earlier normalized planning estimate; no task-input cache is installed.",
    "The requested adversarial and principal critics were reused with no descendants and one writer. Their concrete source findings were repaired and their limits are preserved in implementation-reviews.json. All three adjacent items are complete. The final host suite passed 34/34 and the final transfer/cleanup controls establish the test repair without claiming the lost historical failure diagnostics identify its cause.",
    "Product 07 Discipline, README test/refusal text, both generated role roots and immutable evidence editions carry the implemented behavior. close-register.md preserves allocations until close, returns FUP-331423b3559f5cfa and the above-360-second FUP-e96221b106cd136a question to planning, and provides canonical dispositions for every provenance row. Component and publication controls remain as staged; final release preparation, metadata/index/publication checks and inline document-gate execution provide their own observed results."
  ],
  "rationale": "Mission outcome: plain-gate and target-task observations improve, but a verified overall elapsed work-order improvement is not established. Policy resistance keeps publication, ownership and fresh document/review checks. Commons retains ordinary concurrent work and completed observations. Drift/rule beating are constrained by exact-identity claims, unchanged assertion inventories and failed controls. Escalation adds no task-input memo or dependency. Success to the successful does not justify further runner layers on sunk cost. Shifting the burden is addressed by visible case/growth evidence and explicit remaining-cost register items. Seeking the wrong goal forbids equating a faster plain median or reused-task count with overall savings. Naive Interventionism confines repairs to demonstrated causes and test preconditions. NoOp at this point would leave the authorized deliverable and its measured limitations unrecorded; more duplicate measurements are not required by the criteria.",
  "rejected": [
    {
      "option": "Claim a verified overall speedup from the lower plain median",
      "reason": "The full review selects additional machinery, document assertions move gates, and failed/check/session work remains real cost."
    },
    {
      "option": "Claim the missed suite targets are achieved",
      "reason": "Their medians exceed the numeric targets; criterion 1 explicitly permits an assertion-bearing remaining-time record, which is supplied."
    },
    {
      "option": "Settle all cost follow-ups at close",
      "reason": "The harness-case premise was disproved and the plain median still exceeds the existing 360-second reopening condition."
    }
  ],
  "reopenWhen": "Independent verification finds a criterion unsupported, a fresh same-code result contradicts reused evidence, the remaining profiles do not explain an overrun, or normal-workflow measurements establish a different overall cost conclusion."
}
```

## WO-186-D031 — Verification: fail on criterion 3; eight findings to the repair

```json
{
  "id": "WO-186-D031",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on criterion 3 alone (F1). A plain npm test that reuses the build task's pass leaves its fresh tasks running against whatever ignored build output is on disk, which can come from another code identity. The composed row then records a complete pass at an identity where a fresh run of that task fails, the completion claim check accepts it, and later plain runs keep reusing that pass after a forced-fresh run at the same identity has failed. The other ten criteria are met. Eight further findings inside the order's declared surfaces go to the repair's Adjacent Repair: R1, the heartbeat cannot name a running synchronous node:test case and can name a finished one (D009's reopening condition); R2, the product read guard does not flag recursive enumeration from the repository root or an ancestor; R3, copy reads of excluded tracked inputs are judged for records only, so product 07's 'Product tasks reject observed reads of excluded tracked inputs' overclaims and the proposed settlement of FUP-b28b870422a74166 already meets its own reopening condition; R4, the document gate's rise from a 38.99 s to a 62.1-67.5 s median is never set beside its before figure, and FUP-fb8cbeabbddef397's carry-in figure is stale; R5, the plain-gate growth of the release tasks (summed median 354.3 to 423.6 s) and worktree (100.5 to 119.0 s) is not reconciled; R6, the decisions never state the harness case's after median (1.758 s); R7, README's refusal sentence omits 'at the default document roots'; R8, the main-checkout lookup's realpathSync sits outside its fallback.",
  "evidence": [
    "F1 on the real table: a scratch clone of HEAD 2816c773 plus this worktree's diff and untracked code ran the real build (scripts/build.mjs) and kernel (packages/kernel/dist/test/*.test.js) tasks with one planted untracked test value. Plain at A: kernel fails, exit 1. Plain at B: exit 0, dist built from B. Source returned to A (identity equal, dist still B). Plain at A: mode composed, build reused, kernel fresh and passing, exit 0; requireGateClaims accepts it with no advisory. --again at A: kernel fails. A further plain run at A: mode reused, exit 0, claim still accepted. The verifier's own run of a synthetic three-task probe gave the same sequence (composed exit 0 at bc4539c0b4fa; --again exit 1).",
    "F1 source: test-runner.mjs:1798-1817 puts the build row in the reuse inventory and test-runner.mjs:1466 skips a reused build; gate-reuse.mjs:57-137 excludes nothing for build output and takes a pass from any candidate row whatever later executions at the identity showed; gateCodeIdentity covers no ignored dist (gate-evidence.mjs:714-726); scripts/build.mjs writes no identity stamp. D006 records missing build artifacts, which fail safely, not stale ones, which pass falsely. Everyday rebuilds at another identity include npm run test:docs, npm run harness, npm run dotln and any gate there; returns to the earlier identity include reverting an edit or restoring a checkpoint. The reviewer's --review and --again always run fresh.",
    "R1: a bounded run of executeSuite by this verification's checker on an async 50 ms case followed by two 35 s spawnSync cases printed '[30.0s] running case: async first' (that case ended at 0.05 s) and '[60.0s] running case: hb (task; no active subcase report)'; every later event arrived at 70.2 s. The executor's final-source review logs show harness-fixtures heartbeats unnamed for about 150 s after the WO-039 case in each review, and process-debt unnamed from 30 to 90 s. The only case-report fixture (test-runner.test.mjs:3408-3468) uses async cases. handoff.md says execution-ordered events expose currently running cases.",
    "R2: product-read-guard.mjs:208-217 judges readdir and opendir only when a record root starts with the read path plus '/', and skips paths outside the root, so the root and its ancestors are never judged. A scratch readdirSync('.', {recursive: true}) listed record entries with 0 excluded-read events; readdirSync('docs', {recursive: true}) was flagged. No current product task enumerates recursively from the root.",
    "R3: product-read-guard.mjs:316-329 copy wrappers call observe(method, source, true). A scratch fs.copyFileSync of a tracked docs file gave 0 events; readFileSync of the same file gave 2. license-fixtures, a product task, copies docs/LEGAL.md through test-license-fixture.mjs:18-19, and its cases depend on the pin text (test-license-surfaces.mjs:165-178). Product 07 (07-execution-guide.md:2027) broadens HEAD's 'Product package tasks reject observed reads of excluded tracked inputs' to every product task. close-register.md proposes settling FUP-b28b870422a74166 with the reopening condition 'a product script suite reads an excluded input without invalidating or rejecting reuse'. A LEGAL pin edit still fails the always-fresh document gate, so the practical false-green risk is low.",
    "R4: main's passing npm run test:docs rows since 2026-10-01 number 140, median 38.99 s, 24 tasks. This worktree's three passing rows took 67.5, 62.1 and 66.7 s over 29 tasks; the moved resume suite (median 54.9 s in main's plain rows) now ends the document critical path. costs.md:83 says the document gate's measured cost must remain beside product results but gives only 67.538 s; the order's carry-in keeps 38 s for FUP-fb8cbeabbddef397.",
    "R5: from measurements.json, the summed release:* durations per plain gate have a before median of 354.3 s and an after median of 423.6 s (51 tasks in both); worktree goes from 100.5 to 119.0 s. costs.md:128 names the release chain as the after plain gate's critical path without this growth. The guard now applies to every product task (test-runner.mjs:924), a plausible but unestablished cause.",
    "R6 to R8: grep finds 1.758 in costs.md and measurements.json but not in decisions.md. README.md's new refusal sentence omits the default-roots qualifier that CLAUDE.md, the role roots and product 07 carry and gateRecordPath enforces. gate-reuse.mjs:44-51 guards mainWorktree() but not realpathSync(main), so a registered main worktree whose directory is gone throws, and the unchanged claim check (handoff-ledger.mjs:233-257) reports that as an advisory; R8 cannot arise while main is the primary checkout.",
    "Criteria 1, 2 and 4 to 11: every median recomputed from measurements.json and the gate index; assertion inventories 15/15, 12/12 and 215/215; the harness and matrix planted defects caught again in scratch; second-shell composition, main-row lookup and merge-base selection reproduced in scratch against HEAD's and this runner; 33 adversarial record paths with no over-admission; npm run plan -- conditions and npm run publication:check run; the replay re-run byte-identical. The executor's npm test -- --review row at code identity 8f77f8bb26e21f212f2f7ffa1a9a098aaaa4a71f9c9d1184539c40f00618ee99 passed fresh (86 tasks, 0 reused), and this verification's npm run test:docs passed 29 of 29 at 2026-10-05T13:45:05.658Z."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order's objective is less waiting with correctness preserved. Reuse is what lets a role skip work, and the verifier consumes the executor's row at a matching identity, so a composed row that reports a pass its identity does not have weakens independent verification itself. F1 is narrow to reach but sits on that path; the R findings are bounded and inside surfaces this order already edits.",
    "traps": "Rule beating weighs against passing criterion 3 on its literal second-process fixture when the row it describes is false on a reachable path. Seeking the wrong goal weighs against counting skipped tasks as savings without a correct result. Shifting the burden weighs against leaving the reviewer's full run as the only guard against a false green that a handoff or verification would otherwise consume. Escalation weighs against failing criteria 2, 7, 9 or 10 on R1 to R7, whose clauses each hold. Drift to low performance is answered by executed reproductions on the real build and kernel suite. The commons favours one repair batch over several cycles. Policy resistance and success to the successful are unchanged by the verdict.",
    "naiveInterventionism": "The verifier edits no subject source. Reproductions ran in session scratch against the worktree's modules and a scratch clone.",
    "noOp": "Passing would file a claim that composed rows are complete at their identity while a reachable sequence makes them false, and would leave the R1 and R3 overclaims in the record."
  },
  "rejected": [
    {
      "option": "Judge criterion 3 met on its literal fixture and second-shell proof",
      "reason": "The order defines a complete row as one where every selected task has a passing result at that identity. The real-table reproduction records such a row, accepted by the claim check, at an identity where the task fails."
    },
    {
      "option": "Treat F1 as receipt 038's accepted environment limit",
      "reason": "Receipt 038 concerns runtime and host state outside the identity. This output is made by the gate's own build task, which only this order lets a fresh task depend on without running it, and receipt 038 names the resulting situation as its reopening condition."
    },
    {
      "option": "Fail criterion 2 on R1",
      "reason": "Criterion 2 requires the row's five slowest cases and integration's per-case reports, and both hold. The heartbeat is a Design bullet, so R1 goes to Adjacent Repair."
    },
    {
      "option": "Board R1 to R8 to a later order",
      "reason": "Each sits in a surface this order edits (test-runner.mjs, product-read-guard.mjs, gate-reuse.mjs, product 07, README, costs.md, close-register.md, decisions.md), so product 07's Adjacent Repair rule keeps them in this order."
    },
    {
      "option": "Repair during verification",
      "reason": "The verifier does not edit the subject it judges."
    }
  ],
  "followup": "WO-186 resume: fix. (F1) A composed plain npm test row at code identity X records a task as passing only when that pass, fresh or reused, ran against inputs made at X. Reuse the build task's pass only when the on-disk build output is attested to X, for example by a stamp the build writes and the runner checks; otherwise run the build fresh. A task's latest executed result at X decides reuse, so a later failed, stopped or timed-out run at X is never masked by an older pass. One fixture records a failed row at A, builds at B, returns to A and shows the plain run rebuilds rather than composing a pass; another shows that a forced-fresh failure at A followed by a plain run at A runs that task. Record the stale-output case beside D006. Otherwise the operator waives criterion 3 with npm run resume -- waive 3, naming their words. (R1) The heartbeat never names a finished case as running; while a node:test case has run for 15 s or more it names that case, or the decisions and handoff state that synchronous cases cannot be named live; a runner fixture covers a synchronous case after an async one. (R2) A recursive readdir or opendir (sync, callback or promise) from the repository root or an ancestor that would list an active-order record records an excluded read, with a fixture per form. (R3) Either judge copy-source reads of excluded tracked inputs like content reads and route each affected product suite's input, or state the copy and shell exemption in product 07 and the decisions, name license-fixtures, release and worktree as readers, and keep FUP-b28b870422a74166 open instead of settling it. (R4) Record the document gate's before and after medians with sources beside the plain and review comparison, with its structural cause and per-order effect, and give FUP-fb8cbeabbddef397's figure at close. (R5) costs.md names the release and worktree task growth and attributes it with evidence or marks the cause unknown. (R6) The decisions state the harness case's after median. (R7) README's refusal sentence carries 'at the default document roots'. (R8) A main checkout that cannot be resolved leaves the lookup with local rows only. Checks: npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair or an operator waiver settles criterion 3; the repair changes reuse, identity or admission behaviour that criteria 4 to 7 judge; or a fresh run at an identity fails a task that a composed row at that identity reported passing."
}
```

## WO-186-D032 — Board the stale refusal description in the harness security document

```json
{
  "id": "WO-186-D032",
  "date": "2026-10-05",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board the stale refusal description in docs/AI-HARNESS-SECURITY.md. Lines 264-266 still describe the second refusal as 'a write to gate inputs or the success record during a live npm test', without the product-gate admission of the active order's evidence, verification and final-review directories at the default document roots, or the retained refusal of document and mixed review gates. The file is hand-written, and criterion 10 names product 07, the generated five-refusals sentence and README, so it lies outside the order's criteria and declared surfaces.",
  "evidence": [
    "sed -n 264,266p docs/AI-HARNESS-SECURITY.md shows the old wording. CLAUDE.md, all twelve role skills and README.md carry the narrowed rule. git diff HEAD -- docs/AI-HARNESS-SECURITY.md is empty, and no generator in packages/ or scripts/ writes the file."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A posture document that misstates a refusal misleads a reader judging what a role may write during a gate; the fix is one sentence.",
    "traps": "Escalation weighs against failing criterion 10, whose named surfaces are updated. Shifting the burden weighs against leaving it as a report sentence. The other lenses are unchanged.",
    "naiveInterventionism": "The verifier edits no subject document.",
    "noOp": "Leaving it unrecorded keeps a stale description of a refusal this order changed."
  },
  "rejected": [
    {
      "option": "Fail criterion 10",
      "reason": "Criterion 10 names the generated sentence, product 07 and README, all of which are updated."
    },
    {
      "option": "Leave it as a report sentence",
      "reason": "A defect met and not fixed is recorded with a named follow-up."
    }
  ],
  "followup": "docs/AI-HARNESS-SECURITY.md's five-refusals description matches the generated sentence: during a live gate, writes to gate inputs or the success record are refused; a product gate admits only the active order's evidence, verification and final-review directories at the default document roots; document and mixed review gates keep the full refusal. Pointing to the generated sentence also settles it. The WO-186 repair may settle this as bounded adjacent cleanup; otherwise planning takes it. Check: npm run test:docs.",
  "reopenWhen": "The refusal changes again, or another hand-written posture document is found describing it."
}
```

## WO-186-D033 — Repair the read guard's root and ancestor walks; state the copy and shell boundary

```json
{
  "id": "WO-186-D033",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001 R2 and R3",
  "decision": "Repair R2 in the product read guard and settle R3 by stating the observed boundary. The guard now sees each call's options: at the repository root or an ancestor it records an own-record read when a listing or watch descends or the call is a copy, and leaves a plain listing there unjudged. It also observes openAsBlob as a content read; hard-link and rename sources, the three statfs forms, the native callback realpath and the promise watcher as record reads; an open with null flags as the read Node makes it; and a byte view or URL-shaped object as the path Node takes it for. Copy and link sources of excluded tracked inputs, shell commands and native tools stay outside the observed boundary. Product 07 states both sides and names the readers, the guard carries the same comment at its copy wrappers, and the close register returns FUP-b28b870422a74166 to open at close instead of settling it. Rule held: the Node fs forms the guard wraps record an excluded read when they name or read an active-order record from any directory: content reads and opens, blobs, readdir and opendir, stat, lstat, statfs, access, exists, readlink, realpath, fstat, watch and watchFile, copyFile, cp, link and rename, in their synchronous, callback and promise forms where Node has them. The written boundary states what is not judged and claims no form the guard does not wrap.",
  "evidence": [
    "Analyst probe for this repair (read-only agent, session scratch, Node v26.9.0, the worktree's guard on a scratch repository holding an untracked docs/evidence/WO-999/report.md): before the change the six recursive readdir and opendir forms (sync, callback, promise) gave 0 events at '.' and at '..' while listing the record; cpSync, cp and promises.cp from an ancestor gave 0; openAsBlob of the record and of a tracked docs file gave 0; linkSync from the record gave 0; a recursive watch on the root or on docs gave 0, and promises.watch was unwrapped. Glob forms were already flagged through the patched readdir calls. Two reviewers' probes then showed further forms with 0 events, each now observed: statfs on a record (revealing its presence), a recursive root listing given the path as a Uint8Array, an open with null flags followed by a read, a rename of the record out of its directory, and the native callback realpath, which the callback wrapper had also dropped from fs.realpath.",
    "Cause in source at the checkpoint: observe(method, value, recordsOnly) received no options; it skipped every path outside the root; the record test record.startsWith(path + '/') is false for the root's empty relative path, with only a root copy rescued.",
    "Fixture 'WO-186 VER-001 product tasks reject recursive listings, watches and copies from the root or an ancestor, and blob and link reads of records' in scripts/test-runner.test.mjs: the recursive script yields exactly twelve events (two targets by six forms); a control with the same calls without recursion, a plain watch, and a copied and a hard-linked excluded tracked input exits 0 with no event; the adjacent-forms script yields exactly fourteen events (three ancestor copies, three record links, three statfs forms, three renames, and blob reads of the record and of a tracked document); a watches script must include the root and docs watches and the ancestor promise watcher, judged by inclusion because Node walks the tree itself to watch recursively on some platforms; and a spellings script yields exactly four (a byte-view root listing, a URL-shaped record path, null open flags and the native callback realpath).",
    "Executed 2026-10-05T17:29:08Z: node --test scripts/test-runner.test.mjs under the bounded wrapper passed 72 of 72, this fixture and the two older guard fixtures among them. The same fixture run against the checkpoint's guard (refs/dotln/checkpoint/WO-186/5, byte-compared) in a scratch copy fails with expected exit 1, actual 0.",
    "No current reader found: the analyst's scan of 522 non-ignored code files found four recursive enumerations, none from the root or an ancestor inside a guarded product task (packages/skeleton/test/codex-episode.test.ts:79 on a temporary store; scripts/docs-check.mjs:467, a document task; scripts/test-helper-reuse.mjs:46 on temporary scratch; scripts/test-process-debt.mjs:9384, machinery). The executable check of that scan is the repair's review gate: npm test -- --review recorded 2026-10-05T17:27:45.668Z at code identity dea58b070d67cc37483fb0ceabb9d7fb55e46fda478169cae7e63554a255870a, exit 0, forced fresh, 86 tasks fresh and none carried, 36 suites, 899.49 s, code identity unchanged and buildOutputUnchanged true.",
    "R3 readers, checked in source by the executor: scripts/test-license-fixture.mjs:18-19 copies LICENSE, LICENSE-docs, NOTICE and docs/LEGAL.md with copyFileSync; it is imported by scripts/test-license-surfaces.mjs:20 (license-fixtures) and run by scripts/test-worktree.sh:53 (worktree) and scripts/test-release.sh:118, 649, 654, 700 and 721 (release). scripts/test-release.sh:97 copies docs/releases/tag-manifest.template.json and :596 copies docs/control/budgets.json with shell cp.",
    "Bounds of the written boundary, found by the reviewers. Stated in product 07: a listing of the root itself is judged only as a walk that could reach the active order's records, so excluded tracked inputs are protected by content reads and by listings of the directories below the root that hold them; and Node children or workers started without the inherited options (an eval worker, a child given an empty environment) are not judged. Stated here: Dir iteration is observed at its opendir call; a recursive listing of a directory that holds a symbolic link to the root or to a record directory is judged by the path it was given; presence probes through process.chdir, mkdir, utimes and chmod, process.loadEnvFile, process.binding and an options object that answers differently on each read are not wrapped. None of these occurs in a current product task by the reviewers' searches.",
    "Product 07 Discipline says which reads are rejected and that copy sources of excluded tracked inputs, shell commands and native tools are not judged, naming the three readers and their inputs. The publication check of the bytes that now stand is the publication task of the final document gate: npm run publication:check passed at 2026-10-05T17:04:55Z, after the last product 07 edit and lock refresh, and the document gate that follows the last record edit runs it again. The software-engineer edition's one claim linking Discipline is a topic list this wording does not change."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The admission that lets a role write its records during a product gate is safe only while no product task depends on those records. A walk from the root reached them unseen, so the check guarding criterion 7's admission had a hole; closing it keeps the waiting saved by that admission from costing correctness.",
    "traps": "Rule beating: the fixture covers every form at both targets and a non-recursive control, not only the form the report quoted. Seeking the wrong goal and drift to low performance: the product text now claims only what is observed, instead of a broader sentence the guard did not enforce. Shifting the burden: the open register row carries the copied inputs to planning by name rather than leaving them to a reviewer to rediscover. Escalation and policy resistance: no product task is moved or re-keyed in a repair, so no gate grows. Commons: one fixture of five small scripts, about two seconds. Success to the successful is unchanged.",
    "naiveInterventionism": "Plain listings of the root and its ancestors stay unjudged, because a record root is at least two levels down and product tasks list the root routinely. Dir iteration is not wrapped: the opendir call is its only entry. Copy sources of excluded inputs keep their existing treatment.",
    "noOp": "Leaving it would keep a false statement in product 07, settle a register row whose own reopening condition is already met, and leave six listing forms and three copy forms that read records unseen."
  },
  "rejected": [
    {
      "option": "Judge copy sources of excluded tracked inputs as content reads and key docs/LEGAL.md into the identity",
      "reason": "It fails license-fixtures, worktree, release:prepare and at least three release cases until docs/LEGAL.md is keyed, which changes what the identity covers (D007's routes, gate-evidence.mjs and three re-minted editions, and the fixture asserting that a LEGAL edit leaves the identity unchanged). The two shell copies in the release suite would stay unseen, so the row could not be settled anyway, and a LEGAL pin edit still fails the always-fresh document gate. Planning chooses the route per input."
    },
    {
      "option": "Record every listing of the root or an ancestor",
      "reason": "A plain listing there names no record, and product tasks list the root routinely; it would fail tasks with no dependency."
    },
    {
      "option": "Leave openAsBlob, hard links and watches to a later order",
      "reason": "They are the same class in the same file, found while probing R2, and each is a one-wrapper repair with a fixture."
    }
  ],
  "reopens": {
    "decisionId": "WO-186-D017",
    "observation": "VER-001 R2 and this repair's probes: recursive readdir and opendir from the root or an ancestor, an ancestor copy, openAsBlob, a hard link from a record, statfs and a recursive watch each reached an active-order record with no observation, inside supported Node forms."
  },
  "reopenWhen": "A product task is found using one of the unwrapped forms this decision lists, or a Node fs form it does not list reaches an active-order record or the content of an excluded tracked input with no observation; a product task legitimately needs a recursive walk from the root or an ancestor; or planning routes one of the named copied inputs."
}
```

## WO-186-D034 — Three bounded corrections: unresolvable main, README qualifier, security document

```json
{
  "id": "WO-186-D034",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001 R7, R8 and D032",
  "decision": "Settle R8, R7 and the boarded D032 in this repair. The passing-row lookup resolves the main checkout inside one guarded step, so a registered main whose directory cannot be resolved leaves the lookup with the worktree's own rows. README's refusal sentence carries 'at the default document roots'. docs/AI-HARNESS-SECURITY.md's second refusal now states the product-gate admission of the active order's record directories at the default document roots and the retained refusal of document and mixed review gates.",
  "evidence": [
    "R8 cause at the checkpoint: gateCandidates guarded mainWorktree() with a try but called realpathSync(main) after it, so a missing directory threw out of the lookup. Fixture 'WO-186 VER-001 an unresolvable main leaves the lookup with the worktree's own rows' checks out main in a linked worktree, removes that directory while Git still registers it, and asserts that gateCandidates, coveringTaskResults and coveringGateCheck answer from the worktree, that the claim check refuses for the absence of a passing row rather than reporting an unavailable index, and that a later plain run carries its own rows. Executed 2026-10-05T14:54:37Z: 1 of 1 passed; against the checkpoint's lookup in a scratch copy the same fixture fails.",
    "R7: grep -c 'at the default document roots' README.md returns 1 after the edit (lines 186-189).",
    "D032: grep -c 'at the default document roots' docs/AI-HARNESS-SECURITY.md returns 1 after the edit (lines 264-269). The file is hand-written and no generator writes it (D032's evidence)."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Each is a statement or fallback beside the order's own changes that would otherwise mislead a reader or turn a recoverable state into an advisory. None is on the gate's critical path.",
    "traps": "Shifting the burden weighs against boarding one-sentence corrections for planning. Escalation weighs against widening any of them: the lookup's reading errors still surface as before, and only resolution failure falls back. The other lenses are unchanged.",
    "naiveInterventionism": "No behaviour changes while main is the primary checkout. The two documents change one clause each, in place.",
    "noOp": "Leaving them keeps two refusal descriptions that omit a qualifier the code enforces and a lookup that throws in a state Git permits."
  },
  "rejected": [
    {
      "option": "Leave D032 for planning",
      "reason": "The verifier offered it to this repair as bounded adjacent cleanup; it is one clause in a hand-written document, checked by the document gate."
    },
    {
      "option": "Treat any error from reading main's index as an absent main",
      "reason": "A malformed index is evidence of a damaged record, which the runner already answers by running the selection; only an unresolvable checkout is equivalent to having no main."
    }
  ],
  "reopenWhen": "The refusal changes again, another hand-written document is found describing it, or a lookup fails for a main checkout that Git registers but the host cannot resolve."
}
```

## WO-186-D035 — Repair F1: the latest execution decides, and the build's pass travels only with the output it attested

```json
{
  "id": "WO-186-D035",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001 F1 (criterion 3)",
  "decision": "Repair F1 inside the existing identity and gate rows, with no new key and no new file. Rule held: a pass enters a composed row, or answers a completion claim, only when it is that task's latest recorded run at the identity, in a gate row that ended at the code identity it started with and whose build output still had its recorded digest when the gate ended; and a task runs beside a carried build only when the build output on disk is byte for byte the output that build's executing row published. Seven parts carry it. (1) coveringTaskResults takes, per task, the execution that finished last at the identity; a later failed or timed-out run, and a later failed gate that ran the task, displace an older pass. (2) A carried result is never itself evidence, and each one names the row that executed it, so a chain cites its source. (3) A passing build records a digest of its declared ignored outputs (packages/*/dist) on its result; the lookup carries the build's pass beside a running task only while the output on disk still has that digest, and otherwise the build runs first. A row in which no task runs consumes no output and builds nothing, which keeps criterion 5's fresh worktree from starting a suite. (4) At the end of a gate the output must still have the digest its build attested, or the row fails as it does for changed code and none of its passes is carried. (5) The completion's claim check accepts a complete row only while each task it names still has, as its latest run, that row's own result or a pass that may be carried. (6) A single-suite, machinery or confined-partial run keeps its row under its own check, which answers no claim and supplies no pass. When a task's latest such run did not pass and no gate execution finished after it, that failure is the task's latest run and displaces an older pass; when its latest such run passed, the gate execution decides as before. The document gate's rows neither supply nor displace: it follows document bytes the identity excludes and every completion judges it fresh. (7) The digest covers regular files only: a wildcard matches directories, a plain file beside them is not output, and there is no digest, so no attestation, for a row without an outputs declaration, for a declaration that matches no file, or for an output holding a link or special file. The worktree's own executions decide first; main's decide for a worktree with no row at the identity and re-validate a pass carried from main.",
  "evidence": [
    "Cause at the checkpoint, read in source: runGate put the build row in the reuse inventory and scheduleSuites skipped a carried build, so fresh tasks ran against whatever ignored dist was on disk; coveringTaskResults iterated rows in recorded order and let any pass overwrite the map while a failed result only skipped, so an older pass survived a later failure, and it accepted a carried entry as a pass.",
    "The report's two sequences, each a fixture through runGate on a real Git repository whose build publishes an ignored output from identity-covered source: 'a build output made at another identity is rebuilt before a task runs, so a returned-to identity keeps its failure' (fail at A, pass at B, return to A with B's output on disk: the plain run rebuilds, fails, and the claim check refuses) and 'a task's latest executed result decides' (a forced-fresh failure at A, then plain runs at A run that task, the claim is refused naming it, and the first green row stands again once the task's latest run passes).",
    "Cases the report did not quote, in nine further fixtures. Output: an output replaced by another writer and an output removed are rebuilt; a build row with no outputs declaration is never carried beside a task; an output rewritten by a task while the gate runs fails the row with buildOutputUnchanged false although every task passed and the code identity was unchanged, both when the build ran in that gate and when its pass was carried; a wildcard output beside an ignored plain file is attested and a failed task reruns alone; a build whose declared output cannot be attested may pass, records buildOutputAttested false and supplies nothing; an attested output is carried by another shell and session, and a linked worktree that has never been built builds before its task although main's build passed; the digest itself changes with bytes at an unchanged length, ignores a plain file beside the wildcard's directories, and refuses symbolic links and declarations that match nothing (a special file takes the same branch as a link and is not exercised). History: a later gate that failed for abandoned roots, a memory failure or changed identity displaces the older pass of every task it executed; the lookup refuses row-level stopped, timedOut and failureKind fields the same way, which the runner does not write for a gate today, so those three rows of the fixture are written by hand; one task's later timeout displaces that task alone; of two overlapping gates the run that finished later decides, whichever row was recorded last; a row holding only carried results supplies nothing; a failed single-suite run, a failed machinery run and a failed partial run each displace their task, a passing one supplies nothing, and once the suite passes again under such a run the review row stands again, while a failed document gate displaces nothing; a result with no finish time supplies nothing, a task that never started in a later row leaves its older pass carried, and a later row that repeats a name displaces what it names; a pass a worktree carried from main is refused once main's latest execution of that task fails, and has no execution to stand on while main cannot be consulted.",
    "Executed 2026-10-05T17:29:08Z: node --test scripts/test-runner.test.mjs under the bounded wrapper passed 72 of 72 in 49.6 s. The pre-existing criterion 3 fixture 'one failed task reruns alone in another shell and session' passes with its assertions unchanged; the repair gave the shared fixture's build row an empty outputs declaration, which says truthfully that this build publishes nothing a task consumes and is attested trivially. Executed 2026-10-05T17:29:21Z: the 14 'WO-186 VER-001' fixtures run against the checkpoint's gate-reuse, runner, read guard and claim check (byte-compared with refs/dotln/checkpoint/WO-186/5) in a scratch copy fail 14 of 14. The heartbeat fixture fails there because that runner has no short interval and no markers, not because it is caught naming a finished case; the analyst's 30 s reproduction shows that.",
    "Costs measured in this worktree before the repair's first gate (repair-measurements.json buildAndLookupCosts): the build task's median over 26 executed passing samples is 658 ms; hashing the 493 files and 4,286,222 bytes under packages/*/dist takes 10 to 16 ms; two builds of one scratch copy give the same digest over every file; gateCodeIdentity takes 89 ms; reading main's index (10,354 rows) takes 310 ms, paid only by a worktree with no row at the identity or one that carried a pass from main.",
    "Holes found by this repair's analyst and reviewers in intermediate states, each reproduced by them through runGate, then repaired and pinned by a fixture above: the claim check accepted the older green row after a later failure; a task that rewrote the output during a gate produced an exit 0 row at an identity whose honest gate fails; overlapping gates were ordered by row instead of by when the task finished; a plain file directly under packages/ (the main checkout has packages/.DS_Store) made the wildcard digest throw, which silently switched attestation off there; a declared output that matched no file, or was a symbolic link, was attested forever; a failed --only run recorded no row, so the next plain run carried the older pass with exit 0; and, once that was repaired, a failed run under another check displaced a review row's pass for good, so one document gate failing meta on a stale index would have forced a full review gate (nine task names run in both the document gate and the current review selection). The real build row's outputs declaration is pinned by a fixture, because every other fixture builds its own table.",
    "The analyst's inventory found one in-place writer of dist (scripts/build.mjs) and no gate task that rebuilds this repository's output; an overlapping document gate rebuilds byte-identical output at an unchanged identity. The release template needs no attestation: it is created per gate in a temporary directory, and with release:prepare carried a fresh release case builds its own repository (test-runner.mjs standaloneRelease). No product suite is a preflight for another.",
    "The repair's review gate ran every selected task fresh on the real table with the build's digest recorded and the end-of-gate check passing: npm test -- --review recorded 2026-10-05T17:27:45.668Z at code identity dea58b070d67cc37483fb0ceabb9d7fb55e46fda478169cae7e63554a255870a, exit 0, forced fresh, 86 tasks fresh and none carried, 36 suites, 899.49 s, code identity unchanged and buildOutputUnchanged true.",
    "Bounds that remain and are stated in product 07 or here. A gate stopped by request or signal records no row, so a failure printed before the stop displaces nothing. The output is compared once, at the end of the gate, with the digest its build recorded: a change undone before the end is not seen, as a code change undone before the end is not. A worktree's own older pass is not displaced by a later failure in main, because its own executions decide first; a pass it carried from main is. The lookup trusts row shapes this runner never writes only as far as their fields say; a result with no finish time supplies nothing."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Reuse is what lets a role skip work, and the verifier consumes the executor's row at a matching identity. A composed row that reports a pass its identity does not have weakens independent verification itself, so soundness of the row comes before the seconds reuse saves. The repair keeps the saving criterion 3 asks for: with the output attested, a rerun still runs the failed task alone.",
    "traps": "Rule beating: the repair closes the class (a pass tied to inputs or history it did not have), not the two quoted sequences; nine further fixtures cover cases the report did not quote, and three reviewers attacked the result. Seeking the wrong goal: a skipped task counts only when its pass is the latest recorded run against attested output. Shifting the burden: the reviewer's full run stays a backstop instead of the only guard, and the claim check no longer accepts a row a later run contradicted. Policy resistance and escalation: no new key, stamp file or cache; the digest rides on the row WO-173 already trusts, and scripts/build.mjs and the skeleton are untouched, so no edition is re-minted. Drift to low performance: the fixtures were run against the pre-repair code and fail there, and two reviewers' mutation runs drove the additions that pin the wildcard, the carried build's end-of-gate check, the real build row's declaration and four rules the comments state. Commons: the lookup adds about 10 ms of hashing; main's index is read only by worktrees that depend on it. Success to the successful is unchanged.",
    "naiveInterventionism": "The all-reused path is kept, because criterion 5 requires that a fresh worktree start no suite and such a row consumes no output. The skeleton's findGateCheck keeps its stated rule that a failed attempt does not erase a pass; D038 boards that difference instead of changing a second consumer and re-minting three editions inside a repair.",
    "noOp": "Leaving it files rows that are false at their identity on an everyday path (any rebuild at another identity followed by a return), accepted by the completion claim check and consumed by verification."
  },
  "rejected": [
    {
      "option": "Run the build whenever any task runs",
      "reason": "It is the simplest sound rule and costs 0.66 s, but criterion 3 says that at an identity where an earlier row passed all but one task, npm test runs that task alone, and the build is a task of the row. The digest keeps that true whenever the output is the attested one."
    },
    {
      "option": "A stamp file written by scripts/build.mjs with the code identity",
      "reason": "It adds a file and a second trust mechanism, makes the build compute the identity, edits a source registered in every evidence edition, and still misses an output changed by any other writer. A digest of the output itself on the trusted row needs no cooperation from the writer."
    },
    {
      "option": "Let only a failing result displace an older pass, keeping passes from a later failed gate",
      "reason": "A gate that failed for abandoned roots, a resource failure or changed code failed as a gate; carrying every task's older pass would record a complete green row immediately after it, which is the masking the finding names."
    },
    {
      "option": "Refuse a complete row once any later row at the identity failed",
      "reason": "After a flaky task is rerun and passes, the earlier review row would stay refused and force a full review gate. The claim check follows each task's latest run instead, so the row stands again."
    },
    {
      "option": "Leave the claim check on any complete passing row",
      "reason": "The report's reproduction ends with the claim accepted after a forced-fresh failure; a claim that names a gate must not be answered by a row the latest run contradicts."
    },
    {
      "option": "State that single-suite and machinery runs are outside the rule instead of recording their failures",
      "reason": "A failed npm test -- --only run at an identity is a later failed run of that task there; a reviewer's probe had the next plain run carry the older pass with exit 0 and the claim accepted. Keeping the failed run's row under its own check closes it without making such a run gate evidence."
    },
    {
      "option": "Let a failed document gate displace the tasks it shares with the review gate",
      "reason": "The completion checks the product claim before it runs the document gate inline, so a document-only failure, such as meta on a stale index, would refuse the next completion's review claim and force a full review gate although no code changed. The document gate is never reused and is judged fresh at every completion, so nothing is lost by leaving its rows out."
    },
    {
      "option": "Record a row for a gate stopped by request or signal",
      "reason": "A stopped gate records no check by contract, which the stop fixtures and the gate-outcome 'no-row' status rely on, and recording inside signal handling widens the window in which a second signal leaves the index's lock directory behind (by reading recordGateChecks, not executed). The bound is stated instead."
    },
    {
      "option": "Let a pass carried from main stand while main cannot be consulted",
      "reason": "It would make a carried result evidence in one state. Without main there is no execution to cite, so the tasks run once in the worktree, which then holds its own executions."
    },
    {
      "option": "Operator waiver of criterion 3",
      "reason": "The defect is repairable inside the order's declared surfaces; no waiver was requested or needed."
    }
  ],
  "reopens": {
    "decisionId": "WO-186-D006",
    "observation": "VER-001 F1: D006 recorded missing build output, which fails safely, and rejected repeating a passed build. Stale output passes falsely: with dist built at another identity, a carried build let a fresh task pass at an identity where it fails, and the composed row was claimable. The situation D006's reopening condition describes for a review was constructed with a forced-fresh plain run, from the gate's own build."
  },
  "reopenWhen": "A fresh run at an identity fails a task that a composed row at that identity reported passing; a gate task or tool is found that rewrites this repository's build output in place with different bytes, so honest gates fail the end-of-gate check; a stopped gate's unrecorded failure is found masked in practice; or another produced input that the identity excludes is found to be consumed by a carried task's successors."
}
```

## WO-186-D036 — Record the document gate's rise, the lane-peer growth and the harness case's after median

```json
{
  "id": "WO-186-D036",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001 R4, R5 and R6",
  "decision": "Record three measurements the first handoff left out or unreconciled, and book no saving from any of them. R4: the document gate's median rose from 38.993 s to 66.690 s after this order moved five suites into it, of which resume alone ends the critical path; at the order's count of seven document gates that is 193.9 s per order, set beside the measured 73.577 s reduction per fresh plain gate. R5: summed release task time per plain gate rose from 354.286 s to 423.640 s and the worktree task from 100.477 s to 118.962 s; the read guard explains about 2 s of one case, and the recorded rows place the step at the source that made the lock matrix concurrent, which is stated as an inference. R6: the harness case's median of five runs is 1.924 s before and 1.758 s after, so criterion 1's 10 s figure is met and D005's finding stands that no 180 s saving existed. The close register returns FUP-fb8cbeabbddef397 to open, because its 60 s reopening condition has occurred.",
  "evidence": [
    "R4 before, recomputed by the executor from the main checkout's gate index with repair-recompute.mjs: 171 npm run test:docs rows from 2026-10-01, 31 failed and excluded, 140 passing with 24 tasks each, first 2026-10-01T00:04:16.363Z, last 2026-10-04T16:23:39.155Z, median 38.993 s; the critical path ends in console-docs in 135 rows and in entropy in 5.",
    "R4 after, from this worktree's gate index: three passing rows at the pre-repair final identity 8f77f8bb26e2 with 29 tasks, 62.149 s (09:43:49.996Z), 66.690 s (13:45:05.658Z) and 67.380 s (14:36:45.417Z), median 66.690 s; an earlier-source pass took 67.538 s. resume takes 49.369 to 53.736 s in the four passing rows and ends the critical path in each. Change +27.697 s (+71.0%).",
    "R4 per order: 7 x 27.697 = 193.9 s, from the order's Observed gap count of seven document gates. The plain gate's measured change is 495.605 to 422.027 s, -73.577 s; three plain gates would be -220.7 s, so the document rise is 88% of that. The product is arithmetic on two medians from unequal samples (140 rows over four days on main against three rows on one tree), not a measured whole-order time, and the final review runs a different selection.",
    "R5 figures, recomputed by the executor from measurements.json's five before and five after plain gates matched to their rows by recordedAt: 51 release tasks in every gate; summed release task time median 354.286 s (350.826 to 380.836) before and 423.640 s (418.870 to 424.082) after; worktree 100.477 to 118.962 s; 42 release tasks grew and 9 shrank; runtime_refresh 19.790 to 37.359 s, material 81.952 to 91.415, concurrent 17.681 to 25.700 and success 18.293 to 23.414 carry 40.2 s.",
    "R5 controls in the same rows: kernel -1.6%, compiler -3.3%, console -4.6% and browser-evidence -0.3% (guarded before this order); build -6.3% (unguarded); target-publish 147.558 to 145.214 s (the task with the most observed processes: 561 to 564 distinct process ids per run in the retained read logs, ignored local files, by the analyst's count), portfolio -5.3%, derived-orders -6.9% and license-fixtures -8.4% (newly guarded). Neither 'everything was slower' nor 'newly guarded tasks grew' fits.",
    "R5 step, read by the executor from every recorded product gate (repair-measurements.json gateRows): the review row at 4c3632f07980 (06:12:03.262Z) carries product read logs on its release tasks, so the guard is already applied, with skeleton 327.342 s, release sum 375.496 s, runtime_refresh 21.551 s and worktree 102.915 s. The last three are inside the before range; skeleton is 20 s below it and still serialized. The next row, at f181c507d17f (06:37:38.504Z), has skeleton 228.841 s, release sum 418.705 s, runtime_refresh 35.417 s and worktree 119.088 s, and all twelve later rows stay between 411.763 and 424.082 s. D024 is the change between them.",
    "R5 experiment, by this repair's read-only analyst in bounded scratch copies (repair-measurements.json guardExperiment): release:case:runtime_refresh took 16.932, 16.215 and 15.726 s without the guard and 18.927, 18.501 and 17.371 s with it at the pre-repair identity, paired effect +1.995, +2.286 and +1.645 s, and 16.978, 16.668 and 16.710 s at HEAD; worktree took 94.469 and 89.896 s without and 93.511 and 94.002 s with, paired -0.958 and +4.106 s. Tasks ran alone, under a one-minute load average of 4.0 to 6.2 before each timed run.",
    "R5 overlap, by the same analyst and not recomputed by the executor: in review observation 1 (07:58:48.611Z), the one row with case timings, the lock matrix occupies seconds 43.5 to 134.8 of the skeleton task; the 13 release tasks overlapping it carry 60.694 s of that row's 65.870 s release growth (92.1%), and growth against seconds of overlap gives r = 0.938. The 36 release tasks ending before the window grew 4.690 s in sum, which is unexplained.",
    "R6: measurements.json before.summaries and after.summaries give the harness-case wall medians 1.924 and 1.758 s over five runs each; costs.md's table carries both.",
    "Two descriptions in earlier records are corrected here rather than edited: the order's carry-in calls the document gate untouched at 38 s with FUP-fb8cbeabbddef397 open, while this order changed the gate and the register holds the row as deferred; D031 calls 54.9 s resume's median in main's plain rows, and 54.872 s is its median over all 59 product rows from 2026-10-01 (the six plain rows give 49.650 s, by the analyst's recomputation)."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order's objective is less waiting with correctness kept. Its record claimed a plain-gate reduction without the document-gate rise that the same change caused, so a reader could not tell whether an order waits less. With both beside each other the answer is: about 27 s less per order if all three product gates were plain, by arithmetic, and unmeasured as a whole.",
    "traps": "Seeking the wrong goal and rule beating weigh against reporting only the gate that improved. Drift to low performance weighs against leaving a regression signal (a deferred row whose reopening condition has occurred) unrecorded. Shifting the burden weighs against leaving the growth for a reviewer to rediscover from the index. Escalation weighs against repairing lane packing or the suite routes inside a repair: the scheduling of the exclusive suites and the document gate's cost are non-goals of the order, and the routes are D007's decision. Commons, policy resistance and success to the successful are unchanged.",
    "naiveInterventionism": "No route, lane reservation or matrix concurrency is changed. The lock-matrix attribution is labelled an inference because no controlled run isolated it.",
    "noOp": "Leaving the record as it was keeps a one-sided comparison and lets the close settle nothing about a document gate that now exceeds its own reopening threshold."
  },
  "rejected": [
    {
      "option": "Move resume back to the product gate with its document inputs keyed",
      "reason": "It reverses D007's route for one of eight suites inside a repair, changes what the identity covers, and makes edits to those documents rerun the product gate. The measured rise goes to planning with the register row."
    },
    {
      "option": "Attribute the release and worktree growth to the read guard",
      "reason": "The paired runs give about 2 s on one case against 17.6 s in the gate, the guard-on row with the serialized matrix shows no growth, and target-publish, the newly guarded task with the most observed processes, shrank."
    },
    {
      "option": "State the lock-matrix cause as established and reduce the matrix's concurrency or reserve more lanes for it",
      "reason": "The evidence is one step between two rows and one row with case timings. The plain gate's wall time still fell by 73.577 s with the concurrent matrix, and lane packing is a planning question the reopened cold-gate row carries."
    },
    {
      "option": "Book the plain reduction as a per-order saving",
      "reason": "The document rise at seven gates is 88% of it by arithmetic, the final review runs another selection, and no whole-order time was measured."
    }
  ],
  "followup": "Planning weighs the document gate's 66.690 s median (FUP-fb8cbeabbddef397, returned to open at close) against the plain gate's reduction when it next routes document-reading suites, and judges with the reopened cold-gate row (FUP-e96221b106cd136a) whether the concurrent lock matrix should reserve more than one lane or run beside fewer peers; a controlled run with and without the matrix beside the release cases would establish or refute the inference. Checks: repair-recompute.mjs against the gate index, and the plain and document medians at the routes then in force.",
  "reopenWhen": "A controlled run separates the lock matrix's effect on its lane peers from other causes; the document gate's median moves by more than 10 s from 66.690 s; or a whole-order elapsed time is measured."
}
```

## WO-186-D037 — Repair R1: the heartbeat names a case from the test process's own synchronous markers

```json
{
  "id": "WO-186-D037",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001 R1",
  "decision": "Repair the heartbeat instead of narrowing its claim. executeSuite preloads scripts/lib/case-marker.mjs into node --test tasks; in each test file process's main thread it writes a case's start and end synchronously from Node's node.test tracing channel to a file private to the task, through a descriptor, a write function and a clock taken before any test runs, so a test that mocks or counts fs calls or timers neither loses nor sees a marker. The heartbeat folds that file: on each tick it names every case that has run for the interval and was not named within it, on as many lines as the names need; it drops the cases of a process that is gone; and a quiet task says which case is open, whatever its age, or that none is. Reporter dequeue and complete events keep supplying case durations only. The interval is a row field that a declared table may not carry, so a gate always uses 15 s and ticks every 5 s. Rule held: the heartbeat names a case only between that case's own start and end markers, so never after it ended; and every node:test case that has run for the interval is named, whether it runs alone, under an open parent, beside concurrent siblings or in another test file's process.",
  "evidence": [
    "Cause, reproduced by this repair's analyst with the checkpoint's executeSuite on a 50 ms async case followed by synchronous cases: '[30.0s] running case: async first' printed 30 s after that case ended. In the test file process node:test queues the dequeue event and calls the body without yielding, so a synchronous case's start leaves the process only after the case ends, and the previous case's end can still be queued. Reporter events therefore cannot say what is running. 87 of 102 top-level cases in scripts/test-harness.mjs and 64 of 119 in scripts/test-process-debt.mjs have synchronous callbacks by the analyst's scan, which explains the unnamed stretches in the two exclusive suites.",
    "Executor's probe of the tracing channel on Node v26.9.0: tracing:node.test:start is published before the body and tracing:node.test:end when the case completes, for async (start 2 ms, end 303 ms for a 300 ms wait), synchronous, nested, concurrent and failing cases; suites and the file's root publish too and are not named.",
    "Fixture 'WO-186 VER-001 the heartbeat names a synchronous case while it runs, after an async one, and never a finished case' in scripts/test-runner.test.mjs runs two test files in one task: an async 50 ms case, a case that blocks the event loop for 1.2 s, a subtest that blocks for 1.2 s under its open parent, and in the second file's process another blocking case, each recording its own window. The first file also holds a case that ends with fs.writeFileSync still mocked, a case that outlives a worker thread it started, and a parent with four concurrent children whose names are longer than a heartbeat line; a second run kills one test process inside a case while another file's case keeps running. With a 300 ms interval every one of these cases is named, parents included, every named case was inside its own window when named (100 ms of slack), the killed process's case is never named while the surviving case is, reporter durations are still collected, the task's marker directory is gone afterwards, a task that reports no cases is never given one, and validateSuites refuses a table row carrying the interval. It passed in the full fixture run of 2026-10-05T17:29:08Z. Earlier forms of this repair failed three reviewer probes that the fixture now pins: only the oldest of several due cases was named; a case that left fs.writeFileSync mocked lost its end marker, because the marker went through the public function, and was named after it ended; and a worker thread's exit, written with its process's id, cleared that process's open cases. Against the checkpoint's runner the fixture fails with 'sync one was never named: []': that runner has no short interval and no markers.",
    "Executor's bounded probe at the production interval on a node:test file with a 50 ms async case and spawnSync sleeps of 22 s and 18 s (repair-measurements.json heartbeatProbe): '[20.0s] running case: sync one (entered 19.9 s ago)' and '[40.0s] running case: sync two (entered 17.9 s ago)', with no line naming the finished async case.",
    "Side effects of the preload, by the executor's and a reviewer's comparisons with and without it. Pass, fail, skip, todo and exit results were identical for t.plan, t.mock functions, methods and timers, callback-style tests, skips, a timed-out case, failing assertions, snapshots and a nested node --test. Differences: inside a function-form callback 'this' is Node's internal Test instead of the TestContext (its plan is an object and its assert, test, before, after, beforeEach and afterEach are undefined), and a function-form describe gets the internal Suite; a failing case's stack gains three frames and its top frame is labelled Test.fn; the tracing channel has a subscriber. The reviewer's scan of the 138 files importing node:test found no function-form test callback and no in-process mock of fs.writeFileSync or fs.appendFileSync. The analyst measured 2,000 trivial cases at about 290 ms without the preload and 440 to 540 ms with it, before the marker writes moved to one open descriptor. The flag reaches test file processes through execArgv and leaves NODE_OPTIONS alone, so a Node process a case starts with spawn or exec does not inherit it; a child started with fork() and a file-based worker thread inherit execArgv by default and load the preload, which does nothing off the main thread and writes under the child's own process id; the repository's three fork sites pass execArgv: [].",
    "Failure modes, each exercised by a reviewer's probe and then hardened: the marker directory is removed in a guarded step on every exit path, including a launcher that cannot be resolved; a temporary directory that cannot hold it leaves the task running unmarked instead of failing its setup; and a case is still named while its afterEach and after hooks run, because Node publishes its end after them.",
    "The repair's review gate ran every --test task under the preload: npm test -- --review recorded 2026-10-05T17:27:45.668Z at code identity dea58b070d67cc37483fb0ceabb9d7fb55e46fda478169cae7e63554a255870a, exit 0, forced fresh, 86 tasks fresh and none carried, 36 suites, 899.49 s, code identity unchanged and buildOutputUnchanged true."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order's Design asks that growth be visible while a role waits: the heartbeat names the running case. It did so only for asynchronous cases, and most cases of the two suites that hold every lane are synchronous. The heartbeat is diagnostic and decides no result; a wrong name misdirects whoever is watching a slow gate.",
    "traps": "Rule beating weighs against taking the rule's second branch (state that synchronous cases cannot be named) when the first is achievable and proven. Seeking the wrong goal weighs against a heartbeat that always prints a name: it now prints one only from markers and says so when none is open. Naive interventionism weighs the other way, against instrumenting every test process for a progress line; the preload is one small subscriber, changes no pass or fail in the probes, and the review gate at the repaired identity ran every --test task under it. Shifting the burden: a fixture now covers the synchronous, nested, concurrent and second-file cases, so a regression fails the runner's own suite. The other lenses are unchanged.",
    "naiveInterventionism": "The two suites' own flush lines (test-harness.mjs, test-worktree-integration.mjs) are left alone, since they time the reporter end reports criterion 2 cites. Shell and CLI tasks are not given case names they do not report.",
    "noOp": "Leaving it keeps a heartbeat that names finished cases and D009's reopening condition met, with the handoff claiming that events expose currently running cases."
  },
  "rejected": [
    {
      "option": "State that synchronous cases cannot be named live, and bound the wording",
      "reason": "It satisfies the verifier's rule by a string change and leaves the Design bullet unmet for most cases of the two exclusive suites."
    },
    {
      "option": "Name cases from an async hook on the Test resource, as the read guard tracks its case name",
      "reason": "Its 'after' fires at the first await, so an async case's end is unknown; it fires for hooks, suites and the root; it needs an init hook on every async resource; and the guard is installed in only 17 of the 32 --test rows by the analyst's count, not in the two machinery suites that motivated the heartbeat."
    },
    {
      "option": "Have each suite print its own start lines",
      "reason": "The runner does not parse the '# ' form TAP gives a body's output, two files with 221 cases would need wrappers, and reporter and own reports are keyed differently."
    }
  ],
  "reopens": {
    "decisionId": "WO-186-D009",
    "observation": "VER-001 R1: a bounded run of executeSuite printed 'running case: async first' at 30.0 s although that case ended at 0.05 s, and the final review logs show harness-fixtures and process-debt unnamed for 150 s and 60 s. D009's reopening condition, a heartbeat naming a finished case, occurred."
  },
  "reopenWhen": "A heartbeat names a case outside its own run, or a case runs for more than the interval plus a tick without being named; the Node runtime stops publishing the node.test tracing channel (no marker arrives and the fixture fails); or a test is found to depend on 'this' in a function-form callback or on the text of a failure stack inside a gate-run node:test process."
}
```

## WO-186-D038 — Board two reuse boundaries the repair leaves as they are

```json
{
  "id": "WO-186-D038",
  "date": "2026-10-05",
  "dispatch": "resume: fix; VER-001 F1, met while repairing",
  "kind": "finding",
  "decision": "Record, for planning, two boundaries met while repairing F1 and left unchanged. First, the skeleton's findGateCheck still answers 'npm test' with any complete passing row at the code identity, under its stated rule that a failed attempt does not erase a pass; the completion claim check now follows each task's latest execution, so after a later failure at an identity the two lookups differ. findGateCheck serves the final-review advisory, npm run harness -- evidence (which skips npm test on a cached pass) and the application-evidence hook; resume correct --set productGate likewise takes the latest valid row. Second, .runtime/harness/<snapshot> holds copies of whole dist directories under a name that hashes about forty pinned files; it is not attested to a code identity, and whether any product task reads it is unknown. A stopped gate records no row, so a failure seen before the stop displaces nothing; that is stated in product 07 and is not a defect of the repair.",
  "evidence": [
    "packages/skeleton/src/gate-evidence.mjs findGateCheck carries the comment 'A failed attempt does not erase a later or earlier successful run at identical bytes' and selects the last row that is executed, passing and not partial. The analyst's probe after a forced-fresh failure at an identity showed it returning the older pass; its callers are scripts/lib/lifecycle-evidence.mjs:78-85 and packages/skeleton/src/harness-host.ts:2726-2728 and 2948-2963 by the analyst's reading, not re-read by the executor.",
    "gate-evidence.mjs is a registered evidence source in three editions and feeds the generated harness bundle; changing its lookup is a re-mint and a hook behaviour change, outside what criterion 3's repair needs.",
    "scripts/build.mjs:138-156 calls preserveHarnessRuntime when the installed profiles pin the expected snapshot; scripts/lib/harness.mjs:320-360 writes it, by the analyst's reading. Product-task readers were not traced."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Both sit beside the reuse path this order built. Neither produced a false composed row in any probe, so neither blocks criterion 3, but each could let a consumer other than the completion claim act on a pass the latest run contradicts or on output no row attested.",
    "traps": "Shifting the burden weighs against leaving them as report sentences. Escalation and naive interventionism weigh against changing a second lookup's deliberate rule, the hook that consumes it and three editions inside a repair whose finding does not name them. The other lenses are unchanged.",
    "naiveInterventionism": "No skeleton source is edited.",
    "noOp": "Unrecorded, the difference between the two lookups would surface only when a hook accepts what a completion refuses."
  },
  "rejected": [
    {
      "option": "Apply the latest-execution rule in findGateCheck now",
      "reason": "It changes hook and evidence-command behaviour, needs three editions re-minted and the harness bundle re-emitted, and reverses a rule the skeleton states on purpose; that is a planning decision."
    },
    {
      "option": "Attest the runtime snapshot in this repair",
      "reason": "Whether any product task reads it is unknown, so the repair would be to a defect not shown to exist."
    }
  ],
  "followup": "Planning decides whether findGateCheck and resume correct --set productGate adopt the rule the runner and the completion claim now hold (a complete row answers only while each of its tasks' latest execution at the identity still passes), and traces whether any product task reads .runtime/harness snapshots and whether one snapshot name can hold different dist bytes. Paths: packages/skeleton/src/gate-evidence.mjs, packages/skeleton/src/harness-host.ts, scripts/lib/lifecycle-evidence.mjs, scripts/resume.mjs, scripts/lib/harness.mjs. Checks: a fixture in which a forced-fresh failure follows a pass at one identity, asserted against each lookup; npm test -- --review.",
  "reopenWhen": "A hook, the evidence command or a product-gate correction accepts a pass at an identity whose latest run of that task failed, or a product task is found reading a runtime snapshot."
}
```

## WO-186-D039 — Attest the selected effort; Ultracode is a mode beside it

```json
{
  "id": "WO-186-D039",
  "date": "2026-10-05",
  "dispatch": "resume: fix; operator message during the repair",
  "kind": "correction",
  "decision": "Record this repair's completion with the effort the session selected, xhigh, from the Claude session readback, and describe Ultracode in the handoff as a mode separate from effort. The operator's words, in two messages sent while the repair's reviewers were running: 'ultracode is no longer an effort value; it is orthogonal now to effort', then 'for claude that is; for codex ultra is still an effort value'. The correction therefore applies to Claude Code attestations only; under Codex the ultra spelling stays an effort value and the parser's handling of it stands. Nothing else is changed here: the parser, the generated role text and VER-001's filed attestation are outside the literal correction and outside this order's surfaces.",
  "misread": "The fixer prepared to complete with --effort ultracode, following the role text ('ultra and ultra code record xhigh, mode subagents and raw spelling') and the parser in scripts/resume.mjs, which would have recorded effort xhigh with mode subagents and the raw effort spelling ultracode.",
  "meant": "Under Claude Code, Ultracode is not an effort value. This session's /effort output read 'Ultracode on (this session only): dynamic workflows on every task. Effort stays xhigh.', and the session's CLAUDE_EFFORT reads xhigh. Under Codex, ultra is still an effort value.",
  "changed": "The completion flags (--effort xhigh --source claude-session-readback) and the handoff's attestation line and prose. No source, generated text or filed report.",
  "evidence": [
    "Two operator messages in this session on 2026-10-05, quoted in the decision.",
    "The session's /effort output and the CLAUDE_EFFORT readback (xhigh), both observed by the fixer in this session.",
    "scripts/resume.mjs parseActor treats 'ultra', 'ultra code' and 'ultracode' as spellings of the effort flag for any harness and records effort xhigh, mode subagents and the raw spelling; the generated executor role text states the same rule without naming a harness. VER-001's actor header, a claude-code attestation, carries \"mode\":\"subagents\",\"raw\":\"ultracode\" from that rule."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "An attestation is evidence of how a role ran. Recording a mode as an effort spelling misstates one field; it does not touch the repair's criteria.",
    "traps": "Naive interventionism and escalation weigh against editing the parser, the generated role text (whose bytes sit under cold-start ceilings) or a filed report inside a repair of another finding. Shifting the burden weighs against leaving the stale rule only in chat. The other lenses are unchanged.",
    "naiveInterventionism": "The correction is applied to this actor's own attestation and wording only.",
    "noOp": "Completing with the old spelling would record as an effort value something the operator has said is not one."
  },
  "rejected": [
    {
      "option": "Complete with --effort ultracode as the role text describes",
      "reason": "The operator stated that under Claude Code Ultracode is no longer an effort value, and the host's own output says the effort stays xhigh."
    },
    {
      "option": "Change the parser and the generated role text in this repair",
      "reason": "It goes beyond the literal correction, changes generated role roots and their measured bytes, and belongs to no surface this order declares. The Codex handling is correct as it stands."
    },
    {
      "option": "Correct VER-001's attestation",
      "reason": "A filed report is never edited, and a wrong attestation is corrected only through resume correct on the operator's direction, never by the order's own fixer."
    }
  ],
  "followup": "Planning, with the operator, decides how a Claude Code role records that Ultracode was on, now that it is a mode beside effort there: whether scripts/resume.mjs parseActor still accepts the ultra spellings as --effort when the harness is claude-code, where the mode is read from, and how the generated role text separates the two harnesses. Codex keeps ultra as an effort value. Whether VER-001's claude-code attestation is corrected through npm run resume -- correct is the operator's decision. Paths: scripts/resume.mjs, packages/skeleton/src/loadouts/contributor.ts and the generated role roots. Checks: npm run test:docs and the role-root byte ceilings.",
  "reopenWhen": "Either host changes how it reports Ultracode, ultra or effort again, or the operator directs a different record."
}
```

## WO-186-D040 — Set the guard-registration advisory aside in the process-debt briefing fixture

```json
{
  "id": "WO-186-D040",
  "date": "2026-10-05",
  "dispatch": "resume: fix; adjacent repair met at the repair's review gate",
  "decision": "Repair the WO-131 briefing fixture in scripts/test-process-debt.mjs so that it no longer depends on which process the gate descends from: its normalizer sets the guard-registration advisory aside, as it already does for the beacon warning. The advisory belongs to the dispatch that attempts registration, not to the briefing a resumed session receives. Nothing in the registration or the briefing itself changes.",
  "evidence": [
    "The repair's first complete review gate, recorded 2026-10-05T16:43:28.504Z at code identity 8b9a118169505d39f85e82e0555ec4d32ec5ea2d84d94682935033199ba414ba, failed one task: process-debt, in the case 'WO-131 prompt submission stays open while dispatches retain the ordinary command's gate and writer checks' (35 suites passed, 1 failed, 911.71 s, 86 fresh tasks). The two compared briefings differed by one line: 'DotLn guard registration unavailable: verified agent ancestor unavailable; gate and bounded-command supervision remain active.'",
    "Cause, read in source: scripts/resume.mjs attempts registerAgentSession on a dispatch and prints that advisory when scripts/lib/host-guard-state.mjs agentAncestor finds no ancestor that is the declared session process or an agent by name; the already-recorded dispatch that briefs a resumed session never attempts it. The fixer had launched that gate detached from the session, so no ancestor was an agent. The row is retained in the gate index as a failed attempt.",
    "Reproduced in isolation by the executor: the case run attached to the session passes; run detached, with the launching shell gone, it failed before the change and passes after it (2026-10-05T16:47:13Z attached, 16:47:35Z detached, 1 of 1 each).",
    "Both review gates run attached after the change passed: npm test -- --review recorded 2026-10-05T17:03:01.036Z at code identity 5b87201e51786a99aff13c047d142eb1158150a185dbbdbb638cf1244555c9f2 (36 suites, 86 tasks fresh, 899.61 s), and the repair's final one, recorded 2026-10-05T17:27:45.668Z at dea58b070d67cc37483fb0ceabb9d7fb55e46fda478169cae7e63554a255870a (36 suites, 86 tasks fresh, 899.49 s). Whether the suite would also pass in a detached gate is shown for this case only, by the isolated run."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A gate that fails for where it was launched rather than for the code wastes a full run, about fifteen minutes here, and would fail the same way for anyone running it outside an agent session.",
    "traps": "Shifting the burden weighs against leaving an environmental failure for the next role to rediscover. Rule beating weighs against weakening the comparison: only the one advisory that belongs to the dispatch is set aside, and every other line of the two briefings must still agree. The other lenses are unchanged.",
    "naiveInterventionism": "The fixture's normalizer gains one pattern beside the one it has. No production source changes.",
    "noOp": "Leaving it keeps a suite that fails whenever the gate does not descend from an agent process."
  },
  "rejected": [
    {
      "option": "Only rerun the gate attached and leave the fixture as it is",
      "reason": "The defect would remain for any gate launched outside an agent's process tree, and it cost this repair one full gate."
    },
    {
      "option": "Suppress the advisory in resume.mjs when no ancestor is found",
      "reason": "The advisory is true and useful where it prints; the fixture's comparison is what was too wide."
    }
  ],
  "reopenWhen": "Another fixture is found to depend on the gate's process ancestry, or the registration advisory changes its wording."
}
```

## WO-186-D041 — Final review: fail on criterion 3; the claim check answers with main's row after the worktree's own run failed

```json
{
  "id": "WO-186-D041",
  "date": "2026-10-05",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 on criterion 3 (F1) and send three further reproduced items in the order's surfaces to the same repair. F1: a linked worktree whose code identity equals a passing complete row of the main checkout, and which has no npm test row of its own at that identity, runs npm test -- --only for one task and the task fails. The runner treats that failure as the task's latest run: the next plain run carries the other tasks from main and runs that one. The completion's claim check does not: coveringGateCheck judges main's row against main's rows alone, finds the task's latest execution in that row itself and accepts the claim with no advisory. An older pass masks a later failed run at the identity, which is the rule VER-001 set for criterion 3 (D031) and which D035 parts 5 and 6 and product 07 Discipline state as held. Every clause of criterion 3's own scenario holds and its fixtures passed in this review's gate; the other ten criteria are met. R1: when the code identity cannot be computed or main's gate index cannot be read, the claim check's unreadable-index advisory records the npm test claim as stated, and this order added both ways to reach it. R2: the case reporter's lines are forwarded as progress lines outside the one-second throttle and spend each task's eighty-line progress budget, so a later not ok line is not shown live and 921 of the 1,314 lines of this review's gate log are raw case JSON. R3: the read guard misses a callback fs.open of a record when the flags are omitted and the callback's source text holds neither 'r' nor '+'.",
  "evidence": [
    "F1 reproduced by this review under the bounded wrapper, 2026-10-05T18:32:16Z to 18:32:18Z. Session-scratch probe-claim.mjs builds a scratch Git repository with the table of the runner fixtures' taskReuseFixture (a build with an empty outputs declaration, alpha, beta, machine) and calls the subject's runGate, coveringTaskResults, coveringGateCheck and requireGateClaims. Main: runGate --serial --again, exit 0, recorded 18:32:16.822Z at code identity aa47908b46b31d8147fc1d3f30a05356e50bb54c1658125a3805149690a4a814. git worktree add -b work gives a worktree at the same identity. Control, before any run in the worktree: the claim is accepted on main's row, which is criterion 5's intended behaviour. The ignored marker fail-beta is then written in the worktree and runGate --only beta --serial records checkId suite:beta, exit 1, at 18:32:17.085Z at the same identity, the worktree's only row. coveringTaskResults carries build and alpha and not beta. coveringGateCheck returns location main, main's row and no displaced task; requireGateClaims resolves with no advisory and main's row as the product gate. A plain run in the worktree then runs beta alone (composed, exit 1), after which the claim is refused.",
    "F1 in source: scripts/lib/gate-reuse.mjs:362-364 takes rows and other from main when the worktree has no row of the claim's check, and :371-378 computes own as latestExecution(rows, other, name).row and displaces a task only when own !== row && !pass. With main's row on both sides own === row, so the missing pass is never consulted, although decidingPass (:263-285), which reads the worktree's other-check rows first, returns none. The fixture 'a failed single-suite, machinery or partial run displaces an older pass' (scripts/test-runner.test.mjs:3599) uses a repository that has its own npm test rows; no fixture puts a failed other-check row in a worktree that stands on main's row.",
    "R1 reproduced by the same probe. (a) After a green row an untracked symbolic link scripts/new.mjs is created: gateCodeIdentity and runGate both throw 'Code identity does not support symbolic source aliases: scripts/new.mjs', and requireGateClaims resolves with the advisory 'Gate index unavailable: Code identity does not support symbolic source aliases: scripts/new.mjs; the npm test claim of criterion 3 is recorded as stated.' and no product gate. (b) Main's checks.json is replaced by '{' and a fresh worktree makes the claim: accepted with 'Gate index unavailable: Expected property name or '}' in JSON at position 1 (line 1 column 2); the npm test claim of criterion 3 is recorded as stated.' Source: the catch at scripts/lib/handoff-ledger.mjs:252-260 is unchanged by this order, and its comment limits the advisory to gate storage that cannot be read or written; packages/skeleton/src/gate-evidence.mjs now lists untracked paths and throws on a selected symbolic link, where HEAD hashed a tracked link's target text and did not list an untracked one; scripts/lib/gate-reuse.mjs:111-118 guards only the resolution of main, and the read of its index at :154 is outside that guard, which D034 chose for the runner because the runner answers by running the selection.",
    "R2 in this review's gate log (session scratch, 1,314 lines): 921 lines are forwarded 'PROGRESS CASE {...}' reporter lines. compiler, kernel, skeleton and runner-fixtures each forwarded exactly 80 of them, harness-fixtures 79 and process-debt 78, and each heartbeat's 'last report:' is a truncated case line. Source: scripts/test-runner.mjs:1193-1216 parses a case line for its duration and falls through; :1229-1236 matches the 'PROGRESS ' prefix, which bypasses the one-second throttle; :1085 drops every unforced line after the eightieth. HEAD has the same cap and throttle (test-runner.mjs:989-1039 there) and no per-case lines, so a not ok line early in a long suite was forwarded. No task failed in this gate, so no dropped not ok line was observed. The row's slowestCases and criterion 2 are unaffected: durations are parsed before the cap.",
    "R3 reproduced by this review under the bounded wrapper on Node v26.9.0. Session-scratch probe-guard.mjs runs the subject's guard (productReadEnvironment with order WO-999) on a scratch repository holding untracked docs/evidence/WO-999 records. A readFileSync control records 2 events. fs.open(record, (e, fd) => fs.close(fd, () => done())) records 0, and still 0 with fs.fstatSync(fd) inside the callback; the same call with flags 'r' records 1. Source: scripts/lib/product-read-guard.mjs:432-442 receives the callback in the flags position, readable (:255-262) tests String(flags) for 'r' or '+', and no trailing callback remains to register the descriptor. D033's rule names opens in their callback form. The same probe refutes two candidates: fs.exists is observed through access (1 event), and a dynamic import, a JSON import and a require of a record are observed (3, 3 and 2 events).",
    "This review's gate: npm test -- --review recorded 2026-10-05T18:30:55.265Z at code identity dea58b070d67cc37483fb0ceabb9d7fb55e46fda478169cae7e63554a255870a, the identity VER-002 judged: exit 0, forced fresh, 36 suites, 86 tasks fresh and none carried, identityUnchanged and buildOutputUnchanged true, 1,268.106 s, of which the build waited 385.587 s for host lanes held by another worktree's gate. Staging the three new source files before it left the identity unchanged.",
    "Reach of F1, by reading and not measured: it needs a worktree that stands on main's row and has never recorded an npm test row at that identity, the population the main lookup serves (the order's Observed gap counts five document-only orders in thirty). Once a plain npm test records a row there, the existing fixture's path applies and the failure displaces. The reviewer's forced-fresh gate still runs every task before a merge."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order trades repeated gate work for trust in recorded results, and the completion's claim check is where a role's statement that npm test passed is held against those results. D035 made a task's latest run decide; in the one arrangement the main lookup was built for, the claim check still answers with main's older pass. The verifier consumes the same lookup, so the defect sits on the independently verified loop the critical path names. It is small to repair: one function and one fixture, in a script no evidence edition registers.",
    "traps": "Rule beating weighs against passing on the fixtures, which hold only for a worktree with its own rows. Drift to low performance weighs against letting product 07 state a rule the code misses in a reproduced case, and against narrowing the sentence to fit. Shifting the burden weighs against leaving the reviewer's full gate as the only guard, the weight VER-001 gave F1. Escalation and the commons weigh the other way: a fail costs a repair, a verification and another review gate, and the last four recorded review gates took 899 to 1,268 s each. They are answered by sending R1 to R3 and D042's items in one batch, by a repair rule that closes the class, and by putting the waiver to the operator before recording. Success to the successful: two verifications and four review gates do not settle a case none of them ran. Policy resistance and seeking the wrong goal are unchanged.",
    "naiveInterventionism": "A reviewer does not write and certify a behavioural fix, so no source is edited. The three new source files stay staged; staging does not move the identity.",
    "noOp": "Passing would publish a claim check that accepts a pass which a later run at the identity contradicts, in a file this order rewrote, beside a product sentence that says it cannot."
  },
  "rejected": [
    {
      "option": "Pass and board F1 beside D038",
      "reason": "D038 defers a second lookup whose rule the skeleton states on purpose and whose change re-mints three editions. F1 is in the claim check D035 says it repaired, in scripts/lib/gate-reuse.mjs, with no re-mint, and product 07's Adjacent Repair rule keeps a repairable defect in the order's declared surfaces in the order."
    },
    {
      "option": "Judge criterion 3 met because no false row is recorded",
      "reason": "Main's row is true for main. The claim is made in the worktree, where the task's latest run failed, and VER-001's rule for criterion 3 is that a later failed run at the identity is never masked by an older pass. The claim check masks it."
    },
    {
      "option": "Repair during final review",
      "reason": "The reviewer would certify its own behavioural change. Integration bookkeeping is the only source work a final review does."
    },
    {
      "option": "Correct product 07 to state the exception",
      "reason": "It would fit the document to the defect. The sentence becomes true when the lookup is repaired."
    },
    {
      "option": "Fail criterion 4 on R1 or criterion 2 on R2",
      "reason": "Criterion 4's clauses hold: the identity changes or refuses, and no row is reused. Criterion 2's row fields and per-case reports hold. Both are Adjacent Repair items."
    },
    {
      "option": "Operator waiver of criterion 3, with this review passing on the gate it had already run",
      "reason": "Put to the operator before the result was recorded, with the reviewer's recommendation to waive on cost: the defect is narrow, the reviewer's fresh gate backstops a merge, and the last repair, verification and review gate took 2 h 59 min, 16 min 48 s and 1,268 s. The operator chose to fail and repair, on the ground that deferring a known defect adds more work than going back to fix it. That is product 07's Adjacent Repair rule, and the reviewer's recommendation is recorded here as overruled."
    }
  ],
  "followup": "WO-186 resume: fix. (F1) The completion's claim check accepts a complete row only while each task it names has, as its latest run at the identity among the executions this worktree may consult, that row's own result or a pass that may be carried: the worktree's own runs, under the claim's check or another, decide before main's, as coveringTaskResults already decides for the runner. A fixture adds a linked worktree at main's passing identity with no npm test row of its own; a failed npm test -- --only run there makes coveringGateCheck return no row and name the task, makes requireGateClaims refuse, and leaves the next plain run running that task; a passing rerun of the task lets the claim stand again. The repair closes the class and not this case: the runner's lookup and the claim's are two functions that must agree and nothing asserts that they do, and fixtures written one arrangement at a time left this arrangement open (the reviewer's inference from the code and from D035's list of seven holes found in intermediate states). Either the claim check takes each task's standing from the one decision the runner uses, or one table-driven fixture asserts, over own npm test rows or none, main consulted or not, the latest run under the claim's check or another, and that run passed or failed, that the claim check accepts a row exactly when the runner would carry every task it names. (R1) A code identity that cannot be computed, and a main index that cannot be read when the claim depends on main, either refuse an npm test claim or are stated in product 07 beside the unreadable-index advisory with the reason they are admitted; a fixture holds whichever is chosen, for a symbolic link created after a green row and for a malformed main index. (R2) A case reporter line supplies its duration and is neither forwarded as a progress line nor counted against the progress budget; a fixture with more than forty cases shows a later not ok line and a suite's own PROGRESS line still forwarded. (R3) A callback fs.open with the flags omitted is judged as the read Node makes it and its descriptor is registered, with a fixture, or D033's rule is corrected to exclude it. Checks: node --test scripts/test-runner.test.mjs under the bounded wrapper, npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair or an operator waiver settles criterion 3; or a completion claim is accepted at an identity where the claiming worktree's latest run of a named task did not pass."
}
```

## WO-186-D042 — Final review: items read and not reproduced, for the repair to dispose

```json
{
  "id": "WO-186-D042",
  "date": "2026-10-05",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Hand the repair eight items this review read and did not reproduce, and three record notes, for one disposition each: repaired with a fixture, stated as a bound, or dismissed with the reason. None bears on the verdict. (1) A single-suite run whose task passes but whose row fails for abandoned roots or a changed build output does not displace an older pass, while the same failure in an npm test row displaces every task it ran: latestExecution records an other-check run as passed from the task result alone. (2) A gate that throws after its tasks ran, at the end-of-gate identity read, on a torn deadlines line or at the index lock, records no row, so its failures displace nothing; D035 states this bound only for a gate stopped by request. (3) An untracked file in a class the identity excludes (docs, root Markdown, attribute-marked paths) is outside the identity and outside the read guard's inventory, which lists tracked paths and the active order's record directories; product 07 names tracked inputs. (4) changedMachinery reads git diff --name-only with rename detection and without -z, so a staged move of an exact-path source and a quoted path under a prefix source are not selected, and a failed untracked listing is dropped where a failed diff selects every machinery suite; all three precede this order. (5) A node:test case that loses its timeout, or is cancelled with its parent, may never publish the end event the marker waits for, so the heartbeat could keep naming it. (6) The reporter is passed as a raw path where the marker preload is passed as a file URL, so a checkout path holding '#', '?' or '%' would fail to load it. (7) During a live product gate the hook runs resume.mjs status --json before its read-only admissions, for every write or shell call in each host hook that judges the refusal; it is a cost and not a refusal, and no cost record names it. (8) The runner fixture's assertion on the reuse line went from an anchored pattern that pinned the code identity, the source row's time, the suite count and the evidence reference to a fragment match; the returned row is still asserted, the printed line a role reads is not. Record notes: PR.md says the lock matrix runs on four private roots, where each of the eight cells has its own root at concurrency four, and its process-meter block predates the repair; costs.md's 1,235.443 s of failed after-phase gates covers the two in the final series, while measurements.json is read as also retaining a 900.119 s failed review; costs.md's replay paragraph calls 8f77f8bb the final code identity, which the repair has since moved.",
  "evidence": [
    "Items 1 to 6 were traced in source by this review's three read-only agents (reuse and identity; admission, guard and reporting; test integrity and records) and were not executed: scripts/lib/gate-reuse.mjs:247-249; scripts/test-runner.mjs:2310, :2400-2406 and :2423; scripts/lib/product-read-guard.mjs:38-55 against packages/skeleton/src/gate-evidence.mjs:716-758; scripts/test-runner.mjs:537-552; scripts/lib/case-marker.mjs:43-45; scripts/test-runner.mjs:939 against :963. The reviewer read item 3's inventory lines and items 7 and 8 directly.",
    "Item 7 in source: packages/skeleton/src/harness-host.ts:3791-3810 calls harnessControl, which spawns the status command with a ten-second limit (:559-573), before the read-only admissions at :3842-3852. Measured by this review under the bounded wrapper with no gate of its own running and a one-minute load average of 3.79: five serial status calls took 150 to 152 ms and four concurrent ones 162 to 163 ms each. Its cost under a live gate was not measured.",
    "Item 8 in the diff of scripts/test-runner.test.mjs at lines 367-372: reuseLine was a pattern built from the row's codeIdentity, recordedAt, requiredSuites.length and evidenceRef, anchored at both ends, and is now /no suite started; sources: worktree row recorded .*Complete composed row recorded/u, ignoring its argument. The printed line (scripts/test-runner.mjs:2012-2014) still carries the identity and each source row.",
    "Record notes: docs/final-reviews/WO-186/PR.md lines 5 and 11 and docs/evidence/WO-186/costs.md lines 68-74 and 149, read by the reviewer; the 900.119 s row is the records agent's reading of measurements.json, not recomputed here. The same agent recomputed by hand, from the retained fields, every median the handoff states for criteria 1 and 9, the release and worktree sums and the 193.9 s product, and found them equal; the document gate's 38.993 s before-median stands on VER-002's recomputation because its 140 rows are not retained in this directory.",
    "Two agent candidates were refuted by this review's probe (D041): fs.exists and ESM or require loads of a record are observed."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A repair is already due for D041. Carrying what three independent reads raised in the same batch costs the fixer a disposition each and spares a later role the rediscovery.",
    "traps": "Escalation weighs against calling unreproduced readings findings or requiring a fix for each, so each may be dismissed with its reason. Shifting the burden weighs against leaving them in a report. Rule beating weighs against a disposition by silence. The other lenses are unchanged.",
    "naiveInterventionism": "Nothing is edited. Items 4 and 7 touch behaviour older than or beside this order's change and may properly go to planning.",
    "noOp": "Unrecorded, the items would be found again by the next verification or after a merge."
  },
  "rejected": [
    {
      "option": "Reproduce every item before recording it",
      "reason": "The verdict does not depend on them, and each reproduction is the fixer's first step if it chooses to repair."
    },
    {
      "option": "Leave them as report sentences",
      "reason": "A defect met and not fixed is recorded with a named follow-up; an unconfirmed reading needs at least a recorded disposition."
    }
  ],
  "followup": "WO-186 resume: fix records one disposition for each of items 1 to 8 in its decisions: repaired with a fixture, stated as a bound in product 07 or in the decision that owns it, or dismissed with the reason; an item it sends to planning names its register row. The next final review writes PR.md and RELEASE-NOTES.md from the repaired subject, and costs.md's two sentences are corrected in place by the repair. Checks: npm test -- --review and npm run test:docs.",
  "reopenWhen": "The repair's dispositions are recorded, or one of the items is reproduced with a wrong result."
}
```

## WO-186-D043 — Repair FINAL-001 through one task-standing decision

```json
{
  "id": "WO-186-D043",
  "date": "2026-10-05",
  "dispatch": "resume: fix; FINAL-001",
  "decision": "Repair F1 by sharing the worktree-first execution decision between the runner and completion lookup. Pin their agreement across local/main, same/other-check and passed/failed arrangements, plus an actual failed single-suite run in a fresh linked worktree and its recovery. Address R1 to R3 and give every D042 item a sourced disposition in this repair. Retain D002's one declined economy experiment; run no second experiment and use no subagents.",
  "evidence": [
    "npm run resume --silent -- status --json selected WO-186 needs-fix, with fix its legal next action; npm run resume -- fix recorded RepairRequested using FINAL-001 and reserved this session's writer.",
    "FINAL-001 F1 and D041 reproduce an accepted main-row claim after a failed suite:beta run in a worktree with no npm test row. coveringGateCheck chooses candidate history from main, while decidingPass already consults the worktree's localOther first.",
    "Read inputs: the original order and selected citations; FINAL-001; D002, D033, D035, D038, D041 and D042; current handoff and costs; gate-reuse, handoff-ledger, suite-evidence, runner, marker/reporter and read guard; existing runner fixtures and the live-write refusal."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Sound recorded results let the independent source-to-deliverable loop skip repeated work without hiding this worktree's failed execution.",
    "traps": "Rule beating and drift: the runner and claim must use the same task-standing decision, tested across arrangements rather than only the quoted case. Policy resistance: preserve the existing identity, document-gate isolation and explicit storage-advisory contract. Commons and escalation: one writer, no agents, bounded regression checks and one final fresh review gate after the final source edit. Success to the successful: earlier green reviews do not settle the reproduced exception. Shifting the burden: repair within the declared scripts instead of recurring operator rescue. Seeking the wrong goal: correctness and equivalent coverage decide, not the number of skipped tasks.",
    "naiveInterventionism": "Preserve task source pointers, output attestation, main's read-only index, recovery refs and publication controls; use scratch fixtures to establish each changed rule.",
    "noOp": "Leaves FINAL-001's reproduced false claim and the three adjacent findings unresolved."
  },
  "rejected": [
    {"option": "Patch only the main-row special case", "reason": "Maintains two execution choices and leaves the class untested."},
    {"option": "Add a new cache key or change the skeleton's deliberate whole-row lookup", "reason": "Unnecessary for F1; D038 already owns that separate boundary."},
    {"option": "Repeat the five-run historical measurement series", "reason": "The repair preserves those measured cases; new checks judge the changed behavior without claiming a new median or causal saving."},
    {"option": "NoOp", "reason": "The operator chose repair and the findings are inside the declared surfaces."}
  ],
  "reopenWhen": "The runner carries every task of a candidate row while the claim refuses it, or the claim accepts a row whose latest deciding task execution failed; a new disposition changes the authority, identity or measured coverage."
}
```

## WO-186-D044 — Shared task standing, preserved advisories, usable progress and default-read opens

```json
{
  "id": "WO-186-D044",
  "date": "2026-10-05",
  "dispatch": "resume: fix; FINAL-001 F1 and R1 to R3",
  "decision": "F1: the runner and claim checker now share decidingExecution, which consults this worktree's same-check and other-check executions before main's. The claim's own-result exception is evaluated against that same decision, rather than main's candidate history. R1: preserve the existing unreadable-evidence advisory contract, explicitly including an uncomputable code identity and an unreadable consulted main index; product 07 states that the claim remains actor-stated and unproved, with no bound product gate. R2: case reporter lines supply durations and then leave the capture loop without consuming or forwarding live progress. R3: normalize the two-argument callback fs.open to default read flags and its callback before observation, and register its descriptor for later metadata reads. No package source, version, dependency or evidence edition is changed by this repair.",
  "evidence": [
    "Before the F1 source change, the actual fresh-worktree regression and the matrix failed: 15 passes and 3 failed test results in 3.417 s, ending 2026-10-05T18:52:46.726Z. The failed matrix cell was own=false, consultMain=true, checkId=suite:beta, passed=false. After sharing the resolver, all 18 results passed in 4.688 s, ending 18:53:01.878Z. The actual fixture also proves recovery through a passing single-suite run with no local npm test row, another failure followed by beta alone on the plain run, and main's index unchanged.",
    "Before the adjacent source changes, the new FINAL-001 fixtures passed 19 and failed 8 results in 5.404 s, ending 18:56:06.166Z. The reporter suppressed the real late not-ok diagnostic and the driver's own PROGRESS line; omitted-flags reads returned exit 0 with no excluded read; an abandoned-root other-check row left beta carried; the three machinery-path cells failed; and the special-character checkout failed with ERR_MODULE_NOT_FOUND at the raw reporter path. R1's two advisory cases passed, confirming the existing behavior rather than inventing a new refusal.",
    "After those changes, the FINAL-001 fixtures plus the strengthened complete reuse-message assertion passed all 28 results in 8.058 s, ending 2026-10-05T18:56:48.505Z. Retained ignored session-scratch transcripts: final001-adjacent-before.log and final001-adjacent-after.log. Each invocation ran under node scripts/harness.mjs bounded.",
    "R1 fixtures use a symbolic source alias added after a green row and malformed main checks.json in a fresh linked worktree. Each claim has exactly one Gate index unavailable advisory and no productGate; the symbolic alias still refuses the runner's identity. R2 uses 55 real passing node:test cases followed by a planted failing case, with the actual case reporter: the not-ok line and a suite-owned PROGRESS line are forwarded, no case JSON is forwarded as progress, and five measured slowest cases remain. R3 covers both a default callback open alone and a default open followed by fstatSync: one and two excluded reads respectively, normal callback completion and descriptor closure.",
    "Read boundary for this repair: the original work order, FINAL-001, all its selected citations, current subject source/tests, product 07 Discipline and Goal-aligned decisions, D002/D033/D035/D038/D041/D042, handoff, costs and replay. No immutable verification or final-review report was edited."
  ],
  "rationale": "D043's mission and eight-lens comparison still applies. One shared execution decision closes the reported class without adding an identity or cache. The full history matrix covers an arrangement beyond the quotation (recovery through another check before any local npm test row) and checks the runner and claim together. Keeping storage failures advisory preserves the established completion contract and states its proof limit explicitly; making all such failures refuse would change existing recovery behavior. Progress retains diagnostic slots while duration evidence is unchanged. Default opens are the same read/descriptor class the guard already wraps, so fixing their argument normalization removes the gap without expanding authority. No speed median or whole-order saving is claimed.",
  "rejected": [
    {"option": "Accept main's row whenever its own result is present", "reason": "Ignores the claiming worktree's later failed execution."},
    {"option": "Make every unavailable index or identity a new completion refusal", "reason": "R1 permits an explicit advisory boundary; the existing recovery contract admits storage-unavailable handoffs, and the new fixture/documentation make the lack of proof visible."},
    {"option": "Raise the progress cap", "reason": "Keeps reporter noise and delays the same loss of diagnostics; case JSON belongs to measurement."},
    {"option": "Exclude default callback opens from the supported observer forms", "reason": "Normalization is a bounded repair of the existing supported callback interface."}
  ],
  "reopens": {
    "decisionId": "WO-186-D035",
    "observation": "FINAL-001 F1 showed the earlier claim rule choosing main's candidate history instead of this worktree's deciding execution."
  },
  "reopenWhen": "A completion accepts a candidate whose deciding task execution failed, either lookup disagrees about that execution, a case report hides a live diagnostic, or a supported callback open reaches a record without observation."
}
```

## WO-186-D045 — Disposition of all eight D042 notes and its three record corrections

```json
{
  "id": "WO-186-D045",
  "date": "2026-10-05",
  "dispatch": "resume: fix; FINAL-001 D042",
  "decision": "Dispose every D042 item from checked evidence. (1) Repaired: an other-check execution passes only when both its task result and its row integrity pass; abandoned roots, changed build output, memory failure, changed identity, stopped and timed-out rows displace that task, and a later intact pass restores the older complete row. (2) Stated bound: any gate that stops or throws before persistence leaves no row and displaces nothing, including final identity reads, deadline parsing and index-lock errors. Product 07 now states that the lookup judges recorded executions. (3) Stated bound: the guard's excluded-input inventory lists tracked paths; other untracked excluded inputs are outside it until staged, while the active order's record roots protect untracked and prospective paths. Product 07 now names both sides; no product task reading such a non-record input was identified by this repair's scoped reads. (4) Repaired: machinery selection disables rename detection, reads NUL-delimited paths and widens to every machinery suite when the untracked listing fails. (5) Dismissed for the tested timeout/cancellation forms: the actual Node tracing markers close those cases before the following case runs; no stale name was observed. (6) Repaired: the reporter uses a file URL, as the marker already does. (7) Stated cost: during a live product gate activeGateWriteRefusal calls harnessControl before its cheap read admissions; the final review measured status at 150 to 163 ms per call with no live gate, and its live-gate cost remains unknown. Preserve the current authority lookup rather than cache stale phase state; this is cost, not a reproduced incorrect refusal. (8) Repaired: the fixture now checks the whole printed reuse line, including task count, identity, source date, evidence reference and rerun command. Record notes: costs.md distinguishes the two final-series failed gates from the earlier incomplete 900.119-second attempt and names the replay's pre-repair identity and three actual row dates. PR.md's draft root count is corrected to eight private cell roots at concurrency four. Local release preparation refreshed its process-meter block; the next passing final review still replaces the complete PR/release prose around its current subject and meter, as FINAL-001 directs.",
  "evidence": [
    "Items 1, 4 and 6 were reproduced by final001-adjacent-before.log and pass in final001-adjacent-after.log (D044). Item 1's fixture checks six row-integrity failures and restoration; item 4 checks a staged exact-source rename, an embedded-newline path under a source prefix and a Git shim that fails only ls-files; item 6 imports and executes the real copied runner in a checkout whose path includes #, ? and %.",
    "Item 2: runGateChecks throws before recordGateChecks for the final gateCodeIdentity read and JSON.parse of deadline lines; recordGateChecks cannot persist when its lock fails. Existing stop fixtures require no recorded row. This is the persistence boundary D035 already states for stops, now generalized in place without claiming unrecorded executions are known.",
    "Item 3: productReadEnvironment obtains tracked paths from git ls-files -z, applies excluded classes/attributes to that inventory and separately constructs the selected order's record roots. gateCodeIdentity excludes those documentation classes even when nonignored untracked. The retained copied-input investigation FUP-b28b870422a74166 is not claimed settled; D033 and close-register.md retain its existing scope. No new product-input coverage claim is made.",
    "Item 5: probe-cancelled-markers.mjs under the bounded wrapper, qualified run ending 2026-10-05T18:58:23.464Z in 2.032 s, on this host's Node runtime. A 30-ms timed-out test body continues asynchronously for 700 ms; a timed-out parent cancels its child; each is followed by a 900-ms case. The expected failing child task returned exit 1, with Node's testTimeoutFailure and cancelledByParent diagnostics. The probe asserts staleTimeout=false and staleCancellation=false after the following cases begin. The initial probe's parent waited for its child rather than cancelling it; only the qualified run supports the cancellation disposition. Transcripts and script are retained in ignored session scratch. A missing marker after another untested failure mode remains unknown.",
    "Item 7: packages/skeleton/src/harness-host.ts activeGateWriteRefusal calls harnessControl only after finding active runs, but before checking liveGateReads; FINAL-001 D042 supplies the no-live-gate status timing sample. No live-gate sample or aggregate cost is inferred from it. No package source is changed to optimize this unmeasured cost.",
    "Item 8: the pre-existing reuse fixture's fragment regex is replaced by exact equality to its expected complete message; it passes in the 28-result targeted run.",
    "Accounting: measurements.json.failedOuterTimeout has wallMs=900119, startedAt=2026-10-05T05:22:24.751Z, finishedAt=05:37:24.871Z, failureKind=outer-wrapper-timeout, and no persisted row. The two final-series failures are 420.269 and 815.174 s: 1235.443 s, or 2135.562 s including the distinct incomplete attempt. replay.json codeIdentity is 8f77f8bb26e21f212f2f7ffa1a9a098aaaa4a71f9c9d1184539c40f00618ee99 and measuredPassingRows names 09:02:13.201Z, 09:15:43.198Z and 09:29:18.318Z; the replay is not re-measured at either repair. PR.md's quoted four-root sentence and 09:32:00.052Z meter cutoff were read."
  ],
  "rationale": "D043's mission and eight lenses still apply. Fix the reproduced low-risk defects inside the declared scripts and shared checks; state what the persistence and input inventory can actually observe instead of claiming wider guarantees. A real cancellation probe rejects a source-only suspicion without changing working marker code. The hook cost has no measured live-gate effect, so changing the registered harness source and re-minting three editions now would not establish a benefit. Correcting the draft's root count establishes that fact, without certifying behavior; the next independent reviewer owns the final PR/release text and current review meter. Existing measurement cohorts stay intact and their limits remain explicit.",
  "rejected": [
    {"option": "Silently omit unreproduced notes", "reason": "D042 requires one disposition each; source boundaries and unknowns need an owner in the existing record."},
    {"option": "Persist a success-shaped row after a gate cannot finish its identity or storage check", "reason": "Would invent evidence the interrupted gate cannot bind; changing the no-row contract is unnecessary for the recorded-execution lookup."},
    {"option": "Optimize the authority lookup without a live-gate measurement", "reason": "The status sample did not run under a gate, and stale cached phase/order state would change admissions."},
    {"option": "Change the markers to clear cases from delayed reporter events", "reason": "The executed timeout/cancellation probe refutes the suspected gap, and reporter events are too late for synchronous cases."}
  ],
  "reopens": {
    "decisionId": "WO-186-D033",
    "observation": "D042 item 3 identifies the same excluded-input observer boundary for non-record untracked files: the manifest inventories tracked paths only. Product 07 now states that limit; the existing input-coverage investigation is not claimed settled."
  },
  "reopenWhen": "A non-record untracked excluded input is found influencing a reused product result; a gate's unpersisted failure is masked in actual use; another timeout/cancellation form leaves a stale name; a live-gate profile establishes material authority-lookup cost; or the passing review keeps the draft's stale root count, subject or process meter."
}
```

## WO-186-D046 — Repair result and the fifty-order operating-value comparison

```json
{
  "id": "WO-186-D046",
  "date": "2026-10-05",
  "dispatch": "resume: fix; FINAL-001; outcome questions during repair",
  "decision": "Complete the known correctness repair against the order's eleven written criteria and hand it to independent re-verification. Distinguish those judgments from the broader future operating value. Evaluate recurring cost and reuse benefit over fifty future orders; do not use this order's one-time development/repair cost as a recurring penalty, infer impossibility from a remaining profile, or classify an unmeasured aggregate as useless. These passing repair checks alone give no whole-order performance merge recommendation.",
  "evidence": [
    "npm test -- --review passed at code identity 3743c14b5afa554cf2517c23833d0bb807cc204f1ac9f637adcebbc9f1bcd718, recorded 2026-10-05T19:25:49.225Z: 36 suites, 86 fresh tasks, none carried, 932.703 s, identityUnchanged and buildOutputUnchanged true. Every task retains one to five slowest cases. No task failed; four deadline diagnostics remain cause-unestablished.",
    "The complete runner fixture file passed 99 results in 51.894 s before explanatory source comments; the final full review passed the declared runner-fixtures task in 65.618 s at final source. D044/D045 retain the actual red/green controls and every finding's disposition.",
    "The first document attempt failed in 27.907 s because product 07 was 740 bytes above its existing ceiling; dependent checks did not execute. The same rules were compressed in place to 166877 bytes under 166907, with no ceiling change. Publication passed 2026-10-05T19:08:57.187Z; the next document gate passed all 29 tasks in 66.971 s at 19:10:04.781Z. The final completion runs the document gate again after final records.",
    "FINAL-001 explicitly marked timing/profile criteria 1 and 9 met and failed criterion 3. Its account of VER-001 also names criterion 3. The recorded send-backs were false reuse claims, not conflicting performance grading.",
    "Planning standard-pass-2026-10-02.md section 4 selected this order to reduce recurring gate cost: fourteen unchanged-identity rerun pairs cost 8384 s, with only 9 to 36 percent of task time lacking a pass, and five corpus/document orders paid fifteen first gates totaling 10129 s. Refutation receipt 038 judged the removal case aligned-with-findings, explicitly calling the prescribed measurement paid once; receipts 039 and 040 retain that verdict. These are opportunity figures, not this implementation's realized savings.",
    "The operator's questions during this repair concerned usefulness over fifty future orders. The executor's earlier explanation mixed one-time development/repair cost into that operating-value question; it corrected that comparison in chat. repair-final001-checks.json retains a conditional recurring-value model with unknown reuse frequency and matched review delta, rather than a forecast.",
    "Using illustrative counts of two fresh plain and seven document gates per order, the recorded phase median differences imply 7357.7 s saved in plain work and 9693.95 s added in documents over fifty orders: a 2336.25 s gap before reuse and matched review cost. With zero matched review delta, average net reuse benefit of 46.725 s per order breaks even. The unequal observed review median difference is not assigned as a recurring penalty.",
    "This session used one writer and zero subagents. D002 remains the sole declined economy experiment; no second experiment or new dependency was introduced. The draft PR's root count is corrected; its complete final subject and review meter remain the next final reviewer's.",
    "The canonical follow-up batch applied at 2026-10-05T19:39:21.509Z, revision ce5babf2a5c45cd9c688c187e360fbbf7a368fe990fd742381aec8f2b1b31591: FUP-ff62b8dd608794b0 (D041), FUP-3a2358223cd7864f (D042) and FUP-7a67deb691d858ea (D035) settled; FUP-0c10689747f83675 (D033 source revision 2) open for planning with the existing input-coverage investigation. Original close-only allocations stay unchanged. The first batch was refused without writing because open requires a null reopening field; correcting that field admitted the batch."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A correct shared lookup makes recurring reuse possible without masking a failed execution. The performance decision is the operating benefit over future work, not how much sunk work this repair took; that aggregate remains conditional on workload, eligibility and reuse overhead.",
    "traps": "Seeking the wrong goal and rule beating: do not turn eleven met written criteria into proof of net future benefit. Drift: retain the recurring document overhead and unknown matched-review term. Commons and escalation: one final full gate, no agents, no new cache key and no repeated historical benchmark cohort. Success to the successful: prior green gates did not settle F1, and unknown aggregate value does not prove the investment worthwhile. Policy resistance: preserve the storage advisory and independent roles. Shifting the burden: record the corrected comparison, the regression class and the remaining planning owners so the operator need not reconcile incompatible claims.",
    "naiveInterventionism": "Repair the recorded class and bounded adjacent defects, retain assertion coverage and all observed costs, and avoid an unrequested architecture or acceptance-criterion change.",
    "noOp": "Would leave the operator-authorized false-claim repair unfinished. Finishing it establishes correctness evidence, without deciding the whole order's future economic value."
  },
  "rationale": "The shared resolver and history matrix judge the reported class. The full gate binds final code/output, while the completion's fresh document gate judges the final authored tree. Product value needs a recurring, comparable-workload assessment: phase medians and hypothetical reuse are evidence inputs, not an observed fifty-order result. The current repair neither merges nor withdraws the order.",
  "rejected": [
    {
      "option": "Use this repair's elapsed development time to declare the future operating change useless",
      "reason": "That is a one-time cost and is not the question the operator asked; recurring benefit may amortize over fifty later orders."
    },
    {
      "option": "Multiply the wider review phase's observed increase by fifty",
      "reason": "Different selections do not establish a recurring matched-workload penalty."
    },
    {
      "option": "Claim a demonstrated net saving from the conditional model",
      "reason": "Future gate counts, eligible reuse frequency, overhead and matched review effects remain unknown."
    },
    {
      "option": "Treat the remaining test profile as an irreducible runtime",
      "reason": "The record explicitly does not establish that every remaining instruction is necessary; further optimization is possible."
    }
  ],
  "reopenWhen": "Independent re-verification contradicts a repaired rule, the runner and claim disagree on task standing, or representative future-workload evidence establishes the recurring reuse and review terms needed for a whole-order value judgment."
}
```

## WO-186-D047 — Final review: pass at the repaired identity; five low items boarded with one follow-up

```json
{
  "id": "WO-186-D047",
  "date": "2026-10-05",
  "dispatch": "resume: final review; FINAL-002",
  "decision": "Pass final review of WO-186. All eleven criteria are met at code identity 3743c14b5afa554cf2517c23833d0bb807cc204f1ac9f637adcebbc9f1bcd718, the identity VER-003 judged. No integration is due and this review changes no source. Board five low items under one follow-up. (1) The integration and harness suites print their own PROGRESS case-ended lines from inside node:test, so the lines reach the runner as TAP comments and are never forwarded live. Criterion 2 is met without them: the case reporter's end events put each case's duration on the row, and each integration case's TAP subtest line arrives when the case ends. VER-003's sentence that the integration line is still forwarded is inaccurate. (2) A parent test and its subtests both count among a task's five slowest cases, so the lock-matrix parent and its cells can fill the skeleton task's five slots. (3) The comment at scripts/test-runner.test.mjs:435-436 says a failed row never satisfies the lookup; the rule now carries passing tasks from a failed row whose identity held, and the fixture's failed row sets identityUnchanged false. (4) By inference from the code, not reproduced: readGateChecks reads the archives and then the hot file without the writer's lock, while recordGateChecks moves its oldest hot row into an archive and then replaces the hot file. A read between the two can miss the moved row. If that row were a task's latest failure at the identity, an older archived pass would decide. Since this order, a worktree reads main's index this way while main may be recording. (5) Untested: the product read guard wraps neither fs.glob nor fs.globSync, and whether Node's internal directory reads under them reach the wrapped forms is unknown. A review agent's two other items are already disposed: a run that ends before its row is written displaces nothing (D042 item 2, D045, stated in product 07), and findGateCheck keeps the whole-row rule (D038, FUP-5e52eb500e395237).",
  "evidence": [
    "git ls-remote origin refs/heads/main, origin/main, local main, the merge base and HEAD all name 2816c773008c66b8ab0ac4a0fd73c21b7df9f2d0. git ls-remote --tags origin v0.66.3 returns nothing. gateCodeIdentity is 3743c14b5afa554cf2517c23833d0bb807cc204f1ac9f637adcebbc9f1bcd718 at entry and after the gate.",
    "npm test -- --review was recorded at 2026-10-05T20:54:41.767Z, tree 179275a7a88fef597d00f5d44becb910e7f142b0: exit 0, forced-fresh (freshReason review), 36 required suites, 86 tasks executed, none reused, none failed, 934.361 s. identityUnchanged and buildOutputUnchanged are true. Every task carries one to five slowest cases. The critical path waited 297 ms. Four deadline diagnostics (skeleton one, runner-fixtures three) are deadline-hit-cause-unestablished, and no task failed.",
    "Item 1: the gate's live transcript holds 0 case-ended lines and 21 worktree-integration progress lines. The heartbeat at 15.0 s names the fast-forward case, entered 14.9 s before, and that case's subtest line arrives at 16.3 s. The runner forwards a line only when it matches ^\\s*(?:PROGRESS |# Subtest:|ok \\d+ -|not ok \\d+ -) (scripts/test-runner.mjs:1234). A forwarded PROGRESS line bypasses the throttle, and the suite forwarded 21 lines, far under the 80-line cap.",
    "Item 2: scripts/lib/case-reporter.mjs emits every test:complete except the file's own entry, and scripts/test-runner.mjs:1198-1211 keeps name, file and duration without nesting. Item 3: scripts/test-runner.test.mjs:435-441. Item 4: packages/skeleton/src/gate-evidence.mjs:827-846 (reader) and :848-918 (writer under the record lock); gateCacheRows is 256. Item 5: a search of scripts/lib/product-read-guard.mjs finds no glob wrapper.",
    "Two read-only review agents (reuse, identity and claim; admission, guard, timing, tests and generated text) reported no criterion-breaking defect, no removed or loosened assertion and no new lint or type suppression. One traced FINAL-001 F1's arrangement through the shared decidingExecution: the worktree's failed other-check run is returned before main is consulted, so beta is displaced for the claim and the runner alike.",
    "npm run plan -- followups --touching --work-order WO-186 matched 28 of 181 pending rows at register revision ce5babf2a5c45cd9c688c187e360fbbf7a368fe990fd742381aec8f2b1b31591. FINAL-002's Register section records each judgment."
  ],
  "goalAlignment": "Mission and critical path: the order lets a role stand on recorded passes instead of rerunning them, and the trust that makes this safe is that a skipped task stands on the latest run. The repair closes the class FINAL-001 found, and this review's fresh gate is the backstop receipt 038 names. Rule beating: the five items were judged against what the criteria require, not by fixture names, and the one claim that rested on an untested path (VER-003 line 68) was checked against the live transcript. Drift to low performance: each item stays a register row with a condition, not a report sentence. Success to the successful: three verifications and two earlier review gates did not replace this review's fresh run. Shifting the burden: the follow-up gives planning a reproduction or a stated inference for each item. Escalation and the tragedy of the commons: failing for items that break no criterion and cannot put a false pass on main would cost another repair, verification and a gate of about 15 minutes. One fresh gate and two read-only agents were spent instead. Policy resistance: no refusal, identity rule or dependency changes. Seeking the wrong goal: no speed saving is credited. The record shows a lower plain-gate median, a higher document-gate median and no whole-order saving established. Naive Interventionism: no source edit by the reviewer. NoOp: without a pass, main keeps full reruns at an unchanged identity, full first gates in fresh worktrees and the refused record writes during a product gate.",
  "rejected": [
    {"option": "Fail final review and send the five items to repair", "reason": "None breaks a criterion. Item 4 is an unreproduced inference with a narrow window, item 5 is untested, and items 1 to 3 cost observability or wording, not correctness. The review gate always runs fresh, so none can put a false pass on main."},
    {"option": "Fix item 1 or item 3 in this review", "reason": "A reviewer does not write and certify a behavioral fix. Even a comment edit in a test file changes the code identity and needs another full gate."},
    {"option": "Record the items only in FINAL-002", "reason": "A defect met and not fixed needs a decision with a named follow-up."}
  ],
  "followup": "Planning, low priority, with the next order that opens the runner's case timing, the gate index reader or the product read guard: (1) make the integration and harness case-ended reports reach live progress, or remove them, and correct VER-003's claim in a new record; (2) decide whether a parent test counts among a task's five slowest cases; (3) correct the stale comment at scripts/test-runner.test.mjs:435-436; (4) reproduce or refute the lock-free readGateChecks race against a concurrent recordGateChecks eviction, with a fixture either way; (5) probe fs.glob and fs.globSync on an active order's record under the read guard and wrap them if unobserved.",
  "reopenWhen": "A gate's live progress is needed to see an integration case end, a slowest-case list hides a slow case behind its parent, a carried pass is traced to a row missing from a concurrent index read, a product task globs an active order's records, or the next order edits scripts/lib/case-reporter.mjs, readGateChecks or scripts/lib/product-read-guard.mjs."
}
```
