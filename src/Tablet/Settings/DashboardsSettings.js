import React from "react";
import { Table } from "react-bootstrap";

import { data as Config } from "lib/Config";

class DashboardsSettings extends React.Component {
  constructor(props) {
    super();
    this.key = 0;
  }
  renderDashboard(dashboard) {
    const renderArgs = (tile) => {
      const args = [];
      for (const key of Object.keys(tile)) {
        if (key !== "device" && key !== "type") {
          args.push(key + ":" + JSON.stringify(tile[key]));
        }
      }
      return args.join(", ");
    };

    const renderDevice = (device) => {
      if (typeof device !== "object") {
        return device;
      }
      if (device && device.device) {
        return device.device;
      }
      return JSON.stringify(device);
    };

    return (
      <div key={++this.key}>
        <h1>{dashboard.title}</h1>
        <Table key={++this.key} striped>
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th>Settings</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.tiles.map((tile) => {
              return (
                <tr key={++this.key}>
                  <td>{renderDevice(tile.device)}</td>
                  <td>{tile.type.toUpperCase()}</td>
                  <td>{renderArgs(tile)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    return (
      <>
        {Config.dashboards.map((dashboard) => {
          return this.renderDashboard(dashboard);
        })}
      </>
    );
    //   return (
    //   <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
    //     {JSON.stringify(Config.dashboards, null, 2)}
    //   </div>
    // );
  }
}

//
export default DashboardsSettings;
