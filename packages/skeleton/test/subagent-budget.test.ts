import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  admitSubagentTool,
  initializeSubagentCounter,
  linkSubagentResult,
  subagentUsage,
  subagentSummary,
} from "../src/subagent-budget.js";

function fixture(t: TestContext, cap: number | null = 3) {
  const root = mkdtempSync(join(tmpdir(), "dotln-subagent-budget-"));
  const directory = join(root, "docs/control/local/harness");
  mkdirSync(join(root, "docs/control"), { recursive: true });
  const budgets = (value: unknown) =>
    writeFileSync(
      join(root, "docs/control/budgets.json"),
      JSON.stringify({ subagentCap: value }),
    );
  budgets(cap);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(initializeSubagentCounter(directory, "root"), null);
  const admit = (
    id: string,
    tool = "Agent",
    agent?: string,
    session = "root",
  ) =>
    admitSubagentTool(
      root,
      directory,
      {
        session_id: session,
        tool_use_id: id,
        tool_name: tool,
        ...(agent ? { agent_id: agent } : {}),
      },
      tool !== "Read",
    );
  return {
    root,
    directory,
    budgets,
    admit,
    usage: () => subagentUsage(root, directory, "root"),
  };
}

test("WO-139 third admission succeeds; fourth and exhausted Workflow refuse; duplicate hooks and sessions remain independent", (t) => {
  const f = fixture(t);
  for (const id of ["one", "two", "three"])
    assert.equal(f.admit(id).refusal, undefined);
  assert.equal(f.admit("three").refusal, undefined);
  assert.match(f.admit("four").refusal!, /count 3, cap 3.*subagentCap/);
  assert.match(f.admit("workflow", "Workflow").refusal!, /count 3, cap 3/);
  assert.equal(f.usage().count, 3);
  assert.equal(initializeSubagentCounter(f.directory, "root"), null);
  assert.equal(f.usage().count, 3);
  initializeSubagentCounter(f.directory, "other");
  assert.equal(f.admit("one", "Task", undefined, "other").usage.count, 1);
});

test("WO-139 workflow children count once at their first attributed call, including rejection retries", (t) => {
  const f = fixture(t);
  assert.equal(f.admit("workflow", "Workflow").usage.count, 0);
  for (const child of ["a", "b", "c"]) {
    assert.equal(f.admit(`${child}-1`, "Read", child).refusal, undefined);
    assert.equal(f.admit(`${child}-2`, "Read", child).refusal, undefined);
  }
  assert.equal(f.usage().count, 3);
  assert.ok(f.admit("d-1", "Read", "d").refusal);
  assert.ok(f.admit("d-2", "Read", "d").refusal);
  assert.equal(f.usage().count, 3);
});

test("WO-139 only observed result joins resolve direct/child overlap; mixed concurrency stays explicitly partial", (t) => {
  const f = fixture(t);
  f.admit("direct-1");
  f.admit("direct-2");
  f.admit("workflow", "Workflow");
  f.admit("w1-read", "Read", "w1");
  f.admit("w2-read", "Read", "w2");
  assert.equal(f.usage().count, 2);
  assert.equal(f.usage().countKind, "minimum-observed");
  assert.match(
    subagentSummary(f.usage()),
    /at least 2\/3.*uncounted remainder unknown/,
  );
  linkSubagentResult(f.directory, {
    session_id: "root",
    tool_use_id: "direct-1",
    tool_response: { agentId: "direct-child-1" },
  });
  assert.equal(f.usage().count, 3);
  linkSubagentResult(f.directory, {
    session_id: "root",
    tool_use_id: "direct-2",
    tool_response: { agentId: "direct-child-2" },
  });
  assert.equal(
    f.usage().count,
    4,
    "late exact joins expose actual excess rather than erase it",
  );
  assert.equal(f.usage().countKind, "exact-observed");
  assert.ok(f.admit("next").refusal);
});

test("WO-139 a direct child is not double charged before or after its exact result join", (t) => {
  const f = fixture(t, 1);
  f.admit("direct");
  assert.equal(f.admit("child-read", "Read", "child").usage.count, 1);
  linkSubagentResult(f.directory, {
    session_id: "root",
    tool_use_id: "direct",
    tool_response: { agentId: "child" },
  });
  assert.equal(f.usage().count, 1);
  assert.equal(f.usage().countKind, "exact-observed");
  assert.equal(f.admit("child-read-2", "Read", "child").refusal, undefined);
});

test("WO-139 new direct spawns cannot overlap previously observed workflow children", (t) => {
  const f = fixture(t);
  f.admit("a-read", "Read", "a");
  f.admit("b-read", "Read", "b");
  assert.equal(f.admit("new-direct").usage.count, 3);
  assert.equal(f.usage().countKind, "exact-observed");
  assert.ok(f.admit("over-cap").refusal);
});

test("WO-139 child observation persists when that child's first spawn request is refused", (t) => {
  const f = fixture(t, 1);
  assert.ok(f.admit("workflow", "Workflow", "child").refusal);
  assert.equal(f.usage().count, 1);
});

test("WO-139 null disables refusal but preserves counting; zero denies, absent key defaults to 20", (t) => {
  const f = fixture(t, 0);
  assert.ok(f.admit("one").refusal);
  assert.ok(f.admit("workflow", "Workflow").refusal);
  f.budgets(null);
  for (let i = 0; i < 22; i++)
    assert.equal(f.admit(`agent-${i}`).refusal, undefined);
  assert.equal(f.usage().count, 22);
  f.budgets(undefined);
  assert.equal(f.usage().cap, 20);
  assert.ok(f.admit("extra").refusal);
});

test("WO-139 missing, malformed, non-file, locked counters and invalid budgets admit with named causes", (t) => {
  const f = fixture(t);
  const file = join(
    f.directory,
    readdirSync(f.directory).find((name) => name.endsWith(".subagents.json"))!,
  );
  const initial = readFileSync(file);
  rmSync(file);
  assert.match(f.admit("missing").advisory!, /counter missing/);
  assert.equal(f.usage().count, null);
  assert.match(
    initializeSubagentCounter(f.directory, "root")!,
    /counter missing/,
    "re-entry never silently resets lost state",
  );
  writeFileSync(file, "{");
  assert.match(f.admit("malformed").advisory!, /counter unreadable/);
  rmSync(file);
  mkdirSync(file);
  assert.match(f.admit("directory").advisory!, /counter unreadable/);
  rmSync(file, { recursive: true });
  writeFileSync(file, initial);
  const lock = file.replace(/\.json$/, ".lock");
  mkdirSync(lock);
  assert.match(f.admit("busy").advisory!, /lock busy or abandoned/);
  rmSync(lock, { recursive: true });
  f.budgets(-1);
  assert.match(f.admit("invalid").advisory!, /invalid subagentCap/);
  writeFileSync(join(f.root, "docs/control/budgets.json"), "{");
  assert.match(f.admit("invalid-json").advisory!, /budgets unreadable/);
});

test("WO-139 concurrent independent admissions serialize at the remaining unit", async (t) => {
  const f = fixture(t, 1);
  const module = new URL("../src/subagent-budget.js", import.meta.url).href;
  const launch = (id: number) =>
    new Promise<string>((resolve, reject) => {
      const code = `import{admitSubagentTool}from ${JSON.stringify(module)};console.log(JSON.stringify(admitSubagentTool(process.argv[1],process.argv[2],{session_id:'root',tool_name:'Agent',tool_use_id:process.argv[3]},true)));`;
      const child = spawn(
        process.execPath,
        ["--input-type=module", "-e", code, f.root, f.directory, String(id)],
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      let output = "",
        error = "";
      child.stdout.on("data", (x) => (output += x));
      child.stderr.on("data", (x) => (error += x));
      child.on("error", reject);
      child.on("close", (status) =>
        status === 0 ? resolve(output) : reject(new Error(error)),
      );
    });
  const results = (
    await Promise.all(Array.from({ length: 8 }, (_, id) => launch(id)))
  ).map((x) => JSON.parse(x));
  assert.equal(results.filter((r) => !r.refusal).length, 1);
  assert.equal(f.usage().count, 1);
});
