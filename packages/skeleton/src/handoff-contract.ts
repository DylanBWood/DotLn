/** Human decisions are durable inputs, never model completions. */
export interface HandoffQuestion {
  workOrderId: string;
  question: string;
  options: { id: string; label: string }[];
  evidenceRefs: string[];
}
export interface HandoffPacket extends HandoffQuestion {
  episodeId: string;
}
const text = (v: unknown, max: number): v is string =>
  typeof v === "string" &&
  v.trim().length > 0 &&
  v.length <= max &&
  !/[\u0000-\u001f\u007f]/u.test(v);
export function assertHandoffQuestion(
  value: unknown,
): asserts value is HandoffQuestion {
  const v = value as HandoffQuestion;
  if (
    !v ||
    typeof v !== "object" ||
    Array.isArray(v) ||
    Object.keys(v).some(
      (k) =>
        ![
          "workOrderId",
          "question",
          "options",
          "evidenceRefs",
          "episodeId",
        ].includes(k),
    ) ||
    !text(v.workOrderId, 256) ||
    !text(v.question, 2000) ||
    !Array.isArray(v.options) ||
    v.options.length < 2 ||
    v.options.length > 10 ||
    v.options.some(
      (o) =>
        !o ||
        typeof o !== "object" ||
        Object.keys(o).some((k) => !["id", "label"].includes(k)) ||
        !text(o.id, 100) ||
        !text(o.label, 1000),
    ) ||
    new Set(v.options.map((o) => o.id)).size !== v.options.length ||
    !Array.isArray(v.evidenceRefs) ||
    !v.evidenceRefs.length ||
    v.evidenceRefs.length > 100 ||
    v.evidenceRefs.some((ref) => !text(ref, 1000))
  )
    throw new Error("invalid human handoff question");
}
export function assertHandoffPacket(
  value: unknown,
): asserts value is HandoffPacket {
  assertHandoffQuestion(value);
  if (
    !("episodeId" in value) ||
    typeof value.episodeId !== "string" ||
    !/^[a-zA-Z0-9_-]+$/u.test(value.episodeId)
  )
    throw new Error("invalid human handoff episode");
}
