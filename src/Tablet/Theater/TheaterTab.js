import React from "react";

import { Row, Col } from "react-bootstrap";

import ActivitiesListGroup from "Tablet/Theater/ActivitiesListGroup";
import DevicesListGroup from "Tablet/Theater/DevicesListGroup";
import SpeakersListGroup from "Tablet/Theater/SpeakersListGroup";

import AudioControls from "Tablet/Theater/AudioControls";
import ButtonList from "Tablet/Theater/ButtonList";

import AppleTVControls from "Tablet/Theater/Devices/AppleTVControls";
import RokuControls from "Tablet/Theater/Devices/RokuControls";
import TivoControls from "Tablet/Theater/Devices/TivoControls";
import BraviaControls from "Tablet/Theater/Devices/BraviaControls";
import DenonControls from "Tablet/Theater/Devices/DenonControls";

import MQTT from "lib/MQTT";
import { isOn, mangle } from "lib/Utils";

class TheaterTab extends React.Component {
  constructor(props) {
    super(props);
    this.theater = props.theater;
    this.activities = this.theater.activities;
    this.devices = this.theater.devices;
    this.state = {
      currentActivity: { name: "All Off" },
      currentDevice: { name: "None" },
      devices: this.devices,
      avr: {
        power: false,
        input: "",
        mute: false,
        masterVolume: 0,
        surroundMode: "",
        centerVolume: 0,
        inputMode: "AUTO",
      },
      appletv: null,
      roku: null,
      tv: { power: false },
    };

    for (let device of this.theater.devices) {
      switch (device.type) {
        case "bravia":
          this.state.tv = device;
          break;
        case "lgtv":
          this.state.tv = device;
          break;
        case "denon":
          this.state.avr = device;
          break;
        case "appletv":
          this.state.appletv = device;
          break;
        case "tivo":
          this.state.tivo = device;
          break;
        case "roku":
          this.state.roku = device;
          break;
        default:
          break;
      }
    }

    //
    this.handleActivityClick = this.handleActivityClick.bind(this);
    this.handleDeviceClick = this.handleDeviceClick.bind(this);
    this.handleBraviaMessage = this.handleBraviaMessage.bind(this);
    this.handleLGTVMessage = this.handleLGTVMessage.bind(this);
    this.handleDenonMessage = this.handleDenonMessage.bind(this);
    this.handleRokuMessage = this.handleRokuMessage.bind(this);
  }

  findDevice(name) {
    for (const device of this.devices) {
      if (mangle(device.name) === mangle(name)) {
        return device;
      }
    }
    return null;
  }

  handleInputChange(state) {
    console.log("change", state);
    // if (state.avr && state.avr.power === false) {
    //   state.avr.input = "OFF";
    // }
    if (state.tv && state.tv.power === false) {
      // state.tv.input = "OFF";
      state.currentActivity = { name: "All Off" };
      // state.currentDevice = null;
      return;
    }
    if (state.avr && state.tv.avr === false) {
      state.currentActivity = { name: "All Off" };
      // state.currentDevice = null;
      return;
    }
    // console.log("handleInputChange", state);
    const tvInput = mangle(state.tv.input),
      avrInput = mangle(state.avr.input);

    if (tvInput === undefined || avrInput === undefined) {
      console.log("inputs undefined");
      return;
    }

    for (const activity of this.activities) {
      const inputs = activity.inputs;
      if (inputs) {
        if (mangle(inputs.tv) === tvInput && mangle(inputs.avr) === avrInput) {
          state.currentActivity = activity;
          state.currentDevice = this.findDevice(activity.defaultDevice);
          return;
        }
      } else {
        state.currentActivity = activity;
        state.currentDevice = null;
      }
    }
  }

  handleBraviaMessage(topic, message) {
    const t = topic.split("/").pop();
    const state = Object.assign({}, this.state);
    switch (t) {
      case "power":
        state.tv.power = isOn(message);
        break;
      case "input":
        state.tv.input = message.toUpperCase();
        break;
      default:
        console.log("invalid", topic, message);
        return;
    }
    this.handleInputChange(state);
    this.setState(state);
  }

  handleRokuMessage(topic, message) {
    console.log("ROKU", topic, message);
    this.setStae({ roku: message });
  }

  handleLGTVMessage(topic, message) {
    const t = topic.split("/").pop(),
      state = Object.assign({}, this.state);

    switch (t) {
      case "power":
        state.tv.power = isOn(message);
        this.handleInputChange(state);
        break;
      case "launchPoints":
        state.launchPoints = message;
        if (state.foregroundApp) {
          const foregroundApp = state.foregroundApp;
          const app = state.launchPoints[foregroundApp.appId];
          console.log("app", app);
          const title = app.title;
          console.log("title", title);
          const lp = title || "unknown";
          const inp = state.tv.power ? lp : "OFF";

          state.tv.input = inp;
          console.log("foregroundApp", state.foregroundApp, title, lp, inp);
          state.tv.input = inp;
          console.log("change", inp);
          this.handleInputChange(state);
        } else {
          state.tv.input = "OFF";
          this.handleInputChange(state);
        }
        break;
      case "foregroundApp":
        console.log("foregroundApp", message);
        state.foregroundApp = message;
        if (!state.launchPoints) {
          state.tvInput = "OFF";
          console.log("change OFF");
          this.handleInputChange(state);
        } else {
          const foregroundApp = state.foregroundApp;
          if (foregroundApp.appId !== "") {
            const app = state.launchPoints[foregroundApp.appId];
            console.log("app", app);
            const title = app.title;
            console.log("title", title);
            const lp = title || "unknown";
            const inp = state.tv.power ? lp : "OFF";

            state.tv.input = inp;
            // if (state.tv.power) {
            console.log("change ", inp);
            // }
          }
          this.handleInputChange(state);
        }
        break;
      default:
        return;
    }
    this.setState(state);
  }

  handleDenonMessage(topic, message) {
    const t = topic.split("/").pop();
    const state = Object.assign({}, this.state);

    switch (t) {
      case "PW":
        state.avr.power = isOn(message);
        if (!state.avr.power) {
          this.avr.input = "OFF";
        }
        this.handleInputChange(state);
        break;
      case "SI":
        // console.log("SI", message);
        state.avr.input = message;
        this.handleInputChange(state);
        break;
      case "MV":
        state.avr.masterVolume = parseInt("" + message, 10);
        break;
      case "MS":
        state.avr.surroundMode = message;
        break;
      case "CVC":
        let m = "" + message,
          v = parseInt(m, 10);
        if (m.length === 2) {
          v *= 10;
        }
        state.avr.centerVolume = v;
        break;
      case "DC":
        state.avr.inputMode = message;
        break;
      default:
        return;
    }
    this.setState(state);
  }

  handleActivityClick(activity) {
    console.log("Clicked activity", activity);
    const state = Object.assign({}, this.state);
    state.currentActivity = activity;
    state.currentDevice = this.findDevice(activity.defaultDevice);
    this.setState(state);

    if (activity.macro) {
      MQTT.publish("macros/run", activity.macro);
    }
  }

  handleDeviceClick(device) {
    console.log("Clicked device", device);
    const state = Object.assign({}, this.state);
    state.currentDevice = device;
    this.setState(state);
  }

  componentDidMount() {
    this.devices.map((device) => {
      switch (device.type) {
        case "bravia":
          this.tv = device;
          MQTT.subscribe(
            `bravia/${device.device}/status/power`,
            this.handleBraviaMessage
          );
          MQTT.subscribe(
            `bravia/${device.device}/status/input`,
            this.handleBraviaMessage
          );
          break;

        case "lgtv":
          this.tv = device;
          MQTT.subscribe(
            `lgtv/${device.device}/status/power`,
            this.handleLGTVMessage
          );
          MQTT.subscribe(
            `lgtv/${device.device}/status/launchPoints`,
            this.handleLGTVMessage
          );
          MQTT.subscribe(
            `lgtv/${device.device}/status/foregroundApp`,
            this.handleLGTVMessage
          );
          break;

        case "denon":
          this.avr = device;
          MQTT.subscribe(
            `denon/${device.device}/status/SI`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/PW`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/MV`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/MS`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/CVC`,
            this.handleDenonMessage
          );
          MQTT.subscribe(
            `denon/${device.device}/status/DC`,
            this.handleDenonMessage
          );
          break;

        default:
          break;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.devices.map((device) => {
      switch (device.type) {
        case "bravia":
          MQTT.unsubscribe(
            `bravia/${device.device}/status/power`,
            this.handleBraviaMessage
          );
          MQTT.unsubscribe(
            `bravia/${device.device}/status/input`,
            this.handleBraviaMessage
          );
          break;

        case "lgtv":
          MQTT.unsubscribe(
            `lgtv/${device.device}/status/power`,
            this.handleLGTVMessage
          );
          MQTT.unsubscribe(
            `lgtv/${device.device}/status/input`,
            this.handleLGTVMessage
          );
          break;

        case "denon":
          this.avr = device;
          MQTT.unsubscribe(
            `denon/${device.device}/status/SI`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/PW`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/MV`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/MS`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/CVC`,
            this.handleDenonMessage
          );
          MQTT.unsubscribe(
            `denon/${device.device}/status/DC`,
            this.handleDenonMessage
          );
          break;

        default:
          break;
      }

      return false;
    });
  }

  renderDevice() {
    const currentDevice = this.state.currentDevice;
    if (!currentDevice || !currentDevice.type) {
      return null;
    }

    switch (currentDevice.type) {
      case "tivo":
        return <TivoControls device={this.state.tivo} />;
      case "bravia":
        return <BraviaControls device={this.state.tv} />;
      case "denon":
        return <DenonControls device={this.state.avr} />;
      case "roku":
        return <RokuControls device={this.state.roku} />;
      default:
        return <AppleTVControls device={this.state.appletv} />;
    }
  }

  render() {
    const state = Object.assign({}, this.state);
    this.handleInputChange(state);
    console.log(
      "render",
      "tv",
      state.tv.power,
      state.tv.input,
      "avr",
      state.avr.power,
      state.avr.input
    );
    console.log(
      "  render",
      "tv",
      this.state.tv.power,
      this.state.tv.input,
      "avr",
      this.state.avr.power,
      this.state.avr.input
    );
    return (
      <Row style={{ marginTop: 12 }}>
        <Col sm={2}>
          <ActivitiesListGroup
            activities={this.activities}
            currentActivity={state.currentActivity.name}
            onClick={this.handleActivityClick}
          />

          <div style={{ marginTop: 12 }} />

          <DevicesListGroup
            devices={this.devices}
            tv={state.tv.input}
            avr={state.avr.input}
            /* state={this.state} */
            currentDevice={state.currentDevice}
            onClick={this.handleDeviceClick}
          />

          <div style={{ marginTop: 12 }} />

          <SpeakersListGroup tv={state.tv} avr={state.avr} />
        </Col>

        <Col sm={10}>
          <Row style={{ width: "100%", textAlign: "center" }}>
            <Col sm={2}>
              <AudioControls avr={state.avr} />
            </Col>

            <Col sm={7}>{this.renderDevice()}</Col>

            <Col sm={3}>
              <ButtonList theater={this.theater} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  set currentActivity(activity) {
    this.setState({ currentActivity: activity });
  }

  get currentActivity() {
    return this.state.currentActivity;
  }

  set currentDevice(device) {
    this.setState({ currentDevice: device });
  }

  get currentDevice() {
    return this.state.currentDevice;
  }
}

//
export default TheaterTab;
