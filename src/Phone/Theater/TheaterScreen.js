import React from "react";
import { Tabs, Tab } from "react-bootstrap";

import TheaterTab from "./TheaterTab";

import {data as Config} from "lib/Config";
const LOCALSTORAGE_KEY = "PHONE-THEATER-TABS";

class TheaterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1"
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
        onSelect={eventKey => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {Array.isArray(Config.theaters)
         ? Config.theaters.map(theater => {
           return (
             <Tab
               title={theater.title}
               eventKey={theater.key}
               key={theater.key}
             >
               <TheaterTab theater={theater} />
             </Tab>
           );
         })
         : null}
      </Tabs>
    );
  }
}

//
export default TheaterScreen;
