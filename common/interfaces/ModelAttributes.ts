export interface ModelAttributes<T> {
  get<K extends keyof T>(k: K): T[K];
  set(u: T): void;
  getAll(): T;
}
