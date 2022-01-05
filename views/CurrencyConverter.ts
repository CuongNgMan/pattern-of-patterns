import { CurrencyConverterSliderItem } from './CurrencyConverterSliderItem';
import { Callback } from '../common/types/callback';
import { CurrencyConverterItem, CurrencyConverterItemProps } from './CurrencyConverterItem';
import { View } from './View';

type ConverterMode = 'multi' | 'single';
type ConverterViewMode = 'input' | 'slider';
type CurrencyConverterConfigs = {
  converterMode: ConverterMode;
  converterView: ConverterViewMode;
};

export class CurrencyConverter extends View<CurrencyConverterConfigs> {
  private _converterMode: ConverterMode = 'single';
  private _converterViewMode: ConverterViewMode = 'input';
  private _currencyData: CurrencyConverterItemProps[] = [];

  constructor(root: Element, data: CurrencyConverterItemProps[]) {
    super(root);

    this._currencyData = data;
    this.observer.subscribe((data) => {
      this.clearElement('.currency-item-container');
      this.renderConverter(data);
    });
  }

  set converterMode(v: ConverterMode) {
    this._converterMode = v;
  }

  set converterViewMode(v: ConverterViewMode) {
    this._converterViewMode = v;
  }

  get converterViewMode() {
    return this._converterViewMode;
  }

  get converterMode() {
    return this._converterMode;
  }

  get currencyData() {
    return this._currencyData;
  }

  regionsMap(): { [k: string]: string } {
    return {
      currencyItemContainer: '.currency-item-container',
    };
  }

  eventsMap(): { [k: string]: Callback } {
    return {
      'change:.converter-mode': this.onConverterModeToggleHandler,
      'change:.converter-view': this.onConverterViewToggleHandler,
    };
  }

  onRender(): void {
    this.renderConverter({ converterMode: 'multi', converterView: 'input' });
  }

  private renderConverter(options: CurrencyConverterConfigs) {
    const { converterMode, converterView } = options;

    this.currencyData?.forEach((v) => {
      switch (converterView) {
        case 'input':
          new CurrencyConverterItem(this.regions.currencyItemContainer, v).render();
          break;
        case 'slider':
          new CurrencyConverterSliderItem(this.regions.currencyItemContainer, v).render();
          break;
        default:
          new CurrencyConverterItem(this.regions.currencyItemContainer, v).render();
          break;
      }
    });
  }

  onConverterModeToggleHandler = (event) => {
    this.converterMode = event.target.checked ? 'multi' : 'single';
    this.observer.publish({ converterMode: this.converterMode, converterView: this.converterViewMode });
  };

  onConverterViewToggleHandler = (event) => {
    this.converterViewMode = event.target.checked ? 'slider' : 'input';
    this.observer.publish({ converterMode: this.converterMode, converterView: this.converterViewMode });
  };

  template(): string {
    return `
      <div>
        <label>Mode toggler: </label>
        <label class='switch'>
          <input class='converter-mode' type='checkbox'>
          <span class='slider'></span>
        </label>
      </div>
      <div>
        <label>View toggler: </label>
        <label class='switch'>
          <input class='converter-view' type='checkbox'>
          <span class='slider'></span>
        </label>
      </div>
      <div class='currency-item-container'></div>
    `;
  }
}
