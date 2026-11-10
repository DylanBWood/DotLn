# WO-266 — An instance chooses its models and reads what an order cost: a `workers` section of the configuration sets the model and effort each worker option and each driven phase runs, emit and the launch helpers read it, and the order meter keeps tokens by class and prints an estimate in dollars from prices the instance declares

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. One optional configuration section; the
emitted worker definitions, the review helper, the refuter launch and the
drive read it; the order meter keeps four token classes; one reporting
flag. With the section absent every emitted byte and every launch is as
today. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/lib/config.mjs` (`SECTION_KEYS` and the
section's validation), the `workers` section; one resolver in
`scripts/lib/worker-launch.mjs` that every reader of
`contributorWorkerOptions`, `contributorWorkerDefaults`,
`contributorWorkerPins`, `contributorVerifierEffort` and
`TRANSPORT_DEFAULTS` calls (`scripts/lib/harness.mjs`' emit,
`scripts/lib/review-worker.mjs`, `scripts/refute-plan.mjs`,
`scripts/lib/drive-session.mjs`, `scripts/lib/entropy-review.mjs`); in
`scripts/lib/meta.mjs` (`usageTotals` and the per-role usage it writes),
the four token classes the usage observation already reads, and the
`--usage` report; cases in the suites the Preflight names; the kit guide,
the example configuration and the decisions. Removes these states: an
instance whose account names models differently, or whose budget calls for
a cheaper worker, editing compiled files that `harness check` and
`kit-verify` then refuse; an order's cost recorded as one total in which
cache reads are not told from output. No recurring work is added to a
gate, a hook, a prune or a close. Tokens and wall-clock: unknown until
this order's handoff records them. Re-mints: the editions the registered
sources this order edits stale, deterministically; no file in
`FEEDBACK_SOURCE_PATHS` changes, so no live feedback episode is owed. The
files this order edits are declared sources of machinery suites, so the
final criterion names `npm test -- --review`. Steps: the executor's,
below.
**Nomination provenance:** the operator's statements of 2026-11-09 that
the work instance runs on a limited model budget stated per person and
per day (ignored captures SHA-256
`b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb` and
`e1c8d0ae73fb667fbfa8aa82a58b9c6d054eaa53a521fd82a84bc8612e573237`); the
operator's dispatch of that day (ignored capture SHA-256
`7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`), item
1, fourth goal; four independent readings in
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md)
that found the pins compiled in with no instance override.
**Depends on:** WO-250 and WO-255 (closed: the review helper and its
launch); WO-192 (closed: the drive). No open order.
**Recommended placement:** seventh, after the two orders an instance meets
at install and update. It is the first order that changes what the work
instance spends.
**Cites (read these sections):** `packages/skeleton/src/loadouts/contributor.ts`
(`contributorWorkerOptions`, `contributorWorkerDefaults`,
`contributorWorkerPins`, `contributorVerifierEffort`, read only);
`scripts/lib/worker-launch.mjs` (`TRANSPORT_DEFAULTS` and the option
readers); `scripts/lib/review-worker.mjs`; `scripts/refute-plan.mjs`
(`refute --model`); `scripts/lib/drive-session.mjs` and
`scripts/lib/drive-worker.mjs` (the phase pins and the launch argv);
`scripts/lib/harness.mjs` (emit and check); `packages/compiler/src/harness.ts`
(the worker definition's `model:` and `effort:` lines);
`scripts/lib/config.mjs` (`SECTION_KEYS`, `validateConfig`);
`packages/skeleton/src/usage-observation.mjs` (the `Usage` shape);
`scripts/lib/meta.mjs` (`usageTotals`); the kit guide §Features and the
paragraph on worker models; product 07 §Model-specific notes.

**Objective:** The owner of an instance decides which model and effort
each worker and each driven phase runs by editing the instance's own
configuration, and reads after an order, and across a day, what it used in
tokens by class and, from prices the instance declares, in dollars.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- The pins are compiled in. `contributorWorkerOptions` in
  `packages/skeleton/src/loadouts/contributor.ts` names four options, each
  with one model id and one effort (two Claude options at `xhigh`, two
  Codex options at `max`), `contributorWorkerPins` gives a driven phase its
  host's default option, and `contributorVerifierEffort` is `xhigh`.
  `TRANSPORT_DEFAULTS` in `scripts/lib/worker-launch.mjs` repeats the
  defaults for the print transports. The emitted
  `.claude/agents/dotln-worker.md` carries `model:` and `effort:` lines
  from that table.
- An instance cannot change them. `SECTION_KEYS` in `scripts/lib/config.mjs`
  has no section for them and an unknown section refuses; the overlay has
  no model key; a hand edit of a generated agent file is reported by
  `harness check` and rewritten by emit; the compiled table ships under
  `packages/skeleton/dist/`, which `kit-verify` refuses when changed.
- A host whose account offers other model identifiers has no route. What
  the host does when an agent definition names a model the account does
  not offer is unknown; the first worker launch is where it would be met,
  and every review, refutation and driven phase launches one.
- The meter keeps one number. `packages/skeleton/src/usage-observation.mjs`
  reads input, cached input, cache write and output tokens from the host,
  and `node scripts/harness.mjs usage <session>` prints them; the order
  meter's per-role usage in `docs/evidence/WO-NNN/meta.json` holds
  `totalTokens` and a `costUsd` that is null for an attended Claude Code
  session. WO-260's executor row reads 360,480,028 tokens over 1,001
  steps with no class and no cost.
- An emitted file that differs by instance is read as an edit. `kitPath`
  in `scripts/launchpad.mjs` counts everything under `.claude/agents/` as
  a kit path, the export records each emitted surface at the bytes
  `expectedHarnessBundle` predicts from the host elections alone, and
  `planUpdate` refuses, as locally modified, a kit file whose hash is
  neither the prior manifest's nor the incoming one's; `verifyKit` reports
  the same file as differing. A worker definition emitted from an
  instance's own configuration would meet both.
- The token classes do not mean one thing on every host. `fields` in
  `packages/skeleton/src/usage-observation.mjs` puts Codex's cached input,
  which that host counts inside its input tokens, and Claude's cache
  reads, which that host counts apart from them, into one field, and adds
  the cache classes to the total for Claude alone.
- The cost is mostly re-read context. The planning session that filed this
  order read 28,462,926 of its 29,152,076 tokens from cache, wrote 478,481
  to cache and produced 210,467 of output, by its own readback. A total
  that does not separate those cannot be priced, and the classes differ in
  price by two orders of magnitude.

**Design (scope discipline):**

- The configuration states what each option runs. `workers.options` may
  give any of the four option names a `model` and an `effort`;
  `workers.defaults` may name which option is a host's default;
  `workers.verifierEffort` may set the effort of a driven verification.
  The compiled table supplies whatever the instance does not state, and
  one resolver returns the result to every reader, so the emitted
  definitions, the review helper, the refuter launch, the entropy reviewer
  and the drive cannot disagree. Rejected: letting an instance add option
  names (the axis is surface: the `--model` grammar, the receipts and the
  role text name four options, and an instance needs to change what an
  option runs, not how many there are). Rejected: reading an environment
  variable (the axis is the record: the configuration is committed and
  reviewed, and `harness check` can compare the emitted files with it).
- The record says what ran. A launch's attestation carries the model id
  and effort it was given, as today; the receipt's worker type is the
  option's, unchanged.
- A value the kit cannot judge is the instance's to get right. The kit
  validates the section's shape, the option names and the effort against
  the levels its launchers accept; it does not hold a list of model ids.
  A launch that fails names the configuration key the model came from.
- An emitted surface is judged as emitted. The manifest's prediction, the
  update plan and `verifyKit` take the resolved `workers` values as they
  take the host elections today, so a worker definition emitted from the
  instance's configuration is neither a local modification nor a
  difference.
- The meter keeps four classes that do not overlap: uncached input, cache
  read, cache write and output, derived for each usage source from what
  that host's counters mean, per role and per order, with `unknown` where
  the host reported none. One build-free reading under
  `packages/skeleton/src/` sums the usage ledger by the host's local
  calendar day, taking each observation on the day it was observed, and
  `npm run meta -- --usage` prints that reading by order and by day;
  WO-271's prompt line calls the same reading.
- Dollars are an estimate from the instance's own prices. `workers.prices`
  maps a model id to its prices for the four classes; with it the report
  multiplies and prints an estimate, labeled as one, and a `costUsd` the
  host reported stays the figure of record. No price ships in the kit: an
  account's rates are its own and change. Rejected: a price table in the
  kit (the axis is truth: the kit would state another party's prices and
  be wrong for most accounts).
- This order adds no refusal keyed to a host. On every host the record
  shows, an instance that declares nothing launches what it launches
  today.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/lib/config.mjs` (`SECTION_KEYS`, `validateConfig`): admit a
   `workers` section with `options` (keys among the compiled table's four
   names, each with an optional `model` text and an optional `effort`
   among the levels that option's host accepts), `defaults` (host to
   option name), `verifierEffort` and `prices` (model id to four
   non-negative numbers), refusing an unknown key by name. Check:
   `npm test -- --only configuration-root`.
2. `scripts/lib/worker-launch.mjs`: one exported resolver that returns the
   options, the host defaults, the phase pins and the verifier effort for
   a root, the configuration's values over the compiled table's; its
   existing option readers and `TRANSPORT_DEFAULTS`' callers use it.
   Check: the review-worker cases (`node scripts/harness.mjs bounded --
   node --test scripts/test-review-worker.mjs`).
3. `scripts/lib/harness.mjs` (emit and check) with
   `packages/compiler/src/harness.ts` (the worker definitions): the emitted
   worker definitions carry the resolved model and effort, and check
   compares against the resolved values. `scripts/launchpad.mjs`
   (`expectedHarnessBundle`, `planUpdate`, `verifyKit`): each takes the
   resolved values, so the emitted definitions are neither refused as
   locally modified nor reported as differing. Check: `npm test -- --only
   harness-fixtures`, `npm test -- --only compiler` and `npm test -- --only
   launchpad`.
4. `scripts/lib/review-worker.mjs`, `scripts/refute-plan.mjs` (`refute
   --model`), `scripts/lib/entropy-review.mjs` and
   `scripts/lib/drive-session.mjs`: each takes its model and effort from
   the resolver, and a failed launch's message names the `workers` key the
   model came from. Check: `npm test -- --only plan-refutation` and
   `npm test -- --only harness-fixtures`, whose row runs the drive's
   cases.
5. `packages/skeleton/src/usage-observation.mjs` (`fields` and what it
   feeds): derive uncached input, cache read, cache write and output as
   four classes that do not overlap, for a Claude source and for a Codex
   source each by that host's meaning, leaving the total as it is.
   `scripts/lib/meta.mjs` (`usageTotals`, the per-role usage written to an
   order's `meta.json`): keep the four beside the total, each `null` where
   the host reported none. A build-free module under
   `packages/skeleton/src/` (new, with its one-line shim under
   `scripts/lib/`): the reading of the usage ledger by local calendar day.
   Check: `npm test -- --only skeleton` and `npm test -- --only
   process-debt`.
6. `scripts/meta.mjs` and `scripts/lib/meta.mjs`: `--usage [--since
   <date>]` prints, by order and by the day of each dispatch, the tokens
   by class and role and, where `workers.prices` names the attested model,
   an estimate in dollars marked as an estimate, each class multiplied once
   by its own price. Check: `npm test -- --only process-debt`.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide (the section on what an instance
   configures: the `workers` section, what each key changes and that the
   record states the model that ran; the usage report and that prices are
   the instance's); `scripts/kit/dotln.config.example.json` (the section,
   with no model id and no price filled in); product 07 §Model-specific
   notes (the table is the default an instance may restate);
   `docs/evidence/WO-266/decisions.md`. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the configuration section and its validation; the
resolver and its readers; the emitted definitions; the meter's classes;
the usage report; the cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. In a fixture instance whose configuration gives one option a model and
   an effort, `node scripts/harness.mjs emit` writes that option's worker
   definition with those two values and `node scripts/harness.mjs check`
   passes; with the section absent, the emitted files equal the files
   emitted at the base. In the update fixture, an instance that emitted
   with the section set is shown no worker definition as locally modified
   by the update plan, and `node scripts/launchpad.mjs verify` reports none
   as differing.
2. In the same fixture, `npm run worker -- review --kind criteria --host
   claude --order <id> --dry-run` and `npm run plan -- refute --model
   <option>` each print a launch that names the configured model and
   effort, and the drive's launch for a phase carries them in its
   arguments, with `workers.verifierEffort` applied to the verifier's.
3. A `workers` section with an unknown key, an option name outside the
   compiled four, an effort outside the host's levels or a negative price
   is refused when the configuration loads, naming the key.
4. A launch that fails because its model was refused reports the
   `workers` key that named the model, shown with the fixture launcher's
   failing double.
5. An order's `meta.json` written from usage rows holds uncached input,
   cache read, cache write and output per role beside the total, and holds
   `null` for a class no row reported. For a Claude usage row and for a
   Codex usage row with the same counters, the four classes of each sum to
   that host's total, so no token is in two classes.
6. `npm run meta -- --usage` prints tokens by class for each order and for
   each local calendar day, an observation counted on the day it was
   observed; with `workers.prices` naming the attested model it also
   prints an estimate marked as one; for a model with no declared price it
   prints `unknown` in place of the estimate.
7. The kit guide and the example configuration state the section and the
   report and link this order's decisions. Check: `npm run test:docs`.
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only configuration-root` for step 1; the
review-worker cases under the bounded wrapper for step 2; `npm test -- --only harness-fixtures`, `npm test -- --only compiler` and
`npm test -- --only launchpad` for step 3;
`npm test -- --only plan-refutation` and `npm test -- --only
harness-fixtures` for step 4; `npm test -- --only skeleton` for step 5 and `npm test -- --only
process-debt` for steps 5 and 6; the
structural phase; the complete run with `npm test -- --review` at final
review.

**Evidence gate:** under `docs/evidence/WO-266/`: the emitted definition
and the three printed launches of criteria 1 and 2; criterion 3's
refusals; the usage report with and without prices; `npm run resume --
status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 7; sources and
reopening conditions in `docs/evidence/WO-266/decisions.md`.

**Known issues and carry-ins:**

- What a host does with a model id its account does not offer is observed
  only on that host. The 2026-11-09 pass asks the operator for that
  observation from the work laptop; this order's criterion 4 covers the
  message, with a double standing in for the host.
- An attended session's own model and effort are the operator's choice in
  the host and are attested, not configured here.
- The live smoke check pins a host version and a model of its own
  (`scripts/harness-live-smoke.mjs`); it reads the resolver after this
  order only if the executor finds that a bounded change, and is recorded
  otherwise.
- An estimate from declared prices is only as current as the declaration.
  The report says which prices it used and prints no figure for a model it
  has none for.
- Codex sessions report their usage through a different counter; a class
  that counter does not give is `null`, never zero.

**Non-goals:** a list of model identifiers or prices in the kit; a new
option name; a refusal when spending passes a figure; pacing or a weekly
cap; the review ladder's size, which WO-262 lets an order declare; the
model of an attended session.

**Operator-review assumptions:** that an instance's owner, not the kit,
knows which models the account offers and what they cost; that changing
what an existing option runs is enough without new option names; that an
estimate in dollars, labeled and derived from declared prices, is useful
before any enforced budget; and that the four token classes are the right
grain to keep.
