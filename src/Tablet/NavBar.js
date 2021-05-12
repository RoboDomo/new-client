import React from "react";

import {
  //  Grid,
  Button,
  Navbar,
  TabContainer,
  TabContent,
  TabPane,
  Form,
  Nav,
  NavDropdown,
} from "react-bootstrap";

// icons
import { MdDashboard } from "react-icons/md";
import { IoIosTv } from "react-icons/io";
import { TiThermometer } from "react-icons/ti";
import { IoIosAnalytics } from "react-icons/io";
import { RiArrowRightCircleFill } from "react-icons/ri";
import { FaSwimmingPool, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TiWeatherCloudy } from "react-icons/ti";
import { MdMenu, MdSettings, MdVideoLibrary } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

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
import MicroservicesScreen from "./Microservices/MicroservicesScreen";
import AlertsScreen from "./Alerts/AlertsScreen";

const debug = require("debug")("NavBar");

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
  microservices: 10,
  10: "microservices",
  alerts: 11,
  11: "alerts",
};

const navDropdownTitles = {
  settings: "Settings",
  8: "Settings",
  systems: "Systems",
  9: "Systems",
  microservices: "Services",
  10: "Services",
  alerts: "Alerts",
  11: "Alerts",
};

const LOCALSTORAGE_KEY = "MAIN_TAB_STATE";

class NavBar extends React.Component {
  constructor() {
    super();
    const burger = navDropdownTitles[window.location.hash.substr(1)];
    console.log("construct", window.location.hash);
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
      muteSpeech: localStorage.getItem("mute-speech") || "false",
      burger: burger ? `(${burger})`: "More",
    };
    document.body.classList.add("tablet");
  }

  set activeTab(tab) {
    const state = Object.apply({}, this.state);
    state.activeTab = tab;
    this.setState(state);
  }

  get activeTab() {
    return this.state.activeTab;
  }

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      () => {
        const hash = window.location.hash.substr(1),
          info = tabInfo[hash];
        localStorage.setItem(LOCALSTORAGE_KEY, info);
        this.activeTab = info;
        if (info < 8) {
          this.setState({ burger: "More" });
        } else {
          this.setState({ burger: `(${navDropdownTitles[info]})`});
        }
        debug("hashchange", hash);
      },
      false
    );
  }

  renderTopBar() {
    const muteSpeech = this.state.muteSpeech,
          itemStyle = { width: 100, textAlign: 'center' };
      // itemStyle = { width: 'auto' };
    return (
      <Navbar
        fixed="top"
        className="justify-content-between"
        style={{ margin: "auto", width: 1024 }}
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
            style={{ width: 40, height: 20 }}
            variant={muteSpeech !== "false" ? "danger" : "success"}
            onClick={() => {
              const newSpeech = muteSpeech === "false" ? "true" : "false";
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
        <Nav
          className="ml-auto justify-content-between"
          defaultActiveKey={this.activeTab}
        >
          <Nav.Link style={itemStyle} eventKey={1}>
            <MdDashboard /> Home
          </Nav.Link>

          <Nav.Link style={itemStyle} eventKey={2}>
            <IoIosTv /> Theater
          </Nav.Link>

          <Nav.Link style={itemStyle} eventKey={3}>
            <TiThermometer />
            HVAC
          </Nav.Link>

          <Nav.Link style={itemStyle} eventKey={4}>
            <TiWeatherCloudy /> Weather
          </Nav.Link>

          <Nav.Link style={itemStyle} eventKey={5}>
            <FaSwimmingPool /> Pool
          </Nav.Link>

          <Nav.Link style={itemStyle} eventKey={6}>
            <MdMenu /> Things
          </Nav.Link>

          <Nav.Link style={itemStyle} eventKey={7}>
            <MdVideoLibrary /> Ring
          </Nav.Link>

          <NavDropdown
            alignRight
            active={this.state.burger !== "More"}
            title={
              <>
                <GiHamburgerMenu /> {this.state.burger}
              </>
            }
            /* id="more-dropdown" */
          >
            <NavDropdown.Item
              onClick={() => {
                this.setState({ burger: "(Settings)" });
                window.location.hash = "settings";
              }}
            >
              Settings
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                this.setState({ burger: "(Alerts)" });
                window.location.hash = "alerts";
              }}
            >
              Alerts
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                this.setState({ burger: "(Microservices)" });
                window.location.hash = "microservices";
              }}
            >
              Microservices
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                this.setState({ burger: "(Systems)" });
                window.location.hash = "systems";
              }}
            >
              Systems
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>
              Clear localStorage
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }

  renderPage() {
    return (
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

        <TabPane mountOnEnter unmountOnExit eventKey={10}>
          <MicroservicesScreen />
        </TabPane>

        <TabPane mountOnEnter unmountOnExit eventKey={11}>
          <AlertsScreen />
        </TabPane>

      </TabContent>
    );
  }

  render() {
    return (
      <TabContainer
        id="mainTabs"
        variant="pills"
        montOnEnter
        unmountOnExit
        transition={false}
        activeKey={parseInt(this.activeTab, 10)}
        onSelect={() => {}}
      >
        {this.renderPage()}
        {this.renderTopBar()}
      </TabContainer>
    );
  }
}

//
export default NavBar;
