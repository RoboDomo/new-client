class DelayedTask {
  constructor(fn, time) {
    this.fn = fn;
    this.timer = setTimeout(fn, time);
  }

  defer(time) {
    this.cancel();
    this.timer = setTimeout(this.fn, time);
  }

  cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

//
export default DelayedTask;
