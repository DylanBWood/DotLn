import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  SOURCE_BUNDLE_HASH_DOMAIN,
  SOURCE_SECRET_SHAPES,
  SOURCE_URL_FORMS,
  decodeSourceBundle,
  resolveSourceSpan,
  screenSourceBundle,
  sourceBundleHash,
  type SourceBundle,
  type SourceBundleDecodeResult,
  type SourceBundleFinding,
  type SourceSpan,
} from "../src/index.js";

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(new URL(path, import.meta.url), "utf8")) as T;
type Json = ReturnType<typeof JSON.parse>;
interface Fixture {
  readonly allowedHosts: readonly string[];
  readonly valid: readonly { name: string; hash: string; bundle: Json }[];
  readonly malformed: readonly {
    name: string;
    path: string;
    reason: string;
    bundle: Json;
  }[];
  readonly screened: readonly {
    case: string;
    kind: SourceBundleFinding["kind"];
    planted: string;
    matched: string;
    finding: SourceBundleFinding;
    bundle: Json;
    without: Json;
  }[];
  readonly limits: {
    readonly strings: readonly string[];
    readonly hash: string;
    readonly bundle: Json;
  };
}
const fixture = await readJson<Fixture>(
  "../../fixtures/wo060-source-bundles.json",
);
const oracleUrl = new URL(
  "../../../../corpus/harness/id-corpus-lib.mjs",
  import.meta.url,
);
const { referenceStableHash } = (await import(oracleUrl.href)) as {
  referenceStableHash(value: string): string;
};
const options = { allowedHosts: fixture.allowedHosts };

const decoded = (value: unknown, hosts = fixture.allowedHosts) => {
  const result = decodeSourceBundle(value, { allowedHosts: hosts });
  if (!result.ok) assert.fail(JSON.stringify(result));
  return result;
};
const refused = (result: SourceBundleDecodeResult) => {
  if (result.ok) assert.fail("expected a refusal");
  return result;
};
const screened = (result: SourceBundleDecodeResult) => {
  const refusal = refused(result);
  if (refusal.refusal !== "screened") assert.fail(JSON.stringify(refusal));
  return refusal.findings;
};
const bytes = (value: string) => Buffer.from(value, "utf8").length;
const withText = (text: string) => ({
  bundleId: "synthetic-issue-900",
  sourceKind: "synthetic-issue",
  revisionId: "2026-09-28T00:00:00Z",
  sections: [
    {
      id: "s-1",
      text,
      span: { sectionId: "s-1", start: 0, end: bytes(text) },
    },
  ],
  discussion: [],
  images: [],
  revisions: [],
});

// Independent of the module: plain key sorting, JSON.stringify and a no-BigInt FNV.
const sortKeys = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(sortKeys)
    : value !== null && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [
              key,
              sortKeys((value as Record<string, unknown>)[key]),
            ]),
        )
      : value;
const reversedKeys = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(reversedKeys)
    : value !== null && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .reverse()
            .map((key) => [
              key,
              reversedKeys((value as Record<string, unknown>)[key]),
            ]),
        )
      : value;
const deepFrozen = (value: unknown): boolean =>
  value === null ||
  typeof value !== "object" ||
  (Object.isFrozen(value) && Object.values(value).every(deepFrozen));
const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
};

test("WO-060 criterion 1: six synthetic bundles round-trip through the decoder and hash equal after canonicalization", () => {
  assert.equal(fixture.valid.length, 6);
  const hashes = new Set<string>();
  for (const { name, hash, bundle } of fixture.valid) {
    const input = deepFreeze(structuredClone(bundle));
    const first = decoded(input);
    assert.equal(first.hash, hash, name);
    assert.equal(sourceBundleHash(first.bundle), hash, name);
    assert.ok(deepFrozen(first.bundle), `${name}: decoded bundle is frozen`);
    assert.deepEqual(input, bundle, `${name}: input unchanged`);
    // The preimage and digest agree with an independent implementation.
    assert.equal(
      `fnv1a64:${referenceStableHash(
        JSON.stringify(
          sortKeys({ domain: SOURCE_BUNDLE_HASH_DOMAIN, bundle: first.bundle }),
        ),
      )}`,
      hash,
      name,
    );
    // Round trip through bytes.
    const again = decoded(JSON.parse(JSON.stringify(first.bundle)));
    assert.deepEqual(again.bundle, first.bundle, name);
    assert.equal(again.hash, hash, name);
    // Canonicalization: key order and set-like collection order do not count.
    const permuted = reversedKeys(structuredClone(bundle)) as {
      images: unknown[];
      revisions: { changedSpans: unknown[] }[];
    };
    permuted.images.reverse();
    for (const revision of permuted.revisions) revision.changedSpans.reverse();
    const canonical = decoded(permuted);
    assert.deepEqual(canonical.bundle, first.bundle, name);
    assert.equal(canonical.hash, hash, name);
    hashes.add(hash);
  }
  assert.equal(hashes.size, 6);

  // Document, thread and history order are content.
  const feature = fixture.valid[0]!.bundle;
  const swapped = structuredClone(feature);
  swapped.sections.reverse();
  assert.notEqual(decoded(swapped).hash, fixture.valid[0]!.hash);
  const edited = structuredClone(fixture.valid[3]!.bundle);
  edited.sections[0].text = edited.sections[0].text.replace("Done", "Fine");
  assert.notEqual(decoded(edited).hash, fixture.valid[3]!.hash);
});

test("WO-060 criterion 1: eight malformed bundles refuse with a path and no input text", () => {
  assert.equal(fixture.malformed.length, 8);
  for (const { name, path, reason, bundle } of fixture.malformed) {
    const refusal = refused(decodeSourceBundle(bundle, options));
    assert.deepEqual(
      refusal,
      { ok: false, refusal: "malformed", path, reason },
      name,
    );
  }
});

test("WO-060 positive decoding refuses every other malformed field with its path", () => {
  const base = fixture.valid[2]!.bundle;
  const cases: Array<[string, (bundle: Json) => unknown, string]> = [
    ["null root", () => null, "$"],
    ["missing field", (b) => void delete b.revisions, "$.revisions"],
    ["bundle id grammar", (b) => void (b.bundleId = "a/b"), "$.bundleId"],
    ["source kind", (b) => void (b.sourceKind = "Synthetic"), "$.sourceKind"],
    ["revision id", (b) => void (b.revisionId = ""), "$.revisionId"],
    ["sections array", (b) => void (b.sections = {}), "$.sections"],
    ["section object", (b) => void (b.sections[1] = "text"), "$.sections[1]"],
    [
      "heading line break",
      (b) => void (b.sections[0].heading = "Two\nlines"),
      "$.sections[0].heading",
    ],
    [
      "blank heading",
      (b) => void (b.sections[0].heading = "  "),
      "$.sections[0].heading",
    ],
    [
      "control character",
      (b) => {
        b.sections[1].text += "\u0007";
        b.sections[1].span.end += 1;
      },
      "$.sections[1].text",
    ],
    [
      "lone surrogate",
      (b) => {
        b.sections[1].text += "\ud83d";
        b.sections[1].span.end += 3;
      },
      "$.sections[1].text",
    ],
    [
      "own span names another section",
      (b) => void (b.sections[0].span.sectionId = "s-criteria"),
      "$.sections[0].span.sectionId",
    ],
    [
      "own span as an entry",
      (b) => {
        delete b.sections[0].span.sectionId;
        b.sections[0].span.entryId = "s-context";
      },
      "$.sections[0].span.entryId",
    ],
    [
      "span with both ids",
      (b) => void (b.images[0].referencedBy.sectionId = "s-context"),
      "$.images[0].referencedBy",
    ],
    [
      "span to a missing entry",
      (b) => void (b.images[0].referencedBy.entryId = "e-missing"),
      "$.images[0].referencedBy.entryId",
    ],
    [
      "span to a section under entryId",
      (b) => void (b.images[0].referencedBy.entryId = "s-context"),
      "$.images[0].referencedBy.entryId",
    ],
    [
      "fractional offset",
      (b) => void (b.images[0].referencedBy.start = 1.5),
      "$.images[0].referencedBy.start",
    ],
    [
      "negative offset",
      (b) => void (b.revisions[0].changedSpans[0].start = -1),
      "$.revisions[0].changedSpans[0].start",
    ],
    [
      "end before start",
      (b) => void (b.revisions[0].changedSpans[1].end = 0),
      "$.revisions[0].changedSpans[1].end",
    ],
    [
      "empty image reference",
      (b) =>
        void (b.images[0].referencedBy.end = b.images[0].referencedBy.start),
      "$.images[0].referencedBy.end",
    ],
    [
      "image hash form",
      (b) => void (b.images[0].hash = "md5:0123"),
      "$.images[0].hash",
    ],
    [
      "blank alt text",
      (b) => void (b.images[0].altText = ""),
      "$.images[0].altText",
    ],
    [
      "author missing",
      (b) => void delete b.discussion[0].author,
      "$.discussion[0].author",
    ],
    [
      "local-offset timestamp",
      (b) => void (b.discussion[0].createdAt = "2026-09-22T16:00:00+02:00"),
      "$.discussion[0].createdAt",
    ],
    [
      "impossible date",
      (b) => void (b.discussion[0].createdAt = "2026-02-29T00:00:00Z"),
      "$.discussion[0].createdAt",
    ],
    [
      "entries out of order",
      (b) => void (b.discussion[1].createdAt = "2026-09-22T13:59:59.999Z"),
      "$.discussion[1].createdAt",
    ],
    [
      "duplicate revision id",
      (b) => void b.revisions.push(structuredClone(b.revisions[0])),
      "$.revisions[1].revisionId",
    ],
    [
      "duplicate changed span",
      (b) =>
        void b.revisions[0].changedSpans.push(
          structuredClone(b.revisions[0].changedSpans[0]),
        ),
      "$.revisions[0].changedSpans[3]",
    ],
  ];
  for (const [name, edit, path] of cases) {
    const bundle = structuredClone(base);
    const replaced = edit(bundle);
    const refusal = refused(
      decodeSourceBundle(replaced === undefined ? bundle : replaced, options),
    );
    assert.equal(refusal.refusal, "malformed", name);
    if (refusal.refusal === "malformed") assert.equal(refusal.path, path, name);
  }
  // A leap day and ordered fractional seconds are valid.
  const leap = structuredClone(base);
  leap.discussion[0].createdAt = "2024-02-29T00:00:00Z";
  leap.discussion[1].createdAt = "2024-02-29T00:00:00.5Z";
  decoded(leap);
  // An unexpected key is named only when it is a short plain identifier.
  for (const [key, path] of [
    ["labels", "$.labels"],
    ["ghp_" + "A".repeat(36), "$[*]"],
    ["https://evil.example", "$[*]"],
  ] as const) {
    const refusal = refused(
      decodeSourceBundle({ ...structuredClone(base), [key]: 1 }, options),
    );
    assert.deepEqual(refusal, {
      ok: false,
      refusal: "malformed",
      path,
      reason: "unexpected field",
    });
  }
});

test("WO-060 criterion 2: each declared secret shape and URL form refuses with the span, and the same bundle without it decodes", () => {
  assert.deepEqual(
    fixture.screened.map((entry) => entry.case).sort(),
    [
      ...SOURCE_SECRET_SHAPES.map((shape) => shape.shapeId),
      ...SOURCE_URL_FORMS.map((form) => form.formId),
    ].sort(),
    "one fixture per declared shape and form",
  );
  for (const entry of fixture.screened) {
    const result = decodeSourceBundle(entry.bundle, options);
    const findings = screened(result);
    assert.deepEqual(findings, [entry.finding], entry.case);
    assert.equal(findings[0]!.kind, entry.kind, entry.case);
    assert.equal(
      resolveSourceSpan(entry.bundle as SourceBundle, findings[0]!.span!),
      entry.matched,
      entry.case,
    );
    assert.ok(
      !JSON.stringify(result).includes(entry.matched),
      `${entry.case}: the refusal does not carry the matched text`,
    );
    decoded(entry.without);
  }
  // The finding's offsets are the planted bytes, read without the module.
  for (const entry of fixture.screened)
    assert.equal(
      Buffer.from(
        entry.bundle.sections[0]?.text ?? entry.bundle.discussion[0].text,
      )
        .subarray(entry.finding.start, entry.finding.end)
        .toString("utf8"),
      entry.matched,
      entry.case,
    );
});

test("WO-060 criterion 2: an empty allowlist refuses every declared URL form", () => {
  for (const entry of fixture.screened.filter((e) => e.kind === "url-form")) {
    const host = entry.matched.replace(/^https:\/\//u, "");
    decoded(entry.bundle, [host]);
    assert.deepEqual(
      screened(decodeSourceBundle(entry.bundle, { allowedHosts: [] })),
      [entry.finding],
    );
  }
  const expected: Record<string, readonly string[]> = {
    "feature-request": [],
    "bug-report-with-screenshot": [
      "https://github.com",
      "https://docs.github.com",
      "https://github.com",
    ],
    "multibyte-text": ["https://github.com"],
    "one-section": [],
    "one-entry": ["https://docs.github.com"],
    "revised-with-supersession": ["www.github.com"],
  };
  for (const { name, bundle } of fixture.valid) {
    const result = decodeSourceBundle(bundle, { allowedHosts: [] });
    if (!expected[name]!.length) {
      assert.equal(result.ok, true, name);
      continue;
    }
    const findings = screened(result);
    const forms = decoded(bundle);
    assert.deepEqual(
      findings.map((finding) => resolveSourceSpan(forms.bundle, finding.span!)),
      expected[name],
      name,
    );
    assert.ok(findings.every((finding) => finding.kind === "url-form"));
  }
});

test("WO-060 criterion 2: three secret-like strings outside the declared shapes decode, and the module names them as the screen's limit", async () => {
  assert.equal(fixture.limits.strings.length, 3);
  const result = decoded(fixture.limits.bundle);
  assert.equal(result.hash, fixture.limits.hash);
  for (const value of fixture.limits.strings)
    assert.ok(result.bundle.sections[0]!.text.includes(value), value);
  const source = await readFile(
    new URL("../../src/source-bundle.ts", import.meta.url),
    "utf8",
  );
  const documentation = source.slice(0, source.indexOf("export "));
  assert.match(
    documentation,
    /screen is a declared filter, not a detector of every secret/u,
  );
  for (const limit of [
    /an unprefixed 40-hex token/u,
    /a JWT without the Bearer word/u,
    /a password in the userinfo of a URL whose host is allowed/u,
  ])
    assert.match(documentation.replace(/\s*\n\s*\*?\s*/gu, " "), limit);
});

/** Every span a fixture holds, with the bundle it addresses. */
function* fixtureSpans(): Generator<[string, Json, SourceSpan]> {
  const bundles: Array<[string, Json]> = [
    ...fixture.valid.map((v): [string, Json] => [v.name, v.bundle]),
    ...fixture.screened.flatMap((s): Array<[string, Json]> => [
      [s.case, s.bundle],
      [`${s.case} without`, s.without],
    ]),
    ["limits", fixture.limits.bundle],
  ];
  for (const [name, bundle] of bundles) {
    for (const section of bundle.sections)
      yield [`${name} ${section.id}`, bundle, section.span];
    for (const entry of bundle.discussion)
      yield [`${name} ${entry.id}`, bundle, entry.span];
    for (const image of bundle.images)
      yield [`${name} ${image.id}`, bundle, image.referencedBy];
    for (const revision of bundle.revisions)
      for (const span of revision.changedSpans)
        yield [`${name} ${revision.revisionId}`, bundle, span];
  }
  for (const s of fixture.screened)
    yield [`${s.case} finding`, s.bundle, s.finding.span!];
}

test("WO-060 criterion 3: every span in every fixture resolves to bytes inside its section or entry", () => {
  let count = 0;
  for (const [name, bundle, span] of fixtureSpans()) {
    const owner =
      "sectionId" in span
        ? bundle.sections.find(
            (section: { id: string }) => section.id === span.sectionId,
          )
        : bundle.discussion.find(
            (entry: { id: string }) => entry.id === span.entryId,
          );
    assert.ok(owner, `${name}: addressed item exists`);
    const text = Buffer.from(owner.text, "utf8");
    assert.ok(
      Number.isSafeInteger(span.start) &&
        Number.isSafeInteger(span.end) &&
        0 <= span.start &&
        span.start <= span.end &&
        span.end <= text.length,
      `${name}: inside its text`,
    );
    const slice = text.subarray(span.start, span.end);
    const value = new TextDecoder("utf-8", { fatal: true }).decode(slice);
    assert.ok(
      Buffer.from(value, "utf8").equals(slice),
      `${name}: on character boundaries`,
    );
    assert.equal(resolveSourceSpan(bundle as SourceBundle, span), value, name);
    count++;
  }
  assert.equal(count, 64, "spans in the fixtures");
  for (const { bundle } of fixture.valid)
    for (const image of bundle.images) {
      const text = resolveSourceSpan(
        decoded(bundle).bundle,
        image.referencedBy,
      );
      assert.match(text, /^!\[[^\]]*\]\(https:\/\/github\.com\/[^)]+\)$/u);
    }
  const multibyte = decoded(fixture.valid[2]!.bundle).bundle;
  assert.deepEqual(
    multibyte.revisions[0]!.changedSpans.map((span) =>
      resolveSourceSpan(multibyte, span),
    ),
    ["🙂", "„Größe“", ""],
  );
  assert.throws(
    () =>
      resolveSourceSpan(multibyte, {
        sectionId: "s-context",
        start: 21,
        end: 22,
      }),
    /inside a UTF-8 character/u,
  );
});

test("WO-060 the screen reads a declared URL form's host the way a judge would try to bend it", () => {
  const cases: Array<[string, boolean]> = [
    ["https://github.com/x", false],
    ["HTTPS://GitHub.COM:443/x", false],
    ["[link](https://github.com)", false],
    ["<https://github.com>", false],
    ['"https://github.com",', false],
    ["see https://github.com.", false],
    ["`https://github.com`", false],
    ["https:///github.com/x", false],
    ["https://github.com/someone/www.someone.com", false],
    ["https://github.com/r?to=www.evil.example", false],
    ["use https:// for links", false],
    ["https://evil.example", true],
    ["https://github.com@evil.example", true],
    ["https://user@name@github.com/", false],
    ["https://github.com:443@evil.example/", true],
    ["https://evil.example\\@github.com", true],
    ["https://evil.example#@github.com", true],
    ["https://evil.example?@github.com", true],
    ["https://github.com.evil.example", true],
    ["https://github.com%2eevil.example", true],
    ["https://github.com)evil.example", true],
    ['https://github.com"evil.example', true],
    ["https://github.com:80:evil.example", true],
    ["https://evil.example:github.com", true],
    ["https://[::1]/", true],
    ["https://127.0.0.1/", true],
    ["https://gıthub.com/", true],
    ["https://github.com\u200b.evil.example", true],
    ["https:///evil.example", true],
    ["https:\\\\evil.example", false],
    ["file:///etc/passwd", true],
    ["git+ssh://git@evil.example:22/x", true],
    ["xhttps://evil.example", true],
    ["(www.evil.example)", true],
    ["*www.evil.example*", true],
    ["WWW.EVIL.EXAMPLE", true],
    ["www.github.com@evil.example", true],
    ["a www.evil.example b", true],
    ["xwww.evil.example", false],
    ['"www.evil.example"', false],
    ["the www. prefix", false],
  ];
  for (const [text, refuses] of cases) {
    const result = decodeSourceBundle(withText(text), {
      allowedHosts: ["github.com", "docs.github.com"],
    });
    assert.equal(!result.ok, refuses, text);
    if (!result.ok) {
      const findings = screened(result);
      assert.equal(findings.length, 1, text);
      assert.equal(findings[0]!.kind, "url-form", text);
    }
  }
  // An authority read by the scheme form is not read again as www.
  assert.deepEqual(
    screened(
      decodeSourceBundle(withText("https://a_www.evil.example/x"), {
        allowedHosts: [],
      }),
    ).map((finding) => finding.id),
    ["scheme-authority"],
  );
  assert.equal(
    decodeSourceBundle(withText("https://x(www.evil.example@github.com/"), {
      allowedHosts: ["github.com"],
    }).ok,
    true,
  );
  // A shape inside a URL is its own finding.
  assert.deepEqual(
    screened(
      decodeSourceBundle(
        withText(`https://ghp_${"A".repeat(36)}@github.com/x`),
        { allowedHosts: ["github.com"] },
      ),
    ).map((finding) => finding.id),
    ["github-personal-access-token"],
  );
});

test("WO-060 the screen reads every string, and a string outside a section's or entry's text is located by path", () => {
  const bundle = structuredClone(fixture.valid[1]!.bundle);
  bundle.sections[0].heading = "Seen at https://evil.example";
  bundle.images[0].altText = `Token ghr_${"R".repeat(36)}`;
  bundle.images[0].id = "www.evil.example";
  const findings = screened(decodeSourceBundle(bundle, options));
  assert.deepEqual(
    findings.map(({ kind, id, path, start, end, span }) => ({
      kind,
      id,
      path,
      start,
      end,
      span,
    })),
    [
      {
        kind: "url-form",
        id: "scheme-authority",
        path: "$.sections[0].heading",
        start: 8,
        end: 28,
        span: undefined,
      },
      {
        kind: "url-form",
        id: "www-autolink",
        path: "$.images[0].id",
        start: 0,
        end: 16,
        span: undefined,
      },
      {
        kind: "secret-shape",
        id: "github-refresh-token",
        path: "$.images[0].altText",
        start: 6,
        end: 46,
        span: undefined,
      },
    ],
  );
  assert.ok(findings.every((finding) => !Object.hasOwn(finding, "span")));
  // screenSourceBundle is the same screen the decoder applies.
  assert.deepEqual(
    screenSourceBundle(decoded(fixture.valid[1]!.bundle).bundle, []),
    screened(
      decodeSourceBundle(fixture.valid[1]!.bundle, { allowedHosts: [] }),
    ),
  );
});

test("WO-060 the declared shapes are data, each with its boundary", () => {
  assert.ok(Object.isFrozen(SOURCE_SECRET_SHAPES));
  assert.ok(deepFrozen(SOURCE_SECRET_SHAPES) && deepFrozen(SOURCE_URL_FORMS));
  assert.equal(
    new Set(SOURCE_SECRET_SHAPES.map((shape) => shape.shapeId)).size,
    SOURCE_SECRET_SHAPES.length,
  );
  for (const shape of SOURCE_SECRET_SHAPES) {
    assert.doesNotThrow(() => new RegExp(shape.pattern, shape.flags));
    assert.ok(shape.reference.length > 0 && shape.description.length > 0);
  }
  assert.deepEqual(
    SOURCE_URL_FORMS.map((form) => form.formId),
    ["scheme-authority", "www-autolink"],
  );
  const refuses = (text: string) =>
    !decodeSourceBundle(withText(text), { allowedHosts: [] }).ok;
  const token = (length: number) => "Syn0".repeat(20).slice(0, length);
  for (const prefix of ["ghp_", "gho_", "ghu_", "ghs_", "ghr_"]) {
    assert.equal(refuses(`${prefix}${token(36)}`), true, prefix);
    assert.equal(refuses(`${prefix}${token(35)}`), false, prefix);
    assert.equal(refuses(`${prefix.toUpperCase()}${token(36)}`), false, prefix);
  }
  assert.equal(refuses("ghs_1_eyJh.eyJz.c2ln-_" + token(20)), true);
  assert.equal(refuses("github_pat_1"), true);
  assert.equal(refuses("tokens start with github_pat_ and ghp_"), false);
  assert.equal(refuses(`Bearer ${token(20)}`), true);
  assert.equal(refuses(`bearer\t${token(19)}==`), false);
  assert.equal(refuses(`BEARER ${token(19)}.=`), true);
  assert.equal(refuses(`Xbearer ${token(30)}`), false);
  assert.equal(refuses("a bearer token is a credential"), false);
  for (const header of [
    "-----BEGIN PRIVATE KEY-----",
    "-----BEGIN ENCRYPTED PRIVATE KEY-----",
    "-----BEGIN EC PRIVATE KEY-----",
    "-----begin openssh private key-----",
    "-----BEGIN PGP PRIVATE KEY BLOCK-----",
  ])
    assert.equal(refuses(header), true, header);
  for (const text of [
    "-----BEGIN PUBLIC KEY-----",
    "-----BEGIN CERTIFICATE-----",
    "---- BEGIN SSH2 ENCRYPTED PRIVATE KEY ----",
  ])
    assert.equal(refuses(text), false, text);
});

test("WO-060 the allowlist is explicit multi-label DNS host names; a caller error throws", () => {
  const bundle = withText("https://GitHub.com/x");
  assert.equal(
    decodeSourceBundle(bundle, { allowedHosts: ["GITHUB.com"] }).ok,
    true,
  );
  for (const hosts of [
    ["localhost"],
    ["10.0.0.1"],
    ["github.com."],
    ["*.github.com"],
    ["github.com:443"],
    ["gïthub.com"],
    [""],
    [1],
  ])
    assert.throws(
      () => decodeSourceBundle(bundle, { allowedHosts: hosts as string[] }),
      /allowedHosts\[0\]/u,
      JSON.stringify(hosts),
    );
  assert.throws(
    () =>
      decodeSourceBundle(bundle, undefined as unknown as { allowedHosts: [] }),
    /allowedHosts must be an array/u,
  );
});

test("WO-060 decoding is deterministic, reads no clock or randomness and screens adversarial text in linear time", () => {
  const originalNow = Date.now;
  const originalRandom = Math.random;
  Date.now = () => {
    throw new Error("ambient clock read");
  };
  Math.random = () => {
    throw new Error("ambient randomness read");
  };
  try {
    for (const { bundle } of fixture.valid)
      assert.deepEqual(
        decodeSourceBundle(bundle, options),
        decodeSourceBundle(bundle, options),
      );
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
  const size = 256 * 1024;
  for (const unit of [
    "a.",
    "(www.a",
    "://a",
    "-----BEGIN A ",
    "bearer a ",
    "ghs_",
  ]) {
    const text = unit.repeat(Math.ceil(size / unit.length)).slice(0, size);
    const started = performance.now();
    decodeSourceBundle(withText(text), { allowedHosts: [] });
    assert.ok(performance.now() - started < 5000, unit);
  }
});
