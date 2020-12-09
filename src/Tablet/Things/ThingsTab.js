import React from "react";

import MQTT from "lib/MQTT";
import { isOn } from "lib/Utils";

import ToggleField from "Common/Form/ToggleField";
import DimmerField from "Common/Form/DimmerField";
import FanField from "Common/Form/FanField";
import DisplayField from "Common/Form/DisplayField";

class ThingsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      things: {
        dimmer: {},
        fan: {},
        switch: {},
        motion: {},
        presence: {},
        button: {},
        contact: {},
        temperature: {},
      },
    };

    //
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.toggleDimmer = this.toggleDimmer.bind(this);
    this.handleFanChange = this.handleFanChange.bind(this);

    this.handleFanMessage = this.handleFanMessage.bind(this);
    this.handleSwitchMessage = this.handleSwitchMessage.bind(this);
    this.handleDimmerMessage = this.handleDimmerMessage.bind(this);
  }

  handleFanMessage(topic, message) {
    const parts = topic.split("/"),
      name = parts[1],
      t = parts.pop();

    const newState = Object.assign({}, this.state);
    if (t === "level") {
      newState.things.fan[name][t] = Number(message);
      this.setState(newState);
    } else {
      newState.things.fan[name][t] = isOn(message);
      this.setState(newState);
    }
  }

  handleSwitchMessage(topic, message) {
    const parts = topic.split("/"),
      name = parts[1],
      t = parts.pop();

    const newState = Object.assign({}, this.state);
    newState.things.switch[name][t] = isOn(message);
    this.setState(newState);
  }

  handleDimmerMessage(topic, message) {
    const parts = topic.split("/"),
      name = parts[1],
      t = parts.pop();

    const newState = Object.assign({}, this.state);
    if (t === "level") {
      newState.things.dimmer[name][t] = Number(message);
      this.setState(newState);
    } else {
      newState.things.dimmer[name][t] = isOn(message);
      this.setState(newState);
    }
  }

  toggleSwitch(name, state) {
    const newState = Object.assign({}, this.state);
    const thing = newState.things.switch[name];
    thing.switch = isOn(state);
    this.setState(newState);
    MQTT.publish(
      `${thing.hub}/${thing.name}/set/switch`,
      isOn(thing.switch) ? "on" : "off"
    );
  }

  toggleDimmer(name, state) {
    const newState = Object.assign({}, this.state);
    const thing = newState.things.dimmer[name];
    thing.switch = isOn(state);
    this.setState(newState);
    MQTT.publish(
      `${thing.hub}/${thing.name}/set/switch`,
      isOn(thing.switch) ? "on" : "off"
    );
  }

  handleFanChange(name, state) {
    const levels = {
      low: 25,
      medium: 50,
      high: 75,
    };

    const thing = this.state.things.fan[name];
    console.log("thing", thing, name, state);
    if (levels[state]) {
      if (!isOn(thing.switch)) {
        thing.switch = true;
        MQTT.publish(
          `${thing.hub}/${thing.name}/set/switch`,
          isOn(thing.switch) ? "on" : "off"
        );
      }
      thing.level = levels[state];
      MQTT.publish(`${thing.hub}/${thing.name}/set/level`, thing.level);
    } else {
      thing.switch = !thing.switch;
      MQTT.publish(
        `${thing.hub}/${thing.name}/set/switch`,
        isOn(thing.switch) ? "on" : "off"
      );
    }
  }

  componentDidMount() {
    const newState = Object.assign({}, this.state);
    for (const thing of this.state.room.things) {
      switch (thing.type) {
        case "fan":
          MQTT.subscribe(
            `${thing.hub}/${thing.name}/status/switch`,
            this.handleFanMessage
          );
          MQTT.subscribe(
            `${thing.hub}/${thing.name}/status/level`,
            this.handleFanMessage
          );
          newState.things.fan[thing.name] = thing;
          break;
        case "dimmer":
          MQTT.subscribe(
            `${thing.hub}/${thing.name}/status/switch`,
            this.handleDimmerMessage
          );
          MQTT.subscribe(
            `${thing.hub}/${thing.name}/status/level`,
            this.handleDimmerMessage
          );
          newState.things.dimmer[thing.name] = thing;
          break;
        case "switch":
          MQTT.subscribe(
            `${thing.hub}/${thing.name}/status/switch`,
            this.handleSwitchMessage
          );
          newState.things.switch[thing.name] = thing;
          break;
        default:
          console.log("unknown thing type", thing.type, thing);
          break;
      }
    }
  }

  componentWillUnmount() {
    for (const thing of this.state.room.things) {
      switch (thing.type) {
        case "fan":
          MQTT.unsubscribe(
            `${thing.hub}/${thing.name}/status/switch`,
            this.handleFanMessage
          );
          MQTT.unsubscribe(
            `${thing.hub}/${thing.name}/status/level`,
            this.handleFanMessage
          );
          break;
        case "dimmer":
          MQTT.unsubscribe(
            `${thing.hub}/${thing.name}/status/switch`,
            this.handleDimmerMessage
          );
          MQTT.unsubscribe(
            `${thing.hub}/${thing.name}/status/level`,
            this.handleDimmerMessage
          );
          break;
        case "switch":
          MQTT.unsubscribe(
            `${thing.hub}/${thing.name}/status/switch`,
            this.handleSwitchMessage
          );
          break;
        default:
          console.log("unknown thing type", thing.type, thing);
          break;
      }
    }
  }

  render() {
    const room = this.state.room,
      things = this.state.things;

    return (
      <div style={{ overflow: "scroll", height: "100vh", paddingBottom: 300 }}>
        <div
          style={{
            width: "50%",
            margin: "auto",
          }}
        >
          {room.things.map((thing, ndx) => {
            const key = `${room.name}-${thing.name}-${ndx}`,
              type = thing.type;
            let t;
            switch (type) {
              case "switch":
                t = things.switch[thing.name];
                if (!t) {
                  return null;
                }
                const toggled = t.switch;
                return (
                  <ToggleField
                    key={key}
                    name={thing.name}
                    label={thing.name}
                    toggled={toggled}
                    onToggle={this.toggleSwitch}
                  />
                );
              case "dimmer":
                t = things.dimmer[thing.name];
                if (!t) {
                  return null;
                }
                return (
                  <DimmerField
                    key={key}
                    name={thing.name}
                    label={thing.name}
                    value={t.level}
                    toggled={t.switch}
                    onToggle={this.toggleDimmer}
                    onValueChange={(name, level) => {
                      console.log("value changed", name, level);
                      MQTT.publish(`${t.hub}/${t.name}/set/level`, level);
                      t.level = level;
                    }}
                  />
                );
              case "fan":
                t = things.fan[thing.name];
                if (!t) {
                  return null;
                }
                return (
                  <FanField
                    key={key}
                    name={thing.name}
                    label={thing.name}
                    toggled={t.switch}
                    value={t.level}
                    onChange={this.handleFanChange}
                  />
                );
              case "motion":
                t = things.motion[thing.name];
                if (!t) {
                  return null;
                }
                return (
                  <DisplayField
                    key={key}
                    label={thing.name}
                    value={"motion " + t.motion}
                  />
                );
              case "presence":
                t = things.presence[thing.name];
                if (!t) {
                  return null;
                }
                return (
                  <DisplayField
                    key={key}
                    label={thing.name}
                    value={t.presence}
                  />
                );
              case "contact":
                t = things.contact[thing.name];
                if (!t) {
                  return null;
                }
                return (
                  <DisplayField
                    key={key}
                    label={thing.name}
                    value={"contact " + t.contact}
                  />
                );
              case "temperature":
                t = things.temperature[thing.name];
                if (!t) {
                  return null;
                }
                return (
                  <DisplayField
                    key={key}
                    label={thing.name}
                    value={t.temperature}
                  />
                );
              case "acceleration":
              case "threeAxis":
                return null;
              default:
                return (
                  <div key={key}>
                    {thing.name} {thing.type}
                  </div>
                );
            }
          })}
        </div>
      </div>
    );
  }
}

//
export default ThingsTab;
