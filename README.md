# Procomm Dynamics website

Static site for **Procomm Dynamics** — *Machines with Context.*

- Recipe software: **FlexiFlow**
- Hardware controller: **FlexiConnect**
- Planned primary domain: **https://procommdynamics.com/**
- Previous GitHub Pages project address: https://abinavmoto.github.io/Procomm-website/

## Run locally

```bash
python3 -m http.server 8080
```

## Custom domain / SEO

This branch prepares custom-domain SEO tags, sitemap, social metadata, and a GitHub Pages `CNAME`. The DNS records and GitHub Pages custom domain setting must be configured by the domain owner; committing files does not change DNS or activate HTTPS.

Publication source: `main`, folder `/(root)`.

**Do not merge the custom-domain `CNAME` change before coordinating GitHub Pages settings and registrar DNS.** A premature merge can affect routing to the previous GitHub Pages address.

Site-wide `robots.txt` currently allows crawling, but every HTML page still contains **`noindex, nofollow`** to prevent premature appearance in search. Turn off `noindex` only after the production domain, accurate product information and real enquiry backend are launch-approved.

Read **[SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md)** for DNS records, HTTPS, staging versus launch, Search Console and compliance checks.

```bash
npm run test:seo
```

The SEO tests check the custom-domain URLs, preview guards, CNAME, structured metadata and sitemap. The remaining browser QA tests may require Chromium/Puppeteer setup.

## Notes

- Design previews are not a substitute for verified real-world product photos.
- Demo and OEM contact forms require a verified server/CRM destination before commercial launch.
- No analytics configured yet. Google Fonts is a third-party resource.
