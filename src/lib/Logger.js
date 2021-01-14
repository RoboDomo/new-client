import EventEmitter from "lib/EventEmitter";
const debug = require("debug")("Logger"),
  os = require("os"),
  LOCALSTORAGE_KEY = "LOGGER",
  MAX_LOG = 50;

class Logger extends EventEmitter {
  constructor() {
    super();
    try {
      const item = localStorage.getItem(LOCALSTORAGE_KEY);
      const buffer = item ? JSON.parse(item) : {};

      this.buffer = buffer;
    } catch (e) {
      this.buffer = {};
    }

    this.store = () => {
      const json = JSON.stringify(this.buffer);
      debug("Logger.store", json);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.buffer));
      this.emit("change", "global", this.buffer);
    };

    this.clear = (which) => {
      this.buffer[which] = [];
      this.store();
      this.emit("change", which, []);
    };

    this.history = (which) => {
      return this.buffer[which] || [];
    };

    this.log = (which, message) => {
      console.log("LOG", which, message);
      this.buffer[which] = this.buffer[which] || [];
      this.buffer[which].push(message);
      while (this.buffer[which].length > MAX_LOG) {
        this.buffer[which].unshift();
      }
      this.store();
      this.emit("change", which, this.buffer[which]);
    };

    this.alert = (message) => {
      if (typeof message === "string") {
        this.log("alerts", {
          message: [message],
          timestamp: Date.now(),
          type: "alert",
          host: os.hostname(),
        });
      } else if (Array.isArray(message)) {
        this.log("alerts", {
          message: message,
          type: "alert",
          timestamp: Date.now(),
          host: os.hostname(),
        });
      } else {
        message.timestamp = message.timestamp || Date.now();
        message.type = message.type || "alert";
        this.log("alerts", message);
      }
    };
  }
}

//
export default new Logger();
