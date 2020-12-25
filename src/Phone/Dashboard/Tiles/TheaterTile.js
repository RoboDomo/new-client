import React from "react";

import { CgScreen } from "react-icons/cg";

import MQTT from "lib/MQTT";
import { data as Config } from "lib/Config";
import { mangle, isOn } from "lib/Utils";

const format = (n) => {
  if (n === null || n === undefined) {
    return 0;
  }
  if (typeof n === "number") {
    if (n > 99) {
      return n / 10;
    }
    return n;
  }
  if (n.length === 3) {
    return Number(n) / 10;
  }
  return Number(n);
};

class TheaterTile extends React.Component {
  constructor(props) {
    super(props);
    this.title = props.tile.title;
    this.deviceMap = {};
    this.activitiesMap = {};

    for (const t of Config.theaters) {
      if (t.title === this.title) {
        this.theater = t;
        break;
      }
    }
    if (!this.theater) {
      return;
    }

    this.devices = this.theater.devices;
    this.activities = this.theater.activities;

    for (const device of this.devices) {
      this.deviceMap[mangle(device.type)] = device;
      switch (device.type.toLowerCase()) {
        case "lgtv":
        case "bravia":
          this.tv = device;
          break;
        case "avr":
        case "denon":
          this.avr = device;
          break;
        case "appletv":
          this.appletv = device;
          break;
        case "roku":
          this.roku = device;
          break;
        case "tivo":
          this.tivo = device;
          break;
        default:
          break;
      }
    }

    for (const activity of this.activities) {
      this.activitiesMap[activity.type] = activity;
    }

    this.state = {};
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    if (!message) {
      return;
    }
    if (~topic.indexOf("input")) {
      this.setState({ tvInput: message });
    } else if (~topic.indexOf("SI")) {
      this.setState({ avrInput: message });
    } else if (~topic.indexOf("PW")) {
      this.setState({ avrPower: isOn(message) });
    } else if (~topic.indexOf("MV")) {
      this.setState({ volume: message });
    } else if (~topic.indexOf("MU")) {
      this.setState({ mute: isOn(message) });
    } else if (~topic.indexOf("channels")) {
      this.setState({ channels: message });
    } else if (~topic.indexOf("channel")) {
      this.setState({ channel: message });
    } else if (~topic.indexOf("info")) {
      this.setState({ info: message });
    } else if (~topic.indexOf("power")) {
      this.setState({ tvPower: isOn(message) });
    } else if (~topic.indexOf("launchPoints")) {
      this.setState({ launchPoints: message });
      if (this.state.foregroundApp) {
        const foregroundApp = this.state.foregroundApp;
        const app = this.state.launchPoints[foregroundApp.appId];
        if (app && app.title) {
          const title = app.title;
          const lp = title || "unknown";
          const inp = this.state.tvPower ? lp : "OFF";

          this.setState({ tvInput: inp });
        }
      }
    } else if (~topic.indexOf("foregroundApp")) {
      this.setState({ foregroundApp: message });
      if (!this.state.launchPoints) {
        this.setState({ tvInput: "OFF" });
      } else {
        const foregroundApp = this.state.foregroundApp;
        if (foregroundApp.appId !== "") {
          const app = this.state.launchPoints[foregroundApp.appId];
          const title = app.title;
          const lp = title || "unknown";
          const inp = this.state.tvPower ? lp : "OFF";
          this.setState({ tvInput: inp });
        }
      }
    }
  }

  componentDidMount() {
    if (this.theater && this.theater.guide) {
      MQTT.subscribe(
        `tvguide/${this.theater.guide}/status/channels`,
        this.handleMessage
      );
    }
    if (this.tv) {
      if (this.tv.type === "bravia") {
        MQTT.subscribe(
          `bravia/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.subscribe(
          `bravia/${this.tv.device}/status/input`,
          this.handleMessage
        );
      } else if (this.tv.type === "lgtv") {
        MQTT.subscribe(
          `lgtv/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.subscribe(
          `lgtv/${this.tv.device}/status/launchPoints`,
          this.handleMessage
        );
        MQTT.subscribe(
          `lgtv/${this.tv.device}/status/foregroundApp`,
          this.handleMessage
        );
      }
    }

    if (this.avr) {
      MQTT.subscribe(`denon/${this.avr.device}/status/PW`, this.handleMessage);
      MQTT.subscribe(`denon/${this.avr.device}/status/SI`, this.handleMessage);
      MQTT.subscribe(`denon/${this.avr.device}/status/MV`, this.handleMessage);
      MQTT.subscribe(`denon/${this.avr.device}/status/MU`, this.handleMessage);
    }

    if (this.tivo) {
      MQTT.subscribe(
        `tivo/${this.tivo.device}/status/channel`,
        this.handleMessage
      );
    }

    if (this.appletv) {
      MQTT.subscribe(
        `appletv/${this.appletv.device}/status/info`,
        this.handleMessage
      );
    }
  }

  componentWillUnmount() {
    if (this.theater && this.theater.guide) {
      MQTT.unsubscribe(
        `tvguide/${this.theater.guide}/status/channels`,
        this.handleMessage
      );
    }
    if (this.tv) {
      if (this.tv.type === "bravia") {
        MQTT.unsubscribe(
          `bravia/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.unsubscribe(
          `bravia/${this.tv.device}/status/input`,
          this.handleMessage
        );
      } else if (this.tv.type === "lgtv") {
        MQTT.unsubscribe(
          `lgtv/${this.tv.device}/status/power`,
          this.handleMessage
        );
        MQTT.unsubscribe(
          `lgtv/${this.tv.device}/status/launchPoints`,
          this.handleMessage
        );
        MQTT.unsubscribe(
          `lgtv/${this.tv.device}/status/foregroundApp`,
          this.handleMessage
        );
      }
    }

    if (this.avr) {
      MQTT.unsubscribe(
        `denon/${this.avr.device}/status/PW`,
        this.handleMessage
      );
      MQTT.unsubscribe(
        `denon/${this.avr.device}/status/SI`,
        this.handleMessage
      );
      MQTT.unsubscribe(
        `denon/${this.avr.device}/status/MV`,
        this.handleMessage
      );
      MQTT.unsubscribe(
        `denon/${this.avr.device}/status/MU`,
        this.handleMessage
      );
    }

    if (this.tivo) {
      MQTT.unsubscribe(
        `tivo/${this.tivo.device}/status/channel`,
        this.handleMessage
      );
    }

    if (this.appletv) {
      MQTT.unsubscribe(
        `appletv/${this.appletv.device}/status/info`,
        this.handleMessage
      );
    }
  }

  getActivityInfo() {
    let currentActivity = null;

    if (!this.state.tvPower) {
      return null;
    }
    const tvInput = mangle(this.state.tvInput),
      avrInput = mangle(this.state.avrInput);

    for (const activity of this.activities) {
      if (activity.inputs) {
        const tv = mangle(activity.inputs.tv);
        const avr = mangle(activity.inputs.avr);
        if (tv === tvInput && avr === avrInput) {
          currentActivity = activity;
        }
      } else if (!currentActivity) {
        currentActivity = activity;
      }
    }

    return currentActivity;
  }

  render() {
    if (!this.theater) {
      return <div>Theater</div>;
    }

    const activity = this.getActivityInfo();
    if (!activity) {
      return <div>Theater</div>;
    }
    // if (!activity) {
    //   return (
    //     <div>
    //       <CgScreen
    //         style={{
    //           marginTop: -4,
    //           marginLeft: 6,
    //           marginRight: 8,
    //           fontSize: 24,
    //         }}
    //       />
    //       Theater is off.
    //     </div>
    //   );
    // }
    const device = this.deviceMap[mangle(activity.defaultDevice)];

    const renderActivity = () => {
      if (!activity) {
        return <span>Theater</span>;
      }
      return (
        <>
          <span>{activity.name}</span>
        </>
      );
    };

    const renderTiVo = () => {
      if (!activity || !this.state.channels || !this.state.channel || !device) {
        return <>TheaterTile</>;
      }
      const channel = this.state.channels[this.state.channel];
      return (
        <>
          <span style={{ marginLeft: 4 }}>{device.name}</span>
          <br />
          <div style={{ float: "right", marginTop: 2 }}>
            {this.state.channel} {channel.name}
            <img
              style={{
                marginLeft: 10,
                marginRight: 10,
                height: 24,
                width: "auto",
              }}
              src={channel.logo.URL}
              alt={channel.afffiliate}
            />
          </div>
        </>
      );
    };

    const renderDenon = () => {
      if (!this.avr) {
        return <div>Theater</div>;
      }

      const renderPower = () => {
        return (
          <>
            {this.avr.title} {this.state.avrPower ? "ON" : "OFF"}
          </>
        );
      };
      const renderVolume = () => {
        if (this.state.mute) {
          return <>MUTE ON</>;
        } else {
          return <> Volume: {format(this.state.volume)}</>;
        }
      };
      return (
        <div style={{ float: "right", marginRight: 54, marginTop: 2 }}>
          {renderPower()}
          {renderVolume()}
        </div>
      );
    };

    const renderDevice = () => {
      return renderTiVo();
    };

    return (
      <span>
        <CgScreen
          style={{
            marginTop: -4,
            marginLeft: 6,
            marginRight: 8,
            fontSize: 24,
          }}
        />
        {renderActivity()}
        {renderDevice()}
        {renderDenon()}
      </span>
    );
  }
}

//
export default TheaterTile;
