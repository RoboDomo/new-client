import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { data as Config } from "lib/Config";

// one of these per theater
import WeatherTab from "./WeatherTab";

const LOCALSTORAGE_KEY = "WEATHER_TAB_STATE";

/**
 * WeatherScreen is a tab panel that has a WeatherTab per "Weather" (e.g. one for MBR, one for Family Room, etc.)
 */
class WeatherScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
    };
  }

  set activeTab(tab) {
    localStorage.setItem(LOCALSTORAGE_KEY, tab);
    const newState = Object.assign({}, this.state);
    newState.activeTab = tab;
    this.setState(newState);
  }

  get activeTab() {
    return this.state.activeTab;
  }

  render() {
    let key = 0;
    return (
      <Tabs
        id="weather-tabs"
        onSelect={(eventKey) => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {Config.weather.locations.map((location) => {
          return (
            <Tab
              title={location.name}
              /* title={Config.weather.device.toUpperCase()} */
              eventKey={key}
              key={"weather-" + key++}
            >
              <WeatherTab location={location} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default WeatherScreen;
