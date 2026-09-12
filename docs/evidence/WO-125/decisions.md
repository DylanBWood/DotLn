# WO-125 decisions

## WO-125-D005

```json
{
  "id": "WO-125-D005",
  "date": "2026-09-12",
  "dispatch": "Operator resume: fix; VER-003 F1; operator permits a straightforward DevEx repair and directs wrapping up",
  "decision": "Protect existing non-directory destinations with multiple hard links during live gates, preserving ordinary scratch writes.",
  "evidence": [
    "docs/verifications/WO-125/VER-003.md: F1 in-place writes through a pre-existing hard link change tracked inputs",
    "scripts/test-runner.test.mjs: new VER-003 regression fails against inherited code"
  ],
  "rejected": [
    "NoOp or a known-issue exception leaves an avoidable gate-invalidating write that one link-count check prevents.",
    "Scanning the filesystem for every inode alias adds cost and still cannot establish all names.",
    "Broad scratch refusal removes useful operator-authorized writes."
  ],
  "reopenWhen": "Conservative refusal of multiply-linked scratch files causes observed workflow cost, or a supported filesystem cannot report link counts reliably."
}
```

Correction to D004, 2026-09-12: physical path resolution does not identify
hard-link aliases. The new regression reproduces that gap. The operator
explicitly permits this small DevEx repair and asks to finish the order;
no additional observation becomes repair scope. The existing missing WO-019
directory still uses D001's named replacement inputs.

Mission and critical path: prevent wasted independent-verification runs in
the source-to-deliverable loop. Policy resistance is bounded by retaining
ordinary scratch writes and excluding directories from the link-count rule.
Tragedy of the commons, escalation and shifting the burden favor one local
check over repeated gate runs or operator rescue. Drift to low performance
and rule beating require a failing regression and generated-hook attempts
that would execute if admitted. Success to the successful and seeking the
wrong goal are immaterial to this bounded choice: it preserves the promised
gate behavior without selecting a transport or adding authority.

Under Naive Interventionism, retain gate ownership, scratch access, existing
path resolution and final input comparison. The smallest probe is a temporary
tracked file hard-linked into scratch. The repair is locally reversible;
its deliberate cost is refusing multiply-linked scratch files even if all
their names are ignored. No equivalent alternative was measured, so no
comparative efficiency claim is made. Entry collection first lacked a fresh
counter; retry measured 75,311 total tokens (73,344 cached input), source
`codex-transcript-counter`, scope `dispatch`. That window starts at explicit
session entry and excludes the earlier routing reads. Handoff recollects usage.

## WO-125-D001

```json
{
  "id": "WO-125-D001",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-125 observation-first design and acceptance criteria 1–3",
  "decision": "Probe five explicit Codex effort overrides before enabling only observed version/level pairs; preserve unknown arguments and host-launch epistemic limits.",
  "evidence": [
    "packages/skeleton/src/worker-transport.ts: previous unknown-only guard",
    "docs/discovery/codex-effort-2026-09-11.json: five accepted 0.154.0 launches, no effort fields",
    "packages/skeleton/fixtures/codex-unknown-args.json: captured pre-change arguments"
  ],
  "rejected": [
    "NoOp leaves the requested max launch impossible.",
    "Reading personal settings makes selection depend on hidden state.",
    "Inferring effective effort from accepted flags overstates the observation."
  ],
  "reopenWhen": "The installed CLI version changes, a level becomes unavailable, the output shape changes or effective-effort readback is observed."
}
```

Authority: the operator dispatched `resume: next` for WO-125. The executor
uses the repository's operator-attested GPT-6 Astra/max default; the installed
CLI reports `0.154.0`. Neither statement is effective-session readback.

Evidence: `canonicalWorkerArgs` rejects every Codex effort except `unknown`,
and the transport accepts only CLI `0.153.4`. Installed `0.154.0` help exposes
generic TOML configuration overrides and ignored user configuration. Current
Context7 documentation for `/openai/codex` identifies
`model_reasoning_effort`; documentation alone does not establish acceptance on
this machine. Five authenticated, synthetic probes will establish that boundary
before the adapter changes.

Chosen approach: reuse the existing canonical `unknown` argument shape for a
minimal schema-bound response, add exactly one explicit effort override per
declared level, and record exit, result shape, readback presence and numeric
usage. Enable only the observed version/level pairs. Preserve the old
`unknown` arguments and fixtures, user-config isolation, and honest launch
claims. Reopen on a CLI-version change, unavailable level, changed output shape
or newly observed effective readback.

Mission and critical path: explicit, reproducible Codex worker/refuter selection
removes a transport prerequisite to independent verification in the planned
source-to-deliverable loop. NoOp leaves an operator-requested `max` launch
impossible. Reading personal settings makes selection depend on hidden state;
inferring effective effort from the request overstates the evidence. Both are
rejected.

System traps: policy resistance and rule beating are addressed by retaining
the authority restrictions and testing actual forwarded arguments plus durable
launch claims. Drift to low performance and seeking the wrong goal are checked
against explicit selection, not a claimed improvement in model quality.
Tragedy of the commons and escalation favor five tiny probes and shared
regression gates over repeated live reviews. Success to the successful does
not privilege either transport: Claude is outside this order, and Codex must
earn its enabled levels through observation. Shifting the burden to the
intervenor favors repository-owned launch arguments over recurring settings
rescue. Under Naive Interventionism, the useful existing isolation and
`unknown` behavior are preserved; the smallest useful probe is one inert
response per level, and the adapter change is locally reversible.

Required input correction: the cited `docs/evidence/WO-019/` directory does not
exist in this checkout. Its retained effort contract is in product 07
§Model-specific notes, `docs/discovery/environment.md` §WO-019 effort readback
addendum and `environment.json`'s effort-discovery rows. Those are the selected
replacement inputs; no missing report is represented as read. Probe tooling,
worker/verification protocol consumers, plan-refutation fixtures and release
generation inputs are added to the implementation read scope as needed.

Cost: dependency installation and build were required to initialize the harness.
The first usage attempt preceded a fresh counter and refused; the next succeeded
with source `codex-transcript-counter`, scope `dispatch`, total 716300 tokens
(678272 cached input). This is the first successful measurement, not a claim of
zero-cost entry. Handoff will record fresh counters. No comparative efficiency
or model-quality improvement is claimed. The pre-2026-09-09 ledger duty is
discharged by this decisions file and its generated index entry.

## WO-125-D002

```json
{
  "id": "WO-125-D002",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-125 patch classification and standing release default",
  "decision": "Complete the omitted activation assignment at application v0.17.2 and skeleton 0.15.2, regenerate runtime pins and record a fresh feedback edition.",
  "evidence": [
    "Local annotated release baseline v0.17.1",
    "docs/product/06-roadmap.md: WO-125 activation completion",
    "packages/skeleton/src/worker-transport.ts: bounded adapter correction"
  ],
  "rejected": [
    "NoOp leaves release metadata and source-pinned evidence stale.",
    "Bumping unchanged components overstates compatibility impact."
  ],
  "reopenWhen": "A release collision consumes the application target or changed compatibility requires reclassification."
}
```

All five launches on Codex CLI `0.154.0` / requested `gpt-6-astra` exited 0,
returned the expected schema and completed the turn. No effort field was
observed. The complete sanitized rows are
`docs/discovery/codex-effort-2026-09-11.json`. The adapter therefore adds the
exact tested override at the end of the existing arguments for the five
validated levels on `0.154.0`. Older `0.153.4` requests remain `unknown` only;
unobserved explicit selection refuses before spawning and names discovery.
The pre-change `unknown` argument bytes were captured before editing the
adapter in `packages/skeleton/fixtures/codex-unknown-args.json`.

The existing host already records requested effort as `host-launch`, so no
receipt schema or readback mechanism changes. Tests exercise each effort
through the worker process double and durable log, and the actual plan CLI
entry with a synthetic executable. The goal/trap assessment above still
applies; no quality or speed advantage is inferred from the five tiny probes.

Activation had left the application version placeholder unassigned. Under the
order's patch classification and standing release default, assign `v0.17.2`
above observed local annotated `v0.17.1`. Bump only skeleton from `0.15.1` to
`0.15.2`, including its declared harness runtime pins; other components and
contracts stay fixed. The source change requires regenerated harness bundles
and a fresh feedback evidence edition. NoOp would leave release provenance and
source-pinned evidence stale; broader component bumps would misstate impact.
Reopen only for changed compatibility or a release collision.

## WO-125-D003

```json
{
  "id": "WO-125-D003",
  "date": "2026-09-11",
  "dispatch": "Operator resume: fix and scope expand: Fix VER-001 F3 in this repair",
  "decision": "Repair F1 and adjacent F2 with runtime membership and an unknown default version; repair F3 with process-owned gate markers and pre-tool write refusal for the gate lifetime.",
  "evidence": [
    "docs/verifications/WO-125/VER-001.md: F1, F2 and operator-directed F3",
    "packages/skeleton/src/worker-transport.ts: version-only admission and optimistic default",
    "scripts/test-runner.mjs: input changes detected only after suites finish",
    "packages/skeleton/src/harness-host.ts: pre-tool boundaries lack active gate facts"
  ],
  "rejected": [
    "NoOp retains unsupported launch claims and the demonstrated wasted gate run.",
    "Relying on caller types or operator vigilance repeats supervision at every call.",
    "A permanent lock or age-based timeout can strand writes after a crash or unlock a slow live run.",
    "Filesystem permissions would also block the gate's own generated and local evidence outputs."
  ],
  "reopenWhen": "New observed effort pairs are filed, a supported host cannot distinguish dead run owners, or the tool adapter exposes additional write surfaces."
}
```

Same-day correction: D001 meant only the five observed version/level pairs,
but implementation checked only the version. VER-001 reproduced unsupported
strings reaching the launcher. The repair adds runtime membership and makes
an omitted version non-admitting while preserving `unknown` arguments.

The operator explicitly added F3 to this repair. Its read and write scope adds
the gate runner, harness entry and host, shared gate-evidence module, generated
hook fixtures, runner fixtures and package script mapping. Product 07 and this
receipt carry the durable expansion. The absent WO-019 evidence directory
continues to use D001's named replacement inputs.

Mission and critical path: reliable selection and stable verification inputs
support the independently verified source-to-deliverable loop. Policy
resistance is addressed by blocking agent dispatch while permitting the gate's
own preparation and evidence writes. Tragedy of the commons and shifting the
burden favor preventing the demonstrated wasted run without operator rescue.
Drift to low performance and rule beating require negative launch tests and
real generated-hook refusal before a write callback, with an unchanged tree.
Escalation is bounded to existing tool boundaries and one local marker protocol;
it adds no approval step. Success to the successful is immaterial: neither
transport gains new authority. Seeking the wrong goal is checked against
completed, stable evidence rather than more receipts or busy agents.

Under Naive Interventionism, existing launch arguments, gate caching,
preparation and final input comparison remain useful. Markers belong to live
processes, are local to the physical worktree and are released on completion;
dead owners cannot strand writes. The smallest useful probes are unsupported
effort dispatch and a held gate with attempted writes, normal completion and
crash recovery. The changes are locally reversible. No equivalent alternative
has been measured, so no performance saving is claimed. Entry collection first
had no fresh counter; the successful retry reported 144,816 total tokens,
127,744 cached input, source `codex-transcript-counter`, scope `dispatch`, at
2026-09-11T23:11:14.671Z. Handoff records a fresh observation.

Operator steering during repair: frequent Claude and Codex upgrades make exact
version admission a recurring maintenance cost. Effort membership and version
compatibility remain separate: this repair enforces the existing observed set,
and makes no additional transport-version restriction. Reopen the version
policy when repeated re-probes obstruct operator flow; broader admission still
needs an explicit compatibility observation or a changed order contract.

The operator also clarified that F3 protects only files whose modification
invalidates the run. The initial whole-worktree refusal was too broad.
`gateTreeHash` includes every tracked or non-ignored candidate file, while
`observeSuiteInputs` additionally fingerprints installed dependencies and package
build outputs. The guard will share that installed-root inventory and permit
classified writes to ignored scratch paths outside those inputs. Unknown shell
destinations cannot prove exclusion and remain refused during an active gate;
this is an adapter limit, not a claim that every ignored file is an input.
The added read/write scope includes `harness-command.ts` and
`scripts/lib/suite-evidence.mjs`. The existing authority guard still owns
credentials, host-state and outside-worktree restrictions. Negative and positive
fixtures must prove the narrow boundary, including ignored-but-tracked files
and symlinks into protected inputs. This correction reduces policy resistance
without weakening the required stability outcome or removing the final snapshot
comparison.

Current-byte output review exposed two destination gaps in the bounded shell
adapter. Mixed quotation can hide an active wildcard whose expansion reaches
an ignore exception, and a tool-supplied working directory changes the meaning
of a relative path. Isolated probes reproduced both. The repair treats any
wildcard-bearing destination as opaque, resolves literal paths from the actual
working directory, and limits repository-helper read admission to the verified
root. Generated-hook fixtures cover both refusals and an admitted scratch write
from an explicit working directory. These are corrections to D003's selected
boundary; they introduce no new lock scope or authority.

The first full repair gate passed 36 suites but rejected the work-order
appendix's heading. The planning continuation contract requires `## Execution
record`; the repair expansion was incorrectly given its own level-two heading.
The heading now uses that existing contract, with the authorized scope text
preserved. No judged criteria or planning receipt were changed. Its 704.34-second
executed failure and passing diff check remain in the host evidence; the final
gate must pass after these corrections.

## WO-125-D004

```json
{
  "id": "WO-125-D004",
  "date": "2026-09-12",
  "dispatch": "Operator resume: fix; failure source VER-002",
  "decision": "Resolve physical write destinations component by component, preserve shell symlink traversal, and let the test release held gate stages instead of racing a fixed hold deadline.",
  "evidence": [
    "docs/verifications/WO-125/VER-002.md: F1-F3",
    "Local classification reproduces admitted NODE_MODULES and package/dist case aliases on this case-insensitive volume.",
    "packages/skeleton/src/harness-host.ts: shell destinations lose symlink/parent traversal through resolve before classification.",
    "scripts/test-harness.mjs: a 30-second hold competes with the generated-hook attempt matrix."
  ],
  "rejected": [
    "NoOp retains known input-changing writes and an intermittently failing required suite.",
    "Lexical normalization and realpath of only existing targets cannot describe dangling symlink writes.",
    "A larger stage deadline retains the race; the test should own release and timeout cleanup.",
    "Blanket scratch refusal would remove the operator-authorized useful scratch boundary."
  ],
  "reopenWhen": "A supported filesystem or tool resolves destinations differently, or the test-owned cleanup cannot terminate a held stage."
}
```

Correction to D003, 2026-09-12: its intended protection includes physical
destinations, but the implementation compared installed roots case-sensitively,
missed dangling link targets and normalized parent traversal too early. The
repair includes the shell call site in `harness-host.ts`, already inside the
authorized F3 scope, plus the classifier and its runner/generated-hook fixtures.
The absent WO-019 evidence directory still uses D001's replacement inputs.

Mission and critical path: stable, reproducible verification supports the
independently verified source-to-deliverable loop. Policy resistance / fixes
that fail and rule beating require actual protected destinations to refuse,
while ignored scratch remains usable. Tragedy of the commons and shifting the
burden favor removing the fixture race that wasted a full gate. Drift to low
performance rejects accepting a known flaky required suite. Escalation stays
bounded to existing paths and checks with no new permission step. Success to
the successful does not favor an incumbent mechanism: the fixed deadline loses
to explicit release. Seeking the wrong goal is judged by unchanged inputs and
reliable checks, not receipt volume.

Under Naive Interventionism, the existing marker ownership, scratch access,
transport behavior and final input comparison remain useful. The smallest
probes cover actual filesystem aliases, dangling and chained links, parent
traversal, and generated-hook dispatch. Changes are local and reversible;
unresolvable link cycles remain non-admitting. No equivalent alternative cost
was measured. Entry collection initially had no fresh counter; the successful
retry reported 153,790 total tokens (131,200 cached input), source
`codex-transcript-counter`, scope `dispatch`. Counts include useful work and
waiting; no efficiency or monetary saving is claimed.

The positive scratch probe found that Git rejects pathspecs below a directory
symlink. Classification now checks the lexical link entry and physical target
separately. The same traversal order applies to an explicit shell working
directory; its generated-hook case must execute under the supplied directory.
The new path matrix runs once through the shared classifier, while the existing
three-hook controls still cover all gate stages. This avoids multiplying every
new path by unchanged entry points; no measured speedup is claimed.

VER-002 O4's evidence timing concern was checked against the declared
`FEEDBACK_SOURCE_PATHS` inventory. This repair changes none of those source
bytes; feedback revision 001 passes its source, policy, regression and retained
live-verifier checks. Retain that fresh WO-125 edition rather than claim a new
live audit. Authority revision 003 and regenerated harness pins bind the new
gate classifier and host, whose behavior is exercised by the generated-hook
fixtures. The inventory's coverage limit is explicit; the feedback audit is
not evidence for gate path classification.
