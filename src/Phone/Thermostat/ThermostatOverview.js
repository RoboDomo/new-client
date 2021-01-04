import React from "react";

import { Form, ListGroup, ButtonGroup, Button } from "react-bootstrap";
import Temperature from "Common/Temperature";
import NumberField from "Common/Form/NumberField";
import MQTT from "lib/MQTT";
import { data as Config } from "lib/Config";

const formatSystemMode = (mode) => {
  const systemModes = [
    /* 0 */ "A/C",
    /* 1 */ "HEAT",
    /* 2 */ "BOTH",
    /* 3 */ "EMERGENCY",
    /* 4 */ "OFF",
    /* 5 */ "OFFLINE",
    /* 6 */ "AUTO",
  ];
  if (systemModes[mode] !== undefined) {
    return systemModes[mode];
  }
  return "Offline";
};

const variantHvacMode = (hvacMode) => {
  switch (hvacMode.toLowerCase()) {
    case "cooling":
      return "blue";
    case "heating":
      return "orange";
    default:
      return "grey";
  }
};

const targetTemperature = (zoneDetail) => {
  let target = 0;

  switch (zoneDetail.SystemMode) {
    case 0:
      target = zoneDetail.CoolSetPoint.Value;
      break;
    case 1:
      target = zoneDetail.HeatSetPoint.Value;
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
    default:
      target = zoneDetail.AmbientTemperature.Value;
      break;
    case 5:
      break;
    case 6:
      break;
  }
  return target;
};

const hvacMode = (zoneDetail) => {
  let mode = "off";

  switch (zoneDetail.SystemMode) {
    case 0:
      mode = "Cooling";
      break;
    case 1:
      mode = "Heating";
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
    default:
      mode = "off";
      break;
    case 5:
      break;
    case 6:
      break;
  }

  return mode;
};

class ThermostatOverview extends React.Component {
  constructor(props) {
    super();
    this.state = {};
    //
    this.handleHvacMessage = this.handleHvacMessage.bind(this);
  }

  handleHvacMessage(topic, message) {
    if (~topic.indexOf("zone0")) {
      this.setState({ zone0: message });
    } else if (~topic.indexOf("zone1")) {
      this.setState({ zone1: message });
    } else if (~topic.indexOf("zone2")) {
      this.setState({ zone2: message });
    } else if (~topic.indexOf("zone3")) {
      this.setState({ zone3: message });
    }
  }

  componentDidMount() {
    for (const thermostat of Config.icomfort.thermostats) {
      MQTT.subscribe(
        `icomfort/zone${thermostat.zone}/status/data`,
        this.handleHvacMessage
      );
    }
  }

  componentWillUnmount() {
    for (const thermostat of Config.icomfort.thermostats) {
      MQTT.unsubscribe(
        `icomfort/zone${thermostat.zone}/status/data`,
        this.handleHvacMessage
      );
    }
  }

  renderButtons(zoneDetail) {
    const systemMode = hvacMode(zoneDetail);

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
    );
  }

  renderControls() {
    const { zone0, zone1, zone2, zone3 } = this.state;
    if (!zone0 || !zone1 || !zone2 || !zone3) {
      return null;
    }
    const setSystemMode = (mode) => {
      MQTT.publish(`icomfort/zone0/set/mode`, mode);
      MQTT.publish(`icomfort/zone1/set/mode`, mode);
      MQTT.publish(`icomfort/zone2/set/mode`, mode);
      MQTT.publish(`icomfort/zone3/set/mode`, mode);
    };

    const mode = zone0.zoneDetail.SystemMode,
      all =
        mode === zone1.zoneDetail.SystemMode &&
        mode === zone2.zoneDetail.SystemMode &&
        mode === zone3.zoneDetail.SystemMode;

    console.log("ALL", all, mode, zone1);
    return (
      <ButtonGroup type="radio" size="lg" name="hvac">
        <Button
          variant={all && mode === 4 ? "dark" : undefined}
          style={{ width: 85, fontSize: 14 }}
          onClick={() => {
            setSystemMode("off");
          }}
        >
          All Off
        </Button>
        <Button
          variant={all && mode === 1 ? "dark" : undefined}
          style={{ width: 85, fontSize: 14 }}
          onClick={() => {
            setSystemMode("heat");
          }}
        >
          All Heat
        </Button>
        <Button
          variant={all && mode === 0 ? "dark" : undefined}
          style={{ width: 85, fontSize: 14 }}
          onClick={() => {
            setSystemMode("cool");
          }}
        >
          All Cool
        </Button>
        <Button
          variant={all && mode === 2 ? "dark" : undefined}
          style={{ width: 110, fontSize: 14 }}
          onClick={() => {
            setSystemMode("both");
          }}
        >
          All Both
        </Button>
      </ButtonGroup>
    );
  }
  renderZone(num, zone) {
    const metric = Config.metric;

    const zoneDetail = zone.zoneDetail;
    if (!zoneDetail || !zoneDetail.AmbientTemperature) {
      return null;
    }

    const ambient = zoneDetail.AmbientTemperature,
      ambient_temperature = Number(ambient.Value);

    const target = targetTemperature(zoneDetail),
      hvac_mode = hvacMode(zoneDetail).toUpperCase();

    return (
      <ListGroup style={{ marginBottom: 10 }}>
        <ListGroup.Item style={{background: variantHvacMode(hvac_mode), color: "white" }}>
          Zone {num}
          <span style={{ float: "right" }}>{zoneDetail.Name}</span>
        </ListGroup.Item>
        <ListGroup.Item>
          Feels Like
          <span style={{ float: "right" }}>
            <Temperature
              value={zoneDetail.AmbientTemperature.Value}
              metric={metric}
            />
          </span>
        </ListGroup.Item>

        <ListGroup.Item>
          {hvac_mode === "OFF" ? (
            "SYSTEM OFF"
          ) : (
            <>
              {hvac_mode}
              <span style={{ float: "right" }}>
                <Temperature
                  value={targetTemperature(zoneDetail)}
                  metric={metric}
                />
              </span>
            </>
          )}
        </ListGroup.Item>
      </ListGroup>
    );
  }

  render() {
    const { zone0, zone1, zone2, zone3 } = this.state;
    if (!zone0 || !zone1 || !zone2 || !zone3) {
      return null;
    }

    return (
      <div style={{ marginTop: 10, padding: 8 }}>
        <div>{this.renderZone(0, zone0)}</div>
        <div>{this.renderZone(1, zone1)}</div>
        <div>{this.renderZone(2, zone2)}</div>
        <div>{this.renderZone(3, zone3)}</div>
        <div>{this.renderControls()}</div>
      </div>
    );
  }
}

//
export default ThermostatOverview;
