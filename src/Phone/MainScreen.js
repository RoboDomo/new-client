/*
  ____  _                       
  |  _ \| |__   ___  _ __   ___  
  | |_) | '_ \ / _ \| '_ \ / _ \ 
  |  __/| | | | (_) | | | |  __/ 
  |_|   |_| |_|\___/|_| |_|\___| 
  
  __  __       _       ____                            
  |  \/  | __ _(_)_ __ / ___|  ___ _ __ ___  ___ _ __   
  | |\/| |/ _` | | '_ \\___ \ / __| '__/ _ \/ _ \ '_ \  
  | |  | | (_| | | | | |___) | (__| | |  __/  __/ | | | 
  |_|  |_|\__,_|_|_| |_|____/ \___|_|  \___|\___|_| |_| 
*/

import React  from "react";

import {
  Nav,
  TabContainer,
  TabContent,
  TabPane,
} from "react-bootstrap";

import { FaSwimmingPool } from "react-icons/fa";
import { MdDashboard, MdMenu } from "react-icons/md";
import { IoIosTv, IoIosAnalytics } from "react-icons/io";
import { TiWeatherCloudy, TiThermometer } from "react-icons/ti";

import DashboardScreen from "Phone/Dashboard/DashboardScreen";
import TheaterScreen from "Phone/Theater/TheaterScreen";
// import Weather from "Phone/Weather/Weather";
// import Nest from "Phone/Nest/Nest";
// import Sensors from "Phone/Sensors/Sensors";
// import Autelis from "Phone/Autelis/Autelis";
// import SmartThings from "Phone/SmartThings/SmartThings";

const LOCALSTORAGE_KEY = "phone_key";

const tabInfo = {
  dashboard: 1,
  1: "dashboard",
  theater: 2,
  2: "theater",
  weather: 3,
  3: "weather",
  nest: 4,
  4: "nest",
  sensors: 5,
  5: "sensors",
  autelis: 6,
  6: "autelis",
  things: 7,
  7: "things",
  RGB: 8,
  8: "RGB",
};

const style = {
  nav: {
    // width: window.innerWidth / 7 - 4,
  },
};

/**
 * Phone Top Level App (Main) Screen
 */
class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log("mainWindow", props);
    document.body.classList.add("phone");
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || 1,
    };
  }

  render() {
    return (
      <div style={{ marginTop: 0, width: "100%" }}>
        <TabContainer
          activeKey={Number(this.state.activeTab)}
          id="mainTabs"
          style={{ width: "100%" }}
          variant="pills"
          mountOnEnter
          unmountOnExit
          transition={false}
          onSelect={() => {}}
        >
          <Nav
            fixed="top"
            className="fixed-top"
            justify
            fill
            variant="pills"
            defaultActiveKey={this.state.activeTab}
            onSelect={(tab) => {
              window.location.hash = "#" + tabInfo[tab];
              localStorage.setItem(LOCALSTORAGE_KEY, tab);
              this.setState({ activeTab: tab });
            }}
          >
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={1} style={{ margin: 0 }}>
                <MdDashboard />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={2} style={{ margin: 0 }}>
                <IoIosTv />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={3} style={{ margin: 0 }}>
                <TiWeatherCloudy />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={4} style={{ margin: 0 }}>
                <TiThermometer />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={5} style={{ margin: 0 }}>
                <IoIosAnalytics />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={6} style={{ margin: 0 }}>
                <FaSwimmingPool />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={7} style={{ margin: 0 }}>
                <MdMenu />
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {/* </Navbar> */}
          <TabContent style={{ marginTop: 46 }}>
            <TabPane eventKey={1}>
              <DashboardScreen />
            </TabPane>
            <TabPane eventKey={2}>{ <TheaterScreen /> }</TabPane>
            <TabPane eventKey={3}>{/* <Weather /> */}</TabPane>
            <TabPane eventKey={4}>{/* <Nest /> */}</TabPane>
            <TabPane eventKey={5}>{/* <Sensors /> */}</TabPane>
            <TabPane eventKey={6}>{/* <Autelis /> */}</TabPane>
            <TabPane eventKey={7}>{/* <SmartThings/> */}</TabPane>
          </TabContent>
        </TabContainer>
      </div>
    );
  }
}

/*
const MainScreenx = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem(LOCALSTORAGE_KEY) || "1"
  );

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener(
      "hashchange",
      () => {
        const hash = window.location.hash.substr(1),
          info = tabInfo[hash];
        localStorage.setItem(LOCALSTORAGE_KEY, info);
        setActiveTab(info);
      },
      false
    );
  }, []);

  return (
    <div style={{ marginTop: 0, width: "100%" }}>
      <TabContainer
        activeKey={parseInt(activeTab, 20)}
        id="mainTabs"
        style={{ width: "100%" }}
        variant="pills"
        mountOnEnter
        unmountOnExit
        onSelect={() => {}}
      >
        <Navbar
          className="fixed-bottom"
          bg="dark"
          variant="dark"
          style={{ marginBottom: 4 }}
          fixed="top"
          onSelect={(tab) => {
            window.location.hash = "#" + tabInfo[tab];
            localStorage.setItem(LOCALSTORAGE_KEY, tab);
            setActiveTab(tab);
          }}
        >
          <Nav justify fill variant="pills" defaultActiveKey={activeTab}>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={1} style={{ margin: 0 }}>
                <MdDashboard />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={2} style={{ margin: 0 }}>
                <IoIosTv />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={3} style={{ margin: 0 }}>
                <TiWeatherCloudy />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={4} style={{ margin: 0 }}>
                <TiThermometer />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={5} style={{ margin: 0 }}>
                <IoIosAnalytics />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={6} style={{ margin: 0 }}>
                <FaSwimmingPool />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={style.nav}>
              <Nav.Link eventKey={7} style={{ margin: 0 }}>
                <MdMenu />
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <TabContent style={{ marginTop: 8 }}>
          <TabPane eventKey={1}>
            <div>Dashboard</div>
          </TabPane>
          <TabPane eventKey={2}></TabPane>
          <TabPane eventKey={3}></TabPane>
          <TabPane eventKey={4}></TabPane>
          <TabPane eventKey={5}></TabPane>
          <TabPane eventKey={6}></TabPane>
          <TabPane eventKey={7}></TabPane>
        </TabContent>
      </TabContainer>
    </div>
  );
};
*/

export default MainScreen;
