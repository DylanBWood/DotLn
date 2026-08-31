# Operator playbook — the canonical loop

For the human running this. The models have their own doc
(`product/07-execution-guide.md`); this one is yours. Follow it mechanically
until it's muscle memory; edit it when reality disagrees.

## Who does what

| Actor | Use for | Don't use for |
|---|---|---|
| **Fable 5** (planning session) | Synthesis, blueprints, writing/refining work orders, adjudicating reviews, big-corpus thinking | Typing lots of code — it's your judgment amplifier, not your keyboard |
| **Opus 5** (1M) | Primary implementer on hard work orders; deep verification passes | Mechanical chores that Sonnet can do |
| **Sonnet 5** | Bounded mechanical work: test scaffolds, renames, formatting, running fixtures, small fan-outs | Anything requiring judgment about the blueprint |
| **Codex** (GPT 5.6 Sol, xhigh) | Peer implementer on work orders; **cross-vendor verifier** of Claude-built work | — reads `AGENTS.md` (symlinked to CLAUDE.md), so same rules bind it |

Two standing rules:
- **Implementer ≠ verifier, and prefer cross-vendor.** Claude built it → Codex
  verifies; Codex built it → Claude verifies. This is the blinded-verifier
  principle plus a free defense against self-preference bias.
- **`Model:` line in the work order is law** (Principle 8). `Model: any` means
  route freely — including by which meter has budget left. Never silently
  downgrade mid-work-order; switch executors between work orders instead.

## The loop, per work order

**1. Plan (Fable, main checkout).** Pick or refine the WO in
`docs/work-orders/`. If the docs need updating first, do it here. Main
checkout is the control plane — no implementation happens here.

**2. Implement (fresh session, own worktree).**

```bash
cd ~/Projects/DotLn
git worktree add ../DotLn-wo002 -b wo-002
cd ../DotLn-wo002

# Claude executor:
claude                       # then: "Execute docs/work-orders/WO-002-pure-kernel.md"
# or Codex executor:
codex                        # same one-line instruction
```

Give the executor ONE line: *execute this work order*. Everything it needs is
in the repo (that's the whole design). Don't paste context; don't explain.
Ramble into the *planning* session, never into an executor.

**3. Verify (fresh session, other vendor, blinded).** New session — not the
implementer's, no implementer narrative. Feed it: the WO + the diff.

```bash
cd ../DotLn-wo002
codex   # if Claude implemented (or `claude` if Codex did)
# "Verify the working tree against docs/work-orders/WO-002-pure-kernel.md.
#  Run every acceptance criterion yourself. Report per-criterion pass/fail
#  with evidence. Do not fix anything."
```

**4. Review + merge (you, five minutes).** Read the result envelope and the
verifier's per-criterion report. Skim the diff like you'd skim a PR title +
summary. If green:

```bash
cd ~/Projects/DotLn
git merge wo-002
git worktree remove ../DotLn-wo002
git branch -d wo-002
git push
```

If red: don't debug in your head — dispatch a *repair* session in the same
worktree with the verifier's findings, then re-verify. (Findings → fresh
repair episode → stale evidence regenerated: same shape DotLn itself will
automate at v0.5.0.)

**5. Close (Fable, main checkout).** One short planning turn: did anything
supersede/transform a blueprint idea? Ledger + doc updates ride in this
commit. Then pick the next WO.

## Concurrency

One writable agent per worktree, always (global rule). Two work orders in
parallel = two worktrees, two sessions, zero shared files. The main checkout
stays clean for you and the planning session.

## When things break

- **Session dies / rate-limited mid-WO:** nothing is lost — the repo + WO are
  the memory. Start a fresh session in the same worktree: "Continue executing
  WO-00X; inspect the working tree to see what's done." (Disposable
  incarnations; the workflow remembers the worker.)
- **Out of Claude budget:** route `Model: any` work to Codex; park
  model-pinned work orders — never substitute silently.
- **Executor asks you a question it shouldn't** ("should I run the tests?"):
  the answer is in the WO's evidence gate. Say "follow the work order" and
  note it — that's a future compiled feedback unit.
- **Executor went sideways:** kill it, don't argue with it. Fix the WO or the
  doc that misled it (that's the real bug), reset the worktree, redispatch
  cold. Arguing pollutes; redispatching is free.

## Weekly hygiene (until DotLn does it for you)

- `git worktree list` — remove strays.
- Skim `docs/lineage/idea-ledger.md` Session additions — anything learned this
  week that belongs there?
- Ask: does the current rung still ship a visible payoff? If not, re-cut it.
