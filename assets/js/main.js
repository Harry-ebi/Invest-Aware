/* =========================================================================
   InvestAware UK — shared chrome (header, nav, footer) + helpers
   Injected with JS so navigation stays consistent across every page and
   there is only one place to edit it.

   Each page declares:
     <body data-base=".." data-section="investing">
   data-base   = relative path back to site root ("" at root, ".." one level deep)
   data-section= which top-level section to highlight in the nav
   ========================================================================= */
(function () {
  var body = document.body;
  var BASE = body.getAttribute("data-base") || "";
  var SECTION = body.getAttribute("data-section") || "";
  var P = BASE ? BASE.replace(/\/$/, "") + "/" : ""; // normalised prefix

  function href(path) { return P + path; }

  var NAV = [
    { id: "home",     label: "Home",                path: "index.html" },
    { id: "investing",label: "Investing",           path: "investing/index.html" },
    { id: "accounts", label: "Accounts & Wrappers", path: "accounts/index.html" },
    { id: "pensions", label: "Pensions",            path: "pensions/index.html" },
    { id: "learn",    label: "Learn",               path: "learn/index.html" },
    { id: "about",    label: "About",               path: "about.html" }
  ];

  var mark = '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">' +
    '<circle cx="16" cy="16" r="15" fill="none" stroke="#2f6b5e" stroke-width="2"/>' +
    '<path d="M6 21 L13 14 L18 18 L26 9" fill="none" stroke="#2f6b5e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="26" cy="9" r="2.4" fill="#b08333"/></svg>';

  /* ---------- Header ---------- */
  var links = NAV.map(function (n) {
    var cur = n.id === SECTION ? ' aria-current="page"' : "";
    return '<li><a href="' + href(n.path) + '"' + cur + '>' + n.label + "</a></li>";
  }).join("");

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="container"><nav class="nav" aria-label="Primary">' +
      '<a class="brand" href="' + href("index.html") + '">' + mark +
        '<span>InvestAware <span class="uk">UK</span></span></a>' +
      '<span class="nav-spacer"></span>' +
      '<button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Menu">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '</button>' +
      '<ul class="nav-links" id="nav-links">' + links + '</ul>' +
    "</nav></div>";

  var sh = document.getElementById("site-header");
  if (sh) { sh.className = "site-header"; sh.innerHTML = header; }

  /* mobile toggle */
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-links");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navList.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { navList.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Footer ---------- */
  var cfg = window.INVESTAWARE || { lastReviewed: "", figures: {} };

  var footCols = [
    { h: "Investing", items: [
        ["investing/saving-vs-investing.html", "Saving vs investing"],
        ["investing/compound-growth.html", "Compound growth"],
        ["investing/diversification.html", "Diversification"],
        ["investing/time-in-the-market.html", "Time in the market"],
        ["investing/costs.html", "Investment costs"] ] },
    { h: "Accounts & Pensions", items: [
        ["accounts/index.html", "Accounts & wrappers"],
        ["accounts/stocks-and-shares-isa.html", "Stocks & Shares ISA"],
        ["accounts/lifetime-isa.html", "Lifetime ISA"],
        ["pensions/index.html", "How pensions work"],
        ["pensions/workplace-pensions.html", "Workplace pensions"] ] },
    { h: "Learn", items: [
        ["learn/shares.html", "Shares"],
        ["learn/bonds.html", "Bonds"],
        ["learn/funds.html", "Funds"],
        ["learn/etfs.html", "ETFs"],
        ["learn/indexes.html", "Indexes"] ] }
  ];

  var colHtml = footCols.map(function (c) {
    var li = c.items.map(function (it) { return '<li><a href="' + href(it[0]) + '">' + it[1] + "</a></li>"; }).join("");
    return '<div class="footer-col"><h5>' + c.h + "</h5><ul>" + li + "</ul></div>";
  }).join("");

  var footer =
    '<div class="container"><div class="footer-grid">' +
      '<div><a class="footer-brand" href="' + href("index.html") + '">' + mark + "InvestAware UK</a>" +
        '<p class="footer-about">Straightforward, impartial education about investing, pensions and building wealth for the long term. No products to sell. No sales pitch.</p></div>' +
      colHtml +
    "</div>" +
    '<div class="disclaimer">' +
      "<p><strong>InvestAware provides financial education and general information only.</strong> " +
      "Nothing on this website constitutes personal financial, investment, tax or legal advice, or a recommendation to buy or sell any investment or financial product.</p>" +
      "<p>Investments can fall as well as rise in value and you may get back less than you invest. Past performance is not a guide to future returns. " +
      "Tax rules, allowances and reliefs can change and their value depends on your individual circumstances.</p>" +
      '<div class="footer-legal">' +
        '<a href="' + href("about.html") + '">About</a>' +
        '<a href="' + href("important-information.html") + '">Important information</a>' +
        '<span>© ' + "2026 InvestAware UK. Educational use." + "</span>" +
        (cfg.taxYear ? "<span>Figures reflect the " + cfg.taxYear + " tax year</span>" : "") +
      "</div>" +
    "</div></div>";

  var sf = document.getElementById("site-footer");
  if (sf) { sf.className = "site-footer"; sf.innerHTML = footer; }

  /* ---------- Helpers exposed for pages ---------- */
  window.IA = {
    base: P,
    href: href,
    gbp: function (n, dp) {
      return "£" + Number(n).toLocaleString("en-GB", { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
    },
    fig: function (k) { return (cfg.figures || {})[k]; }
  };

  /* Fill any element with data-fig="ISA_ALLOWANCE" with the central figure */
  document.querySelectorAll("[data-fig]").forEach(function (el) {
    var key = el.getAttribute("data-fig");
    var val = (cfg.figures || {})[key];
    if (val == null) return;
    var money = el.hasAttribute("data-money");
    var pct = el.hasAttribute("data-pct");
    if (money) el.textContent = window.IA.gbp(val);
    else if (pct) el.textContent = (val * 100).toLocaleString("en-GB") + "%";
    else el.textContent = Number(val).toLocaleString("en-GB");
  });

  /* Stamp "Last reviewed" placeholders */
  document.querySelectorAll("[data-reviewed]").forEach(function (el) {
    el.textContent = cfg.lastReviewed || "";
  });
})();
