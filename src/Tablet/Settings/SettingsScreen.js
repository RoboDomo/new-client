import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import AlertsSettings from "./AlertsSettings";
import DashboardsSettings from "./DashboardsSettings";
import TheatersSettings from "./TheatersSettings";
import HVACSettings from "./HVACSettings";
import WeatherSettings from "./WeatherSettings";
import AutelisSettings from "./AutelisSettings";
import ThingsSettings from "./ThingsSettings";
import SensorsSettings from "./SensorsSettings";
import MicroservicesSettings from "./MicroservicesSettings";
// import VoicesSettings from "./VoicesSettings";

const LOCALSTORAGE_KEY = "settingstab";

const tabConfig = [
  {
    title: "Microservices",
    content: <MicroservicesSettings type="table" />,
  },
  { title: "Alerts", content: <AlertsSettings /> },
  // { title: "Voices", content: <VoicesSettings /> },
  { title: "Dashboards", content: <DashboardsSettings /> },
  { title: "Theaters", content: <TheatersSettings /> },
  { title: "HVAC", content: <HVACSettings /> },
  { title: "Weather", content: <WeatherSettings /> },
  { title: "Autelis", content: <AutelisSettings /> },
  { title: "Things", content: <ThingsSettings /> },
  { title: "Sensors", content: <SensorsSettings /> },
];

class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
    };
  }

  render() {
    let key = 0;
    return (
      <Tabs
        id="settings-tabs"
        onSelect={(eventKey) => {
          localStorage.setItem(LOCALSTORAGE_KEY, eventKey);
          this.setState({ activeTab: eventKey });
        }}
        activeKey={this.state.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {tabConfig.map((c, ndx) => {
          return (
            <Tab
              style={{ paddingLeft: 10, paddingRight: 10 }}
              title={c.title}
              eventKey={ndx}
              key={++key}
            >
              <div style={{ overflow: "auto", height: "85vh" }}>
                {c.content}
              </div>
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default SettingsScreen;
