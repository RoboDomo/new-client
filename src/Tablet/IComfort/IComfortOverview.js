import React from "react";
import {
  Row,
  Col,
  ButtonGroup,
  Button,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import Thermostat from "react-nest-thermostat";
import { data as Config } from "lib/Config";

import MQTT from "lib/MQTT";
import Locale from "lib/Locale";

import Temperature from "Common/Temperature";

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
  switch (hvacMode) {
    case "cooling":
      return "info";
    case "heating":
      return "danger";
    default:
      return undefined;
  }
};

const hvacMode = (zoneDetail) => {
  let hvacMode = "off";

  switch (zoneDetail.SystemMode) {
    case 0:
      if (zoneDetail.Cooling) {
        hvacMode = "cooling";
      }
      break;
    case 1:
      if (zoneDetail.Heating) {
        hvacMode = "heating";
      }
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
    default:
      hvacMode = "off";
      break;
    case 5:
      break;
    case 6:
      break;
  }

  return hvacMode;
};

const targetTemperature = (zoneDetail) => {
  let target = 0;

  switch (zoneDetail.SystemMode) {
    case 0:
      target = zoneDetail.CoolSetPoint;
      break;
    case 1:
      target = zoneDetail.HeatSetPoint;
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
    default:
      target = zoneDetail.AmbientTemperature;
      break;
    case 5:
      break;
    case 6:
      break;
  }
  return target;
};

class IComfortOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    //
    this.handleHvacMessage = this.handleHvacMessage.bind(this);
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
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

  handleWeatherMessage(topic, message) {}

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

  renderZone(zone) {
    const zoneDetail = zone.zoneDetail;
    if (!zoneDetail || !zoneDetail.AmbientTemperature) {
      return null;
    }

    const ambient = zoneDetail.AmbientTemperature,
      ambient_temperature = Number(ambient);
    const metric = Config.metric;
    const target = targetTemperature(zoneDetail),
      system_mode = formatSystemMode(zoneDetail.SystemMode),
      hvac_mode = hvacMode(zoneDetail);

    return (
      <ListGroup>
        <ListGroupItem variant="dark">
          Zone
          <span style={{ float: "right" }}>{zoneDetail.Name}</span>
        </ListGroupItem>

        <ListGroupItem style={{ textAlign: "center" }}>
          <Thermostat
            width="140px"
            height="140px"
            away={Boolean(zoneDetail.AwayModeEnabled)}
            targetTemperature={Locale.ftoc(ambient_temperature, metric)}
            ambientTemperature={Locale.ftoc(target, metric)}
            hvacMode={hvac_mode}
            leaf={zoneDetail.FeelsLikeEnabled}
          />
        </ListGroupItem>

        <ListGroupItem variant={variantHvacMode(hvac_mode)}>
          System Mode
          <span style={{ float: "right" }}>{system_mode}</span>
        </ListGroupItem>

        <ListGroupItem>
          Cooling
          <span style={{ float: "right" }}>
            {zoneDetail.Cooling ? "YES" : "NO"}
          </span>
        </ListGroupItem>

        <ListGroupItem>
          Cool Set Point
          <span style={{ float: "right" }}>
            <Temperature value={Number(zoneDetail.CoolSetPoint)} />
          </span>
        </ListGroupItem>

        <ListGroupItem>
          Heating
          <span style={{ float: "right" }}>
            {zoneDetail.Heating ? "YES" : "NO"}
          </span>
        </ListGroupItem>

        <ListGroupItem>
          Heat Set Point
          <span style={{ float: "right" }}>
            <Temperature value={Number(zoneDetail.HeatSetPoint)} />
          </span>
        </ListGroupItem>

        <ListGroupItem>
          Fan
          <span style={{ float: "right" }}>
            {zoneDetail.isFanRunning ? "RUNNING" : "OFF"}
          </span>
        </ListGroupItem>

        <ListGroupItem>
          Feels Like
          <span style={{ float: "right" }}>
            <Temperature value={Number(zoneDetail.AmbientTemperature)} />
          </span>
        </ListGroupItem>
      </ListGroup>
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
  render() {
    const { zone0, zone1, zone2, zone3 } = this.state;
    if (!zone0 || !zone1 || !zone2 || !zone3) {
      return null;
    }

    return (
      <>
        <Row style={{ marginTop: 30, marginLeft: "5%", marginRight: "5%" }}>
          <Col>{this.renderZone(zone0)}</Col>
          <Col>{this.renderZone(zone1)}</Col>
          <Col>{this.renderZone(zone2)}</Col>
          <Col>{this.renderZone(zone3)}</Col>
        </Row>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          {this.renderControls()}
        </div>
      </>
    );
  }
}

//
export default IComfortOverview;
