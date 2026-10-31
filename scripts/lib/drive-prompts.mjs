import { join } from "node:path";
import { drivenHelperScripts } from "../../packages/skeleton/dist/src/harness-command.js";
import { docPath } from "./config.mjs";
import { shellQuote } from "./git.mjs";

// Everything a phase worker is told beyond its generated role skill. Someone
// editing that text in contributor.ts finds the rest here, and each host's
// launch reads the same sentences.

const PUBLIC_RESEARCH_NOTE =
  "\nPublic documentation research is available through the host's web tools, the ctx7 CLI (resolve with npx ctx7@latest library before docs), and public GitHub reads through gh or unauthenticated curl GETs to api.github.com/search/repositories?q=...&per_page=1 and api.github.com/repos/owner/repo (use exactly curl --disable --fail --silent --show-error --max-time 60 followed by the quoted URL). npm uses this order's ignored cache; no user cache write is needed. Use only task-relevant public sources within this role's authority. These adapters may be unavailable or quota-limited; report the observed limitation and use another declared source. Network access grants no publication or account-setting authority. The launcher does not inherit unrelated MCP connections.\n";
const launchpadHelpersNote = (launchpad) =>
  `\nRun launchpad helpers directly from your existing cwd through these qualified scripts: ${[...drivenHelperScripts, "release", "worktree", "harness", "refute-plan"].map((name) => `node ${shellQuote(join(launchpad, `scripts/${name}.mjs`))}`).join("; ")}. Retain each helper's normal arguments (for example work-orders index, adjacent-work list, release prepare --local, worktree integrate WO-NNN, refute-plan followups --sync for npm run plan -- followups --sync). The sync helper includes launchpad formatting. In a target worktree, use these helpers for launchpad duties; npm run would select the target's own package.json. Use the briefing's qualified target and document gates.\n`;

/** The notes appended to a phase or review worker's generated definition. */
export const phaseWorkerNotes = (launchpad) =>
  PUBLIC_RESEARCH_NOTE + launchpadHelpersNote(launchpad);

// The launch-time difference between a router and a phase worker, computed once.
export function nativeProfile({
  launchpad,
  role,
  phrase,
  cwd,
  worker,
  definition,
}) {
  const router = role === "router";
  const routerCommand = router
    ? `node scripts/drive.mjs ${phrase.slice("drive: ".length)}`
    : null;
  const lifecycle = router
    ? ""
    : `For every lifecycle command, use node ${shellQuote(join(launchpad, "scripts/resume.mjs"))} followed by the action and arguments, including when the shared skill spells npm run resume. Run it as its own direct command so its refusal can be attributed to this launchpad. Preserve already-recorded dispatches; read briefing instead of replaying them.\n`;
  const entry = router
    ? `Begin the router record without a writer by running node ${shellQuote(join(launchpad, "scripts/harness.mjs"))} begin "$CODEX_THREAD_ID" router ${phrase.slice("drive: ".length)}. Then use the router skill.\n`
    : `Before any phase work, run node ${shellQuote(join(launchpad, "scripts/drive.mjs"))} worker-entry. It begins this native session and reserves only this order's worktrees; on refusal stop.\nState-changing lifecycle commands write Git metadata, including completion's intent-to-add check. After the role's required command and source inspection, request the host's normal one-invocation outside-sandbox approval for each exact authorized lifecycle command or other Git-metadata write. Do not persist an allow rule. If the host denies the request, stop without retrying or using an alternative command. Operations needing no added permission retain the native sandbox.\n`;
  const selection = `The launcher supplied model ${definition.model} and reasoning effort ${definition.effort}. These are selected values, not effective readback; preserve them with the role's supplied-value attestation when native readback is unavailable.\n`;
  const tools = `Read,Write,Edit,Bash,Grep,Glob,Agent,TaskOutput,Skill${router ? "" : ",WebSearch,WebFetch"}`;
  return {
    router,
    routerCommand,
    tools,
    webSearch: router ? "disabled" : "live",
    nativeLauncher: router
      ? "generated-skill-command-subject-to-host-permissions"
      : "own-host-sandbox",
    env: router
      ? {}
      : {
          npm_config_cache: docPath(
            launchpad,
            "control",
            "local/native-tools/npm-cache",
          ),
          NODE_USE_ENV_PROXY: "1",
        },
    codexInstructions: entry + selection + lifecycle + definition.prompt,
    claudeAppendix: router
      ? `The generated router skill's literal driver command in this cwd is ${routerCommand}. This native router's session identifier is ${worker}; its exact usage command is node scripts/harness.mjs usage ${shellQuote(worker)}. Follow that skill's host-permission request and refusal rules.`
      : cwd !== launchpad
        ? `This registered target has tool hooks, but no UserPromptSubmit lifecycle dispatch. Its bounded shell adapter requires separate commands. Your first Bash call must be exactly pwd -P; your second exactly git rev-parse --show-toplevel. Do not combine startup commands, environment reads, status, or file discovery into one shell line. Then use the qualified status command below. The launchpad is ${launchpad}. Use node ${shellQuote(join(launchpad, "scripts/resume.mjs"))} status --json to read the selected phase, then perform the received lifecycle phrase's dispatch through that same qualified script. If already dispatched, read briefing instead. The target-order clauses take precedence over the generic statement that Claude hooks dispatch automatically. Keep DOTLN_LAUNCHPAD from the environment and run each qualified command directly from this target cwd.`
        : lifecycle,
  };
}
