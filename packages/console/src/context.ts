import type {
  BoardRow,
  BoardSection,
  EvidenceRecord,
  Source,
  SourceState,
} from "./types.js";
import { unavailable } from "./values.js";

/** Per-call bookkeeping only. Nothing survives projectBoard or mutates its inputs. */
export class ProjectionContext {
  readonly evidence = new Map<string, EvidenceRecord>();
  readonly sources = new Map<string, SourceState>();
  ref(source: string, record: string): readonly string[] {
    const key = JSON.stringify([source, record]);
    let entry = this.evidence.get(key);
    if (!entry) {
      entry = { id: `evidence-${this.evidence.size + 1}`, source, record };
      this.evidence.set(key, entry);
    }
    return [entry.id];
  }
  note<T>(source: Source<T>): Source<T> {
    this.sources.set(source.ref, {
      ref: source.ref,
      status: source.status,
      explanation: source.status === "available" ? null : source.reason,
    });
    return source;
  }
  section<T>(
    id: string,
    title: string,
    source: Source<T> | undefined,
    defaultRef: string,
    project: (value: T, ref: string) => readonly BoardRow[],
  ): BoardSection {
    const selected = this.note(source ?? unavailable(defaultRef));
    if (selected.status === "unavailable")
      return {
        id,
        title,
        status: "unavailable",
        explanation: selected.reason,
        rows: [],
      };
    try {
      const rows = project(selected.value, selected.ref);
      return {
        id,
        title,
        status: "available",
        explanation: rows.length === 0 ? "The source records no entries" : null,
        rows,
      };
    } catch {
      const reason = `Unsupported or invalid ${title.toLowerCase()} source`;
      this.note(unavailable(selected.ref, reason));
      return {
        id,
        title,
        status: "unavailable",
        explanation: reason,
        rows: [],
      };
    }
  }
}
