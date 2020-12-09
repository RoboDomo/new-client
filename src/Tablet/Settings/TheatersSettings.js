import React from "react";
import { data as Config } from "lib/Config";

class TheatersSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.theaters, null, 2)}
      </div>
    );
    
  }
}

//
export default TheatersSettings;
