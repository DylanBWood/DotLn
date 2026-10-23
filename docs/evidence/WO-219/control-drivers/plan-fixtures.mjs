import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
const { fixtures } = await import(
  pathToFileURL(
    join(resolve(process.cwd()), "scripts/test-plan-refutation.mjs"),
  )
);
await fixtures();
