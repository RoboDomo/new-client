import React from "react";

import { TiAdjustBrightness } from "react-icons/ti";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class DimmerTile extends React.Component {
  constructor(props) {
    super(props);
    const tile = props.tile;
    this.tile = tile;
    this.hub = tile.hub;
    this.name = tile.device;

    this.state = {};
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    if (~topic.indexOf("switch")) {
      this.setState({ power: isOn(message) });
    } else {
      this.setState({ level: Number(message) });
    }
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
    MQTT.subscribe(`${this.hub}/${this.name}/status/level`, this.handleMessage);
  }

  componentWillUnmount() {
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
      return (
        <div style={{ color: "yellow" }}>
          <TiAdjustBrightness
            style={{
              fontSize: 24,
              marginLeft: 3,
              marginRight: 8,
              marginTop: -4,
            }}
          />
          {"  "}
          {this.name} {this.state.level}%
        </div>
      );
    } else {
      return (
        <div>
          <TiAdjustBrightness
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
export default DimmerTile;
