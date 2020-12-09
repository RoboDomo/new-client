import React from "react";
import styles from "./styles";

import Ripples from "react-ripples";
import { FaRunning } from "react-icons/fa";
import MQTT from "lib/MQTT";

class MacroTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(1, 1);
    this.label = props.label || props.tile.label;
    this.name = props.name || props.tile.name;

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    MQTT.publish("macros/run", this.name);
  }

  render() {
    const label = this.label,
          style = Object.assign({}, this.style);

    style.padding = 8;
    return (
      <Ripples color="#ffffff">
        <div style={style}>
          <div style={{ flexDirection: "column" }} onClick={this.onClick}>
            <div
              style={{ fontSize: 24, textAlign: "center", marginBottom: 2 }}
            >
              <FaRunning size={24} />
            </div>
            <div style={{ textAlign: "center" }}>{"Macro"}</div>
            <div>{label}</div>
          </div>
        </div>
      </Ripples>
    );
  }
}

//
export default MacroTile;
