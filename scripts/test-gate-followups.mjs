import {
  excludeFixtureOwnership,
  createFixtureRoot,
  removeTemporaryPath as rmSync,
} from "./lib/temporary-roots.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { syncBuiltinESMExports } from "node:module";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  gateCacheRows,
  activeGateRuns,
  gateCodeIdentity,
  gateTreeHash,
  requireGateChecks,
  findGateCheck,
  readGateChecks,
  recordGateChecks,
} from "./lib/gate-evidence.mjs";
import { gateCriticalPath } from "./lib/gate-timeline.mjs";
import { runGit } from "./lib/git.mjs";
import {
  recordedHostLaneCapacity,
  memoryBudgets,
} from "./lib/host-resources.mjs";
import { acquireHostLanes } from "./lib/host-lanes.mjs";
import { checkHost } from "./structural-checks.mjs";
import { suiteEnvironment } from "./lib/suite-evidence.mjs";
import { classifyDocumentFailures } from "./lib/document-failures.mjs";
import { budgetVerdict } from "./lib/process-budget.mjs";

const fixture = (t) => {
  const root = createFixtureRoot(join(tmpdir(), "dotln-gate-followups-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
};
const sourceRoot = resolve(import.meta.dirname, "..");

test("bounded role wording preserves prior savings and records reviewed startup additions", async () => {
  const { harnessInstallation, harnessInstructionBlock } =
    await import("./lib/harness.mjs");
  const baseline = JSON.parse(
    fs.readFileSync(
      join(
        sourceRoot,
        "packages/skeleton/fixtures/wo217-role-efficiency-baseline.json",
      ),
      "utf8",
    ),
  );
  const budgets = JSON.parse(
    fs.readFileSync(join(sourceRoot, "docs/control/budgets.json"), "utf8"),
  );
  // The role oracles minted since the preceding integrated oracle, newest
  // first: the integration that combined both branches' role text, then the
  // upstream oracles it took in. Each names the next as its historical
  // baseline and starts its startup bytes at the next one's measurement;
  // test-process-debt.mjs walks every recorded parent link of every oracle
  // and checks each recorded hash.
  const chain = [
    "wo239-integration-role-baseline.json",
    "wo235-removal-role-baseline.json",
    "wo235-quality-pass-role-baseline.json",
    "wo235-maintenance-role-baseline.json",
    "wo235-usefulness-role-baseline.json",
    "wo235-private-reply-role-baseline.json",
    "wo235-repair-role-baseline.json",
    "wo235-role-baseline.json",
  ].map((name) => ({
    name,
    ...JSON.parse(
      fs.readFileSync(
        join(sourceRoot, "packages/skeleton/fixtures", name),
        "utf8",
      ),
    ),
  }));
  const links = chain.slice(1).map((earlier, index) => [chain[index], earlier]);
  for (const [later, earlier] of links)
    assert.equal(later.historicalBaseline, earlier.name, later.name);
  const oracle = chain.at(-1);
  assert.equal(
    oracle.historicalBaseline,
    "wo234-integration-role-baseline.json",
  );
  const historicalBytes = fs.readFileSync(
    join(sourceRoot, "packages/skeleton/fixtures", oracle.historicalBaseline),
  );
  assert.equal(
    createHash("sha256").update(historicalBytes).digest("hex"),
    oracle.historicalSha256,
    "the preceding role oracle remains byte-exact",
  );
  const historicalOracle = JSON.parse(historicalBytes);
  assert.equal(oracle.upstreamBaseline, historicalOracle.upstreamBaseline);
  assert.equal(oracle.upstreamSha256, historicalOracle.upstreamSha256);
  const precedingBytes = fs.readFileSync(
    join(
      sourceRoot,
      "packages/skeleton/fixtures",
      historicalOracle.historicalBaseline,
    ),
  );
  assert.equal(
    createHash("sha256").update(precedingBytes).digest("hex"),
    historicalOracle.historicalSha256,
  );
  const historical = JSON.parse(
    fs.readFileSync(
      join(sourceRoot, "packages/skeleton/fixtures/wo226-role-baseline.json"),
      "utf8",
    ),
  ).startupCost;
  const priorCost = historicalOracle.startupCost;
  const reviewed = oracle.startupCost;
  for (const cost of [
    historical,
    priorCost,
    ...chain.map((link) => link.startupCost),
  ]) {
    assert.match(cost.decision, /^WO-\d{3}-D\d{3}$/u);
  }
  // Historical overruns keep their dispositions; current accepted growth
  // needs its own measured record, without inventing another deferred item.
  for (const cost of [historical, priorCost]) {
    if (cost.followup !== undefined) {
      assert.match(cost.followup, /^FUP-[a-f0-9]{16}$/u);
      continue;
    }
    // An accepted addition has no deferred work; its recorded effective
    // ceiling must be supported by the actual budget acceptance instead.
    for (const [role, profile] of Object.entries(cost.profiles)) {
      const nominal = profile.nominalCeiling ?? profile.ceiling;
      if (nominal === null || profile.bytes <= nominal) continue;
      assert.ok(
        budgets.acceptances.some(
          (entry) =>
            entry.metric === `coldStartBytes.${role}` &&
            !entry.scope &&
            entry.ceiling === profile.ceiling,
        ),
        `${role}: prior accepted growth keeps its recorded disposition`,
      );
    }
  }
  const files = new Map(
    harnessInstallation().files.map((file) => [file.path, file.contents]),
  );
  const floor = fs.readFileSync(join(sourceRoot, "CLAUDE.md"), "utf8");
  const instruction = floor.replace(
    harnessInstructionBlock(floor).trimEnd(),
    files.get("CLAUDE.md").trimEnd(),
  );
  const profiles = [...files].filter(([file]) => file.endsWith("/SKILL.md"));
  assert.equal(profiles.length, baseline.profiles.length);
  for (const [file, contents] of profiles) {
    const previous = baseline.profiles.find((profile) => profile.path === file);
    assert.ok(previous, `missing baseline: ${file}`);
    const bytes = Buffer.byteLength(instruction) + Buffer.byteLength(contents);
    const role = file.split("/")[2].slice("dotln-".length);
    const measured = reviewed.profiles[role];
    const current = chain[0].startupCost.profiles[role];
    const prior = priorCost.profiles[role];
    const original = historical.profiles[role];
    assert.equal(bytes, current.bytes, `${file}: reviewed startup bytes`);
    for (const [later, earlier] of links)
      assert.equal(
        later.startupCost.profiles[role].beforeBytes,
        earlier.startupCost.profiles[role].bytes,
        `${file}: ${later.name} starts at the preserved ${earlier.name} measurement`,
      );
    assert.equal(
      bytes - current.beforeBytes,
      current.growthBytes,
      `${file}: the newest oracle records its measured change`,
    );
    assert.equal(
      measured.beforeBytes,
      prior.bytes,
      `${file}: this order's first oracle starts at the preceding reviewed bytes`,
    );
    assert.equal(
      measured.bytes - measured.beforeBytes,
      measured.growthBytes,
      `${file}: only the separately reviewed role additions`,
    );
    assert.equal(
      original.bytes - original.beforeBytes,
      historical.sharedRuleGrowthBytes,
      `${file}: the preceding shared-rule addition remains recorded`,
    );
    const predecessor = JSON.parse(precedingBytes).startupCost.profiles[role];
    assert.equal(
      prior.beforeBytes,
      predecessor.bytes,
      `${file}: preceding role cost remains linked`,
    );
    assert.equal(
      prior.bytes - prior.beforeBytes,
      prior.growthBytes,
      `${file}: the previous role growth remains recorded`,
    );
    assert.equal(
      measured.ceiling === null ? null : measured.ceiling - measured.bytes,
      measured.headroomBytes,
      `${file}: historical headroom uses the recorded bytes and effective ceiling`,
    );
    assert.equal(
      measured.nominalCeiling,
      prior.nominalCeiling ?? prior.ceiling,
      `${role}: reviewed additions preserve the preceding nominal ceiling`,
    );
    assert.equal(
      budgets.limits.coldStartBytes[role],
      measured.nominalCeiling,
      `${role}: the operating-cost ceiling stays unchanged`,
    );
    const metric = `coldStartBytes.${role}`;
    assert.notEqual(
      budgetVerdict(budgets, metric, bytes, measured.nominalCeiling),
      "breach",
      `${role}: current bytes fit the configured or accepted ceiling`,
    );
    if (measured.ceiling !== measured.nominalCeiling)
      assert.ok(
        budgets.acceptances.some(
          (entry) =>
            entry.metric === metric &&
            !entry.scope &&
            entry.ceiling === measured.ceiling,
        ),
        `${role}: an explicit global acceptance supplies the recorded ceiling`,
      );
    assert.ok(
      measured.ceiling === null || measured.bytes <= measured.ceiling,
      `${file}: historical bytes fit their recorded ceiling`,
    );
    // Keep historical savings distinct from later duties. Current bytes are
    // checked above against the configured ceiling and its acceptances.
    assert.ok(
      original.beforeBytes <= previous.bytes,
      `${file}: ${original.beforeBytes} exceeds before ${previous.bytes}`,
    );
    if (role === "executor" || role === "reviewer")
      assert.ok(
        original.ceiling - original.beforeBytes >= 256,
        `${role}: the prior wording savings retain 256 bytes of working headroom`,
      );
  }
});

test("a legacy gate marker cannot be revived by a process born after it", (t) => {
  const root = fixture(t);
  const directory = join(root, "docs/control/local/harness/active-gates");
  fs.mkdirSync(directory, { recursive: true });
  const runId = "00000000-0000-4000-8000-000000000000";
  const file = join(directory, `${runId}.json`);
  const marker = {
    contract: "gate-run-v1",
    runId,
    command: "npm test",
    pid: process.pid,
    startedAt: "2000-01-01T00:00:00.000Z",
    processStartedAt: null,
  };
  fs.writeFileSync(file, JSON.stringify(marker));
  assert.deepEqual(activeGateRuns(root), []);
  fs.writeFileSync(
    file,
    JSON.stringify({ ...marker, startedAt: new Date().toISOString() }),
  );
  assert.equal(
    activeGateRuns(root).length,
    1,
    "an existing process may own a recent marker without a recorded birth",
  );
  assert.equal(
    fs.existsSync(file),
    true,
    "a read never deletes another run's marker",
  );
});

test("fixture suites do not inherit the invoking target launchpad", () => {
  const env = suiteEnvironment({
    PATH: "fixture-bin",
    DOTLN_LAUNCHPAD: "/invoking/launchpad",
    DOTLN_HOST_LANE_LEASE: "fixture-lease",
  });
  assert.equal(env.DOTLN_LAUNCHPAD, undefined);
  assert.equal(env.DOTLN_HOST_LANE_LEASE, "fixture-lease");
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      "process.stdout.write(process.env.DOTLN_LAUNCHPAD ?? 'fixture-local')",
    ],
    { env, encoding: "utf8" },
  );
  assert.equal(result.stdout, "fixture-local");
});

test("protected intake repositories stay outside the gate candidate while ordinary untracked source remains judged", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  excludeFixtureOwnership(root);
  fs.copyFileSync(join(sourceRoot, ".gitignore"), join(root, ".gitignore"));
  fs.writeFileSync(join(root, "source.mjs"), "export const fixture = true;\n");
  runGit(root, ["add", "."]);
  const before = gateTreeHash(root);
  const intake = join(root, "docs/intake/nested");
  fs.mkdirSync(intake, { recursive: true });
  runGit(intake, ["init", "-q"]);
  excludeFixtureOwnership(intake);
  fs.writeFileSync(join(intake, "private-fixture.txt"), "synthetic intake\n");
  runGit(intake, ["add", "."]);
  runGit(intake, [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Private fixture",
  ]);
  assert.match(
    runGit(root, ["ls-files", "--others", "--exclude-standard"]),
    /docs\/intake\/nested\//,
  );
  assert.equal(gateTreeHash(root), before);
  fs.writeFileSync(
    join(root, "untracked.mjs"),
    "export const trackedByGate = true;\n",
  );
  assert.notEqual(gateTreeHash(root), before);
  const { runGate } = await import("./test-runner.mjs");
  const result = await runGate(["--serial", "--again"], root, {
    table: [
      {
        name: "build",
        build: true,
        outputs: [],
        command: [process.execPath, "-e", ""],
      },
    ],
  });
  assert.equal(result.exitCode, 0);
  assert.equal(requireGateChecks(root, ["npm test"]), gateTreeHash(root));
  assert.equal(
    fs.readFileSync(join(intake, "private-fixture.txt"), "utf8"),
    "synthetic intake\n",
  );
});

test("reviewer packets carry an ordinary-authority safe default", async () => {
  const { contributorProgram } =
    await import("../packages/skeleton/dist/src/loadouts/contributor.js");
  const reviewer = contributorProgram().roles.find(
    (role) => role.name === "reviewer",
  );
  assert.ok(
    reviewer.procedure.some(
      (line) =>
        line.includes("Every option in an operator packet") &&
        line.includes("without operator override") &&
        line.includes("safe default"),
    ),
  );
});

test("planner judgment reuse never authorizes edits to judged text", async () => {
  const { contributorProgram } =
    await import("../packages/skeleton/dist/src/loadouts/contributor.js");
  const planner = contributorProgram().roles.find(
    (role) => role.name === "planner",
  );
  const rule = planner.procedure.find((line) =>
    line.includes("load dotln-refuter"),
  );
  assert.match(
    rule,
    /Before editing judged text, resolve its refutation hold or record the operator-authorized amendment/,
  );
  assert.match(rule, /judgment reuse never authorizes a repair/);
});

test("sync selection includes release preparation and current role oracle inputs", async () => {
  const { machinerySources } = await import("./test-runner.mjs");
  for (const file of [
    "scripts/release.mjs",
    "scripts/lib/release-preparation.mjs",
    "scripts/check-role-oracle.mjs",
    "scripts/test-process-debt.mjs",
  ])
    assert.ok(machinerySources["sync-fixtures"].includes(file), file);
});

test("every role oracle is a declared input of the suite that walks it", async () => {
  const { machinerySources } = await import("./test-runner.mjs");
  // The role-oracle walk lists the fixtures directory, so a newly minted
  // oracle must also select the suite that judges it.
  const fixtures = "packages/skeleton/fixtures";
  const declared = new Set(machinerySources["process-debt"]);
  assert.deepEqual(
    fs
      .readdirSync(join(sourceRoot, fixtures))
      .filter((name) => name.endsWith("-role-baseline.json"))
      .filter((name) => !declared.has(`${fixtures}/${name}`)),
    [],
  );
});

test("document failure classification does not build for skipped or infrastructure-failed tasks", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q", "-b", "main"]);
  excludeFixtureOwnership(root);
  fs.writeFileSync(join(root, "source.txt"), "fixture\n");
  runGit(root, ["add", "."]);
  runGit(root, [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Fixture",
  ]);
  const tasks = [
    { name: "build", build: true, command: [process.execPath, "-e", ""] },
    {
      name: "skipped",
      needsBuild: true,
      command: [process.execPath, "-e", ""],
    },
    { name: "infra", needsBuild: true, command: [process.execPath, "-e", ""] },
  ];
  const calls = [];
  const rows = await classifyDocumentFailures(
    root,
    tasks,
    [
      { name: "skipped", exitCode: 1, executed: false },
      { name: "infra", exitCode: 1, executed: true, failureKind: "launch" },
    ],
    {
      execute: async (task) => {
        calls.push(task.name);
        return { executed: true, exitCode: 0 };
      },
    },
  );
  assert.deepEqual(calls, []);
  assert.equal(rows.length, 2);
  assert.ok(rows.every((row) => row.classification === "unknown"));
});

test("a newly stopped evidence invocation does not cite a historical stopped row", (t) => {
  const repo = fixture(t);
  runGit(repo, ["init", "-q"]);
  excludeFixtureOwnership(repo);
  fs.writeFileSync(join(repo, ".gitignore"), "docs/control/local/\n");
  runGit(repo, ["add", "."]);
  childProbe(
    t,
    `
import assert from 'node:assert/strict';
import {runHarnessEvidence} from ${JSON.stringify(pathToFileURL(join(sourceRoot, "packages/skeleton/dist/src/harness-host.js")).href)};
import {recordGateChecks,gateTreeHash,gateCodeIdentity} from ${JSON.stringify(pathToFileURL(join(sourceRoot, "scripts/lib/gate-evidence.mjs")).href)};
const root=${JSON.stringify(repo)};
recordGateChecks(root,[{checkId:'npm test',treeHash:gateTreeHash(root),codeIdentity:gateCodeIdentity(root),subject:'fixture',durationMs:1,exitCode:1,executed:true,stopped:true,evidenceRef:'historical-stop-must-not-be-cited',recordedAt:'2000-01-01T00:00:00.000Z'}]);
assert.throws(()=>runHarnessEvidence(root),error=>/no check recorded/.test(error.message)&&!error.message.includes('historical-stop-must-not-be-cited'));
`,
    `
import children from 'node:child_process';
import fs from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
const real=children.spawnSync;
children.spawnSync=function(command,args,options){
 if(command!=='npm') return real.call(this,command,args,options);
 const directory=${JSON.stringify(join(repo, "docs/control/local/harness/active-gates"))};
 const name=fs.readdirSync(directory).find(name=>name.endsWith('.json'));
 const run=JSON.parse(fs.readFileSync(directory+'/'+name,'utf8'));
 fs.writeFileSync(directory+'/'+run.runId+'.stop',JSON.stringify({contract:'gate-stop-v1',runId:run.runId,requestedAt:new Date().toISOString()}));
 return {status:1,stdout:'',stderr:''};
};
syncBuiltinESMExports();
`,
  );
});

function childProbe(t, source, hook = "", timeout = 30000) {
  const root = fixture(t);
  const script = join(root, "probe.mjs");
  const loader = join(root, "loader.mjs");
  fs.writeFileSync(script, source);
  fs.writeFileSync(loader, hook);
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ["--import", loader, script], {
    cwd: sourceRoot,
    env,
    encoding: "utf8",
    timeout,
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result;
}

test("empty nested format output names the task timeline", (t) => {
  const temporary = fixture(t);
  const loader = join(temporary, "empty-format-output.mjs");
  const moduleSource = `
export async function load(url,context,nextLoad) {
 const result=await nextLoad(url,context);
 if(!url.endsWith('/scripts/test-runner.test.mjs')) return result;
 const source=String(result.source);
 const anchor='const value = check.cases.find((item) => item.name === row.name)?.output;';
 if(!source.includes(anchor)) throw new Error('empty-output fixture anchor missing');
 return {...result,source:source.replace(anchor,'const value = "";')};
}`;
  fs.writeFileSync(
    loader,
    `import {register} from 'node:module'; register(${JSON.stringify("data:text/javascript," + encodeURIComponent(moduleSource))});\n`,
  );
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      loader,
      "--test",
      "--test-name-pattern=^format preflight stops plain",
      join(sourceRoot, "scripts/test-runner.test.mjs"),
    ],
    { cwd: sourceRoot, env, encoding: "utf8", timeout: 60000 },
  );
  assert.notEqual(result.status, 0);
  assert.match(
    result.stdout + result.stderr,
    /Nested gate has no output for format:/,
  );
  assert.match(result.stdout + result.stderr, /"name":"format"/);
  assert.match(result.stdout + result.stderr, /"executed":true/);
});

test("fixture commits suppress automatic maintenance even with planted loose objects", (t) => {
  const temporary = fixture(t);
  const hook = join(temporary, "git-observer.mjs");
  const trace = join(temporary, "git-trace.jsonl");
  fs.writeFileSync(
    hook,
    `
import children from 'node:child_process';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
const real = children.spawnSync;
const trace=${JSON.stringify(trace)};
let commits=0;
function instrument(command,args,options={}) {
 if(command!=='git' || !args.includes('commit')) return null;
 const at=args.indexOf('-C');
 const cwd=at<0 ? options.cwd : args[at+1];
 if(!cwd) throw new Error('fixture commit has no repository');
 const git=(a,input)=>real('git',['-C',cwd,...a],{encoding:'utf8',input});
 git(['config','gc.auto','1']);
 git(['config','gc.autoDetach','false']);
 let planted=0;
 for(let index=0;planted<2;index++) {
  const bytes='maintenance fixture '+index+'\\n';
  const hash=createHash('sha1').update('blob '+Buffer.byteLength(bytes)+'\\0'+bytes).digest('hex');
  if(!hash.startsWith('17')) continue;
  const wrote=git(['hash-object','-w','--stdin'],bytes);
  if(wrote.status!==0) throw new Error(wrote.stderr);
  planted++;
 }
 fs.writeFileSync(trace,'');
 const result=real(command,args,{...options,env:{...process.env,...options.env,GIT_TRACE2_EVENT:trace}});
 commits++;
 const events=fs.readFileSync(trace,'utf8').trim().split('\\n').filter(Boolean).map(JSON.parse);
 if(events.some(row=>row.event==='child_start' && row.argv?.includes('maintenance')))
  throw new Error('fixture launched automatic maintenance after planting objects/17');
 return result;
}
children.spawnSync=function(command,args,options) {return instrument(command,args,options) ?? real(command,args,options);};
const exec=children.execFileSync;
children.execFileSync=function(command,args,options) {
 const result=instrument(command,args,options);
 if(!result) return exec(command,args,options);
 if(result.status!==0) throw new Error(String(result.stderr));
 return result.stdout;
};
syncBuiltinESMExports();
process.on('exit',()=>{if(!commits){console.error('fixture commit observation missing');process.exitCode=1;}});
`,
  );
  const env = { ...process.env, TMPDIR: temporary };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      hook,
      "--test",
      "--test-isolation=none",
      "--test-name-pattern=a live guard restores",
      join(sourceRoot, "scripts/test-host-guard.test.mjs"),
    ],
    { cwd: sourceRoot, env, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("a signal after the in-memory resource stop retains the typed gate row without an incident file", (t) => {
  const repo = fixture(t);
  runGit(repo, ["init", "-q"]);
  excludeFixtureOwnership(repo);
  fs.writeFileSync(join(repo, ".gitignore"), "docs/control/local/\nhost/\n");
  runGit(repo, ["add", "."]);
  childProbe(
    t,
    `
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stopHostGuardIfIdle } from ${JSON.stringify(pathToFileURL(join(sourceRoot, "scripts/lib/host-guard-state.mjs")).href)};
import { readGateChecks } from ${JSON.stringify(pathToFileURL(join(sourceRoot, "scripts/lib/gate-evidence.mjs")).href)};
import { runGate } from ${JSON.stringify(pathToFileURL(join(sourceRoot, "scripts/test-runner.mjs")).href)};
const repo=${JSON.stringify(repo)};
let result;
try { result = await runGate(['--serial','--again'], repo, {hostDirectory: repo+'/host', table:[
 {name:'build', build:true, product:true, command:[process.execPath,'-e','']},
 {name:'wait', product:true, command:[process.execPath,'-e','setTimeout(()=>{}, 5000)']},
]}); } finally {
 await stopHostGuardIfIdle(repo+'/host');
 for(let count=0;count<100 && fs.existsSync(repo+'/host/guard.json');count++) await new Promise(resolve=>setTimeout(resolve,20));
 assert.equal(fs.existsSync(repo+'/host/guard.json'),false,'private fixture guard stopped');
}
assert.equal(result.exitCode,1);
const rows=readGateChecks(repo);
assert.ok(rows.some(row=>row.memory?.failure?.failureKind==='memory-budget'), JSON.stringify(rows));
assert.equal(rows.some(row=>row.stopped),false);
`,
    `
import { registerHooks } from 'node:module';
registerHooks({load(url, context, nextLoad) {
 const result=nextLoad(url, context);
 if (!url.endsWith('/scripts/lib/process-monitor.mjs')) return result;
 const source=String(result.source).replace('  const tasks = new Map(),', \`  if (gatePid) setTimeout(() => { onGateFailure({failureKind:'memory-budget',scope:'gate',pid:gatePid}); process.emit('SIGTERM'); }, 300);\n  const tasks = new Map(),\`);
 return {...result,source};
}});
`,
  );
});

test("registration withdrawal reports its own failure kind", (t) => {
  const directory = fixture(t);
  childProbe(
    t,
    `
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { executeSuite } from ${JSON.stringify(pathToFileURL(join(sourceRoot, "scripts/test-runner.mjs")).href)};
const directory=${JSON.stringify(directory)};
const remove=fs.rmSync;
fs.rmSync=function(file, ...args) {
 if(String(file).startsWith(directory+'/trees/') && String(file).endsWith('.json')) throw new Error('planted withdrawal failure');
 return remove.call(this,file,...args);
};
syncBuiltinESMExports();
try {
 const result=await executeSuite({name:'withdrawal',hostDirectory:directory, command:[process.execPath,'-e','']}, process.cwd());
 assert.equal(result.exitCode,1);
 assert.equal(result.failureKind,'registration-cleanup',JSON.stringify(result));
} finally {fs.rmSync=remove; syncBuiltinESMExports();}
`,
  );
});

test("TAP-quoted case reports retain durations and live progress", async (t) => {
  const root = fixture(t);
  const { executeSuite } = await import("./test-runner.mjs");
  const progress = [];
  const report = {
    event: "end",
    name: "quoted case",
    durationMs: 42,
    exitCode: 0,
  };
  const result = await executeSuite(
    {
      name: "tap-quoted",
      command: [
        process.execPath,
        "-e",
        `console.log('# PROGRESS quoted work'); console.log('# PROGRESS CASE '+${JSON.stringify(JSON.stringify(report))});`,
      ],
    },
    root,
    900_000,
    (entry) => progress.push(entry.message),
  );
  assert.equal(result.exitCode, 0, result.output);
  assert.equal(result.slowestCases[0]?.name, "quoted case");
  assert.equal(result.slowestCases[0]?.durationMs, 42);
  assert.ok(progress.some((line) => line === "PROGRESS quoted work"));
});

test("corpus entry points recognize symlink invocation", async (t) => {
  const root = fixture(t);
  const alias = join(root, "mutate.mjs");
  fs.symlinkSync(join(sourceRoot, "corpus/mutation/mutate.mjs"), alias);
  const direct = spawnSync(
    process.execPath,
    [alias, "--invalid-fixture-option"],
    {
      cwd: sourceRoot,
      encoding: "utf8",
    },
  );
  assert.notEqual(
    direct.status,
    0,
    "the main entry must process the invalid option",
  );
  assert.match(direct.stderr, /usage:|unknown|invalid/i);
  const generator = join(root, "generator.mjs");
  fs.symlinkSync(
    join(sourceRoot, "corpus/harness/generator-runtime.mjs"),
    generator,
  );
  const probe = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import { isMain } from ${JSON.stringify(pathToFileURL(generator).href)};
    process.argv[1] = ${JSON.stringify(generator)};
    if (!isMain(${JSON.stringify(pathToFileURL(join(sourceRoot, "corpus/harness/generator-runtime.mjs")).href)})) process.exit(1);
  `,
    ],
    { cwd: sourceRoot, encoding: "utf8" },
  );
  assert.equal(probe.status, 0, probe.stderr);
});

test("console transport retains nested diagnostic codes without private error material", async () => {
  const { invokeConsoleCommand } =
    await import("../packages/console/dist/src/console-client.js");
  const previous = globalThis.fetch;
  const secret = "private-request-material";
  globalThis.fetch = async () => {
    const inner = Object.assign(new Error(secret), { code: "ECONNREFUSED" });
    throw new TypeError(secret, { cause: new AggregateError([inner], secret) });
  };
  try {
    await assert.rejects(
      invokeConsoleCommand(
        { version: 1, host: "127.0.0.1", port: 1, token: "a".repeat(64) },
        { command: "resume.status", args: [secret] },
      ),
      (error) => {
        assert.match(
          error.message,
          /resume\.status.*TypeError.*AggregateError.*ECONNREFUSED/,
        );
        assert.equal(String(error.stack).includes(secret), false);
        assert.equal(error.cause, undefined);
        return true;
      },
    );
  } finally {
    globalThis.fetch = previous;
  }
});

test("collector ignore assertions reject a later negation in both declaration cases", (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q"]);
  excludeFixtureOwnership(root);
  const original = fs.readFileSync(join(sourceRoot, ".prettierignore"), "utf8");
  const inputs = original
    .split("\n")
    .filter((line) => line.startsWith("corpus/harness/"));
  fs.mkdirSync(join(root, "corpus/harness"), { recursive: true });
  for (const file of inputs)
    fs.copyFileSync(join(sourceRoot, file), join(root, file));
  fs.copyFileSync(
    join(sourceRoot, ".gitattributes"),
    join(root, ".gitattributes"),
  );
  runGit(root, ["add", "."]);
  for (const [file, name] of [
    ["scripts/test-comment-labels.mjs", "WO-200 every path"],
    [
      "corpus/harness/wo107-schema.test.mjs",
      "corpus the hashed collector files",
    ],
  ]) {
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const run = () =>
      spawnSync(
        process.execPath,
        ["--test", `--test-name-pattern=${name}`, join(sourceRoot, file)],
        { cwd: root, encoding: "utf8", env },
      );
    fs.writeFileSync(join(root, ".prettierignore"), original);
    const good = run();
    assert.equal(good.status, 0, good.stdout + good.stderr);
    fs.writeFileSync(
      join(root, ".prettierignore"),
      `${original}\n!${inputs[0]}\n`,
    );
    const bad = run();
    assert.notEqual(
      bad.status,
      0,
      `${file} must detect effective inclusion: ${bad.stdout} ${bad.stderr}`,
    );
    assert.match(bad.stdout + bad.stderr, /Formatter must effectively ignore/);
  }
});
const at = (second) =>
  new Date(Date.UTC(2026, 0, 1, 0, 0, second)).toISOString();
const task = (name, second, exitCode = 0) => ({
  name,
  exitCode,
  executed: true,
  durationMs: 100,
  finishedAt: at(second),
});
const row = (second, tasks = [], exitCode = 0) => ({
  checkId: "npm test",
  treeHash: "a".repeat(40),
  codeIdentity: "b".repeat(64),
  subject: "fixture",
  executed: true,
  exitCode,
  durationMs: 100,
  recordedAt: at(second),
  evidenceRef: `fixture-${second}`,
  identityUnchanged: true,
  requiredSuites: tasks.map((entry) => entry.name),
  taskTimeline: tasks,
});

test("gate lookup rejects displaced tasks and accepts a later repair", async (t) => {
  const root = fixture(t);
  runGit(root, ["init", "-q"]);
  excludeFixtureOwnership(root);
  fs.writeFileSync(join(root, "source.js"), "export const value = 1;\n");
  runGit(root, ["add", "source.js"]);
  runGit(root, [
    "-c",
    "user.name=Fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "-c",
    "commit.gpgsign=false",
    "-c",
    "maintenance.auto=false",
    "commit",
    "-qm",
    "Fixture",
  ]);
  const codeIdentity = gateCodeIdentity(root);
  const directory = join(root, "docs/control/local/harness");
  fs.mkdirSync(directory, { recursive: true });
  const { coveringGateCheck } = await import("./lib/gate-reuse.mjs");
  const stands = async (rows) => {
    fs.writeFileSync(
      join(directory, "checks.json"),
      JSON.stringify(rows.map((entry) => ({ ...entry, codeIdentity }))),
    );
    const lookup = Boolean(findGateCheck(root, "npm test", "a".repeat(40)));
    const completion = Boolean(
      (await coveringGateCheck(root, "npm test", [], codeIdentity)).row,
    );
    assert.equal(completion, lookup, "completion and direct lookup must agree");
    return lookup;
  };
  const first = row(1, [task("one", 1), task("two", 1)]);
  assert.equal(await stands([first]), true);
  for (const malformed of [
    { exitCode: 1 },
    { durationMs: -1 },
    { durationMs: undefined },
    { finishedAt: "invalid" },
    { finishedAt: at(2) },
  ])
    assert.equal(
      await stands([row(1, [{ ...task("one", 1), ...malformed }])]),
      false,
      JSON.stringify(malformed),
    );
  for (const malformed of [
    { ...first, taskTimeline: [task("one", 1)] },
    { ...first, taskTimeline: [] },
    {
      ...first,
      taskTimeline: [task("one", 1), task("one", 1), task("two", 1)],
    },
    { ...first, recordedAt: "invalid" },
    { ...first, buildOutputAttested: false },
  ])
    assert.equal(await stands([malformed]), false, JSON.stringify(malformed));
  assert.equal(
    await stands([
      {
        ...first,
        requiredSuites: ["one"],
        taskTimeline: [task("one:part", 1)],
      },
    ]),
    true,
  );
  assert.equal(
    await stands([{ ...first, requiredSuites: undefined }]),
    true,
    "legacy rows cover only empty named requirements",
  );
  const failed = row(2, [task("one", 2, 1)], 1);
  assert.equal(await stands([first, failed]), false);
  const repaired = row(3, [task("one", 3)]);
  assert.equal(await stands([first, failed, repaired]), true);
  assert.equal(
    await stands([first, { ...failed, checkId: "npm run test:docs" }]),
    true,
  );
  assert.equal(await stands([first, { ...failed, partial: true }]), false);
  assert.equal(
    await stands([first, failed, { ...repaired, partial: true }]),
    false,
  );
  assert.equal(await stands([first, { ...failed, checkId: "focused" }]), false);
  assert.equal(
    await stands([
      first,
      { ...failed, taskTimeline: [task("unrelated", 2, 1)] },
    ]),
    true,
  );
});

test("copied gate evidence drops passing output at every diagnostic depth", (t) => {
  const root = fixture(t);
  const passing = {
    ...task("pass", 1),
    output: "private transient output",
    outputRef: "old-pass.log",
  };
  const failing = { ...task("fail", 1, 1), output: "retained failure" };
  recordGateChecks(root, [
    {
      ...row(1),
      output: "passing gate output",
      taskTimeline: [
        {
          ...passing,
          cases: [{ ...passing, taskTimeline: [passing, failing] }],
        },
      ],
    },
  ]);
  const [saved] = readGateChecks(root);
  assert.equal(
    JSON.stringify(saved).includes("private transient output"),
    false,
  );
  assert.equal(JSON.stringify(saved).includes("old-pass.log"), false);
  const failure = saved.taskTimeline[0].cases[0].taskTimeline[1];
  assert.equal(
    fs.readFileSync(join(root, failure.outputRef), "utf8"),
    "retained failure",
  );
});

test("copied failed evidence retains its addressed diagnostic log", (t) => {
  const source = fixture(t),
    destination = fixture(t);
  recordGateChecks(source, [
    {
      ...row(1, [task("failed", 1, 1)], 1),
      output: "retained failure diagnostic\n",
    },
  ]);
  const original = readGateChecks(source);
  recordGateChecks(destination, original, { sourceRoot: source });
  const copied = readGateChecks(destination)[0];
  assert.equal(copied.outputRef, original[0].outputRef);
  assert.equal(
    fs.readFileSync(join(destination, copied.outputRef), "utf8"),
    "retained failure diagnostic\n",
  );
});

test("gate reader retains rows evicted while it discovers archives", (t) => {
  const root = fixture(t);
  const original = row(0);
  recordGateChecks(root, [original]);
  fs.mkdirSync(join(root, "docs/control/local/harness/check-history"), {
    recursive: true,
  });
  const readdir = fs.readdirSync;
  let rotated = false;
  fs.readdirSync = function (directory, ...args) {
    const result = readdir.call(this, directory, ...args);
    if (!rotated && String(directory).endsWith("check-history")) {
      rotated = true;
      recordGateChecks(
        root,
        Array.from({ length: gateCacheRows }, (_, index) => row(index + 1)),
      );
    }
    return result;
  };
  syncBuiltinESMExports();
  try {
    const observed = readGateChecks(root);
    assert.equal(rotated, true);
    assert.ok(
      observed.some((entry) => entry.evidenceRef === original.evidenceRef),
    );
  } finally {
    fs.readdirSync = readdir;
    syncBuiltinESMExports();
  }
});

test("critical path separates host-lane waiting from task work", async (t) => {
  const result = gateCriticalPath([
    { name: "first", startedAt: at(0), finishedAt: at(10), durationMs: 2000 },
    {
      name: "second",
      startedAt: at(11),
      finishedAt: at(14),
      durationMs: 1000,
      predecessors: ["first"],
    },
  ]);
  assert.deepEqual(result, {
    tasks: ["first", "second"],
    durationMs: 14000,
    workMs: 3000,
    waitMs: 11000,
    laneWaitMs: 0,
    gapMs: 11000,
  });
  const directory = fixture(t);
  const { acquireHostLaneCapacity, acquireHostLanes } =
    await import("./lib/host-lanes.mjs");
  const { scheduleSuites } = await import("./test-runner.mjs");
  await acquireHostLaneCapacity({ directory, capacity: 1 });
  const held = await acquireHostLanes({
    directory,
    capacity: 1,
    slots: 1,
    worktree: sourceRoot,
    task: "held-fixture",
  });
  const release = setTimeout(() => held.release(), 150);
  let tasks;
  try {
    tasks = await scheduleSuites(
      [
        {
          name: "format",
          structural: true,
          preflight: true,
          command: [process.execPath, "-e", ""],
        },
        { name: "build", build: true, command: [process.execPath, "-e", ""] },
      ],
      {
        repo: sourceRoot,
        concurrency: 1,
        hostLanes: { directory, capacity: 1 },
        execute: async (task) => {
          const started = Date.now();
          await new Promise((resolve) => setTimeout(resolve, 5));
          return {
            name: task.name,
            executed: true,
            exitCode: 0,
            durationMs: Date.now() - started,
          };
        },
      },
    );
  } finally {
    clearTimeout(release);
    await held.release();
  }
  assert.ok(tasks[0].hostLaneWaitMs >= 100);
  const observed = gateCriticalPath(tasks);
  assert.ok(observed.waitMs >= 100, JSON.stringify(observed));
  assert.ok(
    observed.workMs < observed.durationMs - 100,
    JSON.stringify(observed),
  );
});

test("invalid host capacity records name the record and repair", async (t) => {
  const root = fixture(t);
  for (const [bytes, problem] of [
    ["{", /malformed JSON/],
    ['{"capacity":9}', /one through eight/],
  ]) {
    fs.writeFileSync(join(root, "lane-capacity.json"), bytes);
    const diagnostic = (error) => {
      assert.match(
        error.message,
        /Host lane capacity record \(lane-capacity\.json\)/,
      );
      assert.match(error.message, problem);
      assert.match(
        error.message,
        /stop all host lane holders, repair the record/,
      );
      assert.equal(error.message.includes(root), false);
      return true;
    };
    assert.throws(() => recordedHostLaneCapacity(root), diagnostic);
    await assert.rejects(
      acquireHostLanes({
        directory: root,
        worktree: root,
        task: "invalid-capacity",
        parentLease: null,
      }),
      diagnostic,
    );
    const read = fs.readFileSync;
    fs.readFileSync = (file, ...args) =>
      String(file).endsWith("/lane-capacity.json")
        ? bytes
        : read(file, ...args);
    syncBuiltinESMExports();
    try {
      assert.throws(() => memoryBudgets(root), diagnostic);
    } finally {
      fs.readFileSync = read;
      syncBuiltinESMExports();
    }
  }
});

test("host refusal supplies the gate-share remedy and its feasibility", () => {
  const sample = {
    level: "normal",
    pressure: 1,
    swapBytes: 0,
    physicalBytes: 8 * 2 ** 30,
    source: "fixture",
  };
  const limits = { taskBytes: 2 ** 30, hostLanes: 4, hostShare: 2 / 3 };
  const result = checkHost(sample, {
    limits,
    requiredPeakBytes: 1.1 * 2 ** 30,
  });
  assert.equal(result.exitCode, 1);
  assert.match(result.output, /memory\.gateShare must be at least 0\.55/);
  assert.match(
    checkHost(sample, { limits, requiredPeakBytes: 2 * 2 ** 30 }).output,
    /exceeds memory\.hostShare/,
  );
});

test("malformed gate identities cannot hang hedge observation", (t) => {
  childProbe(
    t,
    `
import assert from 'node:assert/strict';
import {scanHedges} from ${JSON.stringify(pathToFileURL(join(sourceRoot, "packages/skeleton/dist/src/observed-facts.js")).href)};
// Stop a nonadvancing empty-identity search before a reverted implementation
// can allocate an unbounded occurrence list.
const indexOf = String.prototype.indexOf;
String.prototype.indexOf = function(search, from) {
 if (search === '' && from > this.length) throw new Error('nonadvancing empty gate identity');
 return indexOf.call(this, search, from);
};
const facts={now:'2026-01-01T00:00:00Z',tasks:[],gates:[{checkId:'',durationMs:1},{checkId:null,durationMs:2},{checkId:42,durationMs:3},{checkId:'npm test',durationMs:1200}]};
const result=scanHedges('The npm test gate took about 3 minutes',facts);
assert.equal(result[0].observed,'1200 ms');
`,
    "",
    3000,
  );
});

test("an inherited lease retries one transient entry read and keeps its validated parent", (t) => {
  const directory = join(fixture(t), "host");
  childProbe(
    t,
    `
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
import {acquireHostLanes,inheritedHostLease} from ${JSON.stringify(pathToFileURL(join(sourceRoot, "scripts/lib/host-lanes.mjs")).href)};
const directory=${JSON.stringify(directory)};
const parent=await acquireHostLanes({directory,capacity:1,slots:1,parentLease:null,worktree:directory,task:'parent'});
const read=fs.readFileSync; let reads=0;
fs.readFileSync=(file,...args)=>{if(file===parent.file && ++reads===1) throw new Error('planted transient read'); return read(file,...args)};
syncBuiltinESMExports();
try {
 const lease=inheritedHostLease(directory,{DOTLN_HOST_LANE_LEASE:JSON.stringify({directory,file:parent.file})});
 assert.equal(lease?.file,parent.file);
 assert.equal(reads,2);
 const nested=await acquireHostLanes({directory,capacity:1,slots:1,parentLease:lease,worktree:directory,task:'nested'});
 assert.equal(nested.record.parent,parent.file);
 nested.release();
} finally {fs.readFileSync=read;syncBuiltinESMExports();parent.release();}
`,
  );
});

test("registration failures name sync for missing and stale compiled runtime", (t) => {
  const target = pathToFileURL(
    join(sourceRoot, "scripts/check-registrations.mjs"),
  ).href;
  for (const kind of ["missing", "stale"]) {
    const moduleSource = `
export async function resolve(specifier,context,nextResolve) {
 if(context.parentURL===${JSON.stringify(target)} && specifier==='@dotln/kernel' && ${JSON.stringify(kind)}==='missing') throw new Error('planted unavailable kernel');
 if(context.parentURL===${JSON.stringify(target)} && specifier==='./lib/build-freshness.mjs' && ${JSON.stringify(kind)}==='stale') return {url:'data:text/javascript,export const buildFreshness=()=>({current:false,reason:"planted stale runtime"});',shortCircuit:true};
 return nextResolve(specifier,context);
}`;
    childProbe(
      t,
      `
import assert from 'node:assert/strict';
const target=${JSON.stringify(target)};
if(${JSON.stringify(kind)}==='missing') await assert.rejects(import(target),/Registrations runtime unavailable; run npm run sync/);
else {const {registrationFindings}=await import(target);assert.throws(()=>registrationFindings(${JSON.stringify(sourceRoot)}),/Registrations runtime is stale: planted stale runtime; run npm run sync/);}
`,
      `import {register} from 'node:module'; register(${JSON.stringify("data:text/javascript," + encodeURIComponent(moduleSource))});`,
    );
  }
});

test("the guard applies the per-lane bare-group budget on a sixteen-processor sixteen-GiB host", (t) => {
  const directory = fixture(t);
  const resources = pathToFileURL(
    join(sourceRoot, "scripts/lib/host-resources.mjs"),
  ).href;
  const guard = pathToFileURL(join(sourceRoot, "scripts/host-guard.mjs")).href;
  const mock = `
import * as real from ${JSON.stringify(resources)};
export * from ${JSON.stringify(resources)};
const physicalBytes=16*2**30,capacity=real.hostLaneCapacity(16);
const limits={...real.memoryBudgets(${JSON.stringify(directory)},{capacity,physicalBytes}),signalIntervalMs:1,footprintIntervalMs:0};
export const DEFAULT_MEMORY={...real.DEFAULT_MEMORY,taskShare:0.5/capacity};
const processes=[{pid:process.pid,ppid:0,pgid:process.pid,birth:'guard',footprintBytes:0},{pid:900000001,ppid:0,pgid:900000001,birth:'session',footprintBytes:0},{pid:900000002,ppid:900000001,pgid:900000002,birth:'bare',name:'fixture-bare',footprintBytes:2*2**30}];
export const readHostSnapshot=()=>({processes,physicalBytes,pressure:1,swapBytes:0,unavailable:[]});
export const readRecords=(_directory,kind)=>kind==='sessions'?[{id:'fixture-session',pid:900000001,birth:'session',protected:true,repo:${JSON.stringify(directory)},limits}]:[];
export const withHostLock=async(_directory,_name,body)=>body();
export const killOwned=members=>members;
export const appendIncident=(_directory,incident)=>{(globalThis.guardIncidents??=[]).push(incident);process.emit('SIGTERM');};
`;
  const loader = `
export async function resolve(specifier,context,nextResolve) {
 if(context.parentURL===${JSON.stringify(guard)} && specifier==='./lib/host-resources.mjs') return {url:${JSON.stringify("data:text/javascript," + encodeURIComponent(mock))},shortCircuit:true};
 return nextResolve(specifier,context);
}`;
  childProbe(
    t,
    `
import assert from 'node:assert/strict';
import {runHostGuard} from ${JSON.stringify(guard)};
await runHostGuard(${JSON.stringify(directory)});
assert.equal(globalThis.guardIncidents.length,1);
const incident=globalThis.guardIncidents[0];
assert.equal(incident.scope,'task');
assert.equal(incident.pid,900000002);
assert.equal(incident.budgetBytes,2**30);
assert.equal(incident.measuredPeakFootprintBytes,2*2**30);
`,
    `import {register} from 'node:module'; register(${JSON.stringify("data:text/javascript," + encodeURIComponent(loader))});`,
  );
});

test("native Agent Skills profiles declare their format and validate generated frontmatter", async () => {
  const {
    lowerToHarness,
    assertHarnessProfile,
    compileFeedbackUnits,
    compileLoadout,
    requireCompiled,
    seiriLoadout,
    seiriEnvironment,
  } = await import("../packages/compiler/dist/src/index.js");
  const { contributorProfiles, targetWorkerProfiles } =
    await import("../packages/skeleton/dist/src/loadouts/contributor.js");
  for (const profile of [...contributorProfiles, ...targetWorkerProfiles]) {
    assert.equal(profile.skills.format, "agent-skills");
    for (const format of [undefined, "unknown"])
      assert.throws(
        () =>
          assertHarnessProfile({
            ...profile,
            skills: { ...profile.skills, format },
          }),
        /declared Agent Skills format/,
      );
  }
  assert.ok(targetWorkerProfiles.every((profile) => !profile.skills.available));
  const { harnessInstallation } = await import("./lib/harness.mjs");
  assert.doesNotThrow(() => harnessInstallation());
  const profile = contributorProfiles[1];
  const loadout = requireCompiled(
    compileLoadout(seiriLoadout, seiriEnvironment()),
  );
  const role = {
    facetId: "fixture.executor",
    name: "executor",
    description: 'Read the "native" format: then validate it.',
    intents: ["resume: next"],
    procedure: ["Read the selected public source."],
    feedbackHandlers: [],
  };
  const feedback = compileFeedbackUnits([]);
  const lower = (changes) =>
    lowerToHarness(
      {
        contractVersion: "harness-v1",
        loadout,
        roles: [{ ...role, ...changes }],
        facets: [],
        correctionToken: null,
      },
      feedback,
      loadout.authorityEnvelope,
      profile,
    );
  const skill = lower({}).files.find((file) => file.path.endsWith("/SKILL.md"));
  assert.equal(skill.path, ".agents/skills/dotln-executor/SKILL.md");
  const fields = skill.contents.match(
    /^---\nname: ([^\n]+)\ndescription: ([^\n]+)\n---\n/u,
  );
  assert.ok(fields);
  assert.equal(fields[1], "dotln-executor");
  assert.equal(JSON.parse(fields[2]), role.description);
  assert.doesNotThrow(() =>
    lower({ name: "x".repeat(58), description: "x".repeat(1024) }),
  );
  for (const name of [
    "executor.foo",
    "executor--other",
    "executor-",
    "x".repeat(59),
  ])
    assert.throws(() => lower({ name }), /native Agent Skills frontmatter/);
  assert.throws(
    () => lower({ description: "x".repeat(1025) }),
    /native Agent Skills frontmatter/,
  );
  assert.throws(
    () => lower({ description: "   " }),
    /native Agent Skills frontmatter/,
  );
  assert.throws(() => lower({ description: "" }), /role contract/);
  assert.throws(() => lower({ description: "one\ntwo" }), /role contract/);
  const convention = fs.readFileSync(
    join(sourceRoot, "docs/repositories/README.md"),
    "utf8",
  );
  assert.match(
    convention,
    /target-relative skill directories at a pinned target\n  commit/,
  );
  assert.match(convention, /grant no effect authority/);
});

test("authority transcript references preserve immutable bodies and resolve Git blobs", async (t) => {
  const { readAuthorityEvidence, writeAuthorityEvidence } =
    await import("../packages/skeleton/src/evidence-editions.mjs");
  for (const format of ["sha1", "sha256"]) {
    const root = fixture(t);
    runGit(root, ["init", "-q", `--object-format=${format}`]);
    excludeFixtureOwnership(root);
    const before = "docs/evidence/WO-990/authority/001";
    const after = "docs/evidence/WO-990/authority/002";
    const third = "docs/evidence/WO-990/authority/003";
    const contents = JSON.stringify({ authority: "immutable", format }) + "\n";
    assert.equal(
      writeAuthorityEvidence(root, before, contents),
      `${before}/authority.json`,
    );
    const body = readAuthorityEvidence(root, before);
    assert.equal(
      writeAuthorityEvidence(root, after, contents, before),
      `${after}/authority.ref.json`,
    );
    assert.equal(fs.existsSync(join(root, after, "authority.json")), false);
    assert.equal(
      writeAuthorityEvidence(root, third, contents, after),
      `${third}/authority.ref.json`,
    );
    assert.deepEqual(
      readAuthorityEvidence(root, third).reference,
      body.reference,
    );
    assert.throws(
      () => writeAuthorityEvidence(root, after, "changed", before),
      /immutable/,
    );
    runGit(root, ["hash-object", "-w", "--", body.reference.path]);
    fs.renameSync(
      join(root, body.reference.path),
      join(root, "moved-authority.json"),
    );
    assert.equal(readAuthorityEvidence(root, after).contents, contents);
    const refPath = join(root, after, "authority.ref.json");
    const saved = fs.readFileSync(refPath, "utf8");
    const record = JSON.parse(saved);
    for (const source of [
      { ...record.source, path: "../authority.json" },
      { ...record.source, path: "/authority.json" },
      { ...record.source, bytes: record.source.bytes + 1 },
      { ...record.source, blobHash: "0".repeat(format === "sha1" ? 40 : 64) },
    ]) {
      fs.writeFileSync(refPath, JSON.stringify({ ...record, source }));
      assert.throws(() => readAuthorityEvidence(root, after));
    }
    fs.writeFileSync(refPath, saved);
    fs.symlinkSync(
      join(root, "moved-authority.json"),
      join(root, body.reference.path),
    );
    assert.throws(
      () => readAuthorityEvidence(root, after),
      /contained regular file/,
    );
    fs.unlinkSync(join(root, body.reference.path));
    fs.writeFileSync(join(root, after, "authority.json"), contents);
    assert.throws(() => readAuthorityEvidence(root, after), /Ambiguous/);
    const changed = "docs/evidence/WO-990/authority/004";
    assert.equal(
      writeAuthorityEvidence(root, changed, "changed\n", before),
      `${changed}/authority.json`,
    );
    assert.equal(readAuthorityEvidence(root, changed).contents, "changed\n");
  }
});

test(
  "authority evidence CLI writes a reference for an unchanged transcript",
  { timeout: 120_000 },
  async (t) => {
    const { editionCopy } = await import("./lib/evidence-fixture.mjs");
    const { readAuthorityEvidence } =
      await import("../packages/skeleton/src/evidence-editions.mjs");
    const { copy, env } = editionCopy(t, { workspace: true });
    const bootstrap = spawnSync(process.execPath, ["scripts/build.mjs"], {
      cwd: copy,
      env,
      encoding: "utf8",
      timeout: 60_000,
    });
    assert.equal(bootstrap.status, 0, bootstrap.stderr || bootstrap.stdout);
    const directory = "docs/evidence/WO-999/authority/001";
    const command = (mode) =>
      spawnSync(
        process.execPath,
        [
          "scripts/authority-evidence.mjs",
          mode,
          "--edition",
          "WO-999",
          "--revision",
          "001",
        ],
        { cwd: copy, env, encoding: "utf8", timeout: 60_000 },
      );
    const before = JSON.parse(
      fs.readFileSync(join(copy, "docs/evidence/current.json"), "utf8"),
    );
    const previous = `docs/evidence/${before.editions.authority.workOrder}/authority/${before.editions.authority.revision}`;
    const original = readAuthorityEvidence(copy, previous);
    let result = command("--write");
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(fs.existsSync(join(copy, directory, "authority.json")), false);
    assert.equal(
      fs.existsSync(join(copy, directory, "authority.ref.json")),
      true,
    );
    const recorded = readAuthorityEvidence(copy, directory);
    assert.equal(recorded.contents, original.contents);
    assert.deepEqual(recorded.reference, original.reference);
    assert.ok(
      fs.statSync(join(copy, recorded.recordPath)).size <
        Buffer.byteLength(original.contents),
    );
    result = command("--check");
    assert.equal(result.status, 0, result.stderr || result.stdout);
    runGit(copy, ["hash-object", "-w", "--", original.reference.path]);
    fs.unlinkSync(join(copy, original.reference.path));
    result = command("--check");
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(
      readAuthorityEvidence(copy, directory).contents,
      original.contents,
    );
  },
);

test("authority evidence refuses symlinked destination ancestors before writing", async (t) => {
  const { writeAuthorityEvidence } =
    await import("../packages/skeleton/src/evidence-editions.mjs");
  const root = fixture(t);
  const outside = fixture(t);
  runGit(root, ["init", "-q"]);
  excludeFixtureOwnership(root);
  const previous = "docs/evidence/WO-990/authority/001";
  writeAuthorityEvidence(root, previous, "unchanged\n");
  for (const location of [
    "docs/evidence/WO-991",
    "docs/evidence/WO-992/authority/001",
  ]) {
    fs.mkdirSync(join(root, location, ".."), { recursive: true });
    fs.symlinkSync(outside, join(root, location));
    const directory = location.endsWith("/001")
      ? location
      : `${location}/authority/001`;
    for (const contents of ["unchanged\n", "changed\n"])
      assert.throws(
        () => writeAuthorityEvidence(root, directory, contents, previous),
        /contained directory ancestors/,
      );
    assert.deepEqual(fs.readdirSync(outside), [".dotln-owner.json"]);
  }
});
