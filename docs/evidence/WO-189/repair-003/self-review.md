# WO-189 repair of VER-003 F1 — self-review

Two fresh reviewers judged the order and the diff before handoff: a criteria
adversary and a design, simplicity and maintainability reviewer. Each finding
and its disposition follows; "fixed" means the change is in the diff, and
"recorded" means it is kept as it stands, with the reason.

## Criteria adversary — found 14; fixed 11; recorded 3

| Finding | Disposition |
| --- | --- |
| D022's dispatch quoted the operator verbatim at 692 characters | fixed: paraphrased under 240 characters |
| The software-engineer edition's lock was stale after the product 07 edit | fixed: lock refreshed; both editions CURRENT |
| The decisions index and follow-up register were stale | fixed: `npm run meta` and the follow-up dispositions |
| One test line failed the formatter | fixed: `npm run format` |
| The class-probe evidence predated the final checker, and D021 said 30 cases | fixed: probe re-recorded (28 runs, no mismatch); counts corrected |
| The rule sentences said less than the code refused; contents links and prose mentions were refused as namesakes | fixed: the namesake search reads only lines that can render as headings; the playbook and product 07 rewritten in place |
| D021 stated the no-space join more broadly than the code applied it | fixed: rule and statement aligned |
| The GitHub oracle's counts were not recorded | fixed: `github-oracle-result.json` and the README's measured results |
| Raw bidirectional controls in the source and the corpus | fixed: written as escapes; no changed file holds a raw invisible character |
| `scripts/lib/config.mjs` and the rule sentences reach beyond the order's named edits | recorded: the configuration export is the one way to read main's control root, which the ownership rule needs; criterion 6 owns the rule sentences |
| The corpus test took 80 to 85 seconds | fixed: the shape judgment is a pure function; the corpus runs in under a second |
| The D019 and D020 follow-ups had no disposition | fixed: both allocated to WO-189 |
| The oracle reaches the network | recorded: it sends synthetic fixture text only, caches by content hash, and reads the cache offline with `DOTLN_GITHUB_ORACLE_OFFLINE` |
| A new playbook line is long | recorded: Markdown is not formatted (`.prettierignore`), and the rendered page is unaffected |

## Design reviewer — found 33; fixed 26; recorded 7

| Finding | Disposition |
| --- | --- |
| The divergent-opener rule, the inside-HTML exemption and the divergent declarations had no defending row | fixed: superseded by the rule that the page holds no raw HTML |
| The ownership changes had no fixture | fixed: fixtures for the `.github` stand-in, a symlinked page, a moved control root, a malformed field, a missing block, a moved page and an added block |
| A `.github` regular file crashed the check | fixed |
| The code-sentence rule needed a decision | fixed: kept, with refuse rows, and widened past dashes and numbers |
| Three of six name-key variants, the HTML chunk containment, the multi-line code refusal and the counted-line `<` rule earned no row | fixed: removed |
| The ideographic-stop break refused one-sentence quotes and decimals | fixed: it breaks only before a letter |
| Reading invisible characters as spaces could be removed | recorded: zero-width joins rely on it |
| `frontPageFindings` mixed ownership and shape | fixed: `frontPageShapeFindings` is pure, and the corpus and the oracle call it |
| `whatRunsSection` could be split | recorded: it stays one judgment of one range |
| The page builder was duplicated | fixed in the test (`frontPageText`); recorded for the oracle, which mirrors it with a comment |
| Corpus harness: stale replace targets, unknown keys, rows without a shape, duplicate names, the missing pattern in messages, an unmarked known limit | fixed |
| Patterns are not required on new rows | recorded: most new rows carry one; requiring it would rewrite 271 older rows |
| Comments: the mapper parameters, block interiors, the sentence constants, the namesake search, the lone carriage return's invariant | fixed |
| `SECTION_NAME` could be derived from the heading | recorded: the literal is plain and tested |
| Duplicate `rowOf` helpers and mixed line indices | recorded: kept local to each function |
| A three-state refusal type; a misleading table name | fixed: one refusal per node; `NODE_FIX` |
| Messages that did not name the fix | fixed: each refusal names its fix |
| Three corpus rows named for a check that no longer defers | recorded: their expectations and reasons are current; renaming would orphan their earlier references |
| Footguns for later front-page executors (contents links, autolinked lines, CJK quotes) | fixed |
