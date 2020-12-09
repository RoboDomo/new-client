import React from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";

class TheaterMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { onClose: this.props.onClose };
    this.activities = props.activities;
    this.devices = props.devices;
  }

  renderActivities() {
    if (!this.activities) {
      return null;
    }

    console.log(this.activities);
    return (
      <ListGroup>
        {this.activities.map((activity) => {
          return <ListGroup.Item>{activity.name}</ListGroup.Item>;
        })}
      </ListGroup>
    );
  }

  renderDevices() {
    if (!this.devices) {
      return null;
    }

    return (
      <ListGroup>
        {this.devices.map((device) => {
          return <ListGroup.Item>{device.name}</ListGroup.Item>;
        })}
      </ListGroup>
    );
  }

  render() {
    console.log("render", this.activities);
    return (
      <Modal
        animation={false}
        centered
        show={this.props.show}
        onHide={() => {
          if (this.state.onHide) {
            this.state.onHide();
          }
        }}
      >
        <Modal.Header>Activities</Modal.Header>
        <Modal.Body>{this.renderActivities()}</Modal.Body>
        <Modal.Header>Devices</Modal.Header>
        <Modal.Body>{this.renderDevices()}</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              if (this.state.onClose) {
                this.state.onClose();
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
export default TheaterMenu;
