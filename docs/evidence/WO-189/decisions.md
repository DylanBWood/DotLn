# WO-189 decisions

## WO-189-D001

```json
{
  "id": "WO-189-D001",
  "date": "2026-10-09",
  "dispatch": "resume: next; the front page is owned, not appended to",
  "decision": "The front page changes only through an order whose leading header carries the typed field `**Front page:** README.md`. The document check (`scripts/docs-check.mjs` frontPageFindings) reads `docs/control/front-page.json` and the order's header at the merge base with main, so neither a record edit nor a header field added on the branch itself can switch the guard off; it masks the page's generated blocks, compares the working tree with the base and refuses any other difference, including a changed record. It also holds What runs today to its recorded line budget with one sentence per line (a line without a terminator or with two sentences is refused), admits nothing but blank lines and generated blocks between the heading and the opening marker, refuses a generated block that never closes, and refuses a work-order identifier, decision identifier, date or version anywhere outside a generated block. When the base page has no section markers yet, the branch is installing the guard and only the shape, budget and identifier screen are judged; without any record nothing is judged, so repositories and fixtures without a guarded page are untouched.",
  "evidence": [
    "scripts/docs-check.mjs frontPageFindings and readFrontPageControl; scripts/lib/front-page-scope.mjs frontPageDeclaration, which reads the leading header through dependencyHeader and nothing from the criteria's prose",
    "scripts/test-docs-check.mjs: refused without the field at the base, admitted with it, refused when the field is added on the branch alone, refused on a branch naming no order, the generated block's version line free to change, a deleted or edited record refused and the base's record still applied, a record that reuses the section markers or opens a block that never closes refused, the budget held with blank lines uncounted, two sentences on one line and a line without a terminator refused, prose above the opening marker refused, identifiers, dates and versions outside generated blocks refused, nothing judged without any record, the bootstrap and no-merge-base paths covered, and the same undeclared change admitted by the check at 08845c71 (git archive of that commit run beside this checkout's node_modules)",
    "this order's own header carries no `**Front page:**` field; the bootstrap case (no markers at the base) is what lets the page that installs the guard pass its own check once. A second line holds too: with the field added to this order's header on this branch, `npm run plan -- check` exited 1 with `planning pass needs a receipt matching the current subject: existing work-order bytes changed` (probe of 2026-10-10, the bytes restored and verified by digest), and that check runs in `npm run test:docs` on every branch",
    "docs/product/07-execution-guide.md §Documentation freshness and ownership and docs/PLAYBOOK.md §The loop, per work order now say in place which order may edit the front page, within what budget, and where any other order's proposed sentence goes"
  ],
  "rationale": "Traps weighed before choosing: rule beating, where an order escapes by deleting the markers, editing the record, registering a bogus generated block or adding the field on its own branch, is closed because the record and the header are read at the merge base and a page whose base carries the markers must keep them; naive interventionism, where the check would also judge planning branches that never touch the page, costs nothing because an unchanged page is never refused; the NoOp, prose alone, is the fifteen-sentence rule that two prunes did not hold. The bootstrap case is bounded to the one state where the base lacks the markers, which after this merge no branch can reach without first failing the shape check. The self-review's adversary and improver each found the working-tree reads independently; both were fixed before handoff.",
  "rejected": [
    {
      "option": "Read README.md from the acceptance criteria's prose",
      "reason": "The 2026-10-07 pass replaced every prose-read criterion with a typed input, and the four queued orders already carry the typed field."
    },
    {
      "option": "Add the typed field to this order's header",
      "reason": "A header edit to a judged order needs an operator-authorized execution amendment that nobody can grant in this dispatch; the bootstrap condition makes the amendment unnecessary and expires with this merge."
    },
    {
      "option": "A byte ceiling on the page like the product documents",
      "reason": "A size bound invites trimming around it; ownership plus a sentence count the operator sets by choosing a candidate is the bound this order's design named."
    }
  ],
  "reopenWhen": "An order changes the page outside its generated blocks without the field and the gate passes, or a declared order cannot make its promised sentence within the budget, or the planning continuation check learns to admit a typed header field so the bootstrap case can be retired."
}
```

## WO-189-D002

```json
{
  "id": "WO-189-D002",
  "date": "2026-10-09",
  "dispatch": "resume: next; the operator chose candidate-1200 during execution and directed the section rewrite and the vision ordering",
  "decision": "README.md is docs/evidence/WO-189/candidate-1200.md outside the generated version line, by the operator's choice recorded during this dispatch (paraphrased: the shortest candidate is good for now and the choice may be revisited by a later work order). The operator then directed two changes to that candidate, both applied: What runs today is written for a reader as a short account of what the software does, not one line per order, interesting rather than exhaustive, because the appended version had become unreadable to the person most invested in the repository; and the page follows the vision document's order, opening with the Poincaré via Pirsig quotation and placing the shelf quotation in the third paragraph. The section now holds seven sentences, one per line, and the budget in docs/control/front-page.json is nine. The other two candidates stay in the evidence directory as the scored alternatives; a swap would change the page, the candidate named in the control record and the budget, nothing else.",
  "evidence": [
    "four scoring rounds, each a fresh reader and a fresh scorer. Round one (reader-scores-round1.json, the candidates as checkpoint 3 held them): candidate-1200 12/12, candidate-2000 12/12, candidate-3000 12/12. Round two (reader-scores-round2.json, after the self-review edits): 12/12, 11/12 (q2 scored 1), 12/12. Round three (reader-scores-round3.json, candidate-1200 alone after the operator's direction): 11/12, q2 scored 1 because the reader named only the babysitting audience. Round four (reader-scores.json, after one opening sentence named the owner audience): 11/12, q2 now 2 and q3 scored 1 although the What runs today text was unchanged between rounds three and four, where it scored 2. The rounds agree on every other question; the q3 difference is reader and scorer variance on unchanged text, not a change in the page, and the operator's choice, not the score, selects the page. Every quoted line in rounds two to four occurs in its candidate (quotesFound). Raw CLI output for each run in reader-runs/",
    "each reader was a fresh Claude Code print run (claude 2.1.296) in an empty directory with tools disabled, only project-scoped settings sources and the default system prompt replaced, given one candidate and the six questions; each scorer was such a run given the key and the reader's answers and quotes, never the page; modelUsage readback claude-opus-5-5 for all sixteen runs; effort is the launch flag xhigh because the CLI reports no effective effort; total cost of the sixteen runs 1.83 USD (0.76, 0.63, 0.22 and 0.22 by round)",
    "prose word counts (code blocks, tables and comments excluded), measured after the last edit: README.md and candidate-1200 1,725 (1,454 before the review and operator edits); candidate-2000 2,421; candidate-3000 3,513; the page they replace 4,965. The order's targets of about 1,200, 2,000 and 3,000 were estimates; the 90 blocks the inventory keeps set a floor of about 1,400 words, since each candidate carries the epigraph, the loop, the five compiled rules, the nine bets, the horizons, the map and the resume phrases, and the operator's additions (the Poincaré quotation, the audience sentence, a fuller Try it) added the rest",
    "checkpoint order: refs/dotln/checkpoint/WO-189/2 (reader-key, 2026-10-10T02:27:11Z) holds reader-key.json and no candidate; refs/dotln/checkpoint/WO-189/3 (candidates, 2026-10-10T02:41:40Z) holds all three"
  ],
  "rationale": "The candidates differ in section order and in how What runs today is told: the middle one walks the loop stage by stage with a lead word per line, the longest follows one piece of work through the machinery, and the chosen one, after the operator's direction, tells a reader in seven sentences what they can hand the system and what happens to it. Every candidate keeps the operator-authored shelf quotation verbatim and the kept material in its own words; no candidate carries a work-order identifier, decision identifier, date or version outside the generated line, which docs/evidence/WO-189/inventory-check.mjs proves for each. The operator's second concern, that later orders would append to the section as before, is answered by the budget: a declared order adds a capability only by rewriting or merging within nine lines, and every other order is refused (D001).",
  "rejected": [
    {
      "option": "Wait for the operator's choice before committing any page",
      "reason": "The order names the fallback for exactly this case and the final review presents the three with their scores."
    },
    {
      "option": "Trim the shortest candidate to 1,200 words by dropping kept material",
      "reason": "The order fixes which parts stay in every candidate; cutting them would answer a word target with a worse page."
    }
  ],
  "reopenWhen": "A later work order revisits the choice, as the operator allowed, or a reader of the committed page reports it as a log again, or the three queued orders that each promise one sentence find the budget of nine too tight to fold their sentence into the existing prose."
}
```

## WO-189-D003

```json
{
  "id": "WO-189-D003",
  "date": "2026-10-09",
  "dispatch": "resume: next; the inventory classes every block and proves its anchors",
  "decision": "The inventory classes all 131 top-level blocks of README.md at c676909066d278c92cacd94d998a42a8fb5d4a9a (39,030 bytes, 661 lines; a list counts one block per item): 90 keep (22,961 bytes), 1 move (2,638 bytes, the test-runner and toolchain paragraph, now CONTRIBUTING.md §Toolchain and tests), 40 cut (13,224 bytes). Each moved or cut block names the document that holds its facts and one or more literal anchor phrases that inventory-check.mjs finds there after collapsing whitespace; keep rows name anchors the page must carry and, where a kept paragraph held receipts, the documents those receipts already live in.",
  "evidence": [
    "node docs/evidence/WO-189/inventory-check.mjs: PASS with 0 failures against README.md; the same command with --readme judges each candidate",
    "the release block at the base measured 8,535 bytes and 46 sentences by terminator count; 154 of 200 first-parent merges on main changed README.md (git log --first-parent --merges -- README.md)",
    "stale statements removed with the page: a map naming three of six packages (beacons, browser-evidence and compiler were missing), a console called read-only, a link to the plan of 2026-09-06 as the way ahead, and a sentence calling the compiled planning reviewer a drafted order when the Entropy Reducer shipped as a compiled role",
    "the maintainer comment and the fifteen-sentence rule are gone from the page, product 07 and the playbook; the rule they stated is now the document check"
  ],
  "rejected": [
    {
      "option": "Judge criterion 1 by matching prose between the page and the destinations",
      "reason": "The candidates are written in their own words by design; literal anchors on facts are what the order says the criterion is judged on."
    },
    {
      "option": "Class every receipt paragraph as move and copy its sentences into evidence READMEs",
      "reason": "Each receipt already links the evidence that holds it; copying prose would add a second home for the same fact."
    }
  ],
  "reopenWhen": "A destination document drops an anchored fact, or a later front-page order reclasses a block."
}
```

## WO-189-D004

```json
{
  "id": "WO-189-D004",
  "date": "2026-10-09",
  "dispatch": "resume: next; the candidates and the page share one link form",
  "decision": "The candidates and the page write every repository link relative to the repository root with a leading slash, so README.md is the chosen candidate byte for byte outside the generated version line and the three candidates pass the document check's link rule from docs/evidence/WO-189/ without any new machinery.",
  "evidence": [
    "scripts/docs-check.mjs linkFailures resolves a leading slash against the repository root, and the forge renders such links against the repository root",
    "node scripts/docs-check.mjs: every link in README.md and in the three candidates resolves",
    "the alternative, a per-document link-base directive in the document check, would have added a rule to the check and left the page one line different from its candidate"
  ],
  "rejected": [
    {
      "option": "Plain relative links in the page and broken links in the evidence copies",
      "reason": "The document check refuses a broken link, and declaring seventy historical exceptions for three new files misuses that baseline."
    },
    {
      "option": "Candidates with links relative to the evidence directory and a rewrite step on install",
      "reason": "The page would no longer be the candidate, and the rewrite would be one more generator to own."
    }
  ],
  "reopenWhen": "A reader tool the operator uses fails to resolve a root-relative link, in which case the next front-page order picks the convention again."
}
```

## WO-189-D005

```json
{
  "id": "WO-189-D005",
  "date": "2026-10-09",
  "dispatch": "resume: next; the release block holds one generated line",
  "decision": "`release prepare` writes the release block as exactly the line `This source prepares DotLn \\`vX.Y.Z\\`.`, normalizing blank lines and older wording, and refuses when more than one non-empty line stands between the markers rather than deleting prose under a retime. `release check-surfaces` refuses any content between the markers other than that exact line for the expected version. The worktree integration's README normalization is unchanged and reconciles the one line across a merge where both sides changed it.",
  "evidence": [
    "scripts/lib/release-preparation.mjs releaseClaimLine and planReleasePreparation; scripts/release.mjs releaseBlockRule",
    "node --test scripts/test-release-preparation.mjs: 16 passing, including the new case where a second line refuses before any write and a one-line block in older wording is rewritten; the fixture's blank line and older wording are normalized",
    "scripts/test-worktree-integration.mjs: the new case first asserts that main's and the subject's one-line blocks differ, then that the integrated page holds exactly the generated line carrying the heading's version; the fixture writes a minimal front page with the one-line block instead of copying the live page, so the suite does not follow every front-page edit",
    "scripts/test-release.sh covers the rule's two new refusals (a second line between the markers; words beside the claim on its line) with the exact messages; scripts/test-release.sh, scripts/test-worktree.sh and scripts/test-concurrent-control.mjs fixtures spell the generated wording, and their existing assertions on the version-mismatch messages still hold because the line count and the version are judged before the wording",
    "untested and inferred: an in-flight branch whose base and own page carry the old multi-line block, merging a main that carries the one line, resolves to the one line because the normalization masks the version on all three sides and the branch's block is unchanged against the base, so Git takes main's side; the integration suite's fixture derives both sides from one seed and cannot stage that history without a new fixture"
  ],
  "rationale": "The trap weighed was silent loss: a prepare that rewrote a multi-line block to one line would discard an author's sentence under a routine retime; refusing names the text and leaves it to be moved. Pinning the exact wording in the rule closes the smuggled-sentence case where a long single line passes a count-and-version rule.",
  "rejected": [
    {
      "option": "Have release prepare rewrite a multi-line block to the one line",
      "reason": "It would delete prose silently during a retime; the surfaces check already fails such a block, so the author learns and moves the text."
    },
    {
      "option": "Judge only one non-empty line with one version, not the wording",
      "reason": "A sentence appended on the claim line would pass; the generated wording is the only content the block is for."
    }
  ],
  "reopenWhen": "A release surface needs a second generated line in the block, or the integration normalization meets a block it cannot reconcile."
}
```

## WO-189-D006

```json
{
  "id": "WO-189-D006",
  "date": "2026-10-09",
  "dispatch": "resume: next; the register row and the operator's choice at close",
  "decision": "Register row FUP-84bc6f15abd1e45f stays allocated to WO-189 through execution; its retarget is the final review's action by the order's own criterion 7 wording (at close). The reviewer runs `npm run plan -- followups --show FUP-84bc6f15abd1e45f`, then applies a settled disposition through `npm run plan -- followups --apply <request.json>` naming this decision, the committed page and the document check, with reopenWhen: a reader of the front page reports it as a log again. The reviewer also presents the three candidates with their scores so the operator can pick; a swap replaces README.md, the candidate named in docs/control/front-page.json and its budget, then runs `npm run release -- prepare --local` so the version line is the mechanism's.",
  "evidence": [
    "docs/planning/followups.json: FUP-84bc6f15abd1e45f disposition allocated to WO-189 with reopenWhen naming withdrawal or a close that returns the item",
    "docs/work-orders/WO-189-front-page.md criterion 7 and design: the operator chooses at final review; if no choice is recorded by handoff the shortest full-score candidate is committed"
  ],
  "rejected": [
    {
      "option": "Dispose the register row during execution",
      "reason": "The row's reopening condition names this order's close; disposing it before verification would record an outcome that has not occurred."
    }
  ],
  "reopenWhen": "The final review cannot apply the disposition because the register moved, or the operator declines all three candidates."
}
```

## WO-189-D007

```json
{
  "id": "WO-189-D007",
  "date": "2026-10-10",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.73.2, the next patch above the observed release baseline v0.73.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.73.1 (local tags)",
    "patch classification declared in docs/work-orders/WO-189-front-page.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-189-D008

```json
{
  "id": "WO-189-D008",
  "date": "2026-10-09",
  "dispatch": "resume: next; the page's commands run as written",
  "decision": "Every runnable command the page shows was run on this host as written, under node scripts/harness.mjs bounded: `npm install` (exit 0, lockfile unchanged); `npm run skeleton` (exit 0; the numbered timeline, the glyph line and `verified=true candidates=1`, kept in commands/npm-run-skeleton.txt); `npm run console -- board` (exit 0; an excerpt of its 21,560 lines in commands/npm-run-console-board.txt); and `npm run dotln -- intent \"Describe the work\"` (exit 0; it built the packages and printed `Filed draft WO-900: docs/work-orders/derived/WO-900-derived.md`, kept in commands/npm-run-dotln-intent.txt). The draft that run filed, with its control segment docs/control/orders/WO-900.jsonl holding one WorkOrderIdentityAllocated event recorded 2026-10-10T03:22:10.769Z, was removed as scratch in the same minute; the indexes were regenerated and checked and canonical status names no WO-900. The page names the resident, vertical and publish capabilities as commands of the `dotln` and worktree tools rather than as runnable lines, because each needs arguments; their evidence is the skeleton README's runbooks and the linked verification records.",
  "evidence": [
    "docs/evidence/WO-189/commands/npm-run-skeleton.txt, npm-run-console-board.txt and npm-run-dotln-intent.txt",
    "an earlier probe, `node packages/skeleton/dist/src/dotln.js intent --help`, printed no help and filed a draft from the words --help; that draft and its segment (one WorkOrderIdentityAllocated event recorded 2026-10-10T03:00:02.832Z) were removed the same way, their digests were not kept, and the ignored local derived-order lane holds no record of either allocation (its events file is empty)",
    "npm run work-orders -- index --check passes after each removal; npm run resume --silent -- status --json names no WO-900"
  ],
  "rejected": [
    {
      "option": "Keep a filed draft as a derived order",
      "reason": "Its objective is the page's example text or the word --help; it is scratch from a proof, not work, and nothing activated it."
    },
    {
      "option": "Show the intent command in prose only, to avoid filing a draft",
      "reason": "A reader who tries the page should be able to run what it shows; one scratch filing, recorded and removed, is the cost of proving that."
    }
  ],
  "reopenWhen": "The intent command gains a help or dry-run flag, or a shown command stops running as written on this host."
}
```

## WO-189-D009

```json
{
  "id": "WO-189-D009",
  "date": "2026-10-10",
  "dispatch": "resume: next; completion advisory on the follow-up rows this change touches",
  "decision": "Of the 18 pending follow-up rows that name a file this change touches or WO-189 (npm run plan -- followups --touching, read after implementation-ready), two name this order's seam and are left to the final review by their own wording: FUP-84bc6f15abd1e45f, allocated to WO-189 and settled at close (D006), and FUP-8111fc3dd4c22331, the dated log in the documentation map, deferred until WO-189 closes so that this order's inventory method can be applied to docs/README.md; neither is fixed here, since the first records this order's outcome and the second names a file outside this order's scope. The other sixteen match a path without sharing a seam this change opened (the document check, product 07, the release script and its shell suite, the page, the playbook and the control projection) and are left as they are. One row is answered in passing: FUP-c24585c3b7bebf38 recorded the removal of an unused runGit import from scripts/docs-check.mjs, and this change imports runGit again because the front-page check reads the merge base through it.",
  "evidence": [
    "npm run plan -- followups --touching at register revision 4f4ff0dd91b32865493d2474ef7761dfa91cda5d1043ea24c92471c868c221f7: 246 pending, 18 matched over three pages",
    "FUP-8111fc3dd4c22331 disposition: deferred, reopenWhen WO-189 closes or the file passes 25,000 bytes (docs/planning/standard-pass-2026-10-02.md section 11)",
    "the remaining rows: FUP-0a7c93eed06727ce, FUP-1315c82ef74fb832, FUP-67a07b670440cf5a, FUP-f1c7a256bec46737, FUP-fb8cbeabbddef397, FUP-8cfd3ff52146a016, FUP-acfe4bfda716d8fb, FUP-c95ffe4a84e49cbb, FUP-da471832071118c7, FUP-fd05316b6030ef73, FUP-079f827e1b11eb1e, FUP-4c4ad5ef3c88547f, FUP-749c959a41178a3b, FUP-bd3e66761dc301ed, FUP-cc27c2c1a82fed2c, FUP-fb2a080cc9b597d0, FUP-c24585c3b7bebf38"
  ],
  "rejected": [
    {
      "option": "Apply the inventory method to docs/README.md in this order",
      "reason": "The documentation map is outside this order's files, and the register row defers it until this order closes so its method can be reused deliberately."
    }
  ],
  "reopenWhen": "The final review finds a listed row whose seam this change opened and that this decision leaves unaddressed."
}
```

## WO-189-D010 — Verification: the section budget can be bypassed

```json
{
  "id": "WO-189-D010",
  "date": "2026-10-10",
  "dispatch": "resume: verify; independently attack criterion 5",
  "decision": "Record F1 as blocking criterion 5. A declared front-page order can append twelve running-capability sentences immediately below the closing marker within What runs today, put the marker pair before the heading, or place thirteen sentences on one counted line using lowercase sentence starts; frontPageFindings reports no failure in all three cases. A minimal repository also passes the full checkDocs entry point with thirteen running-capability sentences under the heading against the unchanged nine-line budget. The verifier preserves the implementation and records a failed verdict.",
  "evidence": [
    "docs/evidence/WO-189/verify-001/front-page-probes.mjs and front-page-probes-result.json: the real current page and record are exercised in synthetic main/wo-999 repositories; four expected refusals are missing, including the full checkDocs reproduction",
    "scripts/docs-check.mjs frontPageFindings: markedLines counts only the marked interior; the heading check runs only when markerAt > headingAt; the multiple-sentence expression recognizes only selected uppercase or punctuation starts",
    "the six affected existing docs-check fixtures passed, including the historical 08845c71 comparison; their cases do not cover these variations",
    "docs/evidence/WO-189/self-review.md adversary F3 and improver I2 were marked fixed, but the independent variations reproduce the same budget failure outside the cases repaired"
  ],
  "rationale": "Rule beating changed the verification plan: probe marker placement and sentence starts instead of treating a passing fixture as the complete contract. The NoOp, consuming the standing passing gate alone, would miss the observed counterexamples. The repair rule is the existing criterion: keep the marked current-capability section under its unchanged budget, require its markers to belong to the heading in order, and prevent extra sentences from escaping the count. Preserve the chosen page's deliberate not-built disclosure and ordinary declared edits elsewhere.",
  "rejected": [
    { "option": "Pass because the existing fixtures are green", "reason": "The independent inputs pass the document check while exceeding the section budget that criterion 5 requires." },
    { "option": "Repair the implementation during verification", "reason": "The verifier judges read-only implementation bytes; a repair belongs to resume: fix and a new verification." }
  ],
  "followup": "WO-189 repair F1: close the reproduced marker-placement and same-line sentence bypasses in scripts/docs-check.mjs with fixtures, preserving the declared scope and nine-line budget.",
  "reopenWhen": "The repair's own probes refuse every recorded bypass while the unchanged and authorized cases still pass."
}
```

## WO-189-D011 — Verification follow-up: legacy wording survives a no-op prepare

```json
{
  "id": "WO-189-D011",
  "date": "2026-10-10",
  "dispatch": "resume: verify; vary the release-preparation target state",
  "decision": "Board F2 as a nonblocking follow-up. With target v0.73.2, latest tag v0.73.1 and the admitted legacy line This source prepares `v0.73.2`., planReleasePreparation returns edits: [] and leaves that wording unchanged. On a version collision, the same input is normalized to the generated DotLn line and only the block changes. The current subject already has the canonical line, and the required write and refusal cases pass, so criterion 4 is met; this finding concerns consistency of the accepted legacy-input and no-op paths.",
  "evidence": [
    "docs/evidence/WO-189/verify-001/release-line-probes.mjs and release-line-probes-result.json: legacy line with available target has zero edits and exactGeneratedLine false; both collision cases have exactGeneratedLine true and outsideUnchanged true",
    "scripts/lib/release-preparation.mjs: claimForms admits legacy wording before the available-target early return",
    "node --test scripts/test-release-preparation.mjs: 16 passed; the subject's release check and the one-line integration case passed"
  ],
  "rejected": [
    { "option": "Fail the canonical subject's write criterion on this compatibility path", "reason": "The current generated block, actual writes, refusal of added content and merge behavior meet criterion 4; normalizing an available legacy target is additional input consistency work." }
  ],
  "followup": "WO-189 adjacent repair F2: make an available legacy claim normalize without retiming, or explicitly refuse it before reporting preparation complete; cover the no-op target case.",
  "reopenWhen": "Preparation either leaves an already canonical available target untouched or produces/refuses the exact canonical line for every admitted legacy form."
}
```

## WO-189-D012 — Verification follow-up: alternate candidates miss an inventory anchor

```json
{
  "id": "WO-189-D012",
  "date": "2026-10-10",
  "dispatch": "resume: verify; run the inventory check on each candidate",
  "decision": "Board F3 as a nonblocking evidence follow-up. The inventory check passes for the selected README and candidate-1200, but exits 1 for both candidate-2000 and candidate-3000: b025's literal anchor browser adapter is absent. Both alternate pages describe the browser evidence adapter, so this is an anchor/evidence inconsistency rather than an observed missing capability fact. The handoff and D003 claim that each candidate's check passes; those unfiled execution claims need reconciliation. Criterion 1's actual chosen-page destinations are covered, and criterion 2's three complete documents and scored answers are present.",
  "evidence": [
    "node docs/evidence/WO-189/inventory-check.mjs --readme docs/evidence/WO-189/candidate-2000.md: exit 1; FAIL b025: browser adapter is not in the candidate",
    "the same command for candidate-3000.md: exit 1 with the same b025 anchor failure",
    "the chosen README and candidate-1200 checks: exit 0, 131 blocks covered, 0 failures",
    "docs/evidence/WO-189/inventory.json row b025; candidate-2000.md and candidate-3000.md What runs today; handoff.md criterion 1 and decisions.md D003"
  ],
  "rejected": [
    { "option": "Call the alternate pages incomplete because of a literal substring mismatch", "reason": "Their browser capability prose and six scored answers are present; the chosen-page inventory gate passes." }
  ],
  "followup": "WO-189 adjacent repair F3: reconcile the b025 anchor and the two alternate candidates, then refresh the candidate-check evidence and the execution claims to describe the actual results.",
  "reopenWhen": "All three candidate checks pass with meaningful literal anchors, or the documented checking contract and its actual limits are stated consistently without a false passing claim."
}
```

## WO-189-D013 — Repair: What runs today is judged as one range

```json
{
  "id": "WO-189-D013",
  "date": "2026-10-10",
  "dispatch": "resume: fix; repair VER-001 F1 (criterion 5)",
  "decision": "The document check judges What runs today as one range from its heading to the next heading of the same or a higher level: the marker pair stands inside that range in order; nothing in the range but blank lines, generated blocks and the markers stands outside the pair; every non-empty line between the markers is one sentence, where a terminator followed by a space and more text is a second sentence whatever it starts with; the heading occurs once; and the count of those lines is the budget. The page's closing paragraph under the heading, the not-built disclosure and the where-to-read-next sentence, now stands inside the markers as two sentence lines, so the rendered page is unchanged and no sentence under the heading is outside the count; candidate-1200 moves the same way because the page must match it. The section holds nine lines and the budget in docs/control/front-page.json is eleven, the chosen candidate's count plus two (operator-review assumption 4).",
  "evidence": [
    "docs/evidence/WO-189/repair-001/front-page-probes-rerun.json: the verifier's probe source, rerun unchanged against the repaired checker, exits 0 with missedRefusals []; the four shapes it had found admitted are refused (twelve sentences below the end marker: 12 failures; the pair before the heading: the placement is refused; thirteen sentences on one line: refused; the full checkDocs case: 12 failures) while the unchanged, declared-outside-section and generated-version-only cases still pass",
    "scripts/test-docs-check.mjs, the case 'What runs today is one range from its heading to the next heading': adds the shapes the report did not quote, a ### subheading under the heading, a second ## What runs today heading, the closing marker under the next heading, and a line whose only terminators sit inside a link, a code span and 'i.e.' (admitted); the seven front-page cases pass under node --test, including the executed 08845c71 historical case",
    "node scripts/docs-check.mjs on the repaired page: PASS with 0 failures; the What runs today sections of README.md and candidate-1200.md agree outside the version line",
    "the fixture page gained a closing ## Next heading so that its closing paragraph is the page's own prose, as on the real page"
  ],
  "rationale": "The three bypasses share one cause: three independent indexes (the marked interior, the heading-to-marker gap and a selected class of sentence starts) permitted contradictory shapes. One validated range closes the class rather than the quoted instances. Keeping the not-built paragraph outside the markers would have needed an exception path, a trailer with its own bound, that the next probe attacks and a second rule to state; moving it inside costs nothing a visitor sees and makes the rule total: every sentence under the heading is a counted line. The budget follows the order's formula, the count plus two, so the queued orders keep the two lines of headroom D002 gave them.",
  "rejected": [
    {
      "option": "Patch the three quoted probes: check the end-marker-to-heading gap and widen the class of sentence starts",
      "reason": "Leaves the independent indexes in place; a ### subheading or a second heading escapes the same way."
    },
    {
      "option": "Keep the not-built paragraph outside the markers as an admitted trailer paragraph",
      "reason": "An exception path with its own bound is the next bypass and a second rule to state; the rendered page is identical either way."
    },
    {
      "option": "Count the trailer's sentences by splitting wrapped prose",
      "reason": "Two counting modes for one section; one sentence per line already exists and is simpler to follow and to state."
    },
    {
      "option": "Keep the budget at nine with nine counted lines",
      "reason": "Zero headroom breaks the order's promise that the queued orders fold their sentence within the budget."
    }
  ],
  "reopens": {
    "decisionId": "WO-189-D010",
    "observation": "The repair's own run of the verifier's probe source refuses every recorded bypass while the unchanged and authorized cases still pass, which is D010's reopening condition; the budget is eleven rather than the nine D010 names because the two closing sentences are now counted lines."
  },
  "reopenWhen": "A reader of the rendered page reports a change, a queued order cannot fold its sentence within eleven lines, or a new shape under the heading escapes the count."
}
```

## WO-189-D014 — Adjacent repair: a current target still rewrites the block as its generated line

```json
{
  "id": "WO-189-D014",
  "date": "2026-10-10",
  "dispatch": "resume: fix; adjacent item adjacent-0001 for VER-001 F2",
  "decision": "When the heading's target is already above the latest tag, planReleasePreparation no longer returns an empty plan unconditionally: it rewrites the block as the one generated line for the current target and returns that single README edit when the block holds anything else (an admitted older spelling, or blank lines around the claim), with no heading edit and no decision; an already generated block is still a no-op. release prepare reports the case as 'remains current' followed by 'The README release block is rewritten as its generated line.' so the retime wording stays reserved for a retime.",
  "evidence": [
    "docs/evidence/WO-189/repair-001/release-line-probes-rerun.json: the verifier's probe source rerun unchanged; 'legacy line with available target' now has edits 1, the exact generated line and outsideUnchanged true; the two collision cases, the blank-line case and the two refusals are unchanged",
    "scripts/test-release-preparation.mjs 'release preparation follows the existing classification and skips an available target': the plan for a current target with the older spelling and a blank line has exactly the README edit, with and without an observed tag, applying it yields the generated page and touches no other source, and the plan is then empty with no decision recorded; 16 of 16 pass under node --test",
    "scripts/test-worktree-integration.mjs and scripts/test-release.sh spell the fixture claim canonically, so their 'remains current' and 'no files changed' assertions describe unchanged behavior"
  ],
  "rationale": "D011's reopening condition asked that every admitted legacy form either stay untouched when already canonical or produce the exact canonical line; normalizing on the no-op path makes the admitted inputs converge on one byte sequence without a retime, which is what the block rule downstream expects.",
  "rejected": [
    {
      "option": "Refuse the older spellings outright",
      "reason": "An unretimed page prepared by an older release command would stop preparing; the comment admitting the two spellings exists for that page."
    },
    {
      "option": "Report the rewrite with the retime wording",
      "reason": "The integration record and the shell suite read the retime sentence as a version change; a rewrite changes no version."
    }
  ],
  "reopens": {
    "decisionId": "WO-189-D011",
    "observation": "The available-target path now produces the exact canonical line for every admitted legacy form and leaves an already canonical block untouched, which is D011's reopening condition."
  },
  "reopenWhen": "A third claim spelling is admitted, or the release close reads the block by a rule other than the one generated line."
}
```

## WO-189-D015 — Adjacent repair: the b025 anchor names the fact, not one page's wording

```json
{
  "id": "WO-189-D015",
  "date": "2026-10-10",
  "dispatch": "resume: fix; adjacent item adjacent-0002 for VER-001 F3",
  "decision": "Inventory row b025's anchor 'browser adapter' is replaced by 'console witnesses', the literal fact the page and all three candidates carry about the browser evidence adapter (it supplies screenshot, network and console witnesses); inventory.md is re-rendered; the handoff's criterion 1 line states the observed results. The alternate candidates are not edited: they remain the documents the readers scored.",
  "evidence": [
    "node docs/evidence/WO-189/inventory-check.mjs: PASS, 0 failures; page README.md 13,125 bytes, What runs today 9 sentences of 11",
    "the same with --readme docs/evidence/WO-189/candidate-2000.md and with --readme docs/evidence/WO-189/candidate-3000.md: PASS, 0 failures each; before the change each exited 1 on b025 'browser adapter', as VER-001 recorded",
    "README.md: 'a browser adapter can add screenshot, network and console witnesses'; candidate-2000 and candidate-3000: 'supplies screenshot, DOM, network and console witnesses'"
  ],
  "rationale": "The anchor's job is to prove that the fact is present; 'browser adapter' matched one page's phrasing rather than the fact. 'console witnesses' names what only the browser adapter supplies and occurs in every candidate.",
  "rejected": [
    {
      "option": "Reword the alternate candidates to say 'browser adapter'",
      "reason": "They are the scored documents; changing their prose to satisfy an anchor inverts the check."
    },
    {
      "option": "Weaken the anchor to 'browser'",
      "reason": "Too common a word to prove the capability fact."
    }
  ],
  "reopens": {
    "decisionId": "WO-189-D012",
    "observation": "All three candidate checks pass with a literal anchor that names the capability fact, which is D012's reopening condition."
  },
  "reopenWhen": "A candidate drops the browser witness sentence, or a swap makes another candidate the page and its anchors are judged again."
}
```

## WO-189-D016 — Verification: Markdown emphasis still bypasses the section budget

```json
{
  "id": "WO-189-D016",
  "date": "2026-10-10",
  "dispatch": "resume: verify; attack the repaired range with Markdown syntax",
  "decision": "Record VER-002 F1 as blocking under criterion 5. The original VER-001 bypasses are refused, but the repaired checker still admits thirteen rendered sentences on one physical line when twelve sentence endings sit inside bold or italic spans and a final plain sentence ends the line. A second level-two heading written as ## **What runs today** also admits twelve sentences outside the marked range. All three inputs pass the full checkDocs entry point after formatting and at the formatter's fixed point, against the unchanged eleven-line budget. The verifier leaves the implementation unchanged and returns a failed verdict.",
  "evidence": [
    "docs/evidence/WO-189/verify-002/boundary-probes.mjs and boundary-probes-result.json: the bold, italic and strong-emphasis heading cases have formattedFailures [] and formatterFixedPoint true; renderedProbeLine contains thirteen ordinary sentences, and the Markdown parser reports both headings as depth 2 with text What runs today",
    "scripts/docs-check.mjs SENTENCE_BREAK recognizes only selected raw closing characters after punctuation; whatRunsSection matches the heading by literal line equality while SECTION_CLOSER recognizes the emphasized heading as a section boundary",
    "docs/evidence/WO-189/verify-002/front-page-probes-result.json: the unchanged previous verifier source now reports missedRefusals [], establishing that this finding is a new variation of the repaired criterion rather than a claim that the original probes still fail",
    "docs/evidence/WO-189/verify-002/docs-fixtures.txt: all seven affected fixtures pass, including the historical 08845c71 comparison; those fixtures do not vary Markdown emphasis"
  ],
  "rationale": "Rule beating changed the attack: vary Markdown representation as well as marker placement and lowercase sentence starts. The NoOp, accepting only the existing passing probes and product row, would miss a formatting-stable over-budget page. The section's rendered facts, not whether punctuation touches an emphasis delimiter, decide whether its one-sentence-per-line contract holds.",
  "rejected": [
    {
      "option": "Block on trailing spaces, closing hashes or a tab alone",
      "reason": "Those raw heading variants are normalized to the exact duplicate heading by the formatter and are then refused. They are retained as direct-check limits, but the blocking finding rests on the three variants that still pass after formatting."
    },
    {
      "option": "Add another small raw-character exception during verification",
      "reason": "The verifier has no implementation editing authority; the repair must cover the Markdown representation class rather than only the quoted examples."
    }
  ],
  "followup": "WO-189 repair VER-002 F1: enforce one rendered sentence per marked line and one rendered What runs today heading across Markdown emphasis, with refusal fixtures and unchanged authorized/budget-boundary cases; reuse the existing Markdown parser where it holds the contract without another grammar or dependency.",
  "reopens": {
    "decisionId": "WO-189-D013",
    "observation": "The original bypasses are closed, but the new bold, italic and emphasized duplicate-heading shapes still escape the count after formatting, satisfying D013's reopening condition."
  },
  "reopenWhen": "A repair refuses every formatting-stable variation in the recorded probe while exact-budget and authorized changes still pass."
}
```

## WO-189-D017 — Repair: one Markdown grammar for sentences and headings

```json
{
  "id": "WO-189-D017",
  "date": "2026-10-10",
  "dispatch": "resume: fix; repair VER-002 F1 (criterion 5)",
  "decision": "The existing pinned Markdown parser judges both heading identity and rendered sentence lines. Exactly one heading renders as What runs today, and it is a top-level level-two heading; its range closes at the next parsed top-level heading of the same or a higher level. The ordered marker pair stays inside that range. Paragraph text is rendered without emphasis delimiters or link destinations, with physical soft and hard line breaks preserved and mapped back to source rows. Each counted row ends a rendered sentence and has no terminator followed by whitespace and further rendered text. Non-prose blocks, inline HTML and inline code spanning physical lines are refused rather than silently omitting visible content. The eleven-line budget, front-page authority, selected candidate and generated version line retain their recorded contracts. The playbook and product 07 state the rendered-heading and rendered-sentence rule in place.",
  "evidence": [
    "docs/evidence/WO-189/repair-002/boundary-probes-before.json: unchanged VER-002 boundary-probes.mjs exits 1; bold and italic sentence lines and the emphasized duplicate heading remain admitted after formatting, reproducing the report",
    "docs/evidence/WO-189/repair-002/boundary-probes-after.json: the same source exits 0 with 17 cases, mismatches [], no formatted mismatch and every formatted input at a fixed point; exact-budget, authorized-next-heading and CRLF controls pass",
    "docs/evidence/WO-189/repair-002/markdown-fixtures-before.txt and markdown-fixtures-after.txt: both new fixture groups fail on the original checker and pass on the repair, before and after formatting; unquoted attacks include strikethrough, links, decoded entities and escaped punctuation, nested emphasis, a setext duplicate heading and namesakes at other levels or inside a quote",
    "docs/evidence/WO-189/repair-002/front-page-fixtures.txt: eight selected fixture groups pass, retaining ownership, immutable-control, budget, range and typed-header controls",
    "scripts/docs-check.mjs uses its existing parseMarkdown and renderedText helpers; no dependency or package implementation changes"
  ],
  "rationale": "Rule beating changes the choice: a raw delimiter allowlist assigns a different grammar to each Markdown spelling and has already admitted formatting-stable counterexamples. Sharing the parser and rendered-text helper makes the sentence and heading judgments agree. The companion trap is refusing ordinary styling, so exact-budget controls exercise emphasized text, links, code, encoded punctuation, a multiline emphasis span and a hard line break. The NoOp would leave the three reproduced formatted bypasses open. There is no credible second Markdown grammar to compare with the pinned parser; the bounded before/after comparison measures refusal correctness, not equivalent-outcome speed.",
  "rejected": [
    {
      "option": "Add asterisks and underscores to the raw punctuation and heading patterns",
      "reason": "It fixes the quoted spellings but leaves links, strikethrough, entities and setext headings governed inconsistently; the new fixtures exercise those representations."
    },
    {
      "option": "Strip Markdown with another regular-expression renderer",
      "reason": "The checker already has a pinned parser and a rendered-text helper; a second grammar adds maintenance and cannot establish equivalent rendering."
    },
    {
      "option": "Count every block's rendered text while dropping HTML or multiline code",
      "reason": "Invisible omissions or collapsed line breaks would make a physical line budget claim facts it did not judge; unsupported prose shapes fail explicitly."
    }
  ],
  "reopens": {
    "decisionId": "WO-189-D016",
    "observation": "The unchanged verifier source now refuses every recorded formatted bypass and preserves the exact-budget and authorized controls, satisfying D016's reopening condition."
  },
  "reopenWhen": "A formatting-stable Markdown spelling hides a second sentence or namesake heading, or a valid one-sentence Markdown line is refused."
}
```

## WO-189-D018

```json
{
  "id": "WO-189-D018",
  "date": "2026-10-10",
  "dispatch": "resume: fix; release prepare",
  "decision": "Retime unpublished application target v0.73.2 to v0.74.1, the next patch above the observed release baseline v0.74.0, in the heading and the README version claim. Scope, acceptance, component versions and published tags are unchanged.",
  "evidence": [
    "release baseline v0.74.0 (local tags)",
    "superseded target v0.73.2",
    "new target v0.74.1"
  ],
  "rejected": [
    {
      "option": "A dated roadmap or README paragraph",
      "reason": "A version collision is recorded once, as this decision (WO-086); product documents and the README carry only the version claim."
    }
  ],
  "reopenWhen": "A collision changes scope, acceptance, component versions or a published tag, or needs a hand step beyond this record."
}
```

## WO-189-D019 — Verification: parser-extension text and an HTML heading escape the section budget

```json
{
  "id": "WO-189-D019",
  "date": "2026-10-10",
  "dispatch": "resume: verify; attack the repaired Markdown grammar (VER-003)",
  "decision": "Record VER-003 F1 as blocking under criterion 5. The repaired checker silently drops the text of inline nodes that its pinned parser adds beyond CommonMark and GFM. A counted line `Capability 1 runs. {{ … }}`, `{% … %}` or `[[ … ]]` that carries twelve more sentences passes the full checkDocs entry point. It passes before and after formatting, at the formatter's fixed point, against the unchanged eleven-line budget. Inline math is dropped the same way. A raw HTML `<h2>What runs today</h2>` under another top-level section, followed by twelve sentences, also passes, although ATX and setext duplicates in the same place are refused. The verifier leaves the implementation unchanged and returns a failed verdict.",
  "evidence": [
    "docs/evidence/WO-189/verify-003/boundary-probes.mjs and boundary-probes-result.json: exit 1; mismatches name the liquid output tag, liquid tag, wiki link and HTML-heading cases; each has failures [] and formattedFailures [] with formatterFixedPoint true; droppedNodes records the liquidNode and wikiLink values holding the twelve sentences; all eleven controls behave as expected",
    "scripts/docs-check.mjs:53 renderedText returns a value only for text and inlineCode nodes and otherwise joins children, so liquidNode, wikiLink and inlineMath contribute an empty string; whatRunsSection (line 694) refuses only html nodes and inline code that spans lines; heading identity (line 636) reads only parsed heading nodes",
    "Prettier 3.9.6, the pinned parser, emits liquidNode for {{ }} and {% %}, wikiLink for [[ ]] and inlineMath for $ $ (verifier AST observation, recorded in droppedNodes)",
    "Inference: GFM defines no {{ }}, {% %} or [[ ]] construct, so GitHub shows that text literally; the public html-pipeline v2.14.3 sanitization allowlist (fetched 2026-10-10) admits h2. No page was rendered by GitHub for this record",
    "docs/evidence/WO-189/verify-003/rerun-boundary-probes-result.json: VER-002's unchanged seventeen-case probe now exits 0, so this is a new variation, not a regression of the D017 repair"
  ],
  "rationale": "D017 states that visible content is refused rather than silently omitted, and that exactly one heading renders as What runs today. Both claims fail on formatting-stable input, and that is D017's own reopening condition. Rule beating chose the attack: the parser's own node vocabulary, not only the delimiters the fixtures list. The NoOp, consuming the passing product row and the repair's fixtures, would miss these over-budget pages. A refusal list grows with every parser extension, while an allowlist of node types with known rendered text closes the class.",
  "rejected": [
    {
      "option": "Treat the braces and brackets as visible noise that a reviewer would catch",
      "reason": "The criterion is a mechanism. Twelve readable sentences sit in the section and the check returns no failure, as it did for the emphasis spellings that VER-002 found blocking."
    },
    {
      "option": "Ask the repair to add liquid, wiki-link and math nodes to the refused list",
      "reason": "That repeats the one-spelling-at-a-time pattern that D017 rejected. An allowlist of rendered node types holds for later parser extensions too."
    }
  ],
  "followup": "WO-189 repair VER-003 F1: judge a counted What runs today line only from inline node types whose rendered text the checker knows, and refuse every other node type (liquid, wiki link, inline math and any later parser extension) instead of listing refused types; count raw HTML h1-h6 elements whose text renders the section's name as namesake headings; add refusal fixtures for each, and keep the exact-budget, styled-sentence and authorized-next-heading controls passing.",
  "reopens": {
    "decisionId": "WO-189-D017",
    "observation": "Formatting-stable liquid, wiki-link and raw HTML heading spellings hide a second sentence or a namesake heading at the repaired subject, which is D017's reopening condition."
  },
  "reopenWhen": "The repaired checker refuses every expected case in docs/evidence/WO-189/verify-003/boundary-probes.mjs before and after formatting, while its controls still pass."
}
```

## WO-189-D020 — Verification follow-up: orthographic and invisible-character limits of the sentence and heading rules

```json
{
  "id": "WO-189-D020",
  "date": "2026-10-10",
  "dispatch": "resume: verify; record residual limits of the repaired rules (VER-003)",
  "decision": "Record as a non-blocking follow-up, not a criterion failure, six admitted shapes. The sentence rule, a terminator followed by whitespace, admits thirteen sentences joined with no space, joined by zero-width spaces, ended by an ellipsis character or ended by fullwidth full stops. Heading identity admits a duplicate What runs today heading spelled with a soft-hyphen or zero-width-space character reference. The checker reads all of this text. Each shape needs malformed spacing, a non-ASCII terminator or an invisible character. The handoff discloses that the rule is not a natural-language sentence classifier.",
  "evidence": [
    "docs/evidence/WO-189/verify-003/boundary-probes-result.json: the recorded rows for the no-space, zero-width, ellipsis and fullwidth joins and the soft-hyphen and zero-width headings are not refused before or after formatting, with the formatter at a fixed point",
    "scripts/docs-check.mjs:607 SENTENCE_BREAK requires [.!?] followed by whitespace; the heading comparison uses normalized(), which collapses whitespace but keeps format characters"
  ],
  "rationale": "These shapes contradict no rule that D017 states, unlike D019's dropped text. A repair can narrow them cheaply in the same function, but a text-identity rule cannot close look-alike characters completely, so they are not held against criterion 5.",
  "rejected": [
    {
      "option": "Block the verdict on these shapes as well",
      "reason": "They require deliberately malformed or invisible text. The stated sentence rule judges them as written, and no stated contract of criterion 5 or D017 is contradicted."
    }
  ],
  "followup": "Front-page check: remove Unicode format characters and soft hyphens before comparing heading and sentence text, treat the ellipsis and fullwidth or ideographic terminators as sentence ends, and add fixtures. The WO-189 repair may take this within its Boy Scout bound; otherwise a later order that edits scripts/docs-check.mjs takes it.",
  "reopenWhen": "An order uses one of these shapes to put more sentences under What runs today than its budget, or a repair closes them with fixtures."
}
```

## WO-189-D021 — Repair: close the surfaces where GitHub and the parser disagree, and judge each line twice

```json
{
  "id": "WO-189-D021",
  "date": "2026-10-10",
  "dispatch": "resume: fix; repair VER-003 F1 (criterion 5), taking D020's follow-up within the bound, under the operator's steering recorded in D022",
  "decision": "The front-page guard closes the surfaces where GitHub's renderer and the check's parser disagree instead of modelling them, and judges what remains twice. Page-wide, outside code and the registered marker lines, the page holds no raw HTML (an autolink is a link, an escaped bracket is text), none of the parser's extensions GitHub does not share (front matter, math, template tags, wiki links), no bidirectional control typed or written as a reference, no control character other than tab and line endings (GitHub reads a form feed or vertical tab as whitespace inside links, labels and list markers where the parser does not), no bracketed run of 1000 bytes (the two limit a link label's length differently), and no carriage return without a line feed. Each counted line between the markers is paragraph prose built only from a closed list of inline node types (text, inline code, emphasis, strong, strikethrough, links, link references, images, image references, line breaks) and holds no emoji shortcode; its raw source, with code spans set apart, unescaped link destinations and titles and autolinks removed (any other angle-bracketed text stays prose), references decoded as HTML decodes them, escapes resolved and emphasis delimiters dropped, ends exactly one sentence, and the parser's rendering of its paragraph breaks into exactly its lines, each one sentence. A sentence ends at a Unicode sentence terminal, an ellipsis, the Greek question mark, an exclamation or question emoji, or a look-alike stop the property omits (enclosed numbers with stops, vertical and Mongolian ellipses, Tibetan shad), and a trailing emoji after the final stop is decoration; after it may come anything but a letter, a digit, a space or clause punctuation, a modifier letter, or a short bracketed note mark; another starts after whitespace, directly after an ideographic or fullwidth stop before a letter, where a lowercase letter or digit and a stop meet a capitalized word, where two capitals and a stop meet a capitalized word, or where a stop meets a letter of a script without case; invisible characters read as spaces; inline code and ASCII web or e-mail addresses are masked, except that code holding a stop before a capitalized word (past any quotes, brackets, dashes or numbers), or ending its words in a stop, counts. The section's name appears once among the page's headings: every parsed heading, with and without its pictures and its emoji shortcodes, and every raw line that could render as a heading (an ATX line or the text over a setext underline, generated interiors included) are searched by letters and digits after invisible-character removal, NFKC and case folding; a contents link or a sentence mentioning the section is not a heading. The section closes only at a one-line Markdown heading with a letter or digit outside pictures. Each generated block the record lists stands on the page once, and one under the heading holds only the line its writer puts there. The page, the line budget and the section's markers are the merge base's record's whenever main has one, so a front-page order can neither move the page nor raise its own budget, and a generated block main's record does not list may not stand under the section: planning moves them on main. Ownership reads the record where the merge base's configuration puts it, refuses a README GitHub may show in the page's place (under .github or beside the page) and a page that is not a regular file, and turns a malformed Front page field into a refusal; an order is judged on its own change, so findings on a page the branch may not change and has not are reported as main's, not refused. Every refusal names its fix. The shape judgment is a pure function, frontPageShapeFindings, which the corpus test and the GitHub oracle call directly.",
  "evidence": [
    "scripts/fixtures/front-page-corpus.json: 915 rows (708 refuse, 207 admit), 183 carrying the reason their expectation differs from the first reading of the case, 3 marked known limits, 6 judged on their bytes only; the corpus test judges them all in under a second",
    "twenty-five reviewers in three waves, a reader panel and two judgment passes (D022) proposed the rows: block structure, inline syntax, Unicode text, page structure and ownership, parser-versus-GitHub differences, two generalists, the sentence readings, the namesake scan, ownership, a future front-page executor, a criteria adversary, a design reviewer and a mock verifier",
    "GitHub's renderer, observed through POST /markdown/raw on synthetic fixture pages only (docs/evidence/WO-189/repair-003/github-oracle.mjs and github-oracle-result.json): front matter, search, lowercase declarations, source, display math, quoted-attribute and empty-comment HTML headings, nameless closers, German closing quotes and template tags render as the findings claimed; bdo is stripped and a semicolon-less reference in an HTML heading is escaped",
    "the pinned Prettier 3.9.6 markdown plugin carries remark-parse's tokenizer architecture (blockTokenizers, inlineTokenizers and its error strings); which CommonMark version it follows is not established, so the guard's closures rest on observed disagreements, not on a version label",
    "docs/evidence/WO-189/verify-001, verify-002 and verify-003 probe sources rerun unchanged with no missed refusal; scripts/test-docs-check.mjs passes 57 of 57 groups, including fixtures for the .github stand-in, a symlinked page, a moved control root, a malformed field on main, a missing generated block, a record that moves the page and a generated block added under the section",
    ".prettierignore excludes *.md (WO-130-D008), so the bytes of README.md are what the gate judges"
  ],
  "rationale": "Four repairs each enumerated the spellings they knew and each round of attack varied the representation. The variations came from two open surfaces: raw HTML, which GitHub and the parser tokenize differently in ways no regular expression models, and the gap between the parser's tree and GitHub's rendering. The page needs no raw HTML, so closing it removes the larger surface outright; reading each counted line twice, once without the parser, removes the dependence on the parser's tree for the rest. The ownership refusal is the load-bearing control: only a declared front-page order may change the page at all, so the sentence rules judge a cooperating writer's prose, and further Unicode rules would buy little and refuse more; new cases enter as corpus rows, false refusals included, before the check changes. Messages name the fix because the next front-page orders' executors meet them first.",
  "rejected": [
    {
      "option": "Patch each reported spelling",
      "reason": "That is the cycle three verifications broke; the corpus shows the classes recur, not the spellings."
    },
    {
      "option": "Model raw HTML with a tokenizer or a letter search over HTML chunks",
      "reason": "Each version tried left a tokenizer state the next attack used (comments, processing instructions, quoted attributes, hidden elements, legacy references) and refused ordinary HTML; the page needs none."
    },
    {
      "option": "Unicode sentence segmentation as the sentence rule",
      "reason": "It admits lowercase sentence starts the earlier repairs refused, and its verdict would move with the Node and ICU versions."
    },
    {
      "option": "A second Markdown parser matching GitHub",
      "reason": "Criterion 8 forbids a new dependency; the raw reading needs none."
    },
    {
      "option": "Treat a stop meeting capitals as a join",
      "reason": "It refused product names such as Socket.IO and Node.JS; the shape it catches needs malformed spacing, recorded as a limit."
    }
  ],
  "followup": "Front-page guard limits the corpus records: a generated block outside What runs today is judged only by its writer's check (WO-088 must list its block in the record and pin its content); a picture the page embeds can change without touching the page; work-order authority files are listed through the working configuration; with no local main the comparison is skipped with a notice; receipts in Devanagari digits, look-alike letters (another script, or Latin small capitals), digit note marks, French spaced guillemets, German ordinals and abbreviations, Thai without a stop, a stop meeting capitals, lowercase sentences inside inline code and a code span splitting a word are stated limits of the receipt, name and sentence rules.",
  "reopens": {
    "decisionId": "WO-189-D017",
    "observation": "Parser-extension text and an HTML heading escaped the section budget at D017's subject (D019), which is D017's reopening condition."
  },
  "reopenWhen": "A refuse row of scripts/fixtures/front-page-corpus.json is admitted or an admit row refused, or GitHub's rendering shows a namesake or more sentences than counted lines on a page the guard admits."
}
```

## WO-189-D022 — Repair process: twenty reviewers as a measured experiment, not an activation count

```json
{
  "id": "WO-189-D022",
  "date": "2026-10-10",
  "dispatch": "resume: fix; operator steering: stop the repeated verification failures, spare later executors footguns, use the twenty-agent budget as a measured, antifragile experiment, then a reader panel under a temporary cap of 25",
  "decision": "Spend the session's twenty-agent budget (docs/control/budgets.json subagentCap) on the repair as a staged experiment whose unit of value is a confirmed, novel corpus row, not an agent launched. Wave 1 runs two identical generalist adversaries (the control arm, measuring redundancy) beside five specialists, each owning one disjoint representation class (block structure, inline syntax, Unicode text, page structure and ownership, parser-versus-GitHub differences), all returning rows in the two-sided corpus format. Refuters then judge the pooled findings in batches before any code changes; a design reviewer and a criteria adversary judge the final diff; fresh attackers and a mock verifier re-attack after the fixes. Later waves are spent only while the previous wave yields confirmed novel findings, and any unspent budget is reported, not filled. At the end, a reader panel grades the front page in several roles against the operator’s thirteen aspects of quality (product 05), judgment recorded before explanation, as proposals and evidence only. The cap in docs/control/budgets.json rises from 20 to 25 only when a launch would exceed 20 and returns to 20 before the final gates, so the raise never ships with this order.",
  "evidence": [
    "docs/control/budgets.json subagentCap 20; node scripts/harness.mjs usage reported 1 observed admission of 20 when the expansion arrived",
    "VER-001, VER-002 and VER-003 each failed criterion 5 on a representation the preceding repair had not enumerated (D010, D016, D019)",
    "docs/evidence/WO-189/repair-003/README.md §Measured results: each wave's agents, tokens and the findings that changed the guard, the corpus or the page; the stopping rule never triggered before the budget was spent"
  ],
  "rationale": "The repeated failures share one cause: each repair listed the spellings it knew, and each verifier varied the representation. Activation (launching agents) does not change that; utilization does, when agents partition the attack surface so their findings do not overlap, and when every finding lands as a durable two-sided corpus row that later fixes cannot silently undo. Refutation before change and admit rows guard against naive interventionism: a fix that would refuse ordinary prose a later front-page order writes fails the corpus. The corpus is the antifragile part: each attack, now or in later verification, adds a row and leaves the guard stronger.",
  "rejected": [
    {
      "option": "Twenty independent generalist attackers",
      "reason": "Identical briefs overlap; the twin arm measures that overlap instead of assuming it, at the cost of one agent."
    },
    {
      "option": "Fix every reported finding as it arrives",
      "reason": "Unrefuted findings include out-of-model shapes; changing the check for each would add rules that refuse valid prose, the footgun the operator named."
    },
    {
      "option": "Spend all twenty regardless of yield",
      "reason": "That measures activation. Spending stops when a wave adds no confirmed novel row, and the remainder is reported."
    }
  ],
  "reopenWhen": "A later verification finds a bypass in a class a wave covered and reported clean, or the corpus admits a row the stated rule refuses."
}
```

## WO-189-D023 — Repair: the front page follows the operator's recorded judgment, claims and voice alike

```json
{
  "id": "WO-189-D023",
  "date": "2026-10-10",
  "dispatch": "resume: fix; operator chose to correct the panel's five overclaims and directed that README changes follow the operator's judgment as the repository records it, not a question per change or the executor's taste",
  "decision": "README.md is candidate-1200 (D002) with the changes the operator's recorded judgment decides, and no others; docs/evidence/WO-189/repair-003/readme-vs-candidate-1200.diff.txt lists them. Five What runs today lines, chosen by the operator, now say what their evidence shows: intent files a draft the operator or an authorized resident admits; a failed change returns to a fresh worker until the contract passes or the repair budget runs out and a person decides; the mission check runs on a fixed cadence and holds dispatch when it finds drift or cannot tell; the logs are typed and versioned; the repository is built with the same roles. Four further statements are corrected under the same record (Node 26 and two commands in Try it, the board rendering actors, builds and evidence from the repository's logs, the interruption policy specified and not yet compiled, docs/control holding the control records). Lines from parts the order keeps in their own words are restored in the operator's wording: the predecessor that proved the concept and then collapsed under its own success, with the plain consequence and the cold-resistance comparison beside the stash metaphor; the bet that the workflow remembers the worker; the horizon that deterministic replay makes possible; the instrument under review that says so; and the name's 'Personal, mathematical, and just strange enough' with the closing contrast 'The ambition is not'. Seiri carries its original terms (Sort, 整理, the first S of 5S) and the showrunner its gloss (architect plus scrum master). Not applied: moving the shelf quotation (the operator set its place in D002), evidence links in What runs today (receipts the page does not carry, D002), and a gloss for loadout (the operator's own page used it unglossed). The front-page rule in docs/PLAYBOOK.md and product 07 now says a front-page order applies the operator’s recorded judgment and asks only about a choice no record covers. candidate-1200.md stays as the readers scored it, since three of its reader's quotations quote sentences the corrections replaced; criterion 3 is judged against D002 and this record.",
  "evidence": [
    "six reader-panel reports flagged the line-75 claim, five lines 71 and 73, three line 74 and two line 69, each with repository evidence (D022); docs/evidence/WO-055/implementation.md AC3, docs/product/03-architecture.md §Mission check, packages/skeleton/src/resident-state.ts, docs/product/07-execution-guide.md §Derived work and intent, packages/console/src/collect.ts (the board reads control segments and kernel event logs, both typed and versioned, through separate readers), packages/kernel/src/store.ts, docs/product/04-interfaces.md and package.json engines support the corrections; a final reader caught that the first wording, one shared format, was itself wrong, and it is corrected",
    "the operator's recorded judgment, compiled across the repository by two research passes and checked at source: the README is the public doorway that must not imply unshipped capability, and its closing contrast is intentional (docs/lineage/idea-ledger.md, 2026-08-31 entries at lines 7779-7799); the stash metaphor carries a plain-English translation (same entries) and current product surfaces map it to gear for every damage type when the encounter or episode calls only for cold resistance (docs/product/00-vision.md line 125; docs/product/03-architecture.md lines 408-414; the ledger entry at line 6376 that first recorded the mapping is tagged superseded); original terms such as Seiri / Sort / 整理 stay primary (ledger line 9134); the name's reasons include sounding strange and procedurally generated (ledger line 8949); an idea may be superseded but never disappear (ledger lines 1-7); the old page's voice is the operator's own public draft (docs/work-orders/WO-007-audit-record-baseline.md, receipt of 2026-09-02); the order keeps its parts in their own words and moves text rather than deleting it (WO-189 Design and operator-review assumption 2); D002 chose the shortest full-score candidate for length and structure, for now",
    "docs/evidence/WO-189/reader-runs/candidate-1200-reader.json: three of twelve quotations quote replaced sentences, so the scored candidate is kept as scored",
    "after the changes, frontPageFindings on the real page returns no failure and node docs/evidence/WO-189/inventory-check.mjs passes with 0 failures over 131 blocks; What runs today holds nine of eleven lines"
  ],
  "rationale": "The repository exists to carry the operator's judgment, and that judgment is recorded across the ledger, the vision, the decisions and the operator's own drafts, not only in this session's words. The first version of this record said voice changes had no recorded judgment beyond the choice of candidate; that was wrong, as the entries above show, and it is corrected here the same day. Each change applies a recorded judgment; the changes not made would reverse one. No operator question was needed: each change is local, reversible and decided by a record.",
  "rejected": [
    {
      "option": "Ask the operator about each README change",
      "reason": "The operator directed otherwise: a question per change is the babysitting the page describes."
    },
    {
      "option": "Decide README wording on the executor's own judgment",
      "reason": "That substitutes the executor's taste for the operator's recorded judgment."
    },
    {
      "option": "Align candidate-1200.md with the page",
      "reason": "Its reader's quotations would no longer match what the reader saw; the difference is recorded instead."
    }
  ],
  "followup": "Planning: correct WO-095 (its references to the old page's lines and the removed block comment) and WO-118 (its cost line and step that write into the release block); resolve the headroom of two lines against three queued sentences (WO-095, WO-098, WO-118) by planning on main; add WO-088's block to the record's generatedBlocks in its own order; complete the rights fields of the Poincaré epigraph's source row in docs/lineage/inspirations.md (line 52).",
  "reopenWhen": "A front-page claim is again contradicted by repository evidence, or the operator's record changes a judgment applied here."
}
```

## WO-189-D024 — Verification follow-up: the restoration record describes another README

```json
{
  "id": "WO-189-D024",
  "date": "2026-10-10",
  "dispatch": "resume: verify; independently compare the current README with D023 and its saved diff",
  "decision": "Correct the current-output claim the same day: D023 and repair-003/readme-vs-candidate-1200.diff.txt describe ten wording restorations absent from README.md. The saved diff applies cleanly to the scored candidate but does not reconstruct the current page. Its current bytes equal repair-complete checkpoint 16, so this verification did not remove them. Board the mismatch as VER-004 F1, a low evidence-consistency follow-up. Do not change the implementation or the scored candidate in verification. The operator-selected candidate and the current factual corrections remain recorded in D002 and D023; no required link, command, package map, inventory anchor, ownership or budget behavior fails on this discrepancy.",
  "evidence": [
    "docs/evidence/WO-189/verify-004/readme-record.mjs reconstructs the saved patch and checks the current page without changing either",
    "docs/evidence/WO-189/verify-004/readme-record-result.json: currentMatchesSavedDiff false; ten restored phrases present in the reconstructed variant and absent from README.md; current and checkpoint-16 SHA-256 agree",
    "docs/evidence/WO-189/verify-004/inventory.txt: 131 blocks and all required anchors pass; verify-004/new-probes-result.json: current page has no failure or notice"
  ],
  "rejected": [
    {
      "option": "Change the README to make this verifier's evidence agree",
      "reason": "Verification is read-only for the implementation and must judge the recorded subject."
    },
    {
      "option": "Fail a criterion solely because the saved restoration diff describes another variant",
      "reason": "The selected candidate, required facts and runtime examples still hold; this mismatch establishes an inaccurate evidence description, not an unmet criterion or a regression in main's behavior."
    }
  ],
  "followup": "Front-page evidence consistency: at the next authorized README or evidence reconciliation, align D023's claimed restorations and the saved comparison with the actual page using the recorded operator judgment, confirm the intended bytes, and preserve the scored candidate and reader quotations.",
  "reopens": {
    "decisionId": "WO-189-D023",
    "observation": "The saved diff's restoration variant does not match the README at the repair-complete checkpoint or at verification entry. The reason those bytes diverged is unknown; no cause is inferred."
  },
  "reopenWhen": "A restoration is shown to be a required operator choice absent from the page, or a later evidence comparison still describes bytes the page does not hold."
}
```

## WO-189-D025

<!-- integration refs/dotln/checkpoint/WO-189/20 -->

```json
{
  "id": "WO-189-D025",
  "date": "2026-10-10",
  "dispatch": "resume: final review; worktree integrate WO-189",
  "decision": "Integrate main at d17ce0047f7fe196105b47cdacade2c4956d27b4 (WO-077 merged as #201 and published as v0.74.0) into the uncommitted branch over its base c676909066d278c92cacd94d998a42a8fb5d4a9a. The branch held no commit, so the helper fast-forwarded HEAD to main (preservation commit 22128e20c5dd515cac57e2c986aa83380303e983, no merge commit), re-applied the named stash and regenerated the projections, and it reported no authored conflict. Every claim VER-004 judged at code identity 8fdbf2796bd4fa15eff2542652428b83aab2cc10a31234bd6e6d2105192ad545 carries to the integrated identity ecc2d86a54477cb4ccfb4c5849aaa5e94a8be7c9378b4387f2bbcff33fbb2746: the subject's own bytes are unchanged (its 21 modified tracked files and 7 untracked paths equal checkpoint 19 apart from the regenerated projections), and main's three commits touch scripts/launchpad.mjs, the kit files, scripts/lib/config.mjs (the kit section, apart from this order's configuredRoots), scripts/test-launchpad.mjs, scripts/test-configuration-root.mjs, product 07 §Where the control plane finds its documents and WO-077's own records, none of which this order's criteria read. The identity changed because main's code did, so the one product gate reruns fresh at the integrated tree instead of composing from VER-004's row. README.md was a resolved projection: main's page carried the old block at v0.74.0 and the branch the rewritten page at v0.74.1, and the merge normalization kept the rewritten page with its one generated line at v0.74.1, the live case of criterion 4's merge claim. No version collision: v0.74.1 is the next patch above the published v0.74.0, which D018 had already retimed to when that tag was local. Component check: packages/, package.json, package-lock.json and docs/evidence/current.json are byte-identical to main, so no component version or evidence edition is re-minted.",
  "evidence": [
    "refs/dotln/checkpoint/WO-189/20",
    "base c676909066d278c92cacd94d998a42a8fb5d4a9a",
    "upstream d17ce0047f7fe196105b47cdacade2c4956d27b4",
    "release preparation: WO-189 target v0.74.1 remains current. Files changed: docs/evidence/WO-189/meta.json, docs/final-reviews/WO-189/PR.md. Meter snapshot: docs/evidence/WO-189/meta.json, 4489 bytes. Tag observation: local snapshot only.",
    "docs/control/local/integration.json: preservationCommit 22128e20c5dd515cac57e2c986aa83380303e983, mergeCommit null, authored [], resolved README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/HISTORY.md and docs/work-orders/README.md; the intake backup DotLn-wo189-intake-20261010T221421Z.zip (3 files) in the session scratch; git ls-remote before the helper ran showed origin main at d17ce004 and v0.74.0 at that commit",
    "git diff main --stat -- packages/ package.json package-lock.json docs/evidence/current.json: empty; git diff main -- scripts/lib/config.mjs: the six configuredRoots lines only; the hash comparison of every untracked path and modified tracked file against checkpoint 19 found only the control segment, the control projection and the work-order index changed, each by its generator",
    "affected checks at the integrated tree, each exit 0, recorded in docs/evidence/WO-189/final-001/: npm run publication:check (254 of 254 headings, both editions CURRENT); node scripts/harness.mjs check (34 generated surfaces); npm run release -- check-surfaces --local; node scripts/docs-check.mjs (15 product documents, 0 failures); npm run work-orders -- index --check; npm run format:check; git diff --check and git diff HEAD --check; node scripts/harness-context.mjs --check; the four verifiers' probe sources rerun unchanged under the bounded runner with no mismatch; node --test scripts/test-docs-check.mjs 57 of 57; scripts/test-release-preparation.mjs 16 of 16; the one-line merge case of scripts/test-worktree-integration.mjs 1 of 1"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Compose the review gate from VER-004's passing row",
      "reason": "The code identity changed with main's code; a composed row would key tasks to bytes they never ran against."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-10. Original base: `c676909066d278c92cacd94d998a42a8fb5d4a9a`.
Fetched main: `d17ce0047f7fe196105b47cdacade2c4956d27b4`. Checkpoint: `refs/dotln/checkpoint/WO-189/20`.
Named stash retained: `9f91918d62e65f10bcd6ca882ac709e241688a70` (WO-189 integrate 2026-10-10).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/HISTORY.md, docs/work-orders/README.md.
Release preparation: WO-189 target v0.74.1 remains current. Files changed: docs/evidence/WO-189/meta.json, docs/final-reviews/WO-189/PR.md. Meter snapshot: docs/evidence/WO-189/meta.json, 4489 bytes. Tag observation: local snapshot only.
Carried-forward claims: all eight criterion judgments of VER-004, as the decision above states; the product gate reruns at the integrated identity.
Authored conflicts observed: none.
Affected checks: run at the integrated tree, each passing; the decision's evidence lists them.

## WO-189-D026 — Final review: pass at the integrated subject, the comparison regenerated and the register retargeted

```json
{
  "id": "WO-189-D026",
  "date": "2026-10-10",
  "dispatch": "resume: final review",
  "decision": "Pass at the integrated subject. All eight criteria are met at code identity ecc2d86a54477cb4ccfb4c5849aaa5e94a8be7c9378b4387f2bbcff33fbb2746, judged from VER-004's evidence carried under D025 and this review's own reruns and gates. Operator-review assumption 1: the operator chose candidate-1200 during execution (D002), so FINAL-001 presents the three candidates with their scores for the record and invokes no fallback; a later front-page order may revisit the choice as D002 allows. Evidence reconciliation (VER-004 F1, D024): docs/evidence/WO-189/repair-003/readme-vs-candidate-1200.diff.txt is regenerated from the actual bytes, a diff -U1 of the scored candidate and README.md with the generated version line masked, so the saved comparison now describes the page: twelve lines added and eleven removed against the candidate, all of them the accuracy corrections D023's first paragraph records (five What runs today lines, the Try it opening, the board, the interruption policy, the docs/control map entry). The ten voice restorations D023 also describes are not on the page, were not on it at repair-complete checkpoint 16, and are not applied here: the page the operator chose and the readers scored is the candidate, the restorations were the executor's compilation of recorded judgment rather than an operator direction, and putting them on the page is a front-page choice a later order makes under D002's reopening; D023's description stands corrected by D024 and this record, and the superseded comparison remains in checkpoints 16 to 20. Register dispositions at close (criterion 7, D006): FUP-84bc6f15abd1e45f settled on the committed page, the one-line block rule and the document check; this order's own rows for D010, D011, D012, D013, D016, D017, D019, D020 and D024 settled on the decisions that did the work and VER-004's pass; the D023 row re-disposed as deferred for planning with its reopening condition unchanged; D021's deferred row and FUP-8111fc3dd4c22331 (reopen when WO-189 closes) left for release close and planning. The operator-word advisory on D023 (attributed words without a capture digest) is advisory, was present at VER-004 and is left as the executor's record.",
  "evidence": [
    "docs/evidence/WO-189/final-001/readme-record-after.json: VER-004's readme-record.mjs rerun unchanged against the regenerated comparison reports savedDiffAppliesToScoredCandidate true and currentMatchesSavedDiff true, the current page's SHA-256 equal to checkpoint 16's, none of the ten phrases in either, and git diff --numstat 12 added, 11 removed between the candidate and the page",
    "docs/evidence/WO-189/final-001/followups-request.json: the eleven dispositions applied through npm run plan -- followups --apply, and the register revision they named",
    "docs/evidence/WO-189/final-001/: the probe reruns, the affected-check logs and the three suite outputs at the integrated tree",
    "the product gate: npm run test:docs and npm test -- --review at the integrated identity, recorded in FINAL-001 with their rows",
    "docs/verifications/WO-189/VER-001.md to VER-004.md: the three blocking findings each repaired and reproduced by the next report, and VER-004's pass"
  ],
  "rejected": [
    {
      "option": "Apply the ten restorations to README.md in review",
      "reason": "A reviewer writes no change to the subject it certifies, and the candidate the operator chose did not carry them; the choice belongs to a front-page order."
    },
    {
      "option": "Leave the saved comparison as it was and board the mismatch again",
      "reason": "D024 named this reconciliation as its follow-up; an evidence file in the order's own directory that describes another page is repairable here within the Boy Scout bound, and its earlier bytes stay in the checkpoints."
    },
    {
      "option": "Return the rows allocated to WO-189 to open at close",
      "reason": "Each was done within the order and verified by VER-004; a row returned to open would plan finished work again."
    }
  ],
  "reopenWhen": "A reader of the front page reports it as a log again, a later evidence comparison describes README bytes the page does not hold, or the operator asks for the restored lines."
}
```

[FINAL-001](../../final-reviews/WO-189/FINAL-001.md) carries the criterion judgments, the candidates with their scores, the gate rows and the findings block.
