import React from "react";
import { Row, Col, ButtonGroup, ProgressBar } from "react-bootstrap";

import TiVoFavorites from "Common/Modals/TiVoFavorites";
import Marquee from "Common/Marquee";
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

    this.allOff = null;
    for (const activity of this.activities) {
      if (activity.name === "All Off") {
        this.allOff = activity.macro;
        break;
      }
    }

    this.state = { show: false };
  }

  componentDidMount() {
    if (this.theater) {
      this.theater.subscribe();
      this.theater.on("statechange", (newState) => {
        try {
          //          console.log('statechange', newState);
          if (typeof newState !== "string" && newState && typeof newState.appletv.info === "object") {
            this.setState({ ...newState, timestamp: Date.now() });
          }
        }
        catch (e) {
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.theater) {
      this.theater.unsubscribe();
    }
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
                if (favorite) {
                  const topic = `tivo/${this.state.tivo.device}/set/command`;
                  MQTT.publish(topic, "0" + favorite.channel);
                  this.setState({ show: false });
                } else if (activity) {
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
            <h4 style={{ marginBottom: 16 }}>{this.state.tivo.title}</h4>
            <div style={{ marginBottom: 1 }}>{renderGuide()}</div>
          </div>
        </div>
        <TiVoTransport device={this.theater.tivo} />
      </>
    );
  }

  getInfo() {
    const info = this.state.appletv.info;
    if (!info) {
      return {};
    }
    if (info.total_time !== null) {
      return info;
    }
    const now = new Date(),
      minutes = now.getMinutes();

    info.total_time = minutes > 30 ? 60 * 60 : 30 * 60;
    info.position = 60 * minutes + now.getSeconds();
    return info;
  }

  renderAppleTV(currentActivity) {
    const device = this.state.appletv;

    const renderTitle = (title) => {
      if (title == null) {
        return null;
      }
      if (title.length > 34) {
        return <Marquee speed={30} behavior="alternate" text={title}></Marquee>;
      } else {
        return <div style={{ fontWeight: "bold", fontSize: 14 }}>{title}</div>;
      }
    };


    const renderArtwork = (artwork) => {
      if (!this.state.appletv || !artwork) {
        return null;
      }
      try {
        // const img = new Image();
        // img.onload = () => {
        //   const w = img.width,
        //     h = img.height;
        //   if (this.state.w !== w || this.state.h !== h) {
        //     this.setState({ w: w, h: h });
        //   }
        // };
        // img.src = "data:image;base64," + device.info.artwork;

        // const {w,h} = this.state;
        // let ww = w, hh = h;
        return (
          <>
            <div>
              {/* {this.state.w} x {this.state.h} */}
            </div>
            <img
              style={{ maxWidth: 210, maxHeight: 120, marginBottom: 10 }}
              alt="artwork"
              src={`data:image;base64,${device.info.artwork}`}
              onClick={() => {
                window.location.hash = "theater";
              }}
            />
          </>
        );
      } catch (e) { }

      return null;
    };

    const renderPlaybackState = () => {
      const formatTitle = (info) => {
        if (info.title) {
          if (info.album) {
            return info.title + " " + info.album;
          }
          else if (info.app) {
            return info.app + ': ' + info.title;
          }
          else {
            return info.title;
          }
        }
        else if (info.app) {
          return info.app;
        }
        return null;
      };

      try {
        const info = this.getInfo(),
          title = formatTitle(info);

//        console.log('info', info);
        if (info.deviceState === 'Playing' || info.deviceState === 'Paused') {
          return (
            <>
              {renderTitle(title)}
              <div style={{ fontSize: 10, marginTop: 2, marginBottom: 8 }}>
                {info.deviceState}
              </div>
              {renderArtwork(info.artwork)}
              <AppleTVTransport device={this.state.appletv} />
            </>
          );
        }
        // if (!info.playbackState) {
      } catch (e) {
        // console.log("e", e);
        return null;
      }

      return (
        <div>
          <div style={{ fontSize: 16, fontWeight: "bold" }}>{device.title}</div>
          <div style={{ fontSize: 14 }}>Not Playing</div>
        </div>
      );
    };

    try {
      if (this.state.appletv.info.artwork) {
        return <div>{renderPlaybackState()}</div>;
      }
    } catch (e) { }

    const topic = `appletv/${this.state.appletv.device}/set/command`;
    return (
      <div>
        {renderPlaybackState()}

        <Row style={{ ...rowStyle, marginTop: 12 }}>
          <ButtonGroup>
            <MQTTButton
              mini
              variant="secondary"
              topic={topic}
              message="Suspend"
            >
              <FiMonitor />
            </MQTTButton>
            <MQTTButton mini topic={topic} message="Up">
              <FaChevronUp />
            </MQTTButton>
            <MQTTButton mini variant="secondary" topic={topic} message="Menu">
              <HiOutlineMenu />
            </MQTTButton>
          </ButtonGroup>
        </Row>

        <Row style={rowStyle}>
          <ButtonGroup>
            <MQTTButton mini topic={topic} message="Left">
              <FaChevronLeft />
            </MQTTButton>
            <MQTTButton mini variant="secondary" topic={topic} message="Select">
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
        <h5
          style={{ marginTop: 2 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.allOff) {
              MQTT.publish("macros/run", this.allOff);
            }
          }}
        >
          Theater Off
        </h5>
        <div
          style={{ marginTop: 8 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.allOff) {
              MQTT.publish("macros/run", this.allOff);
            }
          }}
        >
          Choose Activity:
        </div>
        {activities.map((activity) => {
          if (activity.name.toLowerCase() === "all off") {
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
    if (!this.state.avr) {
      return null;
    }
    const mute = this.state.avr.mute,
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
    //    console.log('device', device);
    if (!device) {
      return null;
    }
    //    try {
    //      if (!device.info.power) {
    //        return this.renderActivities();
    //      }
    //    } catch (e) { }

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
    if (!this.theater) {
      return null;
    }

    const state = Object.assign({}, this.state);
    this.theater.handleInputChange(state);

    const { avr, tv, currentDevice, currentActivity } = this.state;
    if (!tv) {
      return null;
    }

    //    console.log('tv', tv, 'avr', avr);
    if (tv && (tv.power === false)) { //  || tv.input === undefined)) {
      return this.renderActivities();
    }

    if (avr && !avr.power) {
      //      (avr && state.avr.power === undefined) ||
      //      (avr && state.avr.input === undefined)
      //    ) {
      //      debugger
      return this.renderActivities();
    }

    if (currentDevice === null || currentActivity === null) {
      return this.renderActivities();
    }

    const renderProgress = () => {
      const info = this.getInfo(),
        total_time =
          info.total_time || (info.position > 30 * 60 ? 60 * 60 : 30 * 60);

      if (!info.power || (!info.title && !info.app)) {
        return null;
      }
      return (
        <Row style={{ marginTop: -12, fontSize: 14 }}>
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
              now={(info.position / total_time) * 100}
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
              {total_time != null ? "-" : ""}
              {total_time != null
                ? formatTime(total_time - info.position)
                : ""}
            </div>
          </Col>
        </Row>
      )
    }

    //    console.log('here');
    return (
      <div style={this.style}>
        <div style={{ height: 180 }}>
          {this.renderActivity(currentActivity)}
        </div>
        {renderProgress()}
        {state.tv.power !== undefined
          ? this.renderAudioControls(currentActivity)
          : null}
      </div>
    );
  }
}

//
export default TheaterTile;
