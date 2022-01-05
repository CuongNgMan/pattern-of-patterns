import { CurrencyController } from './controllers/CurrencyConverter.controller';

(async () => {
  const root = document.getElementById('root');
  const currencyConverter = new CurrencyController();
  await currencyConverter.boot(root);
})();
