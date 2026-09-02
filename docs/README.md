# DotLn documentation

## Map

```
../README.md       repo front door — what DotLn is, what runs today, horizons
docs/intake/       raw, local-only (gitignored) — the founding dump lives here
docs/PLAYBOOK.md   the operator's canonical loop (models, worktrees, verify)
docs/AI-HARNESS-SECURITY.md
                   dated personal Claude/Codex sandbox setup and rollback guide
docs/product/      the blueprint: vision, principles, domain model,
                   architecture, interfaces, patterns, roadmap, execution guide,
                   publication compiler, audit/resilience map, and IR compatibility
docs/publication/  audience/status index, audience outlines, shared sample,
                   implementation overlay template, and staleness proof
docs/planning/     evidence-backed capability inventory + provisional work-order map
docs/lineage/      idea-ledger.md — append-only record of every founding idea
docs/decisions/    ADRs — settled questions
docs/work-orders/  bounded, executable next steps (feed one to any model)
docs/verifications/ immutable numbered verifier reports, grouped by work order
docs/final-reviews/ immutable numbered closeout reports and PR handoffs
docs/control/       append-only resume log and generated current-state projection
docs/releases/     historical v0.2.0 records + forward tag-manifest template;
                   later immutable manifests/notes live in annotated tags
docs/discovery/    machine-audit outputs and runtime target maps (WO-001 and
                   later discovery passes)
```

Pipeline status: founding intake ingested and synthesized (2026-08-30). The
blueprint is the plan; execution normally proceeds work order by work order. An
`ideation:` prefix dispatches the full intake → clean-room synthesis → ledger →
product-doc pipeline unless it explicitly says capture-only. Fresh sessions
follow `docs/product/07-execution-guide.md` §Operator-opened ideation mode
without requiring the operator to restate those stages.

## Why intake is gitignored

`docs/intake/` is excluded from Git so unfinished personal ideation can stay
local while it is reconciled. Gitignore is not a security boundary: employer
code or configuration, credentials, internal identifiers, proprietary API
shapes, and managed-host details do not belong there or anywhere else in this
repository. If raw material contains any of those, stop and quarantine it
outside the repository rather than reading it into the synthesis pipeline.

The synthesized docs in `docs/product/` are written fresh from your ideation and
_are_ committed. That's the scrub boundary: nothing reaches GitHub without
passing through a rewrite first.

If a piece of intake is clearly clean and worth keeping in history, synthesize
and rewrite it into the appropriate committed document. Do not move or copy raw
intake verbatim, and do not loosen the ignore rule.

## Dumping into intake

- `chats/` — transcript exports, any format. Name them so order is recoverable.
- `images/` — screenshots, mockups, whiteboard photos, sketches.
- `notes/` — anything you typed yourself.

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
symbolic links in intake so a link cannot pull unrelated files into the ZIP, and
refuses destinations inside the repository.

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
resume: next
resume: fix
resume: verify
resume: final review
resume: release close
```

The executable/debug actions for the first five phrases are `status`, `next`,
`fix`, `verify`, and `final-review`, invoked as `npm run resume -- <action>`.
The resolver rejects illegal phase transitions and prints the authoritative work
order and verification artifact to read. `release close` is the separate guarded
post-merge operation projected as `npm run release -- close WO-NNN --publish`;
it carries narrow annotated-tag authority. Verifiers and reviewers record
completion with the internal actions documented in `docs/PLAYBOOK.md`.

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
  dispatch wiring). Logged retroactively at final review (FINAL-001); the change
  itself shipped without its config-log line.
- 2026-09-01: the repository-wide Prettier pass normalized CLAUDE.md layout;
  instruction semantics did not change.
- 2026-09-01: CLAUDE.md — §Start here now treats `ideation:` as a full durable
  pipeline dispatch by default, with an explicit capture-only exception.
- 2026-09-01: local Claude settings — enabled fail-closed sandboxing, pinned
  sandboxed Bash to default regular permissions, disabled unsandboxed fallback,
  and denied SSH credential reads/writes plus direct SSH/SCP/SFTP commands. This
  is a personal-machine setting, not repository enforcement; the sanitized
  baseline and rollback are in `docs/AI-HARNESS-SECURITY.md`.
- 2026-09-01: local Claude settings — the operator later enabled sandboxed-Bash
  auto-allow after default permissions produced an untenable parallel-subagent
  approval stream. Fail-closed startup, disabled unsandboxed fallback, and the
  SSH protections remain; ADR-0004 and the sanitized runbook record the tradeoff
  and observed local-rule drift without changing settings.
- 2026-09-01: local Claude settings repair — the operator's mid-verification
  change created the initial moving-state/documentation mismatch and was fully
  disclosed in VER-001. The verifier correctly left personal settings unchanged,
  but the repair agent then wrongly retained the executor's persisted
  `defaultMode: "default"` and marked the repair complete even though new
  sessions still opened in Manual. Under the operator's explicit correction,
  user settings now persist `acceptEdits`, keep sandbox auto-allow enabled, fail
  closed, prohibit unsandboxed retry, retain all credential/SSH denials, and the
  eleven accidental checkout-local Bash grants were removed. ADR-0005 records
  the correction without rewriting the earlier evidence. Targeted readback and a
  fresh unoverridden Claude process then confirmed the full posture and an
  `accept edits on` startup indicator; `claude doctor` found no invalid-setting
  warning.
