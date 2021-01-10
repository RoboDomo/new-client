import React from "react";

import Temperature from "Common/Temperature";

import Locale from "lib/Locale";
import MQTT from "lib/MQTT";

import {
  ButtonGroup,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import Thermostat from "react-nest-thermostat";
import { FaChevronUp, FaChevronDown, FaChevronRight } from "react-icons/fa";

import { data as Config } from "lib/Config";

class IComfortTab extends React.Component {
  constructor(props) {
    super(props);

    this.title = props.thermostat.title;
    this.weather = props.thermostat.weather;
    this.zone = props.thermostat.zone;

    this.state = {
      heatSetpoint: false,
      coolSetpoint: false,
      weather: null,
      homeName: "",
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

    const coolSetPoint = Number(zoneDetail.CoolSetPoint.Value),
      heatSetPoint = Number(zoneDetail.HeatSetPoint.Value);

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
      homeName: message.HomeName,
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

  render() {
    const {
      // thermostat,
      homeName,
      zoneDetail,
      weather,
      hvacMode,
      systemMode,
      coolSetPoint,
      heatSetPoint,
    } = this.state;

    // if (!thermostat || !weather) {
    if (!weather || !zoneDetail) {
      return null;
    }

    const ambient_temperature = Number(zoneDetail.AmbientTemperature.Value);
    let target = coolSetPoint;
    if (systemMode === "heating") {
      target = heatSetPoint;
    }

    const metric = Config.metric;
    const targetButton = (n) => {
      let icon = <FaChevronRight />,
        disabled = false;

      if (target > n) {
        icon = <FaChevronDown />;
      } else if (target < n) {
        icon = <FaChevronUp />;
      } else {
        icon = <FaChevronRight />;
        disabled = true;
      }
      return (
        <Button
          block
          disabled={disabled}
          onClick={() => this.setTargetTemperature(n)}
        >
          {icon} Set to <Temperature value={n} />
        </Button>
      );
    };

    const hvacModeChange = (mode) => {
      try {
        // dispatch({ type: "hvac_mode", value: mode });
      } catch (e) {}
    };

    const adjustTemperatureButton = (delta) => {
      const d = metric ? parseInt((10 * delta) / 1.8) / 10 : delta;
      return (
        <Button
          onClick={() => {
            this.adjustTargetTemperature(d);
          }}
        >
          {delta < 0 ? <FaChevronDown /> : <FaChevronUp />}
          {d}
        </Button>
      );
    };

    const renderAdjustTemperatureButtons = () => {
      if (systemMode === "off") {
        return <h1>Zone is OFF</h1>;
      }

      return (
        <ButtonGroup style={{ marginBottom: 8 }}>
          {adjustTemperatureButton(-3)}
          {adjustTemperatureButton(-2)}
          {adjustTemperatureButton(-1)}
          {adjustTemperatureButton(1)}
          {adjustTemperatureButton(2)}
          {adjustTemperatureButton(3)}
        </ButtonGroup>
      );
    };

    const renderTargets = () => {
      switch (systemMode) {
        case "off":
        default:
          return null;
        case "heating":
          return (
            <ButtonGroup vertical style={{ width: "100%" }}>
              {targetButton(78)}
              {targetButton(77)}
              {targetButton(76)}
              {targetButton(75)}
              {targetButton(74)}
              {targetButton(73)}
              {targetButton(72)}
              {targetButton(71)}
              {targetButton(70)}
              {targetButton(69)}
            </ButtonGroup>
          );
        case "cooling":
          return (
            <ButtonGroup vertical style={{ width: "100%" }}>
              {targetButton(82)}
              {targetButton(81)}
              {targetButton(80)}
              {targetButton(79)}
              {targetButton(78)}
              {targetButton(77)}
              {targetButton(76)}
              {targetButton(75)}
              {targetButton(74)}
              {targetButton(73)}
            </ButtonGroup>
          );
      }
    };

    const setSystemMode = (mode) => {
      MQTT.publish(`icomfort/zone${this.zone}/set/mode`, mode);
      this.setState({ systemMode: mode });
    };

    return (
      <Row style={{ marginTop: 6 }}>
        <Col sm={3}>
          <ListGroup>
            <ListGroupItem>
              Presence
              <span style={{ float: "right" }}>
                {zoneDetail.AwayModeEnabled ? "AWAY" : "HOME"}
              </span>
            </ListGroupItem>
            <ListGroupItem>
              Feels Like
              <span style={{ float: "right" }}>
                <Temperature value={ambient_temperature} />
              </span>
            </ListGroupItem>
            <ListGroupItem>
              Ambient Humidity
              <span style={{ float: "right" }}>
                {zoneDetail.HumidityDisplay}
              </span>
            </ListGroupItem>
            <ListGroupItem>
              System Mode
              <span style={{ float: "right" }}>{systemMode}</span>
            </ListGroupItem>
            <ListGroupItem>
              Operating State
              <span style={{ float: "right" }}>{hvacMode}</span>
            </ListGroupItem>
            <ListGroupItem>
              Fan
              <span style={{ float: "right" }}>
                {zoneDetail.isFanRunning ? "ON" : "OFF"}
              </span>
            </ListGroupItem>
          </ListGroup>

          {/* Weather */}
          <ListGroup>
            <h2 style={{ textAlign: "center", marginTop: 8 }}>Weather</h2>
            <div style={{ textAlign: "center" }}>
              {/* Conditions */}
              <img src={weather.iconLink} alt={weather.description} />
              {weather.description}
            </div>
            <ListGroupItem>
              Outside Temperature
              <span style={{ float: "right" }}>
                <Temperature value={weather.temperature} />
              </span>
            </ListGroupItem>
            <ListGroupItem>
              Outside Humidity
              <span style={{ float: "right" }}>{weather.humidity}%</span>
            </ListGroupItem>
            <ListGroupItem>
              {homeName}
              <span style={{ float: "right" }}>{this.weather}</span>
            </ListGroupItem>
            <ListGroupItem>
              Zone Name
              <span style={{ float: "right" }}>{zoneDetail.Name}</span>
            </ListGroupItem>
          </ListGroup>
        </Col>

        {/* THERMOSTAT */}
        <Col sm={6}>
          <div style={{ textAlign: "center" }}>
            <Thermostat
              style={{ textAlign: "center " }}
              width="400px"
              height="400px"
              away={Boolean(zoneDetail.AwayModeEnabled)}
              ambientTemperature={Locale.ftoc(target, metric)}
              targetTemperature={Locale.ftoc(ambient_temperature, metric)}
              hvacMode={hvacMode}
              leaf={zoneDetail.FeelsLikeEnabled}
            />
            <div style={{ height: 30 }} />
            {renderAdjustTemperatureButtons()}
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
        </Col>
        <Col sm={3}>
          <ListGroup>
            <ListGroupItem>
              Target Temperature
              <span style={{ float: "right" }}>
                <Temperature value={target} />
              </span>
            </ListGroupItem>
            {/* <ListGroupItem> */}
            {/*   Time To Target */}
            {/*   <span style={{ float: "right" }}> */}
            {/*     {thermostat.time_to_target} */}
            {/*   </span> */}
            {/* </ListGroupItem> */}
          </ListGroup>
          {renderTargets()}
        </Col>
      </Row>
    );
  }
  // console.log("render", title, weather, zone, this.state);
  // return <div>ICOMFORT TAB zone: {zone} weather: {weather}</div>;
}

//
export default IComfortTab;
