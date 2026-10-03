## Release overview

This release fixes the defects already recorded in the parts DotLn's end-to-end loop will be built from. The loop composes a story compiler, a verifier, an independent reviewer, a pull-request observer, a publisher and a writer. Each part had a defect that an earlier review found and boarded, and the next order, which composes them, would have met every one. This release settles nineteen of them, each with its own fixture. The visible changes:
- A behavior verifier on a stream with an independent review now passes the behavior it verified, and leaves scope and convention defects to the reviewer instead of stopping for a human.
- A request from which no file surface can be derived now always goes to a human.
- The writer's confined test command can no longer write the paths its own Write tool is refused.

The release is for operators who run verification, review and target publication, and for the composition order that comes next.

## Read before upgrading

- **Surface derivation hands off more often.** `deriveSurfaces` returns `NeedsHuman` with "no derived surfaces" whenever it derives none, whatever threshold the caller passes. A requirement that only a supplied inference covers no longer counts toward confidence. It appears as a candidate with its inferred surfaces, so at the default threshold such a request goes to a human. Four other retained inputs keep their outcome but now give the reason "no derived surfaces".
- **The noun rule no longer matches inside hyphenated words.** `parser` matches "the parser module" but not "parser-other".
- **Writer confinement is stricter.** The Claude writer's confined test command now runs under a host-owned profile file outside the worktree. That profile denies writes to `.claude`, `.dotln`, `.git` (including a linked worktree's link file) and the local instruction file in both spellings.
  - A target whose tests write into `.git` will now fail under the writer.
  - A contract test command containing `*` is refused for this profile, with its reason.
  - Other sandbox users keep their inline profile.
- **Configuration reading refuses non-files.** `dotln.config.json` that is a FIFO, directory or other non-regular file now refuses by path instead of blocking. Any open failure other than a missing file also refuses by path.
- **A flagged publish repeat checks readiness.** `worktree publish … --require-deliverable-ready` over a head already published without the flag now refuses while an item is absent. When every item is present, it returns the recorded publication without a remote call.
- **The checks row accepts not-applicable for build and lint.** The row then shows the owner's reason. Tests can never be not applicable.
- **A new optional field.** A verification opening may carry `reviewNotice: true`. A stream opened without it compiles the same verifier command as before, byte for byte, so recorded streams resume unchanged.
- **Component versions.** The compiler moves to 0.25.0 and the skeleton to 0.52.0. No dependency is added.

## Substantive changes

**Story contract.** A whitespace-only image reference derives no statement, and a bundle the decoder admits no longer throws in the compile. Duplicate relation entries are removed before the contract identifier is computed, while duplicate class entries still refuse. A `follows` fact now runs from the first later discussion entry by another author to the question, even when the asker posts again first.

**Pull-request observer.** Every cursor and review-thread identifier sent back to `gh` must be a bounded opaque token, and a malformed one refuses at its field path. An error the observer did not raise prints a fixed reason and never the response bytes. A comment too large for the screen is refused alone as `unscreenable-text`, and its peers are kept.

**Review loop.** The loop no longer reports `resolved` while an item's own terminal says otherwise; it stops `needs-human` and names the item. Freshness is measured from that item's latest repair push or thread disposition. An automated comment with no positive line goes to the human. A repair derivation failure returns `human` instead of throwing.

**Verification and review.** On a review-enabled stream, an in-stream repair marks every criterion stale, so the review is dispatched only after each criterion is re-verified at the repaired revision. The result schema offers only the claim types the capsule's criteria carry. Three live Claude verifier and reviewer attempts each passed both behaviors and then reported both planted review defects.

**Reactor.** Three decider-free regions moved byte for byte into a new leaf module, `verification-fold.ts`. The reactor is now 90,998 of its 100,000-character bound, and the eighteen recorded streams keep their decisions. A transitive purity check walks the reactor's import closure and allows exactly two reasoned host imports.

**Workers.** The entropy prompt's temporary-directory sentence is joined cleanly, and the episode's `TMPDIR` is set in the worker's launch environment instead of the parent's. The CLI episode supervisor kills its episode on interrupt, termination and hang-up. An answered `unknown` mission judgment over an incomplete capsule names the omitted paths and decisions.

## Progressive polish

Comments in the story contract now state the `follows` reading, the reappearance of invalidated identifiers and the noun boundary characters. Product 03 describes the review notice and the not-applicable checks row. The documentation disclaimers about a blocking configuration FIFO are removed from product 04 and the console README. The WO-065 evidence README states what the observer logs. New and rewritten fixtures pin each item, including the earlier `inferred` derivation and the four-claim-type schema test.

## Evidence and compatibility

Application `v0.66.0` is a minor release over `v0.65.0`, built from WO-184 on `main` at `53fc6eb8`. The compiler moves 0.24.0 → 0.25.0 and the skeleton 0.51.0 → 0.52.0. Kernel 0.6.0 and console 0.4.0 are unchanged, and no dependency was added.

The verification sequence:
- [VER-001](../../verifications/WO-184/VER-001.md) failed on the byte identity of the moved reactor regions, and the repair fixed it.
- [VER-002](../../verifications/WO-184/VER-002.md) passed all twenty-two criteria.
- [FINAL-001](FINAL-001.md) passed after repairing VER-002's two carried findings in the order: the writer profile's parity with the protected paths, and the review-stream staleness assertion.

The final review re-minted the authority and feedback editions as revision 003. That included a fresh live feedback audit on Codex `gpt-6.1-sol` at `max`, with every step timed (115.6 s whole). `npm test -- --review` and `npm run test:docs` pass at the reviewed subject.

Known limitations:
- Two host imports remain inside the reactor's import closure, `discovery-sandbox.ts` and `gate-deadlines.mjs`, each with a reasoned exclusion. Whether either is reachable from a decision path is not shown.
- The served model and effective effort of the live attempts were not observable and are recorded as unknown.
- The writer confinement is macOS-only, through `sandbox-exec`.
- The `repairPlans` field, inline-strike fragmentation and derived surfaces in the review context are left as they are, by the order's design.

Details are in the [decisions](../../evidence/WO-184/decisions.md), the [handoff](../../evidence/WO-184/handoff.md) and the [final regeneration record](../../evidence/WO-184/final-regeneration.json).
