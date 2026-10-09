# Copilot CLI phase-zero observations - 2026-10-08

WO-146. Scripted model launches: 1/12 in this record after 10 in earlier records; each carries a 30-AI-credit soft cap. Installed version: 1.0.89.
Scratch repositories and CLI homes are system-temporary. No operator settings are written. No live CLI is part of a test gate. This is probe evidence, not workflow qualification.

| Anchor | Question | Result | Limit |
| --- | --- | --- | --- |
| <a id="H1"></a>H1 | Registration and event counts | observed | Per-row events identify each registration. Original timestamp-only correlation maxima are ambiguous when simultaneous calls share a timestamp, not proof of duplicate handlers. |
| <a id="H2"></a>H2 | Hook project variable and cwd | observed | See claudeProjectDirMatches, copilotProjectDirMatches and hookCwdMatches, not the shell environment. |
| <a id="H3"></a>H3 | Payload field names | observed | Each event retains its field/type tree; no payload values or correlation keys are retained. |
| <a id="H4"></a>H4 | Tool names | observed | Observed names only; absent tool names remain untested. |
| <a id="H5"></a>H5 | JSON denial and hook error | observed | Judge each protocol and permission mode separately. Missing effects alone do not establish enforcement. Interactive rows are pending. |
| <a id="H6"></a>H6 | Prompt context | not observed | Markers must occur in assistant messages, not just hook input or output. |
| <a id="H7"></a>H7 | Stop message | not observed | Output visibility, not lifecycle enforcement; operator-visible delivery must be separately attested. |
| <a id="H8"></a>H8 | Child hooks and identity | not observed | P4 and corrected P9 request one read-only child. A parent spawn is not a child tool event; missing child identity remains unknown. |
| <a id="H9"></a>H9 | Shell session variable | observed | Observed only when the fixture shell program ran; the hook variable is a separate fact. |
| <a id="H10"></a>H10 | Instructions and skill | observed | AGENTS.md is a symlink. Marker delivery proves availability, not once-only loading; that count remains untested. |
| <a id="H11"></a>H11 | Writer owner and liveness | observed | Uses harnessHostProcess and harnessProcessAlive; no process identifier is retained. |
| <a id="H12"></a>H12 | Model, effort and usage log | observed | Selected values and event shapes only. Auto is not a resolved model. A bare interactive mid-session change is pending. |

## Scripted rows

| Row | Trust fixture | Registration | Permissions | Model selector | Exit | Wall-clock ms |
| --- | --- | --- | --- | --- | --- | --- |
| P11 | trusted selection | claude | tools | default | 0 | 33897 |

## Interactive rows - blocked awaiting operator observation

H1, H5 and H12 require operator-observed sessions entered as bare `copilot` in scratch, including allow-all denial observations and a mid-session model change. Scripted rows and the implementing session are not substitutes. The four executor/fail/fix/pass episodes remain a separate qualification, not performed by this probe.


## Failed-command event

The shared Claude-form registration file names the host's failed-command event and the denial event beside the five observed events; each row records what the CLI did with that file. Nothing here claims either event fires under Copilot.

P11: CLI 1.0.89, exit 0; file names PostToolUseFailure and PermissionDenied; other hooks invoked 30 times; PostToolUseFailure invoked 1 times, PermissionDenied invoked 0 times; the failing command started and was not marked failed.

Machine-readable observations: [companion](copilot-cli-2026-10-08.json).
