import { Currency } from './models/Currency';
import { CurrencyRate } from './models/CurrencyRate';
import { CurrencyConverterItem } from './views/CurrencyConverterItem';

import { CurrencyController } from './controllers/CurrencyConverter.controller';

const rateData = {
  EUR: {
    YEN: 129.122441,
    USD: 1.131478,
    INR: 86.104141,
  },
};

const c = new Currency({ id: 'EUR', title: 'Vietnam Dong', abbreviation: 'VND' });

const root = document.getElementById('root');

// new CurrencyController(c, new CurrencyConverterItem(root));
// const test = new CurrencyConverterItem(root, {
//   currencyName: 'DM',
//   currencyRate: 1.96,
// });

// test.render();

// const test1 = new CurrencyConverterItem(root, {
//   currencyName: 'USD',
//   currencyRate: 1.13,
// });

// test1.render();

// const cr = CurrencyRate.createCurrencyRateCollection();
// const crCollection = Currency.createCurrencyCollection();
(async () => {
  // await cr.fetch();
  // const a = cr.select((item) => item.get('id'), 'EUR');
  // await crCollection.fetch();
  // console.log(cr.data);
  // console.log(crCollection.data);
  const currencyConverter = new CurrencyController();
  await currencyConverter.boot(root);
})();

// new CurrencyController(crCollection);
