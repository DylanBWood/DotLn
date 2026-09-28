# WO-060 decisions

## WO-060-D001 — economy experiment: declined, the order's costs are fixed by its authority

```json
{
  "id": "WO-060-D001",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Decline this order's economy experiment and keep the current method: focused compiler runs between edit batches, then the deterministic re-mints, the carry and the two gates once, after the last source edit.",
  "question": "Is there a method, within this order's authority, that would make its recurring work cheaper than the named commands: the compiler suite between edits, the deterministic edition re-mints, the feedback carry, the console fixtures, and the review and document gates once at the end?",
  "alternatives": [
    "Keep the current method: focused compiler runs between edit batches, and each named re-mint and gate once after the last source edit.",
    "Run the edition re-mints concurrently to save wall-clock.",
    "Run the review gate after each edit batch instead of once."
  ],
  "observation": "No run was made. By reading: the re-mint scripts each select a new edition in docs/evidence/current.json, so running them at the same time would race on that shared file; WO-163-D001 adopted focused checks between edit batches with the suites run once at the end, which is already this order's method; WO-168-D001 measured the build path and kept it. The remaining steps are commands the order names, and it gives no alternative for them.",
  "budget": { "wallSeconds": 60 },
  "execution": "declined",
  "reason": "The order names every recurring command it owes. The one method with room to save time (focused checks between edit batches, gates once at the end) is WO-163-D001's adopted method and is already in use. Running the re-mints concurrently races on the shared docs/evidence/current.json, and gating after each batch costs more than it finds, so no untested alternative within this order's authority promises a saving worth 60 s of measurement.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": ["No experiment commands run"],
    "source": "Actor-attested declined experiment; deliberation cost is not separately measured. Tokens are part of the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["None: the method is unchanged"],
    "summary": "No change to the method, so no saving or cost is claimed."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-27",
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/evidence/WO-163/decisions.md WO-163-D001 (2026-09-27, outcome adopted): an import probe between edit batches, with the suites once at the end",
    "docs/evidence/WO-168/decisions.md WO-168-D001: the build path, kept-current",
    "packages/skeleton/src/evidence-editions.mjs currentEvidence reads the single docs/evidence/current.json manifest that each re-mint updates",
    "Several orders recorded experiments on 2026-09-27 (WO-162, WO-164, WO-168, WO-169, WO-171) with no time order relative to WO-163-D001, so experimentsSinceAdoption is null"
  ],
  "rejected": [
    {
      "option": "Run the edition re-mints concurrently",
      "reason": "The re-mints share docs/evidence/current.json and write it, so concurrent runs would race; the saving would be a minute or two at most."
    },
    {
      "option": "Run the review gate after each edit batch",
      "reason": "WO-163-D001 already showed that one run after the last edit, with focused checks before it, finds the same failures for less time."
    }
  ],
  "reopenWhen": "A re-mint or gate in a later compiler-release order takes more than 900 s, or a failure found only by the final review gate would have been cheaper to find with a run between edit batches."
}
```

## WO-060-D002 — Goal alignment: a declared contract that unblocks gate G

```json
{
  "id": "WO-060-D002",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Build the contract as one pure compiler module. The screen claims only the declared set and names its limit in the module and in product 03. The six valid fixture bundles are shaped for WO-061 to reuse. Accept the compiler minor release and the re-mints it requires (a deterministic re-mint, a carry and a console re-pin) and no live episode.",
  "goalAlignment": {
    "missionAndCriticalPath": "Gate G of docs/planning/critical-path-2026-09-08.md: the source-to-deliverable loop needs a typed source artifact before it can derive a contract. WO-061 and WO-062 depend on the bundle and WO-065 depends on its screen; nothing downstream can start while the SourceAdapter port is prose.",
    "traps": {
      "policyResistance": "Guards and screens are the largest class of findings in failed verifications (48 of 184, planning document §5), mostly cases the judge built outside the fixtures, against orders that claimed a universal. A declared set with a stated limit gives verification a target the implementation can meet, so the two stop undoing each other.",
      "tragedyOfTheCommons": "The compiler release moves the feedback policy hash that the console binds. The carry and the re-pin are deterministic (WO-154 D011), so later orders pay nothing and no live episode is spent.",
      "driftToLowPerformance": "The limit is fixed as fixtures: three secret-like strings outside the declared shapes are shown to decode, so a later reader cannot mistake the screen for a detector.",
      "escalation": "No new gate and no refusal outside the decoder. A consumer chooses what to do with a refusal; WO-062 drops the refused item and records its id, shape and span.",
      "successToTheSuccessful": "The canonical hash follows the compiler's convention, fnv1a64 over domain-tagged canonical JSON. A pure SHA-256 exists in the skeleton, but the compiler imports only its own modules; that choice is recorded with its reopening condition (D003).",
      "shiftingTheBurden": "A malformed bundle refuses with a path and a screened one with each finding's path, offsets and span, so the adapter or the operator can act without re-reading the artifact.",
      "ruleBeating": "Each declared shape and URL form has a bundle that refuses and the same bundle without it that decodes. Tests also cover the host-reading cases a judge would construct (userinfo, ports, case, trailing punctuation, backslash, IP literals, percent-encoding), and a resolver checks every span in every fixture against the bytes.",
      "seekingTheWrongGoal": "The goal is a contract WO-061, WO-062 and WO-065 can consume unchanged, not a fixture count. The six valid bundles hold what WO-061 criterion 1 needs: struck text, headings, questions, images and revisions."
    },
    "naiveInterventionism": "Nothing runs today that this could break: no code carries a tracked-work artifact. What changes: one new module and one export line in the compiler, the registry line, the release labels and the four console self-host fixture files that follow the label (WO-162 D012). The second-order effect is the policy-hash move, handled by the carry. It can be reversed by removing the module and its export. The smallest probe is the module and its own tests, landed before any consumer exists.",
    "noOp": "Gate G stays closed, WO-061, WO-062 and WO-065 cannot start, and the port stays prose. Nothing gets better by waiting: the order was re-observed at the head of the sequence on 2026-09-28."
  },
  "evidence": [
    "docs/work-orders/WO-060-source-bundle-contract.md: Cost, Observed gap and Design",
    "docs/planning/failures-across-phases-2026-09-28.md §10.3: the amendment row for WO-060",
    "docs/work-orders/WO-061-story-contract-compile.md criterion 1 (reuses WO-060's six valid bundles); WO-062 Design (each item screened as a one-entry bundle with the forge host as the whole allowlist; a refused item recorded with its id, shape and span, without its text)"
  ],
  "rejected": [
    {
      "option": "A screen that claims to keep secrets out",
      "reason": "A universal the fixtures cannot enumerate; the order's amendment removed it."
    },
    {
      "option": "NoOp",
      "reason": "It leaves the critical path blocked, with no evidence that waiting would help."
    }
  ],
  "reopenWhen": "A consumer order (WO-061, WO-062 or WO-065) cannot use the contract as landed, or a later compiler release needs a live feedback episode because of this module."
}
```

## WO-060-D003 — The contract: byte spans, one id namespace, input-order refusals, a canonical accepted bundle

```json
{
  "id": "WO-060-D003",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "SourceBundle v1 has exactly the objective's fields. The decisions this order had to make:\n- A span is a half-open range of UTF-8 byte offsets into one section's or entry's text, on code point boundaries.\n- A section's or entry's own span covers its whole text.\n- Sections, entries and images share one id namespace.\n- An image hash is `sha256:` and 64 lowercase hex digits.\n- `createdAt` is a UTC timestamp ending in Z, and entries never go back in time.\n- Text admits tab, line feed and carriage return as its only controls. Headings and alt text are one non-blank line.\n- An accepted bundle sorts images by id and each revision's changed spans; every other array keeps its order.\n- The hash is fnv1a64 over canonical JSON of { domain: \"dotln:source-bundle:v1\", bundle }, an equality receipt.\n- decodeSourceBundle returns a result instead of throwing. A malformed value gives the first failing path and a reason from a fixed vocabulary, naming a field only when it is at most 32 letters or digits. A screened value gives every finding: its kind, the shape's or form's id, the field's path, the byte offsets, and the span when the field is a section's or entry's text; it never carries the matched text.\n- Paths index the value as supplied.\n- An invalid allowlist is a caller error and throws.",
  "evidence": [
    "packages/compiler/src/source-bundle.ts; packages/compiler/test/source-bundle.test.ts (12 tests pass); packages/compiler/fixtures/wo060-source-bundles.json",
    "WO-061 criterion 2 compares spans that overlap 'in any byte', and WO-060 criterion 3 asks that spans resolve 'to bytes'. Byte offsets are also the only unit a consumer outside JavaScript can slice without re-encoding.",
    "WO-062 screens each section and entry as a one-entry bundle, so a bundle without sections is valid. It uses the issue's last-updated timestamp as the revision id, so the id grammar admits : and -. It stores the bundle by hash and records a refused item with its id, shape and span but without its text, so findings carry no text.",
    "product 02 §Identity and composition: the registry hash is fnv1a64 over canonical JSON with a domain, and those hashes are 'equality receipts, not unique, cryptographic, or authenticated identities'; LoadoutEquipped treats the absence of payloadVersion as v1",
    "The mutation sweep (README §Mutation sweep) first survived an unsorted-images mutant because no fixture held two images. Adding one showed that screened paths indexed the sorted images, not the input, so a caller could not find its field. Screening now runs on the value as supplied, and only the accepted bundle is sorted."
  ],
  "rejected": [
    { "option": "UTF-16 code unit offsets", "reason": "JavaScript's own unit: a span could split a surrogate pair, and every other consumer would have to re-encode." },
    { "option": "Code point offsets", "reason": "Not bytes, and slicing needs a linear scan in every language." },
    { "option": "SHA-256", "reason": "The compiler imports only its own modules and the convention it follows is fnv1a64; the skeleton's pure SHA-256 is not importable from the compiler." },
    { "option": "A version field in the bundle", "reason": "The objective fixes the fields. The hash domain names v1, and absence meaning v1 is an existing convention." },
    { "option": "Throw on malformed input", "reason": "Adapters need a structured path to record the refusal; the compiler's result-returning compile has the same shape." },
    { "option": "Size bounds on texts and arrays", "reason": "The caller already holds the value in memory, and the scans are linear (tested on 256 KiB of adversarial text), so a bound would only add a number to argue about." }
  ],
  "reopenWhen": "A consumer needs a field or unit the contract lacks, a consumer uses the hash as a content address where a collision matters, or a bundle's size makes decoding cost a consumer's bottleneck."
}
```

## WO-060-D004 — The screen's declared set, each pattern from its public source

```json
{
  "id": "WO-060-D004",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "SOURCE_SECRET_SHAPES declares eight shapes and SOURCE_URL_FORMS declares two forms. A match refuses with its location.\n- private-key-block: -----BEGIN, a label ending in PRIVATE KEY with an optional BLOCK, then -----, in any case.\n- bearer-credential: the word Bearer in any case, then spaces or tabs and at least twenty b64token characters before any = padding.\n- github-personal-access-token, github-oauth-access-token, github-user-to-server-token and github-refresh-token: ghp_, gho_, ghu_ or ghr_, then at least 36 base62 characters.\n- github-server-to-server-token: GitHub's own regex, ghs_[A-Za-z0-9\\.\\-_]{36,}.\n- github-fine-grained-personal-access-token: github_pat_ and at least one token character.\n- scheme-authority: a scheme, ://, further / or \\ skipped, then a non-empty authority. The authority ends at / \\ ? # < > ^ | whitespace or a control character, less trailing punctuation. The host follows the last @ and precedes a :port, and is compared in ASCII lower case, exactly, with the allowlist.\n- www-autolink: www. followed by a domain character, at the start of a string or after whitespace, *, _, ~ or (, and not inside an authority already read. Its host is read the same way.\nAllowlist entries must be multi-label DNS names with a non-numeric top-level label; an empty allowlist refuses every URL form. The limit is named in the module's documentation, in product 03 and by the limits fixture: an unprefixed 40-hex token, a JWT without the Bearer word and a password in the userinfo of an allowed URL decode.",
  "evidence": [
    "GitHub Docs, About authentication to GitHub, §GitHub's token formats (https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#githubs-token-formats), fetched 2026-09-28: ghp_ personal access token (classic), github_pat_ fine-grained personal access token, gho_ OAuth access token, ghu_ user access token for a GitHub App, ghs_ installation access token for a GitHub App, ghr_ refresh token for a GitHub App. The page gives no lengths and notes the stateless ghs_APPID_JWT rollout from 2026-04-27.",
    "GitHub Blog, Behind GitHub's new authentication token formats, 2021-04-05, updated 2023-05-10 (https://github.blog/engineering/platform-security/behind-githubs-new-authentication-token-formats/): the prefixes gh plus one letter and an underscore; base62; 30 random characters and a 32-bit checksum in the last 6. That is 36 characters after the prefix, used as a lower bound so a longer format still matches.",
    "GitHub Changelog, Notice about upcoming new format for GitHub App installation tokens, 2026-04-24 (https://github.blog/changelog/2026-04-24-notice-about-upcoming-new-format-for-github-app-installation-tokens/): ghs_APPID_JWT, about 520 characters, prefixes unchanged. GitHub Changelog, GitHub App installation tokens: Per-request override header, 2026-05-15, regex updated 2026-05-26 (https://github.blog/changelog/2026-05-15-github-app-installation-tokens-per-request-override-header/): 'Our recommended regex to match both new and current format tokens is ghs_[A-Za-z0-9\\.\\-_]{36,}'.",
    "No fetched GitHub page documents a length or alphabet for github_pat_ (the token-format table and the 2022 fine-grained token announcement were read), so the shape requires only the prefix and a following token character.",
    "RFC 6750 §2.1 (b64token; credentials = \"Bearer\" 1*SP b64token); RFC 9110 §11.1 (the authentication scheme is a case-insensitive token); RFC 7468 §2 and §3 (encapsulation boundaries and the label grammar); RFC 4880 §6.2 (the PGP PRIVATE KEY BLOCK armor header); RFC 3986 §3 and §3.2 (scheme, authority, userinfo, host, port) and §3.2.1 (a password in userinfo is deprecated); WHATWG URL Standard, special authority ignore slashes state; GitHub Flavored Markdown Spec §6.9 (extended www autolinks: the start of a line, after whitespace, or after *, _, ~ or ()",
    "Tests: one fixture per shape and form refuses with the span, and the same bundle without it decodes; boundary tests for each shape; 41 host-reading cases (userinfo, ports, case, trailing punctuation, backslash, extra slashes, IP literals, percent-encoding, non-ASCII hosts, www boundaries); 19 of 19 mutants killed (README)"
  ],
  "rejected": [
    { "option": "An entropy or length heuristic for unknown secrets", "reason": "The order declines it: it refuses the ordinary hashes and identifiers every bundle holds, and its bypasses cannot be enumerated." },
    { "option": "Add the userinfo-password and JWT shapes now", "reason": "Neither is in the order's minimum set. A userinfo password is not a regex shape: it needs the URL reader and a third refusal kind that the order's design and WO-062's record format do not name. Operator-review assumption 2 makes a new shape a later minor, so both are the follow-up below." },
    { "option": "Exact token lengths ({36})", "reason": "GitHub warns that lengths change and publishes {36,} for ghs_." },
    { "option": "Require a word boundary before a token prefix", "reason": "A token directly after other characters, as in a URL's userinfo or a concatenated header, would pass." },
    { "option": "Read backslash-only forms (https:\\\\host), scheme-relative //host, bare domains and e-mail addresses as URLs", "reason": "Each is outside the declared forms. Backslash forms and //host have false positives on Windows paths and code comments that are common in bug reports. A hostname in prose is text under the declared set." }
  ],
  "followup": "Planner: a later minor of the SourceBundle screen could declare two more shapes, each named today as the v1 screen's limit in packages/compiler/src/source-bundle.ts and product 03 §Ports: a password in a URL's userinfo, refused even when the host is allowed (RFC 3986 §3.2.1: data after the first colon), and a JWT without the Bearer word (three base64url segments beginning eyJ). Checks: the WO-060 limits fixture moves to the refusal fixtures, and each new shape gets a refusing bundle and the same bundle without it. Priority: low; sooner if an adapter stores such a credential.",
  "reopenWhen": "An adapter stores a credential the declared set missed (the order's own condition), GitHub changes a documented prefix or format, or a consumer shows the host reading passes a host that a real parser reads differently."
}
```

## WO-060-D005 — Registration, the harness and the re-mints

```json
{
  "id": "WO-060-D005",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Register packages/compiler/src/source-bundle.ts in commonSources of scripts/lib/evidence-sources.mjs, because the compiler index re-exports it at run time. Regenerate the harness, whose runtime snapshot pins the compiled compiler. Deterministically re-mint the authority, artifact-identity and verification editions as WO-060 revision 001. Carry the feedback edition from docs/evidence/WO-162/feedback-001 into docs/evidence/WO-060/feedback-001. Point docs/evidence/current.json at the four. The console self-host fixtures follow the carried edition. No live feedback episode is owed.",
  "evidence": [
    "unregisteredEvidenceImports reads `export * from \"./source-bundle.js\"` in the registered index.ts as a runtime import, so every edition's import check needs the file registered or excluded",
    "After the build, every edition script refused with 'harness drift: pinned snapshot missing or changed (packages/compiler/dist/src/artifact-identity.js)'. `node scripts/harness.mjs emit` then `check --loadout contributor` reported 31 generated surfaces, and the hook and manifest diffs are only snapshot hashes, the compiler label and the label-derived policy hash. `node scripts/harness-context.mjs --check` exits 0.",
    "authority-evidence --write then --check: 'Verified two unchanged programs … and 34 bundle comparisons'; artifact-identity-evidence --write then --check: '4 current artifact evidence files in docs/evidence/WO-060/artifact-identity/001; Seiri semantic hash and frozen oracle unchanged'; verification-evidence --write then --check: '4 synthetic verification evidence files; planted defect, repair, staleness and replay are green'",
    "feedback-evidence --carry docs/evidence/WO-162/feedback-001: 'Carried the live feedback audit of docs/evidence/WO-070/feedback-001 into docs/evidence/WO-060/feedback-001: only component release labels moved; no live episode.' --check: 'Verified ten passing regressions, ten removal failures, and 1192 fewer instruction bytes'. The judged files this order touches (package-lock.json, packages/skeleton/package.json, packages/compiler/src/artifact-identity.ts) change only a component release label, which evidenceSourceContent normalizes.",
    "console-fixtures --record-current-selfhost then --check: every case matches. A SHA-256 inventory of the 31 files under packages/console/fixtures before and after shows four changed (manifest.json and expected/selfhost.html, .json and .txt): the feedback edition's path, reference and digest, the WO label and the policy hash that includes the compiler label. WO-162 D012 records the same four-file pattern.",
    "harness-evidence has no write mode; it checks the installation and the WO-042 live observations"
  ],
  "rejected": [
    { "option": "Exclude source-bundle.ts with a reason", "reason": "Exclusions are for modules no edition reaches, and every edition that imports the compiler index loads this one. The re-mints are owed anyway, because index.ts, the compiler manifest and the registry are registered sources." },
    { "option": "A live feedback episode", "reason": "No judged behavior changed; WO-154 D011 makes the carry the deterministic remedy for a compiler release." }
  ],
  "reopenWhen": "An edition check fails on this subject for a reason other than a later order's own edits, or a consumer binds an identity of the carried edition other than its policy hash."
}
```

## WO-060-D006 — Release: application v0.53.0 and compiler 0.20.0

```json
{
  "id": "WO-060-D006",
  "date": "2026-09-28",
  "dispatch": "resume: next; release assignment is opt-out (product 07 §Discipline)",
  "decision": "Complete the missing activation target: application v0.53.0, the next minor above the observed local v0.52.10 tag, under the order's minor classification. @dotln/compiler moves from 0.19.4 to 0.20.0, a minor bump for a new export with no change to existing behavior. The skeleton and console pins and the lockfile follow; neither consumer's version moves, because neither package's src changed. The README release claim and a roadmap activation-completion note record the target.",
  "evidence": [
    "`git tag --sort=-v:refname` lists v0.52.10 first, and `git describe --tags --abbrev=0 HEAD` is v0.52.10",
    "release prepare needs exactly one version in the heading; scripts/lib/plan-continuation.mjs normalizes a (vX.Y.Z) label back to the activation placeholder, so the planning binding is unchanged",
    "packages/compiler/test/artifact-identity.test.ts binds COMPILER_PACKAGE_VERSION to the manifest; `npm ls @dotln/compiler` shows 0.20.0 for the root, console and skeleton",
    "The compiler suite passes 126 of 126 tests with the new label"
  ],
  "rejected": [
    { "option": "A patch bump", "reason": "A new public export is a minor change to the package's surface, and the order classifies the release as minor." },
    { "option": "Bump the skeleton or console versions", "reason": "Only their compiler pins change, as in WO-162 D009." }
  ],
  "reopenWhen": "Final-review integration sees a newer release, or the compatibility impact changes."
}
```

## WO-060-D007 — Write-backs within the document ceilings

```json
{
  "id": "WO-060-D007",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Write the two product write-backs in place, with no dated paragraph. Product 03 §Ports gains 721 bytes inside the SourceAdapter bullet: the bundle as the port's input contract and the screen's limit. Product 10 §Separate version axes gains 285 bytes: the source-bundle-v1 contract axis. Refresh the two publication tables of contents whose source locks cover those documents.",
  "evidence": [
    "docs/control/doc-ceilings.json: 03 ceiling 176,132 bytes, now 173,569 (2,563 headroom left of 3,284); 10 ceiling 25,825, now 25,603 (222 left of 507)",
    "npm run publication:check first reported everyday-ai-user-toc.md and software-engineer-toc.md STALE; after the locks were set to the values --print-locks reports, it passes with 30 and 45 linked source sections matching"
  ],
  "rejected": [
    { "option": "A dated WO-060 paragraph", "reason": "The order asks for each write-back in place with no dated paragraph." }
  ],
  "reopenWhen": "A later order folds §Ports or §Separate version axes and needs these sentences moved."
}
```

## WO-060-D008 — Correction: edits, then formatting, then read-back, then the gate

```json
{
  "id": "WO-060-D008",
  "date": "2026-09-28",
  "dispatch": "resume: next; operator correction, paraphrased: format after each write or batch of edits, read back, then gate; name the lapse as a failure in the handoff; push back where the operator is wrong",
  "kind": "correction",
  "decision": "Record this order's execution lapse as a failure. For the rest of the order, work in the operator's order: a batch of edits, then the formatter on the changed code files and the repository format check, then a read-back of the changed bytes, then a gate. Stage new source files in full before the gate, as WO-163 D010 did, so the gate's code identity covers them.",
  "misread": "The executor ran formatting and read-back when it remembered to, not as a fixed step. It read the new test file back only after the first review gate had started, found an unused parameter and removed it, which forced a second full gate (380.82 s). Earlier, two edits wrote escape sequences as literal characters. U+2028 and U+2029 inside a regular expression in source-bundle.ts were emitted by the build and refused by Node on import ('Invalid regular expression: missing /'). A U+200B inside a test string was found by the executor's own byte check. The executor also left the order's new files untracked, so the gate's code identity, which follows tracked source bytes, did not cover them. Writing this record, it first gave the record a dispatch longer than the 240 characters of paraphrase docs-check admits, and ran the document gate without running docs-check first. That gate failed, and the executor ran it twice more to read the failure instead of reading the first run's full output: three failing runs at 16:44 and 16:45.",
  "meant": "Edits are batched, formatted, read back and only then gated, so a gate runs once on bytes the executor has already read. The gate's key has to cover every source file the gate judges.",
  "changed": "The remaining edits of this order follow that order: D001's wording, this record, and the README's failure and gate sections. The new files are staged in full and the review gate is run once more on the staged subject. The executor's handoff names this lapse as a failure.",
  "evidence": [
    "Where the operator's account differs from the record: no gate in this order failed on formatting. npm run test:docs passed its format suite (4.46 s), and the first npm test -- --review passed 36 of 36 suites. The second review gate was caused by the post-gate edit, not by a formatting failure. Its one failure is the skeleton test 'WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers', a testTimeoutFailure at its unchanged 240000 ms deadline after 7 of 8 matrix scenarios; WO-115-D018 records the same deadline failure, and this order changes no skeleton source.",
    "Gate rows in docs/control/local/harness/checks.json, all keyed to code identity ad7a1845be88875233424b7fa76b9529608ef230bb9c9ecdcb8d9789b268975b because the edited test file was untracked: npm run test:docs exit 0 at 2026-09-28T16:27:29.949Z; npm test exit 0, 317380 ms, at 16:32:54.566Z; npm test exit 1, 380824 ms, at 16:39:52.398Z.",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity hashes the paths git ls-files lists, less docs, harness and Markdown paths, and says: 'Stage new source files before the reviewer's gate.'",
    "docs/evidence/WO-163/decisions.md D010: every new file is staged in full, not marked intent-to-add, because worktree integrate refuses an intent-to-add entry."
  ],
  "rejected": [
    { "option": "Record the lapse only in chat", "reason": "The operator asked for it in the handoff, and a correction belongs in the decisions the same day." },
    { "option": "Agree that formatting failed the gates", "reason": "The gate rows show that it did not, and the operator asked for pushback where the record differs." },
    { "option": "Revert the parameter removal to reuse the first passing row", "reason": "That row's key never covered the untracked new files, so it would not bind the subject either." }
  ],
  "reopenWhen": "A gate in this order fails on formatting, or a gate runs on bytes the executor has not read back."
}
```

## WO-060-D009 — The review gate at the final subject: the WO-143 matrix deadline, not this order's code

```json
{
  "id": "WO-060-D009",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Hand off with the review gate's result as observed. After the post-gate test edit, npm test -- --review passed 35 of 36 suites in both runs, the second on the final staged subject. The one failure each time was the skeleton WO-143 acquisition matrix at its fixed 240,000 ms deadline. The first review gate passed 36 of 36; its product code was identical, and the subject differed only in the order's then-untracked files and in documentation. A focused run of that test on this subject passed in about the time WO-115 recorded. The deadline and the skeleton test are outside this order, so no further full gate runs without the operator's word. Criterion 6's review gate is not met at the final subject; its document gate, git diff --check, 'no new dependency' and 'kernel unchanged' are met.",
  "evidence": [
    "Gate rows in docs/control/local/harness/checks.json: npm test exit 0, 317,380 ms, 2026-09-28T16:32:54.566Z, before the new files were staged; npm test exit 1, 380,824 ms, 16:39:52.398Z; npm test exit 1, 395,362 ms, 16:53:17.262Z, on the staged subject; npm run test:docs exit 0 on the staged subject at 16:46:36.047Z",
    "In both failed runs the one failing test is resident.test.js 'WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers': testTimeoutFailure after 240,619 ms and 242,796 ms, with seven of eight matrix categories reported and no failed recovery assertion. The skeleton suite took 312.41 s in the passing run and 374.87 s and 390.18 s in the failing ones.",
    "Focused run on this subject, `node --test --test-name-pattern='WO-143 once and loop restart at every acquisition filesystem boundary' packages/skeleton/dist/test/resident.test.js`: pass in 179,790 ms. docs/evidence/WO-115/repair-diagnostics.md records 180,247 ms for the same command on unchanged source, and 174,288 ms after its test-only change.",
    "`uptime` before the focused run: load averages 4.42, 7.64 and 7.49 on a 16-processor host. docs/evidence/WO-115/decisions.md WO-115-D018 recorded the same 240,000 ms deadline failure under the full gate, and its repair diagnostics name resource contention under shared scheduling as a possibility, without measuring it.",
    "This order changes no skeleton source and no scheduler. The only runtime change the resident's children load is the compiler's new module, evaluated once per process import."
  ],
  "rejected": [
    { "option": "Run the full gate again until one run passes", "reason": "WO-115-D018 rejected repeated unchanged retries as evidence, and the operator objects to gate reruns that do not change the subject." },
    { "option": "Raise the 240 s deadline or change the skeleton test", "reason": "Outside this order's scope, and WO-115 kept the deadline on purpose." },
    { "option": "Unstage the new files to reuse the passing row", "reason": "That row's key does not cover the new module, so it would not bind the subject (D008)." }
  ],
  "followup": "Planner: the skeleton WO-143 acquisition matrix (packages/skeleton/test/resident.test.ts, fixed 240,000 ms deadline) failed the shared npm test -- --review in two of three runs on 2026-09-28 in WO-060, at 240,619 ms and 242,796 ms with seven of eight categories done, while a focused run passed in 179,790 ms. WO-115-D018 saw the same. Decide between an exclusive schedule for this suite, a deadline that scales with the gate's observed load, or a smaller matrix, and measure it against the shared gate. Checks: the full review gate and the focused matrix. Priority: medium, because every order's review gate carries the risk.",
  "reopenWhen": "A full review gate passes at the final subject, or a focused run of the matrix on this subject takes more than 200 s."
}
```

## WO-060-D010 — Final review: the review gate passed twice at the final subject, so D009's criterion 6 statement is superseded and the matrix deadline stays with the planner

```json
{
  "id": "WO-060-D010",
  "date": "2026-09-28",
  "dispatch": "resume: final review",
  "decision": "Criterion 6 is met at the final subject. The order names npm test -- --review at final review as its evidence gate, so this review ran it once on the staged subject at code identity 32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee, the identity VER-001 judged and the working tree's identity at this review: 36 passed, 0 failed, 367.01 s, 80 fresh tasks, exit 0. With VER-001's passing run on the same identity, D009's reopening condition, a full review gate passing at the final subject, is met, and D009's statement that criterion 6's review gate is not met is superseded. The executor's two failing runs at the WO-143 matrix's 240 s deadline are unchanged observations, so the register row D009 minted stays deferred for the planner; this review does not run the gate again to measure the matrix.",
  "evidence": [
    "docs/control/local/harness/checks.json: npm test exit 0, 367,009 ms, recorded 2026-09-28T17:44:17.836Z, code identity 32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee, tree 86fd9255, evidence reference host-gate:32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee:npm test; the runner printed 36 passed, 0 failed, 367.01 s, 80 fresh tasks",
    "docs/control/local/harness/checks.json: npm test exit 0, 315,378 ms, recorded 2026-09-28T17:11:54.958Z, on the same code identity: VER-001's run, which its criterion 6 cites",
    "docs/control/local/harness/checks.json: npm test exit 1 at 16:39:52.398Z and 16:53:17.262Z, each on the WO-143 matrix deadline alone (D009); the second on this same code identity",
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity on the working tree at this review returns 32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee, so the three runs on that identity judged the same tracked non-generated code",
    "docs/work-orders/WO-060-source-bundle-contract.md, Evidence gate: npm test -- --review at final review",
    "docs/verifications/WO-060/VER-001.md, criterion 6 and its closing paragraph: D009's recorded failure remains an accurate executor observation, and the verifier's passing run resolves criterion 6 for its judgment"
  ],
  "rejected": [
    {
      "option": "Rely on VER-001's gate row without a run by this review",
      "reason": "The order's evidence gate names the review gate at final review, and the row that binds publication should be one this review observed; the cost was one 367 s run on an unchanged subject, with nothing written during it."
    },
    {
      "option": "Run the gate a second time to measure the matrix's margin under the deadline",
      "reason": "D009 rejected unchanged reruns as evidence and records the operator's objection to them; the planner's follow-up measures the matrix on its own terms."
    },
    {
      "option": "Edit D009 or the README's Gates section to say the gate is green",
      "reason": "A filed record is not edited. This decision reopens D009 with the observation, and the final review cites both."
    }
  ],
  "reopens": {
    "decisionId": "WO-060-D009",
    "observation": "Two full review gates passed on the final subject's code identity 32e2cc1cca4e73941ca025df9c8f9537bd0463fab1f378f3d0beb3a69cad89ee: VER-001's at 2026-09-28T17:11:54Z (36 of 36, 315.38 s) and this review's at 17:44:17Z (36 of 36, 367.01 s). D009's reopening condition is met and criterion 6 is met. The register row for the matrix deadline stays deferred for the planner, because the executor's two failures at the 240 s deadline are unchanged observations and the row's own reopening condition (the matrix fails a review gate again in any order) is the right trigger."
  },
  "reopenWhen": "The WO-143 matrix fails a review gate again in any order, or the bound gate row is found not to name the bytes that published."
}
```
