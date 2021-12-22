import { Attributes } from './Attribute';
import { Collection } from './Collection';
import { Eventing } from './Event';
import { Model } from './Model';
import { Sync } from './Sync';

export interface CurrencyRateProps {
  id: string;
  exchangeRate: {
    [key: string]: number;
  };
}

const url = 'http://localhost:3000/rates';

export class CurrencyRate extends Model<CurrencyRateProps> {
  constructor(data: CurrencyRateProps) {
    super(new Eventing(), new Sync<CurrencyRateProps>(url), new Attributes<CurrencyRateProps>(data));
  }

  static createCurrencyRate(data: CurrencyRateProps) {
    return new CurrencyRate(data);
  }

  static createCurrencyRateCollection(): Collection<CurrencyRate, CurrencyRateProps> {
    return new Collection<CurrencyRate, CurrencyRateProps>(url, CurrencyRate.createCurrencyRate);
  }
}
