# Procomm Dynamics website

Static marketing site for **Procomm Dynamics** — Machines with Context.

Product: **FlexiFlow**. Controller: **FlexiConnect**.

## Local preview

```bash
python3 -m http.server 8080
```

## GitHub Pages

Deploy from branch `main`, folder `/ (root)`.

https://abinavmoto.github.io/Procomm-website/

## SEO and launch readiness

See [SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md) before enabling indexing.

Note: this project lives under a GitHub Pages **subdirectory**. The repository `robots.txt` is not served from the host root and therefore cannot control crawling at this preview URL; the per-page `noindex` meta directives are the effective exclusion.

## Notes

- Design preview: `noindex`, `robots.txt` Disallow, fixed preview bar.
- No analytics. Google Fonts only as third-party.
- Drop final FlexiConnect product images into `assets/img/` when ready.
