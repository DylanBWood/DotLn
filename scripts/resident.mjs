#!/usr/bin/env node
// The resident's launcher on the script side. A mission check judges a work
// order, its decision history and the product vision, which are Markdown, and
// the runtime package reads no Markdown; this launcher hands the resident's
// CLI adapter the repository's document reader and the store the work-order
// cards, and then runs the same resident `dotln resident` runs. resident-bind.mjs prints it as the launch.
import { actorCatalog } from "../packages/skeleton/dist/src/actor-catalog.js";
import { cliWorkerAdapter } from "../packages/skeleton/dist/src/cli-actor.js";
import {
  parseResidentArguments,
  runResident,
} from "../packages/skeleton/dist/src/resident-launch.js";
import { findLaunchpad } from "./lib/config.mjs";
import { missionDocumentReader } from "./lib/mission-documents.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { workOrderCardSource } from "./lib/work-order-cards.mjs";

/** The default actor adapters, with a CLI adapter that reads the documents a
 * mission check judges. */
export const residentCatalog = () => ({
  ...actorCatalog,
  "cli-worker": cliWorkerAdapter({ missionDocuments: missionDocumentReader }),
});

/** What only this side can give the resident: the work-order cards, read
 * again when an order, the control log or an observation record changes.
 * Outside a launchpad there are none, and the resident says so. */
export const residentSources = () => {
  try {
    return { workOrderCards: workOrderCardSource(findLaunchpad()) };
  } catch {
    return {};
  }
};

if (isMainModule(import.meta.url)) {
  try {
    await runResident(
      parseResidentArguments(
        process.argv.slice(2),
        "node scripts/resident.mjs",
      ),
      residentCatalog(),
      residentSources(),
    );
  } catch (error) {
    // Unexpected diagnostics may carry paths; a usage line is printed as is.
    console.error(
      error instanceof Error && error.message.startsWith("usage:")
        ? error.message
        : "resident refused; inspect the store and declared environment before retrying",
    );
    process.exitCode = 1;
  }
}
