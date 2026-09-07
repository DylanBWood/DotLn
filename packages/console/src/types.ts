import type {
  CompilationEnvironment,
  FeedbackUnit,
  LoadoutGraph,
} from "@dotln/compiler";
import type { AuditProjections } from "@dotln/skeleton/dist/src/audit.js";
import type { WorkerStatus } from "@dotln/skeleton/dist/src/worker-status.js";

export const VIEW_MODEL_VERSION = "uifa-board-v1" as const;
export type Availability = "available" | "unavailable";
export type Source<T> =
  | { readonly ref: string; readonly status: "available"; readonly value: T }
  | {
      readonly ref: string;
      readonly status: "unavailable";
      readonly reason: string;
    };

export interface StoreSource {
  readonly id: string;
  readonly label: string;
  readonly status: Source<WorkerStatus>;
  readonly audit: Source<AuditProjections>;
}

/** Factories are evaluated by the host; the projector receives only data. */
export interface LoadoutSource {
  readonly ref: string;
  readonly graph: LoadoutGraph;
  readonly environment: CompilationEnvironment;
}

export interface DocumentSource {
  readonly ref: string;
  readonly value: unknown;
}

/** The I/O adapter records each input, including unavailable inputs. */
export interface BoardSources {
  readonly stores?: readonly StoreSource[];
  readonly loadouts?: Source<readonly LoadoutSource[]>;
  readonly feedbackUnits?: Source<readonly FeedbackUnit[]>;
  readonly maturity?: Source<unknown>;
  readonly controlStatus?: Source<readonly unknown[]>;
  readonly controlUsage?: Source<unknown>;
  readonly controlLog?: Source<readonly DocumentSource[]>;
  readonly constellation?: Source<string>;
  readonly releases?: Source<string>;
  readonly workOrderIndex?: Source<string>;
  readonly capabilities?: Source<string>;
  readonly publication?: Source<string>;
  readonly roadmap?: Source<string>;
  readonly refutations?: Source<readonly DocumentSource[]>;
}

export type Role =
  "product-lead" | "showrunner" | "engineer" | "tester" | "devops";
export type PanelId = "actors" | "builds" | "mechanisms" | "work" | "blueprint";
export type Scalar = string | number | boolean;

/** Unknown is a missing claim in an available record; unavailable is a missing source. */
export interface Cell {
  readonly key: string;
  readonly label: string;
  readonly status: "known" | "unknown" | "unavailable";
  readonly value: Scalar | readonly Scalar[] | null;
  readonly explanation: string | null;
  readonly evidence: readonly string[];
}

export interface BoardLink {
  readonly label: string;
  /** An in-document row, section, panel, or evidence id. Never a URL or command. */
  readonly target: string;
}

export interface BoardRow {
  readonly id: string;
  readonly title: string;
  readonly cells: readonly Cell[];
  readonly links: readonly BoardLink[];
}

export interface BoardSection {
  readonly id: string;
  readonly title: string;
  readonly status: Availability;
  readonly explanation: string | null;
  readonly rows: readonly BoardRow[];
}

export interface BoardPanel {
  readonly id: PanelId;
  readonly title: string;
  readonly roles: readonly Role[];
  readonly question: string;
  readonly sections: readonly BoardSection[];
}

export interface EvidenceRecord {
  readonly id: string;
  readonly source: string;
  readonly record: string;
}

export interface SourceState {
  readonly ref: string;
  readonly status: Availability;
  readonly explanation: string | null;
}

export interface RoleAnswer {
  readonly role: Role;
  readonly question: string;
  readonly target: string;
  readonly cell: string;
  readonly source: string;
}

/** Table-shaped cells keep the contract independent of a particular UI host. */
export interface BoardView {
  readonly viewModelVersion: typeof VIEW_MODEL_VERSION;
  readonly fidelity: "lossy-read-only";
  readonly panels: readonly BoardPanel[];
  readonly roleAnswers: readonly RoleAnswer[];
  readonly sources: readonly SourceState[];
  readonly evidence: readonly EvidenceRecord[];
}
