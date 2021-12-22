// TODO: WIP
export abstract class View {
  private _parent: Element;

  constructor(parent: Element) {
    this._parent = parent;

    this.render();
  }

  createElement = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) => {
    const element = document.createElement(tag);

    if (className) {
      element.classList.add(className);
    }

    return element;
  };

  getElement = (selector: string) => {
    return document.querySelector(selector);
  };

  abstract template(): string;

  render() {
    this._parent.innerHTML = '';
    const template = this.createElement('template');
    template.innerHTML = this.template();

    this._parent.prepend(template.content);
  }
}
