import React from "react";
import { data as Config } from "lib/Config";

class DashboardsSettings extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(Config.dashboards, null, 2)}
      </div>
    );
    
  }
}

//
export default DashboardsSettings;
