# Actor board

UIFA v0 is a read-only board over recorded actors, builds, mechanisms, work,
and blueprint evidence. It prepares application `v0.14.0` as console component
`0.1.0`. The package uses the existing kernel, compiler and skeleton workspaces;
it adds no external dependency, framework, bundler or asset pipeline.

From the repository root, after the ordinary pinned install:

```sh
npm run console -- board
npm run console -- board --json
npm run console -- board --html /private/tmp/actor-board.html
npm run console -- board --store .runtime/demo
```

`--store` may be repeated. Each additional directory is read only through its
`events.jsonl`; a missing store is shown as unavailable and is never created.
The default selection includes the recorded WO-009 demonstration and original
WO-011 audit/verifier stores. Those are historical witnesses, not live sessions.
Current control, worktree, release, capability, publication, roadmap and
refutation sources are collected on each invocation. Collection has no watch
loop. It reads no intake, account configuration or private harness settings.

The terminal defaults to 80 columns. `renderTerminal(board, width)` accepts
40–160 columns; it removes control sequences and wraps text with a deterministic
display-width rule for the documented text/CJK glyphs. It is not a universal
terminal grapheme emulator. HTML is one self-contained file with inline CSS,
no script, no external references, no forms, and only in-document links. The
command creates a new `.html` file and refuses to overwrite an existing path.

## Contract for another UI host

```ts
import { projectBoard, renderHtml, renderTerminal } from "@dotln/console";
import type { BoardSources, BoardView } from "@dotln/console";

const board: BoardView = projectBoard(recordedSources as BoardSources);
```

`projectBoard` reads data only: no filesystem, process, clock, random source,
network, input mutation, or lifecycle fold. Host I/O lives in `collectSources`.
The [types](src/types.ts) and [JSON Schema](uifa-board-v1.schema.json) define
`viewModelVersion: "uifa-board-v1"` and `fidelity: "lossy-read-only"`.
The five fixed panel ids are `actors`, `builds`, `mechanisms`, `work`, and
`blueprint`. Every panel names its roles and question and contains sections,
rows and cells. Hosts render `cell.label` but address facts through `cell.key`.
Rows link to local row, section, panel or evidence ids, never executable
commands. Opaque navigation ids are deterministic and carry no identity proof.

Cells have an explicit `status`, `value`, `explanation` and evidence ids:

- `known`: the selected source supports the value, including a recorded zero.
- `unknown`: an available record does not support this particular claim.
- `unavailable`: the required source is absent, unreadable or malformed.

Unknown/unavailable values are `null` with an explanation. Every cell names an
evidence record identifying its source and record selector. The board omits raw
payloads and file bodies from the input capsules. Sources are trusted host
inputs, not authenticated testimony. A new host must retain these distinctions
and the version discriminator; it must not reconstruct lifecycle legality from
the table. Selection is the shallow actor → build → mechanism → evidence path.
Some historical actors have no recorded loadout and link to the Builds section
with that limitation instead of claiming an equipped saved build.

| Panel      | Main facts and stable cell keys                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Actors     | Recorded worker attempts and control actors; `identity`, `role`, `episode`, `phase`, `transport`, selected/effective model and effort, `buildHash`, `hashKind`, `loadoutHash`, `allowed`, `denied`; local matrix/receipt links |
| Builds     | `loadout`, `semanticHash`, `hash.code-dsl`, `hash.function-table`, `hash.statechart-json`, `hashAgreement`, `items`, `tooltip`; compiler-rendered mechanics and declared costs                                                 |
| Mechanisms | Unit id as row title; `rung`, `boundary`, `enforcement`, `fixture.*`, `live.*`, `lastActivation`; five counters per observation source                                                                                         |
| Work       | Order id as row title; `phase`, `blockers`, `dependencyCheck`, `elapsed.*`, `legalNextActions`; index evidence, usage, constellation metadata, releases                                                                        |
| Blueprint  | Source table columns and assessment headings; pending roadmap rungs; `verdict`, `reason`, and `latest-refutation.holdStatus` from the latest selected refutation                                                               |

The pinned outputs show every exact key; the generic schema deliberately does
not turn source-specific columns into a second domain model. `roleAnswers`
provides selection targets and names the answering cells. Its five questions
come from [product 13](../../docs/product/13-uifa-roles.md#the-five-roles).

## Sources and limits

The store adapter calls the existing `projectWorkerStatus` and `projectAuditLog`.
Acceptance matrices come from worker status. Raw audit records are inspected
only for explicitly selected fields such as the fixed audit executor's opening
contract; arbitrary event bodies are not displayed. Separate physical verifier
attempts remain separate actors. A unique recorded `implementerEpisodeId`
connects stores to the accepted matrix; failed attempts do not acquire the
successful attempt's evaluations.

The WO-011 executor records a `feedback-v1` policy hash and its verifier records
a `verification-v1` input hash. They are different contract axes. Neither
records a LoadoutGraph semantic hash, so `loadoutHash` is unknown. Selected
model/effort and their provenance remain separate from effective readback.
An authority summary describes its recorded envelope and expiry, not a fresh
authorization decision. A missing heartbeat never becomes a wall-clock claim.

Control actors use the canonical event's attribution. Unattributed operator
requests form an operator-role row per order, titled **Operator — identity not
recorded**. The execution guide identifies activation and review requests as
operator dispatches; the log does not identify a person or prove human
authorship. This row does not assert that different requests came from the same
person, infer attention/presence, or ask the operator to attest to anything.
The real WO-031 fixture has activation and review requests but no human actor
attestation or release-close event.

The collector discovers graph exports and functions named `*Loadout` from
skeleton's `reactor` and `loadouts/*.js` modules. Only those named factories are
called, with the fixed inspection expiry `86400000`; the resulting data is
compiled through `compileLoadout` using the explicit Seiri fixture environment.
Adding such an export adds a card without console edits. All three editable
views are compiled and compared. Tooltips come from the compiler's existing
`renderCompiledDiff(undefined, program)`; the work-order draft's `renderTooltip`
name is not an actual exported API. The inspection expiry/environment describe
a saved-build preview, not a current grant or an actor's equipped build.

`compileFeedbackUnits` supplies all ten mechanisms. The selected WO-011 report
already contains a maturity fold plus ten present/removal pairs. The adapter
reconstructs only the report's documented isolated `regression_<unit>` fixture
observations, then requires exact agreement with `feedbackMaturity` and its
policy hash. Missing or inconsistent evidence is unavailable. The last fixture
activation names that selected regression episode; it is not a timestamp or a
claim that the unit fired inside a worker episode. Fixture and live counts stay
separate; no rate is computed and zero observations are labeled `unobserved`.

Fixed read-only commands supply all selected `resume status --json` snapshots,
`resume usage --json`, `worktree constellation` and `release list`. Signed elapsed
durations and legal-action strings are preserved. Status has no dependency
blocker field; that cell stays unknown and dependency evidence comes separately
from the generated index. Beacon metadata never establishes worker liveness.

Text adapters pin the generated index's `### WO-NNN` sections and named fields, the constellation's
individual/group format, release-list TSV, capability table variants (including
dated additions), publication tables, and roadmap headings. Unsupported formats
fail visibly. Blueprint rows retain their original assessment headings and
statuses. The latest dated refutation supports both the six historical manual
receipts and the current versioned receipt format. Displaying its recorded
verdict/hold is not rerunning the planning gate or deciding current staleness.

## Recorded evidence and reproduction

```sh
npm run test:console
npm run evidence:console -- --check
npm test
```

[manifest.json](fixtures/manifest.json) pins every input by SHA-256. Five cases
cover WO-009, WO-011, control, refutations and absent sources; each pins JSON,
terminal and HTML outputs in [expected/](fixtures/expected/). The six real
2026-09-06 refutation receipts remain input alongside the later live receipt.
Constellation addresses are explicitly replaced by fixture addresses in the
captured text. Other fixture records retain their declared provenance.

`node scripts/console-fixtures.mjs --write` explicitly regenerates outputs from
those pinned inputs; tests never update snapshots. `--sources <recorded.json>`
renders a serialized `BoardSources` object without host collection. The fixture
schema checker is an independent bounded interpreter for the keywords used by
this schema, not a general JSON Schema implementation.

The WO-009 fixture is an actual run of the existing demo with a deterministic
synthetic CLI peer, not a new authenticated model run. To capture a new edition
into an unused canonical temporary root and new output path:

```sh
GIT_AUTHOR_DATE=2026-09-07T00:00:00Z GIT_COMMITTER_DATE=2026-09-07T00:00:00Z \
  node packages/console/fixtures/capture-demo.mjs /private/tmp/actor-board-demo new-demo.jsonl
```

That helper creates its own disposable Git fixture and records completion; it
is a test recorder, not part of the read-only board command. Update the manifest
only as an explicit fixture revision. The [WO-032 receipt](../../docs/evidence/WO-032/README.md)
maps acceptance evidence and records the implementation's source limitations.
