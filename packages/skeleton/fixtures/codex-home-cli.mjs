// Synthetic Codex home behaviour (WO-159). Like the CLI at WO-111 launch, it
// trusts its working directory in $CODEX_HOME/config.toml and reads the auth
// file there; then it answers as the ordinary worker fixture, or as the
// fixture CLI DOTLN_CODEX_FIXTURE names. It never prints the auth bytes.
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const home = process.env.CODEX_HOME;
if (!home) {
  console.error("CODEX_HOME absent");
  process.exit(3);
}
if (readFileSync(join(home, "auth.json")).length === 0) process.exit(4);
appendFileSync(
  join(home, "config.toml"),
  `[projects.${JSON.stringify(process.cwd())}]\ntrust_level = "trusted"\n`,
);
await import(
  process.env.DOTLN_CODEX_FIXTURE
    ? pathToFileURL(process.env.DOTLN_CODEX_FIXTURE).href
    : "./worker-cli.mjs"
);
