import React from "react";
import {
  ButtonGroup,
  Button,
  Modal,
  Card,
} from "react-bootstrap";

import { GiComputerFan } from "react-icons/gi";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class FanTile extends React.Component {
  constructor(props) {
    super();
    const tile = props.tile;
    this.tile = tile;
    this.hub = tile.hub;
    this.device = tile.device;

    this.state = {};
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    if (~topic.indexOf("switch")) {
      this.setState({ power: isOn(message) });
    } else {
      this.setState({ level: Number(message) });
    }
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handleMessage
    );
    MQTT.subscribe(`${this.hub}/${this.device}/status/level`, this.handleMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/level`,
      this.handleMessage
    );
  }

  renderDialog() {
    const style = {},
      {level, power} = this.state,
      l = Number(level);

    let value = "Off";
    if (power) {
      if (l < 34) {
        value = "Low";
      } else if (l < 67) {
        value = "Medium";
      } else {
        value = "High";
      }
    }

    return (
      <Modal
        show={this.state.show}
        centered
        backdrop="static"
        onHide={() => {
          this.setState({ show: false });
        }}
      >
        <Modal.Header closeButton>{this.tile.device}</Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ show: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    if (this.state.power) {
      let level = "HIGH";
      if (this.state.level < 66) {
        level = "MEDIUM";
      } else if (this.state.level < 33) {
        level = "LOW";
      }
      return (
        <>
          {this.renderDialog()}
          <div
            style={{ color: "yellow", fontSize: 18 }}
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            <GiComputerFan
              style={{
                fontSize: 24,
                marginLeft: 3,
                marginRight: 8,
                marginTop: -4,
              }}
            />
            {"  "}
            {this.device}
            <div style={{ float: "right" }}>{level}</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {this.renderDialog()}
          <div
            style={{ fontSize: 18 }}
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            <GiComputerFan
              style={{
                fontSize: 24,
                marginLeft: 3,
                marginRight: 8,
                marginTop: -4,
              }}
            />
            {"  "}
            {this.device}
            <div style={{ float: "right" }}>OFF</div>
          </div>
        </>
      );
    }
  }
}

//
export default FanTile;
