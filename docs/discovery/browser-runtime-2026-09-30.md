# Browser runtime observation — 2026-09-30 UTC (WO-057)

Playwright `1.63.0` and Chromium headless shell `153.0.8010.12` (Playwright revision `1243`) installed successfully in a disposable scratch checkout. The browser launched under the unchanged verification-host discovery profile, rendered byte-identical screenshots in two independent runs, disappeared with its recorded parent after SIGKILL, and launched from a launchd-origin process without the harness environment. The filtering-proxy row is unavailable. This is executor evidence on one host and pin, not independent verification or a claim about all applications.

Authority: [WO-057](../work-orders/WO-057-browser-runtime-truth.md). Machine-readable rows, exact fixture, commands, timestamps and process tables: [JSON packet](browser-runtime-2026-09-30.json). Decisions: [WO-057 decisions](../evidence/WO-057/decisions.md). New input read to establish the consumer boundary: [WO-059 Design](../work-orders/WO-059-playwright-evidence-adapter.md); it selects the future `packages/browser-evidence` package, which this order does not create.

Actor: Codex CLI `0.159.2`, `gpt-6.1-sol`, effort `max`, source `codex-session-readback`. Host: macOS `27.0.1` / Darwin `27.0.0`, arm64, Node `26.9.0`, npm `11.19.1`. Times use UTC; the operator's local date was 2026-09-29.

## Observed rows

| Row | Label | Result |
| --- | --- | --- |
| `lockfile-pin` | observed | Exit 0; 1.479 s. |
| `package-install-online` | observed | Exit 0; 0.858 s. |
| `browser-install-online` | observed | Exit 0; 119.562 s. |
| `install-filtering-proxy-warmed-cache` | unavailable | No filtering proxy endpoint was configured on the environment, system or npm surfaces. No proxy was configured for this order; transparent filtering remains unknown. |
| `confinement-control` | observed | Outside read/write and loopback network: EPERM; inside write allowed. |
| `confined-headless-launch` | observed | Exit 0; 1.562 s. |
| `screenshot-hash` | observed | Equal SHA-256 hashes in two fresh browser processes; same fixture. |
| `parent-sigkill` | observed | Parent 14577; browser PIDs 14578, 14579, 14580; no recorded PID in either post-kill snapshot. |
| `launch-without-connected-server` | observed | Parent PID 1; launched and closed; one-shot launchd job removed (exit 0). |

### Install and confinement

The executor generated a scratch-only manifest with an exact `playwright: 1.63.0` dependency, generated a lockfile, then ran `npm ci --ignore-scripts --no-audit --no-fund` itself against the public registry with empty npm user/global configuration and an isolated npm cache. The scratch lockfile SHA-256 is `48c679cb89dc5a090d61dd5816d7ed1ca97665bccca61b951636e59324ff16ec`; it was unchanged by installation. `playwright` and `playwright-core` both resolved to `1.63.0`; their lockfile license labels are Apache-2.0.

The executor then ran `node node_modules/playwright/cli.js install chromium --only-shell` with an isolated `PLAYWRIGHT_BROWSERS_PATH`. The completed download also installed FFmpeg revision `1011`. The cache was moved inside the scratch checkout before confinement; no per-user preinstalled binary was used. The exact downloaded executable is `chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell`, supplied explicitly to `chromium.launch`. The scratch setup initially assumed a different filename and stopped before invoking the sandbox; [D003](../evidence/WO-057/decisions.md#wo-057-d003--correct-the-scratch-executable-selection) records the checked correction.

`detectHostConfinement` reported `inForce: false`. Every browser launch therefore used `/usr/bin/sandbox-exec -p discoverySandbox(<scratch-checkout>)`, the same unchanged function and `runtimeReads=[]` used by `witnessTest`. The supplied environment matched that host: `PATH=<node-bin>:/usr/bin:/bin`, `HOME=<scratch-checkout>`, `TMPDIR=<scratch-checkout>`. macOS additionally synthesized `__CF_USER_TEXT_ENCODING`; only its name was recorded. A synthetic outside sentinel and outside-write attempt both returned `EPERM`, as did a loopback TCP connection. An inside write succeeded. No profile allowance was added.

The proxy inventory inspected variable names only, `scutil --proxy` and bounded boolean projections of npm `proxy`/`https-proxy` configuration. None supplied a proxy endpoint. The warmed-cache command shape is in the JSON, but it was not executed. This observation does not rule out transparent filtering on the network.

### Screenshot identity

Fixture SHA-256: `c0bca6583ba42b86da402c2ec9af684c8d118df9fe3cca42721c3ca54777f4fd`. Both PNG SHA-256 values: `c040f0cdbd028bfbad7244dc4030950a2f828a5c61cae4deee930bd5f3cc2d9c` (1505 bytes each). Each run launched and closed a fresh browser process over the same original static HTML in the JSON packet. Viewport: 400 × 240 CSS pixels; device scale 1; light color scheme; reduced motion; screenshot animations disabled, caret hidden and CSS scale. No font, fetch, animation or live time content was used. The executor viewed the first PNG and checked its expected shapes. Equal hashes support this fixture on this host/pin only.

### Parent SIGKILL

The held browser reported Node parent PID `14577`. The host's pre-kill process table attributed browser PIDs `14578`, `14579`, `14580` to that parent and its browser subtree. The executor sent SIGKILL only to the recorded Node parent and observed its `SIGKILL` exit. `ps -p 14577,14578,14579,14580 -o pid=,ppid=,stat=,comm=` returned exit 1 and no process rows after a programmed 250 ms wait and again after an additional 1750 ms. No recorded browser process survived either snapshot; no cleanup kill was needed. This is one trial over a two-second observation window.

### Launch without the connected server

A temporary job submitted with `/bin/launchctl submit` launched `/usr/bin/env -i`, then the same native sandbox and local probe. The child recorded PID `14586` and parent PID `1`, establishing launchd process origin rather than a harness invocation. It launched Chromium `153.0.8010.12` and closed it successfully. `launchctl remove` removed the one-shot job with exit 0.

`env -i` removed all inherited variables. The harness-related names actually present and removed were `CODEX_CI`, `CODEX_SESSION_ID`, `CODEX_THREAD_ID`, `CODEX_VERSION`. Final-review clarification ([D007](../evidence/WO-057/decisions.md#wo-057-d007--state-the-no-server-rows-removed-names-as-a-projection)): that list and the JSON's `removedVariables` are a projection, the executor session's names matching the probe's prefix filter `^(CODEX|CLAUDE|MCP|PLAYWRIGHT|PW_TEST|VSCODE)`; that session held no other matching name. The removal itself is the `env -i` policy, so a consumer of this row, such as WO-059 criterion 5, clears the whole inherited environment rather than these four names. Under Claude Code the same filter selects that session's `CLAUDE*` names ([VER-001](../verifications/WO-057/VER-001.md)). Only PATH, HOME and TMPDIR were supplied afterward; the observed child names also included macOS's synthesized `__CF_USER_TEXT_ENCODING`. No connected-server endpoint, MCP configuration or harness executable was supplied or invoked. The probe used local `chromium.launch` under network denial. The global connected-server configuration was not altered or read, and no global-server-shutdown claim is made.

## Confined child script used

The following original scratch probe was used for the lifecycle rows. The earlier launch and screenshot processes inherited the same checkout working directory; the explicit `chdir` was added for launchd's independently started process. Invoke it through the profile with mode `launch`, `screenshot`, or `hold`, the installed executable path and an output path inside the checkout. The `hold` parent is the PID killed in the process-table row.

```js
import {dirname} from 'node:path';import {fileURLToPath} from 'node:url';process.chdir(dirname(fileURLToPath(import.meta.url)));
import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
const [mode,executable,resultPath]=process.argv.slice(2);
const result={pid:process.pid,parentPid:process.ppid,environmentNames:Object.keys(process.env).sort(),launched:false};
let browser;
try {
 browser=await chromium.launch({headless:true,executablePath:executable,timeout:10000});
 result.launched=true;result.browserVersion=browser.version();writeFileSync(resultPath,JSON.stringify(result,null,2));console.log(JSON.stringify({ready:true,...result}));
 if(mode==='hold')await new Promise(()=>{});
 if(mode==='screenshot'){const page=await browser.newPage({viewport:{width:400,height:240},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});await page.setContent(readFileSync('fixture.html','utf8'),{waitUntil:'load'});await page.screenshot({path:resultPath+'.png',type:'png',animations:'disabled',caret:'hide',scale:'css'});result.screenshotWritten=true;}
 await browser.close();result.closed=true;writeFileSync(resultPath,JSON.stringify(result,null,2));
} catch(error){result.error=String(error.stack??error);writeFileSync(resultPath,JSON.stringify(result,null,2));console.error(result.error);if(browser)await browser.close().catch(()=>{});process.exitCode=1;}
```

The exact fixture lives in the JSON's `fixture.html` field. For a rerun, write that string to `fixture.html` in a new scratch checkout, generate the same exact package pin/lockfile, install the matching browser, and use the unchanged current profile; preserve each new run as a separately dated observation.

## Dependency decision and limits

[ADR-0002](../decisions/0002-kernel-first-agentic-core.md#amendments) names WO-059's planned `packages/browser-evidence` workspace package as the consumer of the exact observed Playwright pin, outside the pure kernel and compiler. [LEGAL Current state](../LEGAL.md#current-state) records the observation and the existing inventory/THIRD_PARTY_NOTICES duty. The scratch lockfile labels do not audit the bundled browser's many components. The downloaded `LICENSE.headless_shell` and FFmpeg `COPYING.LGPLv2.1` were inventoried by filename, size and hash in the JSON; their full texts were not imported into the repository.

No workspace manifest, workspace lockfile, runtime source, registered `environment.json` evidence source or the three legal hash declarations changed. The [environment addendum](environment.md#wo-057-browser-runtime-addendum-2026-09-30) preserves earlier time-indexed observations. A Codex disconnect interrupted the interactive handle after installation; the completed per-command scratch receipts were read back, so no download success was inferred from a lost handle and no install was unnecessarily repeated.

This probe establishes availability of the selected direct runtime; it does not compare it with Playwright MCP or establish which automation architecture is preferable. The operator questioned that distinction during execution; [D006](../evidence/WO-057/decisions.md#wo-057-d006--distinguish-runtime-availability-from-an-mcp-architecture-choice) records the question and the limit.

The online install ran outside the native launch profile, whose network denial would prohibit downloads. This observation covers one browser/version/host, two renders of one static fixture, one parent-kill trial and one standalone launch. Reopen on a changed pin, OS or native profile, on observed screenshot variance or leaked children, or when a real filtering proxy becomes available.

Current official API sources checked: [pinned browser install documentation](https://github.com/microsoft/playwright/blob/v1.63.0/docs/src/browsers.md), [BrowserType API](https://github.com/microsoft/playwright/blob/v1.63.0/docs/src/api/class-browsertype.md) and the installed `playwright-core/types/types.d.ts`. Documentation established command/API shape; the observations above come from the executed rows.
