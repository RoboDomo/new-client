import React from "react";

import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  // FaFastBackward,
  FaBackward,
  FaPause,
  FaPlay,
  FaForward,
  // FaFastForward,
} from "react-icons/fa";

class AppleTVTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device.device;
    this.command_topic = `appletv/${this.device}/set/command`;
  }

  render() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0, width: 1024 }}
      >
        {/* <MQTTButton transport topic={this.command_topic} message="SkipBackward"> */}
        {/*   <FaFastBackward /> */}
        {/* </MQTTButton> */}
        <MQTTButton transport topic={this.command_topic} message="BeginRewind">
          <FaBackward />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Pause">
          <FaPause />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Play">
          <FaPlay />
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="BeginForward">
          <FaForward />
        </MQTTButton>
        {/* <MQTTButton transport topic={this.command_topic} message="SkipForward"> */}
        {/*   <FaFastForward /> */}
        {/* </MQTTButton> */}
      </ButtonGroup>
    );
  }
}

//
export default AppleTVTransport;
