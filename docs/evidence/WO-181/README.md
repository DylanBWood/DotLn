# WO-181 — Independent review episode

The existing sealed verification host can now run a separate review after
behavior verification passes. The reviewer receives the original snapshot
contract, actual diff, baseline and candidate test rows, independently admitted
behavior evaluations, and the declared conventions file when present. It has
no tools or write mount and receives no implementer narrative.

Open `VerificationDriver` with `reviewConventionsPath` naming an unchanged
sealed file, or `null` to record absent conventions. Omitting the field retains
the existing verification-only path. After a complete behavior pass with no
human-attention request, `state.next` becomes `review`; persist and run the next
command through `VerificationHost`. A fresh physical episode admits only a
`review` result. `ReviewCompleted` records its subject, producing episode,
verifier and implementer identities, findings and severity counts. Behavior
acceptance rows remain unchanged. A completed review exposes `state.next` as
`reviewed`, not delivery authorization.

The finding contract adds `class: review` and severities `blocking`, `should`
and `nit`. `expected` states the rule; `observed` states its violation;
`reproductionSteps` are inspection instructions. References name the contract,
diff, sealed files or declared conventions. Admission requires a rule source
and an observed-source reference. It rejects edits, patches, replacement files,
behavior verdicts, foreign paths, duplicate findings and reused verifier or
implementer identities. Absent conventions remain explicit and cannot be cited.
Judgment accuracy is still the reviewer's responsibility; a structurally valid
finding is not machine proof that its interpretation of a rule is correct.

`routeReview` in [review.ts](../../../packages/skeleton/src/review.ts) returns
bounded repair inputs for blocking findings and `knownItems` for the later
WO-182 deliverable body. A repair input enters the existing `RepairHost` with
one round, no new grants, the original contract and all original criteria.
Inspection prose never becomes a shell command: repair runs the criterion's
already named tests and independently re-verifies the entire original contract.
A path outside the original surfaces or a human-attention request yields
`NeedsHuman`. Suggestions and nits dispatch no repair. A composition should
consume one repair, then inspect the new verified subject; an old review is
refused against another revision. WO-123's catalog row carries this step; the
full delivery composition and deliverable body remain later work.

## Proof and reproduction

[fixture.mjs](fixture.mjs) uses WO-056's synthetic signed-addition repository.
The process-double implementer fixes addition while declaring a local variable
`TOTAL` contrary to `CONVENTIONS.md`, and adds an unrequested README line.
Both host-run behavior tests pass. Independent review finds the two blocking
issues with their rules. The snapshot digest and behavior acceptance rows stay
unchanged. A separate composition double removes the convention defect through
the real bounded repair host and a fresh verifier; should/nit suggestions cause
no writer dispatch.

Nine cases in
[review.test.ts](../../../packages/skeleton/test/review.test.ts) cover these
outcomes, absent conventions, failed behavior, foreign or narrative-bearing
context, forged completion, physical snapshot drift, cached-result recovery and
idempotent terminal recovery. They are document cases because the reused
historical fixture lives under `docs/evidence/`. The product selection skips
those inputs; the document selection executes them. The final focused group
passed all 41 review, verification and repair cases; the earlier worktree and
baseline compatibility group also passed.

```sh
npm run build
node --test packages/skeleton/dist/test/review.test.js
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-181/fixture.mjs live codex gpt-6.1-sol max codex-live-next
DOTLN_LIVE_WORKERS=1 node docs/evidence/WO-181/fixture.mjs live claude claude-opus-5-5 xhigh claude-live-next codex
```

Use a new lowercase receipt label for each live attempt. The final argument
selects the behavior verifier independently of the reviewer. Every model
episode uses a fresh process with tools disabled; the implementer remains a
labeled process double. Models and efforts are host launch selections, with
effective readback unknown. Receipt files refuse replacement and screen private
paths and credentials before writing.

## Evidence and limits

[Codex 002](codex-live-002.json) and [Claude 004](claude-live-004.json) are
passing live rows on the final runtime. Both report the two planted blocking
findings, distinct reviewer/verifier/implementer identities and an unchanged
snapshot. Codex CLI `0.159.3` selected `gpt-6.1-sol` at `max`; Claude CLI
`2.1.286` selected `claude-opus-5-5` at `xhigh`. The Claude row uses a separate
live Codex behavior verifier before the live Claude reviewer. Their recorded
runtime-source hashes match the current implementation.
The two `001` rows passed before the source-size refactor and remain historical.
Claude `002` and `003` passed both behavior criteria but requested human attention,
so the host stopped before review; their failed receipts and separate admitted
result observations are retained.
The [decisions](decisions.md) explain the cross-harness proof and preserve these
stops without changing behavior-verifier policy.

The final deterministic authority, artifact-identity, verification and feedback
editions are revision `002`. The current live feedback self-host audit ran on
Codex `gpt-6.1-sol` at `max`, passed all ten fixture pairs and both audit criteria,
and was filed by reference in that edition; the console fixture is re-pinned.
The first audit stopped before a model launch because the expanded reactor
exceeded the capsule's file bound. Moving state types and pure review
construction to companion modules preserved the bound; the source projection
now admits every judged file. No process-cost saving is claimed.

Local release target: `v0.61.0`; compiler `0.22.0`, skeleton `0.49.0`.
The new finding class, optional episode and event are additive; legacy streams
and absent-context behavior retain their checks. Workspace dependency pins
follow those versions, with no new dependency or publication permission.
Product 03's replacement sentence is 368 bytes (99 bytes net added), and the
publication source locks were refreshed and checked.

This is executor evidence over a synthetic repository, not a production delivery
run or an independent work-order verification. Existing host trust, snapshot
size and macOS confinement limits remain. A conventions source must be declared
and unchanged between base and candidate; this order creates no conventions
file in a target repository.

## Operator expansion: future worktree preparation

The operator expanded this order to remove the recurring missing-Chromium
interruption for future work orders, then expressly excluded retrofitting
existing worktrees. [D008](decisions.md#wo-181-d008--operator-expansion-prepare-future-worktrees)
records both messages and reopens WO-059-D023. The canonical planning amendment
binds the expanded order and its seventh criterion.

`worktree start` already runs the target's `bootstrap.mjs` before its ready
handoff. Bootstrap now invokes that checkout's installed Playwright CLI with
`install chromium --only-shell` after dependency preparation, using the same
default cache as the browser suite. Explicit cache selections remain intact;
the new checkout supplies the relative-path base. A failed installation stops
preparation, preserves the checkout and names `node scripts/bootstrap.mjs` as
the retry. The gate and missing-browser negative evidence keep their meanings.

[bootstrap-proof.mjs](bootstrap-proof.mjs) and
[bootstrap-live-001.json](bootstrap-live-001.json) establish three real browser
launches: cold setup in a new temporary Git worktree, a cached retry with an
unreachable download host, and a second new worktree using an explicit cache
with npm offline. The proof uses the current workspace manifests and lockfile,
real `npm ci` and the pinned Playwright `1.63.0` installer. Only its build is a
labeled marker double, and it equips no hooks or model sessions. Chromium
`153.0.8010.12` launched in all three cases. The cached runs downloaded nothing.
The existing bootstrap and two new regression cases passed as part of the five
`bootstrap`-selected tests. No other existing worktree was modified.

The setup protocol follows the pinned [Playwright browser documentation](https://github.com/microsoft/playwright/blob/v1.63.0/docs/src/browsers.md).
Per-worktree cache isolation remains the default, so a new worktree still needs
network access for its first download unless the caller selects an available
cache. Setup owns that prerequisite before the work-order launch handoff.

## Executor gate outcome

The final `npm test -- --review` passed 40 suites with zero failures (85 fresh
tasks, 895.10 seconds). `npm run test:docs` passed 24 suites with zero failures
(38.99 seconds), including all nine review cases. The unchanged browser suite
also passed all 19 cases after the recorded host-process timeout. Publication,
planning, generated evidence and whitespace checks pass. The
[handoff](handoff.md) maps all seven criteria to their evidence; D007 and D010
retain the failed or stopped validation attempts and their corrections.
