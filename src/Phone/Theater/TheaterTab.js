/*
 ____  _                       
|  _ \| |__   ___  _ __   ___  
| |_) | '_ \ / _ \| '_ \ / _ \ 
|  __/| | | | (_) | | | |  __/ 
|_|   |_| |_|\___/|_| |_|\___| 
                               
 _____ _                _           _____     _      
|_   _| |__   ___  __ _| |_ ___ _ _|_   _|_ _| |__   
  | | | '_ \ / _ \/ _` | __/ _ \ '__|| |/ _` | '_ \  
  | | | | | |  __/ (_| | ||  __/ |   | | (_| | |_) | 
  |_| |_| |_|\___|\__,_|\__\___|_|   |_|\__,_|_.__/  
*/

import React from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";

import { FaVolumeMute, FaVolumeUp, FaVolumeDown } from "react-icons/fa";

import MQTT from "lib/MQTT";
import { isOn, mangle } from "lib/Utils";

import ActivitiesMenu from "./ActivitiesMenu";
import DevicesMenu from "./DevicesMenu";

// import Audio from "./Devices/Audio";
import TiVo from "./Devices/TiVo";
 import AppleTV from "./Devices/AppleTV";
// import LGTVControl from "./Devices/LGTV";
// import Harmony from "./Devices/Harmony";

class TheaterTab extends React.Component {
  constructor(props) {
    super();
    this.theater = props.theater;
    this.activities = this.theater.activities;
    this.devices = this.theater.devices;
    this.state = {
      show: false,
      menu: false,
      currentActivity: { name: "All Off" },
      currentDevice: null,
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
      tv: { power: false },
    };

    //
    for (let device of this.devices) {
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
        default:
          break;
      }
    }

    //
    this.handleActivityClick = this.handleActivityClick.bind(this);
    this.handleDeviceClick = this.handleDeviceClick.bind(this);
    this.handleSpeakersClick = this.handleSpeakersClick.bind(this);
    this.handleBraviaMessage = this.handleBraviaMessage.bind(this);
    this.handleLGTVMessage = this.handleLGTVMessage.bind(this);
    this.handleDenonMessage = this.handleDenonMessage.bind(this);
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
    if (state.tv && state.tv.power === false) {
      state.currentActivity = { name: "All Off" };
      state.currentDevice = null;
      return;
    }
    if (state.avr && state.avr.power === false) {
      state.currentActivity = { name: "All Off" };
      state.currentDevice = null;
      return;
    }
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
        this.handleInputChange(state);
        break;
      case "input":
        state.tv.input = message.toUpperCase();
        this.handleInputChange(state);
        break;
      default:
        return;
    }
    this.setState(state);
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
          const title = app.title;
          const lp = title || "unknown";
          const inp = state.tv.power ? lp : "OFF";

          state.tv.input = inp;
          state.tv.input = inp;
          this.handleInputChange(state);
        } else {
          state.tv.input = "OFF";
          this.handleInputChange(state);
        }
        break;
      case "foregroundApp":
        state.foregroundApp = message;
        if (!state.launchPoints) {
          state.tvInput = "OFF";
          this.handleInputChange(state);
        } else {
          const foregroundApp = state.foregroundApp;
          if (foregroundApp.appId !== "") {
            const app = state.launchPoints[foregroundApp.appId];
            const title = app.title;
            const lp = title || "unknown";
            const inp = state.tv.power ? lp : "OFF";

            state.tv.input = inp;
            // if (state.tv.power) {
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
        this.handleInputChange(state);
        break;
      case "SI":
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
    if (activity.macro) {
      MQTT.publish("macros/run", activity.macro);
    }
    this.setState({ show: false, curentActivity: activity });
  }

  handleDeviceClick(device) {
    console.log("Clicked device", device);
    this.setState({ show: false, currentDevice: device });
  }

  handleSpeakersClick(speakers) {
    console.log("clicked speakers", speakers);
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

  renderActivities() {
    return (
      <>
        <h4>Activities</h4>
        <div style={{ textAlign: "center" }}>
          <ActivitiesMenu
            onSelect={this.handleActivityClick}
            activities={this.activities}
            currentActivity={this.state.currentActivity}
          />
        </div>
      </>
    );
  }

  renderDevices() {
    return (
      <>
        <h4>Devices</h4>
        <div style={{ textAlign: "center" }}>
          <DevicesMenu
            onSelect={this.handleDeviceClick}
            devices={this.devices}
            currentDevice={this.state.currentDevice}
          />
        </div>
      </>
    );
  }

  renderModal() {
    const renderActivities = () => {
      if (this.state.modal !== "activities") {
        return null;
      }
      return this.renderActivities();
    };

    const renderDevices = () => {
      if (this.state.modal !== "devices") {
        return null;
      }
      return this.renderDevices();
    };

    return (
      <Modal
        show={this.state.show}
        onHide={() => {
          this.setState({ show: false });
        }}
      >
        <Modal.Header>
          <h1>
            {this.state.modal === "activies"
              ? "Choose Activity"
              : "Choose Device"}
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div style={{ flex: 1, fontSize: 18, textAlign: "center" }}>
            {renderActivities()}
            {renderDevices()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ show: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderDevice() {
    const currentDevice = this.state.currentDevice;
    if (!currentDevice) {
      return null;
    }
    switch (currentDevice.name) {
      case "TiVo":
        return <TiVo control={this.state.tivo} />;
      //     case "Harmony Hub":
      //       return <Harmony hub={deviceMap.harmony} />;
      //     case "LG TV":
      //       console.log("deviceMap", deviceMap);
      //       if (!deviceMap.lgtv) {
      //         return null;
      //       }
      //       return <LGTVControl config={deviceMap.lgtv} />;
           case "Apple TV":
             return <AppleTV control={this.state.appletv} />;
      default:
        console.log("renderDevice unknown", currentDevice);
    }

    return null;
  }

  renderButtonBar() {
    return (
      <>
        <Row>
          <Col>
            <Button
              onClick={() => {
                this.setState({ show: true, modal: "activities" });
              }}
            >
              Activity
            </Button>
            <span style={{ marginLeft: 20 }}>
              {this.state.currentActivity.name}
            </span>
          </Col>
          <Col>
            <Button
              onClick={() => {
                this.setState({ show: true, modal: "devices" });
              }}
            >
              Device
            </Button>
            <span style={{ marginLeft: 20 }}>
              {this.state.currentDevice
                ? this.state.currentDevice.name
                : "Not Selected"}
            </span>
          </Col>
        </Row>
      </>
    );
  }

  renderToolbar() {
    if (!this.state.currentDevice) {
      return (
        <>
          <h1>Choose Activity</h1>
          {this.renderActivities()}
        </>
      );
    }
    return this.renderButtonBar();
  }

  renderAudioControls() {
    const { avr } = this.state;
    if (!avr || !avr.power) {
      return null;
    }

    const format = (n) => {
      if (n === null || n === undefined) {
        return 0;
      }
      if (typeof n === "number") {
        if (n > 99) {
          return n / 10;
        }
        return n;
      }
      if (n.length === 3) {
        return Number(n) / 10;
      }
      return Number(n);
    };

    return (
      <div style={{ textAlign: "center" }}>
        <h4 style={{marginBottom: 0}}>{avr.title}</h4>
        <div style={{marginBottom: 4}}>{avr.input} / {avr.surroundMode}</div>
        <div>
          <Button><FaVolumeMute/></Button>
          <Button><FaVolumeDown/></Button>
          <span style={{ marginLeft: 10, marginRight: 10 }}>
            {format(avr.masterVolume)}
          </span>
          <Button><FaVolumeUp/></Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ padding: 8 }}>
        {this.renderToolbar()}
        {this.renderModal()}
        <div style={{ marginTop: 10 }}>{this.renderDevice()}</div>

        <div style={{ height: 10 }} />
        <div>{this.renderAudioControls()}</div>
        {/* <Audio avr={avr} /> */}
      </div>
    );
  }
}

//
export default TheaterTab;
