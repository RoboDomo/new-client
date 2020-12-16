import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { MdVideocam, MdVolumeDown } from "react-icons/md";
import { data as Config } from "lib/Config";
import RingTab from "./RingTab";

const LOCALSTORAGE_KEY = "ringtab";

class RingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.ring = Config.ring;

    const doorbells = [];
    for (const ring of this.ring) {
      if (ring.type === "doorbell") {
        doorbells.push(ring);
      }
    }

    const chimes = [];
    for (const ring of this.ring) {
      if (ring.type === "chime") {
        chimes.push(ring);
      }
    }

    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
      doorbells: doorbells,
      chimes: chimes,
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
    const title = (ring) => {
      const fontSize = 20;
      if (ring.type === "doorbell") {
        return (
          <>
            <MdVideocam style={{ fontSize: fontSize }} /> {ring.device}
          </>
        );
      }
      return (
        <>
          <MdVolumeDown style={{ fontSize: fontSize }} /> {ring.device}
        </>
      );
    };

    return (
      <Tabs
        id="ring-tabs"
        onSelect={(eventKey) => {
          this.activeTab = eventKey;
        }}
        activeKey={this.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        {this.state.doorbells.map((doorbell) => {
          return (
            <Tab
              style={{ padding: 10 }}
              title={title(doorbell)}
              eventKey={key}
              key={++key}
            >
              <RingTab tile={doorbell} />
            </Tab>
          );
        })}
        {this.state.chimes.map((chime) => {
          return (
            <Tab
              style={{ padding: 10 }}
              title={title(chime)}
              eventKey={key}
              key={++key}
            >
              <RingTab tile={chime} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default RingScreen;
