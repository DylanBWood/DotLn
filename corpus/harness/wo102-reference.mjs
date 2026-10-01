// Independent drift oracle for the SHIPPED formula, not an external spec.
// No kernel or corpus-generator imports. LCG uses wide integers modulo 2^32;
// exponentiation uses a multiplication loop instead of the kernel's exponentiation operator.
const MODULUS = 4294967296n;
export function referenceDraw(state) {
  const next = Number(
    (((BigInt(Math.trunc(state)) * 1664525n + 1013904223n) % MODULUS) +
      MODULUS) %
      MODULUS,
  );
  return { unit: next / Number(MODULUS), next };
}

export function referenceBackoff(cadence, env) {
  const { unit, next } = referenceDraw(env.rngState);
  let power = 1;
  for (let index = 0; index < cadence.attempt; index++) power *= cadence.factor;
  const base = cadence.initialMs * power;
  // Preserve binary64 operation order: reassociation can invent a drift alarm.
  const scaled = base * (1 + (unit * 2 - 1) * cadence.jitter);
  const rounded = Math.round(scaled);
  const nonnegative = rounded < 0 || Object.is(rounded, -0) ? 0 : rounded;
  const delay = nonnegative > cadence.maxMs ? cadence.maxMs : nonnegative;
  return {
    dueAt: env.now + delay,
    rngState: next,
    trace: `Backoff:${cadence.attempt}:${delay}`,
  };
}

function condition(ref, row) {
  const level = String(ref.params?.level ?? 0);
  let value;
  switch (ref.registryId) {
    case "truth":
      value = ref.params?.open === true;
      break;
    case "state.flag":
      value = row.state?.flags?.[level] === true;
      break;
    case "event.open":
      value =
        row.event?.type === "OpenGate" &&
        row.event.payload?.flags?.[level] === true;
      break;
    default:
      throw new Error(`Unknown predicate ${ref.registryId}@${ref.version}`);
  }
  if (ref.version !== 1 && ref.version !== 2)
    throw new Error(`Unknown predicate ${ref.registryId}@${ref.version}`);
  return ref.version === 1 ? value : !value;
}

export function referenceEvaluate(row, calls = []) {
  let cadence = row.cadence;
  // Iterative traversal is separate from the shipped recursive evaluator.
  while (cadence.kind === "Gate" || cadence.kind === "Until") {
    const truth = condition(cadence.conditionRef, row);
    calls.push(cadence.conditionRef);
    if (
      (cadence.kind === "Gate" && !truth) ||
      (cadence.kind === "Until" && truth)
    )
      return {
        dueAt: null,
        rngState: row.env.rngState,
        trace: cadence.kind === "Gate" ? "Gate:closed" : "Until:cancelled",
      };
    cadence = cadence.cadence;
  }
  const rngState = row.env.rngState;
  switch (cadence.kind) {
    case "Once":
      return { dueAt: cadence.at, rngState, trace: `Once:${cadence.at}` };
    case "After":
      return {
        dueAt: row.env.now + cadence.delayMs,
        rngState,
        trace: `After:${cadence.delayMs}`,
      };
    case "Every": {
      if (!(Number.isFinite(cadence.intervalMs) && cadence.intervalMs > 0))
        throw new Error("Every intervalMs must be positive");
      const origin = cadence.startAt === undefined ? 0 : cadence.startAt;
      const ticks = Math.floor((row.env.now - origin) / cadence.intervalMs) + 1;
      const dueAt =
        row.env.now < origin ? origin : origin + ticks * cadence.intervalMs;
      return { dueAt, rngState, trace: `Every:${cadence.intervalMs}` };
    }
    case "Backoff":
      return referenceBackoff(cadence, row.env);
    default:
      throw new Error(`Cadence ${cadence.kind} evaluation is deferred`);
  }
}

// Literal anchor: next=42*1664525+1013904223=1083814273;
// unit=1083814273/4294967296; base=100*2*2*2=800;
// scaled=800*(1+(2*unit-1)*.5)=601.8761398270726; round=602.
export const HAND_COMPUTED_BACKOFF = {
  cadence: {
    kind: "Backoff",
    initialMs: 100,
    factor: 2,
    maxMs: 100000,
    attempt: 3,
    jitter: 0.5,
  },
  state: {},
  env: { now: 100, rngState: 42 },
  expected: { dueAt: 702, rngState: 1083814273, trace: "Backoff:3:602" },
  derivation:
    "next=1083814273; unit=1083814273/4294967296; base=800; scaled=601.8761398270726; rounded delay=602; dueAt=100+602=702",
};
