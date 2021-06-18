import React from "react";

import { Row, Col } from "react-bootstrap";

import Theater from "lib/Theater";

import ActivitiesListGroup from "Tablet/Theater/ActivitiesListGroup";
import DevicesListGroup from "Tablet/Theater/DevicesListGroup";
import SpeakersListGroup from "Tablet/Theater/SpeakersListGroup";

import AudioControls from "Tablet/Theater/AudioControls";
import ButtonList from "Tablet/Theater/ButtonList";

import AppleTVControls from "Tablet/Theater/Devices/AppleTVControls";
import RokuControls from "Tablet/Theater/Devices/RokuControls";
import TivoControls from "Tablet/Theater/Devices/TivoControls";
import BraviaControls from "Tablet/Theater/Devices/BraviaControls";
import LGTVControls from "Tablet/Theater/Devices/LGTVControls";
import DenonControls from "Tablet/Theater/Devices/DenonControls";
import HarmonyControls from "Tablet/Theater/Devices/HarmonyControls";

import NowPlaying from "Tablet/Theater/NowPlaying/NowPlaying";

class TheaterTab extends React.Component {
  constructor(props) {
    super(props);

    this.theater = new Theater(props.theater);
    this.config = props.theater;
    this.activities = props.theater.activities;
    this.devices = props.theater.devices;

    this.state = { nowPlaying: false };

    //
    this.handleActivityClick = this.handleActivityClick.bind(this);
    this.handleDeviceClick = this.handleDeviceClick.bind(this);
    this.toggleNowPlaying = this.toggleNowPlaying.bind(this);
  }

  handleActivityClick(activity) {
    this.theater.startActivity(activity);
  }

  handleDeviceClick(device) {
    this.theater.startDevice(device);
  }

  componentDidMount() {
    this.theater.on("statechange", (newState) => {
      this.setState(newState);
    });
    this.theater.subscribe();
  }

  componentWillUnmount() {
    this.theater.unsubscribe();
  }

  toggleNowPlaying() {
    this.setState({ nowPlaying: !this.state.nowPlaying });
  }

  renderDevice() {
    const currentDevice = this.state.currentDevice;
    if (!currentDevice || !currentDevice.type) {
      return null;
    }

    switch (currentDevice.type) {
      case "tivo":
        return (
          <TivoControls device={this.state.tivo} exit={this.toggleNowPlaying} />
        );
      case "bravia":
        return (
          <BraviaControls device={this.state.tv} exit={this.toggleNowPlaying} />
        );
      case "lgtv":
        return (
          <LGTVControls
            device={this.state.tv}
            input={this.state.tv.input}
            exit={this.toggleNowPlaying}
          />
        );
      case "denon":
        return (
          <DenonControls device={this.state.avr} exit={this.toggleNowPlaying} />
        );
      case "harmony":
        return (
          <HarmonyControls
            hub={this.state.harmony}
            exit={this.toggleNowPlaying}
          />
        );
      case "roku":
        return (
          <RokuControls device={this.state.roku} exit={this.toggleNowPlaying} />
        );
      default:
        return (
          <AppleTVControls
            device={this.state.appletv}
            exit={this.toggleNowPlaying}
          />
        );
    }
  }

  render() {
    const state = Object.assign({}, this.state);
    if (!state.tv || !state.avr) {
      return null;
    }
    this.theater.handleInputChange(state);
    if (state.nowPlaying) {
      return <NowPlaying pstate={state} exit={this.toggleNowPlaying} />;
    }
    return (
      <>
        <Row style={{ marginTop: 12 }}>
          <Col sm={2}>
            <ActivitiesListGroup
              activities={this.activities}
              currentActivity={state.currentActivity.name}
              onClick={this.handleActivityClick}
            />

            <div style={{ marginTop: 12 }} />

            <DevicesListGroup
              devices={this.devices}
              tv={state.tv.input}
              avr={state.avr.input}
              /* state={this.state} */
              currentDevice={state.currentDevice}
              onClick={this.handleDeviceClick}
            />

            <div style={{ marginTop: 12 }} />

            <SpeakersListGroup tv={state.tv} avr={state.avr} />
          </Col>

          <Col sm={10}>
            <Row style={{ width: "100%", textAlign: "center" }}>
              <Col sm={2}>
                <AudioControls avr={state.avr} />
              </Col>

              <Col sm={7}>{this.renderDevice()}</Col>

              <Col sm={3}>
                <ButtonList theater={this.config} />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }

  set currentActivity(activity) {
    this.setState({ currentActivity: activity });
  }

  get currentActivity() {
    return this.state.currentActivity;
  }

  set currentDevice(device) {
    this.setState({ currentDevice: device });
  }

  get currentDevice() {
    return this.state.currentDevice;
  }
}

//
export default TheaterTab;
