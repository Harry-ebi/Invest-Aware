/* =========================================================================
   InvestAware UK — "Give your money time" compounding stacked bars (home).
   Pure DOM/CSS (no Chart.js). Renders into #gmtPlot / #gmtAxis.

   Illustrative only: £100 invested at the end of each month, 7% average
   annual return, reinvested. Bars are honestly proportional so the ramp
   itself carries the lesson. Values are rounded for display.
   ========================================================================= */
(function () {
  var plot = document.getElementById("gmtPlot");
  if (!plot) return;
  var axis = document.getElementById("gmtAxis");

  var DATA = [
    { yr: 1,  label: "1 year",   money: 1200,  growth: 38,    total: 1238,   tShort: "£1.2k"  },
    { yr: 5,  label: "5 years",  money: 6000,  growth: 1120,  total: 7120,   tShort: "£7.1k"  },
    { yr: 10, label: "10 years", money: 12000, growth: 5105,  total: 17105,  tShort: "£17.1k" },
    { yr: 20, label: "20 years", money: 24000, growth: 26754, total: 50754,  tShort: "£50.8k" },
    { yr: 30, label: "30 years", money: 36000, growth: 80945, total: 116945, tShort: "£116.9k" }
  ];
  var MAX = 116945;
  var MIN_MONEY = 8;
  function plotH() { return window.innerWidth < 620 ? 300 : 380; }
  function gbp(n) { return "£" + n.toLocaleString("en-GB"); }

  var bars = [];
  DATA.forEach(function (d) {
    var col = document.createElement("div");
    col.className = "gmt-col";
    col.tabIndex = 0;
    col.setAttribute("role", "button");
    col.setAttribute("aria-label", d.label + ": total " + gbp(d.total) + ", your money " + gbp(d.money) + ", growth " + gbp(d.growth));
    col.innerHTML =
      '<div class="gmt-detail" aria-hidden="true">' +
        '<div class="dh">' + d.label + '</div>' +
        '<div class="dr m"><span>You invested</span><b>' + gbp(d.money) + '</b></div>' +
        '<div class="dr g"><span>Growth</span><b>' + gbp(d.growth) + '</b></div>' +
        '<div class="dr t"><span>Total</span><b>' + gbp(d.total) + '</b></div>' +
      '</div>' +
      '<div class="gmt-total">' + d.tShort + '</div>' +
      '<div class="gmt-bar"><div class="gmt-seg-growth"></div><div class="gmt-seg-money"></div></div>';

    var tick = document.createElement("div");
    tick.className = "gmt-tick";
    tick.innerHTML = '<span class="yr">' + d.yr + ' yr</span><span class="in">' + gbp(d.money) + ' in</span>';
    axis.appendChild(tick);

    function toggle() {
      var was = col.classList.contains("on");
      document.querySelectorAll(".gmt-col.on").forEach(function (c) { c.classList.remove("on"); });
      if (!was) col.classList.add("on");
    }
    col.addEventListener("click", toggle);
    col.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    col.addEventListener("mouseenter", function () { col.classList.add("on"); });
    col.addEventListener("mouseleave", function () { col.classList.remove("on"); });

    plot.appendChild(col);
    bars.push({ el: col, money: d.money, growth: d.growth });
  });

  // Bars are content-sized and bottom-aligned, so they can't overflow the axis.
  function sizeBars() {
    var scale = plotH() / MAX;
    bars.forEach(function (b) {
      var hMoney = Math.max(b.money * scale, MIN_MONEY);
      var hGrowth = b.growth * scale;
      var bar = b.el.querySelector(".gmt-bar");
      bar.style.height = (hMoney + hGrowth) + "px";
      bar.querySelector(".gmt-seg-money").style.height = hMoney + "px";
      bar.querySelector(".gmt-seg-growth").style.height = hGrowth + "px";
    });
  }
  sizeBars();
  window.addEventListener("resize", sizeBars);
})();
