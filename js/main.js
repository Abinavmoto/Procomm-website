/* Procomm Dynamics — site behaviour and native enquiry draft recovery */
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

  /* The hero uses a static, clearly labelled illustration for reliable mobile rendering. */

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
   * Native HTML email forms + local-only draft recovery.
   * Submissions use FormSubmit's normal POST flow, preserving CAPTCHA and
   * the provider's real redirect. No client-side claim of email delivery.
   * Only a same-tab return from the configured thank-you redirect can
   * clear the local draft; failed/aborted sends keep the unsent answers.
   */
  (function () {
    var TTL = 7 * 24 * 60 * 60 * 1000;
    function draftKey(kind) { return "procomm:enquiry:" + kind + ":v1"; }
    function pendingKey(kind) { return "procomm:pending:" + kind + ":v1"; }

    function enableDrafts(formId, kind) {
      var form = document.getElementById(formId);
      if (!form) return;
      var status = form.querySelector(".form-draft-status");
      var clear = form.querySelector(".clear-draft");
      var timer;
      var controls = Array.prototype.filter.call(form.elements, function (el) {
        return Boolean(el.name && el.name.charAt(0) !== "_" &&
          el.name !== "form_type" && !el.disabled &&
          (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA") &&
          (el.type === "text" || el.type === "email" || el.type === "url" ||
           el.tagName === "SELECT" || el.tagName === "TEXTAREA"));
      });

      function tell(message) { if (status) status.textContent = message; }
      function collect() {
        var values = {};
        controls.forEach(function (el) {
          values[el.name] = String(el.value || "").slice(0, 6000);
        });
        return values;
      }

      function store() {
        clearTimeout(timer);
        try {
          var values = collect();
          if (!Object.keys(values).some(function (k) { return values[k].trim(); })) {
            localStorage.removeItem(draftKey(kind));
            tell("No unfinished draft is stored.");
            return;
          }
          localStorage.setItem(draftKey(kind), JSON.stringify({
            savedAt: Date.now(), values: values
          }));
          tell("Draft saved on this device. It can be restored for up to 7 days.");
        } catch (error) {
          tell("This browser isn't allowing draft storage. Keep this page open until you send.");
        }
      }

      try {
        var raw = localStorage.getItem(draftKey(kind));
        if (raw) {
          var draft = JSON.parse(raw);
          if (!draft || !draft.savedAt || Date.now() - draft.savedAt > TTL ||
              draft.savedAt > Date.now() + 60000 || !draft.values) {
            localStorage.removeItem(draftKey(kind));
          } else {
            controls.forEach(function (el) {
              if (Object.prototype.hasOwnProperty.call(draft.values, el.name) &&
                  typeof draft.values[el.name] === "string") {
                el.value = draft.values[el.name];
              }
            });
            tell("Your unfinished draft has been restored on this device.");
          }
        }
      } catch (error) {
        tell("Draft recovery isn't available in this browser.");
      }

      function queueSave() { clearTimeout(timer); timer = setTimeout(store, 250); }
      form.addEventListener("input", queueSave);
      form.addEventListener("change", store);
      window.addEventListener("pagehide", function () {
        clearTimeout(timer);
        store();
      });

      if (clear) {
        clear.addEventListener("click", function () {
          clearTimeout(timer);
          form.reset();
          try { localStorage.removeItem(draftKey(kind)); } catch (error) {}
          try { sessionStorage.removeItem(pendingKey(kind)); } catch (error) {}
          tell("Draft cleared from this device.");
        });
      }

      form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) return;
        /* Empty honeypot is enforced by the provider, not submitted as a draft. */
        store();
        try {
          sessionStorage.setItem(pendingKey(kind), JSON.stringify({
            savedAt: Date.now(), form: kind
          }));
        } catch (error) {}
        tell("Submitting securely. Your draft will be kept unless the service confirms acceptance.");
        /* Native form POST proceeds to FormSubmit; no mailto and no fake success. */
      });
    }

    enableDrafts("demo-form", "demo");
    enableDrafts("partner-form", "oem");
  })();
})();
