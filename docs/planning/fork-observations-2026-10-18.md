# Planning pass, 2026-10-18: observations from running the fork

## 1. Subject, authority and provenance

The operator opened `planning: quick planning pass with some observations
from running in the fork` on 2026-10-18 at 15:40Z and sent five mid-turn
messages between 15:44Z and 15:53Z. The dispatch carries two reports from
the operator's instance (the fork, `dylanwoodconsulting/DotLn-Enterprise-Starter`,
checked out as `DotLn-Instance`): its verifier's diagnosis of the host
refusals that met its first target order, WO-004 against the registered
repository `DylanBWood/DotLn-Angular`, and its release-close session's
report of the two close refusals. The dispatch and the five messages are
captured verbatim in ignored intake
(`docs/intake/notes/planning-fork-observations-2026-10-18.md`, SHA-256
`f6fdbcbb18b5fcce47a18b16d13a6b441e0fab301f24a08861909dda23b68662`), a
sibling record, never a source to mine. This document is planner synthesis
of public repository evidence, of the fork's committed records read on the
operator's machine, of the published host documentation (§3) and of the
operator's own transcripts; the clean-room screen found no suspect
material: the fork is the operator's own instance, its target a public
repository, and no target or employer material enters.

Entry was clean `main` at `32f9653f`, WO-216 closed (v0.84.0, released
2026-10-18T15:37Z under an operator override recorded in §9) and no active
order. The pass runs on `planning/2026-10-18-fork-observations`, created by
`plan start`. Only the parent writes this planning checkout.

Fan-out, planned against `subagentCap` 20 with 0 admissions observed at
entry: one read-only `dotln-worker` research worker reading the published
Claude Code, Codex and Copilot documentation (§3; 45 tool uses, 438 s, no
repository write) and one background refuter after the subject is
committed; two in all, no descendants. The planner wrote every artifact.

The operator's nine numbered observations and five mid-turn directions, as
read (§4 answers each from the record):

1. Which rules are base machinery, which are the core operator's own
   decisions, which are the fork owner's, and how each is changed.
2. Which of the fork's findings route to the platform and which stay in
   the fork's planning pass.
3. Whether fork-local changes break the upstream update path.
4. Whether the host-trust gap is boarded or folded into existing orders,
   given the operator already edited their user settings.
5. The draft pull request superseded by the publish's second pull request,
   with three hand steps.
6. The release close refused twice on build output, the session moving
   the output to scratch, and the close's report that a remote branch was
   left.
7. An option to release the sibling repository without a hand step.
8. Why hand steps have increased.
9. Why an operator override was needed at WO-216's release close and where
   its decision lands.

Directions: the fork is `DotLn-Instance` (ask rather than guess; the pass
had read the starter checkout first); the draft at verified is the fork's
route, not the platform's, and the platform must be extensible for it;
part of the output is a prompt for the fork's current planning pass
(Appendix A); the starter has no releases to fork from.

Aim, as read: route each observation to the platform or the fork with
evidence, file the platform work as orders (one new, two amended), and
hand the fork its prompt. Traps named before the material choices: making
the fork's route a kit default (the operator's direction; the kit gets the
opt-in form only); filing one order per observation (the fixed cycle is
the cost, so one subsystem gets one order); answering the babysitting
question with agreement instead of the count (§4.8 counts); guessing the
fork's layout (corrected at 15:44Z).

## 2. Entry observations

`plan start` reported, since receipt 046 (2026-10-17T19:54Z): 1 failed
verification, 1 failed final review, 2 repairs, 1 failed first
verification (WO-216's), 3 amendments, 0 corrections, 0 off-ramps, 7
interventions (4 unclassified), 3 long phases, 1 local release close, 0
local host denials; 8 recent closes' tracks: 6 delivery, 2 machinery. The
register held 160 pending rows: 3 open, 4 untriaged, 153 deferred. No
reader run is due.

`plan failures` holds WO-216's VER-001 fail, FINAL-001 fail (20 escapes),
two repairs and the D012 amendment. Canonical status reads `closed`,
FINAL-002 pass, legal next `release-close, next, activate` (the release
close ran; the tag and Release exist). Process health: "first verification
failed in 6 of the last 8 closed orders".

Numeric reopening conditions (`plan conditions`, 34.0 s, load 2.4 on 16
CPUs): two hold, three unknown.

| Source | Measurement | Value | Threshold | Disposition (§9) |
| --- | --- | --- | --- | --- |
| FUP-e96221b106cd136a | `gate-task:target-worktree`, latest fresh task against its thirty-day median (51.4 s, 34 samples) | 502.3 s | > 77.2 s | holds; read as the complete review run's load (inference, §9) |
| WO-150-D003 | `coldStartBytes.executor` | 28,543 | > 24,576 | holds; unchanged reading, kept open (FUP-f1c7a256bec46737) |
| FUP-e96221b106cd136a | `gate-task:vertical:file:test-vertical.mjs` | 723.5 s | no earlier sample | unknown |
| FUP-fb8cbeabbddef397 | document gate and docs-check medians | not measured | `--slow` | unknown; the row goes to WO-217 |

The order-size rule's reopening condition ("merged orders fail first
verification more often than the five-of-eight baseline") has not
occurred: the 6 of 8 figure counts every order, and no merged order
(WO-207, WO-193, WO-204, WO-080) has run.

## 3. The host documentation read for the trust design

Read by the research worker on 2026-10-18 from the published pages; the
code.claude.com pages came back as page text, the Codex and Copilot pages
through an extraction that cut some sentences. Each fact below carries its
page. These are the inputs to WO-221's Design A; nothing here is
DotLn's own claim.

| Host | Fact | Page |
| --- | --- | --- |
| Claude Code | Narrow literal `permissions.allow` rules resolve before the classifier; `permissions.deny` blocks before it; broad rules (`Bash(*)`, wildcarded interpreters, package-manager run commands) are dropped on entering auto mode. "By default, narrow Bash and PowerShell allow rules such as `Bash(npm test)` stay in effect in auto mode. Claude Code resolves them before the classifier runs." | code.claude.com/docs/en/auto-mode-config; permission-modes |
| Claude Code | `autoMode` is read from user or managed settings and the `--settings` flag only. "The classifier doesn't read `autoMode` from project settings in `.claude/settings.json` or `.claude/settings.local.json`. Both files live in the repo directory, so a checked-in repo or a build step could otherwise inject its own allow rules." | auto-mode-config |
| Claude Code | The trusted repo is the working directory and the remotes configured at session start; "pushing to a third-party repository, unless you named that external target" is treated as external. The bracketed refusal label is the matched rule's name; the pages read do not list "Out-of-Place Publication" or "Self-Modification" by name. | permission-modes; auto-mode-config |
| Claude Code | A Bash rule matches literal text and cannot be path-scoped; `Bash(git push *)` does not match `git -C . push`; a `*` before the subcommand warns at startup. Project `.claude/settings.json` allow rules apply only after the workspace trust dialog; "Claude Code saves the rule to `.claude/settings.local.json` at the root of the git repository, resolved through worktrees to the main checkout", and that untracked file needs no trust. After three consecutive or twenty total blocks, auto mode falls back to prompting. | permissions; permission-modes |
| Claude Code | Whether a PreToolUse hook's `allow` pre-empts the classifier is not stated in the pages read. WO-178's admission is the kit's standing claim; WO-221 criterion 4 tests it. | hooks; auto-mode-config |
| Codex | "Version-controlled folders: `Auto` (workspace write + on-request approvals)"; "By default, the agent runs with network access turned off"; a network command asks for approval. Project `.codex/` layers load only when the project is trusted; a `prefix_rule` with `allow` runs the command outside the sandbox without prompting; a directory outside the workspace is added with `--add-dir` or `writable_roots`. | learn.chatgpt.com/docs/agent-approvals-security; config-file/config-basic; agent-configuration/rules; cli/reference |
| Copilot CLI | `--allow-tool` and `--deny-tool` take `shell(git push)` forms and last for the session; saved approvals live in `~/.copilot/permissions-config.json`; "Deny rules always take precedence over allow rules"; the CLI reads `.claude/settings.json` hooks and not Claude permission rules; repository-level settings accept an allowlisted key set that pre-approves no tool. | docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools; reference/copilot-cli-reference/cli-config-dir-reference |

## 4. The nine observations, against the record

### 4.1 Three layers of decisions, and how each is changed

The boundary is declared in product 03 §Platform and instance boundary:
"A platform mechanism is not active instance doctrine" and "the core does
not silently ship the author's preferred organization as universal
defaults." What is implemented of it today, read in the kit README §Kit
files and instance files and in `UPSTREAM.md`:

- **Base machinery** is the manifest-listed kit: `scripts/**`, the compiled
  packages, the emitted harness bundle under `.claude/`, `.agents/` and
  `.codex/` (hooks, skills, settings), product 07, product 08, the
  playbook and the overlay template. An update replaces these; editing
  one is the true-fork path for that file.
- **The core operator's decisions** travel inside that kit as text: product
  07 cites "operator direction" eleven times, and the compiled role text
  (the skills) carries the model pins, the handoff rule, "No branch
  commits before final review", the order-sizing rule and the rest. A
  fork can recognise them by their citation, but today it cannot decline
  one without true-forking the file: the build overlay (`build/overlay.json`,
  version 1) switches compiled supports and `build: none`; the product
  overlay narrows and qualifies product claims; neither replaces a product
  07 sentence or a role step. WO-207 (queued) adds an extension root for
  the instance's own adapters, not role steps. This is a real gap; it is
  recorded as a candidate in the map with its reopening condition (§9),
  not filed, because the fork's one need today (its draft route) is met by
  instance files plus one opt-in kit form.
- **The fork owner's decisions** are instance files: `dotln.config.json`
  (classes, registrations, authority profiles, gates, grants), the fork's
  planning documents, orders, decisions and evidence, its overlays, its
  seeds. The fork's D8 (the draft at verified), its twenty-one house rules
  and its registration of DotLn-Angular are such decisions; the fork's
  own planning pass changes them. The verifier making a draft is, as the
  operator says, a custom operation: its home is the fork's order text
  naming the actor and the phrase, running a kit form that exists for it.

### 4.2 and 4.3 Routing, and whether fork changes break updates

| Finding | Platform (this pass) | Fork (Appendix A) |
| --- | --- | --- |
| Auto-mode refusal of the target push; no trust from the registration | WO-221 A: hook admission from the registration; literal-rule fallback; Codex rules; Copilot lines; qualification | record the interim user-settings entries as outside-the-repository measures; remove them after the upgrade order's qualification |
| Draft at verified, second pull request, hand close | WO-221 B: the opt-in `--draft` form and the reuse; no kit default | the route stays the fork's; name the actor and phrase; strike "the operator closes the draft"; strike the WIP commit |
| Criterion 6 due after verification | none (the kit judges criteria at verification) | place it as a final-review obligation read from `preview-pr.json` |
| Close refused on build output; output moved to scratch | WO-221 C: `disposable` declarations, fetched-tree judgment, deletion, refusal and role text, gate advisory | declare the Angular class's disposable paths; pin the Angular cache per worktree |
| "Remote branch left" | none (the forge's delete-on-merge removes a merged head; one pull request per order) | turn the setting on for DotLn-Angular |
| Sibling release without a hand step | WO-221 D: `release.policy: declared` and the order's `Target release classification` | opt in through the registration and the grant |
| The starter has no releases | WO-221 D: the refresh pushes core's tag and creates the sibling's Release | the upgrade order previews `--from vX.Y.Z` |
| Override at WO-216's close; the decision's home | WO-217 (the `finish` strip, from FINAL-002 F1) and WO-219 (a post-close record lane); D035 written in this pass (§9) | none |

Fork changes do not break the update path while they stay in instance
files: the kit README §Taking upstream updates says instance files are
outside the kit-file refusal list, the update replaces unmodified kit
files, and a kit file the fork edits is refused at every later update
and kept at its prior manifest hash ("Editing a kit file is choosing the
true-fork path"). The fork's three commits of its own kind (its planning
pass, its registration, its WO-004 records) touched instance files only
(`git log` of `DotLn-Instance`, read 2026-10-18). A kit-level need goes to
core as a request: WO-193 builds that channel; until it lands the route is
the one the operator just used, carrying the fork's reports into a core
planning pass.

### 4.4 Boarded or folded

Folded. The operator's user-settings edit is the interim measure and stays
the operator's; the platform fix is a new order (WO-221) because its
surfaces (the hook host, the publish helper, the close helper, the release
helper, the registration validators) are one subsystem, the target-order
lifecycle in an instance, and none of the four boarded batches owns it.
Two items that belong to existing batches are added to them: FINAL-002's
packet to WO-217 (the gate) and the post-close record lane to WO-219
(records). The register rows are in §8.

### 4.5 The two pull requests

The fork's D8 says it in full: "Until the kit carries it, each target order
pushes `wo-NNN` after the verification pass, opens a draft pull request …
the published pull request on `<type>/<slug>` supersedes it and the
operator closes the draft. … Reopen when the kit lands the draft route."
The kit's publish (`publishTargetWorktree`, `scripts/lib/target-publish.mjs`
line 776) is legal only at `closed` with a passing final review and opens
its own pull request on the declared branch. Two routes, two pull requests,
one hand close. DotLn-Angular shows #1 (draft, `wo-004`, closed) and #2
(`feat/scaffold-workspace`, merged) (`gh pr list`, 2026-10-18). WO-221 B
gives the kit the one form the fork's route needs (a draft the final
publish reuses); the route itself, its actor and its phrase stay in the
fork's orders.

### 4.6 The close

Both refusals are kit behavior read in `scripts/lib/target-worktree-close.mjs`:
`closeClean` (lines 65 to 86) judges the base checkout's untracked files
with the pre-fast-forward working copy's ignore rules, and the
ignored-material refusal (line 424) says "Move or remove the listed paths"
and removes only bundle-owned files and Finder metadata. Nothing in the
kit declares a class of regenerable output, so the session had only the
preserving reading of the role text. WO-221 C declares it, deletes it, and
says so in the refusal and the role text. The "remote branch left" line
is the role text's own limit ("no pushes to any other branch"); with one
pull request per order the forge's delete-on-merge setting removes the
merged head, and DotLn-Angular's remote holds `main` only today (`git
ls-remote --heads`), so no kit deletion is filed (§9).

### 4.7 A release of the sibling

Platform: `scripts/release.mjs` sets `no-release` for every target order
(line 2461) and the fork's registration denies `release.close` for the
target; no key or header asks otherwise. WO-221 D adds the declared
policy and the order header; the fork opts in by editing its registration
and grant (Appendix A). The starter's missing releases are the same
subsystem: the refresh fetches `--no-tags` and pushes one commit, so a
fork can take a revision only by finding the refresh commit's message;
WO-221 D pushes core's tag and creates the sibling's Release.

### 4.8 Why the hand steps increased

Counted from the fork's WO-004 records, the DotLn-Angular pull requests
and this repository's WO-216 close, the operator's hand steps on the two
orders of 2026-10-18 were: the hand-built user-settings edit (1); the
criterion 6 waiver (2); closing draft #1 (3); the three corrections that
build output is deleted (4 to 6); the override at WO-216's close (7); the
question where the override decision lands (8); deleting the draft's
remote branch (9). Nine, against the four phrases and one merge an order
is designed to cost the operator. Each was the first time a path ran
outside a fixture: the first target push under a host classifier, the
first draft route, the first target close with build output, the first
override at a closed order. The kit's target-repository support was
exercised by fixtures that run no host classifier and leave no build
output, and three recorded decisions put the operator in the loop on
purpose (trust is the operator's business; a review packet routes a
choice to the operator; the override record wants an open order). This
pass reverses those three at the kit, and the fork's prompt takes the
rest. The count is the measure to reread at WO-221's close: the fork's
next target order should cost the operator its phrases and one merge.

### 4.9 The override at WO-216's close

FINAL-002 F1 found that `worktree finish` would copy 154 pre-repair gate
rows holding about 50 MB of passing timeline output into main's live
index, and routed the choice to the operator because the fix
(`finish` applying the runner's `failedOutputOnly` to copied rows) is a
code change outside WO-216's surfaces. The operator chose the strip under
override. Two defects, both kit: the review offered an override as one of
three options where accepting the growth was safe (a candidate rule for
the reviewer profile, §9), and `override-record` admits only open phases
(`scripts/resume.mjs` line 284), so at a closed order the hook's advisory
sends the record to the order's tracked decisions file, which on clean
main has no pull request to carry it. The strip is right and stands; its
record is D035 in WO-216's decisions, written by this pass from the
retained draft and carried by this pass's pull request (§9). The code fix
goes to WO-217 as FINAL-002's packet; the record lane goes to WO-219.

## 5. The diagnosis the fork's verifier asked for

Files: `packages/skeleton/src/harness-host.ts` (`releaseCloseAdmission`,
line 1227, the only admission), the emitted `.claude/settings.json` (four
deny rules and hooks), `scripts/lib/harness.mjs` (the emit), the
registration in `dotln.config.json` (no trust field), the target bundle
(no settings). Decisions: FUP-dbced48c3d572461 (2026-09-30, second pass
§8: an auto-mode trust entry is "the operator's action outside the
repository"); WO-178's declined alternative (`autoMode.allow` prose in
user settings); WO-195's declined alternative (a project allow rule admits
any order's publish). Each predates a registered repository being
published from under a host classifier, and the register's reopen
condition for the first ("the first Claude auto-mode close after WO-178
records a denial of the admitted command") named the launchpad's close,
not a target's push. The fix design and the order are WO-221. Whether it
ships automatically: yes; every mechanism is a manifest-listed kit file or
a registration key, so a consumer takes it with its next kit update and
re-emit, and the per-order rules and printed lines are generated at
`worktree start` from the registration. The fork's upgrade order takes
the starter revision that the refresh now tags.

## 6. Orders filed and amended

- [WO-221](../work-orders/WO-221-target-order-without-an-operator-step.md),
  filed: trust admitted from the registration with a qualified fallback;
  the opt-in draft form and its reuse; declared disposable output, the
  fetched-tree judgment, the refusal and role text, the gate advisory; the
  declared target release; the starter's tag and Release. Cost, provenance
  and the rejected alternatives are in the order.
- [WO-217](../work-orders/WO-217-boarded-follow-ups-the-gate.md),
  amended: four rows added (35 rows): FUP-851cba3a914ab359 (FINAL-002's
  packet: `finish` applies `failedOutputOnly` to copied rows, the F17
  cases, the sync orphan), FUP-9de14a69403e2b32 (the five hand-kept copy
  sites as copied-fixture closures), FUP-fb8cbeabbddef397 (docs-check's
  cost grows with closed history) and FUP-211986cdaa9f8c4f (the document
  gate's run count), the last two returned to open by FINAL-001.
- [WO-219](../work-orders/WO-219-boarded-follow-ups-records-roles-and-the-harness.md),
  amended: one row added (41 rows): the post-close record lane (this
  pass's candidate 1, FUP-b0418fa8b09362be), so `override-record` and any post-close record
  land in an ignored pending lane that the next `worktree start` carries
  into its reviewed change, as the sibling receipt does.
- WO-217, WO-218, WO-219 and WO-220: the Preflight fields rewritten to
  explicit `npm test -- --only <suite>` tokens, resolving VER-001 F3
  (FUP-17266e5072d4a25a).

## 7. The sequence

WO-216 leaves the list (closed, v0.84.0). WO-221 is placed first, before
WO-217, on the dispatch: the fork's next target order runs into every gap
it closes. The batches and the focus orders follow unchanged. The
operator may move WO-221 by one sequence edit.

## 8. The register

| Row | Disposition | Target |
| --- | --- | --- |
| FUP-dbced48c3d572461 (an auto-mode entry for DotLn's own publication) | allocated: the condition's spirit occurred on 2026-10-18 at the fork's first target push | WO-221 |
| FUP-81c8f4915c7790d3 (a draft at verified consumed by final review) | allocated for its platform share (the opt-in form); the route stays the instance's | WO-221 |
| FUP-851cba3a914ab359 (FINAL-002's packet) | allocated | WO-217 |
| FUP-9de14a69403e2b32 (hand-kept copy sites) | allocated | WO-217 |
| FUP-fb8cbeabbddef397 (gate cost and closed history) | allocated | WO-217 |
| FUP-211986cdaa9f8c4f (document gate run count) | allocated | WO-217 |
| FUP-17266e5072d4a25a (explicit Preflight tokens) | settled by this pass's amendment of the four Preflight fields | — |
| FUP-90ebeaae273ae404 (receipt 046's known issues for WO-216) | settled: both conditions occurred during the repair and VER-003 and FINAL-002 passed after it; the launchpad lanes stay one at a time; reopen when a launchpad file row fails while another runs after v0.84.0 | — |
| FUP-f1c7a256bec46737 (cold start) | kept open as the operator's reserved efficiency pass (unchanged reading) | — |
| FUP-b0418fa8b09362be (candidate 1, the post-close record lane, minted by this pass) | allocated | WO-219 |
| FUP-edefd92233980b63, FUP-a423f8bea5c0e9b2, FUP-a8cba0428eaf01a9 (candidates 2 to 4, §9) | deferred with their conditions | — |

## 9. Decisions and NoOp records

**WO-216-D035.** The override at release close is recorded in WO-216's
decisions by this pass from the retained draft
(`docs/control/local/retained/WO-216/override-2026-10-18.md`): the strip
of passing `taskTimeline` output from 146 of 211 rows (55,064,368 to
8,301,035 bytes, the final-review row deep-equal before and after), the
close inside the window (v0.84.0, the starter refresh, cleanup clean) and
the reopen condition. This pull request carries it, which answers the
session's question.

Prose records in the `NoOpIntent` shape: `kind: NoOp`, a `reason`, cited
`evidence`, `reevaluation` cadence and `usefulWhen` condition.

| NoOp | reason and evidence | reevaluation | usefulWhen |
| --- | --- | --- | --- |
| A kit-default draft at verified | The operator's direction (15:51Z): the route is the fork's; the kit gets the opt-in form. Evidence: §1, §4.5. | At WO-221's close. | The operator asks for it in core, or a second instance records the same route. |
| An order for instance-declared lifecycle routes printed at transitions (candidate 3) | The fork's order text names the actor and phrase; the kit's admission makes the step legal; a printed step is a convenience without an occurred failure. Evidence: §4.1. | At the fork's next target close. | A fork's actor misses a declared step twice, or a second instance declares a route. |
| An order for marking core-operator decisions in kit text for instance override (candidate 2) | The fork's one need is met by instance files plus WO-221 B; the mechanism (marked blocks product 07 an overlay may replace, as `dotln-purpose` is) is a design the queued WO-207 and WO-096 touch. Evidence: §4.1. | At WO-207's close. | A fork true-forks product 07 or a skill to decline a core-operator rule, or asks to. |
| A reviewer rule that a packet never names an override as an option (candidate 4) | One occurrence (FINAL-002 F1); the record fix goes to WO-219 and the code fix to WO-217, which remove this packet's cause. Evidence: §4.9. | Each final review. | A second final-review packet offers an override. |
| Kit deletion of remote branches at close | The forge's delete-on-merge removes a merged head; DotLn-Angular holds `main` only; deleting an unmerged branch is outside the role by design. Evidence: §4.6. | Each planning pass. | A registered repository cannot enable the setting, or a merged head branch is observed to survive a close. |
| Reopening the order-size rule | The 6 of 8 figure counts every order; no merged order has run. Evidence: §2. | Each planning pass. | The condition occurs over merged orders. |
| An order for the `gate-task:target-worktree` duration | The latest fresh task ran inside WO-216's final-review complete run (41 suites, 100 fresh tasks, 2,211 s) after D028 added two cases with real Git operations; the inference is load, not regression. Evidence: FINAL-002 line 3, D028. | At the next fresh single-suite row. | A fresh `npm test -- --only target-worktree` row exceeds 77 s outside a complete run. |
| Re-recording the open cold-start row (FUP-f1c7a256bec46737) | 28,543 bytes against 24,576 (28,112 on 2026-10-17); the operator's reserved efficiency pass. Evidence: §2. | Every planning entry. | A role text changes the reading, or the operator opens the efficiency pass. |
| A reader run | Profile unchanged; `plan start` reported none due. | Every planning entry. | A changed profile with three unscored releases, or the operator's word. |

## 10. Write-backs

No product document is edited by this pass; the durable statements
(registration trust, the opt-in draft form, disposable output, the target
release, the starter tag) are WO-221's write-backs at its landing, and the
boundary statement already stands in product 03. The roadmap's generated
release table was refreshed inside its exempt block (`npm run release --
list --markdown --write`; 169 tags, v0.84.0 added).

## 11. Document ceilings

Product 07 grew to 213,853 non-exempt bytes through WO-216's close
(from 210,052); its ceiling is set to 235,238 with this section as the
decision. Every other document is unchanged since the 2026-10-17 pass and
keeps its ceiling. No order carries a byte bound.

## 12. Goal alignment and cost

The win condition the sequence names is progress in core, the starter,
the fork, DotLn-Angular and the rest at the same time, without
babysitting. This pass files the one order that removes the nine hand
steps of §4.8 from the fork's next target order and gives the fork the
decisions that are its own. Cost: one order cycle for WO-221 (its Cost
line) ahead of the four batches; the batches gain five rows. The NoOp of
filing nothing would leave the fork's WO-005 to pay the same nine steps.
`npm run meta -- --plan-cost` refreshed the cost table after the subject
revision.

Process cost for this pass: counters unavailable at entry (`harness usage`:
no session); the research worker reported 121,860 tokens and 438 s; the
pass's own counters are recorded in the ignored receipts.

## 13. Validation and independent judgment

Recorded after the refutation receipt is filed: the receipt id, scope,
holds and dispositions, and the `npm run test:docs` result.

## Appendix A. The prompt for the fork's current planning pass

Paste as one message into the fork's (`DotLn-Instance`) planning session:

```text
planning: observations from WO-004, routed by core's 2026-10-18 pass (DylanBWood/DotLn docs/planning/fork-observations-2026-10-18.md; the core order is WO-221, which lands trust from the registration, an opt-in draft form of worktree publish that the final publish reuses, declared disposable output at close, a declared target release and release tags on the starter). Settle each item below as this instance's own decision, with its source and reopening condition, then run the instance's refutation and test:docs as usual.

1. The draft at verified stays this instance's route; core ships no default. Amend D8 and every open target order (WO-005 to WO-008): name the actor and the phrase (the session that records `verification-result pass` is the natural one) and the command `npm run worktree -- publish WO-NNN --target-worktree --draft --branch <type>/<slug> --title "<title>" --body-file <reviewed path>`, available from the starter revision that carries core WO-221. Strike "the operator closes the draft": the final publish reuses the draft's branch and pull request. Strike the WIP commit on wo-NNN and the force-push by hand: the draft form commits from the tree without moving HEAD, and the final publish force-pushes with lease against the recorded draft head.
2. Decide whether WO-005 waits for the upgrade order that takes that starter revision, or runs now under D8's hand route and the operator's interim user-settings entries. Record the cost of each; the operator chooses.
3. A criterion whose evidence is the draft pull request's workflow runs cannot be met at verification. Rewrite WO-004's criterion 6 pattern in WO-005 onward as a final-review obligation read from docs/evidence/WO-NNN/preview-pr.json, so no waiver is needed.
4. Angular cache: @angular/build resolves a relative cache path to the main checkout when the workspace is a Git worktree (src/utils/normalize-cache.js, read by the release-close session). Add to WO-005 a step that pins the cache inside each target worktree; verify in the worktree's node_modules which setting avoids the redirect (an absolute `cli.cache.path` per worktree, an environment variable, or none), and record the result in docs/repositories/dotln-angular.md and the generator log.
5. Registration edits for the upgrade order (instance files): `classes.angular-nx-monorepo.disposable` listing node_modules/, .nx/, dist/, .angular/, coverage/, test-output/ and the Playwright output directories (confirm each against the merged .gitignore); `repositories.dotln-angular.release: { "policy": "declared" }` with `release.close` moved from deniedEffects to allowedEffects if DotLn-Angular is to get releases, after which each target order declares `Target release classification`.
6. Host trust: record in this instance's decisions (not the kit) that the operator's `autoMode.environment` entries of 2026-10-18 are the interim measure outside the repository, to be removed after the upgrade order's qualification shows the kit's admission carries the push. Turn on "Automatically delete head branches" for DylanBWood/DotLn-Angular (operator setting) so merged heads leave on their own.
7. Requests to core: until core's WO-193 lands the request channel, a kit-level need found here is carried by the operator into a core planning pass, as these were; keep each such need as a dated note in this instance's planning document so nothing waits on memory.
```
