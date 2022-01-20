export abstract class View {
  root: Element;

  constructor(root: Element) {
    this.root = root;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className) element.classList.append(className);

    return element;
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  getAllElement(selector) {
    return document.querySelectorAll(selector);
  }
}
