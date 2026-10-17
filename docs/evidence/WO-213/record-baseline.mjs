import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { findLaunchpad } from "../../../scripts/lib/config.mjs";
import { runGit, spawnGit } from "../../../scripts/lib/git.mjs";
import { recordFiles, homePathFindings } from "../../../scripts/docs-check.mjs";

// This evidence prints a proposal, never writes the baseline. Matching current
// lines must consume identical base lines, including their multiplicity.
try {
  const root = findLaunchpad();
  const base = process.argv[2] ?? "7b66f8b303a316ff4560b4827d6dc728cd7f504a";
  if (process.argv.length > 3 || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(base))
    throw new Error("usage: node record-baseline.mjs [full-base-commit]");
  runGit(root, ["cat-file", "-e", `${base}^{commit}`]);
  const homePaths = {},
    counts = {},
    files = [];
  const matches = homePathFindings(root, recordFiles(root));
  for (const file of [...new Set(matches.map((row) => row.file))]) {
    const committed = spawnGit(["show", `${base}:${file}`], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    if (committed.status !== 0)
      throw new Error(`${file}: matching record is absent at the base`);
    const available = new Map();
    for (const line of committed.stdout.split("\n"))
      available.set(line, (available.get(line) ?? 0) + 1);
    const current = readFileSync(join(root, file), "utf8").split("\n");
    const rows = matches.filter((row) => row.file === file);
    for (const row of rows) {
      const line = current[row.line - 1],
        count = available.get(line) ?? 0;
      if (!count)
        throw new Error(
          `${file}:${row.line}: matching line is new, edited or duplicated since the base`,
        );
      available.set(line, count - 1);
    }
    homePaths[file] = rows.map((row) => row.fingerprint);
    const extension = extname(file);
    counts[extension] ??= { files: 0, lines: 0 };
    counts[extension].files++;
    counts[extension].lines += rows.length;
    const firstCommit = runGit(root, [
      "log",
      "--format=%H",
      "--diff-filter=A",
      base,
      "--",
      file,
    ])
      .split("\n")
      .at(-1);
    const afterScreen =
      firstCommit !== runGit(root, ["rev-parse", "1aea2dea"]) &&
      spawnGit(["merge-base", "--is-ancestor", "1aea2dea", firstCommit], {
        cwd: root,
      }).status === 0;
    files.push({ file, lines: rows.length, firstCommit, afterScreen });
  }
  console.log(JSON.stringify({ base, counts, files, homePaths }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
