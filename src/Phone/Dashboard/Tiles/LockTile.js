import React from "react";
import { BsFillLockFill, BsFillUnlockFill } from "react-icons/bs";
import MQTT from "lib/MQTT";

class LockTile extends React.Component {
  constructor(props) {
    super(props);
    // console.log("props", props)A
    this.tile = props.tile;
    this.locks = this.tile.locks;
    this.devices = this.tile.devices;
    this.state = { locked: undefined };

    //
    this.handleLockMessage = this.handleLockMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleLockMessage(topic, message) {
    this.setState({ locked: message === "locked" });
  }

  handleClick() {
    if (this.state.locked) {
      console.log("unlock");
      MQTT.publish(`${this.tile.hub}/${this.tile.device}/set/unlock`, "unlock");
    } else {
      console.log("lock");
      MQTT.publish(`${this.tile.hub}/${this.tile.device}/set/lock`, "lock");
    }
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
      <BsFillLockFill
        size={30}
        style={{
          float: "left",
          marginLeft: -6,
          marginRight: 10,
          marginTop: -6,
        }}
      />
    ) : (
      <BsFillUnlockFill
        style={{
          float: "left",
          marginLeft: -6,
          marginRight: 10,
          marginTop: -6,
        }}
        size={30}
      />
    );
  }

  render() {
    const style = { fontSize: 18 };
    style.padding = 8;
    if (this.state.locked) {
      style.color = "green";
    } else {
      style.color = "yellow";
    }
    return (
      <div style={style} onClick={this.handleClick}>
        {this.renderIcon()}
        {this.tile.title}
        <div style={{ fontSize: 20, marginLeft: 10, marginRight: -8, float: "right" }}>
          {this.state.locked ? "LOCKED" : "UNLOCKED"}
        </div>
      </div>
    );
  }
}

//
export default LockTile;
