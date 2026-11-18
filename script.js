/* =====================================================
   SUVRENO OFFICIAL WEBSITE — Frontend Controller (v2)
   همه‌ی بخش‌ها ایزوله‌اند؛ خطای یکی بقیه را نمی‌شکند.
   ===================================================== */
(function () {
  "use strict";

  function safe(label, fn) {
    try { fn(); } catch (e) { console.error("Suvreno site:", label, e); }
  }

  var THEME_KEY = "SUVRENO_SITE_THEME";

  /* ================= THEME TOGGLE ================= */
  safe("theme", function () {
    var root = document.documentElement;

    function applyTheme(t) {
      root.setAttribute("data-theme", t);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", t === "light" ? "#f3f8fa" : "#060a14");
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "تغییر تم تیره/روشن");
    btn.innerHTML =
      '<svg class="ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });

    var actions = document.querySelector(".navbar-actions");
    var pageLinks = document.querySelector(".page-header-links");
    if (actions) {
      actions.insertBefore(btn, actions.firstChild);
    } else if (pageLinks) {
      pageLinks.appendChild(btn);
    }
    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  });

  /* ================= NAVBAR SCROLL STATE ================= */
  safe("navbar", function () {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;
    function update() { navbar.classList.toggle("scrolled", window.scrollY > 20); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  });

  /* ================= MOBILE MENU ================= */
  safe("mobile-menu", function () {
    var menuButton = document.getElementById("menuButton");
    var mobileMenu = document.getElementById("mobileMenu");
    if (!menuButton || !mobileMenu) return;

    function setOpen(open) {
      mobileMenu.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
    }

    menuButton.addEventListener("click", function () {
      setOpen(!mobileMenu.classList.contains("open"));
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (!mobileMenu.classList.contains("open")) return;
      if (mobileMenu.contains(e.target) || menuButton.contains(e.target)) return;
      setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  });

  /* ================= APP NAVIGATION (ورود به Suvreno) ================= */
  safe("app-links", function () {
    document.addEventListener("click", function (event) {
      var link = event.target.closest(
        ".navbar-app-button, .mobile-app-link, .hero-actions .primary-button, .cta-actions .primary-button, .games-cta .primary-button"
      );
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign("https://chat.suvreno.ir/");
    }, true);
  });

  /* ================= REVEAL ON SCROLL ================= */
  safe("reveal", function () {
    var els = document.querySelectorAll(
      ".feature-card, .game-card, .experience-card, .stat, .pricing-card, .faq-item, .cta-card, .about-card, .voices-card, .app-dl-card"
    );
    if (!("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    els.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min((i % 4) * 70, 210) + "ms";
      obs.observe(el);
    });
  });

  /* ================= INTERNAL # LINKS ================= */
  safe("anchors", function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href");
        if (!id || id === "#") return;
        var target = null;
        try { target = document.querySelector(id); } catch (e) {}
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) history.replaceState(null, "", id);
      });
    });
  });

  /* APP BANNER: بنر در جریان عادی صفحه است و هدرِ sticky خودش زیرش می‌ماند؛
     محاسبهٔ موقعیت روی هر اسکرول حذف شد چون باعث لگ و لرزش هدر می‌شد. */

  /* ================= LOGO ================= */
  safe("logo", function () {
    function setLogos() {
      if (!window.AM_LOGO_DATA) return;
      document.querySelectorAll("[data-suvreno-logo]").forEach(function (img) {
        if (!img.getAttribute("src")) img.src = window.AM_LOGO_DATA;
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setLogos);
    } else {
      setLogos();
    }
  });
})();
