import { isMainModule } from "./lib/paths.mjs";
import {
  copyReleaseTemplate,
  releaseCases,
  saveReleaseTemplate,
} from "./lib/release-fixtures.mjs";

// WO-163: the release shell's command surface over the fixture library.
if (isMainModule(import.meta.url)) {
  const [action, from, to, ...rest] = process.argv.slice(2);
  try {
    if (action === "list" && from && !to && !rest.length)
      console.log(releaseCases(from).join("\n"));
    else {
      if (!["save", "copy"].includes(action) || !from || !to || rest.length)
        throw new Error(
          "usage: release-fixtures.mjs list <repo> | save|copy <source> <destination>",
        );
      (action === "save" ? saveReleaseTemplate : copyReleaseTemplate)(from, to);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
