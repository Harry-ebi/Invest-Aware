/* =========================================================================
   InvestAware UK — Diversification page interactions.
   - Builds the "winners keep changing" returns quilt from real data.
   - Fills dot fields. Wires the "which wins next?" reveal.
   Data: Novel Investor annual asset-class returns (total return, USD),
   2015-2024. Indices: S&P 500, Russell 2000, MSCI EAFE, MSCI EM,
   FTSE NAREIT All Equity, ICE BofA US High Yield, Bloomberg US Aggregate.
   ========================================================================= */
(function () {
  var root = document.querySelector(".dv");
  if (!root) return;

  // ---- Returns quilt ----
  var ASSETS = [
    { k: "uslc", short: "US Large",  v: "--q1" },
    { k: "ussc", short: "US Small",  v: "--q2" },
    { k: "intl", short: "Int'l Dev", v: "--q3" },
    { k: "em",   short: "Emerging",  v: "--q4" },
    { k: "reit", short: "Property",  v: "--q5" },
    { k: "hy",   short: "High Yield",v: "--q6" },
    { k: "bond", short: "Bonds",     v: "--q7" }
  ];
  var LABELS = { uslc:"US large companies (S&P 500)", ussc:"US small companies (Russell 2000)", intl:"Developed international (MSCI EAFE)", em:"Emerging markets (MSCI EM)", reit:"Property / REITs (FTSE NAREIT)", hy:"High-yield bonds (ICE BofA US HY)", bond:"High-grade bonds (Bloomberg US Agg)" };
  // year: [uslc, ussc, intl, em, reit, hy, bond]
  var RET = {
    2015:[1.4,-4.4,-0.4,-14.6,2.8,-4.6,0.6],
    2016:[12.0,21.3,1.5,11.6,8.6,17.5,2.7],
    2017:[21.8,14.7,25.6,37.8,8.7,7.5,3.5],
    2018:[-4.4,-11.0,-13.4,-14.3,-4.0,-2.3,0.0],
    2019:[31.5,25.5,22.7,18.9,28.7,14.4,8.7],
    2020:[18.4,20.0,8.3,18.7,-5.1,7.5,6.1],
    2021:[28.7,14.8,11.8,-2.2,41.3,5.4,-1.5],
    2022:[-18.1,-20.4,-14.0,-19.7,-25.0,-11.2,-13.0],
    2023:[26.3,16.9,18.9,10.3,11.4,13.5,5.5],
    2024:[25.0,11.5,4.4,8.1,4.9,8.2,1.3]
  };
  function fmt(n){ return (n > 0 ? "+" : "") + n.toFixed(1) + "%"; }

  var quilt = root.querySelector("#dvQuilt");
  if (quilt) {
    var years = Object.keys(RET);
    years.forEach(function (yr) {
      var col = document.createElement("div");
      col.style.cssText = "display:flex;flex-direction:column;gap:3px";
      var head = document.createElement("div");
      head.className = "dv-qhead"; head.textContent = yr;
      col.appendChild(head);
      // rank asset indices best -> worst for this year
      var ranked = ASSETS.map(function (a, i) { return { a: a, r: RET[yr][i] }; })
                         .sort(function (x, y) { return y.r - x.r; });
      ranked.forEach(function (row) {
        var c = document.createElement("div");
        c.className = "dv-qcell" + (row.r < 0 ? " neg" : "");
        c.style.background = "var(" + row.a.v + ")";
        c.innerHTML = '<span class="qa">' + row.a.short + '</span><span class="qr">' + fmt(row.r) + '</span>';
        col.appendChild(c);
      });
      quilt.appendChild(col);
    });
    // legend
    var leg = root.querySelector("#dvQuiltLegend");
    if (leg) {
      leg.innerHTML = ASSETS.map(function (a) {
        return '<span><i style="background:var(' + a.v + ')"></i>' + LABELS[a.k] + '</span>';
      }).join("");
    }
  }

  // ---- Dot fields ----
  root.querySelectorAll("[data-dots]").forEach(function (el) {
    var n = parseInt(el.getAttribute("data-dots"), 10) || 0;
    var win = parseInt(el.getAttribute("data-win"), 10) || 0;
    var winSet = {};
    if (win > 0) {
      var step = n / win;
      for (var w = 0; w < win; w++) winSet[Math.min(n - 1, Math.round(w * step + step / 2))] = true;
    }
    var html = "";
    for (var i = 0; i < n; i++) html += '<i' + (winSet[i] ? ' class="win"' : '') + '></i>';
    el.innerHTML = html;
  });

  // ---- Predict: which wins next? ----
  var reveal = root.querySelector("#dvPredictReveal");
  root.querySelectorAll(".dv-ptile").forEach(function (t) {
    t.addEventListener("click", function () {
      root.querySelectorAll(".dv-ptile").forEach(function (x) { x.classList.remove("picked"); });
      t.classList.add("picked");
      if (reveal) reveal.classList.add("show");
    });
  });
})();
