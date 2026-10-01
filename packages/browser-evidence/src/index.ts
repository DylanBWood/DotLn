import {
  chromium,
  type Browser,
  type BrowserContext,
  type BrowserServer,
} from "playwright";
import { createHash } from "node:crypto";
import { createServer, type Server } from "node:http";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import {
  observeOwned,
  processTable,
  recover,
  remainingOwned,
  saveProcesses,
} from "./processes.js";
import type {
  BrowserEvidence,
  BrowserScenario,
  ConsoleEntry,
  NetworkEntry,
  ProcessRecord,
  ScenarioEnvironment,
  ScenarioResult,
  Witness,
} from "./types.js";

const fixtures = fileURLToPath(new URL("../../fixtures/", import.meta.url));
const environmentValue = (name: string) =>
  process.env[name] ??
  process.env[`npm_config_${name.toLowerCase()}`] ??
  process.env[`npm_package_config_${name.toLowerCase()}`];
// Match the pinned runtime's import-time cache selection, including npm config
// and its relative-path base. Preserve 0's hermetic-install meaning.
const browsersPath = environmentValue("PLAYWRIGHT_BROWSERS_PATH");
const installPath =
  browsersPath && browsersPath !== "0"
    ? resolve(environmentValue("INIT_CWD") || process.cwd(), browsersPath)
    : browsersPath;
const installCommand =
  (installPath === undefined
    ? ""
    : `PLAYWRIGHT_BROWSERS_PATH='${installPath.replaceAll("'", "'\\''")}' `) +
  "npx playwright install chromium --only-shell";
const hash = (bytes: string | Buffer) =>
  `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const kinds = [
  "screenshot",
  "dom-snapshot",
  "accessibility-snapshot",
  "network-trace",
  "console-capture",
] as const;
const line = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 1000 &&
  !/[\u0000-\u001f\u007f\u2028\u2029]/u.test(value);
const localPath = (value: unknown): value is string =>
  line(value) &&
  value.startsWith("/") &&
  !value.startsWith("//") &&
  !value.includes("\\") &&
  new URL(value, "http://fixture.local").origin === "http://fixture.local";
const repositoryPath = (value: unknown): value is string =>
  line(value) &&
  value.length <= 256 &&
  !value.startsWith("/") &&
  !value.includes("\\") &&
  value
    .split("/")
    .every(
      (part) =>
        part !== ".." && part !== "." && part !== ".git" && part.length > 0,
    );
const exact = (value: object, fields: string[]) =>
  Object.keys(value).sort().join(",") === [...fields].sort().join(",");

function scenarioInput(input: BrowserScenario | string): BrowserScenario {
  // Parse a copy even for object callers so saved input cannot mutate in flight.
  const value = JSON.parse(
    typeof input === "string"
      ? readFileSync(input, "utf8")
      : JSON.stringify(input),
  ) as BrowserScenario;
  if (
    !value ||
    value.schemaVersion !== 1 ||
    !exact(value, ["schemaVersion", "scenarioId", "criteria", "steps"]) ||
    !line(value.scenarioId) ||
    value.scenarioId.length > 100 ||
    !/^[a-zA-Z0-9_-]+$/u.test(value.scenarioId) ||
    !Array.isArray(value.criteria) ||
    value.criteria.length < 1 ||
    value.criteria.length > 10 ||
    !Array.isArray(value.steps) ||
    value.steps.length < 2 ||
    value.steps.length > 30
  )
    throw new Error("Invalid browser scenario");
  for (const criterion of value.criteria)
    if (
      !criterion ||
      !exact(criterion, [
        "criterionId",
        "claimType",
        "checkId",
        "codeSurfaces",
      ]) ||
      !line(criterion.criterionId) ||
      criterion.criterionId.length > 100 ||
      !line(criterion.checkId) ||
      !["state", "behavior", "visual", "network"].includes(
        criterion.claimType,
      ) ||
      !Array.isArray(criterion.codeSurfaces) ||
      criterion.codeSurfaces.length < 1 ||
      criterion.codeSurfaces.length > 20 ||
      !criterion.codeSurfaces.every(repositoryPath)
    )
      throw new Error("Invalid scenario criterion");
  if (
    new Set(value.criteria.map((entry) => entry.criterionId)).size !==
    value.criteria.length
  )
    throw new Error("Duplicate scenario criterion");
  for (const step of value.steps) {
    if (!step || typeof step !== "object")
      throw new Error("Invalid scenario step");
    switch (step.action) {
      case "navigate":
        if (exact(step, ["action", "path"]) && localPath(step.path)) continue;
        break;
      case "fill":
      case "assertText":
        if (
          exact(step, ["action", "selector", "value"]) &&
          line(step.selector) &&
          typeof step.value === "string" &&
          step.value.length <= 1000
        )
          continue;
        break;
      case "click":
        if (exact(step, ["action", "selector"]) && line(step.selector))
          continue;
        break;
      case "assertResponse":
        if (
          exact(step, ["action", "path", "status"]) &&
          localPath(step.path) &&
          Number.isInteger(step.status) &&
          step.status >= 100 &&
          step.status <= 599
        )
          continue;
        break;
      case "wait":
        if (
          exact(step, ["action", "milliseconds"]) &&
          Number.isInteger(step.milliseconds) &&
          step.milliseconds >= 0 &&
          step.milliseconds <= 30_000
        )
          continue;
        break;
    }
    throw new Error("Invalid or unsupported scenario step");
  }
  if (
    value.steps[0]!.action !== "navigate" ||
    !value.steps.some(
      (step) =>
        step.action === "assertText" || step.action === "assertResponse",
    )
  )
    throw new Error("Scenario requires initial navigation and an assertion");
  return value;
}

async function fixtureServer(): Promise<{ server: Server; origin: string }> {
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://fixture.local")
      .pathname;
    response.setHeader("Cache-Control", "no-store");
    if (
      request.method === "GET" &&
      ["/", "/console-error.html", "/console-assert.html"].includes(pathname)
    ) {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(
        readFileSync(
          join(fixtures, pathname === "/" ? "index.html" : pathname.slice(1)),
        ),
      );
    } else if (request.method === "POST" && pathname === "/api/greeting") {
      let bytes = 0;
      const chunks: Buffer[] = [];
      try {
        for await (const chunk of request) {
          bytes += chunk.length;
          if (bytes > 4096) throw new Error("Oversized fixture request");
          chunks.push(chunk);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
          name?: unknown;
        };
        if (typeof body.name !== "string" || body.name.length > 100)
          throw new Error("Invalid fixture name");
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ message: `Hello, ${body.name}!` }));
      } catch {
        response.statusCode = 400;
        response.end("Invalid fixture request");
      }
    } else {
      response.statusCode = 404;
      response.end("Fixture path unavailable");
    }
  });
  await new Promise<void>((accept, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", accept);
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Fixture server address unavailable");
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

function evidence(
  scenario: BrowserScenario,
  env: ScenarioEnvironment,
  captures: Witness[] | null,
  failure: string | null,
  unavailable: string | null,
): BrowserEvidence[] {
  return scenario.criteria.flatMap((criterion) => {
    const witnesses: (Witness | null)[] = captures ?? kinds.map(() => null);
    return witnesses.map((capture, index) => {
      const kind = capture?.kind ?? kinds[index]!;
      const witness =
        capture?.kind === "screenshot"
          ? { ...capture, criterionId: criterion.criterionId }
          : capture;
      const consoleError =
        witness?.kind === "console-capture" &&
        witness.entries.some((entry) => entry.level === "error");
      const outcome = consoleError
        ? "fail"
        : unavailable
          ? "unavailable"
          : failure
            ? "fail"
            : "pass";
      return {
        evidenceId: `${scenario.scenarioId}:${criterion.criterionId}:${index}:${kind}`,
        criterionId: criterion.criterionId,
        checkId: criterion.checkId,
        claimType: criterion.claimType,
        source: "synthetic-fixture" as const,
        subjectRevision: env.subjectRevision,
        codeSurfaces: criterion.codeSurfaces,
        automatedTest: `runScenario ${scenario.scenarioId}`,
        observed:
          unavailable ??
          (consoleError
            ? "Console error captured"
            : (failure ?? `${kind} captured; scenario assertions passed`)),
        expected: "Scenario assertions pass without console errors",
        outcome,
        reproductionSteps: [
          `Replay saved scenario ${scenario.scenarioId} with the pinned browser.`,
        ],
        ...(witness ? { witness } : {}),
      };
    });
  });
}

/** Run the fixed scenario interpreter over this package's synthetic application.
 * A saved scenario file is an equivalent input. Recovery precedes a new run.
 * Returned evidence is subject data, never a verifier verdict or matrix update. */
export async function runScenario(
  input: BrowserScenario | string,
  env: ScenarioEnvironment,
): Promise<ScenarioResult> {
  const scenario = scenarioInput(input);
  if (!line(env.subjectRevision) || !line(env.directory))
    throw new Error("Invalid scenario environment");
  const directory = resolve(env.directory);
  const recoveredPids = env.recoverFrom
    ? await recover(resolve(env.recoverFrom))
    : [];
  mkdirSync(directory, { recursive: false });
  writeFileSync(
    join(directory, "scenario.json"),
    `${JSON.stringify(scenario, null, 2)}\n`,
  );
  writeFileSync(
    join(directory, "replay-fields.json"),
    readFileSync(join(fixtures, "replay-fields.json")),
  );
  const owner = processTable().find((entry) => entry.pid === process.pid);
  if (!owner) throw new Error("Browser owner identity unavailable");
  const record: ProcessRecord = {
    schemaVersion: 1,
    owner,
    browserPid: null,
    processes: [],
    closed: false,
  };
  saveProcesses(directory, record);
  let browserServer: BrowserServer | undefined;
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let server: Server | undefined;
  let recorder: ReturnType<typeof setInterval> | undefined;
  let traceStarted = false;
  let captures: Witness[] | null = null;
  let failure: string | null = null;
  let unavailable: string | null = null;
  let remainingPids: number[] = [];
  try {
    try {
      browserServer = await chromium.launchServer({
        host: "127.0.0.1",
        headless: true,
        timeout: 10_000,
      });
    } catch (error) {
      unavailable =
        error instanceof Error &&
        /Executable doesn't exist at /u.test(error.message)
          ? `Pinned Chromium launch unavailable; run ${installCommand}`
          : "Pinned Chromium launch failed; browser launch unavailable";
    }
    if (browserServer) {
      record.browserPid = browserServer.process().pid ?? null;
      if (record.browserPid === null)
        throw new Error("Browser PID unavailable");
      // Capture the root once. Later observations cannot seed from a bare PID.
      const root = processTable().find(
        (entry) =>
          entry.pid === record.browserPid && entry.parentPid === owner.pid,
      );
      if (!root) throw new Error("Browser root identity unavailable");
      record.processes.push(root);
      const recordNow = () => {
        observeOwned(record);
        saveProcesses(directory, record);
      };
      recordNow();
      recorder = setInterval(() => {
        try {
          recordNow();
        } catch {
          unavailable = "Browser process observation unavailable";
        }
      }, 250);
      browser = await chromium.connect(browserServer.wsEndpoint(), {
        timeout: 10_000,
      });
      context = await browser.newContext({
        viewport: { width: 640, height: 400 },
        deviceScaleFactor: 1,
        colorScheme: "light",
        reducedMotion: "reduce",
        locale: "en-US",
        timezoneId: "UTC",
        serviceWorkers: "block",
      });
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
      traceStarted = true;
      const app = await fixtureServer();
      server = app.server;
      // The fixed fixture may request only its own origin. This is a route policy,
      // not a hostile-browser OS/network confinement claim.
      await context.route("**/*", (route) =>
        new URL(route.request().url()).origin === app.origin
          ? route.continue()
          : route.abort(),
      );
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      const consoleEntries: ConsoleEntry[] = [];
      const network: { sequence: number; entry: NetworkEntry }[] = [];
      const pending = new Set<Promise<void>>();
      const sequences = new Map<object, number>();
      const addConsole = (level: ConsoleEntry["level"], message: string) => {
        if (consoleEntries.length >= 100 || message.length > 2000) {
          unavailable = "Console capture exceeds contract bounds";
          return;
        }
        consoleEntries.push({
          level,
          message: message || "(empty console message)",
        });
      };
      page.on("console", (message) => {
        const kind = message.type();
        addConsole(
          ["debug", "log", "info", "warn", "error"].includes(kind)
            ? (kind as ConsoleEntry["level"])
            : kind === "assert"
              ? "error"
              : kind === "warning"
                ? "warn"
                : "log",
          message.text(),
        );
      });
      page.on("pageerror", (error) => addConsole("error", error.message));
      page.on("request", (request) => {
        sequences.set(request, sequences.size);
        if (sequences.size > 6)
          unavailable = "Network capture exceeds contract bounds";
      });
      page.on("requestfailed", () => {
        unavailable = "Network request did not produce a response";
      });
      page.on("requestfinished", (request) => {
        const capture = (async () => {
          const response = await request.response();
          if (!response) throw new Error("Missing response");
          const url = new URL(request.url());
          const body = request.postDataBuffer();
          const responseBody = await response.body();
          network.push({
            sequence: sequences.get(request)!,
            entry: {
              request: {
                method: request.method(),
                url: `http://fixture.local${url.pathname}${url.search}`,
                bodyHash: body === null ? null : hash(body),
              },
              response: {
                status: response.status(),
                bodyHash: hash(responseBody),
              },
            },
          });
        })().catch(() => {
          unavailable = "Network response body unavailable";
        });
        pending.add(capture);
        void capture.finally(() => pending.delete(capture));
      });
      try {
        for (const [index, step] of scenario.steps.entries()) {
          writeFileSync(
            join(directory, "progress.json"),
            JSON.stringify({ step: index, action: step.action }),
          );
          recordNow();
          switch (step.action) {
            case "navigate":
              await page.goto(`${app.origin}${step.path}`, {
                waitUntil: "load",
              });
              break;
            case "fill":
              await page.locator(step.selector).fill(step.value);
              break;
            case "click":
              await page.locator(step.selector).click();
              break;
            case "assertText":
              await page
                .locator(step.selector)
                .filter({ hasText: step.value })
                .waitFor();
              if (
                (await page.locator(step.selector).textContent()) !== step.value
              )
                throw new Error("Text assertion failed");
              break;
            case "assertResponse": {
              const until = Date.now() + 5000;
              while (
                !network.some(
                  ({ entry }) =>
                    entry.request.url === `http://fixture.local${step.path}` &&
                    entry.response.status === step.status,
                )
              ) {
                if (Date.now() >= until)
                  throw new Error("Response assertion failed");
                await delay(25);
              }
              break;
            }
            case "wait":
              await delay(step.milliseconds);
              break;
          }
        }
      } catch {
        failure = "Scenario assertion or action failed";
      }
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      const dom = await page.content();
      const accessibility = await page.locator("body").ariaSnapshot();
      const screenshot = await page.screenshot({
        type: "png",
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
      await Promise.all(pending);
      const entries = network
        .sort((a, b) => a.sequence - b.sequence)
        .map(({ entry }) => entry)
        .slice(0, 6);
      if (!entries.length || entries.length !== sequences.size)
        unavailable ??= "Incomplete network capture";
      const capturedConsole = consoleEntries.map((entry) => ({ ...entry }));
      writeFileSync(join(directory, "dom.html"), dom);
      writeFileSync(join(directory, "accessibility.yml"), accessibility);
      writeFileSync(join(directory, "screenshot.png"), screenshot);
      writeFileSync(
        join(directory, "network.json"),
        `${JSON.stringify(entries, null, 2)}\n`,
      );
      writeFileSync(
        join(directory, "console.json"),
        `${JSON.stringify(capturedConsole, null, 2)}\n`,
      );
      captures = [
        {
          kind: "screenshot",
          contentHash: hash(screenshot),
          criterionId: "bound-per-criterion",
        },
        { kind: "dom-snapshot", contentHash: hash(dom) },
        { kind: "accessibility-snapshot", contentHash: hash(accessibility) },
        ...entries.map((entry): Witness => ({
          kind: "network-trace",
          contentHash: hash(JSON.stringify(entry)),
          ...entry,
        })),
        {
          kind: "console-capture",
          contentHash: hash(JSON.stringify(capturedConsole)),
          entries: capturedConsole,
        },
      ];
    }
  } catch {
    unavailable = "Browser capture or fixture runtime unavailable";
  } finally {
    if (recorder) clearInterval(recorder);
    if (context && traceStarted) {
      try {
        await context.tracing.stop({ path: join(directory, "trace.zip") });
      } catch {
        unavailable = "Browser trace retention unavailable";
      }
    }
    try {
      await context?.close();
    } catch {
      unavailable = "Browser context close unavailable";
    }
    try {
      await browser?.close();
    } catch {
      unavailable = "Browser connection close unavailable";
    }
    try {
      await browserServer?.close();
    } catch {
      try {
        await browserServer?.kill();
      } catch {
        unavailable = "Browser process close unavailable";
      }
    }
    if (server)
      await new Promise<void>((accept) => {
        server!.closeAllConnections();
        server!.close(() => accept());
      });
    remainingPids = await remainingOwned(record);
    if (remainingPids.length)
      unavailable = "Owned browser processes remain after close";
    record.closed = remainingPids.length === 0;
    saveProcesses(directory, record);
  }
  const result: ScenarioResult = {
    availability: unavailable ? "unavailable" : "available",
    reason: unavailable,
    evidence: evidence(scenario, env, captures, failure, unavailable),
    directory,
    recoveredPids,
    remainingPids,
  };
  writeFileSync(
    join(directory, "result.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  return result;
}
