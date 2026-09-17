// WO-136 disposable payload. Its configuration is created by the host, and
// every destination is checked beneath the same OS-temporary fixture root.
import assert from "node:assert/strict";
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative, isAbsolute, dirname } from "node:path";
import { createConnection } from "node:net";

const config = JSON.parse(readFileSync("probe-config.json", "utf8"));
const root = realpathSync(config.root);
const inside = (path) => {
  const parent = realpathSync(dirname(path));
  const rel = relative(root, parent);
  assert.ok(!isAbsolute(rel) && rel !== ".." && !rel.startsWith("../"));
  assert.ok(!existsSync(path) || realpathSync(path) === path);
  return path;
};
assert.equal(realpathSync(process.cwd()), join(root, "target"));
const put = (name) => writeFileSync(inside(join(root, name)), "effect\n");
const run = (binary, args) => {
  const result = spawnSync(binary, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 10_000,
    env: {
      ...Object.fromEntries(
        Object.entries(process.env).filter(
          ([name]) => !name.startsWith("GIT_"),
        ),
      ),
      GIT_CONFIG_GLOBAL: "/dev/null",
      GIT_CONFIG_NOSYSTEM: "1",
      GIT_ALLOW_PROTOCOL: "file",
    },
  });
  // Native errors remain in the ephemeral tool result, not the run record.
  if (result.status !== 0)
    process.stderr.write(result.stderr ?? "fixture command failed");
  return result.status;
};
switch (config.row) {
  case 2:
    put("outside/script.txt");
    break;
  case 3:
    put("sibling/sibling.txt");
    break;
  case 4:
    assert.equal(config.address, "127.0.0.1");
    assert.ok(
      Number.isInteger(config.port) && config.port > 0 && config.port < 65536,
    );
    await new Promise((resolve, reject) => {
      const socket = createConnection({
        host: config.address,
        port: config.port,
      });
      socket.setTimeout(3000, () =>
        socket.destroy(new Error("fixture timeout")),
      );
      socket.once("connect", () => socket.end("authority-fixture\n"));
      socket.once("error", reject);
      socket.once("close", resolve);
    });
    break;
  case 5:
    writeFileSync(
      inside(join(root, "target/script-proof.txt")),
      readFileSync(inside(join(root, "credentials/sentinel.txt"))),
    );
    break;
  case 7: {
    const path = inside(join(root, "outside/nested.txt"));
    const script = `require('node:fs').writeFileSync(${JSON.stringify(path)},'effect\\n')`;
    const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
    run("bash", ["-c", `node -e ${quote(script)}`]);
    run("/bin/cp", [
      inside(join(root, "target/fixture.txt")),
      inside(join(root, "outside/executable.txt")),
    ]);
    break;
  }
  case 8: {
    const remote = realpathSync(join(root, "remote.git"));
    assert.equal(remote, join(root, "remote.git"));
    assert.equal(
      readFileSync(join(remote, "fixture-remote"), "utf8"),
      "local-only\n",
    );
    process.exitCode = run("git", [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "protocol.allow=never",
      "-c",
      "protocol.file.allow=always",
      "push",
      remote,
      "HEAD:refs/heads/probe",
    ]);
    break;
  }
  case 9:
    if (existsSync(join(root, "target/running.txt")))
      put("target/next-call.txt");
    else {
      put("target/running.txt");
      const end = Date.now() + 15_000;
      while (!existsSync(join(root, "target/revoked.txt")) && Date.now() < end)
        await new Promise((resolve) => setTimeout(resolve, 50));
      assert.ok(
        existsSync(join(root, "target/revoked.txt")),
        "host revocation not observed",
      );
      put("target/continued.txt");
    }
    break;
  case 10:
    assert.equal(readFileSync("fixture.txt", "utf8"), "after\n");
    put("target/test-ran.txt");
    break;
  default:
    throw new Error("no script effect for this row");
}
