// One-time evidence, not a project dependency or production simulator.
// Usage: node interaction-shapes.test.mjs <directory containing node_modules/rxjs>
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";

if (!process.argv[2])
  throw new Error(
    "Pass a scratch directory containing node_modules/rxjs 7.8.2",
  );
const requireFixture = createRequire(resolve(process.argv[2], "package.json"));
const rx = requireFixture("rxjs");
const { TestScheduler } = requireFixture("rxjs/testing");
assert.equal(requireFixture("rxjs/package.json").version, "7.8.2");
const collection = JSON.parse(
  readFileSync(new URL("./interaction-shapes.json", import.meta.url), "utf8"),
);
const companion = readFileSync(
  new URL("./interaction-shapes.md", import.meta.url),
  "utf8",
);

// Expressions come exclusively from this reviewed evidence artifact. These
// fixtures define every non-RxJS name used by each displayed expression.
function evaluate(expression, bindings) {
  const environment = { ...rx, ...bindings };
  return Function(
    ...Object.keys(environment),
    `return (${expression});`,
  )(...Object.values(environment));
}

function scenario(id, { cold, hot, expectSubscriptions }, changed = false) {
  switch (id) {
    case "SHAPE-001": {
      const grant = { scope: "build", wording: "build it" };
      return {
        bindings: {
          authority$: hot("g-----------", { g: grant }),
          work$: cold("-a---b---c-|", {
            a: grant,
            b: { scope: "build", wording: "continue the build" },
            c: { scope: "build", wording: "finish it" },
          }),
          covers: changed
            ? (authority, work) => authority.scope === work.scope
            : (authority, work) => authority.wording === work.wording,
          act$: () => cold("-a|", { a: "act" }),
          ask$: () => cold("-q|", { q: "ask" }),
        },
        values: { a: "act", q: "ask" },
        changedMarble: "--a---a---a|",
      };
    }
    case "SHAPE-002":
      return {
        bindings: {
          doubt$: hot("-d----d-------|"),
          check$: cold("-p|", { p: "pass" }),
          relief: 2,
          settled$: hot(changed ? "----s----------|" : "------------s--|"),
        },
        values: { p: "pass" },
        changedMarble: "--p-|",
      };
    case "SHAPE-003":
      return {
        bindings: {
          detail$: cold("-a-b-c|", { a: "offline", b: "streaming", c: "CLI" }),
          seed: "Fix export",
          revise: changed
            ? (_draft, detail) => `Fix export ${detail}`
            : (draft, detail) => `${draft} ${detail}`,
        },
        values: {
          a: "Fix export offline",
          b: changed ? "Fix export streaming" : "Fix export offline streaming",
          c: changed ? "Fix export CLI" : "Fix export offline streaming CLI",
        },
      };
    case "SHAPE-004":
      return {
        bindings: {
          feedback$: cold("-z-z-z-z|", { z: 0 }),
          initial: 1,
          gain: changed ? 1 : 3,
        },
        values: { a: -2, b: 4, c: -8, d: 16, z: 0 },
        changedMarble: "-z-z-z-z|",
      };
    case "SHAPE-005":
      return {
        bindings: {
          readings$: cold("-a-b-c-d|", {
            a: { category: "acknowledgement", source: "peer-1" },
            b: { category: "acknowledgement", source: "peer-2" },
            c: { category: "acknowledgement", source: "peer-3" },
            d: { category: "reinforcement", source: "author" },
          }),
          categories: new Set(
            changed
              ? ["acknowledgement", "reinforcement"]
              : ["acknowledgement"],
          ),
          prior: { category: null, confirmations: 0 },
          updateBelief: (belief, reading) => ({
            category: reading.category,
            confirmations:
              belief.category === reading.category
                ? belief.confirmations + 1
                : 1,
          }),
        },
        values: {
          a: { category: "acknowledgement", confirmations: 1 },
          b: { category: "acknowledgement", confirmations: 2 },
          c: { category: "acknowledgement", confirmations: 3 },
          d: { category: "reinforcement", confirmations: 1 },
        },
        changedMarble: "-a-b-c-d|",
      };
    case "SHAPE-006": {
      const goal = cold("------r|", { r: "goal completed" });
      expectSubscriptions(goal.subscriptions).toBe(
        changed ? "-^------!" : "-^-!",
      );
      return {
        bindings: {
          message$: cold("-g-q-----|", { g: "goal", q: "aside" }),
          respond$: (message) =>
            message === "goal" ? goal : cold("-s|", { s: "aside answered" }),
        },
        values: { s: "aside answered", r: "goal completed" },
        expressionChange: (expression) =>
          expression.replace("switchMap", "mergeMap"),
        changedMarble: "----s--r-|",
      };
    }
    case "SHAPE-007":
      return {
        bindings: {
          attempt$: cold("-#"),
          pause: 3,
          initial: { attempts: 0, outcome: null },
          rememberCostOnly: (state, outcome) => ({
            attempts: state.attempts + 1,
            outcome,
          }),
        },
        values: Object.fromEntries(
          ["a", "b", "c", "d"].map((key, i) => [
            key,
            { attempts: i + 1, outcome: "blocked" },
          ]),
        ),
        unsubscribe: "----------------!",
        expressionChange: (expression) =>
          expression.replace(", repeat({ delay: pause })", ""),
        changedMarble: "-(a|)",
      };
    case "SHAPE-008": {
      const work = cold("-------r|", { r: "result" });
      expectSubscriptions(work.subscriptions).toBe(
        changed ? "^-------!" : "^---!",
      );
      return {
        bindings: { work$: work, limit: changed ? 9 : 4 },
        values: { a: "abandoned", r: "result" },
        changedMarble: "-------r|",
      };
    }
    case "SHAPE-009":
      return {
        bindings: {
          speech$: hot("-a-b-c------d----|", {
            a: { task: "inspect" },
            b: { mode: "preserve" },
            c: { mode: "rewrite" },
            d: { task: "explain" },
          }),
          pause: changed ? 1 : 3,
          interpretTogether: (parts) => {
            const meaning = Object.assign({}, ...parts);
            return `${meaning.task ?? "unspecified"}${meaning.mode ? `:${meaning.mode}` : ""}`;
          },
        },
        values: changed
          ? {
              a: "inspect",
              b: "unspecified:preserve",
              c: "unspecified:rewrite",
              d: "explain",
            }
          : { a: "inspect:rewrite", b: "explain" },
        changedMarble: "--a-b-c------d---|",
      };
    case "SHAPE-010":
      return {
        bindings: {
          documented$: hot("-f-f-f-------|", { f: "filed" }),
          resolved$: hot("-------r-r-r-|", { r: "resolved" }),
          initial: { filed: 0, resolved: 0 },
          quota: 3,
          measure: (state, event) => ({ ...state, [event]: state[event] + 1 }),
        },
        values: { d: "done" },
        expressionChange: (expression) =>
          expression.replace("state.filed >= quota", "state.resolved >= quota"),
        changedMarble: "-----------(d|)",
      };
    case "SHAPE-011":
      return {
        bindings: {
          feedback$: cold("-p-n-p-p-n|", {
            p: { reward: 1 },
            n: { reward: -1 },
          }),
          keep: changed ? () => true : (event) => event.reward < 0,
          rate: 0.5,
        },
        values: changed
          ? { a: 0.5, b: -0.25, c: 0.375, d: 0.6875, e: -0.15625 }
          : { a: -0.5, b: -0.75 },
        changedMarble: "-a-b-c-d-e|",
      };
    case "SHAPE-012":
      return {
        bindings: {
          reaction$: cold("---r-----s-|", {
            r: changed ? { confirmedCause: "another session" } : {},
            s: changed ? { confirmedCause: "earlier question" } : {},
          }),
          local$: hot("a-----b-----|", {
            a: "local work",
            b: "local completion",
          }),
          attribute: changed
            ? (reaction) => reaction.confirmedCause ?? "unknown"
            : (_reaction, last) => last,
        },
        values: changed
          ? { a: "another session", b: "earlier question" }
          : { a: "local work", b: "local completion" },
      };
    case "SHAPE-013":
      return {
        bindings: {
          issue$: rx.of({ level: 0, resolved: false }),
          discuss$: (issue) =>
            issue.resolved
              ? rx.EMPTY
              : cold("--n|", {
                  n: {
                    level: issue.level + 1,
                    resolved: changed && issue.level === 1,
                  },
                }),
        },
        values: { a: 0, b: 1, c: 2, d: 3 },
        unsubscribe: "--------!",
        changedMarble: "a-b-c|",
      };
    case "SHAPE-014":
      return {
        bindings: {
          work$: rx.of({ open: 1, done: 0 }),
          finishOne$: (state) =>
            cold("--n|", {
              n: {
                open: state.open - 1 + (changed ? 0 : 2),
                done: state.done + 1,
              },
            }),
        },
        values: changed ? { a: 1, b: 0 } : { a: 1, b: 2, c: 3, d: 4 },
        unsubscribe: "--------!",
        changedMarble: "a-b|",
      };
    default:
      throw new Error(`No mechanical example for ${id}`);
  }
}

for (const shape of collection.shapes) {
  for (const changed of [false, true]) {
    test(`${shape.id} ${shape.title}: ${changed ? "changed condition" : "displayed mechanism"}`, () => {
      assert.ok(
        companion.includes(shape.rx),
        "companion displays the checked expression",
      );
      assert.ok(
        companion.includes(`\n${shape.marble}\n`),
        "companion displays the checked marble",
      );
      new TestScheduler(assert.deepEqual).run((helpers) => {
        const fixture = scenario(shape.id, helpers, changed);
        const expression =
          changed && fixture.expressionChange
            ? fixture.expressionChange(shape.rx)
            : shape.rx;
        helpers
          .expectObservable(
            evaluate(expression, fixture.bindings),
            fixture.unsubscribe,
          )
          .toBe(
            changed ? (fixture.changedMarble ?? shape.marble) : shape.marble,
            fixture.values,
          );
      });
    });
  }
}

test("Permission: matching scope still refuses genuinely new scope", () => {
  const shape = collection.shapes.find((item) => item.id === "SHAPE-001");
  new TestScheduler(assert.deepEqual).run((helpers) => {
    const fixture = scenario(shape.id, helpers, true);
    fixture.bindings.work$ = helpers.cold("-x|", {
      x: { scope: "publish", wording: "build it" },
    });
    helpers
      .expectObservable(evaluate(shape.rx, fixture.bindings))
      .toBe("--q|", fixture.values);
  });
});

test("Elsewhere: no causal reference remains unknown", () => {
  const shape = collection.shapes.find((item) => item.id === "SHAPE-012");
  new TestScheduler(assert.deepEqual).run((helpers) => {
    const fixture = scenario(shape.id, helpers, true);
    fixture.bindings.reaction$ = helpers.cold("---r|", { r: {} });
    helpers
      .expectObservable(evaluate(shape.rx, fixture.bindings))
      .toBe("---u|", { u: "unknown" });
  });
});
