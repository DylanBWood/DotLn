import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Rerun actual failing checks against committed base bytes; observations never
 * turn a failed current check green or authorize a repair. */
export async function classifyDocumentFailures(
  repo,
  tasks,
  rows,
  { against, execute, signal } = {},
) {
  const failed = rows.filter((row) => row.exitCode !== 0);
  if (!failed.length) return [];
  const git = (cwd, args) => {
    const run = spawnSync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    if (run.status !== 0)
      throw new Error(run.stderr.trim() || "base Git observation failed");
    return run.stdout.trim();
  };
  const unknown = (reason, base = null) =>
    failed.map(({ name }) => ({
      name,
      classification: "unknown",
      base,
      reason,
    }));
  let base, temporary;
  try {
    base = against
      ? git(repo, [
          "rev-parse",
          "--verify",
          "--end-of-options",
          `${against}^{commit}`,
        ])
      : git(repo, ["merge-base", "HEAD", "main"]);
    temporary = mkdtempSync(join(tmpdir(), "dotln-document-base-"));
    const copy = join(temporary, "subject");
    git(repo, [
      "clone",
      "--quiet",
      "--shared",
      "--no-checkout",
      "--",
      repo,
      copy,
    ]);
    git(copy, [
      "-c",
      "core.hooksPath=/dev/null",
      "checkout",
      "--quiet",
      "--detach",
      base,
    ]);
    // External dependencies may be shared; workspace packages and build output
    // must belong to the base, never to the current subject.
    const dependencies = join(repo, "node_modules");
    if (existsSync(dependencies)) {
      mkdirSync(join(copy, "node_modules"), { recursive: true });
      for (const name of readdirSync(dependencies)) {
        if (name === "@dotln" || name === ".bin") continue;
        symlinkSync(join(dependencies, name), join(copy, "node_modules", name));
      }
      if (existsSync(join(dependencies, ".bin")))
        symlinkSync(
          join(dependencies, ".bin"),
          join(copy, "node_modules/.bin"),
        );
      if (existsSync(join(copy, "packages"))) {
        mkdirSync(join(copy, "node_modules/@dotln"), { recursive: true });
        for (const name of readdirSync(join(copy, "packages")))
          symlinkSync(
            join(copy, "packages", name),
            join(copy, "node_modules/@dotln", name),
          );
      }
    }
    const needed = failed
      .map((row) => tasks.find((task) => task.name === row.name))
      .filter(Boolean);
    const build = tasks.find((task) => task.build && task.command.length);
    if (build && needed.some((task) => task.needsBuild || task.build)) {
      const built = await execute(build, copy, signal);
      if (!built.executed || built.exitCode !== 0)
        return unknown(`base build failed: ${built.output}`, base);
    }
    const observations = [];
    for (const failure of failed) {
      if (signal?.aborted) return unknown("base comparison stopped", base);
      const task = tasks.find((row) => row.name === failure.name);
      if (!task || !failure.executed || failure.failureKind) {
        observations.push({
          name: failure.name,
          base,
          classification: "unknown",
          reason: "current check did not complete an ordinary execution",
        });
        continue;
      }
      // A command added by this branch has no base check to execute.
      const script = task.command
        .slice(1)
        .find((arg) => /^scripts\//u.test(arg) && !arg.includes("*"));
      if (script && !existsSync(join(copy, script))) {
        observations.push({
          name: failure.name,
          base,
          classification: "unknown",
          reason: "check absent at base",
        });
        continue;
      }
      const result = await execute(task, copy, signal);
      observations.push({
        name: failure.name,
        base,
        classification:
          result.executed && !result.failureKind
            ? result.exitCode === 0
              ? "introduced"
              : "inherited"
            : "unknown",
        baseExitCode: result.exitCode,
        baseExecuted: result.executed,
        baseOutput: result.output ?? "",
      });
    }
    return observations;
  } catch (error) {
    return unknown(error.message, base);
  } finally {
    if (temporary) rmSync(temporary, { recursive: true, force: true });
  }
}
