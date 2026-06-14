export interface CalculatorState {
  euroPrice: number | '';
  leiPrice: number | '';
  sellingPriceIncVat: number | ''; // Changed from ExVat to IncVat
  commissionPercent: number;
  returnRatePercent: number; // Estimated Return Rate (%)
  euroRate: number; // Dynamic Euro Exchange Rate
}

export interface CalculatedResults {
  transportCost: number;
  commissionValueExVat: number;
  commissionValueIncVat: number;
  sellingPriceIncVat: number;
  sellingPriceExVat: number; // Added to store the derived Net price
  totalCost: number;
  profit: number;
  profitMargin: number; // Marja profitului
  markup: number; // Adaos comercial
  failureCost: number; // Packaging Loss + Dynamic Transport
  expectedValue: number; // Kahneman Expected Value (EV)
}

export const CONSTANTS = {
  EURO_RATE: 5.1,
  VAT_RATE: 0.21, // 21%
};