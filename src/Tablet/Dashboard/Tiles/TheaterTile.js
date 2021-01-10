import React from "react";
import { Row, ButtonGroup } from "react-bootstrap";

import styles from "./styles";

import {
  FaVolumeMute,
  FaVolumeUp,
  FaVolumeDown,
  // FaPause,
  FaCheckCircle,
  FaHome,
  // FaPlay,
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FiMonitor } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { BsFillChatSquareFill } from "react-icons/bs";

import MQTT from "lib/MQTT";
import { data as Config } from "lib/Config";

import { mangle, isOn } from "lib/Utils";

import MQTTButton from "Common/MQTTButton";

import TiVoTransport from "Tablet/Transport/TiVoTransport";
import AppleTVTransport from "Tablet/Transport/AppleTVTransport";
import RokuTransport from "Tablet/Transport/RokuTransport";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
// const appName = (n) => {
//   if (n === "com.google.ios.youtube") {
//     return "YouTube";
//   }
//   return n;
// };

class TheaterTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(2, 2);
    this.title = props.tile.title;

    this.deviceMap = {};
    this.activitiesMap = {};

    for (const t of Config.theaters) {
      if (t.title === this.title) {
        this.theater = t;
        break;
      }
    }
    if (!this.theater) {
      return;
    }

    this.devices = this.theater.devices;
    this.activities = this.theater.activities;

    for (const device of this.devices) {
      this.deviceMap[mangle(device.type)] = device;
      switch (device.type.toLowerCase()) {
        case "lgtv":
        case "bravia":
          this.tv = device;
          break;
        case "avr":
        case "denon":
          this.avr = device;
          break;
        case "appletv":
          this.appletv = device;
          break;
        case "roku":
          this.roku = device;
          break;
        case "tivo":
          this.tivo = device;
          break;
        default:
          break;
      }
    }

    for (const activity of this.activities) {
      this.activitiesMap[activity.type] = activity;
    }

    this.state = {};

    this.avr_command = `denon/${this.avr.device}/set/command`;
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    console.log("handleMessage", topic, message);
    if (message === undefined) {
      return;
    }
    if (~topic.indexOf("input")) {
      this.setState({ tvInput: message });
    } else if (~topic.indexOf("SI")) {
      this.setState({ avrInput: message });
    } else if (~topic.indexOf("PW")) {
      this.setState({ avrPower: isOn(message) });
    } else if (~topic.indexOf("MU")) {
      this.setState({ mute: isOn(message) });
    } else if (~topic.indexOf("channels")) {
      this.setState({ channels: message });
    } else if (~topic.indexOf("channel")) {
      this.setState({ channel: message });
    } else if (~topic.indexOf("info")) {
      this.setState({ info: message });
    } else if (~topic.indexOf("power")) {
      // console.log(topic, message);
      this.setState({ tvPower: isOn(message) });
    } else if (~topic.indexOf("active")) {
      this.setState({ roku: message });
    } else if (~topic.indexOf("launchPoints")) {
      this.setState({ launchPoints: message });
      if (this.state.foregroundApp) {
        const foregroundApp = this.state.foregroundApp;
        const app = this.state.launchPoints[foregroundApp.appId];
        try {
          this.setState({
            tvInput: this.state.tvPower ? app.title || "unknown" : "OFF",
          });
        } catch (e) {}
      }
    } else if (~topic.indexOf("foregroundApp")) {
      this.setState({ foregroundApp: message });
      if (!this.state.launchPoints) {
        this.setState({ tvInput: "OFF" });
      } else {
        const foregroundApp = this.state.foregroundApp;
        if (foregroundApp.appId !== "") {
          const app = this.state.launchPoints[foregroundApp.appId];
          const title = app.title;
          const lp = title || "unknown";
          const inp = this.state.tvPower ? lp : "OFF";
          this.setState({ tvInput: inp });
        }
      }
    } else {
      console.log("unknown ", topic, message);
    }
  }

  componentDidMount() {
    if (this.theater && this.theater.guide) {
      MQTT.subscribe(
        `tvguide/${this.theater.guide}/status/channels`,
        this.handleMessage
      );
    }
    if (this.tv) {
      if (this.tv.type === "bravia") {
        MQTT.subscribe(
          `bravia/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.subscribe(
          `bravia/${this.tv.device}/status/input`,
          this.handleMessage
        );
      } else if (this.tv.type === "lgtv") {
        MQTT.subscribe(
          `lgtv/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.subscribe(
          `lgtv/${this.tv.device}/status/launchPoints`,
          this.handleMessage
        );
        MQTT.subscribe(
          `lgtv/${this.tv.device}/status/foregroundApp`,
          this.handleMessage
        );
      }
    }

    if (this.avr) {
      MQTT.subscribe(`denon/${this.avr.device}/status/PW`, this.handleMessage);
      MQTT.subscribe(`denon/${this.avr.device}/status/SI`, this.handleMessage);
      MQTT.subscribe(`denon/${this.avr.device}/status/MU`, this.handleMessage);
    }

    if (this.tivo) {
      MQTT.subscribe(
        `tivo/${this.tivo.device}/status/channel`,
        this.handleMessage
      );
    }

    if (this.appletv) {
      MQTT.subscribe(
        `appletv/${this.appletv.device}/status/info`,
        this.handleMessage
      );
    }

    if (this.roku) {
      MQTT.subscribe(
        `roku/${this.roku.device}/status/active`,
        this.handleMessage
      );
    }
  }

  componentWillUnmount() {
    if (this.theater && this.theater.guide) {
      MQTT.unsubscribe(
        `tvguide/${this.theater.guide}/status/channels`,
        this.handleMessage
      );
    }
    if (this.tv) {
      if (this.tv.type === "bravia") {
        MQTT.unsubscribe(
          `bravia/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.unsubscribe(
          `bravia/${this.tv.device}/status/input`,
          this.handleMessage
        );
      } else if (this.tv.type === "lgtv") {
        MQTT.unsubscribe(
          `lgtv/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.unsubscribe(
          `lgtv/${this.tv.device}/status/launchPoints`,
          this.handleMessage
        );
        MQTT.unsubscribe(
          `lgtv/${this.tv.device}/status/foregroundApp`,
          this.handleMessage
        );
      }
    }

    if (this.avr) {
      MQTT.unsubscribe(`denon/${this.avr.device}/status/PW`, this.handleMessage);
      MQTT.unsubscribe(`denon/${this.avr.device}/status/SI`, this.handleMessage);
      MQTT.unsubscribe(`denon/${this.avr.device}/status/MU`, this.handleMessage);
    }

    if (this.tivo) {
      MQTT.unsubscribe(
        `tivo/${this.tivo.device}/status/channel`,
        this.handleMessage
      );
    }

    if (this.appletv) {
      MQTT.unsubscribe(
        `appletv/${this.appletv.device}/status/info`,
        this.handleMessage
      );
    }

    if (this.roku) {
      MQTT.unsubscribe(
        `roku/${this.roku.device}/status/active`,
        this.handleMessage
      );
    }
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  getActivityInfo() {
    let currentActivity = null;

    if (!this.state.tvPower || (this.avr && !this.state.avrPower)) {
      return null;
    }
    const tvInput = mangle(this.state.tvInput),
      avrInput = mangle(this.state.avrInput);

    for (const activity of this.activities) {
      if (activity.inputs) {
        const tv = mangle(activity.inputs.tv);
        const avr = mangle(activity.inputs.avr);
        if (tv === tvInput && avr === avrInput) {
          currentActivity = activity;
        }
      } else if (!currentActivity) {
        currentActivity = activity;
      }
    }

    return currentActivity;
  }

  renderTivo(currentActivity) {
    if (!this.state.channels) {
      return null;
    }

    const renderGuide = () => {
      try {
        const guide = this.state.channels[this.state.channel];
        return (
          <>
            <img
              src={guide.logo.URL}
              alt={guide.name}
              style={{ width: 64, height: "auto" }}
            />
            <div>
              {this.state.channel} {guide.name}
            </div>
          </>
        );
      } catch (e) {
        return null;
      }
    };

    return (
      <>
        <div
          style={{
            marginTop: 5,
          }}
        >
          <div>
            <h1 style={{ marginBottom: 10 }}>TiVo</h1>
            <div style={{ marginBottom: 10 }}>{renderGuide()}</div>
          </div>
        </div>
        <TiVoTransport device={this.tivo} />
      </>
    );
  }

  renderAppleTV(currentActivity) {
    const renderPlaybackState = () => {
      // if (!info.playbackState) {
      return <div>Not Playing</div>;
      // }
    };

    const topic = `appletv/${this.appletv.device}/set/command`;
    const device = this.appletv;
    return (
      <div>
        <div style={{ fontWeight: "bold" }}>{device.title}</div>
        {renderPlaybackState()}

        <Row style={{ ...rowStyle, marginTop: 8 }}>
          <ButtonGroup>
            <MQTTButton mini topic={topic} message="Suspend">
              <FiMonitor />
            </MQTTButton>
            <MQTTButton mini topic={topic} message="Up">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton mini topic={topic} message="Menu">
              <HiOutlineMenu />
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton mini topic={topic} message="Left">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton mini variant="primary" topic={topic} message="Select">
              <FaCheckCircle />
            </MQTTButton>
            <MQTTButton mini topic={topic} message="Right">
              <FaChevronRight />
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton mini variant="none" />
            <MQTTButton mini topic={topic} message="Down">
              <FaChevronDown />
            </MQTTButton>
            <MQTTButton mini variant="none" />
          </ButtonGroup>
        </Row>
        {/* <div style={{ marginTop: 8 }}> */}
        {/*   <MQTTButton topic={topic} message="Pause" mini> */}
        {/*     <FaPause /> */}
        {/*   </MQTTButton> */}
        {/*   <MQTTButton topic={topic} message="Select"> */}
        {/*     Select */}
        {/*   </MQTTButton> */}
        {/*   <MQTTButton topic={topic} message="Play" mini> */}
        {/*     <FaPlay /> */}
        {/*   </MQTTButton> */}
        {/* </div> */}
        <AppleTVTransport device={this.appletv} />
      </div>
    );
  }

  renderRoku(currentActivity) {
    console.log("roku", this.state);
    const roku = this.state.roku;
    const command_topic = `roku/${this.roku.device}/set/command`;
    console.log("renderRoku", command_topic, roku, this.roku);
    const renderControls = () => {
      return (
        <>
          <Row style={{ ...rowStyle }}>
            <ButtonGroup>
              <MQTTButton mini topic={command_topic} message="Home">
                <FaHome />
              </MQTTButton>
              <MQTTButton mini topic={command_topic} message="Up">
                <FaChevronUp />
              </MQTTButton>
              <MQTTButton mini variant="none" />
            </ButtonGroup>
          </Row>

          <Row style={rowStyle}>
            <ButtonGroup>
              <MQTTButton mini topic={command_topic} message="Left">
                <FaChevronLeft />
              </MQTTButton>
              <MQTTButton
                mini
                variant="primary"
                topic={command_topic}
                message="Select"
              >
                <FaCheckCircle />
              </MQTTButton>
              <MQTTButton mini topic={command_topic} message="Right">
                <FaChevronRight />
              </MQTTButton>
            </ButtonGroup>
          </Row>

          <Row style={rowStyle}>
            <ButtonGroup>
              <MQTTButton mini topic={command_topic} message="Info">
                *
              </MQTTButton>
              <MQTTButton mini topic={command_topic} message="Down">
                <FaChevronDown />
              </MQTTButton>
              <MQTTButton mini variant="none" />
            </ButtonGroup>
          </Row>
          <RokuTransport device={this.roku.device} />
        </>
      );
    };
    if (roku) {
      return (
        <>
          <div style={{ minHeight: 60 }}>
            <h5>Roku</h5>
            <img src={roku.icon} alt="" style={{ height: 40, width: "auto" }} />
          </div>
          {renderControls()}
        </>
      );
    } else {
      return (
        <>
          <div style={{ minHeight: 60 }}>
            <h5>Roku</h5>
            <div>Not Playing</div>
          </div>
          {renderControls()}
        </>
      );
      // return <div>Roku not playing</div>;
    }
  }

  renderActivities() {
    const activities = this.activities;
    let key = 0;
    return (
      <div style={this.style}>
        <h5 style={{ marginTop: 5 }}>Theater Off</h5>
        <div style={{ marginTop: 8 }}>Choose Activity:</div>
        {activities.map((activity) => {
          if (activity.name === "All Off") {
            return null;
          }
          // console.log("activity", activity);
          return (
            <div key={key++}>
              <MQTTButton topic="macros/run" message={activity.macro}>
                {activity.name}
              </MQTTButton>
            </div>
          );
        })}
      </div>
    );
  }

  renderAudioControls() {
    const mute = this.state.mute,
      avr = this.avr;

    if (!avr || (avr && !this.state.avrPower) || !this.state.tvPower) {
      return null;
    }

    const dispatch = ({ type }) => {
      console.log("dispatch", this.avr_command, type);
      switch (type) {
        case "mute":
          MQTT.publish(this.avr_command, "MUON");
          this.setState({ mute: true });
          break;
        case "unmute":
          MQTT.publish(this.avr_command, "MUOFF");
          this.setState({ mute: false });
          break;
        case "masterup":
          MQTT.publish(this.avr_command, "MVUP");
          break;
        case "masterdown":
          MQTT.publish(this.avr_command, "MVDOWN");
          break;
        case "movie":
          MQTT.publish(this.avr_command, "MSMOVIE");
          break;
        case "centermax":
          MQTT.publish(this.avr_command, "CVC 62");
          break;
        default:
          console.log("invalid type!", type);
          break;
      }
    };

    return (
      <div>
        <ButtonGroup style={{ marginTop: 10 }}>
          <MQTTButton
            mini
            variant={mute ? "danger" : undefined}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("avr", avr);
              dispatch({ type: mute ? "unmute" : "mute" });
            }}
          >
            <FaVolumeMute />
          </MQTTButton>

          <MQTTButton
            mini
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch({ type: "masterdown" });
            }}
          >
            <FaVolumeDown />
          </MQTTButton>

          <MQTTButton
            mini
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch({ type: "masterup" });
            }}
          >
            <FaVolumeUp />
          </MQTTButton>
          <MQTTButton
            mini
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch({ type: "movie" });
            }}
          >
            DD
          </MQTTButton>
          <MQTTButton
            mini
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch({ type: "centermax" });
            }}
          >
            <BsFillChatSquareFill />
          </MQTTButton>
        </ButtonGroup>
      </div>
    );
  }

  renderActivity(currentActivity) {
    if (!currentActivity) {
      return null;
    }

    if (!currentActivity.defaultDevice) {
      return null;
    }

    const device = this.deviceMap[mangle(currentActivity.defaultDevice)];
    if (!device) {
      return null;
    }

    if (!device.type) {
      return null;
    }
    switch (device.type.toLowerCase()) {
      case "tivo":
        return this.renderTivo(currentActivity);
      case "appletv":
        return this.renderAppleTV(currentActivity);
      case "roku":
        return this.renderRoku(currentActivity);
      default:
        return <div>{device.type}</div>;
    }
  }

  render() {
    if (
      this.tv &&
      (this.state.tvPower === undefined || this.state.tvInput === undefined)
    ) {
      return this.renderActivities();
    }
    if (
      (this.avr && this.state.avrPower === undefined) ||
      this.state.avrInput === undefined
    ) {
      return this.renderActivities();
    }
    if (this.theater.guide && (!this.state.channels || !this.state.channel)) {
      return this.renderActivities();
    }

    const currentActivity = this.getActivityInfo();
    if (currentActivity === null) {
      return this.renderActivities();
    }
    return (
      <div style={this.style}>
        {this.renderActivity(currentActivity)}
        {this.state.tvPower !== undefined
          ? this.renderAudioControls(currentActivity)
          : null}
      </div>
    );
  }
}

//
export default TheaterTile;
