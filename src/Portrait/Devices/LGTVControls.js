/*
 _____     _     _      _    
|_   _|_ _| |__ | | ___| |_  
  | |/ _` | '_ \| |/ _ \ __| 
  | | (_| | |_) | |  __/ |_  
  |_|\__,_|_.__/|_|\___|\__| 
                             
 _     ____ _______     ______            _             _  
| |   / ___|_   _\ \   / / ___|___  _ __ | |_ _ __ ___ | | 
| |  | |  _  | |  \ \ / / |   / _ \| '_ \| __| '__/ _ \| | 
| |__| |_| | | |   \ V /| |__| (_) | | | | |_| | | (_) | | 
|_____\____| |_|    \_/  \____\___/|_| |_|\__|_|  \___/|_| 
*/

import React from "react";
import MQTTButton from "Common/MQTTButton";

import { ButtonGroup } from "react-bootstrap";

import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import LGTVTransport from "Tablet/Transport/LGTVTransport";

import MQTT from "lib/MQTT";

class LGTVControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.device = props.device;
    //
    this.handleLaunchPointsMessage = this.handleLaunchPointsMessage.bind(this);
    this.handleForegroundAppMessage = this.handleForegroundAppMessage.bind(
      this
    );
  }

  handleLaunchPointsMessage(topic, message) {
    this.setState({ launchPoints: message });
  }
  handleForegroundAppMessage(topic, message) {
    this.setState({ foregroundApp: message });
  }

  componentDidMount() {
    MQTT.subscribe(
      `lgtv/${this.device.device}/status/launchPoints`,
      this.handleLaunchPointsMessage
    );
    MQTT.subscribe(
      `lgtv/${this.device.device}/status/foregroundApp`,
      this.handleForegroundAppMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `lgtv/${this.device.device}/status/launchPoints`,
      this.handleLaunchPointsMessage
    );
    MQTT.unsubscribe(
      `lgtv/${this.device.device}/status/foregroundApp`,
      this.handleForegroundAppMessage
    );
  }
  //
  render() {
    const lgtv = this.state;
    if (!lgtv.launchPoints || !lgtv.foregroundApp) {
      return null;
    }

    const foregroundApp = lgtv.foregroundApp,
      launchPoints = lgtv.launchPoints,
      apps = {};

    try {
      for (const index of Object.keys(launchPoints)) {
        const info = launchPoints[index];
        apps[info.title.replace(/\s+/g, "")] = info;
      }
    } catch (e) {}

    const renderNowPlaying = () => {
      if (true || !foregroundApp || !launchPoints) {
        return null;
      }

      const appId = foregroundApp.appId,
        app = launchPoints[appId];

      if (!app) {
        return null;
      }

      return (
        <div style={{ textAlign: "center" }}>
          <div style={{ marginLeft: "auto", marginRight: "auto", width: 100 }}>
            <img alt={app.icon} src={app.icon} />
            {app.title}
          </div>
        </div>
      );
    };

    const renderHDMI = () => {
      const button = (n) => {
        const hdmi = "hdmi" + n;
        return (
          <MQTTButton
            action={hdmi}
            variant={lgtv.input === hdmi ? "success" : undefined}
          >
            HDMI {n}
          </MQTTButton>
        );
      };
      return (
        <ButtonGroup>
          {button(1)}
          {button(2)}
          {button(3)}
          {button(4)}
        </ButtonGroup>
      );
    };

    const renderControlButtons = () => {
      return (
        <div style={{ marginTop: 4 }}>
          <MQTTButton action="back">
            Back
          </MQTTButton>
          <MQTTButton  action="menu">
            Menu
          </MQTTButton>
          <MQTTButton action="home">
            Home
          </MQTTButton>
          <MQTTButton action="guide">
            Guide
          </MQTTButton>
        </div>
      );
    };

    const renderJoystick = () => {
      const button = (action, label, variant) => {
        return (
          <MQTTButton variant={variant} action={action}>
            {label}
          </MQTTButton>
        );
      };

      return (
        <>
          <ButtonGroup>
            <MQTTButton variant="none" />
            {button("up", <FaChevronUp />)} {button("channelup", "+", "info")}
          </ButtonGroup>
          <br />
          <ButtonGroup>
            {button("left", <FaChevronLeft />)} {button("select", "Select")}
            {button("right", <FaChevronRight />)}
          </ButtonGroup>
          <br />
          <ButtonGroup>
            <MQTTButton variant="none" />
            {button("down", <FaChevronDown />)}{" "}
            {button("channeldown", "-", "info")}
          </ButtonGroup>
        </>
      );
    };

    const renderKeypad = () => {
      const button = (n) => {
        let label = "" + n;
        if (n === "clear") {
          label = ".";
        } else if (n === "enter") {
          label = "Enter";
        }
        return (
          <MQTTButton action={"" + n}>
            {label}
          </MQTTButton>
        );
      };
      return (
        <>
          <div style={{ marginTop: 4 }}>
            <ButtonGroup>
              {button(1)}
              {button(2)}
              {button(3)}
            </ButtonGroup>
            <br />
            <ButtonGroup>
              {button(4)}
              {button(5)}
              {button(6)}
            </ButtonGroup>
            <br />
            <ButtonGroup>
              {button(7)}
              {button(8)}
              {button(9)}
            </ButtonGroup>
            <br />
            <ButtonGroup>
              {button("clear")}
              {button(0)}
              {button("enter")}
            </ButtonGroup>
          </div>
        </>
      );
    };

    return (
      <div style={{ textAlign: "center" }}>
        {/* <div style={{ width: 48 * 10 }}>{renderLaunchPoints()}</div> */}
        <div>{renderNowPlaying()}</div>
        <div style={{ marginTop: 4 }}>{renderHDMI()}</div>
        <div style={{ marginTop: 4 }}>{renderControlButtons()}</div>
        <div style={{ margin: 10 }}>{renderJoystick()}</div>
        <div>{renderKeypad()}</div>
        <div style={{ marginTop: 4 }}>
          {" "}
          <LGTVTransport device={this.device.device} />{" "}
        </div>
      </div>
    );
  }
}

//
export default LGTVControls;
