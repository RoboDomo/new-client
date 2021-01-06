// TODO shows on when spa is on

import React from "react";

import { FaSwimmingPool } from "react-icons/fa";

import { Row, Col } from "react-bootstrap";

import MQTT from "lib/MQTT";

import { isOn } from "lib/Utils";

import Temperature from "Common/Temperature";
import { data as Config } from "lib/Config";

class PoolTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.topic = "autelis/status/";
    //
    this.handleAutelisMessage = this.handleAutelisMessage.bind(this);
  }

  handleAutelisMessage(topic, message) {
    const key =
      Config.autelis.deviceMap.backward[topic.substr(this.topic.length)];
    switch (key) {
      case "pump":
        this.setState({ pump: isOn(message) });
        break;
      case "poolTemp":
        this.setState({ poolTemp: Number(message) });
        break;
      case "poolSetpoint":
        this.setState({ poolSetPoint: Number(message) });
        break;
      case "poolHeat":
        this.setState({ poolHeat: isOn(message) });
        break;
      case "poolLight":
        this.setState({ poolLight: isOn(message) });
        break;
      case "waterfall":
        this.setState({ waterfall: isOn(message) });
        break;
      case "cleaner":
        this.setState({ cleaner: isOn(message) });
        break;
      case "solarHeat":
        this.setState({ solarHeat: isOn(message) });
        break;
      case "solarTemp":
        this.setState({ solarTemp: Number(message) });
        break;
      default:
        console.log("autelisMessage invalid device", key);
        break;
    }
  }

  componentDidMount() {
    const forward = Config.autelis.deviceMap.forward;
    MQTT.subscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.poolTemp, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.cleaner, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.waterfall, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.poolHeat, this.handleAutelisMessage);
    MQTT.subscribe(
      this.topic + forward.poolSetpoint,
      this.handleAutelisMessage
    );
    MQTT.subscribe(this.topic + forward.solarHeat, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.solarTemp, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.poolLight, this.handleAutelisMessage);
  }

  componentWillUnmount() {
    const forward = Config.autelis.deviceMap.forward;
    MQTT.unsubscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.poolTemp, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.cleaner, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.waterfall, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.poolHeat, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.solarHeat, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.solarTemp, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.poolLight, this.handleAutelisMessage);
  }

  render() {
    const metric = Config.metric;
    const {
      pump,
      poolTemp,
      cleaner,
      solarHeat,
      solarTemp,
      poolLight,
      waterfall,
      poolHeat,
    } = this.state;
    const on = isOn(poolLight) || isOn(waterfall);

    let backgroundColor = undefined;
    if (isOn(poolHeat)) {
      backgroundColor = "red";
    } else if (isOn(pump)) {
      backgroundColor = "green";
    } else if (on) {
      backgroundColor = "red";
    }

    const renderCleaner = () => {
      if (!isOn(cleaner)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>Cleaner is ON</div>
          </Col>
        </Row>
      );
    };

    const renderSolar = () => {
      if (!isOn(solarHeat)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>
              Solar temperature{" "}
              <Temperature metric={metric} value={solarTemp} />
            </div>
          </Col>
        </Row>
      );
    };

    const renderWaterfall = () => {
      if (!isOn(waterfall)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>Waterfall is ON</div>
          </Col>
        </Row>
      );
    };

    const renderLight = () => {
      if (!isOn(poolLight)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>Light is on</div>
          </Col>
        </Row>
      );
    };

    const renderInfo = () => {
      if (pump) {
        return (
          <>
            <Row>
              <Col xs={8}>
                <FaSwimmingPool
                  style={{
                    marginTop: -4,
                    marginLeft: 6,
                    marginRight: 8,
                    fontSize: 24,
                  }}
                />
                <span> Pool On</span>
              </Col>
              <Col xs={4}>
                <div style={{ textAlign: "right" }}>
                  <Temperature metric={metric} value={poolTemp} />
                </div>
              </Col>
            </Row>
          </>
        );
      }
      return (
        <div>
          <FaSwimmingPool
            style={{
              marginTop: -4,
              marginLeft: 6,
              marginRight: 8,
              fontSize: 24,
            }}
          />
          Pool is OFF
        </div>
      );
    };

    return (
      <div
        style={{
          marginLeft: -20,
          marginRight: -20,
          marginTop: -12,
          marginBottom: -12,
          backgroundColor: backgroundColor,
        }}
      >
        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          {renderInfo()}
          {renderCleaner()}
          {renderSolar()}
          {renderWaterfall()}
          {renderLight()}
        </div>
      </div>
    );
  }
}

//
export default PoolTile;
