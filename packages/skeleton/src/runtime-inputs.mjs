import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Host metadata and compiler bookkeeping are not executable runtime inputs.
 * Do not consult Git ignores: the runtime's dist and snapshot roots are ignored
 * too, and an ignore rule must not conceal changed executable bytes.
 * @param {string} name */
export const runtimeEntryName = (name) =>
  !name.startsWith(".") && !name.endsWith(".tsbuildinfo");

/** Keep operating-system paths and parser excerpts out of diagnostics.
 * @template T
 * @param {string} path
 * @param {() => T} read
 * @returns {T} */
export function runtimeRead(path, read) {
  try {
    return read();
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "unavailable";
    throw new Error(
      `Cannot read runtime input ${path} (${code}); restore the selected installation`,
    );
  }
}

/** @param {string} root @param {string} path */
export const runtimeInfo = (root, path) =>
  runtimeRead(path, () =>
    lstatSync(join(root, path), { throwIfNoEntry: false }),
  );

/** @param {string} root @param {string} path @param {boolean} [optional] */
export function runtimeDirectoryNames(root, path, optional = false) {
  const info = runtimeInfo(root, path);
  if (!info && optional) return [];
  if (info?.isSymbolicLink())
    throw new Error(
      `Runtime input must stay within a regular directory: ${path}`,
    );
  if (!info?.isDirectory())
    throw new Error(`Runtime input must be a regular directory: ${path}`);
  return runtimeRead(path, () => readdirSync(join(root, path))).sort();
}

/** Discovery never descends through an arbitrary file or a workspace alias.
 * @param {string} root */
export function packageDirectories(root) {
  return runtimeDirectoryNames(root, "packages", true)
    .filter(runtimeEntryName)
    .filter((name) => {
      const path = `packages/${name}`;
      const info = runtimeInfo(root, path);
      if (info?.isSymbolicLink())
        throw new Error(
          `Runtime package must stay within a regular directory: ${path}`,
        );
      return info?.isDirectory();
    });
}

/** Core, kit gates, bootstrap and release use the same source declaration.
 * A malformed declaration refuses instead of silently selecting another mode.
 * @param {string} root */
export function hasPackageSources(root) {
  let found = false;
  for (const name of packageDirectories(root)) {
    const path = `packages/${name}/tsconfig.json`;
    const info = runtimeInfo(root, path);
    if (!info) continue;
    if (!info.isFile())
      throw new Error(
        `Package source declaration must be a regular file: ${path}`,
      );
    found = true;
  }
  return found;
}

/** @param {string} root */
export function isKitRoot(root) {
  const info = runtimeInfo(root, "KIT-MANIFEST.json");
  if (!info) return false;
  if (!info.isFile())
    throw new Error("KIT-MANIFEST.json must be a regular file");
  return !hasPackageSources(root);
}

/** Declared workspaces own runtime inputs. A minimal snapshot without a
 * lockfile discovers only regular package directories holding a manifest.
 * @param {string} root */
export function runtimePackageNames(root) {
  const info = runtimeInfo(root, "package-lock.json");
  if (!info)
    return packageDirectories(root).filter((name) =>
      runtimeInfo(root, `packages/${name}/package.json`),
    );
  const invalid = () =>
    new Error(
      "Runtime package inventory requires a valid regular package-lock.json",
    );
  if (!info.isFile()) throw invalid();
  let lock;
  try {
    lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  } catch {
    throw invalid();
  }
  if (
    !lock?.packages ||
    typeof lock.packages !== "object" ||
    Array.isArray(lock.packages)
  )
    throw invalid();
  const names = Object.keys(lock.packages)
    .filter((path) => /^packages\/[^/]+$/u.test(path))
    .map((path) => path.slice("packages/".length));
  if (
    !names.length ||
    names.some((name) => {
      const entry = lock.packages[`packages/${name}`];
      return (
        !/^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(name) ||
        !entry ||
        typeof entry !== "object" ||
        Array.isArray(entry)
      );
    })
  )
    throw invalid();
  return names.sort();
}

/** Built workspaces ship dist; build-free packages ship src. The metadata
 * remains a file even when a package has no executable module directory.
 * @param {string} root @param {string} path */
export function runtimeModuleDirectory(root, path) {
  if (!runtimeInfo(root, `${path}/package.json`)?.isFile())
    throw new Error(
      `Runtime package metadata must be a regular file: ${path}/package.json`,
    );
  for (const name of ["dist", "src"]) {
    if (name === "src" && runtimeInfo(root, `${path}/tsconfig.json`))
      return null;
    const info = runtimeInfo(root, `${path}/${name}`);
    if (!info) continue;
    if (!info.isDirectory())
      throw new Error(
        `Runtime inventory refuses a non-regular entry: ${path}/${name}`,
      );
    return name;
  }
  return null;
}
