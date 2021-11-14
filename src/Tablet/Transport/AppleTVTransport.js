import React from "react";

import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  // FaFastBackward,
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaUndo,
  // FaFastForward,
} from "react-icons/fa";

class AppleTVTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device.device;
    this.command_topic = `appletv/${this.device}/set/command`;
  }

  render() {
    const sh = window.innerHeight,
      top = sh > 1024 ? sh - 42 : 708,
      adjust = window.innerWidth < 750 ? 37 : 0,
      left = adjust + (window.innerWidth - 1024) / 2; // 171; // sw/2 - 512;

    console.log('top', top, adjust, left, window.innerWidth);
    return (
      <>
        <div style={{ marginLeft: 0, width: 1024 }}>
          <ButtonGroup
            style={{
              position: "fixed",
              top: 708,
//              bottom: 0,
              left: left,
              margin: 0,
              padding: 0,
              width: 1024,
            }}
          >
            <MQTTButton
              transport
              topic={this.command_topic}
              message="BeginRewind"
            >
              <FaBackward />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="Pause">
              <FaPause />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="Play">
              <FaPlay />
            </MQTTButton>
            <MQTTButton
              transport
              topic={this.command_topic}
              message="BeginForward"
            >
              <FaForward />
            </MQTTButton>
            <MQTTButton
              transport
              variant="danger"
              topic="appletv/reset/set/command"
              message="__RESTART__"
            >
              <FaUndo />
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }
}

//
export default AppleTVTransport;
