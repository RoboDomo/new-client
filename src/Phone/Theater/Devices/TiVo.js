/*
 ****   *                                    *  *****         *   *
 *   *  *                                   *     *      *    *   *
 *   *  *                                  *      *           *   *
 *   *  * ***    ****   * ***    ****      *      *     **     * *    ****
 ****   **   *  *    *  **   *  *    *    *       *      *     * *   *    *
 *      *    *  *    *  *    *  ******   *        *      *     * *   *    *
 *      *    *  *    *  *    *  *        *        *      *      *    *    *
 *      *    *  *    *  *    *  *    *  *         *      *      *    *    *
 *      *    *   ****   *    *   ****   *         *    *****    *     ****
 */

import React from "react";
import { ListGroup, Modal, ButtonGroup, Button } from "react-bootstrap";

import MQTTButton from "Common/MQTTButton";
import MQTT from "lib/MQTT";

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

const style = {
  row: {
    overflow: "hidden",
    marginTop: 4,
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

class TiVo extends React.Component {
  constructor(props) {
    super();
    this.control = props.control;
    this.guide = this.control.guide;
    //
    this.status_topic = `tivo/${this.control.device}/status`;
    this.command_topic = `tivo/${this.control.device}/set/command`;
    this.guide_topic = `tvguide/${this.guide}/status/channels`;
    //
    this.state = { favorites: false };
    //
    this.handleTivoMessage = this.handleTivoMessage.bind(this);
    this.handleGuideMessage = this.handleGuideMessage.bind(this);
  }

  handleTivoMessage(topic, message) {
    if (~topic.indexOf("channel")) {
      this.setState({ channel: message });
    } else if (~topic.indexOf("mode")) {
      this.setState({ mode: message });
    }
  }

  handleGuideMessage(topic, message) {
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

  renderTiVoButtons() {
    const topic = this.command_topic;
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <ButtonGroup>
            <MQTTButton transport topic={topic} message="CLEAR">
              Clear
            </MQTTButton>
            <MQTTButton transport topic={topic} message="LIVETV">
              LiveTV
            </MQTTButton>
            <MQTTButton
              transport
              topic={topic}
              message="TIVO"
              variant="primary"
            >
              Tivo
            </MQTTButton>
            <MQTTButton transport topic={topic} message="GUIDE">
              Guide
            </MQTTButton>
            <MQTTButton transport topic={topic} message="INFO">
              Info
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="THUMBSUP" variant="success">
              <FaThumbsUp />
            </MQTTButton>
            <MQTTButton topic={topic} message="BACK">
              Back
            </MQTTButton>
            <MQTTButton topic={topic} message="THUMBSDOWN" variant="danger">
              <FaThumbsDown />
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }
  renderJoystick() {
    const topic = this.command_topic;
    return (
      <>
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={topic} message="UP">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton topic={topic} message="CHANNELUP" variant="info">
              +
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="LEFT">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton topic={topic} message="SELECT" variant="primary">
              Select
            </MQTTButton>
            <MQTTButton topic={topic} message="RIGHT">
              <FaChevronRight />
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={topic} message="DOWN">
              <FaChevronDown />
            </MQTTButton>
            <MQTTButton topic={topic} message="CHANNELDOWN" variant="info">
              -
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }

  renderABCD() {
    const topic = this.command_topic;
    return (
      <>
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="A" variant="warning">
              A
            </MQTTButton>
            <MQTTButton topic={topic} message="B" variant="primary">
              B
            </MQTTButton>
            <MQTTButton topic={topic} message="C" variant="danger">
              C
            </MQTTButton>
            <MQTTButton topic={topic} message="D" variant="success">
              D
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }

  renderNumberPad() {
    const topic = this.command_topic;
    return (
      <>
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="NUM1">
              1
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM2">
              2
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM3">
              3
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="NUM4">
              4
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM5">
              5
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM6">
              6
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="NUM7">
              7
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM8">
              8
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM9">
              9
            </MQTTButton>
          </ButtonGroup>
        </div>
        <div style={style.line}>
          <ButtonGroup>
            <MQTTButton topic={topic} message="CLEAR">
              .
            </MQTTButton>
            <MQTTButton topic={topic} message="NUM0">
              0
            </MQTTButton>
            <MQTTButton topic={topic} message="ENTER">
              Enter
            </MQTTButton>
          </ButtonGroup>
        </div>
      </>
    );
  }

  renderTransport() {
    return (
      <ButtonGroup className="fixed-bottom" style={{ margin: 0, padding: 0 }}>
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

  renderModal() {
    if (!this.control.favorites || !this.control.favorites.length) {
      return null;
    }

    let key = 0;
    return (
      <Modal show={this.state.favorites}>
        <Modal.Header>
          <h1>Favorites</h1>
        </Modal.Header>
        <Modal.Body>
          <div style={{ overflow: "auto" }}>
            <ListGroup>
              {this.control.favorites.map((favorite) => {
                const g = this.state.guide[favorite.channel];
                return (
                  <ListGroup.Item
                    key={++key}
                    variant={favorite.channel === this.state.channel ? "warning" : undefined}
                    onClick={() => {
                      MQTT.publish(this.command_topic, favorite.channel);
                      this.setState({ favorites: false});
                    }}
                  >
                    {favorite.channel} {g.name}
                    <img
                      style={{ float: "right", height: 30, width: "auto", marginTop: -8 }}
                      src={g.logo.URL}
                      alt={g.name}
                    />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ favorites: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderGuide() {
    try {
      const channel = this.state.channel,
        g = this.state.guide[channel];

      return (
        <>
          {this.renderModal()}
          <h4
            onClick={() => {
              this.setState({ favorites: true });
            }}
            style={{ textAlign: "center", marginBottom: 10, marginTop: 20 }}
          >
            <span style={{ marginRight: 20 }}>
              {this.state.channel} {g.name}
            </span>
            <img
              style={{ height: 30, width: "auto", marginTop: -8 }}
              src={g.logo.URL}
              alt={g.name}
            />
          </h4>
        </>
      );
    } catch (e) {
      return null;
    }
  }

  render() {
    return (
      <>
        {this.renderGuide()}
        {this.renderTiVoButtons()}
        {this.renderJoystick()}
        {this.renderABCD()}
        {this.renderNumberPad()}
        {this.renderTransport()}
      </>
    );
  }
}

//
export default TiVo;
