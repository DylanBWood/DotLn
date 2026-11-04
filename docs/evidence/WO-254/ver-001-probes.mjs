import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  appendFileSync,
  realpathSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
const project = process.cwd();
const mod = (p) => import(pathToFileURL(join(project, p)).href);
const { createFixtureRoot, excludeFixtureOwnership, removeTemporaryPath } =
  await mod("scripts/lib/temporary-roots.mjs");
const { spawnGit } = await mod("scripts/lib/git.mjs");
const { codexContinuation } = await mod(
  "packages/compiler/src/codex-continuation.mjs",
);
const { operatorMessageClass, harnessSessionPhase } = await mod(
  "packages/compiler/dist/src/index.js",
);
const { checkRulesRecorded, renderRulesRecordedBlock } = await mod(
  "scripts/lib/planning-document.mjs",
);
const sha = (x) => createHash("sha256").update(x).digest("hex");
const results = [];
async function fixture(run) {
  const root = realpathSync(
    createFixtureRoot(join(tmpdir(), "dotln-wo254-verifier-")),
  );
  const git = spawnGit(["init", "--quiet"], { cwd: root, encoding: "utf8" });
  assert.equal(git.status, 0, git.stderr);
  assert.equal(
    spawnGit(["rev-parse", "--show-toplevel"], {
      cwd: root,
      encoding: "utf8",
    }).stdout.trim(),
    root,
  );
  excludeFixtureOwnership(root);
  const id = "wo254-verifier-" + root.split("/").at(-1),
    key = sha(id);
  const directory = join(root, "docs/control/local/harness");
  mkdirSync(directory, { recursive: true });
  mkdirSync(join(root, "docs/control/orders"), { recursive: true });
  mkdirSync(join(root, "scripts"));
  const session = {
    role: "executor",
    workOrder: "WO-999",
    expectedEvent: "ImplementationReady",
    startingEventCount: 1,
    boundDispatch: { startedAt: "2026-01-02T00:00:00.000Z" },
  };
  const saveSession = () =>
    writeFileSync(join(directory, key + ".json"), JSON.stringify(session));
  saveSession();
  writeFileSync(
    join(root, "docs/control/orders/WO-999.jsonl"),
    JSON.stringify({ type: "WorkOrderActivated", workOrderId: "WO-999" }) +
      "\n",
  );
  writeFileSync(
    join(root, "scripts/resume.mjs"),
    "console.log(" +
      JSON.stringify(JSON.stringify({ workOrder: "WO-999", phase: "active" })) +
      ");\n",
  );
  writeFileSync(
    join(root, "scripts/harness.mjs"),
    "console.log(" +
      JSON.stringify(JSON.stringify({ reserved: true, actorId: key })) +
      ");\n",
  );
  const input = { cwd: root, session_id: id, turn_id: "same-long-turn" };
  const hook = async (event, extra = {}) => {
    const payload = { ...input, hook_event_name: event, ...extra };
    if (process.argv.includes("--generated")) {
      const invoked = spawnSync(
        process.execPath,
        [join(project, ".codex/hooks/continuation.mjs")],
        { cwd: root, input: JSON.stringify(payload), encoding: "utf8" },
      );
      assert.equal(invoked.status, 0, invoked.stderr);
      return JSON.parse(invoked.stdout);
    }
    return codexContinuation(
      payload,
      async () => null,
      operatorMessageClass,
      async () => null,
      harnessSessionPhase,
    );
  };
  const rows = (suffix) => {
    try {
      return readFileSync(join(directory, key + suffix), "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(JSON.parse);
    } catch {
      return [];
    }
  };
  try {
    await run({ root, directory, key, session, saveSession, hook, rows });
  } finally {
    removeTemporaryPath(root, { recursive: true, force: true });
  }
}
await fixture(async ({ root, directory, key, hook, rows }) => {
  const message =
    "Keep the two checkpoints separate.\nCould you pause before the final gate?";
  await hook("UserPromptSubmit", { prompt: message });
  const transcript = join(root, "transcript.jsonl");
  const transcriptRows = [];
  const record = (row) => {
    transcriptRows.push(row);
    writeFileSync(
      transcript,
      transcriptRows.map(JSON.stringify).join("\n") + "\n",
    );
  };
  const reply = (text) => ({
    type: "response_item",
    timestamp: new Date().toISOString(),
    payload: {
      type: "message",
      role: "assistant",
      phase: "commentary",
      content: [{ type: "output_text", text }],
    },
  });
  for (const n of [1, 2]) {
    record({
      type: "compacted",
      timestamp: new Date().toISOString(),
      payload: { message: "checkpoint " + n },
    });
    await hook("PostCompact", { trigger: "auto" });
    const restored = await hook("SessionStart", { source: "compact" });
    assert.ok(restored.hookSpecificOutput.additionalContext.includes(message));
    record(reply("First reply after compaction " + n));
  }
  await hook("Stop", {
    stop_hook_active: false,
    transcript_path: transcript,
    last_assistant_message: "final",
  });
  const observed = rows(".jsonl")
    .filter((r) => r.compactionProbe)
    .map((r) => r.compactionProbe.firstAssistantMessage.excerpt);
  results.push({
    probe: "two compactions in one turn before Stop",
    expected: [
      "First reply after compaction 1",
      "First reply after compaction 2",
    ],
    observed,
    met: observed.length === 2,
  });
});
await fixture(async ({ directory, key, hook, rows }) => {
  appendFileSync(
    join(directory, key + ".codex-messages.jsonl"),
    JSON.stringify({
      kind: "operator",
      class: "unclassified",
      recordedAt: "2026-01-01T00:00:00.000Z",
      text: "PRIOR DISPATCH SENTINEL",
    }) + "\n",
  );
  const text = "Keep Unicode intact: ☕ 🐈.\nSecond line\n";
  for (let n = 0; n < 2; n++) await hook("UserPromptSubmit", { prompt: text });
  await hook("PostCompact", { trigger: "auto" });
  const context = (await hook("SessionStart", { source: "compact" }))
    .hookSpecificOutput.additionalContext;
  assert.equal(context.includes("PRIOR DISPATCH SENTINEL"), false);
  assert.equal(context.split(text).length - 1, 2);
  assert.equal(
    rows(".codex-messages.jsonl")
      .slice(-2)
      .every((r) => r.text === text),
    true,
  );
  results.push({
    probe: "dispatch cutoff, repeated message, Unicode and linebreaks",
    met: true,
  });
});
await fixture(async ({ root, directory, key }) => {
  const at = "2026-01-03T00:00:00.000Z",
    digest = sha("direction");
  const document = "pass.md";
  const entry = {
    rule: "Keep the fixture rule visible",
    document: "README.md",
    section: "Rules",
    message: { sessionKey: key, recordedAt: at },
    captureDigest: digest,
  };
  const setRule = (changes = {}) =>
    writeFileSync(
      join(root, document),
      renderRulesRecordedBlock([{ ...entry, ...changes }]),
    );
  const setRow = (changes = {}) =>
    writeFileSync(
      join(directory, key + ".jsonl"),
      JSON.stringify({
        typedEvent: "OperatorMessageObserved",
        recordedAt: at,
        class: "direction",
        digest,
        attribution: "operator",
        ...changes,
      }) + "\n",
    );
  setRule();
  setRow();
  assert.equal(checkRulesRecorded(root, document).rules, 1);
  setRow({ class: "question" });
  setRule({ class: "direction" });
  assert.throws(() => checkRulesRecorded(root, document), /operator question/);
  setRow({ attribution: "host-task-notification" });
  setRule();
  assert.throws(
    () => checkRulesRecorded(root, document),
    /host's task notification/,
  );
  setRow();
  setRule({ captureDigest: sha("different") });
  assert.throws(() => checkRulesRecorded(root, document), /capture digest/);
  setRule({
    message: { sessionKey: key, recordedAt: "2026-01-04T00:00:00.000Z" },
  });
  assert.throws(
    () => checkRulesRecorded(root, document),
    /names no operator message/,
  );
  results.push({
    probe:
      "rules direction, contradicted class, notification, mismatched digest and missing row",
    met: true,
  });
});
console.log(JSON.stringify(results, null, 2));
if (results.some((r) => !r.met)) process.exitCode = 1;
