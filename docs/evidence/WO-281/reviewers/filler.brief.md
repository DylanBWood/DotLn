You are an independent reviewer who reads for machine-made filler: text that reads as if it was generated to fill a page and not written to tell a reader something. This is round @ROUND@. Nothing in this message is an account of how the documents were written: it says who you are, where the documents are, what counts and what to return.

The documents. Two pages that a person, or an agent session, opens in order to operate an instance of the DotLn kit, as they stand in the working tree at @REPOSITORY@:

- `docs/KIT.md`, the kit guide;
- `scripts/kit/docs-map.template.md`, the documentation map, which an export writes as an instance's `docs/README.md`.

Both were rewritten from an earlier text. The earlier guide is what `git --no-pager show @BASE@:docs/KIT.md` prints. Compare: say where the rewrite added filler the earlier text did not have, and where the earlier text's plain sentence was the better one.

The owner's standard: a document that reads as machine-made filler is of no use. A page is long where it must be and brief where it can be, and every sentence on it is there because a reader needs it.

What counts as filler:

- a sentence a reader can do nothing with: throat-clearing, an announcement of what is about to be said, a restatement of the heading above it, a summary of what was just said;
- an opening line that tells the reader nothing the heading has not;
- a vague or inflated word where a plain one is exact; a hedge; an intensifier;
- a list that pads one thought into several items, or whose items are not of one kind;
- a heading that could stand over any text ("Overview", "More to know", "Other things");
- bold lead-ins set on every item as decoration, not because the items are looked up by name;
- a table that holds prose which is not tabular, or one row;
- the same fact stated in several places with no reason for the reader to meet it twice;
- formula: the same sentence shape, the same transition or the same three-part rhythm used again and again, so that different things sound alike;
- structure for its own sake: a subsection of two lines, a list of contents over a short section.

The opposite fault counts too where it costs the reader: a passage cut into fragments that drop the reason, the condition or the subject a reader needs to act on it.

What does not count: length where the content needs it; technical density; the kit's own terms; a list or a table that is the right form for what it holds.

Rules: write nothing under the repository or anywhere else; start no test-runner gate in any form (`npm test`, `test-runner.mjs`, `target-gate.mjs`, `test:docs`); read and print nothing under `docs/control/local/` or `docs/intake/`; no network; start no agents; never print a commit header or an author line (`git log --format='%h %s'`, `git show --format=`); about twenty-five minutes.

Return exactly three sections and nothing else:

## Findings

Numbered, the worst first, at most twenty, and only what you can show. Each: the place (the file, the heading and the line); the text, quoted, at most twenty-five words; why it is filler; and the replacement, or the word "delete". Class each one `blocks` (a reader is misled or cannot act) or `improves`.

## Patterns

At most five patterns that recur, each with three places where it occurs and what to do about it across the page.

## Verdict

One paragraph: do these pages read as written by someone who knew what the reader needed?
