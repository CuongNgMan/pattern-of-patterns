import { CurrencyRate } from '../models/CurrencyRate';
import { Currency, CurrencyProps } from '../models/currency';
import { CurrencyConverter } from '../views/CurrencyConverter';
import { CurrencyConverterItemProps } from '../views/CurrencyConverterItem';

export class CurrencyController {
  constructor() {}

  async boot(root: Element) {
    const rates = CurrencyRate.createCurrencyRateCollection();
    await rates.fetch();
    const euroRate = rates.select({
      strategy: (item) => item.get('id'),
      value: 'EUR',
    });

    const currencies = Currency.createCurrencyCollection();
    await currencies.fetch();

    const currenciesData = currencies.transform<CurrencyConverterItemProps>((currency) => {
      const rate = euroRate.get('exchangeRate')[currency.get('id')];
      if (rate) {
        return {
          currencyName: currency.get('abbreviation'),
          currencyRate: rate,
        };
      }
    });

    new CurrencyConverter(root, currenciesData).render();
  }
}
