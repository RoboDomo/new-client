import React from "react";

import { CgScreen } from "react-icons/cg";

import Theater from "lib/Theater";

import { data as Config } from "lib/Config";

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

    let theater = false;
    for (const t of Config.theaters) {
      if (t.title === this.title) {
        theater = t;
        break;
      }
    }
    if (!theater) {
      return;
    }

    this.config = theater;
    this.theater = new Theater(this.config);

    this.devices = this.theater.devices;
    this.activities = this.theater.activities;


    this.state = {};
  }

  componentDidMount() {
    this.theater.on("statechange", (newState) => {
      this.setState(newState);
    });
    this.theater.subscribe();
  }

  componentWillUnmount() {
    this.theater.unsubscribe();
  }

  render() {
    const activity = this.state.currentActivity;
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
    const device = this.state.currentDevice;

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
