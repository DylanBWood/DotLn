import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const subject = resolve(import.meta.dirname, "../../../..");
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo189-commands-")),
);
const git = (root, ...args) => {
  const result = spawnSync(
    "git",
    ["-C", root, "-c", "core.hooksPath=/dev/null", ...args],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};
const results = [];
try {
  if (
    realpathSync(git(subject, "rev-parse", "--show-toplevel")) !==
    realpathSync(subject)
  )
    throw new Error("subject root mismatch");
  const files = git(subject, "ls-files", "-z").split("\0").filter(Boolean);
  files.push(
    "scripts/lib/front-page-scope.mjs",
    "docs/control/front-page.json",
  );
  for (const file of [...new Set(files)]) {
    if (!existsSync(join(subject, file))) continue;
    mkdirSync(dirname(join(scratch, file)), { recursive: true });
    cpSync(join(subject, file), join(scratch, file), { dereference: false });
  }
  git(scratch, "init", "-q", "-b", "main");
  if (realpathSync(git(scratch, "rev-parse", "--show-toplevel")) !== scratch)
    throw new Error("scratch root mismatch");
  const digest = (file) =>
    createHash("sha256")
      .update(readFileSync(join(scratch, file)))
      .digest("hex");
  const beforeLock = digest("package-lock.json");
  const env = {
    ...process.env,
    DOTLN_LAUNCHPAD: scratch,
    NPM_CONFIG_USERCONFIG: "/dev/null",
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
  };
  for (const [command, args] of [
    ["npm install", ["install"]],
    ["npm run skeleton", ["run", "skeleton"]],
    ["npm run console -- board", ["run", "console", "--", "board"]],
    [
      'npm run dotln -- intent "Describe the work"',
      ["run", "dotln", "--", "intent", "Describe the work"],
    ],
  ]) {
    const started = Date.now();
    const run = spawnSync("npm", args, {
      cwd: scratch,
      env,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    const output = (run.stdout ?? "") + (run.stderr ?? "");
    const meaningful = output
      .split("\n")
      .filter((line) =>
        /verified=true|candidates=|Filed draft|Actor board|added \d+ packages|up to date|Built .*replacement/.test(
          line,
        ),
      );
    results.push({
      command,
      status: run.status,
      durationMs: Date.now() - started,
      outputLines: output.split("\n").length,
      observations: meaningful.slice(0, 8),
      failure: run.status === 0 ? undefined : output.slice(-2500),
    });
    console.log(JSON.stringify(results.at(-1)));
    if (run.status !== 0) break;
  }
  console.log(
    JSON.stringify({
      probe:
        "four README commands as written, in a temporary mirror of the recorded subject on the same host; effects confined to the mirror",
      lockfileUnchanged: digest("package-lock.json") === beforeLock,
      allPassed:
        results.length === 4 && results.every((row) => row.status === 0),
    }),
  );
  if (results.length !== 4 || results.some((row) => row.status !== 0))
    process.exitCode = 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
