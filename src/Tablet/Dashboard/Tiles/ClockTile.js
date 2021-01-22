import React from "react";
import styles from "./styles";

import Clock from "Common/Clock";
// import { data as Config} from "lib/Config";
import MQTT from "lib/MQTT";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class ClockTile extends React.Component {
  constructor(props) {
    super();
    this.style = styles.tile(2, 2);
    this.tile = props.tile;
    this.state = {
      date: new Date(),
      weather: null,
    };

    this.handleWeather = this.handleWeather.bind(this);
  }

  handleWeather(topic, message) {
    this.setState({ weather: message });
  }

  componentDidMount() {
    MQTT.subscribe("weather/92211/status/astronomy", this.handleWeather);
  }

  componentWillUnmount() {
    MQTT.unsubscribe("weather/92211/status/astronomy", this.handleWeather);
  }

  renderWeather() {
    const { weather } = this.state;
    if (!weather) {
      return null;
    }

    const sunrise = new Date(weather.sunrise * 1000)
        .toLocaleTimeString()
        .replace(":00 ", " "),
      sunset = new Date(weather.sunset * 1000)
        .toLocaleTimeString()
        .replace(":00 ", " ");

    return (
      <>
        <div>Sunrise: {sunrise}</div>
        <div>Sunset: {sunset}</div>
      </>
    );
  }

  renderPresence() {
    const presence = this.tile.presence || [];
    if (presence.length === 0) {
      return null;
    }

    return (
      <>
        {presence.map((person) => {
          const home = this.state[person];
          return (
            <div style={{ color: !home ? "red" : undefined }}>
              {person} {home ? "HOME" : "AWAY"}
            </div>
          );
        })}
      </>
    );
  }
  render() {
    const date = new Date();

    return (
      <div style={this.style}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginTop: 20, fontSize: 20 }}>
            {dayNames[date.getDay()]} {date.toLocaleDateString()}
          </div>
          <div style={{ fontSize: 64, fontWeight: "bold", width: "100%" }}>
            <Clock ampm={false} military={false} seconds="small" />
          </div>
          {this.renderWeather()}
          {this.renderPresence()}
          <div style={{ fontSize: 8 }}>
            {window.innerWidth} x {window.innerHeight}
          </div>
        </div>
      </div>
    );
  }
}

//
export default ClockTile;
