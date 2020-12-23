
import React from "react";

import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  FaFastBackward,
  FaBackward,
  FaPause,
  FaPlay,
  FaStepForward,
  FaForward,
  FaFastForward,
  FaDotCircle,
} from "react-icons/fa";

class LGTVTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;
    this.command_topic = `lgtv/${this.device}/set/command`;
  }

  render() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0, width: 1024 }}
      >
        <MQTTButton transport topic={this.command_topic} message="replay">
          <FaFastBackward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="reverse">
          <FaBackward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="pause">
          <FaPause />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="play">
          <FaPlay />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="slow">
          <FaStepForward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="forward">
          <FaForward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="advance">
          <FaFastForward />
        </MQTTButton>
        <MQTTButton variant="danger" transport topic={this.command_topic} message="record">
          <FaDotCircle />
        </MQTTButton>
      </ButtonGroup>
    );
  }
}

//
export default LGTVTransport;
