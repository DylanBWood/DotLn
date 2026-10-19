# WO-221 VER-002 probe evidence

Subject: code identity `104d1bf29eb45e2b238c3d3b918d1c6f4d58efb608762adcb3dfed41f152310b`, checkout HEAD `8bbdcbff67fe5cb9600bab24cec46ed0b0c726cb`; the working tree differs from checkpoint `refs/dotln/checkpoint/WO-221/7` only in the verify dispatch's control projections. The verifier did not edit the implementation. `probes.mjs` builds each probe from the target-worktree suite's fixture helpers (local bare remotes and the mocked `gh`) in a generated copy under system temp, and `harness-check-stale.mjs` emits the contributor harness into a scratch repository. Nothing reaches a real service, and every probe removes its temporary files.

Run from the repository root, one process at a time:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-002/harness-check-stale.mjs
node scripts/harness.mjs bounded -- node docs/evidence/WO-221/verification-002/probes.mjs <mode>
```

The modes are `literal-dirty-main`, `control-dirty-main`, `literal-ignored-rules-main`, `literal-malformed-settings-start`, `literal-malformed-settings-close`, `base-info-exclude-env`, `base-preignored-disposable` and `release-tag-moved-forward`. A probe asserts the safe or required behavior, so the two that exit 1 below are reproduced defects, not passing checks. The table records the run of these saved files on 2026-10-19 UTC.

| Probe | Started | Exit | Bounded duration | Observation |
| --- | --- | --- | --- | --- |
| `harness-check-stale` | 08:28:58 | 0 | 0.832 s | A clean `harness check` prints no stale line. With a sidecar for an order that has no registered target worktree, it prints `stale host rules for WO-998: no registered target worktree holds this order; run node '<scratch>/scripts/worktree.mjs' host-rules --remove WO-998`. Criterion 2. |
| `literal-dirty-main` | 08:28:59 | 0 | 4.932 s | Under `hostRules: "literal"`, main shows `?? .codex/rules/dotln-WO-999.rules` after start, and a second `worktree start` exits 1 with `working tree is not clean` naming that file. F1. |
| `control-dirty-main` | 08:29:04 | 0 | 6.086 s | Without the opt-in, main is clean, the second (launchpad) order starts and its output prints no host launch lines. Criteria 2 and 3. |
| `literal-ignored-rules-main` | 08:29:11 | 0 | 5.640 s | With `/.codex/rules/dotln-WO-*.rules` ignored, the rules file remains, main is clean and the second start succeeds: the candidate repair for F1. |
| `literal-malformed-settings-start` | 08:29:16 | 1 | 4.873 s | A malformed `.claude/settings.local.json` fails start with a bare JSON parse error after the target worktree, clone branch and registry entry exist. The printed retry exits 1 with `repository target: target already exists`; `host-rules --rewrite` exits 0. F2. |
| `literal-malformed-settings-close` | 08:29:21 | 1 | 14.597 s | A malformed `.claude/settings.local.json` fails release close with a bare JSON parse error after the target worktree, registry entry and order branch are gone. After the file is repaired, the retry exits 1 with `target worktree registry entry is missing`; the Codex rules file, sidecar and three order-named Claude rules remain. F2. |
| `base-info-exclude-env` | 08:29:36 | 0 | 11.711 s | A base `.env` hidden from `--exclude-standard` only by the clone's `info/exclude` refuses with `target clone base main is not clean (.env)`; `.env`, the target worktree and the base commit are retained. Repaired V1-F1, another ignore source. |
| `base-preignored-disposable` | 08:29:48 | 0 | 15.380 s | A base `node_modules/` that the base already ignores and the class declares disposable is deleted at close, and the receipt lists `base node_modules (1)`. Design C's reach after the D030 repair; an observation. |
| `release-tag-moved-forward` | 08:30:03 | 0 | 18.867 s | After the Release creation fails, the base advances and the remote tag moves forward to the new base head. The retry exits 1 with `not the recorded release commit` and creates no Release; with the tag restored, the retry exits 0 with one Release and the tag at the recorded commit. Repaired V1-F2, forward variation. |

The saved VER-001 probes were also rerun at this subject from `docs/evidence/WO-221/verification-001/` between 08:15:48 and 08:17:40 UTC:

| VER-001 probe | Exit | Observation |
| --- | --- | --- |
| `admission.mjs` | 0 | The registered-target admission fixture and its variants pass (10.787 s). Criterion 1. |
| `close-preignored-env` | 0 | Close exits 1 naming `.env` with the registration remedy; `envRetained: true`, `targetRemoved: false`, `baseMoved: false`. V1-F1 repaired. |
| `close-moved-release-tag` | 1 | The generated copy fails to compile because the injected `ghFile` collides with the expanded test's own declaration of that name. This is a probe-preparation failure, not a product result; `release-tag-moved-forward` replaces it. |
| `fallback-original` | 0 | Opted-in rules are written and removed, stale ownership is reported and removed, and an absent release policy reports no-release. |
| `fallback-optout-rewrite` | 0 | The rewrite exits 1 with `has not opted into hostRules literal; no host rules changed` and creates neither file. V1-N1 repaired. |
| `draft-ready-retry` | 0 | A simulated ready failure resumes with one pull request at the reviewed head. Criterion 5. |
| `draft-moved-head` | 0 | A moved draft branch is refused as stale and is left unchanged. Criterion 5. |

The same session also ran `npm run format:check` (pass, 08:24:04 UTC), `npm run publication:check` (pass, 08:24:05 UTC), `git diff --check` (pass), `node scripts/harness.mjs check` (34 generated surfaces, 08:28:36 UTC), `node scripts/authority-evidence.mjs --check` and `node scripts/feedback-evidence.mjs --check` (both pass; the feedback check reports that the retained WO-216 live audit's judged behavior is unchanged). It also ran the saved VER-001 gate audit (08:07:10 UTC), which found the complete review row at the current code identity.

See [VER-002](../../../verifications/WO-221/VER-002.md) for the verdict, criterion judgments and limits. [D035](../decisions.md#wo-221-d035--ver-002-follow-up-a-literal-fallback-order-leaves-main-unclean-for-the-next-start) and [D036](../decisions.md#wo-221-d036--ver-002-follow-up-a-malformed-operator-settings-file-strands-start-and-close-after-their-irreversible-steps) board F1 and F2.
