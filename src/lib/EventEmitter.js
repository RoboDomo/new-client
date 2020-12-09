class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  setMaxListeners(num) {
    // console.log("setMaxListeners", num);
  }

  on(event, handler) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(handler);
  }

  un(event, handler) {
    this.removeListener(event, handler);
  }

  removeListener(event, handler) {
    if (!this.listeners[event]) {
      console.error("no listener(s) for event ", event);
      return;
    }
    const newListeners = [];
    for (const listener of this.listeners[event]) {
      if (listener !== handler) {
        newListeners.push(listener);
      }
    }
    this.listeners[event] = newListeners;
  }

  emit(event, ...rest) {
    const listeners = this.listeners[event] || [];
    for (const handler of listeners) {
      handler(...rest);
    }
  }

  listenerCount(event) {
    const listeners = this.listeners[event] || [];
    return listeners.length;
  }
}

//
export default EventEmitter;
