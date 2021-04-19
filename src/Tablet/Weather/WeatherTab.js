import React from "react";

import { Row, Col } from "react-bootstrap";

import Clock from "Common/Clock";
import Temperature from "Common/Temperature";
import Speed from "Common/Speed";

import MQTT from "lib/MQTT";
import { data as Config } from "lib/Config";
// import Locale from "lib/Locale";

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
    this.location = props.location;
    this.zip = props.location.device;

    this.state = {};

    //
    this.handleWeatherMessage = this.handleWeatherMessage.bind(this);
  }

  handleWeatherMessage(topic, message) {
    if (~topic.indexOf("weekly")) {
      this.setState({ weekly: message });
    } else if (~topic.indexOf("observation")) {
      this.setState({ now: message });
    } else if (~topic.indexOf("astronomy")) {
      this.setState({ astronomy: message });
    } else if (~topic.indexOf("hourly")) {
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

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  renderDetails(index) {
    const { hourly, now } = this.state,
      thisHour = hourly[index];

    const marginTop = 4,
      iconSize = 22;

    return (
      <div style={{ display: "flex" }}>
        <div style={{ fontSize: 14, marginTop: 20 }}>
          <div style={{ fontSize: iconSize }}>
            <FaUmbrella />
          </div>
          <div>40%</div>
          <div style={{ fontSize: iconSize, marginTop: marginTop }}>
            <FaWind />
          </div>
          <div>
            {thisHour.windDescShort} <Speed value={thisHour.windSpeed} />
          </div>
          <div style={{ fontSize: iconSize, marginTop: marginTop }}>
            <BsDropletHalf />
          </div>
          <div>{thisHour.humidity}%</div>
        </div>
        <div>
          <img
            src={now.iconLink}
            alt={now.iconLink}
            style={{
              width: 160,
              height: 160,
              lineHeight: "64px",
              textShadow: "2px 2px black",
            }}
          />
          <div
            style={{
              marginTop: -20,
              fontSize: 24,
              fontWeight: "bold",
              textShadow: "2px 2px black",
            }}
          >
            {now.skyDescription}
          </div>
        </div>
      </div>
    );
  }

  renderHourlyForecast(index) {
    const { hourly } = this.state;

    const renderHourly = (hourly) => {
      const d = new Date(hourly.utcTime * 1000);
      let hour = d.getHours(),
        ampm = "AM";
      if (hour > 12) {
        hour -= 12;
        ampm = "PM";
      }
      
      if (hour === 0) {
	hour = 12;
        ampm = "AM";
      }
      return (
        <Col style={{ textAlign: "center" }}>
          <div>
            {hour}
            {ampm}
          </div>
          <div>
            <img src={hourly.iconLink} alt={hourly.iconLink} />
          </div>
          <div>
            <Temperature value={hourly.temperature} />
          </div>
        </Col>
      );
    };

    return (
      <Row
        style={{
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <Col>
          <div
            style={{
              fontSize: 63,
              fontWeight: 300,
              textAlign: "left",
              fontFamily: "'Open Sans', sans-serif",
              color: "white",
            }}

            >
            forecast
          </div>
        </Col>
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
        {renderHourly(hourly[index++])}
      </Row>
    );
  }

  renderWeeklyForecast() {
    const { weekly } = this.state;

    const dayStyle = {
      borderRight: "2px solid white",
      textAlign: "center",
    };
    const marginTop = 8;

    const renderDay = (day) => {
      return (
        <>
          <div>{day.weekday}</div>
          <div style={{ marginTop: marginTop }}>
            <img src={day.iconLink} alt={day.iconLink}/>
          </div>
          <div style={{ marginTop: marginTop }}>
            <Temperature
              value={parseInt(day.highTemperature, 10)}
              units={false}
            />
            &deg; /{" "}
            <Temperature
              value={parseInt(day.lowTemperature, 10)}
              units={false}
            />
            &deg;
          </div>
          <div style={{ marginTop: marginTop }}>{day.description}</div>
        </>
      );
    };
    return (
      <>
        <Col style={dayStyle}>{renderDay(weekly[0])}</Col>
        <Col style={dayStyle}>{renderDay(weekly[1])}</Col>
        <Col style={dayStyle}>{renderDay(weekly[2])}</Col>
        <Col style={dayStyle}>{renderDay(weekly[3])}</Col>
        <Col style={dayStyle}>{renderDay(weekly[4])}</Col>
        <Col style={dayStyle}>{renderDay(weekly[5])}</Col>
        <Col style={dayStyle}>{renderDay(weekly[6])}</Col>
      </>
    );
  }

  renderHr() {
    return (
      <Row style={{ marginBottom: 20 }}>
        <Col>
          <div
            style={{
              marginTop: 30,
              marginLeft: "5%",
              width: "90%",
              height: 3,
              backgroundColor: "white",
              color: "white",
            }}
          ></div>
        </Col>
      </Row>
    );
  }

  renderTemperature() {
    const {  now } = this.state;

    return (
      <>
        <div
          style={{
            fontSize: 96,
            lineHeight: "110px",
            textShadow: "2px 2px black",
            color: "white",
          }}
        >
          <Temperature value={now.temperature} />
        </div>
        <div
          style={{
            fontSize: 24,
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
            fontSize: 20,
            textShadow: "2px 2px black",
          }}
        >
          Feels like <Temperature value={now.comfort} />
        </div>
      </>
    );
  }

  renderClock() {
    const { now } = this.state;

    return (
      <div
        style={{
          marginTop: -18,
          marginLeft: 40,
          textAlign: "center",
          fontSize: 96,
          textShadow: "2px 2px black",
        }}
      >
        <div>
          <Clock />
        </div>
        <div
          style={{
            fontSize: 24,
          }}
        >
          {now.city}, {now.state}
        </div>
        <div style={{ fontSize: 20 }}>{now.temperatureDesc}</div>
      </div>
    );
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

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
      <>
        <Row style={{ marginLeft: "5%", marginRight: "5%" }}>
          <Col sm={3} style={{ textAlign: "center" }}>
            {this.renderDetails(index)}
          </Col>

          <Col sm={3} style={{ textAlign: "center" }}>
            {this.renderTemperature(index)}
          </Col>

          <Col sm={6}>{this.renderClock(index)}</Col>
        </Row>

        {this.renderHr()}
        {this.renderHourlyForecast(index)}
        {this.renderHr()}
        <Row style={{ marginLeft: "5%", marginRight: "5%" }}>
          {this.renderWeeklyForecast()}
        </Row>
      </>
    );
  }
}

//
export default WeatherTab;
