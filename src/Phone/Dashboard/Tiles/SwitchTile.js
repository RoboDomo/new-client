import React from "react";

import { TiLightbulb } from "react-icons/ti";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class SwitchTile extends React.Component {
  constructor(props) {
    super();
    const tile = props.tile;
    this.tile = tile;
    this.hub = tile.hub;
    this.name = tile.device;

    this.state = {};
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    this.setState({ power: isOn(message) });
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
  }

  render() {
    if (this.state.power) {
      return (
        <div
          onClick={() => {
            MQTT.publish(`${this.hub}/${this.name}/set/switch`, "off")
          }}
          style={{ color: "yellow", fontSize: 18 }}
        >
          <TiLightbulb
            style={{
              fontSize: 24,
              marginLeft: 3,
              marginRight: 8,
              marginTop: -4,
            }}
          />
          {"  "}
          {this.name}
          <div style={{ float: "right" }}>ON</div>
        </div>
      );
    } else {
      return (
        <div
          style={{ fontSize: 18 }}
          onClick={() => {
            MQTT.publish(`${this.hub}/${this.name}/set/switch`, "on")
          }}
        >
          <TiLightbulb
            style={{
              fontSize: 24,
              marginLeft: 3,
              marginRight: 8,
              marginTop: -4,
            }}
          />
          {"  "}
          {this.name}
          <div style={{ float: "right" }}>OFF</div>
        </div>
      );
    }
  }
}

//
export default SwitchTile;
