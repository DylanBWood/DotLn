// Final review of WO-276: a resident started through scripts/resident.mjs
// reads its work-order cards inside the store's append lock, by running the
// index command. This starts one resident that way and one through the
// package's own entry, each over a fresh store under the scratch directory
// given as argv[2], runs `dotln presence away` against the store 1.5 s after
// the start, and prints what the presence command answered and how long the
// owner took. It writes nothing in the repository. Adapted from the review
// worker's probe of the same claim.
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const repo = process.cwd();
const scratch = process.argv[2];
const dist = (path) => import(pathToFileURL(join(repo, path)).href);
const { decodeResidentConfiguration } = await dist(
  "packages/skeleton/dist/src/resident-state.js",
);
const fixture = JSON.parse(
  readFileSync(
    join(repo, "packages/skeleton/fixtures/wo067-presence.json"),
    "utf8",
  ),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const configuration = (directory) => {
  const spec = {
    kind: "script",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 0, tokens: 0 },
    command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
    cwd: directory,
    timeoutMs: 1000,
    expectedStdoutSha256: hash("ok\n"),
  };
  return decodeResidentConfiguration({
    ...structuredClone(fixture),
    policyId: "fixture.progressive",
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((phase) => [phase, spec]),
    ),
    evidence: ["verified-input"],
  });
};
const env = { ...process.env };
delete env.DOTLN_LAUNCHPAD;
delete env.DOTLN_RESIDENT_STORE;
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
const trial = async (name, entry) => {
  const store = join(scratch, `store-${name}`);
  rmSync(store, { recursive: true, force: true });
  mkdirSync(store, { recursive: true });
  writeFileSync(
    join(store, "resident.json"),
    JSON.stringify(configuration(store)),
  );
  const started = Date.now();
  const owner = spawn(
    process.execPath,
    [...entry, "--store", store, "--policy", "fixture.progressive", "--once"],
    { cwd: repo, env, stdio: ["ignore", "ignore", "ignore"] },
  );
  const exited = new Promise((done) => owner.on("exit", (code) => done(code)));
  await delay(1500);
  const asked = Date.now();
  const presence = spawnSync(
    process.execPath,
    [
      join(repo, "packages/skeleton/dist/src/dotln.js"),
      "presence",
      "away",
      "--store",
      store,
    ],
    { cwd: repo, env, encoding: "utf8" },
  );
  const presenceMs = Date.now() - asked;
  const ownerExit = await exited;
  const ownerMs = Date.now() - started;
  rmSync(store, { recursive: true, force: true });
  return {
    startedBy: name,
    ownerExit,
    ownerMs,
    presenceExit: presence.status,
    presenceMs,
    presenceSaid: (presence.stdout || presence.stderr).trim().slice(0, 120),
  };
};
const results = [
  await trial("launcher", [join(repo, "scripts/resident.mjs")]),
  await trial("package-entry", [
    join(repo, "packages/skeleton/dist/src/dotln.js"),
    "resident",
  ]),
];
console.log(JSON.stringify(results, null, 2));
