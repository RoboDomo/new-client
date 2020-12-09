import React from "react";
import { data as Config } from "lib/Config";

class ThingsSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.smartthings, null, 2)}
      </div>
    );
  }
}

//
export default ThingsSettings;
