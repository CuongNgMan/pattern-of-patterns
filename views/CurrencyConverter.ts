import { CurrencyConverterItem, CurrencyConverterItemProps } from './CurrencyConverterItem';

// TODO: WIP
export class CurrencyConverter {
  private _parent: Element;

  constructor(root: Element) {
    this._parent = root;
  }

  bindEvents(template: DocumentFragment) {
    const eventsMap = this.eventMaps();
    for (const event in eventsMap) {
      const [eventType, className] = event.split(':');
      template.querySelectorAll(className).forEach((element) => {
        element.addEventListener(eventType, eventsMap[event]);
      });
    }
  }

  eventMaps() {
    return {
      'change:.converter-mode': this.onConverterModeToggleHandler,
    };
  }

  onConverterModeToggleHandler = (event) => {
    console.log('toggle', event.target.checked);
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
    `;
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = this.template();
    this.bindEvents(template.content);

    this._parent.append(template.content);
  }
}
