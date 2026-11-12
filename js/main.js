// Huddle Hire: shared site behaviour for header state, mobile nav, scroll reveal, forms.

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Header scroll state */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav toggle */
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    var closeNav = function () {
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.setProperty("--i", i % 6);
        observer.observe(el);
      });
    }
  }

  /* Hero graphic: gentle parallax tied to scroll position */
  var heroGraphics = document.querySelectorAll(".hero-graphic");
  if (heroGraphics.length && !prefersReduced) {
    var onHeroParallax = function () {
      var offset = Math.min(window.scrollY * 0.18, 80) + "px";
      heroGraphics.forEach(function (g) { g.style.setProperty("--parallax", offset); });
    };
    onHeroParallax();
    window.addEventListener("scroll", onHeroParallax, { passive: true });
  }

  /* Tilt: cards and testimonials lean toward the cursor on hover */
  if (hasFinePointer && !prefersReduced) {
    var initTilt = function (selector, maxDeg) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.addEventListener("mouseenter", function () { el.classList.add("is-tilting"); });
        el.addEventListener("mousemove", function (e) {
          var rect = el.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;
          el.style.transform =
            "perspective(900px) rotateX(" + (-py * maxDeg).toFixed(2) + "deg) rotateY(" +
            (px * maxDeg).toFixed(2) + "deg) translateY(-6px)";
        });
        el.addEventListener("mouseleave", function () {
          el.classList.remove("is-tilting");
          el.style.transform = "";
        });
      });
    };
    initTilt(".card", 7);
    initTilt(".testimonial", 5);

    /* Magnetic buttons: nudge toward the cursor within their own bounds */
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.25 - 2;
        btn.style.transform = "translate(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* Contact page: forms open in place when their button is clicked */
  document.querySelectorAll(".contact-toggle").forEach(function (btn) {
    var wrap = document.getElementById(btn.getAttribute("aria-controls"));
    if (!wrap) return;
    btn.addEventListener("click", function () {
      var willOpen = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(willOpen));
      wrap.classList.toggle("is-open", willOpen);
      if (willOpen) {
        window.setTimeout(function () {
          btn.closest(".contact-panel").scrollIntoView({ behavior: "smooth", block: "start" });
          var firstField = wrap.querySelector("input, textarea");
          if (firstField) firstField.focus({ preventScroll: true });
        }, 120);
      }
    });
  });
  if (location.hash === "#employers" || location.hash === "#candidates") {
    var hashToggle = document.querySelector(location.hash + " .contact-toggle");
    if (hashToggle) window.setTimeout(function () { hashToggle.click(); }, 50);
  }

  /* Form handling: builds a pre-filled email to the address in data-email-to
     and hands it to the visitor's own mail app via a mailto: link. Nothing is
     uploaded or sent to any server or third party. The browser never makes a
     network request for this. A CV file can't be attached automatically (mailto
     doesn't support attachments), so the candidate form asks the visitor to
     attach it themselves before sending. */
  var forms = document.querySelectorAll("form[data-email-form]");
  forms.forEach(function (form) {
    var status = form.querySelector(".form-status");
    var destination = form.getAttribute("data-email-to");
    var subject = form.getAttribute("data-email-subject") || "Enquiry from the Huddle Hire website";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrapper = field.closest(".field");
        var isEmpty = field.type === "file" ? field.files.length === 0 : !field.value.trim();
        if (isEmpty) {
          valid = false;
          if (wrapper) wrapper.classList.add("has-error");
        } else if (wrapper) {
          wrapper.classList.remove("has-error");
        }
      });

      var emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);
        var wrapper = emailField.closest(".field");
        if (!emailOk) {
          valid = false;
          if (wrapper) wrapper.classList.add("has-error");
        }
      }

      if (!status) return;

      if (!valid) {
        status.textContent = "Please fill in the required fields correctly.";
        status.classList.remove("is-success");
        status.classList.add("is-error");
        status.setAttribute("role", "alert");
        return;
      }

      var cvField = form.querySelector('input[type="file"]');
      var lines = [];
      form.querySelectorAll("input[name], textarea[name]").forEach(function (field) {
        if (field.type === "file") return;
        var value = field.value.trim();
        if (!value) return;
        var label = form.querySelector('label[for="' + field.id + '"]');
        lines.push((label ? label.textContent.trim() : field.name) + ": " + value);
      });
      if (cvField && cvField.files.length) {
        lines.push("CV file (please attach before sending): " + cvField.files[0].name);
      }

      var mailtoUrl =
        "mailto:" + destination +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      status.textContent =
        "Your email app should now open with this enquiry addressed to " + destination + ". Just hit send there." +
        (cvField ? " Remember to attach your CV before sending, as it can't be attached automatically." : "") +
        " If nothing opens, please email us directly.";
      status.classList.remove("is-error");
      status.classList.add("is-success");
      status.setAttribute("role", "status");

      window.location.href = mailtoUrl;
      form.reset();
    });
  });
})();
