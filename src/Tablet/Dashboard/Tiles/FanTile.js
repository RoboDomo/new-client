import React from "react";
import styles from "./styles";
import Ripples from "react-ripples";

import { BiWind } from "react-icons/bi";

import FanModal from "Common/Modals/FanModal";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

class FanTile extends React.Component {
  constructor(props) {
    super();
    this.style = styles.tile(1, 1);
    this.tile = props.tile;
    this.device = props.tile.device;
    this.hub = props.tile.hub;
    this.state = { show: false };

    //
    this.handleLevelMessage = this.handleLevelMessage.bind(this);
    this.handleSwitchMessage = this.handleSwitchMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleLevelMessage(topic, message) {
    this.setState({ level: Number(message) });
  }

  handleSwitchMessage(topic, message) {
    this.setState({ power: isOn(message) });
  }

  async handleClick() {
    if (this.state.level !== undefined) {
      this.setState({ show: true });
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
      } else if (l < 67) {
        value = "Medium";
        style.color = "yellow";
      } else {
        value = "High";
        style.color = "yellow";
      }
    }

    style.padding = 8;

    return (
      <>
        <FanModal
          show={this.state.show}
          onHide={() => {
            this.setState({ show: false });
          }}
          hub={this.hub}
          device={this.device}
          value={value}
        />
        <div style={{ overflow: "none" }}>
          <Ripples color="#ffffff">
            <div style={style}>
              <div
                style={{
                  textAlign: "center",
                }}
                onClick={this.handleClick}
              >
                <BiWind
                  size={30}
                  style={{ marginBottom: 4, color: style.color }}
                />
                <div>{this.device}</div>
                <div style={{ fontSize: 20 }}>{value}</div>
              </div>
            </div>
          </Ripples>
        </div>
      </>
    );
  }
}

//
export default FanTile;
