# fork returns and review batches — 2026-11-06

## Dispatch and capture

Dispatch: `planning: standard planning pass +` with four items (the
DotLn-Enterprise-Starter fork's block of 2026-11-04 on starter v0.115.0, six
items; the fork's block of 2026-11-05 on starter v0.117.0, eight items; the
operator's objection to a planning review that leaves orders out of its
subject for a reviewer's context, with the remedy named: split the work over
more reviewers; and the instruction that every item goes into WO-257 unless
one definitely warrants its own order or another order's amendment),
received at 2026-11-06T01:48:36.891Z (prompt-hook time) in Claude Code
2.1.318, Fable 5.1 at `max`, operator-selected (the `/model` line of the
session). Captured verbatim in ignored intake
`docs/intake/planning-dispatch-2026-11-05-fork-returns-and-review-batches.md`,
SHA-256 `cd1cb6d60eba1bc4ea82e39f73983da8ab61813fa87c492f5412819bbaa6aa00`;
the journal's digest of the message as the hook received it is
`8c2abb3ce38557c635cab499e9549af43b3d774fc3327f47bb68c539ad23a5c2`
(9,538 bytes, which include the host's command block). Branch:
`planning/2026-11-06-fork-returns-and-review-batches` from clean `main` at
`772979eac` (v0.118.0). The dispatch line carried no host label and no
worker option, so this ran as one standard pass with the default refuter.

The hook journaled the dispatch unclassified (prefix null, role unknown):
the `/model` command ran in the same prompt and Claude Code put its output
block before the operator's text, which is the fork's item 5 of 2026-11-05
reproduced on this host (§Readings). The session therefore had no planner
role, no outside-write grant and no usage standing until the operator sent a
bare `planning:` mid-turn at 01:57:51Z, which the hook read as the dispatch
and resolved the role; the session scratch and `harness usage` worked from
then on. The operator's questions about that row (what it means, why, since
when, how grants work, whether a pass can still run) were answered in the
turn from the journals and the compiled reader; none became a rule.

Mid-turn, the operator decided that every item goes into WO-257, over this
pass's proposal of a separate one-file order for the hook fix placed first;
the proposal was withdrawn (§NoOps) and the decision is recorded in WO-257's
operator-review assumptions. One standing rule was read from the operator's
item 3 and is recorded in product 07 §Verification review and attack and in
§Rules recorded; its wording is the planner's synthesis of the operator's
words and is named below so the operator can strike it.

The operator's items and the fork's, each read for its aim, with what this
pass did and what in it is the planner's inference rather than the
operator's or the fork's words:

| Item | Aim read | Disposition | Planner's inference |
| --- | --- | --- | --- |
| 1 | the fork's block of 2026-11-04 (six items) | 1.1 recorded; 1.2 recorded (the fork struck its update rule); 1.3 → WO-257 step 16; 1.4 recorded; 1.5 → WO-257 step 15; 1.6 → WO-257 step 13; §Answers to the fork | reading 1.3's "either admit or say so" as admit |
| 2 | the fork's block of 2026-11-05 (eight items) | 2.1 recorded; 2.2 → WO-257 step 17; 2.3 answered: landed in WO-255-D006 (v0.118.0); 2.4 → WO-257 step 13; 2.5 → WO-257 step 11, reproduced here; 2.6 → WO-257 step 14; 2.7 recorded; 2.8 → WO-257 step 12 | the third allow rule's authorization read from the operator's acceptance of the amended order |
| 3 | a review must never leave orders out of the subject for a reviewer's context; split the work over more reviewers | WO-257 step 12 (batches, bounded documents, the measured size); the standing rule in product 07 §Verification review and attack; the operator's question answered in §Readings (the ceiling is a worker's context; the refusal was the kit's, benefiting nobody) | the rule's wording; keeping a per-batch ceiling at all |
| 4 | every item into WO-257 unless one definitely warrants its own order | every item into WO-257; the separate hook order proposed mid-turn was withdrawn on the operator's words | none after the withdrawal |

Assumptions recorded: that the fork's observation of settings read at
session start is right (the pages read on 2026-11-03 do not say; WO-257's
release says to start a new session); that the fork's WO-028 records
(D038, D043, D057, D058) say what the block says, since the fork's planning
branches are not in a local clone this pass can read (the sibling
`../DotLn-Enterprise-Starter` is the starter export at v0.118.0 with no pass
documents).

## Readings

### Entry

`npm run plan -- start fork-returns-and-review-batches`: failures 0 h 0 min,
reader scores 0 h 0 min, conditions 0 h 1 min, census 0 h 0 min, prune 0 h 0
min (11 candidates removed, 277 retained, remaining 0), branch 0 h 0 min;
about 0 h 1 min in all, against the 0 h 17 min of the 2026-11-03 pass, which
is WO-253 (v0.115.0) observed on this host, as the fork observed it on its
own (its item 1 of 2026-11-04). `plan failures` since the 2026-11-04 receipt:
four failed verifications (WO-253 VER-001, criterion 7, the bounded prune;
WO-246 VER-001, criterion 3, the gh repository guard admitting distinct hosts
with one owner and name; WO-255 VER-001 and VER-002, `readReturn` taking a
quoted example's findings as the review's own), each repaired and the order
closed (VER-002, VER-002 and VER-003 pass); four repairs; three failed first
verifications; seventeen corrections (WO-246 D012 to D025, WO-255-D010);
twelve amendments and four withdrawn; three final-review escapes (WO-255,
WO-246 and WO-254 one each); ten host denials (four unassigned, four WO-255,
one each WO-246 and WO-254); seven long phases (WO-246 two, WO-253 two,
WO-255 two, WO-254 one); no bound stop. Every failed report's cause is in its
order's closed record and none recurs in an open order; nothing to route.
`plan conditions`: five holding and six unknown, as on 2026-11-03 (the
plan-check median, the plain gate's median and two task medians; the release
table is current since the 2026-11-03 regeneration); none fired by an
order's lifecycle event (§NoOps). `gh issue list`: no open issues. Reader
scores: not due (`readerDue: false`). The documents report: 26 red tags,
all 26 carried from the 2026-11-03 block (§Red tags), and 303 unread.

### The dispatch line and the role (the fork's item 2.5; this session)

`harnessPromptLine` (`packages/compiler/src/harness.ts` 38 to 52) skips
blank lines and one opening fence and reads the next line as the dispatch.
Run from the compiled module (`packages/compiler/dist/src/harness.js`) on
2026-11-06 with two prompts: the bare text `planning: standard planning pass
+` classes `{prefix: "planning:", prefixLine: 0, class: "direction"}`; the
same text behind the block Claude Code wrote into this session's prompt
(`<local-command-caveat>…</local-command-caveat>`, `<command-name>/model
</command-name>`, `<command-message>`, `<command-args>` and
`<local-command-stdout>…</local-command-stdout>`) classes `{prefix: null,
prefixLine: null, class: "unclassified"}`. This session's journal
(`docs/control/local/harness/e0823b0a….jsonl`, row 2) holds exactly that:
`prefix null, prefixLine null, class unclassified, role unknown`. The first
operator row of every session journal in the live directory: `planning:` read
on 2026-10-24T17:37Z (5,238 bytes), 2026-10-26 and 2026-10-28T13:22Z (9,888
bytes); unclassified with a dispatch-sized message on 2026-10-24T23:52Z
(5,021 bytes), 2026-10-29T02:36Z (9,203), 2026-10-30T14:54Z (10,702),
2026-10-31T15:10Z (7,495), 2026-11-01T22:35Z (17,938), 2026-11-03T23:12Z
(15,346) and tonight (9,538). The 2026-11-03 pass document records "no role
was active" with the `/model` line named; the journal holds no message text,
so which of the other five carried the block is inferred from their size and
their dates, each a planning pass. The role, the outside-write grants and
`harness usage` all hang on that row (`harness-host.ts` 6520 to 6532: the
role is resolved from the `planning:`, `ideation:` and `drive:` prefixes of
the dispatch line); `enterHarnessSession` (4195 to 4222) is what the resolved
role enters. The same reader is embedded in the generated Codex hook
(`harness.ts` 162, 1442) and feeds `harnessWorkerWords` (WO-255-D010), so a
`fable` or `astra` label behind the block selects nothing either. A bare
`planning:` sent as its own message at 01:57:51Z was read as the dispatch
(the hook's context then named the planner role and the session scratch), so
the workaround until WO-257's release is to send the dispatch, or a bare
prefix line, as a message of its own. WO-257 step 11 skips the block.

### The review helper's ceiling (the fork's item 2.8; the operator's item 3)

`subjectDocuments` (`scripts/lib/review-worker.mjs` 404 to 445) inlines the
whole text of every `.md` the branch added or modified under `docs/planning/`
and `docs/work-orders/` since `plan.documentsBase`, which `runChangeReview`
(1260) sets to the merge base "whatever a recheck's narrower delta touched";
`validateChangeReviewRequest` (`packages/skeleton/src/change-review-protocol.ts`
186) refuses `request.brief.length` above its ceiling with
`profile-refused: change review brief` and prints no size. The fork measured
426 KB of such documents on 2026-11-05 and withdrew amendments to five orders
(129 KB of text for a few sentences) to be reviewed at all. Measured on this
pass's own committed subject with the helper's dry run (§Validation): the
brief is 120,955 characters, under the ceiling, because `renderReviewBrief`
(686 to 690) replaces a document over `MAX_DOCUMENT_BYTES` (366) with a
one-line pointer to the checkout, which is what it did with the map (946,832
bytes) and the history page; the ceiling is met by the sum of documents
under that cap, which is the fork's case (five orders filed, nine amended
and the pass document). This corrects the first draft of this paragraph,
which inferred from `subjectDocuments` alone that a pass puts the map in
the brief whole. The operator's question, who the ceiling benefits: nobody.
It was written as a worker's context bound (the same figure as
`MAX_SUBJECT_CHARS` of the vertical judgment protocol) and the helper's only
answer to passing it was to refuse, which made the reviewed route cost a
pass its amendments. WO-257 step 12 bounds the documents by the round's
base, splits a brief past the ceiling into batches over more workers with
one merged report, and prints the measured size; the operator's rule is in
product 07 §Verification review and attack and §Rules recorded.

### The judged subject and the separate track (the fork's items 1.6 and 2.4)

`scripts/lib/plan-subject.mjs` (319 to 365) builds the judged orders from
the sequence block alone; `amendPlanOrder` (`scripts/lib/plan-receipts.mjs`
1484 to 1500) admits only an order in the latest planning receipt's
`subject.orders`; the sequence's rule (docs/planning/sequence.md §Rules in
force) says a `track: separate` member is listed under Workstreams by the
index and needs no entry. So a separate-track member is never in a receipt
and `amend-order` refuses it; the fork's WO-028-D043 took the route product
07 gives a never-judged seed order (the authorization in its decisions and
the ordinary checks), which is the right route until WO-257 step 13 lists
the open members of each separate-track workstream after the sequenced
orders. Core has no separate-track workstream today (`docs/workstreams/`
holds none with that track), so the fixture is the criterion's.

### The rules block and the retained lanes (the fork's item 2.6)

`checkRulesRecorded` (`scripts/lib/planning-document.mjs` 145 to 200) reads
`dispatchJournalDirectory(root)/<sessionKey>.jsonl` only; a closed order's
journals move to `docs/control/local/retained/WO-NNN/harness/` at its close
(`scripts/lib/worktree-removal.mjs` 79; WO-237), and `plan failures` reads
them there (`retainedJournals`: 13 lanes, 58 files tonight). A rule given to
a verifier or final reviewer of an order that has since closed therefore
fails "names no operator message", and the fork wrote five such rules in
prose beside its block. WO-257 step 14 reads the retained lanes and lets an
entry name the order; a decision as provenance is declined (§NoOps).

### Status, the front page and the allow rule (the fork's items 1.5, 1.3 and 2.2)

`warnIfProjectionDisagrees` (`scripts/resume.mjs` 1075 to 1085) prints the
warning the fork sees and names no command; `refreshControlProjection`
(1059) is exported and called only by `scripts/lib/worktree-integration.mjs`
443; `status` has no `--refresh`. `documentReport`
(`scripts/lib/document-kinds.mjs` 883 to 887) lists every record any entry
point names, the `front-page` id included, and `test:docs` refuses them, so
a front page that links a decision fails as the fork's did.
`PUBLISH_HELPER_ALLOW_RULES` (`packages/compiler/src/harness.ts` 1549 to
1552) names the update and planning publish helpers; the target publish
(`scripts/worktree.mjs` 1344 to 1380 and 1569, `publish WO-NNN
--target-worktree [--draft] …`) has none, and the fork's WO-028 verification
saw the classifier deny it. The fork's observation that an update's new rule
took effect only in a later session is consistent with the pages read on
2026-11-03, which say settings rules are resolved before the classifier and
say nothing of a mid-session re-read; WO-257's release line says to start a
new session. All three are WO-257 steps 15, 16 and 17.

### The record route (the fork's item 2.3): landed

WO-255-D006 (v0.118.0, closed 2026-11-06T01:11Z): `npm run worker -- record`
accepts `--host claude|codex`, `--model`, `--effort` and `--tree`, a named
option carries its host and effort, an unnamed model records as given with
effort `unknown` unless named, and `recordAgentReview` binds
`resolved.target?.worktree ?? root`, the target tree for a target order.
The fork's reproduction was run against v0.117.0; the answer names the
release.

### The red tags of 2026-11-03, corrected

The 2026-11-03 block disposed its 27 tags as "kept: reached from
README.md". Tonight's report shows that was wrong for 26 of them: the front
page's Map links directories (`/docs/product/`, `/docs/final-reviews/`), not
pages, so `README.md` itself was bound by the `front-page` entry point and
nothing it links reached `docs/README.md`, the four directory READMEs, the
template, the fifteen publication examples or the rest (`documentReport`:
`linkedFrom: []`, `bound: false` for each, read 2026-11-06). The 2026-11-03
pass read the report's `README.md` row as the 27 and did not check the
others; this pass binds each where it belongs (§Red tags). The six that
only the front page can reach wait for WO-257's front-page step, since
`docs-check` refuses a front-page change from a planning branch: this
pass's first commit linked them from `README.md`'s Map and was refused
(§Validation), and the page was reverted.

### The fork's two blocks against the record

Block of 2026-11-04 (v0.115.0): 1 recorded (WO-253's first instance
observation: `plan start` 0 h 0 min 30 s). 2 recorded: the fork struck the
update rule from its operator record and front page and named where it was;
nothing more asked. 3 → WO-257 step 16: the front page may link a record.
4 recorded: WS-002, a separate-track research workstream; its first driven
Codex order will be the router's first instance use. 5 → WO-257 step 15:
the warning names `status --refresh`. 6 → WO-257 step 13: the subject
includes separate-track members.

Block of 2026-11-05 (v0.117.0): 1 recorded. 2 → WO-257 step 17: the third
allow rule and the new-session line. 3 answered: WO-255-D006, v0.118.0.
4 → WO-257 step 13 (the same fix as 1.6). 5 → WO-257 step 11, reproduced
in this session. 6 → WO-257 step 14. 7 recorded: coding-standards passes
are the fork's own routine (its WS-001 rule 31); no kit change asked. 8 →
WO-257 step 12, with the operator's rule.

### The host's command block, read from this session

No published host page names the `<local-command-caveat>` block; its shape
is read from this session's own prompt and recorded in the ignored capture,
and WO-257's criterion 11 carries it as the fixture. If the host changes the
shape, the row is unclassified again and the next pass reads it (WO-257's
known issue).

## Orders filed and amended

- [WO-257](../../work-orders/WO-257-instance-returns-of-2026-11-03.md),
  amended: the title now spans 2026-11-03 to 2026-11-05; a second dated
  observed gap at `772979eac`; eight Design bullets with their rejected
  alternatives; steps 11 to 18 (the hook's block, the review batches, the
  subject's members, the retained lanes, `status --refresh`, the front
  page's record links, the third allow rule, and the front page's own two
  changes under the order's new `**Front page:** README.md` declaration)
  before the write-backs, the fork's block and the handoff (now 19 to 21);
  criteria 11 to 18 before the write-back and gate criteria (now 19 and
  20); the Preflight suites for each; WO-254 and WO-255 as closed
  dependencies; FUP-6dfaa29e3f0ba4fd and FUP-78158140c6ac12aa as carry-ins;
  the non-goals and the operator-review assumptions extended with the
  operator's decision of 2026-11-05. The five defect classes were
  screened: no criterion's subject is a count or a duration (the measured
  size is a printed output, the figures are in the Cost line and this
  document), none reads `HEAD` or a range, each names the fixture its step
  plants, the two host behaviors (the prompt shape, the allow rule) name
  their source and fallback, and no criterion contradicts a non-goal.
  `npm run work-orders -- index --check` passes with the one pre-existing
  advisory (WO-244 criterion 3's `git log`, read and left).
- No order filed. The separate hook order proposed mid-turn was withdrawn
  (§NoOps).

## Register

`followups --touching` over the ten files WO-257's amendment names and the
order: eight pending rows matched, read against their decisions.
FUP-6dfaa29e3f0ba4fd (WO-250-D010: the change review's budget and limits as
instance configuration) is allocated to WO-257 step 12 for its ceiling half,
with the remainder named in the carry-in. The other seven (FUP-005a8af5234cb3f3
the validator kit; FUP-048618f9ee2eb349 the target gate row; FUP-06090c778cc07685
the target repair lane; FUP-2ce66cf6a0602982 the other kit launches;
FUP-2fe2709d9b33c9e7 the linted range; FUP-589642d0e0c714c8 the near-miss
hint; FUP-770baf2f452c669e the entropy subject selector) matched a path only;
no condition fired and each stays as it is. The first page `plan start`
returned (FUP-0044, FUP-0045, FUP-0053, FUP-0055, FUP-0056, FUP-005a8af5234cb3f3,
FUP-0067, FUP-0068, all deferred) was read and left: no condition fired.
`followups --sync` after the map's candidates section of 2026-11-06 minted
its ten rows and surfaced five more untriaged rows, the follow-ups the four
closes since the last pass wrote instead of fixing in place; read against
their decisions: WO-254-D045 (the operator's direction of 2026-11-04 for the
next planning pass: the front page's Try it section points at the public
starter and recommends the two routes to start from it) is allocated to
WO-257 step 18, because this pass wrote the paragraph and `docs-check`
refused it, the front page being edited only by an order carrying the
`**Front page:**` declaration (§Validation); WO-246-D026 (a remote named `github` or a
cased `upstream`), WO-246-D027 (an SSH alias of github.com), WO-246-D030
(the invisible characters in `LEADING_GITMOJI`, owed to the next order that
edits `attribution.mjs` with its live episode) and WO-253-D041 (a prune
that stops on a restricted entry) are deferred with their conditions, since
their orders closed and no open order owns their files. One batch of
sixteen requests at revision `34a8000b…` (one allocation, seven declines,
three settled, five deferred) left revision `638dbbad…`; a second request
at that revision re-disposed WO-254-D045's row from settled to allocated
after the refusal, leaving revision `d1dbbc17…`; the feed then reads 0
untriaged.

## Red tags

<!-- dotln-red-tags:start -->

```json
{
  "after": "docs/planning/passes/recurring-failures-and-queue-drain-2026-11-03.md",
  "tags": [
    {
      "path": "docs/README.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: the documentation index; it links the directory pages since this pass, and the front page's Map link to it is WO-257 step 18's, because docs-check refuses a front-page change from a planning branch (this pass's first commit linked it and was refused, and the page was reverted); the 2026-11-03 disposition said it was reached from README.md and it was not (the Map links directories, not pages); unbound until WO-257's release"
    },
    {
      "path": "docs/discovery/local-inference.json",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "folded into the record kinds: declared a record in docs/control/documents.json by this pass (WO-027's dated observation of 2026-09-03); its standing summary docs/discovery/local-inference.md stays bound"
    },
    {
      "path": "docs/evidence/README.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/README.md's directory pages by this pass; bound when WO-257 step 18 links the documentation index from the front page"
    },
    {
      "path": "docs/final-reviews/README.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/README.md's directory pages by this pass; bound when WO-257 step 18 links the documentation index from the front page"
    },
    {
      "path": "docs/lineage/remining/README.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/README.md's directory pages by this pass; bound when WO-257 step 18 links the documentation index from the front page"
    },
    {
      "path": "docs/product/10-ir-compatibility.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: product 00's mention of it is a link since this pass; bound"
    },
    {
      "path": "docs/product/11-proteino.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "folded into the record kinds: declared a record in docs/control/documents.json by this pass (the pointer left at the old path by the 2026-09-04 move to 11-protino.md)"
    },
    {
      "path": "docs/publication/examples/commitSubject/balanced.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md, the guide product 08 links, by this pass; bound"
    },
    {
      "path": "docs/publication/examples/commitSubject/reader.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/commitSubject/record.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/prBody/balanced.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/prBody/reader.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/prBody/record.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/prTitle/balanced.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/prTitle/reader.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/prTitle/record.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/releaseNotes/balanced.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/releaseNotes/reader.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/releaseNotes/record.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/releasePage/balanced.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/releasePage/reader.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/examples/releasePage/record.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/publication/examples/README.md by this pass; bound"
    },
    {
      "path": "docs/publication/staleness-demonstration.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "folded into the record kinds: declared a record in docs/control/documents.json by this pass (the demonstration run of 2026-09-01)"
    },
    {
      "path": "docs/retired/README.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/README.md's directory pages by this pass; bound when WO-257 step 18 links the documentation index from the front page"
    },
    {
      "path": "docs/work-orders/TEMPLATE.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "kept: linked from docs/README.md's directory pages by this pass; bound when WO-257 step 18 links the documentation index from the front page"
    },
    {
      "path": "docs/work-orders/codex-downtime-series.md",
      "since": "docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md",
      "disposition": "folded into the record kinds: declared a record in docs/control/documents.json by this pass (the runbook of 2026-09-01 that WO-142 marked historical)"
    }
  ]
}
```

<!-- dotln-red-tags:end -->

The 26 are the 2026-11-03 block's tags raised again: that block's
dispositions said each was reached from `README.md`, and none was (§Readings).
This pass binds them where a reader looks: the documentation index
(`docs/README.md`) now links the evidence and final-review pages, the
re-mining well, the retired proposals and the work-order template, and the
front page's Map link to the index is WO-257 step 18's, because `docs-check`
refuses a front-page change from a planning branch (this pass's first
commit made that link and was refused; the page was reverted); product 00's
mention of the IR compatibility page is a link; the publication examples
guide lists its fifteen files; and four dated documents that were never
standing (an observation of 2026-09-03, a 2026-09-04 move pointer, a
2026-09-01 demonstration run, a 2026-09-01 runbook marked historical) are
declared records in `docs/control/documents.json`. `npm run plan --
documents` then shows six standing documents unbound (the index and the
five it links), bound at WO-257's release. No document was removed.

## NoOps

The map's candidates section of 2026-11-06 holds each in full as a
`NoOpIntent` with its evidence and reopening condition:

1. **A separate one-file order for the hook fix, placed first.** Proposed
   mid-turn on the operator's observation of 2026-11-05 (the capture above)
   that every planning session opens with `/model`; withdrawn on the
   operator's decision of the same session (every item into WO-257).
   WO-257 is first in the sequence since WO-253, WO-254, WO-246 and WO-255
   closed, so the fix lands at the same release either way. Useful if
   WO-257's first verification fails on the hook item alone and holds the
   rest.
2. **`plan refute --workstream WS-NNN`** (the fork's alternative in item
   1.6). Declined: a pass should not have to name what it filed; the
   subject lists separate-track members by itself (WO-257 step 13). Useful
   if a workstream's members must be judged apart from the sequence.
3. **Raising the brief ceiling.** Declined: it is a worker's context, and a
   later pass passes any figure (core's map alone is 946,832 bytes). Useful
   never on its own; the batches make the figure a batch size.
4. **A diff in place of a whole document in the brief.** Declined as the
   fix: the criteria adversary judges an order as written; admitted as an
   executor's option for a record such as the pass document whose whole
   text would fill a batch (WO-257's Design). Useful if a single order's
   text passes the ceiling.
5. **A decision reference as a rule's provenance** (the fork's alternative
   in item 2.6). Declined: WO-254-D010's point is that a rule enters a
   standing document only from the operator's own message; a decision is
   the executor's writing. Useful never; the retained lanes answer the
   case.
6. **A silent projection rewrite on every `status`.** Declined: status is
   read-only by contract and read-only roles run it; `--refresh` is
   explicit. Useful if the warning recurs after a refresh on an unchanged
   fold.
7. **Dispatch in a message of its own as the rule** (the fork's second
   alternative in item 2.5). Declined as the fix, kept as the workaround
   until WO-257's release: the kit adapts to the host. Useful if the host
   stops writing the block.
8. **The record route** (the fork's item 2.3). Nothing filed: WO-255-D006
   landed it in v0.118.0. Useful if a record names a host or a tree the
   worker did not have.
9. **The register's first page and the matched rows** (§Register). Read and
   left except FUP-6dfaa29e3f0ba4fd, allocated. Useful when a condition
   fires.
10. **The plan conditions** (five holding). Read and left with the
    2026-11-01 pass's deferrals, whose conditions name a cause or a reading
    above 9 s and 600 s, neither met tonight; WO-253's prune no longer
    pays in `plan start`. Useful when a reading crosses its figure.

**The trap meter** (`npm run meta` after the subject revision):
`drift-to-low-performance` is again the reopen candidate ("worsened over
three consecutive order deltas"): `coldStartBytes` 44,358, up 614 over the
last delta, while `gateStepCount` is 118, down from the 120 the 2026-11-03
pass read; `readAmplification` 0.48; `guardRefusals` 3; `operatorCorrections`
1 and `operatorDirections` 1 in the window. No order filed: the cold-start
bytes rise with each reviewed rule the closes added to the roles (WO-254's
and WO-255's, each under its recorded acceptance in `budgets.json`), and the
step count fell. Useful when a role breaches its ceiling with no acceptance
recorded, or when the count rises across the next three closes.

## Sequence

WO-253 (v0.115.0), WO-254 (v0.116.0), WO-246 (v0.117.0) and WO-255
(v0.118.0) left the list as closed. WO-257 first, amended (the fork's
returns of 2026-11-04 and 2026-11-05 and the operator's rule ride with the
returns of 2026-11-03, and every planning session pays the hook's defect
until it lands); then WO-242, WO-243, WO-244, WO-083, WO-207, WO-193,
WO-183, WO-088, WO-091, WO-096, WO-014, unchanged. Serial order stays the
operator's direction of 2026-10-13; the rules and the Focus are unchanged.

## Write-backs

- Product 07 §Operator-opened planning pass: the prompt hook reads past
  nothing but blanks and one fence today, so a slash command in the same
  message leaves the session without a role until WO-257, with the
  workaround; the default pass scope's subject is the sequence's orders and
  a separate-track member is outside it until WO-257. §Verification review
  and attack: the operator's rule (a review is split, never refused, and a
  subject is never narrowed to fit a reviewer) and the helper's ceiling
  until WO-257.
- Product 06: the rung names the four releases since v0.114.0 and the work
  after v0.118.0.
- `docs/README.md` (the directory pages), product 00 (one link),
  `docs/publication/examples/README.md` (the fifteen files),
  `docs/control/documents.json` (four record kinds): §Red tags.
- `docs/README.md`: the directory pages it links (§Red tags). The front
  page's two changes (the Map's link to the documentation index; the Try
  it paragraph of WO-254-D045, the operator's direction of 2026-11-04 for
  this pass) are WO-257 step 18's under its `**Front page:** README.md`
  declaration, since the page is edited only by such an order.
- The sequence; the map (the pass paragraph, WO-257's catalog row, the
  candidates section of 2026-11-06); the idea ledger's registration; the
  generated index and history page; the lineage index and the two
  publication tables of contents, regenerated by `npm run sync`.

## Rules recorded

<!-- dotln-rules-recorded:start -->

```json
[
  {
    "rule": "A review of a planning subject is never refused or narrowed for the subject's size: a brief past a worker's context is split into batches over more workers, every document the pass changed is reviewed, and no pass withdraws an amendment to fit a reviewer.",
    "document": "docs/product/07-execution-guide.md",
    "section": "Verification review and attack",
    "message": {
      "sessionKey": "e0823b0ab5105395fc03a8aef13bbf01249e60da3cd71be975be264a2e088b87",
      "recordedAt": "2026-11-06T01:48:36.891Z"
    },
    "captureDigest": "sha256:8c2abb3ce38557c635cab499e9549af43b3d774fc3327f47bb68c539ad23a5c2"
  }
]
```

<!-- dotln-rules-recorded:end -->

The entry names the dispatch message's journal row, which the hook classed
`unclassified` because of the host's command block (§Readings), so the
entry carries no `class`; the rule is the planner's synthesis of the
operator's item 3 and is named in the items table's inference column.

## Answers to the fork (paste-ready)

```text
Answers from core's planning pass of 2026-11-06 (docs/planning/passes/fork-returns-and-review-batches-2026-11-06.md) to the DotLn-Enterprise-Starter fork's blocks of 2026-11-04 (starter v0.115.0) and 2026-11-05 (starter v0.117.0). Read each against the record it names. Core closed WO-253 (v0.115.0), WO-254 (v0.116.0), WO-246 (v0.117.0) and WO-255 (v0.118.0) since its block of 2026-11-03. Core's queue after this pass: WO-257 (amended, first), WO-242, WO-243, WO-244, then the rest. Every ask below that is filed is in WO-257, on the operator's direction; none blocks your next order, and each names its route until the release that carries WO-257.

Block of 2026-11-04.
1. Recorded; nothing asked. Core's own plan start measured 0 h 1 min on v0.118.0 against 0 h 17 min on v0.114.0.
2. Recorded; nothing asked.
3. Filed in WO-257 step 16: the front-page entry point's record links are admitted; the four session entry points stay standing-only. Until then your reworded link stands.
4. Recorded; nothing asked. Core will read your first driven Codex research order's outcome in your next block.
5. Filed in WO-257 step 15: the warning names npm run resume -- status --refresh, which rewrites docs/control/current.md from the fold and appends no event; without the flag status stays read-only. Your WO-033 route stands until then.
6. Filed in WO-257 step 13: the judged subject lists the sequence's orders and then the open members of every track: separate workstream, so a receipt names them and amend-order admits them; no --workstream flag. Until then an authorized change to a separate-track order takes product 07's never-judged route (the authorization in its decisions, then the ordinary checks), which is what your WO-028-D043 did.

Block of 2026-11-05.
1. Recorded; nothing asked.
2. Filed in WO-257 step 17: Bash(node scripts/worktree.mjs publish *) joins the two emitted rules, and the release's Read before upgrading says a new session reads the emitted settings when a release changed them. The operator's acceptance of the amended order is the rule's authorization, as WO-246-D010 was for the first two. Until then the target publish is yours by hand.
3. Landed in v0.118.0 (WO-255-D006): npm run worker -- record takes --host claude|codex, --model and --effort for what ran (a named option carries its host and effort; any other model records as given with effort unknown unless named) and --tree for the reviewed tree, and a target order's record binds the target worktree. Your reproduction ran on v0.117.0; take v0.118.0 when the operator asks for it in a session.
4. Filed in WO-257 step 13 (the same fix as item 6 above). Your WO-028-D043 route is the right one until then.
5. Filed in WO-257 step 11, and reproduced in core's own session of 2026-11-06: the hook reads the dispatch from the first content line, and Claude Code puts a slash command's output block before the operator's text, so every core planning session since 2026-10-29 was journaled unclassified too. The reader will skip the host's command block. Until then, send the dispatch as a message of its own, or send a bare planning: line after it, which resolves the role mid-session (core did so tonight).
6. Filed in WO-257 step 14: checkRulesRecorded reads the live journal, then every retained lane's harness/<sessionKey>.jsonl, and an entry may name order to point at the lane; a refusal names both places read. A decision reference as provenance is declined: the rule's point is the operator's own message. Until then your prose beside the block is the record.
7. Recorded; nothing asked.
8. Filed in WO-257 step 12, with the operator's rule: a round's documents are those changed since the round's base; a brief past the ceiling is split into batches over more workers, each carrying the round's document index and reading the rest in the checkout, with one merged report per round; the refusal and the dry run print the measured size, the ceiling and the batch plan. The ceiling is not raised and a diff never replaces an order's text. Until then, run the review before editing the map and the pass document, or withdraw nothing and record the refusal with its size.
```

## Process cost

Model and effort: Fable 5.1 at max, operator-selected (CLAUDE_EFFORT=max;
the `/model` line of the session). Usage at entry: unknown (`harness usage`
reported `no-session`: the dispatch row carried no role, §Readings); at
01:58:57Z, after the operator's bare `planning:` resolved the role:
234,350 total tokens (205,646 cached input, 23,861 cache write, 4,841
output; source `claude-transcript-message-usage`, scope dispatch, cost
unknown); the exit reading is in §Validation. Subagents: budget 20
(`subagentCap`); the plan stated before the first spawn: one refuter
(`dotln-worker`, claude-opus-5-5 at xhigh, the Claude default; the dispatch
line names no fable worker), launched once with no re-task; in the event
two launches, the first stopped by this session after about 0 h 5 min when
the document gate refused the committed subject's front-page edit and the
subject had to change (its judgment was not read), the second on the
corrected subject; no review worker (the dispatch carries no `reviewed` label and WO-244's routine is not
landed; the helper's ceiling against this pass's own subject is measured in
§Validation with `--dry-run`, which launches nothing). Wall-clock of the
pass's commands: `plan start` about 0 h 1 min; the rest in §Validation.
Against the NoOp of doing nothing: every planning session keeps losing its
role to the host's command block, and every pass that edits the map keeps
being refused a review, until WO-257 lands.

## Validation

Recorded in order as the pass ran them; the figures after the commit are
appended when observed.

- `npm run plan -- start fork-returns-and-review-batches`: admitted in
  about 0 h 1 min (failures, reader scores, conditions 0 h 1 min, census,
  prune 11 removed, branch); the branch and skeleton written by the command;
  its register page and red tags read from its output.
- `harness usage`: `no-session` until 01:57:51Z; the standing above after.
- The compiled reader (`packages/compiler/dist/src/harness.js`,
  `harnessPromptLine` and `operatorMessageClass`) run on the bare dispatch
  and on the dispatch behind this session's command block: §Readings.
- WO-257 amended by one scripted batch of nineteen anchored replacements
  (each anchor asserted unique before any write); `README.md`, product 00,
  `docs/control/documents.json` and the publication examples guide edited
  in the same way; `documentReport` then shows `unbound 0`.
- `npm run work-orders -- index` and `index --check`: pass; one
  pre-existing advisory (WO-244 criterion 3's `git log`), read and left.
- `npm run plan -- followups --sync`: fifteen untriaged rows (ten minted
  from the map's candidates section of 2026-11-06, five from the closes'
  decisions); `--export` to the session scratch at revision `34a8000b…`;
  `--apply` of the sixteen-request batch from the session scratch left
  revision `638dbbad…` (§Register).
- `npm run meta`: green; the trap meter's reopen candidate read and
  disposed in §NoOps. `npm run format`: unchanged. `npm run sync`: the
  publication edition regenerated (the lineage index and the two tables of
  contents). `npm run publication:check`: PASS (256 of 256 product headings
  indexed; the two tables of contents current).
- `npm run plan -- check` at the workspace: "planning pass
  planning-92d06e6e83aa82b0 needs a receipt", which the refutation receipt
  supplies; `git diff --check` clean.
- First commit `178e58d81`; `npm run test:docs` at it: 10 passed, 17
  failed, 0 h 2 min, every failure `docs-check`'s or downstream of it:
  `README.md` changed outside its generated blocks on a branch naming no
  work order (the front page is edited only by an order carrying the
  `**Front page:**` declaration), and its two placeholder lines read as
  raw HTML. Corrected: `README.md` reverted to `main`; WO-257 carries the
  declaration and a front-page step 18; the directory pages are linked
  from `docs/README.md`; the register row of WO-254-D045 re-disposed as
  allocated (`d1dbbc17…`); this document corrected in §Readings, §Red tags,
  §Register and §Write-backs.
- The refuter launched on `178e58d81` was stopped by this session after
  about 0 h 5 min, since its subject could no longer be filed.
- `npm run worker -- review --kind criteria --host codex --subject planning
  --dry-run` at `178e58d81` (launches nothing): the brief measured 120,955
  characters, under the ceiling; it inlined the pass document, the
  sequence, the generated index and WO-257 and pointed at the map and the
  history page as documents over `MAX_DOCUMENT_BYTES` (§Readings).
- Second commit `c1830c0f3`; `npm run test:docs` at it: 25 passed, 2
  failed, 0 h 2 min; the two (`plan` and `plan-refutation-current`) fail
  only on "planning pass planning-92d06e6e83aa82b0 needs a receipt".
- `npm run plan -- refute` at `c1830c0f3` printed the canonical prompt
  (132,498 bytes; one order judged, WO-257). One fresh `dotln-worker`
  (claude-opus-5-5 at xhigh, the Claude default) judged it from the prompt
  file in the session scratch alone, reading no repository file and running
  no command: 0 h 6 min, 127,712 tokens and three tool uses by the host's
  usage; `aligned-with-findings`, no holds, twelve known issues. Its
  statement is kept in the ignored lane
  `docs/control/local/planning-2026-11-06/judgment-1-statement.txt`. This
  judgment is not filed: four of its findings are defects of this pass's
  own amendment and were integrated before the receipt, as the reviewed
  route integrates its reviewers' findings and refutes the integrated
  subject: criterion 4's `None.` case now excludes a release that triggers
  another standing line (its finding 3); criterion 12 and the batches
  bullet say a round records its merged report only when every batch
  returned one and that each worker reads the other batches' documents
  through the index (finding 7); criterion 11 and the dispatch-line bullet
  journal a leading element the reader does not know by name (finding 9);
  the objective names gate P's WO-083 and gate S's update vehicle (finding
  11). The other eight are the executor's and go on WO-257's catalog row
  with the second receipt's. The integrated subject was committed and
  judged again by a fresh refuter (below).
