import { View } from './view';
// import { CurrencyConverterItems, ViewMode, ConverterMode } from './currency-converter-items';
import { CurrencyConverterModeInput } from './currency-converter-mode-input';
import { CurrencyConverterModeSlider } from './currency-converter-mode-slider';

export type ViewMode = 'input' | 'slider';
export type ConverterMode = 'single' | 'multi';

export class CurrencyConverterView extends View {
  modeToggleLabel = 'Mode toggler';
  viewToggleLabel = 'View toggler';
  currencyItemContainer: Element = null;
  currencyConverter: CurrencyConverterModeInput | CurrencyConverterModeSlider = null;
  currencyData: [] = [];
  currentMode: ViewMode = 'input';

  constructor(root: Element) {
    super(root);

    this.root.innerHTML = this.template();
    this.currencyItemContainer = this.getElement('.currency-item-container');
  }

  template() {
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

  bindConverterMode(handler) {
    this.getElement('.converter-mode').addEventListener('change', (event) => {
      const converterMode: ConverterMode = event.target.checked ? 'multi' : 'single';
      handler(converterMode);
    });
  }

  bindConverterViewMode(handler) {
    this.getElement('.converter-view').addEventListener('change', (event) => {
      const viewMode: ViewMode = event.target.checked ? 'slider' : 'input';
      this.currentMode = viewMode;
      handler(viewMode as string);
    });
  }

  bindCurrencyConverterHandler(handler) {
    this.currencyConverter.bindEvents(handler);
  }

  bindCurrencyData(data) {
    this.currencyData = data;
  }

  renderConverter(mode: 'input' | 'slider') {
    this.currencyConverter = this.renderConverterByMode(mode);
  }

  clearHTMLContent() {
    this.currencyItemContainer.innerHTML = '';
  }

  renderConverterByMode(mode: ViewMode) {
    switch (mode) {
      case 'input':
        return new CurrencyConverterModeInput(this.currencyItemContainer, this.currencyData);
      case 'slider':
        return new CurrencyConverterModeSlider(this.currencyItemContainer, this.currencyData);
      default:
        return new CurrencyConverterModeInput(this.currencyItemContainer, this.currencyData);
    }
  }
}
