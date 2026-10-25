/* Procomm Dynamics — site behaviour */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || navigator.webdriver || location.hash === "#static") {
    document.documentElement.classList.add(prefersReduced ? "reduced" : "static");
  }

  /* Freeze SVG SMIL animations when reduced motion is preferred */
  if (prefersReduced) {
    document.querySelectorAll("animate, animateMotion, animateTransform").forEach(function (el) {
      try {
        el.endElement();
      } catch (err) {
        el.remove();
      }
    });
  }

  /* Sticky nav border on scroll */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("sc", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

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

  /* Hero illustrative simulation */
  var scene = document.getElementById("scene");
  if (scene && !prefersReduced) {
    var $ = function (id) {
      return document.getElementById(id);
    };
    var toast = $("toast");
    var t = 0;
    var dose = 18.2;
    var msgs = [
      "Hold extended +4 min: temperature not yet stable",
      "Dose rate held at 0.74 mL/min: T_reactor within band",
      "Stirrer torque nominal: continue step 05",
      "Ramp paused 20 s: jacket lagging setpoint",
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
      if (dose > 33.3) dose = 18.2;
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

  /* Contact form → mailto */
  var form = document.getElementById("demo-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector("#name") || {}).value || "";
      var org = (form.querySelector("#org") || {}).value || "";
      var email = (form.querySelector("#email") || {}).value || "";
      var size = (form.querySelector("#reactor-size") || {}).value || "";
      var type = (form.querySelector("#reactor-type") || {}).value || "";
      var message = (form.querySelector("#message") || {}).value || "";
      var note = form.querySelector(".form-note");

      if (!email) {
        if (note) note.textContent = "Please enter an email address.";
        return;
      }

      var body = [
        "Name: " + name,
        "Organisation: " + org,
        "Email: " + email,
        "Reactor size: " + size,
        "Reactor type: " + type,
        "",
        message,
      ].join("\n");

      var mailto =
        "mailto:hello@procommdynamics.com?subject=" +
        encodeURIComponent("Demo request — " + (org || name || "lab")) +
        "&body=" +
        encodeURIComponent(body);

      if (note) {
        note.textContent =
          "Opening your email client… Swap form action for Zoho when ready.";
      }
      window.location.href = mailto;
    });
  }
})();
