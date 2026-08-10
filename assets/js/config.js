/* =========================================================================
   InvestAware UK — Central configuration
   -------------------------------------------------------------------------
   Single source of truth for figures that can change (allowances, limits,
   ages) and for the ILLUSTRATIVE assumptions used in charts.

   Change a value here and it updates everywhere it is used on the site.
   Nothing here is a forecast or a recommendation — the growth assumptions
   exist only to illustrate how compounding works over time.

   >>> Review these against current HMRC / GOV.UK figures each tax year. <<<
   ========================================================================= */

window.INVESTAWARE = {

  /* Tax year these figures were last checked against */
  taxYear: "2025/26",
  lastReviewed: "August 2026",

  /* ---- Allowances & limits (illustrative of the rules; verify before relying) ---- */
  figures: {
    ISA_ALLOWANCE:            20000,   // £ per tax year, across ISAs
    LISA_ALLOWANCE:           4000,    // £ per tax year (counts toward ISA allowance)
    LISA_BONUS:               0.25,    // 25% government bonus on LISA contributions
    LISA_AGE_OPEN_MIN:        18,
    LISA_AGE_OPEN_MAX:        39,      // must open before 40
    LISA_AGE_CONTRIBUTE_MAX:  49,      // can contribute until 50
    LISA_WITHDRAWAL_CHARGE:   0.25,    // 25% charge on unauthorised withdrawals
    PENSION_ANNUAL_ALLOWANCE: 60000,   // £ standard annual allowance (may be tapered/reduced)
    PENSION_ACCESS_AGE:       55,      // normal minimum pension age (rising to 57 from 2028)
    PENSION_ACCESS_AGE_FUTURE:57,      // from April 2028
    STATE_PENSION_AGE_NOTE:   "66, rising to 67 and later 68"
  },

  /* ---- Illustrative assumptions used ONLY to draw teaching charts ----
     These are round, deliberately simple numbers. They are NOT predictions
     of future returns, and real returns vary and can be negative.          */
  illustrative: {
    grossReturn:        0.05,   // 5% a year, before costs and inflation
    inflation:          0.025,  // 2.5% a year
    monthlyContribution:200,    // £ per month for the "starting earlier" example
    startAgeA:          25,
    startAgeB:          35,
    endAge:             60,
    lumpSum:            100000,  // £ for the fee-drag illustration
    feeLow:             0.0025,  // 0.25% a year
    feeHigh:            0.0150,  // 1.50% a year
    feeMid:             0.0075,  // 0.75% a year

    // Workplace pension "contributions vs growth" illustration
    pensionMonthlyYou:      150,   // £ employee contribution per month
    pensionMonthlyEmployer: 150,   // £ employer contribution per month
    pensionStartAge:        25,
    pensionEndAge:          65
  }
};
