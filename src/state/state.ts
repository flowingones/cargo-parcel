export enum SubscriberProps {
  update,
  unsubscribeCallback,
}

export interface Subscriber<T> {
  update: (value: T) => void;
  unsubscribeCallback?: (unsubscribe: Unsubscribe) => void;
}

export type Unsubscribe = () => void;

let subscriber: Subscriber<unknown> | undefined;

export function setSubscriber(newSubscriber: Subscriber<unknown> | undefined) {
  subscriber = newSubscriber;
}

export function clearSubscriber() {
  subscriber = undefined;
}

export class State<T> {
  #value: T;
  #subscribers: Subscriber<T>[] = [];

  constructor(value: T) {
    this.#value = value;
  }

  get get() {
    if (subscriber) {
      this.subscribe(<Subscriber<T>> subscriber);
    }
    return this.#value;
  }

  set(value: T) {
    this.#value = value;
    this.#track();
  }

  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    if (!this.#subscribers.find((existing) => existing === subscriber)) {
      this.#subscribers.push(subscriber);
      subscriber.unsubscribeCallback?.call(this, () => {
        this.#subscribers = this.#subscribers.filter((existing) =>
          existing !== subscriber
        );
      });
    }

    return () => {
      this.#subscribers = this.#subscribers.filter((existing) =>
        existing === subscriber
      );
    };
  }

  #track() {
    this.#subscribers?.forEach((subscriber) => {
      subscriber.update(this.#value);
    });
  }
}
