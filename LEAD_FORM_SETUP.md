# Enquiry form activation — FlexiFlow / Procomm Dynamics

**Status:** Needs a real lead endpoint. GitHub Pages is static hosting and does not process submitted forms itself.

## What this website does today

- The visible website no longer launches the visitor's email application without warning.
- Until `FORM_ENDPOINT` is configured in `js/main.js`, the demo and OEM forms are **hidden**, and each contact page shows the company email as a **clearly labelled manual fallback**.
- This is intentionally conservative. No lead is stored by merely opening a browser email draft.
- A generic 2xx response from an endpoint is treated as acceptance **only if the service actually persists the lead**. Verify that end to end.

## Recommended production setup

**Option A: Zoho Forms hosted/embedded form (simplest)**

1. Build a **Lab Demo Enquiry** form in Zoho Forms with: name, organisation, email, reactor type, reactor size, instruments to connect and message.
2. Build a separate **OEM Partnership Enquiry** form with: name, role, company, work email, website, product line, yearly volume interest, region and message.
3. Enable supported Zoho CRM integration, correct notification routing, spam protection and privacy/consent settings inside Zoho Forms.
4. Replace each existing placeholder with the official **Zoho Forms embed/iframe** for the respective form. Avoid embedding an unverified public share URL as an arbitrary POST endpoint.
5. Test on mobile: submit a real test lead, confirm Zoho Forms stores it, CRM receives it (if configured), notifications are delivered, and the visitor sees an actual success state.

**Option B: Your own secure API/edge worker**

1. Deploy an HTTPS endpoint (e.g. a managed serverless function) that accepts `application/x-www-form-urlencoded` and `form_type`.
2. Validate and limit inputs, reject spam, enforce rate limits and origin/CORS checks, protect against bots, and handle consent/privacy terms.
3. Send leads to Zoho CRM or a verified mailbox **server-side**, with secrets only in the server environment.
4. Return 2xx **only after** the lead was accepted/persisted. Return a non-2xx error on failure so the browser keeps the entered details and displays a retry path.
5. Set `FORM_ENDPOINT` in `js/main.js` to the verified public endpoint; confirm it accepts both lab-demo and OEM enquiry payloads.
6. Verify cross-origin requests in Safari/iOS and on the actual custom domain.

**Never expose a Zoho OAuth token, CRM API key, private webhook secret or SMTP password in GitHub Pages JavaScript.**

## Promise / conversion copy
Use: *“Tell us about your reactor and instruments. Once an online enquiry is successfully received, we review the details and follow up by email.”*  
Do **not** promise a fixed response time until the team establishes an internal follow-up SLA.

## Additional before-launch tasks
- Verify that `info@procommdynamics.com` actually exists and is monitored.
- Publish appropriate privacy information, including where enquiry data is processed, if applicable.
- Test screen readers, form keyboard navigation and errors; verify on actual iPhone Safari.
- Keep the product preview `noindex` until commercial launch is approved.
