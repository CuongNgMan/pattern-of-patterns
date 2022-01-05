import axios from 'axios';

export class Sync<T> {
  private _url: string;

  constructor(url: string) {
    this._url = url;
  }

  async fetch(id: string): Promise<T> {
    const response = await axios.get(`${this._url}/${id}`);
    return response.data;
  }
}
