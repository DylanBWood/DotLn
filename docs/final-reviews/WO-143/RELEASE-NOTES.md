## Release overview

A resident killed while it was taking its store lock could leave behind a guard directory that refused every later start until someone deleted it by hand. WO-068's verification measured that window at 4 to 17 ms per transaction, and the resident enters it several times a tick. This patch closes it: the guard now names the process that holds it, and a start that finds the holder dead inspects the store, reclaims the guard and continues, with every earlier event byte kept and an episode that was in flight recorded lost exactly once. It is for anyone who leaves `dotln resident` running unattended.

## Read before upgrading

**No migration.** A store written by v0.32.0 opens unchanged, with its `host.lock` present or absent, and no event, envelope, schema or predicate changes.

**A guard left by v0.32.0 or earlier still refuses.** An ownerless `host-lock-recovery` directory cannot be judged, so it stays a human decision. `dotln resident` and `dotln presence` print only `worker host refused; inspect the store and declared environment before retrying`; the guard path is in the store-level error, not on the command line. Look at `host-lock-recovery` in the store directory and in its `.resident-append` subdirectory.

**What still refuses, on purpose.** A guard whose owner is alive, a guard whose owner record is missing, partial or malformed, a torn log, and an owner whose process id has been reused by a live process. That last case costs one human step and is the safe direction.

**Downgrading.** A v0.32.0 binary that meets a guard abandoned by this version refuses it, as it refuses any guard it finds. This is read from the released source and was not run.

**Small private directories can remain after a kill.** Acquisition prepares a `.host-lock-*` directory inside the store before publishing it. A kill during preparation or cleanup can leave one behind. It grants no ownership, nothing reads it and nothing deletes it automatically; verification counted four after forty kills.

**Locking costs more.** One uncontended lock cycle takes about 19 ms where v0.32.0 took about 5 ms on the review host, because a steady-state cycle now makes five `fsync` calls where it made two. A guard that refuses permanently now takes about 8 s to say so at the command line, against about 4.5 s, since the retry budget is unchanged and each attempt does more.

**Scope.** This is recovery from a local process kill on a local filesystem. Power loss, network filesystems and interference from another process of the same user are not covered and were not tested.

## Substantive changes

**The lock-recovery guard names its owner and a dead owner's guard is reclaimed.** The guard is an exclusive link to a directory that already holds a complete owner record, so no instant exists in which a guard is present without an owner a later start can judge. A start that finds the owner dead replays the store first and only then retires the guard. Reclaim is serialized: contenders race for one exclusive successor record inside the dead owner's directory, one wins, and the winner confirms the canonical guard still names that directory before it touches shared state, so a claimant that was delayed cannot disturb a newer holder.

**`host.lock` is published complete.** The lock file is written in private and linked into place, so a kill between any two calls leaves either the old lock, no lock or a complete new one, never a partial owner.

**Inspection reads the log the lock protects.** Taking the resident's short append lock now positively replays the resident's own event log before reclaiming a dead owner, where it used to read an empty auxiliary log. A live writer is excluded before its log is read, so the inspection judges a stable subject.

**The polling loop stops taking the lock once it has killed an episode.** It waits for the actor to exit and records the outcome in one final transaction. Before, it kept cycling the lock, and sampling the clock at each observation deadline, while the episode drained.

## Progressive polish

The decoder read inventory gained two rows for the guard owner record, read through the same path-addressed decoder as every other store read. The skeleton README, product 03's resident paragraph and the capability table were brought in line, including what the command line actually prints on a refusal. Skeleton moves to 0.28.1 with console's exact pin and the lockfile following it; the generated harness bundle was regenerated for the new runtime version with its authority evidence, and a new feedback evidence edition was selected because `worker-store.ts` is one of that audit's pinned sources.

## Evidence and compatibility

Source: branch `wo-143` over `main` at `8842470e`, staged as application `v0.32.1`, a patch above `v0.32.0`, with skeleton 0.28.1 and kernel 0.6.0, compiler 0.15.0 and console 0.1.7 unchanged. No dependency was added. Supported runtime: Node `>=26.0.0 <27`. The final-review gate `npm test -- --review` passed 28 suites with 0 failures in 395.32 s under Node 26.9.0, recorded 2026-09-19T19:04:57.804Z at code identity `e76b7b66`.

[VER-001](../../verifications/WO-143/VER-001.md) passed all six criteria and added evidence the fixtures could not: an uninstrumented `dotln resident` was killed at 120 random instants, 65 of them with a published guard, and every next start succeeded, while the same harness on v0.32.0 wedged on its second kill. The deterministic fixtures kill a real resident subprocess at 344 filesystem-call boundaries during startup and 68 during a running episode's polling, across the once and loop paths, and run thirty kill-and-restart rounds per path. Four of five valid mutants failed them; [FINAL-001](FINAL-001.md) added the assertion that fails the fifth, and corrected two README sentences that said the refusal names the guard. Decisions: [WO-143-D001 to D006](../../evidence/WO-143/decisions.md).

Known limitations, each owned. A live holder releasing its lock at the wrong microsecond can make a contender fail with an unretried `ENOENT` instead of waiting; no event is written or lost, the store reopens, v0.32.0 behaves identically, and it is boarded for an order ahead of the first unattended hour (D004). The lock-cycle cost above is accepted with a reopening observation (D006). Crash boundaries are stepped at the level of Node's filesystem calls, not inside a single native call. Everything ran on one macOS host on local APFS. The first unattended hour (WO-111) is the reopening observation for the resident's dependability.
