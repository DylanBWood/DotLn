import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const leaves = [
  "beacon-codebook",
  "beacon-io",
  "beacon-provenance",
  "beacon-v3-codebook",
  "beacon-v3-fs",
  "control-beacon-fs",
  "control-codebook",
];

function scriptSources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return scriptSources(path);
    return entry.isFile() && /\.(?:mjs|js|ts|sh)$/.test(entry.name)
      ? [path]
      : [];
  });
}

test("WO-070 grep scan finds one home for the seven Beacon leaves and no skeleton source or dist copy of them", () => {
  const leaf = `(?:${leaves.join("|")})`;
  const oldHome = new RegExp(
    `packages/skeleton/(?:src|dist/src)/${leaf}\\.(?:mjs|js)`,
  );
  const compiledCopy = new RegExp(
    `packages/beacons/dist/(?:src/)?${leaf}\\.(?:mjs|js)`,
  );
  for (const path of scriptSources(join(repository, "scripts"))) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(
      source,
      oldHome,
      `${path} imports a skeleton Beacon leaf`,
    );
    assert.doesNotMatch(
      source,
      compiledCopy,
      `${path} imports a compiled Beacon copy`,
    );
  }
  for (const name of leaves) {
    assert.ok(existsSync(join(repository, `packages/beacons/src/${name}.mjs`)));
    assert.ok(
      !existsSync(join(repository, `packages/skeleton/src/${name}.mjs`)),
    );
    assert.ok(
      !existsSync(join(repository, `packages/skeleton/dist/src/${name}.mjs`)),
    );
  }
});

test("WO-070 copied control plane emits a decoded Beacon without skeleton source", async (t) => {
  const root = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-beacon-portable-")),
  );
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const run = (file, args) => {
    const result = spawnSync(file, args, {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_THREAD_ID: "",
        DOTLN_LAUNCHPAD: "",
        DOTLN_BEACON_KEY_FILE: "",
      },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.doesNotMatch(result.stderr, /host beacon projection unavailable/);
    return result.stdout;
  };
  run("git", ["init", "-b", "main"]);
  run("git", ["config", "user.name", "DotLn Fixture"]);
  run("git", ["config", "user.email", "fixture@example.invalid"]);
  cpSync(join(repository, "scripts"), join(root, "scripts"), {
    recursive: true,
  });
  cpSync(join(repository, "packages/beacons"), join(root, "packages/beacons"), {
    recursive: true,
  });
  cpSync(join(repository, ".gitignore"), join(root, ".gitignore"));
  mkdirSync(join(root, "docs/work-orders"), { recursive: true });
  writeFileSync(
    join(root, "docs/work-orders/WO-099-fixture.md"),
    "# WO-099 fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
  );
  assert.ok(!existsSync(join(root, "packages/skeleton/src")));
  run("git", ["add", "."]);
  run("git", ["commit", "-qm", "portable fixture"]);
  run(process.execPath, [
    join(root, "scripts/resume.mjs"),
    "activate",
    "WO-099",
    "docs/work-orders/WO-099-fixture.md",
  ]);
  const status = JSON.parse(
    run(process.execPath, [
      join(root, "scripts/resume.mjs"),
      "status",
      "--json",
    ]),
  );
  assert.equal(status.phase, "active");
  assert.equal(status.latestVerdict, null);
  assert.ok(!existsSync(join(root, "packages/skeleton/src")));
  const { controlBeaconAddress, controlBeaconDirectory } = await import(
    pathToFileURL(join(root, "packages/beacons/src/control-beacon-fs.mjs")).href
  );
  const { decodeSignalSize } = await import(
    pathToFileURL(join(root, "packages/beacons/src/control-codebook.mjs")).href
  );
  for (const audience of ["public", "verifier"]) {
    const path = join(
      controlBeaconDirectory(root, audience),
      controlBeaconAddress("WO-099"),
    );
    const metadata = lstatSync(path, { bigint: true });
    assert.deepEqual(decodeSignalSize(metadata.size), {
      status: "decoded",
      state: {
        codebookVersion: 2,
        phase: "active",
        latestVerdict: "unknown",
        effort: "unknown",
        provenance: "host-projected",
      },
    });
    const expectedNs = BigInt(Date.parse(status.recordedAt)) * 1000000n;
    assert.ok(metadata.mtimeNs >= expectedNs);
    assert.ok(metadata.mtimeNs < expectedNs + 1000n);
  }
});
