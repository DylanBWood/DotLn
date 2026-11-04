# WO-254 VER-001 evidence

Recorded 2026-11-04 by the independent verifier, Codex CLI 0.166.0,
gpt-6-astra at xhigh (`codex-session-readback`). The subject code identity is
`5842e21bfd71c80a4efc4c78aef3d6a6873793d8b4dd906a3d9c271b7145fe3e`.
This evidence covers local macOS execution and fixtures. It does not establish
native Codex prompt-event delivery or Linux behavior.

## Executed probes

Each command below ran sequentially beneath
`node scripts/harness.mjs bounded --`. No worker was launched.

| Command after the wrapper | Result | Evidence observed |
| --- | --- | --- |
| `node --test --test-name-pattern WO-254 scripts/test-harness.mjs` | exit 0, 6 passed | Live and real zombie holders; exact recovery commands; second dispatch event binding; question forms and role roots; quiet advisories; relocated-root runtime-free writer admission. |
| `node --test --test-name-pattern WO-254 scripts/test-codex-continuation.mjs` | exit 0, 4 passed | Both required pause messages, long and numerous captures, UTF-8 boundary, first versus last reply, repair attribution, failed capture with reservation, stopped turn release and next prompt reservation. |
| `node --test --test-name-pattern WO-254 scripts/test-plan-refutation.mjs` | exit 0, 1 passed | Full planning check accepts the direction row and rejects question, missing-row and digest cases; empty block is emitted. |
| `node --test --test-name-pattern WO-254 scripts/test-target-worktree-start.mjs` | exit 0, 3 passed | Bootstrap denial on stderr and stdout and activation spawn denial each remove both fresh worktrees and branches, record the denial and permit a fresh start. |
| `node --test --test-name-pattern 'WO-139 Codex executor and fix completion automatically release after the final index' scripts/test-harness.mjs` | exit 0, 1 passed | Real-runtime Codex lifecycle fixture: previews retain ownership; stopped publishing commands release and journal the stop, before and inside the attempt. |
| `npm run format:check` | exit 0 | All matched implementation files use Prettier style. |
| `npm run publication:check` | exit 0 | 256/256 headings covered; both publication source locks current; bootstrap checks pass. |
| `node scripts/harness.mjs check` | exit 0 | 42 generated surfaces current; local-terms list present. |

`git diff --check` also exited 0. No package dependency was added: the lockfile
changes only the compiler/skeleton versions and their existing dependency pins.
The complete review row includes the self-start rollback, release retry,
exported operator-record, carry-in and remaining implementation cases not
rerun above. The source and relevant changed tests were read before judgment.

## Independent variations and the nonblocking diagnostic observation

The retained [probe](ver-001-probes.mjs) uses isolated fixture repositories,
ordinary supported hook events and synthetic messages. Run it from the project
root:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-254/ver-001-probes.mjs
node scripts/harness.mjs bounded -- node docs/evidence/WO-254/ver-001-probes.mjs --generated
```

The second form invokes the installed `.codex/hooks/continuation.mjs` through
its JSON input/output interface. The first calls the source adapter. Both were
executed from session scratch before the formatted reproduction was filed here;
formatting changes no probe behavior. Both reported:

```json
[
  {
    "probe": "two compactions in one turn before Stop",
    "expected": [
      "First reply after compaction 1",
      "First reply after compaction 2"
    ],
    "observed": ["First reply after compaction 2"],
    "met": false
  },
  {
    "probe": "dispatch cutoff, repeated message, Unicode and linebreaks",
    "met": true
  },
  {
    "probe": "rules direction, contradicted class, notification, mismatched digest and missing row",
    "met": true
  }
]
```

Both exit 1 because the experiment asks for two diagnostic samples. The
operator's message is restored verbatim after **both** compactions, asserted
before either diagnostic result is read. The capture cutoff excludes a prior
dispatch's message, retains repeated messages and preserves Unicode and line
breaks. The independent rule-provenance variations pass.

The experiment's two-sample expectation is broader than criterion 6's stated
fixture. It is not a failing acceptance gate. The existing criterion fixture
passes, and main had no compaction-probe history to regress. The latest sample
is the expected consequence of saving one compaction and reading the first
reply after the transcript's last `compacted` entry at Stop. Documentation could
state that scope more precisely. [D049](decisions.md#wo-254-d049--verification-the-stop-samples-the-latest-compaction-broader-diagnostic-history-is-a-follow-up)
records the verifier's corrected interpretation and named follow-up. No waiver
was inferred from the operator's observation.

## Gate and generated evidence consumed

The verifier read `gateCodeIdentity` and the canonical gate rows directly.
The passing `npm test -- --review` row at the identity above was recorded
2026-11-04T21:57:59.290Z, tree
`e0469b4c67b75d80b4f319f61e5cb2716e4ac99e`, exit 0, no unrun suites;
`gateCheckStands` returned true. Its structural companion is passing. The
executor's passing document row was recorded 2026-11-04T22:02:54.197Z. A new
`npm run test:docs` row is required after these verification documents and
indexes are finished; the result transition consumes that row rather than
running a gate itself.

The feedback episode is an actual self-host run, recorded in D022 and
`feedback-002/edition.json`: `liveAudit.carried` is false, the component pins
are compiler 0.39.0 and skeleton 0.83.0, and the audit and verification records
are present. The console manifest points to that edition. The current evidence
index names authority 007 and artifact-identity, verification and feedback
editions under WO-254. Generation and gate checks judge oversized generated
outputs; no claim of a manual review of every generated byte is made.

The verifier read all execution review rounds (criteria/design/consistency in
rounds 1 and 2, combined round 3, and the repair's combined round 3), the
executor's dispositions D026–D048, and the implementation diff. The reproduced
fixes include capture failures, long restores, first-versus-last replies,
relocated roots, activation spawn/output denials and stopped release commands.
No earlier blocking finding was reproduced at this subject.

## Read and process limits

The two abbreviated historical journals cited by the order were absent from
this worktree's `docs/control/local/harness` search. Their incidents were read
in the cited planning pass's Readings and the decisions; they are not claimed
as directly re-observed. Present behavior was tested independently.

Some initial status/diff/report reads exceeded their output budgets. Relevant
fields and omitted substantive sections were reread in narrower selections;
generated artifacts are supported by checks. One unquoted zsh glob failed
before its Git read, and later guessed search filenames did not exist. The
actual paths were located and read; neither failed lookup supports a claim.
These are verifier process errors, not product failures. The experimental
exit-1 interpretation was corrected in D049 rather than hidden or converted
into a passing observation.

The machinery under review also supplies the bounded wrapper, lifecycle,
writer view and gate records used here. Direct fixture assertions, emitted
hook subprocesses and Node/Git output provide additional observations, but no
claim is made of an instrument-independent audit of that entire machinery.

## Completion-header correction

The first post-edit document gate passed at 2026-11-04T22:14:47.570Z
(27 passed, 0 failed). The subsequent completion attempt refused before recording
a verdict: the report's actor JSON included an extra `accountLabel` field,
while the supplied completion flags normalize to the five harness, version,
model, effort and source fields only. The unfiled report was corrected to the
exact expected actor JSON; no attestation value changed. A new document gate
follows that edit before retrying completion. The refusal was a verifier
report-format error, not a product failure. The lifecycle's discovery advisory
also says this CLI/effort pair has no matching discovery observation; the actor
attests the active Codex session readback, not an independent discovery probe.
