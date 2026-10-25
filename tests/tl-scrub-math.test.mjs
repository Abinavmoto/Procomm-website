import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { clamp01, withProgress, withoutProgress } = require("../js/tl-scrub-math.cjs");

test("clamp01 bounds", () => {
  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(0), 0);
  assert.equal(clamp01(0.5), 0.5);
  assert.equal(clamp01(1), 1);
  assert.equal(clamp01(2), 1);
});

test("With us completes by ~38% scroll and holds", () => {
  assert.equal(withProgress(0), 0);
  assert.ok(withProgress(0.19) > 0.4 && withProgress(0.19) < 0.6);
  assert.equal(withProgress(0.38), 1);
  assert.equal(withProgress(0.7), 1);
  assert.equal(withProgress(1), 1);
});

test("Without us trails With us across the runway", () => {
  const samples = [0, 0.2, 0.4, 0.6, 0.8, 1];
  for (const p of samples) {
    assert.ok(
      withoutProgress(p) <= withProgress(p) + 1e-9,
      `without (${withoutProgress(p)}) should not lead with (${withProgress(p)}) at p=${p}`
    );
  }
  assert.ok(withoutProgress(0.2) < 0.35);
  assert.ok(withoutProgress(0.38) < 0.95);
  assert.equal(withoutProgress(1), 1);
});

test("With us is finished while Without is still mid-run at mid scroll", () => {
  const p = 0.45;
  assert.equal(withProgress(p), 1);
  assert.ok(withoutProgress(p) < 0.85);
});
