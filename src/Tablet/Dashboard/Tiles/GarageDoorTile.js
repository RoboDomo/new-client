import React from "react";
import styles from "./styles";
import MQTT from "lib/MQTT";

import Ripples from "react-ripples";

import { RiUpload2Fill, RiDownload2Fill } from "react-icons/ri";

import YesNoModal from "Common/Modals/YesNoModal";

// TODO: add MyQ garage door status
class GarageDoorTile extends React.Component {
  constructor(props) {
    super();
    this.style = styles.tile(1, 1);
    this.tile = props.tile;
    this.device = this.tile.device;
    this.title = this.device.title;
    this.door = this.device.title;
    this.devices = this.tile.devices;
    this.state = { door_state: "?", modal: false };

    //
    this.handleClick = this.handleClick.bind(this);
    this.handleDoorMessage = this.handleDoorMessage.bind(this);
  }

  handleClick() {
    try {
      const state = this.state.door_state.toUpperCase();
      switch (state) {
        case "OPEN":
          MQTT.publish(`myq/${this.door}/set/door`, "CLOSE");
          break;
        case "CLOSED":
          MQTT.publish(`myq/${this.door}/set/door`, "OPEN");
          break;
        default:
          console.log("Invalid state", state);
          break;
      }
    } catch (e) {
      console.log("click exception", e);
    }
  }

  handleDoorMessage(topic, message) {
    try {
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
      <RiUpload2Fill size={30} style={{ marginBottom: 4 }} />
    ) : (
      <RiDownload2Fill size={30} style={{ marginBottom: 4 }} />
    );
  }

  renderDoorState() {
    const me = "door_state";
    try {
      return (
        <div style={{ fontSize: 20, marginTop: 4 }}>
          {this.state[me].toUpperCase()}
        </div>
      );
    } catch (e) {
      return null;
    }
  }

  render() {
    const style = Object.assign({}, this.style);
    style.padding = 8;
    let confirm = "OPEN";
    try {
      switch (this.state.door_state.toUpperCase()) {
        case "OPEN":
          style.color = "#ff0000";
          confirm = "CLOSE";
          break;
        case "OPENING":
          confirm = "OPENING";
          style.color = "#00ff00";
          break;
        case "CLOSING":
          confirm = "CLOSING";
          style.color = "#00ff00";
          break;
        default:
          break;
      }
    } finally {
    }

    return (
      <>
        <YesNoModal
          show={this.state.modal}
          title="Garage Door"
          question={`Confirm ${confirm} ${this.device.title} `}
          onSelect={(button) => {
            this.setState({ modal: false });
            if (button) {
              this.handleClick();
            }
          }}
        />
        <div style={{ overflow: "none" }}>
          <Ripples color="#ffffff">
            <div
              style={style}
              onClick={() => {
                this.setState({
                  modal: confirm !== "OPENING" && confirm !== "CLOSING",
                });
              }}
            >
              <div>{this.renderIcon()}</div>
              <div>{this.device.title}</div>
              {this.renderDoorState()}
            </div>
          </Ripples>
        </div>
      </>
    );
  }
}

//
export default GarageDoorTile;
