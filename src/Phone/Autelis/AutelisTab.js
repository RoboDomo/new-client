import React from "react";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

import { data as Config } from "lib/Config";

import Temperature from "Common/Temperature";
import NumberField from "Common/Form/NumberField";
import Clock from "Common/Clock";
import Locale from "lib/Locale";

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
        <div>
          <div style={{ fontSize: 38, flex: 1 }}>
            {display_city} {img} <Temperature value={now.temperature} />
          </div>
          <div style={{ fontSize: 18, flex: 0.3 }}>
            <div style={{float: "left", fontSize: 30}}><Clock /></div>
            <div style={{float: "right"}}>
              <span>Sunrise: {sunrise}</span><br/>
            <span>Sunset: {sunset}</span>
          </div>
          </div>
        </div>
      );
    };

    return <div>{renderWeather()}</div>;
  }
}

//
export default AutelisTab;
