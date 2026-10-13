# WO-193 — Capability requests and the private predecessor map: an instance asks core for a capability in one standard way, answered through either update route, and keeps a private map from what its predecessors did to what carries it now that says when a row needs a request (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** minor. Two kit commands with their keys,
schema and seed, a typed `UPSTREAM.md` block, a planning intake of
labelled issues, a requests block on orders, and request numbers in the
receipt and update note. Assigned at activation under the standing opt-out
default.
**Cost:** commands: adds `npm run request -- draft|check|ready|file`,
`npm run parity -- init|add|check|report|request` and
`npm run plan -- requests`, the suites `request` and `parity`, and the
surfaces the Release line names. Removes: the only route a need found in an
instance has today, the operator remembering it until a planning pass at
home; and the absence of any place where an instance records what its
predecessors did and whether its build does it yet, so "at least as
capable" becomes a count. The merge removes one order cycle (activation,
verification, final review, release close) and the full gate a closed order
paid in the window, 2.29 runs and 61 minutes, beside phase medians of 16.9
minutes for verification and 24.8 for final review (planning document
§12); one re-mint covers both `package.json` entries; neither constituent
owed a live feedback episode. Re-mints: `package.json` is a common source
of the evidence inventories (`scripts/lib/evidence-sources.mjs`), so each
edition whose check the two entries stale is re-minted deterministically,
the feedback edition by carry (`package.json` is not in
`FEEDBACK_SOURCE_PATHS`); no live episode. Declared machinery sources
change, so `npm test -- --review` runs before handoff. One live issue is
created here under the operator's grant (criterion 14). Wall-clock and
tokens: unknown until run, one implementation phase, not two. Context
bytes: about 39 KB against the constituents' 36,107 (the preflight,
live-run surfaces, re-mint and merge route are new, and the second round
added `request ready`, the role steps and the `manual` known issue).
Steps: 17 against the constituents' 19.
**Nomination provenance:** for both constituents, the operator's notes of
2026-10-02, items 15 and 16 (captured in ignored intake; SHA-256 in the
ledger section of that date), and the 2026-10-02 pass's search, which found
no planned route from an instance to core and no order covering a private
map ([planning document](../planning/standard-pass-2026-10-02.md) §8).
WO-193: product 03 §Channel-plural intake, a candidate this order makes
real for one channel; WO-078's sentence that a fork's lesson enters through
an ordinary planning pass. WO-194: product 12 §Replacing a successful but
costly workflow and its open choice on where an instance keeps private
state; product 10 §Candidate — external rule-source import plans;
`docs/decisions/0001-personal-clean-room-build.md`. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: applies with force.
This order builds the one channel through which words written inside a
private instance can reach this public repository; the Design's first
bullet is the floor it must hold. Merged by the 2026-10-13 standard
planning pass under the operator's sizing direction (planning document
§12). The pass's second round gave every step that left the operator a
file edit to a role acting on the operator's recorded word (planning
document §12.1).
**Depends on:** WO-074 (the kit manifest and file set); WO-076
(instance-owned files; the emitted build a carrier is checked against);
WO-077 (the update and its note); WO-078 (the sibling receipt); WO-062 (the
screened issue reader), WO-063 (the outward lint) and WO-060 (the declared
screen) merged. All are closed at `6dbd8771`.
**Recommended placement:** position 9 of the serial queue (the operator
keeps core's next thirty orders serial; planning document §12.4), after
WO-207 and before WO-183, because this order extends what WO-207 changes
first and reads it as landed: `SECTION_KEYS` in `scripts/lib/config.mjs`
(step 1), the kit's
`dotln.config.example.json` and `gitignore.template` (step 2), the
update's preview, renderer and apply path in `scripts/launchpad.mjs`
(step 8), the emitted manifest's `origin` under a build pin (step 11) and
the client README (step 16). A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the kit file set and manifest the request and parity commands join"
  },
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the instance-owned files and emitted build a row's carrier is checked against"
  },
  {
    "workOrderId": "WO-077",
    "relation": "hard",
    "reason": "the update and the instance-actions note that reports fulfilled requests"
  },
  {
    "workOrderId": "WO-078",
    "relation": "hard",
    "reason": "the sibling receipt that gains request identifiers"
  },
  {
    "workOrderId": "WO-062",
    "relation": "satisfied-by-close",
    "reason": "the read-only screened issue reader used by the planning intake"
  },
  {
    "workOrderId": "WO-063",
    "relation": "satisfied-by-close",
    "reason": "the outward lint run over a draft before it may be filed"
  },
  {
    "workOrderId": "WO-060",
    "relation": "satisfied-by-close",
    "reason": "the declared screen run over a draft and over each fetched issue"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `CLAUDE.md` §Clean Room;
`docs/decisions/0001-personal-clean-room-build.md` (a work deployment gets
its own decision record and bootstrap route); product 03 §Channel-plural
intake, PR-backed registration and the proposal-packet paragraphs before
it; product 04 §External rule-source mapping preview; product 10
§Candidate — external rule-source import plans; product 12 §Replacing a
successful but costly workflow and §Open product choices;
`docs/planning/phase-two-plan-2026-09-06.md` (an instance's content never
flows back to core); `docs/planning/critical-path-2026-09-08.md` §The
destination in the operator's terms (the parity sentence);
the orders WO-074, WO-076, WO-077, WO-078, WO-112 (parity measured item
by item in core) and WO-096 (core's shape rows and what it declines);
`packages/skeleton/src` (the issue reader, `fetchIssueBundle` and
`requireCompleteIssueBundle`);
`scripts/lib/terms.mjs` and the outward lint;
`scripts/lib/planning-followups.mjs` (register candidates);
`scripts/work-orders.mjs` (`parseHeader`); the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§8; `07-execution-guide.md §Preflight before the full gate`.

**Objective:** Someone working in an instance who finds that core lacks
something can ask for it in a few minutes without anything leaving the
instance except the sentences the operator approved; the request is read at
the next planning pass here; and when a release answers it, the instance's
next update, from core or by merge, says so. An operator moving a team from
an earlier workflow can have the instance's roles list privately, on the
operator's guidance, each thing the earlier generations did, where it
lives, what in the instance now carries it and how faithfully, and can read
one summary of what is still missing. What is
missing and belongs in core becomes a generic request; nothing else leaves.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- No order, candidate or document plans a route from an instance to core.
  WO-078 says forks are not tracked and that a fork's lesson enters through
  an ordinary planning pass; the ledger says no fork content flows back
  automatically. A search of tracked text for an upstream or capability
  request finds nothing else.
- Planning reads the sequence, the follow-up register and Entropy Reducer
  reviews. No planning command reads an issue.
- The issue reader delivered by WO-062 reads one issue into a screened,
  hash-stored bundle and writes nothing to the forge; its consumers are
  derived orders for registered targets, never this repository's planning.
- Product 03 names issues as an intake transport and proposal packets as
  the registered form; nine packets exist, all from Entropy Reducer
  dispositions.
- The update orders carry kit files and a dated instance-actions note to an
  instance; nothing in them names what a release answered.
- Product 12 says to inventory the useful behaviors of both existing
  generations separately and to give each obligation its own replacement
  and evidence; it leaves open where an instance keeps private state and
  what parity justifies retiring a step. No order builds the inventory.
- Product 10 proposes mapping statuses (exact, adapted, lossy, unmapped,
  blocked, unverified), parity fixtures and read-only discovery of an
  organization's own rule stores, as provisional vocabulary with no schema
  and no command.
- WO-096 builds typed rows in core from the operator's own captured notes,
  with employer-specific shapes present only as counts, and declines
  importing or paraphrasing any predecessor file. WO-112 scores the generic
  parity sentence in core. Neither gives an instance a place for its own
  private rows.
- The kit's manifest, once WO-074 lands, excludes instance files (no
  manifest exists at `bd437eb2`, observed 2026-10-07), and the overlay, once
  WO-076 lands, is instance-owned; nothing instance-owned yet records
  predecessor capability.

**Re-observed 2026-10-13 (`main` at `6dbd8771`, at the merge):**

- `UPSTREAM.md` names core's forge target only on a Markdown `**Remote:**`
  line (`scripts/launchpad.mjs` line 599); the overlay is instance-owned at
  the path `build.overlay` selects.
- WO-203 (v0.79.0) made a starter merge the fork's update route;
  `previewFromRevision` (line 1893) writes no receipt (line 1943), so a
  report-back carried only by a from-core update never reaches a fork that
  updates by merge.
- A `build: none` overlay emits a manifest with no `origin`
  (`scripts/lib/harness.mjs` lines 319 to 333), so a lookup in
  `origin.ids` reads every unit and support carrier as absent.

**Design (scope discipline):**

- **The floor, stated first.** A request is a statement in public, generic
  terms of something an operator needs to be able to do. A role drafts it
  from the operator's guidance; the operator reads it; and the role marks
  it ready only on the operator's word, which the draft's `ready` field
  records (the operator makes no file edits of their own, planning document
  §12.1). It carries no code, configuration, identifier, name, address,
  ticket text or file from the instance. The command runs the local-terms
  check, the outward lint and the declared screen over a draft and refuses
  to file one that fails or whose terms list is unavailable; these are
  aids, and passing them proves nothing about what a host's owner permits.
  Whether any text may leave a constrained managed host is decided by the
  operator under that host's rules, never by this mechanism:
  `requests.route` is `none` until an instance order sets it on the
  operator's word, and the instance's deployment record cites that word
  and says why. Every map row, fixture and example
  in this repository is synthetic or already public generic text; no
  predecessor capability, rule, name or structure is described beyond what
  product 12 and the critical path say, and the executor adds none. A need
  for a predecessor fact is the stop condition: stop and flag it.
- **In the instance.** A typed draft waits in an ignored lane until a role
  runs `request ready` on the operator's word, which sets its `ready` field
  and records the word. `manual` prints the title and body for the
  operator to carry out by whatever route the host's rules allow, the one
  step here no role can take (a known issue), and a role records the
  reference the operator reports back; `direct` files the labelled issue in the
  repository `UPSTREAM.md`'s typed block names, under the operator's grant
  for that one effect. The ledger keeps references and digests; the kit
  manifest lists neither the drafts nor the ledger.
- **Here.** Each open labelled issue becomes one register candidate with
  its reference and bundle hash, disposed by a pass like any row; the Clean
  Room screen applies to the issue text as to any source. An order that
  answers a request names it in a `dotln-requests` block, and its
  publication carries the closing reference, so the operator's merge
  closes the issue.
- **Back to the instance, on either route.** `UPSTREAM.md`'s typed block
  lists the requests answered at or below the kit's commit; the
  instance-actions note lists those the incoming kit adds, on a from-core
  update and on a starter-merge preview alike. A from-core update also
  lists them in the sibling receipt and marks the ledger; after a merge,
  which writes no receipt, the next `request` run marks it.
- **The deployment record.** The kit carries a template for the decision
  record ADR-0001 says a work deployment owes: host and harness as observed
  by the instance's first order, what may leave the instance and by which
  route, and who decides. It is instance-owned once filled.
- **The map.** Core ships the command, the row schema (step 9), templates
  and a seed of rows this repository already states in public generic
  terms, each `unverified`. Rows are instance-owned at a configured path
  and the source registry is ignored local state; neither is in the
  manifest, no export, update or receipt command reads either, and no
  command copies a source's bytes. `parity report` says per generation
  whether it is at least as capable: no `unmapped`, `blocked` or
  `unverified` row. A missing row becomes a request draft holding its
  generic statement and nothing else, which passes the screens and is
  marked ready on the operator's word like any other.
- **Live-run surfaces, at `6dbd8771`** (criterion 14). A scratch export:
  exists and has run. The route, `request file`, the labelled listing and
  `plan -- requests`: absent (steps 1, 3, 5, 6). Issue creation: no command
  does it. The `dotln-request` label here: not observed; the executor lists
  labels and, if it is absent, asks that the grant cover creating it. The grant: no
  recorded form covers issue creation (`packages/skeleton/loadouts/grants.json`
  is `[]`; the vertical's outward effects, `scripts/lib/vertical-primitives.mjs`
  lines 204 to 210, are `repo.push`, `pr.open` and `pr.thread.resolve`), so
  it is the operator's explicit authorization in the executor's session.
  The issue reader: exists, run live over scratch issues only.
- **Declined alternatives, recorded:** a pull request from the instance to
  core, or an automatic sync or telemetry of its needs (each moves instance
  content, which the settled rule forbids); filing into `docs/proposals/`
  (a packet is the registered form a pass may write from a request; the
  instance never writes into core); automation that comments on or closes
  issues (a new outward effect; the closing reference needs none); a
  channel other than the forge's issues (the reader exists for this one;
  an instance that cannot reach it uses `manual`); rows in core for a real
  predecessor (the floor); an importer that reads predecessor rule files and
  proposes rows (product 10's candidate; it needs an observed source and an
  instance's authority, and reopens as an instance order after that
  instance's first order observes its host); a map shared across instances
  (instances are not tracked); reusing WO-096's renderer (queued later,
  over a different source; the vocabulary is shared when it lands).

**Execution plan (the executor follows these steps in order; observed at
`bd437eb2`, 2026-10-07; re-observed at `6dbd8771`, 2026-10-13):**

1. `scripts/lib/config.mjs`: `SECTION_KEYS` (line 94) gains `requests`
   (only `route`: `none`, `manual`, `direct`) and `parity` (only `rows`, a
   contained relative path); `absentConfig` (line 711) defaults
   `requests: { route: "none" }` and a rows path. WO-207 adds `extensions`
   first; re-read both anchors. Cases in
   `scripts/test-configuration-root.mjs`. Check:
   `npm test -- --only configuration-root`.
2. `scripts/kit/`: a request template; the drafts lane and the ledger path;
   a deployment-record template that
   documents `requests.route` and its default; `first-order.template.md`
   names filling it; `gitignore.template` ignores the drafts lane and the
   source registry; `dotln.config.example.json` shows both sections (WO-207
   edits both of these files first; re-read them).
   `scripts/launchpad.mjs` `upstreamDocument` (line 461) writes a
   `<!-- dotln-upstream:start -->` JSON block into `UPSTREAM.md` holding
   `repository`, the target it prints on the `**Remote:**` line (line 599),
   or `null`. Check: `npm test -- --only launchpad`.
3. `scripts/request.mjs` (new) exporting `draftRequest`, `checkRequest`,
   `markReady`, `fileRequest`; `package.json` gains `"request": "node scripts/request.mjs"`.
   A draft is `{ schemaVersion: 1, id, title, body, ready: null | { by: "operator", at, word } }`;
   `ready <id> --word <text>`, which a role runs on the operator's word, sets `ready` with
   that word and refuses an empty one (`REQUEST_READY_WORD`); nothing else writes `ready`,
   and neither the ledger nor a filed issue carries the word.
   `check` runs `checkLocalTerms` (`scripts/lib/terms.mjs` line 13),
   `lintOutwardArtifact` (`scripts/lib/outward-lint.mjs` line 55) and
   `screenSourceBundle` (`packages/compiler/src/source-bundle.ts` line
   694); an absent terms list reports `unavailable`. `file` refuses `REQUEST_ROUTE_NONE`,
   `REQUEST_NOT_READY` and `REQUEST_SCREEN_FAILED`; `manual` prints and
   records the reference reported back; `direct` refuses a
   `null` `repository` with a typed reason, else runs `executeGh`
   (`scripts/lib/github-repository.mjs` line 99) with
   `issue create --repo <repository> --title … --body-file … --label dotln-request`.
   Ledger rows `{ id, titleDigest, route, issue, state, version }` never
   hold the body. Each form first marks `delivered` the rows whose issue the
   block's `answered` list names (step 8), writing only on a change. Check:
   step 4.
4. `scripts/test-request.mjs` (new) with a PATH `gh` stub that fails on any
   call (manual) or records argv (direct);
   `nodeTests("request", "scripts/test-request.mjs", { protects })` joins
   `suites` (`scripts/test-runner.mjs` line 662). Check:
   `npm test -- --only request`; `npm test -- --only runner-fixtures`.
5. `packages/skeleton/src/github-issue-source.ts`: a new export lists open
   issues carrying a label through the `gh api graphql` bridge call the
   reader's query helper makes (lines 242 to 262), returning numbers only;
   each goes through `fetchIssueBundle` (line 409) and
   `requireCompleteIssueBundle` (line 750; refusal `incomplete`, line 94).
   Cases in `packages/skeleton/test/github-issue-source.test.ts`. Check:
   `npm test -- --only skeleton`.
6. `scripts/refute-plan.mjs` `main` (line 231): a `requests` command writes
   `docs/planning/requests.json` rows `{ issue, bundleHash, revisionId }`,
   skipping registered issues; `scripts/lib/planning-followups.mjs`
   `collectFollowupSources` (lines 91 to 207) adds kind `request` read from
   that file, never from headings; `plan start` (lines 347 to 374) returns
   `requests: { undisposed }`. Fixtures in `scripts/test-plan-refutation.mjs`.
   Check: `npm test -- --only plan-refutation`;
   `npm test -- --only launchpad-planning`.
7. `scripts/work-orders.mjs`: `parseHeader` (line 77) returns `requests`
   from a `<!-- dotln-requests:start -->[{ "issue": 123 }]<!-- dotln-requests:end -->`
   block parsed like the dependency block, never from prose; `renderIndex`
   (line 590) prints it; `npm run work-orders -- index`.
   `scripts/worktree.mjs` `publish`, after `assertGitHubBodyProfile` (line
   777), refuses a body lacking `Closes #N` for each request. Check:
   `npm test -- --only work-orders-fixtures`; `npm test -- --only index`;
   `npm test -- --only worktree`.
8. Report-back (re-read at the base, after WO-207). `scripts/launchpad.mjs`:
   the step 2 block gains `answered`, `[{ issue, version }]` for each
   request a `dotln-requests` block names in an order closed at or below
   the exported commit, read from the committed control records as
   `closedBetween` (`scripts/siblings.mjs` line 102) reads them;
   `renderUpdatePlan` (line 1950) lists in the note the incoming entries
   the prior block lacks (no prior block: all, once); a from-core update
   passes them to `closeWithReceipt` (called in `applyKitUpdate`, line
   1842) and marks the ledger; `previewFromRevision` (line 1893) reads the
   incoming `UPSTREAM.md` as it reads `KIT_ACTIONS` (line 1915).
   `scripts/lib/siblings.mjs` `writeReceipt` (line 233) and the receipt
   decoder gain an optional `requests` list of issue numbers. Cases in
   `scripts/test-launchpad.mjs` and `scripts/test-siblings.mjs`. Check:
   `npm test -- --only launchpad`; `npm test -- --only siblings-fixtures`;
   `npm test -- --only siblings`.
9. `scripts/parity.mjs` (new): export `decodeParityRow`. Fields: `id`;
   `generation` (the instance's label; seed rows carry `v1`); `kind` in
   `capability`, `rule`; `statement` (generic, public terms); `source`
   `{ registryKey, locator }`, or on a seed row `{ document, quote }`;
   `status` in `exact`, `adapted`, `lossy`, `unmapped`, `blocked`,
   `unverified` (product 10 §Candidate — external rule-source import
   plans); `carrier` `{ kind: "unit" | "support" | "profile" | "order", id }`
   for exact, adapted and lossy; `lost` for lossy; `request` or `decision`
   for unmapped; `blocker` for blocked; optional `evidence` path; fixture
   rows carry `synthetic: true`. A refusal names the field as
   `PARITY_FIELD_<NAME>`. Check: step 12.
10. The seed, a JSON file in `scripts/kit/`: the five rows of the table in
    product 12 §Replacing a successful but costly workflow and the eight
    items of the critical path's parity bullet (as WO-112 criterion 3
    enumerates them), each `unverified`, each `source.quote` copied
    verbatim from product 12 or the critical path document (whose generic
    terms are the ones CLAUDE.md prescribes), written out by the executor;
    nothing parses the table. Check: step 12.
11. Commands in `scripts/parity.mjs`; `package.json` gains
    `"parity": "node scripts/parity.mjs"`. `init` writes rows from the seed
    when absent and the ignored registry; a second run changes no byte.
    `add` decodes then appends. `check` decodes all; looks each carrier up
    (a `unit` or `support` in the emitted manifest's `origin.ids`, re-read
    after WO-207, under whose build pin `origin` carries the pinned
    semantic hash; a
    `profile` document path, an `order` id in the control log); under
    `build: "none"` refuses a `unit` or `support` carrier naming the build;
    and searches each row's `source.locator`, `lost` and `blocker` as
    substrings in kit files and request drafts. `report` counts by
    generation, kind and status and marks a generation
    `at-least-as-capable: false` while any unmapped, blocked or unverified
    row remains, listing those ids. `request <row>` calls `draftRequest`
    with `statement` as the body only. Check: step 12.
12. `scripts/test-parity.mjs` (new) over synthetic rows: each status
    (criterion 8), the five refusals (criterion 9), a two-generation report
    (criterion 10), a statement-only draft (criterion 11), and the quote
    test (each `source.quote` is a substring of its `document`; criterion
    13); `nodeTests("parity", "scripts/test-parity.mjs", { protects })`
    joins `suites`. Check: `npm test -- --only parity`;
    `npm test -- --only runner-fixtures`.
13. Export and update fixtures in `scripts/test-launchpad.mjs` for criteria
    1 and 12. Check: `npm test -- --only launchpad`.
14. Re-mints: point `docs/evidence/current.json` at WO-193 revision 001 for
    each kind the `package.json` entries stale; `npm run build`;
    `node scripts/authority-evidence.mjs --write`,
    `node scripts/artifact-identity-evidence.mjs --write`,
    `node scripts/verification-evidence.mjs --write`;
    `node scripts/feedback-evidence.mjs --carry <the feedback edition selected at the base>`.
    Check: `npm test -- --only` each of `authority-evidence`,
    `artifact-evidence`, `verification-evidence`, `feedback-evidence`,
    `harness-evidence` and `evidence-sources`.
15. Live request (criterion 14) under the operator's explicit grant: from a
    scratch export with `requests.route` set to `direct`, the executor
    drafts one generic request from the operator's guidance, the operator
    reads it, the executor runs `request ready` on the operator's word,
    `request file` creates it here, and `npm run plan -- requests`
    registers it. With no grant by handoff, record the criterion unmet with
    the command. Check: `npm run test:docs`.
16. Write-backs of criterion 15, in place, each heading re-read at the
    base: product 03 §"### Channel-plural intake, PR-backed registration";
    product 07 §"## Operator-opened planning pass" (one sentence); product
    12 §"## Replacing a successful but costly workflow" (beside the request
    row) and §"## Open product choices"; product 10 §"## Candidate —
    external rule-source import plans"; `scripts/kit/README.client.md`
    (§Kit files and instance files also names the lane, ledger, rows file
    and registry); `docs/evidence/WO-193/decisions.md`; `npm run meta`;
    `node scripts/lineage.mjs index --check`;
    `node scripts/check-publication.mjs --print-locks`;
    `npm run publication:check`. Check: `npm run test:docs`.
17. Handoff sequence: `npm run format`; `npm run test:docs`;
    `npm test -- --review`; complete `docs/evidence/WO-193/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Acceptance criteria (all required)**

1. In an exported instance, `request draft` writes a typed draft in the
   ignored lane and leaves no tracked change in `git status`; `parity init`
   writes the rows file from the seed at the configured path and creates
   the ignored registry, and a second `init` changes nothing; the kit
   manifest lists both commands, the templates, the schema and the seed,
   and none of the drafts lane, ledger, rows file or registry.
2. `request check` reports each screen's result on fixture drafts: one
   clean; one with a term from a synthetic local-terms list; one with an
   off-host address; one with no terms list, reported as unavailable and
   treated as not passed.
3. `request ready` sets a draft's `ready` with the operator's word as given
   and refuses an empty word; neither the ledger nor the filed issue
   carries the word. `request file` refuses, with a typed reason naming the
   cause, a draft whose `ready` is null, a draft with a failing or unavailable screen, any
   draft while `requests.route` is `none`, and a `direct` filing when the
   `UPSTREAM.md` block names no repository; under `manual` it prints the
   title and body and makes no network call, shown by a fixture that fails
   on any spawned forge command; under `direct` a fixture forge command
   receives exactly the title, body and label and the ledger records the
   returned reference.
4. `npm run plan -- requests` over a fixture forge listing writes one
   register candidate per labelled open issue with its reference and bundle
   hash, nothing for an issue already registered, and the reader's typed
   stop for an issue whose bundle is incomplete; `plan start` returns the
   count of requests not yet disposed.
5. `parseHeader` reads the `dotln-requests` block; the index card prints
   it; the pull-request body published for an order naming a request
   carries that request's closing reference, and `worktree publish`
   refuses a body that lacks it; an order naming no request is unchanged.
6. A from-core update fixture from a recorded core commit to a later one
   prints, in the instance-actions note, the requests answered by the
   releases between them; the sibling receipt lists the same issue numbers
   and the ledger marks them delivered with the version. A starter-merge
   preview fixture prints the same requests and writes no receipt, and the
   next `request` run after the merge marks the ledger the same way.
7. The kit carries the deployment-record template; the instance's
   pre-drafted first order names filling it; `requests.route` is documented
   there with its default.
8. `parity add` writes a row and refuses one whose fields do not fit its
   status, naming the field; a table test covers every status.
9. `parity check` refuses, naming the row: a carrier absent from a fixture
   build and order set; a `unit` or `support` carrier under a fixture
   `build: none` manifest, naming the build; a `lossy` row that says
   nothing is lost; an `unmapped` row with neither a request nor a
   decision; and a private field's text found in a kit file or a request
   draft.
10. `parity report` over a synthetic set of two generations prints the
    counts and, per generation, whether it is at least as capable, with
    the rows that prevent it.
11. `parity request <row>` writes a request draft whose body is the row's
    generic statement; a test shows that no other field of the row appears
    in the draft.
12. An update fixture leaves the rows file and the registry byte for byte
    unchanged, and an export from a core checkout that holds a synthetic
    rows file writes none of it into the kit.
13. Every row, fixture and example committed by this order is synthetic or
    quoted from product 12 or the critical path document; the final review
    records the check that found it so.
14. One live request: from a scratch export with `requests.route` set to
    `direct` under the operator's grant, one generic request, drafted by
    the executor from the operator's guidance and marked ready on the
    operator's recorded word, is filed to this repository, read by
    `plan -- requests` and registered; its evidence records the issue
    reference, the bundle hash and the register row, and no text beyond
    the request itself.
15. The write-backs of step 16 state: in 03, the request route as
    implemented for issues; in 07, `plan -- requests` among the entry
    reads; in 12, the route and its floor beside the request row, the
    answer to where an instance keeps this private state, and the report as
    an instance's parity measure; in 10, the mapping statuses in use by the
    instance map; in the client README, both commands. The decisions file
    and index; the publication locks refreshed.
16. The re-mints of step 14 are recorded; `npm test -- --review` and
    `npm run test:docs` green; `git diff --check` clean; no new dependency.
    No live feedback episode is owed.

**Deliverables:** the two kit commands with their templates, schema, seed,
lane, ledger and keys; the deployment-record template; the `UPSTREAM.md`
block; the listing and planning intake; the requests block and publish
check; the receipt and note additions; fixtures; the re-mints; one live
request; the write-backs.

**Preflight:** `npm test -- --only configuration-root` for step 1,
`npm test -- --only launchpad` for steps 2, 8 and 13,
`node --test scripts/test-request.mjs` for steps 3–4 (the suite step 4
registers), `npm test -- --only skeleton` for step 5, `npm test -- --only plan-refutation` and
`npm test -- --only launchpad-planning` for step 6,
`npm test -- --only work-orders-fixtures`, `npm test -- --only index` and
`npm test -- --only worktree` for step 7,
`npm test -- --only siblings-fixtures` and `npm test -- --only siblings`
for step 8, `node --test scripts/test-parity.mjs` for steps 9–12 (the suite
step 12 registers),
`npm test -- --only runner-fixtures` for steps 4 and 12,
`npm test -- --only authority-evidence`,
`npm test -- --only artifact-evidence`,
`npm test -- --only verification-evidence`,
`npm test -- --only feedback-evidence`,
`npm test -- --only harness-evidence` and
`npm test -- --only evidence-sources` for step 14, and `npm run test:docs`
when a document changes (steps 7 and 14 to 16), each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures and table tests of criteria 1 to 12; the
recorded check of criterion 13; the live request of criterion 14, an
outward effect run only under the operator's explicit grant at execution;
the re-mints; `npm test -- --review` before `implementation-ready` and at
final review, which reuses the last passing run when the code identity is
unchanged (planning document §12). No live row: a real map exists only in
an instance and is never evidence here.

**Write-back duty:** as listed in criterion 15.

**Known issues and carry-ins:**

- Stale on 2026-10-07 and corrected then: `plan start` also reads
  failures and conditions (and reader scores, `scripts/refute-plan.mjs`
  lines 358 to 362); products 03 and 07 headroom (ceilings are planning's);
  the manifest and overlay, then planned, now exist.
- Decided by the 2026-10-07 pass: the register row carries the reference
  and bundle hash only; the label is `dotln-request`; the upstream id comes
  from `UPSTREAM.md`; the product 12 sentence goes beside the request row;
  a typed draft, a typed requests block and a JSON-backed request source
  replace the three prose reads (prose-parsing screen). Reopen: a request
  needs its body in the register to be triaged. Seed rows carry generation
  `v1`; critical path quotes are kept verbatim; the carrier and quote
  checks are typed.
- Blockers restated 2026-10-13: WO-074 (v0.70.0), WO-076 (v0.76.0), WO-077
  (v0.74.0) and WO-078 (v0.74.3) are closed, so the export's file names,
  manifest fields, template directory, client README, `.gitignore`, update
  and receipt are fixed as landed; this order follows them and amends its
  own names to match. `draftRequest`, which the map's request form needed,
  is built in step 3.
- Amended 2026-10-13 (the merge), from the re-observations above: the
  typed `UPSTREAM.md` block carries the repository and the answered list on
  both routes (reopen: a released answer leaves a ledger undelivered on
  either route, or the manifest gains a typed provenance field); a unit or
  support carrier under `build: none` is refused naming the build (reopen:
  such an instance must record a carrier its build would supply).
- The declared screen catches declared secret shapes and off-host
  addresses only; an unrecognized secret passes it (the release notes of
  WO-062 say so). The private-field check compares text; a paraphrase
  passes it. The floor rests on the operator's reading, not on the screens.
- The local-terms list lives only in ignored local state; without one the
  check reports unavailable, never a pass.
- An instance that copies predecessor text into its own rows acts inside
  its own boundary; this order guarantees that core's commands never carry
  a row out.
- Whether a particular managed host permits any outward request is not
  known here and is not this order's to find out.
- The `manual` route ends with the operator carrying the printed title and
  body out of the instance by a route the host's rules allow. No role can
  take that step: `manual` exists for an instance that may not reach core,
  and whether text may leave a constrained managed host is the operator's
  decision under that host's rules (the Design's floor). Under the
  operator's 2026-10-13 direction that roles make every repository change
  (planning document §12.1), it is, beside the pull-request merge the
  operator keeps, the one step of this order left in the operator's hands;
  a role records the reference the operator reports back.
  Reopen if a route that keeps that decision with the operator lets a role
  carry the text.
- Receipt 038: no record quantifies the cost of having no request route or
  private map (both additive), and both constituents first sat ahead of the
  product exit; they were placed after WO-118 (closed, v0.80.0). Reopen if
  a planning capture records an instance need that reached core late for
  lack of a route, which would establish the cost.
- A capability an instance needs and core lacks, such as reading work from
  a tracker other than the forge's issues, is an `unmapped` row and then a
  request; an instance-owned source adapter loads through WO-207's
  extension point (FUP-3e22cf6f99f02005 is allocated there), not this
  order.
- The product 12 write-backs add a source revision to FUP-0126 (allocated
  to WO-080 and WO-083) and the product 10 write-back one to FUP-0115
  (deferred until WO-096 closes); `npm run meta` records them and the next
  pass re-records each, as the 2026-10-13 pass did for FUP-0126 and
  FUP-0113 (an inference from those records). This order disposes neither.

**Non-goals:** moving any instance content to core; reading or tracking an
instance from core; any row about a real predecessor in this repository;
reading or importing predecessor material; a tracker other than the forge's
issues, or an adapter for any tracker (an instance's adapter is WO-207's
extension point); automation that writes to an issue after it is filed;
deciding policy for any host; deciding what an instance may retire.

**Operator-review assumptions**

1. A request is generic by construction and comes from the operator's
   guidance; a role sets the `ready` field only on the operator's word,
   which the field records.
2. `requests.route` defaults to `none`; `manual` prints, `direct` files
   under a grant given for that effect.
3. A request becomes a register candidate at the next planning pass and is
   disposed there like any other row; it carries no priority of its own.
4. The issue is closed by the operator's merge of the pull request that
   names it.
5. Core ships mechanism and public seed rows only; the map's content exists
   only in the instance.
6. Generations are labels the instance chooses; this repository keeps its
   own generic terms.
7. "At least as capable" means no row of that generation is unmapped,
   blocked or unverified.
8. The only way anything derived from a row leaves an instance is a request
   built from its generic statement.
