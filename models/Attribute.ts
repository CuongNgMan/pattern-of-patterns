export class Attributes<T> {
  constructor(private _data: T) {}

  get = <K extends keyof T>(k: K): T[K] => {
    return this._data[k];
  };

  set = (update: T) => {
    Object.assign(this._data, update);
  };

  getAll = () => {
    return this._data;
  };
}
