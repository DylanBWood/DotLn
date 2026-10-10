# WO-189 VER-001 independent probes

The recorded subject is the uncommitted WO-189 implementation over
`c676909066d278c92cacd94d998a42a8fb5d4a9a`, with code identity
`63d384df3730d92a86d8b7747d9c217a3616c7353839aa5057a3d6fe7d267a19`.
The verifier wrote these evidence files and no implementation changes.

Each source below runs under `node scripts/harness.mjs bounded -- node <source>`.
All scratch repositories are under the host's system temporary directory; their
root is checked before fixture mutations. The four public README commands run
in a temporary mirror, so the intent example files its draft there.

| Probe | Source | Recorded result | Outcome |
| --- | --- | --- | --- |
| Ownership, marker placement and sentence count | [front-page-probes.mjs](front-page-probes.mjs) | [front-page-probes-result.json](front-page-probes-result.json) | Exit 1: four expected refusals missing; F1 |
| Release writes, legacy input and refusal before writes | [release-line-probes.mjs](release-line-probes.mjs) | [release-line-probes-result.json](release-line-probes-result.json) | Exit 0; canonical writes preserve outside bytes; legacy no-op is F2 |
| Checkpoint order, raw reader/scorer agreement, quotes, selected page, map and local links | [artifact-probes.mjs](artifact-probes.mjs) | [artifact-probes-result.json](artifact-probes-result.json) | Exit 0 |
| Four README commands as written | [command-probes.mjs](command-probes.mjs) | [command-probes-result.json](command-probes-result.json) | Exit 0; all four commands pass; lockfile unchanged |
| Standing review gate and current selection | [gate-subject.mjs](gate-subject.mjs) | [gate-subject-result.json](gate-subject-result.json) | Exit 0; current code identity covered by the executor's 32-suite review row |

The sources' recorded runs ended on 2026-10-10 at approximately 13:32 UTC;
individual result files carry their own exact cutoffs. Front-page expected-fail
inputs are independent variations of the real page and record; a separate minimal
repository demonstrates the same failure through the full `checkDocs` entry point.
A source rerun judges current bytes, while these result files retain the original
observations. The checker under verification is also part of the document gate.

Additional executed checks: 16 release-preparation tests passed; six affected
docs-check fixtures passed with the historical comparison executed; the one-line
integration test passed; the selected-page inventory check passed; both alternative
candidate checks failed only the b025 literal anchor (F3); publication locks were
CURRENT; the real staged release surface check passed; the README's external link
returned HTTP 200. These additional commands ran under
`node scripts/harness.mjs bounded --`:

```sh
node --test scripts/test-release-preparation.mjs
node --test --test-name-pattern='front page|What runs today|control record that governs|leading header|refusal is new|page whose base' scripts/test-docs-check.mjs
node --test --test-name-pattern='one-line release block' scripts/test-worktree-integration.mjs
npm run release -- check-surfaces --local
curl --head --location --max-time 20 --silent --show-error --output /dev/null --write-out 'README external link: HTTP %{http_code}\n' https://github.com/DylanBWood/DotLn/releases
```

The verifier's `npm run format:check` and `git diff --check` passed;
`npm run test:docs` passed 32 suites with 32 fresh tasks in 125.34 seconds.
Criterion judgments and dispositions are in
[VER-001](../../../verifications/WO-189/VER-001.md) and
[decisions](../decisions.md#wo-189-d010--verification-the-section-budget-can-be-bypassed).

The first inline recorder attempt produced no probe rows and no result files;
only the subsequent file-based recorder's executions are credited above.
