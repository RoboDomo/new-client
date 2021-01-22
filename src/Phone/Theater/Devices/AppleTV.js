import React from "react";
import { Row, Col, ProgressBar, ButtonGroup } from "react-bootstrap";

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

const formatTime = (time) => {
  const hours = parseInt(time / 3600, 10);
  const minutes = parseInt((time % 3600) / 60, 10);
  const seconds = parseInt(time % 60, 10);
  return `${hours ? hours + ":" : ""}${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
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

    //
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(topic, message) {
    try {
      debug(JSON.parse(message));
      debug("type", typeof message);
      this.setState({
        info: JSON.parse(message),
      });
    } catch (e) {
      this.setState({ info: message });
    }
  }

  componentDidMount() {
    console.log("mount subscribe", this.info_topic);
    MQTT.subscribe(this.info_topic, this.updateInfo);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.info_topic, this.updateInfo);
  }

  renderArtwork() {
    const info = this.state.info;
    if (!info.artwork) {
      return null;
    }
    return (
      <img
        style={{ height: 64, marginBottom: 10 }}
        alt="artwork"
        src={`data:image;base64,${info.artwork}`}
      />
    );
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
        <div
          style={{
            width: "100%",
            textAlign: "center",
            clear: "both",
            marginBottom: 10,
          }}
        >
          <h1>Apple TV</h1>
          <h2>{info.app}</h2>
          {this.renderArtwork()}
          <h3>{info.title}</h3>
          <div>{info.deviceState}</div>

          <div style={{ marginTop: 1 }}>
            <table>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "25%",
                      textAlign: "right",
                      paddingRight: 10,
                    }}
                  >
                    {formatTime(info.position)}
                  </td>

                  <td style={{ width: "70%" }}>
                    <ProgressBar
                      variant="success"
                      style={{ width: "100%" }}
                      now={(info.position / info.total_time) * 100}
                    />
                  </td>

                  <td
                    style={{
                      width: "25%",
                      paddingRight: 20,
                      paddingLeft: 10,
                      textAlign: "right",
                    }}
                  >
                    -{formatTime(info.total_time - info.position)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
  renderTransport() {
    return (
      <ButtonGroup className="fixed-bottom" style={{ margin: 0, padding: 0 }}>
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

        <Row style={{ ...rowStyle, marginTop: 0 }}>
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

        <Row style={{ ...rowStyle, marginTop: 14 }}>
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

        <Row style={{ ...rowStyle, marginTop: 14, marginBottom: 4 }}>
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
