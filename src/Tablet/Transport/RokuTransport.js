import React from "react";

import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  // FaFastBackward,
  FaBackward,
  // FaPause,
  FaPlay,
  FaForward,
  // FaFastForward,
  FaUndo,
} from "react-icons/fa";

class RokuTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;
    this.command_topic = `roku/${this.device}/set/command`;
    console.log("transport", this.device);
  }

  render() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0, width: 1024 }}
      >
        <MQTTButton
          transport
          topic={this.command_topic}
          message="InstantReplay"
        >
          <FaUndo />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Reverse">
          <FaBackward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Play">
          <FaPlay />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Forward">
          <FaForward />
        </MQTTButton>
      </ButtonGroup>
    );
  }
}

//
export default RokuTransport;
