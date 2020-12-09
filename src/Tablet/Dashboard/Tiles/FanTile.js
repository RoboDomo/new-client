import React from "react";
import styles from "./styles";
import Ripples from "react-ripples";

import { BiWind } from "react-icons/bi";

import MQTT from "lib/MQTT";
import { isOn, sleep } from "lib/Utils";

class FanTile extends React.Component {
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
    // this.pending = true;
  }

  handleLevelMessage(topic, message) {
    this.setState({ level: Number(message) });
    // this.pending = false;
  }

  handleSwitchMessage(topic, message) {
    // this.pending = false;
    this.setState({ power: isOn(message) });
  }

  async handleClick() {
    console.log("CLICKED!", this.state);
    // if (this.pending) {
    //   console.log("pending");
    //   return;
    // }
    // this.pending = true;

    const fan = this.state,
      newState = {};

    let lvl = Number(fan.level);

    if (!fan.power) {
      newState.level = 25;
      newState.power = true;
    } else if (lvl < 34) {
      newState.level = 50;
      newState.power = true;
    } else if (lvl < 67) {
      newState.level = 75;
      newState.power = true;
    } else {
      newState.level = 0;
      newState.power = false;
    }

    console.log("newState", newState);
    if (newState.level !== this.state.level) {
      await MQTT.publish(
        `${this.hub}/${this.device}/set/level`,
        newState.level
      );
      await sleep(1000);
    }
    if (newState.power !== this.state.power) {
      await MQTT.publish(
        `${this.hub}/${this.device}/set/switch`,
        newState.power ? "on" : "off"
      );
      await sleep(1000);
    }
    if (newState.level !== this.state.level) {
      await MQTT.publish(
        `${this.hub}/${this.device}/set/level`,
        newState.level
      );
      await sleep(1000);
    }
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
    const fan = this.state;

    const style = Object.assign({}, this.style);
    let value = "Off";
    style.color = undefined;
    if (fan.power && fan.level !== undefined) {
      const l = Number(fan.level);
      if (l < 34) {
        value = "Low";
        style.color = "yellow";
        // style.backgroundColor = `rgb(${255/3}, ${255/3}, 0)`;
        // style.color = `rgb(${511/3}, ${511/3}, 0)`;
      } else if (l < 67) {
        value = "Medium";
        style.color = "yellow";
        // const fg = 255 - 511/3;
        // style.backgroundColor = `rgb(${511/3}, ${511/3}, 0)`;
        // style.color = `rgb(${fg}, ${fg}, 0)`;
      } else {
        value = "High";
        style.color = "yellow";
        // style.backgroundColor = `rgb(${255}, ${255}, 0)`;
        // style.color = "rgb(0,0,0)";
      }
    }

    style.padding = 8;
    return (
      <Ripples color="#ffffff">
        <div style={style}>
          <div
            style={{
              textAlign: "center",
            }}
            onClick={this.handleClick}
          >
            <BiWind size={30} style={{ marginBottom: 4 , color: style.color}} />
            <div>{this.device}</div>
            <div style={{ fontSize: 20 }}>{value}</div>
          </div>
        </div>
      </Ripples>
    );
  }
}

//
export default FanTile;
