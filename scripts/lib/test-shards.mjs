// A suite's cases in shards. A row of the test runner that declares shards
// runs one process a shard, each with its shard in the environment, and a
// test file takes `test` from here in place of node:test: a case registers
// only in the shard its title falls in. With no shard named every case
// registers, so one case still runs by its name under the bounded wrapper.
// A case is placed by a hash of its title: every case is in exactly one
// shard, and a new case needs no registration.
import { createHash } from "node:crypto";
import { appendFileSync } from "node:fs";
import nodeTest from "node:test";

/** The variable a shard's process carries: `<n>/<count>`, counted from one. */
export const SHARD_VARIABLE = "DOTLN_TEST_SHARD";
/** The variable that names a file to list titles in. A process that carries
 * it appends each top-level title it is asked to register, one JSON string a
 * line, and registers none: the list of what the files declare, taken
 * without running a case. */
export const TITLES_VARIABLE = "DOTLN_TEST_TITLES";

/** The value a shard's process carries. */
export const shardValue = (number, count) => `${number}/${count}`;

/** The shard a value names, or null for none. A value that is not
 * `<n>/<count>` with n from one to count refuses: a mistyped shard would
 * otherwise run no case and pass. */
export function namedShard(value) {
  if (value === undefined || value === "") return null;
  const named = /^([1-9]\d*)\/([1-9]\d*)$/u.exec(value);
  const number = Number(named?.[1]);
  const count = Number(named?.[2]);
  if (!named || number > count)
    throw new Error(
      `${SHARD_VARIABLE} names a shard as <n>/<count>, n from 1 to count; it holds ${JSON.stringify(value)}`,
    );
  return { number, count };
}

/** The shard a case's title falls in, counted from one. */
export const shardOf = (title, count) =>
  (createHash("sha256").update(title).digest().readUInt32BE(0) % count) + 1;

const shard = namedShard(process.env[SHARD_VARIABLE]);
const titles = process.env[TITLES_VARIABLE] || null;
// A case's own child processes are shards of nothing: both variables end
// with the process that read them, so a nested run registers every case.
delete process.env[SHARD_VARIABLE];
delete process.env[TITLES_VARIABLE];

/** A registrar of node:test's, registering a top-level case only in its
 * shard and listing its title where titles are asked for. A case without a
 * title cannot be placed and registers in every shard. */
const placed = (register) =>
  function test(name, ...rest) {
    if (titles) {
      appendFileSync(titles, `${JSON.stringify(String(name))}\n`);
      return undefined;
    }
    if (
      shard &&
      typeof name === "string" &&
      shardOf(name, shard.count) !== shard.number
    )
      return undefined;
    return register(name, ...rest);
  };
/** node:test's `test`, each top-level case in one shard. */
const test = placed(nodeTest);
// A modifier registers a case as `test` does, so it is placed and listed as
// one; the hooks and whatever else a file reaches through `test` are
// node:test's own.
const MODIFIERS = ["only", "skip", "todo"];
for (const key of Object.keys(nodeTest))
  if (!(key in test))
    test[key] = MODIFIERS.includes(key) ? placed(nodeTest[key]) : nodeTest[key];

export { test };
export default test;
