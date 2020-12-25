import React from "react";

import { BsFillPersonDashFill, BsFillPersonCheckFill } from "react-icons/bs";
import MQTT from "lib/MQTT";

class PresenceTile extends React.Component {
  constructor(props) {
    super();
    this.tile = props.tile;

    this.state = {};

    //
    this.handlePresence = this.handlePresence.bind(this);
  }

  componentDidMount() {
    const presence = this.tile.people || [];

    for (const person of presence) {
      for (const device of person.devices) {
        MQTT.subscribe(
          `presence/${person.name}/status/${device}`,
          this.handlePresence
        );
      }
    }
  }

  componentWillUnmount() {
    const presence = this.tile.people || [];
    for (const person of presence) {
      for (const device of person.devices) {
        MQTT.unsubscribe(
          `presence/${person.name}/status/${device}`,
          this.handlePresence
        );
      }
    }
  }

  handlePresence(topic, message) {
    const parts = topic.split("/"),
      key = parts[1],
      newState = {};

    newState[key] = message;
    this.setState(newState);
  }

  render() {
    const presence = this.tile.people || [];
    if (presence.length === 0) {
      return null;
    }
    const personStyle = {
      marginTop: -4,
    };
    let key = 0;
    return (
      <>
        <div style={{float: "left"}}>Presence</div>
        {presence.map((person) => {
          const home = this.state[person.name];
          return (
            <div
              key={++key}
              style={{ textAlign: "right", fontSize: 19, color: !home ? "red" : "green" }}
            >
              {home ? (
                <BsFillPersonCheckFill style={personStyle} />
              ) : (
                <BsFillPersonDashFill style={personStyle} />
              )}
              &nbsp;&nbsp; {person.name}
            </div>
          );
        })}
      </>
    );
  }
}

//
export default PresenceTile;
