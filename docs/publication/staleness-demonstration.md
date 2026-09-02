# Publication staleness demonstration

**Run date:** 2026-09-01  
**Edition source base revision:** `f2a4b232e1868691398964433c7e373fca4b84bb`  
**Probe source:**
[Authority and honesty rules](../product/08-publication-compiler.md#authority-and-honesty-rules)

**Evidence discontinuity:** Sections 1–6 preserve earlier same-day captures.
Later authorized product write-backs refreshed both edition locks, so their
recorded lock values are historical rather than the current stored baseline. The
latest recapture at the end of this document is the current evidence; earlier
transcripts remain visible instead of being back-filled.

## Mechanism under test

`scripts/check-publication.mjs` extracts each edition's unique linked blueprint
headings, sorts the `file#anchor` keys, normalizes only line endings and the
terminal newline of each heading subtree, and hashes the aggregate with SHA-256.
The stored edition lock is therefore metadata over the existing Markdown link
graph's exact current source bytes, not a `Claim` record or publication IR. The
separate source base revision records where every bootstrap claim link must also
resolve; it is provenance, not the freshness hash.

The normal command requires every edition lock to match. The `--expect-stale`
mode is a test aid that succeeds only when both bootstrap editions report
`STALE`. Both modes also check heading-index coverage, dual-voice link parity,
base-revision and current link resolution, and each edition link's audience tag.

## 1. Current baseline

The source file's pre-probe hash was:

```text
eb71f5d6fa4ebfdc3a666bfd3d822bbca7199fbcb9656aaabef823c410884a85  docs/product/08-publication-compiler.md
```

```console
$ npm run publication:check
PASS index coverage: 125/125 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 26 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks
```

## 2. One deliberate source-claim change

Using `apply_patch`, the first authority rule was temporarily changed from
requiring a reviewed source and applicable executable evidence to additionally
requiring an accountable reviewer:

```diff
-   claim links back to reviewed source and, where applicable, executable
-   evidence.
+   claim links back to a reviewed source, an accountable reviewer, and, where
+   applicable, executable evidence.
```

That produced a different source-file hash:

```text
e5a7aff8588e7c11ebb6d16dc5a37dd0eee1c264ff1b060943d35d12b6e5c98c  docs/product/08-publication-compiler.md
```

The expected-stale check named both audience editions:

```console
$ npm run publication:check -- --expect-stale
PASS index coverage: 125/125 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
STALE everyday-ai-user-toc.md: source lock d7af784805e43d706515e9338cbf38785a6a18c594b44e5f5d03ac50e3e0bfb0; current 23efc43f304d5979946d675b96ec1cf78c7280a0dd792a546bc86461bae7ba70
STALE software-engineer-toc.md: source lock b204c48e6f24f60ad9b3212ae0718f636a9c9f1e23d32a20811382826eacb072; current 0639568d51c4e8bf0976eab2a2c1ea6c1f70b90c840d8c7bd45181689dc7230f
PASS expected-stale proof: 2/2 editions flagged stale
PASS publication bootstrap checks
```

## 3. Exact inverse patch and restored baseline

The temporary clause was removed with the exact inverse `apply_patch`. The
source-file hash returned to its pre-probe value:

```text
eb71f5d6fa4ebfdc3a666bfd3d822bbca7199fbcb9656aaabef823c410884a85  docs/product/08-publication-compiler.md
```

The normal check returned both editions to `CURRENT` with the same 125-heading
coverage and three identical dual-voice links shown in step 1.

## 4. Post-write-back repair recapture

After all authorized product write-backs, the source file still had the same
pre-probe hash:

```text
eb71f5d6fa4ebfdc3a666bfd3d822bbca7199fbcb9656aaabef823c410884a85  docs/product/08-publication-compiler.md
```

The refreshed baseline and shipped locks were:

```console
$ npm run publication:check
PASS index coverage: 127/127 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 26 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks

$ npm run publication:check -- --print-locks
PASS index coverage: 127/127 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
LOCK everyday-ai-user-toc.md: sha256:8fd635b0a34561ed0af1705967e0d97845d5e29877f31e048782da54340018f2
LOCK software-engineer-toc.md: sha256:95388b3392ec179d34c5dcfdcb692afa5bacaa670c3e5b3b4723c6246391528e
PASS publication bootstrap checks
```

The exact source-claim patch from §2 again produced the documented probe hash
and made both refreshed editions stale:

```text
e5a7aff8588e7c11ebb6d16dc5a37dd0eee1c264ff1b060943d35d12b6e5c98c  docs/product/08-publication-compiler.md
```

```console
$ npm run publication:check -- --expect-stale
PASS index coverage: 127/127 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
STALE everyday-ai-user-toc.md: source lock 8fd635b0a34561ed0af1705967e0d97845d5e29877f31e048782da54340018f2; current 271663764325835cf9e227722dbc814700b3602c0e755fe05dbfface12e34bbb
STALE software-engineer-toc.md: source lock 95388b3392ec179d34c5dcfdcb692afa5bacaa670c3e5b3b4723c6246391528e; current e59b443c1c0dffa569d8c8447209c5c83d3bcf64be09d4f864344ec73e3644de
PASS expected-stale proof: 2/2 editions flagged stale
PASS publication bootstrap checks
```

The exact inverse patch restored the pre-probe hash. A final normal check
returned both editions to `CURRENT` with 127/127 index coverage and three
identical dual-voice links, proving the delivered tree contains no probe change.

## 5. Final repair and ideation recapture

After the remaining authorized mission, quench, Flow Steward, temporal-response,
RxJS-lowering, and work-order-navigation write-backs were formatted, the source
file retained the established pre-probe hash:

```text
eb71f5d6fa4ebfdc3a666bfd3d822bbca7199fbcb9656aaabef823c410884a85  docs/product/08-publication-compiler.md
```

The final baseline and stored locks were:

```console
$ npm run publication:check
PASS index coverage: 133/133 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 27 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks

$ npm run publication:check -- --print-locks
PASS index coverage: 133/133 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
LOCK everyday-ai-user-toc.md: sha256:2796e321fab428e19f10d654ff556a24e67c9e911cc4ec762ec42a5ef062b3c6
LOCK software-engineer-toc.md: sha256:09cc5f8c7f07ca889dfc8c7b7ddd29ea157fee66e93de0a33e8bc7ed4e819357
PASS publication bootstrap checks
```

The exact source-claim patch from §2 again produced the documented probe hash
and made both final editions stale:

```text
e5a7aff8588e7c11ebb6d16dc5a37dd0eee1c264ff1b060943d35d12b6e5c98c  docs/product/08-publication-compiler.md
```

```console
$ npm run publication:check -- --expect-stale
PASS index coverage: 133/133 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
STALE everyday-ai-user-toc.md: source lock 2796e321fab428e19f10d654ff556a24e67c9e911cc4ec762ec42a5ef062b3c6; current 319892dc216ff2391c5caa5681bf606631936f5cfde500c5742f81cab518e3a3
STALE software-engineer-toc.md: source lock 09cc5f8c7f07ca889dfc8c7b7ddd29ea157fee66e93de0a33e8bc7ed4e819357; current 46dd5706f1917e4faafe543cb852996426ea579a6968cb6994f62dd2edf8d853
PASS expected-stale proof: 2/2 editions flagged stale
PASS publication bootstrap checks
```

The exact inverse patch restored the pre-probe hash. A final normal check
returned both editions to `CURRENT` with 133/133 index coverage, 27 and 42
linked source sections respectively, and three identical dual-voice links. The
delivered tree therefore contains no probe change.

## 6. Post-audit final recapture

The final semantic and execution-guide audit changed linked source text without
changing the authority-rule probe source. Its pre-probe hash remained:

```text
eb71f5d6fa4ebfdc3a666bfd3d822bbca7199fbcb9656aaabef823c410884a85  docs/product/08-publication-compiler.md
```

The refreshed locks and normal baseline were:

```console
$ npm run publication:check -- --print-locks
PASS index coverage: 133/133 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
LOCK everyday-ai-user-toc.md: sha256:bdd5c35bb2d580b2bc4d7b861c9d105a883410bfc12f43a5de27833bf362811e
LOCK software-engineer-toc.md: sha256:5d85534bdbfd58f523d56a1be3b4fed5fb3de7a4774c46a50fe6d968191d241b
PASS publication bootstrap checks

$ npm run publication:check
PASS index coverage: 133/133 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 27 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks
```

The exact source-claim patch from §2 produced the same documented probe hash and
flagged both final editions stale:

```text
e5a7aff8588e7c11ebb6d16dc5a37dd0eee1c264ff1b060943d35d12b6e5c98c  docs/product/08-publication-compiler.md
```

```console
$ npm run publication:check -- --expect-stale
PASS index coverage: 133/133 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
STALE everyday-ai-user-toc.md: source lock bdd5c35bb2d580b2bc4d7b861c9d105a883410bfc12f43a5de27833bf362811e; current 87dc5acc078ce6952a8b793c0fff7ee1029126fc782832cf8144030c8d2eb922
STALE software-engineer-toc.md: source lock 5d85534bdbfd58f523d56a1be3b4fed5fb3de7a4774c46a50fe6d968191d241b; current 09090dea85487c889ef1a797782988bcd9da198c3a64d519ee4cb7760b28c9f3
PASS expected-stale proof: 2/2 editions flagged stale
PASS publication bootstrap checks
```

The exact inverse patch restored the pre-probe hash. The final normal check
returned both editions to `CURRENT` at 133/133 coverage with no probe change in
the delivered tree.

## 7. Final ideation-batch recapture

The brain/hands, harness/orchestration, isolated-execution, LangGraph, and
foundation-first write-backs changed linked source text and added one indexed
product heading. The authority-rule probe source itself retained its established
pre-probe hash:

```text
eb71f5d6fa4ebfdc3a666bfd3d822bbca7199fbcb9656aaabef823c410884a85  docs/product/08-publication-compiler.md
```

The refreshed locks and normal baseline were:

```console
$ npm run publication:check -- --print-locks
PASS index coverage: 134/134 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
LOCK everyday-ai-user-toc.md: sha256:ceb1d6b8dceabbf73e4565da1795f0ae9ea0a23786194dd4295462fb266b203c
LOCK software-engineer-toc.md: sha256:1f6e1a733bb9d92aef16319fb39c2d20afe51da1548c82ad1ef41d84a63f656c
PASS publication bootstrap checks

$ npm run publication:check
PASS index coverage: 134/134 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 27 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks
```

The exact source-claim patch from §2 again produced the documented probe hash
and flagged both editions stale:

```text
e5a7aff8588e7c11ebb6d16dc5a37dd0eee1c264ff1b060943d35d12b6e5c98c  docs/product/08-publication-compiler.md
```

```console
$ npm run publication:check -- --expect-stale
PASS index coverage: 134/134 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
STALE everyday-ai-user-toc.md: source lock ceb1d6b8dceabbf73e4565da1795f0ae9ea0a23786194dd4295462fb266b203c; current 4518fd705776344152fbe6f72d06e07da809435195fb0e6f8aac17eb3f9d5792
STALE software-engineer-toc.md: source lock 1f6e1a733bb9d92aef16319fb39c2d20afe51da1548c82ad1ef41d84a63f656c; current 88eaf2d3baf07c0a5a8150c16f62395463dc1543c74c218d436c171a2cea8f31
PASS expected-stale proof: 2/2 editions flagged stale
PASS publication bootstrap checks
```

The exact inverse patch restored the pre-probe hash. The final normal check
returned both editions to `CURRENT` at 134/134 coverage with no probe change in
the delivered tree.

## 8. `προτείνω` ideation recapture

The shape-first synthesis rule, first-party application thesis, bounded product
cross-links, and current audience/status classifications added fourteen indexed
headings. The source-base revision and each edition's historical source
selection remained unchanged; review refreshed only the current-byte locks for
their existing linked source subtrees.

```console
$ npm run publication:check -- --print-locks
PASS index coverage: 148/148 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
LOCK everyday-ai-user-toc.md: sha256:a76f6fe7b502527236094075ee3cc11d2ef512698a473499d30b7c8625e75aa5
LOCK software-engineer-toc.md: sha256:305eae1ca115ecdbdf2cbe6cc6ccfd88693e93d2ad5a8047c7c871a6aa9256c1
PASS publication bootstrap checks

$ npm run publication:check
PASS index coverage: 148/148 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 27 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks
```

The earlier deliberate-patch captures remain the mechanism proof. This recapture
records the reviewed baseline after the new vision material without pretending
the two edition outlines now select the uncommitted-at-base `11-proteino.md`
chapter directly.

## 9. Clean Room composition recapture

The Clean Room active/support direction added one indexed Pattern Library
heading and changed already-linked composition, interface, and execution-guide
subtrees. The editions' source-base revision predates the new heading, so their
source selections do not link it directly; the audience/status index registers
it for a future edition-selection review. The existing linked subtrees received
new reviewed byte locks.

```console
$ npm run publication:check -- --print-locks
PASS index coverage: 149/149 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
LOCK everyday-ai-user-toc.md: sha256:3e4131fb1f795b2185209d6507b608331e1dd3a6fdbb9efba012a63e056f72a4
LOCK software-engineer-toc.md: sha256:4034d5836033e7e8306ff227949a87b904f6bea850271d2ed0ff26a0a58c04dd
PASS publication bootstrap checks

$ npm run publication:check
PASS index coverage: 149/149 product headings indexed
PASS dual-voice links: 3 identical claim links per voice
CURRENT everyday-ai-user-toc.md: 27 linked source sections match
CURRENT software-engineer-toc.md: 42 linked source sections match
PASS publication bootstrap checks
```

## Honest limit

This is conservative byte-level stale detection over linked heading subtrees. It
proves that linked source changed after an edition lock was reviewed; it does
not prove that two audience phrasings are semantically equivalent or
contradiction-free. Verification still compares facts, limitations, permissions,
status, and evidence across the two outlines and sample.
