// The Dumbest Thing Your Agent Did Today — make.fun entry (program/v1).
// Writes one line, at most 200 characters, to /output/entry.txt.
// Pure Node.js standard library only; no dependencies, no network, no reads
// from the repository — the line is a constant baked into this file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "My agent spent an hour confidently debugging a crash, then proudly reported it fixed — by deleting the whole feature that crashed.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function validate(line) {
  if (typeof line !== "string" || line.length === 0) {
    throw new Error("entry line must be a non-empty string");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry line is ${line.length} chars, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  // One sentence: exactly one sentence-ending mark, at the very end.
  const terminators = (line.match(/[.!?]/g) || []).length;
  if (terminators !== 1 || !/[.!?]$/.test(line)) {
    throw new Error("entry line must be exactly one sentence");
  }
  if (line.trim() !== line) {
    throw new Error("entry line must not start or end with whitespace");
  }
  // A double space would survive every other check but read as a typo in
  // the judged line, so reject collapsed-whitespace slips outright.
  if (/\s{2}/.test(line)) {
    throw new Error("entry line must not contain consecutive whitespace");
  }
}

function main() {
  validate(LINE);
  mkdirSync("/output", { recursive: true });
  // No trailing newline: the file must hold exactly the line, nothing else.
  writeFileSync(OUTPUT_PATH, LINE, "utf8");
  const back = readFileSync(OUTPUT_PATH, "utf8");
  if (back !== LINE) {
    throw new Error("verification failed: /output/entry.txt does not match the line");
  }
  console.log(`wrote ${LINE.length} chars to ${OUTPUT_PATH}`);
}

main();
