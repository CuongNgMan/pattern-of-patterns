import { Sync } from './Sync';
import { Model } from './Model';
import { Eventing } from './Event';
import { Attributes } from './Attribute';
import { CurrencyRate, CurrencyRateProps } from './CurrencyRate';
import { Collection } from './Collection';

export interface CurrencyProps {
  id: string;
  title?: string;
  abbreviation?: string;
}

const url = 'http://localhost:3000/currencies';

export class Currency extends Model<CurrencyProps> {
  constructor(data: CurrencyProps) {
    super(new Eventing(), new Sync<CurrencyProps>(url), new Attributes<CurrencyProps>(data));
  }

  static createCurrency(data: CurrencyProps): Currency {
    return new Currency(data);
  }

  static createCurrencyCollection(): Collection<Currency, CurrencyProps> {
    return new Collection<Currency, CurrencyProps>(url, Currency.createCurrency);
  }
}
