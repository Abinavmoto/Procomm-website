# Procomm Dynamics — Prelaunch SEO and conversion checklist

**State, 25 October 2026:** Public design preview; **not approved for search indexing**.

## Verified implementation in this branch
- Unique SEO titles and descriptions for 9 preferred site pages.
- Canonical links, Open Graph sharing metadata and X/Twitter Card metadata.
- Minimal, fact-safe Organization and WebSite JSON-LD on the homepage.
- A sitemap of the 9 preferred URLs, excluding legacy meta-refresh alias pages.
- No invented product certifications, founder details, address, performance figures or customer testimonials.
- Contact and OEM forms no longer show a completed-success state when they merely create a mailto draft.

## Important GitHub Pages robots detail
This project is hosted at `https://abinavmoto.github.io/Procomm-website/` — a **subdirectory** of the `abinavmoto.github.io` host.
A file published at `https://abinavmoto.github.io/Procomm-website/robots.txt` is **NOT host-root robots.txt** and therefore cannot govern crawling of these project pages. Effective robots.txt would have to be at `https://abinavmoto.github.io/robots.txt`, or at the root of your future custom domain.
The working search exclusion on the individual HTML pages is `<meta name="robots" content="noindex, nofollow">`.
When using `noindex`, do not block the pages from crawling via host-root robots.txt: crawlers need to fetch the page to read noindex. For a truly private preview, require authentication/access control. See Google's documentation on robots location and noindex.

## Prerequisites: business and product
- [ ] Verify the final domain, working info@procommdynamics.com mailbox, and actual operational address/contact information.
- [ ] Confirm the registered legal name and public company description.
- [ ] Replace concept images with actual product photos or accurate labelled CAD visuals; publish a bench/demo video only after real footage exists.
- [ ] Verify capacity limits, final I/O and communications, control tolerances, fail-safe behavior, service claims, instrument integration, and availability of SS304/white-graphite finishes.
- [ ] Keep 21 CFR Part 11 electronic records/e-signatures and safety claims at their actual validated stage. Do not claim certification or unattended-autonomy without appropriate evidence.
- [ ] Obtain consent before publishing founders, photos, customer logos or customer stories.

## Prerequisites: forms, accessibility, speed
- [ ] Connect and verify **both** demo and OEM forms to an actual lead-receiving service. A Zoho Forms share/permalink page is NOT automatically a CORS-compatible form POST API; use a supported embed or secure integration and check response/storage end-to-end.
- [ ] Confirm email notifications and CRM ownership routing; test a submission from desktop and iPhone. Prevent a fake success when backend rejects request.
- [ ] Add a privacy notice and consent/anti-spam provisions suitable for the chosen lead-processing provider.
- [ ] Test all navigation links and legacy redirects; inspect focus states, keyboard order, mobile menu, FAQ accordion and reduced-motion behavior.
- [ ] Use the existing WebP product assets, appropriate width/height and lazy loading below the fold.
- [ ] Run Lighthouse/PageSpeed Insights and accessibility checks on a deployed site at 320px, 375px, 768px and desktop widths. No Lighthouse/Core Web Vitals score has yet been measured.

## Go-live actions after checks
1. Move to a proper business custom domain with HTTPS. Replace EVERY `https://abinavmoto.github.io/Procomm-website/` in canonicals, OG tags, JSON-LD and sitemap with its canonical origin and path.
2. Remove `noindex, nofollow` tags from real public pages (or replace with `index, follow`) once those pages are launch-approved.
3. On the **new custom domain's host root**, publish a correct robots.txt, e.g.:
   ```text
   User-agent: *
   Allow: /
   Sitemap: https://YOUR-DOMAIN/sitemap.xml
   ```
4. Remove "preview" UI if ready, and publish the approved privacy and company/legal details.
5. Test status codes, canonical tags, sitemap.xml and robots.txt at the real public domain. Prefer actual 301 redirects to legacy alias pages if the host supports them. GitHub Pages does not provide arbitrary server-side 301 mapping.
6. Set up Google Search Console and Bing Webmaster Tools, submit sitemap, inspect Home/FlexiFlow/FlexiConnect, and track nonbranded impressions, page indexing and real leads.

## Search intent map
| URL | Primary search intent | Related search terms |
| --- | --- | --- |
| / | lab reactor automation / retrofit | jacketed glass reactor automation |
| flexiflow.html | lab reactor recipe automation software | ramp hold dose recipes, experiment records |
| flexiconnect.html | laboratory reactor controller | sensor interface, chiller and dosing pump integration |
| applications.html | crystallisation and synthesis automation | seeded crystallisation, temperature control |
| compatibility.html | lab instrument integration | stirrers, chillers, RTD, RS232, RS485 |
| reactor-makers.html | lab reactor OEM automation | manufacturer integration, OEM partnerships |
| faq.html | jacketed lab reactor retrofit FAQs | deployment, compatibility, safety |
| about.html | Procomm Dynamics lab automation company | Machines with Context, India |
| contact.html | request lab reactor automation demo | automation enquiry |

## Content to write after technical launch preparation
1. **How to automate an existing jacketed glass reactor** — retrofit process, integration checklist and validation boundary.
2. **Lab reactor recipes: temperature ramps, holds and dosing** — educational, illustrative sequences.
3. **How to assess stirrer, chiller and pump compatibility** — interfaces, electrical isolation and verification.
4. **Part 11-ready architecture vs actual Part 11 compliance** — carefully distinguished feature requirements, validation and electronic signatures.
5. **A real FlexiConnect prototype/PoC test report**, after physical experiments with evidence.

Track *qualified* scientist and reactor OEM enquiries as the main business outcome; keyword position alone is not conversion.
