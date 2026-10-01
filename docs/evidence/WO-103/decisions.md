# WO-103 decisions

## WO-103-D001

```json
{
  "id": "WO-103-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Add a standalone deterministic corpus with an independent data-driven precedence oracle, complete declared factorial replay, bounded committed golden shards and exact capped outbox permutations. Quarantine shipped defects; leave existing runtime and corpus files unchanged.",
  "evidence": [
    "docs/work-orders/WO-103-authority-outbox-corpus.md",
    "packages/kernel/src/core.ts",
    "packages/kernel/test/ac6-authorization.test.ts",
    "packages/kernel/test/ac5-failure-rows.test.ts",
    "docs/final-reviews/WO-017/FINAL-001.md#Adjudications"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves the authorized expiry, revocation and recovery cross-product without executable independent evidence."
    },
    {
      "option": "Commit every factorial cell",
      "reason": "Repeated full traces would inflate storage; all cells can instead regenerate and replay with exact counts and a full-stream hash."
    },
    {
      "option": "Fix the kernel or audit projection",
      "reason": "The order explicitly requires quarantining these behaviors and owns only new corpus files."
    },
    {
      "option": "Add the lane to npm test",
      "reason": "Root test wiring is excluded; standalone commands remain the consumer interface."
    }
  ],
  "reopenWhen": "The declared factor coverage, exact comparison or fixture budget proves inadequate, or a later order authorizes runtime repairs or lane integration."
}
```

Mission contribution: reproducible risk-reduction evidence for authority and restart recovery, prerequisites of trustworthy source-to-deliverable execution. This order is adjacent evidence work, not a new always-on runtime feature or an authority expansion.

System traps: policy resistance is bounded by the new-file authority; commons cost is bounded by fixture bytes and permutation caps; drift is prevented by exact per-cell comparisons and numbered quarantine rather than lowered expectations; escalation is bounded by one read-only reviewer (no descendants, session cap 20); success-to-the-successful is countered by an independently computed oracle; burden shifting is reduced by deterministic commands; rule beating is countered by declared product counts, call-input comparisons, planted self-tests and hashes; wrong-goal risk is addressed by measuring the kernel boundary rather than receipt volume. Naive Interventionism: preserve shipped behavior and its consumers, add reversible evidence only, and expose limitations. NoOp loses because it leaves the selected evidence gap open.

## WO-103-D002

```json
{
  "id": "WO-103-D002",
  "kind": "experiment",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep exact per-cell comparison and streaming generation; decline an additional sampling-method benchmark because it cannot justify weaker coverage and does not establish a recurring saving.",
  "question": "Would replacing full comparisons with sampled comparisons reduce repeat cost without weakening the declared evidence?",
  "alternatives": [
    "Exact comparisons for every declared cell",
    "Sampled comparisons with full counts only"
  ],
  "observation": "The order requires cell-by-cell agreement and never-throws over its complete declared set; sampling does not establish that outcome.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "cost": {
    "wallSeconds": 0.000176,
    "tokens": null,
    "commands": [
      "python3: read, validate and record the declined WO-103-D002 decision with time.perf_counter"
    ],
    "source": "Measured elapsed preparation of this declined-record revision; no benchmark was run. Earlier reasoning and original record-writing time were not separately measured and are unknown."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node corpus/harness/generate-authority-corpus.mjs --seed wo103-seed-20261001 --check"
    ],
    "summary": "No recurring saving claimed; exact coverage retained."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/work-orders/WO-103-authority-outbox-corpus.md acceptance criteria 2 and 3"
  ],
  "rejected": [
    {
      "option": "Run an extra benchmark",
      "reason": "No authorized evidence-equivalent sampled alternative; additional process has no demonstrated benefit."
    }
  ],
  "reopenWhen": "A measured repeat bottleneck has an evidence-equivalent optimization within a later order's authority.",
  "reason": "Sampled comparisons cannot meet the required exact per-cell outcome, so a benchmark cannot justify adoption."
}
```

## WO-103-D003

```json
{
  "id": "WO-103-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Declare seed wo103-seed-20261001, authority product 2\u00d73\u00d73\u00d73\u00d72\u00d73\u00d73\u00d77\u00d79\u00d74\u00d711 = 2694384 cells, and outbox command-shape(8)\u00d7key(4)\u00d7malformed(5)\u00d7alphabet/order(24+720+720+128)\u00d7delivery(2) = 509440 runs. Commit 512 authority golden cells and one order per outbox factor/alphabet, sharded into at most 16 files and 12 MiB. Replay all cells, not only golden cells.",
  "evidence": [
    "corpus/harness/wo103-authority-lib.mjs FACTORS",
    "corpus/harness/wo103-outbox-lib.mjs OUTBOX_FACTORS and PERMUTATION_POLICY",
    "Read-only agent oracle_review source examination"
  ],
  "rejected": [
    {
      "option": "Unbounded permutations",
      "reason": "The work order caps full alphabets at six events and 720 orders; eight-event alphabets use 128 seeded unique orders."
    },
    {
      "option": "Omit inactive combinations",
      "reason": "Zero conditions/types/events leave some labels inactive, but omitting them would silently shrink the declared product."
    },
    {
      "option": "Only complete commands",
      "reason": "The order explicitly requires incomplete-command quarantine and malformed replay coverage."
    }
  ],
  "reopenWhen": "Executable counts diverge, any factor is uncovered, or a declared cell requires a new numbered quarantine."
}
```

The authority factors' literal levels are recorded in the generated manifest from FACTORS; zero types/events/conditions keep inactive labels in the product. Semantic match means the first or last condition/event pair, or none. Environment levels cover complete inputs without/with policy, missing state/environment, unknown reference and early/late exceptions. Each callback binds state, canonical now, RNG, params and optional policy. Forged non-string effects beyond the numeric principal level run as a separately declared auxiliary set, not an enlarged hidden factorial.

Outbox alphabets: pending (4), duplicate orphan completion (6), permanent duplicate orphans (6), multiple commands (8). Full permutations treat equal-delivery slots as labeled positions. Duplicate delivery runs the same order with each event delivered twice and checks state equality plus the independently computed expanded trace. Input command shapes, prototype keys and malformed payload levels cross every alphabet. Fixture budget covers both lanes together; the full-stream identity covers every expectation.

## WO-103-D004

```json
{
  "id": "WO-103-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Quarantine WO-103-F001 and WO-103-F002, the missing-state and missing-environment audit trace omissions, with exact partial suffixes and source event IDs. Defer runtime correction under the order's explicit non-goal.",
  "evidence": [
    "corpus/manifests/findings-WO-103.md",
    "corpus/harness/wo103-authority.test.mjs",
    "packages/skeleton/src/audit.ts semanticAuthorityInputsAreComplete",
    "docs/final-reviews/WO-017/FINAL-001.md adjudication 8"
  ],
  "followup": "Allocate an audit-owned order to recognize truthful partial semantic-input refusal traces without fabricating missing inputs; cover missing state and missing predicateEnv and preserve rejection of malformed traces in packages/skeleton/src/audit.ts.",
  "rejected": [
    {
      "option": "Repair the audit projection here",
      "reason": "WO-103 records this exact carry-in and excludes audit edits."
    }
  ],
  "reopenWhen": "An order owns the audit projection and its linkage tests."
}
```

## WO-103-D005

```json
{
  "id": "WO-103-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Quarantine WO-103-F003: incomplete command objects with non-empty string IDs reach pendingCommands. Retain permissive observed replay as evidence, never as a valid Command guarantee.",
  "evidence": [
    "corpus/manifests/findings-WO-103.md",
    "corpus/harness/wo103-outbox.test.mjs",
    "packages/kernel/src/core.ts replayOutbox"
  ],
  "followup": "Allocate a kernel-owned order for structural CommandPersisted admission in packages/kernel/src/core.ts: validate required Command fields before pending outbox insertion, define malformed-input traces and retain persist-once, orphan completion and duplicate-result semantics.",
  "rejected": [
    {
      "option": "Repair kernel command admission here",
      "reason": "WO-103 requires numbered quarantine and forbids kernel edits."
    }
  ],
  "reopenWhen": "A kernel-owned order defines malformed-command admission and backward compatibility."
}
```

The two deferred fixes are recorded in the worktree's ignored adjacent queue and retargeted to the public identifiers minted by the canonical follow-up synchronization. Synchronization, meta and release preparation are generated lifecycle records; there is no hand edit of existing product/runtime/corpus source.

Implementation review corrections: the doubled-delivery lane now compares both replay overloads and exact expanded traces; permanent-orphan alphabets consume the declared malformed profile; the second configured revocation event type is exercised; a separate planted denial-list-tail cell binds the second denied pattern. The initial generator toolchain placeholders were corrected before the final recording to observed Node v26.9.0 and npm 11.19.1. None of these changes repairs shipped behavior.

## WO-103-D006

```json
{
  "id": "WO-103-D006",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.60.1, the next patch above the observed release baseline v0.60.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.60.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-103-authority-outbox-corpus.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-103-D007

```json
{
  "id": "WO-103-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Preserve the successful standalone corpus evidence and the failed repository gate; do not install a browser or mark criterion 8 met without authorization that overrides the order's explicit no-install scope. Refresh generated lifecycle indexes through their canonical commands before repeating document validation.",
  "evidence": [
    "corpus/manifests/runs/WO-103-ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0-failed.log: build, --check and 14 corpus tests pass; npm test reports 28 passing checks and the browser-evidence check failing",
    "packages/browser-evidence/README.md: each fresh worktree needs a supplied available cache or pinned-browser setup",
    "node_modules/playwright-core/browsers.json: installed pin requires Chromium/headless-shell revision 1243",
    "Filesystem observation: selected and main .runtime/playwright caches absent; platform cache has revision 1234",
    "npm run test:docs: index and meta are stale after release preparation; their dependent checks did not execute"
  ],
  "rejected": [
    {"option": "Reuse platform revision 1234", "reason": "Would replace the package's required revision 1243 rather than satisfy its pin."},
    {"option": "Silently install revision 1243", "reason": "WO-103 explicitly excludes installs; the requested scope exception is pending."},
    {"option": "Skip or bless the failed browser check", "reason": "Criterion 8 explicitly requires a green npm test; corpus success cannot substitute for it."}
  ],
  "reopenWhen": "The operator authorizes the pinned cache setup, supplies an already available revision 1243 cache, or directs an unmet-criterion handoff."
}
```

Full corpus verification: regeneration 29.714 s; 14 standalone tests 26.202 s; all declared counts and hashes match. Repository gate: 28 checks passed, browser-evidence failed (13 of its 19 tests), 502.59 s, 73 fresh tasks. No root passing row is claimed for this attempt. The public failed transcript preserves the normalized command output. Correction on 2026-10-01: the original raw scratch log was replaced by the authorized final attempt, so the first raw log is not separately retained.

One read-only agent was launched and reused, with no descendants; this is the executor's explicit admission count. Harness usage reported zero observed agents, so its coverage does not observe this provider launch and the uncounted remainder remains unknown. The read-only review checked representative cells and identified the harness corrections above; it is neither independent lifecycle verification nor final review.

## WO-103-D008

```json
{
  "id": "WO-103-D008",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Frame each authority/outbox JSONL cell as an existing generic EventEnvelope v1 row of synthetic type CorpusFixture, with the full original input/expectation record in payload. The strict historical-stream codec validates these rows; no runtime subtype or contract changes. Regenerate the fixture hashes and rerun the corpus and document gates.",
  "evidence": [
    "npm run test:docs after index refresh: 23 checks pass, kernel-docs fails because bare corpus rows have an unknown top-level cellId field",
    "packages/kernel/test/store-history.test.ts: unregistered corpus JSONL files default to strict EventEnvelope validation",
    "scripts/lib/evidence-jsonl.mjs: per-order declarations admit only files inside that order's evidence directory",
    "packages/kernel/src/store.ts: generic EventEnvelope framing accepts typed JSON payloads",
    "docs/work-orders/WO-103-authority-outbox-corpus.md: JSONL cells and new files only; no existing corpus or kernel registry edit"
  ],
  "rejected": [
    {"option": "Edit the existing non-event protocol registry", "reason": "The order excludes existing-file changes beyond lifecycle records."},
    {"option": "Move fixtures into docs/evidence", "reason": "The order explicitly locates its fixture lanes under corpus/fixtures/authority and corpus/fixtures/outbox."},
    {"option": "Skip historical-stream validation or rename away from JSONL", "reason": "Would weaken the shared check or discard the requested artifact format."}
  ],
  "reopenWhen": "A future authorized corpus protocol registry provides native non-event declarations; until then the existing generic framing remains explicit in the manifest."
}
```

Changed evidence revisits D001: strict framing preserves consumers and the current codec instead of weakening it (Naive Interventionism). It prevents rule beating through exclusion, keeps the declared expectations and exact counts (drift/wrong-goal lenses), adds bounded framing bytes (commons), and needs no extra machinery or operator rescue (escalation/burden). Policy resistance and investment bias are bounded by using a current generic interface and documenting the rejected alternatives. NoOp would leave a reproducible introduced document-gate failure.

## WO-103-D009

```json
{
  "id": "WO-103-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next; operator authorization in the active conversation",
  "decision": "The operator authorized installing the pinned browser and rerunning the gate. Apply only this bounded exception to the order's no-install clause: use the existing Playwright 1.63.0 CLI to install its Chromium headless shell revision 1243 and required browser-cache support into this worktree's ignored .runtime/playwright directory. Add no npm dependency and change no persistent account/tool configuration or runtime source.",
  "evidence": [
    "Operator response selected the pinned browser install and rerun on 2026-10-01",
    "packages/browser-evidence/README.md cache-scoped command",
    "node_modules/playwright-core/browsers.json revision 1243",
    "WO-103-D007 failed-gate diagnosis"
  ],
  "rejected": [
    {"option": "Keep criterion 8 unmet", "reason": "The operator selected bounded setup and rerun."},
    {"option": "Use an unpinned browser or global configuration", "reason": "The authorization names the pinned browser and this ignored worktree cache."}
  ],
  "reopenWhen": "The pinned install or launch fails, or validation reveals a defect requiring effects beyond this bounded authorization."
}
```

D008 implementation correction: each shard's outer eventIds use the store codec's physical evt_1, evt_2 order; payload.cellId retains authority-N/outbox-N. The strict codec and self-tests verify the framing, and no fixture cell is excluded.

## WO-103-D010

```json
{
  "id": "WO-103-D010",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Judge all eight acceptance criteria met on the final corpus and fresh repository evidence; retain the standalone lane, exact declared coverage and three numbered quarantines, and hand off for independent verification.",
  "seed": "wo103-seed-20261001",
  "factorLevels": {
    "authority": {
      "effect": [
        "string",
        "non-string"
      ],
      "clock": [
        "before",
        "at",
        "after"
      ],
      "eventTypes": [
        0,
        1,
        2
      ],
      "events": [
        0,
        1,
        2
      ],
      "typeMatch": [
        false,
        true
      ],
      "conditions": [
        0,
        1,
        2
      ],
      "semanticMatch": [
        "early",
        "late",
        "never"
      ],
      "environment": [
        "complete",
        "policy",
        "missing-state",
        "missing-env",
        "unknown",
        "throw-early",
        "throw-late"
      ],
      "patterns": [
        "exact",
        "bare-star",
        "prefix",
        "allow-miss",
        "deny-exact",
        "deny-star",
        "deny-prefix",
        "overlap",
        "list-tail"
      ],
      "evidence": [
        "required-empty",
        "empty",
        "subset",
        "superset"
      ],
      "resource": [
        "undefined",
        "missing",
        "one",
        "zero",
        "negative",
        "__proto__:missing",
        "constructor:missing",
        "toString:missing",
        "__proto__:own",
        "constructor:own",
        "toString:own"
      ]
    },
    "outbox": {
      "commandShape": [
        "complete",
        "id-only",
        "missing-intent",
        "missing-id",
        "empty-id",
        "non-string-id",
        "null",
        "array"
      ],
      "commandKey": [
        "cmd-a",
        "__proto__",
        "constructor",
        "toString"
      ],
      "malformed": [
        "null",
        "array",
        "number",
        "missing-field",
        "invalid-field"
      ]
    },
    "outboxDelivery": [
      "once",
      "each-event-twice"
    ]
  },
  "permutationCap": {
    "maximumFullAlphabetSize": 6,
    "maximumFullOrdersPerAlphabet": 720,
    "seededOrdersAboveCap": 128,
    "alphabetSizes": {
      "pending": 4,
      "duplicateOrphans": 6,
      "permanentOrphans": 6,
      "multipleCommands": 8
    }
  },
  "findings": [
    "WO-103-F001",
    "WO-103-F002",
    "WO-103-F003"
  ],
  "evidence": [
    "corpus/manifests/WO-103.json: 2694384 authority cells; 254720 orders and 509440 delivery runs; zero divergences; 960 incomplete pending cells",
    "corpus/manifests/runs/WO-103-ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0.log: build, --check, 14 corpus tests, 24 document checks, 29 repository checks and git diff --check pass; sequence cutoff 2026-10-01T14:53:26.124Z",
    "corpus/manifests/findings-WO-103.md: WO-103-F001, WO-103-F002 and WO-103-F003 exact reproductions",
    "git diff -- package.json package-lock.json scripts packages: empty at handoff preparation",
    "npm run adjacent -- list: revision 4; both items deferred to minted public FUP identifiers; next null",
    "WO-103-D009 operator authorization; pinned install succeeded; focused browser suite 19/19 and full browser-evidence lane passed"
  ],
  "rejected": [
    {
      "option": "Repair quarantined runtime defects",
      "reason": "The order requires reproductions and deferral and does not own those runtime paths."
    },
    {
      "option": "Only replay committed golden cells",
      "reason": "Would omit the exact declared factorial and capped permutation coverage."
    },
    {
      "option": "Treat corpus agreement as runtime completeness",
      "reason": "The judgment covers the declared finite set; arbitrary malformed envelopes outside it remain untested."
    }
  ],
  "reopenWhen": "Independent verification identifies a reproducible divergence, a missing declared combination, a dishonest quarantine or an unauthorized existing-file change."
}
```

Outcome judgment: this supplies reproducible authority and restart-recovery evidence while exposing the three shipped defects. D001's eight-trap, Naive Interventionism and NoOp comparisons still support bounded evidence work; D008 preserves the current codec rather than adding an exclusion. The final fixtures cost 2,304,495 bytes, regeneration 30.369 s and standalone tests 26.242 s; the fresh repository gate costs 491.80 s. Full coverage meets the declared claim, while a golden-only replay would be cheaper but inadequate. The authorized cache setup and rerun resolved the environment failure without a dependency or runtime change. No recurring economy saving or unmeasured token/dollar cost is claimed. D004/D005 remain boarded to their public follow-ups.

## WO-103-D011

<!-- integration refs/dotln/checkpoint/WO-103/6 -->

```json
{
  "id": "WO-103-D011",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-103",
  "decision": "Integrate main at 2f525014 (WO-176, v0.60.1) into the uncommitted WO-103 worktree by fast-forward, with no authored conflict. The application release retimes from v0.60.1 to v0.60.2 under the recorded patch classification; no component version, edition or dependency changes. Upstream changed no file the corpus reads or owns, so VER-001's judgments carry forward, and the criterion 8 commands and the product gate were re-run on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-103/6",
    "base ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0",
    "upstream 2f52501450b55abdb03386352bb651909bb2e134",
    "release preparation: Retimed WO-103: v0.60.1 → v0.60.2 above the observed release baseline v0.60.1. Files changed: docs/work-orders/WO-103-authority-outbox-corpus.md, README.md, docs/evidence/WO-103/meta.json, docs/final-reviews/WO-103/PR.md. Meter snapshot: docs/evidence/WO-103/meta.json, 4055 bytes. Tag observation: local snapshot only.",
    "git diff --stat ee9b9db9 2f525014: 43 files, WO-176's records and scripts/ release-close machinery; nothing under packages/, corpus/, package.json or package-lock.json. docs/intake/ holds no ignored file, so no intake backup was required.",
    "Integrated tree, 2026-10-01: npm run build; node corpus/harness/generate-authority-corpus.mjs --seed wo103-seed-20261001 --check exit 0 (2,694,384 cells; 509,440 runs; 9 files, 1,152 rows, 2,304,495 bytes; F001–F003; 30.38 s); node --test 'corpus/harness/wo103-*.test.mjs' 14 passed, 0 failed (25.94 s).",
    "Affected checks on the integrated tree: npm run publication:check, node scripts/harness.mjs check (31 generated surfaces), npm run release -- check-surfaces --local (57 PASS, exit 0) and git diff --check pass. npm test -- --review: 30 passed, 0 failed, 419.80 s, 75 fresh tasks, code identity 4f5124c90989392afcb162d31af03b889f75f556cc25ea28443e6688bdc88071, recorded 2026-10-01T15:35:15.508Z, run after the order's new files were staged."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-01. Original base: `ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0`.
Fetched main: `2f52501450b55abdb03386352bb651909bb2e134`. Checkpoint: `refs/dotln/checkpoint/WO-103/6`.
Named stash retained: `b1965500e1644961f2ef364c0350dff16fadf02f` (WO-103 integrate 2026-10-01).
Resolved projections: docs/control/current.md, docs/planning/followups.json.
Release preparation: Retimed WO-103: v0.60.1 → v0.60.2 above the observed release baseline v0.60.1. Files changed: docs/work-orders/WO-103-authority-outbox-corpus.md, README.md, docs/evidence/WO-103/meta.json, docs/final-reviews/WO-103/PR.md. Meter snapshot: docs/evidence/WO-103/meta.json, 4055 bytes. Tag observation: local snapshot only.
Carried-forward claims: main changed none of the files the corpus reads (`packages/kernel` and `packages/skeleton/src/audit.ts` and their builds) or owns (`corpus/`). VER-001's criterion 1–7 evidence therefore rests on unchanged inputs and carries forward. Criterion 8's commands and the product gate were re-run on the integrated tree, and all passed (D011 evidence). FINAL-001 judged the integrated subject.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-103-D012 — final review: one precedence pair the declared factorial never contests

```json
{
  "id": "WO-103-D012",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass criterion 2 as declared and board one uncontested precedence pair. No declared authority cell has both 'effect denied' and 'effect not allowed' failing. Every pattern level whose denied list matches 'act' also has an allowed list that matches it, and a non-string effect sets neither flag. A guard that ranked 'effect not allowed' before 'effect denied' would therefore pass the full sweep with zero divergences. The other six adjacent rank pairs are contested, and a swap of each is detected. The order's pattern factor (exact, bare *, prefix a*, overlapping deny-vs-allow) is met as declared, and criterion 3 makes a case outside the declared set a follow-up, not a failure. This review adds no level, because a new level changes the declared product, both stream hashes, the shards, the manifest and the precedence table that VER-001 judged.",
  "evidence": [
    "Reviewer mutation probes, 2026-10-01, in this session's DotLn scratch (probe/mutate.mjs). Each probe copies packages/kernel/dist/src from the integrated tree, applies one textual mutation to core.js and runs the corpus's own sweepAuthority or sweepOutbox against the copy. Unmutated: 0 authority and 0 outbox divergences, authority stream hash dcbd7d04… equal to the manifest's, 960 incomplete pending cells.",
    "Detected (divergent cells): expiry >= changed to > (449,064); prefix patterns disabled (82,720); Object.hasOwn changed to the in operator (11,280); semantic evaluation stopped after the first match (21,384); rank swaps 1/2 (898,128), 2/3 (598,752), 3/4 (66,528), 4/5 (34,496), 6/7 (10,340) and 7/8 (22,560); persist last-wins (138,740 outbox); every remembered result relabelled preceded-persist (84,440 outbox). Undetected: rank swap 5/6 (0).",
    "corpus/harness/wo103-authority-lib.mjs PATTERNS: deny-exact, deny-star and deny-prefix allow ['act']; overlap allows ['*', 'act']; list-tail denies ['other', 'absent*'], which does not match 'act'; the remaining levels deny nothing.",
    "docs/product/02-domain-model.md AuthorityEnvelope row and packages/kernel/src/core.ts authorize: the pinned first-failing order puts denial before absence from the allow list; shipped behavior is unchanged."
  ],
  "followup": "Next order that edits the WO-103 corpus or the guard's effect-pattern rules: add an authority pattern level whose denied list matches the effect and whose allowed list does not (for example allowed ['other'], denied ['act']) so ranks 5 and 6 are contested in one cell; regenerate the declared product, both stream hashes, the shards, the manifest and the precedence table from the recorded seed, and record the new counts.",
  "rejected": [
    {
      "option": "Fail FINAL-001 and route a repair",
      "reason": "All eight criteria are met against the declared set, and criterion 3 makes a case outside it a follow-up. Shipped behavior and the three recorded findings are unaffected."
    },
    {
      "option": "Add the pattern level in this review",
      "reason": "It changes the verified deliverable's declared product and every generated surface; a reviewer does not write a change and certify it."
    },
    {
      "option": "State the gap only in the report",
      "reason": "A limit met in review is boarded here with a follow-up, not left as a report sentence."
    }
  ],
  "reopenWhen": "A later order adds a level that contests ranks 5 and 6, or the guard's denied or allowed rules change."
}
```

Goal alignment: the order's value is evidence that would catch a regression at the authority boundary, and the probes test that directly (the rule-beating lens). Twelve of thirteen mutations fail the sweep, so the evidence mostly does what it claims, and its one blind spot is now named. Naive Interventionism and success to the successful: the verified corpus stays as it is, and the gap goes to an order that can regenerate it. NoOp would leave the generated table's "the first failing rank wins" reading as fully witnessed when one pair is not.
