--- docs/evidence/WO-189/candidate-1200.md (generated version line masked)
+++ README.md (generated version line masked)
@@ -44,3 +44,3 @@
 
-After `npm install`, one command runs the first proof:
+With Node 26, two commands install the workspace and run the first proof:
 
@@ -56,4 +56,4 @@
 the event log, one line of glyphs projected from the same log, and a receipt.
-Then look around: `npm run console -- board` renders every recorded actor,
-build and piece of evidence, and `npm run dotln -- intent "Describe the work"`
+Then look around: `npm run console -- board` renders actors, builds and evidence
+from the repository's logs, and `npm run dotln -- intent "Describe the work"`
 files a draft work order from one sentence. The
@@ -68,9 +68,9 @@
 <!-- dotln-what-runs:start -->
-Hand DotLn one sentence of intent and it files a bounded work order; from there the machinery, not your attention, carries the rules.
+Hand DotLn one sentence of intent and it files a draft work order; once you or a resident you have authorized admits it, the machinery, not your attention, carries the rules.
 The compiler turns that order's loadout into a program and an authority envelope that the kernel checks on every decision, so a worker that reaches for an effect it was never granted is refused, and the refusal is an event you can replay.
-A disposable worker on Claude Code or Codex does the work in its own worktree, passes the host's test and commits, and a blinded verifier that never saw the worker judges the change against the contract, sending it back to a fresh worker until the original contract passes.
+A disposable worker on Claude Code or Codex does the work in its own worktree, passes the host's test and commits, and a blinded verifier that never saw the worker judges the change against the contract, sending it back to a fresh worker until the original contract passes or the repair budget runs out and a person decides.
 When the change is good, a publish step opens the pull request, waits for the automated reviewer and answers each comment with evidence; so far these runs are recorded scratch proofs on synthetic modules, and a browser adapter can add screenshot, network and console witnesses when the subject is a web page.
-While you are away, a resident host keeps the loop moving under a presence policy you set, and a mission check holds every unattended dispatch the moment the work drifts from its contract.
-Everything above writes to one event log, so the actor board and the live console can show you every actor, build and piece of evidence, and the first proof, the Repo Gardener plus Seiri scenario, still replays from that same log today.
-This repository is built by that loop: every change on this page went through a bounded order, an independent verification, a final review and a release close, each resumed from one phrase.
+While you are away, a resident host keeps the loop moving under a presence policy you set, and a mission check on a fixed cadence holds unattended dispatch whenever it finds the work off its contract or cannot tell.
+Everything above records its events in typed, versioned logs, so the actor board and the live console can show you the actors, builds and evidence in those logs, and the first proof, the Repo Gardener plus Seiri scenario, still replays from its own log today.
+This repository is built with the same roles: a work order merges after an independent verification and a final review, a release close follows, each step resumes from one phrase, and this page now changes only through such an order.
 
@@ -93,3 +93,3 @@
 - ask only when the decision is material → an interruption policy with six
-  named conditions;
+  named conditions, specified and not yet compiled;
 - make presence-conditioned changes explicit → a policy that may hold, shrink,
@@ -197,3 +197,4 @@
   [`docs/final-reviews/`](/docs/final-reviews/) — immutable evidence.
-- [`docs/control/`](/docs/control/) — the append-only resume log.
+- [`docs/control/`](/docs/control/) — the append-only resume log and the
+  control records.
 - [`docs/lineage/`](/docs/lineage/) — the idea ledger and sources.
