import React from "react";
import { data as Config } from "lib/Config";

class WeathersSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.weather, null, 2)}
      </div>
    );
    
  }
}

//
export default WeathersSettings;
