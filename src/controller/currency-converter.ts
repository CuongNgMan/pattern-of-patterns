import { Eventing } from '../common/eventing';

import { CurrencyListMultiMode } from '../model/currency-list-multi';
import { CurrencyListSingleMode } from '../model/currency-list-single';

import { CurrencyConverterView } from '../view/currency-converter';

export class CurrencyConverter {
  private _event: Eventing = new Eventing();
  view: CurrencyConverterView;
  model: CurrencyListMultiMode | CurrencyListSingleMode;

  constructor(root: Element) {
    this.view = new CurrencyConverterView(root);
    this.model = new CurrencyListSingleMode();
    this.init('input');
    this.registerEvents();
  }

  init(mode) {
    this.model.fetch().then(() => {
      this.view.bindCurrencyData(this.model.currencyList);
      this.view.bindConverterMode(this.onConverterModeChangeHandler);
      this.view.bindConverterViewMode(this.onConverterViewChangeHandler);

      this.renderBindingView(mode);
    });
  }

  registerEvents() {
    this.model.on('euro-quantity-change', () => {
      this.renderBindingView(this.view.currentMode);
    });
  }

  renderBindingView(mode: 'input' | 'slider') {
    this.view.renderConverter(mode);
    this.view.bindCurrencyConverterHandler(this.onConverterValueChangeHandler);
  }

  get on() {
    return this._event.on;
  }

  get trigger() {
    return this._event.trigger;
  }

  onConverterModeChangeHandler = (data) => {
    this.model = data === 'multi' ? new CurrencyListMultiMode() : new CurrencyListSingleMode();
    this.init(this.view.currentMode);
    this.registerEvents();
  };

  onConverterViewChangeHandler = (data) => {
    this.renderBindingView(this.view.currentMode);
  };

  onConverterValueChangeHandler = async (value, className) => {
    if (this.isConvertedToCurrency(className)) {
      const currencyName = className.split('-')[1];
      this.model.setCurrencyValue(value, 'euro', currencyName);
    }

    if (this.isConvertedToEuro(className)) {
      const currencyName = className.split('-')[0];
      this.model.setCurrencyValue(value, 'currency', currencyName);
    }
  };

  isConvertedToEuro(className) {
    return String.prototype.endsWith.apply(className, ['-EUR']);
  }

  isConvertedToCurrency(className) {
    return String.prototype.startsWith.apply(className, ['EUR-']);
  }
}
