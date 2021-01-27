import React from "react";

import {
  FaUmbrella,
  FaWind,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";

import { BsDropletHalf } from "react-icons/bs";

import MQTT from "lib/MQTT";

import Speed from "Common/Speed";
import Temperature from "Common/Temperature";

import { data as Config } from "lib/Config";

class WeatherTile extends React.Component {
  constructor(props) {
    super(props);
    this.location = props.tile.location;
    this.zip = this.location;
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
    if (~topic.indexOf("weekly")) {
      this.setState({ weekly: message });
    } else if (~topic.indexOf("observation")) {
      console.log("observation", message);
      this.setState({ now: message });
    } else if (~topic.indexOf("astronomy")) {
      this.setState({ astronomy: message });
    } else if (~topic.indexOf("hourly")) {
      //      for (const hour of message) {
      //        console.log(
      //          "hourly",
      //          new Date(hour.utcTime * 1000).toLocaleTimeString(),
      //          hour.temperature,
      //          hour
      //        );
      //      }
      this.setState({ hourly: message });
    }
  }

  componentDidMount() {
    const zip = this.zip;
    const status_topic = `${Config.mqtt.weather}/${zip}/status/`;
    if (zip) {
      MQTT.subscribe(status_topic + "weekly", this.handleWeatherMessage);
      MQTT.subscribe(status_topic + "observation", this.handleWeatherMessage);
      MQTT.subscribe(status_topic + "astronomy", this.handleWeatherMessage);
      MQTT.subscribe(status_topic + "hourly", this.handleWeatherMessage);
      MQTT.subscribe(status_topic + "display_city", this.handleWeatherMessage);
    }
  }

  componentWillUnmount() {
    const zip = this.zip;
    const status_topic = `${Config.mqtt.weather}/${zip}/status/`;
    if (zip) {
      MQTT.unsubscribe(status_topic + "weekly", this.handleWeatherMessage);
      MQTT.unsubscribe(status_topic + "observation", this.handleWeatherMessage);
      MQTT.unsubscribe(status_topic + "astronomy", this.handleWeatherMessage);
      MQTT.unsubscribe(status_topic + "hourly", this.handleWeatherMessage);
      MQTT.unsubscribe(
        status_topic + "display_city",
        this.handleWeatherMessage
      );
    }
  }

  renderTemperature() {
    const { now } = this.state;

    return (
      <>
        <div
          style={{
            fontSize: 36,
            //            lineHeight: "110px",
            textShadow: "2px 2px black",
            color: "white",
          }}
        >
          <Temperature value={now.temperature} />
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "bottom",
            textShadow: "2px 2px black",
          }}
        >
          <FaArrowCircleUp style={{ marginTop: -8 }} />{" "}
          <Temperature value={now.highTemperature} />
          &nbsp; &nbsp;
          <FaArrowCircleDown style={{ marginTop: -8 }} />{" "}
          <Temperature value={now.lowTemperature} />
        </div>
        <div
          style={{
            fontSize: 14,
            textShadow: "2px 2px black",
          }}
        >
          Feels like <Temperature value={now.comfort} />
        </div>
      </>
    );
  }

  renderDetails(index) {
    const { hourly, now } = this.state,
      thisHour = hourly[index];

    console.log("thisHour", thisHour);
    const marginTop = 1,
      iconSize = 16;

    return (
      <div>
        <div style={{ float: "left" }}>{this.renderTemperature()}</div>

        <div style={{ float: "left", textAlign: "center", marginLeft: 10 }}>
          <img
            src={now.iconLink}
            alt={now.iconLink}
            style={{
              width: 64,
              height: 64,
              textShadow: "2px 2px black",
            }}
          />
          <div
            style={{
              marginTop: -4,
              fontSize: 18,
              textShadow: "2px 2px black",
            }}
          >
            {now.skyDescription}
          </div>
        </div>

        <div style={{ float: "right", marginLeft: 10, marginTop: 4 }}>
          <div style={{ fontSize: iconSize, textShadow: "2px 2px black" }}>
            <FaUmbrella style={{ marginTop: -4 }} />{" "}
            {thisHour.precipitationProbability} %
          </div>
          <div style={{ fontSize: iconSize, textShadow: "2px 2px black", marginTop: marginTop }}>
            <FaWind style={{ marginTop: -4 }} /> {thisHour.windDescShort}{" "}
            <Speed value={thisHour.windSpeed} />
          </div>
          <div style={{ fontSize: iconSize, marginTop: marginTop, textShadow: "2px 2px black" }}>
            <BsDropletHalf style={{ marginTop: -4 }} /> {thisHour.humidity}%
          </div>
        </div>
        <div style={{ clear: "both" }} />
      </div>
    );
  }
  render() {
    const { hourly, weekly, now } = this.state;

    if (!now || !weekly || !hourly) {
      return null;
    }

    const hour = new Date().getHours();
    let index;
    for (index = 0; index < hourly.length; index++) {
      const hour2 = new Date(hourly[index].utcTime * 1000).getHours();
      if (hour2 === hour) {
        break;
      }
    }
    return (
      <div
        onClick={() => {
          window.location.hash = "weather";
        }}
        style={{ padding: 8 }}
      >
        {this.renderDetails(index)}
      </div>
    );

    // const weather = this.state.weather;
    // if (!weather) {
    //   return null;
    // }
    // return (
    //   <>
    //     <div
    //       onClick={() => {
    //         window.location.hash = "weather";
    //       }}
    //       style={{ fontSize: 20 }}
    //     >
    //       <img src={weather.iconLink} alt={weather.iconName} />
    //       {weather.description} <Temperature value={weather.temperature} />
    //     </div>
    //     <div className="float-right">
    //       {" High"} <Temperature value={weather.highTemperature} /> / {" Low"}{" "}
    //       <Temperature value={weather.lowTemperature} />
    //     </div>
    //   </>
    // );
  }
}

//
export default WeatherTile;
