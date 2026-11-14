// Criterion D3's evidence: the titles the hook suite's files declare beside
// the titles its shard tasks ran.
//
//   node docs/evidence/WO-276/part-d/titles.mjs declared    the titles each file declares
//   node docs/evidence/WO-276/part-d/titles.mjs shard <n>   run shard n as the gate runs it
//   node docs/evidence/WO-276/part-d/titles.mjs compare     the two lists side by side
//
// `declared` runs each file with the helper's listing variable, which
// records every top-level title and registers none, so no case runs.
// `shard` runs one expanded task of the row through the runner's own
// executor and keeps the titles its report passed. Each writes a file of
// its own beside this one; `compare` reads them and writes titles.json.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { TITLES_VARIABLE } from "../../../../scripts/lib/test-shards.mjs";

const here = import.meta.dirname;
const root = resolve(here, "../../../..");
const [mode, argument] = process.argv.slice(2);
const json = (name) => join(here, name);
const write = (name, value) =>
  writeFileSync(json(name), `${JSON.stringify(value, null, 2)}\n`);
// The files the row loads: its two entry files and the files the first
// imports, in the order it imports them.
const ENTRIES = ["scripts/test-harness.mjs", "scripts/test-drive.mjs"];
const imported = [
  ...readFileSync(join(root, ENTRIES[0]), "utf8").matchAll(
    /^import "\.\/(test-[^"]+\.mjs)";$/gmu,
  ),
].map((match) => `scripts/${match[1]}`);

if (mode === "declared") {
  const scratch = mkdtempSync(join(tmpdir(), "dotln-titles-"));
  const listed = (file) => {
    const list = join(scratch, "titles");
    writeFileSync(list, "");
    const result = spawnSync(process.execPath, [file], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, [TITLES_VARIABLE]: list },
    });
    if (result.status !== 0)
      throw new Error(`${file}: ${result.stderr || result.stdout}`);
    return readFileSync(list, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  };
  try {
    const byFile = Object.fromEntries(
      [...imported, ENTRIES[1]].map((file) => [file, listed(file)]),
    );
    // The first entry file lists its imports' titles with its own.
    const whole = listed(ENTRIES[0]);
    const theirs = imported.flatMap((file) => byFile[file]);
    const own = [...whole];
    for (const title of theirs) own.splice(own.indexOf(title), 1);
    write("titles-declared.json", {
      files: { [ENTRIES[0]]: own, ...byFile },
    });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
} else if (mode === "shard") {
  const { executeSuite, expandSuiteTasks, suites } =
    await import("../../../../scripts/test-runner.mjs");
  const tasks = expandSuiteTasks(
    [suites.find((row) => row.name === "harness-fixtures")],
    root,
  );
  const task = tasks.find((row) => row.shard?.number === Number(argument));
  if (!task) throw new Error(`no shard ${argument} among ${tasks.length}`);
  const result = await executeSuite(task, root, task.timeoutMs ?? 900_000);
  const ran = [...result.output.matchAll(/^ok \d+ - (.+)$/gmu)]
    .map((match) => match[1])
    .filter((title) => !/ # (?:SKIP|TODO)\b/u.test(title))
    // The report escapes a number sign in a title.
    .map((title) => title.replaceAll("\\#", "#").replaceAll("\\\\", "\\"));
  write(`titles-shard-${task.shard.number}.json`, {
    task: task.name,
    shard: task.shard,
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    ran,
  });
  if (result.exitCode !== 0) {
    console.error(result.output.slice(-4000));
    process.exitCode = 1;
  }
} else if (mode === "compare") {
  const declared = JSON.parse(
    readFileSync(json("titles-declared.json"), "utf8"),
  );
  const count = Number(argument);
  const shards = Array.from({ length: count }, (_, at) =>
    JSON.parse(readFileSync(json(`titles-shard-${at + 1}.json`), "utf8")),
  );
  const all = Object.values(declared.files).flat();
  const ran = shards.flatMap((shard) => shard.ran);
  const tally = (titles) => {
    const counts = new Map();
    for (const title of titles) counts.set(title, (counts.get(title) ?? 0) + 1);
    return counts;
  };
  const want = tally(all),
    got = tally(ran);
  write("titles.json", {
    what: "The titles declared by every file the harness-fixtures row loads, beside the titles its shard tasks ran (WO-276 criterion D3).",
    declared: {
      total: all.length,
      byFile: Object.fromEntries(
        Object.entries(declared.files).map(([file, titles]) => [
          file,
          titles.length,
        ]),
      ),
      // One title declared twice is one case run twice, in one shard.
      declaredMoreThanOnce: [...want]
        .filter(([, n]) => n > 1)
        .map(([title]) => title),
    },
    ran: {
      total: ran.length,
      byShard: shards.map((shard) => ({
        task: shard.task,
        exitCode: shard.exitCode,
        durationMs: shard.durationMs,
        titles: shard.ran.length,
      })),
      inMoreThanOneShard: [...got]
        .filter(
          ([title]) =>
            shards.filter((shard) => shard.ran.includes(title)).length > 1,
        )
        .map(([title]) => title),
    },
    declaredNotRun: [...want]
      .filter(([title, n]) => (got.get(title) ?? 0) < n)
      .map(([title]) => title),
    runNotDeclared: [...got]
      .filter(([title, n]) => (want.get(title) ?? 0) < n)
      .map(([title]) => title),
    equal:
      all.length === ran.length &&
      [...want].every(([title, n]) => got.get(title) === n),
    titles: {
      declared: declared.files,
      ran: Object.fromEntries(shards.map((shard) => [shard.task, shard.ran])),
    },
  });
  console.log(
    readFileSync(json("titles.json"), "utf8").split('"titles": {')[0],
  );
} else
  throw new Error("usage: titles.mjs declared | shard <n> | compare <count>");
