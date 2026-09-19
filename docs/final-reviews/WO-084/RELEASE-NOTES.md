## Release overview

The idea ledger promises newest-first reading, and for two weeks it did not deliver it: 31 sessions dated 2026-09-05 to 2026-09-18 had been appended below the old Resolutions section at the far end of a 7,700-line file, two of them operator ideation from the day before this release, where a reader starting at the top never met them. This release puts every dated session back in newest-first order above the founding corpus, gives the settled founding tensions their own page, and adds a generated index with a check, so where a new section goes is a rule a command enforces and no longer a choice made at each write. It is for anyone who reads or writes `docs/lineage/`: the operator, and every planning, ideation and executor session that records an idea. Nothing in the runtime, the compiler or any package changes.

## Read before upgrading

**Resolutions moved.** "Resolutions of known tensions" now lives at `docs/lineage/resolutions.md#resolutions-of-known-tensions`, verbatim. A link to the old in-ledger section no longer resolves. Every live pointer in this repository was updated; a fork or note that links the old anchor needs the new path.

**Every ledger write now has a second step.** After adding or moving a section in `docs/lineage/idea-ledger.md`, run `node scripts/lineage.mjs index`. The index records each section's line number, so any insertion makes it stale, and `npm run test:docs` refuses a stale index with that exact command in the message. The check is a document preflight: while it fails, the document suites that wait on preflights are skipped, so the run is short and mostly skipped until the index is regenerated. No role procedure names the command yet; the ledger header, the index and the refusal do.

**A branch that already adds a ledger section will merge into a reordered file.** Place the section directly below the header, newest first, and regenerate the index. The check refuses a section below the founding corpus, an undated heading, a date out of order, an entry without a lifecycle tag in its lead, and a tag outside the declared set.

**The header's vocabulary grew.** The status declaration now lists ten statuses where it listed five. The five additions (`rejected`, `deferred`, `candidate`, `open`, `specified`) were already in use on 41 entries; their one-line definitions are new wording and do not change any recorded disposition. `operator-directed` and `operator-authorized` are declared as provenance. Three existing entries gained an `adopted` tag they did not carry, because every entry needs a lifecycle status; they are listed in the migration manifest.

No schema, event, package version, dependency, authority or publication control changes. There is no data migration.

## Substantive changes

**Ledger order.** All 142 original sections survive: 141 in the ledger and Resolutions on its own page. Every `##` heading is byte-identical, which keeps all 13 planning-pass identifiers and their refutation receipts valid, since a pass is addressed by a hash of its heading. 138 section bodies are byte-identical, two differ only in trailing blank lines, and two differ only by six lead-tag edits. Dated sessions run newest-first; sessions sharing a date keep the relative order they had; the founding Images inventory and Chat 011 to Chat 001 stay last, and nothing may be filed below them. The header carries a dated migration note that names the move.

**A generated index.** `docs/lineage/README.md` lists each section with a source-line link, its entry count and its lifecycle-tag count, totals by status across 970 entries, and the sections that carry no lifecycle tag (the Images inventory and one prose-only section). Counts are tag memberships in entry leads; six entries carry two lifecycle tags.

**A check in the document suite.** `node scripts/lineage.mjs index --check` validates the order, the founding boundary, the date format, each entry's lead tag, the declared status set and the index bytes, and writes nothing. A tag counts only in an entry's lead, so a status word in nested evidence, later prose or a fenced example cannot satisfy it. It runs inside `npm run test:docs` with a seven-case fixture suite and stays out of `npm test`, under the 2026-09-15 stand-down that keeps document checks out of the product gate. It takes about a tenth of a second.

## Progressive polish

Six legacy entry leads were normalized to the backtick tag convention (for example `**Adopted:**` to `` `adopted`: ``). Pointer updates to the new Resolutions path landed in the execution guide, the planning map, one work-order citation and the documentation map, and both publication editions' source locks were refreshed for the edited sections. The runner's fixture inventory gained the two new script names. The full list is in the [migration manifest](../../evidence/WO-084/migration.json) and the [implementation evidence](../../evidence/WO-084/README.md).

## Evidence and compatibility

Source: branch `wo-084` over `main` at `cb932c84`, staged as application `v0.31.2`, a patch above `v0.31.1`, with no component version change and no new dependency. The final-review gate `npm test -- --review` passed 22 suites with 0 failures in 483.22 s, recorded 2026-09-19T05:34:02.311Z at code identity `d995b166`. Independent verification [VER-001](../../verifications/WO-084/VER-001.md) passed on first verification with no findings, confirming the status counts against a separate Markdown parser and the refusals against copies of the real ledger; [FINAL-001](FINAL-001.md) re-derived section preservation and the refusals with its own scripts. Decision record: [WO-084-D001](../../evidence/WO-084/decisions.md#wo-084-d001).

Node. The gate and the verification above ran before the machine's default Node was upgraded to v26.9.0 during final review; the document suite then passed 19 of 19 under v22.2.0, the version the environment baseline records. On v26.9.0 the document suite stops at `feedback-evidence`, a suite this release does not touch, because the feedback audit expects TAP output that the newer `node --test` no longer prints by default; this release's own check and fixtures pass on both versions. No product gate has been observed on v26.9.0.

Known limitations. Within one date the order is whatever it was before, which mixes sections once filed newest-first with sections once appended oldest-first; the time of day is not in the headings. The date-order refusal names the first section that is newer than the one above it, which is the neighbour of a misfiled section and not the misfiled section itself. Index links use GitHub's source-line form (`idea-ledger.md?plain=1#L43`) and open the file without jumping to the line in a local viewer. The five new status definitions and the three inferred `adopted` tags are the executor's reading and await the operator's confirmation.
