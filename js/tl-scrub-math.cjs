/**
 * Progress curves for the MicroAGI-style With us / Without us scrub.
 * Pure functions — unit-tested in tests/tl-scrub-math.test.mjs
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TlScrubMath = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function clamp01(p) {
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  /** Scroll progress → With us head progress (completes early, then holds). */
  function withProgress(p) {
    return Math.min(1, clamp01(p) / 0.38);
  }

  /** Scroll progress → Without us head progress (trails With us). */
  function withoutProgress(p) {
    var t = clamp01((clamp01(p) - 0.06) / 0.94);
    return Math.pow(t, 1.4);
  }

  return {
    clamp01: clamp01,
    withProgress: withProgress,
    withoutProgress: withoutProgress,
  };
});
