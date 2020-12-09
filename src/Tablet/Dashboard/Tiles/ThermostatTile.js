import React from "react";
import styles from "./styles";

class ThermostatTile extends React.Component {
  constructor(props) {
    super(props);
    this.style = styles.tile(2,2);
    console.log(this.style);
  }
  render() {
    return <div style={this.style}>Thermostat</div>;
  }
}

//
export default ThermostatTile;
