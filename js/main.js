/* Procomm Dynamics — site behaviour
 *
 * Contact form: set FORM_ENDPOINT to your Zoho Forms (or other) URL to POST
 * as application/x-www-form-urlencoded. Leave empty to fall back to mailto.
 * Zoho: Forms → Share → embed / permalink; map field names to the form ids below.
 */
(function () {
  "use strict";

  var FORM_ENDPOINT = "";
  var MAILTO = "info@procommdynamics.com";

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

  /* Hero parallax on reactor scene */
  var scene = document.getElementById("scene");
  if (scene && !prefersReduced) {
    var hero = document.querySelector(".hero");
    window.addEventListener(
      "scroll",
      function () {
        if (!hero) return;
        var rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var y = Math.min(24, Math.max(-12, -rect.top * 0.06));
        scene.style.transform = "translate3d(0," + y + "px,0)";
      },
      { passive: true }
    );
  }

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
      if (toast) {
        toast.classList.remove("flash");
        void toast.offsetWidth;
        toast.classList.add("flash");
      }
      scene.classList.remove("deciding");
      void scene.offsetWidth;
      scene.classList.add("deciding");
    }

    if ($("t-time")) $("t-time").textContent = stamp();
    mi = -1;
    decide();
    setInterval(decide, 6000);
  }

  /* Scroll-scrubbed With us / Without us timeline (MicroAGI-style) */
  (function () {
    var sec = document.getElementById("overnightSec");
    if (!sec) return;

    var rows = Array.prototype.map.call(sec.querySelectorAll(".tlx__row"), function (row) {
      return {
        track: row.querySelector(".tlx__track"),
        head: row.querySelector(".tlx__head"),
        full: row.querySelector(".tlx__prog--full"),
        dash: row.querySelector(".tlx__prog--dash"),
        solid: row.querySelector(".tlx__prog--solid"),
        slow: row.classList.contains("tlx__row--without"),
        nodes: Array.prototype.slice.call(row.querySelectorAll(".tlx__node")),
        tw: 1,
        offs: [],
        boundary: 1,
        on: [],
      };
    });

    var travel = 1;
    var sticky = sec.querySelector(".tl-scrub__sticky");
    var stickyTop = 78;

    function showComplete() {
      rows.forEach(function (r) {
        if (r.head) {
          r.head.style.transform =
            "translate3d(" + r.tw + "px,0,0) translate(-50%,-50%)";
        }
        if (r.full) r.full.style.transform = "scaleX(1)";
        if (r.dash) r.dash.style.transform = "scaleX(1)";
        if (r.solid) r.solid.style.transform = "scaleX(1)";
        r.nodes.forEach(function (n) {
          n.classList.add("on");
        });
      });
    }

    function measure() {
      if (sticky) {
        var topVal = parseFloat(window.getComputedStyle(sticky).top);
        stickyTop = isNaN(topVal) ? 78 : topVal;
      }
      travel = Math.max(1, sec.offsetHeight - (window.innerHeight - stickyTop));
      rows.forEach(function (r) {
        r.tw = (r.track && r.track.getBoundingClientRect().width) || 1;
        r.offs = r.nodes.map(function (n) {
          return n.offsetLeft;
        });
        r.boundary = r.nodes[3] ? r.offs[3] : r.tw;
        r.on = r.nodes.map(function () {
          return null;
        });
        if (r.full) r.full.style.width = r.tw + "px";
        if (r.dash) r.dash.style.width = r.boundary + "px";
        if (r.solid) {
          r.solid.style.left = r.boundary + "px";
          r.solid.style.width = Math.max(1, r.tw - r.boundary) + "px";
        }
      });
      frame();
    }

    function frame() {
      /* Reduced motion: show finished comparison, no scrub */
      if (prefersReduced) {
        showComplete();
        return;
      }

      var top = sec.getBoundingClientRect().top;
      var p = (stickyTop - top) / travel;
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      /* With us completes early and holds; Without trails; sticky stays until end */
      rows.forEach(function (r) {
        var q;
        if (r.slow) {
          q = Math.pow(Math.min(1, Math.max(0, (p - 0.06) / 0.94)), 1.4);
        } else {
          q = Math.min(1, p / 0.38);
        }
        var headX = q * r.tw;
        if (r.head) {
          r.head.style.transform =
            "translate3d(" + headX + "px,0,0) translate(-50%,-50%)";
        }
        if (r.full) r.full.style.transform = "scaleX(" + q + ")";
        if (r.dash) {
          r.dash.style.transform =
            "scaleX(" + Math.min(1, headX / Math.max(1, r.boundary)) + ")";
        }
        if (r.solid) {
          var d = r.tw - r.boundary;
          r.solid.style.transform =
            "scaleX(" + (d > 0 ? Math.max(0, (headX - r.boundary) / d) : 0) + ")";
        }
        r.nodes.forEach(function (n, i) {
          var on = headX >= r.offs[i] - 2;
          if (r.on[i] !== on) {
            n.classList.toggle("on", on);
            r.on[i] = on;
          }
        });
      });
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (prefersReduced) return;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          frame();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  })();

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

  /* Contact / demo form */
  var form = document.getElementById("demo-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      var success = document.getElementById("form-success");
      var name = (form.querySelector("#name") || {}).value || "";
      var org = (form.querySelector("#org") || {}).value || "";
      var email = (form.querySelector("#email") || {}).value || "";
      var size = (form.querySelector("#reactor-size") || {}).value || "";
      var type = (form.querySelector("#reactor-type") || {}).value || "";
      var instruments = (form.querySelector("#instruments") || {}).value || "";
      var message = (form.querySelector("#message") || {}).value || "";

      form.querySelectorAll(".field-error").forEach(function (el) {
        el.remove();
      });
      form.querySelectorAll("[aria-invalid]").forEach(function (el) {
        el.removeAttribute("aria-invalid");
      });

      var ok = true;
      function fail(id, msg) {
        var field = form.querySelector("#" + id);
        if (!field) return;
        field.setAttribute("aria-invalid", "true");
        var err = document.createElement("p");
        err.className = "field-error";
        err.textContent = msg;
        field.parentNode.appendChild(err);
        ok = false;
      }

      if (!name.trim()) fail("name", "Please enter your name.");
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        fail("email", "Please enter a valid email.");
      }
      if (!ok) {
        if (note) note.textContent = "Please fix the highlighted fields.";
        return;
      }

      var payload = {
        name: name.trim(),
        organisation: org.trim(),
        email: email.trim(),
        reactor_type: type.trim(),
        reactor_size: size.trim(),
        instruments: instruments.trim(),
        message: message.trim(),
      };

      function showSuccess() {
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus();
        }
      }

      if (FORM_ENDPOINT) {
        var body = Object.keys(payload)
          .map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(payload[k]);
          })
          .join("&");
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body,
        })
          .then(function (res) {
            if (!res.ok) throw new Error("submit failed");
            showSuccess();
          })
          .catch(function () {
            if (note) {
              note.textContent =
                "Could not reach the form endpoint. Opening email instead…";
            }
            window.location.href =
              "mailto:" +
              MAILTO +
              "?subject=" +
              encodeURIComponent("Demo request — " + (org || name || "lab")) +
              "&body=" +
              encodeURIComponent(
                [
                  "Name: " + payload.name,
                  "Organisation: " + payload.organisation,
                  "Email: " + payload.email,
                  "Reactor type: " + payload.reactor_type,
                  "Reactor size: " + payload.reactor_size,
                  "Instruments: " + payload.instruments,
                  "",
                  payload.message,
                ].join("\n")
              );
          });
        return;
      }

      window.location.href =
        "mailto:" +
        MAILTO +
        "?subject=" +
        encodeURIComponent("Demo request — " + (org || name || "lab")) +
        "&body=" +
        encodeURIComponent(
          [
            "Name: " + payload.name,
            "Organisation: " + payload.organisation,
            "Email: " + payload.email,
            "Reactor type: " + payload.reactor_type,
            "Reactor size: " + payload.reactor_size,
            "Instruments: " + payload.instruments,
            "",
            payload.message,
          ].join("\n")
        );
      showSuccess();
    });
  }

  /* OEM partner form (reactor-makers) — distinct from demo form */
  var partnerForm = document.getElementById("partner-form");
  if (partnerForm) {
    partnerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = partnerForm.querySelector(".form-note");
      var success = document.getElementById("partner-success");
      var name = (partnerForm.querySelector("#p-name") || {}).value || "";
      var role = (partnerForm.querySelector("#p-role") || {}).value || "";
      var company = (partnerForm.querySelector("#p-company") || {}).value || "";
      var email = (partnerForm.querySelector("#p-email") || {}).value || "";
      var website = (partnerForm.querySelector("#p-website") || {}).value || "";
      var product = (partnerForm.querySelector("#p-product") || {}).value || "";
      var volume = (partnerForm.querySelector("#p-volume") || {}).value || "";
      var region = (partnerForm.querySelector("#p-region") || {}).value || "";
      var message = (partnerForm.querySelector("#p-message") || {}).value || "";

      partnerForm.querySelectorAll(".field-error").forEach(function (el) {
        el.remove();
      });
      partnerForm.querySelectorAll("[aria-invalid]").forEach(function (el) {
        el.removeAttribute("aria-invalid");
      });

      var ok = true;
      function fail(id, msg) {
        var field = partnerForm.querySelector("#" + id);
        if (!field) return;
        field.setAttribute("aria-invalid", "true");
        var err = document.createElement("p");
        err.className = "field-error";
        err.textContent = msg;
        field.parentNode.appendChild(err);
        ok = false;
      }

      if (!name.trim()) fail("p-name", "Please enter your name.");
      if (!company.trim()) fail("p-company", "Please enter your company.");
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        fail("p-email", "Please enter a valid work email.");
      }
      if (!ok) {
        if (note) note.textContent = "Please fix the highlighted fields.";
        return;
      }

      var payload = {
        form_type: "oem_partner",
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        email: email.trim(),
        website: website.trim(),
        product_line: product.trim(),
        volume_interest: volume.trim(),
        region: region.trim(),
        message: message.trim(),
      };

      function showPartnerSuccess() {
        partnerForm.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus();
        }
      }

      var bodyLines = [
        "Form: OEM partnership enquiry",
        "Name: " + payload.name,
        "Role: " + payload.role,
        "Company: " + payload.company,
        "Email: " + payload.email,
        "Website: " + payload.website,
        "Product line: " + payload.product_line,
        "Volume interest: " + payload.volume_interest,
        "Region: " + payload.region,
        "",
        payload.message,
      ];

      if (FORM_ENDPOINT) {
        var body = Object.keys(payload)
          .map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(payload[k]);
          })
          .join("&");
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body,
        })
          .then(function (res) {
            if (!res.ok) throw new Error("submit failed");
            showPartnerSuccess();
          })
          .catch(function () {
            if (note) {
              note.textContent =
                "Could not reach the form endpoint. Opening email instead…";
            }
            window.location.href =
              "mailto:" +
              MAILTO +
              "?subject=" +
              encodeURIComponent(
                "OEM partnership enquiry — " + (payload.company || payload.name)
              ) +
              "&body=" +
              encodeURIComponent(bodyLines.join("\n"));
          });
        return;
      }

      window.location.href =
        "mailto:" +
        MAILTO +
        "?subject=" +
        encodeURIComponent(
          "OEM partnership enquiry — " + (payload.company || payload.name)
        ) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));
      showPartnerSuccess();
    });
  }
})();
