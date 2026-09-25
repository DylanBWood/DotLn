## Release overview

This release makes DotLn's own instructions true about where it runs. Until now every role session read at cold start that a host sandbox and a Codex approval path stood between it and the repository, and the playbook and three ADRs said to keep that sandbox on. None of it matched the operator's host, where Claude Code, Codex and Copilot all run without a host sandbox. The generated role text, the floor, the playbook, the README, the security note and product 07 now state that posture, ADR-0003 records it as a dated decision, and the gate's host-confinement detector is named for what it does.

The intended audience is the operator and every role session that reads the cold-start text, and anyone who forks the harness onto a host of their own.

## Read before upgrading

No migration is required. Historical records keep their bytes and their meaning; nothing was rewritten to match the new vocabulary.

- The runner flag `npm test -- --inside-sandbox` is now `npm test -- --confined-partial`; the old spelling prints the usage error. The recorded identity of a confined partial row is still `npm test -- --inside-sandbox`, a suite still declares `needs: outside-sandbox`, and the gate row's diagnostic field is still `sandbox`, so existing gate rows and their consumers are unchanged.
- The module `scripts/lib/gate-sandbox.mjs` is now `scripts/lib/host-confinement.mjs`, and `detectGateSandbox` is `detectHostConfinement`. Any local script importing the old path must change its import.
- New Contributor compilations carry the authority envelope id `contributor.bounded` in place of `contributor.sandboxed`. The allowed and denied effects, the three outside-write grants and the one-writer limit are unchanged. Every historical `authority.json` keeps the old id.
- ADR-0003's 2026-09-25 amendment supersedes its own sandbox-on decisions and the sandbox-on and permission-mode preferences in ADR-0004 and ADR-0005. The retained Codex checkpoint approval procedure now applies only to `workspace-write` with `on-request`; a full-access session has no outside-approval path and should not ask for one.
- No host setting, refusal or permission mode changes. DotLn's five refusals and the host permission mode remain the boundary, and the operator's user-level Claude setting is outside this repository.

## Substantive changes

**Generated cold-start text.** The Contributor loadout no longer emits "State-changing resume commands require one-invocation outside-sandbox approval in Codex" or "`status`, `times`, `briefing`, and `next` need no Git escalation"; it says host permission settings decide execution. The verifier and reviewer gate sentence is now conditional on the runner's observed result: run `npm test`, and only if the runner reports that the host confines the process, run the printed outside command; a resident-launched verification that cannot run the full selection uses `--confined-partial` and records a partial result that is never product-gate evidence. The compiler residue for Codex reads "Pre-effect envelope checks unavailable in this harness; host permission settings decide." The word sandbox no longer appears in `CLAUDE.md` or either skill root, and every role's cold start is smaller than at `v0.49.0`.

**The posture as a decision.** ADR-0003 gains a dated amendment recording the operator's 2026-09-25 direction that Claude Code, Codex and Copilot run without a host sandbox, what that supersedes, and what stays in force: the authority invariant, personal-settings privacy, the Clean Room floor and honest reporting of host differences. ADR-0004 and ADR-0005 cross-reference it. The playbook's safety baseline, `README.md`'s testing section, the security note, the docs index and product 07's resume-phrase notes state the same posture and point at the amendment.

**Host-confinement detector.** The renamed module probes whether the host denies a write to the directory each recognized harness protects and fails open on every other outcome. Its refusal text now says "confined by the host" and "Run outside host confinement". Product 07's §Gate sandbox preflight is §Host-confinement preflight with a dated note, and the runner's fixture roots are `dotln-host-confinement-*`. Suite selection is unchanged: 27 suites in the full inventory and 25 in the confined partial selection, byte-identical against `main`.

**Authority label.** The Contributor authority envelope is `contributor.bounded`, its capability constraint reads "DotLn refusals and host permission settings define the boundary", and its permissions support is titled "Bounded contributor authority". A new writer test pins the unchanged effects, grants and limit. The authority evidence tool and the support-switch test reproduce the frozen WO-042 and WO-099 identities by restoring exactly the three old labels, so no filed receipt is edited.

## Progressive polish

The harness bundle, the role skills in both roots, the hooks and the manifest were re-emitted from the changed sources. The authority edition is re-minted as `WO-161/002`; artifact identity and verification are `WO-161/001`; feedback `WO-161/001` carries WO-159's live audit and adds no episode. The console self-host fixtures were regenerated. The runner tests, the process-debt test, the race probe and the authority evidence comments use the new names, a WO-161 role baseline is chained to WO-158's, and the docs index gains a Config log line for the regenerated surfaces. The roadmap records WO-161's activation completion.

## Evidence and compatibility

**Release and versions.** This prepares application `v0.50.0` as a minor release over `v0.49.0` (`852861d3`), the classification the order declared. `@dotln/compiler` moves `0.19.0` → `0.19.1` and `@dotln/skeleton` `0.42.0` → `0.43.0`, with the console's pins and the lockfile following. Kernel and console versions are unchanged, and no dependency was added.

**Product gate.** The reviewer's `npm test -- --review` binds the released bytes: **37 suites, 0 failed, 602.12 s, 81 fresh tasks, exit 0**, on tree `4e659995f41f24246fc2cfaddb0c7f8af48ef8cc` at code identity `17655ddca8c6450bac73e611c0d97632f3ac4eabb8e40bdb555cc4768381a590`, with no confinement in force. It was recorded at 2026-09-25T18:44:18.416Z.

**Verification sequence.**

1. [VER-001](../../verifications/WO-161/VER-001.md) found all six criteria met and failed the order on its heading's promise: the "need no Git escalation" clause in six generated skills, two hand-written surfaces stating a sandbox-on posture as current, and six record and naming defects.
2. The [repair](../../evidence/WO-161/repair.md) fixed all eight at the generator and on the named surfaces, with a regression assertion for the escalation clause and an executable confined-row method.
3. [VER-002](../../verifications/WO-161/VER-002.md) passed, rechecking each finding where it was found and reproducing the confined host against `main`'s runner in four cases.
4. [FINAL-001](FINAL-001.md) passed with its own reproduction of the grep, the byte table, the historical-authority immutability and the confined-row projection, every check re-run and the product gate.

**Known limitations.**

- The ADR Status lines and `## Decision` headings were annotated in place beyond the Amendments-only mechanism, so the current posture is visible at the top of each file; the decision bodies are unchanged ([D009](../../evidence/WO-161/decisions.md#wo-161-d009)). The final review leaves confining the change to the Amendments sections as an open question for the operator.
- `scripts/test-evidence-sources.mjs` fails whenever the current feedback edition is a carried one, which has been so since WO-158; its declared sources are unchanged here ([D007](../../evidence/WO-161/decisions.md#wo-161-d007), `FUP-be91067a3842b44a`).
- Product 02 still names "native sandbox/approval" as a control for arbitrary interpreters and shell indirection, outside this order's surfaces ([D008](../../evidence/WO-161/decisions.md#wo-161-d008), `FUP-422f1b3cdd4b7330`).
- The race-probe directory `scripts/probes/gate-sandbox-race/` keeps its name.
- No genuinely confined host ran live; confined behavior is shown by the runner fixture and the method script. The effective posture of a linked Claude worktree rests on the operator's attestation.

Deeper notes: [decisions D001 to D011](../../evidence/WO-161/decisions.md), the [implementation](../../evidence/WO-161/implementation.md) and [repair](../../evidence/WO-161/repair.md) records, the two verification reports, the final review and [the order](../../work-orders/WO-161-sandbox-vocabulary.md).
