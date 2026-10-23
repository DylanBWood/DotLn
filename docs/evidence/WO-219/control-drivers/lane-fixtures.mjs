import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
const { laneConditionFixtures } = await import(
  pathToFileURL(
    join(resolve(process.cwd()), "scripts/test-plan-refutation.mjs"),
  )
);
await laneConditionFixtures();
