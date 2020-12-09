import React from "react";

import { GiComputerFan } from "react-icons/gi";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class FanTile extends React.Component {
  constructor(props) {
    super(props);
    const tile = props.tile;
    this.tile = tile;
    this.hub = tile.hub;
    this.name = tile.device;

    this.state = {};
    //
    this.handleMessage = this.handleMessage.bind(this);
    console.log("constructed ", this.name);
  }

  handleMessage(topic, message) {
    if (~topic.indexOf("switch")) {
      this.setState({ power: isOn(message) });
    } else {
      this.setState({ level: Number(message) });
    }
  }

  componentDidMount() {
    console.log("mounted ", this.name);
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
    MQTT.subscribe(`${this.hub}/${this.name}/status/level`, this.handleMessage);
  }

  componentWillUnmount() {
    console.log("unmounted ", this.name);
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/level`,
      this.handleMessage
    );
  }

  render() {
    if (this.state.power) {
      let level = "HIGH";
      if (this.state.level < 66) {
        level = "MEDIUM";
      } else if (this.state.level < 33) {
        level = "LOW";
      }
      return (
        <div style={{ color: "yellow" }}>
          <GiComputerFan
            style={{
              fontSize: 24,
              marginLeft: 3,
              marginRight: 8,
              marginTop: -4,
            }}
          />
          {"  "}
          {this.name} {level}
        </div>
      );
    } else {
      return (
        <div>
          <GiComputerFan
            style={{
              fontSize: 24,
              marginLeft: 3,
              marginRight: 8,
              marginTop: -4,
            }}
          />
          {"  "}
          {this.name} OFF
        </div>
      );
    }
  }
}

//
export default FanTile;
