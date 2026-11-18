# Part B: an instance's emit with the author's layer left out

Captured 2026-11-17T18:05:38Z by a script in session scratch. It builds the harness suite's fixture from this worktree's built runtime and scripts as an exported instance (the kit's manifest, no package sources) and runs the fixture's own `node scripts/harness.mjs emit` and `check`, first with no overlay and then with this one, selected by `"build": { "overlay": "build/overlay.json" }` in its `dotln.config.json`:

```json
{ "version": 1, "unequip": ["author"] }
```

The fixture's path is printed as `<fixture>`.

## The commands' own output

```text
$ node scripts/harness.mjs emit        (no overlay; exit 0)
harness emit: 27 generated surfaces; local-terms list: unavailable
$ node scripts/harness.mjs emit        (the overlay; exit 0)
harness emit: 23 generated surfaces; local-terms list: unavailable
$ node scripts/harness.mjs check       (exit 0)
harness check: 23 generated surfaces; local-terms list: unavailable
$ node scripts/harness.mjs emit        (a later emit; exit 0)
harness emit: 23 generated surfaces; local-terms list: unavailable
$ node scripts/harness.mjs check       (exit 0)
harness check: 23 generated surfaces; local-terms list: unavailable
```

## The role roots' Origin comments

Each root's bytes, the number of unit lines it ends with, and its Origin comment.

With no overlay:

| Root | Bytes | Unit lines | Origin |
| --- | --- | --- | --- |
| `dotln-executor` | 43222 | 10 | `{"ids":["adjacent-repair","anti-oscillation","bounded-boy-scout-cleanup","communication-intent","concurrent-work-requires-worktrees","contributor.executor","correctness-over-sycophancy","decision-receipts","fail-conservative-correction","follow-up-queue","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","operator-check-in","process-cost","read-your-own-output","tinkerer-economy","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-planner` | 26917 | 10 | `{"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.planner","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","process-cost","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-refuter` | 20916 | 10 | `{"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.refuter","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","process-cost","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-release-close` | 18814 | 10 | `{"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.release-close","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","process-cost","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-reviewer` | 37365 | 10 | `{"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.reviewer","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","process-cost","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-router` | 10954 | 10 | `{"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.router","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","process-cost","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-verifier` | 34009 | 10 | `{"ids":["anti-oscillation","bounded-boy-scout-cleanup","concurrent-work-requires-worktrees","contributor.verifier","correctness-over-sycophancy","fail-conservative-correction","goal-alignment","no-attribution","no-lint-type-disables-as-fixes","no-partial-completion","process-cost","read-your-own-output","verify-app-before-done"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |

With the author's layer left out:

| Root | Bytes | Unit lines | Origin |
| --- | --- | --- | --- |
| `dotln-executor` | 36798 | 0 | `{"ids":["adjacent-repair","communication-intent","contributor.executor","decision-receipts","follow-up-queue","goal-alignment","operator-check-in","process-cost","tinkerer-economy"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-planner` | 20493 | 0 | `{"ids":["contributor.planner","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-refuter` | 14818 | 0 | `{"ids":["contributor.refuter","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-release-close` | 12716 | 0 | `{"ids":["contributor.release-close","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-reviewer` | 30941 | 0 | `{"ids":["contributor.reviewer","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-router` | 7103 | 0 | `{"ids":["contributor.router","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |
| `dotln-verifier` | 27585 | 0 | `{"ids":["contributor.verifier","goal-alignment","process-cost"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"}` |

## The hooks and the host's attribution setting

| | With no overlay | With the author's layer left out |
| --- | --- | --- |
| Hook files | `agent-finished.mjs`, `commit-msg.mjs`, `concurrent-work-requires-worktrees.mjs`, `failure-observer.mjs`, `finish.mjs`, `no-attribution.mjs`, `no-lint-type-disables-as-fixes.mjs`, `permission-denied.mjs`, `permissions.mjs`, `read-observer.mjs`, `session.mjs`, `write-observer.mjs` | `agent-finished.mjs`, `failure-observer.mjs`, `finish.mjs`, `permission-denied.mjs`, `permissions.mjs`, `read-observer.mjs`, `session.mjs`, `write-observer.mjs` |
| `attribution` in `.claude/settings.json` | `{"commit":"","pr":"","sessionUrl":false}` | absent |

## What the bundle's manifest records

```json
{
  "unequipped": {
    "units": [
      "anti-oscillation",
      "correctness-over-sycophancy",
      "fail-conservative-correction",
      "verify-app-before-done",
      "no-attribution",
      "concurrent-work-requires-worktrees",
      "no-lint-type-disables-as-fixes",
      "read-your-own-output",
      "no-partial-completion",
      "bounded-boy-scout-cleanup"
    ],
    "rules": [
      "browser-verification",
      "artifact-shape",
      "expected-data",
      "durations",
      "publication-check",
      "own-decisions",
      "operator-aim",
      "operator-words",
      "question-pathways",
      "claims-evidence",
      "request-authority",
      "blocked-turn",
      "runnable-commands",
      "stop-monitors",
      "safeguard-refusals"
    ]
  },
  "overlay": {
    "path": "build/overlay.json",
    "sha256": "5b2d4c03ebe6c2741dd36d283c6d952bf403f03105dcb73333ddf31e146372d3"
  }
}
```
