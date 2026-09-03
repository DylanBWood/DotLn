# Final-review artifacts

Final review is an evidence-bearing closeout episode after any number of
implementation, verification, and repair loops. Reports are immutable and
numbered per work order:

```text
docs/final-reviews/WO-003/FINAL-001.md
docs/final-reviews/WO-003/FINAL-002.md
```

The reviewer reads the authoritative work order, complete numbered verification
sequence, current diff, executable evidence, and every ideation breakout receipt
plus affected ledger, product, domain, schema, and decision surfaces. It may
make bounded, non-substantive handoff corrections such as wording, links, or PR
metadata and must rerun affected checks. Any correction that changes code,
contracts, acceptance behavior, schema, compatibility, authority, or prior
verification evidence makes the final review fail: repair then returns through a
fresh numbered independent `VER-NNN` before another `FINAL-NNN`. The final
reviewer never implements an acceptance-relevant fix and approves it itself.

A passing report includes the final evidence summary, remaining deviations/open
questions, proposed PR title and body, and confirmation that the branch is ready
for operator review. After committing the reviewed state, the authorized publish
step pushes the WO branch and opens a PR. It never merges that PR; the operator
reviews and merges it. Each failed or repeated final review writes the next
`FINAL-NNN` rather than replacing history.

Beginning with WO-024, every passing package also contains
`docs/final-reviews/WO-NNN/RELEASE-NOTES.md`; reviews completed before WO-024
legitimately lack this artifact and receive the labeled release-time fallback.
This is reviewer-authored output, not generated prose for a reviewer to approve,
and it is required even when the work order has a no-release disposition: those
notes ride the next release tag that contains the work. The file has no preamble
and exactly these level-two headings in this order:

```markdown
## Release overview

<Visible payoff, audience, and why this matters.>

## Read before upgrading

None.

## Substantive changes

<Changed behavior grouped by product area.>

## Progressive polish

None.

## Evidence and compatibility

<Evidence, versions, compatibility, and known limitations.>
```

Every section has content; use the literal line `None.` when there is nothing to
report. Release overview and read-before-upgrading may never be blank. The notes
describe changed behavior by product area, not commits or filenames, and
progressive polish may not hide semantics, saved-data interpretation,
compatibility, authority, security/privacy, recovery, or required operator
action. Notes use a deliberately strict Markdown subset: raw HTML and HTML
comments are forbidden, setext level-two headings are forbidden, and rendered
level-two headings (including headings nested in quotes or lists) may appear
only as the five exact column-one headings above. As a conservative source rule,
any line outside a fenced code block that begins with whitespace plus `##` is
refused; put heading-syntax examples in fenced code rather than indented code.
The tag-manifest marker lines are reserved and may not appear in notes.
`worktree publish` validates the committed file before any branch push.

Beginning with WO-025, the committed `PR.md` and `RELEASE-NOTES.md` are also
renderer-wrapped GitHub bodies. Author each ordinary prose paragraph and each
list-item paragraph on one physical source line, even when it exceeds the
repository's code `printWidth`; the reader's renderer owns visual wrapping.
Use physical newlines for semantic structure such as headings, blank paragraph
boundaries, distinct list items, fenced or indented code, tables, and explicit
Markdown hard breaks. The template placeholders above describe logical blocks,
not an 80-column source width. Publication checks the committed bytes and then
transports them unchanged. This removes a repository-imposed source width; it
does not change GitHub's own page width. The rule is forward-only: historical
PRs, review reports, and release-note artifacts remain byte-identical.
