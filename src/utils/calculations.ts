/**
 * Oblicza symulowaną prowizję Allegro (np. 10%).
 */
export const calculateFee = (salePrice: number): number => {
  return salePrice * 0.10;
};

/**
 * Oblicza zysk "na czysto" dla danej oferty.
 * @param salePrice Cena sprzedaży brutto
 * @param netPurchasePrice Cena zakupu netto
 * @param promoCost Całkowity koszt włączonych wyróżnień
 */
export const calculateNetProfit = (
  salePrice: number,
  netPurchasePrice: number,
  promoCost: number
): number => {
  const fee = calculateFee(salePrice);
  return salePrice - netPurchasePrice - fee - promoCost;
};
