import React from "react";
import { Table } from "react-bootstrap";

import MQTT from "lib/MQTT";

class RingTab extends React.Component {
  constructor(props) {
    super(props);
    this.tile = props.tile;
    this.location = this.tile.location;
    this.device = this.tile.device;
    this.state = {};
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    console.log("handleMessage", topic, message);
    const parts = topic.split("/"),
      key = parts.pop(),
      newState = {};

    newState[key] = message;
    this.setState(newState);
  }

  componentDidMount() {
    const tile = this.tile,
      type = tile.type;

    if (type === "doorbell") {
      MQTT.subscribe(
        `ring/${this.location}/${this.device}/status/battery`,
        this.handleMessage
      );
      MQTT.subscribe(
        `ring/${this.location}/${this.device}/status/doorbell`,
        this.handleMessage
      );
      MQTT.subscribe(
        `ring/${this.location}/${this.device}/status/motion`,
        this.handleMessage
      );
      MQTT.subscribe(
        `ring/${this.location}/${this.device}/status/events`,
        this.handleMessage
      );
    } else if (type === "chime") {
    }
  }

  componentWillUnmount() {
    const tile = this.tile,
      type = tile.type;

    if (type === "doorbell") {
      MQTT.unsubscribe(
        `ring/${this.location}/${this.device}/status/battery`,
        this.handleMessage
      );
      MQTT.unsubscribe(
        `ring/${this.location}/${this.device}/status/doorbell`,
        this.handleMessage
      );
      MQTT.unsubscribe(
        `ring/${this.location}/${this.device}/status/motion`,
        this.handleMessage
      );
      MQTT.unsubscribe(
        `ring/${this.location}/${this.device}/status/events`,
        this.handleMessage
      );
    } else if (type === "chime") {
    }
  }

  render() {
    if (!this.state.events) {
      return null;
    }
    return (
      <>
        <div style={{ height: 720, overflow: "auto" }}>
          <h1>
            {this.device} Battery {this.state.battery}%
          </h1>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Recording</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.events).map((key) => {
                const event = this.state.events[key].event;
                console.log(event);
                return (
                  <tr key={key}>
                    <td>{new Date(event.created_at).toLocaleDateString()}</td>
                    <td>{new Date(event.created_at).toLocaleTimeString()}</td>
                    <td>{event.kind}</td>
                    <td>{event.recording_status}</td>
                    <td>{event.state}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

//
export default RingTab;
