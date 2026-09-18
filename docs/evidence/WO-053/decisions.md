# WO-053 decisions — 2026-09-17

## WO-053-D001 — Execute the bounded live proof through the existing host API

```json
{
  "id": "WO-053-D001",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Use an evidence-local fixture consuming SourceChangeHost, compile an explicit worker base, preserve failed receipts and measure protected checkout bytes and the parent envelope channel.",
  "evidence": ["docs/work-orders/WO-053-first-external-source-change.md", "packages/skeleton/README.md", "packages/skeleton/src/source-change-host.ts", "packages/skeleton/src/dotln.ts"],
  "rejected": [
    {"option": "NoOp", "reason": "The existing source-change primitive still lacks live proof."},
    {"option": "Add a runtime CLI", "reason": "An existing public host API already supplies the required interface."},
    {"option": "Claim whole-session transcript containment from stdout bytes", "reason": "Only the explicitly named parent handoff channel is measured."}
  ],
  "reopenWhen": "The live episode reveals a blocker or its measured boundary differs from the intended proof. D002 supersedes the original runtime-repair deferral."
}
```

Operator dispatch: `resume: next`. WO-052 is closed and canonical status selects
WO-053 active. The installed executables report Claude Code 2.1.274 and Codex
CLI 0.154.0. Executor readback is Codex CLI 0.154.0, gpt-6-astra, ultra.

The mission contribution is evidence that the existing source-change primitive
actually changes external source and recovers its committed effect. The NoOp
baseline leaves that critical-path claim supported only by process doubles.
Use a synthetic repository, one module, one test and separate episode branches;
preserve all failed attempts. No employer source or operator repository is input.

The order names a `dotln source-change` route, but `src/dotln.ts` has none.
The skeleton README documents `SourceChangeHost` as an importable API. Choose
an evidence-local runner consuming that API. Adding a runtime CLI is rejected
by this order's explicit runtime-change exclusion; no runtime capability is
claimed. The fixture's focused test prints the module diff before its assertion:
the existing writer prompt requires reading the diff but its shell allowlist
admits only test, add and commit. This uses the declared test route without
changing the transport or its authority. Reopen if the actual episode cannot
complete through these existing interfaces.

The worker loadout is filed alongside the fixture, compiled from an explicit
base with no supports or grants that widen authority. Its source remains
uncommitted until final review, as required by repository policy. The receipt
records its byte hash and compiled identity; final review must publish those
same inputs. This does not pretend the new fixture was already on main.

Policy resistance / fixes that fail and rule beating are addressed by retaining
real refusal results and separately checking Git, tests and protected bytes.
Tragedy of the commons and escalation favor one sequential attempt per installed
harness and one recovery episode, with measured duration/available usage rather
than a broad benchmark. Drift to low performance and seeking the wrong goal
require red-to-green host tests and an actual commit, not merely a model's
completed envelope. Success to the successful is checked by attempting both
installed transports. Shifting the burden to the intervenor favors a reproducible
fixture and receipt over hand-edited source. Naive Interventionism: existing
runtime, account settings and publication controls remain the useful baseline;
the smallest probe is the isolated scratch branch, with all residue retained.
The compiled WorkOrder and host receipt are the reusable interface; this proof
does not claim verification, general sandbox confinement or a full vertical.

The kill point is the host's existing `afterResult` callback: the worker has
exited and committed, but no canonical host result event/effect receipt is durable.
The collector separately retains the returned envelope. Recovery uses
identical configuration and real lease expiry. A transport wrapper measures
the parent-facing envelope channel only; the full executor-session transcript
is a separate unknown unless actually measured. No output-byte count will be
relabeled as whole-session transcript growth.

## WO-053-D002 — Operator override: repair the live failures within this order

```json
{
  "id": "WO-053-D002",
  "date": "2026-09-17",
  "dispatch": "Operator correction during resume: next rejects deferring the blockers and preserves the right to override atomic work-order boundaries.",
  "decision": "Repair the live-discovered writer failures in WO-053 using native Claude structured output and bounded Codex inspection instructions; rerun both smokes and killed-host recovery without widening mutation routes.",
  "evidence": ["docs/evidence/WO-053/claude-clean.json", "docs/evidence/WO-053/claude-diagnostic.json", "docs/evidence/WO-053/codex-clean.json", "packages/skeleton/src/worker-protocol.ts", "packages/skeleton/src/worker-transport.ts"],
  "rejected": [
    {"option": "NoOp or another planning pass merely to fix the failures", "reason": "This exports the observed critical-path blocker to recurring operator intervention."},
    {"option": "Unrestricted shell or tolerant arbitrary-prose parsing", "reason": "The task needs bounded inspection and validated schema output, not broader effects or weaker validation."},
    {"option": "Treat the override as a permanent expansion policy", "reason": "The operator explicitly retained atomic orders as the default."}
  ],
  "reopenWhen": "A distinct defect requires materially broader capability or live evidence contradicts the bounded repair."
}
```

On 2026-09-17 the operator corrected the executor's suggestion that a runtime
failure should be left to another order. No existing repair owner had been
identified. That was the error: treating a scope fence as an adequate disposition
without a concrete repair or owner. WO-054 adds verification, WO-055 repair-loop
orchestration and WO-056 its live proof; none specifically owns these failures.
The operator then clarified that atomic orders remain the default, while direct
operator overrides take precedence when the boundaries impede progress.

This bounded override supersedes D1's refusal to change runtime for the two
observed blockers. Claude's clean and diagnostic episodes committed sum.mjs,
but `terminal.result` was not JSON; all 93 diagnostic stream lines decoded,
and the one terminal was successful. Codex returned a blocked envelope because
its tools require shell inspection while the prompt permits only test/add/commit.
Use native structured output and explicit bounded inspection instructions, retain
the exact mutation commands and pinned inspection profile, and rerun the live
proof. Adjacent item `adjacent-0001` owns implementation and executable checks.

Compared with NoOp or another planning pass containing only "fix it", this
removes the observed interruption on the same critical path. Compared with
unrestricted shell access or parsing arbitrary prose, it preserves authority
and result validation. The D1 trap analysis still applies; this correction
specifically reduces policy resistance, escalation and shifting the burden to
the operator. Reopen scope only for a distinct defect or materially broader
capability, not because these two repairs require runtime files. No general
operator-control suspension or future-order policy change is implied.

## WO-053-D003 — Close the actual transport failures and preserve the proof boundary

```json
{
  "id": "WO-053-D003",
  "date": "2026-09-17",
  "dispatch": "resume: next continued under the operator's bounded scope override",
  "decision": "Require Claude aggregate JSON structured_output, admit its data-only StructuredOutput tool through the target guard, and provide the fixture's exact Node executable. File successful Claude and Codex clean receipts and one Codex killed-host recovery; stage application v0.29.3 and skeleton 0.25.2 as patch releases.",
  "evidence": ["docs/evidence/WO-053/claude-json.json", "docs/evidence/WO-053/codex-fixed.json", "docs/evidence/WO-053/claude-schema.json", "docs/evidence/WO-053/codex-runtime.json", "docs/evidence/WO-053/codex-recovery.json", "packages/skeleton/test/source-change-host.test.ts"],
  "rejected": [
    {"option": "Accept display prose or a commit without a validated envelope", "reason": "Several failed episodes committed but did not satisfy the transport contract."},
    {"option": "Broaden effectful shell routes or change the inherited worker environment", "reason": "The guard needs only schema submission; the fixture can name its exact existing executable."},
    {"option": "NoOp after smoke success or repeat all live attempts", "reason": "The killed-host proof was still required; after both clean successes and that proof, extra identical live runs add cost without resolving an outstanding claim."},
    {"option": "Claim dependable operation, universal confinement or whole-conversation savings", "reason": "These receipts establish one bounded task and the measured parent handoff only."}
  ],
  "reopenWhen": "Independent verification finds a mismatch in the recorded subject, a supported CLI changes its native result contract, or another task needs an effect beyond the present writer contract."
}
```

The first schema repair was incomplete: stream mode and then aggregate JSON
both returned without `structured_output`. Inspection of the local target
journal found two refused `StructuredOutput` calls. The existing unknown-tool
guard was blocking the native data-only result submission. Classifying that
known tool as read permits output without changing the exact three host-issued
effectful Bash routes; the emitted-hook regression also rejects an unknown
output tool. Claude's final live receipt has a native structured envelope and
zero reported denials.

Codex's intermediate attempt reached inspection and editing, then reported the
focused test executable unavailable (127). The host process already knows its
Node executable. Using that literal path in the fixture's exact test command
fixes the runtime mismatch without changing account settings, installing a
dependency or inheriting additional environment. Receipt redaction removes
the machine-specific path. Codex's final clean and recovery episodes both have
host test exits 1 and 0 and matching one-file commit identities.

The recovery episode kills the host only after the worker has exited and before
canonical host result persistence. It observes one attempt, one commit and
recovery by that identity. The parent handoff is an actual measured transcript
file; full executor-conversation growth remains unknown. The final loadout and
both historical editions retain their exact bytes. Fixture/readme changes do
not turn earlier failed attempts into successes.

Against the D001 trap analysis, these corrections close fixes that fail and
policy resistance using observed failures, keep the burden off another operator
planning pass, and preserve the goal of a real bounded source change. One
repository, both installed transports and one kill proof avoid escalation and
shared-resource waste. Retaining failures prevents drift to a weaker success
definition and selective reporting. The NoOp baseline is now different: the
required live outcomes have been observed, so additional model episodes are
unnecessary unless regression checks or independent review reveal new evidence.

The application patch target is the next local release after `v0.29.2`.
Skeleton `0.25.2` contains compatible corrections to the existing writer;
compiler, kernel, console, event schemas and external dependency versions stay
fixed. New evidence editions and bundle pins must reflect these source bytes;
historical editions remain immutable. The R2 planning checkpoint receives this
receipt but its combined decision still requires WO-111, so no waiver or first
portfolio edit is inferred. Ledger substitution is the decisions index, as
required for this order's pre-2026-09-09 filing date.
