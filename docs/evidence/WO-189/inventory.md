# WO-189 front-page inventory

Every top-level block of `README.md` at `c676909066d278c92cacd94d998a42a8fb5d4a9a` (39,030 bytes, 661 lines, 131 blocks; a list counts one block per item), classed keep, move or cut. Rendered from [inventory.json](inventory.json) by [inventory-check.mjs](inventory-check.mjs), which also proves the anchors.

| Class | Meaning | Blocks | Bytes |
| --- | --- | ---: | ---: |
| keep | the chosen page carries the paragraph's substance in its own words; its anchors are checked on README.md (or the candidate named by --readme); a keep row may also name receipts that leave the page, each with the document that already holds it | 90 | 22,961 |
| move | the paragraph's facts leave the page for the named document, written there by this order; every anchor is checked there | 1 | 2,638 |
| cut | the paragraph leaves the page and the named document already holds its facts; every anchor is checked there; a heading or list label with no fact of its own names no document | 40 | 13,224 |

Anchor rule: an anchor is a literal phrase; it is found when the destination contains it after runs of whitespace collapse to one space; a string anchor is checked in the row's destination, an object anchor in the file its `in` names.

| Block | Lines | Type | Bytes | Class | Destination | Anchors | Note |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| b001 | 1-1 | heading | 7 | keep | README.md | `# DotLn` | the title |
| b002 | 3-7 | blockquote | 328 | keep | README.md | `I will take the entire Business, Leadership, and Personal Development shelf`; `programming books overnight` | the epigraph; operator-authored public wording kept verbatim |
| b003 | 9-10 | paragraph | 80 | keep | README.md | `DotLn turns hard-won ways of working into inspectable programs for AI teams` | the thesis, verbatim |
| b004 | 12-19 | paragraph | 556 | keep | README.md | `compiler and runtime for human judgment`; `Models rotate. Sessions die. The judgment survives.` | what DotLn is |
| b005 | 21-24 | paragraph | 311 | keep | README.md | `agentic platform`; `not an agent, not an agent harness, and not an orchestration layer` | the identity boundary |
| b006 | 26-30 | paragraph | 362 | keep | README.md | `the owner decides which organization to build` | substrate versus doctrine |
| b007 | 32-34 | paragraph | 230 | keep | README.md | `running code and which are still a promise` | the honesty sentence |
| b008 | 36-36 | heading | 18 | keep | README.md | `## Why this exists` | — |
| b009 | 38-40 | paragraph | 231 | keep | README.md | `babysitting` | the problem |
| b010 | 42-48 | paragraph | 477 | keep | README.md | `the whole stash into every map` | the predecessor story and the stash metaphor |
| b011 | 50-52 | paragraph | 174 | keep | README.md | `compiled` | compiled rules, composable mechanisms |
| b012 | 54-54 | listItem | 81 | keep | README.md | `a structural guard, not a plea` | compiled rule one |
| b013 | 55-55 | listItem | 78 | keep | README.md | `a gate the model cannot talk past` | compiled rule two |
| b014 | 56-57 | listItem | 94 | keep | README.md | `a bounded work order, not a transcript` | compiled rule three |
| b015 | 58-59 | listItem | 106 | keep | README.md | `six named conditions` | compiled rule four |
| b016 | 60-62 | listItem | 234 | keep | README.md | `hold, shrink, grow, peak, reset, or loop` | compiled rule five |
| b017 | 64-69 | paragraph | 457 | keep | README.md | `a build, not a biography` | the build sentence and the mission |
| b018 | 71-71 | paragraph | 22 | keep | README.md | `The reference loop` | lead-in to the loop |
| b019 | 73-81 | code | 461 | keep | README.md | `intent → task-scoped build → bounded WorkOrder → disposable executor` | the loop diagram |
| b020 | 83-83 | heading | 18 | keep | README.md | `## What runs today` | — |
| b021 | 85-93 | html | 534 | cut | docs/product/07-execution-guide.md | `is edited only by an order whose leading header carries` in docs/product/07-execution-guide.md | the maintainer comment; its rule becomes a sentence in product 07 §Documentation freshness and ownership and a refusal in the document check |
| b022 | 94-94 | html | 28 | keep | README.md | `<!-- DOTLN-RELEASE-BEGIN -->` | the generated block's opening marker |
| b023 | 96-96 | paragraph | 37 | keep | README.md | `This source prepares DotLn `v` | the generated version claim, the only line between the markers |
| b024 | 98-101 | paragraph | 287 | keep | README.md | `loadout`; `replay` | the core, restated for a reader: the compiler, the envelope the kernel checks, and replay |
| b025 | 103-161 | paragraph | 4321 | keep | README.md | `resident host`; `blinded verifier`; `pull request`; `actor board`; `console witnesses`; `on-mission` in docs/product/03-architecture.md; `5S candidates` in docs/evidence/WO-111/implementation.md; `scratch trust` in docs/evidence/WO-111/decisions.md; `dotln resident` in packages/skeleton/README.md; `actor board` in packages/console/README.md; `screenshot` in packages/browser-evidence/README.md; `killed-host` in docs/evidence/WO-053/README.md; `repair loop` in docs/evidence/WO-055/implementation.md; `clause` in docs/evidence/WO-056/README.md; `outward` in docs/evidence/WO-063/implementation.md; `repo.push` in docs/evidence/WO-064/decisions.md; `--require-deliverable-ready` in docs/evidence/WO-182/artifact-contract.md; `npm run dotln -- vertical` in docs/evidence/WO-112/README.md; `Codex's sandbox` in docs/evidence/WO-112/README.md | the runnable capabilities stay in What runs today, told for a reader; each per-order receipt and its link already live in the named evidence |
| b026 | 163-167 | paragraph | 382 | keep | README.md | `npm run dotln -- intent` | derived work and intent |
| b027 | 169-177 | paragraph | 662 | keep | README.md | `npm run console -- board`; `loopback` in packages/console/README.md; `owner-only` in packages/console/README.md; `classifier` in packages/console/README.md | the console; its loopback contract stays in the console README |
| b028 | 179-183 | paragraph | 346 | cut | docs/evidence/WO-160/README.md | `Amendment withdrawal` in docs/evidence/WO-160/README.md | a per-order receipt |
| b029 | 185-208 | paragraph | 1648 | cut | docs/product/07-execution-guide.md | `two credible ways to the same result` in docs/product/07-execution-guide.md; `three-trial` in docs/evidence/WO-145/decisions.md; `default equipment` in docs/evidence/WO-150/decisions.md; `refuse five conditions` in docs/AI-HARNESS-SECURITY.md; `operator override:` in docs/product/07-execution-guide.md; `helper command printed by` in docs/product/07-execution-guide.md | experiments, the five refusals and recovery controls; product 07 §Discipline, §Operator recovery controls and the harness security note already hold them |
| b030 | 210-215 | paragraph | 407 | cut | docs/AI-HARNESS-SECURITY.md | `Copilot` in docs/AI-HARNESS-SECURITY.md; `1.0.86` in docs/evidence/WO-146/decisions.md | the Copilot qualification receipt |
| b031 | 217-222 | paragraph | 427 | keep | README.md | `Not yet built`; `portable starter export`; `CONTRIBUTING.md`; `github.com/DylanBWood/DotLn/releases`; `docs/planning/refutations/README.md` | what is not built and the three standing links |
| b032 | 223-223 | html | 26 | keep | README.md | `<!-- DOTLN-RELEASE-END -->` | the generated block's closing marker |
| b033 | 225-225 | paragraph | 67 | cut | packages/skeleton/README.md | `first shipped in application release` in packages/skeleton/README.md | a version |
| b034 | 227-228 | paragraph | 105 | keep | README.md | `Repo Gardener`; `Seiri` | the scenario |
| b035 | 230-239 | code | 461 | cut | packages/skeleton/README.md | `🐛 Repo Gardener` in packages/skeleton/README.md; `💤 faded/cancelled` in packages/skeleton/README.md | the glyph timeline; the skeleton README documents the run |
| b036 | 241-244 | code | 40 | keep | README.md | `npm install`; `npm run skeleton` | how to try it |
| b037 | 246-247 | paragraph | 139 | keep | README.md | `numbered timeline` | what the run prints |
| b038 | 249-253 | code | 189 | cut | packages/skeleton/README.md | `verified=true candidates=1` in packages/skeleton/README.md | the printed receipt |
| b039 | 255-257 | paragraph | 206 | cut | packages/skeleton/README.md | `--compiled-diff` in packages/skeleton/README.md | a runner flag |
| b040 | 259-265 | paragraph | 524 | cut | packages/skeleton/README.md | `--beacons <directory>` in packages/skeleton/README.md; `1970` in packages/skeleton/README.md | a runner flag and the Beacon demo |
| b041 | 267-270 | paragraph | 332 | cut | packages/skeleton/README.md | `intentionally discloses codebook fields` in packages/skeleton/README.md; `codebook` in docs/discovery/beacon-probe-2026-09-04.md | Beacon metadata detail |
| b042 | 272-307 | paragraph | 2638 | move | CONTRIBUTING.md | `npm test -- --list` in CONTRIBUTING.md; `npm test -- --review` in CONTRIBUTING.md; `--again` in CONTRIBUTING.md; `test:machinery` in CONTRIBUTING.md; `test:docs` in CONTRIBUTING.md; `--confined-partial` in CONTRIBUTING.md; `needs: outside-sandbox` in CONTRIBUTING.md; `--inside-sandbox` in CONTRIBUTING.md; `evidence:artifact` in CONTRIBUTING.md; `Node 26` in CONTRIBUTING.md; `TypeScript 7.0.2` in CONTRIBUTING.md; `macOS` in CONTRIBUTING.md; `0003-personal-ai-harness-security.md` in CONTRIBUTING.md; `code identity` in CONTRIBUTING.md | test runner, sandbox posture and toolchain detail; CONTRIBUTING gains a Toolchain and tests section |
| b043 | 309-309 | heading | 42 | cut | — |  | a heading over paragraphs that leave; no fact of its own |
| b044 | 311-311 | paragraph | 7 | cut | — |  | a list label |
| b045 | 313-314 | listItem | 99 | cut | packages/kernel/README.md | `perform no I/O and consult no ambient clock or randomness` in packages/kernel/README.md | proven: pure kernel |
| b046 | 315-316 | listItem | 111 | cut | packages/skeleton/README.md | `replayScenario` in packages/skeleton/README.md | proven: replay |
| b047 | 317-318 | listItem | 97 | cut | packages/skeleton/README.md | `structurally refuses deletion` in packages/skeleton/README.md | proven: structural refusal |
| b048 | 319-320 | listItem | 93 | cut | packages/skeleton/README.md | `dispatching its identity twice` in packages/skeleton/README.md | proven: crash recovery without a duplicate effect |
| b049 | 321-322 | listItem | 86 | cut | packages/skeleton/README.md | `handles operator return` in packages/skeleton/README.md | proven: operator return |
| b050 | 323-323 | listItem | 66 | cut | packages/skeleton/README.md | `glyph projections` in packages/skeleton/README.md | proven: honest glyphs |
| b051 | 324-325 | listItem | 136 | cut | docs/product/07-execution-guide.md | ``docs/control/orders/WO-NNN.jsonl` segments` in docs/product/07-execution-guide.md | proven: per-order control segments |
| b052 | 327-327 | paragraph | 31 | keep | README.md | `Not yet built` | the not-built label |
| b053 | 329-329 | listItem | 70 | keep | README.md | `general source-writing worker` | not built |
| b054 | 330-330 | listItem | 59 | keep | README.md | `Seiri` | not built: composition beyond the Seiri subset |
| b055 | 331-331 | listItem | 52 | keep | README.md | `saved community builds` | not built |
| b056 | 332-332 | listItem | 56 | keep | README.md | `interactive` | not built: an interactive console |
| b057 | 333-333 | listItem | 63 | keep | README.md | `SQLite` | not built: persistence, hosting, a published package |
| b058 | 334-334 | listItem | 69 | keep | README.md | `source-to-deliverable` | not built: the complete verified pipeline |
| b059 | 336-339 | paragraph | 263 | cut | docs/product/06-roadmap.md | `every rung ships a visible payoff` in docs/product/06-roadmap.md; `causal timeline` in docs/product/09-audit-resilience-privacy.md | roadmap rungs and the three audit projections |
| b060 | 341-341 | heading | 11 | keep | README.md | `The bets` | — |
| b061 | 343-345 | listItem | 215 | keep | README.md | `incarnation, not a memory` | bet |
| b062 | 346-348 | listItem | 159 | keep | README.md | `Deterministic core` | bet |
| b063 | 349-351 | listItem | 217 | keep | README.md | `safety is boring` | bet |
| b064 | 352-353 | listItem | 111 | keep | README.md | `precedes "done."` | bet |
| b065 | 354-356 | listItem | 182 | keep | README.md | `and verifier are different roles` | bet |
| b066 | 357-358 | listItem | 161 | keep | README.md | `Doing nothing is a decision` | bet |
| b067 | 359-361 | listItem | 183 | keep | README.md | `Every metaphor reveals its mechanics` | bet |
| b068 | 362-364 | listItem | 170 | keep | README.md | `The substrate is shared; the doctrine is yours` | bet |
| b069 | 365-366 | listItem | 125 | keep | README.md | `No fake numbers` | bet |
| b070 | 368-370 | paragraph | 169 | keep | README.md | `selection function` | the scarce resource |
| b071 | 372-372 | heading | 34 | cut | — |  | a heading over paragraphs that leave; no fact of its own |
| b072 | 374-377 | paragraph | 312 | keep | README.md | `UIFA`; `wee-fuh`; `wee-fuh` in docs/product/00-vision.md | the interface name and the five roles, in one sentence; the full treatment is product 13 |
| b073 | 379-381 | listItem | 191 | cut | docs/product/13-uifa-roles.md | `UIFA product lead` in docs/product/13-uifa-roles.md | a role |
| b074 | 382-384 | listItem | 181 | cut | docs/product/13-uifa-roles.md | `UIFA showrunner` in docs/product/13-uifa-roles.md | a role |
| b075 | 385-387 | listItem | 194 | cut | docs/product/13-uifa-roles.md | `UIFA engineer` in docs/product/13-uifa-roles.md | a role |
| b076 | 388-390 | listItem | 234 | cut | docs/product/13-uifa-roles.md | `UIFA tester` in docs/product/13-uifa-roles.md | a role |
| b077 | 391-392 | listItem | 128 | cut | docs/product/13-uifa-roles.md | `UIFA devops` in docs/product/13-uifa-roles.md | a role |
| b078 | 394-400 | paragraph | 468 | cut | docs/product/13-uifa-roles.md | `kitchen` in docs/product/13-uifa-roles.md | why people stay in the loop and the eight settings |
| b079 | 402-402 | heading | 29 | keep | README.md | `The game is not decoration` | — |
| b080 | 404-405 | paragraph | 137 | keep | README.md | `action RPGs` | why the game vocabulary |
| b081 | 407-418 | table | 1211 | cut | docs/product/04-interfaces.md | `Rarity encodes provenance` in docs/product/04-interfaces.md; `Set bonuses compile to real mechanics` in docs/product/04-interfaces.md | the view table; product 04 holds the mechanics |
| b082 | 420-427 | paragraph | 590 | keep | README.md | `scope, not sequence`; `Rarity encodes provenance, never power`; `Ladder of Leadership` | links, rarity, the authoring thesis |
| b083 | 429-433 | paragraph | 348 | keep | README.md | `Path of Building for organizations` | the long-term surface |
| b084 | 435-435 | heading | 29 | keep | README.md | `Three horizons, one kernel` | — |
| b085 | 437-438 | listItem | 154 | keep | README.md | `Work operating system` | horizon one |
| b086 | 439-440 | listItem | 151 | keep | README.md | `Executable pattern workshop` | horizon two |
| b087 | 441-443 | listItem | 218 | keep | README.md | `simulation laboratory` | horizon three |
| b088 | 445-454 | paragraph | 758 | cut | docs/product/06-roadmap.md | `Teammate-ready` in docs/product/06-roadmap.md; `Launchpad and cross-repository` in docs/product/06-roadmap.md; `cross-repository` in docs/planning/phase-two-plan-2026-09-06.md; `never read these docs` in README.md | the dated ladder and the plan link; the roadmap holds the ladder and the 1.0 exit criterion stays on the page without its version |
| b089 | 456-463 | paragraph | 553 | keep | README.md | `προτείνω`; `basketball` | the flagship |
| b090 | 465-465 | heading | 46 | cut | — |  | a heading over paragraphs that leave; no fact of its own |
| b091 | 467-470 | listItem | 242 | cut | docs/product/02-domain-model.md | `CommandRefused` in docs/product/02-domain-model.md | refusal as an event |
| b092 | 471-489 | listItem | 1416 | cut | docs/product/03-architecture.md | `Blackjack` in docs/product/03-architecture.md; `payoff curve` in docs/product/03-architecture.md; `scratch trust` in docs/evidence/WO-111/decisions.md | presence policy and its analogy; the receipt stays in its evidence |
| b093 | 490-493 | listItem | 271 | cut | docs/lineage/idea-ledger.md | `Magnetic-LED whiteboard` in docs/lineage/idea-ledger.md; `index card` in docs/product/04-interfaces.md | index cards |
| b094 | 494-496 | listItem | 212 | cut | docs/product/05-pattern-library.md | `optometrist` in docs/product/05-pattern-library.md; `about the same` in docs/product/05-pattern-library.md | the optometrist |
| b095 | 497-500 | listItem | 266 | cut | docs/product/05-pattern-library.md | `commedia` in docs/product/05-pattern-library.md; `Whiteface` in docs/product/05-pattern-library.md; `Lazzi` in docs/product/05-pattern-library.md | the party |
| b096 | 501-504 | listItem | 265 | cut | docs/product/04-interfaces.md | `horizontal mirror` in docs/product/04-interfaces.md; `Evidence-Bound` in docs/product/04-interfaces.md | the glyph grammar |
| b097 | 505-509 | listItem | 363 | cut | docs/product/00-vision.md | `Memento` in docs/product/00-vision.md; `Inception` in docs/product/00-vision.md; `Ex Machina` in docs/product/00-vision.md | the film sources |
| b098 | 510-515 | listItem | 433 | cut | docs/lineage/inspirations.md | `Twelve Days` in docs/lineage/inspirations.md | the context analogy |
| b099 | 516-520 | listItem | 366 | cut | docs/lineage/idea-ledger.md | `eleven chats` in docs/lineage/idea-ledger.md; `forty-six images` in docs/lineage/idea-ledger.md; `recency bias` in docs/lineage/idea-ledger.md | the append-only ledger |
| b100 | 521-523 | listItem | 231 | cut | docs/product/05-pattern-library.md | `naive interventionism` in docs/product/05-pattern-library.md; `compensating function` in docs/product/05-pattern-library.md | the mechanic that argues for leaving things alone |
| b101 | 525-525 | heading | 38 | keep | README.md | `license` | — |
| b102 | 527-535 | paragraph | 632 | keep | README.md | `docs/lineage/inspirations.md`; `Names identify sources` | no claim of novelty; the register |
| b103 | 537-550 | paragraph | 1008 | keep | README.md | `Apache License 2.0`; `Creative Commons Attribution 4.0`; `docs/LEGAL.md`; `Developer Certificate of Origin 1.1` in CONTRIBUTING.md; `license-surfaces` in CONTRIBUTING.md; `private: true` in CONTRIBUTING.md | the license line; contributor detail already lives in CONTRIBUTING |
| b104 | 552-552 | heading | 26 | keep | README.md | `The repo runs on itself` | — |
| b105 | 554-558 | paragraph | 370 | keep | README.md | `A model that implements never verifies its own work` | the loop, from the inside |
| b106 | 560-568 | code | 123 | keep | README.md | `resume: status`; `resume: release close` | the resume phrases |
| b107 | 570-576 | paragraph | 541 | keep | README.md | `append-only control log`; `code identity` | what the phrase resolves against |
| b108 | 578-590 | paragraph | 1011 | keep | README.md | `Driving the car while building it`; `Gödel, Escher, Bach`; `effort refusal` in docs/evidence/WO-132/decisions.md; `ran at low` in docs/work-orders/WO-019-effort-truth.md | the honesty paragraph; its receipts stay in the records that hold them |
| b109 | 592-595 | paragraph | 294 | keep | README.md | `more blueprint than code`; `strangler` | the ratio |
| b110 | 597-597 | heading | 6 | keep | README.md | `## Map` | — |
| b111 | 599-600 | listItem | 101 | keep | README.md | `packages/kernel/` | map |
| b112 | 601-602 | listItem | 97 | keep | README.md | `packages/skeleton/` | map |
| b113 | 603-604 | listItem | 157 | keep | README.md | `packages/console/` | map; the board is no longer read-only |
| b114 | 605-606 | listItem | 115 | keep | README.md | `scripts/` | map |
| b115 | 607-610 | listItem | 290 | keep | README.md | `docs/product/` | map |
| b116 | 611-612 | listItem | 109 | keep | README.md | `docs/work-orders/` | map |
| b117 | 613-615 | listItem | 141 | keep | README.md | `docs/verifications/`; `docs/final-reviews/` | map |
| b118 | 616-617 | listItem | 97 | keep | README.md | `docs/control/` | map |
| b119 | 618-619 | listItem | 102 | keep | README.md | `docs/lineage/` | map |
| b120 | 620-622 | listItem | 178 | keep | README.md | `docs/LEGAL.md` | map; the decision's date leaves |
| b121 | 623-624 | listItem | 177 | keep | README.md | `docs/decisions/` | map |
| b122 | 625-626 | listItem | 90 | keep | README.md | `docs/releases/` | map |
| b123 | 627-629 | listItem | 162 | keep | README.md | `docs/publication/` | map |
| b124 | 630-631 | listItem | 102 | keep | README.md | `corpus/` | map |
| b125 | 632-632 | listItem | 72 | keep | README.md | `docs/intake/` | map |
| b126 | 634-638 | paragraph | 300 | keep | README.md | `docs/product/00-vision.md`; `docs/product/02-domain-model.md`; `docs/product/03-architecture.md`; `packages/skeleton/README.md` | where to read next |
| b127 | 640-640 | heading | 34 | keep | README.md | `One boundary that does not move` | — |
| b128 | 642-649 | paragraph | 597 | keep | README.md | `clean-room`; `docs/intake/` | the boundary |
| b129 | 651-651 | heading | 15 | keep | README.md | `Why "DotLn"?` | — |
| b130 | 653-657 | paragraph | 385 | keep | README.md | `Days of the Natural Logarithm`; `log-odds` | the name |
| b131 | 659-661 | paragraph | 188 | keep | README.md | `early on purpose` | the close |
