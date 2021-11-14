import React from "react";

import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  FaBackward,
  FaDotCircle,
  FaFastBackward,
  FaFastForward,
  FaForward,
  FaPause,
  FaPlay,
  FaStepForward,
  FaUndo,
} from "react-icons/fa";

class LGTVTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;
    this.command_topic = `lgtv/${this.device}/set/command`;
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
              variant="danger"
              topic="lgtv/reset/set/command"
              message="__RESTART__"
            >
              <FaUndo />
            </MQTTButton>
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
            <MQTTButton
              variant="danger"
              transport
              topic={this.command_topic}
              message="record"
            >
              <FaDotCircle />
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }
}

//
export default LGTVTransport;
