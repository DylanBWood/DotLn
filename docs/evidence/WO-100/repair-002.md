# WO-100 second repair — VER-002 F1

Dispatch: `resume: fix`, 2026-09-22, recorded by the harness before this
procedure loaded. Subject: the one finding VER-002 routed to repair, with its
structured follow-up [WO-100-D011](decisions.md#wo-100-d011). VER-002, VER-001,
the [first repair record](repair.md), the implementation record and all
transcripts are unchanged; this record adds
[WO-100-D012](decisions.md#wo-100-d012).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"unknown","source":"harness-session-model-statement"}

The model is the identifier Claude Code states for this session. Nobody
supplied an effort for this dispatch, and the harness exposes no effective
readback, so effort is `unknown`. The version is from `claude --version`.

**Process cost:** at 19:46:40Z the entry counter read 83,511 total tokens. At
19:50:21Z `node scripts/harness.mjs usage
feaa5d0e-2c2b-441a-b4b5-fcf60e078a60` read 3,021,204 total tokens (input 78,
cached input 2,932,279, cache write 74,885, output 13,962). Reasoning tokens
and dollars were unavailable. Source `claude-transcript-message-usage`, scope
`dispatch`, 45 steps and 41 commands. Later handoff steps are not in that
reading. Observed subagents: 0 of the configured cap of 20, with an unknown
unobserved remainder. No agent or paid external worker was launched. The
documentation gate dominated wall time (about 29 s per run); the full product
gate was not rerun (see below).

## Finding and repair

**F1: the active planning-refutation guide stated the old CLI defaults
(D011 → D012).** `docs/planning/refutations/README.md` §Execution and
preservation said Claude defaults to `claude-fable-5-1` at `max` and Codex to
`gpt-6-astra` with effort `unknown`. The command sets different defaults:
`scripts/refute-plan.mjs` selects `claude-opus-5-5` for `claude-cli-print`,
`gpt-6-sol` for `codex-cli-exec`, and `xhigh` for both. The guide now states
those defaults and names the old pair as the previous selection, in the form
`docs/AI-HARNESS-SECURITY.md` §Planning refutation already uses. The next
sentences are unchanged: the explicit-selection rules, `ultra` normalization,
and "Effective model and effort remain unknown unless independently observed."

**Sweep for other active statements.** `git grep -n -i -E
"fable-5-1|fable 5\.1|gpt-6-astra|astra"` covered `README.md`,
`docs/product/`, `docs/PLAYBOOK.md`, the refutation guide, the Entropy Reducer
guides and both skill trees. Every remaining match names the previous selection
next to the new one, except `docs/product/06-roadmap.md`'s v0.5.0 entry, which
describes what the closed WO-023 release ran. All other matches in the
repository are dated receipts, evidence, discovery observations or fixtures,
and the scope expansion keeps their bytes.

## Defects met inside the repair

None beyond F1. VER-002 notes that no gate check compares the guide's prose with
the command. D012 declines a prose-parsing test as beyond this correction. If
another stale-default finding appears, that justifies such a check.

## Release retiming observed

`npm run release -- prepare --local` retimed WO-100 from `v0.43.0` to
`v0.44.0` under the unchanged minor classification. Since the first repair,
`main` gained WO-064's `v0.43.0` tag (`refs/tags/v0.43.0` peels to `28f9f870`).
The tool updated the order's heading, the root README claim and product 06's
dated collision note. It did not change component versions, published tags,
scope or acceptance. Because the everyday AI-user edition links product 06's
top heading, the collision note made that edition STALE. Its text states no
version and makes no WO-100 claim, so only its source lock changed, to the
`--print-locks` value `sha256:33c5d4f5…74f3`. The software-engineer lock was
already current. A sibling publishing the version an order staged is not a
finding (product 07 §Independent workflows and integration), and final review
still integrates `main`.

## Checks executed (2026-09-22)

| Command | Result |
| --- | --- |
| `npm run test:docs` (first run, before `npm run meta`) | 13 passed, 7 failed: `meta` reported "Decisions index is stale; run npm run meta" after D012 was added, and six document suites depend on it |
| `npm run meta` | decisions index refreshed with D011 and D012 rows |
| `npm run test:docs` | 20 passed, 0 failed, 28.90 s |
| `npm run release -- prepare --local` | retimed `v0.43.0` → `v0.44.0` (above); a second run reported `v0.44.0 remains current; no files changed` |
| `npm run work-orders -- index` | regenerated; the WO-100 row reads `v0.44.0` |
| `npm run publication:check` (after the retime) | everyday AI-user edition STALE, as described above; after the lock refresh, 275/275 headings and both editions CURRENT (30 and 45 linked sections) |
| `npm run test:docs` (after the retime, before the lock refresh) | 13 passed, 7 failed: the `publication` preflight reported the stale edition |
| `npm run test:docs` (final bytes) | **20 passed, 0 failed, 30.09 s, 20 fresh tasks** |
| `npx prettier --check` on the refutation guide, decisions file, edition and this record | clean |
| `git diff --check` | clean |
| gate lookup at the current code identity | `npm test` row, code identity `bc563948…a4b`, exit 0, 286,155 ms, recorded 19:42:15Z (VER-002's run) |

**Why `npm test` was not rerun.** `gateCodeIdentity` in
`packages/skeleton/src/gate-evidence.mjs` leaves out `docs/`, `.claude/`,
`.agents/` and root Markdown. This repair, the retime and the lock refresh
changed only those paths. Code identity was computed before the retime, after
it and after the lock refresh, and each time read
`bc5639482e4ae01503ac57755cd1fbb24ebf7200e0a8d09cc7f98a5dced20a4b`, which
matches VER-002's passing gate row. The documentation suites, which do read
these files, ran above.

## Limits

- Effective model and effort are `unknown`. The attestation records the
  session's stated model and an unsupplied effort.
- The guide states the command's requested defaults, not an observed
  effective selection of any external worker.
- No second economy experiment: D002 is this order's one decision.

## Follow-up queue

Revision 5 at entry and at handoff: the implementation's `adjacent-0001` is
completed, nothing is running and `next` is null. This repair added no item.
