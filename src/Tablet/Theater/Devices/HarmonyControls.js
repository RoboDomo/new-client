import React from "react";
import { Row, Col, ButtonGroup, Button } from "react-bootstrap";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
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

class HarmonyControls extends React.Component {
  constructor(props) {
    super(props);
    console.log("Harmony", props.hub);
    this.hub = props.hub;

    this.state = {};
    //
    this.handleHarmonyMessage = this.handleHarmonyMessage.bind(this);
  }

  handleHarmonyMessage(topic, message) {
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

    const key = topic.split("/").pop();
    if (key === "currentActivity") {
      const { activities } = this.state;
      if (activities && activities[message]) {
        const current = activities[message],
          controlGroup = current.controlGroup,
          c = {};

        for (const group of controlGroup) {
          remap(c, group);
        }
        this.setState({
          [key]: message,
          commands: c,
        });
      } else {
        this.setState({
          [key]: message,
        });
      }
    } else {
      this.setState({
        [key]: message,
      });
    }
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

  render() {
    const { commands } = this.state;
    if (commands === undefined) {
      return null;
    }

    const renderRokuButtons = () => {
      if (!commands.Sleep && !commands.Options) {
        return null;
      }

      const style = { marginTop: 4 };
      const makeButton = (command, variant, text) => {
        return command ? (
          <Button
            variant={variant}
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </Button>
        ) : (
          <Button variant="none" />
        );
      };

      return (
        <div style={style}>
          <Row>
            <ButtonGroup>
              {makeButton(commands.Back)}
              {makeButton(commands.Home, "primary")}
              {makeButton(commands.Options)}
            </ButtonGroup>
          </Row>
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
          <Button
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </Button>
        ) : (
          <Button variant="none" />
        );
      };

      return (
        <div style={style}>
          <Row>
            <ButtonGroup>
              {makeButton(commands.GameX)}
              {makeButton(commands.GameY)}
              {makeButton(commands.XboxGuide)}
              {makeButton(commands.GameA)}
              {makeButton(commands.GameB)}
            </ButtonGroup>
          </Row>
          <Row>
            <ButtonGroup>
              {makeButton(commands.Menu)}
              {makeButton(commands.Info)}
              {makeButton(commands.Live)}
              {makeButton(commands.XboxGuide, "Guide")}
              {makeButton(commands.Eject)}
            </ButtonGroup>
          </Row>
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
          <Button>{commands.Back}</Button>
          <Button variant="primary">{commands.Home}</Button>
          <Button>{commands.Menu}</Button>
        </ButtonGroup>
      );
    };

    const renderTiVoButtons = () => {
      return null;
    };

    const renderColoredButtons = () => {
      if (!commands.Yellow) {
        return null;
      }

      return (
        <ButtonGroup>
          <Button variant="warning">{commands.Yellow}</Button>
          <Button variant="info">{commands.Blue}</Button>
          <Button variant="danger">{commands.Red}</Button>
          <Button variant="success">{commands.Green}</Button>
        </ButtonGroup>
      );
    };

    const renderABCDButtons = () => {
      if (!commands.A) {
        return null;
      }

      return (
        <ButtonGroup>
          <Button variant="warning">{commands.A}</Button>
          <Button variant="primary">{commands.B}</Button>
          <Button variant="danger">{commands.C}</Button>
          <Button variant="successg">{commands.D}</Button>
        </ButtonGroup>
      );
    };

    const renderJoystickButtons = () => {
      if (!commands.DirectionUp) {
        return null;
      }

      const style = { marginTop: 4 };

      const makeButton = (command, variant, text) => {
        return command ? (
          <Button
            variant={variant}
            onClick={() => {
              /* dispatch({ type: "send_key", value: command }); */
            }}
          >
            {text || command.name}
          </Button>
        ) : (
          <Button variant="none" />
        );
      };

      return (
        <div>
          <Row style={style}>
            <ButtonGroup>
              {makeButton(null)}
              {makeButton(commands.DirectionUp, undefined, <FaChevronUp />)}
              {makeButton(commands.ChannelUp)}
            </ButtonGroup>
          </Row>
          <Row style={style}>
            <ButtonGroup>
              {makeButton(commands.DirectionLeft, undefined, <FaChevronLeft />)}
              {makeButton(commands.Select, "info")}
              {makeButton(
                commands.DirectionRight,
                undefined,
                <FaChevronRight />
              )}
            </ButtonGroup>
          </Row>
          <Row style={style}>
            <ButtonGroup>
              {makeButton(null)}
              {makeButton(commands.DirectionDown, undefined, <FaChevronDown />)}
              {makeButton(commands.ChannelDown)}
            </ButtonGroup>
          </Row>
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
          <Button
            onClick={() => {
              /* dispatch({ type: "send_key", command: command }); */
            }}
          >
            {text || command.name.replace("Number", "")}
          </Button>
        ) : (
          <Button variant="none" />
        );
      };

      return (
        <Row style={style}>
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
        </Row>
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
          <Button
            mini
            variant={command.name === "Record" ? "danger" : undefined}
            onClick={() => {
              /* dispatch({ type: "send_key", command: command }); */
            }}
          >
            {text || command.name}
          </Button>
        );
      };

      return (
        <div style={style}>
          <Row>
            <ButtonGroup>
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
          </Row>
        </div>
      );
    };

    return (
      <>
        {renderRokuButtons()}
        {renderXBoxButtons()}
        {renderAppleTVButtons()}
        {renderTiVoButtons()}
        {renderColoredButtons()}
        {renderABCDButtons()}
        {renderJoystickButtons()}
        {renderNumberButtons()}
        {renderTransportButtons()}
      </>
    );
  }
}

//
export default HarmonyControls;
