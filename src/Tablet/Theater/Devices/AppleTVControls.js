import React from "react";
import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import AppleTVTransport from "Tablet/Transport/AppleTVTransport";

import { Row, ButtonGroup } from "react-bootstrap";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  // FaFastBackward,
  // FaBackward,
  // FaPause,
  // FaPlay,
  // FaForward,
  // FaFastForward,
} from "react-icons/fa";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const DEBUG = require("debug"),
  debug = DEBUG("AppleTVControls");

const appName = (n) => {
  if (n === "com.google.ios.youtube") {
    return "YouTube";
  }
  return n;
};

class AppleTVControls extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;
    this.title = this.device.title;
    this.info_topic = `appletv/${this.device.device}/status/info`;
    this.command_topic = `appletv/${this.device.device}/set/command`;

    this.state = {
      info: null,
    };

    this.updateInfo = this.updateInfo.bind(this);

    debug("AppleTVControls", this.device, `(${this.info_topic})`);
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
    debug(this.title, "Subscribe");
    MQTT.subscribe(this.info_topic, this.updateInfo);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.info_topic, this.updateInfo);
  }

  renderNowPlaying() {
    const info = this.state.info;
    if (!info) {
      return (
        <div>
          <h1>Apple TV</h1>
          <h2>Not Playing</h2>
        </div>
      );
      // return <h3>Apple TV</h3>;
    }
    return (
      <>
        <h3>Apple TV</h3>
        <h1>{appName(info.appDisplayName || info.appBundleIdentifier)}</h1>
        <h2>{info.title}</h2>
      </>
    );
  }

  render() {
    return (
      <>
        <Row style={{ ...rowStyle, marginTop: 4 }}>
          {this.renderNowPlaying()}
        </Row>

        <Row style={{ ...rowStyle, marginTop: 4 }}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Stop">
              Stop
            </MQTTButton>
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
            <MQTTButton
              variant="danger"
              topic={this.command_topic}
              message="Power"
            >
              Power
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

        <AppleTVTransport device={this.device} />
      </>
    );
  }
}

//
export default AppleTVControls;
