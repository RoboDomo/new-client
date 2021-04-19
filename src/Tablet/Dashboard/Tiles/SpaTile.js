/**
 */

// TODO create overlay while heating (show temperature in modal, whatever)

import React from "react";
import styles from "./styles";

import MQTT from "lib/MQTT";

import { data as Config } from "lib/Config";

import { isOn } from "lib/Utils";

class SpaTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(2, 1);
    this.state = {};
    this.topic = "autelis/status/";
    this.handleAutelisMessage = this.handleAutelisMessage.bind(this);
  }

  handleAutelisMessage(topic, message) {
    const autelis = Config.autelis,
      backward = autelis.deviceMap.backward,
      key = backward[topic.substr(this.topic.length)];

    switch (key) {
      case "pump":
        this.setState({ pump: isOn(message) });
        break;
      case "spa":
        this.setState({ spa: isOn(message) });
        break;
      case "spaTemp":
        this.setState({ spaTemp: Number(message) });
        break;
      case "spaSetpoint":
        this.setState({ spaSetPoint: Number(message) });
        break;
      case "spaHeat":
        this.setState({ spaHeat: isOn(message) });
        break;
      case "jet":
        this.setState({ jet: isOn(message) });
        break;
      case "blower":
        this.setState({ blower: isOn(message) });
        break;
      case "spaLight":
        this.setState({ spaLight: isOn(message) });
        break;
      default:
        console.log("autelisMessage invalid device", key);
        break;
    }
  }

  componentDidMount() {
    const forward = Config.autelis.deviceMap.forward;

    MQTT.subscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spa, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaTemp, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaSetpoint, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaHeat, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.jet, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.blower, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaLight, this.handleAutelisMessage);
  }

  componentWillUnmount() {
    const forward = Config.autelis.deviceMap.forward;

    MQTT.unsubscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.spa, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.spaTemp, this.handleAutelisMessage);
    MQTT.unsubscribe(
      this.topic + forward.spaSetpoint,
      this.handleAutelisMessage
    );
    MQTT.unsubscribe(this.topic + forward.spaHeat, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.jet, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.blower, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.spaLight, this.handleAutelisMessage);
  }
  render() {
    const isOn = (thing) => {
      const control = this.state[thing];

      if (!control) {
        return false;
      }
      if (control === true) {
        return control;
      }
      return control.toLowerCase() === "on";
    };

    const on =
        isOn("spa") ||
        isOn("spaHeat") ||
        isOn("jet") ||
        isOn("blower") ||
        isOn("spaLight"),
      backgroundColor = on ? "red" : undefined,
      color = on ? "white" : undefined;

    const renderSpa = () => {
      return (
        <div style={{ padding: 8 }}>
          {/* {renderControl("spa", `Spa ${this.state.spaTemp}°F`)} */}
          <div
            style={{
              fontSize: 44,
              fontWeight: "bold",
              marginTop: -18,
              float: "left",
            }}
          >
            {isOn("spa") ? `${this.state.spaTemp}°` : "OFF"}
          </div>
          <div style={{ fontSize: 16, float: "right" }}>
            {isOn("jet") ? <div style={{ marginTop: -4 }}>JETS ON</div> : null}
            {isOn("spaHeat") ? (
              <div style={{ marginTop: -4 }}>HEAT -> {this.state.spaSetPoint}&deg;</div>
            ) : null}
            {isOn("blower") ? (
              <div style={{ marginTop: -4 }}>BLOWER ON</div>
            ) : null}
            {isOn("spaLight") ? (
              <div style={{ marginTop: -4 }}>LIGHT ON</div>
            ) : null}
          </div>
        </div>
      );
    };

    return (
      <div style={this.style}>
        <div
          style={{
            backgroundColor: backgroundColor,
            color: color,
            width: this.style.width - 6,
            height: this.style.height - 6,
          }}
          onClick={() => {
            localStorage.setItem("autelis-radio", "spa");
            window.location.hash = "autelis";
          }}
        >
          <div>Spa</div>
          <div style={{ textAlign: "center" }}>{renderSpa()}</div>
        </div>
      </div>
    );
  }
}

//
export default SpaTile;
