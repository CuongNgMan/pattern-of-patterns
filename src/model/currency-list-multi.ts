import Axios from 'axios';

import { Currency } from './currency';
import { Eventing } from '../common/eventing';

const url = `http://localhost:3030`;

export class CurrencyListMultiMode {
  private _events: Eventing = new Eventing();
  currencyList: Currency[] = [];

  get on() {
    return this._events.on;
  }

  get trigger() {
    return this._events.trigger;
  }

  async fetch() {
    const response = await Axios.get(`${url}/rates`);
    const data = response.data;
    const result = [];

    for (let currency of data) {
      const { id, currencyName, currencyRate, euroQuantity, convertedValue } = currency;
      const c = new Currency(id, currencyName, currencyRate, euroQuantity);
      c.convertedValue = convertedValue;
      result.push(c);
    }

    this.currencyList = result;
  }

  async saveAll() {
    await Promise.all(this.currencyList.map((i) => this.save(i.id, i)));
  }

  async save(id: number, data) {
    return await Axios.put(`${url}/rates/${id}`, data);
  }

  async setCurrencyValue(value: number, type: 'euro' | 'currency', currencyName: string) {
    this.currencyList = this.currencyList.map((i) => {
      if (type === 'euro') {
        i.euroQuantity = value;
        i.convertedValue = value * i.currencyRate;
      } else {
        i.convertedValue = value;
        i.euroQuantity = value / i.currencyRate;
      }

      return i;
    });

    await this.saveAll();

    this._events.trigger('euro-quantity-change');
  }

  resetCurrencyList() {
    this.currencyList.splice(0, this.currencyList.length);
  }
}
