# Codex runtime target map — 2026-08-31

This is the first concrete `RuntimePrimitiveCatalog` companion for DotLn. It
maps stable DotLn semantics onto the Codex surfaces available to this personal
implementation so the mapping can be tested instead of inferred from product
names. It is a discovery artifact, not a promise that every listed capability
has passed an end-to-end model invocation.

Labels are `observed`, `documented locally`, `documented officially` (vendor
documentation — added to Principle 15's label set by this map), `untested`, and
`blocked`. Local evidence comes from `codex-cli 0.151.0`; re-probe when the CLI
version or host configuration changes. Configuration values, credentials, and
private identifiers are deliberately excluded.

## Primitive inventory

| Codex surface | Status | DotLn use | Boundary |
|---|---|---|---|
| `AGENTS.md` instruction hierarchy | observed | project doctrine, clean-room rules, cold-start route | guidance and context, not authority enforcement |
| repo-local skills in `.agents/skills` | documented officially, untested here | projectable actives, supports, role procedures, evidence formats, and participation protocols | load only the minimum episode-scoped set; a skill grants no authority |
| plugins | observed feature, untested here | distribute a compatible bundle of skills, MCP connections, apps, and metadata | installation is not activation; apply the host sandbox and approvals |
| subagents and custom agents | observed feature | topology positions, independent research, dissent, planning, execution, and verification episodes | separate writable agents by worktree; isolate verifier context |
| hooks | observed feature, untested here | lifecycle observation, evidence capture, and fail-closed guards where the event supports enforcement | do not disguise advisory prompt text as a hard hook |
| sandbox and approvals | documented locally | lower `AuthorityEnvelope` filesystem, network, and command restrictions | the DotLn host remains the canonical authority source and must reject loss |
| MCP tools, apps, and browser/computer use | observed feature families | integrations and source/effect adapters | capability discovery precedes use; secrets stay outside portable builds |
| `codex exec --ephemeral` | observed | disposable worker episode | WO-004's later authenticated smoke completed outside the earlier blocking sandbox; ephemeral session-store absence was observed |
| `exec --json`, `--output-schema`, `--output-last-message` | observed for JSONL + schema; last-message file untested | typed result envelope, event stream, and final artifact capture | the schema-bound JSONL result passed; durable evidence persistence and independent model-selection proof remain host responsibilities |
| resume and fork commands | documented locally | continuation, repair, and deliberately branched investigation | never imply that an interactive session is durable orchestration |
| goals | observed feature, untested for DotLn | bounded persistence toward a declared objective | candidate convenience primitive; WorkOrder lifecycle stays canonical |
| workspace dependencies | observed feature, untested here | make runtime prerequisites explicit | dependency presence does not imply permission or semantic compatibility |

Official Codex documentation describes skills as reusable instruction bundles
with progressive disclosure, plugins as bundles that can include skills and
connections, subagents as parallel specialized workers, and `codex exec` as
the noninteractive surface with JSON event and schema options. The local
feature list establishes availability metadata only; every behavioral claim
still needs a fixture.

## Candidate lowering

One DotLn mechanism may intentionally lower into several Codex primitives.

| DotLn semantic | Candidate Codex realization | Host-retained responsibility |
|---|---|---|
| implementation doctrine | `AGENTS.md` plus narrowly selected reference files | version, provenance, precedence, and secret filtering |
| role or personality | custom-agent definition plus role skill | canonical role semantics and authority |
| active skill | explicit task skill, structured input, structured result | activation predicate, lifecycle, and effect validation |
| support | composable skill/reference contribution surfaced in the result schema | factor ordering, conflict resolution, and explanation |
| oppositional relation | isolated dissenting subagent or support skill with an explicit target claim | preserve both positions and adjudication evidence |
| `Do Nothing` active | a task path whose valid result is a reasoned no-op | prove observation, counterfactual, and absence of unauthorized effects |
| `Do Nothing` support | a required no-change alternative in proposal output | compare intervention cost and reversible alternatives |
| `Beware of Naive Interventionism` | support skill plus evidence fields for baseline, mechanism, reversibility, and second-order effects | policy gate for effects; advice alone cannot prevent mutation |
| `Default to True` / `Default to False` | opposite scoped factors in one PolarAxis, projected through a skill | evidence lattice, baseline, factor math, and final decision |
| WorkOrder | task prompt plus project doctrine, selected skills, and output schema | state machine, lease, retry, cancellation, and append |
| independent verification | fresh verifier subagent/session with separate context and evidence contract | choose verifier, enforce independence, decide acceptance |
| hard safety invariant | sandbox/approval policy, optionally a reviewed hook | canonical permission envelope and fail-closed compatibility check |
| integration | constrained MCP tool or app | credentials, allowlist, audit, idempotency, and result validation |
| community/runtime recipe | versioned plugin or portable skill bundle plus compatibility metadata | semantic hash, trust class, preview, sandbox, and promotion |

## First conformance ladder

Tests should start with inert fixtures and graduate only after the lower layer
passes. No test should require private configuration in committed artifacts.

1. **Inventory fixture — passed.** Capture CLI version and feature names; mark
   these as availability metadata, not behavioral proof.
2. **Instruction fixture.** In a temporary repository, prove the applicable
   `AGENTS.md` hierarchy and record exactly which instruction sources apply.
3. **Skill fixture.** Add a tiny repo-local skill that returns a recognizable,
   schema-valid support contribution; test explicit invocation first, then
   implicit activation and non-activation.
4. **Structured episode transport — observed; reusable fixture pending.**
   WO-004 ran an ephemeral, read-only `codex exec` with JSONL and an output
   schema successfully in a context where app-server initialization was
   permitted. A committed temporary-repository conformance fixture that
   persists and revalidates the stream still remains to be built.
5. **Opposition fixture.** Give maker and dissenter the same frozen claim,
   isolate their contexts, then verify that adjudication preserves evidence
   and disagreement rather than averaging prose.
6. **Authority fixture.** Ask a skill-guided worker to perform a denied effect;
   prove the sandbox or host rejects it even when the prompt encourages it.
7. **Lifecycle fixture.** Cancel, resume, and expire an episode; prove its
   selected skills and permissions do not persist outside that lifecycle.
8. **Recipe fixture.** Preview a local package, show every primitive and
   permission it introduces, sandbox it, then uninstall it without residue.

The smallest useful prototype is steps 2–4: one instruction hierarchy, one
support skill, and one schema-bound read-only episode. The transport behavior
for step 4 is now observed, but the reusable fixture and steps 2–3 remain. That
is enough scope to test the compiler-target idea without prematurely building
a marketplace or a full coordination universe.

## Sources

- Local measurements: [`environment.md`](environment.md), especially the
  Codex CLI table.
- [Codex skills](https://learn.chatgpt.com/docs/build-skills.md)
- [Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins.md)
- [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents.md)
- [Codex noninteractive mode](https://learn.chatgpt.com/docs/non-interactive-mode.md)
