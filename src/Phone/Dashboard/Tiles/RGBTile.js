import React from "react";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import { MdPalette } from "react-icons/md";

import { ChromePicker } from "react-color";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

const toHex = (d) => {
  const n = Number(d).toString(16);
  return n < 16 ? '0' + n : n;
};

class RGBTile extends React.Component {
  constructor(props) {
    super();
    this.tile = props.tile;
    this.device = this.tile.device;
    this.name = this.tile.name;
    this.rgb = this.tile;
    this.hub = this.rgb.hub;
    this.state = { show: false, hex: "#ffffff" };
    this.form = localStorage.getItem(`rgb-${this.rgb.label}`);
    if (this.form) {
      this.form = JSON.parse(this.form);
    } else {
      this.form = {
        changed: false,
        hsv: {},
        hsl: {},
        rgb: { r: 255, g: 0, b: 255 },
        active: false,
        level: 99,
        hex: "ff00ff",
      };
    }

    //
    this.handlePowerMessage = this.handlePowerMessage.bind(this);
    this.handleColorMessage = this.handleColorMessage.bind(this);
  }

  handlePowerMessage(topic, message) {
    this.setState({ active: isOn(message) });
  }

  handleColorMessage(topic, message) {
    const color = topic.split("/").pop();
    switch (color) {
      case "red":
        this.form.rgb.r = message;
        break;
      case "green":
        this.form.rgb.g = message;
        break;
      case "blue":
        this.form.rgb.b = message;
        break;
      default:
        break;
    }
    const hex =
      "#" +
      toHex(this.form.rgb.r) +
      toHex(this.form.rgb.g) +
      toHex(this.form.rgb.b);

    this.setState({ hex: hex, rgb: this.form.rgb });
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handlePowerMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/red`,
      this.handleColorMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/green`,
      this.handleColorMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/blue`,
      this.handleColorMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handlePowerMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/red`,
      this.handleColorMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/green`,
      this.handleColorMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/blue`,
      this.handleColorMessage
    );
  }

  renderDialog() {
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
              <div style={{ width: 228, margin: "auto" }}>
                <ChromePicker
                  color={this.state.hex}
                  onChangeComplete={(color) => {
                    this.form.r = color.rgb.r;
                    this.form.g = color.rgb.g;
                    this.form.b = color.rgb.b;
                    this.setState({ hex: color.hex });
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar style={{ marginRight: 40 }}>
            <ButtonGroup>
              <Button
                variant={this.state.active ? undefined : "dark"}
                onClick={() => {
                  MQTT.publish(`${this.hub}/${this.device}/set/switch`, "off");
                }}
              >
                Off
              </Button>
              <Button
                variant={this.state.active ? "dark" : undefined}
                onClick={() => {
                  MQTT.publish(`${this.hub}/${this.device}/set/switch`, "on");
                }}
              >
                On
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
          <ButtonGroup style={{ marginLeft: 10 }}>
            <Button
              onClick={() => {
                console.log("update", this.form.rgb, this.form.hex);
                MQTT.publish(
                  `${this.hub}/${this.name}/set/red`,
                  this.form.rgb.r
                );
                MQTT.publish(
                  `${this.hub}/${this.name}/set/green`,
                  this.form.rgb.g
                );
                MQTT.publish(
                  `${this.hub}/${this.name}/set/blue`,
                  this.form.rgb.b
                );
              }}
            >
              Update
            </Button>
            <Button
              onClick={() => {
                this.setState({ show: false });
              }}
            >
              Close
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const style = { fontSize: 18 };
    style.color = this.state.active ? "yellow" : undefined;
    //    style.padding = 8;
    return (
      <>
        {this.renderDialog()}
        <div
          style={style}
          onClick={() => {
            this.setState({ show: true });
          }}
        >
          <MdPalette style={{ marginRight: 10, fontSize: 30 }} />
          <span>{this.tile.device}</span>
          <div style={{ float: "right" }}>
            {this.state.active ? "ON" : "OFF"}
          </div>
        </div>
      </>
    );
  }
}

//
export default RGBTile;
