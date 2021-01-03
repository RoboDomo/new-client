import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { data as Config } from "lib/Config";

import AutelisTab from "./AutelisTab";

const LOCALSTORAGE_KEY = "PHONE_AUTELIS_TAB_STATE";

/**
 * AutelisScreen is a tab panel that has a AutelisTab per "Autelis" (e.g. one for MBR, one for Family Room, etc.)
 */
class AutelisScreen extends React.Component {
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
    return (
      <Tabs
        id="autelis-tabs"
        onSelect={(eventKey) => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        <Tab
          title={Config.autelis.device.toUpperCase()}
          eventKey="autelis"
          key="autelis"
        >
          <AutelisTab />
        </Tab>
      </Tabs>
    );
  }
}

//
export default AutelisScreen;
