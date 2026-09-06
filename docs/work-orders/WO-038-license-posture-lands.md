# WO-038 — License posture lands in package metadata, publication guards, and the contribution rule (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Metadata, one guard, one contribution
document, and the export default; no runtime capability. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-06 planning pass, in which the
operator decided the license posture recorded in `docs/LEGAL.md`
§Decision — 2026-09-06 (Apache License 2.0 for code, Creative Commons
Attribution 4.0 for documentation, a Developer Certificate of Origin for
inbound contributions, names reserved) and chose to land the license files in
the planning pull request while leaving the executable half to this order.
Planner-synthesized draft; the unedited dispatch is preserved locally in
`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`. Opaque
identifier, not a priority. The clean-room screen found no stop condition.
**Depends on:** the planning pull request that adds `LICENSE`,
`LICENSE-docs`, and `NOTICE` merged; WO-018 merged (release helpers;
satisfied at `v0.4.1`).
**Recommended placement:** first free lane, before the first external fork of
the starter and before WO-033's export ships; it touches only package
manifests, one new check, one new document, and the LEGAL/README surfaces. A
recommendation, not a dependency token.

**Cites (read these sections):** `docs/LEGAL.md` §Decision — 2026-09-06 and
§Decision gates; `LICENSE`, `LICENSE-docs`, `NOTICE`; ADR-0002 Amendments
(dependency posture; no new dependency); 07-execution-guide.md §Discipline
(no config mutation of safety boundaries without work-order authority; this
order authorizes none) and §Workflow closeout (the release-surface
preflight); `scripts/release.mjs` (`check-surfaces`), `scripts/worktree.mjs`
(`publish`), `package.json` and `packages/*/package.json`; the npm
`package.json` documentation for `license` and `private`.

**Objective:** Make the decided posture true in every place a tool or a
person reads it: package metadata, a publication guard that refuses an
accidental package publish, a contribution rule with a certificate of origin,
the export's default license files, and the README and legal record in
agreement.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- No workspace declares a `license` field; `@dotln/kernel` lacks
  `private: true` while the root, compiler, and skeleton have it, a gap the
  legal record named on 2026-09-03 and deferred to a bounded follow-on.
- No publication guard exists: nothing refuses `npm publish` for a workspace,
  and no check ties the manifests to the decided posture.
- There is no `CONTRIBUTING.md`; the inbound rule (DCO 1.1 sign-off for
  outside contributions) exists only in the legal record.
- WO-033's export was drafted with an explicit `--license` flag before the
  decision; with the decision made, the export should copy core's license
  files by default.

**Design (scope discipline):**

- Add `"license": "Apache-2.0"` to the root and every workspace manifest;
  add `"private": true` to `@dotln/kernel`; keep every workspace private
  until a separate publication decision (the license is the grant on the
  source, not a distribution channel).
- Add a `license-surfaces` check to the release-surface preflight
  (`check-surfaces`, `worktree publish`, `release close`): every workspace
  carries the decided `license` value and `private: true`; `LICENSE`,
  `LICENSE-docs`, and `NOTICE` exist with the SHA-256 the legal record
  names; `npm publish --dry-run` on each workspace refuses. Report observed
  and expected values like the existing README block check.
- Add `CONTRIBUTING.md`: outside contributions are accepted under the
  outbound licenses with a DCO 1.1 `Signed-off-by` line on each commit; the
  operator's own commits need no sign-off; no CLA. The document links the
  clean-room boundary, the work-order process, and the playbook. Enforcement
  of sign-off for non-author commits is a `worktree publish` check, not a
  Git hook (no hook or settings change is authorized here).
- Retarget WO-033's export: the kit copies `LICENSE`, `LICENSE-docs`, and
  `NOTICE` as manifest-listed kit files by default; `--license none` remains
  only as an explicit opt-out that writes the no-rights notice, for someone
  exporting a deliberately unlicensed variant.
- Sync `README.md` §Sources, license, and legal posture and `docs/LEGAL.md`
  §Current state with the landed metadata, and mark the decision gate items
  that this order discharges.
- **Declined alternatives, recorded:** a CLA (no relicensing right is
  needed); publishing packages (a separate gate); a Git commit-msg hook for
  sign-off (hooks are safety-boundary configuration outside this order).

**Deliverables:** the manifest fields; the `license-surfaces` check wired into
the preflight and `npm test`; `CONTRIBUTING.md`; the WO-033 retarget note;
the README and LEGAL sync; ledger entry.

**Acceptance criteria (all required)**

1. Every workspace manifest carries `"license": "Apache-2.0"` and
   `"private": true`; `npm publish --dry-run` refuses for each workspace and
   the check records the refusal.
2. `check-surfaces` fails on a fixture with a missing license field, a
   changed `LICENSE` hash, or a workspace without `private: true`, naming the
   observed and expected values, and passes on the repository.
3. `worktree publish` refuses a branch containing a non-author commit without
   a `Signed-off-by` line and accepts author commits without one (fixture).
4. `CONTRIBUTING.md` exists, states the DCO rule and the outbound licenses,
   and links the boundary, process, and playbook; `docs/LEGAL.md` and the
   README agree with the manifests.
5. `npm test` green; `git diff --check` clean; no new dependency; no hook or
   settings change.

**Evidence gate:** the check transcripts for criteria 1 through 3; `npm test`.

**Write-back duty:** README, `docs/LEGAL.md`, WO-033's export paragraph,
ledger entry.

**Non-goals:** publishing any package; a CLA; a Git hook; changing the license
choice; third-party notices for material not yet distributed; a trademark
filing.

**Operator-review assumptions**

1. The operator's own commits carry no sign-off requirement; outside
   contributors sign off under DCO 1.1.
2. Workspaces stay private until a separate publication decision.
3. The license file hashes recorded in the legal record are the ones this
   order pins.
