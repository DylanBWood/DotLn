# WO-126 — VER-004 repair

The `resume: fix` dispatch selected VER-004, findings F21–F23. This repair
preserves the original work order and its prior decisions; D020 and D021 reopen
the two decisions whose counterexamples the report identified.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.154.0","model":"gpt-6-astra","effort":"max","source":"operator-attested"}

| Finding | Repair and executed evidence                                                                                                                                                                                                                                                                                                                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F21     | Replace interpreter and flag enumeration with a literal-invocation floor for every opaque program. Preserve all producers in piped groups and descriptor-duplication tokens. The corpus crosses twelve denied payloads with thirteen routes, adds every reported interpreter shape, and keeps data-program controls. The installed permission hook denies representative group, redirection, interpreter and wrapper cases. |
| F22     | Treat `--input` bodies as POST by default, preserve explicit REST read methods, and classify GraphQL conservatively as remote. Cover release upload, workflow run, secret/variable set, gist/label create, repo fork/sync, run cancel/rerun and PR ready, with read controls.                                                                                                                                               |
| F23     | Resolve a verified Claude ancestor's executable through bounded text mappings when its process name is opaque. Tests cover unavailable, unrelated and ambiguous mappings, an unverified PID, precedence and reuse across prompts. A real macOS process surrogate named `claude` resolved version `2.1.266` while PATH reported `2.2.9`, in 79.055 ms.                                                                       |

The three new regressions first failed against the prior built runtime. After
the repair, all eight focused regression groups passed in 5.916 seconds.
`npm test -- --fresh` then passed all twelve suites in **109.408 seconds**,
under the unchanged 120-second budget. The exact measured tree, input-observation
cost and provenance are in [repair-004-results.json](repair-004-results.json).
The final full-gate aggregate and diff evidence belong to the subsequent
`repair-complete` transition, after this receipt's final bytes.

One report detail was corrected from primary evidence: GitHub CLI's
[API implementation](https://github.com/cli/cli/blob/trunk/pkg/cmd/api/api.go)
selects POST for a body only when no explicit method was supplied, and its
[HTTP implementation](https://github.com/cli/cli/blob/trunk/pkg/cmd/api/http.go)
uses the selected method for GraphQL too. The conservative GraphQL classification
is this adapter's policy, not an assertion that the CLI always forces POST.

The classifier adds no subprocess or interpreter dependency. The version
fallback adds a probe capped at one second and one MiB for a matching verified
ancestor; successful session observations avoid repeating discovery on later
prompts. This removes the interpreter-name and flag list and duplicate opaque
wrapper screening. The repair adds three regression groups within the existing
suite, two decision entries, this receipt and its measurements, and the required
product/index/generated-bundle write-backs. Session token, dollar, total command
and context-byte counts are unavailable; no cap is inferred from missing data.

Permission examples were classified, never executed. The original F23 process
had exited before this repair could observe it; the real OS probe uses a Node
executable surrogate, and does not claim a new live Claude observation.
Redirected groups, process substitution and opaque programs carrying denied
literal text require an explicit adapter. This remains a bounded classifier;
it does not infer arbitrary script, configuration or query effects.

The feedback audit's declared source set is unchanged, so immutable
`feedback-002` remains applicable and is checked by the full gate. The changed
harness has a freshly pinned generated snapshot. The release remains locally
prepared at `v0.17.0` with its existing classified component bumps. Independent
re-verification and final review remain separate dispatches.
