import { CurrencyRate } from '../models/CurrencyRate';
import { Currency, CurrencyProps } from '../models/currency';
import { CurrencyConverter } from '../views/CurrencyConverter';
import { CurrencyConverterItem } from '../views/CurrencyConverterItem';

export class CurrencyController {
  constructor() {}

  async boot(root: Element) {
    new CurrencyConverter(root).render();
    const rates = CurrencyRate.createCurrencyRateCollection();
    await rates.fetch();
    const euroRate = rates.select((item) => item.get('id'), 'EUR');

    const currencies = Currency.createCurrencyCollection();
    await currencies.fetch();

    currencies.data.forEach((currency) => {
      const rate = euroRate.get('exchangeRate')[currency.get('id')];
      if (rate) {
        new CurrencyConverterItem(root, {
          currencyName: currency.get('abbreviation'),
          currencyRate: euroRate.get('exchangeRate')[currency.get('id')],
        }).render();
      }
    });
  }
}
