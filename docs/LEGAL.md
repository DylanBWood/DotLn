# Legal and licensing posture

**Status:** interim project record, last reviewed 2026-09-03. This document is
not a license or legal advice.

## Current state

DotLn currently has no `LICENSE`, `COPYING`, third-party notice, contributor
agreement, or project-wide license metadata. The repository is source-visible,
but it is not presently offered as open-source software. Under GitHub's own
guidance, default copyright rules apply when a repository has no license; the
author retains the copyright rights in original expression and grants no general
permission to use, modify, redistribute, or create derivative works. GitHub's
Terms separately permit viewing and reproduction through GitHub functionality,
including in-service forking of public repositories. Public visibility and a
GitHub fork button therefore do not amount to a general open-source license.

This is the observed interim state, not a permanent licensing decision. The
project is currently personal research by and for its operator, with no assumed
outside contributor, package consumer, hosted user, or commercial customer.
Whether it will ever be sold is not the deciding trigger: contribution,
distribution, and collection of other people's data create questions before
revenue does.

The root package and `@dotln/skeleton` declare `"private": true`.
`@dotln/kernel` currently does not, and no workspace declares
`"license": "UNLICENSED"`. npm recommends `UNLICENSED` plus `private: true`
when an unpublished package grants no usage rights. Correcting that accidental-
publication gap is an implementation change for a bounded follow-on, not a
silent documentation edit inside WO-016.

As a package-lock observation rather than an independent audit of upstream
license texts, the current external packages are development-only:
`@types/node`, `undici-types`, and Prettier are recorded as MIT, and TypeScript
as Apache-2.0. The skeleton's only runtime dependency is the local kernel
workspace. Recheck the material actually shipped when any distribution exists.

## Interim direction

Until the operator makes an explicit choice:

- do not describe DotLn as open source or infer reuse permission from repository
  visibility;
- do not publish an npm package, executable, container, dataset, or bundled
  asset;
- do not accept outside code or prose contributions under assumed terms;
- keep all package workspaces private and mark the intended license status
  explicitly when the follow-on lands; and
- preserve authorship, dependency, inspiration, quotation, and copied-material
  provenance so a later decision is informed rather than archaeological.

An eventual choice should state its scope separately for code, documentation,
examples, datasets, art/assets, and trademarks. Candidate directions include:

| Direction                  | What it means at a high level                                                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep no license for now    | Default copyright remains; useful for personal research, but ambiguous if collaboration begins. Add a prominent factual notice and revisit at the first trigger.                        |
| MIT                        | Short permissive software license; permits broad reuse and commercial derivatives while requiring preservation of its notice.                                                           |
| Apache License 2.0         | Permissive software license with explicit patent terms, change/notice duties, and no trademark grant; a candidate if meaningful outside code contribution begins.                       |
| Source-available or custom | Can reserve selected uses, but restrictions mean it is not open source. Custom terms add interpretation, tooling, compatibility, and contributor friction and need professional review. |

No option is selected by this document. If code and documentation eventually
use different licenses, their boundaries must be obvious. Creative Commons
recommends software-specific licenses for software rather than using a CC
license for code.

## Decision gates

Choose and implement the legal posture before the first of these events:

1. accepting an outside contribution;
2. publishing a package, executable, container, dataset, model, or asset bundle;
3. operating a hosted or multi-user service;
4. collecting another person's account data, prompts, logs, telemetry, or other
   personal information;
5. selling, licensing, fundraising around, or materially marketing DotLn; or
6. investing substantially in the DotLn or feature-brand names.

The bounded decision should include:

- the copyright-holder and notice text;
- code and documentation license(s), or an explicit continued no-license
  posture;
- package `private` and `license` metadata plus publication guards;
- the outbound project license and matching inbound contribution rule before
  accepting work; optionally a DCO to certify provenance, or a lawyer-reviewed
  CLA if additional rights such as relicensing are needed;
- an inventory of material actually distributed and any required
  `THIRD_PARTY_NOTICES`;
- a non-affiliation/trademark statement and a check for confusingly similar
  product names before serious brand investment; and
- privacy/data-practice review before any app or service collects, retains, or
  transmits another person's data, including telemetry or prompts; and service-
  terms review before offering an app or hosted service to others, as applicable.

## Inspiration is not incorporation

The public [sources and inspirations register](lineage/inspirations.md) answers
what shaped the work. It is intentionally candid and may use exact titles and
product names to identify a source. That does not import the source's code,
assets, prose, dialogue, data, logo, trade dress, license, or endorsement.

Copyright protects original expression, not an idea, system, or method of
operation. Trademark identifies the source of goods or services rather than
granting ownership of an idea in the abstract. Those distinctions support
honest attribution; they do not settle whether a particular quote, adaptation,
name, or distributed artifact is lawful. Exact source-derived expression and
all incorporated material still require item-specific review.

The source-associated phrasebook has a bounded current disposition rather than
blanket clearance. Its recorded entries are individual words or brief
expressions; U.S. Copyright Office Circular 33 identifies words and short
phrases as material copyright does not protect. The operator's authorization
covers whatever original selection, arrangement, and annotations the
compilation contributes, while 17 U.S.C. § 103(b) makes clear that compilation
rights do not enlarge rights in preexisting material. The inspirations register
records the per-item-class status. Current use is limited to attributed,
non-affiliated documentation of an unimplemented candidate—no show footage,
images, audio, scripts, logos, or longer dialogue. Trademark/source-identifying
use, generated imitation, marketing, commercial distribution, a rights claim,
or materially longer expression reopens review. This is a project disposition,
not a legal opinion.

## Authoritative starting points

- [GitHub: Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [GitHub Terms of Service, User-Generated Content](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#d-user-generated-content)
- [U.S. Copyright Office: What does copyright protect?](https://www.copyright.gov/help/faq/faq-protect.html)
- [U.S. Copyright Office Circular 33: Works Not Protected by Copyright](https://www.copyright.gov/circs/circ33.pdf)
- [17 U.S.C. § 103: Compilations and derivative works](https://www.copyright.gov/title17/92chap1.html#103)
- [U.S. Copyright Office: Fair Use Index](https://www.copyright.gov/fair-use/)
- [npm `package.json` documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/)
- [Open Source Initiative: The Open Source Definition](https://opensource.org/osd)
- [Open Source Initiative: MIT License](https://opensource.org/license/mit)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [OSI: common reasons proposed licenses are rejected](https://opensource.org/licenses/common-reasons-for-rejection-of-licenses)
- [SPDX license list](https://spdx.org/licenses/)
- [Creative Commons FAQ](https://creativecommons.org/faq/)
- [USPTO: What is a trademark?](https://www.uspto.gov/trademarks/basics/what-trademark)
- [USPTO: likelihood of confusion](https://www.uspto.gov/trademarks/search/likelihood-confusion)
- [Developer Certificate of Origin 1.1](https://developercertificate.org/)
- [FTC: app developers—start with security](https://www.ftc.gov/business-guidance/resources/app-developers-start-security)

If the choice becomes consequential, use qualified counsel rather than treating
this research note as a substitute.
