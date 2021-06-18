import React from "react";
import { Row, Col, ButtonGroup, ProgressBar } from "react-bootstrap";

import Marquee from "Common/Marquee";
import AppleTVTransport from "Tablet/Transport/AppleTVTransport";

const formatTime = (time) => {
  const hours = parseInt(time / 3600, 10);
  const minutes = parseInt((time % 3600) / 60, 10);
  const seconds = parseInt(time % 60, 10);
  return `${hours ? hours + ":" : ""}${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
};

class NowPlaying extends React.Component {
  renderInfo(info) {
    return (
      <div style={{ fontFamily: "mono", whiteSpace: "pre" }}>
        {JSON.stringify(info, null, 2)}
      </div>
    );
  }
  renderAppleTV(info) {
    if (!info) {
      return null;
    }
    const getInfo = (info) => {
      // const info = this.state.info;
      if (info == null) {
        return null;
      }
      if (info.total_time !== null) {
        return info;
      }
      const now = new Date(),
        minutes = now.getMinutes();

      info.total_time = minutes > 30 ? 60 * 60 : 30 * 60;
      info.position = 60 * minutes + now.getSeconds();
      return info;
    };
    info = getInfo(info);
    const renderTitle = (title) => {
      if (title.length > 32) {
        return (
          <Marquee
            height={64}
            speed={30}
            behavior="alternate"
            text={title}
          ></Marquee>
        );
      } else {
        return <div style={{ height: 64, fontWeight: "bold" }}>{title}</div>;
      }
    };
    return (
      <>
        <div style={{ textAlign: "center" }}>
          {/* <h1>Apple TV</h1> */}
          <h1 style={{ fontSize: 60 }}>
            {renderTitle(info.title || info.app)}
            {/* {info.app} - {info.title} */}
          </h1>
          <div style={{ height: 420, marginTop: 20 }}>
            <div
              style={{
                float: "left",
                marginTop: 80,
                fontSize: 80,
                width: 280,
                marginLeft: 10,
              }}
            >
              {formatTime(info.position)}
            </div>

            <div
              style={{
                float: "left",
                width: 1024 - 600,
                height: 400,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundImage: `url(data:image;base64,${info.artwork})`,
              }}
              onClick={() => {
                console.log('click!');
                if (this.props.exit) {
                  this.props.exit();
                }
              }}
            />
            {/* <img */}
            {/*   style={{ */}
            {/*     marginTop: 'auto', */}
            {/*     background: "transparent", */}
            {/*     /\* transform: 'scale(1.5)', *\/ */}
            {/*     width: 'auto', */}
            {/*     maxWidth: 380, */}
            {/*     height: 400, */}
            {/*     marginBottom: 10, */}
            {/*   }} */}
            {/*   alt="artwork" */}
            {/*   src={`data:image;base64,${info.artwork}`} */}
            {/* /> */}

            <div
              style={{
                float: "right",
                fontSize: 80,
                marginTop: 80,
                width: 280,
                marginRight: 20,
              }}
            >
              {info.total_time != null ? "-" : ""}
              {info.total_time != null
                ? formatTime(info.total_time - info.position)
                : ""}
            </div>
          </div>

          <div style={{ paddingLeft: 24, width: "98%" }}>
            <ProgressBar
              variant={
                info.deviceState.toLowerCase() === "playing"
                  ? "success"
                  : "danger"
              }
              animated
              style={{ height: 50, width: "100%" }}
              now={
                info.total_time != null
                  ? (info.position / info.total_time) * 100
                  : 100
              }
            />
          </div>
          <h2>{info.deviceState}</h2>
        </div>
      </>
    );
  }

  render() {
    const s = this.props.pstate;
    if (!s.currentDevice || !s.currentDevice.info) {
      return null;
    }
    // console.log("pstate", s);
    // console.log(s.appletv.info);
    return (
      <>
        {this.renderAppleTV(s.currentDevice.info)}
        <AppleTVTransport device={s.appletv} />
      </>
    );
  }
}

//
export default NowPlaying;
