import Axios from 'axios';

export class Currency {
  id: number;
  currencyName: string = '';
  currencyRate: number;
  euroQuantity: number;
  convertedValue: number;

  constructor(id, name, rate, euroQuantity) {
    this.id = id;
    this.currencyName = name;
    this.currencyRate = rate;
    this.euroQuantity = euroQuantity;
    this.convertedValue = euroQuantity * rate;
  }

  currencyToEuro(value: number) {
    this.euroQuantity = value / this.currencyRate;
  }
}
