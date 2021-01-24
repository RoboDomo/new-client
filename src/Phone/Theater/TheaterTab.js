/*
 ____  _                       
|  _ \| |__   ___  _ __   ___  
| |_) | '_ \ / _ \| '_ \ / _ \ 
|  __/| | | | (_) | | | |  __/ 
|_|   |_| |_|\___/|_| |_|\___| 
                               
 _____ _                _           _____     _      
|_   _| |__   ___  __ _| |_ ___ _ _|_   _|_ _| |__   
  | | | '_ \ / _ \/ _` | __/ _ \ '__|| |/ _` | '_ \  
  | | | | | |  __/ (_| | ||  __/ |   | | (_| | |_) | 
  |_| |_| |_|\___|\__,_|\__\___|_|   |_|\__,_|_.__/  
*/

import React from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";

import { FaVolumeMute, FaVolumeUp, FaVolumeDown } from "react-icons/fa";

import Theater from "lib/Theater";

import ActivitiesMenu from "./ActivitiesMenu";
import DevicesMenu from "./DevicesMenu";

// import Audio from "./Devices/Audio";
import TiVo from "./Devices/TiVo";
import AppleTV from "./Devices/AppleTV";
import Bravia from "./Devices/Bravia";
import Roku from "./Devices/Roku";
// import LGTVControl from "./Devices/LGTV";
import Harmony from "./Devices/Harmony";

class TheaterTab extends React.Component {
  constructor(props) {
    super();
    this.config = props.theater;
    this.theater = new Theater(this.config);
    this.activities = this.theater.activities;
    this.devices = this.theater.devices;
    this.state = {};

    //
    this.handleActivityClick = this.handleActivityClick.bind(this);
    this.handleDeviceClick = this.handleDeviceClick.bind(this);
    this.handleSpeakersClick = this.handleSpeakersClick.bind(this);
  }

  handleActivityClick(activity) {
    this.theater.startActivity(activity);
    this.setState({ show: false });
  }

  handleDeviceClick(device) {
    this.theater.startDevice(device);
    this.setState({ show: false });
  }

  handleSpeakersClick(speakers) {
    console.log("clicked speakers", speakers);
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

  renderActivities() {
    return (
      <>
        <h4>Activities</h4>
        <div style={{ textAlign: "center" }}>
          <ActivitiesMenu
            onSelect={this.handleActivityClick}
            activities={this.activities}
            currentActivity={this.state.currentActivity}
          />
        </div>
      </>
    );
  }

  renderDevices() {
    return (
      <>
        <h4>Devices</h4>
        <div style={{ textAlign: "center" }}>
          <DevicesMenu
            onSelect={this.handleDeviceClick}
            devices={this.devices}
            currentDevice={this.state.currentDevice}
          />
        </div>
      </>
    );
  }

  renderModal() {
    const renderActivities = () => {
      if (this.state.modal !== "activities") {
        return null;
      }
      return this.renderActivities();
    };

    const renderDevices = () => {
      if (this.state.modal !== "devices") {
        return null;
      }
      return this.renderDevices();
    };

    return (
      <Modal
        show={this.state.show}
        onHide={() => {
          this.setState({ show: false });
        }}
      >
        <Modal.Header>
          <h1>
            {this.state.modal === "activies"
              ? "Choose Activity"
              : "Choose Device"}
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div style={{ flex: 1, fontSize: 18, textAlign: "center" }}>
            {renderActivities()}
            {renderDevices()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ show: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderDevice() {
    const currentDevice = this.state.currentDevice;
    if (!currentDevice) {
      return null;
    }
    switch (currentDevice.type) {
      
      case "tivo":
        return (
          <TiVo
            currentDevice={this.state.currentDevice}
            currentActivity={this.state.currentActivity}
            activities={this.activities}
            control={this.state.tivo}
          />
        );

      case "bravia":
        return (
          <Bravia
            currentDevice={this.state.currentDevice}
            currentActivity={this.state.currentActivity}
            activities={this.activities}
            control={this.state.tv}
          />
        );

      case "roku":
        return (
          <Roku
            currentDevice={this.state.currentDevice}
            currentActivity={this.state.currentActivity}
            activities={this.activities}
            control={this.state.tv}
          />
        );

      case "harmony":
        return (
          <Harmony
            currentDevice={this.state.currentDevice}
            currentActivity={this.state.currentActivity}
            activities={this.activities}
            hub={this.state.harmony}
          />
        );
      //     case "LG TV":
      //       console.log("deviceMap", deviceMap);
      //       if (!deviceMap.lgtv) {
      //         return null;
      //       }
      //       return <LGTVControl config={deviceMap.lgtv} />;

      case "appletv":
        return (
          <AppleTV
            currentDevice={this.state.currentDevice}
            currentActivity={this.state.currentActivity}
            activities={this.activities}
            control={this.state.appletv}
          />
        );

      default:
        console.log("renderDevice unknown", currentDevice);
    }

    return null;
  }

  renderButtonBar() {
    return (
      <>
        <Row>
          <Col>
            <Button
              onClick={() => {
                this.setState({ show: true, modal: "activities" });
              }}
            >
              Activity
            </Button>
            <span style={{ marginLeft: 10 }}>
              {this.state.currentActivity.name}
            </span>
          </Col>
          <Col>
            <Button
              onClick={() => {
                this.setState({ show: true, modal: "devices" });
              }}
            >
              Device
            </Button>
            <span style={{ marginLeft: 10 }}>
              {this.state.currentDevice
                ? this.state.currentDevice.name.replace(" Hub", "")
                : "Not Selected"}
            </span>
          </Col>
        </Row>
      </>
    );
  }

  renderToolbar() {
    if (!this.state.currentDevice) {
      return (
        <>
          <h1>Choose Activity</h1>
          {this.renderActivities()}
        </>
      );
    }
    return this.renderButtonBar();
  }

  renderAudioControls() {
    const { avr } = this.state;
    if (!avr || !avr.power) {
      return null;
    }

    const format = (n) => {
      if (n === null || n === undefined) {
        return 0;
      }
      if (typeof n === "number") {
        if (n > 99) {
          return n / 10;
        }
        return n;
      }
      if (n.length === 3) {
        return Number(n) / 10;
      }
      return Number(n);
    };

    return (
      <div style={{ textAlign: "center" }}>
        <h4 style={{ marginBottom: 0 }}>{avr.title}</h4>
        <div style={{ marginBottom: 4 }}>
          {avr.input} / {avr.surroundMode}
        </div>
        <div>
          <Button>
            <FaVolumeMute />
          </Button>
          <Button>
            <FaVolumeDown />
          </Button>
          <span style={{ marginLeft: 10, marginRight: 10 }}>
            {format(avr.masterVolume)}
          </span>
          <Button>
            <FaVolumeUp />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.avr || !this.state.tv) {
      return null;
    }
    return (
      <div style={{ padding: 8 }}>
        {this.renderToolbar()}
        {this.renderModal()}
        <div style={{ marginTop: 10 }}>{this.renderDevice()}</div>

        <div style={{ height: 10 }} />
        <div>{this.renderAudioControls()}</div>
        {/* <Audio avr={avr} /> */}
      </div>
    );
  }
}

//
export default TheaterTab;
