# WO-071 — registered target repositories evidence

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-5.6-sol","effort":"xhigh","source":"codex-session-readback"}

Recorded 2026-09-21 in worktree `wo-071` at activation base
`9c076bd167af07adae80f3fb2726fa478166d966`, on Darwin 24.6.0 arm64,
Node v26.9.0 and npm 11.19.1. The operator dispatch was `resume: next`.
One coding writer performed the work. No subagent, branch commit, push, pull
request, tag publication or target-worktree mutation was used.

## Implemented contract

The configuration loader now positively decodes a public `repositories` map.
Each id selects a base branch, relative POSIX worktree parent, opaque repository
class and complete authority profile. `self` remains implicit and cannot be
registered. Unknown keys, malformed identifiers and incomplete or malformed
profiles refuse with the configuration path.

A shared leading-metadata parser accepts exactly one
`**Repository:** <id> @ <base-commit>` declaration. Target activation resolves
the id through configuration and records only `repositoryId` and `baseCommit`.
The canonical fold, current Markdown, JSON status, orders projection and
work-order index carry the pair; none carries a configured or physical path.
An order without the field emits neither property, preserving existing event
and projection bytes.

Registered authority is compiled through the existing loadout compiler. Profile
denials remove matching base effects and WorkOrder operations. Exact profile
allows outside either base list are retained only through the deterministic
`registered-repository` grant admitted from the committed registration. The
same widening without that exact grant refuses with `AUTHORITY WIDENING`.
Envelope evidence, expiry, revocation and resource constraints continue through
the monotone floor; a resource increase and an unrepresentable wildcard grant
refuse. An existing graph grant that would override a profile denial also
refuses instead of weakening the registered restriction.

The product write-backs describe the metadata, public registration and authority
semantics in product 07 and product 12. D001–D004 and the generated decisions
index discharge the order's pre-2026-09-09 ledger substitution. Both publication
editions were reviewed and refreshed after their linked source subtrees changed.

## Acceptance evidence

### Criteria 1 and 3 — activation, projections and refusals

`node --test scripts/test-configuration-root.mjs` passed 13 tests and failed
none. Its registered-repository fixtures prove:

- a valid target declaration appends the immutable id and 40-hex base commit;
- status, orders, current Markdown and the generated index expose that pair and
  contain no worktree-parent path;
- an omitted declaration leaves the existing self activation shape unchanged;
- a missing base, unknown id and malformed registered profile refuse before a
  lifecycle event or projection is written, naming the relevant source path.

`bash scripts/test-work-orders.sh` passed all 21 cases, including the shared
repository-field parser, index rendering, declaration/event mismatch and
malformed-commit refusals. `env -u CODEX_THREAD_ID bash scripts/test-resume.sh`
passed the complete legacy lifecycle fixture set; the environment variable is
removed only because that fixture intentionally compares projections without a
live Codex `currentSession` field.

### Criterion 2 — monotone authority

`node --test scripts/test-authority-grants.mjs` passed all four cases. The
WO-071 case starts with `repo.inspect` in both profile allow and deny lists and
proves that denial wins. It retains base `repo.read`, removes `repo.inspect`,
adds exact `repo.delete` authority, and projects `repo.delete` through one grant
whose provenance is `registered-repository` and whose `repo` is `target`.
Calling the profile applicator without that exact grant throws
`AUTHORITY WIDENING`; an existing grant conflicting with the profile denial and
an unknown registration also refuse.

### Criteria 4 and 5 — write-backs and gate

The final pre-gate checks observed:

```text
npm run publication:check                 PASS, 273/273 headings; both editions current
npm run release -- check-surfaces --local PASS, v0.38.0; all four components unchanged
npm run format:check                       PASS
git diff --check                           clean
npm run work-orders -- index --check       PASS
npm run meta -- --check                    PASS
```

`npm run release -- prepare --local` confirmed application target `v0.38.0`,
the next minor above the observed local annotated `v0.37.2` release. No package
source or package manifest changed, so compiler `0.17.0`, console `0.1.7`,
kernel `0.6.0` and skeleton `0.33.1` remain fixed. The root and workspace
manifest diff is empty; no dependency was added or changed.

The canonical final gate ran after the last implementation and product-source
edit:

```text
npm test: 22 passed; 0 failed; 268.48 s; 66 fresh tasks
```

That run included the focused authority-grant and work-order suites, the full
lifecycle fixtures, release surfaces, publication fixtures, the complete
skeleton suite, compiler, kernel, console and worktree integration.

## Boundaries and observations

This order registers target identity and authority but does not resolve or
create target paths; WO-072 owns that lifecycle. Repository classes remain
opaque for WO-073. The declaration accepts immutable lowercase 40- or 64-hex
object ids; supported Git implementations needing another width reopen D002.
Wildcard profile additions outside the base refuse because the existing grant
contract represents exact authority only.

Codex usage counters were unavailable at entry because no harness session had
been begun for this dispatch. Entry and final token/cost values therefore stay
unknown rather than being inferred; WO-149 owns automatic Codex session begin.
