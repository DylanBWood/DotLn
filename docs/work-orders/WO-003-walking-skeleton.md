# WO-003 — Walking skeleton (fake executor), v0.2.0

**Model:** any capable model.
**Depends on:** WO-002 complete.

**Cites (read these sections):** 02-domain-model.md (WorkOrder,
AuthorityEnvelope, Cadence, Result envelope, Workstream rows; plus the
Reactor, Decision, and Command rows and the pinned ID-scheme paragraph —
reserved `rngState`/`policy` state keys, pinned outbox event types,
namespace-tagged `commandId`);
03-architecture.md (§Session lifecycle & resilience — canonical matrix rows 1,
3, 5; §Operator-presence policy); 05-pattern-library.md (§5S — the Seiri
pillar and the Repo Gardener identity); 06-roadmap.md v0.2.0;
04-interfaces.md (§Glyph system) for the visible payoff.

**Objective:** The Repo Gardener + Seiri vertical end-to-end against
deterministic fakes. This proves the kernel's shape before any model
integration.

**Layout:** new `packages/skeleton/` (CLI, fake adapters, fixture repo tree,
glyph renderer). Modifying `packages/kernel/` is in scope ONLY for gaps this
scenario exposes; note each kernel change in the result.

**The 13-step scenario (must run exactly)**
1. Operator creates a bounded repository-inspection task (CLI).
2. Repo Gardener equips the Seiri contract: may inventory, classify, analyze
   references, propose deletion candidates; may NOT delete; must attach
   evidence per candidate; active only while operator is absent; re-evaluates
   every 20 virtual minutes; interrupts on operator return.
3. A hand-assembled loadout object (opaque to the kernel, shape provisional
   and explicitly non-normative for v0.3.0) is passed to the reactors and
   hand-compiled into the step-6 WorkOrder.
4. OperatorPresenceChanged(away) event activates the cadence (encode step 2's
   "active only while operator is absent" with the kernel's evaluable subset —
   `Gate`/`Until` around `Every`; `While` ships as a type but its evaluation
   throws as deferred, and implementing it counts as an on-contact kernel
   change to note in the result).
5. Virtual time advances to the pulse.
6. Kernel emits a bounded WorkOrder (transport-neutral, every field of the
   kernel's exported `WorkOrder` type — the domain model's ten prose items
   compile to thirteen properties, `workOrderId` included, with
   repo/baseCommit and allowed/prohibited operations split).
7. Fake executor "inspects" the fixture repo tree.
8. Fake executor returns evidence-backed candidates as a `CommandResult`
   event correlating on the dispatched `commandId`, with a string
   `payload.result` selecting the Invoke continuation (candidates ride in the
   payload; the pinned outbox event types
   `CommandPersisted`/`CommandResult`/`CommandRefused` are in
   02-domain-model.md's Command row).
9. A deletion command is attempted once and refused by the WO-002
   authorization guard (structural refusal event, not politeness).
10. Episode terminates; continuation selects verification.
11. Fake verifier independently accepts/rejects candidates.
12. OperatorPresenceChanged(returned) is folded into skeleton state, and the
    skeleton's scheduler cancels future pulses; the already-queued pulse is
    fed to the kernel's `guardQueuedPulse`, which re-evaluates presence
    through the predicate registry and declares the NoOp-with-trace and the
    schedule ids to cancel — the skeleton executes those cancellations itself
    (queue ownership, presence folding, and executed cancellation are runtime
    work, not kernel gaps: 03-architecture.md §Session lifecycle &
    resilience, "Row 5 scope at v0.1.0").
13. The full event timeline renders as a human-readable CLI projection **and
    as an emoji-glyph scene** (zero assets; glyph states per the visual
    grammar; terminal or static HTML).

**Acceptance criteria:** the scenario runs twice — live and replayed from the
JSONL log — producing identical decision traces; steps 9 and 12 have dedicated
tests; a crash+restart at step 8 recovers to the same outcome via the
kernel's outbox exports (`replayOutbox`/`pendingCommands`), with the fake
adapter deduping on the namespace-tagged `commandId` (`ep:`/`ws:` scheme,
02-domain-model.md ID-scheme paragraph) — this test must demonstrate the two
matrix-row-1 halves a kernel-only test cannot: actual re-dispatch after
restart, and no duplicate effect at the adapter.

**Non-goals:** real executors, interactive web UI, the pattern compiler, more
than one fixture repo, rating projections.

## Operator-authorized ideation expansion (2026-08-31)

The operator explicitly paused implementation/verification and expanded
WO-003 to include an ideation breakout. This authorizes raw local capture,
clean-room synthesis, and verification of the resulting documentation. It does
not authorize implementation of the newly described horizons.

**Breakout receipt:**

- Raw source: gitignored
  `docs/intake/notes/wo-003-expanded-ideation-2026-08-31.md`, operator dumps
  001–018.
- Ledger: `docs/lineage/idea-ledger.md`, “WO-003 expanded ideation batch 001”
  and the ideation-process entry under “Post-WO-003 process additions.”
- New durable surface: `docs/product/10-ir-compatibility.md`.
- Updated surfaces: `docs/product/02-domain-model.md` (IR artifact and
  Compatibility plan), `03-architecture.md` (historical-loadout compatibility
  planning), `04-interfaces.md` (paste verifier and compatibility preview),
  `06-roadmap.md` (post-1.0 horizon), `07-execution-guide.md` (ideation-mode
  verification), and `docs/README.md` (map).
- Operator utility: `scripts/backup-intake.sh`, its dedicated executable test
  `scripts/test-backup-intake.sh`, the `npm run backup:intake` shortcut, and
  operator instructions in `docs/README.md` and `docs/PLAYBOOK.md`.
- Verification-history process: immutable numbered reports under
  `docs/verifications/WO-NNN/`, documented in that folder's README,
  `docs/product/07-execution-guide.md`, `docs/PLAYBOOK.md`, and the docs map;
  the existing WO-002 re-verification moved to
  `docs/verifications/WO-002/VER-002.md` without rewriting its findings.
- Resume control v1: append-only `docs/control/resume.jsonl`, generated
  `docs/control/current.md`, `scripts/resume.mjs`, its isolated lifecycle tests,
  and the `npm run resume -- <action>` projection. The operator selected the
  JSONL option after reviewing four designs.
- Worktree lifecycle v1: `scripts/worktree.mjs`, isolated real-Git integration
  tests, npm projection, and PLAYBOOK/README guidance for safe start and
  post-final-review PR publication plus post-merge cleanup. It refuses to
  clean up until the reviewed branch is contained in `origin/main`; rebase,
  force-delete, auto-merge, and dirty-worktree cleanup remain non-features.
- Final-review process: immutable artifacts under
  `docs/final-reviews/WO-NNN/FINAL-NNN.md`; authority for bounded last-mile
  non-substantive handoff corrections and affected test reruns; any
  acceptance-relevant correction must fail final review and return through a
  fresh numbered independent verification; mandatory review of the WO, complete
  verification sequence, diff, ideation receipt, ledger/product/schema changes,
  and clean-room boundary; passing output is a ready-to-merge handoff.
- Preserved unresolved choices: first delivery form (package, executable,
  cloneable repo, web generator, manifest/share code); canonical availability
  representation and enum; exact-emulation versus adaptation policy by artifact;
  and whether game AI becomes a vertical, adapter, or generalization suite.
  A later installed `dln resume` CLI remains unresolved; v1 uses conversation
  phrases and the npm projection.
- Additional future surfaces: truthful TUI context/delegation progress and a
  small sequence of work orders that project resume/verify/fix/final-review
  intents as on-demand native agent skills. The durable control log and CLI
  remain authoritative; the skills must prove behavioral parity and reduced
  ambient context before replacing autoloaded role prose.
- Release policy: WO-003 is the proposed first source-release boundary,
  `v0.2.0`, but tagging occurs only after final review, PR merge, and a green
  evidence run on the merged commit. The tag and release manifest are a
  separately authorized post-merge action, not part of this implementation.
  Its release-closeout output includes layered patch notes following
  `docs/product/08-publication-compiler.md` §Release-note edition.

**Additional verification gate:** before final WO-003 closeout, the verifier
and final reviewer must read this receipt and the synthesized surfaces, inspect
the raw source locally for intent coverage and clean-room safety, and report or
correct: omissions, accidental invention, contradictions with settled docs,
canonical-vocabulary drift, broken references, version/schema anti-patterns,
and any unresolved choice presented as decided. Documentation fixes remain in
scope. The backup utility must be independently executed and its tests must
demonstrate intake-only archive contents, archive integrity, owner-only
permissions, overwrite refusal, and symbolic-link refusal. Implementation of
the other future capabilities remains out of scope.
