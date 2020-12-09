import React from "react";
import styles from "./styles";

import Ripples from "react-ripples";
import { TiLightbulb } from "react-icons/ti";

import MQTT from "lib/MQTT";

import { isOn } from "lib/Utils";

class SwitchTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(1, 1);
    this.device = props.tile.device;
    this.hub = props.tile.hub;
    this.state = {};
    this.pending = true;

    //
    this.handleClick = this.handleClick.bind(this);
    this.handleSwitchMessage = this.handleSwitchMessage.bind(this);
  }

  handleSwitchMessage(topic, message) {
    this.pending = false;
    this.setState({ power: isOn(message) });
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handleSwitchMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handleSwitchMessage
    );
  }

  handleClick() {
    console.log("CLICKED!", this.state);
    if (this.pending) {
      return;
    }
    this.pending = true;
    if (this.state.power) {
      MQTT.publish(`${this.hub}/${this.device}/set/switch`, "off");
    } else {
      MQTT.publish(`${this.hub}/${this.device}/set/switch`, "on");
    }
  }

  render() {
    const color = this.state.power ? "yellow" : undefined;
    const bg = undefined; // this.state.power ? "yellow" : undefined;
    const style = Object.assign(
      { color: color, backgroundColor: bg, padding: 8 },
      this.style
    );
    return (
      <Ripples color="#ffffff">
        <div style={style} onClick={this.handleClick}>
          <div style={{ textAlign: "center" }} onClick={this.handleClick}>
            <TiLightbulb size={30} style={{ marginBottom: 4 }} />
            <div style={{ fontWeight: "normal" }}>{this.device}</div>
            <div style={{ fontSize: 20 }}>
              {this.state.power ? "ON" : "OFF"}
            </div>
          </div>
        </div>
      </Ripples>
    );
  }
}

//
export default SwitchTile;
