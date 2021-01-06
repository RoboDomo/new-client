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
    super();
    this.avr = props.avr;
    this.status_topic = `denon/${this.avr.device}/status`;

    this.state = { mute: false };
    this.handleMuteMessage = this.handleMuteMessage.bind(this);
    this.handleMuteButton = this.handleMuteButton.bind(this);
    this.command_topic = `denon/${this.avr.device}/set/command`;
  }

  handleMuteMessage(topic, message) {
    this.setState({ mute: message !== "OFF" });
    console.log("mute", this.state.mute);
  }

  componentDidMount() {
    MQTT.subscribe(this.status_topic + "/MU", this.handleMuteMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(this.status_topic + "/MU", this.handleMuteMessage);
  }

  button(action, children, variant) {
    console.log("button", action, variant);
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

    console.log("mute", mute);
    return (
      <div>
        <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>
          {this.avr.title}
        </h3>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: 8,
            whiteSpace: "nowrap",
          }}
        >
          <h5>Master Volume </h5>
          <MQTTButton
            variant={mute ? "danger" : "primary"}
            onClick={() => {
              this.handleMuteButton();
            }}
          >
            <FaVolumeMute />
          </MQTTButton>
          {this.button("MVDOWN", <FaVolumeDown />)}
          {this.button("MVUP", <FaVolumeUp />)}{" "}
          <span style={{ fontSize: 24, fontWeight: "bold" }}>
            {format(avr.masterVolume)}
          </span>
        </div>

        <div style={{ width: "100%", textAlign: "center", marginTop: 8 }}>
          <h5 style={{ marginTop: 16 }}>Center Channel</h5>
          {this.button("CVC 62", "MAX")}
          {this.button("CVC UP", <FaVolumeUp />)}
          {/* {format((avr.centerVolume - 500) / 10)} */}
          <span
            style={{
              marginLeft: 8,
              marginRight: 8,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {format(avr.centerVolume - 500)}
          </span>
          {this.button("CVC DOWN", <FaVolumeDown />)}
        </div>

        <div style={{ width: "100%", textAlign: "center", marginTop: 18 }}>
          <h5 style={{ textAlign: "center", width: "100%", marginTop: 2 }}>
            {avr.surroundMode}
          </h5>
          <ButtonGroup>
            {this.button("MSAUTO", "Auto", undefined, true)}
            {this.button("MSMOVIE", "Movie", undefined, true)}
            {this.button("MSMUSIC", "Music", undefined, true)}
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

//
export default AudioControls;
