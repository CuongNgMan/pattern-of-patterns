import { View } from './view';

export class CurrencyConverterModeInput extends View {
  private elementEvents: Set<string> = new Set();

  constructor(root: Element, data) {
    super(root);
    this.render(data);
  }

  generateHTMLElement(data) {
    const arrStr = data.map((i) => {
      this.elementEvents.add(`.EUR-${i.currencyName}`);
      this.elementEvents.add(`.${i.currencyName}-EUR`);

      return `
        <div class='currency-item'>
          <div>${i.currencyName}</div>
          <div class='currency-exchange-info'>
            <div>
              <span>1 Euro is</span>
              <input type='text' value='${i.currencyRate}' readonly/>
              <span>${i.currencyName}</span>
            </div>
          </div>
          <div>
            <div>
              <table>
                <thead>
                  <tr>
                  <th>Euro</th>
                  <th>${i.currencyName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input class='EUR-${i.currencyName}' type='number' value='${i.euroQuantity}'/>
                    </td>
                    <td>
                      <input class='${i.currencyName}-EUR' type='number' value='${i.convertedValue}' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    });

    return arrStr.join('');
  }

  bindEvents(handler) {
    for (let name of this.elementEvents.values()) {
      const element = this.getElement(name);

      if (element) {
        element.addEventListener('change', (event) => {
          handler(+event.target.value, event.target.className);
        });
      }
    }
  }

  calculateValue(i) {
    return Number(Number.parseFloat(i.currencyRate) * i.euroQuantity).toFixed(6);
  }

  render(data) {
    this.root.innerHTML = this.generateHTMLElement(data);
  }
}
