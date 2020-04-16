import currencyService from "@/services/currency.service";

describe('currencyService', () => {
    it('currency generator between 20 and 80 ', function () {
       const result = currencyService.actualDollarExchangeRate();
       const MIN = 20;
       const MAX = 80;
       expect(result).toBeGreaterThanOrEqual(MIN);
       expect(result).toBeLessThanOrEqual(MAX);
    });
});
