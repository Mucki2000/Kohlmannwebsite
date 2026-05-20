/* Shared chrome behaviour: inject Nav + Footer, hydrate ornaments,
   reveal-on-scroll, lightbox, mobile menu, ES/EN language switch. */
(function () {
  var STORAGE_KEY = "kohlmann_lang";

  var LINKS = [
    { href: "nosotros.html",        key: "nosotros",        es: "Nosotros" },
    { href: "servicios.html",       key: "servicios",       es: "Servicios" },
    { href: "galeria.html",         key: "galeria",         es: "Galería" },
    { href: "contacto.html",        key: "contacto",        es: "Contacto" }
  ];

  /* English overrides for the shared chrome. Page-specific strings live
     in each page's window.I18N_EN. */
  var BASE_EN = {
    "nav.nosotros": "About",
    "nav.servicios": "Services",
    "nav.menu": "Menu",
    "nav.galeria": "Gallery",
    "nav.certificaciones": "Certifications",
    "nav.contacto": "Contact",
    "nav.reservas": "Reservations",
    "nav.cerrar": "Close",
    "footer.privacy": "Privacy Notice"
  };

  function t(key, es) { return '<span data-i18n="' + key + '">' + es + '</span>'; }

  var WORDMARK =
    '<a href="index.html" class="wordmark" aria-label="Eduardo Kohlmann Banquetes">' +
    '<span>Eduardo</span><span>Kohlmann</span><span>Banquetes</span>' +
    '<span class="wordmark-tagline">[ Pasi&oacute;n por servir ]</span></a>';

  function navHTML(current) {
    var row2 = LINKS.map(function (l) {
      return '<a href="' + l.href + '"' + (l.key === current ? ' class="current"' : '') +
             '><span data-i18n="nav.' + l.key + '">' + l.es + '</span></a>';
    }).join("");
    var mobile = LINKS.map(function (l) {
      return '<a href="' + l.href + '"><span data-i18n="nav.' + l.key + '">' + l.es + '</span></a>';
    }).join("");
    return '' +
      '<header class="nav">' +
        '<div class="nav-row1">' +
          '<div class="nav-lang">' +
            '<button type="button" data-lang="ES">ES</button>' +
            '<button type="button" data-lang="EN">EN</button>' +
          '</div>' +
          WORDMARK +
          '<div class="nav-right">' +
            '<a href="contacto.html" class="reservas-btn">' + t("nav.reservas", "Reservas") + '</a>' +
            '<button type="button" class="nav-burger" aria-label="Menu" data-burger>' +
              '<svg width="18" height="14" viewBox="0 0 18 14" fill="none">' +
              '<path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" stroke-width="1.2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="nav-divider"></div>' +
        '<nav class="nav-row2">' + row2 + '</nav>' +
      '</header>' +
      '<div class="mobile-overlay" data-overlay>' +
        '<div class="mobile-top">' + WORDMARK +
          '<button type="button" class="mobile-close" data-mobile-close aria-label="Cerrar">' +
            t("nav.cerrar", "Cerrar") + '</button>' +
        '</div>' +
        '<nav class="mobile-links">' + mobile + '</nav>' +
        '<a href="contacto.html" class="btn btn-outline-light">' + t("nav.reservas", "Reservas") + '</a>' +
      '</div>';
  }

  function footerHTML() {
    var links = LINKS.map(function (l) {
      return '<a href="' + l.href + '"><span data-i18n="nav.' + l.key + '">' + l.es + '</span></a>';
    }).join("");
    return '' +
      '<footer class="footer"><div class="footer-inner">' +
        WORDMARK +
        '<div class="footer-rule"></div>' +
        '<div class="footer-links">' + links + '</div>' +
        '<div class="footer-address">' +
          '<div>Av. Zacatepetl No. 154 · Jardines del Pedregal · CDMX</div>' +
          '<div>55 56 61 98 31 · contacto@kohlmann.com.mx</div>' +
        '</div>' +
        '<div class="footer-legal">' +
          '<span>Kohlmann Banquetes ' + new Date().getFullYear() + ' ©</span>' +
          '<a href="aviso-de-privacidad.html">' + t("footer.privacy", "Aviso de Privacidad") + '</a>' +
        '</div>' +
      '</div></footer>';
  }

  /* ---------- i18n ---------- */
  function dict() {
    var pageDict = (typeof window !== "undefined" && window.I18N_EN) ? window.I18N_EN : {};
    var merged = {};
    for (var k in BASE_EN) merged[k] = BASE_EN[k];
    for (var p in pageDict) merged[p] = pageDict[p];
    return merged;
  }

  function getLang() {
    try { return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es"; }
    catch (e) { return "es"; }
  }

  function applyLang(lang) {
    var en = dict();
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.__esHTML == null) el.__esHTML = el.innerHTML;
      var key = el.getAttribute("data-i18n");
      el.innerHTML = (lang === "en" && en[key] != null) ? en[key] : el.__esHTML;
    });
    document.documentElement.lang = lang;
    document.querySelectorAll(".nav-lang button").forEach(function (b) {
      var on = b.getAttribute("data-lang").toLowerCase() === lang;
      b.classList.toggle("active", on);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function wireNav() {
    var burger = document.querySelector("[data-burger]");
    var overlay = document.querySelector("[data-overlay]");
    var close = document.querySelector("[data-mobile-close]");
    if (burger && overlay) burger.addEventListener("click", function () { overlay.classList.add("open"); });
    if (close && overlay) close.addEventListener("click", function () { overlay.classList.remove("open"); });
    if (overlay) overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { overlay.classList.remove("open"); });
    });
    document.querySelectorAll(".nav-lang button").forEach(function (b) {
      b.addEventListener("click", function () {
        applyLang(b.getAttribute("data-lang").toLowerCase());
      });
    });
  }

  function ornamentSVG(width, color) {
    var w = width || 320;
    return '<svg width="' + w + '" height="6" viewBox="0 0 ' + w + ' 6" role="img" ' +
      'aria-hidden="true" style="display:block;color:' + (color || 'var(--navy)') +
      ';overflow:visible"><path d="M 0 3 Q ' + (w / 2) + ' 1.4 ' + w + ' 3 Q ' +
      (w / 2) + ' 4.6 0 3 Z" fill="currentColor"/></svg>';
  }

  function hydrateOrnaments(root) {
    (root || document).querySelectorAll("[data-ornament]").forEach(function (el) {
      el.innerHTML = ornamentSVG(parseInt(el.getAttribute("data-w"), 10) || 320,
                                 el.getAttribute("data-c") || "var(--navy)");
    });
  }

  function wireReveal() {
    var els = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.08 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("in"); });
    }
  }

  function wireLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<img src="" alt=""><button type="button" class="lightbox-close" ' +
      'aria-label="Cerrar">Cerrar &#10005;</button>';
    document.body.appendChild(box);
    var img = box.querySelector("img");
    function open(src) { img.src = src; box.classList.add("open"); document.body.classList.add("modal-open"); }
    function close() { box.classList.remove("open"); img.src = ""; document.body.classList.remove("modal-open"); }
    box.addEventListener("click", close);
    triggers.forEach(function (tr) {
      tr.addEventListener("click", function () { open(tr.getAttribute("data-lightbox")); });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("open")) close();
    });
  }

  function init() {
    var navRoot = document.getElementById("nav-root");
    if (navRoot) navRoot.innerHTML = navHTML(navRoot.getAttribute("data-current") || "");
    var footRoot = document.getElementById("footer-root");
    if (footRoot) footRoot.innerHTML = footerHTML();
    hydrateOrnaments();
    wireNav();
    wireReveal();
    wireLightbox();
    applyLang(getLang());
  }

  window.Kohlmann = {
    ornamentSVG: ornamentSVG,
    hydrateOrnaments: hydrateOrnaments,
    getLang: getLang,
    applyLang: applyLang
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
