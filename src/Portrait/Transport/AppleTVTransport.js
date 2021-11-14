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
    return (
      <>
        <div style={{ margin: "auto" }}>
          <ButtonGroup
            fixed="bottom"
            style={{
              position: "fixed",
              bottom: 14,
              left: 0,
              margin: 0,
              padding: 0,
              width: '100%'
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
