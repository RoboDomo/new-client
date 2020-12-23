import React from "react";
import { Button, ButtonGroup, Modal } from "react-bootstrap";
import styles from "./styles";
import Ripples from "react-ripples";

import { BiWind } from "react-icons/bi";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

class FanTile extends React.Component {
  constructor(props) {
    super(props);
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
    console.log("CLICKED!", this.state);
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
        <Modal
          show={this.state.show}
          onHide={() => {
            this.setState({ show: false });
          }}
          centered
          /* size="lg" */
        >
          <Modal.Header closeButton>
            <Modal.Title>Adjust {this.device}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ margin: "auto" }}>
            <ButtonGroup>
              <Button
                variant={value === "Off" ? "dark" : undefined}
                onClick={async () => {
                  await MQTT.publish(
                    `${this.hub}/${this.device}/set/switch`,
                    "off"
                  );
                  this.setState({ show: false });
                }}
              >
                Off
              </Button>
              <Button
                variant={value === "Low" ? "dark" : undefined}
                onClick={async () => {
                  await MQTT.publish(
                    `${this.hub}/${this.device}/set/level`,
                    25
                  );
                  this.setState({ show: false });
                }}
              >
                Low
              </Button>
              <Button
                variant={value === "Medium" ? "dark" : undefined}
                onClick={async () => {
                  await MQTT.publish(
                    `${this.hub}/${this.device}/set/level`,
                    50
                  );
                  this.setState({ show: false });
                }}
              >
                Medium
              </Button>
              <Button
                variant={value === "High" ? "dark" : undefined}
                onClick={async () => {
                  await MQTT.publish(
                    `${this.hub}/${this.device}/set/level`,
                    75
                  );
                  this.setState({ show: false });
                }}
              >
                High
              </Button>
            </ButtonGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                this.setState({ show: false });
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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
