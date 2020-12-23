import EventEmitter from "lib/EventEmitter";
// import { connect } from "mqtt";
import { Client } from "paho-mqtt";

const debug = require("debug")("MQTT");

const timestamp = () => {
  const d = new Date();
  return (
    d.getHours() +
    ":" +
    d.getMinutes() +
    "." +
    d.getSeconds() +
    "." +
    (d.getTime() % 1000)
  );
};

class MQTT extends EventEmitter {
  constructor() {
    super();
    this.cache = {};
    this.setMaxListeners(50);
    this.interval = null;
    this.retain = true;
    //
    this.handleConnect = this.handleConnect.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
    this.connect = this.connect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    // this.connect();
  }

  connect() {
    // this.host = '192.168.0.40';
    this.conneected = false;
    this.host = "nuc1";
    this.port = 80;
    debug("... connecting", this.host, this.port);
    const mqtt = new Client(
      this.host,
      this.port,
      "myClientId" + new Date().getTime()
    );
    this.mqtt = mqtt;
    mqtt.disconnectedPublishing = true;
    mqtt.disconnectedBufferSize = 100;
    mqtt.onConnectionList = this.onFailure;
    mqtt.onMessageArrived = this.handleMessage;
    mqtt.connect({
      onSuccess: this.handleConnect,
      onFailure: this.handleFailure,
      keepAliveInterval: 10,
      reconnect: true,
    });
  }

  //
  async handleConnect() {
    debug("... connected");
    this.connected = true;
    this.emit("connect");
    // ping every so often (10 seconds?) to assure connection is alive and
    // radio not turned off due to lack of incoming.
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(async () => {
      const save = this.retain;
      this.retain = false;
      this.publish("ping", "ping");
      this.retain = save;
    }, 10000);
  }

  handleFailure() {
    debug("mqtt", "onFailure");
    this.emit("failure");
    alert("mqtt failure");
    this.connected = false;
    // mosca retries for us
  }

  emitMessage(topic, payload) {
    try {
      payload = JSON.parse(payload);
    } catch (e) {}
    this.emit(topic, topic, payload);
  }

  handleMessage(payload) {
    const topic = payload.destinationName,
      message = payload.payloadString,
      ds = timestamp();

    if (topic.indexOf("sysinfo") !== 0) {
      console.log(
        ds + " %cmessage <<< %c" + topic + " %c" + message.substr(0, 20),
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
    }
    localStorage.setItem(topic, message);
    this.cache[topic] = message;
    if (this.listenerCount(topic)) {
      // console.log(
      //   "%cmessage <<< %c" + topic + " %c" + message.substr(0, 20),
      //   "font-weight: bold;",
      //   "color:red; font-weight: bold",
      //   "color:blue; font-weight: bold"
      // );
      this.emitMessage(topic, message);
    }
    this.emit("message", topic, message);
  }

  onConnectionLost(e) {
    this.connected = false;
    console.log("mqtt", "onConnectionLost", e);
    this.emit("connectionlost");
    alert("connection lost");
    this.mqtt.connect({ success: this.handleConnect });
  }

  subscribe(topic, handler) {
    if (!this.connected) {
      return false;
    }
    if (!this.listenerCount(topic) && handler) {
      console.log(timestamp() + " subscribe", topic);
      this.mqtt.subscribe(topic);
    }
    else {
      console.log(timestamp() + " already subscribed", topic);
    }
    if (handler) {
      this.on(topic, handler);
    }
    const state = this.cache[topic] || localStorage.getItem(topic);
    if (state && handler) {
      setTimeout(() => {
        try {
          handler(topic, JSON.parse(state));
        } catch (e) {
          handler(topic, state);
        }
      }, 1);
    }
    return true;
  }

  unsubscribe(topic, handler) {
    if (handler) {
      this.removeListener(topic, handler);
      if (!this.listenerCount(topic)) {
        console.log("MQTT unsubscribe", topic);
        this.mqtt.unsubscribe(topic);
      }
    } else {
      this.mqtt.unsubscribe(topic);
    }
  }

  clearTopic(topic) {
    this.publish(topic, null);
  }

  publish(topic, message) {
    const ds = timestamp();

    if (message === null || message === undefined) {
      console.log(
        ds + " %cmessage >>> %c" + topic + " %c" + message,
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
      this.mqtt.publish(topic, message, 0);
    } else if (typeof message !== "string") {
      message = JSON.stringify(message);
      this.mqtt.publish(topic, message, 0);
      console.log(
        ds + " %cmessage >>> %c" + topic + " %c" + message,
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
      //      console.log("%cMQTT >>>", message, "backround:blue");
    } else {
      this.mqtt.publish(topic, String(message), 0);
      console.log(
        ds + " %c>>> message %c" + topic + " %c" + String(message),
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
      //      console.warn("MQTT >>>", String(message));
    }
  }
}

export default new MQTT();
