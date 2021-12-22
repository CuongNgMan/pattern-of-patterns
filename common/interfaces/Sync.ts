export interface Sync<T> {
  fetch(id: string): Promise<T>;
}
