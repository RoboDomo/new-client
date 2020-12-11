import React from "react";
import styles from "./styles";
import { BiHome } from "react-icons/bi";
import MQTT from "lib/MQTT";

class PresenceTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(1, 1);
    this.tile = props.tile;

    console.log("presence", this.tile);
    this.state = {};

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
      MQTT.subscribe(`presence/${person}/status/present`, this.handlePresence);
    }
  }

  componentWillUnmount() {
    const presence = this.tile.people || [];
    for (const person of presence) {
      MQTT.unsubscribe(
        `presence/${person}/status/present`,
        this.handlePresence
      );
    }
  }

  render() {
    const style = Object.assign({}, this.style);
    style.padding = 8;

    const presence = this.tile.people || [];
    if (presence.length === 0) {
      return null;
    }
    return (
      <div style={style}>
        <BiHome size={30} style={{ marginBottom: 8, color: style.color }} />
        {presence.map((person) => {
          const home = this.state[person];
          return (
            <div style={{ color: !home ? "red" : undefined }}>
              {person} {home ? "HOME" : "AWAY"}
            </div>
          );
        })}
      </div>
    );
  }
}

//
export default PresenceTile;
