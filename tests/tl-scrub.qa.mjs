/**
 * Browser QA for overnight MicroAGI scrub (desktop + mobile viewports).
 * Run: node --test tests/tl-scrub.qa.mjs
 */
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { test, before, after } from "node:test";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHROME =
  process.env.CHROME_PATH ||
  "/usr/bin/google-chrome-stable";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".cjs": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

let server;
let baseUrl;
let browser;

function startStaticServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const rel = urlPath === "/" ? "/index.html" : urlPath;
      const file = path.normalize(path.join(ROOT, rel));
      if (!file.startsWith(ROOT)) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("missing");
          return;
        }
        const ext = path.extname(file).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
    server.on("error", reject);
  });
}

async function scrubSnapshot(page) {
  return page.evaluate(() => {
    const sec = document.getElementById("overnightSec");
    const sticky = sec && sec.querySelector(".tl-scrub__sticky");
    const scroll = sec && sec.querySelector(".tl-scrub__scroll");
    const withRow = sec && sec.querySelector(".tlx__row:not(.tlx__row--without)");
    const withoutRow = sec && sec.querySelector(".tlx__row--without");
    function rowState(row) {
      if (!row) return null;
      const head = row.querySelector(".tlx__head");
      const track = row.querySelector(".tlx__track");
      const prog =
        row.querySelector(".tlx__prog--full") ||
        row.querySelector(".tlx__prog--dash") ||
        row.querySelector(".tlx__prog");
      const nodes = Array.from(row.querySelectorAll(".tlx__node"));
      const t = head ? head.style.transform || "" : "";
      const m = /translate3d\(([-\d.]+)px/.exec(t);
      const headX = m ? parseFloat(m[1]) : 0;
      const tw = track ? track.getBoundingClientRect().width : 1;
      const scale =
        prog && prog.style.transform
          ? parseFloat((/scaleX\(([-\d.]+)\)/.exec(prog.style.transform) || [])[1] || "0")
          : 0;
      return {
        headX,
        headProgress: tw > 0 ? headX / tw : 0,
        scaleX: scale,
        onCount: nodes.filter((n) => n.classList.contains("on")).length,
        nodeCount: nodes.length,
      };
    }
    const cs = sticky ? getComputedStyle(sticky) : null;
    return {
      hasSection: !!sec,
      stickyPosition: cs ? cs.position : null,
      stickyTop: cs ? cs.top : null,
      scrollHeightPx: scroll ? scroll.getBoundingClientRect().height : 0,
      sectionHeight: sec ? sec.offsetHeight : 0,
      viewport: window.innerHeight,
      with: rowState(withRow),
      without: rowState(withoutRow),
    };
  });
}

async function scrollSection(page, fraction) {
  await page.evaluate((frac) => {
    // Disable smooth scrolling so headless scroll settles immediately
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    const sec = document.getElementById("overnightSec");
    const sticky = sec.querySelector(".tl-scrub__sticky");
    const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
    const travel = Math.max(1, sec.offsetHeight - (window.innerHeight - stickyTop));
    const secDocTop = sec.getBoundingClientRect().top + window.scrollY;
    // p = (stickyTop - secTop) / travel  →  secTop = stickyTop - p*travel
    const targetSecTop = stickyTop - travel * frac;
    const y = Math.max(0, secDocTop - targetSecTop);
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
    window.scrollTo(0, y);
  }, fraction);
  await new Promise((r) => setTimeout(r, 80));
  await page.evaluate(
    () =>
      new Promise((r) => {
        requestAnimationFrame(() => requestAnimationFrame(r));
      })
  );
}

before(async () => {
  await startStaticServer();
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise((r) => server.close(r));
});

async function withViewport(size, fn) {
  const page = await browser.newPage();
  await page.setViewport(size);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle0", timeout: 30000 });
  await page.waitForSelector("#overnightSec");
  try {
    await fn(page);
  } finally {
    await page.close();
  }
}

test("QA desktop: sticky scrub runway and With-leads-Without", async () => {
  await withViewport({ width: 1280, height: 800 }, async (page) => {
    const at0 = await scrubSnapshot(page);
    assert.equal(at0.hasSection, true);
    assert.equal(at0.stickyPosition, "sticky");
    assert.ok(at0.scrollHeightPx > at0.viewport * 1.5, "scroll runway should be tall");

    await scrollSection(page, 0.2);
    const mid = await scrubSnapshot(page);
    assert.ok(
      mid.with.headProgress > mid.without.headProgress,
      `With us should lead Without at 20% (with=${mid.with.headProgress}, without=${mid.without.headProgress})`
    );

    await scrollSection(page, 0.45);
    const held = await scrubSnapshot(page);
    assert.ok(held.with.headProgress >= 0.98, "With us should be complete by mid runway");
    assert.ok(held.without.headProgress < 0.95, "Without should still be trailing");
    assert.equal(held.with.onCount, held.with.nodeCount);

    await scrollSection(page, 1);
    const end = await scrubSnapshot(page);
    assert.ok(end.with.headProgress >= 0.98);
    assert.ok(end.without.headProgress >= 0.98);
  });
});

test("QA mobile 390px: scrub is NOT static; sticky + progress", async () => {
  await withViewport({ width: 390, height: 844 }, async (page) => {
    const at0 = await scrubSnapshot(page);
    assert.equal(at0.stickyPosition, "sticky", "mobile must stay sticky (not static)");
    assert.ok(at0.scrollHeightPx > at0.viewport * 2, "mobile needs scrub runway");

    await scrollSection(page, 0.15);
    const early = await scrubSnapshot(page);
    assert.ok(early.with.headProgress > 0.05, "scroll should advance With us");
    assert.ok(early.with.headProgress >= early.without.headProgress);

    await scrollSection(page, 0.5);
    const mid = await scrubSnapshot(page);
    assert.ok(mid.with.headProgress >= 0.98, "With us holds complete on mobile");
    assert.ok(mid.without.headProgress <= mid.with.headProgress + 0.01);
  });
});

test("QA CSS contract: no mobile static override for tl-scrub sticky", () => {
  const css = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
  assert.equal(
    /@media \(max-width:\s*820px\)[\s\S]*?\.tl-scrub__sticky\s*\{[^}]*position:\s*static/i.test(css),
    false,
    "820px breakpoint must not force .tl-scrub__sticky { position: static }"
  );
  assert.match(css, /\.tl-scrub__sticky\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /@media \(max-width:\s*820px\)[\s\S]*?\.tl-scrub__scroll\s*\{[^}]*height:\s*280vh/s);
});
