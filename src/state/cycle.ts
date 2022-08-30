const cycleListeners: (() => void)[] = [];

export function cycle() {
  cycleListeners.forEach((listener) => {
    listener();
  });
}

export function listener(listener: () => void) {
  cycleListeners.push(listener);
}
