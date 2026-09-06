# Corpus

This tree holds committed, reproducible evidence material. It has two distinct
uses:

- `sanitized/` is reserved for synthesized source/incident material governed by
  the architecture corpus policy. Raw material remains local-only under
  `docs/intake/` and is never copied here.
- `fixtures/`, `harness/`, and `manifests/` hold generated executable corpora.
  These inputs are original test data, contain no intake content, and regenerate
  byte-for-byte from recorded seeds.
- `mutation/` holds the deterministic candidate census, selected campaign,
  runner, append-only kill matrix, and derived survivor findings. Its
  [runbook and outcome](mutation/README.md) distinguish measured suite detection
  from compile noise and unmeasured candidates. Mutation happens only in owned
  temporary fixtures; shipped source and tests are unchanged.

WO-101 establishes the generated-corpus layout. Its ID fixtures commit the full
hash and command-identity corpus and are an independent oracle; the exact ID
test runs in the root `npm test` evidence chain after the kernel build. The
Program fixtures contain a bounded golden sample plus complete Invoke/Await
decision tables generated from the shipped behavior. That lane is explicitly
frozen and remains a manual golden-master check outside `npm test`; promotion
requires a separately reviewed change. `manifests/WO-101.json` pins bounds,
alphabets, predicate-registry data, counts, budgets, fixture hashes, base commit,
and toolchain profile.

From the repository root, regenerate or check the committed data with:

```bash
node corpus/harness/generate-program-corpus.mjs --seed wo101-seed-20260901 --write
node corpus/harness/generate-id-corpus.mjs --seed wo101-seed-20260901 --write
node corpus/harness/generate-program-corpus.mjs --seed wo101-seed-20260901 --check
node corpus/harness/generate-id-corpus.mjs --seed wo101-seed-20260901 --check
node --test corpus/harness/wo101-id-corpus.test.mjs
# Manual frozen Program lane:
node --test corpus/harness/wo101-program-corpus.test.mjs
```

The generated layout extends `docs/product/03-architecture.md` §Corpus policy.
WO-108's operator-authorized scope amendment synchronizes that policy with the
existing generated corpora and the mutation lane; the historical WO-101 source
and evidence remain unchanged.
