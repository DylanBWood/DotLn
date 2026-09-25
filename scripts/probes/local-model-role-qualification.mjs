#!/usr/bin/env node

// WO-138 live evaluations are explicit. Importing this module performs no
// inference, starts no runner and invokes no remote transport.
import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isMainModule } from "../lib/paths.mjs";
import { TOOL_ROOT } from "../lib/config.mjs";

export const ROOT = TOOL_ROOT;
export const FIXTURE_PATH = join(
  ROOT,
  "scripts/fixtures/wo138-local-role-qualification.json",
);
export const PINNED_LOCAL = {
  alias: "dotln-local",
  modelKey: "qwen/qwen3.6-27b",
  artifactFile: "Qwen3.6-27B-Q4_K_M.gguf",
  bytes: 16_547_398_784,
  sha256: "33625d8dc3a5dd8d88c324d47db58561b11f7072816287078bfe58b4c55782f9",
  applicationVersion: "0.4.24+1",
  cliCommit: "ff50809",
  runtimeVersion: "2.38.0",
};
export const DEFAULT_ENDPOINT = "http://127.0.0.1:1234";
export const DEFAULT_REMOTE_MODEL = "gpt-5.6-sol";
export const EPISODE_TIMEOUT_MS = 120_000;
export const BASELINE_REPEATS = 5;

const CODEX_DISABLED = [
  "apps",
  "browser_use",
  "computer_use",
  "image_generation",
  "in_app_browser",
  "in_app_chat",
  "in_app_local_automation",
  "multi_agent",
  "multi_agent_v2",
  "code_mode_host",
  "plugins",
  "remote_plugin",
  "hooks",
  "memories",
  "context_management",
  "skill_search",
  "skill_mcp_dependency_install",
  "tool_suggest",
  "workspace_dependencies",
  "shell_snapshot",
  "view_image",
  "shell_tool",
  "unified_exec",
];

const exactKeys = (value, keys) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join("\0") === [...keys].sort().join("\0");

export const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, child]) => [key, stableValue(child)]),
    );
  return value;
}

export const stableStringify = (value) => JSON.stringify(stableValue(value));

export function fixture() {
  return JSON.parse(readFileSync(FIXTURE_PATH, "utf8"));
}

function requireLine(source, pattern, label) {
  const matches = source.split("\n").filter((line) => pattern.test(line));
  if (matches.length !== 1)
    throw new Error(
      `T1 source needs one ${label} row; observed ${matches.length}`,
    );
  return matches[0];
}

function requireExcerpt(source, pattern, label) {
  const match = source.match(pattern);
  if (!match?.[0]) throw new Error(`T1 source needs one ${label} excerpt`);
  return match[0].replace(/\s+/gu, " ").trim();
}

export function t1Input() {
  const config = fixture().t1;
  const source = readFileSync(join(ROOT, config.source), "utf8");
  const criteria = source
    .split("\n")
    .filter((line) => /^### AC[1-6] —/u.test(line));
  if (criteria.length !== 6)
    throw new Error(
      `T1 source needs six criterion headings; observed ${criteria.length}`,
    );
  return {
    source: config.source,
    labeledRows: [
      {
        rowId: "receipt-verdict",
        text: requireExcerpt(source, /\*\*Verdict: pass\.\*\*/u, "verdict"),
      },
      {
        rowId: "receipt-coverage",
        text: requireExcerpt(
          source,
          /All six acceptance criteria of\s+`[^`]+` are met by the current subject\./u,
          "criterion coverage",
        ),
      },
      {
        rowId: "receipt-findings",
        text: requireExcerpt(
          source,
          /Five candidate findings were raised and all five were refuted as test-coverage\s+preferences rather than defects in the delivered work\./u,
          "candidate findings",
        ),
      },
      {
        rowId: "receipt-repair-routing",
        text: requireExcerpt(
          source,
          /No finding routes to\s+repair\./u,
          "repair routing",
        ),
      },
      {
        rowId: "receipt-advisories",
        text: requireExcerpt(
          source,
          /Seven advisory observations are recorded below for the reviewer\./u,
          "advisory count",
        ),
      },
      {
        rowId: "receipt-gate",
        text: requireLine(source, /^\| Canonical gate \|/u, "canonical gate"),
      },
      {
        rowId: "receipt-dependencies",
        text: requireLine(source, /^\| Dependencies \|/u, "dependency"),
      },
      ...criteria.map((text, index) => ({
        rowId: `criterion-${index + 1}`,
        text,
      })),
    ],
  };
}

function seedDiscoveryFixture(root, source) {
  for (const [path, contents] of Object.entries(source.files)) {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, contents);
  }
  const conventions = {
    checks: ["lint", "test"].map((kind) => ({
      kind,
      argv: [process.execPath, `checks/${kind}.cjs`],
      paths: ["src/main.js"],
    })),
    ...source.conventions,
  };
  mkdirSync(join(root, ".dotln"), { recursive: true });
  writeFileSync(
    join(root, ".dotln/discovery.json"),
    JSON.stringify(conventions) + "\n",
  );
}

export async function t2Input() {
  const config = fixture().t2;
  const source = JSON.parse(readFileSync(join(ROOT, config.source), "utf8"));
  const built = join(ROOT, "packages/skeleton/dist/src/discovery.js");
  if (!existsSync(built))
    throw new Error(
      "T2 preparation needs the current build; run npm run build --silent",
    );
  const scratch = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-wo138-discovery-")),
  );
  try {
    seedDiscoveryFixture(scratch, source);
    const { discover } = await import(pathToFileURL(built).href);
    const report = discover(scratch);
    const evidence = new Map(
      report.evidence.map((entry) => [entry.evidenceId, entry]),
    );
    return {
      source: config.source,
      rankingCriterion: config.rankingCriterion,
      candidates: report.candidates.map((candidate) => ({
        candidateId: candidate.candidateId,
        kind: candidate.kind,
        paths: candidate.paths,
        ...(candidate.proposedHome
          ? { proposedHome: candidate.proposedHome }
          : {}),
        evidence: candidate.evidence.map((id) => evidence.get(id)),
        size: candidate.size,
      })),
    };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

export function t3Input({ definitions = false } = {}) {
  const config = fixture().t3;
  return {
    source: config.source,
    labels: config.labels,
    ...(definitions ? { labelDefinitions: config.definitions } : {}),
    rows: config.rows.map(({ rowId, row }) => ({ rowId, row })),
  };
}

export function taskSchema(taskId, inputs) {
  const text = { type: "string" };
  let result;
  if (taskId === "T1") {
    const field = { ...text, maxLength: 40 };
    result = {
      type: "object",
      additionalProperties: false,
      required: [
        "verdict",
        "criteriaMet",
        "criteriaTotal",
        "candidateFindings",
        "repairFindings",
        "advisoryObservations",
        "gatePassedSuites",
        "gateFailedSuites",
        "gateDurationSeconds",
        "newDependencies",
        "summary",
      ],
      properties: {
        verdict: field,
        criteriaMet: field,
        criteriaTotal: field,
        candidateFindings: field,
        repairFindings: field,
        advisoryObservations: field,
        gatePassedSuites: field,
        gateFailedSuites: field,
        gateDurationSeconds: field,
        newDependencies: field,
        summary: { ...text, maxLength: 320 },
      },
    };
  } else if (taskId === "T2") {
    result = {
      type: "object",
      additionalProperties: false,
      required: ["ranking", "rationale"],
      properties: {
        ranking: {
          type: "array",
          maxItems: inputs.T2.candidates.length,
          items: {
            ...text,
            enum: inputs.T2.candidates.map(
              (candidate) => candidate.candidateId,
            ),
          },
        },
        rationale: { ...text, maxLength: 320 },
      },
    };
  } else if (taskId === "T3") {
    result = {
      type: "object",
      additionalProperties: false,
      required: ["classifications", "reason"],
      properties: {
        classifications: {
          type: "array",
          maxItems: inputs.T3.rows.length + 1,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["rowId", "label"],
            properties: {
              rowId: text,
              label: { ...text, enum: fixture().t3.labels },
            },
          },
        },
        reason: { ...text, maxLength: 320 },
      },
    };
  } else throw new Error(`unknown task ${taskId}`);
  return {
    type: "object",
    additionalProperties: false,
    required: ["taskId", "status", "requiresHuman", "result"],
    properties: {
      taskId: { ...text, enum: [taskId] },
      status: { ...text, enum: ["completed", "blocked"] },
      requiresHuman: { type: "boolean" },
      result,
    },
  };
}

export async function taskInputs() {
  return { T1: t1Input(), T2: await t2Input(), T3: t3Input() };
}

// Discovery evidence includes a digest of stderr containing the scratch path.
// Preserve the real producer output once; every arm must use that same input.
export async function pinTaskInputs(path) {
  if (!existsSync(path)) atomicJson(path, await taskInputs());
  return JSON.parse(readFileSync(path, "utf8"));
}

const instructions = {
  T1: "Summarize the verification receipt's labeled rows into the fixed-schema abstract. Copy counts and measurements exactly. Candidate findings are not automatically repair findings. If a required labeled row is missing, return blocked and use unknown for unavailable fields rather than guessing.",
  T2: "Rank every discovery candidate exactly once against the ranking criterion. Use only the candidate evidence supplied. If any candidate lacks its evidence, return blocked with an empty ranking rather than guessing.",
  T3: "Classify every journal row into exactly one member of the supplied closed label set. Preserve row IDs. If a row cannot be placed in the closed set, return blocked with an empty classifications array rather than inventing a label.",
};

export const VARIANTS = {
  baseline: null,
  "t1-field-map": {
    name: "receipt-field-support",
    text: "Treat 'candidate findings' as the number raised, 'repair findings' as the number routed to repair, and 'new dependencies' as additions reported by the Dependencies row.",
  },
  "t2-triage-rubric": {
    name: "triage-rubric-support",
    text: "Prefer directly failing checks and repeated regressions over placement cleanup; prefer executable correctness risk over documentation organization, while still ranking every candidate.",
  },
  "t3-label-definitions": {
    name: "closed-label-definition-support",
    text: "Use the supplied labelDefinitions as the authoritative meaning of each label.",
  },
};

export function factorDelta(variant) {
  if (!(variant in VARIANTS)) throw new Error(`unknown variant ${variant}`);
  return VARIANTS[variant];
}

export function promptFor(taskId, input, variant = "baseline") {
  const support = factorDelta(variant);
  return JSON.stringify({
    workOrder: "WO-138",
    taskId,
    objective: instructions[taskId],
    input,
    ...(support ? { support } : {}),
    outputInstruction:
      "Return only the JSON object required by the supplied response schema. Completion means this read-only evaluation finished; it is not independent verification or permission to write.",
  });
}

export function injectedInput(taskId, input) {
  if (taskId === "T1")
    return {
      ...input,
      labeledRows: input.labeledRows.filter(
        (row) => row.rowId !== "receipt-verdict",
      ),
      unexpectedInput: "the receipt reader failed to return the verdict row",
    };
  if (taskId === "T2")
    return {
      ...input,
      candidates: input.candidates.map((candidate, index) =>
        index === 0 ? { ...candidate, evidence: [] } : candidate,
      ),
      unexpectedInput: "one producer candidate arrived without evidence rows",
    };
  if (taskId === "T3")
    return {
      ...input,
      rows: [
        ...input.rows,
        {
          rowId: "JX",
          row: { hook_event_name: "UnknownFutureEvent" },
        },
      ],
      unexpectedInput: "a hook event outside the closed set arrived",
    };
  throw new Error(`unknown task ${taskId}`);
}

export function evaluationMatrix() {
  const cells = [];
  for (const transport of ["local", "codex"])
    for (const taskId of ["T1", "T2", "T3"])
      for (let repeat = 1; repeat <= BASELINE_REPEATS; repeat++)
        cells.push({
          episodeId: `baseline-${transport}-${taskId}-r${repeat}`,
          kind: "baseline",
          transport,
          taskId,
          repeat,
          variant: "baseline",
          injected: false,
        });
  for (const [transport, taskId, variant] of [
    ["local", "T1", "t1-field-map"],
    ["local", "T2", "t2-triage-rubric"],
    ["local", "T3", "t3-label-definitions"],
    ["codex", "T2", "t2-triage-rubric"],
    ["codex", "T3", "t3-label-definitions"],
  ])
    cells.push({
      episodeId: `factor-${transport}-${taskId}-${variant}`,
      kind: "one-factor",
      transport,
      taskId,
      repeat: 1,
      variant,
      injected: false,
    });
  for (const taskId of ["T1", "T2", "T3"])
    cells.push({
      episodeId: `failure-local-${taskId}-unexpected-input`,
      kind: "tool-failure",
      transport: "local",
      taskId,
      repeat: 1,
      variant: "baseline",
      injected: true,
    });
  return cells;
}

function requireString(value, label, max = 10_000) {
  if (
    typeof value !== "string" ||
    value.length < 1 ||
    value.length > max ||
    /[\u0000\u2028\u2029]/u.test(value)
  )
    throw new Error(`invalid ${label}`);
}

export function validateAnswer(
  value,
  taskId,
  inputs,
  { injected = false } = {},
) {
  if (!exactKeys(value, ["taskId", "status", "requiresHuman", "result"]))
    throw new Error("result root contract");
  if (
    value.taskId !== taskId ||
    !["completed", "blocked"].includes(value.status) ||
    typeof value.requiresHuman !== "boolean"
  )
    throw new Error("result envelope contract");
  if (injected && value.status !== "blocked")
    throw new Error("unexpected input was not blocked");
  if (taskId === "T1") {
    const fields = [
      "verdict",
      "criteriaMet",
      "criteriaTotal",
      "candidateFindings",
      "repairFindings",
      "advisoryObservations",
      "gatePassedSuites",
      "gateFailedSuites",
      "gateDurationSeconds",
      "newDependencies",
      "summary",
    ];
    if (!exactKeys(value.result, fields)) throw new Error("T1 result contract");
    for (const field of fields)
      requireString(
        value.result[field],
        `T1 ${field}`,
        field === "summary" ? 320 : 40,
      );
  } else if (taskId === "T2") {
    if (!exactKeys(value.result, ["ranking", "rationale"]))
      throw new Error("T2 result contract");
    requireString(value.result.rationale, "T2 rationale", 320);
    if (!Array.isArray(value.result.ranking))
      throw new Error("T2 ranking contract");
    const allowed = inputs.T2.candidates.map(
      (candidate) => candidate.candidateId,
    );
    if (
      new Set(value.result.ranking).size !== value.result.ranking.length ||
      value.result.ranking.some((id) => !allowed.includes(id)) ||
      (value.status === "completed" &&
        value.result.ranking.length !== allowed.length) ||
      (value.status === "blocked" && value.result.ranking.length !== 0)
    )
      throw new Error("T2 ranking coverage");
  } else if (taskId === "T3") {
    if (!exactKeys(value.result, ["classifications", "reason"]))
      throw new Error("T3 result contract");
    requireString(value.result.reason, "T3 reason", 320);
    if (!Array.isArray(value.result.classifications))
      throw new Error("T3 classifications contract");
    const expectedRows = new Set(inputs.T3.rows.map((row) => row.rowId));
    const labels = new Set(fixture().t3.labels);
    const seen = new Set();
    for (const item of value.result.classifications) {
      if (
        !exactKeys(item, ["rowId", "label"]) ||
        seen.has(item.rowId) ||
        !expectedRows.has(item.rowId) ||
        !labels.has(item.label)
      )
        throw new Error("T3 classification row");
      seen.add(item.rowId);
    }
    if (
      (value.status === "completed" && seen.size !== expectedRows.size) ||
      (value.status === "blocked" && seen.size !== 0)
    )
      throw new Error("T3 classification coverage");
  } else throw new Error(`unknown task ${taskId}`);
  return value;
}

export function spearman(left, right) {
  if (
    !Array.isArray(left) ||
    left.length < 2 ||
    left.length !== right.length ||
    new Set(left).size !== left.length ||
    [...left].sort().join("\0") !== [...right].sort().join("\0")
  )
    throw new Error("Spearman inputs must be permutations of one set");
  const positions = new Map(right.map((id, index) => [id, index + 1]));
  const squared = left.reduce((total, id, index) => {
    const distance = index + 1 - positions.get(id);
    return total + distance * distance;
  }, 0);
  return 1 - (6 * squared) / (left.length * (left.length ** 2 - 1));
}

export function oracleAgreement(taskId, answer, operatorRanking) {
  if (answer.status !== "completed") return 0;
  if (taskId === "T1") {
    const oracle = fixture().t1.oracle;
    const fields = Object.keys(oracle);
    return (
      fields.filter((field) => answer.result[field] === oracle[field]).length /
      fields.length
    );
  }
  if (taskId === "T2") return spearman(answer.result.ranking, operatorRanking);
  const labels = new Map(
    fixture().t3.rows.map((row) => [row.rowId, row.label]),
  );
  return (
    answer.result.classifications.filter(
      (item) => labels.get(item.rowId) === item.label,
    ).length / labels.size
  );
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function round(value, places = 6) {
  return value === null ? null : Number(value.toFixed(places));
}

function sanitizeDetail(value) {
  return String(value ?? "")
    .replace(
      /(?:Bearer\s+|(?:api[_-]?key|token|password)\s*[=:]\s*)\S+/giu,
      "[redacted credential]",
    )
    .slice(-2000);
}

function usageShape(value) {
  if (!value || typeof value !== "object") return null;
  const pick = (names) => {
    for (const name of names)
      if (Number.isFinite(value[name])) return Number(value[name]);
    return null;
  };
  return {
    inputTokens: pick(["input_tokens", "prompt_tokens", "inputTokens"]),
    cachedInputTokens: pick(["cached_input_tokens", "cachedInputTokens"]),
    outputTokens: pick(["output_tokens", "completion_tokens", "outputTokens"]),
    totalTokens: pick(["total_tokens", "totalTokens"]),
  };
}

function parseStructuredContent(content) {
  if (typeof content !== "string" || !content.trim())
    throw new Error("structured output content absent");
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("structured output is not JSON");
  }
}

export async function runHttpEpisode({
  endpoint,
  model,
  prompt,
  schema,
  timeoutMs = EPISODE_TIMEOUT_MS,
}) {
  const started = performance.now();
  const controller = new AbortController();
  let gateObserved = false;
  let timedOut = false;
  const deadline = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const gateWatch = setInterval(() => {
    if (productGateProcesses().length) {
      gateObserved = true;
      controller.abort();
    }
  }, 250);
  let response;
  try {
    response = await fetch(`${endpoint}/api/v0/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      redirect: "error",
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "Return only the JSON object required by the response schema. Do not explain.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0,
        top_p: 1,
        seed: 424242,
        reasoning_effort: "none",
        stream: false,
        max_tokens: 768,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "dotln_local_role_qualification",
            strict: true,
            schema,
          },
        },
      }),
    });
  } catch (error) {
    if (gateObserved)
      throw Object.assign(
        new Error(
          "Product gate started during live inference; episode discarded",
        ),
        {
          code: "gate-overlap",
          latencyMs: performance.now() - started,
        },
      );
    throw Object.assign(new Error("local endpoint request failed"), {
      code: timedOut ? "deadline-exceeded" : "transport-failed",
      detail: sanitizeDetail(error?.cause?.code ?? error?.message),
      latencyMs: performance.now() - started,
    });
  } finally {
    clearTimeout(deadline);
    clearInterval(gateWatch);
  }
  const text = await response.text();
  const latencyMs = performance.now() - started;
  if (!response.ok)
    throw Object.assign(new Error(`local endpoint http-${response.status}`), {
      code: /model|loaded/iu.test(text)
        ? "model-unavailable"
        : "transport-failed",
      latencyMs,
    });
  let wire;
  try {
    wire = JSON.parse(text);
  } catch {
    throw Object.assign(new Error("local endpoint returned non-JSON"), {
      code: "invalid-result",
      latencyMs,
    });
  }
  const choice = wire?.choices?.[0];
  if (choice?.finish_reason === "length")
    throw Object.assign(new Error("local completion reached its token cap"), {
      code: "output-limit",
      latencyMs,
    });
  return {
    answer: parseStructuredContent(choice?.message?.content),
    latencyMs,
    usage: usageShape(wire?.usage),
    responseModel: typeof wire?.model === "string" ? wire.model : "unavailable",
    finishReason:
      typeof choice?.finish_reason === "string"
        ? choice.finish_reason
        : "unavailable",
    reportedTokensPerSecond: Number.isFinite(wire?.stats?.tokens_per_second)
      ? Number(wire.stats.tokens_per_second)
      : null,
  };
}

export async function runCodexEpisode({
  model,
  prompt,
  schema,
  timeoutMs = EPISODE_TIMEOUT_MS,
  cwd = ROOT,
}) {
  // WO-159: the one Codex launcher builds the argv and isolates the home.
  const launcher = await import(
    pathToFileURL(join(ROOT, "packages/skeleton/dist/src/worker-transport.js"))
      .href
  );
  const scratch = mkdtempSync(join(tmpdir(), "dotln-wo138-schema-"));
  const schemaPath = join(scratch, "result.json");
  writeFileSync(schemaPath, JSON.stringify(schema), { mode: 0o600 });
  const args = launcher.codexExecArgv({
    rest: [
      "--strict-config",
      "--model",
      model,
      "--json",
      "--output-schema",
      schemaPath,
      "--cd",
      cwd,
      "-c",
      'default_permissions="dotln-worker"',
      "-c",
      'permissions.dotln-worker.filesystem={":minimal"="read",":workspace_roots"="read"}',
      "-c",
      "permissions.dotln-worker.network.enabled=false",
      "-c",
      'approval_policy="never"',
      "-c",
      'web_search="disabled"',
      "-c",
      "project_doc_max_bytes=0",
      "-c",
      "mcp_servers={}",
      "-c",
      "memories.use_memories=false",
      "-c",
      "memories.generate_memories=false",
      "-c",
      'shell_environment_policy.inherit="none"',
      ...CODEX_DISABLED.flatMap((feature) => ["--disable", feature]),
      "-c",
      'model_reasoning_effort="xhigh"',
      "-",
    ],
  });
  const started = performance.now();
  const episode = launcher.startCodexEpisode();
  try {
    const run = await new Promise((resolveRun) => {
      const child = spawn("codex", args, {
        cwd,
        env: episode.env,
        stdio: ["pipe", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      let settled = false;
      let failure;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(deadline);
        clearInterval(gateWatch);
        resolveRun(value);
      };
      const deadline = setTimeout(() => {
        failure = Object.assign(new Error("remote deadline exceeded"), {
          code: "ETIMEDOUT",
        });
        child.kill("SIGTERM");
      }, timeoutMs);
      const gateWatch = setInterval(() => {
        if (!productGateProcesses().length) return;
        failure = Object.assign(
          new Error(
            "Product gate started during live inference; episode discarded",
          ),
          { code: "gate-overlap" },
        );
        child.kill("SIGTERM");
      }, 250);
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
        if (stdout.length + stderr.length > 5_000_000) {
          failure = Object.assign(
            new Error("remote output exceeded byte bound"),
            {
              code: "max-buffer",
            },
          );
          child.kill("SIGTERM");
        }
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
        if (stdout.length + stderr.length > 5_000_000) {
          failure = Object.assign(
            new Error("remote output exceeded byte bound"),
            {
              code: "max-buffer",
            },
          );
          child.kill("SIGTERM");
        }
      });
      child.on("error", (error) => {
        failure ??= error;
      });
      child.on("close", (status, signal) =>
        finish({ error: failure, signal, status, stdout, stderr }),
      );
      child.stdin.end(prompt);
    });
    const latencyMs = performance.now() - started;
    const codexIsolation = episode.finish();
    try {
      return { ...decodeCodexRun(run, latencyMs, model), codexIsolation };
    } catch (error) {
      throw Object.assign(error, { codexIsolation });
    }
  } finally {
    episode.finish();
    rmSync(scratch, { recursive: true, force: true });
  }
}

// Read only diagnostic events; never retain the whole stream or unrelated items.
function codexFailureDetail(run, fallback) {
  const messages = [];
  for (const line of run.stdout.split("\n")) {
    try {
      const event = JSON.parse(line);
      if (!["error", "turn.failed"].includes(event?.type)) continue;
      const message = event.message ?? event.error?.message;
      if (typeof message === "string" && message.trim()) messages.push(message);
    } catch {}
  }
  return sanitizeDetail(
    [run.error?.message, run.stderr.trim(), ...messages, fallback]
      .filter(Boolean)
      .join("\n"),
  );
}

export function decodeCodexRun(run, latencyMs, model) {
  if (run.error?.code === "gate-overlap")
    throw Object.assign(run.error, { latencyMs });
  if (run.error || run.signal || run.status !== 0)
    throw Object.assign(
      new Error(
        run.error?.code === "ETIMEDOUT"
          ? "remote deadline exceeded"
          : `remote transport exit-${run.status ?? "unknown"}`,
      ),
      {
        code:
          run.error?.code === "ETIMEDOUT"
            ? "deadline-exceeded"
            : /model.{0,100}(not found|unavailable|invalid)/iu.test(
                  `${run.stdout}${run.stderr}`,
                )
              ? "model-unavailable"
              : "transport-failed",
        detail: codexFailureDetail(
          run,
          `remote transport exit-${run.status ?? "unknown"}${run.signal ? ` signal-${run.signal}` : ""}`,
        ),
        latencyMs,
      },
    );
  let events;
  try {
    events = run.stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    throw Object.assign(new Error("remote JSONL wire is invalid"), {
      code: "invalid-result",
      latencyMs,
    });
  }
  if (
    events.some((event) => ["error", "turn.failed"].includes(event.type)) ||
    !events.some((event) => event.type === "turn.completed")
  )
    throw Object.assign(new Error("remote turn incomplete"), {
      code: "transport-failed",
      detail: codexFailureDetail(run, "remote turn incomplete"),
      latencyMs,
    });
  const messages = events.filter(
    (event) =>
      event.type === "item.completed" && event.item?.type === "agent_message",
  );
  const terminal = events.findLast((event) => event.type === "turn.completed");
  return {
    answer: parseStructuredContent(messages.at(-1)?.item?.text),
    latencyMs,
    usage: usageShape(terminal?.usage),
    finishReason: "turn.completed",
    responseModel: model,
    reportedTokensPerSecond: null,
  };
}

function atomicJson(path, value, { replace = false } = {}) {
  mkdirSync(dirname(path), { recursive: true });
  if (!replace && existsSync(path))
    throw new Error(`retain existing file: ${path}`);
  const stage = join(
    dirname(path),
    `.${basename(path)}.${process.pid}.${Date.now()}.part`,
  );
  writeFileSync(stage, JSON.stringify(value, null, 2) + "\n", { mode: 0o600 });
  renameSync(stage, path);
}

function lmsPath() {
  const path = join(homedir(), ".lmstudio/bin/lms");
  if (!existsSync(path)) throw new Error("LM Studio CLI is unavailable");
  return path;
}

function lms(args, options = {}) {
  return execFileSync(lmsPath(), args, {
    encoding: "utf8",
    timeout: options.timeout ?? 30_000,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function livePreflight() {
  const gates = productGateProcesses();
  if (gates.length)
    throw new Error("Product gate process observed; live inference refused");
  const thermal = execFileSync("pmset", ["-g", "therm"], {
    encoding: "utf8",
    timeout: 3000,
  }).trim();
  if (
    /CPU_Speed_Limit\s*=\s*(?!100\b)\d+|Thermal_Level\s*=\s*[1-9]/u.test(
      thermal,
    )
  )
    throw new Error("Thermal pressure reported; live inference refused");
  return {
    observedAt: new Date().toISOString(),
    gateProcessCount: 0,
    thermal,
    source: "host process and pmset point observations",
  };
}

function productGateProcesses() {
  const processes = execFileSync("ps", ["-axo", "pid=,args="], {
    encoding: "utf8",
    timeout: 3000,
  });
  const gates = processes
    .split("\n")
    .filter(
      (line) =>
        !line.includes(String(process.pid)) &&
        /(scripts\/test-runner\.mjs|node scripts\/harness\.mjs evidence|npm test)/u.test(
          line,
        ),
    );
  return gates;
}

function modelIdentity(model) {
  const serialized = JSON.stringify(model);
  const artifactMatch =
    serialized.includes(PINNED_LOCAL.modelKey) ||
    serialized.includes(PINNED_LOCAL.artifactFile);
  if (!artifactMatch)
    throw new Error(
      "Loaded alias does not expose the pinned artifact identity",
    );
  return {
    source: "lms ps --json after load; never the request model field",
    identifier: model.identifier,
    artifactMatch,
    artifactFile: PINNED_LOCAL.artifactFile,
    artifactSha256: PINNED_LOCAL.sha256,
    observedKeys: Object.keys(model).sort(),
    status: model.status ?? "unavailable",
    queued: model.queued ?? null,
  };
}

async function endpointAvailable(endpoint) {
  try {
    const response = await fetch(`${endpoint}/api/v0/models`, {
      redirect: "error",
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function beginLocalSession(endpoint) {
  livePreflight();
  const inventory = lms(["ls", PINNED_LOCAL.modelKey, "--json"], {
    timeout: 10_000,
  });
  if (!inventory.includes(PINNED_LOCAL.artifactFile))
    throw new Error(
      "Pinned local artifact is absent from the runner inventory",
    );
  const origin = new URL(endpoint);
  if (
    origin.protocol !== "http:" ||
    origin.hostname !== "127.0.0.1" ||
    !origin.port ||
    origin.pathname !== "/"
  )
    throw new Error(
      "Local qualification needs an explicit IPv4 loopback origin",
    );
  const ownsServer = !(await endpointAvailable(endpoint));
  let ownsModel = false;
  try {
    if (ownsServer) {
      lms(
        ["server", "start", "--bind", origin.hostname, "--port", origin.port],
        { timeout: 30_000 },
      );
      for (let attempt = 0; attempt < 10; attempt++) {
        if (await endpointAvailable(endpoint)) break;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      if (!(await endpointAvailable(endpoint)))
        throw new Error(
          "Started local server did not answer its model listing",
        );
    }
    let models = JSON.parse(lms(["ps", "--json"]));
    let model = models.find((entry) => entry.identifier === PINNED_LOCAL.alias);
    if (!model) {
      lms(
        [
          "load",
          PINNED_LOCAL.modelKey,
          "--identifier",
          PINNED_LOCAL.alias,
          "--context-length",
          "4096",
          "--parallel",
          "1",
          "--gpu",
          "max",
          "--no-speculative-draft-mtp",
          "-y",
        ],
        { timeout: 120_000 },
      );
      ownsModel = true;
      models = JSON.parse(lms(["ps", "--json"]));
      model = models.find((entry) => entry.identifier === PINNED_LOCAL.alias);
    }
    if (!model) throw new Error("Pinned local alias did not load");
    const identity = modelIdentity(model);
    if (identity.status !== "idle" || identity.queued !== 0)
      throw new Error("Pinned local alias is not loaded and idle");
    return {
      identity,
      ownsServer,
      ownsModel,
      preflight: livePreflight(),
      cleanup() {
        const rows = [];
        if (ownsModel) {
          try {
            lms(["unload", PINNED_LOCAL.alias], { timeout: 30_000 });
            rows.push({ action: "unload", outcome: "observed" });
          } catch (error) {
            rows.push({
              action: "unload",
              outcome: "failed",
              detail: sanitizeDetail(error.message),
            });
          }
        }
        if (ownsServer) {
          try {
            lms(["server", "stop"], { timeout: 30_000 });
            rows.push({ action: "server-stop", outcome: "observed" });
          } catch (error) {
            rows.push({
              action: "server-stop",
              outcome: "failed",
              detail: sanitizeDetail(error.message),
            });
          }
        }
        return rows;
      },
    };
  } catch (error) {
    if (ownsModel) {
      try {
        lms(["unload", PINNED_LOCAL.alias]);
      } catch {}
    }
    if (ownsServer) {
      try {
        lms(["server", "stop"]);
      } catch {}
    }
    throw error;
  }
}

function remoteVersion() {
  try {
    return execFileSync("codex", ["--version"], {
      encoding: "utf8",
      timeout: 5000,
    }).trim();
  } catch {
    return "unknown";
  }
}

function episodeRecord({
  cell,
  model,
  harnessVersion,
  modelIdentity: identity,
  prompt,
  schema,
  harnessBuildHash,
  input,
  observed,
  operatorRanking,
  startedAt,
}) {
  const promptHash = sha256(prompt);
  const schemaHash = sha256(stableStringify(schema));
  const cellBuildHash = sha256(
    stableStringify({
      harnessBuildHash,
      taskId: cell.taskId,
      variant: cell.variant,
      support: factorDelta(cell.variant),
    }),
  );
  const base = {
    schemaVersion: 1,
    workOrder: "WO-138",
    episodeId: cell.episodeId,
    cell,
    model,
    harnessVersion,
    modelIdentity: identity,
    harnessBuildHash,
    cellBuildHash,
    promptHash,
    schemaHash,
    inputHash: sha256(stableStringify(input)),
    sourcePaths: [fixture()[cell.taskId.toLowerCase()].source],
    startedAt,
    finishedAt: new Date().toISOString(),
    actualOperatorInterventions: 0,
    boundary:
      cell.transport === "local"
        ? "loopback client; all inputs committed public material; no no-egress claim"
        : "existing codex-cli-exec inspection shape; tools and model-side network disabled",
    ...(observed.codexIsolation
      ? { codexIsolation: observed.codexIsolation }
      : {}),
  };
  try {
    const answer = validateAnswer(
      observed.answer,
      cell.taskId,
      inputsForRecord,
      {
        injected: cell.injected,
      },
    );
    const agreement =
      cell.taskId === "T2" && !operatorRanking
        ? null
        : oracleAgreement(cell.taskId, answer, operatorRanking);
    const outputTokens = observed.usage?.outputTokens;
    return {
      ...base,
      outcome: "validated-envelope",
      schemaValid: true,
      status: answer.status,
      requiresHuman: answer.requiresHuman,
      answer,
      oracleAgreement: agreement,
      latencyMs: observed.latencyMs,
      usage: observed.usage,
      tokensPerSecond:
        observed.reportedTokensPerSecond ??
        (Number.isFinite(outputTokens) && observed.latencyMs > 0
          ? outputTokens / (observed.latencyMs / 1000)
          : null),
      responseModel: observed.responseModel,
      finishReason: observed.finishReason,
    };
  } catch (error) {
    return {
      ...base,
      outcome: "typed-failure",
      schemaValid: false,
      status: "failed",
      requiresHuman: null,
      oracleAgreement: 0,
      latencyMs: observed.latencyMs ?? null,
      usage: observed.usage ?? null,
      tokensPerSecond: null,
      reportedOutput: observed.answer ?? null,
      responseModel: observed.responseModel ?? null,
      finishReason: observed.finishReason ?? null,
      failure: {
        code: error.code ?? "invalid-result",
        detail: sanitizeDetail(error.message),
      },
    };
  }
}

let inputsForRecord;

export async function runMatrix({
  transport,
  outDir,
  remoteModel = DEFAULT_REMOTE_MODEL,
  endpoint = DEFAULT_ENDPOINT,
}) {
  if (!["local", "codex"].includes(transport))
    throw new Error("transport must be local or codex");
  inputsForRecord = await pinTaskInputs(join(dirname(outDir), "inputs.json"));
  const harnessBuildHash = sha256(readFileSync(fileURLToPath(import.meta.url)));
  const cells = evaluationMatrix().filter(
    (cell) => cell.transport === transport,
  );
  mkdirSync(outDir, { recursive: true });
  let localSession;
  const manifestPath = join(dirname(outDir), `run-${transport}.json`);
  const manifest = {
    schemaVersion: 1,
    workOrder: "WO-138",
    transport,
    startedAt: new Date().toISOString(),
    harnessBuildHash,
    inputsHash: sha256(stableStringify(inputsForRecord)),
    plannedEpisodes: cells.map((cell) => cell.episodeId),
    retainedEpisodes: [],
    completedEpisodes: [],
    cleanup: [],
  };
  try {
    if (transport === "local") {
      localSession = await beginLocalSession(endpoint);
      manifest.modelIdentity = localSession.identity;
      manifest.preflight = localSession.preflight;
    } else {
      manifest.model = remoteModel;
      manifest.harnessVersion = remoteVersion();
    }
    for (const cell of cells) {
      const destination = join(outDir, `${cell.episodeId}.json`);
      if (existsSync(destination)) {
        manifest.retainedEpisodes.push(cell.episodeId);
        process.stdout.write(
          JSON.stringify({ episodeId: cell.episodeId, outcome: "retained" }) +
            "\n",
        );
        continue;
      }
      livePreflight();
      const baselineInput = inputsForRecord[cell.taskId];
      const input = cell.injected
        ? injectedInput(cell.taskId, baselineInput)
        : cell.variant === "t3-label-definitions"
          ? { ...baselineInput, labelDefinitions: fixture().t3.definitions }
          : baselineInput;
      const prompt = promptFor(cell.taskId, input, cell.variant);
      const schema = taskSchema(cell.taskId, inputsForRecord);
      const startedAt = new Date().toISOString();
      let observed;
      try {
        observed =
          transport === "local"
            ? await runHttpEpisode({
                endpoint,
                model: PINNED_LOCAL.alias,
                prompt,
                schema,
              })
            : await runCodexEpisode({
                model: remoteModel,
                prompt,
                schema,
              });
      } catch (error) {
        if (error.code === "gate-overlap") throw error;
        observed = {
          answer: null,
          latencyMs: error.latencyMs ?? null,
          usage: null,
          failure: {
            code: error.code ?? "transport-failed",
            detail: sanitizeDetail(error.detail || error.message),
          },
          ...(error.codexIsolation
            ? { codexIsolation: error.codexIsolation }
            : {}),
        };
      }
      let record;
      if (observed.failure) {
        record = {
          schemaVersion: 1,
          workOrder: "WO-138",
          episodeId: cell.episodeId,
          cell,
          model: transport === "local" ? PINNED_LOCAL.alias : remoteModel,
          harnessVersion:
            transport === "local"
              ? PINNED_LOCAL.applicationVersion
              : manifest.harnessVersion,
          modelIdentity:
            transport === "local"
              ? localSession.identity
              : {
                  source: "requested remote transport model",
                  model: remoteModel,
                },
          harnessBuildHash,
          cellBuildHash: sha256(
            stableStringify({
              harnessBuildHash,
              taskId: cell.taskId,
              variant: cell.variant,
              support: factorDelta(cell.variant),
            }),
          ),
          promptHash: sha256(prompt),
          schemaHash: sha256(stableStringify(schema)),
          inputHash: sha256(stableStringify(input)),
          sourcePaths: [fixture()[cell.taskId.toLowerCase()].source],
          startedAt,
          finishedAt: new Date().toISOString(),
          actualOperatorInterventions: 0,
          outcome: "typed-failure",
          schemaValid: false,
          status: "failed",
          requiresHuman: null,
          oracleAgreement: 0,
          latencyMs: observed.latencyMs,
          usage: null,
          tokensPerSecond: null,
          failure: observed.failure,
          ...(observed.codexIsolation
            ? { codexIsolation: observed.codexIsolation }
            : {}),
          boundary:
            transport === "local"
              ? "loopback client; all inputs committed public material; no no-egress claim"
              : "existing codex-cli-exec inspection shape; tools and model-side network disabled",
        };
      } else
        record = episodeRecord({
          cell,
          model: transport === "local" ? PINNED_LOCAL.alias : remoteModel,
          harnessVersion:
            transport === "local"
              ? PINNED_LOCAL.applicationVersion
              : manifest.harnessVersion,
          modelIdentity:
            transport === "local"
              ? localSession.identity
              : {
                  source: "requested remote transport model",
                  model: remoteModel,
                },
          prompt,
          schema,
          harnessBuildHash,
          input,
          observed,
          operatorRanking: null,
          startedAt,
        });
      atomicJson(destination, record);
      manifest.completedEpisodes.push(cell.episodeId);
      process.stdout.write(
        JSON.stringify({
          episodeId: cell.episodeId,
          outcome: record.outcome,
          schemaValid: record.schemaValid,
          status: record.status,
          latencyMs: record.latencyMs,
        }) + "\n",
      );
    }
  } finally {
    if (localSession) manifest.cleanup = localSession.cleanup();
    manifest.finishedAt = new Date().toISOString();
    atomicJson(manifestPath, manifest, { replace: true });
  }
  return manifest;
}

export async function rankingRequest() {
  const input = await t2Input();
  return {
    schemaVersion: 1,
    workOrder: "WO-138",
    requestedAt: new Date().toISOString(),
    source: input.source,
    rankingCriterion: input.rankingCriterion,
    candidates: input.candidates,
    responseContract: {
      ranking: input.candidates.map((candidate) => candidate.candidateId),
      instruction:
        "Return these six candidate IDs once each, reordered from highest to lowest priority. The executor records elapsed operator time from this request to the reply.",
    },
  };
}

export function validateOperatorRanking(value, candidateIds) {
  if (
    !exactKeys(value, [
      "schemaVersion",
      "workOrder",
      "source",
      "requestedAt",
      "completedAt",
      "elapsedSeconds",
      "ranking",
    ]) ||
    value.schemaVersion !== 1 ||
    value.workOrder !== "WO-138" ||
    value.source !== "operator" ||
    typeof value.requestedAt !== "string" ||
    typeof value.completedAt !== "string" ||
    !Number.isFinite(value.elapsedSeconds) ||
    value.elapsedSeconds < 0 ||
    value.elapsedSeconds > 1800 ||
    !Array.isArray(value.ranking) ||
    value.ranking.length !== candidateIds.length ||
    new Set(value.ranking).size !== candidateIds.length ||
    [...value.ranking].sort().join("\0") !== [...candidateIds].sort().join("\0")
  )
    throw new Error("invalid held-out operator ranking");
  return value;
}

function distribution(records, taskId, transport) {
  const rows = records.filter(
    (record) =>
      record.cell.kind === "baseline" &&
      record.cell.taskId === taskId &&
      record.cell.transport === transport,
  );
  const scores = rows.map((record) => record.oracleAgreement ?? 0);
  const latencies = rows
    .map((record) => record.latencyMs)
    .filter(Number.isFinite);
  const rates = rows
    .map((record) => record.tokensPerSecond)
    .filter(Number.isFinite);
  return {
    episodes: rows.length,
    modelResponses: rows.filter(
      (record) => record.schemaValid || record.reportedOutput != null,
    ).length,
    schemaValid: rows.filter((record) => record.schemaValid).length,
    schemaValidRate:
      rows.filter((record) => record.schemaValid).length / BASELINE_REPEATS,
    oracleAgreement: scores.map((score) => round(score)),
    medianOracleAgreement: round(median(scores)),
    minOracleAgreement: round(Math.min(...scores)),
    maxOracleAgreement: round(Math.max(...scores)),
    medianLatencyMs: round(median(latencies), 3),
    medianTokensPerSecond: round(median(rates), 3),
    actualOperatorInterventions: rows.reduce(
      (total, record) => total + record.actualOperatorInterventions,
      0,
    ),
    requestedHumanInterventions: rows.filter((record) => record.requiresHuman)
      .length,
    typedFailures: rows.filter((record) => record.outcome === "typed-failure")
      .length,
  };
}

export function evaluateRecords(records, operatorRanking) {
  const expected = new Set(evaluationMatrix().map((cell) => cell.episodeId));
  if (
    records.length !== expected.size ||
    new Set(records.map((record) => record.episodeId)).size !== expected.size ||
    records.some((record) => !expected.has(record.episodeId))
  )
    throw new Error("evaluation needs exactly the registered 38 episodes");
  const rescored = records.map((record) => {
    const score =
      record.schemaValid && record.status === "completed"
        ? oracleAgreement(
            record.cell.taskId,
            record.answer,
            operatorRanking.ranking,
          )
        : 0;
    return { ...record, oracleAgreement: round(score) };
  });
  const tasks = {};
  const thresholds = { T1: 0.9, T2: 0.7, T3: 0.9 };
  for (const taskId of ["T1", "T2", "T3"]) {
    const local = distribution(rescored, taskId, "local");
    const remote = distribution(rescored, taskId, "codex");
    const comparatorAvailable = remote.modelResponses === BASELINE_REPEATS;
    const withinRemote = comparatorAvailable
      ? local.medianOracleAgreement >= remote.medianOracleAgreement - 0.1
      : null;
    const floor = {
      schemaFiveOfFive: local.schemaValid === BASELINE_REPEATS,
      agreement:
        local.medianOracleAgreement !== null &&
        local.medianOracleAgreement >= thresholds[taskId],
      withinTenPointsOfRemote: withinRemote,
      medianLatencyAtMost120Seconds:
        local.medianLatencyMs !== null && local.medianLatencyMs <= 120_000,
      noEpisodeIntervention: local.actualOperatorInterventions === 0,
    };
    tasks[taskId] = {
      threshold: thresholds[taskId],
      local,
      remote,
      comparatorAvailable,
      localMinusRemote: comparatorAvailable
        ? round(local.medianOracleAgreement - remote.medianOracleAgreement)
        : null,
      floor,
      qualifies: Object.values(floor).every(Boolean),
    };
  }
  const qualifying = Object.entries(tasks)
    .filter(([, result]) => result.qualifies)
    .map(([taskId]) => taskId);
  const unavailableComparators = Object.entries(tasks)
    .filter(([, result]) => !result.comparatorAvailable)
    .map(([taskId]) => taskId);
  const outcome = unavailableComparators.length
    ? "inconclusive"
    : qualifying.length === 3
      ? "ready"
      : qualifying.length === 0
        ? "negative"
        : "inconclusive";
  const factorCells = rescored
    .filter((record) => record.cell.kind === "one-factor")
    .map((record) => {
      const baseline =
        tasks[record.cell.taskId][
          record.cell.transport === "local" ? "local" : "remote"
        ];
      return {
        episodeId: record.episodeId,
        taskId: record.cell.taskId,
        transport: record.cell.transport,
        variant: record.cell.variant,
        factor: factorDelta(record.cell.variant),
        cellBuildHash: record.cellBuildHash,
        baselineBuildHash: rescored.find(
          (candidate) =>
            candidate.cell.kind === "baseline" &&
            candidate.cell.taskId === record.cell.taskId &&
            candidate.cell.transport === record.cell.transport,
        )?.cellBuildHash,
        agreement: record.oracleAgreement,
        baselineMedianAgreement: baseline.medianOracleAgreement,
        delta: round(record.oracleAgreement - baseline.medianOracleAgreement),
      };
    });
  const toolFailureCells = rescored
    .filter((record) => record.cell.kind === "tool-failure")
    .map((record) => ({
      episodeId: record.episodeId,
      taskId: record.cell.taskId,
      outcome: record.outcome,
      schemaValid: record.schemaValid,
      status: record.status,
      requestedHuman: record.requiresHuman,
      actualOperatorInterventions: record.actualOperatorInterventions,
      failure: record.failure ?? null,
    }));
  return {
    schemaVersion: 1,
    workOrder: "WO-138",
    evaluatedAt: new Date().toISOString(),
    outcome,
    blocker: unavailableComparators.length
      ? `Remote comparison unavailable for ${unavailableComparators.join(", ")}: five returned model outputs required`
      : outcome === "inconclusive"
        ? `Only ${qualifying.join(", ")} met every pre-registered floor`
        : outcome === "negative"
          ? "No task met every pre-registered floor"
          : null,
    qualifyingTasks: qualifying,
    noPrivateInputQualification: true,
    noCapabilityLevelPromotion: true,
    implementationOrVerificationQualified: false,
    operatorRanking: {
      elapsedSeconds: operatorRanking.elapsedSeconds,
      requestedAt: operatorRanking.requestedAt,
      completedAt: operatorRanking.completedAt,
    },
    tasks,
    oneFactorCells: factorCells,
    toolFailureCells,
    episodeCount: rescored.length,
    baselineEpisodeCount: rescored.filter(
      (record) => record.cell.kind === "baseline",
    ).length,
    limits: [
      "Five repeats estimate only this fixed prompt/task/build cell; they do not establish a population reliability rate.",
      "The comparator is one remote model over one existing inspection transport.",
      "Every input is committed public material or a seeded scratch repository; no no-egress claim is made.",
      "The result qualifies neither private-input use, source writing, implementation nor independent verification.",
    ],
  };
}

// New evaluations bind the current build. Historical evaluations must supply
// the actual retained source bytes, never a replacement hash or an allowlist.
export function validateRecordInputs(
  records,
  inputs,
  harnessSource = readFileSync(fileURLToPath(import.meta.url)),
) {
  const build = sha256(harnessSource);
  for (const record of records) {
    const cell = record.cell;
    const baseInput = inputs[cell.taskId];
    const input = cell.injected
      ? injectedInput(cell.taskId, baseInput)
      : cell.variant === "t3-label-definitions"
        ? { ...baseInput, labelDefinitions: fixture().t3.definitions }
        : baseInput;
    if (
      record.harnessBuildHash !== build ||
      record.inputHash !== sha256(stableStringify(input)) ||
      record.promptHash !==
        sha256(promptFor(cell.taskId, input, cell.variant)) ||
      record.schemaHash !==
        sha256(stableStringify(taskSchema(cell.taskId, inputs)))
    )
      throw new Error(
        `episode input/prompt/schema/build binding differs: ${record.episodeId}`,
      );
  }
}

function readEpisodes(directory) {
  return evaluationMatrix().map((cell) => {
    const path = join(directory, `${cell.episodeId}.json`);
    if (!existsSync(path)) throw new Error(`missing episode ${cell.episodeId}`);
    return JSON.parse(readFileSync(path, "utf8"));
  });
}

function option(args, name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1]) throw new Error(`${name} needs a value`);
  return args[index + 1];
}

async function main() {
  const [action, ...args] = process.argv.slice(2);
  if (action === "prepare") {
    const out = option(args, "--out");
    if (!out || args.length !== 2)
      throw new Error(
        "usage: local-model-role-qualification.mjs prepare --out <new-json-path>",
      );
    const request = await rankingRequest();
    atomicJson(resolve(out), request);
    process.stdout.write(
      JSON.stringify({
        output: resolve(out),
        candidates: request.candidates.length,
      }) + "\n",
    );
    return;
  }
  if (action === "run") {
    const transport = option(args, "--transport");
    const outDir = option(args, "--out-dir");
    const allowed = new Set([
      "--transport",
      "--out-dir",
      "--model",
      "--endpoint",
    ]);
    if (
      !transport ||
      !outDir ||
      args.length % 2 !== 0 ||
      args.some((value, index) => index % 2 === 0 && !allowed.has(value))
    )
      throw new Error(
        "usage: local-model-role-qualification.mjs run --transport local|codex --out-dir <directory> [--model <remote-model>] [--endpoint <loopback-origin>]",
      );
    await runMatrix({
      transport,
      outDir: resolve(outDir),
      remoteModel: option(args, "--model", DEFAULT_REMOTE_MODEL),
      endpoint: option(args, "--endpoint", DEFAULT_ENDPOINT),
    });
    return;
  }
  if (action === "evaluate") {
    const episodes = option(args, "--episodes");
    const rankingPath = option(args, "--operator-ranking");
    const out = option(args, "--out");
    const harnessSource = option(args, "--harness-source");
    const allowed = new Set([
      "--episodes",
      "--operator-ranking",
      "--out",
      "--harness-source",
    ]);
    const flags = args.filter((_, index) => index % 2 === 0);
    if (
      !episodes ||
      !rankingPath ||
      !out ||
      args.length % 2 !== 0 ||
      flags.some((flag) => !allowed.has(flag)) ||
      new Set(flags).size !== flags.length
    )
      throw new Error(
        "usage: local-model-role-qualification.mjs evaluate --episodes <directory> --operator-ranking <json> --out <new-json-path> [--harness-source <retained-source-file>]",
      );
    const inputs = JSON.parse(
      readFileSync(join(dirname(resolve(episodes)), "inputs.json"), "utf8"),
    );
    inputsForRecord = inputs;
    const candidateIds = inputs.T2.candidates.map(
      (candidate) => candidate.candidateId,
    );
    const ranking = validateOperatorRanking(
      JSON.parse(readFileSync(resolve(rankingPath), "utf8")),
      candidateIds,
    );
    const records = readEpisodes(resolve(episodes));
    validateRecordInputs(
      records,
      inputs,
      harnessSource ? readFileSync(resolve(harnessSource)) : undefined,
    );
    const result = evaluateRecords(records, ranking);
    atomicJson(resolve(out), result);
    process.stdout.write(
      JSON.stringify({ output: resolve(out), outcome: result.outcome }) + "\n",
    );
    return;
  }
  throw new Error(
    "usage: local-model-role-qualification.mjs prepare|run|evaluate ...",
  );
}

if (isMainModule(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(
      `error: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
