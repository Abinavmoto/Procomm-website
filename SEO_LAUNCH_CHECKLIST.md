# Procomm Dynamics — Custom domain SEO + launch checklist

**Target production origin:** https://procommdynamics.com/ (apex; not www)  
**Status:** staged in GitHub PR #9. **Not live, not approved for search indexing.**  
**Last prepared:** 25 October 2026

## Implemented on this branch
- `CNAME` contains only `procommdynamics.com` for GitHub Pages branch publishing.
- Nine primary site pages use `https://procommdynamics.com/` in self-referencing canonical links, Open Graph and X/Twitter image/share URLs.
- Homepage Organization + WebSite JSON-LD refers to the apex custom domain; no invented address, founding date or certification.
- `sitemap.xml` uses the apex domain for all 9 preferred content URLs. Legacy aliases are not submitted.
- Three legacy meta-refresh pages have absolute custom-domain canonical targets.
- `robots.txt` allows crawling and advertises the apex sitemap, **but each public HTML page still has `noindex, nofollow`** pending launch approval.
- SEO metadata was prepared in PR #9; contact and OEM forms still need a verified real backend, and original photo/prototype claims must be confirmed.
- A repository SEO regression test checks canonical, social URLs, sitemap, crawler directives and the preview `noindex` state.

## Domain / GitHub Pages setup (actions for domain owner)
1. Verify ownership of `procommdynamics.com` in GitHub, if available: GitHub account Settings → Pages → Verified domains. Verification reduces takeover risk.
2. Open repository **Settings → Pages** and set custom domain to **`procommdynamics.com`**. Confirm publication source is `main` + `/(root)`. GitHub may generate its own matching root `CNAME` file; keep just one consistent CNAME.
3. Set DNS at your domain registrar/provider (remove any conflicting or stale records):
   - `A @ 185.199.108.153`
   - `A @ 185.199.109.153`
   - `A @ 185.199.110.153`
   - `A @ 185.199.111.153`
   - `CNAME www abinavmoto.github.io`
   - Optional: follow GitHub's **current** documented AAAA or ALIAS/ANAME records if using them instead. Do **not** use wildcard DNS.
4. Wait for DNS/HTTPS verification; enable **Enforce HTTPS** in Settings → Pages. Make sure `https://www.procommdynamics.com` redirects to `https://procommdynamics.com`, not the other way.
5. Confirm every page and shared asset loads correctly at **domain root**. On GitHub Pages, a project site with a custom domain is served at `/` rather than `/Procomm-website/`; the site's relative resource URLs should work, but test them.
6. Validate `https://procommdynamics.com/robots.txt` and `https://procommdynamics.com/sitemap.xml` after DNS and GitHub Pages domain configuration is working.

**Important merging caveat:** Adding `CNAME` on `main` may switch the site's public custom-domain routing before DNS is configured. Coordinate PR merge with the GitHub Pages and DNS changes. Don't assume writing CNAME updates registrar DNS records or issues the HTTPS certificate.

## Search-engine gating
**Current staged mode:** Robots can crawl URLs and see the `noindex` meta directive. This correctly blocks indexing for participating search engines even though `robots.txt` allows crawling.

**Commercial launch checklist:**
- [ ] DNS correctly points to GitHub Pages; HTTPS works; apex is canonical and www redirects.
- [ ] Real email inbox and demo/OEM form backend **accept and store** test enquiries; consent/privacy/anti-spam appropriately handled.
- [ ] Hardware product photography, stated supported capacities, finish options and instrument compatibility reviewed for accuracy.
- [ ] No unsupported Part 11, e-signature, unattended safety, customer success or certification claims.
- [ ] All key pages, JS interactions and forms work on desktop/mobile; real browser Lighthouse and accessibility tests done.
- [ ] Publish appropriate legal and privacy information.
- [ ] **Remove** `<meta name="robots" content="noindex, nofollow">` on the nine main pages only **after** the above are completed; keep aliases noindex and canonical to preferred URLs.
- [ ] Verify sitemap entries, canonical tags, HTTP statuses and crawler access again after launch.
- [ ] Verify domain ownership in Google Search Console and Bing Webmaster Tools; submit sitemap, inspect home/FlexiFlow/FlexiConnect and monitor indexing.
- [ ] Ensure GitHub Pages' old project URL redirects or has canonical/redirect handling; avoid splitting signals across two origins.

**Never switch `robots.txt` back to `Disallow: /` while keeping `noindex`**: search engines must fetch a page to see its noindex directive. For a genuinely private draft, use an access-controlled staging site. Google Search Central: https://developers.google.com/search/docs/crawling-indexing/block-indexing

## Search intent map
| Page | Primary intent | Secondary relevant concepts |
| --- | --- | --- |
| / | lab reactor automation | jacketed glass reactor retrofit |
| flexiflow.html | laboratory recipe automation software | ramp, hold, dosing, experiment record |
| flexiconnect.html | lab reactor controller | physical interfaces, instrument connectivity |
| applications.html | crystallisation automation | cooling ramps, seeded crystallisation |
| compatibility.html | reactor instrument compatibility | RTD, stirrer, chiller, dosing pump |
| reactor-makers.html | lab reactor OEM automation | manufacturer integration and co-development |
| faq.html | lab reactor retrofit FAQ | safety, compatibility, records |
| about.html | Procomm Dynamics | hardware-led scientific automation India |
| contact.html | FlexiFlow demonstration request | automation enquiry |

## Publish later when supported by evidence
1. A retrofit guide for existing jacketed glass reactors.
2. An illustrated recipe-builder guide for ramps, holds, dosing and audit records.
3. An instrument compatibility assessment checklist.
4. A careful explainer separating Part 11 design goals from validated compliance.
5. Actual test-rig photos, a short real demonstration and a measured prototype case study.

**Primary KPIs:** relevant non-branded impressions, qualified demo leads, OEM enquiries, enquiry-to-meeting conversion. SEO is not a substitute for a functioning lead-capture system.
