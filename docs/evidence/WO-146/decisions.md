# WO-146 decisions

## WO-146-D001 — Operator correction: the operator enters bare `copilot`; nothing DotLn needs depends on a launch argument

```json
{
  "id": "WO-146-D001",
  "date": "2026-09-20",
  "dispatch": "Operator correction during planning: bounded Copilot CLI integration, after the pass's first handoff: Claude is entered as `claude` and Codex as `codex`, so Copilot is entered as `copilot` with no extra arguments. Captured verbatim in ignored intake (docs/intake/notes/2026-09-20-copilot-cli-integration-planning-correction.md, SHA-256 f6b8c874c4c29243c256130582fdca269cf8dbf223a043b4c5c0e42d38402e69).",
  "decision": "Amend WO-146 so the supported entry is bare `copilot`. The objective and a new design rule say so; whatever the CLI must know comes from the repository surfaces it already reads, an in-session command or a proposed personal setting. Criterion 1 keeps flags only on scripted probe launches and adds operator-observed rows from a bare interactive session for H1, H5 and H12; criterion 5 and H5 speak of allow-all permissions however the operator turned them on, not of a flag; criterion 9 enters every qualification episode as bare `copilot` and drops the per-episode credit flag; criterion 11 no longer prescribes a launch line that disables the built-in GitHub MCP server and instead names that channel as ungoverned, with any persisted off switch going on the proposed-settings list. The planner's error was to put launch flags into the operator workflow and into criteria 9 and 11. No scope is added; no hold existed and none is discharged.",
  "evidence": [
    "docs/work-orders/WO-146-copilot-cli-harness.md",
    "docs/planning/copilot-cli-integration-2026-09-20.md",
    "docs/planning/refutations/2026-09-20-planning-1a0fb634704921a3-020.md"
  ],
  "rejected": [
    {"option": "NoOp: keep the launch line as a recommendation", "reason": "The operator will not use it, so a workflow and two criteria would describe sessions that never happen, and the qualification would test a configuration the operator does not run."},
    {"option": "A shell alias or wrapper script that adds the flags", "reason": "It hides launch arguments behind a private file, which makes a private setting the source of DotLn behavior and is the same thing the operator declined."},
    {"option": "A second independent refutation for the amended text", "reason": "The amendment removes launch arguments and adds no scope or mechanism; the amendment route binds the approved bytes to receipt 020, and the next planning receipt judges the order again."}
  ],
  "reopenWhen": "The probe shows a DotLn control that cannot work in a bare `copilot` session without a launch argument; that control is then labeled unsupported rather than solved with a flag, and the operator decides."
}
```
