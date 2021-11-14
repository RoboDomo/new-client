import React from "react";
import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import AppleTVTransport from "Portrait/Transport/AppleTVTransport";

import { Row, Col, ButtonGroup, ProgressBar } from "react-bootstrap";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const DEBUG = require("debug"),
  debug = DEBUG("AppleTVControls");

const formatTime = (time) => {
  const hours = parseInt(time / 3600, 10);
  const minutes = parseInt((time % 3600) / 60, 10);
  const seconds = parseInt(time % 60, 10);
  return `${hours ? hours + ":" : ""}${
    minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
};

class AppleTVControls extends React.Component {
  constructor(props) {
    super();
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
    } catch (e) {
      this.setState({ info: message });
    }
  }

  componentDidMount() {
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
    const height = 120 + window.screen.height - 1024;
    return (
      <img
        style={{ height: height, marginBottom: 10 }}
        alt="artwork"
        src={`data:image;base64,${info.artwork}`}
        onClick={() => {
          if (this.props.exit) {
            this.props.exit();
          }
        }}
      />
    );
  }

  renderNowPlaying() {
    const getInfo = () => {
      const info = this.state.info;
      if (info == null) {
        return null;
      }
      if (info.total_time !== null) {
        return info;
      }
      const now = new Date(),
        minutes = now.getMinutes();

      info.total_time = minutes > 30 ? 60 * 60 : 30 * 60;
      info.position = 60 * minutes + now.getSeconds();
      return info;
    };

    const info = getInfo();
    if (!info || info.deviceState === 'Idle') {
      return (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            clear: "both",
            marginBottom: 1,
          }}
        >
          <h1>Apple TV</h1>
          <h2>Not Playing</h2>
        </div>
      );
      // return <h3>Apple TV</h3>;
    }
    return (
      <>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            clear: "both",
            marginBottom: 4,
          }}
        >
          <h3>{info.app}</h3>
          {this.renderArtwork()}
          <h4>{info.title}</h4>
          <h5>{info.deviceState}</h5>
          <Row style={{ marginTop: 10 }}>
            <Col sm={2}>
              <div
                style={{
                  marginLeft: 20,
                  width: "100%",
                  marginTop: -4,
                  textAlign: "right",
                }}
              >
                {formatTime(info.position)}
              </div>
            </Col>
            <Col sm={8}>
              <ProgressBar
                variant="success"
                animated
                style={{ width: "100%" }}
                now={
                  info.total_time != null
                    ? (info.position / info.total_time) * 100
                    : 100
                }
              />
            </Col>
            <Col sm={2}>
              <div
                style={{
                  marginLeft: -16,
                  width: "100%",
                  marginTop: -4,
                  textAlign: "left",
                }}
              >
                {info.total_time != null ? "-" : ""}
                {info.total_time != null
                  ? formatTime(info.total_time - info.position)
                  : ""}
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }

  render() {
    const renderControls = () => {
      return (
        <div style={{ width: '100%', textAlign: "center", marginLeft: 70 }}>
          <Row style={{ ...rowStyle, marginTop: 80, textAlign: "center" }}>
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
          <div style={{ marginTop: 60 }}>
            <Row style={{ ...rowStyle }}>
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
          </div>
        </div>
      );
    };

    if (this.props.nowPlaying) {
      return (
        <>
          <Row style={{ marginTop: 4, textAlign: "center" }}>
            {this.renderNowPlaying()}
          </Row>
        </>
      )
    }

    return (
      <>
        <Row style={{ marginTop: 4, textAlign: "center" }}>
          {renderControls()}
        </Row>

        <AppleTVTransport device={this.device} />
      </>
    );
  }
}

//
export default AppleTVControls;
