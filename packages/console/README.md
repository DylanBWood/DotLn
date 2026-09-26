# Actor board

Component `0.3.0` prepares application `v0.52.0` with the resident command
client. Component `0.2.0` prepared application `v0.47.0`: the console added a live
`runtime-status-v1` text host while preserving the actor board and its pinned
fixtures. The board's historical selfhost fixture records the WO-132 writer-v2
evidence.

UIFA v0 is a read-only board over recorded actors, builds, mechanisms, work,
and blueprint evidence. It shipped in application `v0.14.0` as console
component `0.1.0`; component `0.1.1` moves its default self-hosted evidence
edition to WO-039 for application `v0.15.0`. The package uses the existing
kernel, compiler and skeleton workspaces; it adds no external dependency,
framework, bundler or asset pipeline.

From the repository root, after the ordinary pinned install:

```sh
npm run console -- board
npm run console -- board --json
npm run console -- board --html /private/tmp/actor-board.html
npm run console -- board --store .runtime/demo
```

`--store` may be repeated. Each additional directory is read only through its
`events.jsonl`; a missing store is shown as unavailable and is never created.
The default selection includes the recorded WO-009 demonstration and the
current self-hosted feedback edition's audit/verifier stores, selected by
the shared [current-evidence manifest](../../docs/evidence/current.json). Those are historical
witnesses, not live sessions. The root evidence command selects the same
edition: a compiler package bump changes the pinned policy and verification
identities, and the skeleton refuses persisted compilation drift when it
replays an earlier edition's verifier stream, so that edition renders
unavailable rather than current. Select replacement evidence once in the
manifest when a relevant source change requires it. Starting another work order
does not change this selection. Recorded fixture inputs retain their explicit
paths and hashes so historical comparisons cannot silently follow new output.
Current control, worktree, release, capability, publication, roadmap and
refutation sources are collected on each invocation. Collection has no watch
loop. It reads no intake, account configuration or private harness settings.

The terminal defaults to 80 columns. `renderTerminal(board, width)` accepts
40–160 columns; it removes control sequences and wraps text with a deterministic
display-width rule for the documented text/CJK glyphs. It is not a universal
terminal grapheme emulator. HTML is one self-contained file with inline CSS,
no script, no external references, no forms, and only in-document links. The
command creates a new `.html` file and refuses to overwrite an existing path.

## Resident command client

While a resident runs, its store holds an owner-only `console/` directory with
a mode-0600 connection descriptor, `console-loopback-v1.json`. The text host
reads it to list the exact `console-commands-v1` vocabulary and to invoke a
terminal command through the resident:

```sh
npm run console -- commands --store <bound-store>
npm run console -- invoke --store <bound-store> skeleton.compiled-diff
npm run console -- invoke --store <bound-store> resume.status --json
```

`invoke` writes the terminal's stdout and stderr bytes unchanged and exits
with its code. The resident classifies the equivalent terminal command with
the terminal permission hook's classifier and decider under its compiled
envelope, then runs the same Node entrypoint and parser the terminal uses. A
command outside the contract, an effect the envelope denies, or argument text
the classifier cannot classify is refused before it runs, as one
`error: <reason>` line with exit code 1; the hook would only advise and leave
the decision to host permissions. A decoded request's response starts at once
and stays open while it waits behind an earlier command and until its result,
however long that takes; a caller that leaves before its command starts, or a
request still waiting when the resident stops, is refused and keeps its
receipts. When no resident
console is reachable, the text host prints one `console refused:` line and
exits 1. Each decoded request records `console`
actor invocation and result receipts in the private resident log, with the
result bytes content-addressed under `console/results/`; replay returns them
without rerunning effects. The resident replaces a descriptor that an exited
resident left behind and removes its own on orderly shutdown. Do not copy the
token into a repository, URL or public status view.

`invokeConsoleCommand(connection, request)` and
`readConsoleContract(connection)` import no Node API. A browser shell imports
them from `@dotln/console/client` and receives the connection from its local
host. The Node text host obtains it with `readConsoleConnection(store)`,
exported from `@dotln/console` with both client functions. The endpoint binds
to `127.0.0.1`, requires the token, refuses a non-local browser `Origin` and
admits a caller that sends none. The contract covers existing terminal
commands, including derived-order activation, the release-close publish helper
and selection of an already-declared portfolio. Saved-build selection, equip
preview and runtime audit have no terminal command in this version; runtime
audit follows WO-116. The command list, classification and refusal shapes are
in product 04 §Console parity contract v1.

## Live runtime status

The resident writes `runtime-status-v1.json` inside its `--store` directory by
atomic replacement after each event and tick. The text console reads that
file or watches for replacements:

```sh
npm run console -- status --store .runtime/launchpad
npm run console -- status --store .runtime/launchpad --json
npm run console -- status --store .runtime/launchpad --watch
```

`--watch` also reads the file every 250 ms beside its directory watcher and
stops that read when the watcher closes or errors, so a delayed or missed
notification cannot leave the text host stale (WO-115 D019, D023).

The [versioned schema](runtime-status-v1.schema.json) is available by file path.
`@dotln/console` re-exports the `RuntimeStatusV1` type and `decodeRuntimeStatus`
decoder defined in skeleton; these define the shared consumer contract.
The view contains configured actors, live episodes, presence and next cadence
times, coded holds, portfolio budget, and every Active or Open order in the
generated index. `unknown` and `unavailable` are explicit; a missing index
never creates a second order truth. The resident CLI selects the launchpad's
configured work-order index, including `DOTLN_LAUNCHPAD`, and binds its path in
private store metadata. All helper and harness writers use that binding. Library
hosts supply `workOrderIndexPath` on first start; without a binding, orders are
unavailable. Elapsed time uses the resident's recorded clock, so rebuilding from
the same log and index reproduces the same bytes. This file is
read-only to hosts and grants no action. The resident keeps raw actor
declarations and event payloads out of it because they can contain local paths
or endpoint details. Status writes use atomic replacement without durability
syncs; event-log durability is unchanged. A publication failure leaves the
previous file until a later event, tick or restart rebuilds it and cannot abort
resident work. `--watch` renders each changed valid view once, shows a generic
unavailable message for missing or invalid files, and resumes on a valid update.
`--json` emits one snapshot for another local host.

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

The self-hosted executor records a `feedback-v1` policy hash and its verifier
records a `verification-v1` input hash. They are different contract axes. Neither
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

`compileFeedbackUnits` supplies all ten mechanisms. The selected edition's
report already contains a maturity fold plus ten present/removal pairs. The adapter
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
cover WO-009, the self-hosted feedback edition (`selfhost`), control,
refutations and absent sources; each pins JSON, terminal and HTML outputs in
[expected/](fixtures/expected/). The `selfhost` case pins the report and both
streams of one recorded edition; when the edition moves, update its three
manifest inputs and regenerate the expected outputs. The six real
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
