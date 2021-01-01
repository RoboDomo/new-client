import React from "react";

import { ButtonGroup, Button, Modal, Card } from "react-bootstrap";
import NumberInput from "Common/Form/NumberInput";

import { TiAdjustBrightness } from "react-icons/ti";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class DimmerTile extends React.Component {
  constructor(props) {
    super();
    const tile = props.tile;
    console.log("tile", tile);
    this.tile = tile;
    this.hub = tile.hub;
    this.device = tile.device;
    this.name = tile.device;

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
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
    MQTT.subscribe(`${this.hub}/${this.name}/status/level`, this.handleMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/level`,
      this.handleMessage
    );
  }

  renderDialog() {
    const { power, level } = this.state;

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
              <div>
                <ButtonGroup>
                  <Button
                    variant={power ? undefined : "dark"}
                    onClick={async () => {
                      MQTT.publish(
                        `${this.hub}/${this.device}/set/switch`,
                        "off"
                      );
                      this.setState({ show: false });
                    }}
                  >
                    Off
                  </Button>

                  <Button
                    variant={power ? "dark" : undefined}
                    onClick={async () => {
                      MQTT.publish(
                        `${this.hub}/${this.device}/set/switch`,
                        "on"
                      );
                      this.setState({ show: false });
                    }}
                  >
                    On
                  </Button>
                </ButtonGroup>
              </div>

              <div style={{ marginTop: 10 }}>
                <Button
                  style={{ float: "left" }}
                  onClick={async () => {
                    MQTT.publish(`${this.hub}/${this.device}/set/level`, 5);
                    this.setState({ show: false });
                  }}
                >
                  Dim
                </Button>

                <div style={{ float: "left", marginTop: -11, marginLeft: 10 }}>
                  <NumberInput
                    value={level}
                    onValueChange={async (value) => {
                      MQTT.publish(
                        `${this.hub}/${this.device}/set/level`,
                        value
                      );
                      this.setState({ show: false });
                    }}
                  />
                </div>

                <Button
                  style={{ float: "right" }}
                  onClick={async () => {
                    MQTT.publish(`${this.hub}/${this.device}/set/level`, 99);
                    this.setState({ show: false });
                  }}
                >
                  Max
                </Button>
              </div>
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
      return (
        <>
          {this.renderDialog()}
          <div
            style={{ color: "yellow", fontSize: 18 }}
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            <TiAdjustBrightness
              size={30}
              style={{
                fontSize: 24,
                marginLeft: 3,
                marginRight: 8,
                marginTop: -4,
              }}
            />
            {"  "}
            {this.name}
            <div style={{ float: "right" }}>{this.state.level}%</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {this.renderDialog()}
          <div
            onClick={() => {
              this.setState({ show: true });
            }}
            style={{ fontSize: 18 }}
          >
            <TiAdjustBrightness
              style={{
                fontSize: 24,
                marginLeft: 3,
                marginRight: 8,
                marginTop: -4,
              }}
            />
            {"  "}
            {this.name}
            <div style={{ float: "right" }}>OFF</div>
          </div>
        </>
      );
    }
  }
}

//
export default DimmerTile;
