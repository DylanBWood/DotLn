// The models and the named workers the kit ships, as data and nothing else.
// This is the one place the kit names a model that a worker runs: a launch,
// a definition, a hook, a probe and the resident's judge each read it
// through the catalog. (A script that regenerates a dated record keeps the
// model its record measured.) An instance adds or replaces
// a model in its own `dotln.models.json` and names its workers in
// `dotln.config.json`; `worker-catalog.mjs` reads all three as one table,
// and no worker definition, hook or sentence of a role's text is tied to a
// particular model.

/** A model: the provider that launches it, its exact id, the effort it runs
 * at where a launch names none, what it is called and, for a provider whose
 * in-session launch takes a family, that family. A model's name can be
 * launched as it is. */
export const KIT_MODELS = Object.freeze({
  opus: Object.freeze({
    provider: "claude",
    id: "claude-opus-5-5",
    effort: "xhigh",
    family: "opus",
    description: "Claude Opus 5.5",
  }),
  fable: Object.freeze({
    provider: "claude",
    id: "claude-fable-5-2",
    effort: "xhigh",
    family: "fable",
    description: "Claude Fable 5.2",
  }),
  sol: Object.freeze({
    provider: "codex",
    id: "gpt-6.1-sol",
    effort: "max",
    description: "GPT-6.1 Sol",
  }),
  astra: Object.freeze({
    provider: "codex",
    id: "gpt-6-astra",
    effort: "max",
    description: "GPT-6 Astra",
  }),
  // The two models the resident's always-on judge has run since WO-157,
  // listed here so that the bind names none of its own.
  sonnet: Object.freeze({
    provider: "claude",
    id: "claude-sonnet-5",
    effort: "xhigh",
    family: "sonnet",
    description: "Claude Sonnet 5",
  }),
  luna: Object.freeze({
    provider: "codex",
    id: "gpt-6-luna",
    effort: "xhigh",
    description: "GPT-6 Luna",
  }),
});

/** A worker: a name bound, for each provider it can run on, to a model or to
 * a model at an effort of its own. `default` is what a launch runs when it
 * names nothing, `verifier` what a driven independent verification runs,
 * and `judge` what the resident's always-on judge runs. */
export const KIT_WORKERS = Object.freeze({
  default: Object.freeze({
    description: "The worker a launch runs when it names none.",
    claude: "opus",
    codex: "sol",
  }),
  advanced: Object.freeze({
    description:
      "Each provider's stronger model, for work the operator asks it for.",
    claude: "fable",
    codex: "astra",
  }),
  judge: Object.freeze({
    description: "The resident's always-on judge.",
    claude: "sonnet",
    codex: "luna",
  }),
  verifier: Object.freeze({
    description: "A driven independent verification.",
    claude: Object.freeze({ model: "opus", effort: "xhigh" }),
    codex: Object.freeze({ model: "sol", effort: "xhigh" }),
  }),
});
