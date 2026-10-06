# WO-187 repair 004 — executor self-review

One fresh `dotln-worker` read only the order, the repair diff (checkpoint 17 to
the worktree) and the order's authored diff for the same files. It could import
the three reader modules read-only for bounded probes. It had no access to
evidence, reports, decisions, the handoff or the follow-up register, made no
repository write and spawned no descendant.

- **Inputs (SHA-256):** order `064d3555…a6c8`; repair diff `bd9b078f…569d`;
  authored diff `2c2265b3…4e40`. The diffs were taken before the fixes below.
- **Launch:** Claude `dotln-worker` by type, no per-call model override
  (definition pin claude-opus-5-5, xhigh).
- **Worker readback:** it reported its model as claude-opus-5-5 and no effort
  readback. Its effective effort is unknown.
- **Host task notification:** 216,973 worker tokens, 20 tool uses, 712,355 ms.
- **Session use:** one worker, zero descendants, cap 20.

It reported twelve findings. The root judged each one and reproduced every
finding it fixed; the fixture row named beside a fix fails without it
([mutations.json](mutations.json)).

| # | Finding | Root judgment | Disposition |
| --- | --- | --- | --- |
| 1 | A fence opened at the start of a line and closed by an indented closer stays open; a later fence closes it and a real label between them is neither printed nor advised. | Reproduced. | Fixed: a closing fence may be indented up to three spaces. Row 935. |
| 2 | A second findings block in a quote, a list item or another marker spelling is skipped silently. | Reproduced: a valid block plus a quoted block holding a blocking finding read measured without it. | Fixed: a marker line is any line whose only letters are a marker's name. Rows "a quoted second block" and the three after it; lifecycle row 813. |
| 3 | A failed review whose block lists no blocking finding records a complete-looking count. | Reproduced with a prose blocking finding beside a block holding one follow-up. All thirteen failed final reviews the order cites failed on a blocking finding. | Fixed: a failed review's block must list a blocking finding, or the count is unmeasured. Three table rows; lifecycle row 819. |
| 4 | Checking id shape, route and summary voids a count those fields do not enter; one capitalised route makes the last-ten rate unknown. | The observation is correct. D039 F1(a) sets these outcomes, and the count stays never-lower either way. | Recorded with a follow-up (D045): the choice between voiding and naming belongs to a judgment over real reviews. |
| 5 | Unverified: the advisory push may throw when lifecycle evidence is falsy. | Checked and dismissed: `requireLifecycleEvidence` has one return, an object that always holds an `advisories` array (`scripts/lib/lifecycle-evidence.mjs`). | Recorded as dismissed (D045). |
| 6 | The executor sentence does not say the self-review text must be a line. | Correct; the effect is advisory only. | Fixed: the sentence now says to add the handoff.md line, with no byte change to the executor root. |
| 7 | A heading under a bold label, or a pasted field label after a blank line, ends a section and later text is dropped without a word. | Correct, and the stated rule; the same holds for the indented-fence boundary the root's own probe found. | Fixed by making every cut visible: each section's header, and the empty-section advisory, name the line that ended it. Rows 918, 936, 938 and 940. |
| 8 | Near-label layouts draw no advisory: no space after `#`, a no-break space, two spaces, a hyphen, a table row, bare carriage returns. | Reproduced. | Fixed: any line outside a section whose first letters are `Known issue(s)` advises, and all three readers split lines on CRLF, LF or a bare CR. Row 937; orders 934 and 939. A label inside an HTML tag stays unread. |
| 9 | Wording: the header's line range, singular against plural, the id cause, one code comment. | Correct. | Fixed in the header's description, the advisory, the id cause and product 07. |
| 10 | Edges: control characters in a summary, a fence info string with punctuation, a cut inside a surrogate pair, carry-in text that imitates briefing lines. | The first and third reproduce. The second reads unmeasured with an advisory, the safe direction; widening the fence-line pattern would drop an entry written on such a line. The fourth is the order's own text, delimited by each header. | Fixed in part: summaries reject control and line-separator characters, and entries are cut between characters. The other two are recorded as judged limits (D045). |
| 11 | Test rows that pin less than they claim: a vacuous evidence check, no quoted-copy row, a rate that depends on the clock. | Correct. | Fixed: the evidence check compares the advisory list, the rows are added, and the synthetic reviews are dated 2998 and 2999. The baseline failure's message is pinned in [fixture.json](fixture.json). |
| 12 | Maintainability: a repeated slice, a misnamed helper, an unnamed level, exports with no importer. | Correct. | Fixed: `classes`, `invalid`, `BOLD_LABEL_LEVEL`; the four unused exports are module-private. |

self-review: found 12; fixed 9; recorded 3

Findings 4, 5 and 10 are the three recorded ones; finding 10's two reproduced
edges are fixed.

The root's own probe before the review found one more boundary, which
finding 7's fix also covers: a field label at the start of a line inside an
indented fence, after a blank line, ends the section
([fence-rules.json](fence-rules.json)). Recognising indented fences loses a
more ordinary input with nothing said, so the rule stays and the header names
the cut.

The worker also reported what it attacked and found sound: determinism, one
count per entry (20,000 entries in 8 ms), marker handling across line ends and
indentation, prototype-named classes, the fence-line drop inside the block,
one advisory per result, the self-review line's forms, the documented label
and fence forms, linear regular expressions on 1 to 2 MB lines, and module
loading after the shared projection was removed.
