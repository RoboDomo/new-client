import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import MicroservicesTab from "./MicroservicesTab.js";

const LOCALSTORAGE_KEY = "microservices-tab";

class MicroservicesScreen extends React.Component {
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
    const tabs = ["Multimedia", "General", "System", "All"];
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
                <MicroservicesTab type={tab} display="table" />
              </div>
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default MicroservicesScreen;
