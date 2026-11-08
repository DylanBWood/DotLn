# WO-259 decisions

## WO-259-D001

```json
{
  "id": "WO-259-D001",
  "date": "2026-11-08",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.122.0, the next minor above the observed release baseline v0.121.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.121.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-259-committed-words-and-filed-records.md"
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

## WO-259-D002

The review ladder runs on GPT workers through the kit's review helper.

```json
{
  "id": "WO-259-D002",
  "date": "2026-11-08",
  "dispatch": "resume: next; mid-session the operator asked for the review workers to run on GPT",
  "decision": "Run this execution's review ladder through the kit's review helper on the Codex host, npm run worker -- review --kind <kind> --host codex, whose host default is the sol option (gpt-6.1-sol at max effort) because this dispatch line named no astra; the helper records each report under docs/control/local/reviews/WO-259/, a recheck passes --recheck with the earlier report and a combined round --since the tree round 2 reviewed. The operator's direction is paraphrased here; its words are in the ignored capture SHA-256 29ccf09f2a10d3d1d567620b9c52f43373b681d7a6258e3b3a097bcd5a299a8c.",
  "evidence": [
    "The operator's mid-session message, captured at docs/intake/operator/wo259-review-workers-2026-11-08.txt (ignored).",
    "Role text: a review worker on the other host (Codex from Claude) runs through npm run worker -- review --host codex, which without --model takes the dispatch line's option, else the host default.",
    "codex --version: codex-cli 0.167.0; npm run worker -- review --kind criteria --host codex --order WO-259 --dry-run printed option sol (host-default) and --model gpt-6.1-sol."
  ],
  "rejected": [
    {
      "option": "Claude dotln-worker reviewers launched with the Agent tool",
      "reason": "The operator asked for GPT reviewers, and the helper is the kit's route to a Codex worker from a Claude session."
    },
    {
      "option": "The astra option (gpt-6-astra)",
      "reason": "Only a dispatch line naming astra selects it; this one named none, so the host default stands."
    }
  ],
  "reopenWhen": "The Codex CLI refuses or cannot run a launch here, or the operator names another model or host."
}
```

## WO-259-D003

Every role and both hosts' workers carry the paraphrase rule and the two no-print rules; the router names awaiting-plan-approval; the cold starts stay within their acceptances.

```json
{
  "id": "WO-259-D003",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 1",
  "decision": "Define the rule that committed text paraphrases the operator (operatorWordsRule) and the rules that a worker never reads or prints the contents of docs/control/local/ and never prints a commit header or an author line (workerNoPrintRules) once, in packages/compiler/src/harness.ts beside the worker definition, which carries both with a sentence that what a worker returns may be filed and so paraphrases the operator too; contributor.ts adds both to the shared corrections every role but the router takes and to the router's own procedure, adds awaiting-plan-approval to the router's stop list with the operator's next step, and has the reviewer's target clause commit the instance records before target-records (D012). The three worker definitions (.claude/agents/dotln-worker.md, dotln-worker-fable.md, .codex/agents/dotln-worker-astra.toml) render the one prompt. The role oracle gains packages/skeleton/fixtures/wo259-role-baseline.json over the unchanged wo243-role-baseline.json, read by scripts/test-process-debt.mjs and scripts/test-gate-followups.mjs and declared in the process-debt sources. Cold starts (installed CLAUDE.md plus each root): executor 44,563 to 45,319 (+756), planner 30,780 to 31,536 (+756), refuter 27,560 to 28,316 (+756), release-close 28,638 to 29,394 (+756), reviewer 41,289 to 42,117 (+828), router 17,124 to 17,991 (+867), verifier 38,715 to 39,471 (+756); budgetVerdict reads every root accepted against WO-258-D013's acceptances (the router within its 21,220 ceiling, the refuter unset), so no ceiling moves and no optimization follow-up is owed.",
  "evidence": [
    "scratch measurement with harnessInstallation() and harnessInstructionBlock, as test-gate-followups.mjs measures; budgetVerdict over docs/control/budgets.json: executor, planner, release-close, reviewer, verifier accepted; router within; refuter unset.",
    "grep: every SKILL.md under .claude/skills/ and .agents/skills/ and the three worker definitions carry the two rule strings; tomllib parses .codex/agents/dotln-worker-astra.toml with the rules intact.",
    "scripts/lib/drive-route.mjs returns the stop awaiting-plan-approval after PlanProposed, the reason WO-242-D027 found missing from the role text (FUP-1c2f009b880027e6)."
  ],
  "rejected": [
    {
      "option": "Separate wording for roles and workers",
      "reason": "One definition read by both keeps them from drifting; the worker's extra sentence states why the rule reaches what it returns."
    },
    {
      "option": "Trim other duties to fit the ceilings",
      "reason": "Every root stays within its recorded acceptance, and product 07 keeps reviewed rules whole."
    }
  ],
  "reopenWhen": "A root's cold start passes its accepted ceiling, or a host renders the worker prompt differently from the shared definition."
}
```

## WO-259-D004

The review brief's preamble carries the three rules through the worker definition it embeds.

```json
{
  "id": "WO-259-D004",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 2",
  "decision": "Leave scripts/lib/review-worker.mjs's preamble as it is: it already opens with workerSpecification(worker).prompt of the generated dotln-worker for every kind and both hosts, so D003's rules reach every brief from the same definition; a case in scripts/test-review-worker.mjs pins all three rules before the brief's ## Brief heading for each kind on both hosts and the printed measured size.",
  "evidence": [
    "npm run worker -- review --kind criteria --host claude --order WO-259 --dry-run on 2026-11-08: the preamble carries both rule strings and the author-line clause; measured.brief 32,650 characters against the 400,000 ceiling in one batch (40,654 after the write-backs).",
    "scripts/lib/review-worker.mjs renderBrief: ## Worker opens with the dotln-worker prompt for every kind and host."
  ],
  "rejected": [
    {
      "option": "A second copy of the rules in the preamble",
      "reason": "The embedded definition already carries them; a copy could drift from the generated worker."
    }
  ],
  "reopenWhen": "A brief renders a worker definition other than the generated dotln-worker, or a host's brief omits it."
}
```

## WO-259-D005

The verbatim-operator-words election turns the rule off: both document checks advise instead of failing.

```json
{
  "id": "WO-259-D005",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 3",
  "decision": "Add the feature row verbatim-operator-words (scope instance, default false, read by scripts/docs-check.mjs). Elected, the verbatim screen's findings and the attributed-speech failure of a record the branch adds print as advisories; the typed operatorQuote keeps its shape (text, captureSha256 and, where a branch adds it, requestedIn) whatever the election, since a session under the election may simply write the words. npm run meta regenerates docs/control/FEATURES.md.",
  "evidence": [
    "scripts/lib/feature-registry.mjs row; npm run sync regenerated docs/control/FEATURES.md with the row.",
    "scripts/test-docs-check.mjs: with the election the changed record's run prints ADVISORY and the check exits 0."
  ],
  "rejected": [
    {
      "option": "Let the election also waive requestedIn",
      "reason": "The typed field is the exception's schema; under the election nothing requires the field at all."
    }
  ],
  "reopenWhen": "An instance elects the feature and needs the typed exception's shape relaxed, or a new check reads the election."
}
```

## WO-259-D006

The document gate holds a branch to the rule: what it adds is screened against the captures, and a record it adds fails on attributed speech without a capture citation.

```json
{
  "id": "WO-259-D006",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 4",
  "decision": "scripts/lib/branch-changes.mjs reads a branch's change against its merge base with main (the working tree, untracked files whole, renames found, binaries and pure deletions left out), and docs-check judges only what it adds. (a) A current record's attributed speech without a capture citation fails where a line the branch adds falls inside the record's own lines (a decision's section, a provenance field's own lines, a paragraph), and stays the advisory elsewhere; the historical baseline keeps its note. (b) An operatorQuote in a record the branch adds needs requestedIn beside captureSha256. (c) scripts/lib/verbatim-screen.mjs compares each line the branch adds to Markdown under a document root or at the repository root, or to source under scripts/ and packages/*/src/, with every text capture under this checkout's ignored intake root, and a run of VERBATIM_WINDOW = 12 consecutive normalized words (the terms check's tokens) both hold fails naming the file, the line and the capture's sha256 digest, never the words; a run the repository already held at the merge base is excluded, because a capture may quote the repository's own text; a run inside an operatorQuote with requestedIn that names that capture is the exception; no capture prints verbatim screen: no captures and passes; no merge base screens nothing and says so. The window's reason: over the lines the last six merges added (175 files) against this repository's 540 text captures, the runs not explained by text already in the repository at the base were 66 lines at 8 words, 27 at 10 and 15 at 12, the 12-word ones being technical passages carried nearly verbatim from blocks pasted into a dispatch; a 12-word run is a copy, not a coincidence. The screen reads this checkout's intake only: a linked worktree holds the captures made there, so an executor's worktree usually prints no captures, while a planning branch in the main checkout reads all of main's.",
  "evidence": [
    "scratch window-measure.mjs and window-classify.mjs (counts, files, lines and capture directories only; no words printed): base 772979ea, six merges; W=6 744 lines, W=8 186 (66 not in base), W=10 83 (27), W=12 37 (15), W=16 7.",
    "scratch screen-main-intake.mjs: this branch against main's 535 text captures, 0 findings, 3.8 s and 345 MB peak after the hashed matcher and the batched base read (16 s and 1 GB before them).",
    "scripts/test-docs-check.mjs cases: the changed decisions file fails by file, line and digest; the requested quotation passes; requestedIn missing fails; the election advises; a changed scripts/ file fails the same way; no capture passes; an unchanged file and a run already in the base are no findings; a current record fails where the branch adds it while a baselined one keeps its note and a carried one its advisory; an amended header field leaves an old provenance field unjudged.",
    "This checkout's own records: 110 attributed-speech advisories stand in files this branch does not change, so the forward-only scope fails none of them."
  ],
  "rejected": [
    {
      "option": "Fail every current (unbaselined) attributed-speech record",
      "reason": "An instance's seeded baseline lists no operator words, so every record it wrote under the earlier advisory would fail on upgrade, and records cannot be rewritten."
    },
    {
      "option": "Screen whole changed files",
      "reason": "A standing document the branch edits would fail on lines another branch wrote."
    },
    {
      "option": "A window of 6 or 8 words",
      "reason": "Commands, paths and shared technical phrases repeat across captures and records at that length (186 lines at 8 words in the sample)."
    },
    {
      "option": "Read the main checkout's intake from a linked worktree",
      "reason": "The order names the checkout's intake root, and main's intake also holds preserved control lanes and mining notes that are not the operator's words."
    }
  ],
  "reopenWhen": "A copy shorter than twelve words reaches a committed record, the screen fails a line whose run is not the operator's words, or an executor's committed text carries words from a capture its worktree's screen did not read."
}
```

## WO-259-D007

The document gate's measured cost, before and after.

```json
{
  "id": "WO-259-D007",
  "date": "2026-11-08",
  "dispatch": "resume: next; criterion 10 timings",
  "decision": "Record the timings the order owes: node scripts/docs-check.mjs on this worktree took 34,095, 34,715 and 33,570 ms before the change (median 34,095) and 35,033, 34,418 and 34,511 ms after (median 34,511), a difference inside the runs' own spread; the screen itself costs nothing without captures, and 3.8 s against main's 22 MB of captures. The new terms task (node scripts/terms.mjs branch) took 1,040, 1,084 and 1,114 ms (median 1,084) over this branch's 106 changed files; before this order there was no such task.",
  "evidence": [
    "Three timed runs each, before (at 898f95ff with the dispatch's projections) and after (this tree), 2026-11-08, exit 0 every run.",
    "terms branch output: local-terms list: present; 106 changed files screened, 0 findings."
  ],
  "rejected": [
    {
      "option": "Read the timings from gate rows",
      "reason": "No gate row ran docs-check before the change on this tree; direct timed runs compare the same command."
    }
  ],
  "reopenWhen": "The docs-check task's median grows by more than five seconds over 34 s, or the terms task's passes five seconds on an ordinary branch."
}
```

## WO-259-D008

A background worker's hand-back is journaled as the host's, by its envelope; the plan check refuses it as a rule's source and the intervention count leaves it out.

```json
{
  "id": "WO-259-D008",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 5",
  "decision": "harness-host.ts journals a prompt that is one or more hand-back envelopes with source host-agent-handback, attribution host, route mid-turn and routeSource host-agent-handback-envelope, checked before the transcript because the host queues a hand-back in the same prompt mode as the operator's own messages. The envelope is an agent-message element whose opening tag names the worker in its from attribute, then the host's frame line under the [Subagent hand-back] label, then the report with every line indented by the host, then the closing tag; a line at column zero inside it, a missing frame or text after the element leaves the prompt as it was. checkRulesRecorded refuses a rule citing such a row, naming the source; plan failures counts it as hostHandbacks apart from the interventions. Adjacent repair: the operator-question context is no longer added to a hand-back or a terminal task notification that ends in a question mark.",
  "evidence": [
    "Re-observed in this session on 2026-11-08 (Claude Code, metadata only): a probe worker's hand-back arrived as a queued command, transcript queue-operation enqueue without a command mode and attachment queued_command with commandMode prompt; 581 bytes in 4 lines: the opening agent-message tag with a from attribute, the frame line opening [Subagent hand-back] (474 characters), one report line indented by two spaces, the closing tag. The hook journaled it as OperatorMessageObserved, source claude-prompt-hook, route unknown, routeSource host-route-unavailable, attribution unattributed, class unclassified, leadingElement agent-message, 581 bytes. The separate task-notification (871 bytes, commandMode task-notification) wrote no journal row this time.",
    "The 2026-11-07 pass document, Readings, recorded the same shape for its refuter (6,137 bytes).",
    "scripts/test-harness.mjs case: four hand-back shapes, including a queued_command row in prompt mode and a user row, journal host-agent-handback; five malformed shapes keep their attribution; interventions 0 and hostHandbacks 4."
  ],
  "rejected": [
    {
      "option": "Drop the hand-back's journal row",
      "reason": "The journal keeps every prompt it saw; the row says whose it is."
    },
    {
      "option": "Let a matching transcript row decide first, as for the task notification",
      "reason": "The host's queued_command row reads commandMode prompt for a hand-back, which would attribute it to the operator."
    }
  ],
  "reopenWhen": "The host changes the hand-back envelope (another element, frame label or indentation), or a host other than Claude Code hands back through the prompt hook."
}
```

## WO-259-D009

The local-terms list screens what a branch adds, in the document gate and in the launchpad's publish helpers.

```json
{
  "id": "WO-259-D009",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 6",
  "decision": "scripts/lib/branch-terms.mjs runs localTermFindings (checkLocalTerms's findings form, which no longer has to throw to report) over every text file the branch adds or changes and keeps the matches that touch a line it adds. The document selection gains the terms task (node scripts/terms.mjs branch, a preflight document task, stubbed in the runner's CLI-selection fixture through DOCUMENT_GATE_STUBS): on a branch the base is the merge base with main, on main the first parent of the last merge; a match fails as FAIL <file>:<line>: a local term in <mode> mode and never prints the term; without a registered list it prints local-terms list: unavailable and an advisory and passes. The planning and update doors of scripts/lib/launchpad-publish.mjs and the launchpad form of scripts/worktree.mjs screen the branch's committed change the same way before the first remote mutation. Every text file is screened, not only Markdown and kit text, because every file a branch commits is outward once pushed and the instance's report was an order's records. Within the Boy Scout bound (FUP-1b94e79e02e54e70, WO-227-D026): a malformed list refuses a publish door with the list's own line message and the pointer npm run terms -- check <path>, and the outward lint's local-terms.configuration finding now says the list could not be read and that the terms check names the line.",
  "evidence": [
    "scripts/test-runner.test.mjs case: npm run test:docs fails first in terms with FAIL docs/carried.md:3: a local term in refuse mode and without the term; without a list it passes and the task prints the advisory.",
    "scripts/test-plan-refutation.mjs and scripts/test-launchpad-update.mjs cases: both doors refuse a branch whose committed change carries the term before any push; the planning door refuses a malformed list naming line 3.",
    "node scripts/terms.mjs branch on this branch: present; 106 changed files screened, 0 findings."
  ],
  "rejected": [
    {
      "option": "Screen every committed file on every gate",
      "reason": "The export already screens its whole kit once; a gate screens the branch's change."
    },
    {
      "option": "Screen whole changed files",
      "reason": "A term in a line another branch wrote was screened then; the list grows over time, and an unrelated branch would fail on it."
    }
  ],
  "reopenWhen": "A term reaches a commit through a file the screen does not read, or the task's cost grows past five seconds on an ordinary branch."
}
```

## WO-259-D010

The launchpad publish form reads the committed phase before anything else.

```json
{
  "id": "WO-259-D010",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 7",
  "decision": "node scripts/worktree.mjs publish WO-NNN --title --body-file refuses unless the order's committed control record (readControl at HEAD) shows phase closed with a passing FinalReviewCompleted, naming the phase it read, before the release-surface check and any remote step, as the final target form does. The form already refused a non-closed phase indirectly, through release.mjs check-surfaces --committed (committed surface check requires closed control state), which WO-257-D046's verifier did not credit; the direct check names the reason and no longer depends on a subprocess. This delivers FUP-9cfd1cd290f68d1b.",
  "evidence": [
    "scripts/release.mjs checkSurfaces: a revision requires phase closed; scripts/lib/control.mjs: only a passing FinalReviewCompleted folds to closed.",
    "scripts/test-worktree.sh: the hidden-working-control case now expects WO-099 has no committed passing final review: its committed control record reads phase active; the later reviewed publish still opens its pull request."
  ],
  "rejected": [
    {
      "option": "Rely on the surface check's refusal",
      "reason": "Its message names the surface check, not the review the publish needs, and it runs the subject's own release.mjs."
    }
  ],
  "reopenWhen": "A session publishes an order branch whose committed record shows no passing final review."
}
```

## WO-259-D011

Discovery names an unparsable record and records each observation once.

```json
{
  "id": "WO-259-D011",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 8",
  "decision": "scripts/resume.mjs reads docs/discovery/environment.json once per command; a parse error is named on the attestation (Advisory: attestation recorded as supplied; <path> cannot be parsed (<error>), so ... was not compared with any discovery observation) and in resume status (Discovery record: ...), distinct from has no matching discovery observation, with the parser's own message and the repository-relative path so no absolute path prints. scripts/discover.mjs names a record it cannot parse or that holds no harnesses record, gives a record without versions or versionLines its list, appends a version only when its value is new and a line only when its line is new, rewrites the selector and the session readback only when they differ, writes the file only when something changed and returns status recorded or already recorded with the per-kind flags.",
  "evidence": [
    "scripts/test-resume.sh: a hand-broken record is named in status and on a refused attestation, without an absolute path and without the missing-observation advisory.",
    "scripts/test-process-debt.mjs: a record without versions records one version and one line; an identical second run returns already recorded and leaves the file's bytes unchanged; a newer patch on the same line records a version and no second line; an unparsable record and one without harnesses are named."
  ],
  "rejected": [
    {
      "option": "Keep appending on every run and deduplicate when reading",
      "reason": "The record would keep growing, and the readers already treat it as a set of observations."
    }
  ],
  "reopenWhen": "A probe records a duplicate version or line, or a parse error reads as a missing observation."
}
```

## WO-259-D012

A filed target record's links resolve at the launchpad commit its footer names, because the records are committed before they move.

```json
{
  "id": "WO-259-D012",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 9",
  "decision": "commitTargetRecords refuses a first filing, naming the records commit, while a source differs from the launchpad's HEAD (untracked, staged or edited) or a file a source's relative links reach is absent at HEAD (read with cat-file --batch-check, moved documents resolved through the move map); the check runs after every byte, path and term screen and before the operation is recorded, so each earlier refusal still names its own cause. The footer now reads: Filed from the launchpad <name> at commit <commit>, where this record's path was <path>: its relative links resolve at that commit on the launchpad, whose order branch history the launchpad records publish pushes, and not in this repository. Its opening words are every earlier footer's, so the read-back that recognizes a filed record still matches records filed before. resume.mjs's two next-step texts and the reviewer's target clause commit the instance records first, then target-records, then the moved records' removal. The target-worktree fixtures commit the records through commitInstanceRecords before each filing they expect to succeed.",
  "evidence": [
    "scripts/test-target-worktree-publish.mjs: an uncommitted verification, final review, decisions file and a linked evidence file each refuse naming the commit step; after the records commit the footer names it; after the order branch's merge reaches the launchpad's bare origin, both relative links of the filed decisions resolve there with git cat-file -e.",
    "docs/evidence/WO-259/criterion-9-records.json (written by criterion-9-records.mjs): the control arm, target-records at the base, files before the records commit and its footer names a commit without the linked evidence; the fixed arm resolves every link.",
    "Fork's items 1.3 and 2.4 (404 and 422 for two checkpoints) and the 2026-11-07 pass, Readings: the base footer named the launchpad's HEAD at filing, which lacked the records and evidence."
  ],
  "rejected": [
    {
      "option": "Push each FinalReviewCompleted checkpoint as a ref",
      "reason": "A checkpoint is a recovery object outside the branch's history; the order branch's history is what the records publish pushes and the merge keeps."
    },
    {
      "option": "Say the footer gives the layout only",
      "reason": "The fork's check is that every relative link resolves through GitHub alone."
    }
  ],
  "reopenWhen": "A filed record's link does not resolve at its footer's commit on the published launchpad, or the merge drops the order branch's history (a squash merge)."
}
```

## WO-259-D013

Release surfaces: the two components bump minor, the editions re-mint, and the harness edition excludes the branch screen.

```json
{
  "id": "WO-259-D013",
  "date": "2026-11-08",
  "dispatch": "resume: next; release prepare",
  "decision": "@dotln/compiler moves from 0.42.1 to 0.43.0 (the shared rule constants and the worker prompt) with COMPILER_PACKAGE_VERSION, which the hook compares with the pinned runtime; @dotln/skeleton moves from 0.88.0 to 0.89.0 (the role text and the hand-back journal) with its compiler pin; the console keeps 0.5.0 with its two pins moved, and package-lock.json follows. HARNESS_HOST_VERSION stays 0.46.0, as WO-258 left it when it changed harness-host.ts. npm run sync re-minted the authority, artifact-identity and verification editions as revision 001 under WO-259 and carried the feedback edition from docs/evidence/WO-242/feedback-002 (feedback-001, carried: true), because only workspace pins moved among its sources. scripts/terms.mjs, a harness evidence source, now imports scripts/lib/branch-terms.mjs, which evidence-sources.mjs excludes from the harness edition with its reason: the harness reaches terms.mjs only through its check and --plan-first forms.",
  "evidence": [
    "npm run release -- check-surfaces --local: FAIL component-version for @dotln/compiler and @dotln/skeleton (src changed) before the bump.",
    "npm run sync: harness-evidence refused the unregistered import, then every artifact current after the exclusion; docs/evidence/current.json selects WO-259 revision 001 of each edition and feedback-001."
  ],
  "rejected": [
    {
      "option": "Bump HARNESS_HOST_VERSION",
      "reason": "No consumer reads it as a behavior label, and the preceding order kept it through a harness-host change."
    },
    {
      "option": "Register branch-terms.mjs and its imports in the harness edition",
      "reason": "The harness never runs the branch form; registering it would stale the edition for behavior it does not judge."
    }
  ],
  "reopenWhen": "The release-surface check names another component, or a harness behavior starts to run terms.mjs's branch form."
}
```

## WO-259-D014

Write-backs replace the sentences the change made wrong.

```json
{
  "id": "WO-259-D014",
  "date": "2026-11-08",
  "dispatch": "resume: next; step 10",
  "decision": "Product 07: §Documentation freshness and ownership states the enforcement (the screen, the forward-only scope, the typed exception and the election) in place of the sentence that said this order carried them; §Verification review and attack names the worker's paraphrase and no-print rules in the canonical brief; §Operator-opened planning pass item 7 adds the hand-back to the refusal list and says how the hook journals it; §Workflow closeout and releases gives the launchpad form's phase check and terms screen and puts the records commit before target-records with the new footer; §Operator resume phrases and §Discipline's attribution sentence follow. The kit guide: §First steps step 4 (the terms task, the publish screens, the target order's records commit), §Features (the election among the defaults), §Planning in this instance (the hand-back refusal) and §Document quality (the screen, the election and the exception). The playbook's target reviewer sequence commits the instance records before filing. docs/control/FEATURES.md is regenerated.",
  "evidence": [
    "git diff docs/product/07-execution-guide.md docs/KIT.md docs/PLAYBOOK.md docs/control/FEATURES.md."
  ],
  "rejected": [
    {
      "option": "A dated paragraph under each heading",
      "reason": "Standing documents state what is so; the account lives here."
    }
  ],
  "reopenWhen": "A reader of one of these sections finds a sentence the change made wrong."
}
```

## WO-259-D015

Carry-ins and the instance's items.

```json
{
  "id": "WO-259-D015",
  "date": "2026-11-08",
  "dispatch": "resume: next; known issues and carry-ins",
  "decision": "FUP-9cfd1cd290f68d1b (WO-257-D046) is delivered by D010, FUP-1c2f009b880027e6 (WO-242-D027) by D003 and FUP-1b94e79e02e54e70 (WO-227-D026) by D009 within the Boy Scout bound; final review disposes the register rows. The private instance's items (3, 4, 5, 6) and the fork's items (1.3, 2.4) are not reproducible from this repository; each fixture this order adds is their reproduction, and their reports are cited as the 2026-11-07 pass records them. The fork's GitHub check (every relative link resolving through GitHub alone) is confirmed by the fork's next pass; this repository's fixture reaches a local bare origin.",
  "evidence": [
    "docs/planning/passes/first-cycle-returns-and-host-elections-2026-11-07.md, Readings: the fork's items and the instance's nine requests read against the record.",
    "The work order's Known issues and carry-ins."
  ],
  "rejected": [
    {
      "option": "Leave the carried follow-ups for a later order",
      "reason": "Each is inside this order's steps and the Boy Scout bound."
    }
  ],
  "reopenWhen": "The fork's next pass finds a filed record's link that GitHub does not resolve, or the instance meets one of its reported items again on v0.122.0."
}
```

## WO-259-D016

Review round 1: eight defects found and fixed.

```json
{
  "id": "WO-259-D016",
  "date": "2026-11-08",
  "dispatch": "resume: next; review round 1",
  "decision": "Round 1 of the review ladder (three Codex workers, gpt-6.1-sol at max, through npm run worker -- review) found eight distinct defects over tree bd76fb65; all are fixed. Criteria F1: Git ends a diff header path holding a space with a tab, which the parser kept, so such a file escaped both screens; the tab is stripped. Criteria F2: a deletion that joins two lines can form a capture's run or a refused term while adding no line; the lines either side of a pure deletion now count as touched, and a file whose hunks only delete stays in the change. Criteria F3, design F2 and consistency F1 (one defect): the filing checked a link through the document-move map, which a reader at the footer's commit does not apply; links are now read at their literal path, which corrects D012's sentence that moved documents resolve through the map. Consistency F2: the write-backs promised a refusal for a linked file that differs from HEAD while the code checked only that it existed; an edited or staged linked file now refuses too. Design F1 (a regression): a filing interrupted before this change saved hashes of records carrying the earlier footer, and a retry would rebuild them with the new one and refuse; the saved operation now records the footer version (absent meaning the earlier one) and a resumed filing writes the footer it began with, for the rebuild and the read-back alike. Design F3: a changed file or a capture the screens could not read was skipped as if it were binary; readChangedText and readCapture now throw naming the path and the system's code, and an intake root that cannot be listed is an error, only an absent one meaning no captures. Design F4: the typed quotation exempted its words anywhere in the record's file; the exemption now holds only within the decision that carries it. Consistency F3: the plan-refutation and launchpad suites now declare branch-terms.mjs and branch-changes.mjs, which their publish cases run.",
  "evidence": [
    "docs/control/local/reviews/WO-259/round-1-criteria.md, round-1-design.md and round-1-consistency.md (reviewed tree bd76fb656068b4a5db73ba6c9afc8996c9199f0e against 898f95ff).",
    "scripts/test-docs-check.mjs: a staged file named with a space fails by its own name; the quotation in WO-999-D001 does not exempt the same words in WO-999-D002 (line 12 fails, line 6 does not); a deletion joining the run fails at line 3; an unreadable changed file and an unreadable capture fail naming their paths with EACCES.",
    "scripts/test-runner.test.mjs: the terms task fails docs/joined.md:3-4 after the guard line between the term's halves is deleted, and a staged file named with a space at its line 3.",
    "scripts/test-plan-refutation.mjs: the planning door names docs/planning/carried notes.md:3, a committed path holding a space.",
    "scripts/test-target-worktree-publish.mjs: a link to a moved document's old path refuses although the move map maps it; an edited linked file refuses until committed; an operation modeled on the earlier footer resumes and files that footer's bytes."
  ],
  "rejected": [
    {
      "option": "Read file names from git diff --name-only -z and map hunks by order",
      "reason": "Stripping the one tab Git appends keeps one pass over the diff, and a quoted name is still decoded."
    },
    {
      "option": "Recognize either footer by trying both against the saved hashes",
      "reason": "Recording the version in the operation states what was written instead of guessing it."
    },
    {
      "option": "Keep the move map for links and say the footer covers moved paths",
      "reason": "The footer promises resolution through the launchpad's published history alone, which applies no map."
    }
  ],
  "reopenWhen": "A changed file escapes a screen by its name or by a deletion, a filed link fails at its footer's commit, or an interrupted filing does not resume after an upgrade."
}
```

## WO-259-D017

Review round 2: two incomplete fixes and three admitted findings, fixed.

```json
{
  "id": "WO-259-D017",
  "date": "2026-11-08",
  "dispatch": "resume: next; review round 2",
  "decision": "Round 2's rechecks (the same three Codex workers' kinds, each given its round 1 report, over tree 99b0b6ba) held seven of round 1's findings and found two of my fixes incomplete, and admitted three new criterion breaks; all five are fixed. Design F4, not held: binding the quotation's exemption to its whole decision still exempted the same words in that decision's own fields; requestedQuotes now locates the quotation's text value (its line and the columns of its JSON string) and the screen tags the words inside that span with the quotation's capture, so only an occurrence wholly inside the span is the exception. Criteria F2, not held: marking the lines beside a deletion missed a run whose neighbouring lines are blank or punctuation-only; branchChanges now records each pure deletion as a join between two lines, and any range spanning a join is the branch's (addsLine reads both added lines and joins), so a window or a term match across the joined boundary counts whatever lines lie beside it. New criteria F2: a symlink or a submodule a branch turns into a file is a type change, which --diff-filter=AMR dropped; the filter is now AMRT. New criteria F3: the filing check followed Markdown links only; recordLinkTargets adds the href and src values of a record's raw HTML, and the bare-origin fixture now names its expected link paths itself. New consistency F1: the new target-worktree case is pinned in scripts/fixtures/target-worktree-cases.json, which the runner's inventory test compares exactly.",
  "evidence": [
    "docs/control/local/reviews/WO-259/round-2-criteria.md, round-2-design.md and round-2-consistency.md (tree 99b0b6ba0834759324baeb0a6f343ece430e51c5).",
    "scripts/test-docs-check.mjs: the quoting decision's own decision field fails while its text value does not; deletions beside a word-bearing, a blank and a punctuation-only line each fail at line 3; a symlink turned into a file reads lines 1 to 3 staged and committed.",
    "scripts/test-target-worktree-publish.mjs: a raw HTML link to a missing file refuses beside the moved document's old path; the bare-origin check lists the decisions record's two expected paths.",
    "scripts/test-runner.test.mjs: target-worktree file tasks keep all declared cases (passes with the new manifest entry)."
  ],
  "rejected": [
    {
      "option": "Mask the quotation's words for every capture",
      "reason": "The exception belongs to the capture the quotation names; tagging words with that digest keeps the binding."
    },
    {
      "option": "Keep marking neighbour lines and widen to the nearest word-bearing lines",
      "reason": "A join is a position, not a line; recording it as one reads every range across it the same way."
    }
  ],
  "reopenWhen": "A copy beside a quotation, across a deletion or in a type-changed file escapes the screens, or a filed record's HTML link fails at its footer's commit."
}
```

## WO-259-D018

Review round 3, the last: four findings fixed and the remaining delta judged.

```json
{
  "id": "WO-259-D018",
  "date": "2026-11-08",
  "dispatch": "resume: next; review round 3",
  "decision": "Round 3, the last (one combined Codex worker carrying the three briefs over the delta since round 2's tree 99b0b6ba, reviewing 50918319), found four defects in round 2's code; all are fixed and, as the ladder ends there, judged by me. F1 and F2: requestedQuotes now reads every text value after a record's operatorQuote key in source order through JSON.parse, and the quotations claim them in array order, so two equal quotations claim two values and a value written with other valid escapes (\\/ for a slash) is still found. F3: an HTML attribute's character references are decoded before the path check, as a browser decodes them (&#109;issing.json is missing.json; a&amp;b.md is a&b.md). F4, a regression against main's filing: the attribute regex matched data-src and text inside HTML comments; recordLinkTargets now parses each tag's attributes by whole name and drops comments, so only href and src are links. My judgment of the remaining delta: the pairing and the parser are covered by the cases below; the tag parser reads the HTML our own records carry and is not written to bound arbitrary hostile markup, which a record cannot carry past the document gate's review anyway.",
  "evidence": [
    "docs/control/local/reviews/WO-259/round-3-combined.md (tree 509183198050bf4cf144deef1e9faaa6ec836357 since 99b0b6ba0834759324baeb0a6f343ece430e51c5).",
    "scripts/test-docs-check.mjs: two equal requested quotations pass; a quotation whose JSON writes its slashes as \\/ passes.",
    "scripts/test-target-worktree-publish.mjs: &#109;issing.json refuses as missing.json; a record with data-src, an HTML comment and pro&#98;e.json files once probe.json is committed.",
    "node -e over recordLinkTargets: probe.json, missing.json, a&b.md and pic.png from Markdown, encoded, single-quoted and bare attributes; nothing from data-src or a comment."
  ],
  "rejected": [
    {
      "option": "Run a fourth reviewer over this delta",
      "reason": "The ladder ends at round 3; the executor judges what remains."
    },
    {
      "option": "Use an HTML parser dependency",
      "reason": "A tag-attribute reader over the records' own markup is enough, and the kit adds no dependency for it."
    }
  ],
  "reopenWhen": "A filed record's link written in HTML is misread, or a requested quotation is not found in a record that carries it."
}
```

## WO-259-D019

The complete review's one failure, a nested configuration-root timeout under the run's concurrency, reopens WO-225-D019; one fresh complete review follows without a runner change.

```json
{
  "id": "WO-259-D019",
  "date": "2026-11-08",
  "dispatch": "resume: next; complete review",
  "decision": "Start one fresh complete review without changing product code, deadlines or scheduler settings, and carry the recurring nested timeout to planning by reopening WO-225-D019. The complete review failed only in instance-history: the updated fixture instance's npm run test:docs stopped when its configuration-root task reached the runner's fixed 30-second suite deadline, so kit-verify was skipped there, and browser-evidence and the vertical suite, queued behind instance-history, never started. No cause on this branch is established and the cause remains unknown: the suites' own files are unchanged against the merge base, the root configuration-root task held 7.7 to 8.6 seconds on every tree this branch gated (7.8 seconds in the failed run itself), and instance-history passed all 8 cases on its own. WO-217-D078 and WO-225-D019 recorded the same nested deadline inside a complete run with no established cause; WO-225-D019 reopens when it recurs, which it now has. Diagnosing it (the nested runner's deadline recorded in the outer row, then a load-aware nested deadline or less nested work) changes the runner's execution contract for every order, which is outside this order's committed-words scope.",
  "evidence": [
    "npm test -- --review: exit 1, 3,014,748 ms, started 2026-11-08T17:14:29.216Z and recorded 2026-11-08T18:04:43.964Z, tree b80544cfc2850a54aed68c143e9c7c62e7f4c6ef, code identity f32b6b06671c35d5b613022f4575c7a6013a67380a24a3d044b1541108bc76c8: 42 passed; 3 failed; 0 h 50 min; 118 fresh tasks. browser-evidence, vertical:file:test-vertical.recovery.mjs and vertical:file:test-vertical-judgment.mjs report Not started after instance-history failed.",
    "instance-history ran from 2026-11-08T17:56:15.056Z to 17:58:23.848Z (128,213 ms) beside evidence-sources, harness-probe, worktree, skeleton, release:case:close_compact, target-publish and workstream-pilot. The row's deadline diagnostic for skeleton at 17:56:18.690Z, with instance-history among its concurrent tasks, records load class shared, concurrency 8, load factor 16 and host load 0.73 per CPU; the row holds no nested deadline diagnostic.",
    "Its one case, a kit update preserves and admits the committed instance history (scripts/test-instance-history.mjs:525), failed on the updated instance's npm run test:docs exit 1: format passed, configuration-root timed out after 0 h 1 min (timeoutMs 30_000 at scripts/test-runner.mjs:1281) while running its configuration root case, and kit-verify was skipped behind the failed preflight.",
    "Root configuration-root in the 27 structural rows this branch recorded on trees 622552afc, 4c6f4de3d, 552a76f4a, 43f8f3a20 and b80544cfc: 7,667 to 8,550 ms; 7,787 ms in the failed complete run (docs/control/local/harness/checks.json).",
    "git diff --stat 898f95ffd -- scripts/test-configuration-root.mjs scripts/test-instance-history.mjs scripts/test-features.mjs prints nothing.",
    "npm test -- --only instance-history, the focused reproduction: 8 passed; 0 failed; 0 h 2 min; row suite:instance-history 128,234 ms at 2026-11-08T18:08:13.842Z, the instance-history task 103,010 ms.",
    "WO-217-D078: complete attempts 6 and 8 timed out in the integrated exported instance's configuration-root near 30 seconds while the root task passed. WO-225-D019: the integrated-kit review timed that task out at 30,127 ms under load factor 16, with no nested deadline diagnostic."
  ],
  "reopens": {
    "decisionId": "WO-225-D019",
    "observation": "WO-225-D019 reopens when the same nested timeout recurs. WO-259's complete review recorded at 2026-11-08T18:04:43.964Z timed out the nested configuration-root task inside instance-history's updated instance at its 30-second deadline while the root task passed in 7,787 ms and instance-history passed alone; it is the third order, after WO-217 and WO-225, to record it, again under load factor 16 with no nested deadline diagnostic."
  },
  "rejected": [
    {
      "option": "Raise the configuration-root deadline, or scale nested suite deadlines by the outer load factor, in this order",
      "reason": "It changes the runner's execution contract for every order without a measured cause, which WO-217-D078 and WO-225-D019 both declined, and the runner is outside this order's scope; the reopened decision carries it to planning."
    },
    {
      "option": "Lower the gate's concurrency for the fresh run",
      "reason": "A scheduler setting chosen to pass one run hides the load sensitivity this reopening records."
    },
    {
      "option": "Claim the complete review from the focused instance-history row",
      "reason": "A complete run composes nothing from --only rows; the focused run only reproduces the failure."
    }
  ],
  "reopenWhen": "The fresh complete review fails in instance-history's nested configuration-root again, or fails anywhere the focused reproduction does not clear."
}
```

## WO-259-D020

The document gate's one failure: the verbatim screen failed the check on a closed directory under the intake root, which the private roots' rule admits; such an entry is now named in an advisory.

```json
{
  "id": "WO-259-D020",
  "date": "2026-11-08",
  "dispatch": "resume: next; document gate repair",
  "decision": "Name a closed private entry below the intake root in an advisory instead of failing the document check on it. The document gate failed only in docs-check-fixtures, at the case that predates this order, document listing excludes private and package roots before inspecting unreadable cached entries: round 1's fix for design F3 (D016) made capturePaths throw for any directory under the intake root it could not list, so checkDocs threw on the case's closed docs/intake/private, which the private roots' rule says never fails the check. capturePaths and readCapture now record such a directory or capture in the screen's unread list (<path> cannot be listed (<code>); the verbatim screen did not read the captures under it, and <path> cannot be read (<code>); the verbatim screen did not read it), checkDocs prints each as an advisory, and the status line reads verbatim screen: no readable captures when none could be read, so the gap is named and never passed over in silence, which was F3's concern. An intake root that cannot be listed and a changed file that cannot be read remain errors. Expected-data updates: the WO-259 case's capture half now expects exit 0, that status line and the advisory where it expected the failure (cause: this decision; provenance: D016's F3 fix, which wrote that expectation); the earlier case keeps its assertions and adds that the advisory names the closed intake directory. docs-check-fixtures last ran whole at 14:54, before the review rounds: the rounds' probes ran single cases, and the complete product run does not include this document task, so the regression surfaced only in the document gate.",
  "evidence": [
    "npm run test:docs, recorded 2026-11-08T18:43:56.208Z, exit 1, 173,158 ms: 27 passed; 1 failed. docs-check-fixtures: not ok 61, the error docs/intake/private cannot be listed (EACCES); the verbatim screen reads every capture, thrown from capturePaths in scripts/lib/verbatim-screen.mjs through checkDocs.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-docs-check.mjs after the repair: 82 tests; 81 pass; 0 fail; 1 skipped.",
    "scripts/test-docs-check.mjs: the closed docs/intake/private yields no failure and the advisory naming it; a closed capture yields exit 0, verbatim screen: no readable captures and the advisory naming it; a closed changed file still fails naming it."
  ],
  "rejected": [
    {
      "option": "Keep the error and change the earlier case to expect it",
      "reason": "That case holds the private roots' rule: an operator who closes a directory under the intake root would have every document gate fail on it."
    },
    {
      "option": "Pass over a closed entry in silence",
      "reason": "F3's finding stands: a screen that skips what it cannot read says so."
    },
    {
      "option": "Admit an intake root that cannot be listed as well",
      "reason": "The root is the kit's own directory, and with it closed the screen reads nothing; that is a broken checkout, not a private entry inside it."
    }
  ],
  "reopenWhen": "A closed intake entry fails the document check, a closed entry passes without its advisory, or the operator asks that a closed capture fail the gate."
}
```

## WO-259-D021

Review round 4, the repair's combined round: two findings fixed, one recorded, and the root cause carried to planning.

```json
{
  "id": "WO-259-D021",
  "date": "2026-11-08",
  "dispatch": "resume: next; review round 4, the repair's ladder",
  "decision": "Round 4 is the repair's ladder. D020's repair added 38 source lines (35 in scripts/lib/verbatim-screen.mjs and 3 in scripts/docs-check.mjs, replacing 19; 57 lines counting both) and 16 test lines, under product 07's fifty-line figure, so it started at the combined round, which also read everything after round 3's reviewed tree: round 3's fixes, D018 to D020 and the write-back links. No reviewer runs after it; the executor judges its three blocking findings. F2 (criterion 9), fixed: the filing decoded five named character references in HTML links, so probe&period;json was refused, and a committed file literally named so could pass while a browser followed another path. The document check's own decoder (numeric references with or without the semicolon, invalid code points as U+FFFD, named references through the pinned parser's table) moves to scripts/lib/markdown-links.mjs, both readers use it, and the filing's own table is gone. F3 (criterion 10), fixed: product 07 §Documentation freshness and ownership said an unreadable capture fails the check; it now states D020's split and links D020, and the publication source lock is regenerated. F1 (criterion 2), recorded and not fixed: a decision whose JSON spells the operatorQuote or text key with unicode escapes loses the quotation's exemption, so that record fails the screen. No writer produces that spelling (JSON.stringify and hand-written records write the plain key), the failure is closed (a record is refused, never a copy admitted) and its remedy is to write the key plainly, while the fix the finding asks for, a span-keeping JSON reader, is a second parser of record source for no record anyone writes. The executor had written that reader and reverted it after the operator's mid-session message, which objected that each work order adds hand-written Markdown or JSON parsing whose brittle cases and tests then cost hours (capture SHA-256 177daeeeb3c7514471d5eb40b0ea6a5f37163a1e45b22d74e764f13d24b26dd8).",
  "evidence": [
    "docs/control/local/reviews/WO-259/repair-2/round-4-combined.md (reviewed tree 27770ee88b523efb17703b7577d1d7c131f07ba3 since 509183198050bf4cf144deef1e9faaa6ec836357; 0 h 11 min).",
    "git diff --numstat 7c2cd8b5f5dd 27770ee88b52 -- scripts packages: scripts/lib/verbatim-screen.mjs 35 and 18, scripts/docs-check.mjs 3 and 1, scripts/test-docs-check.mjs 16 and 5.",
    "scripts/test-target-worktree-publish.mjs: a record linking <a href=\"pro&#98;e&period;json\"> files once probe.json is committed.",
    "decodeCharacterReferences: probe&period;json reads probe.json, a&amp;b.md reads a&b.md, &#0; reads U+FFFD, an unknown name stays as written."
  ],
  "rejected": [
    {
      "option": "Read the decision's JSON block with a span-keeping parser so an escaped key spelling keeps its exemption (F1)",
      "reason": "It is a second parser of record source for a spelling no writer produces, and the case it covers already fails closed with a plain remedy."
    },
    {
      "option": "Refuse every HTML link holding a reference outside the five names (F2)",
      "reason": "The document check already decodes the full named set through the pinned parser; sharing that decoder reads the path a browser follows with less code."
    },
    {
      "option": "A further review round over these fixes",
      "reason": "Round 4 ends the repair's ladder; the executor judges what remains."
    }
  ],
  "followup": "Admit a review finding that a hand-written reader of record or document source mishandles an input only when the finding names an input the kit's writers or an author's ordinary text produce, or a leak (a copy or a broken link admitted); otherwise the executor records it. Prefer parsed structures (JSON.parse rows, the pinned Markdown parser's tree) over a new scanner of source text. Thirteen of this order's twenty review findings over four rounds were such defects (a diff header path's tab, deletion joins, type changes, a quotation's span, JSON escapes and key spellings, HTML attributes and references), each fix adding parsing and cases. Surfaces: the admission rule in the canonical review brief (scripts/lib/review-worker.mjs, packages/skeleton/src/change-review-protocol.ts) and product 07 §Verification review and attack. Checks: scripts/test-review-worker.mjs and the plan-refutation suite.",
  "reopenWhen": "A record in the plain spelling loses its quotation's exemption, a filed HTML link is read at another path than a browser follows, or a standing document states D020's cases otherwise."
}
```

## WO-259-D022

A critical error, as the operator classified it, for the next planning session: the executor adopted review findings' fixes without judging them.

```json
{
  "id": "WO-259-D022",
  "date": "2026-11-08",
  "dispatch": "resume: next; operator direction after round 4",
  "decision": "Record a critical error, as the operator directed, for review in the next planning session: the executor carried out review findings' requested fixes without judging them, although after the ladder's last round that judgment is the executor's (product 07 §Verification review and attack). Asked why it had written a JSON reader the order did not need, the executor explained that it had acted on round 4's F1 because the reviewer marked it blocking, never asking whether anything the kit uses would produce such a record; the operator judged that conduct irresponsible and unprofessional and directed that it be marked critical and reviewed at the next planning session (capture SHA-256 7f326f7487ede475fe6c7d7cb4d65985568f45b3bd135a57c483154909b45b73). The same error ran through the ladder: round 4 F1, a span-keeping JSON reader for escaped key spellings, written and then reverted under D021 after the operator objected; round 3 F1 and F2, two equal quotations in one record and \\/ escapes, which JSON.stringify never writes, both now handled in requestedQuotes; and rounds 2 and 3, raw HTML href and src links in filed records with their character references and attribute parsing, which the kit's records rarely carry. Each fix was made as the finding asked; none was weighed by the inputs real writers produce, by whether its failure admits a copy or a broken link (open) or refuses a valid record with a plain remedy (closed), or by what the fix costs. This order leaves that code in place: it is reviewed and passes the gates, removing it is a planning decision, and the operator asked for a review. The follow-up below carries the review, and its register row is disposed open so that plan start lists it before the untriaged backlog.",
  "evidence": [
    "D016 (round 1), D017 (round 2), D018 (round 3) and D021 (round 4) record each finding and its fix.",
    "The operator's mid-session messages: capture SHA-256 177daeeeb3c7514471d5eb40b0ea6a5f37163a1e45b22d74e764f13d24b26dd8 (parsing in every work order) and 7f326f7487ede475fe6c7d7cb4d65985568f45b3bd135a57c483154909b45b73 (the critical-error direction)."
  ],
  "rejected": [
    {
      "option": "Remove the rounds' parsing code in this order",
      "reason": "It is reviewed and passes the gates; removing it changes code and its criteria's evidence, and the operator asked for review at the next planning session."
    },
    {
      "option": "Leave the follow-up untriaged",
      "reason": "The operator classified it critical; an open disposition lists it before the untriaged backlog that plan start pages through."
    }
  ],
  "followup": "Critical, as the operator classified it: review the executor's adoption of review findings without judgment. Before writing a fix, an executor would state for each finding whether a writer the kit has (its tools, an author's ordinary text) produces the input, whether the failure is open (a copy, a broken link or a wrong pass admitted) or closed (a valid input refused with a plain remedy), and what the fix costs; it fixes open failures and records closed failures on contrived inputs without code. Decide whether this order's code for such inputs stays: requestedQuotes' pairing of equal quotations and its escape handling (scripts/docs-check.mjs) and the HTML href and src reading with character references (recordLinkTargets in scripts/lib/target-records.mjs). Surfaces: the executor's role text (packages/skeleton/src/loadouts/contributor.ts) and product 07 §Verification review and attack, beside FUP-67944ed9c85b7199's admission rule for reviewers. Checks: the role oracle (scripts/test-process-debt.mjs) and the plan-refutation suite.",
  "reopenWhen": "The next planning session disposes this follow-up, or an executor again writes code for a review finding without stating that judgment."
}
```

## WO-259-D023

The nested configuration-root deadline met a fresh complete run again; the review reruns as the runner composes it.

```json
{
  "id": "WO-259-D023",
  "date": "2026-11-08",
  "dispatch": "resume: next; complete review",
  "decision": "D019's reopening condition occurred: the fresh complete review at the repaired code failed only in instance-history's nested configuration-root, at its 30-second deadline, and browser-evidence and the vertical files did not start. Judged again with that evidence, the cause is still the runner's nested deadline under a fully fresh run's concurrency, not this branch: both failures came in runs that executed all 118 tasks; the composed rerun at 18:18, which executed instance-history beside only the structural preflight, browser-evidence and the vertical files, passed it in 104,508 ms; the configuration-root suite runs no document check and its files are unchanged on this branch; and WO-217 and WO-225 met the same deadline on unrelated changes. So the complete review runs again as the runner composes it, executing the tasks whose latest run at this code identity is not a pass and carrying the rest from the run that executed them. FUP-7b7e2e59a8ef2e06 (WO-225-D019) carries the deadline to planning, now with two failures in this order.",
  "evidence": [
    "npm test -- --review recorded 2026-11-08T20:10:51.535Z: exit 1, 3,178,934 ms; 42 passed; 3 failed; 0 h 53 min; 118 fresh tasks. instance-history's case failed on the updated instance's npm run test:docs, configuration-root timed out after 0 h 1 min, and browser-evidence and both vertical files report Not started after instance-history failed.",
    "D019: the first fresh run (recorded 2026-11-08T18:04:43.964Z) failed the same way, and the composed rerun (recorded 2026-11-08T18:28:07.273Z) executed instance-history in 104,508 ms and passed.",
    "grep of scripts/test-configuration-root.mjs for checkDocs, docs-check, test:docs, branchChanges, verbatim and terms finds none."
  ],
  "rejected": [
    {
      "option": "Raise or scale the nested deadline in this order",
      "reason": "It changes the runner's execution contract for every order without a measured cause; FUP-7b7e2e59a8ef2e06 carries it."
    },
    {
      "option": "Run every suite fresh a third time",
      "reason": "Both fully fresh runs on this branch met the same deadline; a third would measure the load, not the change."
    }
  ],
  "reopens": {
    "decisionId": "WO-225-D019",
    "observation": "A second fresh complete review in WO-259, recorded 2026-11-08T20:10:51.535Z, timed out the nested configuration-root inside instance-history's updated instance at its 30-second deadline, as the first did at 18:04:43.964Z; both runs executed all 118 tasks, and the composed rerun between them passed instance-history."
  },
  "reopenWhen": "The composed rerun fails instance-history again, or a measurement shows this branch slowed the nested configuration-root."
}
```

## WO-259-D024

Verification keeps the existing subject and judges supported inputs; verifier
read and fixture mistakes are corrected before the verdict.

```json
{
  "id": "WO-259-D024",
  "date": "2026-11-08",
  "dispatch": "resume: verify; independent verification and process corrections",
  "decision": "Keep the implementation read-only, reuse the standing complete review at the current code identity, exercise focused cases and independent probes, and run the document gate after the verification records are complete. D022 changes the admission judgment: a constructed spelling with no identified writer does not create a blocker; the recorded escaped-key limitation stays with D021 and its existing follow-up. The NoOp is no product edit and no additional complete product run while its covering row stands. No worker is launched because every reproduction can run here. The verifier initially emitted canonical status without selecting fields, and several combined reads of generated output exceeded their output budget; those truncated views establish no additional claims. Subsequent status is saved in session scratch and emits selected lifecycle and gate fields; generated or oversized surfaces are judged by their source, pins and passing checks. The first independent probe also assumed that the harness journal follows a configured documentation root. dispatchJournalDirectory explicitly retains docs/control/local/harness until loader migration, so that probe failed with ENOENT before judging hand-back behavior. The probe now obtains the lane from that existing reader; this corrects the test, not the implementation. A shell search with an unmatched filename glob was replaced by rg --glob searches over known directories. A direct bash invocation of test-worktree.sh inherited CODEX_THREAD_ID and stopped at the fixture dispatch because its intentionally minimal runtime was absent. scripts/test-runner.mjs executes fixtures through suiteEnvironment, which removes that session metadata. The shell probes therefore rerun through that existing function, keeping the bounded parent and changing no product code or host settings; the initial direct invocation is not evidence of a product regression.",
  "evidence": [
    "The verification dispatch allocated docs/verifications/WO-259/VER-001.md and read back codex-cli 0.167.0, gpt-6-astra, effort max, source codex-session-readback. The role recommends xhigh; this session records its actual setting and changes no host setting. The transport exposes no hard USD cap.",
    "coveringGateCheck at code identity 1a504cda03bed23dc4b6e27c88aa9595d03f6fa667ec8b85e0c37ca7758cb5e1 returns the passing review row recorded 2026-11-08T20:27:02.231Z, with no missing or displaced tasks. The document selection is rerun for the verifier's records.",
    "npm run format:check under the bounded wrapper passed, exit 0. The first focused command passed eight selected tests, including the target-records bare-origin publication case and interrupted-filing recovery.",
    "docs/evidence/WO-259/verification-probes.mjs; its first run exited 1 on the verifier's wrong configured journal path. packages/skeleton/src/dispatch-journal.mjs defines the physical lane used by both the producer and the planning reader. The corrected run is recorded in verification-evidence.json."
  ],
  "rejected": [
    {
      "option": "Add another review worker or repeat the complete product run",
      "reason": "No claim requires a second runtime or inaccessible capability, and the complete row covers the unchanged code. Focused executed probes answer the outstanding questions with less work."
    },
    {
      "option": "Reclassify the escaped JSON property spelling as a blocker",
      "reason": "D021 and D022 identify no producer of that spelling, the record fails closed with a plain spelling remedy, and the existing planning follow-up owns the design decision."
    }
  ],
  "reopenWhen": "A supported input reproduces an unmet criterion or a regression, the code identity displaces its gate evidence, the corrected probe fails on the declared contract, or planning changes the admitted-input rule."
}
```

## WO-259-D025

Final review passes WO-259 at the standing complete row's identity, on reproductions run here and a screen of the branch against both checkouts' captures.

```json
{
  "id": "WO-259-D025",
  "date": "2026-11-08",
  "dispatch": "resume: final review; the judgment of WO-259 through VER-001, allocated FINAL-001",
  "decision": "Pass WO-259 at code identity 1a504cda03bed23dc4b6e27c88aa9595d03f6fa667ec8b85e0c37ca7758cb5e1, the identity of the complete review row recorded 2026-11-08T20:27:02.231Z (45 required suites, exit 0, 0 h 9 min, gate selection review, composed from the run of 20:10:51.535Z that executed all 118 tasks) and of VER-001's subject, recomputed here before this review's edits; the report records the recomputation after them. HEAD, main and origin/main all stand at the activation base 898f95ffde316ad27c6c696883f21a50791c9383 after a fetch, and npm run worktree -- integrate WO-259 took in nothing, so that row is the row at the integrated identity and no complete run is started here. Every criterion holds on evidence run again in this session under the bounded wrapper, outside any gate: VER-001's eight probes; the verifier's focused selection with the five WO-259 cases of the docs-check suite (13 cases); the worktree and resume shell fixtures through suiteEnvironment (3 min 44 s and 2 min 25 s); node scripts/docs-check.mjs on this worktree (54 changed files against its 3 captures, 0 shared runs, 0 failures); node scripts/terms.mjs branch (124 changed files, 0 findings); and checkDocs over this branch with the main checkout's 535 text captures, which the worktree's own gate does not read, finding no shared run in the branch or in the records this review wrote, so the branch keeps the rule it enforces; format:check and git diff --check are clean. This review changes no source: it writes the report, PR.md and RELEASE-NOTES.md, this decision and D026 (the register dispositions), and refreshes the decisions index, the features inventory, the work-order index and the order's meter through their commands. Each changed standing document (product 07's closeout, planning-pass, freshness, review and attribution passages; the kit guide's First steps, Features, Planning in this instance, Releases in this instance, observed selections and Document quality; the playbook's target reviewer sequence; the README's release line) replaces the sentence now wrong and links its decision, and no dated account was added under a standing heading. The ideation receipt 065's nine known issues were read against the implementation: the screen reads the captures of the checkout the gate runs in, as D006 chose, and this review's screen against main's captures covers this branch; no command, path or identifier matched at twelve words on this branch; the budgets acceptances are not Markdown and are unchanged; this repository elects no feature; every root stays within its acceptance with no ceiling moved; status prints no budget breach and the template is unchanged; a hand-back is reclassified in the envelope Claude Code writes today; the publish form's refusal names the sequence this review follows; historical copies keep their bytes. The code the four rounds added for inputs no kit writer produces (requestedQuotes in scripts/docs-check.mjs, recordLinkTargets in scripts/lib/target-records.mjs) is correct and covered, and whether it stays is the planning decision D022 carries as FUP-6fe1262fb31292b3, critical as the operator classified the executor's conduct (capture SHA-256 7f326f7487ede475fe6c7d7cb4d65985568f45b3bd135a57c483154909b45b73), so this review leaves it in place and records no second row. One design observation, not a defect: on main itself the verbatim screen's base is HEAD while the terms task reads what the last merge brought in; the order's step 4 names the screen's base, and every merge comes from a branch whose gate screened its lines.",
  "evidence": [
    "gateCodeIdentity(root) in a scratch script: 1a504cda03bed23dc4b6e27c88aa9595d03f6fa667ec8b85e0c37ca7758cb5e1 at 2026-11-08T21:26Z, before any edit of this review; docs/control/local/harness/checks.json: the npm test row of 2026-11-08T20:27:02.231Z at that identity, gateSelection review, exitCode 0, 45 requiredSuites, durationMs 560379, and the npm run test:docs rows of 20:29:43.809Z and 20:55:06.224Z",
    "git fetch origin main; git rev-parse HEAD main origin/main: 898f95ffde316ad27c6c696883f21a50791c9383 each; npm run worktree -- integrate WO-259: Integration took in nothing: the worktree is not behind main",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-259/verification-probes.mjs: 8 probes passed, 3,510 ms; bounded node --test --test-concurrency=1 with the verifier's name pattern over scripts/test-harness.mjs, scripts/test-process-debt.mjs, scripts/test-runner.test.mjs, scripts/test-target-worktree-publish.mjs and scripts/test-docs-check.mjs: 13 passed, 0 failed, 71,747 ms; bash scripts/test-worktree.sh and bash scripts/test-resume.sh through suiteEnvironment(process.env) under one bounded wrapper: exit 0 each, 224,144 ms and 145,213 ms",
    "node scripts/harness.mjs bounded -- node scripts/docs-check.mjs: PASS docs check, verbatim screen: 54 changed files against 3 captures, a 12-word window; 0 shared runs; node scripts/harness.mjs bounded -- node scripts/terms.mjs branch: local-terms list: present; 124 changed files screened, 0 findings; a bounded scratch script calling checkDocs(root, { captures }) with capturePaths and readCapture over the main checkout's intake: 535 captures read, 0 unread, status screened, 0 findings, 42,885 ms",
    "git diff over 898f95ff: 93 files, 2,604 insertions, 561 deletions, with the order's control segment, its evidence and verification directories, the role oracle, the three new modules and the starter's v0.121.0 refresh receipt untracked; the product 07, kit guide, playbook and README diffs read whole",
    "docs/planning/refutations/2026-11-07-planning-ef4a1d095e4cd775-065.json: WO-259 aligned-with-findings, no hold, nine known issues; dotln.config.json: no features key",
    "shasum -a 256 scripts/lib/target-records.mjs equals the fixed arm's module digest in docs/evidence/WO-259/criterion-9-records.json"
  ],
  "rejected": [
    {
      "option": "Start another complete run",
      "reason": "The identity, not the dispatch time, says what was tested: the complete review row stands at the integrated identity and this review changes no source."
    },
    {
      "option": "Fail or repair on the rounds' parsing code that D022 names",
      "reason": "It is correct and covered, breaks no criterion and no behavior main had, and the operator asked for its review at the next planning session; removing it here would move the identity for no criterion."
    },
    {
      "option": "Rerun the criterion 8 and criterion 9 replays",
      "reason": "Each rewrites its filed evidence JSON; the process-debt case, the target-worktree publish cases and the recorded arms with their module digests stand in their place."
    }
  ],
  "reopenWhen": "A supported input reproduces a criterion failure or a regression against main after the merge, the complete row at this identity is found not to stand, the fork's next pass finds a filed record's link that GitHub does not resolve, or the private instance meets one of its reported items again on v0.122.0."
}
```

## WO-259-D026

The register rows this order delivered are settled and the rows whose condition its change met are deferred again with it named; the rest stay as matched.

```json
{
  "id": "WO-259-D026",
  "date": "2026-11-08",
  "dispatch": "resume: final review; npm run plan -- followups --touching (38 pending rows name a file this change touches or the order)",
  "decision": "Dispose ten rows in one --apply batch against register revision c31f7d570e83e1965ded3d7e8e90a6c98ed1bc96fb82807a20a47ca0fb42981f (bbd079a8b4dea17c8dc9ee745dcd437b670c5584f89109df75113e026b5f913e after the write), and leave the rows the change only matched as they are. Settled, each delivered by this order as D015 names: FUP-9cfd1cd290f68d1b (WO-257-D046) by D010, the launchpad publish form reading the committed phase; FUP-1c2f009b880027e6 (WO-242-D027) by D003, the router root naming awaiting-plan-approval with the operator's next step; FUP-1b94e79e02e54e70 (WO-227-D026) by D009, a malformed private list refusing a publish door by its line and never a term. Deferred again with the met condition named: the six cold-start optimization rows FUP-89b7b9f657765e83 (WO-253-D013), FUP-8dd0eb609946b9d1 (WO-249-D025), FUP-916e24773df0b734 (WO-238-D042), FUP-957602bc42e32e1d (WO-217-D053), FUP-c61f76f60798e1b2 (WO-257-D007) and FUP-d91a2e2780a65b70 (WO-243-D008), because D003 adds 756 to 867 bytes of reviewed rules to every role root and so changes the measured overrun and the reviewed rules again, while every root stays within its recorded acceptance or ceiling and no ceiling moves; and FUP-eed385be08e5bdd9 (WO-226-D022), because this order edits scripts/test-gate-followups.mjs and re-mints the role oracle as wo259-role-baseline.json. Left as matched: the 31 other pending rows, whose conditions did not occur (among them FUP-770baf2f452c669e, since the planner root's entropy sentence is unchanged; FUP-1fa649b8d330505b, since neither failed complete run nor the failed document gate was an untraced hand-written inventory; FUP-dfde4050da06d43b, since the ladder finished before the complete runs and no run was paid on changing code; FUP-34bee344f576ba39, since D008 adds a hand-back count beside the escape counts and edits none of them; FUP-973464a1fa408976, since this order edits neither kitWorkerLaunch nor npmScriptArgs), and this order's own nominations FUP-6fe1262fb31292b3 (open, as D022 disposed it), FUP-67944ed9c85b7199 (D021) and FUP-7b7e2e59a8ef2e06 (the reopening of WO-225-D019 by D019 and D023), which the next planning pass triages.",
  "evidence": [
    "npm run plan -- followups --touching at register revision c31f7d570e83e1965ded3d7e8e90a6c98ed1bc96fb82807a20a47ca0fb42981f: 276 pending rows, 38 matched over six pages, each read in full with its decision's followup and reopenWhen",
    "docs/evidence/WO-259/decisions.md D003, D009, D010 and D015: the deliveries; D003's cold-start figures and the oracle re-mint: the met conditions",
    "npm run plan -- followups --apply docs/control/local/followup-request.json: ten requests applied, three settled and seven deferred, revision bbd079a8b4dea17c8dc9ee745dcd437b670c5584f89109df75113e026b5f913e"
  ],
  "rejected": [
    {
      "option": "Triage this order's three open or untriaged nominations here",
      "reason": "Triage is the planning pass's; the final review disposes only what this order delivered or whose condition its change met."
    },
    {
      "option": "Leave the cold-start rows as they were",
      "reason": "Their condition is a change of a role's reviewed rules or of the measured overrun, which D003's additions are; a row whose condition occurred is re-disposed with the condition named, as WO-243-D023 and WO-258-D036 did."
    }
  ],
  "reopenWhen": "A later pass reads one of the 31 left rows' conditions as met by this order, a settled row's reopening condition fires, or a re-deferred row's condition occurs again."
}
```
