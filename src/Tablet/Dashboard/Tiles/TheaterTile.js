import React from "react";
import { Row, Col, ButtonGroup, ProgressBar } from "react-bootstrap";

import TiVoFavorites from "Common/Modals/TiVoFavorites";
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

const formatTime = (time) => {
  const hours = parseInt(time / 3600, 10);
  const minutes = parseInt((time % 3600) / 60, 10);
  const seconds = parseInt(time % 60, 10);
  return `${hours ? hours + ":" : ""}${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
};
const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

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

    this.state = { show: false };
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
            <TiVoFavorites
              activities={this.activities}
              currentActivity={this.state.currentActivity}
              tivo={this.state.tivo}
              channels={this.state.channels}
              select={(selection) => {
                const favorite = selection.favorite,
                  activity = selection.activity;
                console.log("SELECTED ", selection);
                if (favorite) {
                  const topic = `tivo/${this.state.tivo.device}/set/command`;
                  MQTT.publish(topic, "0" + selection.channel);
                  this.setState({ show: false });
                }
                else if (activity) {
                  /* console.log("ACTIVITY", activity.macro); */
                  MQTT.publish("macros/run", activity.macro);
                }
              }}
              show={this.state.show}
              hide={() => {
                this.setState({ show: false });
              }}
            />
            <div
              onClick={() => {
                this.setState({ show: true });
              }}
            >
              <img
                src={guide.logo.URL}
                alt={guide.name}
                style={{ width: 128, margin: 0, padding: 0 }}
              />
              <div style={{ marginTop: 0 }}>
                {this.state.channel} {guide.name}
              </div>
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
            <h1 style={{ marginBottom: 10 }}>{this.state.tivo.title}</h1>
            <div style={{ marginBottom: 1 }}>{renderGuide()}</div>
          </div>
        </div>
        <TiVoTransport device={this.theater.tivo} />
      </>
    );
  }

  renderAppleTV(currentActivity) {
    const renderTitle = (title) => {
      if (title.length > 34) {
        return (
          <marquee
            scrolldelay="200"
            behavior="alternate"
            style={{ fontWeight: "bold", fontSize: 14 }}
          >
            {title}
          </marquee>
        );
      } else {
        return <div style={{ fontWeight: "bold", fontSize: 14 }}>{title}</div>;
      }
    };

    const renderPlaybackState = () => {
      try {
        const info = this.state.appletv.info;
        if (info) {
          return (
            <>
              {renderTitle(info.title)}
              <div style={{ fontSize: 10, marginTop: -2 }}>
                {info.deviceState}
              </div>
              <Row style={{ marginTop: 2, fontSize: 12 }}>
                <Col sm={3}>
                  <div
                    style={{
                      marginLeft: 20,
                      width: "100%",
                      marginTop: -1,
                      textAlign: "right",
                    }}
                  >
                    {formatTime(info.position)}
                  </div>
                </Col>
                <Col sm={6}>
                  <ProgressBar
                    animated
                    variant="success"
                    style={{ width: "100%" }}
                    now={(info.position / info.total_time) * 100}
                  />
                </Col>
                <Col sm={3}>
                  <div
                    style={{
                      marginLeft: -16,
                      width: "100%",
                      marginTop: -1,
                      textAlign: "left",
                    }}
                  >
                    {formatTime(info.total_time)}
                  </div>
                </Col>
              </Row>
            </>
          );
        }
        // if (!info.playbackState) {
      } catch (e) {}
      const device = this.state.appletv;
      return (
        <div>
          <div style={{ fontWeight: "bold" }}>{device.title}</div>
          <div>Not Playing</div>
        </div>
      );
    };

    if (!this.state.appletv) {
      return null;
    }
    const topic = `appletv/${this.state.appletv.device}/set/command`;
    return (
      <div>
        {renderPlaybackState()}

        <Row style={{ ...rowStyle, marginTop: 6 }}>
          <ButtonGroup>
            <MQTTButton mini variant="info" topic={topic} message="Suspend">
              <FiMonitor />
            </MQTTButton>
            <MQTTButton mini topic={topic} message="Up">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton mini variant="info" topic={topic} message="Menu">
              <HiOutlineMenu />
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton mini topic={topic} message="Left">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton mini variant="info" topic={topic} message="Select">
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

        <AppleTVTransport device={this.state.appletv} />
      </div>
    );
  }

  renderRoku(currentActivity) {
    const roku = this.state.roku;
    const command_topic = `roku/${this.theater.roku.device}/set/command`;
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
        <ButtonGroup style={{ marginTop: 8 }}>
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

    // console.log("render", state);
    const { avr, tv, currentActivity } = this.state;
    if (!tv || !avr) {
      return null;
    }

    if (tv && (tv.power === false || tv.input === undefined)) {
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
        <div style={{ height: 180 }}>
          {this.renderActivity(currentActivity)}
        </div>
        {state.tv.power !== undefined
          ? this.renderAudioControls(currentActivity)
          : null}
      </div>
    );
  }
}

//
export default TheaterTile;
