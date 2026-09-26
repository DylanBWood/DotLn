import { lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ConsoleConnection } from "./console-client.js";

const ownerOnly = (path: string, directory: boolean) => {
  const stat = lstatSync(path);
  if (
    (directory ? !stat.isDirectory() : !stat.isFile()) ||
    (stat.mode & 0o077) !== 0 ||
    (process.getuid !== undefined && stat.uid !== process.getuid())
  )
    throw new Error("console connection is not owner-only");
};

/** The text host reads the owner-only descriptor; browser shells receive the
 * same connection from their local host rather than reading filesystem data. */
export function readConsoleConnection(store: string): ConsoleConnection {
  const directory = join(store, "console");
  const path = join(directory, "console-loopback-v1.json");
  try {
    lstatSync(path);
  } catch {
    throw new Error("no running resident console in this store");
  }
  ownerOnly(directory, true);
  ownerOnly(path, false);
  const value: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid console connection");
  const connection = value as Record<string, unknown>;
  if (
    connection.version !== 1 ||
    connection.host !== "127.0.0.1" ||
    !Number.isSafeInteger(connection.port) ||
    typeof connection.token !== "string" ||
    !/^[a-f0-9]{64}$/u.test(connection.token)
  )
    throw new Error("invalid console connection");
  return connection as ConsoleConnection;
}
