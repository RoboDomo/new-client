import React from "react";
import { Row, Col } from "react-bootstrap";

import Theater from "lib/Theater";

// import MQTT from "lib/MQTT";
// import { isOn, mangle } from "lib/Utils";
//import { data as Config } from "lib/Config";

//import AudioControls from "./Devices/AudioControls";
//import AudioControls from "Tablet/Theater/Devices/AudioControls";
//import ButtonList from "Tablet/Theater/ButtonList";
import ActivitiesListGroup from "Tablet/Theater/ActivitiesListGroup";
import DevicesListGroup from "Tablet/Theater/DevicesListGroup";
import SpeakersListGroup from "Tablet/Theater/SpeakersListGroup";
import AudioControls from "./Devices/AudioControls";

import AppleTVControls from ".//Devices/AppleTVControls";
import RokuControls from "./Devices/RokuControls";
import TivoControls from "./Devices/TivoControls";
import BraviaControls from "./Devices/BraviaControls";
import LGTVControls from "./Devices/LGTVControls";
import DenonControls from "./Devices/DenonControls";
import HarmonyControls from "./Devices/HarmonyControls";

class TheaterTab extends React.Component {
  constructor(props) {
    super();
    this.config = props.theater;
    this.theater = new Theater(this.config);
    this.state = {};
    this.state = {
      currentActivity: { name: "All Off" },
      currentDevice: { name: "None" },
      devices: this.devices,
      avr: {
        power: false,
        input: "",
        mute: false,
        masterVolume: 0,
        surroundMode: "",
        centerVolume: 0,
        inputMode: "AUTO",
      },
      appletv: null,
      roku: null,
      tv: { power: false },
    };

    for (let device of this.theater.devices) {
      switch (device.type) {
        case "bravia":
          this.state.tv = device;
          break;
        case "lgtv":
          this.state.tv = device;
          break;
        case "denon":
          this.state.avr = device;
          break;
        case "appletv":
          this.state.appletv = device;
          break;
        case "tivo":
          this.state.tivo = device;
          break;
        case "harmony":
          this.state.harmony = device;
          break;
        case "roku":
          this.state.roku = device;
          break;
        default:
          break;
      }
    }

    //
    this.handleActivityClick = this.handleActivityClick.bind(this);
    this.handleDeviceClick = this.handleDeviceClick.bind(this);
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

  renderDevice(nowPlaying = false) {
    const currentDevice = this.state.currentDevice;
    if (!currentDevice || !currentDevice.type) {
      return null;
    }

    switch (currentDevice.type) {
      case "tivo":
        return nowPlaying ? null : <TivoControls device={this.state.tivo} />;
      case "bravia":
        return nowPlaying ? null : <BraviaControls device={this.state.tv} />;
      case "lgtv":
        return (
          nowPlaying ? null : <LGTVControls device={this.state.tv} input={this.state.tv.input} />
        );
      case "denon":
        return nowPlaying ? null : <DenonControls device={this.state.avr} />;
      case "harmony":
        return nowPlaying ? null : <HarmonyControls hub={this.state.harmony} />;
      case "roku":
        return nowPlaying ? null : <RokuControls device={this.state.roku} />;
      default:
        return <AppleTVControls device={this.state.appletv} nowPlaying={nowPlaying} />;
    }
  }

  render() {
    const state = Object.assign({}, this.state);
    this.theater.handleInputChange(state);
    //     console.log(
    //       "render",
    //       "tv",
    //       state.tv.power,
    //       state.tv.input,
    //       "avr",
    //       state.avr.power,
    //       state.avr.input
    //     );
    return (
      <>
        <div>
          {this.renderDevice(true)}
        </div>
        <Row style={{ marginTop: 12, padding: 8 }}>
          <Col sm={3}>
            <ActivitiesListGroup
              activities={this.theater.activities}
              currentActivity={state.currentActivity.name}
              onClick={this.handleActivityClick}
            />

            <div style={{ marginTop: 12 }} />

            <DevicesListGroup
              devices={this.theater.devices}
              tv={state.tv.input}
              avr={state.avr.input}
              /* state={this.state} */
              currentDevice={state.currentDevice}
              onClick={this.handleDeviceClick}
            />

            <div style={{ marginTop: 12 }} />

            <SpeakersListGroup tv={state.tv} avr={state.avr} />
          </Col>

          <Col sm={6}>
            <Row style={{ width: "100%",  }}>
              <Col sm={10}>
                {this.renderDevice()}
              </Col>
            </Row>
          </Col>

          <Col sm={3} style={{ paddingLeft: 60, marginRight: 0, width: '100%' }}>
            <AudioControls avr={state.avr} />
          </Col>

        </Row>
      </>
    );
  }
}

//
export default TheaterTab;
