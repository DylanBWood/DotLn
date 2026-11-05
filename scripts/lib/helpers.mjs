import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { parseJson } from "./paths.mjs";

export const write = (root, path, contents, { mode } = {}) => {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(
    destination,
    contents,
    mode === undefined ? undefined : { mode },
  );
};

export const json = (value) => JSON.stringify(value, null, 2) + "\n";

export const timestamp = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(value) &&
  Number.isFinite(Date.parse(value));

export const validDigest = (value) =>
  typeof value === "string" && /^sha256:[0-9a-f]{64}$/u.test(value);

export const exact = (value, keys) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");

export const parseWithLabel = (source, label) => {
  try {
    return parseJson(source, label, { rawErrors: true });
  } catch {
    throw new Error(`invalid JSON: ${label}`);
  }
};

export const ensureDirectory = (root, path, message) => {
  let directory = root;
  for (const part of path.split("/")) {
    directory = join(directory, part);
    if (!existsSync(directory)) mkdirSync(directory);
    if (
      !lstatSync(directory).isDirectory() ||
      lstatSync(directory).isSymbolicLink()
    )
      throw new Error(message);
  }
};

export const locked = async (root, path, label, directoryMessage, run) => {
  ensureDirectory(root, path, directoryMessage);
  const lock = join(root, path, ".writer-lock");
  try {
    mkdirSync(lock);
  } catch {
    throw new Error(
      `${label} evidence writer already active; inspect any interrupted writer before retrying`,
    );
  }
  try {
    return await run();
  } finally {
    rmdirSync(lock);
  }
};

/** The values of flags that each appear once with a value, keyed by flag, or
 * null when the arguments are anything else. */
export const pairedFlags = (args, keys) => {
  if (args.length !== keys.length * 2) return null;
  const values = {};
  for (let at = 0; at < args.length; at += 2) {
    const [flag, value] = [args[at], args[at + 1]];
    if (
      !keys.includes(flag) ||
      flag in values ||
      !value ||
      value.startsWith("--")
    )
      return null;
    values[flag] = value;
  }
  return values;
};

export const sha256Hex = (value) =>
  createHash("sha256").update(value).digest("hex");
