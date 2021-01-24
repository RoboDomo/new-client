import React from "react";
import { ListGroup } from "react-bootstrap";
import DimmerTile from "Phone/Dashboard/Tiles/DimmerTile";
import FanTile from "Phone/Dashboard/Tiles/FanTile";
import RGBTile from "Phone/Dashboard/Tiles/RGBTile";
import SwitchTile from "Phone/Dashboard/Tiles/SwitchTile";

import { data as Config } from "lib/Config";

class ThingsScreen extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    console.log("Config", Config.smartthings.things);
    const things = [...Config.smartthings.things].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    let key = 0;
    return (
      <div style={{ height: "100vh", padding: 8, overflow: "auto" }}>
        <h4>Things</h4>
        <ListGroup style={{ marginBottom: 100 }}>
          {things.map((thing) => {
            thing.device = thing.name;
            switch (thing.type) {
              case "dimmer":
                return (
                  <ListGroup.Item key={++key}>
                    <DimmerTile tile={thing} />
                  </ListGroup.Item>
                );
              case "fan":
                return (
                  <ListGroup.Item key={++key}>
                    <FanTile tile={thing} />
                  </ListGroup.Item>
                );
              case "rgb":
                return (
                  <ListGroup.Item key={++key}>
                    <RGBTile tile={thing} />
                  </ListGroup.Item>
                );
              case "switch":
                return (
                  <ListGroup.Item key={++key}>
                    <SwitchTile tile={thing} />
                  </ListGroup.Item>
                );

              default:
                return (
                  <ListGroup.Item key={++key}>{thing.name}</ListGroup.Item>
                );
            }
          })}
        </ListGroup>
      </div>
    );
  }
}

//
export default ThingsScreen;
