import axios from 'axios';

import { Eventing } from './Event';

export class Collection<T, K> {
  private _url: string;
  private _models: T[] = [];
  private _events: Eventing = new Eventing();
  private _deserialized: (json: K) => T;

  constructor(rootUrl: string, deserialized: (json: K) => T) {
    this._url = rootUrl;
    this._deserialized = deserialized;
  }

  get data() {
    return this._models;
  }

  get on() {
    return this._events.on;
  }

  get trigger() {
    return this._events.trigger;
  }

  select(strategy: (item: T) => any, value): T | undefined {
    return this._models.find((i) => strategy(i) === value);
  }

  async fetch() {
    const response = await axios.get(this._url);
    if (response.data) {
      response.data.forEach((item: K) => {
        this._models.push(this._deserialized(item));
      });
    }
  }
}
