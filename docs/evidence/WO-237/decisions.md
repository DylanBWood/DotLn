# WO-237 decisions

## WO-237-D001 — A closed order's journals move into its retained lane

```json
{
  "id": "WO-237-D001",
  "date": "2026-11-01",
  "dispatch": "resume: next; steps 2 and 6, the move inside the close",
  "decision": "worktree.mjs finish (the subject) and settle (derived worktrees) move a closing worktree's journals into main's docs/control/local/retained/<WO>/harness/ under the writer lock, after every other removal check (the gate-index merge into main, material preservation and its verification, scratch removal) and immediately before the removal proof and git worktree remove. retainWorktreeJournals in scripts/lib/worktree-removal.mjs moves regular files only: the top-level *.jsonl logs (session journals, writer-events.jsonl, shell-diagnostics.jsonl), session states named <digest>.json with their per-session sidecars <digest>.<name>.json, checks.json, and suite-success/ and deadlines/ file by file. Everything else stays and falls with the worktree or its own class: runner/, check-history/, check-output/, targets/, excludes/, writer/ and writer.json, read-scope.json, gate-outcomes/, active-gates/, the .started and .advisory markers, every link, and any path the repository tracks. The lane is created through ensureTemporaryRoot with class closed-journal, repository main and owner.workOrder, and its sources.jsonl records the worktree each move came from. An existing lane is merged, never replaced: a log appends, checks.json takes the union of its rows, an identical file is dropped, and a differing state keeps its earlier bytes as <name>.prior-<first 16 hex of its sha256> beside the newer one. Each append into a log the lane already holds is recorded in the lane's merges.jsonl before it is published: the worktree, the log, the offset, length and digest of the appended bytes, and how far into the source the merge then reaches, with that prefix's digest. A retry trusts its own row only while the log still holds those bytes there, no other worktree's later recorded append starts inside them, and the source still begins with that prefix; every log goes through that rule, even one whose bytes equal the lane's, and every row of sources.jsonl and merges.jsonl starts on a line of its own after a torn last line. So a log whose rows an earlier attempt appended, before it failed to remove the source, gains only the source's later bytes, even if the source has grown since and whatever other worktrees appended in between, and a first merge from another source appends every row. A cross-volume copy of a log is recorded the same way before it is published. Every destination, its ancestors and the lane's sources.jsonl must be free of links, and an existing destination a regular file, before anything is written, so a link planted in an existing lane refuses the move; a preview runs the same checks. A rename across volumes copies under a temporary name, publishes the copy and removes the source; any other failure stops with the worktree intact and prints a failed Journal retention line, so finish fails and release close records its existing cleanup blocker with the retry command while the published release stands. release.mjs copies each Journal retention line onto the worktree's cleanup row, and for the subject onto cleanup.subject, as journals { lane, files, bytes, outcome }: moved, nothing, would-move in a preview, or failed with error and command. A preview whose retention fails fails as the close would: the subject's finish preview stops, and a derived worktree's preview reads kept.",
  "evidence": [
    "scripts/worktree.mjs finish merges the subject's gate index into main's (recordGateChecks(mainPath, readGateChecks(subject))) inside the writer lock before removal; a move in release.mjs before finish would have emptied that merge and run before the lock's writer and active-gate checks.",
    "scripts/lib/paths.mjs classifies docs/control/local/harness as disposable, so preservation never carried any of it; the WO-233 and WO-247 close records (docs/control/local/retained/<WO>/release-close.json in main, ignored) show cleanup rows with a preservation receipt and no journals.",
    "Main's harness directory on 2026-11-01 holds 253 session journals (65 MB of *.jsonl) and 224 session states with sidecars (20 MB of <digest>*.json) beside runner/, check-history/ and check-output/; suite-success/ is 1.4 MB and deadlines/ 16 KB. gate-outcomes/, active-gates/, *.advisory and *.subagents.started appear in neither of the order's lists and stay.",
    "The first instance-history run failed inside its instance's configuration-root suite: with relocated document roots the fixed harness path docs/control/local/harness is not ignored, its files had been committed, and moving them left the worktree modified, so git worktree remove refused. The mover now leaves every tracked path; scripts/test-configuration-root.mjs (18 of 18) and scripts/test-instance-history.mjs pass.",
    "scripts/test-temporary-roots.mjs covers the moved and the staying entries, each merge rule, a preview, a tracked file, a cross-volume rename and the EACCES and ENOSPC failures; scripts/test-release.sh covers the move and its row in the success case and the failed move with its retry in journal_failure; scripts/test-instance-history.mjs and scripts/test-worktree.sh exercise it in an updated instance and in the worktree suite's finish.",
    "docs/evidence/WO-237/controls.json c01: the success case at the base reads 'journal lane after close: absent' (exit 2); with this order the lane holds the moved journal, state and suite record beside its owner record and sources.jsonl (exit 0).",
    "The three independent reviews (WO-237-D011) found a retried merge appending a log twice after a failed source removal, links in an existing lane redirecting writes, and failed previews reading as removals; scripts/test-temporary-roots.mjs now shows the retried merge counting once and both planted links refused with nothing written outside the lane.",
    "The second recheck found the overlap search taking the shortest run, the first match searching back from the end, and giving up after 64 occurrences, so a source whose leading rows repeat appended a row twice. The search now tries every line start in the log's last incoming-length bytes, earliest first, and compares the lane's last line before the whole run. In scripts/test-temporary-roots.mjs, a lane holding A,B,B whose source grew from B,B to B,B,C merges to A,B,B,C. That case is kept beside the merge records that later replaced the search. Repeated rows do occur: this session's own journal held one row twice among its 7,151.",
    "The third recheck showed that no rule over the bytes alone is exact: a retry after another worktree appended in between repeated the source's rows, and a first merge from another source dropped a leading row that repeated the log's last. Merge records replaced the search. The consistency review's fourth recheck then found an equal-bytes log skipping them, an unpublished row proven by another worktree's later append of the same bytes, and a torn last row swallowing the next. The rule above answers each. scripts/test-temporary-roots.mjs shows every sequence beside the earlier ones, and controls.json c06, restoring a merge that consults no record, fails (exit 1)."
  ],
  "traps": [
    "A move at the start of release close's cleanup would run before finish's writer and gate checks and before its gate-index merge; it runs inside finish instead.",
    "A merge that replaced the lane's earlier state would lose a session's earlier record on a retry; a differing state keeps both."
  ],
  "rejected": [
    {
      "option": "Keeping the worktree for fourteen to thirty days",
      "reason": "A worktree is 1.3 to 2.1 GB of regenerable captures, build output and packages, and WO-233 was filed to stop that residue; the record asked for is kilobytes to megabytes of journal."
    },
    {
      "option": "Committing the journals into docs/evidence/<WO>/",
      "reason": "They hold host paths, session ids and operator-message digests; the lane is ignored local material."
    },
    {
      "option": "Moving in release.mjs before worktree.mjs finish",
      "reason": "It would empty finish's gate-index merge into main and precede the writer and gate checks under the lock."
    },
    {
      "option": "The longest run of the source's leading rows already ending the log",
      "reason": "It cannot tell a row repeated at the junction from one appended before: it repeated a source's rows after another worktree's append and dropped a first merge's leading row."
    },
    {
      "option": "One sub-lane per source worktree",
      "reason": "Every reader would recurse; session files are unique per session and the shared names merge by rule."
    },
    {
      "option": "Moving every file of the harness directory",
      "reason": "The writer, the started markers and the gate captures belong to their own protocols and classes."
    }
  ],
  "reopenWhen": "A close removes a worktree whose listed journal entries are missing from the lane, a failed move blocks publication, a close records journals.outcome failed with a cross-device error, a session's journal is found under a name the mover does not list, or a retried merge is observed to count a row twice or drop one."
}
```

## WO-237-D002 — The closed-journal class, its seed and readers of a newer budgets file

```json
{
  "id": "WO-237-D002",
  "date": "2026-11-01",
  "dispatch": "resume: next; step 1 and receipt 057's first known issue",
  "decision": "DEFAULT_RETENTION gains closed-journal: 720 and the record validator admits the class; docs/control/budgets.json and scripts/kit/budgets.template.json carry the seed, and an instance whose budgets file lacks the key reads 720. readRetention, which only paces cleanup, now ignores a retention key its runtime does not define, so a pinned hook snapshot that meets a newer budgets file after its worktree integrates main keeps creating roots under the windows it knows; validateRetention, which readBudgets applies at every gate, still refuses an unknown key. The legacy-backfill wait, the longest of the disposable classes' windows, leaves out closed-journal as it leaves out coordination: both are always marked, and counting the 720-hour seed would have stretched an unmarked root's wait from 48 hours to thirty days, while a null closed-journal window would have disabled backfill.",
  "evidence": [
    "scripts/lib/temporary-prune.mjs judged a legacy root by Math.max over every retention value except coordination; with the key added that maximum became 720.",
    "This transition cannot be fixed inside an older runtime: a worktree activated before this order holds its own temporary-root-records.mjs in .runtime/harness/<hash>. Its window is short: scripts/lib/worktree-integration.mjs runs scripts/harness.mjs emit as an integration step once no conflict is pending, and the executor runs npm run sync after integrating.",
    "scripts/test-temporary-roots.mjs: the default reads 720, both seed files carry it, a future-class key is ignored by readRetention and refused by validateRetention, and a known key with an invalid value still refuses; scripts/test-launchpad-update.mjs: an instance updated from budgets without a retention block passes scripts/meta.mjs and its updated runtime reads 720."
  ],
  "rejected": [
    {
      "option": "Leaving the key out of docs/control/budgets.json and relying on the default",
      "reason": "Criterion 1 requires the budgets file to carry it, and the operator owns the number there."
    },
    {
      "option": "Relaxing validateRetention for every reader",
      "reason": "The gate's budget validation is where a mistyped key must still refuse."
    }
  ],
  "reopenWhen": "Invalid budget: retention.closed-journal appears in any hook, gate, prune or meter output, or a worktree that integrated main after this order fails to create a temporary root before its harness is re-emitted."
}
```

## WO-237-D003 — The prune judges a journal lane by its class and the order's lane waits for it

```json
{
  "id": "WO-237-D003",
  "date": "2026-11-01",
  "dispatch": "resume: next; step 3",
  "decision": "A journal lane is an owned root registered in main's ledger, so the close-scope and the all-scope prune both find it, and judgeTemporaryRoot judges it as every owned root: its owner is the process that moved the journals, its window counts from its creation, null keeps it and 0 removes it at the next prune, and the report's row carries class closed-journal with the lane's path, as does the census row temporary-root/closed-journal. Two rules are added. judgeLane, which removes an order's whole docs/control/local/retained/<WO>/ directory once its release is published, retains that directory while its inventory holds an owner marker, so the journals keep their own window and the directory follows once they are gone. A closed-journal root holds only the entries a close moves into it (closedJournalEntry in the records module); any other entry, such as a note an operator left there, is named and the root retained, never removed with the lane. A lane created in a session stays that session's root until another session judges it.",
  "evidence": [
    "The WO-247 close's prune retained 91 order lanes, 86 of them for 'usage copy is not in the committed snapshot'; earlier lanes such as WO-043 were removed whole and left WO-043.bytes-<hash>.json proofs, so a lane that otherwise qualified would have taken a younger journal lane with it.",
    "scripts/test-temporary-roots.mjs, with every order published: an expired lane is removed and its order's directory follows at the next prune, a lane within its window and one holding an undeclared note are retained, each order's directory reads 'nested owned root retained: harness', and a null window reads 'class is retained indefinitely'.",
    "docs/evidence/WO-237/controls.json c04: without the rule the prune removed WO-911's order directory with its journal lane inside, then failed on the vanished lane ('Prune subject changed; retained docs/control/local/retained/WO-911/harness').",
    "scripts/test-instance-history.mjs: the updated instance's prune retains the lane, within its window, as the current session's own root, since the fixture's commands share the session environment, or, inside a gate, as part of the gate's live fixture, which the gate's completion removes."
  ],
  "rejected": [
    {
      "option": "A separate schedule or reader for retained journals",
      "reason": "Both are this order's non-goals; the existing prune already judges owned roots by class."
    },
    {
      "option": "Removing an order's directory around its journal lane",
      "reason": "The byte proof covers the whole directory; a partial removal would need a second proof shape."
    }
  ],
  "reopenWhen": "A journal lane is removed before its window, a lane is kept past its window with no retaining reason, or an operator needs material kept inside a lane."
}
```

## WO-237-D004 — A root is its token and its inode

```json
{
  "id": "WO-237-D004",
  "date": "2026-11-01",
  "dispatch": "resume: next; step 7, the operator's item 8 of 2026-10-30",
  "decision": "readTemporaryOwner validates every field as before except the device. A different inode is still 'Temporary owner record is invalid or the directory was replaced'; a differing device with the same inode goes through writeTemporaryOwner, which re-stamps the record with the current device only when the marker inside the directory carries the record's token and the owner repository's ledger segment for that token registers this path without a later removal, and then appends device-renumbered with recordedDevice and observedDevice to that segment. Without that binding it refuses with 'Temporary root device changed and its owner's ledger does not register this token at this path; retained', and nothing is deleted. writeTemporaryOwner compares only the inode and applies the same re-stamp, appending the transition to the ledger before the marker changes and only once, so a failed append leaves the old number to be re-stamped at the next read. The prune's judgment also refuses, whatever the device, a root whose owner repository exists and whose ledger does not register the marker's token at that path; a root whose repository is gone, as after a closed worktree's removal, is judged by its marker as before. A retry after a failed marker write finds its pair as the latest transition and records nothing more, while a later reboot that repeats an earlier pair is recorded again. A removal deletes only the directory it verified (removeVerifiedTemporaryRoot): one rename moves whatever holds the root's path to dotln-removing-<token> beside it, and the moved directory is deleted only when it carries the record's inode and its marker the record's token; otherwise it goes back to its path while that path is free, and nothing is deleted. A parent that refuses the rename refuses before anything inside the root is deleted, and a root already aside must find its parent writable before any of it is deleted. Nothing inside a root is touched before it is verified: owned roots nested in it go with it, and one that a stop leaves inside a parent's aside is bound through the parent's registration, read from the parent's marker and ledger, even when another root now holds its original path; the parent must be at its own removal's aside with the inode its marker records, so a parent moved anywhere else binds none of its nested roots. The place aside is ledgered as moving before the rename, and the segments of roots nested in a parent that is still aside wait for it. Any failure after the rename puts the root back at its path while that path is free, and the owner record is deleted last, so a removal that stops leaves a root its marker still names. A root that the process ending left aside is still found through its ledger: registeredTemporaryRoots lists the aside first, even when the path now holds another root; the binding accepts the aside when the candidate is named for the token; ledger retirement waits for an observed absence of both places; the census walks session directories for such asides; a close's captured roots resolve to their aside; and finishing an aside records the removal under the registered path, which ends that registration even when the path now holds another root. The re-stamp is lazy, at the first read after a reboot, a prune preview included; it writes only that root's own marker and ledger segment and changes no judgment. applyTemporaryCandidate's legacy check compares the inode and keeps the device for diagnosis. The starter-refresh scratch check compares the inode and, for a renumbered device, proves the scratch through its owner record, then re-stamps the cleanup record's device outside a preview. The step 7 negative cases map onto: a different inode, the inode check; a token the ledger does not know and a root outside the registered checkouts, the ledger binding (a record naming a repository that holds no registration of it); a live or unknown owner and an active gate or writer, the existing judgments, which still apply after the re-stamp; a replacement race, apply's re-read of the inode and the removal's check of what its rename moved; a symlinked root, requireTemporaryDirectory; an unexpected file, the closed-journal class's declared entries (WO-237-D003), the one class with a declared shape.",
  "evidence": [
    "docs/control/local/retained/WO-239/stale-build-cleanup.json in main (ignored): six roots under the WO-239 worktree's .runtime/build-* with recordedDevice 16777233 against device 16777234, tokens and inodes matching and owners dead, after the host rebooted on 2026-10-29.",
    "scripts/test-temporary-roots.mjs: a renumbered expired root is a candidate, its marker carries the current device with the same inode, its ledger holds one device-renumbered row with both numbers, a retried judgment writes nothing more, and apply removes it. The negative case refuses a replaced directory, a forged token, a record naming another repository, a live and an unknown owner, a writer reservation, a replacement between judgment and apply, a link to a root and an undeclared entry in a closed-journal root, and deletes none of them.",
    "The re-stamp's cost, measured in that fixture: the judgment with its one record write took 0.5 ms in a focused run and 1.6 ms in controls.json's c02 positive arm.",
    "docs/evidence/WO-237/controls.json c02: with the strict comparison restored the renumbered root is retained with 'Temporary owner record is invalid or the directory was replaced' (exit 1); c03: without the inode rule a replaced directory carrying a copied marker is re-stamped and pruned (exit 1); both pass with this order (exit 0).",
    "scripts/test-launchpad-update.mjs: a starter-refresh preview with a renumbered cleanup record and owner marker is not refused and re-stamps only the marker, the recovery that follows finishes cleanup, and a changed inode is still refused.",
    "After the independent reviews (WO-237-D011): scripts/test-temporary-roots.mjs shows an unchanged-device marker with a token its ledger does not register refused, and a transition whose ledger append failed left the old number in place and was recorded once at the next read.",
    "This record first rejected moving a root aside, because a stopped removal would leave the root under a name no ledger registers, and compared the inode once more before a path-based removal; the criteria review held the remaining window open as blocking for criterion 8. Two findings reversed that choice. The name the token derives answers the earlier objection. A probe on 2026-11-01 in the session scratch also showed that fs.rmSync of a root whose parent refuses writes (mode 0500) deleted every entry, the owner record included, and then failed with EACCES on the root itself; renameSync in the same state failed with EACCES and changed nothing. At the base, a stopped apply therefore emptied the very root it reported as retained.",
    "scripts/test-temporary-roots.mjs: a replaced directory and a link substituted after the identity was read are moved back, with nothing deleted; the root under a refusing parent keeps its owner record; a root moved aside by a stopped removal is listed there and finished; a directory held aside that is not the root is retained. docs/evidence/WO-237/controls.json c05: with the path-based removal restored, the refused root's owner record is gone (exit 1); with this order it stays (exit 0).",
    "The criteria adversary's third recheck found that the batch's nested-first removal deleted a registered child reached through a link that had replaced its parent, before the parent was verified; that a finished aside left its registration on a reused path; and that a close dropped captured roots left aside. In scripts/test-temporary-roots.mjs the late-link arm keeps the child's sentinel. The stopped-removal case retires the reused registration and finds the captured aside. It also finishes a parent left aside together with its nested root, whose segment retirement held."
  ],
  "traps": [
    "Dropping the device comparison without a second proof would admit a directory on another volume whose inode number happens to match a copied marker; the ledger binding is that proof.",
    "A re-stamp writing outside the root's own marker and ledger would turn a read into a mutation of unrelated state."
  ],
  "rejected": [
    {
      "option": "Comparing the device number strictly",
      "reason": "A reboot renumbers volumes while the inode and the token prove identity; the strict rule turned regenerable build output into an operator question at WO-239's close."
    },
    {
      "option": "Re-stamping every record at the first command after a boot",
      "reason": "A walk over every owned root against one lazy re-stamp when a record is read."
    },
    {
      "option": "Dropping the device number from the record",
      "reason": "Diagnosing a directory replaced from another volume still needs both numbers in the ledger."
    },
    {
      "option": "A recovery for build staging alone",
      "reason": "It leaves gate fixtures, session scratch and warm caches created before a reboot to refuse at the next close."
    },
    {
      "option": "Comparing the inode once more immediately before a path-based removal",
      "reason": "It narrows the window to the removal call itself and cannot close it, and a path-based removal under a parent that refuses it deletes the root's contents before it fails."
    },
    {
      "option": "Removing the roots nested in a root first, each through its own removal",
      "reason": "It acts inside the root before the root is verified. The criteria adversary's third recheck showed a link that replaced the root leading it to a registered child, which it deleted."
    },
    {
      "option": "Recognizing the aside name in legacy backfill, so a stop that also took the owner record is finished",
      "reason": "The third recheck showed it would admit a replacement that a failed restore stranded under that name, which the removal had refused. The owner record now goes last, so a stopped removal keeps the marker that proves it."
    },
    {
      "option": "An aside name not derived from the token",
      "reason": "A removal stopped after the rename would leave the root where neither its ledger nor its binding finds it."
    },
    {
      "option": "Keeping a prune preview free of the re-stamp",
      "reason": "It would thread a read-only mode through every judgment for a write that changes no judgment; the order chose one lazy re-stamp when a record is read."
    }
  ],
  "reopenWhen": "A re-stamp is observed on a directory whose inode changed, a renumbered root with a valid ledger registration is still refused, a root outside its owner's ledger is re-stamped, a root a removal moved aside is found that no prune lists, or a removal ends with a root's contents deleted and its directory kept."
}
```

## WO-237-D005 — plan start is where expired roots outside every close leave

```json
{
  "id": "WO-237-D005",
  "date": "2026-11-01",
  "dispatch": "resume: next; the carry-in FUP-69af2e1da022aa7a from WO-239-D020",
  "decision": "plan start applies the owned-resource prune it already runs as a census: temporaryPruneSummary(root, { apply: true }) under the host lane lock prints the apply's report, and when the apply is refused before it changes anything, as while any gate holds host lanes, it prints 'Prune: apply deferred (<reason>)' with the read-only census; an apply that stops partway prints 'Prune: apply stopped after N removed, B bytes (<reason>)' before the census of what remains. It counts a root whose directory is gone although its bookkeeping then failed, and only on an observed absence of the root and of the place its removal moves it: a path this process cannot inspect proves nothing. That line survives a census that then fails too, followed by 'Prune: census unavailable; material retained (<reason>)'. The stale Codex home listing that ends the report is best-effort: a listing that cannot inspect an entry is reported as staleCodexEpisodeHomesUnavailable and never replaces the result of a prune that ran. The close stays scoped to its own roots, session end keeps removing only its own scratch, and kit update preview keeps its read-only census. The three suites that run plan start in fixtures, scripts/test-plan-refutation.mjs, scripts/test-process-debt.mjs and scripts/test-launchpad-planning.mjs, set DOTLN_PRUNE_SCOPE to repository whatever scope they inherit, as the gate does for its product children, so no run of theirs removes the host's roots. A shell fixture that creates a journal lane removes it itself with scripts/temporary-root.mjs remove, as a gate's completion would, because outside a gate the fixture root's own teardown retains a parent holding an owned root.",
  "evidence": [
    "Census cost at the base, read-only through planHarnessPrune under the bounded wrapper on 2026-11-01: main, all scope, 142,967 ms with 1,036 candidates of 12,397,713,047 bytes; main, close scope, 3,375 ms; this worktree, all scope, 124,835 ms; this worktree, repository scope, 131 ms.",
    "The all-scope census is plan start's existing summary (scripts/refute-plan.mjs), so applying there adds the removals and each candidate's fresh re-check, not a second census. That added cost is unmeasured: measuring it would delete the 12.4 GB the census counted.",
    "Session end runs inside hooks that .claude/settings.json bounds at 15 seconds, Stop included, against a census of about two minutes; WO-239-D020 measured 186.9 s for the same walk.",
    "A scheduled run needs a scheduler the kit does not install (kit README: no daemon is installed) and changes the prune's schedule, a non-goal of this order.",
    "The system temporary directory on 2026-11-01 held 1,312 dotln-* roots, nearly all gate fixtures of failed or abandoned suites of closed orders (WO-240 597, WO-247 320, WO-192 253, WO-235 47), the oldest from 2026-10-29: the follow-up's reopening condition, roots accumulating with no run that removes them, already held.",
    "The second recheck (WO-237-D011) found three ways a stopped or finished apply lost or overstated what it removed. existsSync read an inaccessible candidate as deleted. The fallback census replaced the progress line when it failed too. An unreadable Codex home entry, listed after the removals, threw away a completed apply. scripts/test-temporary-roots.mjs covers each: a root removed before its bookkeeping failed, a stopped apply whose census then fails (an injected prune), and an unreadable Codex home directory beside a completed removal."
  ],
  "traps": [
    "Recording a home without wiring it would leave the follow-up's reopening condition true the day this order closes.",
    "A host-wide apply started from a test would make the test depend on, and delete, the machine's state."
  ],
  "rejected": [
    {
      "option": "Session end",
      "reason": "A hook bounded at 15 seconds cannot carry a census of about two minutes."
    },
    {
      "option": "A scheduled run",
      "reason": "It installs a scheduler the kit excludes and changes the prune's schedule, a non-goal here."
    },
    {
      "option": "Release close",
      "reason": "WO-239 bounded the close to its own scope; its census measures 3.4 s there against about two minutes for the global walk."
    },
    {
      "option": "Recording the choice without wiring it",
      "reason": "The accumulation the follow-up names continues until an operator runs harness prune --apply."
    }
  ],
  "reopenWhen": "Expired roots accumulate past a retention window with no run that removes them, plan start's apply adds more than its census's measured 2 min 23 s to the step, or a planning pass needs plan start to remove nothing."
}
```

## WO-237-D006 — plan failures reads the lanes, the start block's bound is compact and unlimited reads as unlimited

```json
{
  "id": "WO-237-D006",
  "date": "2026-11-01",
  "dispatch": "resume: next; step 4, receipt 060's second known issue and the 2026-10-31 pass's two carry-ins",
  "decision": "operationalFailures reads every docs/control/local/retained/WO-NNN/harness/ lane's <digest>.jsonl journals beside the checkout's own, and counts each lane row's host denials, interventions and bound stops for the lane's order whatever order the row names. Its output carries retainedJournals { lanes, files, unreadable, orders, windowHours, oldestCreatedAt }: the lanes read, the current closed-journal window and the oldest lane's start, read from each lane's marker as plain data so the command writes nothing; plan start's block carries { lanes, files, windowHours }. A lane that cannot be listed counts as unreadable and the rest still count; a feed page names the sixteen most recently created lanes, by their markers' creation times with unreadable times ordered oldest, with ordersOmitted for the rest, so no retention window can push its metadata past the 8 KB page, while the counts and the export keep every lane. The next planning pass's first cost table should mark that coverage change, which these fields name. The start block's 1 KB bound is measured on compact JSON: fitStartBlock clips only the two reason strings and, if the block still overruns, keeps command, since and items and adds one overrun line naming the measured size and the command, so a count never keeps the branch shut. An acceptance recorded with --ceiling unlimited, stored as ceiling null, reads 'unlimited' in the feed's boundAcceptances; the start block names no ceiling, and the meter snapshot and its writer are unchanged.",
  "evidence": [
    "The 2026-10-31 pass's refused entry: three off-ramp kinds took the pretty-printed block past 1,024 bytes while its compact form measured 817. The regression block in scripts/test-plan-refutation.mjs measures 1,149 bytes pretty and 903 compact; it now passes whole, and a block that overruns compact gets the overrun line.",
    "Two arms admit that window: measured compact the bound stays 1,024 bytes; raised to the measured pretty shape plus one half it would be about 1,724 bytes. The compact arm keeps the bound's meaning with 121 bytes of room for that window.",
    "scripts/lib/dispatch-bound.mjs passes ceiling through for the meter snapshots in docs/evidence/<WO>/meta.json, which this order leaves unchanged; the rendering is applied where plan failures emits the acceptances.",
    "scripts/test-plan-refutation.mjs: a closed order's lane with two denials and one unreadable row counts 2 for that order beside the checkout's 1, the page, the export and the start block carry retainedJournals, and a null budgets key reads windowHours null.",
    "Expected-data update: the WO-172 case in scripts/test-plan-refutation.mjs pins the export's field order, and this order adds retainedJournals after localHostDenials. The first complete run of 2026-11-01 failed on that pin, which was then updated; the cause is this order's new field.",
    "The third complete run of 2026-11-01 passed all 45 suites but exited 1 on one gate-cleanup blocker. The WO-237 retained-journals case had left a synthetic owner record, holding only a creation time, in its fixture lane WO-803, and the gate's cleanup refused it as invalid. The case now removes that record when it ends."
  ],
  "rejected": [
    {
      "option": "Raising the pretty-printed bound to the measured shape plus one half",
      "reason": "The compact measure admits the same window and keeps the 1 KB the block is described by."
    },
    {
      "option": "Attributing a lane's rows by the order each row names",
      "reason": "The order asks that a lane's rows count for its order; rows naming none would read unassigned."
    },
    {
      "option": "Rendering unlimited in dispatchBoundActivity",
      "reason": "That function also feeds the committed meter snapshots, which this order changes neither."
    }
  ],
  "reopenWhen": "Two readings of plan failures at one subject revision differ, a worsening flag's delta comes from newly read lanes, plan start refuses on the block again, or a reader of the feed still meets a null ceiling."
}
```

## WO-237-D007 — harness usage reads a closed session from its lane

```json
{
  "id": "WO-237-D007",
  "date": "2026-11-01",
  "dispatch": "resume: next; step 5",
  "decision": "When the checkout holds no state for a session, harness usage looks in its retained lanes: readRetainedSession in scripts/lib/retained-session.mjs, consulted first whenever the checkout holds no state for the session (so a Copilot environment, whose live readback answers without one, still reaches the lane), finds the session's <digest>.json in exactly one lane, refusing a session found in two as ambiguous, and measures its counters from the host transcript, found through the worktree paths the lane's sources.jsonl recorded and matched by the usage key the state recorded (the thread's, for a named session that ran inside a Codex thread) and the recorded path, because those worktrees no longer exist; a host directory it cannot list or another order's lane it cannot enter adds nothing, and credits measured apart from incomplete token counters are kept as the live readback keeps them; the counters come from usage-observation.mjs's exported transcriptUsage and requireMeasuredUsage, and that module is unchanged. The output names the lane as source, 'retained-lane:docs/control/local/retained/<WO>/harness', keeps the counters' own provenance as counterSource, adds retained { workOrder, lane, role, startedAt }, reads subagents from the lane and reports dispatch standing closed. It records no usage row: a closed dispatch's usage was recorded while it ran, and a row now would carry a duration measured from its start to today. Lanes are read from the checkout the command runs in, main for a closed order. The order's re-mint note that none of its runtime sources is a file the feedback verifier judges holds for temporary-root-records.mjs, whose editions npm run sync re-minted, and not for usage-observation.mjs.",
  "evidence": [
    "npm run sync with the reader first written into packages/skeleton/src/usage-observation.mjs refused the feedback edition: 'judged behavior changed since docs/evidence/WO-247/feedback-001 (packages/skeleton/src/usage-observation.mjs); a behavioral change needs a fresh live self-host episode'. Moving the reader into scripts/lib/retained-session.mjs and returning the module to its base bytes keeps that edition current without the live episode this order rules out.",
    "sessionTranscript requires the transcript's working directory to exist and equal the root, so every removed worktree's session reads session-counters-unavailable through collectSessionUsage; measureHarnessSessionUsage appends a usage row with durationMs from the session's start on every readback.",
    "scripts/test-harness.mjs: a session whose state is only in WO-951's lane reads source retained-lane:<lane>, counterSource codex-transcript-counter and 420 tokens from a transcript whose working directory is the removed path, standing closed, and no usage row; without sources.jsonl it still answers with cause retained-session-source-unrecorded; a session held in two lanes is refused."
  ],
  "rejected": [
    {
      "option": "Replacing source with the lane and dropping the counters' provenance",
      "reason": "A reader needs to know whether the numbers came from a transcript; counterSource keeps that."
    },
    {
      "option": "Recording a usage row for a retained readback",
      "reason": "It would add a row to a closed order's process record with an invented duration."
    },
    {
      "option": "Searching every host project directory for the transcript",
      "reason": "The lane records where its sessions ran; a host-wide search is a new reader the order excludes."
    },
    {
      "option": "Extending sessionTranscript in usage-observation.mjs with a recorded-root match",
      "reason": "The feedback edition judges that module, so the change needs a live self-host episode, which this order rules out; the retained reader's matching is its own."
    }
  ],
  "reopenWhen": "A retained session's transcript is kept by the host under a path the lane did not record, a reader needs a retained session from inside another worktree, or usage-observation.mjs changes for another reason and its transcript matching can absorb the recorded path."
}
```

## WO-237-D008 — What a close removed before this order

```json
{
  "id": "WO-237-D008",
  "date": "2026-11-01",
  "dispatch": "resume: next; receipt 060's first known issue",
  "decision": "Restated with the measurement: before this order a release close removed nearly all of a closed order's journal rows. For WO-233, WO-235, WO-239, WO-240 and WO-247, main's 253 journals hold two rows that name each order, one of them an operator message, while each order's committed meter snapshot, measured from its worktree's journals at release preparation, counted 3,721 to 12,508 hook runs, 2 to 16 guard refusals and 2 to 4 operator corrections. The worktree's share is effectively the whole record, and the corrections the trap meter attributes to those orders come from their snapshots, not from rows main kept.",
  "evidence": [
    "A read-only count over main's docs/control/local/harness/*.jsonl on 2026-11-01 (a session scratch script under the bounded wrapper): rows naming WO-233, WO-235, WO-239, WO-240 and WO-247, 2 each; tool-call judgments 0, refusals 0, host denials 0 and operator messages 1 each.",
    "docs/evidence/<WO>/meta.json: hookRuns 5,241 (WO-233), 12,508 (WO-235), 5,830 (WO-239), 3,721 (WO-240) and 10,822 (WO-247); guardRefusals 6, 2, 3, 2 and 16; operatorCorrections 4, 3, 3, 2 and 3, each with corrections.source session-journal."
  ],
  "rejected": [
    {
      "option": "Counting rows without an order field in main's journals",
      "reason": "Their order cannot be told from the row; counting them would invent attribution."
    }
  ],
  "reopenWhen": "The worktree's share is small for a later closed order, which would make the lane's cost worth judging again."
}
```

## WO-237-D009 — The fork's messages of 2026-11-01 and core's last close message

```json
{
  "id": "WO-237-D009",
  "date": "2026-11-01",
  "dispatch": "resume: next; the operator forwarded the fork's release-close items 3, 4, 7 and 8 and core's last close message for coverage, with planning to follow",
  "decision": "Read as: cover what falls inside this order's close and journal surfaces and send the rest to planning; nothing in the messages changes this order's scope. The fork's item 3(b) is evidence that this order's known issue's reopening condition, a target bundle journaling into the target, has occurred: Codex release-close sessions took a temporary writer in the target worktree and left docs/control/local/ journals and .runtime/.metadata_never_index there, which the target close then refused. Items 3(a), (c), (d) and (e), item 4 (evidence only), item 7 and item 8 are target-close, role-text, plan-failures, close-record, outward-step and profile matters outside this order. Core's message at WO-247's close, 'Worktree preservation refuses a symlink escape', was by the operator's word not a blocker: the close's own recovery unlinked two Codex launcher links under a retained live-drive Codex home and retried, and the attempt that left them was captured before WO-247 restricted retained homes to sessions/ and session_index.jsonl.",
  "evidence": [
    "The operator's words, during resume: next on 2026-11-01: the fork's items 3, 4, 7 and 8 and core's last release close message, which this order 'might need to cover', with a planning pass likely to follow.",
    "The operator's messages of 2026-11-01 during this dispatch, relaying the fork's items 3, 4, 7 and 8 and the core close message.",
    "docs/control/local/retained/WO-247/cleanup-symlink-recovery.json in main (ignored): two links, applypatch and apply_patch, under live-drive-reports/live-drive-attempt-1/drives/release-close-1.codex-home/tmp/arg0-macos/, unlinked without dereferencing, the session evidence's digest unchanged; docs/evidence/WO-247/live-drive-attempt-1.json observed at 2026-10-31T23:58:41Z; scripts/lib/drive-worker.mjs retains only sessions and session_index.jsonl (WO-247-D003).",
    "This order's known issue: the target worktree keeps no journals of its own and a target close moves nothing (reopen: a target bundle starts journaling into the target)."
  ],
  "rejected": [
    {
      "option": "Taking the fork's asks into this order",
      "reason": "No scope expansion was given, the operator expects a planning pass to take them, and each touches the target close, role text or outward steps."
    },
    {
      "option": "Leaving the asks only in the conversation",
      "reason": "A follow-up row keeps them visible to the next pass."
    }
  ],
  "followup": "Plan the fork's release-close asks of 2026-11-01: a disposable declaration that matches nested package-manager caches at any depth in a target; a target close that owns or excludes the kit's own residue in a target (docs/control/local/ journals from a temporary writer, .runtime/.metadata_never_index from markUnindexed, the temporary-root ledger), which also reopens WO-237's known issue that a target keeps no journals; role text saying that removing undeclared regenerable output at a close takes no writer in the target; plan failures projecting close blocker classes per order; the close record naming what the worktree-removal step spends its time on; a kit helper for pushing the launchpad's own branches, and an update --finish that fetches into the checkout's object store or bounds and reports a stalled scratch fetch; and whether a target close writes the instance profile's reviewed source and latest release. Paths: scripts/lib/target-worktree-close.mjs, scripts/lib/plan-failures.mjs, scripts/release.mjs, scripts/launchpad.mjs, packages/skeleton/src/temporary-root-records.mjs.",
  "reopenWhen": "A planning pass disposes the follow-up, or the operator expands this order's scope."
}
```

## WO-237-D010

```json
{
  "id": "WO-237-D010",
  "date": "2026-11-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.107.0, the next minor above the observed release baseline v0.106.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.106.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-237-a-closed-order-keeps-its-journals.md"
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

## WO-237-D011 — The independent reviews ran on Codex, and what they changed

```json
{
  "id": "WO-237-D011",
  "date": "2026-11-01",
  "dispatch": "resume: next; the operator directed Codex reviewers and, offered the routes, chose the ad hoc launcher",
  "decision": "The three independent reviews (criteria adversary, design improver, consistency reviewer) ran on Codex, model gpt-6.1-sol at reasoning effort max, the role text's Codex pin, as read-only codex exec sessions launched from this Claude Code session by a launcher in the session's DotLn scratch. Like the kit's worker transport, it gave the sessions one isolated CODEX_HOME holding only a link to the operator's auth.json, a read-only sandbox, project docs, web search, MCP servers and memories off, and kept each session so the same reviewer rechecked every repair; the operator's config.toml and trust table were digested before and compared after. Round one found 10 (5 blocking), 9 and 6, 19 distinct after duplicates: all were fixed except the window between removeTemporaryRoot's identity read and its removal, which was narrowed. The first recheck found 9 (3 blocking), 6 and 6, 13 distinct: 12 fixed, and the window between the final inode check and the removal call itself was recorded without change. The second recheck found 4 (2 blocking), 3 and 2, 4 distinct after duplicates, all fixed: the overlap search taking the shortest run, an inaccessible candidate counted as removed, removal progress lost to a failing census or Codex home listing, and that window, which the criteria adversary still held blocking for criterion 8. A removal now moves the root aside and deletes only the directory it verified, reversing the earlier record (WO-237-D004). While weighing it, the executor found by probe that a path-based removal under a parent that refuses it empties the root before failing; the same change fixes that. The third recheck found 6 (1 blocking) and 5 (1 note) from the design improver and the consistency reviewer, 7 distinct, and 5 (2 blocking) from the criteria adversary, 5 distinct. All were fixed in two batches; the first went to a complete run on the operator's direction without a fourth recheck, as the evidence records.",
  "evidence": [
    "The operator's words, during resume: next on 2026-11-01: 'use codex for the reviewers'; asked which route, since the kit offers none from a Claude session: 'fine do the ad hoc codex stuff'.",
    "packages/skeleton/src/loadouts/contributor.ts: the role text names Claude dotln-worker or, on Codex, spawn_agent inside a Codex session; scripts/lib/drive-worker.mjs launchRole runs whole lifecycle phases on a host, not review helpers. No kit command launches a Codex dotln-worker from a Claude session.",
    "Round one's fixes: a retried merge appending a log twice, a device transition lost when its ledger append failed, a marker the ledger does not register admitted with an unchanged device, links planted in a lane redirecting writes, the retained readback bypassed under a Copilot environment and blind to the state's usage key and to credit-only counts, unreadable directories aborting the readback and the feed, a partial apply reported as deferred, an inherited prune scope in three suites, failed previews read as removals, the release case inventory, the in-gate retention reason, consumer declarations, the preview texts and the page bound.",
    "The first recheck's fixes: a source log grown since a failed attempt, candidate metadata errors, an inaccessible order directory, a deletion followed by failed bookkeeping, an owner repository without a ledger, previews skipping the destination checks, repeated device pairs, the page's selection by creation time, the stopped-apply helper's declaration, the starter-refresh message, a comment overstating the final check, and this record's absence.",
    "The second recheck's fixes: the longest-run overlap (WO-237-D001), later replaced by merge records (controls.json c06), the observed-absence count, the progress line kept past a failing census, the best-effort Codex home listing (WO-237-D005), and the removal that moves the root aside (WO-237-D004, controls.json c05).",
    "The third recheck, design and consistency, found 6 (1 blocking) and 5 (1 note) in that new removal's recovery, 7 distinct, all fixed in one batch (WO-237-D004): legacy backfill admitting a stranded replacement, a root already aside skipping the parent check, nested roots moved with their parent, a reused path hiding an earlier aside, retirement reading an inaccessible aside as absent, session-scratch asides missing from the census walk, and an adopted legacy root's token missing from its stopped-apply report. The note, that controls.json lacked c05 and c06, was resolved by running them before the complete run. The criteria adversary's third recheck had not finished when the operator wrote, at 2026-11-01T17:04Z, 'ok make the changes then run the fucking gates stop fucking procrastinating'. On that direction the batch went to the complete run without a fourth recheck by the three reviewers, and the criteria report arrived while that run was live. It found 5 (2 blocking) in the batch's code: the nested-first removal touching a child before its parent was verified, a byte rule that cannot establish merge progress, a finished aside leaving its registration on a reused path, a close dropping captured roots left aside, and an unrelated order's lane stopping the usage readback. All five were repaired after that run (WO-237-D001, D004, D007), and the repair had its own complete run.",
    "At 2026-11-01T17:53Z the operator wrote: 'FIXES SHOULD ONLY BE RELATED TO THE FUCKING CRITERIA. WHAT IS ALL THIS OTHER BULLSHIT YOURE DOING'. From then on, only a finding that bears on an acceptance criterion is fixed; findings outside the criteria are recorded in the handoff. The consistency reviewer's fourth recheck (4 should-fix, 1 note) had already been fixed and tested when the message arrived, and those fixes were kept rather than reverted."
  ],
  "rejected": [
    {
      "option": "Claude dotln-worker reviewers, the kit's route from a Claude session",
      "reason": "The operator directed Codex reviewers and chose the launcher when asked."
    },
    {
      "option": "The operator running the reviews from a Codex session with spawn_agent",
      "reason": "Offered; the operator chose the launcher instead."
    }
  ],
  "followup": "A kit route that launches a read-only Codex dotln-worker review from a Claude Code session, with the worker transport's isolated home and the generated worker definition, so an executor asked for Codex reviewers need not build its own launcher; today the Codex worker exists only as spawn_agent inside a Codex session, and scripts/lib/drive-worker.mjs launchRole runs whole phases. Paths: packages/skeleton/src/worker-transport.ts, scripts/lib/drive-worker.mjs, packages/skeleton/src/loadouts/contributor.ts.",
  "reopenWhen": "A reviewer's open finding is reproduced by a probe or a verification, or the kit gains the Codex review route."
}
```

## WO-237-D012 — The operator's override stopped the fourth complete run

```json
{
  "id": "WO-237-D012",
  "date": "2026-11-01",
  "dispatch": "resume: next; the operator's override stopped the fourth complete run, then the operator allowed one full run",
  "decision": "Under the override the executor stopped the fourth complete run with node scripts/harness.mjs evidence --stop at 2026-11-01T18:51Z. It made no other change: no record, gate row, handoff or transition was written, and no requirement was bypassed beyond stopping that run. The hook recorded OperatorOverrideRecorded at override off. The operator then allowed one full run. Before it, a focused npm test -- --only plan-refutation reproduced the third run's only failure, the gate-cleanup blocker, and showed it gone (0 blockers), with no other change since the third run's 45 passing suites. The single full run that followed is the one the handoff cites.",
  "evidence": [
    "The operator's words, during resume: next on 2026-11-01: 'operator override: STOP THE FUCKING RUN AND PASS THIS FUCKING WORK ORDER', then 'operator override: off', 'never mind just stop fucking doing anything', and 'FUCKING FINISH THIS WORK ORDER AND UNDER NO CIRCUMSTANCE AM I ALLOWING MORE THAN 1 FULL RUN SO YOU BETTER FUCKING MAKE SURE IT WILL GOD DAMN PASS FIRST TRY'.",
    "The stop's own report: gate-stop-v1, run 786374da-c954-4afc-8ae3-da19f11861f4 stopped, no pass supplied.",
    "The focused run: format, configuration-root, registrations, declarations, generated, host, build and plan-refutation passed; 'Gate cleanup: 84 roots removed; 0 retained; 0 blockers.'"
  ],
  "rejected": [
    {
      "option": "Recording implementation-ready with criterion 9 unmet under the override",
      "reason": "The operator then ended the override and asked for one full run that passes."
    }
  ],
  "reopenWhen": "The cited complete run is found not to be at the handoff identity, or a later change to the tree alters its code identity before final review."
}
```

## WO-237-D013 — Verification keeps the four recovery findings as follow-ups

```json
{
  "id": "WO-237-D013",
  "date": "2026-11-01",
  "dispatch": "resume: verify; independent criterion attacks and implementation review",
  "decision": "Judge the original nine criteria and consume the executor's passing complete review row at code identity 5a4b834539e42d6dbda4db3b86bfb352270b62ce5d3cc902bfec55e912bcf0c8. The independent matrix passes its nine variations, the seven journal/root cases and the usage, feed, fixture-close and updated-instance reproductions pass, and an exact archive of the baseline reproduces the absent journal lane and the strict device refusal. The four outstanding claims in reviews.md also reproduce: two stopped removals leave a nested child unbound and retire its segment; finishing a child inside its parent's aside records the relocated path; a stop after the final marker deletion leaves an empty unmarked aside retained; and a parent registered in another repository does not hold a nested child's segment. Route these R1 to R4 as follow-ups. They concern recovery after interrupted removals, preserve the interrupted payloads or affect the bookkeeping of a requested removal, and break neither an original criterion nor behavior the baseline supplied. This verifier changes no implementation. The final pass is filed only after the document gate for the completed report is green.",
  "evidence": [
    "docs/evidence/WO-237/verification-evidence.json records the current subject, consumed product row, independent matrix, exact-baseline controls, focused executions and all four recovery reproductions.",
    "docs/evidence/WO-237/verification-probes.mjs varies partial moves, an ENOSPC after an earlier cross-volume copy, Unicode and repeated log rows with an interleaved source, retention windows, the feed's time filter, transcript attribution, a repeated device read and an oversized start block.",
    "docs/evidence/WO-237/verification-baseline.mjs builds the exact baseline archive, using only the current assertion-bearing release test; its negative release arm exits 2 with journal lane after close: absent, and the unchanged baseline owner reader refuses the changed device.",
    "docs/evidence/WO-237/verification-recovery-probes.mjs reproduces the four already recorded carry-outs in isolated synthetic repositories; reviews.md supplies the executor's dispositions and product 07 Verification review and attack supplies the route rule."
  ],
  "traps": [
    "A pass based only on the executor's gate would miss independent evidence; attack the consequential claims and reproduce the claims used for the verdict.",
    "Treating every interrupted-cleanup improvement as a new acceptance criterion would widen the order; bind blocking findings to an original unmet criterion or a reproduced baseline regression.",
    "A verifier repair would change its own subject; preserve the implementation and board the four findings."
  ],
  "rejected": [
    {
      "option": "NoOp: repeat the handoff verdict without independent probes",
      "reason": "The verification role owes an independent attack and implementation review."
    },
    {
      "option": "Repair the four interrupted-cleanup findings during verification",
      "reason": "This role is read-only for implementation, and the operator's recorded scope limits fixes to the criteria."
    }
  ],
  "followup": "Repair the four retained-root recovery bookkeeping cases R1 to R4 reproduced by verification-recovery-probes.mjs: bind and hold a child whose own removal stopped inside a parent's aside; record a relocated child's completed removal under its original registration; account for the empty unmarked aside left between final marker deletion and rmdir; and hold nested registrations when their parent's move is recorded in another repository. Preserve the token/inode refusal and every payload-retention boundary. Paths: packages/skeleton/src/temporary-root-records.mjs and scripts/lib/temporary-prune.mjs.",
  "reopenWhen": "A reproduced recovery case deletes a payload that should be retained, breaks an original criterion, regresses baseline behavior, or a later order takes on interrupted-removal recovery."
}
```

## WO-237-D014 — Verification capture limits and missing original review files

```json
{
  "id": "WO-237-D014",
  "date": "2026-11-01",
  "dispatch": "resume: verify; evidence capture and readback",
  "decision": "Keep the verification's evidence limits explicit. Several initial status/diff reads exceeded their output budgets; subsequent status reads select the current order's fields, source reads are bounded by section, and generated hooks are checked by normalizing only the snapshot path. All sixteen changed hooks differ only by that snapshot path; the manifest's other metadata agrees after excluding its changed hashes and snapshot. The first exact-baseline setup exceeded the child-process archive capture buffer before extraction; stream the archive to scratch instead and rerun successfully. These are verifier capture failures, not subject failures. The executor's state identifies its session, but its expected scratch directory is absent, and a one-file-level inventory under DotLn session scratch found no reports for this order. Read the consolidated reviews.md and independently reproduce every claim used for the verdict; do not claim the original three reports were read or infer why they became unavailable.",
  "evidence": [
    "The initial tool results explicitly reported truncation. The complete tracked diff is retained in this verifier's granted scratch as subject.diff, with the temporary-root, feed and usage test diffs split for reading.",
    "The normalized generated-hook comparison returned onlySnapshotChanged true for sixteen hooks and manifestOnlyHashesAndSnapshotChanged true. The complete review gate and the final document gate judge the generated surfaces as well.",
    "The failed baseline setup's probe-baseline.log records the capture-buffer failure. probe-baseline-retry.log records build exit 0, the expected baseline release negative exit 2 and the baseline device refusal; verification-evidence.json retains the successful result and log digest.",
    "The required inputs tried were the executor criteria-adversary, design-improver and consistency reports described by docs/evidence/WO-237/reviews.md. Its executor state was found, its corresponding scratch path was absent, and the bounded scratch filename inventory found no matching originals. The consolidated report and all independently reproduced verdict evidence remain readable."
  ],
  "rejected": [
    {
      "option": "Treat a truncated read or a missing original review as complete evidence",
      "reason": "That would overstate what this verifier observed."
    },
    {
      "option": "Search unrelated home directories or infer deletion by session cleanup",
      "reason": "Neither is needed to judge the criteria, and the missing path does not establish its cause."
    }
  ],
  "followup": "Keep the full criteria-adversary, design-improver and consistency reports readable across implementation-ready and into verification, alongside their consolidated dispositions. Determine why this order's originals were unavailable before choosing a storage or retention repair; no cause is established here. Paths: docs/evidence/WO-237/reviews.md and the executor review handoff procedure.",
  "reopenWhen": "A later verification cannot read its execution's original review reports, or the missing WO-237 reports are recovered and change a verdict-relevant claim."
}
```

## WO-237-D015 — Final review passes at the handoff identity, integration takes in nothing, and a renumbered root whose checkout is gone stays refused

```json
{
  "id": "WO-237-D015",
  "date": "2026-11-01",
  "dispatch": "resume: final review",
  "decision": "Pass WO-237 on all nine criteria at code identity 5a4b834539e42d6dbda4db3b86bfb352270b62ce5d3cc902bfec55e912bcf0c8, the identity the executor handed off and VER-001 judged, which the gate index reports unchanged at this review's entry; the passing complete review row recorded at 2026-11-01T19:33:17.213Z (45 suites, 115 fresh tasks, exit 0) is consumed, and no source byte is written here, so no fresh complete run is owed. Integration ran and took in nothing: HEAD, main and origin/main are one commit, 9139d91e, after a fetch, and no integration receipt, stash or draft decision was left. This review reproduced the verifier's probe matrix and recovery probes, the temporary-root, retained-usage and feed cases, both release close cases, the publication check, the lineage index and the generated-artifact check, each under the bounded wrapper with exit 0, and read the whole authored diff. One finding of this review, F1, route follow-up, class escape: readTemporaryOwner re-stamps a differing device only under ledgerBinding, and that binding is null when the owner repository no longer exists, so a temporary root whose checkout a release close has removed and whose record predates a reboot is refused at every read with 'Temporary root device changed and its owner's ledger does not register this token at this path; retained', is never re-stamped, and no kit route removes it, because harness prune --apply and scripts/temporary-root.mjs remove both read the record first. D004's sentence that a root whose repository is gone is judged by its marker as before holds only while the device number matches. It breaks no criterion, since criterion 8's fixture roots have a present repository and its negative list refuses a root outside the registered checkouts, and no behavior main had, since main refused the same root under the strict comparison. It is not repaired here: the repair is a design choice about the second proof for a root that has no ledger, and a source edit at final review would move the code identity, owe a fresh complete run and judge this reviewer's own fix. Register rows: FUP-dfde4050da06d43b is re-disposed deferred because its condition recurred on this order (the third complete run started before the criteria adversary's third recheck had finished, on the operator's direction of 17:04Z, and that recheck's five findings were repaired after the run with another complete run); FUP-3fc196bee33d6d9e is left as it is, because its named home, the next order touching the prune, is this order, yet this diff touches no line of the ancestor check, its reopening condition has not occurred, and a rename at final review would move the identity; the other eighteen matched rows are left as matched by a changed file's name or by this order's own decisions. The planning receipts' known issues for this order are judged in FINAL-001: receipt 059's two (an unpinned move failure, a token-only identity rule) were closed by criteria 2 and 8 as filed and by control c03; receipt 060's and 061's first (the overstated NoOp cost) was restated in D008, their second (counts that change with a lane's window) is not yet judgeable and is the reopening condition D006 carries, and their third (a cross-device move blocking every close) was answered by the copy fallback D001 records.",
  "evidence": [
    "node scripts/harness.mjs evidence at entry: the npm test row at code identity 5a4b834539e42d6dbda4db3b86bfb352270b62ce5d3cc902bfec55e912bcf0c8, tree f0e87474ee3a71f1404e10eb1d9525ffc776c282, gateSelection review, exit 0, recorded 2026-11-01T19:33:17.213Z, identityUnchanged true; a git diff --check row at 2026-11-01T20:24:11.648Z, exit 0.",
    "git fetch origin main brought nothing; git rev-parse main origin/main HEAD and git merge-base HEAD main all read 9139d91eb0b2b5cdcb683f750e48684b43fb95b6; git log main..HEAD is empty; npm run worktree -- integrate WO-237 printed 'Integration took in nothing: the worktree is not behind main.' with exit 0, and docs/control/local/integration.json does not exist.",
    "Reproductions under node scripts/harness.mjs bounded --, each exit 0: docs/evidence/WO-237/verification-probes.mjs (9 of 9); docs/evidence/WO-237/verification-recovery-probes.mjs (R1 to R4 reproduced); the temporary-roots cases matching closed order, cross-volume, class window, renumbered device, device transition, retried merge, stops partway, moved its root aside, retention seeds, Codex home listing, bookkeeping failed and census after it fails; the harness case 'usage reads a closed order'; bash scripts/test-release.sh --case success and --case journal_failure; npm run publication:check (45 linked source sections current); node scripts/lineage.mjs index --check (189 sections); node scripts/structural-checks.mjs generated (0 stale). Outside the wrapper: git diff --check clean and npm run format:check clean.",
    "docs/evidence/WO-237/final-review-probes.mjs under the bounded wrapper, exit 0: an expired gate fixture owned by a checkout is a candidate with its checkout present and still a candidate after the checkout is removed; with its marker's device number then changed and its inode and token unchanged it is retained with 'Temporary root device changed and its owner's ledger does not register this token at this path; retained', its marker keeps the old number, and a retry reads the same; the same renumbered root with its checkout present is a candidate and its marker is re-stamped.",
    "packages/skeleton/src/temporary-root-records.mjs: readTemporaryOwner calls writeTemporaryOwner when info.dev differs from record.device; writeTemporaryOwner throws when ledgerBinding returns null; ledgerBinding reads no rows when record.owner.repository does not exist, so at is null and the binding is null. temporaryLedgerContradiction returns null for a missing repository, but readTemporaryOwner throws before the judgment reaches it.",
    "npm run plan -- followups --touching at register revision c8da2a155035c169b3c44c868ea4540362455d08369fdfee9081a751ce2fd4eb: 239 pending rows, 20 matched over 91 changed paths and WO-237; git diff main -- scripts/lib/temporary-prune.mjs holds no line of the ancestor check FUP-3fc196bee33d6d9e names.",
    "WO-237-D011 and docs/evidence/WO-237/reviews.md: the third complete run of 2026-11-01 started before the criteria adversary's third recheck finished, on the operator's direction at 17:04Z; the recheck found five findings, two blocking, repaired after that run with their own complete run; five complete runs in all, the fourth stopped under the operator's override (WO-237-D012)."
  ],
  "traps": [
    "A pass based on VER-001 and the standing gate row without reading the subject would make the reviewer a second signature on the verifier's evidence; the subject diff and the reproductions above were read and run here.",
    "Repairing F1 in this review would change the subject after verification and leave the fix judged by its author; it is boarded with its reproduction instead.",
    "Disposing register rows on a textual match would shift the planner's work onto this review; only the row whose named condition recurred is re-disposed."
  ],
  "rejected": [
    {
      "option": "NoOp: record the pass on the handoff and VER-001 alone",
      "reason": "The final review owns the acceptance, the integration and the release surfaces; each was done from the current tree."
    },
    {
      "option": "Repair F1 here with a marker-only proof for a root without a ledger",
      "reason": "It reintroduces the copied-marker trap D004 names for exactly the roots that have lost their second proof, and a source edit at final review moves the code identity and owes a fresh complete run."
    },
    {
      "option": "Fail the review on F1",
      "reason": "Product 07 routes a defect that breaks no criterion and no behavior main had as a follow-up; F1 is one."
    }
  ],
  "followup": "Decide and implement the second proof for a renumbered temporary root whose owner repository no longer exists, so a gate fixture or build root of a removed checkout that was created before a reboot is judged by its class and window instead of being retained at every read with no kit route to remove it: for example, admit the marker's token and inode where the root lies under a recognized temporary base and its owner repository is absent, or carry a closing worktree's live registrations into main's ledger at release close. Preserve the refusal of a copied marker on another volume wherever a ledger exists, and give scripts/temporary-root.mjs remove and harness prune --apply the same rule. Reproduction: node scripts/harness.mjs bounded -- node docs/evidence/WO-237/final-review-probes.mjs. Paths: packages/skeleton/src/temporary-root-records.mjs (readTemporaryOwner, writeTemporaryOwner, ledgerBinding), scripts/lib/temporary-prune.mjs, scripts/temporary-root.mjs.",
  "reopenWhen": "A prune report after a reboot retains a root of a removed checkout with the device-changed message, an operator removes such a root by hand, or an order takes the follow-up."
}
```
