import React from "react";

import NumberInput from "Common/Form/NumberInput";
import Temperature from "Common/Temperature";

import Locale from "lib/Locale";
import MQTT from "lib/MQTT";

import {
  Form,
  ButtonGroup,
  Button,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import Thermostat from "react-nest-thermostat";

import { data as Config } from "lib/Config";

class ThermostatTab extends React.Component {
  constructor(props) {
    super(props);

    this.title = props.thermostat.title;
    this.weather = props.thermostat.weather;
    this.zone = props.thermostat.zone;

    this.state = {
      heatSetpoint: false,
      coolSetpoint: false,
      weather: null,
      // thermostat: null,
      zoneDetail: null,
      zone: this.zone,
    };

    //
    this.handleIComfortMessage = this.handleIComfortMessage.bind(this);
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
    this.setTargetTemperature = this.setTargetTemperature.bind(this);
    this.adjustTargetTemperature = this.adjustTargetTemperature.bind(this);
  }

  handleIComfortMessage(topic, message) {
    const zoneDetail = message.zoneDetail;
    if (!zoneDetail) {
      console.log("invalid message", message);
      return;
    }

    const coolSetPoint = Number(zoneDetail.CoolSetPoint),
      heatSetPoint = Number(zoneDetail.HeatSetPoint);

    let systemMode = "off",
      hvacMode = "off";

    switch (zoneDetail.SystemMode) {
      case 0:
        systemMode = "cooling";
        if (zoneDetail.Cooling) {
          hvacMode = "cooling";
        }
        break;
      case 1:
        systemMode = "heating";
        if (zoneDetail.Heating) {
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

    this.setState({
      // thermostat: message,
      zoneDetail: zoneDetail,
      systemMode: systemMode,
      hvacMode: hvacMode,
      coolSetPoint: coolSetPoint,
      heatSetPoint: heatSetPoint,
    });
  }

  handleWeatherMessage(topic, message) {
    this.setState({
      weather: {
        iconLink: message.iconLink,
        iconName: message.iconName,
        temperature: message.temperature,
        humidity: message.humidity,
        highTemperature: message.highTemperature,
        lowTemperature: message.lowTemperature,
        description: message.description,
      },
    });
  }

  componentDidMount() {
    MQTT.subscribe(
      `weather/${this.weather}/status/observation`,
      this.handleWeatherMessage
    );
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/data`,
      this.handleIComfortMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `weather/${this.weather}/status/observation`,
      this.handleWeatherMessage
    );
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/data`,
      this.handleIComfortMessage
    );
  }

  setTargetTemperature(temp) {
    const { systemMode, coolSetPoint, heatSetPoint } = this.state;
    if (!systemMode || coolSetPoint === false || heatSetPoint === false) {
      return;
    }

    if (systemMode === "cooling") {
      MQTT.publish(
        `icomfort/zone${this.zone}/set/setpoint`,
        `${temp}:${heatSetPoint}`
      );
      this.setState({ coolSetPoint: temp });
    } else if (systemMode === "heating") {
      MQTT.publish(
        `icomfort/zone${this.zone}/set/setpoint`,
        `${coolSetPoint}:${temp}`
      );
      this.setState({ heatlSetPoint: temp });
    }
  }

  adjustTargetTemperature(delta) {
    const { systemMode, coolSetPoint, heatSetPoint } = this.state;
    if (!systemMode || coolSetPoint === false || heatSetPoint === false) {
      return;
    }

    if (systemMode === "cooling") {
      MQTT.publish(
        `icomfort/zone${this.zone}/set/setpoint`,
        `${coolSetPoint + delta}:${heatSetPoint}`
      );
      this.setState({ coolSetPoint: coolSetPoint + delta });
    } else if (systemMode === "heating") {
      MQTT.publish(
        `icomfort/zone${this.zone}/set/setpoint`,
        `${coolSetPoint}:${heatSetPoint + delta}`
      );
      this.setState({ heatlSetPoint: heatSetPoint + delta });
    }
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  renderNumberField(target, metric) {
    const state = this.state,
      mode = this.state.systemMode;

    // console.log("renderNumberField", target, metric, this.state);
    // if (this.state.systemMode === undefined) {
    //   return null;
    // }

    switch (mode) {
      case "cooling": // cool only
      case "cool": // cool only
      case "heating": // heat
      case "heat": // heat
      case "both": // both
        return (
          <Form style={{ margin: 0, marginTop: -40 }}>
            <div style={{ textAlign: "center" }}>
              <NumberInput
                label={mode}
                style={{ margin: 8, padding: 0 }}
                key={target}
                value={Locale.ftoc(target, metric)}
                step={metric ? 0.1 : 1}
                onValueChange={(temp) => {
                  const heatSetPoint = state.HeatSetPoint,
                    coolSetPoint = state.CoolSetPoint;

                  if (mode === "Cool") {
                    MQTT.publish(
                      `icomfort/zone${this.zone}/set/setpoint`,
                      `${temp}:${coolSetPoint}`
                    );
                    this.setState({ CoolSetPoint: temp });
                  } else if (mode === "Heat") {
                    MQTT.publish(
                      `icomfort/zone${this.zone}/set/setpoint`,
                      `${heatSetPoint}:${temp}`
                    );
                    this.setState({ HeatSetPoint: temp });
                  }
                }}
              />
            </div>
          </Form>
        );
      case "emergency": // emergency
      case "off": // Off
        //        return (
        //          <ButtonGroup size="sm" style={{ marginTop: 10 }}>
        //            <Button variant="danger" disabled>
        //              Off
        //            </Button>
        //            <Button
        //              onClick={() => {
        //                setSystemMode("cool");
        //              }}
        //            >
        //              Cool
        //            </Button>
        //            <Button
        //              onClick={() => {
        //                setSystemMode("heat");
        //              }}
        //            >
        //              Heat
        //            </Button>
        //            <Button
        //              onClick={() => {
        //                setSystemMode("both");
        //              }}
        //            >
        //              Both
        //            </Button>
        //          </ButtonGroup>
        //        );
        break;
      case 5: // Offline
        return <div>Offline</div>;
      case 6: // Auto
        break;
      default:
        break;
    }
    return <div style={{ height: 35 }} />;
  }

  render() {
    const {
      zoneDetail,
      weather,
      hvacMode,
      systemMode,
      coolSetPoint,
      heatSetPoint,
    } = this.state;

    if (!weather || !zoneDetail) {
      return null;
    }

    const ambient_temperature = Number(zoneDetail.AmbientTemperature);
    let target = coolSetPoint;
    if (systemMode === "heating") {
      target = heatSetPoint;
    }

    const metric = Config.metric;
    const hvacModeChange = (mode) => {
      try {
        // dispatch({ type: "hvac_mode", value: mode });
      } catch (e) {}
    };

    const setSystemMode = (mode) => {
      MQTT.publish(`icomfort/zone${this.zone}/set/mode`, mode);
      this.setState({ systemMode: mode });
    };

    return (
      <div style={{ padding: 8, marginTop: 6 }}>
        <h3 style={{ textAlign: "center" }}>{this.title}</h3>
        {/* THERMOSTAT */}
        <div style={{ textAlign: "center" }}>
          <Thermostat
            style={{ textAlign: "center " }}
            width="200px"
            height="200px"
            away={Boolean(zoneDetail.AwayModeEnabled)}
            ambientTemperature={Locale.ftoc(target, metric)}
            targetTemperature={Locale.ftoc(ambient_temperature, metric)}
            hvacMode={hvacMode}
            leaf={zoneDetail.FeelsLikeEnabled}
          />
          <div style={{ height: 30 }} />
          {this.renderNumberField(target, metric)}
          <ButtonGroup
            onChange={hvacModeChange}
            type="radio"
            size="lg"
            name="hvac"
            value={zoneDetail.SystemMode}
          >
            <Button
              style={{ width: 85, fontSize: 14 }}
              variant={systemMode === "off" ? "success" : undefined}
              onClick={() => {
                setSystemMode("off");
              }}
            >
              Off
            </Button>
            <Button
              style={{ width: 85, fontSize: 14 }}
              variant={systemMode === "heating" ? "success" : undefined}
              onClick={() => {
                setSystemMode("heat");
              }}
            >
              Heat
            </Button>
            <Button
              style={{ width: 85, fontSize: 14 }}
              variant={systemMode === "cooling" ? "success" : undefined}
              onClick={() => {
                setSystemMode("cool");
              }}
            >
              Cool
            </Button>
            <Button
              style={{ width: 110, fontSize: 14 }}
              variant={systemMode === "both" ? "success" : undefined}
              onClick={() => {
                setSystemMode("both");
              }}
            >
              Heat/Cool
            </Button>
          </ButtonGroup>
        </div>
        <ListGroup style={{ marginTop: 10, width: "100%" }}>
          <ListGroupItem>
            Outside Temperature
            <span style={{ float: "right" }}>
              <Temperature value={weather.temperature} />
            </span>
          </ListGroupItem>
          <ListGroupItem>
            Feels Like
            <span style={{ float: "right" }}>
              <Temperature value={ambient_temperature} />
            </span>
          </ListGroupItem>
          <ListGroupItem>
            Target Temperature
            <span style={{ float: "right" }}>
              <Temperature value={target} />
            </span>
          </ListGroupItem>
          <ListGroupItem>
            Ambient Humidity
            <span style={{ float: "right" }}>{zoneDetail.HumidityDisplay}</span>
          </ListGroupItem>
          <ListGroupItem>
            System Mode
            <span style={{ float: "right" }}>{systemMode.toUpperCase()}</span>
          </ListGroupItem>
          <ListGroupItem>
            Operating State
            <span style={{ float: "right" }}>{hvacMode.toUpperCase()}</span>
          </ListGroupItem>
          <ListGroupItem>
            Fan
            <span style={{ float: "right" }}>
              {zoneDetail.isFanRunning ? "ON" : "OFF"}
            </span>
          </ListGroupItem>
          {/* <ListGroupItem> */}
          {/*   Time To Target */}
          {/*   <span style={{ float: "right" }}> */}
          {/*     {thermostat.time_to_target} */}
          {/*   </span> */}
          {/* </ListGroupItem> */}
        </ListGroup>
      </div>
    );
  }
  // console.log("render", title, weather, zone, this.state);
  // return <div>ICOMFORT TAB zone: {zone} weather: {weather}</div>;
}

//
export default ThermostatTab;
