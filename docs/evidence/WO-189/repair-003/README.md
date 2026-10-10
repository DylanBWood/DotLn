# WO-189 — repair of VER-003 F1

Dispatch: `resume: fix`, repairing [VER-003](../../../verifications/WO-189/VER-003.md)
F1 under criterion 5, with D020's follow-up taken within the bound and the
operator's steering recorded in [D022](../decisions.md#wo-189-d022--repair-process-twenty-reviewers-as-a-measured-experiment-not-an-activation-count).

## What changed and why

The guard's rule is [D021](../decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice).
Four repairs had each listed the spellings they knew, and each round of attack
varied the representation. The variations came from two open surfaces: raw
HTML, which GitHub and the check's parser tokenize differently, and the gap
between the parser's tree and what GitHub shows. The page needs no raw HTML,
so the guard refuses it outside the marker lines; each counted line is read
twice, once without the parser, and both readings must be one sentence. The
budget is main's, an order is judged on its own change, and every refusal
names its fix.

The front page's own changes are [D023](../decisions.md#wo-189-d023--repair-the-front-page-follows-the-operators-recorded-judgment-claims-and-voice-alike):
accuracy corrections the operator chose or the operator's recorded rules
decide, and lines from the parts the order keeps in their own words, restored
in the operator's wording. [The diff against the chosen candidate](readme-vs-candidate-1200.diff.txt)
lists every change; the candidate stays as its readers scored it.

## Reproduce

- The corpus: `node --test --test-name-pattern="front-page corpus" scripts/test-docs-check.mjs`
  judges every row of `scripts/fixtures/front-page-corpus.json` on its bytes
  and, unless `formatted` is false, after the formatter. A reviewer's own rows
  run through the same harness with `DOTLN_FRONT_PAGE_CORPUS=<rows.json>`.
- GitHub as the oracle: [github-oracle.mjs](github-oracle.mjs) renders each
  row's page through GitHub's Markdown API (synthetic fixture text only;
  cached by content hash, throttled; `DOTLN_GITHUB_ORACLE_OFFLINE` reads the
  cache without the network) and compares GitHub's headings and sentences with
  the guard's verdict. [Its result](github-oracle-result.json) is the record.
- The report's own probe, unchanged:
  `node scripts/harness.mjs bounded -- node docs/evidence/WO-189/verify-003/boundary-probes.mjs`
  ([after](ver003-boundary-probes-after.json)).
- Cases the report did not quote: [class-probes.mjs](class-probes.mjs), run on
  the pre-repair checker ([before](class-probes-before.json)) and on this one
  ([after](class-probes-after.json)).
- The follow-up allocations: [D019](followup-d019.json) and
  [D020](followup-d020.json).

## Process

Twenty-five reviewers ran as a staged experiment (D022): seven partitioned
and generalist adversaries, seven re-attackers and self-reviewers on the
redesign, six front-page readers in distinct roles, two passes compiling the
operator's recorded judgment, and three on the final state. Their findings
entered the corpus as rows before the check changed; GitHub's rendering, not
the reviewers' inference, settled what a reader sees. D022 records the
measured results.

## Measured results

Token, tool-call and wall-clock figures are each agent's own completion
record; findings count classes that changed the guard, the corpus or the page.

| Wave | Agents | Tokens | Findings that changed something |
| --- | --- | --- | --- |
| 1 — attack, partitioned and generalist | 7 | 1,916,665 | about 30 bypass classes; 497 corpus rows |
| 2 — re-attack and self-review of the redesign | 7 | 1,791,714 | raw-HTML tokenizer states, per-paragraph slack, emoji shortcodes, a declared order raising its own budget, container openers, a crash on a `.github` file, 5 handoff blockers; 266 rows |
| Reader panel, six roles | 6 | 761,893 | 5 overclaims on the page, each found by two to six readers |
| Operator judgment, compiled from the record | 2 | 611,333 | the record that overturned this repair's first premise about restoring the page's voice |
| 3 — final state | 3 | 949,529 | a new inaccuracy and three splices in the corrected page; record edits that moved the guard; code-span separators; digit-leading shortcodes; two backtracking patterns; links and lists only GitHub forms (control characters, label case folding and length), three of them confirmed by GitHub; 64 rows |

What the arms showed:

- The two identical generalists shared about four classes and each found three
  or four the other did not; identical briefs were less redundant than assumed.
- Each specialist found at least one class no other agent found. Overlap
  concentrated where partitions met (raw HTML found by four agents, the lone
  carriage return by four, the nameless closer by two).
- The stopping rule never triggered: every wave found blocking classes until
  the budget was spent. The structural closures (no raw HTML, two readings,
  main's record) cut each surface they closed; the corpus, not a claim of
  completeness, holds what remains.
- In all, the 25 agents used 6,031,134 tokens; the corpus ends at 915 rows, and GitHub renders every page the guard admits with one namesake and no more sentences than counted lines.
- GitHub's rendering settled what a reader sees: three of the reviewers'
  "unsound" claims were the oracle's own counting limits, and one known limit
  (a modifier letter after a stop) was real and is closed.
