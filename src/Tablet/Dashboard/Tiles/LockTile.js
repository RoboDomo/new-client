import React from "react";
import Ripples from "react-ripples";
import styles from "./styles";
import { BsFillLockFill, BsFillUnlockFill } from "react-icons/bs";

import MQTT from "lib/MQTT";

// TODO: add MyQ garage door status
class LockTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(1, 1);
    this.tile = props.tile;
    this.locks = this.tile.locks;
    this.devices = this.tile.devices;
    this.state = { locked: undefined };

    //
    this.handleLockMessage = this.handleLockMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.locked) {
      MQTT.publish(`${this.tile.hub}/${this.tile.device}/set/unlock`, "unlock");
    } else {
      MQTT.publish(`${this.tile.hub}/${this.tile.device}/set/lock`, "lock");
    }
  }

  handleLockMessage(topic, message) {
    this.setState({ locked: message === "locked" });
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.tile.hub}/${this.tile.device}/status/lock`,
      this.handleLockMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.tile.hub}/${this.tile.device}/status/lock`,
      this.handleLockMessage
    );
  }

  renderIcon() {
    return this.state.locked ? (
      <BsFillLockFill size={30} style={{ marginBottom: 4 }} />
    ) : (
      <BsFillUnlockFill style={{ marginBottom: 4 }} size={30} />
    );
  }

  render() {
    const style = Object.assign({}, this.style);
    style.padding = 8;
    if (this.state.locked) {
      style.color = "green";
    } else {
      style.color = "yellow";
    }
    return (
      <div style={{ overflow: "none" }}>
        <Ripples color="#ffffff">
          <div style={style} onClick={this.handleClick}>
            <div>{this.renderIcon()}</div>
            <div>{this.tile.title}</div>
            <div style={{ fontSize: 20, marginTop: 4 }}>
              {this.state.locked ? "LOCKED" : "UNLOCKED"}
            </div>
          </div>
        </Ripples>
      </div>
    );
  }
}

//
export default LockTile;
