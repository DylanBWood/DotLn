# Roadmap — application release ladder

Application versions with exit criteria; pivots are gated on evidence at each
rung. Ideas recorded in the ledger never block a rung and never sneak into one —
the deferral list is part of each milestone's definition. Two pacing rules:
**point of view before efficiency** (explore until a perspective exists, then
optimize), and **every rung ships a visible payoff** — this is a solo project
run on momentum; six rungs of invisible infrastructure is a project-death risk,
so each version ends with something the operator can see, touch, or play with.
The environment for this ladder is the **personal machine** (macOS, personal
Claude Code plan, Codex CLI as second executor, personal GitHub);
managed-environment constraints (enterprise gateways, centrally managed
settings) are out of scope until such a deployment exists.

This ladder builds the author's personal reference implementation while
extracting reusable platform mechanisms from it. It is not the minimum policy
every DotLn implementation must adopt. Each rung should increasingly label
platform contract, personal-instance doctrine, and optional saved profile; the
eventual physical package boundary remains evidence-selected under ADR-0006.

## Release boundary

**WO-156 activation completion (2026-09-24):** assigned application `v0.46.1`,
the next patch above the observed local `v0.46.0` tag, under the declared patch
classification. Plan subject construction resolves the work-order path pattern
once per call, preserving output while reducing recurring document-check time.
Independent verification, final review and publication remain separate actions.

**WO-156 collision retiming (2026-09-24):** unpublished target `v0.46.1` is superseded by `v0.46.2` under the existing patch classification because the observed release baseline is `v0.46.1`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-155 activation completion (2026-09-24):** assigned application `v0.46.1`,
the next patch above the observed local `v0.46.0` tag, under the declared patch
classification. Cold-start measurements show the released baseline and the
last acceptance snapshot for every role beside the existing ceiling. Fresh Claude
Explore and Copilot task workers received their refusals paragraph only through the skill,
so the order's completeness fallback retains that paragraph in every skill.
Skeleton `0.39.1` carries the order's declared edition duty; its consumer pin
follows it. The reviewed rules, ceilings and acceptance route retain their
existing behavior. Independent verification, final review and publication
remain separate lifecycle actions.

**WO-154 activation completion (2026-09-24):** assigned application `v0.46.0`,
the next minor above the observed local `v0.45.0` tag, under the declared minor
classification. A new feedback evidence edition (schema 2) commits its verifier
stream with every judged file body replaced by a Git blob reference that
`feedback-evidence --check` rebuilds byte for byte, and records a behavioral
identity over the judged files with component release labels normalized plus a
pins record; staleness and the live self-host episode follow the behavioral
identity and the regenerated report, a pins-only change keeps or carries the
live audit without a new episode, and a judged change still cannot inherit an
older one. Existing editions and receipts keep their bytes; the refutation
receipt subject is split to its own order. The VER-001 repair moves
`@dotln/compiler` to 0.18.0. A program or capsule recorded under an earlier
compiler release now replays when nothing else differs, so a compiler bump
carries the audit deterministically instead of paying a live episode. That
change settles the compatibility question WO-050 and WO-133 left open.
Independent verification, final review and publication remain separate
lifecycle actions.

**WO-153 activation completion (2026-09-24):** assigned application `v0.45.1`,
the next patch above the observed local `v0.45.0` tag, under the declared patch
classification. A Codex lifecycle dispatch whose harness session cannot begin
now names the cause in one stderr advisory ending `process cost remains
unknown; cause no-session`, and still prints its briefing and exits 0, so an
allocated report path is never withheld after the control log has recorded the
transition. On repair (VER-001, operator scope expansion WO-153-D006), a
session begin whose entry observation fails withdraws the record it wrote, so
the advisory's `no-session` agrees with the usage readback and both the next
dispatch and `harness begin` can retry. Skeleton `0.38.1` carries that runtime
change and the console's exact dependency pin follows it; compatibility impact:
bug fix only. No hook, gate, schema, role text, counter format or external
dependency changes. Independent verification, final review and publication
remain separate lifecycle actions.

**WO-157 activation completion (2026-09-22):** assigned application `v0.45.0`
under the order's minor classification, the next minor above the observed local
and remote `v0.44.0` tag. One operator-authorized order fixes the fifteen
defects the orders closed on 2026-09-22 boarded up: `worktree integrate`
refuses intent-to-add entries before any write and leaves no stranded receipt;
a `retarget` queue action links a deferral to its public follow-up, also at
final review; the source-change host counts committed paths against the
envelope's `files` and refuses a removal or type change except a declared Sort
move; target publication pushes with hooks disabled; the skeleton admits a
grant-bearing artifact identity; `resident-bind` binds a declared portfolio
under its repository's registered profile, checks hand-written stores against
it, and defaults always-on judges per transport; a refused live episode keeps
its typed reason; the Entropy Reducer's witness and refutation receipt say what
they observe; Claude Code attestations read `CLAUDE_EFFORT`; the evidence
inventories follow the import graph; a document-gate row owes registrations;
allocation events fold across section changes; and the gate-sandbox teardown
is deterministic with a run-tagged abandoned-root check. Skeleton `0.38.0`
carries the runtime changes; the console's exact dependency pin follows it.
Compiler, kernel, semantic hashing and the external dependency set are
unchanged and no package is added. Compatibility impact: behaviour-changing
for a source-change writer that removes a path (now refused unless it is a
declared Sort move), for a Claude Code completion that attests `unknown` or a
readback source the session contradicts, and for a refutation receipt, which
no longer records a worker statement; additive elsewhere — existing resident
stores, allocation events without a section digest, filed Entropy Reducer
receipts and binding records keep their bytes and meaning. Publication remains
a separate dispatch.

**WO-100 activation completion (2026-09-22):** assigned application `v0.43.0`
under the order's minor classification, the next minor above the observed
local `v0.42.0` tag. A preauthorized portfolio becomes reviewed configuration
(`portfolios` in `dotln.config.json`) and a resident binding admitted under the
compiled floor; `deriveWorkOrders` turns WO-119 candidates into bounded orders,
product suggestions, human questions or deferrals; and a `portfolio` actor
activates one order with a `host-policy` grant, materializes it through WO-120,
changes source through WO-052 and advances the presence curve only after WO-054
verifies it. Skeleton `0.37.0` adds the contract, the actor kind, the host
composition and two resident event types under schema 1; the console's exact
dependency pin follows it. Compiler, kernel, semantic hashing and the external
dependency set are unchanged and no package is added. Under the operator's
scope expansion (WO-100-D007) the Entropy Reducer's compiled reviewer moves
from `claude-fable-5-1` at `max` to `claude-opus-5-5` at `xhigh` (Seisō v2, a new
semantic hash; filed receipts keep theirs), and the entropy and
planning-refutation commands default Codex to `gpt-6-sol` at `xhigh`.
Compatibility impact: the portfolio is additive — an absent `portfolios`
section and a resident without a `portfolio` binding behave byte for byte as
before, and existing resident logs replay unchanged; the default reviewer and
refuter models change, and an explicit `--model`/`--effort` still selects any
other. Publication remains a separate dispatch.

**WO-100 collision retiming (2026-09-22):** unpublished target `v0.43.0` is superseded by `v0.44.0` under the existing minor classification because the observed release baseline is `v0.43.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-151 activation completion (2026-09-22):** assigned application `v0.42.0`
under the order's minor classification, the next minor above the observed
local `v0.41.1` tag this final review integrated. The Entropy Reducer's
dispatch becomes a command family (`npm run entropy`) with an append-only
control log, numbered immutable receipts and operator dispositions that land
accepted findings in the follow-up register. Skeleton `0.36.0` adds the
`entropy-review` and `entropy-refutation` request kinds, their closed result
contracts and the fixture transport; the console's exact dependency pin follows it. The compiled
loadout, its residue, actor pin, authority envelope and Program are unchanged
and its semantic hash is unmoved, so no compiler, kernel or schema change
follows; `Program.All` remains deferred. Compatibility impact: additive only —
every existing transport request shape, argv and result contract keeps its
bytes. Publication remains a separate dispatch.

**WO-120 activation completion (2026-09-22):** assigned application `v0.41.0`
under the order's minor classification, the next minor above the observed
local `v0.40.3` tag that this final review integrated.
Skeleton `0.35.0` adds draft intent filing and the derived-order runtime status
projection; the console's exact dependency pin follows it. Compiler, kernel,
compiler semantic hashing and external dependency sets are unchanged. The
allocation event extends the document control plane; it does not change the
kernel event envelope. Publication remains a separate dispatch.

**WO-063 activation completion (2026-09-22):** assigned application `v0.40.3`,
the next patch above the observed local `v0.40.2` tag, under the declared patch
classification; the outward-artifact lint, public vocabulary, fixtures and
documentation change no runtime component, dependency, schema or publication
control, and independent verification, final review and publication remain
separate lifecycle actions.

**WO-149 activation completion (2026-09-21):** assigned application `v0.40.2`,
the next patch above the observed local annotated `v0.40.1` tag, under the
declared patch classification. Codex lifecycle dispatches begin their harness
session from the thread identity and dispatch role before usage is read; the
skeleton moves to `0.34.2` and the console's exact pin follows it. No compiler,
kernel, schema, counter format, hook, gate or third-party dependency changes.
Independent verification, final review and publication remain separate
lifecycle actions.

**WO-147 activation completion (2026-09-21):** assigned application `v0.39.1`,
the next patch above the observed local annotated `v0.39.0` tag, under the
declared patch classification. The worker-store acquisition path, its resident
fixtures and their pause-point peer change; skeleton moves to `0.34.1` and the
console's exact pin follows it. No kernel, compiler, event, envelope, schema,
predicate, guard record or third-party dependency changes. Independent
verification, final review and publication remain separate lifecycle actions.

**WO-147 collision retiming (2026-09-21):** unpublished target `v0.39.1` is superseded by `v0.40.1` under the existing patch classification because the observed release baseline is `v0.40.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-150 activation completion (2026-09-21):** assigned application `v0.39.0`,
the next minor above the observed local annotated `v0.38.1` tag, under the
declared minor classification. The compiled Contributor loadout equips the
executor's `tinkerer-economy` support by default, with the per-order opt-out
switch retained, so the generated executor role text and the regenerated
bundle change; the skeleton moves to `0.34.0` and the console pin follows it.
No kernel, compiler, schema, gate, hook or authority change, and the support's
own paragraph is unchanged. Independent verification, final review and
publication remain separate lifecycle actions.

**WO-138 activation completion (2026-09-21):** assigned application `v0.38.1`
under the declared patch classification above the observed local `v0.38.0`
tag. The release is evidence-only: the qualification probe, deterministic
tests, retained episode records and catalog write-backs change no component
version, dependency, runtime authority or publication control. Independent
verification, main integration, final review and publication remain separate.

**WO-071 activation completion (2026-09-21):** application `v0.38.0` is the
next minor above the observed local annotated `v0.37.2` baseline. The control
plane adds registered target identity and immutable base revision to work-order
activation, validates the committed repository profile, and compiles its
authority through the existing monotone floor. Component versions and
third-party dependencies are unchanged; verification, final review and
publication remain separate lifecycle actions.

**WO-069 collision retiming (2026-09-21):** unpublished target `v0.37.1` is superseded by `v0.37.2` under the existing patch classification because the observed release baseline is `v0.37.1`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-079 activation completion (2026-09-20):** Assigned `v0.37.1` under
the existing patch classification above the observed `v0.37.0` release.
The worktree integration helper and reviewer instruction are compatible
control-plane additions; skeleton advances to `0.33.1`. Other component
versions and third-party dependencies are unchanged.

**WO-099 collision retiming (2026-09-20):** unpublished target `v0.36.0` is superseded by `v0.37.0` under the existing minor classification because the observed release baseline is `v0.36.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-110 collision retiming (2026-09-20):** unpublished target `v0.35.1` is superseded by `v0.36.0` under the existing minor classification because the observed release baseline is `v0.35.1`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-090 activation completion (2026-09-20):** assigned application `v0.35.1`
under the declared patch classification above local `v0.35.0`. Documentation
relocation with a measurement: product 07 keeps the executor's operating
contract, its Codex sandbox-approval paragraph and §Model-specific notes leave
with pointers to `docs/AI-HARNESS-SECURITY.md` and the playbook, and the
[WO-090 evidence](../evidence/WO-090/README.md) records the per-role
directed-load totals before and after by WO-039's method. Compiler `0.17.0`,
skeleton `0.31.0`, kernel `0.6.0` and console `0.1.7` are unchanged; no
runtime source, dependency, schema or publication authority changes.

**WO-146 collision retiming (2026-09-20):** unpublished target `v0.34.0` is superseded by `v0.35.0` under the existing minor classification because the observed release baseline is `v0.34.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-146 release preparation (2026-09-20):** this source stages application
`v0.35.0` under the declared minor classification above fetched `v0.34.0`.
Compiler `0.17.0` additively admits the observed Copilot profile; skeleton
`0.31.0` adds its input adapters, selected-session readback and shared contributor
profile. Kernel `0.6.0` and console `0.1.7` behavior are unchanged; internal
dependency pins follow the changed packages. The two resident-worker profiles
remain unchanged except their skeleton release metadata, under the operator's
bounded criterion-4 authorization in
[WO-146-D009](../evidence/WO-146/decisions.md#wo-146-d009---allow-only-the-worker-profiles-release-version-metadata-to-follow-the-required-component-bump).
Bare-session qualification is pending; no new dependency, publication authority
or capability level is claimed.

**WO-145 activation completion (2026-09-20):** assigned application `v0.34.0`
under its minor classification above local `v0.33.2`. Skeleton `0.30.0` adds
the optional, default-off economy experiment support through the existing
Contributor switches; repository scripts validate experiment decisions.
Compiler `0.16.0`, kernel `0.6.0` and console `0.1.7` retain their versions;
the console dependency pin follows skeleton. No new dependency or publication
authority is added. The [trial decisions](../evidence/WO-145/decisions.md)
record the first result, later trials WO-110 and WO-099, and the reopening rule.

**WO-056 activation completion (2026-09-20):** assigned application `v0.33.2`
under the declared patch classification above local `v0.33.1`. The order was
an evidence record until the operator's 2026-09-20 scope expansion added two
runtime repairs its live attempts found. Skeleton `0.29.2` states the existing
finding contract to the verifier, in its output instructions and result
schema, and launches the Codex verifier in the files-only snapshot mount;
admission and derivation rules, the finding shape and the event schema are
unchanged. Kernel `0.6.0`, compiler `0.16.0` and console `0.1.7` are unchanged;
the console pin follows skeleton. No dependency or publication authority is
added. The [live receipts](../evidence/WO-056/README.md) and
[executor decisions](../evidence/WO-056/decisions.md) record six attempts, the
two defects, the integration of `main` at `37a729ca` during execution and the
reopening conditions.

**WO-140 activation completion (2026-09-19):** assigned application `v0.33.1`
under the declared patch classification above local `v0.33.0`. Skeleton
`0.29.1` rejects a partial gate row under any identity and prints the session
id and usage command in the dispatch briefing; the test runner's sandbox
preflight, the receipt cost-line check and the role text live in repository
scripts and generated skills. Kernel `0.6.0`, compiler `0.16.0` and console
`0.1.7` are unchanged; the console pin follows skeleton. No dependency or
publication authority is added. The
[executor decisions](../evidence/WO-140/decisions.md) record the markers, the
one declared suite and their reopening conditions.

**WO-144 activation completion (2026-09-19):** assigned application `v0.33.0`
under the standing minor classification above local `v0.32.1`. Compiler
`0.16.0` adds declared roots bound to admitted authority grants; skeleton
`0.29.0` checks known outside-write destinations in generated contributor
hooks. Kernel and console behavior are unchanged; console dependency pins
follow the changed components. No dependency or publication authority is added.
The [executor decisions](../evidence/WO-144/decisions.md) record the inventory
limits, root defaults and reopening conditions.

**WO-143 activation completion (2026-09-19):** this source prepares `v0.32.1`
under the existing patch classification above the observed local `v0.32.0` tag.
Skeleton `0.28.1` makes resident lock recovery restartable after acquisition
crashes; kernel `0.6.0`, compiler `0.15.0` and console `0.1.7` stay unchanged.
Independent verification, final review and publication remain separate.

**WO-142 activation completion (2026-09-19):** this source prepares `v0.32.0` under the order's minor classification, against the observed local `v0.31.1` release. Kernel `0.6.0`, compiler `0.15.0` and skeleton `0.28.0` narrow the named invalid inputs; console `0.1.7` preserves healthy loadout projections and their diagnostics. Publication remains a later release-close action.

**WO-084 activation completion (2026-09-19):** application `v0.31.2` stages
ledger ordering, the separate Resolutions surface, and a generated index with
a document-suite check above the observed local `v0.31.1` tag. This is a patch
with no component source, component version, dependency or publication-control
change. Independent verification and final review remain separate.

**WO-137 activation completion (2026-09-18):** application `v0.30.1` stages
the local runner discovery packet and bounded probe clients under the declared
patch classification above local `v0.30.0`. No component source or package
version changes. Live protocol success and the operator-expanded two-minute
load observation do not promote model quality, sandbox qualification or a
capability level. Verification and final review remain separate.

**WO-137 collision retiming (2026-09-19):** unpublished target `v0.30.1` is superseded by `v0.31.1` under the existing patch classification because the observed release baseline is `v0.31.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-055 activation completion (2026-09-18):** application `v0.31.0` and
skeleton `0.27.0` stage bounded source-writing repair and complete-contract
re-verification, with persisted executable continuations and a default limit
of two rounds. This additive minor changes no dependency, compiler/kernel/
console version, event envelope schema or publication control. Evidence uses
fixture workers over real scratch repositories; the live loop remains WO-056.

**WO-054 activation completion (2026-09-18):** application `v0.30.0`, compiler
`0.14.0` and skeleton `0.26.0` stage the additive worktree verification profile
with the Codex contributor continuation adapter. `verification-v1` admits optional snapshot
metadata and host-run test witnesses; legacy profile fields and matrix rules
retain their semantics. Kernel, console, dependency sets and publication
controls are unchanged. Live verifier and source-writing repair episodes remain
separate orders.

**WO-139 activation completion (2026-09-18):** application `v0.29.5`, compiler
`0.13.2` and skeleton `0.25.4` stage the observable subagent admission cap and
the operator-expanded planning-continuation repair above local `v0.29.4`.
This patch adds one hook refusal with explicit coverage limits and a typed
execution-amendment record in the existing planning log. Existing receipts,
hold semantics and package publication controls remain intact; no dependency
is added. Independent verification and final review remain separate.

**WO-135 activation completion (2026-09-17):** application `v0.29.3`, compiler
`0.13.1` and skeleton `0.25.2` stage the planning-gate corrections above the
observed local `v0.29.2` tag. This patch preserves receipt and public contract
identity; only planning admission, topology checks and classified planning write
refusals change. Publication and independent review remain separate.

**WO-135 collision retiming (2026-09-18):** unpublished target `v0.29.3` is superseded by `v0.29.4` under the existing patch classification because the observed release baseline is `v0.29.3`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-053 activation completion (2026-09-17):** application `v0.29.3` and
skeleton `0.25.2` stage the first live external source change and the bounded
writer repairs it exposed. Claude now submits its native schema result through
the target guard; Codex receives explicit bounded inspection instructions.
Kernel, compiler and console versions, event schemas and dependency sets stay
unchanged. The operator's scope override keeps these repairs in this order;
atomic work orders remain the default.

**WO-053 collision retiming (2026-09-17):** unpublished target `v0.29.2` is superseded by `v0.29.3` under the existing patch classification because the observed release baseline is `v0.29.2`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-136 activation completion (2026-09-17):** the authority-boundary research
probe stages application `v0.29.1`, the next patch above the observed local
`v0.29.0` tag. Package versions, runtime behavior, installed harness settings
and compiled bundles stay fixed. This assignment completes the activation's
version placeholder; live measurements and the planning mode decision remain
distinct from release preparation.

**WO-136 collision retiming (2026-09-17):** unpublished target `v0.29.1` is superseded by `v0.29.2` under the existing patch classification because the observed release baseline is `v0.29.1`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-141 activation completion (2026-09-17):** application `v0.29.1` and
skeleton `0.25.1` stage the observed-facts display, nonblocking lexical advisory
and journal-derived correction meter above locally observed `v0.29.0`.
This is a patch to the existing evidence behavior; kernel, compiler, console,
public event schemas and permission boundaries are unchanged.

**WO-052 activation completion (2026-09-17):** source-change host stages application `v0.28.0` and skeleton `0.24.0` under its minor classification. It adds commit-identity recovery and one reactor slice; kernel/compiler versions, event schema and hash preimages remain unchanged. Live writing and remote publication remain separate orders.

**WO-122 activation completion (2026-09-17):** application `v0.28.0` and
skeleton `0.24.0` stage the CLI worker and durable human handoff actors above
the observed local release baseline `v0.27.0`. Kernel, compiler and console
versions are unchanged. Launch claims do not grant authority or constitute
independent verification. Publication remains a separate reviewed action.

**WO-122 collision retiming (2026-09-17):** unpublished target `v0.28.0` is superseded by `v0.29.0` under the existing minor classification because the observed release baseline is `v0.28.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-122 component integration (2026-09-17):** skeleton `0.24.0` was valid at verification and then published by WO-052. Final review retimes the additive component to `0.25.0`; compiler, kernel and console remain unchanged. See WO-122-D005 for the integration evidence and reopening condition.

**WO-121 activation completion (2026-09-16):** application `v0.26.0` stages
the next minor above locally observed `v0.25.0`. Compiler `0.13.0` adds optional
human-idle policy data and generated heartbeat hooks; skeleton `0.23.0` adds
origin observations, actor deadline tracking and episode stamps. Kernel and
console versions, authority rules and publication controls remain unchanged.
Verification and final review remain separate dispatches.

**WO-121 collision retiming (2026-09-17):** unpublished target `v0.26.0` is superseded by `v0.27.0` under the existing minor classification because the observed release baseline is `v0.26.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-119 activation completion (2026-09-16):** application `v0.26.0` and
skeleton `0.22.0` stage the executable discovery producer and optional typed
script result. The observed local release baseline is `v0.25.0`; kernel,
compiler and console behavior and versions are unchanged. Candidate generation
adds observation, not work derivation or repair authority.

**WO-049 activation completion (2026-09-16):** application `v0.24.0` is the
next minor above the observed local `v0.23.0`. Compiler `0.12.0` adds the
optional target-worker harness profile and absolute runtime import root;
skeleton `0.20.0` adds target guard execution and off-target state. Existing
Contributor behavior, unit predicates, envelope semantics, kernel and console
versions remain unchanged. The operator approved required pin/version/hash
updates while retaining Contributor behavior and relative imports. At repair
the skeleton was retimed to `0.21.0` because WO-051 published `0.20.0` with
`v0.24.0`; compiler `0.12.0` is unchanged
([WO-049-D007](../evidence/WO-049/decisions.md#wo-049-d007)).

**WO-049 collision retiming (2026-09-16):** unpublished target `v0.24.0` is superseded by `v0.25.0` under the existing minor classification because the observed release baseline is `v0.24.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-050 activation completion (2026-09-16):** application `v0.21.2` and
skeleton `0.18.2` stage the structural state-slice patch. The public Decision
shape, event schemas, semantic hashes, compiler and kernel versions stay
unchanged. Internal typed folds reserve the source-change seam for WO-052.

**WO-048 activation completion (2026-09-15):** application `v0.21.1` and
skeleton `0.18.1` stage positive decoding before worker/verification recovery
effects. Kernel/compiler versions, persisted contracts and hash rules remain
unchanged; malformed stores preserve their bytes for inspection. Retimed from
the staged `v0.20.1`/`0.17.1` during final-review integration after WO-046
published `v0.21.0`/`0.18.0`; the recorded patch classification and declared
compatibility impact are unchanged.

**WO-046 activation completion (2026-09-15):** application `v0.21.0` stages the executable Program type and typed continuation decoder; kernel `0.4.0` and skeleton `0.18.0` carry the API and persisted-input boundary changes. The full authoring grammar, event schema and semantic/artifact identities are unchanged.

**WO-067 activation completion (2026-09-15):** application `v0.19.0` is the
next minor above the observed local annotated `v0.18.0`. The activation had
retained its version placeholder; this completes its declared minor assignment.
Compiler `0.11.0` adds optional compiled presence policies and their editable
views. Kernel, skeleton and console source versions remain fixed; the skeleton
compiler dependency pin follows the new compiler package. Resident scheduling
remains WO-068. See [WO-067 decisions](../evidence/WO-067/decisions.md).

**WO-045 activation completion (2026-09-15):** application `v0.20.0` is the
next minor above published `v0.19.0`. The activation staged `v0.19.0` above
local `v0.18.0`; WO-067 published that tag first, so the repair integrated it
and retimed this order (D004). Kernel `0.3.0` adds typed positive JSONL
decoding; skeleton `0.17.0` adds hook input decoding. Operator-authorized
generated-entry repair advances compiler to `0.11.1` above WO-067's `0.11.0`.
Schema and compiler contracts and hash preimages remain unchanged; no
historical log migration. See [WO-045 decisions](../evidence/WO-045/decisions.md).

**Current contract (WO-132, 2026-09-15).** Lifecycle completions record their
reports without requiring a product gate. The final reviewer runs
`npm test -- --review` once; PR publication and release close consume its
committed success row by code identity, with reviewed and merged trees recorded
separately. Close publishes without suites or installation and attempts cleanup
afterwards. Version/effort discovery and process-cost observations are advisory.
The dated activation records below retain their original versions and evidence;
WO-132 supersedes their repeated exact-tree gates, suite-cache and version-floor
requirements without rewriting that history.

**WO-129 activation completion (2026-09-13):** application `v0.17.4` is the
next patch above local annotated `v0.17.3`. Skeleton `0.15.4` repairs transport
version admission and protects the shared suite cache. Minimum CLI versions
are Claude Code `2.1.270` and Codex `0.154.0`, with newer versions admitted.
Compiler, kernel and console remain unchanged. Suite-success records advance
to version 3 without migration; the exact-tree aggregate and lifecycle evidence
contract remain fixed. See [WO-129 decisions](../evidence/WO-129/decisions.md).

**WO-128 activation completion (2026-09-12):** application `v0.17.3` is the
next patch above the observed local annotated `v0.17.2` baseline. Skeleton
`0.15.3` adds bounded gate-deadline observation; console `0.1.5` derives its
collector bound from the declared scheduler load. Compiler and kernel remain
unchanged. The gate retains its required suites, exact-tree evidence and
publication controls. The [decision receipt](../evidence/WO-128/decisions.md)
records the classification and its measurement conditions.

**WO-125 activation completion (2026-09-11):** application `v0.17.2` is the next patch above the observed local annotated `v0.17.1` baseline. Skeleton `0.15.2` accepts observed explicit Codex effort overrides while preserving the `unknown` launch, isolation and existing contracts. Compiler, kernel and console versions stay fixed. The [decision receipt](../evidence/WO-125/decisions.md) records the evidence and reopening conditions.

**WO-043 activation completion (2026-09-11):** application `v0.17.1` is the next patch above the observed local annotated `v0.17.0` baseline. Typed dependency declarations, their shared projection and activation refusal change control-plane scripts and documentation only. Component versions stay fixed. The [decision receipt](../evidence/WO-043/decisions.md) records the assignment; publication remains a separate dispatch.

**WO-126 activation completion (2026-09-09):** application `v0.17.0` is the next minor above the observed local `v0.16.0` baseline, under WO-126's declared classification and the standing opt-out default. Compiler and skeleton changes receive their own minor versions; the kernel and verification contracts stay fixed. Publication remains a separate dispatch.

**WO-042 activation completion and operator breakout (2026-09-08):** application `v0.16.0` is the next minor above the observed annotated `v0.15.0` baseline. Compiler `0.8.0` adds the monotone authority floor, registry-admitted grants, envelope-projected inspection and a declared role-procedure adapter under the existing contracts. Skeleton `0.14.0` adds five atomic executor supports and their equipment projection; console `0.1.2` repairs the default feedback-edition selection. The kernel stays fixed. Instance grant files live outside package `src/`. The [breakout receipt](../evidence/WO-042/ideation.md) records the planning-gate repair, queue and bounded adjacent fix. Verification, final review and publication remain separate.

**WO-032 activation assignment (2026-09-07):** the first actor-board slice targets application `v0.14.0`, the next minor above the observed annotated `v0.13.3` baseline. Its new console component is `0.1.0`; existing kernel, compiler and skeleton components retain their versions. Independent verification, final review, and publication remain separate. A sibling that consumes the same application target triggers the existing integration-retiming rule.

The sole `vX.Y.Z` in a current work-order heading is its planned **application
release**, not its work-order number, package version, schema version, or
conceptual insertion point. The operator's 2026-09-07 workflow correction authorizes
routine collision retiming of an unpublished target under its existing release
classification, with a dated migration note, through `release prepare`. It does
not authorize reclassification, a scope/acceptance change, or publication; those
retain their explicit authority and independent evidence requirements. A published
tag may not move. Begin source releases when a rung
produces a reproducible artifact that another build, saved configuration, or
compatibility rule can name. The first useful boundary was `v0.2.0`: after
WO-003 received passing final review, its PR was merged, and the exact merged
commit passed the full evidence gate, an annotated Git tag and immutable release
manifest were created. Never tag the feature branch or an unreviewed commit.

**WO-043 repair expansion (2026-09-11):** the operator's command-contract and
mandatory-token-measurement correction retains application target `v0.17.1`
and bumps skeleton to `0.15.1` and compiler to `0.9.1`. This patch repairs optional
usage collection and completion enforcement and adds explicit shared-role
projection for Process Cost and Goal Alignment. Lifecycle event and feedback
schemas stay fixed. Console `0.1.4` uses the shared current-evidence selection;
kernel remains fixed. The navigation section's
mixed candidate status remains `planned` after VER-001 F1. See the
[breakout receipt](../evidence/WO-043/ideation-commands-and-usage.md).

### 2026-08-31 forward retiming

WO-004 through WO-011 were drafted before `v0.2.0` was published. Three belated
foundation tasks were inserted at conceptual pre-release positions
`v0.0.2`–`v0.0.4`, and WO-007 was called `v0.2.1`; those planning labels then
looked like backwards application releases when the work orders were executed
numerically. Current and pending plans are retimed onto one monotonic
application sequence:

| Work order / milestone                         | Superseded planning label | Application release target |
| ---------------------------------------------- | ------------------------: | -------------------------: |
| WO-004 — environment and lifecycle corrections |                  `v0.0.2` |                   `v0.2.1` |
| WO-005 — capability evidence table             |                  `v0.0.3` |                   `v0.2.2` |
| WO-006 — documentation-publication bootstrap   |                  `v0.0.4` |                   `v0.2.3` |
| WO-007 — audit-record baseline                 |                  `v0.2.1` |                   `v0.3.0` |
| WO-008 — composition compiler                  |                  `v0.3.0` |                   `v0.4.0` |
| WO-009 — real disposable worker                |                  `v0.4.0` |                   `v0.5.0` |
| WO-010 — independent verification              |                  `v0.5.0` |                   `v0.6.0` |
| WO-011 — feedback compiler                     |                  `v0.6.0` |                   `v0.7.0` |
| projections and console                        |                  `v0.7.0` |                   `v0.8.0` |
| pattern workshop                               |                  `v0.8.0` |                   `v0.9.0` |
| source-to-deliverable vertical                 |                  `v0.9.0` |                  `v0.10.0` |

This is a forward-only planning correction. The `v0.2.0` tag, its manifest,
immutable verification/final-review reports, component versions, schema
versions, and earlier ledger entries remain historical truth. The `v0.2.x`
maintenance line is intentionally narrow: WO-004 corrects evidence and lifecycle
behavior, WO-005 inventories existing evidence, and WO-006 proves a
documentation-publication loop without extending the exported application
runtime. If execution expands one of those scopes into public runtime
capability, its release target must be reclassified before implementation.

### 2026-09-04 forward retiming — WO-023 occupies v0.5.0

The operator's `resume: next` activation placed WO-023 on published `v0.4.1`
and assigned it `v0.5.0`, satisfying the earlier recorded reversal condition
for another forward retiming. This note supersedes only the still-unpublished
targets at and above the former `v0.5.0`; published tags and the accepted build
order do not move.

| Work order / milestone            | Superseded target | Current application release target |
| --------------------------------- | ----------------: | ---------------------------------: |
| WO-023 — compiled Entropy Reducer |        unassigned |                           `v0.5.0` |
| WO-029 — pinned artifact identity |        unassigned |        unassigned until activation |
| WO-009 — real disposable worker   |          `v0.5.0` |        unassigned until activation |
| WO-010 — independent verification |          `v0.6.0` |        unassigned until activation |
| WO-011 — feedback compiler        |          `v0.7.0` |        unassigned until activation |
| projections and console           |          `v0.8.0` |        unassigned until activation |
| pattern workshop                  |          `v0.9.0` |        unassigned until activation |
| source-to-deliverable vertical    |         `v0.10.0` |        unassigned until activation |

Filing WO-029 assigns neither a version nor a queue position. The recommended
dependency placement remains immediately before WO-009, whenever the active
slot reaches that worker boundary. Each unassigned rung receives a compatible
version and synchronized work-order heading only through its own explicit
activation; no arithmetic shift is inferred here.

**WO-029 activation completion (2026-09-05):** its control activation omitted a target. The executor completes the standing opt-out release assignment at `v0.9.0`, a minor addition above published `v0.8.0` (`961601a`). Compiler package `0.3.0` and skeleton package `0.8.0` move independently; the kernel and existing semantic-hash preimage do not. The earlier table remains a dated retiming record, and WO-009 still receives its own release assignment at activation. This source prepares the pin/compare receipt; independent verification, final review, merge, and release publication remain separate lifecycle evidence.

**WO-009 activation completion (2026-09-05):** its omitted target is assigned `v0.10.0`, a minor addition above published `v0.9.0` (`002593f`). Skeleton source advances to component `0.9.0`; compiler `0.3.0`, kernel `0.2.1`, and the event/compiled-program schema axes remain unchanged. The earlier retiming table is historical. The source worktree prepares disposable fixture-inspection workers and their durable host; independent verification and publication remain separate lifecycle evidence.

**WO-031 activation completion (2026-09-05):** its omitted target is assigned
`v0.10.1`, a patch above published `v0.10.0` (`272a150`). It adds the repository's
read-only actor-usage projection and optional opaque account labels; exported
runtime capabilities and component versions remain unchanged. The source claim
prepares this release; review and publication remain separate evidence.

**WO-022 activation completion (2026-09-06):** the omitted release target is
assigned `v0.11.0`, a minor addition above published `v0.10.1`. The bounded
sparse probe represents and emits the entire v3 maximum, and fixture keys are
created outside every repository. Compiler `0.4.0` adds the three perception
supports; skeleton `0.10.0` adds mounted/guarded sensing and weak keyed v3
projection. Kernel `0.2.1`, the compiled-program contract and event-envelope
schema remain unchanged. The deterministic mounted verifier demonstrates
blinding; native model verification remains WO-010. Review and publication
remain separate lifecycle evidence.

**WO-108 activation completion (2026-09-06):** the omitted target is assigned
`v0.13.1`, an internal tooling/evidence patch above published `v0.13.0`
(`3dc19b7`), under the operator's dated scope amendment in the work order. It
adds the offline mutation-evidence runner with its pinned census, selected
campaign, append-only kill matrix, and survivor findings under
`corpus/mutation/`, plus root test wiring for the runner's self-tests. Exported
runtime capabilities, component versions, dependency declarations, and schemas
remain unchanged. The source claim prepares this release; independent
verification, final review, and publication remain separate lifecycle evidence.

**WO-038 activation completion (2026-09-06):** its omitted target is assigned `v0.13.2`, a metadata and publication-guard patch above origin's published `v0.13.1` (`ed2070a`). The source implements the decided licenses in root/workspace metadata, pinned license-surface checks with npm refusal probes, and DCO contribution checks at branch publication. The [executor receipt](../evidence/WO-038/README.md) records the evidence and the WO-033 export-default handoff. The existing gate also requires refreshing the source-pinned feedback edition after these package metadata changes; the receipt records that refresh and a bounded automation nomination. No runtime source, component version, dependency, or schema changes; verification and publication remain separate lifecycle evidence.

**WO-041 activation completion (2026-09-07):** the omitted release target is
assigned `v0.13.2`, a control-plane patch above published `v0.13.1`. The source
adds the compiled plan refuter, receipt and override commands, and forward-only
planning gate. Skeleton component `0.12.1` carries the source changes; compiler
`0.6.0`, kernel `0.2.1`, lifecycle legality and event schema remain unchanged; planning overrides use their own append-only
control log. Independent verification, final review and publication remain
separate evidence.

**WO-041 collision retiming (2026-09-07):** unpublished target `v0.13.2` is superseded by `v0.13.3` under the existing patch classification because the observed release baseline is `v0.13.2`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-109 activation completion (2026-09-07):** the omitted target is completed at
`v0.13.3`, strictly below published `v0.14.0`, under the order's recorded
classification: internal research and documentation with an honest no-release
close. The source adds the re-mining practice record and its first pilot draw
under `docs/lineage/remining/`; no runtime source, component version,
dependency, or schema changes, and the README release block keeps naming
`v0.14.0`. Final review completed the assignment that activation omitted; the
reviewed notes ride the next tag that contains this work.

The manifest records the Git commit, application release, package/component
versions, supported schema and artifact ranges, transformation-set version (or
explicitly `none`), evidence commands/results, evaluable and deferred cadence
kinds, toolchain, and known limitations. A release may initially be source-only.
Publishing npm packages, executables, containers, or hosted artifacts is a
separate projection selected only when a consumer needs it; a Git tag must not
imply those channels exist.

Source visibility is not itself a distribution license. Before accepting an
outside contribution, publishing any package/binary/container/data or asset
bundle, or operating a multi-user service, the operator must pass the explicit
[licensing and legal decision gate](../LEGAL.md): select the applicable code and
documentation posture, protect unpublished packages, establish inbound terms,
inventory incorporated third-party material, review privacy/data practices
before any app or service collects, retains, or transmits another person's data,
review service terms before offering an app or hosted service to others, and
review commercial and brand posture before sale, licensing, fundraising,
material marketing, or substantial investment in a DotLn or feature-brand
name. The list in `docs/LEGAL.md` is controlling; sale is not the first trigger.
The license posture was decided on 2026-09-06 (Apache-2.0 code, CC BY 4.0
documentation; `docs/LEGAL.md` §Decision), and WO-038 implements the package
metadata and publication guard; the remaining gates stay open.

The hand-closed `v0.2.0` manifest and notes under `docs/releases/` remain their
immutable historical projection. For later releases, the annotated tag message
is the immutable location for both the canonical JSON manifest and layered
notes. The generator starts from `docs/releases/tag-manifest.template.json`; the
validator re-derives its fields from the tagged source, control state, installed
toolchain, and observed evidence before any tag ref is created. This order is
deliberate: **the tag names the reviewed merged commit, and its annotation
carries the record**. A tracked manifest committed after the tag would describe
a different commit; committing one before the tag would require guessing its own
commit identity.

Beginning with `v0.3.2`, every passing final review supplies a five-section
reviewed notes artifact, including for no-release work orders. Release close
assembles all notes merged since the preceding tag in first-parent order, labels
older work orders with a time-indexed commit-subject fallback, appends
manifest-derived evidence and compatibility, and keeps that edition in the
annotated tag. After the validated tag push, the same human layer is projected
as a GitHub Release; the projection never replaces the tag's immutable JSON
record and is recovered by rerunning close rather than silently edited.
Current final-review PR and release-note bodies are authored as renderer-wrapped
Markdown: one physical source line per prose paragraph or list-item paragraph,
with semantic Markdown boundaries retained. The publisher checks the committed
current package and transports it byte for byte; historical packages and tag
re-derivation remain unchanged.

Version ownership stays separated. Planning pins the application target in the
active work-order H1, execution updates the delimited README source claim, and
publish/close tooling checks both against tag truth. Execution must also move a
component package version whenever that component's `src/` differs from the
preceding release; the release preflight proves it from the previous tag
manifest. Schema, artifact, transformation, and other compatibility axes move
only under their own contract owners and are never inferred from an application
or component bump.

**Operator default (2026-09-04):** assign and update a release target as part of
ordinary work-order preparation unless the operator explicitly opts out. A
compatible control-plane, documentation, or evidence improvement takes the next
patch above the latest published release; new capability and breaking changes
follow the classification rules below. An activated order whose target was
omitted is completed under this default, with the classification and base
recorded, rather than asking the operator to opt in again. An already pinned
target still follows the retiming rule. This authorizes preparing the version
surfaces, not publishing a tag, Release, package, or branch without its existing
dispatch. WO-028 applies the default as `v0.5.1` above published `v0.5.0`.
WO-026 applies it as `v0.5.2` above published `v0.5.1`.
WO-020 assigns the next minor, `v0.6.0`, above published `v0.5.2`, with skeleton
component `0.6.0` and unchanged kernel/compiler versions. WO-030 assigns the
next minor, `v0.7.0`, above published `v0.6.0` (2026-09-05 planning pass); the
other horizon orders stay unassigned until their own activations.

Patch releases contain compatible corrections, documentation, and evidence
improvements; minor releases add backwards-compatible application capability;
breaking public contracts require the next major boundary even before 1.0 unless
an explicitly experimental surface says otherwise. Historical tags and manifests
are immutable. Never move a tag to make the past resemble the present; issue a
new patch release. Do not invent a retroactive `v0.1.0` tag unless its exact
reviewed commit and evidence can be reconstructed. Tag creation and remote
publication remain explicit operator actions.

**Release closeout after WO-132 (2026-09-15).** The separately authorized
post-merge task proves egress, fast-forwards main and validates release surfaces,
notes and the manifest. The reviewer's single `npm test -- --review` run supplies
a passing `npm test` row in committed final-review control history. PR publication
and close require the same code identity; the manifest records both the reviewed
tree and merged tree. Documentation, reports, generated projections and release
text do not invalidate that code key. Close builds missing runtime output, runs
no suite or dependency installation, and creates/pushes the annotated tag and
GitHub Release only with explicit publication authority. `resume: release close`
is that authority. The raw command without `--publish` prepares and validates;
validation may fetch the latest existing annotated tag ref locally when it is
missing, before choosing any close path. It
never pushes a tag or creates a GitHub Release without `--publish`.

Worktree finish and derived-worktree settlement follow publication as best effort.
They preserve protected intake and local material and report cleanup blockers
without failing the release. Tracked dirt, missing reviewer evidence, mismatched
code identity or invalid release surfaces still prevent publication. If a failure
occurs before tag creation, preserve the obligation and target; do not fabricate
evidence or tag. WO-012 and WO-015 remain historical examples of bounded patch
recovery. A general durable fix-in-place recovery workflow remains future work.
WO-132 supersedes their teardown-first, install-and-rerun release procedure;
the historical evidence remains unchanged.

An application target in a work-order heading that is strictly below the latest
release is a successful no-release closeout. The command reports remaining
in-flight orders and cleanup blockers rather than publishing backwards. An equal version is
idempotent only when the existing validated annotated tag names that exact
commit; any conflict refuses. An operator who deliberately defers an otherwise
eligible release records the reason in a reviewed durable artifact; absence of a
tag alone must not leave the milestone's publication state ambiguous.

Each published release also carries layered patch notes. Lead with the release's
visible payoff and a short explanation of why it matters; isolate breaking,
migration, compatibility, security, data-loss, authority, and operator-action
items where they cannot be missed; then group substantive changes by product
area. Collapse low-signal repetition into honest aggregate lines such as
progressive copy, fixture, diagnostic, or visual polish instead of narrating
every touched file. The aggregate must not conceal a behavioral, schema,
compatibility, safety, or recovery change. Link detailed evidence and manifests
for readers who need the full trace.

## Work-order navigation and identity (candidate)

The current control projection answers one narrow question: given a selected
work order and its independently folded phase, which lifecycle transitions are legal now?
It does not answer which backlog order should be activated after close. The
release ladder, hard dependency graph, adjacent evidence/corpus work, and
operator preference are distinct planning inputs and must not be collapsed into
the next integer.

Keep three answers visible:

1. **Workflow legal next:** the transition allowed for the selected order, such as
   verify, repair, or final review.
2. **Eligible now:** every candidate whose hard dependencies, activation
   prerequisites, authority, environment, and exclusive-resource constraints are
   satisfied.
3. **Recommended next:** the eligible choice selected by an explicit planning
   policy or by the operator, with the reason and alternatives retained.

Existing `WO-NNN` identifiers are stable, opaque references. They do not encode
priority, roadmap position, or family, and numeric gaps carry no meaning. The
completed/drafted WO-10x orders therefore remain addressable under their current
IDs; mainline work never has to “catch up,” and activated or historically cited
orders are not renumbered. Future grouping belongs in explicit metadata and
views. WO-120 reserves a configurable allocation pool (`WO-900`–`WO-999`
by default) for machine-filed identities inside this same family; it carries
no priority or product track. Existing authorities in the pool are skipped,
never renumbered or overwritten.

**Derived work (WO-120).** `WorkOrderIdentityAllocated` starts a per-order
control segment before the generated authority appears. It records the stable
public provenance key, assigned compiled `workOrderId`, contract snapshot and
authority path. A retry with the same key and input recovers that identity;
changed input under that key refuses. The index scans both configured authority
roots, retains correct relative links and distinguishes allocated drafts from
active work. Activation is the ordinary dependency-checked `resume activate`.
`dotln intent` files only a draft, with review placeholders where prose supplies
no executable contract. Generated files use stable sections and typed dependency
blocks; WO-113 still owns the broader historical-file migration.

The allocator reuses the inspected worker lock at the shared launchpad. Its
collision guarantee applies to callers using that launchpad, not independent
or disconnected checkouts. Allocation replay, two-process contention, range
exhaustion and a fixture resident restart are covered by
`scripts/test-derived-orders.mjs`. Automatic work derivation and UI filing
remain WO-100/WO-115 consumers of this interface.

A provisional planning row should be able to show:

`id | title | purpose/track | planning state | lifecycle evidence | hard dependencies | activation prerequisites | eligibility reason | recommended rank/reason | execution role | model/effort/environment constraints | affected surfaces | release relation`.

Lifecycle evidence remains derived from the control log, numbered verification
and final-review artifacts, merge evidence, and release/no-release records—not a
manually asserted `complete: true`. “Implemented,” “verified,” “final-reviewed,”
“merged,” and “released/no-release” are different boundaries. Likewise, worker
role is distinct from model, effort, harness, and required capabilities;
dependency is distinct from a preflight such as version assignment,
authentication, provisioned dependencies, or a quiet-machine window.

**2026-09-04 migration (WO-026):** the evidence view is adopted; the broader
metadata and scheduling design remains a candidate under this stable heading.
The pilot's repeated evidence drift is now
addressed by the [generated work-order index](../work-orders/README.md).
Work-order files retain their paths as durable addresses. The index observes
their headers, reduces every order through the shared control fold, and
attributes release inclusion from local annotated manifests, with the explicit
pre-manifest v0.2.0 record. It distinguishes all in-flight orders, open drafts,
control-closed orders, and time-indexed history. Closed means the applicable
passing final review, not independent proof of merge or remote publication.

The index is the evidence-state answer; the [human map](../planning/work-order-map.md)
keeps recommendation, rationale, tracks, and activation preflight.
**2026-09-11 typed dependency migration (WO-043):** a marked JSON array in
each open authority's leading metadata declares dependency relations and
one-line reasons. `scripts/lib/dependencies.mjs` supplies the same projection
to the index, selected `status --json`, and activation. Hard and
satisfied-by-close entries require closure with a passing final review;
satisfied-by-release requires a local annotated DotLn release in HEAD's
ancestry. A planning deferral waits for the named order's closure, or remains
unmet for a candidate label until replaced by a dated waiver. Historical
evidence, references, waivers and supersessions never block.

This computes the dependency part of **Eligible now**. Authority, environment,
exclusive resources and other activation prerequisites still need preflight;
the operator or planning policy supplies **Recommended next**. Closed and
historical authorities retain their bytes. Without a typed block, their
Depends on tokens are labeled **conservative token view; does not block**.
The [migration comparison](../evidence/WO-043/migration.json) preserves the
seed graph and prose comparison, including later supersession decisions.
The earlier [activation comparison](../planning/work-order-index-activation-2026-09-04.md)
remains a dated observation of the token view.

`npm run work-orders -- index` explicitly refreshes the generated view.
`index --check`, included in `npm run test:docs`, checks current headers/control against
the recorded tag-object snapshot; missing or changed recorded tags refuse, and
additional local release tags are reported as newer attribution evidence.
Typed release dependencies observe current local ancestry, so a referenced
tag becoming available or unreachable can stale their projection. The operator
selected this snapshot rule so tagging a reviewed commit does not invalidate
its own reproducible evidence. No command fetches tags. Refresh after lifecycle
transitions before running evidence; lifecycle helpers do not regenerate the
index. Standardized front matter, a separate registry, a scheduler, and automatic
recommendation remain unselected candidates.

**2026-09-04 usability correction (WO-020 ideation):** the operator's reading
task is to follow a proposed sequence and see progress, including in a plain
text editor. The README therefore leads with a short checklist sourced from
one marked recommendation block in the human map. It derives its check marks
from passing final review, labels the active phase, and puts full per-order
evidence below the first screen. The checked state is not proof of merge or
publication. Detailed dependency-token observations retain their conservative
label; the generator must not turn prose references into false hard blockers
or silently reorder the operator's recommendation. A missing or malformed
sequence block, duplicate IDs, or IDs without an authority refuse. An explicitly
empty block means no proposed sequence. No work-order ID, authority path, or
historical evidence moves.

### Candidate — whole or split work orders under one umbrella

**2026-09-05 operator ideation:** offer a split assessment for any work order.
Keep its outcome, scope, and acceptance criteria visible under one umbrella,
while proposing smaller, independently reviewable increments. The purpose is to
let one body of work produce several useful PRs without losing its shared
intent or evidence trail. A split is optional: an already atomic order may be
best left whole, and an arbitrary partition should not be recommended merely
to reach a requested number of children.

Before execution, the whole order and a proposed child plan are alternative
routes. Both can be available to choose; their execution is mutually exclusive.
Starting the whole route excludes its alternative children. Starting the first
child selects the split route and permanently excludes execution of that
original whole-order route, including after a child fails or is abandoned. The
parent remains addressable as the umbrella; its aggregate status must not claim
that the original whole-order implementation ran. Planning or previewing a split
alone does not select it.

Hierarchy and execution order answer different questions. Children may be
serial, parallel, or a mixture, according to explicit dependencies, shared
surfaces and resources, available actors, and capacity. For example, two
independent increments can proceed together and a third can wait for both.
Each child retains its own workflow and evidence; the umbrella maps its
acceptance criteria to those increments and exposes uncovered work. Child
review, integration, release, and completion of the umbrella remain separately
evidenced. A family of orders does not make all its work safe to run at once.
This extends the [budget-window ladders](#candidate--budget-window-work-order-ladders)
and the [UIFA showrunner's](13-uifa-roles.md#uifa-showrunner) planning view.

A useful suggestion explains the proposed acceptance boundaries, dependency
edges, expected review size, integration risks, and why the split helps. It may
recommend keeping the order intact, or a different number of increments.
Suggestions stay non-authoritative until selected under the applicable dispatch
policy. Smaller increments do not require changing this repository's current
commit or PR convention as part of the ideation.

Parent and child relationships belong in explicit metadata. A suffixed child
label is a possible display affordance; it does not replace the existing opaque
`WO-NNN` identity contract, renumber historical orders, or establish priority.
Planning still needs to define the exact route-selection event and its atomic
exclusion across worktrees, active/completed-order split requests, nested or
revised decompositions, failure/abandonment handling, aggregate closure, and
release attribution. Existing evidence remains immutable through those choices.
No child-ID grammar, lifecycle event, split command, scheduler, or automatic
suggestion mechanism is implemented by this candidate; WO-030's concurrent
control state is a foundation, not an implementation of splitting.

### Candidate — beacon usefulness checkpoint

WO-020's exact decoding, replay, metadata-only reading, and atomic emission
can establish the local mechanism. WO-021's lifecycle integration, audiences,
staleness, and group projection can establish a usable control-plane example.
Neither demonstrates that all of DotLn is viable or that Protíno's simulated
world is compelling. Technical feasibility, practical usefulness, and felt
interest are different questions with different evidence.

The [bounded comparison plan](../planning/beacon-usefulness-checkpoint.md)
nominates an operator trial after WO-021: answer the same work-state questions
with existing status projections and with Beacons, using normal, refused,
stale, absent, and conflicting-claim cases. Observe correctness and navigation
burden; record any measured cost with its method, and leave subjective value
to the operator's witnessed response. Retain, simplify, or defer further
investment based on that comparison. A passing codec test is not evidence of
delight, and an elaborate encoding is not justified merely by being possible.

This is a proposed product-learning checkpoint, not a newly imposed release
gate, a runtime telemetry requirement, or an expansion of WO-020/WO-021's
technical acceptance criteria. Real worker behavior arrives in WO-009,
independent real verification in WO-010, feedback in WO-011; a representative
end-to-end trial is still needed to judge the work-system thesis. Protíno
needs its own playable evidence slice at its separately selected horizon.

**2026-09-05 technical observation:** WO-021 now exercises the workflow and
records [bounded scan comparisons](../evidence/WO-021/README.md). Individual
metadata sweeps beat separate compact JSON records in the measured large warm
fixture, while a single JSON index stayed faster through four readers. A
single group metadata read is a different, phase-count-only query. These
results preserve useful read-path choices without claiming an operator trial,
lower token cost, or general scalability. State-selected function tables and
cached/shared observers remain design options; metadata scans have no
invisibility guarantee. The operator comparison above remains outstanding.

### Candidate — unattended work-order portfolio

The earlier operator-away scheduler was partly a workaround for supervising one
prompt-bound agent and arranging recurring maintenance timers by hand. Once the
work-order processor can close one order and select another, unattended
autonomy should operate primarily over bounded WorkOrders rather than recreate a
permanent prompt session.

An opted-in portfolio has two candidate lanes. First are small eligible orders
already covered by standing authority and requiring no new material decision;
housekeeping often fits because it can reduce return-time reorientation. Second
is a bounded set of larger-authority orders the operator explicitly
preauthorizes before leaving. Those are options, not a promised sequence:
“capacity permitting” is implicit unless an order is marked required, and
dependencies, source revision, environment, budget, active window, verifier
capacity, and the selected planning policy still participate in activation.

Operator silence alone does not create the portfolio. A versioned policy says
whether an away event or lack of new ordering activates it, which planning
strategy ranks it, how many slots it owns, and what return, pause, expiry,
failure, or budget event stops, resets, or replenishes it. Selection does not
grant authority; a larger order's grant comes from its recorded
preauthorization or standing regime. A return view distinguishes completed,
active, skipped, blocked, and still-optional work and foregrounds material
changes and unresolved decisions.

The current one-slot resume protocol remains manual and authoritative. No
automatic allocator, approval phrase, queue schema, or concurrency model is
selected by this candidate.

**Allocated to WO-100 (2026-09-22).** The preauthorized lane now exists at
resident scale. A portfolio declared under `portfolios` in `dotln.config.json`
names the compiled 5S mechanics, repository surfaces, an effect and file
ceiling per presence phase, a budget of episodes, wall time and reported
tokens, and per-kind verification commands. The resident derives one bounded
order per WO-119 candidate, records its activation with a `host-policy` grant,
materializes it through WO-120 into the ordinary index, and advances its
presence curve only after WO-052 changes it and WO-054 passes the portfolio's
named verification commands (a Sort move is also checked by the host); out-of-portfolio
candidates become product suggestions or `NeedsHuman`, and a spent budget is a
reasoned NoOp ([WO-100 decisions](../evidence/WO-100/decisions.md)). Still
candidate here: activation policy beyond the compiled presence curve, slots and
ranking across orders, replenishment, retry and the return view. The live
unattended hour is WO-111; the first lane (small orders under standing
authority) is not implemented.

**Always-on agent model default (shipped by WO-157 on 2026-09-22, operator
direction).** A resident bound without `--model` or `--effort` takes its
transport's default: `gpt-6-luna` for `codex-cli-exec` and the latest Claude
Sonnet for `claude-cli-print`, recorded as the id the CLI reports
(`claude-sonnet-5` until Sonnet 5.5 is available), both at `xhigh`. The
binding record's `modelSource` and `effortSource` say `default` or
`operator`, so a receipt can tell a default from a choice
([WO-100-D007](../evidence/WO-100/decisions.md#wo-100-d007);
[WO-157 decisions](../evidence/WO-157/decisions.md)). Portfolio execution
hosts are bound in process by their caller and take no default from this
command. Reopen when Claude Sonnet 5.5 is available (the Claude default moves
to it), a default model is withdrawn, or the operator changes a role default.
External calls that name a model today use Opus 5.5 `xhigh` in place of
Fable 5.1 and GPT-6 Sol in place of GPT-6 Astra.

### Candidate — budget-window work-order ladders

The operator prefers concentrating useful work early in available usage windows
so the remaining period can be spent on other activities. Preserve a control
state machine supporting **zero to many concurrent work orders, each with its
own declared workflow steps**. A single ladder and a two-ladder batch are trial
capacity settings. Orders may occupy different phases and advance independently;
steps and legal transitions remain governed by each order's pinned workflow
and evidence contract. The initial role preference is Codex implementation,
fresh Opus 5 verification, and fresh Fable final review, with one writer per
worktree and model/effort assignment per order.

The [concrete candidate plan](../planning/budget-window-work-order-ladders.md)
splits the existing horizon into Beacons/Senses and Artifact Identity/Runtime:
after WO-020, pair WO-021 with WO-029, run WO-009 at the join, then consider
WO-022 with WO-010 before WO-011. It preserves hard dependencies and marks
planning preferences separately. Its original executable one-order
control-fold limitation is superseded by WO-030's per-order segments and real-Git
integration fixture. That bounded slice preserves attribution and release
readers; different workflow definitions and a measured paired wave remain
future evidence. A
[Fable planning handoff](../planning/budget-window-work-order-ladders.md#fable-planning-handoff)
asks for bounded enabling work orders and rules that derive lanes from
dependencies, conflicts, available actors, and capacity. The planner chooses
compatibility per affected surface, including a versioned computed/cached
mapping when useful under product 10's declared compatibility laws.
No automatic allocator or concurrency schema is implemented by this proposal.

Public contributions can use the same independent tracks. A shared projection
should show every known order's current declared step, blocker, evidence, and
freshness; a release view should identify the reviewed changes included in each
published release and lead back to the corresponding orders. Completion,
integration, and publication are separately evidenced facts. The current
generated index and immutable release manifests provide a foundation; the
per-order control model is implemented in WO-030's source, while
contribution-to-order mapping remains planning work.

Extend declared dependencies and recommended order to tenant-scoped tracks.
The scheduling view combines per-track plans with cross-track prerequisites,
shared conflicts, and capacity; readiness changes when their evidence or base
changes. The planner must define tenant/track ownership, scoped visibility and
authority, and the treatment of shared reserves and blocked work. A track
boundary cannot erase another track's prerequisite or advance its lifecycle.
The meaning of tenant and the storage/schema representation remain open.

The operator also wants an observation and admission policy that distinguishes
open tracks, admitted orders, active steps, and useful completed throughput.
When a downstream step is the constraint, limit or pause upstream production
at a declared safe boundary instead of growing waiting work. Recorded queue,
age, completion, capacity, and reserve observations inform per-step/track/global
limits and explicit resumption conditions. The resource-pressure candidate
provides a composition point; the first monitor, thresholds, freshness policy,
fairness, and moving-constraint behavior are planning choices. A bounded trial
should show a constrained verification step throttling implementation and
resuming it when capacity returns. No automatic monitor or pause exists yet.

Measure completed reviewed work, integration repair, total elapsed time,
operator involvement, and uninterrupted time away. Runtime policy consumes
observed allowance, window, model availability, and reserve inputs. The earlier
resource-pressure candidate can prioritize an early completion batch instead
of universally conserving routine work. Trial feasibility and benefit remain
open; no new order is activated or added to the default sequence.

The 2026-09-05 horizon ran serially, so the trial did not occur. The
2026-09-06 planning pass schedules the first measured paired wave as phase
two's wave 1 (WO-032 ∥ WO-033), records the manual sync procedure for the lane
whose sibling merges first, and files the sync helper inside WO-033; the
[phase-two plan](../planning/phase-two-plan-2026-09-06.md#concurrency-what-is-safe-what-is-untested-and-the-procedure)
holds both.

## Capability progression policies

The application ladder is one release view. Inside and across its rungs, DotLn
can treat each feature, integration, projection, pattern, or operational
capability like a skill that advances through evidence-backed levels. This makes
several implementation strategies explicit rather than letting whichever feature
is most exciting consume the whole roadmap.

Candidate capability levels:

| Level            | Meaning                                                    | Minimum evidence                                                                 |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 0 — latent       | named idea or need; no usable behavior                     | source and intended outcome                                                      |
| 1 — demonstrable | thinnest coherent behavior exists                          | bounded fixture or witnessed example                                             |
| 2 — dependable   | normal path and important failures behave predictably      | automated checks and repeatable evidence                                         |
| 3 — integrated   | participates in real workflows and lifecycle               | end-to-end use, recovery, authority, and audit evidence                          |
| 4 — production   | supportable under the implementation's declared risk       | security, privacy, operations, restore, performance, and acceptance gates        |
| 5 — polished     | professional, legible, efficient, accessible, and pleasant | user evidence, edge-case quality, documentation, and maintained regression suite |

The labels and gates matter more than whether numbering starts at zero or one.
Level is scoped: `audit.timeline@2` can coexist with `audit.rawExport@0`.
Production means production for a declared implementation profile, not one
universal enterprise bar.

“XP” is shorthand for admissible evidence—passing fixtures, witnessed use,
recovery exercises, resolved findings, measured usability—not commits, tokens,
hours, output volume, or model confidence. Work can accumulate evidence without
leveling up; promotion occurs only when every required gate for the next level
passes. A compact overall level is the minimum of its required dimensions, so
averaging cannot hide a security or recovery zero behind a polished interface.

### Activation, utilization, and XP

Capability learning needs at least three separate measures:

- **activation:** the planner/compiler selected the capability because its
  predicate and scope matched;
- **utilization:** the capability materially participated in a decision,
  behavior, artifact, control, or verified outcome after activation;
- **XP/evidence gain:** the episode produced admissible new evidence about the
  capability's competence, limits, reliability, usability, or next-level gate.

Also retain **eligibility/opportunity**—how often the capability could have
activated—so a low count is interpretable. These measures must not collapse into
one popularity score:

| Signal                              | Likely question                                                             |
| ----------------------------------- | --------------------------------------------------------------------------- |
| high opportunity, low activation    | Is selection, discoverability, tagging, or policy wrong?                    |
| high activation, low utilization    | Did we equip a gear set this map did not need without changing the outcome? |
| high utilization, low evidence gain | Is it repeatedly working without learning, or are outcomes unmeasured?      |
| high utilization, poor outcomes     | Is the capability weak, mis-scoped, or blocking the system?                 |
| low use, catastrophic consequence   | Is this a rare invariant that must remain mature despite low frequency?     |
| rising XP, unchanged level          | Which unsatisfied promotion gate is holding it back?                        |

Utilization can be causal only where the fixture or counterfactual supports the
claim; otherwise label it `participated`, not `caused`. XP can be positive,
negative, or narrowing: a failed experiment that exposes a boundary improves
knowledge without pretending the feature became more capable.

An activation is still a durable learning event even when utilization is zero.
It records that the selector saw a relevant opportunity under a particular scope
and state. Useful activation-event properties include capability and version,
trigger/predicate, matched facts, scope, competing candidates, selection score
or reason, selected/suppressed outcome, expected cost, reserved context/tools,
expiry, and the later utilization/result link. Over time these events reveal
demand, false and missed activation, trigger drift, co-activation patterns,
unused loadout weight, seasonality, and candidates for prefetching, retirement,
composition, or deeper investment.

Therefore activation evidence can earn **selector/activation-policy XP** and can
improve knowledge about a capability's applicability. It does not by itself earn
capability-effectiveness XP. A zero-utilization activation remains evidence
rather than waste by definition; repeated zero-utilization under the same
conditions becomes evidence that the selection rule or packaging needs
attention. Suppressed and declined activations are retained when policy and
privacy permit, because future outcomes may show that the road not taken was the
important signal.

### Reps, curiosity, and voluntary craft

The progression system must not punish **getting the reps in**. Repeated use can
build operator fluency, implementation familiarity, sample diversity, muscle
memory, better examples, edge-case discovery, and confidence in a known path
even when it does not immediately clear a promotion gate or attack the current
system constraint.

Keep at least two evidence accounts:

- **practice XP:** attributable repetitions, varied contexts, completed
  exercises, and observations that improve familiarity or enlarge the sample;
- **promotion evidence:** proof that a named next-level capability gate now
  passes under its declared conditions.

Practice XP is real and visible but cannot counterfeit reliability, security, or
production readiness. Conversely, lack of immediate promotion does not turn a
useful rep into failure. Repetitions should retain context and novelty so ten
identical easy runs are distinguishable from ten increasingly varied ones,
without imposing a game mechanic that makes people optimize counts.

Theory of Constraints is advisory except where a bounded release contract
explicitly makes the constraint a gate. It explains where work may have the
greatest end-to-end leverage; it does not revoke the operator's freedom to
follow curiosity, joy, craftsmanship, availability, or momentum. The operator
may always choose a capability and make it better within the active authority
envelope, while the system shows opportunity cost and dependencies without
shaming or blocking the choice.

Theory of Constraints uses these signals to decide which capabilities receive
love. Identify the current system constraint from end-to-end flow and evidence;
exploit it with the smallest intervention; subordinate adjacent work; elevate
its capability level only when needed; then repeat because the constraint may
move. The scheduler considers blocked work, queue/wait time, failure and retry
concentration, handoff delay, evidence gaps, operator burden, and the
counterfactual value of an improvement—not utilization alone. The most-used
feature is not necessarily the constraint, and the least-used feature is not
necessarily neglected.

The capability table can therefore begin with:

`opportunities | activations | utilizations | outcome/evidence refs | XP delta | current level | blocking gate | constraint contribution | next experiment`.

All counts retain scope and observation window. Comparisons across unrelated
capabilities or implementations are invalid unless their opportunities,
consequences, and evidence standards are comparable.

The planner can select a progression policy per horizon or portfolio:

- **breadth first / one skill point better:** choose the smallest useful,
  verified increment for each eligible capability before returning for another
  lap; useful for revealing the whole shape and integration seams;
- **depth first:** hold focus on one capability until a named target level,
  including professional and polished qualities; useful for the load-bearing
  path or a flagship experience;
- **minimum threshold:** bring every required capability to a release floor,
  leaving optional capabilities untouched;
- **furthest back first / golf scoring:** select the lowest qualified capability
  or weakest required dimension, with risk and dependency tie-breakers;
- **constraint first:** improve the capability currently limiting end-to-end
  value, reliability, or learning, following the activation/utilization/XP
  diagnosis above and Theory of Constraints;
- **risk-weighted:** raise high-consequence authority, privacy, recovery, or
  evidence capabilities before cosmetic maturity;
- **mixed portfolio:** reserve explicit capacity for floor-raising, one deep
  flagship, integration debt, and exploratory level-zero probes.
- **free practice / follow interest:** improve whichever capability attracts
  voluntary attention, recording reps, learning, and evidence while keeping
  constraint recommendations visible but non-coercive.

Selection is still constrained by dependencies, authority, expected value,
verification capacity, and the release's visible-payoff rule. A breadth pass
must produce coherent vertical behavior rather than a field of disconnected
stubs. A depth pass stops at its declared target instead of polishing one corner
indefinitely. `Do Nothing` remains a valid result when no candidate has positive
expected value or sufficient evidence.

The first implementation can remain simple: a reviewed capability table with
current level, target level, required dimensions, evidence links, dependencies,
last change, and next smallest promotable increment. Only after real planning
uses expose a need should this become scheduler IR or an XP engine.

### Efficiency as a separate capability axis

Every skill, feature, domain, integration, workflow, projection, and role can
also carry an **efficiency profile**. Maturity asks whether it can satisfy its
contract; efficiency asks what resources a verified unit of useful outcome
requires under declared conditions. A mature capability can be inefficient, and
an efficient demo can still be immature.

Efficiency is not one number. Record a resource/outcome vector such as:

```ts
type EfficiencyObservation = {
  capabilityRef: string;
  scenarioRef: string;
  implementationRef: string;
  window: { from: string; to: string };
  opportunities: number;
  verifiedOutcomes: number;
  resources: {
    elapsedMs?: number;
    operatorAttentionMs?: number;
    modelTokens?: number;
    modelCalls?: number;
    toolCalls?: number;
    computeCost?: number;
    retryCount?: number;
    storageBytes?: number;
    energyEstimate?: number;
  };
  qualityRefs: string[];
  failureRefs: string[];
  authorityAndRiskRefs: string[];
  baselineRef?: string;
};
```

The denominator is a verified outcome or completed contract—not output volume,
activations, story points, or busyness. Comparisons require comparable scenario,
quality, authority, and risk conditions. Missing measurement remains unknown.

The repository's WO-031 `resume usage` command supplies a limited observation of
completed phase-attempt wall time per actor and work order. Its counts include
failed attempts and its spans include waiting; combine it with outcome and
scenario evidence before drawing efficiency conclusions.

A useful provisional efficiency scale is:

| Level                | Meaning                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| E0 — unknown         | no trustworthy baseline                                                                             |
| E1 — measured        | representative baseline and resource vector exist                                                   |
| E2 — economical      | obvious waste removed without weakening the contract                                                |
| E3 — fit for profile | meets the implementation's declared budgets and service objectives                                  |
| E4 — frontier        | no observed alternative improves one important resource without worsening another protected outcome |
| E5 — adaptive        | detects drift, selects among proven strategies, and revalidates the frontier as conditions change   |

`E4` is a local Pareto frontier, not “perfect.” It is scoped to a scenario,
implementation, time window, and protected outcomes. A later technique can move
the frontier.

Constant efficiency awareness should produce **optimization candidates**, not
constant intervention. Candidates name observed waste, affected resource,
baseline, hypothesis, protected invariants, smallest reversible experiment,
expected gain, measurement plan, and rollback. `Beware of Naive Interventionism`
applies: do nothing when measurement cost or change risk exceeds expected gain,
and never optimize a non-constraint merely because its metric is easy to
improve.

Common efficiency avenues include avoiding unnecessary activation and context;
better caching and reuse; deterministic mechanisms replacing repeated model
work; batching or parallelism where ordering permits; cheaper perception before
expensive perception; right-sized model/runtime selection without silent
substitution; fewer handoffs and retries; smaller evidence with equal strength;
incremental computation; better stop conditions; archival/tiering; and reduced
operator cognitive load. Efficiency improvements retain before/after evidence
and note which resource moved elsewhere.

The [resource-pressure environment candidate](03-architecture.md#candidate--resource-pressure-as-an-environmental-modifier)
explores spending less on routine activation as scoped budget pressure rises.
Raising an admission threshold is a scheduling choice; improving efficiency
means reducing actual resources per comparable useful outcome. A candidate trial
must measure both deferred work and completed obligations, including declared
reserves, before claiming a benefit. It has no assigned work order or shipped
runtime behavior.

### Candidate — bounded system baseline

Routine observation can reveal an accumulating burden before it becomes the
current constraint. The useful shape is a small, repeatable baseline check and
a trend, even when no optimization is underway. Public reporting uses neutral
system measures such as size, latency, waiting, and maintenance cost.
Daily observation is one possible owner-selected cadence; this candidate
installs no job and adds no always-on collection to WO-028.

Select only measurements that answer a declared question:

| Question                                          | Candidate evidence                                                                                                                                     | Interpretation boundary                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Is history crowding out new work?                 | Retained event/log bytes alongside the source bytes actually admitted to a task; exact tokens only when an observed tokenizer/transport supplies them. | Storage size and context consumption differ; do not load the log into an LLM merely to measure it. |
| Is deterministic processing becoming slow?        | Fold duration over a pinned event set with host, cold/warm state, method, and repeated observations.                                                   | Event count alone is not a latency measurement; compare equivalent claims and conditions.          |
| Is workflow overhead delaying useful outcomes?    | Work-order elapsed time, completed phase attempts, retries, and handoffs beside verified outcome and complexity references.                            | Wall time includes waiting and interruptions; it is not model effort or operator attention.        |
| Is one change spreading across too many surfaces? | Number of authoritative edits versus regenerated projections and repair work for comparable changes.                                                   | More links can improve traceability; counts do not establish waste.                                |

Reuse existing structured evidence and deterministic summaries, retain detailed
measurements in the appropriate privacy lane, and expose a small bounded view
with sources, missingness, comparison window, and the collector's own cost.
Retention, aggregation, review frequency, and a stop budget apply to the
observer too. An LLM should receive a selected trend or an actionable exception,
not every daily raw sample. Public timing in WO-028 does not authorize public
token, cost, attention, or behavioral telemetry.

The Entropy Reducer can inspect these receipts when a separately authorized
review needs them. Thresholds, minimum sample sizes, trend/noise handling,
cadence, private storage, and the first consumer remain open. Act when evidence
supports the current constraint or a material impending failure; otherwise
retain an explicit accept/observe/defer decision. No universal performance
target, new event schema, scheduler, or architecture change is selected here.

### Counterfactual profiling work orders

An optimization candidate can compile into a bounded profiling work order so
candidate generation, implementation, measurement, and judgment do not blur
together. The work order pins an immutable baseline; one hypothesis or a bounded
candidate family; representative scenarios and fixtures; protected correctness,
quality, authority, and risk invariants; exact build, test, and benchmark
commands; the environment and toolchain profile; warm-up, repetition, and
run-order rules; the resource vector; decision thresholds; evidence paths; and
cleanup and rollback. The representation is intentionally executable by a
low-cost model because the important judgment has already been compiled into the
contract. Model assignment remains per work order and is never hardcoded.

The deterministic harness measures; models propose candidates and interpret
results. Every candidate runs in an isolated worktree or equivalent sandbox,
must pass the semantic and quality gate before comparison, and is never promoted
or merged automatically. Baseline and candidate runs are repeated and
interleaved or randomized where order can bias the result. Conclusions report
the distribution and uncertainty rather than treating one timing as truth.

Results are append-only, machine-readable observations linked to the exact
commits, scenarios, environment, and evidence. Retain regressions, failed
candidates, no-change results, and improvements that merely move cost to a
different resource. A generator may fan one reviewed optimization program into
many small profiling work orders for inexpensive executors, followed by a
comparison projection that shows protected outcomes, the resource frontier, and
first divergence. Candidate families may vary code, prompts, loadouts, models,
runtimes, or harness choices only when their authority and quality conditions
remain comparable. This is the concrete code-efficiency projection of the
graded-counterfactual-build idea in the lineage ledger, not permission to
optimize output volume or weaken the contract.

For reasoning-effort experiments, a complete work order is the default unit for
verification and final review: it is already the bounded unit whose evidence and
judgment must cohere. Compare declared settings such as `xhigh` and `max` over
representative orders before splitting those roles into smaller fragments merely
to create more samples. Under WO-132, reported labels remain as given; `unknown` is admitted, and
`ultra`/`ultra code` mean `xhigh` with subagents and raw spelling. A lower
token or account-cap observation is motivation for a controlled comparison—not
evidence that effort, model quality, or work-order size caused it.

A local-inference calibration is a candidate profiling order after a bounded
capability probe identifies an available runner. Start from one pinned story
prompt and a proposed repeated baseline, then compare baseline, role-only,
active/support-mechanics-only, and role-plus-mechanics cells with interleaved or
randomized run order. Each cell is a distinct compiled loadout. Pin model
artifact and version, quantization, prompt template, decoding parameters,
context and stop rules, seed policy, runner, hardware, and verified
network-egress state. Predeclare coherence, instruction-following, diversity,
role behavior, mechanic participation, and resource evaluators; report
distributions and evaluator disagreement. The operator's proposed 100 baseline
runs are a starting hypothesis, not a universal sample-size rule. Offline
execution removes provider connectivity and API-meter constraints, not local
compute, memory, context, latency, storage, energy, or thermal constraints.

The operator wants local inference at the earliest practical point. The next
planning pass should therefore run or nominate the smallest bounded runner and
no-egress capability probe, then decide whether to file the calibration order;
this priority does not expand WO-019 or silently reorder already authorized
dependencies.

Discharged 2026-09-03: the planning pass after the `v0.3.4` close ran a
read-only existence check (LM Studio installed; Ollama, llama.cpp, and MLX
absent) and nominated WO-027 as the bounded probe. The calibration order is
deliberately unfiled until WO-027's decision packet names its disposition;
filing it before determinism, cost, and egress are observed would be the naive
intervention this section warns against.

WO-027 completed that bounded probe on 2026-09-03 and chose **defer under a
named condition**. It pinned an existing 7B Q8_0 GGUF without downloading,
reproduced the installed LM Studio service-wake crash on its sole permitted
launch, and therefore recorded `n=0` load and generation outcomes. External
connections failed under the combined outer and nested boundaries, but no
boundary diagnostic identified the denying layer. A later profile did permit a
verified loopback request and was not used to relaunch the runner. The
calibration order remains unfiled until an available runner completes the fixed
three-request smoke under a boundary with independently attributable egress
behavior, including deterministic-output and during-generation socket
evidence. See the [dated discovery packet](../discovery/local-inference.md).

That probe should leave room for a hybrid local-first cell: deterministic
parsing, then local tagging/association and candidate WorkOrder/context-capsule
derivation, followed by a remote planning or coding episode that receives only
the approved capsule and public-safe evidence after ordinary dispatch authority. Compare it with deterministic-only, local-only, and
direct-remote paths for disclosure surface as well as episode/output quality and
cost.
Treat local derived metadata as sensitive and fallible, and count any later
remote request for more context as a new, visible disclosure decision.
Do not freeze the first result into permanent local/remote roles: repeat the
profile when a material model, runner, quantization, or hardware change occurs,
and allow the same typed intervention point to migrate local as evidence
supports it. The operator expects the local semantic frontier to improve; the
experiment still records regressions and constraints instead of defining them
away.

Every proposed model intervention point in that experiment is typed and
ablatable: activation predicate, bounded input, output schema, budget, and
downstream event are compared with a deterministic-only branch. Static maps and
other senses should be compiled into authorized, versioned state projections
where possible; an LLM receives only the residual interpretation that actually
requires inference. This uses the existing model/harness/runtime boundary and
does not create a second actor kind, a new roadmap rung, or an expansion of
WO-009 or WO-022.

**Declared cost is the prior; observed cost is the measurement (2026-09-05).**
The compiler already prints each support's declared mechanism and cost — prompt
tokens, runtime operations, episodes — in the compiled tooltip and diff. Those
are static claims about the program, useful for choosing between builds before
anything runs. The profiling harness supplies the observed vector under
declared conditions. The operator's loop is data → experiment → analysis →
change or report → repeat; declared and observed cost are its two columns, and
a build whose observed cost diverges from its declared cost is a finding, not a
rounding error. WO-107 is the route to the first observed column; this note
adds no telemetry field.

The capability table can add `efficiencyLevel`, `baseline`, `resourceVector`,
`protectedOutcomes`, `frontierAlternatives`, and `nextExperiment`. Efficiency XP
comes from trustworthy measurements and successful or informative experiments;
it never raises maturity automatically.

### Candidate — local-model usefulness experiments

**WO-137 observation (2026-09-18):** the [readiness packet](../discovery/local-runner-2026-09-18.md)
records LM Studio `0.4.24+1`, llama.cpp runtime `2.38.0` and an existing pinned
Qwen3.6 27B Q4_K_M artifact. Explicit CLI start and load now work; the fixed
three-request smoke is byte-identical, schema and tool round trip pass, HTTP
cancellation is observed to become idle within five seconds, timeout occurs
and recovery succeeds. The operator-expanded two-minute sequential load run
completed nine capped requests and deadline-cancelled the tenth with nominal
thermal observations, normal memory pressure and no swap growth. Overall
outcome remains `inconclusive`: effective template/default sampling readback,
interrupted-case throughput and attributable runner egress denial are missing.
WO-110 may consume these protocol observations while retaining its unavailable
readiness path; WO-138's `ready` prerequisite remains unsatisfied. The packet
names the next useful boundary/provenance experiment. No capability, quality,
hardware-safety or sustained-load claim follows.

Operator direction, 2026-09-19 (second planning pass of that day): the run
was a success for what local testing needs, and the work is finding more
places to use local models, or at least to keep testing them. WO-137's label
is `inconclusive` for one reason: it ran with networking permitted, so it
could not prove the runner sends nothing off the machine. That proof matters
before a local role reads private material and does not bear on a pilot whose
inputs are all public, so
[WO-138](../work-orders/WO-138-local-model-role-qualification.md) is amended
to activate on the successful live row and qualifies no private-input role.
A further use is nominated from that pass's own cost: eight read-only surveys
spent 1,852,818 remote tokens classifying register rows and review
observations into closed sets with checkable citations, the shape of WO-138's
third task; bulk read-only triage is the next local role to test once the
pilot's packet exists.

Standard planning pass, 2026-09-21: WO-138's amended preflight is met. WO-137
recorded successful live inference on the pinned artifact (the schema and tool
round trip, the determinism triple and the cancel), and WO-110's 2026-09-20 live
row completed one inspection episode against the same runner in 14.6 s with a
schema-valid envelope (WO-110 D007). Two WO-110 decisions are carried into
WO-138's activation preflight in the planning map: the runner does not echo the
requested model, so the pilot must obtain the answering model's identity from
the runner rather than the request (D007), and the transport's null-body case is
guarded by the next order that edits it, WO-138 if it comes first (D012).

**WO-138 disposition after repair (2026-09-21): `inconclusive`.** The final
38-cell matrix uses one retained input snapshot and one matching probe build.
Only T2 qualifies: 5/5 schema-valid local rankings, median Spearman 0.828571,
the same measured remote median, local median latency 12.076 s and zero
in-episode interventions. Every remote baseline reached the model and passed
validation. T1 is now 5/5 schema-valid but its agreement is only 0.1; T3 is 5/5
valid at 0.833333, below its 0.9 floor and outside the ten-point remote floor.
T3's single label-definition cell reached 1.0 and remains a candidate for a
separately registered repeated qualification. T1 needs a fresh fixed-schema
accuracy qualification. The rejected-schema and unmatched-input matrices are
retained unscored; the [packet](../evidence/WO-138/decision-packet.md) records
the corrected method and distributions. No private-input, no-egress,
implementation or independent-verification qualification follows. Reopen when
the task, schema, artifact or boundary changes, or a new qualification is
registered.

Operator direction, 2026-09-16: the next planning pass should give local LLM
experiments more attention, starting with concrete runner readiness and any
operator setup needed in LM Studio. Current readiness is unknown; the dated
WO-027 failure above remains evidence about that probe, not a claim that the
runner is unusable today. Revisit its named deferral with a fresh bounded
availability smoke and coordinate any required setup before scheduling runs.
WO-110 supplies the existing inspection-transport candidate; its present scope
does not establish source-writing capability or model quality.

After availability, plan a substantially broader comparison effort around the
same pinned WorkOrder, repository baseline, compiled build and independent
acceptance criteria. Separate three questions: differences across local and
remote models under comparable conditions; variation across repeated runs of
the same model and prompt; and changes caused by prompt or support choices for
the same order. For the last question, vary one factor at a time and identify
each distinct compiled build explicitly. Keep the task and other conditions
fixed; report transport/tool differences that prevent a clean model comparison.

Use the profiling contract above to retain outputs, failures, distributions,
resource costs and evaluator disagreement. A small pilot should establish
feasible sample sizes and evaluation cost before larger batches. The intended
decision is which responsibilities local models can handle reliably, where
they need deterministic checks or remote assistance, and where they are not
yet useful. A universal ranking, a large run count or an assumed privacy/cost
advantage is not the goal. No setup, model download, live launch, sequence
change or new order is authorized by this candidate alone.

Source: the operator's 2026-09-16 local-model ideation, synthesized in the ledger
and [WO-051 breakout receipt](../evidence/WO-051/ideation-local-models.md).
Reopen at the next planning pass or when the operator reports setup readiness;
record the resulting plan, concrete setup needs and bounded first experiment.

**Allocated 2026-09-17 (vision-into-use pass).** Observed on the host: the
application is installed, its CLI build changed on 2026-09-15 after the
2026-09-03 crash, the server is not running and nothing listens on the
loopback port; Apple M3 Max, 48 GB. Readiness of the current build is
unknown, so the plan is three orders in dependency order:
[WO-137](../work-orders/WO-137-local-runner-readiness.md) (a guided research
order: reproducible noninteractive calls with determinism, schema and
tool-call round trip, cancellation, timeout and provenance, or a failure
artifact), then [WO-110](../work-orders/WO-110-local-model-transport.md)
written from its row, then
[WO-138](../work-orders/WO-138-local-model-role-qualification.md) (three
read-only tasks with deterministic oracles, local against one remote
transport with repeats and one-factor cells, deciding which inspection roles
the local kind may fill at what floor). Bounded implementation and
independent verification are later qualifications, each its own experiment.
Live evaluations never run inside `npm test`; requalification triggers are in
07 §Research and guided-operator work orders. No download, launch or setting
is authorized by this allocation.

<!-- prettier-ignore -->
## v0.0.0 — Clean-room bootstrap  *(mostly complete)*

Repo, intake pipeline, blueprint docs, idea ledger, decision records, first work
orders. Exit: initial commit on `main`; `docs/` is the complete shared memory a
cold model session needs. No application code. `.claude/` grows iteratively with
use (one config-log line per change); decision records only for safety-boundary
config (permissions, hooks).

<!-- prettier-ignore -->
## v0.0.1 — Environment truth (bounded)  → WO-001

A 30–60 minute bounded inspection, not the comprehensive audit (that variant
stays preserved in the ledger for wrapped/managed environments). Record with
epistemic labels: node/package-manager/TS toolchain; git + worktree behavior;
Claude Code surface actually present (print mode, structured output, agents,
workflows, background, worktrees, hooks, session persistence); Codex CLI
surface; Playwright availability; SQLite; localhost serving. Exit:
`docs/discovery/environment.md` + machine-readable summary; a named choice of
worker-transport adapters to build first, from evidence.

<!-- prettier-ignore -->
## v0.1.0 — Pure kernel  → WO-002

TypeScript, **zero runtime dependencies, no I/O**. Events + EventEnvelope
(including the Comparison event type), immutable state, reactors
`(state, event, env) → Decision`, continuations, cadence with virtual time,
explicit RNG state, decision traces, append-only JSONL store + replay. Scope is
what the walking skeleton consumes — _types_ for the full Program and Cadence
grammars, _evaluation semantics_ only for the subset WO-002 names; the rest
arrives on contact at later rungs (the domain model holds the target shape).
Exit criteria: rows 1, 3, 5 of the canonical failure-injection matrix
(03-architecture) pass at the kernel boundary. For row 5 the kernel declares
cancellation and NoOp; the walking skeleton proves those declarations in its
fake scheduler, while durable scheduler ownership for real workers arrives with
WO-009. Same event log ⇒ same controller transitions, provably. Visible proof:
the evidence suite inspects the structured replay decisions and `DecisionTrace`;
the first human-readable CLI projection arrives with `v0.2.0`. Deferred:
remaining grammar/matrix rows, every UI, every real adapter, the pattern
compiler.

<!-- prettier-ignore -->
## v0.2.0 — Walking skeleton (fake executor)  → WO-003

The Repo Gardener + Seiri vertical against a deterministic fake executor: create
inspection task → operator Present/Away → virtual 20-minute pulse → kernel emits
bounded WorkOrder → fake worker returns evidence-backed deletion _candidates_
(no deletion authority) → separate fake verifier accepts/rejects → Operator
Returned cancels pulses → replay reproduces the identical final state. CLI
projection + human-readable event timeline are the first views. Exit: the
13-step demo runs end-to-end twice — live and from replay — with identical
traces, **and the run renders as an emoji-glyph scene** (the operator's own
visual-prototype-zero: 🐛 gardener plus glyph states from the visual grammar,
printed to terminal or a static HTML page — zero assets, a pure projection of
the log). Deferred: real model calls, interactive web UI.

<!-- prettier-ignore -->
## v0.2.1 — Environment truth addendum and lifecycle corrections  → WO-004 + WO-012

Close the gaps WO-001 deliberately deferred: both candidate transport launch
shapes exercised for real from an unsandboxed authenticated session, MCP as a
capability row, full startup-context accounting, effective settings loading, the
user-level `model` key. Exit: the WO-009 transport recommendation re-stated over
`observed` rows (or honestly re-labeled with cause), and `environment.json` row
parity including the Codex feature-surface row. The operator-authorized
expansion also makes the worktree, review, repair, and release-close lifecycle
executable and restartable.

WO-004 merged after passing independent verification and final review, but
publication of its eligible release was deferred on 2026-09-01 when release
close misclassified a protected `docs/intake/` pathname containing U+202F as
contaminating ignored material. That failed close created no `v0.2.1` tag.
WO-012 repairs that release-gate defect; the tag is cut only when WO-012 closes
and carries both work orders.

<!-- prettier-ignore -->
## v0.2.2 — Capability table v1  → WO-005

The Capability-progression section's own "first implementation can remain
simple": a reviewed Markdown table — evidence-linked levels,
minimum-of-dimensions composites, `E0 — unknown` efficiency defaults, one
recorded progression policy. Exit: `docs/planning/capability-table.md` with
every non-latent row naming its blocking gate.

<!-- prettier-ignore -->
## v0.2.3 — Publication bootstrap  → WO-006

Steps 1–4 of the publication-compiler bootstrap (08): audience/status index over
the blueprint, base outline + implementation-overlay template, two sharply
different tables of contents from the same sources, one dual-voice sample, and a
demonstrated staleness loop. This anchors 08's "first-class output from the
beginning" on the ladder; further editions stay gated on this loop working.
Exit: `docs/publication/` exists and the staleness demonstration is captured.

During execution the operator expanded this patch rung with thirteen bounded
same-release additions, fully enumerated in WO-006: Malcolm Check synthesis and
the durable `ideation:` dispatch; Prettier; personal-harness guidance and
checkpoint diagnostics; observable restraint accounting; external rule-source
mapping; Embodied Explorer; work-order navigation; an unmined Team Topologies
research nomination; the operator-flow mission; binary quench; Flow Steward;
temporal interaction interpretation plus the bounded RxJS `expand()` hypothesis;
and the brain/hands, harness/orchestration, isolation, LangGraph-accommodation,
and foundation-first synthesis. These remain documentation, process, and
dev-tooling changes; they add no exported runtime capability and do not move the
release boundary.

WO-006 merged after independent verification and final review. Its authorized
release close on 2026-09-01 then passed dependency installation, the declared
test evidence, and the built skeleton CLI before manifest derivation refused:
the cadence compatibility parser could not read the canonical Prettier-formatted
type union. No local or origin `v0.2.3` tag was created. WO-015 is the bounded
fix-in-place continuation of that interrupted release obligation. The target
remains unpublished until WO-015 completes its own ordinary verification, final
review, and merge, followed by a separately authorized release close.

<!-- prettier-ignore -->
## v0.3.0 — Audit-record baseline (three projections)  → WO-007

Bootstrap steps 1–3 of the audit map (09), against the walking skeleton's real
demo log: consequential-action enumeration with the question each record
answers, a minimal pinned AuditRecord envelope referencing the event store
(never a second truth), and three pure-fold projections — L0 receipt, causal
timeline, governed raw JSON. This anchors 09's bootstrap on the ladder; steps
4–7 wait for WO-009's machinery. Exit: identical projection output over live and
replayed logs, with step 9's structural refusal visible in the receipt.

<!-- prettier-ignore -->
## v0.4.0 — Composition compiler v1  → WO-008

LoadoutGraph with support facets, link type-checking, deterministic precedence,
and a CLI compiled-diff preview. The Seiri link group compiles to heterogeneous
mechanisms with per-support declared cost. Exit: an incompatible link fails at
compile time with the SUPPORT INACTIVE diagnosis; equipping/unequipping changes
the running program and the semantic hash proves view equivalence across at
least {code DSL, function table, statechart JSON}. Visible payoff: the
compiled-diff preview renders as an **RPG item tooltip** (GRANTS / RESTRICTIONS
/ OBLIGATION / PASSIVE / PULSE / INTERRUPT), not only CLI text.

<!-- prettier-ignore -->
## v0.5.0 — Compiled Entropy Reducer  → WO-023

One author-trusted instance loadout compiles the Entropy Reducer identity,
planning-reviewer role, Shine active, Standardize plus seven other supports,
bounded authority, typed output and refutation guards, and generated residue.
The operator-mediated run invokes Claude Fable 5.1 at `max`, then gives only
selected command/inspection subjects to a fresh blinded refuter. Exit: the
compiled artifact, refusal fixtures, byte-regenerated residue, typed review,
refutation report, model/effort attestation, and unchanged tracked-status pair
all agree. `Program.All` remains deferred and no runtime transport is added.

<!-- prettier-ignore -->
## v0.10.0 — Real disposable worker  → WO-009

WorkOrderTransport adapters chosen from discovery through WO-004's observed
evidence — expected: Claude CLI print-mode with the canonical launch shape
(fresh bounded invocation, project+local settings only, **ambient/auto memory
disabled** — no harness-owned memory loads into a fresh episode; external memory
is deliberate — isolated worktree, explicit model and effort, no session
persistence, JSON schema output) and a Codex equivalent using only controls the
installed host exposes. If Codex still offers no effort selector, record
`unknown`; never invent a flag. Worktree lifecycle is deterministic (create,
verify cwd, clean up). Exit: one real episode replaces the fake executor in the
v0.2.0 demo and returns a compact result envelope; the main session's transcript
grows by only the envelope; a killed worker leaves a recoverable pending command
(matrix rows 2, 4, 6 pass here); **`dotln status` exists** — a live in-flight
projection of the store (running episodes, leases/heartbeats, pending commands,
recent events) so real workers never run blind. **No silent model substitution**
— unavailable model ⇒ queue or fail closed.

**Implementation receipt (2026-09-05):** the staged source implements this exit
for one synthetic inventory inspection. Both actual CLI transports pass the
shared demo, read-only in-flight status, replay and worktree cleanup; Claude
also passes forced termination and recovery. Deterministic subprocess tests
cover rows 2/4/6 and both directions of unavailable-model refusal. Host process
checks use a 1,000 ms heartbeat, 5,000 ms lease and 180,000 ms deadline; the
verifier and remaining actors stay fake. See the [executor evidence](../evidence/WO-009/README.md)
and [runbook](../../packages/skeleton/README.md#disposable-workers). General
worker profiles and real verifier episodes remain separate work; independent
verification and publication have not been inferred from executor tests.

<!-- prettier-ignore -->
## v0.12.0 — Independent verification  → WO-010

Blinded verifier episodes; claim-typed evidence mapping; typed
VerificationFinding → focused repair continuation in a fresh episode;
substantive repair marks affected evidence stale. Exit: a deliberately-planted
defect is caught by the verifier, repaired via continuation, re-verified — and
the implementer episode never certifies itself.

**WO-010 activation completion and implementation receipt (2026-09-06):** the omitted target is assigned `v0.12.0`, a minor addition above published `v0.11.0`. Compiler `0.5.0` adds pure blinded verification and focused repair capsules; skeleton `0.11.0` adds the event-loop host, claim-typed evidence matrix, repair staleness and `dotln verify-demo`. Kernel `0.2.1`, the event envelope and compiled-loadout contract remain unchanged. The deterministic planted-defect loop runs through both WO-009 CLI wire protocols with local subprocess doubles; no live model invocation or live-integration proof is claimed. The bounded host mounts a synthetic repository snapshot and applies validated JSON policy repairs. General source-writing workers, independent code review and post-PR loops remain later work. See the [executor evidence](../evidence/WO-010/README.md) and [runbook](../../packages/skeleton/README.md#independent-verification). Independent verification of this implementation and publication remain separate lifecycle evidence.

Follow-on work orders should project the proven resume protocol as native,
on-demand agent skills rather than ambient role prose: (1) a shared typed
intent/transition contract and conformance fixtures, (2) verifier and repair
skills, and (3) final-review plus worktree-lifecycle skills. Each projection
must remain behaviorally equivalent to the CLI, refuse illegal transitions,
write the same immutable artifacts, and demonstrate measured startup-context
reduction. Runtime observability work should expose context remaining and the
delegation graph in a persistent TUI status projection when the host provides
those signals, with explicit unknown states otherwise. Exact release placement
waits on evidence from WO-009 and WO-010 rather than expanding those orders by
implication.

The recommended first Additional Opinion pilot also waits on WO-009 and WO-010:
two total blinded verification episodes over one immutable candidate, followed
by a sealed independent adjudication that routes only to fix or final review.
It must preserve dissent and every input result, label same-model reruns as
replicates, and prove that a supported blocking finding cannot be outvoted. Only
after that evidence model works should a later order attempt mutating
implementation variants, which require one writer/worktree per candidate, a
single integration branch, and fresh verification for any synthesized result.
This recommendation has no version, work-order identity, or activation
authority and does not expand WO-009, WO-010, or the current resume protocol.

<!-- prettier-ignore -->
## v0.13.0 — Feedback compiler v1 (ten units)  → WO-011

Ten representative FeedbackUnits authored from the corpus (this repo's ledger,
not any external rule stack): anti-oscillation; correctness-over-sycophancy; the
fail-conservative correction reactor (semantic events, not profanity triggers);
verify-app-before-done; no-attribution (settings + commit-msg hook as defense in
depth, with a precise predicate); concurrent-work-requires-worktrees;
no-lint/type-disables-as-fixes; read-your-own-output; no-partial-completion;
bounded boy-scout cleanup. Each: mechanism per the hierarchy + regression
fixture + maturity stats. Exit: measured startup-context reduction vs. prose
equivalents; each unit's fixture fails when the mechanism is removed; **and the
first self-hosted step** — one DotLn work order for this repo itself is
compiled, dispatched, executed, and verified by DotLn (ADR-0001's strangler
experiment gets its vehicle).

**WO-011 source (2026-09-06):** the omitted activation target is assigned
`v0.13.0`, a minor addition above published `v0.12.0`. Compiler `0.6.0` adds the
separate `feedback-v1` contract and skeleton `0.12.0` hosts its ten personal
units, boundary adapters, semantic correction branch, and bounded
`dotln feedback-audit` work order. Kernel `0.2.1` and existing loadout/event
contracts stay at their current versions. The audit executes local regression
subprocesses and invokes a separate verifier over pinned evidence; the
[executor receipt](../evidence/WO-011/README.md) distinguishes controlled fixture
proof, matched instruction-byte accounting, and the witnessed self-hosted run.
The manual repository verification and publication phases remain separate.

## Application version pending — Harness lowering and rule migration → WO-039 + WO-040

Make a saved build govern the sessions that actually run. A pure compiler
target, `harness-v1`, lowers a loadout, its equipped feedback units, and its
authority envelope into what a harness enforces: settings permissions and
hook scripts at rung 2 of the mechanism hierarchy, on-demand role skills at
rung 7, and a marked instruction block at rung 8 holding only the residue
nothing lower could carry, with a byte count. Every generated hook evaluates
the same compiled unit the audit host evaluates; there is no second
predicate, and surface language never triggers a correction. This
repository defines its own session build, the **Contributor** (four roles
selected by resume phrase, the ten personal units, the Clean Room floor, and
the harness posture as an envelope), emits its configuration from the
compiler, commits it, and refuses drift in the evidence gate (WO-039). Then
the remaining feedback shapes get a rung: a generated migration ledger
classifies every shape the operator has named into the founding taxonomy
with its chosen rung and status, and batches of about twelve compile through
the target into the Contributor build, each with fixtures and maturity stats
(WO-040, batch one; later batches from its template). Exit: this
repository's sessions run under generated configuration that `harness
check` proves matches the build; a fresh fork of the starter runs on the
same mechanism from its first commit; the migration ledger reports the
number the one-paragraph story is about, shapes governing live sessions by
mechanism rather than by prose, before and after each batch, beside the
measured startup context. Filed by the 2026-09-06 redirect, which found
that ten compiled units governed no session the operator actually opened.

## Application version pending — Projections & console

Web console (UI framework and repository boundary decided _here_ by ADR with
representative evidence; Angular and its operator-fluent baseline are the
default conventional-shell candidate, Babylon.js is the spatial-view candidate,
and a plain workspace remains the default unless Nx proves enough measured value
and reliability to justify its weight — the kernel doesn't care). Synchronized
views: RPG loadout, statechart, function table, event timeline, and raw IR;
semantic-hash equality across editable views; glyph system with the visual
grammar; replay scrubber; the first full transmog skin beyond glyphs (Native
Emoji) — the friendly skin serves the teammate goal and does not wait for v1.0.
Terminal remains a complete control surface. Exit: the v0.2.0 demo watched
entirely from the console, then re-watched via replay; every animated element
opens its mechanics inspector.

### UIFA v0 actor board

The 2026-09-06 planning pass, as redirected the same day, named the rung's
first slice. **Implemented for `v0.14.0` (2026-09-07):** WO-032, UIFA v0,
a read-only actor board inside core with
Actors, Builds, Mechanisms, Work, and Blueprint panels over the documented
machine interfaces and evidence stores, each panel naming the UIFA role it
serves, rendered in the terminal and as a zero-asset static page, invoking
no command and adding no framework, and exported as the versioned
`uifa-board-v1` view model. The first draft's showrunner board over control
state is the Work panel. The framework decision above waits for the
cross-repository pilot's evidence; the Angular shell is console v1 in the
operator's example consumer, rendering that view model's actor panels,
reached through the launchpad rung below. The [console package](../../packages/console/README.md)
and [executor evidence](../evidence/WO-032/README.md) define this first slice's
source fidelity, five pinned fixture families, role-question mapping and
remaining independent review. It does not complete the richer rung's replay,
animation, authoring or command-parity exits.

## Application version pending — Launchpad and cross-repository workstreams → WO-033 + WO-034

Make the control plane runnable outside core and export an instance that
carries a build: one configuration root, work orders that name a registered
target repository whose authority profile is an envelope and whose class is a
link group, a launchpad export with pinned provenance that carries the
Contributor build as an enforceable harness bundle plus the pinned runtime
build the bundle imports, kit and instance and overlay separation so a fork
takes updates and re-emits its own build, worktree-local harness emit for
targets so a target never sees a DotLn file in a commit, and a lane sync
step for paired waves (WO-033); then one workstream whose bounded orders
span several target repositories, proven first on synthetic repositories
through the six demonstrations product 12 names and then by an
operator-witnessed real run from a fork of the starter, running that build,
into `DotLn-Angular`, whose first change is a UIFA v1 shell over the actor
board's view model (WO-034). Targets receive only conventional branches and
pull requests; the launchpad holds their orders and evidence. This is
Horizon 1's first product surface beyond this repository and the
process-level precursor of the source-to-deliverable vertical below; DotLn
runtime transports do not yet execute the target work. Exit: a session
opened in the export is refused a denied effect by a generated hook and
resolves a role skill by resume phrase; the pilot's real run opens a target
pull request through the workflow with its verification and final review
recorded in the launchpad, its receipt compares restatement, handoffs,
interruptions, and return time with the operator's separate-session
practice, and its hook logs report which compiled units fired in the fork's
sessions. The starter is intended for other organizations to fork as their
own launchpads, so this rung is where the ladder's personal-machine
assumption stops holding: each fork's first order is bounded environment
truth for its own host, harness, and gateway, extended with the harness
smoke, and the licensing decision in `docs/LEGAL.md` precedes the first
external fork. The 2026-09-06 redirect superseded the first draft of this
rung, which exported the process kit with no build in it.

## Application version pending — Pattern workshop v1

5S equipment set with compiled set bonuses; Marquet ladder as the operator-agent
protocol (autonomy rung computed, not set); mitigated-speech voice selector;
drag-and-drop equip with exact compiled diff preview. Exit: dragging Seiri onto
Repo Gardener in the console produces the same semantic hash as authoring the
equivalent link group in code.

The 2026-09-06 planning pass names the compiler-side first slice: WO-037
compiles the 5S set as a multi-active link group with shared supports and
piece-count set bonuses, equips it on the Repo Gardener in a second
deterministic scenario, and renders every piece and the set as tooltips,
while existing programs keep their hashes; the redirect places it in wave 4
beside the migration's second batch, after the actor board can render it.
The drag-equip surface is console v1 work in the operator's example
consumer; the Marquet ladder and voice selector remain a later order.

## Application version pending — Source-to-deliverable vertical

The [first external source change is live-evidenced](../evidence/WO-053/README.md):
Claude and Codex each fix one synthetic module, turn a host-run test green and
commit, and a killed host recovers the same commit without redispatch.
[WO-054](../evidence/WO-054/implementation.md) adds sealed worktree snapshots
and independent confined host-test witnesses, including a contract failure
when the worker's superficial test passes.
[WO-055](../evidence/WO-055/implementation.md) adds bounded source repair and
original-contract re-verification; doubles establish green completion, exhaustion
and interruption recovery. Blinded verification and repair are now
[live-evidenced](../evidence/WO-056/README.md): on 2026-09-20 Claude and Codex
each failed the violated clause of a planted change whose superficial test
passed, a fresh worker of the same harness repaired only the blamed module,
and a different verifier episode passed every original criterion from the
unchanged contract; the Claude run's published log replays negative against
injected implementer events. The first four attempts failed and found two
runtime defects, repaired in that order: the verifier had never been told the
finding contract the host enforces, and Codex could not launch in the
files-only snapshot. This is one synthetic two-clause repository, as executor
evidence awaiting independent verification. The remaining personal-flavor vertical is planned: GitHub Issue → SourceBundle →
StoryContract → RepoProfile + ImpactMap → **Live Witness baseline** (reproduce
before changing; preserve baseline evidence) → implementation episode → blinded
behavior verification **and** independent code review (two separate episodes) →
evidence-grounded PR on a personal repo (the deliverable-ready conjunction
checklist, 03 §DeliveryAdapter) → post-PR loop (CI classification, comment
triage, source revision guard). The enterprise-tracker adapter remains a future
optional plug-in — the promise generalizes to "any tracked-work artifact +
registered repo + named authority profile → independently verified deliverable."
Exit: one real issue travels the pipeline with operator interruptions only at
material decisions.

## v1.0.0 — Teammate-ready

A person who has never read these docs declares one bounded intent and receives
a verifiable result, without learning the taxonomy and without a giant
transcript. Exit: witnessed run by a non-author.

## Post-1.0 horizons

[`προτείνω`](11-protino.md) is the operator-named flagship first-party
application horizon: a compact persistent community where long-form prose is a
targeted, inspectable intervention; residents may ignore, resist, misinterpret,
adopt, adapt, or relay it; and paired branches show what changed inside a
declared simulation. It joins the executable pattern workshop to the simulation
laboratory without promoting application content into the kernel. Calling it the
prospective flagship records ambition, not product evidence, release priority,
or permission to expand a current work order. Within the application layer it
belongs to the intended first cohort; that sequencing signal does not move it
ahead of the platform ladder or select a delivery date. A small basketball
squad is a candidate first proof, not a selected milestone.

The broader simulation catalog remains: paired counterfactuals, first-divergence
search, agent swaps, all-clone towns, reflection-question design, time-dilation,
time-fidelity and observation-relative closure experiments, conservative
future-reachability envelopes, recognition-beyond-identifiers,
accuracy-vs-rationale decoupling, biographical seeding, bounded-inconsistency
generation, and length-scale attention aggregation (the full founding catalog
lives in the ledger's chat-005 entries; later operator-dispatched additions are
recorded in newer ledger sections); an Embodied Explorer fixture that learns
evidence-backed composite skills from bounded sensorimotor primitives in a 3D
simulator; a later commander-mediated strategy sibling where commander options,
operator riffs, issued tactics, actual execution, and outcomes remain separately
inspectable; the full pattern shelf (Compendium skin); remaining transmog
skins; physical-card importer; hypothesis flywheel. All are gated on the same
kernel, and no application, simulation, or embodiment choice may distort
Horizon 1.

Additional horizon: a lightweight offline-capable IR verifier; explicit
application/schema/artifact/component version lineage; inspectable JIT
compatibility and AOT migration of historical configurations; release-scoped,
non-monotonic active/support availability with declared inactive behavior; and a
general behavioral toolbox whose game-AI use tests whether actors, loadouts,
Programs, Cadences, preview, simulation, and replay genuinely generalize. See
10-ir-compatibility.md. Distribution as package, executable, cloneable repo, web
generator, or compact share code remains an evidence-driven choice.

Also unscheduled: make the platform/personal-implementation split physical and
ship an owner-sovereign instance profile that may remove DotLn-level approvals,
verification, retention, replay, and advisory warnings for an owner who chooses
that tradeoff. The profile is not preconfigured by this horizon statement, and
it cannot promise to override a model provider, harness, operating system, or
destination outside DotLn's control. Its presence policy must be able to
distinguish attention, work scope, effect authority, and external capability and
exercise hold, shrink, progressive-growth, cap, return/reset, and non-ratcheting
loop fixtures.

Also unscheduled: a private Clean Room list editor with a discoverable
Excluded terms view, current entries, add/remove actions and a No terms
configured state. The list grows incrementally without an exhaustive setup
requirement. The [open interface item](04-interfaces.md#candidate--private-exclusion-list-management)
keeps UI and storage choices pending; WO-039 provides the existing local checker,
not this editor.

Also unscheduled: replace worktree-local intake drift with one canonical private
store plus capture, status, backup, and reconciliation operations. The helper
must prove collision-safe, interruption-safe movement from a disposable
worktree, keep raw names and bytes out of public artifacts, and distinguish
storage reconciliation from the ideation/re-mining receipt that records
semantic reconciliation.

Two unscheduled infrastructure probes share that same gate. An orchestration
conformance probe may lower one bounded Program through LangGraph and compare it
with the pure TypeScript reference at the decision/event boundary; this selects
no framework dependency. An isolated-execution probe may compare the current
worktree/harness baseline with hardened container and VM/microVM profiles where
local discovery proves them available; it selects no deployment default and does
not expand WO-009. Neither starts until the smallest intent-to-evidence loop is
responsive, legible, independently evidenced, and pleasant enough to repeat.
External feature breadth is then admitted through exact primitive composition,
an explicit adapter, or evidence for a genuinely missing primitive—not
competitive checklist accumulation.

**WO-039 activation completion (2026-09-07):** the omitted target is assigned
`v0.14.0`, a minor application capability above local published `v0.13.3` in
this subject's ancestry. Compiler `0.7.0` adds the separate `harness-v1` target;
skeleton `0.13.0` adds the Contributor build and host. Kernel `0.2.1` and the
loadout/feedback/verification contract axes do not change. Project hooks, role
skills and marked residue are generated; Codex's unobserved hooks are unavailable.
The [executor receipt](../evidence/WO-039/README.md) distinguishes fixtures,
live role entry and context accounting. Independent verification, final review,
merge and publication remain separate lifecycle evidence.

**WO-039 collision retiming (2026-09-07):** unpublished target `v0.14.0` is superseded by `v0.15.0` under the existing minor classification because the observed release baseline is `v0.14.0`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.

**WO-039 integration note (2026-09-08):** integrating the published `v0.14.0` base showed that the actor board pinned the WO-011 self-hosted edition, which compiler `0.7.0` refuses as persisted compilation drift; the board now reads the WO-039 edition by default and console `0.1.1` records that patch. The classification stays minor and no published tag changes.

**WO-047 replay projection (2026-09-15):**

Application v0.22.0 stages kernel 0.5.0 and skeleton 0.18.3. Replay accepts an
optional pure environment projector for current state and event, while the
reserved-key default remains supported. The skeleton passes its own projector
across all replay and recovery paths. Full decisions and serialized bytes remain
identical on the demo, WO-003 oracle, worker, verification, feedback and beacon
fixtures. Typed state slices remain WO-050. See [the decision record](../evidence/WO-047/decisions.md).

WO-068 release assignment (2026-09-16): stage application `v0.23.0` and
skeleton `0.19.0` for the new resident host, script catalog and commands.
Kernel, compiler and console component versions remain unchanged. This local
assignment completes the activation placeholder under the order's minor
classification; independent verification and publication remain pending.
