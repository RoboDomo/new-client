import React from "react";

import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  FaFastBackward,
  FaBackward,
  FaPause,
  FaPlay,
  FaForward,
  FaFastForward,
  FaUndo,
} from "react-icons/fa";

class SamsungTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device.device;
    this.command_topic = `samsung/${this.device}/set/command`;
  }

  render() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0, width: 1024 }}
      >
        <MQTTButton
          transport
          variant="danger"
          topic="bravia/reset/set/command"
          message="__RESTART__"
        >
          <FaUndo />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Prev">
          <FaFastBackward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Rewind">
          <FaBackward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Pause">
          <FaPause />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Play">
          <FaPlay />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Forward">
          <FaForward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Next">
          <FaFastForward />
        </MQTTButton>
      </ButtonGroup>
    );
  }
}

//
export default SamsungTransport;
