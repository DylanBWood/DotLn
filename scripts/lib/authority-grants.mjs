import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compileLoadout, normalizeAuthorityGrants } from "@dotln/compiler";
import { containedRegularFile } from "./paths.mjs";

// Instance authority data lives beside the source loadouts, outside package src.
// The caller owns root; neither registry path is read from submitted graph text.
export const COMMITTED_AUTHORITY_GRANTS =
  "packages/skeleton/loadouts/grants.json";
export const LOCAL_AUTHORITY_GRANTS =
  "docs/control/local/authority-grants.json";

export function readAuthorityGrantRegistry(root) {
  const read = (name, optional, origins) => {
    const path = resolve(root, name);
    if (optional && !existsSync(path)) return [];
    if (!containedRegularFile(path, root))
      throw new Error(
        `authority registry must be a contained regular file: ${name}`,
      );
    const grants = normalizeAuthorityGrants(
      JSON.parse(readFileSync(path, "utf8")),
    );
    for (const grant of grants)
      if (!origins.includes(grant.grantedBy))
        throw new Error(
          `authority registry ${name} cannot admit grantedBy ${grant.grantedBy}`,
        );
    return grants;
  };
  return normalizeAuthorityGrants([
    ...read(COMMITTED_AUTHORITY_GRANTS, false, [
      "operator",
      "registered-repository",
    ]),
    ...read(LOCAL_AUTHORITY_GRANTS, true, ["host-policy"]),
  ]);
}

/** Host adapter: registry selection is independent of the submitted graph. */
export function compileRegisteredLoadout(source, environment, root) {
  return compileLoadout(source, {
    ...environment,
    authorityGrantRegistry: readAuthorityGrantRegistry(root),
  });
}
