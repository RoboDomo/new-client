import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { data as Config } from "lib/Config";

import ClockTile from "./ClockTile";
import DimmerTile from "./DimmerTile";
import GarageDoorTile from "./GarageDoorTile";
import FanTile from "./FanTile";
import MacroTile from "./MacroTile";
import PoolTile from "./PoolTile";
import SpaTile from "./SpaTile";
import SwitchTile from "./SwitchTile";
import TheaterTile from "./TheaterTile";
import ThermostatTile from "./ThermostatTile";
import WeatherTile from "./WeatherTile";

const LOCALSTORAGE_KEY = "PHONE-DASHBOARD-TABS";

class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log("DashboardScreen", props);
    this.state = {
      activeTab: localStorage.getItem(LOCALSTORAGE_KEY) || 1,
    };
  }

  renderListGroup(dashboard) {
    let key = 1;
    return (
      <ListGroup style={{marginBottom: 100}}>
        {dashboard.tiles.map((tile) => {
          switch (tile.type) {
            case "clock":
              return (
                <ListGroup.Item key={key++}>
                  <ClockTile tile={tile} />
                </ListGroup.Item>
              );
            case "garagedoor":
              return (
                <ListGroup.Item key={key++}>
                  <GarageDoorTile tile={tile} />
                </ListGroup.Item>
              );
            case "dimmer":
              return (
                <ListGroup.Item key={key++}>
                  <DimmerTile tile={tile} />
                </ListGroup.Item>
              );
            case "fan":
              return (
                <ListGroup.Item key={key++}>
                  <FanTile tile={tile} />
                </ListGroup.Item>
              );
            case "macro":
              return (
                <ListGroup.Item key={key++}>
                  <MacroTile tile={tile} />
                </ListGroup.Item>
              );
            case "pool":
              return (
                <ListGroup.Item key={key++}>
                  <PoolTile variant="success" tile={tile} />
                </ListGroup.Item>
              );
          case "spa":
              return (
                <ListGroup.Item key={key++}>
                  <SpaTile tile={tile} />
                </ListGroup.Item>
              );
            case "switch":
              return (
                <ListGroup.Item key={key++}>
                  <SwitchTile tile={tile} />
                </ListGroup.Item>
              );
            case "theater":
              return (
                <ListGroup.Item key={key++}>
                  <TheaterTile tile={tile} />
                </ListGroup.Item>
              );
            case "thermostat":
              return (
                <ListGroup.Item key={key++}>
                  <ThermostatTile tile={tile} />
                </ListGroup.Item>
              );
            case "weather":
              return (
                <ListGroup.Item key={key++}>
                  <WeatherTile tile={tile} />
                </ListGroup.Item>
              );
            default:
              return (
                <ListGroup.Item variant="danger" key={key++}>
                  <div>{tile.device || tile.type}</div>
                </ListGroup.Item>
              );
          }
        })}
      </ListGroup>
    );
  }

  renderCards(dashboard) {
    const getTile = (tile) => {
      switch (tile.type) {
        case "clock":
          return <ClockTile tile={tile} />;
        case "dimmer":
          return <DimmerTile tile={tile} />;
        case "fan":
          return <FanTile tile={tile} />;
        case "macro":
          return <MacroTile tile={tile} />;
        case "pool":
          return <PoolTile tile={tile} />;
        case "spa":
          return <SpaTile tile={tile} />;
        case "switch":
          return <SwitchTile tile={tile} />;
        case "theater":
          return <TheaterTile tile={tile} />;
        case "thermostat":
          return <ThermostatTile tile={tile} />;
        case "weather":
          return <WeatherTile tile={tile} />;
        default:
          return <div>{tile.device || tile.type}</div>;
      }
    };

    return (
      <div style={{ marginLeft: 10, marginRight: 10 }}>
        {dashboard.tiles.map((tile) => {
          return (
            <Card style={{ margin: "auto", marginBottom: 20 }}>
              <Card.Header>{tile.type}</Card.Header>
              <Card.Body>
                {getTile(tile)}
                {/* <Card.Text>{getTile(tile)}</Card.Text> */}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    );
  }

  render() {
    console.log("render", Config.dashboards);
    let key = 1;
    return (
      <>
        <Tabs
          id="dashbaoard-tabs"
          activeKey={this.state.activeTab}
          onSelect={(eventKey) => {
            this.setState({ activeTab: eventKey });
            localStorage.setItem(LOCALSTORAGE_KEY, eventKey);
          }}
          mountOnEnter
          unmountOnExit
          transition={false}
        >
          {Config.dashboards.map((dashboard) => {
            key++;
            return (
              <Tab key={key} eventKey={key} title={dashboard.title}>
                <div style={{ marginLeft: 10, marginRight: 10 }}>
                  <div style={{ height: "100vh", overflow: "auto" }}>
                    {this.renderListGroup(dashboard)}
                    {/* {this.renderCards(dashboard)} */}
                  </div>
                </div>
              </Tab>
            );
          })}
        </Tabs>
      </>
    );
  }
}

//
export default DashboardScreen;
