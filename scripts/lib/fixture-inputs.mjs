import { cpSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** The declared narrow file set is also the fixture's actual copy list.
 * Recursive directories and supplied doubles remain the caller's setup. */
export function copyFixtureFiles(source, destination, declaration, fixture) {
  const parsed = JSON.parse(readFileSync(join(source, declaration), "utf8"));
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  const selected = fixture
    ? rows.filter((row) => row.fixture === fixture)
    : rows;
  if (selected.length !== 1 || !Array.isArray(selected[0].files))
    throw new Error(`Select one copied-fixture declaration: ${declaration}`);
  for (const file of selected[0].files) {
    if (
      typeof file !== "string" ||
      !file ||
      file.startsWith("/") ||
      file.split("/").includes("..")
    )
      throw new Error(`Invalid copied-fixture input in ${declaration}`);
    mkdirSync(dirname(join(destination, file)), { recursive: true });
    cpSync(join(source, file), join(destination, file));
  }
}
