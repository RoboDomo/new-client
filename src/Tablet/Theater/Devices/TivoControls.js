import React from "react";
import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import { Row, ButtonGroup } from "react-bootstrap";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaThumbsUp,
  FaThumbsDown,
  FaBackward,
  FaFastBackward,
  FaPause,
  FaPlay,
  FaStepForward,
  FaForward,
  FaFastForward,
  FaDotCircle,
} from "react-icons/fa";

import TiVoFavorites from "Common/Modals/TiVoFavorites";

const DEBUG = require("debug"),
  debug = DEBUG("TivoControls");

const style = {
  row: {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

class TivoControls extends React.Component {
  constructor(props) {
    super();

    this.device = props.device;
    this.guide = this.device.guide;
    this.favorites = this.device.favorites;

    this.status_topic = `tivo/${this.device.device}/status`;
    this.command_topic = `tivo/${this.device.device}/set/command`;
    this.guide_topic = `tvguide/${this.guide}/status/channels`;

    this.handleTivoMessage = this.handleTivoMessage.bind(this);
    this.handleGuideMessage = this.handleGuideMessage.bind(this);

    this.state = { show: false };
  }

  handleTivoMessage(topic, message) {
    if (~topic.indexOf("channel")) {
      this.setState({ channel: message });
    } else if (~topic.indexOf("mode")) {
      this.setState({ mode: message });
    }
  }

  handleGuideMessage(topic, message) {
    debug("guide message topic", topic);
    try {
      this.setState({ guide: message });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    MQTT.subscribe(this.status_topic + "/channel", this.handleTivoMessage);
    MQTT.subscribe(this.status_topic + "/mode", this.handleTivoMessage);
    MQTT.subscribe(this.guide_topic, this.handleGuideMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + "/channel", this.handleTivoMessage);
    MQTT.unsubscribe(this.status_topic + "/mode", this.handleTivoMessage);
    MQTT.unsubscribe(this.guide_topic, this.handleGuideMessage);
  }

  renderTransport() {
    return (
      <ButtonGroup
        className="fixed-bottom"
        style={{ margin: 0, padding: 0, width: 1024 }}
      >
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
    );
  }

  renderHomeRow() {
    return (
      <>
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="CLEAR">
              Clear
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="LIVETV">
              Live TV
            </MQTTButton>
            <MQTTButton
              topic={this.command_topic}
              message="TIVO"
              variant="primary"
            >
              TiVo
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="GUIDE">
              Guide
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="INFO">
              Info
            </MQTTButton>
          </ButtonGroup>
        </Row>
        <Row style={style.row}>
          <ButtonGroup>
            <MQTTButton
              topic={this.command_topic}
              message="THUMBSUP"
              variant="success"
            >
              <FaThumbsUp />
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="BACK">
              Back
            </MQTTButton>
            <MQTTButton
              topic={this.command_topic}
              message="THUMBSDOWN"
              variant="danger"
            >
              <FaThumbsDown />
            </MQTTButton>
          </ButtonGroup>
        </Row>
      </>
    );
  }

  renderJoystick() {
    return (
      <Row style={style.row}>
        <ButtonGroup>
          <MQTTButton variant="none" />
          <MQTTButton topic={this.command_topic} message="UP">
            <FaChevronUp />
          </MQTTButton>
          <MQTTButton
            topic={this.command_topic}
            message="CHANNELUP"
            variant="info"
          >
            +
          </MQTTButton>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <MQTTButton topic={this.command_topic} message="LEFT">
            <FaChevronLeft />
          </MQTTButton>
          <MQTTButton
            topic={this.command_topic}
            message="SELECT"
            variant="primary"
          >
            Select
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="RIGHT">
            <FaChevronRight />
          </MQTTButton>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <MQTTButton variant="none" />
          <MQTTButton topic={this.command_topic} message="DOWN">
            <FaChevronDown />
          </MQTTButton>
          <MQTTButton
            topic={this.command_topic}
            message="CHANNELDOWN"
            variant="info"
          >
            -
          </MQTTButton>
        </ButtonGroup>
      </Row>
    );
  }

  renderABCD() {
    return (
      <Row style={style.row}>
        <ButtonGroup>
          <MQTTButton topic={this.command_topic} message="A" variant="warning">
            A
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="B" variant="primary">
            B
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="C" variant="danger">
            C
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="D" variant="success">
            D
          </MQTTButton>
        </ButtonGroup>
      </Row>
    );
  }

  renderNumberPad() {
    return (
      <Row style={style.row}>
        <ButtonGroup>
          <MQTTButton topic={this.command_topic} message="NUM1">
            1
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM2">
            2
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM3">
            3
          </MQTTButton>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <MQTTButton topic={this.command_topic} message="NUM4">
            4
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM5">
            5
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM6">
            6
          </MQTTButton>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <MQTTButton topic={this.command_topic} message="NUM7">
            7
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM8">
            8
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM9">
            9
          </MQTTButton>
        </ButtonGroup>
        <br />
        <ButtonGroup>
          <MQTTButton topic={this.command_topic} message="CLEAR">
            .
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="NUM0">
            0
          </MQTTButton>
          <MQTTButton topic={this.command_topic} message="ENTER">
            Enter
          </MQTTButton>
        </ButtonGroup>
      </Row>
    );
  }

  renderGuide() {
    try {
      const channel = this.state.channel,
        g = this.state.guide[channel];
      return (
        <>
          <TiVoFavorites
            activities={this.activities}
            currentActivity={this.state.currentActivity}
            tivo={this.device}
            channels={this.state.guide}
            select={(selection) => {
              const favorite = selection.favorite,
                activity = selection.activity;
              if (favorite) {
                const topic = `tivo/${this.state.tivo.device}/set/command`;
                MQTT.publish(topic, "0" + favorite.channel);
                this.setState({ show: false });
              } else if (activity) {
                /* console.log("ACTIVITY", activity.macro); */
                MQTT.publish("macros/run", activity.macro);
              }
            }}
            show={this.state.show}
            hide={() => {
              this.setState({ show: false });
            }}
          />
          <div
            style={{ marginBottom: 10 }}
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            <img style={{ height: 80 }} src={g.logo.URL} alt={g.name} />
            <h4>
              Channel: {this.state.channel} {g.name}{" "}
            </h4>
          </div>
        </>
      );
    } catch (e) {
      return null;
    }
  }
  render() {
    debug("render");

    return (
      <>
        {this.renderGuide()}
        {this.renderHomeRow()}
        {this.renderJoystick()}
        {this.renderABCD()}
        {this.renderNumberPad()}
        {this.renderTransport()}
      </>
    );
  }
}

//
export default TivoControls;
