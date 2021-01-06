import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import TheaterTab from "./TheaterTab";

import { data as Config } from "lib/Config";

const LOCALSTORAGE_KEY = "PORTRAIT_TAB_STATE";

class Theater extends React.Component {
  constructor(props) {
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
    return (
      <Tabs
        id="theater-tabs"
        onSelect={(eventKey) => {
          localStorage.setItem("theaterTabState", eventKey);
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
      >
        {Config.theaters.map((theater) => {
          //          console.log("theater", theater);
          return (
            <Tab
              title={theater.title}
              eventKey={theater.key}
              key={theater.key}
              style={{ paddingLeft: 10, paddingRight: 10 }}
            >
              <TheaterTab theater={theater} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default Theater;
