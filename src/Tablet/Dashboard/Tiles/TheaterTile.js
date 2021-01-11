import React from "react";
import { Row, ButtonGroup } from "react-bootstrap";

import Theater from "lib/Theater";
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

    let theater = false;
    for (const t of Config.theaters) {
      if (t.title === this.title) {
        theater = t;
        break;
      }
    }
    if (!theater) {
      return;
    }

    this.config = theater;
    this.theater = new Theater(theater);
    this.devices = theater.devices;
    this.activities = theater.activities;

    this.state = {};
  }

  componentDidMount() {
    this.theater.subscribe();
    this.theater.on("statechange", (newState) => {
      this.setState(newState);
    });
  }

  componentWillUnmount() {
    this.theater.unsubscribe();
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
        <TiVoTransport device={this.theater.tivo} />
      </>
    );
  }

  renderAppleTV(currentActivity) {
    const renderPlaybackState = () => {
      // if (!info.playbackState) {
      return <div>Not Playing</div>;
      // }
    };

    if (!this.state.appletv) {
      return null;
    }
    console.log("here", this.theater.appletv);
    const topic = `appletv/${this.state.appletv.device}/set/command`;
    const device = this.state.appletv;
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
        <AppleTVTransport device={this.state.appletv} />
      </div>
    );
  }

  renderRoku(currentActivity) {
    const roku = this.state.roku;
    const command_topic = `roku/${this.roku.device}/set/command`;
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
          <RokuTransport device={this.theater.roku.device} />
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
      avr = this.theater.avr;

    if (!avr || (avr && !this.state.avr.power) || !this.state.tv.power) {
      return null;
    }

    const dispatch = ({ type }) => {
      const avr_command = `denon/${avr.device}/set/command`;
      switch (type) {
        case "mute":
          MQTT.publish(avr_command, "MUON");
          this.setState({ mute: true });
          break;
        case "unmute":
          MQTT.publish(avr_command, "MUOFF");
          this.setState({ mute: false });
          break;
        case "masterup":
          MQTT.publish(avr_command, "MVUP");
          break;
        case "masterdown":
          MQTT.publish(avr_command, "MVDOWN");
          break;
        case "movie":
          MQTT.publish(avr_command, "MSMOVIE");
          break;
        case "centermax":
          MQTT.publish(avr_command, "CVC 62");
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

    const device = this.theater.findDevice(currentActivity.defaultDevice);
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
    const state = Object.assign({}, this.state);
    this.theater.handleInputChange(state);

    const { avr, tv, currentActivity } = this.state;
    if (!tv || !avr) {
      return null;
    }

    if (tv && (state.tv.power === undefined || state.tv.input === undefined)) {
      return this.renderActivities();
    }

    if (
      (avr && state.avr.power === undefined) ||
      state.avr.input === undefined
    ) {
      return this.renderActivities();
    }

    if (this.config.guide && (!state.channels || !state.channel)) {
      return this.renderActivities();
    }

    if (currentActivity === null) {
      return this.renderActivities();
    }

    return (
      <div style={this.style}>
        {this.renderActivity(currentActivity)}
        {state.tv.power !== undefined
          ? this.renderAudioControls(currentActivity)
          : null}
      </div>
    );
  }
}

//
export default TheaterTile;
