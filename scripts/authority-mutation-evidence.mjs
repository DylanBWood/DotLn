#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  cleanEnvironment,
  cleanupScratch,
  createScratch,
  linkDependencies,
  runProcess,
} from "../corpus/mutation/mutate.mjs";

const [mode, ...extra] = process.argv.slice(2);
assert.ok(
  ["--write", "--check"].includes(mode) && !extra.length,
  "usage: authority-mutation-evidence.mjs --write|--check",
);
const root = realpathSync(fileURLToPath(new URL("../", import.meta.url)));
const git = (cwd, args, options = {}) =>
  execFileSync("git", args, {
    cwd,
    env: cleanEnvironment("/private/tmp"),
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
assert.equal(
  realpathSync(git(root, ["rev-parse", "--show-toplevel"]).trim()),
  root,
);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const inventory = [
  ...new Set(
    git(root, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
      .split("\0")
      .filter(Boolean),
  ),
].sort();
const subjectPaths = inventory.filter((path) =>
  /^(?:packages\/|(?:package(?:-lock)?|tsconfig)\.json$|corpus\/mutation\/(?:mutate|enumerate)\.mjs$|scripts\/authority-mutation-evidence\.mjs$)/u.test(
    path,
  ),
);
const subjectFiles = subjectPaths.map((path) => ({
  path,
  sha256: sha256(readFileSync(join(root, path))),
}));
const destination = join(root, "docs/evidence/WO-042/mutations");
const check = () => {
  const summary = JSON.parse(
    readFileSync(join(destination, "summary.json"), "utf8"),
  );
  assert.deepEqual(
    summary.subjectFiles,
    subjectFiles,
    "mutation evidence executable subject drift",
  );
  const transcript = readFileSync(join(destination, "reproduce.log"), "utf8");
  assert.equal(sha256(transcript), summary.transcriptSha256);
  for (const [index, id] of ["M00001", "M00002"].entries()) {
    const result = summary.results[index];
    assert.equal(result.id, id);
    assert.equal(result.verdict, "killed-by-test");
    assert.equal(result.compiled, true);
    assert.ok(result.killingTests.length > 0);
    assert.ok(transcript.includes(JSON.stringify(result)));
    const baseline = summary.baselines[index];
    assert.equal(baseline.verdict, "survived");
    assert.equal(baseline.failed, 0);
    assert.equal(baseline.cancelled, 0);
    assert.ok(baseline.passed > 0);
    assert.ok(transcript.includes(`baseline ${JSON.stringify(baseline)}`));
  }
  console.log(
    "Verified current executable subject, two green baselines and two named mutation test kills.",
  );
};

if (mode === "--write") {
  const handle = createScratch();
  try {
    // An isolated fixture Git directory lets the unchanged runner consume the
    // current uncommitted source. No refs, index or objects in the order change.
    const scratch = join(handle.path, "tree");
    mkdirSync(scratch);
    for (const path of inventory) {
      const source = join(root, path),
        target = join(scratch, path);
      const stat = lstatSync(source);
      mkdirSync(dirname(target), { recursive: true });
      if (stat.isSymbolicLink()) {
        const link = readlinkSync(source);
        assert.ok(
          !isAbsolute(link) &&
            !relative(scratch, resolve(dirname(target), link)).startsWith(".."),
          "snapshot link must stay contained",
        );
        symlinkSync(link, target);
      } else {
        assert.ok(stat.isFile(), "snapshot entries must be regular files");
        writeFileSync(target, readFileSync(source), {
          flag: "wx",
          mode: stat.mode & 0o777,
        });
      }
    }
    git(scratch, [
      "-c",
      "init.defaultBranch=authority-mutation-fixture",
      "init",
      "--quiet",
    ]);
    const objects = realpathSync(
      resolve(root, git(root, ["rev-parse", "--git-path", "objects"]).trim()),
    );
    writeFileSync(
      join(scratch, ".git/objects/info/alternates"),
      objects + "\n",
    );
    git(scratch, ["add", "--all"]);
    const tree = git(scratch, ["write-tree"]).trim();
    const activation = JSON.parse(
      readFileSync(
        join(root, "docs/evidence/WO-042/authority-baseline.json"),
        "utf8",
      ),
    ).sourceRevision;
    const snapshot = git(
      scratch,
      [
        "-c",
        "user.name=Mutation fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "commit-tree",
        tree,
        "-p",
        activation,
      ],
      {
        input: "WO-042 current-source mutation fixture\n",
        env: {
          ...cleanEnvironment(handle.path),
          GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
          GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
        },
      },
    ).trim();
    writeFileSync(join(scratch, ".git/HEAD"), snapshot + "\n");
    linkDependencies(scratch, join(root, "node_modules"));
    let transcript = "";
    const run = async (...args) => {
      const command = [
        "corpus/mutation/mutate.mjs",
        "--commit",
        snapshot,
        ...args,
      ];
      const result = await runProcess(process.execPath, command, {
        cwd: scratch,
        env: cleanEnvironment(handle.path),
        timeoutMs: 300000,
      });
      assert.equal(result.timedOut, false, "mutation reproduction timeout");
      assert.equal(result.code, 0, result.output);
      const output = result.output.split(handle.path).join("<scratch>");
      transcript += `$ node ${command.join(" ")}\n${output}`;
      process.stdout.write(output);
      return output;
    };
    await run("--enumerate");
    const baselines = [],
      results = [];
    for (const id of ["M00001", "M00002"]) {
      const output = await run("--reproduce", id);
      const lines = output.trimEnd().split("\n");
      baselines.push(
        JSON.parse(lines.find((line) => line.startsWith("baseline ")).slice(9)),
      );
      results.push(
        JSON.parse(lines.find((line) => line.startsWith(`{"id":"${id}"`))),
      );
      assert.equal(results.at(-1).verdict, "killed-by-test");
    }
    const policy = JSON.parse(
      readFileSync(
        join(scratch, `corpus/mutation/policy-${snapshot}.json`),
        "utf8",
      ),
    );
    const sites = readFileSync(
      join(scratch, `corpus/mutation/sites-${snapshot}.jsonl`),
      "utf8",
    )
      .trimEnd()
      .split("\n")
      .map((line) => JSON.parse(line))
      .filter((site) => ["M00001", "M00002"].includes(site.id));
    mkdirSync(destination, { recursive: true });
    writeFileSync(join(destination, "reproduce.log"), transcript);
    writeFileSync(
      join(destination, "summary.json"),
      JSON.stringify(
        {
          scope:
            "Current public worktree snapshot in isolated fixture Git; only F-00001 and F-00002 reproduced. Historical campaign unchanged. Recreate with node scripts/authority-mutation-evidence.mjs --write; snapshot id is temporary, not a source-branch commit.",
          activation,
          snapshot,
          subjectFiles,
          policy,
          sites,
          baselines,
          results,
          transcriptSha256: sha256(transcript),
        },
        null,
        2,
      ) + "\n",
    );
  } finally {
    cleanupScratch(handle);
  }
}
check();
