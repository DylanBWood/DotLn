# WO-063 implementation

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

Dispatch: `resume: next`.

## Interface

`scripts/lib/outward-lint.mjs` exports the pure
`lintOutwardArtifact({ kind, text, vocabulary, localTerms? })` function.
Kinds are `branch`, `commit`, `pr-title`, and `pr-body`; the default local
observation is `unavailable`, and public vocabulary is an explicit input so
importing the pure module needs no document tree. Callers with filesystem access use
`checkOutwardArtifact(root, { kind, text })` from `scripts/outward-lint.mjs`,
which reads the configured control root and invokes the unchanged
`checkLocalTerms` implementation. A supplied local observation is trusted
caller evidence, not an independent attestation by the pure function.

```sh
printf '%s\n' 'fix(parser): handle empty input' | node scripts/outward-lint.mjs commit
printf '%s\n' 'fix/handle-empty-input' | node scripts/outward-lint.mjs branch
```

The CLI resolves the launchpad through the existing configuration helper
(including `DOTLN_LAUNCHPAD`), reads stdin and emits JSON. Exit codes are
0 pass, 1 refused, 2 unavailable local coverage, and 3 usage/configuration/input
failure. One terminal line ending is framing for branch names and PR titles;
the pure function validates exact text. Commit and body line endings remain
content, with CRLF, LF and CR supported.

## Profile and findings

The committed `docs/control/outward-vocabulary.json` carries the editable type
set and public terms; both that file and `local/terms.txt` follow the configured
`control` root. Commit subjects and PR titles use
`type(scope)?: summary`, with optional `!` before the colon, at most 72 Unicode
code points, a lowercase type, an optional nonempty lowercase ASCII scope,
and a nonempty summary without surrounding whitespace. Commit bodies require
an empty second line. Titles contain one line. Branches use
`type/lowercase-hyphenated-slug`, with ASCII letters and digits in the slug.
PR bodies have no subject or prose-wrapping requirement.

Public terms match after per-character NFKC normalization and case folding, across token
separators and line breaks, without matching inside larger words. The initial
list contains only this repository's public terms: DotLn, launchpad, gem(s)
and mask(s). Those generic words can also occur legitimately in a target;
the committed list is deliberately reviewable and editable, rather than a
claim of semantic context detection.

Findings name a stable `rule` and an original-text `span`: zero-based UTF-16
`start` and exclusive `end`, one-based `line` and `column`, and `precision`.
Public findings include the public `term` and exact span. Local findings
contain only a starting-line span and count, because the existing checker
redacts the matched term; a match can continue onto later lines. Local-list
configuration failures have a null span. No private term, matched text,
list contents, hash, raw filesystem exception or original artifact is emitted.

The result separately reports `format`, `launchpad`, and `localTerms` checks.
Any finding makes the overall result `refused`; otherwise a missing local list
makes it `unavailable`. Thus public vocabulary and format checks still run
without a local list. Empty or invalid local lists refuse.

## Evidence and scope

The focused suite is `node --test scripts/test-outward-lint.mjs`, registered
as `outward-lint` in the existing `npm test` runner. Its retained transcript is
[fixtures.txt](fixtures.txt): 27 passing tests, including a copied CLI with
relocated documents and no default document tree.

Executed integration evidence on 2026-09-22:

- `npm test`: 24 suites passed, 0 failed; 68 fresh tasks; 280.66 seconds.
  The registered outward-lint suite passed inside this gate in 0.37 seconds.
- `npm run publication:check`: 273/273 headings covered and both edition
  locks current after the required product write-backs.
- `npm run plan -- check`: passed with the work-order heading change admitted
  as release assignment; 24 receipts and 14 passes in the existing chain.
- `node scripts/release.mjs check-surfaces --local`: passed; application target
  v0.40.3 and no runtime component bump required.
- `git diff --check`: passed.
- `npm run test:docs`: 19 suites passed, 0 failed; 31.29 seconds, including
  formatting, publication, release surfaces, both indexes and planning checks.

The earlier release-surface check caught an extra title before the required
release-note headings; that authored formatting error was corrected before
the passing run. No remaining implementation defect was diagnosed.

The promised benefit is established by executable positive and negative
fixtures at the pure and CLI boundaries. Recurring operator time or token
savings were not measured. The one economy opportunity was declined, recorded
as kept-current, and added no benchmark or method change.

[Decisions](decisions.md) record the design, economy decline and historical
ledger substitution; the generated decisions index is the discovery surface.
The release is application patch `v0.40.3`, with no runtime component or
dependency bump. No target file, hook, worker prompt or publish-path change is
part of this order; WO-064 remains responsible for applying this lint before
remote effects. No remote effect was performed.
