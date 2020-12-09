import React from "react";

import { FaSwimmingPool } from "react-icons/fa";

import { Row, Col } from "react-bootstrap";

import MQTT from "lib/MQTT";

import { isOn } from "lib/Utils";

import Temperature from "Common/Temperature";
import { data as Config } from "lib/Config";

class SpaTile extends React.Component {
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
      case "spaTemp":
        this.setState({ spaTemp: Number(message) });
        break;
      case "spaSetpoint":
        this.setState({ spaSetPoint: Number(message) });
        break;
      case "spaHeat":
        this.setState({ spaHeat: isOn(message) });
        break;
      case "spaLight":
        this.setState({ spaLight: isOn(message) });
        break;
      case "jet":
        this.setState({ jet: isOn(message) });
        break;
      case "blower":
        this.setState({ blower: isOn(message) });
        break;
      default:
        console.log("autelisMessage invalid device", key);
        break;
    }
  }

  componentDidMount() {
    const forward = Config.autelis.deviceMap.forward;
    MQTT.subscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaTemp, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaHeat, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.jet, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.blower, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaSetpoint, this.handleAutelisMessage);
    MQTT.subscribe(this.topic + forward.spaLight, this.handleAutelisMessage);
  }

  componentWillUnmount() {
    const forward = Config.autelis.deviceMap.forward;
    MQTT.unsubscribe(this.topic + forward.pump, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.spaTemp, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.spaHeat, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.jet, this.handleAutelisMessage);
    MQTT.unsubscribe(this.topic + forward.blower, this.handleAutelisMessage);
    MQTT.unsubscribe(
      this.topic + forward.spaSetpoint,
      this.handleAutelisMessage
    );
    MQTT.unsubscribe(this.topic + forward.spaLight, this.handleAutelisMessage);
  }

  render() {
    const metric = Config.metric;
    const { spa, spaHeat, spaTemp, spaLight, jet, blower } = this.state;

    const on = isOn(spaLight) || isOn(blower) || isOn(jet);

    let backgroundColor = undefined;
    if (isOn(spa) || on) {
      backgroundColor = "red";
    }

    const renderJets = () => {
      if (!isOn(jet)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>Jets are ON</div>
          </Col>
        </Row>
      );
    };

    const renderBlower = () => {
      if (!isOn(blower)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>Blower is ON</div>
          </Col>
        </Row>
      );
    };

    const renderLight = () => {
      if (!isOn(spaLight)) {
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

    const renderHeat = () => {
      if (!isOn(spaHeat)) {
        return null;
      }
      return (
        <Row>
          <Col xs={4}>
            <span> </span>
          </Col>
          <Col xs={8}>
            <div style={{ textAlign: "right" }}>
              Heat is on (<Temperature value={spaTemp} metric={metric} />)
            </div>
          </Col>
        </Row>
      );
    };

    const renderInfo = () => {
      if (spa) {
        return (
          <>
            <Row>
              <Col xs={8}>
                <FaSwimmingPool style={{ marginTop: -4, marginLeft: 6, marginRight: 8, fontSize: 24 }} />
                <span> Spa On</span>
              </Col>
              <Col xs={4}>
                <div style={{ textAlign: "right" }}>
                  <Temperature metric={metric} value={spaTemp} />
                </div>
              </Col>
            </Row>
          </>
        );
      } else {
        return <div>
                <FaSwimmingPool style={{ marginTop: -4, marginLeft: 6, marginRight: 8, fontSize: 24 }} />
                 Spa is OFF</div>;
      }
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
          {renderHeat()}
          {renderJets()}
          {renderBlower()}
          {renderLight()}
        </div>
      </div>
    );
  }
}

//
export default SpaTile;
