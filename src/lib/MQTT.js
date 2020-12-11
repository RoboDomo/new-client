import EventEmitter from "lib/EventEmitter";
// import { connect } from "mqtt";
import { Client } from "paho-mqtt";

const debug = require("debug")("MQTT");

class MQTT extends EventEmitter {
  constructor() {
    super();
    // this.cache = {};
    this.setMaxListeners(50);
    //
    this.handleConnect = this.handleConnect.bind(this);
    this.handleFailure = this.handleFailure.bind(this);
    this.connect = this.connect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    // this.connect();
  }

  connect() {
    // this.host = '192.168.0.40';
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
  handleConnect() {
    debug("... connected");
    this.emit("connect");
  }

  handleFailure() {
    debug("mqtt", "onFailure");
    this.emit("failure");
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
      message = payload.payloadString;
    if (topic.indexOf("sysinfo") !== 0) {
      console.log(
        "%cmessage <<< %c" + topic + " %c" + message.substr(0, 20),
        "font-weight: bold;",
        "color:red; font-weight: bold",
        "color:blue; font-weight: bold"
      );
    }
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
    console.log("mqtt", "onConnectionLost", e);
    this.emit("connectionlost");
    this.mqtt.connect({ success: this.handleConnect });
  }

  subscribe(topic, handler) {
    if (!this.listenerCount(topic)) {
      console.log("MQTT subscribe", topic);
      this.mqtt.subscribe(topic);
    }
    if (handler) {
      this.on(topic, handler);
    }
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
