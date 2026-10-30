# Choosing how a publication reads

The committed choice is [reader-profiles.json](../../control/reader-profiles.json).
Its five surfaces each select one position on five dimensions. Every surface
starts with `balanced`; a later planning pass can change individual positions.
The operator chooses at final review after seeing the alternatives.

Run `npm run reader -- preview prTitle` to see `record`, `balanced` and `reader`
side by side. Substitute `prBody`, `commitSubject`, `releaseNotes` or
`releasePage` for the other surfaces. `npm run reader -- profile prTitle` prints
the contract, meaning the document sections that state the surface's rules and the
functions that judge or render a draft, then the document kind and reader, and
asks for useful, complete information.
It does not select an example or rank artifacts by size. Examples illustrate
choices and preserve their facts and limits; they are not templates for later artifacts.
A profile is guidance; no command refuses or rewrites text for its style or size.

The examples use **v0.73.1**, the release that records which shared Git refs a
gate observed. `record` retains each source surface; balanced and reader
rearrange its facts and limits. Facts are compared within each surface: a title
does not carry the whole release note. Each file has JSON front matter naming
its positions and literal fact anchors. [facts.json](facts.json) identifies
those anchors; [illustrations.json](illustrations.json) supplies two sentences
for every dimension position. [comparison.json](comparison.json) binds the
independent comparison to the examples' hashes. `npm run reader -- check`
checks the choices, anchors and comparison freshness, not prose quality.

These are historical samples, not a new validation of that release. Their
front matter and preview disclose two source inconsistencies: the PR's account
of the first four verification verdicts differs from the release notes, and a
polish paragraph calls the harness host version a skeleton version. The record
retains the published wording; relative links in the release-note source are
resolved against that file and pinned to its tagged commit. Compare versions
within each surface and use the linked original evidence when judging the
underlying release.

To measure a changed profile, run `npm run reader -- score` and give its output
to one fresh pinned reader outside the repository, with no repository context
or tools. Return the requested JSON, then run `npm run reader -- score --record`
with that result file. All four questions must appear for each release, with an
exact quotation or null. The command checks every result before appending any,
and an already scored release appends nothing. A text hash and tag object bind
the answer to what the reader saw. The fraction records the first occurrence
of the quotation in Unicode characters, divided by the full text's length.
Null answers have no position and are excluded from the median.

The subject is the human Release text before the manifest in the annotated
tag. It retains historical rendering, including old links, rather than using
today's renderer. A profile revision hashes the validated choices in canonical
order, so whitespace and JSON key order do not create a new setting. Plan start
reports found answers and median position by revision; it recommends a reader
only when the current revision has not been scored and has three unscored
releases. When that condition holds, the prompt selects releases from the
triggering revision; otherwise it selects the newest unscored releases. The
operator can request a run at any time. This measures findability,
not whether a quotation is a good answer or the operator likes the text.

An operator correction is recorded only with
`npm run reader -- score --correction prBody --capture-hash` followed by the
capture's `sha256:` digest. It records the surface and current revision without
copying private capture text. Corrections are counted per surface beside the
Release-page figures; they are not inferred from conversation or treated as
scores of the other four surfaces.

The [baseline run](../../evidence/WO-191/baseline-run.json) covers the ten newest
releases at execution, with [the reader's answers](../../evidence/WO-191/baseline-reader.json)
and the [score log](../reader-scores.jsonl). The current tagged profile is used
for each score, never the working copy; the ten baseline tags all predate it.
