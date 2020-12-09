import React from "react";
import { Tab, Tabs } from "react-bootstrap";

import { data as Config } from "lib/Config";

import RGBTab from "./RGBTab";

const LOCALSTORAGE_KEY = "RGB_TAB_STATE";

class RGBScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY),
    };
  }

  render() {
    const tabs = Array.isArray(Config.rgb) ? Config.rgb : [Config.rgb];
    return (
      <Tabs
        id="rgbcontroller-tabs"
        onSelect={eventKey => {
          localStorage.setItem(LOCALSTORAGE_KEY, eventKey);
          this.setState({activeTab: eventKey});
        }}
        activeKey={this.state.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {tabs.map(rgb => {
          return (
            <Tab title={rgb.label} eventKey={rgb.label} key={rgb.label}>
              <RGBTab rgb={rgb} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default RGBScreen;
