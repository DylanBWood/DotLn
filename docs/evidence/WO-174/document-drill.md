# WO-174 document-input drill

Observed 2026-09-30T17:15:05.482Z; two isolated copies of executor base dd141ad16dbd60e39ffb5afab21df57689cf4b79, built with their own @dotln workspace links. One copy keeps base code; the other carries the implementation. Only the first bold **Cadence term in docs/product/02-domain-model.md changes to **Rhythm.

| Subject | Identity before | Identity after |
| --- | --- | --- |
| Base | 73acb7520bba8e9698c5ad7285a26a04efdfc07d0d6dc318a509fc8b7fd52fa9 | 73acb7520bba8e9698c5ad7285a26a04efdfc07d0d6dc318a509fc8b7fd52fa9 |
| Implementation | 3f3e5f822aade754d7a4ec9e68bb9fc56e1a2316e25ed5d0bbe88166dd2c0024 | 3f3e5f822aade754d7a4ec9e68bb9fc56e1a2316e25ed5d0bbe88166dd2c0024 |

Both identities are unchanged. The focused base command node --test --test-reporter=tap --test-name-pattern='right cell names an entry' packages/kernel/dist/test/ac7-readme-map.test.js passes before (exit 0) and fails after (exit 1) the edit.

In the implementation copy, publication TOC source locks are refreshed with check-publication --print-locks so publication preflights can reach the kernel case. That bookkeeping changes only excluded document bytes. npm run test:docs exits 1 and fails kernel-docs on the newly tagged case:

```text
PROGRESS [skeleton-docs] 0.1 s # Subtest: packages/skeleton/dist/test/artifact-identity.test.js
PROGRESS [kernel-docs] 0.2 s not ok 7 - [document] AC7 evidence: every README map row's right cell names an entry present in docs/product/02-domain-model.md
PROGRESS [lineage-fixtures] 0.5 s # Subtest: index counts lead memberships, wrapped labels and prose-only/reference sections
PASS lineage-fixtures 0.53 s
PROGRESS [console-docs] 0.0 s started
FAIL kernel-docs 0.78 s
  [kernel-docs] TAP version 13
  [kernel-docs] 1..0
  [kernel-docs] # Subtest: packages/kernel/dist/test/ac1-purity.test.js
  [kernel-docs] ok 1 - packages/kernel/dist/test/ac1-purity.test.js
  [kernel-docs]   ---
  [kernel-docs]   duration_ms: 40.886959
  [kernel-docs]   type: 'test'
  [kernel-docs]   ...
  [kernel-docs] 1..0
  [kernel-docs] # Subtest: packages/kernel/dist/test/ac2-replay-store.test.js
  [kernel-docs] ok 2 - packages/kernel/dist/test/ac2-replay-store.test.js
  [kernel-docs]   ---
  [kernel-docs]   duration_ms: 58.405625
  [kernel-docs]   type: 'test'
  [kernel-docs]   ...
  [kernel-docs] 1..0
  [kernel-docs] # Subtest: packages/kernel/dist/test/ac3-cadence.test.js
  [kernel-docs] ok 3 - packages/kernel/dist/test/ac3-cadence.test.js
  [kernel-docs]   ---
```

After that red document gate, the four product package rows run from the same built copy through scheduleSuites at concurrency 2, using their declared document skip and guard. The build barrier records that the copy is already built. Every package passes with zero excluded-read observations:

| Product package | Exit | Observed seconds | Excluded reads |
| --- | ---: | ---: | ---: |
| kernel | 0 | 0.455 | 0 |
| compiler | 0 | 0.787 | 0 |
| console | 0 | 18.238 | 0 |
| skeleton | 0 | 329.299 | 0 |

The drill copies preserve their changed documents; the working product 02 is unchanged. This is evidence about the Node fs observation set, not a non-Node filesystem trace.
