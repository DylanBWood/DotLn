# WO-193 — An instance asks core for a capability in a standard way: a generic request the operator writes and files, read into planning here, and reported back through the update (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** minor. A kit command with three forms, an
instance configuration key, a planning intake of labelled issues, a
request field on orders, receipts and the update note. Assigned at
activation under the standing opt-out default.
**Cost:** adds to the kit `npm run request -- draft|check|file`
(`scripts/request.mjs`), a request template, an instance-owned ignored
drafts lane and an instance-owned request ledger, the configuration key
`requests.route` (`none`, `manual` or `direct`; default `none`), and a
deployment-decision template for the instance; adds to core
`npm run plan -- requests` (labelled issues read through the existing
issue reader into register candidates), a `**Requests:**` header field
on work orders, the request identifiers in the sibling receipt and in
the update's instance-actions note, and one line at `plan start`.
Removes: the only route a need found in an instance has today, which is
the operator remembering it until a planning pass at home. Re-mints:
unknown until the export orders land and fix which kit files are
registered sources; `scripts/refute-plan.mjs` and
`scripts/work-orders.mjs` are declared machinery sources, so
`npm test -- --review` runs before handoff. One live issue is created
in this repository under the operator's grant (criterion 8). Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, items 15
and 16 (captured in ignored intake; SHA-256 in the ledger section of
that date); product 03 §Channel-plural intake, a candidate this order
makes real for one channel; WO-078's sentence that a fork's lesson
enters through an ordinary planning pass; the 2026-10-02 planning
pass's search, which found no planned route from an instance to core
([planning document](../planning/standard-pass-2026-10-02.md) §8).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: applies with force. This order builds the one channel through
which words written inside a private instance can reach this public
repository; the Design's first bullet is the floor it must hold.
**Depends on:** WO-074 (the kit manifest and its file set); WO-077 (the
update and its instance-actions note); WO-078 (the sibling receipt);
WO-062 merged (the screened issue reader; closed); WO-063 merged (the
outward lint; closed); WO-060 merged (the declared screen; closed).
**Recommended placement:** after WO-192 and before WO-194. This order
edits the export's file set and manifest, `scripts/request.mjs` (new),
`scripts/refute-plan.mjs` and the planning libraries,
`scripts/work-orders.mjs` (`parseHeader`), the update note and the
sibling receipt, product 03, product 07 and product 12. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the kit file set and manifest the request command joins"
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
`docs/decisions/0001-personal-clean-room-build.md` (a work deployment
gets its own decision record and bootstrap route); product 03
§Channel-plural intake and the proposal-packet paragraphs before it;
product 12 §Replacing a successful but costly workflow;
`docs/planning/phase-two-plan-2026-09-06.md` (an instance's content
never flows back to core); `docs/work-orders/WO-074-launchpad-export-kit.md`,
`WO-077-launchpad-export-update.md` and `WO-078-sibling-registry.md`;
`packages/skeleton/src` (the issue reader, `fetchIssueBundle` and
`requireCompleteIssueBundle`); `scripts/lib/terms.mjs` and the outward
lint; `scripts/lib/planning-followups.mjs` (register candidates);
`scripts/work-orders.mjs` (`parseHeader`); the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§8.

**Objective:** Someone working in an instance who finds that core lacks
something can ask for it in a few minutes without anything from the
instance leaving it except the sentences they chose to write; the
request is read at the next planning pass here; and when a release
answers it, the instance's next update says so.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- No order, candidate or document plans a route from an instance to
  core. WO-078 says forks are not tracked and that a fork's lesson
  enters through an ordinary planning pass; the ledger says no fork
  content flows back automatically. A search of tracked text for an
  upstream or capability request finds nothing else.
- Planning reads the sequence, the follow-up register and Entropy
  Reducer reviews. No planning command reads an issue.
- The issue reader delivered by WO-062 reads one issue into a screened,
  hash-stored bundle and writes nothing to the forge; its consumers are
  derived orders for registered targets, never this repository's own
  planning.
- Product 03 names issues as an intake transport and proposal packets as
  the registered form; nine packets exist, all from Entropy Reducer
  dispositions.
- The update orders carry kit files and a dated instance-actions note to
  an instance; nothing in them names what a release answered.

**Design (scope discipline):**

- **The floor, stated first.** A request is a statement in public,
  generic terms of something an operator needs to be able to do. It is
  written by the operator, or drafted with help and then read and
  marked ready by the operator. It carries no code, configuration,
  identifier, name, address, ticket text or file from the instance. The
  command runs the local-terms check, the outward lint and the declared
  screen over a draft and refuses to file one that fails or whose terms
  list is unavailable; these are aids, and passing them proves nothing
  about what a host's owner permits. Whether any text may leave a
  constrained managed host is decided by the operator under that host's
  rules, never by this mechanism: `requests.route` is `none` until the
  operator sets it, and the instance's deployment record says why.
- **In the instance.** `request draft "<title>"` writes a draft from the
  template into an ignored instance-owned lane. `request check <id>`
  runs the three screens and prints what each found. `request file <id>`
  requires the draft's ready line, passing screens and a route: under
  `manual` it prints the title and body for the operator to file from
  wherever they are allowed to, and records the issue reference the
  operator reports back; under `direct` it creates the issue in the
  repository `UPSTREAM.md` names, with the request label, under the
  operator's grant for that one effect. The instance ledger keeps the
  request identifier, title digest, route, issue reference and state;
  the kit manifest lists neither the drafts nor the ledger.
- **Here.** `npm run plan -- requests` lists open issues carrying the
  request label, reads each through the issue reader, and writes one
  register candidate per request with the issue reference and the
  bundle's hash; a pass disposes it like any register row, and the
  Clean Room screen applies to the issue text as to any source. An
  order that answers a request names it in a `**Requests:**` header
  field; its pull-request body carries the closing reference, so the
  operator's merge closes the issue.
- **Back to the instance.** The sibling receipt and the update's
  instance-actions note list the requests answered by orders released
  between the instance's recorded core commit and the new one; on
  update the instance ledger marks them delivered with the version.
- **The deployment record.** The kit carries a template for the
  decision record ADR-0001 says a work deployment owes: host and
  harness as observed by the instance's first order, what may leave the
  instance and by which route, and who decides. It is instance-owned
  once filled.
- **Declined alternatives, recorded:** a pull request from the instance
  to core (it moves instance content, which the settled rule forbids);
  an automatic sync or telemetry of instance needs (same rule); filing
  into `docs/proposals/` directly (a packet is the registered form a
  planning pass may write from a request; the instance never writes
  into core); automation that comments on or closes issues (a new
  outward effect for release close; the merge's closing reference needs
  none); a request channel other than the forge's issues (the reader
  exists for this one; an instance that cannot reach it uses `manual`).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `scripts/lib/config.mjs`: `SECTION_KEYS` (line 84) gains `requests`; a decoder admits only
   `route` in `none`, `manual`, `direct`; `absentConfig` (line 633) defaults
   `requests: { route: "none" }`. Cases in `scripts/test-configuration-root.mjs`.
   Check: `npm test -- --only configuration-root`.
2. `scripts/request.mjs` (new) exporting `draftRequest`, `checkRequest`, `fileRequest`
   (WO-194 imports `draftRequest`); `package.json` gains `"request": "node scripts/request.mjs"`.
   A draft is typed JSON `{ schemaVersion: 1, id, title, body, ready: null | { by: "operator", at } }`;
   `file` checks `ready` only (no "ready line" in Markdown). `check` runs
   `checkLocalTerms(root, surfaces)` (`scripts/lib/terms.mjs` line 13),
   `lintOutwardArtifact` (`scripts/lib/outward-lint.mjs` line 55) and
   `screenSourceBundle(bundle, allowedHosts)` (`packages/compiler/src/source-bundle.ts` line
   694); an absent terms list reports `unavailable`. `file`: route `none` refuses
   `REQUEST_ROUTE_NONE`; missing ready `REQUEST_NOT_READY`; a failed or unavailable screen
   `REQUEST_SCREEN_FAILED`; `manual` prints; `direct` runs
   `executeGh(cwd, ["issue", "create", "--repo", <upstream>, "--title", ..., "--body-file", ..., "--label", "dotln-request"])`
   (`scripts/lib/github-repository.mjs` line 99). Ledger rows
   `{ id, titleDigest, route, issue, state, version }`: the reference and digest only, never
   the body (clean room).
3. `scripts/test-request.mjs` (new) with a PATH `gh` stub that fails on any call (manual) or
   records argv (direct); add `nodeTests("request", "scripts/test-request.mjs")` to `suites`
   (`scripts/test-runner.mjs` line 591). Check: `npm test -- --only request`.
4. Labelled listing: a new export in `packages/skeleton/src/github-issue-source.ts` using
   its `gh api graphql` helper (lines 240 to 256), returning numbers only; each number then
   goes through `fetchIssueBundle` and `requireCompleteIssueBundle` (refusal `incomplete`,
   line 94). The reader has no listing today; this is the capability the order lacked.
5. `scripts/refute-plan.mjs` `main` (line 198): a `requests` command writes
   `docs/planning/requests.json` rows `{ issue, bundleHash, revisionId }`, skipping registered
   issues; `scripts/lib/planning-followups.mjs` `collectFollowupSources` (lines 91 to 206)
   adds kind `request` read from that file, never from headings; `plan start` (lines 314 to
   337) returns `requests: { undisposed }`. Fixtures in `scripts/test-plan-refutation.mjs`.
   Check: `npm test -- --only plan-refutation`.
6. `scripts/work-orders.mjs`: `parseHeader` returns `requests` from a
   `<!-- dotln-requests:start -->[{ "issue": 123 }]<!-- dotln-requests:end -->` block parsed
   like the dependency block (never from a `**Requests:**` prose field); `renderIndex` (line
   444) prints it; `npm run work-orders -- index`. `scripts/worktree.mjs` `publish` (after
   `assertGitHubBodyProfile`, line 563) refuses a body lacking `Closes #N` for each request.
   Check: `scripts/test-work-orders.mjs` (`work-orders-fixtures`) and `scripts/test-worktree.sh`
   (`worktree`).
7. Receipt and update note (after WO-077 and WO-078; re-read their formats at the base).
8. Deployment-record and request templates, the drafts lane, the ledger path and the
   `.gitignore` entry in `scripts/kit/` (after WO-074); `UPSTREAM.md` carries
   `upstream.repository`, the id `direct` files to (the executor adds it to WO-074's
   writer if WO-074 left it out, as an Adjacent Repair).
9. Live request (criterion 8) under the operator's explicit grant; if none is given by
   handoff, record the criterion unmet with the command.
10. Write-backs: product 03 §"### Channel-plural intake, PR-backed registration" (in place);
    product 07 §"## Operator-opened planning pass" (the requests feed, one sentence); product
    12 §"## Replacing a successful but costly workflow" (the route, beside the request row);
    `docs/evidence/WO-193/decisions.md`; `node scripts/lineage.mjs index --check`;
    `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
11. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-193/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the kit command, template, lane, ledger and
configuration key; the deployment-record template; the planning intake
and its register candidates; the header field; the receipt and note
additions; fixtures; one live request; the write-backs below.

**Acceptance criteria (all required)**

1. In an exported instance, `request draft` writes a draft in the
   ignored lane; the kit manifest lists the command and templates and
   neither the lane nor the ledger; `git status` in the instance shows
   no tracked change from drafting.
2. `request check` reports each screen's result on fixture drafts: one
   clean; one with a term from a synthetic local-terms list; one with an
   off-host address; one with no terms list, reported as unavailable
   and treated as not passed.
3. `request file` refuses, with a typed reason naming the cause, a draft
   without the ready line, a draft with a failing or unavailable screen,
   and any draft while `requests.route` is `none`; under `manual` it
   prints the title and body and makes no network call, shown by a
   fixture that fails on any spawned forge command; under `direct` a
   fixture forge command receives exactly the title, body and label and
   the ledger records the returned reference.
4. `npm run plan -- requests` over a fixture forge listing writes one
   register candidate per labelled open issue with its reference and
   bundle hash, writes nothing for an issue already registered, and
   gives the reader's typed stop for an issue whose bundle is
   incomplete; `plan start` prints the count of requests not yet
   disposed.
5. `parseHeader` reads `**Requests:**`; the index card prints it; the
   pull-request body prepared for an order naming a request carries
   the closing reference; an order naming no request is unchanged.
6. An update fixture from a recorded core commit to a later one prints,
   in the instance-actions note, the requests answered by the releases
   between them, and the instance ledger marks them delivered with the
   version; the sibling receipt lists the same identifiers.
7. The kit carries the deployment-record template; the instance's
   pre-drafted first order names filling it; `requests.route` is
   documented there with its default.
8. One live request: from a scratch export with `requests.route` set to
   `direct` under the operator's grant, one operator-written generic
   request is filed to this repository, read by `plan -- requests` and
   registered; its evidence records the issue reference, the bundle
   hash and the register row, and no text beyond the request itself.
9. Write-backs: product 03 §Channel-plural intake states the request
   route as implemented for issues; product 07 §Operator-opened planning
   pass names `plan -- requests` among the entry reads; product 12
   states the route and its floor; the decisions file and index; the
   publication locks refreshed.
10. `npm test -- --review` and `npm run test:docs` green;
    `git diff --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 to 7; the live request of
criterion 8, which is an outward effect and runs only under the
operator's explicit grant at execution; `npm test -- --review` before
`implementation-ready` and again at final review.

**Write-back duty:** as listed in criterion 9.

**Known issues and carry-ins:**
- Stale on 2026-10-07 and corrected above: `plan start` also reads
  recorded failures and conditions (`scripts/refute-plan.mjs` lines 326 to
  327); products 03 and 07 headroom (ceilings are planning's now).
- Decided by the 2026-10-07 pass: the register row carries the reference
  and bundle hash only; the label is `dotln-request`; the upstream id
  comes from `UPSTREAM.md`; the product 12 sentence goes beside the
  request row. Typed draft, typed requests block and a JSON-backed request
  source replace the three prose reads (prose-parsing screen). Reopen: a
  request needs its body in the register to be triaged.
- Blocked on WO-074 (kit file set, template directory, drafts lane,
  `UPSTREAM.md`), WO-077 (the note's format) and WO-078 (the receipt).

- The declared screen catches declared secret shapes and off-host
  addresses only; an unrecognized secret passes it (the release notes of
  WO-062 say so). The floor rests on the operator's reading, not on the
  screens.
- The local-terms list lives only in ignored local state; without one
  the check reports unavailable, never a pass.
- The file names and manifest fields of the export are fixed by WO-074,
  WO-077 and WO-078; this order follows them as landed and amends its
  own names to match.
- Whether a particular managed host permits any outward request is not
  known here and is not this order's to find out.
- Receipt 038: no record yet quantifies the cost of having no request
  route, and the order first sat ahead of the product exit. It is placed
  after WO-118 and is not activated ahead of it. Reopen if a planning
  capture records an instance need that reached core late for lack of a
  route, which would establish the cost.

**Non-goals:** moving any instance content to core; reading an
instance from core; a tracker other than the forge's issues; the
private predecessor map (WO-194); automation that writes to an issue
after it is filed; deciding policy for any host.

**Operator-review assumptions**

1. A request is generic by construction and operator-authored; the
   ready line is the operator's.
2. `requests.route` defaults to `none`; `manual` prints, `direct` files
   under a grant given for that effect.
3. A request becomes a register candidate at the next planning pass and
   is disposed there like any other row; it carries no priority of its
   own.
4. The issue is closed by the operator's merge of the pull request that
   names it.
