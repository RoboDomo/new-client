import React from "react";
import MQTTButton from "Common/MQTTButton";
import MQTT from "lib/MQTT";

class FanButton extends React.Component {
  constructor(props) {
    super(props);
    this.hub = props.hub;
    this.name = props.name;
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
    const fan = this.state;
    let level = 25;

    if (!fan.sw) {
      level = 25;
    } else if (fan.level < 34) {
      level = 50;
    } else if (fan.level < 67) {
      level = 75;
    } else {
      level = 0;
    }

    if (level) {
      MQTT.publish(`${this.hub}/${this.name}/set/switch`, "on");
      MQTT.publish(`${this.hub}/${this.name}/set/level`, level);
    } else {
      MQTT.publish(`${this.hub}/${this.name}/set/switch`, "off");
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
        <MQTTButton onClick={this.handleClick}>{value}</MQTTButton>
      </div>
    );
  }
}

//
export default FanButton;
