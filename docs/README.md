# DotLn documentation

## Map

```
docs/intake/       raw, local-only (gitignored) — the founding dump lives here
docs/PLAYBOOK.md   the operator's canonical loop (models, worktrees, verify)
docs/product/      the blueprint: vision, principles, domain model,
                   architecture, interfaces, patterns, roadmap, execution guide,
                   multi-audience publication compiler, and audit/resilience map
docs/lineage/      idea-ledger.md — append-only record of every founding idea
docs/decisions/    ADRs — settled questions
docs/work-orders/  bounded, executable next steps (feed one to any model)
docs/discovery/    machine-audit outputs and runtime target maps (WO-001 and
                   later discovery passes)
```

Pipeline status: intake ingested and synthesized (2026-08-30). The blueprint
is the plan; execution proceeds work order by work order.

## Why intake is gitignored

`docs/intake/` is excluded from git on purpose. Raw chat exports are the single
most likely place for work context to leak into a personal repo — a pasted
snippet, a config value, an internal service name you forgot was in there.
Dumping freely into a local-only folder means you never have to self-censor
while dumping.

The synthesized docs in `docs/product/` are written fresh from your ideation and
*are* committed. That's the scrub boundary: nothing reaches GitHub without
passing through a rewrite first.

If a piece of intake is clearly clean and worth keeping in history, move it out
of `intake/` deliberately rather than loosening the ignore rule.

## Dumping into intake

- `chats/`  — transcript exports, any format. Name them so order is recoverable.
- `images/` — screenshots, mockups, whiteboard photos, sketches.
- `notes/`  — anything you typed yourself.

No naming scheme required. Tell me when a batch has landed and I'll read it.

## Config log

One line per `.claude/` or CLAUDE.md change (see execution guide):

- 2026-08-30: added `.claude/settings.json` with `autoMemoryEnabled: false` —
  DotLn builds its own external memory; no ambient layer meanwhile.
