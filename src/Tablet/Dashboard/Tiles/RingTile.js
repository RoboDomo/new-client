import React from "react";
import styles from "./styles";

import { MdRadioButtonChecked } from "react-icons/md";
import {
  FaBatteryEmpty,
  FaBatteryQuarter,
  FaBatteryHalf,
  FaBatteryThreeQuarters,
  FaBatteryFull,
} from "react-icons/fa";
import MQTT from "lib/MQTT";

const fontSize = 18,
  batteryStyles = {
    empty: {
      fontSize: fontSize,
      color: "red",
    },
    quarter: {
      fontSize: fontSize,
      color: "yellow",
    },
    half: {
      fontSize: fontSize,
      color: "yellow",
    },
    threequarters: {
      fontSize: fontSize,
      color: "green",
    },
    full: {
      fontSize: fontSize,
      color: "green",
    },
  };

class RingTile extends React.Component {
  constructor(props) {
    super(props);
    this.tile = props.tile;
    this.location = this.tile.location;
    this.device = this.tile.device;
    this.styles = styles.tile(1, 1);

    this.state = {};

    console.log("Ring", props, this.device, this.location);
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    // console.log("handleMessage", topic, message);
    const parts = topic.split("/"),
      key = parts.pop(),
      newState = {};

    newState[key] = message;
    this.setState(newState);
  }

  componentDidMount() {
    MQTT.subscribe(
      `ring/${this.location}/${this.device}/status/motion`,
      this.handleMessage
    );
    MQTT.subscribe(
      `ring/${this.location}/${this.device}/status/doorbell`,
      this.handleMessage
    );
    MQTT.subscribe(
      `ring/${this.location}/${this.device}/status/battery`,
      this.handleMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `ring/${this.location}/${this.device}/status/motion`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `ring/${this.location}/${this.device}/status/doorbell`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `ring/${this.location}/${this.device}/status/battery`,
      this.handleMessage
    );
  }

  renderBattery() {
    let pct = this.state.battery;
    if (pct === undefined) {
      return null;
    }
    if (pct < 10) {
      return (
        <div style={batteryStyles.empty}>
          <FaBatteryEmpty/> {pct}%
        </div>
      );
    } else if (pct < 37) {
      return (
        <div style={batteryStyles.quarter}>
          <FaBatteryQuarter/> {pct}%
        </div>
      );
    } else if (pct < 63) {
      return (
        <div style={batteryStyles.half}>
          <FaBatteryHalf/> {pct}%
        </div>
      );
    } else if (pct < 87) {
      return (
        <div style={batteryStyles.threequarters}>
          <FaBatteryThreeQuarters/> {pct}%
        </div>
      );
    }
    return (
      <div style={batteryStyles.full}>
        <FaBatteryFull/> {pct}%
      </div>
    );
  }

  render() {
    const styles = Object.assign({}, this.styles);
    styles.padding = 8;

    return (
      <div style={styles}>
        <MdRadioButtonChecked style={{ fontSize: 30 }} />
        <div>{this.device}</div>
        <div>{this.renderBattery()}</div>
      </div>
    );
  }
}

//
export default RingTile;
