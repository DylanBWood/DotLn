# WO-135 decisions

## WO-135-D001 — Remove recurring planning rescue with three bounded corrections

```json
{
  "id": "WO-135-D001",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Admit dated capability additions, validate current sequence topology through existing dependency projections, and refuse classified non-document planning writes.",
  "evidence": [
    "WO-068 FINAL-001 B1",
    "WO-052 FINAL-001 B1 and D005",
    "WO-135 acceptance criteria 1–6",
    "scripts/lib/plan-continuation.mjs",
    "scripts/work-orders.mjs"
  ],
  "rejected": [
    "NoOp preserves two observed review interruptions.",
    "Criteria-text admission retains the failure class.",
    "A scheduler, separate start receipt or arbitrary shell interpreter adds unneeded machinery."
  ],
  "reopenWhen": "An admitted capability row lacks verification/review, topology diverges from activation semantics, or a classified write bypasses the boundary."
}
```

- Date: 2026-09-17.
- Dispatch: `resume: next`.
- Evidence: WO-068 FINAL-001 §B1, WO-052 FINAL-001 §B1 and D005;
  `plan-continuation.mjs` rejects unknown ids; `parseSequence` discards blank
  groups; the generated hook currently has writer and live-gate refusals.
- Decision: admit appended dated addition/reassessment sections for judged
  orders and classify an unknown id as `dated-capability-addition`; share a
  current-sequence topology check using existing projected typed dependencies;
  classify known planning-branch write destinations using the existing physical
  path resolver. Keep original receipt subjects and parser output unchanged.
- Mission and critical path: remove the repeated planning rescue after a
  capability-introducing order's review and catch dependency-order and planning
  source-write mistakes before the source-change/verification run depends on them.
- Alternatives: NoOp retains the two observed review interruptions. Criteria-text
  admission repeats the defect when the id is not named in a criterion. A new
  scheduler, start receipt or shell interpreter adds machinery without evidence
  it removes more work; reuse branch creation, dependency projection and the
  bounded shell path adapter. Opaque commands remain host-delegated.
- System traps: policy resistance and shifting the burden are addressed by
  admitting required write-backs without another planning dispatch; drift to low
  performance and seeking the wrong goal are checked by replaying the actual
  failures; rule beating is checked with malformed additions, dependency pairs
  and physical-path aliases. Escalation and tragedy of the commons favor shared
  helpers without a new ritual. Success to the successful does not justify
  retaining the old gate: the narrower criteria-text alternative was rejected
  on the cited second occurrence and planning decision 3.
- Naive Interventionism: preserve useful receipt immutability, level review,
  typed closure/release semantics, external scratch and ordinary host delegation.
  Fixture probes precede regenerated bundles and full checks; all edits remain
  uncommitted and reversible. No capability is introduced or promoted.
- Reopen: an admitted capability row receives neither verification nor final
  review; a dependency projection differs from activation; or a classified
  planning write bypasses the repository/document distinction.

## WO-135-D002 — Preserve the original sequence fixture after the WO-141 recut

```json
{
  "id": "WO-135-D002",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Pin the historical fourteen-pair sequence and its satisfaction state; independently check the current fifteen-pair sequence.",
  "evidence": [
    "4576594 original vision-into-use sequence",
    "8bb00ef later WO-141 recut"
  ],
  "rejected": [
    "Assert fourteen against current HEAD: contradicts the subsequent committed sequence.",
    "Use current closure in historical failures: future closes erase regression evidence."
  ],
  "reopenWhen": "The historical fixture source is unavailable or a new grouping contract is adopted."
}
```

- Date: 2026-09-17. Dispatch: `resume: next`.
- Evidence: the vision-into-use revision `4576594` has fourteen queued pairs
  and one serial tail; the later WO-141 pass `8bb00ef` has fifteen queued pairs.
- Decision: pin the original historical grouping required by criterion 3 and
  also check the current sequence. Do not rewrite the order or historical
  receipts to make the current fifteen-pair sequence appear to have fourteen.
- Alternative: asserting fourteen against current HEAD contradicts the later
  committed planning direction. Reopen if the fixture source is unavailable.

## WO-135-D003 — Operator-expanded permissions configuration guidance

```json
{
  "id": "WO-135-D003",
  "date": "2026-09-17",
  "dispatch": "scope expand: during resume: next",
  "decision": "Install only the explicitly authorized personal SSH/SCP/SFTP forbidden rules; retain current Codex TOML and explain command denials separately from sandbox path restrictions.",
  "evidence": [
    "Operator scope expand and subsequent instruction to add SSH/SCP/SFTP bans",
    "Installed Codex CLI 0.154.0",
    "Versioned Codex execution-policy and orchestrator source",
    "Twelve combined-policy forbidden results and two allowed controls"
  ],
  "rejected": [
    "Switch back to a filesystem permission profile: operator chose to retain sandbox off.",
    "Claim command rules cannot work with full access: contradicted by the versioned source."
  ],
  "reopenWhen": "The installed Codex changes rule enforcement or the operator requests a different restriction profile."
}
```

- Date: 2026-09-17. Dispatch: `scope expand:` during `resume: next`.
- Operator reports Claude sandbox off and auto mode on with its settings file
  unchanged; Codex now uses `approval_policy = "never"` and
  `sandbox_mode = "danger-full-access"`, removing `approvals_reviewer`.
- Scope: research and prepare the supported Codex equivalent of the supplied
  SSH command and sensitive-file deny rules. Source current official docs and
  the installed CLI; do not infer enforceable path restrictions from role text
  or expose credential contents. Keep personal configuration out of this repo.
- This report is operator-attested, not a new live Claude enforcement probe.
  Configuration choice and executable validation are recorded below.

- Initial direction: the operator said to leave settings as they were; no
  personal settings or rules were changed at that point. Codex 0.154.0's exec-policy source confirms a matching
  forbidden command rule is rejected even with approval never and full access;
  path denials require sandbox enforcement. A disposable policy check and
  harmless-path sandbox probe were executed, without reading sensitive files.
- Correction: initial guidance left command enforcement under full access
  unverified; the versioned execution-policy and orchestrator source resolves
  it affirmatively. Do not conflate this with filesystem deny support.
- Sources: official [permissions](https://learn.chatgpt.com/docs/permissions),
  [rules](https://learn.chatgpt.com/docs/agent-configuration/rules), and the
  [0.154.0 policy implementation](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/exec_policy.rs).

- Later steering: the operator explicitly authorized the SSH/SCP/SFTP rules.
  Added one personal rules file outside the repository, matching bare and
  `/usr/bin/` command names; kept the TOML approval and sandbox settings intact.
  The installed combined policy returns forbidden for twelve bare/argument
  cases and does not forbid `git status` or `ls`. No command was launched by
  these policy checks, and the sensitive-file profile was not installed.


## WO-135-D004 — Complete the classified release assignment

```json
{
  "id": "WO-135-D004",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Stage patch application v0.29.3, compiler 0.13.1 and skeleton 0.25.2.",
  "evidence": [
    "WO-135 patch classification",
    "Latest local tag v0.29.2",
    "Changed compiler and skeleton source"
  ],
  "rejected": [
    "No release contradicts the standing opt-out default.",
    "A minor bump implies capability scope this order excludes."
  ],
  "reopenWhen": "A sibling publishes the target before final integration."
}
```

- Date: 2026-09-17. Dispatch: `resume: next`.
- Evidence: activation left the order's version placeholder; latest local tag
  is `v0.29.2`. Source changes touch compiler and skeleton, whose current
  package versions are `0.13.0` and `0.25.1`.
- Decision: stage application `v0.29.3`, compiler `0.13.1`, skeleton `0.25.2`
  under the order's patch classification, preserving public schemas and receipt
  subject composition. Kernel and console have no source changes.
- Alternative: no release conflicts with the standing opt-out default; a minor
  bump would imply a capability addition this order excludes. Reopen on a
sibling release collision at final review, under the existing classification.

Final manifest review found skeleton's exact compiler dependency still pinned
to `0.13.0`; `npm ls @dotln/compiler --json` reported `ELSPROBLEMS` against the
staged workspace `0.13.1`. The dependency and lockfile reference now track
`0.13.1`. This completes the same release assignment without adding a dependency.

## WO-135-D005 — Preserve both modes and their configuration locations

```json
{
  "id": "WO-135-D005",
  "date": "2026-09-17",
  "dispatch": "scope expand: update an AI security document",
  "decision": "Update the existing AI harness security runbook with current mode choices, both sandboxed and unsandboxed variants, tool-rule versus filesystem boundaries, and separate settings/rules locations for Claude and Codex. Retain earlier dated evidence as historical reference.",
  "evidence": [
    "Operator request during WO-135",
    "Official Claude settings, permission-modes, permissions and sandboxing docs",
    "Official Codex config, permissions and rules docs",
    "Codex 0.154.0 source and installed command-rule checks"
  ],
  "rejected": [
    "Overwrite historical probe results: would misrepresent their observed scope.",
    "Treat all denials as OS isolation: both vendors document command parsing limits.",
    "Change additional settings during documentation work: outside this expansion."
  ],
  "reopenWhen": "Vendor behavior or installed versions change, or a fresh effective-state observation contradicts the recorded mode."
}
```

This expansion removes repeated setup confusion without adding a gate or
changing another setting. Policy resistance and rule beating require naming
the actual enforcement layer; burden shifting, drift and wrong-goal risk favor
one current reference with reproducible checks. Commons, escalation and success
to the successful favor updating the existing runbook over a parallel document.
Naive Interventionism: preserve prior measurements and distinguish documentation
claims, operator reports and executed checks. NoOp leaves the earlier sandboxed
default presented as current after the operator changed modes.

Documentation review also corrected the older claim that Codex read-only mode
requires approval for every shell command: contained reads can run without
escalation. Current Claude documentation says Read denials also affect built-in
Edit/Write, so the comparison now names the process boundary and NotebookEdit
exception instead of implying those paths permit ordinary writes. Sources are
linked in the runbook; historical measured results are preserved.

## WO-135-D006 — Admit the exact inherited release-header format correction

```json
{
  "id": "WO-135-D006",
  "date": "2026-09-17",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "Classify only the exact same-axis evidence-only release-prefix correction as an execution update, preserving the remaining byte comparison and immutable receipts.",
  "evidence": [
    "Document gate rejected inherited WO-136 release-classification bytes",
    "Receipt 017 subject versus HEAD: only the assigned title and exact prefix changed",
    "scripts/lib/release-preparation.mjs requires a period after the release axis",
    "Independent read-only source comparison agrees the description is unchanged"
  ],
  "rejected": [
    "NoOp leaves the current documented release preparation incompatible with continuation.",
    "Rewrite WO-136 or the historical receipt: obscures the judged source.",
    "Ignore release metadata broadly: would admit changes to the axis or declared scope."
  ],
  "reopenWhen": "The release grammar changes or a fixture admits a changed axis, evidence-only status or description."
}
```

The bounded adjacent repair removes a discovered gate incompatibility on the
critical path. Policy resistance and burden shifting favor fixing the shared
helper; drift and wrong-goal risk require exact byte checks. Rule beating is
tested by changed axis, description and evidence-only status. Escalation,
commons and success-to-the-successful risks favor one existing classifier over
new exceptions or a second receipt system. Naive Interventionism: normalize
only the exact prefix, retain the full remaining comparison, and leave the
judged source and receipt unchanged. The queue records the scope, announcement,
steering opportunity and required checks.
The operator subsequently confirmed "Keep the planned repair next."

## WO-135-D007 — Integrate the moved main, retime the collided release and re-record the two invalidated editions

```json
{
  "id": "WO-135-D007",
  "date": "2026-09-18",
  "dispatch": "resume: final review",
  "decision": "Merge main at f7ec9f3 into the preserved WO-135 state; retime the unpublished application target from v0.29.3 to v0.29.4 and skeleton from 0.25.2 to 0.25.3 under the existing patch classification, keeping compiler 0.13.1; record authority revision 003 deterministically and feedback revision 003 from a fresh live Codex verifier audit on the integrated tree.",
  "evidence": [
    "docs/product/07-execution-guide.md#independent-workflows-and-integration",
    "docs/evidence/WO-135/decisions.md#wo-135-d004",
    "origin tag v0.29.3 at f7ec9f3 (WO-053, PR #86)",
    "docs/evidence/WO-135/authority/003/authority.json byte-identical to revision 002",
    "docs/evidence/WO-135/feedback-003/feedback.json differs from revision 002 in subject only",
    "docs/product/06-roadmap.md WO-135 collision retiming note"
  ],
  "rejected": [
    "NoOp on the collision: v0.29.3 and skeleton 0.25.2 are published by WO-053, so release close would refuse the target.",
    "Select WO-053's feedback edition: stale on the merged tree in both subject and policy hash.",
    "Carry feedback revision 002 forward: validateSelfhost requires the audited subject to equal the current sources, and WO-053's worker-transport.ts and worker-protocol.ts are raw members of that subject.",
    "Hand the live audit to the operator: the precedent's reason was a sandboxed session that could not launch a child CLI; this session runs unsandboxed, and the executor ran the same audit from this worktree."
  ],
  "reopenWhen": "A later merge moves the feedback subject again, the published baseline advances past v0.29.4 before close, or the operator withdraws the reviewer-launched live audit as evidence."
}
```

- Date: 2026-09-18 (UTC, the date the release helper wrote into the retiming
  note). Dispatch: `resume: final review`.
- Evidence: `main` advanced eight commits to `f7ec9f3`, merging WO-053 as PR #86
  and publishing annotated tag `v0.29.3` with skeleton `0.25.2`, the exact
  application and skeleton versions D004 staged; D004's reopening condition
  named this literally. `npm run release -- prepare`, on origin's tag
  observation, retimed the order heading, the README claim and the dated
  roadmap note to `v0.29.4`; skeleton moved by hand to `0.25.3` in its package,
  in `HARNESS_HOST_VERSION` and in the lockfile workspace entry because the
  helper never alters component versions. Compiler `0.13.1` stays: `main`
  publishes `0.13.0`.
- Decision: follow the preserve → merge → apply → regenerate procedure
  (integration refs `refs/dotln/integration/WO-135/pre-merge` and `merged`);
  regenerate the bundle, the console fixtures, the index, the decisions index,
  the follow-up register and the publication lock; record authority `003`
  (transcript byte-identical to `002`, only `bundle-diff.json` moved with the
  re-emitted bundle) and feedback `003` from a fresh live audit whose verifier
  transport is `codex-cli-exec`; select both in `docs/evidence/current.json`.
- Mission and critical path: the order's purpose is to remove the recurring
  planning chore after a capability-introducing order; a stalled integration on
  a two-command evidence chore would reproduce the class of delay it removes.
- Alternatives: NoOp leaves a colliding target that release close refuses.
  Selecting the sibling's feedback edition or carrying `002` forward fails the
  gate by design. Deferring the live audit to the operator reproduces the
  integration hand-off the 2026-09-17 amendment names as the cost to remove; the
  audit is a local, bounded, ignored-store run with launch claims recorded and
  no effective readback, the same shape the executor recorded for `001`/`002`.
- System traps: shifting the burden and escalation favor completing the named
  integration list in one session; rule beating is checked because the live
  verifier judges the audit against the current sources, not this session's
  narrative; drift is checked by the byte-identical authority transcript and
  the subject-only feedback difference; commons cost is one Codex verifier
  episode. Success to the successful, tragedy of the commons beyond that
  episode, policy resistance and seeking the wrong goal are immaterial here.
- Naive Interventionism: no behavioral source changed at integration; the two
  version literals, the regenerated surfaces and the new editions are the
  smallest set the merged tree needs. Both pre-merge and merged states are held
  by refs; nothing was restored, cleaned or stashed.
- Reopen: a later merge moves the feedback subject again; the published
  baseline advances past `v0.29.4` before close; or the operator withdraws the
  reviewer-launched live audit as evidence, in which case a fresh operator-run
  edition replaces `003` and `003` is preserved as recorded.
