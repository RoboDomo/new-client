import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { data as Config } from "lib/Config";

import ThingsTab from "./ThingsTab";
import SensorsTab from "./SensorsTab";
const LOCALSTORAGE_KEY = "thingstabs";

class ThingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || "1",
    };

    const things = Config.smartthings.things;
    try {
      this.roomsMap = {
        All: [],
      };

      for (const thing of Config.smartthings.things) {
        this.roomsMap.All.push(thing);
        for (const room of thing.rooms) {
          if (room !== "*") {
            this.roomsMap[room] = this.roomsMap[room] || [];
            this.roomsMap[room].push(thing);
          }
        }
      }

      for (const thing of Config.smartthings.things) {
        for (const room of thing.rooms) {
          if (room === "*") {
            for (const r in this.roomsMap) {
              if (r !== "All") {
                this.roomsMap[r].push(thing);
              }
            }
          }
        }
      }

      // flatten rooms
      this.rooms = [];
      for (const name in this.roomsMap) {
        this.rooms.push({
          name: name,
          things: this.roomsMap[name],
        });
      }
    } catch (e) {
      console.log("exception", e);
    }
  }

  render() {
    return (
      <Tabs
        id="things-tabs"
        onSelect={eventKey => {
          localStorage.setItem(LOCALSTORAGE_KEY, eventKey);
          this.setState({ activeTab: eventKey});
        }}
        activeKey={this.state.activeTab}
        variant="pills"
        mountOnEnter
        unmountOnExit
        transition={false}
      >
        <Tab title="Sensors" eventKey={0} key={0}>
          <SensorsTab />
        </Tab>
        {this.rooms.map((room, ndx) => {
          const key = `things-room-${room.name}${ndx}`;
          return (
            <Tab
              title={room.name}
              eventKey={ndx+1}
              key={key+1}
              style={{ paddingLeft: 10, paddingRight: 10 }}
            >
              <ThingsTab room={room} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

//
export default ThingsScreen;
