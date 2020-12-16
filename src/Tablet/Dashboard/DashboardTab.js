import React from "react";

import ClockTile from "./Tiles/ClockTile";
import WeatherTile from "./Tiles/WeatherTile";
// import ThermostatTile from "./Tiles/ThermostatTile";
import IComfortTile from "./Tiles/IComfortTile";
import TheaterTile from "./Tiles/TheaterTile";
import PoolTile from "./Tiles/PoolTile";
import SpaTile from "./Tiles/SpaTile";
import GarageDoorTile from "./Tiles/GarageDoorTile";
import LockTile from "./Tiles/LockTile";
import MacroTile from "./Tiles/MacroTile";
import SwitchTile from "./Tiles/SwitchTile";
import DimmerTile from "./Tiles/DimmerTile";
import FanTile from "./Tiles/FanTile";
import PresenceTile from "./Tiles/PresenceTile";
import RGBTile from "./Tiles/RGBTile";
import RingTile from "./Tiles/RingTile";

class DashboardTab extends React.Component {
  constructor(props) {
    super(props);
    this.dashboard = props.dashboard;
    let key = 0;
    this.tiles = this.dashboard.tiles.map((tile) => {
      key++;
      const xkey = "tile-" + key;
      // console.log("tile", tile);
      switch (tile.type) {
        case "ring":
          return <RingTile key={xkey} tile={tile} />;
        case "rgb":
          return <RGBTile key={xkey} tile={tile} />;
        case "clock":
          return <ClockTile key={xkey} tile={tile} />;
        case "weather":
          return <WeatherTile key={xkey} tile={tile} />;
        case "presence":
          return <PresenceTile key={xkey} tile={tile} />;
        case "icomfort":
        case "thermostat":
        case "nest":
          // console.log("icomfort", tile);
          return <IComfortTile key={xkey} tile={tile} />;
        // case "thermostat":
        //   return <ThermostatTile key={key} />;
        case "theater":
          return <TheaterTile key={xkey} tile={tile} />;
        case "pool":
          return <PoolTile key={xkey} tile={tile} />;
        case "spa":
          return <SpaTile key={xkey} tile={tile} />;
        case "garagedoor":
          return <GarageDoorTile key={xkey} tile={tile} />;
        case "lock":
          return <LockTile key={xkey} tile={tile} />;
        case "macro":
          return <MacroTile key={xkey} tile={tile} />;
        case "switch":
          return <SwitchTile key={xkey} tile={tile} />;
        case "fan":
          return <FanTile key={xkey} tile={tile} />;
        case "dimmer":
          return <DimmerTile key={xkey} tile={tile} />;
        default:
          console.log(tile);
          return (
            <div
              key={xkey}
              style={{ width: 128, height: 128, border: "1px solid white" }}
            >
              {tile.device}
            </div>
          );
      }
    });
  }

  render() {
    return (
      <div
        style={{
          display: "inline-grid",
          gridTemplateColumns: "auto auto auto auto auto auto auto auto",
          gridTemplateRows: "auto auto auto auto",
          gridGap: 0,
          gridAutoRows: "minmax(256px, auto)",
          gridAutoFlow: "dense",
        }}
      >
        {this.tiles}
      </div>
    );
  }
}

//
export default DashboardTab;
