# WO-189 VER-002 independent evidence

Dispatch: `resume: verify`, after the repair of VER-001. The implementation is
read-only to this verifier. The subject is the working tree over
`c676909066d278c92cacd94d998a42a8fb5d4a9a`, code identity
`aa21c20728c85be153c4f3cca04ef93962aa1b3ad9ec7da2e31e892b96be83f6`.

Every probe ran sequentially through `node scripts/harness.mjs bounded --`.
Scratch Git repositories are created beneath the system temporary directory;
their physical root is checked before fixture writes and each is removed by its
probe. No agent or background monitor was launched.

| Evidence | Source or command after the bounded wrapper | Observed result |
| --- | --- | --- |
| [Original front-page attacks](front-page-probes-result.json) | `node docs/evidence/WO-189/verify-001/front-page-probes.mjs` unchanged | Exit 0; original missed refusals are now refused; positive ownership/version cases pass |
| [New boundary attacks](boundary-probes-result.json) | `node docs/evidence/WO-189/verify-002/boundary-probes.mjs` | Exit 1; thirteen bold or italic sentences fit on one counted line, and a strong-emphasis duplicate heading escapes the range; all three still pass full `checkDocs` after formatting at its fixed point |
| [Release probes](release-line-probes-result.json) | `node docs/evidence/WO-189/verify-001/release-line-probes.mjs` unchanged | Exit 0; canonical block writes preserve all outside bytes, added prose is refused before writes, and the repaired legacy available-target case produces the exact line |
| [Artifact probes](artifact-probes-result.json) | `node docs/evidence/WO-189/verify-001/artifact-probes.mjs` unchanged | Exit 0; checkpoint order, all six answers per candidate, raw score agreement, quotes, choice, package map, links and unchanged dependencies hold |
| [Surface checks](surface-checks-result.json) | `node docs/evidence/WO-189/verify-002/surface-checks.mjs` | Exit 0; chosen and alternate inventory anchors pass, both publication editions are CURRENT, and the actual staged release block passes |
| [Document fixtures](docs-fixtures.txt) | `node --test --test-name-pattern='front page\|What runs today\|control record that governs\|leading header\|refusal is new\|page whose base' scripts/test-docs-check.mjs` | Seven tests pass, none skipped; historical check executed |
| [Release preparation fixtures](release-preparation-fixtures.txt) | `node --test scripts/test-release-preparation.mjs` | Sixteen tests pass |
| [Merge fixture](integration-fixture.txt) | `node --test --test-name-pattern='one-line release block' scripts/test-worktree-integration.mjs` | One affected test passes; fixture verifies both versions differ before integration |
| [External link](external-link.txt) | `curl --head --location --max-time 20 --silent --show-error --output /dev/null --write-out 'README external link: HTTP %{http_code}\n' https://github.com/DylanBWood/DotLn/releases` | HTTP 200 |
| [Product row coverage](gate-subject-result.json) | `node docs/evidence/WO-189/verify-001/gate-subject.mjs` | Matching code identity; no missing suite in the 32-suite review selection; executor's passing row consumed |

The bold/italic attacks render thirteen ordinary sentences on one line, with
nine non-empty lines total against budget eleven. The duplicate-heading attack
renders two level-two headings named "What runs today"; twelve capability
sentences under the second heading escape the budget. Raw duplicate headings
with closing hashes, trailing spaces or a tab also pass the direct checker, but
formatting normalizes them and they are refused afterward; the blocking finding
rests on the three formatting-stable variants above. Exact budget, one over
budget, CRLF, duplicate/reversed markers, subheadings, a pair crossing the next
heading and prose under an unrelated next heading are recorded in the same probe.

The four README commands are unchanged by this repair. Their executed evidence
is carried from [VER-001's command record](../verify-001/command-probes-result.json),
which ran each command as written on this host in a temporary mirror, with all
four passing and the lockfile unchanged. Reader launches are carried from their
raw records and rechecked by the artifact probe; stdin and effective user-level
instruction loading remain unobserved. The alternate pages retain their scored
shape; installing either requires reshaping its section as D013 records.

The document checker under review also runs in the document gate. Its own green
fixtures and the matching product row do not substitute for the independent
expected refusals. [D016](../decisions.md#wo-189-d016--verification-markdown-emphasis-still-bypasses-the-section-budget)
boards the unmet criterion and repair contract. The allocated verdict path is
`docs/verifications/WO-189/VER-002.md`.
