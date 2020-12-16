import React from "react";
import {
  //  Grid,
  Button,
  Navbar,
  TabContainer,
  TabContent,
  TabPane,
  Nav,
} from "react-bootstrap";

// icons
import { MdDashboard } from "react-icons/md";
import { IoIosTv } from "react-icons/io";
import { TiThermometer } from "react-icons/ti";
import { IoIosAnalytics } from "react-icons/io";
import { FaSwimmingPool, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TiWeatherCloudy } from "react-icons/ti";
import { MdMenu, MdSettings, MdVideoLibrary } from "react-icons/md";
// import { IoIosColorPalette } from "react-icons/io";

// screens
import DashboardScreen from "./Dashboard/DashboardScreen";
import TheaterScreen from "./Theater/TheaterScreen";
import IComfortScreen from "./IComfort/IComfortScreen";
import AutelisScreen from "./Autelis/AutelisScreen";
import WeatherScreen from "./Weather/WeatherScreen";
import ThingsScreen from "./Things/ThingsScreen";
import RingScreen from "./Ring/RingScreen";
import SettingsScreen from "./Settings/SettingsScreen";
import SystemsScreen from "./Systems/SystemsScreen";

// import MQTTButton from "Common/MQTTButton";

const debug = require("debug")("MainScreen");

const tabInfo = {
  dashboard: 1,
  1: "dashboard",
  theater: 2,
  2: "theater",
  HVAC: 3,
  3: "HVAC",
  weather: 4,
  4: "weather",
  autelis: 5,
  5: "autelis",
  things: 6,
  6: "things",
  ring: 7,
  7: "ring",
  settings: 8,
  8: "settings",
  systems: 9,
  9: "systems",
};

const LOCALSTORAGE_KEY = "MAIN_TAB_STATE";

class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
      muteSpeech: localStorage.getItem("mute-speech") || "false",
    };
    document.body.classList.add("tablet");
    // debug("activeTab", this.state.activeTab);
  }

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      () => {
        const hash = window.location.hash.substr(1),
          info = tabInfo[hash];
        localStorage.setItem(LOCALSTORAGE_KEY, info);
        this.activeTab = info;
        debug("hashchange", hash);
      },
      false
    );
  }

  componentWillUnmount() {
    debug("componentWillUnmount");
  }

  set activeTab(tab) {
    const state = Object.apply({}, this.state);
    state.activeTab = tab;
    this.setState(state);
  }
  get activeTab() {
    return this.state.activeTab;
  }

  render() {
    const muteSpeech = this.state.muteSpeech;
    // debug("mainScreen render", window.innerWidth, window.innerHeight);
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            width: 1024,
            height: 768 - 20,
            margin: "auto",
            border: "1px solid green",
          }}
        >
          <div style={{ marginTop: 56 }}>
            <TabContainer
              id="mainTabs"
              variant="pills"
              montOnEnter
              unmountOnExit
              transition={false}
              activeKey={parseInt(this.activeTab, 10)}
              onSelect={() => {}}
            >
              <TabContent>
                <TabPane mountOnEnter unmountOnExit eventKey={1}>
                  <DashboardScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={2}>
                  <TheaterScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={3}>
                  <IComfortScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={4}>
                  <WeatherScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={5}>
                  <AutelisScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={6}>
                  <ThingsScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={7}>
                  <RingScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={8}>
                  <SettingsScreen />
                </TabPane>

                <TabPane mountOnEnter unmountOnExit eventKey={9}>
                  <SystemsScreen />
                </TabPane>
              </TabContent>
              <Navbar
                fixed="top"
                bg="primary"
                variant="dark"
                onSelect={(tab) => {
                  window.location.hash = "#" + tabInfo[tab];
                }}
              >
                <Navbar.Brand
                  onClick={() => {
                    window.location.reload();
                  }}
                  style={{ marginLeft: -24 }}
                >
                  <Button
                    style={{width: 40, height: 20}}
                    variant={muteSpeech !== "false" ? "danger" : "success"}
                    onClick={() => {
                      const newSpeech =
                        muteSpeech === "false" ? "true" : "false";
                      localStorage.setItem("mute-speech", newSpeech);
                      this.setState({ muteSpeech: newSpeech });
                    }}
                  >
                    {muteSpeech === "false" ? (
                      <FaVolumeUp style={{ marginTop: -24, marginLeft: -4 }} />
                    ) : (
                      <FaVolumeMute style={{ marginTop: -24, marginLeft: -4 }} />
                    )}
                  </Button>
                  <span style={{ marginLeft: 8 }}>RoboDomo</span>
                </Navbar.Brand>
                <Nav className="mr-auto" defaultActiveKey={this.activeTab}>
                  <Nav.Item>
                    <Nav.Link eventKey={1}>
                      <MdDashboard /> Dashboard
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Link eventKey={2}>
                    <IoIosTv /> Theater
                  </Nav.Link>

                  <Nav.Link eventKey={3}>
                    <TiThermometer />
                    HVAC
                  </Nav.Link>

                  <Nav.Link eventKey={4}>
                    <TiWeatherCloudy /> Weather
                  </Nav.Link>

                  <Nav.Link eventKey={5}>
                    <FaSwimmingPool /> Pool/Spa
                  </Nav.Link>

                  <Nav.Link eventKey={6}>
                    <MdMenu /> Things
                  </Nav.Link>

                  <Nav.Link eventKey={7}>
                    <MdVideoLibrary /> Ring
                  </Nav.Link>

                  <Nav.Link eventKey={8}>
                    <MdSettings /> Settings
                  </Nav.Link>
                  <Nav.Link eventKey={9}>
                    <IoIosAnalytics /> Systems
                  </Nav.Link>
                </Nav>
              </Navbar>
            </TabContainer>
          </div>
        </div>
      </div>
    );
  }
}

//
export default MainScreen;
