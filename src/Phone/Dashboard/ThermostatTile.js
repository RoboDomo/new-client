import React from "react";

import { CgThermostat } from "react-icons/cg";

import MQTT from "lib/MQTT";
import Temperature from "Common/Temperature";

import { data as Config } from "lib/Config";

class ThermostatTile extends React.Component {
  constructor(props) {
    super(props);
    const tile = props.tile;
    this.zone = tile.zone;
    this.state = {
      tile: tile,
      type: tile.type,
      device: tile.device,
      zone: tile.zone,
      name: tile.name,
    };

    this.handleThermostatMessage = this.handleThermostatMessage.bind(this);
  }

  handleThermostatMessage(topic, message) {
    this.setState({ data: message });
  }

  componentDidMount() {
    MQTT.subscribe(
      `icomfort/zone${this.zone}/status/data`,
      this.handleThermostatMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `icomfort/zone${this.zone}/status/data`,
      this.handleThermostatMessage
    );
  }

  render() {
    const data = this.state.data;
    if (!data) {
      return null;
    }

    const zoneDetail = data.zoneDetail;

    const renderSystemMode = () => {
      const metric = Config.metric;
      switch (zoneDetail.SystemMode) {
        case 0:
          return (
            <div style={{ fontSize: 18 }}>
              <span>
                A/C set to{" "}
                <Temperature
                  metric={metric}
                  value={zoneDetail.CoolSetPoint.Value}
                />
              </span>
              <div className="float-right">
                Feels like{" "}
                <Temperature
                  metric={metric}
                  value={zoneDetail.AmbientTemperature.Value}
                />
              </div>
            </div>
          );
        case 1:
          return (
            <div style={{ fontSize: 18 }}>
              <span>
                Heat set to{" "}
                <Temperature
                  metric={metric}
                  value={zoneDetail.HeatSetPoint.Value}
                />
              </span>
              <div className="float-right">
                Feels like{" "}
                <Temperature
                  metric={metric}
                  value={zoneDetail.AmbientTemperature.Value}
                />
              </div>
            </div>
          );
        default:
          return (
            <div style={{ fontSize: 18 }}>
              <div>System Off</div>
            </div>
          );
      }
    };

    let color = undefined;
    if (zoneDetail.Cooling) {
      color = "blue";
    } else if (zoneDetail.Heating) {
      color = "red";
    }

    return (
      <div
        style={{
          marginLeft: -20,
          marginRight: -20,
          marginTop: -12,
          marginBottom: -12,
          /* paddingRight: 12, */
          paddingLeft: 20,
          backgroundColor: color,
        }}
      >
        <div
          style={{
            paddingLeft: 8,
            paddingRight: 20,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <CgThermostat
            style={{
              marginTop: -4,
              marginLeft: 6,
              marginRight: 12,
              fontSize: 24,
            }}
          />
          <span>{zoneDetail.Name} Thermostat</span>
          <div style={{ marginLeft: 12 }}>{renderSystemMode()}</div>
        </div>
      </div>
    );
  }
}

//
export default ThermostatTile;
