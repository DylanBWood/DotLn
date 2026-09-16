# WO-051 — Source-change writer request and transport profile: a separate writer request with its own validator, prompt and result beside the untouched inspection request, and a `source-change-v1` launch shape for both CLIs taken row by row from the writing-worker record (v0.24.0)

**Model:** any capable model for the profile and fixtures; no live launch
in this order (the live smoke is WO-053's). State the model and effort
actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any. Recommendations
(WO-132).
**Release classification:** minor. It adds a second request kind, a profile
type with a non-empty writable surface and a transport dispatch branch; the
inspection profile, its canonical arguments and the Beacon perception
profile are unchanged. Assigned at activation under the standing opt-out
default.
**Cost:** adds a request kind, a profile type and a dispatch branch, about
3 s of fixture wall-clock with process doubles, and no live launch, receipt,
hook or operator step. Removes nothing that exists today; the justification
is the critical-path gate D2: WO-052 and WO-122 hard-depend on it and
WO-053 dispatches through it. Context bytes and tokens are unmeasured; the
executor records entry and handoff usage when available.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
D2, the adapter slice), cut as a bounded order at the operator's same-day
correction. Redesigned at the mandatory R1 checkpoint by the 2026-09-16
planning pass from rows C-W1, C-W2, C-W3, C-W6, C-W8, C-W9, C-U2, X-W1,
X-W2, X-W6, X-W8 and X-U2
([writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md);
[the R1 replan document](../planning/r1-replan-2026-09-16.md) §1).
Planner-synthesized draft; captures and hashes in the ledger sections of
both dates. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-044 merged (the rows the profile is written from,
satisfied at `v0.17.7`); WO-042 merged (the profile's envelope comes from
the compiled build's base and explicit grants); WO-009 merged (the
transports this order extends; satisfied at `v0.10.0`). All closed.
**Recommended placement:** lane pair with WO-049, whose surfaces are
disjoint. It edits `packages/skeleton/src/worker-protocol.ts`,
`worker-transport.ts`, `execution-environment.ts`, `worker-store.ts`
(the request key) and their tests. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-044",
    "relation": "satisfied-by-close",
    "reason": "the profile is written from observed rows, never assumed"
  },
  {
    "workOrderId": "WO-042",
    "relation": "satisfied-by-close",
    "reason": "the profile's envelope comes only from the base and explicit grants"
  },
  {
    "workOrderId": "WO-009",
    "relation": "satisfied-by-release",
    "release": "v0.10.0",
    "reason": "the transports it extends"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports
(`WorkOrderTransport`; the canonical launch shapes) and §Runtime primitive
catalogs; 02-domain-model.md §Identity and composition (AuthorityEnvelope;
effects `repo.write`, `git.local`, `repo.push`) and §Actors and episodes
(the result envelope); 09-audit-resilience-privacy.md §Privacy and
minimization; [writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md)
rows C-W1, C-W2, C-W3, C-W6, C-W8, C-W9, C-U2, X-W1, X-W2, X-W6, X-W8, X-U2;
`packages/skeleton/src/worker-transport.ts` (`canonicalWorkerArgs`,
`CliWorkOrderTransport.dispatch`, `decodeResult`), `worker-protocol.ts`
(`WorkerRequest`, `validateRequest`, `workerPrompt`, `parseWorkerResult`),
`execution-environment.ts` (the profile union, `writableSurfaces`),
`worker-store.ts` (`workerRequestKey`); `docs/AI-HARNESS-SECURITY.md`
§Current posture.

**Objective:** Add a writer request beside the inspection request and a
`source-change-v1` profile to both transports. Claude Code launches with
`--tools Bash,Read,Edit,Write` and `--allowedTools` naming `Edit`, `Write`,
`Read` and exactly three Bash patterns (the request's declared test command,
`git add -A`, `git commit -F <host-written message path>`), with
`--permission-prompts none`, `--setting-sources project,local`,
`--no-session-persistence`, an empty strict MCP configuration, no browser, a
budget cap and `stream-json` output with hook events (C-W2, C-W3, C-W4,
C-W8, C-W9, C-U2). Codex launches with `-a never exec --ephemeral
--ignore-user-config --sandbox workspace-write --cd <worktree> --json` under
the named write profile `dotln-writer` (`:minimal` read, `:workspace_roots`
write, network disabled) and the existing hardening flags (X-W1, X-W2,
X-W8). The base envelope allows `repo.write` and `git.local` inside the
worktree and denies remote, credential, settings and sandbox effects; the
execution environment's `writableSurfaces` names exactly that worktree; the
result is the six-field envelope plus the observed commit identity and the
observed denial count; a profile field whose row is `unavailable` or
`ambiguous` refuses to construct, naming the row.

**Observed gap (dated 2026-09-16, `main` at `b7914ed`, v0.22.0):**

- Both transports launch with every tool disabled (`--tools ""`,
  `--safe-mode`; the Codex read-only profile). The `writableSurfaces:
  readonly []` tuple belongs to the Beacon perception profile; the
  inspection worker uses `fixture-inspection-v1` with one read mount, its
  validator requires `repo.inspect` and prohibited `repo.write` and
  `repo.delete`, and its prompt instructs inspection only.
- `repo.write` exists as an effect id with no transport that can exercise
  it.
- The record: `--tools` alone admits nothing (C-W1, ambiguous); exact
  `--allowedTools` patterns admit the edit, the write and the one command
  (C-W2); a request with no terminal is auto-denied (C-U2); neither sandbox
  confines a sibling write (C-W6, X-W6) while the Codex named profile does
  (X-W2); the Claude result carries `permission_denials`, `total_cost_usd`
  and `usage` (C-W8) and the Codex JSONL carries item and turn events with
  no denial field (X-W8); Codex `on-request` approval is ambiguous (X-U2).

**Design (scope discipline):**

- A `WriterRequest` beside `WorkerRequest`: intent `Act` with effect
  `repo.write`; a `source-change-v1` profile whose one mount is the worktree
  with `read-write` access; `repo.write` and `git.local` in the WorkOrder's
  allowed operations and every remote, credential and settings effect in
  its prohibited operations; one declared test command (an exact string with
  no shell metacharacters); the commit-message path inside the worktree
  (written by the host before launch; WO-049's exclude hides `/.dotln/`).
  Its own prompt: edit within the mount, run exactly the declared command,
  read the diff, run `git add -A` then `git commit -F <path>`, return the
  envelope; never compose a commit message, never touch `.claude/`,
  `.dotln/` or the message file. Its own result parser. The inspection
  request, validator and prompt are byte-identical and their refusals are
  re-proven.
- A `SourceChangeProfile` type (`profileId: "source-change-v1"`, one
  `read-write` mount) joins the profile union; the Beacon tuple is untouched;
  the environment refuses a mount that is not a Git worktree directory, that
  contains the launchpad checkout, or that lies outside the configured
  worktree parent, and a message path outside the mount.
- Transports dispatch on the request's kind: a writer request selects the
  `source-change-v1` canonical arguments per harness, each argument taken
  from the record with its row id cited beside it; an inspection request
  selects today's arguments, byte-identical.
- The result envelope gains `observedCommit` (`{ sha, branch }`, filled from
  `git rev-parse` in the worktree after exit and absent when `HEAD` did not
  move) and `observedDenials` (the Claude `permission_denials` count, or
  `unavailable` for Codex). The six existing fields are unchanged.
- Construction refuses when the record's row for a requested field is
  `unavailable` or `ambiguous`: a `--tools`-only Claude form (C-W1), a Codex
  `on-request` approval (X-U2), any Codex hook expectation (X-W3).
- **Declined alternatives, recorded:** a general tool-policy language (the
  profile is two shapes); wildcard Bash patterns (unobserved); a
  model-composed commit message (the host writes it, keeping attribution and
  camouflage in the host); running the worker in the launchpad checkout with
  a path allowlist (containment must be the worktree); the interactive
  harness modes; a sandbox containment claim (C-W6, X-W6).

**Deliverables:** the writer request, validator, prompt and parser; the
profile type; the transport dispatch; the envelope fields; fixtures with
process doubles; the write-backs below. The live smoke is WO-053's.

**Acceptance criteria (all required)**

1. The inspection profile's canonical arguments for both harnesses are
   byte-identical to the activation base, pinned as a fixture.
2. The writer validator accepts a conforming request and refuses one with
   `repo.inspect` intent, a read-only mount, a missing `repo.write`
   allowance, a remote effect in the allowed list, a declared command with
   a shell metacharacter, or a message path outside the mount; the
   inspection validator still refuses a request carrying `repo.write` or a
   writable mount (both pinned); the source-change arguments for both
   harnesses equal the record's rows, pinned with the row ids; a field whose
   row is `unavailable` or `ambiguous` refuses construction naming the row.
3. The execution environment refuses a writable surface that is the
   launchpad checkout, a non-worktree directory or a path outside the
   configured worktree parent; accepts a scratch worktree; every existing
   environment fixture passes.
4. With process doubles, a source-change episode returns the six-field
   envelope plus `observedCommit` when the double commits and without it
   when the double exits with an edited, uncommitted tree (the C-K1 shape);
   `observedDenials` is decoded from a recorded `stream-json` result with
   C-W8's field names and is `unavailable` for a recorded Codex JSONL
   result.
5. Write-backs land: 03 §Ports (the second profile and the sentence that
   the sandbox is not the containment boundary), `docs/AI-HARNESS-SECURITY.md`
   §Current posture (one sentence), skeleton README runbook, the decisions
   file.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; `npm test` once at final
review; the evidence edition.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** the host that creates worktrees, writes the message file and
records episodes (WO-052); the live smoke and the host's containment proof
(WO-053); any remote effect; the repair loop; a third harness; the Beacon
perception profile; wildcard Bash patterns; Codex `on-request` approval.

**Operator-review assumptions**

1. Worktree-confined governance (the target hook, the Codex named profile
   and the host's diff check) is the containment for the first proof; it is
   not a security boundary against a hostile model.
2. The host writes the commit message; the worker's commit is
   `git commit -F` over that file.
3. The declared test command is one exact string; a target that needs more
   is a later profile with its own rows.

## Execution record

Operator-authorized ideation breakout, 2026-09-16: the operator's `ideation:`
dispatch adds the document-only local-model experiment synthesis and next-pass
priority. Read [the breakout receipt](../evidence/WO-051/ideation-local-models.md),
the 2026-09-16 local-model experiments and guided operator work-order ledger
entries, product 06 §Candidate — local-model usefulness experiments and product
07 §Candidate — guided operator work orders during verification and final
review. This adds no local-model implementation or live launch to this order;
the receipt records unresolved setup and worktree-local intake reconciliation.

Executor decision after operator direction, 2026-09-16: perform the existing
read-only feedback audit needed for current runtime evidence; retain the new
source-change live smoke in WO-053. The operator directed the executor to make
and log routine workflow decisions for later review. See WO-051-D003; this is
not a live source-change launch or a substitute for independent verification.
