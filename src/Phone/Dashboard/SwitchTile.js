import React from "react";

import { TiLightbulb } from "react-icons/ti";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class SwitchTile extends React.Component {
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
        <div style={{ color: "yellow" }}>
          <TiLightbulb
            style={{
              fontSize: 24,
              marginLeft: 3,
              marginRight: 8,
              marginTop: -4,
            }}
          />
          {"  "}
          {this.name} ON
        </div>
      );
    } else {
      return (
        <div>
          <TiLightbulb
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
export default SwitchTile;
