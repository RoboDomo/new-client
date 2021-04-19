import React from "react";
import MQTTButton from "Common/MQTTButton";
import MQTT from "lib/MQTT";

import FanModal from "Common/Modals/FanModal";

class FanButton extends React.Component {
  constructor(props) {
    super(props);
    this.hub = props.hub;
    this.name = props.name;
    this.device = props.name;
    this.handleClick = this.handleClick.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.state = {
      sw: "off",
      level: 0,
    };
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

  handleMessage(topic, message) {
    if (~topic.indexOf("switch")) {
      this.setState({ sw: message });
    } else if (~topic.indexOf("level")) {
      this.setState({ level: message });
    }
  }

  handleClick() {
    if (this.state.level !== undefined) {
      this.setState({ show: true });
    }
  }

  render() {
    let { sw, level } = this.state;
    let value = "Off";
    if (sw === "on") {
      if (level < 34) {
        value = "Low";
      } else if (level < 67) {
        value = "Medium";
      } else {
        value = "High";
      }
    }
    return (
      <div>
        <FanModal
          show={this.state.show}
          onHide={() => {
            this.setState({ show: false });
          }}
          hub={this.hub}
          device={this.device}
          value={value}
        />
        <MQTTButton onClick={this.handleClick}>{value}</MQTTButton>
      </div>
    );
  }
}

//
export default FanButton;
