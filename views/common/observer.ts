type Listener<EventType> = (ev: EventType) => void;

export type Observer<EventType> = {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
};

export function createObserver<EventType>(): Observer<EventType> {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}
