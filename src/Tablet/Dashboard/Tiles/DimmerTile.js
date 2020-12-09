import React from "react";
import styles from "./styles";

import { TiAdjustBrightness } from "react-icons/ti";

import MQTT from "lib/MQTT";
import { isOn, sleep } from "lib/Utils";

import Ripples from "react-ripples";

class DimmerTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(1, 1);
    this.tile = props.tile;
    this.device = props.tile.device;
    this.hub = props.tile.hub;
    this.state = {};

    //
    this.handleLevelMessage = this.handleLevelMessage.bind(this);
    this.handleSwitchMessage = this.handleSwitchMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.pending = false;
  }

  handleLevelMessage(topic, message) {
    this.setState({ level: Number(message) });
  }

  handleSwitchMessage(topic, message) {
    this.pending = false;
    this.setState({ power: isOn(message) });
  }

  async handleClick() {
    // console.log("CLICKED!", this.state);
    if (this.pending) {
      return;
    }
    this.pending = true;

    if (this.state.power) {
      await MQTT.publish(`${this.hub}/${this.device}/set/switch`, "off");
    } else {
      await MQTT.publish(`${this.hub}/${this.device}/set/switch`, "on");
    }

    await sleep(1000);
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handleSwitchMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.device}/status/level`,
      this.handleLevelMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handleSwitchMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/level`,
      this.handleLevelMessage
    );
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  render() {
    const { power, level } = this.state,
      style = Object.assign({}, this.style),
      value = power && level ? level + "%" : "OFF";

    const bg = undefined; // power ? `rgb(${255 * level}, ${255 * level}, 0)` : undefined;
    const fg = power ? "yellow" : undefined; // bg ? `rgb(${(255-bg) * level}, ${(255-bg) * level}, 0)` : undefined;

    style.color = fg;
    style.backgroundColor = bg;
    style.padding = 8;
    return (
      <Ripples color="#ffffff">
        <div style={style} onClick={this.handleClick}>
          <TiAdjustBrightness size={30} style={{ marginBottom: 4, color: fg }} />
          <div style={{ fontWeight: "normal" }}>{this.device}</div>
          <div style={{ fontSize: 20 }}>{value}</div>
        </div>
      </Ripples>
    );
  }
}

//
export default DimmerTile;
