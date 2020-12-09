import React from "react";

import MQTT from "lib/MQTT";

import Temperature from "Common/Temperature";

import { data as Config } from "lib/Config";

class WeatherTile extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = { weather: null };

    //
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
  }

  handleWeatherMessage(topic, message) {
    this.setState({ weather: message });
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
    const weather = this.state.weather;
    if (!weather) {
      return null;
    }
    return (
      <>
        <div style={{ fontSize: 20 }}>
          <img src={weather.iconLink} alt={weather.iconName}/>
          {weather.description} <Temperature value={weather.temperature} />
        </div>
        <div className="float-right">
          {" High"} <Temperature value={weather.highTemperature} /> / {" Low"}{" "}
          <Temperature value={weather.lowTemperature} />
        </div>
      </>
    );
  }
}

//
export default WeatherTile;
