import React from "react";

import { RiUpload2Fill, RiDownload2Fill } from "react-icons/ri";
//import { GiHomeGarage } from "react-icons/gi";

import MQTT from "lib/MQTT";

class GarageDoorTile extends React.Component {
  constructor(props) {
    super();
    this.tile = props.tile;
    this.device = this.tile.device;
    this.door = this.device.title;
    this.state = {};

    //
    this.handleDoorMessage = this.handleDoorMessage.bind(this);
  }

  handleDoorMessage(topic, message) {
    try {
      // console.log("handleDoorMessge", topic, message);
      const parts = topic.split("/"),
        key = parts.pop();
      const newState = Object.assign({}, this.state);
      newState[key] = message;
      this.setState(newState);
    } catch (e) {
      console.log(this.title, "message exception", e);
    }
  }

  componentDidMount() {
    MQTT.subscribe(
      `myq/${this.door}/status/door_state`,
      this.handleDoorMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `myq/${this.door}/status/door_state`,
      this.handleDoorMessage
    );
  }

  renderIcon() {
    return this.state.open ? (
      <RiUpload2Fill
        size={30}
        style={{
          float: "left",
          marginRight: 10,
          marginTop: -4,
          marginBottom: -4,
        }}
      />
    ) : (
      <RiDownload2Fill
        size={30}
        style={{
          float: "left",
          marginRight: 10,
          marginTop: -4,
          marginBottom: -4,
        }}
      />
    );
  }

  renderDoorState() {
    const me = "door_state";
    try {
      return (
        <span
          style={{
            textAlign: "right",
            fontSize: 20,
            marginTop: 4,
            marginLeft: 10,
          }}
        >
          {this.state[me].toUpperCase()}
        </span>
      );
    } catch (e) {
      return null;
    }
  }

  handleClick() {}

  render() {
    try {
      const style = { fontSize: 18 };
      try {
        switch (this.state.door_state.toUpperCase()) {
          case "OPEN":
            style.color = "#ff0000";
            break;
          case "OPENING":
          case "CLOSING":
            style.color = "#00ff00";
            break;
          default:
            break;
        }
      } finally {
      }
      return (
        <div style={style} onClick={this.handleClick}>
          {this.renderIcon()}
          {this.device.title}
          <div style={{ float: "right" }}>{this.renderDoorState()}</div>
        </div>
      );
    } catch (e) {
      return null;
    }
  }
}

//
export default GarageDoorTile;
