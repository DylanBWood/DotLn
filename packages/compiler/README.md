# `@dotln/compiler` v0.1.0

The pure DotLn composition compiler. It has zero runtime dependencies and no
I/O: callers pass a `LoadoutGraph` plus an explicit environment and receive a
compiled program or inspectable diagnostics. The skeleton CLI is the current
host adapter that prints its projections.

## What v1 compiles

The public type surface covers the full graph boundary: `Identity`, `Role`,
`Container`, `ActiveMechanic`, `SupportFacet`, `Link`, `LinkGroup`,
`ExplicitPipeline`, `AmbientEffect`, `ResourceModel`, `Phenotype`, `PolarAxis`,
and `AuthorityEnvelope`. Executable lowering is deliberately narrower: one
active mechanic, at most one participating link group, at most one explicit
pipeline in that group, and the emissions exercised by the Repo Gardener +
Seiri scenario.

`compileLoadout` performs the four composition steps in order:

1. normalize identity, role, linked supports, and the typed-but-opaque axes into
   a phenotype;
2. type-check component references, tags, and required capabilities;
3. reject declared/hard/non-commuting conflicts or resolve soft claims through
   the declared nine-level precedence into effective claims (with authority
   winners applied to the runtime envelope and WorkOrder operations); and
4. emit the WorkOrder, permissions, schemas, cadence, statechart guards,
   verification episodes, prompt residue, manifest, trace, and per-support
   costs.

An incompatible support returns `SUPPORT INACTIVE`, the exact missing
capability or tag family, and concrete structured corrections. It is never
silently dropped.

Compiler v1 accepts exact authority and operation names. It rejects wildcard
patterns because the kernel's broad deny matching cannot yet represent a safe
exact-effect exception chosen by precedence.

## Views and semantic identity

The editable v1 views are code DSL (`defineLoadout`), function table, and
statechart JSON. Each has an explicit codec and normalizer. Object-key order and
set-like graph order are non-semantic; WorkOrder prose order and
`ExplicitPipeline.orderedSupportFacetIds` remain semantic. The hash is
`fnv1a64:` plus the 16-digit lowercase FNV-1a-64 digest of the UTF-8 canonical
JSON encoding of the normalized compiled program.

For the shipped Seiri fixture all three views compile to:

```text
fnv1a64:9ca8d0229c6bd8db
```

Run `npm run skeleton -- --compiled-diff` from the repository root for the
three-view equality receipt and the exact RPG item tooltip. Run
`npm run test --workspace @dotln/compiler` for the focused compiler suite.

PolarAxis evaluation, multi-active lowering, saved builds, compatibility
migration, set bonuses, and interactive editing remain deferred. Their types do
not imply executable support.
