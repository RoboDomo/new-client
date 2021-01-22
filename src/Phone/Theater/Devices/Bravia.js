import React from "react";
import MQTTButton from "Common/MQTTButton";

import { ButtonGroup } from "react-bootstrap";

import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaPowerOff,
  FaVolumeMute,
  FaVolumeUp,
  FaVolumeDown,
  FaBackward,
  FaFastBackward,
  FaPause,
  FaPlay,
  FaForward,
  FaFastForward,
} from "react-icons/fa";

import { mangle } from "lib/Utils";

const style = {
  row: {
    overflow: "hidden",
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

class Bravia extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.control;
    this.command_topic = `bravia/${this.device.device}/set/command`;
  }

  renderJoystick() {
    return (
      <>
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={this.command_topic} message="CursorUp">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton
              topic={this.command_topic}
              message="ChannelUp"
              variant="info"
            >
              +
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="CursorLeft">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton
              topic={this.command_topic}
              message="Confirm"
              variant="primary"
            >
              Select
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="CursorRight">
              <FaChevronRight />
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={this.command_topic} message="CursorDown">
              <FaChevronDown />
            </MQTTButton>
            <MQTTButton
              topic={this.command_topic}
              message="ChannelDown"
              variant="info"
            >
              -
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }

  renderKeypad() {
    return (
      <>
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Num1">
              1
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num2">
              2
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num3">
              3
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Num4">
              4
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num5">
              5
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num6">
              6
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Num7">
              7
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num8">
              8
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num9">
              9
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Clear">
              .
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Num0">
              0
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Confirm">
              Enter
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }

  renderHDMI() {
    const tv = this.device,
      input = mangle(tv.input);
    return (
      <ButtonGroup style={style.row}>
        <MQTTButton
          transport
          variant={input === mangle("hdmi1") ? "success" : undefined}
          topic={this.command_topic}
          message="Hdmi1"
        >
          HDMI 1
        </MQTTButton>

        <MQTTButton
          transport
          variant={input === mangle("hdmi2") ? "success" : undefined}
          topic={this.command_topic}
          message="Hdmi2"
        >
          HDMI 2
        </MQTTButton>
        <MQTTButton
          transport
          variant={input === mangle("hdmi3") ? "success" : undefined}
          topic={this.command_topic}
          message="Hdmi3"
        >
          HDMI 3
        </MQTTButton>
        <MQTTButton
          transport
          variant={input === mangle("hdmi4") ? "success" : undefined}
          topic={this.command_topic}
          message="Hdmi4"
        >
          HDMI 4
        </MQTTButton>
      </ButtonGroup>
    );
  }

  renderLaunchPoints() {
    return (
      <ButtonGroup style={style.row}>
        <MQTTButton transport topic={this.command_topic} message="LAUNCH-Netflix">
          Netflix
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="LAUNCH-Prime Video">
          Prime
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="LAUNCH-YouTube">
          YouTube
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="LAUNCH-HBO GO">
          HBO Go
        </MQTTButton>
      </ButtonGroup>
    );
  }

  renderControls() {
    const tv = this.device,
      power = tv.power ? (
        <MQTTButton transport topic={this.command_topic} message="PowerOff">
          <span style={{ fontWeight: "bold", color: "red" }}>
            <FaPowerOff />
          </span>
        </MQTTButton>
      ) : (
        <MQTTButton transport topic={this.command_topic} message="WakeUp">
          <span style={{ fontWeight: "bold", color: "lightgreen" }}>
            <FaPowerOff />
          </span>
        </MQTTButton>
      );

    return (
      <ButtonGroup>
        <MQTTButton transport topic={this.command_topic} message="Return">
          Return
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Display">
          Display
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="Home">
          Home
        </MQTTButton>
        <MQTTButton transport topic={this.command_topic} message="ActionMenu">
          Menu
        </MQTTButton>
        {power}
      </ButtonGroup>
    );
  }

  renderVolume() {
    const tv = this.device,
      mute = tv && tv.volume ? tv.volume.mute : false;
    return (
      <>
        <MQTTButton topic={this.command_topic} message="VolumeUp">
          <FaVolumeUp />
        </MQTTButton>
        <MQTTButton topic={this.command_topic} message="VolumeDown">
          <FaVolumeDown />
        </MQTTButton>
        <MQTTButton
          variant={mute ? "danger" : undefined}
          topic={this.command_topic}
          message="Mute"
        >
          <FaVolumeMute />
        </MQTTButton>
      </>
    );
  }

  renderTransport() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0, width: 1024 }}
      >
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

  render() {
    // console.log("render", this.device);
    return (
      <>
        <div>
          <h4 style={style.row}>
            {this.device.title} ({this.device.power ? "ON" : "OFF"})
          </h4>
          {this.renderControls()}
        </div>
        {/* <div style={{ marginTop: 14 }}>{this.renderVolume()}</div> */}
        <div style={{ marginTop: 14 }}>{this.renderJoystick()}</div>
        <div style={{ marginTop: 14 }}>{this.renderKeypad()}</div>
        <div style={{ marginTop: 14 }}>{this.renderHDMI()}</div>
        <div style={{ marginTop: 14 }}>{this.renderLaunchPoints()}</div>
        <div style={{ marginTop: 14 }}>{this.renderTransport()}</div>
      </>
    );
  }
}

//
export default Bravia;
