import React from "react";
import { data as Config } from "lib/Config";

class AutelisSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.autelis, null, 2)}
      </div>
    );
    
  }
}

//
export default AutelisSettings;
