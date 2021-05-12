import React from "react";
import { Nav, Tabs, Tab } from "react-bootstrap";

import AlertsTab from "./AlertsTab.js";

const LOCALSTORAGE_KEY = "alerts-tab";

class AlertsScreen extends React.Component {
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
    let key = 1;
    const tabs = ["alert", "exception"];
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
        {tabs.map((tab) => {
          return (
            <Tab
              style-={{ padding: 10 }}
              title={tab}
              eventKey={key++}
              key={key++}
            >
              <div style={{ overflow: "auto", height: "85vh" }}>
                <AlertsTab type={tab} display="table" />
              </div>
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default AlertsScreen;
