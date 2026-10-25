import { chromium } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";

const HOST = "http://127.0.0.1:8765";
const OUT = "qa-output";
await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const report = { layouts: [], interactions: [], pageErrors: [], failedRequests: [], timestamp: new Date().toISOString() };

function check(ok, message) {
  report.interactions.push({ ok: !!ok, message });
  if (!ok) console.error("FAIL:", message);
  else console.log("PASS:", message);
}
async function shot(page, label) {
  await page.screenshot({ path: OUT + "/" + label + ".jpg", type: "jpeg", quality: 58, fullPage: true });
  if (process.env.QA_BASE64 === "1" && ["home-390-first","home-1440-first","products-390-first"].includes(label)) {
    const buf = await page.screenshot({ type: "jpeg", quality: 32, fullPage: false });
    console.log("QA_IMAGE_BEGIN:" + label + ":" + buf.toString("base64") + ":QA_IMAGE_END");
  }
}
const sizes = [
  { name: "375", w: 375, h: 812 },
  { name: "390", w: 390, h: 844 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 }
];
for (const { name, w, h } of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
  page.on("pageerror", e => report.pageErrors.push({ size: name, error: String(e) }));
  page.on("console", m => { if (m.type() === "error") report.pageErrors.push({ size: name, consoleError: m.text() }); });
  await page.goto(HOST + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const m = await page.evaluate(() => {
    const hero = document.querySelector(".brand-hero");
    const h1 = hero.querySelector("h1");
    const products = document.querySelector("#products");
    const cards = [...products.querySelectorAll(".product-card")];
    const rect = (x) => {const r=x.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,top:r.top,bottom:r.bottom,height:r.height};};
    const headingStyle = getComputedStyle(h1);
    const headingLines = Math.round(h1.getBoundingClientRect().height / parseFloat(headingStyle.lineHeight));
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      bodyWidth: document.body.scrollWidth,
      h1: rect(h1), products: rect(products),
      productCards: cards.map(rect),
      img: [...document.images].map(x=>({src:x.src.split("/").pop(),ok:x.complete&&x.naturalWidth>0})),
      visibleText: h1.innerText, headingLines,
      nav: rect(document.querySelector(".site-nav")),
      totalHeight: document.documentElement.scrollHeight
    };
  });
  report.layouts.push({ size: name, ...m });
  check(m.documentWidth <= w + 2 && m.bodyWidth <= w + 2, name + " no horizontal overflow (" + m.documentWidth + "/" + w + ")");
  check(m.visibleText.toLowerCase().includes("experience") && m.visibleText.toLowerCase().includes("truly automated"),name + " headline");
  check(m.h1.left >= -2 && m.h1.right <= w + 2,name + " headline within viewport");
  if (name==="1440" || name==="390") check(m.headingLines===2,name+" hero tagline uses exactly two lines (got "+m.headingLines+")");
  check(m.productCards.length===2 && m.productCards.every(c=>c.width > 200),name + " both product cards rendered");
  check(m.img.every(x=>x.ok),name + " images loaded (" + m.img.filter(x=>!x.ok).map(x=>x.src).join(",") + ")");
  await shot(page, "home-" + name + "-first");
  await page.locator("#products").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await shot(page, "products-" + name + "-first");
  if (process.env.QA_BASE64 === "1" && name === "390") {
    const image = await page.locator(".product-card--connect").screenshot({type:"jpeg",quality:36});
    console.log("QA_IMAGE_BEGIN:hardware-card-390:"+image.toString("base64")+":QA_IMAGE_END");
  }
  if (process.env.QA_BASE64 === "1" && name === "1440") {
    const image = await page.locator(".brand-hero__visual").screenshot({type:"jpeg",quality:32});
    console.log("QA_IMAGE_BEGIN:hero-stage-1440:"+image.toString("base64")+":QA_IMAGE_END");
  }
  if (name === "390") {
    const menu = page.locator("#burger");
    if (await menu.isVisible()) {
      await menu.click();
      const expanded = await menu.getAttribute("aria-expanded");
      check(expanded === "true", "mobile nav menu expands");
      const navLink = page.locator("#links a[href='flexiflow.html']");
      check(await navLink.isVisible(),"mobile nav links visible");
      await menu.click();
      check(await menu.getAttribute("aria-expanded") === "false","mobile nav closes");
    }
  }
  await page.close();
}
const pages = ["flexiflow.html","flexiconnect.html","applications.html","compatibility.html","reactor-makers.html","faq.html","about.html","contact.html","thanks.html"];
for (const path of pages) {
  const page=await browser.newPage({ viewport:{width:390,height:844},isMobile:true,hasTouch:true });
  page.on("pageerror",e=>report.pageErrors.push({page:path,error:String(e)}));
  await page.goto(HOST+"/"+path,{waitUntil:"networkidle"});
  const x=await page.evaluate(()=>({
    h1:[...document.querySelectorAll("h1")].map(x=>x.textContent.trim()),
    width:document.documentElement.scrollWidth,viewport:innerWidth,
    images:[...document.images].filter(x=>!x.complete||x.naturalWidth===0).map(x=>x.src)
  }));
  check(x.h1.length===1,path+" one H1");
  check(x.width<=x.viewport+2,path+" no horizontal overflow "+x.width+"/"+x.viewport);
  check(x.images.length===0,path+" images loaded");
  await shot(page,path.replace(".html","")+"-mobile");
  await page.close();
}
{
  const page=await browser.newPage({ viewport:{width:390,height:844},isMobile:true,hasTouch:true });
  await page.goto(HOST+"/contact.html",{waitUntil:"networkidle"});
  const f=page.locator("#demo-form");
  check(await f.isVisible(),"demo form visible");
  await page.fill("#name","QA Demo Visitor");
  await page.fill("#org","QA Laboratory");
  await page.fill("#email","qa@example.com");
  await page.fill("#message","QA test draft only, do not submit");
  await page.waitForTimeout(550);
  await page.reload({waitUntil:"networkidle"});
  check(await page.inputValue("#name")==="QA Demo Visitor","demo name recovered after reload");
  check(await page.inputValue("#email")==="qa@example.com","demo email recovered after reload");
  check((await page.locator(".form-draft-status").innerText()).includes("restored"),"draft restore message");
  await page.locator(".clear-draft").click();
  check(await page.inputValue("#name")==="","clear draft resets form");
  await page.reload({waitUntil:"networkidle"});
  check(await page.inputValue("#name")==="","clear persists across reload");
  await page.close();
}
{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.goto(HOST+"/reactor-makers.html",{waitUntil:"networkidle"});
  check(await page.locator("#partner-form").isVisible(),"OEM form visible");
  await page.fill("#p-name","QA OEM");
  await page.fill("#p-company","QA Maker");
  await page.fill("#p-email","oem@example.com");
  await page.waitForTimeout(550);
  await page.reload({waitUntil:"networkidle"});
  check(await page.inputValue("#p-company")==="QA Maker","OEM draft survives reload");
  await page.close();
}
report.passCount=report.interactions.filter(x=>x.ok).length;
report.failCount=report.interactions.filter(x=>!x.ok).length;
report.pageErrorCount=report.pageErrors.length;
await fs.writeFile(OUT+"/report.json",JSON.stringify(report,null,2));
console.log("QA_SUMMARY",JSON.stringify({pass:report.passCount,fail:report.failCount,pageErrors:report.pageErrorCount,layouts:report.layouts.map(({size,documentWidth,viewportWidth,totalHeight})=>({size,documentWidth,viewportWidth,totalHeight}))}));
await browser.close();
if (report.failCount || report.pageErrorCount) process.exitCode=1;
