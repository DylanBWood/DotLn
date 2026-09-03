# Everyday AI-user edition — table of contents

Source base revision: `f2a4b232e1868691398964433c7e373fca4b84bb`

Source lock:
`sha256:d70b45fd5c62b19ae140d77c00fa8aaa0da7aa3903b0bd01fcffd44f62d7cda6`

The base revision identifies where this edition's source set was selected; every
link must resolve there. The lock pins the exact current bytes of the linked
heading subtrees and is the freshness authority.

**Reader decision:** What can I safely accomplish with DotLn, what remains a
target, can it help me stay with the idea while carrying the surrounding work,
and how can I check the result? This is a plain-language, task-first, lossy
route through the [base outline](base-outline.md); mechanics stay one link away.

## Part I — Start with the work you want to trust

1. **From babysitting the agent to staying with your idea**
   - why dependable supporting work should increase your chance of remaining in
     a flow state, without weakening authority or evidence
   - sources: [Vision](../product/00-vision.md#dotln--vision),
     [The one-paragraph story](../product/00-vision.md#the-one-paragraph-story),
     [Common substrate, local doctrine](../product/00-vision.md#common-substrate-local-doctrine)
2. **What it is—and what it refuses to become**
   - local-first intent, model independence, and explicit exclusions
   - sources: [The core bet](../product/00-vision.md#the-core-bet),
     [What DotLn is not](../product/00-vision.md#what-dotln-is-not)

## Part II — See the plan before anything acts

3. **From your request to a bounded next step**
   - intent, decisions, work orders, and why a proposal is not permission
   - sources:
     [Events and decisions](../product/02-domain-model.md#events-and-decisions-the-kernel-loop),
     [Actors and episodes](../product/02-domain-model.md#actors-and-episodes-the-edge),
     [Suggestion and proposal review](../product/04-interfaces.md#suggestion-and-proposal-review)
4. **Preview, consent, and a useful “do nothing”**
   - what you can inspect, authorize, decline, or revisit
   - sources:
     [Terminal first, console equal](../product/04-interfaces.md#terminal-first-console-equal),
     [Agent projection](../product/04-interfaces.md#agent-projection-the-sparse-twin),
     [Candidate — Do Nothing](../product/05-pattern-library.md#candidate--do-nothing-active-and-support)

## Part III — Keep work alive across handoffs

5. **A workstream remembers even when a session ends**
   - durable objectives, fresh task-scoped sessions, and continuation
   - sources:
     [Actors and episodes](../product/02-domain-model.md#actors-and-episodes-the-edge),
     [Session lifecycle and resilience](../product/03-architecture.md#session-lifecycle--resilience)
6. **Steer the same work from more than one view**
   - terminal, console, semantic zoom, and labeled lossy projections
   - sources:
     [Plural UI hosts, one projection contract](../product/04-interfaces.md#plural-ui-hosts-one-projection-contract),
     [Semantic zoom](../product/04-interfaces.md#semantic-zoom)

## Part IV — Know what “done” really means

7. **Evidence before confidence**
   - what a receipt proves, what it does not, and how to inspect mechanics
   - sources:
     [Principles](../product/01-principles.md#principles-design-axioms),
     [Authority and honesty rules](../product/08-publication-compiler.md#authority-and-honesty-rules)
8. **Who acted, why, and under what authority**
   - human receipt, privacy boundary, and recovery questions
   - sources:
     [Audit audiences and decisions](../product/09-audit-resilience-privacy.md#audit-audiences-and-decisions),
     [Privacy and minimization](../product/09-audit-resilience-privacy.md#privacy-and-minimization)

## Part V — Recover, learn, and stay in control

9. **When a session stops halfway through**
   - checkpoints, continuations, restart behavior, and operator return
   - sources:
     [Persistence and recovery classes](../product/09-audit-resilience-privacy.md#persistence-and-recovery-classes),
     [Operator-presence policy](../product/03-architecture.md#operator-presence-policy)
10. **Turn a correction into a reusable guard**
    - preserved source, compiled feedback, and visible maturity
    - sources: [Feedback](../product/02-domain-model.md#feedback),
      [Founding pattern library](../product/05-pattern-library.md#founding-pattern-library)

## Part VI — Separate today from the destination

11. **What the reference build actually supports**
    - the implemented baseline, evidence strength, and known gaps
    - sources:
      [v0.2.2 — Capability table v1](../product/06-roadmap.md#v022--capability-table-v1---wo-005),
      [Architecture](../product/03-architecture.md#architecture),
      [Interfaces](../product/04-interfaces.md#interfaces--the-isomorphic-views)
12. **Where it can go without locking your work in**
    - horizons, portability, and regeneration with explicit compatibility
    - sources:
      [Three horizons, one kernel](../product/00-vision.md#three-horizons-one-kernel),
      [Portable and regenerable sharing](../product/10-ir-compatibility.md#portable-and-regenerable-sharing)

## Reader aids

Every chapter opens with a plain-language status callout, ends with “How to
check this,” and links to the exact mechanics it compresses. Code shapes, schema
detail, adapter catalogs, and migration algorithms belong in the
software-engineer edition unless they are needed to explain a user-visible
limit.
