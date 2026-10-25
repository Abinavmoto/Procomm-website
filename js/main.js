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
    var stickyTop = 114;

    function measure() {
      if (sticky) {
        var t = parseFloat(window.getComputedStyle(sticky).top);
        stickyTop = isNaN(t) ? 114 : t;
      }
      // Scroll distance while the sticky panel stays locked under the nav
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
      if (prefersReduced) {
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
        return;
      }

      // Progress starts when the sticky panel locks under the nav (not at y=0)
      var top = sec.getBoundingClientRect().top;
      var p = (stickyTop - top) / travel;
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      rows.forEach(function (r) {
        // With us runs slightly ahead; Without us trails (pow curve) — both finish by the end
        var q = r.slow ? Math.pow(p, 1.75) : Math.min(1, p * 1.12);
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
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        frame();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    measure();
  })();

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
