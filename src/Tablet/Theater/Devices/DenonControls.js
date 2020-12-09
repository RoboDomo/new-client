import React from "react";
import { Row, ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { mangleCompare } from "lib/Utils";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

class DenonControls extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;
    this.command_topic = `denon/${this.device.device}/set/command`;
  }

  renderInputs() {
    const input = this.device.input;
    return (
      <>
        <Row style={{ ...rowStyle, marginTop: 4 }}>
          <ButtonGroup>
            <MQTTButton
              variant={mangleCompare(input, "TV") ? "success" : undefined}
              topic={this.command_topic}
              message="SITV"
            >
              TV Audio
            </MQTTButton>
            <MQTTButton
              variant={mangleCompare(input, "DVD") ? "success" : undefined}
              topic={this.command_topic}
              message="SIDVD"
            >
              DVD
            </MQTTButton>
            <MQTTButton
              variant={mangleCompare(input, "BD") ? "success" : undefined}
              topic={this.command_topic}
              message="SIBD"
            >
              Blu Ray
            </MQTTButton>
            <MQTTButton
              variant={mangleCompare(input, "SAT/CBL") ? "success" : undefined}
              topic={this.command_topic}
              message="SISAT/CBL"
            >
              SAT/CBL
            </MQTTButton>
            <MQTTButton
              variant={mangleCompare(input, "MPLAY") ? "success" : undefined}
              topic={this.command_topic}
              message="SIMPLAYER"
            >
              MPlayer
            </MQTTButton>
          </ButtonGroup>
        </Row>
      </>
    );
  }

  renderJoystick() {
    return (
      <>
        <Row style={{ ...rowStyle, marginTop: 20 }}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="MNMEN ON">
              Menu On
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="MNCUP">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="MNMEN OFF">
              Menu Off
            </MQTTButton>
          </ButtonGroup>
        </Row>
        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="MNCLT">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="MNENT">
              Select
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="MNRT">
              <FaChevronRight />
            </MQTTButton>
          </ButtonGroup>
        </Row>
        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="MNCRTN">
              Return
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="MNCDN">
              <FaChevronDown />
            </MQTTButton>
            <MQTTButton variant="none" />
          </ButtonGroup>
        </Row>
      </>
    );
  }

  render() {
    return (
      <>
        {this.renderInputs()}
        {this.renderJoystick()}
      </>
    );
  }
}

//
export default DenonControls;
