import { Sync } from '../common/interfaces/Sync';
import { Events } from '../common/interfaces/Events';
import { BaseModel } from '../common/interfaces/Base';
import { ModelAttributes } from '../common/interfaces/ModelAttributes';

export class Model<T extends BaseModel> {
  private _events: Events;
  private _sync: Sync<T>;
  private _attributes: ModelAttributes<T>;

  constructor(events: Events, sync: Sync<T>, attributes: ModelAttributes<T>) {
    this._events = events;
    this._sync = sync;
    this._attributes = attributes;
  }

  fetch() {
    const id = this._attributes.get('id');
    this._sync.fetch(id).then((data) => {
      this.set(data);
    });
  }

  get on() {
    return this._events.on;
  }

  get trigger() {
    return this._events.trigger;
  }

  set(data: T) {
    this._attributes.set(data);
    this._events.trigger('change');
  }

  get get() {
    return this._attributes.get;
  }
}
