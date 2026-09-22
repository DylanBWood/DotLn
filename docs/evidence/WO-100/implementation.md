# WO-100 implementation — preauthorized portfolio and work derivation

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"xhigh","source":"operator-attested"}

The model and effort are the operator's `/model` selection at dispatch
("Opus 5.5 (1M context) … with xhigh effort"); Claude Code exposes no effective
readback, so the source is operator-attested. The harness version is
`claude --version` on this machine.

Dispatch: `resume: next`, 2026-09-22, recorded by the harness before this
procedure loaded. The canonical selection was active WO-100 in its matching
`wo-100` worktree with one registered writer. No branch commit, push, PR, tag
or lifecycle repair was performed. Independent verification and final review
remain separate dispatches.

## What changed

**The contract** (`packages/skeleton/src/portfolio.ts`, pure). A `Portfolio`
names the compiled 5S mechanics it preauthorizes (`sort`, `shine`,
`standardize`), repository-relative surfaces, an effect and file ceiling per
compiled presence phase, a budget of episodes, wall time and optional reported
tokens, and exact verification commands per candidate kind. `decodePortfolio`
validates the shape; `admitPortfolio` validates every ceiling under the
compiled base floor and the named phase's effective envelope and host-counted
change size. `deriveWorkOrders(candidates, portfolio, phase, { baseCommit })`
maps each WO-119 candidate to exactly one outcome, in candidate order:

| Outcome | When |
| --- | --- |
| `order` | mechanic preauthorized, every touched path inside the surfaces, every effect carried by a source-change order, a verification command declared, and the current phase's ceiling admits the file count and effects |
| `ProductSuggestion` | mechanic not preauthorized, or a path outside the surfaces |
| `NeedsHuman` | the obligation needs an effect no writer carries (Sort's deletion of a stale generated file), no verification command is declared, or no phase ceiling admits it |
| `deferred` | a later phase's ceiling admits it |

An order's surfaces are the candidate's files plus a declared home, its size is
their count, its envelope is the phase ceiling intersected with the compiled
phase (never carrying an effect WO-052 refuses, always denying the source-change
denials), and its grant is `host-policy`. The compiled WorkOrder handed to
WO-120 is phase-free, so one candidate keeps one durable identity
([D005](decisions.md#wo-100-d005)).

**The configuration.** `dotln.config.json` gains an optional `portfolios`
section (`scripts/lib/config.mjs`). Its loaded value is byte-identical to the
skeleton decoder's output, and a ceiling outside the named repository's
registered `authorityProfile` refuses by path.

**The activation path.** The resident configuration gains a `portfolio`
binding (`{ definition, baseCommit }`) admitted under the floor, and a new
actor kind `portfolio` (effect `repo.write`, no command). For a portfolio
phase the resident checks the budget, derives from the latest verified
discovery observation, and selects the first order not yet activated. It
appends `ScriptEpisodeDispatched`, then `PortfolioOrderActivated` carrying the
order, its `host-policy` grant and its WO-120 provenance key, before anything
runs. The fold recomputes that activation from the recorded discovery,
binding, phase and budget and refuses a log that differs. The episode
(`portfolio-actor.ts`) materializes the order through WO-120, changes source
through one `SourceChangeHost` and verifies it through one `VerificationHost`
(`portfolio-host.ts`, composed as `RepairHost` does). `PortfolioOrderObserved`
is verified only for an admitted pass over an observed change, so the compiled
presence transitions advance only then; a failed, refused or host-failed
episode resets the curve. Spent budget makes the next portfolio dispatch a
`ScriptEpisodeRefused` NoOp naming it, in the host and in the fold. A resident
without bound hosts reports the actor unavailable.

**Review fixes.** A read-only review of the diff (one subagent) found no
containment escape and ten items; eight were fixed, one deferred and one
documented ([D006](decisions.md#wo-100-d006)). A Sort move is now checked by
the host (the old path removed, the home added with the same blob) before any
verifier runs; the pass rule also requires no human escalation, as RepairHost's
does; the WO-120 provenance key names the bound base; a kill after the change
records the commit WO-052 observed; the bound base must be a full commit id; a
portfolio actor's reservation must cover its phase ceiling; each named phase
must grant a source-change writer; and the Sort contract no longer contradicts
itself. WO-054's criterion surfaces are the order's paths present in both
trees plus the files the named commands run, because WO-054 refuses a surface
missing from either snapshot (observed while adding the Sort test).

**Operator scope expansion** ([D007](decisions.md#wo-100-d007), bound with
`plan amend-order`; correction [D008](decisions.md#wo-100-d008)). Every active
external-CLI selection of Claude Fable 5.1 now selects `claude-opus-5-5` at
`xhigh`, and every GPT-6 Astra selection selects `gpt-6-sol` at `xhigh`: the
Entropy Reducer's compiled reviewer (Seisō versioned to 2 with a recorded
migration in the authority and artifact-identity tools; the plan refuter keeps
its own active version and identity), the entropy and planning-refutation
command defaults, the probe and evidence scripts, and the documents stating
them. D008 corrects my first choice to keep the Codex effort `unknown`: the
Codex transport ignores user configuration, so `unknown` would have run Sol at
its catalog default `medium`. Always-on agents defaulting to GPT-6 Luna or the
latest Claude Sonnet at `xhigh` is recorded as a candidate in product 06, since
`resident-bind` has no default model; WO-111 owns it.

## Acceptance evidence

| Criterion | Executed evidence at this cutoff |
| --- | --- |
| 1 — derivation and durable records | [portfolio-unit.tap](portfolio-unit.tap) case 1 runs the real WO-119 producer over its fixture repository: in `widen` the failing lint and test become orders on `src/main.js`, the 2-file Sort move is deferred, `loose/helper.js` (outside the surfaces) and the recurring repair (Standardize not preauthorized) become product suggestions, and the stale generated file becomes `NeedsHuman` naming `repo.delete`; in `peak` the move becomes an order. Every order's surfaces, size and envelope are asserted inside the portfolio ceiling and the compiled phase. [portfolio-e2e.tap](portfolio-e2e.tap) test 2 materializes the three in-portfolio orders through WO-120 as WO-900..WO-902, each `active` in the index with `runtime` provenance, its registered base and its `host-policy` grant; `work-orders index --check` passes; the suggestions and question allocate nothing. |
| 2 — activation, WO-052, WO-054, advance and reset | e2e test 2 drives a real `ResidentHost` over the real WO-120, `SourceChangeHost` and `VerificationHost` with a doubled writer and verifier: `PortfolioOrderActivated` (with the `host-policy` grant and the WO-120 key) precedes each episode; WO-900's lint fix verifies and the curve moves `widen`→`peak`; WO-901's wrong fix fails its named check and the curve resets to `probe`; each diff touches only `src/main.js` and the target's HEAD is unchanged. Test 3: a correct Sort move passes 2 of 2 criteria, a copy fails the host relocation with no verifier dispatched, and a verifier escalation fails a lint fix whose evaluation passed. The unit suite's in-memory run also shows the activation durable before materialization, fold refusal of a rewritten activation or verdict, and both kill paths. |
| 3 — budget | Both suites: after two episodes the next portfolio dispatch is one `ScriptEpisodeRefused` reading `portfolio gardener-5s v1 budget exhausted: 2 of 2 episodes`; no further dispatch or writer launch occurs. The fold applies the same `residentRefusal` to a recorded dispatch by construction; no test drives that case directly. |
| 4 — write-backs | 06 §Candidate — unattended work-order portfolio (allocated) and the release record; 03 §Candidate — progressive absence authority (status); 07 §Declaring a portfolio under §Operator resume phrases, with the configuration section; also 05 §5S / 6S and the skeleton README runbook. The order was filed 2026-09-08, so its ledger duty is discharged by this decisions file and its index rows. `npm run publication:check` passes with refreshed locks. |
| 5 — checks, dependencies, pins, editions | `npm test`: **26 suites passed, 0 failed, 341.94 s, 70 fresh tasks** (gate row 2026-09-22T19:01:44Z). `git diff --check` clean; no dependency added. `harness emit` regenerated the bundle pins (31 surfaces; hashes and snapshot path only). Fresh editions, selected in `docs/evidence/current.json`: feedback `WO-100/feedback-001` (one live self-host episode, below), authority `WO-100/authority/002`, artifact identity `WO-100/artifact-identity`; verification stays WO-146. All four edition checks and all five console cases pass. |

**The live self-host episode.** `claude-cli-print`, `claude-sonnet-5`, effort
`xhigh`, CLI 2.1.280, store `.runtime/feedback-audit-wo100-xhigh`: complete,
ten fixtures, 1,192 saved instruction bytes, 313,843 tokens, USD 1.4906,
357,414 ms launch. An earlier attempt at effort `max` (the README's documented
selection, store `.runtime/feedback-audit-wo100-r001`) reached the transport's
600,000 ms deadline and retained its pending work; its cost is unknown because
no result envelope was emitted. Effective model and effort are unknown for both.

**The first gate.** The first `npm test` failed one skeleton case: a WO-023
receipt test pins the Entropy Reducer's current-subject hash, which the
reviewer migration moved by design. Its historical reviewed-hash check still
holds; the current hash was updated to the compiler's value, as WO-142's
migration did, and the second gate passed.

Other checks: `npm run plan -- check` exit 0 (the heading's release assignment
and the D007 amendment are bound); `release check-surfaces --local` 44 PASS;
`release prepare --local` reports target `v0.43.0` current; the neighbouring
skeleton suites passed 89 of 89 before the review fixes.

## Limits

- The budget is an admission budget charged when an episode ends: the last
  admitted episode can overrun remaining wall time or tokens, and an episode
  lost to a restart is charged the downtime. No current host reports tokens.
- WO-054 judges only the portfolio's named commands; the host checks surfaces
  and a Sort move's relocation. Other stated criteria are the named commands'
  to test.
- No production host binds the portfolio's execution ports; the live
  unattended hour, retry, replenishment and the always-on model default are
  WO-111's. The configuration loader, not the resident, checks a ceiling
  against its repository's registered profile (D006 follow-up).
- A candidate is attempted once per portfolio version and bound base per store.
- `WO-100/authority/001` was minted before the scope expansion and is kept but
  not selected; `002` is current.
- `git add -N` marked the seven new files intent-to-add in the index (no
  content staged, nothing committed); the role may not reset or restore, and
  the entries only let `git diff --check` and surface checks see them.

## Process cost

Dispatch-scoped counter at 19:02:31Z (`claude-transcript-message-usage`):
149,943,674 total tokens, cost unavailable, 351 steps, 322 commands. One
read-only review subagent (19 of 20 remaining). The economy experiment was
declined (D002).
