import React from "react";

import { Row, Col, Button, ButtonGroup, Modal } from "react-bootstrap";
import NumberInput from "Common/Form/NumberInput";
import styles from "./styles";

import { TiAdjustBrightness } from "react-icons/ti";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

import Ripples from "react-ripples";

class DimmerTile extends React.Component {
  constructor(props) {
    super();
    this.style = styles.tile(1, 1);
    this.tile = props.tile;
    this.device = props.tile.device;
    this.hub = props.tile.hub;
    this.state = { level: 0, show: false };

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
    this.setState({ show: true });
    return;
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
      <>
        <Modal
          show={this.state.show}
          onHide={() => {
            this.setState({ show: false });
          }}
          /* backdrop="static" */
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Adjust {this.device}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ margin: "auto" }}>
            <Row>
              <Col sm={4} style={{ marginTop: 10 }}>
                <ButtonGroup size="lg">
                  <Button
                    variant={this.state.power ? undefined : "dark"}
                    style={{ marginLeft: 0 }}
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
                    variant={this.state.power ? "dark" : undefined}
                    onClick={async () => {
                      await MQTT.publish(
                        `${this.hub}/${this.device}/set/switch`,
                        "on"
                      );
                      this.setState({ show: false });
                    }}
                  >
                    On
                  </Button>
                </ButtonGroup>
              </Col>
              <Col sm={2} style={{ marginTop: 11 }}>
                <Button
                  onClick={async () => {
                    await MQTT.publish(
                      `${this.hub}/${this.device}/set/level`,
                      5
                    );
                    this.setState({ show: false });
                  }}
                >
                  Dim
                </Button>
              </Col>
              <Col sm={4}>
                <NumberInput
                  value={this.state.level}
                  onValueChange={async (value) => {
                    await MQTT.publish(
                      `${this.hub}/${this.device}/set/level`,
                      value
                    );
                  }}
                />
              </Col>
              <Col sm={2} style={{ marginTop: 11 }}>
                <Button
                  onClick={async () => {
                    await MQTT.publish(
                      `${this.hub}/${this.device}/set/level`,
                      100
                    );
                    this.setState({ show: false });
                  }}
                >
                  Max
                </Button>
              </Col>
            </Row>
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
            <div style={style} onClick={this.handleClick}>
              <TiAdjustBrightness
                size={30}
                style={{ marginBottom: 4, color: fg }}
              />
              <div style={{ fontWeight: "normal" }}>{this.device}</div>
              <div style={{ fontSize: 20 }}>{value}</div>
            </div>
          </Ripples>
        </div>
      </>
    );
  }
}

//
export default DimmerTile;
