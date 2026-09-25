#!/usr/bin/env node
import { operatorControl } from "../packages/compiler/src/operator-control.mjs";

const [mode, flag, suppliedSession, ...extra] = process.argv.slice(2);
if (
  !["analysis", "override", "off", "status"].includes(mode) ||
  (flag && flag !== "--session") ||
  (flag && !suppliedSession) ||
  extra.length
) {
  process.stderr.write(
    "usage: node scripts/operator-control.mjs analysis|override|off|status [--session <session>]\n",
  );
  process.exitCode = 1;
} else {
  const session = suppliedSession ?? process.env.CODEX_THREAD_ID;
  if (!session) {
    process.stderr.write(
      "Pass the current session with --session; the prompt commands in Claude need no helper.\n",
    );
    process.exitCode = 1;
  } else {
    const prompt =
      mode === "off"
        ? "operator override: off"
        : mode === "override"
          ? "operator override:"
          : `${mode}:`;
    const response = await operatorControl(
      { session_id: session, prompt },
      mode === "status" ? "Status" : "UserPromptSubmit",
    );
    // WO-158: this adapter records nothing in the repository; leaving an
    // override prints the exact route, and the role's completion carries it.
    const { overrideExit, ...shown } = response ?? {
      systemMessage: "DotLn: ordinary workflow mode.",
    };
    process.stdout.write(
      JSON.stringify(
        overrideExit
          ? {
              ...shown,
              systemMessage: `${shown.systemMessage} ${overrideExit.advisory}`,
            }
          : shown,
      ) + "\n",
    );
  }
}
