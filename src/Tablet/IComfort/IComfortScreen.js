import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { data as Config } from "lib/Config";

// one of these per theater
import IComfortTab from "./IComfortTab";
// one of these for overview
import IComfortOverview from "./IComfortOverview";

const LOCALSTORAGE_KEY = "ICOMFORT_TAB_STATE";

/**
 * IComfortScreen is a tab panel that has a IComfortTab per "IComfort" (e.g. one for MBR, one for Family Room, etc.)
 */
class IComfortScreen extends React.Component {
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
        <Tab title="Overview" eventKey={key} key={key}>
          <IComfortOverview />
        </Tab>
        {Array.isArray(Config.icomfort.thermostats)
          ? Config.icomfort.thermostats.map((thermostat) => {
              /* console.log("thermostat", thermostat); */
              key++;
              return (
                <Tab
                  title={thermostat.zone + ": " + thermostat.title}
                  eventKey={key}
                  key={key}
                >
                  <IComfortTab thermostat={thermostat} />
                </Tab>
              );
            })
          : null}
      </Tabs>
    );
  }
}

//
export default IComfortScreen;
