import React from "react";
import { data as Config } from "lib/Config";

class HVACsSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.icomfort, null, 2)}
      </div>
    );
    
  }
}

//
export default HVACsSettings;
