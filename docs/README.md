# DotLn documentation

## Map

```
../README.md       repo front door — what DotLn is, what runs today, horizons
docs/intake/       raw, local-only (gitignored) — the founding dump lives here
docs/PLAYBOOK.md   the operator's canonical loop (models, worktrees, verify)
docs/product/      the blueprint: vision, principles, domain model,
                   architecture, interfaces, patterns, roadmap, execution guide,
                   publication compiler, audit/resilience map, and IR compatibility
docs/lineage/      idea-ledger.md — append-only record of every founding idea
docs/decisions/    ADRs — settled questions
docs/work-orders/  bounded, executable next steps (feed one to any model)
docs/verifications/ immutable numbered verifier reports, grouped by work order
docs/final-reviews/ immutable numbered closeout reports and PR handoffs
docs/control/       append-only resume log and generated current-state projection
docs/discovery/    machine-audit outputs and runtime target maps (WO-001 and
                   later discovery passes)
```

Pipeline status: founding intake ingested and synthesized (2026-08-30). The
blueprint is the plan; execution normally proceeds work order by work order.
When the operator explicitly reopens ideation, fresh sessions follow
`docs/product/07-execution-guide.md` §Operator-opened ideation mode without
requiring the operator to restate the intake → ledger → product-doc pipeline.

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

## Backing up local intake

From the repository root, run:

```bash
npm run backup:intake
```

This creates a timestamped ZIP beside the project directory, for example
`DotLn-wo003-intake-20260831T190000Z.zip`. The archive contains only
`docs/intake/`, is validated before being finalized, receives owner-only file
permissions, and never overwrites an existing backup. The script refuses
symbolic links in intake so a link cannot pull unrelated files into the ZIP,
and refuses destinations inside the repository.

To choose another existing or new destination directory:

```bash
bash scripts/backup-intake.sh /path/to/backup-directory
```

The ZIP is intentionally outside Git and may contain sensitive raw material;
move it only to a backup location you trust.

## Resuming the control loop

Fresh sessions read `docs/control/current.md` and the canonical JSONL behind it.
The normal operator interface is:

```text
resume: status
resume: fix
resume: verify
resume: final review
resume: next
```

The executable/debug equivalent is `npm run resume -- <action>`. The resolver
rejects illegal phase transitions and prints the authoritative work order and
verification artifact to read. Verifiers and reviewers record completion with
the internal actions documented in `docs/PLAYBOOK.md`.

## Config log

One line per `.claude/` or CLAUDE.md change (see execution guide):

- 2026-08-30: added `.claude/settings.json` with `autoMemoryEnabled: false` —
  DotLn builds its own external memory; no ambient layer meanwhile.
- 2026-08-31: CLAUDE.md — added the destructive-git rule for work-order
  worktrees (nothing is committed until final review; intake is single-copy).
  Verifier documentation correction during the WO-003 verification window; the
  executable guard is specified for the repair pass.
- 2026-08-31: CLAUDE.md — §Start here now resolves a bare `resume:` phrase via
  the execution guide's §Operator resume phrases (commit c339aef, executor
  dispatch wiring). Logged retroactively at final review (FINAL-001); the
  change itself shipped without its config-log line.
