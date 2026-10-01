// Executable proof for the operator-authorized future-worktree prerequisite.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrapWorktree } from "../../../scripts/bootstrap.mjs";

const source = fileURLToPath(new URL("../../../", import.meta.url));
const label = process.argv[2] ?? "bootstrap-live-001";
assert.match(label, /^[a-z][a-z0-9-]*$/u);
const receiptPath = fileURLToPath(new URL(`${label}.json`, import.meta.url));
assert.equal(existsSync(receiptPath), false, "live receipts are immutable");
const base = realpathSync(mkdtempSync(join(tmpdir(), "wo181-bootstrap-")));
const seed = join(base, "seed");
mkdirSync(seed);
const write = (root, path, value) => {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, value);
};
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const digest = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");
const environment = Object.fromEntries(
  Object.entries(process.env).filter(
    ([name]) =>
      ![
        "PLAYWRIGHT_BROWSERS_PATH",
        "npm_config_playwright_browsers_path",
        "npm_package_config_playwright_browsers_path",
        "NODE_TEST_CONTEXT",
        "NODE_TEST_WORKER_ID",
      ].includes(name),
  ),
);
const git = (root, args) => {
  const result = spawnSync("git", args, {
    cwd: root,
    env: environment,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};

// Exact workspace manifests and lockfile, with only the build replaced by an
// explicit fixture marker. No target app, hooks or model session are launched.
const manifest = json(join(source, "package.json"));
manifest.scripts = { build: "node scripts/build-marker.mjs" };
write(seed, "package.json", JSON.stringify(manifest, null, 2) + "\n");
write(
  seed,
  "package-lock.json",
  readFileSync(join(source, "package-lock.json")),
);
for (const name of readdirSync(join(source, "packages"))) {
  const path = `packages/${name}/package.json`;
  if (existsSync(join(source, path)))
    write(seed, path, readFileSync(join(source, path)));
}
write(seed, ".gitignore", "node_modules/\n.runtime/\n");
write(
  seed,
  "scripts/build-marker.mjs",
  'import {mkdirSync,writeFileSync} from "node:fs"; mkdirSync(".runtime",{recursive:true}); writeFileSync(".runtime/built","after prerequisites\\n");\n',
);
git(seed, ["init", "-b", "fixture"]);
git(seed, ["add", "."]);
git(seed, [
  "-c",
  "user.name=Fixture",
  "-c",
  "user.email=fixture@example.invalid",
  "commit",
  "-qm",
  "Public bootstrap fixture",
]);

const receipt = {
  schemaVersion: 1,
  label,
  scope:
    "New temporary Git worktrees only; real npm ci, pinned Playwright installer and Chromium launch; build is a labeled marker double and hooks are absent",
  source: {
    bootstrapSha256: digest(join(source, "scripts/bootstrap.mjs")),
    lockfileSha256: digest(join(source, "package-lock.json")),
    playwrightVersion: json(
      join(source, "packages/browser-evidence/package.json"),
    ).dependencies.playwright,
  },
  rows: [],
};
const raw = [];
function prepare(root, name, env) {
  const row = { name, steps: [], ready: false, browserLaunched: false };
  const before = Date.now();
  bootstrapWorktree(
    root,
    (command, args, options) => {
      const result = spawnSync(command, args, {
        ...options,
        stdio: ["ignore", "pipe", "pipe"],
        encoding: "utf8",
        timeout: 180_000,
      });
      raw.push({
        name,
        command,
        args,
        stdout: result.stdout,
        stderr: result.stderr,
        status: result.status,
      });
      const browser = args[0] === "node_modules/playwright/cli.js";
      row.steps.push({
        kind:
          command === "git"
            ? "git-root"
            : browser
              ? "browser-install"
              : args[0] === "ci"
                ? "npm-ci"
                : "build-double",
        exitCode: result.status,
        ...(browser
          ? {
              downloadObserved: /Downloading /u.test(result.stdout ?? ""),
              cacheMatches:
                options.env.PLAYWRIGHT_BROWSERS_PATH ===
                (env.PLAYWRIGHT_BROWSERS_PATH ??
                  join(root, ".runtime/playwright")),
              initCwdMatches: options.env.INIT_CWD === root,
            }
          : {}),
      });
      return result;
    },
    env,
  );
  assert.equal(existsSync(join(root, ".runtime/built")), true);
  row.ready = true;
  const browser = row.steps.find((step) => step.kind === "browser-install");
  assert.equal(browser.exitCode, 0);
  assert.equal(browser.cacheMatches, true);
  assert.equal(browser.initCwdMatches, true);
  assert.equal(
    json(join(root, "node_modules/playwright/package.json")).version,
    receipt.source.playwrightVersion,
  );
  const launch = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import {chromium} from "playwright"; const browser = await chromium.launch({headless:true}); console.log(browser.version()); await browser.close();',
    ],
    {
      cwd: root,
      env: {
        ...env,
        PLAYWRIGHT_BROWSERS_PATH:
          env.PLAYWRIGHT_BROWSERS_PATH ?? join(root, ".runtime/playwright"),
        INIT_CWD: root,
      },
      encoding: "utf8",
      timeout: 30_000,
    },
  );
  assert.equal(launch.status, 0, launch.stderr);
  row.browserLaunched = true;
  row.browserVersion = launch.stdout.trim();
  row.wallSeconds = (Date.now() - before) / 1000;
  receipt.rows.push(row);
  console.log(JSON.stringify(row));
  return row;
}

try {
  const first = join(base, "future-first");
  git(seed, ["worktree", "add", first, "-b", "future-first"]);
  const cold = prepare(first, "fresh-default-cache", {
    ...environment,
    INIT_CWD: seed,
  });
  assert.equal(
    cold.steps.find((row) => row.kind === "browser-install").downloadObserved,
    true,
  );
  const offline = {
    ...environment,
    INIT_CWD: seed,
    PLAYWRIGHT_DOWNLOAD_HOST: "http://127.0.0.1:9",
    npm_config_offline: "true",
  };
  const warm = prepare(
    first,
    "cached-retry-with-download-host-unavailable",
    offline,
  );
  assert.equal(
    warm.steps.find((row) => row.kind === "browser-install").downloadObserved,
    false,
  );
  const second = join(base, "future-override");
  git(seed, ["worktree", "add", second, "-b", "future-override"]);
  const override = prepare(second, "fresh-worktree-explicit-cache-offline", {
    ...offline,
    PLAYWRIGHT_BROWSERS_PATH: join(first, ".runtime/playwright"),
  });
  assert.equal(
    override.steps.find((row) => row.kind === "browser-install")
      .downloadObserved,
    false,
  );
  assert.equal(existsSync(join(second, ".runtime/playwright")), false);
  receipt.status = "passed";
} finally {
  // Raw diagnostics stay local; the public receipt contains no host paths.
  write(
    source,
    `docs/control/local/${label}.json`,
    JSON.stringify({ base, raw }, null, 2) + "\n",
  );
}
writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", {
  flag: "wx",
});
