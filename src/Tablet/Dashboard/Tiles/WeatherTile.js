import React from "react";
import styles from "./styles";
import { FaFlag } from "react-icons/fa";

import MQTT from "lib/MQTT";
import Temperature from "Common/Temperature";
import Speed from "Common/Speed";

import { data as Config } from "lib/Config";

class WeatherTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(2, 2);
    this.location = props.tile.location;
    this.loc = (() => {
      let default_location = null;
      for (const location of Config.weather.locations) {
        if (this.location === location.device) {
          return location;
        }
        if (location.default) {
          default_location = location;
        }
      }

      return default_location || Config.weather.locations[0];
    })();
    this.metric = Config.metric;

    this.state = { now: null };
    // console.log(
    //   "weather tile",
    //   this.location,
    //   this.metric ? "metric" : "us",
    //   this.loc
    // );

    //
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
  }

  handleWeatherMessage(topic, message) {
    // console.log("weather", new Date(message.utcTime * 1000).toLocaleTimeString(), message);
    this.setState({ now: message });
  }

  componentDidMount() {
    MQTT.subscribe(
      `weather/${this.location}/status/observation`,
      this.handleWeatherMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `weather/${this.location}/status/observation`,
      this.handleWeatherMessage
    );
  }

  render() {
    const now = this.state.now;
    if (!now) {
      // return null;
      return <div style={this.style} />;
    }
    const when = new Date(Number(now.utcTime) * 1000).toLocaleTimeString();
    return (
      <div style={this.style}>
        <div
          style={{ textAlign: "center", marginRight: 10, marginTop: 20 }}
          onClick={() => {
            /* localStorage.setItem("autelis-radio", "pool"); */
            window.location.hash = "weather";
          }}
        >
          <div>{now.city}</div>
          <div>{now.description}</div>
          <div
            style={{
              fontSize: 32,
              height: 72,
            }}
          >
            <img
              alt={now.iconName}
              style={{
                verticalAlign: "bottom",
                width: 80,
                height: 80,
              }}
              src={now.iconLink}
            />
            <div style={{ display: "inline" }}>
              <span
                style={{
                  fontSize: 44,
                }}
              >
                <Temperature value={now.temperature} />
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Temperature value={now.highTemperature} /> /{" "}
            <Temperature value={now.lowTemperature} />
          </div>
          <div
            style={{
              fontSize: 24,
              marginTop: 5,
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            <FaFlag style={{ fontSize: 32 }} /> {now.windDescShort}{" "}
            <Speed value={now.windSpeed} />
          </div>
          <div>{when}</div>
        </div>
      </div>
    );
    // return <div style={this.style}>Weather</div>;
  }
}

//
export default WeatherTile;
