type Listener<EventType> = (ev: EventType) => void;

type Observer<EventType> = {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
};

function createObserver<EventType>(): Observer<EventType> {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}

type CurrencyChangeEvent = {
  type: 'EUR' | 'X';
  value: number;
};

export interface CurrencyConverterItemProps {
  currencyName: string;
  currencyRate: number;
}

export class CurrencyConverterItem {
  private _parent: Element;
  private _euroQuantity: number = 100;
  private _xName: string = '';
  private _xRate: number = 0;
  private _observer: Observer<CurrencyChangeEvent> = createObserver<CurrencyChangeEvent>();

  constructor(root: Element, data: CurrencyConverterItemProps) {
    this._parent = root;

    this._xName = data.currencyName;
    this._xRate = data.currencyRate;

    this._observer.subscribe((data) => {
      const { type, value } = data;

      if (type === 'EUR') {
        const xCurrency = this.getElement(`.${this.xName}-euro`) as HTMLInputElement;
        xCurrency.value = parseFloat(`${value * this.xRate}`).toFixed(3);
      } else {
        const euro = this.getElement(`.euro-${this.xName}`) as HTMLInputElement;
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
      [`keyup:.euro-${this.xName}`]: this.onEuroCurrencyChangeHandler,
      [`keyup:.${this.xName}-euro`]: this.onXCurrencyChangeHandler,
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
                    <input class='euro-${this.xName}' type='number' value='${this.euroQuantity}'/>
                  </td>
                  <td>
                    <input class='${this.xName}-euro' type='number' value='${this.xValue}' data-currency='${this.xName}'/>
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
