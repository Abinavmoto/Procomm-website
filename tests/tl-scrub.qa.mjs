/**
 * Homepage, responsive and conversion regression tests.
 * Run: npm run test:qa
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFileSync(path.join(root, name), "utf8");
const home = read("index.html");
const css = read("css/styles.css");
const js = read("js/main.js");
const thanksJs = read("js/thanks.js");
const demo = read("contact.html");
const oem = read("reactor-makers.html");
const hardware = read("flexiconnect.html");
const apps = read("applications.html");
const about = read("about.html");

test("full-screen photographic homepage opens with Procomm tagline before products", () => {
  assert.match(home, /<body id="top" class="home-page">/);
  assert.match(home, /class="cinematic-hero" id="experience"/);
  assert.match(home, /<h1 id="experience-title">Experience<br><em>truly automated\.<\/em><\/h1>/);
  assert.equal((home.match(/<h1\b/g) || []).length, 1);
  assert.ok(home.includes('src="assets/img/flexiconnect-ss304-studio.jpg"'));
  const hero = home.indexOf('id="experience"');
  const products = home.indexOf('id="products"');
  const comparison = home.indexOf('id="comparison"');
  const applications = home.indexOf('class="application-spotlight"');
  assert.ok(hero >= 0 && products > hero && comparison > products && applications > comparison);
  assert.match(home, /Our products\./);
  assert.match(home, /href="flexiflow\.html" class="product-card__link"/);
  assert.match(home, /href="flexiconnect\.html" class="product-card__link"/);
});

test("full-bleed hero and restored comparison are mobile-ready without scroll trap", () => {
  for (const selector of [".cinematic-hero", ".cinematic-hero__image", ".cinematic-hero__veil", ".product-grid", ".comparison-track", ".comparison-row", ".application-spotlight", ".brand-outro"]) {
    assert.ok(css.includes(selector), selector);
  }
  assert.match(css, /min-height: 100svh;/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /\.comparison-track \{ grid-template-columns: repeat\(2,minmax\(0,1fr\)\);/);
  assert.doesNotMatch(home, /id="overnightSec"|class="scene-svg"/);
  assert.doesNotMatch(js, /setInterval|scene\.style\.transform/);
  assert.match(home, /<h3>With us<\/h3>/);
  assert.match(home, /<h3>Without us<\/h3>/);
  const section = home.slice(home.indexOf('<section class="comparison-section"'),home.indexOf('</section>',home.indexOf('<section class="comparison-section"')));
  assert.equal((section.match(/class="comparison-track__number"/g) || []).length,10);
  assert.equal((section.match(/<ol class="comparison-track"/g) || []).length,2);
  assert.match(section, /subject to development, equipment integration and validation/);
});

test("product labels are factual and applications stay focused", () => {
  assert.match(home, /DEVELOPMENT PREVIEW/);
  assert.match(home, /DESIGN PREVIEW/);
  assert.doesNotMatch(home + hardware, /DB15|2× RJ45/);
  assert.match(hardware, /DB9/);
  assert.match(hardware, /White \/ graphite — design concept/);
  assert.doesNotMatch(apps, /Polymerisation|Fermentation|Fertilisers|Extraction &amp; distillation/);
  assert.match(apps, /Chemical synthesis/);
  assert.match(apps, /Crystallisation/);
  assert.doesNotMatch(about, /We started as an automation|Then we hit a real requirement/);
});

test("both forms use native HTML POST to the email relay and remain visible", () => {
  for (const [html,kind] of [[demo,"demo"],[oem,"oem"]]) {
    assert.match(html, /method="POST" data-draft="/);
    assert.match(html, /action="https:\/\/formsubmit\.co\/info@procommdynamics\.com"/);
    assert.ok(html.includes('name="_next" value="https://procommdynamics.com/thanks.html?form=' + kind + '"'));
    assert.match(html, /name="_honey"/);
    assert.match(html, /class="clear-draft"/);
    assert.match(html, /class="form-draft-status"/);
    assert.doesNotMatch(html, /<form[^>]+hidden/);
    assert.doesNotMatch(html, /form-unavailable/);
  }
  assert.doesNotMatch(js, /window\.location\.href|mailto:/);
});

test("browser stores drafts temporarily, restores fields and retains unsent values", () => {
  assert.match(js, /var TTL = 7 \* 24 \* 60 \* 60 \* 1000;/);
  assert.match(js, /localStorage\.setItem\(draftKey\(kind\)/);
  assert.match(js, /localStorage\.getItem\(draftKey\(kind\)/);
  assert.match(js, /el\.value = draft\.values\[el\.name\]/);
  assert.match(js, /form\.addEventListener\("input", queueSave\)/);
  assert.match(js, /window\.addEventListener\("pagehide"/);
  assert.match(js, /sessionStorage\.setItem\(pendingKey\(kind\)/);
  assert.doesNotMatch(js, /localStorage\.removeItem\(draftKey\(kind\)\);\s*\/\* Native form POST/);
  assert.match(thanksJs, /if \(confirmed\)/);
  assert.match(thanksJs, /localStorage\.removeItem/);
  assert.match(thanksJs, /Submission not verified\./);
});

test("thank-you page is noindex and does not claim inbox delivery", () => {
  const thanks = read("thanks.html");
  assert.match(thanks, /noindex, nofollow/);
  assert.match(thanks, /Checking the submission\./);
  assert.match(thanks, /not a guarantee of inbox delivery/);
});
