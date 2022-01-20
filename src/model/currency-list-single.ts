import Axios from 'axios';

import { Currency } from './currency';
import { Eventing } from '../common/eventing';

const url = `http://localhost:3030`;

export class CurrencyListSingleMode {
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
    const index = this.currencyList.findIndex((i) => i.currencyName === currencyName);

    if (index !== -1) {
      const currencyItem = this.currencyList[index];

      if (type === 'euro') {
        currencyItem.euroQuantity = value;
        currencyItem.convertedValue = value * currencyItem.currencyRate;
      } else {
        currencyItem.convertedValue = value;
        currencyItem.euroQuantity = value / currencyItem.currencyRate;
      }

      this.currencyList[index] = currencyItem;

      await this.save(currencyItem.id, currencyItem);

      this._events.trigger('euro-quantity-change');
    }
  }

  resetCurrencyList() {
    this.currencyList.splice(0, this.currencyList.length);
  }
}
