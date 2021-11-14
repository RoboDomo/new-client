import React from "react";

// import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import { ButtonGroup } from "react-bootstrap";
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

class TiVoTransport extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;

    this.command_topic = `tivo/${this.device.device}/set/command`;
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
              topic="tivo/reset/set/command"
              message="__RESTART__"
            >
              <FaUndo />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="REPLAY">
              <FaFastBackward />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="REVERSE">
              <FaBackward />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="PAUSE">
              <FaPause />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="PLAY">
              <FaPlay />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="SLOW">
              <FaStepForward />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="FORWARD">
              <FaForward />
            </MQTTButton>
            <MQTTButton transport topic={this.command_topic} message="ADVANCE">
              <FaFastForward />
            </MQTTButton>
            <MQTTButton
              topic={this.command_topic}
              message="RECORD"
              variant="danger"
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
export default TiVoTransport;
