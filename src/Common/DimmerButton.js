import React from "react";

import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import DimmerModal from "Common/Modals/DimmerModal";

class DimmerButton extends React.Component {
  constructor(props) {
    super(props);
    this.hub = props.hub;
    this.name = props.name;
    this.device = this.name;
    this.state = {
      switch: "off",
      level: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
    MQTT.subscribe(`${this.hub}/${this.name}/status/level`, this.handleMessage);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/level`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/switch`,
      this.handleMessage
    );
  }

  handleClick() {
    this.setState({ show: true });
  }

  handleMessage(topic, message) {
    const newState = Object.assign({}, this.state);
    if (~topic.indexOf("switch")) {
      newState.switch = message;
    } else if (~topic.indexOf("level")) {
      newState.level = message;
    }
    this.setState(newState);
  }

  render() {
    const value =
      this.state.switch === "on" ? Number(this.state.level) + "%" : "Off";
    return (
      <div>
        <DimmerModal
          show={this.state.show}
          hub={this.hub}
          device={this.device}
          level={this.state.level}
          power={this.state.power}
          onHide={() => {
            this.setState({ show: false });
          }}
        />

        <MQTTButton onClick={this.handleClick}>{value}</MQTTButton>
      </div>
    );
  }
}

//
export default DimmerButton;
