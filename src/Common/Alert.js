import React from "react";
import { Button, Modal } from "react-bootstrap";
import DelayedTask from "lib/DelayedTask";
import MQTT from "lib/MQTT";
import say from "lib/Say";
import Logger from "lib/Logger";

const TIMEOUT = 3000; // auto close after this amount

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = props.timeout || true;
    this.state = { show: false, packet: null };
    this.delayedTask = null;
    //
    this.handleAlertMessage = this.handleAlertMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleAlertMessage(topic, message) {
    if (message === null || message === "") {
      return;
    }
    const packet = message;
    packet.timestamp = Date.now();
    switch (packet.type) {
      case "warn":
        Logger.log("warnings", packet);
        console.log("WARN", topic, packet);
        break;
      case "say":
        try {
          say(packet.message.join(" "));
        } catch (e) {}
        break;
      default:
        Logger.log("alerts", packet);
        this.setState({ show: true, packet: packet });
        try {
          say(packet.message.join(" "));
        } catch (e) {}
        if (this.timeout) {
          if (this.delayedTask) {
            this.delayedTask.defer(TIMEOUT);
          } else {
            this.delayedTask = new DelayedTask(() => {
              this.setState({ show: false });
              this.delayedTask = null;
            }, TIMEOUT);
          }
        }
        break;
    }
  }

  componentDidMount() {
    MQTT.subscribe("alert", this.handleAlertMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe("alert", this.handleAlertMessage);
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    // console.log("render alert", this.state);
    if (this.state.show === false || this.state.message === null) {
      return null;
    }
    const { show, packet } = this.state;

    // console.log(this.state, show, packet);
    let key = 0;
    return (
      <Modal show={show} onHide={this.handleClose} centered animation={false}>
        <Modal.Header>{packet.title}</Modal.Header>
        <Modal.Body>
          {packet.message.map((line) => {
            return <div key={++key}>{line}</div>;
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.setState({ show: false })}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

//
export default Alert;
