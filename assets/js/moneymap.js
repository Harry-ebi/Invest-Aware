/* =========================================================================
   InvestAware UK — "Where does your money actually go?" Money Map
   A reusable, layered mental model of investing. Drop this anywhere:

     <div class="moneymap" data-highlight="account" data-highlight-item="ISA"></div>

   Attributes (all optional):
     data-highlight       space-separated layer ids to emphasise (dims the rest):
                          you · platform · account · investment · underlying · real
     data-highlight-item  a chip label to spotlight, e.g. "ISA", "Funds", "Shares"
     data-compact         "true" to hide the long descriptions (tighter variant)

   The diagram is fully understandable WITHOUT interaction (labels + one-line
   descriptions are always visible). Tapping/clicking a layer reveals a little
   more detail — an enhancement, not a requirement. Works on mobile (no hover).
   ========================================================================= */
(function () {
  var maps = document.querySelectorAll(".moneymap");
  if (!maps.length) return;

  var LAYERS = {
    you: {
      side: "", kicker: "The investor", title: "You", chips: [],
      desc: "You decide how much to invest and which account to use.",
      detail: {
        what: "The person investing — you.",
        affects: "How much goes in, and which account and investments you choose."
      }
    },
    account: {
      side: "where", kicker: "Where you hold it", title: "Account / wrapper",
      chips: ["ISA", "GIA", "Pension", "LISA"],
      desc: "The account isn’t the investment. It affects tax treatment, contribution limits and when you can access the money.",
      detail: {
        what: "An account — a “wrapper” — that holds your investments.",
        affects: "Tax treatment, contribution limits and when/how you can get at your money.",
        inside: "Potentially funds, ETFs, shares, bonds or cash. (A GIA doesn’t have the same tax advantages as an ISA or pension.)"
      }
    },
    investment: {
      side: "what", kicker: "What you invest in", title: "Investments",
      chips: ["Funds", "ETFs", "Shares", "Bonds"],
      desc: "What your money is actually put into. This is where your real-world exposure — and much of the risk and return — is decided.",
      detail: {
        what: "What you put the money into: a fund, an ETF, individual shares or bonds.",
        affects: "What your money is exposed to, and much of the risk and return.",
        inside: "One company (a single share), or many investments at once (a fund or ETF — an ETF is a type of fund)."
      }
    },
    underlying: {
      side: "chain", kicker: "What your investment owns", title: "Underlying assets",
      chips: ["Company shares", "Government bonds", "Corporate bonds", "Cash", "Other"],
      desc: "What the investment actually holds on your behalf — often many things at once.",
      detail: {
        what: "The actual holdings sitting inside your investment.",
        affects: "How spread out (diversified) your money really is.",
        inside: "For a broad fund, potentially hundreds or thousands of holdings."
      }
    },
    real: {
      side: "chain", kicker: "Where it ends up", title: "Real-world exposure",
      chips: ["Companies", "Governments", "Markets", "Economies"],
      desc: "Ultimately, your money is connected to real-world assets.",
      detail: {
        what: "The real-world assets your money is connected to.",
        affects: "Where your long-term returns come from — company profits, interest on bonds, and so on."
      }
    }
  };

  var PLATFORM = {
    kicker: "The service that administers it", title: "Platform / provider",
    desc: "Common infrastructure used to hold the account and access investments — not itself an investment, and not always a separate layer.",
    detail: {
      what: "The service through which your account is run and investments are held/accessed.",
      affects: "Admin and dealing — and often a platform fee. It is not an investment.",
      inside: "Your account(s), and the investments inside them."
    }
  };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function chipsHtml(chips) {
    if (!chips || !chips.length) return "";
    return '<div class="mm-chips">' + chips.map(function (c) {
      return '<span class="mm-chip" data-chip="' + esc(c.toLowerCase()) + '">' + esc(c) + "</span>";
    }).join("") + "</div>";
  }

  function detailHtml(id, d) {
    var rows = "";
    if (d.what) rows += '<div><dt>What is it?</dt><dd>' + esc(d.what) + "</dd></div>";
    if (d.affects) rows += '<div><dt>What does it affect?</dt><dd>' + esc(d.affects) + "</dd></div>";
    if (d.inside) rows += '<div><dt>What’s inside it?</dt><dd>' + esc(d.inside) + "</dd></div>";
    return '<dl class="mm-detail" id="' + id + '" hidden>' + rows + "</dl>";
  }

  function layerHtml(uid, key, l, compact) {
    var did = uid + "-" + key + "-d";
    var sideBadge = l.side === "where" ? '<span class="mm-badge where">Where you hold it</span>'
                   : l.side === "what" ? '<span class="mm-badge what">What you own</span>' : "";
    return '<div class="mm-layer' + (l.side ? " mm-" + l.side : "") + '" data-layer="' + key + '">' +
      '<button class="mm-head" type="button" aria-expanded="false" aria-controls="' + did + '">' +
        '<span class="mm-heading">' +
          '<span class="mm-kicker">' + (sideBadge ? sideBadge : esc(l.kicker)) + "</span>" +
          '<span class="mm-title">' + esc(l.title) + "</span>" +
        "</span>" +
        '<span class="mm-toggle" aria-hidden="true">+</span>' +
      "</button>" +
      chipsHtml(l.chips) +
      (compact ? "" : '<p class="mm-desc">' + esc(l.desc) + "</p>") +
      detailHtml(did, l.detail) +
    "</div>";
  }

  function arrow() { return '<div class="mm-arrow" aria-hidden="true"></div>'; }

  var counter = 0;
  maps.forEach(function (root) {
    var uid = "mm" + (++counter);
    var compact = root.getAttribute("data-compact") === "true";

    var platDid = uid + "-platform-d";
    var platform =
      '<div class="mm-platform" data-layer="platform">' +
        '<button class="mm-head mm-plat-head" type="button" aria-expanded="false" aria-controls="' + platDid + '">' +
          '<span class="mm-heading"><span class="mm-kicker">' + esc(PLATFORM.kicker) + "</span>" +
          '<span class="mm-title">' + esc(PLATFORM.title) + "</span></span>" +
          '<span class="mm-toggle" aria-hidden="true">+</span>' +
        "</button>" +
        (compact ? "" : '<p class="mm-desc mm-plat-desc">' + esc(PLATFORM.desc) + "</p>") +
        detailHtml(platDid, PLATFORM.detail) +
        '<div class="mm-inner">' +
          layerHtml(uid, "account", LAYERS.account, compact) +
          arrow() +
          layerHtml(uid, "investment", LAYERS.investment, compact) +
        "</div>" +
      "</div>";

    root.innerHTML =
      '<div class="mm-stack">' +
        layerHtml(uid, "you", LAYERS.you, compact) +
        arrow() +
        platform +
        arrow() +
        layerHtml(uid, "underlying", LAYERS.underlying, compact) +
        arrow() +
        layerHtml(uid, "real", LAYERS.real, compact) +
      "</div>";

    // --- Highlighting ---
    var hi = (root.getAttribute("data-highlight") || "").split(/\s+/).filter(Boolean);
    if (hi.length) {
      root.classList.add("mm-has-focus");
      root.querySelectorAll("[data-layer]").forEach(function (el) {
        var id = el.getAttribute("data-layer");
        if (hi.indexOf(id) !== -1) el.classList.add("mm-on");
        else el.classList.add("mm-dim");
      });
      // if a sub-layer is highlighted, keep the platform frame visible (not dimmed)
      if (hi.indexOf("account") !== -1 || hi.indexOf("investment") !== -1) {
        var plat = root.querySelector('[data-layer="platform"]');
        if (plat) plat.classList.remove("mm-dim");
      }
    }
    var item = root.getAttribute("data-highlight-item");
    if (item) {
      var want = item.toLowerCase();
      root.querySelectorAll(".mm-chip").forEach(function (c) {
        if (c.getAttribute("data-chip") === want) c.classList.add("on");
      });
    }

    // --- Interaction: reveal detail on tap/click (and keyboard via <button>) ---
    root.querySelectorAll(".mm-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (!panel) return;
        var open = panel.hasAttribute("hidden");
        if (open) { panel.removeAttribute("hidden"); btn.setAttribute("aria-expanded", "true"); btn.parentNode.classList.add("open"); }
        else { panel.setAttribute("hidden", ""); btn.setAttribute("aria-expanded", "false"); btn.parentNode.classList.remove("open"); }
      });
    });
  });
})();
