import { canonicalStringify, compareText, fnv1a64 } from "./normalize.js";

/*
 * SourceBundle v1 (WO-060): the immutable input of the `SourceAdapter` port
 * (product 03 §Ports), one tracked-work artifact's sections, discussion, image
 * references and revisions, positively decoded.
 *
 * A span `{ sectionId | entryId, start, end }` is a half-open range of UTF-8
 * byte offsets into that section's or entry's `text`, on code point
 * boundaries. An author is a role label, never an identity. An image is a
 * reference by content hash; the bundle never carries image bytes.
 *
 * The screen is a declared filter, not a detector of every secret: it refuses
 * the shapes in SOURCE_SECRET_SHAPES and each SOURCE_URL_FORMS reference whose
 * host is not on the allowlist supplied at decode time, and any other string
 * passes, such as an unprefixed 40-hex token, a JWT without the Bearer word or
 * a password in the userinfo of a URL whose host is allowed.
 */

export const SOURCE_BUNDLE_HASH_DOMAIN = "dotln:source-bundle:v1";
export const SOURCE_ROLES = ["reporter", "reviewer", "automation"] as const;
export type SourceRole = (typeof SOURCE_ROLES)[number];

export type SourceSpan =
  | { readonly sectionId: string; readonly start: number; readonly end: number }
  | { readonly entryId: string; readonly start: number; readonly end: number };
export interface SourceSection {
  readonly id: string;
  readonly heading?: string;
  readonly text: string;
  /** The whole section: its own id, from 0 to its text's byte length. */
  readonly span: SourceSpan;
}
export interface SourceDiscussionEntry {
  readonly id: string;
  readonly author: SourceRole;
  readonly text: string;
  /** The whole entry: its own id, from 0 to its text's byte length. */
  readonly span: SourceSpan;
  /** UTC, `YYYY-MM-DDTHH:MM:SS[.fraction]Z`; never before the previous entry. */
  readonly createdAt: string;
}
export interface SourceImage {
  readonly id: string;
  /** `sha256:` and 64 lowercase hex digits of the image bytes. */
  readonly hash: string;
  readonly altText?: string;
  readonly referencedBy: SourceSpan;
}
export interface SourceRevision {
  readonly revisionId: string;
  readonly changedSpans: readonly SourceSpan[];
}
export interface SourceBundle {
  readonly bundleId: string;
  readonly sourceKind: string;
  readonly revisionId: string;
  /** Document order. */
  readonly sections: readonly SourceSection[];
  /** Thread order. */
  readonly discussion: readonly SourceDiscussionEntry[];
  /** Sorted by id when decoded; order carries no meaning. */
  readonly images: readonly SourceImage[];
  /** History order. */
  readonly revisions: readonly SourceRevision[];
}

export interface SourceSecretShape {
  readonly shapeId: string;
  readonly description: string;
  /** A RegExp source, matched with `flags` and "g". */
  readonly pattern: string;
  readonly flags: string;
  readonly reference: string;
}
export interface SourceUrlForm {
  readonly formId: "scheme-authority" | "www-autolink";
  readonly description: string;
  readonly reference: string;
}
export interface SourceBundleFinding {
  readonly kind: "secret-shape" | "url-form";
  /** The matched shape's `shapeId` or form's `formId`; never the text. */
  readonly id: string;
  /** The string holding the match in the value screened, e.g. `$.sections[0].text`. */
  readonly path: string;
  /** UTF-8 byte offsets of the match within that string. */
  readonly start: number;
  readonly end: number;
  /** Present when the string is a section's or entry's `text`. */
  readonly span?: SourceSpan;
}
export interface SourceBundleDecodeOptions {
  /** Hosts a declared URL form may name; empty refuses every URL form. */
  readonly allowedHosts: readonly string[];
}
export type SourceBundleDecodeResult =
  | { readonly ok: true; readonly bundle: SourceBundle; readonly hash: string }
  | {
      readonly ok: false;
      readonly refusal: "malformed";
      /** Never carries input text beyond a field name of up to 32 letters or digits. */
      readonly path: string;
      readonly reason: string;
    }
  | {
      readonly ok: false;
      readonly refusal: "screened";
      readonly findings: readonly SourceBundleFinding[];
    };

const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

const GITHUB_FORMATS =
  "GitHub Docs, About authentication to GitHub, §GitHub's token formats";
const GITHUB_2021 =
  "GitHub Blog, Behind GitHub's new authentication token formats (2021-04-05): base62, 30 random characters and a 6-character checksum";
const githubToken = (
  shapeId: string,
  prefix: string,
  kind: string,
): SourceSecretShape => ({
  shapeId,
  description: `A GitHub ${kind}: ${prefix} and at least 36 base62 characters.`,
  pattern: `${prefix}[A-Za-z0-9]{36,}`,
  flags: "u",
  reference: `${GITHUB_FORMATS}; ${GITHUB_2021}`,
});

/** The screen's declared secret shapes. A match refuses with its location. */
export const SOURCE_SECRET_SHAPES = freeze<readonly SourceSecretShape[]>([
  {
    shapeId: "private-key-block",
    description:
      "A PEM or OpenPGP armor header whose label ends in PRIVATE KEY, in any case, such as -----BEGIN RSA PRIVATE KEY----- or -----BEGIN PGP PRIVATE KEY BLOCK-----.",
    pattern: String.raw`-----BEGIN (?:[!-,.-~]+[ -])*PRIVATE KEY(?: BLOCK)?-----`,
    flags: "iu",
    reference:
      "RFC 7468 §2 and §3 (encapsulation boundary and label); RFC 4880 §6.2 (armor header line)",
  },
  {
    shapeId: "bearer-credential",
    description:
      "The word Bearer, in any case, then spaces or tabs and a token of at least twenty b64token characters before any = padding.",
    pattern: String.raw`\bbearer[ \t]+[A-Za-z0-9._~+/-]{20,}=*`,
    flags: "iu",
    reference:
      "RFC 6750 §2.1 (b64token and the Bearer credentials); RFC 9110 §11.1 (the scheme name is case-insensitive)",
  },
  githubToken(
    "github-personal-access-token",
    "ghp_",
    "personal access token (classic)",
  ),
  {
    shapeId: "github-fine-grained-personal-access-token",
    description:
      "A GitHub fine-grained personal access token: github_pat_ and at least one token character. GitHub documents no length for this type.",
    pattern: "github_pat_[A-Za-z0-9_]+",
    flags: "u",
    reference: GITHUB_FORMATS,
  },
  githubToken("github-oauth-access-token", "gho_", "OAuth access token"),
  githubToken(
    "github-user-to-server-token",
    "ghu_",
    "user-to-server token (a user access token for a GitHub App)",
  ),
  {
    shapeId: "github-server-to-server-token",
    description:
      "A GitHub server-to-server token (an installation access token for a GitHub App), in the current and the stateless ghs_APPID_JWT format.",
    pattern: String.raw`ghs_[A-Za-z0-9\.\-_]{36,}`,
    flags: "u",
    reference: `${GITHUB_FORMATS}; GitHub Changelog, GitHub App installation tokens: Per-request override header (2026-05-15, regex updated 2026-05-26), the recommended regex`,
  },
  githubToken(
    "github-refresh-token",
    "ghr_",
    "refresh token (for a GitHub App)",
  ),
]);

/** The reference forms the screen reads as a URL; other text is text. */
export const SOURCE_URL_FORMS = freeze<readonly SourceUrlForm[]>([
  {
    formId: "scheme-authority",
    description:
      "A scheme (letters, digits, +, - and . from its first letter), then :// and a non-empty authority. Further / or \\ after :// are skipped. The authority ends at / \\ ? # < > ^ | whitespace or a control character, less trailing . , ; : ! ' \" ` * _ ~ ) ] }; its host follows the last @ and precedes a :port.",
    reference:
      "RFC 3986 §3 and §3.2; WHATWG URL Standard, special authority ignore slashes state",
  },
  {
    formId: "www-autolink",
    description:
      "www. in any case, then a letter, digit, _ or -, at the start of a string or after whitespace, *, _, ~ or (, and outside an authority already read. Its host is read as an authority from the first w.",
    reference:
      "GitHub Flavored Markdown Spec §6.9, Autolinks (extension): extended www autolink",
  },
]);

const shapeMatchers = SOURCE_SECRET_SHAPES.map((shape) => ({
  shape,
  expression: new RegExp(shape.pattern, `${shape.flags}g`),
}));

// ------------------------------------------------------------ positive decoder

class Malformed extends Error {
  constructor(
    readonly path: string,
    readonly reason: string,
  ) {
    super(`source bundle: ${path}: ${reason}`);
  }
}
const refuse = (path: string, reason: string): never => {
  throw new Malformed(path, reason);
};
const fieldPath = (path: string, key: string) =>
  /^[A-Za-z][A-Za-z0-9]{0,31}$/u.test(key) ? `${path}.${key}` : `${path}[*]`;
type Fields = Readonly<Record<string, unknown>>;
const record = (
  value: unknown,
  path: string,
  required: readonly string[],
  optional: readonly string[] = [],
): Fields => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return refuse(path, "expected an object");
  for (const key of Object.keys(value))
    if (!required.includes(key) && !optional.includes(key))
      refuse(fieldPath(path, key), "unexpected field");
  for (const key of required)
    if (!Object.hasOwn(value, key)) refuse(`${path}.${key}`, "missing field");
  return value as Fields;
};
const list = (value: unknown, path: string): readonly unknown[] =>
  Array.isArray(value) ? value : refuse(path, "expected an array");

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const SOURCE_KIND = /^(?=.{1,64}$)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;
const IMAGE_HASH = /^sha256:[0-9a-f]{64}$/u;
const TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?Z$/u;
const LONE_SURROGATE =
  /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

const identifier = (value: unknown, path: string): string =>
  typeof value === "string" && IDENTIFIER.test(value)
    ? value
    : refuse(
        path,
        "expected an identifier of 1 to 128 letters, digits, ., _, : or -",
      );
/** Multi-line text: tab, line feed and carriage return are its only controls. */
const text = (value: unknown, path: string): string => {
  if (typeof value !== "string") return refuse(path, "expected a string");
  if (LONE_SURROGATE.test(value)) refuse(path, "expected well-formed Unicode");
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value))
    refuse(path, "control character");
  return value;
};
/** One non-blank line without control characters. */
const line = (value: unknown, path: string): string => {
  const content = text(value, path);
  if (content.includes("\t")) refuse(path, "control character");
  if (/[\n\r\u2028\u2029]/u.test(content)) refuse(path, "expected one line");
  if (!content.trim()) refuse(path, "expected a non-blank line");
  return content;
};
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/** A comparable key for a valid UTC timestamp. */
const timestamp = (value: unknown, path: string): string => {
  const parts = typeof value === "string" ? TIMESTAMP.exec(value) : null;
  if (!parts) return refuse(path, "expected a UTC timestamp");
  const [year, month, day, hour, minute, second] = parts
    .slice(1, 7)
    .map(Number) as [number, number, number, number, number, number];
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = month === 2 && leap ? 29 : (DAYS[month - 1] ?? 0);
  if (day < 1 || day > days || hour > 23 || minute > 59 || second > 59)
    refuse(path, "expected a UTC timestamp");
  return `${parts.slice(1, 7).join("")}${(parts[7] ?? "").padEnd(9, "0")}`;
};

const encoder = new TextEncoder();
type Target = {
  readonly key: "sectionId" | "entryId";
  readonly bytes: Uint8Array;
};
const boundary = (bytes: Uint8Array, offset: number) =>
  offset === bytes.length || ((bytes[offset] ?? 0) & 0xc0) !== 0x80;
const span = (
  value: unknown,
  path: string,
  targets: ReadonlyMap<string, Target>,
  own?: { readonly id: string; readonly target: Target },
): SourceSpan => {
  const fields = record(
    value,
    path,
    ["start", "end"],
    ["sectionId", "entryId"],
  );
  const keys = (["sectionId", "entryId"] as const).filter((key) =>
    Object.hasOwn(fields, key),
  );
  if (keys.length !== 1)
    return refuse(path, "expected exactly one of sectionId or entryId");
  const key = keys[0]!;
  const id = identifier(fields[key], `${path}.${key}`);
  if (own && (key !== own.target.key || id !== own.id))
    return refuse(`${path}.${key}`, "expected its own id");
  const target = own ? own.target : targets.get(id);
  if (target?.key !== key)
    return refuse(
      `${path}.${key}`,
      `no ${key === "sectionId" ? "section" : "entry"} has this id`,
    );
  const offset = (field: "start" | "end") => {
    const content = fields[field];
    if (
      typeof content !== "number" ||
      !Number.isSafeInteger(content) ||
      content < 0
    )
      return refuse(`${path}.${field}`, "expected a non-negative integer");
    if (content > target.bytes.length)
      return refuse(`${path}.${field}`, "beyond the end of the text");
    if (!boundary(target.bytes, content))
      return refuse(`${path}.${field}`, "inside a UTF-8 character");
    return content;
  };
  const start = offset("start");
  const end = offset("end");
  if (end < start) refuse(`${path}.end`, "before start");
  return key === "sectionId"
    ? { sectionId: id, start, end }
    : { entryId: id, start, end };
};
/** A section's or entry's own span covers exactly its whole text. */
const ownSpan = (value: unknown, path: string, id: string, target: Target) => {
  const decoded = span(value, path, new Map(), { id, target });
  if (decoded.start !== 0) refuse(`${path}.start`, "expected the whole text");
  if (decoded.end !== target.bytes.length)
    refuse(`${path}.end`, "expected the whole text");
  return decoded;
};

const spanKey = (value: SourceSpan) =>
  "sectionId" in value
    ? ["section", value.sectionId, value.start, value.end]
    : ["entry", value.entryId, value.start, value.end];
const compareSpans = (left: SourceSpan, right: SourceSpan) => {
  const [a, b] = [spanKey(left), spanKey(right)];
  return (
    compareText(a[0] as string, b[0] as string) ||
    compareText(a[1] as string, b[1] as string) ||
    (a[2] as number) - (b[2] as number) ||
    (a[3] as number) - (b[3] as number)
  );
};
/** Set-like collections in canonical order; everything else keeps its order. */
const canonicalOrder = (bundle: SourceBundle): SourceBundle => ({
  ...bundle,
  images: [...bundle.images].sort((a, b) => compareText(a.id, b.id)),
  revisions: bundle.revisions.map((revision) => ({
    ...revision,
    changedSpans: [...revision.changedSpans].sort(compareSpans),
  })),
});

function decodeStructure(value: unknown): SourceBundle {
  const root = record(value, "$", [
    "bundleId",
    "sourceKind",
    "revisionId",
    "sections",
    "discussion",
    "images",
    "revisions",
  ]);
  const bundleId = identifier(root["bundleId"], "$.bundleId");
  const sourceKind = root["sourceKind"];
  if (typeof sourceKind !== "string" || !SOURCE_KIND.test(sourceKind))
    refuse(
      "$.sourceKind",
      "expected a lowercase kebab-case label of at most 64 characters",
    );
  const revisionId = identifier(root["revisionId"], "$.revisionId");
  const targets = new Map<string, Target>();
  const itemIds = new Set<string>();
  const newItemId = (content: unknown, path: string) => {
    const id = identifier(content, path);
    if (itemIds.has(id)) refuse(path, "duplicate id");
    itemIds.add(id);
    return id;
  };

  const sections = list(root["sections"], "$.sections").map(
    (entry, index): SourceSection => {
      const path = `$.sections[${index}]`;
      const fields = record(entry, path, ["id", "text", "span"], ["heading"]);
      const id = newItemId(fields["id"], `${path}.id`);
      const heading =
        fields["heading"] === undefined
          ? undefined
          : line(fields["heading"], `${path}.heading`);
      const body = text(fields["text"], `${path}.text`);
      const target: Target = { key: "sectionId", bytes: encoder.encode(body) };
      const own = ownSpan(fields["span"], `${path}.span`, id, target);
      targets.set(id, target);
      return heading === undefined
        ? { id, text: body, span: own }
        : { id, heading, text: body, span: own };
    },
  );
  let previous = "";
  const discussion = list(root["discussion"], "$.discussion").map(
    (entry, index): SourceDiscussionEntry => {
      const path = `$.discussion[${index}]`;
      const fields = record(entry, path, [
        "id",
        "author",
        "text",
        "span",
        "createdAt",
      ]);
      const id = newItemId(fields["id"], `${path}.id`);
      const author = fields["author"];
      if (!SOURCE_ROLES.includes(author as SourceRole))
        refuse(
          `${path}.author`,
          "expected a role label: reporter, reviewer or automation",
        );
      const body = text(fields["text"], `${path}.text`);
      const target: Target = { key: "entryId", bytes: encoder.encode(body) };
      const own = ownSpan(fields["span"], `${path}.span`, id, target);
      const createdAt = fields["createdAt"] as string;
      const order = timestamp(createdAt, `${path}.createdAt`);
      if (order < previous)
        refuse(`${path}.createdAt`, "before the previous entry");
      previous = order;
      targets.set(id, target);
      return {
        id,
        author: author as SourceRole,
        text: body,
        span: own,
        createdAt,
      };
    },
  );
  const images = list(root["images"], "$.images").map(
    (entry, index): SourceImage => {
      const path = `$.images[${index}]`;
      const fields = record(
        entry,
        path,
        ["id", "hash", "referencedBy"],
        ["altText"],
      );
      const id = newItemId(fields["id"], `${path}.id`);
      const hash = fields["hash"];
      if (typeof hash !== "string" || !IMAGE_HASH.test(hash))
        refuse(`${path}.hash`, "expected sha256: and 64 lowercase hex digits");
      const altText =
        fields["altText"] === undefined
          ? undefined
          : line(fields["altText"], `${path}.altText`);
      const referencedBy = span(
        fields["referencedBy"],
        `${path}.referencedBy`,
        targets,
      );
      if (referencedBy.start === referencedBy.end)
        refuse(`${path}.referencedBy.end`, "expected a non-empty span");
      return altText === undefined
        ? { id, hash: hash as string, referencedBy }
        : { id, hash: hash as string, altText, referencedBy };
    },
  );
  const revisionIds = new Set<string>();
  const revisions = list(root["revisions"], "$.revisions").map(
    (entry, index): SourceRevision => {
      const path = `$.revisions[${index}]`;
      const fields = record(entry, path, ["revisionId", "changedSpans"]);
      const id = identifier(fields["revisionId"], `${path}.revisionId`);
      if (revisionIds.has(id))
        refuse(`${path}.revisionId`, "duplicate revision id");
      revisionIds.add(id);
      const seen = new Set<string>();
      const changedSpans = list(
        fields["changedSpans"],
        `${path}.changedSpans`,
      ).map((content, spanIndex) => {
        const spanPath = `${path}.changedSpans[${spanIndex}]`;
        const decoded = span(content, spanPath, targets);
        const key = JSON.stringify(spanKey(decoded));
        if (seen.has(key)) refuse(spanPath, "duplicate span");
        seen.add(key);
        return decoded;
      });
      return { revisionId: id, changedSpans };
    },
  );
  // Input order, so a finding's path names the field the caller sent.
  return {
    bundleId,
    sourceKind: sourceKind as string,
    revisionId,
    sections,
    discussion,
    images,
    revisions,
  };
}

// ---------------------------------------------------------------------- screen

const HOSTNAME =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/u;
const lowerAscii = (value: string) =>
  value.replace(/[A-Z]/gu, (letter) => letter.toLowerCase());
/** Validates the caller's allowlist; a caller error throws. */
const allowlist = (hosts: readonly string[]): ReadonlySet<string> => {
  if (!Array.isArray(hosts))
    throw new Error("source bundle screen: allowedHosts must be an array");
  return new Set(
    hosts.map((host, index) => {
      const name = typeof host === "string" ? lowerAscii(host) : "";
      if (!HOSTNAME.test(name))
        throw new Error(
          `source bundle screen: allowedHosts[${index}] is not a multi-label DNS host name with a non-numeric top-level label`,
        );
      return name;
    }),
  );
};

const AUTHORITY_END = /[/\\?#<>^|\s\u0000-\u001f\u007f]/u;
const TRAILING = new Set([
  ".",
  ",",
  ";",
  ":",
  "!",
  "'",
  '"',
  "`",
  "*",
  "_",
  "~",
  ")",
  "]",
  "}",
]);
/** The authority from `from`, less trailing punctuation, and its host. */
const readAuthority = (value: string, from: number) => {
  let end = from;
  while (end < value.length && !AUTHORITY_END.test(value[end]!)) end++;
  while (end > from && TRAILING.has(value[end - 1]!)) end--;
  const authority = value.slice(from, end);
  const hostPort = authority.slice(authority.lastIndexOf("@") + 1);
  const port = /:\d*$/u.exec(hostPort);
  return {
    end,
    host: lowerAscii(port ? hostPort.slice(0, port.index) : hostPort),
  };
};
type Match = {
  readonly kind: SourceBundleFinding["kind"];
  readonly id: string;
  readonly start: number;
  readonly end: number;
};
const urlMatches = (value: string, allowed: ReadonlySet<string>): Match[] => {
  const found: Match[] = [];
  const read: Array<readonly [number, number]> = [];
  for (
    let at = value.indexOf("://");
    at !== -1;
    at = value.indexOf("://", at + 3)
  ) {
    let start = at;
    while (start > 0 && /[A-Za-z0-9+.-]/u.test(value[start - 1]!)) start--;
    while (start < at && !/[A-Za-z]/u.test(value[start]!)) start++;
    if (start === at) continue;
    let from = at + 3;
    while (value[from] === "/" || value[from] === "\\") from++;
    const authority = readAuthority(value, from);
    if (authority.end === from) continue;
    read.push([from, authority.end]);
    if (!allowed.has(authority.host))
      found.push({
        kind: "url-form",
        id: "scheme-authority",
        start,
        end: authority.end,
      });
  }
  // Both lists ascend, so one pointer finds an enclosing scheme authority.
  let covered = 0;
  let next = 0;
  for (const match of value.matchAll(/www\./giu)) {
    const start = match.index;
    if (start > 0 && !/[\s*_~(]/u.test(value[start - 1]!)) continue;
    if (!/[A-Za-z0-9_-]/u.test(value[start + 4] ?? "")) continue;
    while (next < read.length && read[next]![1] <= start) next++;
    if (start < covered || (next < read.length && read[next]![0] <= start))
      continue;
    const authority = readAuthority(value, start);
    covered = authority.end;
    if (!allowed.has(authority.host))
      found.push({
        kind: "url-form",
        id: "www-autolink",
        start,
        end: authority.end,
      });
  }
  return found;
};
/** UTF-8 byte offset of every UTF-16 index of a well-formed string. */
const byteOffsets = (value: string) => {
  const offsets = new Uint32Array(value.length + 1);
  let bytes = 0;
  for (let index = 0; index < value.length; index++) {
    offsets[index] = bytes;
    const unit = value.charCodeAt(index);
    bytes +=
      unit < 0x80
        ? 1
        : unit < 0x800
          ? 2
          : unit >= 0xd800 && unit < 0xdc00
            ? 4
            : unit >= 0xdc00 && unit < 0xe000
              ? 0
              : 3;
  }
  offsets[value.length] = bytes;
  return offsets;
};
const screenString = (
  value: string,
  path: string,
  allowed: ReadonlySet<string>,
  owner?: { readonly key: "sectionId" | "entryId"; readonly id: string },
): SourceBundleFinding[] => {
  const matches: Match[] = urlMatches(value, allowed);
  for (const { shape, expression } of shapeMatchers)
    for (const match of value.matchAll(expression))
      matches.push({
        kind: "secret-shape",
        id: shape.shapeId,
        start: match.index,
        end: match.index + match[0].length,
      });
  if (!matches.length) return [];
  const offsets = byteOffsets(value);
  return matches
    .map((match): SourceBundleFinding => {
      const start = offsets[match.start]!;
      const end = offsets[match.end]!;
      const location = { kind: match.kind, id: match.id, path, start, end };
      return owner === undefined
        ? location
        : {
            ...location,
            span:
              owner.key === "sectionId"
                ? { sectionId: owner.id, start, end }
                : { entryId: owner.id, start, end },
          };
    })
    .sort(
      (a, b) =>
        a.start - b.start ||
        a.end - b.end ||
        compareText(a.kind, b.kind) ||
        compareText(a.id, b.id),
    );
};

/** Screens every string of a decoded bundle, in field order. */
export function screenSourceBundle(
  bundle: SourceBundle,
  allowedHosts: readonly string[],
): readonly SourceBundleFinding[] {
  const allowed = allowlist(allowedHosts);
  const at = (
    value: string | undefined,
    path: string,
    owner?: Parameters<typeof screenString>[3],
  ) => (value === undefined ? [] : screenString(value, path, allowed, owner));
  return freeze([
    ...at(bundle.bundleId, "$.bundleId"),
    ...at(bundle.sourceKind, "$.sourceKind"),
    ...at(bundle.revisionId, "$.revisionId"),
    ...bundle.sections.flatMap((section, index) => [
      ...at(section.id, `$.sections[${index}].id`),
      ...at(section.heading, `$.sections[${index}].heading`),
      ...at(section.text, `$.sections[${index}].text`, {
        key: "sectionId",
        id: section.id,
      }),
    ]),
    ...bundle.discussion.flatMap((entry, index) => [
      ...at(entry.id, `$.discussion[${index}].id`),
      ...at(entry.text, `$.discussion[${index}].text`, {
        key: "entryId",
        id: entry.id,
      }),
      ...at(entry.createdAt, `$.discussion[${index}].createdAt`),
    ]),
    ...bundle.images.flatMap((image, index) => [
      ...at(image.id, `$.images[${index}].id`),
      ...at(image.hash, `$.images[${index}].hash`),
      ...at(image.altText, `$.images[${index}].altText`),
    ]),
    ...bundle.revisions.flatMap((revision, index) =>
      at(revision.revisionId, `$.revisions[${index}].revisionId`),
    ),
  ]);
}

// ------------------------------------------------------------------ public API

/** Equality receipt over the canonical bundle, not a cryptographic identity. */
export const sourceBundleHash = (bundle: SourceBundle): string =>
  `fnv1a64:${fnv1a64(
    canonicalStringify({
      domain: SOURCE_BUNDLE_HASH_DOMAIN,
      bundle: canonicalOrder(bundle),
    }),
  )}`;

/**
 * Decodes an untrusted value (parsed JSON) into a frozen SourceBundle, then
 * screens it. A malformed value refuses with the first failing path; a bundle
 * holding a declared shape or a declared URL form whose host is not allowed
 * refuses with every finding, its path indexing the value as supplied. An
 * accepted bundle is in canonical order. An invalid allowlist is a caller
 * error and throws.
 */
export function decodeSourceBundle(
  value: unknown,
  options: SourceBundleDecodeOptions,
): SourceBundleDecodeResult {
  const allowedHosts = options?.allowedHosts;
  allowlist(allowedHosts);
  let structure: SourceBundle;
  try {
    structure = decodeStructure(value);
  } catch (error) {
    if (error instanceof Malformed)
      return freeze({
        ok: false,
        refusal: "malformed",
        path: error.path,
        reason: error.reason,
      });
    throw error;
  }
  const findings = screenSourceBundle(structure, allowedHosts);
  if (findings.length)
    return freeze({ ok: false, refusal: "screened", findings });
  const bundle = canonicalOrder(structure);
  return freeze({
    ok: true,
    bundle: freeze(bundle),
    hash: sourceBundleHash(bundle),
  });
}

/** The text a span addresses in a decoded bundle; an unresolvable span throws. */
export function resolveSourceSpan(
  bundle: SourceBundle,
  value: SourceSpan,
): string {
  const owner =
    "sectionId" in value
      ? bundle.sections.find((section) => section.id === value.sectionId)
      : bundle.discussion.find((entry) => entry.id === value.entryId);
  if (!owner) throw new Error("source span: no section or entry has its id");
  const bytes = encoder.encode(owner.text);
  if (
    !Number.isSafeInteger(value.start) ||
    !Number.isSafeInteger(value.end) ||
    value.start < 0 ||
    value.end < value.start ||
    value.end > bytes.length ||
    !boundary(bytes, value.start) ||
    !boundary(bytes, value.end)
  )
    throw new Error(
      "source span: outside its text or inside a UTF-8 character",
    );
  return new TextDecoder("utf-8", { fatal: true }).decode(
    bytes.subarray(value.start, value.end),
  );
}
