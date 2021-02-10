/**
 * DimmerModal
 *
 * Modal Dialog for selecting dimmer level and power state.
 */
import React from "react";
import { Row, Col, Modal, ButtonGroup, Button } from "react-bootstrap";
import NumberInput from "Common/Form/NumberInput";

import MQTT from "lib/MQTT";

class DimmerModal extends React.Component {
  constructor(props) {
    super();
    this.state = { show: props.show };
    this.hub = props.hub;
    this.device = props.device;
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => {
          if (this.props.onHide) {
            this.props.onHide();
          }
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
                  variant={this.props.power ? undefined : "dark"}
                  style={{ marginLeft: 0 }}
                  onClick={async () => {
                    await MQTT.publish(
                      `${this.hub}/${this.device}/set/switch`,
                      "off"
                    );
                    if (this.props.onHide) {
                      this.props.onHide();
                    }
                  }}
                >
                  Off
                </Button>
                <Button
                  variant={this.props.power ? "dark" : undefined}
                  onClick={async () => {
                    await MQTT.publish(
                      `${this.hub}/${this.device}/set/switch`,
                      "on"
                    );
                    if (this.props.onHide) {
                      this.props.onHide();
                    }
                  }}
                >
                  On
                </Button>
              </ButtonGroup>
            </Col>
            <Col sm={2} style={{ marginTop: 11 }}>
              <Button
                onClick={async () => {
                  await MQTT.publish(`${this.hub}/${this.device}/set/level`, 5);
                  if (this.props.onHide) {
                    this.props.onHide();
                  }
                }}
              >
                Dim
              </Button>
            </Col>
            <Col sm={4}>
              <NumberInput
                value={this.props.level}
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
                  if (this.props.onHide) {
                    this.props.onHide();
                  }
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
              if (this.props.onHide) {
                this.props.onHide();
              }
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

//
export default DimmerModal;
