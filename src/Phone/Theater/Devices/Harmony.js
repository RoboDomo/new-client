import React from "react";
import { ButtonGroup } from "react-bootstrap";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaBackward,
  FaFastBackward,
  FaPause,
  FaPlay,
  FaStop,
  FaStepForward,
  FaForward,
  FaFastForward,
  FaDotCircle,
} from "react-icons/fa";

import MQTT from "lib/MQTT";
import MQTTButton from "Common/MQTTButton";

const style = {
  row: {
    overflow: "hidden",
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const remap = (o, controlGroup) => {
  if (controlGroup && controlGroup.function) {
    for (const control of controlGroup.function) {
      o[control.name] = control;
      try {
        control.action = JSON.parse(control.action);
      } catch (e) {}
    }
  }
  return o;
};

class Harmony extends React.Component {
  constructor(props) {
    super(props);
    console.log("Harmony", props.hub);
    this.hub = props.hub;

    this.state = {};
    //
    this.handleHarmonyMessage = this.handleHarmonyMessage.bind(this);
  }

  handleHarmonyMessage(topic, message) {
    const key = topic.split("/").pop();
    this.setState({
      [key]: message,
    });
  }

  componentDidMount() {
    MQTT.subscribe(
      `harmony/${this.hub.device}/status/activities`,
      this.handleHarmonyMessage
    );
    MQTT.subscribe(
      `harmony/${this.hub.device}/status/devices`,
      this.handleHarmonyMessage
    );
    MQTT.subscribe(
      `harmony/${this.hub.device}/status/currentActivity`,
      this.handleHarmonyMessage
    );
    MQTT.subscribe(
      `harmony/${this.hub.device}/status/startingActivity`,
      this.handleHarmonyMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `harmony/${this.hub.device}/status/activities`,
      this.handleHarmonyMessage
    );
    MQTT.unsubscribe(
      `harmony/${this.hub.device}/status/devices`,
      this.handleHarmonyMessage
    );
    MQTT.unsubscribe(
      `harmony/${this.hub.device}/status/currentActivity`,
      this.handleHarmonyMessage
    );
    MQTT.unsubscribe(
      `harmony/${this.hub.device}/status/startingActivity`,
      this.handleHarmonyMessage
    );
  }

  // render
  render() {
    const {
      activities,
      devices,
      currentActivity,
      startingActivity,
    } = this.state;

    if (activities && startingActivity) {
      return <h1>Starting {activities[startingActivity].label}...</h1>;
    }

    if (!activities || !devices || !currentActivity) {
      return null;
    }
    let commands = {};
    if (activities && devices && currentActivity) {
      const current = activities[currentActivity];
      if (!current) {
        return null;
      }
      const controlGroup = current.controlGroup;

      for (const group of controlGroup) {
        remap(commands, group);
      }
    }

    if (commands === undefined) {
      console.log("no commands!", commands);
      return null;
    }

    const renderRokuButtons = () => {
      if (!commands.Sleep && !commands.Options) {
        return null;
      }

      const style = { marginTop: 4 };
      const makeButton = (command, variant, text) => {
        return command ? (
          <MQTTButton
            variant={variant}
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </MQTTButton>
        ) : (
          <MQTTButton variant="none" />
        );
      };

      return (
        <div style={style}>
          <div>
            <ButtonGroup>
              {makeButton(commands.Back)}
              {makeButton(commands.Home, "primary")}
              {makeButton(commands.Options)}
            </ButtonGroup>
          </div>
        </div>
      );
    };

    const renderXBoxButtons = () => {
      if (!commands.GameX) {
        return null;
      }

      const style = { marginTop: 4 };
      const makeButton = (command, text) => {
        return command ? (
          <MQTTButton
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </MQTTButton>
        ) : (
          <MQTTButton variant="none" />
        );
      };

      return (
        <div style={style}>
          <div>
            <ButtonGroup>
              {makeButton(commands.GameX)}
              {makeButton(commands.GameY)}
              {makeButton(commands.XboxGuide)}
              {makeButton(commands.GameA)}
              {makeButton(commands.GameB)}
            </ButtonGroup>
          </div>
          <div>
            <ButtonGroup>
              {makeButton(commands.Menu)}
              {makeButton(commands.Info)}
              {makeButton(commands.Live)}
              {makeButton(commands.XboxGuide, "Guide")}
              {makeButton(commands.Eject)}
            </ButtonGroup>
          </div>
        </div>
      );
    };

    const renderAppleTVButtons = () => {
      const isAppleTV = (commands) => {
        return (
          commands &&
          commands.Back &&
          commands.Home &&
          commands.Menu &&
          !commands.Eject
        );
      };

      if (!isAppleTV(commands)) {
        return null;
      }

      //send_key, command
      return (
        <ButtonGroup>
          <MQTTButton>{commands.Back}</MQTTButton>
          <MQTTButton variant="primary">{commands.Home}</MQTTButton>
          <MQTTButton>{commands.Menu}</MQTTButton>
        </ButtonGroup>
      );
    };

    const renderTiVoButtons = () => {
      // render JSX for button
      const makeButton = (command, variant, text) => {
        return command ? (
          <MQTTButton
            variant={variant}
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </MQTTButton>
        ) : (
          <MQTTButton variant="none" />
        );
      };

      return (
        <div>
          <div style={style.row}>
            <ButtonGroup style={{ margin: "auto" }}>
              {/* {makeButton(commands.Back)} */}
              {makeButton(commands.Live)}
              {makeButton(commands.TiVo, "primary")}
              {makeButton(commands.Guide)}
              {makeButton(commands.Info)}
            </ButtonGroup>
          </div>
          <div>
            <ButtonGroup style={{ margin: "auto" }}>
              {makeButton(commands.ThumbsUp, "success", <FaThumbsUp />)}
              {makeButton(commands.ThumbsDown, "danger", <FaThumbsDown />)}
            </ButtonGroup>
          </div>
        </div>
      );
    };

    const renderColoredButtons = () => {
      if (!commands.Yellow) {
        return null;
      }
      console.log("commands", commands);
      return (
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton variant="warning">{commands.Yellow.label}</MQTTButton>
            <MQTTButton variant="info">{commands.Blue.label}</MQTTButton>
            <MQTTButton variant="danger">{commands.Red.label}</MQTTButton>
            <MQTTButton variant="success">{commands.Green.label}</MQTTButton>
          </ButtonGroup>
        </div>
      );
    };

    const renderABCDButtons = () => {
      if (!commands.A) {
        return null;
      }

      return (
        <div style={style.row}>
          <ButtonGroup>
            <MQTTButton variant="warning">{commands.A.label}</MQTTButton>
            <MQTTButton variant="primary">{commands.B.label}</MQTTButton>
            <MQTTButton variant="danger">{commands.C.label}</MQTTButton>
            <MQTTButton variant="successg">{commands.D.label}</MQTTButton>
          </ButtonGroup>
        </div>
      );
    };

    const renderJoystickButtons = () => {
      if (!commands.DirectionUp) {
        return null;
      }

      const style = { marginTop: 4 };

      const makeButton = (command, variant, text) => {
        return command ? (
          <MQTTButton
            variant={variant}
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </MQTTButton>
        ) : (
          <MQTTButton variant="none" />
        );
      };

      return (
        <div>
          <div style={style}>
            <ButtonGroup>
              {makeButton(null)}
              {makeButton(commands.DirectionUp, undefined, <FaChevronUp />)}
              {makeButton(commands.ChannelUp, "info", "+")}
            </ButtonGroup>
          </div>
          <div style={style}>
            <ButtonGroup>
              {makeButton(commands.DirectionLeft, undefined, <FaChevronLeft />)}
              {makeButton(commands.Select, "info")}
              {makeButton(
                commands.DirectionRight,
                undefined,
                <FaChevronRight />
              )}
            </ButtonGroup>
          </div>
          <div style={style}>
            <ButtonGroup>
              {makeButton(null)}
              {makeButton(commands.DirectionDown, undefined, <FaChevronDown />)}
              {makeButton(commands.ChannelDown, "info", "-")}
            </ButtonGroup>
          </div>
        </div>
      );
    };

    const renderNumberButtons = () => {
      if (!commands.Number1) {
        return null;
      }

      const style = { marginTop: 4 };

      const makeButton = (command, text) => {
        return command ? (
          <MQTTButton
            onClick={() => {
              /* dispatch({ type: "send_key", command: command }); */
            }}
          >
            {text || command.name.replace("Number", "")}
          </MQTTButton>
        ) : (
          <MQTTButton variant="none" />
        );
      };

      return (
        <div style={style}>
          <ButtonGroup>
            {makeButton(commands.Number1)}
            {makeButton(commands.Number2)}
            {makeButton(commands.Number3)}
          </ButtonGroup>
          <br />
          <ButtonGroup>
            {makeButton(commands.Number4)}
            {makeButton(commands.Number5)}
            {makeButton(commands.Number6)}
          </ButtonGroup>
          <br />
          <ButtonGroup>
            {makeButton(commands.Number7)}
            {makeButton(commands.Number8)}
            {makeButton(commands.Number9)}
          </ButtonGroup>
          <br />
          <ButtonGroup>
            {makeButton(commands.Clear)}
            {makeButton(commands.Number0)}
            {makeButton(commands.NumberEnter || commands.Dot)}
          </ButtonGroup>
        </div>
      );
    };

    const renderTransportButtons = () => {
      if (!commands.Pause) {
        return null;
      }

      const style = { marginTop: 4 };
      const makeButton = (command, text) => {
        if (!command) {
          return null;
        }
        return (
          <MQTTButton
            mini
            variant={command.name === "Record" ? "danger" : undefined}
            onClick={() => {
              /* dispatch({ type: "send_key", command: command }); */
            }}
          >
            {text || command.name}
          </MQTTButton>
        );
      };

      return (
        <div style={style}>
          <div>
            <ButtonGroup
              className="fixed-bottom"
              style={{ margin: 0, padding: 0 }}
            >
              {makeButton(commands.SkipBackward, <FaFastBackward />)}
              {makeButton(commands.Rewind, <FaBackward />)}
              {makeButton(commands.Pause, <FaPause />)}
              {makeButton(commands.Stop, <FaStop />)}
              {makeButton(commands.Play, <FaPlay />)}
              {makeButton(commands.FrameAdvance, <FaStepForward />)}
              {makeButton(commands.FastForward, <FaForward />)}
              {makeButton(commands.SkipForward, <FaFastForward />)}
              {makeButton(commands.Record, <FaDotCircle />)}
            </ButtonGroup>
          </div>
        </div>
      );
    };

    console.log(activities[currentActivity]);
        // <h4>{currentActivity.Name}</h4>
    return (
      <div style={{ textAlign: "center", marginLeft: 0 }}>
        <h4>{activities[currentActivity].label}</h4>
        {renderRokuButtons()}
        {renderXBoxButtons()}
        {renderAppleTVButtons()}
        {renderTiVoButtons()}
        {renderColoredButtons()}
        {renderABCDButtons()}
        {renderJoystickButtons()}
        {renderNumberButtons()}
        {renderTransportButtons()}
      </div>
    );
  }
}

//
export default Harmony;
