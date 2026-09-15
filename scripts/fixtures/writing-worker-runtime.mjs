// WO-044 probe runtime. The scratch worktree's generated-shape hook imports
// this file by an absolute file:// URL from outside that worktree, the way a
// target bundle would import a pinned DotLn runtime. It decides fixture
// refusals and records nothing itself; the hook records shapes.
export const PROBE_REFUSAL = "DOTLN_PROBE_REFUSED: fixture command";
export const PROMPT_MARKER = "PROMPT_HOOK_OBSERVED";

/** @param {Record<string, unknown>} input */
export function decide(input) {
  const event = input.hook_event_name;
  if (
    event === "PreToolUse" &&
    JSON.stringify(input.tool_input ?? {}).includes("dotln-fixture-denied")
  )
    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: PROBE_REFUSAL,
      },
    };
  if (event === "UserPromptSubmit")
    return {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: `The scratch prompt hook ran. Include ${PROMPT_MARKER} in the final response.`,
      },
    };
  return {};
}
