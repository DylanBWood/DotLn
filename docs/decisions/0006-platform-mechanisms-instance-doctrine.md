# ADR-0006 — Platform mechanisms and personal-instance doctrine are separate

**Status:** Accepted (2026-09-03)

## Context

DotLn is both a reusable platform and the vehicle for the author's first
personal implementation. Both live in this repository. The blueprint already
distinguishes common legos from local secret sauce, but several universal-
sounding passages still turn the personal implementation's authority,
verification, replay, safety, and source-handling choices into apparent platform
law.

During WO-016 ideation, the operator clarified the intended boundary. A private
owner may deliberately want a low-ceremony or fully permissive implementation,
including the freedom to accept risks the author's implementation refuses. The
platform is not the moral or operational parent of its owner. Its job is to make
useful mechanisms available and intelligible, not to force every installation
to inherit the founding instance's doctrine.

## Decision

1. Treat **DotLn platform** and **the author's personal implementation** as two
   explicitly labeled layers in one repository. Shared packages, schemas, and
   compatibility contracts belong to the platform. Saved builds, operating
   policy, security posture, authority profiles, evidence standards, retention,
   source treatment, and workflow defaults belong to an implementation unless a
   narrower platform contract explicitly says otherwise.
2. The platform supplies composable mechanisms for authority, evidence,
   verification, event history, replay, audit, rich inspection, and safety
   policy. It does not require every implementation to equip all of them or to
   use the author's thresholds and precedence. At a DotLn interoperability
   boundary, an implementation that declares one of those capabilities uses the
   corresponding contract; omission is allowed and is represented as absence,
   not as the same capability under a weaker name. A private implementation may
   expose no such boundary or rich inspector at all.
3. The current personal implementation keeps its existing opinionated loadout:
   hard constraints outside the model, evidence before a completion claim,
   scoped authority, replayable records, independent review, and the repository's
   Clean Room boundary. Those remain binding for work in this repository and for
   this implementation. They are reference behavior and reusable components,
   not a mandatory policy bundle for every DotLn owner.
4. Support an eventual **owner-sovereign profile** (working label) as instance
   content. A
   controlling owner may choose broader authority, fewer confirmations, weaker
   or absent verification, reduced or absent retention and replay, different
   source policy, or a deliberately unrestricted DotLn policy for systems and
   resources they control. It need not ship enabled or preconfigured. The exact
   name, activation ceremony, persistence, and implementation are not selected
   here.
5. “Unrestricted” describes the absence of DotLn-imposed instance policy. It is
   not a promise that a provider model, harness, operating system, destination,
   account, or external service will permit every action. Those are observed
   environment capabilities and independent control planes. An owner may choose
   different adapters or locally controlled models; DotLn cannot silently erase
   a boundary it does not own.
6. The Clean Room rule in `AGENTS.md`, ADR-0001, and the current pattern-library
   definition is repository and personal-implementation governance. It remains
   non-negotiable for contributions here but is not a universal runtime
   restriction automatically imposed on unrelated DotLn implementations.
7. Start the separation in documentation and capability declarations before
   selecting a physical package layout. Every material claim should make clear
   whether it describes a platform mechanism, the personal implementation's
   chosen loadout, or a candidate another owner may select. A later work order
   may separate directories, packages, manifests, and conformance suites using
   representative evidence.

## Consequences

- Principles 5, 6, and 10 continue to govern the author's implementation; they
  no longer imply that an implementation without those policies is forbidden
  from using the platform.
- ADR-0007 replaces Principle 10's former one-way absence rule: presence and
  elapsed absence are policy inputs, and an owner may preauthorize bounded
  growth, shrinkage, reset, or looping rather than inherit mandatory decay.
- Principle 18 becomes the controlling summary: common mechanism does not mean
  common doctrine. Platform correctness tests bind the behavior of a mechanism
  when used; they do not silently activate it.
- The personal harness posture in ADR-0003 through ADR-0005 does not change.
  Those records already describe local choices rather than a DotLn runtime
  guarantee.
- A permissive implementation can honestly say that a result is owner-accepted,
  unverified, unrecorded, or non-replayable. It does not need to manufacture the
  stricter implementation's evidence in order to run.
- Enterprise, regulated, shared, and private single-owner deployments may ship
  different saved profiles over the same platform mechanisms.
- WO-016 adds no owner-sovereign runtime mode, authority wildcard, settings
  change, or package split. This decision changes the blueprint boundary and
  nominates later implementation work.

## Alternatives rejected

- **Bake the author's guardrail set into platform conformance.** This mistakes
  one valuable implementation for the only legitimate use of the mechanisms.
- **Remove authority, evidence, and replay primitives from the platform.** Owner
  sovereignty is served by choice among composable capabilities, not by making
  stricter implementations impossible.
- **Split the platform and personal implementation into separate repositories
  now.** The conceptual boundary is ready; the physical boundary needs a
  representative package and deployment shape before it is chosen.

## Amendments

None.
