import React from "react";
import { Table } from "react-bootstrap";
//import Clock from "Common/Clock";
import Temperature from "Common/Temperature";
import Speed from "Common/Speed";

import MQTT from "lib/MQTT";
import { data as Config } from "lib/Config";

import {
  FaUmbrella,
  FaWind,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";

import { BsDropletHalf } from "react-icons/bs";

class WeatherTab extends React.Component {
  constructor(props) {
    super();
    console.log("weathertab", props);
    this.location = props.location;
    this.city = this.location.name;
    this.zip = props.location.device;
    this.state = {};

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

        <div style={{ float: "left", textAlign: "center", marginLeft: 20 }}>
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

        <div style={{ float: "right", marginTop: 4 }}>
          <div style={{ fontSize: iconSize, textShadow: "2px 2px black" }}>
            <FaUmbrella style={{ marginTop: -4 }} />{" "}
            {thisHour.precipitationProbability} %
          </div>
          <div
            style={{
              fontSize: iconSize,
              textShadow: "2px 2px black",
              marginTop: marginTop,
            }}
          >
            <FaWind style={{ marginTop: -4 }} /> {thisHour.windDescShort}{" "}
            <Speed value={thisHour.windSpeed} />
          </div>
          <div
            style={{
              fontSize: iconSize,
              textShadow: "2px 2px black",
              marginTop: marginTop,
            }}
          >
            <BsDropletHalf style={{ marginTop: -4 }} /> {thisHour.humidity}%
          </div>
        </div>
        <div style={{ clear: "both" }} />
      </div>
    );
  }

  renderForecast() {
    const { weekly } = this.state;
    console.log("weekly", weekly);
    let key = 0;
    return (
      <Table striped style={{ marginTop: 30, fontSize: 24 }}>
        <tbody>
          {Object.keys(weekly).map((ndx) => {
            const day = weekly[ndx];
            return (
              <tr key={++key}>
                <td>{day.weekday}</td>
                <td>
                  <img
                    style={{ width: 48, height: "auto" }}
                    src={day.iconLink}
                    alt={day.iconLink}
                  />
                </td>
                <td>
                  <Temperature value={parseInt(day.highTemperature, 10)} />
                </td>
                <td>
                  <Temperature value={parseInt(day.lowTemperature, 10)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
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
      <div style={{ padding: 8 }}>
        {this.renderDetails(index)}
        {this.renderForecast()}
      </div>
    );
  }
}

//
export default WeatherTab;
