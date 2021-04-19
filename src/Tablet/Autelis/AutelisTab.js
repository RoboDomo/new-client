import React from "react";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

import { data as Config } from "lib/Config";

import MacroTile from "../Dashboard/Tiles/MacroTile";
import Temperature from "Common/Temperature";
import NumberField from "Common/Form/NumberField";
import Clock from "Common/Clock";
import Locale from "lib/Locale";

import { ButtonGroup, Button, Row, Col } from "react-bootstrap";

class AutelisTab extends React.Component {
  constructor(props) {
    super();

    this.topics = [
      "pump",
      "cleaner",
      "solarHeat",
      "solarTemp",
      "waterfall",
      "poolLight",
      "poolTemp",
      "poolHeat",
      "poolSetpoint",
      "spaLight",
      "spa",
      "spaTemp",
      "spaHeat",
      "spaSetpoint",
      "jet",
      "blower",
    ];

    this.status = "autelis/status/";

    this.state = {};

    //
    this.handleAutelisMessage = this.handleAutelisMessage.bind(this);
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
  }

  dispatch({ type, value }) {
    const key = Config.autelis.deviceMap.forward[type];
    switch (type) {
      case "spaSetpoint":
      case "poolSetpoint":
        MQTT.publish(`autelis/set/${key}`, Number(value));
        break;
      default:
        MQTT.publish(`autelis/set/${key}`, value ? "on" : "off");
        break;
    }
  }

  handleAutelisMessage(topic, message) {
    const k = topic.split("/").pop();
    const key = Config.autelis.deviceMap.backward[k];

    switch (key) {
      case "pump":
        this.setState({ pump: isOn(message) });
        break;
      case "poolTemp":
        this.setState({ poolTemp: Number(message) });
        break;
      case "poolSetpoint":
        this.setState({ poolSetpoint: Number(message) });
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
      case "spa":
        this.setState({ spa: isOn(message) });
        break;
      case "spaTemp":
        this.setState({ spaTemp: Number(message) });
        break;
      case "spaSetpoint":
        this.setState({ spaSetpoint: Number(message) });
        break;
      case "spaHeat":
        this.setState({ spaHeat: isOn(message) });
        break;
      case "jet":
        this.setState({ jet: isOn(message) });
        break;
      case "blower":
        this.setState({ blower: isOn(message) });
        break;
      case "spaLight":
        this.setState({ spaLight: isOn(message) });
        break;
      default:
        console.log(
          `autelis message invalid "${topic}" "${key}"`,
          Config.autelis.deviceMap.backward
        );
        break;
    }
  }

  handleWeatherMessage(topic, message) {
    this.setState({ now: message, display_city: message.city });
  }

  componentDidMount() {
    const forward = Config.autelis.deviceMap.forward;
    for (const topic of this.topics) {
      MQTT.subscribe(this.status + forward[topic], this.handleAutelisMessage);
    }
    MQTT.subscribe(
      `weather/${Config.autelis.location}/status/observation`,
      this.handleWeatherMessage
    );
  }

  componentWillUnmount() {
    const forward = Config.autelis.deviceMap.forward;
    for (const topic of this.topics) {
      MQTT.unsubscribe(this.status + forward[topic], this.handleAutelisMessage);
    }
    MQTT.unsubscribe(
      `weather/${Config.autelis.location}/status/observation`,
      this.handleWeatherMessage
    );
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  render() {
    const metric = Config.metric;

    const {
      pump,
      cleaner,
      solarHeat,
      solarTemp,
      waterfall,
      poolLight,
      poolTemp,
      poolHeat,
      poolSetpoint,
      spaLight,
      spa,
      spaTemp,
      spaHeat,
      spaSetpoint,
      jet,
      blower,
      now,
      display_city,
    } = this.state;

    if (!now) {
      return null;
    }

    const poolOn = !spa && pump,
      spaOn = spa && pump,
      solarOn = solarHeat && pump;

    const sunrise = new Date(now.sunrise * 1000)
        .toLocaleTimeString()
        .replace(":00 ", " "),
      sunset = new Date(now.sunset * 1000)
        .toLocaleTimeString()
        .replace(":00 ", " "),
      img = now.iconLink ? (
        <img
          alt={now.iconName}
          style={{
            paddingBottom: 0,
            width: 64,
            height: 64,
          }}
          src={now.iconLink}
        />
      ) : null;

    const renderWeather = () => {
      return (
        <div style={{ fontSize: 36, display: "flex", justifyContent: "end" }}>
          <div style={{ flex: 0.3 }}>
            <Clock />
          </div>
          <div style={{ fontSize: 18, flex: 0.3 }}>
            <div>Sunrise: {sunrise}</div>
            <div>Sunset: {sunset}</div>
          </div>
          <div style={{ fontSize: 38, flex: 1 }}>
            {display_city} {img} <Temperature value={now.temperature} />
          </div>
        </div>
      );
    };

    const renderMainSwitch = () => {
      const renderOffButton = () => {
        return (
          <Button
            variant={!poolOn && !spaOn ? "dark" : undefined}
            onClick={() => {
              if (poolOn) {
                this.dispatch({ type: "pump", value: false });
              } else if (spaOn) {
                this.dispatch({ type: "spa", value: false });
              }
              if (cleaner) {
                this.dispatch({ type: "cleaner", value: false });
              }
              if (solarOn) {
                this.dispatch({ type: "solarHeat", value: false });
              }
            }}
          >
            OFF
          </Button>
        );
      };

      const renderPoolButton = () => {
        return (
          <Button
            variant={poolOn ? "success" : undefined}
            onClick={() => {
              if (!poolOn) {
                if (!pump) {
                  this.dispatch({ type: "pump", value: true });
                }
                this.dispatch({ type: "spa", value: false });
              }
            }}
          >
            POOL
          </Button>
        );
      };

      const renderSpaButton = () => {
        return (
          <Button
            variant={spaOn ? "danger" : undefined}
            onClick={() => {
              if (!spaOn) {
                if (!pump) {
                  this.dispatch({ type: "pump", value: true });
                }
                this.dispatch({ type: "spa", value: true });
              }
            }}
          >
            SPA
          </Button>
        );
      };

      const renderTemp = () => {
        if (poolOn) {
          return (
            <>
              Pool <Temperature value={poolTemp} />
            </>
          );
        } else if (spaOn) {
          return (
            <>
              Spa <Temperature value={spaTemp} />
            </>
          );
        } else {
          return <>All Off</>;
        }
      };

      return (
        <div
          style={{
            display: "flex",
          }}
        >
          <ButtonGroup style={{ flex: 1 }}>
            {renderOffButton()}
            {renderPoolButton()}
            {renderSpaButton()}
          </ButtonGroup>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 44,
            }}
          >
            {renderTemp()}
          </div>
        </div>
      );
    };

    const renderSolar = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={solarOn ? "success" : undefined}
              onClick={() => {
                if (!solarOn) {
                  this.dispatch({ type: "solarHeat", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!solarOn ? "dark" : undefined}
              onClick={() => {
                if (solarOn) {
                  this.dispatch({ type: "solarHeat", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 36,
            }}
          >
            Solar <Temperature value={solarTemp} />
          </div>
        </div>
      );
    };

    const renderCleaner = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={cleaner ? "success" : undefined}
              onClick={() => {
                if (!cleaner) {
                  this.dispatch({ type: "cleaner", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!cleaner ? "dark" : undefined}
              onClick={() => {
                if (cleaner) {
                  this.dispatch({ type: "cleaner", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 36,
            }}
          >
            Cleaner
          </div>
        </div>
      );
    };

    const renderWaterfall = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Waterfall
          </div>
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={waterfall ? "success" : undefined}
              onClick={() => {
                if (!waterfall) {
                  this.dispatch({ type: "waterfall", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!waterfall ? "dark" : undefined}
              onClick={() => {
                if (waterfall) {
                  this.dispatch({ type: "waterfall", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
        </div>
      );
    };

    const renderPoolLight = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Pool Light
          </div>
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={poolLight ? "success" : undefined}
              onClick={() => {
                if (!poolLight) {
                  this.dispatch({ type: "poolLight", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!poolLight ? "dark" : undefined}
              onClick={() => {
                if (poolLight) {
                  this.dispatch({ type: "poolLight", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
        </div>
      );
    };

    const renderPoolHeater = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Pool Heat
          </div>
          <div style={{ flex: 0.6, display: "flex" }}>
            <ButtonGroup style={{ flex: 1 }}>
              <Button
                variant={poolHeat ? "danger" : undefined}
                onClick={() => {
                  if (!poolHeat) {
                    if (spaHeat) {
                      this.dispatch({ type: "spaHeat", value: false });
                    }
                    this.dispatch({ type: "poolHeat", value: true });
                  }
                }}
              >
                On
              </Button>
              <Button
                variant={!poolHeat ? "dark" : undefined}
                onClick={() => {
                  if (poolHeat) {
                    this.dispatch({ type: "poolHeat", value: false });
                  }
                }}
              >
                Off
              </Button>
            </ButtonGroup>
          </div>
          <div syle={{ flex: 0.2 }}>
            <NumberField
              name="poolSetpoint"
              value={Locale.ftoc(poolSetpoint || 72, metric)}
              step={metric ? 0.1 : 1}
              onValueChange={(newValue) => {
                this.dispatch({
                  type: "poolSetpoint",
                  value: Locale.ctof(newValue, metric),
                });
              }}
            />
          </div>
        </div>
      );
    };

    const renderSpaHeater = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <div style={{ flex: 0.6, display: "flex" }}>
            <ButtonGroup style={{ flex: 1 }}>
              <Button
                variant={spaHeat ? "danger" : undefined}
                onClick={() => {
                  if (!spaHeat) {
                    if (!spa) {
                      this.dispatch({ type: "spa", value: true });
                    }
                    this.dispatch({ type: "spaHeat", value: true });
                  }
                }}
              >
                On
              </Button>
              <Button
                variant={!spaHeat ? "dark" : undefined}
                onClick={() => {
                  if (spaHeat) {
                    this.dispatch({ type: "spaHeat", value: false });
                  }
                }}
              >
                Off
              </Button>
            </ButtonGroup>
          </div>
          <div syle={{ flex: 0.2 }}>
            <NumberField
              name="spaSetpoint"
              value={Locale.ftoc(spaSetpoint || 90, metric)}
              step={metric ? 0.1 : 1}
              onValueChange={(newValue) => {
                this.dispatch({
                  type: "spaSetpoint",
                  value: Locale.ctof(newValue, metric),
                });
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Spa Heat
          </div>
        </div>
      );
    };

    const renderSpaLight = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={spaLight ? "success" : undefined}
              onClick={() => {
                if (!spaLight) {
                  this.dispatch({ type: "spaLight", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!spaLight ? "dark" : undefined}
              onClick={() => {
                if (spaLight) {
                  this.dispatch({ type: "spaLight", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Spa Light
          </div>
        </div>
      );
    };

    const renderJets = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={jet ? "success" : undefined}
              onClick={() => {
                if (!jet) {
                  this.dispatch({ type: "jet", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!jet ? "dark" : undefined}
              onClick={() => {
                if (jet) {
                  this.dispatch({ type: "jet", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Jets
          </div>
        </div>
      );
    };

    const renderBlower = () => {
      return (
        <div
          style={{
            display: "flex",
            marginTop: 8,
          }}
        >
          <ButtonGroup style={{ flex: 1 }}>
            <Button
              variant={blower ? "success" : undefined}
              onClick={() => {
                if (!blower) {
                  this.dispatch({ type: "blower", value: true });
                }
              }}
            >
              On
            </Button>
            <Button
              variant={!blower ? "dark" : undefined}
              onClick={() => {
                if (blower) {
                  this.dispatch({ type: "blower", value: false });
                }
              }}
            >
              Off
            </Button>
          </ButtonGroup>
          <div
            style={{
              textAlign: "center",
              flex: 0.6,
              fontSize: 24,
            }}
          >
            Blower
          </div>
        </div>
      );
    };

    return (
      <>
        <div style={{ margin: 8 }}>
          <div style={{ marginLeft: 60 }}>
            {renderWeather()}
            {renderMainSwitch()}
            {renderSolar()}
            {renderCleaner()}
          </div>
          <Row style={{ marginTop: 10 }}>
            <Col sm={6}>
              {renderPoolHeater()}
              {renderPoolLight()}
              {renderWaterfall()}
            </Col>
            <Col sm={6}>
              {renderSpaHeater()}
              {renderJets()}
              {renderSpaLight()}
              {renderBlower()}
            </Col>
          </Row>
          <Row
            style={{
              textAlign: "center",
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <MacroTile label="Warm Spa" name="Warm Spa" width={1} />
            <MacroTile label="Enter Spa" name="Enter Spa" width={1} />
            <MacroTile label="Exit Spa" name="Exit Spa" width={1} />
            <MacroTile label="Spa Off" name="Spa Off" width={1} />
          </Row>
        </div>
      </>
    );
  }
}

//
export default AutelisTab;
