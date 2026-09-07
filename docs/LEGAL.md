# Legal and licensing posture

**Status:** project record, last reviewed 2026-09-06. The license posture was
decided on 2026-09-06 (see §Decision — 2026-09-06); the remaining gates below
stay open. This document is not a license or legal advice.

## Current state

Until 2026-09-06 DotLn had no `LICENSE`, `COPYING`, third-party notice,
contributor agreement, or project-wide license metadata. The repository was
source-visible but not offered as open-source software. Under GitHub's own
guidance, default copyright rules apply when a repository has no license; the
author retains the copyright rights in original expression and grants no general
permission to use, modify, redistribute, or create derivative works. GitHub's
Terms separately permit viewing and reproduction through GitHub functionality,
including in-service forking of public repositories. Public visibility and a
GitHub fork button therefore do not amount to a general open-source license.
From the 2026-09-06 planning pull request onward, `LICENSE` (Apache-2.0),
`LICENSE-docs` (CC-BY-4.0), and `NOTICE` are present; package metadata and
the publication guard follow in WO-038. The paragraphs below record the state
that decision replaced.

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
license texts, `@types/node`, `undici-types`, and Prettier are recorded as MIT,
and TypeScript as Apache-2.0. WO-011 (2026-09-06) makes the already pinned
TypeScript `5.4.5` package a skeleton runtime dependency for parsed source-comment
checks, alongside its local compiler/kernel workspace dependencies. The other
external packages remain development-only. Kernel and compiler have no runtime
dependencies. Recheck the material actually shipped when any distribution exists.

**2026-09-06 observation (phase-two planning pass):** the operator intends
`DotLn-Enterprise-Starter`, an exported launchpad kit of this repository's
control plane and operating documents, to be forked by several external
organizations as the base of their own workflows, with the first external
fork expected within about a week. An external fork is distribution to
others, which is this document's gate. The decision below was taken the same
day.

## Decision — 2026-09-06

The operator decided the license posture during the 2026-09-06 planning pass
and chose to land the license files in that pass's pull request, leaving
package metadata, the publication guard, and the contribution document to
[WO-038](work-orders/WO-038-license-posture-lands.md). This is a project
decision recorded by its author; it is not legal advice.

- **Copyright holder and notice.** Dylan Wood. The notice text is in
  `NOTICE` at the repository root; the SPDX identifiers below name the
  licenses, and the license files hold the canonical texts, byte-identical
  to the publishers' plain-text editions. Pinned hashes, which WO-038's check
  verifies:
  - `LICENSE` — `sha256:cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`
  - `LICENSE-docs` — `sha256:9ba9550ad48438d0836ddab3da480b3b69ffa0aac7b7878b5a0039e7ab429411`
  - `NOTICE` — `sha256:645cf84db4b0b544bdb8e594d7048ca4ca42da24623b251e6072287ea420d55c`
- **Code.** Apache License 2.0 (`Apache-2.0`), in `LICENSE`. Scope: every
  source, script, configuration, fixture, corpus, and test file in this
  repository, the exported launchpad kit, and code samples embedded in the
  documentation.
- **Documentation.** Creative Commons Attribution 4.0 International
  (`CC-BY-4.0`), in `LICENSE-docs`. Scope: the prose under `docs/`, the
  README, work orders, verification and final-review reports, evidence prose,
  the ledger, and the operating documents the kit exports. Code samples
  inside documentation are also available under Apache-2.0. No committed
  images or other assets exist at this decision; an asset added later takes
  CC-BY-4.0 unless its file says otherwise.
- **Names.** Apache-2.0 §6 grants no trademark rights. The names DotLn,
  προτείνω (protíno), UIFA, and any feature names are not licensed for use as
  a source identifier; forks and derivatives may state that they are based on
  DotLn without implying affiliation or endorsement. No confusingly-similar-
  name search has been run; that check precedes serious brand investment as
  the gate below still says.
- **Inbound contributions.** Outside contributions are accepted under the
  same outbound licenses with a Developer Certificate of Origin 1.1
  `Signed-off-by` line on each commit. No contributor license agreement; no
  relicensing right is sought. The operator's own commits carry no sign-off
  requirement. WO-038 writes `CONTRIBUTING.md` and the publish-time check.
- **Distribution.** Workspaces stay `private: true` until a separate package
  publication decision; the license is the grant on the source, not a
  distribution channel. Exporting the kit into the operator's own or an
  external organization's repository carries `LICENSE`, `LICENSE-docs`, and
  `NOTICE` as kit files.
- **Third-party material.** Nothing vendored. Development dependencies are
  MIT (`@types/node`, `undici-types`, Prettier) and Apache-2.0 (TypeScript),
  observed from the lockfile; a `THIRD_PARTY_NOTICES` file becomes due when a
  built or bundled artifact is distributed. The source-associated phrasebook
  keeps the bounded disposition in §Inspiration is not incorporation; the
  documentation license covers the operator's compilation and does not
  enlarge rights in the underlying short expressions.
- **Privacy and service.** Not triggered: DotLn is local-first, collects no
  one's data, and offers no hosted service. Each launchpad fork's control
  logs and evidence belong to that fork's owner.
- **Operator-owned check.** The operator intends to use a fork at work. Whether
  an employment agreement's intellectual-property clause affects a personal
  project used at work is the operator's question to settle with their own
  agreement or counsel; this record does not answer it.

What this discharges from the gate below: the copyright notice, the code and
documentation licenses, and the inbound rule (pending WO-038's document and
check). What remains: package `license` and `private` metadata plus the
publication guard (WO-038), `THIRD_PARTY_NOTICES` at first bundled
distribution, the name-confusion check before brand investment, and the
privacy and service reviews if a hosted or data-collecting surface ever
appears.

## Interim direction

_Superseded on 2026-09-06 by the decision above; kept as the record of the
reasoning that preceded it. The candidate table below is history, not an open
choice._

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

The bounded decision should include (status as of 2026-09-06 in brackets):

- the copyright-holder and notice text [decided; `NOTICE`];
- code and documentation license(s), or an explicit continued no-license
  posture [decided; Apache-2.0 and CC-BY-4.0];
- package `private` and `license` metadata plus publication guards [WO-038];
- the outbound project license and matching inbound contribution rule before
  accepting work; optionally a DCO to certify provenance, or a lawyer-reviewed
  CLA if additional rights such as relicensing are needed [decided: DCO 1.1,
  no CLA; `CONTRIBUTING.md` and the publish-time check are WO-038];
- an inventory of material actually distributed and any required
  `THIRD_PARTY_NOTICES` [open until a bundled artifact is distributed];
- a non-affiliation/trademark statement [decided; names reserved] and a check
  for confusingly similar product names before serious brand investment
  [open]; and
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
