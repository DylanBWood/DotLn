# WO-247 decisions

## WO-247-D001 — Two role sentences and the oracle that pins them

```json
{
  "id": "WO-247-D001",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 7, the router's merge sentence and the floor's grant sentence",
  "decision": "The router's re-entry sentence now states the merge as close judges it: the branch is an ancestor of the remote base and the order's passing final review is in its own control record there, and for a target its branch has left its recorded base and reached the target's remote base; it also names the awaiting-close stop and the one admitted host change. The shared floor's grant sentence names the one grant whose failure is not an advisory: an unresolvable order-worktree root withholds that grant alone. packages/skeleton/fixtures/wo247-role-baseline.json pins both role trees at both economy settings, linked to the integrated oracle and carrying its upstream and branch chains; the historical oracles stay byte-exact.",
  "evidence": [
    "WO-192-D099 recorded the router's sentence that both bases contain the branch as true though weaker than close's rule; WO-192-D094 recorded the floor's grant sentence as inexact for one grant and declined to edit it for about 90 bytes of cold start.",
    "docs/AI-HARNESS-SECURITY.md states beside the order-worktree grant that roots which cannot be resolved withhold this grant alone while the role's other grants are still judged (WO-192-D093), where the floor said every grant failure admits with one advisory.",
    "Measured after npm run sync: the floor sentence adds 78 bytes to every role; the router sentence adds 326 more to the router, at 15,418 bytes against its 16,384 ceiling. Every role stays within its ceiling or accepted ceiling: executor 37,979 of 40,194 accepted, planner 23,892 of 24,576.",
    "The oracle's startupCost links each role to the integrated oracle's bytes; the router now has an earlier measurement to link to, so scripts/test-gate-followups.mjs links it as it links the other roles."
  ],
  "rejected": [
    {
      "option": "Leaving the floor's sentence and stating the exception only in the security document",
      "reason": "WO-192's handoff lists it among the ten items the operator's waiver sends here, and a reader of the floor acts on the floor."
    },
    {
      "option": "Rewriting the integrated oracle in place",
      "reason": "Historical snapshots stay byte-exact; a role edit mints a linked oracle."
    }
  ],
  "reopenWhen": "A later role edit mints the next oracle, or a cold-start ceiling is reached."
}
```

## WO-247-D002 — A driven phase keeps its Codex session files until the episode ends

```json
{
  "id": "WO-247-D002",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 1, retention before cleanup",
  "decision": "codexExecArgv takes ephemeral: false, which drops only --ephemeral from the shared flags; the drive's phase launches use it so the isolated home holds the session files while the phase runs. A declined or failed phase copies that home, without its auth link, beside the drive record before the episode removes it. Every other Codex episode stays ephemeral. This edits packages/skeleton/src/worker-transport.ts, a judged feedback source, so this order owes one live feedback episode against its Cost line, which said none; product 07 authorizes an owed episode in the executor's session, as WO-240-D008 applied it.",
  "evidence": [
    "WO-192-D102: the reason for the declined close was in no retained record because the live fixture's temporary home was removed; the auto-review page read on 2026-10-31 (learn.chatgpt.com/docs/sandboxing/auto-review) says Codex returns the review rationale to the main agent and retains transcripts under the sessions directory of the Codex home.",
    "codex exec --help on CLI 0.166.0: --ephemeral runs without persisting session files to disk; the shared flags carried it for every episode.",
    "npm run sync after the edit: feedback evidence is stale; judged behavior changed since docs/evidence/WO-240/feedback-001 (packages/skeleton/src/worker-transport.ts); a behavioral change needs a fresh live self-host episode.",
    "The episode ran on 2026-11-01 from 00:40 to 00:42 UTC under the bounded wrapper: feedback-audit on claude-cli-print at claude-opus-5-5 and xhigh, phase complete, ten fixtures, 1192 saved instruction bytes; feedback-evidence --write and --record-selfhost filed docs/evidence/WO-247/feedback-001, and --check reports that its live audit judged the current source with ten passing regressions and ten removal failures. Sync carries an edition and cannot select a live one, so docs/evidence/current.json was pointed at WO-247 revision 001 by hand, as WO-240 moved it in b37be811; the check then reads that edition.",
    "The scratch alternative, filtering --ephemeral out of the builder's output in scripts/lib/drive-worker.mjs, was not taken: the builder is the one owner of the exec argv, and a caller that edits its output hides the flag's meaning from the next reader."
  ],
  "rejected": [
    {
      "option": "Filtering the flag out of the built argv in the driver",
      "reason": "It makes the one builder's contract false for one caller and needs no fewer bytes than the option."
    },
    {
      "option": "Keeping every phase ephemeral and relying on the --json stream alone",
      "reason": "The stream's command_execution item carries no reason for a declined command, as attempts 49 and 50 show; the reason reaches the agent, and the session files are where it is retained."
    }
  ],
  "reopenWhen": "A Codex release reports the review's reason in the --json stream, or the feedback edition's judged sources change."
}
```

## WO-247-D003 — What a declined phase retains, and where

```json
{
  "id": "WO-247-D003",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 1",
  "decision": "The stream reader keeps the declined item in the enumerated vocabulary: the command's shape, its kind, status declined, the reason the host printed in the item's output or on stderr, with every URL, path and query masked and the raw text left in the retained stderr, or that it printed none, its diagnostic signals and its sequence in the stream; beside it the last 64 rows as enumerated row and item types with statuses and exit codes. The transport writes a phase's raw stream and stderr beside the drive record while it runs and keeps them only when the phase was declined, refused or failed; a declined or failed Codex phase also keeps its isolated home's session rollouts and their index there, nothing else the home holds and never the auth link, and a copy that fails records its cause without losing the phase's result. The live fixture copies these into the launchpad's ignored live-drive-reports before removing the fixture, named by action and attempt, and records rawTranscriptsRetained with their paths. The committed receipt carries the enumerated form only.",
  "evidence": [
    "WO-192-D040 fixed the information boundary: enumerated signals and command shapes, no error text, paths, queries or results; the receipt keeps that boundary while the raw capture lives in ignored storage beside the retained verification reports the fixture already keeps.",
    "scripts/test-drive.mjs: the declined phase case shows the reason retained from the item's output and a Claude denial retained without its prose; the capture case shows a clean phase's files removed and a declined or failed phase's kept, only the files it wrote named, and a capture that cannot be written reported as such.",
    "scripts/test-drive.mjs (after the reviews of 2026-11-01, D012): a reason naming a path, a URL and a query reaches the record as <path>, <url> and <query> and the record holds neither the path nor the query; the retained home holds sessions/ and session_index.jsonl alone, a link inside it stays a link, and a copy into an unwritable directory records failed ENOTDIR with the phase's result intact.",
    "The command shape vocabulary gains the lifecycle actions, close, prepare, integrate and the publish, dry-run, local, review, document and sync flags, and names release.mjs, worktree.mjs, refute-plan.mjs and test-runner.mjs, so attempt 49's declined item would read as release.mjs close <operand> --publish instead of five operands."
  ],
  "rejected": [
    {
      "option": "Retaining the whole fixture home",
      "reason": "The order rejects it on size; the reason is kilobytes."
    },
    {
      "option": "Keeping every phase's raw stream",
      "reason": "A phase that ended normally leaves nothing to diagnose, and a stream can reach tens of megabytes."
    },
    {
      "option": "Retaining a Claude denial's decision_reason text",
      "reason": "The host already classifies its decision source, the stream's privacy regressions pin that prose out, and the order's step names the Codex stream."
    }
  ],
  "reopenWhen": "A diagnosis needs a row the tail did not keep, or a host prints a reason in a field the reader does not read."
}
```

## WO-247-D004 — A declined close stops at awaiting-close; one host change is admitted

```json
{
  "id": "WO-247-D004",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 4",
  "decision": "When the host declines the release close, the drive stops with reason awaiting-close and a next step naming the attended phrase, resume: release close in the launchpad's main checkout for the order, and, after a Codex decline, the one admitted re-entry, node scripts/drive.mjs WO-NNN --host claude; a close the Claude host declines names the attended phrase alone. The record keeps awaitingClose with the declined item and the retained observation, and no refusal; canonical status builds the same row from it after released and before any refusal, so a close attended since reads as released and a same-host re-entry stops at the row without retrying. Re-entry with --host claude is admitted while the Codex decline is the order's current fact, the order still closed and the record stamped at the log status reads, for that activation's release close only: it is recorded as hostChange with its cause and clears the stop, the driver refuses any other phase under the change, a later activation drives on the host recorded before it, a decline stamped at an earlier log is not carried, the change is stamped with the activation it belongs to and ends with it, a re-entry on another host whose record holds neither a decline nor a change is refused before any effect, and every other host change is refused as before. The live fixture's Codex-to-Claude close finish runs under the episode's one election; under host the Claude close router keeps the inherited sandbox, a pairing no passing Claude run has yet used (WO-192's passing runs disabled the sandbox), so the fixture admits its permission options for that router and the record names the limit.",
  "evidence": [
    "WO-192-D102 and the handoff's section on the unmet clause: re-entry refused a host change, so an order Codex drove to merge could not be finished by switching to Claude, and the stop named no step.",
    "scripts/test-drive.mjs (after the reviews of 2026-11-01, D012): the stop names --host claude after a Codex decline alone and a Claude decline stops at the row without it; a decline stamped at an earlier log is dropped on re-entry and a reactivated order routes by its phase; the driver refuses another phase under the change naming the recorded host; recordedDrive returns a later activation to the host recorded before the change.",
    "scripts/test-drive.mjs: a declined close stops at awaiting-close naming both routes; another declined phase keeps dispatch-refused; admittedHostChange admits codex to claude with the stop recorded and refuses the other three combinations; a seeded record re-entered with --host claude records the change and clears the stop, and the close then completes on the admitted host.",
    "scripts/lib/drive-route.mjs exports the stop row the driver and status share, so the next step reads the same in both."
  ],
  "rejected": [
    {
      "option": "A silent host switch",
      "reason": "The recorded host is a fact of the receipt, and the change is the operator's step."
    },
    {
      "option": "Retrying the close on the same host",
      "reason": "A denied launcher is not retried (WO-192-D042)."
    },
    {
      "option": "Admitting the change for every phase",
      "reason": "Every phase before the close keeps its recorded host; only the close has a documented decline to answer."
    }
  ],
  "reopenWhen": "A host declines a phase other than the close in a way the operator wants finished elsewhere, or Codex admits the close."
}
```

## WO-247-D005 — Live receipts name the code they ran on, and completion compares it

```json
{
  "id": "WO-247-D005",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 5",
  "decision": "Every live receipt carries codeIdentity: the authoring checkout's gate code identity at the export the fixture ran, with the head it read, beside the fixture trees' own hashes as provenance. Every launched role's row carries drivenStart: the installed root's bytes as the cold-start meter counts them plus the launch text scripts/lib/drive-prompts.mjs adds, recorded and not bounded. At completion every live-drive-attempt-N.json receipt a met criterion cites is read; a receipt that is absent, unreadable or without an identity refuses naming the receipt, and a met criterion that names a live lifecycle or a live drive must cite one and its receipts must carry the handoff identity, a mismatch refusing with both identities named. A receipt another criterion cites is evidence of what it recorded, admitted and recorded with whether it matches, so a diagnosis receipt from earlier code can be cited where it belongs. Mechanism wording such as the live receipt's identity and a negated mention such as no live drive name no run, while one plain mention does whatever a later clause negates; receipts cited anywhere between a judgment and the next judgment or heading count with it, and a fenced example counts for nothing. The receipts a completion admitted are recorded on its event with their identity and match.",
  "evidence": [
    "WO-192's handoff judged 'on the final code' by file times because no receipt carried an identity; gateCodeIdentity binds tracked and untracked source bytes and excludes documents, reports and generated projections, so the receipt file itself does not move it.",
    "scripts/test-off-ramps.mjs through scripts/resume.mjs: an absent receipt, a receipt without codeIdentity.source and a mismatched identity each refuse implementation-ready naming the receipt; a criterion naming a live lifecycle without a receipt refuses, a receipt on the judgment's wrapped line is read, a fenced receipt counts for nothing, and the wording of WO-242 criterion 3 (the live run of criterion 8) and WO-168 criterion 9 (no live episode) owes no receipt; a matching receipt is admitted and recorded as liveReceipts on the event.",
    "WO-192-D095 measured the driven start at 40,646 bytes on Claude against the 40,194 acceptance; scripts/test-process-debt.mjs now reads the figure beside the meter for every host and role and asserts no ceiling.",
    "The fixture trees never equal the source: scripts/fixtures/drive-live.mjs installs an exported kit and rewrites its configuration, so their hashes are provenance alone."
  ],
  "rejected": [
    {
      "option": "Whole-tree equality between receipt and handoff",
      "reason": "No fixture tree equals the source tree; the identity to compare is the source's."
    },
    {
      "option": "Bounding the driven start",
      "reason": "The ceiling's definition is planning's (WO-192-D095, FUP-dd1ac63cf4883d5f)."
    }
  ],
  "reopenWhen": "A driven start exceeds its installed ceiling by more than its launch text, or a receipt needs an identity for a tree the fixture does not install."
}
```

## WO-247-D006 — The sandbox election and the launch form each host documents

```json
{
  "id": "WO-247-D006",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 6",
  "decision": "dotln.config.json gains drive.sandbox, host or off, default host; another value refuses naming the key, and unknown drive keys refuse. One table in scripts/lib/drive-worker.mjs maps the election per host for every phase worker a drive launches and for the live fixture's router, each row recording what its form selects; the drive reads the election once and passes it to each launch, and an operator's own router session keeps the policy it was started with. On Claude, off passes sandbox.enabled false through the launch's --settings, which ranks above the checkout's local settings; host passes no sandbox setting. On Codex, host keeps --approve-for-me with workspace-write network access; off passes --sandbox danger-full-access, which cannot be combined with --approve-for-me, under exec's headless default of no approvals, the full-access form the sandboxing page documents. A host without a documented form refuses before launch naming the election. Each receipt records the selected election and form and, apart from it, what the host applied: Codex names its resolved sandbox and approval policy in the phase's own session rollout (its turn_context), read from the isolated home before the episode removes it; Claude's init row names its permission mode; neither stream reports more. Under off a Codex phase is told it runs with full access and no approval step, under host that each Git-metadata write is one approval request. DOTLN_LIVE_SANDBOX stays the fixture's override, named in the receipt as the election's source.",
  "operatorAuthorization": "Paraphrase: on 2026-10-26 the operator directed that the sandbox settings be disabled to unblock the runs and that a durable sandbox policy be planned, because their intended environments are unsandboxed (WO-192-D057). The order's operator-review assumption is that drive.sandbox defaults to the host's setting and that the operator elects off where their environments are unsandboxed.",
  "evidence": [
    "codex exec --help on CLI 0.166.0: --approve-for-me routes approval requests through automatic review using the workspace-write sandbox; --sandbox takes read-only, workspace-write or danger-full-access. A bounded probe with an empty Codex home: the argument '--approve-for-me' cannot be used with '--sandbox <SANDBOX_MODE>'.",
    "learn.chatgpt.com/docs/developer-commands?surface=cli, read 2026-10-31: --approve-for-me uses automatic approval review with on-request approvals and the workspace-write sandbox; conflicts with --sandbox and --yolo.",
    "learn.chatgpt.com/docs/sandboxing, read 2026-10-31: danger-full-access runs without sandbox restrictions, removing the filesystem and network boundaries; full access means sandbox_mode danger-full-access together with approval_policy never. codex-rs/exec/src/lib.rs defaults the headless approval policy to never and rebuilds it only when the resolved reviewer is auto review.",
    "learn.chatgpt.com/docs/non-interactive-mode, read 2026-10-31: by default codex exec runs in a read-only sandbox; edits require --sandbox workspace-write and broader access uses --sandbox danger-full-access, only in a controlled environment.",
    "code.claude.com/docs/en/settings and the glossary, read through Context7 on 2026-10-31: settings passed with --settings rank above local, project and user settings and below managed policy; the sandboxing page documents starting one session with --settings and a sandbox object.",
    "scripts/test-drive.mjs: the form table for both hosts and elections, the refusal for an undocumented pair (constructor and __proto__ among them), the Codex argv under each election through the captured arguments, the Codex phase text naming no approval request under off, the Claude --settings JSON carrying enabled false only under off, and codexObservedPolicy reading workspace-write and on-request from a rollout's turn_context and saying rollout-absent otherwise; scripts/test-configuration-root.mjs: the section's admission, defaults and refusals.",
    "The retained rollout of live attempt 1 (Codex CLI 0.166.0): the worker thread's turn_context names approval_policy on-request, approvals_reviewer auto_review and sandbox_policy workspace-write with network_access true, the form the launch selected."
  ],
  "rejected": [
    {
      "option": "A Support expressing the election",
      "reason": "A Support compiles authority into the bundle; this is a host launch setting the operator owns per instance (the order's design; WO-241's registry lists the key when it lands)."
    },
    {
      "option": "Writing sandbox.enabled false into the checkouts' local settings for a routed run",
      "reason": "Those files are operator-owned outside the fixture; the launch's own settings are the disposable form and rank above them."
    },
    {
      "option": "Keeping --approve-for-me beside danger-full-access on Codex",
      "reason": "The CLI refuses the pair, and the auto-review page says a full-access sandbox leaves nothing for the review to judge."
    }
  ],
  "reopenWhen": "A Codex release changes the full-access form or documents one that keeps automatic review, a second instance needs a policy per role, or a host exposes a per-run approval the election should name."
}
```

## WO-247-D007 — The review's reason, and the repair it admits

```json
{
  "id": "WO-247-D007",
  "date": "2026-11-01",
  "dispatch": "resume: next; steps 2 and 3, the close-only Codex diagnosis",
  "decision": "The declined close is a decision of Codex's automatic review, a separate reviewer agent, which the retention of step 1 now shows: the stream printed no reason, the host printed it on stderr, and the reviewer's own thread is in the retained session files. Its rationale restates the launchpad's release-close handoff sentence, which told every order that the close authorizes an annotated tag and a GitHub Release and needs egress for the tag push and the Release; for a no-release target order that sentence is false. The repair the reason admits is that sentence: scripts/resume.mjs now states what the close does for the order it names, a no-release close publishes nothing and removes the merged worktrees, and only an order whose version stands above the latest release is told its tag and Release are authorized: scripts/lib/release-close-handoff.mjs states each close's kind, a target's from the registration's release policy, a self order's from its heading's version against the latest tag the origin holds, both read as the close reads them (the heading reader, the tag readers and the comparison selfCloseKind live in scripts/lib/release-tags.mjs and the module, and the close branches on the same kind): above the origin's latest a release is due, below it a no-release close, equal to it the close verifies and reconciles the existing release, and an unreadable authority or unreachable origin leaves the kind undecided, which states the rule the close applies. The stream reader attaches the stderr-printed reason to the declined item and the signals name auto-review. One close-only Codex run on the corrected text recorded the finish: the review admitted the close and the drive reached released, so a driven Codex target order with no release due finishes on Codex under the default election; the awaiting-close stop remains the finish for a close a host declines.",
  "evidence": [
    "docs/evidence/WO-247/codex-close-refusal.md: the declined command, the reason as printed, the two verdicts, the CLI version and the pages read.",
    "live-drive-attempt-1.json: stop awaiting-close; the declined item reads release.mjs close <operand> --publish with reasonSource none-printed in the stream; rawTranscriptsRetained true with the three retained files; the reviewer's verdict for the handoff command was allow with user_authorization medium, and for the helper deny on a tag push and a Release the helper would not make.",
    "scripts/resume.mjs: the handoff read the same sentence for a self order with a release, a target with a declared release policy and a target with none; the corrected text states one of five kinds, and scripts/test-harness.mjs pins each kind's sentences and the kind reading from a heading and the local tags.",
    "scripts/test-drive.mjs: printedRejection reads the host's doubly escaped Rejected message and its plain form, the declined item carries the stderr reason with source native-stderr, and the stderr tail's signals read auto-review-rejected.",
    "live-drive-attempt-2.json, close-only on Codex CLI 0.166.0 with the corrected handoff, 2026-11-01T00:13Z to 00:16Z: the close worker exited 0, the receipt records publication no-release with cleanup clean and the target removed, the drive stopped at released, and no transcript was retained because nothing was declined."
  ],
  "rejected": [
    {
      "option": "Telling the review in the prompt that the operator authorized the close",
      "reason": "That argues with a safety check rather than satisfying it (WO-192-D102); the correction here is to a false statement in DotLn's own output."
    },
    {
      "option": "An execpolicy allow rule for the exact close command in the phase's isolated home",
      "reason": "A matching allow rule runs the command outside the sandbox without review; for a command the review declined that is the bypass the order forbids, and no operator granted it."
    },
    {
      "option": "Retrying the close until the review admits it",
      "reason": "A denied launcher is not retried (WO-192-D042); the one further run follows a real correction and records either outcome."
    },
    {
      "option": "Dropping --publish from the driven close",
      "reason": "scripts/release.mjs treats it as what completes a close even under no-release."
    }
  ],
  "reopenWhen": "A Codex release reports the review's reason in the --json stream, or the corrected handoff is still declined on the cleanup alone, which makes the attended close and the admitted host change the only finishes."
}
```

## WO-247-D008 — The ten items WO-192 left, each repaired where named

```json
{
  "id": "WO-247-D008",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 7",
  "decision": "The three reproduced defects: every time-limited remote Git read that refuses nothing when it cannot complete, the drive's time-limited lane reads of the bases and the handoff's origin tag read, which falls back to the undecided kind when it cannot complete, a credential prompt included, goes through spawnGitLimited in scripts/lib/git.mjs, which runs git as a process-group leader and ends the group when the limit ends git, so a transport helper cannot outlive the limit, while the publish push and the attended close's reachability probe keep the caller's group and its terminal, the probe because a credential prompt must stay answerable there (D012); routeFacts reads a launchpad merge only with the order's pass in hand, so a read with no events is not merged by ancestry alone; and a reactivated order's close receipt and release are read against its current activation, with the close receipt stamped at close and a release tag read at its control record. The six wording and record items: the read lane names itself and its refusals read remote read refused, not target publish refused; the router's merge sentence states close's rule (D001); WO-192's superseded step 8 is noted here, not edited, because the order file is a closed record; the floor's grant sentence names the one grant whose unresolvable root withholds that grant alone (D001); an operator's own Codex drive session runs no harness begin, so its router usage stays unknown, now stated in product 07; and the worker note is written from the list of forms the target lane admits, the integrate form's role limit included, instead of each helper's normal arguments. The direct CLI test of harness begin's refusal path covers no role, an unknown role, an unknown flag, a malformed router order, a missing adoption file and a second begin, beside the router's success with its order.",
  "evidence": [
    "A bounded probe before the repair: git ls-remote against an ext:: helper that records its pid and sleeps, under a 500 ms spawnSync limit, ended git with ETIMEDOUT and left the helper alive; the regression in scripts/test-drive.mjs repeats it and finds the helper gone within two seconds.",
    "scripts/test-drive.mjs: the same bases read as merged with the order's events and as awaiting-merge with none; a close receipt stamped with an earlier activation reads as not released and one stamped with the current activation reads as released; releaseHoldsActivation reads a tag's control record for the current activation.",
    "scripts/test-target-worktree-close.mjs pins the read lane's wording for a close whose fetch fails.",
    "WO-192's step 8 computed merged as the branch's ancestry in origin/main with no fetch, and released from localReleaseRecords or a no-release receipt; WO-192-D099 replaced the merge reading with close's rule, the branch an ancestor of the remote base and the order's pass in its own control record there, and this order adds the activation reading. The order file keeps step 8 as written; this decision is the note a reader needs.",
    "scripts/test-harness.mjs: the begin CLI refusals and the router success; scripts/test-drive.mjs: the note's forms clause is rendered from targetLaneForms, every row is admitted by drivenCommandEffect for the roles it names and refused for the others, and six unlisted forms are refused, release prepare without --local among them.",
    "docs/evidence/WO-247/controls.json, replayed 2026-11-01 after the reviews: each negative arm's first failing assertion is recorded beside both exit codes."
  ],
  "rejected": [
    {
      "option": "Editing WO-192's order file to correct step 8",
      "reason": "A closed order is a record; its reader is pointed here instead."
    },
    {
      "option": "Requiring every release tag to hold the current activation",
      "reason": "Only a reactivated order has an earlier activation to confuse; reading every closed order's tag at the base would change status for history that never changed."
    }
  ],
  "reopenWhen": "A reader of WO-192 is misled by step 8 without the note, or a hung remote outlives the group kill on a host whose git does not lead its group."
}
```

## WO-247-D009 — The publication fixture cannot reach a real host

```json
{
  "id": "WO-247-D009",
  "date": "2026-10-31",
  "dispatch": "resume: next; step 8",
  "decision": "publicationSetup sets the fixture clone's origin to https://github.invalid/dotln-fixture/target.git, a GitHub-shaped URL on the reserved .invalid domain that no resolver answers, which parseGitHubTarget accepts as any GitHub remote, so the production preflight runs unchanged. The fixture environment's URL rewrite to the local bare repository is carried by every Git call the fixture makes: the module's git helper looks up the fixture that owns the checkout it is called on and runs with that fixture's environment, so a direct push from a test or a probe reaches the bare repository and nothing else. publicationSetup asserts that no fixture remote names a resolvable host. Every GitHub-shaped fixture origin and selector in the target worktree suites moves to the reserved host; origins that were local bare paths under the fixture base stay local, which is how the criterion's clause is read, and the publish suite pushes once with the fixture environment and once without it to show the two arms. scripts/test-target-publish.mjs, outside the criterion's named suites, keeps its own github.com origin constant because its stub forge's pull-request and auth expectations derive from it (D012).",
  "evidence": [
    "WO-192-D099: two reviewer probes each ran a real git push through a fixture clone whose origin was https://github.com/dotln-fixture/target.git; GitHub answered Repository not found and nothing was published; only f.env held the redirect and the bare git helper did not carry it.",
    "scripts/test-target-worktree-publish.mjs: a push with the fixture environment reaches the local bare repository and one without it fails at resolution, with the forge log untouched.",
    "RFC 2606 reserves .invalid for names that are guaranteed not to resolve; the preflight's host form admits letters, digits and dots."
  ],
  "rejected": [
    {
      "option": "A local path or file: origin",
      "reason": "parseGitHubTarget refuses it, so the preflight the fixture must exercise would never run."
    },
    {
      "option": "A URL on a real host that refuses credentials",
      "reason": "Still a network call; the two probes of 2026-10-31 made exactly that call."
    }
  ],
  "reopenWhen": "A fixture needs a second forge host, or the preflight's host form changes."
}
```

## WO-247-D010 — An adjacent repair: the runtime lane in the configuration-root scan

```json
{
  "id": "WO-247-D010",
  "date": "2026-11-01",
  "dispatch": "resume: next; step 6's configuration-root preflight",
  "decision": "The configuration-root suite's lifecycle case lists every document a fixture launchpad holds outside its configured roots and found .runtime/.metadata_never_index, the Spotlight marker WO-233 writes into the Git-ignored runtime lane wherever a temporary root is created on macOS. The scan now excludes that lane beside the local harness lane it already excludes. The defect is not this order's: the same case fails identically at main's head in this checkout's sibling, and the marker's commit predates WO-240's passing gate, so the gate's own run of this case passed on a day the marker was not written there; the repair is bounded to the scan's exclusion list and recorded in the adjacent queue.",
  "evidence": [
    "node --test scripts/test-configuration-root.mjs in the sibling main checkout at e66730ee: unexpected documents outside the configured roots: .runtime/.metadata_never_index.",
    "packages/skeleton/src/temporary-root-records.mjs markUnindexed writes the marker into the repository's .runtime on darwin; git log -S finds it in f4163301 of 2026-10-27, WO-233.",
    "The same suite passes after the exclusion; the marker lives in the ignored runtime lane the kit's .gitignore names."
  ],
  "rejected": [
    {
      "option": "Not writing the marker into a fixture launchpad",
      "reason": "WO-233 owns that behavior; the scan, not the marker, was wrong about which lanes are documents."
    }
  ],
  "reopenWhen": "The runtime lane holds a document a reader should see, or another host writes a marker the scan should exclude."
}
```

## WO-247-D011

```json
{
  "id": "WO-247-D011",
  "date": "2026-11-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.106.0, the next minor above the observed release baseline v0.105.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.105.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-247-a-driven-codex-order-finishes.md"
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

## WO-247-D012 — Three reviews, their repairs, and a probe rule every review worker reads

```json
{
  "id": "WO-247-D012",
  "date": "2026-11-01",
  "dispatch": "resume: next; the three independent reviews before the complete run",
  "decision": "The design, criteria and consistency reviews (16, 16 and 9 findings) are resolved in code and records: a declined reason is masked of URLs, paths and queries before it reaches a record; the admitted host change holds only while a Codex decline is the order's current fact and covers that activation's release close alone, a Claude decline names the attended phrase alone, and a stale decline is not carried; live-receipt citations are read from a judgment's whole paragraph with fences honoured, and only a criterion naming a live lifecycle or drive owes a receipt; the release-close handoff states each close's kind from one module the close shares; the retained Codex home is the sessions and their index under an allow-list with a guarded copy; Codex's observed policy is read from the phase's rollout; a time-limited read alone leads its process group; the election is read once per drive and passed to every launch, and a Codex phase under off is told it has no approval step; the worker note is written from the list of admitted forms and tested against the judge; the publication fixture's two push arms are tested; the compiler's version constant moves with its package and the editions it stales are re-minted; the documents say the election governs launched phase workers and name the drive section and its inventory row. The operator's direction during the reviews, that a reviewer's suite run defeats the reviews' purpose and must be prevented for every session rather than one brief, is met by one sentence in the generated worker definition every spawned Claude reviewer reads, and by the same rule in the launching role's launch sentence, which a Codex spawn_agent brief carries because Codex workers get no generated definition: probes are single tests under the bounded wrapper and never a test-runner gate in any form, because a gate run holds the worktree's live-gate refusal against the parent's writes for its whole duration. A hook-enforced refusal of gate launches by review workers is a seventh refusal, a floor change beyond this order, left to planning as the follow-up below.",
  "operatorAuthorization": "Paraphrase: during the reviews on 2026-11-01 the operator asked why the consistency reviewer was running a gate at all, since the reviews exist to catch defects before the gate runs, and, offered a fix limited to this session's briefs, objected that every other session they run would stay exposed.",
  "evidence": [
    "The consistency reviewer's npm test -- --only resume, compiler and skeleton runs (142, 20 and 438 seconds) each registered as a live gate: every write in this worktree was refused while they ran (DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate scripts/test-runner.mjs), and the brief had admitted that form by forbidding only npm test without --only.",
    "packages/compiler/src/harness.ts: the dotln-worker definition's probe sentence; .claude/agents/dotln-worker.md carries it after npm run sync. packages/skeleton/src/loadouts/contributor.ts: the launch rule's probe sentence, which every launching role's skill carries for its Codex spawn_agent briefs; measured after npm run sync it adds 421 bytes to each launching role's skill, 499 with D001's floor sentence over the integration baseline (executor 38,400 of 40,194 accepted, planner 24,313 of 24,576, reviewer 36,003, verifier 33,233) and nothing to the router (15,418 of 16,384); the role oracle packages/skeleton/fixtures/wo247-role-baseline.json is re-minted over the same parents with its method naming the third sentence, and check-role-oracle passes.",
    "scripts/test-drive.mjs, scripts/test-off-ramps.mjs, scripts/test-harness.mjs and scripts/test-target-worktree-publish.mjs hold the regressions the three reports asked for; docs/evidence/WO-247/controls.json records each control's negative-arm assertion; the focused runs under the bounded wrapper and the resume suite script pass on the repaired code.",
    "The third round, 2026-11-01, on the second batch: 26 dispositions held and 3 did not (the fixture's decline row still pointed into the removed fixture because that edit had never been applied, the masks missed non-ASCII and Windows paths, and D007 and product 07 still described the earlier reading), with 8 new findings, repaired in a third batch: the decline row is taken raw from the drive record; the heading, tag and origin readers live in scripts/lib/release-tags.mjs and release close reads its self kind from the same functions and passes it through its context; latestActivationAt lives in scripts/lib/control-store.mjs for the close receipt and the host change alike; admittedHostChange returns the change with its activation and a named refusal runs before any effect; a change without an activation stamp ends with the closed phase, so no record leaves an order neither host may drive; the forms clause groups rows by script and role set; the masks use Unicode letter and digit classes and cover drive-letter paths; the refusal text names a live lifecycle or drive.",
    "The fourth round, 2026-11-01, on the third batch: every disposition held (18 of 18); 8 new findings, repaired in a fourth batch: the handoff's origin tag read had moved off the host read lane and so lost the process-group kill of WO-192-D098, which the criteria adversary reproduced with a hung ext:: helper; one spawnGitLimited in scripts/lib/git.mjs now serves the lane's reads and originTags, and the lane test covers both; the masks cover backslash and UNC paths and use Unicode classes in the query row and the variable prefix; the host change's activation is a required argument; the unused remoteTags limit option is dropped; the clause's doc comment sits on its function.",
    "The fifth round, 2026-11-01, on the fourth batch: 7 of 8 dispositions held; the one that did not was the design review's own round-4 fix, since dropping a default makes no JavaScript argument required, so the admitted path now refuses an undefined activation and callers with none pass null. Its 5 new findings are repaired in a fifth batch: the close's reachability probe is a time-limited network read and goes through spawnGitLimited too; originTags reports its failure through failureOf; the lane test's two waits share one helper; the mask comment lists its rows in order; D008 claims the rule for remote reads, not every Git call.",
    "The fourth complete run, 2026-11-01 06:12 to 06:50 UTC, passed on identity 5a6f7b70… with 45 suites and 114 fresh tasks in 0 h 38 min, recorded as host-gate:5a6f7b703f253fc3821167b27771454bde71e0deb43aaee6c67fe419e6a22b42:npm test. The two live requalification runs then started together on that identity at 06:55 UTC and both released: Codex (attempt 3) from 06:55 to 07:40 UTC and Claude (attempt 4) from 06:55 to 08:16 UTC. The same pair had run twice before, on identity 5384abfc… from 03:49 to 05:02 UTC (both released) and on identity e9fc5cec… from 05:26 UTC until the second complete run failed and both were stopped at 05:35 UTC; those receipts are superseded and stay in session scratch, outside the evidence directory, so every receipt the record cites names the handoff identity.",
    "The third complete run, 2026-11-01 05:38 to 06:08 UTC, failed on one runner-fixtures case, the pin of the target-worktree suites' declared test names in scripts/fixtures/target-worktree-cases.json, which the publish suite's new push-arms case had grown by one; the name joins both lists, the case passes alone, and the three reviewers confirmed the one-line change. The operator extended this dispatch's wall clock to 10 hours in ordinary language at 05:53 UTC, recorded as DispatchBoundAccepted with the capture under docs/intake/.",
    "The second complete run, 2026-11-01 05:27 to 05:33 UTC, failed on one process-debt case, WO-132's release-close handoff test, whose regex pinned the old self-order sentence (This narrowly) while the fixture, a self order in a temporary root with no origin, now receives the undecided kind; the regex admits either opening, the three reviewers confirmed the one-line change, and the live runs that had started on the previous identity were stopped so that the complete run reaches green before they run again on the final bytes.",
    "The first complete run, 2026-11-01 05:08 to 05:21 UTC, failed on one process-debt rule: the publish suite's new resolution arm spawned git directly instead of through scripts/lib/git.mjs (scripts/test-helper-reuse.mjs), and the later suites were not started. The call now uses spawnGit from the library with the same arguments and environment; the three reviewers confirmed the one-line change before the fresh run.",
    "The seventh round, 2026-11-01, on the sixth batch: every disposition held; two wording items are repaired (D008 describes the handoff's tag read by its fallback rather than as unattended, and the lane test's pid guard names its caller in its message), and nothing else was found. The eighth round confirmed both with one wording nicety, D008 naming the drive's time-limited lane reads rather than the host lane's reads at large, since the close's and publication's lane reads carry no limit and refuse when they fail; applied, and the reviews ended there: 87 findings over eight rounds, 79 repaired in code or records and 8 recorded as limits (the publish suite's own origin constant and its follow-up, the suites' literal host pins, the launch-text fold, the older inline row emitters, criterion 7's reading of local origins, the Codex-to-Claude close under the host election, the attended probe's helper outliving its limit, and the regression that would have covered a detached probe).",
    "The sixth round, 2026-11-01, on the fifth batch: every disposition held; the criteria adversary showed that detaching the close's reachability probe took its controlling terminal, so a credential prompt an attended close can answer would have read as an unreachable origin. The probe is returned to the caller's session as it was, D008 names it beside the publish push as an attended call whose helper may outlive its limit on a hang the operator sees, and the unattended reads keep spawnGitLimited.",
    "Dispositions recorded as limits rather than changes: scripts/test-target-publish.mjs keeps its own github.com origin constant because its stub forge's pull-request and auth expectations derive from it, outside criterion 7's named suites; the target worktree suites keep their literal github.invalid expectations as pins rather than reading the fixture's constant.",
    "The rechecks of 2026-11-01 on the repaired diff: 43 dispositions held and 4 did not (the receipt's awaitingClose row was not repointed at the copies, receipts counted on wrapped lines only, the masks covered the tested path forms only, two controls recorded a generic assertion line), with 18 new findings. The second batch repairs them: the receipt's decline row is taken raw from the drive record; a judgment's paragraph runs to the next judgment or heading and a plain live mention is not cancelled by a negated one; every scheme URL, hostname path, slash-bearing token and query is masked; a re-entry on another host is refused before any effect; the admitted change is stamped with its activation and recordedDrive ends it with that activation; the decline's currency is judged once; the handoff's self kinds read the remote's tags through the host read lane with one comparison the close shares, and the close branches on it; the worker note's forms clause is rendered from the table and release prepare without --local is refused; SANDBOX_FORMS is frozen through its rows; an unreadable rollout is named as such; the module is declared to the harness-fixtures suite; the publish fixture's resolution arm strips proxy variables and asserts the resolver's failure alone; the controls record the assertion's text.",
    "Correction, 2026-11-01 07:08 UTC: this decision's operatorAuthorization quoted the operator's direction in edited form, against the floor's rule that raw operator words are synthesized and rewritten and that exact wording is reserved for an operator-authored draft marked ready to file; the executor then planned to store the words verbatim in ignored intake to satisfy the docs check's digest route, and the operator objected before the file was written. The field is a marked paraphrase, D006's field is restated the same way, no capture of the words was made, and a search of this order's committed surfaces finds none of the operator's words."
  ],
  "rejected": [
    {
      "option": "Tightening only this session's review briefs",
      "reason": "A brief covers one session; the generated worker definition reaches every spawned Claude reviewer, and the launching role's rule reaches every Codex brief."
    },
    {
      "option": "A hook refusal of test-runner launches by review workers in this order",
      "reason": "It is a seventh refusal, named in the floor and product 07; a floor change is planning's."
    },
    {
      "option": "Masking only absolute paths in a declined reason",
      "reason": "The criterion names path and query text; relative file paths, hostnames with paths and query strings carry the same material."
    },
    {
      "option": "Moving scripts/test-target-publish.mjs to the reserved host in this order",
      "reason": "Five expectations derive from the constant and the suite is outside the criterion's named files; the exposure is recorded here for a bounded later change."
    }
  ],
  "followup": "Refuse a test-runner gate launched by a review worker at the hook: a Claude or Codex review worker that starts npm test, test-runner.mjs, target-gate.mjs or test:docs holds the worktree's live-gate refusal against its parent for the run's duration; add the refusal to the floor and the hooks as a seventh refusal, keyed on the worker identity the presence hooks already carry, with its product 07 text; and move scripts/test-target-publish.mjs's forge constant to the reserved host with its derived expectations.",
  "reopenWhen": "A review worker still reaches a gate under the new sentence, or a host's reviewer declines on a reason the masks mangle."
}
```

## WO-247-D013 — The compiler's version constant moves with its package, and the editions it stales are re-minted

```json
{
  "id": "WO-247-D013",
  "date": "2026-11-01",
  "dispatch": "resume: next; the consistency review's first finding",
  "decision": "packages/compiler/src/artifact-identity.ts names COMPILER_PACKAGE_VERSION 0.35.0 beside the package manifest the release preparation moved, as every compiler release since f5cae9ff has. npm run sync then re-minted what that constant stales: the harness manifest and hooks (compilerPackageVersion 0.35.0), the authority edition WO-247/004, the artifact-identity edition WO-247/001, the verification edition WO-247/001 and the feedback edition WO-247/002, carried deterministically from the live episode WO-247/001 of D002 because the behavior it judged is unchanged and only a component label moved; and the console self-host fixtures. The live requalification runs of step 9 follow this fix, since the constant is source and moves the code identity every receipt names.",
  "evidence": [
    "packages/compiler/test/artifact-identity.test.ts, WO-029: the constant must equal the manifest version; the consistency review ran the compiler suite and found '0.34.0' !== '0.35.0'; after the fix node --test packages/compiler/dist/test/artifact-identity.test.js passes 10 of 10 under the bounded wrapper.",
    "npm run sync, 2026-11-01: meta, harness, authority-evidence, artifact-evidence, verification-evidence, feedback-evidence, console-fixtures and publication regenerated; docs/evidence/current.json names the four WO-247 editions; docs/evidence/WO-247/feedback-002/edition.json records liveAudit.carried true from feedback-001 with the pins at compiler 0.35.0 and skeleton 0.75.0.",
    "ed225f7e (WO-192) is the precedent: the constant and the editions moved together with the compiler release."
  ],
  "rejected": [
    {
      "option": "Reading the package manifest at runtime instead of a constant",
      "reason": "The constant's own comment: reading a manifest would introduce I/O into compilation."
    }
  ],
  "reopenWhen": "A release moves the compiler's package version without this constant, which the compiler suite refuses."
}
```

## WO-247-D014 — Verify the supported lifecycle; board the synthetic status concern

```json
{
  "id": "WO-247-D014",
  "date": "2026-11-01",
  "dispatch": "resume: verify",
  "decision": "Pass the supported lifecycle criteria and record the unknown-status concern as a defensive-hardening follow-up. The verifier's synthetic file-change item supplied a status containing path and query text; eventTail copied it unchanged. The verifier did not reproduce Codex emitting that value, an actual retained-data failure, or a regression of a supported native event. That probe therefore does not establish an unmet criterion. The complete review row and the two full live lifecycles at the current code identity remain passing evidence. No waiver is needed or recorded.",
  "operatorAuthorization": "Paraphrase: the operator pointed to the passing complete gate and the successful full Codex and Claude runs, and directed that a synthetic concern without a real behavior reproduction be put in a follow-up.",
  "evidence": [
    "docs/evidence/WO-247/verification-001.json records the current code identity, the passing complete review row, receipt comparisons and independent probes.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-247/verifier-001-probes.mjs: P1 observes the injected status retained verbatim. Its input was constructed by the verifier and was not observed from a native host.",
    "The complete review row at 5a6f7b703f253fc3821167b27771454bde71e0deb43aaee6c67fe419e6a22b42 passes all 45 required suites with no missing suite. Live attempts 3 and 4 carry that identity, complete all four phase workers and both routers with exit zero, and finish released.",
    "Fifteen independently selected regression cases and the off-ramps CLI fixture pass. The latter actually exercises receipt identity refusal and admission through resume.mjs.",
    "Correction on 2026-11-01: the verifier announced that P1 would block criterion 1 before establishing a supported native-protocol input that could produce it. That classification was unsupported. It was corrected before any verification result was filed; the reproduction is preserved as a follow-up. The unfiled report records the successful gates and live runs accurately.",
    "Readout and invocation corrections are retained in verification-001.json: oversized reads were narrowed; the off-ramps startup assertion was corrected by supplying its canonical owned fixture root; the controls reader was corrected to use results. None is attributed to the implementation as a defect."
  ],
  "rejected": [
    {
      "option": "Failing verification on the injected status alone",
      "reason": "It shows a hardening opportunity, without establishing a required supported-input failure or a reproduced regression."
    },
    {
      "option": "Dropping the observation entirely",
      "reason": "An explicit status vocabulary would make the record boundary easier to maintain if the native protocol changes."
    },
    {
      "option": "Rerunning the complete gate or paid native lifecycles without changing the subject",
      "reason": "Their identities match the current source, and repeating the same supported flows would not establish the synthetic probe's missing precondition."
    }
  ],
  "followup": "Defensive hardening: decide whether drive-stream.mjs should omit or enumerate unknown native item statuses and Claude subtype strings before storing eventTail. Preserve known native statuses and add an unknown-value regression if that contract is adopted. First establish the supported native event vocabulary; do not present synthetic out-of-contract input alone as a lifecycle failure.",
  "reopenWhen": "A supported native event or a real host run produces non-enumerated status or subtype text, an actual receipt carries forbidden data, or planning adopts an explicit malformed-stream hardening requirement."
}
```

## WO-247-D015 — Board the fenced-heading receipt-parser edge case

```json
{
  "id": "WO-247-D015",
  "date": "2026-11-01",
  "dispatch": "resume: verify",
  "decision": "Record the fenced-heading edge case as a follow-up. criterionJudgments marks fenced rows, but the paragraph loop tests a heading before excluding a fenced row. A heading inside an example therefore ends the paragraph and loses the real receipt citation after the fence. This does not fail the order's required matching and mismatching CLI cases, which pass, and no behavior that main previously supplied was shown to regress. The verifier changes no implementation.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-247/verifier-001-probes.mjs: P2 supplies a judgment, a fenced Markdown heading, and a real receipt citation after the fence; the returned paragraph contains only the judgment line.",
    "scripts/lib/off-ramps.mjs: criterionJudgments paragraph loop checks a heading at line 240 before checking following.fenced at line 241.",
    "The off-ramps CLI fixture passes with its canonical owned-root setup, including absent, missing-identity and mismatching receipt refusals and matching receipt admission."
  ],
  "rejected": [
    {
      "option": "Adding a new blocking Markdown-shape requirement to criterion 4",
      "reason": "The required identity comparisons work; this newly identified formatting case is an adjacent parser defect and takes the standing follow-up route."
    },
    {
      "option": "Fixing the parser from the verifier role",
      "reason": "The independent verifier records evidence and a repair rule without changing the implementation it judges."
    }
  ],
  "followup": "Fix criterionJudgments so only an unfenced heading ends a criterion paragraph. Add a regression with a heading inside a fenced example followed by a real live receipt citation; preserve existing wrapped-line, blank-line and fenced-example behavior.",
  "reopenWhen": "The next in-scope repair touches off-ramps.mjs, or a real handoff loses its receipt citation because a fenced example contains a heading."
}
```

## WO-247-D016 — Final review: the three register rows whose conditions this order met, and the rows left as matched

```json
{
  "id": "WO-247-D016",
  "date": "2026-11-01",
  "dispatch": "resume: final review",
  "rows": [
    "FUP-957602bc42e32e1d",
    "FUP-e08668268dea62b1",
    "FUP-eed385be08e5bdd9"
  ],
  "decision": "Re-defer the three register rows whose conditions this order met, with the figures refreshed at the reviewed tree, and leave the other matched rows as they are. FUP-957602bc42e32e1d (WO-217-D053) and FUP-e08668268dea62b1 (WO-219-D009): their condition occurred, because the three reviewed sentences of D001 and D012 grew every installed role root beyond its measured baseline, 499 bytes in each phase role and 404 in the router: the executor reads 38,400 against the nominal 29,246 and within the 40,194 accepted on 2026-10-29; the verifier 33,233 against the nominal 29,831 and within 35,221; the reviewer 36,003 against the nominal 28,884 and within the 39,600 accepted on 2026-10-30; release-close 23,505 against the nominal 21,266 and within 26,410; the planner 24,313 within 24,576; the router 15,418 within 16,384; the refuter 23,127 with no ceiling. No ceiling moved, no duty was cut, and the optimization stays with the next planning pass that evaluates instruction-byte optimization. FUP-eed385be08e5bdd9 (WO-226-D022): its condition occurred, because this order touches scripts/test-gate-followups.mjs, where the router now links to the preceding oracle that names it, and re-mints the role oracle as packages/skeleton/fixtures/wo247-role-baseline.json over wo192-integration and wo192; the test keeps its chain walk, its effective-ceiling and acceptance checks and the historical 256-byte inequality on the earliest chained baseline, and whether that inequality still carries meaning is not decided here, because the final review changes no test. FUP-770baf2f452c669e (the planner root's entropy selector) is left as it is: the shared sentence changed every installed root, the planner's included, but the row's seam is the planner's own entropy sentence in contributor.ts, which this order did not edit, and carrying it would be a source change that moves the code identity and owes a complete run. The other matched rows name a path or this order in their text only.",
  "evidence": [
    "npm run meta -- --check at the reviewed tree: the installed cold-start lines for both skills roots, each phase role Δ 499 against the v0.105.0 edition and the router Δ 404, every bounded role within its ceiling or its dated acceptance, exit 0.",
    "packages/skeleton/fixtures/wo247-role-baseline.json startupCost: executor 37,901 to 38,400, verifier 32,734 to 33,233, reviewer 35,504 to 36,003, release-close 23,006 to 23,505, planner 23,814 to 24,313, refuter 22,628 to 23,127, router 15,014 to 15,418 with headroom 966; decision WO-247-D001.",
    "scripts/test-gate-followups.mjs lines 170 to 180 link the router to the preceding oracle that names it and keep its own ceiling check; line 267 still asserts the 256-byte inequality on the earliest chained baseline.",
    "npm run plan -- followups --touching at this review: register revision 523a9335…, 234 pending rows, 29 matched over four pages; the dispositions of WO-204-D042, WO-236-D031, WO-234-D029 and WO-192-D088 on the same three rows are the precedent this review follows.",
    "The three rows this order boarded itself (D012, D014 and D015) stay untriaged for planning."
  ],
  "rejected": [
    {
      "option": "Replacing the historical inequality with the headroom assertion WO-226-D022 asks for at this review",
      "reason": "A test change moves the code identity and owes a complete run, and the oracle carries headroomBytes for the router alone; the row stays with the next order that touches the file."
    },
    {
      "option": "Carrying the planner's entropy selector inside this review",
      "reason": "A source change the final reviewer would then certify itself; the row's condition names an order whose scope edits the planner's sentence."
    },
    {
      "option": "Leaving the three rows as matched",
      "reason": "Their reopening conditions name exactly what this order did, and every earlier order that grew the roots or touched the suite re-disposed them with its figures."
    }
  ],
  "reopenWhen": "The next planning pass evaluates instruction-byte optimization, another reviewed rule changes the measured roots, or the next order touches scripts/test-gate-followups.mjs or re-mints the role oracle."
}
```

## WO-247-D017 — Final review: the live runs' dollar record, and the total the record cannot give

```json
{
  "id": "WO-247-D017",
  "date": "2026-11-01",
  "dispatch": "resume: final review",
  "decision": "Record the live runs' dollars where the committed receipts hold them and board the rest. The order's known issue asked the executor to record each attempt's cost and the order's total in the decisions, with a reopening at more than half above WO-192's two final attempts (38.12 USD, so 57.18 USD). The committed record holds one dollar figure: attempt 4, the Claude lifecycle on the final code, cost 31.63 USD, 30.72 for the phase workers (executor 22.52, verifier 3.61, reviewer 3.30, release close 1.30) and 0.91 for the two router sessions (0.54 and 0.36); attempts 1 to 3 ran on Codex, which reports no dollar figure, and their tokens are on their rows (attempt 3's four phase workers used 22,318,786 input tokens, 21,783,040 of them cached). The two superseded Claude lifecycles and their Codex pairs, on identities 5384abfc… and e9fc5cec… (D012), left no receipt in the evidence directory, and this review found none in the ignored report lane, which holds attempt 1's retained observation alone, in the 130 session directories of the DotLn temp root by name and by content, or in a fixture root, none of which remains; their dollars are unknown. The recorded total, 31.63 USD, is below the reopening threshold; the order's actual total includes two further Claude lifecycles, one of them complete, and is unknown, so the reopening condition cannot be judged from the record. This is the final review's one finding, F1, a record gap in the declared surfaces that breaks no criterion and no behavior main had: repaired here as far as the record allows and boarded for the rest.",
  "evidence": [
    "docs/evidence/WO-247/live-drive-attempt-4.json: routerUsage.costUsd 0.9089754 over two router sessions; the four phase-worker rows' costUsd 22.52, 3.61, 3.30 and 1.30; limits.costUsd 60 for the phase workers. docs/evidence/WO-247/native-qualification.md states the same figures.",
    "docs/evidence/WO-247/live-drive-attempt-3.json: routerUsage.costUsd null, source native-router-result-stream; no phase-worker row carries a dollar figure; the Codex host reports none.",
    "A search of docs/evidence/WO-247/decisions.md and handoff.md for USD, a dollar sign followed by a digit, or the word dollar before this decision: no line.",
    "docs/control/local/live-drive-reports/ holds live-drive-attempt-1 alone; a content search for native-full-lifecycle over the DotLn temp root's JSON files finds no file; no dotln-drive-live-* fixture root remains.",
    "The order's Known issues and carry-ins: the live runs cost dollars as WO-192's did; the executor records each attempt's cost and the order's total in the decisions (reopen: the total exceeds WO-192's two final attempts, 38.12 USD, by more than half)."
  ],
  "rejected": [
    {
      "option": "Failing the review on the missing dollar record",
      "reason": "No criterion names the costs; the known issue is a record duty, the attempt the criteria rest on carries its figure, and a finding outside the criteria that breaks no behavior main had is a follow-up by rule."
    },
    {
      "option": "Estimating the superseded runs' dollars from attempt 4",
      "reason": "An invented figure; the record says unknown and where it looked."
    },
    {
      "option": "Treating the reopening condition as not occurred because the recorded total is below it",
      "reason": "The recorded total omits two Claude lifecycles the executor ran; the condition is unjudged, not unmet."
    }
  ],
  "followup": "At handoff, record the dollar cost of every live attempt an order ran, superseded attempts included, and the order's total in its decisions, and keep a superseded receipt's identity and usage rows in the evidence directory or a dated ignored lane until the final review has read them; then judge WO-247's dollar carry-in against the 57.18 USD threshold and decide whether a requalification pair that a later repair supersedes counts against the order's dollar carry-in.",
  "reopenWhen": "The superseded receipts of WO-247 are found, a later order's live runs are superseded again, or an operator asks for the order's dollar total."
}
```
