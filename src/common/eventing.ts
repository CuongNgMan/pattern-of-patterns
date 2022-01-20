type Callback = () => void;

export class Eventing {
  private _events: { [k: string]: Callback[] } = {};

  on = (event: string, callback: Callback) => {
    const handlers = this._events[event] || [];
    handlers.push(callback);
    this._events[event] = handlers;
  };

  trigger = (event: string) => {
    const handlers = this._events[event] || [];

    if (handlers.length) {
      handlers.forEach((handler) => handler());
    }
  };
}
