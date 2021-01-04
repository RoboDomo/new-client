import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { data as config } from "lib/Config";

// one of these per theater
import DashboardTab from "./DashboardTab";

const LOCALSTORAGE_KEY = "DASHBOARD_TAB_STATE";

/**
 * DashboardScreen is a tab panel that has a DashboardTab per "Dashboard" (e.g. one for MBR, one for Family Room, etc.)
 */
class DashboardScreen extends React.Component {
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
        id="dashboard-tabs"
        onSelect={(eventKey) => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {Array.isArray(config.dashboards)
          ? config.dashboards.map((dashboard) => {
              return (
                <Tab
                  title={dashboard.title}
                  eventKey={dashboard.key}
                  key={dashboard.key}
                >
                  <DashboardTab dashboard={dashboard} />
                </Tab>
              );
            })
          : null}
      </Tabs>
    );
  }
}

//
export default DashboardScreen;
