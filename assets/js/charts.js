/* =========================================================================
   InvestAware UK — teaching charts (Chart.js)
   Restrained styling to match the calm, non-fintech aesthetic.
   Every chart is drawn from the ILLUSTRATIVE assumptions in config.js and
   is a teaching illustration, not a forecast.
   ========================================================================= */
(function () {
  if (typeof Chart === "undefined") return;
  var cfg = (window.INVESTAWARE || {}).illustrative || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var COL = {
    ink: "#1c2430", soft: "#4a5462", faint: "#77808d", line: "#e4e0d6",
    c1: "#2f6b5e", c2: "#b08333", c3: "#4a6b8a", c4: "#9a5b52", c5: "#6d6a86"
  };

  Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  Chart.defaults.font.size = 13;
  Chart.defaults.color = COL.soft;
  Chart.defaults.animation = reduce ? false : { duration: 650, easing: "easeOutQuart" };

  function gbp(n, dp) {
    return "£" + Number(n).toLocaleString("en-GB", { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  }
  function gbpShort(n) {
    if (n >= 1000000) return "£" + (n / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    if (n >= 1000) return "£" + Math.round(n / 1000) + "k";
    return "£" + Math.round(n);
  }

  // Future value of a monthly contribution stream, compounded monthly
  function fvMonthly(monthly, annualRate, years) {
    var r = annualRate / 12, n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r);
  }
  // Future value of a lump sum, compounded annually
  function fvLump(p, annualRate, years) { return p * Math.pow(1 + annualRate, years); }

  var baseScales = {
    x: { grid: { color: COL.line, drawTicks: false }, border: { color: COL.line }, ticks: { padding: 8 } },
    y: {
      grid: { color: COL.line, drawTicks: false }, border: { display: false },
      ticks: { padding: 10, callback: function (v) { return gbpShort(v); } }
    }
  };

  function tooltip(labelFn) {
    return {
      backgroundColor: "#1c2430", titleColor: "#fff", bodyColor: "#e6e9ee",
      padding: 10, cornerRadius: 8, displayColors: true, boxPadding: 4,
      callbacks: { label: labelFn }
    };
  }

  function lineDataset(label, data, color, fill) {
    return {
      label: label, data: data, borderColor: color,
      backgroundColor: fill ? hexA(color, .10) : color,
      fill: fill || false, tension: .28, borderWidth: 2.5,
      pointRadius: 0, pointHoverRadius: 5, pointBackgroundColor: color
    };
  }
  function hexA(hex, a) {
    var h = hex.replace("#", "");
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  /* ---------------- 1. Compounding curve ----------------
     £200/month for 35 years. Shows total paid in vs illustrative value —
     the widening gap is "returns generating returns". */
  function compoundCurve(id) {
    var el = document.getElementById(id); if (!el) return;
    var monthly = cfg.monthlyContribution || 200;
    var rate = cfg.grossReturn || 0.05;
    var years = [0, 1, 5, 10, 15, 20, 25, 30, 35];
    var paid = years.map(function (y) { return monthly * 12 * y; });
    var value = years.map(function (y) { return Math.round(fvMonthly(monthly, rate, y)); });
    new Chart(el, {
      type: "line",
      data: { labels: years.map(function (y) { return y + "y"; }),
        datasets: [
          lineDataset("Illustrative value", value, COL.c1, true),
          lineDataset("Total paid in", paid, COL.c2, false)
        ] },
      options: commonOpts("Years invested", function (c) { return c.dataset.label + ": " + gbp(c.parsed.y); })
    });
  }

  /* ---------------- 2. Starting earlier ----------------
     Investor A starts at 25, Investor B at 35, both £200/mo to 60. */
  function startingEarlier(id) {
    var el = document.getElementById(id); if (!el) return;
    var monthly = cfg.monthlyContribution || 200;
    var rate = cfg.grossReturn || 0.05;
    var a0 = cfg.startAgeA || 25, b0 = cfg.startAgeB || 35, end = cfg.endAge || 60;
    var ages = []; for (var a = a0; a <= end; a++) ages.push(a);
    var aData = ages.map(function (age) { return age < a0 ? null : Math.round(fvMonthly(monthly, rate, age - a0)); });
    var bData = ages.map(function (age) { return age < b0 ? null : Math.round(fvMonthly(monthly, rate, age - b0)); });
    new Chart(el, {
      type: "line",
      data: { labels: ages,
        datasets: [
          lineDataset("Investor A — starts at " + a0, aData, COL.c1, false),
          lineDataset("Investor B — starts at " + b0, bData, COL.c3, false)
        ] },
      options: commonOpts("Age", function (c) { return c.dataset.label + ": " + gbp(c.parsed.y); }, { xTicksMax: 8 })
    });
  }

  /* ---------------- 3. Fee drag ----------------
     £100,000, same 5% gross, three annual cost levels, over 30 years. */
  function feeDrag(id) {
    var el = document.getElementById(id); if (!el) return;
    var P = cfg.lumpSum || 100000, gross = cfg.grossReturn || 0.05;
    var fees = [
      { f: cfg.feeLow || 0.0025, c: COL.c1 },
      { f: cfg.feeMid || 0.0075, c: COL.c3 },
      { f: cfg.feeHigh || 0.015, c: COL.c4 }
    ];
    var years = []; for (var y = 0; y <= 30; y++) years.push(y);
    var ds = fees.map(function (o) {
      var net = gross - o.f;
      return lineDataset((o.f * 100).toLocaleString("en-GB") + "% a year in costs",
        years.map(function (y) { return Math.round(fvLump(P, net, y)); }), o.c, false);
    });
    new Chart(el, {
      type: "line",
      data: { labels: years.map(function (y) { return y; }), datasets: ds },
      options: commonOpts("Years invested", function (c) { return c.dataset.label + ": " + gbp(c.parsed.y); }, { xTicksMax: 7 })
    });
  }

  /* ---------------- 4. Inflation & purchasing power ----------------
     What £10,000 held as cash could buy over 30 years at 2.5% inflation. */
  function inflationErosion(id) {
    var el = document.getElementById(id); if (!el) return;
    var start = 10000, inf = cfg.inflation || 0.025;
    var years = []; for (var y = 0; y <= 30; y++) years.push(y);
    var real = years.map(function (y) { return Math.round(start / Math.pow(1 + inf, y)); });
    new Chart(el, {
      type: "line",
      data: { labels: years, datasets: [ lineDataset("Purchasing power of £10,000", real, COL.c4, true) ] },
      options: commonOpts("Years", function (c) { return "Buys what " + gbp(c.parsed.y) + " buys today"; }, { xTicksMax: 7, yBeginZero: false })
    });
  }

  /* ---------------- 5. Illustrative market path ----------------
     A stylised shape, NOT real data: long-term drift upward with visible
     falls and recoveries. Used to discuss volatility & market timing. */
  function marketShape(id) {
    var el = document.getElementById(id); if (!el) return;
    // Deterministic stylised path (no random) — index level over ~25 "years"
    var pts = [100,108,116,112,124,133,120,98,112,127,140,152,146,168,181,160,175,193,210,198,224,241,236,262,285];
    var labels = pts.map(function (_, i) { return i; });
    new Chart(el, {
      type: "line",
      data: { labels: labels, datasets: [ {
        label: "Illustrative market level", data: pts, borderColor: COL.c1,
        backgroundColor: hexA(COL.c1, .08), fill: true, tension: .18,
        borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4
      } ] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { grid: { display: false }, border: { color: COL.line }, title: { display: true, text: "Time  →  (illustrative, not to scale)", color: COL.faint }, ticks: { display: false } },
          y: { grid: { color: COL.line, drawTicks: false }, border: { display: false }, ticks: { display: false } }
        }
      }
    });
  }

  /* ---------------- 6. Pension: contributions vs growth ----------------
     Stacked bars showing total paid in (you + employer) vs investment growth
     at several points in time. Demonstrates that a mature pot is far more than
     the sum of contributions. */
  function pensionBuild(id) {
    var el = document.getElementById(id); if (!el) return;
    var you = cfg.pensionMonthlyYou || 150, emp = cfg.pensionMonthlyEmployer || 150;
    var monthly = you + emp, rate = cfg.grossReturn || 0.05;
    var marks = [10, 20, 30, 40];
    var paid = marks.map(function (y) { return monthly * 12 * y; });
    var value = marks.map(function (y) { return Math.round(fvMonthly(monthly, rate, y)); });
    var growth = value.map(function (v, i) { return Math.max(0, v - paid[i]); });
    new Chart(el, {
      type: "bar",
      data: {
        labels: marks.map(function (y) { return "After " + y + " years"; }),
        datasets: [
          { label: "Total paid in (you + employer)", data: paid, backgroundColor: COL.c3, stack: "s", borderRadius: 3, maxBarThickness: 64 },
          { label: "Illustrative investment growth", data: growth, backgroundColor: COL.c1, stack: "s", borderRadius: 3, maxBarThickness: 64 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, padding: 16 } },
          tooltip: tooltip(function (c) { return c.dataset.label + ": " + gbp(c.parsed.y); })
        },
        scales: {
          x: { stacked: true, grid: { display: false }, border: { color: COL.line } },
          y: { stacked: true, grid: { color: COL.line, drawTicks: false }, border: { display: false }, beginAtZero: true, ticks: { callback: function (v) { return gbpShort(v); } } }
        }
      }
    });
  }

  function commonOpts(xTitle, labelFn, extra) {
    extra = extra || {};
    var sc = JSON.parse(JSON.stringify(baseScales));
    sc.x.title = { display: true, text: xTitle, color: COL.faint, padding: { top: 6 } };
    if (extra.xTicksMax) sc.x.ticks.maxTicksLimit = extra.xTicksMax;
    if (extra.yBeginZero === false) sc.y.beginAtZero = false; else sc.y.beginAtZero = true;
    // re-attach callbacks lost by JSON clone
    sc.y.ticks.callback = function (v) { return gbpShort(v); };
    return {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, padding: 16 } },
        tooltip: tooltip(labelFn)
      },
      scales: sc
    };
  }

  // Expose + auto-run based on data attributes
  window.IACharts = { compoundCurve: compoundCurve, startingEarlier: startingEarlier, feeDrag: feeDrag, inflationErosion: inflationErosion, marketShape: marketShape, pensionBuild: pensionBuild };

  document.querySelectorAll("canvas[data-chart]").forEach(function (c) {
    var fn = window.IACharts[c.getAttribute("data-chart")];
    if (fn) fn(c.id);
  });
})();
