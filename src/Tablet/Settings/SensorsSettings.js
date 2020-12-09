import React from "react";
import { data as Config } from "lib/Config";

class SensorsSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.sensors, null, 2)}
      </div>
    );
  }
}

//
export default SensorsSettings;
