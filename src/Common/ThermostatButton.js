/**
 * ThermostatButton
 *
 * Component for upper right side of Theater screen, to display and control thermostat
 */
import React from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

import Temperature from "Common/Temperature";
import MQTTButton from "Common/MQTTButton";

import MQTT from "lib/MQTT";
import Clock from "Common/Clock";

import DelayedTask from "lib/DelayedTask";

import { data as Config } from "lib/Config";

class ThermostatButton extends React.Component {
  constructor(props) {
    super(props);
    this.hub = props.hub;
    this.metric = Config.metric || false;
    // this.metric = true;
    this.weather = props.weather;
    this.device = props.device;
    this.state = {
      weather: null,
      thermostat: {
        hvac_state: "off",
      },
      targetTemperature: 72,
      newTarget: -999,
    };
    this.handleClickDown = this.handleClickDown.bind(this);
    this.handleClickUp = this.handleClickUp.bind(this);

    this.handleMessage = this.handleMessage.bind(this);

    this.delayedTask = null;
  }

  handleMessage(topic, message) {
    // console.warn("handleMessage", topic, message);
    const newState = Object.assign({}, this.state);
    if (~topic.indexOf("observation")) {
      newState.weather = {
        iconLink: message.iconLink,
        iconName: message.iconName,
        temperature: message.temperature,
      };
    } else if (~topic.indexOf("hvac_state")) {
      newState.thermostat.hvac_state = message;
    } else if (~topic.indexOf("ambient_temperature")) {
      newState.thermostat.ambient_temperature = message;
    } else if (~topic.indexOf("target_temperature")) {
      newState.thermostat.target_temperature = message;
      newState.targetTemperature = message;
      if (newState.newTarget === -999) {
        newState.newTarget = message;
      }
    }
    this.setState(newState);
  }

  componentDidMount() {
    MQTT.subscribe(
      `weather/${this.weather}/status/observation`,
      this.handleMessage
    );
    MQTT.subscribe(`nest/${this.device}/status/hvac_state`, this.handleMessage);
    MQTT.subscribe(
      `nest/${this.device}/status/ambient_temperature_f`,
      this.handleMessage
    );
    MQTT.subscribe(
      `nest/${this.device}/status/target_temperature_f`,
      this.handleMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `nest/${this.device}/status/ambient_temperature_f`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `nest/${this.device}/status/target_temperature_f`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `nest/${this.device}/status/hvac_state`,
      this.handleMessage
    );
    MQTT.unsubscribe(
      `weather/${this.weather}/status/observation`,
      this.handleMessage
    );
  }

  publishTemperature() {
    if (this.metric) {
      MQTT.publish(
        `nest/${this.device}/set/target_temperature_c`,
        this.state.targetTemperature
      );
    } else {
      MQTT.publish(
        `nest/${this.device}/set/target_temperature_f`,
        this.state.targetTemperature
      );
    }
  }

  handleClickDown() {
    const newState = Object.assign({}, this.state);
    newState.newTarget = newState.targetTemperature - 1;
    newState.targetTemperature = newState.newTarget;
    this.setState(newState);
    if (this.delayedTask) {
      this.delayedTask.defer(2000);
    } else {
      this.delayedTask = new DelayedTask(() => {
        console.log("set temperature", this.state.targetTemperature);
        this.publishTemperature();
        // MQTT.publish();
        // dispatch({ type: "target_temp", value: newTarget.current });
        this.delayedTask = null;
      }, 2000);
    }
  }

  handleClickUp() {
    const newState = Object.assign({}, this.state);
    newState.newTarget = newState.targetTemperature + 1;
    newState.targetTemperature = newState.newTarget;
    this.setState(newState);
    if (this.delayedTask) {
      this.delayedTask.defer(2000);
    } else {
      this.delayedTask = new DelayedTask(() => {
        console.log("set temperature", this.state.targetTemperature);
        this.publishTemperature();
        // dispatch({ type: "target_temp", value: newTarget.current });
        this.delayedTask = null;
      }, 2000);
    }
  }

  render() {
    const thermostat = this.state.thermostat,
      weather = this.state.weather;

    console.log("render", thermostat, weather);
    if (!thermostat.hvac_state || !weather) {
      return null;
    }

    let backgroundColor, color;
    //  console.log(thermostat.hvacState, thermostat);
    switch (thermostat.hvac_state) {
      case "off":
      default:
        break;
      case "heating":
        backgroundColor = "rgb(227, 99, 4)";
        color = "white";
        break;
      case "cooling":
        backgroundColor = "rgb(0, 122, 241)";
        color = "white";
        break;
    }
    // console.log("weather", weather);
    return (
      <>
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 24 }}>
          <Clock />
        </div>
        <div style={{ fontSize: 24, fontWeight: "bold" }}>
          <img
            style={{
              verticalAlign: "top",
              width: 32,
              height: 32,
            }}
            src={weather.iconLink}
            alt={weather.iconName}
          />
          <div style={{ display: "inline", paddingTop: 0, fontSize: 24 }}>
            <Temperature value={weather.temperature} metric={this.metric} />
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: "bold" }}>
          Inside:{" "}
          <Temperature
            value={thermostat.ambient_temperature}
            metric={this.metric}
          />
        </div>
        <MQTTButton onClick={this.handleClickUp}>
          <FaChevronUp />
        </MQTTButton>
        <div
          style={{
            fontSize: 32,
            textAlign: "center",
            color: color,
            backgroundColor: backgroundColor,
            width: 96,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Temperature
            value={this.state.targetTemperature}
            metric={this.metric}
          />
        </div>
        <MQTTButton onClick={this.handleClickDown}>
          <FaChevronDown />
        </MQTTButton>
      </>
    );
  }
}

//
export default ThermostatButton;
