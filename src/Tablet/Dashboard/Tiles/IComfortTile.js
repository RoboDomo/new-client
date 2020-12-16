import React from "react";
import styles from "./styles";

import MQTT from "lib/MQTT";

import Locale from "lib/Locale";
// import Temperature from "Common/Temperature";

// import NumberInput from "Common/Form/NumberInput";
import NumberField from "Common/Form/NumberField";
// import MQTTButton from "Common/MQTTButton";
import Thermostat from "react-nest-thermostat";
import { Form, ButtonGroup, Button } from "react-bootstrap";

import { data as Config } from "lib/Config";

const getSystemMode = (mode) => {
  const systemModes = [
    /* 0 */ "Cool",
    /* 1 */ "Heat",
    /* 2 */ "Both",
    /* 3 */ "Emergency",
    /* 4 */ "Off",
    /* 5 */ "Offline",
    /* 6 */ "Auto",
  ];
  if (systemModes[mode] !== undefined) {
    return systemModes[mode];
  }
  return "Offline";
};

class iComfortTile extends React.Component {
  constructor(props) {
    super(props);
    this.tile = props.tile;
    this.style = styles.tile(2, 2);
    this.zone = this.tile.zone;
    this.name = this.tile.name;

    this.handleIComfortMessage = this.handleIComfortMessage.bind(this);

    this.state = {};
    // console.log("tile", this.tile);
  }

  handleIComfortMessage(topic, message) {
    const key = topic.split("/").pop(),
      newState = {};
    newState[key] = message;
    this.setState(newState);
  }

  componentDidMount() {
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/FeelsLikeEnabled`,
      this.handleIComfortMessage
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
      `icomfort/zone${this.zone}/status/FeelsLikeEnabled`,
      this.handleIComfortMessage
    );
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

  renderNumberField(target, metric) {
    const state = this.state,
      mode = getSystemMode(this.state.SystemMode);

    const setSystemMode = (mode) => {
      MQTT.publish(`icomfort/zone${this.zone}/set/mode`, mode);
      this.setState({ systemMode: mode });
    };

    // console.log("renderNumberField", target, metric, this.state);
    // if (this.state.systemMode === undefined) {
    //   return null;
    // }
    switch (mode) {
      case "Cool": // cool only
      case "Heat": // heat
      case "Both": // both
        return (
          <Form style={{ margin: 0, marginTop: 2 }}>
            <div style={{ marginLeft: 0, marginRight: 48 }}>
              <NumberField
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
      case "Emergency": // emergency
      case "Off": // Off
        return (
          <ButtonGroup size="sm" style={{ marginTop: 10 }}>
            <Button variant="danger" disabled>
              Off
            </Button>
            <Button
              onClick={() => {
                setSystemMode("cool");
              }}
            >
              Cool
            </Button>
            <Button
              onClick={() => {
                setSystemMode("heat");
              }}
            >
              Heat
            </Button>
            <Button
              onClick={() => {
                setSystemMode("both");
              }}
            >
              Both
            </Button>
          </ButtonGroup>
        );
      case 5: // Offline
      case 6: // Auto
      default:
        break;
    }
    return null;
  }

  render() {
    const state = this.state;
    if (
      state.SystemMode === undefined ||
      state.CoolSetPoint === undefined ||
      state.HeatSetPoint === undefined ||
      state.AmbientTemperature === undefined
    ) {
      return <div style={this.style} />;
    }
    let hvacMode = "off",
      target = 0;

    switch (state.SystemMode) {
      case 0:
        if (state.Cooling) {
          hvacMode = "cooling";
        }
        target = state.CoolSetPoint;
        break;
      case 1:
        if (state.Heating) {
          hvacMode = "heating";
        }
        target = state.HeatSetPoint;
        break;
      default:
        hvacMode = "off";
        break;
    }

    const away = this.state.isAwayMode,
      ambient = state.AmbientTemperature,
      metric = Config.metric || false;

    return (
      <div style={this.style}>
        <div
          style={{
            textAlign: "center",
            marginTop: 0,
          }}
        >
          <div style={{ marginBottom: 4 }}>
            Zone {this.zone}: {this.name}
          </div>
          <Thermostat
            style={{ textAlign: "center " }}
            width="150px"
            height="150px"
            away={Boolean(away)}
            ambientTemperature={Locale.ftoc(target, metric)}
            targetTemperature={Locale.ftoc(ambient, metric)}
            hvacMode={hvacMode}
            leaf={state.FeelsLikeEnabled}
          />
          {this.renderNumberField(target, metric)}
        </div>
      </div>
    );
  }
}

//
export default iComfortTile;
