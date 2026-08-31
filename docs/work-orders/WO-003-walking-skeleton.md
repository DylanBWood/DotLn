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
