/**
 * FanModal
 *
 * Modal Dialog for selecting fan speed and controlling the fan.
 */
import React from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";

import MQTT from "lib/MQTT";

class FanModal extends React.Component {
  constructor(props) {
    super();
    this.state = { show: props.show };
    this.hub = props.hub;
    this.device = props.device;
  }

  render() {
    const value = this.props.value;
    return (
      <Modal
        show={this.props.show}
        onHide={() => {
          if (this.props.onHide) {
            this.props.onHide();
          }
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
                if (this.props.onHide) {
                  this.props.onHide();
                }
              }}
            >
              Off
            </Button>
            <Button
              variant={value === "Low" ? "dark" : undefined}
              onClick={async () => {
                await MQTT.publish(`${this.hub}/${this.device}/set/level`, 25);
                if (this.props.onHide) {
                  this.props.onHide();
                }
              }}
            >
              Low
            </Button>
            <Button
              variant={value === "Medium" ? "dark" : undefined}
              onClick={async () => {
                await MQTT.publish(`${this.hub}/${this.device}/set/level`, 50);
                if (this.props.onHide) {
                  this.props.onHide();
                }
              }}
            >
              Medium
            </Button>
            <Button
              variant={value === "High" ? "dark" : undefined}
              onClick={async () => {
                await MQTT.publish(`${this.hub}/${this.device}/set/level`, 75);
                if (this.props.onHide) {
                  this.props.onHide();
                }
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
export default FanModal;
