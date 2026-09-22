# WO-149 live Codex fixture dispatch

**Process cost:** entry 2044066 tokens; handoff 2785639 tokens; source codex-transcript-counter

Executed outside npm test by the current real Codex session. The fixture began
with no session record. The only intervening child invocation was the real
resume next command; no harness begin was called. A second dispatch preserved
the session bytes. The source hash matches the repair's dispatch script.

Counters come from the real parent Codex transcript, read against its actual
worktree and repair start. Entry was sampled immediately before dispatch and
handoff afterward. They cover the parent repair dispatch, not isolated fixture
compute. The isolated fixture has a different cwd, so its own automatic usage
readback is unavailable; no transcript was copied, modified or synthesized to
override that boundary. This row couples the witnessed fixture invocation with
the actual launching Codex session's counters. No transcript path, thread id,
or transcript text is published.

```json
{
  "invocation": [
    "node",
    "scripts/resume.mjs",
    "next"
  ],
  "fixtureOrder": "WO-999",
  "beforePresent": false,
  "afterPresent": true,
  "firstExit": 0,
  "secondExit": 0,
  "role": "executor",
  "expectedEvent": "ImplementationReady",
  "adoptedPaths": [],
  "before": "2026-09-21T22:50:33.035Z",
  "startedAt": "2026-09-21T22:50:33.164Z",
  "after": "2026-09-21T22:50:33.185Z",
  "repeatedBytesIdentical": true,
  "dispatchSourceSha256": "e7dbf00cd7640cbdacf2bab13241395fe42aa66c1e1097d3291e925db284d1a4",
  "actor": {
    "available": true,
    "harness": "codex-cli",
    "harnessVersion": "0.155.1",
    "model": "gpt-6-astra",
    "effort": "xhigh",
    "source": "codex-session-readback",
    "observedAt": "2026-09-21T22:42:29.039Z"
  },
  "entry": {
    "totalTokens": 2044066,
    "source": "codex-transcript-counter",
    "scope": "dispatch",
    "observedAt": "2026-09-21T22:48:56.131Z"
  },
  "handoff": {
    "totalTokens": 2785639,
    "source": "codex-transcript-counter",
    "scope": "dispatch",
    "observedAt": "2026-09-21T22:52:04.266Z"
  }
}
```
