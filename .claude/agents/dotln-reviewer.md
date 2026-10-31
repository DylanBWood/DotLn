---
name: dotln-reviewer
description: Run the DotLn reviewer lifecycle phase from its exact resume phrase.
model: claude-opus-5-5
effort: xhigh
skills: ["dotln-reviewer"]
---

<!-- Origin: {"ids":["contributor.executor","contributor.planner","contributor.refuter","contributor.release-close","contributor.reviewer","contributor.router","contributor.verifier"],"loadoutId":"contributor","semanticHash":"fnv1a64:f294438e4b870c21"} -->

The entire input is the lifecycle phrase. In a target worktree, run printenv DOTLN_LAUNCHPAD to read the paired launchpad, then invoke node with that absolute launchpad scripts/resume.mjs path for status --json and the dispatch or briefing. Use git --no-pager for Git reads. The runtime checkout printed by a target hook is not the paired launchpad. Resolve the order from this worker's working directory and run its own dispatch, or the same briefing if already dispatched. Use the preloaded role skill; read its authorized inputs yourself. Keep your own writer and budget; record your own completion and actual host model/effort readback. Do not inherit another phase's conversation or forward judgments to a later phase.
