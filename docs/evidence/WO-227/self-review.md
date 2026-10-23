# WO-227 self-review

Two fresh `dotln-worker-fable` agents (claude-fable-5-1, effort `xhigh` by
launch selection; the host read back no effective effort) each received the
order and the diff against HEAD with the new evidence files, read-only. The
operator's steering of this session selected the Fable type. Found 24; fixed
20; recorded 4.

## Adversary of the criteria (12 findings)

| # | Finding | Disposition |
| --- | --- | --- |
| 1 | The display-name exemption blanked the text before the private-list check, so a `refuse:` term that merely contains the name slipped through (probe: `refuse: AcmeCorp` with display `Acme`). | Fixed: the private list is never masked; exempt spans drop public review words by containment only. Case in the lint suite. |
| 2 | A lone CR in the reviewed prose shifted the Change rows by one line, so the base-tree exemption landed on the wrong row. | Fixed: rows are offsets found from the rendered row text, matched by span containment. |
| 3 | `[0-9]{3,}` and a hyphen-admitting boundary refused `review-2026-10-21.md`, `ws-2024`, `final-100-percent.png`. | Fixed in part: the forms take exactly three digits (`review-2026`, `ws-2024`, `WO-1000` pass). A three-digit form followed by a hyphenated continuation stays the launchpad form; recorded in D014 as the order's accepted shape. |
| 4 | `review : Beta` (space before the colon) was read as the term `reviewbeta`. | Fixed: the two mode words with optional space before the colon are markers. |
| 5 | Any unmarked term holding a colon (`http://internal.example`, `svc:8080`) threw for every list consumer after the update. | Fixed: only the two mode words are markers; other text is the term, as at the base. Parse case in the lint suite. |
| 6 | The bound-digest refusal ran before `ensureRelease`, so a Release completed under `objective` by this kit refused once the order said `reviewed` instead of reporting existing. | Fixed: the digest holds only an attempt that pushed the tag and still owes the Release; a completed Release is rechecked by its recorded digest (`admittedBodyDigests`). The fixture no longer edits the record to reach `existing`. |
| 7 | A zero-width character inside an identifier in a commit subject or title is not seen; only bodies get the rendered view. | Recorded: the same gap as the runtime forms, outside this order (D014). |
| 8 | `withMeterBlockLast` ended with `trimEnd()`, removing a last prose line's trailing hard-break spaces. | Fixed: only trailing newlines are trimmed. Case in the github-body suite. |
| 9 | The confirmation digest covers the composed body while review items of the branch, commits and title are confirmed under it. | Recorded: the order words the digest as the composed body's (D004, D014). |
| 10 | The records commit message was linted without `target` and refused on a `review` status. | Fixed: linted as a target's; a review word in the kit's fixed message is admitted. |
| 11 | `release close … --confirm-terms` with no value read as no confirmation. | Fixed: one shared parser (`scripts/lib/confirm-terms.mjs`) validates presence and shape for both commands. |
| 12 | The `terms` key advisory printed only when nothing refused. | Fixed: advisories print before the refusal. |

Could not break, as reported: every identifier form in each kind including the
fullwidth spelling; `Closes #4`; the launchpad title; the retained draft commit
across reruns; stale and malformed confirmations; `reviewTerms: []`; both keys;
the alias advisory; no private term printed anywhere; section labels and paths;
kit rows exempt; `plan check` advisories; the meter move before any shape
judgment; the current order's body alone judged; CRLF bodies; byte-identical
legacy text; dry runs excluded from the bound attempt; absent or invalid notes
refusing before the tag closure; no dependency or role-text change.

## Improver of design (12 findings)

| # | Finding | Disposition |
| --- | --- | --- |
| 1 | Four overlapping exemption mechanisms with a first-match ordering dependence. | Fixed: sections resolve to the narrowest containing part; the record-link parts no longer depend on order; rows are spans. |
| 2 | Row line arithmetic coupled to the table's layout and LF-only splitting. | Fixed: rows are offsets of the rendered row text. |
| 3 | Three meter regexes and two marker pairs. | Fixed: `withMeterBlockLast` and `METER_MARKERS` live in github-body.mjs beside the shape check; both release call sites pass the rendered table. |
| 4 | Duplicated `reviewing`/`reviewFinding`, `localModes`/`localTermModes`, `labelled`/the compose loop, the session variables and journal key, two digest spellings. | Fixed except one: `isReviewFinding`, `labelledParts`, `sessionJournalKey`, `sessionHarness` and `digestOf` have one owner each. The two-word modes constant stays in both terms.mjs and the pure lint, because importing the lint into terms.mjs pulls it into the registered authority and harness evidence import closure (the sync refused it); the lint's copy says so. |
| 5 | Two hand-rolled `--confirm-terms` parsers with different refusals. | Fixed: one shared, validating parser. |
| 6 | Literal U+FE0F and U+200D replaced the escapes in the emoji regex (a transport artifact of this session's edits). | Fixed: the escapes are restored; the module holds no literal non-ASCII character. |
| 7 | `targetOrderPathAdvisories` swallowed invalid input silently, shadowed `path`, and told the author to list an identifier. | Fixed: an invalid vocabulary or `**Repository:**` line is itself an advisory; the identifier remedy is to rename the file. |
| 8 | `model: "unknown"` hard-coded without saying no host reads a model back. | Fixed: the comment says so; the field keeps the attestation's shape. |
| 9 | `checks.identifiers` beside `checks.runtime`. | Fixed: `checks.launchpadIdentifiers`, mirroring the rule. |
| 10 | Tests pinned full refusal sentences and hard-coded section offsets. | Fixed in part: the node suites assert the rule, line, part, path and digest tokens and derive offsets; the shell suite keeps the operator-facing shape messages, which are the behaviour it judges. |
| 11 | Comments ending in an order tag where the sentence already explains; `FRAME` named a metaphor. | Fixed: tags dropped where the explanation stands; `KIT_FRAME_EXEMPT` says what it holds and cites WO-221-D006 as the reason. |
| 12 | `baseTreePaths` listed the whole base tree. | Fixed: scoped to the changed paths. |

Each fix was rerun through its suite or a targeted probe; the complete run
recorded in [handoff.md](handoff.md) judges the final bytes.
