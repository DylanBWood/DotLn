# WO-108 mutation findings

Base: `3dc19b7342ad03662172cf86663f406b96a43db4`. Generated from the append-only matrix; rerun `--report` to regenerate.

Executed 32/32; next: none. Compiled conclusive: 29; killed by test: 18; survived: 11. Compile kills: 2 (enumeration noise); timeouts: 1 (excluded from the conclusive denominator).

These are detection-gap candidates in the enumerated sites. A survivor may be equivalent or outside exercised inputs; no capability-strength or production-defect claim follows without triage. Historical seeds are expectations to remeasure, not predetermined verdicts.

- kernel: 6/6 selected; 5 test kills, 0 survivors (5 conclusive compiled), 1 compile kills, 0 timeouts.
- compiler: 14/14 selected; 7 test kills, 6 survivors (13 conclusive compiled), 1 compile kills, 0 timeouts.
- skeleton: 12/12 selected; 6 test kills, 5 survivors (11 conclusive compiled), 0 compile kills, 1 timeouts.

Selected operator observations (no ranking):

- arithmetic-swap: 1/1 selected; 1 test kills, 0 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- array-content-delete: 1/1 selected; 0 test kills, 1 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- comparison-swap: 2/2 selected; 0 test kills, 1 survivors (1 conclusive compiled), 1 compile kills, 0 timeouts.
- condition-force-true: 1/1 selected; 0 test kills, 1 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- condition-invert: 1/1 selected; 1 test kills, 0 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- condition-neuter: 21/21 selected; 12 test kills, 7 survivors (19 conclusive compiled), 1 compile kills, 1 timeouts.
- numeric-force-zero: 1/1 selected; 1 test kills, 0 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- numeric-off-by-one: 1/1 selected; 1 test kills, 0 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- ordered-array-deduplicate: 1/1 selected; 0 test kills, 1 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- statement-delete: 1/1 selected; 1 test kills, 0 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.
- trace-string-perturb: 1/1 selected; 1 test kills, 0 survivors (1 conclusive compiled), 0 compile kills, 0 timeouts.

## F-00001 — condition-force-true

Site: [packages/compiler/src/compile.ts:175](../../packages/compiler/src/compile.ts#L175). Mutant `M00001`; historical seed 1. 281/281 tests passed.

Claim to investigate: WO-008 AC1: the tag half of link compatibility rejects incompatible tags.

```diff
--- a/packages/compiler/src/compile.ts
+++ b/packages/compiler/src/compile.ts
@@ -175,3 +175,1 @@
-    const tagCompatible = support.supportedTags.some((tag) =>
-      active.tags.includes(tag),
-    );
+    const tagCompatible = true;
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00001
```

## F-00002 — condition-neuter

Site: [packages/compiler/src/compile.ts:408](../../packages/compiler/src/compile.ts#L408). Mutant `M00002`; historical seed 2. 281/281 tests passed.

Claim to investigate: WO-008 AC3: equal-precedence incompatible claims are rejected.

```diff
--- a/packages/compiler/src/compile.ts
+++ b/packages/compiler/src/compile.ts
@@ -408,1 +408,1 @@
-    if (tied !== undefined) {
+    if (tied !== undefined && Boolean(0)) {
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00002
```

## F-00005 — condition-neuter

Site: [packages/compiler/src/compile.ts:607](../../packages/compiler/src/compile.ts#L607). Mutant `M00005`; historical seed 5. 281/281 tests passed.

Claim to investigate: WO-008 graph validation: container socket-budget overflow is rejected.

```diff
--- a/packages/compiler/src/compile.ts
+++ b/packages/compiler/src/compile.ts
@@ -607,1 +607,1 @@
-    else if (group.linkIds.length > container.socketBudget)
+    else if (group.linkIds.length > Number.MAX_SAFE_INTEGER)
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00005
```

## F-00006 — ordered-array-deduplicate

Site: [packages/compiler/src/normalize.ts:313](../../packages/compiler/src/normalize.ts#L313). Mutant `M00006`; historical seed 6. 281/281 tests passed.

Claim to investigate: WO-008 normalization contract: explicit pipelines retain multiplicity.

```diff
--- a/packages/compiler/src/normalize.ts
+++ b/packages/compiler/src/normalize.ts
@@ -313,1 +313,1 @@
-  orderedSupportFacetIds: [...value.orderedSupportFacetIds],
+  orderedSupportFacetIds: [...new Set(value.orderedSupportFacetIds)],
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00006
```

## F-00007 — array-content-delete

Site: [packages/compiler/src/normalize.ts:103](../../packages/compiler/src/normalize.ts#L103). Mutant `M00007`; historical seed 7. 281/281 tests passed.

Claim to investigate: WO-008 round-trip contract: identity update laws survive normalization.

```diff
--- a/packages/compiler/src/normalize.ts
+++ b/packages/compiler/src/normalize.ts
@@ -103,1 +103,1 @@
-  updateLaws: [...value.updateLaws],
+  updateLaws: [],
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00007
```

## F-00017 — condition-neuter

Site: [packages/compiler/src/senses.ts:89](../../packages/compiler/src/senses.ts#L89). Mutant `M00017`. 281/281 tests passed.

Claim to investigate: WO-022 senses: unknown or duplicate equipped senses are rejected (compiler senses.test.ts).

```diff
--- a/packages/compiler/src/senses.ts
+++ b/packages/compiler/src/senses.ts
@@ -89,4 +89,4 @@
-  if (
-    senses.some((id) => !SENSE_IDS.includes(id)) ||
-    new Set(senses).size !== senses.length
-  )
+  if ((
+    senses.some((id) => !SENSE_IDS.includes(id)) ||
+    new Set(senses).size !== senses.length
+  ) && Boolean(0))
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00017
```

## F-00021 — condition-neuter

Site: [packages/skeleton/src/reactor.ts:1090](../../packages/skeleton/src/reactor.ts#L1090). Mutant `M00021`. 281/281 tests passed.

Claim to investigate: Beacon reactor: reachable observations receive the appropriate age reevaluation cadence (skeleton beacon.test.ts).

```diff
--- a/packages/skeleton/src/reactor.ts
+++ b/packages/skeleton/src/reactor.ts
@@ -1090,1 +1090,1 @@
-    if (age === "fresh" || age === "stale") {
+    if ((age === "fresh" || age === "stale") && Boolean(0)) {
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00021
```

## F-00025 — comparison-swap

Site: [packages/skeleton/src/verification.ts:77](../../packages/skeleton/src/verification.ts#L77). Mutant `M00025`. 281/281 tests passed.

Claim to investigate: WO-010 matrix projection derives verification streams from host-authored VerificationOpened events (skeleton verification.test.ts).

```diff
--- a/packages/skeleton/src/verification.ts
+++ b/packages/skeleton/src/verification.ts
@@ -77,1 +77,1 @@
-            event.type === "VerificationOpened" &&
+            event.type !== "VerificationOpened" &&
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00025
```

## F-00027 — condition-neuter

Site: [packages/skeleton/src/verification-protocol.ts:251](../../packages/skeleton/src/verification-protocol.ts#L251). Mutant `M00027`. 281/281 tests passed.

Claim to investigate: WO-010 admission requires failing evidence to support a failing criterion verdict (skeleton verification.test.ts).

```diff
--- a/packages/skeleton/src/verification-protocol.ts
+++ b/packages/skeleton/src/verification-protocol.ts
@@ -251,1 +251,1 @@
-    if (item.verdict === "fail")
+    if ((item.verdict === "fail") && Boolean(0))
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00027
```

## F-00029 — condition-neuter

Site: [packages/skeleton/src/beacon-perception.ts:191](../../packages/skeleton/src/beacon-perception.ts#L191). Mutant `M00029`. 281/281 tests passed.

Claim to investigate: WO-022 replay checks decoded Beacon fields against their captured metadata (skeleton senses.test.ts).

```diff
--- a/packages/skeleton/src/beacon-perception.ts
+++ b/packages/skeleton/src/beacon-perception.ts
@@ -191,1 +191,1 @@
-    if (canonicalStringify(decoded) !== canonicalStringify(observation.decoded))
+    if ((canonicalStringify(decoded) !== canonicalStringify(observation.decoded)) && Boolean(0))
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00029
```

## F-00032 — condition-neuter

Site: [packages/skeleton/src/feedback-source-comments.ts:33](../../packages/skeleton/src/feedback-source-comments.ts#L33). Mutant `M00032`. 281/281 tests passed.

Claim to investigate: WO-011 source-comment traversal treats JSDoc as comment trivia, without revisiting it as a token subtree (skeleton feedback-fixtures.test.ts); this guard may be redundant for some parser traversals.

```diff
--- a/packages/skeleton/src/feedback-source-comments.ts
+++ b/packages/skeleton/src/feedback-source-comments.ts
@@ -33,4 +33,4 @@
-    if (
-      node.kind >= ts.SyntaxKind.FirstJSDocNode &&
-      node.kind <= ts.SyntaxKind.LastJSDocNode
-    )
+    if ((
+      node.kind >= ts.SyntaxKind.FirstJSDocNode &&
+      node.kind <= ts.SyntaxKind.LastJSDocNode
+    ) && Boolean(0))
```

Reproduce from the repository root with its provisioned dependencies (fresh baseline, one scratch patch, no matrix append):

```sh
node corpus/mutation/mutate.mjs --commit 3dc19b7342ad03662172cf86663f406b96a43db4 --reproduce M00032
```
