/**
 * IComfortButton
 *
 * Component for upper right side of Theater screen, to display and control lennox iComfort thermostat
 */

import React from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

import Temperature from "Common/Temperature";
import MQTTButton from "Common/MQTTButton";

import MQTT from "lib/MQTT";
import Clock from "Common/Clock";

import DelayedTask from "lib/DelayedTask";

import { data as Config } from "lib/Config";

class IComfortButton extends React.Component {
  constructor(props) {
    super(props);

    this.metric = Config.metric || false;

    this.zone = props.zone;
    this.weather = props.weather;
    this.state = {
      HeatSetpoint: false,
      CoolSetpoint: false,
      weather: null,
    };

    //
    this.handleIComfortMessage = this.handleIComfortMessage.bind(this);
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
    //
    this.delayedTask = null;
    this.handleClickUp = this.handleClickUp.bind(this);
    this.handleClickDown = this.handleClickDown.bind(this);
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  setTarget(cool, heat) {
    const DELAY = 1000;

    console.log('setTarget', cool, heat);
    this.setState({ HeatSetPoint: heat, CoolSetPoint: cool });
    console.log(this.state);
    if (!this.delayedTask) {
      console.log("new delayed task");
      this.delayedTask = new DelayedTask(() => {
        const temp = `${this.state.CoolSetPoint}:${this.state.HeatSetPoint}`;
        // send set target
        console.log("Set target ", temp);
        MQTT.publish(`icomfort/zone${this.zone}/set/setpoint`, temp);
        this.delyedTask = null;
      }, DELAY);
    } else {
      console.log("defer delayed task");
      this.delayedTask.defer(DELAY);
    }
  }

  handleClickUp() {
    console.log("click up", this.state);
    if (this.state.systemMode === "cooling") {
      this.setTarget(this.state.CoolSetPoint + 1, this.state.HeatSetPoint);
    } else if (this.state.systemMode === "heating") {
      this.setTarget(this.state.CoolSetPoint, this.state.HeatSetPoint + 1);
    }
  }

  handleClickDown() {
    if (this.state.systemMode === "cooling") {
      this.setTarget(this.state.CoolSetPoint - 1, this.state.HeatSetPoint);
    } else if (this.state.systemMode === "heating") {
      this.setTarget(this.state.CoolSetPoint, this.state.HeatSetPoint - 1);
    }
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  handleIComfortMessage(topic, message) {
    const key = topic.split("/").pop(),
          newState = {};
    if (key === 'SystemMode') {
      switch (Number(message)) {
      case 0:
        newState.systemMode = 'cooling';
        break;
      case 1:
        newState.systemMode = 'heating';
        break;
      default:
        newState.systemMode = 'off';
        break;
      }
      
    }
    newState[key] = message;
    this.setState(newState);
  }

  handleWeatherMessage(topic, message) {
    this.setState({
      weather: {
        iconLink: message.iconLink,
        iconName: message.iconName,
        temperature: message.temperature,
      },
    });
  }

  componentDidMount() {
    MQTT.subscribe(
      `weather/${this.weather}/status/observation`,
      this.handleWeatherMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/SystemMode`,
      this.handleIComfortMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/AmbientTemperature`,
      this.handleIComfortMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/Cooling`,
      this.handleIComfortMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/CoolSetPoint`,
      this.handleIComfortMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/Heating`,
      this.handleIComfortMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/HeatSetPoint`,
      this.handleIComfortMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `weather/${this.weather}/status/observation`,
      this.handleWeatherMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/SystemMode`,
      this.handleIComfortMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/AmbientTemperature`,
      this.handleIComfortMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/Cooling`,
      this.handleIComfortMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/CoolSetPoint`,
      this.handleIComfortMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/Heating`,
      this.handleIComfortMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/HeatSetPoint`,
      this.handleIComfortMessage
    );
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  render() {
    const state = this.state;
    const weather = state.weather;

    if (weather === null) {
      return null;
    }

    let systemMode = "off",
      hvacMode = "off",
      coolSetPoint = this.delayedTask ? state.CoolSetPoint : state.CoolSetPoint,
      heatSetPoint = this.delayedTask ? state.HeatSetPoint : state.HeatSetPoint;

    switch (state.SystemMode) {
      case 0:
        systemMode = "cooling";
        if (state.Cooling) {
          hvacMode = "cooling";
        }
        break;
      case 1:
        systemMode = "heating";
        if (state.Heating) {
          hvacMode = "heating";
        }
        break;
      case 2:
        systemMode = "both";
        break;
      case 3:
        systemMode = "emergency heat";
        break;
      case 4:
      default:
        systemMode = "off";
        hvacMode = "off";
        break;
      case 5:
        systemMode = "offline";
        break;
      case 6:
        systemMode = "auto";
        break;
    }

    const ambient = state.AmbientTemperature;
    const target = systemMode === "cooling" ? coolSetPoint : heatSetPoint;

    if (target === false) {
      return null;
    }

    let backgroundColor, color;
    switch (hvacMode) {
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

        <div style={{ marginTop: 8, fontSize: 16, fontWeight: "bold" }}>
          <div>Zone {this.zone}</div>
          <div>
            Feels like <Temperature value={ambient} metric={this.metric} />
          </div>
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
          <Temperature value={target} metric={this.metric} />
        </div>
        <MQTTButton onClick={this.handleClickDown}>
          <FaChevronDown />
        </MQTTButton>
      </>
    );
  }
}

//
export default IComfortButton;
