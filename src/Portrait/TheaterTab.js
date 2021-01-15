import React from "react";
import { Row, Col } from "react-bootstrap";

import Theater from "lib/Theater";

// import MQTT from "lib/MQTT";
// import { isOn, mangle } from "lib/Utils";
//import { data as Config } from "lib/Config";

import AudioControls from "./Devices/AudioControls";
//import ButtonList from "Tablet/Theater/ButtonList";
import ActivitiesListGroup from "Tablet/Theater/ActivitiesListGroup";
import DevicesListGroup from "Tablet/Theater/DevicesListGroup";
import SpeakersListGroup from "Tablet/Theater/SpeakersListGroup";

import AppleTVControls from "Tablet/Theater/Devices/AppleTVControls";
import RokuControls from "Tablet/Theater/Devices/RokuControls";
import TivoControls from "Tablet/Theater/Devices/TivoControls";
import BraviaControls from "Tablet/Theater/Devices/BraviaControls";
import LGTVControls from "Tablet/Theater/Devices/LGTVControls";
import DenonControls from "Tablet/Theater/Devices/DenonControls";
import HarmonyControls from "Tablet/Theater/Devices/HarmonyControls";

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

  renderDevice() {
    const currentDevice = this.state.currentDevice;
    if (!currentDevice || !currentDevice.type) {
      return null;
    }

    switch (currentDevice.type) {
      case "tivo":
        return <TivoControls device={this.state.tivo} />;
      case "bravia":
        return <BraviaControls device={this.state.tv} />;
      case "lgtv":
        return (
          <LGTVControls device={this.state.tv} input={this.state.tv.input} />
        );
      case "denon":
        return <DenonControls device={this.state.avr} />;
      case "harmony":
        return <HarmonyControls hub={this.state.harmony} />;
      case "roku":
        return <RokuControls device={this.state.roku} />;
      default:
        return <AppleTVControls device={this.state.appletv} />;
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

          <Col sm={9}>
            <Row style={{ width: "100%", textAlign: "center", paddingLeft: 50 }}>
              <Col sm={10}>
                {this.renderDevice()}
                <div style={{marginTop: 30}}><AudioControls avr={state.avr} /></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

//
export default TheaterTab;
