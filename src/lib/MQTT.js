import EventEmitter from "events";
import { connect } from "mqtt";

const debug = require("debug")("MQTT");

class MQTT extends EventEmitter {
  constructor() {
    super();
    this.connect = this.connect.bind(this);
    this.cache = {};
    this.setMaxListeners(500);
  }

  connect() {
    // this.host = '192.168.0.40';
    this.host = "nuc1";
    this.port = 1883;
    this.url = `ws://${this.host}`;
    console.log("... connecting", this.host, this.port, this.url);
    const mqtt = (this.mqtt = connect(this.url));
    // const mqtt = (this.mqtt = connect({ host: this.host, port: this.port }));

    mqtt.on("connect", this.onConnect.bind(this));
    mqtt.on("failure", this.onFailure.bind(this));
    mqtt.on("message", this.onMessageArrived.bind(this));
    mqtt.on("close", this.onConnectionLost.bind(this));
  }

  //
  onConnect() {
    this.emit("connect");
    debug("... connected");
  }

  onFailure() {
    console.log("mqtt", "onFailure");
    this.emit("failure");
    alert("mqtt failure");
    // mosca retries for us
  }

  emitMessage(topic, payload) {
    try {
      payload = JSON.parse(payload);
    } catch (e) {}
    this.emit(topic, topic, payload);
  }

  onMessageArrived(topic, payload) {
    let  message = payload.toString();
    try { message = JSON.parse(message); } catch (e) {}
    console.log(
      "%cmessage <<< %c" + topic + " %c",
      "font-weight: bold;",
      "color:red; font-weight: bold",
      "color:blue; font-weight: bold",
      message
    );
    // localStorage.setItem(topic, message);
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
    console.log("mqtt", "onConnectionLost", e, this.subscriptions);
    this.emit("connectionlost");
    // mosca reonnects for us
  }

  subscribe(topic, handler) {
    if (!this.listenerCount(topic)) {
      console.log("MQTT subscribe", topic);
      this.mqtt.subscribe(topic);
    }
    if (handler) {
      // console.log("MQTT add handler", topic);
      this.on(topic, handler);
    }

    if (this.cache[topic]) {
      const state = this.cache[topic];
      setTimeout(() => {
        try {
          handler(topic, JSON.parse(state));
        } catch (e) {
          handler(topic, state);
        }
      }, 1);
    }
    return true;
    // const state = this.cache[topic] || localStorage.getItem(topic);
    // if (state && handler) {
    //   setTimeout(() => {
    //     try {
    //       handler(topic, JSON.parse(state));
    //     } catch (e) {
    //       handler(topic, state);
    //     }
    //   }, 1);
    // }
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

  publish(topic, message) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
      this.mqtt.publish(topic, message);
      console.log(
        "%cmessage >>> %c" + topic + " %c" + message,
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
      //      console.log("%cMQTT >>>", message, "backround:blue");
    } else {
      this.mqtt.publish(topic, String(message));
      console.log(
        "%c>>> message %c" + topic + " %c" + String(message),
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
      //      console.warn("MQTT >>>", String(message));
    }
  }
}

export default new MQTT();
