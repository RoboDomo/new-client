import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { data as Config } from "lib/Config";

// one of these per theater
import ThermostatTab from "./ThermostatTab";
// one of these for overview
import ThermostatOverview from "./ThermostatOverview";

const LOCALSTORAGE_KEY = "ICOMFORT_TAB_STATE";

/**
 * ThermostatScreen is a tab panel that has a ThermostatTab per "IComfort" (e.g. one for MBR, one for Family Room, etc.)
 */
class ThermostatScreen extends React.Component {
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
        id="icomfort-tabs"
        onSelect={(eventKey) => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        <Tab title="All" eventKey={key} key={key}>
          <ThermostatOverview />
        </Tab>
        {Array.isArray(Config.icomfort.thermostats)
          ? Config.icomfort.thermostats.map((thermostat) => {
              /* console.log("thermostat", thermostat); */
              key++;
              return (
                <Tab
                  title= {"Zone" + thermostat.zone}
                  eventKey={key}
                  key={key}
                >
                  <ThermostatTab thermostat={thermostat} />
                </Tab>
              );
            })
          : null}
      </Tabs>
    );
  }
}

//
export default ThermostatScreen;
