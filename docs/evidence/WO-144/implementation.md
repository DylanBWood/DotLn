# WO-144 implementation

Implemented on 2026-09-19 under `resume: next`, with the operator's explicit
choice of a DotLn-managed temporary scratch directory. Independent verification
and final review remain separate. No commit or publication was performed.

Actor: `codex-cli` 0.155.1, `gpt-6-astra`, observed effort `ultra`
(`xhigh` with subagents), source `codex-session-readback` from the current
session briefing. One writable executor; one reused read-only inspection agent
and one read-only feedback-verifier episode; no descendants.

## Delivered behavior

The four closed root kinds are role/support declarations in the harness target.
Lowering requires exact root effects admitted by the existing independent
authority-grant registry and effective envelope, and emits roots, declaring
origins, sources and authority-grant identities into the manifest and hooks.
Equipping a support cannot independently widen authority. The original saved
Contributor graph retains its historical identity; the active program explicitly
requests the two default policy grants.

All six roles declare `system-temp` and `session-scratch`. Scratch resolves to
`<os.tmpdir()>/dotln/<sha256(session-id)>/scratch`; it is not a guessed native
harness directory. Main's ignored intake and an operator-named absolute root
are supported but not defaults. No arbitrary home directory is granted.

The generated Claude pre-tool boundary reuses known shell/file destinations
and physical-path resolution. An outside target needs a containing active-role
grant; unlink operations judge the entry removed. Unknown roles have no grants.
Runtime checks use the existing expiry/evidence/denial decider and saved
correction narrowing. Typed correction also classifies outside writes as
destructive when the equipped correction policy acts.

Opaque commands are recorded as unobserved. Guard failures admit with a
once-per-cause advisory and journaled cause; existing writer, gate, planning
and subagent refusals retain precedence. Runtime-pin failures retain their
existing delegation. Known denials survive a later target-resolution failure.
In-project writes do not consult the grant table. Existing operator override
is unchanged. Codex receives duties and grants as role text, not hook enforcement.

## Acceptance evidence

1. [Decisions and inventory](decisions.md) record the retained journals, role
   observations and defaults. The read-only [scanner](inventory.mjs) found no
   retained command/destination fields: historical destination counts are
   unknown, not zero. No historical destination was invented or copied.
2. [Fixture transcripts](fixture-transcripts.md) cover temporary/scratch
   admission, parent/sibling/home refusal, redirects, symlinks and removals.
   Effects execute only after fixture admission; refused sentinels stay intact.
3. Generated support fixtures cover exact operator-root admission, adjacent-root
   refusal, unequip, manifest provenance and missing registry admission. Compiler
   fixtures cover root validation, wildcard denials and serialized GRANTS.
4. Generated failure fixtures cover once-only advisory/journal behavior, all
   four previous refusals and in-project writes. Additional regressions cover
   stale runtime, correction, unavailable intake and multi-target errors.
5. Product 03, product 07 Discipline, security, README and generated role/shared
   instructions state the guarantee's width. The map carries root requirements
   into external-workflow orders; order-contract grant propagation remains open.
6. Build, generated-bundle checks, selected source tests, release surfaces and
   the four source-pinned evidence checks pass. The full `npm test` is reserved
   for final review as this order directs; no full-product gate is claimed here.

Final selections: 105/105 generated-harness regressions, 137/137 compiler and
selected runtime tests, 21/21 console tests, 3/3 authority-grant tests and 19/19
document/preflight tasks. Intermediate failures and their fixes are retained
in the fixture transcript. `git diff --check` is clean.

The immutable authority edition advanced to revision 001 after the correction
fix changed runtime pins. The first edition is preserved. Artifact identity,
verification and feedback remain the checked initial WO-144 editions. The live
feedback audit completed ten criteria using `codex-cli-exec`; it judges its
feedback capsule, not this work order.

## Cold-start measurement

`node scripts/harness-context.mjs` measures installed shared instruction plus
role skill bytes, not estimated tokens or task inputs. Both harness roots have
identical totals; the shared instruction contributes 5,711 bytes.

| Role | Bytes | Ceiling | Result |
| --- | ---: | ---: | --- |
| executor | 21,871 | 24,576 | within |
| verifier | 18,913 | 20,480 | within |
| reviewer | 20,131 | 20,480 | within |
| release-close | 13,137 | 16,384 | within |
| planner | 14,203 | 24,576 | within |
| refuter | 14,860 | unset | no ceiling configured |

No budget was raised. Local preparation stages application `v0.33.0`, compiler
`0.16.0` and skeleton `0.29.0`; kernel and console behavior versions remain
unchanged. Only internal component pins changed; no dependency was added.

Outcome against D001: generated-hook fixtures protect the known-destination
incident shape without claiming confinement or historical evidence that does
not exist. The remaining limits are intentional non-goals, not claimed passes:
opaque effects, Codex enforcement, native scratch discovery, automatic
order-contract grants and legitimate-root observations absent from old journals.
Reopen on a legitimate known write refused or a known ungranted write admitted.

Entry token/cost counters were unavailable. A later transcript counter supplied
tokens; dollar cost remains unavailable. Final totals, source, scope and cutoff
are recorded in the ignored handoff receipt and final response, not inferred
from the separate live audit.

Output review: the executor reviewed current authored diffs and hand-written
evidence; the read-only reviewer inspected source/test interactions and reported
no remaining finding after the fixes. Generated and large surfaces use their
generation/check evidence. Explicit whole-file read receipts cover the reports
only; they do not imply automatic observation of every source read in Codex.
