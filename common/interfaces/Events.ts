import { Callback } from '../types/callback';

export interface Events {
  on(event: string, cb: Callback): void;
  trigger(event: string): void;
}
