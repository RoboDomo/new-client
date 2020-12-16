import React from "react";
import styles from "./styles";
import { BiHome } from "react-icons/bi";
import { BsFillPersonDashFill, BsFillPersonCheckFill } from "react-icons/bs";
import MQTT from "lib/MQTT";

class PresenceTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(1, 1);
    this.tile = props.tile;

    this.state = {};

    //
    this.handlePresence = this.handlePresence.bind(this);
  }

  handlePresence(topic, message) {
    const parts = topic.split("/"),
      key = parts[1],
      newState = {};

    newState[key] = message;
    this.setState(newState);
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

  render() {
    const style = Object.assign({}, this.style);
    style.padding = 8;

    const presence = this.tile.people || [];
    if (presence.length === 0) {
      return null;
    }

    const personStyle = {
      marginTop: -4,
    };

    let key =0;
    return (
      <div style={style}>
        <BiHome size={30} style={{ marginBottom: 8, color: style.color }} />
        {presence.map((person) => {
          const home = this.state[person.name];
          return (
            <div key={++key} style={{ fontSize: 19, color: !home ? "red" : "green" }}>
              {home ? (
                <BsFillPersonCheckFill style={personStyle} />
              ) : (
                <BsFillPersonDashFill style={personStyle} />
              )}
              &nbsp;&nbsp; {person.name}
            </div>
          );
        })}
      </div>
    );
  }
}

//
export default PresenceTile;
