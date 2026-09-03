# Codex downtime runbook — adjacent evidence/corpus work (stable IDs formerly presented as a WO-10x series)

Operator runbook for the adjacent evidence/corpus track (WO-101, WO-102,
WO-103, WO-105, WO-107, WO-108). These stable identifiers were formerly
presented as a reserved series; they are not a sequence or an instruction for
mainline numbering to catch up. Synthesized 2026-09-01 from the blueprint by the
planning session that drafted the track; the individual work orders are the
scope authorities.

HOW TO RUN THESE DURING CLAUDE DOWNTIME

Authority files. All six documents are already filed under `docs/work-orders/`.
WO-104 and WO-106 were consolidated away (WO-104's salvage rides inside
WO-101; WO-106 merged into WO-105). Do not renumber the filed orders: purpose
and grouping now belong in the provisional planning map and future explicit
metadata, not numeric adjacency.

Version assignment (do this BEFORE activation). scripts/release.mjs:114-116 refuses any work-order heading without exactly one strict vX.Y.Z, and the deliberately unversioned H1s below are a forcing function: edit the H1 to carry the assigned version when you activate. Recommended: a version strictly below the latest published tag, so `release close` takes the honest no-release path ("closes vX.Y.Z, below latest release; no release tag is due"). v0.2.2/v0.2.3 stay reserved for WO-005/WO-006; give an adjacent order a tagging version only via a dated, operator-authorized retiming note.

Worktrees and the single-active slot. One writable agent per worktree, always. Default mode is in-slot: from the main checkout run `npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-<slug>.md` — it activates the order in the control plane, creates the worktree, and prints the exact cd / codex / `resume: next` handoff. The control plane tracks ONE active order, so in-slot adjacent orders serialize: activate one only when you expect Codex to reach implementation-ready (and ideally a verification) within the downtime window, so a returning mainline activation isn't blocked mid-phase. If you want true parallel grinding, run at most one order in the slot and any others out-of-slot (manual `git worktree add`, Codex pointed at the work-order file directly); every order's Isolation section requires you to name the out-of-slot closeout path at activation (numbered VER artifact, final review, PR, explicit no-release disposition) — decide that when you launch, never mid-flight. All six orders write only under corpus/, so they cannot collide with each other or the WO-005..WO-011 mainline on files; the slot is the only shared resource.

Preflight per order (while you still have network). Before activation, assign the version/close disposition and add one valid three-role `**Effort:**` declaration beside the existing `**Model:**` declaration; drafts intentionally do not inherit a global effort default. In the new worktree: provision node_modules (`npm ci`, or copy from the main checkout — the recorded Codex sandbox is network-disabled workspace-write, so nothing can be installed mid-flight); run `npm run build && npm test` and confirm green at the base commit; record the base commit SHA — several deliverables are keyed to it. For WO-107 additionally schedule a quiet machine window (close other heavy processes); WO-108 wants a mostly-quiet machine too but tolerates noise. Then hand off: cd, launch codex (it reads AGENTS.md → CLAUDE.md), give `resume: next` (in-slot) or the work-order path (out-of-slot). Every order is designed for zero mid-task judgment — if Codex asks a question, the answer is in the order or the run should stop and you triage on return.

Sequencing recommendation. WO-101 is complete and is not an activation
candidate. The remaining drafts are independent; grind in rank order when
serializing: WO-108 first (its thinness map tells you how much to trust every
later green run), then WO-103, WO-107 (overnight/quiet), WO-105, and WO-102.
WO-102/WO-103/WO-105 are noise-tolerant CPU grinds and can fill any window.
WO-108's kill matrix and WO-107's baselines are commit-keyed: after WO-008
merges kernel patches they are dated, not invalidated — a cheap re-run refreshes
them.

When each finishes, check (in this order): (1) `git status --porcelain` — changes only under corpus/ plus lifecycle files (resume.jsonl, current.md, VER artifacts); anything else is a violation, stop and triage. (2) The run transcript exists under corpus/manifests/runs/ (WO-107: plus corpus/baselines/) and its counts match the manifest — a manifest without a corroborating transcript is a claim, not evidence. (3) Read corpus/*/findings-WO-NNN.md end to end: numbered findings (kernel/spec divergence, surviving mutants, silent-divergence cut points) are the operator-attention output and feed future mainline orders — never let Codex "fix" them. (4) Spot-check determinism: rerun the order's --check regeneration command yourself. (5) In a fresh session run `resume: verify` for the numbered VER-NNN, then `resume: final review` and the ordinary PR path; after merge, `resume: release close` records the pinned no-release disposition. (6) Confirm nothing was wired into root `npm test` or package.json — these corpora stay outside the declared release-evidence chain until you deliberately promote them in a reviewed change.

Open question to carry forward (every order flags it): the corpus/ layout these orders create extends 03-architecture.md §Corpus policy's sanitized-incident tree; a later doc-lane pass must sync that section. corpus/README.md (created by whichever order lands first) holds the distinction until then.

## Identity migration note — 2026-09-01

The original “reserved WO-10x series” wording overloaded numeric identity with
family and apparent sequence, making it look as though ordinary work had ninety
orders to execute before catching up. Existing IDs remain stable because WO-101
already has completion evidence and every draft has durable references. From
this note forward, call this the **adjacent evidence/corpus track** and treat
numeric gaps as meaningless. Consult
`docs/planning/work-order-map.md` for the current human grouping, dependencies,
preflight, and recommendation; a later bounded planning/control-plane order may
standardize metadata or generate that view after the pilot has real usage.
