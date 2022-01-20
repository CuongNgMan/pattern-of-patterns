import { View } from './view';

export class CurrencyConverterModeSlider extends View {
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
                      <input class='EUR-${i.currencyName}' type='range' min='1' max='1000' step='1' value='${i.euroQuantity}' />
                    </td>
                    <td>
                      <input class='${i.currencyName}-EUR' type='range' min='1' max='${Math.floor(i.currencyRate * 1000)}' step='1' value='${
        i.convertedValue
      }'/>
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

  calculateSliderMax(i) {
    return Math.floor(i * 1000);
  }

  render(data) {
    this.root.innerHTML = this.generateHTMLElement(data);
  }
}
