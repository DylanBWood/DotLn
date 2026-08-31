# DotLn

Personal project. Two rules that hold no matter what the code turns into.

## 1. Clean-room boundary

This repo is a personal-time rebuild of an idea the author also has work
exposure to. **No employer code, config, identifiers, or internal service
details enter this repo — ever.** Only original ideation.

Practical effect when you're working here:

- `docs/intake/` is gitignored raw material. Read it, but never copy from it
  verbatim into a committed file. Synthesize and rewrite.
- If something in intake reads like it came from a work codebase (an internal
  hostname, a proprietary API shape, a pasted source file), **stop and flag it**
  rather than incorporating it.
- Don't reach for "how the work version did it" as justification for a design
  choice. Derive it from the product docs here.
- **Terms that must not re-enter.** Intake still contains them, so synthesis
  will surface them again unless you check: the name of any commercial
  ticketing/ALM product used at work; the predecessor system's name (call it
  `v1`); and descriptions of a managed work host, corporate model gateway, or
  employer policy. Generic equivalents are already in use — "enterprise
  tracker", "ticket artifact", "constrained managed host". This repo is
  public.

## 2. The pipeline

```
docs/intake/    raw dumps (local only)
      |
      v  synthesis
docs/product/   durable specs (committed)
      |
      v  planning        (planning model)
implementation plan + work orders
      |
      v  execution       (executor models)
code
```

Model assignments are per work order (Principle 8), never hardcoded here —
today's planners and executors rotate; the docs survive them.

Different models run different stages, so **the docs are the shared memory.**
Anything decided in a chat that matters past that chat gets written into
`docs/product/` or it effectively didn't happen. When you finish a piece of
work that changes a decision, update the doc in the same pass.

Codex reads this file via the `AGENTS.md` symlink — same rules apply.

## 3. Start here

The blueprint is the shared memory. Cold-start read order:
`docs/product/07-execution-guide.md` → your work order in `docs/work-orders/`
→ only the blueprint sections it cites. Settled questions live in
`docs/decisions/` and the Resolutions section of
`docs/lineage/idea-ledger.md` — do not relitigate them. Keep this file tiny.
