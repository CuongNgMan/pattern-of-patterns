import { Callback } from '../common/types/callback';

export class Eventing {
  private _events: { [key: string]: Callback[] } = {};

  on = (event: string, callback: Callback) => {
    const handlers = this._events[event] || [];
    handlers.push(callback);
    this._events[event] = handlers;
  };

  trigger = (event: string) => {
    const handlers = this._events[event];

    if (handlers && handlers.length) {
      handlers.forEach((cb) => cb());
    }
  };
}
