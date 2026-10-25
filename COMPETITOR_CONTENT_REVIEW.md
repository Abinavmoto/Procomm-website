# Procomm Dynamics — competitor-informed website review (26 October 2026)

**Purpose:** Review category expectations and truthful product positioning; do not copy competitor wording or assert unverified product features.

## Reviewed first-party sources

| Company/product | Official source | Site messaging / capability evidence | What Procomm should say now |
|---|---|---|---|
| Radleys AVA | https://www.radleys.com/range/ava-software/ | Control for jacketed lab reactors; device integration (circulators, stirrers, pumps, sensors); recipes; data logging and safety, with AVA Pad and PC versions | Clear software/controller distinction; targeted jacketed-reactor automation, **not** 'any reactor', universal compatibility, subscription-free claim or validated unattended operation |
| Mettler Toledo RX-10 | https://www.mt.com/in/en/home/products/L1_AutochemProducts/automated-reactor-control-systems/rx-10-reactor-control-3m.html | Touchscreen retrofit, data capture, connected instruments, programmed procedures and safety functions | Existing-reactor retrofit scenario and process records are valuable benefits; do **not** claim 100% capture or always-on autonomous safety |
| HITEC ZANG LabManager + LabVision | https://www.hitec-zang.de/en/product/labmanager/ | Lab hardware automation, connected equipment, graphically controlled recipes, data and reports | Describe recipes in software + controller-side execution and list only known physical interfaces. LabManager's broad device drivers are not Procomm-certified compatibility |
| microagi homepage | https://www.microagi.ai/ | Bold mission headline followed by a two-product hierarchy and succinct contact area | Use brand-forward hero **Experience truly automated.**, **then** FlexiFlow/FlexiConnect without a long homepage feature inventory |

## Findings, implemented on QA branch
1. Homepage has a clear brand statement, followed immediately by two distinct product panels.
2. Hero subheading explicitly says **existing jacketed glass reactors** and identifies FlexiFlow + FlexiConnect, including accurate development language.
3. Product status labels: **Development preview** (FlexiFlow) and **Design preview** (FlexiConnect).
4. The hardware page uses **DB9** (not DB15), and one Ethernet interface as a design target; compatibility is clearly under assessment.
5. Applications stay focused on **chemical synthesis and crystallisation** and label the example recipe illustrative.
6. Automated and visually inspected responsive browser checks verify the rendered page in Chromium; browser acceptance tests live in `scripts/visual-qa.mjs`.

## Marketing copy policy / guardrails
- **May describe design intent:** planned ramps, holds, dosing, sensor capture, local execution, operator run histories and audit-trail *design*.
- **Must not imply shipped or validated:** 21 CFR Part 11 compliance, safe unattended 24/7 operation, 100% data capture, plug-and-play compatibility, certifications, universal integration, real customer case studies, pricing or independent safety certification until documented evidence exists.
- **Do not fabricate:** named laboratory customers, compatible chiller models, testimonials, demo recordings, launch dates or test metrics.
- **Commercial conversion still requires:** verified mailbox `info@procommdynamics.com`, FormSubmit activation and a real end-to-end email-delivery test.

## Backlog for later, after engineering validation
- Proven compatibility matrix by make/model and driver.
- Verified photographs and bench demonstration of hardware and UI, not concept renders.
- Demonstration recipe + actual run CSV/report with traceability.
- Measured setup and wiring steps; operator training and power-loss behavior.
- Customer demonstration / case study approved for public reference.

This document records competitive context and editorial decisions, not an endorsement or equivalence claim.
