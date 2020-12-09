import React from "react";
import styles from "./styles";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

import { data as Config } from "lib/Config";

class PoolTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(2, 1);
    this.state = {};
    this.topic = "autelis/status/";

    //
    this.handleAutelisMessage = this.handleAutelisMessage.bind(this);
  }

  handleAutelisMessage(topic, message) {
    const backward = Config.autelis.deviceMap.backward;
    const thing = backward[topic.split("/").pop()];
    const newState = {};
    if (message === "on" || message === "off") {
      newState[thing] = isOn(message);
    } else {
      newState[thing] = Number(message);
    }
    this.setState(newState);
  }

  componentDidMount() {
    const forward = Config.autelis.deviceMap.forward;
    MQTT.subscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.poolTemp, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.cleaner, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.waterfall, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.poolHeat, this.handleAutelisMessage);
    MQTT.subscribe(
      this.topic + forward.poolSetpoint,
      this.handleAutelisMessage
    );
    MQTT.subscribe(this.topic + forward.solarHeat, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.solarTemp, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.poolLight, this.handleAutelisMessage);
  }

  componentWillUnmount() {
    const forward = Config.autelis.deviceMap.forward;
    MQTT.unsubscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.poolTemp, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.cleaner, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.waterfall, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.poolHeat, this.handleAutelisMessage);
    MQTT.unsubscribe(
      this.topic + forward.poolSetpoint,
      this.handleAutelisMessage
    );
    MQTT.unsubscribe(this.topic + forward.solarHeat, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.solarTemp, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.poolLight, this.handleAutelisMessage);
  }

  render() {
    const on = this.state.pump,
      backgroundColor = on
        ? this.state.poolHeat === "enabled"
          ? "red"
          : "green"
        : undefined,
      color = on ? "white" : undefined;

    const renderPool = () => {
      const renderControl = (ndx, text, big) => {
        const thingState = this.state[ndx];

        if (!thingState) {
          return null;
        }

        if (big) {
          return <div style={{ fontSize: 30 }}>{text}</div>;
        }

        return <div>{text}</div>;
      };

      if (on) {
        return (
          <div>
            {renderControl("pump", `Pool ${this.state.poolTemp}°F`, true)}
            {renderControl("pump", "Filter On")}
            {renderControl("cleaner", "Cleaner On")}
            {renderControl("waterfall", "Waterfall On")}
            {renderControl("poolHeat", "Pool Heat " + this.state.poolSetpoint)}
            {renderControl(
              "solarHeat",
              "Solar Heat " +
                (this.state.solarHeat ? this.state.solarTemp : "off")
            )}
          </div>
        );
      } else {
        return (
          <div>
            <div style={{ fontSize: 60 }}>{"Pool Off"}</div>
          </div>
        );
      }
    };

    return (
      <div style={this.style}>
        <div
          style={{
            height: this.style.height - 6,
            backgroundColor: backgroundColor,
            color: color,
          }}
          onClick={() => {
            localStorage.setItem("autelis-radio", "pool");
            window.location.hash = "autelis";
          }}
        >
          <div style={{ textAlign: "center" }}>{renderPool()}</div>
        </div>
      </div>
    );
  }
}

//
export default PoolTile;
