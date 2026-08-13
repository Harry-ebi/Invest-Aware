/* =========================================================================
   InvestAware UK — Money Map v2 ("Follow your £1,000") — home page.
   Builds the fund explosion (company dots grouped loosely by region) and
   wires the ISA/Pension/GIA wrapper toggle. Static, understandable in ~5s.
   ========================================================================= */
(function () {
  var root = document.querySelector(".mmap");
  if (!root) return;

  // Fund explosion — ~86 company dots, loosely grouped by region, staggered in.
  var grid = root.querySelector("#mmDots");
  if (grid) {
    var groups = [["r-us", 34], ["r-eu", 16], ["r-uk", 12], ["r-jp", 10], ["r-em", 14]];
    var html = "", i = 0;
    groups.forEach(function (g) {
      for (var k = 0; k < g[1]; k++) { html += '<i class="' + g[0] + '" style="--d:' + (i * 10) + 'ms"></i>'; i++; }
    });
    grid.innerHTML = html;
  }

  // Wrapper toggle — switches the definition only; the flow underneath never changes.
  var msgs = {
    ISA: "<b>ISA</b> — no tax on growth, dividends or withdrawals. Pay in up to £20,000 each tax year, and take money out whenever you like.",
    Pension: "<b>Pension</b> — the taxman adds 20% relief when you pay in (more for higher-rate taxpayers), in return for locking it away until age 57 (from 2028).",
    GIA: "<b>GIA</b> — no limit on what you can invest, but no tax perks: gains above your allowance, plus dividends and interest, can be taxable."
  };
  var msg = root.querySelector("#wrapMsg");
  root.querySelectorAll(".wrap-seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      root.querySelectorAll(".wrap-seg button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      if (msg) msg.innerHTML = msgs[b.getAttribute("data-w")];
    });
  });
})();
