# Environment discovery — 2026-08-30

Scope: bounded inspection for WO-001 on the personal machine. No packages or
configuration were changed. Values of environment variables and configuration
files were not printed. Labels are: `observed`, `documented locally`,
`untested`, `blocked`, `not found`, and `ambiguous`.

Patch levels: exact OS build and browser patch versions were measured but are
deliberately not published here. This is a public repository, and a precise
patch-currency map of a personally identifiable machine is a security
disclosure that WO-001 never needed — the capability questions it asks are
answered by major version and family alone. Toolchain versions are retained
because later work orders depend on them. Re-probe locally when exact
browser patch level actually matters.

Provenance: the inspection was executed by a Codex CLI TUI session
(`codex-cli 0.151.0`, model `gpt-5.6-sol`) running under sandbox policy
`{type: workspace-write, network_access: false}`; `CODEX_SANDBOX` and
`CODEX_SANDBOX_NETWORK_DISABLED` were present in that session's own
environment-name list. That sandbox — not this machine, and not a corporate
or managed environment — is the cause of every `blocked` row that remains
below. Rows marked *(corrected)* were re-measured on 2026-08-31 by a Claude
Code `2.1.251` session; see "Corrections and known gaps" and the second
command log.

## Summary

| Area | Classification | Evidence |
|---|---|---|
| OS and shell | observed | macOS 15 on arm64 (Darwin 24.x); `/bin/zsh`, zsh 5.9. Exact point release and build withheld — see the patch-level note above |
| Node | observed | `/Users/dylanwood/.nvm/versions/node/v22.2.0/bin/node`, v22.2.0 |
| npm / pnpm / yarn | observed | npm 10.8.0; pnpm 9.1.2; yarn 1.22.22 |
| TypeScript compiler | observed | `tsc` 5.4.5 |
| Git | observed | git 2.55.0 |
| Git worktrees | observed | main checkout and this `wo-001` worktree were listed, both at the same starting commit; current branch is `wo-001` |
| SQLite CLI | observed | sqlite3 3.43.2 |
| Browsers | observed | four browsers installed — Brave, Firefox, Chrome, Safari — including a Chromium-based browser at a current major version, which is what browser automation requires. Exact patch levels withheld — see the patch-level note above |
| Playwright | observed | usable on this machine through the connected Playwright MCP server — `claude mcp list` reports `playwright: npx -y @playwright/mcp@latest - ✔ Connected` — with browser binaries already present in `~/Library/Caches/ms-playwright` (`chromium-1234`, `chromium_headless_shell-1234`, `ffmpeg-1011`; directory created 2026-08-30T23:02:08-0400, before this inspection began). It is not available as a plain CLI: no standalone executable, global npm package, or repository package exists, and `npx --no-install playwright --version` produces no version *(corrected; originally `not found`)* |
| Localhost HTTP | observed | serving works: an in-process bind plus fetch on `127.0.0.1` returned `localhost_http_status=200`. The original `blocked` reading came from a race inside the probe, which curled a backgrounded server with no readiness wait — re-running that exact command still yields `no_wait_curl_status=7`, while the identical server polled after a 1 s wait yields `after_1s_curl_status=0` *(corrected; originally `blocked`)* |

## Claude Code 2.1.251

| Capability | Classification | Evidence |
|---|---|---|
| Installed version | observed | `claude --version` returned `2.1.251 (Claude Code)` |
| Print mode | documented locally | `--print` is present in installed help |
| JSON and streaming JSON output | documented locally | `--output-format text|json|stream-json` is present in installed help |
| JSON Schema result | blocked | installed help exposes `--json-schema`; the one permitted smoke invocation emitted a valid JSON result envelope but exited 1 with `Not logged in`, so schema-conforming model output was not obtained. The host itself is authenticated (a `Claude Code-credentials` keychain item exists); the blocker was the executing session's network-disabled sandbox, not the account *(cause corrected)* |
| Model selection | documented locally | `--model` and print-only `--fallback-model` are present |
| Effort selection | documented locally | `--effort low|medium|high|xhigh|max` is present |
| Session persistence | documented locally | `--no-session-persistence`, `--session-id`, `--continue`, `--resume`, and `--fork-session` are present |
| Auto-memory controls | documented locally | `--bare` disables auto-memory; `--safe-mode` disables customizations; project settings contain the `autoMemoryEnabled` key. Installed help does not expose a narrower command-line flag |
| Subagents | documented locally | `--agent`, `--agents`, and the `agents` command are present |
| Workflows | ambiguous | installed help says safe mode disables workflows; no dedicated workflow command was observed, so invocation details are ambiguous |
| Background execution | documented locally | `--background`, `agents`, `attach`, `logs`, `stop`, and `rm` are present |
| Worktree launch | documented locally | `--worktree [name]` and worktree-dependent `--tmux` are present |
| Hooks | documented locally | help states `--bare` and `--safe-mode` skip/disable hooks and exposes hook-event streaming flags; neither discovered settings file has a top-level `hooks` key |
| Settings sources | observed | default-source candidates present: user `~/.claude/settings.json` (362 bytes) and project `.claude/settings.json` (104 bytes); user-local and project-local files were not found. Help documents `--setting-sources user,project,local`. Exact effective values were intentionally not printed |
| Fresh startup context | observed | metadata-only candidates: `~/.claude/CLAUDE.md` (13 lines, 660 bytes) and project `CLAUDE.md` (52 lines, 1950 bytes). Project `AGENTS.md` is a symlink to `CLAUDE.md`; no parent instruction file was found. Claude help explicitly says `--bare` skips `CLAUDE.md` auto-discovery. Whether both user files with identical content are deduplicated is ambiguous |

Claude smoke result: **blocked**. Command used print mode, disabled tools and
session persistence, requested JSON plus a trivial schema, made one attempt,
and returned `Not logged in`. No rate-limit probing or retry occurred. The
cause is the executing session's sandbox (`network_access: false`), not the
account: the host holds a `Claude Code-credentials` keychain item and runs
authenticated Claude Code sessions *(cause corrected)*.

## Codex CLI 0.151.0

| Capability | Classification | Evidence |
|---|---|---|
| Installed version | observed | `codex --version` returned `codex-cli 0.151.0` |
| Noninteractive mode | documented locally | `codex exec` is installed |
| Output formats | documented locally | `exec --json` emits JSONL events; `--output-last-message` writes the final message; `--output-schema` supplies a result schema |
| Model selection | documented locally | global and exec `--model` flags are present; profiles and config overrides are also exposed |
| Sandboxing | documented locally | `--sandbox read-only|workspace-write|danger-full-access`, approval policy, additional writable directories, and bypass controls are present |
| Session persistence | documented locally | `exec --ephemeral`, plus exec resume/fork commands, are present |
| Config locations | observed | installed help names `~/.codex/config.toml`; that file exists (3138 bytes). Project `.codex/config.toml` was not found. A `CODEX_HOME` override was not set in the observed environment-name list |
| AGENTS.md handling | observed | this active session received the project `AGENTS.md`; it is a symlink to `CLAUDE.md`. Metadata candidates are `~/.codex/AGENTS.md` (13 lines, 660 bytes) and project `AGENTS.md` (52 lines, 1950 bytes); no parent file was found. Exact merge/deduplication behavior is ambiguous |
| Feature surface | observed | local `codex features list` reports stable enabled hooks, multi-agent, browser, app, plugin, and workspace-dependency features; this is availability metadata, not an execution test |
| Noninteractive smoke | blocked | the single `codex exec --ephemeral --ignore-user-config --sandbox read-only --json` attempt exited 1: in-process app-server initialization was denied by the executing session's own Codex sandbox (`network_access: false`) — not by a machine limitation or a corporate/managed environment *(cause corrected)* |

## Recommendations for v0.4.0

Build these first, as peer `WorkOrderTransport` adapters already settled by
ADR-0002:

1. **Claude CLI print adapter.** The installed binary locally documents the
   complete desired launch shape: print mode, explicit model and effort,
   project/local setting-source selection, tools control, no persistence,
   worktree launch, and JSON Schema output. Gate its integration test on the
   runner having network access to the model endpoint — the host is already
   authenticated, and the sandbox, not the account, is what blocked the smoke
   call. Explicitly
   disable ambient auto-memory (project setting or a reviewed minimal settings
   payload), since no narrow CLI switch was observed.
2. **Codex CLI exec adapter.** The installed binary locally documents the
   equivalent noninteractive shape: explicit model, sandbox, ephemeral mode,
   ignored user config, JSONL events, and an output schema. Gate its integration
   test on successful app-server initialization outside a network-disabled
   sandbox; the current smoke call is blocked, not passing.

Both adapters should fail closed on unavailable model/auth/runtime rather than
silently substituting. Begin with CLI-process transports, not background or
workflow transports: their bounded input/output and persistence controls are
the best-supported local surfaces, while actual model completion remains a
required integration gate.

## Corrections and known gaps

Three classifications were corrected on 2026-08-31 after an independent
re-measurement pass. All three shared one cause: the executing session's own
sandbox was reported as a property of the machine.

1. **Localhost HTTP** `blocked` → `observed`. The machine serves localhost.
2. **Playwright** `not found` → `observed`. Available via MCP with browser
   binaries installed; the narrower "no CLI/global/repo package" finding was
   true and is retained.
3. **Blocked-cause attribution.** Both model smokes and the JSON-schema row
   now name the network-disabled executing sandbox rather than the account or
   an unspecified "managed" environment, and recommendation 1's integration
   gate points at network access instead of authentication.

Gaps identified in the same pass and deliberately **not** closed here, so a
later work order can scope them:

- **MCP is absent from the Claude Code surface.** Installed help exposes
  `mcp`, `--mcp-config`, and `--strict-mcp-config`, and a Playwright server is
  connected, but no row covers MCP as a capability.
- **Startup-context accounting is partial.** It covers `CLAUDE.md` only;
  `--safe-mode`'s own help enumerates roughly ten auto-loaded categories
  (skills, plugins, hooks, MCP servers, commands, agents, output styles,
  workflows, themes, keybindings).
- **Settings sources record existence, not effective loading**, and the
  managed/policy source and `~/.claude.json` are never enumerated.
- **A user-level `model` key exists in `~/.claude/settings.json`** and was not
  recorded, though it bears directly on the "explicit model and effort" launch
  shape recommended above. (Key names only; no values were read.)
- **The recommendation rests on `documented locally` rows.** No `observed` row
  discriminates between the candidate transports, which is what the WO-001
  evidence gate asks for.
- **The first command log omits three of the executor's thirteen shell calls**
  (its own post-write self-checks) and both file writes.
- **`environment.json` has no counterpart for the Codex "Feature surface" row.**

## Command log

Commands were run from `/Users/dylanwood/Projects/DotLn-wo001`. Compound
read-only probes are retained as compound commands here; no secret values were
requested or recorded.

```sh
pwd && git rev-parse --show-toplevel && sed -n '1,240p' docs/product/07-execution-guide.md && sed -n '1,260p' docs/work-orders/WO-001-environment-truth.md
git status --short && find docs/discovery -maxdepth 2 -type f -print 2>/dev/null || true && uname -a && sw_vers && printf '%s\n' "$SHELL" && zsh --version && command -v node npm pnpm yarn tsc git sqlite3 claude codex playwright chromium chromium-browser google-chrome 'Google Chrome' firefox safari python3 curl nc 2>/dev/null || true && node --version 2>/dev/null || true && npm --version 2>/dev/null || true && pnpm --version 2>/dev/null || true && yarn --version 2>/dev/null || true && tsc --version 2>/dev/null || true && git --version && sqlite3 --version 2>/dev/null || true && claude --version 2>/dev/null || true && codex --version 2>/dev/null || true
claude --help && codex --help && codex exec --help && git worktree list --porcelain && ls -1 /Applications 2>/dev/null | rg -i 'Chrome|Firefox|Safari|Edge|Arc|Brave' || true && ls -1 "$HOME/Applications" 2>/dev/null | rg -i 'Chrome|Firefox|Safari|Edge|Arc|Brave' || true && npm list -g --depth=0 2>/dev/null | rg -i 'playwright|puppeteer' || true && find node_modules -maxdepth 3 -type d -iname '*playwright*' -print 2>/dev/null | head -20
claude -p --tools '' --no-session-persistence --output-format json --json-schema '{"type":"object","properties":{"ok":{"const":true}},"required":["ok"],"additionalProperties":false}' 'Return an object with ok set to true.'
codex exec --ephemeral --ignore-user-config --sandbox read-only --json 'Reply with exactly: OK'
python3 -B -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 & server_pid=$!; curl --silent --show-error --fail --max-time 3 http://127.0.0.1:8765/ >/dev/null; curl_status=$?; kill "$server_pid" 2>/dev/null; wait "$server_pid" 2>/dev/null; printf 'localhost_http_status=%s\n' "$curl_status"
env | cut -d= -f1 | LC_ALL=C sort | rg '^(ANTHROPIC|CLAUDE|CODEX|OPENAI)_' || true
for f in "$HOME/.claude/settings.json" "$HOME/.claude/settings.local.json" .claude/settings.json .claude/settings.local.json; do if [ -f "$f" ]; then stat -f '%N|%z bytes|%Sm' -t '%Y-%m-%dT%H:%M:%S%z' "$f"; else printf '%s|not found\n' "$f"; fi; done
for f in "$HOME/.claude/settings.json" "$HOME/.claude/settings.local.json" .claude/settings.json .claude/settings.local.json; do if [ -f "$f" ]; then jq -r '[has("hooks"),has("permissions"),has("model"),has("effortLevel"),has("autoMemoryEnabled")] | @tsv' "$f"; fi; done
for f in "$HOME/.codex/config.toml" .codex/config.toml; do if [ -f "$f" ]; then stat -f '%N|%z bytes|%Sm' -t '%Y-%m-%dT%H:%M:%S%z' "$f"; else printf '%s|not found\n' "$f"; fi; done
for f in "$HOME/.claude/CLAUDE.md" "$HOME/.codex/AGENTS.md" CLAUDE.md AGENTS.md ../CLAUDE.md ../AGENTS.md; do if [ -f "$f" ]; then lines=$(wc -l < "$f" | tr -d ' '); bytes=$(wc -c < "$f" | tr -d ' '); printf '%s|%s lines|%s bytes\n' "$f" "$lines" "$bytes"; else printf '%s|not found\n' "$f"; fi; done
ls -l CLAUDE.md AGENTS.md 2>/dev/null || true
python3 -B -c 'import http.server,threading,urllib.request; s=http.server.ThreadingHTTPServer(("127.0.0.1",0),http.server.SimpleHTTPRequestHandler); threading.Thread(target=s.handle_request).start(); r=urllib.request.urlopen(f"http://127.0.0.1:{s.server_port}/",timeout=3); print(f"localhost_http_status={r.status}"); r.close(); s.server_close()' 2>/dev/null
claude agents --help
codex doctor --help
codex debug --help
codex features list 2>/dev/null || true
ls -l "$(command -v codex)"
ls -l "$(command -v claude)"
rg -n "WorkOrderTransport|transport adapter|v0\.4\.0" docs/product docs/decisions docs/work-orders | head -80
sed -n '1,55p' docs/decisions/0002-kernel-first-agentic-core.md && sed -n '45,60p' docs/product/02-domain-model.md && sed -n '70,88p' docs/product/06-roadmap.md
date -Iseconds
for app in '/Applications/Brave Browser.app' '/Applications/Firefox.app' '/Applications/Google Chrome.app' '/Applications/Safari.app'; do if [ -f "$app/Contents/Info.plist" ]; then name=$(plutil -extract CFBundleName raw "$app/Contents/Info.plist" 2>/dev/null || basename "$app"); version=$(plutil -extract CFBundleShortVersionString raw "$app/Contents/Info.plist" 2>/dev/null || printf unknown); printf '%s|%s\n' "$name" "$version"; fi; done
command -v playwright npx 2>/dev/null || true
npx --no-install playwright --version 2>/dev/null || true
```

## Verification command log (2026-08-31)

Re-measurement that produced the corrections above, run from
`/Users/dylanwood/Projects/DotLn-wo001` by a Claude Code `2.1.251` session.
Read-only; no values of secrets or configuration files were printed.

```sh
python3 -B -c 'import http.server,threading,urllib.request; s=http.server.ThreadingHTTPServer(("127.0.0.1",0),http.server.SimpleHTTPRequestHandler); threading.Thread(target=s.handle_request,daemon=True).start(); r=urllib.request.urlopen(f"http://127.0.0.1:{s.server_port}/",timeout=3); print(f"bind_port={s.server_port} localhost_http_status={r.status}"); r.close(); s.server_close()'
python3 -B -m http.server 8799 --bind 127.0.0.1 >/dev/null 2>&1 & p=$!; curl -sS --fail --max-time 3 http://127.0.0.1:8799/ >/dev/null 2>&1; echo "no_wait_curl_status=$?"; sleep 1; curl -sS --fail --max-time 3 http://127.0.0.1:8799/ >/dev/null 2>&1; echo "after_1s_curl_status=$?"; kill $p
ls -1 ~/Library/Caches/ms-playwright && stat -f '%N|birth=%SB' -t '%Y-%m-%dT%H:%M:%S%z' ~/Library/Caches/ms-playwright
npx --no-install playwright --version
claude mcp list
grep -ci mcp docs/discovery/environment.md docs/discovery/environment.json
jq -r 'keys|join(", ")' ~/.claude/settings.json .claude/settings.json
security find-generic-password -s "Claude Code-credentials" >/dev/null 2>&1 && echo "keychain item EXISTS"
ROLLOUT=/Users/dylanwood/.codex/sessions/2026/08/30/rollout-2026-08-30T23-08-46-*.jsonl
grep -oh '"sandbox_policy":{[^}]*}' $ROLLOUT | sort -u
grep -ohE '"(model|cli_version|originator)":"[^"]*"' $ROLLOUT | sort -u
grep -ch CODEX_SANDBOX_NETWORK_DISABLED $ROLLOUT
```
