export interface CalculatorState {
  euroPrice: number | '';
  leiPrice: number | '';
  sellingPriceIncVat: number | ''; // Changed from ExVat to IncVat
  commissionPercent: number;
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
}

export const CONSTANTS = {
  EURO_RATE: 5.1,
  VAT_RATE: 0.21, // 21%
  TRANSPORT_THRESHOLD: 62, // Lei ex VAT
  TRANSPORT_LOW: 3, // Lei ex VAT
  TRANSPORT_HIGH: 8, // Lei ex VAT
};