import { Callback } from '../common/types/callback';
import { Observer, createObserver } from './common/observer';

type EventsMap = { [k: string]: Callback };
type Regions = { [k: string]: Element };
type ElementsMap = { [k: string]: string };

interface IView {
  eventsMap(): EventsMap;
  regionsMap(): ElementsMap;
}
export abstract class View<T> {
  parent: Element;
  regions: Regions = {};
  observer: Observer<T> = createObserver<T>();

  constructor(parent: Element) {
    this.parent = parent;

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

  getAllElement = (selector: string) => {
    return document.querySelectorAll(selector);
  };

  clearElement = (selector: string) => {
    const element = this.parent.querySelector(selector);
    if (element) {
      element.innerHTML = '';
    }
  };

  bindEvents(fragment: DocumentFragment) {
    const events = this.eventsMap();
    for (let key in events) {
      const [eventName, selector] = key.split(':');
      fragment.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, events[key]);
      });
    }
  }

  bindRegions(fragment: DocumentFragment) {
    const regions = this.regionsMap();
    for (let key in regions) {
      const selector = regions[key];
      const element = fragment.querySelector(selector);
      if (element) {
        this.regions[key] = element;
      }
    }
  }

  render(data?: any) {
    this.parent.innerHTML = '';
    const template = this.createElement('template');
    template.innerHTML = this.template();

    this.bindEvents(template.content);
    this.bindRegions(template.content);

    this.onRender(data);

    this.parent.prepend(template.content);
  }
  abstract template(): string;
  abstract regionsMap(): ElementsMap;
  abstract eventsMap(): EventsMap;
  abstract onRender(data?: any): void;
}
