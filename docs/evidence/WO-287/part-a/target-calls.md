# Part A: a target worktree's calls of criteria A1 to A3

Captured 2026-11-17T18:05:23Z by a script in session scratch. It builds the registered target worktree of the target-worktree suite's fixture with its launchpad as an exported instance (the kit's manifest, no package sources, no stops section), runs the worktree's own `.claude/hooks/permissions.mjs` with each call, then gives the launchpad a `stops` line for that call's stop, emits into the worktree again and repeats the call. The fixture's paths are printed as `<target worktree>` and `<launchpad>`.

## A1: a shell line the classifier cannot read (`target-classification`)

The call: `{"tool_name":"Bash","tool_input":{"command":"ls | xargs -I{} sh -c '{}'"}}`

At the default level:

```json
{"systemMessage":"DotLn advisory: command classification: Xargs substitution requires an explicit effect adapter. Stop target-classification advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a shell line its classifier cannot read. \"stops\": { \"target-classification\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

With `"stops": { "target-classification": "refuse" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: target effect classification unavailable. This is stop target-classification, which protects the kit's scoping of a target worktree: a shell line its classifier cannot read. Its level is this root's owner's to set: \"stops\": { \"target-classification\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A1: one of the three forms the launchpad's hook journals unshown (`target-classification`)

The call: `{"tool_name":"Bash","tool_input":{"command":"echo $(date)"}}`

At the default level:

```json
{}
```

## A1: a command run from a directory under the worktree's root (`target-cwd`)

The call: `{"tool_name":"Bash","tool_input":{"command":"ls","workdir":"<target worktree>/nested"}}`

At the default level:

```json
{"systemMessage":"DotLn advisory: target shell requires worktree-root cwd. Stop target-cwd advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a session or a command that runs from a directory other than its root. \"stops\": { \"target-cwd\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

With `"stops": { "target-cwd": "refuse" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: target shell requires worktree-root cwd. This is stop target-cwd, which protects the kit's scoping of a target worktree: a session or a command that runs from a directory other than its root. Its level is this root's owner's to set: \"stops\": { \"target-cwd\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A1: an effect the compiled authority does not list, in a bundle compiled from an authority without `lifecycle.run` (`target-unlisted-effect`)

The call: `{"tool_name":"Bash","tool_input":{"command":"npm run release -- prepare --local"}}`

At the default level:

```json
{"systemMessage":"DotLn advisory: compiled authority does not permit lifecycle.run. Stop target-unlisted-effect advises in this root and the work goes on; it protects the kit's scoping of a target worktree: an effect its compiled authority does not list. \"stops\": { \"target-unlisted-effect\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide.\nDotLn advisory: target shell destinations unavailable; host must run opaque commands. Stop target-destinations advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a command whose write destinations it cannot name. \"stops\": { \"target-destinations\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

With `"stops": { "target-unlisted-effect": "refuse" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit lifecycle.run. This is stop target-unlisted-effect, which protects the kit's scoping of a target worktree: an effect its compiled authority does not list. Its level is this root's owner's to set: \"stops\": { \"target-unlisted-effect\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A1: an agent launch (`target-delegation`)

The call: `{"tool_name":"Agent","tool_input":{"prompt":"review the change"}}`

At the default level:

```json
{"systemMessage":"DotLn advisory: target delegation or interaction has no bounded worker adapter. Stop target-delegation advises in this root and the work goes on; it protects the kit's worker accounting in a target worktree: an agent launch or an interaction tool. \"stops\": { \"target-delegation\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

With `"stops": { "target-delegation": "refuse" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: target delegation or interaction has no bounded worker adapter. This is stop target-delegation, which protects the kit's worker accounting in a target worktree: an agent launch or an interaction tool. Its level is this root's owner's to set: \"stops\": { \"target-delegation\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A2: an effect the compiled authority names as denied (`unapproved-remote`)

The call: `{"tool_name":"Bash","tool_input":{"command":"git push origin HEAD"}}`

At the default level:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit remote.unapproved. This is stop unapproved-remote, which protects work pushed to a remote nobody approved. Its level is this root's owner's to set: \"stops\": { \"unapproved-remote\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

With `"stops": { "unapproved-remote": "advise" }`:

```json
{"systemMessage":"DotLn advisory: compiled authority does not permit remote.unapproved. Stop unapproved-remote advises in this root and the work goes on; it protects work pushed to a remote nobody approved. \"stops\": { \"unapproved-remote\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide.\nDotLn advisory: target shell destinations unavailable; host must run opaque commands. Stop target-destinations advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a command whose write destinations it cannot name. \"stops\": { \"target-destinations\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

## A2: another denied effect (`credentials-access`)

The call: `{"tool_name":"Read","tool_input":{"file_path":"<target worktree>/.env"}}`

At the default level:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit credentials.access. This is stop credentials-access, which protects credentials and environment files read into a session. Its level is this root's owner's to set: \"stops\": { \"credentials-access\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

With `"stops": { "credentials-access": "advise" }`:

```json
{"systemMessage":"DotLn advisory: compiled authority does not permit credentials.access. Stop credentials-access advises in this root and the work goes on; it protects credentials and environment files read into a session. \"stops\": { \"credentials-access\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

## A2: a read outside the worktree (`user-settings`)

The call: `{"tool_name":"Read","tool_input":{"file_path":"<fixture>/elsewhere.txt"}}`

At the default level:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit settings.user. This is stop user-settings, which protects the owner's own settings and instructions outside the worktree. Its level is this root's owner's to set: \"stops\": { \"user-settings\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

With `"stops": { "user-settings": "advise" }`:

```json
{"systemMessage":"DotLn advisory: compiled authority does not permit settings.user. Stop user-settings advises in this root and the work goes on; it protects the owner's own settings and instructions outside the worktree. \"stops\": { \"user-settings\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

## A2: a host started without its sandbox (`sandbox-disable`)

The call: `{"tool_name":"Bash","tool_input":{"command":"claude --dangerously-skip-permissions"}}`

At the default level:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit sandbox.disable. This is stop sandbox-disable, which protects the host's sandbox around a session's commands. Its level is this root's owner's to set: \"stops\": { \"sandbox-disable\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

With `"stops": { "sandbox-disable": "advise" }`:

```json
{"systemMessage":"DotLn advisory: compiled authority does not permit sandbox.disable. Stop sandbox-disable advises in this root and the work goes on; it protects the host's sandbox around a session's commands. \"stops\": { \"sandbox-disable\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide.\nDotLn advisory: target shell destinations unavailable; host must run opaque commands. Stop target-destinations advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a command whose write destinations it cannot name. \"stops\": { \"target-destinations\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
```

## A2: desktop control, which is a stop of its own (`desktop-control`)

The call: `{"tool_name":"mcp__claude-in-chrome__navigate","tool_input":{"url":"about:blank"}}`

At the default level:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit desktop.control. This is stop desktop-control, which protects the operator's own signed-in desktop and browser sessions. A target worktree's guard admits it at no level and under no election, as before a stop had a level."}}
```

With `features.desktop-control` elected in the launchpad and `"stops": { "target-unlisted-effect": "off" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit desktop.control. This is stop desktop-control, which protects the operator's own signed-in desktop and browser sessions. A target worktree's guard admits it at no level and under no election, as before a stop had a level."}}
```

## A1: a session that stands in a directory under the worktree's root (`target-cwd`)

The hook's own `cwd` is `<target worktree>/nested`. A read, the same read again in the same session, and an ssh command from there:

```json
{"systemMessage":"DotLn advisory: target session requires worktree-root cwd. Stop target-cwd advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a session or a command that runs from a directory other than its root. \"stops\": { \"target-cwd\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
{}
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit transport.ssh. This is stop ssh, which protects files sent to another host over ssh, scp or sftp. Its level is this root's owner's to set: \"stops\": { \"ssh\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

From a directory outside the worktree (`<fixture>`), a read and a read of `.env`:

```json
{"systemMessage":"DotLn advisory: target session requires worktree-root cwd. Stop target-cwd advises in this root and the work goes on; it protects the kit's scoping of a target worktree: a session or a command that runs from a directory other than its root. \"stops\": { \"target-cwd\": \"refuse\" } in dotln.config.json makes it refuse and \"off\" silences it; host permissions decide."}
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit credentials.access. This is stop credentials-access, which protects credentials and environment files read into a session. Its level is this root's owner's to set: \"stops\": { \"credentials-access\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A2: a line that holds two effects, one lowered

The call: `{"tool_name":"Bash","tool_input":{"command":"ssh example.invalid; cat .env"}}`

With `"stops": { "ssh": "advise" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit credentials.access. This is stop credentials-access, which protects credentials and environment files read into a session. Its level is this root's owner's to set: \"stops\": { \"credentials-access\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A2: a write to the worktree's Git file (`target-bundle`)

The call: `{"tool_name":"Write","tool_input":{"file_path":"<target worktree>/.git","content":"x"}}`

At the default level:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: Path outside the worktree surface. This is stop target-bundle, which protects a target worktree's Git metadata, settings and installed hook files. Its level is this root's owner's to set: \"stops\": { \"target-bundle\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A3: the recovery control reaches the worktree's guards

One session: the push is refused, `operator override:` is entered at the worktree's own prompt hook, the same push goes through, and after `operator override: off` it is refused again.

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit remote.unapproved. This is stop unapproved-remote, which protects work pushed to a remote nobody approved. Its level is this root's owner's to set: \"stops\": { \"unapproved-remote\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
{"systemMessage":"DotLn: operator-control override; DotLn hook enforcement is suspended for this session. Carry out the operator's recovery instructions and record bypassed requirements truthfully. No lifecycle dispatch or passing check is claimed. Host tool permissions still apply. ","hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"DotLn hook enforcement is suspended for this session. Carry out the operator's recovery instructions and record bypassed requirements truthfully. No lifecycle dispatch or passing check is claimed. Host tool permissions still apply. "}}
{"systemMessage":"DotLn: operator-control override; DotLn hook enforcement is suspended for this session. Carry out the operator's recovery instructions and record bypassed requirements truthfully. No lifecycle dispatch or passing check is claimed. Host tool permissions still apply. "}
{"systemMessage":"DotLn: operator-control exited; ordinary workflow checks resume. No lifecycle dispatch occurred. Record the override for the selected work order: npm run resume -- override-record --bypassed dotln-hook-enforcement --effects <what the recovery changed, or none> --reason 'operator override from <entered> to <exited> [--capture <ignored intake file holding the operator's override words> --capture-hash sha256:<digest>] --harness <harness> --harness-version <version> --model <model> --effort <level> --source <source>. For a closed order, run from the main control-plane checkout with --work-order naming that order; its ignored pending record is carried by the next worktree start. A supplied capture must exist in main at the same ignored intake path and hash. For a withdrawn or unselected order, record the override and what it changed in the order's decisions. The role's completion carries this duty; the record is never a precondition for entering or leaving override.","hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Record the override for the selected work order: npm run resume -- override-record --bypassed dotln-hook-enforcement --effects <what the recovery changed, or none> --reason 'operator override from 2026-11-17T18:05:35.265Z to 2026-11-17T18:05:35.343Z' [--capture <ignored intake file holding the operator's override words> --capture-hash sha256:<digest>] --harness <harness> --harness-version <version> --model <model> --effort <level> --source <source>. For a closed order, run from the main control-plane checkout with --work-order naming that order; its ignored pending record is carried by the next worktree start. A supplied capture must exist in main at the same ignored intake path and hash. For a withdrawn or unselected order, record the override and what it changed in the order's decisions. The role's completion carries this duty; the record is never a precondition for entering or leaving override."}}
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_REFUSED: compiled authority does not permit remote.unapproved. This is stop unapproved-remote, which protects work pushed to a remote nobody approved. Its level is this root's owner's to set: \"stops\": { \"unapproved-remote\": \"advise\" } in dotln.config.json (the launchpad's file; node scripts/harness.mjs emit --target <this worktree>, run from the launchpad, then carries the level here); a session changes it only when its owner asks."}}
```

## A3: a guard that cannot reach the launchpad's runtime

The launchpad's runtime snapshot is moved away, and an ordinary write is called.

At the default level:

```json
{"systemMessage":"DotLn advisory: this worktree's guard cannot reach its launchpad's runtime, so nothing here is being judged; node scripts/harness.mjs emit --target <this worktree>, run from its launchpad, installs the guard again. Stop target-runtime advises in this root; host permissions decide."}
```

With `"stops": { "target-runtime": "refuse" }`:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DOTLN_TARGET_RUNTIME_REFUSED: pinned launchpad runtime unavailable; node scripts/harness.mjs emit --target <this worktree>, run from its launchpad, installs the guard again. This is stop target-runtime; its level is the launchpad owner's to set: \"stops\": { \"target-runtime\": \"advise\" } in the launchpad's dotln.config.json, then that emit."}}
```
