import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import SystemsTab from "./SystemsTab";

import { data as Config } from "lib/Config";
// import MQTT from "lib/MQTT";

const LOCALSTORAGE_KEY = "settingstab";

class SystemsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
      systems: Config.systems,
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
        id="systems-tabs"
        onSelect={(eventKey) => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {this.state.systems.map((system, ndx) => {
          return (
            <Tab
              style={{ padding: 10 }}
              title={system}
              eventKey={ndx}
              key={++key}
            >
              <SystemsTab system={system} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default SystemsScreen;
