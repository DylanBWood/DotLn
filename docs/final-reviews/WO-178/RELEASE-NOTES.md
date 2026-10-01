## Release overview

A planning pass now opens on a record of what the operator saw, not only on the judgments roles filed. The Claude hooks journal each host permission denial and each operator message, by digest and class and never by text. The Stop advisory names background dispatches still running. `plan failures` and `plan start` count close attempts that stopped short, host denials, interventions, phases that ran twice their median and gate runs at an identity already green. They also show how the last eight closes split between delivery and machinery. Under Claude Code auto mode, the release-close publish that the lifecycle has already authorized is admitted by the permission hook instead of waiting on a classifier verdict. This release is for the operator and whoever runs the next planning pass.

## Read before upgrading

- **Authority change: the permission hook's first `allow`.** The generated Claude permission hook now returns `permissionDecision: allow` for one command only: the exact helper `'/path/to/node' '/path/to/main/scripts/release.mjs' close WO-NNN --publish` or `--dry-run`, optionally with canonical `--material` words after `--publish`. Three lifecycle facts must also hold: the session's recorded dispatch is `release-close` for that order, the working directory is the main checkout, and canonical status lists `release-close` as legal. Any other byte, order, directory or dispatch keeps the host's judgment. All five DotLn refusals and an outside-write deny take precedence, and Claude Code's own deny and ask rules still apply. Copilot and Codex get no admission. Whether Claude Code honors the allow in auto mode is unobserved until the first live close after this release.
- **Privacy.** The new journal rows hold digests, byte counts, classes, bounded tool and rule names, order, role and phase. They never hold prompt, tool-input or reason text.
- **New hook registration.** The generated `.claude/settings.json` registers a `PermissionDenied` hook, which brings the harness to 32 generated surfaces.
- **No operator action is required.** No control-event schema changes, and no completion gains a refusal.

## Substantive changes

**Denial journal.** When Claude Code's auto mode denies a call, the new hook records the tool, an input digest and byte count, the bracketed rule name, and the order, role and phase. It prints one advisory naming the operator's two routes, the `!` prefix and `/permissions` → Recently denied. It requests no retry.

**Intervention journal.** Each Claude or Copilot prompt gets a typed row. A recognized control prefix (`resume:`, `planning:`, `ideation:`, `analysis:`, `operator override:`, `scope expand:`, `conversation only:`) sets its class, and any other prompt is `unclassified`. The route (turn prompt, mid-turn or interrupt) comes from the latest matching transcript row, or is `unknown`. Codex records only the dispatch phrase it can observe, and its rows are labelled dispatch-only.

**Running monitors at Stop.** The Stop advisory lists background dispatches this session journaled that have not reached a terminal state, beside the expected completion event.

**Planning counts.** `plan failures` gains five labelled local counts:
- `localReleaseCloses`: close records with a blocker or no published tag;
- `localHostDenials`;
- `interventions`, by class, order and phase, with the `unclassified` count;
- `longPhases`: completed attempts above twice their phase median over the whole record;
- `repeatedGateRuns`: product-gate rows at an identity already green.

The failures export carries the sanitized rows. `plan start` prints the counts and the track split of the last eight closes. It reads an optional `**Track:** delivery|machinery|evidence` header that the work-order index now shows, `unknown` when absent.

**Operator words in the record.** `docs-check` reports a counted advisory for a work-order provenance field, in a header paragraph or on its own, or a decision that attributes quoted words to the operator without a `SHA-256` or `--capture-hash` digest in the same record. Historical records are fingerprinted in the document baseline. A bounded pass paraphrased 30 of them, and 34 are retained as counted exceptions.

## Progressive polish

Malformed decision JSON now fails with its path and record id and no parser excerpt. The shell-diagnostic advisory attributes more conservatively, for example a whole parameter word only when its literal value is known. It also stays within fixed bounds on command length, nesting, output and combined guidance. The console's self-hosted fixture follows the new feedback edition. Fixtures cover each new behavior.

## Evidence and compatibility

Application `v0.61.2` is a patch release over `v0.61.1`, built from WO-178 on `main` at `54c29c12`. `@dotln/compiler` moves to 0.22.1 and `@dotln/skeleton` to 0.49.1, with harness host 0.34.1. `@dotln/kernel` 0.6.0, `@dotln/console` 0.4.0, `@dotln/beacons` 0.1.0 and `@dotln/browser-evidence` 0.1.0 are unchanged. No dependency was added.

The selected evidence editions are WO-178 authority 004, artifact-identity 002 and verification 002, all deterministic. The feedback edition is WO-178 feedback-002, which carries WO-181 revision 002's live audit. The order was executed on `v0.60.1` and integrated over WO-103, WO-102, WO-181 and WO-105. WO-105 had already taken the `v0.61.1` this order prepared.

The verification sequence:
- [VER-001](../../verifications/WO-178/VER-001.md) passed all eight criteria and boarded three defects.
- [FINAL-001](FINAL-001.md) failed criterion 6: the operator-word check missed provenance fields inside header paragraphs.
- The repair fixed the reader. [VER-002](../../verifications/WO-178/VER-002.md) passed after injecting a quotation into all 168 provenance fields and seeing every one without a same-field digest reported.
- [FINAL-002](FINAL-002.md) passed on the integrated tree.

`npm test -- --review` passed on the integrated tree: 43 suites, 0 failed, 810.53 s, 88 fresh tasks, at code identity `9ee66ec2faa53e1f53b0706e5f00582a0126ffac81e62ffce75214b909252afd`. `npm run test:docs` passes.

Known limitations:
- The admission and denial journal are fixture-witnessed. The first auto-mode close after this release is their live check.
- No retry command release close prints is admitted yet, because each starts with bare `node` (D012, widened by D023).
- Host task notifications are counted as operator messages (D014).
- A typed correction does not yet withhold the admission (D013). This is latent, because no DotLn loadout sets a correction token.
- Two provenance fields in one order share one baseline key (D021). This is latent in the current corpus.
- The operator-word check is lexical and cannot see unquoted words.

Details are in the [decisions](../../evidence/WO-178/decisions.md), the [executor handoff](../../evidence/WO-178/handoff.md) and the [repair record](../../evidence/WO-178/repair.md).
