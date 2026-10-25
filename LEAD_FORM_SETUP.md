# Procomm Dynamics — native HTML email enquiries

## Selected architecture

The lab demo and OEM partnership forms are **native HTML** served by GitHub Pages. They submit directly to **FormSubmit (formsubmit.co)** via ordinary HTML POST. FormSubmit forwards the lead to **info@procommdynamics.com** after the recipient email address is activated. No Procomm CRM or custom database is required for this pilot.

**This is a third-party email relay**, not a fully offline or serverless native-only solution. An HTML form on GitHub Pages alone cannot send email.

### Included behavior

- `contact.html`: FlexiFlow demo form.
- `reactor-makers.html`: OEM partnership form.
- Clear form-specific email subjects; anti-spam honeypot; reCAPTCHA enabled by provider default.
- Browser-only draft recovery: `js/main.js` stores unfinished fields in `localStorage` (namespaced per form), debounced on input and additionally on pagehide.
- Drafts are restored after refresh or accidental navigation. When the visitor revisits after more than seven days, the draft is discarded; it can also be cleared manually. Browser storage is not encrypted, and private mode or site data clearing can prevent recovery.
- Form is submitted through a normal POST. The draft is **not** cleared when the visitor clicks Submit. If the provider redirects to `thanks.html?form=demo` or `thanks.html?form=oem` in the same tab within 30 minutes, `js/thanks.js` clears the matching draft and reports provider acceptance. This is an indicative browser flow, not a cryptographic receipt or proof of email inbox delivery.
- We do not collect or store leads on a Procomm-owned database, but the third-party provider temporarily handles and retains submitted data and the recipient mailbox retains the delivered email.
- Never submit confidential formulas, SOP secrets, customer data or sensitive scientific research content through this general-purpose enquiry form.

## One-time activation (required)

1. Make sure **info@procommdynamics.com** is a real, monitored Zoho Workplace mailbox.
2. Deploy the GitHub Pages PR and verify that the custom domain has HTTPS enabled.
3. Submit a **test demo enquiry** from `contact.html`.
4. Find the FormSubmit activation email in the recipient mailbox (also check spam/quarantine) and confirm it. FormSubmit says submissions made before activation are held until activation.
5. Submit a second test lead to each form: one demo and one OEM partnership. Confirm **both emails arrive**, with the expected fields and subject line, and verify that a successful POST returns to the thank-you page.
6. Enter a partial enquiry, reload the browser, confirm fields restore; click **Clear saved draft** and confirm that the data disappears.
7. Force a failed submit (e.g., disconnect network) and confirm that the draft is retained.

Do not call the forms fully operational before these tests pass. A FormSubmit redirect is not proof that SMTP delivery into Zoho Mail succeeded.

## Vendor / privacy

- Provider: https://formsubmit.co/ — not FormSubmit.io or FormSubmit.app (different services).
- Provider documentation: https://formsubmit.co/documentation
- Provider privacy policy: https://formsubmit.co/privacy.pdf
- Provider publicly states a **30-day submission archive**.
- Consider publishing a Procomm privacy notice explaining email relay processing, local browser drafts, retention and contact information before production launch.
- Replace FormSubmit with a controlled endpoint in future if the company requires server-side retention, compliance, account-level access control or data residency commitments.

## SEO and Go-Live

`index.html` and the other nine primary pages continue to use **noindex** during prelaunch. Remove that only after commercial readiness and HTTPS are verified. `thanks.html` should always remain **noindex**.
