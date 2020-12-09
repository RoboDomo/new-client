import React from 'react';
import { Tab, Tabs } from "react-bootstrap";
import {data as Config} from "lib/Config";

// one of these per theater
import TheaterTab from './TheaterTab';

const LOCALSTORAGE_KEY = "THEATER_TAB_STATE";

/**
 * TheaterScreen is a tab panel that has a TheaterTab per "theater" (e.g. one for MBR, one for Family Room, etc.)
 */
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

