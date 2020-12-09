// TODO
// [] use TV when no AVR present

import React from "react";
import { ButtonGroup } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import { FaVolumeMute, FaVolumeUp, FaVolumeDown } from "react-icons/fa";

import MQTT from "lib/MQTT";

const format = (n) => {
  if (n === null || n === undefined) {
    return 0;
  }
  if (typeof n === "number") {
    if (n > 99) {
      return n / 10;
    }
    return n;
  }
  if (n.length === 3) {
    return Number(n) / 10;
  }
  return Number(n);
};

class AudioControls extends React.Component {
  constructor(props) {
    super(props);
    this.avr = props.avr;
    this.status_topic = `denon/${this.avr.device}/status`;

    this.state = { mute: false };
    this.handleMuteMessage = this.handleMuteMessage.bind(this);
    this.handleMuteButton = this.handleMuteButton.bind(this);
    this.command_topic = `denon/${this.avr.device}/set/command`;
  }

  handleMuteMessage(topic, message) {
    this.setState({ mute: message !== "OFF" });
  }

  componentDidMount() {
    MQTT.subscribe(this.status_topic + "/MU", this.handleMuteMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + "/MU", this.handleMuteMessage);
  }

  button(action, children, variant) {
    return (
      <MQTTButton variant={variant} topic={this.command_topic} message={action}>
        {children}
      </MQTTButton>
    );
  }

  handleMuteButton() {
    const mute = this.state.mute;
    MQTT.publish(this.command_topic, mute ? "MUOFF" : "MUON");
    this.setState({ mute: !mute });
  }

  render() {
    const avr = this.props.avr,
      mute = this.state.mute;

    if (!avr || !avr.device || avr.centerVolume === undefined) {
      return null;
    }

    return (
      <div style={{ width: 120 }}>
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>
          {this.avr.title}
        </div>
        <ButtonGroup vertical>
          <div>Master Volume</div>

          <MQTTButton
            variant={mute ? "danger" : "primary"}
            onClick={this.handleMuteButton}
          >
            <FaVolumeMute />
          </MQTTButton>

          {this.button("MVUP", <FaVolumeUp />)}
          <div style={{ textAlign: "center", width: "100%" }}>
            {format(avr.masterVolume)}
          </div>
          {this.button("MVDOWN", <FaVolumeDown />)}
        </ButtonGroup>

        <ButtonGroup vertical>
          <div style={{ marginTop: 16 }}>Center Channel</div>
          {this.button("CVC 62", "MAX")}
          {this.button("CVC UP", <FaVolumeUp />)}
          <div style={{ textAlign: "center", width: "100%" }}>
            {/* {format((avr.centerVolume - 500) / 10)} */}
            {avr.centerVolume - 500}
          </div>
          {this.button("CVC DOWN", <FaVolumeDown />)}
        </ButtonGroup>

        <ButtonGroup vertical>
          <div
            style={{
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              marginTop: 16,
            }}
          >
            {avr.surroundMode}
          </div>
          {this.button("MSAUTO", "Auto")}
          {this.button("MSMOVIE", "Movie")}
          {this.button("MSMUSIC", "Music")}
        </ButtonGroup>
      </div>
    );
  }
}

//
export default AudioControls;
