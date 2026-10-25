/* Procomm Dynamics — site behaviour
 *
 * Contact form: set FORM_ENDPOINT only to a verified, CORS-capable API endpoint
 * accepting application/x-www-form-urlencoded and returning 2xx after storing the lead.
 * A Zoho Forms share/permalink URL is NOT itself a supported POST endpoint.
 * When blank, the form is hidden and a clearly labeled contact alternative is shown.
 */
(function () {
  "use strict";

  var FORM_ENDPOINT = "";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || navigator.webdriver || location.hash === "#static") {
    document.documentElement.classList.add(prefersReduced ? "reduced" : "static");
  }

  if (prefersReduced) {
    document.querySelectorAll("animate, animateMotion, animateTransform").forEach(function (el) {
      try {
        el.endElement();
      } catch (err) {
        el.remove();
      }
    });
  }

  /* Top progress bar */
  var progress = document.getElementById("read-progress");
  function updateProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
  }

  /* Sticky nav shrink */
  var nav = document.getElementById("nav");
  function onScrollChrome() {
    if (nav) nav.classList.toggle("sc", window.scrollY > 10);
    if (nav) nav.classList.toggle("nav-shrink", window.scrollY > 40);
    updateProgress();
    var topBtn = document.getElementById("back-top");
    if (topBtn) topBtn.classList.toggle("show", window.scrollY > 600);
  }
  onScrollChrome();
  window.addEventListener("scroll", onScrollChrome, { passive: true });

  /* Mobile menu */
  var burger = document.getElementById("burger");
  var links = document.getElementById("links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Back to top */
  var backTop = document.getElementById("back-top");
  if (backTop) {
    backTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* Scroll reveals */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".rv").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".rv").forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Soft page enter */
  document.documentElement.classList.add("page-ready");

  /* Keep the hardware illustration stationary on scroll to avoid mobile flicker. */
  var scene = document.getElementById("scene");

  /* Hero illustrative simulation — recipe-engine events only */
  if (scene && !prefersReduced) {
    var $ = function (id) {
      return document.getElementById(id);
    };
    var toast = $("toast");
    var t = 0;
    var dose = 18.4;
    var msgs = [
      "Step 4 · Seed · hold 30 min",
      "Dose 18.4 / 33.3 mL",
      "Step 5 · Antisolvent dose in progress",
      "Step 3 · Cool to 60 °C at 0.2 °C/min",
    ];
    var mi = 0;
    var pad = function (n) {
      return String(n).padStart(2, "0");
    };
    var stamp = function () {
      var d = new Date();
      return (
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes()) +
        ":" +
        pad(d.getSeconds()) +
        "." +
        String(d.getMilliseconds()).padStart(3, "0")
      );
    };

    setInterval(function () {
      t += 1;
      if ($("v-tr"))
        $("v-tr").textContent = (
          62.4 +
          Math.sin(t / 3) * 0.18 +
          (Math.random() - 0.5) * 0.06
        ).toFixed(1);
      if ($("v-tj"))
        $("v-tj").textContent = (58.1 + Math.sin(t / 4 + 1) * 0.25).toFixed(1);
      if ($("v-rpm"))
        $("v-rpm").textContent = String(Math.round(300 + (Math.random() - 0.5) * 4));
      dose += 0.12;
      if (dose > 33.3) dose = 18.4;
      if ($("v-dose")) $("v-dose").textContent = dose.toFixed(1);
    }, 900);

    function decide() {
      mi = (mi + 1) % msgs.length;
      if ($("t-msg")) $("t-msg").textContent = msgs[mi];
      if ($("t-time")) $("t-time").textContent = stamp();
      /* Update illustrative text without flashing the product render. */
    }

    if ($("t-time")) $("t-time").textContent = stamp();
    mi = -1;
    decide();
    setInterval(decide, 6000);
  }

  /* The overnight comparison is now fully visible and requires no scroll-scrub. */

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
    });
  });

  /*
   * Enquiry forms require a real, verified server/CRM endpoint.
   * GitHub Pages does not process POST requests. Hide nonfunctional forms
   * until an authorised endpoint is configured; never misreport a mailto draft
   * as a submitted enquiry or unexpectedly open the user's mail client.
   */
  function setupEnquiryForm(formId, unavailableId, successId, type) {
    var form = document.getElementById(formId);
    if (!form) return;
    var note = form.querySelector(".form-note");
    var unavailable = document.getElementById(unavailableId);
    var success = document.getElementById(successId);
    if (!FORM_ENDPOINT) {
      form.hidden = true;
      if (unavailable) unavailable.hidden = false;
      return;
    }
    if (unavailable) unavailable.hidden = true;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = true;
      if (note) note.textContent = "Sending enquiry…";
      var params = new URLSearchParams(new FormData(form));
      params.set("form_type", type);
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Unable to accept enquiry");
          form.hidden = true;
          if (success) {
            success.hidden = false;
            success.focus();
          }
        })
        .catch(function () {
          if (note) note.textContent = "The online enquiry could not be sent. Your details are still in the form; please retry or contact us using the email link.";
        })
        .finally(function () {
          if (submit) submit.disabled = false;
        });
    });
  }

  setupEnquiryForm("demo-form", "demo-form-unavailable", "form-success", "lab_demo");
  setupEnquiryForm("partner-form", "partner-form-unavailable", "partner-success", "oem_partner");
})();
