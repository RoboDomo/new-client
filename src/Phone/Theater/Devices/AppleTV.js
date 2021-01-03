import React from "react";
import { Row, ButtonGroup } from "react-bootstrap";

import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  // FaFastBackward,
   FaBackward,
   FaPause,
   FaPlay,
   FaForward,
  // FaFastForward,
} from "react-icons/fa";

const DEBUG = require("debug"),
  debug = DEBUG("AppleTVControls");

const appName = (n) => {
  if (n === "com.google.ios.youtube") {
    return "YouTube";
  }
  return n;
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

class AppleTV extends React.Component {
  constructor(props) {
    super();
    this.control = props.control;
    this.info_topic = `appletv/${this.control.device}/status/info`;
    this.command_topic = `appletv/${this.control.device}/set/command`;

    this.state = {
      info: null,
    };

    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(topic, message) {
    try {
      debug(JSON.parse(message));
      debug("type", typeof message);
      this.setState({
        info: JSON.parse(message),
      });
    } catch (e) {}
  }

  componentDidMount() {
    MQTT.subscribe(this.info_topic, this.updateInfo);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.info_topic, this.updateInfo);
  }

  renderNowPlaying() {
    const info = this.state.info;
    if (!info) {
      return (
        <div style={{ textAlign: "center" }}>
          <h1>{this.control.title}</h1>
          <h2>Not Playing</h2>
        </div>
      );
    }
    return (
      <>
        <h3>Apple TV</h3>
        <h1>{appName(info.appDisplayName || info.appBundleIdentifier)}</h1>
        <h2>{info.title}</h2>
      </>
    );
  }
  renderTransport() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0 }}
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
  render() {
    return (
      <>
        <Row style={{ ...rowStyle, marginTop: 4 }}>
          {this.renderNowPlaying()}
        </Row>

        <Row style={{ ...rowStyle, marginTop: 24 }}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Menu">
              Menu
            </MQTTButton>
            <MQTTButton
              variant="primary"
              topic={this.command_topic}
              message="Suspend"
            >
              Home
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={{ ...rowStyle, marginTop: 24 }}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={this.command_topic} message="Up">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton variant="none" />
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Left">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton
              variant="primary"
              topic={this.command_topic}
              message="Select"
            >
              Select
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Right">
              <FaChevronRight />
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={this.command_topic} message="Down">
              <FaChevronDown />
            </MQTTButton>
            <MQTTButton variant="none" />
          </ButtonGroup>
        </Row>

        <Row style={{ ...rowStyle, marginTop: 24, marginBottom: 40 }}>
          <ButtonGroup>
            <MQTTButton
              variant="danger"
              topic={this.command_topic}
              message="Power"
            >
              Power
            </MQTTButton>
          </ButtonGroup>
        </Row>
        {this.renderTransport()}
      </>
    );
  }
}

//
export default AppleTV;
