# Part C: the document check on a branch that carries pasted text

Captured 2026-11-17T20:01:41Z by a script in session scratch. It builds the small repository the document check's own tests build (one product document, a baseline, committed on `main` with the branch `wo-999` checked out), puts one file under the ignored intake root holding two passages its owner pasted to be used, and adds two source files on the branch: `scripts/fixture-tool.mjs` carries both passages, on lines 1 and 4, and `scripts/fixture-other.mjs` carries one, on line 1. The capture's digest is `sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256`. It then runs `node scripts/docs-check.mjs` in that root under each configuration below and keeps the lines that name the verbatim screen, the stop or the check's result. The script fails if any output holds a word of the pasted passages; none did.

## Core's root, which sets nothing

`dotln.config.json` holds `{"version":1,"roots":{}}` and the root holds no kit manifest.

The features list's row for the stop: level `refuse`, set by the kit; the line that changes it: `"stops": { "verbatim-operator-words": "advise" }`.

```text
exit 1
--- stdout
verbatim screen: 2 changed files against 1 captures, a 12-word window; 3 shared runs
FAIL docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 3 failures
--- stderr
FAIL scripts/fixture-other.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:4: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
```

## An exported instance that sets nothing

The same root with the kit's manifest, so it is an instance: no `stops` line and no election.

The features list's row for the stop: level `advise`, set by the kit; the line that changes it: `"stops": { "verbatim-operator-words": "refuse" }`.

One line for each file, at the line of its first run; the stop names itself once.

```text
exit 0
--- stdout
verbatim screen: 2 changed files against 1 captures, a 12-word window; 3 shared runs
ADVISED scripts/fixture-other.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn (stop verbatim-operator-words)
ADVISED scripts/fixture-tool.mjs:1: 2 runs of 12 or more consecutive words shared with 1 ignored capture, the first at this line; paraphrase the operator and cite each capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn (stop verbatim-operator-words)
ADVISORY the lines marked ADVISED for this stop fail nothing here. Stop verbatim-operator-words advises in this root and the work goes on; it protects the author's rule that committed text paraphrases the operator. "stops": { "verbatim-operator-words": "refuse" } in dotln.config.json makes it refuse and "off" silences it.
PASS docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 0 failures; 2 advised
DOTLN_ADVISED_STOPS ["verbatim-operator-words"]
--- stderr
(none of these lines)
```

## The instance with the stop set to `refuse`

`"stops": { "verbatim-operator-words": "refuse" }`.

The features list's row for the stop: level `refuse`, set by dotln.config.json; the line that changes it: `"stops": { "verbatim-operator-words": "advise" }`.

```text
exit 1
--- stdout
verbatim screen: 2 changed files against 1 captures, a 12-word window; 3 shared runs
FAIL docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 3 failures
--- stderr
FAIL scripts/fixture-other.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:4: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
```

## The instance with the stop set to `off`

`"stops": { "verbatim-operator-words": "off" }`.

The features list's row for the stop: level `off`, set by dotln.config.json; the line that changes it: `"stops": { "verbatim-operator-words": "refuse" }`.

```text
exit 0
--- stdout
verbatim screen: off (stop verbatim-operator-words)
PASS docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 0 failures
--- stderr
(none of these lines)
```

## The instance with the election made and no line for the stop

`"features": { "verbatim-operator-words": true }`.

The features list's row for the stop: level `advise`, set by features.verbatim-operator-words; the line that changes it: `"stops": { "verbatim-operator-words": "refuse" }`.

The election's own words, one line a file.

```text
exit 0
--- stdout
verbatim screen: 2 changed files against 1 captures, a 12-word window; 3 shared runs
ADVISORY scripts/fixture-other.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn (features.verbatim-operator-words is elected, so this advises)
ADVISORY scripts/fixture-tool.mjs:1: 2 runs of 12 or more consecutive words shared with 1 ignored capture, the first at this line; paraphrase the operator and cite each capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn (features.verbatim-operator-words is elected, so this advises)
PASS docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 0 failures
--- stderr
(none of these lines)
```

## The instance with the election declined and no line for the stop

`"features": { "verbatim-operator-words": false }`.

The features list's row for the stop: level `refuse`, set by features.verbatim-operator-words; the line that changes it: `"stops": { "verbatim-operator-words": "advise" }`.

```text
exit 1
--- stdout
verbatim screen: 2 changed files against 1 captures, a 12-word window; 3 shared runs
FAIL docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 3 failures
--- stderr
FAIL scripts/fixture-other.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:4: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
```

## The instance with the election made and the stop set to `refuse`

`"features": { "verbatim-operator-words": true }` beside `"stops": { "verbatim-operator-words": "refuse" }`: the line wins.

The features list's row for the stop: level `refuse`, set by dotln.config.json; the line that changes it: `"stops": { "verbatim-operator-words": "advise" }`.

```text
exit 1
--- stdout
verbatim screen: 2 changed files against 1 captures, a 12-word window; 3 shared runs
FAIL docs check: 1 product documents; 0 declared historical link occurrences; 0 declared historical home-path lines; 3 failures
--- stderr
FAIL scripts/fixture-other.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:1: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
FAIL scripts/fixture-tool.mjs:4: 12 or more consecutive words shared with the ignored capture sha256:80e542f9da966fb6c24be659a50472759b47ec04d600152405f43441cdab2256; paraphrase the operator and cite the capture by its digest, or record a message the operator asked to save as an operatorQuote with captureSha256 and requestedIn
```
