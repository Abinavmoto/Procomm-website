/**
 * Verify production-domain SEO metadata while maintaining the prelaunch noindex guard.
 * Run: npm run test:seo
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://procommdynamics.com/";
const pages = [
  "index.html", "flexiflow.html", "flexiconnect.html",
  "applications.html", "compatibility.html", "reactor-makers.html",
  "faq.html", "about.html", "contact.html",
];
const redirects = {
  "how-it-works.html": "flexiflow.html",
  "recipes.html": "applications.html",
  "integrations.html": "compatibility.html",
};
const read = (name) => readFileSync(path.join(root, name), "utf8");
const get = (text, expr) => expr.exec(text)?.[1] || null;
const canonical = (file) => file === "index.html" ? origin : origin + file;

test("GitHub Pages custom apex domain", () => {
  assert.equal(read("CNAME").trim(), "procommdynamics.com");
});

test("nine indexable-after-launch primary pages have custom-domain SEO metadata (prelaunch noindex kept)", () => {
  for (const file of pages) {
    const html = read(file);
    const url = canonical(file);
    assert.equal(get(html, /<link rel="canonical" href="([^"]+)"/), url, file + " canonical");
    assert.equal(get(html, /<meta property="og:url" content="([^"]+)"/), url, file + " og:url");
    assert.equal(get(html, /<meta property="og:image" content="([^"]+)"/)?.startsWith(origin), true, file + " og:image");
    assert.equal(get(html, /<meta name="twitter:image" content="([^"]+)"/)?.startsWith(origin), true, file + " twitter:image");
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/, file + " preview guard");
    assert.ok(get(html, /<title>([^<]+)<\/title>/), file + " title");
    assert.ok(get(html, /<meta name="description" content="([^"]+)"/), file + " description");
    assert.equal((html.match(/<h1\b/g) || []).length, 1, file + " H1");
    assert.equal(html.includes("https://abinavmoto.github.io/Procomm-website/"), false, file + " old SEO origin");
    const shareImage = get(html, /<meta property="og:image" content="([^"]+)"/);
    assert.ok(existsSync(path.join(root, new URL(shareImage).pathname.slice(1))), file + " share image exists");
  }
});

test("homepage structured data references new origin", () => {
  const html = read("index.html");
  const json = get(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(json, "JSON-LD script present");
  const data = JSON.parse(json);
  assert.equal(data["@graph"].find(x => x["@type"] === "Organization").url, origin);
  assert.equal(data["@graph"].find(x => x["@type"] === "WebSite").url, origin);
});

test("sitemap contains only canonical pages at the new domain", () => {
  const sitemap = read("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(urls, pages.map(canonical));
});

test("robots.txt permits crawler access to read prelaunch noindex", () => {
  const robots = read("robots.txt");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/procommdynamics\.com\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow: \/$/m);
});

test("legacy alias pages retain noindex and target primary custom-domain canonical URLs", () => {
  for (const [file, target] of Object.entries(redirects)) {
    const html = read(file);
    assert.equal(get(html, /<link rel="canonical" href="([^"]+)"/), origin + target);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  }
});
