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
    const sh = window.screen.availHeight,
      top = sh > 1024 ? sh - 42 : 708,
      adjust = window.screen.width < 750 ? 37 : 0,
      left = adjust + (window.screen.availWidth - 1024) / 2; // 171; // sw/2 - 512;

    return (
      <>
        <div style={{ margin: "auto" }}>
          <ButtonGroup
            style={{
              position: "fixed",
              top: top,
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
