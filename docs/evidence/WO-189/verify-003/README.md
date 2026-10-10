# WO-189 VER-003 independent evidence

Dispatch: `resume: verify`, after the repair of VER-002. The implementation is
read-only to this verifier. The subject is the working tree over
`c676909066d278c92cacd94d998a42a8fb5d4a9a`, code identity
`a4b1e3bac4280e732c764128645d17e0509984d77129ee07731f4807e132b3b7`.

Every probe ran one at a time through `node scripts/harness.mjs bounded --`.
Each probe creates its scratch Git repository under the system temporary
directory, checks the repository's physical root before writing fixtures, and
removes it afterwards. No agent or background monitor was launched.

| Evidence | Source or command after the bounded wrapper | Observed result |
| --- | --- | --- |
| [New Markdown attacks](boundary-probes-result.json) | `node docs/evidence/WO-189/verify-003/boundary-probes.mjs` | Exit 1. Liquid `{{ }}` and `{% %}` and wiki `[[ ]]` hide twelve sentences on one counted line, and a raw `<h2>What runs today</h2>` under another section passes. All four pass full `checkDocs` after formatting, at the formatter's fixed point. The eleven controls behave as expected. Seven more shapes are recorded without an expectation |
| [VER-002 attacks](rerun-boundary-probes-result.json) | `node docs/evidence/WO-189/verify-002/boundary-probes.mjs` unchanged | Exit 0. All 17 cases match, so the D017 repair holds for the spellings VER-002 found |
| [VER-001 attacks](rerun-front-page-probes-result.json) | `node docs/evidence/WO-189/verify-001/front-page-probes.mjs` unchanged | Exit 0. No missed refusal, and the ownership and version-only cases pass |
| [Release probes](rerun-release-line-probes-result.json) | `node docs/evidence/WO-189/verify-001/release-line-probes.mjs` unchanged | Exit 0. Prepare writes the exact line and preserves every byte outside the block, and refuses added prose before writing |
| [Artifact probes](rerun-artifact-probes-result.json) | `node docs/evidence/WO-189/verify-001/artifact-probes.mjs` unchanged | Exit 0. Checkpoint order, six answers per candidate, agreement with raw scores, the chosen page outside its generated line, the six-package map, file links and unchanged manifests all hold |
| [Surface checks](rerun-surface-checks-result.json) | `node docs/evidence/WO-189/verify-002/surface-checks.mjs` unchanged | Exit 0. The chosen and alternate inventory checks pass, both publication editions are CURRENT, and `check-surfaces --local` passes the release block at `v0.74.1` |
| [Document fixtures](docs-fixtures.txt) | `node --test --test-name-pattern='front page\|What runs today\|control record that governs\|leading header\|refusal is new\|page whose base' scripts/test-docs-check.mjs` | Nine tests pass, none skipped, including the executed historical `08845c71` comparison |
| [Release preparation fixtures](release-preparation-fixtures.txt) | `node --test scripts/test-release-preparation.mjs` | Sixteen tests pass |
| [Merge fixture](integration-fixture.txt) | `node --test --test-name-pattern='one-line release block' scripts/test-worktree-integration.mjs` | One test passes |
| [Product row coverage](rerun-gate-subject-result.json) | `node docs/evidence/WO-189/verify-001/gate-subject.mjs` unchanged | The code identity matches, and the 32-suite review selection has no missing suite. The executor's passing row from 2026-10-10T16:08:09.888Z is reused |

The checker's parser is Prettier 3.9.6's Markdown parser. It emits
`liquidNode`, `wikiLink` and `inlineMath` nodes, and `renderedText` turns each
of them into an empty string. The probe records each dropped node's value
under `droppedNodes`. Inline math is dropped too; it is recorded without an
expectation because GitHub shows it as math, not prose. The claim that GitHub
shows `{{ }}`, `{% %}` and `[[ ]]` as literal text is an inference: GFM
defines no such construct. The claim that it renders `<h2>` as a heading is
also an inference, from the public html-pipeline v2.14.3 sanitization
allowlist. No content was sent to GitHub for rendering.

[D019](../decisions.md#wo-189-d019--verification-parser-extension-text-and-an-html-heading-escape-the-section-budget)
records the blocking finding, the rule a repair must hold and the reopening of
D017.
[D020](../decisions.md#wo-189-d020--verification-follow-up-orthographic-and-invisible-character-limits-of-the-sentence-and-heading-rules)
records the shapes that need malformed or invisible characters as a
non-blocking follow-up. The four README commands, the reader launches and the
external Releases link are unchanged by the repair. Their executed evidence is
carried from VER-001 and VER-002. The allocated verdict path is
`docs/verifications/WO-189/VER-003.md`.
