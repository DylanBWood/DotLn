# WO-065 — Pull-request state observation: a read-only adapter projects a pull request's checks and review comments into typed, classified events on demand (version assigned at activation)

**Model:** any capable model; the live smoke is operator-run. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A read-only external adapter and one
event type. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H, the observation slice), cut as a bounded order at the operator's same-day
correction; the parity item "resolves every automated review comment"
needs the comments observed first. Planner-synthesized draft; captures and
hashes in the ledger section of that date. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-064 merged (a pull request to observe); WO-060 merged
(the screen every stored comment passes). After WO-068, the resident's
`pull-request-observe` cadence is the ordinary invoker; the command stays
operator-invocable.
**Recommended placement:** after WO-064; it edits `packages/skeleton/src/`
(a new pull-request observer) and reuses the `gh` helper and stub. A
recommendation, not a dependency token.

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (CI classification and comment triage);
03-architecture.md §Ports; 09-audit-resilience-privacy.md §Privacy and
minimization; `scripts/github-repository.mjs` (the GitHub helper and its stub).

**Objective:** `observePullRequest(repo, number)` reads the head sha, check
runs and review comments through `gh` in JSON mode and appends one
`PullRequestStateObserved` event carrying `{ number, headSha, checks[], comments[] }`
where each check is `{ name, state }` and each comment is
`{ id, role, path?, line?, text, resolved, class }` with `class` from
`ci-failure`, `automated-review`, `human-review`, `resolved`; observation is
invoked by the resident's cadence when a resident runs and by the operator
otherwise, never by a daemon of its own; identical state appends nothing.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Nothing reads a pull request back; the predecessor's loop resolves
  automated review comments and DotLn cannot see them.

**Design (scope discipline):**

- Role labels as in WO-062; automation accounts by a declared pattern;
  comment text is stored as a span source for WO-066's repair derivation.
- **Declined alternatives, recorded:** a poller of its own (the resident's
  cadences own timing); writing to the pull request (WO-066's disposition).

**Deliverables:** the observer, the event, recorded fixtures, a live smoke
record, the write-backs below.

**Acceptance criteria (all required)**

1. Over recorded JSON, the observer classifies a failing check, an
   automated review comment, a human comment and a resolved comment as
   pinned; a second observation of identical state appends no event.
2. A recorded comment containing a secret-shaped token is refused by the
   WO-060 screen before storage.
3. A live smoke against the WO-064 scratch pull request records the event
   with identifiers reduced to shapes.
4. Write-backs land: 02 (the event), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the smoke record; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** resolving anything (WO-066); a daemon; the enterprise tracker.

**Operator-review assumptions**

1. The resident's cadence is the invoker once WO-068 lands; the command
   stays available by hand.
