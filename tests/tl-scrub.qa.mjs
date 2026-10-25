/**
 * Static responsive-regression checks for Procomm web pages.
 * The old scroll-scrubbed interaction was removed after iPhone/desktop QA:
 * process steps are now always visible; no 280vh sticky scroll runway.
 * Run: npm run test:qa
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const home = read("index.html");
const css = read("css/styles.css");
const js = read("js/main.js");

test("overnight comparison shows all steps without scroll trap", () => {
  const begin = home.indexOf('<section class="tl-scrub"');
  const end = home.indexOf("</section>", begin);
  assert.ok(begin > 0 && end > begin);
  const section = home.slice(begin, end);
  assert.equal((section.match(/class="tlx__row(?: tlx__row--without)?"/g) || []).length, 2);
  assert.equal((section.match(/class="tlx__node(?: tlx__node--muted)?"/g) || []).length >= 8, true);
  assert.match(section, /PROCESS COMPARISON/);
  assert.doesNotMatch(section, /SCROLL TO PLAY/);
  assert.ok(css.includes(".tl-scrub__scroll { height: auto !important;"));
  assert.ok(css.includes("position: static !important;"));
  assert.doesNotMatch(js, /Scroll-scrubbed With us/);
  assert.ok(css.includes("grid-template-columns: repeat(2,minmax(0,1fr))"));
});

test("mobile reduces whitespace and never hides content behind reveal", () => {
  assert.ok(css.includes(":root { --pad-y: 42px; }"));
  assert.match(css, /\.loop-grid > div:first-child \{ position: static; \}/);
  assert.match(css, /\.rv \{ opacity: 1 !important; transform: none !important; transition: none !important; \}/);
});

test("recipe has a clear applications call-to-action", () => {
  assert.match(home, /class="recipe-action"/);
  assert.match(home, /href="applications\.html" class="btn btn-g">Explore applications/);
});

test("hero illustration is stable without animation repaint or flashing", () => {
  const begin = home.indexOf('<svg viewBox="0 0 680 600" class="scene-svg"');
  const end = home.indexOf("</svg>", begin);
  assert.ok(begin > 0 && end > begin);
  assert.doesNotMatch(home.slice(begin,end), /<animate\b/);
  assert.doesNotMatch(js, /scene\.style\.transform|toast\.classList\.add\("flash"\)|setInterval/);
  assert.match(home, /class="chip chip--dose"/);
  assert.match(css, /\.chip--dose \{/);
});

test("hardware design facts and focused application copy", () => {
  const hardware = read("flexiconnect.html");
  const apps = read("applications.html");
  assert.doesNotMatch(hardware + home, /DB15/i);
  assert.match(hardware, /DB9/);
  assert.match(hardware, /1× RJ45 \(design target\)/);
  assert.match(hardware, /White \/ graphite — design concept/);
  assert.doesNotMatch(apps, /Polymerisation|Fermentation|Fertilisers|Extraction &amp; distillation/);
  assert.match(apps, /Chemical synthesis/);
  assert.match(apps, /Crystallisation/);
});

test("no unverified personal founder story", () => {
  const about = read("about.html");
  assert.doesNotMatch(about, /Then we hit a real requirement|We started as an automation|OUR STORY/);
  assert.match(about, /ABOUT PROCOMM DYNAMICS/);
});

test("unconfigured forms never auto-open mailto or fake success", () => {
  const contact = read("contact.html");
  const oem = read("reactor-makers.html");
  assert.match(js, /var FORM_ENDPOINT = "";/);
  assert.doesNotMatch(js, /window\.location\.href\s*=\s*["']mailto:/);
  assert.match(contact, /id="demo-form-unavailable"/);
  assert.match(oem, /id="partner-form-unavailable"/);
  assert.match(contact, /<form id="demo-form" hidden/);
  assert.match(oem, /<form id="partner-form" hidden/);
  assert.match(js, /form\.hidden = false/);
  assert.match(js, /if \(!FORM_ENDPOINT\)/);
});
