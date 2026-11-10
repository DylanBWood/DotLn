# WO-265 decisions

Decisions recorded for WO-265. The first precedes its execution: it is the
planning pass's amendment of the filed order after receipt 067, on the
operator's direction. Each entry names its evidence, the options it
rejected and the condition that reopens it.

## WO-265-D001 — Claude is the default host and nothing looks for another

```json
{
  "id": "WO-265-D001",
  "date": "2026-11-09",
  "dispatch": "planning: the standard planning pass of 2026-11-09, after receipt 067 and the pass's publication; the operator's direction in that session",
  "decision": "Amend the filed order so that a new instance looks for and calls no host it was not told to use. Claude Code is the default host and the only one a new instance has. The seeded first order and the security seed ask about the host the session runs in and the hosts the instance's configuration elects, name no other harness or provider, and permit no invocation of a harness. The doctor this order adds reports the agent CLI of elected hosts only; as filed, it reported the presence and version of every agent CLI, which is the same looking the operator ruled out. A discovery record no longer turns a host on; an attestation or an election does. The order gains one step, two criteria and the files named in its Cost line, and keeps its place in the sequence, which this pass cannot change after its receipt; it depends on no open order.",
  "evidence": [
    "The operator's message of 2026-11-10T02:34:47Z in the planning session, in paraphrase: a new kit's first order went through every agent harness and provider it knew of and made test calls; Claude is the default unless the operator says otherwise, and nothing is to look for another harness or call one, however small the call. Ignored capture SHA-256 5f21df63b6d668b25ea93859af6a87396d5afed9c5d11d6ef34d1e27e54ee50f, which is the session journal's digest of the message.",
    "scripts/kit/first-order.template.md at 06c1ddc1a (v0.122.1): the Authority permits one smoke invocation per harness surface; checklist item 2 asks for each AI coding harness as installed; the audit questions are put to each harness; the deliverable records each under effortReadbackProbe.harnesses. Its last change is WO-258's (7a9c290cd, v0.121.0).",
    "docs/KIT.md §Features and WO-258-D003: host-codex and host-copilot are off unless elected or inferred, and a clone starts Claude-only; scripts/lib/features.mjs hostRecord counts an observed version in docs/discovery/environment.json as a record that shows a host, which is the file the first order writes.",
    "scripts/kit/AI-HARNESS-SECURITY.template.md: asks for the operator's posture for each AI coding harness.",
    "A search of scripts/, packages/skeleton/src, packages/compiler/src, scripts/kit and docs/KIT.md for another provider's name the operator mentioned: none; the kit knows claude-code, codex-cli and copilot-cli, so a session that reached further did so on the first order's words.",
    "docs/work-orders/WO-265 as judged by receipt 067, Design second item: the doctor reports the presence and version of each agent CLI.",
    "scripts/resume.mjs: activation takes the order by id (resume activate WO-NNN <file>); no check of the order's place in the sequence was found there."
  ],
  "rejected": [
    {
      "option": "Leave the first order as it is and record the finding for the pass that reads the work laptop's run",
      "reason": "Every clone of the starter until then repeats it, on machines where a call to another provider is not the operator's to allow by default."
    },
    {
      "option": "Keep the inspection and have the first order ask the operator before it looks",
      "reason": "The operator's rule is the default itself: nothing looks unless it is told to."
    },
    {
      "option": "A separate order placed first",
      "reason": "A new order and a changed sequence need a new judged subject, and this pass has its one judgment. WO-265 already edits the first order's seed and depends on no open order, so it can be activated ahead of its place."
    },
    {
      "option": "End inference from attestations as well",
      "reason": "An attested phase ran under that host on the operator's own dispatch, which is the operator saying so."
    }
  ],
  "reopenWhen": "The operator elects another default host, or an instance reports a host it uses that an election cannot express."
}
```
