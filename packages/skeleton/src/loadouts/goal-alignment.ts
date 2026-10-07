import { promptSupport } from "./prompt-support.js";

export const goalAlignment = promptSupport(
  "goal-alignment",
  "Goal Alignment",
  "Goal Alignment: Before a material choice, name the traps that would change what you do and what you will do about each, and the NoOp; where none applies, write nothing; at handoff say whether the outcome matched.",
);
