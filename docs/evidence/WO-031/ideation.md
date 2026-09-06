# WO-031 ideation receipt

**Authority:** five operator `ideation:` messages on 2026-09-05 and an
affirmation. They authorize the publication and correction guidance below.
The subsequent operator directive requires continuing after each ideation intake
until ready to verify; the execution guide and playbook now replace their former
opt-in continuation wording with that default.

**Actor:** Codex CLI 0.153.4; GPT-6 Astra, max effort, operator-attested selection.
The CLI version was observed locally; no effective-session readback is claimed.

**Source treatment:** Clean Room with Shape-First Synthesis and public vocabulary.
No direct-filing exception. The reviewed source excerpts and new messages contain
no employer material, credentials, internal services, or other stop condition.

## Intake and provenance

The main control-plane checkout was resolved with `git worktree list --porcelain`.
The following files are in its ignored `docs/intake/notes/`, not the worktree's
intake:

- `wo-031-publication-style-ideation-2026-09-05.md`
- `wo-031-publication-proportionality-ideation-2026-09-05.md`
- `wo-031-canonical-intake-ideation-2026-09-05.md`
- `wo-031-publication-quality-ideation-2026-09-05.md` (clarification and affirmation)
- `wo-031-gitmoji-selection-ideation-2026-09-05.md`
- `wo-031-ideation-continuation-2026-09-05.md`

The first two messages were initially staged in this worktree. Their canonical
copies were compared byte for byte before the staging files were removed. All
six files were verified in main. No reconciliation remains pending.

Targeted lookup in main's founding intake found the anti-oscillation directive
at `notes/001-notes.md:98`, commit-scope and PR-convention names in that same
inventory, and anti-oscillation mechanism mappings at `chats/005-gpt.md:118` and
`chats/010-gpt.md:631`. The lookup establishes those specific references; it does
not establish that the full original rule bodies have been imported, mined, or
implemented. ADR-0001 continues to govern synthesis from the personal corpus.

## Decisions and changed surfaces

- **Editorial quality:** titles identify the change; summaries explain its
  effect, reason, relevant evidence, and material consequences. Detail follows
  the reviewer's needs. Neither an arbitrary word count nor a sentence quota
  answers the feedback. The PR/commit section in product 08 owns this guidance;
  product 07 and the playbook link it. Historical publications remain evidence
  of what was written, not templates for new titles.
- **Coherent commits:** separate distinct changes at the authorized commit
  phase, keeping necessary tests and documentation with each implementation.
  The active order records publication guidance as a separate change from the
  eventual actor-usage implementation. No commit-count quota is introduced.
- **Gitmoji choice:** consider the full catalog and choose a relevant, expressive
  match for the actual change. Product 07's former narrow default mapping is
  replaced; product 08 owns the editorial guidance and links the official
  catalog checked on 2026-09-05. No rotation quota or repetition ban is added.
- **Proportionate correction:** retain the intended outcome and the reasons
  earlier approaches were rejected. Product 07 states the manual behavior;
  product 02 records its relation to the planned anti-oscillation mechanism.
  WO-011 now links this incident as evidence for its existing unit.
- **Canonical intake:** product 07, the playbook, and the documentation index
  now require resolving main before original-source lookup as well as capture.
- **Lineage:** the new ledger section, “2026-09-05 WO-031 publication and
  correction discipline,” records these ideas without rewriting older entries.
  WO-031's heading is shortened; its actor-usage acceptance criteria are intact.

The publication index and both edition locks are refreshed for the new section
and changed source bytes. The generated work-order index reflects the shorter
heading and additional incident citation. There is no runtime, dependency,
schema, release-target, account-setting, or external-publication change in this
breakout. No executable helper is introduced.

## Required review

The independent verifier and final reviewer must read this receipt and the
promoted documents, check traceability and internal links, confirm coherent
commit grouping at final review, and assess the prose for both unnecessary
detail and missing substance. Existing automated publication checks cover
structure and source freshness, not writing quality.

WO-011's eventual regression must retain useful specificity after excessive
verbosity is rejected, reject an unsupported numeric limit, and preserve the
first correction when that limit is rejected. This is an incident specification;
compiled enforcement remains unimplemented. No new decision or rule-stack
import is authorized or required by this receipt.

The operator corrected the initial stop after this breakout: execution continues
to ready to verify. The actor-usage outcome and its evidence are recorded in
this directory's implementation report; this receipt is part of the independent
verification subject.

## Validation

`npm test` passed (exit 0): formatting, all shell and control-lifecycle suites,
publication coverage for 228 of 228 headings with both edition locks current,
the generated work-order index, the clean TypeScript rebuild, package tests,
the eight identity-corpus tests, and four frozen artifact-evidence checks.
`git diff --check` passed. The initial five captures are ignored in main, and main's
tracked working tree remains clean. These checks validate the documentation
change and existing behavior; independent editorial review remains required.
