import React from "react";
import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

import { Row, ButtonGroup, Button } from "react-bootstrap";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import RokuTransport from "Tablet/Transport/RokuTransport";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const DEBUG = require("debug"),
  debug = DEBUG("RokuControls");

class RokuControls extends React.Component {
  constructor(props) {
    super(props);
    this.device = props.device;
    this.favorites = this.device.favorites;
    this.title = this.device.title;
    this.info_topic = `roku/${this.device.device}/status/info`;
    this.command_topic = `roku/${this.device.device}/set/command`;

    this.state = {
      info: null,
    };

    this.updateInfo = this.updateInfo.bind(this);

    console.log("roku", props);
    debug("RokuControls", this.device, `(${this.info_topic})`);
  }

  updateInfo(topic, message) {
    try {
      const key = topic.split("/").pop();
      const s = {};
      s[key] = message;
      this.setState(s);
    } catch (e) {}
  }

  componentDidMount() {
    MQTT.subscribe(`roku/${this.device.device}/status/active`, this.updateInfo);
    MQTT.subscribe(`roku/${this.device.device}/status/power`, this.updateInfo);
    MQTT.subscribe(`roku/${this.device.device}/status/apps`, this.updateInfo);
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `roku/${this.device.device}/status/active`,
      this.updateInfo
    );
    MQTT.unsubscribe(
      `roku/${this.device.device}/status/power`,
      this.updateInfo
    );
    MQTT.unsubscribe(`roku/${this.device.device}/status/apps`, this.updateInfo);
  }

  renderNowPlaying() {
    const active = this.state.active;
    if (!active) {
      return null;
    }

    console.log("ACTIVE", active, this.state.apps);
    return (
      <>
        <img
          src={active.icon}
          alt=""
          style={{ width: 128, height: "auto", marginBottom: 20 }}
        />
      </>
    );
  }

  renderFavorites() {
    const favorites = this.favorites,
      apps = this.state.apps;

    if (!favorites || !apps) {
      return null;
    }
    const fm = {};
    for (let i = 0; i < apps.length; i++) {
      const fav = apps[i];
      fm[fav.name] = fav;
    }
    let key = 1;
    return (
      <>
        <div style={{ marginTop: 10 }}>Favorites</div>
        {favorites.map((fav) => {
          const app = fm[fav];
          if (app) {
            return (
              <Button
                style={{width: 128}}
                key={key++}
                onClick={() => {
                  console.log("Clicked", app);
                  MQTT.publish(this.command_topic, `launch-${app.id}`);
                }}
              >
                <img
                  src={app.icon}
                  alt={""}
                  style={{ width: 32, height: "auto" }}
                />
                <br />
                {app.name}
              </Button>
            );
          } else {
            return <div key={key++}>{fav} not found</div>;
          }
        })}
      </>
    );
  }

  render() {
    return (
      <>
        <Row style={{ ...rowStyle, marginTop: 4 }}>
          {this.renderNowPlaying()}
        </Row>

        <Row style={{ ...rowStyle, marginTop: 4 }}>
          <ButtonGroup>
            <MQTTButton
              variant="danger"
              topic={this.command_topic}
              message="Power"
            >
              Power
            </MQTTButton>
          </ButtonGroup>
        </Row>
        <Row style={{ ...rowStyle, marginTop: 4 }}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Back">
              Back
            </MQTTButton>
            <MQTTButton
              variant="primary"
              topic={this.command_topic}
              message="Home"
            >
              Home
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={{ ...rowStyle, marginTop: 24 }}>
          <ButtonGroup>
            <MQTTButton variant="none" />
            <MQTTButton topic={this.command_topic} message="Up">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton variant="none" />
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Left">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton
              variant="primary"
              topic={this.command_topic}
              message="Select"
            >
              Select
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Right">
              <FaChevronRight />
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton topic={this.command_topic} message="Info">
              *
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Down">
              <FaChevronDown />
            </MQTTButton>
            <MQTTButton topic={this.command_topic} message="Enter">
              Enter
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <div>{this.renderFavorites()}</div>
        <div>
          <RokuTransport device={this.device} />
        </div>
      </>
    );
  }
}

//
export default RokuControls;
