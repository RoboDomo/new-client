import EventEmitter from "events";
import MQTT from './MQTT';

export let data = null;

// let registered = false;
class Config extends EventEmitter {
  constructor() {
    super();
    MQTT.subscribe('settings/status/config', (topic, message) => {
      data = message;
      // console.log("emit subscribe");
      this.emit('change', data);
    });
    window.addEventListener("orientationchange", () => {
      if (data) {
        data.orientation = window.orientation;
      console.log("emit orientation");
        this.emit('change', data);
      }
    });
  }

  registerChange(fn) {
    // if (!registered) {
    this.on('change', fn);
    //   registered = true;
    // }
    // if (data != null) {
    //   this.emit('change', data);
    // }
  }

  get state() {
    return data;
  }
}

export default Config;
