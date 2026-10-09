// Run from the repository root; a temporary base directory is the first argument where one is read.
const repo = process.cwd();
const { commentLabelFindings } = await import(
  `${repo}/scripts/lib/comment-labels.mjs`
);
const { feedbackSourcesComments } = await import(
  `${repo}/packages/skeleton/dist/src/feedback-source-comments.js`
);
const cases = {
  appleM1:
    "// On an Apple M1 host the timer resolution differs.\nconst a = 1;\n",
  f5: "// Press F5 in the browser to reload the page.\nconst a = 1;\n",
  r2: "// Upload to Cloudflare R2 storage.\nconst a = 1;\n",
  a4: "// Lay the page out as A4 paper.\nconst a = 1;\n",
  b2: "// The B2 bucket keeps old copies.\nconst a = 1;\n",
  n1: "// Each of N1 and N2 nodes holds one replica.\nconst a = 1;\n",
  hexD: "// Color #D100 is not used.\nconst a = 1;\n",
  string: "const s = '// WO-123 F1 D001';\n",
  template: "const t = `\n// WO-123: F1\n`;\n",
  regex: "const r = /\\/\\/ F1/;\n",
  url: "// See https://example.com/F1 for details.\nconst a = 1;\n",
  jsdoc: "/**\n * WO-123: does a thing.\n */\nfunction f() {}\n",
  blockLead: "/* VER-002 F3 was fixed here */\nconst a = 1;\n",
  trailingOrder: "// Explains the retry bound (WO-123).\nconst a = 1;\n",
  decisionQualified: "// The bound comes from WO-123 D004.\nconst a = 1;\n",
  decisionSplit:
    "// The bound comes from WO-123\n// D004 and stays.\nconst a = 1;\n",
  crlf: "// VER-001 F1 fixed\r\nconst a = 1;\r\n",
  sameBodyTwice: "const x = '// F1';\n// F1 again here\n",
};
const entries = Object.entries(cases);
const bodies = feedbackSourcesComments(
  entries.map(([name, source]) => ({ path: `${name}.mjs`, source })),
);
entries.forEach(([name, source], i) => {
  const f = commentLabelFindings(`${name}.mjs`, source, bodies[i]);
  console.log(
    name.padEnd(18),
    JSON.stringify(f.map(({ line, kind }) => ({ line, kind }))),
  );
});
