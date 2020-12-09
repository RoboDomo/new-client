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

    const renderControl = (ndx, text, big) => {
      const thing = this.state[ndx];
      //        if (thing && state.spa !== 'on' ||  thing.toLowerCase() === 'off' ) {
      if (!thing) {
        return null; // <div style={this.style}/>;
      }
      if (big) {
        return <div style={{ fontSize: 30 }}>{text}</div>;
      }

      return <div>{text}</div>;
    };

    const renderSpa = () => {
      if (isOn("spa")) {
        return (
          <div>
            {renderControl("spa", `Spa ${this.state.spaTemp}°F`, true)}
            {renderControl("spaHeat", "Heat On")}
            {renderControl("jet", "Jets On")}
            {renderControl("blower", "Blower On")}
            {renderControl("spaLight", "Light On")}
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ fontSize: 60 }}>{"Spa Off"}</div>
            <div>
              {isOn("jet") ? "JETS ON" : null}
              {isOn("spaHeat") ? "HEAT ON" : null}
              {isOn("blower") ? "BLOWER ON" : null}
              {isOn("spaLight") ? "LIGHT ON" : null}
            </div>
          </div>
        );
      }
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
          <div style={{ textAlign: "center" }}>{renderSpa()}</div>
        </div>
      </div>
    );
  }
}

//
export default SpaTile;
