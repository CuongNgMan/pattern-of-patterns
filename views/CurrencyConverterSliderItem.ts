type Listener<T> = (ev: T) => void;

type Observer<T> = {
  subscribe: (listener: Listener<T>) => () => void;
  publish: (event: T) => void;
};

function createObserver<T>(): Observer<T> {
  let listeners: Listener<T>[] = [];

  return {
    subscribe: (listener: Listener<T>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: T) => {
      listeners.forEach((l) => l(event));
    },
  };
}

type CurrencyChangeEvent = {
  type: 'EUR' | 'X';
  value: number;
};

export interface CurrencyConverterItemSliderProps {
  currencyName: string;
  currencyRate: number;
}

export class CurrencyConverterSliderItem {
  private _parent: Element;
  private _euroQuantity: number = 100;
  private _xName: string = '';
  private _xRate: number = 0;
  private _observer: Observer<CurrencyChangeEvent> = createObserver<CurrencyChangeEvent>();

  constructor(root: Element, data: CurrencyConverterItemSliderProps) {
    this._parent = root;

    this._xName = data.currencyName;
    this._xRate = data.currencyRate;

    this._observer.subscribe((data) => {
      const { type, value } = data;

      if (type === 'EUR') {
        const xCurrency = this.getElement(`.slider-${this.xName}-euro`) as HTMLInputElement;
        xCurrency.value = parseFloat(`${value * this.xRate}`).toFixed(3);
      } else {
        const euro = this.getElement(`.slider-euro-${this.xName}`) as HTMLInputElement;
        euro.value = parseFloat(`${value / this.xRate}`).toFixed(2);
      }
    });
  }

  getElement(selector: string) {
    return document.querySelector(selector);
  }

  getAllElement(selector: string) {
    return document.querySelectorAll(selector);
  }

  eventsMap(): { [k: string]: (event) => void } {
    return {
      [`change:.slider-euro-${this.xName}`]: this.onEuroCurrencyChangeHandler,
      [`change:.slider-${this.xName}-euro`]: this.onXCurrencyChangeHandler,
    };
  }

  onEuroCurrencyChangeHandler = (event) => {
    this._observer.publish({ type: 'EUR', value: +event.target.value });
  };

  onXCurrencyChangeHandler = (event) => {
    this._observer.publish({ type: 'X', value: +event.target.value });
  };

  bindEvents(fragment: DocumentFragment) {
    const eventsMap = this.eventsMap();
    for (const event in eventsMap) {
      const [eventType, className] = event.split(':');
      fragment.querySelectorAll(className).forEach((element) => {
        element.addEventListener(eventType, eventsMap[event]);
      });
    }
  }

  template(): string {
    return `
      <div class='currency-item'>
        <div>${this.xName}</div>
        <div class='currency-exchange-info'>
          <div>
            <span>1 Euro is</span>
            <input type='text' value='${this.xRate}' readonly/>
            <span>${this.xName}</span>
          </div>
        </div>
        <div>
          <div>
            <table>
              <thead>
                <tr>
                <th>Euro</th>
                <th>${this.xName}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input class='slider-euro-${this.xName}' type='range' min='1' max='1000' step='1'/>
                  </td>
                  <td>
                    <input class='slider-${this.xName}-euro' type='range' min='1' max='${Math.floor(this.xRate * 1000)}' step='1'/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  get euroQuantity() {
    return this._euroQuantity;
  }

  get xRate() {
    return this._xRate;
  }

  get xName() {
    return this._xName;
  }

  get xValue() {
    return this.euroQuantity * this.xRate;
  }

  set euroQuantity(value) {
    this._euroQuantity = value;
  }

  set xRate(value) {
    this._xRate = value;
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = this.template();
    this.bindEvents(template.content);

    this._parent.append(template.content);
  }
}
